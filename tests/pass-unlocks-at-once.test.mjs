// ============================================================================
// F20 — a paid pass must turn on straight away, not "later"
//
// A parent paid by M-Pesa; reviews worked but new lessons stayed behind the
// paywall until the app was reloaded. The app asked verify-subscription three
// times in about four seconds, while M-Pesa takes a few seconds to settle, and
// it threw a reference away the first time Paystack said "not successful",
// which Paystack also says for a payment still waiting for the PIN.
//
// These checks run the real confirmation code against a pretend
// verify-subscription that only says "success" after a delay.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  rememberPendingPass, readPendingPass, recoverPendingPass, confirmPendingPass,
  classifyReply, STILL_SETTLING_MS, GIVE_UP_MS, CONFIRM_SCHEDULE,
} from '../src/pendingPass.js';

const memory = () => {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) };
};

// A pretend verify-subscription: "payment not successful" (as a non-2xx, the
// way supabase-js delivers it) until the clock passes `settlesAt`.
const paystack = (clock, settlesAt) => {
  const calls = [];
  const invoke = async (_fn, { body }) => {
    calls.push({ at: clock.t, ...body });
    if (clock.t >= settlesAt) return { data: { verified: true, pro_until: '2026-11-02T00:00:00.000Z' }, error: null };
    return { data: null, error: { context: { json: async () => ({ verified: false, error: 'payment not successful' }) } } };
  };
  return { invoke, calls };
};
const fakeClock = (start = 1_000_000) => {
  const clock = { t: start };
  clock.now = () => clock.t;
  clock.sleep = async (ms) => { clock.t += ms; };
  return clock;
};

test('a payment that settles 10 seconds after Paystack says success unlocks without a reload', async () => {
  const s = memory(), clock = fakeClock();
  rememberPendingPass('u1', 'PASS-u1-a', 'week', clock.t, s);
  const ps = paystack(clock, clock.t + 10_000);
  const got = await confirmPendingPass('u1', { invoke: ps.invoke, now: clock.now, s, sleep: clock.sleep });
  assert.equal(got, '2026-11-02T00:00:00.000Z');
  assert.equal(readPendingPass('u1', s), null, 'a granted reference is forgotten');
});

test('the app keeps asking for at least a minute, not four seconds', () => {
  assert.ok(CONFIRM_SCHEDULE.at(-1) >= 60_000, `the last ask is at ${CONFIRM_SCHEDULE.at(-1)} ms`);
  assert.ok(CONFIRM_SCHEDULE.length <= 12, 'but does not hammer the function');
});

test('"not successful" while the PIN is still being typed does not throw the reference away', async () => {
  const s = memory(), clock = fakeClock();
  rememberPendingPass('u2', 'PASS-u2-a', 'month', clock.t, s);
  const ps = paystack(clock, clock.t + 5 * 60_000); // the parent takes five minutes
  assert.equal(await recoverPendingPass('u2', { invoke: ps.invoke, now: clock.now, s }), null);
  assert.ok(readPendingPass('u2', s), 'kept: the payment may still land');
  clock.t += 6 * 60_000; // they come back to the app
  assert.equal(await recoverPendingPass('u2', { invoke: ps.invoke, now: clock.now, s }), '2026-11-02T00:00:00.000Z');
});

test('a reference that never paid is dropped once the M-Pesa prompt has expired', async () => {
  const s = memory(), clock = fakeClock();
  rememberPendingPass('u3', 'PASS-u3-a', 'week', clock.t, s);
  const ps = paystack(clock, Infinity);
  clock.t += STILL_SETTLING_MS + 1;
  assert.equal(await recoverPendingPass('u3', { invoke: ps.invoke, now: clock.now, s }), null);
  assert.equal(readPendingPass('u3', s), null);
});

test('final answers stop the asking; offline and signed out do not', () => {
  assert.equal(classifyReply({ verified: true }, 0), 'granted');
  assert.equal(classifyReply({ said: 'reference already used' }, 0), 'final');
  assert.equal(classifyReply({ said: 'unknown plan' }, 0), 'final');
  assert.equal(classifyReply({ said: 'payment not successful' }, 60_000), 'retry');
  assert.equal(classifyReply({ said: 'payment not successful' }, STILL_SETTLING_MS + 1), 'final');
  assert.equal(classifyReply({ said: 'network' }, 0), 'retry');
  assert.equal(classifyReply({ said: 'signed out' }, 0), 'retry', 'the money was taken; whoever signs back in gets the pass');
});

test('a reference older than three days is given up', async () => {
  const s = memory(), clock = fakeClock();
  rememberPendingPass('u4', 'PASS-u4-a', 'week', clock.t, s);
  clock.t += GIVE_UP_MS + 1;
  const ps = paystack(clock, 0);
  assert.equal(await recoverPendingPass('u4', { invoke: ps.invoke, now: clock.now, s }), null);
  assert.equal(ps.calls.length, 0);
  assert.equal(readPendingPass('u4', s), null);
});

test('callers asking at once share one question to Paystack', async () => {
  const s = memory(), clock = fakeClock();
  rememberPendingPass('u5', 'PASS-u5-a', 'week', clock.t, s);
  const ps = paystack(clock, 0);
  const [a, b, c] = await Promise.all([1, 2, 3].map(() => recoverPendingPass('u5', { invoke: ps.invoke, now: clock.now, s })));
  assert.ok(a && b && c);
  assert.equal(ps.calls.length, 1);
});

test('the paywall, the Paystack window closing and the app coming back all confirm a waiting payment', () => {
  const app = readFileSync('src/App.jsx', 'utf8');
  const modal = app.slice(app.indexOf('const PaywallModal'), app.indexOf('// ============ AUTH CONTEXT'));
  assert.ok(/onSuccess:[\s\S]*?confirmPendingPass\(/.test(modal), 'after Paystack success the app must keep confirming');
  assert.ok(/onClose:\s*async[\s\S]*?confirmPendingPass\(/.test(modal), 'closing the Paystack window must not end the checking');
  assert.ok(/useEffect\([\s\S]*?readPendingPass\(user\.id\)[\s\S]*?recoverPendingPass\(/.test(modal), 'opening the paywall over a waiting payment must confirm it first');
  assert.ok(!/attempt < 3/.test(modal), 'the three-tries-in-four-seconds loop is back');
  assert.ok(/visibilitychange[\s\S]{0,400}/.test(app) && /readPendingPass\(user\.id\)\) fetchSubscription/.test(app), 'coming back to the app must confirm a waiting payment');
});
