// Merges the Grade 6 Maths skills, prerequisites and misconceptions (scripts/data/maths-g6-*.mjs, authored offline)
// into curriculum/mathematics/g6.json, which HOREB owns. Official outcomes are never touched.
// The depth pass (18 Nov 2026, to the Grade 7 standard) adds, per sub-strand, scripts/data/maths-g6/<sub-strand>.mjs:
// more prerequisites per skill (`pre`), more misconceptions (`mis`) and the teaching pack (`pack`), written to
// curriculum/mathematics/teaching/g6/*.json with the same rules as Grade 7 (scripts/maths-teaching-pack-file.mjs).
//   node scripts/build-maths-g6.mjs          then:  node scripts/build-curriculum-map-g6.mjs  and  node scripts/build-teaching-pack.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { DEPTH } from './data/maths-g6/index.mjs';
import { packSlug, packEntries, packFileText } from './maths-teaching-pack-file.mjs';
import { NUMBERS } from './data/maths-g6-numbers.mjs';
import { MEASURE } from './data/maths-g6-measure.mjs';
import { GEOMETRY_DATA } from './data/maths-g6-geometry-data.mjs';
import { EXTRA_MIS } from './data/maths-g6-extra.mjs';
import { FIXES } from './data/maths-g6-fixes.mjs';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';

const FILE = new URL('../curriculum/mathematics/g6.json', import.meta.url);
const PACK_DIR = new URL('../curriculum/mathematics/teaching/g6/', import.meta.url);
const PACK_STATUS = 'draft: written 18 Nov 2026 offline for Grade 6; not yet checked by a Kenyan maths teacher; not loaded by the live tutor';
const g6 = JSON.parse(readFileSync(FILE, 'utf8'));
const g5 = JSON.parse(readFileSync(new URL('../curriculum/mathematics/g5.json', import.meta.url), 'utf8'));
const G5 = new Set(g5.sub_strands.flatMap(s => s.skills.map(k => k.code)));
const DATA = { ...NUMBERS, ...MEASURE, ...GEOMETRY_DATA };
const full = (c) => (c.startsWith('G5:') ? `MATH.G5.${c.slice(3)}` : `MATH.G6.${c.slice(3)}`);
const fail = (m) => { throw new Error(m); };
const allSkills = new Set(Object.entries(DATA).flatMap(([sub, d]) => d.skills.map(k => `MATH.G6.${sub}.${k.code}`)));
let nSk = 0, nMis = 0, nPre = 0;
const used = new Set();
const deep = new Map(DEPTH.map(x => [x.key, x]));
for (const k of deep.keys()) if (!DATA[k]) fail(`depth data for unknown sub-strand ${k}`);
mkdirSync(PACK_DIR, { recursive: true });
const packWritten = new Set(), shallow = [];
for (const s of g6.sub_strands) {
  const key = s.code.replace('MATH.G6.', '');
  const d = DATA[key];
  if (!d) fail(`no data for ${key}`);
  const x = deep.get(key);
  const have = new Set(d.skills.map(k => k.code));
  for (const c of Object.keys(x?.pre || {})) if (!have.has(c)) fail(`${key}: extra prerequisites for unknown skill ${c}`);
  const letters = new Set(s.outcomes.map(o => o.letter));
  s.skills = d.skills.map(k => {
    const code = `${s.code}.${k.code}`;
    for (const o of k.outcomes) if (!letters.has(o)) fail(`${code}: outcome ${o} is not in ${key}`);
    for (const h of k.horeb_skill_ids) if (!SKILLS[h]) fail(`${code}: HOREB skill ${h} does not exist`);
    const prerequisites = [...k.pre, ...(x?.pre?.[k.code] || [])].map(([r, strength, reason]) => {
      const requires = full(r);
      if (requires === code) fail(`${code}: requires itself`);
      if (r.startsWith('G5:') ? !G5.has(requires) : !allSkills.has(requires)) fail(`${code}: unknown prerequisite ${requires}`);
      return { requires, kind: 'skill', strength, reason, status: 'proposed' };
    });
    nSk++; nPre += prerequisites.length;
    return { code, name: k.name, outcomes: k.outcomes.map(o => `${s.code}.${o}`), mastery: k.mastery, question_forms: k.question_forms, thinking: k.thinking, horeb_skill_ids: k.horeb_skill_ids, prerequisites, ...(k.hands_on ? { hands_on: k.hands_on } : {}), status: 'proposed' };
  });
  s.misconceptions = [...d.mis, ...(EXTRA_MIS[key] || []), ...(x?.mis || [])].map(m => {
    if (!have.has(m.skill)) fail(`${key}: misconception ${m.short} names unknown skill ${m.skill}`);
    const skill = `${s.code}.${m.skill}`;
    nMis++;
    const fx = FIXES[`${m.skill}.${m.short}`];
    if (fx) used.add(`${m.skill}.${m.short}`);
    return { code: `${skill}.${m.short}`, skill, error: fx?.error || m.error, example: fx?.example || m.example, cause: m.cause, reveals: m.reveals, help: m.help, source: m.source, status: 'draft' };
  });
  s.design_notes = d.notes;
  // every testable outcome has a skill; attitude outcomes are the only ones left out
  const covered = new Set(s.skills.flatMap(k => k.outcomes));
  const left = s.outcomes.filter(o => !covered.has(o.code) && !/^appreciate/.test(o.text)).map(o => o.code);
  if (left.length) fail(`${key}: outcomes with no skill: ${left.join(', ')}`);
  const codes = new Set(); for (const m of s.misconceptions) { if (codes.has(m.code)) fail(`duplicate ${m.code}`); codes.add(m.code); }
  for (const k of s.skills) { const p = new Set(); for (const r of k.prerequisites) { if (p.has(r.requires)) fail(`${k.code}: prerequisite ${r.requires} twice`); p.add(r.requires); } }
  if (!x) { shallow.push(key); continue; }
  // the depth pass: every skill at least two prerequisites and four misconceptions, and a teaching pack file
  for (const k of s.skills) {
    if (k.prerequisites.length < 2) fail(`${k.code}: fewer than two prerequisites`);
    if (s.misconceptions.filter(m => m.skill === k.code).length < 4) fail(`${k.code}: fewer than four misconceptions`);
  }
  const slug = packSlug(s);
  writeFileSync(new URL(slug, PACK_DIR), packFileText(s, packEntries(s, d.skills.map(k => k.code), x.pack), PACK_STATUS, x.packNotes || ''));
  packWritten.add(slug);
}
for (const f of readdirSync(PACK_DIR)) if (f.endsWith('.json') && !packWritten.has(f)) unlinkSync(new URL(f, PACK_DIR));
for (const k of Object.keys(FIXES)) if (!used.has(k)) fail(`fix ${k} matches no misconception`);
g6.totals = { ...g6.totals, skills: nSk, prerequisites: nPre, misconceptions: nMis };
g6.status = 'outcomes from KICD\'s text, word for word; skills, prerequisites proposed; misconceptions draft; all awaiting teacher review (12 Nov 2026; deepened with a teaching pack 18 Nov 2026)' + (shallow.length ? `; not yet deepened: ${shallow.join(', ')}` : '');
writeFileSync(FILE, JSON.stringify(g6, null, 1) + '\n');
console.log(`${nSk} skills, ${nPre} prerequisites, ${nMis} misconceptions; teaching pack for ${packWritten.size} of ${g6.sub_strands.length} sub-strands. Not yet deepened: ${shallow.join(', ') || 'none'}`);
