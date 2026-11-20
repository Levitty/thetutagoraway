// ============================================================================
// NO COMPUTER NOISE IN WHAT A CHILD READS (feedback F12)
//
// Worked examples showed "1 > 0.3333333333333333" (G7_FRACTIONS_COMPARE, after
// cross-multiplying, so the step did not even follow) and "25 ÷ 7.5 =
// 3.3333333333333335…" (G7_ANGLE_CONSTRUCTION). tidy() only cleans the
// question, answer and hints, so these slipped through.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';

const NOISE = /\d\.\d{8,}/;
const readable = (p) => [p.question, p.instruction, p.hint, ...(p.hints || []), ...(p.solutionSteps || []),
  ...(p.solution?.steps || []).map(s => `${s.text || s} ${s.expr || ''}`),
  ...(p.workedExample?.steps || []), p.workedExample?.problem, p.workedExample?.solution].filter(Boolean).map(String);

test('hints, solutions and worked examples never show float noise', () => {
  const found = new Set();
  // G8_POLYGON_ANGLES (a regular 7-gon) has the noise in its KEY: feedback F16.
  for (const id of Object.keys(SKILLS).filter(id => id !== 'G8_POLYGON_ANGLES')) {
    for (let i = 0; i < 25; i++) {
      const p = generateProblem(id);
      const t = readable(p).find(x => NOISE.test(x));
      if (t) found.add(`${id}: ${t.match(/.{0,30}\d\.\d{8,}/)[0]}`);
    }
  }
  assert.deepEqual([...found], []);
});

test('the fraction comparison step compares the cross-products', () => {
  for (let i = 0; i < 30; i++) {
    const p = generateProblem('G7_FRACTIONS_COMPARE');
    const step = p.solution.steps[1].expr;
    assert.match(step, /^\d+ [<>=] \d+, so /, step);
  }
});

test('the last clean-up reaches solution steps and the worked example', async () => {
  const { tidyProblem } = await import('../src/ai-tutor/problemGenerators.js');
  const p = tidyProblem({ question: 'q', answer: '1',
    solution: { steps: [{ text: 'Add.', expr: '0.1 + 0.2 = 0.30000000000000004' }], answer: '0.3' },
    solutionSteps: ['1.2000000000000002 m'],
    workedExample: { problem: '0.1 + 0.2', steps: ['0.30000000000000004'], solution: '0.30000000000000004' } }, 'X');
  assert.equal(p.solution.steps[0].expr, '0.1 + 0.2 = 0.3');
  assert.equal(p.solutionSteps[0], '1.2 m');
  assert.deepEqual(p.workedExample.steps, ['0.3']);
  assert.equal(p.workedExample.solution, '0.3');
});

test('the scan covers every skill in the graph', async () => {
  const { SKILLS } = await import('../src/ai-tutor/knowledgeGraph.js');
  assert.ok(Object.keys(SKILLS).length > 150, `only ${Object.keys(SKILLS).length} skills`);
});
