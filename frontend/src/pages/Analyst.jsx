import { useEffect, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  Loader2,
  Sparkles,
} from "lucide-react";
import { analyze } from "../api";

export default function Analyst() {
  const [q, setQ] = useState(() => {
    const pendingQuestion = localStorage.getItem(
      "sephiq_pending_analysis_question",
    );

    if (pendingQuestion) {
      localStorage.removeItem("sephiq_pending_analysis_question");
      return pendingQuestion;
    }

    return "What strategic implications can we derive from the latest competitive signals?";
  });

  const [articleContext, setArticleContext] = useState(() => {
    const pendingArticle = localStorage.getItem(
      "sephiq_pending_article_context",
    );

    if (pendingArticle) {
      localStorage.removeItem("sephiq_pending_article_context");

      try {
        return JSON.parse(pendingArticle);
      } catch {
        return null;
      }
    }

    return null;
  });

  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const openAnalyst = (event) => {
      const question = event.detail?.question;
      const context = event.detail?.articleContext;

      if (question) {
        setQ(question);
      }

      if (context) {
        setArticleContext(context);
      }

      setResult(null);
    };

    window.addEventListener("sephiq:open-analyst", openAnalyst);

    return () => {
      window.removeEventListener("sephiq:open-analyst", openAnalyst);
    };
  }, []);

  const run = async () => {
    setBusy(true);

    try {
      const response = await analyze({
        question: q,
        companies: ["Nexora", "Figma", "Canva", "Notion"],
        category: articleContext?.category || null,
        analysis_type: "executive_summary",
        article_context: articleContext || null,
      });

      setResult(response);
    } catch (e) {
      setResult({
        answer: e.message,
        limitations: ["Analysis service unavailable."],
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="analyst-layout">

        {/* =========================
            MAIN COLUMN
            ========================= */}
        <section className="analyst-main">

          <div className="analyst-hero">
            <div className="analyst-icon">
              <BrainCircuit size={28} />
            </div>

            <span className="kicker">
              AI-ASSISTED STRATEGY
            </span>

            <h2>
              Ask the intelligence engine.
            </h2>

            <p>
              SEPHIQ grounds its response in the internal benchmark
              and monitored external evidence before using the local
              LLM for narrative enrichment.
            </p>
          </div>


          {/* =========================
              ARTICLE CONTEXT
              ========================= */}
          {articleContext && (
            <div className="analyst-source-card">

              <div className="analyst-source-header">

                <div>
                  <span className="kicker">
                    ANALYSIS CONTEXT
                  </span>

                  <span className="analyst-source-label">
                    Selected intelligence article
                  </span>
                </div>

                <span className="analyst-source-badge">
                  {articleContext.relevance || "WATCH"}
                </span>

              </div>

              <h4>
                {articleContext.title}
              </h4>

              <p>
                {articleContext.summary ||
                  "Live intelligence article selected from the AI Agent Watch feed."}
              </p>

              <div className="analyst-source-meta">

                <span>
                  {articleContext.company || "AI Industry"}
                </span>

                <span>·</span>

                <span>
                  {articleContext.publisher || "Live source"}
                </span>

                {articleContext.date && (
                  <>
                    <span>·</span>
                    <span>{articleContext.date}</span>
                  </>
                )}

                {articleContext.url && (
                  <a
                    href={articleContext.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open source ↗
                  </a>
                )}

              </div>
            </div>
          )}


          {/* =========================
              QUESTION BOX
              ========================= */}
          <div className="prompt-box">

            <textarea
              value={q}
              onChange={(e) => setQ(e.target.value)}
              rows={5}
              placeholder="Ask a strategic question..."
            />

            <button
              className="primary"
              onClick={run}
              disabled={busy}
            >
              {busy ? (
                <>
                  <Loader2
                    className="spin"
                    size={17}
                  />
                  Thinking…
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  Generate strategic readout
                  <ArrowRight size={17} />
                </>
              )}
            </button>

          </div>


          {/* =========================
              RESULT
              ========================= */}
          {result && (
            <div className="analyst-result">

              <span className="kicker">
                ANALYST OUTPUT
              </span>

              <h3>
                Executive interpretation
              </h3>

              <p>
                {result.answer}
              </p>

              {result.key_findings?.length > 0 && (
                <div className="analyst-findings">

                  {result.key_findings.map((f, i) => (
                    <div key={i}>
                      <b>{f.company}</b>
                      <span>{f.finding}</span>
                    </div>
                  ))}

                </div>
              )}

            </div>
          )}

        </section>


        {/* =========================
            RIGHT SIDEBAR
            ========================= */}
        <aside className="analyst-side">

          <div className="side-card">

            <span className="kicker">
              WHAT IT USES
            </span>

            <div className="layer">
              <b>01</b>

              <span>
                <strong>
                  Internal benchmark
                </strong>

                <small>
                  Features, pricing, customer feedback
                </small>
              </span>
            </div>

            <div className="layer">
              <b>02</b>

              <span>
                <strong>
                  Signal history
                </strong>

                <small>
                  Monitored competitor changes
                </small>
              </span>
            </div>

            <div className="layer">
              <b>03</b>

              <span>
                <strong>
                  Reasoning layer
                </strong>

                <small>
                  Deterministic analysis + optional Ollama
                </small>
              </span>
            </div>

          </div>


          <div className="side-card dark">

            <span className="kicker">
              ANALYST RULE
            </span>

            <p>
              Missing evidence is surfaced as a limitation.
              SEPHIQ does not turn an empty signal history into
              a claim that nothing happened.
            </p>

          </div>

        </aside>

      </div>
    </div>
  );
}