from typing import Literal, Optional
from pydantic import BaseModel, Field

AnalysisType = Literal["comparison", "recent_updates", "feature_analysis", "trend_analysis", "executive_summary"]

class AnalyzeRequest(BaseModel):
    question: str = Field(min_length=1)
    companies: list[str] = Field(min_length=1, max_length=4)
    date_from: Optional[str] = None
    date_to: Optional[str] = None
    category: Optional[str] = None
    analysis_type: AnalysisType = "comparison"

class Finding(BaseModel):
    company: str
    finding: str
    source_ids: list[str] = []
    source_urls: list[str] = []

class Source(BaseModel):
    title: str
    company: str
    published_date: str
    url: str
    source_id: str
    source_type: str

class AnalyzeResponse(BaseModel):
    answer: str
    analysis_type: str
    companies: list[str]
    question: str
    key_findings: list[Finding]
    common_themes: list[str]
    differences: list[str]
    strategic_recommendations: list[str]
    comparison_scorecard: list[dict] = []
    competitor_profiles: list[dict] = []
    sources: list[Source]
    limitations: list[str]
    metrics: dict = {}
    feature_matrix: list[dict] = []
    llm_used: bool = False
