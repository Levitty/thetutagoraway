// ============================================================================
// WHAT THE TUTOR TEACHES: Grade 5 fractions, from the curriculum map.
//
// The skills, their prerequisites (`pre`) and their misconceptions come from
// curriculum/mathematics/g5.json through the generated curriculumMap.g5.js;
// nothing is restated here. The child's strength on a skill is read from her
// HOREB progress (the live JavaScript engine: isHeld on the skill's HOREB id).
//
//   pickTarget(progress)   the first fraction skill she does not hold, and the
//                          weakest of its prerequisites she does not hold
//                          either (taught first, as the warm-up)
//   lessonSkills(target)   the target with every prerequisite, for the allowed
//                          misconception list and the probe bank
//
// The prototype reads mastery and only ADDS evidence (session.js); it never
// changes `mastered` (owner, 10 Nov 2026).
// ============================================================================
import { SKILLS_G5 } from '../ai-tutor/content/curriculumMap.g5.js';
import { isHeld } from '../ai-tutor/adaptiveEngine.js';

export const FRACTIONS_SUB = 'MATH.G5.NUMBER.FRACTIONS';

// Fraction skills in teaching order: each after its prerequisites, otherwise as the design lists them.
export const FRACTION_SKILLS = (() => {
  const codes = Object.keys(SKILLS_G5).filter((c) => SKILLS_G5[c].sub === FRACTIONS_SUB);
  const out = [];
  const visit = (c, seen = new Set()) => {
    if (out.includes(c) || seen.has(c)) return;
    seen.add(c);
    for (const p of SKILLS_G5[c].pre || []) if (codes.includes(p)) visit(p, seen);
    out.push(c);
  };
  codes.forEach((c) => visit(c));
  return out;
})();

export const skillName = (c) => SKILLS_G5[c]?.name || c;
export const shortName = (c) => String(c).split('.').pop();

/** Every fraction prerequisite of `c`, nearest first. */
export const prerequisitesOf = (c) => {
  const out = [];
  const walk = (x) => { for (const p of SKILLS_G5[x]?.pre || []) if (!out.includes(p) && SKILLS_G5[p]?.sub === FRACTIONS_SUB) { out.push(p); walk(p); } };
  walk(c);
  return out;
};

/** How strong she is on a curriculum skill, from its HOREB skill record. */
export const strengthOf = (progress, c) => {
  const id = SKILLS_G5[c]?.primary;
  const sp = progress?.skills?.[id];
  const attempts = sp?.attempts || 0;
  const accuracy = attempts ? (sp.correct || 0) / attempts : null;
  const held = isHeld(sp);
  // A score to rank weakness: held 1, tried and failing below an untried skill (0.4).
  const score = held ? 1 : accuracy == null ? 0.4 : Math.min(0.9, accuracy * 0.8);
  return { skill: c, horeb: id, held, attempts, accuracy, score };
};

/**
 * @param {object} progress   HOREB progress ({ skills: { G5_FRACTIONS_EQUIV: {...} } })
 * @param {string} [override] a curriculum skill code chosen by the tester
 * @returns {{ target:string, prerequisite:string|null, profile:object[], reason:string }}
 */
export function pickTarget(progress, override = null) {
  const profile = FRACTION_SKILLS.map((c) => strengthOf(progress, c));
  const by = Object.fromEntries(profile.map((p) => [p.skill, p]));
  let target = override && FRACTION_SKILLS.includes(override) ? override : null;
  let reason = target ? 'chosen by the tester' : '';
  if (!target) {
    const next = profile.find((p) => !p.held);
    target = next ? next.skill : FRACTION_SKILLS[FRACTION_SKILLS.length - 1];
    reason = next ? 'the first fraction skill not yet held' : 'every fraction skill is held: revision of the last one';
  }
  const weak = prerequisitesOf(target).map((c) => by[c]).filter((p) => p && !p.held).sort((a, b) => a.score - b.score);
  return { target, prerequisite: weak[0]?.skill || null, profile, reason };
}

/** The lesson's skills: the target and all its fraction prerequisites. */
export const lessonSkills = (target) => [target, ...prerequisitesOf(target)];

/** Full misconception codes allowed for the lesson (record_diagnosis, ask.wrong). */
export const allowedMisconceptions = (skills) => skills.flatMap((c) => (SKILLS_G5[c]?.mis || []).map((m) => `${c}.${m}`));

export default { FRACTION_SKILLS, pickTarget, lessonSkills, allowedMisconceptions, prerequisitesOf, strengthOf, skillName };
