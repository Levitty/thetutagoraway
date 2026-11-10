// ============================================================================
// Writes the Grade 5 curriculum map HOREB and Tuta both read:
//   src/ai-tutor/content/curriculumMap.g5.js        light: sub-strands, official outcomes,
//                                                    167 skills with their HOREB skill ids
//   engine/data/curriculum/g5.misconceptions.json   heavy: the 414-entry misconception
//                                                    library (checks and the review pack only)
//   engine/data/curriculum/g5.detail.json            heavy: outcome texts, mastery limits and
//                                                    question forms (review pack only)
// Source: curriculum/mathematics/g5.json (HOREB owns it; Tuta keeps a generated read copy) (KICD 2024 design, outcomes
// verified word for word; skills, prerequisites and misconceptions are proposed/draft).
//   node scripts/build-curriculum-map.mjs   (reads curriculum/mathematics/g5.json, which HOREB owns)
// `horeb` is the map's own horeb_skill_ids. `primary` is the one Grade 5 HOREB skill a
// family is filed under (a family has one `skill`); `horeb` plus `primary` is every HOREB
// skill whose mastery a family counts toward.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const src = process.argv[2] || fileURLToPath(new URL('../curriculum/mathematics/g5.json', import.meta.url));
const g5 = JSON.parse(readFileSync(src, 'utf8'));
const P = 'MATH.G5.';

// The HOREB sub-strand key each design sub-strand corresponds to in curriculum/outcomes.js.
const LEGACY = { 'NUMBER.WHOLE_NUMBERS': 'WHOLE', 'NUMBER.ADDITION': 'ADD', 'NUMBER.SUBTRACTION': 'SUB', 'NUMBER.MULTIPLICATION': 'MUL', 'NUMBER.DIVISION': 'DIV', 'NUMBER.FRACTIONS': 'FRAC', 'NUMBER.DECIMALS': 'DEC', 'NUMBER.SIMPLE_EQUATIONS': 'EQUATIONS', 'MEASUR.LENGTH': 'LENGTH', 'MEASUR.AREA': 'AREA', 'MEASUR.VOLUME': 'VOL', 'MEASUR.CAPACITY': 'CAP', 'MEASUR.MASS': 'MASS', 'MEASUR.TIME': 'TIME', 'MEASUR.MONEY': 'MONEY', 'GEOMET.LINES': 'LINES', 'GEOMET.ANGLES': 'ANGLES', 'GEOMET.3_D_OBJECTS': '3D', 'DATA_H.DATA_REPRESENTATION': 'DATA' };

// The Grade 5 HOREB skill a family is filed under. Where the map names none, or names
// only a Grade 6 skill, the nearest Grade 5 skill that exists in knowledgeGraph.js.
const PRIMARY = [
  [/WHOLE_NUMBERS\.ROUND_/, 'G5_ROUNDING'], [/SUBTRACTION\.ROUND_/, 'G5_ROUNDING'],
  [/WHOLE_NUMBERS\.(DIVISIBLE|DIVISIBILITY)/, 'G5_DIVISIBILITY'], [/WHOLE_NUMBERS\.COMMON_FACTORS/, 'G5_FACTORS'],
  [/WHOLE_NUMBERS\.(HCF|LCM)/, 'G5_LCM_HCF'], [/WHOLE_NUMBERS\.COMMON_MULTIPLES/, 'G5_MULTIPLES'], [/WHOLE_NUMBERS\./, 'G5_PLACE_VALUE'],
  [/_PATTERN_/, 'G5_PATTERNS'],
  [/ADDITION\./, 'G5_ADDITION'], [/SUBTRACTION\./, 'G5_SUBTRACTION'], [/MULTIPLICATION\./, 'G5_MULTIPLICATION'],
  [/DIVISION\.DIV_BY_1000/, 'G5_DECIMALS_INTRO'], [/DIVISION\.(ORDER_OF|COMBINED)/, 'G6_BODMAS_BASIC'], [/DIVISION\./, 'G5_DIVISION'],
  [/FRACTIONS\.(EQUIVALENT|SIMPLIFY)/, 'G5_FRACTIONS_EQUIV'], [/FRACTIONS\.(COMPARE|ORDER)/, 'G5_FRACTIONS_INTRO'],
  [/FRACTIONS\.(ADD_)/, 'G5_FRACTIONS_ADD_LIKE'], [/FRACTIONS\.SUBTRACT/, 'G5_FRACTIONS_SUB_LIKE'],
  [/DECIMALS\.DEC_ADD/, 'G5_DECIMALS_ADD'], [/DECIMALS\.DEC_SUB/, 'G5_DECIMALS_SUB'], [/DECIMALS\./, 'G5_DECIMALS_INTRO'],
  [/SIMPLE_EQUATIONS\.EQ_MEANING/, 'G5_MISSING_NUMBER'], [/SIMPLE_EQUATIONS\./, 'G5_SIMPLE_EQUATIONS'],
  [/LENGTH\.(ADD|SUBTRACT|MULTIPLY|DIVIDE)/, 'G5_LENGTH_OPS'], [/LENGTH\./, 'G5_LENGTH'],
  [/AREA\./, 'G5_AREA_INTRO'], [/VOLUME\./, 'G5_VOLUME'],
  [/CAPACITY\.(ADD|SUBTRACT|MULTIPLY|DIVIDE)/, 'G5_CAPACITY_OPS'], [/CAPACITY\./, 'G5_CAPACITY'],
  [/MASS\.MASS_(ADD|SUBTRACT|MULTIPLY|DIVIDE)/, 'G5_MASS_OPS'], [/MASS\./, 'G5_MASS'],
  [/TIME\./, 'G5_TIME'], [/MONEY\./, 'G5_MONEY'],
  [/LINES\./, 'G5_LINES'], [/ANGLES\./, 'G5_ANGLES_INTRO'], [/3_D_OBJECTS\./, 'G5_3D_OBJECTS'], [/DATA_REPRESENTATION\./, 'G5_TALLY'],
];

const G5_SKILLS = new Set(g5.sub_strands.flatMap(x => x.skills.map(k => k.code)));
const out = { source: 'curriculum/mathematics/g5.json', status: g5.status, subs: {}, outcomes: {}, skills: {} };
const mis = {}, detail = { outcomes: {}, skills: {} };
for (const s of g5.sub_strands) {
  const key = s.code.replace(P, '');
  out.subs[s.code] = { name: s.sub_strand, strand: s.strand, legacy: LEGACY[key], outcomes: s.outcomes.map(o => o.code) };
  for (const o of s.outcomes) { out.outcomes[o.code] = { letter: o.letter, sub: s.code }; detail.outcomes[o.code] = o.text; }
  for (const k of s.skills) {
    const tail = k.code.replace(P, '');
    const primary = (PRIMARY.find(([re]) => re.test(tail)) || [])[1];
    if (!primary) throw new Error(`no primary HOREB skill for ${k.code}`);
    // `pre`: the Grade 5 skills this one builds on (the design's skill-to-skill prerequisites;
    // the ones on Grade 4 outcomes are left in g5.json), so a tutor can find the weakest one.
    const pre = (k.prerequisites || []).map(r => r.requires).filter(c => G5_SKILLS.has(c));
    out.skills[k.code] = { name: k.name, sub: s.code, outcome: k.outcomes[0], outcomes: k.outcomes, horeb: k.horeb_skill_ids, primary, pre: [...new Set(pre)], mis: [] };
    detail.skills[k.code] = { forms: k.question_forms, mastery: k.mastery };
  }
  for (const m of s.misconceptions) {
    const short = m.code.slice(m.skill.length + 1);
    out.skills[m.skill].mis.push(short);
    mis[m.code] = { skill: m.skill, error: m.error, example: m.example, cause: m.cause, reveals: m.reveals, help: m.help, status: m.status };
  }
}
const header = `// GENERATED by scripts/build-curriculum-map.mjs from Tuta's g5.json (KICD 2024 design). Do not edit by hand.
// Outcomes are official (verified word for word). Skills are proposed, awaiting teacher review.
// A family carries \`cskill\` (a key of SKILLS_G5 here), \`outcome\` (its official outcome) and its HOREB \`skill\` (the primary).
// Mastery on a family counts toward every HOREB id in horebOf(cskill); read the other way with cskillsOf(horebId).
`;
writeFileSync(new URL('../src/ai-tutor/content/curriculumMap.g5.js', import.meta.url), `${header}export const MAP_SOURCE = ${JSON.stringify({ source: out.source, status: out.status })};
export const SUBSTRANDS = ${JSON.stringify(out.subs, null, 1)};
export const OUTCOMES_G5 = ${JSON.stringify(out.outcomes, null, 1)};
export const SKILLS_G5 = ${JSON.stringify(out.skills, null, 1)};
export const horebOf = (cskill) => [...new Set([...(SKILLS_G5[cskill]?.horeb || []), SKILLS_G5[cskill]?.primary].filter(Boolean))];
export const cskillsOf = (horebId) => Object.keys(SKILLS_G5).filter(c => horebOf(c).includes(horebId));
`);
writeFileSync(new URL('../engine/data/curriculum/g5.detail.json', import.meta.url), JSON.stringify(detail, null, 1));
writeFileSync(new URL('../engine/data/curriculum/g5.misconceptions.json', import.meta.url), JSON.stringify(mis, null, 1));
console.log(`${Object.keys(out.subs).length} sub-strands, ${Object.keys(out.outcomes).length} outcomes, ${Object.keys(out.skills).length} skills, ${Object.keys(mis).length} misconceptions`);
