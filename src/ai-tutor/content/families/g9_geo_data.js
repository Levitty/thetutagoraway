// ============================================================================
// GRADE 9 GEOMETRY AND DATA: coordinates and graphs, scale drawing, similarity
// and enlargement, trigonometry, grouped data, probability.
// New question forms, written in advance. Every answer is computed from the
// draw, and every `check` works the answer a second way.
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family, round, commas } from './core.js';
import { person, sh } from './kenya.js';

const fam = (def) => family({ reviewed: false, ...def });

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const pad3 = (n) => String(n).padStart(3, '0');
const sg = (n) => (n < 0 ? `−${-n}` : `${n}`);
const lineEq = (m, c) => `y = ${m === 1 ? '' : m === -1 ? '−' : sg(m)}x${c === 0 ? '' : c < 0 ? ` − ${-c}` : ` + ${c}`}`;
const allDistinct = (...v) => new Set(v.map(x => String(x))).size === v.length;
const mix = (a) => [...a].sort(() => Math.random() - 0.5);
const turn = (a, k) => [...a.slice(k), ...a.slice(0, k)];
const pt = (x, y) => `(${sg(x)}, ${sg(y)})`;
const near = (a, b, e = 1e-6) => Math.abs(a - b) < e;

// ---- trigonometric tables: four decimal places, like a printed table
const rad = (d) => (d * Math.PI) / 180;
const TRIG = { sin: (d) => round(Math.sin(rad(d)), 4), cos: (d) => round(Math.cos(rad(d)), 4), tan: (d) => round(Math.tan(rad(d)), 4) };

export const FAMILIES = [
  // =========================== COORDINATES AND GRAPHS ===========================
  fam({ id: 'g9.graphs.parallel-table-pick', skill: 'G9_PARALLEL_PERPENDICULAR', outcome: 'G9.GRAPHS.d', rung: 2, form: 'table',
    draw: () => {
      const m = pick([2, 3, 4, 5, -2, -3, -4]), c = randInt(1, 9), c2 = randInt(-6, 8);
      if (c2 === c || c2 === 0) return null;
      const lines = [{ m, c: c2, t: 'right' }, { m: m + 1, c, t: 'next' }, { m: -m, c, t: 'neg' }, { m: c, c: m, t: 'swap' }];
      if (new Set(lines.map(l => l.m)).size < 4) return null;
      return { m, c, lines: mix(lines) };
    },
    make: ({ m, c, lines }) => {
      const L = ['A', 'B', 'C', 'D'];
      const why = { next: 'This line crosses the y-axis in the same place, but parallel lines need the same gradient. Compare the numbers in front of x.', neg: 'This gradient has the opposite sign, so the line slopes the other way. Parallel lines slope the same way.', swap: 'The gradient is the number multiplying x, not the number added on at the end.' };
      return { question: `The table gives the equations of four lines. Which line is parallel to ${lineEq(m, c)}?`,
        model: { type: 'table', data: { head: ['Line', 'Equation'], rows: lines.map((l, i) => ({ label: `Line ${L[i]}`, value: lineEq(l.m, l.c) })) } },
        fixedOrder: true,
        options: lines.map((l, i) => ({ text: `Line ${L[i]}`, right: l.t === 'right', why: l.t === 'right' ? undefined : why[l.t] })),
        hints: ['Parallel lines have the same gradient.', 'In y = mx + c, the gradient is the number multiplying x.'],
        steps: [`The gradient of ${lineEq(m, c)} is ${m}.`, `Parallel lines have the same gradient, so look for the equation with ${sg(m)} in front of x.`, `That is ${lineEq(lines.find(l => l.t === 'right').m, lines.find(l => l.t === 'right').c)}.`] };
    } }),

  fam({ id: 'g9.graphs.parallel-find-k', skill: 'G9_PARALLEL_PERPENDICULAR', outcome: 'G9.GRAPHS.d', rung: 3, form: 'steps', allowNegative: true,
    draw: () => {
      const g = pick([2, 3, 4, -2, -3]), x1 = randInt(0, 4), dx = randInt(1, 3), y1 = randInt(-3, 6);
      const r1 = randInt(0, 3), s1 = randInt(-4, 5), r2 = r1 + randInt(2, 4);
      return { g, x1, y1, x2: x1 + dx, y2: y1 + g * dx, r1, s1, r2, k: s1 + g * (r2 - r1) };
    },
    make: ({ g, x1, y1, x2, y2, r1, s1, r2, k }) => ({
      question: `Line PQ passes through P${pt(x1, y1)} and Q${pt(x2, y2)}. Line RS is parallel to PQ. R is the point ${pt(r1, s1)} and S is the point (${r2}, k).`,
      parts: [
        { prompt: 'Find the gradient of PQ.', answer: g, hint: 'Gradient = change in y ÷ change in x.', wrong: [[round((x2 - x1) / (y2 - y1), 3), 'That is change in x ÷ change in y, upside down.'], [-g, 'Check the sign. Subtract the y values and the x values in the same order.']] },
        { prompt: `RS is parallel to PQ, so it has the same gradient. From R to S, x goes up by ${r2 - r1}. By how much does y change?`, answer: g * (r2 - r1), hint: 'Change in y = gradient × change in x.', wrong: [[r2 - r1, 'That is the change in x. Multiply it by the gradient.'], [g + (r2 - r1), 'Multiply the gradient by the change in x. Do not add.']] },
        { prompt: 'Find k, the y-coordinate of S.', answer: k, hint: 'Start from the y-coordinate of R and add the change in y.', wrong: [[g * (r2 - r1), 'That is only the change in y. S starts from the height of R.'], [s1 - g * (r2 - r1), 'The change in y is added to the y-coordinate of R, not taken away.']] },
      ],
      steps: [`Gradient of PQ = (${y2} − ${sg(y1)}) ÷ (${x2} − ${x1}) = ${g}.`, `RS is parallel, so its gradient is also ${g}. Change in y = ${g} × ${r2 - r1} = ${g * (r2 - r1)}.`, `k = ${sg(s1)} + ${sg(g * (r2 - r1))} = ${k}.`],
    }),
    check: ({ r1, s1, r2, g }, v) => v[0] === g && v[2] - s1 === v[1] && (v[2] - s1) / (r2 - r1) === v[0] }),

  fam({ id: 'g9.graphs.perpendicular-c', skill: 'G9_PARALLEL_PERPENDICULAR', outcome: 'G9.GRAPHS.f', rung: 3, form: 'steps', allowNegative: true,
    draw: () => {
      const n = pick([2, 4, 5, -2, -4, -5]), x1 = randInt(0, 3), dx = randInt(1, 2), y1 = randInt(-2, 5);
      const p = Math.abs(n) * randInt(1, 3) * pick([1, 1, -1]), q = randInt(-5, 8);
      const m = round(-1 / n, 4), c = round(q - m * p, 4);
      if (!Number.isInteger(c)) return null;
      if (!allDistinct(m, n, -n, round(1 / n, 4)) || !allDistinct(c, round(q + m * p, 4), round(q - n * p, 4), q)) return null;
      return { n, x1, y1, x2: x1 + dx, y2: y1 + n * dx, p, q, m, c };
    },
    make: ({ n, x1, y1, x2, y2, p, q, m, c }) => ({
      question: `Line L passes through A${pt(x1, y1)} and B${pt(x2, y2)}. Line M is perpendicular to L and passes through P${pt(p, q)}. The equation of M is y = mx + c.`,
      parts: [
        { prompt: 'Find the gradient of L.', answer: n, hint: 'Gradient = change in y ÷ change in x.', wrong: [[round(1 / n, 4), 'That is change in x ÷ change in y, upside down.']] },
        { prompt: 'Find the gradient of M, as a decimal.', answer: m, hint: 'The gradients of perpendicular lines multiply to give −1.', wrong: [[n, 'That is the gradient of L. A perpendicular line has a different gradient.'], [-n, 'Changing the sign is only half of it. Turn the number upside down too.'], [round(1 / n, 4), 'Turning it upside down is only half of it. Change the sign too.']] },
        { prompt: 'M passes through P. Find c in y = mx + c.', answer: c, hint: 'Put the x and y of P into y = mx + c, then solve for c.', wrong: [[round(q + m * p, 4), 'Check the sign. c = y − mx, so take mx away from y.'], [round(q - n * p, 4), 'Use the gradient of M, not the gradient of L.'], [q, 'c is not the y-coordinate of P. First take mx away from it.']] },
      ],
      steps: [`Gradient of L = (${y2} − ${sg(y1)}) ÷ (${x2} − ${x1}) = ${n}.`, `Perpendicular: ${n} × m = −1, so m = −1 ÷ ${sg(n)} = ${m}.`, `${q} = ${sg(m)} × ${sg(p)} + c, so c = ${q} − ${sg(round(m * p, 4))} = ${c}.`],
    }),
    check: ({ p, q }, v) => near(v[0] * v[1], -1) && near(v[1] * p + v[2], q) }),

  fam({ id: 'g9.graphs.perpendicular-why-opposite', skill: 'G9_PARALLEL_PERPENDICULAR', outcome: 'G9.GRAPHS.f', rung: 2, form: 'why',
    draw: () => ({ m: randInt(2, 5), c1: randInt(1, 6), c2: randInt(1, 8), p: person() }),
    make: ({ m, c1, c2, p }) => ({
      question: `${p.name} says that ${lineEq(m, c1)} and ${lineEq(-m, c2)} are perpendicular, because the gradients are opposites. Why is ${p.name} wrong?`,
      options: [
        { text: `Gradients of perpendicular lines multiply to −1, and ${m} × ${sg(-m)} = ${sg(-m * m)}`, right: true },
        { text: 'Perpendicular lines must have the same gradient', right: false, why: 'Lines with the same gradient are parallel, not perpendicular.' },
        { text: 'Perpendicular lines must cross the y-axis at the same point', right: false, why: 'Where a line crosses the y-axis has nothing to do with its angle to another line.' },
        { text: 'Perpendicular lines must have gradients that add up to 1', right: false, why: 'It is the product of the two gradients that matters, not the sum.' },
      ],
      hints: ['What must the two gradients do when you multiply them?', 'Try multiplying the two gradients in this question.'],
      steps: [`The gradients are ${m} and ${sg(-m)}.`, `${m} × ${sg(-m)} = ${sg(-m * m)}, not −1, so the lines are not perpendicular.`],
    }) }),

  fam({ id: 'g9.graphs.perpendicular-spot', skill: 'G9_PARALLEL_PERPENDICULAR', outcome: 'G9.GRAPHS.f', rung: 3, form: 'spot',
    draw: () => {
      const m = pick([2, 4, 5]), c0 = randInt(1, 7), p = m * randInt(1, 3), q = randInt(-4, 7);
      if (q + p / m === 0) return null;
      return { m, c0, p, q, kind: pick(['recip', 'neg', 'sign', 'csign']) };
    },
    make: ({ m, c0, p, q, kind }) => {
      const trueG = -1 / m;
      const shownG = kind === 'recip' ? 1 / m : kind === 'neg' ? -m : trueG;
      const gText = (g) => (near(g, -1 / m) ? `−1/${m}` : near(g, 1 / m) ? `1/${m}` : sg(g));
      const cTrue = q - trueG * p;
      const cShown = kind === 'sign' ? q + trueG * p : q - shownG * p;
      const eqText = (g, c) => `y = (${gText(g)})x${c < 0 ? ` − ${-c}` : ` + ${c}`}`;
      const finalText = kind === 'csign' ? eqText(trueG, -cTrue) : eqText(shownG, cShown);
      const working = [
        { text: `The gradient of ${lineEq(m, c0)} is ${m}.`, ok: m === m },
        { text: `The perpendicular gradient is ${gText(shownG)}.`, ok: near(shownG, trueG) },
        { text: `Put in the point ${pt(p, q)}: ${sg(q)} = (${gText(shownG)}) × ${sg(p)} + c, so c = ${sg(q)} − (${sg(round(shownG * p, 4))}).`, ok: true },
        { text: `c = ${sg(cShown)}`, ok: near(cShown, q - shownG * p) },
        { text: `The line is ${finalText}.`, ok: finalText === eqText(shownG, cShown) },
      ];
      const fixes = { recip: 'The perpendicular gradient was only turned upside down. It must change sign as well, so that the two gradients multiply to −1.', neg: 'The sign was changed but the number was not turned upside down. The two gradients must multiply to −1.', sign: 'c = y − mx. The product mx was added to y instead of being taken away.', csign: 'The value of c was found correctly but written with the wrong sign in the final equation.' };
      return { question: `Wekesa worked out the equation of the line perpendicular to ${lineEq(m, c0)} that passes through ${pt(p, q)}. Which step has the mistake?`,
        working, fix: fixes[kind],
        steps: [`The perpendicular gradient is −1/${m}.`, `c = ${sg(q)} − (−1/${m}) × ${sg(p)} = ${sg(cTrue)}.`] };
    } }),

  fam({ id: 'g9.graphs.fare-rate', skill: 'G9_PARALLEL_PERPENDICULAR', outcome: 'G9.GRAPHS.g', rung: 2, form: 'graph',
    draw: () => {
      const rate = pick([50, 100]), fix = pick([50, 100, 150]);
      const y4 = fix + 4 * rate;
      if (!allDistinct(rate, fix, y4, y4 / 4)) return null;
      return { rate, fix };
    },
    make: ({ rate, fix }) => {
      const xs = [0, 1, 2, 3, 4], y = (x) => fix + rate * x, top = y(4), step = top > 300 ? 100 : 50;
      const yTicks = []; for (let v = 0; v <= Math.ceil(top / step) * step; v += step) yTicks.push(v);
      return { question: 'The graph shows the charge of a taxi for trips of up to 4 km. How much does the taxi charge for each km? Answer in shillings.',
        model: { type: 'line-graph', data: { points: xs.map(x => ({ x, y: y(x) })), xTicks: xs, yTicks, xLabel: 'Distance (km)', yLabel: 'Charge (sh)' } },
        answer: rate,
        wrong: [[fix, 'That is the charge before the taxi has moved at all. The question asks how much each km adds.'], [y(4), 'That is the charge for 4 km altogether. Look at how much the line rises for each km.'], [y(4) / 4, 'That divides the whole charge, including the fixed part, by 4. Find how much the line rises for 1 km.']],
        hints: ['Read the charge at two distances.', 'The gradient is the rise for each 1 km along.'],
        steps: [`At 1 km the charge is sh ${y(1)}. At 2 km it is sh ${y(2)}.`, `The line rises ${y(2)} − ${y(1)} = ${rate} for each km, so the charge is sh ${rate} per km.`] };
    },
    check: ({ rate, fix }, a) => (fix + 3 * rate - (fix + rate)) / 2 === a }),

  fam({ id: 'g9.graphs.tariff-fixed', skill: 'G9_PARALLEL_PERPENDICULAR', outcome: 'G9.GRAPHS.g', rung: 2, form: 'table',
    draw: () => {
      const r = pick([40, 50, 60, 80]), fix = pick([40, 60, 80, 100, 120]), x = [2, 4, 6];
      const y = x.map(v => fix + r * v);
      if (!allDistinct(fix, y[0], r, y[0] / 2)) return null;
      return { r, fix, x, y };
    },
    make: ({ r, fix, x, y }) => ({
      question: 'A taxi firm charges a fixed amount plus a charge for each km. The table shows its charges for three trips (an example). What is the fixed charge, in shillings?',
      model: { type: 'table', data: { head: ['Distance', 'Charge'], rows: x.map((v, i) => ({ label: `${v} km`, value: sh(y[i]) })) } },
      answer: fix,
      wrong: [[y[0], 'That is the charge for the shortest trip, which includes the charge for the km.'], [r, 'That is the charge for each km. The fixed charge is the part paid even for a trip of 0 km.'], [y[0] / 2, 'Dividing the charge by the distance mixes the fixed part into the rate. Find the rate from the rise first.']],
      hints: ['Find how much the charge goes up for each extra km.', 'Take away the km charge for one trip. What is left is the fixed charge.'],
      steps: [`From ${x[0]} km to ${x[1]} km the charge rises by ${y[1] - y[0]}, so each km costs ${r}.`, `${x[0]} km costs ${x[0]} × ${r} = ${x[0] * r}. The rest of sh ${y[0]} is the fixed charge: ${y[0]} − ${x[0] * r} = ${fix}.`],
    }),
    check: ({ r, x, y }, a) => a + r * x[2] === y[2] }),

  fam({ id: 'g9.graphs.tariff-cross', skill: 'G9_PARALLEL_PERPENDICULAR', outcome: 'G9.GRAPHS.g', rung: 2, form: 'graph',
    draw: () => {
      const x0 = pick([2, 3, 4]), rB = pick([20, 30, 40]), D = pick([10, 20]), fA = pick([40, 60, 80]);
      const rA = rB + D, fB = fA + D * x0, y0 = fA + rA * x0;
      if (!allDistinct(x0, y0, fB, D)) return null;
      return { x0, rA, rB, fA, fB, y0, D };
    },
    make: ({ x0, rA, rB, fA, fB, y0, D }) => {
      const xs = [0, 1, 2, 3, 4, 5, 6], ya = (x) => fA + rA * x, yb = (x) => fB + rB * x;
      const top = Math.max(ya(6), yb(6)), yTicks = []; for (let v = 0; v <= Math.ceil(top / 100) * 100; v += 100) yTicks.push(v);
      return { question: 'Two boda boda riders charge as shown on the graph. For what distance do both charge the same? Answer in km.',
        model: { type: 'line-graph', data: { lines: [xs.map(x => ({ x, y: ya(x) })), xs.map(x => ({ x, y: yb(x) }))], xTicks: xs, yTicks, xLabel: 'Distance (km)', yLabel: 'Charge (sh)' } },
        answer: x0,
        wrong: [[y0, 'That is the charge where the lines meet, read on the upright axis. The question asks for the distance, read along the bottom.'], [fB, 'That is where the higher line starts on the upright axis. Find where the two lines meet.'], [D, 'That is not read from the graph. Look for the point where the two lines cross.']],
        hints: ['The charges are equal where the two lines cross.', 'Read the distance under the crossing point.'],
        steps: ['Find the point where the two lines cross.', `Go straight down from that point to the distance axis: ${x0} km.`, `Check: both charges are sh ${y0} at ${x0} km.`] };
    },
    check: ({ x0, rA, rB, fA, fB }, a) => fA + rA * a === fB + rB * a }),

  // =========================== SCALE DRAWING: BEARINGS ===========================
  fam({ id: 'g9.bearings.turn-clockwise', skill: 'G9_BEARINGS', outcome: 'G9.SCALE.a', rung: 2, form: 'word',
    draw: () => {
      const b = randInt(2, 33) * 10, t = randInt(6, 20) * 10, ans = (b + t) % 360;
      if (ans < 100) return null;
      const w = [(b - t + 360) % 360, t, (ans + 180) % 360];
      if (!allDistinct(ans, ...w) || w.some(v => v < 10)) return null;
      return { b, t, ans, w, what: pick(['A boat', 'A cyclist', 'A hiker', 'A motorbike']) };
    },
    make: ({ b, t, ans, w, what }) => ({
      question: `${what} sets off on a bearing of ${pad3(b)}°. It turns clockwise through ${t}° and goes on. What is its new bearing?`,
      answer: ans,
      wrong: [[w[0], 'Clockwise means the bearing gets bigger. This turned the other way.'], [w[1], 'That is the size of the turn. The new bearing is measured from north again, so start from the old bearing.'], [w[2], 'That is the opposite direction to the one it is now heading in.']],
      hints: ['Clockwise turns add to a bearing.', 'A bearing goes once round from north, up to 360°.'],
      steps: [`New bearing = ${b} + ${t} = ${b + t}.`, b + t >= 360 ? `${b + t} is more than 360, so take away a full turn: ${b + t} − 360 = ${ans}.` : `That is less than 360, so the bearing is ${ans}°.`],
    }),
    check: ({ b, t }, a) => (a - b - t) % 360 === 0 }),

  fam({ id: 'g9.bearings.back-bearing-spot', skill: 'G9_BEARINGS', outcome: 'G9.SCALE.b', rung: 2, form: 'spot',
    draw: () => {
      const th = pick([20, 40, 50, 70, 110, 130, 150, 200, 220, 250, 290, 310, 340]);
      return { th, kind: pick(['rule', 'sum']), slip: pick([10, -10, 20]) };
    },
    make: ({ th, kind, slip }) => {
      const back = th < 180 ? th + 180 : th - 180;
      const op = th < 180 ? '+' : '−';
      const ruleText = kind === 'rule' ? `360 − ${th}` : `${th} ${op} 180`;
      const ruleVal = kind === 'rule' ? 360 - th : back;
      const sumVal = kind === 'sum' ? back + slip : ruleVal;
      const working = [
        { text: `The bearing of the church from the school is ${pad3(th)}°.`, ok: true },
        { text: `The bearing of the school from the church is ${ruleText}.`, ok: ruleVal === back },
        { text: `${ruleText} = ${sumVal}`, ok: sumVal === ruleVal },
        { text: `The bearing of the school from the church is ${pad3(sumVal)}°.`, ok: true },
      ];
      return { question: `Zawadi works out the bearing of a school from a church. The bearing of the church from the school is ${pad3(th)}°. Which step has the mistake?`,
        working,
        fix: kind === 'rule' ? 'A back bearing is found by adding or taking away 180°, not by taking the bearing from 360°.' : `The sum was worked out wrongly. ${ruleText} does not give ${sumVal}.`,
        steps: [`${th} is ${th < 180 ? 'less' : 'more'} than 180, so ${th < 180 ? 'add' : 'subtract'} 180: the back bearing is ${pad3(back)}°.`, 'Always give a bearing as three figures.'] };
    } }),

  fam({ id: 'g9.bearings.isosceles-legs', skill: 'G9_BEARINGS', outcome: 'G9.SCALE.b', rung: 3, form: 'steps',
    draw: () => ({ east: Math.random() < 0.5, d: pick([3, 4, 5, 6, 8]), a: pick(['the school', 'the clinic', 'the chief\'s camp']) }),
    make: ({ east, d, a }) => {
      const dir = east ? 'east' : 'west', bB = east ? 90 : 270, bC = east ? 225 : 135, bBack = east ? 45 : 315;
      return { question: `A church is ${d} km due ${dir} of ${a}. A market is ${d} km due south of the same place. Give each bearing in degrees.`,
        parts: [
          { prompt: `Find the bearing of the church from ${a}.`, answer: bB, unit: '°', hint: `Due ${dir} is a quarter turn clockwise from north, or three quarters.`, wrong: [[bB === 90 ? 270 : 90, 'Bearings turn clockwise from north. Check which way you turned.']] },
          { prompt: `Find the bearing of the market from ${a}.`, answer: 180, unit: '°', hint: 'Due south is half a turn from north.', wrong: [[0, 'That is due north. The market is due south.']] },
          { prompt: 'The two distances are equal, so the triangle is right-angled and isosceles. Find the bearing of the market from the church.', answer: bC, unit: '°', hint: 'Each base angle is 45°. Which way from the church is the market?', wrong: [[bBack, 'That is the bearing of the church from the market, the other way round.']] },
          { prompt: 'Now find the bearing of the church from the market.', answer: bBack, unit: '°', hint: 'A back bearing differs from the first bearing by 180°.', wrong: [[bC, 'That is the bearing of the market from the church. This part asks the other way round.']] },
        ],
        steps: [`Due ${dir} is ${bB}°, and due south is 180°.`, `The base angles are each 45°, so the market is south-${east ? 'west' : 'east'} of the church: ${bC}°.`, `The back bearing differs by 180°: ${bBack}°.`] };
    },
    check: ({ east }, v) => v[1] === 180 && v[0] === (east ? 90 : 270) && (v[2] + 180) % 360 === v[3] && Math.abs(v[2] - v[1]) === 45 }),

  fam({ id: 'g9.bearings.distance-from-start', skill: 'G9_BEARINGS', outcome: 'G9.SCALE.c', rung: 2, form: 'word',
    draw: () => {
      const [a, b, h] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]]);
      const [b1, b2] = pick([[90, 180], [180, 270], [270, 0], [0, 90]]);
      if (!allDistinct(h, a + b, h * h, b - a)) return null;
      return { a, b, h, b1, b2, what: pick(['A boat', 'A hiker', 'A drone']) };
    },
    make: ({ a, b, h, b1, b2, what }) => ({
      question: `${what} goes ${a} km on a bearing of ${pad3(b1)}°. Then it goes ${b} km on a bearing of ${pad3(b2)}°. How far is it from where it started, in km?`,
      answer: h,
      wrong: [[a + b, 'That is the total distance travelled. The question asks how far it is in a straight line from the start.'], [h * h, 'That is the sum of the squares. Take the square root to get the length.'], [b - a, 'The two legs are at right angles. Do not subtract them: use the right-angled triangle.']],
      hints: ['The two bearings differ by 90°, so the path and the straight line make a right-angled triangle.', 'The straight line back is the longest side of that triangle.'],
      steps: [`The bearings ${pad3(b1)}° and ${pad3(b2)}° are at right angles.`, `Distance² = ${a}² + ${b}² = ${a * a + b * b}.`, `Distance = √${a * a + b * b} = ${h} km.`],
    }),
    check: ({ a, b }, ans) => ans * ans === a * a + b * b }),

  fam({ id: 'g9.bearings.which-direction', skill: 'G9_BEARINGS', outcome: 'G9.SCALE.c', rung: 1, form: 'why',
    draw: () => ({ b: pick([45, 135, 225, 315]), d: pick([3, 5, 8, 12]), k: randInt(0, 3) }),
    make: ({ b, d, k }) => {
      const NAME = { 45: 'north-east', 135: 'south-east', 225: 'south-west', 315: 'north-west' };
      const opts = [45, 135, 225, 315].map(v => ({ text: `Towards the ${NAME[v]}`, right: v === b, why: v === b ? undefined : `That direction is a bearing of ${pad3(v)}°. Count clockwise from north to ${b}°.` }));
      return { question: `To locate a village on a map, a learner is told to walk ${d} km on a bearing of ${pad3(b)}° from the school. In which direction does the learner walk?`, story: true,
        options: turn(opts, k), fixedOrder: true,
        hints: ['Bearings are measured clockwise from north.', 'Due east is 090°, due south is 180° and due west is 270°.'],
        steps: [`${pad3(b)}° lies between ${b < 180 ? (b < 90 ? '000° and 090°' : '090° and 180°') : (b < 270 ? '180° and 270°' : '270° and 360°')}.`, `So the learner walks towards the ${NAME[b]}.`] };
    } }),

  // =========================== ANGLES OF ELEVATION AND DEPRESSION ===========================
  fam({ id: 'g9.elevation.eye-height-45', skill: 'G9_ELEVATION_DEPRESSION', outcome: 'G9.SCALE.d', rung: 2, form: 'steps',
    draw: () => ({ d: pick([12, 15, 18, 20, 24, 30]), eye: pick([1.2, 1.5, 1.6]), flag: pick([2, 3, 4]) }),
    make: ({ d, eye, flag }) => ({
      question: `A radio mast is sighted with a clinometer held ${eye} m above level ground. The clinometer is ${d} m from the foot of the mast. It reads 45° for the top of the mast.`,
      parts: [
        { prompt: 'The reading is the angle of elevation of the top. How high is the top above the clinometer, in metres?', answer: d, unit: 'm', hint: 'A right-angled triangle with a 45° angle has two equal short sides.', wrong: [[eye, 'That is the height of the clinometer above the ground. Use the 45° angle to find the height above it.']] },
        { prompt: 'How high is the mast above the ground, in metres?', answer: round(d + eye, 1), unit: 'm', hint: 'Add the height of the clinometer above the ground.', wrong: [[d, 'That is the height above the clinometer only. The clinometer is not at ground level.'], [round(d - eye, 1), 'The clinometer is above the ground, so add its height, do not take it away.']] },
        { prompt: `A ${flag} m aerial stands on top of the mast. How high is the top of the aerial above the ground, in metres?`, answer: round(d + eye + flag, 1), unit: 'm', hint: 'Add the aerial to the height of the mast.', wrong: [[round(d + flag, 1), 'Do not forget the height of the clinometer above the ground.']] },
      ],
      steps: [`With a 45° angle, the two short sides are equal: the top is ${d} m above the clinometer.`, `Mast height = ${d} + ${eye} = ${round(d + eye, 1)} m.`, `With the aerial: ${round(d + eye, 1)} + ${flag} = ${round(d + eye + flag, 1)} m.`],
    }),
    check: ({ d, eye, flag }, v) => v[0] === d && near(v[1] - eye, v[0]) && near(v[2] - v[1], flag) }),

  fam({ id: 'g9.depression.equals-elevation-why', skill: 'G9_ELEVATION_DEPRESSION', outcome: 'G9.SCALE.f', rung: 2, form: 'why',
    draw: () => ({ a: randInt(18, 42), k: randInt(0, 3), what: pick(['the boat', 'the swimmer', 'the canoe']), p: person() }),
    make: ({ a, k, what, p }) => {
      const opts = [
        { text: 'The two horizontal lines are parallel, so the angles are alternate angles and equal', right: true },
        { text: 'The angles of depression and elevation always add up to 90°', right: false, why: `If they added to 90°, the angle looking up would be ${90 - a}°. They are equal, not complementary.` },
        { text: 'Because the hill stands upright, the angle looking up must be the same', right: false, why: 'The cliff being upright does not make the angles equal. The horizontal lines do.' },
        { text: 'The angle looking up is always smaller, because the observer is lower', right: false, why: 'Being lower does not change the angle. Look at the horizontal lines.' },
      ];
      return { question: `${p.name} measures an angle of depression of ${a}° from a hill top down to ${what}. ${p.She} says the angle looking up from ${what} to the hill top is also ${a}°. Why is ${p.she} right?`,
        options: turn(opts, k), fixedOrder: true,
        hints: [`Draw a horizontal line from the hill top and another from ${what}.`, 'Those two horizontal lines are parallel, and the line of sight crosses them.'],
        steps: ['Both angles are measured from a horizontal line to the same line of sight.', 'The horizontal lines are parallel, so the two angles are alternate angles, and alternate angles are equal.'] };
    } }),

  fam({ id: 'g9.depression.two-canoes', skill: 'G9_ELEVATION_DEPRESSION', outcome: 'G9.SCALE.f', rung: 2, form: 'word',
    draw: () => { const h = pick([24, 30, 36, 40, 45, 60]), gap = pick([15, 20, 25, 30]); return allDistinct(h, gap, h + gap, h - gap) && h !== gap ? { h, gap } : null; },
    make: ({ h, gap }) => ({
      question: `A guard on top of a ${h} m watch tower on the shore of Lake Victoria sees two canoes in a straight line out from the tower. The nearer canoe is at an angle of depression of 45°. The farther canoe is ${gap} m beyond it. How far is the farther canoe from the foot of the tower, in metres?`,
      answer: h + gap,
      wrong: [[h, 'That is how far the nearer canoe is from the tower. The farther canoe is beyond it.'], [gap, 'That is only the extra distance. Add it to the distance of the nearer canoe.'], [Math.abs(h - gap), 'Farther away means adding the extra distance, not taking it away.']],
      hints: ['At 45°, the distance from the foot of the tower equals the height of the tower.', 'The farther canoe is beyond the nearer one by the extra distance given.'],
      steps: [`At 45°, the nearer canoe is ${h} m from the foot of the tower.`, `The farther canoe is ${gap} m beyond it: ${h} + ${gap} = ${h + gap} m.`],
    }),
    check: ({ h, gap }, a) => a - gap === h }),

  // =========================== SIMILARITY AND ENLARGEMENT ===========================
  fam({ id: 'g9.similar.table-missing-side', skill: 'G8_SIMILARITY', outcome: 'G9.SIMILAR.a', rung: 2, form: 'table',
    draw: () => {
      const a = pick([4, 6, 8, 10]), b = a + 2 * randInt(1, 3), c = b + 2 * randInt(1, 2), k = pick([1.5, 2, 2.5, 3]);
      if (![a, b, c].every(v => Number.isInteger(v * k))) return null;
      if (!allDistinct(b * k, round(b / k, 2), a * k, b + (a * k - a))) return null;
      return { a, b, c, k };
    },
    make: ({ a, b, c, k }) => ({
      question: 'The table gives the sides of two similar triangles. Find the missing side of the large triangle, in cm.',
      model: { type: 'table', data: { head: ['Side', 'Small triangle', 'Large triangle'], rows: [{ cells: ['Shortest', `${a} cm`, `${a * k} cm`] }, { cells: ['Middle', `${b} cm`, '?'] }, { cells: ['Longest', `${c} cm`, `${c * k} cm`] }] } },
      answer: b * k,
      wrong: [[b + (a * k - a), 'The large triangle is not found by adding the same length to each side. Sides of similar shapes are multiplied by the same scale factor.'], [round(b / k, 2), 'The large triangle is bigger, so the missing side must be bigger than its partner. Multiply by the scale factor.'], [a * k, 'That is the side that matches the shortest side. Find the one that matches the middle side.']],
      hints: ['Find the scale factor from a row where both sides are known.', 'Multiply the middle side of the small triangle by the scale factor.'],
      steps: [`Scale factor = ${a * k} ÷ ${a} = ${k}.`, `Missing side = ${b} × ${k} = ${b * k} cm.`],
    }),
    check: ({ a, b, k }, ans) => ans / b === (a * k) / a }),

  fam({ id: 'g9.similar.rectangles-added-length', skill: 'G8_SIMILARITY', outcome: 'G9.SIMILAR.a', rung: 2, form: 'why',
    draw: () => {
      const a = pick([10, 20, 25]), b = pick([20, 25, 40, 50]), g = pick([5, 10]);
      const r1 = (a + g) / a, r2 = (b + g) / b;
      if (!Number.isInteger(r1 * 100) || !Number.isInteger(r2 * 100) || r1 === r2 || a >= b) return null;
      return { a, b, g, r1, r2, p: person() };
    },
    make: ({ a, b, g, r1, r2, p }) => ({
      question: `A photo is ${b} cm by ${a} cm. It is printed again at ${b + g} cm by ${a + g} cm. ${p.name} says the two photos are similar, because each side grew by ${g} cm. Why is ${p.she} wrong?`,
      options: [
        { text: `The length is multiplied by ${r2} but the width by ${r1}, so the scale factors are not equal`, right: true },
        { text: 'Similar shapes must have sides that are all equal', right: false, why: 'Similar shapes need equal scale factors, not equal sides. A rectangle can be similar to a larger rectangle.' },
        { text: 'A larger photo can never be similar to a smaller one', right: false, why: 'An enlargement of a shape is always similar to it.' },
        { text: 'Adding the same length to each side always gives a similar shape', right: false, why: 'Adding the same length changes the proportions. Similar shapes come from multiplying by the same factor.' },
      ],
      hints: ['Compare new length ÷ old length with new width ÷ old width.', 'For similar shapes, both sides must be multiplied by the same number.'],
      steps: [`Length: ${b + g} ÷ ${b} = ${r2}. Width: ${a + g} ÷ ${a} = ${r1}.`, 'The scale factors are different, so the photos are not similar.'],
    }) }),

  fam({ id: 'g9.similar.pole-and-tree', skill: 'G8_SIMILARITY', outcome: 'G9.SIMILAR.a', rung: 2, form: 'word',
    draw: () => {
      const hp = pick([2, 3, 4]), sp = pick([2, 3, 4]), k = pick([3, 4, 5, 6]);
      const ht = hp * k, st = sp * k;
      if (!allDistinct(ht, hp + (st - sp), round((hp * sp) / st, 2), st)) return null;
      return { hp, sp, ht, st, thing: pick(['tree', 'water tank', 'church tower']) };
    },
    make: ({ hp, sp, ht, st, thing }) => ({
      question: `At noon, a ${hp} m pole casts a shadow of ${sp} m. At the same time, a ${thing} casts a shadow of ${st} m. The pole and its shadow, and the ${thing} and its shadow, make similar triangles. How tall is the ${thing}, in metres?`,
      answer: ht,
      wrong: [[hp + (st - sp), 'The shadow is longer by a scale factor, not by adding. Multiply the pole by the same factor.'], [round((hp * sp) / st, 2), 'The tall thing has the longer shadow, so it must be taller than the pole.'], [st, 'That is the length of the shadow. The question asks for the height.']],
      hints: ['Compare the two shadows to find the scale factor.', 'Use the same scale factor on the height of the pole.'],
      steps: [`Scale factor = ${st} ÷ ${sp} = ${st / sp}.`, `Height = ${hp} × ${st / sp} = ${ht} m.`],
    }),
    check: ({ hp, sp, st }, a) => a * sp === hp * st }),

  fam({ id: 'g9.similar.missing-side-spot', skill: 'G8_SIMILARITY', outcome: 'G9.SIMILAR.a', rung: 2, form: 'spot',
    draw: () => {
      const a = pick([4, 6, 8, 10]), k = pick([1.5, 2, 2.5, 3]), b = pick([6, 8, 10, 12]);
      if (!Number.isInteger(a * k) || !Number.isInteger(b * k) || a === b) return null;
      return { a, b, k, kind: pick(['add', 'flip', 'div']) };
    },
    make: ({ a, b, k, kind }) => {
      const A = a * k, X = b * k;
      let w;
      if (kind === 'add') {
        const diff = A - a;
        w = [{ text: `The sides ${a} and ${A} match.`, ok: true }, { text: `The large triangle is ${A} − ${a} = ${diff} cm longer.`, ok: false }, { text: `So x = ${b} + ${diff}.`, ok: true }, { text: `x = ${b + diff} cm`, ok: true }];
      } else if (kind === 'flip') {
        const f = round(a / A, 3);
        w = [{ text: `The sides ${a} and ${A} match.`, ok: true }, { text: `Scale factor = ${a} ÷ ${A} = ${f}.`, ok: near(f, k, 1e-3) }, { text: `x = ${b} × ${f}.`, ok: true }, { text: `x = ${round(b * f, 2)} cm`, ok: true }];
      } else {
        w = [{ text: `The sides ${a} and ${A} match.`, ok: true }, { text: `Scale factor = ${A} ÷ ${a} = ${k}.`, ok: true }, { text: `x = ${b} ÷ ${k}.`, ok: false }, { text: `x = ${round(b / k, 2)} cm`, ok: true }];
      }
      const fixes = { add: 'Similar triangles are enlarged by multiplying, not by adding the same length to every side.', flip: 'The scale factor was found the wrong way up. It is the large side ÷ the small side.', div: 'The scale factor is a multiplier for going to the large triangle. Multiply, do not divide.' };
      return { question: `Mutua finds the missing side x of two similar triangles. In the small triangle two sides are ${a} cm and ${b} cm. In the large triangle, the side that matches ${a} cm is ${A} cm, and x matches ${b} cm. Which step has the mistake?`,
        working: w, fix: fixes[kind], steps: [`Scale factor = ${A} ÷ ${a} = ${k}.`, `x = ${b} × ${k} = ${X} cm.`] };
    } }),

  fam({ id: 'g9.enlarge.then-translate', skill: 'G9_TRANSFORMATIONS_ADV', outcome: 'G9.SIMILAR.c', rung: 2, form: 'steps', allowNegative: true,
    draw: () => {
      const a = randInt(-4, 5), b = randInt(-4, 5), k = pick([2, 3]);
      if (a === 0 || b === 0 || Math.abs(a) === Math.abs(b)) return null;
      const px = pick([-1, 1]) * randInt(1, 6), py = pick([-1, 1]) * randInt(1, 6);
      return { a, b, k, px, py };
    },
    make: ({ a, b, k, px, py }) => ({
      question: `The point A is at ${pt(a, b)}. It is enlarged with the origin as centre of enlargement and scale factor ${k}. This gives A'. Then A' is translated ${Math.abs(px)} units ${px < 0 ? 'left' : 'right'} and ${Math.abs(py)} units ${py < 0 ? 'down' : 'up'} to give A''.`,
      parts: [
        { prompt: "Find the x-coordinate of A'.", answer: a * k, hint: 'With the origin as centre, each coordinate is multiplied by the scale factor.', wrong: [[a + k, 'An enlargement multiplies the coordinate. It does not add the scale factor.']] },
        { prompt: "Find the y-coordinate of A'.", answer: b * k, hint: 'Multiply the y-coordinate of A by the scale factor.', wrong: [[b + k, 'An enlargement multiplies the coordinate. It does not add the scale factor.']] },
        { prompt: "Find the x-coordinate of A''.", answer: a * k + px, hint: 'Left makes x smaller. Right makes x bigger.', wrong: [[a * k - px, `Check the direction: the move is ${px < 0 ? 'left' : 'right'}.`], [a + px, 'Move A\' by the translation, not A.']] },
        { prompt: "Find the y-coordinate of A''.", answer: b * k + py, hint: 'Down makes y smaller. Up makes y bigger.', wrong: [[b * k - py, `Check the direction: the move is ${py < 0 ? 'down' : 'up'}.`], [b + py, 'Move A\' by the translation, not A.']] },
      ],
      steps: [`A' = (${a} × ${k}, ${b} × ${k}) = ${pt(a * k, b * k)}.`, `Translate: x changes by ${sg(px)} and y changes by ${sg(py)}.`, `A'' = ${pt(a * k + px, b * k + py)}.`],
    }),
    check: ({ a, b, k, px, py }, v) => v[0] / k === a && v[1] / k === b && v[2] - v[0] === px && v[3] - v[1] === py }),

  fam({ id: 'g9.enlarge.find-centre', skill: 'G9_TRANSFORMATIONS_ADV', outcome: 'G9.SIMILAR.c', rung: 3, form: 'word', allowNegative: true,
    draw: () => {
      const cx = randInt(-3, 3), cy = randInt(-3, 3), k = pick([2, 3]), ax = cx + pick([-1, 1]) * randInt(1, 3), ay = cy + pick([-1, 1]) * randInt(1, 3);
      const bx = cx + k * (ax - cx), by = cy + k * (ay - cy);
      if (!allDistinct(cx, round(bx / k, 2), bx - ax, (ax + bx) / 2)) return null;
      return { cx, k, ax, ay, bx, by };
    },
    make: ({ cx, k, ax, ay, bx, by }) => ({
      question: `An enlargement with scale factor ${k} maps the object point A ${pt(ax, ay)} onto the image point A' ${pt(bx, by)}. What is the x-coordinate of the centre of enlargement?`,
      answer: cx,
      wrong: [[round(bx / k, 2), 'That divides the image by the scale factor as if the centre were the origin. The centre is not the origin here.'], [bx - ax, 'That is the shift in x from A to A\'. It is not the position of the centre.'], [(ax + bx) / 2, 'The centre of enlargement is not half way between the object and the image.']],
      hints: ['The centre, A and A\' lie on one straight line, and A\' is the scale factor times as far from the centre as A.', 'Let the centre have x-coordinate c. Then bx − c = k × (ax − c).'],
      steps: [`Distance from the centre in x: A' is ${k} times as far as A, so ${sg(bx)} − c = ${k}(${sg(ax)} − c).`, `${sg(bx)} − c = ${sg(k * ax)} − ${k}c, so ${k - 1}c = ${sg(k * ax - bx)}, and c = ${cx}.`],
    }),
    check: ({ k, ax, bx }, a) => a + k * (ax - a) === bx }),

  fam({ id: 'g9.scalefactor.area-photo', skill: 'G9_TRANSFORMATIONS_ADV', outcome: 'G9.SIMILAR.e', rung: 2, form: 'word',
    draw: () => {
      const k = pick([2, 3, 4]), A = k * k * randInt(2, 6);
      return { k, A, what: pick(['school badge', 'photo', 'floor plan', 'poster']) };
    },
    make: ({ k, A, what }) => ({
      question: `A small ${what} has an area of ${A} cm². It is enlarged with a linear scale factor of ${k}. What is the area of the enlarged ${what}, in cm²?`,
      answer: A * k * k,
      wrong: [[A * k, 'The linear scale factor multiplies lengths. Area is length × length, so the area factor is bigger.'], [A * k * k * k, 'Three factors of the scale factor are for volume. Area has two.'], [A / (k * k), 'An enlargement makes the area bigger, so multiply.']],
      hints: ['Area is found by multiplying two lengths.', 'The area scale factor is the linear scale factor squared.'],
      steps: [`Area scale factor = ${k} × ${k} = ${k * k}.`, `New area = ${A} × ${k * k} = ${A * k * k} cm².`],
    }),
    check: ({ k, A }, a) => a / A === k * k }),

  fam({ id: 'g9.scalefactor.volume-tank', skill: 'G9_TRANSFORMATIONS_ADV', outcome: 'G9.SIMILAR.e', rung: 2, form: 'word',
    draw: () => {
      const k = pick([2, 4, 5]), V = pick([5, 8, 10, 20]);
      return { k, V };
    },
    make: ({ k, V }) => ({
      question: `A farmer's water tank holds ${V} litres. A similar tank is built with a linear scale factor of ${k}. How many litres does the new tank hold?`,
      answer: V * k * k * k,
      wrong: [[V * k, 'That multiplies by the scale factor once. Volume depends on length, width and height.'], [V * k * k, 'That is the area factor. Volume has one more length to multiply.'], [V * 3 * k, 'Volume is multiplied by the scale factor three times, not by 3 times the scale factor.']],
      hints: ['Volume depends on three lengths: length, width and height.', 'The volume scale factor is the linear scale factor cubed.'],
      steps: [`Volume scale factor = ${k} × ${k} × ${k} = ${k * k * k}.`, `New volume = ${V} × ${k * k * k} = ${V * k * k * k} litres.`],
    }),
    check: ({ k, V }, a) => a / V === k ** 3 }),

  fam({ id: 'g9.scalefactor.paint-tins', skill: 'G9_TRANSFORMATIONS_ADV', outcome: 'G9.SIMILAR.e', rung: 3, form: 'steps',
    draw: () => ({ k: pick([2, 3, 4]), V: pick([1, 2, 3, 5]), A: pick([60, 80, 100, 150]) }),
    make: ({ k, V, A }) => ({
      question: `Two paint tins are similar. The small tin holds ${V} litres and the large tin holds ${V * k ** 3} litres. The label on the small tin has an area of ${A} cm².`,
      parts: [
        { prompt: 'How many times as much paint does the large tin hold?', answer: k ** 3, hint: 'Divide the large volume by the small volume.', wrong: [[k, 'That is the scale factor of lengths. Here you compare volumes.']] },
        { prompt: 'Find the linear scale factor from the small tin to the large tin.', answer: k, hint: 'The volume factor is the linear scale factor cubed. Which number cubed gives it?', wrong: [[round(k ** 3 / 3, 2), 'Volume does not go up by 3 times the linear factor. Find the cube root of the volume factor.']] },
        { prompt: 'Find the area scale factor.', answer: k * k, hint: 'Area factor = linear factor squared.', wrong: [[k, 'That is the linear factor. Area uses the square of it.'], [k ** 3, 'That is the volume factor. Area uses the square of the linear factor.']] },
        { prompt: 'Find the area of the label on the large tin, in cm².', answer: A * k * k, unit: 'cm²', hint: 'Multiply the small label area by the area scale factor.', wrong: [[A * k, 'Area is multiplied by the area scale factor, not the linear factor.'], [A * k ** 3, 'That uses the volume factor. A label is flat: use the area factor.']] },
      ],
      steps: [`Volume factor = ${V * k ** 3} ÷ ${V} = ${k ** 3}.`, `Linear factor = cube root of ${k ** 3} = ${k}.`, `Area factor = ${k} × ${k} = ${k * k}, so the label is ${A} × ${k * k} = ${A * k * k} cm².`],
    }),
    check: ({ k, A }, v) => v[1] ** 3 === v[0] && v[2] === v[1] * v[1] && v[3] === A * v[2] }),

  fam({ id: 'g9.scalefactor.doubling-box-why', skill: 'G9_TRANSFORMATIONS_ADV', outcome: 'G9.SIMILAR.e', rung: 2, form: 'why',
    draw: () => ({ k: pick([2, 3, 4]), r: randInt(0, 3), p: person() }),
    make: ({ k, r, p }) => {
      const opts = [
        { text: `Volume depends on three lengths, so it is multiplied by ${k} × ${k} × ${k} = ${k ** 3}`, right: true },
        { text: `Volume is multiplied by ${k}, because every length is multiplied by ${k}`, right: false, why: 'Volume has three lengths in it, so the factor is used three times.' },
        { text: `Volume is multiplied by ${k * k}, the factor for area`, right: false, why: 'That is the factor for flat surfaces. Volume has one more length.' },
        { text: 'Volume stays the same, because the shape of the box stays the same', right: false, why: 'The shape stays similar, but the box is bigger, so it holds more.' },
      ];
      return { question: `${p.name} makes a box with a linear scale factor of ${k} from a smaller box, so all its lengths are ${k} times as big. ${p.She} says it will hold ${k} times as much. Why is ${p.she} wrong?`,
        options: turn(opts, r), fixedOrder: true,
        hints: ['How many lengths are multiplied together to find a volume?', 'Each length is multiplied by the scale factor.'],
        steps: ['Volume = length × width × height.', `Each length is multiplied by ${k}, so the volume is multiplied by ${k} × ${k} × ${k} = ${k ** 3}.`] };
    } }),

  fam({ id: 'g9.scalefactor.similar-cartons-table', skill: 'G9_TRANSFORMATIONS_ADV', outcome: 'G9.SIMILAR.e', rung: 2, form: 'table',
    draw: () => {
      const [l, w, h] = pick([[10, 15, 20], [5, 8, 10], [10, 10, 25], [4, 6, 10], [8, 10, 20]]), k = pick([2, 3]), ask = pick(['area', 'volume']);
      const SA = 2 * (l * w + l * h + w * h), V = l * w * h;
      return { l, w, h, k, ask, SA, V };
    },
    make: ({ h, k, ask, SA, V }) => {
      const big = ask === 'area' ? SA * k * k : V * k ** 3;
      return { question: `The table gives measurements of two similar cartons. Use the scale factor to find the missing ${ask === 'area' ? 'surface area' : 'volume'} of the large carton, in ${ask === 'area' ? 'cm²' : 'cm³'}.`,
        model: { type: 'table', data: { head: ['Measure', 'Small carton', 'Large carton'], rows: [{ cells: ['Height (cm)', `${h}`, `${h * k}`] }, { cells: ['Surface area (cm²)', commas(SA), ask === 'area' ? '?' : commas(SA * k * k)] }, { cells: ['Volume (cm³)', commas(V), ask === 'volume' ? '?' : commas(V * k ** 3)] }] } },
        answer: big,
        wrong: ask === 'area'
          ? [[SA * k, 'The surface area is not multiplied by the linear scale factor. Area needs the factor squared.'], [SA * k ** 3, 'That is the volume factor. Surface area is flat.'], [SA + (h * k - h), 'The large carton is found by multiplying, not by adding the extra height.']]
          : [[V * k, 'Volume is not multiplied by the linear scale factor alone. It needs the factor cubed.'], [V * k * k, 'That is the area factor. Volume has one more length.'], [V + (h * k - h), 'The large carton is found by multiplying, not by adding the extra height.']],
        hints: ['Find the linear scale factor from the two heights.', ask === 'area' ? 'Surface area is multiplied by the scale factor squared.' : 'Volume is multiplied by the scale factor cubed.'],
        steps: [`Linear scale factor = ${h * k} ÷ ${h} = ${k}.`, ask === 'area' ? `Area factor = ${k * k}. Missing area = ${commas(SA)} × ${k * k} = ${commas(big)} cm².` : `Volume factor = ${k ** 3}. Missing volume = ${commas(V)} × ${k ** 3} = ${commas(big)} cm³.`] };
    },
    check: ({ h, k, ask, SA, V }, a) => (ask === 'area' ? a / SA === (k * h / h) ** 2 : a / V === (k * h / h) ** 3) }),

  // =========================== TRIGONOMETRY ===========================
  fam({ id: 'g9.trig.which-fraction', skill: 'G9_TRIG_INTRO', outcome: 'G9.TRIG.b', rung: 1, form: 'direct',
    draw: () => {
      const [x, y, z] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), m = pick([1, 2]);
      const legs = Math.random() < 0.5 ? [x * m, y * m] : [y * m, x * m];
      return { opp: legs[0], adj: legs[1], hyp: z * m, r: pick(['sin', 'cos', 'tan']), k: randInt(0, 3), ang: pick(['A', 'B']) };
    },
    make: ({ opp, adj, hyp, r, k, ang }) => {
      const F = { o: `${opp}/${hyp}`, a: `${adj}/${hyp}`, t: `${opp}/${adj}`, oi: `${hyp}/${opp}`, ai: `${hyp}/${adj}`, ti: `${adj}/${opp}` };
      const set = { sin: [['o', true], ['oi', 'flip'], ['a', 'cosine'], ['t', 'tangent']], cos: [['a', true], ['ai', 'flip'], ['o', 'sine'], ['t', 'tangent']], tan: [['t', true], ['ti', 'flip'], ['o', 'sine'], ['a', 'cosine']] }[r];
      const full = { sin: 'opposite ÷ hypotenuse', cos: 'adjacent ÷ hypotenuse', tan: 'opposite ÷ adjacent' }[r];
      const opts = set.map(([key, kind]) => ({ text: F[key], right: kind === true, why: kind === true ? undefined : kind === 'flip' ? 'That is the right fraction upside down. Check which side goes on top.' : `That fraction is the ratio for ${kind}, not for ${r === 'sin' ? 'sine' : r === 'cos' ? 'cosine' : 'tangent'}.` }));
      const BC = ang === 'A' ? opp : adj, AC = ang === 'A' ? adj : opp;
      return { question: `Triangle ABC has a right angle at C. AB = ${hyp} cm, BC = ${BC} cm and AC = ${AC} cm. Which fraction is equal to ${r} ${ang}?`, story: false,
        options: turn(opts, k), fixedOrder: true,
        hints: ['Remember SOH CAH TOA.', `Which side is opposite angle ${ang}, which is next to it, and which is the hypotenuse?`],
        steps: [`Opposite angle ${ang}: ${opp} cm. Next to angle ${ang}: ${adj} cm. Hypotenuse: ${hyp} cm.`, `${r} ${ang} = ${full} = ${F[set[0][0]]}.`] };
    } }),

  fam({ id: 'g9.trig.find-side-spot', skill: 'G9_TRIG_INTRO', outcome: 'G9.TRIG.b', rung: 2, form: 'spot',
    draw: () => ({ A: pick([20, 25, 35, 40, 55, 65]), H: pick([12, 15, 20, 25, 30, 40]), side: pick(['opposite', 'adjacent']), kind: pick(['ratio', 'op', 'val']), p: person() }),
    make: ({ A, H, side, kind, p }) => {
      const tr = side === 'opposite' ? 'sin' : 'cos', other = side === 'opposite' ? 'cos' : 'sin';
      const val = (r) => TRIG[r](A);
      const usedR = kind === 'ratio' ? other : tr, op = kind === 'op' ? '÷' : '×';
      const valUsed = kind === 'val' ? val(other) : val(usedR);
      const res = op === '×' ? round(H * valUsed, 2) : round(H / valUsed, 2);
      const working = [
        { text: `x is the side ${side === 'opposite' ? 'opposite' : 'next to'} the ${A}° angle, and ${H} cm is the hypotenuse.`, ok: true },
        { text: `Use ${usedR}: ${usedR} ${A}° = x ÷ ${H}.`, ok: usedR === tr },
        { text: `So x = ${H} ${op} ${usedR} ${A}°.`, ok: op === '×' },
        { text: `x = ${H} ${op} ${valUsed} = ${res} cm.`, ok: valUsed === val(usedR) },
      ];
      const fixes = { ratio: `The side x is ${side === 'opposite' ? 'opposite' : 'next to'} the angle and the other side given is the hypotenuse. That pair needs ${tr}, not ${other}.`, op: `From ${tr} ${A}° = x ÷ ${H}, multiply both sides by ${H}. Do not divide.`, val: `${usedR} ${A}° is ${val(usedR)}. The number used in the last step belongs to ${other}.` };
      return { question: `${p.name} finds the side x of a right-angled triangle. The hypotenuse is ${H} cm and x is the side ${side === 'opposite' ? 'opposite' : 'next to'} the ${A}° angle. The table gives sin ${A}° = ${val('sin')} and cos ${A}° = ${val('cos')}. Which step has the mistake?`,
        working, fix: fixes[kind], steps: [`x is ${side} the angle, with the hypotenuse known: use ${tr}.`, `x = ${H} × ${tr} ${A}° = ${H} × ${val(tr)} = ${round(H * val(tr), 2)} cm.`] };
    } }),

  fam({ id: 'g9.trig.table-ladder-sine', skill: 'G9_TRIG_INTRO', outcome: 'G9.TRIG.c', rung: 2, form: 'table',
    draw: () => {
      const A = randInt(24, 68), L = pick([4, 5, 6, 8, 10]), start = A - randInt(0, 4);
      const sv = TRIG.sin(A), sn = TRIG.sin(A + 1);
      const a = round(L * sv, 2);
      if (!allDistinct(a, round(L / sv, 2), round(L * sn, 2), sv)) return null;
      return { A, L, start, sv, sn, a };
    },
    make: ({ A, L, start, sv, sn, a }) => ({
      question: `A ladder of ${L} m leans against a wall and makes an angle of ${A}° with the ground. Use the table of sines to find how high up the wall the ladder reaches. Give the answer to 2 decimal places, in metres.`,
      model: { type: 'table', data: { head: ['Angle', 'sin'], rows: [0, 1, 2, 3, 4].map(i => ({ label: `${start + i}°`, value: TRIG.sin(start + i).toFixed(4) })) } },
      answer: a,
      wrong: [[round(L / sv, 2), 'The height is the side opposite the angle, and the ladder is the hypotenuse. Multiply the ladder by the sine, do not divide.'], [round(L * sn, 2), 'That reads the row below the one needed. Check the angle in the table.'], [sv, 'That is the sine from the table. Now multiply by the length of the ladder.']],
      hints: ['The height is opposite the angle. The ladder is the hypotenuse.', 'Height = ladder length × sine of the angle.'],
      steps: [`From the table, sin ${A}° = ${sv}.`, `Height = ${L} × ${sv} = ${round(L * sv, 3)}, which is ${a} m to 2 decimal places.`],
    }),
    check: ({ L, sv }, v) => Math.abs(v - L * sv) <= 0.0051 }),

  fam({ id: 'g9.trig.table-find-angle', skill: 'G9_TRIG_INTRO', outcome: 'G9.TRIG.c', rung: 1, form: 'table',
    draw: () => {
      const A = randInt(22, 68), kind = pick(['sin', 'tan']), off = randInt(0, 4);
      if (A >= 42 && A <= 48) return null;
      return { A, kind, start: A - off, k: kind === 'sin' ? 'sine' : 'tangent' };
    },
    make: ({ A, kind, start, k }) => ({
      question: `A surveyor finds that the ${k} of the angle of a slope is ${TRIG[kind](A).toFixed(4)}. Use the table to find the angle.`, story: true,
      model: { type: 'table', data: { head: ['Angle', kind], rows: [0, 1, 2, 3, 4].map(i => ({ label: `${start + i}°`, value: TRIG[kind](start + i).toFixed(4) })) } },
      answer: A,
      wrong: [[A + 1, 'That is the row below the right one. Match the value exactly.'], [A - 1, 'That is the row above the right one. Match the value exactly.'], [90 - A, 'That is the other acute angle of the triangle. The table gives the angle for this ratio.']],
      hints: ['Find the value in the second column.', 'The angle is in the same row, in the first column.'],
      steps: [`Look down the ${kind} column for ${TRIG[kind](A).toFixed(4)}.`, `It is in the row for ${A}°.`],
    }),
    check: ({ kind, A }, a) => TRIG[kind](a) === TRIG[kind](A) }),

  fam({ id: 'g9.trig.table-ramp-steps', skill: 'G9_TRIG_INTRO', outcome: 'G9.TRIG.c', rung: 2, form: 'steps',
    draw: () => ({ A: randInt(22, 68), L: pick([10, 12, 15, 20]), off: randInt(0, 2) }),
    make: ({ A, L, off }) => {
      const s = TRIG.sin(A), c = TRIG.cos(A);
      return { question: `A footpath up a hill is ${L} m long and climbs at ${A}° to the horizontal. Read the sine and the cosine of the angle from the table. Then find the rise of the path and its horizontal length.`,
        model: { type: 'table', data: { head: ['Angle', 'sin', 'cos'], rows: [0, 1, 2].map(i => { const a = A - off + i; return { cells: [`${a}°`, TRIG.sin(a).toFixed(4), TRIG.cos(a).toFixed(4)] }; }) } },
        parts: [
          { prompt: `Read sin ${A}° from the table.`, answer: s, hint: `Find the row for ${A}° and the sin column.`, wrong: [[c, 'That is the cos column. Use the sin column.']] },
          { prompt: 'Find how far the path rises, in metres, to 2 decimal places.', answer: round(L * s, 2), unit: 'm', hint: 'The rise is opposite the angle: path length × sine.', wrong: [[round(L * c, 2), 'The rise is opposite the angle, so use the sine, not the cosine.']] },
          { prompt: `Read cos ${A}° from the table.`, answer: c, hint: 'Use the cos column.', wrong: [[s, 'That is the sin column. Use the cos column.']] },
          { prompt: 'Find the horizontal length of the path, in metres, to 2 decimal places.', answer: round(L * c, 2), unit: 'm', hint: 'The horizontal length is next to the angle: path length × cosine.', wrong: [[round(L * s, 2), 'The horizontal length is next to the angle, so use the cosine.']] },
        ],
        steps: [`sin ${A}° = ${s} and cos ${A}° = ${c}.`, `Height = ${L} × ${s} = ${round(L * s, 2)} m.`, `Horizontal length: ${L} × ${c} = ${round(L * c, 2)} m.`] };
    },
    check: ({ L }, v) => Math.abs(v[1] - L * v[0]) <= 0.0051 && Math.abs(v[3] - L * v[2]) <= 0.0051 && Math.abs(v[0] ** 2 + v[2] ** 2 - 1) < 0.001 }),

  fam({ id: 'g9.trig.building-elevation-depression', skill: 'G9_TRIG_PROBLEMS', outcome: 'G9.TRIG.e', rung: 3, form: 'steps',
    draw: () => ({ A: pick([32, 35, 38, 40, 42, 48]), d: pick([20, 25, 40, 50, 80]), eye: pick([1.5, 1.6]) }),
    make: ({ A, d, eye }) => {
      const t = TRIG.tan(A), h = round(d * t, 1);
      return { question: `A learner's eyes are ${eye} m above the ground, ${d} m from the foot of the school building. The angle of elevation of the top of the building from the learner's eyes is ${A}°. Use tan ${A}° = ${t}.`,
        parts: [
          { prompt: 'How high is the top of the building above the learner\'s eyes, in metres, to 1 decimal place?', answer: h, unit: 'm', hint: 'The height is opposite the angle and the distance is next to it. Use the tangent.', wrong: [[round(d / t, 1), 'The height is opposite the angle: height = distance × tan, not divided by it.']] },
          { prompt: 'How high is the building above the ground, in metres?', answer: round(h + eye, 1), unit: 'm', hint: 'Add the height of the eyes above the ground.', wrong: [[h, 'The eyes are not at ground level. Add their height.']] },
          { prompt: 'From the top of the building, what is the angle of depression of the learner\'s eyes?', answer: A, unit: '°', hint: 'The horizontal lines at the top and at eye level are parallel.', wrong: [[90 - A, 'Angles of depression and elevation are equal, not complementary.']] },
        ],
        steps: [`Height above the eyes = ${d} × ${t} = ${h} m.`, `Building height = ${h} + ${eye} = ${round(h + eye, 1)} m.`, `Alternate angles are equal, so the angle of depression is ${A}°.`] };
    },
    check: ({ A, d, eye }, v) => Math.abs(v[0] - d * TRIG.tan(A)) <= 0.051 && Math.abs(v[1] - v[0] - eye) < 1e-6 && v[2] === A }),

  fam({ id: 'g9.trig.which-ratio-ramp', skill: 'G9_TRIG_PROBLEMS', outcome: 'G9.TRIG.e', rung: 2, form: 'why',
    draw: () => ({ pair: pick([['hyp', 'opp'], ['hyp', 'adj'], ['adj', 'opp'], ['opp', 'hyp'], ['adj', 'hyp'], ['opp', 'adj']]), k: randInt(0, 3) }),
    make: ({ pair, k }) => {
      const NAME = { hyp: 'the length of the ramp', opp: 'the height of the platform', adj: 'the distance along the ground' };
      const JOIN = { sine: ['hyp', 'opp'], cosine: ['hyp', 'adj'], tangent: ['adj', 'opp'] };
      const opts = Object.entries(JOIN).map(([n, j]) => ({ text: `${n[0].toUpperCase() + n.slice(1)}, because it joins ${NAME[j[0]]} and ${NAME[j[1]]}`, right: j.includes(pair[0]) && j.includes(pair[1]), why: 'Each ratio joins two particular sides. Check which two sides are known and wanted here.' }));
      opts.push({ text: 'Any of the three ratios, because they all work on a right-angled triangle', right: false, why: 'Each ratio joins two particular sides. Only one joins the side you know and the side you want.' });
      return { question: `A ramp rises from the ground to a platform and makes an angle x with the ground. You know ${NAME[pair[0]]}. You want to find ${NAME[pair[1]]}. Which ratio should you use?`,
        options: turn(opts, k), fixedOrder: true,
        hints: ['Label the sides: the ramp is the hypotenuse, the platform height is opposite the angle, the distance along the ground is next to it.', 'Which ratio uses exactly those two sides?'],
        steps: ['The ramp is the hypotenuse. The platform height is opposite the angle. The distance along the ground is adjacent to it.', `The ratio that joins ${NAME[pair[0]]} and ${NAME[pair[1]]} is ${opts.find(o => o.right).text.split(',')[0].toLowerCase()}.`] };
    } }),

  fam({ id: 'g9.trig.tower-height-spot', skill: 'G9_TRIG_PROBLEMS', outcome: 'G9.TRIG.e', rung: 2, form: 'spot',
    draw: () => ({ A: pick([32, 35, 38, 40, 42, 48]), d: pick([20, 40, 50, 80]), eye: pick([1.4, 1.5, 1.6]), kind: pick(['flip', 'eye', 'slip']), p: person() }),
    make: ({ A, d, eye, kind, p }) => {
      const t = TRIG.tan(A), op = kind === 'flip' ? '÷' : '×';
      const exact = op === '×' ? round(d * t, 1) : round(d / t, 1);
      const shown = kind === 'slip' ? round(exact / 10, 2) : exact;
      const total = kind === 'eye' ? shown : round(shown + eye, 2);
      const working = [
        { text: kind === 'flip' ? `tan ${A}° = ${d} ÷ height above the tube.` : `tan ${A}° = height above the tube ÷ ${d}.`, ok: kind !== 'flip' },
        { text: `Height above the tube = ${d} ${op} ${t}.`, ok: true },
        { text: `Height above the tube = ${shown} m.`, ok: shown === exact },
        { text: kind === 'eye' ? `Tree height = ${shown} m.` : `Tree height = ${shown} + ${eye} = ${total} m.`, ok: total === round(shown + eye, 2) },
      ];
      const fixes = { flip: 'The tangent is opposite ÷ adjacent. The height is the opposite side, so it goes on the top.', eye: `The sighting tube is ${eye} m above the ground. That must be added to get the height of the tree.`, slip: `${d} × ${t} was worked out wrongly. The decimal point is in the wrong place.` };
      return { question: `${p.name} wants the height of a tree. ${p.She} sights its top at an angle of elevation of ${A}° from a spot ${d} m from its foot, holding a sighting tube ${eye} m above the ground. Using tan ${A}° = ${t}, ${p.she} works as shown. Which step has the mistake?`,
        working, fix: fixes[kind], steps: [`tan ${A}° = height above the tube ÷ ${d}, so the height is ${d} × ${t} = ${round(d * t, 1)} m.`, `Add the height of the tube: ${round(d * t, 1)} + ${eye} = ${round(d * t + eye, 1)} m.`] };
    } }),

  // =========================== GROUPED DATA ===========================
  fam({ id: 'g9.data.modal-class-table', skill: 'G9_GROUPED_DATA', outcome: 'G9.DATA.c', rung: 1, form: 'table',
    draw: () => {
      const f = Array.from({ length: 5 }, () => randInt(3, 16)), top = Math.max(...f);
      if (f.filter(v => v === top).length > 1) return null;
      const ctx = pick([{ h1: 'Test marks', h2: 'Learners', what: 'marks of learners in a Mathematics test' }, { h1: 'Walking time (minutes)', h2: 'Learners', what: 'time learners take to walk to school' }, { h1: 'Mass of bag (kg)', h2: 'Bags', what: 'masses of maize bags at a market' }]);
      return { f, ctx, start: pick([0, 10, 40]), k: randInt(0, 4) };
    },
    make: ({ f, ctx, start, k }) => {
      const labels = f.map((_, i) => `${start + 10 * i}–${start + 10 * i + 9}`), top = Math.max(...f), ti = f.indexOf(top);
      const others = f.map((_, i) => i).filter(i => i !== ti);
      const pickIdx = turn(mix(others), 0).slice(0, 3);
      const idx = turn([ti, ...pickIdx], k % 4);
      return { question: `The table shows the ${ctx.what}. Which class is the modal class?`,
        model: { type: 'table', data: { head: [ctx.h1, ctx.h2], rows: f.map((v, i) => ({ label: labels[i], value: String(v) })) } },
        options: idx.map(i => ({ text: labels[i], right: i === ti, why: i === ti ? undefined : i === f.length - 1 ? 'That class has the highest values, but the modal class is the one with the highest frequency.' : 'Another class has a higher frequency than this one.' })), fixedOrder: true,
        hints: ['The modal class is the class with the highest frequency.', 'Look down the frequency column for the biggest number.'],
        steps: [`The highest frequency is ${top}.`, `It belongs to the class ${labels[ti]}, so that is the modal class.`] };
    } }),

  fam({ id: 'g9.data.modal-gap-graph', skill: 'G9_GROUPED_DATA', outcome: 'G9.DATA.c', rung: 2, form: 'graph',
    draw: () => {
      const f = Array.from({ length: 5 }, () => randInt(1, 5) * 5), s = [...f].sort((a, b) => b - a);
      if (s[0] === s[1] || s[1] === s[2]) return null;
      const d = s[0] - s[1];
      if (!allDistinct(d, s[0], s[0] + s[1], s[1])) return null;
      return { f, s };
    },
    make: ({ f, s }) => ({
      question: 'The bar graph shows how long learners take to walk to school, in classes of minutes. How many more learners are in the modal class than in the class with the next highest frequency?',
      model: { type: 'bar-chart', data: { bars: f.map((v, i) => ({ label: `${10 * i}–${10 * i + 9}`, value: v })) } },
      answer: s[0] - s[1],
      wrong: [[s[0], 'That is the number in the modal class alone. Subtract the next highest class.'], [s[0] + s[1], '"How many more" asks for a difference, so subtract.'], [s[1], 'That is the next highest class. Find how much taller the tallest bar is.']],
      hints: ['The modal class has the tallest bar.', 'Find the second tallest bar, then subtract.'],
      steps: [`Tallest bar: ${s[0]} learners. Next tallest: ${s[1]} learners.`, `Difference = ${s[0]} − ${s[1]} = ${s[0] - s[1]}.`],
    }),
    check: ({ s }, a) => s[1] + a === s[0] }),

  fam({ id: 'g9.data.mean-from-table', skill: 'G9_GROUPED_MEASURES', outcome: 'G9.DATA.d', rung: 2, form: 'table',
    draw: () => {
      const start = pick([40, 50, 60]), f = Array.from({ length: 4 }, () => randInt(2, 9));
      const mids = f.map((_, i) => start + 10 * i + 5), sf = f.reduce((a, b) => a + b, 0), sfx = f.reduce((a, v, i) => a + v * mids[i], 0);
      const mean = sfx / sf;
      if (!Number.isInteger(mean * 10)) return null;
      const avgMid = mids.reduce((a, b) => a + b, 0) / 4;
      if (!allDistinct(mean, round(sfx / 4, 2), avgMid, sfx)) return null;
      return { start, f, mids, sf, sfx, mean, avgMid };
    },
    make: ({ start, f, mids, sf, sfx, mean, avgMid }) => ({
      question: 'A trader weighs sacks of potatoes. The table groups their masses and gives the midpoint of each class. Find the mean mass of a sack, in kg, to 1 decimal place.',
      model: { type: 'table', data: { head: ['Mass (kg)', 'Midpoint', 'Sacks'], rows: f.map((v, i) => ({ cells: [`${start + 10 * i} to under ${start + 10 * i + 10}`, String(mids[i]), String(v)] })) } },
      answer: mean,
      wrong: [[round(sfx / 4, 2), 'You divided by the number of classes. Divide by the total number of sacks.'], [avgMid, 'That is the plain average of the midpoints. Each midpoint counts once for every sack in its class.'], [sfx, 'That is the total of frequency × midpoint. Divide it by the number of sacks.']],
      hints: ['Multiply each midpoint by its frequency.', 'Add the products, then divide by the total frequency.'],
      steps: [`Products: ${f.map((v, i) => `${v} × ${mids[i]}`).join(', ')}. Total = ${sfx}.`, `Total sacks = ${sf}.`, `Mean = ${sfx} ÷ ${sf} = ${mean} kg.`],
    }),
    check: ({ sf, f, mids }, a) => Math.abs(a * sf - f.reduce((t, v, i) => t + v * mids[i], 0)) < 0.051 * sf }),

  fam({ id: 'g9.data.mean-spot', skill: 'G9_GROUPED_MEASURES', outcome: 'G9.DATA.d', rung: 3, form: 'spot',
    draw: () => {
      const start = pick([0, 10, 20]), f = Array.from({ length: 4 }, () => randInt(2, 9));
      return { start, f, kind: pick(['low', 'divide', 'slip']), slipAt: randInt(0, 3), p: person() };
    },
    make: ({ start, f, kind, slipAt, p }) => {
      const mids = f.map((_, i) => start + 10 * i + 5), lows = f.map((_, i) => start + 10 * i), sf = f.reduce((a, b) => a + b, 0);
      const xs = kind === 'low' ? lows : mids;
      const prods = f.map((v, i) => v * xs[i] + (kind === 'slip' && i === slipAt ? 10 : 0));
      const sfx = prods.reduce((a, b) => a + b, 0), div = kind === 'divide' ? 4 : sf, val = round(sfx / div, 2);
      const trueSfx = f.reduce((a, v, i) => a + v * mids[i], 0);
      const working = [
        { text: `Use the ${kind === 'low' ? 'lower limits' : 'midpoints'}: ${xs.join(', ')}.`, ok: xs.every((x, i) => x === mids[i]) },
        { text: `Frequency × value: ${f.map((v, i) => `${v} × ${xs[i]} = ${prods[i]}`).join(', ')}.`, ok: prods.every((pr, i) => pr === f[i] * xs[i]) },
        { text: `Total frequency = ${div}. Total of frequency × value = ${sfx}.`, ok: div === sf && sfx === prods.reduce((a, b) => a + b, 0) },
        { text: `Mean = ${sfx} ÷ ${div} = ${val}.`, ok: val === round(sfx / div, 2) },
      ];
      const fixes = { low: 'The value that stands for a class is its midpoint, the middle of the class, not its lower limit.', divide: 'The total of frequency × midpoint is divided by the total frequency, which is the number of learners, not the number of classes.', slip: `One product was worked out wrongly: ${f[slipAt]} × ${mids[slipAt]} is not ${prods[slipAt]}.` };
      return { question: `${p.name} finds the mean mark from grouped data. ${f.map((v, i) => `${start + 10 * i} to under ${start + 10 * i + 10}: ${v} learners`).join('; ')}. Which step has the mistake?`,
        working, fix: fixes[kind], steps: [`Midpoints: ${mids.join(', ')}.`, `Total of frequency × midpoint = ${trueSfx}, total learners = ${sf}, so the mean is ${round(trueSfx / sf, 2)}.`] };
    } }),

  fam({ id: 'g9.data.mean-why-weighted', skill: 'G9_GROUPED_DATA', outcome: 'G9.DATA.d', rung: 2, form: 'why',
    draw: () => { const lo = pick([0, 10, 20]), b = randInt(1, 4); return { lo, b, a: 10 - b, k: randInt(0, 3), p: person() }; },
    make: ({ lo, a, b, k, p }) => {
      const m1 = lo + 5, m2 = lo + 15;
      const opts = [
        { text: `Each midpoint counts once for every learner in its class, which gives a mean of ${m1 + b}`, right: true },
        { text: 'The midpoint of a class is its lower limit, not its middle', right: false, why: 'The midpoint is the middle of the class, halfway between its limits.' },
        { text: 'The mean of grouped data is the midpoint of the middle class', right: false, why: 'That is closer to a median. The mean uses every learner.' },
        { text: 'The two midpoints should be added, not averaged', right: false, why: 'The mean is a total divided by a count, so adding alone cannot give a mean.' },
      ];
      return { question: `A test has two classes. ${lo} to under ${lo + 10} has ${a} learners, and ${lo + 10} to under ${lo + 20} has ${b} learners. ${p.name} finds the mean by working out (${m1} + ${m2}) ÷ 2 = ${m1 + 5}. Why is this wrong?`,
        options: turn(opts, k), fixedOrder: true,
        hints: ['Are there the same number of learners in the two classes?', 'A class with more learners should pull the mean towards its midpoint.'],
        steps: [`The first class has ${a} learners and the second has ${b}, so they must not count equally.`, `Mean = (${a} × ${m1} + ${b} × ${m2}) ÷ 10 = ${m1 + b}.`] };
    } }),

  fam({ id: 'g9.data.median-interpolate', skill: 'G9_GROUPED_MEASURES', outcome: 'G9.DATA.e', rung: 3, form: 'steps',
    draw: () => {
      const f = Array.from({ length: 5 }, () => randInt(2, 12)), n = f.reduce((a, b) => a + b, 0);
      if (n % 2) return null;
      let cum = 0, j = -1;
      for (let i = 0; i < 5; i++) { if (cum < n / 2 && n / 2 <= cum + f[i]) { j = i; break; } cum += f[i]; }
      const r = n / 2 - cum, med = 10 * j + (10 * r) / f[j];
      if (j < 0 || r === f[j] || !Number.isInteger(med * 10) || !allDistinct(med, 10 * j, 10 * j + 5, n / 2)) return null;
      return { f, n, j, F: cum, fj: f[j], lo: 10 * j, med };
    },
    make: ({ f, n, j, F, fj, lo, med }) => ({
      question: 'The table shows the marks of learners in a test. A mark on a class boundary goes in the higher class. Estimate the median mark.',
      model: { type: 'table', data: { head: ['Marks', 'Learners'], rows: f.map((v, i) => ({ label: `${10 * i} to under ${10 * i + 10}`, value: String(v) })) } },
      parts: [
        { prompt: 'How many learners are there in all?', answer: n, hint: 'Add the frequencies.', wrong: [[5, 'That is the number of classes. Add the number of learners in each class.']] },
        { prompt: 'The median is the mark of the middle learner. Which place is that, counting from the lowest mark?', answer: n / 2, hint: 'Half of the number of learners.', wrong: [[n, 'That is all of the learners. The middle is half way.']] },
        { prompt: 'How many learners are in the classes below the median class?', answer: F, hint: 'Add the frequencies from the lowest class until you pass the middle place.', wrong: [[F + fj, 'That includes the median class itself. Stop before it.']] },
        { prompt: 'Estimate the median mark, to 1 decimal place.', answer: med, hint: 'Start from the lower limit of the median class, then move along it in proportion: (middle place − learners below) ÷ learners in the class × 10.', wrong: [[lo, 'That is the lower limit of the median class. The median lies partway along the class.'], [lo + 5, 'The median is not always the midpoint of its class. Move along in proportion.']] },
      ],
      steps: [`n = ${n}, so the middle place is ${n} ÷ 2 = ${n / 2}.`, `${F} learners are below ${lo}, and the median class has ${fj}.`, `Median = ${lo} + (${n / 2} − ${F}) ÷ ${fj} × 10 = ${med}.`],
    }),
    check: ({ lo, fj }, v) => v[0] === 2 * v[1] && Math.abs(v[3] - (lo + ((v[1] - v[2]) * 10) / fj)) < 1e-6 }),

  fam({ id: 'g9.data.cumulative-graph-between', skill: 'G8_CUMULATIVE_FREQ', outcome: 'G9.DATA.e', rung: 2, form: 'graph',
    draw: () => {
      const inc = Array.from({ length: 5 }, () => pick([5, 10, 15])), tot = inc.reduce((a, b) => a + b, 0);
      if (tot !== 40 && tot !== 50) return null;
      const cf = [0]; inc.forEach(v => cf.push(cf[cf.length - 1] + v));
      const a = cf[4] - cf[2];
      if (!allDistinct(a, cf[4], cf[2], cf[3] - cf[2])) return null;
      return { cf, tot };
    },
    make: ({ cf, tot }) => {
      const xs = [0, 10, 20, 30, 40, 50], yTicks = []; for (let v = 0; v <= tot; v += 5) yTicks.push(v);
      return { question: 'The graph shows the cumulative frequency of the marks of learners in a test. How many learners scored 20 marks or more but under 40?',
        model: { type: 'line-graph', data: { points: xs.map((x, i) => ({ x, y: cf[i] })), xTicks: xs, yTicks, xLabel: 'Marks (less than)', yLabel: 'Cumulative frequency' } },
        answer: cf[4] - cf[2],
        wrong: [[cf[4], 'That is everyone who scored under 40, including those who scored under 20.'], [cf[2], 'That is the number who scored under 20. Take it away from the number under 40.'], [cf[3] - cf[2], 'That is only the class from 20 to under 30. The question goes up to 40.']],
        hints: ['Read the cumulative frequency at 40 and at 20.', 'The learners between them are the difference.'],
        steps: [`Under 40: ${cf[4]} learners. Under 20: ${cf[2]} learners.`, `${cf[4]} − ${cf[2]} = ${cf[4] - cf[2]} learners.`] };
    },
    check: ({ cf }, a) => cf[2] + a === cf[4] }),

  // =========================== PROBABILITY ===========================
  fam({ id: 'g9.prob.raffle-either', skill: 'G9_PROBABILITY_ADV', outcome: 'G9.PROB.c', rung: 2, form: 'word',
    draw: () => {
      const N = pick([20, 25, 40, 50]), a = randInt(2, 8), b = randInt(2, 8), [x, y] = mix(['a school bag', 'a hen', 'a radio', 'a sack of potatoes']).slice(0, 2);
      if (a === b) return null;
      const ans = round((a + b) / N, 4);
      if (!allDistinct(ans, round((a * b) / (N * N), 4), round(a / N, 4), round(1 - ans, 4))) return null;
      return { N, a, b, x, y, ans };
    },
    make: ({ N, a, b, x, y, ans }) => ({
      question: `A harambee raffle has ${N} tickets. ${a} tickets win ${x}, ${b} tickets win ${y}, and the rest win nothing. A ticket wins at most one prize. One ticket is drawn. What is the probability that it wins either ${x} or ${y}? Give a decimal.`,
      answer: ans,
      wrong: [[round((a * b) / (N * N), 4), 'A ticket cannot win both prizes, so these events cannot both happen. For "either … or" you add, not multiply.'], [round(a / N, 4), `That is the chance of ${x} alone. The question also allows the other prize.`], [round(1 - ans, 4), 'That is the chance of winning neither prize. The question asks for either prize.']],
      hints: ['A ticket wins at most one prize, so the two events cannot both happen.', 'For events that cannot both happen, add their probabilities.'],
      steps: [`P(${x}) = ${a}/${N}. P(${y}) = ${b}/${N}.`, `The events cannot both happen, so P(either) = (${a} + ${b}) ÷ ${N} = ${ans}.`],
    }),
    check: ({ N, a, b }, v) => Math.abs(v * N - (a + b)) < 1e-6 }),

  fam({ id: 'g9.prob.football-netball-why', skill: 'G9_PROBABILITY_ADV', outcome: 'G9.PROB.c', rung: 3, form: 'why',
    draw: () => { const N = pick([40, 30, 50]), f = randInt(Math.floor(N * 0.4), Math.floor(N * 0.6)), b = pick([4, 6, 8]); return { N, f, n: N - f, b, k: randInt(0, 3), p: person() }; },
    make: ({ N, f, n, b, k, p }) => {
      const opts = [
        { text: `${b} learners play both, so they were counted twice. The events are not mutually exclusive`, right: true },
        { text: 'Football and netball are mutually exclusive, so adding the two probabilities is correct', right: false, why: `Mutually exclusive events cannot both happen. Here ${b} learners play both games.` },
        { text: 'The probability of "or" must be found by multiplying', right: false, why: 'Multiplying is used for "and" with independent events, not for "or".' },
        { text: 'A probability cannot be found from numbers of learners', right: false, why: 'Probabilities are often found from counts. The mistake is in how they were combined.' },
      ];
      return { question: `In a class of ${N} learners, ${f} play football and ${n} play netball. ${p.name} says the chance that a learner chosen at random plays football or netball is ${f}/${N} + ${n}/${N} = 1. But ${b} learners play both games. Why is ${p.name}'s method wrong?`,
        options: turn(opts, k), fixedOrder: true,
        hints: ['Can one learner be in both groups?', 'Adding probabilities works only when the events cannot happen together.'],
        steps: [`${b} learners are in both groups, so they are counted in both ${f} and ${n}.`, `Football or netball: (${f} + ${n} − ${b}) ÷ ${N}. Adding without taking away ${b} counts them twice.`] };
    } }),

  fam({ id: 'g9.prob.way-to-school-table', skill: 'G9_PROBABILITY_ADV', outcome: 'G9.PROB.c', rung: 2, form: 'table',
    draw: () => {
      const N = pick([20, 25, 40, 50]), cuts = [randInt(2, N / 2), randInt(2, N / 2), randInt(2, N / 2)];
      const last = N - cuts.reduce((a, b) => a + b, 0);
      if (last < 2) return null;
      const f = [...cuts, last], i = randInt(0, 3); let j = randInt(0, 3);
      if (i === j) return null;
      const ways = ['Walk', 'Matatu', 'Bicycle', 'Boda boda'], x = f[i], y = f[j], ans = round((x + y) / N, 4);
      if (!allDistinct(ans, round((x * y) / (N * N), 4), round(x / N, 4), round(1 - ans, 4)) || new Set(f).size < 4) return null;
      return { N, f, i, j, ways, ans, x, y };
    },
    make: ({ N, f, i, j, ways, ans, x, y }) => ({
      question: `The table shows how the learners of a class come to school. Each learner uses one way only. One learner is chosen at random. What is the probability that the learner comes either by ${ways[i].toLowerCase()} or by ${ways[j].toLowerCase()}? Give a decimal.`,
      model: { type: 'table', data: { head: ['Way to school', 'Learners'], rows: ways.map((w, t) => ({ label: w, value: String(f[t]) })) } },
      answer: ans,
      wrong: [[round((x * y) / (N * N), 4), 'A learner uses one way only, so the two events cannot both happen. For "either … or", add the probabilities.'], [round(x / N, 4), 'That is only one of the two ways. Include the other too.'], [round(1 - ans, 4), 'That is the chance of coming by neither way. The question asks for either.']],
      hints: ['Find how many learners are in the class altogether.', 'Add the learners for the two ways, then divide by the total.'],
      steps: [`Total learners = ${f.join(' + ')} = ${N}.`, `Either way: (${x} + ${y}) ÷ ${N} = ${ans}.`],
    }),
    check: ({ N, x, y }, v) => Math.abs(v * N - (x + y)) < 1e-6 }),

  fam({ id: 'g9.prob.neither-road-spot', skill: 'G9_PROBABILITY_ADV', outcome: 'G9.PROB.c', rung: 2, form: 'spot',
    draw: () => {
      const pa = pick([0.15, 0.2, 0.25, 0.3, 0.35, 0.4]), pb = pick([0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45]);
      if (pa === pb || pa + pb > 0.8) return null;
      return { pa, pb, kind: pick(['times', 'skip', 'slip']), slip: pick([0.1, -0.1]), p: person() };
    },
    make: ({ pa, pb, kind, slip, p }) => {
      const sum = round(pa + pb, 2), op = kind === 'times' ? '×' : '+';
      const val = kind === 'times' ? round(pa * pb, 4) : kind === 'slip' ? round(sum + slip, 2) : sum;
      const res = round(1 - val, 4);
      const working = [
        { text: 'The rider takes one road only, so roads A and B cannot both be taken.', ok: true },
        { text: `P(A or B) = ${pa} ${op} ${pb}.`, ok: op === '+' },
        { text: `P(A or B) = ${val}.`, ok: val === (op === '+' ? round(pa + pb, 4) : round(pa * pb, 4)) },
        { text: kind === 'skip' ? `P(neither) = ${val}.` : `P(neither) = 1 − ${val} = ${res}.`, ok: kind !== 'skip' },
      ];
      const fixes = { times: 'For events that cannot both happen, "A or B" is found by adding the probabilities, not multiplying.', skip: 'P(A or B) is the chance of taking one of the roads. The chance of neither is 1 minus that.', slip: `${pa} + ${pb} is ${sum}, not ${val}.` };
      return { question: `${p.name} knows that a boda boda rider takes road A with probability ${pa} and road B with probability ${pb}. The rider takes only one road each day. ${p.She} finds the probability that the rider takes neither road. Which step has the mistake?`,
        working, fix: fixes[kind], steps: [`P(A or B) = ${pa} + ${pb} = ${sum}.`, `P(neither) = 1 − ${sum} = ${round(1 - sum, 2)}.`] };
    } }),

  fam({ id: 'g9.prob.late-matatu-independent', skill: 'G9_PROBABILITY_ADV', outcome: 'G9.PROB.e', rung: 2, form: 'word',
    draw: () => {
      const pa = pick([0.1, 0.2, 0.3, 0.4, 0.5]), pb = pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6]);
      const ans = round(pa * pb, 4);
      if (!allDistinct(ans, round(pa + pb, 4), round(pa * (1 - pb), 4), round(1 - ans, 4))) return null;
      return { pa, pb, ans };
    },
    make: ({ pa, pb, ans }) => ({
      question: `The probability that the school bus is late on Monday is ${pa}. The probability that it is late on Tuesday is ${pb}. Whether it is late on one day does not change the chance on the other day. What is the probability that it is late on both days?`,
      answer: ans,
      wrong: [[round(pa + pb, 4), 'Adding would give more than either chance alone. For "and" with independent events, multiply.'], [round(pa * (1 - pb), 4), 'That is late on Monday and on time on Tuesday.'], [round(1 - ans, 4), 'That is the chance that it is not late on both days. The question asks for late on both.']],
      hints: ['The two days are independent.', 'For "and" with independent events, multiply the probabilities.'],
      steps: [`P(late Monday) = ${pa} and P(late Tuesday) = ${pb}.`, `Both: ${pa} × ${pb} = ${ans}.`],
    }),
    check: ({ pa, pb }, a) => Math.abs(a / pb - pa) < 1e-6 }),

  fam({ id: 'g9.prob.coin-and-spinner', skill: 'G9_PROBABILITY_ADV', outcome: 'G9.PROB.e', rung: 3, form: 'steps',
    draw: () => ({ n: pick([4, 5, 10, 20]), T: 200, num: randInt(1, 3) }),
    make: ({ n, T, num }) => ({
      question: `At a school fete, a game uses a fair coin and a fair spinner with ${n} equal sectors numbered 1 to ${n}. A player wins by getting a head on the coin and ${num} on the spinner. The coin and the spinner are independent of each other.`,
      parts: [
        { prompt: 'Find the probability of a head.', answer: 0.5, hint: 'A fair coin has two equally likely sides.', wrong: [[1, 'There are two sides, so one of them has half of the chance.']] },
        { prompt: `Find the probability that the spinner shows ${num}, as a decimal.`, answer: round(1 / n, 4), hint: `${n} equal sectors, one of them is ${num}.`, wrong: [[n, 'A probability is the number of favourable sectors out of all of them, not the number of sectors.']] },
        { prompt: 'Find the probability of winning.', answer: round(0.5 / n, 4), hint: 'The two events are independent, so multiply.', wrong: [[round(0.5 + 1 / n, 4), 'For "and" with independent events, multiply, do not add.']] },
        { prompt: `If ${T} players each have one turn, about how many are expected to win?`, answer: round((T * 0.5) / n, 2), hint: 'Expected number = probability of winning × number of players.', wrong: [[round(0.5 / n, 4), 'That is the probability of winning. Multiply it by the number of players.']] },
      ],
      steps: [`P(head) = 0.5 and P(${num}) = 1 ÷ ${n} = ${round(1 / n, 4)}.`, `P(win) = 0.5 × ${round(1 / n, 4)} = ${round(0.5 / n, 4)}.`, `Expected wins = ${T} × ${round(0.5 / n, 4)} = ${round((T * 0.5) / n, 2)}.`],
    }),
    check: ({ T }, v) => v[2] === round(v[0] * v[1], 4) && Math.abs(v[3] / T - v[2]) < 1e-6 }),

  fam({ id: 'g9.prob.tree-table-one-grows', skill: 'G9_PROBABILITY_ADV', outcome: 'G9.PROB.f', rung: 2, form: 'table',
    draw: () => {
      const p = pick([0.5, 0.6, 0.7, 0.8, 0.9]), q = pick([0.5, 0.6, 0.7, 0.8, 0.9]);
      const ans = round(p * (1 - q) + (1 - p) * q, 4);
      if (!allDistinct(ans, round(p * q, 4), round(p * (1 - q), 4), round(1 - (1 - p) * (1 - q), 4))) return null;
      return { p, q, ans };
    },
    make: ({ p, q, ans }) => ({
      question: 'The table gives the branches of a tree diagram for two seedlings planted on a shamba. The seedlings grow independently of each other. What is the probability that exactly one of the two seedlings grows?',
      model: { type: 'table', data: { head: ['Seedling', 'Branch', 'Probability'], rows: [{ cells: ['First', 'Grows', String(p)] }, { cells: ['First', 'Does not grow', String(round(1 - p, 4))] }, { cells: ['Second', 'Grows', String(q)] }, { cells: ['Second', 'Does not grow', String(round(1 - q, 4))] }] } },
      answer: ans,
      wrong: [[round(p * q, 4), 'That is the path where both seedlings grow.'], [round(p * (1 - q), 4), 'That is one path only. Exactly one grows can happen in two ways.'], [round(1 - (1 - p) * (1 - q), 4), 'That is the chance that at least one grows, which includes both growing.']],
      hints: ['Exactly one growing can happen in two ways: first grows and second does not, or the other way round.', 'Multiply along each path, then add the two paths.'],
      steps: [`Path 1: first grows, second does not: ${p} × ${round(1 - q, 4)} = ${round(p * (1 - q), 4)}.`, `Path 2: first does not grow, second grows: ${round(1 - p, 4)} × ${q} = ${round((1 - p) * q, 4)}.`, `Add the two paths: ${ans}.`],
    }),
    check: ({ p, q }, a) => Math.abs(a - (p + q - 2 * p * q)) < 1e-6 }),

  fam({ id: 'g9.prob.tree-without-replacement', skill: 'G9_PROBABILITY_ADV', outcome: 'G9.PROB.f', rung: 3, form: 'steps',
    draw: () => { const r = randInt(1, 4); return { r, b: 5 - r, c1: pick(['blue', 'green']), c2: pick(['black', 'red']), what: pick(['pens', 'crayons']) }; },
    make: ({ r, b, c1, c2, what }) => {
      const one = round(r / 5, 4), two = round(b / 4, 4), mix1 = round((r * b) / 20, 4), same = round((r * (r - 1) + b * (b - 1)) / 20, 4);
      return { question: `A box holds 5 ${what}: ${r} ${c1} and ${b} ${c2}. Two are taken one after the other, and the first is not put back. Think of a tree diagram for the two picks.`,
        parts: [
          { prompt: `Find the probability that the first one is ${c1}, as a decimal.`, answer: one, hint: `${r} of the 5 are ${c1}.`, wrong: [[round(b / 5, 4), `That is the chance of ${c2}.`]] },
          { prompt: `The first one was ${c1} and is not put back. Find the probability that the second is ${c2}.`, answer: two, hint: 'How many are left in the box, and how many of them are ' + c2 + '?', wrong: [[round(b / 5, 4), 'The first one was not put back, so there are only 4 left.']] },
          { prompt: `Find the probability of ${c1} first and then ${c2}.`, answer: mix1, hint: 'Multiply along the branches of the tree.', wrong: [[round(one + two, 4), 'Along a path you multiply, you do not add.']] },
          { prompt: 'Find the probability that both are the same colour.', answer: same, hint: `Add the path for two ${c1} and the path for two ${c2}.`, wrong: [[round((r * (r - 1)) / 20, 4), `That is only the path for two ${c1}. Add the path for two ${c2} too.`]] },
        ],
        steps: [`First ${c1}: ${r}/5 = ${one}. Then ${c2}: ${b}/4 = ${two}.`, `${c1} then ${c2}: ${one} × ${two} = ${mix1}.`, `Same colour: ${r}/5 × ${r - 1}/4 + ${b}/5 × ${b - 1}/4 = ${same}.`] };
    },
    check: ({ r, b }, v) => Math.abs(v[0] * v[1] - v[2]) < 1e-3 && Math.abs(v[3] - (r * (r - 1) + b * (b - 1)) / 20) < 1e-3 }),

  fam({ id: 'g9.prob.least-likely-table', skill: 'G9_PROBABILITY_ADV', outcome: 'G9.PROB.b', rung: 2, form: 'table',
    draw: () => {
      const bags = Array.from({ length: 3 }, () => { const t = pick([8, 10, 12, 15, 20]); return { red: randInt(2, t - 2), all: t }; });
      const share = (x) => x.red / x.all, least = Math.random() < 0.5;
      const sorted = bags.map(share).sort((a, b) => a - b);
      if (new Set(bags.map(share)).size < 3) return null;
      if (bags.some(x => x.red === 0)) return null;
      return { bags, least, sorted };
    },
    make: ({ bags, least }) => {
      const sh2 = bags.map(x => x.red / x.all), target = least ? Math.min(...sh2) : Math.max(...sh2), ti = sh2.indexOf(target);
      const fewest = bags.map(x => x.red).indexOf(Math.min(...bags.map(x => x.red)));
      const most = bags.map(x => x.red).indexOf(Math.max(...bags.map(x => x.red)));
      const L = ['A', 'B', 'C'], extreme = least ? fewest : most;
      return { question: `The table shows the red beads and all the beads in three bags. A learner takes one bead without looking from one bag. From which bag is the learner ${least ? 'least' : 'most'} likely to take a red bead?`,
        model: { type: 'table', data: { head: ['Bag', 'Red beads', 'All beads'], rows: bags.map((x, i) => ({ cells: [`Bag ${L[i]}`, String(x.red), String(x.all)] })) } },
        options: bags.map((x, i) => ({ text: `Bag ${L[i]}`, right: i === ti, why: i === ti ? undefined : i === extreme ? `Bag ${L[i]} has the ${least ? 'fewest' : 'most'} red beads, but it also has a different number of beads in all. Compare red out of all.` : `Another bag gives a ${least ? 'smaller' : 'bigger'} share of red beads.` })), fixedOrder: true,
        hints: ['The chance of red is red beads ÷ all beads.', 'Work out the chance for each bag, then compare.'],
        steps: bags.map((x, i) => `Bag ${L[i]}: ${x.red} ÷ ${x.all} = ${round(x.red / x.all, 3)}.`).concat([`The ${least ? 'smallest' : 'biggest'} chance is for Bag ${L[ti]}.`]) };
    } }),

  fam({ id: 'g9.graphs.water-bill-line', skill: 'G9_PARALLEL_PERPENDICULAR', outcome: 'G9.GRAPHS.g', rung: 2, form: 'word',
    draw: () => {
      const F = pick([200, 300, 400, 500]), r = pick([40, 50, 60, 80]), u = randInt(8, 30), B = F + r * u;
      if (!allDistinct(u, round(B / r, 2), round((B + F) / r, 2), B - F)) return null;
      return { F, r, u, B, p: person() };
    },
    make: ({ F, r, u, B, p }) => ({
      question: `A water company charges a fixed amount of ${sh(F)} a month, plus ${sh(r)} for each unit of water used. ${p.name}'s bill for one month is ${sh(B)}. How many units did ${p.she} use?`,
      answer: u,
      wrong: [[round(B / r, 2), 'The fixed amount is paid first. Take it away before you divide by the charge for each unit.'], [round((B + F) / r, 2), 'The fixed amount is part of the bill, so take it away from the bill. Do not add it.'], [B - F, 'That is the money paid for the units, not the number of units. Divide it by the charge for each unit.']],
      hints: ['The bill is the fixed amount plus the charge for the units.', 'Take away the fixed amount first.'],
      steps: [`Money paid for the units = ${B} − ${F} = ${B - F}.`, `Units = ${B - F} ÷ ${r} = ${u}.`],
    }),
    check: ({ F, r, B }, a) => F + r * a === B }),

  fam({ id: 'g9.prob.seeds-expected', skill: 'G9_PROBABILITY_ADV', outcome: 'G9.PROB.b', rung: 2, form: 'word',
    draw: () => {
      const pr = pick([0.6, 0.7, 0.8, 0.9]), n = pick([150, 200, 250, 300]), ans = round(pr * n, 2);
      if (!Number.isInteger(ans) || !allDistinct(ans, round(n * (1 - pr), 2), round(n / pr, 2), pr)) return null;
      return { pr, n, ans, p: person() };
    },
    make: ({ pr, n, ans, p }) => ({
      question: `The probability that a maize seed grows is ${pr}. ${p.name} plants ${n} seeds on a shamba. About how many seeds should grow?`,
      answer: ans,
      wrong: [[round(n * (1 - pr), 2), 'That is the number that should not grow. The question asks for the seeds that grow.'], [round(n / pr, 2), 'A probability is less than 1, so the number that grow is less than the number planted. Multiply, do not divide.'], [round(n + pr, 2), 'Multiply the number of seeds by the probability. Do not add.']],
      hints: ['The expected number is the probability times the number of trials.', 'Multiply the probability by the number of seeds.'],
      steps: [`Expected number = ${pr} × ${n}.`, `${pr} × ${n} = ${ans} seeds.`],
    }),
    check: ({ pr, n }, a) => Math.abs(a / n - pr) < 1e-9 }),
];
