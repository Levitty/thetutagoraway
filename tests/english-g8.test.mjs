// English Grade 8: skills, misconception library and question families (curriculum/english/g8.json).
// All draft and off for children until a Kenyan English teacher signs them off.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { depthFailures } from '../scripts/lib/english-depth.mjs';
import { readFileSync } from 'node:fs';
import { textFailures } from '../engine/scripts/english_checks.mjs';
import { SKILLS, OUTCOMES, MIS_FEEDBACK } from '../src/ai-tutor/content/curriculumMap.english.g8.js';
import entry from '../src/ai-tutor/content/subjects/english_g8.js';
import { SIGNED } from '../src/ai-tutor/content/families/english_g8_signed.js';

const source = JSON.parse(readFileSync(new URL('../curriculum/english/g8.json', import.meta.url), 'utf8'));
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
      for (const p of k.prerequisites) assert.ok(p.kind === 'outcome' || /^ENGL\.G[567]\./.test(p.requires) || SKILLS[p.requires], `${k.code}: unknown prerequisite ${p.requires}`);
    }
    for (const m of s.misconceptions) {
      assert.equal(m.status, 'draft');
      for (const f of ['error', 'cause', 'reveals', 'help', 'feedback', 'source']) assert.ok(m[f] && String(m[f]).length > 5, `${m.code}: ${f} missing`);
      assert.ok(!/—/.test(JSON.stringify(m)), `${m.code}: em dash`);
    }
  }
});

test('every skill has two structures, every family passes its checks, and none is signed', () => {
  const bad = textFailures(60).filter(x => x.startsWith('english8.') || x.startsWith('ENGL.G8.'));
  assert.deepEqual(bad, [], `\n${bad.slice(0, 30).join('\n')}\n`);
  assert.deepEqual(SIGNED, []);
  assert.ok(entry.families.every(f => f.reviewed === false && f.id.startsWith('english8.')));
  const covered = new Set(entry.families.map(f => f.cskill));
  for (const c of Object.keys(SKILLS)) if (!SKILLS[c].nofamily) assert.ok(covered.has(c), `${c}: no family`);   // nofamily: a depth-pass skill (18 Nov 2026) with no family yet
});

test('misconception codes are unique to Grade 8 (M8_) so the joined English maps never clash', () => {
  const codes = subs.flatMap(s => s.misconceptions).map(m => m.code.split('.').pop());
  assert.ok(codes.every(c => c.startsWith('M8_')), 'a Grade 8 code without the M8_ prefix');
  assert.equal(new Set(codes).size, codes.length, 'a code is used twice');
  const others = ['g4', 'g5', 'g6'].flatMap(g => JSON.parse(readFileSync(new URL(`../curriculum/english/${g}.json`, import.meta.url), 'utf8')).sub_strands.flatMap(s => s.misconceptions || []).map(m => m.code.split('.').pop()));
  const set = new Set(others);
  assert.deepEqual(codes.filter(c => set.has(c)), [], 'a Grade 8 code is also a Grade 4, 5 or 6 code');
});

// Depth pass (18 Nov 2026, Tuta Workspace/HOREB_MAPPING_PLAN.md): the Grade 5 Maths standard. Every testable outcome has a skill,
// every skill two prerequisites, four misconceptions and a teaching pack entry (curriculum/english/teaching/g8/), and the SQL loads it all.
test('Grade 8 English is at the depth standard: skills, prerequisites, misconceptions and teaching pack', () => {
  assert.deepEqual(depthFailures(8), []);
});

test('the Grade 8 English SQL loads every skill, prerequisite and misconception (run node scripts/build-maths-sql-grade.mjs english 8)', () => {
  const doc = JSON.parse(readFileSync(new URL('../curriculum/english/g8.json', import.meta.url), 'utf8'));
  const sql = readFileSync(new URL('../supabase/migrations/20261130_english_g8_skills_misconceptions.sql', import.meta.url), 'utf8');
  const count = (re) => (sql.match(re) || []).length;
  assert.equal(count(/^INSERT INTO public\.curriculum_skills /gm), doc.totals.skills);
  assert.equal(count(/^INSERT INTO public\.curriculum_prerequisites /gm), doc.totals.prerequisites);
  assert.equal(count(/^INSERT INTO public\.curriculum_misconceptions /gm), doc.totals.misconceptions);
  assert.ok(/^BEGIN;$/m.test(sql) && /^COMMIT;$/m.test(sql) && /ON CONFLICT \(code\) DO UPDATE/.test(sql), 'not one idempotent transaction');
});
