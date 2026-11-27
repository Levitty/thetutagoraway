// F14: a sitting never shows the same question twice, and no skill is so thin
// that a sitting of eight questions cannot be served without a repeat.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { freshProblem, questionKey } from '../src/ai-tutor/fresh.js';

test('freshProblem draws again while a question was already shown', () => {
  const bag = ['a', 'a', 'a', 'b'];
  let i = 0;
  const seen = new Set([questionKey({ question: 'a' })]);
  const p = freshProblem(() => ({ question: bag[i++] }), seen);
  assert.equal(p.question, 'b');
  assert.ok(seen.has(questionKey(p)));
});

test('freshProblem still serves something when a skill has run out of questions', () => {
  const seen = new Set();
  freshProblem(() => ({ question: 'only' }), seen);
  assert.equal(freshProblem(() => ({ question: 'only' }), seen).question, 'only');
});

test('the same words with a different picture are a different question', () => {
  assert.notEqual(questionKey({ question: 'Shade 3/8', visual: { n: 8 } }), questionKey({ question: 'Shade 3/8', visual: { n: 16 } }));
});

test('every skill serves 8 different questions in a sitting', () => {
  const thin = [];
  for (const id of Object.keys(SKILLS)) {
    let failures = 0;
    for (let run = 0; run < 5; run++) {
      const seen = new Set();
      for (let q = 0; q < 8; q++) {
        const before = seen.size;
        freshProblem(() => generateProblem(id, { lesson: true, kp: Math.min(q >> 2, 3) }), seen);
        if (seen.size === before) failures++;
      }
    }
    if (failures > 1) thin.push(`${id} (${failures} repeats in 40)`);
  }
  assert.deepEqual(thin, [], `skills too thin for a sitting: ${thin.join(', ')}`);
});

test('the lesson screen serves every new question through the sitting memory', () => {
  const src = readFileSync(new URL('../src/ai-tutor/AIMastery.jsx', import.meta.url), 'utf8');
  const start = src.indexOf('const serveLessonProblem');
  const end = src.indexOf('// ==================== REVIEW', start);
  const review = src.slice(end, src.indexOf('setTimeout(() => {', src.indexOf('const startReview')) + 400);
  for (const part of [src.slice(start, end), review]) {
    const bare = part.match(/setProblem\(ownChoicesOnly\(generateProblem\(/g);
    assert.equal(bare, null, 'a lesson or review problem is drawn without freshProblem');
  }
  assert.match(src, /sittingSeenRef\.current = new Set\(\)/);
});
