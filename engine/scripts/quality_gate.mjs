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
  if (v.kind === 'angle_class') {
    // Independently re-derive the classification from the degree measure.
    const derived = v.deg < 90 ? 'acute' : v.deg === 90 ? 'right' : v.deg < 180 ? 'obtuse' : 'reflex';
    return derived === v.value
      ? { ok: true } : { ok: false, reason: `${v.deg}° is ${derived}, not ${v.value}` };
  }
  if (v.kind === 'text') {
    // Fact-style answer: the stated answer must match the verify value.
    return v.value != null && String(p.answer).trim().toLowerCase() === String(v.value).trim().toLowerCase()
      ? { ok: true } : { ok: false, reason: `answer "${p.answer}" ≠ verify value "${v.value}"` };
  }
  return { ok: null, reason: `unknown verify kind ${v.kind}` };
}

// ---- teaching-visual model validation ----
// A malformed model renders a broken picture mid-lesson — treat it as a defect.
function validateModel(m, where) {
  if (!m) return null;
  const d = m.data;
  if (!d) return `${where}: model has no data`;
  switch (m.type) {
    case 'balance': {
      for (const side of ['left', 'right']) {
        const s = d[side];
        if (!s || !Number.isFinite(s.x ?? 0) || !Number.isFinite(s.units ?? 0)) return `${where}: balance ${side} pan malformed`;
      }
      return null;
    }
    case 'numberline-jump': {
      if (!Number.isFinite(d.from) || !Number.isFinite(d.delta)) return `${where}: numberline from/delta not numeric`;
      const to = d.to ?? d.from + d.delta;
      if (to !== d.from + d.delta) return `${where}: numberline to ≠ from + delta`;
      return null;
    }
    case 'area-model': {
      if (!d.rows?.length || !d.cols?.length) return `${where}: area-model missing rows/cols`;
      if (!Array.isArray(d.cells) || d.cells.length !== d.rows.length) return `${where}: area-model cells rows mismatch`;
      if (d.cells.some(r => !Array.isArray(r) || r.length !== d.cols.length)) return `${where}: area-model cells cols mismatch`;
      return null;
    }
    case 'bar-model': {
      if (!d.bars?.length) return `${where}: bar-model has no bars`;
      for (const b of d.bars) {
        if (!Number.isFinite(b.n) || !Number.isFinite(b.d) || b.d <= 0 || b.n < 0 || b.n > b.d) return `${where}: bar ${b.n}/${b.d} out of range`;
        if (b.parts && b.parts.reduce((s, p) => s + p.count, 0) !== b.d) return `${where}: bar parts don't sum to ${b.d}`;
      }
      return null;
    }
    case 'place-value': {
      if (!d.numbers?.length) return `${where}: place-value has no numbers`;
      for (const n of [...d.numbers, ...(d.result != null ? [d.result] : [])]) {
        if (!/^\d+(\.\d+)?$/.test(String(n))) return `${where}: place-value entry ${n} is not a plain decimal`;
      }
      return null;
    }
    case 'pattern-growth': {
      if (!Number.isFinite(d.start) || !Number.isFinite(d.diff) || d.start < 1 || d.diff < 1) return `${where}: pattern-growth needs positive start/diff`;
      const count = d.count ?? 4;
      if (count < 3 || count > 6 || d.start + (count - 1) * d.diff > 24) return `${where}: pattern-growth towers too tall/short to draw`;
      return null;
    }
    case 'fraction-grid': {
      if (!Number.isFinite(d.rows) || !Number.isFinite(d.cols) || d.rows < 1 || d.cols < 1) return `${where}: fraction-grid rows/cols invalid`;
      if (d.shadeRows < 0 || d.shadeRows > d.rows || d.shadeCols < 0 || d.shadeCols > d.cols) return `${where}: fraction-grid shading out of range`;
      return null;
    }
    case 'shape': {
      if (!['rect', 'square', 'triangle', 'circle', 'oval'].includes(d.kind)) return `${where}: unknown shape kind ${d.kind}`;
      const dims = Object.values(d.dims || {});
      if (!dims.length || dims.some(v => !Number.isFinite(v) || v <= 0)) return `${where}: shape dims must be positive numbers`;
      return null;
    }
    case 'numberline-interval': {
      if (!Number.isFinite(d.lo) || !Number.isFinite(d.hi) || d.lo >= d.hi) return `${where}: interval lo/hi invalid`;
      if (!Number.isFinite(d.value) || d.value < d.lo || d.value > d.hi) return `${where}: stated value outside its interval`;
      return null;
    }
    case 'ten-frame': {
      const total = d.op === '+' ? (d.a + d.b) : d.a;
      if (!Number.isFinite(d.a) || !Number.isFinite(d.b) || d.a < 0 || d.b < 0) return `${where}: ten-frame a/b invalid`;
      if (total > 20) return `${where}: ten-frame overflows two frames (${total})`;
      if (d.op === '−' && d.b > d.a) return `${where}: ten-frame subtracts more than shown`;
      return null;
    }
    case 'dot-array': {
      if (d.rows != null) {
        if (d.rows < 1 || d.cols < 1 || d.rows > 12 || d.cols > 12) return `${where}: dot-array ${d.rows}×${d.cols} undrawable`;
      } else {
        if (!Number.isFinite(d.total) || !Number.isFinite(d.groupSize) || d.groupSize < 1 || d.total < 1) return `${where}: dot-array share data invalid`;
        if (d.groupSize > 12 || d.total / d.groupSize > 12) return `${where}: dot-array share too large to draw`;
      }
      return null;
    }
    case 'clock': {
      if (!Number.isFinite(d.h) || !Number.isFinite(d.m) || d.h < 0 || d.h > 23 || d.m < 0 || d.m > 59) return `${where}: clock time ${d.h}:${d.m} invalid`;
      return null;
    }
    case 'money': {
      if (!d.items?.length) return `${where}: money has no items`;
      const DENOMS = [1, 5, 10, 20, 50, 100, 200, 500, 1000];
      for (const it of d.items) {
        if (!DENOMS.includes(it.value) || !Number.isFinite(it.count) || it.count < 1) return `${where}: money item ${it.value}×${it.count} invalid (not a Kenyan denomination)`;
      }
      if (d.items.reduce((s, it) => s + Math.min(it.count, 12), 0) > 24) return `${where}: too many money pieces to draw`;
      return null;
    }
    case 'base-ten': {
      if (!Number.isFinite(d.value) || d.value < 1 || d.value > 999) return `${where}: base-ten value ${d.value} out of drawable range (1-999)`;
      return null;
    }
    case 'formula-triangle': {
      if (!d.top || !d.left || !d.right) return `${where}: formula-triangle needs top/left/right`;
      return null;
    }
    case 'transpose': {
      if (!d.start?.lhs || d.start?.rhs == null || !d.moved || !d.becomes) return `${where}: transpose missing parts`;
      if (!Array.isArray(d.after) || !d.after.length) return `${where}: transpose has no working lines`;
      return null;
    }
    case 'column-op': {
      if (!Number.isFinite(d.a) || !Number.isFinite(d.b)) return `${where}: column-op needs numeric a and b`;
      if (d.op !== '+' && d.op !== '−' && d.op !== '-') return `${where}: column-op op must be + or −`;
      if ((d.op === '−' || d.op === '-') && d.b > d.a) return `${where}: column-op would go negative`;
      return null;
    }
    default: return `${where}: unknown model type ${m.type}`;
  }
}

// ---- score one skill ----
function scoreSkill(id) {
  const issues = [];
  let sample;
  const questions = new Set();
  let verifyFails = 0, verifyChecked = 0, modelBad = 0;

  for (let i = 0; i < SAMPLES; i++) {
    let p;
    try { p = generateProblem(id); } catch (e) { issues.push(`threw: ${e.message}`); break; }
    if (!sample) sample = p;
    if (p?.question) questions.add(p.question);
    const v = verifyProblem(p);
    if (v.ok === true) verifyChecked++;
    else if (v.ok === false) { verifyFails++; if (issues.length < 3) issues.push(`WRONG ANSWER: ${v.reason}`); }
    // Teaching-visual models must be well-formed wherever they appear.
    const mErrs = [
      validateModel(p?.model, 'problem'),
      ...(p?.solution?.steps || []).map((s, si) => validateModel(s?.model, `step ${si + 1}`)),
      ...((p?.workedExample?.richSteps) || []).map((s, si) => validateModel(s?.model, `example step ${si + 1}`)),
    ].filter(Boolean);
    if (mErrs.length) { modelBad++; if (issues.length < 6) issues.push(`BAD MODEL: ${mErrs[0]}`); }
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
  if (modelBad > 0) score = Math.min(score, 60);   // a broken picture fails the bar

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
