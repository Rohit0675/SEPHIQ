const BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(data.detail || "SEPHIQ service request failed.");
  return data;
}

export const getOverview = () => request("/api/overview");
export const getSignals = () => request("/api/signals");
export const analyze = (payload) =>
  request("/api/analyze", { method: "POST", body: JSON.stringify(payload) });
export const health = () => request("/health");
