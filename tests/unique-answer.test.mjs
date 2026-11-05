// ============================================================================
// A SOLVE QUESTION HAS EXACTLY ONE ANSWER (feedback F30)
//
// "Solve: 2x + 2y = 20, 3x + 3y = 30" was served with one key. Both equations
// say x + y = 10. By its own ranges G8_SIMULTANEOUS_INTRO drew such a pair in
// about 18.5% of questions, and every key check passed, because the key does
// satisfy both.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { noUniqueAnswer, auditUniqueAnswers } from '../engine/scripts/audit_unique_answers.mjs';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { checkAnswerMatch } from '../src/ai-tutor/answerCheck.js';

test('a pair with no single answer is caught, in each way it can be written', () => {
  for (const q of [
    'Solve: 2x + 2y = 20, 3x + 3y = 30',                       // the same line
    'Solve: 1x + 2y = 5, 2x + 4y = 10',
    'Solve: x + y = 4, x + y = 9',                             // parallel
    'Solve simultaneously:   x − 2y = 3   and   2x − 4y = 7.   Find y.',
    'Solve: 3a + 6b = 9, a + 2b = 3',                          // other letters
    'Solve: 3x + 5 = 3x + 9',                                  // the letter cancels
    'Solve: 4x + 2 = 4x + 2',
    'Find the inverse of [2 4; 1 2].',
  ]) assert.ok(noUniqueAnswer(q), q);
});

test('a question with one answer is left alone', () => {
  for (const q of [
    'Solve: 2x + 2y = 20, 3x + 2y = 26',
    'Solve simultaneously:   4x + 3y = -7   and   x + y = -2.   Find y.',
    'Solve simultaneously:   -x − y = 3   and   x − y = 1.   Find x.',
    'Solve: 5x + 3 = 2x + 12',
    'A line has equation y = 4x + 2. Find y when x = 3.',
    'x = 3t and y = 2t². Find y when x = 15.',
    'Maximise P = 3x + 2y subject to x + y ≤ 6, x ≥ 0, y ≥ 0.',
    'Find the inverse of [2 1; 1 1].',
  ]) assert.equal(noUniqueAnswer(q), null, q);
});

test('the audit fails a skill for a rare bad draw, and names it', async () => {
  let n = 0;
  const generate = () => ({
    question: ++n % 200 === 0 ? 'Solve: 2x + 2y = 20, 3x + 3y = 30' : 'Solve: 2x + 2y = 20, 3x + 2y = 26',
  });
  const { failing } = await auditUniqueAnswers({ ids: ['G8_SIMULTANEOUS_INTRO'], generate });
  assert.equal(failing.length, 1);
  assert.equal(failing[0].id, 'G8_SIMULTANEOUS_INTRO');
});

test('no skill can draw a question with no single answer', async () => {
  const { judged, failing } = await auditUniqueAnswers();
  assert.ok(judged.some((r) => r.id === 'G8_SIMULTANEOUS_INTRO'), 'the audit no longer reads this skill');
  assert.ok(judged.some((r) => r.id === 'G9_SIMULTANEOUS_ADV'), 'the audit no longer reads this skill');
  assert.deepEqual(failing.map((r) => `${r.id}: ${r.example.question}`), []);
});

test('G8_SIMULTANEOUS_INTRO: the key solves both equations and marks right', () => {
  for (let i = 0; i < 500; i++) {
    const p = generateProblem('G8_SIMULTANEOUS_INTRO');
    const [, x, y] = String(p.answer).match(/x=(-?\d+), y=(-?\d+)/).map(Number);
    const eqs = [...p.question.matchAll(/(\d*)x \+ (\d*)y = (\d+)/g)];
    assert.equal(eqs.length, 2, p.question);
    for (const [, a, b, c] of eqs) assert.equal(Number(a || 1) * x + Number(b || 1) * y, Number(c), p.question);
    assert.ok(!/\b1[xy]/.test(p.question), `reads badly: ${p.question}`);
    assert.ok(checkAnswerMatch(String(p.answer), p), p.question);
  }
});
