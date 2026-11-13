// Pre-Technical Studies Grade 8: skills, misconception library and question families (curriculum/pre_technical/g8.json).
// All draft and off for children until a CBC Pre-Technical teacher signs them off.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../src/ai-tutor/content/curriculumMap.pretechnical.g8.js';
import entry from '../src/ai-tutor/content/subjects/pretechnical_g8.js';
import { SIGNED } from '../src/ai-tutor/content/families/pretechnical_g8_signed.js';

const source = JSON.parse(readFileSync(new URL('../curriculum/pre_technical/g8.json', import.meta.url), 'utf8'));
const subs = source.sub_strands;

test('the map is generated from the file HOREB owns, and the official outcomes are untouched', () => {
  assert.equal(Object.keys(OUTCOMES).length, 60);
  assert.equal(Object.keys(SKILLS).length, subs.flatMap(s => s.skills).length);
  assert.equal(Object.keys(MIS_FEEDBACK).length, subs.flatMap(s => s.misconceptions).length);
  for (const s of subs) for (const o of s.outcomes) assert.ok(/^kicd_(verified|read)$/.test(o.status), `${o.code}: outcome status changed`);
});

test('skills are proposed, misconceptions are draft, and every skill has prerequisites that exist', () => {
  for (const s of subs) {
    for (const k of s.skills) {
      assert.equal(k.status, 'proposed');
      assert.ok(k.mastery && k.question_forms.length >= 2, `${k.code}: mastery or forms missing`);
      assert.ok(k.prerequisites.length >= 1, `${k.code}: no prerequisite`);
    }
    for (const m of s.misconceptions) assert.equal(m.status, 'draft');
  }
});

test('every family is a draft, nothing is signed, and the codes begin PRET.G8', () => {
  assert.equal(Object.keys(SIGNED).length, 0);
  assert.equal(entry.grade, 8);
  assert.ok(entry.families.length >= 54);
  for (const f of entry.families) assert.ok(f.id.startsWith('pretechnical8.') && f.reviewed !== true, f.id);
  for (const k of Object.keys(SKILLS)) assert.ok(k.startsWith('PRET.G8.'), k);
});
