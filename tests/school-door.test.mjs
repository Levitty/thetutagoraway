// ============================================================================
// SCHOOL PRACTICE (2 Nov): a school's exam results set HOREB practice at home.
//
// What must hold:
//   a link code is checked with the school's secret, the same way in HOREB's
//     database, in this file and in Tuta (the vectors below come from Tuta's PHP)
//   only Tuta's server, holding the secret, can set practice or read progress,
//     and an old signed call cannot be replayed
//   only learner references and skill ids cross: never a name
//   a child sees practice only once their parent has linked them
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  linkCheck, parseLinkCode, signCall, verifyCall, cleanAssign, practiceStatus, childProfileKey, CODE_CHARS,
} from '../src/school/schoolDoor.js';

const SECRET = 'test-secret-0123456789abcdef0123456789abcdef';

test('the link check matches Tuta: same secret, door and reference, same four letters', async () => {
  // php: hash_hmac('sha256', 'link:WSL:K7QM2XPA', SECRET, true), each of the first 4 bytes % 31
  assert.equal(await linkCheck(SECRET, 'WSL', 'K7QM2XPA'), 'A7N2');
  assert.notEqual(await linkCheck(SECRET, 'WSL', 'K7QM2XPB'), 'A7N2');
  assert.notEqual(await linkCheck('another-secret-0123456789abcdef0123456789', 'WSL', 'K7QM2XPA'), 'A7N2');
  for (const ch of await linkCheck(SECRET, 'WSL', 'K7QM2XPA')) assert.ok(CODE_CHARS.includes(ch));
});

test('a code reads with or without dashes, spaces or lower case', () => {
  const want = { door: 'WSL', ref: 'K7QM2XPA', check: 'A7N2' };
  assert.deepEqual(parseLinkCode('WSL-K7QM2XPA-A7N2'), want);
  assert.deepEqual(parseLinkCode('wsl k7qm 2xpa a7n2'), want);
  assert.equal(parseLinkCode('WSL-K7QM2XPA'), null, 'no check');
  assert.equal(parseLinkCode('W1L-K7QM2XPA-A7N2'), null, 'a door is letters');
  assert.equal(parseLinkCode('WSL-K7QM0XPA-A7N2'), null, '0 is not used in references');
});

test("Tuta's signature: the same as PHP's hash_hmac, and refused when stale or altered", async () => {
  const body = '{"action":"status"}';
  // php: hash_hmac('sha256', '1793600000.' . body, SECRET)
  assert.equal(await signCall(SECRET, '1793600000', body), 'e1651f5f7b6d75152c1c3574f09b431490628d5119dcd1ae30e3b3a2034ce7f7');
  const sig = await signCall(SECRET, '1793600000', body);
  assert.deepEqual(await verifyCall(SECRET, '1793600000', body, sig, 1793600100), { ok: true });
  assert.equal((await verifyCall(SECRET, '1793600000', body, sig, 1793600000 + 301)).why, 'stale', 'a replay after five minutes');
  assert.equal((await verifyCall(SECRET, '1793600000', body.replace('status', 'assign'), sig, 1793600100)).why, 'signature', 'an altered body');
  assert.equal((await verifyCall('wrong-secret-0123456789abcdef0123456789abcd', '1793600000', body, sig, 1793600100)).why, 'signature');
  assert.equal((await verifyCall(SECRET, 'soon', body, sig, 1793600100)).ok, false);
});

test('an assignment keeps only well-formed skill ids and references, and nothing else', () => {
  const c = cleanAssign({
    practice_ref: '6f1c2b8e-1d2a-4c1e-9a2b-3c4d5e6f7a8b', title: '  Fractions practice  ',
    skill_ids: ['G6_FRACTIONS_ADD', 'G6_FRACTIONS_ADD', 'drop table', ''], learner_refs: ['K7QM2XPA', 'Amani Wanjiru', 'K7QM2XPA'],
    due_on: '2026-11-16', name: 'Amani Wanjiru', phone: '0712345678',
  });
  assert.equal(c.ok, true);
  assert.deepEqual(c.row, { practice_ref: '6f1c2b8e-1d2a-4c1e-9a2b-3c4d5e6f7a8b', title: 'Fractions practice', skill_ids: ['G6_FRACTIONS_ADD'], learner_refs: ['K7QM2XPA'], due_on: '2026-11-16' });
  assert.equal(cleanAssign({ ...c.row, skill_ids: ['nope!'] }).ok, false);
  assert.equal(cleanAssign({ ...c.row, learner_refs: [] }).ok, false);
  assert.equal(cleanAssign({ ...c.row, practice_ref: '1' }).ok, false);
});

test('status: unlinked learners say so; linked ones report mastery of the set skills only', () => {
  const practice = { practice_ref: 'p1', skill_ids: ['G6_FRACTIONS_ADD', 'G6_FRACTIONS_SUB'], learner_refs: ['AAAAAAAA', 'BBBBBBBB'] };
  const links = [{ learner_ref: 'AAAAAAAA', parent_id: 'u1', child_id: 'c1' }];
  const progress = { [childProfileKey('u1', 'c1')]: { skills: {
    G6_FRACTIONS_ADD: { mastered: true, masteredAt: '2026-11-05T10:00:00.000Z', attempts: 9 },
    G6_FRACTIONS_SUB: { mastered: false, attempts: 3 },
    G9_SURDS_INTRO: { mastered: true, attempts: 4 },
  } } };
  const s = practiceStatus([practice], links, progress);
  assert.deepEqual(s.p1.BBBBBBBB, { linked: false, mastered: [], mastered_at: {}, practised: [] });
  assert.deepEqual(s.p1.AAAAAAAA.mastered, ['G6_FRACTIONS_ADD']);
  assert.equal(s.p1.AAAAAAAA.mastered_at.G6_FRACTIONS_ADD, '2026-11-05T10:00:00.000Z');
  assert.deepEqual(s.p1.AAAAAAAA.practised, ['G6_FRACTIONS_ADD', 'G6_FRACTIONS_SUB']);
  assert.ok(!JSON.stringify(s).includes('G9_SURDS_INTRO'), 'only the skills the school set');
});

test('the migration keeps the door closed: secrets and practice are not readable from the app', () => {
  const sql = readFileSync(new URL('../supabase/migrations/20261102_school_practice.sql', import.meta.url), 'utf8');
  for (const t of ['school_doors', 'school_learner_links', 'school_practice', 'school_link_attempts']) {
    assert.match(sql, new RegExp(`alter table public\\.${t} enable row level security`), `${t} has row security`);
  }
  assert.match(sql, /revoke all on public\.school_doors from anon, authenticated/);
  assert.match(sql, /revoke all on public\.school_practice from anon, authenticated/);
  assert.match(sql, /revoke all on function public\.create_school_door\(text, text\) from public, anon, authenticated/);
  assert.match(sql, /revoke all on function public\.school_link_check\(text, text, text\) from public, anon, authenticated/);
  // A parent links only their own child, and reads practice only for their own linked child.
  assert.match(sql, /c\.id = p_child and c\.parent_id = auth\.uid\(\)/);
  assert.match(sql, /l\.child_id = p_child and l\.parent_id = auth\.uid\(\)/);
  // Guessing is limited.
  assert.match(sql, /v_tries >= 10/);
  // The check is computed the same way as linkCheck(): bytes 0..3 of HMAC-SHA256, each % 31 into CODE_CHARS.
  assert.ok(sql.includes(`'${CODE_CHARS}'`) && sql.includes("get_byte(h, i) % 31") && sql.includes("'link:' || p_door || ':' || p_ref"));
  // No names, phones or marks are stored.
  const code = sql.replace(/--.*$/gm, '');
  assert.doesNotMatch(code, /\b(first_name|last_name|phone|marks)\b/);
});

test('the edge function is built from the tested rules', () => {
  const fn = readFileSync(new URL('../supabase/functions/school-practice/index.ts', import.meta.url), 'utf8');
  const lib = readFileSync(new URL('../src/school/schoolDoor.js', import.meta.url), 'utf8').replace(/^export const /gm, 'const ').trim();
  assert.ok(fn.includes(lib), 'run npm run build:school-fn');
  assert.match(fn, /verifyCall\(door\.secret/);
});
