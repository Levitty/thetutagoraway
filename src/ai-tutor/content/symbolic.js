// ============================================================================
// SYMBOLIC LAYER — a tiny computer-algebra core for the hard calculus skills.
//
// Expressions are trees. We need only two operations to power (and verify) the
// advanced content:
//   evaluate(expr, x)     — numeric value, used to compute answers and to let
//                           the quality gate verify them by finite differences.
//   differentiate(expr)   — exact symbolic derivative (sum/product/quotient/
//                           chain rules), used to GENERATE problems: take the
//                           derivative of a product for "product rule", or take
//                           the derivative of an antiderivative F to manufacture
//                           an integrand for "integrate" problems.
//
// Functions are limited to sin, cos, exp (plus polynomials), so numeric checks
// are well-defined everywhere (no log domain issues).
// ============================================================================

// ---- constructors ----
export const num = (k) => ({ t: 'num', k });
export const VAR = { t: 'var' };
export const add = (...xs) => ({ t: 'add', xs: xs.flatMap((e) => (e.t === 'add' ? e.xs : [e])) });
export const mul = (...xs) => ({ t: 'mul', xs: xs.flatMap((e) => (e.t === 'mul' ? e.xs : [e])) });
export const pow = (a, n) => ({ t: 'pow', a, n });          // n: numeric exponent
export const fn = (name, a) => ({ t: 'fn', name, a });      // 'sin' | 'cos' | 'exp'

// Convenience: a·x + b  and  a·x² + b·x + c as trees
export const linear = (a, b) => add(mul(num(a), VAR), num(b));
export const quad = (a, b, c) => add(mul(num(a), pow(VAR, 2)), mul(num(b), VAR), num(c));

// ---- numeric evaluation ----
export function evaluate(e, x) {
  switch (e.t) {
    case 'num': return e.k;
    case 'var': return x;
    case 'add': return e.xs.reduce((s, t) => s + evaluate(t, x), 0);
    case 'mul': return e.xs.reduce((p, t) => p * evaluate(t, x), 1);
    case 'pow': return Math.pow(evaluate(e.a, x), e.n);
    case 'fn': {
      const v = evaluate(e.a, x);
      if (e.name === 'sin') return Math.sin(v);
      if (e.name === 'cos') return Math.cos(v);
      if (e.name === 'exp') return Math.exp(v);
      return NaN;
    }
    default: return NaN;
  }
}

// ---- exact symbolic differentiation ----
export function differentiate(e) {
  switch (e.t) {
    case 'num': return num(0);
    case 'var': return num(1);
    case 'add': return add(...e.xs.map(differentiate));
    case 'mul': {
      // Product rule over a list: d(f₁…fₙ) = Σᵢ f₁…fᵢ′…fₙ
      return add(...e.xs.map((_, i) =>
        mul(...e.xs.map((f, j) => (j === i ? differentiate(f) : f)))));
    }
    case 'pow': {
      // d(aⁿ) = n·aⁿ⁻¹·a′   (n constant; covers negative n for quotients)
      return mul(num(e.n), pow(e.a, e.n - 1), differentiate(e.a));
    }
    case 'fn': {
      const u = e.a, du = differentiate(u);
      if (e.name === 'sin') return mul(fn('cos', u), du);
      if (e.name === 'cos') return mul(num(-1), fn('sin', u), du);
      if (e.name === 'exp') return mul(fn('exp', u), du);
      return num(0);
    }
    default: return num(0);
  }
}

// Numeric helpers used by builders/gate.
export const dAt = (e, x) => evaluate(differentiate(e), x);
