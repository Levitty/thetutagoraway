// ============================================================================
// THE 18 SKILLS THAT DID NOT TEACH THEIR LABEL (engine evaluation, 5 Nov 2026).
//
// Every answer was right, so every check passed, while Grade 7 Temperature asked
// "10 + 1". These families are `core`: they are the skill's own content from now
// on and are served without waiting for review, because the alternative is to
// keep serving the wrong thing. A person should still read them first: they are
// page 00 of the review pack.
//
// Skills in REPLACED_SKILLS lost their old generator, which is removed. The rest
// keep what was right and gain what the label promised.
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family, round, commas } from './core.js';
import { person, sh, price, route } from './kenya.js';

const fx = (def) => family({ core: true, reviewed: false, ...def });

export const REPLACED_SKILLS = new Set(['G9_APPROX_ERRORS', 'G8_SCALE_DRAWING', 'G6_3D_OBJECTS', 'G6_INEQUALITIES', 'G6_MONEY', 'G6_ANGLE_MEASURE', 'G6_MASS', 'G5_MONEY', 'G9_SPEED_VELOCITY', 'G9_PROBABILITY_ADV']);

const SOLIDS = [
  { name: 'cube', eg: 'a dice', f: 6, e: 12, v: 8 }, { name: 'cuboid', eg: 'a closed maize-flour carton', f: 6, e: 12, v: 8 },
  { name: 'square-based pyramid', eg: 'a model of a pyramid', f: 5, e: 8, v: 5 }, { name: 'triangular prism', eg: 'a tent', f: 5, e: 9, v: 6 },
];
const NETS = [
  { solid: 'cube', right: 'Six equal squares', wrong: [['Four equal squares', 'A cube has six faces. Four squares would leave two faces open.'], ['Six equal rectangles of different sizes', 'All the faces of a cube are the same size.'], ['Two circles and a rectangle', 'That net folds into a cylinder.']] },
  { solid: 'cylinder', right: 'Two circles and a rectangle', wrong: [['Six equal squares', 'That net folds into a cube.'], ['One circle and a sector', 'That net folds into a cone.'], ['Three rectangles and two triangles', 'That net folds into a triangular prism.']] },
  { solid: 'cone', right: 'One circle and a sector', wrong: [['Two circles and a rectangle', 'That net folds into a cylinder.'], ['A square and four triangles', 'That net folds into a square-based pyramid.'], ['Six equal squares', 'That net folds into a cube.']] },
  { solid: 'square-based pyramid', right: 'A square and four triangles', wrong: [['One circle and a sector', 'That net folds into a cone.'], ['Two squares and four rectangles', 'That net folds into a cuboid.'], ['Three rectangles and two triangles', 'That net folds into a triangular prism.']] },
  { solid: 'triangular prism', right: 'Three rectangles and two triangles', wrong: [['A square and four triangles', 'That net folds into a square-based pyramid.'], ['Two squares and four rectangles', 'That net folds into a cuboid.'], ['Two circles and a rectangle', 'That net folds into a cylinder.']] },
];

export const CORE_FAMILIES = [
  // ---- G7_TEMPERATURE: the authored Celsius and kelvin content was hidden behind an alias (removed).
  fx({ id: 'g7.temp.mountain-nairobi', skill: 'G7_TEMPERATURE', outcome: 'G7.TEMP.b', rung: 2, form: 'word',
    draw: () => ({ low: -randInt(2, 9), high: randInt(12, 26) }),
    make: ({ low, high }) => ({
      question: `At dawn it is ${low} °C near the top of Mount Kenya and ${high} °C in Nairobi. How many degrees warmer is Nairobi?`,
      answer: high - low,
      wrong: [[high + low, 'The two temperatures are on opposite sides of zero. Count up to zero, then on to the warmer one.'], [Math.abs(low), 'That is only the part below zero. Keep going up to the Nairobi temperature.'], [high, 'That is the Nairobi temperature. The question asks how far apart the two are.']],
      hints: ['Picture a thermometer with both temperatures marked on it.', `From ${low} °C up to 0 °C, then from 0 °C up to ${high} °C.`],
      steps: [`From ${low} °C up to 0 °C is ${-low} degrees.`, `From 0 °C up to ${high} °C is ${high} degrees.`, `Altogether: ${-low} + ${high} = ${high - low} degrees.`],
    }),
    check: ({ low, high }, a) => low + a === high }),
  fx({ id: 'g7.temp.kelvin-drop', skill: 'G7_TEMPERATURE', outcome: 'G7.TEMP.d', rung: 3, form: 'why',
    draw: () => { const a = randInt(40, 100), b = randInt(5, 37); return { a, b }; },
    make: ({ a, b }) => {
      const drop = a - b;
      return { question: `Boiled milk at ${a} °C cools to ${b} °C. A learner says the fall in kelvin is ${drop + 273} K, because you always add 273 to change to kelvin. Why is that wrong?`,
        options: [
          { text: `A change of 1 °C is the same size as a change of 1 K, so the fall is ${drop} K`, right: true },
          { text: 'Kelvin is always smaller than Celsius, so you must subtract 273', right: false, why: 'Kelvin readings are bigger than Celsius readings. And the question is about a change, not a reading.' },
          { text: 'Milk cannot be measured in kelvin', right: false, why: 'Any temperature can be written in kelvin.' },
          { text: `The fall should be ${drop - 273 > 0 ? drop - 273 : 273 - drop} K, found by taking away 273`, right: false, why: 'Adding or taking away 273 changes a reading. A difference between two readings stays the same on both scales.' },
        ],
        hints: ['Change each reading to kelvin, then find the difference.', `${a + 273} K and ${b + 273} K: how far apart are they?`],
        steps: [`In kelvin the readings are ${a + 273} K and ${b + 273} K.`, `The fall is ${a + 273} − ${b + 273} = ${drop} K, the same number as in °C.`] };
    } }),
  fx({ id: 'g7.temp.order-scales', skill: 'G7_TEMPERATURE', outcome: 'G7.TEMP.d', rung: 2, form: 'direct',
    draw: () => { const k = randInt(278, 300), c1 = randInt(1, 35), c2 = randInt(1, 35); const v = [k - 273, c1, c2]; return new Set(v).size === 3 ? { k, c1, c2 } : null; },
    make: ({ k, c1, c2 }) => {
      const vals = [{ t: `${k} K`, v: k - 273 }, { t: `${c1} °C`, v: c1 }, { t: `${c2} °C`, v: c2 }];
      const hottest = [...vals].sort((a, b) => b.v - a.v)[0];
      return { question: `Which of these temperatures is the hottest: ${k} K, ${c1} °C or ${c2} °C?`, story: false,
        options: vals.map(x => ({ text: x.t, right: x === hottest, why: x === hottest ? undefined : `Change them all to the same scale first. ${k} K is ${k - 273} °C.` })),
        hints: ['Two scales cannot be compared until they are the same.', `Take 273 from the kelvin reading.`],
        steps: [`${k} K = ${k} − 273 = ${k - 273} °C.`, `Now compare ${k - 273} °C, ${c1} °C and ${c2} °C: the hottest is ${hottest.t}.`] };
    } }),

  // ---- G9_APPROX_ERRORS: approximations and errors, not percentage change
  fx({ id: 'g9.approx.percent-error', skill: 'G9_APPROX_ERRORS', outcome: 'G9.APPROX.c', rung: 2, form: 'word',
    draw: () => { const actual = pick([50, 80, 90, 120, 160, 200, 250]); const est = actual + pick([-1, 1]) * pick([2, 4, 5, 8, 10]); const e = Math.abs(est - actual), pct = (e / actual) * 100; const v = [round((e / est) * 100, 1), e, round((est / actual) * 100, 1)]; return Number.isInteger(pct * 10) && new Set(v).size === 3 && !v.includes(round(pct, 1)) ? { actual, est } : null; },
    make: ({ actual, est }) => {
      const e = Math.abs(est - actual), pct = round((e / actual) * 100, 1);
      return { question: `A bag of maize has a true mass of ${actual} kg. A trader estimates it as ${est} kg. Find the percentage error.`,
        answer: pct,
        wrong: [[round((e / est) * 100, 1), 'Percentage error divides by the true value, not by the estimate.'], [e, 'That is the error in kg. Now write it as a percentage of the true mass.'], [round((est / actual) * 100, 1), 'That compares the estimate with the true value. First find the error: the difference between them.']],
        hints: ['Error = the difference between the estimate and the true value.', `Percentage error = error ÷ true value × 100.`],
        steps: [`Error = ${Math.max(est, actual)} − ${Math.min(est, actual)} = ${e} kg.`, `Percentage error = ${e} ÷ ${actual} × 100 = ${pct}%.`] };
    },
    check: ({ actual, est }, a) => Math.abs((a / 100) * actual - Math.abs(est - actual)) < 0.06 }),
  fx({ id: 'g9.approx.greatest-error', skill: 'G9_APPROX_ERRORS', outcome: 'G9.APPROX.b', rung: 1, form: 'word',
    draw: () => (() => { const c = pick([{ unit: 'cm', step: 1, label: 'the nearest cm', what: 'A plank' }, { unit: 'kg', step: 1, label: 'the nearest kg', what: 'A sack of potatoes' }, { unit: 'm', step: 10, label: 'the nearest 10 m', what: 'A school field' }, { unit: 'g', step: 100, label: 'the nearest 100 g', what: 'A bag of beans' }, { unit: 'cm', step: 0.1, label: 'the nearest 0.1 cm', what: 'A nail' }]); return { ...c, n: randInt(3, 40) }; })(),
    make: ({ unit, step, label, what, n }) => {
      const value = round(n * step, 1);
      return { question: `${what} is recorded as ${value} ${unit}, measured to ${label}. What is the greatest possible error, in ${unit}?`,
        answer: round(step / 2, 2),
        wrong: [[step, 'That is the whole measuring step. The true value can be at most half a step away.'], [round(value / 2, 2), 'The error depends on the step used to measure, not on the size of the reading.'], [round(step / 4, 3), 'The greatest error is half of the step, not a quarter.']],
        hints: ['A reading is rounded to the closest mark of the measuring step.', 'How far can a true value be from the closest mark?'],
        steps: [`The measuring step is ${step} ${unit}.`, `The greatest possible error is half of that: ${step} ÷ 2 = ${round(step / 2, 2)} ${unit}.`] };
    },
    check: ({ step }, a) => Math.abs(a * 2 - step) < 1e-9 }),
  fx({ id: 'g9.approx.estimate-product', skill: 'G9_APPROX_ERRORS', outcome: 'G9.APPROX.a', rung: 1, form: 'direct',
    draw: () => { const a = randInt(21, 89), b = randInt(21, 89); return a % 10 >= 2 && a % 10 <= 8 && b % 10 >= 2 && b % 10 <= 8 && a % 10 !== 5 && b % 10 !== 5 ? { a: a + pick([0.3, 0.7]), b: b + pick([0.2, 0.6]) } : null; },
    make: ({ a, b }) => {
      const ra = Math.round(a / 10) * 10, rb = Math.round(b / 10) * 10;
      return { question: `Estimate ${a} × ${b} by rounding each number to the nearest ten.`, story: false,
        answer: ra * rb,
        wrong: [[round(a * b, 2), 'That is the exact product. An estimate rounds first, then multiplies.'], [(Math.floor(a / 10) * 10) * (Math.floor(b / 10) * 10), 'Both numbers were rounded down. Look at the units digit to decide.'], [ra + rb, 'The question is a multiplication, so multiply the rounded numbers.']],
        hints: ['Round first, then multiply.', `${a} is closest to which ten?`],
        steps: [`${a} rounds to ${ra} and ${b} rounds to ${rb}.`, `${ra} × ${rb} = ${commas(ra * rb)}.`] };
    },
    check: ({ a, b }, v) => Math.abs(v - a * b) < 0.2 * a * b + 200 && v % 100 === 0 }),
  fx({ id: 'g9.approx.better-measure', skill: 'G9_APPROX_ERRORS', outcome: 'G9.APPROX.c', rung: 3, form: 'why',
    draw: () => { const m1 = pick([50, 100, 200, 250]), e1 = pick([1, 2, 5]), m2 = pick([2, 4, 5, 10]), e2 = pick([100, 200, 500]); const p1 = e1 / m1, p2 = (e2 / 1000) / m2; return p1 !== p2 ? { m1, e1, m2, e2, p1: p1 * 100, p2: p2 * 100 } : null; },
    make: ({ m1, e1, m2, e2, p1, p2 }) => {
      const firstBetter = p1 < p2;
      return { question: `Otieno weighs a sack of ${m1} kg with an error of ${e1} kg. Akinyi weighs a packet of ${m2} kg with an error of ${e2} g. Whose measurement is better, and why?`,
        options: [
          { text: `Otieno, because his percentage error is smaller`, right: firstBetter, why: firstBetter ? undefined : `Work out each error as a percentage of the true mass and compare.` },
          { text: `Akinyi, because her percentage error is smaller`, right: !firstBetter, why: firstBetter ? `Work out each error as a percentage of the true mass and compare.` : undefined },
          { text: 'Akinyi, because her error is written in grams', right: false, why: 'Changing the unit does not change the size of an error.' },
          { text: 'They are equally good, because both errors are small', right: false, why: 'Small is not enough. An error matters compared with the size of what was measured.' },
        ],
        hints: ['Compare each error with the size of what was measured.', 'Change both errors to kg, then find each as a percentage.'],
        steps: [`Otieno: ${e1} ÷ ${m1} × 100 = ${round(p1, 2)}%.`, `Akinyi: ${round(e2 / 1000, 2)} ÷ ${m2} × 100 = ${round(p2, 2)}%.`, `The smaller percentage is the better measurement: ${firstBetter ? 'Otieno' : 'Akinyi'}.`] };
    } }),

  // ---- G8_SCALE_DRAWING: scale, not "4 books cost 200"
  fx({ id: 'g8.scale.real-length', skill: 'G8_SCALE_DRAWING', outcome: 'G8.SCALE.b', rung: 1, form: 'word',
    draw: () => { const s = pick([5, 10, 20, 25, 50]), cm = randInt(3, 12); return { s, cm, what: pick(['A plot', 'A school field', 'A shamba', 'A church compound']) }; },
    make: ({ s, cm, what }) => ({
      question: `On a plan, 1 cm stands for ${s} m. ${what} measures ${cm} cm on that plan. How long is it in real life, in metres?`,
      answer: cm * s,
      wrong: [[cm + s, 'Each centimetre on the drawing stands for the full distance. Multiply, do not add.'], [round(s / cm, 2), 'The drawing is smaller than the real thing, so the real length must be bigger.'], [cm * s * 100, 'The scale already gives metres, so the answer is in metres with no change of unit.']],
      hints: ['What does 1 cm on the drawing stand for?', `There are ${cm} of those centimetres.`],
      steps: [`1 cm stands for ${s} m.`, `${cm} cm stands for ${cm} × ${s} = ${cm * s} m.`],
    }),
    check: ({ s, cm }, a) => a / s === cm }),
  fx({ id: 'g8.scale.on-paper', skill: 'G8_SCALE_DRAWING', outcome: 'G8.SCALE.j', rung: 2, form: 'word',
    draw: () => { const s = pick([10, 20, 25, 50]), cm = randInt(2, 14) ; return { s, cm, thing: pick(['road', 'wall', 'fence', 'water pipe']) }; },
    make: ({ s, cm, thing }) => ({
      question: `A map of a village uses a scale of 1 cm to ${s} m. A ${thing} is ${cm * s} m long. How long should it be on the map, in cm?`,
      answer: cm,
      wrong: [[cm * s * s, 'You multiplied again. To go from the real length to the map, divide by the scale.'], [cm * s - s, 'Taking away does not use a scale. How many lots of the scale fit in the length?'], [cm * s, 'That is the real length. The map must show something much shorter.']],
      hints: ['Going from real life to the map makes things smaller.', `How many lots of ${s} m are in ${cm * s} m?`],
      steps: [`Each ${s} m is 1 cm on the map.`, `${cm * s} ÷ ${s} = ${cm} cm.`],
    }),
    check: ({ s, cm }, a) => a * s === cm * s }),
  fx({ id: 'g8.scale.ratio-map', skill: 'G8_SCALE_DRAWING', outcome: 'G8.SCALE.j', rung: 3, form: 'steps',
    draw: () => { const [a, b, km] = route(); const scale = pick([1000000, 2000000, 500000]); const cm = (km * 100000) / scale; return Number.isInteger(cm * 10) && cm < 80 && cm > 2 ? { a, b, km, scale, cm } : null; },
    make: ({ a, b, km, scale, cm }) => ({
      question: `On a 1 : ${commas(scale)} map of Kenya, a ruler laid from ${a} to ${b} reads ${cm} cm.`,
      parts: [
        { prompt: 'How many cm of real distance does 1 cm on the map stand for?', answer: scale, hint: 'In a ratio scale, both numbers are in the same unit.', wrong: [[1, 'Read the second number of the scale.']] },
        { prompt: `How many cm is ${cm} cm on the map in real life?`, answer: cm * scale, hint: `${cm} × ${commas(scale)}`, wrong: [[cm + scale, 'Each map centimetre stands for the whole amount: multiply.']] },
        { prompt: 'How many km is that?', answer: km, unit: 'km', hint: 'There are 100,000 cm in 1 km.', wrong: [[cm * scale / 1000, 'That divides by 1,000. From cm to km you divide by 100,000.']] },
      ],
      steps: [`1 cm on the map is ${commas(scale)} cm in real life.`, `${cm} × ${commas(scale)} = ${commas(cm * scale)} cm.`, `${commas(cm * scale)} ÷ 100,000 = ${km} km.`],
    }),
    check: ({ scale, cm, km }, v) => v[0] === scale && v[1] === cm * scale && v[2] * 100000 === cm * scale }),

  // ---- G6_3D_OBJECTS: faces, edges, vertices and nets, not volume (alias removed)
  fx({ id: 'g6.solids.count', skill: 'G6_3D_OBJECTS', outcome: 'G6.3D.a', rung: 1, form: 'direct',
    draw: () => { const s = pick(SOLIDS), part = pick(['faces', 'edges', 'vertices']); return s.f === s.v && part !== 'edges' ? null : { s, part }; },
    make: ({ s, part }) => {
      const a = part === 'faces' ? s.f : part === 'edges' ? s.e : s.v;
      const others = { faces: [s.e, s.v], edges: [s.f, s.v], vertices: [s.f, s.e] }[part];
      return { question: `How many ${part} does a ${s.name} have? Think of ${s.eg}.`, answer: a, story: false,
        wrong: [[others[0], `That is the number of ${part === 'faces' ? 'edges' : 'faces'}. ${part === 'vertices' ? 'Vertices are the corners.' : part === 'edges' ? 'Edges are where two faces meet.' : 'Faces are the flat surfaces.'}`], [others[1], `Check which part you counted. ${part === 'faces' ? 'Faces are the flat surfaces.' : 'Vertices are the corners.'}`], [a + 1, 'Hold the object or picture it, and count each one once.']],
        hints: ['Faces are flat surfaces, edges are where two faces meet, vertices are corners.', `Picture ${s.eg} and count the ${part}, one at a time.`],
        steps: [`A ${s.name} has ${s.f} faces, ${s.e} edges and ${s.v} vertices.`, `So it has ${a} ${part}.`] };
    },
    check: ({ s, part }, a) => s.f + s.v - s.e === 2 && a === { faces: s.f, edges: s.e, vertices: s.v }[part] }),
  fx({ id: 'g6.solids.net', skill: 'G6_3D_OBJECTS', outcome: 'G6.3D.a', rung: 2, form: 'direct',
    draw: () => ({ n: pick(NETS), k: randInt(0, 3) }),
    make: ({ n, k }) => {
      const opts = [{ text: n.right, right: true }, ...n.wrong.map(([text, why]) => ({ text, right: false, why }))];
      return { question: `A net folds up to make a ${n.solid}. Which shapes does the net contain?`, story: false, options: [...opts.slice(k), ...opts.slice(0, k)],
        hints: ['A net is the solid opened out flat. Each face becomes one shape.', `List the faces of a ${n.solid}.`],
        steps: [`Open a ${n.solid} out flat and look at each face.`, `Its net contains: ${n.right.toLowerCase()}.`] };
    } }),
  fx({ id: 'g6.solids.wire-frame', skill: 'G6_3D_OBJECTS', outcome: 'G6.3D.a', rung: 3, form: 'word',
    draw: () => ({ side: pick([10, 12, 15, 20, 25, 30]), p: person() }),
    make: ({ side, p }) => ({
      question: `${p.name} makes the frame of a cube from wire, with edges of ${side} cm. How much wire does ${p.she} need, in cm?`,
      answer: 12 * side,
      wrong: [[6 * side, 'That counts 6 faces. Wire runs along the edges, and a cube has 12 edges.'], [8 * side, 'That counts 8 corners. Wire runs along the edges.'], [4 * side, 'That is the wire around one face only.']],
      hints: ['The wire follows the edges of the cube.', 'How many edges does a cube have?'],
      steps: ['A cube has 12 edges.', `Wire needed: 12 × ${side} = ${12 * side} cm.`],
    }),
    check: ({ side }, a) => a % side === 0 && a / side === 6 + 8 - 2 }),

  // ---- G6_INEQUALITIES: form and solve, not 725147 ☐ 611943
  fx({ id: 'g6.ineq.solve-add', skill: 'G6_INEQUALITIES', outcome: 'G6.INEQ.c', rung: 1, form: 'direct',
    draw: () => ({ b: randInt(2, 15), c: randInt(16, 40), v: pick(['x', 'y', 'm', 'p']), sym: pick(['>', '<']) }),
    make: ({ b, c, v, sym }) => {
      const r = c - b, right = `${v} ${sym} ${r}`;
      return { question: `Solve: ${v} + ${b} ${sym} ${c}. Which answer is right?`, story: false,
        options: [{ text: right, right: true }, { text: `${v} ${sym} ${c + b}`, right: false, why: `You added ${b}. To undo + ${b}, take ${b} from both sides.` }, { text: `${v} ${sym === '>' ? '<' : '>'} ${r}`, right: false, why: 'Taking away the same number from both sides keeps the sign as it was.' }, { text: `${v} = ${r}`, right: false, why: 'An inequality has many answers. The symbol must stay.' }],
        hints: ['Treat it like an equation, and keep the symbol.', `Take ${b} from both sides.`],
        steps: [`${v} + ${b} ${sym} ${c}`, `${v} ${sym} ${c} − ${b}`, `${right}`] };
    } }),
  fx({ id: 'g6.ineq.form-matatu', skill: 'G6_INEQUALITIES', outcome: 'G6.INEQ.a', rung: 2, form: 'word',
    draw: () => { const cap = pick([14, 18, 25, 33, 41]); return { cap, on: randInt(3, cap - 3) }; },
    make: ({ cap, on }) => ({
      question: `A matatu can carry at most ${cap} passengers. There are ${on} on board and p more get on. Which inequality fits?`,
      options: [{ text: `${on} + p ≤ ${cap}`, right: true }, { text: `${on} + p ≥ ${cap}`, right: false, why: '"At most" means the total cannot go above the limit.' }, { text: `${on} + p > ${cap}`, right: false, why: 'Greater than the limit would be overloading.' }, { text: `p ≤ ${cap}`, right: false, why: `There are already ${on} on board, so they count too.` }],
      hints: ['"At most" means no more than.', 'Passengers on board plus those getting on must stay within the limit.'],
      steps: [`Total passengers: ${on} + p.`, `"At most ${cap}" means ≤ ${cap}.`, `So ${on} + p ≤ ${cap}.`],
    }) }),
  fx({ id: 'g6.ineq.most-tickets', skill: 'G6_INEQUALITIES', outcome: 'G6.INEQ.c', rung: 3, form: 'word',
    draw: () => { const cost = pick([30, 40, 50, 60, 80]), money = cost * randInt(4, 12) + randInt(1, cost - 1); return { cost, money, p: person() }; },
    make: ({ cost, money, p }) => {
      const a = Math.floor(money / cost);
      return { question: `A bus ticket costs ${sh(cost)}. ${p.name} has ${sh(money)}. If ${p.she} buys t tickets, then ${cost}t ≤ ${money}. What is the largest number of tickets ${p.she} can buy?`,
        answer: a,
        wrong: [[a + 1, `That many tickets cost more than ${sh(money)}. Check by multiplying.`], [money - cost, 'Take away gives money left after one ticket. Divide to find how many tickets fit.'], [round(money / cost, 1), 'Tickets are whole. Keep only the whole number that still fits.']],
        hints: [`Divide ${money} by ${cost}.`, 'A part of a ticket cannot be bought.'],
        steps: [`${money} ÷ ${cost} is between ${a} and ${a + 1}.`, `${a} tickets cost ${sh(a * cost)}, which is within ${sh(money)}.`, `${a + 1} tickets cost ${sh((a + 1) * cost)}, which is too much. So the largest is ${a}.`] };
    },
    check: ({ cost, money }, a) => a * cost <= money && (a + 1) * cost > money }),

  // ---- G6_MONEY: budget, profit and loss, taxes
  fx({ id: 'g6.money.budget-left', skill: 'G6_MONEY', outcome: 'G6.MONEY.a', rung: 1, form: 'word',
    draw: () => { const inc = pick([8000, 9000, 12000, 15000, 20000]), f = inc * pick([0.4, 0.5]), r = inc * pick([0.1, 0.2]), t = pick([800, 1200, 1500]), s = pick([500, 700, 900]); const left = inc - f - r - t - s; return left > 0 ? { inc, f, r, t, s, p: person() } : null; },
    make: ({ inc, f, r, t, s, p }) => {
      const left = inc - f - r - t - s;
      return { question: `${p.name}'s family plans a monthly budget. Income is ${sh(inc)}. Food ${sh(f)}, rent ${sh(r)}, transport ${sh(t)} and school costs ${sh(s)}. How much is left to save?`,
        answer: left,
        wrong: [[f + r + t + s, 'That is the total spending. What is left over after spending?'], [inc - f - r, 'Two items were left out. Take away every item in the budget.'], [inc + f + r + t + s - 2 * s, 'Spending comes off the income, so subtract each item.']],
        hints: ['A budget compares money in with money planned to go out.', 'Add up the spending, then take it from the income.'],
        steps: [`Total spending: ${commas(f)} + ${commas(r)} + ${commas(t)} + ${commas(s)} = ${sh(f + r + t + s)}.`, `Left: ${commas(inc)} − ${commas(f + r + t + s)} = ${sh(left)}.`] };
    },
    check: ({ inc, f, r, t, s }, a) => a + f + r + t + s === inc }),
  fx({ id: 'g6.money.profit-loss', skill: 'G6_MONEY', outcome: 'G6.MONEY.c', rung: 2, form: 'word',
    draw: () => { const item = pick(['hen', 'radio', 'bag of maize', 'sack of potatoes', 'goat']); const buy = price(item); const change = pick([-1, 1]) * pick([100, 150, 200, 250, 300, 500]); const sell = buy + change; return sell > 0 ? { item, buy, sell, p: person() } : null; },
    make: ({ item, buy, sell, p }) => {
      const gain = sell > buy;
      return { question: `${p.name} buys a ${item} for ${sh(buy)} and sells it for ${sh(sell)}. What is the ${gain ? 'profit' : 'loss'}, in shillings?`,
        answer: Math.abs(sell - buy),
        wrong: [[buy + sell, 'Adding gives the two prices together. Compare them: take the smaller from the bigger.'], [gain ? sell : buy, 'That is one of the prices. The question asks for the difference.'], [Math.abs(sell - buy) * 2, 'Check your subtraction: the difference is found only once.']],
        hints: ['Is the selling price more or less than the buying price?', 'The difference between the two prices is the profit or loss.'],
        steps: [`Selling price ${sh(sell)}, buying price ${sh(buy)}.`, `${gain ? 'Profit' : 'Loss'} = ${commas(Math.max(buy, sell))} − ${commas(Math.min(buy, sell))} = ${sh(Math.abs(sell - buy))}.`] };
    },
    check: ({ buy, sell }, a) => (sell > buy ? buy + a === sell : sell + a === buy) }),
  fx({ id: 'g6.money.tax-type', skill: 'G6_MONEY', outcome: 'G6.MONEY.e', rung: 1, form: 'direct',
    draw: () => (() => { const list = [['a shopper pays on top of the price of goods in a shop', 'Value added tax (VAT)'], ["is taken from a worker's salary each month", 'Pay As You Earn (PAYE)'], ['a trader pays on goods brought into Kenya from another country', 'Import duty'], ['a shop owner pays the county each year to run a business', 'A business permit fee']]; const [q, right] = pick(list); return { q, right, all: list.map(x => x[1]), k: randInt(0, 3) }; })(),
    make: ({ q, right, all, k }) => {
      const opts = all.map(text => ({ text, right: text === right, why: text === right ? undefined : `${text} is paid in a different situation. Read who pays it and when.` }));
      return { question: `Which of these does this describe: a charge that ${q}?`, story: false, options: [...opts.slice(k), ...opts.slice(0, k)],
        hints: ['Think about who pays, and what for.', 'Taxes and fees pay for roads, schools and clinics.'],
        steps: [`${right} is the charge that ${q}.`, 'Government uses taxes and fees to pay for public services.'] };
    } }),

  // ---- G6_ANGLE_MEASURE: reading a protractor, as far as a phone can test it
  fx({ id: 'g6.angle.protractor-read', skill: 'G6_ANGLE_MEASURE', outcome: 'G6.ANGLES.b', rung: 1, form: 'direct',
    draw: () => { const a = randInt(2, 17) * 10 + pick([0, 5]); return { a }; },
    make: ({ a }) => ({
      question: `A protractor's centre is on the point of an angle. One arm lies on the 0 mark, and the other arm crosses the scale at ${a}°. How big is the angle, in degrees?`, story: false,
      answer: a,
      wrong: [[180 - a, 'That reads the other scale. Start from the 0 your first arm lies on.'], [a + 10, 'Read the exact mark, counting from 0.'], [360 - a, 'That is the reflex angle. A protractor reading from 0 gives the angle itself.']],
      hints: ['Count from the 0 that one arm lies on.', 'Read where the second arm crosses that same scale.'],
      steps: ['One arm is on 0, so the reading is the size of the angle.', `The angle is ${a}°.`],
    }),
    check: ({ a }, v) => v + (180 - a) === 180 }),
  fx({ id: 'g6.angle.protractor-diff', skill: 'G6_ANGLE_MEASURE', outcome: 'G6.ANGLES.b', rung: 2, form: 'direct',
    draw: () => { const a = randInt(1, 8) * 10, b = randInt(10, 17) * 10; return b - a >= 20 ? { a, b } : null; },
    make: ({ a, b }) => ({
      question: `Baraka did not line his protractor up with 0. He reads ${a}° for one arm and ${b}° for the other, on the same scale. How big is the angle between them?`, story: false,
      answer: b - a,
      wrong: [[b, 'The first arm is not on 0, so the reading alone is not the angle.'], [a + b, 'The angle is the gap between the two readings.'], [180 - b, 'Find the gap between the two marks on the same scale.']],
      hints: ['The angle is the gap between the two marks.', 'Take the smaller reading from the bigger one.'],
      steps: [`The two arms are at ${a}° and ${b}°.`, `Gap: ${b} − ${a} = ${b - a}°.`],
    }),
    check: ({ a, b }, v) => a + v === b }),
  fx({ id: 'g6.angle.which-scale', skill: 'G6_ANGLE_MEASURE', outcome: 'G6.ANGLES.b', rung: 3, form: 'why',
    draw: () => { const a = randInt(3, 8) * 10 + pick([0, 5]); return { a, p: person() }; },
    make: ({ a, p }) => ({
      question: `An acute angle is measured with a protractor. The arm crosses the marks ${a} and ${180 - a}. ${p.name} says the angle is ${180 - a}°. Why is ${p.she} wrong?`,
      options: [{ text: `An acute angle is less than 90°, so it must be ${a}°`, right: true }, { text: 'A protractor only reads up to 90°', right: false, why: 'A protractor reads up to 180°. Look at what kind of angle this is.' }, { text: `The two marks must be added to give ${a + 180 - a}°`, right: false, why: 'The two marks are two scales for the same arm. Only one is right.' }, { text: 'Angles must be measured in centimetres', right: false, why: 'Angles are measured in degrees.' }],
      hints: ['What does "acute" tell you about the size?', 'A protractor has two scales. Which reading is possible?'],
      steps: ['An acute angle is less than 90°.', `Of ${a}° and ${180 - a}°, only ${a}° is less than 90°.`],
    }) }),

  // ---- G6_MASS: tonnes, as the design says
  fx({ id: 'g6.mass.to-kg', skill: 'G6_MASS', outcome: 'G6.MASS.a', rung: 1, form: 'word',
    draw: () => { const t = randInt(2, 9) + pick([0, 0.5, 0.25]); return { t, what: pick(['maize', 'sand', 'sugar cane', 'ballast']) }; },
    make: ({ t, what }) => ({
      question: `A lorry carries ${t} tonnes of ${what}. How many kilograms is that?`,
      answer: t * 1000,
      wrong: [[t * 100, '1 tonne is 1,000 kg, not 100 kg.'], [t * 10, '1 tonne is 1,000 kg, not 10 kg.'], [t + 1000, 'Each tonne is 1,000 kg, so multiply.']],
      hints: ['1 tonne = 1,000 kg.', `Multiply ${t} by 1,000.`],
      steps: ['1 tonne = 1,000 kg.', `${t} × 1,000 = ${commas(t * 1000)} kg.`],
    }),
    check: ({ t }, a) => a / 1000 === t }),
  fx({ id: 'g6.mass.bags-to-tonnes', skill: 'G6_MASS', outcome: 'G6.MASS.e', rung: 2, form: 'word',
    draw: () => { const bag = pick([50, 90, 100]), n = randInt(2, 20) * 10; return { bag, n, p: person() }; },
    make: ({ bag, n, p }) => ({
      question: `${p.name} loads ${n} bags of maize onto a lorry. Each bag has a mass of ${bag} kg. What is the total mass, in tonnes?`,
      answer: (bag * n) / 1000,
      wrong: [[bag * n, 'That is the total in kilograms. The question asks for tonnes.'], [(bag * n) / 100, '1 tonne is 1,000 kg, so divide by 1,000.'], [(bag + n) / 1000, 'The total of equal bags comes from multiplying.']],
      hints: ['Find the total in kilograms first.', 'Then change kilograms to tonnes: 1,000 kg = 1 tonne.'],
      steps: [`Total: ${n} × ${bag} = ${commas(bag * n)} kg.`, `${commas(bag * n)} ÷ 1,000 = ${(bag * n) / 1000} tonnes.`],
    }),
    check: ({ bag, n }, a) => Math.round(a * 1000) === bag * n }),
  fx({ id: 'g6.mass.tonnes-kg-add', skill: 'G6_MASS', outcome: 'G6.MASS.e', rung: 2, form: 'word',
    draw: () => ({ t1: randInt(1, 6), kg1: randInt(1, 9) * 100, t2: randInt(1, 4), kg2: randInt(1, 9) * 100 }),
    make: ({ t1, kg1, t2, kg2 }) => {
      const total = t1 * 1000 + kg1 + t2 * 1000 + kg2;
      return { question: `One week a farmer sells ${t1} t ${kg1} kg of maize. The next week the sale is ${t2} t ${kg2} kg. Find the total for both weeks, in kilograms.`,
        answer: total,
        wrong: [[t1 + t2 + kg1 + kg2, 'Tonnes and kilograms are different units. Change the tonnes to kilograms first.'], [(t1 + t2) * 100 + kg1 + kg2, '1 tonne is 1,000 kg, not 100 kg.'], [(t1 + t2) * 1000, 'The kilograms have been left out.']],
        hints: ['Change each amount to kilograms.', 'Then add.'],
        steps: [`${t1} t ${kg1} kg = ${commas(t1 * 1000 + kg1)} kg.`, `${t2} t ${kg2} kg = ${commas(t2 * 1000 + kg2)} kg.`, `Total: ${commas(total)} kg.`] };
    },
    check: ({ t1, kg1, t2, kg2 }, a) => a - kg1 - kg2 === (t1 + t2) * 1000 }),

  // ---- G5_MONEY: budget, tax, banks, saving
  fx({ id: 'g5.money.budget-left', skill: 'G5_MONEY', outcome: 'G5.MONEY.c', rung: 1, form: 'word',
    draw: () => { const have = pick([300, 400, 500, 600, 800, 1000]); const a = price('exercise book') * 2, b = price('pen'), c = price('ruler'), d = pick([100, 150, 200]); const left = have - a - b - c - d; return left >= 0 && left !== 0 ? { have, a, b, c, d, p: person() } : null; },
    make: ({ have, a, b, c, d, p }) => {
      const left = have - a - b - c - d;
      return { question: `${p.name} has ${sh(have)} for school things. ${p.Her} budget is: exercise books ${sh(a)}, a pen ${sh(b)}, a ruler ${sh(c)} and lunch ${sh(d)}. How much of the ${sh(have)} is left?`,
        answer: left,
        wrong: [[a + b + c + d, 'That is what the budget spends. What is left from the money?'], [have - a - b, 'Two items are still in the budget. Take them away too.'], [have + a, 'Spending takes money away, so subtract.']],
        hints: ['Add up all the planned spending.', `Then take the total from ${sh(have)}.`],
        steps: [`Planned spending: ${a} + ${b} + ${c} + ${d} = ${sh(a + b + c + d)}.`, `Left: ${have} − ${a + b + c + d} = ${sh(left)}.`] };
    },
    check: ({ have, a, b, c, d }, v) => v + a + b + c + d === have }),
  fx({ id: 'g5.money.budget-why', skill: 'G5_MONEY', outcome: 'G5.MONEY.a', rung: 1, form: 'why',
    draw: () => { const has = pick([500, 800, 1000, 1500]); return { has, p: person(), k: randInt(0, 3) }; },
    make: ({ has, p, k }) => {
      const opts = [{ text: 'To plan the money before spending it, so it covers what is needed', right: true }, { text: 'To make the money grow by itself', right: false, why: 'A budget does not add money. It plans how to use it.' }, { text: 'To spend it all as fast as possible', right: false, why: 'A budget slows spending down by planning it.' }, { text: 'To hide the money from the family', right: false, why: 'A budget is a plan, and a family often makes it together.' }];
      return { question: `${p.name} has ${sh(has)} to last the month and writes a budget. Why is a budget useful?`, instruction: 'Choose the best reason.', options: [...opts.slice(k), ...opts.slice(0, k)],
        hints: ['A budget is written before the money is spent.', 'What does it help you decide?'],
        steps: ['A budget lists what money comes in and what it will be used for.', 'It helps make sure needs are covered first.'] };
    } }),
  fx({ id: 'g5.money.tax-why', skill: 'G5_MONEY', outcome: 'G5.MONEY.d', rung: 1, form: 'why',
    draw: () => { const list = ['roads', 'public schools', 'public hospitals', 'clean water supply']; return { what: pick(list), k: randInt(0, 3), n: randInt(1, 5) }; },
    make: ({ what, k, n }) => {
      const opts = [{ text: `It pays for services such as ${what}`, right: true }, { text: 'It goes to the shop owner as profit', right: false, why: 'Tax goes to the government, not to the shop.' }, { text: 'It is a gift that people may give if they wish', right: false, why: 'Tax is required by law.' }, { text: 'It is money a bank lends to people', right: false, why: 'That is a loan, not a tax.' }];
      return { question: `A family of ${n + 2} pays tax on things it buys. Why do people pay tax?`, instruction: 'Choose the best reason.', options: [...opts.slice(k), ...opts.slice(0, k)],
        hints: ['Tax is money people pay to the government.', 'What does the government use it for?'],
        steps: ['Tax is money people must pay to the government.', `Government uses it for services such as ${what}.`] };
    } }),
  fx({ id: 'g5.money.bank-service', skill: 'G5_MONEY', outcome: 'G5.MONEY.e', rung: 1, form: 'direct',
    draw: () => { const list = [['keep money safe and take it out when needed', 'A savings account'], ['borrow money and pay it back with interest', 'A loan'], ['take out cash at any time of day from a machine', 'An ATM']]; const [q, right] = pick(list); return { q, right, all: [...list.map(x => x[1]), 'A receipt'], p: person(), k: randInt(0, 3) }; },
    make: ({ q, right, all, p, k }) => {
      const opts = all.map(text => ({ text, right: text === right, why: text === right ? undefined : (text === 'A receipt' ? 'A receipt only shows that something was paid for.' : `${text} is for something else. Read what ${p.name} wants to do.`) }));
      return { question: `${p.name} wants to ${q}. Which bank service does ${p.she} need?`, options: [...opts.slice(k), ...opts.slice(0, k)],
        hints: ['Think about what each service is for.', `What does ${p.name} want to do with the money?`],
        steps: [`To ${q}, ${p.name} needs: ${right}.`, 'Banks offer different services for different needs.'] };
    } }),
  fx({ id: 'g5.money.save-weeks', skill: 'G5_MONEY', outcome: 'G5.MONEY.f', rung: 2, form: 'word',
    draw: () => { const w = pick([10, 15, 20, 25, 30, 35, 40, 50]), weeks = randInt(4, 20), thing = pick(['football', 'school bag', 'pair of shoes', 'storybook']); return { w, weeks, thing, p: person() }; },
    make: ({ w, weeks, thing, p }) => ({
      question: `${p.name} saves ${sh(w)} every week in a savings account. How many weeks will it take to save ${sh(w * weeks)} for a ${thing}?`,
      answer: weeks,
      wrong: [[w * weeks - w, 'Taking away one saving is not enough. How many savings make the whole amount?'], [w * weeks + w, 'The question asks how many weeks, so share the total by the weekly saving.'], [weeks + 1, `After that many weeks ${p.she} would have more than the amount. Multiply to check.`]],
      hints: ['Each week adds the same amount.', `How many ${w}s make ${w * weeks}?`],
      steps: [`Total needed: ${sh(w * weeks)}. Saved each week: ${sh(w)}.`, `${w * weeks} ÷ ${w} = ${weeks} weeks.`],
    }),
    check: ({ w, weeks }, a) => a * w === w * weeks }),

  // ---- G4_LETTERS: keep "find the letter", add forming and simplifying
  fx({ id: 'g4.letters.form-add', skill: 'G4_LETTERS', outcome: 'G4.LETTERS.b', rung: 1, form: 'word',
    draw: () => { const add = randInt(2, 12), letter = pick(['x', 'y', 'm', 'k']), thing = pick(['mangoes', 'oranges', 'eggs', 'books']); return { add, letter, thing, p: person(), k: randInt(0, 3) }; },
    make: ({ add, letter, thing, p, k }) => {
      const opts = [{ text: `${letter} + ${add}`, right: true }, { text: `${letter} − ${add}`, right: false, why: 'Adding more makes the number bigger, so use +.' }, { text: `${add}${letter}`, right: false, why: `${add}${letter} means ${add} lots of ${letter}. Here ${add} more are put in.` }, { text: `${letter}`, right: false, why: `That leaves out the ${add} that were added.` }];
      return { question: `A bag has ${letter} ${thing}. ${p.name} adds ${add} more. Which expression shows how many ${thing} are in the bag now?`, options: [...opts.slice(k), ...opts.slice(0, k)],
        hints: [`${letter} stands for the number of ${thing} at first.`, 'More were added. Which sign shows adding?'],
        steps: [`The bag starts with ${letter} ${thing}.`, `${add} more makes ${letter} + ${add}.`] };
    } }),
  fx({ id: 'g4.letters.simplify', skill: 'G4_LETTERS', outcome: 'G4.LETTERS.c', rung: 2, form: 'direct',
    draw: () => { const a = randInt(2, 7), b = randInt(2, 7), c = randInt(1, Math.min(a + b - 1, 5)); return { a, b, c, v: pick(['p', 'x', 'y', 'n']) }; },
    make: ({ a, b, c, v }) => {
      const r = a + b - c, ans = r === 1 ? v : `${r}${v}`;
      return { question: `Simplify: ${a}${v} + ${b}${v} − ${c}${v}`, story: false, instruction: 'Write the answer with the letter.', answer: ans, accepts: [`${r}${v}`],
        wrong: [[`${a + b + c}${v}`, `Look at the sign before ${c}${v}: it means take away.`], [`${a + b}${v}`, `You have not yet taken away ${c}${v}.`], [`${r}`, 'The letter must stay: these are all lots of the same thing.']],
        hints: ['Think of the letter as a thing, such as pens.', `${a} pens and ${b} more, then ${c} taken away.`],
        steps: [`${a}${v} + ${b}${v} = ${a + b}${v}.`, `${a + b}${v} − ${c}${v} = ${ans}.`] };
    },
    check: ({ a, b, c, v }, ans) => (String(ans) === (a + b - c === 1 ? v : `${a + b - c}${v}`)) }),
  fx({ id: 'g4.letters.together', skill: 'G4_LETTERS', outcome: 'G4.LETTERS.b', rung: 3, form: 'word',
    draw: () => { const [t] = [pick(['y', 'n', 'k'])]; return { t, p: person(), q: person() }; },
    make: ({ t, p, q }) => {
      if (p.name === q.name) q = { name: p.name === 'Juma' ? 'Amina' : 'Juma' };
      return { question: `${p.name} has ${t} shillings. ${q.name} has twice as much as ${p.name}. Which expression shows how much they have together?`,
        options: [{ text: `3${t}`, right: true }, { text: `2${t}`, right: false, why: `That is only what ${q.name} has.` }, { text: `${t} + 2`, right: false, why: `Twice as much means 2 lots of ${t}, not ${t} and 2 more.` }, { text: `${t}²`, right: false, why: `${t}² means ${t} × ${t}. Here you are adding amounts.` }],
        hints: [`Write what ${q.name} has first.`, `Then add what ${p.name} has.`],
        steps: [`${q.name} has 2${t}.`, `Together: ${t} + 2${t} = 3${t}.`] };
    } }),

  // ---- G7_DATA_REPRESENT: bar and line, not only pie
  fx({ id: 'g7.data.bar-read', skill: 'G7_DATA_REPRESENT', outcome: 'G7.DATA.f', rung: 2, form: 'graph',
    draw: () => { const keys = ['Maize', 'Beans', 'Sugar', 'Rice']; const vals = keys.map(() => randInt(2, 9) * 10); const s = [...vals].sort((a, b) => b - a); return s[0] !== s[1] && s[3] !== s[2] ? { keys, vals } : null; },
    make: ({ keys, vals }) => {
      const hi = Math.max(...vals), lo = Math.min(...vals), hk = keys[vals.indexOf(hi)], lk = keys[vals.indexOf(lo)];
      return { question: `The bar graph shows the kilograms a duka sold in one week. How many more kilograms of ${hk.toLowerCase()} than ${lk.toLowerCase()} were sold?`,
        model: { type: 'bar-chart', data: { bars: keys.map((label, i) => ({ label, value: vals[i] })) } },
        answer: hi - lo,
        wrong: [[hi + lo, '"How many more" asks for the difference, so subtract.'], [hi, `That is the ${hk.toLowerCase()} bar alone.`], [lo, `That is the ${lk.toLowerCase()} bar alone.`]],
        hints: ['Read the top of each bar against the scale.', `Find the ${hk.toLowerCase()} bar and the ${lk.toLowerCase()} bar, then compare.`],
        steps: [`${hk}: ${hi} kg. ${lk}: ${lo} kg.`, `Difference: ${hi} − ${lo} = ${hi - lo} kg.`] };
    },
    check: ({ vals }, a) => Math.min(...vals) + a === Math.max(...vals) }),
  fx({ id: 'g7.data.line-rise', skill: 'G7_DATA_REPRESENT', outcome: 'G7.DATA.j', rung: 2, form: 'graph',
    draw: () => { const vals = [randInt(14, 18), randInt(19, 23), randInt(24, 28), randInt(25, 30), randInt(18, 24)]; return { vals, hours: [8, 10, 12, 14, 16] }; },
    make: ({ vals, hours }) => {
      return { question: `The line graph shows the temperature in °C at a school in Thika during one day. By how many degrees did it rise from ${hours[0]}:00 to ${hours[2]}:00?`,
        model: { type: 'line-graph', data: { points: hours.map((x, j) => ({ x, y: vals[j] })), xTicks: hours, yTicks: [10, 15, 20, 25, 30], xLabel: 'Time of day (hours)', yLabel: 'Temperature (°C)' } },
        answer: vals[2] - vals[0],
        wrong: [[vals[2], 'That is the temperature at the later time. The question asks for the rise.'], [vals[0] + vals[2], 'A rise is a difference, so subtract.'], [vals[1] - vals[0], 'That is the rise only up to the first mark after the start. Read the later time asked for.']],
        hints: [`Read the graph at ${hours[0]}:00, and at ${hours[2]}:00.`, 'Subtract the earlier reading from the later one.'],
        steps: [`At ${hours[0]}:00 it is ${vals[0]} °C. At ${hours[2]}:00 it is ${vals[2]} °C.`, `Rise: ${vals[2]} − ${vals[0]} = ${vals[2] - vals[0]} degrees.`] };
    },
    check: ({ vals }, a) => vals[0] + a === vals[2] }),

  // ---- G8_LINEAR_GRAPHS: tables of values and meeting points, with a graph
  fx({ id: 'g8.graphs.table-complete', skill: 'G8_LINEAR_GRAPHS', outcome: 'G8.GRAPHS.d', rung: 1, form: 'table',
    draw: () => { const m = randInt(2, 4), c = randInt(-3, 5); const x = pick([2, 3, 4]), v = [m + x + c, m * x, m * (x - 1) + c]; return c === 0 || new Set(v).size < 3 || v.includes(m * x + c) ? null : { m, c, x }; },
    make: ({ m, c, x }) => {
      const y = (t) => m * t + c, eq = `y = ${m}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}`;
      return { question: `Complete the table of values for ${eq}. What is y when x = ${x}?`, story: false,
        model: { type: 'table', data: { head: ['x', 'y'], rows: [{ label: '0', value: String(y(0)) }, { label: '1', value: String(y(1)) }, { label: String(x), value: '?' }] } },
        answer: y(x),
        wrong: [[m + x + c, `${m}x means ${m} times x. Multiply before adding.`], [m * x, `You have not yet done the ${c < 0 ? '−' : '+'} ${Math.abs(c)}.`], [y(x - 1), 'That is the value for the x before it.']],
        hints: [`Put x = ${x} into the equation.`, `${m} × ${x} first.`], allowNegative: true,
        steps: [`y = ${m} × ${x} ${c < 0 ? '−' : '+'} ${Math.abs(c)}`, `y = ${m * x} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${y(x)}.`] };
    },
    check: ({ m, c, x }, a) => (a - c) / m === x }),
  fx({ id: 'g8.graphs.fare-graph', skill: 'G8_LINEAR_GRAPHS', outcome: 'G8.GRAPHS.b', rung: 2, form: 'graph',
    draw: () => ({ rate: pick([20, 30, 40, 50]), fix: pick([50, 100]) , km: pick([2, 4, 6]) }),
    make: ({ rate, fix, km }) => {
      const y = (x) => fix + rate * x;
      const ticks = [0, 2, 4, 6, 8];
      const top = y(8), yTicks = [0, Math.ceil(top / 4 / 50) * 50, Math.ceil(top / 4 / 50) * 100, Math.ceil(top / 4 / 50) * 150, Math.ceil(top / 4 / 50) * 200];
      return { question: `The graph shows a boda boda fare in shillings for each distance in km. Read the point at ${km} km. What is the fare?`,
        model: { type: 'line-graph', data: { points: ticks.map(x => ({ x, y: y(x) })), xTicks: ticks, yTicks, xLabel: 'Distance (km)', yLabel: 'Fare (sh)' } },
        answer: y(km),
        wrong: [[rate * km, 'The line does not start at 0. Read the height of the point, which includes the fixed charge.'], [y(km + 2), 'That is the next point along. Go up from the distance asked for.'], [fix, 'That is the fare before any distance. Read at the distance asked for.']],
        hints: [`Find ${km} on the distance axis.`, 'Go straight up to the line, then across to the fare axis.'],
        steps: [`At ${km} km, go up to the line.`, `Read across: the fare is sh ${y(km)}.`] };
    },
    check: ({ rate, fix, km }, a) => (a - fix) / rate === km }),
  fx({ id: 'g8.graphs.meet', skill: 'G8_LINEAR_GRAPHS', outcome: 'G8.GRAPHS.g', rung: 3, form: 'graph',
    draw: () => { const x0 = randInt(1, 4), y0 = randInt(2, 8), m1 = pick([1, 2]), m2 = pick([-1, -2]); const c1 = y0 - m1 * x0, c2 = y0 - m2 * x0; return x0 === y0 ? null : { x0, y0, m1, m2, c1, c2 }; },
    make: ({ x0, y0, m1, m2, c1, c2 }) => {
      const eq = (m, c) => `y = ${m === 1 ? '' : m === -1 ? '−' : m < 0 ? `−${-m}` : m}x${c === 0 ? '' : c < 0 ? ` − ${-c}` : ` + ${c}`}`;
      const xs = [0, 1, 2, 3, 4, 5];
      const ys = (m, c) => xs.map(x => ({ x, y: m * x + c }));
      const all = [...ys(m1, c1), ...ys(m2, c2)].map(p => p.y);
      const lo = Math.floor(Math.min(...all) / 5) * 5, hi = Math.ceil(Math.max(...all) / 5) * 5;
      const yTicks = []; for (let v = lo; v <= hi; v += 5) yTicks.push(v);
      const pt = (x, y) => `(${x}, ${y})`;
      return { question: `The lines ${eq(m1, c1)} and ${eq(m2, c2)} are drawn on the graph. At which point do they meet?`, story: false,
        model: { type: 'line-graph', data: { lines: [ys(m1, c1), ys(m2, c2)], xTicks: xs, yTicks, xLabel: 'x', yLabel: 'y' } },
        options: [{ text: pt(x0, y0), right: true }, { text: pt(y0, x0), right: false, why: 'That swaps x and y. x is read along, y is read up.' }, { text: pt(x0 + 1, m1 * (x0 + 1) + c1), right: false, why: 'That point is on only one of the lines.' }, { text: pt(x0, m2 * x0 + c2 + 1), right: false, why: 'Check that the point fits both equations.' }],
        hints: ['The meeting point lies on both lines.', 'Try each point in both equations.'],
        steps: [`At x = ${x0}, ${eq(m1, c1)} gives y = ${y0}.`, `At x = ${x0}, ${eq(m2, c2)} gives y = ${y0}.`, `Both agree, so they meet at ${pt(x0, y0)}.`] };
    } }),

  // ---- G8_SURFACE_AREA: cylinders as well as cuboids
  fx({ id: 'g8.surface.cylinder-tin', skill: 'G8_SURFACE_AREA', outcome: 'G8.AREA.d', rung: 2, form: 'word',
    draw: () => { const r = pick([7, 14, 3.5]), h = pick([10, 15, 20, 30]); return { r, h, what: pick(['A closed tin of cooking fat', 'A closed cylindrical drum', 'A closed paint tin']) }; },
    make: ({ r, h, what }) => {
      const pi = 22 / 7, sa = round(2 * pi * r * (r + h), 1);
      return { question: `${what} has a circular top and bottom of radius ${r} cm, and stands ${h} cm tall. How much metal covers the whole outside, in cm²? (Use π = 22/7)`,
        answer: sa,
        wrong: [[round(2 * pi * r * h, 1), 'That is the curved side only. A closed tin has a top and a bottom too.'], [round(2 * pi * r * h + pi * r * r, 1), 'That has one circle. A closed tin has two.'], [round(pi * r * r * h, 1), 'That is the volume. Surface area is what covers the outside.']],
        hints: ['A closed cylinder opens out into a rectangle and two circles.', 'Curved part = 2πrh. Each circle = πr².'],
        steps: [`Curved part: 2 × 22/7 × ${r} × ${h} = ${round(2 * pi * r * h, 1)} cm².`, `Two circles: 2 × 22/7 × ${r} × ${r} = ${round(2 * pi * r * r, 1)} cm².`, `Total: ${sa} cm².`] };
    },
    check: ({ r, h }, a) => Math.abs(a - 2 * (22 / 7) * r * r - 2 * (22 / 7) * r * h) < 0.11 }),

  // ---- G8_PROBABILITY_COMBINED: a tree diagram at last
  fx({ id: 'g8.prob.tree-two-stage', skill: 'G8_PROBABILITY_COMBINED', outcome: 'G8.PROB.d', rung: 2, form: 'table',
    draw: () => { const pr = pick([0.2, 0.3, 0.4, 0.6]), ps = pick([0.25, 0.75, 0.2, 0.1]); return { pr, ps }; },
    make: ({ pr, ps }) => {
      const a = round(pr * ps, 4);
      return { question: `A tree diagram has two sets of branches. On the first set, the chance that it rains is ${pr}. On the second set, the chance that the matatu is late is ${ps}, rain or not. Multiply along the branches: what is the probability that it rains and the matatu is late?`,
        answer: a,
        wrong: [[round(pr + ps, 4), 'Along a branch you multiply. Adding is for choosing between different paths.'], [round(1 - pr * ps, 4), 'That is the chance of everything except this path.'], [round(pr * (1 - ps), 4), 'That is rain and the matatu on time.']],
        hints: ['Follow one branch for rain, then one for late.', 'Multiply the probabilities along the path.'],
        steps: [`Path: rain (${pr}) then late (${ps}).`, `${pr} × ${ps} = ${a}.`] };
    },
    check: ({ pr, ps }, a) => Math.abs(a / ps - pr) < 1e-6 }),

  // ---- G9_SPEED_VELOCITY: velocity, acceleration, average speed (alias removed)
  fx({ id: 'g9.speed.acceleration', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.d', rung: 1, form: 'word',
    draw: () => { const t = pick([4, 5, 8, 10, 12]), acc = pick([1, 1.5, 2, 2.5, 3]); return { t, acc, what: pick(['A motorbike', 'A matatu', 'A train']) }; },
    make: ({ t, acc, what }) => ({
      question: `${what} starts from rest and reaches ${acc * t} m/s in ${t} s. Find its acceleration in m/s².`,
      answer: acc,
      wrong: [[acc * t * t, 'Acceleration is the change in velocity divided by the time, so divide.'], [acc * t + t, 'Acceleration divides the change in velocity by the time.'], [acc * t, 'That is the final velocity. How much does it change each second?']],
      hints: ['Acceleration = change in velocity ÷ time.', `It went from 0 to ${acc * t} m/s.`],
      steps: [`Change in velocity: ${acc * t} − 0 = ${acc * t} m/s.`, `Acceleration: ${acc * t} ÷ ${t} = ${acc} m/s².`],
    }),
    check: ({ t, acc }, a) => a * t === acc * t }),
  fx({ id: 'g9.speed.convert-kmh', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.a', rung: 1, form: 'direct',
    draw: () => { const ms = pick([5, 10, 15, 20, 25, 30]); return { ms }; },
    make: ({ ms }) => ({
      question: `Change ${ms * 3.6} km/h to m/s.`, story: false,
      answer: ms,
      wrong: [[ms * 3.6 * 3.6, 'To change km/h to m/s, divide by 3.6.'], [ms * 3.6 * 1000, 'Multiplying by 1,000 changes km to m but ignores the hours.'], [ms * 3.6 / 60, 'An hour has 3,600 seconds, not 60.']],
      hints: ['1 km = 1,000 m and 1 hour = 3,600 s.', 'So divide by 3.6.'],
      steps: [`${ms * 3.6} km in 1 hour is ${ms * 3600} m in 3,600 s.`, `${ms * 3600} ÷ 3,600 = ${ms} m/s.`],
    }),
    check: ({ ms }, a) => round(a * 3.6, 3) === round(ms * 3.6, 3) }),
  fx({ id: 'g9.speed.average', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.b', rung: 2, form: 'word',
    draw: () => { const d1 = pick([60, 120, 180, 240]), v1 = pick([40, 60, 80]), v2 = pick([30, 40, 60]); const d2 = pick([60, 120, 180]); const T = d1 / v1 + d2 / v2; const av = (d1 + d2) / T; return v1 !== v2 && Number.isInteger(av * 10) ? { d1, v1, d2, v2 } : null; },
    make: ({ d1, v1, d2, v2 }) => {
      const t1 = d1 / v1, t2 = d2 / v2, av = round((d1 + d2) / (t1 + t2), 1);
      return { question: `Two stretches of road: ${d1} km driven at ${v1} km/h and ${d2} km driven at ${v2} km/h. Find the average speed over both stretches, in km/h.`,
        answer: av,
        wrong: [[(v1 + v2) / 2, 'The two parts take different times, so you cannot just average the speeds. Use total distance ÷ total time.'], [d1 + d2, 'That is the total distance. Divide it by the total time.'], [round(t1 + t2, 2), 'That is the total time. Average speed is distance ÷ time.']],
        hints: ['Average speed = total distance ÷ total time.', 'Find the time for each stretch first.'],
        steps: [`Time: ${d1} ÷ ${v1} = ${round(t1, 2)} h and ${d2} ÷ ${v2} = ${round(t2, 2)} h.`, `Total distance: ${d1 + d2} km. Total time: ${round(t1 + t2, 2)} h.`, `Average speed: ${d1 + d2} ÷ ${round(t1 + t2, 2)} = ${av} km/h.`] };
    },
    check: ({ d1, v1, d2, v2 }, a) => Math.abs(a * (d1 / v1 + d2 / v2) - (d1 + d2)) < 0.5 }),
  fx({ id: 'g9.speed.velocity-out-back', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.c', rung: 3, form: 'why',
    draw: () => { const d = pick([10, 15, 20, 30, 40]), T = pick([0.5, 1, 2]); return { d, T, p: person() }; },
    make: ({ d, T, p }) => ({
      question: `${p.name} cycles ${d} km east along a straight road and straight back to the start. The whole trip takes ${T} h. Why is ${p.her} average velocity 0, even though ${p.her} average speed is ${(2 * d) / T} km/h?`,
      options: [{ text: 'Velocity depends on the change in position, and the trip ends where it began', right: true }, { text: 'Velocity ignores time altogether', right: false, why: 'Velocity is displacement divided by time, so time counts.' }, { text: 'A bicycle cannot have a velocity', right: false, why: 'Anything moving has a velocity.' }, { text: 'Velocity and speed are always the same', right: false, why: 'Speed uses total distance. Velocity uses how far you end up from the start, and the direction.' }],
      hints: ['Speed uses the distance travelled.', 'Velocity uses how far you end up from where you began, in a direction.'],
      steps: [`Total distance: ${2 * d} km, so average speed = ${(2 * d) / T} km/h.`, 'Displacement: 0, because the trip ends at the start. So average velocity = 0.'],
    }) }),
  fx({ id: 'g9.speed.velocity-direction', skill: 'G9_SPEED_VELOCITY', outcome: 'G9.SPEED.c', rung: 2, form: 'word',
    draw: () => { const d = pick([120, 150, 180, 240, 300]), t = pick([2, 3, 4, 5, 6]); return Number.isInteger(d / t) ? { d, t } : null; },
    make: ({ d, t }) => ({
      question: `Going straight north without turning, a lorry ends ${d} km from where it began, ${t} hours later. How big is its velocity, in km/h?`,
      answer: d / t,
      wrong: [[d * t, 'Velocity is displacement divided by time, so divide.'], [d - t, 'Divide the distance by the time.'], [t / d, 'That is the wrong way up: displacement ÷ time.']],
      hints: ['On a straight road in one direction, the displacement equals the distance.', 'Velocity = displacement ÷ time.'],
      steps: [`Displacement: ${d} km north.`, `Velocity: ${d} ÷ ${t} = ${d / t} km/h north.`],
    }),
    check: ({ d, t }, a) => a * t === d }),

  // ---- G9_PROBABILITY_ADV: with and without replacement
  fx({ id: 'g9.prob.with-replacement', skill: 'G9_PROBABILITY_ADV', outcome: 'G9.PROB.e', rung: 2, form: 'word',
    draw: () => { const r = randInt(2, 6), b = randInt(2, 6); return { r, b }; },
    make: ({ r, b }) => {
      const n = r + b, num = r * r, den = n * n, g = gcdOf(num, den), ans = `${num / g}/${den / g}`;
      return { question: `A bag has ${r} red and ${b} blue counters. One is taken, its colour noted, and it is put back. A second is taken. Find the probability that both are red, as a fraction in its simplest form.`,
        instruction: 'Give the answer as a fraction in its simplest form.',
        answer: ans,
        wrong: [[`${r}/${n}`, 'That is for one counter. There are two draws: multiply.'], [`${r * (r - 1) / gcdOf(r * (r - 1), n * (n - 1))}/${n * (n - 1) / gcdOf(r * (r - 1), n * (n - 1))}`, 'The counter was put back, so the second draw has the same chances as the first.'], [`${2 * r}/${n}`, 'Along a path you multiply probabilities, not add them.']],
        hints: ['The counter goes back, so both draws are the same.', `Each draw has ${n} counters.`],
        steps: [`P(red on one draw) = ${r}/${n}.`, `Both red: ${r}/${n} × ${r}/${n} = ${num}/${den} = ${ans}.`] };
    },
    check: ({ r, b }, a) => { const [x, y] = String(a).split('/').map(Number); return Math.abs(x / y - (r / (r + b)) ** 2) < 1e-9 && gcdOf(x, y) === 1; } }),
  fx({ id: 'g9.prob.without-replacement', skill: 'G9_PROBABILITY_ADV', outcome: 'G9.PROB.e', rung: 3, form: 'word',
    draw: () => { const g = randInt(3, 8), b = randInt(2, 7); return { g, b }; },
    make: ({ g, b }) => {
      const n = g + b, num = g * (g - 1), den = n * (n - 1), k = gcdOf(num, den), ans = `${num / k}/${den / k}`;
      return { question: `A class list has ${g} girls and ${b} boys. The teacher picks one learner to lead and then another to help. A learner cannot be picked twice. Find the probability that both are girls, as a fraction in its simplest form.`,
        instruction: 'Give the answer as a fraction in its simplest form.',
        answer: ans,
        wrong: [[`${g * g / gcdOf(g * g, n * n)}/${n * n / gcdOf(g * g, n * n)}`, 'After the first pick there is one fewer learner, and one fewer girl.'], [`${g / gcdOf(g, n)}/${n / gcdOf(g, n)}`, 'That is for one pick. Two picks: multiply.'], [`${(g - 1) / gcdOf(g - 1, n - 1)}/${(n - 1) / gcdOf(g - 1, n - 1)}`, 'That is only the second pick. Multiply it by the first.']],
        hints: ['After the first girl is picked, what changes?', `Second pick: ${g - 1} girls out of ${n - 1}.`],
        steps: [`First pick: ${g}/${n}.`, `Second pick: ${g - 1}/${n - 1}.`, `Both: ${g}/${n} × ${g - 1}/${n - 1} = ${num}/${den} = ${ans}.`] };
    },
    check: ({ g, b }, a) => { const [x, y] = String(a).split('/').map(Number); const n = g + b; return Math.abs(x / y - (g / n) * ((g - 1) / (n - 1))) < 1e-9; } }),
  fx({ id: 'g9.prob.replace-or-not', skill: 'G9_PROBABILITY_ADV', outcome: 'G9.PROB.e', rung: 1, form: 'why',
    draw: () => { const r = randInt(3, 7), b = randInt(2, 6); return { r, b, p: person() }; },
    make: ({ r, b, p }) => ({
      question: `A bag has ${r} red and ${b} blue beads. ${p.name} takes out a red bead and keeps it. Why is the chance of red on the next draw now ${r - 1}/${r + b - 1}, and not ${r}/${r + b}?`,
      options: [{ text: 'One red bead has gone, so there is one fewer red and one fewer bead in all', right: true }, { text: 'Taking a bead makes red more likely next time', right: false, why: 'With one red gone, red is less likely, not more.' }, { text: 'The chance of red never changes', right: false, why: 'It stays the same only if the bead is put back.' }, { text: 'Only the blue beads change', right: false, why: 'Blue beads are untouched. Look at what left the bag.' }],
      hints: ['Count what is left in the bag.', 'How many reds now? How many beads altogether?'],
      steps: [`Reds left: ${r - 1}. Beads left: ${r + b - 1}.`, `So the chance is ${r - 1}/${r + b - 1}.`],
    }) }),

  // ---- Constructions: nothing can be constructed on a phone, so ask what the method rests on
  fx({ id: 'g7.construct.halving', skill: 'G7_CONSTRUCTIONS', outcome: 'G7.CONSTRUCT.b', rung: 1, form: 'direct',
    draw: () => { const a = pick([50, 70, 40, 110, 130, 30]); return { a }; },
    make: ({ a }) => ({
      question: `Using a ruler and compasses, you bisect an angle of ${a}°. What is the size of each new angle?`, story: false,
      answer: a / 2,
      wrong: [[a * 2, 'Bisect means cut into two equal parts, so each part is smaller.'], [a, 'That is the angle before it was bisected.'], [180 - a, 'That is the angle on a straight line with it, not half of it.']],
      hints: ['To bisect means to cut into two equal parts.', `Halve ${a}.`],
      steps: ['Bisecting cuts the angle into two equal parts.', `${a} ÷ 2 = ${a / 2}°.`],
    }),
    check: ({ a }, v) => v + v === a }),
  fx({ id: 'g7.construct.how-to', skill: 'G7_CONSTRUCTIONS', outcome: 'G7.CONSTRUCT.b', rung: 2, form: 'why',
    draw: () => { const a = pick([30, 15, 45, 75, 120, 60, 90]); return { a, k: randInt(0, 3) }; },
    make: ({ a, k }) => {
      const how = { 60: 'Draw arcs of the same radius to make an equilateral triangle', 30: 'Construct 60°, then bisect it', 15: 'Construct 60°, bisect it to get 30°, then bisect again', 90: 'Construct a perpendicular to a line', 45: 'Construct 90°, then bisect it', 120: 'Construct 60° twice, one beside the other', 75: 'Construct 60° and 90° beside it, then bisect the 30° gap' }[a];
      const others = Object.entries({ 60: 'Draw arcs of the same radius to make an equilateral triangle', 30: 'Construct 60°, then bisect it', 15: 'Construct 60°, bisect it to get 30°, then bisect again', 90: 'Construct a perpendicular to a line', 45: 'Construct 90°, then bisect it', 120: 'Construct 60° twice, one beside the other', 75: 'Construct 60° and 90° beside it, then bisect the 30° gap' }).filter(([d]) => Number(d) !== a).slice(0, 3);
      const opts = [{ text: how, right: true }, ...others.map(([d, text]) => ({ text, right: false, why: `That method gives ${d}°.` }))];
      return { question: `With only a ruler and compasses, how do you make an angle of ${a}°? Work it through on paper too.`, story: false, options: [...opts.slice(k), ...opts.slice(0, k)],
        hints: ['Compasses give 60° and 90° directly. Bisecting halves what you have.', `Which of those leads to ${a}°?`],
        steps: [`To make ${a}°: ${how.toLowerCase()}.`, 'Try it with your ruler and compasses on paper.'] };
    } }),
  fx({ id: 'g9.construct.polygon-angle', skill: 'G9_CONSTRUCTION', outcome: 'G8.CONSTRUCT.c', rung: 2, form: 'direct',
    draw: () => ({ n: pick([5, 6, 8, 9, 10, 12]) }),
    make: ({ n }) => ({
      question: `To construct a regular polygon with ${n} sides you need its interior angle. What is it, in degrees?`, story: false,
      answer: ((n - 2) * 180) / n,
      wrong: [[360 / n, 'That is the exterior angle. The interior angle is 180° minus it.'], [(n - 2) * 180, 'That is the sum of all the interior angles. Share it among the angles.'], [(n * 180) / n, 'The angle sum is (n − 2) × 180°, not n × 180°.']],
      hints: ['Each exterior angle is 360° ÷ the number of sides.', 'Interior angle = 180° − exterior angle.'],
      steps: [`Exterior angle: 360 ÷ ${n} = ${360 / n}°.`, `Interior angle: 180 − ${360 / n} = ${180 - 360 / n}°.`],
    }),
    check: ({ n }, a) => Math.abs(a * n - (n - 2) * 180) < 1e-9 }),
  fx({ id: 'g9.construct.circum-centre', skill: 'G9_CONSTRUCTION', outcome: 'G8.CONSTRUCT.f', rung: 3, form: 'why',
    draw: () => ({ k: randInt(0, 3), a: randInt(6, 12), b: randInt(5, 11) }),
    make: ({ k, a, b }) => {
      const opts = [{ text: 'Any point on a perpendicular bisector is the same distance from both ends of that side', right: true }, { text: 'Perpendicular bisectors always pass through a corner', right: false, why: 'A perpendicular bisector passes through the middle of a side.' }, { text: 'They make every angle of the triangle equal', right: false, why: 'Drawing lines does not change the angles of the triangle.' }, { text: 'They give the area of the triangle', right: false, why: 'Area comes from base and height.' }];
      return { question: `To draw a circle through all three corners of a triangle with sides ${a} cm and ${b} cm and a third side, you bisect two sides at right angles and use the point where those lines meet as the centre. Why does this work?`, story: false, options: [...opts.slice(k), ...opts.slice(0, k)],
        hints: ['What is special about a point on a perpendicular bisector?', 'The centre must be the same distance from all three corners.'],
        steps: ['A point on a perpendicular bisector is equally far from the two ends of the side.', 'The meeting point of two such lines is equally far from all three corners, so a circle fits through them.'] };
    } }),
];

const gcdOf = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
