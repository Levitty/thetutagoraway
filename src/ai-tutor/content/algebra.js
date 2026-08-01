// ============================================================================
// ALGEBRA CONTENT — the strand vertical, authored to the full pedagogical bar.
//
// Each skill is a thin composition of builders (schema.js) across difficulty
// tiers. `withWorkedExample` attaches a SEPARATE solved instance as the worked
// example — the student studies one fully-worked problem, then practises a
// different one (the correct application of the worked-example effect).
//
// Coverage here is the foundational algebra core: collecting terms, expanding,
// factorising, and solving linear equations through to variables-both-sides.
// These are the load-bearing skills every later algebra/calculus skill needs.
// ============================================================================

import {
  buildLinearEquation, buildSimplify, buildDistribute, buildBinomial,
  buildFactorizeCommon, buildFactorizeQuadratic, buildSolveQuadratic,
  buildEvaluateFunction, buildDifferentiate, buildIntegrate, buildDefiniteIntegral,
  buildQuadraticFormula, buildCompleteSquare, buildArithmeticSequence,
  buildGeometricSequence, buildArithmeticSeries, buildStationaryPoints,
  withWorkedExample, withKPs, coin, accepts, hintLadder, randInt, nonzero, pick, fmtLinear,
} from './schema.js';

// ============================================================================
// CAMBRIDGE GAP FILL — inequalities and the Stage-8 straight-line spine.
// ============================================================================

// ---- G7: one-step inequalities ----
export function buildInequalityIntro() {
  const v = nonzero(-9, 9);
  const b = nonzero(-9, 9);
  const sym = pick(['<', '>', '≤', '≥']);
  const c = v + b;
  const answer = `x ${sym} ${v}`;
  const flipped = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' }[sym];
  return {
    type: 'inequality-intro', instruction: 'Solve like an equation — the sign stays put.',
    question: `Solve:   x ${b >= 0 ? '+' : '−'} ${Math.abs(b)} ${sym} ${c}`,
    answer,
    accepts: accepts(answer, `x${sym}${v}`, `${v} ${flipped} x`, sym === '≤' ? `x <= ${v}` : sym === '≥' ? `x >= ${v}` : null),
    hints: hintLadder('Treat it like an equation: undo the +/− on both sides.',
      `${b >= 0 ? 'Subtract' : 'Add'} ${Math.abs(b)} on both sides.`,
      'Adding or subtracting never flips the inequality sign.'),
    solution: { steps: [
      { text: `${b >= 0 ? 'Subtract' : 'Add'} ${Math.abs(b)} on both sides.`, expr: `x ${sym} ${c} ${b >= 0 ? '−' : '+'} ${Math.abs(b)}` },
      { text: 'The sign is unchanged — we only added/subtracted.', expr: answer }], answer },
    misconceptions: [{ when: `x ${flipped} ${v}`, feedback: 'The sign only flips when you multiply or divide by a NEGATIVE — adding and subtracting leave it alone.' }],
    verify: { kind: 'exact', value: answer },
  };
}

// ---- G8: two-step inequalities, including the negative-divide flip ----
export function buildInequalitySolve() {
  const v = nonzero(-6, 6);
  const sym = pick(['<', '>', '≤', '≥']);
  const flipped = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' }[sym];
  if (coin()) {
    const a = randInt(2, 6), b = nonzero(-9, 9);
    const c = a * v + b;
    const answer = `x ${sym} ${v}`;
    return {
      type: 'inequality-two-step', instruction: 'Solve it.',
      question: `Solve:   ${a}x ${b >= 0 ? '+' : '−'} ${Math.abs(b)} ${sym} ${c}`,
      answer,
      accepts: accepts(answer, `x${sym}${v}`, `${v} ${flipped} x`, sym === '≤' ? `x <= ${v}` : sym === '≥' ? `x >= ${v}` : null),
      hints: hintLadder('Undo the +/− first, then the ×.',
        `${b >= 0 ? 'Subtract' : 'Add'} ${Math.abs(b)}, then divide by ${a}.`,
        `Dividing by POSITIVE ${a} keeps the sign as it is.`),
      solution: { steps: [
        { text: `${b >= 0 ? 'Subtract' : 'Add'} ${Math.abs(b)} on both sides.`, expr: `${a}x ${sym} ${c - b}` },
        { text: `Divide by ${a} (positive — sign unchanged).`, expr: answer }], answer },
      misconceptions: [{ when: `x ${flipped} ${v}`, feedback: `You flipped the sign — but we divided by POSITIVE ${a}. The flip only happens for negative multipliers.` }],
      verify: { kind: 'exact', value: answer },
    };
  }
  // THE classic: divide by a negative — the sign MUST flip.
  const a = randInt(2, 5);
  const c = -a * v;
  const answer = `x ${flipped} ${v}`;
  const unflipped = `x ${sym} ${v}`;
  return {
    type: 'inequality-flip', instruction: 'Careful — watch the sign.',
    question: `Solve:   −${a}x ${sym} ${c}`,
    answer,
    accepts: accepts(answer, `x${flipped}${v}`, `${v} ${sym} x`, flipped === '≤' ? `x <= ${v}` : flipped === '≥' ? `x >= ${v}` : null),
    hints: hintLadder('You will need to divide by a NEGATIVE number.',
      `Divide both sides by −${a}.`,
      'Dividing by a negative REVERSES the inequality — check with a number: −2 < 6, but divide by −2: 1 vs −3.'),
    solution: { steps: [
      { text: `Divide both sides by −${a}.`, expr: `x ? ${v}` },
      { text: 'Dividing by a negative flips the sign.', expr: answer }], answer },
    misconceptions: [{ when: unflipped, feedback: `The one rule of inequalities: dividing by a NEGATIVE flips the sign. −${a} is negative, so ${sym} becomes ${flipped}.` }],
    verify: { kind: 'exact', value: answer },
  };
}

// ---- G8: reading y = mx + c ----
export function buildLinearGraphRead() {
  const m = nonzero(-4, 4), c = nonzero(-8, 8);
  const eq = `y = ${fmtLinear(m, c)}`;
  const kind = pick(['evaluate', 'intercept', 'evaluate']);
  if (kind === 'intercept') {
    return {
      type: 'linear-intercept', instruction: 'Read it straight off the equation.',
      question: `The line ${eq} crosses the y-axis at what y-value?`,
      answer: `${c}`, accepts: accepts(`${c}`, `(0,${c})`, `(0, ${c})`),
      hints: hintLadder('On the y-axis, x = 0.',
        `Substitute x = 0 into ${eq}.`,
        'In y = mx + c, the constant c IS the y-intercept.'),
      solution: { steps: [
        { text: 'Set x = 0 (that is what the y-axis means).', expr: `y = ${m}(0) ${c >= 0 ? '+' : '−'} ${Math.abs(c)}` },
        { text: 'Read it off.', expr: `y = ${c}` }], answer: `${c}` },
      misconceptions: [{ when: `${m}`, feedback: `${m} is the GRADIENT (the slope). The y-intercept is the constant term, ${c}.` }],
      verify: { kind: 'fraction', value: c },
    };
  }
  const x = nonzero(-5, 5);
  const value = m * x + c;
  return {
    type: 'linear-evaluate', instruction: 'Substitute and evaluate.',
    question: `A line has equation ${eq}. Find y when x = ${x}.`,
    answer: `${value}`, accepts: accepts(`${value}`, `(${x},${value})`),
    hints: hintLadder('Substitute the x-value into the equation.',
      `y = ${m}(${x}) ${c >= 0 ? '+' : '−'} ${Math.abs(c)}.`,
      `${m} × ${x} = ${m * x} first, then the constant.`),
    solution: { steps: [
      { text: `Substitute x = ${x}.`, expr: `y = ${m}(${x}) ${c >= 0 ? '+' : '−'} ${Math.abs(c)}` },
      { text: 'Evaluate.', expr: `y = ${m * x} ${c >= 0 ? '+' : '−'} ${Math.abs(c)} = ${value}` }], answer: `${value}` },
    misconceptions: [{ when: `${m + x + c}`, feedback: 'mx means m TIMES x — multiply before adding the constant.' }],
    verify: { kind: 'fraction', value },
  };
}

// ---- G8: gradient from two points ----
export function buildGradient() {
  const m = nonzero(-4, 4);
  const x1 = randInt(-5, 3);
  const dx = randInt(2, 5);   // run of 1 would make the final hint "rise ÷ 1" — the answer
  const x2 = x1 + dx;
  const y1 = randInt(-6, 6);
  const y2 = y1 + m * dx;
  const value = m;
  const inverted = dx % (m * dx) === 0 ? dx / (m * dx) : null;
  return {
    type: 'gradient', instruction: 'Rise over run.',
    question: `Find the gradient of the line through (${x1}, ${y1}) and (${x2}, ${y2}).`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('Gradient = rise ÷ run = (change in y) ÷ (change in x).',
      `Rise: ${y2} − (${y1}) = ${y2 - y1}.  Run: ${x2} − (${x1}) = ${dx}.`,
      `${y2 - y1} ÷ ${dx}.`),
    solution: { steps: [
      { text: 'Change in y (rise).', expr: `${y2} − (${y1}) = ${y2 - y1}` },
      { text: 'Change in x (run).', expr: `${x2} − (${x1}) = ${dx}` },
      { text: 'Divide rise by run.', expr: `${y2 - y1}/${dx} = ${value}` }], answer: `${value}` },
    misconceptions: [
      { when: `${-m}`, feedback: 'Sign slip — subtract the coordinates in the SAME order on top and bottom.' },
      ...(inverted != null && inverted !== value ? [{ when: `${inverted}`, feedback: 'Upside down — the change in y goes on TOP (rise over run).' }] : []),
    ],
    verify: { kind: 'fraction', value },
  };
}

// ---- G8: equation of a straight line ----
export function buildEquationOfLine() {
  const m = nonzero(-4, 4), c = nonzero(-8, 8);
  const answer = `y = ${fmtLinear(m, c)}`;
  const swapped = `y = ${fmtLinear(c, m)}`;
  if (coin()) {
    return {
      type: 'equation-of-line', instruction: 'Build y = mx + c.',
      question: `A line has gradient ${m} and crosses the y-axis at (0, ${c}). Write its equation.`,
      answer,
      accepts: accepts(answer, answer.replace(/\s/g, '')),
      hints: hintLadder('Straight lines are y = mx + c.',
        `m is the gradient (${m}); c is the y-intercept (${c}).`,
        'Slot them straight in.'),
      solution: { steps: [
        { text: 'm = gradient, c = y-intercept.', expr: `m = ${m}, c = ${c}` },
        { text: 'Write the equation.', expr: answer }], answer },
      misconceptions: swapped !== answer ? [{ when: swapped, feedback: 'm and c are swapped — the GRADIENT multiplies x; the intercept stands alone.' }] : [],
      verify: { kind: 'exact', value: answer },
    };
  }
  const x1 = randInt(-4, 2), dx = randInt(1, 4);
  const x2 = x1 + dx;
  const y1 = m * x1 + c, y2 = m * x2 + c;
  return {
    type: 'equation-from-points', instruction: 'Gradient first, then the intercept.',
    question: `Find the equation of the line through (${x1}, ${y1}) and (${x2}, ${y2}).`,
    answer,
    accepts: accepts(answer, answer.replace(/\s/g, '')),
    hints: hintLadder('Find the gradient first: rise over run.',
      `m = (${y2} − (${y1})) ÷ (${x2} − (${x1})) = ${m}.`,
      `Then substitute one point into y = ${m}x + c to find c.`),
    solution: { steps: [
      { text: 'Gradient from the two points.', expr: `m = ${y2 - y1}/${dx} = ${m}` },
      { text: `Substitute (${x1}, ${y1}) to find c.`, expr: `${y1} = ${m}(${x1}) + c  →  c = ${c}` },
      { text: 'Write the equation.', expr: answer }], answer },
    misconceptions: [],
    verify: { kind: 'exact', value: answer },
  };
}

export const ALGEBRA_CONTENT = {
  // Cambridge gap fill — inequalities + the Stage-8 straight-line spine
  G7_INEQUALITIES_INTRO: withWorkedExample(buildInequalityIntro),
  G8_INEQUALITIES:      withWorkedExample(buildInequalitySolve),
  G8_LINEAR_GRAPHS:     withWorkedExample(buildLinearGraphRead),
  G8_GRADIENT:          withWorkedExample(buildGradient),
  G8_EQUATION_OF_LINE:  withWorkedExample(buildEquationOfLine),
  // Forming & collecting
  G7_EXPRESSIONS:      withWorkedExample(() => buildSimplify({ tier: 1 })),
  G7_SIMPLIFY:         withWorkedExample(() => buildSimplify({ tier: 2 })),

  // Expanding & factorising
  G8_EXPAND_BRACKETS:  withWorkedExample(buildDistribute),
  G9_QUADRATIC_EXPAND: withWorkedExample(buildBinomial),
  G8_FACTORIZE_COMMON: withWorkedExample(buildFactorizeCommon),

  // Solving linear equations — increasing difficulty up the spine
  G6_SIMPLE_EQUATIONS: withWorkedExample(() => buildLinearEquation({ tier: 1 })),
  G7_EQUATIONS_FORM:   withWorkedExample(() => buildLinearEquation({ tier: 2 })),
  // Taught as ordered knowledge points (one tiny step at a time):
  //   KP1 one-step → KP2 two-step → KP3 variables on both sides.
  G7_EQUATIONS_SOLVE:  withKPs([
                          withWorkedExample(() => buildLinearEquation({ tier: 1 })),
                          withWorkedExample(() => buildLinearEquation({ tier: 2 })),
                          withWorkedExample(() => buildLinearEquation({ tier: 3 })),
                        ]),
  G8_LINEAR_EQ_ADV:    withWorkedExample(() => buildLinearEquation({ tier: 3 })),

  // Quadratics & functions (G9)
  G9_QUADRATIC_FACTORIZE: withWorkedExample(buildFactorizeQuadratic),
  G9_QUADRATIC_SOLVE:     withWorkedExample(buildSolveQuadratic),
  G9_QUADRATIC_FORMULA:   withWorkedExample(buildQuadraticFormula),
  G9_COMPLETING_SQUARE:   withWorkedExample(buildCompleteSquare),
  G9_FUNCTIONS_INTRO:     withWorkedExample(() => buildEvaluateFunction({ quadratic: coin() })),

  // Sequences & series (G8/G10)
  G8_SEQUENCES:       withWorkedExample(buildArithmeticSequence),
  G10_SEQUENCES_ADV:  withWorkedExample(() => coin() ? buildGeometricSequence() : buildArithmeticSequence()),
  G10_SERIES:         withWorkedExample(buildArithmeticSeries),

  // Calculus — differentiation (G11) & integration (G12), incl. the previously
  // single-problem skills that broke spaced repetition.
  G11_DIFF_POWER_RULE:   withWorkedExample(buildDifferentiate),
  G11_STATIONARY_POINTS: withWorkedExample(buildStationaryPoints),
  G12_INTEGRATION_INTRO: withWorkedExample(buildIntegrate),
  G12_INTEGRATION_POWER: withWorkedExample(buildIntegrate),
  G12_DEFINITE_INTEGRALS: withWorkedExample(buildDefiniteIntegral),
};

export const ALGEBRA_SKILL_IDS = Object.keys(ALGEBRA_CONTENT);
