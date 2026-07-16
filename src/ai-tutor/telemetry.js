// ============================================================================
// TELEMETRY — capture every student response for the HOREB learning loop.
//
// Fire-and-forget by design: logging must NEVER block the lesson or surface an
// error to the student. If the insert fails (offline, RLS, whatever), we drop
// the event silently. Durable enough for calibration, invisible to the learner.
//
// When the Python engine is deployed, events can additionally be POSTed to its
// /event endpoint; for now Supabase is the system of record.
// ============================================================================

import { supabase } from '../supabase.js';

const PARAMS_VERSION = 'heuristic-v0';   // bumped when calibrated params ship

/**
 * Log one answered problem.
 * @param {object} ev
 * @param {string} ev.studentId   auth user id (required; anonymous → skipped)
 * @param {string} ev.subject     e.g. 'math'
 * @param {string} ev.skillId
 * @param {boolean} ev.correct
 * @param {string} [ev.problemType]
 * @param {number} [ev.timeMs]
 * @param {number} [ev.hintsUsed]
 * @param {number} [ev.attemptNo]
 * @param {boolean} [ev.isDiagnostic]
 * @param {boolean} [ev.isReview]
 * @param {number}  [ev.taps]  interaction taps before answering (young mode) —
 *                             the concrete-vs-abstract signal for CPA staging
 */
export function logResponse(ev) {
  if (!ev || !ev.studentId || !ev.skillId) return;   // need a real student + skill
  const row = {
    student_id: ev.studentId,
    subject: ev.subject || 'math',
    skill_id: ev.skillId,
    problem_type: ev.problemType || null,
    correct: !!ev.correct,
    time_ms: Number.isFinite(ev.timeMs) ? Math.round(ev.timeMs) : null,
    hints_used: ev.hintsUsed || 0,
    attempt_no: ev.attemptNo || 1,
    is_diagnostic: !!ev.isDiagnostic,
    is_review: !!ev.isReview,
    params_version: PARAMS_VERSION,
  };
  if (Number.isFinite(ev.taps)) row.taps = Math.round(ev.taps);
  // Intentionally not awaited — fire and forget. If the taps column hasn't been
  // migrated yet, retry once without it rather than losing the event.
  supabase.from('response_events').insert(row)
    .then(({ error }) => {
      if (error && 'taps' in row) {
        const { taps, ...basic } = row;
        return supabase.from('response_events').insert(basic);
      }
      if (error && import.meta.env?.DEV) console.debug('telemetry drop:', error.message);
    })
    .then(res => { if (res?.error && import.meta.env?.DEV) console.debug('telemetry drop:', res.error.message); })
    .catch(() => { /* swallow */ });
}

export { PARAMS_VERSION };
