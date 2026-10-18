// ============================================================================
// DUPLICATE RUNGS — is the same skill wearing two different grade labels?
//
//   node scripts/audit-rung-dupes.mjs
//
// Four pairs of skills in this graph were literally the same question at two
// grades, because both grades called the same builder with no arguments:
//
//   G1_COUNTING / G2_COUNTING          buildCounting({ max: 100 })
//   G5_PLACE_VALUE / G6_PLACE_VALUE    buildPlaceValueChart()
//   G6_DECIMALS_MUL / G7_DECIMALS_MUL  buildDecimalMul()
//   G6_DECIMALS_DIV / G7_DECIMALS_DIV  buildDecimalDiv()
//
// Nothing failed. The gate checked each skill was well formed, the hint audit
// checked no hint named its answer, and the difficulty test only reads the
// `band` descriptor the arithmetic builders attach — which none of these
// have. So "Place Value (Millions)" quietly asked the same question as
// "Place Value (Thousands)", and a learner credited with the Grade 6 skill
// had only ever shown Grade 5 work.
//
// HOW IT DECIDES. Two signals together, because either alone lies:
//   - question TEMPLATES (the text with every number blanked) being equal is
//     not enough: place value asks one question shape at every grade
//   - MAGNITUDE being equal is not enough either: Grade 8 inequalities are
//     algebraic and use smaller numbers than Grade 6's, quite correctly
// A rung is only flagged when it asks the same shapes AND has not grown.
//
// What it cannot see is a rung that should differ in KIND rather than size —
// the Grade 7 fraction rungs ought to be mixed numbers, and bigger numerators
// are only a stand-in. Those stay flagged on purpose.
// ============================================================================
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';

const DRAWS = 60;
const GROWTH = 1.5;        // the higher rung must be meaningfully bigger

const profile = (id) => {
  const tpl = new Set();
  let max = 0, seen = 0, places = 0;
  for (let i = 0; i < DRAWS; i++) {
    let p;
    try { p = generateProblem(id); } catch { continue; }
    if (!p || p.placeholder) continue;
    seen++;
    tpl.add(String(p.question).replace(/\d+(?:\.\d+)?/g, '#').replace(/\s+/g, ' ').trim());
    for (const n of (String(p.question).replace(/,/g, '').match(/\d+(?:\.\d+)?/g) || [])) {
      max = Math.max(max, Number(n));
      places = Math.max(places, (String(n).split('.')[1] || '').length);
    }
  }
  return seen ? { tpl, max, places } : null;
};
const sameShapes = (a, b) => a.tpl.size === b.tpl.size && [...a.tpl].every((t) => b.tpl.has(t));

const families = {};
for (const s of Object.values(SKILLS)) {
  if (Number.isFinite(s.grade)) (families[s.id.replace(/^G\d+_/, '')] ||= []).push(s);
}

const dupes = [];
for (const [, list] of Object.entries(families)) {
  if (list.length < 2) continue;
  list.sort((a, b) => a.grade - b.grade);
  const prof = new Map(list.map((s) => [s.id, profile(s.id)]));
  for (let i = 1; i < list.length; i++) {
    const lo = list[i - 1], hi = list[i];
    const pl = prof.get(lo.id), ph = prof.get(hi.id);
    if (!pl || !ph || lo.grade === hi.grade) continue;
    // Growth is not only magnitude: an extra decimal place to track is a
    // harder question at the same size, which is exactly how the Grade 7
    // decimal rung differs from the Grade 6 one.
    const grew = ph.max > pl.max * GROWTH || ph.places > pl.places;
    if (sameShapes(pl, ph) && !grew) {
      dupes.push({ lo, hi, loMax: pl.max, hiMax: ph.max });
    }
  }
}

console.log(`\n=== DUPLICATE RUNGS (${dupes.length}) ===`);
for (const d of dupes) {
  console.log(`\n  G${d.lo.grade} ${d.lo.id}  ==  G${d.hi.grade} ${d.hi.id}`);
  console.log(`     "${d.lo.name}"`);
  console.log(`     "${d.hi.name}"`);
  console.log(`     same question shapes; biggest number ${d.loMax} -> ${d.hiMax}`);
}
if (!dupes.length) console.log('\nEvery rung asks something its neighbour does not.');
process.exit(0);   // reporting tool: the remaining ones are known content gaps
