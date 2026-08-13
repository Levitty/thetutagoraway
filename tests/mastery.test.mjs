// ============================================================================
// WHAT MASTERY IS WORTH, AND WHEN A SITTING ENDS
//
// From live testing: a Grade 9 learner was shown one example, answered two
// questions, and the app told her the skill was mastered. Then, returning to a
// skill she had already finished, the counter read 1/1 while questions kept
// arriving — practice with no visible end.
//
// Both came from the same place: the app had one notion of "how many", it was
// set to 1 for any skill below the learner's grade, and nothing stopped a
// session that had already met it.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';

// The policy the lesson applies, mirrored here so the numbers are pinned.
const TEST_OUT_PROBLEMS = 3;

// Mirrors finalizeResult's mastery decision.
const wouldMaster = ({ learnerGrade, skill, attempts, correct, lightSupport = true, scaffoldable = true }) => {
  const accuracy = correct / attempts;
  const testOutNow = Number.isFinite(skill.grade) && (learnerGrade - skill.grade) >= 2
    && attempts >= TEST_OUT_PROBLEMS && correct === attempts;
  const light = !scaffoldable || lightSupport;
  return accuracy >= skill.masteryThreshold
    && (testOutNow || (light && attempts >= skill.minProblems));
};

const skillOf = (id) => SKILLS[id];

test('one correct answer is not mastery, however easy the skill', () => {
  // The reported bug, exactly: Grade 9 learner, a Grade 7 skill, one question.
  const skill = skillOf('G7_EQUATIONS_FORM');
  assert.equal(
    wouldMaster({ learnerGrade: 9, skill, attempts: 1, correct: 1 }), false,
    'a single correct answer must never master a skill',
  );
  assert.equal(wouldMaster({ learnerGrade: 9, skill, attempts: 2, correct: 2 }), false);
});

test('a short unbroken run does clear a skill well below the learner', () => {
  const skill = skillOf('G7_EQUATIONS_FORM');
  assert.equal(wouldMaster({ learnerGrade: 9, skill, attempts: 3, correct: 3 }), true);
});

test('a wrong answer anywhere in the run ends the shortcut', () => {
  const skill = skillOf('G7_EQUATIONS_FORM');
  // Three right out of four is a high accuracy, but the run was broken — so
  // the learner falls back to the full requirement rather than testing out.
  assert.equal(wouldMaster({ learnerGrade: 9, skill, attempts: 4, correct: 3 }), false);
  assert.ok(skill.minProblems >= 5, 'the fallback should be a real amount of practice');
});

test('a skill at the learner’s own grade always needs full practice', () => {
  const skill = skillOf('G9_QUADRATIC_SOLVE');
  assert.equal(wouldMaster({ learnerGrade: 9, skill, attempts: 3, correct: 3 }), false,
    'no shortcut applies at the learner’s own level');
  assert.equal(
    wouldMaster({ learnerGrade: 9, skill, attempts: skill.minProblems, correct: skill.minProblems }), true,
  );
});

test('assisted answers do not count as proof', () => {
  const skill = skillOf('G9_QUADRATIC_SOLVE');
  assert.equal(
    wouldMaster({ learnerGrade: 9, skill, attempts: skill.minProblems, correct: skill.minProblems, lightSupport: false }),
    false, 'answers given with the solution part-written are practice, not evidence',
  );
});

// ------------------------------------------------- forming is its own skill
// Both "Forming" skills were wired to the SIMPLIFY and SOLVE builders, so a
// learner met identical questions in two differently-named skills and asked
// whether it was the same thing or endless repetition. It was the same thing.
const questionsFor = (id, n = 40) => {
  const out = [];
  for (let i = 0; i < n; i++) { const p = generateProblem(id); if (p?.question) out.push(p.question); }
  return out;
};

test('forming an equation is not the same task as solving one', () => {
  const forming = questionsFor('G7_EQUATIONS_FORM');
  const solving = questionsFor('G7_EQUATIONS_SOLVE');
  assert.ok(forming.length > 10 && solving.length > 10, 'both skills must generate');
  const overlap = forming.filter(q => solving.includes(q));
  assert.deepEqual(overlap, [], 'the two skills served identical questions');
  assert.ok(
    forming.every(q => /write an equation/i.test(q)),
    'every forming question should ask for an equation to be written',
  );
  assert.ok(
    !forming.some(q => /^solve for/i.test(q.trim())),
    'forming must never simply ask the learner to solve',
  );
});

test('forming an expression is not the same task as simplifying one', () => {
  const forming = questionsFor('G7_EXPRESSIONS');
  const simplifying = questionsFor('G7_SIMPLIFY');
  const overlap = forming.filter(q => simplifying.includes(q));
  assert.deepEqual(overlap, [], 'the two skills served identical questions');
  assert.ok(
    !forming.some(q => /^simplify/i.test(q.trim())),
    'forming must never simply ask the learner to simplify',
  );
});

test('a forming question is answered with algebra, not a number', () => {
  // The commonest way to get this wrong is to solve it anyway, so the answer
  // itself has to carry a letter.
  for (const id of ['G7_EQUATIONS_FORM', 'G7_EXPRESSIONS']) {
    for (let i = 0; i < 30; i++) {
      const p = generateProblem(id);
      if (!p) continue;
      assert.match(String(p.answer), /[a-z]/, `${id}: "${p.question}" expects a bare number`);
    }
  }
});
