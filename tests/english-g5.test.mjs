// English Grade 5: skills, misconception library and question families (curriculum/english/g5.json).
// All draft and off for children until a Kenyan English teacher signs them off.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { depthFailures } from '../scripts/lib/english-depth.mjs';
import { readFileSync } from 'node:fs';
import { englishFailures, checkEnglishForms, checkTextForms, ENGLISH_FAMILIES } from '../engine/scripts/english_checks.mjs';
import { SKILLS_E5, OUTCOMES_E5, MIS_FEEDBACK_E5 } from '../src/ai-tutor/content/curriculumMap.english.g5.js';
import { isOn, setFamilyMode } from '../src/ai-tutor/content/families/core.js';
import { FAMILIES } from '../src/ai-tutor/content/families/index.js';
import { checkTextAnswer } from '../src/ai-tutor/answerCheckText.js';
import { PASSAGES } from '../src/ai-tutor/content/families/eng_g5_passages.js';
import { SIGNED_ENGLISH } from '../src/ai-tutor/content/families/eng_signed.js';
import { routeOf } from '../scripts/data/english-g5-routes.mjs';

const source = JSON.parse(readFileSync(new URL('../curriculum/english/g5.json', import.meta.url), 'utf8'));
const subs = source.sub_strands;

test('the in-app map is generated from the file HOREB owns, and the official outcomes are untouched', () => {
  assert.equal(Object.keys(OUTCOMES_E5).length, 200);
  assert.equal(Object.keys(SKILLS_E5).length, subs.flatMap(s => s.skills).length);
  assert.equal(Object.values(MIS_FEEDBACK_E5).flatMap(m => Object.keys(m)).length, subs.flatMap(s => s.misconceptions).length);
  assert.equal(source.totals.skills, Object.keys(SKILLS_E5).length);
  assert.equal(source.totals.misconceptions, subs.flatMap(s => s.misconceptions).length);
  for (const s of subs) for (const o of s.outcomes) assert.ok(/^kicd_(verified|read)$/.test(o.status), `${o.code}: outcome status changed`);
  assert.equal(source.totals.outcomes, 200);
});

test('skills and the misconception library are proposed or draft, with the fields a reviewer needs', () => {
  for (const s of subs) {
    for (const k of s.skills) {
      assert.equal(k.status, 'proposed');
      assert.ok(k.mastery && k.question_forms.length >= 2 && k.thinking.length, `${k.code}: mastery, forms or thinking missing`);
      assert.ok(k.outcomes.length && k.outcomes.every(o => OUTCOMES_E5[o]), `${k.code}: unknown outcome`);
      for (const p of k.prerequisites) assert.ok(p.kind === 'outcome' || p.requires.startsWith('ENGL.G4.') || SKILLS_E5[p.requires], `${k.code}: unknown prerequisite ${p.requires}`);
    }
    for (const m of s.misconceptions) {
      assert.equal(m.status, 'draft');
      for (const f of ['error', 'cause', 'reveals', 'help', 'feedback', 'source']) assert.ok(m[f] && String(m[f]).length > 5, `${m.code}: ${f} missing`);
      assert.ok(m.example.question && m.example.wrong_answer && m.example.correct_answer, `${m.code}: example incomplete`);
      assert.ok(!/—/.test(JSON.stringify(m)), `${m.code}: em dash`);
    }
  }
});

test('every English skill has families in at least two different structures, and every family passes its checks', () => {
  const bad = englishFailures(150);
  assert.deepEqual(bad, [], `\n${bad.slice(0, 40).join('\n')}\n`);
  assert.deepEqual(checkEnglishForms(), []);
  assert.deepEqual(checkTextForms(ENGLISH_FAMILIES.filter(f => f.grade === 5), SKILLS_E5), []);   // every Grade 5 skill, since checkEnglishForms reads the first English entry (Grade 4)
});

test('English families stay off for children until a teacher signs them off, and stay out of the Maths bank', () => {
  setFamilyMode('reviewed');
  for (const f of ENGLISH_FAMILIES.filter(x => x.grade === 5)) {   // Grade 4 English (12 Nov 2026) has its own entry and test
    assert.ok(f.reviewed === SIGNED_ENGLISH.includes(f.id) && f.draft === !f.reviewed, `${f.id}: reviewed must follow the sign-off list`);
    assert.ok(isOn(f) === SIGNED_ENGLISH.includes(f.id), `${f.id} is on for children without a sign-off`);
    assert.ok(f.cskill.startsWith('ENGL.G5.'));
  }
  assert.ok(!FAMILIES.some(f => String(f.id).startsWith('eng5.')));
});

test('English is marked by the text marker: articles, word order, capitals in a tapped option and punctuation matter', () => {
  const key = { answer: 'a few', accepts: ['a few', 'afew'] };
  assert.ok(checkTextAnswer('a few', key) && checkTextAnswer('A Few', key));
  assert.ok(!checkTextAnswer('few', key));
  assert.ok(!checkTextAnswer('taller than', { answer: 'than taller', accepts: ['than taller'] }));
  const tap = { choices: ['Juma said, "We are late."', 'Juma said, "we are late."'], answer: 'Juma said, "We are late."', accepts: ['Juma said, "We are late."'] };
  assert.ok(checkTextAnswer('Juma said, "We are late."', tap));
  assert.ok(!checkTextAnswer('Juma said, "we are late."', tap));
  assert.ok(checkTextAnswer("Juma’s", { answer: "Juma's", accepts: ["Juma's"] }));
  assert.ok(checkTextAnswer('summer.', { answer: 'summer', accepts: ['summer'] }));
});

test('passages are original, short, and read at a ten-year-old level', () => {
  assert.ok(PASSAGES.length >= 10);
  for (const p of PASSAGES) {
    assert.ok(p.text.length < 1100, `${p.id}: too long`);
    assert.ok(!/—/.test(p.text), `${p.id}: em dash`);
  }
});

test('the route of every outcome is one of the five, and composition outcomes name a marker type', () => {
  const known = new Set(['family', 'composition', 'voice', 'teacher', 'attitude']);
  const covered = new Set(Object.values(SKILLS_E5).flatMap(k => k.outcomes));
  for (const s of subs) for (const o of s.outcomes) assert.ok(covered.has(o.code) || known.has(routeOf(o, s)), o.code);
});

// Depth pass (18 Nov 2026, Tuta Workspace/HOREB_MAPPING_PLAN.md): the Grade 5 Maths standard. Every testable outcome has a skill,
// every skill two prerequisites, four misconceptions and a teaching pack entry (curriculum/english/teaching/g5/), and the SQL loads it all.
test('Grade 5 English is at the depth standard: skills, prerequisites, misconceptions and teaching pack', () => {
  assert.deepEqual(depthFailures(5), []);
});

test('the Grade 5 English SQL loads every skill, prerequisite and misconception (run node scripts/build-maths-sql-grade.mjs english 5)', () => {
  const doc = JSON.parse(readFileSync(new URL('../curriculum/english/g5.json', import.meta.url), 'utf8'));
  const sql = readFileSync(new URL('../supabase/migrations/20261130_english_g5_skills_misconceptions.sql', import.meta.url), 'utf8');
  const count = (re) => (sql.match(re) || []).length;
  assert.equal(count(/^INSERT INTO public\.curriculum_skills /gm), doc.totals.skills);
  assert.equal(count(/^INSERT INTO public\.curriculum_prerequisites /gm), doc.totals.prerequisites);
  assert.equal(count(/^INSERT INTO public\.curriculum_misconceptions /gm), doc.totals.misconceptions);
  assert.ok(/^BEGIN;$/m.test(sql) && /^COMMIT;$/m.test(sql) && /ON CONFLICT \(code\) DO UPDATE/.test(sql), 'not one idempotent transaction');
});
