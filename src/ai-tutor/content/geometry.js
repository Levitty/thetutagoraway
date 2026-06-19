// ============================================================================
// GEOMETRY CONTENT (numeric) — angle facts, polygon angles, Pythagoras, basic
// trig. Visual/constructive geometry (loci, transformations, bearings) needs a
// graphical answer mode and is intentionally left to that work.
// ============================================================================

import { accepts, hintLadder, randInt, pick, coin, withWorkedExample } from './schema.js';

const r1 = (x) => Math.round(x * 10) / 10;

// ---- missing angle in a triangle (sum = 180) ----
export function buildTriangleAngle() {
  const a = randInt(30, 80), b = randInt(30, 80);
  const value = 180 - a - b;
  return {
    type: 'triangle-angle', instruction: 'Find the missing angle.',
    question: `Two angles of a triangle are ${a}° and ${b}°. Find the third angle.`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}°`),
    hints: hintLadder('The angles in a triangle add up to 180°.', `180 − ${a} − ${b}.`),
    solution: { steps: [{ text: 'Angles in a triangle sum to 180°.', expr: `180 − ${a} − ${b} = ${value}°` }], answer: `${value}` },
    misconceptions: [{ when: `${360 - a - b}`, feedback: 'Triangle angles sum to 180°, not 360°.' }],
    verify: { kind: 'fraction', value },
  };
}

// ---- angles on a straight line / at a point ----
export function buildAnglesLine() {
  const atPoint = coin();
  const total = atPoint ? 360 : 180;
  const known = atPoint ? [randInt(60, 120), randInt(60, 120)] : [randInt(40, 130)];
  const value = total - known.reduce((s, x) => s + x, 0);
  if (value < 10) return buildAnglesLine();
  return {
    type: 'angles-line', instruction: 'Find the missing angle.',
    question: atPoint
      ? `Angles at a point: ${known.join('°, ')}° and x° together make a full turn. Find x.`
      : `Angles on a straight line: ${known[0]}° and x° together. Find x.`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}°`),
    hints: hintLadder(atPoint ? 'Angles at a point add up to 360°.' : 'Angles on a straight line add up to 180°.',
      `${total} − ${known.join(' − ')}.`),
    solution: { steps: [{ text: `They sum to ${total}°.`, expr: `${total} − ${known.join(' − ')} = ${value}°` }], answer: `${value}` },
    misconceptions: [], verify: { kind: 'fraction', value },
  };
}

// ---- polygon interior angle sum / each interior angle ----
export function buildPolygonAngles() {
  const n = randInt(3, 10);
  const askEach = coin();
  const total = (n - 2) * 180;
  const value = askEach ? total / n : total;
  return {
    type: 'polygon-angles',
    instruction: askEach ? 'Find each interior angle of the regular polygon.' : 'Find the sum of the interior angles.',
    question: askEach
      ? `Find each interior angle of a regular ${n}-sided polygon.`
      : `Find the sum of the interior angles of a ${n}-sided polygon.`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}°`),
    hints: hintLadder('Interior angle sum = (n − 2) × 180°.',
      `n = ${n}, so sum = ${total}°.`, askEach ? `Divide by ${n} (regular polygon).` : 'That is the total.'),
    solution: { steps: [
      { text: 'Sum = (n − 2) × 180°.', expr: `(${n} − 2) × 180 = ${total}°` },
      ...(askEach ? [{ text: `Each angle = sum ÷ ${n}.`, expr: `${total} ÷ ${n} = ${value}°` }] : [])], answer: `${value}` },
    misconceptions: [], verify: { kind: 'fraction', value },
  };
}

// ---- Pythagoras (uses triples for clean answers) ----
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29]];
export function buildPythagoras() {
  const [a, b, c] = pick(TRIPLES);
  const findHyp = coin();
  const value = findHyp ? c : b;
  return {
    type: 'pythagoras', instruction: 'Find the missing side.',
    question: findHyp
      ? `A right-angled triangle has the two shorter sides ${a} and ${b}. Find the hypotenuse.`
      : `A right-angled triangle has hypotenuse ${c} and one shorter side ${a}. Find the other side.`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('Pythagoras: a² + b² = c² (c is the hypotenuse).',
      findHyp ? `${a}² + ${b}² = c².` : `${a}² + b² = ${c}², so b² = ${c}² − ${a}².`),
    solution: { steps: [
      { text: 'Apply a² + b² = c².', expr: findHyp ? `${a}² + ${b}² = ${a * a + b * b}` : `b² = ${c * c} − ${a * a} = ${value * value}` },
      { text: 'Square-root.', expr: `${value}` }], answer: `${value}` },
    misconceptions: [{ when: findHyp ? `${a + b}` : `${c - a}`, feedback: 'You can’t just add/subtract the sides — square them, then square-root.' }],
    verify: { kind: 'fraction', value },
  };
}

// ---- basic trigonometry (find a side, to 1 d.p.) ----
export function buildTrigRatio() {
  const angle = pick([30, 40, 50, 60]);
  const hyp = randInt(6, 20);
  const findOpp = coin();
  const value = r1(findOpp ? hyp * Math.sin(angle * Math.PI / 180) : hyp * Math.cos(angle * Math.PI / 180));
  return {
    type: 'trig-ratio', instruction: 'Find the side (to 1 d.p.).',
    question: `In a right-angled triangle the hypotenuse is ${hyp} and one angle is ${angle}°. Find the ${findOpp ? 'opposite' : 'adjacent'} side. (1 d.p.)`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('SOH-CAH-TOA.',
      findOpp ? 'sin = opposite ÷ hypotenuse, so opposite = hyp × sin(angle).' : 'cos = adjacent ÷ hypotenuse, so adjacent = hyp × cos(angle).',
      `${hyp} × ${findOpp ? 'sin' : 'cos'}(${angle}°).`),
    solution: { steps: [
      { text: findOpp ? 'opposite = hyp × sin(angle).' : 'adjacent = hyp × cos(angle).', expr: `${hyp} × ${findOpp ? 'sin' : 'cos'}(${angle}°)` },
      { text: 'Evaluate (1 d.p.).', expr: `${value}` }], answer: `${value}` },
    misconceptions: [], verify: { kind: 'fraction', value: findOpp ? hyp * Math.sin(angle * Math.PI / 180) : hyp * Math.cos(angle * Math.PI / 180), tol: 0.1 },
  };
}

export const GEOMETRY_CONTENT = {
  G6_TRIANGLE_PROPERTIES: withWorkedExample(buildTriangleAngle),
  G6_ANGLE_PROPERTIES:    withWorkedExample(buildAnglesLine),
  G8_POLYGON_ANGLES:      withWorkedExample(buildPolygonAngles),
  G7_PYTHAGORAS:          withWorkedExample(buildPythagoras),
  G9_TRIG_INTRO:          withWorkedExample(buildTrigRatio),
};

export const GEOMETRY_SKILL_IDS = Object.keys(GEOMETRY_CONTENT);
