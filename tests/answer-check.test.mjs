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
