// ============================================================================
// THE HINT LADDER — three rungs, and not one of them names the answer.
//
// tests/hints.test.mjs holds every AUTHORED hint to the answer rule. That is
// rung 1. Rungs 2 and 3 are generated from the solution steps at the moment a
// child presses "Next hint", and were never held to anything: the box they
// used to live in printed whatever computeSteps() returned, which is how
// "→ 18 × 4 = 72" once appeared beside a multiple choice with 72 in option C.
//
// So the whole ladder is derived in remediation.js rather than in the screen,
// and this holds every rung of it, for every skill, to the same rule the
// authored hints answer to.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { hintRungs, splitStep, withholdAnswer } from '../src/ai-tutor/remediation.js';
import { revealed } from '../src/ai-tutor/answerRule.js';

// Same seeded sampling as tests/hints.test.mjs: broad coverage, identical
// every run, so a leak found on Tuesday is still there on Wednesday.
const SEEDS = [1, 7, 13, 42, 99, 2026];
const DRAWS_PER_SEED = 25;
const seeded = (seed) => {
  let s = seed >>> 0;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
};
const withSeed = (seed, fn) => {
  const real = Math.random;
  Math.random = seeded(seed);
  try { return fn(); } finally { Math.random = real; }
};

// What a rung actually puts on the screen. A step rung shows its LABEL only —
// the value sits behind a blank the child fills in — so that is all this may
// hand to the answer rule.
const rendered = (rung) => (rung.kind === 'nudge' ? rung.text : rung.label);

// ---- the split that makes a step safe to show -------------------------------

test('a step that ends in a value splits into work and value', () => {
  const m = splitStep('380 × 4 = 1520.');
  assert.equal(m.slot, true);
  assert.equal(m.label, '380 × 4');
  assert.equal(m.value, '1520');
});

test('a step whose teaching comes AFTER the value stays whole', () => {
  // "write 3, carry 1" is the instruction being taught. Blanking the 13 and
  // dropping the rest would leave the rung saying nothing.
  const m = splitStep('Ones: 5 + 8 = 13 — write 3, carry 1.');
  assert.equal(m.slot, false);
  assert.ok(m.label.includes('carry 1'), `kept the carry: ${m.label}`);
});

test('an instruction with no value in it is not given a blank', () => {
  const m = splitStep('Line the digits up by place value.');
  assert.equal(m.slot, false);
  assert.equal(m.label, 'Line the digits up by place value');
});

test('a fraction result is a value like any other', () => {
  const m = splitStep('3/4 + 1/8 = 7/8');
  assert.equal(m.slot, true);
  assert.equal(m.value, '7/8');
});

// ---- the ladder itself ------------------------------------------------------

test('the ladder is never longer than the three rungs the screen draws', () => {
  // withholdAnswer caps the steps at two; rung 1 is the nudge. A ladder of
  // five rungs would overflow the panel and hand over a whole solution.
  const long = ['one', 'two = 2', 'three = 3', 'four = 4', 'five = 5'];
  assert.ok(withholdAnswer(long, '5').length <= 2);
  assert.ok(hintRungs({ question: '4 × 7 = ?', answer: 28 }).length <= 3);
});

test('the last step — the one that states the answer — is never a rung', () => {
  const steps = ['Split 24 into 20 + 4.', '20 × 5 = 100.', '4 × 5 = 20.', 'Add the parts: 100 + 20 = 120.'];
  const labels = hintRungs({ question: '24 × 5 = ?', answer: 120 }, { steps }).map(rendered);
  assert.ok(!labels.some(l => /120/.test(l)), `the total leaked into a rung:\n  ${labels.join('\n  ')}`);
});

test('every rung of every skill keeps its own answer back', () => {
  // Rung 1 is the authored hint, and tests/hints.test.mjs already holds every
  // one of those — with the reviewed exceptions where stating the rule IS the
  // teaching. This test is about the rungs ABOVE it, which nothing held
  // before, so it skips rung 1 rather than re-litigating that list.
  //
  // And it judges them WITHOUT the question-quoting exemption. That exemption
  // excuses a number the child can already see, which is right for a hint
  // somebody wrote and wrong for a step a function generated: it is a loose
  // substring test, so "19" counts as visible because the question says "190",
  // and "190 ÷ 10 = 19 books each" went straight through it onto the screen.
  const offenders = [];
  for (const id of Object.keys(SKILLS)) {
    let found = null;
    for (const seed of SEEDS) {
      if (found) break;
      withSeed(seed, () => {
        for (let i = 0; i < DRAWS_PER_SEED && !found; i++) {
          let p;
          try { p = generateProblem(id); } catch { continue; }
          if (!p || p.placeholder) continue;
          const answers = [p.answer, ...(p.accepts || [])].filter(a => a != null);
          for (const rung of hintRungs(p)) {
            if (rung.kind !== 'step') continue;
            const text = rendered(rung);
            if (!text) continue;
            const hit = answers.find(a => revealed(a, text, ''));
            if (hit) {
              found = `${id} (seed ${seed}): answer ${JSON.stringify(hit)} appears in rung ${JSON.stringify(text)}\n    Q: ${p.question}`;
              break;
            }
          }
        }
      });
    }
    if (found) offenders.push(found);
  }
  assert.deepEqual(offenders, [], `\n  ${offenders.join('\n  ')}\n`);
});

test('a problem with no computable steps still has its first rung', () => {
  // The guard against an empty panel: a word problem the arithmetic parser
  // cannot read still opens with the authored hint, and the screen must not
  // offer a "Next hint" that leads nowhere.
  const ladder = hintRungs({ question: 'Name the capital of Kenya.', answer: 'Nairobi', hint: 'Think of the largest city.' });
  assert.equal(ladder.length, 1);
  assert.equal(ladder[0].kind, 'nudge');
  assert.ok(ladder[0].text);
});
