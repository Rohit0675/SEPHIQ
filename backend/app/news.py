from __future__ import annotations

import html
import re
import time
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Any
from urllib.parse import quote
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET


# =========================================================
# CONFIGURATION
# =========================================================

CACHE_TTL_SECONDS = 10 * 60
REQUEST_TIMEOUT_SECONDS = 8
MAX_ITEMS_PER_SOURCE = 12
MAX_FINAL_ITEMS = 18


RSS_SOURCES = [
    {
        "name": "OpenAI",
        "url": "https://openai.com/news/rss.xml",
        "type": "official",
    },
    {
        "name": "Google DeepMind",
        "url": "https://deepmind.google/blog/rss.xml",
        "type": "official",
    },
    {
        "name": "TechCrunch AI",
        "url": "https://techcrunch.com/category/artificial-intelligence/feed/",
        "type": "publisher",
    },
    {
        "name": "The Verge AI",
        "url": "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
        "type": "publisher",
    },
    {
        "name": "Hugging Face",
        "url": "https://huggingface.co/blog/feed.xml",
        "type": "official",
    },
    {
        "name": "MIT Technology Review",
        "url": "https://www.technologyreview.com/topic/artificial-intelligence/feed",
        "type": "publisher",
    },
]


GOOGLE_NEWS_QUERY = (
    "(AI agent OR AI agents OR agentic AI OR autonomous AI) "
    "(Figma OR Notion OR Canva OR Google OR OpenAI OR Microsoft "
    "OR Adobe OR Salesforce OR SAP OR Atlassian)"
)

GOOGLE_NEWS_RSS = (
    "https://news.google.com/rss/search?q="
    + quote(GOOGLE_NEWS_QUERY)
    + "&hl=en-US&gl=US&ceid=US:en"
)


# =========================================================
# CACHE
# =========================================================

_cache: dict[str, Any] = {
    "timestamp": 0.0,
    "items": [],
}


# =========================================================
# HELPERS
# =========================================================

def clean_html(value: str | None) -> str:
    if not value:
        return ""

    value = html.unescape(value)

    value = re.sub(
        r"<script.*?</script>",
        " ",
        value,
        flags=re.IGNORECASE | re.DOTALL,
    )

    value = re.sub(
        r"<style.*?</style>",
        " ",
        value,
        flags=re.IGNORECASE | re.DOTALL,
    )

    value = re.sub(r"<[^>]+>", " ", value)
    value = re.sub(r"\s+", " ", value)

    return value.strip()


def shorten(value: str, limit: int = 220) -> str:
    value = clean_html(value)

    if len(value) <= limit:
        return value

    shortened = value[:limit].rsplit(" ", 1)[0]
    return shortened + "…"


def parse_date(value: str | None) -> datetime:
    if not value:
        return datetime.now(timezone.utc)

    value = value.strip()

    try:
        return parsedate_to_datetime(value).astimezone(timezone.utc)
    except Exception:
        pass

    try:
        normalized = value.replace("Z", "+00:00")
        return datetime.fromisoformat(normalized).astimezone(timezone.utc)
    except Exception:
        return datetime.now(timezone.utc)


def iso_date(value: datetime) -> str:
    return value.astimezone(timezone.utc).strftime("%Y-%m-%d")


def find_text(element: ET.Element, names: list[str]) -> str:
    for child in list(element):
        tag = child.tag.split("}")[-1].lower()

        if tag in names:
            return "".join(child.itertext()).strip()

    return ""


def find_link(element: ET.Element) -> str:
    # RSS <link>
    for child in list(element):
        tag = child.tag.split("}")[-1].lower()

        if tag == "link":
            href = child.attrib.get("href")

            if href:
                return href.strip()

            text = "".join(child.itertext()).strip()

            if text:
                return text

    # Atom link can sometimes be namespaced
    for child in list(element):
        tag = child.tag.split("}")[-1].lower()

        if tag == "link":
            href = child.attrib.get("href")

            if href:
                return href.strip()

    return ""


def parse_feed(xml_data: bytes, source_name: str, source_type: str) -> list[dict]:
    try:
        root = ET.fromstring(xml_data)
    except ET.ParseError:
        return []

    items: list[dict] = []

    for element in root.iter():
        tag = element.tag.split("}")[-1].lower()

        if tag not in {"item", "entry"}:
            continue

        title = find_text(element, ["title"])
        description = find_text(
            element,
            [
                "description",
                "summary",
                "content",
                "encoded",
            ],
        )

        link = find_link(element)

        date_value = find_text(
            element,
            [
                "pubdate",
                "published",
                "updated",
                "date",
            ],
        )

        if not title or not link:
            continue

        published = parse_date(date_value)

        items.append(
            {
                "publisher": source_name,
                "source_type": source_type,
                "title": clean_html(title),
                "summary": shorten(description),
                "url": link,
                "published_at": published,
            }
        )

        if len(items) >= MAX_ITEMS_PER_SOURCE:
            break

    return items


def fetch_url(url: str) -> bytes:
    request = Request(
        url,
        headers={
            "User-Agent": (
                "SEPHIQ/2.0 "
                "(Competitive Intelligence Platform; RSS Reader)"
            ),
            "Accept": (
                "application/rss+xml, "
                "application/atom+xml, "
                "application/xml, text/xml"
            ),
        },
    )

    with urlopen(
        request,
        timeout=REQUEST_TIMEOUT_SECONDS,
    ) as response:
        return response.read()


# =========================================================
# RELEVANCE ENGINE
# =========================================================

HIGH_VALUE_TERMS = {
    "ai agent": 7,
    "ai agents": 7,
    "agentic ai": 7,
    "autonomous agent": 7,
    "autonomous agents": 7,
    "ai assistant": 4,
    "ai assistants": 4,
    "agent": 3,
    "agents": 3,
    "workflow automation": 4,
    "agentic": 5,
    "autonomous": 4,
    "sub-agent": 5,
    "sub agents": 5,
    "agent skills": 6,
    "custom agents": 6,
}

APPLICATION_TERMS = {
    "figma": 5,
    "notion": 5,
    "canva": 5,
    "google workspace": 4,
    "microsoft 365": 4,
    "slack": 3,
    "adobe": 4,
    "salesforce": 4,
    "sap": 4,
    "atlassian": 4,
    "github": 3,
    "cursor": 3,
    "claude": 3,
    "copilot": 3,
    "gemini": 4,
}

ENTERPRISE_TERMS = {
    "enterprise": 2,
    "workplace": 2,
    "business": 1,
    "productivity": 2,
    "workflow": 2,
    "automation": 2,
    "collaboration": 2,
    "software": 1,
    "application": 1,
}

NOISE_TERMS = {
    "stock": -2,
    "earnings": -3,
    "crypto": -3,
    "bitcoin": -3,
    "celebrity": -3,
    "gaming": -1,
}


def relevance_score(item: dict) -> int:
    text = (
        f"{item.get('title', '')} "
        f"{item.get('summary', '')}"
    ).lower()

    score = 0

    for term, points in HIGH_VALUE_TERMS.items():
        if term in text:
            score += points

    for term, points in APPLICATION_TERMS.items():
        if term in text:
            score += points

    for term, points in ENTERPRISE_TERMS.items():
        if term in text:
            score += points

    for term, points in NOISE_TERMS.items():
        if term in text:
            score += points

    # Recent articles receive a modest freshness bonus.
    published = item.get("published_at")

    if isinstance(published, datetime):
        age_hours = (
            datetime.now(timezone.utc) - published
        ).total_seconds() / 3600

        if age_hours <= 24:
            score += 5
        elif age_hours <= 72:
            score += 3
        elif age_hours <= 168:
            score += 1

    if item.get("source_type") == "official":
        score += 2

    return max(0, score)


def detect_company(text: str) -> str:
    text_lower = text.lower()

    company_map = [
        ("figma", "Figma"),
        ("notion", "Notion"),
        ("canva", "Canva"),
        ("google", "Google"),
        ("gemini", "Google"),
        ("openai", "OpenAI"),
        ("chatgpt", "OpenAI"),
        ("microsoft", "Microsoft"),
        ("copilot", "Microsoft"),
        ("adobe", "Adobe"),
        ("salesforce", "Salesforce"),
        ("sap", "SAP"),
        ("atlassian", "Atlassian"),
        ("github", "GitHub"),
        ("anthropic", "Anthropic"),
        ("claude", "Anthropic"),
        ("meta", "Meta"),
    ]

    for keyword, company in company_map:
        if keyword in text_lower:
            return company

    return "AI Industry"


def detect_category(text: str) -> str:
    value = text.lower()

    if any(
        term in value
        for term in [
            "agent skill",
            "custom agent",
            "sub-agent",
            "sub agent",
        ]
    ):
        return "Agent Platforms"

    if any(
        term in value
        for term in [
            "enterprise",
            "workplace",
            "business",
        ]
    ):
        return "Enterprise AI"

    if any(
        term in value
        for term in [
            "workflow",
            "automation",
            "productivity",
        ]
    ):
        return "AI Automation"

    if any(
        term in value
        for term in [
            "developer",
            "code",
            "coding",
        ]
    ):
        return "Developer Agents"

    return "AI Agents"


def relevance_label(score: int) -> str:
    if score >= 18:
        return "HIGH"
    if score >= 10:
        return "MEDIUM"
    return "WATCH"


def dedupe(items: list[dict]) -> list[dict]:
    seen: set[str] = set()
    result: list[dict] = []

    for item in items:
        normalized = re.sub(
            r"[^a-z0-9]+",
            " ",
            item["title"].lower(),
        ).strip()

        key = normalized[:180]

        if not key or key in seen:
            continue

        seen.add(key)
        result.append(item)

    return result


# =========================================================
# GOOGLE NEWS
# =========================================================

def fetch_google_news() -> list[dict]:
    try:
        xml_data = fetch_url(GOOGLE_NEWS_RSS)

        return parse_feed(
            xml_data,
            "Google News",
            "publisher",
        )
    except Exception:
        return []


# =========================================================
# MAIN AGGREGATOR
# =========================================================

def collect_news() -> list[dict]:
    raw_items: list[dict] = []

    # Official and publisher RSS feeds
    for source in RSS_SOURCES:
        try:
            xml_data = fetch_url(source["url"])

            raw_items.extend(
                parse_feed(
                    xml_data,
                    source["name"],
                    source["type"],
                )
            )
        except Exception:
            # One unavailable publisher should not break
            # the entire intelligence feed.
            continue

    # Application-focused Google News search
    raw_items.extend(fetch_google_news())

    if not raw_items:
        return []

    unique_items = dedupe(raw_items)

    scored: list[dict] = []

    for item in unique_items:
        text = (
            f"{item['title']} "
            f"{item['summary']}"
        )

        score = relevance_score(item)

        # Require meaningful AI-agent relevance.
        if score < 7:
            continue

        company = detect_company(text)
        category = detect_category(text)

        scored.append(
            {
                "id": abs(hash(item["url"])),
                "company": company,
                "publisher": item["publisher"],
                "source_type": item["source_type"],
                "date": iso_date(item["published_at"]),
                "published_at": item["published_at"].isoformat(),
                "category": category,
                "title": item["title"],
                "summary": item["summary"],
                "url": item["url"],
                "relevance_score": score,
                "relevance": relevance_label(score),
            }
        )

    # Highest relevance first, then newest.
    scored.sort(
        key=lambda item: (
            item["relevance_score"],
            item["published_at"],
        ),
        reverse=True,
    )

    return scored[:MAX_FINAL_ITEMS]


def get_ai_agent_news(force_refresh: bool = False) -> dict:
    now = time.time()

    cache_is_valid = (
        _cache["items"]
        and now - _cache["timestamp"] < CACHE_TTL_SECONDS
    )

    if cache_is_valid and not force_refresh:
        return {
            "status": "ok",
            "cached": True,
            "updated_at": datetime.fromtimestamp(
                _cache["timestamp"],
                timezone.utc,
            ).isoformat(),
            "count": len(_cache["items"]),
            "items": _cache["items"],
        }

    items = collect_news()

    if items:
        _cache["items"] = items
        _cache["timestamp"] = now

        return {
            "status": "ok",
            "cached": False,
            "updated_at": datetime.fromtimestamp(
                now,
                timezone.utc,
            ).isoformat(),
            "count": len(items),
            "items": items,
        }

    # If all sources temporarily fail, serve the previous cache.
    if _cache["items"]:
        return {
            "status": "stale",
            "cached": True,
            "updated_at": datetime.fromtimestamp(
                _cache["timestamp"],
                timezone.utc,
            ).isoformat(),
            "count": len(_cache["items"]),
            "items": _cache["items"],
        }

    return {
        "status": "empty",
        "cached": False,
        "updated_at": None,
        "count": 0,
        "items": [],
    }