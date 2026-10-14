// ============================================================================
// THE SYLLABUS IS A CONTRACT
//
// A Grade 9 CBC learner is accountable for exactly what the KICD Grade 9
// Mathematics Curriculum Design lists — nineteen sub-strands, no more and no
// fewer. Before these tests, four of them had no skill behind them at all and
// nothing in the codebase noticed: the app showed a tidy Grade 9 view that was
// quietly missing a twelve-lesson sub-strand.
//
// What is locked here: every sub-strand the KICD designs name has at least one
// skill behind it, large sub-strands are not covered by a single token skill,
// nothing claims a grade tag the design does not list, and a tagged skill
// actually lands in the band it claims.
//
// The curriculum-SELECTION tests that accompanied these on the content branch
// are not ported: they describe a school-system picker this branch does not
// have, and that is a product decision rather than a syllabus fact.
//
// Sources: docs/curriculum-sources/KICD-Grade{7,8,9}-Mathematics-Curriculum-Design.pdf
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { gradeOf } from '../src/ai-tutor/curricula.js';

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

// The Grade 7 design: eighteen sub-strands, 150 lessons.
const KICD_GRADE7 = [
  ['Whole Numbers', 20], ['Factors', 7], ['Fractions', 9], ['Decimals', 6],
  ['Squares and Square Roots', 5],
  ['Algebraic Expressions', 5], ['Linear Equations', 6], ['Linear Inequalities', 8],
  ['Pythagorean Relationship', 4], ['Length', 6], ['Area', 8], ['Volume and Capacity', 8],
  ['Time, Distance and Speed', 8], ['Temperature', 6], ['Money', 12],
  ['Angles', 8], ['Geometrical Constructions', 12], ['Data Handling', 10],
];

// The Grade 8 design: sixteen sub-strands.
const KICD_GRADE8 = [
  ['Integers', 6], ['Fractions', 6], ['Decimals', 8], ['Squares and Square roots', 6],
  ['Rates, Ratio, Proportions and Percentages', 14],
  ['Algebraic Expressions', 6], ['Linear Equations', 7],
  ['Circles', 5], ['Area', 10], ['Money', 9],
  ['Geometrical Constructions', 12], ['Coordinates and Graphs', 14], ['Scale Drawing', 14],
  ['Common Solids', 16],
  ['Data Presentation and Interpretation', 10], ['Probability', 7],
];

// ---------------------------------------------------------------------------
// UPPER PRIMARY. Grades 1-6 had no contract test at all, so nothing proved the
// Grade 4 and 5 work matched the designs the way Junior School does. Both
// designs are in docs/curriculum-sources/ and were read for these tables.
//
// Reading them turned up two things no test could have caught before: Grade 4
// had no skill behind 2.4 Capacity (a six-lesson sub-strand, and the only gap
// in a chain that has capacity at Grades 1, 2, 3, 5 and 6), and G6_BODMAS_BASIC
// claimed a Grade 5 sub-strand called "Combined Operations", which the design
// does not have — combined operations is outcome (d) inside 1.5 Division.
// ---------------------------------------------------------------------------

// KICD Grade 4: four strands, nineteen sub-strands, 150 lessons. Lesson counts
// are verbatim; Whole Numbers prints none in the sub-strand table, and 20 is
// what the other eighteen leave out of the design's 150-lesson total.
// The design numbers Money "3.7" under STRAND 2.0 — a typo in the document for
// 2.7, since the strand is Measurement and the count fits its total.
const KICD_GRADE4 = [
  ['Whole Numbers', 20], ['Addition', 8], ['Subtraction', 8], ['Multiplication', 8],
  ['Division', 8], ['Fractions', 6], ['Decimals', 10], ['Use of Letters', 6],
  ['Length', 10], ['Area', 8], ['Volume', 6], ['Capacity', 6], ['Mass', 6],
  ['Time', 10], ['Money', 8],
  ['Position and Direction', 4], ['Angles', 4], ['Plane Figures', 6],
  ['Data', 8],
];

// KICD Grade 5: four strands, nineteen sub-strands, 150 lessons, verbatim from
// the design's own "SUMMARY OF STRANDS AND SUB STRANDS" table (p.xii).
const KICD_GRADE5 = [
  ['Whole Numbers', 20], ['Addition', 6], ['Subtraction', 6], ['Multiplication', 6],
  ['Division', 6], ['Fractions', 8], ['Decimals', 6], ['Simple Equations', 6],
  ['Length', 12], ['Area', 6], ['Volume', 6], ['Capacity', 12], ['Mass', 12],
  ['Time', 8], ['Money', 8],
  ['Lines', 4], ['Angles', 6], ['Three Dimension (3-D) Objects', 6],
  ['Data Representation', 6],
];

const DESIGNS = { 4: KICD_GRADE4, 5: KICD_GRADE5, 7: KICD_GRADE7, 8: KICD_GRADE8, 9: KICD_GRADE9 };

const cbcGrade = (grade) => {
  const bySub = {};
  for (const [id, s] of Object.entries(SKILLS)) {
    const t = s.curricula?.cbc;
    if (t?.grade === grade) (bySub[t.substrand] ||= []).push(id);
  }
  return bySub;
};
const cbcGrade9 = () => cbcGrade(9);

for (const grade of [4, 5, 7, 8, 9]) {
  const design = DESIGNS[grade];

  test(`every KICD Grade ${grade} sub-strand has at least one skill behind it`, () => {
    const have = cbcGrade(grade);
    const missing = design.filter(([name]) => !have[name]).map(([name, l]) => `${name} (${l} lessons)`);
    assert.deepEqual(missing, [], `Grade ${grade} sub-strands with no content: ${missing.join(', ')}`);
  });

  test(`nothing is tagged CBC Grade ${grade} that the design does not list`, () => {
    const named = new Set(design.map(([n]) => n));
    const strays = Object.keys(cbcGrade(grade)).filter(sub => !named.has(sub));
    assert.deepEqual(strays, [], `a sub-strand tagged Grade ${grade} that KICD does not name`);
  });
}

// The thin-coverage rule is asserted for Junior School only. Upper primary has
// deliberately fewer, broader skills per sub-strand — Grade 5 Length, Capacity
// and Mass are twelve lessons each behind one skill apiece — so turning it on
// for Grades 4 and 5 would be asserting a content-expansion decision that is
// the owner's to make, not a fact about the syllabus. The list is recorded in
// docs/curriculum-backlog.md instead, where it can be worked through.
for (const grade of [7, 8, 9]) {
  const design = DESIGNS[grade];

  test(`Grade ${grade}'s biggest sub-strands are not left with a single token skill`, () => {
    // A twelve-lesson sub-strand covered by one skill is coverage on paper only.
    const have = cbcGrade(grade);
    const thin = design
      .filter(([name, lessons]) => lessons >= 12 && (have[name] || []).length < 2)
      .map(([name, lessons]) => `${name} (${lessons} lessons, ${(have[name] || []).length} skill)`);
    assert.deepEqual(thin, [], `sub-strands too thin for their lesson count: ${thin.join(', ')}`);
  });
}

test('congruence is not sold to a CBC learner as her syllabus', () => {
  // It appears in none of the Grade 7, 8 or 9 designs. It may be taught as
  // enrichment; it may not be counted as Grade 9 coursework.
  const t = SKILLS.G8_CONGRUENCE?.curricula?.cbc;
  assert.ok(t, 'the skill should still carry a CBC tag');
  assert.equal(t.grade, undefined, 'congruence must not claim a CBC grade');
  assert.equal(t.inScope, false, 'it belongs to CBC learners as enrichment');
});




test('every CBC-tagged skill actually lands in the band it claims', () => {
  // gradeOf falls back to the native grade when a tag carries no band, which is
  // how twelve skills once inflated the Grade 9 count to 42.
  for (const [id, s] of Object.entries(SKILLS)) {
    const g = s.curricula?.cbc?.grade;
    if (g == null) continue;
    assert.equal(gradeOf(s, 'cbc'), g, `${id} is tagged Grade ${g} but reads as ${gradeOf(s, 'cbc')}`);
  }
});

test('standard form is taught where the design puts it', () => {
  // KICD lists standard form under Grade 8 Decimals (1.3f). The Grade 9
  // Indices and Logarithms outcomes never mention it, but that is where it
  // had been tagged.
  const t = SKILLS.G8_STANDARD_FORM?.curricula?.cbc;
  assert.equal(t?.grade, 8);
  assert.equal(t?.substrand, 'Decimals');
});

test('Junior School as a whole is covered, not just its final year', () => {
  // The count that matters to a parent: how much of Grades 7-9 has content.
  const covered = [7, 8, 9].reduce((n, g) => {
    const have = cbcGrade(g);
    return n + DESIGNS[g].filter(([name]) => have[name]).length;
  }, 0);
  const total = 7 <= 9 ? DESIGNS[7].length + DESIGNS[8].length + DESIGNS[9].length : 0;
  assert.equal(covered, total, `${total - covered} of ${total} Junior School sub-strands have no content`);
});
