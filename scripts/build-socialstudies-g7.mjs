// ============================================================================
// SOCIAL STUDIES GRADE 7: merge the authored skills and misconception library into the file HOREB owns
// (curriculum/social_studies/g7.json); the official outcomes, rubrics and sub-strand text are never touched.
//   node scripts/build-socialstudies-g7.mjs      then  npm run subject:map -- socialstudies 7 --dir social_studies --title "Social Studies"
// Idempotent: skills, prerequisites and misconceptions are rebuilt from scripts/data/socialstudies-g7-skills.mjs every run.
// Prerequisites go back to Grade 6 skills (G6:KEY) and within Grade 7 (S:KEY). Grade 6 already holds forward links (leads_to) into
// Grade 7 outcomes: this script makes sure each is honoured, i.e. the Grade 7 skill that covers the outcome lists that Grade 6 skill
// as a prerequisite (added when the authored data lacks it). Forward links to Grade 8 are listed by hand in LEADS8 and checked here.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import * as D from './data/socialstudies-g7-skills.mjs';
import { SUBS as DEPTH } from './data/socialstudies-depth/g7.mjs';
import { applyDepth } from './science-depth.mjs';
import { relinkLowerOutcomes } from './lib/lower-grade.mjs';

const path = new URL('../curriculum/social_studies/g7.json', import.meta.url);
const g7 = JSON.parse(readFileSync(path, 'utf8'));
const g6 = JSON.parse(readFileSync(new URL('../curriculum/social_studies/g6.json', import.meta.url), 'utf8'));
const g8 = JSON.parse(readFileSync(new URL('../curriculum/social_studies/g8.json', import.meta.url), 'utf8'));
const G6 = new Map(g6.sub_strands.flatMap(s => (s.skills || []).map(k => [k.code.split('.').pop(), k.code])));
const G6LEADS = g6.sub_strands.flatMap(s => (s.skills || []).flatMap(k => (k.leads_to || []).map(o => [k.code, o])));   // [G6 skill code, G7 outcome code]
const G8 = new Set(g8.sub_strands.flatMap(s => s.outcomes.map(o => o.code)));
const P = 'SOCI.G7.';
const subOf = (key) => { const s = g7.sub_strands.find(x => x.code === `${P}${key}`); if (!s) throw new Error(`no sub-strand ${key}`); return s; };
for (const s of g7.sub_strands) { s.skills = []; s.misconceptions = []; }
const codeOf = (sub, key) => `${P}${sub}.${key}`;
const SKILL_CODES = new Map(D.SKILLS.map(([sub, key]) => [key, codeOf(sub, key)]));
if (SKILL_CODES.size !== D.SKILLS.length) throw new Error('duplicate skill key');
const G6REASON = 'Grade 6 Social Studies taught it first. Proposed, to confirm by a teacher.';
const resolve = (ref) => {
  const [kind, key] = [ref.slice(0, ref.indexOf(':')), ref.slice(ref.indexOf(':') + 1)];
  if (kind === 'G6') { if (!G6.has(key)) throw new Error(`unknown Grade 6 skill ${key}`); return { requires: G6.get(key), kind: 'skill', reason: G6REASON }; }
  if (!SKILL_CODES.has(key)) throw new Error(`unknown skill prerequisite ${ref}`);
  return { requires: SKILL_CODES.get(key), kind: 'skill', reason: 'This skill builds on it. Proposed, to confirm by a teacher.' };
};
let nPre = 0, nG6 = 0, nLead = 0, nAdded = 0;
const covers = new Map();   // G7 outcome code -> skill codes
for (const [subKey, key, name, letters, pre, forms, mastery] of D.SKILLS) {
  const sub = subOf(subKey);
  const outcomes = letters.map(l => { const o = sub.outcomes.find(x => x.letter === l); if (!o) throw new Error(`${key}: no outcome ${l}`); return o.code; });
  for (const o of outcomes) covers.set(o, [...(covers.get(o) || []), codeOf(subKey, key)]);
  const prerequisites = pre.map(r => ({ ...resolve(r), strength: 'essential', status: 'proposed' }));
  // honour every Grade 6 forward link into an outcome this skill covers
  for (const [g6code, oc] of G6LEADS) if (outcomes.includes(oc) && !prerequisites.some(p => p.requires === g6code)) {
    prerequisites.push({ requires: g6code, kind: 'skill', reason: G6REASON, strength: 'essential', status: 'proposed' }); nAdded++;
  }
  nPre += prerequisites.length; nG6 += prerequisites.filter(p => p.requires.startsWith('SOCI.G6.')).length;
  const leads_to = (D.LEADS8[key] || []).map(c => { const full = `SOCI.G8.${c}`; if (!G8.has(full)) throw new Error(`${key}: unknown Grade 8 outcome ${full}`); return full; });
  nLead += leads_to.length;
  sub.skills.push({ code: codeOf(subKey, key), name, outcomes, mastery: `${mastery} ${D.EV}`, question_forms: forms, thinking: ['recall', 'reasoning'], horeb_skill_ids: [], prerequisites, leads_to, status: 'proposed' });
}
for (const k of Object.keys(D.LEADS8)) if (!SKILL_CODES.has(k)) throw new Error(`LEADS8 names unknown skill ${k}`);
// every Grade 6 link must land on an outcome that some Grade 7 skill covers
const unhonoured = G6LEADS.filter(([, oc]) => !covers.has(oc));
if (unhonoured.length) throw new Error(`Grade 6 links to Grade 7 outcomes no skill covers: ${unhonoured.map(x => x.join(' -> ')).join('; ')}`);
const honoured = G6LEADS.filter(([g6code, oc]) => (covers.get(oc) || []).every(sc => D.SKILLS.length && g7.sub_strands.flatMap(s => s.skills).find(k => k.code === sc).prerequisites.some(p => p.requires === g6code))).length;
const subOfSkill = new Map(D.SKILLS.map(([sub, key]) => [key, sub]));
const seen = new Set();
for (const [skill, short, error, q, wrong, right, cause, help, feedback, source] of D.MIS) {
  const subKey = subOfSkill.get(skill); if (!subKey) throw new Error(`misconception ${short}: unknown skill ${skill}`);
  if (seen.has(short)) throw new Error(`duplicate ${short}`); seen.add(short);
  const sub = subOf(subKey), skillCode = codeOf(subKey, skill);
  sub.misconceptions.push({ code: `${skillCode}.${short}`, skill: skillCode, error, example: { question: q, wrong_answer: wrong, correct_answer: right }, cause, reveals: `Offer "${wrong}" next to the right answer and ask the question again in a new context.`, help, feedback, source: source || D.TCF, status: 'draft' });
}
g7.totals = { ...g7.totals, skills: D.SKILLS.length, prerequisites: nPre, misconceptions: D.MIS.length };
g7.status = "outcomes from KICD's text, word for word; skills, prerequisites and misconceptions proposed (authored offline, 13 Nov 2026), awaiting teacher review. Practical, performance and attitude outcomes are listed in docs/qa/socialstudies-g7-non-question-outcomes-2026-11-13.md";
// Depth pass (18 Nov 2026): scripts/data/socialstudies-depth/g7.mjs adds prerequisites, misconceptions to four per skill (with a real
// cause for each first-pass one) and the teaching pack in curriculum/social_studies/teaching/g7/, through scripts/science-depth.mjs.
const depth = applyDepth(g7, DEPTH, { dir: 'social_studies', grade: 7, prefix: P, derive: true });
// Grade 1-3 outcome prerequisites name the Grade 1-3 skill that carries them (19 Nov 2026, scripts/lib/lower-grade.mjs).
const relink = relinkLowerOutcomes(g7, { root: new URL('..', import.meta.url).pathname, label: 'Social Studies Grade 7' });
console.log(`social studies g7: ${relink.moved} Grade 1-3 outcome prerequisites now name skills (${relink.merged} merged), ${relink.kept.length} kept as outcomes`);
g7.status = g7.status.replace(/; depth pass 18 Nov 2026.*$/, '') + '; depth pass 18 Nov 2026 (two or more prerequisites and four misconceptions per skill, teaching pack in curriculum/social_studies/teaching/g7)';
writeFileSync(path, JSON.stringify(g7, null, 1) + '\n');
console.log(`social studies g7: ${g7.totals.skills} skills, ${g7.totals.prerequisites} prerequisites, ${g7.totals.misconceptions} misconceptions; depth pass ${depth.subs} of ${depth.of} sub-strands (+${depth.pre} prerequisites, +${depth.mis} misconceptions, ${depth.fix} causes fixed, ${depth.pack} teaching pack entries)`);
