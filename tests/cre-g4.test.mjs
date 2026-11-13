// Christian Religious Education Grade 4: skills, misconception library and question families (curriculum/cre/g4.json).
// All draft and off for children until a CRE teacher signs them off. Grade 5 has its own counts elsewhere; this file adds Grade 4 alongside.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { entryFor, entriesOf } from '../src/ai-tutor/content/subjects/registry.js';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../src/ai-tutor/content/curriculumMap.cre.g4.js';
import { MIS_FEEDBACK as G5_MIS } from '../src/ai-tutor/content/curriculumMap.cre.g5.js';
import { isOn, setFamilyMode, drawFamily } from '../src/ai-tutor/content/families/core.js';
import { SIGNED } from '../src/ai-tutor/content/families/cre_g4_signed.js';

const source = JSON.parse(readFileSync(new URL('../curriculum/cre/g4.json', import.meta.url), 'utf8'));
const subs = source.sub_strands;
const entry = entryFor('cre', 4);

test('the map is generated from the file HOREB owns, the official outcomes and KICD rubrics are untouched', () => {
  assert.equal(Object.keys(OUTCOMES).length, 158);
  assert.equal(source.totals.outcomes, 158);
  assert.equal(Object.keys(SKILLS).length, 39);
  assert.equal(Object.keys(MIS_FEEDBACK).length, 118);
  assert.equal(source.totals.skills, 39);
  assert.equal(source.totals.misconceptions, 118);
  for (const s of subs) for (const o of s.outcomes) assert.ok(/^kicd_(verified|read)$/.test(o.status), `${o.code}: outcome status changed`);
  assert.equal(source.rubrics.length, 6);
  assert.ok(source.rubrics.every(r => r.indicators.length && r.indicators.every(i => i.levels && i.levels.EE && i.levels.BE)));
});

test('skills are proposed and the library is draft, with the fields a reviewer needs; prerequisites resolve', () => {
  for (const s of subs) {
    for (const k of s.skills) {
      assert.equal(k.status, 'proposed');
      assert.ok(k.mastery && k.question_forms.length >= 2 && k.thinking.length, `${k.code}: mastery, forms or thinking missing`);
      assert.ok(k.outcomes.length && k.outcomes.every(o => OUTCOMES[o]), `${k.code}: unknown outcome`);
      assert.ok(/at least four of the last five/.test(k.mastery), `${k.code}: evidence rule`);
      for (const p of k.prerequisites) assert.ok(SKILLS[p.requires] || /^CRE\.G[23]\./.test(p.requires), `${k.code}: unknown prerequisite ${p.requires}`);
    }
    for (const m of s.misconceptions) {
      assert.equal(m.status, 'draft');
      for (const f of ['error', 'cause', 'reveals', 'help', 'feedback', 'source']) assert.ok(m[f] && String(m[f]).length > 5, `${m.code}: ${f} missing`);
    }
  }
});

test('Grade 4 misconception codes never clash with Grade 5 when the maps are joined', () => {
  for (const c of Object.keys(MIS_FEEDBACK)) { assert.ok(c.startsWith('M_C4_'), c); assert.ok(!(c in G5_MIS), `${c} clashes with Grade 5`); }
});

test('78 families: every skill has two or more, ids start cre4., all are draft and off for children', () => {
  setFamilyMode('reviewed');
  assert.deepEqual(SIGNED, []);
  assert.equal(entry.families.length, 78);
  for (const code of Object.keys(SKILLS)) assert.ok(entry.families.filter(f => f.cskill === code).length >= 2, code);
  for (const f of entry.families) {
    assert.ok(f.id.startsWith('cre4.') && f.cskill.startsWith('CRES.G4.'), f.id);
    assert.ok(f.reviewed === false && isOn(f) === false, `${f.id} is on for children without a sign-off`);
  }
  assert.ok(entriesOf('cre').length >= 2, 'Grades 4 and 5 are both registered (later grades may be added)');
});

test('every wrong option names a library misconception and the text is British, with no emoji or em dash', () => {
  for (const f of entry.families) for (let i = 0; i < 25; i++) {
    const p = drawFamily(f).p;
    const all = JSON.stringify(p);
    assert.ok(!/—/.test(all) && !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(all), `${f.id}: emoji or em dash`);
    assert.ok(!/\b(color|neighbor|favorite|honor)\b/i.test(all), `${f.id}: American spelling`);
  }
});

test('no Islamic or Hindu religious education is loaded', () => {
  const all = JSON.stringify(entry.families.map(f => drawFamily(f).p));
  assert.ok(!/\b(Quran|Allah|Muhammad|Hindu|Krishna|Vishnu|mosque)\b/i.test(all));
  assert.ok(!/\b(Quran|Allah|Hindu)\b/i.test(JSON.stringify(source.sub_strands.map(s => s.skills))));
});
