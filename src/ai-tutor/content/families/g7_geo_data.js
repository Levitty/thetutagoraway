// ============================================================================
// GRADE 7 GEOMETRY AND DATA: angles with their reasons, the knowledge behind
// constructions, and data handling (frequency tables, scales, bar graphs,
// pictographs, pie charts, line graphs, travel graphs).
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family, round, commas } from './core.js';
import { person, sh } from './kenya.js';

const fam = (def) => family({ reviewed: false, ...def });
const rot = (arr, k) => { const n = k % arr.length; return [...arr.slice(n), ...arr.slice(0, n)]; };
const uniq = (...v) => new Set(v).size === v.length;
const sum = (a) => a.reduce((s, x) => s + x, 0);
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = randInt(0, i); [b[i], b[j]] = [b[j], b[i]]; } return b; };

const FREQ_CTX = [
  { h: 'Books read', who: 'learners', items: 'books', lo: 0, desc: 'the books read by some learners in one term', most: 'What was the most common number of books read?', intro: 'Some learners were asked how many books they read in one term.', phr: (k) => `read at least ${k} books` },
  { h: 'Goals scored', who: 'matches', items: 'goals', lo: 0, desc: 'the goals a school team scored in each match', most: 'What was the most common number of goals in a match?', intro: 'A school football team kept a record of the goals it scored in each match.', phr: (k) => `ended with at least ${k} goals scored` },
  { h: 'Brothers and sisters', who: 'learners', items: 'brothers and sisters', lo: 0, desc: 'the brothers and sisters of the learners in a class', most: 'What is the most common number of brothers and sisters?', intro: 'A teacher asked a class how many brothers and sisters each learner has.', phr: (k) => `have at least ${k} brothers and sisters` },
];
FREQ_CTX.push({ h: 'Cups of tea', who: 'customers', items: 'cups of tea', lo: 1, desc: 'the cups of tea bought by customers at a kiosk', most: 'What was the most common number of cups bought?', intro: 'A tea kiosk owner counted the cups of tea each customer bought.', phr: (k) => `bought at least ${k} cups` });
const freqModel = (c, fs) => ({ type: 'table', data: { head: [c.h, 'Frequency'], rows: fs.map((f, i) => ({ label: String(c.lo + i), value: String(f) })) } });
const tally = (f) => [...Array(Math.floor(f / 5)).fill('||||/'), '|'.repeat(f % 5)].filter(Boolean).join(' ');
const SCALES = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
const THINGS = [{ t: 'kilograms of maize', u: 'kg' }, { t: 'litres of milk', u: 'litres' }, { t: 'mangoes', u: 'mangoes' }, { t: 'exercise books', u: 'books' }];

export const FAMILIES = [
  // ================================================================ ANGLES
  fam({ id: 'g7.angles.point-cake', skill: 'G7_ANGLES', outcome: 'G7.ANGLES.a', rung: 1, form: 'word',
    draw: () => {
      const a = randInt(12, 20) * 5, b = randInt(12, 20) * 5, c = randInt(12, 20) * 5;
      const d4 = 360 - a - b - c;
      if (d4 < 30 || d4 > 150 || d4 % 5 !== 0) return null;
      if (!uniq(d4, a + b + c, 360 - a - b, 180 - a)) return null;
      return { a, b, c, what: pick(['round chapati', 'round cake', 'round pizza']), p: person() };
    },
    make: ({ a, b, c, what, p }) => ({
      question: `${p.name} cuts a ${what} into 4 pieces. All the cuts start at the centre. Three pieces have angles of ${a}°, ${b}° and ${c}° at the centre. What is the angle of the fourth piece, in degrees?`,
      answer: 360 - a - b - c,
      wrong: [[a + b + c, 'That is the three angles added together. Together with the fourth they make a full turn.'], [360 - a - b, 'You took away only two of the three known angles.'], [180 - a, 'Angles on a straight line add to 180°. The pieces fill a whole circle, which is a bigger turn.']],
      hints: ['The pieces meet at one point and fill the whole circle.', 'Angles at a point add up to a full turn. Take the known angles away from it.'],
      steps: ['Angles at a point add up to 360°.', `Known angles: ${a} + ${b} + ${c} = ${a + b + c}°.`, `Fourth piece: 360 − ${a + b + c} = ${360 - a - b - c}°.`],
    }),
    check: ({ a, b, c }, v) => a + b + c + v === 360 }),

  fam({ id: 'g7.angles.line-algebra', skill: 'G7_ANGLES', outcome: 'G7.ANGLES.a', rung: 3, form: 'word',
    draw: () => {
      const x = pick([20, 25, 30, 35]), p = pick([10, 15, 20]);
      const q = 180 - 5 * x - p;
      if (q < 10 || q > 70) return null;
      const A = 3 * x + p, B = 2 * x + q;
      return uniq(A, B, x, (180 - p - q) / 3) && A !== B ? { x, p, q, A, B } : null;
    },
    make: ({ x, p, q, A, B }) => ({
      question: `Two angles on a straight line are (3x + ${p})° and (2x + ${q})°. What is the size of the larger angle, in degrees?`,
      answer: Math.max(A, B),
      wrong: [[Math.min(A, B), 'That is the smaller angle. Compare both angles once you know x.'], [x, 'That is the value of x. Put it back into the angles.'], [(180 - p - q) / 3, 'There are 5 lots of x altogether (3x and 2x), not 3.']],
      hints: ['Angles on a straight line add up to a fixed total. Write an equation.', 'Collect the x terms and the plain numbers, solve for x, then work out both angles.'],
      steps: [`3x + ${p} + 2x + ${q} = 180, so 5x + ${p + q} = 180.`, `5x = ${180 - p - q}, so x = ${x}.`, `The angles are ${A}° and ${B}°. The larger is ${Math.max(A, B)}°.`],
    }),
    check: ({ p, q }, v) => { const A2 = (v - p) / 3, B2 = (v - q) / 2; return [A2, B2].some(t => Number.isInteger(t) && 3 * t + p + 2 * t + q === 180); } }),

  fam({ id: 'g7.angles.opposite-why', skill: 'G7_ANGLES', outcome: 'G7.ANGLES.a', rung: 2, form: 'why',
    draw: () => { const a = pick([35, 40, 50, 55, 65, 70, 75, 110, 115, 125, 130, 145]); return { a, k: randInt(0, 3), p: person() }; },
    make: ({ a, k, p }) => ({
      question: `Two straight lines cross. One of the angles is ${a}°. ${p.name} says the angle directly opposite it is ${180 - a}°. Why is ${p.she} wrong?`,
      options: rot([
        { text: `Opposite angles are equal, so it is ${a}°`, right: true },
        { text: 'She is right, because angles on a straight line add up to 180°'.replace('She', p.She), right: false, why: 'Angles add up to 180° when they are side by side on one line. An opposite angle is across the crossing, not beside it.' },
        { text: `It should be ${360 - a}°, because angles at a point add up to 360°`, right: false, why: 'The four angles together make 360°. A pair of opposite angles is not the whole turn.' },
        { text: 'It must be 90°, because two lines that cross are always at right angles', right: false, why: 'Lines can cross at any angle. Only some crossings are right angles.' },
      ], k),
      hints: ['Opposite angles face each other across the crossing.', 'Compare an opposite angle with the angle beside it. Which one is it equal to?'],
      steps: ['Opposite angles at a crossing are equal (vertically opposite angles).', `So the angle opposite ${a}° is also ${a}°.`, `The angle beside it on the line is ${180 - a}°, and that is the one ${p.name} found.`],
    }) }),

  fam({ id: 'g7.angles.transversal-reason', skill: 'G7_ANGLES', outcome: 'G7.ANGLES.c', rung: 2, form: 'why',
    draw: () => ({ a: pick([48, 52, 62, 68, 72, 74, 108, 112, 118, 124]), type: pick(['alt', 'corr', 'coint']), k: randInt(0, 3) }),
    make: ({ a, type, k }) => {
      const R = {
        alt: { val: a, reason: 'alternate angles are equal', where: `Angle x is between the parallel lines, on the opposite side of the transversal from the ${a}° angle.` },
        corr: { val: a, reason: 'corresponding angles are equal', where: `The ${a}° angle is above one parallel line and to the right of the transversal. Angle x is above the other parallel line and to the right of the transversal.` },
        coint: { val: 180 - a, reason: 'co-interior angles add up to 180°', where: `Angle x is between the parallel lines, on the same side of the transversal as the ${a}° angle.` },
        vert: { val: a, reason: 'vertically opposite angles are equal' },
      };
      const wrongWhy = {
        alt: 'Alternate angles lie between the parallel lines on opposite sides of the transversal. Check where angle x is.',
        corr: 'Corresponding angles are in matching places, one at each crossing, both on the same side and both above or both below their lines.',
        coint: 'Co-interior angles lie between the parallel lines on the same side of the transversal. Check where angle x is.',
        vert: 'Vertically opposite angles are across a single crossing. Angle x is at the other crossing.',
      };
      const opts = ['alt', 'corr', 'coint', 'vert'].map(t => ({ text: `${R[t].val}°, because ${R[t].reason}`, right: t === type, why: t === type ? undefined : wrongWhy[t] }));
      return {
        question: `Line AB is parallel to line CD. The transversal EF crosses both. ${R[type].where} What is angle x, and what is the reason?`,
        options: rot(opts, k),
        hints: ['Say where angle x is: which side of the transversal, and between or outside the parallel lines.', 'Match that position to one of the angle pairs: alternate, corresponding, co-interior.'],
        steps: [`Position of x compared with the ${a}° angle: ${type === 'alt' ? 'opposite sides, between the lines, so alternate' : type === 'corr' ? 'matching places at the two crossings, so corresponding' : 'same side, between the lines, so co-interior'}.`, `So x = ${R[type].val}°, because ${R[type].reason}.`],
      };
    } }),

  fam({ id: 'g7.angles.gate-brace', skill: 'G7_ANGLES', outcome: 'G7.ANGLES.c', rung: 2, form: 'steps',
    draw: () => ({ a: pick([48, 52, 56, 58, 62, 64, 68, 72, 118, 122]), p: person() }),
    make: ({ a, p }) => ({
      question: `${p.name} is looking at a gate. The top bar and the bottom bar are parallel. A brace crosses both bars. Below the top bar and to the left of the brace, the brace makes an angle of ${a}° with the top bar.`,
      parts: [
        { prompt: 'Above the bottom bar and to the right of the brace, the angle is alternate to the first angle. What is its size, in degrees?', answer: a, unit: '°', hint: 'Alternate angles between parallel lines are equal.', wrong: [[180 - a, 'Alternate angles are equal. They do not add up to 180°.']] },
        { prompt: 'Above the bottom bar and to the left of the brace, the angle is co-interior to the first angle. What is its size, in degrees?', answer: 180 - a, unit: '°', hint: 'Co-interior angles lie on the same side and add up to a straight angle.', wrong: [[a, 'Co-interior angles are not equal. They add up to a straight angle.']] },
        { prompt: 'Above the top bar and to the right of the brace, the angle is vertically opposite to the first angle. What is its size, in degrees?', answer: a, unit: '°', hint: 'Vertically opposite angles are across one crossing and are equal.', wrong: [[180 - a, 'That is the angle beside it. The opposite angle is across the crossing.']] },
      ],
      steps: [`Alternate angles are equal: ${a}°.`, `Co-interior angles add up to 180°: 180 − ${a} = ${180 - a}°.`, `Vertically opposite angles are equal: ${a}°.`],
    }),
    check: ({ a }, v) => v[0] === a && v[0] + v[1] === 180 && v[2] === v[0] }),

  fam({ id: 'g7.angles.spot-cointerior', skill: 'G7_ANGLES', outcome: 'G7.ANGLES.c', rung: 3, form: 'spot',
    draw: () => {
      const a = pick([52, 58, 64, 68, 72, 76, 82]); const kind = pick(['rule', 'rule', 'arith']);
      const R = kind === 'rule' ? pick([360, 90]) : 180;
      const slip = pick([10, -10, 20]);
      const v = kind === 'rule' ? R - a : 180 - a + slip;
      return { a, kind, R, v, p: person() };
    },
    make: ({ a, kind, R, v, p }) => {
      const right = 180 - a;
      return {
        question: `Lines AB and CD are parallel. Angle x and the ${a}° angle are co-interior angles. ${p.name} worked out x. Which step has the mistake?`,
        working: [
          { text: `Co-interior angles add up to ${R}°.`, ok: R === 180 },
          { text: `So x + ${a} = ${R}.`, ok: true },
          { text: `x = ${R} − ${a} = ${v}.`, ok: v === R - a },
          { text: `So angle x is ${v}°.`, ok: true },
        ],
        fix: kind === 'rule' ? `Co-interior angles add up to 180°, not ${R}°. That makes x = ${right}°.` : `The subtraction is wrong: 180 − ${a} = ${right}, not ${v}.`,
        hints: ['Check the rule used, then check the sums that follow.', 'Co-interior angles lie between parallel lines on the same side of the transversal.'],
        steps: [`Co-interior angles add up to 180°.`, `x = 180 − ${a} = ${right}°.`],
      };
    } }),

  fam({ id: 'g7.angles.gable-isosceles', skill: 'G7_ANGLES', outcome: 'G7.ANGLES.d', rung: 2, form: 'word',
    draw: () => { const t = pick([20, 30, 40, 50, 80, 100, 120]); return { t, p: person() }; },
    make: ({ t, p }) => ({
      question: `The gable end of ${p.name}'s house is an isosceles triangle. The angle at the top is ${t}°. What is the size of each base angle, in degrees?`,
      answer: (180 - t) / 2,
      wrong: [[180 - t, 'That is both base angles together. They are equal, so share it between the two.'], [t / 2, 'That is half of the top angle. The base angles come from what is left of 180°.'], [t, 'The top angle is different from the base angles. The two base angles are the equal ones.']],
      hints: ['The three angles of a triangle add up to a fixed total.', 'The two base angles of an isosceles triangle are equal.'],
      steps: [`Angles of a triangle add up to 180°, so the two base angles together are 180 − ${t} = ${180 - t}°.`, `They are equal: ${180 - t} ÷ 2 = ${(180 - t) / 2}° each.`],
    }),
    check: ({ t }, a) => 2 * a + t === 180 }),

  fam({ id: 'g7.angles.triangle-algebra', skill: 'G7_ANGLES', outcome: 'G7.ANGLES.d', rung: 3, form: 'steps',
    draw: () => {
      const x = pick([20, 25, 30, 35, 40]), p = pick([10, 20]);
      const q = 180 - 4 * x - p;
      if (q < 10 || q > 70 || q % 5 !== 0) return null;
      return { x, p, q };
    },
    make: ({ x, p, q }) => ({
      question: `The three angles of a triangle are x°, (x + ${p})° and (2x + ${q})°.`,
      parts: [
        { prompt: 'The angles add up to 180°. Write 4x + ? = 180. What is the number in the place of ?', answer: p + q, hint: `Add the plain numbers ${p} and ${q}.`, wrong: [[q - p, 'The angles are added together. Add the plain numbers.'], [p * q, 'Add the plain numbers. Do not multiply.']] },
        { prompt: 'Find x.', answer: x, hint: 'Take the plain number from 180, then divide by 4.', wrong: [[180 / 4, 'Take the plain number away from 180 before dividing.'], [(180 - p - q) / 2, 'There are 4 lots of x in all (x, x and 2x). Divide by 4.']] },
        { prompt: 'What is the size of the largest angle, in degrees?', answer: Math.max(x, x + p, 2 * x + q), unit: '°', hint: 'Work out all three angles, then pick the largest.', wrong: [[x + p, 'Check the third angle too.'], [2 * x, 'You have not added the plain number to 2x.']] },
      ],
      steps: [`x + x + 2x = 4x and ${p} + ${q} = ${p + q}, so 4x + ${p + q} = 180.`, `4x = ${180 - p - q}, so x = ${x}.`, `The angles are ${x}°, ${x + p}° and ${2 * x + q}°.`],
    }),
    check: ({ p, q }, v) => v[0] === p + q && 4 * v[1] + v[0] === 180 && v[1] + (v[1] + p) + (2 * v[1] + q) === 180 && v[2] === Math.max(v[1], v[1] + p, 2 * v[1] + q) }),

  fam({ id: 'g7.angles.exterior-triangle', skill: 'G7_ANGLES', outcome: 'G7.ANGLES.d', rung: 2, form: 'word',
    draw: () => { const e = randInt(20, 30) * 5, pA = randInt(7, 14) * 5; return e - pA >= 25 && uniq(e - pA, e + pA, 180 - e, pA) ? { e, pA } : null; },
    make: ({ e, pA }) => ({
      question: `In triangle ABC, the side BC is extended to D. The exterior angle ACD is ${e}° and angle A is ${pA}°. What is angle B, in degrees?`,
      answer: e - pA,
      wrong: [[e + pA, 'The exterior angle is the sum of the two far angles. So the other far angle is found by taking away.'], [180 - e, 'That is angle ACB, the angle beside the exterior angle. Angle B is a different corner.'], [pA, 'That is angle A, which you were given.']],
      hints: ['An exterior angle equals the sum of the two interior opposite angles.', 'The two interior opposite angles to angle ACD are angle A and angle B.'],
      steps: [`Exterior angle ACD = angle A + angle B.`, `${e} = ${pA} + angle B, so angle B = ${e} − ${pA} = ${e - pA}°.`],
    }),
    check: ({ e, pA }, a) => a + pA + (180 - e) === 180 }),

  fam({ id: 'g7.angles.quad-why', skill: 'G7_ANGLES', outcome: 'G7.ANGLES.d', rung: 3, form: 'why',
    draw: () => ({ shape: pick(['trapezium', 'four-sided field with no equal sides', 'quadrilateral with no equal sides', 'four-sided plot that is not a rectangle']), k: randInt(0, 3) }),
    make: ({ shape, k }) => ({
      question: `Why do the four angles of any ${shape} add up to 360°?`,
      options: rot([
        { text: 'A diagonal cuts it into two triangles of 180° each', right: true },
        { text: 'It has four corners, and every corner is 90°', right: false, why: 'Only a rectangle or square has four right angles. The corners of this shape can be different sizes.' },
        { text: 'All four corners meet at one point, and angles at a point add up to 360°', right: false, why: 'The corners are at four different places. The 360° at a point is about angles around one point.' },
        { text: 'A diagonal always cuts it into two triangles that are exactly the same', right: false, why: 'The two triangles need not be equal. What matters is that there are two triangles.' },
      ], k),
      hints: ['Draw a line from one corner to the opposite corner.', 'How many triangles do you get? What do the angles of each triangle add up to?'],
      steps: ['One diagonal splits the shape into two triangles.', 'The angles of each triangle add up to 180°, and the angles of the two triangles together make the angles of the shape: 2 × 180° = 360°.'],
    }) }),

  fam({ id: 'g7.angles.parallelogram-steps', skill: 'G8_POLYGON_ANGLES', outcome: 'G7.ANGLES.e', rung: 2, form: 'steps',
    draw: () => ({ a: pick([50, 55, 60, 65, 70, 75, 105, 110, 115, 120, 125]), p: person() }),
    make: ({ a, p }) => ({
      question: `${p.name} draws a parallelogram PQRS. Angle P is ${a}°.`,
      parts: [
        { prompt: 'What is angle R, the opposite angle? (degrees)', answer: a, unit: '°', hint: 'Opposite angles of a parallelogram are equal.', wrong: [[180 - a, 'That is the angle at a neighbouring corner. R is opposite P.']] },
        { prompt: 'What is angle Q, next to P? (degrees)', answer: 180 - a, unit: '°', hint: 'Angles next to each other in a parallelogram add up to a straight angle.', wrong: [[a, 'Neighbouring angles of a parallelogram are not equal, unless it is a rectangle.'], [360 - a, 'Angles at neighbouring corners add up to half of that.']] },
        { prompt: 'What do the four angles P, Q, R and S add up to? (degrees)', answer: 360, unit: '°', hint: 'Use the angles you found, or the rule for any quadrilateral.', wrong: [[180, 'That is only two neighbouring angles.'], [2 * a, 'That adds up only P and R.']] },
      ],
      steps: [`Opposite angles are equal: angle R = ${a}°.`, `Neighbouring angles add up to 180°: angle Q = 180 − ${a} = ${180 - a}°.`, `All four: ${a} + ${180 - a} + ${a} + ${180 - a} = 360°.`],
    }),
    check: ({ a }, v) => v[0] === a && v[1] === 180 - a && v[2] === v[0] + v[1] + v[0] + v[1] }),

  fam({ id: 'g7.angles.parallelogram-why', skill: 'G8_POLYGON_ANGLES', outcome: 'G7.ANGLES.e', rung: 3, form: 'why',
    draw: () => ({ a: pick([55, 60, 65, 70, 75, 105, 110, 115, 120]), k: randInt(0, 3) }),
    make: ({ a, k }) => ({
      question: `In parallelogram ABCD, angle A is ${a}°. Which statement about angle B is correct?`,
      options: rot([
        { text: `Angle B is ${180 - a}°, because A and B are co-interior angles`, right: true },
        { text: `Angle B is ${a}°, because opposite angles of a parallelogram are equal`, right: false, why: 'Opposite angles are equal, but B is next to A. The angle opposite A is C.' },
        { text: `Angle B is ${360 - a}°, because angles at a point add up to 360°`, right: false, why: 'Angles A and B are not all the way round one point. They sit between parallel sides.' },
        { text: 'Angle B is 90°, because a parallelogram has right angles', right: false, why: 'Only a rectangle has right angles. A parallelogram can be slanted.' },
      ], k),
      hints: ['Which side is the transversal for angles A and B?', 'Angles on the same side of a transversal, between parallel lines, are co-interior.'],
      steps: ['AD and BC are parallel, and AB crosses them.', `Angles A and B are co-interior, so they add up to 180°: B = 180 − ${a} = ${180 - a}°.`],
    }) }),

  fam({ id: 'g7.angles.rhombus-diagonal', skill: 'G8_POLYGON_ANGLES', outcome: 'G7.ANGLES.e', rung: 3, form: 'word',
    draw: () => { const b = pick([40, 50, 70, 80, 100, 110, 120, 140]); return { b, p: person() }; },
    make: ({ b }) => ({
      question: `ABCD is a rhombus. Angle ABC is ${b}°. All four sides are equal, so triangle ABC is isosceles with AB = BC. What is angle BAC, in degrees?`,
      answer: (180 - b) / 2,
      wrong: [[180 - b, 'That is both equal base angles together. Share it between the two.'], [b / 2, 'That is half of the angle you were given. Use the angle sum of the triangle.'], [90, 'The diagonals of a rhombus cross at 90°, but angle BAC is a different angle.']],
      hints: ['Look only at triangle ABC.', 'In an isosceles triangle the angles opposite equal sides are equal.'],
      steps: [`In triangle ABC the angles add up to 180°, so angles BAC and BCA together are 180 − ${b} = ${180 - b}°.`, `They are equal, so BAC = ${180 - b} ÷ 2 = ${(180 - b) / 2}°.`],
    }),
    check: ({ b }, a) => 2 * a + b === 180 }),

  fam({ id: 'g7.angles.polygon-sum-table', skill: 'G8_POLYGON_ANGLES', outcome: 'G7.ANGLES.f', rung: 2, form: 'table',
    draw: () => ({ known: pick([5, 6]), type: pick(['sum', 'sides']) }),
    make: ({ known, type }) => {
      const name = { 3: 'Triangle', 4: 'Quadrilateral', 5: 'Pentagon', 6: 'Hexagon' };
      const target = known === 5 ? 6 : 5;
      const row = (n) => ({ cells: [name[n], String(n), String(n - 2), String((n - 2) * 180)] });
      const hidden = { cells: [type === 'sum' ? name[target] : '?', type === 'sum' ? String(target) : '?', '?', '?'] };
      const rows = known === 5 ? [row(3), row(4), row(5), hidden] : [row(3), row(4), hidden, row(6)];
      const S = (target - 2) * 180;
      const common = { model: { type: 'table', data: { head: ['Shape', 'Sides', 'Triangles', 'Angle sum °'], rows } } };
      return type === 'sum' ? {
        ...common, story: false,
        question: `The table shows how the angle sum of a polygon grows. Use it to find the sum of the interior angles of the ${name[target].toLowerCase()}, in degrees.`,
        answer: S,
        wrong: [[target * 180, 'The polygon splits into 2 fewer triangles than it has sides.'], [(target - 1) * 180, 'Look at the pattern in the table: how many fewer triangles than sides?'], [(target - 3) * 180, 'Count the triangles again. The table shows the pattern.']],
        hints: ['Look at how the number of triangles changes with the number of sides.', 'Each triangle has an angle sum of 180°.'],
        steps: [`The number of triangles is 2 fewer than the number of sides: ${target} − 2 = ${target - 2}.`, `${target - 2} × 180 = ${S}°.`],
      } : {
        ...common, story: false,
        question: `The table shows how the angle sum of a polygon grows. The interior angles of one more polygon add up to ${S}°. How many sides does it have?`,
        answer: target,
        wrong: [[S / 180, 'That is the number of triangles. The polygon has 2 more sides than triangles.'], [S / 180 + 1, 'Look at the table: sides are always 2 more than triangles.'], [S / 90, 'Divide the sum by 180° to count triangles, then use the table pattern.']],
        hints: ['How many triangles of 180° fit in the sum?', 'In the table, how many more sides than triangles are there?'],
        steps: [`${S} ÷ 180 = ${S / 180} triangles.`, `Sides = triangles + 2 = ${target}.`],
      };
    },
    check: ({ type }, a) => (type === 'sum' ? a % 180 === 0 && a / 180 + 2 >= 5 : (a - 2) * 180 >= 540) }),

  fam({ id: 'g7.angles.exterior-sides', skill: 'G8_POLYGON_ANGLES', outcome: 'G7.ANGLES.f', rung: 2, form: 'word',
    draw: () => { const n = pick([3, 4, 5, 6]), kind = pick(['ext', 'int']); return n === 4 ? null : { n, kind, p: person() }; },
    make: ({ n, kind, p }) => {
      const ext = 360 / n, int = 180 - ext;
      if (kind === 'ext') return {
        question: `${p.name} cuts tiles in the shape of a regular polygon. Each exterior angle of a tile is ${ext}°. How many sides does a tile have?`,
        answer: n,
        wrong: [[n - 2, 'Exterior angles do not use the angle sum rule. Share one full turn among equal exterior angles.'], [round(180 / ext, 1), 'The exterior angles go all the way round the shape, which is a full turn, not a half turn.'], [n + 2, 'Divide a full turn by one exterior angle.']],
        hints: ['The exterior angles of any polygon add up to one full turn.', 'How many equal exterior angles make a full turn?'],
        steps: ['Exterior angles of a polygon add up to 360°.', `Number of sides = 360 ÷ ${ext} = ${n}.`],
      };
      return {
        question: `${p.name} cuts tiles in the shape of a regular polygon. Each interior angle of a tile is ${int}°. How many sides does a tile have?`,
        answer: n,
        wrong: [[round(360 / int, 1), 'You divided a full turn by the interior angle. Find the exterior angle first.'], [ext, 'That is the exterior angle. The question asks for the number of sides.'], [round(180 / ext, 1), 'The exterior angles add up to a full turn, not a half turn.']],
        hints: ['The interior angle and the exterior angle at a corner lie on a straight line.', 'Find the exterior angle, then see how many fit in a full turn.'],
        steps: [`Exterior angle = 180 − ${int} = ${ext}°.`, `Exterior angles add up to 360°, so sides = 360 ÷ ${ext} = ${n}.`],
      };
    },
    check: ({ n, kind }, a) => (kind === 'ext' ? a * (360 / n) === 360 : a * (180 - (180 - 360 / n)) === 360) }),

  fam({ id: 'g7.angles.hexagon-why', skill: 'G8_POLYGON_ANGLES', outcome: 'G7.ANGLES.f', rung: 3, form: 'why',
    draw: () => ({ n: pick([5, 6]), p: person(), k: randInt(0, 3) }),
    make: ({ n, p, k }) => {
      const shape = n === 5 ? 'pentagon' : 'hexagon', ext = 360 / n, int = 180 - ext;
      return {
        question: `${p.name} says each interior angle of a regular ${shape} is ${ext}°, because 360 ÷ ${n} = ${ext}. Why is that wrong?`,
        options: rot([
          { text: `360 ÷ ${n} gives the exterior angle, not the interior angle`, right: true },
          { text: `The interior angle should be 180° ÷ ${n}, not 360° ÷ ${n}`, right: false, why: '180° is the angle sum of one triangle only. It is not shared among the corners.' },
          { text: `Nothing is wrong, because angles at a point add up to 360°`, right: false, why: 'The interior angles are at different corners, not around one point.' },
          { text: `The sum of the interior angles must be divided by ${n - 2}`, right: false, why: 'The sum is found from the number of triangles, and then shared among the corners, one angle for each corner.' },
        ], k),
        hints: ['What do the exterior angles of a polygon add up to?', 'How is an interior angle related to the exterior angle at the same corner?'],
        steps: [`360 ÷ ${n} = ${ext}° is the exterior angle at each corner.`, `The interior angle lies on a straight line with it: 180 − ${ext} = ${int}°.`],
      };
    } }),

  fam({ id: 'g7.angles.polygon-spot', skill: 'G8_POLYGON_ANGLES', outcome: 'G7.ANGLES.f', rung: 3, form: 'spot',
    draw: () => { const n = pick([5, 6]); const t = pick([n, n - 1]); return { n, t, p: person() }; },
    make: ({ n, t, p }) => {
      const shape = n === 5 ? 'pentagon' : 'hexagon';
      const total = t * 180, each = total / n;
      return {
        question: `${p.name} worked out each interior angle of a regular ${shape}. Which step has the mistake?`,
        working: [
          { text: `The ${shape} has ${n} sides.`, ok: true },
          { text: `It splits into ${t} triangles from one corner.`, ok: t === n - 2 },
          { text: `The angle sum is ${t} × 180 = ${commas(total)}°.`, ok: total === t * 180 },
          { text: `Each interior angle is ${commas(total)} ÷ ${n} = ${each}°.`, ok: each * n === total },
        ],
        fix: `Splitting from one corner gives ${n - 2} triangles, 2 fewer than the sides. The angle sum is ${commas((n - 2) * 180)}°, so each angle is ${((n - 2) * 180) / n}°.`,
        hints: ['Check each step against the one before it.', 'Draw lines from one corner to the others. How many triangles are there?'],
        steps: [`Triangles = ${n} − 2 = ${n - 2}.`, `Sum = ${(n - 2) * 180}°, each angle = ${((n - 2) * 180) / n}°.`],
      };
    } }),

  // ========================================================= CONSTRUCTIONS
  fam({ id: 'g7.construct.spot-plan', skill: 'G7_ANGLE_CONSTRUCTION', outcome: 'G7.CONSTRUCT.b', rung: 3, form: 'spot',
    draw: () => {
      const base = pick([60, 90, 120]), piece = pick([30, 15]), kind = pick(['count', 'add']);
      const times = piece === 30 ? 1 : 2;
      const total = base + piece;
      const claimed = piece;
      const shownTotal = kind === 'add' ? total + pick([-10, 10, 20]) : base + claimed;
      return { base, piece, kind, times, total, claimed, shownTotal, p: person() };
    },
    make: ({ base, piece, kind, times, total, claimed, shownTotal, p }) => {
      const wrongTimes = kind === 'count' ? (times === 1 ? 2 : 1) : times;
      return {
        question: `${p.name} plans to construct an angle of ${total}° with a ruler and compasses. Which step of the plan has the mistake?`,
        working: [
          { text: `Construct ${base}° first.`, ok: true },
          { text: `Construct 60° and bisect it ${wrongTimes === 1 ? 'once' : 'twice'} to get ${claimed}°.`, ok: claimed === 60 / 2 ** wrongTimes },
          { text: `Construct the ${claimed}° angle beside the ${base}° angle. The two together make ${shownTotal}°.`, ok: shownTotal === base + claimed },
          { text: `The angle of ${shownTotal}° is ready.`, ok: true },
        ],
        fix: kind === 'count' ? `Bisecting 60° ${wrongTimes === 1 ? 'once' : 'twice'} gives ${60 / 2 ** wrongTimes}°, not ${claimed}°. To get ${piece}° you must bisect ${times === 1 ? 'once' : 'twice'}.` : `${base}° + ${piece}° is ${total}°, not ${shownTotal}°.`,
        hints: ['Check each step. Does it give the angle it claims?', 'Bisecting cuts an angle into two equal halves each time.'],
        steps: [`60° bisected ${times === 1 ? 'once' : 'twice'} is ${piece}°.`, `${base}° + ${piece}° = ${total}°.`],
      };
    } }),

  fam({ id: 'g7.construct.arc-reasons', skill: 'G7_CONSTRUCTIONS', outcome: 'G7.CONSTRUCT.b', rung: 3, form: 'why',
    draw: () => ({ step: randInt(0, 3), k: randInt(0, 3) }),
    make: ({ step, k }) => {
      const S = [
        { do: 'put the compass point on the corner of the angle and draw one arc across both arms', why: 'So that the two marks on the arms are the same distance from the corner' },
        { do: 'keep the compasses at the same width when you draw the two arcs that cross inside the angle', why: 'So that the crossing point is the same distance from each of the two marks on the arms' },
        { do: 'join the corner to the point where the two arcs cross', why: 'That point is equally far from both arms, so the line splits the angle into two equal angles' },
        { do: 'open the compasses wider than half the gap between the two marks before drawing the crossing arcs', why: 'Otherwise the two arcs would be too short to meet' },
      ];
      const opts = S.map((s, i) => ({ text: s.why, right: i === step, why: i === step ? undefined : 'That is a good reason, but for a different step of the method. Check which step the question asks about.' }));
      return {
        question: `When you bisect an angle with a ruler and compasses, you ${S[step].do}. Why?`,
        story: false, options: rot(opts, k),
        hints: ['Think about what the compasses measure: a distance.', 'Which of the reasons is about that exact step?'],
        steps: [`The step: ${S[step].do}.`, `${S[step].why}.`],
      };
    } }),

  fam({ id: 'g7.construct.triangle-possible', skill: 'G7_CONSTRUCTIONS', outcome: 'G7.CONSTRUCT.b', rung: 3, form: 'why',
    draw: () => {
      const a = randInt(3, 8), b = randInt(3, 8), possible = Math.random() < 0.5;
      const lo = Math.min(a, b), hi = Math.max(a, b);
      const c = possible ? randInt(hi + 1, a + b - 1) : randInt(a + b + 1, a + b + 4);
      if (possible && a + b - 1 < hi + 1) return null;
      const L = Math.max(a, b, c), shorts = [a, b, c].sort((x, y) => x - y);
      if (!uniq(a, b, c)) return null;
      return { sides: [a, b, c], L, s1: shorts[0], s2: shorts[1], possible: shorts[0] + shorts[1] > L, k: randInt(0, 3), p: person() };
    },
    make: ({ sides, L, s1, s2, possible, k, p }) => {
      const opts = possible ? [
        { text: `Yes. ${s1} + ${s2} = ${s1 + s2}, which is more than ${L}`, right: true },
        { text: 'No. The three sides are all different lengths', right: false, why: 'A triangle can have three different sides. What matters is whether the two shorter sides together are longer than the longest side.' },
        { text: `No. ${L} cm is longer than each of the other two sides`, right: false, why: 'The longest side is always longer than each of the others. The test is whether the two shorter sides together beat it.' },
        { text: 'Yes. Any three lengths make a triangle', right: false, why: 'Not any three. If the two shorter sides together are too short, the arcs never meet.' },
      ] : [
        { text: `No. ${s1} + ${s2} = ${s1 + s2}, which is less than ${L}`, right: true },
        { text: 'Yes. Any three lengths at all will make a triangle', right: false, why: 'Not any three. If the two shorter sides together are too short, the arcs never meet.' },
        { text: `Yes. ${L} cm is the longest side, so it can be the base`, right: false, why: 'Any side can be the base. The problem is that the two shorter sides together are too short to reach each other.' },
        { text: 'No. The three sides are all different lengths', right: false, why: 'A triangle can have three different sides. Check whether the two shorter sides together are longer than the longest.' },
      ];
      return {
        question: `${p.name} wants to construct a triangle with sides of ${sides[0]} cm, ${sides[1]} cm and ${sides[2]} cm, using a ruler and compasses. Can it be done?`,
        story: false, options: rot(opts, k),
        hints: ['Draw the longest side first. The two arcs come from its ends.', 'Do the two shorter sides, laid end to end, reach past the longest side?'],
        steps: [`The two shorter sides are ${s1} cm and ${s2} cm. Together: ${s1 + s2} cm.`, `The longest side is ${L} cm. ${possible ? 'The shorter two together are longer, so the arcs cross and a triangle can be made.' : 'The shorter two together are not longer, so the arcs do not meet. No triangle.'}`],
      };
    } }),

  // ================================================================== DATA
  // ---- frequency tables
  fam({ id: 'g7.data.freq-items-total', skill: 'G7_DATA_REPRESENT', outcome: 'G7.DATA.c', rung: 2, form: 'table',
    draw: () => {
      const c = pick([FREQ_CTX[0], FREQ_CTX[3]]); const fs = Array.from({ length: 5 }, () => randInt(2, 10));
      const items = sum(fs.map((f, i) => f * (c.lo + i)));
      return uniq(items, sum(fs), sum(Array.from({ length: 5 }, (_, i) => c.lo + i)), sum(fs) * (c.lo + 4)) ? { c, fs } : null;
    },
    make: ({ c, fs }) => {
      const xs = fs.map((_, i) => c.lo + i);
      const items = sum(fs.map((f, i) => f * xs[i]));
      return {
        question: `The frequency table shows ${c.desc}. Work out the total number of ${c.items}.`,
        model: freqModel(c, fs),
        answer: items,
        wrong: [[sum(fs), `That counts the ${c.who}. Each ${c.who === 'matches' ? 'match' : 'learner'} in a row has several ${c.items}.`], [sum(xs), 'That adds the numbers in the first column once each. Each one happened as many times as its frequency.'], [sum(fs) * xs[4], 'That treats every row as if it had the biggest value. Each row has its own value.']],
        hints: ['A row with value 3 and frequency 4 means 3 happened 4 times.', 'Multiply each value by its frequency, then add the products.'],
        steps: xs.map((x, i) => `${x} × ${fs[i]} = ${x * fs[i]}`).concat([`Total: ${sum(fs.map((f, i) => f * xs[i]))}.`]),
      };
    },
    check: ({ c, fs }, a) => { let t = 0; for (let i = 0; i < 5; i++) for (let j = 0; j < fs[i]; j++) t += c.lo + i; return t === a; } }),

  fam({ id: 'g7.data.tally-fruit', skill: 'G7_DATA_REPRESENT', outcome: 'G7.DATA.c', rung: 2, form: 'table',
    draw: () => {
      const fruits = shuffle(['Mango', 'Banana', 'Orange', 'Pawpaw']);
      const fs = fruits.map(() => randInt(3, 14));
      const A = 0, B = randInt(1, 3);
      const g = (f) => Math.floor(f / 5) * 4 + (f % 5);
      const ans = fs[A] + fs[B];
      return uniq(ans, fs[A], sum(fs), g(fs[A]) + g(fs[B])) && (fs[A] >= 5 || fs[B] >= 5) ? { fruits, fs, A, B } : null;
    },
    make: ({ fruits, fs, A, B }) => {
      const g = (f) => Math.floor(f / 5) * 4 + (f % 5);
      return {
        question: `Learners chose a fruit for break. The tally chart shows their choices. A group ||||/ means 5. How many learners chose ${fruits[A].toLowerCase()} or ${fruits[B].toLowerCase()}?`,
        model: { type: 'table', data: { head: ['Fruit', 'Tally'], rows: fruits.map((n, i) => ({ label: n, value: tally(fs[i]) })) } },
        answer: fs[A] + fs[B],
        wrong: [[fs[A], `That is only one of the two fruits.`], [sum(fs), 'That counts every fruit. The question asks about two of them.'], [g(fs[A]) + g(fs[B]), 'A group ||||/ is 5 in all, four strokes and the one across them. Count the one across too.']],
        hints: ['Count each tally in fives, then the loose strokes.', 'Find the frequency of each fruit asked about, then add the two frequencies.'],
        steps: [`${fruits[A]}: ${fs[A]}. ${fruits[B]}: ${fs[B]}.`, `Together: ${fs[A]} + ${fs[B]} = ${fs[A] + fs[B]}.`],
      };
    },
    check: ({ fs, A, B }, a) => a - fs[B] === fs[A] && a + sum(fs.filter((_, i) => i !== A && i !== B)) === sum(fs) }),

  fam({ id: 'g7.data.freq-percent', skill: 'G7_DATA_REPRESENT', outcome: 'G7.DATA.c', rung: 3, form: 'table',
    draw: () => {
      const c = pick(FREQ_CTX); const total = pick([20, 25, 40, 50]);
      const cuts = shuffle(Array.from({ length: total - 1 }, (_, i) => i + 1)).slice(0, 4).sort((a, b) => a - b);
      const fs = [cuts[0], cuts[1] - cuts[0], cuts[2] - cuts[1], cuts[3] - cuts[2], total - cuts[3]];
      const k = c.lo + pick([2, 3]);
      const count = sum(fs.filter((_, i) => c.lo + i >= k));
      const pct = (count * 100) / total;
      if (!Number.isInteger(pct) || pct < 10 || pct > 90) return null;
      return uniq(pct, count, 100 - pct, count / total) ? { c, fs, k, count, total, pct } : null;
    },
    make: ({ c, fs, k, count, total, pct }) => ({
      question: `Use the frequency table to find the percentage of the ${c.who} that ${c.phr(k)}.`,
      model: freqModel(c, fs),
      answer: pct,
      wrong: [[count, 'That is the number of them, not the percentage. Compare it with the total, then write it out of 100.'], [100 - pct, 'That is the percentage who did not. Check which rows the question asks about.'], [round(count / total, 2), 'That is a fraction. Multiply by 100 to make it a percentage.']],
      hints: ['First add the frequencies of the rows the question asks about.', 'Then add all the frequencies to get the total, and write the first as a percentage of it.'],
      steps: [`Rows with ${k} or more: ${count}.`, `Total: ${total}.`, `${count} ÷ ${total} × 100 = ${pct}%.`],
    }),
    check: ({ c, fs, k }, a) => { const all = sum(fs); const part = fs.reduce((s, f, i) => s + (c.lo + i >= k ? f : 0), 0); return (a * all) / 100 === part; } }),

  fam({ id: 'g7.data.freq-missing-steps', skill: 'G7_DATA_REPRESENT', outcome: 'G7.DATA.c', rung: 3, form: 'steps',
    draw: () => {
      const c = pick([FREQ_CTX[1], FREQ_CTX[2]]); const fs = Array.from({ length: 5 }, () => randInt(3, 12)); const m = randInt(1, 3);
      const k = c.lo + pick([2, 3]);
      const total = sum(fs);
      const atLeast = sum(fs.filter((_, i) => c.lo + i >= k));
      const mx = Math.max(...fs);
      if (fs.filter(f => f === mx).length !== 1) return null;
      const mode = c.lo + fs.indexOf(mx);
      return uniq(fs[m], total, atLeast, mode) ? { c, fs, m, k, total, atLeast, mode } : null;
    },
    make: ({ c, fs, m, k, total, atLeast, mode }) => {
      const model = freqModel(c, fs);
      model.data.rows[m].value = '?';
      return {
        question: `${c.intro} ${total} ${c.who} were counted in all. One frequency in the table is missing.`,
        model,
        parts: [
          { prompt: 'What is the missing frequency?', answer: fs[m], hint: 'The frequencies must add up to the total counted.', wrong: [[total, 'That is the total. The missing frequency is only one row.'], [sum(fs.filter((_, i) => i !== m)), 'That is the sum of the other rows. Take it away from the total.']] },
          { prompt: `How many ${c.who} ${c.phr(k)}?`, answer: atLeast, hint: 'Add the frequencies of the rows that fit, using the missing value you found.', wrong: [[total - atLeast, 'That is the number who do not. Read the question again.']] },
          { prompt: c.most, answer: mode, hint: 'Find the row with the biggest frequency, then read its value from the first column.', wrong: [[Math.max(...fs), 'That is the biggest frequency. The question asks for the value in that row.']] },
        ],
        steps: [`The other frequencies add up to ${total - fs[m]}, so the missing one is ${total} − ${total - fs[m]} = ${fs[m]}.`, `Rows with ${k} or more add up to ${atLeast}.`, `The biggest frequency is ${Math.max(...fs)}, in the row for ${mode}.`],
      };
    },
    check: ({ c, fs, m, total, k }, v) => v[0] + sum(fs.filter((_, i) => i !== m)) === total && v[1] === fs.reduce((s, f, i) => s + (c.lo + i >= k ? f : 0), 0) && fs[v[2] - c.lo] === Math.max(...fs) }),

  // ---- a suitable scale
  fam({ id: 'g7.data.scale-choose', skill: 'G7_DATA_REPRESENT', outcome: 'G7.DATA.d', rung: 3, form: 'word',
    draw: () => {
      const H = pick([10, 12]), idx = randInt(1, 7), s = SCALES[idx];
      const M = s * randInt(Math.floor(H / 2) + 1, H);
      const opts = [SCALES[idx - 1], s, SCALES[idx + 1], SCALES[idx + 2]];
      const fits = opts.filter(x => M / x <= H);
      const best = Math.min(...fits);
      return best === s ? { H, M, opts, s, t: pick(THINGS), p: person(), k: randInt(0, 3) } : null;
    },
    make: ({ H, M, opts, s, t, p, k }) => ({
      question: `${p.name} draws a bar graph of the ${t.t} sold by four shops. The vertical axis is ${H} squares tall. The tallest bar shows ${commas(M)} ${t.u}. Which scale makes the tallest bar as tall as possible and still fit on the axis?`,
      options: rot(opts.map(x => ({
        text: `1 square stands for ${commas(x)} ${t.u}`, right: x === s,
        why: x === s ? undefined : M / x > H ? `The tallest bar would need ${round(M / x, 1)} squares, but the axis has only ${H}. It would go off the paper.` : `It fits, but the tallest bar would be only ${round(M / x, 1)} squares tall. A bigger bar uses the paper better.`,
      })), k),
      hints: ['For each scale, divide the tallest value by the size of one square.', 'The bar must fit on the axis, so the number of squares cannot be more than its height.'],
      steps: opts.map(x => `1 square = ${commas(x)}: the tallest bar needs ${commas(round(M / x, 1))} squares.`).concat([`The smallest scale that still fits is ${commas(s)} ${t.u} to a square.`]),
    }) }),

  fam({ id: 'g7.data.pictograph-compare', skill: 'G7_DATA_REPRESENT', outcome: 'G7.DATA.d', rung: 2, form: 'graph',
    draw: () => {
      const each = pick([10, 20, 50]); const labels = shuffle(['Walk', 'Bus', 'Bicycle', 'Boda boda', 'Car']).slice(0, 4);
      const u = labels.map(() => randInt(2, 17) / 2);
      if (new Set(u).size < 4) return null;
      const a = 0, b = 1;
      if (u[a] <= u[b] || u[a] - u[b] < 1) return null;
      return { each, labels, u, a, b };
    },
    make: ({ each, labels, u, a, b }) => ({
      question: `The pictograph shows how learners travel to school. Each symbol stands for ${each} learners. How many more learners are in the ${labels[a]} row than in the ${labels[b]} row?`,
      model: { type: 'pictograph', data: { rows: labels.map((label, i) => ({ label, value: u[i] * each })), each, symbol: '●' } },
      answer: (u[a] - u[b]) * each,
      wrong: [[u[a] - u[b], 'That is the difference in symbols. Each symbol stands for more than one learner.'], [(u[a] + u[b]) * each, '"How many more" asks for the difference, so subtract.'], [u[a] * each, `That is the whole ${labels[a]} row. Take away the ${labels[b]} row.`]],
      hints: ['Count the symbols in each of the two rows. A half symbol is half of the value.', 'Find the difference in symbols, then use what each symbol stands for.'],
      steps: [`${labels[a]}: ${u[a]} symbols. ${labels[b]}: ${u[b]} symbols.`, `Difference: ${u[a] - u[b]} symbols × ${each} = ${(u[a] - u[b]) * each} learners.`],
    }),
    check: ({ each, u, a, b }, v) => v / each + u[b] === u[a] }),

  fam({ id: 'g7.data.symbol-choose', skill: 'G7_DATA_REPRESENT', outcome: 'G7.DATA.d', rung: 3, form: 'word',
    draw: () => {
      const R = pick([10, 20, 50, 100]), units = Array.from({ length: 4 }, () => randInt(1, 9));
      if (units.every(x => x % 2 === 0)) return null;
      const vals = units.map(x => (x * R) / 2);
      const max = Math.max(...vals);
      if (max <= 4 * R || max > 8 * R || new Set(vals).size < 4) return null;
      const opts = [R / 2, R, 2 * R, 4 * R];
      const valid = (e) => vals.every(v => (v * 2) % e === 0) && max / e <= 8;
      if (opts.filter(valid).length !== 1 || !valid(R)) return null;
      return { R, vals, opts, p: person(), k: randInt(0, 3) };
    },
    make: ({ R, vals, opts, p, k }) => {
      const valid = (e) => vals.every(v => (v * 2) % e === 0) && Math.max(...vals) / e <= 8;
      return {
        question: `${p.name} draws a pictograph of the bottles sold by four shops: ${vals.join(', ')}. Only whole symbols and half symbols are allowed. The longest row may have at most 8 symbols. What should each symbol stand for?`,
        options: rot(opts.map(e => ({
          text: `${e} bottles`, right: valid(e),
          why: valid(e) ? undefined : vals.some(v => (v * 2) % e !== 0) ? `Some of the numbers cannot be shown with whole and half symbols when a symbol stands for ${e}.` : `The longest row would need more than 8 symbols.`,
        })), k),
        hints: ['Half a symbol must make sense for every number.', 'Check the longest row too: divide it by the value of a symbol.'],
        steps: opts.map(e => `${e} for each symbol: ${valid(e) ? 'works' : vals.some(v => (v * 2) % e !== 0) ? 'some numbers do not fit' : 'too many symbols'}.`),
      };
    } }),

  // ---- bar graphs, pie charts, line graphs
  fam({ id: 'g7.data.bar-top-two', skill: 'G7_DATA_REPRESENT', outcome: 'G7.DATA.f', rung: 2, form: 'graph',
    draw: () => {
      const u = pick([10, 20]), days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      const vals = days.map(() => u * randInt(1, 6)); const s = [...vals].sort((a, b) => b - a);
      if (!(s[0] > s[1] && s[1] > s[2])) return null;
      const t = pick([['eggs a farm collected', 'eggs'], ['kilograms of tomatoes a stall sold', 'kg of tomatoes'], ['litres of milk a dairy sold', 'litres of milk']]);
      return uniq(s[0] + s[1], sum(vals), s[0], s[0] - s[1]) ? { days, vals, s, t } : null;
    },
    make: ({ days, vals, s, t }) => ({
      question: `The bar graph shows the ${t[0]} each day, Monday to Friday. How many ${t[1]} were there on the two busiest days together?`,
      model: { type: 'bar-chart', data: { bars: days.map((label, i) => ({ label, value: vals[i] })) } },
      answer: s[0] + s[1],
      wrong: [[sum(vals), 'That adds all five days. Only the two busiest days are needed.'], [s[0], 'That is only the busiest day. Add the second busiest day too.'], [s[0] - s[1], 'The question asks for the two days together, so add them.']],
      hints: ['Read the height of each bar against the scale.', 'Pick out the two tallest bars, then add their values.'],
      steps: [`The two tallest bars are ${s[0]} and ${s[1]}.`, `Together: ${s[0]} + ${s[1]} = ${s[0] + s[1]}.`],
    }),
    check: ({ vals }, a) => { const rest = [...vals].sort((x, y) => x - y).slice(0, 3); return sum(vals) - sum(rest) === a; } }),

  fam({ id: 'g7.data.pie-missing-steps', skill: 'G6_PIE_CHARTS', outcome: 'G7.DATA.h', rung: 3, form: 'steps',
    draw: () => {
      const names = shuffle(['Walk', 'Bus', 'Bicycle', 'Boda boda']);
      const cuts = shuffle(Array.from({ length: 17 }, (_, i) => i + 3)).slice(0, 3).sort((a, b) => a - b);
      const units = [cuts[0], cuts[1] - cuts[0], cuts[2] - cuts[1], 20 - cuts[2]];
      if (units.some(x => x < 2 || x > 9)) return null;
      const T = pick([120, 200, 240]), m = randInt(0, 3);
      return { names, units, T, m };
    },
    make: ({ names, units, T, m }) => {
      const deg = units.map(x => x * 18);
      const known = sum(deg) - deg[m];
      return {
        question: `The pie chart shows how ${T} learners come to school. One sector has no angle written on it.`,
        model: { type: 'pie-chart', data: { slices: names.map((n, i) => ({ label: i === m ? `${n} ?` : `${n} ${deg[i]}°`, deg: deg[i] })) } },
        parts: [
          { prompt: `What is the angle of the ${names[m]} sector? (degrees)`, answer: deg[m], unit: '°', hint: 'All the sectors of a pie chart together make a full turn.', wrong: [[known, 'That is the total of the other angles. Take it away from the full turn.'], [180 - known, 'A full turn is more than 180°.']] },
          { prompt: `How many learners are in the ${names[m]} sector?`, answer: (deg[m] * T) / 360, hint: 'Write the angle as a fraction of 360°, then take that fraction of the learners.', wrong: [[deg[m], 'That is the angle, not the number of learners.'], [T - (deg[m] * T) / 360, 'That is everyone else.']] },
          { prompt: `What percentage of the learners is that?`, answer: (deg[m] * 100) / 360, unit: '%', hint: 'Write the angle as a fraction of 360°, then as a percentage.', wrong: [[deg[m], 'The angle is out of 360°, not out of 100.'], [100 - (deg[m] * 100) / 360, 'That is the percentage who come another way.']] },
        ],
        steps: [`The other angles add up to ${known}°, so ${names[m]} is 360 − ${known} = ${deg[m]}°.`, `${deg[m]} ÷ 360 × ${T} = ${(deg[m] * T) / 360} learners.`, `${deg[m]} ÷ 360 × 100 = ${(deg[m] * 100) / 360}%.`],
      };
    },
    check: ({ units, T, m }, v) => { const others = units.reduce((s, x, i) => (i === m ? s : s + x * 18), 0); return v[0] + others === 360 && v[1] * 360 === v[0] * T && v[2] * 360 === v[0] * 100; } }),

  fam({ id: 'g7.data.pie-percent-read', skill: 'G6_PIE_CHARTS', outcome: 'G7.DATA.h', rung: 2, form: 'graph',
    draw: () => {
      const names = shuffle(['Football', 'Netball', 'Drama', 'Music', 'Athletics']).slice(0, 4);
      const cuts = shuffle(Array.from({ length: 17 }, (_, i) => i + 3)).slice(0, 3).sort((a, b) => a - b);
      const units = [cuts[0], cuts[1] - cuts[0], cuts[2] - cuts[1], 20 - cuts[2]];
      if (units.some(x => x < 2 || x > 9)) return null;
      const q = randInt(0, 3), pct = units[q] * 5, deg = units[q] * 18;
      return uniq(pct, deg, 100 - pct, Math.round((deg / 180) * 100)) ? { names, units, q, pct, deg } : null;
    },
    make: ({ names, units, q, pct, deg }) => ({
      question: `The pie chart shows the clubs chosen by the learners in Grade 7. What percentage of the learners chose ${names[q].toLowerCase()}?`,
      model: { type: 'pie-chart', data: { slices: names.map((n, i) => ({ label: `${n} ${units[i] * 18}°`, deg: units[i] * 18 })) } },
      answer: pct,
      wrong: [[deg, 'That is the angle of the sector. A percentage is out of 100, and the whole circle is 360°.'], [Math.round((deg / 180) * 100), 'The whole circle is 360°, not 180°.'], [100 - pct, 'That is the percentage who chose something else.']],
      hints: ['What fraction of the whole circle is this sector?', 'The whole circle is 360°. Write the fraction as a percentage.'],
      steps: [`The sector is ${deg}° out of 360°.`, `${deg} ÷ 360 × 100 = ${pct}%.`],
    }),
    check: ({ deg }, a) => (a * 360) / 100 === deg }),

  fam({ id: 'g7.data.pie-totals-why', skill: 'G6_PIE_CHARTS', outcome: 'G7.DATA.h', rung: 3, form: 'why',
    draw: () => {
      const tA = pick([120, 150, 180, 240]), tB = pick([300, 360, 450, 480, 600]); const deg = pick([90, 120, 60, 180]);
      return { tA, tB, deg, p: person(), k: randInt(0, 3), what: pick(['walk to school', 'choose football', 'bring lunch from home']) };
    },
    make: ({ tA, tB, deg, p, k, what }) => {
      const fa = (deg * tA) / 360, fb = (deg * tB) / 360;
      return {
        question: `School A has ${tA} learners and school B has ${tB}. Each school draws a pie chart. In both charts the sector for learners who ${what} is ${deg}°. ${p.name} says the same number of learners ${what} in both schools. Why is ${p.she} wrong?`,
        options: rot([
          { text: 'A sector shows a share of its own total, not a count', right: true },
          { text: 'Equal angles always mean equal numbers of learners', right: false, why: 'An angle shows a share of the whole. The same share of different totals gives different numbers.' },
          { text: 'The school with more learners must have the bigger angle', right: false, why: 'A bigger school does not need a bigger sector. The sector shows a share, not a count.' },
          { text: 'The angles should have been added together first', right: false, why: 'Adding the two angles does not tell you how many learners are in each school.' },
        ], k),
        hints: ['Find the fraction of the circle that the sector is.', `Take that fraction of ${tA}, then of ${tB}.`],
        steps: [`${deg}° is ${deg}/360 of the circle.`, `School A: ${deg}/360 × ${tA} = ${fa}. School B: ${deg}/360 × ${tB} = ${fb}.`, 'The same share of different totals gives different numbers.'],
      };
    } }),

  fam({ id: 'g7.data.line-biggest-rise', skill: 'G7_DATA_REPRESENT', outcome: 'G7.DATA.j', rung: 2, form: 'graph',
    draw: () => {
      const ys = Array.from({ length: 6 }, () => randInt(6, 14) * 10);
      const rises = ys.slice(1).map((y, i) => y - ys[i]);
      const mx = Math.max(...rises);
      if (mx <= 0 || rises.filter(r => r === mx).length !== 1) return null;
      const best = rises.indexOf(mx);
      const fall = rises.indexOf(Math.min(...rises));
      const idx = new Set([best]); if (rises[fall] < 0) idx.add(fall);
      while (idx.size < 4) idx.add(randInt(0, 4));
      return { ys, rises, best, opts: [...idx].sort((a, b) => a - b) };
    },
    make: ({ ys, rises, best, opts }) => ({
      question: 'The line graph shows the price of a kilogram of tomatoes at a market in six weeks. Between which two weeks did the price rise the most?',
      model: { type: 'line-graph', data: { points: ys.map((y, i) => ({ x: i + 1, y })), xTicks: [1, 2, 3, 4, 5, 6], yTicks: [60, 80, 100, 120, 140], xLabel: 'Week', yLabel: 'Price (sh per kg)' } },
      fixedOrder: true,
      options: opts.map(i => ({
        text: `Between week ${i + 1} and week ${i + 2}`, right: i === best,
        why: i === best ? undefined : rises[i] < 0 ? 'The line goes down here, so the price fell.' : 'The price rises here, but by less than somewhere else. Look for the steepest climb.',
      })),
      hints: ['A rise is where the line goes up. The steeper the climb, the bigger the rise.', 'For each pair of weeks, take the earlier price from the later one.'],
      steps: ys.slice(1).map((y, i) => `Week ${i + 1} to ${i + 2}: ${y} − ${ys[i]} = ${y - ys[i]}.`).concat([`The biggest rise is between week ${best + 1} and week ${best + 2}.`]),
    }) }),

  fam({ id: 'g7.data.line-halfway', skill: 'G7_DATA_REPRESENT', outcome: 'G7.DATA.j', rung: 3, form: 'graph',
    draw: () => {
      const ys = [randInt(1, 3) * 10]; for (let i = 1; i < 6; i++) ys.push(ys[i - 1] + 2 * randInt(2, 10));
      const w = randInt(1, 4);
      const top = Math.ceil(Math.max(...ys) / 20) * 20;
      return uniq((ys[w] + ys[w + 1]) / 2, ys[w], ys[w + 1], ys[w + 1] - ys[w], ys[w] + ys[w + 1]) ? { ys, w, top } : null;
    },
    make: ({ ys, w, top }) => ({
      question: `The line graph shows the height of a sunflower at the end of each week. Assume it grew steadily from the end of week ${w} to the end of week ${w + 1}. How tall was it halfway between those two times, in cm?`,
      model: { type: 'line-graph', data: { points: ys.map((y, i) => ({ x: i, y })), xTicks: [0, 1, 2, 3, 4, 5], yTicks: Array.from({ length: top / 20 + 1 }, (_, i) => i * 20), xLabel: 'Week', yLabel: 'Height (cm)' } },
      answer: (ys[w] + ys[w + 1]) / 2,
      wrong: [[ys[w], `That is the height at the end of week ${w}, the start of the gap.`], [ys[w + 1], `That is the height at the end of week ${w + 1}, the end of the gap.`], [ys[w + 1] - ys[w], 'That is how much it grew in the week. Halfway is a height, not a growth.']],
      hints: ['Read the two heights that the line joins.', 'Halfway along a straight line is halfway between the two heights.'],
      steps: [`Heights: ${ys[w]} cm and ${ys[w + 1]} cm.`, `Halfway: (${ys[w]} + ${ys[w + 1]}) ÷ 2 = ${(ys[w] + ys[w + 1]) / 2} cm.`],
    }),
    check: ({ ys, w }, a) => a - ys[w] === ys[w + 1] - a }),

  fam({ id: 'g7.data.which-graph-why', skill: 'G7_DATA_REPRESENT', outcome: 'G7.DATA.f', rung: 2, form: 'why',
    draw: () => {
      const pool = [
        { kind: 'bar', t: 'the number of learners in each of five school clubs' }, { kind: 'bar', t: 'the kilograms of sugar sold by four dukas in one week' }, { kind: 'bar', t: 'the goals scored by each of six teams in a league' },
        { kind: 'line', t: 'the temperature in Nakuru every two hours through one day' }, { kind: 'line', t: 'the height of a sunflower measured at the end of each week' }, { kind: 'line', t: 'the water level in a tank, read every hour' },
        { kind: 'pie', t: 'how a school shares its budget between food, books, repairs and salaries' }, { kind: 'pie', t: 'how a farmer shares an acre of land between maize, beans and vegetables' }, { kind: 'pie', t: 'how the learners of a class travel to school, as parts of the whole class' },
      ];
      return { item: pick(pool), k: randInt(0, 2) };
    },
    make: ({ item, k }) => {
      const O = {
        bar: { text: 'A bar graph, because it compares separate groups side by side', why: 'A bar graph compares separate groups. This data is of a different kind.' },
        line: { text: 'A line graph, because it shows how something changes over time', why: 'A line graph follows one measurement as time goes on. This data is of a different kind.' },
        pie: { text: 'A pie chart, because it shows how a whole is shared into parts', why: 'A pie chart shows parts of one whole. This data is of a different kind.' },
      };
      return {
        question: `Which graph is best for showing ${item.t}?`, story: false,
        options: rot(['bar', 'line', 'pie'].map(kd => ({ text: O[kd].text, right: kd === item.kind, why: kd === item.kind ? undefined : O[kd].why })), k),
        hints: ['Is the data about separate groups, change over time, or parts of one whole?', 'Match the kind of data to the kind of graph.'],
        steps: [`The data is ${item.kind === 'bar' ? 'about separate groups to compare' : item.kind === 'line' ? 'one measurement changing over time' : 'parts that make up one whole'}.`, O[item.kind].text + '.'],
      };
    } }),

  // ---- travel graphs
  fam({ id: 'g7.data.travel-stages-steps', skill: 'G7_PIE_CHARTS', outcome: 'G7.DATA.k', rung: 3, form: 'steps',
    draw: () => {
      const a = pick([1, 2]), b = pick([1, 2]), r = 1, v1 = pick([20, 30, 40, 60]), v2 = pick([20, 30, 40, 60]);
      const d1 = v1 * a, d2 = d1 + v2 * b, T = a + r + b;
      if (d2 % T !== 0 || !uniq(v1, v2, d2 / T)) return null;
      return { a, b, r, v1, v2, d1, d2, T, p: person() };
    },
    make: ({ a, b, r, v1, v2, d1, d2, T, p }) => {
      const step = [20, 40, 60, 100].find(s => d2 / s <= 7), top = Math.ceil(d2 / step) * step;
      return {
        question: `${p.name} travels by bus. The travel graph shows the distance from the start against the time of the journey.`,
        model: { type: 'line-graph', data: { points: [{ x: 0, y: 0 }, { x: a, y: d1 }, { x: a + r, y: d1 }, { x: T, y: d2 }], xTicks: [0, 1, 2, 3, 4, 5].filter(x => x <= T), yTicks: Array.from({ length: top / step + 1 }, (_, i) => i * step), xLabel: 'Time (hours)', yLabel: 'Distance (km)' } },
        parts: [
          { prompt: 'For how many hours did the bus stop?', answer: r, unit: 'hours', hint: 'Look for the flat part of the line.', wrong: [[a, 'That is how long the first part of the journey took. The stop is where the line is flat.']] },
          { prompt: 'What was the speed in the first part of the journey? (km/h)', answer: v1, unit: 'km/h', hint: 'Speed = distance ÷ time for that part only.', wrong: [[d1, 'That is the distance. Divide it by the time.'], [round(d2 / T, 1), 'That is the average for the whole journey. Use only the first part.']] },
          { prompt: 'What was the speed in the last part of the journey? (km/h)', answer: v2, unit: 'km/h', hint: 'Use only the distance and time of the last part.', wrong: [[d2 - d1, 'That is the distance of the last part. Divide it by its time.'], [round(d2 / b, 1), 'That uses the total distance. Only the last part counts.']] },
          { prompt: 'What was the average speed for the whole journey, with the stop included? (km/h)', answer: d2 / T, unit: 'km/h', hint: 'Total distance ÷ total time, counting the stop.', wrong: [[round((v1 + v2) / 2, 1), 'Averaging the two speeds ignores how long each part took and the stop.'], [round(d2 / (T - r), 1), 'The stop is part of the journey time. Include it.']] },
        ],
        steps: [`The line is flat for ${r} hour.`, `First part: ${d1} ÷ ${a} = ${v1} km/h.`, `Last part: ${d2 - d1} ÷ ${b} = ${v2} km/h.`, `Whole journey: ${d2} ÷ ${T} = ${d2 / T} km/h.`],
      };
    },
    check: ({ a, b, d1, d2 }, v) => v[1] * a === d1 && v[2] * b === d2 - d1 && v[3] * (a + v[0] + b) === d2 }),

  fam({ id: 'g7.data.travel-spot-average', skill: 'G7_PIE_CHARTS', outcome: 'G7.DATA.k', rung: 3, form: 'spot',
    draw: () => {
      const a = pick([1, 2]), b = pick([1, 2]), v1 = pick([20, 30, 40, 60]), v2 = pick([20, 30, 40, 60]), r = 1;
      const d1 = v1 * a, D = d1 + v2 * b, T = a + r + b, kind = pick(['rest', 'divide']);
      if (D % T !== 0 || D % (T - r) !== 0 || D / T === D / (T - r)) return null;
      const shownT = kind === 'rest' ? T - r : T;
      const shownV = kind === 'rest' ? D / (T - r) : D / T + pick([5, 10, -5]);
      return { a, b, d1, D, T, r, kind, shownT, shownV, p: person() };
    },
    make: ({ a, b, d1, D, T, r, kind, shownT, shownV, p }) => ({
      question: `${p.name} reads the travel graph of a bus journey and works out the average speed for the whole journey, with the stop included. Which step has the mistake?`,
      model: { type: 'line-graph', data: { points: [{ x: 0, y: 0 }, { x: a, y: d1 }, { x: a + r, y: d1 }, { x: T, y: D }], xTicks: [0, 1, 2, 3, 4, 5].filter(x => x <= T), yTicks: [0, 40, 80, 120, 160, 200, 240].filter((y, i, arr) => y <= Math.ceil(D / 40) * 40), xLabel: 'Time (hours)', yLabel: 'Distance (km)' } },
      working: [
        { text: `The bus travelled ${D} km in all.`, ok: true },
        { text: `The journey took ${shownT} hours from start to finish.`, ok: shownT === T },
        { text: `Average speed = total distance ÷ total time = ${D} ÷ ${shownT}.`, ok: true },
        { text: `Average speed = ${shownV} km/h.`, ok: shownV * shownT === D },
      ],
      fix: kind === 'rest' ? `The stop is part of the journey, so the time is ${T} hours, not ${shownT}. The average speed is ${D / T} km/h.` : `${D} ÷ ${T} = ${D / T}, not ${shownV}.`,
      hints: ['Check the distance and the time against the graph, then the division.', 'The total time includes the part where the line is flat.'],
      steps: [`Total time = ${T} hours, including the stop.`, `${D} ÷ ${T} = ${D / T} km/h.`],
    }) }),

  fam({ id: 'g7.data.travel-meet', skill: 'G7_PIE_CHARTS', outcome: 'G7.DATA.k', rung: 3, form: 'graph',
    draw: () => {
      const sA = pick([20, 30, 40, 50, 60]), sB = pick([20, 30, 40, 50, 60]), t = pick([2, 3, 4]);
      const D = (sA + sB) * t, X = t + 1;
      if (sA * t < sB || sA === sB) return null;
      const step = [20, 40, 50, 100, 200].find(s => D / s <= 8), top = Math.ceil(D / step) * step;
      return uniq(t, sA * t, D / sA, t + 1) ? { sA, sB, t, D, X, step, top } : null;
    },
    make: ({ sA, sB, t, D, X, step, top }) => ({
      question: 'Two matatus travel towards each other on the same road. One line rises and one line falls. The travel graph shows how far each matatu is from Nairobi. After how many hours do the two matatus meet?',
      model: { type: 'line-graph', data: { lines: [[{ x: 0, y: 0 }, { x: X, y: sA * X }], [{ x: 0, y: D }, { x: X, y: D - sB * X }]], xTicks: Array.from({ length: X + 1 }, (_, i) => i), yTicks: Array.from({ length: top / step + 1 }, (_, i) => i * step), xLabel: 'Time (hours)', yLabel: 'Distance from Nairobi (km)' } },
      answer: t,
      wrong: [[sA * t, 'That is how far from Nairobi they meet. The question asks how many hours.'], [t + 1, 'Look straight down from the point where the lines cross to the time axis.'], [D / sA, 'That is how long the first matatu would need for the whole road. They meet sooner, where the lines cross.']],
      hints: ['They meet where the two lines cross.', 'From that point, read straight down to the time axis.'],
      steps: ['The matatus are at the same place where the lines cross.', `Reading down from the crossing point gives ${t} hours.`],
    }),
    check: ({ sA, sB, D }, a) => sA * a === D - sB * a }),
];
