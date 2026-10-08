import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Filter, RadioTower, Search } from "lucide-react";
import { getSignals } from "../api";
export default function Signals() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [company, setCompany] = useState("All");
  useEffect(() => {
    getSignals()
      .then((x) => setItems(x.signals || []))
      .catch(console.error);
  }, []);
  const shown = useMemo(
    () =>
      items.filter(
        (x) =>
          (company === "All" || x.product === company) &&
          `${x.title} ${x.description} ${x.category}`
            .toLowerCase()
            .includes(q.toLowerCase()),
      ),
    [items, q, company],
  );
  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <span className="kicker">MONITORED EXTERNAL EVIDENCE</span>
          <h2>Signal feed</h2>
          <p>
            Only updates present in the supplied monitoring history are
            presented as external evidence.
          </p>
        </div>
        <div className="signal-count">
          <RadioTower size={18} />
          {items.length} indexed signals
        </div>
      </div>
      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search signals…"
          />
        </div>
        <div className="select">
          <Filter size={16} />
          <select value={company} onChange={(e) => setCompany(e.target.value)}>
            <option>All</option>
            <option>Figma</option>
            <option>Canva</option>
            <option>Notion</option>
          </select>
        </div>
      </div>
      <div className="feed">
        {shown.map((s) => (
          <article className="feed-row" key={s.id}>
            <div className="feed-date">
              <b>{s.date.split("-")[2]}</b>
              <span>
                {new Date(s.date).toLocaleDateString("en", { month: "short" })}
              </span>
            </div>
            <div className="feed-body">
              <div className="signal-meta">
                <span className={`company-dot ${s.product.toLowerCase()}`} />
                <b>{s.product}</b>
                <span className="tag">{s.category}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <small>Detected {s.detected_at}</small>
            </div>
            <a
              className="icon-link"
              href={s.source}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={17} />
            </a>
          </article>
        ))}
        {!shown.length && (
          <div className="empty">No signals match the selected filters.</div>
        )}
      </div>
    </div>
  );
}
