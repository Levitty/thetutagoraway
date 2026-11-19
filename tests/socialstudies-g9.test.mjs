// Social Studies Grade 9: skills, misconception library and question families (curriculum/social_studies/g9.json).
// All draft and off for children until a Social Studies teacher signs them off.
// Depth pass (18 Nov 2026): the Grade 5 Maths standard checks run through tests/helpers/socialStudiesDepth.mjs at the end of this file.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../src/ai-tutor/content/curriculumMap.socialstudies.g9.js';
import entry from '../src/ai-tutor/content/subjects/socialstudies_g9.js';
import { SIGNED } from '../src/ai-tutor/content/families/socialstudies_g9_signed.js';
import { socialStudiesDepthTests } from './helpers/socialStudiesDepth.mjs';

const source = JSON.parse(readFileSync(new URL('../curriculum/social_studies/g9.json', import.meta.url), 'utf8'));
const subs = source.sub_strands;

test('the map is generated from the file HOREB owns, and the official outcomes are untouched', () => {
  assert.equal(Object.keys(OUTCOMES).length, 86);
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

test('every family is a draft, nothing is signed, and the skill codes begin SOCI.G9', () => {
  assert.equal(Object.keys(SIGNED).length, 0);
  assert.equal(entry.grade, 9);
  assert.ok(entry.families.length >= 54);
  for (const f of entry.families) assert.ok(f.id.startsWith('socialstudies9.') && f.reviewed !== true, f.id);
  for (const k of Object.keys(SKILLS)) assert.ok(k.startsWith('SOCI.G9.'), k);
});

// The Grade 5 Maths standard (depth pass, 18 Nov 2026): two or more prerequisites per skill reaching Grades 5-8, four real
// misconceptions per skill, a teaching pack for every sub-strand. The six skills added in the depth pass have families since 19 Nov 2026.
socialStudiesDepthTests({
  grade: 9, outcomes: 86,
  noFamilies: [],   // the six depth-pass skills got their families on 19 Nov 2026 (socialstudies_g9_c.js)
});
