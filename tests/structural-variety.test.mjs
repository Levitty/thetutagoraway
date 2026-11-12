// New numbers, new names and new wording are not variety. A different
// representation, answer form, question asked, context, operation or targeted
// misconception is. The gate counts only the second kind.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { structureOf, structuralVariety } from '../engine/scripts/content_measures.mjs';

const adds = [3, 7, 12, 48, 105].map(n => ({ question: `What is ${n} + ${n + 4}?`, answer: String(2 * n + 4) }));

test('fifty new numbers on one question are one kind', () => {
  const many = Array.from({ length: 50 }, (_, i) => ({ question: `What is ${i + 2} + ${i * 3 + 1}?`, answer: '0' }));
  assert.equal(structuralVariety(many).kinds, 1);
  assert.equal(structuralVariety(adds).kinds, 1);
});

test('new names and rewording around the same story are one kind', () => {
  const qs = ['Wanjiru buys 3 mangoes and 4 oranges. How many fruits does she buy altogether?', 'Juma buys 5 mangoes and 2 oranges. How many fruits does he buy in all?', 'Amina bought 6 mangoes and 9 oranges. How many fruits did she buy altogether?'].map(question => ({ question }));
  assert.equal(structuralVariety(qs).kinds, 1);
});

test('a different representation is a different kind', () => {
  const a = { question: 'What is 12 + 8?' };
  const b = { question: 'What is 12 + 8?', model: { type: 'table', data: { head: ['a'], rows: [] } } };
  const c = { question: 'What is 12 + 8?', model: { type: 'bar-chart' } };
  assert.equal(structuralVariety([a, b, c]).kinds, 3);
});

test('a different way of answering is a different kind', () => {
  const typed = { question: 'What is 12 + 8?' };
  const chosen = { question: 'What is 12 + 8?', choices: ['18', '20', '22'] };
  const parts = { question: 'What is 12 + 8?', parts: [{ prompt: 'x' }] };
  const spot = { question: 'What is 12 + 8?', shownSteps: ['12 + 8 = 21'], mc: ['Step 1'] };
  assert.equal(structuralVariety([typed, chosen, parts, spot]).kinds, 4);
});

test('a different thing asked is a different kind', () => {
  const value = { question: 'What is 12 + 8?' };
  const missing = { question: 'Find the missing number: 12 + __ = 20' };
  const why = { question: 'Why is 12 + 8 the same as 8 + 12?' };
  assert.equal(structuralVariety([value, missing, why]).kinds, 3);
});

test('a different context is a different kind', () => {
  const bare = { question: 'What is 12 + 8?' };
  const story = { question: 'A trader sells 12 sacks and then 8 sacks. How many sacks altogether?' };
  const kenyan = { question: 'A duka in Nakuru sells 12 sacks and then 8 sacks. How many sacks altogether?' };
  assert.equal(new Set([bare, story, kenyan].map(p => structureOf(p).context)).size, 3);
});

test('a different targeted misconception is a different kind', () => {
  const a = { question: 'Which is bigger: 0.5 or 0.45?', choices: ['0.5', '0.45'], mis: 'LONGER_IS_BIGGER' };
  const b = { question: 'Which is bigger: 0.5 or 0.45?', choices: ['0.5', '0.45'], mis: 'IGNORES_PLACE' };
  assert.equal(structuralVariety([a, b]).kinds, 2);
  assert.equal(structuralVariety([a, { ...a }]).kinds, 1);
});

test('the gate reads the smaller of text forms and structural forms', async () => {
  const { measureSkill } = await import('../engine/scripts/range_report.mjs');
  const m = measureSkill('G5_ADD' in (await import('../src/ai-tutor/knowledgeGraph.js')).SKILLS ? 'G5_ADD' : Object.keys((await import('../src/ai-tutor/knowledgeGraph.js')).SKILLS)[0], 30);
  assert.ok(m.forms <= m.textForms && m.forms <= m.structuralForms);
});
