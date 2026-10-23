// ============================================================================
// "GIVE THE ANSWER IN SIMPLEST FORM" MEANS SIMPLIFIED (feedback F8)
//
// 3/12 was marked right for 1/4, and 24/22 for 12/11, on questions that ask
// for the simplest form: about ten fraction and probability skills.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkAnswerMatch } from '../src/ai-tutor/answerCheck.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';

const simplest = { instruction: 'Subtract the fractions. Give the answer in simplest form.', question: '6/8 − 3/6', answer: '1/4', accepts: ['1/4', '0.25'] };

test('an unsimplified fraction is not the simplest form', () => {
  for (const typed of ['3/12', '2/8', '6/24']) assert.ok(!checkAnswerMatch(typed, simplest), typed);
  for (const typed of ['1/4', '0.25', ' 1 / 4 ']) assert.ok(checkAnswerMatch(typed, simplest), typed);
});

test('without the instruction an equal fraction still counts', () => {
  assert.ok(checkAnswerMatch('3/12', { question: 'What fraction is shaded?', answer: '1/4' }));
  assert.ok(checkAnswerMatch('10/15', { instruction: 'Find the missing numerator.', question: '2/3 = ?/15', answer: '10', accepts: ['10', '10/15'] }));
});

test('every simplest-form key is itself accepted', () => {
  for (const id of ['G5_FRACTIONS_ADD_LIKE', 'G5_FRACTIONS_SUB_LIKE', 'G6_FRACTIONS_ADD', 'G6_FRACTIONS_SUB', 'G6_FRACTIONS_MUL', 'G6_FRACTIONS_DIV', 'G7_FRACTIONS_ADD_UNLIKE', 'G7_FRACTIONS_MUL', 'G7_FRACTIONS_DIV', 'G9_PROBABILITY_ADV']) {
    for (let i = 0; i < 30; i++) {
      const p = generateProblem(id);
      assert.ok(checkAnswerMatch(String(p.answer), p), `${id}: own key ${p.answer}`);
      const m = String(p.answer).match(/^(-?\d+)\/(\d+)$/);
      if (m && /simplest form|simplify/i.test(`${p.instruction} ${p.question}`)) assert.ok(!checkAnswerMatch(`${m[1] * 3}/${m[2] * 3}`, p), `${id}: ${m[1] * 3}/${m[2] * 3}`);
    }
  }
});
