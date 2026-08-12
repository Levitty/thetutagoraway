// ============================================================================
// THE SYLLABUS IS A CONTRACT
//
// A Grade 9 CBC learner is accountable for exactly what the KICD Grade 9
// Mathematics Curriculum Design lists — nineteen sub-strands, no more and no
// fewer. Before these tests, four of them had no skill behind them at all and
// nothing in the codebase noticed: the app showed a tidy Grade 9 view that was
// quietly missing a twelve-lesson sub-strand.
//
// Two things are locked here. First, that every sub-strand KICD names has at
// least one skill. Second, that a student's own choice of school system — not
// a guess made from her grade — is what decides the syllabus she is shown.
//
// Source: docs/curriculum-sources/KICD-Grade9-Mathematics-Curriculum-Design.pdf
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { resolveView, systemOf, SYSTEMS, NATIVE, gradeOf } from '../src/ai-tutor/curricula.js';

// The nineteen sub-strands of the KICD Grade 9 design, verbatim from the
// strand tables, with the lesson counts the design allocates to each.
const KICD_GRADE9 = [
  ['Integers', 5], ['Cubes and Cube Roots', 6], ['Indices and Logarithms', 6],
  ['Compound Proportions and Rates of Work', 12],
  ['Matrices', 8], ['Equations of a Straight Line', 15], ['Linear Inequalities', 6],
  ['Area', 8], ['Volume of Solids', 8], ['Mass, Volume, Weight and Density', 8],
  ['Time, Distance, and Speed', 10], ['Money', 7], ['Approximations and Errors', 5],
  ['Coordinates and Graphs', 6], ['Scale Drawing', 14], ['Similarity and Enlargement', 10],
  ['Trigonometry', 8], ['Data Interpretation (Grouped Data)', 8], ['Probability', 6],
];

const cbcGrade9 = () => {
  const bySub = {};
  for (const [id, s] of Object.entries(SKILLS)) {
    const t = s.curricula?.cbc;
    if (t?.grade === 9) (bySub[t.substrand] ||= []).push(id);
  }
  return bySub;
};

test('every KICD Grade 9 sub-strand has at least one skill behind it', () => {
  const have = cbcGrade9();
  const missing = KICD_GRADE9.filter(([name]) => !have[name]).map(([name, l]) => `${name} (${l} lessons)`);
  assert.deepEqual(missing, [], `Grade 9 sub-strands with no content: ${missing.join(', ')}`);
});

test('the biggest sub-strands are not left with a single token skill', () => {
  // A twelve-lesson sub-strand covered by one skill is coverage on paper only.
  const have = cbcGrade9();
  const thin = KICD_GRADE9
    .filter(([name, lessons]) => lessons >= 12 && (have[name] || []).length < 2)
    .map(([name, lessons]) => `${name} (${lessons} lessons, ${(have[name] || []).length} skill)`);
  assert.deepEqual(thin, [], `sub-strands too thin for their lesson count: ${thin.join(', ')}`);
});

test('nothing is tagged CBC Grade 9 that the design does not list', () => {
  const named = new Set(KICD_GRADE9.map(([n]) => n));
  const strays = Object.keys(cbcGrade9()).filter(sub => !named.has(sub));
  assert.deepEqual(strays, [], 'a sub-strand tagged Grade 9 that KICD does not name');
});

test('congruence is not sold to a CBC learner as her syllabus', () => {
  // It appears in none of the Grade 7, 8 or 9 designs. It may be taught as
  // enrichment; it may not be counted as Grade 9 coursework.
  const t = SKILLS.G8_CONGRUENCE?.curricula?.cbc;
  assert.ok(t, 'the skill should still carry a CBC tag');
  assert.equal(t.grade, undefined, 'congruence must not claim a CBC grade');
  assert.equal(t.inScope, false, 'it belongs to CBC learners as enrichment');
});

// ------------------------------------------------------- the student's choice
test("the student's school system decides her syllabus, not her grade", () => {
  assert.equal(resolveView('cambridge', 9), 'cambridge');
  assert.equal(resolveView('cambridge', 4), 'cambridge', 'a Cambridge learner stays Cambridge at any stage');
  assert.equal(resolveView('kenya', 9), 'cbc', 'Junior School is where KICD publishes a design');
  assert.equal(resolveView('kenya', 7), 'cbc');
  assert.equal(resolveView('kenya', 4), NATIVE, 'outside Junior School the full Kenyan path applies');
});

test('a grade alone never picks a curriculum', () => {
  // The bug this replaces: Grade 7-9 was silently forced to CBC, so a Cambridge
  // learner in Stage 9 was shown a KICD syllabus she had never chosen.
  assert.equal(resolveView(null, 9), NATIVE, 'no choice made means no guess made');
  assert.equal(resolveView(undefined, 8), NATIVE);
});

test('the chosen system survives a manual view switch', () => {
  for (const sy of SYSTEMS) assert.ok(sy.id && sy.label, 'every system needs an id and a label');
  assert.equal(systemOf('cbc'), 'kenya');
  assert.equal(systemOf(NATIVE), 'kenya');
  assert.equal(systemOf('cambridge'), 'cambridge');
});

test('every Grade 9 CBC skill actually lands in the Grade 9 view', () => {
  // gradeOf falls back to the native grade when a tag carries no band, which is
  // how twelve skills once inflated the Grade 9 count to 42.
  for (const [id, s] of Object.entries(SKILLS)) {
    if (s.curricula?.cbc?.grade !== 9) continue;
    assert.equal(gradeOf(s, 'cbc'), 9, `${id} is tagged Grade 9 but reads as ${gradeOf(s, 'cbc')}`);
  }
});
