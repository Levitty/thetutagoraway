// Feedback F26: a hire-purchase price is always more than the cash price, so
// "how much MORE" never has a negative or zero answer.
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';

test('hire purchase costs more than cash, in round instalments', () => {
  let seen = 0;
  for (let k = 0; k < 1500; k++) {
    const p = generateProblem('G9_COMMERCIAL_ARITH');
    const q = String(p.question);
    if (!/hire purchase/i.test(q)) continue;
    seen++;
    const cash = Number(q.match(/KSh ([\d,]+) cash/)[1].replace(/,/g, ''));
    const deposit = Number(q.match(/deposit of KSh ([\d,]+)/)[1].replace(/,/g, ''));
    const [, months, monthly] = q.match(/(\d+) monthly instalments of KSh ([\d,]+)/);
    const hp = deposit + Number(months) * Number(monthly.replace(/,/g, ''));
    assert.ok(hp > cash, q);
    assert.equal(Number(monthly.replace(/,/g, '')) % 100, 0, q);
    if (/MORE/.test(q)) assert.equal(Number(p.answer), hp - cash, q);
    else assert.equal(Number(p.answer), hp, q);
  }
  assert.ok(seen > 100);
});
