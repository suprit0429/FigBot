"""
FigBot AI Backend — Phase 2
Persistent, assistant-specific knowledge bases with multi-PDF support.
"""

import asyncio
import hashlib
import logging
import shutil
import threading
from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import database as db
import storage as st
from rag_pipeline import (
    build_rag_chain,
    build_retriever,
    build_vector_store,
    chunk_documents,
    get_embeddings,
    load_pdf,
    merge_chunks_into_store,
    rebuild_index_from_files,
)
from storage import get_all_chunks_from_store

# ─────────────────────────────────────────────────────────────────────────────
# Logging
# ─────────────────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("figbot")

# ─────────────────────────────────────────────────────────────────────────────
# App
# ─────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="FigBot AI Backend",
    description="RAG-based AI Assistant Backend — Phase 2",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # Restrict to specific origins in production
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Paths
# ─────────────────────────────────────────────────────────────────────────────

BASE_DIR = Path(__file__).parent.parent  # → Figbot/

# ─────────────────────────────────────────────────────────────────────────────
# In-memory runtime state
#
# assistants dict holds the "hot" per-assistant runtime objects:
#   {
#     assistant_id: {
#       "rag_chain":    Runnable | None,   ← rebuilt from FAISS on lazy load
#       "vector_store": FAISS    | None,
#       "status":       str,               ← mirrors DB value in memory
#       "lock":         threading.Lock,    ← serialises uploads/deletes
#     }
#   }
#
# The dict is populated from SQLite on startup and kept in sync on writes.
# It is NOT a source of truth — SQLite is.
# ─────────────────────────────────────────────────────────────────────────────

assistants: dict = {}

# Guards the assistants dict itself from concurrent creation races
_assistants_lock = threading.Lock()


def _get_lock(assistant_id: str) -> threading.Lock:
    """Return the per-assistant lock, creating it if it does not exist."""
    with _assistants_lock:
        if assistant_id not in assistants:
            raise KeyError(assistant_id)
        if "lock" not in assistants[assistant_id]:
            assistants[assistant_id]["lock"] = threading.Lock()
        return assistants[assistant_id]["lock"]


# ─────────────────────────────────────────────────────────────────────────────
# Lazy loading
# ─────────────────────────────────────────────────────────────────────────────

def _load_assistant_into_memory(assistant_id: str):
    """
    Load a persisted FAISS index and rebuild the RAG chain for an assistant
    that has status='ready' but no rag_chain in memory (e.g. after restart).

    Must be called while the per-assistant lock is held.
    """
    entry = assistants[assistant_id]
    if entry["rag_chain"] is not None:
        return  # Already loaded

    embeddings = get_embeddings()
    vector_store = st.load_index(assistant_id, embeddings)

    if vector_store is None:
        logger.warning(
            "Index missing for assistant %s — resetting to 'error'", assistant_id
        )
        entry["status"] = "error"
        db.update_assistant_status(assistant_id, "error")
        return

    all_chunks = get_all_chunks_from_store(vector_store)
    retriever  = build_retriever(all_chunks, vector_store)
    rag_chain  = build_rag_chain(retriever)

    entry["vector_store"] = vector_store
    entry["rag_chain"]    = rag_chain
    logger.info("Lazy-loaded assistant %s from disk (%d chunks)", assistant_id, len(all_chunks))


# ─────────────────────────────────────────────────────────────────────────────
# Startup — restore all assistants from the database
# ─────────────────────────────────────────────────────────────────────────────

@app.on_event("startup")
def startup():
    db.init_db()
    for row in db.get_all_assistants():
        aid = row["id"]
        assistants[aid] = {
            "rag_chain":    None,
            "vector_store": None,
            "status":       row["status"],
            "lock":         threading.Lock(),
        }
    logger.info("Restored %d assistant(s) from database", len(assistants))


# ─────────────────────────────────────────────────────────────────────────────
# Request / Response models
# ─────────────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    question: str


# ─────────────────────────────────────────────────────────────────────────────
# Helper — derive the documents directory for an assistant
# ─────────────────────────────────────────────────────────────────────────────

def _documents_dir(assistant_id: str) -> Path:
    return BASE_DIR / "data" / "assistants" / assistant_id / "documents"


# ═════════════════════════════════════════════════════════════════════════════
# Routes — health
# ═════════════════════════════════════════════════════════════════════════════

@app.get("/")
def root():
    return {"message": "FigBot AI Backend is running", "version": "2.0.0"}


# ═════════════════════════════════════════════════════════════════════════════
# Routes — assistants
# ═════════════════════════════════════════════════════════════════════════════

@app.get("/assistants")
def list_assistants():
    """List all assistants and their current status."""
    return db.get_all_assistants()


@app.post("/assistants")
def create_assistant():
    assistant_id = str(uuid4())

    db.create_assistant(assistant_id)

    with _assistants_lock:
        assistants[assistant_id] = {
            "rag_chain":    None,
            "vector_store": None,
            "status":       "empty",
            "lock":         threading.Lock(),
        }

    logger.info("Created assistant %s", assistant_id)
    return {"assistant_id": assistant_id, "status": "created"}


@app.get("/assistants/{assistant_id}/status")
def get_status(assistant_id: str):
    """Return the current knowledge-base status of an assistant."""
    if assistant_id not in assistants:
        raise HTTPException(status_code=404, detail="Assistant not found.")
    return {
        "assistant_id": assistant_id,
        "status":       assistants[assistant_id]["status"],
    }


@app.delete("/assistants/{assistant_id}/reset")
def reset_assistant(assistant_id: str):
    """
    Clear an assistant's in-memory chain and persistent index.
    PDF files on disk and document metadata are preserved.
    The assistant status is reset to 'empty'.
    """
    if assistant_id not in assistants:
        raise HTTPException(status_code=404, detail="Assistant not found.")

    lock = _get_lock(assistant_id)
    with lock:
        st.delete_index(assistant_id)
        assistants[assistant_id]["rag_chain"]    = None
        assistants[assistant_id]["vector_store"] = None
        assistants[assistant_id]["status"]       = "empty"
        db.update_assistant_status(assistant_id, "empty")

    logger.info("Reset assistant %s", assistant_id)
    return {"assistant_id": assistant_id, "status": "reset"}


# ═════════════════════════════════════════════════════════════════════════════
# Routes — upload (Phase 2: multi-PDF, dedup, merge)
# ═════════════════════════════════════════════════════════════════════════════

def _process_upload(
    assistant_id: str,
    safe_filename: str,
    file_content: bytes,
) -> dict:
    """
    Blocking processing logic run in a thread-pool executor.

    Acquires the per-assistant lock for the duration of disk writes and
    FAISS index updates, preventing concurrent uploads from corrupting the index.
    """
    # ── Duplicate check ───────────────────────────────────────────────────
    content_hash = hashlib.sha256(file_content).hexdigest()
    existing = db.find_document_by_hash(assistant_id, content_hash)
    if existing and existing["status"] == "ready":
        return {
            "message":      "Duplicate document — already indexed.",
            "assistant_id": assistant_id,
            "document_id":  existing["id"],
            "filename":     existing["filename"],
            "pages":        existing["pages"],
            "chunks":       existing["chunks"],
            "status":       "duplicate",
        }

    doc_id = str(uuid4())
    doc_record = db.create_document(doc_id, assistant_id, safe_filename, content_hash)

    documents_dir = _documents_dir(assistant_id)
    documents_dir.mkdir(parents=True, exist_ok=True)
    file_path = documents_dir / safe_filename

    lock = _get_lock(assistant_id)
    with lock:
        # ── Write to disk ─────────────────────────────────────────────────
        # Write to a temp path first so a crash does not leave a partial file.
        tmp_path = file_path.with_suffix(".pdf_tmp")
        try:
            with open(tmp_path, "wb") as fh:
                fh.write(file_content)
            tmp_path.replace(file_path)
        except Exception:
            tmp_path.unlink(missing_ok=True)
            db.update_document_status(doc_id, "error", error_message="Disk write failed")
            raise

        # ── RAG pipeline ──────────────────────────────────────────────────
        assistants[assistant_id]["status"] = "processing"
        db.update_assistant_status(assistant_id, "processing")

        try:
            pages  = load_pdf(str(file_path))
            chunks = chunk_documents(pages)

            embeddings    = get_embeddings()
            existing_store = st.load_index(assistant_id, embeddings)

            if existing_store is None:
                # First document for this assistant
                vector_store = build_vector_store(chunks)
            else:
                # Merge new chunks into the existing index
                vector_store = merge_chunks_into_store(existing_store, chunks)

            # Atomically save updated index
            st.save_index(vector_store, assistant_id)

            # Rebuild the hybrid retriever from the complete index
            all_chunks = get_all_chunks_from_store(vector_store)
            retriever  = build_retriever(all_chunks, vector_store)
            rag_chain  = build_rag_chain(retriever)

            # Update in-memory state
            assistants[assistant_id]["vector_store"] = vector_store
            assistants[assistant_id]["rag_chain"]    = rag_chain
            assistants[assistant_id]["status"]       = "ready"

            # Persist metadata
            db.update_document_status(
                doc_id, "ready",
                pages=len(pages),
                chunks=len(chunks),
            )
            db.update_assistant_status(assistant_id, "ready")

            logger.info(
                "Assistant %s — indexed doc %s (%s): %d pages, %d chunks",
                assistant_id, doc_id, safe_filename, len(pages), len(chunks),
            )
            return {
                "message":      "PDF uploaded and processed successfully.",
                "assistant_id": assistant_id,
                "document_id":  doc_id,
                "filename":     safe_filename,
                "pages":        len(pages),
                "chunks":       len(chunks),
                "status":       "ready",
            }

        except Exception as exc:
            assistants[assistant_id]["status"] = "error"
            db.update_assistant_status(assistant_id, "error")
            db.update_document_status(doc_id, "error", error_message=str(exc))
            logger.exception(
                "Pipeline failed for assistant %s doc %s: %s",
                assistant_id, doc_id, exc,
            )
            raise


@app.post("/assistants/{assistant_id}/upload")
async def upload_pdf(
    assistant_id: str,
    file: UploadFile = File(...),
):
    # ── Guards ────────────────────────────────────────────────────────────
    if assistant_id not in assistants:
        raise HTTPException(status_code=404, detail="Assistant not found.")

    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    safe_filename = Path(file.filename).name

    # ── Read file bytes (async, before entering blocking code) ────────────
    file_content = await file.read()

    if not file_content.startswith(b"%PDF"):
        raise HTTPException(
            status_code=400,
            detail="Uploaded file does not appear to be a valid PDF.",
        )

    logger.info(
        "Received PDF '%s' for assistant %s (%d bytes)",
        safe_filename, assistant_id, len(file_content),
    )

    # ── Hand off heavy processing to a thread-pool worker ─────────────────
    # This keeps the event loop responsive for other requests while the
    # embedding model and FAISS index are being updated.
    loop = asyncio.get_event_loop()
    try:
        result = await loop.run_in_executor(
            None,
            _process_upload,
            assistant_id,
            safe_filename,
            file_content,
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return result


# ═════════════════════════════════════════════════════════════════════════════
# Routes — documents (list + delete)
# ═════════════════════════════════════════════════════════════════════════════

@app.get("/assistants/{assistant_id}/documents")
def list_documents(assistant_id: str):
    """List all documents belonging to an assistant with their processing status."""
    if assistant_id not in assistants:
        raise HTTPException(status_code=404, detail="Assistant not found.")
    return db.get_documents(assistant_id)


@app.delete("/assistants/{assistant_id}/documents/{doc_id}")
def delete_document(assistant_id: str, doc_id: str):
    """
    Delete a document and rebuild the assistant's knowledge base without it.

    Because FAISS does not support in-place chunk removal, we rebuild the
    entire index from the remaining source PDFs.  If the assistant has only
    one document, the index is deleted and the assistant status resets to
    'empty'.

    Deleting a document from the wrong assistant returns 404.
    Repeated DELETE requests for the same doc_id are idempotent (404).
    """
    if assistant_id not in assistants:
        raise HTTPException(status_code=404, detail="Assistant not found.")

    doc = db.get_document(doc_id)
    if doc is None or doc["assistant_id"] != assistant_id:
        raise HTTPException(
            status_code=404,
            detail="Document not found or does not belong to this assistant.",
        )

    lock = _get_lock(assistant_id)
    with lock:
        # Delete the document record first so it's excluded from rebuild
        db.delete_document_record(doc_id)

        # Delete the PDF file from disk
        documents_dir = _documents_dir(assistant_id)
        file_path = documents_dir / doc["filename"]
        try:
            file_path.unlink(missing_ok=True)
        except Exception as exc:
            logger.warning("Could not delete file %s: %s", file_path, exc)

        # Gather remaining ready documents
        remaining = db.get_ready_documents(assistant_id)

        if not remaining:
            # No documents left — clear the index
            st.delete_index(assistant_id)
            assistants[assistant_id]["rag_chain"]    = None
            assistants[assistant_id]["vector_store"] = None
            assistants[assistant_id]["status"]       = "empty"
            db.update_assistant_status(assistant_id, "empty")
            logger.info(
                "Assistant %s has no remaining documents — index cleared", assistant_id
            )
        else:
            # Rebuild index from remaining source PDFs
            remaining_paths = [
                str(documents_dir / r["filename"]) for r in remaining
            ]
            new_store = rebuild_index_from_files(remaining_paths)

            if new_store is None:
                # All remaining files failed to process (edge case)
                st.delete_index(assistant_id)
                assistants[assistant_id]["rag_chain"]    = None
                assistants[assistant_id]["vector_store"] = None
                assistants[assistant_id]["status"]       = "error"
                db.update_assistant_status(assistant_id, "error")
            else:
                st.save_index(new_store, assistant_id)
                all_chunks = get_all_chunks_from_store(new_store)
                retriever  = build_retriever(all_chunks, new_store)
                rag_chain  = build_rag_chain(retriever)

                assistants[assistant_id]["vector_store"] = new_store
                assistants[assistant_id]["rag_chain"]    = rag_chain
                assistants[assistant_id]["status"]       = "ready"
                db.update_assistant_status(assistant_id, "ready")
                logger.info(
                    "Assistant %s — rebuilt index after deleting doc %s (%d docs remaining)",
                    assistant_id, doc_id, len(remaining),
                )

    return {
        "message":      "Document deleted and knowledge base updated.",
        "document_id":  doc_id,
        "assistant_id": assistant_id,
        "remaining_documents": len(remaining) if "remaining" in dir() else 0,
    }


# ═════════════════════════════════════════════════════════════════════════════
# Routes — chat
# ═════════════════════════════════════════════════════════════════════════════

@app.post("/assistants/{assistant_id}/chat")
def chat(assistant_id: str, request: ChatRequest):
    if assistant_id not in assistants:
        raise HTTPException(status_code=404, detail="Assistant not found.")

    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    entry = assistants[assistant_id]

    # Lazy-load FAISS if needed (e.g. after a server restart)
    if entry["status"] == "ready" and entry["rag_chain"] is None:
        lock = _get_lock(assistant_id)
        with lock:
            _load_assistant_into_memory(assistant_id)

    if entry["status"] != "ready":
        raise HTTPException(
            status_code=400,
            detail="Please upload and process a PDF first.",
        )

    try:
        answer = entry["rag_chain"].invoke(request.question)
        logger.info(
            "Assistant %s answered (%d chars)", assistant_id, len(answer)
        )
        return {
            "assistant_id": assistant_id,
            "question":     request.question,
            "answer":       answer,
        }
    except Exception as exc:
        logger.exception("Chat failed for assistant %s: %s", assistant_id, exc)
        raise HTTPException(status_code=500, detail=str(exc))