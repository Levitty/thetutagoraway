// ============================================================================
// HINTS MUST NOT GIVE AWAY THE ANSWER
//
// Regression test for the two rounds of leaks found in live testing:
//   "Which congruence test proves..."  → hint listed the answer
//   "40 × 6 = ?"                       → hint said "so 40 × 6 = 240"
//   "Shade the grid to show 0.32"      → hint said "shade 32 squares"
//
// Problems are randomly generated, so a leak can hide in one parameter draw
// out of fifty. Every skill is therefore sampled many times.
//
// REVIEWED EXCEPTIONS are listed below with a reason each. They are all
// classification or recall questions where stating the rule IS the teaching —
// a real teacher answering "is 97° acute, right or obtuse?" would also say
// "more than 90° is obtuse". Anything NOT on this list that leaks is a bug.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';

// Problems are randomly generated, so an unseeded test is a lottery: a leak
// that appears in one parameter draw out of hundreds makes CI fail on Tuesday
// and pass on Wednesday. We therefore drive Math.random from a fixed set of
// seeds — the coverage is broad AND every run is identical, so a failure can
// be reproduced and fixed instead of being re-run until it goes away.
const SEEDS = [1, 7, 13, 42, 99, 2026];
const DRAWS_PER_SEED = 40;

function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;  s >>>= 0;
    return s / 4294967296;
  };
}

// Run `fn` with Math.random replaced, always restoring it afterwards.
function withSeed(seed, fn) {
  const real = Math.random;
  Math.random = seeded(seed);
  try { return fn(); } finally { Math.random = real; }
}

const REVIEWED = {
  G3_POSITION: 'left/right from the walker\u2019s point of view — the hint has to name both sides to explain the swap, and naming both gives neither away',
  G11_LINEAR_PROGRAMMING: 'the hint lists every corner to test — naming all the candidates gives none of them away, and testing them is the skill',
  G8_SEQUENCES: 'the common difference is shown, and on some draws it happens to equal the term being asked for',
  G8_LINEAR_GRAPHS: 'the gradient is shown in the substitution, and on some draws it equals the y-value being asked for',
  G9_QUADRATIC_GRAPHS: 'the line of symmetry is shown, and on some draws its x-value equals the minimum y',
  G1_LINES: 'straight/curved classification — the hint defines the two words',
  G2_LINES: 'straight/curved classification — the hint defines the two words',
  G1_COUNTING: 'both compared numbers must be named to ask the question at all',
  G4_ANGLES: 'acute/right/obtuse classification — applying the stated rule is the skill',
  G5_ANGLES_INTRO: 'acute/right/obtuse classification',
  G6_ANGLE_MEASURE: 'acute/right/obtuse classification',
  G8_CONGRUENCE: 'names the four tests (SSS/SAS/ASA/RHS); choosing between them is the skill',
  G9_SCATTER_PLOTS: 'positive/negative correlation — the hint defines both directions',
  G12_CORRELATION_REGRESSION: 'describing r — the hint defines the scale',
  G12_HYPOTHESIS_TESTING: 'reject/accept — the hint states the decision rule to apply',
  G8_TRANSFORMATIONS_INTRO: 'hint restates the ORIGINAL point; digits coincide with the image',
  G9_TRANSFORMATIONS_ADV: 'hint restates the ORIGINAL point; digits coincide with the image',
};

const norm = (s) => String(s ?? '').toLowerCase()
  .replace(/−/g, '-').replace(/\s+/g, '').replace(/,/g, '');

// Digit-boundary containment: "144" must not match inside "1440".
// A hint that merely QUOTES THE QUESTION reveals nothing the child cannot
// already see ("Work out how far clockwise N 14° E is" restates the prompt),
// so a match that also appears in the question does not count as a leak.
const revealed = (answer, hint, question) => {
  const a = norm(answer);
  // Only a SINGLE character is too collision-prone to judge. Skipping every
  // 1-2 character answer hid a real leak for months — Grade 4 and 5 answers are
  // mostly two digits ("98 ÷ 7 = ?" with the hint "7 × 14 = 98.").
  if (a.length < 2) return false;
  const esc = a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Boundaries depend on what kind of answer it is, or the looser rule reports
  // noise instead of leaks:
  //   a word     — whole words only, so "no" does not match inside "No long
  //                division needed".
  //   a negative — the sign must not be a subtraction or a formula's own minus,
  //                so "-1" does not match inside "(n-1)" or "a = -9".
  //   a number   — digit boundaries, so "144" does not match inside "1440".
  const isWord = /^[a-z][a-z\s'-]*$/.test(a);
  const isNeg = /^-/.test(a);
  const pre = isWord ? '\\b' : isNeg ? '(?<![\\w.])' : /^[\d.]/.test(a) ? '(?<![\\d./])' : '';
  const post = isWord ? '\\b' : /[\d.]$/.test(a) ? '(?![\\d.])' : '';
  const re = new RegExp(pre + esc + post);

  // A hint that merely QUOTES THE QUESTION reveals nothing the child cannot
  // already see, so a match that also appears in the question does not count.
  // The question side is deliberately LOOSE — a plain containment check. The
  // strict boundaries above exist to avoid false alarms in the hint; applying
  // them to the question has the opposite effect, refusing to excuse a number
  // the child is plainly looking at ("Place -1 on the number line" hinting
  // "-1 is 1 step to the left of 0").
  return re.test(norm(hint)) && !norm(question).includes(a);
};

test('no hint reveals its own answer', () => {
  const offenders = [];
  for (const id of Object.keys(SKILLS)) {
    if (REVIEWED[id]) continue;
    let found = null;
    for (const seed of SEEDS) {
      if (found) break;
      withSeed(seed, () => {
        for (let i = 0; i < DRAWS_PER_SEED && !found; i++) {
          let p;
          try { p = generateProblem(id); } catch { continue; }
          if (!p || p.placeholder) continue;
          const answers = [p.answer, ...(p.accepts || [])];
          const hints = (p.hints || [p.hint]).filter(Boolean);
          for (const h of hints) {
            const hit = answers.find(a => revealed(a, h, p.question));
            if (hit) {
              found = `${id} (seed ${seed}): answer ${JSON.stringify(hit)} appears in hint ${JSON.stringify(h)}\n    Q: ${p.question}`;
              break;
            }
          }
        }
      });
    }
    if (found) offenders.push(found);
  }
  assert.deepEqual(offenders, [], `\n  ${offenders.join('\n  ')}\n`);
});

test('reviewed exceptions still exist (so the list cannot rot)', () => {
  const missing = Object.keys(REVIEWED).filter(id => !SKILLS[id]);
  assert.deepEqual(missing, [], `these skills were renamed or removed: ${missing.join(', ')}`);
});
