// ============================================================================
// THE WORKED EXAMPLE IS THE SAME KIND OF QUESTION (feedback F11)
//
// 21% of worked examples (72 CBC Grade 4-9 skills) were drawn from another
// variant of the skill: a pie-chart question with a travel-graph example,
// "decrease by 15%" with an increase, adding times with a subtraction.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';

const kind = (t) => String(t || '').trim().toLowerCase().replace(/\d+/g, '#').replace(/\b[a-z]\b/g, '_');

test('worked example instruction matches the question it sits under', () => {
  let total = 0, wrong = 0; const off = new Set();
  for (const id of Object.keys(SKILLS)) {
    for (let i = 0; i < 15; i++) {
      const p = generateProblem(id);
      const w = p.workedExample;
      if (!w?.instruction || !p.instruction) continue;
      total++;
      if (kind(w.instruction) !== kind(p.instruction)) { wrong++; off.add(id); }
    }
  }
  assert.ok(total > 1000);
  // A variant with only one or two questions can, rarely, find no other
  // example; that stays under 1% (it was 21%).
  assert.ok(wrong / total < 0.01, `${(100 * wrong / total).toFixed(1)}% mismatched: ${[...off].join(', ')}`);
});

// Added 18 Nov (tester, 27 Oct): the example is also about the same thing, not
// only under the same instruction: a cone question with a pyramid example,
// alternate angles with co-interior, the median with the mean.
import { exampleMismatch, KIND_GROUPS } from '../src/ai-tutor/content/exampleKind.js';

test('worked example is about the same thing as its question', () => {
  let total = 0, wrong = 0; const off = new Set();
  for (const id of Object.keys(SKILLS)) {
    for (let i = 0; i < 15; i++) {
      const p = generateProblem(id);
      const w = p.workedExample;
      if (!w) continue;
      total++;
      const ex = { question: w.problem, instruction: w.instruction, solution: { steps: w.richSteps || w.steps } };
      const why = exampleMismatch({ ...p, type: undefined }, ex);
      if (why && why !== 'the same question' && why !== 'another instruction') { wrong++; off.add(`${id} (${why})`); }
    }
  }
  assert.ok(total > 1000);
  assert.ok(wrong / total < 0.005, `${wrong} of ${total}: ${[...off].join(', ')}`);
});

test('the rule names the faults the tester filed', () => {
  const q = { instruction: 'Find the volume.', question: 'A cone has radius 3 cm and height 4 cm.', type: 'vol-cone' };
  assert.equal(exampleMismatch(q, { ...q, question: 'A cone has radius 5 cm and height 2 cm.' }), null);
  assert.ok(exampleMismatch(q, { ...q, question: 'A pyramid has base 3 cm by 4 cm.', type: 'vol-pyramid' }));
  assert.ok(exampleMismatch(q, { ...q, question: 'A pyramid has base 3 cm by 4 cm.' }));
  assert.ok(exampleMismatch(q, { ...q }), 'the same question is never its own example');
  assert.ok(KIND_GROUPS.length >= 6);
});
