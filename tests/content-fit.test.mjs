// ============================================================================
// CONTENT FIT — does a skill ask what its name says it asks?
//
// tests/difficulty.test.mjs already pins the arithmetic builders, because they
// attach a `band` descriptor it can read. Everything else was unguarded, and
// that is where these were hiding:
//
//   "Counting & Numbers (1–50)"   asked about 98, and was therefore the same
//                                 skill as Grade 2's "Whole Numbers (to 100)"
//   "Subtraction (Single Digit)"  asked 57 − 8, because maxOperand stopped
//                                 binding once digitsA was set
//   "Place Value (Millions)"      never showed a million, and topped out
//                                 LOWER than Grade 5's "Place Value
//                                 (Thousands)" — the Grade 6 rung was easier
//                                 than the Grade 5 one
//   "Squares (1-12)"              asked 15²
//
// None of these broke anything. A learner answered an easier question than
// the label promised, was credited with the harder skill, and was placed too
// high — the diagnostic measuring the wrong thing in the direction that hurts.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';

const DRAWS = 80;

/** The numbers a skill actually puts on the page, over many draws. */
const numbersFrom = (id, draws = DRAWS) => {
  const all = [];
  for (let i = 0; i < draws; i++) {
    let p;
    try { p = generateProblem(id); } catch { continue; }
    if (!p || p.placeholder) continue;
    for (const n of (String(p.question).replace(/,/g, '').match(/\d+(?:\.\d+)?/g) || [])) all.push(Number(n));
  }
  return all;
};
const maxOf = (id, draws) => numbersFrom(id, draws).reduce((m, n) => Math.max(m, n), 0);

// ---- explicit claims: a number in the name is a ceiling -------------------

test('a skill whose name names a ceiling does not go past it', () => {
  const claims = [
    ['G1_COUNTING', 50, 'Counting & Numbers (1–50)'],
    ['G2_COUNTING', 100, 'Whole Numbers (to 100)'],
    ['G6_SQUARES', 12, 'Squares (1-12)'],
  ];
  for (const [id, ceiling, label] of claims) {
    const max = maxOf(id);
    assert.ok(max > 0, `${id} generated no numbers at all`);
    assert.ok(max <= ceiling, `${id} "${label}" promises ${ceiling} but asked about ${max}`);
  }
});

test('a Grade 1 subtraction stays inside the band its rungs describe', () => {
  // Its KP ladder is "within 9, then teens minus single digit (to 18)". The
  // cap stopped binding once digitsA was set, so it served 2-digit work.
  const max = maxOf('G1_SUB');
  assert.ok(max > 0, 'G1_SUB generated nothing');
  assert.ok(max <= 18, `G1_SUB is single-digit then teens, but asked about ${max}`);
});

// ---- family claims: a rung named for a place must reach that place --------

test('a place-value rung reaches the place it is named after', () => {
  // The check that would have caught "Millions" never showing a million.
  // A ceiling alone cannot: the questions were well under it.
  const reaches = [
    ['G6_PLACE_VALUE', 1e6, 'Millions'],
    ['G7_PLACE_VALUE', 1e8, 'Hundred Millions'],
  ];
  for (const [id, floor, label] of reaches) {
    const max = maxOf(id);
    assert.ok(max >= floor, `${id} is named for ${label} but never got past ${max.toLocaleString('en-US')}`);
  }
});

// ---- the ladders: each rung harder than the one below ---------------------

const ladderIsStrict = (ids) => {
  const maxes = ids.map((id) => [id, maxOf(id)]);
  const broken = [];
  for (let i = 1; i < maxes.length; i++) {
    const [loId, lo] = maxes[i - 1];
    const [hiId, hi] = maxes[i];
    if (!(hi > lo)) broken.push(`${loId} (max ${lo}) is not below ${hiId} (max ${hi})`);
  }
  return broken;
};

test('place value gets harder every grade it is taught', () => {
  // G5 and G6 both called buildPlaceValueChart() bare, so they were one rung
  // with two labels, and G6 happened to land lower than G5.
  assert.deepEqual(
    ladderIsStrict(['G2_PLACE_VALUE', 'G4_PLACE_VALUE', 'G5_PLACE_VALUE', 'G6_PLACE_VALUE', 'G7_PLACE_VALUE']),
    [],
  );
});

test('counting gets harder every grade it is taught', () => {
  // G1 and G2 both called buildCounting({ max: 100 }).
  assert.deepEqual(ladderIsStrict(['G1_COUNTING', 'G2_COUNTING']), []);
});

test('the Grade 7 decimal rungs are harder than the Grade 6 ones they are named after', () => {
  // "Multiplying Decimals (Advanced)" and "Dividing Decimals (Advanced)" ran
  // the Grade 6 builder untouched and asked the identical question.
  const places = (id) => numbersFrom(id, 60)
    .reduce((m, n) => Math.max(m, (String(n).split('.')[1] || '').length), 0);
  assert.ok(
    places('G7_DECIMALS_MUL') > places('G6_DECIMALS_MUL'),
    'G7 decimal multiplication carries no more decimal places than G6',
  );
  assert.ok(
    maxOf('G7_DECIMALS_DIV') > maxOf('G6_DECIMALS_DIV'),
    'G7 decimal division is no harder than G6',
  );
});

// ---- the rungs that were aliases or copies --------------------------------

test('Grade 6 time is the 24-hour clock and timetables, not Grade 5 again', () => {
  // G6_TIME was an alias to G5_TIME, so the label promised the harder skill
  // and the questions gave the easier one — and answering them credited the
  // learner with a rung they had not reached.
  const seen = new Set();
  let timetable = 0, notation = 0;
  for (let i = 0; i < 120; i++) {
    const p = generateProblem('G6_TIME');
    if (!p || p.placeholder) continue;
    seen.add(p.type);
    if (/\b\d{4}\s*h\b|24-hour/.test(p.question)) notation++;
    if (/bus leaves/.test(p.question)) timetable++;
  }
  assert.ok(seen.size >= 3, `only ${seen.size} question shapes — the rung is too thin`);
  assert.ok(notation > 0, 'nothing used 24-hour notation, which the skill is named for');
  assert.ok(timetable > 0, 'nothing read a timetable, which the skill is named for');
});

test('Grade 7 fractions are mixed numbers, not Grade 6 with bigger numbers', () => {
  // "(Advanced)" ran the Grade 6 builder with maxNum 11 instead of 8. Bigger
  // operands are the same skill with more arithmetic; mixed numbers are the
  // step the CBC design actually names, and cannot be started without
  // converting — which is the thing being taught.
  for (const id of ['G7_FRACTIONS_MUL', 'G7_FRACTIONS_DIV']) {
    let mixedSeen = 0, n = 0;
    for (let i = 0; i < 80; i++) {
      const p = generateProblem(id);
      if (!p || p.placeholder) continue;
      n++;
      if (/\d+\s+\d+\/\d+/.test(p.question)) mixedSeen++;
    }
    assert.ok(n > 0, `${id} generated nothing`);
    assert.ok(mixedSeen / n > 0.5, `${id}: only ${mixedSeen} of ${n} questions used a mixed number`);
  }
});

test('a mixed-number question never prints an unsimplified fraction part', () => {
  // "1 3/6 × 4 1/3" teaches that unsimplified is fine, in the one skill whose
  // whole point is simplifying.
  const bad = [];
  for (const id of ['G7_FRACTIONS_MUL', 'G7_FRACTIONS_DIV']) {
    for (let i = 0; i < 150; i++) {
      const p = generateProblem(id);
      if (!p || p.placeholder) continue;
      for (const m of String(p.question).matchAll(/(\d+)\/(\d+)/g)) {
        const a = Number(m[1]), b = Number(m[2]);
        const g = (x, y) => (y ? g(y, x % y) : x);
        if (g(a, b) !== 1) bad.push(`${id}: ${p.question}`);
      }
    }
  }
  assert.deepEqual(bad.slice(0, 3), [], `unsimplified fractions in the question text`);
});
