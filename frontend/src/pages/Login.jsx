import { useState } from "react";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { login, signup, firebaseEnabled } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await (mode === "login"
        ? login(email, password)
        : signup(email, password));
    } catch (err) {
      setError(
        (err.message || "Authentication failed")
          .replace("Firebase: ", "")
          .replace(/\s*\(auth\/[^)]+\)\.?/, ""),
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="login-page">
      <div className="login-visual">
        <img src="/logo.jpeg" alt="SEPHIQ — From Signals to Strategy" />
        <div>
          <span>COMPETITIVE INTELLIGENCE PLATFORM</span>
          <h1>
            Turn market signals
            <br />
            <em>into strategy.</em>
          </h1>
          <p>
            Evidence-led competitive monitoring, comparison and AI-assisted
            strategic interpretation in one workspace.
          </p>
        </div>
        <div className="login-metrics">
          <b>04</b>
          <span>tracked entities</span>
          <b>21</b>
          <span>signals</span>
          <b>∞</b>
          <span>strategic questions</span>
        </div>
      </div>
      <div className="login-card">
        <div className="login-logo-lockup">
          <img src="/logo.jpeg" alt="SEPHIQ" />
          <span>SEPHIQ</span>
        </div>
        <span className="kicker">WELCOME TO SEPHIQ</span>
        <h2>
          {mode === "login"
            ? "Sign in to your workspace"
            : "Create your workspace"}
        </h2>
        <p className="muted">
          Access competitive intelligence, comparisons and saved strategic
          reports.
        </p>
        <form onSubmit={submit}>
          <label>
            Email
            <div className="input-wrap">
              <Mail size={17} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </div>
          </label>
          <label>
            Password
            <div className="input-wrap">
              <LockKeyhole size={17} />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary wide" disabled={busy}>
            {busy
              ? "Authenticating…"
              : mode === "login"
                ? "Enter SEPHIQ"
                : "Create account"}
            <ArrowRight size={17} />
          </button>
        </form>
        <button
          className="text-button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
          }}
        >
          {mode === "login"
            ? "New here? Create an account"
            : "Already have an account? Sign in"}
        </button>
        {!firebaseEnabled && (
          <button
            className="local-entry"
            onClick={() => login("local@sephiq.app", "localdemo")}
          >
            Enter local workspace
          </button>
        )}
        <div className="secure-note">
          <ShieldCheck size={16} />
          <span>
            {firebaseEnabled
              ? "Authentication is handled by your Firebase project. Credentials are never stored by SEPHIQ."
              : "Local mode is active. Add Firebase keys to enable real account authentication and cloud reports."}
          </span>
        </div>
      </div>
    </div>
  );
}
