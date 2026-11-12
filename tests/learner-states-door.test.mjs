// ============================================================================
// LEARNER STATES DOOR (12 Nov 2026): the signed door action learner_states.
//
// What must hold:
//   learner references in, states and counts out: no names, no answers, no evidence ids
//   the states are mastery.js's own: one rule set (a learner with 10 medium answers right is mastered after a re-check, etc.)
//   an overdue re-check reads "Mastered, due a re-check"
//   a learner with no evidence is absent; another school's rows never count
//   reasons only for a small ask (one child's page), not a whole class
//   bad references are dropped, none left is a 400, over 300 is a 413
//   the function bundle carries the action
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { doorLearnerStates, STATES_MAX_LEARNERS } from '../src/school/statesDoor.js';
import { memoryStore } from '../src/school/homeworkStore.js';

const DAY = 86400000;
const T0 = Date.parse('2026-06-01T08:00:00Z');
const SK = 'MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS';
const OUT = 'MATH.G5.NUMBER.FRACTIONS.OUT1';
const door = { id: 'd1', code: 'WSL' };
const rows = (days, extra) => days.map((d, i) => ({
  cskill: SK, skill_id: SK, outcome_code: OUT, correct: true, marks: 1, max_marks: 1, independent: true, difficulty: 'medium',
  created_at: new Date(T0 + d * DAY).toISOString(), item_ref: `x:${d}:${i}`, ...extra }));
const TEN = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5];
const call = (store, refs, now, extra = {}) => doorLearnerStates(door, { action: 'learner_states', learner_refs: refs, ...extra }, { store, now: () => now });

test('a class comes back as states per skill and outcome, no names and no evidence ids', async () => {
  const store = memoryStore([door]);
  store.evidence.push(...rows([0, 1], { source: 'school_homework', door_id: 'd1', learner_ref: 'AAAAAAAA' }));
  const refs = Array.from({ length: 6 }, (_, i) => 'AAAAAAA' + 'ABCDEF'[i]);
  const r = await call(store, refs, T0 + 5 * DAY);
  assert.equal(r.status, 200);
  assert.equal(r.body.learners, 6); assert.equal(r.body.with_evidence, 1);
  const s = r.body.states.AAAAAAAA;
  assert.equal(s.skills[0].state, 'not_enough'); assert.equal(s.skills[0].marks, 2);
  assert.equal(s.outcomes[0].code, OUT); assert.equal(s.outcomes[0].word, 'Not enough evidence');
  assert.equal(s.skills[0].reason, undefined, 'no reasons for a class');
  assert.doesNotMatch(JSON.stringify(r.body), /x:0|item_ref|evidenceIds/);
});

test('one child asked for gets the reason sentence', async () => {
  const store = memoryStore([door]);
  store.evidence.push(...rows([0, 1, 2, 3], { source: 'school_homework', door_id: 'd1', learner_ref: 'AAAAAAAA', correct: false, marks: 0 }));
  const r = await call(store, ['AAAAAAAA'], T0 + 5 * DAY);
  assert.equal(r.body.states.AAAAAAAA.skills[0].state, 'emerging');
  assert.match(r.body.states.AAAAAAAA.skills[0].reason, /right without help/);
});

test('mastered and held, then overdue, reads due a re-check; the outcome follows', async () => {
  const store = memoryStore([door]);
  const base = rows(TEN, { source: 'school_exam', door_id: 'd1', learner_ref: 'AAAAAAAA' });
  const recheck = rows([19, 19.1, 19.2, 19.3], { source: 'school_homework', door_id: 'd1', learner_ref: 'AAAAAAAA' });
  store.evidence.push(...base, ...recheck);
  const held = (await call(store, ['AAAAAAAA'], T0 + 20 * DAY)).body.states.AAAAAAAA;
  assert.equal(held.skills[0].state, 'mastered'); assert.equal(held.skills[0].word, 'Mastered'); assert.equal(held.skills[0].due, false);
  const late = (await call(store, ['AAAAAAAA'], T0 + 120 * DAY)).body.states.AAAAAAAA;
  assert.equal(late.skills[0].word, 'Mastered, due a re-check'); assert.equal(late.skills[0].due, true);
  assert.equal(late.outcomes[0].word, 'Mastered, due a re-check'); assert.equal(late.outcomes[0].due, true);
});

test("another school's evidence never counts", async () => {
  const store = memoryStore([door]);
  store.evidence.push(...rows(TEN, { source: 'school_exam', door_id: 'other', learner_ref: 'BBBBBBBB' }));
  const r = await call(store, ['BBBBBBBB'], T0 + 10 * DAY);
  assert.deepEqual(r.body.states, {}); assert.equal(r.body.with_evidence, 0);
});

test('bad references are dropped; none left is 400; too many is 413; another action is null', async () => {
  const store = memoryStore([door]);
  assert.equal((await call(store, ['nope', 'Tom Wanjiru'], T0)).status, 400);
  assert.equal((await call(store, undefined, T0)).status, 400);
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const many = Array.from({ length: STATES_MAX_LEARNERS + 1 }, (_, i) => 'AAAAAA' + A[Math.floor(i / 32)] + A[i % 32]);
  assert.equal((await call(store, many, T0)).status, 413);
  assert.equal(await doorLearnerStates(door, { action: 'status' }, { store }), null);
});

test('the function bundle carries the action', () => {
  const src = readFileSync(new URL('../supabase/functions/school-practice/index.ts', import.meta.url), 'utf8');
  assert.match(src, /learner_states/);
});
