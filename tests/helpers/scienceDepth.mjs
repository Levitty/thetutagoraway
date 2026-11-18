// The Grade 5 Maths standard for Science and Technology (Grades 4-6) and Integrated Science (Grades 7-9), owner 18 Nov 2026
// (Tuta Workspace/HOREB_MAPPING_PLAN.md): every testable outcome has a skill; every skill has a mastery rule, at least two
// prerequisites and four real misconceptions; every sub-strand has its teaching pack file covering every skill and misconception;
// families are filed under real skills and stay off for children. One set of checks, called by each grade's test file.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const ROOT = new URL('../../', import.meta.url);
const J = (p) => JSON.parse(readFileSync(new URL(p, ROOT), 'utf8'));
// Outcomes that are attitudes, values or interests: seen in class, not asked as questions.
export const NOT_TESTED = /^(appreciate|show interest|develop interest|advocate|acknowledge)/i;
const STOCK_CAUSES = ['The child mixes up two rules that are taught close together.', 'The child mixes up two ideas that sound alike or are taught close together.'];

function allCodes() {
  const codes = new Set();
  for (const dir of readdirSync(new URL('curriculum/', ROOT), { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)) {
    for (const f of readdirSync(new URL(`curriculum/${dir}/`, ROOT)).filter(f => /^g\d\.json$/.test(f))) {
      const d = J(`curriculum/${dir}/${f}`);
      for (const s of d.sub_strands) { for (const o of s.outcomes) codes.add(o.code); for (const k of s.skills || []) codes.add(k.code); }
    }
  }
  return codes;
}

// dir: 'science' | 'integrated_science'; subject: 'science' | 'integratedscience'; noFamilies: skill codes known to have no family yet.
// notTested: the subject's own rule for outcomes seen in class rather than asked (Social Studies adds practical tasks, 18 Nov 2026).
export function scienceDepthTests({ dir, subject, grade, outcomes, noFamilies = [], minDown = 0.5, notTested = NOT_TESTED, families = true }) {
  const source = J(`curriculum/${dir}/g${grade}.json`);
  const lib = J(`engine/data/curriculum/${subject}.g${grade}.misconceptions.json`);
  const own = `${source.sub_strands[0].code.split('.').slice(0, 2).join('.')}.`;
  const packDir = new URL(`curriculum/${dir}/teaching/g${grade}/`, ROOT);
  const packs = readdirSync(packDir).filter(f => f.endsWith('.json')).map(f => J(`curriculum/${dir}/teaching/g${grade}/${f}`));
  const skills = source.sub_strands.flatMap(s => s.skills);
  const label = `${subject} Grade ${grade}`;

  test(`${label}: the in-app map is generated from the file HOREB owns, whole, and the official outcomes are untouched`, async () => {
    const map = await import(new URL(`src/ai-tutor/content/curriculumMap.${subject}.g${grade}.js`, ROOT));
    const all = source.sub_strands.flatMap(s => s.outcomes);
    assert.equal(all.length, outcomes);
    for (const o of all) assert.match(o.status, /^kicd_(verified|read)$/, `${o.code}: outcome status changed`);
    assert.equal(Object.keys(map.OUTCOMES).length, outcomes);
    assert.equal(Object.keys(map.SKILLS).length, skills.length);
    assert.equal(source.totals.skills, skills.length);
    assert.equal(Object.keys(lib).length, source.totals.misconceptions);
    assert.equal(Object.keys(map.MIS_FEEDBACK).length, Object.keys(lib).length);
    assert.equal(source.totals.prerequisites, skills.reduce((n, k) => n + k.prerequisites.length, 0));
    for (const k of skills) assert.ok(k.outcomes.length && k.outcomes.every(o => map.OUTCOMES[o]), `${k.code}: unknown outcome`);
  });

  test(`${label}: every testable official outcome has a skill; only attitude outcomes are left out`, () => {
    for (const s of source.sub_strands) {
      const covered = new Set(s.skills.flatMap(k => k.outcomes));
      const left = s.outcomes.filter(o => !covered.has(o.code) && !notTested.test(o.text.trim()));
      assert.deepEqual(left.map(o => o.code), [], `${s.code}: outcomes with no skill`);
      assert.ok(s.skills.length, `${s.code}: no skills`);
    }
  });

  test(`${label}: every skill has a mastery rule, question forms, two or more real prerequisites and four or more misconceptions`, () => {
    const codes = allCodes();
    let down = 0;
    for (const s of source.sub_strands) for (const k of s.skills) {
      assert.ok(k.mastery.length > 60 && k.question_forms.length >= 2, `${k.code}: thin`);
      assert.equal(k.status, 'proposed');
      assert.ok(k.prerequisites.length >= 2, `${k.code}: only ${k.prerequisites.length} prerequisites`);
      assert.equal(new Set(k.prerequisites.map(p => p.requires)).size, k.prerequisites.length, `${k.code}: a prerequisite twice`);
      for (const p of k.prerequisites) {
        assert.ok(codes.has(p.requires), `${k.code}: unknown prerequisite ${p.requires}`);
        assert.notEqual(p.requires, k.code);
        assert.ok(p.status === 'proposed' && p.reason.length > 10, `${k.code}: prerequisite ${p.requires} needs a reason`);
      }
      if (k.prerequisites.some(p => !p.requires.startsWith(own))) down++;
      const ms = s.misconceptions.filter(m => m.skill === k.code);
      assert.ok(ms.length >= 4, `${k.code}: only ${ms.length} misconceptions`);
    }
    assert.ok(down >= skills.length * minDown, `only ${down} of ${skills.length} skills reach below Grade ${grade}`);
  });

  test(`${label}: every misconception is a real, specific error with its example, cause, repair, child line and source, and is a draft`, () => {
    for (const [code, m] of Object.entries(lib)) {
      for (const f of ['error', 'cause', 'reveals', 'help', 'feedback', 'source']) assert.ok(String(m[f] || '').length > 10, `${code}: no ${f}`);
      assert.ok(m.example.question && m.example.wrong_answer && m.example.correct_answer, `${code}: no example`);
      assert.notEqual(m.example.wrong_answer, m.example.correct_answer, `${code}: the wrong answer is the right one`);
      assert.ok(!STOCK_CAUSES.includes(m.cause), `${code}: stock cause, not the child's reason`);
      assert.ok(!/^(gives|names|gets) (the|a) wrong [a-z ]+\.$/i.test(m.error), `${code}: the error must say which wrong idea, not only that it is wrong`);
      assert.ok(!/does not understand/i.test(m.error), `${code}: "does not understand" is not a misconception`);
      assert.ok(/to confirm by|to be confirmed by|literature|research|verify|cited from memory/i.test(m.source), `${code}: no source line`);
      assert.equal(m.status, 'draft');
      assert.ok(!/[\u{1F300}-\u{1FAFF}]|—/u.test(m.feedback), `${code}: emoji or em dash in what a child reads`);
    }
  });

  test(`${label}: the teaching pack has a file per sub-strand covering every skill and every misconception`, () => {
    assert.equal(packs.length, source.sub_strands.length, 'one teaching pack file per sub-strand');
    const entries = new Map(packs.flatMap(p => p.skills.map(e => [e.skill, e])));
    for (const s of source.sub_strands) {
      assert.ok(packs.some(p => p.sub_strand === s.code), `${s.code}: no teaching pack file`);
      for (const k of s.skills) {
        const e = entries.get(k.code);
        assert.ok(e, `no teaching pack entry for ${k.code}`);
        assert.ok(e.key_step && e.floor?.question && e.steps.length >= 3 && e.contexts.length >= 2 && e.board.length >= 3, `${k.code}: thin pack entry`);
        assert.equal(e.checks.length, 2, `${k.code}: two checks`);
        const want = s.misconceptions.filter(m => m.skill === k.code).map(m => m.code).sort();
        assert.deepEqual(e.misconceptions.map(m => m.code).sort(), want, `${k.code}: pack misconceptions differ from the library`);
        for (const m of e.misconceptions) assert.ok(m.listen_for.length && m.ask && m.repair, `${m.code}: no listen-for, ask or repair`);
      }
    }
    for (const p of packs) {
      assert.match(p.status, /^draft/);
      for (const e of p.skills) assert.ok(skills.some(k => k.code === e.skill), `pack entry for unknown skill ${e.skill}`);
    }
  });

  // families: false for a grade with no subject entry and no families yet (Agriculture Grade 9, 18 Nov 2026).
  if (families) test(`${label}: families are filed under real skills and outcomes, stay off for children, and the skills with none are known`, async () => {
    const entry = (await import(new URL(`src/ai-tutor/content/subjects/${subject}_g${grade}.js`, ROOT))).default;
    const byCode = new Map(skills.map(k => [k.code, k]));
    for (const f of entry.families) {
      const k = byCode.get(f.cskill);
      assert.ok(k, `${f.id}: unknown cskill ${f.cskill}`);
      assert.ok(k.outcomes.includes(f.outcome), `${f.id}: outcome ${f.outcome} is not an outcome of ${f.cskill}`);
      assert.notEqual(f.reviewed, true, `${f.id} is signed`);
    }
    const none = skills.filter(k => !entry.families.some(f => f.cskill === k.code)).map(k => k.code);
    assert.deepEqual(none.sort(), [...noFamilies].sort(), 'skills with no family');
  });
}
