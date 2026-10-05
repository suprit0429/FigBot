# FigBot — AI Backend

**No-Code AI Assistant Creation and Deployment Platform**

> Upload documents → Build knowledge base → Deploy AI assistant → Embed on any website

---

## 📁 Project Structure

```
Figbot/
├── ai_backend/
│   ├── main.py                    # FastAPI app — entry point
│   ├── requirements.txt           # Python dependencies
│   ├── .env.example               # Environment variable template
│   └── core/
│       ├── document_processor.py  # PDF loading + chunking
│       ├── vector_store.py        # FAISS index management + hybrid retriever
│       ├── rag_chain.py           # RAG pipeline + Groq LLM
│       └── assistant_manager.py   # Chain cache + query entry point
└── storage/
    └── indexes/                   # FAISS indexes saved here (per assistant_id)
```

---

## ⚡ Quick Start

### 1. Create a Virtual Environment
```bash
cd ai_backend
python -m venv venv
venv\Scripts\activate      # Windows
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Set Up Environment Variables
```bash
copy .env.example .env
# Edit .env and add your GROQ_API_KEY
```

### 4. Run the AI Backend
```bash
uvicorn main:app --reload --port 8000
```

API available at: **http://localhost:8000**
Docs at: **http://localhost:8000/docs**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/upload` | Upload PDFs and build knowledge base |
| `POST` | `/chat` | Query an assistant |
| `GET` | `/assistants/{id}/status` | Check if knowledge base is ready |
| `DELETE` | `/assistants/{id}/reset` | Delete knowledge base |

### Upload Documents
```bash
curl -X POST http://localhost:8000/upload \
  -F "assistant_id=my-assistant-123" \
  -F "assistant_name=College Assistant" \
  -F "files=@handbook.pdf" \
  -F "files=@faq.pdf"
```

### Chat with Assistant
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"assistant_id": "my-assistant-123", "question": "What is the admission process?"}'
```

---

## 🧠 AI Pipeline

```
PDF Upload
    │
    ▼
Text Extraction (PyPDFLoader)
    │
    ▼
Chunking (RecursiveCharacterTextSplitter, 1500 chars, 300 overlap)
    │
    ▼
Embedding (HuggingFace all-MiniLM-L6-v2, local, free)
    │
    ▼
FAISS Index (saved to disk per assistant_id)
    │
User Query
    │
    ▼
Hybrid Retrieval (BM25 40% + FAISS MMR 60%)
    │
    ▼
Context Prompt → Groq Llama-3.3-70b
    │
    ▼
AI Response
```

---

## 🔑 Tech Stack

| Component | Technology |
|-----------|-----------|
| AI Framework | LangChain |
| Embeddings | HuggingFace `all-MiniLM-L6-v2` (local, free) |
| Vector DB | FAISS (disk-persisted per assistant) |
| Retrieval | Hybrid BM25 + FAISS MMR |
| LLM | Groq API — Llama 3.3 70b |
| API | FastAPI |
| Server | Uvicorn |
