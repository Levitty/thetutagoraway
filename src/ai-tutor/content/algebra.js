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
  withWorkedExample, withKPs, coin, accepts, hintLadder, randInt, nonzero, pick, fmtLinear, fmtQuadratic,
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


// ---- G9: simultaneous equations (elimination & substitution) ---------------
export function buildSimultaneousAdv() {
  // Engineer integer solutions so the arithmetic never obscures the method.
  const x = nonzero(-6, 8), y = nonzero(-6, 8);
  const a1 = nonzero(1, 5), b1 = nonzero(1, 5);
  let a2 = nonzero(1, 5), b2 = nonzero(1, 5);
  // avoid proportional equations (no unique solution) and identical ones
  while (a1 * b2 - a2 * b1 === 0) { a2 = nonzero(1, 5); b2 = nonzero(1, 5); }
  const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
  const askX = coin();
  const value = askX ? x : y;
  const eq = (a, b, c) => `${a === 1 ? '' : a === -1 ? '-' : a}x ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y = ${c}`;
  return {
    type: 'simultaneous-adv', instruction: 'Solve the pair of equations.',
    question: `Solve simultaneously:   ${eq(a1, b1, c1)}   and   ${eq(a2, b2, c2)}.   Find ${askX ? 'x' : 'y'}.`,
    answer: `${value}`, accepts: accepts(`${value}`, `${askX ? 'x' : 'y'}=${value}`),
    hints: hintLadder(
      'Two unknowns need two equations — the plan is to get rid of one of them.',
      'Multiply one or both equations so that the coefficients of the SAME letter match, then add or subtract.',
      `To remove ${askX ? 'y' : 'x'}, scale the equations so its coefficients match.`),
    solution: { steps: [
      { text: `Scale both equations so the ${askX ? 'y' : 'x'}-terms match.`,
        expr: askX ? `×${Math.abs(b2)} and ×${Math.abs(b1)}` : `×${Math.abs(a2)} and ×${Math.abs(a1)}` },
      { text: 'Add or subtract to eliminate that letter.', expr: `leaves one unknown` },
      { text: 'Solve, then substitute back for the other.', expr: `x = ${x}, y = ${y}` },
      { text: `The question asked for ${askX ? 'x' : 'y'}.`, expr: `${value}` }], answer: `${value}` },
    misconceptions: [
      { when: `${askX ? y : x}`, feedback: `That is ${askX ? 'y' : 'x'} — the question asked for ${askX ? 'x' : 'y'}. Both come out of the same working, so read the question again at the end.` },
    ],
    verify: { kind: 'fraction', value },
  };
}

// ---- G9: quadratic graphs — CRITICAL --------------------------------------
// A parabola is read, not just solved: roots, y-intercept, line of symmetry,
// turning point, and which way it opens.
export function buildQuadraticGraph() {
  const kind = pick(['roots', 'yintercept', 'symmetry', 'turning', 'shape', 'evaluate']);
  // y = (x − r1)(x − r2) = x² − (r1+r2)x + r1·r2
  let r1v = nonzero(-6, 6), r2v = nonzero(-6, 6);
  while (r1v === r2v) r2v = nonzero(-6, 6);
  if (r1v > r2v) [r1v, r2v] = [r2v, r1v];
  const b = -(r1v + r2v), c = r1v * r2v;
  const fStr = fmtQuadratic(1, b, c).uni;

  if (kind === 'roots') {
    return {
      type: 'quadgraph-roots', instruction: 'Read the roots from the equation.',
      question: `The curve y = ${fStr} is drawn. At which values of x does it CROSS the x-axis?`,
      answer: `${r1v} and ${r2v}`,
      accepts: accepts(`${r1v} and ${r2v}`, `${r1v},${r2v}`, `${r1v}, ${r2v}`, `${r2v}, ${r1v}`, `x=${r1v}, x=${r2v}`, `${r1v} ${r2v}`),
      hints: hintLadder(
        'On the x-axis, y is zero — so set the expression equal to 0.',
        'Factorise into two brackets; each bracket gives one crossing point.',
        `Find two numbers multiplying to ${c} and adding to ${b}.`),
      solution: { steps: [
        { text: 'The curve meets the x-axis where y = 0.', expr: `${fStr} = 0` },
        { text: 'Factorise.', expr: `(${fmtLinear(1, -r1v)})(${fmtLinear(1, -r2v)}) = 0` },
        { text: 'Each bracket gives a root.', expr: `x = ${r1v} or x = ${r2v}` }], answer: `${r1v} and ${r2v}` },
      misconceptions: [
        { when: `${-r1v} and ${-r2v}`, feedback: `Sign slip: if (x − ${r1v}) = 0 then x = ${r1v}, not ${-r1v}.` },
      ],
      verify: { kind: 'roots', poly: (t) => t * t + b * t + c, roots: [r1v, r2v] },
    };
  }

  if (kind === 'yintercept') {
    return {
      type: 'quadgraph-yint', instruction: 'Find where the curve meets the y-axis.',
      question: `At what value of y does the curve y = ${fStr} cross the y-AXIS?`,
      answer: `${c}`, accepts: accepts(`${c}`, `(0, ${c})`, `y=${c}`),
      hints: hintLadder(
        'Every point on the y-axis has x = 0.',
        'Substitute x = 0 into the equation.',
        'The x-terms vanish, leaving just the constant.'),
      solution: { steps: [
        { text: 'On the y-axis, x = 0.', expr: 'x = 0' },
        { text: 'Substitute.', expr: `y = 0² ${b < 0 ? '−' : '+'} ${Math.abs(b)}(0) ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${c}` }], answer: `${c}` },
      misconceptions: [
        { when: `${b}`, feedback: 'That is the x-coefficient. Setting x = 0 leaves only the CONSTANT term.' },
      ],
      verify: { kind: 'fraction', value: c },
    };
  }

  if (kind === 'symmetry') {
    const axis = (r1v + r2v) / 2;
    return {
      type: 'quadgraph-symmetry', instruction: 'Find the line of symmetry.',
      question: `The curve y = ${fStr} crosses the x-axis at x = ${r1v} and x = ${r2v}. Find the equation of its line of symmetry.`,
      answer: `x = ${axis}`, accepts: accepts(`x = ${axis}`, `x=${axis}`, `${axis}`),
      hints: hintLadder(
        'A parabola is symmetrical — the two crossing points sit at equal distances either side of one vertical line.',
        'That line passes exactly midway between the roots.',
        `Find the midpoint of ${r1v} and ${r2v}.`),
      solution: { steps: [
        { text: 'The axis of symmetry is midway between the roots.', expr: `(${r1v} + ${r2v}) ÷ 2` },
        { text: 'It is a VERTICAL line, so the answer is x = that value.', expr: `x = ${axis}` }], answer: `x = ${axis}` },
      misconceptions: [
        { when: `y = ${axis}`, feedback: 'The line of symmetry of a parabola is VERTICAL, so it is x = a number, not y = a number.' },
      ],
      verify: { kind: 'exact', value: `x = ${axis}` },
    };
  }

  if (kind === 'turning') {
    const axis = (r1v + r2v) / 2;
    const yMin = axis * axis + b * axis + c;
    return {
      type: 'quadgraph-turning', instruction: 'Find the turning point.',
      question: `Find the MINIMUM value of y on the curve y = ${fStr}.`,
      answer: `${yMin}`, accepts: accepts(`${yMin}`),
      hints: hintLadder(
        'The lowest point of a parabola sits on its line of symmetry.',
        `That line is midway between the roots ${r1v} and ${r2v}, at x = ${axis}.`,
        `Substitute x = ${axis} back into the equation.`),
      solution: { steps: [
        { text: 'The turning point lies on the line of symmetry.', expr: `x = ${axis}` },
        { text: 'Substitute to get the y-value.', expr: `y = ${yMin}` }], answer: `${yMin}` },
      misconceptions: [
        { when: `${axis}`, feedback: `${axis} is the x-coordinate of the turning point. The question asks for the minimum VALUE of y there.` },
      ],
      verify: { kind: 'fraction', value: yMin },
    };
  }

  if (kind === 'shape') {
    const neg = coin();
    const a = neg ? -1 : 1;
    const shown = fmtQuadratic(a, b, c).uni;
    return {
      type: 'quadgraph-shape', instruction: 'Which way does it open?',
      question: `Does the curve y = ${shown} open upwards or downwards?`,
      answer: neg ? 'downwards' : 'upwards',
      accepts: accepts(neg ? 'downwards' : 'upwards', neg ? 'down' : 'up'),
      hints: hintLadder(
        'Only one thing decides which way a parabola opens.',
        'Look at the sign in front of the x² term.'),
      solution: { steps: [
        { text: neg ? 'The x² term is negative, so the curve is upside down.' : 'The x² term is positive, so the curve opens upwards like a valley.',
          expr: neg ? 'downwards (∩)' : 'upwards (∪)' }], answer: neg ? 'downwards' : 'upwards' },
      misconceptions: [
        { when: neg ? 'upwards' : 'downwards', feedback: 'Check the sign of the x² term — a NEGATIVE x² coefficient turns the curve upside down.' },
      ],
      verify: { kind: 'text', value: neg ? 'downwards' : 'upwards' },
    };
  }

  // evaluate a point on the curve
  const k = nonzero(-4, 5);
  const value = k * k + b * k + c;
  return {
    type: 'quadgraph-evaluate', instruction: 'Find a point on the curve.',
    question: `Find the value of y on the curve y = ${fStr} when x = ${k}.`,
    answer: `${value}`, accepts: accepts(`${value}`, `(${k}, ${value})`),
    hints: hintLadder('Substitute the given x everywhere it appears.',
      `Replace every x with (${k}) — brackets matter when x is negative.`,
      `Work out (${k})² first, then the rest.`),
    solution: { steps: [
      { text: `Substitute x = ${k}.`, expr: `(${k})² ${b < 0 ? '−' : '+'} ${Math.abs(b)}(${k}) ${c < 0 ? '−' : '+'} ${Math.abs(c)}` },
      { text: 'Evaluate.', expr: `${value}` }], answer: `${value}` },
    misconceptions: k < 0 ? [
      { when: `${-(k * k) + b * k + c}`, feedback: `Careful with the square of a negative: (${k})² = ${k * k}, which is POSITIVE.` },
    ] : [],
    verify: { kind: 'fraction', value },
  };
}

// ============================================================================
// CBC GRADE 9 — ALGEBRA 2.1 MATRICES (8 lessons)
//
// The KICD outcomes are deliberately concrete: identify a matrix, give its
// ORDER, locate an ELEMENT by row and column, judge COMPATIBILITY for addition
// and subtraction, and add or subtract. Determinants and inverses are NOT part
// of Grade 9 and are not generated here. The contexts are the ones the design
// names — league tables, shopping lists, travel schedules.
// ============================================================================

// Render a matrix in the row-separated form the app's answer checker accepts.
const mat = (rows) => `[${rows.map(r => r.join(' ')).join('; ')}]`;
const randRows = (r, c, lo = 1, hi = 9) =>
  Array.from({ length: r }, () => Array.from({ length: c }, () => randInt(lo, hi)));

const ORDINAL = ['', 'first', 'second', 'third', 'fourth'];

// ---- G9: identify a matrix, its order, and the position of an element ----
export function buildMatrixIntro() {
  const kind = pick(['order', 'element', 'position', 'order-from-table']);
  const r = randInt(2, 3), c = randInt(2, 3);
  const rows = randRows(r, c);

  if (kind === 'order') {
    const value = `${r} × ${c}`;
    return {
      type: 'matrix-order', instruction: 'Give the order as rows × columns.',
      question: `What is the ORDER of the matrix ${mat(rows)}?`,
      answer: value,
      accepts: accepts(value, `${r}x${c}`, `${r}*${c}`, `${r} by ${c}`, `${r}×${c}`),
      hints: hintLadder(
        'The order of a matrix is a pair of numbers, not a single one.',
        'Rows run across; columns run down.',
        'Count the rows first — the order is always written rows before columns.'),
      solution: { steps: [
        { text: 'Count the rows (across).', expr: `${r} rows` },
        { text: 'Count the columns (down).', expr: `${c} columns` },
        { text: 'Write rows × columns.', expr: value }], answer: value },
      misconceptions: [
        ...(r !== c ? [{ when: `${c} × ${r}`, feedback: 'The two numbers are the right ones but the wrong way round — order is always ROWS first, then columns.' }] : []),
        { when: `${r * c}`, feedback: 'That is how many elements there are. The order keeps the rows and columns as a separate pair.' },
      ],
      verify: { kind: 'exact', value },
    };
  }

  if (kind === 'element') {
    const i = randInt(1, r), j = randInt(1, c);
    const value = `${rows[i - 1][j - 1]}`;
    // The element must be identifiable — if the same number sits everywhere the
    // question tests nothing.
    const flat = rows.flat();
    if (new Set(flat).size < flat.length - 1) return buildMatrixIntro();
    return {
      type: 'matrix-element', instruction: 'Read off the element.',
      question: `In the matrix A = ${mat(rows)}, what is the element a${'₀₁₂₃₄'[i]}${'₀₁₂₃₄'[j]}?`,
      answer: value, accepts: accepts(value),
      hints: hintLadder(
        'The two small numbers are an address: the first is the row, the second is the column.',
        `So you are looking in the ${ORDINAL[i]} row.`,
        `Then count across to the ${ORDINAL[j]} column.`),
      solution: { steps: [
        { text: 'Read the address.', expr: `row ${i}, column ${j}` },
        { text: 'Go to that position.', expr: value }], answer: value },
      misconceptions: [
        ...(i !== j && rows[j - 1] && rows[j - 1][i - 1] != null && `${rows[j - 1][i - 1]}` !== value
          ? [{ when: `${rows[j - 1][i - 1]}`, feedback: 'Row and column have been swapped — the FIRST small number is always the row.' }] : []),
      ],
      verify: { kind: 'exact', value },
    };
  }

  if (kind === 'position') {
    const i = randInt(1, r), j = randInt(1, c);
    const target = rows[i - 1][j - 1];
    const flat = rows.flat();
    if (flat.filter(v => v === target).length !== 1) return buildMatrixIntro();
    const value = `${i},${j}`;
    return {
      type: 'matrix-position', instruction: 'Answer as row,column — for example 2,1.',
      question: `In the matrix ${mat(rows)}, in which row and column does the element ${target} sit?`,
      answer: value,
      accepts: accepts(value, `${i}, ${j}`, `(${i},${j})`, `(${i}, ${j})`, `row ${i} column ${j}`),
      hints: hintLadder(
        'Find the number in the grid first, then describe where it is.',
        'Rows are counted from the top; columns from the left.',
        'Write the row number before the column number.'),
      solution: { steps: [
        { text: 'Locate the element.', expr: `${target}` },
        { text: 'Name its row, then its column.', expr: value }], answer: value },
      misconceptions: [
        ...(i !== j ? [{ when: `${j},${i}`, feedback: 'Right position, wrong order — say the row first, then the column.' }] : []),
      ],
      verify: { kind: 'exact', value },
    };
  }

  // A real table, as the design suggests: a league table IS a matrix.
  const teams = pick([['Gor Mahia', 'AFC Leopards', 'Tusker'], ['Bandari', 'Ulinzi', 'Sofapaka']]);
  const cols = ['Won', 'Drawn', 'Lost'];
  const body = randRows(3, 3, 0, 9);
  const value = '3 × 3';
  return {
    type: 'matrix-from-table', instruction: 'Give the order as rows × columns.',
    question: `A league table lists ${teams.join(', ')} against the columns ${cols.join(', ')}:\n${teams.map((t, k) => `${t}: ${body[k].join('  ')}`).join('\n')}\nWritten as a matrix of the numbers only, what is its ORDER?`,
    answer: value, accepts: accepts(value, '3x3', '3*3', '3 by 3', '3×3'),
    hints: hintLadder(
      'Only the numbers form the matrix — the names and headings are labels.',
      'One row per team; one column per heading.',
      'Count each, and write rows before columns.'),
    solution: { steps: [
      { text: 'Count the teams — these are the rows.', expr: '3 rows' },
      { text: 'Count the headings — these are the columns.', expr: '3 columns' },
      { text: 'Write the order.', expr: value }], answer: value },
    misconceptions: [
      { when: '4 × 4', feedback: 'The team names and the headings are labels, not part of the matrix — count only the numbers.' },
      { when: '9', feedback: 'That is how many numbers there are. The order keeps rows and columns separate.' },
    ],
    verify: { kind: 'exact', value },
  };
}

// ---- G9: compatibility, addition and subtraction of matrices ----
export function buildMatrixOps() {
  const kind = pick(['add', 'subtract', 'compatible', 'add-context']);

  if (kind === 'compatible') {
    const same = coin();
    const r1 = randInt(2, 3), c1 = randInt(2, 3);
    const r2 = same ? r1 : pick([1, 2, 3].filter(x => x !== r1));
    const c2 = same ? c1 : c1;
    const value = same ? 'yes' : 'no';
    return {
      type: 'matrix-compatible', instruction: 'Answer yes or no.',
      question: `Matrix A has order ${r1} × ${c1} and matrix B has order ${r2} × ${c2}. Can A + B be worked out?`,
      answer: value, accepts: accepts(value, same ? 'y' : 'n'),
      hints: hintLadder(
        'Adding matrices means adding each position to its matching position.',
        'For every position in A there must be one in exactly the same place in B.',
        'Compare the two orders, number against number.'),
      solution: { steps: [
        { text: 'Compare the orders.', expr: `${r1} × ${c1}  and  ${r2} × ${c2}` },
        { text: same ? 'They match, so every position has a partner.' : 'They differ, so some positions have no partner.', expr: value }], answer: value },
      misconceptions: [
        { when: same ? 'no' : 'yes', feedback: 'Addition needs the orders to be identical — the same number of rows AND the same number of columns.' },
      ],
      verify: { kind: 'exact', value },
    };
  }

  if (kind === 'add-context') {
    // Two shops, two weeks of sales — the design's "shopping list" context.
    const w1 = randRows(2, 2, 5, 40), w2 = randRows(2, 2, 5, 40);
    const sum = w1.map((row, i) => row.map((v, j) => v + w2[i][j]));
    const value = mat(sum);
    return {
      type: 'matrix-add-context', instruction: 'Give your answer as a matrix, rows separated by ;',
      question: `A shop records sales of maize and beans over two weeks.\nWeek 1: ${mat(w1)}   Week 2: ${mat(w2)}\nEach row is a product and each column is a branch. Find the TOTAL sales matrix.`,
      answer: value, accepts: accepts(value, value.replace(/\s+/g, ''), value.replace(/;/g, ',')),
      hints: hintLadder(
        'A total over two weeks means the two matrices are added.',
        'Each position keeps its meaning — top-left is the same product and branch in both.',
        'So add each number to the one in the matching position.'),
      solution: { steps: [
        { text: 'Check the orders match.', expr: 'both 2 × 2' },
        { text: 'Add matching positions.', expr: `${w1[0][0]} + ${w2[0][0]} = ${sum[0][0]}, and so on` },
        { text: 'Write the result.', expr: value }], answer: value },
      misconceptions: [
        { when: `${sum.flat().reduce((a, b) => a + b, 0)}`, feedback: 'Adding matrices gives another MATRIX, not a single total — keep the rows and columns.' },
      ],
      verify: { kind: 'exact', value },
    };
  }

  const r = randInt(2, 2), c = randInt(2, 3);
  const A = randRows(r, c, 2, 12);
  const B = randRows(r, c, 1, 9);
  const sub = kind === 'subtract';
  const R = A.map((row, i) => row.map((v, j) => (sub ? v - B[i][j] : v + B[i][j])));
  const value = mat(R);
  const wrongWay = mat(A.map((row, i) => row.map((v, j) => (sub ? B[i][j] - v : v))));
  return {
    type: sub ? 'matrix-subtract' : 'matrix-add',
    instruction: 'Give your answer as a matrix, rows separated by ;',
    question: `${mat(A)} ${sub ? '−' : '+'} ${mat(B)} = ?`,
    answer: value, accepts: accepts(value, value.replace(/\s+/g, ''), value.replace(/;/g, ',')),
    hints: hintLadder(
      'Check the two orders match before doing anything else.',
      `Each position is worked out on its own: top-left with top-left, and so on.`,
      sub ? 'Keep the order of the subtraction the same as in the question.' : 'The result has exactly the same order as the two you started with.'),
    solution: { steps: [
      { text: 'Both have the same order, so this can be done.', expr: `${r} × ${c}` },
      { text: 'Work position by position.', expr: `${A[0][0]} ${sub ? '−' : '+'} ${B[0][0]} = ${R[0][0]}, and so on` },
      { text: 'Collect into a matrix.', expr: value }], answer: value },
    misconceptions: [
      ...(sub && wrongWay !== value ? [{ when: wrongWay, feedback: 'The subtraction has been done the other way round — take the second matrix FROM the first.' }] : []),
    ],
    verify: { kind: 'exact', value },
  };
}

export const ALGEBRA_CONTENT = {
  // Cambridge gap fill — inequalities + the Stage-8 straight-line spine
  G7_INEQUALITIES_INTRO: withWorkedExample(buildInequalityIntro),
  G8_INEQUALITIES:      withWorkedExample(buildInequalitySolve),
  G8_LINEAR_GRAPHS:     withWorkedExample(buildLinearGraphRead),
  G8_GRADIENT:          withWorkedExample(buildGradient),
  G8_EQUATION_OF_LINE:  withWorkedExample(buildEquationOfLine),
  // CBC Grade 9 Algebra 2.1 — Matrices (order, position, compatibility, ±)
  G11_MATRICES_INTRO:   withWorkedExample(buildMatrixIntro),
  G11_MATRICES_OPS:     withWorkedExample(buildMatrixOps),
  // Forming & collecting
  G7_EXPRESSIONS:      withWorkedExample(() => buildSimplify({ tier: 1 })),
  G7_SIMPLIFY:         withWorkedExample(() => buildSimplify({ tier: 2 })),

  // Expanding & factorising
  G8_EXPAND_BRACKETS:  withWorkedExample(buildDistribute),
  G9_QUADRATIC_EXPAND: withWorkedExample(buildBinomial),
  G9_SIMULTANEOUS_ADV: withWorkedExample(buildSimultaneousAdv),
  G9_QUADRATIC_GRAPHS: withWorkedExample(buildQuadraticGraph),
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
