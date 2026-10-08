# SEPHIQ Agent

FastAPI evidence and analysis service for SEPHIQ — From Signals to Strategy.

## Architecture
React frontend → SEPHIQ Agent → structured internal/company evidence + monitored change history → deterministic comparison → optional Ollama narrative enrichment.

The legacy Chroma/RAG project is not required by this application.

## Run
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Optional Ollama enrichment:
```powershell
$env:SEPHIQ_USE_OLLAMA="true"
$env:OLLAMA_MODEL="llama3.2:3b"
```

## Endpoints
- GET `/health`
- GET `/api/overview`
- GET `/api/signals`
- POST `/api/analyze`
