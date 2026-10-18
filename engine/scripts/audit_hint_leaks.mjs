// ============================================================================
// EXHAUSTIVE HINT-LEAK AUDIT
//
//   node engine/scripts/audit_hint_leaks.mjs [--verbose]
//
// Sampling a few random draws per skill answers "probably fine". This answers
// "every hint this skill can produce", by running each skill until it STOPS
// PRODUCING NEW ONES.
//
// Why that is exhaustive, and not just more sampling: a leak is a property of
// the (answer, hint) PAIR, not of a draw. "The digit is 1; its value is 1 × 10"
// leaks because of what that pair is, and it leaks every single time that pair
// is generated. So the question is not "did we sample enough draws" but "have
// we seen every distinct pair this skill can make". We keep drawing until the
// set of distinct pairs has not grown for PATIENCE consecutive draws, and then
// report how many we saw and whether it settled.
//
// Some skills cannot settle: their hint quotes an operand, so the pair space is
// as large as the operand range ("385 × 4 and 385 × 20" — 888 × 8 of them).
// Those are reported separately with the count reached, and are not claimed as
// exhaustive. For those the argument has to be read off the template, not the
// enumeration, so the report prints a sample so a human can do that.
//
// Math.random is driven by a fixed seed per skill, so a run is reproducible:
// the same command gives the same numbers and the same findings every time.
// ============================================================================
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..', '..');

const { SKILLS } = await import(resolve(root, 'src/ai-tutor/knowledgeGraph.js'));
const { generateProblem } = await import(resolve(root, 'src/ai-tutor/problemGenerators.js'));
const { namesAnswer } = await import(resolve(root, 'src/ai/replyGuard.js'));

const VERBOSE = process.argv.includes('--verbose');

// Stop once this many consecutive draws have produced no pair we had not
// already seen. 3,000 is far past the point where a settled skill stops moving: the
// largest settled hint space below needs a few hundred draws to fill.
const PATIENCE = 3000;
const MAX_DRAWS = 25000;

// Reviewed and allowed: stating the rule IS the teaching on a classification
// skill, and a value the hint must show sometimes coincides with the answer.
// The same four the hints test reviews, plus the three coincidence cases.
const ALLOWED = new Set([
  'G3_POSITION', 'G8_CONGRUENCE', 'G7_DIVISIBILITY', 'G8_POLYGON_ANGLES',
  'G8_LINEAR_GRAPHS', 'G9_QUADRATIC_GRAPHS', 'G11_LINEAR_PROGRAMMING',
  'G1_LINES', 'G2_LINES', 'G1_COUNTING_CMP', 'G4_ANGLES', 'G5_ANGLES_INTRO',
  'G6_ANGLE_MEASURE', 'G9_SCATTER_PLOTS', 'G12_CORRELATION_REGRESSION',
  'G12_HYPOTHESIS_TESTING', 'G8_TRANSFORMATIONS_INTRO', 'G9_TRANSFORMATIONS_ADV',
  'G8_SEQUENCES',
  // Found by this audit, same coincidence class as G8_SEQUENCES above: a value
  // the hint has to show (the common difference, the antiderivative's leading
  // coefficient) lands on the answer for some parameter draws.
  'G10_SEQUENCES_ADV', 'G12_DEFINITE_INTEGRALS',
]);

function seeded(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

function auditSkill(id) {
  const seen = new Set();
  // The TEMPLATE is the unit that is actually finite: a hint is written once in
  // the content and filled with numbers. Blanking the numbers recovers it, so
  // "every template was generated" is a claim enumeration can support even
  // where "every instantiation" cannot.
  const templates = new Map();      // template -> one example hint
  const leaks = new Map();          // reason -> one example
  let draws = 0, sinceNew = 0;

  const real = Math.random;
  Math.random = seeded(0x9e3779b9 ^ [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7));
  try {
    while (sinceNew < PATIENCE && draws < MAX_DRAWS) {
      draws++;
      let p;
      try { p = generateProblem(id); } catch { sinceNew++; continue; }
      if (!p || p.placeholder) { sinceNew++; continue; }
      const hints = (p.hints || [p.hint]).filter(Boolean);
      let fresh = false;
      for (const hint of hints) {
        const tpl = String(hint).replace(/-?\d+(?:\.\d+)?/g, '#');
        if (!templates.has(tpl)) templates.set(tpl, hint);
        const key = `${p.answer}\u0000${hint}`;
        if (seen.has(key)) continue;
        seen.add(key);
        fresh = true;
        const why = namesAnswer({
          answer: p.answer, accepts: p.accepts, question: p.question, reply: hint,
        });
        if (why && !leaks.has(why.replace(/\(.*/, ''))) {
          leaks.set(why.replace(/\(.*/, ''), { why, hint, q: p.question, a: p.answer });
        }
      }
      sinceNew = fresh ? 0 : sinceNew + 1;
    }
  } finally { Math.random = real; }

  return {
    id, draws, distinct: seen.size, templates, settled: draws < MAX_DRAWS,
    leaks: [...leaks.values()],
  };
}

const ids = Object.keys(SKILLS);
const results = [];
for (const id of ids) results.push(auditSkill(id));

const settled = results.filter((r) => r.settled);
const open = results.filter((r) => !r.settled);
const leaking = results.filter((r) => r.leaks.length && !ALLOWED.has(r.id));
const allowed = results.filter((r) => r.leaks.length && ALLOWED.has(r.id));
const totalPairs = results.reduce((n, r) => n + r.distinct, 0);
const totalTemplates = results.reduce((n, r) => n + r.templates.size, 0);
const totalDraws = results.reduce((n, r) => n + r.draws, 0);

console.log(`\n=== HINT-LEAK AUDIT (${ids.length} skills) ===`);
console.log(`Distinct hint TEMPLATES, all generated: ${totalTemplates.toLocaleString('en-US')}`);
console.log(`Distinct (answer, hint) pairs checked : ${totalPairs.toLocaleString('en-US')}`);
console.log(`Problems generated to find them       : ${totalDraws.toLocaleString('en-US')}`);
console.log(`Skills whose hints settled (exhaustive): ${settled.length}`);
console.log(`Skills still producing new pairs at ${MAX_DRAWS.toLocaleString('en-US')} draws : ${open.length}`);
console.log(`Reviewed and allowed                  : ${allowed.length}`);
console.log(`LEAKING                               : ${leaking.length}`);

if (leaking.length) {
  console.log('\n--- leaks ---');
  for (const r of leaking) {
    for (const l of r.leaks) {
      console.log(`\n  ${r.id}  [${l.why}]`);
      console.log(`    A: ${l.a}`);
      console.log(`    Q: ${l.q}`);
      console.log(`    hint: ${l.hint}`);
    }
  }
}

if (open.length) {
  console.log('\n--- not settled: hint space is as big as the operand range ---');
  console.log('    (checked to the cap; the template, not the enumeration, is the argument)');
  for (const r of open) {
    console.log(`\n    ${r.id}  —  ${r.templates.size} template(s), ${r.distinct.toLocaleString('en-US')} instantiations checked`);
    for (const tpl of r.templates.keys()) console.log(`      ${tpl}`);
  }
}

if (VERBOSE) {
  console.log('\n--- per skill ---');
  for (const r of results.sort((a, b) => b.distinct - a.distinct)) {
    console.log(`  ${r.settled ? 'settled' : 'OPEN   '} ${r.id.padEnd(26)} ${String(r.distinct).padStart(8)} pairs in ${String(r.draws).padStart(7)} draws`);
  }
}

console.log(leaking.length ? `\n${leaking.length} skill(s) leak.` : '\nNo skill leaks an answer through a hint.');
process.exit(leaking.length ? 1 : 0);
