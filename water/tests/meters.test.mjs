// The meter number is the only thing joining money to a person. These are the
// forms it actually arrives in, from a phone, in a corridor.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeMeterNo, looksLikeMeterNo, maskName, formatKes, receiptEmail, meterCandidates,
} from '../src/meters.js';

test('the same meter typed four ways is one meter', () => {
  // If these are four records, one tenant pays twice and the second payment
  // looks like somebody else's.
  for (const form of ['412', '00412', ' 412 ', '4 1 2']) {
    assert.equal(normalizeMeterNo(form), '412', `${JSON.stringify(form)} drifted`);
  }
  // A real prefix is kept and not silently eaten.
  assert.equal(normalizeMeterNo('M-412'), 'M412');
});

test('a label off the notice does not become part of the number', () => {
  // The defect this closes: the notice says "Meter No. 412", so the tenant
  // types "no. 412" — which normalises to the meter NO412. That meter does not
  // exist, so a tenant who read their own number correctly cannot pay, and the
  // screen tells them their number is wrong.
  assert.deepEqual(meterCandidates('no. 412'), ['NO412', '412']);
  assert.deepEqual(meterCandidates('Meter 412'), ['METER412', '412']);
  assert.deepEqual(meterCandidates('account no 412'), ['ACCOUNTNO412', '412']);
});

test('a meter genuinely prefixed with a label still wins', () => {
  // Order matters: if a real meter IS called NO412, the exact match must be
  // tried before the stripped one, or two tenants collide.
  assert.equal(meterCandidates('NO412')[0], 'NO412');
});

test('a plain number offers exactly one candidate', () => {
  assert.deepEqual(meterCandidates('00412'), ['412']);
  assert.deepEqual(meterCandidates(''), []);
});

test('a prefixed meter keeps its prefix but loses its padding', () => {
  assert.equal(normalizeMeterNo('WM00412'), 'WM412');
  assert.equal(normalizeMeterNo('wm 412'), 'WM412');
});

test('a non-ASCII dash off a printed notice still matches', () => {
  // The landlord's notice was typed in Word, so the hyphen is an en dash.
  assert.equal(normalizeMeterNo('M–412'), 'M412');
  assert.equal(normalizeMeterNo('M—412'), 'M412');
});

test('full-width digits from a phone keyboard still match', () => {
  assert.equal(normalizeMeterNo('４１２'), '412');
});

test('nothing, or junk, is not a meter number', () => {
  for (const bad of [null, undefined, '', '   ', '-', 'ABC']) {
    assert.equal(looksLikeMeterNo(bad), false, `accepted ${JSON.stringify(bad)}`);
  }
  assert.equal(looksLikeMeterNo('412'), true);
  assert.equal(looksLikeMeterNo('WM412'), true);
});

test('zero is not quietly turned into a meter', () => {
  // "0" and "000" normalise to "0"; they must not pass as a real meter by
  // accident, but they must not crash either.
  assert.equal(normalizeMeterNo('000'), '0');
  assert.equal(looksLikeMeterNo('0'), false); // too short
});

// ---- what a stranger is allowed to see ------------------------------------
test('a looked-up tenant is named enough to recognise, not enough to harvest', () => {
  // Anyone can type any number, so lookup is an enumeration oracle: walk
  // 1..9999 and you have the estate's tenant list. The house must come back,
  // the full name must not.
  assert.equal(maskName('Wanjiru Njoroge'), 'W. Njoroge');
  assert.equal(maskName('Mary Anne Kamau'), 'M. A. Kamau');
});

test('a one-word name is reduced to its initial', () => {
  // "Wanjiru" alone IS the whole name, so returning it whole defeats the mask.
  assert.equal(maskName('Wanjiru'), 'W.');
});

test('a missing name does not produce a stray full stop', () => {
  assert.equal(maskName(null), '');
  assert.equal(maskName('   '), '');
});

// ---- money and receipts ----------------------------------------------------
test('money reads the way it does on the notice', () => {
  assert.equal(formatKes(1240), 'KES 1,240');
  assert.equal(formatKes(740.4), 'KES 740');
  assert.equal(formatKes(0), 'KES 0');
  assert.equal(formatKes(null), 'KES 0');
});

test('a meter gets the same receipt address every month', () => {
  // Paystack needs an email and an M-Pesa tenant often has none. A stable,
  // derived address keeps a meter's payments grouped in Paystack's dashboard.
  assert.equal(receiptEmail('00412', 'tutagora.com'), 'meter-412@tutagora.com');
  assert.equal(receiptEmail('412', 'tutagora.com'), 'meter-412@tutagora.com');
  assert.equal(receiptEmail('M-412', 'tutagora.com'), 'meter-m412@tutagora.com');
});
