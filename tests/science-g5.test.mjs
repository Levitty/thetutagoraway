// Grade 5 Science and Technology against the curriculum map HOREB owns (curriculum/science/g5.json).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkFamily, FAMILIES } from '../engine/scripts/family_checks.mjs';
import { isOn, setFamilyMode, drawFamily } from '../src/ai-tutor/content/families/core.js';
import { SKILLS_SCI_G5, OUTCOMES_SCI_G5, SUBSTRANDS_SCI_G5, MIS_FEEDBACK } from '../src/ai-tutor/content/curriculumMap.science.g5.js';

const source = JSON.parse(readFileSync(new URL('../curriculum/science/g5.json', import.meta.url), 'utf8'));
const misLib = JSON.parse(readFileSync(new URL('../engine/data/curriculum/science.g5.misconceptions.json', import.meta.url), 'utf8'));
const mine = FAMILIES.filter(f => f.subject === 'science');
const allSkills = source.sub_strands.flatMap(s => s.skills);

test('the in-app science map is generated from the file HOREB owns, whole', () => {
  assert.equal(Object.keys(SUBSTRANDS_SCI_G5).length, source.sub_strands.length);
  assert.equal(Object.keys(OUTCOMES_SCI_G5).length, source.sub_strands.flatMap(s => s.outcomes).length);
  assert.equal(Object.keys(SKILLS_SCI_G5).length, allSkills.length);
  assert.equal(Object.keys(misLib).length, source.sub_strands.flatMap(s => s.misconceptions).length);
  assert.equal(Object.keys(MIS_FEEDBACK).length, Object.keys(misLib).length);
  assert.equal(source.totals.skills, allSkills.length);
  assert.equal(source.totals.misconceptions, Object.keys(misLib).length);
});

test('the official outcomes are untouched and every skill names real outcomes and prerequisites', () => {
  assert.equal(source.sub_strands.flatMap(s => s.outcomes).length, 32);
  for (const o of source.sub_strands.flatMap(s => s.outcomes)) assert.equal(o.status, 'kicd_verified');
  const codes = new Set(allSkills.map(k => k.code));
  for (const k of allSkills) {
    assert.ok(k.outcomes.length && k.outcomes.every(o => OUTCOMES_SCI_G5[o]), `${k.code}: unknown outcome`);
    assert.ok(k.mastery && k.question_forms.length >= 3, `${k.code}: needs a mastery rule and question forms`);
    assert.ok(k.prerequisites.length >= 1, `${k.code}: no prerequisite`);
    for (const p of k.prerequisites) if (p.kind === 'skill') assert.ok(codes.has(p.requires), `${k.code}: unknown prerequisite ${p.requires}`);
    assert.ok(SKILLS_SCI_G5[k.code].mis.length >= 2, `${k.code}: fewer than 2 misconceptions`);
  }
});

test('every misconception has the wrong idea, a revealing question, a repair, a child-facing line and a source note', () => {
  for (const [code, m] of Object.entries(misLib)) {
    for (const f of ['error', 'cause', 'reveals', 'help', 'feedback', 'source']) assert.ok(String(m[f] || '').length > 10, `${code}: no ${f}`);
    assert.ok(m.example.question && m.example.wrong_answer && m.example.correct_answer, `${code}: no example`);
    assert.equal(m.status, 'draft');
    assert.ok(!/[\u{1F300}-\u{1FAFF}]|—/u.test(m.feedback), `${code}: emoji or em dash in what a child reads`);
  }
});

test('every skill has at least two families of different forms, and every family is tagged to one outcome of its skill', () => {
  const by = {};
  for (const f of mine) (by[f.cskill] ||= []).push(f);
  for (const c of Object.keys(SKILLS_SCI_G5)) {
    assert.ok((by[c] || []).length >= 2, `${c}: fewer than 2 families`);
    assert.ok(new Set(by[c].map(f => f.form)).size >= 2, `${c}: families share one form`);
  }
  for (const f of mine) {
    assert.equal(f.skill, f.cskill);
    assert.ok(SKILLS_SCI_G5[f.cskill].outcomes.includes(f.outcome), `${f.id}: outcome not on its skill`);
  }
  assert.equal(new Set(mine.map(f => f.id)).size, mine.length, 'duplicate family id');
});

test('every science family passes the family checks, and every misconception is revealed by some wrong answer', () => {
  const bad = mine.flatMap(f => checkFamily(f, 60));
  assert.deepEqual(bad, []);
  setFamilyMode('all');
  const revealed = new Set();
  for (const f of mine) for (let i = 0; i < 40; i++) {
    const { p } = drawFamily(f);
    for (const m of p.misconceptions || []) for (const c of [].concat(m.mis || [])) revealed.add(c);
    for (const c of [].concat(p.mis || [])) revealed.add(c);
  }
  setFamilyMode('reviewed');
  const unseen = Object.keys(MIS_FEEDBACK).filter(c => !revealed.has(c));
  assert.deepEqual(unseen, []);
});

test('science families stay off for children until a teacher signs them off', () => {
  setFamilyMode('reviewed');
  assert.ok(mine.length >= 66);
  for (const f of mine) assert.equal(isOn(f), false, `${f.id} is on for children without a sign-off`);
  assert.ok(mine.every(f => f.reviewed === false));
});

test('science question text is for a ten-year-old: British spelling, no emoji, no em dash, no imperial units', () => {
  for (const f of mine) for (let i = 0; i < 10; i++) {
    const { p } = drawFamily(f);
    const text = [p.question, ...(p.choices || []), ...(p.hints || []), ...(p.solutionSteps || []), p.explain].filter(Boolean).join(' ');
    assert.ok(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]|—/u.test(text), `${f.id}: emoji or em dash`);
    assert.ok(!/\b(color|meter|liter|center|favorite|gray|neighbor|miles?|inch(es)?|yards?|gallons?)\b/i.test(text), `${f.id}: American spelling or imperial unit`);
  }
});
