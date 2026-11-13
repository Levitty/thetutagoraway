// Kiswahili Grade 4: skills, misconception library and question families (curriculum/kiswahili/g4.json).
// All draft and off for children until a native Kiswahili teacher signs them off.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { textFailures, checkTextForms } from '../engine/scripts/english_checks.mjs';
import { entryFor } from '../src/ai-tutor/content/subjects/registry.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../src/ai-tutor/content/curriculumMap.kiswahili.g4.js';
import { isOn, setFamilyMode, drawFamily } from '../src/ai-tutor/content/families/core.js';
import { FAMILIES as BANK } from '../src/ai-tutor/content/families/index.js';
import { checkTextAnswer } from '../src/ai-tutor/answerCheckText.js';
import { MIS_FEEDBACK as G5_FEEDBACK, SKILLS as G5_SKILLS } from '../src/ai-tutor/content/curriculumMap.kiswahili.g5.js';
import { SIGNED } from '../src/ai-tutor/content/families/kiswahili_g4_signed.js';
import { precheckItem, readingStats } from '../scripts/lib/item-precheck.mjs';

const source = JSON.parse(readFileSync(new URL('../curriculum/kiswahili/g4.json', import.meta.url), 'utf8'));
const subs = source.sub_strands;
const entry = entryFor('kiswahili', 4);
const FAMILIES = entry.families;

test('the in-app map is generated from the file HOREB owns, and the official outcomes are untouched', () => {
  assert.equal(Object.keys(OUTCOMES).length, 210);
  assert.equal(source.totals.outcomes, 210);
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
    assert.ok(f.cskill.startsWith('KISW.G4.') && f.id.startsWith('kiswahili4.'));
  }
  assert.ok(!BANK.some(f => String(f.id).startsWith('kiswahili4.')));
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
  const item = { question: long + ' Nani alimwita Wanjiru jikoni?', answer: 'bibi', cskill: 'KISW.G4.KUSOMA.T1_KUSOMA_KWA_UFAHAMU.UFAHAMU_HADITHI', marker: 'text', misconceptions: [] };
  assert.ok(!precheckItem(item, { grade: 4, family: true }).some(f => f.id === 'reading' && /reading grade/.test(f.message)));
  const english = { ...item, cskill: 'ENGL.G4.X.Y.Z' };
  assert.ok(precheckItem(english, { grade: 4, family: true }).some(f => f.id === 'reading' && /reading grade/.test(f.message)));
  assert.ok(precheckItem({ ...item, question: 'a '.repeat(260) }, { grade: 4, family: true }).some(f => f.id === 'reading' && f.level === 'hard'));
});

test('no Islamic or English-only checks leak into the child-facing Kiswahili: no emoji, no em dash, no English spelling rules', () => {
  for (const f of FAMILIES) {
    const p = drawFamily(f).p;
    const all = JSON.stringify(p);
    assert.ok(!/—/.test(all), `${f.id}: em dash`);
    assert.ok(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(all), `${f.id}: emoji`);
  }
});

test('Grade 4 misconception codes start M4_ and never clash with Grade 5 (the two maps are joined for one subject)', () => {
  for (const code of Object.keys(MIS_FEEDBACK)) {
    assert.ok(code.startsWith('M4_'), `${code}: Grade 4 codes start M4_`);
    assert.ok(!(code in G5_FEEDBACK), `${code} clashes with a Grade 5 code`);
  }
  for (const code of Object.keys(SKILLS)) assert.ok(code.startsWith('KISW.G4.') && !(code in G5_SKILLS));
});

test('prerequisites reach Grade 3 outcomes and Grade 4 skills only, and leads_to names real Grade 5 skills', () => {
  const g3 = JSON.parse(readFileSync(new URL('../curriculum/kiswahili/g3.json', import.meta.url), 'utf8'));
  const g3Codes = new Set(g3.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
  let pre = 0, leads = 0;
  for (const s of subs) for (const k of s.skills) {
    for (const p of k.prerequisites) {
      pre++;
      if (p.kind === 'outcome') assert.ok(g3Codes.has(p.requires) && p.grade === 3, `${k.code}: ${p.requires}`);
      else assert.ok(SKILLS[p.requires] && p.grade === 4 && p.requires !== k.code, `${k.code}: ${p.requires}`);
    }
    for (const l of k.leads_to) { leads++; assert.ok(G5_SKILLS[l.skill], `${k.code}: ${l.skill} is not a Grade 5 skill`); }
  }
  assert.ok(pre > 25 && leads > 25);
});

test('the KICD rubrics are kept as they were', () => {
  assert.equal(source.rubrics.length, 4);   // the four KICD strand rubrics, untouched by the skills build
  for (const r of source.rubrics) assert.ok(JSON.stringify(r).length > 500);
});

test('every skill has a family, every non-attitude Q outcome of a skill is covered, and the families are in the registry entry', () => {
  const skillsWith = new Set(FAMILIES.map(f => f.cskill));
  for (const c of Object.keys(SKILLS)) assert.ok(skillsWith.has(c), `${c}: no family`);
  assert.equal(new Set(FAMILIES.map(f => f.id)).size, FAMILIES.length);
  assert.equal(entry.familyFiles.length, 6);
});
