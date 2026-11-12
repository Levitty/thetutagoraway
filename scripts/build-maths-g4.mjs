// Merges the Grade 4 Maths skills, prerequisites and misconceptions (scripts/data/maths-g4-*.mjs, authored offline, no model call)
// into curriculum/mathematics/g4.json, which HOREB owns. Official outcomes are never touched.
//   node scripts/build-maths-g4.mjs          then:  node scripts/build-curriculum-map-g4.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { NUMBERS } from './data/maths-g4-numbers.mjs';
import { MEASURE } from './data/maths-g4-measure.mjs';
import { GEOMETRY_DATA } from './data/maths-g4-geometry-data.mjs';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';

const FILE = new URL('../curriculum/mathematics/g4.json', import.meta.url);
const g4 = JSON.parse(readFileSync(FILE, 'utf8'));
const g3 = JSON.parse(readFileSync(new URL('../curriculum/mathematics/g3.json', import.meta.url), 'utf8'));
const G3OUT = new Set(g3.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
const G3SUB = Object.fromEntries(g3.sub_strands.map(s => [s.code.split('.').slice(3).join('.'), s.code]));
const DATA = { ...NUMBERS, ...MEASURE, ...GEOMETRY_DATA };
const fail = (m) => { throw new Error(m); };
// short skill code -> full code (short codes are unique across Grade 4)
const full = {};
for (const [sub, d] of Object.entries(DATA)) for (const k of d.skills) { if (full[k.code]) fail(`duplicate skill code ${k.code}`); full[k.code] = `MATH.G4.${sub}.${k.code}`; }
const resolve = (r) => {
  if (r.startsWith('G3:')) {
    const [sub, letter] = r.slice(3).split('.');
    const subCode = G3SUB[sub] || fail(`unknown Grade 3 sub-strand ${sub}`);
    const code = `${subCode}.${letter}`;
    if (!G3OUT.has(code)) fail(`unknown Grade 3 outcome ${code}`);
    return { requires: code, kind: 'outcome' };
  }
  return { requires: full[r] || fail(`unknown prerequisite ${r}`), kind: 'skill' };
};
let nSk = 0, nMis = 0, nPre = 0;
for (const s of g4.sub_strands) {
  const key = s.code.replace('MATH.G4.', '');
  const d = DATA[key] || fail(`no data for ${key}`);
  const letters = new Set(s.outcomes.map(o => o.letter));
  s.skills = d.skills.map(k => {
    const code = `${s.code}.${k.code}`;
    for (const o of k.outcomes) if (!letters.has(o)) fail(`${code}: outcome ${o} is not in ${key}`);
    for (const h of k.horeb_skill_ids) if (!SKILLS[h]) fail(`${code}: HOREB skill ${h} does not exist`);
    const prerequisites = k.pre.map(([r, strength, reason]) => ({ ...resolve(r), strength, reason, status: 'proposed' }));
    nSk++; nPre += prerequisites.length;
    return { code, name: k.name, outcomes: k.outcomes.map(o => `${s.code}.${o}`), mastery: k.mastery, question_forms: k.question_forms, thinking: k.thinking, horeb_skill_ids: k.horeb_skill_ids, prerequisites, ...(k.hands_on ? { hands_on: k.hands_on } : {}), status: 'proposed' };
  });
  const have = new Set(d.skills.map(k => k.code));
  s.misconceptions = d.mis.map(m => {
    if (!have.has(m.skill)) fail(`${key}: misconception ${m.short} names unknown skill ${m.skill}`);
    const skill = `${s.code}.${m.skill}`;
    nMis++;
    return { code: `${skill}.${m.short}`, skill, error: m.error, example: m.example, cause: m.cause, reveals: m.reveals, help: m.help, source: m.source, status: 'draft' };
  });
  const base = (s.design_notes || '').replace(/ ?\[Grade 4 map\].*$/s, '');
  s.design_notes = `${base}${base ? ' ' : ''}[Grade 4 map] ${d.notes}`;
  const covered = new Set(s.skills.flatMap(k => k.outcomes));
  const left = s.outcomes.filter(o => !covered.has(o.code) && !/^(appreciate|use digital|use it )/i.test(o.text)).map(o => o.code);
  if (left.length) fail(`${key}: outcomes with no skill: ${left.join(', ')}`);
  const codes = new Set(); for (const m of s.misconceptions) { if (codes.has(m.code)) fail(`duplicate ${m.code}`); codes.add(m.code); }
  // every skill has at least two misconceptions
  for (const k of s.skills) if (s.misconceptions.filter(m => m.skill === k.code).length < 2) fail(`${k.code}: fewer than 2 misconceptions`);
}
g4.totals = { ...g4.totals, skills: nSk, prerequisites: nPre, misconceptions: nMis };
g4.status = 'outcomes from KICD\'s text, word for word (a few left for a person to confirm); skills and prerequisites proposed; misconceptions draft; all awaiting teacher review (12 Nov 2026)';
writeFileSync(FILE, JSON.stringify(g4, null, 1) + '\n');
console.log(`${nSk} skills, ${nPre} prerequisites, ${nMis} misconceptions`);
