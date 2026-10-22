// ============================================================================
// PAID PRACTICE — a family that has paid must not be shown the paywall
//
// What went wrong in production, and why both halves are pinned here:
//
//   The client called verify-subscription with { reference, plan }. The
//   deployed function required `user_id` in the body, so every single call
//   returned 400 and no payment ever granted a pass.
//
//   The function also hardcoded "at least KES 200, grant 30 days", from
//   before the week and month plans existed. A week pass is KES 100, so even
//   a correctly formed call was refused as "amount too low" — the family paid
//   and was turned away by the thing meant to let them in.
//
// The second one is what this file can hold: the price and length of a plan
// are facts the client and the function must agree on, and a test that reads
// both is the only thing that notices when they drift.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PLANS, availablePlans, WEEK_PASS_ENABLED, isPro, canPractice, passDaysLeft } from '../src/subscription.js';

const FN = readFileSync('supabase/functions/verify-subscription/index.ts', 'utf8');

test('the function prices every plan the client sells, at the same price', () => {
  // The drift that charged a family KES 100 and then refused it.
  const block = FN.slice(FN.indexOf('const PLANS'), FN.indexOf('};', FN.indexOf('const PLANS')));
  for (const p of Object.values(PLANS)) {
    const row = new RegExp(`${p.id}:\\s*\\{\\s*kes:\\s*(\\d+),\\s*days:\\s*(\\d+)`).exec(block);
    assert.ok(row, `verify-subscription does not know the "${p.id}" plan the client sells`);
    assert.equal(Number(row[1]), p.kes, `${p.id}: client charges ${p.kes}, function demands ${row[1]}`);
    assert.equal(Number(row[2]), p.days, `${p.id}: client promises ${p.days} days, function grants ${row[2]}`);
  }
});

test('the function no longer demands a user_id the client has never sent', () => {
  assert.ok(!/missing reference or user_id/.test(FN),
    'the function still rejects the body the client actually sends');
  assert.ok(/auth\.getUser\(/.test(FN),
    'the buyer must be taken from the caller’s token, not from the body');
});

test('the caller’s token is passed to getUser explicitly', () => {
  // getUser() with no argument looks for a STORED SESSION, and an edge
  // function has none — setting the Authorization header on the client does
  // not change that. It returned null for every caller, so every claim came
  // back "signed out" however good the reference was. Found by a real person
  // claiming a real payment; nothing here caught it, because every test
  // stubbed the function rather than running it.
  assert.ok(!/auth\.getUser\(\s*\)/.test(FN),
    'getUser() with no argument cannot see the caller inside an edge function');
  assert.ok(/auth\.getUser\(\s*token\s*\)/.test(FN),
    'the token lifted off the Authorization header must be passed to getUser');
  assert.ok(/replace\(\/\^Bearer/.test(FN),
    'the "Bearer " prefix has to come off before the token is used');
});

test('a reference cannot buy two passes', () => {
  // The client retries, and a recovered payment re-sends a reference that may
  // already have landed. Without the replay guard that is free practice.
  assert.ok(/subscription_payments/.test(FN), 'payments are not recorded, so nothing stops a replay');
});

// ---- the entitlement rules themselves --------------------------------------

test('a pass that runs until tomorrow lets a child practise', () => {
  const sub = { pro_until: new Date(Date.now() + 86400000).toISOString() };
  assert.equal(isPro(sub), true);
  assert.equal(canPractice(sub), true);
  assert.equal(passDaysLeft(sub), 1);
});

test('a pass that ran out yesterday does not', () => {
  const sub = { pro_until: new Date(Date.now() - 86400000).toISOString() };
  assert.equal(isPro(sub), false);
  assert.equal(passDaysLeft(sub), 0);
});

test('no row at all is not a pass', () => {
  assert.equal(isPro(null), false);
  assert.equal(isPro({}), false);
  assert.equal(isPro({ pro_until: null }), false);
});

test('only plans that can actually be granted are offered for sale', () => {
  // Taking KES 100 for a pass the deployed function will refuse is worse than
  // offering one plan. When WEEK_PASS_ENABLED flips, this follows it.
  const ids = availablePlans().map(p => p.id);
  assert.ok(ids.length > 0, 'nothing is for sale at all');
  assert.equal(ids.includes('week'), WEEK_PASS_ENABLED);
  assert.ok(ids.includes('month'), 'the month pass must always be sellable');
});
