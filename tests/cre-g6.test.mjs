// CRE Grade 6: skills, misconception library and question families (curriculum/cre/g6.json).
// All draft and off for children until a CRE teacher signs them off.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../src/ai-tutor/content/curriculumMap.cre.g6.js';
import entry from '../src/ai-tutor/content/subjects/cre_g6.js';
import { SIGNED } from '../src/ai-tutor/content/families/cre_g6_signed.js';
import { isOn, setFamilyMode, drawFamily } from '../src/ai-tutor/content/families/core.js';
import { creDepthTests } from './helpers/creDepth.mjs';

const source = JSON.parse(readFileSync(new URL('../curriculum/cre/g6.json', import.meta.url), 'utf8'));
const subs = source.sub_strands;

test('the map is generated from the file HOREB owns, the official outcomes and KICD rubrics are untouched', () => {
  assert.equal(Object.keys(OUTCOMES).length, 84);
  assert.equal(Object.keys(SKILLS).length, 29);
  assert.equal(Object.keys(MIS_FEEDBACK).length, 117);
  assert.deepEqual([source.totals.skills, source.totals.prerequisites, source.totals.misconceptions], [29, 78, 117]);
  for (const s of subs) for (const o of s.outcomes) assert.ok(/^kicd_(verified|read)$/.test(o.status), `${o.code}: outcome status changed`);
  assert.ok(source.rubrics.length && source.rubrics.every(r => r.indicators.length));
});

test('every family is a draft and off for children, nothing is signed, and the skill codes begin CRES.G6', () => {
  setFamilyMode('reviewed');
  assert.deepEqual(SIGNED, []);
  assert.equal(entry.grade, 6);
  for (const f of entry.families) assert.ok(f.id.startsWith('cre6.') && f.reviewed !== true && isOn(f) === false, f.id);
  for (const k of Object.keys(SKILLS)) assert.ok(k.startsWith('CRES.G6.'), k);
});

test('no Islamic or Hindu religious education is loaded, and the text has no emoji or em dash', () => {
  const all = JSON.stringify(entry.families.map(f => drawFamily(f).p)) + JSON.stringify(subs.map(s => [s.skills, s.misconceptions]));
  assert.ok(!/\b(Quran|Allah|Muhammad|Hindu|Krishna|Vishnu|mosque)\b/i.test(all));
  assert.ok(!/—/.test(all) && !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(all));
});

// The Grade 5 Maths standard (18 Nov 2026): two prerequisites and four misconceptions per skill, a teaching pack, the SQL.
await creDepthTests({ grade: 6, outcomes: 84 });
