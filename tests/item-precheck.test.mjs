// The free half of the blind reviewer: deterministic checks on every item.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { precheckItem, evaluateExpression, readingStats } from '../scripts/lib/item-precheck.mjs';

const ids = (p, o) => precheckItem(p, o).map(x => `${x.level}:${x.id}`);
const good = { question: 'What is 12 + 8?', answer: '20', accepts: ['20'], misconceptions: [{ when: '4', feedback: 'You took away instead of adding.' }] };

test('a sound item has no hard failure', () => {
  assert.ok(!ids(good).some(x => x.startsWith('hard')));
});
test('an arithmetic key that does not compute is a hard failure', () => {
  assert.ok(ids({ ...good, answer: '21', accepts: ['21'] }).includes('hard:key'));
  assert.equal(evaluateExpression('345 - 129 = ?'), 216);
  assert.equal(evaluateExpression('A trader buys 3 and sells 4'), null);
});
test('two right options or a repeated option is hard', () => {
  const p = { question: 'Which is 20?', choices: ['20', '20.0', '30'], optionTruth: [true, true, false], answer: '20', accepts: ['20', '20.0'], misconceptions: [] };
  assert.ok(ids(p).includes('hard:key'));
});
test('a distractor with no named misconception is flagged for a reviewer', () => {
  const p = { question: 'Which is 20?', choices: ['20', '12', '30'], optionTruth: [true, false, false], answer: '20', accepts: ['20'], misconceptions: [{ when: '12', feedback: 'You added 8 and 4.' }] };
  assert.ok(ids(p).includes('soft:distractors'));
  assert.ok(!ids({ ...p, misconceptions: [{ when: '12', feedback: 'You added 8 and 4.' }, { when: '30', feedback: 'You added 10 and 20.' }] }).includes('soft:distractors'));
});
test('reading level is held to the grade plus two', () => {
  const hard = 'Notwithstanding the aforementioned considerations regarding proportional distribution, determine the approximate quantity apportioned respectively to each beneficiary.';
  assert.ok(readingStats(hard).fk > 12);
  assert.ok(ids({ ...good, question: hard, answer: '20' }, { grade: 5 }).includes('soft:reading'));
  assert.ok(!ids({ ...good, question: 'Wanjiru has 12 mangoes. She buys 8 more. How many mangoes does she have now?' }, { grade: 5 }).includes('soft:reading'));
});
test('ambiguity markers are found', () => {
  assert.ok(ids({ ...good, question: 'Maybe 12 learners come, or so. What is 12 + 8?' }).includes('soft:ambiguity'));
  assert.ok(ids({ ...good, question: 'The answer is undefined. What is 12 + 8?' }).includes('hard:ambiguity'));
  assert.ok(ids({ ...good, question: 'How long is the rope?', answer: '20' }).includes('soft:ambiguity'));
});
test('units and Kenyan context are checked', () => {
  assert.ok(ids({ ...good, question: 'A rope is 12 feet long. What is 12 + 8?' }).includes('hard:units'));
  assert.ok(ids({ ...good, question: 'A pencil costs $5. What is 12 + 8?' }).includes('hard:units'));
  assert.ok(ids({ ...good, question: 'A matatu travels at 400 km/h for 2 hours. What is 12 + 8?' }).includes('soft:units'));
  assert.ok(!ids({ ...good, question: 'A forex bureau changes 50 US dollars into shillings at sh 128 each. What is 12 + 8?' }).includes('hard:units'));
});
test('feet and foot are flagged only as a measurement', () => {
  assert.ok(ids({ ...good, question: 'A pole is 6 ft tall. What is 12 + 8?' }).includes('hard:units'));
  assert.ok(ids({ ...good, question: 'A rope is ten feet long. What is 12 + 8?' }).includes('hard:units'));
  assert.ok(!ids({ ...good, question: 'You enter the water feet first. What is 12 + 8?' }).includes('hard:units'));
  assert.ok(!ids({ ...good, question: 'A crab balance is on the hands and feet. What is 12 + 8?' }).includes('hard:units'));
  assert.ok(!ids({ ...good, question: 'The foot joint is the lowest part. What is 12 + 8?' }).includes('hard:units'));
});
test('the report script runs and finds no hard failure in the bank', () => {
  const out = execFileSync('node', ['scripts/review-precheck.mjs', '--draws', '4', '--strict', '--no-write'], { cwd: new URL('..', import.meta.url).pathname, encoding: 'utf8' });
  assert.match(out, /0 hard/);
});
