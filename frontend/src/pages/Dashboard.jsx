import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BrainCircuit,
  Database,
  GitCompareArrows,
  RadioTower,
  Sparkles,
} from "lucide-react";
import { getOverview, getSignals } from "../api";
import StatCard from "../components/StatCard";
import AIAgentNews from "../components/AIAgentNews";

export default function Dashboard({ go }) {
  const [overview, setOverview] = useState(null);
  const [signals, setSignals] = useState([]);
  useEffect(() => {
    Promise.all([getOverview(), getSignals()])
      .then(([a, b]) => {
        setOverview(a);
        setSignals(b.signals || []);
      })
      .catch(console.error);
  }, []);
  const unique =
    overview?.similarity?.reduce?.(
      (n, x) => n + Number(x["Different"] || x.different || 0),
      0,
    ) || 5;
  return (
    <div className="page">
      <section className="hero">
        <div>
          <span className="kicker">EXECUTIVE INTELLIGENCE</span>
          <h2>
            See the market
            <br />
            <em>before it moves.</em>
          </h2>
          <p>
            SEPHIQ connects your internal product benchmark with monitored
            competitive signals to surface evidence, gaps and strategic
            implications.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={() => go("compare")}>
              <GitCompareArrows size={17} /> Start comparison
            </button>
            <button className="secondary" onClick={() => go("signals")}>
              Open signal feed <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
        <div className="hero-orbit">
          <div className="orbit-ring ring-a" />
          <div className="orbit-ring ring-b" />
          <div className="orbit-core">
            <Sparkles size={26} />
            <span>
              SEPHIQ
              <br />
              <small>INTELLIGENCE ENGINE</small>
            </span>
          </div>
        </div>
      </section>
      <AIAgentNews />
      <div className="stats-grid">
        <StatCard
          label="External signals"
          value={overview?.signals ?? "—"}
          sub="currently indexed"
          icon={RadioTower}
        />
        <StatCard
          label="Capability records"
          value={overview?.feature_count ?? "—"}
          sub="internal benchmark"
          icon={Database}
        />
        <StatCard
          label="Differentiated"
          value={unique || "5"}
          sub="explicitly tagged"
          icon={Sparkles}
        />
        <StatCard
          label="Customer feedback"
          value={overview?.feedback_count ?? "—"}
          sub="internal records"
          icon={BrainCircuit}
        />
      </div>

      <section className="section-head">
        <div>
          <span className="kicker">LATEST INTELLIGENCE</span>
          <h3>Recent competitive signals</h3>
        </div>
        <button className="link-btn" onClick={() => go("signals")}>
          View all <ArrowUpRight size={15} />
        </button>
      </section>
      <div className="signal-grid">
        {signals.slice(0, 3).map((s) => (
          <article className="signal-card" key={s.id}>
            <div className="signal-meta">
              <span className={`company-dot ${s.product.toLowerCase()}`} />
              <b>{s.product}</b>
              <time>{s.date}</time>
            </div>
            <h4>{s.title}</h4>
            <p>{s.description}</p>
            <span className="tag">{s.category}</span>
          </article>
        ))}
        {!signals.length && (
          <div className="empty">No monitored signals available.</div>
        )}
      </div>
    </div>
  );
}
