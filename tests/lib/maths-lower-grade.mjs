// The checks for Grade 1, 2 and 3 Mathematics against the curriculum map HOREB owns (curriculum/mathematics/g<grade>.json), shared
// so the three grades are held to one standard (18 Nov 2026): the depth standard of Grades 4 to 9 (two prerequisites and four
// misconceptions per skill, a teaching pack for every skill and misconception), the older lower-primary families (g1_3.js) linked
// where they fit, the rest listed. Each grade was mapped before the grade below it, so its prerequisites first named that grade's
// outcomes; once the grade below has skills none may be left. Grade 1 reaches below the curriculum with pre-primary readiness
// skills (MATH.PP2.READINESS.*) that g1.json defines itself. Everything here is draft: nothing reaches a child.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FAMILIES } from '../../engine/scripts/family_checks.mjs';
import { isOn, setFamilyMode } from '../../src/ai-tutor/content/families/core.js';
import { SKILLS } from '../../src/ai-tutor/knowledgeGraph.js';
import { buildPack, renderData, loadSources } from '../../scripts/build-teaching-pack.mjs';
import { teachingFor } from '../../src/voice-tutor/teachingPack.js';

const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));

// grade, sub-strand count, linked families (and how many tie each wrong answer), hands-only skills, the data index's NOFAMILY and
// OFF_DESIGN, the migration file name
export async function lowerGradeTests({ grade, subs, linked, perOption, hands, sqlFile }) {
  const G = `G${grade}`;
  const map = await import(`../../src/ai-tutor/content/curriculumMap.g${grade}.js`);
  const { NOFAMILY, OFF_DESIGN } = await import(`../../scripts/data/maths-g${grade}/index.mjs`);
  const SK = map[`SKILLS_${G}`], OUT = map[`OUTCOMES_${G}`], SUBS = map[`SUBSTRANDS_${G}`], horebOf = map[`horebOf${grade}`];
  const source = read(`../../curriculum/mathematics/g${grade}.json`);
  const below = grade > 1 ? read(`../../curriculum/mathematics/g${grade - 1}.json`) : null;
  const misLib = read(`../../engine/data/curriculum/g${grade}.misconceptions.json`);
  const mine = FAMILIES.filter(f => f.cskill && f.cskill.startsWith(`MATH.${G}.`));
  const skills = source.sub_strands.flatMap(s => s.skills);
  const own = new Set(skills.map(k => k.code));
  const belowSkills = new Set(below ? below.sub_strands.flatMap(s => s.skills.map(k => k.code)) : []);
  const belowOutcomes = new Set(below ? below.sub_strands.flatMap(s => s.outcomes.map(o => o.code)) : []);
  const ready = new Set((source.readiness || []).map(r => r.code));
  const handsOnly = (k) => k.hands_on && !(k.question_forms || []).length;
  const packs = loadSources(grade);

  test(`Grade ${grade}: the in-app map is generated from the file HOREB owns, whole, with every one of the ${subs} sub-strands mapped`, () => {
    assert.equal(Object.keys(SUBS).length, subs);
    assert.equal(Object.keys(OUT).length, source.sub_strands.flatMap(s => s.outcomes).length);
    assert.ok(source.sub_strands.every(s => s.skills.length), 'a sub-strand has no skills');
    assert.equal(Object.keys(SK).length, skills.length);
    assert.equal(Object.keys(misLib).length, source.sub_strands.flatMap(s => s.misconceptions).length);
    assert.deepEqual([source.totals.skills, source.totals.prerequisites, source.totals.misconceptions], [skills.length, skills.flatMap(k => k.prerequisites).length, Object.keys(misLib).length]);
    for (const [c, k] of Object.entries(SK)) {
      assert.ok(SKILLS[k.primary], `${c}: primary HOREB skill ${k.primary} does not exist`);
      assert.ok(k.outcomes.every(o => OUT[o]), `${c}: unknown outcome`);
      assert.ok(horebOf(c).includes(k.primary));
      for (const p of k.pre) assert.ok(SK[p] || belowSkills.has(p), `${c}: unknown prerequisite ${p}`);
    }
  });

  test(`Grade ${grade}: official outcomes are untouched and every testable one has a skill`, () => {
    const left = [];
    for (const s of source.sub_strands) {
      const covered = new Set(s.skills.flatMap(k => k.outcomes));
      for (const o of s.outcomes) { assert.match(o.status, /^kicd_(verified|read)$/); if (!covered.has(o.code) && !/^appreciate/i.test(o.text)) left.push(o.code); }
    }
    assert.deepEqual(left, []);
  });

  test(`Grade ${grade}: every skill has a mastery rule, question forms (unless hands-on only), two prerequisites or more and four misconceptions or more`, () => {
    let down = 0;
    for (const s of source.sub_strands) for (const k of s.skills) {
      assert.ok(k.mastery.length > 60 && (handsOnly(k) || k.question_forms.length >= 3), `${k.code}: thin`);
      assert.ok(k.prerequisites.length >= 2 && k.prerequisites.every(p => p.status === 'proposed' && p.reason.length > 10), `${k.code}: prerequisites`);
      assert.equal(new Set(k.prerequisites.map(p => p.requires)).size, k.prerequisites.length, `${k.code}: a prerequisite twice`);
      assert.ok(s.misconceptions.filter(m => m.skill === k.code).length >= 4, `${k.code}: fewer than four misconceptions`);
      assert.equal(k.status, 'proposed');
      if (k.prerequisites.some(p => !own.has(p.requires))) down++;
    }
    assert.ok(down >= source.totals.skills * 0.4, `only ${down} skills reach below Grade ${grade}`);
  });

  test(`Grade ${grade}: prerequisites exist, name skills once the grade below has them, and never loop`, () => {
    for (const k of skills) for (const r of k.prerequisites) {
      const ok = r.kind === 'outcome' ? belowOutcomes.has(r.requires) : own.has(r.requires) || belowSkills.has(r.requires) || ready.has(r.requires);
      assert.ok(ok, `${k.code}: unknown prerequisite ${r.requires}`);
      assert.ok(['essential', 'helpful'].includes(r.strength) && r.reason, `${k.code}: prerequisite needs a strength and a reason`);
    }
    if (grade === 1 || belowSkills.size) assert.deepEqual(skills.flatMap(k => k.prerequisites.filter(p => p.kind === 'outcome').map(p => `${k.code} > ${p.requires}`)), []);
    const state = {};
    const visit = (c, path) => { if (state[c] === 2) return; assert.notEqual(state[c], 1, `prerequisite loop: ${[...path, c].join(' > ')}`); state[c] = 1; for (const r of skills.find(k => k.code === c).prerequisites) if (own.has(r.requires)) visit(r.requires, [...path, c]); state[c] = 2; };
    for (const k of skills) visit(k.code, []);
  });

  test(`Grade ${grade}: the grade above builds on these skills, with no Grade ${grade} outcome left among its prerequisites`, () => {
    const above = read(`../../curriculum/mathematics/g${grade + 1}.json`);
    const pre = above.sub_strands.flatMap(s => s.skills.flatMap(k => k.prerequisites));
    assert.deepEqual(pre.filter(p => p.kind === 'outcome').map(p => p.requires), []);
    const named = pre.filter(p => p.requires.startsWith(`MATH.${G}.`));
    assert.ok(named.length >= 40 && named.every(p => own.has(p.requires)), `a Grade ${grade + 1} prerequisite names a Grade ${grade} skill that does not exist`);
  });

  test(`Grade ${grade}: every misconception has all its fields, a source line, its own example, and is a draft`, () => {
    for (const [code, m] of Object.entries(misLib)) {
      assert.ok(m.example?.question && m.example?.wrong_answer && m.example?.correct_answer, `${code}: example`);
      assert.notEqual(String(m.example.wrong_answer), String(m.example.correct_answer), `${code}: the wrong answer is the right one`);
      assert.ok(m.error && m.cause && m.reveals && m.help, `${code}: missing field`);
      assert.ok(m.source === 'to confirm by a teacher' || /^widely reported in maths-education research/.test(m.source), `${code}: source`);
      assert.equal(m.status, 'draft');
    }
  });

  test(`Grade ${grade}: ${linked} older families carry their curriculum skill, its official outcome and a HOREB skill the map names; the rest are listed`, () => {
    assert.equal(mine.length, linked, `${mine.length} Grade ${grade} families are filed under the curriculum map`);
    for (const f of mine) {
      const k = SK[f.cskill];
      assert.ok(k, `${f.id}: unknown cskill`);
      assert.ok(k.outcomes.includes(f.outcome), `${f.id}: outcome ${f.outcome} is not an outcome of ${f.cskill}`);
      assert.ok(horebOf(f.cskill).includes(f.skill), `${f.id}: ${f.skill} not mapped to ${f.cskill}`);
      assert.ok(!k.hands, `${f.id}: ${f.cskill} is hands-on only`);
      for (const c of f.reveals || []) assert.ok(Object.keys(misLib).some(k2 => k2.endsWith(`.${c}`)), `${f.id}: reveals unknown ${c}`);
    }
    assert.deepEqual(FAMILIES.filter(f => new RegExp(`^${G}\\.`).test(f.outcome || '')).map(f => f.id).sort(), Object.keys(OFF_DESIGN).sort(), 'a family is left on an old outcome code without a reason in OFF_DESIGN');
    assert.equal(mine.filter(f => f.misMapped !== false).length, perOption, 'families that tie each wrong answer');
    assert.ok(mine.filter(f => f.misMapped === false).every(f => Array.isArray(f.reveals) && f.reveals.length), 'a family-level family names no misconception');
  });

  test(`Grade ${grade}: the skills with no question family yet are exactly the listed ones (new families shorten the list)`, () => {
    const has = new Set(mine.map(f => f.cskill));
    const none = Object.entries(SK).filter(([c, k]) => !k.hands && !has.has(c)).map(([c]) => c.replace(`MATH.${G}.`, ''));
    assert.deepEqual(none.sort(), [...NOFAMILY].sort());
    assert.deepEqual(Object.entries(SK).filter(([, k]) => k.hands).map(([c]) => c.replace(`MATH.${G}.`, '')).sort(), [...hands].sort(), 'hands-on skills stay with the teacher');
  });

  test(`Grade ${grade}: its families stay off for children until a teacher signs them off`, () => {
    setFamilyMode('reviewed');
    for (const f of mine.filter(x => !x.core)) assert.ok(f.reviewed === true ? isOn(f) : !isOn(f), `${f.id} is on for children without a sign-off`);
  });

  test(`Grade ${grade}: the teaching pack has a file for every sub-strand and covers every skill and library misconception`, () => {
    assert.equal(packs.length, subs);
    const packed = new Set(packs.flatMap(s => s.skills.flatMap(e => e.misconceptions.map(m => m.code))));
    for (const s of source.sub_strands) {
      for (const k of s.skills) assert.ok(teachingFor(k.code), `no pack entry for ${k.code}`);
      for (const m of s.misconceptions) assert.ok(packed.has(m.code), `no reveal question and repair for ${m.code}`);
    }
    for (const p of packs) for (const e of p.skills) assert.ok(SK[e.skill], `pack entry for unknown skill ${e.skill}`);
  });

  test(`Grade ${grade}: the generated teaching pack matches the JSON (run node scripts/build-teaching-pack.mjs)`, () => {
    const onDisk = readFileSync(new URL(`../../src/voice-tutor/teachingPackData.g${grade}.js`, import.meta.url), 'utf8');
    assert.equal(onDisk, renderData(buildPack(grade), grade), `teachingPackData.g${grade}.js is stale`);
  });

  test(`Grade ${grade}: the SQL loads every skill, prerequisite and misconception of the map (run node scripts/build-maths-sql-grade.mjs ${grade})`, () => {
    const sql = readFileSync(new URL(`../../supabase/migrations/${sqlFile}`, import.meta.url), 'utf8');
    const count = (re) => (sql.match(re) || []).length;
    assert.equal(count(/^INSERT INTO public\.curriculum_skills /gm), source.totals.skills);
    assert.equal(count(/^INSERT INTO public\.curriculum_prerequisites /gm), source.totals.prerequisites);
    assert.equal(count(/^INSERT INTO public\.curriculum_misconceptions /gm), source.totals.misconceptions);
    assert.ok(/^BEGIN;$/m.test(sql) && /^COMMIT;$/m.test(sql) && /ON CONFLICT \(code\) DO UPDATE/.test(sql), 'not one idempotent transaction');
    assert.ok(/requires_kind IN \('skill','outcome'\)/.test(readFileSync(new URL('../../supabase/migrations/20261110_curriculum.sql', import.meta.url), 'utf8')) && !/'readiness'/.test(sql), 'a prerequisite kind the table does not allow');
  });
}
