// ============================================================================
// ENGINE CLIENT — bridge from the JS app to the Python "brain".
//
// The Python engine (engine/server.py) does the real measurement: Bayesian
// mastery, forgetting, frontier selection, continuous ability level. This
// client calls it — but degrades gracefully: if the brain isn't reachable
// (e.g. in production before it's deployed), callers fall back to the JS
// engine and nothing breaks.
//
// Set VITE_ENGINE_URL to point at a deployed brain; defaults to localhost.
// ============================================================================

const ENGINE_URL = (import.meta.env && import.meta.env.VITE_ENGINE_URL) ||
  'http://127.0.0.1:8077';

const HEALTH_TTL_MS = 30000;
let _healthCache = { ok: false, at: 0 };

// ---- availability (cached health check) ----
export const isEngineAvailable = async () => {
  const now = Date.now();
  if (now - _healthCache.at < HEALTH_TTL_MS) return _healthCache.ok;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1500);
    const res = await fetch(`${ENGINE_URL}/health`, { signal: ctrl.signal });
    clearTimeout(t);
    _healthCache = { ok: res.ok, at: now };
    return res.ok;
  } catch {
    _healthCache = { ok: false, at: now };
    return false;
  }
};

const post = async (path, body) => {
  const res = await fetch(`${ENGINE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`engine ${path} -> ${res.status}`);
  return res.json();
};

// ---------------------------------------------------------------------------
// State translation: JS progress.skills  <->  Python state.skills
//
// The JS UI keeps progress in its own shape (attempts/correct/mastered/repNum…).
// The Python brain wants beliefs. We translate so the brain can read existing
// progress without the UI having to change how it stores anything.
// ---------------------------------------------------------------------------
const PRIOR = 0.15;

const skillToState = (sp) => {
  if (!sp) return null;
  const attempts = sp.attempts || 0;
  const correct = sp.correct || 0;
  let belief;
  if (sp.mastered) belief = 0.95;
  else if (attempts > 0) belief = Math.min(0.9, Math.max(PRIOR, correct / attempts));
  else belief = PRIOR;
  return {
    belief,
    rep: sp.repNum || 0,
    learning_speed: sp.learningSpeed || 1.0,
    attempts,
    correct,
    consecutive_failures: sp.consecutiveFailures || 0,
    last_practice: sp.lastPractice || null,
    from_diagnostic: !!sp.fromDiagnostic,
  };
};

export const progressToState = (progress, subject = 'math') => {
  const skills = {};
  for (const [id, sp] of Object.entries(progress?.skills || {})) {
    const st = skillToState(sp);
    if (st) skills[id] = st;
  }
  return {
    subject,
    diagnosed: !!progress?.diagnosed,
    total_xp: progress?.totalXP || 0,
    skills,
  };
};

// ---------------------------------------------------------------------------
// High-level calls. Each returns null on any failure so callers can fall back.
// ---------------------------------------------------------------------------

// Continuous ability level + per-strand profile (the teacher-facing measurement).
export const getBrainProfile = async (progress, subject = 'math') => {
  try {
    if (!(await isEngineAvailable())) return null;
    const { profile } = await post('/profile', {
      subject,
      state: progressToState(progress, subject),
    });
    return profile;
  } catch {
    return null;
  }
};

// Ordered next-session plan: remediate / review / learn / stretch.
export const getBrainSession = async (progress, subject = 'math', n = 8) => {
  try {
    if (!(await isEngineAvailable())) return null;
    const { recommendations } = await post('/next-session', {
      subject,
      state: progressToState(progress, subject),
      n,
    });
    return recommendations;
  } catch {
    return null;
  }
};

// Adaptive diagnostic, driven by the brain (frontier-targeted question selection).
export const diagnosticStep = async (subject, history, startGrade) => {
  try {
    if (!(await isEngineAvailable())) return null;
    return await post('/diagnostic/step', { subject, history, start_grade: startGrade });
  } catch {
    return null;
  }
};

export const diagnosticFinalize = async (subject, history) => {
  try {
    if (!(await isEngineAvailable())) return null;
    return await post('/diagnostic/finalize', { subject, history });
  } catch {
    return null;
  }
};

export { ENGINE_URL };
