// ============================================================================
// TWO-UNIT ANSWERS IN THE WORDS CHILDREN USE (feedback F5)
//
// "4 hrs 21 mins" was marked wrong for a key of "4 h 21 min", and so were
// "8 kilograms 695 grams" and "9 metres 28 centimetres": only the spellings
// listed in the key passed. Grades 5-6 time, mass, length and capacity.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkAnswerMatch } from '../src/ai-tutor/answerCheck.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';

const WORDS = { h: 'hrs', kg: 'kilograms', m: 'metres', l: 'litres', min: 'mins', g: 'grams', cm: 'centimetres', ml: 'millilitres' };

test('a two-unit answer is right in any common spelling', () => {
  const key = { answer: '4 h 21 min', accepts: ['4 h 21 min', '4h21min', '4 hours 21 minutes', '261'] };
  for (const typed of ['4 hrs 21 mins', '4 hr 21 min', '4 hours and 21 mins', '4 h, 21 min']) assert.ok(checkAnswerMatch(typed, key), typed);
  assert.ok(checkAnswerMatch('8 kgs 695 gms', { answer: '8 kg 695 g' }));
  assert.ok(checkAnswerMatch('9 metres 28 centimetres', { answer: '9 m 28 cm' }));
  assert.ok(checkAnswerMatch('9 ltrs 393 mls', { answer: '9 l 393 ml' }));
});

test('a wrong two-unit answer is still wrong', () => {
  const key = { answer: '4 h 21 min', accepts: ['4 h 21 min'] };
  for (const typed of ['4 hrs 20 mins', '5 hrs 21 mins', '3 h 81 min', '4 kg 21 g']) assert.ok(!checkAnswerMatch(typed, key), typed);
});

test('every generated two-unit key accepts the units in words', () => {
  for (const id of ['G5_TIME', 'G6_TIME', 'G5_MASS', 'G5_LENGTH', 'G5_CAPACITY']) {
    for (let i = 0; i < 30; i++) {
      const p = generateProblem(id);
      const m = String(p.answer).match(/^(\d+)\s*(h|kg|m|l)\s+(\d+)\s*(min|g|cm|ml)$/);
      if (!m) continue;
      const typed = `${m[1]} ${WORDS[m[2]]} ${m[3]} ${WORDS[m[4]]}`;
      assert.ok(checkAnswerMatch(typed, p), `${id}: "${typed}" for ${p.answer}`);
    }
  }
});
