// ============================================================================
// SCHOOL EXAM EVIDENCE (12 Nov 2026): the `evidence` door action puts a school's question marks in the learner log.
//
// What must hold:
//   one row per question mark, source school_exam, item_ref exam:<question id>, for the door's learner reference
//   the row carries marks and max_marks, the outcome or sub-strand, independent true, and is right only on full marks
//   the same call twice writes nothing twice; a corrected mark updates its row, it does not add another
//   an item with no outcome or sub-strand, a bad reference or an impossible mark is skipped and named, never guessed
//   the call is signed with the door secret like every other door call, and the function is built from this code
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { doorEvidence, cleanEvidenceItem, subjectOfCode, EVIDENCE_MAX_ITEMS } from '../src/school/evidenceDoor.js';
import { memoryStore } from '../src/school/homeworkStore.js';
import { signCall, verifyCall } from '../src/school/schoolDoor.js';

const door = { id: 'd1', code: 'WSL', secret: 'test-secret-0123456789abcdef0123456789abcdef', active: true };
const Q1 = '6f1c2b8e-1d2a-4c1e-9a2b-3c4d5e6f7a8b', Q2 = '7a1c2b8e-1d2a-4c1e-9a2b-3c4d5e6f7a8c', Q3 = '8b1c2b8e-1d2a-4c1e-9a2b-3c4d5e6f7a8d';
const OUT = 'CRE.G5.CREATI.MY_PURPOSE_TALENTS_AND_A.OUT_A', SUB = 'MATH.G5.NUMBER.FRACTIONS';
const item = (o = {}) => ({ learner_ref: 'AAAAAAAA', question_id: Q1, outcome_code: OUT, marks: 3, max_marks: 4, ...o });
const call = (store, items) => doorEvidence(door, { action: 'evidence', items }, { store });

test('one question mark is one row for the door learner, with marks, outcome and independent', async () => {
  const store = memoryStore([door]);
  const r = await call(store, [item({ difficulty: 'hard', at: '2026-11-10T08:00:00Z' }), item({ question_id: Q2, outcome_code: undefined, substrand_code: SUB, marks: 2, max_marks: 2 })]);
  assert.equal(r.status, 200);
  assert.deepEqual({ received: r.body.received, saved: r.body.saved, updated: r.body.updated, same: r.body.same, skipped: r.body.skipped }, { received: 2, saved: 2, updated: 0, same: 0, skipped: [] });
  const [a, b] = store.evidence;
  assert.equal(a.source, 'school_exam'); assert.equal(a.door_id, 'd1'); assert.equal(a.learner_ref, 'AAAAAAAA'); assert.equal(a.student_id, undefined);
  assert.equal(a.item_ref, `exam:${Q1}`); assert.equal(a.marks, 3); assert.equal(a.max_marks, 4); assert.equal(a.outcome_code, OUT); assert.equal(a.substrand_code, null);
  assert.equal(a.independent, true); assert.equal(a.correct, false, 'right only on full marks'); assert.equal(a.difficulty, 'hard'); assert.equal(a.subject, 'cre');
  assert.equal(a.client_ts, '2026-11-10T08:00:00.000Z'); assert.equal(a.skill_id, OUT, 'skill_id is not null on the table');
  assert.equal(b.correct, true); assert.equal(b.outcome_code, null); assert.equal(b.substrand_code, SUB); assert.equal(b.subject, 'math');
});

test('the same call twice writes nothing twice; a corrected mark updates its row', async () => {
  const store = memoryStore([door]);
  await call(store, [item()]);
  const again = await call(store, [item()]);
  assert.deepEqual([again.body.saved, again.body.updated, again.body.same], [0, 0, 1]);
  assert.equal(store.evidence.length, 1);
  const fixed = await call(store, [item({ marks: 4 })]);
  assert.deepEqual([fixed.body.saved, fixed.body.updated], [0, 1]);
  assert.equal(store.evidence.length, 1);
  assert.equal(store.evidence[0].marks, 4); assert.equal(store.evidence[0].correct, true);
  // Another learner on the same question is another row; the same ref at another door is too.
  await call(store, [item({ learner_ref: 'BBBBBBBB' })]);
  assert.equal(store.evidence.length, 2);
  // The same item twice in one call counts once, the last one winning.
  const dup = await call(memoryStore([door]), [item({ marks: 1 }), item({ marks: 2 })]);
  assert.equal(dup.body.saved, 1);
});

test('what cannot be used is skipped and named, never guessed', async () => {
  const store = memoryStore([door]);
  const r = await call(store, [item(), item({ question_id: Q2, outcome_code: undefined }), item({ question_id: Q3, learner_ref: 'Ada Wanjiku' }),
    item({ question_id: Q3, marks: 9 }), item({ question_id: Q3, max_marks: 0 }), item({ question_id: 'nope' }), item({ question_id: Q3, marks: -1 }), null]);
  assert.equal(r.body.saved, 1);
  assert.deepEqual(r.body.skipped.map(s => s.why), ['no outcome or sub-strand', 'learner_ref', 'marks', 'max_marks', 'question_id', 'marks', 'not an item']);
  assert.deepEqual(r.body.skipped.map(s => s.i), [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(store.evidence.length, 1);
  assert.equal((await call(store, [])).status, 400);
  assert.equal((await call(store, Array.from({ length: EVIDENCE_MAX_ITEMS + 1 }, () => item()))).status, 413);
  assert.equal(await doorEvidence(door, { action: 'status' }, { store }), null, 'not this action');
  // Marks may arrive as numeric strings (PHP), and an unknown difficulty or subject is dropped.
  const c = cleanEvidenceItem(item({ marks: '2.5', max_marks: '4', difficulty: 'impossible', subject: 'Bad Subject!' }), door);
  assert.equal(c.row.marks, 2.5); assert.equal(c.row.difficulty, null); assert.equal(c.row.subject, 'cre');
  assert.equal(subjectOfCode('KISW.G5.X'), 'kisw'); assert.equal(subjectOfCode('5.x'), null);
});

test('nothing but codes, references and marks is kept: no name, admission number or phone field survives', () => {
  const c = cleanEvidenceItem(item({ name: 'Ada', admission_no: '123', phone: '0722', first_name: 'Ada' }), door);
  assert.deepEqual(Object.keys(c.row).sort(), ['attempt_no', 'client_ts', 'correct', 'difficulty', 'door_id', 'framework', 'hints_used', 'independent', 'item_ref', 'learner_ref', 'marks', 'max_marks',
    'outcome_code', 'skill_id', 'source', 'subject', 'substrand_code']);
});

test('the call is signed like every door call, and the edge function is built from these rules', async () => {
  const body = JSON.stringify({ action: 'evidence', items: [item()] });
  const time = '1793600000';
  const sig = await signCall(door.secret, time, body);
  assert.deepEqual(await verifyCall(door.secret, time, body, sig, 1793600010), { ok: true });
  assert.equal((await verifyCall(door.secret, time, body.replace('"marks":3', '"marks":4'), sig, 1793600010)).ok, false, 'an altered mark is refused');
  const { buildSchoolFns } = await import('../scripts/build-school-practice-fn.mjs');
  const built = (await buildSchoolFns())['school-practice'];
  assert.equal(readFileSync(new URL('../supabase/functions/school-practice/index.ts', import.meta.url), 'utf8'), built, 'run npm run build:school-fn');
  assert.match(built, /action === "evidence"/); assert.match(built, /school_exam/);
  // The verify step comes before any action, in the function as built.
  assert.ok(built.indexOf('verifyCall(door.secret') < built.indexOf('action === "evidence"'));
});

test('the log already allows this source, item_ref and a school learner (migration 20261111)', () => {
  const sql = readFileSync(new URL('../supabase/migrations/20261111_learner_evidence.sql', import.meta.url), 'utf8');
  assert.match(sql, /'school_exam'/); assert.match(sql, /response_events_evidence_once/); assert.match(sql, /alter column student_id drop not null/);
});
