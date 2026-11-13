// The realistic pretend child (13 Nov 2026, PLAN_TO_FOUR.md step 6 and the humans& lesson): a free check, with no model
// call, that what the child is told and what the harness does carry the properties a real ten-year-old has:
// one specific misconception per scenario, wrong on about 25 to 30% of checkable claims, mostly 1 to 6 words a turn,
// sometimes ignoring the question or trailing off, and a share of turns misheard.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SCENARIOS } from '../scripts/evals/scenarios.mjs';
import { SHEETS, sheetFor, MISCONCEPTIONS } from '../scripts/evals/child-sheets.mjs';
import { createChild, personaSystem, wordsOf, DEFAULT_ERROR_RATE } from '../scripts/evals/child.mjs';

test('every one of the 41 scenarios has a sheet with exactly one named misconception, held as a belief', () => {
  assert.equal(SCENARIOS.length, 41);
  for (const sc of SCENARIOS) {
    const sh = sheetFor(sc);
    assert.ok(SHEETS[sc.n], `scenario ${sc.n} has its own sheet`);
    assert.equal(typeof sh.misc, 'string', `scenario ${sc.n}: one misconception, by name`);
    assert.ok(MISCONCEPTIONS[sh.misc], `scenario ${sc.n}: ${sh.misc} is in the table`);
    assert.ok(sh.mis.belief.length > 40 && sh.mis.triggers instanceof RegExp, `scenario ${sc.n}: a belief and its triggers`);
  }
});

test('the default wrong-answer rate is 25 to 30%, and ordinary children keep it', () => {
  assert.ok(DEFAULT_ERROR_RATE >= 0.25 && DEFAULT_ERROR_RATE <= 0.3);
  for (const n of [1, 2, 3, 29, 30]) { const r = sheetFor({ n }).errorRate; assert.ok(r >= 0.25 && r <= 0.3, `scenario ${n}: ${r}`); }
});

test('the prompt the child model reads carries the properties: one wrong idea, short messy speech, sometimes off the question', () => {
  for (const sc of SCENARIOS) {
    const p = personaSystem(sc, sheetFor(sc));
    assert.match(p, /THE ONE WRONG IDEA YOU HOLD/);
    assert.ok(p.includes(sheetFor(sc).mis.belief), `scenario ${sc.n}: its own belief`);
    assert.match(p, /usually 1 to 6 words/);
    assert.match(p, /trail off/);
    assert.match(p, /do not answer what was asked/);
    assert.match(p, /not a clever one/);
    // never the judge's expectation or the simulation's limits
    if (sc.expect) assert.ok(!p.includes(sc.expect), `scenario ${sc.n}: no expectation in the prompt`);
  }
});

test('over 600 offline turns: wrong on 25-30% of claims, mostly 1-6 words, some ignored questions, trailing and mishearing', async () => {
  // A tidy, wordy fake model on purpose: the harness, not the model, must make the child realistic.
  const callModel = async ({ user }) => {
    const m = /answer is "([^"]+)"/.exec(user);
    return { text: m ? `I think the answer is ${m[1]} because I counted all of the parts carefully` : 'I believe that the answer would be two sixths because I added them', cost: 0 };
  };
  let claims = 0; let wrong = 0; let short = 0; let spoken = 0; let ignored = 0; let trailed = 0; let misheard = 0; let heardTurns = 0;
  for (let seed = 1; seed <= 50; seed += 1) {
    const ch = createChild({ sc: SCENARIOS.find((s) => s.n === 30), seed, callModel });
    for (let t = 0; t < 12; t += 1) {
      const c = await ch.act({ dialogue: '', boardText: 'a bar in four parts, two shaded', tutorText: 'How many parts are shaded on the bar?', steps: [], answer: 'two', doing: 'answer' });
      if (c.meta.claim) { claims += 1; if (c.meta.wrong) wrong += 1; }
      if (['ignore', 'different'].includes(c.meta.kind)) ignored += 1;
      if (c.speech) { spoken += 1; if (wordsOf(c.speech).length <= 6) short += 1; if (/\.\.\.$|…$/.test(c.speech)) trailed += 1; }
      if (c.speech && /\b(two|four|quarters?)\b/i.test(c.speech)) { heardTurns += 1; if (ch.heard(c.speech) !== c.speech) misheard += 1; }
    }
  }
  const rate = wrong / claims;
  assert.ok(rate >= 0.22 && rate <= 0.33, `wrong rate ${rate.toFixed(3)}`);
  assert.ok(short / spoken >= 0.85, `1-6 words on ${(short / spoken).toFixed(2)} of turns`);
  assert.ok(ignored / 600 >= 0.03, `ignored or answered a different question on ${ignored} of 600 turns`);
  assert.ok(trailed / spoken >= 0.05, `trailed off on ${trailed} turns`);
  assert.ok(heardTurns > 50 && misheard / heardTurns >= 0.04 && misheard / heardTurns <= 0.2, `misheard ${misheard} of ${heardTurns}`);
});
