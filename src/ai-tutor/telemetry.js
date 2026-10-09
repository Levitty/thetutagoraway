// ============================================================================
// TELEMETRY — the append-only record of every answered problem.
//
// This log is the system of record (ADR-001): both engines are rebuildable
// from it, and it is the dataset for catching mislabelled content on its own.
// So it has to actually arrive. Two guarantees:
//
//   never block  — logging must never stall a lesson or show the learner an
//                  error. Everything here is fire-and-forget.
//   never lose   — an event that cannot be sent (offline, flaky data, a
//                  closed tab) goes into a localStorage outbox and is retried
//                  on the next load and whenever the device comes back online.
//                  Every event carries a client_event_id, and the table has a
//                  unique index on it, so a retry that races a late success
//                  is a harmless duplicate-key error, never a double count.
//
// Columns added by migrations after a build may not exist yet on the server;
// on an unknown-column error the event is re-sent with the base columns only
// rather than dropped.
// ============================================================================

import { supabase } from '../supabase.js';

const PARAMS_VERSION = 'heuristic-v0';   // bumped when calibrated params ship
const OUTBOX_KEY = 'tg_response_outbox';
const OUTBOX_MAX = 500;                  // oldest dropped beyond this — storage guard
const SESSION_KEY = 'tg_session_id';

// Columns that exist in the original table; everything else is optional and
// may be absent until its migration runs.
const BASE_COLUMNS = ['student_id', 'subject', 'skill_id', 'problem_type', 'correct', 'time_ms',
  'hints_used', 'attempt_no', 'is_diagnostic', 'is_review', 'params_version'];

const uuid = () => {
  try { if (crypto?.randomUUID) return crypto.randomUUID(); } catch { /* fall through */ }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

// One id per sitting. sessionStorage so a reload mid-lesson stays the same
// sitting; a new tab or a fresh app launch starts a new one.
const sessionId = () => {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) { id = uuid(); sessionStorage.setItem(SESSION_KEY, id); }
    return id;
  } catch { return null; }
};

const readOutbox = () => { try { return JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]'); } catch { return []; } };
const writeOutbox = (rows) => { try { localStorage.setItem(OUTBOX_KEY, JSON.stringify(rows.slice(-OUTBOX_MAX))); } catch { /* storage full or absent */ } };
const enqueue = (row) => writeOutbox([...readOutbox().filter(r => r.client_event_id !== row.client_event_id), row]);

const isDuplicate = (error) => error?.code === '23505' || /duplicate key/i.test(error?.message || '');
const isUnknownColumn = (error) => error?.code === '42703' || error?.code === 'PGRST204' || /column .* does not exist|schema cache/i.test(error?.message || '');
const stripToBase = (row) => Object.fromEntries(Object.entries(row).filter(([k]) => BASE_COLUMNS.includes(k)));

// Try to deliver one row. Resolves true when the server has it (including the
// duplicate case), false when it should be kept for retry.
const deliver = async (row) => {
  const { error } = await supabase.from('response_events').insert(row);
  if (!error || isDuplicate(error)) return true;
  if (isUnknownColumn(error)) {
    const { error: e2 } = await supabase.from('response_events').insert(stripToBase(row));
    if (!e2 || isDuplicate(e2)) return true;
  }
  if (import.meta.env?.DEV) console.debug('telemetry deferred:', error.message);
  return false;
};

let flushing = false;
export const flushOutbox = async () => {
  if (flushing) return;
  const pending = readOutbox();
  if (!pending.length) return;
  flushing = true;
  try {
    const kept = [];
    for (const row of pending) {
      let ok = false;
      try { ok = await deliver(row); } catch { ok = false; }
      if (!ok) kept.push(row);
    }
    writeOutbox(kept);
  } finally { flushing = false; }
};

// Drain on load and whenever connectivity returns.
try {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => { flushOutbox(); });
    setTimeout(() => { flushOutbox(); }, 2500);
  }
} catch { /* non-browser */ }

/**
 * Log one answered problem.
 * @param {object} ev
 * @param {string} ev.studentId        auth user id (required; anonymous → skipped)
 * @param {string} [ev.learnerId]      which CHILD answered (null = account holder)
 * @param {string} ev.subject          e.g. 'math'
 * @param {string} ev.skillId
 * @param {boolean} ev.correct
 * @param {string} [ev.submittedValue] what the learner actually answered — raw
 * @param {string} [ev.expectedValue]  what would have been marked right
 * @param {boolean} [ev.skipped]       "I haven't learned this yet"
 * @param {string} [ev.problemType]
 * @param {number} [ev.timeMs]
 * @param {number} [ev.hintsUsed]
 * @param {number} [ev.attemptNo]
 * @param {boolean} [ev.isDiagnostic]
 * @param {boolean} [ev.isReview]
 * @param {number}  [ev.taps]          interaction taps before answering (young mode)
 * @param {number}  [ev.scaffold]      faded-example support level answered at
 * @param {number}  [ev.confidence]    engine's prior confidence before the answer
 */
export function logResponse(ev) {
  if (!ev || !ev.studentId || !ev.skillId) return;   // need a real student + skill
  const row = {
    client_event_id: uuid(),
    client_ts: new Date().toISOString(),
    session_id: sessionId(),
    student_id: ev.studentId,
    subject: ev.subject || 'math',
    skill_id: ev.skillId,
    problem_type: ev.problemType || null,
    correct: !!ev.correct,
    skipped: !!ev.skipped,
    time_ms: Number.isFinite(ev.timeMs) ? Math.round(ev.timeMs) : null,
    hints_used: ev.hintsUsed || 0,
    attempt_no: ev.attemptNo || 1,
    is_diagnostic: !!ev.isDiagnostic,
    is_review: !!ev.isReview,
    params_version: PARAMS_VERSION,
  };
  if (ev.learnerId) row.learner_id = ev.learnerId;
  if (ev.submittedValue != null && ev.submittedValue !== '') row.submitted_value = String(ev.submittedValue).slice(0, 500);
  if (ev.expectedValue != null && ev.expectedValue !== '') row.expected_value = String(ev.expectedValue).slice(0, 500);
  if (Number.isFinite(ev.taps)) row.taps = Math.round(ev.taps);
  if (Number.isFinite(ev.scaffold)) row.scaffold = Math.round(ev.scaffold);
  if (Number.isFinite(ev.confidence)) row.confidence = Math.round(ev.confidence * 1000) / 1000;

  // Queue first, then send. If the tab closes mid-flight the event is still in
  // the outbox; if the send succeeds it is removed. Not awaited.
  enqueue(row);
  deliver(row)
    .then(ok => { if (ok) writeOutbox(readOutbox().filter(r => r.client_event_id !== row.client_event_id)); })
    .catch(() => { /* stays queued */ });
}

export { PARAMS_VERSION };
