// Grade 3 Mathematics against the curriculum map HOREB owns (curriculum/mathematics/g3.json): skills, prerequisites,
// misconceptions, the question families filed under them and the teaching pack. Mapped on 18 Nov 2026 to the depth standard of
// Grades 4 to 9 (two prerequisites and four misconceptions per skill, a teaching pack for every skill). Grade 3 was mapped before
// Grade 2, so its prerequisites first named Grade 2 outcomes; once Grade 2 is mapped they name Grade 2 skills. Grade 4's
// prerequisites below Grade 4 now name these Grade 3 skills. Everything here is draft: nothing reaches a child.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FAMILIES } from '../engine/scripts/family_checks.mjs';
import { isOn, setFamilyMode } from '../src/ai-tutor/content/families/core.js';
import { SKILLS_G3, OUTCOMES_G3, SUBSTRANDS_G3, horebOf3 } from '../src/ai-tutor/content/curriculumMap.g3.js';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { buildPack, renderData, loadSources } from '../scripts/build-teaching-pack.mjs';
import { teachingFor } from '../src/voice-tutor/teachingPack.js';
import { NOFAMILY, OFF_DESIGN } from '../scripts/data/maths-g3/index.mjs';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const source = read('../curriculum/mathematics/g3.json'), g2 = read('../curriculum/mathematics/g2.json'), g4 = read('../curriculum/mathematics/g4.json');
const misLib = read('../engine/data/curriculum/g3.misconceptions.json');
const mine = FAMILIES.filter(f => f.cskill && /^MATH\.G3\./.test(f.cskill));
const skills = source.sub_strands.flatMap(s => s.skills);
const ATTITUDE = /^(appreciate)/i;
const packs = loadSources(3);
const handsOnly = (k) => k.hands_on && !(k.question_forms || []).length;
const g2skills = new Set(g2.sub_strands.flatMap(s => s.skills.map(k => k.code)));
const g2outcomes = new Set(g2.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));

test('the in-app map is generated from the file HOREB owns, whole, with every one of the 14 sub-strands mapped', () => {
  assert.equal(Object.keys(SUBSTRANDS_G3).length, 14);
  assert.equal(Object.keys(OUTCOMES_G3).length, source.sub_strands.flatMap(s => s.outcomes).length);
  assert.ok(source.sub_strands.every(s => s.skills.length), 'a sub-strand has no skills');
  assert.equal(Object.keys(SKILLS_G3).length, skills.length);
  assert.equal(Object.keys(misLib).length, source.sub_strands.flatMap(s => s.misconceptions).length);
  assert.deepEqual([source.totals.skills, source.totals.prerequisites, source.totals.misconceptions], [skills.length, skills.flatMap(k => k.prerequisites).length, Object.keys(misLib).length]);
  for (const [c, k] of Object.entries(SKILLS_G3)) {
    assert.ok(SKILLS[k.primary], `${c}: primary HOREB skill ${k.primary} does not exist`);
    assert.ok(k.outcomes.every(o => OUTCOMES_G3[o]), `${c}: unknown outcome`);
    assert.ok(horebOf3(c).includes(k.primary));
    for (const p of k.pre) assert.ok(SKILLS_G3[p] || g2skills.has(p), `${c}: unknown prerequisite ${p}`);
  }
});

test('official outcomes are untouched and every testable one has a skill', () => {
  const left = [];
  for (const s of source.sub_strands) {
    const covered = new Set(s.skills.flatMap(k => k.outcomes));
    for (const o of s.outcomes) { assert.match(o.status, /^kicd_(verified|read)$/); if (!covered.has(o.code) && !ATTITUDE.test(o.text)) left.push(o.code); }
  }
  assert.deepEqual(left, []);
});

test('every skill has a mastery rule, question forms (unless hands-on only), at least two prerequisites and four misconceptions', () => {
  let down = 0;
  for (const s of source.sub_strands) for (const k of s.skills) {
    assert.ok(k.mastery.length > 60 && (handsOnly(k) || k.question_forms.length >= 3), `${k.code}: thin`);
    assert.ok(k.prerequisites.length >= 2 && k.prerequisites.every(p => p.status === 'proposed' && p.reason.length > 10), `${k.code}: prerequisites`);
    assert.equal(new Set(k.prerequisites.map(p => p.requires)).size, k.prerequisites.length, `${k.code}: a prerequisite twice`);
    assert.ok(s.misconceptions.filter(m => m.skill === k.code).length >= 4, `${k.code}: fewer than four misconceptions`);
    assert.equal(k.status, 'proposed');
    if (k.prerequisites.some(p => p.requires.startsWith('MATH.G2.'))) down++;
  }
  assert.ok(down >= source.totals.skills * 0.4, `only ${down} skills reach down to Grade 2`);
});

test('prerequisites name a Grade 2 skill or outcome, or a Grade 3 skill, that exists, and never loop', () => {
  const own = new Set(skills.map(k => k.code));
  for (const k of skills) for (const r of k.prerequisites) {
    assert.ok(r.kind === 'outcome' ? g2outcomes.has(r.requires) : own.has(r.requires) || g2skills.has(r.requires), `${k.code}: unknown prerequisite ${r.requires}`);
    assert.ok(['essential', 'helpful'].includes(r.strength) && r.reason, `${k.code}: prerequisite needs a strength and a reason`);
  }
  // once Grade 2 has skills, no Grade 2 outcome is left as a prerequisite
  if (g2skills.size) assert.deepEqual(skills.flatMap(k => k.prerequisites.filter(p => p.kind === 'outcome').map(p => `${k.code} > ${p.requires}`)), []);
  const state = {};
  const visit = (c, path) => { if (state[c] === 2) return; assert.notEqual(state[c], 1, `prerequisite loop: ${[...path, c].join(' > ')}`); state[c] = 1; for (const r of skills.find(k => k.code === c).prerequisites) if (own.has(r.requires)) visit(r.requires, [...path, c]); state[c] = 2; };
  for (const k of skills) visit(k.code, []);
});

test('Grade 4 now builds on Grade 3 skills: no Grade 3 outcome is left among its prerequisites', () => {
  const own = new Set(skills.map(k => k.code));
  const g4pre = g4.sub_strands.flatMap(s => s.skills.flatMap(k => k.prerequisites));
  assert.deepEqual(g4pre.filter(p => p.kind === 'outcome').map(p => p.requires), []);
  const named = g4pre.filter(p => p.requires.startsWith('MATH.G3.'));
  assert.ok(named.length >= 60 && named.every(p => own.has(p.requires)), 'a Grade 4 prerequisite names a Grade 3 skill that does not exist');
});

test('every misconception has all its fields, a source line, its own example, and is a draft', () => {
  for (const [code, m] of Object.entries(misLib)) {
    assert.ok(m.example?.question && m.example?.wrong_answer && m.example?.correct_answer, `${code}: example`);
    assert.notEqual(String(m.example.wrong_answer), String(m.example.correct_answer), `${code}: the wrong answer is the right one`);
    assert.ok(m.error && m.cause && m.reveals && m.help, `${code}: missing field`);
    assert.ok(m.source === 'to confirm by a teacher' || /^widely reported in maths-education research/.test(m.source), `${code}: source`);
    assert.equal(m.status, 'draft');
  }
});

test('11 of the 14 older Grade 3 families carry their curriculum skill, its official outcome and a HOREB skill the map names', () => {
  assert.equal(mine.length, 11, `${mine.length} Grade 3 families are filed under the curriculum map`);
  for (const f of mine) {
    const k = SKILLS_G3[f.cskill];
    assert.ok(k, `${f.id}: unknown cskill`);
    assert.ok(k.outcomes.includes(f.outcome), `${f.id}: outcome ${f.outcome} is not an outcome of ${f.cskill}`);
    assert.ok(horebOf3(f.cskill).includes(f.skill), `${f.id}: ${f.skill} not mapped to ${f.cskill}`);
    assert.ok(!k.hands, `${f.id}: ${f.cskill} is hands-on only`);
    for (const c of f.reveals || []) assert.ok(Object.keys(misLib).some(k2 => k2.endsWith(`.${c}`)), `${f.id}: reveals unknown ${c}`);
  }
  // the three left on HOREB's old outcome test content outside the Grade 3 design (centimetres, weeks, pentagons): see OFF_DESIGN
  assert.deepEqual(FAMILIES.filter(f => /^G3\./.test(f.outcome || '')).map(f => f.id).sort(), Object.keys(OFF_DESIGN).sort());
});

test('most linked Grade 3 families tie each wrong answer to a misconception; the choice families are tied at family level', () => {
  const perOption = mine.filter(f => f.misMapped !== false), familyLevel = mine.filter(f => f.misMapped === false);
  assert.equal(perOption.length, 8);
  assert.ok(familyLevel.every(f => Array.isArray(f.reveals) && f.reveals.length), 'a family-level family names no misconception');
});

test('the skills with no question family yet are exactly the listed ones (new families shorten the list)', () => {
  const has = new Set(mine.map(f => f.cskill));
  const none = Object.entries(SKILLS_G3).filter(([c, k]) => !k.hands && !has.has(c)).map(([c]) => c.replace('MATH.G3.', ''));
  assert.deepEqual(none.sort(), [...NOFAMILY].sort());
  assert.deepEqual(Object.entries(SKILLS_G3).filter(([, k]) => k.hands).map(([c]) => c.replace('MATH.G3.', '')).sort(), ['GEOMET.SHAPES.DRAW_COMBINED', 'GEOMET.SHAPES.MODEL_COMBINED'], 'drawing and modelling combined shapes stay with the teacher');
});

test('Grade 3 families stay off for children until a teacher signs them off', () => {
  setFamilyMode('reviewed');
  for (const f of mine.filter(x => !x.core)) assert.ok(f.reviewed === true ? isOn(f) : !isOn(f), `${f.id} is on for children without a sign-off`);
});

test('the Grade 3 teaching pack has a file for every sub-strand and covers every skill and library misconception', () => {
  assert.equal(packs.length, 14, 'every Grade 3 sub-strand has its teaching pack file');
  const packed = new Set(packs.flatMap(s => s.skills.flatMap(e => e.misconceptions.map(m => m.code))));
  for (const s of source.sub_strands) {
    for (const k of s.skills) assert.ok(teachingFor(k.code), `no pack entry for ${k.code}`);
    for (const m of s.misconceptions) assert.ok(packed.has(m.code), `no reveal question and repair for ${m.code}`);
  }
  for (const p of packs) for (const e of p.skills) assert.ok(SKILLS_G3[e.skill], `pack entry for unknown skill ${e.skill}`);
});

test('the generated Grade 3 teaching pack matches the JSON (run node scripts/build-teaching-pack.mjs)', () => {
  const onDisk = readFileSync(new URL('../src/voice-tutor/teachingPackData.g3.js', import.meta.url), 'utf8');
  assert.equal(onDisk, renderData(buildPack(3), 3), 'teachingPackData.g3.js is stale');
});

test('the Grade 3 SQL loads every skill, prerequisite and misconception of the map (run node scripts/build-maths-sql-grade.mjs 3)', () => {
  const sql = readFileSync(new URL('../supabase/migrations/20261124_maths_g3_skills_misconceptions.sql', import.meta.url), 'utf8');
  const count = (re) => (sql.match(re) || []).length;
  assert.equal(count(/^INSERT INTO public\.curriculum_skills /gm), source.totals.skills);
  assert.equal(count(/^INSERT INTO public\.curriculum_prerequisites /gm), source.totals.prerequisites);
  assert.equal(count(/^INSERT INTO public\.curriculum_misconceptions /gm), source.totals.misconceptions);
  assert.ok(/^BEGIN;$/m.test(sql) && /^COMMIT;$/m.test(sql) && /ON CONFLICT \(code\) DO UPDATE/.test(sql), 'not one idempotent transaction');
});
