// ============================================================================
// HINT-LEAK AUDIT — no hint a skill can produce may name its own answer.
//
// Used two ways:
//   node engine/scripts/audit_hint_leaks.mjs [--deep] [--verbose]
//   import { auditHints } from './audit_hint_leaks.mjs'   (the quality gate)
//
// Sampling a few random draws per skill answers "probably fine". This answers
// "every hint this skill can produce", by running each skill until it STOPS
// PRODUCING NEW ONES.
//
// Why that is enumeration and not just more sampling: a leak is a property of
// the (answer, hint) PAIR, not of a draw. "The digit is 1; its value is 1 × 10"
// leaks because of what that pair is, and it leaks every time that pair comes
// up. So the question is not "did we draw enough" but "have we seen every pair
// this skill can make" — and that is answered by drawing until the set of
// distinct pairs stops growing.
//
// Some skills cannot settle: their hint quotes an operand, so the instantiation
// space is as large as the operand range ("385 × 4 and 385 × 20" — tens of
// thousands of them). For those the TEMPLATE is the finite unit — a hint is
// written once in the content and filled with numbers, and blanking the numbers
// recovers it. Every template is reached in a handful of draws, so the report
// prints them and leaves the argument to be read off the template rather than
// claiming a sweep it did not do: G5_ADDITION's three templates contain no
// digits at all, which is why no numeric answer can match them.
//
// Math.random is driven by a fixed seed per skill, so a run is reproducible.
// ============================================================================
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..', '..');

const { SKILLS } = await import(resolve(root, 'src/ai-tutor/knowledgeGraph.js'));
const { generateProblem } = await import(resolve(root, 'src/ai-tutor/problemGenerators.js'));
const { namesAnswer } = await import(resolve(root, 'src/ai/replyGuard.js'));

// Reviewed and allowed. Stating the rule IS the teaching on a classification
// skill, and on some draws a value the hint must show lands on the answer.
// The same cases tests/hints.test.mjs reviews, plus the coincidences.
export const ALLOWED = new Map([
  ['G3_POSITION', 'left/right from the walker’s view; naming both gives neither away'],
  ['G8_CONGRUENCE', 'names all four tests; choosing between them is the skill'],
  ['G7_DIVISIBILITY', 'answer is "no"; unmatchable against prose opening with "No"'],
  ['G8_POLYGON_ANGLES', 'the general formula; the child still substitutes n'],
  ['G8_LINEAR_GRAPHS', 'the gradient shown in the substitution sometimes equals y'],
  ['G9_QUADRATIC_GRAPHS', 'the line of symmetry sometimes equals the minimum y'],
  ['G11_LINEAR_PROGRAMMING', 'lists every corner to test; naming all gives none away'],
  ['G8_SEQUENCES', 'the common difference sometimes equals the term asked for'],
  ['G10_SEQUENCES_ADV', 'the common difference sometimes equals the term asked for'],
  ['G12_DEFINITE_INTEGRALS', 'the antiderivative coefficient sometimes equals the integral'],
  ['G1_LINES', 'straight/curved classification; the hint defines the two words'],
  ['G2_LINES', 'straight/curved classification; the hint defines the two words'],
  ['G4_ANGLES', 'acute/right/obtuse; applying the stated rule is the skill'],
  ['G5_ANGLES_INTRO', 'acute/right/obtuse classification'],
  ['G6_ANGLE_MEASURE', 'acute/right/obtuse classification'],
  ['G9_SCATTER_PLOTS', 'positive/negative correlation; the hint defines both'],
  ['G12_CORRELATION_REGRESSION', 'describing r; the hint defines the scale'],
  ['G12_HYPOTHESIS_TESTING', 'reject/accept; the hint states the decision rule'],
  ['G8_TRANSFORMATIONS_INTRO', 'restates the ORIGINAL point; digits coincide with the image'],
  ['G9_TRANSFORMATIONS_ADV', 'restates the ORIGINAL point; digits coincide with the image'],
]);

const seeded = (seed) => {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
};
const seedFor = (id) => [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

function auditSkill(id, patience, maxDraws) {
  const seen = new Set();
  const templates = new Map();     // template -> one example hint
  const leaks = new Map();         // reason -> one example
  let draws = 0, sinceNew = 0;

  const real = Math.random;
  Math.random = seeded(seedFor(id));
  try {
    while (sinceNew < patience && draws < maxDraws) {
      draws++;
      let p;
      try { p = generateProblem(id); } catch { sinceNew++; continue; }
      if (!p || p.placeholder) { sinceNew++; continue; }
      let fresh = false;
      for (const hint of (p.hints || [p.hint]).filter(Boolean)) {
        const tpl = String(hint).replace(/-?\d+(?:\.\d+)?/g, '#');
        if (!templates.has(tpl)) templates.set(tpl, hint);
        const key = `${p.answer}\u0000${hint}`;
        if (seen.has(key)) continue;
        seen.add(key);
        fresh = true;
        const why = namesAnswer({
          answer: p.answer, accepts: p.accepts, question: p.question, reply: hint,
        });
        const kind = why && why.replace(/\(.*/, '');
        if (why && !leaks.has(kind)) leaks.set(kind, { why, hint, q: p.question, a: p.answer });
      }
      sinceNew = fresh ? 0 : sinceNew + 1;
    }
  } finally { Math.random = real; }

  return {
    id, draws, distinct: seen.size, templates,
    settled: draws < maxDraws, leaks: [...leaks.values()],
  };
}

/** Enumerate every skill's hints. `deep` raises the patience and the cap. */
export function auditHints({ deep = false } = {}) {
  const patience = deep ? 3000 : 400;
  const maxDraws = deep ? 25000 : 6000;
  const results = Object.keys(SKILLS).map((id) => auditSkill(id, patience, maxDraws));
  return {
    results,
    leaking: results.filter((r) => r.leaks.length && !ALLOWED.has(r.id)),
    allowed: results.filter((r) => r.leaks.length && ALLOWED.has(r.id)),
    settled: results.filter((r) => r.settled),
    open: results.filter((r) => !r.settled),
    templates: results.reduce((n, r) => n + r.templates.size, 0),
    pairs: results.reduce((n, r) => n + r.distinct, 0),
    draws: results.reduce((n, r) => n + r.draws, 0),
    patience, maxDraws,
  };
}

/** The lines the quality gate prints. Also used by this file's own CLI. */
export function reportHints(a, { verbose = false } = {}) {
  const out = [];
  out.push(`Distinct hint TEMPLATES, all generated : ${a.templates.toLocaleString('en-US')}`);
  out.push(`Distinct (answer, hint) pairs checked  : ${a.pairs.toLocaleString('en-US')}`);
  out.push(`Problems generated to find them        : ${a.draws.toLocaleString('en-US')}`);
  out.push(`Skills enumerated to exhaustion        : ${a.settled.length} of ${a.results.length}`);
  out.push(`Skills whose hints quote an operand    : ${a.open.length} (templates all seen; see --verbose)`);
  out.push(`Reviewed and allowed                   : ${a.allowed.length}`);
  out.push(`LEAKING                                : ${a.leaking.length}`);
  for (const r of a.leaking) {
    for (const l of r.leaks) {
      out.push(`\n  ${r.id}  [${l.why}]`);
      out.push(`    A: ${l.a}`);
      out.push(`    Q: ${l.q}`);
      out.push(`    hint: ${l.hint}`);
    }
  }
  if (verbose) {
    out.push('\n--- hints that quote an operand: their templates ---');
    for (const r of a.open) {
      out.push(`\n  ${r.id}  —  ${r.templates.size} template(s), ${r.distinct.toLocaleString('en-US')} instantiations checked`);
      for (const tpl of r.templates.keys()) out.push(`    ${tpl}`);
    }
  }
  return out.join('\n');
}

// ---- CLI ----
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const deep = process.argv.includes('--deep');
  const verbose = process.argv.includes('--verbose');
  const a = auditHints({ deep });
  console.log(`\n=== HINT-LEAK AUDIT (${a.results.length} skills${deep ? ', deep' : ''}) ===`);
  console.log(reportHints(a, { verbose }));
  console.log(a.leaking.length
    ? `\n${a.leaking.length} skill(s) leak.`
    : '\nNo skill leaks an answer through a hint.');
  process.exit(a.leaking.length ? 1 : 0);
}
