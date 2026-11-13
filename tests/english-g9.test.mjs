// English Grade 9: skills, misconception library and question families (curriculum/english/g9.json).
// All draft and off for children until a Kenyan English teacher signs them off.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../src/ai-tutor/content/curriculumMap.english.g9.js';
import entry from '../src/ai-tutor/content/subjects/english_g9.js';
import { SIGNED } from '../src/ai-tutor/content/families/english_g9_signed.js';

const source = JSON.parse(readFileSync(new URL('../curriculum/english/g9.json', import.meta.url), 'utf8'));
const subs = source.sub_strands;

test('the map is generated from the file HOREB owns, and the official outcomes are untouched', () => {
  assert.equal(Object.keys(OUTCOMES).length, 251);
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

test('every family is a draft, nothing is signed, and the skill codes begin ENGL.G9', () => {
  assert.equal(Object.keys(SIGNED).length, 0);
  assert.equal(entry.grade, 9);
  assert.ok(entry.families.length >= 66);
  for (const f of entry.families) assert.ok(f.id.startsWith('english9.') && f.reviewed !== true, f.id);
  for (const k of Object.keys(SKILLS)) assert.ok(k.startsWith('ENGL.G9.'), k);
});
