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
        // The quarter/half/three-quarter table names 090, 180 and 270 — which
        // ARE the answers for due East/South/West, so it can only be shown
        // when the answer isn't one of them.
        [90, 180, 270].includes(c.v)
          ? 'Face North, then turn clockwise until you face that way. How much of a full turn was it?'
          : 'A quarter turn clockwise is 090°, a half turn is 180°, three quarters is 270°.',
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


// ---- G9: loci — the set of points satisfying a condition -------------------
// Was a single hard-coded question ("the locus equidistant from two points is
// a...?"), so a student saw the identical prompt every time. Loci is really
// four rules plus their intersections, taught through real situations — a goat
// tethered to a post, a path kept equidistant from two walls.
export function buildLoci() {
  const kind = pick(['rule', 'context', 'distance', 'intersect', 'region']);

  if (kind === 'rule') {
    const cases = [
      { q: 'What is the locus of points that are the same distance from two fixed points A and B?',
        a: 'perpendicular bisector',
        accepts: ['perpendicular bisector', 'the perpendicular bisector', 'perpendicular bisector of AB'],
        hint: 'Picture every point that is equally far from both — they form a straight cut across the middle of AB.',
        why: 'Every such point sits halfway across AB, at right angles to it.',
        wrong: ['circle', 'A circle is the locus of points a fixed distance from ONE point, not equidistant from two.'] },
      { q: 'What is the locus of points that are the same distance from two intersecting straight lines?',
        a: 'angle bisector',
        accepts: ['angle bisector', 'the angle bisector', 'angle bisectors'],
        hint: 'Equal distance from both arms of an angle — what line cuts that angle in half?',
        why: 'The bisector of the angle between the lines is equally far from each arm.',
        wrong: ['perpendicular bisector', 'That is for two POINTS. For two LINES, it is the angle bisector.'] },
      { q: 'What is the locus of points exactly 5 cm from a fixed point O?',
        a: 'circle',
        accepts: ['circle', 'a circle', 'circle of radius 5 cm', 'circle radius 5'],
        hint: 'Fixed distance from one point, in every direction.',
        why: 'A fixed distance from a single point traces a circle of that radius.',
        wrong: ['sphere', 'In two dimensions it is a circle — a sphere is the 3-D version.'] },
      { q: 'What is the locus of points exactly 3 cm from a long straight line?',
        a: 'two parallel lines',
        accepts: ['two parallel lines', 'a pair of parallel lines', 'two parallel lines 3 cm from it', 'pair of parallel lines'],
        hint: 'You can be 3 cm away on either side of the line.',
        why: 'One parallel line 3 cm above and one 3 cm below — both count.',
        wrong: ['one parallel line', 'Do not forget the other side — the locus is a PAIR of parallel lines.'] },
    ];
    const c = pick(cases);
    return {
      type: 'locus-rule', instruction: 'Name the locus.',
      question: c.q, answer: c.a, accepts: accepts(...c.accepts),
      hints: hintLadder('A locus is simply the set of ALL points obeying a rule — picture them appearing one by one.', c.hint),
      solution: { steps: [{ text: c.why, expr: c.a }], answer: c.a },
      misconceptions: [{ when: c.wrong[0], feedback: c.wrong[1] }],
      verify: { kind: 'text', value: c.a },
    };
  }

  if (kind === 'context') {
    const cases = [
      { q: 'A goat is tied to a post in an open field by a 4 m rope. What shape is the boundary of the ground it can reach?',
        a: 'circle', accepts: ['circle', 'a circle', 'circle of radius 4 m'],
        why: 'Every point it can reach is at most 4 m from the post, so the edge is a circle of radius 4 m.' },
      { q: 'A path is to be laid so that it is always the same distance from two straight boundary walls that meet at a corner. What line does the path follow?',
        a: 'angle bisector', accepts: ['angle bisector', 'the angle bisector'],
        why: 'Equal distance from both walls means the path bisects the angle between them.' },
      { q: 'Two boreholes stand in a field. A fence must be built so that every point on it is the same distance from both boreholes. What line does the fence follow?',
        a: 'perpendicular bisector', accepts: ['perpendicular bisector', 'the perpendicular bisector'],
        why: 'Equidistant from two points is exactly the perpendicular bisector of the line joining them.' },
      { q: 'A cow walks so that it is always exactly 2 m from a long straight fence. Describe its path.',
        a: 'two parallel lines', accepts: ['two parallel lines', 'a pair of parallel lines', 'parallel lines'],
        why: 'It can walk 2 m from the fence on either side — a parallel line on each side.' },
    ];
    const c = pick(cases);
    return {
      type: 'locus-context', instruction: 'Describe the locus in this situation.',
      question: c.q, answer: c.a, accepts: accepts(...c.accepts),
      // The hint must NOT recite the rule table — it lists every possible
      // answer, so whichever one is being asked for is handed over.
      hints: hintLadder('Ask: what is being held constant here — a distance from a point, or a distance from a line?',
        'Then ask how many fixed things it is measured from: one, or two? Those two questions pin the locus down.'),
      solution: { steps: [{ text: c.why, expr: c.a }], answer: c.a },
      misconceptions: [],
      verify: { kind: 'text', value: c.a },
    };
  }

  if (kind === 'distance') {
    // The radius/diameter of the region a tether traces.
    const r = randInt(3, 12);
    const askArea = coin();
    const value = askArea ? Math.round(Math.PI * r * r) : 2 * r;
    return {
      type: 'locus-measure', instruction: 'Work with the region a locus encloses.',
      question: askArea
        ? `A goat is tethered to a post by a rope ${r} m long in open ground. What area of grass can it reach? (Use π = 3.142, answer to the nearest m².)`
        : `A dog is tied to a post by a ${r} m lead in an open field. What is the greatest distance it can be from where it starts, walking round the post?`,
      answer: `${value}`, accepts: accepts(`${value}`, askArea ? `${value}m²` : `${value}m`),
      hints: hintLadder(
        askArea ? 'The reachable ground is a full circle whose radius is the rope.'
                : 'The two furthest-apart points on a circle are opposite ends of it.',
        askArea ? `Area of a circle = πr², with r = ${r}.`
                : `That distance is the diameter, and the rope is the radius (${r} m).`),
      solution: { steps: [
        { text: askArea ? 'The locus of the goat is a circle of radius equal to the rope.' : 'The locus is a circle of radius equal to the lead.',
          expr: `r = ${r} m` },
        { text: askArea ? 'Area = πr².' : 'Greatest separation = the diameter = 2r.',
          expr: askArea ? `3.142 × ${r}² ≈ ${value} m²` : `2 × ${r} = ${value} m` }], answer: `${value}` },
      misconceptions: askArea
        ? [{ when: `${Math.round(2 * Math.PI * r)}`, feedback: 'That is the circumference (2πr) — the question asks for the AREA it can graze, which is πr².' }]
        : [{ when: `${r}`, feedback: 'The rope is the RADIUS. The greatest distance across the circle is the diameter, which is twice the rope.' }],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'intersect') {
    const cases = [
      { q: 'A point must be equidistant from two fixed points A and B, AND exactly 6 cm from A. How many positions are possible (in general)?',
        a: '2', why: 'The perpendicular bisector of AB cuts the circle of radius 6 cm about A in two places.',
        wrong: ['1', 'A straight line crossing a circle meets it TWICE, not once — unless it only touches.'] },
      { q: 'A treasure is equidistant from two trees AND equidistant from two straight paths that cross. How many points satisfy both conditions (in general)?',
        a: '1', why: 'One perpendicular bisector and one angle bisector are two straight lines — two lines generally cross at a single point.',
        wrong: ['2', 'Two straight lines meet at ONE point unless they are parallel.'] },
      { q: 'A point is 5 cm from point P and also 5 cm from point Q, where PQ = 8 cm. How many such points are there?',
        a: '2', why: 'Two circles of radius 5 cm whose centres are 8 cm apart overlap, and overlapping circles cross at two points.',
        wrong: ['0', 'The circles do overlap: 5 + 5 = 10 cm is more than the 8 cm between the centres, so they cross twice.'] },
    ];
    const c = pick(cases);
    return {
      type: 'locus-intersect', instruction: 'Where do the two loci meet?',
      question: c.q, answer: c.a, accepts: accepts(c.a),
      hints: hintLadder('Draw each condition as its own locus first, then look at where they cross.',
        'A line crossing a circle meets it twice; two lines that are not parallel meet once; two overlapping circles cross twice.'),
      solution: { steps: [{ text: c.why, expr: c.a }], answer: c.a },
      misconceptions: [{ when: c.wrong[0], feedback: c.wrong[1] }],
      verify: { kind: 'fraction', value: +c.a },
    };
  }

  // region: inside / outside a boundary
  const cases = [
    { q: 'A sprinkler waters everything within 7 m of itself. Is a flower 9 m away watered? (yes/no)', a: 'no',
      why: '9 m is outside the circle of radius 7 m, so it falls beyond the watered region.' },
    { q: 'A watchman must stay within 20 m of a gate. Is a point 14 m from the gate allowed? (yes/no)', a: 'yes',
      why: '14 m is less than 20 m, so the point lies inside the permitted circle.' },
    { q: 'A goat tied by a 6 m rope wants to reach grass 6 m away from the post. Can it? (yes/no)', a: 'yes',
      why: 'The locus includes the boundary itself — at exactly 6 m the rope is straight but it just reaches.' },
  ];
  const c = pick(cases);
  return {
    type: 'locus-region', instruction: 'Inside or outside the locus?',
    question: c.q, answer: c.a, accepts: accepts(c.a),
    hints: hintLadder('The locus is the BOUNDARY; the region it encloses is everything nearer than that.',
      'Compare the distance given with the fixed distance in the rule.'),
    solution: { steps: [{ text: c.why, expr: c.a }], answer: c.a },
    misconceptions: [],
    verify: { kind: 'text', value: c.a },
  };
}


// ---- G9: circle theorems (introduction) — CRITICAL -------------------------
// Was a legacy one-liner. Circle theorems are a small set of rules that must
// be NAMED and then applied; the naming is half the skill, because an exam
// asks "giving reasons".
export function buildCircleTheorems() {
  const kind = pick(['centre', 'semicircle', 'same-segment', 'cyclic', 'tangent', 'name']);

  if (kind === 'centre') {
    const circ = randInt(20, 75);
    const value = 2 * circ;
    return {
      type: 'circle-centre', instruction: 'Use the angle-at-the-centre theorem.',
      question: `An angle at the circumference of a circle is ${circ}°, standing on the same arc as an angle at the centre. Find the angle at the CENTRE.`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}°`),
      hints: hintLadder(
        'There is a fixed relationship between an angle at the centre and one at the circumference on the SAME arc.',
        'The angle at the centre is twice the angle at the circumference.',
        `So double ${circ}°.`),
      solution: { steps: [
        { text: 'Angle at the centre = 2 × angle at the circumference (same arc).', expr: `2 × ${circ}°` },
        { text: 'Evaluate.', expr: `${value}°` }], answer: `${value}` },
      misconceptions: [
        { when: `${Math.round(circ / 2)}`, feedback: 'You halved instead of doubling. The CENTRE angle is the bigger one — it is twice the circumference angle.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'semicircle') {
    const other = randInt(25, 65);
    const askRight = coin();
    const value = askRight ? 90 : 90 - other;
    return {
      type: 'circle-semicircle', instruction: 'Use the angle-in-a-semicircle theorem.',
      question: askRight
        ? 'A triangle is drawn in a circle with one side as the DIAMETER. What is the angle at the circumference, opposite the diameter?'
        : `A triangle is drawn in a circle with the diameter as one side. One of the other angles is ${other}°. Find the third angle.`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}°`),
      hints: hintLadder(
        'A triangle standing on the diameter always has one special angle.',
        'The angle in a semicircle is a right angle.',
        askRight ? 'That is the whole answer.' : `So the three angles are 90°, ${other}° and the one you want — and they total 180°.`),
      solution: { steps: [
        { text: 'The angle in a semicircle is 90°.', expr: '90°' },
        ...(askRight ? [] : [{ text: 'Angles in a triangle sum to 180°.', expr: `180 − 90 − ${other} = ${value}°` }])], answer: `${value}` },
      misconceptions: askRight ? [
        { when: '180', feedback: '180° is a straight line. The angle standing on the diameter is a RIGHT angle, 90°.' },
      ] : [
        { when: `${180 - other}`, feedback: 'You forgot the right angle. The diameter forces a 90° angle, so subtract BOTH 90° and the given angle from 180°.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'same-segment') {
    const a = randInt(22, 70);
    return {
      type: 'circle-same-segment', instruction: 'Use the same-segment theorem.',
      question: `Two angles at the circumference of a circle stand on the same arc. One of them is ${a}°. Find the other.`,
      answer: `${a}`, accepts: accepts(`${a}`, `${a}°`),
      hints: hintLadder(
        'Both angles look at the same arc from the edge of the circle.',
        'Angles in the same segment, standing on the same arc, are equal.'),
      solution: { steps: [
        { text: 'Angles in the same segment are equal.', expr: `${a}°` }], answer: `${a}` },
      misconceptions: [
        { when: `${2 * a}`, feedback: 'Doubling is for the angle at the CENTRE. Two angles at the circumference on the same arc are simply EQUAL.' },
        { when: `${180 - a}`, feedback: 'Supplementary is for OPPOSITE angles of a cyclic quadrilateral. Same segment means equal.' },
      ],
      verify: { kind: 'fraction', value: a },
    };
  }

  if (kind === 'cyclic') {
    const a = randInt(60, 130);
    const value = 180 - a;
    return {
      type: 'circle-cyclic', instruction: 'Use the cyclic-quadrilateral theorem.',
      question: `A quadrilateral has all four vertices on a circle. One angle is ${a}°. Find the angle OPPOSITE it.`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}°`),
      hints: hintLadder(
        'All four corners lie on the circle — that is a cyclic quadrilateral.',
        'Opposite angles of a cyclic quadrilateral add up to 180°.',
        `So 180 − ${a}.`),
      solution: { steps: [
        { text: 'Opposite angles of a cyclic quadrilateral are supplementary.', expr: `${a}° + x = 180°` },
        { text: 'Solve.', expr: `x = ${value}°` }], answer: `${value}` },
      misconceptions: [
        { when: `${a}`, feedback: 'Equal angles come from the SAME SEGMENT. In a cyclic quadrilateral, opposite angles ADD to 180°.' },
        { when: `${360 - a}`, feedback: 'Opposite angles sum to 180°, not 360°.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'tangent') {
    const r = randInt(20, 70);
    const askAngle = coin();
    const value = askAngle ? 90 : 90 - r;
    return {
      type: 'circle-tangent', instruction: 'Use the tangent–radius theorem.',
      question: askAngle
        ? 'A tangent touches a circle at point P, and the radius OP is drawn. What is the angle between the tangent and the radius?'
        : `A tangent touches a circle at P and the radius OP is drawn. A chord from P makes an angle of ${r}° with the radius. What angle does the chord make with the tangent?`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}°`),
      hints: hintLadder(
        'Think about how a tangent meets the circle — it touches at exactly one point.',
        'A tangent is perpendicular to the radius at the point of contact.',
        askAngle ? 'That is the answer.' : `The radius and tangent make 90°, and ${r}° of it is taken by the chord.`),
      solution: { steps: [
        { text: 'Tangent ⊥ radius at the point of contact.', expr: '90°' },
        ...(askAngle ? [] : [{ text: 'Subtract the part the chord already takes.', expr: `90 − ${r} = ${value}°` }])], answer: `${value}` },
      misconceptions: [],
      verify: { kind: 'fraction', value },
    };
  }

  // naming the theorem — exams ask for the REASON, not just the number
  const cases = [
    { q: 'Two angles at the circumference stand on the same arc. What can you say about them? (one word)', a: 'equal',
      why: 'Angles in the same segment, standing on the same arc, are equal.' },
    { q: 'What is the size, in degrees, of the angle in a semicircle?', a: '90',
      why: 'The angle subtended by a diameter at the circumference is always a right angle.' },
    { q: 'Opposite angles of a cyclic quadrilateral add up to how many degrees?', a: '180',
      why: 'Opposite angles of a cyclic quadrilateral are supplementary.' },
    { q: 'At the point where a tangent touches a circle, what angle does it make with the radius?', a: '90',
      why: 'A tangent is perpendicular to the radius at the point of contact.' },
    { q: 'The angle at the centre is how many times the angle at the circumference on the same arc?', a: '2',
      why: 'The angle at the centre is twice the angle at the circumference standing on the same arc.' },
  ];
  const c = pick(cases);
  return {
    type: 'circle-theorem-name', instruction: 'Recall the theorem.',
    question: c.q, answer: c.a, accepts: accepts(c.a, `${c.a}°`),
    hints: hintLadder('Picture the diagram this theorem belongs to and what stays fixed in it.',
      'These are the five circle theorems — each ties an angle to a specific feature: arc, diameter, tangent or centre.'),
    solution: { steps: [{ text: c.why, expr: c.a }], answer: c.a },
    misconceptions: [],
    verify: { kind: 'text', value: c.a },
  };
}

// ---- G9: trigonometry word problems ---------------------------------------
// Angle of elevation / depression — the applied half of SOH CAH TOA, and the
// place students actually lose marks: choosing the wrong ratio for the sides
// they were given.
export function buildTrigProblems() {
  const angle = pick([30, 45, 60]);
  const kind = pick(['elevation-height', 'depression-distance', 'ladder', 'find-angle']);
  const rad = angle * Math.PI / 180;
  const r1d = (x) => Math.round(x * 10) / 10;

  if (kind === 'elevation-height') {
    const d = randInt(10, 60);
    const value = r1d(d * Math.tan(rad));
    return {
      type: 'trig-elevation', instruction: 'Draw the right-angled triangle first.',
      question: `From a point ${d} m from the foot of a tower, the angle of elevation of the top is ${angle}°. Find the height of the tower. (1 d.p.)`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}m`),
      hints: hintLadder(
        'Sketch it: the tower is vertical, the ground is horizontal, and your line of sight is the slope.',
        `Relative to the ${angle}° angle, the ground (${d} m) is ADJACENT and the height is OPPOSITE.`,
        'Opposite and adjacent together means tangent: height = d × tan(angle).'),
      solution: { steps: [
        { text: 'Opposite (height) and adjacent (ground) → use tan.', expr: `tan ${angle}° = h / ${d}` },
        { text: 'Rearrange and evaluate.', expr: `h = ${d} × tan ${angle}° = ${value} m` }], answer: `${value}` },
      misconceptions: [
        { when: `${r1d(d * Math.sin(rad))}`, feedback: 'sin uses the HYPOTENUSE. Here you were given the adjacent side and want the opposite, so it is tan.' },
      ],
      verify: { kind: 'fraction', value: d * Math.tan(rad), tol: 0.11 },
    };
  }

  if (kind === 'depression-distance') {
    const h = randInt(15, 80);
    const value = r1d(h / Math.tan(rad));
    return {
      type: 'trig-depression', instruction: 'Angle of depression equals the angle of elevation from below.',
      question: `From the top of a cliff ${h} m high, the angle of depression of a boat at sea is ${angle}°. How far is the boat from the foot of the cliff? (1 d.p.)`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}m`),
      hints: hintLadder(
        'The angle of depression from the top equals the angle of elevation from the boat — alternate angles.',
        `In that triangle the cliff (${h} m) is OPPOSITE the ${angle}° angle and the sea distance is ADJACENT.`,
        'tan(angle) = opposite ÷ adjacent, so distance = height ÷ tan(angle).'),
      solution: { steps: [
        { text: 'Depression from the top = elevation from the boat.', expr: `${angle}°` },
        { text: 'Opposite over adjacent → tan.', expr: `tan ${angle}° = ${h} / d` },
        { text: 'Rearrange and evaluate.', expr: `d = ${h} ÷ tan ${angle}° = ${value} m` }], answer: `${value}` },
      misconceptions: [
        { when: `${r1d(h * Math.tan(rad))}`, feedback: 'You multiplied instead of dividing. The height is OPPOSITE the angle, so d = height ÷ tan(angle).' },
      ],
      verify: { kind: 'fraction', value: h / Math.tan(rad), tol: 0.11 },
    };
  }

  if (kind === 'ladder') {
    const L = randInt(4, 14);
    const askHeight = coin();
    const value = r1d(askHeight ? L * Math.sin(rad) : L * Math.cos(rad));
    return {
      type: 'trig-ladder', instruction: 'The ladder is the hypotenuse.',
      question: `A ladder ${L} m long leans against a wall, making an angle of ${angle}° with the ground. ${askHeight ? 'How high up the wall does it reach?' : 'How far is its foot from the wall?'} (1 d.p.)`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}m`),
      hints: hintLadder(
        'The ladder itself is the longest side — the hypotenuse.',
        askHeight ? 'The height up the wall is OPPOSITE the angle, and you know the hypotenuse.'
                  : 'The distance along the ground is ADJACENT to the angle, and you know the hypotenuse.',
        askHeight ? 'Opposite with hypotenuse → sin.' : 'Adjacent with hypotenuse → cos.'),
      solution: { steps: [
        { text: askHeight ? 'Opposite and hypotenuse → sin.' : 'Adjacent and hypotenuse → cos.',
          expr: `${askHeight ? 'sin' : 'cos'} ${angle}° = x / ${L}` },
        { text: 'Rearrange and evaluate.', expr: `x = ${L} × ${askHeight ? 'sin' : 'cos'} ${angle}° = ${value} m` }], answer: `${value}` },
      misconceptions: [
        { when: `${r1d(askHeight ? L * Math.cos(rad) : L * Math.sin(rad))}`,
          feedback: askHeight ? 'That is the distance along the GROUND. Height is opposite the angle, so use sin.' : 'That is the height up the WALL. The ground distance is adjacent, so use cos.' },
      ],
      verify: { kind: 'fraction', value: askHeight ? L * Math.sin(rad) : L * Math.cos(rad), tol: 0.11 },
    };
  }

  // find the angle from two sides (a 3-4-5 style triangle keeps it exact-ish)
  const [o, a] = pick([[3, 4], [6, 8], [5, 12], [8, 15]]);
  const value = Math.round(Math.atan(o / a) * 180 / Math.PI);
  return {
    type: 'trig-find-angle', instruction: 'Find the angle.',
    question: `A ramp rises ${o} m over a horizontal distance of ${a} m. Find the angle it makes with the ground, to the nearest degree.`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}°`),
    hints: hintLadder(
      'You have the rise (opposite) and the horizontal run (adjacent).',
      'Opposite over adjacent is tan, so tan(angle) = rise ÷ run.',
      `Work out ${o} ÷ ${a}, then use tan⁻¹ (inverse tan) on your calculator.`),
    solution: { steps: [
      { text: 'Opposite over adjacent → tan.', expr: `tan θ = ${o}/${a}` },
      { text: 'Take the inverse tangent.', expr: `θ = tan⁻¹(${(o / a).toFixed(3)}) ≈ ${value}°` }], answer: `${value}` },
    misconceptions: [
      { when: `${Math.round(Math.atan(a / o) * 180 / Math.PI)}`, feedback: 'You divided the wrong way round. tan = OPPOSITE ÷ ADJACENT — rise over run.' },
    ],
    verify: { kind: 'fraction', value, tol: 1.1 },
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
  G9_LOCI:                withWorkedExample(buildLoci),
  G9_CIRCLE_THEOREMS_INTRO: withWorkedExample(buildCircleTheorems),
  G9_TRIG_PROBLEMS:       withWorkedExample(buildTrigProblems),
};

export const GEOMETRY_SKILL_IDS = Object.keys(GEOMETRY_CONTENT);
