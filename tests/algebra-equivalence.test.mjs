// ============================================================================
// AN EQUAL EXPRESSION IS A RIGHT ANSWER (feedback F2 and F3, 21 Oct 2026)
//
// "3 + 5x" was marked wrong against "5x + 3", and "x^9" against "x⁹". Algebra
// is now judged by value, in the form the question asks for. These pairs hold
// it to that from both sides: every equal spelling passes, and nothing that is
// a different expression, or the question copied back, does.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkAnswerMatch } from '../src/ai-tutor/answerCheck.js';
import { readAs, canonicalise } from '../src/ai-tutor/algebraEquivalence.js';

const ok = (typed, answer, question) => checkAnswerMatch(typed, { answer, accepts: [answer], question });

test('the reported pairs are accepted', () => {
  assert.ok(ok('3 + 5x', '5x + 3'));
  assert.ok(ok('x^9', 'x⁹'));
  assert.ok(ok('x⁹', 'x^9'));
});

test('equal expressions in any order, notation or bracketing are accepted', () => {
  const pairs = [
    ['3+x*5', '5x+3'], ['x×5 + 3', '5x + 3'], ['5·x+3', '5x+3'],
    ['xy', 'yx'], ['b²a³', 'a^3b^2'], ['3yx^2', '3x^2y'],
    ['-2y+3x', '3x-2y'], ['−5x + 3', '3 - 5x'],
    ['2(3 + x)', '2(x + 3)'], ['(x+3)(x+2)', '(x+2)(x+3)'], ['(x - 1)(x+4)', '(x+4)(x-1)'],
    ['x**2 + 3*x', 'x² + 3x'], ['x⁻²', 'x^-2'], ['x/2', '1/2x'], ['x/2', '½x'.replace('½', '1/2')],
    ['y = 3 + 2x', 'y = 2x + 3'], ['4a+3b-c', '-c+3b+4a'],
    ['2 sqrt x', '2√x'], ['πr^2', 'πr²'], ['2πr', '2rπ'],
  ];
  for (const [typed, key] of pairs) assert.ok(ok(typed, key), `${typed} should equal ${key}`);
});

test('different expressions are refused', () => {
  const pairs = [
    ['5x+4', '5x+3'], ['x^9', 'x^8'], ['2x', 'x^2'], ['x - 5', '5 - x'], ['3x+2y', '3y+2x'],
    ['(x+2)(x-3)', '(x+2)(x+3)'], ['2(x+3)', '2(x+4)'], ['x^2+1', '(x+1)^2'],
    ['3 + 2x = y', 'y = 2x + 3'], // the sides are not swapped
  ];
  for (const [typed, key] of pairs) assert.ok(!ok(typed, key), `${typed} must not equal ${key}`);
});

test('the form the question asks for still counts', () => {
  // Expand: equal is not enough, the brackets must go.
  assert.ok(!ok('2(x+3)', '2x+6', 'Expand: 2(x + 3)'));
  assert.ok(ok('6 + 2x', '2x+6', 'Expand: 2(x + 3)'));
  // Factorise: the expanded form is the question, not the answer.
  assert.ok(!ok('x^2+5x+6', '(x+2)(x+3)', 'Factorize: x² + 5x + 6'));
  assert.ok(ok('(x+3)(x+2)', '(x+2)(x+3)', 'Factorize: x² + 5x + 6'));
  // Simplify: like terms collected, powers combined, numbers multiplied.
  assert.ok(!ok('3x+2x', '5x', 'Simplify: 3x + 2x'));
  assert.ok(!ok('2x+3+3', '2x+6'));
  assert.ok(!ok('x²·x³', 'x^5', 'Simplify: x² × x³'));
  assert.ok(!ok('x*x*x', 'x^3'));
  assert.ok(!ok('2*3x', '6x'));
  assert.ok(ok('x^5', 'x⁵', 'Simplify: x² × x³'));
});

test('words, units, remainders and coordinates are not read as algebra', () => {
  assert.ok(!ok('dod', 'odd'));
  assert.ok(!ok('nat', 'tan'));
  assert.ok(!ok('12mc', '12cm'));
  assert.ok(!ok('10r', '5r2'));
  assert.ok(!ok('(5,2)', '(2,5)'));
});

test('common notations are read the same way', () => {
  for (const t of ['x^9', 'x**9', 'x⁹', 'X^9', ' x ^ 9 ']) assert.equal(canonicalise(t), 'x^9');
  assert.equal(canonicalise('5×x − 3'), '5*x-3');
  assert.equal(canonicalise('a÷b'), 'a/b');
});

test('the child is shown how their typing was read', () => {
  assert.equal(readAs('x^9'), 'x⁹');
  assert.equal(readAs('5*x+3'), '5x + 3');
  assert.equal(readAs('x**2 + 3*x'), 'x² + 3x');
  assert.equal(readAs('12'), null);       // nothing to explain
  assert.equal(readAs('5x + 3'), null);   // already in the questions' notation
});

test('forgetting the brackets is not the same answer', () => {
  // Found by the answer audit on this branch, present on main before it: the
  // coordinate matcher stripped every bracket, so "2k + 8" passed for "2(k + 8)".
  assert.ok(!ok('2k + 8', '2(k + 8)'));
  assert.ok(!ok('2x+3', '2(x+3)'));
  assert.ok(ok('2,5', '(2,5)'));
  assert.ok(ok('(2, 5)', '(2,5)'));
});
