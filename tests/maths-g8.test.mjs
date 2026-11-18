// Grade 8 Mathematics against the curriculum map HOREB owns (curriculum/mathematics/g8.json): skills, prerequisites,
// misconceptions, the question families filed under them and the teaching pack (mapped 18 Nov 2026 to the depth standard
// of Grades 6 and 7). Everything here is draft: a family nobody has signed off reaches no child.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FAMILIES } from '../engine/scripts/family_checks.mjs';
import { isOn, setFamilyMode } from '../src/ai-tutor/content/families/core.js';
import { SKILLS_G8, OUTCOMES_G8, SUBSTRANDS_G8, horebOf8 } from '../src/ai-tutor/content/curriculumMap.g8.js';
import { SKILLS_G7 } from '../src/ai-tutor/content/curriculumMap.g7.js';
import { SKILLS_G6 } from '../src/ai-tutor/content/curriculumMap.g6.js';
import { SKILLS_G5 } from '../src/ai-tutor/content/curriculumMap.g5.js';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { buildPack, renderData, loadSources } from '../scripts/build-teaching-pack.mjs';
import { teachingFor } from '../src/voice-tutor/teachingPack.js';

const source = JSON.parse(readFileSync(new URL('../curriculum/mathematics/g8.json', import.meta.url), 'utf8'));
const lib = JSON.parse(readFileSync(new URL('../engine/data/curriculum/g8.misconceptions.json', import.meta.url), 'utf8'));
const mine = FAMILIES.filter(f => /^MATH\.G8\./.test(f.cskill || ''));
const NOT_TESTED = /^(appreciate|reflect on|promote use|promote the use|recogni[sz]e use|recogni[sz]e the use|use IT|enjoy using|spend money responsibly|admire)/i;
const packs = loadSources(8);

test('the in-app map is generated from the file HOREB owns, whole, with every one of the 16 sub-strands mapped', () => {
  assert.equal(Object.keys(SUBSTRANDS_G8).length, 16);
  assert.equal(Object.keys(OUTCOMES_G8).length, 121);
  assert.ok(source.sub_strands.every(s => s.skills.length), 'a sub-strand has no skills');
  assert.equal(Object.keys(SKILLS_G8).length, source.totals.skills);
  assert.equal(Object.keys(lib).length, source.totals.misconceptions);
  assert.ok(source.totals.skills >= 100, `only ${source.totals.skills} skills`);
  for (const [c, k] of Object.entries(SKILLS_G8)) {
    assert.ok(SKILLS[k.primary], `${c}: HOREB skill ${k.primary} does not exist`);
    assert.ok(k.outcomes.every(o => OUTCOMES_G8[o]), `${c}: unknown outcome`);
    assert.ok(horebOf8(c).includes(k.primary));
    for (const p of k.pre) assert.ok(SKILLS_G8[p] || SKILLS_G7[p] || SKILLS_G6[p] || SKILLS_G5[p], `${c}: unknown prerequisite ${p}`);
  }
});

test('every testable official outcome has a skill; only IT and attitude outcomes are left out', () => {
  for (const s of source.sub_strands) {
    const covered = new Set(s.skills.flatMap(k => k.outcomes));
    const left = s.outcomes.filter(o => !covered.has(o.code) && !NOT_TESTED.test(o.text));
    assert.deepEqual(left.map(o => o.code), [], `${s.code}: outcomes with no skill`);
  }
});

test('every skill has a mastery rule, question forms, at least two prerequisites and four misconceptions', () => {
  let down = 0;
  for (const s of source.sub_strands) for (const k of s.skills) {
    assert.ok(k.mastery.length > 60 && k.question_forms.length >= 3, `${k.code}: thin`);
    assert.ok(k.prerequisites.length >= 2 && k.prerequisites.every(p => p.status === 'proposed' && p.reason.length > 10), `${k.code}: prerequisites`);
    assert.equal(new Set(k.prerequisites.map(p => p.requires)).size, k.prerequisites.length, `${k.code}: a prerequisite twice`);
    const ms = s.misconceptions.filter(m => m.skill === k.code);
    assert.ok(ms.length >= 4, `${k.code}: only ${ms.length} misconceptions`);
    assert.equal(k.status, 'proposed');
    if (k.prerequisites.some(p => /^MATH\.G[567]\./.test(p.requires))) down++;
  }
  assert.ok(down >= source.totals.skills * 0.6, 'most skills reach down to Grade 5, 6 or 7');
});

test('every misconception has all its fields, a source line, its own example, and is a draft', () => {
  for (const [code, m] of Object.entries(lib)) {
    assert.ok(/to be confirmed by a teacher|to confirm by a teacher|^widely reported|literature/i.test(m.source), `${code}: no source line`);
    assert.equal(m.status, 'draft');
    assert.ok(m.example.question && m.example.wrong_answer && m.example.correct_answer && m.cause && m.reveals && m.help && m.error, `${code}: a field is empty`);
    assert.notEqual(m.example.wrong_answer, m.example.correct_answer, `${code}: the wrong answer is the right one`);
  }
});

test('all 178 Grade 8 families carry a curriculum skill, an official outcome of that skill, and a HOREB skill the map names', () => {
  assert.equal(mine.length, 178, `${mine.length} Grade 8 families are filed under the curriculum map`);
  for (const f of mine) {
    const k = SKILLS_G8[f.cskill];
    assert.ok(k, `${f.id}: unknown cskill ${f.cskill}`);
    assert.ok(k.outcomes.includes(f.outcome), `${f.id}: outcome ${f.outcome} is not an outcome of ${f.cskill}`);
    assert.ok(horebOf8(f.cskill).includes(f.skill), `${f.id}: HOREB skill ${f.skill} is not mapped to ${f.cskill}`);
    for (const c of f.reveals || []) assert.ok(Object.keys(lib).some(k2 => k2.endsWith(`.${c}`)), `${f.id}: reveals unknown ${c}`);
  }
  assert.deepEqual(FAMILIES.filter(f => /^G8\./.test(f.outcome || '')).map(f => f.id), [], 'a family is left on an old Grade 8 outcome code');
});

test('most Grade 8 families tie each wrong answer to a misconception; the rest are tied at family level', () => {
  const perOption = mine.filter(f => f.misMapped !== false);
  const familyLevel = mine.filter(f => f.misMapped === false);
  assert.ok(perOption.length >= 130, `only ${perOption.length} families tie wrong answers one by one`);
  assert.ok(familyLevel.every(f => Array.isArray(f.reveals) && f.reveals.length), 'a family-level family names no misconception');
});

test('Grade 8 families stay off for children until a teacher signs them off', () => {
  setFamilyMode('reviewed');
  for (const f of mine.filter(x => !x.core)) assert.ok(f.reviewed === true ? isOn(f) : !isOn(f), `${f.id} is on for children without a sign-off`);
  assert.equal(mine.filter(f => f.reviewed === true).length, 0, 'no Grade 8 family is signed yet');
});

test('the Grade 8 teaching pack has a file for every sub-strand and covers every skill and library misconception', () => {
  assert.equal(packs.length, 16, 'every Grade 8 sub-strand has its teaching pack file');
  const packed = new Set(packs.flatMap(s => s.skills.flatMap(e => e.misconceptions.map(m => m.code))));
  for (const s of source.sub_strands) {
    for (const k of s.skills) assert.ok(teachingFor(k.code), `no pack entry for ${k.code}`);
    for (const m of s.misconceptions) assert.ok(packed.has(m.code), `no reveal question and repair for ${m.code}`);
  }
  for (const p of packs) for (const e of p.skills) assert.ok(SKILLS_G8[e.skill], `pack entry for unknown skill ${e.skill}`);
});

test('the generated Grade 8 teaching pack matches the JSON (run node scripts/build-teaching-pack.mjs)', () => {
  const onDisk = readFileSync(new URL('../src/voice-tutor/teachingPackData.g8.js', import.meta.url), 'utf8');
  assert.equal(onDisk, renderData(buildPack(8), 8), 'teachingPackData.g8.js is stale');
});

test('the Grade 8 SQL loads every skill, prerequisite and misconception of the map (run node scripts/build-maths-sql-grade.mjs 8)', () => {
  const sql = readFileSync(new URL('../supabase/migrations/20261121_maths_g8_skills_misconceptions.sql', import.meta.url), 'utf8');
  const count = (re) => (sql.match(re) || []).length;
  assert.equal(count(/^INSERT INTO public\.curriculum_skills /gm), source.totals.skills);
  assert.equal(count(/^INSERT INTO public\.curriculum_prerequisites /gm), source.totals.prerequisites);
  assert.equal(count(/^INSERT INTO public\.curriculum_misconceptions /gm), source.totals.misconceptions);
  assert.ok(/^BEGIN;$/m.test(sql) && /^COMMIT;$/m.test(sql) && /ON CONFLICT \(code\) DO UPDATE/.test(sql), 'not one idempotent transaction');
});
