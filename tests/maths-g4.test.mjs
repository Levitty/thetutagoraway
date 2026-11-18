// Grade 4 Mathematics against the curriculum map HOREB owns (curriculum/mathematics/g4.json): skills, prerequisites,
// misconceptions, the question families filed under them and the teaching pack. First pass 12 Nov 2026; taken on 18 Nov 2026 to
// the depth standard of Grades 5 to 9 (two prerequisites and four misconceptions per skill, a teaching pack). Grade 3 has no
// skills yet, so prerequisites below Grade 4 are Grade 3 outcomes. Everything here is draft: nothing reaches a child.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FAMILIES } from '../engine/scripts/family_checks.mjs';
import { isOn, setFamilyMode } from '../src/ai-tutor/content/families/core.js';
import { SKILLS_G4, OUTCOMES_G4, SUBSTRANDS_G4, horebOf4 } from '../src/ai-tutor/content/curriculumMap.g4.js';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { OUTCOMES } from '../src/ai-tutor/curriculum/outcomes.js';
import { LETTERS, SUB_OF, TEXT_FIXES } from '../scripts/data/maths-g4-letters.mjs';
import { buildPack, renderData, loadSources } from '../scripts/build-teaching-pack.mjs';
import { teachingFor } from '../src/voice-tutor/teachingPack.js';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const source = read('../curriculum/mathematics/g4.json'), g3 = read('../curriculum/mathematics/g3.json');
const misLib = read('../engine/data/curriculum/g4.misconceptions.json');
const mine = FAMILIES.filter(f => f.cskill && /^MATH\.G4\./.test(f.cskill));
const skills = source.sub_strands.flatMap(s => s.skills);
const ATTITUDE = /^(appreciate|use digital|use it )/i;
const packs = loadSources(4);
// a skill done only with real objects in class (drawing, shape patterns, collecting data): no typed question can test it
const handsOnly = (k) => k.hands_on && !(k.question_forms || []).length;

test('the in-app map is generated from the file HOREB owns, whole, with every one of the 19 sub-strands mapped', () => {
  assert.equal(Object.keys(SUBSTRANDS_G4).length, 19);
  assert.equal(Object.keys(OUTCOMES_G4).length, source.sub_strands.flatMap(s => s.outcomes).length);
  assert.ok(source.sub_strands.every(s => s.skills.length), 'a sub-strand has no skills');
  assert.equal(Object.keys(SKILLS_G4).length, skills.length);
  assert.equal(Object.keys(misLib).length, source.sub_strands.flatMap(s => s.misconceptions).length);
  assert.deepEqual([source.totals.skills, source.totals.prerequisites, source.totals.misconceptions], [skills.length, skills.flatMap(k => k.prerequisites).length, Object.keys(misLib).length]);
  for (const [c, k] of Object.entries(SKILLS_G4)) {
    assert.ok(SKILLS[k.primary], `${c}: primary HOREB skill ${k.primary} does not exist`);
    assert.ok(k.outcomes.every(o => OUTCOMES_G4[o]), `${c}: unknown outcome`);
    assert.ok(horebOf4(c).includes(k.primary));
    for (const p of k.pre) assert.ok(SKILLS_G4[p], `${c}: unknown prerequisite ${p}`);
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
    const ms = s.misconceptions.filter(m => m.skill === k.code);
    assert.ok(ms.length >= 4, `${k.code}: only ${ms.length} misconceptions`);
    // a misconception the blind review of 13 Nov 2026 marked doubtful (a trap option, not a known error) does not count toward the four
    assert.ok(ms.filter(m => misLib[m.code]?.review?.mark !== 'doubtful').length >= 4, `${k.code}: fewer than four misconceptions that are not doubtful`);
    assert.equal(k.status, 'proposed');
    if (k.prerequisites.some(p => p.kind === 'outcome')) down++;
  }
  assert.ok(down >= source.totals.skills * 0.7, `only ${down} skills reach down to Grade 3`);
});

test('prerequisites name a Grade 3 outcome or a Grade 4 skill that exists, and never loop', () => {
  const g3codes = new Set(g3.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
  const own = new Set(skills.map(k => k.code));
  for (const k of skills) {
    for (const r of k.prerequisites) {
      assert.ok(r.kind === 'outcome' ? g3codes.has(r.requires) : own.has(r.requires), `${k.code}: unknown prerequisite ${r.requires}`);
      assert.ok(['essential', 'helpful'].includes(r.strength) && r.reason, `${k.code}: prerequisite needs a strength and a reason`);
    }
  }
  const state = {};
  const visit = (c, path) => { if (state[c] === 2) return; assert.notEqual(state[c], 1, `prerequisite loop: ${[...path, c].join(' > ')}`); state[c] = 1; for (const r of skills.find(k => k.code === c).prerequisites) if (r.kind === 'skill') visit(r.requires, [...path, c]); state[c] = 2; };
  for (const k of skills) visit(k.code, []);
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

test('all 188 Grade 4 families carry their curriculum skill, the skill\'s official outcome, and a HOREB skill the map names', () => {
  assert.equal(mine.length, 188, `${mine.length} Grade 4 families are filed under the curriculum map`);
  for (const f of mine) {
    const k = SKILLS_G4[f.cskill];
    assert.ok(k, `${f.id}: unknown cskill`);
    assert.ok(k.outcomes.includes(f.outcome), `${f.id}: outcome ${f.outcome} is not an outcome of ${f.cskill}`);
    assert.ok(horebOf4(f.cskill).includes(f.skill), `${f.id}: ${f.skill} not mapped to ${f.cskill}`);
    assert.ok(!k.hands, `${f.id}: ${f.cskill} is hands-on only`);
    for (const c of f.reveals || []) assert.ok(Object.keys(misLib).some(k2 => k2.endsWith(`.${c}`)), `${f.id}: reveals unknown ${c}`);
  }
  assert.deepEqual(FAMILIES.filter(f => /^G4\./.test(f.outcome || '')).map(f => f.id), [], 'a family is left on an old Grade 4 outcome code');
});

test('most Grade 4 families tie each wrong answer to a misconception; the rest are tied at family level and name one', () => {
  const perOption = mine.filter(f => f.misMapped !== false);
  const familyLevel = mine.filter(f => f.misMapped === false);
  assert.ok(perOption.length >= 164, `only ${perOption.length} families tie wrong answers one by one`);
  assert.ok(familyLevel.every(f => Array.isArray(f.reveals) && f.reveals.length), 'a family-level family names no misconception');
});

test('every skill a typed answer can test has at least two question families', () => {
  const by = {};
  for (const f of mine) (by[f.cskill] ||= []).push(f);
  const thin = Object.entries(SKILLS_G4).filter(([c, k]) => !k.hands && (by[c] || []).length < 2).map(([c]) => c);
  assert.deepEqual(thin, []);
  const hands = Object.entries(SKILLS_G4).filter(([, k]) => k.hands).map(([c]) => c);
  assert.equal(hands.length, 3, 'drawing, shape patterns and collecting data stay with the teacher');
});

test('Grade 4 families stay off for children until a teacher signs them off', () => {
  setFamilyMode('reviewed');
  for (const f of mine.filter(x => !x.core)) assert.ok(f.reviewed === true ? isOn(f) : !isOn(f), `${f.id} is on for children without a sign-off`);
  assert.ok(mine.filter(x => !x.core && x.reviewed === false).length >= 150);
});

test('the Grade 4 teaching pack has a file for every sub-strand and covers every skill and library misconception', () => {
  assert.equal(packs.length, 19, 'every Grade 4 sub-strand has its teaching pack file');
  const packed = new Set(packs.flatMap(s => s.skills.flatMap(e => e.misconceptions.map(m => m.code))));
  for (const s of source.sub_strands) {
    for (const k of s.skills) assert.ok(teachingFor(k.code), `no pack entry for ${k.code}`);
    for (const m of s.misconceptions) assert.ok(packed.has(m.code), `no reveal question and repair for ${m.code}`);
  }
  for (const p of packs) for (const e of p.skills) assert.ok(SKILLS_G4[e.skill], `pack entry for unknown skill ${e.skill}`);
});

test('the generated Grade 4 teaching pack matches the JSON (run node scripts/build-teaching-pack.mjs)', () => {
  const onDisk = readFileSync(new URL('../src/voice-tutor/teachingPackData.g4.js', import.meta.url), 'utf8');
  assert.equal(onDisk, renderData(buildPack(4), 4), 'teachingPackData.g4.js is stale');
});

test('the Grade 4 SQL loads every skill, prerequisite and misconception of the map (run node scripts/build-maths-sql-grade.mjs 4)', () => {
  const sql = readFileSync(new URL('../supabase/migrations/20261123_maths_g4_skills_misconceptions.sql', import.meta.url), 'utf8');
  const count = (re) => (sql.match(re) || []).length;
  assert.equal(count(/^INSERT INTO public\.curriculum_skills /gm), source.totals.skills);
  assert.equal(count(/^INSERT INTO public\.curriculum_prerequisites /gm), source.totals.prerequisites);
  assert.equal(count(/^INSERT INTO public\.curriculum_misconceptions /gm), source.totals.misconceptions);
  assert.ok(/^BEGIN;$/m.test(sql) && /^COMMIT;$/m.test(sql) && /ON CONFLICT \(code\) DO UPDATE/.test(sql), 'not one idempotent transaction');
});

test('HOREB\'s own Grade 4 outcome letters are reconciled with the official ones', () => {
  const horeb = Object.keys(OUTCOMES).filter(id => id.startsWith('G4.'));
  assert.deepEqual(horeb.map(id => id.slice(3)).filter(id => !LETTERS[id]).sort(), []);
  for (const [id, letters] of Object.entries(LETTERS)) {
    const sub = id.split('.')[0];
    assert.ok(OUTCOMES[`G4.${id}`], `HOREB has no ${id}`);
    for (const l of letters) assert.ok(OUTCOMES_G4[`MATH.G4.${SUB_OF[sub]}.${l}`], `${id}: official letter ${l} does not exist`);
  }
  for (const [id, , now] of TEXT_FIXES) assert.equal(OUTCOMES[id].text, now);
});
