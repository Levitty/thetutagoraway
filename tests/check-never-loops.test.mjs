// ============================================================================
// THE FREE CHECK NEVER HOLDS A CHILD ON ONE TOPIC (F21)
//
// 25 Oct 2026, a demo run: the Grade 5 check showed "One more like that one"
// on the same angle question fifty times. That run's robot was pressing
// "Previous question", but the rule it seemed to break is one the check must
// keep for real children: one skill is asked at most three times (once, once
// to confirm a miss, once as the final ask on the step about to be named),
// and the check always ends within its cap.
//
// Children here answer through the same state changes as AIMastery's
// handleDiagnosticAnswer, and the next question comes from the function the
// app itself calls (placement.js, nextAfterAnswer).
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { buildPlacementPool, selectQuestion, nextAfterAnswer, MAX_QUESTIONS } from '../src/ai-tutor/placement.js';

const POOLS = { cbc: buildPlacementPool(SKILLS, 'cbc'), native: buildPlacementPool(SKILLS) };

// A small seeded generator, so a failure repeats.
const seeded = (seed) => () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);

// One whole check. answer(skill, n) returns 'right', 'wrong' or 'skip'.
function runCheck(pool, declared, answer) {
  let record = [], pending = null, total = 0;
  let skill = selectQuestion([], declared, pool) || pool[0];
  const served = [];
  while (skill) {
    served.push(skill.id);
    assert.ok(served.length <= MAX_QUESTIONS + 1, `check ran past ${MAX_QUESTIONS} questions`);
    const a = answer(skill, served.length);
    const correct = a === 'right', skip = a === 'skip';
    let newPending = null;
    if (pending && pending.id === skill.id) {
      // A slip: the evidence goes back to before the miss, with this skill right.
      record = correct
        ? [...pending.record.filter(r => r.id !== skill.id), { id: skill.id, grade: skill.grade, strand: skill.strand, unit: skill.unit, probeFor: skill.probeFor, correct: true, confirmed: true }]
        : record.map(r => r.id === skill.id ? { ...r, confirmed: true } : r);
    } else if (record.some(r => r.id === skill.id)) {
      record = record.map(r => r.id === skill.id ? { ...r, ...(correct ? { correct: true } : {}), settled: true, ...(skip ? { skipped: true } : {}) } : r);
    } else {
      const before = record;
      record = [...record, { id: skill.id, grade: skill.grade, strand: skill.strand, unit: skill.unit, probeFor: skill.probeFor, ...(skill.hunt ? { hunt: true } : {}), correct, ...(skip ? { skipped: true } : {}) }];
      if (!correct && !skip) newPending = { id: skill.id, record: before };
    }
    total++;
    pending = newPending;
    skill = nextAfterAnswer({ skill, total, record, pending, declared, pool }).next;
  }
  return served;
}

function assertNoLoop(served, label) {
  const counts = {};
  for (const id of served) counts[id] = (counts[id] || 0) + 1;
  const most = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  assert.ok(most[1] <= 3, `${label}: ${most[0]} asked ${most[1]} times`);
  assert.ok(served.length <= MAX_QUESTIONS, `${label}: ${served.length} questions`);
}

const CHILDREN = {
  'always wrong': () => () => 'wrong',
  'always "I haven\'t learned this yet"': () => () => 'skip',
  'always right': () => () => 'right',
  'at random': (seed) => { const r = seeded(seed); return () => (r() < 0.45 ? 'right' : r() < 0.85 ? 'wrong' : 'skip'); },
};

for (const [curriculum, pool] of Object.entries(POOLS)) {
  const grades = [...new Set(pool.map(s => s.grade))].filter(g => g >= 1 && g <= 12).sort((a, b) => a - b);
  for (const [kind, make] of Object.entries(CHILDREN)) {
    test(`${curriculum}: a child who answers ${kind} is never held on one topic, at every grade`, () => {
      for (const declared of grades) {
        const seeds = kind === 'at random' ? [1, 2, 3, 4, 5, 6, 7, 8] : [1];
        for (const seed of seeds) assertNoLoop(runCheck(pool, declared, make(seed)), `${curriculum} Grade ${declared} seed ${seed}`);
      }
    });
  }
}

test('a miss is confirmed once, then the check moves on', () => {
  const pool = POOLS.cbc;
  const served = runCheck(pool, 5, () => 'wrong');
  assert.equal(served[0], served[1], 'the first miss is asked again to confirm it');
  assert.notEqual(served[1], served[2], 'after two misses the check moves to another topic');
});

test('a pending miss on another skill does not repeat the current one', () => {
  const pool = POOLS.cbc;
  const first = selectQuestion([], 5, pool);
  const record = [{ id: first.id, grade: first.grade, strand: first.strand, unit: first.unit, correct: false, confirmed: true }];
  const { next, confirm } = nextAfterAnswer({ skill: first, total: 2, record, pending: { id: 'SOMETHING_ELSE', record: [] }, declared: 5, pool });
  assert.equal(confirm, false);
  assert.ok(!next || next.id !== first.id, 'a confirmed miss was served again');
});
