// Grade 4 Mathematics against the curriculum map HOREB owns (curriculum/mathematics/g4.json): skills, prerequisites,
// misconceptions and the question families filed under them. Everything here is draft: nothing reaches a child.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FAMILIES } from '../engine/scripts/family_checks.mjs';
import { isOn, setFamilyMode } from '../src/ai-tutor/content/families/core.js';
import { SKILLS_G4, OUTCOMES_G4, SUBSTRANDS_G4, horebOf4 } from '../src/ai-tutor/content/curriculumMap.g4.js';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { OUTCOMES } from '../src/ai-tutor/curriculum/outcomes.js';
import { LETTERS, SUB_OF, TEXT_FIXES } from '../scripts/data/maths-g4-letters.mjs';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const source = read('../curriculum/mathematics/g4.json'), g3 = read('../curriculum/mathematics/g3.json');
const misLib = read('../engine/data/curriculum/g4.misconceptions.json');
const mine = FAMILIES.filter(f => f.cskill && /^MATH\.G4\./.test(f.cskill));
const skills = source.sub_strands.flatMap(s => s.skills);
const ATTITUDE = /^(appreciate|use digital|use it )/i;

test('the in-app map is generated from the file HOREB owns, whole', () => {
  assert.equal(Object.keys(SUBSTRANDS_G4).length, source.sub_strands.length);
  assert.equal(Object.keys(OUTCOMES_G4).length, source.sub_strands.flatMap(s => s.outcomes).length);
  assert.equal(Object.keys(SKILLS_G4).length, skills.length);
  assert.equal(Object.keys(misLib).length, source.sub_strands.flatMap(s => s.misconceptions).length);
  assert.deepEqual([source.totals.skills, source.totals.prerequisites, source.totals.misconceptions], [skills.length, skills.flatMap(k => k.prerequisites).length, Object.keys(misLib).length]);
  for (const [c, k] of Object.entries(SKILLS_G4)) {
    assert.ok(SKILLS[k.primary], `${c}: primary HOREB skill ${k.primary} does not exist`);
    assert.ok(k.outcomes.every(o => OUTCOMES_G4[o]), `${c}: unknown outcome`);
    assert.ok(horebOf4(c).includes(k.primary));
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
  assert.ok(skills.flatMap(k => k.prerequisites).some(r => r.kind === 'outcome'), 'some prerequisites reach Grade 3 outcomes');
});

test('every skill has at least two misconceptions, each with an example, a cause, a help and a source', () => {
  for (const k of skills) {
    const own = Object.entries(misLib).filter(([, m]) => m.skill === k.code);
    assert.ok(own.length >= 2, `${k.code}: ${own.length} misconceptions`);
    for (const [code, m] of own) {
      assert.ok(m.example?.question && m.example?.wrong_answer && m.example?.correct_answer, `${code}: example`);
      assert.notEqual(String(m.example.wrong_answer), String(m.example.correct_answer), `${code}: the wrong answer is the right one`);
      assert.ok(m.error && m.cause && m.reveals && m.help, `${code}: missing field`);
      assert.ok(m.source === 'to confirm by a teacher' || /^widely reported in maths-education research/.test(m.source), `${code}: source`);
      assert.equal(m.status, 'draft');
    }
  }
});

test('a Grade 4 family carries its curriculum skill, the skill\'s official outcome, and a HOREB skill the map names', () => {
  assert.ok(mine.length >= 150, `only ${mine.length} Grade 4 families are filed under a curriculum skill`);
  for (const f of mine) {
    const k = SKILLS_G4[f.cskill];
    assert.ok(k, `${f.id}: unknown cskill`);
    assert.ok(k.outcomes.includes(f.outcome), `${f.id}: outcome ${f.outcome} is not an outcome of ${f.cskill}`);
    assert.ok(horebOf4(f.cskill).includes(f.skill), `${f.id}: ${f.skill} not mapped to ${f.cskill}`);
    assert.ok(!k.hands, `${f.id}: ${f.cskill} is hands-on only`);
  }
});

test('every skill a typed answer can test has at least two question families', () => {
  const by = {};
  for (const f of mine) (by[f.cskill] ||= []).push(f);
  const thin = Object.entries(SKILLS_G4).filter(([c, k]) => !k.hands && (by[c] || []).length < 2).map(([c]) => c);
  assert.deepEqual(thin, []);
  const handsOnly = Object.entries(SKILLS_G4).filter(([, k]) => k.hands).map(([c]) => c);
  assert.equal(handsOnly.length, 3, 'drawing, shape patterns and collecting data stay with the teacher');
});

test('the new Grade 4 families stay off for children until a teacher signs them off', () => {
  setFamilyMode('reviewed');
  for (const f of mine.filter(x => !x.core)) assert.ok(f.reviewed === true ? isOn(f) : !isOn(f), `${f.id} is on for children without a sign-off`);
  assert.ok(mine.filter(x => !x.core && x.reviewed === false).length >= 150);
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
