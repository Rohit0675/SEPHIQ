import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  ExternalLink,
  Sparkles,
  Clock3,
  RefreshCw,
} from "lucide-react";
const VISIBLE_COUNT = 3;

function formatDate(value) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function publisherInitials(name = "") {
  const words = name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean);

  if (!words.length) return "AI";

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function companyClass(company = "") {
  return `news-company-${company.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export default function AIAgentNews() {
  const [articles, setArticles] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  async function loadNews(force = false) {
    try {
      if (force) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const url = force
        ? `${API_BASE}/api/ai-agent-news?force_refresh=true`
        : `${API_BASE}/api/ai-agent-news`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to load AI agent news.");
      }

      const data = await response.json();

      setArticles(data.items || []);
      setIndex(0);
    } catch (err) {
      setError(err.message || "Unable to load AI agent news.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadNews();

    const refreshTimer = setInterval(
      () => {
        loadNews();
      },
      10 * 60 * 1000,
    );

    return () => clearInterval(refreshTimer);
  }, []);

  const maxIndex = Math.max(0, articles.length - VISIBLE_COUNT);

  const visibleArticles = useMemo(() => {
    return articles.slice(index, index + VISIBLE_COUNT);
  }, [articles, index]);

  useEffect(() => {
    if (articles.length <= VISIBLE_COUNT) return;

    const timer = setInterval(() => {
      setIndex((current) => (current >= maxIndex ? 0 : current + 1));
    }, 6500);

    return () => clearInterval(timer);
  }, [articles.length, maxIndex]);

  const previous = () => {
    setIndex((current) => (current <= 0 ? maxIndex : current - 1));
  };

  const next = () => {
    setIndex((current) => (current >= maxIndex ? 0 : current + 1));
  };

  function analyze(article) {
    const question =
      `What are the strategic implications for Nexora ` +
      `of this development: "${article.title}"? ` +
      `Assess what this means for Nexora's product strategy, ` +
      `competitive position and priorities.`;

    const articleContext = {
      title: article.title || "",
      summary: article.summary || "",
      publisher: article.publisher || "",
      company: article.company || "",
      date: article.date || "",
      url: article.url || "",
      category: article.category || "",
      relevance: article.relevance || "",
      relevance_score: article.relevance_score ?? null,
    };

    localStorage.setItem("sephiq_pending_analysis_question", question);

    localStorage.setItem(
      "sephiq_pending_article_context",
      JSON.stringify(articleContext),
    );

    window.dispatchEvent(
      new CustomEvent("sephiq:open-analyst", {
        detail: {
          question,
          articleContext,
        },
      }),
    );
  }

  if (loading) {
    return (
      <section className="ai-agent-news-section">
        <div className="ai-agent-news-header">
          <div>
            <span className="kicker">AI AGENT WATCH</span>
            <h3>What's moving across AI applications?</h3>
          </div>
        </div>

        <div className="ai-news-loading">
          <div className="ai-news-skeleton" />
          <div className="ai-news-skeleton" />
          <div className="ai-news-skeleton" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="ai-agent-news-section">
        <div className="ai-agent-news-header">
          <div>
            <span className="kicker">AI AGENT WATCH</span>
            <h3>What's moving across AI applications?</h3>
          </div>

          <button
            type="button"
            className="news-refresh-button"
            onClick={() => loadNews(true)}
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>

        <div className="ai-news-error">
          <Bot size={18} />
          <span>{error}</span>
        </div>
      </section>
    );
  }

  if (!articles.length) {
    return (
      <section className="ai-agent-news-section">
        <div className="ai-agent-news-header">
          <div>
            <span className="kicker">AI AGENT WATCH</span>
            <h3>No relevant developments found.</h3>
            <p>SEPHIQ will continue checking the monitored sources.</p>
          </div>

          <button
            type="button"
            className="news-refresh-button"
            onClick={() => loadNews(true)}
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="ai-agent-news-section">
      <div className="ai-agent-news-header">
        <div>
          <div className="ai-agent-news-title-row">
            <span className="kicker">AI AGENT WATCH</span>

            <span className="ai-agent-live">
              <span className="ai-agent-live-dot" />
              LIVE FEED
            </span>
          </div>

          <h3>What's moving across AI applications?</h3>

          <p>
            Live developments ranked by relevance to enterprise AI agents and
            applications.
          </p>
        </div>

        <div className="ai-agent-news-actions">
          <button
            type="button"
            className="news-refresh-button"
            onClick={() => loadNews(true)}
            disabled={refreshing}
            title="Refresh news"
          >
            <RefreshCw size={14} className={refreshing ? "news-spin" : ""} />
            {refreshing ? "Updating…" : "Refresh"}
          </button>

          <div className="ai-agent-news-controls">
            <button
              type="button"
              className="news-arrow"
              onClick={previous}
              aria-label="Previous news"
            >
              <ArrowLeft size={17} />
            </button>

            <button
              type="button"
              className="news-arrow"
              onClick={next}
              aria-label="Next news"
            >
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>

      <div className="ai-news-track">
        {visibleArticles.map((article) => (
          <article
            key={article.id}
            className={`ai-news-card ${companyClass(article.company)}`}
          >
            <div className="ai-news-card-top">
              <div className="ai-news-publisher">
                <div className="ai-news-publisher-mark">
                  {publisherInitials(article.publisher)}
                </div>

                <div>
                  <strong>{article.company}</strong>

                  <span>{article.publisher}</span>
                </div>
              </div>

              <span className="ai-news-relevance">{article.relevance}</span>
            </div>

            <div className="ai-news-meta-row">
              <span className="ai-news-category">{article.category}</span>

              <span className="ai-news-date">
                <Clock3 size={12} />
                {formatDate(article.date)}
              </span>
            </div>

            <h4>{article.title}</h4>

            <p className="ai-news-summary">
              {article.summary || "New development in the AI agent landscape."}
            </p>

            <div className="ai-news-card-footer">
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="ai-news-read"
              >
                Read article
                <ExternalLink size={13} />
              </a>

              <button
                type="button"
                className="ai-news-analyze"
                onClick={() => analyze(article)}
              >
                <Sparkles size={13} />
                Analyze
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="ai-news-bottom">
        <div className="ai-news-dots">
          {Array.from({
            length: Math.max(1, maxIndex + 1),
          }).map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              aria-label={`Go to news position ${dotIndex + 1}`}
              className={
                dotIndex === index ? "ai-news-dot active" : "ai-news-dot"
              }
              onClick={() => setIndex(dotIndex)}
            />
          ))}
        </div>

        <span className="ai-news-source-note">
          RSS + publisher feeds · relevance-ranked by SEPHIQ
        </span>
      </div>
    </section>
  );
}
