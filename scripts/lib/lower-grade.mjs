// ============================================================================
// GRADES 1 TO 3, ANY SUBJECT, TO THE GRADE 5 MATHS STANDARD (owner, 18-19 Nov 2026; Tuta Workspace/HOREB_MAPPING_PLAN.md).
// The lower-primary files had KICD outcomes only: no first pass, no question families, no subject entry. Every skill is NEW
// (scripts/lib/subject-depth.mjs, the general pass), and this adds what Grades 1 to 3 need on top of it:
//   - prerequisites written 'G2o:SUB.KEY.a' (an outcome of the grade below) name the grade below's SKILL once that grade is built
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
import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const fail = (m) => { throw new Error(m); };

// data.NEW pre lists, rewritten so a lower-grade outcome becomes that grade's skill where one covers it (deduplicated).
//   lower(g) -> the grade-g JSON or null; outcomePrefix(g) -> 'ENVI.G2.' / 'CRE.G2.'
export function switchLowerRefs(NEW, { lower, outcomePrefix }) {
  const cover = (g, code) => { const j = lower(g); if (!j) return null; for (const s of j.sub_strands) for (const k of s.skills || []) if (k.outcomes.includes(code)) return k.code; return null; };
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
    if (!indicators.length) fail(`${s.code}: no KICD rubric indicators to mark with`);
    k.teacher_rubric = { outcomes: outs.map(o => o.code), indicators, by: 'teacher' };
    k.mastery = `${k.mastery} Practical, marked by the teacher with the KICD rubric (${indicators.join(', ')}), never as a phone question: ${outs.map(o => `${o.letter}) ${o.text.trim()}`).join('; ')}.`;
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
