// ============================================================================
// HOMEWORK FOR CHOSEN LEARNERS, AND WHERE THEY STRUGGLED (28 Oct)
//
// Two promises to a teacher:
//   work set for four children is counted against those four, and nobody
//     else sees it on their screen
//   afterwards the page says where each of them went wrong, from the answers
//     they actually gave, and what to do about it
// And one to a parent: a child's answers are only read inside the teacher's
// own class, which the migration enforces and these tests read back.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  isFor, assignedLearners, audienceLabel, assignmentRoster, openForLearner,
} from '../src/ai-tutor/assignments.js';
import {
  answerPattern, assignmentStruggles, learnerSkill, STUCK_MIN_ATTEMPTS,
} from '../src/ai-tutor/struggles.js';
import { fiveMinuteMove } from '../src/ai-tutor/teacherMoves.js';
import { demoStudents, demoAssignments, demoEvents } from '../src/ai-tutor/demoClass.js';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';

const MASTERED = { attempts: 5, correct: 5, mastered: true };
const who = (id, skills = {}) => ({ id, name: id, progress: { skills } });
const CLASS = [who('Amani'), who('Baraka'), who('Chipo'), who('Dalila')];

// ---- who the work is for ---------------------------------------------------

test('no list means the whole class, which is every assignment made before', () => {
  const a = { skill_ids: ['A'] };
  assert.equal(isFor(a, 'Amani'), true);
  assert.equal(isFor({ ...a, student_ids: null }, 'Dalila'), true);
  assert.equal(assignedLearners(a, CLASS).length, 4);
});

test('a list means only those learners', () => {
  const a = { skill_ids: ['A'], student_ids: ['Amani', 'Chipo'] };
  assert.equal(isFor(a, 'Amani'), true);
  assert.equal(isFor(a, 'Baraka'), false);
  assert.equal(isFor(a, undefined), false, 'nobody anonymous is on a named list');
  assert.deepEqual(assignedLearners(a, CLASS).map(l => l.id), ['Amani', 'Chipo']);
});

test('the roster counts the chosen learners only', () => {
  // Baraka was never set this. If he counted as "not started", the bar would
  // read 1 of 4 and the teacher would chase a child who has nothing to do.
  const a = { skill_ids: ['A'], student_ids: ['Amani', 'Chipo'] };
  const learners = [who('Amani', { A: MASTERED }), who('Baraka'), who('Chipo'), who('Dalila')];
  const r = assignmentRoster(a, learners);
  assert.equal(r.count, 2);
  assert.equal(r.percent, 50);
  assert.deepEqual(r.notStarted.map(l => l.name), ['Chipo']);
});

test('a learner sees only the work set for them', () => {
  const today = '2026-10-28';
  const work = [
    { id: 1, title: 'Whole class', skill_ids: ['A'], due_on: '2026-10-30', student_ids: null },
    { id: 2, title: 'For Amani', skill_ids: ['B'], due_on: '2026-10-30', student_ids: ['Amani'] },
    { id: 3, title: 'For Chipo', skill_ids: ['C'], due_on: '2026-10-30', student_ids: ['Chipo'] },
  ];
  assert.deepEqual(openForLearner(work, { skills: {} }, today, 'Amani').map(a => a.title).sort(), ['For Amani', 'Whole class']);
  assert.deepEqual(openForLearner(work, { skills: {} }, today, 'Baraka').map(a => a.title), ['Whole class']);
  // Called the old way, nothing is filtered: RLS has already done it.
  assert.equal(openForLearner(work, { skills: {} }, today).length, 3);
});

test('who it is for reads as names while they fit, a count when not', () => {
  assert.equal(audienceLabel({ student_ids: null }, CLASS).text, 'Whole class');
  assert.equal(audienceLabel({ student_ids: ['Amani', 'Chipo'] }, CLASS).text, 'For Amani, Chipo');
  assert.equal(audienceLabel({ student_ids: ['Amani', 'Baraka', 'Chipo', 'Dalila'] }, CLASS).text, 'For 4 learners');
  assert.equal(audienceLabel({ student_ids: ['Amani', 'gone'] }, CLASS).text, 'For 2 learners',
    'a learner who has left the class is still counted, not silently dropped');
});

// ---- reading a wrong answer -------------------------------------------------

test('a wrong answer is named only when the numbers say so plainly', () => {
  assert.equal(answerPattern('342', '3402'), 'dropped-zero');
  assert.equal(answerPattern('3000', '300'), 'power-of-ten');
  assert.equal(answerPattern('-7', '7'), 'sign');
  assert.equal(answerPattern('4302', '3402'), 'digits-swapped');
  assert.equal(answerPattern('12311', '12411'), 'carry-slip');
  assert.equal(answerPattern('41', '42'), 'off-by-one');
  assert.equal(answerPattern('4/3', '3/4'), 'flipped');
  assert.equal(answerPattern('1,200', '1200'), null, 'the same number with a comma is not wrong');
  assert.equal(answerPattern('57', '3402'), null, 'no guessing: a teacher acts on this');
  assert.equal(answerPattern('', '3402'), null);
  assert.equal(answerPattern('3402', '3402'), null);
});

// ---- one assignment, read from the answers ----------------------------------

const ev = (student_id, skill_id, correct, submitted, expected, t = '2026-10-27T10:00:00Z', extra = {}) =>
  ({ student_id, skill_id, correct, submitted_value: submitted, expected_value: expected, created_at: t, hints_used: 0, ...extra });

const ASSIGNMENT = { skill_ids: ['G4_PLACE_VALUE', 'G4_ADD'], student_ids: ['Amani', 'Baraka', 'Chipo'], created_at: '2026-10-26T08:00:00Z' };
const SK = { G4_PLACE_VALUE: { name: 'Place value', strand: 'Numbers', grade: 4 }, G4_ADD: { name: 'Addition', strand: 'Numbers', grade: 4 } };
const LEARNERS = [
  who('Amani'), who('Baraka', { G4_ADD: MASTERED }), who('Chipo'), who('Dalila'),
];
const EVENTS = [
  // Amani: stuck on place value, the same dropped zero three times.
  ev('Amani', 'G4_PLACE_VALUE', false, '342', '3402'),
  ev('Amani', 'G4_PLACE_VALUE', false, '342', '3402'),
  ev('Amani', 'G4_PLACE_VALUE', true, '3402', '3402'),
  ev('Amani', 'G4_PLACE_VALUE', false, '506', '5006'),
  ev('Amani', 'G4_PLACE_VALUE', false, '342', '3402'),
  // Chipo: tried place value twice, nearly there; makes the same 342 once.
  ev('Chipo', 'G4_PLACE_VALUE', false, '342', '3402'),
  ev('Chipo', 'G4_PLACE_VALUE', true, '7080', '7080'),
  // Baraka: addition, all right.
  ev('Baraka', 'G4_ADD', true, '90', '90'),
  // Before the work was set: not this homework.
  ev('Chipo', 'G4_PLACE_VALUE', false, '1', '3402', '2026-10-01T10:00:00Z'),
  // Dalila was not set this work. Her answers must not appear.
  ev('Dalila', 'G4_PLACE_VALUE', false, '342', '3402'),
  // A parent's roster child answering under Amani's account: not Amani.
  ev('Amani', 'G4_PLACE_VALUE', false, '9', '3402', '2026-10-27T10:00:00Z', { learner_id: 'child-1' }),
  // Another skill entirely.
  ev('Amani', 'G5_FRACTIONS', false, '1', '2'),
];

test('per learner and per skill: attempts, accuracy, mastered, and what they wrote', () => {
  const r = assignmentStruggles(ASSIGNMENT, LEARNERS, EVENTS, { skills: SK });
  assert.equal(r.source, 'answers');
  assert.equal(r.counts.assigned, 3, 'Dalila was not set this work');
  const amani = r.learners.find(l => l.id === 'Amani');
  const pv = amani.cells.find(c => c.skillId === 'G4_PLACE_VALUE');
  assert.equal(pv.attempts, 5, 'the old answer, the roster child and the other skill are not counted');
  assert.equal(pv.accuracy, 20);
  assert.equal(pv.mastered, false);
  assert.equal(pv.state, 'stuck');
  assert.deepEqual(pv.wrong[0], { submitted: '342', expected: '3402', n: 3 });
  assert.equal(pv.pattern.id, 'dropped-zero');
  assert.deepEqual(pv.trail, [false, false, true, false, false]);
  const chipo = r.learners.find(l => l.id === 'Chipo').cells.find(c => c.skillId === 'G4_PLACE_VALUE');
  assert.equal(chipo.attempts, 2);
  assert.equal(chipo.state, 'working', 'two tries is not stuck, however they went');
  assert.ok(!r.learners.some(l => l.id === 'Dalila'));
});

test('the skill most missed, and the wrong answer the group shares', () => {
  const r = assignmentStruggles(ASSIGNMENT, LEARNERS, EVENTS, { skills: SK });
  assert.equal(r.mostMissed.id, 'G4_PLACE_VALUE');
  assert.equal(r.mostMissed.wrongCount, 5);
  assert.equal(r.mostMissed.name, 'Place value');
  assert.deepEqual(r.mostMissed.commonWrong.learners.sort(), ['Amani', 'Chipo']);
  assert.equal(r.mostMissed.commonWrong.submitted, '342');
});

test('the learners stuck, each with a plain next step', () => {
  const r = assignmentStruggles(ASSIGNMENT, LEARNERS, EVENTS, { skills: SK });
  assert.deepEqual(r.stuck.map(s => s.name), ['Amani']);
  const s = r.stuck[0];
  assert.equal(s.skillName, 'Place value');
  assert.ok(s.attempts >= STUCK_MIN_ATTEMPTS);
  assert.equal(s.move, fiveMinuteMove({ id: 'G4_PLACE_VALUE', strand: 'Numbers' }),
    'the same five-minute move the gap rows give');
  assert.ok(/zero/i.test(s.step), 'the next step speaks to the mistake they actually made');
});

test('the order a teacher walks the room in: stuck, working, not started, done', () => {
  const r = assignmentStruggles(ASSIGNMENT, LEARNERS, EVENTS, { skills: SK });
  assert.deepEqual(r.learners.map(l => l.status), ['stuck', 'working', 'working']);
  const r2 = assignmentStruggles({ ...ASSIGNMENT, student_ids: null }, [...LEARNERS, who('Esha')], EVENTS, { skills: SK });
  assert.equal(r2.counts.assigned, 5, 'whole-class work is for everyone in it');
  assert.equal(r2.learners.at(-1).name, 'Esha', 'Esha, who has touched nothing, comes last');
});

test('a child who keeps saying "not learned yet" is told apart from one who is wrong', () => {
  const c = learnerSkill([
    { correct: false, skipped: true }, { correct: false, skipped: true }, { correct: false, skipped: true },
  ], {}, null, 'X');
  assert.equal(c.attempts, 0, 'a skip is not an attempt');
  assert.equal(c.skipped, 3);
  assert.equal(c.pattern.id, 'skipping');
});

test('a pattern HOREB already noticed is used when the answers are not enough', () => {
  const c = learnerSkill([], {}, { 'place-value': { n: 4, skills: ['X'] } }, 'X');
  assert.equal(c.pattern.id, 'place-value');
});

test('with no answers logged, the counts come from progress and say so', () => {
  const learners = [who('Amani', { G4_PLACE_VALUE: { attempts: 6, correct: 1 } }), who('Baraka')];
  const r = assignmentStruggles({ skill_ids: ['G4_PLACE_VALUE'] }, learners, [], { skills: SK });
  assert.equal(r.source, 'progress');
  assert.equal(r.stuck[0].name, 'Amani');
  assert.equal(r.stuck[0].accuracy, 17);
  assert.deepEqual(r.stuck[0].wrong, []);
});

test('nothing at all is an empty reading, not a crash', () => {
  const r = assignmentStruggles(null, null, null);
  assert.equal(r.counts.assigned, 0);
  assert.equal(r.mostMissed, null);
  assert.deepEqual(r.stuck, []);
});

// ---- the demo still tells it ---------------------------------------------------

test('the demo shows work for chosen learners, and where they went wrong', () => {
  const learners = demoStudents().map(s => ({ id: s.userId, name: s.name, progress: s.progress }));
  const [pv, add] = demoAssignments();
  assert.equal(pv.student_ids, null, 'place value stays whole-class, so the roster demo still reads');
  assert.equal(add.student_ids.length, 3);
  const r = assignmentStruggles(pv, learners, demoEvents(), { skills: SKILLS });
  assert.deepEqual(r.stuck.map(s => s.name).sort(), ['Amani Otieno', 'Chipo Wanjiru']);
  const r2 = assignmentStruggles(add, learners, demoEvents(), { skills: SKILLS });
  assert.equal(r2.counts.assigned, 3);
  assert.deepEqual(r2.stuck.map(s => s.name).sort(), ['Dalila Mwangi', 'Esha Njoroge']);
  assert.ok(r2.mostMissed.commonWrong, 'two children making one mistake is the line worth showing');
});

// ---- the migration -------------------------------------------------------------

const SQL = readFileSync(new URL('../supabase/migrations/20261028_assignment_learners.sql', import.meta.url), 'utf8');

test('the migration can be run twice', () => {
  assert.match(SQL, /add column if not exists student_ids uuid\[\]/i);
  assert.match(SQL, /drop constraint if exists assignments_student_ids_size/i);
  assert.match(SQL, /create index if not exists/i);
  assert.match(SQL, /create or replace function public\.learners_in_class/i);
  const creates = SQL.match(/create policy "([^"]+)"/gi) || [];
  for (const c of creates) {
    const name = c.match(/"([^"]+)"/)[1];
    assert.ok(SQL.includes(`drop policy if exists "${name}"`), `${name} is created without being dropped first`);
  }
});

test('a teacher can only name learners in a class they own', () => {
  assert.match(SQL, /with check \(\s*public\.is_class_teacher\(class_id\)\s*and public\.learners_in_class\(class_id, student_ids\)/i);
});

test('a learner reads whole-class work or work that names them, nothing else', () => {
  assert.match(SQL, /public\.is_class_member\(class_id\)\s*and \(student_ids is null or auth\.uid\(\) = any \(student_ids\)\)/i);
});
