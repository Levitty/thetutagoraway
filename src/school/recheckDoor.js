// ============================================================================
// CLASS RE-CHECKS, the door action `class_rechecks` (12 Nov 2026).
//
// The owner chose "automatic" for homework re-checks: Tuta sends the class's learner references, HOREB reads those
// learners' evidence and says which skills at least 25% of the class (and at least 3 children) are due to re-check.
//
//   POST school-practice (signed like every door call)
//   { action: "class_rechecks", learner_refs: ["ABCD2345", ...], max?: 2 }
//   -> { success: true, learners, with_evidence, rechecks: [{ cskill, due, of, overdue }] }
//
// No names cross, and no per-learner answer comes back: only skills and counts. The evidence is everything the log
// holds for the learner: school homework and exams (door_id + learner_ref), and practice where the learner is
// linked to a HOREB child. The rules are recheck.js classRechecks; this file only gathers the rows.
//
// store: learnerEvidence(doorId, learnerRefs) -> { [learner_ref]: evidence rows }
// ============================================================================
import { classRechecks } from '../learner/recheck.js';
import { isCurriculumSkill } from './homework.js';

export const CLASS_MAX_LEARNERS = 300;
const REF = /^[A-Z2-9]{8}$/;
const ok = (body) => ({ status: 200, body: { success: true, ...body } });
const no = (status, error) => ({ status, body: { success: false, error } });

/** The `class_rechecks` action. Returns null when the action is not this one. */
export async function doorClassRechecks(door, p, deps) {
  if (p.action !== 'class_rechecks') return null;
  const refs = [...new Set((Array.isArray(p.learner_refs) ? p.learner_refs : []).map(String).filter(r => REF.test(r)))];
  if (!refs.length) return no(400, 'No learners given');
  if (refs.length > CLASS_MAX_LEARNERS) return no(413, `${CLASS_MAX_LEARNERS} learners at most in one call`);
  const max = Math.min(5, Math.max(1, Math.floor(Number(p.max)) || 2));
  const byLearner = await deps.store.learnerEvidence(door.id, refs);
  const rechecks = classRechecks(byLearner, { now: deps.now ? deps.now() : Date.now(), max: 20 })
    .filter(c => isCurriculumSkill(c.cskill)).slice(0, max);   // only skills a homework can draw
  return ok({ learners: refs.length, with_evidence: Object.values(byLearner).filter(r => r && r.length).length, rechecks });
}
