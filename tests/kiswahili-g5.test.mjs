// Kiswahili Grade 5: skills, misconception library and question families (curriculum/kiswahili/g5.json).
// All draft and off for children until a native Kiswahili teacher signs them off.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { textFailures, checkTextForms } from '../engine/scripts/english_checks.mjs';
import { entryFor } from '../src/ai-tutor/content/subjects/registry.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../src/ai-tutor/content/curriculumMap.kiswahili.g5.js';
import { isOn, setFamilyMode, drawFamily } from '../src/ai-tutor/content/families/core.js';
import { FAMILIES as BANK } from '../src/ai-tutor/content/families/index.js';
import { checkTextAnswer } from '../src/ai-tutor/answerCheckText.js';
import { SIGNED } from '../src/ai-tutor/content/families/kiswahili_g5_signed.js';
import { precheckItem, readingStats } from '../scripts/lib/item-precheck.mjs';

const source = JSON.parse(readFileSync(new URL('../curriculum/kiswahili/g5.json', import.meta.url), 'utf8'));
const subs = source.sub_strands;
const entry = entryFor('kiswahili', 5);
const FAMILIES = entry.families;

test('the in-app map is generated from the file HOREB owns, and the official outcomes are untouched', () => {
  assert.equal(Object.keys(OUTCOMES).length, 186);
  assert.equal(source.totals.outcomes, 186);
  assert.equal(Object.keys(SKILLS).length, subs.flatMap(s => s.skills).length);
  assert.equal(Object.keys(MIS_FEEDBACK).length, subs.flatMap(s => s.misconceptions).length);
  assert.equal(source.totals.skills, Object.keys(SKILLS).length);
  assert.equal(source.totals.misconceptions, subs.flatMap(s => s.misconceptions).length);
  for (const s of subs) for (const o of s.outcomes) assert.ok(/^kicd_(verified|read)$/.test(o.status), `${o.code}: outcome status changed`);
});

test('skills and the misconception library are proposed or draft, with the fields a reviewer needs', () => {
  for (const s of subs) {
    for (const k of s.skills) {
      assert.equal(k.status, 'proposed');
      assert.ok(k.mastery && k.question_forms.length >= 2 && k.thinking.length, `${k.code}: mastery, forms or thinking missing`);
      assert.ok(k.outcomes.length && k.outcomes.every(o => OUTCOMES[o]), `${k.code}: unknown outcome`);
      for (const p of k.prerequisites) assert.ok(p.kind === 'outcome' || SKILLS[p.requires], `${k.code}: unknown prerequisite ${p.requires}`);
    }
    for (const m of s.misconceptions) {
      assert.equal(m.status, 'draft');
      for (const f of ['error', 'cause', 'reveals', 'help', 'feedback', 'source']) assert.ok(m[f] && String(m[f]).length > 5, `${m.code}: ${f} missing`);
      assert.ok(m.example.question && m.example.wrong_answer && m.example.correct_answer, `${m.code}: example incomplete`);
      assert.ok(!/—/.test(JSON.stringify(m)), `${m.code}: em dash`);
    }
  }
});

test('every Kiswahili skill has families in at least two different structures, and every family passes its checks', () => {
  const bad = textFailures(120).filter(f => /kiswahili|KISW/.test(f));
  assert.deepEqual(bad, [], `\n${bad.slice(0, 40).join('\n')}\n`);
  assert.deepEqual(checkTextForms(FAMILIES, SKILLS), []);
});

test('Kiswahili families stay off for children until a native speaker signs them off, and stay out of the Maths bank', () => {
  setFamilyMode('reviewed');
  assert.deepEqual(SIGNED, []);
  for (const f of FAMILIES) {
    assert.ok(f.reviewed === SIGNED.includes(f.id) && f.draft === !f.reviewed, `${f.id}: reviewed must follow the sign-off list`);
    assert.equal(isOn(f), false, `${f.id} is on for children without a sign-off`);
    assert.equal(f.native, true, `${f.id}: a native speaker must check it`);
    assert.equal(f.marker, 'text');
    assert.ok(f.cskill.startsWith('KISW.G5.') && f.id.startsWith('kiswahili5.'));
  }
  assert.ok(!BANK.some(f => String(f.id).startsWith('kiswahili5.')));
});

test('every family draws at least four different questions, and every skill carries the 8-of-10 mastery rule', () => {
  for (const f of FAMILIES) {
    const seen = new Set();
    for (let i = 0; i < 80; i++) { const p = drawFamily(f).p; seen.add(`${p.question}|${(p.choices || []).slice().sort().join('/')}|${(p.shownSteps || []).join('/')}|${p.passage?.title || ''}`); }
    assert.ok(seen.size >= 4, `${f.id}: only ${seen.size} different questions`);
  }
  // every skill's fine mastery rule names 8 of 10
  for (const s of subs) for (const k of s.skills) assert.match(k.mastery, /8 of 10/, k.code);
});

test('the word marker reads Kiswahili: the apostrophe of ng\', capital letters, spare spaces and a full stop after one word', () => {
  const key = { answer: 'ng\'ombe', accepts: [] };
  for (const a of ['ng\'ombe', 'Ng\'ombe', 'ng’ombe', '  ng\'ombe ', 'ng\'ombe.']) assert.ok(checkTextAnswer(a, key), a);
  for (const a of ['ngombe', 'ng ombe', 'ng\'ombee', '']) assert.ok(!checkTextAnswer(a, key), a);
  // a compound noun written as two words is wrong (the library names it M_AMBATA_SPLIT)
  assert.ok(checkTextAnswer('mwanafunzi', { answer: 'mwanafunzi' }));
  assert.ok(!checkTextAnswer('mwana funzi', { answer: 'mwanafunzi' }));
  assert.ok(!checkTextAnswer('mwanafunzi mwalimu', { answer: 'mwanafunzi' }));
  // a tapped option is matched exactly, capital letters and punctuation included
  const tap = { choices: ['Unaenda wapi?', 'unaenda wapi?'], answer: 'Unaenda wapi?' };
  assert.ok(checkTextAnswer('Unaenda wapi?', tap));
  assert.ok(!checkTextAnswer('unaenda wapi?', tap));
  // a hyphenated answer (a prefix) and a two-word answer are read as typed
  assert.ok(checkTextAnswer('mama mdogo', { answer: 'mama mdogo' }));
  assert.ok(checkTextAnswer('Mama  Mdogo', { answer: 'mama mdogo' }));
});

test('the English reading-level rule is not applied to Kiswahili, but length rules still are', () => {
  const long = 'Wanjiru ni msichana wa darasa la tano katika Shule ya Msingi ya Kamukunji na bibi yake alimwita jikoni leo asubuhi mapema sana.';
  assert.ok(readingStats(long).fk > 7);   // the English formula reads Kiswahili as hard: that is why it is skipped
  const item = { question: long + ' Nani alimwita Wanjiru jikoni?', answer: 'bibi', cskill: 'KISW.G5.KUSOMA.T1_KUSOMA_KWA_UFAHAMU.UFAHAMU_HADITHI', marker: 'text', misconceptions: [] };
  assert.ok(!precheckItem(item, { grade: 5, family: true }).some(f => f.id === 'reading' && /reading grade/.test(f.message)));
  const english = { ...item, cskill: 'ENGL.G5.X.Y.Z' };
  assert.ok(precheckItem(english, { grade: 5, family: true }).some(f => f.id === 'reading' && /reading grade/.test(f.message)));
  assert.ok(precheckItem({ ...item, question: 'a '.repeat(260) }, { grade: 5, family: true }).some(f => f.id === 'reading' && f.level === 'hard'));
});

test('no Islamic or English-only checks leak into the child-facing Kiswahili: no emoji, no em dash, no English spelling rules', () => {
  for (const f of FAMILIES) {
    const p = drawFamily(f).p;
    const all = JSON.stringify(p);
    assert.ok(!/—/.test(all), `${f.id}: em dash`);
    assert.ok(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(all), `${f.id}: emoji`);
  }
});
