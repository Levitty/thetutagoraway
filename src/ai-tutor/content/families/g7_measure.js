// ============================================================================
// GRADE 7 MEASUREMENTS: new question forms, written in advance.
// Pythagoras, length, area, volume and capacity, time and speed, temperature,
// money. Every key is computed from the draw; every check works it another way.
// Tables of charges (bills, postage, mobile money) are illustrations, never
// real rates, and the question says so.
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family, round, commas } from './core.js';
import { person, sh, price, route } from './kenya.js';

const fam = (def) => family({ reviewed: false, ...def });
const uniq = (...a) => new Set(a.map(x => (typeof x === 'number' ? round(x, 6) : x))).size === a.length;
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = randInt(0, i); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [6, 8, 10]];
const triple = (maxC = 60) => { for (;;) { const [a, b, c] = pick(TRIPLES), k = pick([1, 2, 3, 4, 5]); if (c * k > maxC) continue; return pick([0, 1]) ? { a: a * k, b: b * k, c: c * k } : { a: b * k, b: a * k, c: c * k }; } };
const isRight = (x, y, z) => { const s = [x, y, z].sort((p, q) => p - q); return s[0] * s[0] + s[1] * s[1] === s[2] * s[2]; };
const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const F = { cm: 0.01, dm: 0.1, m: 1, Dm: 10, Hm: 100, km: 1000 };

export const FAMILIES = [
  // =========================================================== PYTHAGORAS
  fam({ id: 'g7.pyth.name-hypotenuse', skill: 'G7_PYTHAGORAS', outcome: 'G7.PYTH.a', rung: 1, form: 'direct',
    draw: () => { const l = shuffle(LETTERS.split('')).slice(0, 3); return { p: l[0], q: l[1], r: l[2] }; },
    make: ({ p, q, r }) => ({
      question: `In triangle ${p}${q}${r}, the angle at ${q} is 90°. Which side is the hypotenuse?`, story: false,
      options: [{ text: `${p}${r}`, right: true }, { text: `${p}${q}`, right: false, why: `${p}${q} meets the right angle at ${q}. The hypotenuse is opposite the right angle.` }, { text: `${q}${r}`, right: false, why: `${q}${r} meets the right angle at ${q}. The hypotenuse is opposite the right angle.` }],
      hints: ['The hypotenuse is the side opposite the right angle.', `Which side does not touch corner ${q}?`],
      steps: [`The right angle is at ${q}, so the two sides that meet there are ${p}${q} and ${q}${r}.`, `The side left over, opposite ${q}, is the hypotenuse: ${p}${r}.`],
    }) }),
  fam({ id: 'g7.pyth.which-triangle', skill: 'G7_PYTHAGORAS', outcome: 'G7.PYTH.b', rung: 2, form: 'table',
    draw: () => {
      const t = triple(), good = shuffle([t.a, t.b, t.c]);
      const rows = [good];
      while (rows.length < 4) {
        const u = triple(); const bad = shuffle([u.a, u.b, u.c + pick([-2, -1, 1, 2, 3])]);
        if (!isRight(...bad) && bad.every(x => x > 0) && !rows.some(r => r.join() === bad.join())) rows.push(bad);
      }
      const order = shuffle(rows);
      return { rows: order, ans: order.indexOf(rows[0]) };
    },
    make: ({ rows, ans }) => ({
      question: 'The table gives the three sides of four triangles. Which triangle is right-angled?',
      model: { type: 'table', data: { head: ['Triangle', 'Side 1 (cm)', 'Side 2 (cm)', 'Side 3 (cm)'], rows: rows.map((r, i) => ({ cells: [`Triangle ${'ABCD'[i]}`, ...r.map(String)] })) } },
      options: rows.map((r, i) => ({ text: `Triangle ${'ABCD'[i]}`, right: isRight(...r), why: isRight(...r) ? undefined : `Square the two shorter sides and add. The answer is not the square of the longest side.` })),
      hints: ['In a right-angled triangle, the squares of the two shorter sides add up to the square of the longest side.', 'Test each triangle. Always put the longest side on its own.'],
      steps: rows.map((r, i) => { const s = [...r].sort((a, b) => a - b); return `Triangle ${'ABCD'[i]}: ${s[0]}² + ${s[1]}² = ${s[0] * s[0] + s[1] * s[1]} and ${s[2]}² = ${s[2] * s[2]}${isRight(...r) ? ', equal, so it is right-angled' : ', not equal'}.`; }),
    }) }),
  fam({ id: 'g7.pyth.spot-missing-side', skill: 'G7_PYTHAGORAS', outcome: 'G7.PYTH.b', rung: 3, form: 'spot',
    draw: () => ({ ...triple(30), mode: pick(['half', 'minus']), p: person() }),
    make: ({ a, b, c, mode, p }) => {
      const sq = c * c - a * a, half = round(sq / 2, 1);
      const working = mode === 'half' ? [
        { text: `The hypotenuse is ${c} cm, so b² = ${c}² − ${a}²`, ok: c * c - a * a === b * b },
        { text: `b² = ${c * c} − ${a * a} = ${sq}`, ok: c * c - a * a === sq },
        { text: `b = ${commas(sq)} ÷ 2 = ${commas(half)}`, ok: half === b },
        { text: `The other side is ${commas(half)} cm.`, ok: half === half },
      ] : [
        { text: `The hypotenuse is ${c} cm, so the other side b comes from ${c}² and ${a}²`, ok: c > a },
        { text: `b = ${c} − ${a} = ${c - a}`, ok: c - a === b },
        { text: `The other side is ${c - a} cm.`, ok: c - a === c - a },
      ];
      return { question: `The longest side of a right-angled triangle is ${c} cm and another side is ${a} cm. ${p.name} is finding the third side. Where does ${p.her} working go wrong?`, working,
        fix: mode === 'half' ? `A square root is not halving. b² = ${sq}, so b is the number that multiplies by itself to give ${sq}.` : `The sides must be squared first: b² = ${c}² − ${a}², then take the square root. Taking the sides away without squaring is wrong.`,
        steps: [`b² = ${c}² − ${a}² = ${sq}.`, `b = √${sq} = ${b} cm.`] };
    } }),
  fam({ id: 'g7.pyth.gate-brace', skill: 'G7_PYTHAGORAS', outcome: 'G7.PYTH.c', rung: 2, form: 'word',
    draw: () => { const [a, b, c, m] = pick([[3, 4, 5, 40], [3, 4, 5, 50], [3, 4, 5, 60], [5, 12, 13, 20], [5, 12, 13, 25], [8, 15, 17, 10]]); return { a: a * m, b: b * m, c: c * m, who: person(), flip: pick([0, 1]) }; },
    make: ({ a, b, c, who, flip }) => {
      const w = flip ? a : b, h = flip ? b : a;
      return { question: `${who.name} makes a metal gate ${w} cm wide and ${h} cm high. ${who.She} welds a brace diagonally across the gate, from one corner to the opposite corner. How long is the brace, in cm?`,
        answer: c,
        wrong: [[w + h, 'The brace goes straight across. It is shorter than going along two sides.'], [w * w + h * h, 'That is the square of the brace. Take the square root.'], [Math.abs(w - h), 'The brace is the hypotenuse. Square the sides and add. Do not take the sides away.']],
        hints: ['The width, the height and the brace make a right-angled triangle.', 'The brace is the longest side, the hypotenuse.'],
        steps: [`The brace is the hypotenuse: c² = ${w}² + ${h}² = ${commas(w * w + h * h)}.`, `c = √${commas(w * w + h * h)} = ${c} cm.`] };
    },
    check: ({ a, b }, v) => v * v === a * a + b * b }),
  fam({ id: 'g7.pyth.shortcut-path', skill: 'G7_PYTHAGORAS', outcome: 'G7.PYTH.c', rung: 3, form: 'word',
    draw: () => { const t = triple(45); return { ...t, p: person() }; },
    make: ({ a, b, c, p }) => ({
      question: `${p.name} walks ${a * 10} m east along the road and then ${b * 10} m north along a lane. A footpath goes straight from the start to the end. How many metres shorter is the footpath?`,
      answer: (a + b - c) * 10,
      wrong: [[c * 10, 'That is the length of the footpath. The question asks how much shorter it is than the road and lane.'], [(a + b) * 10, 'That is the length of the road and lane together.'], [(a + b + c) * 10, 'Subtract the footpath from the two sides. Do not add it.']],
      hints: ['East and north meet at a right angle. The footpath is the hypotenuse.', 'Find the footpath first. Then compare it with the road and lane together.'],
      steps: [`Footpath: √(${a * 10}² + ${b * 10}²) = ${c * 10} m.`, `Road and lane: ${a * 10} + ${b * 10} = ${(a + b) * 10} m.`, `Shorter by ${(a + b) * 10} − ${c * 10} = ${(a + b - c) * 10} m.`],
    }),
    check: ({ a, b, c }, v) => v + c * 10 === (a + b) * 10 }),
  fam({ id: 'g7.pyth.pole-wire', skill: 'G7_PYTHAGORAS', outcome: 'G7.PYTH.c', rung: 3, form: 'steps',
    draw: () => ({ ...triple(26), per: pick([30, 40, 50, 60]) }),
    make: ({ a, b, c, per }) => ({
      question: `A pole is ${b} m tall. A wire runs from its top to a peg in the ground ${a} m from the foot of the pole. The wire costs sh ${per} a metre.`,
      parts: [
        { prompt: `Work out ${a}² + ${b}².`, answer: a * a + b * b, hint: 'Square each number, then add.', wrong: [[a + b, 'Square each number first.'], [b * b - a * a, 'Add the squares. Taking away is for finding a shorter side.']] },
        { prompt: 'How long is the wire, in metres?', answer: c, unit: 'm', hint: 'The wire is the hypotenuse. Take the square root of the last answer.', wrong: [[a + b, 'The wire is a straight line from the top to the peg, so it is shorter than the pole and ground together.']] },
        { prompt: 'How much does the wire cost, in shillings?', answer: c * per, unit: 'sh', hint: 'Length of wire times the price of one metre.', wrong: [[(a + b) * per, 'Use the length of the wire, not the pole and ground added.']] },
      ],
      steps: [`${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}.`, `Wire = √${a * a + b * b} = ${c} m.`, `Cost = ${c} × ${per} = ${sh(c * per)}.`],
    }),
    check: ({ a, b, c, per }, v) => v[0] === a * a + b * b && v[1] * v[1] === v[0] && v[2] / per === v[1] }),
  fam({ id: 'g7.pyth.why-345', skill: 'G7_PYTHAGORAS', outcome: 'G7.PYTH.c', rung: 2, form: 'why',
    draw: () => { const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [6, 8, 10]]); return { a, b, c, p: person() }; },
    make: ({ a, b, c, p }) => ({
      question: `A builder marks ${a} m along one wall from a corner and ${b} m along the other wall. ${p.name} measures ${c} m between the two marks. Why does this show that the corner is a right angle?`,
      options: [
        { text: `${a}² + ${b}² = ${c}², so the sides fit the Pythagorean relationship`, right: true },
        { text: `${a} + ${b} is bigger than ${c}, so the three lengths make a triangle`, right: false, why: 'Any three lengths that make a triangle have that property. It does not make the angle 90°.' },
        { text: `${c} is the longest of the three lengths`, right: false, why: 'The longest side is longest in every triangle. That does not show a right angle.' },
        { text: `${a} + ${b} + ${c} gives a whole number of metres`, right: false, why: 'The sum of the sides tells nothing about an angle.' },
      ],
      hints: ['Square the two shorter lengths and add them.', 'Compare with the square of the longest length.'],
      steps: [`${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}.`, `${c}² = ${c * c}. They are equal, so the corner is a right angle.`],
    }) }),
  // =========================================================== LENGTH
  fam({ id: 'g7.length.convert-story', skill: 'G7_LENGTH_CONV', outcome: 'G7.LENGTH.a', rung: 1, form: 'word',
    draw: () => {
      const sc = pick([
        { f: 'dm', t: 'cm', say: (v) => `A tailor cuts ${v} dm of ribbon.`, to: 'centimetres' },
        { f: 'm', t: 'dm', say: (v) => `A plank is ${v} m long.`, to: 'decimetres' },
        { f: 'Dm', t: 'm', say: (v) => `A football pitch is ${v} Dm wide.`, to: 'metres' },
        { f: 'Hm', t: 'm', say: (v) => `A road to the market is ${v} Hm long.`, to: 'metres' },
        { f: 'Hm', t: 'Dm', say: (v) => `A fence runs ${v} Hm along a farm.`, to: 'dekametres (Dm)' },
        { f: 'km', t: 'Hm', say: (v) => `A footpath is ${v} km long.`, to: 'hectometres (Hm)' },
        { f: 'dm', t: 'm', say: (v) => `A water pipe is ${v * 10} dm long.`, to: 'metres', raw: true },
      ]);
      return { ...sc, v: pick([2, 3, 4, 5, 6, 7, 8, 9, 2.5, 3.5, 4.5]) };
    },
    make: ({ f, t, say, to, v, raw }) => {
      const r = F[f] / F[t], val = raw ? v * 10 : v, ans = round(val * r, 4);
      const w = [round(val / r, 4), round(ans * 10, 4), round(ans / 10, 4)];
      if (!uniq(ans, ...w)) return { question: 'x', answer: ans, wrong: [], hints: [], steps: [] };
      return { question: `${say(v)} Change this length to ${to}.`, answer: ans,
        wrong: [[w[0], `A ${F[f] > F[t] ? t : f} is the smaller unit, so there are more of them. Check whether to multiply or divide.`], [w[1], 'Check how many of the smaller unit fit in the larger one. The size of the step is wrong.'], [w[2], 'Check how many of the smaller unit fit in the larger one. The size of the step is wrong.']],
        hints: [`Which is bigger, a ${f} or a ${t}?`, `Find how many ${F[f] > F[t] ? t : f} make one ${F[f] > F[t] ? f : t}. Then multiply or divide.`],
        steps: [`1 ${f} = ${commas(round(r, 4))} ${t}.`, `${commas(val)} ${f} = ${commas(val)} × ${commas(round(r, 4))} = ${commas(ans)} ${t}.`] };
    },
    check: ({ f, t, v, raw }, a) => Math.abs(a * F[t] - (raw ? v * 10 : v) * F[f]) < 1e-9 }),
  fam({ id: 'g7.length.table-compare', skill: 'G7_LENGTH_CONV', outcome: 'G7.LENGTH.a', rung: 3, form: 'table',
    draw: () => {
      const ua = pick(['Dm', 'Hm']), ub = pick(['dm', 'cm']);
      const va = randInt(3, 9), vb = ub === 'dm' ? randInt(2, 90) * 10 : randInt(2, 90) * 100;
      const ma = va * F[ua], mb = round(vb * F[ub], 3);
      const wa = [Math.abs(va - vb), Math.abs(ma * 10 - mb), Math.abs(ma - mb * 10)];
      return ma !== mb && uniq(Math.abs(ma - mb), ...wa) ? { ua, ub, va, vb, ma, mb, wa } : null;
    },
    make: ({ ua, ub, va, vb, ma, mb, wa }) => ({
      question: `Use the table. A rope is ${va} ${ua} long. A cable is ${commas(vb)} ${ub} long. How many metres longer is the longer one?`,
      model: { type: 'table', data: { head: ['Unit', 'Length in metres'], rows: [['cm', '0.01'], ['dm', '0.1'], ['m', '1'], ['Dm', '10'], ['Hm', '100'], ['km', '1,000']].map(([label, value]) => ({ label, value })) } },
      answer: round(Math.abs(ma - mb), 3),
      wrong: [[wa[0], 'The two lengths are in different units. Change both to metres before you subtract.'], [round(wa[1], 3), `Read the table again for ${ua}. How many metres is one ${ua}?`], [round(wa[2], 3), `Read the table again for ${ub}. How many metres is one ${ub}?`]],
      hints: ['Change both lengths to metres first.', 'Use the table for the number of metres in one of each unit.'],
      steps: [`${va} ${ua} = ${va} × ${F[ua]} = ${commas(ma)} m.`, `${commas(vb)} ${ub} = ${commas(vb)} × ${F[ub]} = ${commas(mb)} m.`, `Difference = ${commas(Math.max(ma, mb))} − ${commas(Math.min(ma, mb))} = ${commas(round(Math.abs(ma - mb), 3))} m.`],
    }),
    check: ({ ma, mb }, a) => Math.abs(Math.min(ma, mb) + a - Math.max(ma, mb)) < 1e-9 }),
  fam({ id: 'g7.length.why-divide', skill: 'G7_LENGTH_CONV', outcome: 'G7.LENGTH.a', rung: 2, form: 'why',
    draw: () => { const [f, t, r] = pick([['Dm', 'dm', 100], ['Hm', 'm', 100], ['Hm', 'dm', 1000], ['Dm', 'cm', 1000]]); return { f, t, r, v: randInt(3, 9), p: person() }; },
    make: ({ f, t, r, v, p }) => ({
      question: `${p.name} changes ${v} ${f} to ${t}. ${p.She} divides ${v} by ${r} and gets ${round(v / r, 4)} ${t}. Why is this wrong?`,
      options: [
        { text: `A ${t} is smaller than a ${f}, so multiply by ${commas(r)}`, right: true },
        { text: 'The number should stay the same, because only the unit name changes', right: false, why: 'The unit changes the size of one step, so the number must change too.' },
        { text: `${p.She} should divide, but by 10 every time`, right: false, why: 'The number of small units in a big unit depends on the two units. It is not always 10.' },
        { text: `Dividing is right, because a ${t} is bigger than a ${f}`, right: false, why: `Compare the units again. A ${f} is the longer one.` },
      ],
      hints: [`Which is longer, one ${f} or one ${t}?`, 'When you measure with a smaller unit, do you need more of them or fewer?'],
      steps: [`A ${f} is longer than a ${t}, so one ${f} holds many ${t}.`, `${v} ${f} = ${v} × ${commas(r)} = ${commas(v * r)} ${t}.`],
    }) }),
  fam({ id: 'g7.length.spot-hm-cm', skill: 'G7_LENGTH_CONV', outcome: 'G7.LENGTH.a', rung: 2, form: 'spot',
    draw: () => ({ n: pick([1.5, 2.5, 3.5, 4.5, 6, 7.5, 8]), p: person() }),
    make: ({ n, p }) => {
      const m = round(n * 100, 3), bad = round(m * 10, 3), good = round(m * 100, 3);
      return { question: `${p.name} changes ${n} Hm to centimetres, in two stages. Which step has the mistake?`,
        working: [
          { text: `1 Hm = 100 m, so ${n} Hm = ${commas(m)} m`, ok: n * 100 === m },
          { text: `1 m = 100 cm, so ${commas(m)} m = ${commas(bad)} cm`, ok: bad === good },
          { text: `${n} Hm = ${commas(bad)} cm`, ok: bad === bad },
        ],
        fix: 'There are 100 cm in 1 m, so multiply by 100, not by 10.',
        steps: [`${n} Hm = ${commas(m)} m.`, `${commas(m)} m = ${commas(m)} × 100 = ${commas(good)} cm.`] };
    } }),
  fam({ id: 'g7.length.rope-left', skill: 'G7_LENGTH_CONV', outcome: 'G7.LENGTH.b', rung: 2, form: 'word',
    draw: () => { const n = randInt(3, 8), pc = pick([25, 40, 50, 60, 75, 80]), R = randInt(8, 20); const left = R - (n * pc) / 100; return Number.isInteger(left * 2) && left > 0 && uniq(left, R * 100 - n * pc, R - pc / 100, R + (n * pc) / 100, (n * pc) / 100) ? { n, pc, R, p: person() } : null; },
    make: ({ n, pc, R, p }) => ({
      question: `${p.name} has a rope ${R} m long. ${p.She} cuts ${n} pieces, each ${pc} cm long, for a washing line. How many metres of rope are left?`,
      answer: R - (n * pc) / 100,
      wrong: [[R * 100 - n * pc, 'That is in centimetres. The question asks for metres.'], [R - pc / 100, 'There are several pieces. Find the length of all the pieces together.'], [R + (n * pc) / 100, 'Cutting takes rope away, so subtract.'], [(n * pc) / 100, 'That is the rope that is cut. The question asks what is left.']],
      hints: ['Use one unit for everything.', `Total length of the ${n} pieces, then change it to metres.`],
      steps: [`${n} pieces × ${pc} cm = ${n * pc} cm = ${(n * pc) / 100} m.`, `Left: ${R} − ${(n * pc) / 100} = ${R - (n * pc) / 100} m.`],
    }),
    check: ({ n, pc, R }, a) => Math.round((R - a) * 100) === n * pc }),
  fam({ id: 'g7.length.fence-posts-line', skill: 'G7_LENGTH_CONV', outcome: 'G7.LENGTH.b', rung: 2, form: 'word',
    draw: () => { const gap = pick([2, 3, 4, 5, 6]), n = randInt(6, 20); return { gap, n, L: gap * n, p: person() }; },
    make: ({ gap, n, L, p }) => ({
      question: `${p.name} puts up a straight fence ${L} m long. There is a post every ${gap} m, and one at each end. How many posts does ${p.she} need?`,
      answer: n + 1,
      wrong: [[n, 'That counts the gaps between posts. There is a post at both ends too.'], [n - 1, 'There are more posts than gaps on a straight fence.'], [L * gap, 'Divide the length by the gap. Do not multiply.']],
      hints: ['Draw a short fence with 3 gaps. Count the posts.', 'Find the number of gaps first.'],
      steps: [`Number of gaps = ${L} ÷ ${gap} = ${n}.`, `A post at each end means one more post than gaps: ${n} + 1 = ${n + 1}.`],
    }),
    check: ({ gap, L }, a) => (a - 1) * gap === L }),

  // =========================================================== PERIMETER
  fam({ id: 'g7.perim.l-shape', skill: 'G7_PERIMETER', outcome: 'G7.LENGTH.c', rung: 3, form: 'word',
    draw: () => { const w = randInt(10, 20), h = randInt(8, 16), a = randInt(3, 6), b = randInt(3, 6); return a < w - 2 && b < h - 2 && uniq(2 * (w + h), 2 * (w + h) - 2 * (a + b), 2 * (w + h) + 2 * (a + b), w * h - a * b) ? { w, h, a, b, p: person() } : null; },
    make: ({ w, h, a, b, p }) => ({
      question: `${p.name} cuts a corner ${a} m by ${b} m from a rectangular plot ${w} m by ${h} m. This leaves an L-shaped plot. How long is the fence needed all around the L-shaped plot, in metres?`,
      answer: 2 * (w + h),
      wrong: [[2 * (w + h) - 2 * (a + b), 'Taking a corner away does not take the sides away. Look at what the new edges add.'], [2 * (w + h) + 2 * (a + b), 'The two new edges only replace the two sides that were cut. Count the length again.'], [w * h - a * b, 'That is the area. A fence goes around the edge.']],
      hints: ['Picture the L. The two new edges run along the cut.', 'Compare the new edges with the old sides they replace.'],
      steps: [`The two new edges are ${a} m and ${b} m. They replace the cut parts of the sides, which were also ${a} m and ${b} m.`, `So the perimeter stays the same as the rectangle: 2 × (${w} + ${h}) = ${2 * (w + h)} m.`],
    }),
    check: ({ w, h }, a) => a === w + h + w + h }),
  fam({ id: 'g7.perim.longest-fence', skill: 'G7_PERIMETER', outcome: 'G7.LENGTH.c', rung: 3, form: 'table',
    draw: () => {
      const rows = []; for (let i = 0; i < 3; i++) rows.push([randInt(5, 40), randInt(5, 40)]);
      const per = rows.map(([l, w]) => 2 * (l + w)), ar = rows.map(([l, w]) => l * w);
      const pm = per.indexOf(Math.max(...per)), am = ar.indexOf(Math.max(...ar));
      return uniq(...per) && uniq(...ar) && pm !== am ? { rows, pm } : null;
    },
    make: ({ rows, pm }) => ({
      question: 'A farmer wants to fence one of three rectangular plots all around. The table shows the plots. Which plot needs the longest fence?',
      model: { type: 'table', data: { head: ['Plot', 'Length (m)', 'Width (m)'], rows: rows.map(([l, w], i) => ({ cells: [`Plot ${'ABC'[i]}`, String(l), String(w)] })) } },
      options: rows.map(([l, w], i) => ({ text: `Plot ${'ABC'[i]}`, right: i === pm, why: i === pm ? undefined : `Find the distance around each plot: 2 × (length + width). A plot with a large area does not always have the longest edge.` })),
      hints: ['A fence goes around the edge, so use the perimeter.', 'Work out 2 × (length + width) for each plot.'],
      steps: rows.map(([l, w], i) => `Plot ${'ABC'[i]}: 2 × (${l} + ${w}) = ${2 * (l + w)} m.`),
    }) }),
  fam({ id: 'g7.perim.fence-posts-round', skill: 'G7_PERIMETER', outcome: 'G7.LENGTH.c', rung: 3, form: 'word',
    draw: () => { const gap = pick([2, 4, 5]), n = randInt(10, 30), l = randInt(8, 20) * gap; const w = (n * gap) / 2 - l; return Number.isInteger(w) && w >= 4 && w !== l ? { gap, n, l, w, p: person() } : null; },
    make: ({ gap, n, l, w, p }) => ({
      question: `${p.name} fences a rectangular plot ${l} m long and ${w} m wide with a post every ${gap} m, all the way around. How many posts are needed?`,
      answer: n,
      wrong: [[n + 1, 'Around a closed plot the first post is also the last one. Do not add one for the end.'], [(l * w) / gap, 'That uses the area. Posts go around the edge.'], [l + w + (l + w) / gap, 'Find the distance around, then divide by the gap.']],
      hints: ['Find the distance all the way around.', 'Divide the distance by the gap between posts.'],
      steps: [`Distance around = 2 × (${l} + ${w}) = ${2 * (l + w)} m.`, `Posts = ${2 * (l + w)} ÷ ${gap} = ${n}. The last post meets the first, so there is no extra post.`],
    }),
    check: ({ gap, l, w }, a) => a * gap === 2 * (l + w) }),

  // =========================================================== CIRCUMFERENCE
  fam({ id: 'g7.circ.wheel-distance', skill: 'G7_CIRCUMFERENCE', outcome: 'G7.LENGTH.d', rung: 2, form: 'word',
    draw: () => { const d = pick([14, 21, 28, 35, 42, 56, 70, 84]), n = pick([50, 100, 150, 200, 250, 500]); const c = (22 * d) / 7; const m = (c * n) / 100; return Number.isInteger(m) && uniq(m, (11 * d * d * n) / (7 * 100) , (d * n) / 100, c * n) ? { d, n, c, m, p: person() } : null; },
    make: ({ d, n, c, m, p }) => ({
      question: `The wheel of ${p.name}'s bicycle has a diameter of ${d} cm. Take π = 22/7. The wheel turns ${n} times. How far does the bicycle go, in metres?`,
      answer: m,
      wrong: [[(d * n) / 100, 'One turn of the wheel covers the distance round the wheel, which is more than the diameter.'], [c * n, 'That is in centimetres. The question asks for metres.'], [round((c * n) / 1000, 3), 'There are 100 cm in 1 m, not 1,000.']],
      hints: ['One full turn covers one circumference.', 'Multiply by the number of turns, then change cm to m.'],
      steps: [`Circumference = 22/7 × ${d} = ${c} cm.`, `${n} turns: ${c} × ${n} = ${commas(c * n)} cm.`, `${commas(c * n)} ÷ 100 = ${m} m.`],
    }),
    check: ({ n, c }, a) => a * 100 === c * n }),
  fam({ id: 'g7.circ.find-diameter', skill: 'G7_CIRCUMFERENCE', outcome: 'G7.LENGTH.d', rung: 3, form: 'word',
    draw: () => { const d = pick([7, 14, 21, 28, 35, 42, 49, 56]); return { d, thing: pick(['water drum', 'round table', 'clay pot', 'circular fish pond']), p: person() }; },
    make: ({ d, thing, p }) => ({
      question: `${p.name} measures the distance round a ${thing} with a tape and gets ${(22 * d) / 7} cm. Take π = 22/7. What is the diameter of the ${thing}, in cm?`,
      answer: d,
      wrong: [[d / 2, 'That is the radius. The question asks for the diameter.'], [d / 7, 'Divide by π = 22/7, which is the same as multiplying by 7/22. Dividing by 22 alone leaves out the 7.'], [(22 * d) / 7 / 2, 'The distance round is the circumference. Halving it does not give the diameter.']],
      hints: ['Circumference = π × diameter.', 'To find the diameter, divide the circumference by π.'],
      steps: [`${(22 * d) / 7} = 22/7 × d.`, `d = ${(22 * d) / 7} ÷ 22/7 = ${(22 * d) / 7} × 7/22 = ${d} cm.`],
    }),
    check: ({ d }, a) => (22 * a) / 7 === (22 * d) / 7 && a === d }),
  fam({ id: 'g7.circ.why-double', skill: 'G7_CIRCUMFERENCE', outcome: 'G7.LENGTH.d', rung: 3, form: 'why',
    draw: () => { const d = pick([7, 14, 21, 28]); return { d, p: person() }; },
    make: ({ d, p }) => ({
      question: `A round pond has a diameter of ${d} m. A second pond has a diameter of ${2 * d} m. ${p.name} says the distance round the second pond is 4 times the distance round the first. Why is ${p.she} wrong?`,
      options: [
        { text: 'Circumference = π × diameter, so doubling the diameter only doubles the circumference', right: true },
        { text: 'The circumference of a circle never changes with its size', right: false, why: 'A bigger circle has a longer circumference.' },
        { text: 'Doubling the diameter makes the circumference 3 times as long because π is about 3', right: false, why: 'π is the same for both ponds. It does not multiply the change.' },
        { text: 'The circumference is 4 times as long only for ponds, not for other circles', right: false, why: 'The rule for circumference is the same for every circle.' },
      ],
      hints: ['Write the circumference of each pond with the rule C = π × d.', 'Compare the two answers.'],
      steps: [`First pond: π × ${d}. Second pond: π × ${2 * d}.`, 'The second is 2 times the first: it is the area, not the distance round, that becomes 4 times as big.'],
    }) }),
  fam({ id: 'g7.circ.table-pattern', skill: 'G7_CIRCUMFERENCE', outcome: 'G7.LENGTH.d', rung: 2, form: 'table',
    draw: () => { const all = shuffle([7, 14, 21, 28, 35, 42, 49, 56, 63, 70]); return { ds: all.slice(0, 4).sort((x, y) => x - y), target: all[4], thing: pick(['water tank', 'round table', 'drum', 'circular pond']) }; },
    make: ({ ds, target, thing }) => ({
      question: `A class measured the width across some round objects and the distance round each. The table shows the results. The distance round divided by the width is the same every time. A ${thing} is ${target} cm wide. How far is it round, in cm?`,
      model: { type: 'table', data: { head: ['Object', 'Width across (cm)', 'Distance round (cm)'], rows: ds.map((d, i) => ({ cells: [['Tin', 'Bucket lid', 'Plate', 'Basin'][i], String(d), String((22 * d) / 7)] })) } },
      answer: (22 * target) / 7,
      wrong: [[target * 3, 'The distance round is a little more than 3 times the width. Check the exact number in the table.'], [target + 22, 'Look at how the distance round grows. It is a multiple of the width, not an add-on.'], [target * 2, 'Doubling the width is not enough. Divide one distance round by its width in the table to find the multiplier.']],
      hints: ['Divide a distance round by its width in the table.', 'Multiply the width of the new object by that number.'],
      steps: [`In the table, ${(22 * ds[0]) / 7} ÷ ${ds[0]} and ${(22 * ds[1]) / 7} ÷ ${ds[1]} both give 22/7.`, `${target} × 22/7 = ${(22 * target) / 7} cm.`],
    }),
    check: ({ target }, a) => a * 7 === target * 22 }),
  fam({ id: 'g7.circ.running-track', skill: 'G7_CIRCUMFERENCE', outcome: 'G7.LENGTH.d', rung: 3, form: 'steps',
    draw: () => { const d = pick([14, 28, 42, 56, 70]), s = pick([80, 90, 100, 110, 120]); return { d, s }; },
    make: ({ d, s }) => ({
      question: `A running track has two straight sides, each ${s} m long. At each end is a half circle with a diameter of ${d} m. Take π = 22/7.`,
      parts: [
        { prompt: 'The two half circles make one full circle. What is its circumference, in metres?', answer: (22 * d) / 7, unit: 'm', hint: 'Circumference = π × diameter.', wrong: [[(11 * d) / 7, 'Two half circles make a whole circle, not a half.']] },
        { prompt: 'What is the total length of the two straight sides, in metres?', answer: 2 * s, unit: 'm', hint: 'There are two sides.', wrong: [[s, 'The track has two straight sides.']] },
        { prompt: 'How far is one lap of the track, in metres?', answer: 2 * s + (22 * d) / 7, unit: 'm', hint: 'Add the curved part and the straight part.', wrong: [[2 * s * d, 'Add the two parts. Do not multiply.']] },
      ],
      steps: [`Two half circles: 22/7 × ${d} = ${(22 * d) / 7} m.`, `Straight sides: 2 × ${s} = ${2 * s} m.`, `One lap: ${(22 * d) / 7} + ${2 * s} = ${2 * s + (22 * d) / 7} m.`],
    }),
    check: ({ d, s }, a) => a[0] * 7 === 22 * d && a[1] === 2 * s && a[2] === a[0] + a[1] }),

  // =========================================================== AREA
  fam({ id: 'g7.area.acres-to-m2', skill: 'G7_AREA_RECT', outcome: 'G7.AREA.a', rung: 1, form: 'word',
    draw: () => ({ n: pick([2, 3, 4, 5, 6, 8, 10, 2.5, 3.5, 7.5]), p: person() }),
    make: ({ n, p }) => ({
      question: `In this question, take 1 acre to be 4,000 m². ${p.name} buys a plot of ${n} acres. What is the area of the plot in square metres (m²)?`,
      answer: n * 4000,
      wrong: [[n * 10000, 'That uses 10,000 m², which is the size of a hectare. This question says what one acre is.'], [round(n / 4000, 6) === 0 ? n * 400 : n * 400, 'Check the number of square metres in one acre, then multiply.'], [n + 4000, 'Each acre is 4,000 m², so multiply. Do not add.']],
      hints: ['How many m² are in 1 acre, according to the question?', 'Multiply by the number of acres.'],
      steps: [`1 acre = 4,000 m².`, `${n} acres = ${n} × 4,000 = ${commas(n * 4000)} m².`],
    }),
    check: ({ n }, a) => a / 4000 === n }),
  fam({ id: 'g7.area.hectares-field', skill: 'G7_AREA_RECT', outcome: 'G7.AREA.a', rung: 2, form: 'word',
    draw: () => { const h = randInt(2, 12), l = pick([100, 200, 250, 400, 500, 1000]); const w = (h * 10000) / l; return Number.isInteger(w) && w >= 40 && w !== l ? { h, l, w, p: person() } : null; },
    make: ({ h, l, w, p }) => ({
      question: `${p.name} has a rectangular field ${l} m long and ${w} m wide. 1 hectare (ha) is 10,000 m². How many hectares is the field?`,
      answer: h,
      wrong: [[l * w, 'That is the area in m². The question asks for hectares.'], [(l * w) / 100, 'One hectare is 10,000 m², not 100 m².'], [(l * w) / 1000, 'One hectare is 10,000 m², not 1,000 m².']],
      hints: ['Find the area in m² first.', 'Then divide by the number of m² in one hectare.'],
      steps: [`Area = ${l} × ${w} = ${commas(l * w)} m².`, `${commas(l * w)} ÷ 10,000 = ${h} ha.`],
    }),
    check: ({ l, w }, a) => a * 10000 === l * w }),
  fam({ id: 'g7.area.spot-m2-cm2', skill: 'G7_AREA_RECT', outcome: 'G7.AREA.a', rung: 2, form: 'spot',
    draw: () => ({ n: pick([2, 3, 4, 2.5, 3.5, 4.5, 6]), p: person() }),
    make: ({ n, p }) => {
      const sq = 100 * 100, bad = 100;
      return { question: `${p.name} changes ${n} m² to cm². Which step has the mistake?`,
        working: [
          { text: '1 m = 100 cm', ok: true },
          { text: `1 m² = 100 cm²`, ok: bad === sq },
          { text: `${n} m² = ${n} × 100 = ${commas(n * 100)} cm²`, ok: n * 100 === n * bad },
          { text: `So ${n} m² is ${commas(n * 100)} cm².`, ok: n * 100 === n * 100 },
        ],
        fix: 'A square metre is a square 100 cm by 100 cm, so it holds 100 × 100 = 10,000 cm².',
        steps: ['1 m² = 100 cm × 100 cm = 10,000 cm².', `${n} m² = ${n} × 10,000 = ${commas(n * 10000)} cm².`] };
    } }),
  fam({ id: 'g7.area.table-total-ha', skill: 'G7_AREA_RECT', outcome: 'G7.AREA.a', rung: 3, form: 'table',
    draw: () => { const v = [randInt(2, 12) * 5000, randInt(2, 12) * 5000, randInt(2, 12) * 5000]; const t = v.reduce((a, b) => a + b, 0); return { v, t, p: person() }; },
    make: ({ v, t, p }) => ({
      question: `${p.name} owns the three plots in the table. 1 hectare is 10,000 m². What is the total area of the plots, in hectares?`,
      model: { type: 'table', data: { head: ['Plot', 'Area (m²)'], rows: v.map((x, i) => ({ label: `Plot ${'ABC'[i]}`, value: commas(x) })) } },
      answer: t / 10000,
      wrong: [[t, 'That is the total in m². Change it to hectares.'], [t / 1000, 'One hectare is 10,000 m², not 1,000 m².'], [t / 100000, 'One hectare is 10,000 m². This divides by a number that is too big.']],
      hints: ['Add the three areas first.', 'Then divide by the number of m² in one hectare.'],
      steps: [`Total = ${v.map(commas).join(' + ')} = ${commas(t)} m².`, `${commas(t)} ÷ 10,000 = ${t / 10000} ha.`],
    }),
    check: ({ v }, a) => Math.round(a * 10000) === v[0] + v[1] + v[2] }),
  fam({ id: 'g7.area.parallelogram-slant', skill: 'G7_AREA_RECT', outcome: 'G7.AREA.b', rung: 2, form: 'word',
    draw: () => { const b = randInt(10, 30), h = randInt(6, 16), s = h + randInt(2, 6); return uniq(b * h, b * s, (b * h) / 2, 2 * (b + s)) ? { b, h, s, p: person() } : null; },
    make: ({ b, h, s, p }) => ({
      question: `${p.name} cuts a tile in the shape of a parallelogram. Its base is ${b} cm and its slanting side is ${s} cm. The straight distance between the base and the opposite side is ${h} cm. What is the area of the tile, in cm²?`,
      answer: b * h,
      wrong: [[b * s, 'Use the straight (perpendicular) height, not the slanting side.'], [(b * h) / 2, 'Halving is for a triangle. A parallelogram is base times height.'], [2 * (b + s), 'That is the perimeter. The question asks for the area.']],
      hints: ['Which of the lengths meets the base at a right angle?', 'Area of a parallelogram = base × perpendicular height.'],
      steps: [`The perpendicular height is ${h} cm. The slanting side is not used.`, `Area = ${b} × ${h} = ${b * h} cm².`],
    }),
    check: ({ b, h }, a) => a / b === h }),
  fam({ id: 'g7.area.trapezium-shamba', skill: 'G7_AREA_RECT', outcome: 'G7.AREA.b', rung: 2, form: 'word',
    draw: () => { const a = randInt(2, 8) * 10, b = randInt(2, 8) * 10, h = randInt(2, 8) * 10; return a !== b && uniq((a + b) * h / 2, (a + b) * h, (a + b) / 2, a * h) ? { a, b, h, p: person() } : null; },
    make: ({ a, b, h, p }) => ({
      question: `${p.name} sells a piece of land. From above, it has four sides and only one pair of them is parallel. The parallel sides measure ${a} m and ${b} m, with ${h} m between them. What is the area of the land, in m²?`,
      answer: ((a + b) * h) / 2,
      wrong: [[(a + b) * h, 'A trapezium is half of (sum of parallel sides) × height. This forgets the half.'], [(a + b) / 2, 'That is the average of the parallel sides. Multiply it by the height too.'], [a * h, 'Both parallel sides are used. Add them first.']],
      hints: ['Add the two parallel sides.', 'Multiply by the distance between them, then halve.'],
      steps: [`${a} + ${b} = ${a + b} m.`, `Area = ½ × ${a + b} × ${h} = ${commas(((a + b) * h) / 2)} m².`],
    }),
    check: ({ a, b, h }, v) => v * 2 === (a + b) * h }),
  fam({ id: 'g7.area.trapezium-missing', skill: 'G7_AREA_RECT', outcome: 'G7.AREA.b', rung: 3, form: 'steps',
    draw: () => { const a = randInt(8, 20), b = randInt(8, 20), h = pick([4, 6, 8, 10, 12]); return a !== b ? { a, b, h } : null; },
    make: ({ a, b, h }) => { const A = ((a + b) * h) / 2; return {
      question: `A trapezium-shaped plot has an area of ${A} m². One of its parallel sides is ${a} m long. The distance between the parallel sides is ${h} m.`,
      parts: [
        { prompt: 'Twice the area, divided by the distance between the parallel sides, gives the sum of the parallel sides. What is that sum, in metres?', answer: a + b, unit: 'm', hint: `Area = ½ × (sum) × ${h}, so sum = 2 × area ÷ ${h}.`, wrong: [[A / h, 'You need twice the area first, because the formula has a half.']] },
        { prompt: 'How long is the other parallel side, in metres?', answer: b, unit: 'm', hint: 'Take the known side from the sum.', wrong: [[a + b + a, 'Take the known side away from the sum. Do not add it.']] },
      ],
      steps: [`2 × ${A} ÷ ${h} = ${a + b} m.`, `Other side = ${a + b} − ${a} = ${b} m.`],
    }; },
    check: ({ a, b, h }, v) => ((v[0]) * h) / 2 === ((a + b) * h) / 2 && v[1] + a === v[0] }),
  fam({ id: 'g7.area.spot-trapezium', skill: 'G7_AREA_RECT', outcome: 'G7.AREA.b', rung: 3, form: 'spot',
    draw: () => { const a = randInt(6, 20), b = randInt(6, 20), h = randInt(3, 12) * 2; return a !== b ? { a, b, h, p: person() } : null; },
    make: ({ a, b, h, p }) => {
      const s = a + b, m = s * h, bad = m * 2, good = m / 2;
      return { question: `${p.name} finds the area of a trapezium. The parallel sides are ${a} cm and ${b} cm long, and the height is ${h} cm. Which step has the mistake?`,
        working: [
          { text: `Sum of parallel sides = ${a} + ${b} = ${s}`, ok: a + b === s },
          { text: `${s} × ${h} = ${m}`, ok: s * h === m },
          { text: `Area = ${m} × 2 = ${bad}`, ok: bad === good },
          { text: `The area is ${bad} cm².`, ok: bad === bad },
        ],
        fix: 'The area of a trapezium has a half in it. Halve the product, do not double it.',
        steps: [`${s} × ${h} = ${m}.`, `Area = ${m} ÷ 2 = ${good} cm².`] };
    } }),
  fam({ id: 'g7.area.why-height', skill: 'G7_AREA_RECT', outcome: 'G7.AREA.b', rung: 2, form: 'why',
    draw: () => { const b = randInt(8, 16), h = randInt(5, 9), s = h + randInt(2, 5); return { b, h, s, p: person() }; },
    make: ({ b, h, s, p }) => ({
      question: `A parallelogram has a base of ${b} cm, a slanting side of ${s} cm and a perpendicular height of ${h} cm. ${p.name} works out the area as ${b} × ${s}. Why is this wrong?`,
      options: [
        { text: 'The shape can be moved to make a rectangle, base by height', right: true },
        { text: `The area should be half of ${b} × ${s}, as for a triangle`, right: false, why: 'A parallelogram is not half of anything here. A triangle has the half.' },
        { text: 'The slanting side is shorter than the height, so it gives too small an area', right: false, why: 'The slanting side is longer than the height, and that is why the answer is too big.' },
        { text: 'The area of a parallelogram is found by adding the sides', right: false, why: 'Adding the sides gives the perimeter.' },
      ],
      hints: ['Cut a right-angled triangle off one end of the parallelogram and move it to the other end.', 'What shape do you get?'],
      steps: ['Moving the triangle makes a rectangle with the same area.', `Its sides are the base ${b} cm and the height ${h} cm, so the area is ${b} × ${h} = ${b * h} cm².`],
    }) }),
  fam({ id: 'g7.area.tiles-floor', skill: 'G7_AREA_RECT', outcome: 'G7.AREA.b', rung: 3, form: 'word',
    draw: () => { const L = randInt(3, 8), W = randInt(3, 6), t = pick([20, 25, 50]); const n = (L * W * 10000) / (t * t); const w2 = (L * W * 100) / (t * t); const w3 = (L * 100) / t + (W * 100) / t; return Number.isInteger(n) && Number.isInteger(w2) && L !== W && uniq(n, w2, w3, L * W) ? { L, W, t, n, w2, w3, p: person() } : null; },
    make: ({ L, W, t, n, w2, w3, p }) => ({
      question: `The floor of a room is a rectangle ${L} m long and ${W} m wide. ${p.name} covers it with square tiles. Each tile has sides of ${t} cm. How many tiles does ${p.she} need?`,
      answer: n,
      wrong: [[w2, 'One square metre is 100 cm × 100 cm, which is 10,000 cm², not 100 cm².'], [w3, 'That counts the tiles along two sides. Count how many cover the whole floor.'], [L * W, 'That is the area of the floor in m². Compare it with the area of one tile.']],
      hints: ['Use one unit for both areas, for example cm².', 'Floor area ÷ area of one tile.'],
      steps: [`Floor: ${L * 100} cm × ${W * 100} cm = ${commas(L * W * 10000)} cm².`, `One tile: ${t} × ${t} = ${t * t} cm².`, `Tiles = ${commas(L * W * 10000)} ÷ ${t * t} = ${n}.`],
    }),
    check: ({ L, W, t }, a) => a * t * t === L * 100 * W * 100 }),
  fam({ id: 'g7.area.circle-diameter', skill: 'G7_AREA_CIRCLE', outcome: 'G7.AREA.c', rung: 2, form: 'word',
    draw: () => ({ d: pick([14, 28, 42, 56]), p: person() }),
    make: ({ d, p }) => ({
      question: `${p.name} makes a circular flower bed with a diameter of ${d} m. Take π = 22/7. What is the area of the flower bed, in m²?`,
      answer: (22 * (d / 2) ** 2) / 7,
      wrong: [[(22 * d * d) / 7, 'The diameter is the full width. The formula needs the radius, which is half of it.'], [(22 * d) / 7, 'That is the distance round the bed. The area uses the radius squared.'], [(22 * (d / 2)) / 7, 'The radius must be squared: r × r.']],
      hints: ['Area = π × r × r. What is the radius?', 'The radius is half of the diameter.'],
      steps: [`Radius = ${d} ÷ 2 = ${d / 2} m.`, `Area = 22/7 × ${d / 2} × ${d / 2} = ${(22 * (d / 2) ** 2) / 7} m².`],
    }),
    check: ({ d }, a) => (a * 7) / 22 === (d / 2) * (d / 2) }),
  fam({ id: 'g7.area.semicircle-window', skill: 'G7_AREA_CIRCLE', outcome: 'G7.AREA.c', rung: 3, form: 'word',
    draw: () => ({ d: pick([14, 28, 42, 56]), p: person() }),
    make: ({ d, p }) => ({
      question: `A church has a window in the shape of a half circle. The straight edge is ${d} cm long. Take π = 22/7. What is the area of the window glass, in cm²?`,
      answer: (11 * (d / 2) ** 2) / 7,
      wrong: [[(22 * (d / 2) ** 2) / 7, 'That is a whole circle. The window is half a circle.'], [(11 * d * d) / 7, 'The straight edge is the diameter. Halve it to get the radius first.'], [(11 * d) / 7, 'That is half the distance round. Area needs the radius squared.']],
      hints: ['The straight edge of a half circle is its diameter.', 'Find the area of a full circle, then halve it.'],
      steps: [`Radius = ${d} ÷ 2 = ${d / 2} cm.`, `Full circle: 22/7 × ${d / 2} × ${d / 2} = ${(22 * (d / 2) ** 2) / 7} cm². Half of it: ${(11 * (d / 2) ** 2) / 7} cm².`],
    }),
    check: ({ d }, a) => (a * 2 * 7) / 22 === (d / 2) ** 2 }),
  fam({ id: 'g7.area.from-circumference', skill: 'G7_AREA_CIRCLE', outcome: 'G7.AREA.c', rung: 3, form: 'steps',
    draw: () => ({ r: pick([7, 14, 21, 28]), thing: pick(['circular pond', 'round field', 'circular fish pond']) }),
    make: ({ r, thing }) => ({
      question: `A ${thing} is measured by walking round its edge. The walk is ${(44 * r) / 7} m long. Take π = 22/7 and answer the parts below.`,
      parts: [
        { prompt: 'What is the diameter, in metres?', answer: 2 * r, unit: 'm', hint: 'Circumference = π × diameter.', wrong: [[(44 * r) / 7 / 2, 'Half of the circumference is not the diameter. Divide by π.']] },
        { prompt: 'What is the radius, in metres?', answer: r, unit: 'm', hint: 'Halve the diameter.', wrong: [[4 * r, 'The radius is half the diameter.']] },
        { prompt: 'What is the area, in square metres?', answer: (22 * r * r) / 7, unit: 'm²', hint: 'Area = π × r × r.', wrong: [[(22 * 2 * r) / 7, 'Use the radius squared, not the diameter.']] },
      ],
      steps: [`Diameter = ${(44 * r) / 7} ÷ 22/7 = ${2 * r} m.`, `Radius = ${2 * r} ÷ 2 = ${r} m.`, `Area = 22/7 × ${r} × ${r} = ${(22 * r * r) / 7} m².`],
    }),
    check: ({ r }, v) => v[0] === 2 * r && v[1] * 2 === v[0] && v[2] * 7 === 22 * v[1] * v[1] }),
  fam({ id: 'g7.area.why-radius-double', skill: 'G7_AREA_CIRCLE', outcome: 'G7.AREA.c', rung: 3, form: 'why',
    draw: () => ({ r: pick([5, 7, 10, 14]), p: person() }),
    make: ({ r, p }) => ({
      question: `${p.name} has a round mat of radius ${r} cm and a bigger round mat of radius ${2 * r} cm. ${p.She} says the bigger mat has twice the area. Why is ${p.she} wrong?`,
      options: [
        { text: 'The area uses the radius squared, so it is 4 times as big', right: true },
        { text: 'The area of a circle does not depend on the radius', right: false, why: 'A bigger radius gives a bigger area.' },
        { text: 'The area becomes 3 times as big, because π is about 3', right: false, why: 'π is the same for both mats. It does not change the multiplying.' },
        { text: 'Doubling the radius doubles the distance round, so the area doubles too', right: false, why: 'The distance round does double, but area grows faster: it uses r × r.' },
      ],
      hints: ['Write the area of each mat with the rule π × r × r.', 'Compare r × r for both mats.'],
      steps: [`Small mat: π × ${r} × ${r}. Big mat: π × ${2 * r} × ${2 * r}.`, `${2 * r} × ${2 * r} is 4 times ${r} × ${r}, so the area is 4 times as big.`],
    }) }),
  fam({ id: 'g7.area.path-around', skill: 'G7_AREA_RECT', outcome: 'G7.AREA.d', rung: 3, form: 'word',
    draw: () => { const l = randInt(10, 20), w = randInt(6, 12), x = pick([1, 2]); const ans = (l + 2 * x) * (w + 2 * x) - l * w; return uniq(ans, 2 * (l + w) * x, (l + x) * (w + x) - l * w, (l + 2 * x) * (w + 2 * x)) ? { l, w, x, ans, p: person() } : null; },
    make: ({ l, w, x, ans, p }) => ({
      question: `${p.name} has a rectangular garden ${l} m long and ${w} m wide. There is a concrete path around the garden, ${x} m wide, on the outside. What is the area of the path, in m²?`,
      answer: ans,
      wrong: [[2 * (l + w) * x, 'That multiplies the distance round the garden by the width. The four corners of the path are left out.'], [(l + x) * (w + x) - l * w, 'The path is on every side, so each of the two lengths grows by twice the width.'], [(l + 2 * x) * (w + 2 * x), 'That is the area of the garden and path together. Take the garden away.']],
      hints: ['Find the length and width of the garden and path together.', 'Subtract the garden from the big rectangle.'],
      steps: [`Big rectangle: (${l} + ${2 * x}) × (${w} + ${2 * x}) = ${l + 2 * x} × ${w + 2 * x} = ${(l + 2 * x) * (w + 2 * x)} m².`, `Garden: ${l} × ${w} = ${l * w} m².`, `Path = ${(l + 2 * x) * (w + 2 * x)} − ${l * w} = ${ans} m².`],
    }),
    check: ({ l, w, x }, a) => a + l * w === (l + 2 * x) * (w + 2 * x) }),
  fam({ id: 'g7.area.l-floor-cost', skill: 'G7_AREA_RECT', outcome: 'G7.AREA.d', rung: 3, form: 'steps',
    draw: () => ({ a: randInt(6, 10), b: randInt(4, 6), c: randInt(3, 5), d: randInt(2, 4), per: pick([80, 100, 120, 150]) }),
    make: ({ a, b, c, d, per }) => ({
      question: `An L-shaped floor is made of two rectangles joined together. One is ${a} m by ${b} m. The other is ${c} m by ${d} m. Tiling costs sh ${per} for each square metre.`,
      parts: [
        { prompt: 'What is the area of the first rectangle, in m²?', answer: a * b, unit: 'm²', hint: 'Length times width.', wrong: [[2 * (a + b), 'That is a perimeter. Multiply the two sides.']] },
        { prompt: 'What is the area of the second rectangle, in m²?', answer: c * d, unit: 'm²', hint: 'Length times width.', wrong: [[c + d, 'Multiply the two sides, do not add.']] },
        { prompt: 'What is the area of the whole floor, in m²?', answer: a * b + c * d, unit: 'm²', hint: 'Add the two areas.', wrong: [[a * b * c * d, 'Add the two areas. Do not multiply them.']] },
        { prompt: 'How much does it cost to tile the floor, in shillings?', answer: (a * b + c * d) * per, unit: 'sh', hint: 'Area times the cost of one m².', wrong: [[a * b * per, 'Tile the whole floor, not just the first rectangle.']] },
      ],
      steps: [`${a} × ${b} = ${a * b} m².`, `${c} × ${d} = ${c * d} m².`, `${a * b} + ${c * d} = ${a * b + c * d} m².`, `${a * b + c * d} × ${per} = ${sh((a * b + c * d) * per)}.`],
    }),
    check: ({ a, b, c, d, per }, v) => v[0] === a * b && v[1] === c * d && v[2] === v[0] + v[1] && v[3] / per === v[2] }),
  fam({ id: 'g7.area.rect-and-semicircle', skill: 'G7_AREA_CIRCLE', outcome: 'G7.AREA.d', rung: 3, form: 'steps',
    draw: () => ({ w: pick([14, 28]), l: randInt(10, 30) }),
    make: ({ w, l }) => ({
      question: `A school stage is a combined shape. It is a rectangle ${l} m long and ${w} m wide, with a half circle added to one of the ${w} m sides. Take π = 22/7.`,
      parts: [
        { prompt: 'What is the area of the rectangle, in m²?', answer: l * w, unit: 'm²', hint: 'Length times width.', wrong: [[2 * (l + w), 'Multiply the sides. Adding gives the perimeter.']] },
        { prompt: 'What is the area of the half circle, in m²?', answer: (11 * (w / 2) ** 2) / 7, unit: 'm²', hint: 'The side of length w is the diameter of the half circle. Find the radius first, then half of π r².', wrong: [[(22 * (w / 2) ** 2) / 7, 'That is a whole circle. The stage has half of one.'], [(11 * w * w) / 7, 'The width is the diameter. Use half of it as the radius.']] },
        { prompt: 'What is the area of the whole stage, in m²?', answer: l * w + (11 * (w / 2) ** 2) / 7, unit: 'm²', hint: 'Add the two parts.', wrong: [[l * w * ((11 * (w / 2) ** 2) / 7), 'Add the two areas. Do not multiply.']] },
      ],
      steps: [`Rectangle: ${l} × ${w} = ${l * w} m².`, `Radius = ${w / 2} m. Half circle = ½ × 22/7 × ${w / 2} × ${w / 2} = ${(11 * (w / 2) ** 2) / 7} m².`, `Total = ${l * w} + ${(11 * (w / 2) ** 2) / 7} = ${l * w + (11 * (w / 2) ** 2) / 7} m².`],
    }),
    check: ({ w, l }, v) => v[0] === l * w && v[1] * 7 * 2 === 22 * (w / 2) ** 2 && v[2] === v[0] + v[1] }),
  fam({ id: 'g7.area.pond-path-ring', skill: 'G7_AREA_CIRCLE', outcome: 'G7.AREA.d', rung: 3, form: 'steps',
    draw: () => ({ r: pick([7, 14, 21, 28]), x: pick([7, 14]) }),
    make: ({ r, x }) => ({
      question: `A circular pond has a radius of ${r} m. There is a path around the pond, ${x} m wide. Take π = 22/7.`,
      parts: [
        { prompt: 'What is the radius of the pond and path together, in metres?', answer: r + x, unit: 'm', hint: 'The path adds its width to the radius.', wrong: [[r + 2 * x, 'The path is only on the outside, so add its width once.']] },
        { prompt: 'What is the area of the pond and path together, in m²?', answer: (22 * (r + x) ** 2) / 7, unit: 'm²', hint: 'Area = π × r × r with the larger radius.', wrong: [[(22 * r * r) / 7, 'That uses the pond alone. Use the radius of the pond and path together.']] },
        { prompt: 'What is the area of the path alone, in m²?', answer: (22 * (r + x) ** 2) / 7 - (22 * r * r) / 7, unit: 'm²', hint: 'Take the area of the pond away.', wrong: [[(22 * (r + x) ** 2) / 7, 'Take the pond away from the big circle.']] },
      ],
      steps: [`Radius with path: ${r} + ${x} = ${r + x} m.`, `Big circle: 22/7 × ${r + x} × ${r + x} = ${(22 * (r + x) ** 2) / 7} m². Pond: 22/7 × ${r} × ${r} = ${(22 * r * r) / 7} m².`, `Path = ${(22 * (r + x) ** 2) / 7} − ${(22 * r * r) / 7} = ${(22 * (r + x) ** 2) / 7 - (22 * r * r) / 7} m².`],
    }),
    check: ({ r, x }, v) => v[0] === r + x && v[1] * 7 === 22 * v[0] * v[0] && v[2] + (22 * r * r) / 7 === v[1] }),

  // =========================================================== VOLUME AND CAPACITY
  fam({ id: 'g7.vol.why-million', skill: 'G7_VOLUME_CUBOID', outcome: 'G7.VOL.a', rung: 2, form: 'why',
    draw: () => ({ p: person(), n: pick([2, 3, 5]) }),
    make: ({ p, n }) => ({
      question: `${p.name} says that ${n} m³ of sand is ${n * 100} cm³, because 1 m = 100 cm. Why is ${p.she} wrong?`,
      options: [
        { text: 'A cubic metre is a cube 100 cm by 100 cm by 100 cm, which holds 1,000,000 cm³', right: true },
        { text: 'A cubic metre holds 10,000 cm³, because it has two sides of 100 cm', right: false, why: 'A cube has three dimensions. Multiply three lengths, not two.' },
        { text: `${n} m³ is smaller than ${n * 100} cm³ because metres are smaller than centimetres`, right: false, why: 'A metre is longer than a centimetre, so a cubic metre is much bigger than a cubic centimetre.' },
        { text: '1 m = 100 cm, so the number is right and only the unit is wrong', right: false, why: 'For volume you must use the 100 three times, once for each dimension.' },
      ],
      hints: ['Picture a cube with sides 1 m long. Each side is 100 cm.', 'Volume = length × width × height.'],
      steps: ['1 m³ = 100 cm × 100 cm × 100 cm = 1,000,000 cm³.', `${n} m³ = ${n} × 1,000,000 = ${commas(n * 1000000)} cm³.`],
    }) }),
  fam({ id: 'g7.vol.spot-m3-cm3', skill: 'G7_VOLUME_CUBOID', outcome: 'G7.VOL.a', rung: 2, form: 'spot',
    draw: () => ({ n: pick([2, 3, 4, 2.5, 3.5, 5]), p: person() }),
    make: ({ n, p }) => {
      const bad = 300, good = 100 * 100 * 100;
      return { question: `${p.name} changes ${n} m³ to cm³. Which step has the mistake?`,
        working: [
          { text: '1 m = 100 cm', ok: true },
          { text: '1 m³ = 100 + 100 + 100 = 300 cm³', ok: bad === good },
          { text: `${n} m³ = ${n} × 300 = ${commas(n * 300)} cm³`, ok: n * 300 === n * bad },
          { text: `So ${n} m³ is ${commas(n * 300)} cm³.`, ok: n * 300 === n * 300 },
        ],
        fix: 'A volume multiplies the three sides: 100 × 100 × 100. Adding them is wrong.',
        steps: ['1 m³ = 100 × 100 × 100 = 1,000,000 cm³.', `${n} m³ = ${n} × 1,000,000 = ${commas(n * good)} cm³.`] };
    } }),
  fam({ id: 'g7.vol.blocks-in-cubic-metre', skill: 'G7_VOLUME_CUBOID', outcome: 'G7.VOL.a', rung: 2, form: 'word',
    draw: () => { const [a, b, c] = [pick([10, 20, 25, 50]), pick([10, 20, 25, 50]), pick([5, 10, 20, 25])]; const n = 1000000 / (a * b * c); return Number.isInteger(n) && n <= 4000 && uniq(n, n / 100, n * 100, 100 / a + 100 / b + 100 / c) ? { a, b, c, n, p: person() } : null; },
    make: ({ a, b, c, n, p }) => ({
      question: `${p.name} makes stone blocks. Each block is ${a} cm long, ${b} cm wide and ${c} cm high. How many blocks have the same total volume as 1 m³?`,
      answer: n,
      wrong: [[n / 100, 'Check how many cm³ make 1 m³. A cube has three dimensions, not two.'], [n * 100, 'Check how many cm³ make 1 m³. You multiply three lengths, each in cm.'], [round(100 / a + 100 / b + 100 / c, 3), 'That adds the blocks along each side. Compare volumes instead.']],
      hints: ['Change 1 m³ to cm³.', 'Find the volume of one block, then divide.'],
      steps: [`1 m³ = 1,000,000 cm³. One block: ${a} × ${b} × ${c} = ${commas(a * b * c)} cm³.`, `Blocks = ${commas(1000000)} ÷ ${commas(a * b * c)} = ${commas(n)}.`],
    }),
    check: ({ a, b, c }, n) => n * a * b * c === 1000000 }),
  fam({ id: 'g7.vol.cube-edges', skill: 'G7_VOLUME_CUBOID', outcome: 'G7.VOL.c', rung: 3, form: 'word',
    draw: () => { const s = randInt(3, 12); return { s, E: 12 * s, p: person() }; },
    make: ({ s, E, p }) => ({
      question: `${p.name} makes a cube-shaped box from wire. The wire along all 12 edges of the box is ${E} cm long altogether. What is the volume of the box, in cm³?`,
      answer: s * s * s,
      wrong: [[E * E * E, 'That cubes the total wire. First find the length of one edge.'], [(E / 6) ** 3, 'A cube has 12 edges, not 6.'], [s * s, 'That is the area of one face. Multiply by the edge once more.']],
      hints: ['A cube has 12 edges, all the same length.', 'Find one edge, then multiply it by itself three times.'],
      steps: [`One edge = ${E} ÷ 12 = ${s} cm.`, `Volume = ${s} × ${s} × ${s} = ${s * s * s} cm³.`],
    }),
    check: ({ E }, a) => Math.round(Math.cbrt(a)) * 12 === E }),
  fam({ id: 'g7.vol.cylinder-diameter', skill: 'G7_VOLUME_CYLINDER', outcome: 'G7.VOL.c', rung: 2, form: 'word',
    draw: () => ({ d: pick([14, 28, 42]), h: randInt(5, 30), p: person() }),
    make: ({ d, h, p }) => ({
      question: `A tin of cooking fat is a cylinder. Its diameter is ${d} cm and its height is ${h} cm. Take π = 22/7. What is the volume of the tin, in cm³?`,
      answer: (22 * (d / 2) ** 2 * h) / 7,
      wrong: [[(22 * d * d * h) / 7, 'The diameter is the full width. The formula needs the radius, which is half of it.'], [(22 * (d / 2) * h) / 7, 'The radius must be squared in the area of the circular base.'], [(22 * (d / 2) ** 2) / 7, 'That is the area of the base. Multiply by the height.']],
      hints: ['Volume = area of the circular base × height.', 'The radius is half of the diameter.'],
      steps: [`Radius = ${d / 2} cm. Base area = 22/7 × ${d / 2} × ${d / 2} = ${(22 * (d / 2) ** 2) / 7} cm².`, `Volume = ${(22 * (d / 2) ** 2) / 7} × ${h} = ${commas((22 * (d / 2) ** 2 * h) / 7)} cm³.`],
    }),
    check: ({ d, h }, a) => (a * 7) / 22 === (d / 2) * (d / 2) * h }),
  fam({ id: 'g7.vol.drum-litres', skill: 'G7_VOLUME_CYLINDER', outcome: 'G7.VOL.d', rung: 3, form: 'steps',
    draw: () => { const r = pick([7, 14, 21, 35, 70]), h = pick([50, 70, 100, 140, 200]); const v = (22 * r * r * h) / 7; return Number.isInteger(v / 1000) && v / 1000 >= 20 && v / 1000 <= 5000 ? { r, h, v } : null; },
    make: ({ r, h, v }) => ({
      question: `A round water tank is a cylinder with a radius of ${r} cm and a height of ${h} cm. Take π = 22/7.`,
      parts: [
        { prompt: 'What is the area of the circular base, in cm²?', answer: (22 * r * r) / 7, unit: 'cm²', hint: 'Area = π × r × r.', wrong: [[(22 * 2 * r) / 7, 'Use the radius squared, not the distance round.']] },
        { prompt: 'What is the volume of the tank, in cm³?', answer: v, unit: 'cm³', hint: 'Base area times height.', wrong: [[(22 * r * r) / 7 + h, 'Multiply the base area by the height. Do not add.']] },
        { prompt: 'How many litres does the tank hold? (1 litre = 1,000 cm³)', answer: v / 1000, unit: 'litres', hint: 'Divide cm³ by 1,000.', wrong: [[v / 100, 'A litre is 1,000 cm³, not 100 cm³.'], [v / 1000000, 'That changes to m³. One litre is 1,000 cm³.']] },
      ],
      steps: [`Base area = 22/7 × ${r} × ${r} = ${(22 * r * r) / 7} cm².`, `Volume = ${(22 * r * r) / 7} × ${h} = ${commas(v)} cm³.`, `${commas(v)} ÷ 1,000 = ${commas(v / 1000)} litres.`],
    }),
    check: ({ r, h }, a) => a[0] * 7 === 22 * r * r && a[1] === a[0] * h && a[2] * 1000 === a[1] }),
  fam({ id: 'g7.vol.cylinder-height', skill: 'G7_VOLUME_CYLINDER', outcome: 'G7.VOL.c', rung: 3, form: 'word',
    draw: () => { const r = pick([7, 14]), h = randInt(5, 30); return { r, h, V: (22 * r * r * h) / 7, p: person() }; },
    make: ({ r, h, V, p }) => ({
      question: `A cylinder-shaped tin has a base radius of ${r} cm. It holds ${commas(V)} cm³ of oil. Take π = 22/7. How tall is the tin, in cm?`,
      answer: h,
      wrong: [[V / ((22 * r) / 7), 'The base area uses r × r, not just r.'], [round(V / (22 * r * 2 / 7), 2), 'The base area is π r². The distance round, 2πr, is not used.'], [round(V / (22 / 7), 2), 'Divide by the whole base area, which uses π × r × r.']],
      hints: ['Volume = base area × height, so height = volume ÷ base area.', 'Find the area of the circular base first.'],
      steps: [`Base area = 22/7 × ${r} × ${r} = ${(22 * r * r) / 7} cm².`, `Height = ${commas(V)} ÷ ${(22 * r * r) / 7} = ${h} cm.`],
    }),
    check: ({ r, V }, a) => a * 22 * r * r === V * 7 }),
  fam({ id: 'g7.vol.tank-litres', skill: 'G7_VOLUME_CUBOID', outcome: 'G7.VOL.d', rung: 2, form: 'word',
    draw: () => { const l = pick([1, 1.5, 2, 2.5, 3, 4]), w = pick([1, 1.5, 2]), h = pick([1, 1.5, 2]); const V = round(l * w * h, 3); return V >= 1.5 && uniq(V * 1000, V * 100, V, V * 1000000) ? { l, w, h, V, p: person() } : null; },
    make: ({ l, w, h, V, p }) => ({
      question: `Rainwater fills a cuboid tank at ${p.name}'s school. The base is ${l} m by ${w} m and the water is ${h} m deep. How many litres of water are in the tank? (1 m³ holds 1,000 litres)`,
      answer: round(V * 1000, 3),
      wrong: [[round(V * 100, 3), 'One cubic metre holds 1,000 litres, not 100.'], [V, 'That is the volume in m³. Change it to litres.'], [round(V * 1000000, 3), 'That is the volume in cm³. The question asks for litres.']],
      hints: ['Find the volume in m³ first.', 'Then multiply by the number of litres in 1 m³.'],
      steps: [`Volume = ${l} × ${w} × ${h} = ${V} m³.`, `Litres = ${V} × 1,000 = ${commas(round(V * 1000, 3))}.`],
    }),
    check: ({ l, w, h }, a) => Math.abs(a / 1000 - l * w * h) < 1e-9 }),
  fam({ id: 'g7.vol.jerricans-fill-tank', skill: 'G7_VOLUME_CUBOID', outcome: 'G7.VOL.d', rung: 3, form: 'word',
    draw: () => { const l = pick([1, 2, 3, 4]), w = pick([1, 2]), h = pick([1, 1.5, 2]); const L = l * w * h * 1000, n = L / 20; return Number.isInteger(n) && uniq(n, l * w * h / 20, l * w * h * 100 / 20) ? { l, w, h, L, n, p: person() } : null; },
    make: ({ l, w, h, L, n, p }) => ({
      question: `A jerrican holds 20 litres. ${p.name} wants to fill an empty box-shaped tank, ${l} m long, ${w} m wide and ${h} m high, from jerricans. How many jerricans are needed? (1 m³ holds 1,000 litres)`,
      answer: n,
      wrong: [[round((l * w * h) / 20, 3), 'The volume is in m³ but the jerrican is in litres. Change to one unit first.'], [(l * w * h * 100) / 20, '1 m³ holds 1,000 litres, not 100.'], [L * 20, 'Divide the tank by the size of one jerrican. Do not multiply.']],
      hints: ['Find how many litres the tank holds.', 'Divide by the size of one jerrican.'],
      steps: [`Volume = ${l} × ${w} × ${h} = ${l * w * h} m³ = ${commas(L)} litres.`, `Jerricans = ${commas(L)} ÷ 20 = ${commas(n)}.`],
    }),
    check: ({ L }, a) => a * 20 === L }),
  fam({ id: 'g7.vol.days-of-water', skill: 'G7_VOLUME_CUBOID', outcome: 'G7.VOL.d', rung: 3, form: 'table',
    draw: () => {
      const u = [randInt(2, 6) * 5, randInt(5, 12) * 5, randInt(2, 6) * 5, randInt(2, 6) * 5]; const t = u.reduce((a, b) => a + b, 0);
      const days = pick([5, 10, 15, 20, 25, 30]); const V = (t * days) / 1000;
      return Number.isInteger(V * 10) && V >= 0.5 ? { u, t, days, V, p: person() } : null;
    },
    make: ({ u, t, days, V, p }) => ({
      question: `The table shows how much water ${p.name}'s family uses in one day. They have a tank that holds ${V} m³ when full. For how many days can the family use the water in a full tank? (1 m³ = 1,000 litres)`,
      model: { type: 'table', data: { head: ['Use', 'Litres a day'], rows: ['Cooking and drinking', 'Washing clothes', 'Bathing', 'Cleaning'].map((label, i) => ({ label, value: String(u[i]) })) } },
      answer: days,
      wrong: [[round(V / t, 6), 'The tank is in m³ and the table is in litres. Change to litres first.'], [round((V * 100) / t, 3), '1 m³ holds 1,000 litres, not 100.'], [round(V * 1000 / u[0], 3), 'Add up all four uses in the table, not just the first one.']],
      hints: ['Add the four amounts to find the litres used in one day.', `Change ${V} m³ to litres, then divide by the daily use.`],
      steps: [`One day: ${u.join(' + ')} = ${t} litres.`, `${V} m³ = ${commas(V * 1000)} litres.`, `Days = ${commas(V * 1000)} ÷ ${t} = ${days}.`],
    }),
    check: ({ t, V }, a) => a * t === Math.round(V * 1000) }),
  fam({ id: 'g7.vol.cups-from-can', skill: 'G7_VOLUME_CUBOID', outcome: 'G7.VOL.d', rung: 2, form: 'word',
    draw: () => { const c = pick([200, 250, 500]), L = pick([5, 10, 12, 20, 25, 30, 40]); const n = (L * 1000) / c; return Number.isInteger(n) && uniq(n, L / c, (L * 100) / c, L * c) ? { c, L, n, p: person() } : null; },
    make: ({ c, L, n, p }) => ({
      question: `${p.name} sells tea from a can that holds ${L} litres. Each cup holds ${c} millilitres (ml). How many full cups can ${p.she} fill from the can?`,
      answer: n,
      wrong: [[round(L / c, 4), 'The can is in litres and the cup is in millilitres. Use one unit.'], [(L * 100) / c, 'There are 1,000 ml in 1 litre, not 100.'], [L * c, 'Divide the amount in the can by the amount in one cup.']],
      hints: ['Change litres to millilitres.', 'Divide by the size of one cup.'],
      steps: [`${L} litres = ${L} × 1,000 = ${commas(L * 1000)} ml.`, `Cups = ${commas(L * 1000)} ÷ ${c} = ${n}.`],
    }),
    check: ({ c, L }, a) => a * c === L * 1000 }),

  // =========================================================== TIME, DISTANCE AND SPEED
  fam({ id: 'g7.speed.seconds-to-hm', skill: 'G7_SPEED', outcome: 'G7.SPEED.a', rung: 2, form: 'steps',
    draw: () => ({ h: randInt(1, 3), m: pick([5, 10, 15, 20, 25, 35, 40, 45, 50]), p: person() }),
    make: ({ h, m, p }) => {
      const s = h * 3600 + m * 60;
      return { question: `${p.name} runs a long race. The clock shows ${commas(s)} seconds at the finish.`,
        parts: [
          { prompt: 'How many minutes is that?', answer: s / 60, unit: 'minutes', hint: 'There are 60 seconds in a minute.', wrong: [[s / 100, 'A minute has 60 seconds, not 100.'], [s * 60, 'Seconds are small units, so there are fewer minutes than seconds.']] },
          { prompt: 'How many whole hours are in that time?', answer: h, unit: 'hours', hint: 'There are 60 minutes in an hour.', wrong: [[round(s / 60 / 100, 2), 'An hour has 60 minutes, not 100.']] },
          { prompt: 'How many minutes are left over after the whole hours?', answer: m, unit: 'minutes', hint: 'Take the minutes in the whole hours away from the total minutes.', wrong: [[s / 60 - h, 'Take away 60 minutes for every whole hour, not 1.']] },
        ],
        steps: [`${commas(s)} ÷ 60 = ${s / 60} minutes.`, `${s / 60} minutes has ${h} whole hour${h > 1 ? 's' : ''} (${h * 60} minutes).`, `Left over: ${s / 60} − ${h * 60} = ${m} minutes.`] };
    },
    check: ({ h, m }, v) => v[0] * 60 === (h * 60 + m) * 60 && v[1] * 60 + v[2] === v[0] }),
  fam({ id: 'g7.speed.timetable-moving', skill: 'G7_SPEED', outcome: 'G7.SPEED.a', rung: 3, form: 'table',
    draw: () => {
      const t0 = randInt(5, 9) * 60 + pick([0, 15, 30, 45]), leg1 = randInt(10, 24) * 5, wait = pick([10, 15, 20, 25]), leg2 = randInt(8, 18) * 5;
      const a1 = t0 + leg1, d1 = a1 + wait, a2 = d1 + leg2;
      return uniq(leg1 + leg2, leg1 + leg2 + wait, leg1, leg2) ? { t0, leg1, wait, leg2, a1, d1, a2, p: person() } : null;
    },
    make: ({ t0, leg1, wait, leg2, a1, d1, a2 }) => {
      const f = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
      return { question: 'The table shows a bus timetable on the 24-hour clock. How many minutes is the bus actually moving between Nairobi and Nakuru? It is not moving while it waits at Naivasha.',
        model: { type: 'table', data: { head: ['Stop', 'Arrives', 'Leaves'], rows: [{ cells: ['Nairobi', '-', f(t0)] }, { cells: ['Naivasha', f(a1), f(d1)] }, { cells: ['Nakuru', f(a2), '-'] }] } },
        answer: leg1 + leg2,
        wrong: [[leg1 + leg2 + wait, 'That includes the time the bus waits at Naivasha. The bus is not moving then.'], [leg1, 'That is only the first part of the journey, Nairobi to Naivasha.'], [leg2, 'That is only the second part of the journey, Naivasha to Nakuru.']],
        hints: ['Find the time from Nairobi to Naivasha, and from Naivasha to Nakuru.', 'Do not count the time the bus waits.'],
        steps: [`Nairobi to Naivasha: ${f(t0)} to ${f(a1)} is ${leg1} minutes.`, `Naivasha to Nakuru: ${f(d1)} to ${f(a2)} is ${leg2} minutes.`, `Moving: ${leg1} + ${leg2} = ${leg1 + leg2} minutes.`] };
    },
    check: ({ t0, wait, a2 }, a) => a + wait === a2 - t0 }),
  fam({ id: 'g7.speed.timetable-speed', skill: 'G7_SPEED', outcome: 'G7.SPEED.d', rung: 2, form: 'table',
    draw: () => {
      const [from, to, km] = route(); const v = pick([40, 50, 60, 64, 75, 80, 100]); const mins = (km * 60) / v;
      if (!Number.isInteger(mins) || mins < 30 || mins % 60 === 0 || km < 60) return null;
      const t0 = randInt(5, 10) * 60 + pick([0, 15, 30]);
      return { from, to, km, v, mins, t0 };
    },
    make: ({ from, to, km, v, mins, t0 }) => {
      const f = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
      const hrs = mins / 60;
      return { question: 'A bus company prints this notice on the 24-hour clock. The bus travels at the same speed all the way. What is its speed, in km/h?',
        model: { type: 'table', data: { head: ['Notice', ''], rows: [{ label: 'From', value: from }, { label: 'To', value: to }, { label: 'Distance (km)', value: String(km) }, { label: 'Leaves', value: f(t0) }, { label: 'Arrives', value: f(t0 + mins) }] } },
        answer: v,
        wrong: [[round(km / mins, 2), 'Speed in km/h needs the time in hours, not minutes.'], [round(km * hrs, 2), 'Speed is distance divided by time. Do not multiply.'], [round(km / (Math.floor(mins / 60) + (mins % 60) / 100), 2), 'Minutes are out of 60, not 100. Change the minutes to a fraction of an hour.']],
        hints: ['Work out how long the journey takes, from the two times.', 'Speed = distance ÷ time, with the time in hours.'],
        steps: [`Time = ${f(t0 + mins)} − ${f(t0)} = ${mins} minutes = ${round(hrs, 4)} hours.`, `Speed = ${km} ÷ ${round(hrs, 4)} = ${v} km/h.`] };
    },
    check: ({ km, mins }, a) => Math.round(a * mins) === km * 60 }),
  fam({ id: 'g7.speed.laps-km', skill: 'G7_SPEED', outcome: 'G7.SPEED.c', rung: 1, form: 'word',
    draw: () => { const L = pick([200, 250, 400]), n = randInt(3, 12); return (L * n) % 100 === 0 ? { L, n, p: person() } : null; },
    make: ({ L, n, p }) => ({
      question: `One lap of the school track is ${L} metres. ${p.name} runs ${n} laps. How many kilometres does ${p.she} run?`,
      answer: (L * n) / 1000,
      wrong: [[L * n, 'That is in metres. The question asks for kilometres.'], [(L * n) / 100, 'There are 1,000 m in 1 km, not 100 m.'], [(L * n) / 10000, 'There are 1,000 m in 1 km. This divides by too much.']],
      hints: ['Find the total distance in metres first.', 'Change metres to kilometres.'],
      steps: [`${n} × ${L} = ${L * n} m.`, `${L * n} ÷ 1,000 = ${(L * n) / 1000} km.`],
    }),
    check: ({ L, n }, a) => Math.round(a * 1000) === L * n }),
  fam({ id: 'g7.speed.walk-to-school-week', skill: 'G7_SPEED', outcome: 'G7.SPEED.c', rung: 2, form: 'word',
    draw: () => { const d = pick([450, 600, 750, 900, 1200, 1350, 1500]), days = pick([5, 6]); return { d, days, p: person() }; },
    make: ({ d, days, p }) => ({
      question: `${p.name} walks ${commas(d)} m to school each morning and ${commas(d)} m home each afternoon. School is open ${days} days a week. How many kilometres does ${p.she} walk to and from school in one week?`,
      answer: round((2 * d * days) / 1000, 3),
      wrong: [[2 * d * days, 'That is in metres. The question asks for kilometres.'], [round((d * days) / 1000, 3), `${p.name} walks to school and home again, so count both ways.`], [round((2 * d * days) / 100, 3), 'There are 1,000 m in 1 km, not 100 m.']],
      hints: ['Find the distance for one day, there and back.', 'Multiply by the number of days, then change to kilometres.'],
      steps: [`One day: ${commas(d)} + ${commas(d)} = ${commas(2 * d)} m.`, `${days} days: ${commas(2 * d)} × ${days} = ${commas(2 * d * days)} m = ${round((2 * d * days) / 1000, 3)} km.`],
    }),
    check: ({ d, days }, a) => Math.round(a * 1000) === 2 * d * days }),
  fam({ id: 'g7.speed.hours-and-minutes', skill: 'G7_SPEED', outcome: 'G7.SPEED.d', rung: 2, form: 'word',
    draw: () => { const v = pick([40, 48, 60, 72, 80]), t = pick([1.5, 2.5, 3.5, 0.75, 1.25, 2.25]); const d = v * t; return Number.isInteger(d) ? { v, t, d, p: person() } : null; },
    make: ({ v, t, d, p }) => {
      const h = Math.floor(t), m = round((t - h) * 60, 0);
      return { question: `${p.name}'s matatu travels ${d} km in ${h > 0 ? `${h} hour${h > 1 ? 's' : ''} and ` : ''}${m} minutes. What is the speed of the matatu, in km/h?`,
        answer: v,
        wrong: [[round(d / (h + m / 100), 2), 'Minutes are out of 60, not 100. Change the minutes to part of an hour.'], [round(d / (h * 60 + m), 3), 'Speed in km/h needs the time in hours, not minutes.'], [round(d * t, 2), 'Speed is distance divided by time. Do not multiply.']],
        hints: ['Change the time to hours. 30 minutes is half an hour.', 'Speed = distance ÷ time.'],
        steps: [`${m} minutes = ${m}/60 = ${round(m / 60, 4)} hour.`, `Time = ${t} hours. Speed = ${d} ÷ ${t} = ${v} km/h.`] };
    },
    check: ({ d, t }, a) => Math.abs(a * t - d) < 1e-9 }),
  fam({ id: 'g7.speed.minutes-for-trip', skill: 'G7_SPEED', outcome: 'G7.SPEED.a', rung: 2, form: 'word',
    draw: () => { const v = pick([40, 50, 60, 80]), d = pick([60, 100, 120, 140, 160, 180, 200, 250]); const mins = (d * 60) / v; return Number.isInteger(mins) && mins % 60 !== 0 && mins % 30 === 0 && uniq(mins, d / v, mins + (mins % 60) * 0.667, d * v) ? { v, d, mins, p: person() } : null; },
    make: ({ v, d, mins, p }) => {
      const hrs = d / v, h = Math.floor(hrs), m = mins - h * 60;
      return { question: `${p.name} drives a ${pick(['lorry', 'car', 'bus'])} at ${v} km/h (kilometres per hour) for ${d} km. Give the time of the journey in minutes.`,
        answer: mins,
        wrong: [[round(hrs, 2), 'That is the time in hours. The question asks for minutes.'], [h * 60 + round((hrs - h) * 100, 0), 'Part of an hour is out of 60 minutes, not 100. Multiply the decimal part by 60.'], [d * v, 'Time = distance ÷ speed. Do not multiply.']],
        hints: ['Find the time in hours, using distance ÷ speed.', 'Change the hours to minutes. An hour has 60 minutes.'],
        steps: [`Time = ${d} ÷ ${v} = ${round(hrs, 4)} hours.`, `${round(hrs, 4)} × 60 = ${mins} minutes.`] };
    },
    check: ({ v, d, mins }, a) => a * v === d * 60 }),
  fam({ id: 'g7.speed.spot-minutes-hours', skill: 'G7_SPEED', outcome: 'G7.SPEED.d', rung: 2, form: 'spot',
    draw: () => ({ v: pick([12, 24, 36]), m: pick([15, 30, 45]), p: person() }),
    make: ({ v, m, p }) => {
      const d = (v * m) / 60, bad = m / 100, good = m / 60;
      const shown = round(d / bad, 2);
      return { question: `${p.name} rides a bicycle ${d} km in ${m} minutes. ${p.She} works out the speed in km/h. Which step has the mistake?`,
        working: [
          { text: 'Speed = distance ÷ time', ok: true },
          { text: `${m} minutes = ${m} ÷ 100 = ${bad} hours`, ok: round(bad, 4) === round(good, 4) },
          { text: `Speed = ${d} ÷ ${bad} = ${shown} km/h`, ok: shown === round(d / bad, 2) },
          { text: `The speed is ${shown} km/h.`, ok: shown === shown },
        ],
        fix: 'An hour has 60 minutes, so change minutes to hours by dividing by 60, not 100.',
        steps: [`${m} minutes = ${m} ÷ 60 = ${round(good, 4)} hours.`, `Speed = ${d} ÷ ${round(good, 4)} = ${v} km/h.`] };
    } }),
  fam({ id: 'g7.speed.average-two-legs', skill: 'G7_SPEED', outcome: 'G7.SPEED.d', rung: 3, form: 'steps',
    draw: () => { const [v1, v2] = pick([[60, 40], [40, 24], [60, 30], [30, 20], [60, 20]]); const D = pick([120, 240]); return { v1, v2, D, p: person() }; },
    make: ({ v1, v2, D, p }) => {
      const t1 = D / v1, t2 = D / v2, avg = (2 * D) / (t1 + t2);
      return { question: `${p.name} drives ${D} km at ${v1} km/h, then another ${D} km at ${v2} km/h.`,
        parts: [
          { prompt: 'How many hours does the first part take?', answer: t1, unit: 'hours', hint: 'Time = distance ÷ speed.', wrong: [[D * v1, 'Divide the distance by the speed.']] },
          { prompt: 'How many hours does the second part take?', answer: t2, unit: 'hours', hint: 'Time = distance ÷ speed.', wrong: [[D * v2, 'Divide the distance by the speed.']] },
          { prompt: 'What is the average speed for the whole journey, in km/h?', answer: avg, unit: 'km/h', hint: 'Total distance ÷ total time.', wrong: [[(v1 + v2) / 2, 'The slower part takes longer, so the average is not halfway between the speeds. Use total distance ÷ total time.']] },
        ],
        steps: [`${D} ÷ ${v1} = ${t1} hours.`, `${D} ÷ ${v2} = ${t2} hours.`, `Total distance ${2 * D} km ÷ total time ${t1 + t2} hours = ${avg} km/h.`] };
    },
    check: ({ v1, v2, D }, a) => a[0] * v1 === D && a[1] * v2 === D && a[2] * (a[0] + a[1]) === 2 * D }),
  fam({ id: 'g7.speed.ms-steps', skill: 'G7_SPEED', outcome: 'G7.SPEED.f', rung: 2, form: 'steps',
    draw: () => { const v = pick([5, 10, 15, 20, 25]), t = pick([10, 15, 20, 30]); return { v, t, d: v * t, what: pick(['A train', 'A lorry', 'A boda boda']) }; },
    make: ({ v, t, d, what }) => ({
      question: `${what} covers ${d} metres in ${t} seconds, going at the same speed all the time.`,
      parts: [
        { prompt: 'What is its speed in metres per second (m/s)?', answer: v, unit: 'm/s', hint: 'Speed = distance ÷ time.', wrong: [[d * t, 'Divide the distance by the time.']] },
        { prompt: 'How many metres does it cover in one hour (3,600 seconds)?', answer: v * 3600, unit: 'm', hint: 'Multiply the metres in one second by the seconds in an hour.', wrong: [[v * 60, 'An hour has 3,600 seconds, not 60.']] },
        { prompt: 'What is its speed in kilometres per hour (km/h)?', answer: v * 3.6, unit: 'km/h', hint: 'Change those metres to kilometres.', wrong: [[v * 3600, 'That is in metres. Divide by 1,000 to get kilometres.']] },
      ],
      steps: [`${d} ÷ ${t} = ${v} m/s.`, `${v} × 3,600 = ${commas(v * 3600)} m in an hour.`, `${commas(v * 3600)} ÷ 1,000 = ${v * 3.6} km/h.`],
    }),
    check: ({ d, t }, a) => a[0] * t === d && a[1] === a[0] * 3600 && Math.abs(a[2] * 1000 - a[1]) < 1e-6 }),
  fam({ id: 'g7.speed.kmh-to-ms-animal', skill: 'G7_SPEED', outcome: 'G7.SPEED.f', rung: 2, form: 'word',
    draw: () => { const [who, vs] = pick([['A cheetah runs', [25, 30]], ['An ostrich runs', [15, 20]], ['A racing cyclist rides', [10, 15]], ['A matatu on the highway goes', [20, 25, 30]]]); const v = pick(vs); return { v, kmh: v * 3.6, who }; },
    make: ({ v, kmh, who }) => ({
      question: `${who} at ${kmh} km/h. How many metres does it cover in one second? Give the speed in m/s.`,
      answer: v,
      wrong: [[round(kmh / 60, 2), 'An hour has 3,600 seconds, not 60.'], [round(kmh * 3.6, 2), 'To go from km/h to m/s you divide by 3.6. Multiplying goes the other way.'], [round(kmh / 1000, 3), 'Changing km to m multiplies by 1,000, and an hour to seconds divides by 3,600.']],
      hints: ['In one hour it covers that many kilometres. Change them to metres.', 'Then divide by the number of seconds in an hour.'],
      steps: [`${kmh} km = ${commas(kmh * 1000)} m in 3,600 s.`, `${commas(kmh * 1000)} ÷ 3,600 = ${v} m/s.`],
    }),
    check: ({ v, kmh }, a) => Math.abs(a * 3.6 - kmh) < 1e-9 }),
  fam({ id: 'g7.speed.why-divide-60', skill: 'G7_SPEED', outcome: 'G7.SPEED.f', rung: 3, form: 'why',
    draw: () => { const v = pick([5, 10, 15, 20]); return { v, kmh: v * 3.6, p: person() }; },
    make: ({ v, kmh, p }) => ({
      question: `${p.name} changes ${kmh} km/h to m/s. ${p.She} multiplies by 1,000 and divides by 60. Why is this wrong?`,
      options: [
        { text: 'An hour has 3,600 seconds, not 60 seconds', right: true },
        { text: 'A kilometre is 100 metres, not 1,000', right: false, why: 'A kilometre is 1,000 metres. That part is correct.' },
        { text: 'You should add 1,000 and 60, not multiply and divide', right: false, why: 'Adding units does not change them. You multiply by the size of the new small unit and divide by the bigger one.' },
        { text: 'You do not divide by anything. You only multiply by 1,000', right: false, why: 'The time changes from hours to seconds as well, so you must divide by the seconds in one hour.' },
      ],
      hints: ['Change the distance and the time separately.', 'How many seconds are there in one hour?'],
      steps: ['1 hour = 60 × 60 = 3,600 seconds.', `${kmh} km/h = ${commas(kmh * 1000)} m in 3,600 s = ${v} m/s.`],
    }) }),
  fam({ id: 'g7.speed.fastest-mixed-units', skill: 'G7_SPEED', outcome: 'G7.SPEED.f', rung: 2, form: 'direct',
    draw: () => { const a = randInt(6, 12) * 5, b = randInt(6, 10), c = randInt(3, 6) * 5; const vals = [a, b * 3.6, c]; const s = [...vals].sort((x, y) => x - y); return uniq(a, b * 3.6, c) && s[2] - s[1] >= 4 && s[1] - s[0] >= 4 ? { a, b, c } : null; },
    make: ({ a, b, c }) => {
      const v = [{ t: `a boda boda at ${a} km/h`, k: a }, { t: `a runner at ${b} m/s`, k: b * 3.6 }, { t: `a bicycle at ${c} km/h`, k: c }];
      const best = Math.max(...v.map(x => x.k));
      return { question: `Which is the fastest: a boda boda at ${a} km/h, a runner at ${b} m/s or a bicycle at ${c} km/h?`, story: false,
        options: v.map(x => ({ text: x.t.charAt(0).toUpperCase() + x.t.slice(1), right: x.k === best, why: x.k === best ? undefined : `Change all the speeds to km/h first. A speed in m/s becomes km/h when you multiply by 3.6.` })),
        hints: ['You cannot compare m/s with km/h until they are in the same unit.', `Multiply ${b} by 3.6 to change m/s to km/h.`],
        steps: [`${b} m/s = ${b} × 3.6 = ${round(b * 3.6, 1)} km/h.`, `Compare ${a} km/h, ${round(b * 3.6, 1)} km/h and ${c} km/h. The fastest is ${v.find(x => x.k === best).t}.`] };
    } }),

  // =========================================================== TEMPERATURE
  fam({ id: 'g7.temp.word-from-table', skill: 'G7_TEMPERATURE', outcome: 'G7.TEMP.a', rung: 1, form: 'table',
    draw: () => ({ t: pick([3, 6, 8, 12, 14, 17, 18, 22, 25, 27, 32, 35, 38]), place: pick(['Nairobi', 'Nakuru', 'Mombasa', 'Nyeri', 'Kisumu']) }),
    make: ({ t, place }) => {
      const word = t < 10 ? 'cold' : t < 20 ? 'cool' : t < 30 ? 'warm' : 'hot';
      return { question: `A thermometer in ${place} shows ${t} °C. Use the table. Which word describes this temperature?`,
        model: { type: 'table', data: { head: ['Temperature', 'Word'], rows: [{ label: 'Below 10 °C', value: 'cold' }, { label: '10 °C to 19 °C', value: 'cool' }, { label: '20 °C to 29 °C', value: 'warm' }, { label: '30 °C and above', value: 'hot' }] } },
        options: ['cold', 'cool', 'warm', 'hot'].map(w => ({ text: w, right: w === word, why: w === word ? undefined : `Look at which row of the table ${t} °C falls in.` })), fixedOrder: true,
        hints: ['Find the row whose range contains the reading.', 'Read the word in that row.'],
        steps: [`${t} °C is in the range for "${word}".`, `The word is ${word}.`] };
    } }),
  fam({ id: 'g7.temp.rise-then-fall', skill: 'G7_TEMPERATURE', outcome: 'G7.TEMP.b', rung: 2, form: 'word',
    draw: () => { const s = randInt(8, 16), r = randInt(10, 18), f = randInt(5, 12); return uniq(s + r - f, s + r + f, s - r + f, r - f) ? { s, r, f, place: pick(['Nakuru', 'Nyeri', 'Eldoret', 'Kitale']), p: person() } : null; },
    make: ({ s, r, f, place }) => ({
      question: `A thermometer in ${place} shows ${s} °C at 6 a.m. By 2 p.m. the temperature has risen by ${r} °C. Then it falls by ${f} °C by midnight. What does the thermometer show at midnight?`,
      answer: s + r - f,
      wrong: [[s + r + f, 'The temperature fell the second time. Take that fall away.'], [s - r + f, 'The first change was a rise. Add it.'], [r - f, 'Start from the 6 a.m. reading, then apply both changes.']],
      hints: ['Follow the thermometer through the day: start, rise, fall.', 'A rise goes up the scale. A fall goes down.'],
      steps: [`After the rise: ${s} + ${r} = ${s + r} °C.`, `After the fall: ${s + r} − ${f} = ${s + r - f} °C.`],
    }),
    check: ({ s, r, f }, a) => a + f - r === s }),
  fam({ id: 'g7.temp.spot-kelvin-minus', skill: 'G7_TEMPERATURE', outcome: 'G7.TEMP.d', rung: 2, form: 'spot',
    draw: () => ({ c: randInt(10, 38), p: person() }),
    make: ({ c, p }) => {
      const bad = c - 273, good = c + 273;
      return { question: `${p.name} changes ${c} °C to kelvin. Which step has the mistake?`,
        working: [
          { text: 'Kelvin = Celsius − 273', ok: '−' === '+' },
          { text: `Kelvin = ${c} − 273 = ${bad}`, ok: bad === c - 273 },
          { text: `So ${c} °C is ${bad} K.`, ok: bad === bad },
        ],
        fix: 'To change °C to kelvin, add 273. Kelvin readings are larger than the Celsius ones here.',
        steps: ['Kelvin = Celsius + 273.', `${c} + 273 = ${good} K.`] };
    } }),
  fam({ id: 'g7.temp.daily-range-graph', skill: 'G7_TEMPERATURE', outcome: 'G7.TEMP.b', rung: 2, form: 'graph',
    draw: () => { const hours = [6, 9, 12, 15, 18, 21]; const vals = [randInt(10, 14), randInt(15, 20), randInt(22, 28), randInt(23, 30), randInt(17, 22), randInt(12, 16)]; const hi = Math.max(...vals), lo = Math.min(...vals); return vals.filter(v => v === hi).length === 1 && vals.filter(v => v === lo).length === 1 && uniq(hi - lo, hi, vals[5] - vals[0] || 99, hi + lo) ? { hours, vals, place: pick(['Kitale', 'Thika', 'Nyeri', 'Machakos']) } : null; },
    make: ({ hours, vals, place }) => {
      const hi = Math.max(...vals), lo = Math.min(...vals);
      return { question: `The line graph shows the temperature in °C at a school in ${place} during one day. What is the difference between the hottest and the coldest temperature on the graph, in degrees?`,
        model: { type: 'line-graph', data: { points: hours.map((x, i) => ({ x, y: vals[i] })), xTicks: hours, yTicks: [10, 15, 20, 25, 30], xLabel: 'Time of day (hours)', yLabel: 'Temperature (°C)' } },
        answer: hi - lo,
        wrong: [[hi, 'That is the hottest temperature alone. Find how far it is from the coldest.'], [hi + lo, 'A difference is found by subtracting.'], [Math.abs(vals[vals.length - 1] - vals[0]), 'That compares the first and last readings. Look for the highest and the lowest points.']],
        hints: ['Find the highest point on the graph and the lowest point.', 'Subtract the lowest reading from the highest.'],
        steps: [`Highest: ${hi} °C. Lowest: ${lo} °C.`, `Difference: ${hi} − ${lo} = ${hi - lo} degrees.`] };
    },
    check: ({ vals }, a) => Math.min(...vals) + a === Math.max(...vals) }),

  // =========================================================== MONEY
  fam({ id: 'g7.money.profit-tomatoes', skill: 'G7_MONEY', outcome: 'G7.MONEY.a', rung: 2, form: 'word',
    draw: () => { const c = price('kg of tomatoes'), m = pick([10, 20, 30]), n = randInt(12, 40); return uniq(n * m, m, n * (c + m), n * c) ? { c, m, n, p: person() } : null; },
    make: ({ c, m, n, p }) => ({
      question: `${p.name} buys ${n} kg of tomatoes at ${sh(c)} a kilogram. ${p.She} sells all of them at ${sh(c + m)} a kilogram. How much profit does ${p.she} make, in shillings?`,
      answer: n * m,
      wrong: [[m, 'That is the profit on 1 kg. There are several kilograms.'], [n * (c + m), 'That is the money from selling. Profit is what is left after the cost is taken away.'], [n * c, 'That is what the tomatoes cost to buy. Profit is selling money minus cost.']],
      hints: ['Profit = money from selling − cost of buying.', 'Find the cost for all the tomatoes, and the selling money for all of them.'],
      steps: [`Cost: ${n} × ${c} = ${sh(n * c)}. Selling: ${n} × ${c + m} = ${sh(n * (c + m))}.`, `Profit = ${sh(n * (c + m))} − ${sh(n * c)} = ${sh(n * m)}.`],
    }),
    check: ({ c, m, n }, a) => n * c + a === n * (c + m) }),
  fam({ id: 'g7.money.loss-fault', skill: 'G7_MONEY', outcome: 'G7.MONEY.a', rung: 1, form: 'word',
    draw: () => { const item = pick(['radio', 'bicycle', 'mobile phone', 'sewing machine', 'television']); const c = price(item), l = pick([100, 200, 300, 500, 800]); return c > l * 3 ? { item, c, l, p: person() } : null; },
    make: ({ item, c, l, p }) => ({
      question: `A ${item} has a fault. ${p.name} paid ${sh(c)} for it and can only get ${sh(c - l)} now. What is the loss, in shillings?`,
      answer: l,
      wrong: [[c, 'That is the buying price. The loss is how much less the item sold for.'], [c - l, 'That is the selling price. Compare it with the buying price.'], [c + (c - l), 'A loss is a difference, so take one price from the other.']],
      hints: ['A loss happens when the selling price is less than the buying price.', 'Loss = buying price − selling price.'],
      steps: [`Bought for ${sh(c)}, sold for ${sh(c - l)}.`, `Loss = ${sh(c)} − ${sh(c - l)} = ${sh(l)}.`],
    }),
    check: ({ c, l }, a) => c - a === c - l }),
  fam({ id: 'g7.money.cement-transport', skill: 'G7_MONEY', outcome: 'G7.MONEY.a', rung: 3, form: 'steps',
    draw: () => { const c = price('bag of cement'), n = randInt(20, 50), t = pick([1000, 1500, 2000]), m = pick([60, 80, 100, 120]); return n * m > t + 500 ? { c, n, t, m } : null; },
    make: ({ c, n, t, m }) => ({
      question: `A hardware seller buys ${n} bags of cement at ${sh(c)} a bag. Delivery to the shop costs ${sh(t)}. The seller then sells every bag at ${sh(c + m)}.`,
      parts: [
        { prompt: 'What is the total cost, with delivery, in shillings?', answer: n * c + t, unit: 'sh', hint: 'Cost of the bags, plus the delivery.', wrong: [[n * c, 'Add the delivery cost as well.']] },
        { prompt: 'How much money does the seller get from selling all the bags, in shillings?', answer: n * (c + m), unit: 'sh', hint: 'Number of bags times the selling price.', wrong: [[c + m, 'There are many bags. Multiply by the number of bags.']] },
        { prompt: 'What is the profit, in shillings?', answer: n * m - t, unit: 'sh', hint: 'Money from selling minus total cost.', wrong: [[n * m, 'Take the delivery cost into account too: use the total cost.']] },
      ],
      steps: [`${n} × ${c} + ${t} = ${sh(n * c + t)}.`, `${n} × ${c + m} = ${sh(n * (c + m))}.`, `${sh(n * (c + m))} − ${sh(n * c + t)} = ${sh(n * m - t)}.`],
    }),
    check: ({ c, n, t, m }, v) => v[0] === n * c + t && v[1] === n * (c + m) && v[2] === v[1] - v[0] }),
  fam({ id: 'g7.money.percent-profit', skill: 'G7_MONEY', outcome: 'G7.MONEY.b', rung: 2, form: 'word',
    draw: () => { const item = pick(['school bag', 'radio', 'bicycle', 'sewing machine']), c = price(item), pc = pick([10, 20, 25, 40, 50]); const pr = (c * pc) / 100; return Number.isInteger(pr) && Number.isInteger(pr * 100 / (c + pr) * 10) && uniq(pc, pr, (pr * 100) / (c + pr), ((c + pr) * 100) / c) ? { item, c, pc, pr, p: person() } : null; },
    make: ({ item, c, pc, pr, p }) => ({
      question: `${p.name} buys a ${item} for ${sh(c)} and sells it for ${sh(c + pr)}. What is the percentage profit?`,
      answer: pc,
      wrong: [[round((pr * 100) / (c + pr), 1), 'Percentage profit is taken on the buying price, not on the selling price.'], [pr, 'That is the profit in shillings. Write it as a percentage of the buying price.'], [round(((c + pr) * 100) / c, 1), 'That compares the selling price with the buying price. Find the profit first.']],
      hints: ['Find the profit in shillings first.', 'Percentage profit = profit ÷ buying price × 100.'],
      steps: [`Profit = ${sh(c + pr)} − ${sh(c)} = ${sh(pr)}.`, `Percentage profit = ${pr} ÷ ${c} × 100 = ${pc}%.`],
    }),
    check: ({ c, pc, pr }, a) => (c * a) / 100 === pr }),
  fam({ id: 'g7.money.spot-percent-profit', skill: 'G7_MONEY', outcome: 'G7.MONEY.b', rung: 3, form: 'spot',
    draw: () => { const c = pick([400, 500, 800, 1000, 1200, 2000]), pc = pick([10, 20, 25, 40, 50]); return { c, pc, pr: (c * pc) / 100, p: person() }; },
    make: ({ c, pc, pr, p }) => ({
      question: `${p.name} found the percentage profit on a ${pick(['jacket', 'kettle', 'blanket'])} that was bought for ${sh(c)} and sold for ${sh(c + pr)}. The working is below. Which step is wrong?`,
      working: [
        { text: `Profit = ${c + pr} − ${c} = ${pr}`, ok: c + pr - c === pr },
        { text: `Profit ÷ buying price = ${pr} ÷ ${c} = ${pc / 100}`, ok: round(pr / c, 4) === pc / 100 },
        { text: `Percentage profit = ${pc / 100}%`, ok: pc / 100 === pc },
        { text: `The shopkeeper makes a profit of ${pc / 100}%.`, ok: pc / 100 === pc / 100 },
      ],
      fix: 'A fraction or decimal becomes a percentage when you multiply by 100.',
      steps: [`${pr} ÷ ${c} = ${pc / 100}.`, `${pc / 100} × 100 = ${pc}%.`],
    }) }),
  fam({ id: 'g7.money.table-best-percent', skill: 'G7_MONEY', outcome: 'G7.MONEY.b', rung: 3, form: 'table',
    draw: () => {
      const names = ['Shoes', 'Bag', 'Jacket'], rows = names.map(() => { const c = pick([200, 400, 500, 800, 1000, 1200, 2000, 2500]), pc = pick([10, 20, 25, 40, 50, 60]); return { c, pc, pr: (c * pc) / 100 }; });
      if (!rows.every(r => Number.isInteger(r.pr)) || !uniq(...rows.map(r => r.pc)) || !uniq(...rows.map(r => r.pr))) return null;
      const bp = rows.findIndex(r => r.pc === Math.max(...rows.map(x => x.pc))), ba = rows.findIndex(r => r.pr === Math.max(...rows.map(x => x.pr)));
      return bp !== ba ? { names, rows, bp } : null;
    },
    make: ({ names, rows, bp }) => ({
      question: 'A trader sold three items. The table shows what each cost to buy and what it sold for. Which item gave the greatest percentage profit?',
      model: { type: 'table', data: { head: ['Item', 'Bought for (sh)', 'Sold for (sh)'], rows: rows.map((r, i) => ({ cells: [names[i], commas(r.c), commas(r.c + r.pr)] })) } },
      options: rows.map((r, i) => ({ text: names[i], right: i === bp, why: i === bp ? undefined : 'Find each profit as a percentage of its own buying price. The biggest profit in shillings is not always the biggest percentage.' })),
      hints: ['Find the profit on each item.', 'Divide each profit by its own buying price and multiply by 100.'],
      steps: rows.map((r, i) => `${names[i]}: profit ${r.pr}, ${r.pr} ÷ ${r.c} × 100 = ${r.pc}%.`),
    }) }),
  fam({ id: 'g7.money.reverse-discount', skill: 'G7_PERCENTAGES', outcome: 'G7.MONEY.c', rung: 3, form: 'word',
    draw: () => { const M = pick([500, 800, 1000, 1200, 1500, 2000, 2500, 4000]), d = pick([10, 20, 25, 40]); const S = (M * (100 - d)) / 100; return Number.isInteger(S) && uniq(M, S * (100 + d) / 100, S + d, S * 100 / d) ? { M, d, S, p: person(), item: pick(['jacket', 'pair of shoes', 'school bag']) } : null; },
    make: ({ M, d, S, p, item }) => ({
      question: `A shop gives ${d}% discount on a ${item}. ${p.name} pays ${sh(S)} after the discount. What was the price marked on the ${item} before the discount?`,
      answer: M,
      wrong: [[round((S * (100 + d)) / 100, 2), `The discount was taken off the marked price, so ${sh(S)} is only ${100 - d}% of it. Adding ${d}% to ${sh(S)} gives the wrong base.`], [S + d, 'The discount is a percentage, not an amount of shillings.'], [round((S * 100) / d, 2), `${sh(S)} is ${100 - d}% of the marked price, not ${d}%.`]],
      hints: [`After a ${d}% discount, ${p.name} pays what percentage of the marked price?`, 'Find 1% of the marked price, then 100%.'],
      steps: [`Paid = 100% − ${d}% = ${100 - d}% of the marked price.`, `${100 - d}% is ${sh(S)}, so 1% is ${sh(round(S / (100 - d), 4))} and 100% is ${sh(M)}.`],
    }),
    check: ({ d, S }, a) => (a * (100 - d)) / 100 === S }),
  fam({ id: 'g7.money.why-two-discounts', skill: 'G7_PERCENTAGES', outcome: 'G7.MONEY.c', rung: 3, form: 'why',
    draw: () => { const [d1, d2] = pick([[20, 10], [10, 10], [30, 20], [50, 10]]); return { d1, d2, tot: 100 - ((100 - d1) * (100 - d2)) / 100, p: person() }; },
    make: ({ d1, d2, tot, p }) => ({
      question: `A shop gives ${d1}% discount on a coat. Then it takes a further ${d2}% off the new price. ${p.name} says the coat is now ${d1 + d2}% cheaper than the first price. Why is ${p.she} wrong?`,
      options: [
        { text: `The second discount is taken off the smaller price, so altogether the coat is ${tot}% cheaper`, right: true },
        { text: `The second discount is bigger than the first, so the total is more than ${d1 + d2}%`, right: false, why: 'The second discount is applied to a smaller price, so it takes off less money.' },
        { text: 'Two discounts cannot be added or combined in any way', right: false, why: 'They can be combined: take off the first, then work out the second on the new price.' },
        { text: `The total is only ${d1}% because the second discount does not count`, right: false, why: 'The second discount does take some money off the price.' },
      ],
      hints: ['Imagine the first price is 100. Take off the first discount.', 'Then take the second discount off what is left.'],
      steps: [`Start at 100. After ${d1}% off: ${100 - d1}.`, `${d2}% of ${100 - d1} is ${round(((100 - d1) * d2) / 100, 2)}, so the price is ${round(100 - tot, 2)}. Altogether ${tot}% cheaper.`],
    }) }),
  fam({ id: 'g7.money.commission-above-target', skill: 'G7_MONEY_TRANSACTIONS', outcome: 'G7.MONEY.d', rung: 3, form: 'word',
    draw: () => { const b = pick([15000, 18000, 20000, 25000]), r = pick([2, 3, 4, 5]), T = pick([50000, 100000, 200000]), S = T + pick([50000, 100000, 150000]); const c = (r * (S - T)) / 100; return uniq(b + c, b + (r * S) / 100, c, b + (r * T) / 100) ? { b, r, T, S, c, p: person() } : null; },
    make: ({ b, r, T, S, c, p }) => ({
      question: `${p.name} sells phones. ${p.She} is paid a basic salary of ${sh(b)} a month. ${p.She} also earns ${r}% commission on the value of sales above ${sh(T)}. This month ${p.she} sells goods worth ${sh(S)}. How much is ${p.her} pay for the month?`,
      answer: b + c,
      wrong: [[b + (r * S) / 100, `The commission is only on the sales above ${sh(T)}.`], [c, 'That is the commission only. Add the basic salary.'], [b + (r * T) / 100, 'Use the part of the sales above the target, not the target itself.']],
      hints: ['How much of the sales is above the target?', 'Work out the commission on that part only, then add the basic salary.'],
      steps: [`Sales above target: ${sh(S)} − ${sh(T)} = ${sh(S - T)}.`, `Commission: ${r}% of ${sh(S - T)} = ${sh(c)}. Pay = ${sh(b)} + ${sh(c)} = ${sh(b + c)}.`],
    }),
    check: ({ b, r, T, S }, a) => ((a - b) * 100) / r === S - T }),
  fam({ id: 'g7.money.spot-commission-decimal', skill: 'G7_MONEY_TRANSACTIONS', outcome: 'G7.MONEY.d', rung: 2, form: 'spot',
    draw: () => { const r = pick([3, 4, 5, 6, 8]), S = pick([120000, 240000, 300000, 450000]); return { r, S, p: person() }; },
    make: ({ r, S, p }) => {
      const bad = r / 10, good = r / 100;
      return { question: `A land agent earns ${r}% commission on sales of ${sh(S)}. ${p.name} works out the commission. Which step has the mistake?`,
        working: [
          { text: 'Commission = rate × value of sales', ok: true },
          { text: `${r}% as a decimal = ${bad}`, ok: bad === good },
          { text: `${bad} × ${commas(S)} = ${commas(bad * S)}`, ok: round(bad * S, 2) === round(bad * S, 2) },
          { text: `The agent earns ${sh(bad * S)}.`, ok: true },
        ],
        fix: `${r}% means ${r} out of 100, so the decimal is ${r} ÷ 100.`,
        steps: [`${r}% = ${r} ÷ 100 = ${good}.`, `${good} × ${commas(S)} = ${sh(round(good * S, 2))}.`] };
    } }),
  fam({ id: 'g7.money.electricity-bill', skill: 'G7_MONEY_TRANSACTIONS', outcome: 'G7.MONEY.e', rung: 2, form: 'table',
    draw: () => { const prev = randInt(1200, 4800), u = randInt(40, 160), rate = pick([20, 22, 24, 25, 28, 30]), fixed = pick([150, 200, 250, 300]); return uniq(u * rate + fixed, (prev + u) * rate + fixed, u * rate, u + rate + fixed) ? { prev, u, rate, fixed, p: person() } : null; },
    make: ({ prev, u, rate, fixed, p }) => ({
      question: `${p.name} reads this electricity bill for the house. In this question, the prices are as shown. What is the total to pay, in shillings?`,
      model: { type: 'table', data: { head: ['Item', 'Amount'], rows: [{ label: 'Meter reading last month', value: commas(prev) }, { label: 'Meter reading this month', value: commas(prev + u) }, { label: 'Charge for each unit used (sh)', value: String(rate) }, { label: 'Fixed charge (sh)', value: String(fixed) }] } },
      answer: u * rate + fixed,
      wrong: [[(prev + u) * rate + fixed, 'The number of units used is the difference between the two meter readings, not the reading itself.'], [u * rate, 'Add the fixed charge too.'], [u + rate + fixed, 'Units are multiplied by the charge for each unit, not added.']],
      hints: ['Units used = this month\'s reading − last month\'s reading.', 'Multiply the units by the charge for each unit, then add the fixed charge.'],
      steps: [`Units used = ${commas(prev + u)} − ${commas(prev)} = ${u}.`, `Bill = ${u} × ${rate} + ${fixed} = ${sh(u * rate + fixed)}.`],
    }),
    check: ({ u, rate, fixed }, a) => (a - fixed) / rate === u }),
  fam({ id: 'g7.money.water-bill-bands', skill: 'G7_MONEY_TRANSACTIONS', outcome: 'G7.MONEY.e', rung: 3, form: 'table',
    draw: () => { const a = pick([30, 35, 40, 45]), b = a + pick([10, 15, 20]), c = b + pick([10, 15, 20]), n = randInt(22, 32), F = pick([100, 150, 200]); return { a, b, c, n, F, p: person() }; },
    make: ({ a, b, c, n, F, p }) => ({
      question: `In this question, a water company charges in bands, as the table shows. ${p.name}'s family uses ${n} units in a month, and pays a fixed charge of ${sh(F)} as well. What is the water bill, in shillings?`,
      model: { type: 'table', data: { head: ['Units used', 'Charge for each unit (sh)'], rows: [{ label: 'First 10 units', value: String(a) }, { label: 'Next 10 units', value: String(b) }, { label: 'Every unit after 20', value: String(c) }] } },
      answer: 10 * a + 10 * b + (n - 20) * c + F,
      wrong: [[n * c + F, 'Each band has its own charge. Only the units above 20 cost the top rate.'], [n * a + F, 'Only the first 10 units cost the lowest rate.'], [10 * a + 10 * b + (n - 20) * c, 'Add the fixed charge as well.']],
      hints: ['Split the units into the three bands of the table.', 'Work out the cost of each band, then add all three and the fixed charge.'],
      steps: [`First 10: 10 × ${a} = ${10 * a}. Next 10: 10 × ${b} = ${10 * b}. After 20: ${n - 20} × ${c} = ${(n - 20) * c}.`, `Bill = ${10 * a} + ${10 * b} + ${(n - 20) * c} + ${F} = ${sh(10 * a + 10 * b + (n - 20) * c + F)}.`],
    }),
    check: ({ a, b, c, n, F }, v) => v - F - 10 * a - 10 * b === (n - 20) * c }),
  fam({ id: 'g7.money.shop-bill-change', skill: 'G7_MONEY_TRANSACTIONS', outcome: 'G7.MONEY.e', rung: 2, form: 'table',
    draw: () => {
      const items = ['kg of sugar', 'loaf of bread', 'litre of milk', 'kg of rice'].sort(() => Math.random() - 0.5).slice(0, 3);
      const rows = items.map(it => ({ it, q: randInt(1, 4), pr: price(it) })); const t = rows.reduce((a, r) => a + r.q * r.pr, 0); const note = [500, 1000, 2000].find(x => x > t);
      return note && uniq(t, rows.reduce((a, r) => a + r.pr, 0), note - rows.reduce((a, r) => a + r.pr, 0)) ? { rows, t, note, p: person() } : null;
    },
    make: ({ rows, t, note, p }) => ({
      question: `This receipt is from a shop. ${p.name} pays with a ${sh(note)} note. How much change does ${p.she} get, in shillings?`,
      model: { type: 'table', data: { head: ['Item', 'Number', 'Price each (sh)'], rows: rows.map(r => ({ cells: [r.it.replace('kg of ', '').replace('litre of ', 'milk ').replace('loaf of bread', 'bread'), String(r.q), String(r.pr)] })) } },
      answer: note - t,
      wrong: [[note - rows.reduce((a, r) => a + r.pr, 0), 'The receipt shows how many of each item were bought. Multiply price by number.'], [t, 'That is the total bill. Change is what is left from the note.'], [note + t, 'Change is what is left after paying the bill, so take away.']],
      hints: ['Find the cost of each line: number × price each.', 'Add the lines, then take the total from the note.'],
      steps: [rows.map(r => `${r.q} × ${r.pr} = ${r.q * r.pr}`).join(', ') + '.', `Total = ${sh(t)}. Change = ${sh(note)} − ${sh(t)} = ${sh(note - t)}.`],
    }),
    check: ({ rows, note }, a) => note - a === rows.reduce((s, r) => s + r.q * r.pr, 0) }),
  fam({ id: 'g7.money.kplc-tokens', skill: 'G7_MONEY_TRANSACTIONS', outcome: 'G7.MONEY.e', rung: 2, form: 'word',
    draw: () => { const S = pick([500, 1000, 1500, 2000]), C = pick([50, 100, 150, 200]), u = pick([20, 25, 30, 35, 40]); const n = (S - C) / u; return Number.isInteger(n) && uniq(n, S / u, S - C, C / u) ? { S, C, u, n, p: person() } : null; },
    make: ({ S, C, u, n, p }) => ({
      question: `${p.name} buys KPLC tokens for ${sh(S)}. In this question, ${sh(C)} goes on charges first, and the rest buys units at ${sh(u)} a unit. How many units does ${p.she} get?`,
      answer: n,
      wrong: [[round(S / u, 2), `The charges of ${sh(C)} are taken first. Only the rest buys units.`], [S - C, 'That is the money left for units. Divide it by the price of one unit.'], [round(C / u, 2), 'The units are bought with the money left after the charges, not with the charges.']],
      hints: ['How much money is left after the charges?', 'Divide that money by the price of one unit.'],
      steps: [`Money for units = ${sh(S)} − ${sh(C)} = ${sh(S - C)}.`, `Units = ${S - C} ÷ ${u} = ${n}.`],
    }),
    check: ({ S, C, u }, a) => a * u + C === S }),
  fam({ id: 'g7.money.parcels-table', skill: 'G7_MONEY_TRANSACTIONS', outcome: 'G7.MONEY.g', rung: 2, form: 'table',
    draw: () => {
      const ch = [pick([100, 120, 150]), pick([180, 200, 220]), pick([300, 350, 400]), pick([550, 600, 650])];
      const bandsMass = [[200, 300, 400], [600, 700, 800, 900], [1200, 1500, 1800], [2500, 3000, 4000]];
      const bi = shuffle([0, 1, 2, 3]).slice(0, 3).sort((x, y) => x - y); const ms = bi.map(i => pick(bandsMass[i]));
      const band = (m) => (m <= 500 ? 0 : m <= 1000 ? 1 : m <= 2000 ? 2 : 3); const tot = ms.reduce((a, b) => a + b, 0);
      if (tot > 5000) return null;
      const ans = ms.reduce((a, m) => a + ch[band(m)], 0), one = ch[band(tot)], top = 3 * ch[Math.max(...ms.map(band))];
      return uniq(ans, one, top) ? { ch, ms, ans, one, top, p: person() } : null;
    },
    make: ({ ch, ms, ans, one, top, p }) => {
      const say = (m) => (m >= 1000 ? `${m / 1000} kg` : `${m} g`);
      return { question: `The table shows the charges at a post office in this question. ${p.name} posts three parcels, one after the other, of ${say(ms[0])}, ${say(ms[1])} and ${say(ms[2])}. What is the total postage, in shillings?`,
        model: { type: 'table', data: { head: ['Mass of one parcel', 'Postage (sh)'], rows: [{ label: 'Up to 500 g', value: String(ch[0]) }, { label: 'Over 500 g, up to 1 kg', value: String(ch[1]) }, { label: 'Over 1 kg, up to 2 kg', value: String(ch[2]) }, { label: 'Over 2 kg, up to 5 kg', value: String(ch[3]) }] } },
        answer: ans,
        wrong: [[one, 'The parcels are posted separately. Each parcel is charged by its own mass.'], [top, 'Each parcel has its own charge. They do not all cost the same as the heaviest.'], [ans + ch[0], 'There are only three parcels, so only three charges are added.']],
        hints: ['Find the row for each parcel by its own mass.', 'Add the three charges.'],
        steps: ms.map((m) => `${say(m)}: look up its row in the table.`).concat([`Total of the three charges = ${sh(ans)}.`]) };
    },
    check: ({ ans, ch, ms }, a) => a === ms.reduce((s, m) => s + ch[m <= 500 ? 0 : m <= 1000 ? 1 : m <= 2000 ? 2 : 3], 0) }),
  fam({ id: 'g7.money.parcel-per-100g', skill: 'G7_MONEY_TRANSACTIONS', outcome: 'G7.MONEY.g', rung: 2, form: 'word',
    draw: () => { const F = pick([60, 80, 100]), E = pick([20, 30, 40]), k = randInt(4, 12); return uniq(F + E * (k - 1), k * E, k * F, F + E * k) ? { F, E, k, p: person() } : null; },
    make: ({ F, E, k, p }) => ({
      question: `In this question, a courier's postal charges are these. A parcel costs ${sh(F)} for the first 100 g, and ${sh(E)} for each extra 100 g. ${p.name} posts a parcel of ${k * 100} g. What does the postage cost, in shillings?`,
      answer: F + E * (k - 1),
      wrong: [[k * E, 'The first 100 g has its own charge. Add it.'], [k * F, 'Only the first 100 g costs that much. The rest costs less per 100 g.'], [F + E * k, 'The first 100 g is not an extra part. Count one fewer extra part.']],
      hints: [`How many 100 g parts are there in ${k * 100} g?`, 'The first part is charged at the first price. All the others are charged at the extra price.'],
      steps: [`${k * 100} g is ${k} lots of 100 g. The first costs ${sh(F)}, and ${k - 1} are extra.`, `Postage = ${F} + ${k - 1} × ${E} = ${sh(F + E * (k - 1))}.`],
    }),
    check: ({ F, E, k }, a) => (a - F) / E === k - 1 }),
  fam({ id: 'g7.money.mobile-two-sends', skill: 'G7_MONEY_TRANSACTIONS', outcome: 'G7.MONEY.h', rung: 2, form: 'table',
    draw: () => {
      const a = pick([5, 7, 10]), b = a + pick([3, 5, 8]), c = b + pick([8, 10, 15]), ch = [0, a, b, c], edges = [100, 500, 1000, 2500];
      const band = (x) => (x <= 100 ? 0 : x <= 500 ? 1 : x <= 1000 ? 2 : 3);
      const X = pick([250, 400, 700, 900]), Y = pick([1200, 1500, 2000, 300]);
      if (band(X) === band(Y) || X + Y > 2500) return null;
      const ans = ch[band(X)] + ch[band(Y)], comb = ch[band(X + Y)];
      return uniq(ans, comb, ch[band(Math.max(X, Y))]) ? { ch, X, Y, ans, comb, big: ch[band(Math.max(X, Y))], p: person(), band } : null;
    },
    make: ({ ch, X, Y, ans, comb, big, p }) => ({
      question: `The table shows one mobile money agent's charges for sending money, for this question only. ${p.name} sends ${sh(X)} to an aunt, and later ${sh(Y)} to a friend. How much is paid in charges altogether?`,
      model: { type: 'table', data: { head: ['Amount sent (sh)', 'Charge (sh)'], rows: [{ label: '1 to 100', value: String(ch[0]) }, { label: '101 to 500', value: String(ch[1]) }, { label: '501 to 1,000', value: String(ch[2]) }, { label: '1,001 to 2,500', value: String(ch[3]) }] } },
      answer: ans,
      wrong: [[comb, 'These are two separate sends. Each send has its own charge.'], [big, 'There are two sends, so there are two charges to add.'], [ans + ch[1], 'Only two sends were made, so add only two charges.']],
      hints: ['Find the row for each amount separately.', 'Add the two charges.'],
      steps: [`${sh(X)} is in its own row, and ${sh(Y)} is in another row of the table.`, `Total charge = ${sh(ans)}.`],
    }),
    check: ({ ch, X, Y, ans, band }, a) => a === ch[band(X)] + ch[band(Y)] }),
  fam({ id: 'g7.money.mobile-withdraw-left', skill: 'G7_MONEY_TRANSACTIONS', outcome: 'G7.MONEY.h', rung: 2, form: 'table',
    draw: () => {
      const ch = [pick([10, 11]), pick([25, 27, 29]), pick([30, 32, 34]), pick([40, 43, 45]), pick([55, 60, 65])];
      const W = pick([80, 300, 700, 1200, 2000]); const band = (x) => (x <= 100 ? 0 : x <= 500 ? 1 : x <= 1000 ? 2 : x <= 1500 ? 3 : 4);
      const B = Math.ceil((W + ch[band(W)] + 100) / 500) * 500 + pick([0, 500, 1000]);
      return { ch, W, B, c: ch[band(W)], p: person() };
    },
    make: ({ ch, W, B, c, p }) => ({
      question: `${p.name} has ${sh(B)} in a mobile money account and takes out ${sh(W)} cash from an agent. The agent's charge is in the table, which is only an example and not a real price list. The charge is also taken from the account. How much money stays in the account, in shillings?`,
      model: { type: 'table', data: { head: ['Amount withdrawn (sh)', 'Charge (sh)'], rows: [{ label: '1 to 100', value: String(ch[0]) }, { label: '101 to 500', value: String(ch[1]) }, { label: '501 to 1,000', value: String(ch[2]) }, { label: '1,001 to 1,500', value: String(ch[3]) }, { label: '1,501 to 2,500', value: String(ch[4]) }] } },
      answer: B - W - c,
      wrong: [[B - W, 'The charge also comes out of the account. Find it in the table.'], [B - c, 'The money withdrawn also leaves the account.'], [W - c, 'Start from what was in the account, not from the amount withdrawn.']],
      hints: [`Which row of the table does ${sh(W)} fall in?`, 'Take the money withdrawn and the charge away from the amount in the account.'],
      steps: [`The charge for ${sh(W)} is ${sh(c)}.`, `Left = ${sh(B)} − ${sh(W)} − ${sh(c)} = ${sh(B - W - c)}.`],
    }),
    check: ({ B, W, c }, a) => a + W + c === B }),
];
