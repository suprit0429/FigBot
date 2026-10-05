"""
SQLite persistence layer for FigBot assistant and document metadata.

Uses Python's built-in sqlite3 — no new dependencies.
WAL journal mode enables concurrent reads while an upload is in progress.
"""

import sqlite3
import threading
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

# Database file lives alongside the data/ directory
DB_PATH = Path(__file__).parent.parent / "data" / "figbot.db"

# Per-thread connection (sqlite3 connections are not thread-safe to share)
_local = threading.local()


def _get_conn() -> sqlite3.Connection:
    if not hasattr(_local, "conn") or _local.conn is None:
        DB_PATH.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")   # allow concurrent reads
        conn.execute("PRAGMA foreign_keys=ON")
        _local.conn = conn
    return _local.conn


@contextmanager
def get_db():
    """Yield a connection and auto-commit or rollback."""
    conn = _get_conn()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise


def init_db():
    """Create tables if they do not already exist (idempotent)."""
    with get_db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS assistants (
                id          TEXT PRIMARY KEY,
                status      TEXT NOT NULL DEFAULT 'empty',
                created_at  TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS documents (
                id               TEXT PRIMARY KEY,
                assistant_id     TEXT NOT NULL,
                filename         TEXT NOT NULL,
                content_hash     TEXT NOT NULL,
                upload_timestamp TEXT NOT NULL,
                status           TEXT NOT NULL DEFAULT 'processing',
                pages            INTEGER DEFAULT 0,
                chunks           INTEGER DEFAULT 0,
                error_message    TEXT,
                FOREIGN KEY (assistant_id) REFERENCES assistants(id)
                    ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_docs_assistant
                ON documents(assistant_id);

            CREATE INDEX IF NOT EXISTS idx_docs_hash
                ON documents(assistant_id, content_hash);
        """)


# ── Assistants ─────────────────────────────────────────────────────────────


def create_assistant(assistant_id: str) -> dict:
    now = datetime.now(timezone.utc).isoformat()
    with get_db() as conn:
        conn.execute(
            "INSERT INTO assistants (id, status, created_at) VALUES (?, ?, ?)",
            (assistant_id, "empty", now),
        )
    return {"id": assistant_id, "status": "empty", "created_at": now}


def get_assistant(assistant_id: str) -> dict | None:
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM assistants WHERE id = ?", (assistant_id,)
        ).fetchone()
    return dict(row) if row else None


def get_all_assistants() -> list[dict]:
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM assistants ORDER BY created_at DESC"
        ).fetchall()
    return [dict(r) for r in rows]


def update_assistant_status(assistant_id: str, status: str):
    with get_db() as conn:
        conn.execute(
            "UPDATE assistants SET status = ? WHERE id = ?",
            (status, assistant_id),
        )


def delete_assistant_record(assistant_id: str):
    """Delete the assistant row (cascades to its documents)."""
    with get_db() as conn:
        conn.execute("DELETE FROM assistants WHERE id = ?", (assistant_id,))


# ── Documents ──────────────────────────────────────────────────────────────


def create_document(
    doc_id: str,
    assistant_id: str,
    filename: str,
    content_hash: str,
) -> dict:
    now = datetime.now(timezone.utc).isoformat()
    with get_db() as conn:
        conn.execute(
            """INSERT INTO documents
               (id, assistant_id, filename, content_hash, upload_timestamp, status)
               VALUES (?, ?, ?, ?, ?, 'processing')""",
            (doc_id, assistant_id, filename, content_hash, now),
        )
    return {
        "id": doc_id,
        "assistant_id": assistant_id,
        "filename": filename,
        "content_hash": content_hash,
        "upload_timestamp": now,
        "status": "processing",
        "pages": 0,
        "chunks": 0,
        "error_message": None,
    }


def get_document(doc_id: str) -> dict | None:
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM documents WHERE id = ?", (doc_id,)
        ).fetchone()
    return dict(row) if row else None


def get_documents(assistant_id: str) -> list[dict]:
    """Return all documents for an assistant (all statuses)."""
    with get_db() as conn:
        rows = conn.execute(
            """SELECT * FROM documents WHERE assistant_id = ?
               ORDER BY upload_timestamp ASC""",
            (assistant_id,),
        ).fetchall()
    return [dict(r) for r in rows]


def get_ready_documents(assistant_id: str) -> list[dict]:
    """Return only successfully processed documents."""
    with get_db() as conn:
        rows = conn.execute(
            """SELECT * FROM documents
               WHERE assistant_id = ? AND status = 'ready'
               ORDER BY upload_timestamp ASC""",
            (assistant_id,),
        ).fetchall()
    return [dict(r) for r in rows]


def update_document_status(
    doc_id: str,
    status: str,
    pages: int | None = None,
    chunks: int | None = None,
    error_message: str | None = None,
):
    with get_db() as conn:
        conn.execute(
            """UPDATE documents
               SET status        = ?,
                   pages         = COALESCE(?, pages),
                   chunks        = COALESCE(?, chunks),
                   error_message = ?
               WHERE id = ?""",
            (status, pages, chunks, error_message, doc_id),
        )


def delete_document_record(doc_id: str):
    with get_db() as conn:
        conn.execute("DELETE FROM documents WHERE id = ?", (doc_id,))


def find_document_by_hash(assistant_id: str, content_hash: str) -> dict | None:
    """Detect duplicate uploads for the same assistant by content hash."""
    with get_db() as conn:
        row = conn.execute(
            """SELECT * FROM documents
               WHERE assistant_id = ? AND content_hash = ?""",
            (assistant_id, content_hash),
        ).fetchone()
    return dict(row) if row else None
