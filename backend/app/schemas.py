from typing import Literal, Optional
from pydantic import BaseModel, Field


AnalysisType = Literal[
    "comparison",
    "recent_updates",
    "feature_analysis",
    "trend_analysis",
    "executive_summary",
]


class ArticleContext(BaseModel):
    """
    Context supplied by SEPHIQ's live intelligence feed when
    the user chooses to analyse a specific news article.
    """

    title: str = Field(min_length=1)
    summary: str = ""
    publisher: str = ""
    company: str = ""
    date: str = ""
    url: str = ""
    category: str = ""
    relevance: str = ""
    relevance_score: Optional[int] = None


class AnalyzeRequest(BaseModel):
    question: str = Field(min_length=1)
    companies: list[str] = Field(min_length=1, max_length=4)
    date_from: Optional[str] = None
    date_to: Optional[str] = None
    category: Optional[str] = None
    analysis_type: AnalysisType = "comparison"

    # Optional context when analysis was initiated
    # from the live AI Agent Watch feed.
    article_context: Optional[ArticleContext] = None


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