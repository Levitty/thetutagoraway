// Shared checks for English Grades 1, 2 and 3 (depth map, 18 Nov 2026). Used by tests/english-g<N>.test.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { depthFailures } from '../../scripts/lib/english-depth.mjs';
import { entryFor } from '../../src/ai-tutor/content/subjects/registry.js';

const load = (g) => JSON.parse(readFileSync(new URL(`../../curriculum/english/g${g}.json`, import.meta.url), 'utf8'));

export function lowerGradeTests(grade, { skills, outcomes }) {
  const doc = load(grade);
  const subs = doc.sub_strands;
  const all = subs.flatMap(s => s.skills);
  const mis = subs.flatMap(s => s.misconceptions);

  test(`Grade ${grade} English is at the depth standard: every testable outcome has a skill; two prerequisites, four misconceptions and a pack entry per skill`, () => {
    assert.deepEqual(depthFailures(grade), []);
    assert.equal(doc.totals.outcomes, outcomes);
    assert.equal(all.length, skills);
    for (const s of subs) for (const o of s.outcomes) assert.ok(/^kicd_(verified|read)$/.test(o.status), `${o.code}: outcome status changed`);
  });

  test(`Grade ${grade} English prerequisites name real skills or outcomes, of this grade or the grade below`, async () => {
    const here = new Set([...all.map(k => k.code), ...(doc.readiness || []).map(r => r.code)]);   // Grade 1: pre-primary readiness skills
    if (grade === 1) assert.ok((doc.readiness || []).length >= 8 && doc.readiness.every(r => r.code.startsWith('ENGL.PP2.READINESS.') && r.name && r.what), 'Grade 1 defines its readiness skills');
    const below = grade > 1 ? load(grade - 1) : null;
    const belowSkills = new Set(below ? below.sub_strands.flatMap(s => s.skills || []).map(k => k.code) : []);
    const belowOut = new Set(below ? below.sub_strands.flatMap(s => s.outcomes).map(o => o.code) : []);
    let down = 0;
    for (const k of all) for (const p of k.prerequisites) {
      if (p.kind === 'skill') { assert.ok(here.has(p.requires) || belowSkills.has(p.requires), `${k.code}: unknown skill ${p.requires}`); if (belowSkills.has(p.requires)) down++; }
      else { assert.equal(p.kind, 'outcome'); assert.ok(belowOut.has(p.requires), `${k.code}: ${p.requires} is not a Grade ${grade - 1} outcome`); down++; }
    }
    if (grade > 1) assert.ok(down >= 30, `only ${down} prerequisites reach Grade ${grade - 1}`);
    // Once the grade below has skills, outcome prerequisites are moved onto them (scripts/build-english-lower.mjs).
    if (belowSkills.size) assert.ok(all.every(k => k.prerequisites.every(p => p.kind === 'skill')), 'an outcome prerequisite was not moved onto a skill of the grade below');
  });

  test(`Grade ${grade} English names the early-literacy errors the plan asks for`, () => {
    const text = JSON.stringify(mis).toLowerCase();
    for (const w of ['capital', 'full stop', 'home language']) assert.ok(text.includes(w), `no misconception mentions ${w}`);
    assert.ok(mis.some(m => /\bb and d\b|\bb (for|as) d\b|\bd (for|as) b\b/i.test(m.error + m.cause)), 'no b and d reversal');
    assert.ok(mis.some(m => /guess/i.test(m.error + m.cause)), 'no sight-word or picture guessing');
    for (const m of mis) assert.ok(!/does not understand/i.test(m.error), `${m.code}: vague error`);
  });

  test(`Grade ${grade} English is wired as a subject-grade with no families: every skill is nofamily, nothing can be served`, () => {
    const entry = entryFor('english', grade);
    assert.ok(entry, 'no registry entry');
    assert.deepEqual(entry.families, []);
    assert.deepEqual(entry.signed, []);
    assert.equal(Object.keys(entry.map.skills).length, skills);
    assert.equal(Object.keys(entry.map.misFeedback).length, mis.length);
    for (const [c, k] of Object.entries(entry.map.skills)) assert.ok(k.nofamily, `${c}: not marked nofamily`);
    const voice = all.filter(k => ['voice', 'teacher', 'composition'].includes(k.assessed_by));
    assert.ok(voice.length >= 5, 'listening, reading-aloud and handwriting skills should be assessed by voice, teacher or composition');
  });

  test(`the Grade ${grade} English SQL loads every skill, prerequisite and misconception (node scripts/build-maths-sql-grade.mjs english ${grade})`, () => {
    const sql = readFileSync(new URL(`../../supabase/migrations/20261130_english_g${grade}_skills_misconceptions.sql`, import.meta.url), 'utf8');
    const count = (re) => (sql.match(re) || []).length;
    assert.equal(count(/^INSERT INTO public\.curriculum_skills /gm), doc.totals.skills);
    assert.equal(count(/^INSERT INTO public\.curriculum_prerequisites /gm), doc.totals.prerequisites);
    assert.equal(count(/^INSERT INTO public\.curriculum_misconceptions /gm), doc.totals.misconceptions);
    assert.ok(/^BEGIN;$/m.test(sql) && /^COMMIT;$/m.test(sql) && /ON CONFLICT \(code\) DO UPDATE/.test(sql), 'not one idempotent transaction');
  });
}
