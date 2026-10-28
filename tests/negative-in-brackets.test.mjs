// Feedback F25: a negative answer written in brackets, as the integer
// questions themselves write negatives, is the same number.
import test from 'node:test';
import assert from 'node:assert/strict';
import { checkAnswerMatch } from '../src/ai-tutor/answerCheck.js';

const p = (answer, question) => ({ answer, accepts: [answer], question });

test('a negative answer in brackets is accepted', () => {
  for (const typed of ['(-2)', '( -2 )', '(−2)', '(- 2)']) assert.equal(checkAnswerMatch(typed, p('-2', '5 − 7')), true, typed);
  assert.equal(checkAnswerMatch('(+19)', p('19', '10 − (-9)')), true);
  assert.equal(checkAnswerMatch('(-1.5)', p('-1.5', '-3 ÷ 2')), true);
});

test('brackets do not make a wrong answer right', () => {
  assert.equal(checkAnswerMatch('(2)', p('-2', '5 − 7')), false);
  assert.equal(checkAnswerMatch('(-3)', p('-2', '5 − 7')), false);
  assert.equal(checkAnswerMatch('(+2)', p('-2', '5 − 7')), false);
});

test('coordinates are still coordinates', () => {
  const c = { answer: '(-4, -5)', accepts: ['(-4,-5)', '(-4, -5)'], question: 'Plot the midpoint of A(-2, -5) and B(-6, -5).' };
  assert.equal(checkAnswerMatch('(-4, -5)', c), true);
  assert.equal(checkAnswerMatch('(-4)', c), false);
});
