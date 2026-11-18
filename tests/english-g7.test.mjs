// English Grade 7: skills, misconception library and question families (curriculum/english/g7.json).
// All draft and off for children until a Kenyan English teacher signs them off.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { depthFailures } from '../scripts/lib/english-depth.mjs';
import { readFileSync } from 'node:fs';
import { textFailures } from '../engine/scripts/english_checks.mjs';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../src/ai-tutor/content/curriculumMap.english.g7.js';
import entry from '../src/ai-tutor/content/subjects/english_g7.js';
import { SIGNED } from '../src/ai-tutor/content/families/english_g7_signed.js';

const source = JSON.parse(readFileSync(new URL('../curriculum/english/g7.json', import.meta.url), 'utf8'));
const subs = source.sub_strands;

test('the in-app map is generated from the file HOREB owns, and the official outcomes are untouched', () => {
  assert.equal(Object.keys(OUTCOMES).length, 254);
  assert.equal(source.totals.outcomes, 254);
  assert.equal(Object.keys(SKILLS).length, subs.flatMap(s => s.skills).length);
  assert.equal(Object.keys(MIS_FEEDBACK).length, subs.flatMap(s => s.misconceptions).length);
  for (const s of subs) for (const o of s.outcomes) assert.ok(/^kicd_(verified|read)$/.test(o.status), `${o.code}: outcome status changed`);
  assert.ok(Array.isArray(source.rubrics) || source.rubrics, 'KICD rubrics kept');
});

test('skills are proposed, misconceptions are draft, and every field a reviewer needs is there', () => {
  for (const s of subs) {
    for (const k of s.skills) {
      assert.equal(k.status, 'proposed');
      assert.ok(k.mastery && k.question_forms.length >= 2, `${k.code}: mastery or forms missing`);
      for (const p of k.prerequisites) assert.ok(p.kind === 'outcome' || /^ENGL\.G[56]\./.test(p.requires) || SKILLS[p.requires], `${k.code}: unknown prerequisite ${p.requires}`);
    }
    for (const m of s.misconceptions) {
      assert.equal(m.status, 'draft');
      for (const f of ['error', 'cause', 'reveals', 'help', 'feedback', 'source']) assert.ok(m[f] && String(m[f]).length > 5, `${m.code}: ${f} missing`);
      assert.ok(!/—/.test(JSON.stringify(m)), `${m.code}: em dash`);
    }
  }
});

test('every skill has two structures, every family passes its checks, and none is signed', () => {
  const bad = textFailures(60).filter(x => x.startsWith('english7.') || x.startsWith('ENGL.G7.'));
  assert.deepEqual(bad, [], `\n${bad.slice(0, 30).join('\n')}\n`);
  assert.deepEqual(SIGNED, []);
  assert.ok(entry.families.every(f => f.reviewed === false && f.id.startsWith('english7.')));
  const covered = new Set(entry.families.map(f => f.cskill));
  for (const c of Object.keys(SKILLS)) if (!SKILLS[c].nofamily) assert.ok(covered.has(c), `${c}: no family`);   // nofamily: a depth-pass skill (18 Nov 2026) with no family yet
});

test('misconception codes are unique to Grade 7 (M7_) so the joined English maps never clash', () => {
  const codes = subs.flatMap(s => s.misconceptions).map(m => m.code.split('.').pop());
  assert.ok(codes.every(c => c.startsWith('M7_')), 'a Grade 7 code without the M7_ prefix');
  assert.equal(new Set(codes).size, codes.length, 'a code is used twice');
  const others = ['g4', 'g5', 'g6'].flatMap(g => JSON.parse(readFileSync(new URL(`../curriculum/english/${g}.json`, import.meta.url), 'utf8')).sub_strands.flatMap(s => s.misconceptions || []).map(m => m.code.split('.').pop()));
  const set = new Set(others);
  assert.deepEqual(codes.filter(c => set.has(c)), [], 'a Grade 7 code is also a Grade 4, 5 or 6 code');
});

test('the Grade 6 links into Grade 7 are honoured: every outcome a Grade 6 skill leads to is covered by a Grade 7 skill with families, and that skill requires the Grade 6 skill', () => {
  const g6 = JSON.parse(readFileSync(new URL('../curriculum/english/g6.json', import.meta.url), 'utf8'));
  const withFamily = new Set(entry.families.map(f => f.cskill));
  const k7 = subs.flatMap(s => s.skills);
  let n = 0;
  for (const s of g6.sub_strands) for (const k of s.skills || []) for (const l of k.leads_to || []) {
    if (!l.skill.startsWith('ENGL.G7.')) continue;
    const cover = k7.filter(x => x.outcomes.includes(l.skill) && withFamily.has(x.code));
    assert.ok(cover.length, `${k.code} leads to ${l.skill}, which no Grade 7 skill with families covers`);
    assert.ok(cover.some(x => x.prerequisites.some(p => p.requires === k.code)), `${l.skill}: no covering skill requires ${k.code}`);
    n++;
  }
  assert.ok(n >= 28, `only ${n} Grade 6 links into Grade 7 found`);
});

test('Grade 7 skills lead only to real Grade 8 outcomes', () => {
  const g8 = JSON.parse(readFileSync(new URL('../curriculum/english/g8.json', import.meta.url), 'utf8'));
  const codes = new Set(g8.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
  let n = 0;
  for (const k of subs.flatMap(s => s.skills)) for (const l of k.leads_to || []) { assert.ok(codes.has(l.skill), `${k.code} -> ${l.skill}`); n++; }
  assert.ok(n >= 20);
});

// Depth pass (18 Nov 2026, Tuta Workspace/HOREB_MAPPING_PLAN.md): the Grade 5 Maths standard. Every testable outcome has a skill,
// every skill two prerequisites, four misconceptions and a teaching pack entry (curriculum/english/teaching/g7/), and the SQL loads it all.
test('Grade 7 English is at the depth standard: skills, prerequisites, misconceptions and teaching pack', () => {
  assert.deepEqual(depthFailures(7), []);
});

test('the Grade 7 English SQL loads every skill, prerequisite and misconception (run node scripts/build-maths-sql-grade.mjs english 7)', () => {
  const doc = JSON.parse(readFileSync(new URL('../curriculum/english/g7.json', import.meta.url), 'utf8'));
  const sql = readFileSync(new URL('../supabase/migrations/20261130_english_g7_skills_misconceptions.sql', import.meta.url), 'utf8');
  const count = (re) => (sql.match(re) || []).length;
  assert.equal(count(/^INSERT INTO public\.curriculum_skills /gm), doc.totals.skills);
  assert.equal(count(/^INSERT INTO public\.curriculum_prerequisites /gm), doc.totals.prerequisites);
  assert.equal(count(/^INSERT INTO public\.curriculum_misconceptions /gm), doc.totals.misconceptions);
  assert.ok(/^BEGIN;$/m.test(sql) && /^COMMIT;$/m.test(sql) && /ON CONFLICT \(code\) DO UPDATE/.test(sql), 'not one idempotent transaction');
});
