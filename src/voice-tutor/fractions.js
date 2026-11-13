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
 * @param {object} [model]    readSkills() of the learner's evidence, or null (then HOREB progress alone decides)
 * @returns {{ target:string, prerequisite:string|null, profile:object[], reason:string }}
 */
export function pickTarget(progress, override = null, model = null) {
  // With evidence in the learner model (src/learner/model.js) the states decide; a skill with none keeps today's HOREB progress.
  const profile = FRACTION_SKILLS.map((c) => {
    const base = strengthOf(progress, c);
    const m = model?.skills?.[c];
    if (!model?.hasEvidence || !m || m.state === 'not_assessed') return base;
    const held = m.secure || (base.held && m.state !== 'emerging');
    return { ...base, held, score: held ? (m.secure ? m.score : 0.9) : (m.score ?? base.score), state: m.state, word: m.word };
  });
  const by = Object.fromEntries(profile.map((p) => [p.skill, p]));
  let target = override && FRACTION_SKILLS.includes(override) ? override : null;
  let reason = target ? 'chosen by the tester' : '';
  if (!target) {
    const next = profile.find((p) => !p.held);
    target = next ? next.skill : FRACTION_SKILLS[FRACTION_SKILLS.length - 1];
    reason = next ? (model?.hasEvidence ? 'the first fraction skill not yet secure, from the learner\'s evidence' : 'the first fraction skill not yet held') : 'every fraction skill is held: revision of the last one';
  }
  const weak = prerequisitesOf(target).map((c) => by[c]).filter((p) => p && !p.held).sort((a, b) => a.score - b.score);
  return { target, prerequisite: weak[0]?.skill || null, profile, reason };
}

/** The lesson's skills: the target and all its fraction prerequisites. */
export const lessonSkills = (target) => [target, ...prerequisitesOf(target)];

/** Full misconception codes allowed for the lesson (record_diagnosis, ask.wrong). */
export const allowedMisconceptions = (skills) => skills.flatMap((c) => (SKILLS_G5[c]?.mis || []).map((m) => `${c}.${m}`));


// ---------------------------------------------------------------- the lesson's frame, as a teacher says it (13 Nov 2026)
// A teacher opens with the goal ("today we are learning ...") and one question on what the child already knows, and
// closes with a summary, what the child can now do and what comes next (SCENARIOS.md scenario 30). Plain words for a
// ten-year-old, by skill (the last part of its code): `today` finishes "Today we are learning ...", `prior` is the one
// question on what the child already knows (about the earlier idea, never the answer to the lesson), `can` finishes
// "Now you can ...", `next` names the skill in a few words for "Next time we will ...".
export const LESSON_FRAMES = {
  EQUIVALENT_FRACTIONS: { today: 'about fractions that look different but are the same amount', prior: 'What do you already know about a half?', can: 'show two fractions that are the same amount, with a picture', next: 'equivalent fractions' },
  SIMPLIFY_FRACTIONS: { today: 'to write a fraction in its simplest form', prior: 'What do you already know about fractions that are the same amount?', can: 'make a fraction simpler without changing how much it is', next: 'simplest form' },
  COMPARE_LIKE_FRACTIONS: { today: 'to tell which of two fractions is bigger', prior: 'What do you already know about the top and bottom numbers of a fraction?', can: 'tell which fraction is bigger when the pieces are the same size', next: 'comparing fractions' },
  COMPARE_UNLIKE_FRACTIONS: { today: 'to compare fractions with different bottom numbers', prior: 'What do you already know about pieces when a whole is cut into more parts?', can: 'compare two fractions by making their pieces the same size', next: 'comparing fractions with different bottom numbers' },
  ORDER_FRACTIONS: { today: 'to put fractions in order, smallest to biggest', prior: 'What do you already know about comparing two fractions?', can: 'put fractions in order from smallest to biggest', next: 'ordering fractions' },
  ADD_SAME_DENOMINATOR: { today: 'to add fractions with the same bottom number', prior: 'What do you already know about the bottom number of a fraction?', can: 'add two fractions when the pieces are the same size', next: 'adding fractions' },
  SUBTRACT_SAME_DENOMINATOR: { today: 'to take away fractions with the same bottom number', prior: 'What do you already know about the bottom number of a fraction?', can: 'take one fraction from another when the pieces are the same size', next: 'taking away fractions' },
  ADD_ONE_RENAMING: { today: 'to add fractions when the pieces are different sizes', prior: 'What do you already know about adding fractions with the same bottom number?', can: 'rename one fraction so the pieces match, then add', next: 'adding fractions with different pieces' },
  SUBTRACT_ONE_RENAMING: { today: 'to take away fractions when the pieces are different sizes', prior: 'What do you already know about taking away fractions with the same bottom number?', can: 'rename one fraction so the pieces match, then take away', next: 'taking away fractions with different pieces' },
};
/** The frame for a target skill: { today, prior, can, next: the skill that builds on it (or more practice), goal: the sentence }. */
export function lessonFrame(target) {
  const code = String(target || '').split('.').pop();
  const f = LESSON_FRAMES[code] || LESSON_FRAMES.EQUIVALENT_FRACTIONS;
  const after = FRACTION_SKILLS.find((c) => (SKILLS_G5[c]?.pre || []).includes(target) && LESSON_FRAMES[String(c).split('.').pop()]);
  const next = after ? LESSON_FRAMES[String(after).split('.').pop()].next : `more practice with ${f.next}`;
  return { ...f, next, goal: `Today we are learning ${f.today}.` };
}

export default { lessonFrame, LESSON_FRAMES, FRACTION_SKILLS, pickTarget, lessonSkills, allowedMisconceptions, prerequisitesOf, strengthOf, skillName };
