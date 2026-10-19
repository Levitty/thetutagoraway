// ============================================================================
// THE CLASS, NOT THE CHILD
//
// The teacher dashboard could already tell you everything about one student.
// Thirty-four times in a row, that is not information a person can act on
// before the bell. classGaps() reads the same measurements down the other
// axis: which skill is holding up the most children, and which children.
//
// Two things put a skill on that list and they must not be confused, because
// they ask for different lessons:
//   blocked — the child is failing something that NEEDS this skill and has
//             never mastered it. Go back and teach this.
//   failing — the child is struggling with this skill itself. Usually what
//             was just taught, and taught too fast.
//
// The count is the number the teacher reads first, so the one rule that
// cannot bend is that "nine children" means nine children.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classGaps, isStruggling } from '../src/ai-tutor/adaptiveEngine.js';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';

const FAILING = { attempts: 4, correct: 1 };
const SOLID = { attempts: 4, correct: 4, mastered: true };

const learner = (id, name, skills) => ({ id, name, progress: { skills } });
const failing = (...ids) => Object.fromEntries(ids.map(id => [id, FAILING]));
const rowFor = (rows, id) => rows.find(r => r.id === id);
const namesOn = (row) => [...row.blocked, ...row.failing].map(l => l.name).sort();

// ---- what counts as struggling ---------------------------------------------

test('a diagnostic failure counts, on its single attempt', () => {
  // The diagnostic seeds attempts:1. An attempts>=3 rule alone ignores it, and
  // a freshly-placed child's gaps then reach nobody — not the learner, not the
  // teacher — until they have failed the same thing three more times.
  assert.equal(isStruggling({ attempts: 1, correct: 0, fromDiagnostic: true, passed: false }), true);
  assert.equal(isStruggling({ attempts: 1, correct: 0 }), false, 'one bad answer is not a verdict');
  assert.equal(isStruggling({ attempts: 4, correct: 1 }), true);
  assert.equal(isStruggling({ attempts: 4, correct: 4 }), false);
  assert.equal(isStruggling(undefined), false, 'never asked is not failing');
});

// ---- the count a teacher reads first ---------------------------------------

test('the skill holding up the most children is first', () => {
  const rows = classGaps([
    learner('a', 'Amani', failing('G4_ADD')),
    learner('b', 'Baraka', failing('G4_ADD')),
    learner('c', 'Chipo', failing('G4_ADD')),
    learner('d', 'Dalila', failing('G6_SQUARES')),
  ]);
  assert.ok(rows.length > 0, 'a class of four struggling children produced no gaps');
  assert.ok(rows[0].count >= 3, `first row only covers ${rows[0].count} children`);
});

test('a child is counted once per skill, however many ways they reach it', () => {
  // The whole number is the point. A child who is both failing a skill AND
  // blocked on it must not make the class look twice its size.
  const rows = classGaps([learner('a', 'Amani', failing('G4_ADD', 'G5_ADDITION', 'G5_MULTIPLICATION'))]);
  for (const r of rows) {
    const ids = [...r.blocked, ...r.failing].map(l => l.id);
    assert.equal(new Set(ids).size, ids.length, `${r.name} counts a child twice`);
    assert.equal(r.count, ids.length);
    assert.ok(r.count <= 1, `${r.name} reports ${r.count} children from a class of one`);
  }
});

test('the foundation a child never had wins over the symptom above it', () => {
  // When both apply to the same child and skill, "blocked" is the useful
  // reading: the missing foundation is the lesson; the failure above it is
  // what the missing foundation causes.
  const rows = classGaps([learner('a', 'Amani', failing('G4_ADD', 'G5_ADDITION'))]);
  for (const r of rows) {
    const both = r.blocked.filter(b => r.failing.some(f => f.id === b.id));
    assert.deepEqual(both, [], `${r.name} lists the same child as blocked and failing`);
  }
});

test('the names come back, so the teacher knows who to call over', () => {
  const rows = classGaps([
    learner('a', 'Amani', failing('G4_ADD')),
    learner('b', 'Baraka', failing('G4_ADD')),
  ]);
  const top = rows[0];
  assert.deepEqual(namesOn(top), ['Amani', 'Baraka']);
});

test('one shared foundation is found behind three different failures', () => {
  // The finding the per-student view cannot produce however long a teacher
  // stares at it: three children failing three DIFFERENT skills, for one
  // reason. Place value sits under number words, rounding, odd and even and
  // five more, so three children stuck in three places is one lesson.
  const rows = classGaps([
    learner('a', 'Amani', failing('G4_NUMBER_WORDS')),
    learner('b', 'Baraka', failing('G4_ORDER_ROUND')),
    learner('c', 'Chipo', failing('G4_ODD_EVEN')),
  ]);
  const pv = rowFor(rows, 'G4_PLACE_VALUE');
  assert.ok(pv, 'the shared foundation never surfaced');
  assert.deepEqual(namesOn(pv), ['Amani', 'Baraka', 'Chipo']);
  assert.equal(pv.blocked.length, 3, 'it is a foundation they lack, not a skill they are failing');
  assert.equal(rows[0].id, 'G4_PLACE_VALUE', 'the one lesson for three children should lead');
});

// ---- the quiet cases -------------------------------------------------------

test('a class where nobody is struggling has no gaps', () => {
  const solid = Object.fromEntries(Object.keys(SKILLS).slice(0, 40).map(id => [id, SOLID]));
  assert.deepEqual(classGaps([learner('a', 'Amani', solid)]), []);
});

test('an empty class, and a child who has not started, are not errors', () => {
  // A teacher opens this the day they create a class, before anybody joins.
  assert.deepEqual(classGaps([]), []);
  assert.deepEqual(classGaps(null), []);
  assert.deepEqual(classGaps([{ id: 'a', name: 'Amani', progress: null }]), []);
  assert.deepEqual(classGaps([{ id: 'a', name: 'Amani', progress: { skills: {} } }]), []);
});

test('every row names a real skill a teacher could go and teach', () => {
  const rows = classGaps([learner('a', 'Amani', failing('G4_ADD', 'G5_MULTIPLICATION'))]);
  for (const r of rows) {
    assert.ok(SKILLS[r.id], `${r.id} is not a skill`);
    assert.ok(r.name && r.strand, `${r.id} reached the teacher without a name or strand`);
  }
});
