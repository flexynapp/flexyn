// Crash-recovery for live cardio sessions.
const SESSION_KEY = 'fn-cardio-active-session';

export function snapshot(state) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {}
}

export function readSnapshot() {
  try {
    const v = localStorage.getItem(SESSION_KEY);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

export function clearSnapshot() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}