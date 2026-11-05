// ============================================================================
// UNIQUE-ANSWER AUDIT — a "solve" question must have exactly one answer (F30).
//
// Used two ways:
//   node engine/scripts/audit_unique_answers.mjs
//   import { auditUniqueAnswers } from './audit_unique_answers.mjs'   (the gate)
//
// The key cannot catch this: "2x + 2y = 20, 3x + 3y = 30" keyed x=4, y=6 is
// satisfied by its key, and by every other pair with x + y = 10. So this reads
// the question a child sees, not the generator, and any skill is covered whether
// or not it carries a verify hook.
//
// It knows three shapes: two linear equations in the same two letters, one
// linear equation with the letter on both sides, and the inverse of a 2 × 2
// matrix. A skill that never shows one costs a few draws; one that does is drawn
// many times, since a bad pair can be a rare draw. Math.random is seeded per
// skill, so a run is reproducible.
// ============================================================================
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..', '..');

const coef = (s) => (s === '' ? 1 : s === '-' ? -1 : Number(s));
const clean = (q) => String(q).replace(/[−–]/g, '-').replace(/\s+/g, ' ');

// A term must start the equation: "x² + 3x + 2y = 5" is not a linear pair.
const PAIR_EQ = /(?<![\w²³^.])(?<![+*/=-]\s?)(-?\d*)\s?([a-z])\s([+-])\s(\d*)\s?([a-z])\s?=\s?(-?\d+(?:\.\d+)?)(?![\w²³^]|\s?[+-]\s?\d)/gi;
const BOTH_SIDES = /(?<![\w²³^.])(?<![+*/=-]\s?)(-?\d*)\s?([a-z])((?:\s[+-]\s\d+(?:\.\d+)?)?)\s?=\s?(-?\d*)\s?\2((?:\s[+-]\s\d+(?:\.\d+)?)?)(?![\w²³^])/gi;
const INVERSE = /inverse of[^[]*\[\s*(-?\d+)\s+(-?\d+)\s*;\s*(-?\d+)\s+(-?\d+)\s*\]/i;

const num = (s) => Number(String(s).replace(/\s/g, '')) || 0;

/** Why this question has no single answer, or null. Knows only the shapes above. */
export function noUniqueAnswer(question) {
  const q = clean(question);

  const pairs = [...q.matchAll(PAIR_EQ)].map((m) => ({
    u: m[2].toLowerCase(), v: m[5].toLowerCase(),
    a: coef(m[1]), b: (m[3] === '-' ? -1 : 1) * coef(m[4]), c: Number(m[6]),
  }));
  for (let i = 0; i < pairs.length; i++) {
    for (let j = i + 1; j < pairs.length; j++) {
      const e = pairs[i], f = pairs[j];
      if (e.u !== f.u || e.v !== f.v) continue;
      if (e.a * f.b - f.a * e.b !== 0) continue;
      return e.a * f.c === f.a * e.c && e.b * f.c === f.b * e.c
        ? 'the two equations are the same line: every point on it is a solution'
        : 'the two equations are parallel lines: nothing solves both';
    }
  }

  for (const m of q.matchAll(BOTH_SIDES)) {
    if (coef(m[1]) === coef(m[4])) {
      return num(m[3]) === num(m[5])
        ? 'both sides are the same: every value is a solution'
        : 'the letter cancels and leaves a false statement: nothing solves it';
    }
  }

  const inv = q.match(INVERSE);
  if (inv && Number(inv[1]) * Number(inv[4]) - Number(inv[2]) * Number(inv[3]) === 0) {
    return 'the determinant is 0: this matrix has no inverse';
  }

  return null;
}

/** True when a question has a shape this audit can judge. */
const judged = (question) => {
  const q = clean(question);
  return [...q.matchAll(PAIR_EQ)].length >= 2 || new RegExp(BOTH_SIDES.source, 'i').test(q) || INVERSE.test(q);
};

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

function auditSkill(id, generate, screen, draws) {
  const real = Math.random;
  Math.random = seeded(seedFor(id));
  let seen = 0, bad = 0, example = null, total = 0;
  try {
    for (let i = 0; i < (seen ? draws : screen); i++) {
      let p;
      try { p = generate(id); } catch { continue; }
      if (!p?.question || p.placeholder) continue;
      total++;
      if (!judged(p.question)) continue;
      seen++;
      const why = noUniqueAnswer(p.question);
      if (why) { bad++; example ||= { question: p.question, why }; }
    }
  } finally { Math.random = real; }
  return { id, total, seen, bad, example };
}

/**
 * Every skill, or the ids given. `generate` is there so a test can show the
 * audit catching a bad generator without one existing in the product.
 */
export async function auditUniqueAnswers({ ids, generate, screen = 40, draws = 1500 } = {}) {
  const { SKILLS } = await import(resolve(root, 'src/ai-tutor/knowledgeGraph.js'));
  const gen = generate || (await import(resolve(root, 'src/ai-tutor/problemGenerators.js'))).generateProblem;
  const results = (ids || Object.keys(SKILLS)).map((id) => auditSkill(id, gen, screen, draws));
  return { judged: results.filter((r) => r.seen), failing: results.filter((r) => r.bad) };
}

export function reportUniqueAnswers({ judged: j, failing }) {
  const lines = [`Skills with a solve question this audit can judge: ${j.length}; with a draw that has no single answer: ${failing.length}`];
  for (const r of failing) {
    lines.push(`  ${r.id}: ${r.bad} of ${r.seen} draws, e.g. "${r.example.question}" (${r.example.why})`);
  }
  return lines.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const audit = await auditUniqueAnswers();
  console.log(reportUniqueAnswers(audit));
  if (process.argv.includes('--verbose')) console.log(audit.judged.map((r) => `${r.id} ${r.seen}/${r.total}`).join('\n'));
  process.exit(audit.failing.length ? 1 : 0);
}
