// ============================================================================
// THE ANSWER GUARD
//
// src/ai-tutor/answerGuard.js is what stands between a model's reply and a
// child. A system prompt telling a model not to give the answer is a request;
// this is the rule, so it is tested like one — from both sides:
//
//   FALSE NEGATIVES — every way an answer gets out must be caught, including
//   the one a human reviewer misses: the reply that leaves the answer a single
//   addition away without ever naming it.
//
//   FALSE POSITIVES — the guard must not flag the authored hints. Those are the
//   fallback it serves when it rejects a model reply, so a guard that trips on
//   them would have nothing safe left to show. The whole authored corpus is the
//   suite for this: ~244 skills, every hint, measured against the rule the
//   existing hints test already holds them to.
//
// Everything here runs offline. No model is called.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { revealed, digitsForWords, leaksAnswer } from '../src/ai-tutor/answerGuard.js';

// The worked example used throughout: HOREB generates this one for real
// (content/grade5.js, buildLongMul). 385 × 24 = 9240, partial products 1540
// and 7700.
const Q = {
  answer: '9240',
  accepts: ['9240'],
  question: 'A school buys 24 desks costing Ksh 385 each. What is the total cost in shillings?',
};
const check = (reply) => leaksAnswer({ ...Q, reply });

// ---- false negatives: these must all be caught ----------------------------

test('a reply that states the answer is caught', () => {
  assert.ok(check('Multiply it out and you get 9240 shillings altogether.'));
});

test('a reply that spaces or punctuates the digits is caught', () => {
  assert.ok(check('The total comes to 9 240 shillings.'), 'spaced digits');
  assert.ok(check('The total comes to 9,240 shillings.'), 'comma');
});

test('a reply that spells the answer out in words is caught', () => {
  assert.ok(check('That gives nine thousand two hundred and forty shillings.'));
  assert.ok(check('It is nine thousand two hundred forty.'), 'no "and"');
});

test('a reply that leaves the answer one step away is caught', () => {
  // Never names 9240, but hands over both partial products and says to add.
  const reply = 'Work out 1540 for the ones and 7700 for the tens, then add the two together.';
  assert.ok(check(reply), 'two partial products plus "add them" is a leak');
});

test('a factor pair that multiplies to the answer is caught', () => {
  assert.ok(check('Think of it as 462 groups of 20.'));
});

test('every accepted form of the answer is checked, not just the first', () => {
  const hit = leaksAnswer({
    answer: 'x = 7', accepts: ['x=7', '7'],
    question: 'Solve:   x + 9 = 16', reply: 'Once you subtract, you are left with x=7.',
  });
  assert.ok(hit);
});

test('a word answer is caught', () => {
  const hit = leaksAnswer({
    answer: 'isosceles', accepts: ['isosceles'],
    question: 'A triangle has sides 8 cm, 8 cm and 7 cm. What type of triangle is it?',
    reply: 'Two sides match, so this one is isosceles.',
  });
  assert.ok(hit);
});

// ---- false positives: these must all pass ---------------------------------

test('the authored hint ladder for this very question passes', () => {
  // Verbatim from buildLongMul — the fallback served when a model reply is
  // rejected. If the guard flagged these there would be nothing safe to show.
  for (const hint of [
    'Split the two-digit number into its tens and its ones, and multiply by each part separately.',
    'That means working out 385 × 4 and 385 × 20.',
    'Add the two partial products, keeping each one lined up in its own place-value columns.',
  ]) {
    assert.equal(check(hint), null, `flagged an authored hint: ${hint}`);
  }
});

test('quoting the numbers in the question is not a leak', () => {
  assert.equal(check('You are buying 24 desks at 385 shillings each.'), null);
});

test('ordinary number words in prose do not collide into a number', () => {
  // "the two ... each one" must not read as 21, and must not read as 2 then 1
  // run together once the whitespace is stripped.
  assert.equal(
    leaksAnswer({ answer: '21', accepts: ['21'], question: 'Work out 3 × 7.',
      reply: 'Add the two partial products, keeping each one lined up.' }),
    null,
  );
});

test('digitsForWords converts runs but keeps separate words apart', () => {
  assert.match(digitsForWords('nine thousand two hundred and forty'), /\b9240\b/);
  assert.match(digitsForWords('twenty-four desks'), /\b24\b/);
  assert.doesNotMatch(digitsForWords('the two desks and one chair'), /21/);
});

// ---- the corpus: the hardened checks must not be trigger-happy -------------

// Giving the general formula IS the teaching here, the same way naming the
// four congruence tests is. (n − 2) × 180 only lands on 360 because this
// instance happens to be a quadrilateral; the child still substitutes n.
// Stating the rule IS the teaching on a classification skill — the same three
// cases tests/hints.test.mjs already reviews and allows.
const ACCEPTED = new Map([
  ['G8_POLYGON_ANGLES', 'the general formula; the child still substitutes n'],
  ['G3_POSITION', 'left/right from the walker’s view — naming both gives neither away'],
  ['G8_CONGRUENCE', 'names all four tests; choosing between them is the skill'],
  // A two-letter answer cannot be word-matched: "No long division needed" is a
  // sentence opener, not the answer. The guard cannot tell them apart, which is
  // the reason a yes/no question should never be handed to the model at all.
  ['G7_DIVISIBILITY', 'answer is "no"; unmatchable against prose that opens with "No"'],
]);

// REAL LEAKS, found by this guard, NOT yet fixed. Every one of these hands a
// learner the answer, and the existing rule missed them for two reasons it
// could not see past: norm() strips commas, so "Count: 95, 96, 97, 98…" became
// one long digit run with no boundary around the answer; and a full stop after
// a number blocked the digit boundary, hiding "so 90 × 5 = 450."
//
// They are listed rather than silenced: the test fails on anything NEW, and
// this list must only ever shrink. Fixing them is a content change to the
// hints themselves, deliberately not bundled into the guard.
const UNFIXED_HINT_LEAKS = new Map([
  ['G1_COUNTING', 'the count-on list includes the answer: "Count: 95, 96, 97, 98…"'],
  ['G2_COUNTING', 'same count-on list'],
  ['G1_MONEY', 'the skip-count "20, 40, …" lands on the answer'],
  ['G2_MULTIPLY_INTRO', 'the skip-count list reaches the product: "5, 10, 15…"'],
  ['G3_MULTIPLY', 'same skip-count list'],
  ['G2_PLACE_VALUE', 'states the value outright: "its value is 1 × 10"'],
  ['G3_COUNTING', 'same place-value hint, one multiplication away'],
  ['G4_PLACE_VALUE', 'same place-value hint'],
  ['G4_MULTIPLY', 'states the product: "9 × 5 = 45, so 90 × 5 = 450."'],
  ['G10_EXPONENTIAL_GRAPHS', 'works the answer out in the hint: "4^−1 = 1/4"'],
]);

const SEEDS = [1, 42, 2026];
const DRAWS = 12;

function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}
function withSeed(seed, fn) {
  const real = Math.random;
  Math.random = seeded(seed);
  try { return fn(); } finally { Math.random = real; }
}

test('the guard raises nothing new against the authored hints', () => {
  // The precise property: every flag the guard raises on our own content is
  // either a leak we have already written down, or a false positive this test
  // exists to catch. A new name appearing here means one of the two — and
  // either way somebody has to look.
  const offenders = [];
  for (const id of Object.keys(SKILLS)) {
    if (ACCEPTED.has(id) || UNFIXED_HINT_LEAKS.has(id)) continue;
    for (const seed of SEEDS) {
      if (offenders.length > 6) break;
      withSeed(seed, () => {
        for (let i = 0; i < DRAWS; i++) {
          let p;
          try { p = generateProblem(id); } catch { continue; }
          if (!p || p.placeholder) continue;
          const answers = [p.answer, ...(p.accepts || [])];
          for (const hint of (p.hints || [p.hint]).filter(Boolean)) {
            // Skip what the existing rule already calls a leak (the reviewed
            // classification skills): this test is only about NEW flags.
            if (answers.some((a) => revealed(a, hint, p.question))) continue;
            const why = leaksAnswer({
              answer: p.answer, accepts: p.accepts, question: p.question, reply: hint,
            });
            if (why) {
              offenders.push(`${id}: ${why}\n    hint: ${hint}\n    Q: ${p.question}`);
              break;
            }
          }
        }
      });
    }
  }
  assert.deepEqual(offenders, [], `\n  ${offenders.join('\n  ')}\n`);
});

test('the list of unfixed leaks is real, and only shrinks', () => {
  // A leak that has been fixed should come off the list, not sit on it
  // forever pretending to be known. Any id here that no longer leaks across a
  // wide sample has been fixed — take it out.
  const stale = [];
  for (const id of UNFIXED_HINT_LEAKS.keys()) {
    if (!SKILLS[id]) { stale.push(`${id} (skill no longer exists)`); continue; }
    let leaks = false;
    withSeed(7, () => {
      for (let i = 0; i < 120 && !leaks; i++) {
        let p;
        try { p = generateProblem(id); } catch { continue; }
        if (!p || p.placeholder) continue;
        for (const hint of (p.hints || [p.hint]).filter(Boolean)) {
          if (leaksAnswer({ answer: p.answer, accepts: p.accepts, question: p.question, reply: hint })) {
            leaks = true; break;
          }
        }
      }
    });
    if (!leaks) stale.push(`${id} no longer leaks — remove it from UNFIXED_HINT_LEAKS`);
  }
  assert.deepEqual(stale, [], `\n  ${stale.join('\n  ')}\n`);
});
