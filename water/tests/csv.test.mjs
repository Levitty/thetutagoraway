// The meter list arrives as a paste out of Excel. These are the ways that
// paste is wrong, every one of which fails silently if nobody checks.
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, parseAmount, splitLine, thisPeriod } from '../src/csv.js';

test('a plain list imports', () => {
  const { rows, problems } = parseCsv(
    'meter_no,house,tenant_name,amount_kes\n412,B3,Wanjiru Njoroge,740\n413,B4,John Omondi,1200');
  assert.equal(problems.length, 0);
  assert.equal(rows.length, 2);
  assert.deepEqual(rows[0], { meter_no: '412', house: 'B3', tenant_name: 'Wanjiru Njoroge', amount_kes: 740 });
});

test('Excel’s "CSV UTF-8" byte order mark does not eat the first column', () => {
  // The BOM makes the first header "﻿meter_no", which matches nothing, so
  // the import reports "no meter number column" on a file that plainly has
  // one — or worse, silently produces zero rows.
  const { rows, problems } = parseCsv('﻿meter_no,house,amount_kes\n412,B3,740');
  assert.equal(problems.length, 0, JSON.stringify(problems));
  assert.equal(rows.length, 1);
  assert.equal(rows[0].meter_no, '412');
});

test('a thousands separator does not turn KES 1,240 into KES 1', () => {
  // Split naively on commas and "1,240" becomes two cells. The tenant is then
  // billed one shilling, and nobody notices until they pay it.
  const { rows, problems } = parseCsv('meter_no,house,amount_kes\n412,B3,"1,240"');
  assert.equal(problems.length, 0);
  assert.equal(rows[0].amount_kes, 1240);
});

test('currency text and decimals are read as money', () => {
  assert.equal(parseAmount('KES 1,240.00'), 1240);
  assert.equal(parseAmount('740'), 740);
  assert.equal(parseAmount('740.49'), 740);
  assert.equal(parseAmount('740.5'), 741);
});

test('a blank or junk amount is reported, never defaulted to zero', () => {
  // A bill that silently becomes 0 is a bill nobody owes, and the tenant is
  // never asked for it.
  assert.equal(parseAmount(''), null);
  assert.equal(parseAmount('n/a'), null);
  assert.equal(parseAmount(null), null);
  const { rows, problems } = parseCsv('meter_no,amount_kes\n412,\n413,n/a\n414,0\n415,740');
  assert.equal(rows.length, 1, 'only the valid row should import');
  assert.equal(rows[0].meter_no, '415');
  assert.equal(problems.length, 3);
  assert.deepEqual(problems.map(p => p.line), [2, 3, 4], 'problems must name their line');
});

test('headers in any case, spacing or wording still match', () => {
  const { rows, problems } = parseCsv('Meter No , House , Tenant Name , Amount\n412,B3,Wanjiru,740');
  assert.equal(problems.length, 0, JSON.stringify(problems));
  assert.equal(rows[0].meter_no, '412');
  assert.equal(rows[0].house, 'B3');
  assert.equal(rows[0].amount_kes, 740);
});

test('Windows line endings and a trailing blank line import cleanly', () => {
  const { rows, problems } = parseCsv('meter_no,amount_kes\r\n412,740\r\n413,800\r\n\r\n');
  assert.equal(problems.length, 0);
  assert.equal(rows.length, 2);
});

test('a blank row in the middle is skipped, not reported as broken', () => {
  // Someone pressed enter. That is not an error worth alarming them about.
  const { rows, problems } = parseCsv('meter_no,amount_kes\n412,740\n\n413,800');
  assert.equal(rows.length, 2);
  assert.equal(problems.length, 0);
});

test('a row with no meter number is reported with its line number', () => {
  const { rows, problems } = parseCsv('meter_no,house\n,B3\n413,B4');
  assert.equal(rows.length, 1);
  assert.equal(problems[0].line, 2);
});

test('a missing meter column fails loudly and says what it did find', () => {
  const { rows, problems } = parseCsv('house,amount\nB3,740');
  assert.equal(rows.length, 0);
  assert.match(problems[0].error, /meter no/i);
  assert.match(problems[0].error, /house/, 'should say what columns it saw');
});

test('nothing pasted is a problem, not a crash', () => {
  for (const input of ['', '   ', null, undefined]) {
    const { rows, problems } = parseCsv(input);
    assert.equal(rows.length, 0);
    assert.equal(problems.length, 1);
  }
});

test('quoted fields with commas and escaped quotes survive', () => {
  assert.deepEqual(splitLine('412,"Njoroge, W.","He said ""hi"""'),
    ['412', 'Njoroge, W.', 'He said "hi"']);
});

test('readings import as numbers, and blank readings as null not zero', () => {
  // A previous reading of 0 where there is none would make the next bill look
  // like the tenant used their entire lifetime consumption this month.
  const { rows } = parseCsv('meter_no,amount_kes,prev_reading,reading\n412,740,1140,1182\n413,800,,');
  assert.equal(rows[0].prev_reading, 1140);
  assert.equal(rows[0].reading, 1182);
  assert.equal(rows[1].prev_reading, null);
  assert.equal(rows[1].reading, null);
});

test('the period is the year and month, zero padded', () => {
  assert.equal(thisPeriod(new Date('2026-01-15T00:00:00')), '2026-01');
  assert.equal(thisPeriod(new Date('2026-10-30T00:00:00')), '2026-10');
});
