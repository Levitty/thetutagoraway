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
import { revealed } from '../src/ai-tutor/answerRule.js';
import { digitsForWords, leaksAnswer, namesAnswer } from '../src/ai/replyGuard.js';

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
  // Already reviewed in tests/hints.test.mjs for exactly this: a value the
  // hint must show (a gradient, a line of symmetry, the corners to test)
  // coincides with the answer on some draws.
  ['G8_LINEAR_GRAPHS', 'the gradient shown in the substitution sometimes equals y'],
  ['G9_QUADRATIC_GRAPHS', 'the line of symmetry sometimes equals the minimum y'],
  ['G11_LINEAR_PROGRAMMING', 'lists every corner to test; naming all gives none away'],
  // Turned up only once the check stopped sampling and started enumerating.
  // Same coincidence class: the common difference of 6, 5, 4, 3… is −1, and so
  // is the 8th term; the antiderivative's leading coefficient sometimes equals
  // the definite integral. Both values have to be shown to teach the method.
  ['G10_SEQUENCES_ADV', 'the common difference sometimes equals the term asked for'],
  ['G12_DEFINITE_INTEGRALS', 'the antiderivative coefficient sometimes equals the integral'],
]);

// Leaks found but not yet fixed. Deliberately EMPTY: the thirteen this guard
// first turned up are all fixed in the content. Add an id here only with a
// reason and a plan, never to quieten the test — the check below fails if an
// entry on it has stopped leaking, so the list can only shrink.
const UNFIXED_HINT_LEAKS = new Map([]);

// ---- the corpus ----------------------------------------------------------
// The check that every hint of every skill clears namesAnswer is an
// ENUMERATION, not a sample, and it costs about a minute. That is too slow to
// pay on every `npm test`, so it lives in the quality gate instead:
//
//     node engine/scripts/quality_gate.mjs              (part of the gate)
//     node engine/scripts/audit_hint_leaks.mjs --deep   (the longer sweep)
//
// What stays here is the guard's own behaviour, which is fast and is what
// breaks if someone edits src/ai/replyGuard.js.

function seeded(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

test('the list of unfixed leaks is real, and only shrinks', () => {
  // A leak that has been fixed should come off the list, not sit on it
  // forever pretending to be known. Any id here that no longer leaks across a
  // wide sample has been fixed — take it out.
  const stale = [];
  for (const id of UNFIXED_HINT_LEAKS.keys()) {
    if (!SKILLS[id]) { stale.push(`${id} (skill no longer exists)`); continue; }
    let leaks = false;
    // Several seeds, not one: some of these leak only on the draw that makes
    // them leak (the place-value hints only when the digit is 1), and a single
    // seed that happens to miss would report a live leak as fixed.
    for (const seed of [7, 1, 42, 2026]) {
      const real = Math.random;
      Math.random = seeded(seed);
      try {
      for (let i = 0; i < 120 && !leaks; i++) {
        let p;
        try { p = generateProblem(id); } catch { continue; }
        if (!p || p.placeholder) continue;
        for (const hint of (p.hints || [p.hint]).filter(Boolean)) {
          if (namesAnswer({ answer: p.answer, accepts: p.accepts, question: p.question, reply: hint })) {
            leaks = true; break;
          }
        }
      }
      } finally { Math.random = real; }
    }
    if (!leaks) stale.push(`${id} no longer leaks — remove it from UNFIXED_HINT_LEAKS`);
  }
  assert.deepEqual(stale, [], `\n  ${stale.join('\n  ')}\n`);
});
