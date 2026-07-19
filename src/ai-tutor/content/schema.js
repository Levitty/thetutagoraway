// ============================================================================
// CONTENT SCHEMA + PROBLEM BUILDERS — the infrastructure for effective content.
//
// A "good enough" problem is just a question + answer. An *effective* one, by
// the learning science, carries five things:
//   1. a WORKED EXAMPLE to study before practising (worked-example effect)
//   2. a scaffolded STEP-BY-STEP solution (so a wrong answer teaches)
//   3. a HINT LADDER (graduated help, not the answer)
//   4. MISCONCEPTION feedback (name the specific error, e.g. sign slip)
//   5. VARIETY + a VERIFY hook so the engine can prove the answer is correct
//
// Authoring all of that by hand for 200 skills is hopeless. Instead we build
// pedagogy-aware *builders* per problem TYPE: each emits the full rich object,
// with a guaranteed-correct answer and auto-generated steps, from random
// parameters. A skill is then a thin composition of builders across difficulty
// tiers. This file is those builders; algebra.js is the composition.
// ============================================================================

// ---------------------------------------------------------------- RNG helpers
export const randInt = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const nonzero = (lo, hi) => { let v = 0; while (v === 0) v = randInt(lo, hi); return v; };
export const coin = () => Math.random() < 0.5;

// ---------------------------------------------------------------- formatting
// Render a single signed term like "+ 3x", "- x", "+ 5". `first` omits a
// leading "+ " and renders a leading "-" tight.
export const fmtTerm = (coef, varname = '', first = false) => {
  if (coef === 0) return '';
  const sign = coef < 0 ? '-' : '+';
  const mag = Math.abs(coef);
  let body;
  if (varname) body = (mag === 1 ? '' : mag) + varname;
  else body = String(mag);
  if (first) return (coef < 0 ? '-' : '') + body;
  return ` ${sign} ${body}`;
};

// ax + b  (b may be 0). `varname` defaults to x.
export const fmtLinear = (a, b, varname = 'x') => {
  let s = fmtTerm(a, varname, true);
  if (s === '') s = '0';
  s += fmtTerm(b, '');
  return s.trim() || '0';
};

// ax^2 + bx + c, with both ^ and unicode forms. Delegates to fmtPoly so the
// leading-term / sign / zero-coefficient handling is correct even when a=0
// (i.e. the expression is really linear).
export const fmtQuadratic = (a, b, c) => fmtPoly([[a, 2], [b, 1], [c, 0]]);

// General polynomial formatter. terms: [[coef, power], ...] in any order; it
// combines like powers, drops zeros, sorts high→low. Returns `caret` (x^n) and
// `uni` (x², x³) forms for answer-matching.
export const fmtPoly = (terms) => {
  const map = {};
  for (const [c, p] of terms) map[p] = (map[p] || 0) + c;
  const powers = Object.keys(map).map(Number).sort((a, b) => b - a);
  const build = (uni) => {
    let s = '', first = true;
    for (const p of powers) {
      const c = map[p];
      if (c === 0) continue;
      const mag = Math.abs(c);
      let body;
      if (p === 0) body = `${mag}`;
      else {
        const coef = mag === 1 ? '' : `${mag}`;
        const xp = p === 1 ? 'x' : uni && p === 2 ? 'x²' : uni && p === 3 ? 'x³' : `x^${p}`;
        body = `${coef}${xp}`;
      }
      s += first ? (c < 0 ? '-' : '') + body : ` ${c < 0 ? '-' : '+'} ${body}`;
      first = false;
    }
    return s || '0';
  };
  return { caret: build(false), uni: build(true) };
};

// Numeric helpers for verification of calculus content.
export const evalPoly = (terms, x) => terms.reduce((s, [c, p]) => s + c * Math.pow(x, p), 0);

// Accept-list helper: dedupe + add spacing/`x=`/unicode variants.
export const accepts = (...forms) => {
  const out = new Set();
  for (const f of forms) {
    if (f == null) continue;
    const s = String(f);
    out.add(s);
    out.add(s.replace(/\s+/g, ''));
  }
  return [...out];
};

// ---------------------------------------------------------------- hint ladder
// Graduated hints: orient -> method -> next concrete step. Never the answer.
export const hintLadder = (...hints) => hints.filter(Boolean);

// Render a {text, expr} solution step as a single human string (the form the
// current lesson UI renders for worked examples and reveals).
export const stepText = (s) =>
  (typeof s === 'string') ? s : (s.expr ? `${s.text}   →   ${s.expr}` : s.text);

// Break a skill into ordered KNOWLEDGE POINTS (tiny sub-steps), taught one at a
// time to keep cognitive load low. The engine can target a specific KP via
// opts.kp (advancing as each is mastered); with no kp it cycles through them so
// a lesson still spans the full range. Each kp is an already-wrapped generator.
export const withKPs = (kps) => {
  let auto = 0;
  const gen = (opts = {}) => {
    const i = opts.kp != null ? Math.max(0, Math.min(opts.kp, kps.length - 1)) : (auto++ % kps.length);
    return kps[i]();
  };
  gen.kpCount = kps.length;   // so the lesson loop can climb the ladder in order
  return gen;
};

// Bundle multiple representations of a skill at different CONCRETE→PICTORIAL→
// ABSTRACT levels. The engine asks for a level (default 'abstract'); when a
// student struggles, the lesson requests 'concrete' to build intuition first.
// Each level's value is an already-wrapped generator. Falls back to abstract.
export const withLevels = (levels) => (opts = {}) => {
  const want = opts.level;
  const gen = (want && levels[want]) || levels.abstract || levels.concrete || levels.pictorial;
  return gen();
};

// Wrap a builder so every problem also carries: a worked example (a separate
// solved instance, for studying before practice), this problem's own solution
// steps as display strings, and a single first-level hint. The shape matches
// what the lesson UI renders.
export const withWorkedExample = (gen) => () => {
  const p = gen();
  const ex = gen();
  p.hint = p.hint || (p.hints && p.hints[0]);
  p.solutionSteps = (p.solution?.steps || []).map(stepText);
  p.workedExample = {
    problem: ex.question,
    steps: ex.solution.steps.map(stepText),
    solution: ex.solution.answer,
    instruction: ex.instruction,
    richSteps: ex.solution.steps,
  };
  return p;
};

// ============================================================================
// BUILDERS — each returns the full rich problem object.
//   { question, answer, accepts, instruction, hints[], solution{steps[],answer},
//     workedExample{question,steps[],answer}, misconceptions[], verify }
// `verify` lets the quality gate independently confirm correctness.
// ============================================================================

// ---- linear equations: tier 1 (x±b=c), 2 (ax±b=c), 3 (ax+b=cx+d) ----
export function buildLinearEquation({ tier = 2 } = {}) {
  const x = nonzero(-9, 9);
  let a, b, c, d, lhs, rhs;

  if (tier === 1) {
    a = 1; b = nonzero(-12, 12); c = x + b; d = 0;
    lhs = fmtLinear(1, b); rhs = `${c}`;
  } else if (tier === 2) {
    a = nonzero(2, 9); b = nonzero(-9, 9); c = a * x + b; d = 0;
    lhs = fmtLinear(a, b); rhs = `${c}`;
  } else {
    a = nonzero(2, 9); do { c = nonzero(-9, 9); } while (c === a);
    b = nonzero(-9, 9); d = (a - c) * x + b;
    lhs = fmtLinear(a, b); rhs = fmtLinear(c, d);  // fmtLinear renders 1x as "x"
  }
  const question = `Solve for x:   ${lhs} = ${rhs}`;
  // Reduce to A·x + B = 0. Only tier 3 has an x-term on the right; for tiers
  // 1–2 the right side is the constant `c` (no x), so its x-coefficient is 0.
  const rhsA = tier === 3 ? c : 0;
  const rhsB = tier === 3 ? d : c;
  const A = a - rhsA, B = b - rhsB;

  // Grammar-safe phrasing: "Subtract/Add N on both sides" works for either sign.
  const undoConst = (k) => (k >= 0 ? `Subtract ${k}` : `Add ${-k}`);
  const steps = [];
  if (tier === 3) {
    steps.push({ text: `Collect the x-terms: move the right-hand x-term to the left.`, expr: `${fmtLinear(A, b)} = ${d}` });
    steps.push({ text: `${undoConst(b)} on both sides.`, expr: `${fmtLinear(A, 0)} = ${d - b}` });
    if (A !== 1) steps.push({ text: `Divide both sides by ${A}.`, expr: `x = ${x}` });
  } else if (tier === 2) {
    steps.push({ text: `Isolate the x-term: ${undoConst(b).toLowerCase()} on both sides.`, expr: `${a}x = ${c - b}` });
    steps.push({ text: `Divide both sides by ${a}.`, expr: `x = ${x}` });
  } else {
    steps.push({ text: `${undoConst(b)} on both sides.`, expr: `x = ${x}` });
  }

  return {
    type: 'linear-equation',
    instruction: 'Solve for x.',
    question,
    answer: `x = ${x}`,
    accepts: accepts(`x=${x}`, `x = ${x}`, `${x}`),
    hints: hintLadder(
      'Aim to get x by itself on one side.',
      tier === 3 ? 'First collect the x-terms together, then the numbers.' : 'Undo the +/− first, then undo the ×.',
      `Inverse operations: do the opposite of what is done to x, to both sides.`,
    ),
    solution: { steps, answer: `x = ${x}` },
    misconceptions: [
      { when: `${-x}`, feedback: 'Watch the sign — when you move a term across the =, its sign flips.' },
      { when: `${x + (b || 1)}`, feedback: 'Remember to apply the operation to BOTH sides equally.' },
    ],
    verify: { kind: 'equation', solution: x, residual: (t) => A * t + B },
  };
}

// ---- simplify by combining like terms: c1·x + k1 + c2·x + k2 + ... ----
export function buildSimplify({ tier = 1 } = {}) {
  const nTerms = tier >= 2 ? 4 : 3;
  const xs = [], ks = [];
  const parts = [];
  for (let i = 0; i < nTerms; i++) {
    if (coin()) { const c = nonzero(-6, 6); xs.push(c); parts.push({ c, v: 'x' }); }
    else { const k = nonzero(-9, 9); ks.push(k); parts.push({ c: k, v: '' }); }
  }
  if (xs.length === 0) { xs.push(2); parts.push({ c: 2, v: 'x' }); }  // ensure an x-term
  const a = xs.reduce((s, v) => s + v, 0);
  const b = ks.reduce((s, v) => s + v, 0);

  const exprStr = parts.map((p, i) => fmtTerm(p.c, p.v, i === 0)).join('').trim();
  const ans = fmtLinear(a, b);

  return {
    type: 'simplify',
    instruction: 'Simplify by collecting like terms.',
    question: `Simplify:   ${exprStr}`,
    answer: ans,
    accepts: accepts(ans, fmtLinear(a, b).replace(/\s/g, '')),
    hints: hintLadder(
      'Group the x-terms together and the plain numbers together.',
      'Like terms have the same variable part; add their coefficients.',
      `x-terms: ${xs.join(' , ') || 'none'}.   numbers: ${ks.join(' , ') || 'none'}.`,
    ),
    solution: {
      steps: [
        { text: 'Add the coefficients of the x-terms.', expr: `${a}x` },
        { text: 'Add the constant numbers.', expr: `${b >= 0 ? '+ ' : '- '}${Math.abs(b)}` },
        { text: 'Combine.', expr: ans },
      ],
      answer: ans,
    },
    misconceptions: [
      { when: `${a + b}x`, feedback: "Don't combine x-terms with plain numbers — they are not like terms." },
    ],
    verify: { kind: 'identity', original: (t) => a * t + b, answerExpr: (t) => a * t + b },
  };
}

// ---- distribute / expand a single bracket: a(bx + c) ----
export function buildDistribute() {
  const a = nonzero(2, 6), b = nonzero(1, 6) * (coin() ? 1 : -1), c = nonzero(-9, 9);
  const A = a * b, C = a * c;
  const ans = fmtLinear(A, C);
  return {
    type: 'expand-distribute',
    instruction: 'Expand the bracket.',
    question: `Expand:   ${a}(${fmtLinear(b, c)})`,
    answer: ans,
    accepts: accepts(ans, ans.replace(/\s/g, '')),
    hints: hintLadder(
      'Multiply everything inside the bracket by the number outside.',
      `${a} × ${b}x  and  ${a} × (${c}).`,
      'Keep track of signs when multiplying.',
    ),
    solution: {
      steps: [
        { text: `Multiply the x-term: ${a} × ${b}x.`, expr: `${A}x` },
        { text: `Multiply the constant: ${a} × (${c}).`, expr: `${fmtTerm(C, '')}`.trim() },
        { text: 'Write the result.', expr: ans },
      ],
      answer: ans,
    },
    misconceptions: [
      { when: fmtLinear(A, c), feedback: 'Multiply the OUTSIDE number by BOTH terms — you missed the constant.' },
    ],
    verify: { kind: 'identity', original: (t) => a * (b * t + c), answerExpr: (t) => A * t + C },
  };
}

// ---- expand two binomials: (x + p)(x + q) ----
export function buildBinomial() {
  const p = nonzero(-7, 7), q = nonzero(-7, 7);
  const b = p + q, c = p * q;       // x^2 + b x + c
  const f = fmtQuadratic(1, b, c);
  return {
    type: 'expand-binomial',
    instruction: 'Expand and simplify.',
    question: `Expand:   (x${fmtTerm(p, '')})(x${fmtTerm(q, '')})`,
    answer: f.caret,
    accepts: accepts(f.caret, f.uni, f.caret.replace(/\s/g, ''), f.uni.replace(/\s/g, '')),
    hints: hintLadder(
      'Use FOIL: First, Outer, Inner, Last.',
      `First: x·x = x². Last: (${p})·(${q}) = ${c}.`,
      `Outer + Inner give the middle term: ${p}x + ${q}x = ${b}x.`,
    ),
    solution: {
      steps: [
        { text: 'First terms: x · x.', expr: 'x²' },
        { text: `Outer + Inner: ${p}x + ${q}x.`, expr: `${fmtTerm(b, 'x')}`.trim() },
        { text: `Last terms: (${p})(${q}).`, expr: `${fmtTerm(c, '')}`.trim() },
        { text: 'Combine.', expr: f.caret },
      ],
      answer: f.caret,
    },
    misconceptions: [
      { when: fmtQuadratic(1, 0, c).caret, feedback: 'You forgot the middle term — add the Outer and Inner products.' },
      { when: fmtQuadratic(1, b, 0).caret, feedback: 'Multiply the two constants for the last term.' },
    ],
    verify: { kind: 'identity', original: (t) => (t + p) * (t + q), answerExpr: (t) => t * t + b * t + c },
  };
}

// ---- factorise a common factor: abx + ac  ->  a(bx + c) ----
export function buildFactorizeCommon() {
  const a = nonzero(2, 6), b = nonzero(1, 6) * (coin() ? 1 : -1), c = nonzero(-6, 6);
  const A = a * b, C = a * c;
  const ans = `${a}(${fmtLinear(b, c)})`;
  return {
    type: 'factorize-common',
    instruction: 'Factorise fully.',
    question: `Factorise:   ${fmtLinear(A, C)}`,
    answer: ans,
    accepts: accepts(ans, ans.replace(/\s/g, '')),
    hints: hintLadder(
      'Find the highest common factor of both terms.',
      `What number divides both ${A} and ${C}?`,
      `Take out ${a}, then write what remains in the bracket.`,
    ),
    solution: {
      steps: [
        { text: `Highest common factor of ${A} and ${C} is ${a}.`, expr: `${a}( … )` },
        { text: `Divide each term by ${a}.`, expr: `${a}(${fmtLinear(b, c)})` },
      ],
      answer: ans,
    },
    misconceptions: [
      { when: `${a}(${fmtLinear(b, C)})`, feedback: 'Divide BOTH terms by the common factor, including the constant.' },
    ],
    verify: { kind: 'identity', original: (t) => A * t + C, answerExpr: (t) => a * (b * t + c) },
  };
}

// ---- factorise a monic quadratic: x² + bx + c -> (x + p)(x + q) ----
export function buildFactorizeQuadratic() {
  let p, q;
  do { p = nonzero(-7, 7); q = nonzero(-7, 7); } while (p + q === 0 && p * q === 0);
  const b = p + q, c = p * q;        // x² + bx + c
  const orig = fmtQuadratic(1, b, c);
  const ans = `(${fmtLinear(1, p)})(${fmtLinear(1, q)})`;
  const ansSwap = `(${fmtLinear(1, q)})(${fmtLinear(1, p)})`;
  return {
    type: 'factorize-quadratic',
    instruction: 'Factorise into two brackets.',
    question: `Factorise:   ${orig.caret}`,
    answer: ans,
    accepts: accepts(ans, ansSwap, ans.replace(/\s/g, ''), ansSwap.replace(/\s/g, '')),
    hints: hintLadder(
      'Find two numbers that MULTIPLY to the constant and ADD to the middle coefficient.',
      `Multiply to ${c}, add to ${b}.`,
      `The numbers are ${p} and ${q}.`,
    ),
    solution: {
      steps: [
        { text: `Find two numbers multiplying to ${c} and adding to ${b}.`, expr: `${p} and ${q}` },
        { text: 'Write as two brackets.', expr: ans },
      ],
      answer: ans,
    },
    misconceptions: [
      { when: `(${fmtLinear(1, -p)})(${fmtLinear(1, -q)})`, feedback: 'Check the signs — the bracket numbers have the SAME sign as the factors of c.' },
    ],
    verify: { kind: 'identity', original: (t) => t * t + b * t + c, answerExpr: (t) => (t + p) * (t + q) },
  };
}

// ---- solve a quadratic by factorising: x² + bx + c = 0 ----
export function buildSolveQuadratic() {
  let r1, r2;
  do { r1 = nonzero(-7, 7); r2 = nonzero(-7, 7); } while (r1 === r2);
  if (r1 > r2) [r1, r2] = [r2, r1];
  const b = -(r1 + r2), c = r1 * r2;   // roots r1, r2
  const orig = fmtQuadratic(1, b, c);
  const ans = `x = ${r1} or x = ${r2}`;
  return {
    type: 'solve-quadratic',
    instruction: 'Solve for x.',
    question: `Solve:   ${orig.caret} = 0`,
    answer: ans,
    accepts: accepts(ans, `x=${r1} or x=${r2}`, `x=${r2} or x=${r1}`,
      `${r1}, ${r2}`, `${r2}, ${r1}`, `${r1},${r2}`, `${r2},${r1}`),
    hints: hintLadder(
      'Factorise the left side into two brackets, then set each to zero.',
      `Two numbers multiplying to ${c} and adding to ${b}.`,
      `It factorises to (${fmtLinear(1, -r1)})(${fmtLinear(1, -r2)}) = 0.`,
    ),
    solution: {
      steps: [
        { text: 'Factorise.', expr: `(${fmtLinear(1, -r1)})(${fmtLinear(1, -r2)}) = 0` },
        { text: 'Set each bracket to zero.', expr: `x = ${r1}  or  x = ${r2}` },
      ],
      answer: ans,
    },
    misconceptions: [
      { when: `x = ${-r1} or x = ${-r2}`, feedback: 'Sign slip: if (x − r) = 0 then x = r, not −r.' },
    ],
    verify: { kind: 'roots', poly: (t) => t * t + b * t + c, roots: [r1, r2] },
  };
}

// ---- evaluate a function: given f(x), find f(k) ----
export function buildEvaluateFunction({ quadratic = true } = {}) {
  const a = quadratic ? nonzero(-3, 3) : 0;
  const b = nonzero(-6, 6), c = nonzero(-9, 9);
  const k = nonzero(-5, 5);
  const value = a * k * k + b * k + c;
  const fStr = fmtQuadratic(a, b, c);
  return {
    type: 'evaluate-function',
    instruction: 'Substitute and evaluate.',
    question: `Given f(x) = ${fStr.caret},   find f(${k}).`,
    answer: `${value}`,
    accepts: accepts(`${value}`, `f(${k})=${value}`),
    hints: hintLadder(
      `Replace every x with ${k}.`,
      'Work out powers first, then multiply, then add (BODMAS).',
      `Compute ${fStr.caret.replace(/x/g, `(${k})`)}.`,
    ),
    solution: {
      steps: [
        { text: `Substitute x = ${k}.`, expr: fStr.caret.replace(/x/g, `(${k})`) },
        { text: 'Evaluate.', expr: `${value}` },
      ],
      answer: `${value}`,
    },
    misconceptions: [],
    verify: { kind: 'numeric', f: (x) => a * x * x + b * x + c, at: k, value },
  };
}

// ---- differentiate a polynomial (power rule) ----
export function buildDifferentiate() {
  const allPowers = [1, 2, 3, 4];
  const n = randInt(2, 3);
  const chosen = [...allPowers].sort(() => Math.random() - 0.5).slice(0, n);
  const fTerms = chosen.map((p) => [nonzero(-6, 6), p]);
  if (coin()) fTerms.push([nonzero(-9, 9), 0]);   // a constant, to teach d/dx(const)=0
  const dTerms = fTerms.map(([c, p]) => [c * p, p - 1]).filter(([c, p]) => p >= 0 && c !== 0);
  const fStr = fmtPoly(fTerms), dStr = fmtPoly(dTerms);
  return {
    type: 'differentiate',
    instruction: 'Differentiate with respect to x.',
    question: `Differentiate:   y = ${fStr.caret}`,
    answer: dStr.caret,
    accepts: accepts(dStr.caret, dStr.uni, dStr.caret.replace(/\s/g, ''), dStr.uni.replace(/\s/g, '')),
    hints: hintLadder(
      'Power rule: bring the power down as a multiplier, then reduce the power by 1.',
      'd/dx(c·xⁿ) = n·c·xⁿ⁻¹.   The derivative of a constant is 0.',
      'Differentiate each term separately.',
    ),
    solution: {
      steps: [
        ...fTerms.filter(([c, p]) => p >= 1).map(([c, p]) => ({
          text: `Term ${fmtPoly([[c, p]]).caret}: multiply by ${p}, drop the power.`,
          expr: fmtPoly([[c * p, p - 1]]).caret,
        })),
        { text: 'Combine.', expr: dStr.caret },
      ],
      answer: dStr.caret,
    },
    misconceptions: [],
    verify: { kind: 'derivative', f: (x) => evalPoly(fTerms, x), df: (x) => evalPoly(dTerms, x) },
  };
}

// ---- integrate a polynomial (reverse power rule) ----
export function buildIntegrate() {
  const allPowers = [0, 1, 2, 3];
  const n = randInt(2, 3);
  const chosen = [...allPowers].sort(() => Math.random() - 0.5).slice(0, n);
  // Choose integral coefficients m, so the integrand coef m·(p+1) is an integer.
  const FTerms = chosen.map((p) => [nonzero(-5, 5), p + 1]);
  const integrand = FTerms.map(([m, P]) => [m * P, P - 1]);   // d/dx of F
  const inStr = fmtPoly(integrand), FStr = fmtPoly(FTerms);
  const ans = `${FStr.caret} + C`;
  return {
    type: 'integrate',
    instruction: 'Integrate with respect to x. Remember + C.',
    question: `Integrate:   ∫ (${inStr.caret}) dx`,
    answer: ans,
    accepts: accepts(ans, `${FStr.uni} + C`, `${FStr.caret}+C`, `${FStr.caret} + c`,
      FStr.caret, FStr.uni),   // also accept without +C (note it in feedback)
    hints: hintLadder(
      'Reverse the power rule: raise the power by 1, then divide by the new power.',
      '∫xⁿ dx = xⁿ⁺¹/(n+1) + C.',
      "Don't forget the constant of integration, + C.",
    ),
    solution: {
      steps: [
        ...integrand.map(([c, p]) => ({
          text: `Term ${fmtPoly([[c, p]]).caret}: raise power to ${p + 1}, divide by ${p + 1}.`,
          expr: fmtPoly([[c / (p + 1), p + 1]]).caret,
        })),
        { text: 'Add the constant of integration.', expr: ans },
      ],
      answer: ans,
    },
    misconceptions: [],
    verify: { kind: 'integral', integrand: (x) => evalPoly(integrand, x), F: (x) => evalPoly(FTerms, x) },
  };
}

// ---- definite integral of a polynomial: ∫_a^b f(x) dx ----
export function buildDefiniteIntegral() {
  const FTerms = [[nonzero(-3, 3), randInt(2, 3)], [nonzero(-4, 4), 1]];   // antiderivative (integer coefs)
  const integrand = FTerms.map(([c, p]) => [c * p, p - 1]);
  const a = randInt(-3, 1), b = a + randInt(2, 4);
  const value = evalPoly(FTerms, b) - evalPoly(FTerms, a);
  const inStr = fmtPoly(integrand), FStr = fmtPoly(FTerms);
  return {
    type: 'definite-integral',
    instruction: 'Evaluate the definite integral.',
    question: `Evaluate:   ∫ from ${a} to ${b} of (${inStr.caret}) dx`,
    answer: `${value}`,
    accepts: accepts(`${value}`),
    hints: hintLadder(
      'First integrate, then substitute the upper and lower limits and subtract.',
      `Antiderivative F(x) = ${FStr.caret}.`,
      `Compute F(${b}) − F(${a}).`,
    ),
    solution: {
      steps: [
        { text: 'Integrate (no + C needed for a definite integral).', expr: `[ ${FStr.caret} ]` },
        { text: `Substitute the limits and subtract: F(${b}) − F(${a}).`, expr: `${evalPoly(FTerms, b)} − (${evalPoly(FTerms, a)})` },
        { text: 'Evaluate.', expr: `${value}` },
      ],
      answer: `${value}`,
    },
    misconceptions: [],
    verify: { kind: 'definite', integrand: (x) => evalPoly(integrand, x), a, b, value },
  };
}

const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// ---- solve a quadratic with the quadratic formula (rational roots) ----
export function buildQuadraticFormula() {
  let r1, r2;
  do { r1 = nonzero(-6, 6); r2 = nonzero(-6, 6); } while (r1 === r2);
  if (r1 > r2) [r1, r2] = [r2, r1];
  const a = randInt(1, 3);
  const b = -a * (r1 + r2), c = a * r1 * r2;
  const disc = b * b - 4 * a * c;           // = a²(r1−r2)², a perfect square
  const sq = Math.round(Math.sqrt(disc));
  const quad = fmtPoly([[a, 2], [b, 1], [c, 0]]);
  const ans = `x = ${r1} or x = ${r2}`;
  return {
    type: 'quadratic-formula',
    instruction: 'Solve using the quadratic formula.',
    question: `Use the quadratic formula to solve:   ${quad.caret} = 0`,
    answer: ans,
    accepts: accepts(ans, `x=${r1} or x=${r2}`, `x=${r2} or x=${r1}`,
      `${r1}, ${r2}`, `${r2}, ${r1}`, `${r1},${r2}`, `${r2},${r1}`),
    hints: hintLadder(
      'x = (−b ± √(b²−4ac)) / (2a).',
      `Here a = ${a}, b = ${b}, c = ${c}.`,
      `b²−4ac = ${disc}, and √${disc} = ${sq}.`,
    ),
    solution: {
      steps: [
        { text: 'Identify the coefficients.', expr: `a = ${a},  b = ${b},  c = ${c}` },
        { text: 'Discriminant b²−4ac.', expr: `${disc}` },
        { text: `Apply x = (−b ± √${disc}) / (2·${a}).`, expr: `x = (${-b} ± ${sq}) / ${2 * a}` },
        { text: 'Two solutions.', expr: `x = ${r1}  or  x = ${r2}` },
      ],
      answer: ans,
    },
    misconceptions: [
      { when: `x = ${-r1} or x = ${-r2}`, feedback: 'Check the −b and the ± in the formula — watch the signs.' },
    ],
    verify: { kind: 'roots', poly: (t) => a * t * t + b * t + c, roots: [r1, r2] },
  };
}

// ---- complete the square: x² + bx + c -> (x + h)² + k ----
export function buildCompleteSquare() {
  const h = nonzero(-5, 5), b = 2 * h, k = nonzero(-9, 9), c = h * h + k;
  const quad = fmtPoly([[1, 2], [b, 1], [c, 0]]);
  const inner = fmtLinear(1, h);
  const ansCaret = `(${inner})^2${fmtTerm(k, '')}`;
  const ansUni = `(${inner})²${fmtTerm(k, '')}`;
  return {
    type: 'complete-square',
    instruction: 'Write in completed-square form (x + a)² + b.',
    question: `Complete the square:   ${quad.caret}`,
    answer: ansCaret,
    accepts: accepts(ansCaret, ansUni, ansCaret.replace(/\s/g, ''), ansUni.replace(/\s/g, '')),
    hints: hintLadder(
      'Halve the coefficient of x — that number goes inside the bracket.',
      `Half of ${b} is ${h}, so begin with (${inner})².`,
      `(${inner})² carries an extra ${h * h}; adjust the constant to compensate.`,
    ),
    solution: {
      steps: [
        { text: `Half the x-coefficient: ${b} ÷ 2 = ${h}.`, expr: `(${inner})²` },
        { text: `(${inner})² = ${fmtPoly([[1, 2], [b, 1], [h * h, 0]]).caret}, which is ${h * h} too big — subtract it.`, expr: ansCaret },
      ],
      answer: ansCaret,
    },
    misconceptions: [
      { when: `(${inner})^2${fmtTerm(c, '')}`, feedback: `(x ${h >= 0 ? '+' : '−'} ${Math.abs(h)})² already adds ${h * h}; take that off the constant.` },
    ],
    verify: { kind: 'identity', original: (t) => t * t + b * t + c, answerExpr: (t) => (t + h) * (t + h) + k },
  };
}

// ---- arithmetic sequence: find the nth term ----
export function buildArithmeticSequence() {
  const a1 = nonzero(-9, 9), d = nonzero(-6, 6), n = randInt(6, 14);
  const Un = a1 + (n - 1) * d;
  const terms = [0, 1, 2, 3].map((i) => a1 + i * d).join(', ');
  return {
    type: 'arithmetic-sequence',
    instruction: 'Find the requested term.',
    question: `Sequence:  ${terms}, …   Find the ${ordinal(n)} term.`,
    answer: `${Un}`,
    accepts: accepts(`${Un}`),
    hints: hintLadder(
      'Find the common difference d = (any term) − (the one before).',
      `Use Uₙ = a + (n−1)d, with a = ${a1}.`,
      `d = ${d}, n = ${n}.`,
    ),
    solution: {
      steps: [
        { text: 'Common difference.', expr: `d = ${d}` },
        { text: `Apply Uₙ = a + (n−1)d.`, expr: `${a1} + (${n}−1)(${d})` },
        { text: 'Evaluate.', expr: `${Un}` },
      ],
      answer: `${Un}`,
    },
    misconceptions: [
      { when: `${a1 + n * d}`, feedback: 'Use (n−1), not n — the first term is already term 1.' },
    ],
    // Verify by independent iteration (not the same closed form).
    verify: { kind: 'numeric', f: () => { let t = a1; for (let i = 1; i < n; i++) t += d; return t; }, at: 0, value: Un },
  };
}

// ---- geometric sequence: find the nth term ----
export function buildGeometricSequence() {
  const a1 = nonzero(-4, 4), r = pick([2, 3, -2, -3]), n = randInt(3, 5);
  const Un = a1 * Math.pow(r, n - 1);
  const terms = [0, 1, 2].map((i) => a1 * Math.pow(r, i)).join(', ');
  return {
    type: 'geometric-sequence',
    instruction: 'Find the requested term.',
    question: `Geometric sequence:  ${terms}, …   Find the ${ordinal(n)} term.`,
    answer: `${Un}`,
    accepts: accepts(`${Un}`),
    hints: hintLadder(
      'Find the common ratio r = (any term) ÷ (the one before).',
      `Use Uₙ = a·rⁿ⁻¹, with a = ${a1}.`,
      `r = ${r}, n = ${n}.`,
    ),
    solution: {
      steps: [
        { text: 'Common ratio.', expr: `r = ${r}` },
        { text: `Apply Uₙ = a·rⁿ⁻¹.`, expr: `${a1}·(${r})^${n - 1}` },
        { text: 'Evaluate.', expr: `${Un}` },
      ],
      answer: `${Un}`,
    },
    misconceptions: [
      { when: `${a1 * Math.pow(r, n)}`, feedback: 'The exponent is (n−1), not n.' },
    ],
    verify: { kind: 'numeric', f: () => { let t = a1; for (let i = 1; i < n; i++) t *= r; return t; }, at: 0, value: Un },
  };
}

// ---- arithmetic series: sum of the first n terms ----
export function buildArithmeticSeries() {
  const a1 = nonzero(-6, 6), d = nonzero(-5, 5), n = randInt(5, 10);
  let Sn = 0; for (let i = 0; i < n; i++) Sn += a1 + i * d;
  return {
    type: 'arithmetic-series',
    instruction: 'Find the sum of the first n terms.',
    question: `For the sequence ${[0, 1, 2].map((i) => a1 + i * d).join(', ')}, …   find the sum of the first ${n} terms.`,
    answer: `${Sn}`,
    accepts: accepts(`${Sn}`),
    hints: hintLadder(
      'Use Sₙ = n/2 · (2a + (n−1)d).',
      `a = ${a1}, d = ${d}, n = ${n}.`,
      `Sₙ = ${n}/2 · (2·${a1} + (${n}−1)(${d})).`,
    ),
    solution: {
      steps: [
        { text: 'Identify a, d, n.', expr: `a = ${a1}, d = ${d}, n = ${n}` },
        { text: 'Apply Sₙ = n/2 (2a + (n−1)d).', expr: `${n}/2 · (${2 * a1} + ${(n - 1) * d})` },
        { text: 'Evaluate.', expr: `${Sn}` },
      ],
      answer: `${Sn}`,
    },
    misconceptions: [],
    verify: { kind: 'numeric', f: () => { let s = 0; for (let i = 0; i < n; i++) s += a1 + i * d; return s; }, at: 0, value: Sn },
  };
}

// ---- stationary point of a quadratic: where f'(x) = 0 ----
export function buildStationaryPoints() {
  const x0 = nonzero(-5, 5), a = nonzero(-3, 3), b = -2 * a * x0, c = nonzero(-9, 9);
  const y0 = a * x0 * x0 + b * x0 + c;
  const quad = fmtPoly([[a, 2], [b, 1], [c, 0]]);
  const nature = a > 0 ? 'minimum' : 'maximum';
  const ans = `(${x0}, ${y0})`;
  return {
    type: 'stationary-point',
    instruction: 'Find the coordinates of the stationary point.',
    question: `Find the stationary point of   y = ${quad.caret}.`,
    answer: ans,
    accepts: accepts(ans, `(${x0},${y0})`, `x=${x0}, y=${y0}`, `x=${x0},y=${y0}`),
    hints: hintLadder(
      'A stationary point is where the gradient dy/dx = 0.',
      `Differentiate: dy/dx = ${fmtPoly([[2 * a, 1], [b, 0]]).caret}. Set it to 0.`,
      `Solve for x, then substitute back to get y.`,
    ),
    solution: {
      steps: [
        { text: 'Differentiate.', expr: `dy/dx = ${fmtPoly([[2 * a, 1], [b, 0]]).caret}` },
        { text: 'Set dy/dx = 0 and solve.', expr: `x = ${x0}` },
        { text: 'Substitute back for y.', expr: `y = ${y0}` },
        { text: `Since a ${a > 0 ? '> 0' : '< 0'}, it is a ${nature}.`, expr: `${ans}  (${nature})` },
      ],
      answer: ans,
    },
    misconceptions: [
      { when: `(${x0}, ${a * x0 * x0})`, feedback: 'Substitute x back into the FULL expression, including bx and c.' },
    ],
    verify: { kind: 'stationary', f: (t) => a * t * t + b * t + c, x0 },
  };
}

// A convenient registry so skills can reference builders by name + tier.
export const BUILDERS = {
  'linear-equation': buildLinearEquation,
  'simplify': buildSimplify,
  'expand-distribute': buildDistribute,
  'expand-binomial': buildBinomial,
  'factorize-common': buildFactorizeCommon,
  'factorize-quadratic': buildFactorizeQuadratic,
  'solve-quadratic': buildSolveQuadratic,
  'evaluate-function': buildEvaluateFunction,
  'differentiate': buildDifferentiate,
  'integrate': buildIntegrate,
  'definite-integral': buildDefiniteIntegral,
  'quadratic-formula': buildQuadraticFormula,
  'complete-square': buildCompleteSquare,
  'arithmetic-sequence': buildArithmeticSequence,
  'geometric-sequence': buildGeometricSequence,
  'arithmetic-series': buildArithmeticSeries,
  'stationary-point': buildStationaryPoints,
};
