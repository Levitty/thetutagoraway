// ============================================================================
// A PAIR OF NAMED VALUES IS RIGHT IN ANY ORDER (feedback F7)
//
// For "x=2, y=6", "y = 6, x = 2" and "x = 2 and y = 6" were marked wrong:
// G8_SIMULTANEOUS_INTRO, every item.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkAnswerMatch } from '../src/ai-tutor/answerCheck.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';

const key = { answer: 'x=2, y=6', accepts: ['x=2, y=6', 'x=2,y=6', '(2,6)'] };

test('named values in any order and joined any way', () => {
  for (const typed of ['y = 6, x = 2', 'x = 2 and y = 6', 'x=2 y=6', 'x=2; y=6', 'y=6 & x=2', 'X = 2, Y = 6', '2 and 6', '2, 6'])
    assert.ok(checkAnswerMatch(typed, key), typed);
});

test('wrong or swapped values stay wrong', () => {
  for (const typed of ['x = 6, y = 2', '6 and 2', 'x = 2', 'x = 2, y = 5', 'x = 2, x = 6', 'x = 2, y = 6, z = 1'])
    assert.ok(!checkAnswerMatch(typed, key), typed);
});

test('every simultaneous-equations item accepts the pair the other way round', () => {
  for (let i = 0; i < 40; i++) {
    const p = generateProblem('G8_SIMULTANEOUS_INTRO');
    const m = String(p.answer).match(/x\s*=\s*(-?\d+).*y\s*=\s*(-?\d+)/);
    assert.ok(m, p.answer);
    assert.ok(checkAnswerMatch(`y = ${m[2]}, x = ${m[1]}`, p));
    assert.ok(checkAnswerMatch(`x = ${m[1]} and y = ${m[2]}`, p));
  }
});

test('a set of roots is not read as a pair', () => {
  const roots = { answer: 'x = -3 or x = 4', accepts: ['x = -3 or x = 4', 'x=4 or x=-3', '-3, 4'] };
  assert.ok(checkAnswerMatch('x = 4 or x = -3', roots));
  assert.ok(!checkAnswerMatch('x = -3', roots));
});
