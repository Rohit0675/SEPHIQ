import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  GitCompareArrows,
  RadioTower,
  BrainCircuit,
  FileText,
  Menu,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Compare from "./pages/Compare";
import Signals from "./pages/Signals";
import Analyst from "./pages/Analyst";
import Reports from "./pages/Reports";

const nav = [
  ["dashboard", "Command Center", LayoutDashboard],
  ["compare", "Strategic Compare", GitCompareArrows],
  ["signals", "Signal Feed", RadioTower],
  ["analyst", "AI Analyst", BrainCircuit],
  ["reports", "Reports", FileText],
];

export default function App() {
  const { user, ready, firebaseEnabled, logout } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const openAnalyst = (event) => {
      const question = event.detail?.question;

      if (question) {
        localStorage.setItem("sephiq_pending_analysis_question", question);
      }

      setPage("analyst");
    };

    window.addEventListener("sephiq:open-analyst", openAnalyst);

    return () => {
      window.removeEventListener("sephiq:open-analyst", openAnalyst);
    };
  }, []);
  if (!ready) return <div className="boot">Loading SEPHIQ…</div>;
  if (!user) return <Login />;

  const pages = {
    dashboard: Dashboard,
    compare: Compare,
    signals: Signals,
    analyst: Analyst,
    reports: Reports,
  };
  const Page = pages[page];
  const current = nav.find((x) => x[0] === page);
  return (
    <div className="shell">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="brand">
          <img src="/logo2.png" alt="SEPHIQ" />
          {!collapsed && (
            <div>
              <strong>SEPHIQ</strong>
              <span>FROM SIGNALS TO STRATEGY</span>
            </div>
          )}
        </div>
        <div className="side-label">INTELLIGENCE</div>
        <nav>
          {nav.map(([id, label, Icon]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => setPage(id)}
              title={label}
            >
              <Icon size={19} />
              {!collapsed && <span>{label}</span>}
              {page === id && !collapsed && (
                <ChevronRight size={15} className="nav-arrow" />
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          {!collapsed && (
            <div className="status-card">
              <span className="pulse" />{" "}
              <div>
                <b>{firebaseEnabled ? "Cloud workspace" : "Local workspace"}</b>
                <small>
                  {firebaseEnabled
                    ? user.email
                    : "Local session · Firebase optional"}
                </small>
              </div>
            </div>
          )}
          <button className="collapse" onClick={() => setCollapsed(!collapsed)}>
            <Menu size={18} />
            {!collapsed && "Collapse menu"}
          </button>
          <button className="logout" onClick={logout}>
            <LogOut size={17} />
            {!collapsed && "Sign out"}
          </button>
        </div>
      </aside>
      <main className="content">
        <header className="topbar">
          <div className="top-brand">
            <img src="/logo2.png" alt="SEPHIQ" />
            <div>
              <div className="eyebrow">
                SEPHIQ / {current?.[1].toUpperCase()}
              </div>
              <h1>{current?.[1]}</h1>
            </div>
          </div>
          <div className="top-actions">
            <span className="live-dot" /> LIVE INTELLIGENCE
          </div>
        </header>
        {!firebaseEnabled && (
          <div className="setup-banner">
            Local workspace is active. Add your Firebase variables to{" "}
            <code>.env.local</code> when you want cloud authentication and
            Firestore reports.
          </div>
        )}
        <Page go={setPage} />
      </main>
    </div>
  );
}
