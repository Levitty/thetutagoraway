// ============================================================================
// EVERY KEY IS A NUMBER A CHILD CAN TYPE (feedback F16)
//
// "Find each interior angle of a regular 7-sided polygon" had the key
// 128.57142857142858: 128.57 and 128.6 were marked wrong, and the answer shown
// afterwards was fourteen decimal places long. About 6% of G8_POLYGON_ANGLES.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';

test('no answer key carries more than four decimal places', () => {
  const found = new Set();
  for (const id of Object.keys(SKILLS)) {
    for (let i = 0; i < 40; i++) {
      const p = generateProblem(id);
      if (/\d\.\d{5,}/.test(String(p.answer))) found.add(`${id}: ${p.question} -> ${p.answer}`);
    }
  }
  assert.deepEqual([...found], []);
});
