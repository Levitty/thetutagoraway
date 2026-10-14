// ============================================================================
// EVERY SKILL MUST PRODUCE REAL, VARIED, TEACHABLE PROBLEMS
//
// Regression tests for two live-testing findings:
//   "This question has been asked the same like 3 times a row"
//   a skill silently falling through to a placeholder ("Answer 1 to continue")
//
// The quality gate (engine/scripts/quality_gate.mjs) checks authored content
// far more deeply — worked examples, misconceptions, independently verified
// answers. This is the fast floor that runs on every push: nothing is empty,
// nothing is a stub, nothing repeats itself immediately.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { STRUCTURED_IDS } from '../src/ai-tutor/content/index.js';

const ALL = Object.keys(SKILLS);
const SAMPLES = 12;

test('every skill generates a usable problem', () => {
  const broken = [];
  for (const id of ALL) {
    let p;
    try { p = generateProblem(id); } catch (e) { broken.push(`${id}: threw ${e.message}`); continue; }
    if (!p) { broken.push(`${id}: returned nothing`); continue; }
    if (!p.question) broken.push(`${id}: no question text`);
    if (p.answer == null || p.answer === '') broken.push(`${id}: no answer`);
  }
  assert.deepEqual(broken, [], `\n${broken.join('\n  ')}\n`);
});

test('no skill falls through to a placeholder stub', () => {
  // A placeholder grants mastery for typing "1" — it must never reach a child.
  const stubs = ALL.filter(id => {
    try { return generateProblem(id)?.placeholder === true; } catch { return false; }
  });
  assert.deepEqual(stubs, [], `placeholder content still served for: ${stubs.join(', ')}`);
});

test('authored skills vary their questions', () => {
  // The lesson loop rerolls to avoid immediate repeats, but it can only do
  // that if the generator has more than one question to give.
  //
  // Generators are random and some branch internally, so a small sample can
  // under-count by luck. VARIETY_SAMPLES is deliberately well above the
  // threshold so a passing skill effectively never fails by chance — this
  // test must fail because content is thin, not because dice were unkind.
  const VARIETY_SAMPLES = 30;
  const MIN_DISTINCT = 4;
  const thin = [];
  for (const id of STRUCTURED_IDS) {
    const seen = new Set();
    for (let i = 0; i < VARIETY_SAMPLES; i++) {
      try { seen.add(generateProblem(id)?.question); } catch { /* covered above */ }
    }
    if (seen.size < MIN_DISTINCT) thin.push(`${id} (${seen.size} distinct in ${VARIETY_SAMPLES})`);
  }
  assert.deepEqual(thin, [], `\n${thin.join('\n  ')}\n`);
});

test('authored skills carry a hint ladder', () => {
  const noHints = STRUCTURED_IDS.filter(id => {
    try {
      const p = generateProblem(id);
      return !p?.hint && !(p?.hints?.length);
    } catch { return false; }
  });
  assert.deepEqual(noHints, [], `authored skills with no hints: ${noHints.join(', ')}`);
});

test('the knowledge graph has no broken prerequisite references', () => {
  const broken = [];
  for (const [id, s] of Object.entries(SKILLS)) {
    for (const pre of s.prerequisites || []) {
      if (!SKILLS[pre]) broken.push(`${id} → missing prerequisite ${pre}`);
    }
  }
  assert.deepEqual(broken, [], `\n${broken.join('\n  ')}\n`);
});
