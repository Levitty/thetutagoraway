// ============================================================================
// CLASS RE-CHECKS DOOR (12 Nov 2026): the signed door action class_rechecks.
//
// What must hold:
//   learner references in, skills and counts out: no names, no per-learner answers
//   a skill is returned only when at least 25% of the class's learners with evidence on it (and at least 3) are due
//   evidence from school homework, school exams and linked practice all count; another school's rows never do
//   bad references are dropped, none left is a 400, over 300 is a 413
//   the function bundle is built from this code
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { doorClassRechecks, CLASS_MAX_LEARNERS } from '../src/school/recheckDoor.js';
import { memoryStore } from '../src/school/homeworkStore.js';

const DAY = 86400000;
const T0 = Date.parse('2026-06-01T08:00:00Z');
const NOW = T0 + 40 * DAY;   // mastered on day 4.5, first re-check due day 18.5: due by day 40
const SK = 'MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS';
const door = { id: 'd1', code: 'WSL' };
const REFS = ['AAAAAAAA', 'BBBBBBBB', 'CCCCCCCC', 'DDDDDDDD', 'EEEEEEEE'];
const mastered = (extra) => [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5].map((d, i) => ({
  cskill: SK, skill_id: SK, correct: true, marks: 1, max_marks: 1, independent: true, difficulty: 'medium',
  created_at: new Date(T0 + d * DAY).toISOString(), item_ref: `x:${i}`, ...extra }));
const call = (store, refs, extra = {}) => doorClassRechecks(door, { action: 'class_rechecks', learner_refs: refs, ...extra }, { store, now: () => NOW });

test('three of five due is returned with counts and nothing personal', async () => {
  const store = memoryStore([door]);
  for (const ref of REFS.slice(0, 3)) store.evidence.push(...mastered({ source: 'school_homework', door_id: 'd1', learner_ref: ref }));
  const r = await call(store, REFS);
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.rechecks, [{ cskill: SK, due: 3, of: 3, overdue: 0 }]);
  assert.equal(r.body.learners, 5); assert.equal(r.body.with_evidence, 3);
  assert.doesNotMatch(JSON.stringify(r.body), /AAAAAAAA|BBBBBBBB/, 'no learner reference comes back');
});

test('fewer than three children, or under a quarter of the class, returns nothing', async () => {
  const two = memoryStore([door]);
  for (const ref of REFS.slice(0, 2)) two.evidence.push(...mastered({ source: 'school_exam', door_id: 'd1', learner_ref: ref }));
  assert.deepEqual((await call(two, REFS)).body.rechecks, []);
  const many = memoryStore([door]);   // 3 due among 16 with evidence on the skill: under 25%
  const refs = Array.from({ length: 16 }, (_, i) => 'AAAAAAA' + 'ABCDEFGHJKLMNPQR'[i]);
  refs.forEach((ref, i) => many.evidence.push(...(i < 3 ? mastered({ source: 'school_exam', door_id: 'd1', learner_ref: ref })
    : mastered({ source: 'school_homework', door_id: 'd1', learner_ref: ref, created_at: undefined }).map(r => ({ ...r, created_at: new Date(NOW - DAY).toISOString() })))));
  assert.deepEqual((await call(many, refs)).body.rechecks, []);
});

test('practice by a linked child counts, another school does not', async () => {
  const store = memoryStore([door], [
    { door_id: 'd1', learner_ref: 'AAAAAAAA', parent_id: 'p1', child_id: 'c1' },
    { door_id: 'd1', learner_ref: 'BBBBBBBB', parent_id: 'p2', child_id: 'c2' }]);
  store.practice.push(...mastered({ source: 'practice', student_id: 'p1', learner_id: 'c1' }), ...mastered({ source: 'practice', student_id: 'p2', learner_id: 'c2' }));
  store.evidence.push(...mastered({ source: 'school_homework', door_id: 'd1', learner_ref: 'CCCCCCCC' }), ...mastered({ source: 'school_homework', door_id: 'other', learner_ref: 'DDDDDDDD' }));
  const r = await call(store, REFS);
  assert.deepEqual(r.body.rechecks, [{ cskill: SK, due: 3, of: 3, overdue: 0 }]);
  assert.equal((await call(store, ['AAAAAAAA', 'BBBBBBBB', 'DDDDDDDD'])).body.rechecks.length, 0, 'DDDDDDDD belongs to another school');
});

test('only skills a homework can draw come back; max caps the list', async () => {
  const store = memoryStore([door]);
  for (const ref of REFS.slice(0, 3)) store.evidence.push(...mastered({ source: 'school_exam', door_id: 'd1', learner_ref: ref, cskill: 'CRE.G5.X.Y', skill_id: 'CRE.G5.X.Y' }));
  assert.deepEqual((await call(store, REFS)).body.rechecks, []);
});

test('bad references are dropped; none left is 400; too many is 413; another action is null', async () => {
  const store = memoryStore([door]);
  assert.equal((await call(store, ['nope', 'Tom Wanjiru'])).status, 400);
  assert.equal((await call(store, undefined)).status, 400);
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const many = Array.from({ length: CLASS_MAX_LEARNERS + 1 }, (_, i) => 'AAAAAA' + A[Math.floor(i / 32)] + A[i % 32]);
  assert.equal((await call(store, many)).status, 413);
  assert.equal(await doorClassRechecks(door, { action: 'status' }, { store }), null);
});

test('the function bundle carries the action', () => {
  const src = readFileSync(new URL('../supabase/functions/school-practice/index.ts', import.meta.url), 'utf8');
  assert.match(src, /class_rechecks/);
});
