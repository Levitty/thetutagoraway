// ============================================================================
// EVERY QUESTION FAMILY, REVIEWED OR NOT: the key is computed and checked a
// second way over many draws, exactly one answer is right, wrong options come
// from named mistakes, it matches its outcome, and it adds a form its skill did
// not have. The checks are in engine/scripts/family_checks.mjs, shared with the gate.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkFamily, checkForms, baseFormsOf, FAMILIES } from '../engine/scripts/family_checks.mjs';
import { setFamilyMode, drawFamily } from '../src/ai-tutor/content/families/core.js';
import { planYoungLesson } from '../src/ai-tutor/youngPlan.js';
import { familyDraw } from '../src/ai-tutor/content/families/index.js';
import { measureSkill } from '../engine/scripts/range_report.mjs';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { checkAnswerMatch } from '../src/ai-tutor/answerCheck.js';

test('every family passes its checks over 200 draws', () => {
  const bad = FAMILIES.flatMap(f => checkFamily(f, 200));
  assert.deepEqual(bad, [], `\n${bad.slice(0, 40).join('\n')}\n`);
});

test('no two families in a skill are the same form, and none repeats what the skill had', () => {
  setFamilyMode('reviewed');
  const base = baseFormsOf([...new Set(FAMILIES.map(f => f.skill))]);
  const bad = checkForms(base);
  assert.deepEqual(bad, [], `\n${bad.slice(0, 40).join('\n')}\n`);
});

test('the lesson gets families with all on; other screens get nothing they cannot show', () => {
  setFamilyMode('all');
  try {
    for (const f of FAMILIES) {
      for (let i = 0; i < 30; i++) {
        const p = familyDraw(f.skill, { correctSoFar: null });
        if (p) { assert.ok(!p.parts && !p.shownSteps, `${f.skill} gave a diagnostic or review screen ${p.familyId}, which it cannot draw`); }
      }
    }
  } finally { setFamilyMode('reviewed'); }
});

test('a family question served through generateProblem marks itself right', () => {
  setFamilyMode('all');
  try {
    for (const id of [...new Set(FAMILIES.map(f => f.skill))]) {
      for (let i = 0; i < 12; i++) {
        const p = generateProblem(id, { lesson: true, correctSoFar: 6 });
        if (p?.parts) { for (const q of p.parts) assert.ok(checkAnswerMatch(q.answer, q), `${p.familyId}: ${q.prompt}`); continue; }
        assert.ok(checkAnswerMatch(String(p.answer), p), `${id} ${p.familyId}: ${p.question} -> ${p.answer}`);
      }
    }
  } finally { setFamilyMode('reviewed'); }
});

test('a family for the youngest works in their tap-and-listen lesson', () => {
  for (const f of FAMILIES.filter(x => x.young)) {
    for (let i = 0; i < 30; i++) {
      const p = drawFamily(f).p;
      const plan = planYoungLesson(p);
      assert.ok(plan, `${f.id}: the young lesson cannot show "${p.question}"`);
      assert.ok(plan.choices.some(c => checkAnswerMatch(String(c), p)), `${f.id}: no button is right on "${p.question}": ${plan.choices}`);
    }
  }
});

test('the 18 skills now teach what their label says', () => {
  setFamilyMode('reviewed');
  for (const id of ['G7_TEMPERATURE', 'G9_APPROX_ERRORS', 'G8_SCALE_DRAWING', 'G6_INEQUALITIES', 'G6_MONEY', 'G5_MONEY', 'G9_SPEED_VELOCITY']) {
    const m = measureSkill(id, 80);
    assert.ok(m.offTopic / m.n <= 0.2, `${id}: ${m.offTopic} of ${m.n} draws off-topic, e.g. ${m.offTopicExample}`);
  }
  for (let i = 0; i < 300; i++) {
    const q = generateProblem('G7_TEMPERATURE', { kp: 0 }).question;
    assert.ok(!/^-?\d+ [+−-] \(?-?\d+\)?$/.test(q.trim()), `bare arithmetic under Temperature: ${q}`);
  }
});

// ---- language of the frame, and the question mark (13 Nov 2026) ----
import { asQuestion as _asQuestion, toProblem as _toProblem } from '../src/ai-tutor/content/families/core.js';
test('English questions end with a question mark; instructions keep their full stop', () => {
  assert.equal(_asQuestion('Which of these is a proper noun.'), 'Which of these is a proper noun?');
  assert.equal(_asQuestion('Choose the noun. Which one is a verb.'), 'Choose the noun. Which one is a verb?');
  assert.equal(_asQuestion('Choose the noun.'), 'Choose the noun.');
});
test('a spot-the-mistake frame speaks the family language', () => {
  const mk = (extra) => ({ id: 't', form: 'spot', rung: 1, outcome: 'X', ...extra, make: () => ({ question: 'q', working: [{ text: 'a', ok: true }, { text: 'b', ok: false }], fix: 'f' }) });
  const sw = _toProblem(mk({ subject: 'kiswahili' }), {});
  assert.deepEqual(sw.mc, ['Hatua 1', 'Hatua 2']);
  assert.equal(sw.answer, 'Hatua 2');
  const en = _toProblem(mk({ subject: 'english' }), {});
  assert.deepEqual(en.mc, ['Step 1', 'Step 2']);
});
