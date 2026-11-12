// ============================================================================
// LEARNER STATES, the door action `learner_states` (12 Nov 2026), the read side of
// the Learner Intelligence Model (docs/learner-model.md, section 2).
//
// Tuta shows HOREB's five mastery states in words, so there is one rule set: this one
// (src/learner/mastery.js). Tuta sends the class's learner references; HOREB reads each
// learner's evidence and returns, per learner, the state of every skill and outcome.
//
//   POST school-practice (signed like every door call)
//   { action: "learner_states", learner_refs: ["ABCD2345", ...] }
//   -> { success: true, learners, with_evidence, states: { [learner_ref]: {
//        skills:   [{ code, state, word, due, marks, reason? }],
//        outcomes: [{ code, state, word, due, skills, reason? }] } } }
//
//   state  not_assessed | not_enough | emerging | developing | mastered
//   word   the words to show; "Mastered, due a re-check" when a re-check is overdue
//   due    true when the word is the re-check one
//   marks  how many marked answers the state rests on (a count, never the answers)
//   reason one plain sentence, only when 5 learners or fewer are asked for (a single child's page)
//
// No names cross, and no answer comes back: only codes, states and counts. A learner with no
// evidence is simply absent. Rows are everything the log holds for the learner (school homework,
// school exams, linked practice), as class_rechecks reads them. Batched: one call per page.
//
// store: learnerEvidence(doorId, learnerRefs) -> { [learner_ref]: evidence rows }
// ============================================================================
import { learnerMastery, MASTERED_DUE_WORDS } from '../learner/mastery.js';

export const STATES_MAX_LEARNERS = 300;
export const STATES_REASON_MAX_LEARNERS = 5;
const REF = /^[A-Z2-9]{8}$/;
const ok = (body) => ({ status: 200, body: { success: true, ...body } });
const no = (status, error) => ({ status, body: { success: false, error } });

/** One learner's evidence rows to the compact states payload. */
export function statesFor(rows, { now, withReason = false } = {}) {
  const m = learnerMastery(rows, { now });
  const skills = m.skills.map((s) => ({
    code: s.key, state: s.state, word: s.word, due: !!s.dueRecheck, marks: s.marks, ...(withReason ? { reason: s.reason } : {}),
  }));
  const outcomes = m.outcomes.map((o) => ({
    code: o.code, state: o.state, word: o.word, due: o.word === MASTERED_DUE_WORDS,
    skills: o.skillKeys.length, ...(withReason ? { reason: o.reason } : {}),
  }));
  return { skills, outcomes };
}

/** The `learner_states` action. Returns null when the action is not this one. */
export async function doorLearnerStates(door, p, deps) {
  if (p.action !== 'learner_states') return null;
  const refs = [...new Set((Array.isArray(p.learner_refs) ? p.learner_refs : []).map(String).filter(r => REF.test(r)))];
  if (!refs.length) return no(400, 'No learners given');
  if (refs.length > STATES_MAX_LEARNERS) return no(413, `${STATES_MAX_LEARNERS} learners at most in one call`);
  const byLearner = await deps.store.learnerEvidence(door.id, refs);
  const now = deps.now ? deps.now() : Date.now();
  const withReason = refs.length <= STATES_REASON_MAX_LEARNERS;
  const states = {};
  for (const ref of refs) {
    const rows = byLearner[ref];
    if (rows && rows.length) states[ref] = statesFor(rows, { now, withReason });
  }
  return ok({ learners: refs.length, with_evidence: Object.keys(states).length, states });
}
