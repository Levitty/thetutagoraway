// ============================================================================
// A FLUENCY DRILL COMES FROM THE CHILD'S OWN LEVEL (feedback F4)
//
// A strong Grade 4 child placed at Grade 5 got a timed rep on G3_COUNTING in
// every practice sitting: a third of their practice, two grades below where
// they placed. The same happened at every grade 4-9 (in the simulated
// classroom each strong child's lowest work was placement minus two). The
// drill floor is now one grade below the placement (or the class grade, if
// higher), in the child's own curriculum. A foundation the child has
// practised here, after a real miss, can still be drilled.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS, getPrerequisiteChain, getPostRequisiteChain, getPostRequisites } from '../src/ai-tutor/knowledgeGraph.js';
import { getFluencyPractice, getRecommendedPath } from '../src/ai-tutor/adaptiveEngine.js';
import { gradeOf } from '../src/ai-tutor/curricula.js';

const ctxFor = (curriculum) => ({ skills: SKILLS, getPostReqs: getPostRequisites, getPreChain: (id) => getPrerequisiteChain(id), getPostChain: (id) => getPostRequisiteChain(id), curriculum });
// Credited by the free check: mastered, no speed history, so never "fluent".
const credited = { attempts: 1, correct: 1, mastered: true, passed: true, fromDiagnostic: true };

// A strong child: in class Grade g, placed one above, everything at or below
// the placement credited by the check.
const strong = (g, curriculum = 'cbc') => ({
  declaredGrade: g, placementGrade: g + 1, diagnosed: true, curriculum,
  skills: Object.fromEntries(Object.values(SKILLS)
    .filter(s => Number.isFinite(gradeOf(s, curriculum)) && gradeOf(s, curriculum) <= g + 1)
    .map(s => [s.id, credited])),
});

for (const curriculum of ['cbc', 'native']) {
  for (const g of [4, 5, 6, 7, 8, 9]) {
    test(`${curriculum} Grade ${g}, strong: no fluency drill more than one grade below the placement`, () => {
      const p = strong(g, curriculum);
      const ctx = ctxFor(curriculum);
      const floor = p.placementGrade - 1;
      for (const s of getFluencyPractice(p, ctx)) {
        assert.ok(gradeOf(s, curriculum) >= floor, `${s.id} (Grade ${gradeOf(s, curriculum)}) drilled for a child placed at Grade ${p.placementGrade}`);
      }
      for (const s of getRecommendedPath(p, ctx).filter(x => x.type === 'fluency')) {
        assert.ok(gradeOf(s, curriculum) >= floor, `path opens a drill on ${s.id}`);
      }
    });
  }
}

test('the strong Grade 4 child from the report is not drilled on G3_COUNTING', () => {
  const ids = getFluencyPractice(strong(4), ctxFor('cbc')).map(s => s.id);
  assert.ok(!ids.includes('G3_COUNTING'));
});

test('a foundation rebuilt here after a miss can still be drilled for speed', () => {
  const p = strong(4);
  p.skills.G3_COUNTING = { ...credited, attempts: 12, correct: 10, practisedHere: true };
  const ids = getFluencyPractice(p, ctxFor('cbc')).map(s => s.id);
  assert.ok(ids.includes('G3_COUNTING'));
});

test('a child placed below their class is drilled from the class grade down one', () => {
  // Placed low (Grade 5 in Grade 7): drills come from Grade 6 up, not Grade 4.
  const p = strong(4);
  p.declaredGrade = 7;
  for (const s of getFluencyPractice(p, ctxFor('cbc'))) assert.ok(gradeOf(s, 'cbc') >= 6, s.id);
});
