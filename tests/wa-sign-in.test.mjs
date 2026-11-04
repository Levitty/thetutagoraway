// ============================================================================
// SIGN IN TO HOREB FROM WHATSAPP
//
// src/auth/waSignIn.js is the code the wa-sign-in edge function runs (inlined
// by the build), so these are the real rules: who gets a link, the limits,
// one use, ten minutes, the signed door; and the browser half with a fake
// Supabase client.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  nine, decideIssue, accountKind, redeemable, expiresAt, doorSignatureOk, hmacHex, newToken,
  tokenLooksRight, tokenFromHash, linkUrl, LINK_MINUTES, PER_PHONE_PER_HOUR,
} from '../src/auth/waSignIn.js';
import { redeemWhatsAppLink, WA_LINK_FAILED } from '../src/auth/waSignInClient.js';
import { buildWaSignInFn } from '../scripts/build-wa-sign-in-fn.mjs';

const parent = (o = {}) => ({ id: 'u1', role: 'student', is_admin: false, email: 'p@example.com', account_type: 'parent', children: 2, ...o });
const base = { phone9: '712345678', enabled: true, phoneLinksLastHour: 0, linksToday: 0, dailyCap: 300 };

test('Kenyan numbers normalise the same way in every form', () => {
  for (const p of ['0712345678', '712345678', '+254712345678', '254712345678', '+254 712 345 678']) assert.equal(nine(p), '712345678', p);
  assert.equal(nine('0112345678'), '112345678');
  for (const p of ['', '123', '0812345678', '+44 20 7946 0000', null]) assert.equal(nine(p), '');
});

test('a parent gets a link to their parent home', () => {
  const d = decideIssue({ ...base, matches: [parent()] });
  assert.deepEqual(d, { result: 'link', profile_id: 'u1', kind: 'parent' });
  assert.equal(linkUrl('https://tutagora.com/', 'T'), 'https://tutagora.com/dashboard#wa=T');
});

test('a parent without account_type is still a parent when they have added children', () => {
  assert.equal(accountKind(parent({ account_type: null, children: 1 })), 'parent');
  assert.equal(accountKind(parent({ account_type: null, children: 0 })), 'learner');
});

test('tutors get a link; a learner\'s own account never does', () => {
  assert.equal(decideIssue({ ...base, matches: [parent({ role: 'tutor', account_type: 'tutor', children: 0 })] }).result, 'link');
  assert.equal(decideIssue({ ...base, matches: [parent({ account_type: 'student', children: 0 })] }).result, 'none');
});

test('no admin gets a passwordless link', () => {
  assert.equal(decideIssue({ ...base, matches: [parent({ is_admin: true })] }).result, 'password');
  assert.equal(decideIssue({ ...base, matches: [parent({ email: 'MutualEvy@gmail.com' })] }).result, 'password');
  assert.equal(decideIssue({ ...base, matches: [parent({ role: 'tutor', is_admin: true })] }).result, 'password');
});

test('no match or two matches: the same neutral answer', () => {
  assert.equal(decideIssue({ ...base, matches: [] }).result, 'none');
  assert.equal(decideIssue({ ...base, matches: [parent(), parent({ id: 'u2' })] }).result, 'none');
  assert.equal(decideIssue({ ...base, phone9: '', matches: [parent()] }).result, 'none');
  assert.equal(decideIssue({ ...base, matches: [parent({ email: '' })] }).result, 'none');
});

test('switched off, and the rate limits', () => {
  assert.equal(decideIssue({ ...base, enabled: false, matches: [parent()] }).result, 'off');
  assert.equal(decideIssue({ ...base, phoneLinksLastHour: PER_PHONE_PER_HOUR - 1, matches: [parent()] }).result, 'link');
  assert.equal(decideIssue({ ...base, phoneLinksLastHour: PER_PHONE_PER_HOUR, matches: [parent()] }).result, 'limited');
  assert.equal(decideIssue({ ...base, linksToday: 300, matches: [parent()] }).result, 'limited');
});

test('a link works once and for ten minutes', () => {
  const now = Date.parse('2026-11-04T11:05:00Z');
  const row = { used_at: null, expires_at: expiresAt(now) };
  assert.equal(LINK_MINUTES, 10);
  assert.equal(redeemable(row, now + 9 * 60000), 'ok');
  assert.equal(redeemable(row, now + 10 * 60000), 'expired');
  assert.equal(redeemable({ ...row, used_at: new Date(now).toISOString() }, now), 'used');
  assert.equal(redeemable(null, now), 'unknown');
});

test('the signed door: right secret, five minutes, the body it was signed for', async () => {
  const secret = 'k'.repeat(64), body = '{"action":"issue","phone":"254712345678"}', t = 1800000000;
  const sign = await hmacHex(secret, `${t}.${body}`);
  assert.ok(await doorSignatureOk(secret, String(t), body, sign, t + 5));
  assert.ok(!(await doorSignatureOk(secret, String(t), body, sign, t + 301)));
  assert.ok(!(await doorSignatureOk(secret, String(t), body.replace('712', '799'), sign, t)));
  assert.ok(!(await doorSignatureOk('z'.repeat(64), String(t), body, sign, t)));
});

test('tokens are random and only a well-formed one is read from the address', () => {
  const a = newToken();
  assert.ok(tokenLooksRight(a) && a !== newToken());
  assert.equal(tokenFromHash(`#wa=${a}`), a);
  assert.equal(tokenFromHash('#wa=short'), '');
  assert.equal(tokenFromHash('#access_token=x'), '');
});

const fakeClient = (reply) => {
  const calls = [];
  return {
    calls,
    auth: {
      signOut: async () => { calls.push('signOut'); },
      verifyOtp: async (a) => { calls.push(['verifyOtp', a]); return { data: { session: { user: { id: 'u1' } } }, error: null }; },
    },
    functions: { invoke: async (name, o) => { calls.push(['invoke', name, o.body.action]); return reply; } },
  };
};

test('the browser half: token off the address bar, swapped once, then a session', async () => {
  const t = newToken();
  const hist = { replaced: null, replaceState(_a, _b, url) { this.replaced = url; } };
  const c = fakeClient({ data: { token_hash: 'abc' }, error: null });
  const r = await redeemWhatsAppLink(c, { hash: `#wa=${t}`, pathname: '/dashboard' }, hist);
  assert.deepEqual(r, { ok: true });
  assert.equal(hist.replaced, '/dashboard');
  assert.deepEqual(c.calls[1], ['invoke', 'wa-sign-in', 'redeem']);
  assert.deepEqual(c.calls[2], ['verifyOtp', { token_hash: 'abc', type: 'magiclink' }]);
});

test('the browser half: a used or expired link says so and starts no session', async () => {
  const c = fakeClient({ data: null, error: new Error('400') });
  const r = await redeemWhatsAppLink(c, { hash: `#wa=${newToken()}`, pathname: '/dashboard' }, null);
  assert.deepEqual(r, { ok: false, message: WA_LINK_FAILED });
  assert.ok(!c.calls.some((x) => Array.isArray(x) && x[0] === 'verifyOtp'));
  assert.equal(await redeemWhatsAppLink(c, { hash: '', pathname: '/' }, null), null);
});

test('the deployed function is built from exactly this code', () => {
  const onDisk = readFileSync(new URL('../supabase/functions/wa-sign-in/index.ts', import.meta.url), 'utf8');
  assert.equal(onDisk, buildWaSignInFn(), 'supabase/functions/wa-sign-in/index.ts is stale: npm run build:wa-sign-in-fn');
});
