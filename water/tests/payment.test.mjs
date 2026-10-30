// The failure that cost a real payment on the tutoring product, restated here
// because a water app meets it harder: M-Pesa completes on the phone, and
// Paystack says "not successful" while the PIN is still being typed.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  shouldForget, isStale, makeConfirmer, amountOk, overpaymentKes,
  STILL_SETTLING_MS, GIVE_UP_MS, CONFIRM_SCHEDULE,
} from '../src/payment.js';

const NOW = 1_800_000_000_000;
const pending = (ageMs = 0) => ({ reference: 'WTR-1', at: NOW - ageMs });

test('"not successful" is not a verdict while the PIN is still being typed', () => {
  // THE bug. Paystack answers "not successful" for a payment waiting on the
  // STK prompt. The first version threw the reference away on that answer, so
  // the money left the phone and nothing ever confirmed it.
  const answer = { paid: false, final: false, error: 'not successful' };
  assert.equal(shouldForget(pending(5_000), answer, NOW), false);
  assert.equal(shouldForget(pending(60_000), answer, NOW), false);
});

test('"not successful" becomes a verdict once the prompt is long dead', () => {
  const answer = { paid: false, final: false, error: 'not successful' };
  assert.equal(shouldForget(pending(STILL_SETTLING_MS + 1000), answer, NOW), true);
});

test('a payment Paystack calls finally failed is dropped at once', () => {
  // Distinct from "not yet": the tenant cancelled, or it expired.
  assert.equal(shouldForget(pending(2_000), { paid: false, final: true }, NOW), true);
});

test('a confirmed payment is dropped, because the server recorded it', () => {
  assert.equal(shouldForget(pending(2_000), { paid: true }, NOW), true);
});

test('a server we could not reach has told us nothing', () => {
  // Treating "the network is down" as "the payment failed" is the same class
  // of mistake as treating "not yet" as "no".
  for (const err of ['network error', 'Server unreachable', 'timeout']) {
    assert.equal(shouldForget(pending(10_000), { paid: false, error: err }, NOW), false, err);
  }
});

test('no answer at all is not an answer', () => {
  assert.equal(shouldForget(pending(10_000), null, NOW), false);
  assert.equal(shouldForget(pending(10_000), undefined, NOW), false);
});

test('a reference days old is given up on whatever the server says', () => {
  assert.equal(shouldForget(pending(GIVE_UP_MS + 1), null, NOW), true);
  assert.equal(isStale(pending(GIVE_UP_MS + 1), NOW), true);
  assert.equal(isStale(pending(60_000), NOW), false);
});

test('a pending record with no reference is junk', () => {
  assert.equal(shouldForget({ at: NOW }, null, NOW), true);
  assert.equal(shouldForget(null, null, NOW), true);
});

test('the confirm schedule keeps asking for about a minute', () => {
  // The tutoring version asked three times in four seconds, while M-Pesa was
  // still settling, then told the family to WhatsApp us.
  assert.ok(CONFIRM_SCHEDULE[CONFIRM_SCHEDULE.length - 1] >= 60_000,
    'gives up before M-Pesa has settled');
  assert.ok(CONFIRM_SCHEDULE.length >= 8, 'too few attempts to ride out a slow settle');
  const sorted = [...CONFIRM_SCHEDULE].sort((a, b) => a - b);
  assert.deepEqual(CONFIRM_SCHEDULE, sorted, 'schedule must be increasing');
});

test('three callers at once ask the server once', async () => {
  // The popup callback, the retry schedule and the tab regaining focus all
  // fire within the same second.
  let calls = 0;
  const confirm = makeConfirmer(async () => { calls += 1; await new Promise(r => setTimeout(r, 10)); return { paid: false }; });
  await Promise.all([confirm('WTR-1'), confirm('WTR-1'), confirm('WTR-1')]);
  assert.equal(calls, 1);
});

test('after one settles, the next caller does ask again', async () => {
  let calls = 0;
  const confirm = makeConfirmer(async () => { calls += 1; return { paid: false }; });
  await confirm('WTR-1');
  await confirm('WTR-1');
  assert.equal(calls, 2);
});

// ---- the amount ------------------------------------------------------------
test('paying less than the bill does not clear the bill', () => {
  // Marking a KES 740 bill paid on KES 100 is how a landlord's ledger stops
  // matching their bank.
  assert.equal(amountOk(10_000, 740), false);
  assert.equal(amountOk(73_999, 740), false);
});

test('paying the bill exactly clears it', () => {
  assert.equal(amountOk(74_000, 740), true);
});

test('rounding up is accepted and the excess is recorded', () => {
  // People pay KES 750 on a 740 bill. Refusing money that has already left the
  // phone helps nobody; the extra is carried forward.
  assert.equal(amountOk(75_000, 740), true);
  assert.equal(overpaymentKes(75_000, 740), 10);
  assert.equal(overpaymentKes(74_000, 740), 0);
});

test('an underpayment has no overpayment', () => {
  assert.equal(overpaymentKes(10_000, 740), 0);
});

test('a nonsense amount or a zero bill is never OK', () => {
  // A zero-amount bill would otherwise be "paid" by paying nothing.
  for (const [paid, want] of [[NaN, 740], [74_000, 0], [74_000, -5], ['x', 740], [74_000, null]]) {
    assert.equal(amountOk(paid, want), false, `${paid} vs ${want}`);
  }
});
