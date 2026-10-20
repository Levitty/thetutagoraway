// ============================================================================
// ASSIGNMENTS — "master these by Friday", and who has.
//
// Done means MASTERED, read from the progress HOREB already keeps. There is no
// submissions table and no write path from the student, so the rules worth
// pinning are the ones a teacher and a child will act on:
//
//   a child who is behind never has the work quietly removed from their screen
//   "Start" always means the next thing they have not mastered
//   the teacher sees names, not counts
//   nothing here reads the clock itself, so no two parts of a screen can
//     disagree about what day it is
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  assignmentProgress, assignmentRoster, dueLabel, openForLearner, isoDay,
} from '../src/ai-tutor/assignments.js';

const MASTERED = { attempts: 5, correct: 5, mastered: true };
const TRIED = { attempts: 2, correct: 1 };

const work = (title, ids, due) => ({ id: title, title, skill_ids: ids, due_on: due });
const who = (name, skills) => ({ id: name, name, progress: { skills } });

// ---- one learner, one assignment -------------------------------------------

test('done means mastered, counted off the progress that already exists', () => {
  const st = assignmentProgress(work('W', ['A', 'B', 'C']), { skills: { A: MASTERED, B: TRIED } });
  assert.equal(st.total, 3);
  assert.equal(st.done, 1);
  assert.equal(st.percent, 33);
  assert.equal(st.complete, false);
  assert.equal(st.started, true, 'B was attempted, so this is not untouched');
});

test('"Start" hands over the next thing not yet mastered', () => {
  const st = assignmentProgress(work('W', ['A', 'B', 'C']), { skills: { A: MASTERED } });
  assert.equal(st.nextId, 'B');
});

test('a finished assignment has nothing left to start', () => {
  const st = assignmentProgress(work('W', ['A']), { skills: { A: MASTERED } });
  assert.equal(st.complete, true);
  assert.equal(st.nextId, null);
  assert.equal(st.percent, 100);
});

test('a learner who has never opened it reads as not started, not as behind', () => {
  const st = assignmentProgress(work('W', ['A', 'B']), { skills: {} });
  assert.equal(st.started, false);
  assert.equal(st.done, 0);
});

test('an assignment with no skills on it cannot be complete', () => {
  // A teacher mid-way through building one. Reporting 100% done would be a lie
  // in the direction that stops anybody looking at it again.
  const st = assignmentProgress(work('W', []), { skills: {} });
  assert.equal(st.complete, false);
  assert.equal(st.percent, 0);
});

test('a missing progress row is a learner who has not started, not a crash', () => {
  assert.equal(assignmentProgress(work('W', ['A']), null).done, 0);
  assert.equal(assignmentProgress(null, { skills: {} }).total, 0);
});

// ---- the due date, in words ------------------------------------------------

test('a due date reads as an instruction, not as a date', () => {
  const today = '2026-10-20';
  assert.equal(dueLabel('2026-10-20', today).text, 'Due today');
  assert.equal(dueLabel('2026-10-21', today).text, 'Due tomorrow');
  assert.equal(dueLabel('2026-10-23', today).text, 'Due in 3 days');
  assert.equal(dueLabel('2026-10-19', today).text, 'Due yesterday');
  assert.equal(dueLabel('2026-10-17', today).text, '3 days overdue');
  assert.equal(dueLabel(null, today).overdue, false);
});

test('overdue is overdue and today is not', () => {
  const today = '2026-10-20';
  assert.equal(dueLabel('2026-10-19', today).overdue, true);
  assert.equal(dueLabel('2026-10-20', today).overdue, false, 'a child still has all of today');
});

// ---- what a learner still sees ---------------------------------------------

test('unfinished work stays on screen however late it is', () => {
  // The rule that matters most. A child who is behind is exactly the child
  // whose work must not quietly disappear.
  const today = '2026-10-20';
  const open = openForLearner([work('Late', ['A'], '2026-10-01')], { skills: {} }, today);
  assert.equal(open.length, 1);
  assert.equal(open[0].due.overdue, true);
});

test('finished and past, it goes away; finished but still due, it stays', () => {
  const today = '2026-10-20';
  const done = { skills: { A: MASTERED } };
  assert.equal(openForLearner([work('Old', ['A'], '2026-10-01')], done, today).length, 0);
  assert.equal(openForLearner([work('Soon', ['A'], '2026-10-25')], done, today).length, 1,
    'a child who finished early should still see that they did');
});

test('the overdue one leads, then the soonest', () => {
  const today = '2026-10-20';
  const open = openForLearner([
    work('Next week', ['A'], '2026-10-27'),
    work('Overdue', ['B'], '2026-10-12'),
    work('Tomorrow', ['C'], '2026-10-21'),
  ], { skills: {} }, today);
  assert.deepEqual(open.map(a => a.title), ['Overdue', 'Tomorrow', 'Next week']);
});

test('no assignments at all is an empty list, not an error', () => {
  assert.deepEqual(openForLearner(null, null), []);
  assert.deepEqual(openForLearner([], { skills: {} }), []);
});

// ---- the teacher's view ----------------------------------------------------

test('the teacher gets names in three groups, not one number', () => {
  const a = work('Place value', ['A', 'B']);
  const roster = assignmentRoster(a, [
    who('Amani', { A: MASTERED, B: MASTERED }),
    who('Baraka', { A: MASTERED }),
    who('Chipo', {}),
    who('Dalila', { A: TRIED }),
  ]);
  assert.deepEqual(roster.done.map(l => l.name), ['Amani']);
  assert.deepEqual(roster.started.map(l => l.name), ['Baraka', 'Dalila']);
  assert.deepEqual(roster.notStarted.map(l => l.name), ['Chipo']);
  assert.equal(roster.percent, 25);
  assert.equal(roster.count, 4);
});

test('every learner lands in exactly one group', () => {
  // Otherwise the three lists add up to more than the class, and a teacher
  // counting heads finds the screen lying to them.
  const a = work('W', ['A', 'B', 'C']);
  const learners = [
    who('Amani', { A: MASTERED, B: MASTERED, C: MASTERED }),
    who('Baraka', { A: MASTERED }),
    who('Chipo', {}),
    who('Dalila', { A: TRIED, B: TRIED }),
    who('Esha', { C: MASTERED }),
  ];
  const r = assignmentRoster(a, learners);
  const all = [...r.done, ...r.started, ...r.notStarted].map(l => l.name);
  assert.equal(all.length, learners.length);
  assert.equal(new Set(all).size, learners.length);
});

test('an empty class is 0%, not a division by zero', () => {
  const r = assignmentRoster(work('W', ['A']), []);
  assert.equal(r.percent, 0);
  assert.equal(r.count, 0);
  assert.deepEqual(r.done, []);
});

// ---- the clock -------------------------------------------------------------

test('today is a local day, so the date is the one the person is living in', () => {
  // UTC slicing turns the evening in Nairobi into tomorrow, which would mark a
  // child late while they are still sitting doing the work.
  const d = new Date(2026, 9, 20, 23, 30); // 20 Oct, 23:30 local
  assert.equal(isoDay(d), '2026-10-20');
});
