// ============================================================================
// Writes src/ai-tutor/curriculum/skillTags.js: which CBC sub-strand and which
// outcomes each skill practises. Run again when skills or outcomes change:
//   node scripts/build-skill-tags.mjs
//
// The sub-strand comes from the skill's own curricula.cbc overlay. Its outcomes
// are those of that sub-strand whose signal shows up in at least 10% of draws,
// plus anything in PROMISED below: what the skill's name promises, whether or
// not the draws deliver it yet. The gate fails a skill that promises an outcome
// and never asks it, which is how a label stays honest.
// ============================================================================
import { writeFileSync } from 'node:fs';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { gradeOf } from '../src/ai-tutor/curricula.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { CBC_SUBSTRANDS, OUTCOMES } from '../src/ai-tutor/curriculum/outcomes.js';
import { textOf } from '../engine/scripts/content_measures.mjs';
import { FAMILIES } from '../src/ai-tutor/content/families/index.js';

// How the graph's sub-strand names read in the design. Keys are lowercase.
const NAME_FIX = {
  'number concept': 'whole numbers', 'pre-number activities': 'pre-number activities',
  'three dimension (3-d) objects': 'three dimension objects', 'data': 'data',
  'data interpretation (grouped data)': 'data interpretation', 'time, distance, and speed': 'time, distance and speed',
  'squares and square roots': 'squares and square roots', 'volume and capacity': 'volume and capacity',
  'volume': 'volume', 'volume of solids': 'volume of solids', 'statistics': 'data',
};
const GRADE_OVERRIDE = {
  // Tagged in the graph to a sub-strand that the design lists under another name or place.
  G8_SURFACE_AREA: [8, 'AREA'], G8_VOLUME_ADV: [8, 'SOLIDS'], G9_ARC_LENGTH: [8, 'CIRCLES'],
  G9_COMPOUND_INTEREST: [8, 'MONEY'], G5_PATTERNS: [5, 'ADD'], G6_PATTERNS: [6, 'MUL'], G6_BODMAS_BASIC: [5, 'DIV'],
};

// What each label promises. The 18 skills the evaluation found, kept honest.
export const PROMISED = {
  G7_TEMPERATURE: ['G7.TEMP.c', 'G7.TEMP.d', 'G7.TEMP.e'],
  G9_APPROX_ERRORS: ['G9.APPROX.a', 'G9.APPROX.b', 'G9.APPROX.c'],
  G8_SCALE_DRAWING: ['G8.SCALE.b', 'G8.SCALE.j'],
  G6_3D_OBJECTS: ['G6.3D.a'],
  G6_INEQUALITIES: ['G6.INEQ.a', 'G6.INEQ.c'],
  G6_MONEY: ['G6.MONEY.a', 'G6.MONEY.c', 'G6.MONEY.e'],
  G6_ANGLE_MEASURE: ['G6.ANGLES.b'],
  G6_MASS: ['G6.MASS.a', 'G6.MASS.e'],
  G5_MONEY: ['G5.MONEY.a', 'G5.MONEY.d', 'G5.MONEY.e'],
  G4_LETTERS: ['G4.LETTERS.a', 'G4.LETTERS.b', 'G4.LETTERS.c'],
  G7_DATA_REPRESENT: ['G7.DATA.f', 'G7.DATA.h', 'G7.DATA.j'],
  G8_LINEAR_GRAPHS: ['G8.GRAPHS.d', 'G8.GRAPHS.g'],
  G8_SURFACE_AREA: ['G8.AREA.c', 'G8.AREA.d'],
  G8_PROBABILITY_COMBINED: ['G8.PROB.d'],
  G9_SPEED_VELOCITY: ['G9.SPEED.c', 'G9.SPEED.d'],
  G9_PROBABILITY_ADV: ['G9.PROB.e'],
  G7_CONSTRUCTIONS: ['G7.CONSTRUCT.b'],
  G9_CONSTRUCTION: ['G8.CONSTRUCT.c'],
};

// Grades 1 to 3: the design's own outcomes, tagged by hand where the skill's questions clearly test the
// outcome (read from curriculum/mathematics/g1.json to g3.json, 12 Nov 2026). Everything else stays at the
// sub-strand ('0') and is listed in docs/qa/new-families-2026-11-12.md.
export const OFFICIAL_G1_3 = {
  G1_COUNTING: ['G1.WHOLE.a'], G1_ADD: ['G1.ADD.c'], G1_SUB: ['G1.SUB.c'],
  G1_LENGTH: ['G1.LENGTH.b'], G1_MASS: ['G1.MASS.b'], G1_CAPACITY: ['G1.CAP.b'],
  G1_TIME: ['G1.TIME.a'], G1_MONEY: ['G1.MONEY.c'],
  G1_LINES: ['G1.LINES.a', 'G1.LINES.c', 'G1.LINES.e'], G1_SHAPES: ['G1.SHAPES.a'],
  G2_COUNTING: ['G2.WHOLE.a'], G2_PLACE_VALUE: ['G2.WHOLE.d'],
  G2_ADD: ['G2.ADD.a', 'G2.ADD.b'], G2_SUB: ['G2.SUB.a', 'G2.SUB.b'],
  G2_MULTIPLY_INTRO: ['G2.MUL.a'], G2_DIVISION_INTRO: ['G2.DIV.a'],
  G2_FRACTIONS: ['G2.FRAC.a', 'G2.FRAC.b'], G2_SHAPES: ['G2.SHAPES.a'], G2_TIME: ['G2.TIME.f'],
  G3_COUNTING: ['G3.WHOLE.c'], G3_ADD: ['G3.ADD.c', 'G3.ADD.d'], G3_SUB: ['G3.SUB.c'],
  G3_MULTIPLY: ['G3.MUL.b'], G3_DIVIDE: ['G3.DIV.b'], G3_FRACTIONS: ['G3.FRAC.a', 'G3.FRAC.b'],
  G3_MASS: ['G3.MASS.c'], G3_CAPACITY: ['G3.CAP.c'], G3_TIME: ['G3.TIME.c'],
  G3_POSITION: ['G3.POSITION.b', 'G3.POSITION.c', 'G3.POSITION.d'],
};

const SENIOR_NOTE = 'No KICD design could be read for Grades 10 to 12 (the official links returned 404). These skills follow a traditional syllabus and are not matched to Core or Essential Mathematics.';
const OUT_NOTE = 'Not in the KICD Grade 4 to 9 designs. May belong to Grade 10 Core (reported topics include quadratics, reflection, rotation, vectors); not verified.';

// Reported, from secondary sources only, as Grade 10 Core topics.
const REPORTED_CORE = /quadratic|reflection|rotation|vector|motion/i;
const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
const findSub = (grade, name) => {
  const n = NAME_FIX[norm(name)] || norm(name);
  return CBC_SUBSTRANDS.find(s => s.grade === grade && norm(s.name) === n)
    || CBC_SUBSTRANDS.find(s => s.grade === grade && (norm(s.name).startsWith(n) || n.startsWith(norm(s.name))));
};

// Fixed dice, so running this twice writes the same file.
let seed = 20261105;
Math.random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const tags = {}; const unmatched = [];
for (const [id, s] of Object.entries(SKILLS)) {
  const c = s.curricula?.cbc;
  const grade = gradeOf(s, 'cbc');
  // Tagged to their own topic, plainly marked as not checked against any design.
  if (c?.inScope === false || grade >= 10) {
    const out = c?.inScope === false;
    const topic = s.name.replace(/\s*\(.*\)$/, '');
    const code = `MATH.G${grade}.${{ Numbers: 'NUMBER', Algebra: 'ALGEBR', Geometry: 'GEOMET', Measurements: 'MEASUR', Statistics: 'DATA_H' }[s.strand]}.${topic.toUpperCase().replace(/[^A-Z0-9]+/g, '_').slice(0, 24)}`;
    tags[id] = { grade, topic, code, status: out ? 'outside-design' : 'unverified', note: out ? 'out' : 'senior', reportedGrade10Core: REPORTED_CORE.test(s.name) };
    continue;
  }
  const over = GRADE_OVERRIDE[id];
  const sub = over ? CBC_SUBSTRANDS.find(x => x.grade === over[0] && x.key === over[1]) : c?.substrand ? findSub(grade, c.substrand) : null;
  if (!sub) { unmatched.push(`${id} ${grade} ${c?.substrand}`); tags[id] = { grade, status: 'unmatched' }; continue; }
  const texts = [];
  for (let i = 0; i < 60; i++) { try { texts.push(textOf(generateProblem(id, { kp: i % 6 }))); } catch { /* the gate reports it */ } }
  // Grades 1 to 3 have one broad outcome per sub-strand ('0') found by signal; the design's own outcomes are tagged by hand.
  const hit = sub.outcomes.filter(([letter, , signal, hands]) => !hands && (sub.grade > 3 || letter === '0') && texts.filter(t => signal.test(t)).length >= 6)
    .map(([letter]) => `G${sub.grade}.${sub.key}.${letter}`);
  const fromFamilies = FAMILIES.filter(f => f.skill === id).map(f => f.outcome).filter(o => OUTCOMES[o]);   // Grade 5 curriculum-map families carry the official code, not HOREB's
  const outcomes = [...new Set([...hit, ...(PROMISED[id] || []), ...(OFFICIAL_G1_3[id] || []), ...fromFamilies])];
  tags[id] = { grade: sub.grade, substrand: sub.key, status: sub.status, outcomes };
}
for (const k of Object.keys(OFFICIAL_G1_3)) for (const o of OFFICIAL_G1_3[k]) if (!OUTCOMES[o] || OUTCOMES[o].hands) throw new Error(`${k}: unknown or hands-on outcome ${o}`);
for (const k of Object.keys(PROMISED)) for (const o of PROMISED[k]) if (!OUTCOMES[o]) throw new Error(`${k}: unknown outcome ${o}`);
if (unmatched.length) console.log('UNMATCHED:\n  ' + unmatched.join('\n  '));

const lines = Object.entries(tags).sort(([a], [b]) => a.localeCompare(b)).map(([id, t]) => `  ${id}: ${JSON.stringify(t)},`);
writeFileSync(new URL('../src/ai-tutor/curriculum/skillTags.js', import.meta.url), `// GENERATED by scripts/build-skill-tags.mjs. Do not edit by hand: change the
// outcomes, the sub-strand overlay in knowledgeGraph.js or PROMISED there, and run it again.
// status: read = KICD design read; sub-strand = design read at sub-strand level;
// unverified = no design could be read; outside-design = not in the Grade 4 to 9 designs.
export const SKILL_TAGS = {
${lines.join('\n')}
};
export const PROMISED = ${JSON.stringify(PROMISED, null, 2)};
export const UNVERIFIED_NOTES = ${JSON.stringify({ senior: SENIOR_NOTE, out: OUT_NOTE }, null, 2)};
`);
console.log(`${Object.keys(tags).length} skills tagged, ${unmatched.length} unmatched`);
