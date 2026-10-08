from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import AnalyzeRequest, AnalyzeResponse
from .engine import deterministic_analysis
from .llm import enrich
from .store import fictional_summary, fictional_features, fictional_pricing, fictional_feedback, signals, similarity_summary, profiles
from app.news import get_ai_agent_news

app=FastAPI(title="SEPHIQ Intelligence Agent",version="2.0.0")
app.add_middleware(CORSMiddleware,allow_origins=["http://localhost:5173","http://127.0.0.1:5173","http://localhost:4173","http://127.0.0.1:4173"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"])

@app.get("/health")
def health(): return {"status":"ok","service":"SEPHIQ Agent","version":"2.0.0"}

@app.get("/api/overview")
def overview():
    return {"company":fictional_summary(),"feature_count":len(fictional_features()),"pricing_count":len(fictional_pricing()),"feedback_count":len(fictional_feedback()),"signals":len(signals()),"similarity":similarity_summary(),"companies":["Nexora","Figma","Canva","Notion"],"profiles":profiles()}

@app.get("/api/ai-agent-news")
def ai_agent_news(force_refresh: bool = False):
    return get_ai_agent_news(force_refresh=force_refresh)

@app.get("/api/signals")
def get_signals(): return {"signals":sorted(signals(),key=lambda x:x["date"],reverse=True)}

@app.get("/api/companies")
def get_companies(): return {"companies":[{"name":k,**v} for k,v in profiles().items()]}

@app.post("/api/analyze",response_model=AnalyzeResponse)
def analyze(req:AnalyzeRequest):
    allowed={"Nexora","Figma","Canva","Notion"}
    unknown=[c for c in req.companies if c not in allowed]
    if unknown: raise HTTPException(400,f"Unsupported company: {unknown[0]}")
    return enrich(deterministic_analysis(req))
