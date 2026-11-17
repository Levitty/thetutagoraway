// What each pretend child knows, and the one misconception it holds (step 6 of PLAN_TO_FOUR.md).
// The misconceptions come from the table in Tutagora/Build/voice-tutor/training/PLAYBOOK.md ("Fractions-specific");
// four are scenario-specific (scenarios 13, 14, 22, 23 already describe their own mistake) and are marked `custom`.
// The child model is told its sheet and its misconception as a belief, never as a script, and never sees the
// scenario's `expect` or `limit` (those belong to the judge).

/** triggers: when the tutor's last words touch the idea, the child answers by its rule (until the tutor repairs it). */
export const MISCONCEPTIONS = {
  BIGGER_BOTTOM: {
    belief: 'You think the fraction with the bigger bottom number is the bigger fraction: 1/8 is bigger than 1/4 because 8 is more than 4. If asked why, you say the bottom number is bigger.',
    triggers: /\b(bigger|larger|smaller|more|less|compare|which is|greater|biggest|smallest|eighth|quarter|third)s?\b/i,
  },
  BIGGER_NUMBERS: {
    belief: 'You think bigger numbers mean a bigger fraction, so 5/12 is more than 2/3 because 5 and 12 are bigger than 2 and 3. You do not think about "more or less than a half".',
    triggers: /\b(bigger|larger|more|less|compare|which is|greater)\b/i,
  },
  ADD_TOPS_BOTTOMS: {
    belief: 'When you add fractions you add the tops and add the bottoms: 1/2 plus 1/4 is 2/6. If asked how, you say "add the top, add the bottom".',
    triggers: /\b(add|plus|together|sum|altogether|total|and then)\b/i,
  },
  EQUIV_ADD: {
    belief: 'You make equivalent fractions by adding the same number to the top and the bottom: 2/3 is the same as 5/6 because you added 3 to both.',
    triggers: /\b(equivalent|same as|equal to|same amount|same size|name|rename|missing number)\b/i,
  },
  EQUIV_BOTTOM_ONLY: {
    belief: 'You think you can change only the bottom number and keep the same amount: 3/4 is the same as 3/8, because the top stays 3.',
    triggers: /\b(equivalent|same as|equal to|same amount|same size|eighth|cut|split|fold|more pieces)\b/i,
  },
  UNEQUAL_PARTS: {
    belief: 'You count parts without checking they are the same size: a bar cut into 4 unequal pieces still shows fourths to you.',
    triggers: /\b(part|parts|piece|pieces|equal|fair|cut|split|share|fraction)\b/i,
  },
  DIFFERENT_WHOLES: {
    belief: 'You think half of anything is more than a quarter of anything, even when the wholes are different sizes (half a mandazi is more than a quarter of a cake).',
    triggers: /\b(half|quarter|whole|of the|of a|of what|mandazi|cake|chapati|loaf)\b/i,
  },
  ONE_PART_SHORT: {
    belief: 'You think 2/3 and 3/4 are equal, because each is "one part short" of a whole.',
    triggers: /\b(missing|short|left over|bigger|compare|which is|close to|whole)\b/i,
  },
  SIMPLIFY_SMALLER: {
    belief: 'You think a simplified fraction is a smaller amount: 2/3 of the rice is less than 8/12 because the numbers are smaller.',
    triggers: /\b(simpl|lowest|smaller numbers|same amount|more, less|more or less)\b/i,
  },
  DROP_BOTTOM: {
    belief: 'When you add fractions with the same bottom you add the bottoms away: 2/8 plus 3/8 is 5, or 5/16. If asked, you say you just added the numbers.',
    triggers: /\b(add|plus|together|altogether|total|eighth|quarter|sixth)s?\b/i,
  },
  // ---- scenario-specific (custom): these come from the scenario's own behaviour
  FLIP_FRACTION: {
    custom: true,
    belief: 'You count shaded and total parts correctly, but when you write the fraction you put the total over the shaded: 3 of 8 shaded becomes "eight over three". You do not notice.',
    triggers: /\b(write|fraction|name|say it as|how much|what fraction|shaded)\b/i,
  },
  TOP_ONLY: {
    custom: true,
    belief: 'You read a fraction by its top number only: "two quarters" means shade 2 parts of whatever the picture has, even 8.',
    triggers: /\b(shade|colour|color|tap|show|quarter|half|eighth|third|fraction)s?\b/i,
  },
  NO_HALF: {
    custom: true,
    belief: 'You are not sure what a half is. You mix up half and whole, and you are not sure parts must be equal, so equivalent fractions mean nothing to you.',
    triggers: /\b(half|whole|equal|part|equivalent|same)\b/i,
  },
};

const DEFAULT_KNOWS = [
  'a whole thing can be shared into equal parts',
  'half and quarter, said in words, with a picture in front of you',
  'counting shaded parts and total parts on a bar that is cut fairly',
  'that 1/2 means one of two equal parts',
];
const DEFAULT_SHAKY = [
  'eighths and sixths (you mix them up with the numbers on the board)',
  'comparing two fractions without a picture',
  'adding fractions with different bottoms',
  'writing the fraction from a picture, sometimes the other way up',
];

// One sheet per scenario: the misconception, the target error rate, a cap on words, and how it behaves.
//   errorRate  share of checkable claims (an actual answer) the child gets wrong; humans& Persimmon: 25 to 30% for real learners
//   behaviour  true: the scenario is about how the child acts (it complains, asks, wanders); the harness lets the model play that
//              behaviour on every turn and does not insert its own acknowledgements and "I don't know"s
//   repairKinds how many different kinds of picture the tutor must show before the misconception lets go (default 1)
//   maxWords   hard word cap for this child (default 12)
//   persist    turns the wrong idea is held after it first shows, whatever the tutor draws (default 2)
//   tires      { from, to }: the child tires from child turn `from` to `to` (shorter replies, says so; scenario 41)
//   noImprove  true: the wrong idea is never let go (the non-improving child, READING_12NOV.md change 4)
const M = (misc, extra = {}) => ({ misc, errorRate: 0.27, behaviour: false, repairKinds: 1, ...extra });
export const SHEETS = {
  1: M('EQUIV_BOTTOM_ONLY'),
  2: M('UNEQUAL_PARTS'),
  3: M('BIGGER_BOTTOM', { maxWords: 14 }),
  4: M('ADD_TOPS_BOTTOMS', { behaviour: true }),
  5: M('ONE_PART_SHORT', { behaviour: true }),
  6: M('BIGGER_NUMBERS', { maxWords: 2 }),
  7: M('UNEQUAL_PARTS', { behaviour: true, errorRate: 0.4, doesNotKnow: ['what "equal parts" means'] }),
  8: M('EQUIV_ADD', { behaviour: true }),
  9: M('BIGGER_BOTTOM', { errorRate: 0.4, behaviourNote: 'bottom number bigger means bigger fraction' }),
  10: M('ADD_TOPS_BOTTOMS', { errorRate: 0.4 }),
  11: M('EQUIV_BOTTOM_ONLY', { errorRate: 0.4 }),
  12: M('EQUIV_ADD', { errorRate: 0.3 }),
  13: M('FLIP_FRACTION', { errorRate: 0.35 }),
  14: M('NO_HALF', { errorRate: 0.55, doesNotKnow: ['what a half is', 'that parts must be equal'] }),
  15: M('BIGGER_BOTTOM', { errorRate: 0.55, repairKinds: 3 }),
  16: M('DROP_BOTTOM', { errorRate: 0.08, maxWords: 14 }),
  17: M('SIMPLIFY_SMALLER', { errorRate: 0.22, maxWords: 10 }),
  18: M('ADD_TOPS_BOTTOMS', { behaviour: true }),
  19: M('DIFFERENT_WHOLES', { behaviour: true }),
  20: M('BIGGER_BOTTOM', { behaviour: true, errorRate: 0.4 }),
  21: M('UNEQUAL_PARTS', { behaviour: true }),
  22: M('EQUIV_BOTTOM_ONLY', { behaviour: true, errorRate: 0.85, answerBy: 'write' }),
  23: M('TOP_ONLY', { behaviour: true, errorRate: 0.85, answerBy: 'shade' }),
  24: M('ONE_PART_SHORT', { behaviour: true }),
  25: M('BIGGER_NUMBERS', { behaviour: true }),
  26: M('EQUIV_ADD', { behaviour: true }),
  27: M('DROP_BOTTOM', { errorRate: 0.1 }),
  28: M('SIMPLIFY_SMALLER', { behaviour: true }),
  29: M('BIGGER_BOTTOM'),
  30: M('BIGGER_BOTTOM', { maxWords: 12 }),
  // 31 to 41 (READING_12NOV.md change 3). 34 to 40 are scripted: the sheet only matters for the turns the model plays.
  31: M('ADD_TOPS_BOTTOMS', { behaviour: true, errorRate: 0.5, persist: 4 }),
  32: M('ADD_TOPS_BOTTOMS', { behaviour: true, errorRate: 0.6, persist: 5, repairKinds: 2 }),
  33: M('EQUIV_BOTTOM_ONLY', { behaviour: true }),
  34: M('BIGGER_BOTTOM'),
  35: M('BIGGER_BOTTOM'),
  36: M('BIGGER_BOTTOM'),
  37: M('BIGGER_BOTTOM'),
  38: M('EQUIV_ADD'),
  39: M('BIGGER_BOTTOM'),
  40: M('EQUIV_BOTTOM_ONLY'),
  // 41: the child tires; the harness lets the model play the tiredness on every turn, and shortens the cap as it goes (see child.mjs fatigue)
  41: M('BIGGER_BOTTOM', { behaviour: true, maxWords: 10, errorRate: 0.3, tires: { from: 12, to: 30 } }),
};

export const DEFAULT_SHEET = M('BIGGER_BOTTOM');
export const sheetFor = (sc) => {
  const s = SHEETS[sc.n] || DEFAULT_SHEET;
  return { ...s, ...(MISCONCEPTIONS[s.misc] ? { mis: MISCONCEPTIONS[s.misc] } : {}), knows: DEFAULT_KNOWS, shaky: DEFAULT_SHAKY, doesNotKnow: s.doesNotKnow || [] };
};
