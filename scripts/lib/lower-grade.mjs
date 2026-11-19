// ============================================================================
// GRADES 1 TO 3, ANY SUBJECT, TO THE GRADE 5 MATHS STANDARD (owner, 18-19 Nov 2026; Tuta Workspace/HOREB_MAPPING_PLAN.md).
// The lower-primary files had KICD outcomes only: no first pass, no question families, no subject entry. Every skill is NEW
// (scripts/lib/subject-depth.mjs, the general pass), and this adds what Grades 1 to 3 need on top of it:
//   - prerequisites written 'G2o:SUB.KEY.a' (an outcome of the grade below) name the grade below's SKILL once that grade is built
//     (the skill that asks it, or whose teacher's rubric marks it)
//     (rebuild the higher grade after the lower one); two outcomes taken by one skill stay one prerequisite, the other keeps its
//     outcome ('G2o!:' forces the outcome);
//   - Grade 1 may name pre-primary readiness skills, 'PP:NAME', that HOREB defines (KICD's PP1-PP2 design is not in this
//     repository); written to g1.json as `readiness` (<SUBJECT>.PP2.READINESS.NAME), for a teacher to confirm;
//   - practical and observation outcomes (clean, wash, make, model, draw, play, sing, record, conserve...) are marked by the
//     teacher with the KICD rubric through a knowledge skill: `rubric: ['b']` on a NEW skill writes teacher_rubric
//     { outcomes, indicators, by: 'teacher' } and says so in its mastery rule, never a phone question;
//   - every skill goes in the awaiting list (no families yet), and the SQL deletes outcome prerequisites a first run left behind.
// Used by scripts/build-cre-grade.mjs 1|2|3 and scripts/build-environmental-grade.mjs 1|2|3.
// ============================================================================
import { writeFileSync, existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const fail = (m) => { throw new Error(m); };

// data.NEW pre lists, rewritten so a lower-grade outcome becomes that grade's skill where one covers it (deduplicated).
//   lower(g) -> the grade-g JSON or null; outcomePrefix(g) -> 'ENVI.G2.' / 'CRE.G2.'
export function switchLowerRefs(NEW, { lower, outcomePrefix }) {
  const cover = (g, code) => { const j = lower(g); if (!j) return null; for (const s of j.sub_strands) for (const k of s.skills || []) if (k.outcomes.includes(code) || (k.teacher_rubric?.outcomes || []).includes(code)) return k.code; return null; };
  let switched = 0, kept = 0;
  for (const n of NEW) {
    const seen = new Set();
    n.pre = (n.pre || []).map(p => {
      const m = /^G(\d)o:(.+)$/.exec(p[0]);
      if (!m) { seen.add(p[0]); return p; }
      const skill = cover(Number(m[1]), `${outcomePrefix(Number(m[1]))}${m[2]}`);
      if (skill && !seen.has(skill)) { seen.add(skill); switched++; return [`SKILL:${skill}`, ...p.slice(1)]; }
      kept++; return [`G${m[1]}o!:${m[2]}`, ...p.slice(1)];
    });
  }
  return { switched, kept };
}

// The resolveExtra hook for deepenGrade: 'SKILL:<code>' (a switched lower-grade skill), 'G2o!:<x>' (an outcome kept as an
// outcome), 'PP:<NAME>' (a readiness skill of Grade 1).
export function lowerResolver({ lower, outcomePrefix, readiness, readinessPrefix }) {
  const ready = new Set((readiness || []).map(r => r.code));
  return (r) => {
    if (r.startsWith('SKILL:')) return [r.slice(6), 'skill'];
    const m = /^G(\d)o!:(.+)$/.exec(r);
    if (m) {
      const code = `${outcomePrefix(Number(m[1]))}${m[2]}`, j = lower(Number(m[1]));
      if (!j || !j.sub_strands.some(s => s.outcomes.some(o => o.code === code))) fail(`unknown outcome ${code}`);
      return [code, 'outcome'];
    }
    if (r.startsWith('PP:')) { if (!ready.has(r.slice(3))) fail(`unknown readiness skill ${r}`); return [`${readinessPrefix}${r.slice(3)}`, 'skill']; }
    return null;
  };
}

// Outcomes a NEW skill sends to the teacher's rubric count as covered, as do attitudes (base regex).
export function notTestedWith(cur, NEW, subPrefix, base) {
  const texts = new Set();
  for (const n of NEW) for (const l of n.rubric || []) {
    const s = cur.sub_strands.find(x => x.code === `${subPrefix}${n.sub}`) || fail(`no sub-strand ${n.sub}`);
    const o = s.outcomes.find(x => x.code === `${s.code}.${l}`) || fail(`${n.id}: no rubric outcome ${l}`);
    texts.add(o.text.trim());
  }
  return { test: (t) => base.test(t) || texts.has(t), source: base.source };
}

// After deepenGrade: write teacher_rubric on the skills whose NEW entry names practical outcomes.
export function applyRubrics(cur, NEW, { subPrefix, skillPrefix, attitude }) {
  let n = 0;
  for (const d of NEW) {
    if (!d.rubric) continue;
    const s = cur.sub_strands.find(x => x.code === `${subPrefix}${d.sub}`);
    const k = s.skills.find(x => x.code === `${skillPrefix}${d.sub}.${d.id}`) || fail(`no skill ${d.id}`);
    const outs = d.rubric.map(l => s.outcomes.find(o => o.code === `${s.code}.${l}`));
    for (const o of outs) if (attitude.test(o.text.trim())) fail(`${o.code} is an attitude, not a practical outcome`);
    for (const o of outs) if (k.outcomes.includes(o.code)) fail(`${o.code} is both asked and marked by the teacher`);
    const indicators = s.rubric_indicators && s.rubric_indicators.length ? s.rubric_indicators : (cur.rubrics || []).filter(r => r.covers.includes(s.code)).flatMap(r => r.indicators.map(i => i.code));
    // CRE Grade 3 strands 4 and 5 have no rubric in the file (the text layer did not carry it): the teacher marks with the KICD
    // design's rubric for the strand, named as missing so a reviewer adds its codes.
    k.teacher_rubric = { outcomes: outs.map(o => o.code), indicators, by: 'teacher', ...(indicators.length ? {} : { note: 'the KICD rubric for this strand is not in the file; the teacher uses the printed design' }) };
    k.mastery = `${k.mastery} Practical, marked by the teacher with the KICD rubric (${indicators.length ? indicators.join(', ') : 'the strand\'s rubric in the printed KICD design; not in this file'}), never as a phone question: ${outs.map(o => `${o.letter}) ${o.text.trim()}`).join('; ')}.`;
    n += outs.length;
  }
  return n;
}

// No families and no subject entry yet: every skill is awaiting one.
export function writeAwaitingAll(root, file, cur, { label, generator }) {
  const list = cur.sub_strands.flatMap(s => s.skills.map(k => k.code));
  writeFileSync(join(root, file),
    `// GENERATED by ${generator}. Do not edit by hand.\n` +
    `// The ${label} skills that have no question family yet (${list.length} of ${list.length}: no families and no subject entry exist).\n` +
    `// The checks list them for the family writers instead of failing; a skill that gets a family must leave this list (rebuild).\n` +
    `export const AWAITING = ${JSON.stringify(list, null, 1)};\n`);
  return list.length;
}

// The SQL of a grade whose prerequisites may now name the grade below's skills: drop the proposed outcome prerequisites an
// earlier run left that this build no longer writes (the ones it still writes are kept).
export function withOutcomeCleanup(sqlText, cur, skillLike) {
  const keep = cur.sub_strands.flatMap(s => s.skills.flatMap(k => k.prerequisites.filter(p => p.kind === 'outcome').map(p => `'${k.code}|${p.requires}'`)));
  const and = keep.length ? ` AND (skill_code || '|' || requires_code) <> ALL (ARRAY[${keep.join(', ')}]::text[])` : '';
  return sqlText.replace(/^COMMIT;$/m, `DELETE FROM public.curriculum_prerequisites WHERE skill_code LIKE '${skillLike}' AND requires_kind = 'outcome' AND status = 'proposed'${and};\nCOMMIT;`);
}

export const exists = existsSync;

// GRADES 4 AND UP (19 Nov 2026): the Grade 4-7 maps were built before Grades 1-3 had skills, so their prerequisites named
// Grade 1-3 OUTCOMES. Now those grades are built, each such outcome becomes the Grade 1-3 skill that asks it (the first listed),
// or else the skill whose teacher's rubric marks it. Outcomes no Grade 1-3 skill carries (attitudes) stay outcomes.
// Run on the finished grade JSON, after every prerequisite is in, by the grade's builder:
//   scripts/build-science-g4.mjs, build-socialstudies-g4|g5|g7.mjs, build-agriculture-grade.mjs, build-cre-grade.mjs,
//   build-english-g4.mjs, build-kiswahili-grade.mjs.
// A moved outcome whose skill the skill already names is dropped (one prerequisite, not two); every skill must keep two or more.
// The SQL deletes the outcome prerequisites an earlier run wrote (withOutcomeCleanup, or build-maths-sql-grade.mjs).
const LOWER_INDEX = new Map();   // root -> Map(outcome code -> [skills that ask it..., skills whose rubric marks it...])
function lowerIndex(root) {
  if (LOWER_INDEX.has(root)) return LOWER_INDEX.get(root);
  const asks = new Map(), marks = new Map();
  const dir = join(root, 'curriculum');
  for (const subject of readdirSync(dir)) for (const g of [1, 2, 3]) {
    const f = join(dir, subject, `g${g}.json`);
    if (!existsSync(f)) continue;
    for (const s of JSON.parse(readFileSync(f, 'utf8')).sub_strands || []) for (const k of s.skills || []) {
      for (const o of k.outcomes || []) (asks.get(o) || asks.set(o, []).get(o)).push(k.code);
      for (const o of k.teacher_rubric?.outcomes || []) (marks.get(o) || marks.set(o, []).get(o)).push(k.code);
    }
  }
  const idx = new Map([...marks, ...asks].map(([o]) => [o, [...(asks.get(o) || []), ...(marks.get(o) || [])]]));
  LOWER_INDEX.set(root, idx);
  return idx;
}

export function relinkLowerOutcomes(cur, { root, label }) {
  const idx = lowerIndex(root);
  let moved = 0, merged = 0;
  const kept = [], short = [];
  for (const s of cur.sub_strands) for (const k of s.skills || []) {
    const next = [];
    for (const p of k.prerequisites) {
      const lower = p.kind === 'outcome' && /^[A-Z]+\.G[123]\./.test(p.requires);
      const skill = lower ? (idx.get(p.requires) || [])[0] : null;
      if (lower && !skill) kept.push(p.requires);
      const q = skill ? { ...p, requires: skill, kind: 'skill' } : p;
      if (skill) moved++;
      const twin = next.find(x => x.requires === q.requires);
      if (twin) {   // two outcomes carried by one skill: one prerequisite, with the fuller reason and the stronger strength
        merged++;
        if (q.reason.length > twin.reason.length) twin.reason = q.reason;
        if (q.strength === 'essential') twin.strength = 'essential';
        continue;
      }
      next.push(q);
    }
    k.prerequisites = next;
    if (new Set(next.map(p => p.requires)).size < 2) short.push(k.code);
  }
  if (short.length) fail(`${label}: fewer than two prerequisites once Grade 1-3 outcomes name their skills (add another): ${short.join(', ')}`);
  const all = cur.sub_strands.flatMap(s => s.skills || []);
  cur.totals = { ...cur.totals, prerequisites: all.reduce((n, k) => n + k.prerequisites.length, 0) };
  return { moved, merged, kept };
}
