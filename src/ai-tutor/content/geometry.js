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
  const regular = [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36];
  const mode = pick(['sum', 'each', 'exterior', 'sidesFromExterior', 'sidesFromInterior']);
  const n = mode === 'sum' ? randInt(3, 20) : pick(regular);
  const total = (n - 2) * 180, each = total / n, ext = 360 / n;
  const Q = {
    sum: [`Find the sum of the interior angles of a ${n}-sided polygon.`, total, 'Interior angle sum = (n − 2) × 180°.'],
    each: [`Find each interior angle of a regular ${n}-sided polygon.`, each, 'Find the angle sum, then share it equally between the angles.'],
    exterior: [`Find each exterior angle of a regular ${n}-sided polygon.`, ext, 'The exterior angles of any polygon add up to 360°.'],
    sidesFromExterior: [`Each exterior angle of a regular polygon is ${ext}°. How many sides does it have?`, n, 'The exterior angles add up to 360°. How many of them are there?'],
    sidesFromInterior: [`Each interior angle of a regular polygon is ${each}°. How many sides does it have?`, n, 'Find the exterior angle first (180° − interior), then use 360°.'],
  }[mode];
  const unitless = mode.startsWith('sides');
  return {
    type: 'polygon-angles', instruction: 'Polygon angles.', question: Q[0],
    answer: `${Q[1]}`, accepts: unitless ? accepts(`${Q[1]}`) : accepts(`${Q[1]}`, `${Q[1]}°`),
    hints: hintLadder(Q[2]),
    solution: { steps: [
      mode === 'sum' ? { text: 'Sum = (n − 2) × 180°.', expr: `(${n} − 2) × 180 = ${total}°` }
      : mode === 'each' ? { text: 'Sum ÷ number of angles.', expr: `${total} ÷ ${n} = ${each}°` }
      : mode === 'exterior' ? { text: '360° ÷ number of sides.', expr: `360 ÷ ${n} = ${ext}°` }
      : mode === 'sidesFromExterior' ? { text: 'Sides = 360° ÷ exterior angle.', expr: `360 ÷ ${ext} = ${n}` }
      : { text: 'Exterior = 180° − interior; sides = 360° ÷ exterior.', expr: `180 − ${each} = ${ext}; 360 ÷ ${ext} = ${n}` },
    ], answer: `${Q[1]}` },
    misconceptions: mode === 'sum' ? [{ when: `${n * 180}`, feedback: 'Take 2 away from the number of sides before you multiply: split the shape into triangles from one corner and count them.' }]
      : mode === 'each' ? [{ when: `${ext}`, feedback: 'That is the exterior angle. The interior angle is 180° minus it.' }]
      : mode === 'exterior' ? [{ when: `${each}`, feedback: 'That is the interior angle. The exterior angle is 180° minus it.' }] : [],
    verify: { kind: 'fraction', value: Q[1] },
  };
}

// ---- Pythagoras (uses triples for clean answers) ----
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29]];
export function buildPythagoras() {
  let [a, b, c] = pick(TRIPLES); const k = pick([1, 1, 2, 3]);
  if (c * k <= 60) { a *= k; b *= k; c *= k; }
  if (coin()) [a, b] = [b, a];
  const findHyp = coin();
  const value = findHyp ? c : b;
  const ctx = pick([
    null, null,
    findHyp ? `A matatu drives ${a} km east, then ${b} km north. How far is it from where it started, in a straight line (km)?` : `A ladder ${c} m long leans on a wall. Its foot is ${a} m from the wall. How high up the wall does it reach (m)?`,
    findHyp ? `A rectangular shamba is ${a} m by ${b} m. How long is the path straight across it, corner to corner (m)?` : `A ${c} m rope goes from the top of a pole to a peg ${a} m from its foot. How tall is the pole (m)?`,
  ]);
  return {
    type: 'pythagoras', instruction: 'Find the missing side.',
    question: ctx || (findHyp
      ? `A right-angled triangle has the two shorter sides ${a} and ${b}. Find the hypotenuse.`
      : `A right-angled triangle has hypotenuse ${c} and one shorter side ${a}. Find the other side.`),
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('Pythagoras: a² + b² = c² (c is the longest side, opposite the right angle).',
      findHyp ? `${a}² + ${b}² = c².` : `${a}² + b² = ${c}², so b² = ${c}² − ${a}².`),
    solution: { steps: [
      { text: 'Apply a² + b² = c².', expr: findHyp ? `${a}² + ${b}² = ${a * a + b * b}` : `b² = ${c * c} − ${a * a} = ${value * value}` },
      { text: 'Square-root.', expr: `${value}` }], answer: `${value}` },
    misconceptions: [{ when: findHyp ? `${a + b}` : `${c - a}`, feedback: 'You can’t just add/subtract the sides — square them, then square-root.' },
      { when: findHyp ? `${a * a + b * b}` : `${c * c - a * a}`, feedback: 'That is the side squared. Take the square root for the length.' }],
    verify: { kind: 'fraction', value },
  };
}

// ---- basic trigonometry (find a side, to 1 d.p.) ----
export function buildTrigRatio() {
  const angle = pick([30, 40, 50, 60]);
  const hyp = randInt(6, 20);
  const findOpp = coin();
  // Shown to 1 d.p. even when it ends in .0, so 13.02 is marked right for 13.0.
  const value = (findOpp ? hyp * Math.sin(angle * Math.PI / 180) : hyp * Math.cos(angle * Math.PI / 180)).toFixed(1);
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
