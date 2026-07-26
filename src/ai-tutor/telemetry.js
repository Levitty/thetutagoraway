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
 * @param {number}  [ev.scaffold]  faded-example support level the problem was
 *                             answered at (0 guided … 3 solo) — separates
 *                             assisted from independent performance
 * @param {number}  [ev.confidence]  engine's prior confidence in this skill
 *                             (|evidence| before the answer) — calibration
 *                             signal for population learning
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
  if (Number.isFinite(ev.scaffold)) row.scaffold = Math.round(ev.scaffold);
  // How sure the engine already was about this skill BEFORE the answer (0 = no
  // prior evidence). The population signal for later calibration: across many
  // learners, how well does pre-answer confidence predict the actual answer?
  if (Number.isFinite(ev.confidence)) row.confidence = Math.round(ev.confidence * 1000) / 1000;
  // Intentionally not awaited — fire and forget. If an optional column hasn't
  // been migrated yet, retry once without the optional fields rather than
  // losing the event.
  supabase.from('response_events').insert(row)
    .then(({ error }) => {
      if (error && ('taps' in row || 'scaffold' in row || 'confidence' in row)) {
        const { taps, scaffold, confidence, ...basic } = row;
        return supabase.from('response_events').insert(basic);
      }
      if (error && import.meta.env?.DEV) console.debug('telemetry drop:', error.message);
    })
    .then(res => { if (res?.error && import.meta.env?.DEV) console.debug('telemetry drop:', res.error.message); })
    .catch(() => { /* swallow */ });
}

export { PARAMS_VERSION };
