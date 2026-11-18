// Merges one grade's Maths skills, prerequisites and misconceptions (scripts/data/maths-g<grade>/*.mjs, authored offline)
// into curriculum/mathematics/g<grade>.json, which HOREB owns, and writes the teaching pack (curriculum/mathematics/teaching/g<grade>/*.json).
//   Grade 7 (17 Nov 2026)  scripts/data/maths-g7/   at least 1 prerequisite and 2 misconceptions per skill
//   Grade 8 (18 Nov 2026)  scripts/data/maths-g8/   the depth standard: at least 2 prerequisites and 4 misconceptions per skill
// Official outcomes are never touched. A sub-strand with no data file is left as it was (no skills yet) and listed at the end.
//   node scripts/build-maths-grade.mjs 8     then:  node scripts/build-curriculum-map-grade.mjs 8  and  node scripts/build-teaching-pack.mjs
// One builder for Grades 7 and 8 (18 Nov 2026): scripts/build-maths-g7.mjs is kept as the old command (Grade 7 output unchanged).
// Grade 6 keeps its own builder (scripts/build-maths-g6.mjs): its data came in two passes. Both share the pack rules
// (scripts/maths-teaching-pack-file.mjs).
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { packSlug, packEntries, packFileText } from './maths-teaching-pack-file.mjs';

const GRADE = Number(process.argv[2] || 7);
const RULES = {
  7: { below: [5, 6], minPre: 1, minMis: 2, when: '17 Nov 2026',
    pack: 'draft: written 17 Nov 2026 offline for the Grade 7 pilot; not yet checked by a Kenyan maths teacher; not loaded by the live tutor' },
  8: { below: [5, 6, 7], minPre: 2, minMis: 4, when: '18 Nov 2026',
    pack: 'draft: written 18 Nov 2026 offline for Grade 8; not yet checked by a Kenyan maths teacher; not loaded by the live tutor' },
}[GRADE];
if (!RULES) { console.error('usage: node scripts/build-maths-grade.mjs 7|8'); process.exit(1); }
const { SUBS } = await import(`./data/maths-g${GRADE}/index.mjs`);
const G = `G${GRADE}`;
const FILE = new URL(`../curriculum/mathematics/g${GRADE}.json`, import.meta.url);
const PACK_DIR = new URL(`../curriculum/mathematics/teaching/g${GRADE}/`, import.meta.url);
const load = (g) => JSON.parse(readFileSync(new URL(`../curriculum/mathematics/g${g}.json`, import.meta.url), 'utf8'));
const cur = load(GRADE);
const skillsOf = (j) => new Set(j.sub_strands.flatMap(s => s.skills.map(k => k.code)));
const outcomesOf = (j) => new Set(j.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
const S = {}, O = {};
for (const g of RULES.below) { const j = load(g); S[`G${g}`] = skillsOf(j); O[`G${g}`] = outcomesOf(j); }
const fail = (m) => { throw new Error(m); };
const NOT_TESTED = /^(appreciate|reflect on|promote use|promote the use|recogni[sz]e use|recogni[sz]e the use|use IT|recogni[sz]e temperature|enjoy using|spend money responsibly|admire)/i;

const byKey = new Map(SUBS.map(d => [d.key, d]));
for (const k of byKey.keys()) if (!cur.sub_strands.some(s => s.code === `MATH.${G}.${k}`)) fail(`data for unknown sub-strand ${k}`);
// every skill of every data file, so a prerequisite can point across sub-strands
const allOwn = new Set(SUBS.flatMap(d => d.skills.map(k => `MATH.${G}.${d.key}.${k.code}`)));
let nSk = 0, nMis = 0, nPre = 0;
const left = [], done = [];
mkdirSync(PACK_DIR, { recursive: true });
const packWritten = new Set();

for (const s of cur.sub_strands) {
  const key = s.code.replace(`MATH.${G}.`, '');
  const d = byKey.get(key);
  if (!d) { s.skills = []; s.misconceptions = []; left.push(key); continue; }
  const letters = new Set(s.outcomes.map(o => o.letter));
  const own = new Set(d.skills.map(k => k.code));
  // A prerequisite ref: 'G<n>:SUB.SKILL' (an earlier grade's skill), 'G<n>o:SUB.letter' (an earlier grade's outcome),
  // '<G>:SKILL' (same sub-strand) or '<G>x:SUB.SKILL' (another sub-strand of this grade).
  const resolve = (r) => {
    const [g, rest] = r.split(':');
    if (S[g]) { const c = `MATH.${g}.${rest}`; if (!S[g].has(c)) fail(`${key}: unknown prerequisite ${c}`); return [c, 'skill']; }
    if (g.endsWith('o') && O[g.slice(0, -1)]) { const c = `MATH.${g.slice(0, -1)}.${rest}`; if (!O[g.slice(0, -1)].has(c)) fail(`${key}: unknown outcome prerequisite ${c}`); return [c, 'outcome']; }
    if (g === G) { if (!own.has(rest)) fail(`${key}: unknown own prerequisite ${rest}`); return [`${s.code}.${rest}`, 'skill']; }
    if (g === `${G}x`) { const c = `MATH.${G}.${rest}`; if (!allOwn.has(c)) fail(`${key}: unknown Grade ${GRADE} prerequisite ${c}`); return [c, 'skill']; }
    return fail(`${key}: bad prerequisite ref ${r}`);
  };
  s.skills = d.skills.map(k => {
    const code = `${s.code}.${k.code}`;
    for (const o of k.outcomes) if (!letters.has(o)) fail(`${code}: outcome ${o} is not in ${key}`);
    for (const h of k.horeb_skill_ids) if (!SKILLS[h]) fail(`${code}: HOREB skill ${h} does not exist`);
    if (k.pre.length < RULES.minPre) fail(`${code}: fewer than ${RULES.minPre} prerequisites`);
    const prerequisites = k.pre.map(([r, strength, reason]) => { const [requires, kind] = resolve(r); if (requires === code) fail(`${code}: requires itself`); return { requires, kind, strength, reason, status: 'proposed' }; });
    if (new Set(prerequisites.map(p => p.requires)).size !== prerequisites.length) fail(`${code}: a prerequisite twice`);
    nSk++; nPre += prerequisites.length;
    return { code, name: k.name, outcomes: k.outcomes.map(o => `${s.code}.${o}`), mastery: k.mastery, question_forms: k.question_forms, thinking: k.thinking, horeb_skill_ids: k.horeb_skill_ids, prerequisites, status: 'proposed' };
  });
  s.misconceptions = d.mis.map(m => {
    if (!own.has(m.skill)) fail(`${key}: misconception ${m.short} names unknown skill ${m.skill}`);
    const skill = `${s.code}.${m.skill}`; nMis++;
    if (m.example.wrong_answer === m.example.correct_answer) fail(`${skill}.${m.short}: the wrong answer is the right one`);
    return { code: `${skill}.${m.short}`, skill, error: m.error, example: m.example, cause: m.cause, reveals: m.reveals, help: m.help, source: m.source, status: 'draft' };
  });
  // the notes are added once (the Grade 7 builder appended them on every run: run it twice and they repeated)
  if (d.notes && !(s.design_notes || '').includes(d.notes)) s.design_notes = [s.design_notes, d.notes].filter(Boolean).join(' ');
  const covered = new Set(s.skills.flatMap(k => k.outcomes));
  const miss = s.outcomes.filter(o => !covered.has(o.code) && !NOT_TESTED.test(o.text)).map(o => o.code);
  if (miss.length) fail(`${key}: outcomes with no skill: ${miss.join(', ')}`);
  const codes = new Set();
  for (const m of s.misconceptions) { if (codes.has(m.code)) fail(`duplicate ${m.code}`); codes.add(m.code); }
  for (const k of s.skills) if (s.misconceptions.filter(m => m.skill === k.code).length < RULES.minMis) fail(`${k.code}: fewer than ${RULES.minMis} misconceptions`);
  done.push(key);

  // ---- the teaching pack file for this sub-strand (rules shared with Grade 6: scripts/maths-teaching-pack-file.mjs)
  const slug = packSlug(s);
  writeFileSync(new URL(slug, PACK_DIR), packFileText(s, packEntries(s, d.skills.map(k => k.code), d.pack), RULES.pack, d.packNotes || d.notes || ''));
  packWritten.add(slug);
}
for (const f of readdirSync(PACK_DIR)) if (f.endsWith('.json') && !packWritten.has(f)) unlinkSync(new URL(f, PACK_DIR));
cur.totals = { ...cur.totals, skills: nSk, prerequisites: nPre, misconceptions: nMis };
cur.status = `outcomes from KICD's text, word for word; skills and prerequisites proposed; misconceptions draft; all awaiting teacher review (${RULES.when})` + (left.length ? `; no skills yet for: ${left.join(', ')}` : '');
writeFileSync(FILE, JSON.stringify(cur, null, 1) + '\n');
console.log(`${nSk} skills, ${nPre} prerequisites, ${nMis} misconceptions in ${done.length} of ${cur.sub_strands.length} sub-strands. Still without skills: ${left.join(', ') || 'none'}`);
