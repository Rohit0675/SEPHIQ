import json
from pathlib import Path
from datetime import date

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"


def load_json(name):
    with open(DATA / name, encoding="utf-8") as f:
        return json.load(f)


def company_db(): return load_json("fictional_company.json")
def competitor_db(): return load_json("competitor_profiles.json")
def signals(): return load_json("change_history.json")

def fictional_summary(): return company_db()["Company_Summary"][0]
def fictional_features(): return company_db().get("Product_Features", [])
def fictional_pricing(): return company_db().get("Pricing", [])
def fictional_feedback(): return company_db().get("Customer_Feedback", [])
def similarity_summary(): return company_db().get("Similarity_Summary", [])

def profiles(): return competitor_db()

def competitor_signals(companies=None, date_from=None, date_to=None, category=None):
    items = signals()
    companies = set(companies or [])
    start = date.fromisoformat(date_from) if date_from else None
    end = date.fromisoformat(date_to) if date_to else None
    out = []
    for item in items:
        if companies and item["product"] not in companies: continue
        d = date.fromisoformat(item["date"])
        if start and d < start: continue
        if end and d > end: continue
        if category and category.lower() != "all" and item.get("category", "Other").lower() != category.lower(): continue
        out.append(item)
    return sorted(out, key=lambda x: x["date"], reverse=True)
