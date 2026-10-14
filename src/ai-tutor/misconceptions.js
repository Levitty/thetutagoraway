// ============================================================================
// MISCONCEPTION LAYER — the diagnosis above the mastery model.
//
// BKT answers "does she know this skill?", one skill at a time. It cannot see
// that the SAME error is behind three different failures — that she mishandles
// negative signs in algebra, in geometry and in arithmetic. A human tutor spots
// that in one sitting. This layer is what lets the app spot it too.
//
// Three jobs:
//   1. MATCH   a wrong answer against the misconceptions the content author
//              anticipated ("if she answers 360 − a − b she has confused the
//              triangle rule with angles at a point").
//   2. TAG     that specific message into a cross-skill category, so the same
//              underlying error committed in different topics counts as one
//              pattern rather than three unrelated weak skills.
//   3. PROFILE accumulate the tags per learner, so a repeated pattern can be
//              named to the student and to their teacher.
//
// The 300-odd authored misconception messages that feed this were, until now,
// never shown to anyone: the lesson only ran a generic arithmetic diagnoser.
// Matching them is most of the value here.
// ============================================================================

import { normalizeMath } from './answerCheck.js';

// ---------------------------------------------------------------- taxonomy
// Deliberately small. A taxonomy a teacher cannot hold in their head is a
// taxonomy nobody acts on. Each entry carries the advice that follows from it,
// because naming a pattern without saying what to do about it is just a label.
export const TAXONOMY = {
  'wrong-operation': {
    label: 'Choosing the wrong operation',
    advice: 'Before calculating, say the story out loud: are we putting things together, taking away, sharing, or repeating groups?',
  },
  'sign-error': {
    label: 'Slips with negative signs',
    advice: 'Work signed questions on a number line for a while — subtracting a negative is a jump to the RIGHT.',
  },
  'place-value': {
    label: 'Confusing a digit with its value',
    advice: 'Keep a place-value chart beside her: the digit tells you WHICH, the column tells you HOW MUCH.',
  },
  'area-perimeter': {
    label: 'Mixing up area and perimeter',
    advice: 'Perimeter is the fence around the shamba; area is the ground inside it. Ask which one the question wants before starting.',
  },
  'formula-choice': {
    label: 'Reaching for the wrong formula',
    advice: 'Write the formula down first, before any numbers. Choosing it is a separate decision from using it.',
  },
  'fraction-procedure': {
    label: 'Fraction procedures applied wrongly',
    advice: 'Say the rule aloud before working: same denominator to add; flip the second to divide; multiply straight across.',
  },
  'incomplete': {
    label: 'Stopping before the last step',
    advice: 'After every answer, re-read the question and ask "is this what it actually asked for?"',
  },
  'ratio-direction': {
    label: 'Dividing or scaling the wrong way round',
    advice: 'Check the size: should the answer come out bigger or smaller than what you started with?',
  },
  'additive-not-multiplicative': {
    label: 'Adding where the situation multiplies',
    advice: 'For enlargements, ratios and percentages, ask "how many TIMES bigger?", not "how much bigger?".',
  },
  'units': {
    label: 'Units and conversions',
    advice: 'Write the unit next to every number as you work, not just at the end.',
  },
  'rule-confusion': {
    label: 'Mixing up two similar rules',
    advice: 'Put the two rules side by side and name what makes each one apply — the difference is usually one word in the question.',
  },
};

// ------------------------------------------------------------- classifying
// Maps an authored feedback message to a taxonomy tag. Content may state its
// own `tag` (which always wins); everything else is classified from the words
// the author used, which are consistent because they describe real errors.
const RULES = [
  [/sign|negative|minus sign|opposite of/i, 'sign-error'],
  [/perimeter|around the edge/i, 'area-perimeter'],
  [/that.s the digit|its value is|place value|column/i, 'place-value'],
  [/denominator|numerator|flip|reciprocal|across the top|simplif/i, 'fraction-procedure'],
  [/scale factor|enlarge|times bigger|multiplies lengths|proportion/i, 'additive-not-multiplicative'],
  [/the other way|divided by|wrong way|rise over run|opposite ÷|÷ adjacent/i, 'ratio-direction'],
  [/only the|you stopped|still need|forgot the|don.t forget|also has|remember to add/i, 'incomplete'],
  [/formula|πr|2πr|surface area|volume|circumference/i, 'formula-choice'],
  [/unit|cm|metre|convert|kg|litre/i, 'units'],
  [/not 360|not 180|sum to|is for|belongs to|that is for|instead of the/i, 'rule-confusion'],
  [/add|subtract|multiply|divide|times|plus|minus|groups/i, 'wrong-operation'],
];

export function classifyMisconception(feedback, explicitTag = null) {
  if (explicitTag && TAXONOMY[explicitTag]) return explicitTag;
  const text = String(feedback || '');
  for (const [re, tag] of RULES) if (re.test(text)) return tag;
  return 'rule-confusion';
}

// ----------------------------------------------------------------- matching
// Does this wrong answer match one the author anticipated?
export function matchMisconception(problem, studentAnswer) {
  const list = problem?.misconceptions;
  if (!Array.isArray(list) || !list.length) return null;
  const given = normalizeMath(studentAnswer);
  if (!given) return null;
  for (const m of list) {
    if (m?.when == null) continue;
    if (normalizeMath(m.when) === given) {
      return { feedback: m.feedback, tag: classifyMisconception(m.feedback, m.tag) };
    }
  }
  return null;
}

// ------------------------------------------------------------------ profile
// Stored on `progress.misconceptions` so it syncs with everything else — no
// migration, and the teacher dashboard already reads progress.
//   { [tag]: { n, skills: [skillId], last: ISO } }
export function recordMisconception(profile, tag, skillId) {
  if (!tag) return profile || {};
  const p = { ...(profile || {}) };
  const cur = p[tag] || { n: 0, skills: [], last: null };
  const skills = cur.skills.includes(skillId) ? cur.skills : [...cur.skills, skillId].slice(-12);
  p[tag] = { n: cur.n + 1, skills, last: new Date().toISOString() };
  return p;
}

// A pattern worth naming: it must have happened repeatedly AND in more than
// one skill. One repeated slip inside a single topic is just that topic being
// hard; the same error across topics is a habit, and habits are teachable.
const MIN_OCCURRENCES = 3;
const MIN_SKILLS = 2;

export function topPatterns(profile, limit = 3) {
  if (!profile) return [];
  return Object.entries(profile)
    .filter(([tag, v]) => TAXONOMY[tag] && v.n >= MIN_OCCURRENCES && v.skills.length >= MIN_SKILLS)
    .sort((a, b) => b[1].n - a[1].n)
    .slice(0, limit)
    .map(([tag, v]) => ({
      tag,
      label: TAXONOMY[tag].label,
      advice: TAXONOMY[tag].advice,
      count: v.n,
      skillCount: v.skills.length,
      skills: v.skills,
      last: v.last,
    }));
}

export default { TAXONOMY, classifyMisconception, matchMisconception, recordMisconception, topPatterns };
