import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  FileText,
  GitCompareArrows,
  Loader2,
  Sparkles,
  X,
  Target,
  ShieldCheck,
  Database,
} from "lucide-react";
import { analyze } from "../api";
import { saveReport } from "../reports";
import { useAuth } from "../AuthContext";

const companies = [
  {
    name: "Nexora",
    code: "NX",
    desc: "Internal workspace benchmark",
    tone: "internal",
  },
  {
    name: "Figma",
    code: "FI",
    desc: "Design & product development",
    tone: "figma",
  },
  {
    name: "Canva",
    code: "CA",
    desc: "Visual communication & AI",
    tone: "canva",
  },
  {
    name: "Notion",
    code: "NO",
    desc: "Knowledge & workflow agents",
    tone: "notion",
  },
];
const cats = [
  "All",
  "AI",
  "Design",
  "Collaboration",
  "Project Management",
  "Automation",
  "Security",
  "Integrations",
  "Pricing",
];
function defaultQuestion(list, cat) {
  return `Compare ${cat === "All" ? "recent competitive developments" : `recent ${cat} developments`} across ${list.join(", ")} and identify the strategic implications.`;
}

export default function Compare() {
  const { user } = useAuth();
  const [selected, setSelected] = useState(["Nexora", "Figma"]);
  const [cat, setCat] = useState("AI");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [question, setQuestion] = useState(
    defaultQuestion(["Nexora", "Figma"], "AI"),
  );
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saveState, setSaveState] = useState("");
  const toggle = (name) => {
    if (selected.includes(name)) {
      if (selected.length === 2) return;
      const n = selected.filter((x) => x !== name);
      setSelected(n);
      setQuestion(defaultQuestion(n, cat));
    } else if (selected.length < 4) {
      const n = [...selected, name];
      setSelected(n);
      setQuestion(defaultQuestion(n, cat));
    }
  };
  const submit = async () => {
    if (selected.length < 2) return setError("Select at least two entities.");
    if (from && to && from > to)
      return setError("From date must be before To date.");
    if (!question.trim()) return setError("Enter a strategic question.");
    setBusy(true);
    setError("");
    setSaveState("");
    try {
      const r = await analyze({
        question,
        companies: selected,
        date_from: from || null,
        date_to: to || null,
        category: cat === "All" ? null : cat,
        analysis_type: "comparison",
      });
      setResult(r);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const save = async () => {
    if (!result) return;
    setSaveState("saving");
    try {
      const saved = await saveReport(
        {
          title: `${selected.join(" vs ")} — ${cat}`,
          question,
          companies: selected,
          category: cat,
          answer: result.answer,
          key_findings: result.key_findings || [],
          common_themes: result.common_themes || [],
          differences: result.differences || [],
          strategic_recommendations: result.strategic_recommendations || [],
          comparison_scorecard: result.comparison_scorecard || [],
          sources: result.sources || [],
        },
        user,
      );
      setSaveState(saved.mode === "cloud" ? "saved-cloud" : "saved-local");
    } catch (e) {
      setSaveState(`error:${e.message}`);
    }
  };
  const matrix = useMemo(() => result?.feature_matrix || [], [result]);
  return (
    <div className="page">
      <div className="compare-head">
        <div>
          <span className="kicker">STRATEGIC COMPARISON</span>
          <h2>Build your market view.</h2>
          <p>
            Select the companies, set the evidence window, keep the generated
            question—or write your own. SEPHIQ answers the question against the
            selected evidence.
          </p>
        </div>
        <div className="compare-badge">
          <GitCompareArrows size={19} />
          <span>
            <b>2–4 entities</b>
            <small>custom questions supported</small>
          </span>
        </div>
      </div>
      <section className="compare-builder">
        <div className="builder-top">
          <div>
            <span className="step">01</span>
            <h3>Select entities</h3>
          </div>
          <small>{selected.length}/4 selected</small>
        </div>
        <div className="entity-grid">
          {companies.map((c) => {
            const active = selected.includes(c.name);
            return (
              <button
                key={c.name}
                onClick={() => toggle(c.name)}
                className={`entity ${active ? "selected" : ""}`}
              >
                <div className={`entity-logo ${c.tone}`}>{c.code}</div>
                <div>
                  <b>{c.name}</b>
                  <span>{c.desc}</span>
                </div>
                <div className={`check ${active ? "on" : ""}`}>
                  {active ? <Check size={13} /> : null}
                </div>
              </button>
            );
          })}
        </div>
        <div className="filters">
          <label>
            Category
            <select
              value={cat}
              onChange={(e) => {
                setCat(e.target.value);
                setQuestion(defaultQuestion(selected, e.target.value));
              }}
            >
              {cats.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            From
            <input
              type="date"
              value={from}
              max={to || new Date().toISOString().slice(0, 10)}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label>
            To
            <input
              type="date"
              value={to}
              min={from || undefined}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
        </div>
        <div className="question">
          <label>
            <span>
              Strategic question <em>— editable</em>
            </span>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              placeholder="Ask anything about the selected companies…"
            />
          </label>
          <small className="question-hint">
            Examples: “Which company is moving fastest in AI agents?” · “Where
            should Nexora differentiate?” · “Compare collaboration depth across
            Figma, Canva and Notion.”
          </small>
        </div>
        {error && <div className="form-error">{error}</div>}
        <button
          className="primary analyze-btn"
          onClick={submit}
          disabled={busy}
        >
          {busy ? (
            <>
              <Loader2 className="spin" size={17} />
              Synthesizing evidence…
            </>
          ) : (
            <>
              <Sparkles size={17} />
              Run SEPHIQ analysis
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </section>
      {result && (
        <section className="results">
          <div className="result-hero">
            <div>
              <span className="kicker">SEPHIQ SYNTHESIS</span>
              <h3>Strategic readout</h3>
              <p className="question-readout">{result.question}</p>
              <p>{result.answer}</p>
            </div>
            <div
              className="save-stack"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "flex-start",
                gap: "8px",
                position: "static",
                height: "fit-content",
                minHeight: 0,
                maxHeight: "none",
                margin: 0,
                padding: 0,
                alignSelf: "start",
              }}
            >
              <button
                className="secondary save-report-button"
                onClick={save}
                disabled={saveState === "saving"}
                style={{
                  width: "150px",
                  minWidth: "150px",
                  maxWidth: "150px",
                  height: "44px",
                  minHeight: "44px",
                  padding: "0 16px",
                  margin: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  flex: "none",
                  boxSizing: "border-box",
                }}
              >
                <FileText size={16} />
                {saveState === "saving" ? "Saving…" : "Save report"}
              </button>
              {saveState === "saved-cloud" && (
                <span className="save-ok">✓ Saved </span>
              )}
              {saveState === "saved-local" && (
                <span className="save-ok">✓ Saved locally</span>
              )}
              {saveState.startsWith("error:") && (
                <span className="save-error">
                  Save failed: {saveState.slice(6)}
                </span>
              )}
            </div>
          </div>
          <div className="result-stats">
            <div>
              <b>{result.metrics?.signals ?? 0}</b>
              <span>external signals</span>
            </div>
            <div>
              <b>{result.metrics?.features_available ?? 0}</b>
              <span>Nexora capabilities</span>
            </div>
            <div>
              <b>{result.metrics?.unique_capabilities ?? 0}</b>
              <span>differentiated</span>
            </div>
            <div>
              <b>{result.metrics?.companies_compared ?? selected.length}</b>
              <span>entities compared</span>
            </div>
          </div>
          <div className="result-grid">
            <div className="panel">
              <div className="panel-title">
                <span>Evidence by entity</span>
                <small>{result.key_findings?.length || 0} findings</small>
              </div>
              {result.key_findings?.map((f, i) => (
                <div className="finding" key={`${f.company}-${i}`}>
                  <div className="finding-company">{f.company}</div>
                  <p>{f.finding}</p>
                  <div className="source-pills">
                    {f.source_ids?.map((id) => (
                      <span key={id}>{id}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="panel">
              <div className="panel-title">Strategic implications</div>
              <ul className="insight-list">
                {result.strategic_recommendations?.map((x) => (
                  <li key={x}>
                    <Target size={14} />
                    {x}
                  </li>
                ))}
              </ul>
              <div className="panel-title spaced">Common themes</div>
              <ul className="insight-list">
                {result.common_themes?.map((x) => (
                  <li key={x}>
                    <span>+</span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="panel scorecard-panel">
            <div className="panel-title">
              <span>Capability scorecard</span>
              <small>evidence-based directional view</small>
            </div>
            <div className="scorecard">
              {result.comparison_scorecard?.map((row) => (
                <div className="score-row" key={row.dimension}>
                  <b>{row.dimension}</b>
                  {selected.map((c) => (
                    <span key={c} className={row[c] ? "yes" : "no"}>
                      <i>{row[c] ? "✓" : "—"}</i>
                      {c}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {matrix.length > 0 && (
            <div className="panel matrix-panel">
              <div className="panel-title">
                <span>Nexora capability overlap</span>
                <small>
                  mapped only where the internal benchmark names a competitor
                  basis
                </small>
              </div>
              <div className="matrix-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Capability</th>
                      {selected.map((c) => (
                        <th key={c}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.map((row) => (
                      <tr key={row.feature}>
                        <td>{row.feature}</td>
                        {selected.map((c) => (
                          <td key={c}>
                            {row[c] === true ? (
                              <span className="matrix-yes">✓</span>
                            ) : row[c] === false ? (
                              <span className="matrix-no">—</span>
                            ) : (
                              ""
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="panel profile-panel">
            <div className="panel-title">
              <span>Competitive profiles</span>
              <small>structured context</small>
            </div>
            <div className="profile-grid">
              {result.competitor_profiles?.map((p) => (
                <article key={p.company}>
                  <div className="profile-name">
                    <span>{p.company.slice(0, 2).toUpperCase()}</span>
                    <b>{p.company}</b>
                  </div>
                  <p>{p.positioning}</p>
                  <div className="profile-tags">
                    {p.capabilities?.slice(0, 7).map((x) => (
                      <span key={x}>{x}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
          {result.limitations?.length > 0 && (
            <div className="limitations">
              <b>
                <ShieldCheck size={14} /> Evidence boundaries
              </b>
              {result.limitations.map((x) => (
                <span key={x}>
                  <X size={13} />
                  {x}
                </span>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
