// ============================================================================
// ADVANCED CALCULUS CONTENT — powered by the symbolic layer.
//
// These are the skills that defeat the numeric-parameter pattern because the
// natural answer is a whole expression with many equivalent forms. We sidestep
// the matching problem by asking for a NUMBER (a derivative at a point, or a
// definite integral) — a legitimate exam format — while the symbolic engine
// guarantees the problem and worked solution are correct, and the quality gate
// verifies every generated answer numerically.
// ============================================================================

import {
  fmtLinear, fmtQuadratic, accepts, hintLadder, nonzero, randInt, pick, coin,
  withWorkedExample,
} from './schema.js';
import { num, VAR, mul, pow, fn, linear, quad, evaluate, differentiate } from './symbolic.js';

// ---- product rule: f = (x+p)(x²+qx+r), find f'(at) ----
export function buildProductRule() {
  const p = nonzero(-5, 5), q = nonzero(-5, 5), r = nonzero(-6, 6);
  const u = linear(1, p), v = quad(1, q, r), f = mul(u, v);
  const at = nonzero(-3, 3);
  const value = evaluate(differentiate(f), at);
  const uStr = `(${fmtLinear(1, p)})`, vStr = `(${fmtQuadratic(1, q, r).caret})`, vD = fmtLinear(2, q);
  return {
    type: 'product-rule',
    instruction: 'Differentiate with the product rule, then evaluate.',
    question: `f(x) = ${uStr}${vStr}.   Using the product rule, find f'(${at}).`,
    answer: `${value}`,
    accepts: accepts(`${value}`),
    hints: hintLadder(
      "Product rule: (uv)' = u'v + uv'.",
      `u = ${uStr} ⇒ u' = 1;   v = ${vStr} ⇒ v' = ${vD}.`,
      `Differentiate first, then substitute x = ${at}.`,
    ),
    solution: {
      steps: [
        { text: "Apply (uv)' = u'v + uv'.", expr: `(1)${vStr} + ${uStr}(${vD})` },
        { text: `Substitute x = ${at}.`, expr: `${value}` },
      ],
      answer: `${value}`,
    },
    misconceptions: [
      { when: `${evaluate(mul(differentiate(u), differentiate(v)), at)}`, feedback: "Don't multiply the derivatives — use u'v + uv'." },
    ],
    verify: { kind: 'derivative-at', f: (x) => evaluate(f, x), at, value },
  };
}

// ---- quotient rule: f = (x²+qx+r)/(x+b), find f'(at) where v(at)=1 ----
export function buildQuotientRule() {
  const q = nonzero(-4, 4), r = nonzero(-6, 6), b = nonzero(-4, 4);
  const u = quad(1, q, r), v = linear(1, b), f = mul(u, pow(v, -1));
  const at = 1 - b;                              // v(at) = 1 → clean integer answer
  const value = evaluate(differentiate(f), at);
  const uStr = `(${fmtQuadratic(1, q, r).caret})`, vStr = `(${fmtLinear(1, b)})`, uD = fmtLinear(2, q);
  return {
    type: 'quotient-rule',
    instruction: 'Differentiate with the quotient rule, then evaluate.',
    question: `f(x) = ${uStr} / ${vStr}.   Using the quotient rule, find f'(${at}).`,
    answer: `${value}`,
    accepts: accepts(`${value}`),
    hints: hintLadder(
      "Quotient rule: (u/v)' = (u'v − uv') / v².",
      `u = ${uStr} ⇒ u' = ${uD};   v = ${vStr} ⇒ v' = 1.`,
      `At x = ${at} the denominator is 1, keeping the arithmetic clean.`,
    ),
    solution: {
      steps: [
        { text: "Apply (u/v)' = (u'v − uv') / v².", expr: `[ (${uD})${vStr} − ${uStr}(1) ] / ${vStr}²` },
        { text: `Substitute x = ${at} (so v = 1).`, expr: `${value}` },
      ],
      answer: `${value}`,
    },
    misconceptions: [],
    verify: { kind: 'derivative-at', f: (x) => evaluate(f, x), at, value },
  };
}

// ---- chain rule: f = (ax+b)ⁿ, find f'(at) ----
export function buildChainRule() {
  const a = nonzero(2, 4) * (coin() ? 1 : -1), b = nonzero(-4, 4), n = randInt(2, 4);
  const f = pow(linear(a, b), n);
  const at = randInt(-2, 2);
  const value = evaluate(differentiate(f), at);
  const inner = `(${fmtLinear(a, b)})`;
  return {
    type: 'chain-rule',
    instruction: 'Differentiate with the chain rule, then evaluate.',
    question: `f(x) = ${inner}^${n}.   Using the chain rule, find f'(${at}).`,
    answer: `${value}`,
    accepts: accepts(`${value}`),
    hints: hintLadder(
      'Chain rule: bring the power down, reduce it by 1, then × the derivative of the inside.',
      `f'(x) = ${n}·${inner}^${n - 1}·(${a}).`,
      `Substitute x = ${at}.`,
    ),
    solution: {
      steps: [
        { text: `Differentiate the outer power, then × the inner derivative (${a}).`, expr: `${n}(${a})${inner}^${n - 1}` },
        { text: `Substitute x = ${at}.`, expr: `${value}` },
      ],
      answer: `${value}`,
    },
    misconceptions: [
      { when: `${n * Math.pow(a * at + b, n - 1)}`, feedback: 'You forgot to multiply by the derivative of the inside (the chain).' },
    ],
    verify: { kind: 'derivative-at', f: (x) => evaluate(f, x), at, value },
  };
}

// ---- further differentiation (trig / exp): find f'(0) ----
export function buildFurtherDiff() {
  const A = randInt(1, 3), k = nonzero(2, 5), kind = pick(['sin', 'exp']);
  const f = mul(num(A), fn(kind, mul(num(k), VAR)));
  const value = evaluate(differentiate(f), 0);   // A·k for both sin and exp at 0
  const amp = A === 1 ? '' : `${A}`;
  const fStr = kind === 'sin' ? `${amp}sin(${k}x)` : `${amp}e^(${k}x)`;
  const dStr = kind === 'sin' ? `${A * k}cos(${k}x)` : `${A * k}e^(${k}x)`;
  return {
    type: 'further-diff',
    instruction: 'Differentiate, then evaluate at x = 0.',
    question: `f(x) = ${fStr}.   Find f'(0).`,
    answer: `${value}`,
    accepts: accepts(`${value}`),
    hints: hintLadder(
      kind === 'sin' ? 'd/dx sin(kx) = k·cos(kx).' : 'd/dx e^(kx) = k·e^(kx).',
      'Use the chain rule on the inner kx; keep the constant multiplier.',
      kind === 'sin' ? 'cos(0) = 1.' : 'e⁰ = 1.',
    ),
    solution: {
      steps: [
        { text: 'Differentiate (chain rule on the inner kx).', expr: dStr },
        { text: 'Substitute x = 0.', expr: `${value}` },
      ],
      answer: `${value}`,
    },
    misconceptions: [],
    verify: { kind: 'derivative-at', f: (x) => evaluate(f, x), at: 0, value },
  };
}

// ---- integration by substitution: ∫ 2k·x·(x²+c)^(k-1) dx, definite ----
export function buildIntegrationSubstitution() {
  const k = randInt(2, 3), c = nonzero(-3, 5);
  const lo = randInt(-2, 1), hi = lo + randInt(1, 3);
  const F = pow(quad(1, 0, c), k);               // antiderivative (x²+c)^k
  const integrand = differentiate(F);            // 2k·x·(x²+c)^(k-1)
  const value = evaluate(F, hi) - evaluate(F, lo);
  const innerStr = fmtQuadratic(1, 0, c).caret;  // x² + c
  const powStr = (k - 1) === 1 ? `(${innerStr})` : `(${innerStr})^${k - 1}`;
  const inStr = `${2 * k}x${powStr}`;
  return {
    type: 'integration-substitution',
    instruction: 'Evaluate the definite integral using substitution.',
    question: `Evaluate:   ∫ from ${lo} to ${hi} of ${inStr} dx`,
    answer: `${value}`,
    accepts: accepts(`${value}`),
    hints: hintLadder(
      `Let u = ${innerStr}. Then du = 2x dx.`,
      `The 2x in the integrand becomes du; integrate the power of u.`,
      `Antiderivative is (${innerStr})^${k}; evaluate from ${lo} to ${hi}.`,
    ),
    solution: {
      steps: [
        { text: `Substitute u = ${innerStr}, du = 2x dx.`, expr: `∫ u-power du` },
        { text: 'Integrate and back-substitute.', expr: `[ (${innerStr})^${k} ]` },
        { text: `Evaluate from ${lo} to ${hi}.`, expr: `${evaluate(F, hi)} − (${evaluate(F, lo)}) = ${value}` },
      ],
      answer: `${value}`,
    },
    misconceptions: [],
    verify: { kind: 'definite', integrand: (x) => evaluate(integrand, x), a: lo, b: hi, value },
  };
}

// ---- integration by parts: ∫₀¹ k·x·eˣ dx = k ----
export function buildIntegrationByParts() {
  const k = randInt(2, 12);
  const value = k;   // ∫₀¹ x eˣ dx = [(x−1)eˣ]₀¹ = 0 − (−1) = 1, scaled by k
  return {
    type: 'integration-by-parts',
    instruction: 'Evaluate the definite integral using integration by parts.',
    question: `Evaluate:   ∫ from 0 to 1 of ${k}x·eˣ dx`,
    answer: `${value}`,
    accepts: accepts(`${value}`),
    hints: hintLadder(
      'By parts: ∫ u dv = uv − ∫ v du.   Let u = x, dv = eˣ dx.',
      'Then du = dx, v = eˣ, so ∫ x eˣ dx = x eˣ − ∫ eˣ dx = (x − 1)eˣ.',
      `Multiply by ${k} and evaluate (x − 1)eˣ from 0 to 1.`,
    ),
    solution: {
      steps: [
        { text: 'Let u = x, dv = eˣ dx ⇒ du = dx, v = eˣ.', expr: '∫ x eˣ dx = x eˣ − ∫ eˣ dx' },
        { text: 'Integrate.', expr: `${k}(x − 1)eˣ` },
        { text: 'Evaluate from 0 to 1:  k·(0 − (−1)).', expr: `${value}` },
      ],
      answer: `${value}`,
    },
    misconceptions: [],
    verify: { kind: 'definite', integrand: (x) => k * x * Math.exp(x), a: 0, b: 1, value },
  };
}

export const CALCULUS_CONTENT = {
  G11_DIFF_PRODUCT_QUOTIENT: withWorkedExample(() => (coin() ? buildProductRule() : buildQuotientRule())),
  G11_DIFF_CHAIN_RULE:        withWorkedExample(buildChainRule),
  G12_FURTHER_DIFF:           withWorkedExample(buildFurtherDiff),
  G12_INTEGRATION_SUBSTITUTION: withWorkedExample(buildIntegrationSubstitution),
  G12_INTEGRATION_BY_PARTS:     withWorkedExample(buildIntegrationByParts),
};

export const CALCULUS_SKILL_IDS = Object.keys(CALCULUS_CONTENT);
