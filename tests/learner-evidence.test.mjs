// ============================================================================
// LEARNER EVIDENCE (11 Nov 2026): every answer a child gives is one row in response_events.
//
// What must hold:
//   a practice row is marked source 'practice' and carries cskill and difficulty only when the item has them
//   a homework answer becomes one row for the school learner (door and reference, no student), once only
//   a tutor answer becomes one row for the account, not independent, once per session and question
//   the learner's own answer is never failed by the evidence insert
//   the migration extends the table the way the design says, with nothing that cannot be run in the SQL editor
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { practiceEvidence, homeworkEvidence, tutorEvidence, SOURCES, DIFFICULTIES } from '../src/learner/evidence.js';
import { familiesForSkill } from '../src/school/homework.js';
import { doorHomework, makeCodeFrom } from '../src/school/homeworkDoor.js';
import { learnerHomework } from '../src/school/homeworkLearner.js';
import { memoryStore } from '../src/school/homeworkStore.js';
import { runTutorTurn } from '../src/voice-tutor/tutorTurn.js';
import { settingsFrom } from '../src/voice-tutor/session.js';
import { seal } from '../src/voice-tutor/seal.js';
import { randomBytes } from 'node:crypto';

const EQ = 'MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS';

// ---------------------------------------------------------------- practice
test('practice rows carry source, and cskill and difficulty only when the item has them', () => {
  assert.deepEqual(practiceEvidence({}), { source: 'practice' });
  assert.deepEqual(practiceEvidence({ cskill: EQ, difficulty: 'hard' }), { source: 'practice', cskill: EQ, difficulty: 'hard' });
  assert.deepEqual(practiceEvidence({ cskill: '', difficulty: 'impossible' }), { source: 'practice' }, 'nothing invented, nothing the table would refuse');
  assert.ok(SOURCES.includes('practice') && DIFFICULTIES.length === 3);
});

test('telemetry spreads it into the row, and its fallback to base columns still drops the new ones', () => {
  const src = readFileSync(new URL('../src/ai-tutor/telemetry.js', import.meta.url), 'utf8');
  assert.match(src, /\.\.\.practiceEvidence\(ev\)/);
  assert.match(src, /const BASE_COLUMNS = \[[^\]]*'student_id'[^\]]*\]/);
  assert.ok(!/BASE_COLUMNS = \[[^\]]*'(source|cskill|difficulty)'/.test(src), 'new columns stay out of the base list so an old database still gets the row');
});

// ---------------------------------------------------------------- homework
const door = { id: 'd1', code: 'WSL', secret: 'test-secret-0123456789abcdef0123456789abcdef', active: true };
const REF = '6f1c2b8e-1d2a-4c1e-9a2b-3c4d5e6f7a8b';
async function setUp() {
  const store = memoryStore([door]);
  const deps = { store, now: () => Date.parse('2026-11-11T10:00:00Z'), makeCode: makeCodeFrom(randomBytes), linkFor: (c) => `https://x/hw/?c=${c}` };
  const ids = familiesForSkill(EQ).map(f => f.id);
  const r = await doorHomework(door, { action: 'homework_set', title: 'Equivalent fractions', cskills: [EQ], count: 3, mode: 'online',
    approved: ids.map(id => ({ family_id: id, by: 'T', at: '2026-11-11T09:00:00Z' })), homework: [{ homework_ref: REF, learner_refs: ['AAAAAAAA'] }] }, deps);
  assert.equal(r.status, 200);
  return { store, deps, code: r.body.homework[REF].learners.AAAAAAAA.code, items: r.body.homework[REF].learners.AAAAAAAA.items };
}
const rightOf = (it) => it.kind === 'choice' ? it.options.find(o => o.right).key : it.answer;
const wrongOf = (it) => it.kind === 'choice' ? it.options.find(o => !o.right).key : 'zzz';

test('a homework answer is one row for the school learner, independent, with its misconception, once only', async () => {
  const { store, deps, code, items } = await setUp();
  await learnerHomework({ action: 'start', code }, deps);
  assert.equal(store.evidence.length, 0);
  const a1 = await learnerHomework({ action: 'answer', code, n: 1, response: wrongOf(items[0]) }, deps);
  const a2 = await learnerHomework({ action: 'answer', code, n: 2, response: rightOf(items[1]) }, deps);
  assert.equal(a1.body.mark.correct, false); assert.equal(a2.body.mark.correct, true);
  assert.equal(store.evidence.length, 2);
  const [w, r] = store.evidence;
  const hwId = store.homework[0].id;
  assert.equal(w.source, 'school_homework'); assert.equal(w.door_id, 'd1'); assert.equal(w.learner_ref, 'AAAAAAAA');
  assert.equal(w.student_id, undefined, 'a school learner has no HOREB student');
  assert.equal(w.item_ref, `hw:${hwId}:1`); assert.equal(r.item_ref, `hw:${hwId}:2`);
  assert.equal(w.cskill, EQ); assert.equal(w.skill_id, EQ);
  assert.deepEqual([w.correct, w.marks, w.max_marks, w.independent], [false, 0, 1, true]);
  assert.deepEqual([r.correct, r.marks, r.max_marks, r.independent, r.misconception], [true, 1, 1, true, null]);
  assert.ok(w.client_ts && !Number.isNaN(Date.parse(w.client_ts)));
  // The same answer written again (a retry) is the row already there.
  await store.saveEvidence(w);
  assert.equal(store.evidence.length, 2);
  // The row the writer builds, from the same sitting, is the row the migration's backfill builds: same item_ref shape.
  const sitting = store.sittings[0];
  assert.equal(homeworkEvidence({ homework: store.homework[0], sitting, answer: sitting.answers[0] }).item_ref, w.item_ref);
});

test('a homework answer is never failed by the evidence insert, and an item with no skill makes no row', async () => {
  const { store, deps, code, items } = await setUp();
  store.saveEvidence = async () => { throw new Error('database down'); };
  await learnerHomework({ action: 'start', code }, deps);
  const a = await learnerHomework({ action: 'answer', code, n: 1, response: rightOf(items[0]) }, deps);
  assert.equal(a.status, 200); assert.equal(a.body.mark.correct, true);
  assert.equal(store.sittings[0].answers.length, 1, 'the sitting kept the answer');
  assert.equal(homeworkEvidence({ homework: { id: 'h', door_id: 'd' }, sitting: { learner_ref: 'AAAAAAAA', items: [{ n: 1 }] }, answer: { n: 1, correct: true } }), null);
});

// ---------------------------------------------------------------- live tutor
const SECRET = 'test-secret-that-is-long-enough';
const USER = { id: 'u-parent', email: 'tester@example.com' };
const SID = '0b7e4d3c-1111-4222-8333-944455556666';
const settings = settingsFrom((k) => ({ VOICE_TUTOR_ENABLED: '1', VOICE_TUTOR_ALLOWLIST: 'tester@example.com' }[k]));
const NOW = 1_800_000_000_000;
const world = (failEvidence = false) => {
  const evidence = [];
  return { evidence, async getChild(id) { return id === 'c1' ? { id: 'c1', parent_id: 'u-parent', name: 'X', grade: 'Grade 5' } : null; },
    async getProgress() { return { skills: {} }; }, async spend() { return { session: 0, day: 0 }; }, async recordUsage() {}, async recordConcern() {},
    async recordEvidence(r) { if (failEvidence) throw new Error('database down'); evidence.push(r); } };
};
const item = { kind: 'typed', cskill: EQ, question: '1/2 = ?/6', answer: '3', accepts: ['3'], wrong: [{ value: '4', mis: `${EQ}.M_EQUIV_ADDITIVE` }] };
const tutor = async (db, response, child = 'c1') => runTutorTurn({ user: USER, settings, lib: {}, secret: SECRET, db, callModel: null, now: NOW,
  body: { session_id: SID, child_id: child, message: response, turn_index: 3, board: [], history: [],
    answer: { seal: await seal({ session: SID, child: child ? `u-parent_c${child}` : 'u-parent', ask: 'q1', skill: EQ, item }, SECRET, NOW), response } } });

test('a tutor answer is one row for the account and child, not independent, keyed by session and question', async () => {
  const db = world();
  const r = await tutor(db, '4');
  assert.equal(r.status, 200);
  assert.equal(db.evidence.length, 1);
  assert.deepEqual(db.evidence[0], {
    source: 'tutor', student_id: 'u-parent', learner_id: 'c1', session_id: SID, subject: 'math', skill_id: EQ, cskill: EQ,
    correct: false, misconception: `${EQ}.M_EQUIV_ADDITIVE`, independent: false, marks: 0, max_marks: 1, item_ref: `tutor:${SID}:q1`,
    submitted_value: '4', client_ts: new Date(NOW).toISOString(), hints_used: 0, attempt_no: 1,
  });
  const ok = world(); await tutor(ok, '3');
  assert.deepEqual([ok.evidence[0].correct, ok.evidence[0].marks, ok.evidence[0].misconception], [true, 1, null]);
});

test('the tutor turn carries on when the evidence cannot be written, and a turn with no answer writes nothing', async () => {
  const r = await tutor(world(true), '3');
  assert.equal(r.status, 200); assert.equal(r.body.marked.correct, true);
  const db = world();
  await runTutorTurn({ user: USER, settings, lib: {}, secret: SECRET, db, callModel: null, now: NOW, body: { session_id: SID, message: 'hello', turn_index: 1, board: [], history: [] } });
  assert.equal(db.evidence.length, 0);
  assert.equal(tutorEvidence({ userId: 'u', sid: SID, marked: { ask: 'q1', skill: null }, now: NOW }), null);
  assert.equal(tutorEvidence({ userId: 'u', sid: 'not-a-uuid-but-valid-1', marked: { ask: 'q1', skill: EQ, correct: true }, now: NOW }).session_id, undefined, 'session_id is a uuid column');
});

// ---------------------------------------------------------------- the migration
test('the migration extends response_events as the design says, runs twice, and the SQL editor cannot split it wrongly', () => {
  const sql = readFileSync(new URL('../supabase/migrations/20261111_learner_evidence.sql', import.meta.url), 'utf8');
  for (const c of ['source', 'door_id', 'learner_ref', 'cskill', 'outcome_code', 'substrand_code', 'framework', 'difficulty', 'marks', 'max_marks', 'independent', 'misconception', 'item_ref'])
    assert.match(sql, new RegExp(`add column if not exists ${c} `), c);
  assert.match(sql, /source in \('practice', 'school_homework', 'school_exam', 'tutor', 'visual'\)/);
  assert.match(sql, /default 'practice'/); assert.match(sql, /framework text not null default 'cbc'/);
  assert.match(sql, /alter column student_id drop not null/);
  assert.match(sql, /check \(student_id is not null or \(door_id is not null and learner_ref is not null\)\)/);
  assert.match(sql, /create unique index if not exists \w+\s+on public\.response_events \(source, item_ref, coalesce\(student_id::text, door_id::text \|\| ':' \|\| learner_ref\)\)\s+where item_ref is not null/);
  assert.match(sql, /'hw:' \|\| s\.homework_id::text/); assert.match(sql, /on conflict do nothing;\s*$/);
  assert.ok(!/create table/i.test(sql), 'no CREATE TABLE');
  assert.ok(!/policy/i.test(sql.replace(/^--.*$/gm, '')), 'the row-level security is left as it is');
  const code = sql.replace(/^--.*$/gm, '');
  for (const line of code.split('\n')) if (line.includes(';')) assert.ok(line.trimEnd().endsWith(';') && line.indexOf(';') === line.trimEnd().length - 1, `semicolon only at the end of a line: ${line}`);
  for (const line of sql.split('\n')) if (line.startsWith('--')) assert.ok(!line.includes(';'), `no semicolon in a comment: ${line}`);
  // Every add and constraint can run twice.
  assert.equal((sql.match(/add constraint/g) || []).length, (sql.match(/drop constraint if exists/g) || []).length - 0);
});
