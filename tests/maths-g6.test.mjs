// Grade 6 Mathematics against the curriculum map HOREB owns (curriculum/mathematics/g6.json).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FAMILIES } from '../engine/scripts/family_checks.mjs';
import { drawFamily, isOn, setFamilyMode } from '../src/ai-tutor/content/families/core.js';
import { SKILLS_G6, OUTCOMES_G6, SUBSTRANDS_G6, horebOf6 } from '../src/ai-tutor/content/curriculumMap.g6.js';
import { SKILLS_G5 } from '../src/ai-tutor/content/curriculumMap.g5.js';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { formText, clusterForms } from '../engine/scripts/content_measures.mjs';

const source = JSON.parse(readFileSync(new URL('../curriculum/mathematics/g6.json', import.meta.url), 'utf8'));
const lib = JSON.parse(readFileSync(new URL('../engine/data/curriculum/g6.misconceptions.json', import.meta.url), 'utf8'));
const mine = FAMILIES.filter(f => /^MATH\.G6\./.test(f.cskill || ''));
const ATTITUDE = /^appreciate/;

test('the in-app map is generated from the file HOREB owns, whole', () => {
  assert.equal(Object.keys(SUBSTRANDS_G6).length, source.sub_strands.length);
  assert.equal(Object.keys(OUTCOMES_G6).length, 97);
  assert.equal(Object.keys(SKILLS_G6).length, source.totals.skills);
  assert.equal(Object.keys(lib).length, source.totals.misconceptions);
  for (const [c, k] of Object.entries(SKILLS_G6)) {
    assert.ok(SKILLS[k.primary], `${c}: HOREB skill ${k.primary} does not exist`);
    assert.ok(k.outcomes.every(o => OUTCOMES_G6[o]), `${c}: unknown outcome`);
    assert.ok(horebOf6(c).includes(k.primary));
    for (const p of k.pre) assert.ok(SKILLS_G6[p] || SKILLS_G5[p], `${c}: unknown prerequisite ${p}`);
  }
});

test('every testable official outcome has a skill; only attitude outcomes are left out', () => {
  const covered = new Set(Object.values(SKILLS_G6).flatMap(k => k.outcomes));
  const left = source.sub_strands.flatMap(s => s.outcomes).filter(o => !covered.has(o.code));
  assert.ok(left.length > 0 && left.every(o => ATTITUDE.test(o.text)), `outcomes with no skill that are not attitude: ${left.filter(o => !ATTITUDE.test(o.text)).map(o => o.code)}`);
  assert.equal(left.length, 16);
});

test('every skill has a mastery rule, question forms, prerequisites to Grade 5, and at least two misconceptions', () => {
  for (const s of source.sub_strands) for (const k of s.skills) {
    assert.ok(k.mastery.length > 40 && k.question_forms.length >= 2, `${k.code}: thin`);
    assert.ok(k.prerequisites.length >= 1, `${k.code}: no prerequisite`);
    assert.ok(s.misconceptions.filter(m => m.skill === k.code).length >= 2, `${k.code}: fewer than 2 misconceptions`);
  }
  const g5 = Object.values(SKILLS_G6).filter(k => k.pre.some(p => SKILLS_G5[p]));
  assert.ok(g5.length >= 60, 'skills reach down to Grade 5 skills');
});

test('every misconception names a source or says it is to be confirmed by a teacher, and is a draft', () => {
  for (const m of Object.values(lib)) {
    assert.ok(/to be confirmed by a teacher|to confirm by a teacher|^widely reported|literature/i.test(m.source), `${m.error.slice(0, 40)}: no source line`);
    assert.equal(m.status, 'draft');
    assert.ok(m.example.question && m.example.wrong_answer && m.example.correct_answer && m.cause && m.reveals && m.help && m.error);
  }
});

test('every skill has at least two families that differ in structure', () => {
  setFamilyMode('all');
  const thin = [];
  for (const code of Object.keys(SKILLS_G6)) {
    const fams = mine.filter(f => f.cskill === code);
    const texts = fams.flatMap(f => Array.from({ length: 10 }, () => formText(drawFamily(f).p)));
    if (fams.length < 2 || clusterForms(texts).length < 2) thin.push(`${code} (${fams.length} families)`);
  }
  setFamilyMode('reviewed');
  assert.deepEqual(thin, []);
});

test('a family carries its curriculum skill, an official outcome of that skill, and a HOREB skill the map names', () => {
  assert.ok(mine.length >= 180, `only ${mine.length} Grade 6 families are filed under the curriculum map`);
  for (const f of mine) {
    const k = SKILLS_G6[f.cskill];
    assert.ok(k, `${f.id}: unknown cskill`);
    assert.ok(k.outcomes.includes(f.outcome), `${f.id}: outcome ${f.outcome} is not an outcome of ${f.cskill}`);
    assert.ok(horebOf6(f.cskill).includes(f.skill), `${f.id}: ${f.skill} not mapped to ${f.cskill}`);
    for (const c of f.reveals || []) assert.ok(Object.keys(lib).some(k2 => k2.endsWith(`.${c}`)), `${f.id}: reveals unknown ${c}`);
  }
});

test('the new families tie every wrong answer to a library misconception; the older ones are tied at family level', () => {
  const fresh = mine.filter(f => f.id.startsWith('g6d.'));
  assert.equal(fresh.length, 57);
  assert.ok(fresh.every(f => f.misMapped !== false && f.draft === true));
  const older = mine.filter(f => !f.id.startsWith('g6d.'));
  assert.ok(older.every(f => f.misMapped === false && Array.isArray(f.reveals)), 'older families carry reveals');
  assert.ok(older.filter(f => f.reveals.length).length >= 100);
});

test('Grade 6 families stay off for children until a teacher signs them off', () => {
  setFamilyMode('reviewed');
  for (const f of mine.filter(x => !x.core)) assert.ok(f.reviewed === true ? isOn(f) : !isOn(f), `${f.id} is on for children without a sign-off`);
  assert.equal(mine.filter(f => f.reviewed === true).length, 0, 'no Grade 6 family is signed yet');
});
