import os
from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader
from langchain_community.retrievers import BM25Retriever
from langchain_community.vectorstores import FAISS
from langchain_classic.retrievers import EnsembleRetriever
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableLambda, RunnableParallel, RunnablePassthrough
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()


# ==============================================================================
# STEP 1 — LOAD PDF
# ==============================================================================

def load_pdf(file_path: str) -> list:
    """
    Load a PDF and return a list of LangChain Document objects (one per page).

    Args:
        file_path (str): Path to the PDF file.

    Returns:
        list: LangChain Document objects.

    Raises:
        FileNotFoundError: If the file does not exist.
        ValueError: If the file is not a PDF.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    _, ext = os.path.splitext(file_path)
    if ext.lower() != ".pdf":
        raise ValueError(f"Only PDF files are supported. Got: '{ext}'")

    loader = PyPDFLoader(file_path)
    documents = loader.load()
    print(f"[STEP 1] Loaded '{os.path.basename(file_path)}' — {len(documents)} page(s).")
    return documents


# ==============================================================================
# STEP 2 — CHUNK DOCUMENTS
# ==============================================================================

def chunk_documents(documents: list, chunk_size: int = 1500, chunk_overlap: int = 300) -> list:
    """
    Split documents into smaller overlapping chunks for embedding.

    Why chunk?
      - LLMs have a context limit — we can't pass the whole PDF.
      - Smaller chunks allow precise retrieval of only the relevant parts.

    chunk_size=1500   : ~1 paragraph of context per chunk.
    chunk_overlap=300 : 20% overlap so no context is lost at boundaries.
    Separators try in order: paragraph -> line -> sentence -> word -> character.

    Args:
        documents (list): LangChain Document objects from load_pdf().
        chunk_size (int): Max characters per chunk.
        chunk_overlap (int): Overlap between adjacent chunks.

    Returns:
        list: Chunked LangChain Document objects.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        separators=["\n\n", "\n", ".", " ", ""],
    )
    chunks = splitter.split_documents(documents)
    print(f"[STEP 2] Split into {len(chunks)} chunk(s) (size={chunk_size}, overlap={chunk_overlap}).")
    return chunks


# ==============================================================================
# STEP 3 + 4 — GENERATE EMBEDDINGS & BUILD FAISS VECTOR STORE
# ==============================================================================

# Singleton embedding model — loaded once per process to avoid repeated
# ~80 MB weight downloads and slow initialisation on every upload.
_embeddings = None


def get_embeddings() -> HuggingFaceEmbeddings:
    """
    Return the shared HuggingFace embedding model, loading it on first call.

    Thread-safe in practice: model initialisation is idempotent and the GIL
    prevents concurrent writes to the module-level variable.
    """
    global _embeddings
    if _embeddings is None:
        print("[EMBED] Loading embedding model (cached after first call)...")
        _embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
    return _embeddings


def build_vector_store(chunks: list) -> FAISS:
    """
    Convert chunks into vector embeddings and build an in-memory FAISS index.

    Embedding model: sentence-transformers/all-MiniLM-L6-v2
      - Free, runs 100% locally (no API key needed).
      - 384-dimensional vectors.
      - Downloads ~80MB on first run, then cached via get_embeddings().

    FAISS (Facebook AI Similarity Search):
      - Stores all chunk vectors in memory.
      - Enables fast nearest-neighbour search by semantic similarity.

    Args:
        chunks (list): Chunked Document objects from chunk_documents().

    Returns:
        FAISS: In-memory vector store.
    """
    embedding = get_embeddings()
    print(f"[STEP 4] Embedding {len(chunks)} chunk(s) and building FAISS index...")
    vector_store = FAISS.from_documents(chunks, embedding)
    print(f"[STEP 4] FAISS index built ({len(chunks)} chunks indexed).")
    return vector_store


def merge_chunks_into_store(existing_store: FAISS, new_chunks: list) -> FAISS:
    """
    Embed new_chunks and merge them into an existing FAISS store (in-place).

    Used when a second (or subsequent) PDF is uploaded to the same assistant.
    The existing index is extended, not replaced, so previous documents remain
    searchable.  The caller is responsible for saving the updated store.

    Args:
        existing_store (FAISS): The assistant's current vector store.
        new_chunks (list):      Chunks from the newly uploaded document.

    Returns:
        FAISS: The same existing_store object, now containing all chunks.
    """
    embedding = get_embeddings()
    print(f"[MERGE] Embedding {len(new_chunks)} new chunk(s)...")
    new_store = FAISS.from_documents(new_chunks, embedding)
    existing_store.merge_from(new_store)
    print(f"[MERGE] Merged into existing index.")
    return existing_store


def rebuild_index_from_files(file_paths: list[str]) -> FAISS | None:
    """
    Rebuild a FAISS index from scratch by re-processing a list of PDF files.

    Used after a document is deleted: all remaining source PDFs are re-extracted
    and re-embedded.  Files that fail to load are skipped with a warning.

    Args:
        file_paths: Absolute paths to the source PDF files to include.

    Returns:
        FAISS | None: New vector store, or None if no files produced any chunks.
    """
    all_chunks: list = []
    for path in file_paths:
        try:
            docs   = load_pdf(path)
            chunks = chunk_documents(docs)
            all_chunks.extend(chunks)
        except Exception as exc:
            print(f"[REBUILD] Warning — skipped '{path}': {exc}")

    if not all_chunks:
        return None

    return build_vector_store(all_chunks)


# ==============================================================================
# STEP 5 — BUILD HYBRID RETRIEVER (BM25 + FAISS MMR)
# ==============================================================================

def build_retriever(chunks: list, vector_store: FAISS, k: int = 5):
    """
    Build a Hybrid Retriever combining BM25 and FAISS MMR.

    Why hybrid?
      - BM25 (keyword-based): Great for exact word matches, names, dates.
      - FAISS MMR (semantic): Great for meaning-based matches even without
        exact keywords. MMR = Maximal Marginal Relevance ensures diversity
        (no duplicate/redundant chunks in results).
      - Together they cover both keyword and meaning-based queries.

    Weights: BM25=40%, FAISS=60% (semantic understanding prioritized).
    Each retriever fetches k=5 chunks → merged & deduplicated by EnsembleRetriever.

    Args:
        chunks (list): All document chunks (needed for BM25 index).
        vector_store (FAISS): The FAISS vector store.
        k (int): Chunks to fetch per sub-retriever. Default 5.

    Returns:
        EnsembleRetriever: Hybrid retriever ready for the RAG chain.
    """
    # Sparse: keyword-based BM25
    bm25_retriever = BM25Retriever.from_documents(chunks)
    bm25_retriever.k = k

    # Dense: FAISS with MMR for diversity
    faiss_retriever = vector_store.as_retriever(
        search_type="mmr",
        search_kwargs={"k": k, "fetch_k": k * 5},
    )

    # Hybrid: 40% keyword + 60% semantic
    hybrid_retriever = EnsembleRetriever(
        retrievers=[bm25_retriever, faiss_retriever],
        weights=[0.4, 0.6],
    )

    print(f"[STEP 5] Hybrid retriever ready (BM25 40% + FAISS MMR 60%, k={k}).")
    return hybrid_retriever


# ==============================================================================
# STEP 6 — BUILD RAG CHAIN (Prompt + Groq LLM + Output Parser)
# ==============================================================================

RAG_PROMPT = PromptTemplate.from_template("""
You are an intelligent AI assistant.
Answer questions based STRICTLY on the knowledge base provided below.

INSTRUCTIONS:
- Read ALL context chunks carefully before answering.
- Give a thorough, well-structured answer using bullet points or paragraphs.
- Quote or reference specific parts of the document when relevant.
- If the answer is NOT present in the context, say exactly:
  "I do not have the information about this topic."
- Do NOT make up or infer anything beyond what the documents state.

KNOWLEDGE BASE CONTEXT:
{context}

USER QUESTION:
{question}

DETAILED ANSWER:
""")


def format_docs(docs: list) -> str:
    """Format retrieved chunks with numbering so the LLM can reference them clearly."""
    formatted = []
    for i, doc in enumerate(docs, 1):
        page = doc.metadata.get("page", "?")
        formatted.append(f"[Chunk {i} | Page {page}]\n{doc.page_content}")
    return "\n\n" + "─" * 40 + "\n\n".join(formatted)


def build_rag_chain(retriever):
    """
    Assemble the full RAG chain using LangChain Expression Language (LCEL).

    How it works (for every user question):
      1. retriever.invoke(question)  -> fetches top relevant chunks
      2. format_docs(chunks)         -> formats them into a readable context string
      3. RunnablePassthrough()       -> passes the original question unchanged
      4. RAG_PROMPT.format(...)      -> builds the full prompt (context + question)
      5. Groq llama-3.3-70b         -> generates a grounded answer
      6. StrOutputParser()           -> extracts the answer as a plain string

    The chain is STATELESS — call chain.invoke("question") for every query.
    Requires GROQ_API_KEY in your .env file.

    Args:
        retriever: Hybrid retriever from build_retriever().

    Returns:
        Runnable: Compiled LCEL chain.
    """
    model = ChatGroq(model="openai/gpt-oss-120b")

    rag_chain = (
        RunnableParallel({
            "context":  retriever | RunnableLambda(format_docs),
            "question": RunnablePassthrough(),
        })
        | RAG_PROMPT
        | model
        | StrOutputParser()
    )

    print("[STEP 6] RAG chain assembled and ready.")
    return rag_chain