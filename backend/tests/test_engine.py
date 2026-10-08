from app.schemas import AnalyzeRequest
from app.engine import deterministic_analysis

def test_fictional_vs_figma():
    r=deterministic_analysis(AnalyzeRequest(question="Compare Nexora and Figma",companies=["Nexora","Figma"],category="AI"))
    assert "Nexora" in r["companies"]
    assert r["key_findings"]

def test_three_companies():
    r=deterministic_analysis(AnalyzeRequest(question="Compare competitors",companies=["Figma","Canva","Notion"],category="All"))
    assert len(r["companies"])==3
    assert r["limitations"]

def test_unknown_company_api_contract():
    from fastapi.testclient import TestClient
    from app.main import app
    c=TestClient(app)
    x=c.post('/api/analyze',json={"question":"x","companies":["Unknown"],"analysis_type":"comparison"})
    assert x.status_code==400
