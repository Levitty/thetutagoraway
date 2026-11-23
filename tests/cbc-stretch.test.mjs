// ============================================================================
// STRETCH IS MEASURED IN THE CHILD'S CURRICULUM, AND STAYS IN IT FIRST (F10)
//
// The one-grade stretch ceiling read the graph grade, so a CBC Grade 4 child
// placed at Grade 5 practised G6_DECIMALS_MUL (CBC Grade 7) for 48 questions,
// and strong learners spent most of their practice on skills CBC leaves out.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS, getPrerequisiteChain, getPostRequisiteChain, getPostRequisites } from '../src/ai-tutor/knowledgeGraph.js';
import { getNextToLearn, getRecommendedPath } from '../src/ai-tutor/adaptiveEngine.js';
import { findMissingStep } from '../src/site/missingStep.js';
import { gradeOf, outsideCurriculum } from '../src/ai-tutor/curricula.js';

const ctx = { skills: SKILLS, getPostReqs: getPostRequisites, getPreChain: (id) => getPrerequisiteChain(id), getPostChain: (id) => getPostRequisiteChain(id), curriculum: 'cbc' };
const mastered = { attempts: 8, correct: 8, mastered: true, passed: true };

test('nothing more than one CBC grade above what the child has shown', () => {
  for (let g = 4; g <= 9; g++) {
    const skills = Object.fromEntries(Object.values(SKILLS).filter(s => gradeOf(s, 'cbc') <= g).map(s => [s.id, mastered]));
    const next = getNextToLearn({ declaredGrade: g, placementGrade: g, diagnosed: true, skills }, ctx);
    const tooHigh = next.filter(s => gradeOf(s, 'cbc') > g + 1).map(s => `${s.id} (CBC ${gradeOf(s, 'cbc')})`);
    assert.deepEqual(tooHigh, [], `Grade ${g}`);
  }
});

test("the curriculum's own work comes before enrichment, at every grade", () => {
  for (let g = 1; g <= 9; g++) {
    const skills = Object.fromEntries(Object.values(SKILLS).filter(s => gradeOf(s, 'cbc') <= g && !outsideCurriculum(s, 'cbc')).map(s => [s.id, mastered]));
    const next = getNextToLearn({ declaredGrade: g, placementGrade: g, diagnosed: true, skills }, ctx);
    const firstOutside = next.findIndex(s => outsideCurriculum(s, 'cbc'));
    const lastInside = next.map(s => !outsideCurriculum(s, 'cbc')).lastIndexOf(true);
    if (firstOutside !== -1) assert.ok(firstOutside > lastInside, `Grade ${g}: ${next.slice(0, 8).map(s => s.id).join(', ')}`);
  }
});

test('the graph\'s own curriculum has no enrichment, so its order is untouched', () => {
  assert.equal(Object.values(SKILLS).some(s => outsideCurriculum(s, undefined) || outsideCurriculum(s, 'native')), false);
});

test('the highest mastered grade is read in the curriculum\'s grades', () => {
  // G6_DECIMALS_MUL is graph Grade 6 and CBC Grade 7. A CBC child who has
  // mastered only work up to CBC Grade 5 must not be offered it.
  const s = SKILLS.G6_DECIMALS_MUL;
  assert.equal(gradeOf(s, 'cbc'), 7);
  const skills = Object.fromEntries(Object.values(SKILLS).filter(k => gradeOf(k, 'cbc') <= 5).map(k => [k.id, mastered]));
  const next = getNextToLearn({ declaredGrade: 5, placementGrade: 5, diagnosed: true, skills }, ctx);
  assert.equal(next.some(k => k.id === 'G6_DECIMALS_MUL'), false);
});

test('after a clear check, the next step is CBC work before a missed probe outside CBC', () => {
  // A strong CBC Grade 8 child: everything up to Grade 8 passed, one Grade 10
  // probe (no CBC tag) missed.
  const pass = { attempts: 1, correct: 1, passed: true, fromDiagnostic: true };
  const skills = Object.fromEntries(Object.values(SKILLS).filter(s => gradeOf(s, 'cbc') <= 8).map(s => [s.id, pass]));
  skills.G10_VECTORS_INTRO = { attempts: 1, correct: 0, passed: false, fromDiagnostic: true };
  const progress = { declaredGrade: 8, placementGrade: 8, diagnosed: true, skills };
  const r = findMissingStep(progress, SKILLS, 'cbc');
  assert.equal(r.allClear, true);
  assert.equal(outsideCurriculum(SKILLS[r.missing], 'cbc'), false, r.missing);
  assert.equal(gradeOf(SKILLS[r.missing], 'cbc'), 9);
  const lead = getRecommendedPath(progress, ctx)[0];
  assert.equal(outsideCurriculum(lead, 'cbc'), false, lead.id);
});

test('with no curriculum work left, the missed probe is still the next step (no ceiling)', () => {
  const pass = { attempts: 1, correct: 1, passed: true, fromDiagnostic: true };
  const skills = Object.fromEntries(Object.values(SKILLS).filter(s => !outsideCurriculum(s, 'cbc')).map(s => [s.id, pass]));
  skills.G10_VECTORS_INTRO = { attempts: 1, correct: 0, passed: false, fromDiagnostic: true };
  const r = findMissingStep({ declaredGrade: 9, placementGrade: 9, diagnosed: true, skills }, SKILLS, 'cbc');
  assert.equal(r.missing, 'G10_VECTORS_INTRO');
});

test('placed at the last CBC grade with CBC work unpassed: that work, not Grade 10', () => {
  const pass = { attempts: 1, correct: 1, passed: true, fromDiagnostic: true };
  const skills = Object.fromEntries(Object.values(SKILLS).filter(s => gradeOf(s, 'cbc') <= 8).map(s => [s.id, pass]));
  const progress = { declaredGrade: 8, placementGrade: 9, diagnosed: true, skills };
  const r = findMissingStep(progress, SKILLS, 'cbc');
  assert.equal(gradeOf(SKILLS[r.missing], 'cbc'), 9, r.missing);
  assert.equal(outsideCurriculum(SKILLS[r.missing], 'cbc'), false, r.missing);
});
