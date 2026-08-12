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
