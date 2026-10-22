// ============================================================================
// ANSWER CHECKING MUST JUDGE THE MATHS, NOT THE KEYBOARD
//
// Regression test for the bug found in live testing: "they can't find symbols
// like the square root one" — a child who knows the answer is 2√5 has no √ key
// on a phone. Typing it in words must count.
//
// Also guards the everyday ways a Kenyan child writes a number: "KSh 4,500",
// "4500/=", "12 cm", "5 remainder 2".
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkAnswerMatch, normalizeMath } from '../src/ai-tutor/answerCheck.js';

// The real API takes the whole problem: checkAnswerMatch(typed, { answer, accepts }).
const checkAnswer = (typed, answer, accepts = []) =>
  checkAnswerMatch(typed, { answer, accepts: accepts.length ? accepts : [answer] });

const same = (a, b) => normalizeMath(a) === normalizeMath(b);

test('roots can be typed in words on a phone keyboard', () => {
  for (const typed of ['2root5', '2 sqrt 5', '2sqrt(5)', '2 square root of 5']) {
    assert.ok(same(typed, '2√5'), `${typed} should equal 2√5`);
  }
  assert.ok(same('square root of 20', '√20'));
  assert.ok(same('3sqrt2', '3√2'));
});

test('pi and powers can be typed in plain characters', () => {
  assert.ok(same('2pi', '2π'));
  assert.ok(same('x^2 - 13x + 42', 'x² − 13x + 42'));
  assert.ok(same('x^3', 'x³'));
});

test('different values are still different', () => {
  // The normalisations must not be so eager that wrong answers start passing.
  assert.ok(!same('2√5', '2√6'));
  assert.ok(!same('3√2', '2√3'));
  assert.ok(!same('x^2', 'x^3'));
  assert.ok(!same('2pi', '3pi'));
});

test('checkAnswer accepts a correct answer written naturally', () => {
  const problem = { answer: '2√5', accepts: ['2√5'] };
  for (const typed of ['2√5', '2root5', '2 sqrt 5']) {
    assert.equal(checkAnswer(typed, problem.answer, problem.accepts), true, `${typed} should be accepted`);
  }
  assert.equal(checkAnswer('2√6', problem.answer, problem.accepts), false);
});

test('numbers survive the way children actually write them', () => {
  assert.equal(checkAnswer('KSh 4,500', '4500', []), true);
  assert.equal(checkAnswer('4500/=', '4500', []), true);
  assert.equal(checkAnswer('12 cm', '12', []), true);
  assert.equal(checkAnswer('1,200', '1200', []), true);
  assert.equal(checkAnswer('0.5', '.5', []), true);
});

test('a wrong number is still wrong however it is written', () => {
  assert.equal(checkAnswer('KSh 4,600', '4500', []), false);
  assert.equal(checkAnswer('13 cm', '12', []), false);
});

// ---------------------------------------------------------------------------
// Addition commutes. Reported from live testing: "It's recognizing 5x+3 and
// 3+5x as different answers which is wrong. Both of them are accurate."
//
// This bites hardest in Grades 4-6, where WRITING the expression is the skill
// being assessed, so marking the terms in the other order wrong teaches the
// child to guess our preferred spelling rather than the mathematics.
// ---------------------------------------------------------------------------
test('the terms of a sum may be written in either order', () => {
  const same = (a, b) => checkAnswerMatch(a, { answer: b });
  assert.ok(same('3+5x', '5x+3'));
  assert.ok(same('5x+3', '3+5x'));
  assert.ok(same('3 + 5x', '5x+3'));      // spaces and order together
  assert.ok(same('7+2a', '2a+7'));
  assert.ok(same('1+x', 'x+1'));
  assert.ok(same('-2+3y', '3y-2'));       // the sign travels with its term
  assert.ok(same('3y+2x', '2x+3y'));      // two unknowns
  assert.ok(same('3+x=8', 'x+3=8'));      // each side of an equation
});

test('subtraction does not commute, and reordering never invents a match', () => {
  const same = (a, b) => checkAnswerMatch(a, { answer: b });
  assert.ok(!same('5-x', 'x-5'));         // the whole point of the sign rule
  assert.ok(!same('x-3', '3-x'));
  assert.ok(!same('2x+3', '2x+4'));       // still the wrong number
  assert.ok(!same('x+y', 'x+z'));         // still the wrong unknown
  assert.ok(!same('3x', 'x+3'));          // a product is not a sum
  assert.ok(!same('2x+3y', '2y+3x'));     // coefficients belong to their letters
  assert.ok(!same('x+3=9', 'x+3=8'));
});

// ---------------------------------------------------------------------------
// Clock times with a.m. and p.m. Found by the check simulator: a key written
// "9:15 a.m." only matched an exact copy, so "9:15 am", "9:15 AM" and the
// Kenyan classroom's own "9.15 a.m." were all marked wrong on a Grade 4 time
// question — the commonest way a child who knew the answer was told they had
// a gap.
// ---------------------------------------------------------------------------
test('a 12-hour time is accepted however a child writes a.m. or p.m.', () => {
  const same = (a, b) => checkAnswerMatch(a, { answer: b });
  for (const typed of ['9:15 a.m.', '9:15 am', '9:15am', '9.15 am', '9:15 AM', '9.15 a.m.']) {
    assert.ok(same(typed, '9:15 a.m.'), `${typed} should be accepted for 9:15 a.m.`);
  }
  assert.ok(same('21:15', '9:15 p.m.'), 'an unambiguous 24-hour time is the same time');
});

test('a.m. and p.m. stay different, and a time without one is not enough', () => {
  const same = (a, b) => checkAnswerMatch(a, { answer: b });
  assert.ok(!same('9:15 p.m.', '9:15 a.m.'), 'telling a.m. from p.m. is the skill');
  assert.ok(!same('9:15 am', '9:15 p.m.'));
  assert.ok(!same('9:15', '9:15 a.m.'), 'a bare 9:15 does not say which');
  assert.ok(!same('9:16 am', '9:15 a.m.'));
});

// ============================================================================
// MIXED NUMBERS — the space is the only thing separating two different numbers
//
// normalizeMath() drops whitespace, which is right for "12 kg" and wrong for
// "3 1/4": squashed it becomes "31/4", a different number, and the literal
// match at the top of checkAnswerMatch then marked 31/4 (7.75) correct for an
// answer of 3 1/4 (3.25). Nothing shipped had a mixed-number answer, so it
// never bit until Grade 7 fractions got one.
// ============================================================================
test('a squashed mixed number is not the same number', () => {
  const p = { answer: '3 1/4', accepts: ['13/4', '3 1/4', '3.25'] };
  assert.equal(checkAnswerMatch('3 1/4', p), true, 'the mixed form is right');
  assert.equal(checkAnswerMatch('13/4', p), true, 'the improper form is right');
  assert.equal(checkAnswerMatch('3.25', p), true, 'the decimal is right');
  assert.equal(checkAnswerMatch('31/4', p), false, '31/4 is 7.75 — a different number');
});

test('a mixed number whose squash happens to be its own improper form still passes', () => {
  // 6 3/10 really is 63/10, so accepting "63/10" is correct, not a leak.
  const p = { answer: '6 3/10', accepts: ['63/10', '6 3/10', '6.3'] };
  assert.equal(checkAnswerMatch('63/10', p), true);
  assert.equal(checkAnswerMatch('6 3/10', p), true);
});

test('a negative mixed number keeps its sign', () => {
  const p = { answer: '-2 1/2', accepts: ['-5/2', '-2 1/2', '-2.5'] };
  assert.equal(checkAnswerMatch('-2 1/2', p), true);
  assert.equal(checkAnswerMatch('-5/2', p), true);
  assert.equal(checkAnswerMatch('-21/2', p), false, '-21/2 is -10.5');
});

test('the whitespace-dropping that mixed numbers needed protecting from still works', () => {
  // The rule exists for units and currency; narrowing it must not break them.
  assert.equal(checkAnswerMatch('12 kg', { answer: '12kg', accepts: ['12kg', '12 kg'] }), true);
  assert.equal(checkAnswerMatch('KSh 4 500', { answer: '4500', accepts: ['4500'] }), true);
  assert.equal(checkAnswerMatch('2 h 45 min', { answer: '2 h 45 min', accepts: ['2 h 45 min', '2h45min'] }), true);
});
