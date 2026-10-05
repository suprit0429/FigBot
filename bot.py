"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                     FigBot — RAG Pipeline (Terminal)                         ║
║              No-Code AI Assistant — Core AI Backend Demo                     ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  PIPELINE (step by step):                                                    ║
║                                                                              ║
║  STEP 1 — Load PDF           : PyPDFLoader                                   ║
║  STEP 2 — Chunk Documents    : RecursiveCharacterTextSplitter                ║
║  STEP 3 — Generate Embeddings: HuggingFace all-MiniLM-L6-v2 (local, free)    ║
║  STEP 4 — Build Vector Store : FAISS (in-memory)                             ║
║  STEP 5 — Hybrid Retriever   : BM25 (40%) + FAISS MMR (60%)                  ║
║  STEP 6 — RAG Chain          : Prompt + Groq llama-3.3-70b + Parser          ║
║  STEP 7 — Chat Loop          : Ask questions until you type 'exit'           ║
║                                                                              ║
║  Run with:  python bot.py                                                    ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

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

def chunk_documents(documents: list, chunk_size: int = 1000, chunk_overlap: int = 500) -> list:
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

def build_vector_store(chunks: list) -> FAISS:
    """
    Convert chunks into vector embeddings and build an in-memory FAISS index.

    Embedding model: sentence-transformers/all-MiniLM-L6-v2
      - Free, runs 100% locally (no API key needed).
      - 384-dimensional vectors.
      - Downloads ~80MB on first run, then cached locally.

    FAISS (Facebook AI Similarity Search):
      - Stores all chunk vectors in memory.
      - Enables fast nearest-neighbour search by semantic similarity.

    Args:
        chunks (list): Chunked Document objects from chunk_documents().

    Returns:
        FAISS: In-memory vector store.
    """
    print(f"[STEP 3] Loading embedding model (first run downloads ~80MB)...")
    embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    print(f"[STEP 4] Embedding {len(chunks)} chunk(s) and building FAISS index...")
    vector_store = FAISS.from_documents(chunks, embedding)
    print(f"[STEP 4] FAISS index built ({len(chunks)} chunks indexed).")
    return vector_store


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
        formatted.append(f"{doc.page_content}")
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


# ==============================================================================
# STEP 7 — MAIN: WIRE EVERYTHING & RUN CHAT LOOP
# ==============================================================================

def main():
    """
    Entry point — runs the full pipeline and starts an interactive chat loop.

    Session flow:
      1. User provides a PDF file path.
      2. PDF loaded -> chunked -> embedded -> FAISS index built  (ONCE)
      3. Hybrid retriever (BM25 + FAISS) created                (ONCE)
      4. RAG chain assembled                                     (ONCE)
      5. User asks questions in a loop until they type 'exit'.
    """
    print("\n" + "=" * 62)
    print("         FigBot RAG Pipeline — Terminal Demo")
    print("=" * 62)

    # ── STEP 1: Get PDF path from user ────────────────────────────
    file_path = input("\nEnter the path to your PDF file: ").strip()
    try:
        documents = load_pdf(file_path)
    except (FileNotFoundError, ValueError) as e:
        print(f"[ERROR] {e}")
        return

    # ── STEP 2: Chunk ─────────────────────────────────────────────
    chunks = chunk_documents(documents)

    # ── STEPS 3 + 4: Embed + Build FAISS ─────────────────────────
    vector_store = build_vector_store(chunks)

    # ── STEP 5: Build Hybrid Retriever ───────────────────────────
    retriever = build_retriever(chunks, vector_store)

    # ── STEP 6: Assemble RAG Chain ───────────────────────────────
    chain = build_rag_chain(retriever)

    print("\n" + "=" * 62)
    print("  Bot is ready! Ask anything about your document.")
    print("  Type 'exit' to end the session.")
    print("=" * 62)

    # ── STEP 7: Interactive Chat Loop ────────────────────────────
    while True:
        question = input("\nYou: ").strip()

        if not question:
            continue

        if question.lower() in ("exit", "quit"):
            print("\nGoodbye!")
            break

        try:
            print("\nBot: ", end="", flush=True)
            answer = chain.invoke(question)
            print(answer)
            print("\n" + "-" * 62)
        except Exception as e:
            print(f"[ERROR] {e}")


if __name__ == "__main__":
    main()
