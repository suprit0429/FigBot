"""
FAISS index persistence for FigBot.

Design:
  Each assistant gets its own index directory:
    data/assistants/{uuid}/index/
      index.faiss   ← FAISS flat binary
      index.pkl     ← LangChain InMemoryDocstore (pickle)

Security note:
  FAISS.load_local() uses pickle internally via LangChain's InMemoryDocstore.
  We mitigate deserialization risk by:
    - Only loading from application-controlled directories rooted at DATA_DIR.
    - Assistant IDs are server-generated UUIDs — never accepted from clients as
      filesystem paths.
    - allow_dangerous_deserialization=True is a LangChain API requirement and is
      intentional here; callers must NOT expose index paths to untrusted clients.

  Do NOT pass client-supplied paths to load_index(). Always use the assistant_id
  to derive the path server-side.
"""

import logging
import shutil
from pathlib import Path

from langchain_community.vectorstores import FAISS

logger = logging.getLogger("figbot.storage")

DATA_DIR = Path(__file__).parent.parent / "data"


def get_index_dir(assistant_id: str) -> Path:
    """Return the canonical FAISS index directory for an assistant.
    The path is always derived server-side from a UUID — never from user input."""
    return DATA_DIR / "assistants" / assistant_id / "index"


def index_exists(assistant_id: str) -> bool:
    """True only when both FAISS files are present (not just the directory)."""
    d = get_index_dir(assistant_id)
    return (d / "index.faiss").exists() and (d / "index.pkl").exists()


def save_index(vector_store: FAISS, assistant_id: str):
    """
    Atomically save a FAISS index.

    Writes to a temporary sibling directory first, then renames over the real
    directory.  On Windows, rename requires removing the destination first.
    """
    index_dir = get_index_dir(assistant_id)
    tmp_dir   = index_dir.parent / "_index_tmp"

    # Remove any leftover temp directory from a previous crashed write.
    if tmp_dir.exists():
        shutil.rmtree(tmp_dir)

    tmp_dir.mkdir(parents=True, exist_ok=True)
    vector_store.save_local(str(tmp_dir))

    # Swap in the new index
    if index_dir.exists():
        shutil.rmtree(index_dir)
    tmp_dir.rename(index_dir)

    logger.info("FAISS index saved for assistant %s → %s", assistant_id, index_dir)


def load_index(assistant_id: str, embeddings) -> FAISS | None:
    """
    Load a persisted FAISS index.  Returns None when the index does not exist
    or is unreadable (corrupt / incomplete write).

    allow_dangerous_deserialization=True is required by LangChain; see the
    module docstring for the security rationale.
    """
    if not index_exists(assistant_id):
        return None

    index_dir = get_index_dir(assistant_id)
    try:
        store = FAISS.load_local(
            str(index_dir),
            embeddings,
            allow_dangerous_deserialization=True,   # see module docstring
        )
        logger.info("FAISS index loaded for assistant %s", assistant_id)
        return store
    except Exception as exc:
        logger.exception(
            "Could not load FAISS index for assistant %s — treating as missing: %s",
            assistant_id, exc,
        )
        return None


def delete_index(assistant_id: str):
    """Remove the persisted FAISS index directory for an assistant."""
    index_dir = get_index_dir(assistant_id)
    if index_dir.exists():
        shutil.rmtree(index_dir)
        logger.info("FAISS index deleted for assistant %s", assistant_id)


def get_all_chunks_from_store(vector_store: FAISS) -> list:
    """
    Extract every Document stored in the FAISS docstore.

    Used to rebuild the BM25 retriever (which is always derived from the
    same document set as the FAISS index) so the two retrievers stay in sync.
    """
    return list(vector_store.docstore._dict.values())
