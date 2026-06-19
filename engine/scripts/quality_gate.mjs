// ============================================================================
// QUALITY GATE — scores every skill's content against the "effective content"
// bar AND independently verifies the answers are mathematically correct.
//
//   node engine/scripts/quality_gate.mjs            # all skills, summary
//   node engine/scripts/quality_gate.mjs --authored # only structured skills
//   node engine/scripts/quality_gate.mjs --verbose  # per-skill detail
//
// A tutor that teaches WRONG answers is worse than none — so the gate doesn't
// trust the stated answer. For equations it substitutes the solution back; for
// algebraic identities (expand/simplify/factorise) it evaluates the original
// and the answer at random values and checks they agree. Any mismatch fails.
// ============================================================================
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..', '..');

const { SKILLS } = await import(resolve(root, 'src/ai-tutor/knowledgeGraph.js'));
const { generateProblem } = await import(resolve(root, 'src/ai-tutor/problemGenerators.js'));
const { STRUCTURED_IDS } = await import(resolve(root, 'src/ai-tutor/content/index.js'));

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose');
const AUTHORED_ONLY = args.includes('--authored');

const SAMPLES = 14;          // generations per skill for variety + verify
const VARIETY_MIN = 6;       // distinct questions required out of SAMPLES
const EPS = 1e-6;

// ---- independent answer verification ----
function verifyProblem(p) {
  const v = p.verify;
  if (!v) return { ok: null, reason: 'no verify hook' };
  if (v.kind === 'equation') {
    const r = v.residual(v.solution);
    return Math.abs(r) < EPS
      ? { ok: true }
      : { ok: false, reason: `solution ${v.solution} gives residual ${r}` };
  }
  if (v.kind === 'identity') {
    for (const t of [-3, -1, 0.5, 2, 5, 7.5]) {
      const a = v.original(t), b = v.answerExpr(t);
      if (Math.abs(a - b) > EPS) {
        return { ok: false, reason: `mismatch at x=${t}: original ${a} ≠ answer ${b}` };
      }
    }
    return { ok: true };
  }
  if (v.kind === 'fraction') {
    // The stated answer (a fraction / whole / decimal) must equal the value
    // computed directly from the operands.
    const ans = String(p.answer).replace(/\s/g, '');
    const m = ans.match(/^(-?\d+)\/(-?\d+)$/);
    const val = m ? (+m[1]) / (+m[2]) : parseFloat(ans);
    const tol = v.tol || 1e-6;   // rounded answers (π, trig) set a small tolerance
    return Math.abs(val - v.value) <= tol
      ? { ok: true } : { ok: false, reason: `answer ${p.answer} = ${val} ≠ ${v.value}` };
  }
  if (v.kind === 'compare') {
    const want = v.diff > 1e-9 ? '>' : v.diff < -1e-9 ? '<' : '=';
    return String(p.answer).trim() === want
      ? { ok: true } : { ok: false, reason: `answer ${p.answer} ≠ ${want}` };
  }
  if (v.kind === 'index') {
    // Independently recompute the exponent from the index law.
    const exp = v.op === 'mul' ? v.a + v.b : v.op === 'div' ? v.a - v.b : v.a * v.b;
    const got = String(p.answer).replace(/\s/g, '');
    return (got === `${v.base}^${exp}` || got === `${v.base}^(${exp})`)
      ? { ok: true } : { ok: false, reason: `${got} ≠ ${v.base}^${exp}` };
  }
  if (v.kind === 'point') {
    // The text answer (graceful fallback) must match the visual target.
    const m = String(p.answer).replace(/\s/g, '').match(/^\((-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)\)$/);
    if (!m) return { ok: false, reason: `answer ${p.answer} is not a coordinate` };
    return (+m[1] === v.x && +m[2] === v.y)
      ? { ok: true } : { ok: false, reason: `${p.answer} ≠ (${v.x}, ${v.y})` };
  }
  if (v.kind === 'exact') {
    return String(p.answer).trim().toLowerCase() === String(v.value).trim().toLowerCase()
      ? { ok: true } : { ok: false, reason: `answer ${p.answer} ≠ ${v.value}` };
  }
  if (v.kind === 'roots') {
    for (const r of v.roots) {
      if (Math.abs(v.poly(r)) > EPS) return { ok: false, reason: `root ${r} gives ${v.poly(r)} ≠ 0` };
    }
    return { ok: true };
  }
  if (v.kind === 'numeric') {
    return Math.abs(v.f(v.at) - v.value) < EPS
      ? { ok: true } : { ok: false, reason: `f(${v.at}) = ${v.f(v.at)} ≠ stated ${v.value}` };
  }
  // Relative tolerance: finite-difference truncation error scales with the
  // magnitude of the function/derivative, so an absolute bound gives false
  // failures on large values. Allow 0.1% + a small floor.
  const close = (approx, exact) => Math.abs(approx - exact) <= 1e-3 * (1 + Math.abs(exact));
  const fd = (f, x, h = 1e-4) => (f(x + h) - f(x - h)) / (2 * h);

  if (v.kind === 'derivative') {
    for (const x of [-1.5, -0.5, 0.7, 1.8]) {
      if (!close(fd(v.f, x), v.df(x))) {
        return { ok: false, reason: `derivative wrong at x=${x}: ≈${fd(v.f, x).toFixed(4)} vs stated ${v.df(x)}` };
      }
    }
    return { ok: true };
  }
  if (v.kind === 'derivative-at') {
    // Verify just f'(at) = value (the single point the answer asks about).
    return close(fd(v.f, v.at), v.value)
      ? { ok: true } : { ok: false, reason: `f'(${v.at}) ≈ ${fd(v.f, v.at).toFixed(4)} ≠ stated ${v.value}` };
  }
  if (v.kind === 'integral') {
    // The claimed antiderivative F must satisfy F'(x) ≈ integrand(x).
    for (const x of [-1.5, -0.5, 0.7, 1.8]) {
      if (!close(fd(v.F, x), v.integrand(x))) {
        return { ok: false, reason: `∫ wrong at x=${x}: F'≈${fd(v.F, x).toFixed(4)} vs integrand ${v.integrand(x)}` };
      }
    }
    return { ok: true };
  }
  if (v.kind === 'stationary') {
    const grad = fd(v.f, v.x0);
    return Math.abs(grad) <= 1e-2
      ? { ok: true } : { ok: false, reason: `f'(${v.x0}) ≈ ${grad.toFixed(4)} ≠ 0` };
  }
  if (v.kind === 'definite') {
    // Simpson's rule (exact for polynomials up to degree 3; accurate otherwise).
    const N = 1000, h = (v.b - v.a) / N;
    let sum = v.integrand(v.a) + v.integrand(v.b);
    for (let i = 1; i < N; i++) sum += (i % 2 ? 4 : 2) * v.integrand(v.a + i * h);
    const approx = (h / 3) * sum;
    return close(approx, v.value)
      ? { ok: true } : { ok: false, reason: `∫ = ${approx.toFixed(3)} ≠ stated ${v.value}` };
  }
  return { ok: null, reason: `unknown verify kind ${v.kind}` };
}

// ---- score one skill ----
function scoreSkill(id) {
  const issues = [];
  let sample;
  const questions = new Set();
  let verifyFails = 0, verifyChecked = 0;

  for (let i = 0; i < SAMPLES; i++) {
    let p;
    try { p = generateProblem(id); } catch (e) { issues.push(`threw: ${e.message}`); break; }
    if (!sample) sample = p;
    if (p?.question) questions.add(p.question);
    const v = verifyProblem(p);
    if (v.ok === true) verifyChecked++;
    else if (v.ok === false) { verifyFails++; if (issues.length < 3) issues.push(`WRONG ANSWER: ${v.reason}`); }
  }
  if (!sample) return { id, score: 0, issues, fatal: true };

  // Pedagogical completeness checks.
  const has = {
    structured: !!STRUCTURED_IDS.includes(id),
    workedExample: !!sample.workedExample,
    steps: !!(sample.solution?.steps?.length || sample.workedExample?.steps?.length),
    hints: Array.isArray(sample.hints) ? sample.hints.length : (sample.hint ? 1 : 0),
    misconceptions: sample.misconceptions?.length || 0,
    variety: questions.size,
    verified: verifyChecked > 0 && verifyFails === 0,
  };

  if (!has.workedExample) issues.push('no worked example');
  if (!has.steps) issues.push('no step-by-step solution');
  if (has.hints < 2) issues.push(`only ${has.hints} hint(s) (need ≥2)`);
  if (has.variety < VARIETY_MIN) issues.push(`low variety: ${has.variety}/${SAMPLES} distinct`);
  if (verifyFails > 0) issues.push(`${verifyFails}/${SAMPLES} generated answers UNVERIFIED/WRONG`);

  // Weighted score (correctness dominates).
  let score = 0;
  score += has.verified ? 40 : (sample.verify ? 0 : 15);   // 40 if verified; partial if unverifiable
  score += has.workedExample ? 20 : 0;
  score += has.steps ? 15 : 0;
  score += Math.min(has.hints, 3) / 3 * 10;
  score += has.misconceptions ? 5 : 0;
  score += Math.min(has.variety, VARIETY_MIN) / VARIETY_MIN * 10;
  score = Math.round(score);

  return { id, score, has, issues, sample };
}

// ---- run ----
let ids = Object.keys(SKILLS);
if (AUTHORED_ONLY) ids = ids.filter(id => STRUCTURED_IDS.includes(id));

const results = ids.map(scoreSkill);
const authored = results.filter(r => r.has?.structured);
const passed = results.filter(r => r.score >= 85);
const wrongAnswers = results.filter(r => r.issues.some(i => i.includes('WRONG') || i.includes('UNVERIFIED')));

console.log(`\n=== QUALITY GATE (${ids.length} skills) ===`);
console.log(`Authored to structured schema : ${authored.length}`);
console.log(`Pass (score ≥ 85)             : ${passed.length}`);
console.log(`Skills with WRONG/UNVERIFIED answers : ${wrongAnswers.length}`);

console.log(`\n--- Authored vertical (the strand we're proving) ---`);
for (const r of authored.sort((a, b) => a.id.localeCompare(b.id))) {
  const mark = r.score >= 85 ? 'PASS' : 'FAIL';
  console.log(`  [${mark}] ${r.score.toString().padStart(3)}  ${r.id.padEnd(22)} ` +
    `${r.issues.length ? '— ' + r.issues.join('; ') : `verified, ${r.has.variety} variety, ${r.has.hints} hints`}`);
}

if (VERBOSE && authored[0]) {
  const s = authored[0].sample;
  console.log(`\n--- Sample authored problem (${authored[0].id}) ---`);
  console.log('  Q:', s.question);
  console.log('  A:', s.answer);
  console.log('  Hints:', s.hints);
  console.log('  Steps:', s.solution.steps.map(x => `${x.text} -> ${x.expr}`));
  console.log('  Worked example:', s.workedExample.question, '=>', s.workedExample.answer);
}

// Exit non-zero if any authored skill fails — usable as a CI gate.
const authoredFails = authored.filter(r => r.score < 85);
if (authoredFails.length) {
  console.log(`\n${authoredFails.length} authored skill(s) below bar.`);
  process.exit(1);
}
console.log(`\nAll ${authored.length} authored skills pass the bar.`);
