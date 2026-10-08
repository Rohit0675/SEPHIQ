import { useEffect, useState } from "react";
import { Calendar, FileText, Trash2, Cloud, HardDrive } from "lucide-react";
import { getReports, removeReport } from "../reports";
import { useAuth } from "../AuthContext";
export default function Reports() {
  const { user, firebaseEnabled } = useAuth();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const load = () =>
    getReports(user)
      .then(setItems)
      .catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, [user]);
  const del = async (id) => {
    try {
      await removeReport(id, user);
      setSelected(null);
      load();
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <span className="kicker">INTELLIGENCE LIBRARY</span>
          <h2>Saved reports</h2>
          <p>
            Your reusable record of strategic comparisons and analyst questions.
          </p>
        </div>
        <div className="report-mode">
          <span>
            {firebaseEnabled ? <Cloud size={15} /> : <HardDrive size={15} />}
          </span>
          {firebaseEnabled ? "Firestore cloud reports" : "Local reports"}
        </div>
      </div>
      {error && <div className="form-error">{error}</div>}
      <div className="reports-layout">
        <div className="report-list">
          {items.map((r) => (
            <button
              className={`report-item ${selected?.id === r.id ? "active" : ""}`}
              key={r.id}
              onClick={() => setSelected(r)}
            >
              <FileText size={19} />
              <span>
                <b>{r.title}</b>
                <small>
                  {r.companies?.join(" · ")} · {r.category}
                </small>
              </span>
            </button>
          ))}
          {!items.length && (
            <div className="empty">
              <FileText size={26} />
              <b>No saved reports yet.</b>
              <span>Run a comparison and save the result here.</span>
            </div>
          )}
        </div>
        {selected && (
          <article className="report-view">
            <div className="report-view-head">
              <div>
                <span className="kicker">SAVED INTELLIGENCE</span>
                <h3>{selected.title}</h3>
                <small>
                  <Calendar size={13} />{" "}
                  {selected.createdAt?.toDate
                    ? selected.createdAt.toDate().toLocaleString()
                    : new Date(
                        selected.createdAt || Date.now(),
                      ).toLocaleString()}
                </small>
              </div>
              <button className="danger" onClick={() => del(selected.id)}>
                <Trash2 size={16} />
                Delete
              </button>
            </div>
            <div className="saved-question">
              <b>Question</b>
              <span>{selected.question}</span>
            </div>
            <p className="report-answer">{selected.answer}</p>
            <div className="analyst-findings">
              {(selected.key_findings || []).map((f, i) => (
                <div key={i}>
                  <b>{f.company}</b>
                  <span>{f.finding}</span>
                </div>
              ))}
            </div>
            {selected.strategic_recommendations?.length > 0 && (
              <div className="saved-recs">
                <b>Strategic recommendations</b>
                {selected.strategic_recommendations.map((x) => (
                  <span key={x}>→ {x}</span>
                ))}
              </div>
            )}
          </article>
        )}
      </div>
    </div>
  );
}
