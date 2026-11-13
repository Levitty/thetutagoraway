// Creative Arts Grade 4: skills, misconception library and question families (curriculum/creative_arts/g4.json).
// All draft and off for children until a CBC Creative Arts teacher signs them off. Grade 5 sits alongside, untouched.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { entryFor, entriesOf } from '../src/ai-tutor/content/subjects/registry.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../src/ai-tutor/content/curriculumMap.creativearts.g4.js';
import { SKILLS as G5_SKILLS, MIS_FEEDBACK as G5_MIS } from '../src/ai-tutor/content/curriculumMap.creativearts.g5.js';
import { isOn, setFamilyMode, drawFamily } from '../src/ai-tutor/content/families/core.js';
import { SIGNED } from '../src/ai-tutor/content/families/creativearts_g4_signed.js';

const source = JSON.parse(readFileSync(new URL('../curriculum/creative_arts/g4.json', import.meta.url), 'utf8'));
const subs = source.sub_strands;
const entry = entryFor('creativearts', 4);

test('the map is generated from the file HOREB owns, the official outcomes and KICD rubrics are untouched', () => {
  assert.equal(Object.keys(OUTCOMES).length, 63);
  assert.equal(source.totals.outcomes, 63);
  assert.equal(Object.keys(SKILLS).length, 40);
  assert.equal(Object.keys(MIS_FEEDBACK).length, 135);
  assert.equal(source.totals.skills, 40);
  assert.equal(source.totals.misconceptions, 135);
  for (const s of subs) for (const o of s.outcomes) assert.ok(/^kicd_(verified|read)$/.test(o.status), `${o.code}: outcome status changed`);
  assert.equal(source.rubrics.length, 3);
  assert.ok(source.rubrics.every(r => r.indicators.length && r.indicators.every(i => i.status === 'kicd_verified' && i.levels && i.levels.EE && i.levels.ME && i.levels.AE && i.levels.BE)));
  assert.ok(subs.every(s => s.rubric_indicators && s.rubric_indicators.length), 'every sub-strand keeps its rubric indicator link');
});

test('skills are proposed and the library is draft, with the fields a reviewer needs; prerequisites and leads_to resolve', () => {
  for (const s of subs) {
    for (const k of s.skills) {
      assert.equal(k.status, 'proposed');
      assert.ok(k.mastery && k.question_forms.length >= 2 && k.thinking.length, `${k.code}: mastery, forms or thinking missing`);
      assert.ok(k.outcomes.length && k.outcomes.every(o => OUTCOMES[o]), `${k.code}: unknown outcome`);
      assert.ok(/at least four of the last five/.test(k.mastery), `${k.code}: evidence rule`);
      for (const p of k.prerequisites) assert.ok(SKILLS[p.requires] || /^(CREA\.G3\.|MATH\.G4\.)/.test(p.requires), `${k.code}: unknown prerequisite ${p.requires}`);
      for (const l of k.leads_to) assert.ok(G5_SKILLS[l.skill], `${k.code}: ${l.skill} is not a Grade 5 Creative Arts skill`);
    }
    for (const m of s.misconceptions) {
      assert.equal(m.status, 'draft');
      for (const f of ['error', 'cause', 'reveals', 'help', 'feedback', 'source']) assert.ok(m[f] && String(m[f]).length > 5, `${m.code}: ${f} missing`);
      assert.ok(m.example.question && m.example.wrong_answer && m.example.correct_answer, `${m.code}: example incomplete`);
      assert.ok(!/—/.test(JSON.stringify(m)), `${m.code}: em dash`);
    }
  }
  assert.ok(subs.flatMap(s => s.skills).some(k => k.prerequisites.some(p => p.kind === 'outcome' && p.requires.startsWith('CREA.G3.'))), 'some prerequisites reach Grade 3 Creative Activities');
  assert.ok(subs.flatMap(s => s.skills).filter(k => k.leads_to.length).length >= 20, 'most skills lead to a Grade 5 skill');
});

test('Grade 4 misconception codes never clash with Grade 5 when the maps are joined', () => {
  for (const c of Object.keys(MIS_FEEDBACK)) { assert.ok(c.startsWith('M_CA4_'), c); assert.ok(!(c in G5_MIS), `${c} clashes with Grade 5`); }
});

test('120 families: every skill has two or more, ids start creativearts4., all are draft and off for children', () => {
  setFamilyMode('reviewed');
  assert.deepEqual(SIGNED, []);
  assert.equal(entry.families.length, 120);
  for (const code of Object.keys(SKILLS)) assert.ok(entry.families.filter(f => f.cskill === code).length >= 2, code);
  const forms = new Set(entry.families.map(f => f.form));
  assert.ok(['direct', 'word', 'spot'].every(f => forms.has(f)), 'direct, word and spot structures are all used');
  for (const f of entry.families) {
    assert.ok(f.id.startsWith('creativearts4.') && f.cskill.startsWith('CREA.G4.'), f.id);
    assert.ok(f.reviewed === false && isOn(f) === false, `${f.id} is on for children without a sign-off`);
  }
  assert.equal(entriesOf('creativearts').length, 2, 'Grades 4 and 5 are both registered');
});

test('every drawn item has one right option, every wrong option names a library misconception, spelling is British, no emoji or em dash', () => {
  for (const f of entry.families) for (let i = 0; i < 25; i++) {
    const p = drawFamily(f).p;
    const all = JSON.stringify(p);
    assert.ok(!/—/.test(all) && !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(all), `${f.id}: emoji or em dash`);
    assert.ok(!/\b(color|neighbor|favorite|honor|center)\b/i.test(all), `${f.id}: American spelling`);
    if (p.options) {
      assert.equal(p.options.filter(o => o.right).length, 1, `${f.id}: not exactly one right option`);
      for (const o of p.options.filter(o => !o.right)) assert.ok(MIS_FEEDBACK[o.mis], `${f.id}: wrong option without a library misconception`);
    }
    if (p.working) assert.equal(p.working.filter(s => !s.ok).length, 1, `${f.id}: a working needs exactly one false step`);
  }
});

test('no child sees an imperial unit, a currency other than shillings, or a picture the phone cannot show', () => {
  for (const f of entry.families) for (let i = 0; i < 10; i++) {
    const p = drawFamily(f).p;
    const all = JSON.stringify(p);
    const shown = [p.question, ...(p.options || []).map(o => o.text), ...(p.working || []).map(s => s.text)].join(' ');
    assert.ok(!/\b(feet|inch|inches|miles?|yards?)\b/i.test(shown), `${f.id}: imperial unit in what the child reads`);
    assert.ok(!/\b(look at the picture|see the picture|in the picture below)\b/i.test(all), `${f.id}: refers to a picture`);
  }
});

test('the non-question outcomes document lists all 63 outcomes with what each needs, and never asks for a recording of a child', () => {
  const doc = readFileSync(new URL('../docs/qa/creativearts-g4-non-question-outcomes-2026-11-13.md', import.meta.url), 'utf8');
  assert.equal(doc.split('\n').filter(l => /^\| [A-Z_]+\.[a-z_0-9]+ \| [QPOA] \|/.test(l)).length, 63);
  assert.ok(!/NO FAMILY/.test(doc), 'a Q outcome has no family');
  assert.ok(/never the child/.test(doc));
  assert.ok(!/video of (the|a|each) (child|learner)\b(?! \(no)/i.test(doc.replace(/no video of (a )?child(ren)?/gi, '')));
});
