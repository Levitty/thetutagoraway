// The Grade 5 Maths standard for one Kiswahili grade (HOREB_MAPPING_PLAN.md, 18 Nov 2026), called from tests/kiswahili-g<n>.test.mjs.
// Fails if a sub-strand has no skill, a testable outcome no skill, a skill fewer than 2 prerequisites or 4 misconceptions, a
// misconception no reveal question and repair in the teaching pack, or if the generated map, the list of skills with no family
// or the SQL is stale. Build with: node scripts/build-kiswahili-grade.mjs <n>.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const NOT_TESTED = /^\s*(kuchangamkia|kufurahia|kuonea fahari|kuthamini|kujenga mazoea|kukuza mazoea|kuridhia|ufurahia)/i;
const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');
const json = (p) => JSON.parse(read(p));

export function depthTests(grade) {
  const G = `KISW.G${grade}.`;
  const source = json(`curriculum/kiswahili/g${grade}.json`);
  const subs = source.sub_strands;
  const skills = subs.flatMap(s => s.skills);
  const lib = json(`engine/data/curriculum/kiswahili.g${grade}.misconceptions.json`);
  const ready = new Set((source.readiness || []).map(r => r.code));   // Grade 1 only: KISW.PP2.READINESS.*, for a teacher to confirm
  const below = {};
  for (let g = 1; g < grade; g++) {
    const j = json(`curriculum/kiswahili/g${g}.json`);
    below[g] = new Set([...j.sub_strands.flatMap(s => (s.skills || []).map(k => k.code)), ...j.sub_strands.flatMap(s => s.outcomes.map(o => o.code))]);
  }
  const packDir = new URL(`../../curriculum/kiswahili/teaching/g${grade}/`, import.meta.url);
  const packs = readdirSync(packDir).filter(f => f.endsWith('.json')).map(f => JSON.parse(readFileSync(new URL(f, packDir), 'utf8')));

  test(`Grade ${grade} Kiswahili depth: every sub-strand has a skill and every testable outcome is carried by a skill`, () => {
    for (const s of subs) assert.ok(s.skills.length, `${s.code} has no skill`);
    const covered = new Set(skills.flatMap(k => k.outcomes));
    const left = subs.flatMap(s => s.outcomes).filter(o => !covered.has(o.code) && !NOT_TESTED.test(o.text)).map(o => o.code);
    assert.deepEqual(left, [], 'outcomes with no skill (only attitude and habit outcomes may be left)');
    assert.equal(source.totals.skills, skills.length);
    assert.equal(source.totals.misconceptions, Object.keys(lib).length);
    assert.equal(source.totals.prerequisites, skills.reduce((n, k) => n + k.prerequisites.length, 0));
  });

  test(`Grade ${grade} Kiswahili depth: every skill has a full mastery rule, at least 2 prerequisites and 4 misconceptions`, () => {
    let down = 0;
    for (const s of subs) for (const k of s.skills) {
      assert.ok(k.mastery.length > 60 && /8 of 10|four of the last five/.test(k.mastery), `${k.code}: mastery (a rule that names 8 of 10, or the first-pass evidence rule of Grades 7 to 9)`);
      assert.ok(k.question_forms.length >= 2, `${k.code}: question forms`);
      assert.ok(k.prerequisites.length >= 2, `${k.code}: only ${k.prerequisites.length} prerequisites`);
      assert.equal(new Set(k.prerequisites.map(x => x.requires)).size, k.prerequisites.length, `${k.code}: a prerequisite twice`);
      for (const x of k.prerequisites) {
        assert.ok(x.status === 'proposed' && x.reason.length > 10, `${k.code}: prerequisite ${x.requires}`);
        if (ready.has(x.requires)) { assert.equal(x.kind, 'skill'); continue; }   // Grade 1: a pre-primary readiness skill g1.json defines
        const g = Number(/^KISW\.G(\d)\./.exec(x.requires)[1]);
        if (g === grade) assert.ok(skills.some(y => y.code === x.requires) && x.kind === 'skill', `${k.code}: unknown prerequisite ${x.requires}`);
        else assert.ok(g < grade && below[g]?.has(x.requires), `${k.code}: unknown prerequisite ${x.requires}`);
      }
      const n = s.misconceptions.filter(y => y.skill === k.code).length;
      assert.ok(n >= 4, `${k.code}: only ${n} misconceptions`);
      assert.equal(k.status, 'proposed');
      if (k.prerequisites.some(x => !x.requires.startsWith(G))) down++;
    }
    assert.ok(down >= skills.length * 0.4, `only ${down} of ${skills.length} skills reach down to an earlier grade`);
  });

  test(`Grade ${grade} Kiswahili depth: every misconception is a draft with its example, cause, help, Kiswahili feedback and a source line`, () => {
    for (const [code, x] of Object.entries(lib)) {
      assert.equal(x.status, 'draft', code);
      for (const f of ['error', 'cause', 'reveals', 'help', 'feedback', 'source']) assert.ok(x[f] && String(x[f]).length > 5, `${code}: ${f}`);
      assert.ok(/to confirm by a (native Kiswahili )?teacher|to confirm by a native/i.test(x.source), `${code}: source line`);
      assert.ok(x.example.question && x.example.wrong_answer && x.example.correct_answer, `${code}: example`);
      assert.notEqual(x.example.wrong_answer, x.example.correct_answer, `${code}: the wrong answer is the right one`);
      assert.ok(!/—/.test(JSON.stringify(x)), `${code}: em dash`);
    }
  });

  test(`Grade ${grade} Kiswahili depth: the teaching pack has a file per sub-strand and covers every skill and misconception`, () => {
    assert.equal(packs.length, subs.length);
    const bySkill = new Map(packs.flatMap(f => f.skills.map(e => [e.skill, e])));
    for (const s of subs) for (const k of s.skills) {
      const e = bySkill.get(k.code);
      assert.ok(e, `no pack entry for ${k.code}`);
      assert.equal(e.checks.length, 2, `${k.code}: two checks`);
      assert.ok(e.board.some(b => ['pause', 'child_draws', 'count', 'predict'].includes(b.beat)), `${k.code}: the board gives the child a turn`);
      const want = s.misconceptions.filter(y => y.skill === k.code).map(y => y.code).sort();
      assert.deepEqual(e.misconceptions.map(y => y.code).sort(), want, `${k.code}: pack misconceptions`);
      for (const y of e.misconceptions) assert.ok(y.ask && y.repair && y.listen_for.length, `${y.code}: reveal question and repair`);
    }
    for (const f of packs) { assert.match(f.status, /^draft/); for (const e of f.skills) assert.ok(skills.some(k => k.code === e.skill), `pack entry for unknown skill ${e.skill}`); }
  });

  test(`Grade ${grade} Kiswahili depth: the families are filed under the map, and the skills with no family are listed, not hidden`, async () => {
    const entry = (await import(`../../src/ai-tutor/content/subjects/kiswahili_g${grade}.js`)).default;
    const { AWAITING } = await import(`../../src/ai-tutor/content/families/kiswahili_g${grade}_awaiting.js`);
    const used = new Set(entry.families.map(f => f.cskill));
    for (const f of entry.families) assert.ok(entry.map.skills[f.cskill], `${f.id}: unknown cskill ${f.cskill}`);
    assert.deepEqual(AWAITING, Object.keys(entry.map.skills).filter(c => !used.has(c)), `kiswahili_g${grade}_awaiting.js is stale (node scripts/build-kiswahili-grade.mjs ${grade})`);
    assert.equal(entry.awaiting, AWAITING);
    assert.ok(Object.keys(entry.map.skills).length === skills.length);
  });

  test(`Grade ${grade} Kiswahili depth: the SQL loads every skill, prerequisite and misconception (not run)`, () => {
    const sql = read(`supabase/migrations/20261125_kiswahili_g${grade}_skills_misconceptions.sql`);
    const count = (re) => (sql.match(re) || []).length;
    assert.equal(count(/^INSERT INTO public\.curriculum_skills /gm), source.totals.skills);
    assert.equal(count(/^INSERT INTO public\.curriculum_prerequisites /gm), source.totals.prerequisites);
    assert.equal(count(/^INSERT INTO public\.curriculum_misconceptions /gm), source.totals.misconceptions);
    assert.ok(/^BEGIN;$/m.test(sql) && /^COMMIT;$/m.test(sql) && /ON CONFLICT \(code\) DO UPDATE/.test(sql), 'not one idempotent transaction');
  });
}
