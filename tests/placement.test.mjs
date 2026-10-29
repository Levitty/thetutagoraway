// ============================================================================
// LESSONS MUST MATCH THE LEARNER'S LEVEL
//
// Regression test for the bug found in live testing: a fresh Grade 8 account
// was served "Pre-number Activities (Sorting, Patterns) — What comes next:
// 4, 5, 6, 7, __?". Cause: on a new account the only skills with satisfied
// prerequisites were the Grade 1 graph roots, so the recommended path had to
// start there and climb.
//
// The mirror bug matters just as much: Grade 5 division has no prerequisites
// in the graph, so a raw dependent-count ranking floated it to the top of a
// Grade 1 learner's list.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getNextToLearn, getEstimatedGradeLevel } from '../src/ai-tutor/adaptiveEngine.js';
import { SKILLS, getPostRequisites, getPrerequisiteChain, getPostRequisiteChain } from '../src/ai-tutor/knowledgeGraph.js';
import { selectQuestion, computePlacement, buildPlacementPool, roomForAnother, nextToSettle, questionCap, STRETCH_PROBE } from '../src/ai-tutor/placement.js';
import { propagateCredit, processDiagnosticResults } from '../src/ai-tutor/diagnosticEngine.js';

const TOP = 8;   // the recommended path only ever shows a handful
const top = (progress) => getNextToLearn(progress, null).slice(0, TOP);

test('a fresh Grade 8 learner is never sent to lower-primary counting', () => {
  const picks = top({ skills: {}, declaredGrade: 8, placementGrade: null });
  assert.ok(picks.length > 0, 'expected some suggestions');
  const tooLow = picks.filter(s => s.grade <= 5);
  assert.deepEqual(
    tooLow.map(s => `${s.id} (G${s.grade})`), [],
    'Grade 8 learner offered lower-primary skills',
  );
});

test('a fresh Grade 1 learner is not sent to upper-primary roots', () => {
  const picks = top({ skills: {}, declaredGrade: 1, placementGrade: null });
  assert.ok(picks.length > 0, 'expected some suggestions');
  const tooHigh = picks.filter(s => s.grade > 3);
  assert.deepEqual(
    tooHigh.map(s => `${s.id} (G${s.grade})`), [],
    'Grade 1 learner offered skills more than two grades ahead',
  );
});

test('the diagnostic overrides the declared grade in BOTH directions', () => {
  // Declared Grade 8 but measured at Grade 3: foundations must come BACK.
  // The "assume they know it" shortcut must never override real evidence.
  const picks = top({ skills: {}, declaredGrade: 8, placementGrade: 3 });
  assert.ok(
    picks.some(s => s.grade <= 4),
    'a learner placed at Grade 3 should still be offered foundation work',
  );
  assert.ok(
    !picks.some(s => s.grade >= 8),
    'a learner placed at Grade 3 should not be offered Grade 8 work',
  );
});

test('demonstrated struggle cancels the assumption of mastery', () => {
  // A Grade 8 learner who has actually failed a Grade 2 skill should see it
  // again — "assumed known" is a shortcut for the untested, not a blindfold.
  const struggled = {
    skills: { G2_PLACE_VALUE: { attempts: 6, correct: 1, mastered: false } },
    declaredGrade: 8,
    placementGrade: null,
  };
  const ids = getNextToLearn(struggled, null).map(s => s.id);
  assert.ok(
    ids.includes('G2_PLACE_VALUE'),
    'a skill the learner has demonstrably failed must remain learnable',
  );
});

test('a learner with no declared grade still gets a sane list', () => {
  const picks = top({ skills: {} });
  assert.ok(picks.length > 0, 'expected suggestions even with no grade information');
});

// Reported by a real Grade 9 student: "she took the diagnostic as a Grade 9,
// the page says Grade 6, and the work is too easy."
//
// The diagnostic measured her correctly. The DISPLAYED level was computed from
// coverage instead — what fraction of each grade she has personally worked
// through — and a short test can never mark 60% of Grade 1 as mastered, so it
// reported the bottom of the graph. That number then drove lesson selection.
test('a measured placement anchors both the displayed level and the lessons', () => {
  // Exactly the state a student is in one second after finishing the
  // diagnostic: placement measured, almost nothing marked mastered yet.
  const justDiagnosed = { skills: {}, diagnosed: true, declaredGrade: 9, placementGrade: 9 };

  const shown = getEstimatedGradeLevel(justDiagnosed, null);
  assert.ok(
    shown >= 8,
    `a student the diagnostic placed at Grade 9 was shown as Grade ${shown}`,
  );

  const grades = top(justDiagnosed).map(s => s.grade);
  assert.ok(grades.length > 0, 'expected lessons to be suggested');
  assert.ok(
    !grades.some(g => g <= 5),
    `Grade 9 placement served lower-primary lessons: [${grades.join(', ')}]`,
  );
});

test('a low placement is still respected — the floor works downwards too', () => {
  // The floor must not become a way to inflate every learner: a student
  // measured at Grade 3 stays at Grade 3.
  const placedLow = { skills: {}, diagnosed: true, declaredGrade: 9, placementGrade: 3 };
  const shown = getEstimatedGradeLevel(placedLow, null);
  assert.ok(shown <= 4, `a student placed at Grade 3 was shown as Grade ${shown}`);
});

// ---------------------------------------------------------------------------
// THE RESULT MUST NOT CLAIM MORE THAN IT CHECKED
//
// Reported from live testing, of a real sample learner's result page:
// "this report is a lie it says i only miss this tally chart step it doesn't
// know because it hasn't checked".
//
// It was right. The placement sweep asks ONE skill per strand at a grade —
// five questions against the 101 skills of Grades 1-5, about 5% of them, and
// one of 47 in Numbers. On that evidence the page announced "<name> is solid
// up to Grade 5. One step is missing.", because a single passed skill at or
// above the placement grade was enough to license the phrase. A parent reads
// that as a verdict on the whole year.
//
// The check is still worth taking — it finds a starting point, which is what
// it is for. What it may not do is report that starting point as a finding
// about everything it never asked.
// ---------------------------------------------------------------------------
import { readFileSync } from 'node:fs';

const checkSrc = readFileSync(new URL('../src/site/Check.jsx', import.meta.url), 'utf8');

test('the result page does not certify a grade it never covered', () => {
  // Comments are stripped first: this file's own history explains the phrase,
  // and a test that cannot tell code from commentary fails on the explanation.
  const code = checkSrc.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  assert.ok(!/solid up to/i.test(code),
    'the headline claims a grade is "solid" — the sweep samples one skill per strand and cannot support that');
});

test('the result page states how much it actually asked, counted from the questions', () => {
  // The scope sentence is what keeps the claim honest, so it is load-bearing.
  const code = checkSrc.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  assert.ok(/diagStats/.test(code), 'the page must read the counts the check saved');
  assert.ok(/not a full report/i.test(code),
    'the page must say plainly that the check is a starting point rather than a full report');
  // An earlier version counted the skills the diagnostic FLAGGED. Credit
  // propagation flags about five per question asked, so "Based on 26
  // questions" appeared after five.
  assert.ok(!/fromDiagnostic/.test(code), 'the question count must not come from flagged skills');
});

test('the diagnostic flags far more skills than it asks — which is why the count comes from the record', () => {
  // The fact the test above depends on, measured rather than asserted in a comment.
  const ctx = { skills: SKILLS, getPostReqs: getPostRequisites, getPreChain: id => getPrerequisiteChain(id), getPostChain: id => getPostRequisiteChain(id) };
  let b = {};
  const asked = ['G5_ADDITION', 'G5_FRACTIONS_INTRO', 'G5_LENGTH', 'G5_ANGLES_INTRO', 'G5_TALLY'];
  for (const id of asked) b = propagateCredit(b, id, true, 1, ctx);
  const flagged = Object.values(processDiagnosticResults(b, ctx)).filter(v => v.fromDiagnostic).length;
  assert.ok(flagged > asked.length * 2, `5 questions flagged only ${flagged} skills; if that changed, revisit the result page`);
});

// ---------------------------------------------------------------------------
// ONE QUESTION ON EVERY TOPIC OF THE LEARNER'S GRADE
//
// The sweep that preceded this asked one question per STRAND: five questions
// against 101 skills. Simulated with children whose gaps can sit anywhere, only
// 38% of Grade 4-5 children with a gap were asked anything in the gap's own
// sub-strand. One question per sub-strand raised that to about 91%.
// ---------------------------------------------------------------------------
const CBC_POOL = buildPlacementPool(SKILLS, 'cbc');
const sitCheck = (declared, knows) => {
  const asked = [];
  for (;;) {
    const q = selectQuestion(asked, declared, CBC_POOL);
    if (!q || !roomForAnother(asked.length, asked, declared, CBC_POOL)) break;
    // The final ask on the headline miss: this child answers it the same way.
    if (q.settle) { asked.find(a => a.id === q.id).settled = true; continue; }
    asked.push({ id: q.id, grade: q.grade, strand: q.strand, unit: q.unit, probeFor: q.probeFor, hunt: q.hunt, correct: knows(q) });
  }
  return asked;
};

for (const grade of [4, 5]) {
  test(`a Grade ${grade} check asks about every topic in the Grade ${grade} syllabus`, () => {
    const designTopics = new Set(Object.values(SKILLS)
      .filter(s => s.curricula?.cbc?.grade === grade).map(s => s.curricula.cbc.substrand));
    const asked = sitCheck(grade, () => true);
    const swept = new Set(asked.filter(a => a.grade === grade && !a.probeFor).map(a => a.unit));
    const missing = [...designTopics].filter(t => !swept.has(t));
    assert.deepEqual(missing, [], `Grade ${grade} topics never asked: ${missing.join(', ')}`);
    assert.equal(swept.size, designTopics.size, 'exactly one sweep question per topic');
  });
}

test('a child who knows their grade is not kept long', () => {
  // The sweep, plus at most a short stretch above it.
  const asked = sitCheck(5, q => SKILLS[q.id].grade <= 5);
  assert.ok(asked.length <= 19 + STRETCH_PROBE, `asked ${asked.length}`);
  assert.equal(computePlacement(asked, 5, CBC_POOL), 5);
});

test('every miss is followed down before the check ends', () => {
  // A Grade 5 child working at Grade 4 misses the sweep, and each thread should
  // find Grade 4 holding where the budget allows.
  const asked = sitCheck(5, q => SKILLS[q.id].grade <= 4);
  const followUps = asked.filter(a => a.probeFor);
  assert.ok(followUps.length >= 5, `only ${followUps.length} follow-ups`);
  assert.ok(followUps.every(a => a.grade < 5), 'a follow-up is always below the miss it chases');
  assert.equal(computePlacement(asked, 5, CBC_POOL), 4);
});

test('the check never asks a topic the design leaves out of the grade', () => {
  // Triangles are enrichment at Grade 5. Untagged, they were swept as Grade 5
  // coursework, because untagged means "in scope at the native grade".
  const asked = sitCheck(5, () => true);
  assert.ok(!asked.some(a => a.id === 'G5_TRIANGLES_INTRO'), 'Grade 5 was asked about triangles');
});

test('one missing step low down is one gap, not a grade behind', () => {
  // A Grade 5 child who never secured Grade 3 multiplication misses every Grade
  // 5 topic built on it, and each follow-up bottoms out on the same skill.
  // Counted topic by topic that read as "a grade behind"; it is one gap, and
  // practice starts on it either way.
  const blocked = new Set(['G3_MULTIPLY', ...getPostRequisiteChain('G3_MULTIPLY')]);
  const asked = sitCheck(5, q => SKILLS[q.id].grade <= 5 && !blocked.has(q.id));
  assert.ok(asked.some(a => a.id === 'G3_MULTIPLY' && !a.correct), 'the follow-ups should reach the gap itself');
  assert.equal(computePlacement(asked, 5, CBC_POOL), 5);
});

test('a child two grades behind is not excused as a single gap', () => {
  const asked = sitCheck(5, q => SKILLS[q.id].grade <= 3);
  assert.ok(computePlacement(asked, 5, CBC_POOL) <= 4);
});

test('the missing step is asked a final time before it is named', () => {
  // A slip on a skill the child knows, made twice: the third ask withdraws it.
  const blocked = new Set(['G3_MULTIPLY', ...getPostRequisiteChain('G3_MULTIPLY')]);
  const asked = sitCheck(5, q => SKILLS[q.id].grade <= 5 && !blocked.has(q.id));
  const head = asked.find(a => a.id === 'G3_MULTIPLY');
  assert.ok(head?.settled, 'the gap about to be named was not asked a final time');
  const slip = [{ id: 'G4_MULTIPLY', grade: 4, strand: 'Numbers', unit: 'Multiplication', probeFor: 'Multiplication', correct: false }];
  const pool = buildPlacementPool(SKILLS, 'cbc');
  const q = nextToSettle(slip, pool);
  assert.equal(q?.id, 'G4_MULTIPLY');
  assert.equal(nextToSettle([{ ...slip[0], settled: true }], pool), null, 'asked once more, then the verdict stands');
  assert.equal(nextToSettle([{ ...slip[0], skipped: true }], pool), null, '"I haven\'t learned this yet" is not re-asked');
});

test('a child a grade ahead is not held back by one missed strand above it', () => {
  // All-right was the old bar for the grade above, and one gap anywhere in it
  // blocked a third of children who really are a grade ahead.
  const all = sitCheck(5, q => SKILLS[q.id].grade <= 6);
  const missed = all.find(a => a.grade === 6).id;
  const asked = sitCheck(5, q => SKILLS[q.id].grade <= 6 && q.id !== missed);
  assert.equal(asked.filter(a => a.grade === 6 && !a.correct).length, 1);
  assert.equal(computePlacement(asked, 5, CBC_POOL), 6);
  // Two misses above is not a grade ahead.
  const two = new Set(all.filter(a => a.grade === 6).slice(0, 2).map(a => a.id));
  const asked2 = sitCheck(5, q => SKILLS[q.id].grade <= 6 && !two.has(q.id));
  assert.equal(computePlacement(asked2, 5, CBC_POOL), 5);
});

test('a deep gap is asked directly instead of being chased one grade at a time', () => {
  // Grade 2 counting under everything: the follow-ups alone ran out of depth
  // before reaching it, and each failure looked like a separate gap.
  const blocked = new Set(['G2_COUNTING', ...getPostRequisiteChain('G2_COUNTING')]);
  const asked = sitCheck(5, q => SKILLS[q.id].grade <= 5 && !blocked.has(q.id));
  assert.ok(asked.some(a => a.hunt), 'no shared missing step was asked');
});

test('the check places a child at most one grade above the one they declared', () => {
  // A climb that let each cleared stretch earn the next put a Grade 6 child
  // who knows everything at Grade 12, on surds and logarithms. One grade up is
  // the ceiling; daily practice moves an able child on from there.
  const asked = sitCheck(5, (q) => SKILLS[q.id].grade <= 9);
  assert.equal(computePlacement(asked, 5, CBC_POOL), 6);
  assert.ok(asked.every(a => a.grade <= 6), 'a question was asked above Grade 6');
});

test('a child missing most of their grade gets a longer check, and no one else does', () => {
  // Forty questions ran out before the check could show the grade below holds.
  const behind = sitCheck(5, q => SKILLS[q.id].grade <= 3);
  assert.ok(behind.length > 40 && behind.length <= 50, `asked ${behind.length}`);
  const onGrade = sitCheck(5, q => SKILLS[q.id].grade <= 5);
  assert.equal(questionCap(onGrade, 5, CBC_POOL), 40);
});
