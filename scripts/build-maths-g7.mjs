// Merges the Grade 7 Maths skills, prerequisites and misconceptions (scripts/data/maths-g7/*.mjs, authored offline, 17 Nov 2026)
// into curriculum/mathematics/g7.json, which HOREB owns, and writes the teaching pack (curriculum/mathematics/teaching/g7/*.json).
// Official outcomes are never touched. A sub-strand with no data file is left as it was (no skills yet) and listed at the end.
//   node scripts/build-maths-g7.mjs          then:  node scripts/build-curriculum-map-grade.mjs 7  and  node scripts/build-teaching-pack.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { SUBS } from './data/maths-g7/index.mjs';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';

const FILE = new URL('../curriculum/mathematics/g7.json', import.meta.url);
const PACK_DIR = new URL('../curriculum/mathematics/teaching/g7/', import.meta.url);
const load = (g) => JSON.parse(readFileSync(new URL(`../curriculum/mathematics/${g}.json`, import.meta.url), 'utf8'));
const g7 = load('g7'), g6 = load('g6'), g5 = load('g5');
const skillsOf = (j) => new Set(j.sub_strands.flatMap(s => s.skills.map(k => k.code)));
const outcomesOf = (j) => new Set(j.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
const S = { G5: skillsOf(g5), G6: skillsOf(g6) }, O = { G5: outcomesOf(g5), G6: outcomesOf(g6) };
const fail = (m) => { throw new Error(m); };
const NOT_TESTED = /^(appreciate|reflect on|promote use|recogni[sz]e use|use IT|recogni[sz]e temperature)/;
const BEATS = new Set(['draw', 'point', 'count', 'predict', 'pause', 'child_draws', 'reveal', 'write']);
const CHILD = new Set(['pause', 'child_draws', 'count', 'predict']);

const byKey = new Map(SUBS.map(d => [d.key, d]));
for (const k of byKey.keys()) if (!g7.sub_strands.some(s => s.code === `MATH.G7.${k}`)) fail(`data for unknown sub-strand ${k}`);
// every skill of every data file, so a prerequisite can point across sub-strands
const allG7 = new Set(SUBS.flatMap(d => d.skills.map(k => `MATH.G7.${d.key}.${k.code}`)));
let nSk = 0, nMis = 0, nPre = 0;
const left = [], done = [];
mkdirSync(PACK_DIR, { recursive: true });
const packWritten = new Set();

for (const s of g7.sub_strands) {
  const key = s.code.replace('MATH.G7.', '');
  const d = byKey.get(key);
  if (!d) { s.skills = []; s.misconceptions = []; left.push(key); continue; }
  const letters = new Set(s.outcomes.map(o => o.letter));
  const own = new Set(d.skills.map(k => k.code));
  const resolve = (r) => {
    const [g, rest] = r.split(':');
    if (g === 'G5' || g === 'G6') { const c = `MATH.${g}.${rest}`; if (!S[g].has(c)) fail(`${key}: unknown prerequisite ${c}`); return [c, 'skill']; }
    if (g === 'G5o' || g === 'G6o') { const c = `MATH.${g.slice(0, 2)}.${rest}`; if (!O[g.slice(0, 2)].has(c)) fail(`${key}: unknown outcome prerequisite ${c}`); return [c, 'outcome']; }
    if (g === 'G7') { if (!own.has(rest)) fail(`${key}: unknown own prerequisite ${rest}`); return [`${s.code}.${rest}`, 'skill']; }
    if (g === 'G7x') { const c = `MATH.G7.${rest}`; if (!allG7.has(c)) fail(`${key}: unknown Grade 7 prerequisite ${c}`); return [c, 'skill']; }
    return fail(`${key}: bad prerequisite ref ${r}`);
  };
  s.skills = d.skills.map(k => {
    const code = `${s.code}.${k.code}`;
    for (const o of k.outcomes) if (!letters.has(o)) fail(`${code}: outcome ${o} is not in ${key}`);
    for (const h of k.horeb_skill_ids) if (!SKILLS[h]) fail(`${code}: HOREB skill ${h} does not exist`);
    if (!k.pre.length) fail(`${code}: no prerequisite`);
    const prerequisites = k.pre.map(([r, strength, reason]) => { const [requires, kind] = resolve(r); if (requires === code) fail(`${code}: requires itself`); return { requires, kind, strength, reason, status: 'proposed' }; });
    nSk++; nPre += prerequisites.length;
    return { code, name: k.name, outcomes: k.outcomes.map(o => `${s.code}.${o}`), mastery: k.mastery, question_forms: k.question_forms, thinking: k.thinking, horeb_skill_ids: k.horeb_skill_ids, prerequisites, status: 'proposed' };
  });
  s.misconceptions = d.mis.map(m => {
    if (!own.has(m.skill)) fail(`${key}: misconception ${m.short} names unknown skill ${m.skill}`);
    const skill = `${s.code}.${m.skill}`; nMis++;
    return { code: `${skill}.${m.short}`, skill, error: m.error, example: m.example, cause: m.cause, reveals: m.reveals, help: m.help, source: m.source, status: 'draft' };
  });
  s.design_notes = [s.design_notes, d.notes].filter(Boolean).join(' ');
  const covered = new Set(s.skills.flatMap(k => k.outcomes));
  const miss = s.outcomes.filter(o => !covered.has(o.code) && !NOT_TESTED.test(o.text)).map(o => o.code);
  if (miss.length) fail(`${key}: outcomes with no skill: ${miss.join(', ')}`);
  const codes = new Set();
  for (const m of s.misconceptions) { if (codes.has(m.code)) fail(`duplicate ${m.code}`); codes.add(m.code); }
  for (const k of s.skills) if (s.misconceptions.filter(m => m.skill === k.code).length < 2) fail(`${k.code}: fewer than two misconceptions`);
  done.push(key);

  // ---- the teaching pack file for this sub-strand
  const slug = `${s.number}-${s.sub_strand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.json`;
  const entries = d.skills.map(k => {
    const p = d.pack[k.code]; if (!p) fail(`${key}: no teaching pack entry for ${k.code}`);
    const code = `${s.code}.${k.code}`;
    const need = s.misconceptions.filter(m => m.skill === code).map(m => m.code.slice(code.length + 1));
    for (const n of need) if (!p.mis[n]) fail(`${code}: teaching pack has no entry for misconception ${n}`);
    for (const n of Object.keys(p.mis)) if (!need.includes(n)) fail(`${code}: teaching pack names ${n}, which is not in the library`);
    if (p.checks.length !== 2) fail(`${code}: exactly two checks`);
    if (!p.board.some(b => CHILD.has(b[0]))) fail(`${code}: board never gives the child a turn`);
    const bi = p.board.findIndex(b => CHILD.has(b[0])), ri = p.board.findIndex(b => b[0] === 'reveal');
    if (ri >= 0 && ri < bi) fail(`${code}: reveal before the child's turn`);
    for (const b of p.board) if (!BEATS.has(b[0])) fail(`${code}: unknown beat ${b[0]}`);
    return {
      skill: code, key_step: p.key_step,
      floor: { prerequisite: p.floor[0], question: p.floor[1], answer: p.floor[2] },
      representations: p.reps, steps: p.steps, contexts: p.contexts,
      board: p.board.map(([beat, doIt, say]) => ({ beat, do: doIt, ...(say ? { say } : {}) })),
      misconceptions: need.map(n => ({ code: `${code}.${n}`, listen_for: p.mis[n][0], ask: p.mis[n][1], repair: p.mis[n][2] })),
      checks: p.checks.map(([question, answer, shows]) => ({ question, answer, shows })),
    };
  });
  writeFileSync(new URL(slug, PACK_DIR), JSON.stringify({
    sub_strand: s.code, title: s.sub_strand,
    status: 'draft: written 17 Nov 2026 offline for the Grade 7 pilot; not yet checked by a Kenyan maths teacher; not loaded by the live tutor',
    sources: [], notes: d.packNotes || d.notes || '', skills: entries,
  }, null, 1) + '\n');
  packWritten.add(slug);
}
for (const f of readdirSync(PACK_DIR)) if (f.endsWith('.json') && !packWritten.has(f)) unlinkSync(new URL(f, PACK_DIR));
g7.totals = { ...g7.totals, skills: nSk, prerequisites: nPre, misconceptions: nMis };
g7.status = "outcomes from KICD's text, word for word; skills and prerequisites proposed; misconceptions draft; all awaiting teacher review (17 Nov 2026)" + (left.length ? `; no skills yet for: ${left.join(', ')}` : '');
writeFileSync(FILE, JSON.stringify(g7, null, 1) + '\n');
console.log(`${nSk} skills, ${nPre} prerequisites, ${nMis} misconceptions in ${done.length} of ${g7.sub_strands.length} sub-strands. Still without skills: ${left.join(', ') || 'none'}`);
