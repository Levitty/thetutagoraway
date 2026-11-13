// Agriculture Grade 7: skills, misconception library and question families (curriculum/agriculture/g7.json).
// All draft and off for children until an Agriculture teacher signs them off.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../src/ai-tutor/content/curriculumMap.agriculture.g7.js';
import entry from '../src/ai-tutor/content/subjects/agriculture_g7.js';
import { SIGNED } from '../src/ai-tutor/content/families/agriculture_g7_signed.js';

const source = JSON.parse(readFileSync(new URL('../curriculum/agriculture/g7.json', import.meta.url), 'utf8'));
const subs = source.sub_strands;

test('the map is generated from the file HOREB owns, and the official outcomes are untouched', () => {
  assert.equal(Object.keys(OUTCOMES).length, 42);
  assert.equal(Object.keys(SKILLS).length, subs.flatMap(s => s.skills).length);
  assert.equal(Object.keys(MIS_FEEDBACK).length, subs.flatMap(s => s.misconceptions).length);
  for (const s of subs) for (const o of s.outcomes) assert.ok(/^kicd_(verified|read)$/.test(o.status), `${o.code}: outcome status changed`);
});

test('skills are proposed and misconceptions are draft', () => {
  for (const s of subs) {
    for (const k of s.skills) { assert.equal(k.status, 'proposed'); assert.ok(k.mastery && k.question_forms.length >= 2, k.code); }
    for (const m of s.misconceptions) assert.equal(m.status, 'draft');
  }
});

test('every family is a draft, nothing is signed, and the skill codes begin AGRI.G7', () => {
  assert.equal(Object.keys(SIGNED).length, 0);
  assert.equal(entry.grade, 7);
  assert.ok(entry.families.length >= 42);
  for (const f of entry.families) assert.ok(f.id.startsWith('agriculture7.') && f.reviewed !== true, f.id);
  for (const k of Object.keys(SKILLS)) assert.ok(k.startsWith('AGRI.G7.'), k);
});
