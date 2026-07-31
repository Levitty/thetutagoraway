// ============================================================================
// GEOMETRY CONTENT (numeric) — angle facts, polygon angles, Pythagoras, basic
// trig. Visual/constructive geometry (loci, transformations, bearings) needs a
// graphical answer mode and is intentionally left to that work.
// ============================================================================

import { accepts, hintLadder, randInt, pick, coin, withWorkedExample } from './schema.js';

const r1 = (x) => Math.round(x * 10) / 10;

// ---- missing angle in a triangle (sum = 180) ----
export function buildTriangleAngle() {
  let a, b, value;
  do {
    a = randInt(30, 80); b = randInt(30, 80); value = 180 - a - b;
  } while (value === a || value === b);   // the answer must not equal a given angle
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
  const askEach = coin();
  // for the sum question, n = 3 gives 180° — the same 180° printed in the formula hint
  const n = askEach ? randInt(3, 10) : randInt(4, 10);
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
      askEach ? `n = ${n}, so the sum is ${total}°.` : `n = ${n} — substitute into (n − 2) × 180°.`,
      askEach ? `Divide the sum by ${n} (regular polygon).` : 'Work the formula out step by step.'),
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


// ============================================================================
// CAMBRIDGE GAP FILL — Stage 8-9 geometry: parallel-line angles, congruence
// tests, similar figures, construction facts, bearings.
// ============================================================================

// ---- G8: angles with parallel lines ----
export function buildParallelAngles() {
  const a = randInt(35, 145);
  const rel = pick(['alternate', 'corresponding', 'co-interior', 'vertically opposite']);
  const equal = rel !== 'co-interior';
  const value = equal ? a : 180 - a;
  const other = equal ? 180 - a : a;
  const NICK = {
    alternate: 'alternate angles (the Z shape)',
    corresponding: 'corresponding angles (the F shape)',
    'co-interior': 'co-interior angles (the C shape)',
    'vertically opposite': 'vertically opposite angles (the X shape)',
  }[rel];
  return {
    type: 'parallel-angles', instruction: 'Name the relationship, then use its rule.',
    question: `Two parallel lines are crossed by a straight line. One angle is ${a}°. Find the ${rel} angle.`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}°`),
    hints: hintLadder(`Picture the letter: ${NICK}.`,
      equal ? 'Do the two angles look the same size, or do they make a straight line together?' : 'Co-interior angles ADD UP TO 180°.',
      equal ? `${rel[0].toUpperCase() + rel.slice(1)} angles are EQUAL.` : `180 − ${a}.`),
    solution: { steps: [
      { text: `Identify the pair: ${NICK}.`, expr: rel },
      { text: equal ? 'These are equal.' : 'These are supplementary (sum 180°).', expr: equal ? `${value}°` : `180 − ${a} = ${value}°` }], answer: `${value}` },
    misconceptions: other !== value ? [{ when: `${other}`, feedback: equal
      ? `You supplemented — but ${rel} angles are EQUAL. Only co-interior (C-shape) angles add to 180°.`
      : 'Co-interior (C-shape) angles are NOT equal — they add up to 180°.' }] : [],
    verify: { kind: 'fraction', value },
  };
}

// ---- G8: which congruence test? ----
export function buildCongruenceTest() {
  const cases = [
    { desc: 'all three sides of one triangle equal the three sides of the other', test: 'SSS', trap: null },
    { desc: 'two sides and the angle BETWEEN them match', test: 'SAS', trap: ['SSA', 'the angle must be INCLUDED — between the two sides — for this test'] },
    { desc: 'two angles and the side between them match', test: 'ASA', trap: null },
    { desc: 'both are right-angled, with equal hypotenuses and one other pair of equal sides', test: 'RHS', trap: ['SAS', 'with a right angle, hypotenuse and a side, the test has its own name'] },
  ];
  const c = pick(cases);
  return {
    type: 'congruence-test', instruction: 'Answer with the test name (SSS, SAS, ASA or RHS).',
    question: `Two triangles are such that ${c.desc}. Which congruence test proves they are congruent?`,
    answer: c.test, accepts: accepts(c.test),
    hints: hintLadder('The four tests are SSS, SAS, ASA and RHS.',
      'Match what is given — Sides and Angles, in the order they appear.',
      c.test === 'RHS' ? 'Right angle + Hypotenuse + Side has its own test.' : `Count the S\u2019s and A\u2019s in the description.`),
    solution: { steps: [
      { text: 'List what matches.', expr: c.desc },
      { text: 'Name the test.', expr: c.test }], answer: c.test },
    misconceptions: c.trap ? [{ when: c.trap[0], feedback: c.trap[1] }] : [],
    verify: { kind: 'exact', value: c.test },
  };
}

// ---- G8: similar figures — find the missing side ----
export function buildSimilarity() {
  const k = pick([2, 3, 1.5, 2.5]);
  const a = pick([4, 6, 8, 10]);
  let b = randInt(3, 9);
  const A = a * k;                      // matching pair reveals the scale factor
  // the asked side must differ from the given pair, and its answer must not
  // equal any length already printed in the question
  while (b === a || b * k === a || b * k === A) b = randInt(3, 9);
  const value = b * k;
  if (!Number.isInteger(A) || !Number.isInteger(value)) return buildSimilarity();
  const additive = b + (A - a);
  return {
    type: 'similarity', instruction: 'Find the scale factor first.',
    question: `Two triangles are similar. A ${a} cm side matches a ${A} cm side. What does a ${b} cm side of the small triangle match?`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}cm`),
    hints: hintLadder('Similar means one is an enlargement of the other — same shape, scaled.',
      `Scale factor = ${A} ÷ ${a} = ${k}.`,
      `Multiply: ${b} × ${k}.`),
    solution: { steps: [
      { text: 'Scale factor from the matching pair.', expr: `${A}/${a} = ${k}` },
      { text: 'Every length scales by the same factor.', expr: `${b} × ${k} = ${value} cm` }], answer: `${value}` },
    misconceptions: additive !== value ? [{ when: `${additive}`, feedback: `Enlargement MULTIPLIES lengths — it doesn't add the same amount to each side. Use the scale factor ${k}.` }] : [],
    verify: { kind: 'fraction', value },
  };
}

// ---- G9: construction facts (what the classical constructions produce) ----
export function buildConstructionFacts() {
  const cases = [
    { q: 'Constructing an equilateral triangle on a segment produces which angle (in degrees)?', a: '60', hint: 'All three angles of an equilateral triangle are equal, and they must total 180°.', wrong: ['90', 'That is a right angle — equilateral triangles have three EQUAL angles summing to 180°.'] },
    { q: 'A perpendicular bisector meets its segment at which angle (in degrees)?', a: '90', hint: '"Perpendicular" means at right angles.', wrong: null },
    { q: 'To construct a 30° angle, you first construct 60° and then do what to it? (one word)', a: 'bisect', hint: 'Half of 60° is 30°.', wrong: null },
    { q: 'To construct 45°, you bisect an angle of how many degrees?', a: '90', hint: 'Half of what gives 45?', wrong: null },
    { q: 'Every point on the perpendicular bisector of AB is the same distance from A and from which point?', a: 'B', hint: 'That equidistance is exactly what the bisector construction guarantees.', wrong: null },
    { q: 'An angle bisector splits a 74° angle into two angles of how many degrees each?', a: '37', hint: 'Bisect means cut exactly in half.', wrong: ['74', 'Bisecting HALVES the angle.'] },
  ];
  const c = pick(cases);
  return {
    type: 'construction-fact', instruction: 'Compass-and-ruler thinking.',
    question: c.q,
    answer: c.a, accepts: accepts(c.a, /^\d+$/.test(c.a) ? `${c.a}°` : null),
    hints: hintLadder('Think about what the construction guarantees, not how it looks.', c.hint),
    solution: { steps: [{ text: c.hint, expr: c.a }], answer: c.a },
    misconceptions: c.wrong ? [{ when: c.wrong[0], feedback: c.wrong[1] }] : [],
    verify: { kind: 'exact', value: c.a },
  };
}

// ---- G9: bearings — three figures, clockwise from North ----
export function buildBearings() {
  const kind = pick(['compass', 'back', 'compass']);
  if (kind === 'compass') {
    const cases = [
      { desc: 'due East', v: 90 }, { desc: 'due South', v: 180 }, { desc: 'due West', v: 270 },
      ...[randInt(10, 80)].map(x => ({ desc: `N ${x}° E`, v: x })),
      ...[randInt(10, 80)].map(x => ({ desc: `S ${x}° E`, v: 180 - x })),
      ...[randInt(10, 80)].map(x => ({ desc: `S ${x}° W`, v: 180 + x })),
      ...[randInt(10, 80)].map(x => ({ desc: `N ${x}° W`, v: 360 - x })),
    ];
    const c = pick(cases);
    const three = `${c.v}`.padStart(3, '0');
    return {
      type: 'bearing-compass', instruction: 'Bearings: three figures, measured CLOCKWISE from North.',
      question: `A ship sails ${c.desc}. Write this as a three-figure bearing.`,
      answer: three, accepts: accepts(three, `${c.v}`, `${c.v}°`, `${three}°`),
      hints: hintLadder('Start facing North and turn clockwise.',
        'A quarter turn clockwise is 090°, a half turn is 180°, three quarters is 270°.',
        `Work out how far clockwise from North "${c.desc}" is, then write it with three figures.`),
      solution: { steps: [
        { text: 'Measure clockwise from North.', expr: c.desc },
        { text: 'Write with three figures.', expr: `${three}°` }], answer: three },
      misconceptions: [],
      verify: { kind: 'fraction', value: c.v },
    };
  }
  const theta = randInt(20, 160);
  const value = theta + 180;
  const wrong = 180 - theta;
  const three = (n) => `${n}`.padStart(3, '0');
  return {
    type: 'back-bearing', instruction: 'The return journey.',
    question: `The bearing of town B from town A is ${three(theta)}°. What is the bearing of A from B?`,
    answer: three(value), accepts: accepts(three(value), `${value}`, `${value}°`),
    hints: hintLadder('Coming back, you face the exact opposite direction.',
      'Opposite direction = half a turn = 180°.',
      `${theta} + 180.`),
    solution: { steps: [
      { text: 'The back-bearing is half a turn away.', expr: `${theta}° + 180°` },
      { text: 'Evaluate (subtract 360° if it passes a full turn).', expr: `${three(value)}°` }], answer: three(value) },
    misconceptions: wrong !== value ? [{ when: `${wrong}`, feedback: `Don't subtract from 180° — turning to face BACK is a 180° turn, so ADD 180 (mod 360).` }] : [],
    verify: { kind: 'fraction', value },
  };
}

export const GEOMETRY_CONTENT = {
  // Cambridge gap fill
  G8_ANGLE_RELATIONSHIPS: withWorkedExample(buildParallelAngles),
  G8_CONGRUENCE:          withWorkedExample(buildCongruenceTest),
  G8_SIMILARITY:          withWorkedExample(buildSimilarity),
  G9_CONSTRUCTION:        withWorkedExample(buildConstructionFacts),
  G9_BEARINGS:            withWorkedExample(buildBearings),
  G6_TRIANGLE_PROPERTIES: withWorkedExample(buildTriangleAngle),
  G6_ANGLE_PROPERTIES:    withWorkedExample(buildAnglesLine),
  G8_POLYGON_ANGLES:      withWorkedExample(buildPolygonAngles),
  G7_PYTHAGORAS:          withWorkedExample(buildPythagoras),
  G9_TRIG_INTRO:          withWorkedExample(buildTrigRatio),
};

export const GEOMETRY_SKILL_IDS = Object.keys(GEOMETRY_CONTENT);
