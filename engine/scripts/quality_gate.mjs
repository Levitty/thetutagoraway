// ============================================================================
// QUALITY GATE — scores every skill's content against the "effective content"
// bar AND independently verifies the answers are mathematically correct.
//
//   node engine/scripts/quality_gate.mjs            # all skills, summary
//   node engine/scripts/quality_gate.mjs --authored # only structured skills
//   node engine/scripts/quality_gate.mjs --verbose  # per-skill detail
//   node engine/scripts/quality_gate.mjs --report-only --json <file>
//                                  # measure and write, never fail (report mode)
//
// Since 5 Nov 2026 it no longer counts new numbers as variety. It measures, per
// skill (content_measures.mjs): distinct question FORMS, whether draws teach the
// tagged outcomes (curriculum/skillTags.js), one correct answer per draw, and
// sense checks. Families (content/families) must pass family_checks.mjs reviewed
// or not. See the "Range" section at the bottom.
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
const { auditHints, reportHints } = await import(resolve(root, 'engine/scripts/audit_hint_leaks.mjs'));
const { measureAll, summarise, gradeTable, rangeFailures } = await import(resolve(root, 'engine/scripts/range_report.mjs'));
const { setFamilyMode } = await import(resolve(root, 'src/ai-tutor/content/families/core.js'));
const { checkFamily, checkForms, FAMILIES } = await import(resolve(root, 'engine/scripts/family_checks.mjs'));

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose');
const AUTHORED_ONLY = args.includes('--authored');

const REPORT_ONLY = args.includes('--report-only');
const JSON_OUT = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;

const SAMPLES = 14;          // generations per skill for the answer check
const REPEATS_MIN = 6;       // distinct questions required out of SAMPLES
const FORMS_DRAWS = 60;      // draws per skill for the form and fit measures
const FORMS_MIN = 3;         // distinct forms a Grade 4 to 9 skill must reach
const ON_TOPIC_MIN = 0.8;    // share of draws that must teach the tagged outcomes
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
    // A mixed number ("2 1/2") is read before spaces are dropped: dropping
    // them first turned it into 21/2 and failed correct keys.
    const raw = String(p.answer).trim();
    const mixed = raw.match(/^(-?)(\d+)\s+(\d+)\/(\d+)$/);
    const ans = raw.replace(/\s/g, '');
    const m = ans.match(/^(-?\d+)\/(-?\d+)$/);
    const val = mixed ? (mixed[1] ? -1 : 1) * ((+mixed[2]) + (+mixed[3]) / (+mixed[4]))
      : m ? (+m[1]) / (+m[2]) : parseFloat(ans);
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
  if (v.kind === 'number') {
    // Plain numeric answer: the stated answer must parse to the verify value.
    // Children's answers are compared elsewhere; here we only check the content
    // author's own answer against the number they said it should be.
    const got = parseFloat(String(p.answer).replace(/[\s,]/g, ''));
    return Number.isFinite(got) && Math.abs(got - v.value) < EPS
      ? { ok: true } : { ok: false, reason: `answer ${p.answer} ≠ ${v.value}` };
  }
  if (v.kind === 'text') {
    // Fact-style answer: the stated answer must match the verify value.
    return v.value != null && String(p.answer).trim().toLowerCase() === String(v.value).trim().toLowerCase()
      ? { ok: true } : { ok: false, reason: `answer "${p.answer}" ≠ verify value "${v.value}"` };
  }
  return { ok: null, reason: `unknown verify kind ${v.kind}` };
}

// ---- score one skill ----
function scoreSkill(id, forms) {
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
  if (has.variety < REPEATS_MIN) issues.push(`repeats itself: ${has.variety}/${SAMPLES} distinct`);
  if (verifyFails > 0) issues.push(`${verifyFails}/${SAMPLES} generated answers UNVERIFIED/WRONG`);
  // A skill that CARRIES a verify hook the checker does not understand was
  // silently scored as if it had no hook at all, and still printed "verified"
  // below because an unknown kind records no failure. That is how G4_LETTERS
  // sat unchecked: it asked for `kind: 'number'`, which nothing implemented.
  if (sample.verify && verifyChecked === 0 && verifyFails === 0) {
    issues.push(`verify hook "${sample.verify.kind}" is not implemented — answers NEVER CHECKED`);
  }

  // Weighted score (correctness dominates).
  let score = 0;
  score += has.verified ? 40 : (sample.verify ? 0 : 15);   // 40 if verified; partial if unverifiable
  score += has.workedExample ? 20 : 0;
  score += has.steps ? 15 : 0;
  score += Math.min(has.hints, 3) / 3 * 10;
  score += has.misconceptions ? 5 : 0;
  // Variety is question forms. New numbers earn nothing: they only stop repeats.
  score += Math.min(forms ?? FORMS_MIN, FORMS_MIN) / FORMS_MIN * 10;
  score = Math.round(score);

  return { id, score, has, issues, sample };
}

// ---- run ----
let ids = Object.keys(SKILLS);
if (AUTHORED_ONLY) ids = ids.filter(id => STRUCTURED_IDS.includes(id));

setFamilyMode('reviewed');
const childView = measureAll(FORMS_DRAWS);       // what children get today
setFamilyMode('all');
const bankView = measureAll(FORMS_DRAWS);        // with every family, reviewed or not
const results = ids.map(id => scoreSkill(id, bankView[id]?.forms));
setFamilyMode('reviewed');
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
    `${r.issues.length ? '— ' + r.issues.join('; ')
      : `${r.has.verified ? 'verified' : 'not verifiable'}, ${bankView[r.id]?.forms ?? '?'} forms, ${r.has.hints} hints`}`);
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

// ---- no hint may name its own answer ----
// Enumerated, not sampled: each skill is generated until it stops producing
// hints it has not already produced. This lives in the gate rather than in
// `npm test` because it costs about a minute — too slow to pay on every test
// run, and exactly the sort of thing a release should pay for.
// `node engine/scripts/audit_hint_leaks.mjs --deep --verbose` goes further.
console.log(`\n--- Hints (enumerated${VERBOSE ? '' : '; --verbose for the templates'}) ---`);
const hintAudit = auditHints();
console.log(reportHints(hintAudit, { verbose: VERBOSE }));

// ---- Range: forms, fit, one right answer, and the families ------------------
setFamilyMode('reviewed');
const baseForms = Object.fromEntries(Object.entries(childView).map(([id, m]) => [id, m.formExamples]));
const familyFails = [...checkForms(baseForms), ...FAMILIES.flatMap(f => checkFamily(f))];
const childFails = rangeFailures(childView, { formsMin: 0, onTopicMin: ON_TOPIC_MIN });
const bankFails = rangeFailures(bankView, { formsMin: FORMS_MIN, onTopicMin: ON_TOPIC_MIN });

console.log(`\n--- Range, what children get today (reviewed families only) ---`);
console.log(gradeTable(summarise(childView)));
console.log(`\n--- Range, with every family on (${FAMILIES.length} families) ---`);
console.log(gradeTable(summarise(bankView)));
const show = (label, list, max = VERBOSE ? 1e9 : 40) => {
  console.log(`\n${label}: ${list.length}`);
  list.slice(0, max).forEach(x => console.log(`  ${x}`));
  if (list.length > max) console.log(`  ... and ${list.length - max} more (--verbose)`);
};
show('Failures in what children get today', childFails.hard);
show('Reported, not failing, in what children get today', childFails.soft);
show('Failures with every family on', bankFails.hard);
show('Families failing their checks', familyFails);

if (JSON_OUT) {
  const { writeFileSync } = await import('node:fs');
  const lean = (v) => Object.fromEntries(Object.entries(v).map(([id, m]) => [id, { ...m, questions: undefined }]));
  writeFileSync(JSON_OUT, JSON.stringify({ families: FAMILIES.length, child: summarise(childView), bank: summarise(bankView), childFails, bankFails, familyFails, perSkill: lean(childView), perSkillBank: lean(bankView) }, null, 1));
}
if (REPORT_ONLY) { console.log('\nReport mode: nothing fails.'); process.exit(0); }

// Exit non-zero on anything a child could meet, or anything a family gets wrong.
const authoredFails = authored.filter(r => r.score < 85);
const rangeBad = childFails.hard.length + bankFails.hard.length + familyFails.length;
if (hintAudit.leaking.length) {
  console.log(`\n${hintAudit.leaking.length} skill(s) leak an answer through a hint.`);
  process.exit(1);
}
if (authoredFails.length) {
  console.log(`\n${authoredFails.length} authored skill(s) below bar.`);
  process.exit(1);
}
if (rangeBad) {
  console.log(`\n${rangeBad} range failure(s).`);
  process.exit(1);
}
console.log(`\nAll ${authored.length} authored skills pass the bar, and the range checks pass.`);
