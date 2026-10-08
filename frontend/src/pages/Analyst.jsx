import { useState } from "react";
import { ArrowRight, BrainCircuit, Loader2, Sparkles } from "lucide-react";
import { analyze } from "../api";
export default function Analyst() {
  const [q, setQ] = useState(
    "What strategic implications can we derive from the latest competitive signals?",
  );
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const run = async () => {
    setBusy(true);
    try {
      setResult(
        await analyze({
          question: q,
          companies: ["Nexora", "Figma", "Canva", "Notion"],
          category: null,
          analysis_type: "executive_summary",
        }),
      );
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
        <section className="analyst-main">
          <div className="analyst-hero">
            <div className="analyst-icon">
              <BrainCircuit size={28} />
            </div>
            <span className="kicker">AI-ASSISTED STRATEGY</span>
            <h2>Ask the intelligence engine.</h2>
            <p>
              SEPHIQ grounds its response in the internal benchmark and
              monitored external evidence before using the local LLM for
              narrative enrichment.
            </p>
          </div>
          <div className="prompt-box">
            <textarea
              value={q}
              onChange={(e) => setQ(e.target.value)}
              rows={5}
            />
            <button className="primary" onClick={run} disabled={busy}>
              {busy ? (
                <>
                  <Loader2 className="spin" size={17} />
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
          {result && (
            <div className="analyst-result">
              <span className="kicker">ANALYST OUTPUT</span>
              <h3>Executive interpretation</h3>
              <p>{result.answer}</p>
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
        <aside className="analyst-side">
          <div className="side-card">
            <span className="kicker">WHAT IT USES</span>
            <div className="layer">
              <b>01</b>
              <span>
                <strong>Internal benchmark</strong>
                <small>Features, pricing, customer feedback</small>
              </span>
            </div>
            <div className="layer">
              <b>02</b>
              <span>
                <strong>Signal history</strong>
                <small>Monitored competitor changes</small>
              </span>
            </div>
            <div className="layer">
              <b>03</b>
              <span>
                <strong>Reasoning layer</strong>
                <small>Deterministic analysis + optional Ollama</small>
              </span>
            </div>
          </div>
          <div className="side-card dark">
            <span className="kicker">ANALYST RULE</span>
            <p>
              Missing evidence is surfaced as a limitation. SEPHIQ does not turn
              an empty signal history into a claim that nothing happened.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
