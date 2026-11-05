// ============================================================================
// GRADE 9 NUMBERS AND ALGEBRA: new question families (unreviewed).
// Integers, cubes and cube roots, indices and logarithms, compound proportion
// and rates of work, matrices, straight lines, linear inequalities.
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family, round, commas } from './core.js';
import { person, twoPeople, sh, price } from './kenya.js';

const fam = (def) => family({ reviewed: false, ...def });

// A signed number written with a true minus sign.
const fm = (n) => (n < 0 ? `−${-n}` : `${n}`);
// The same, in brackets when negative: 4 + (−3).
const br = (n) => (n < 0 ? `(−${-n})` : `${n}`);
const uniq = (...v) => new Set(v).size === v.length;
const isCube = (n) => { const r = Math.round(Math.cbrt(n)); return r * r * r === n; };
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (a, b) => (a / gcd(a, b)) * b;
const factorise = (n) => { const f = {}; let m = n; for (let p = 2; p * p <= m; p++) while (m % p === 0) { f[p] = (f[p] || 0) + 1; m /= p; } if (m > 1) f[m] = (f[m] || 0) + 1; return f; };
const cubeOf = (x100) => Number(((x100 ** 3) / 1e6).toPrecision(4));
const rootOf = (x100) => Number(Math.cbrt(x100 / 100).toPrecision(4));
const cell = (v) => v.toPrecision(4);

// ---------------------------------------------------------------- INTEGERS
const INTEGERS = [
  fam({ id: 'g9.int.lift-basement', skill: 'G9_INTEGERS_COMBINED', outcome: 'G9.INTEGERS.c', rung: 2, form: 'word', allowNegative: true,
    draw: () => { const s = randInt(2, 4), u = randInt(4, 9), dn = randInt(5, 10); const a = -s + u - dn; return uniq(a, s + u - dn, -s + u + dn, -(s + u - dn)) && a !== -s ? { s, u, dn } : null; },
    make: ({ s, u, dn }) => ({
      question: `A lift in a Nairobi building starts at floor −${s}. Floor 0 is the ground floor. Floors below it have negative numbers. The lift goes up ${u} floors, then down ${dn} floors. At which floor does it stop?`,
      answer: -s + u - dn,
      wrong: [[s + u - dn, `The lift starts below the ground floor, so it starts at a negative number, not a positive one.`], [-s + u + dn, 'Going down makes the floor number smaller. Take the floors away.'], [-(s + u - dn), 'Count the moves one by one from the starting floor. Do not change the sign at the end.']],
      hints: ['Draw a vertical number line with the ground floor at 0.', 'Start at the starting floor, then move up, then move down.'],
      steps: [`Start at −${s}. Going up ${u} floors: −${s} + ${u} = ${fm(-s + u)}.`, `Going down ${dn} floors: ${fm(-s + u)} − ${dn} = ${fm(-s + u - dn)}.`],
    }),
    check: ({ s, u, dn }, a) => a + dn - u === -s }),
  fam({ id: 'g9.int.overdraft-shop', skill: 'G9_INTEGERS_COMBINED', outcome: 'G9.INTEGERS.c', rung: 2, form: 'word', allowNegative: true,
    draw: () => { const o = randInt(2, 9) * 500, p = randInt(3, 12) * 1000, q = randInt(2, 11) * 1000; const a = -o + p - q; return a !== 0 && uniq(a, o + p - q, -o + p + q, p - q) ? { o, p, q, who: person() } : null; },
    make: ({ o, p, q, who }) => ({
      question: `The bank balance of ${who.name}'s shop is −${sh(o)}. This means the account is overdrawn: the shop owes the bank ${sh(o)}. ${who.She} pays in ${sh(p)}. Then ${who.she} pays out ${sh(q)} for stock. What is the balance now? Write a negative number if the account is still overdrawn.`,
      answer: -o + p - q,
      wrong: [[o + p - q, 'The account started overdrawn. That is a negative number, not money in the bank.'], [-o + p + q, 'Paying out lowers the balance. It does not raise it.'], [p - q, 'The overdraft did not disappear. It was already part of the balance at the start.']],
      hints: ['Start from the negative balance.', 'Paying in adds. Paying out takes away.'],
      steps: [`After paying in: −${commas(o)} + ${commas(p)} = ${fm(-o + p)}.`, `After paying out: ${fm(-o + p)} − ${commas(q)} = ${fm(-o + p - q)}.`],
    }),
    check: ({ o, p, q }, a) => a + q - p + o === 0 }),
  fam({ id: 'g9.int.altitude-table', skill: 'G9_INTEGERS_COMBINED', outcome: 'G9.INTEGERS.c', rung: 2, form: 'table',
    draw: () => {
      const rows = [['Hilltop viewpoint', randInt(2, 6) * 100], ['Kite in the air', randInt(2, 5) * 10 + 500], ['Diver in a dam', -randInt(1, 4) * 10], ['Borehole bottom', -randInt(5, 12) * 10], ['Salt mine floor', -randInt(15, 30) * 10]];
      const take = rows.sort(() => Math.random() - 0.5).slice(0, 4);
      const v = take.map(r => r[1]); const hi = Math.max(...v), lo = Math.min(...v);
      return hi > 0 && lo < 0 && uniq(hi - lo, hi + lo, Math.abs(lo), hi) && v.filter(x => x === hi).length === 1 && v.filter(x => x === lo).length === 1 ? { take, hi, lo } : null;
    },
    make: ({ take, hi, lo }) => ({
      question: 'The table shows the altitude of four places in metres above sea level. A negative altitude means below sea level. How many metres higher is the highest place than the lowest place?',
      model: { type: 'table', data: { head: ['Place', 'Altitude (m)'], rows: take.map(([label, v]) => ({ label, value: fm(v) })) } },
      answer: hi - lo,
      wrong: [[hi + lo, 'The lowest place is below sea level. Its distance below zero adds to the height above zero.'], [Math.abs(lo), 'That is only the depth of the lowest place below sea level. Add the height above it.'], [hi, 'That is the altitude of the highest place alone. The question asks for the gap between two places.']],
      hints: ['Find the largest and the smallest altitude in the table.', 'Count from the lowest altitude up to 0, then from 0 up to the highest.'],
      steps: [`Highest: ${hi} m. Lowest: ${fm(lo)} m.`, `Gap: ${hi} − (${fm(lo)}) = ${hi} + ${-lo} = ${hi - lo} m.`],
    }),
    check: ({ hi, lo }, a) => lo + a === hi, allowNegative: false }),
  fam({ id: 'g9.int.spot-minus-negative', skill: 'G9_INTEGERS_COMBINED', outcome: 'G9.INTEGERS.b', rung: 2, form: 'spot',
    draw: () => ({ x: randInt(2, 9), y: randInt(2, 8), z: randInt(2, 6), type: pick(['product', 'rewrite', 'arith']), who: person() }),
    make: ({ x, y, z, type, who }) => {
      const P = type === 'product' ? y * z : -y * z;
      const Q = type === 'rewrite' ? P : -P;
      const V = type === 'arith' ? Q - x : x + Q;
      const s2 = `${x} − (${fm(P)}) = ${x} ${Q < 0 ? '−' : '+'} ${Math.abs(Q)}`;
      const working = [
        { text: `(−${y}) × ${z} = ${fm(P)}`, ok: P === -y * z },
        { text: s2, ok: Q === -P },
        { text: `${x} ${Q < 0 ? '−' : '+'} ${Math.abs(Q)} = ${fm(V)}`, ok: V === x + Q },
      ];
      const fix = { product: 'A negative number times a positive number is negative, so the product in Step 1 is negative.', rewrite: 'Subtracting a negative number is the same as adding its positive. The sign in Step 2 should change to plus.', arith: `In Step 3 the sum ${x} ${Q < 0 ? '−' : '+'} ${Math.abs(Q)} was worked out the wrong way round.` }[type];
      return { question: `${who.name} worked out ${x} − (−${y}) × ${z}. Which step has the mistake?`, working, fix,
        steps: [`Multiply first: (−${y}) × ${z} = −${y * z}.`, `${x} − (−${y * z}) = ${x} + ${y * z}.`, `${x} + ${y * z} = ${x + y * z}.`] };
    } }),
  fam({ id: 'g9.int.why-order', skill: 'G9_INTEGERS_COMBINED', outcome: 'G9.INTEGERS.b', rung: 2, form: 'why',
    draw: () => { const a = randInt(3, 9), b = randInt(2, 6), c = randInt(2, 5); return a !== b && uniq(a + b * c, (a - b) * -c) ? { a, b, c, who: person() } : null; },
    make: ({ a, b, c, who }) => ({
      question: `${who.name} worked out ${a} − ${b} × (−${c}) and got ${fm((a - b) * -c)}. ${who.She} did ${a} − ${b} first, which is ${fm(a - b)}. Then ${who.she} did ${fm(a - b)} × (−${c}). Why is this wrong?`,
      options: [
        { text: `Multiplication comes before subtraction: ${a} − (−${b * c}) = ${a + b * c}`, right: true },
        { text: 'Nothing is wrong. Operations are always done from left to right', right: false, why: 'Left to right applies only to operations of the same rank. Multiplication ranks above subtraction.' },
        { text: `The sign of the last answer is wrong. A negative number times a positive number is positive`, right: false, why: 'A negative number times a positive number is negative. The problem is the order of the steps.' },
        { text: 'The negative sign means the subtraction must be done last, as an addition of all the numbers', right: false, why: 'A negative sign does not change the order of operations.' },
      ],
      hints: ['Which operation ranks higher: multiplication or subtraction?', 'Do that one first, then use what is left.'],
      steps: [`Multiplication first: ${b} × (−${c}) = −${b * c}.`, `Then ${a} − (−${b * c}) = ${a} + ${b * c} = ${a + b * c}.`],
    }) }),
  fam({ id: 'g9.int.steps-brackets', skill: 'G9_INTEGERS_COMBINED', outcome: 'G9.INTEGERS.b', rung: 2, form: 'steps',
    draw: () => { const a = randInt(1, 9), b = randInt(1, 9), c = randInt(2, 6), e = randInt(2, 5), d = e * randInt(2, 6); const A = -a + b; return A !== 0 && uniq(A, A * -c) ? { a, b, c, d, e, A } : null; },
    make: ({ a, b, c, d, e, A }) => {
      const prod = A * -c, quo = d / -e, res = prod - quo;
      return {
        question: `A learner must find the value of (−${a} + ${b}) × (−${c}) − ${d} ÷ (−${e}). Follow the steps below.`,
        parts: [
          { prompt: `What is (−${a} + ${b})?`, answer: A, hint: 'Brackets first. Start at −' + a + ' and add ' + b + '.', wrong: [[-a - b, 'Adding a positive number moves up the number line, not down.'], [Math.abs(A), 'Check the sign. Which of the two numbers is larger, and is it positive?']] },
          { prompt: `Now work out ${fm(A)} × (−${c}).`, answer: prod, hint: 'Same signs give a positive answer. Different signs give a negative answer.', wrong: [[-prod, 'Check the rule for the sign of a product.'], [A - c, 'The sign × means multiply, not subtract.']] },
          { prompt: `Work out ${d} ÷ (−${e}).`, answer: quo, hint: 'A positive number divided by a negative number gives a negative answer.', wrong: [[d / e, 'A positive divided by a negative is negative.'], [-d * e, 'This is a division. Divide, do not multiply.']] },
          { prompt: `Finish: ${fm(prod)} − (${fm(quo)}).`, answer: res, hint: 'Subtracting a negative number is the same as adding its positive.', wrong: [[prod + quo, 'You subtracted a negative number. That is like adding.'], [-prod + quo, 'Check the signs again.']] },
        ],
        steps: [`(−${a} + ${b}) = ${fm(A)}.`, `${fm(A)} × (−${c}) = ${fm(prod)} and ${d} ÷ (−${e}) = ${fm(quo)}.`, `${fm(prod)} − (${fm(quo)}) = ${fm(prod)} + ${-quo} = ${fm(res)}.`],
      };
    },
    check: ({ a, b, c, d, e }, v) => v[0] === b - a && v[1] === v[0] * -c && v[2] * -e === d && v[3] + v[2] === v[1] }),
];

// ---------------------------------------------------------------- CUBES
function cubeTable(t, fn) {
  // three rows of tenths (t-1, t, t+1), columns for hundredths 0 to 5
  const head = ['n', '0', '1', '2', '3', '4', '5'];
  const rows = [t - 1, t, t + 1].map(r => ({ cells: [(r / 10).toFixed(1), ...[0, 1, 2, 3, 4, 5].map(c => cell(fn(r * 10 + c)))] }));
  return { head, rows };
}

const CUBES = [
  fam({ id: 'g9.cubes.spot-negative', skill: 'G8_CUBES_CUBE_ROOTS', outcome: 'G9.CUBES.a', rung: 2, form: 'spot',
    draw: () => { const n = randInt(2, 7), type = pick(['sq-sign', 'sign-slip', 'arith']); return type === 'arith' && n === 2 ? null : { n, type, who: person() }; },
    make: ({ n, type, who }) => {
      const v1 = type === 'sq-sign' ? -n * n : type === 'arith' ? 2 * n : n * n;
      const v2 = type === 'sign-slip' ? n ** 3 : v1 * -n;
      const working = [
        { text: `(−${n}) × (−${n}) = ${fm(v1)}`, ok: v1 === n * n },
        { text: `${fm(v1)} × (−${n}) = ${fm(v2)}`, ok: v2 === v1 * -n },
        { text: `So (−${n})³ = ${fm(v2)}`, ok: v2 === v2 },
      ];
      const fix = { 'sq-sign': 'A negative number times a negative number is positive, so Step 1 should be positive.', 'sign-slip': 'A positive number times a negative number is negative, so Step 2 should be negative.', arith: `Step 1 added ${n} and ${n}. Squaring means multiplying the number by itself.` }[type];
      return { question: `Below is ${who.name}'s working for (−${n})³. One step is wrong. Which one?`, working, fix,
        steps: [`(−${n}) × (−${n}) = ${n * n}.`, `${n * n} × (−${n}) = −${n ** 3}.`, `So (−${n})³ = −${n ** 3}.`] };
    } }),
  fam({ id: 'g9.cubes.steps-decimal', skill: 'G8_CUBES_CUBE_ROOTS', outcome: 'G9.CUBES.a', rung: 2, form: 'steps',
    draw: () => ({ n: pick([1.1, 1.2, 1.3, 1.4, 1.5, 2.5]) }),
    make: ({ n }) => {
      const sq = round(n * n, 4), cu = round(sq * n, 6);
      return {
        question: `Work out the cube of ${n}, written ${n}³, in steps.`,
        parts: [
          { prompt: `What is ${n} × ${n}?`, answer: sq, hint: 'Multiply as if there were no decimal points, then count the decimal places.', wrong: [[round(2 * n, 2), 'That adds the number to itself. Squaring means multiplying it by itself.']] },
          { prompt: `Now multiply that answer by ${n} again. What is ${n}³?`, answer: cu, hint: 'Take the answer from the first part and multiply by the same number once more.', wrong: [[round(3 * n, 2), 'A cube is the number multiplied by itself three times, not added three times.'], [round(sq * 2, 3), 'That multiplies by 2. Multiply by the number itself.']] },
          { prompt: `How much bigger is ${n}³ than ${n} × ${n}?`, answer: round(cu - sq, 6), hint: 'Subtract the answer to part 1 from the answer to part 2.', wrong: [[cu, 'That is the cube itself. Take away the square.']] },
        ],
        steps: [`${n} × ${n} = ${sq}.`, `${sq} × ${n} = ${cu}.`, `${cu} − ${sq} = ${round(cu - sq, 6)}.`],
      };
    },
    check: ({ n }, v) => Math.abs(v[0] * n - v[1]) < 1e-9 && Math.abs(v[1] - v[0] - v[2]) < 1e-9 }),
  fam({ id: 'g9.cubes.which-cube', skill: 'G8_CUBES_CUBE_ROOTS', outcome: 'G9.CUBES.a', rung: 2, form: 'direct',
    draw: () => { const c = randInt(3, 9), s = randInt(6, 15), t = randInt(4, 12); const o = [c ** 3, s * s, 3 * (s + 5), c ** 3 + 1]; return uniq(...o, c ** 3 - 1) && !isCube(s * s) && !isCube(3 * (s + 5)) && !isCube(c ** 3 + 1) && t ? { c, s } : null; },
    make: ({ c, s }) => {
      const o = [{ text: String(c ** 3), right: true }, { text: String(s * s), right: false, why: `That is ${s} × ${s}, a square number. A cube is a number multiplied by itself three times.` }, { text: String(3 * (s + 5)), right: false, why: 'Try to write it as a number multiplied by itself three times. It cannot be done.' }, { text: String(c ** 3 + 1), right: false, why: 'This is one more than a cube number, so it is not a cube itself.' }];
      return { question: `Which of ${o.map(x => x.text).sort((a, b) => a - b).join(', ')} is a cube number?`, story: false, options: o.sort(() => Math.random() - 0.5),
        hints: ['A cube number is a whole number multiplied by itself three times.', 'Try the cubes you know, such as 8, 27 and 64.'],
        steps: [`${c} × ${c} × ${c} = ${c ** 3}.`, `So ${c ** 3} is a cube number. The others are not.`] };
    } }),
  fam({ id: 'g9.cubes.table-read', skill: 'G8_CUBES_CUBE_ROOTS', outcome: 'G9.CUBES.b', rung: 1, form: 'table',
    draw: () => { const t = randInt(21, 88), c = randInt(1, 5); return { t, c }; },
    make: ({ t, c }) => {
      const x100 = t * 10 + c, tb = cubeTable(t, cubeOf);
      const val = cubeOf(x100), nearC = cubeOf(x100 + (c === 5 ? -1 : 1)), nearR = cubeOf(x100 - 10);
      return { question: `The table lists cubes to 4 significant figures. A learner needs ${(x100 / 100).toFixed(2)}³. Which number does the table give, in row ${(t / 10).toFixed(1)} and column ${c}?`,
        model: { type: 'table', data: tb },
        answer: val,
        wrong: [[nearC, 'That is the cube of the number next to it. Check the column heading carefully.'], [nearR, 'That is in the row above. Read the row that matches the first two digits.'], [round((x100 / 100) * 3, 2), 'The cube is the number multiplied by itself three times. Do not multiply by 3.']],
        hints: ['The row gives the number to one decimal place.', 'The column gives the second decimal place.'],
        steps: [`${(x100 / 100).toFixed(2)} is in row ${(t / 10).toFixed(1)} and column ${c}.`, `The table gives ${cell(val)}.`] };
    },
    check: ({ t, c }, a) => Math.abs(a - ((t * 10 + c) / 100) ** 3) < 0.0006 * ((t * 10 + c) / 100) ** 3 }),
  fam({ id: 'g9.cubes.table-scale', skill: 'G8_CUBES_CUBE_ROOTS', outcome: 'G9.CUBES.b', rung: 3, form: 'table',
    draw: () => ({ t: randInt(21, 88), big: Math.random() < 0.5 }),
    make: ({ t, big }) => {
      const x = t / 10, tb = cubeTable(t, cubeOf), base = cubeOf(t * 10);
      const x2 = big ? t : t * 10, f = big ? 1000 : 1000000;
      const ans = round(base * f, 0);
      return { question: `A table lists cubes of numbers from 1 to 10. Take ${x}³ from it and use ${commas(x2)} = ${x} × ${big ? '10' : '100'} to find ${commas(x2)}³. Give the answer to 4 significant figures.`,
        model: { type: 'table', data: tb },
        answer: ans,
        wrong: [[round(base * f / 10, 0), 'A change of 10 in the number changes the cube by 10 × 10 × 10. Count all three factors.'], [round(x2 * 3, 0), 'A cube is the number multiplied by itself three times. Do not multiply by 3.'], [base, `The table value is for ${x}³. Now adjust for the change from ${x} to ${commas(x2)}.`]],
        hints: [`${commas(x2)} is ${big ? '10 times' : '100 times'} ${x}.`, `If a number is multiplied by ${big ? '10' : '100'}, its cube is multiplied by ${big ? '10' : '100'} three times.`],
        steps: [`From the table, ${x}³ = ${cell(base)}.`, `${commas(x2)} = ${x} × ${big ? '10' : '100'}, so the cube is multiplied by ${commas(f)}.`, `${commas(x2)}³ = ${commas(ans)}.`] };
    },
    check: ({ t, big }, a) => { const n = big ? t : t * 10; return Math.abs(a - n ** 3) < 0.001 * n ** 3; } }),
  fam({ id: 'g9.cubes.factor-steps', skill: 'G8_CUBES_CUBE_ROOTS', outcome: 'G9.CUBES.c', rung: 2, form: 'steps',
    draw: () => { const m = pick([6, 10, 12, 15, 18, 20, 36, 45]); return { m, N: m ** 3 }; },
    make: ({ m, N }) => {
      const f = factorise(m), ps = Object.keys(f).map(Number);
      const [p1, p2] = ps;
      return { question: `Find the cube root of ${commas(N)} by the prime factor method.`,
        parts: [
          { prompt: `When ${commas(N)} is written as a product of prime factors, how many times does ${p1} appear?`, answer: 3 * f[p1], hint: `Divide ${commas(N)} by ${p1} again and again until it no longer divides exactly.`, wrong: [[f[p1], 'That counts the factors of the cube root. The cube has three times as many.']] },
          { prompt: `How many times does ${p2} appear?`, answer: 3 * f[p2], hint: `After removing the ${p1}s, divide by ${p2} again and again.`, wrong: [[f[p2], 'That counts the factors of the cube root. The cube has three times as many.']] },
          { prompt: `Put the factors in groups of three and take one from each group. What is the cube root of ${commas(N)}?`, answer: m, hint: `Multiply ${p1} by itself ${f[p1]} time${f[p1] > 1 ? 's' : ''}, and ${p2} by itself ${f[p2]} time${f[p2] > 1 ? 's' : ''}, then multiply the two results.`, wrong: [[N / 3, 'Dividing by 3 does not give a cube root.'], [p1 * p2, 'Each prime must be used once for every group of three it has.']] },
        ],
        steps: [`${commas(N)} = ${p1}^${3 * f[p1]} × ${p2}^${3 * f[p2]}.`, `One factor from each group of three: ${p1}^${f[p1]} × ${p2}^${f[p2]}.`, `So the cube root is ${m}.`] };
    },
    check: ({ m, N }, v) => { const ps = Object.keys(factorise(m)).map(Number); return v[2] ** 3 === N && ps[0] ** v[0] * ps[1] ** v[1] === N; } }),
  fam({ id: 'g9.cubes.factor-spot', skill: 'G8_CUBES_CUBE_ROOTS', outcome: 'G9.CUBES.c', rung: 3, form: 'spot',
    draw: () => { const pair = pick([[2, 3], [2, 5], [3, 5], [2, 7], [3, 7]]); return { p: pair[0], q: pair[1], type: pick(['groups', 'add']), who: person() }; },
    make: ({ p, q, type, who }) => {
      const N = (p * q) ** 3;
      const pick3 = type === 'groups' ? [p ** 3, q ** 3] : [p, q];
      const prod = pick3[0] * pick3[1];
      const final = type === 'add' ? p + q : prod;
      const working = [
        { text: `${commas(N)} = ${p}×${p}×${p}×${q}×${q}×${q}`, ok: p ** 3 * q ** 3 === N },
        { text: `Groups of three: (${p}×${p}×${p}) and (${q}×${q}×${q})`, ok: true },
        { text: `Take one number from each group: ${pick3[0]} and ${pick3[1]}`, ok: pick3[0] === p && pick3[1] === q },
        { text: `${type === 'add' ? `${pick3[0]} + ${pick3[1]}` : `${pick3[0]} × ${pick3[1]}`} = ${final}. The cube root is ${final}`, ok: final === pick3[0] * pick3[1] },
      ];
      const fix = type === 'groups' ? 'In Step 3 the whole group was taken. Take just one factor from each group of three.' : 'In Step 4 the two numbers were added. The cube root is found by multiplying the numbers taken from each group.';
      return { question: `${who.name} used prime factors to find ∛${commas(N)}. One step of the working is wrong. Which one?`, working, fix,
        steps: [`One factor from each group: ${p} and ${q}.`, `${p} × ${q} = ${p * q}, so the cube root of ${commas(N)} is ${p * q}.`] };
    } }),
  fam({ id: 'g9.cubes.smallest-multiplier', skill: 'G8_CUBES_CUBE_ROOTS', outcome: 'G9.CUBES.c', rung: 3, form: 'direct',
    draw: () => { const N = pick([12, 18, 20, 24, 36, 40, 45, 50, 54, 72, 75, 98, 100, 108, 135, 150, 200, 225]); const f = factorise(N); let a = 1; for (const [p, e] of Object.entries(f)) a *= Number(p) ** ((3 - (e % 3)) % 3); const distinct = Object.keys(f).reduce((s, p) => s * Number(p), 1); let sq = 1; for (const [p, e] of Object.entries(f)) sq *= Number(p) ** (e % 2); return a > 1 && uniq(a, distinct, N, sq) ? { N, a, distinct, sq } : null; },
    make: ({ N, a, distinct, sq }) => ({
      question: `Use prime factors to find the smallest whole number that ${N} must be multiplied by to give a perfect cube.`, story: false,
      answer: a,
      wrong: [[distinct, 'Multiplying by each prime factor once does not always make groups of three. Count how many of each prime are missing.'], [N, `${N} × ${N} is not a cube. Check how many of each prime factor you now have.`], [sq, 'That is what makes a perfect square. A cube needs every prime factor to appear in groups of three.']],
      hints: ['Write the number as a product of prime factors.', 'Each prime factor must appear a multiple of three times. How many more of each do you need?'],
      steps: [`${N} = ${Object.entries(factorise(N)).map(([p, e]) => `${p}^${e}`).join(' × ')}.`, `Each power must become a multiple of 3. Multiply by ${a}.`],
    }),
    check: ({ N }, a) => isCube(N * a) && ![...Array(a - 1).keys()].some(i => isCube(N * (i + 1))) }),
  fam({ id: 'g9.cubes.root-table-read', skill: 'G8_CUBES_CUBE_ROOTS', outcome: 'G9.CUBES.d', rung: 1, form: 'table',
    draw: () => ({ t: randInt(21, 88), c: randInt(1, 5) }),
    make: ({ t, c }) => {
      const x100 = t * 10 + c, val = rootOf(x100);
      return { question: `From the table of cube roots, write down ∛${(x100 / 100).toFixed(2)}. Use row ${(t / 10).toFixed(1)}, column ${c}.`,
        model: { type: 'table', data: cubeTable(t, rootOf) },
        answer: val,
        wrong: [[rootOf(x100 + (c === 5 ? -1 : 1)), 'That is the cube root of the number next to it. Check the column heading.'], [rootOf(x100 - 10), 'That is in the row above. Read the row that matches the first two digits.'], [round(x100 / 300, 3), 'Dividing by 3 does not give a cube root. Read the value from the table.']],
        hints: ['Find the row that matches the number to one decimal place.', 'Then go across to the column for the second decimal place.'],
        steps: [`${(x100 / 100).toFixed(2)} is in row ${(t / 10).toFixed(1)} and column ${c}.`, `The table gives ${cell(val)}.`] };
    },
    check: ({ t, c }, a) => Math.abs(a ** 3 - (t * 10 + c) / 100) < 0.004 * (t * 10 + c) / 100 }),
  fam({ id: 'g9.cubes.root-table-scale', skill: 'G8_CUBES_CUBE_ROOTS', outcome: 'G9.CUBES.d', rung: 3, form: 'table',
    draw: () => ({ t: randInt(21, 88), kind: pick(['k1000', 'k1000000']) }),
    make: ({ t, kind }) => {
      const x = t / 10, base = rootOf(t * 10), big = kind === 'k1000';
      const n = big ? t * 100 : t * 100000;
      const ans = round(base * (big ? 10 : 100), 3);
      const wrongSame = round(base * (big ? 100 : 10), 3);
      return { question: `Cube roots are tabled only for numbers from 1 to 10. Write ${commas(n)} as ${x} × ${big ? '1,000' : '1,000,000'} and use the table to find its cube root, to 4 significant figures.`,
        model: { type: 'table', data: cubeTable(t, rootOf) },
        answer: ans,
        wrong: [[wrongSame, 'Check the power of 10. The cube root of 1,000 is 10, and the cube root of 1,000,000 is 100.'], [base, `The table value is for ${x}. Now adjust for the factor of ${big ? '1,000' : '1,000,000'}.`], [round(n / 3, 2), 'Dividing by 3 does not give a cube root.']],
        hints: [`Find the cube root of ${x} in the table first.`, `Then take the cube root of ${big ? '1,000' : '1,000,000'} and multiply the two cube roots.`],
        steps: [`${commas(n)} = ${x} × ${big ? '1,000' : '1,000,000'}.`, `From the table, the cube root of ${x} is ${cell(base)}. The cube root of ${big ? '1,000' : '1,000,000'} is ${big ? '10' : '100'}.`, `${cell(base)} × ${big ? '10' : '100'} = ${commas(ans)}.`] };
    },
    check: ({ t, kind }, a) => { const n = kind === 'k1000' ? t * 100 : t * 100000; return Math.abs(a ** 3 - n) < 0.004 * n; } }),
  fam({ id: 'g9.cubes.tank-litres', skill: 'G8_CUBES_CUBE_ROOTS', outcome: 'G9.CUBES.e', rung: 2, form: 'word',
    draw: () => ({ e: pick([1.5, 2, 2.5, 3, 4]), who: person() }),
    make: ({ e, who }) => ({
      question: `${who.name}'s school has a water tank in the shape of a cube. Each edge is ${e} m long. How many litres of water can it hold? (1 m³ = 1,000 litres)`,
      answer: round(e ** 3 * 1000, 1),
      wrong: [[round(e ** 3, 3), 'That is the volume in m³. The question asks for litres.'], [round(6 * e * e * 1000, 1), 'That uses the area of the six faces. Water fills the inside, so you need the volume.'], [round(3 * e * 1000, 1), 'The volume is edge × edge × edge, not edge × 3.']],
      hints: ['The volume of a cube is edge × edge × edge.', 'Change m³ to litres at the end.'],
      steps: [`Volume = ${e} × ${e} × ${e} = ${round(e ** 3, 3)} m³.`, `Litres: ${round(e ** 3, 3)} × 1,000 = ${commas(round(e ** 3 * 1000, 1))}.`],
    }),
    check: ({ e }, a) => Math.abs(Math.cbrt(a / 1000) - e) < 1e-6 }),
  fam({ id: 'g9.cubes.carton-pack', skill: 'G8_CUBES_CUBE_ROOTS', outcome: 'G9.CUBES.e', rung: 3, form: 'word',
    draw: () => { const s = pick([4, 5, 10]), k = randInt(3, 6); return { s, k, E: s * k, what: pick(['a cube-shaped box', 'a cube-shaped carton']), who: person() }; },
    make: ({ s, k, E, what, who }) => ({
      question: `${who.name} packs small cubes of soap into ${what}. Each small cube has edge ${s} cm. The inside of the large carton is a cube with edge ${E} cm. How many small cubes fit exactly?`,
      answer: k ** 3,
      wrong: [[k, 'That is the number of cubes along one edge only. The carton has length, width and height.'], [k * k, 'That is one layer. The carton has several layers.'], [round((E ** 3) / s, 0), `Divide the volume of the carton by the volume of one small cube, ${s} × ${s} × ${s}, not by ${s}.`]],
      hints: [`How many small cubes fit along one edge of the carton?`, 'Use that number for the length, the width and the height.'],
      steps: [`Along one edge: ${E} ÷ ${s} = ${k} cubes.`, `In total: ${k} × ${k} × ${k} = ${k ** 3} cubes.`],
    }),
    check: ({ s, E }, a) => a * s ** 3 === E ** 3 }),
  fam({ id: 'g9.cubes.double-edge-why', skill: 'G8_CUBES_CUBE_ROOTS', outcome: 'G9.CUBES.e', rung: 2, form: 'why',
    draw: () => { const k = pick([2, 3]), e = randInt(2, 5); return { k, e, who: person() }; },
    make: ({ k, e, who }) => ({
      question: `A box is a cube with edge ${e} cm. A maker ${k === 2 ? 'doubles' : 'triples'} the edge of the box. ${who.name} says the volume is also ${k === 2 ? 'doubled' : 'tripled'}. Why is this wrong?`,
      options: [
        { text: `Volume uses edge × edge × edge. The new volume is ${k ** 3} times the old one`, right: true },
        { text: `The volume is ${k * k} times bigger, because volume uses edge × edge`, right: false, why: 'Edge × edge is the area of one face. Volume needs three edges.' },
        { text: `Volume does not depend on the edge of a cube`, right: false, why: 'The volume of a cube depends only on its edge.' },
        { text: `The volume becomes ${k} times bigger and then the box adds ${k} more cm`, right: false, why: 'The edge changes by a factor, so the volume changes by that factor, cubed.' },
      ],
      hints: [`Work out the volume with edge ${e} cm and with the new edge.`, 'Divide the new volume by the old volume.'],
      steps: [`Old volume: ${e}³ = ${e ** 3} cm³.`, `New volume: ${k * e}³ = ${(k * e) ** 3} cm³, which is ${k ** 3} times as much.`],
    }) }),
  fam({ id: 'g9.cubes.box-edge', skill: 'G8_CUBES_CUBE_ROOTS', outcome: 'G9.CUBES.e', rung: 1, form: 'word',
    draw: () => { const e = pick([6, 8, 9, 12, 15, 20]); return { e, V: e ** 3, who: person() }; },
    make: ({ e, V, who }) => ({
      question: `${who.name} has a box in the shape of a cube. It holds ${commas(V)} cm³ of rice. What is the length of one edge, in cm?`,
      answer: e,
      wrong: [[round(V / 3, 0), 'Dividing the volume by 3 does not give the edge. Find the number that multiplies by itself three times.'], [round(Math.sqrt(V), 1), 'A square root is for area. Volume needs a cube root.'], [round(V / 6, 0), 'Dividing by 6 is for faces. Find the number that multiplied three times gives the volume.']],
      hints: ['Volume of a cube = edge × edge × edge.', 'Which number multiplied by itself three times gives the volume? Use prime factors if needed.'],
      steps: [`edge × edge × edge = ${commas(V)}.`, `The edge is the cube root of ${commas(V)}, which is ${e} cm.`],
    }),
    check: ({ V }, a) => a * a * a === V }),
];

// @@NEXT
// ---------------------------------------------------------------- INDICES AND LOGARITHMS
const INDICES = [
  fam({ id: 'g9.ind.growth-power', skill: 'G8_INDICES_INTRO', outcome: 'G9.INDICES.a', rung: 1, form: 'word',
    draw: () => { const b = pick([2, 3, 4]), n = randInt(4, 7); return uniq(b ** n, b * n, n ** b, b ** (n - 1)) ? { b, n } : null; },
    make: ({ b, n }) => ({
      question: `A message is sent round a school WhatsApp group. In each round, every person who has it sends it to ${b - 1 === 1 ? '1 new person' : `${b - 1} new people`}. After n rounds, the number of people who have it, counting the first sender, is ${b} to the power n. How many people have it after ${n} rounds?`,
      answer: b ** n,
      wrong: [[b * n, `${b} to the power ${n} means ${b} multiplied by itself ${n} times, not ${b} times ${n}.`], [n ** b, 'The base is the number that is multiplied. The index tells how many times.'], [b ** (n - 1), 'Check the index. It is the number of rounds.']],
      hints: ['In b^n, b is the base and n is the index.', `Write ${b}^${n} as ${b} multiplied by itself ${n} times.`],
      steps: [`${b}^${n} = ${Array(n).fill(b).join(' × ')}.`, `${b}^${n} = ${commas(b ** n)}.`],
    }),
    check: ({ b, n }, a) => Math.round(Math.log(a) / Math.log(b)) === n }),
  fam({ id: 'g9.ind.zero-why', skill: 'G8_INDICES_INTRO', outcome: 'G9.INDICES.a', rung: 2, form: 'why',
    draw: () => ({ b: pick([5, 7, 9, 12]), n: randInt(2, 4), who: person() }),
    make: ({ b, n, who }) => ({
      question: `${who.name} says that ${b}^0 = 0, because the index is 0. Why is this wrong?`,
      options: [
        { text: `${b}^${n} ÷ ${b}^${n} = ${b}^(${n} − ${n}) = ${b}^0, and any number divided by itself is 1`, right: true },
        { text: `The index 0 means the base is multiplied by 0 once, so the answer is 0 but written differently`, right: false, why: 'The index does not multiply the base by anything. It counts how many times the base is multiplied.' },
        { text: `${b}^0 = ${b}, because an index of 0 leaves the number unchanged`, right: false, why: 'An index of 1 leaves the number unchanged. An index of 0 is different.' },
        { text: `${b}^0 has no value, because a number cannot be multiplied 0 times`, right: false, why: 'It does have a value. The law for dividing powers gives it one.' },
      ],
      hints: ['Divide a power by the same power, and use the law for dividing powers.', 'What is any number divided by itself?'],
      steps: [`${b}^${n} ÷ ${b}^${n} = 1, because the two are equal.`, `By the law, ${b}^${n} ÷ ${b}^${n} = ${b}^${n - n} = ${b}^0. So ${b}^0 = 1.`],
    }) }),
  fam({ id: 'g9.ind.table-powers', skill: 'G8_INDICES_INTRO', outcome: 'G9.INDICES.a', rung: 2, form: 'table',
    draw: () => { const b = pick([2, 3, 5]), max = { 2: 8, 3: 6, 5: 5 }[b], i = randInt(2, max - 2), j = randInt(2, max - i); return j >= 2 && uniq(b ** (i + j), b ** (i * j), (b * b) ** (i + j), b * (i + j)) ? { b, max, i, j } : null; },
    make: ({ b, max, i, j }) => ({
      question: `The table shows powers of ${b}. Use the law of indices to work out ${b}^${i} × ${b}^${j} by reading one value from the table.`,
      model: { type: 'table', data: { head: ['Power', 'Value'], rows: Array.from({ length: max }, (_, k) => ({ label: `${b}^${k + 1}`, value: String(b ** (k + 1)) })) } },
      answer: b ** (i + j),
      wrong: [[b ** (i * j), 'When you multiply powers of the same base, add the indices. Do not multiply them.'], [(b * b) ** (i + j), 'The base stays the same. Do not multiply the bases.'], [b * (i + j), 'The index tells how many times the base is multiplied by itself, not how many times it is added.']],
      hints: ['Powers of the same base: what do you do with the indices when you multiply?', 'Find that power in the table.'],
      steps: [`${b}^${i} × ${b}^${j} = ${b}^(${i} + ${j}) = ${b}^${i + j}.`, `The table gives ${b}^${i + j} = ${commas(b ** (i + j))}.`],
    }),
    check: ({ b, i, j }, a) => a === b ** i * b ** j }),
  fam({ id: 'g9.ind.find-index', skill: 'G8_INDICES_LAWS', outcome: 'G9.INDICES.c', rung: 2, form: 'direct',
    draw: () => {
      const kind = pick(['mul', 'div', 'pow']), b = pick([2, 3, 5, 'x', 'y']), p = randInt(2, 6), n = randInt(2, 7);
      const t = kind === 'mul' ? p + n : kind === 'div' ? n - p : n * p;
      if (kind === 'div' && n - p < 2) return null;
      const wr = kind === 'mul' ? [t + p, t * p, t] : kind === 'div' ? [t - p, t * p, t] : [t - p, t + p, t];
      return uniq(n, ...wr) ? { kind, b, p, n, t, wr } : null;
    },
    make: ({ kind, b, p, n, t, wr }) => {
      const eq = kind === 'mul' ? `${b}^n × ${b}^${p} = ${b}^${t}` : kind === 'div' ? `${b}^n ÷ ${b}^${p} = ${b}^${t}` : `(${b}^n)^${p} = ${b}^${t}`;
      const fb = { mul: ['n is the part of the index you add to p to reach the total. Take p away.', 'When powers of one base are multiplied, the indices are added, not multiplied.', 'That is the whole index on the right. Part of it comes from the other power.'], div: ['When powers are divided the indices are subtracted: n minus p gives the right-hand index.', 'When powers are divided the indices are subtracted, not multiplied.', 'That is the index on the right. Work backwards: n − p equals it.'], pow: ['For a power of a power, the indices are multiplied. Work backwards by dividing.', 'For a power of a power, the indices are multiplied, not added.', 'That is the index on the right. It is n multiplied by the outside index.'] }[kind];
      return { question: `Find the value of n:  ${eq}`, story: false,
        answer: n, wrong: wr.map((w, i) => [w, fb[i]]),
        hints: [`Which law of indices is used for ${kind === 'mul' ? 'multiplying' : kind === 'div' ? 'dividing' : 'a power of a power'}?`, 'Write an equation for the indices, then solve it.'],
        steps: [kind === 'mul' ? `n + ${p} = ${t}` : kind === 'div' ? `n − ${p} = ${t}` : `n × ${p} = ${t}`, `n = ${n}.`] };
    },
    check: ({ kind, p, n, t }, a) => (kind === 'mul' ? a + p === t : kind === 'div' ? a - p === t : a * p === t) }),
  fam({ id: 'g9.ind.spot-laws', skill: 'G8_INDICES_LAWS', outcome: 'G9.INDICES.c', rung: 3, form: 'spot',
    draw: () => {
      const a = randInt(2, 4), b = randInt(2, 4), c = randInt(2, 5), d = randInt(2, 6), type = pick(['add', 'mult', 'div']);
      const s1 = a * b, s2 = s1 + c;
      if (type === 'add' && a + b === a * b) return null;
      if (type === 'mult' && s1 * c === s1 + c) return null;
      if (type === 'div' && (s2 % d !== 0 || s2 / d === s2 - d)) return null;
      const sh1 = type === 'add' ? a + b : s1, sh2 = type === 'mult' ? sh1 * c : sh1 + c, sh3 = type === 'div' ? sh2 / d : sh2 - d;
      return sh3 > 0 ? { a, b, c, d, type, sh1, sh2, sh3, v: pick(['m', 'k', 'x', 'y']), who: person() } : null;
    },
    make: ({ a, b, c, d, type, sh1, sh2, sh3, v, who }) => {
      const working = [
        { text: `(${v}^${a})^${b} = ${v}^${sh1}`, ok: sh1 === a * b },
        { text: `${v}^${sh1} × ${v}^${c} = ${v}^${sh2}`, ok: sh2 === sh1 + c },
        { text: `${v}^${sh2} ÷ ${v}^${d} = ${v}^${sh3}`, ok: sh3 === sh2 - d },
      ];
      const fix = { add: 'For a power of a power, the indices are multiplied. Step 1 added them.', mult: 'When powers of the same base are multiplied, the indices are added. Step 2 multiplied them.', div: 'When powers of the same base are divided, the indices are subtracted. Step 3 divided them.' }[type];
      return { question: `${who.name} simplified (${v}^${a})^${b} × ${v}^${c} ÷ ${v}^${d} in three steps. One step has a mistake. Which one?`, working, fix,
        steps: [`(${v}^${a})^${b} = ${v}^${a * b}.`, `${v}^${a * b} × ${v}^${c} = ${v}^${a * b + c}.`, `${v}^${a * b + c} ÷ ${v}^${d} = ${v}^${a * b + c - d}.`] };
    } }),
  fam({ id: 'g9.ind.why-add-bases', skill: 'G8_INDICES_LAWS', outcome: 'G9.INDICES.c', rung: 2, form: 'why',
    draw: () => { const b = pick([2, 3, 5]), m = randInt(2, 4), n = randInt(2, 5); return m !== n ? { b, m, n, who: person() } : null; },
    make: ({ b, m, n, who }) => ({
      question: `${who.name} writes ${b}^${m} × ${b}^${n} = ${b * b}^${m + n}. Which law of indices shows that this is wrong?`,
      options: [
        { text: `The base stays ${b} and the indices are added: ${b}^${m + n}`, right: true },
        { text: `The indices must be multiplied, giving ${b}^${m * n}`, right: false, why: 'Multiplying the indices is for a power of a power, such as (b^m)^n.' },
        { text: `The bases must be added, giving ${2 * b}^${m + n}`, right: false, why: 'Bases are never added in the laws of indices.' },
        { text: `Nothing is wrong: the two bases multiply, so the base becomes ${b * b}`, right: false, why: 'When the bases are the same, they are not multiplied. They stay as they are.' },
      ],
      hints: ['Both powers have the same base. What happens to the base?', 'What happens to the indices when you multiply?'],
      steps: [`The bases are both ${b}, so the base stays ${b}.`, `The indices are added: ${m} + ${n} = ${m + n}. So the answer is ${b}^${m + n}.`],
    }) }),
  fam({ id: 'g9.ind.rope-pieces', skill: 'G8_INDICES_LAWS', outcome: 'G9.INDICES.c', rung: 2, form: 'word',
    draw: () => { const b = pick([2, 3, 5]), n = randInt(2, 3), m = n + randInt(2, 4); return b ** m <= 6000 ? { b, m, n, who: person() } : null; },
    make: ({ b, m, n, who }) => ({
      question: `${who.name} has a rope ${b}^${m} cm long. ${who.She} cuts it into pieces. Each piece is ${b}^${n} cm long. How many pieces does ${who.she} get? Use the laws of indices.`,
      answer: b ** (m - n),
      wrong: [[b ** (m + n), 'Cutting is a division. When powers are divided, the indices are subtracted.'], [b ** (m * n), 'Cutting is a division. The indices are subtracted, not multiplied.'], [m - n, `That is the index of the answer. The number of pieces is ${b} to that power.`]],
      hints: ['Number of pieces = length of rope ÷ length of a piece.', 'Divide powers of the same base: subtract the indices.'],
      steps: [`Pieces = ${b}^${m} ÷ ${b}^${n} = ${b}^(${m} − ${n}) = ${b}^${m - n}.`, `${b}^${m - n} = ${b ** (m - n)}.`],
    }),
    check: ({ b, m, n }, a) => a * b ** n === b ** m }),
];

const LOGS = [
  fam({ id: 'g9.log.spot-laws', skill: 'G10_LOG_LAWS', outcome: 'G9.INDICES.d', rung: 3, form: 'spot',
    draw: () => {
      const type = pick(['slip', 'last']), plus = Math.random() < 0.6, k = randInt(2, 4);
      let a, b;
      if (plus) { const i = randInt(0, k), j = randInt(0, k); if (i === j || i + j === 0) return null; a = 2 ** i * 5 ** j; b = 10 ** k / a; if (!Number.isInteger(b) || b < 2 || a < 2) return null; }
      else { b = randInt(2, 9); a = b * 10 ** k; }
      return { plus, k, a, b, type, who: person() };
    },
    make: ({ plus, k, a, b, type, who }) => {
      const X = plus ? a * b : a / b;
      const X1 = type === 'slip' ? X / 10 : X;
      const m = type === 'slip' ? k - 1 : X / 10;
      const op = plus ? '+' : '−';
      const working = [
        { text: `log ${commas(a)} ${op} log ${commas(b)} = log (${commas(a)} ${plus ? '×' : '÷'} ${commas(b)})`, ok: true },
        { text: `= log ${commas(X1)}`, ok: X1 === X },
        { text: `= ${m}`, ok: m === Math.round(Math.log10(X1)) },
      ];
      const fix = type === 'slip' ? `In Step 2, ${commas(a)} ${plus ? '×' : '÷'} ${commas(b)} is ${commas(X)}, not ${commas(X1)}.` : `In Step 3, log ${commas(X1)} is the power of 10 that gives ${commas(X1)}, which is ${k}, not ${commas(m)}.`;
      return { question: `${who.name} simplified log ${commas(a)} ${op} log ${commas(b)} without a calculator. One step is wrong. Which one?`, working, fix,
        steps: [`log ${commas(a)} ${op} log ${commas(b)} = log ${commas(X)}.`, `${commas(X)} = 10^${k}, so log ${commas(X)} = ${k}.`] };
    } }),
  fam({ id: 'g9.log.table-pattern', skill: 'G10_LOGARITHMS_INTRO', outcome: 'G9.INDICES.d', rung: 2, form: 'table', allowNegative: true,
    draw: () => { const k = pick([-3, -4, -5, -6, 4, 5, 6]); return { k }; },
    make: ({ k }) => {
      const num = (e) => (e >= 0 ? commas(10 ** e) : (10 ** e).toFixed(-e));
      const neg = k < 0, z = neg ? -k - 1 : k;
      return { question: `The table shows common logarithms of powers of 10. Continue the pattern to find log ${num(k)}.`,
        model: { type: 'table', data: { head: ['Number', 'Power of 10', 'log'], rows: [3, 2, 1, 0, -1, -2].map(e => ({ cells: [num(e), `10^${e}`, String(e)] })) } },
        answer: k,
        wrong: neg ? [[-k, 'Numbers smaller than 1 have negative logarithms. See what happens in the table as the numbers get smaller.'], [-z, 'That counts only the zeros after the decimal point. Count up to and including the 1.'], [k - 1, 'Check which decimal place the 1 is in, and compare with the last row of the table.']] : [[k + 1, 'That counts the digits. Count the zeros after the 1.'], [-k, 'Large numbers have positive logarithms. The table goes up as the numbers get bigger.'], [k * 10, 'The logarithm is the index of the power of 10, not 10 times it.']],
        hints: ['Write the number as a power of 10, as in the table.', 'The logarithm is the index of that power of 10.'],
        steps: [neg ? `${num(k)} = 10^${k}, since the 1 is in decimal place ${-k}.` : `${num(k)} = 10^${k}, since there are ${k} zeros after the 1.`, `So log ${num(k)} = ${k}.`] };
    },
    check: ({ k }, a) => Math.round(Math.log10(k < 0 ? Number((10 ** k).toFixed(-k)) : 10 ** k)) === a }),
  fam({ id: 'g9.log.tremor-scale', skill: 'G10_LOGARITHMS_INTRO', outcome: 'G9.INDICES.d', rung: 3, form: 'word',
    draw: () => { const m1 = randInt(2, 4), d = randInt(2, 3); return { m1, m2: m1 + d, d }; },
    make: ({ m1, m2, d }) => ({
      question: `In this question, the magnitude of a tremor is M = log A, where A is the size of the ground movement. A small tremor in the Rift Valley has magnitude ${m1}. A larger one has magnitude ${m2}. How many times larger is the ground movement in the larger tremor?`,
      answer: 10 ** d,
      wrong: [[d, 'That is the difference in magnitude. Magnitude is a logarithm, so write each A as a power of 10.'], [10 * d, 'Each step in magnitude multiplies A by 10. It is not 10 times the difference.'], [round(m2 / m1, 2), 'Magnitudes are logarithms. Do not divide them. Change each back to A.']],
      hints: [`If log A = ${m1}, what is A as a power of 10?`, 'Divide the two values of A.'],
      steps: [`log A = ${m1} gives A = 10^${m1}. log A = ${m2} gives A = 10^${m2}.`, `10^${m2} ÷ 10^${m1} = 10^${d} = ${commas(10 ** d)}.`],
    }),
    check: ({ m1, m2 }, a) => Math.abs(Math.log10(a) - (m2 - m1)) < 1e-9 }),
  fam({ id: 'g9.log.given-values', skill: 'G10_LOG_LAWS', outcome: 'G9.INDICES.d', rung: 2, form: 'steps',
    draw: () => { const L = { 2: 0.3010, 3: 0.4771, 5: 0.6990, 7: 0.8451 }; const ps = pick([[2, 3], [2, 5], [2, 7], [3, 5], [3, 7], [5, 7]]); return { p: ps[0], q: ps[1], lp: L[ps[0]], lq: L[ps[1]] }; },
    make: ({ p, q, lp, lq }) => ({
      question: `Given that log ${p} = ${lp.toFixed(4)} and log ${q} = ${lq.toFixed(4)}, use the laws of logarithms to find the values below.`,
      parts: [
        { prompt: `Find log ${p * q}.`, answer: round(lp + lq, 4), hint: `${p * q} = ${p} × ${q}. The log of a product is the sum of the logs.`, wrong: [[round(lp * lq, 4), 'The log of a product is the sum of the logs, not the product.']] },
        { prompt: `Find log ${p * p * q}.`, answer: round(2 * lp + lq, 4), hint: `${p * p * q} = ${p} × ${p} × ${q}. Count ${p} twice.`, wrong: [[round(lp + lq, 4), `${p} appears twice in ${p * p * q}.`]] },
        { prompt: `Find log (${q} ÷ ${p}).`, answer: round(lq - lp, 4), hint: 'The log of a quotient is the difference of the logs. Start with the top number.', wrong: [[round(lp - lq, 4), 'Start with the log of the number on top.'], [round(lq / lp, 4), 'The log of a quotient is the difference of the logs, not their quotient.']] },
      ],
      steps: [`log ${p * q} = ${lp.toFixed(4)} + ${lq.toFixed(4)} = ${round(lp + lq, 4)}.`, `log ${p * p * q} = 2 × ${lp.toFixed(4)} + ${lq.toFixed(4)} = ${round(2 * lp + lq, 4)}.`, `log (${q} ÷ ${p}) = ${lq.toFixed(4)} − ${lp.toFixed(4)} = ${round(lq - lp, 4)}.`],
    }),
    check: ({ lp, lq }, v) => Math.abs(v[0] - (lq + lp)) < 1e-9 && Math.abs(v[1] - v[0] - lp) < 1e-9 && Math.abs(v[2] + lp - lq) < 1e-9 }),
];
// ---------------------------------------------------------------- COMPOUND PROPORTION AND RATES OF WORK
const PROPORTION = [
  fam({ id: 'g9.prop.three-way-share', skill: 'G9_COMPOUND_PROPORTION', outcome: 'G9.PROPORTION.a', rung: 2, form: 'word',
    draw: () => {
      const v = [randInt(1, 6), randInt(1, 6), randInt(1, 6)], s = v[0] + v[1] + v[2], unit = pick([100, 200, 250, 500]), T = s * unit, big = Math.random() < 0.5;
      const hi = Math.max(...v), lo = Math.min(...v);
      if (v.filter(x => x === hi).length > 1 || v.filter(x => x === lo).length > 1) return null;
      const part = big ? hi : lo;
      return uniq(unit * part, T / 3, unit, T / part) && T <= 12000 ? { v, T, unit, big, part } : null;
    },
    make: ({ v, T, unit, big, part }) => ({
      question: `Three school clubs take part in a harambee that raises ${sh(T)}. Their shares of the money are in the ratio ${v.join(':')}. The club with the ${big ? 'biggest' : 'smallest'} share buys books with all of its money. How much does it spend on books?`,
      answer: unit * part,
      wrong: [[T / 3, 'The shares are not equal. The ratio tells you how many parts each club gets.'], [unit, 'That is the value of one part. The club gets more than one part.'], [round(T / part, 0), 'Divide the money by the total number of parts first, then multiply.']],
      hints: ['Add the numbers in the ratio to find the total parts.', 'Find the value of one part, then multiply by the club\'s number of parts.'],
      steps: [`Total parts: ${v.join(' + ')} = ${v[0] + v[1] + v[2]}.`, `One part: ${commas(T)} ÷ ${v[0] + v[1] + v[2]} = ${commas(unit)}. The club with ${part} parts gets ${part} × ${commas(unit)} = ${commas(unit * part)}.`],
    }),
    check: ({ v, T, big }, a) => { const hi = Math.max(...v), lo = Math.min(...v); return a * (v[0] + v[1] + v[2]) === T * (big ? hi : lo); } }),
  fam({ id: 'g9.prop.spot-two-share', skill: 'G9_COMPOUND_PROPORTION', outcome: 'G9.PROPORTION.a', rung: 2, form: 'spot',
    draw: () => {
      const [a, b] = pick([[2, 3], [3, 4], [2, 5], [3, 5], [1, 4], [1, 3]]), L = lcm(a * b, a + b), k = pick([2, 3, 4, 5]), T = L * k;
      const type = pick(['product', 'one-part']);
      if (T > 8000) return null;
      const s = type === 'product' ? a * b : a + b, u = type === 'one-part' ? T / a : T / s;
      if (!Number.isInteger(u)) return null;
      return { a, b, T, type, s, u, ns: twoPeople() };
    },
    make: ({ a, b, T, type, s, u, ns }) => {
      const [n1, n2] = ns;
      const working = [
        { text: `Total parts: ${type === 'product' ? `${a} × ${b}` : `${a} + ${b}`} = ${s}`, ok: s === a + b },
        { text: `One part: ${commas(T)} ÷ ${type === 'one-part' ? a : s} = ${commas(u)}`, ok: (type === 'one-part' ? a : s) === s },
        { text: `${n1.name} gets ${a} × ${commas(u)} = ${commas(a * u)} and ${n2.name} gets ${b} × ${commas(u)} = ${commas(b * u)}`, ok: true },
      ];
      const fix = type === 'product' ? 'The total number of parts is found by adding the numbers in the ratio, not multiplying them.' : `One part is the money divided by the total number of parts. Step 2 divided by ${a} instead of the total.`;
      const uu = T / (a + b);
      return { question: `${n1.name} and ${n2.name} share ${sh(T)} in the ratio ${a}:${b}. Below is a method for finding each share. One step has a mistake. Which one?`, working, fix,
        steps: [`Total parts: ${a} + ${b} = ${a + b}.`, `One part: ${commas(T)} ÷ ${a + b} = ${commas(uu)}.`, `Shares: ${commas(a * uu)} and ${commas(b * uu)}.`] };
    } }),
  fam({ id: 'g9.prop.table-share', skill: 'G9_COMPOUND_PROPORTION', outcome: 'G9.PROPORTION.a', rung: 2, form: 'table',
    draw: () => {
      const ps = [randInt(1, 5), randInt(1, 5), randInt(1, 5)], s = ps[0] + ps[1] + ps[2], unit = pick([200, 500, 1000]), T = s * unit, i = randInt(0, 2);
      let [x, y, z] = [person(), person(), person()];
      if (new Set([x.name, y.name, z.name]).size < 3) return null;
      return uniq(unit * ps[i], T / 3, unit, ps[i] * 100) && new Set(ps).size === 3 ? { ps, T, unit, i, who: [x, y, z] } : null;
    },
    make: ({ ps, T, unit, i, who }) => ({
      question: `Three partners run a shop. Their parts in the business are shown in the table. The shop makes a profit of ${sh(T)}. The profit is shared in proportion to the parts. How much does ${who[i].name} get?`,
      model: { type: 'table', data: { head: ['Partner', 'Parts'], rows: who.map((w, j) => ({ label: w.name, value: String(ps[j]) })) } },
      answer: unit * ps[i],
      wrong: [[T / 3, 'The partners do not share equally. Their shares follow the number of parts.'], [unit, 'That is the value of one part. This partner has more than one part.'], [ps[i] * 100, 'Find the value of one part by dividing the profit by all the parts.']],
      hints: ['Add all the parts from the table.', 'Divide the profit by the total parts, then multiply by this partner\'s parts.'],
      steps: [`Total parts: ${ps.join(' + ')} = ${ps[0] + ps[1] + ps[2]}.`, `One part: ${commas(T)} ÷ ${ps[0] + ps[1] + ps[2]} = ${commas(unit)}. ${who[i].name}: ${ps[i]} × ${commas(unit)} = ${commas(unit * ps[i])}.`],
    }),
    check: ({ ps, T, i }, a) => a * (ps[0] + ps[1] + ps[2]) === T * ps[i] }),
  fam({ id: 'g9.prop.chain-ratio', skill: 'G9_COMPOUND_PROPORTION', outcome: 'G9.PROPORTION.b', rung: 3, form: 'word',
    draw: () => {
      const p = randInt(1, 5), q = randInt(2, 6), r = randInt(2, 6), s = randInt(1, 6);
      if (q === r || s <= r || gcd(p, q) !== 1 || gcd(r, s) !== 1) return null;
      const L = lcm(q, r), A = p * L / q, B = L, C = s * L / r, k = randInt(2, 5), N = A * k, hens = C * k;
      const w1 = round((N * s) / p, 1), w2 = round((N * s) / r, 1), w3 = B * k;
      return uniq(hens, w1, w2, w3) && N <= 90 && hens <= 200 ? { p, q, r, s, N, hens, w1, w2, w3 } : null;
    },
    make: ({ p, q, r, s, N, hens, w1, w2, w3 }) => ({
      question: `On a farm in Kitale, the ratio of cows to goats is ${p}:${q}. The ratio of goats to hens is ${r}:${s}. There are ${N} cows. How many hens are there?`,
      answer: hens,
      wrong: [[w1, 'The goats are part of both ratios, but with different numbers. Make the goat numbers equal first.'], [w2, 'The second ratio is for goats to hens, not cows to hens.'], [w3, 'That is the number of goats. The question asks for hens.']],
      hints: ['Both ratios have goats in them. Make the goat part the same in both ratios.', 'Then write cows : goats : hens as one ratio.'],
      steps: [`Make the goat part equal to ${lcm(q, r)} in both: cows : goats = ${p * lcm(q, r) / q}:${lcm(q, r)}, goats : hens = ${lcm(q, r)}:${s * lcm(q, r) / r}.`, `Cows : goats : hens = ${p * lcm(q, r) / q}:${lcm(q, r)}:${s * lcm(q, r) / r}.`, `${N} cows is ${N / (p * lcm(q, r) / q)} times ${p * lcm(q, r) / q}, so hens = ${N / (p * lcm(q, r) / q)} × ${s * lcm(q, r) / r} = ${hens}.`],
    }),
    check: ({ p, q, r, s, N }, a) => N * q * s === a * p * r }),
  fam({ id: 'g9.prop.why-chain', skill: 'G9_COMPOUND_PROPORTION', outcome: 'G9.PROPORTION.b', rung: 3, form: 'why',
    draw: () => {
      const p = randInt(1, 5), q = randInt(2, 6), r = randInt(2, 6), s = randInt(1, 6);
      if (q === r || gcd(p, q) !== 1 || gcd(r, s) !== 1 || s === q) return null;
      return { p, q, r, s, who: person() };
    },
    make: ({ p, q, r, s, who }) => {
      const L = lcm(q, r), A = p * L / q, C = s * L / r;
      return { question: `The ratio of maize to beans on a shamba is ${p}:${q}. The ratio of beans to peas is ${r}:${s}. ${who.name} says maize : beans : peas = ${p}:${q}:${s}. Why is this wrong?`,
        options: [
          { text: `The beans part is ${q} in one ratio and ${r} in the other. Make both ${L} first, giving ${A}:${L}:${C}`, right: true },
          { text: `The ratios must be added together, giving ${p + r}:${q + q}:${s + s}`, right: false, why: 'Ratios are not added. Matching the part that both ratios share is what links them.' },
          { text: `The peas part should be ${r + s}, the sum of the second ratio`, right: false, why: 'The numbers in a ratio are parts, and are not added to find one part.' },
          { text: `Nothing is wrong, because the first and last numbers always stay as they are`, right: false, why: 'The shared part (beans) must be the same size in both ratios. Here it is not, so the other numbers must be scaled.' },
        ],
        hints: ['Which part is in both ratios?', 'Make that part the same number in both ratios.'],
        steps: [`Beans: ${q} in the first ratio, ${r} in the second. The common multiple is ${L}.`, `Maize : beans = ${A}:${L} and beans : peas = ${L}:${C}, so maize : beans : peas = ${A}:${L}:${C}.`] };
    } }),
  fam({ id: 'g9.prop.machines-output', skill: 'G9_COMPOUND_PROPORTION', outcome: 'G9.PROPORTION.c', rung: 2, form: 'word',
    draw: () => {
      const m1 = randInt(2, 4), m2 = m1 + randInt(1, 4), h1 = randInt(2, 6), h2 = h1 + randInt(1, 4), r = pick([5, 10, 20]);
      const u1 = m1 * h1 * r, u2 = m2 * h2 * r, w1 = (u1 * m2) / m1, w2 = (u1 * h2) / h1, w3 = r * h1 * m2 * h2;
      return uniq(u2, w1, w2, w3) && Number.isInteger(w1) && Number.isInteger(w2) && u2 <= 4000 ? { m1, m2, h1, h2, u1, u2, w1, w2, w3 } : null;
    },
    make: ({ m1, m2, h1, h2, u1, u2, w1, w2, w3 }) => ({
      question: `At a posho mill, ${m1} machines grind ${commas(u1)} kg of maize in ${h1} hours. All the machines work at the same rate. How many kg of maize do ${m2} machines grind in ${h2} hours?`,
      answer: u2,
      wrong: [[w1, `The time has changed from ${h1} hours to ${h2} hours. That must change the amount too.`], [w2, `The number of machines has changed from ${m1} to ${m2}. That must change the amount too.`], [w3, 'Find how much one machine grinds in one hour first. Divide by both the machines and the hours.']],
      hints: ['Find the amount one machine grinds in one hour.', 'Then multiply by the new number of machines and the new number of hours.'],
      steps: [`One machine in one hour: ${commas(u1)} ÷ ${m1} ÷ ${h1} = ${u1 / (m1 * h1)} kg.`, `${m2} machines in ${h2} hours: ${u1 / (m1 * h1)} × ${m2} × ${h2} = ${commas(u2)} kg.`],
    }),
    check: ({ m1, m2, h1, h2, u1 }, a) => a * m1 * h1 === u1 * m2 * h2 }),
  fam({ id: 'g9.prop.spot-compound', skill: 'G9_COMPOUND_PROPORTION', outcome: 'G9.PROPORTION.c', rung: 3, form: 'spot',
    draw: () => {
      const w1 = randInt(3, 6), d1 = randInt(4, 12), s1 = pick([2, 3]), s2 = s1 + randInt(1, 3), w2 = pick([2, 4, 5, 6, 8, 10]), type = pick(['mult', 'workers']);
      if ((w1 * d1) % s1 !== 0) return null;
      const x = (w1 * d1) / s1, X = type === 'mult' ? w1 * d1 * s1 : x, tot = X * s2, days = type === 'workers' ? tot * w2 : tot / w2;
      if (!Number.isInteger(days) || (type === 'mult' && (tot % w2 !== 0)) || (x * s2) % w2 !== 0) return null;
      return { w1, d1, s1, s2, w2, type, x, X, tot, days };
    },
    make: ({ w1, d1, s1, s2, w2, type, x, X, tot, days }) => {
      const working = [
        { text: `Worker-days for 1 shamba: ${w1} × ${d1} ${type === 'mult' ? '×' : '÷'} ${s1} = ${X}`, ok: X === (w1 * d1) / s1 },
        { text: `Worker-days for ${s2} shambas: ${X} × ${s2} = ${tot}`, ok: tot === X * s2 },
        { text: `Days for ${w2} workers: ${tot} ${type === 'workers' ? '×' : '÷'} ${w2} = ${days}`, ok: days === tot / w2 },
      ];
      const fix = type === 'mult' ? `In Step 1, the worker-days for ${s1} shambas must be divided by ${s1} to get 1 shamba, not multiplied.` : 'In Step 3 the total worker-days must be divided among the workers, not multiplied by them.';
      const good = ((w1 * d1) / s1) * s2 / w2;
      return { question: `${w1} workers take ${d1} days to harvest ${s1} shambas. All the workers work at the same rate. A learner works out how many days ${w2} workers need for ${s2} shambas. One step has a mistake. Which one?`, working, fix,
        steps: [`Worker-days for 1 shamba: ${w1} × ${d1} ÷ ${s1} = ${(w1 * d1) / s1}.`, `For ${s2} shambas: ${(w1 * d1) / s1} × ${s2} = ${((w1 * d1) / s1) * s2}.`, `Days: ${((w1 * d1) / s1) * s2} ÷ ${w2} = ${good}.`] };
    } }),
  fam({ id: 'g9.prop.table-workers', skill: 'G9_COMPOUND_PROPORTION', outcome: 'G9.PROPORTION.c', rung: 2, form: 'table',
    draw: () => {
      const P = pick([24, 36, 48, 60]), divs = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15].filter(d => P % d === 0), pool = divs.sort(() => Math.random() - 0.5), rows = pool.slice(0, 4).sort((a, b) => a - b), w = pool[4];
      if (w == null || rows.length < 4) return null;
      const ans = P / w, w1 = round((P / rows[0]) * w / rows[0], 1), w2 = P / rows[3], w3 = P;
      return uniq(ans, w1, w2, w3) ? { P, rows, w, ans, w1, w2, w3 } : null;
    },
    make: ({ P, rows, w, ans, w1, w2, w3 }) => ({
      question: `The table shows how many days different numbers of workers take to build the same wall. All the workers work at the same rate. How many days will ${w} workers take?`,
      model: { type: 'table', data: { head: ['Workers', 'Days'], rows: rows.map(r => ({ label: String(r), value: String(P / r) })) } },
      answer: ans,
      wrong: [[w1, 'More workers will finish the wall in fewer days, not more.'], [w2, 'That is the number of days for a different number of workers in the table. Check the workers.'], [w3, 'That is the number of worker-days. Divide it by the number of workers.']],
      hints: ['Multiply the workers by the days in one row of the table. Is it the same in the other rows?', 'That product is the total work. Divide it by the new number of workers.'],
      steps: [`${rows[0]} × ${P / rows[0]} = ${P}, and ${rows[1]} × ${P / rows[1]} = ${P}. The work is ${P} worker-days.`, `${P} ÷ ${w} = ${ans} days.`],
    }),
    check: ({ P, w }, a) => a * w === P }),
  fam({ id: 'g9.var.table-type', skill: 'G9_VARIATION', outcome: 'G9.PROPORTION.c', rung: 2, form: 'table',
    draw: () => {
      const type = pick(['direct', 'inverse', 'neither']), xs = [1, 2, 3, 6], k = type === 'inverse' ? pick([12, 18, 24, 36]) : randInt(2, 7), off = randInt(2, 6);
      const ys = xs.map(x => (type === 'direct' ? k * x : type === 'inverse' ? k / x : k * x + off));
      return { type, xs, ys };
    },
    make: ({ type, xs, ys }) => {
      const T = { direct: 'y varies directly as x', inverse: 'y varies inversely as x', neither: 'y varies neither directly nor inversely as x' };
      return { question: 'The table shows pairs of values of x and y. Look at how y varies as x changes. Which statement is true?', story: false,
        model: { type: 'table', data: { head: ['x', 'y'], rows: xs.map((x, i) => ({ label: String(x), value: String(ys[i]) })) } },
        options: Object.keys(T).map(k => ({ text: T[k], right: k === type, why: k === 'direct' ? 'For direct variation y ÷ x is always the same. Check y ÷ x in two rows.' : k === 'inverse' ? 'For inverse variation x × y is always the same. Check x × y in two rows.' : 'Check y ÷ x and x × y for the rows. One of them is constant.' })),
        hints: ['Work out y ÷ x for each row.', 'Then work out x × y for each row. Which one stays the same?'],
        steps: [`y ÷ x: ${xs.map((x, i) => round(ys[i] / x, 2)).join(', ')}. x × y: ${xs.map((x, i) => x * ys[i]).join(', ')}.`, type === 'direct' ? 'y ÷ x is constant, so y varies directly as x.' : type === 'inverse' ? 'x × y is constant, so y varies inversely as x.' : 'Neither is constant, so it is neither.'] };
    } }),
  fam({ id: 'g9.var.steps-inverse', skill: 'G9_VARIATION', outcome: 'G9.PROPORTION.c', rung: 2, form: 'steps',
    draw: () => {
      const k = pick([60, 72, 120, 180]), divs = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24].filter(d => k % d === 0).sort(() => Math.random() - 0.5);
      const [p1, p2, d3] = divs;
      return divs.length >= 3 && uniq(p1, p2, d3, k / p1, k / p2) && k / p2 !== p1 ? { k, p1, p2, d3 } : null;
    },
    make: ({ k, p1, p2, d3 }) => ({
      question: `A store of maize lasts d days. The number of days d varies inversely as the number of people p it feeds. The store lasts ${k / p1} days when it feeds ${p1} people.`,
      parts: [
        { prompt: 'Find the constant k, where p × d = k.', answer: k, hint: `Multiply ${p1} by ${k / p1}.`, wrong: [[p1 + k / p1, 'For inverse variation, p × d is the constant, not p + d.']] },
        { prompt: `How many days will the same store last ${p2} people?`, answer: k / p2, unit: 'days', hint: 'Divide k by the number of people.', wrong: [[round((k / p1) * p2 / p1, 1), 'More people use the maize faster, so the days go down, not up.']] },
        { prompt: `For how many people will the store last ${d3} days?`, answer: k / d3, unit: 'people', hint: 'p × d = k, so divide k by the number of days.', wrong: [[k * d3, 'p × d = k, so divide k by d. Do not multiply.']] },
      ],
      steps: [`k = ${p1} × ${k / p1} = ${k}.`, `d = ${k} ÷ ${p2} = ${k / p2} days.`, `p = ${k} ÷ ${d3} = ${k / d3} people.`],
    }),
    check: ({ k, p1, p2, d3 }, v) => v[0] === p1 * (k / p1) && v[1] * p2 === v[0] && v[2] * d3 === v[0] }),
  fam({ id: 'g9.work.tap-and-leak', skill: 'G9_RATES_OF_WORK', outcome: 'G9.PROPORTION.d', rung: 3, form: 'word',
    draw: () => {
      const [a, b] = pick([[4, 12], [6, 12], [3, 6], [6, 9], [10, 15], [4, 6], [2, 3], [5, 10]]), t = (a * b) / (b - a);
      const w1 = b - a, w2 = a + b, w3 = round((a * b) / (a + b), 1);
      return uniq(t, w1, w2, w3) ? { a, b, t, w1, w2, w3, who: person() } : null;
    },
    make: ({ a, b, t, w1, w2, w3, who }) => ({
      question: `A pipe can fill an empty tank at ${who.name}'s school in ${a} hours. A leak at the bottom can empty the full tank in ${b} hours. The pipe is open and the leak is open. How many hours does it take to fill the empty tank?`,
      answer: t,
      wrong: [[w1, 'You cannot subtract times. Compare how much each does in one hour.'], [w2, 'The leak works against the pipe, so the tank fills faster than the time for the leak alone.'], [w3, 'That treats the leak as if it also fills the tank. It empties it.']],
      hints: ['Write what fraction of the tank the pipe fills in 1 hour, and what fraction the leak empties.', 'Subtract the fraction lost from the fraction gained, then find the time for the whole tank.'],
      steps: [`In 1 hour the pipe fills 1/${a} of the tank. The leak empties 1/${b}.`, `Net in 1 hour: 1/${a} − 1/${b} = ${b - a}/${a * b}.`, `The whole tank takes ${a * b}/${b - a} = ${t} hours.`],
    }),
    check: ({ a, b }, t) => t / a - t / b === 1 }),
  fam({ id: 'g9.work.leftover-steps', skill: 'G9_RATES_OF_WORK', outcome: 'G9.PROPORTION.d', rung: 3, form: 'steps',
    draw: () => {
      const T = [6, 8, 10, 12, 15, 20, 24, 30], a = pick(T), b = pick(T), t = randInt(2, 8);
      if (a === b || a > b) return null;
      const L = lcm(a, b), ra = L / a, rb = L / b, left = L - t * (ra + rb);
      return left > 0 && left % ra === 0 ? { a, b, t, L, ra, rb, left, ns: twoPeople() } : null;
    },
    make: ({ a, b, t, L, ra, rb, left, ns }) => ({
      question: `${ns[0].name} can plough a field alone in ${a} days. ${ns[1].name} can plough it alone in ${b} days. They work together for ${t} days. Then ${ns[0].name} finishes the rest alone. Take the whole field as ${L} units of work.`,
      parts: [
        { prompt: `How many units does ${ns[0].name} plough in one day?`, answer: ra, hint: `The whole field is ${L} units, done in ${a} days.`, wrong: [[a, 'Divide the work by the days. The days are not the units per day.']] },
        { prompt: `How many units do they plough together in one day?`, answer: ra + rb, hint: `${ns[1].name} does ${L} ÷ ${b} units a day. Add the two rates.`, wrong: [[ra * rb, 'Add the units each does in a day.']] },
        { prompt: `How many units are left after ${t} days together?`, answer: left, hint: `Take away ${t} days of the joint work from ${L}.`, wrong: [[t * (ra + rb), 'That is the work done in those days. Take it away from the whole field.']] },
        { prompt: `How many more days does ${ns[0].name} need alone to finish?`, answer: left / ra, unit: 'days', hint: `Divide the units left by what ${ns[0].name} does in a day.`, wrong: [[left / (ra + rb), 'Only one person works now, not both.']] },
      ],
      steps: [`${ns[0].name}: ${L} ÷ ${a} = ${ra} units a day. ${ns[1].name}: ${L} ÷ ${b} = ${rb} units a day.`, `Together: ${ra + rb} units a day. After ${t} days: ${t * (ra + rb)} units done, ${left} left.`, `${left} ÷ ${ra} = ${left / ra} days.`],
    }),
    check: ({ a, b, t, L }, v) => v[0] * a === L && v[1] === v[0] + L / b && v[2] + t * v[1] === L && v[3] * v[0] === v[2] }),
  fam({ id: 'g9.work.why-average', skill: 'G9_RATES_OF_WORK', outcome: 'G9.PROPORTION.d', rung: 3, form: 'why',
    draw: () => { const [a, b] = pick([[4, 12], [6, 12], [3, 9], [4, 8], [6, 10], [2, 6]]); return { a, b, who: person() }; },
    make: ({ a, b, who }) => ({
      question: `Tap A fills a tank in ${a} hours. Tap B fills the same tank in ${b} hours. ${who.name} says that both taps together take ${(a + b) / 2} hours, the average of the two times. Why is this wrong?`,
      options: [
        { text: `Two taps together work faster than the quicker tap alone, so the time must be less than ${a} hours`, right: true },
        { text: `The times should be added, so both taps together take ${a + b} hours`, right: false, why: 'Adding the times gives a time longer than either tap alone. Two taps together must be quicker.' },
        { text: `The time should be the difference of the two times, ${b - a} hours`, right: false, why: 'Times are not subtracted. What adds is the amount of the tank filled in one hour.' },
        { text: `Nothing is wrong: the average of two times always gives the time for both together`, right: false, why: 'An average cannot be longer than the time of the faster tap when both taps work at once.' },
      ],
      hints: ['If Tap A alone takes a certain time, what happens when Tap B helps?', 'Compare the average with the time for the quicker tap.'],
      steps: [`Tap A alone takes ${a} hours. With Tap B helping, the tank fills in less than ${a} hours.`, `The average, ${(a + b) / 2} hours, is more than ${a} hours, so it cannot be right.`],
    }) }),
];
// ---------------------------------------------------------------- MATRICES
const mat = (m) => `[${m.map(r => r.map(fm).join(' ')).join('; ')}]`;
const ord = (r, c) => `${r} × ${c}`;
const MATRICES = [
  fam({ id: 'g9.mat.table-position', skill: 'G11_MATRICES_INTRO', outcome: 'G9.MATRICES.a', rung: 1, form: 'table',
    draw: () => {
      const names = [person(), person(), person()];
      if (new Set(names.map(n => n.name)).size < 3) return null;
      const vals = []; while (vals.length < 9) { const v = randInt(40, 95); if (!vals.includes(v)) vals.push(v); }
      const M = [vals.slice(0, 3), vals.slice(3, 6), vals.slice(6, 9)], r = randInt(0, 2), c = randInt(0, 2);
      return r !== c ? { names, M, r, c } : null;
    },
    make: ({ names, M, r, c }) => ({
      question: `The table shows the marks of three learners in three subjects. The marks are written as a matrix with one row for each learner and one column for each subject, in the same order as the table. What is the element in row ${r + 1} and column ${c + 1} of the matrix?`,
      model: { type: 'table', data: { head: ['Learner', 'Maths', 'English', 'Science'], rows: names.map((n, i) => ({ cells: [n.name, ...M[i].map(String)] })) } },
      answer: M[r][c],
      wrong: [[M[c][r], 'You swapped the row and the column. The row number comes first.'], [M[r][(c + 1) % 3], 'That is in the right row but the wrong column. Count the columns from the left.'], [M[(r + 1) % 3][c], 'That is in the right column but the wrong row. Count the rows from the top.']],
      hints: ['Row 1 is the first learner. Column 1 is the first subject.', 'Go to the row, then across to the column.'],
      steps: [`Row ${r + 1} is ${names[r].name}. Column ${c + 1} is ${['Maths', 'English', 'Science'][c]}.`, `The mark is ${M[r][c]}.`],
    }),
    check: ({ M, r, c }, a) => M.flat().indexOf(a) === r * 3 + c }),
  fam({ id: 'g9.mat.add-why', skill: 'G11_MATRICES_OPS', outcome: 'G9.MATRICES.d', rung: 2, form: 'why',
    draw: () => {
      const r = randInt(1, 3), c = randInt(2, 4), same = Math.random() < 0.3, kind = pick(['swap', 'col']);
      const r2 = same ? r : kind === 'swap' ? c : r, c2 = same ? c : kind === 'swap' ? r : c + 1;
      return r2 === r && c2 === c && !same ? null : (r * c === r2 * c2 || same) ? { r, c, r2, c2, same } : null;
    },
    make: ({ r, c, r2, c2, same }) => {
      const right = same ? `Yes. Both matrices have order ${ord(r, c)}, so they can be added` : `No. ${ord(r, c)} is not the same order as ${ord(r2, c2)}`;
      const wrong = same
        ? [{ text: `No. Only square matrices can ever be added together`, why: 'Matrices of any order can be added, as long as they have the same order.' }, { text: `No. The matrices must be multiplied, not added`, why: 'The question is about adding. Matching elements are added when the orders are equal.' }, { text: `Yes, but only if the elements are all positive`, why: 'The signs of the elements do not matter for adding.' }]
        : [{ text: `Yes. Both matrices have ${r * c} elements`, why: 'The same number of elements is not enough. The rows and columns must also match.' }, { text: `Yes. The number of columns of A equals the number of rows of B`, why: 'That condition is for multiplying matrices. For adding, the orders must be the same.' }, { text: `No. Only square matrices can ever be added together`, why: 'Matrices of any order can be added, as long as they have the same order.' }];
      return { question: `Matrix A has order ${ord(r, c)} and matrix B has order ${ord(r2, c2)}. Which statement about adding A and B is correct?`,
        options: [{ text: right, right: true }, ...wrong.map(w => ({ text: w.text, right: false, why: w.why }))],
        hints: ['What must be true about the rows and columns of two matrices before you add matching elements?', `Compare ${ord(r, c)} with ${ord(r2, c2)}.`],
        steps: [`Matrix A has ${r} rows and ${c} columns. Matrix B has ${r2} rows and ${c2} columns.`, same ? 'The orders are the same, so A and B can be added.' : 'The orders are different, so A and B cannot be added.'] };
    } }),
  fam({ id: 'g9.mat.compat-table', skill: 'G11_MATRICES_OPS', outcome: 'G9.MATRICES.d', rung: 2, form: 'table',
    draw: () => {
      const O = [[2, 3], [3, 2], [2, 2], [3, 3], [1, 3], [3, 1]].sort(() => Math.random() - 0.5);
      const shared = O[0], orders = [shared, shared, O[1], O[2]].sort(() => Math.random() - 0.5), names = ['A', 'B', 'C', 'D'];
      const pairs = []; for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) pairs.push([i, j]);
      const same = (p) => orders[p[0]][0] === orders[p[1]][0] && orders[p[0]][1] === orders[p[1]][1];
      const rightPair = pairs.filter(same), others = pairs.filter(p => !same(p)).sort(() => Math.random() - 0.5).slice(0, 3);
      return rightPair.length === 1 ? { orders, names, opts: [rightPair[0], ...others] } : null;
    },
    make: ({ orders, names, opts }) => ({
      question: 'The table shows the order of four matrices. Which two of them can be added?',
      model: { type: 'table', data: { head: ['Matrix', 'Rows', 'Columns'], rows: orders.map((o, i) => ({ cells: [names[i], String(o[0]), String(o[1])] })) } },
      options: opts.map((p, k) => ({ text: `${names[p[0]]} and ${names[p[1]]}`, right: k === 0, why: k === 0 ? undefined : `${names[p[0]]} has order ${ord(...orders[p[0]])} and ${names[p[1]]} has order ${ord(...orders[p[1]])}. Matrices can be added only if they have the same order.` })).sort(() => Math.random() - 0.5),
      hints: ['Two matrices can be added only if they have the same order.', 'Compare the rows and the columns of each matrix with the others.'],
      steps: [`Orders: ${orders.map((o, i) => `${names[i]} is ${ord(...o)}`).join(', ')}.`, `${names[opts[0][0]]} and ${names[opts[0][1]]} have the same order, so they can be added.`],
    }) }),
  fam({ id: 'g9.mat.spot-compat', skill: 'G11_MATRICES_OPS', outcome: 'G9.MATRICES.d', rung: 2, form: 'spot',
    draw: () => {
      const [r, c] = pick([[2, 3], [3, 4], [2, 4], [1, 3], [2, 5]]), type = pick(['count', 'cols']);
      return { r, c, type, who: person() };
    },
    make: ({ r, c, type, who }) => {
      const r2 = type === 'count' ? c : c, c2 = type === 'count' ? r : pick([2, 3, 4].filter(x => x !== r));
      const working = type === 'count' ? [
        { text: `A has ${r} rows and ${c} columns, so ${r} × ${c} = ${r * c} elements`, ok: true },
        { text: `B has ${r2} rows and ${c2} columns, so ${r2} × ${c2} = ${r2 * c2} elements`, ok: true },
        { text: `Both have ${r * c} elements, so A + B can be found`, ok: r === r2 && c === c2 },
      ] : [
        { text: `A has order ${ord(r, c)}, so it has ${c} columns`, ok: true },
        { text: `B has order ${ord(r2, c2)}, so it has ${r2} rows`, ok: true },
        { text: `The columns of A equal the rows of B, so A + B can be found`, ok: r === r2 && c === c2 },
      ];
      const fix = type === 'count' ? 'Two matrices can be added only if they have the same order. The same number of elements is not enough.' : 'Equal columns and rows is the rule for multiplying matrices. To add matrices, the orders must be the same.';
      return { question: `${who.name} says matrix A (order ${ord(r, c)}) and matrix B (order ${ord(r2, c2)}) can be added. Here is ${who.her} reasoning. One step is wrong. Which one?`, working, fix,
        steps: [`The orders ${ord(r, c)} and ${ord(r2, c2)} are different.`, 'So A and B cannot be added.'] };
    } }),
  fam({ id: 'g9.mat.spot-subtract', skill: 'G11_MATRICES_OPS', outcome: 'G9.MATRICES.e', rung: 2, form: 'spot',
    draw: () => {
      const A = [[randInt(2, 9), randInt(2, 9)], [randInt(2, 9), randInt(2, 9)]], B = [[randInt(1, 6), randInt(1, 6)], [randInt(1, 6), randInt(1, 6)]];
      const i = randInt(0, 3), type = pick(['neg', 'reverse']), [r, c] = [Math.floor(i / 2), i % 2];
      if (type === 'neg') B[r][c] = -randInt(1, 6);
      if (type === 'reverse' && A[r][c] === B[r][c]) return null;
      return { A, B, r, c, type, who: person() };
    },
    make: ({ A, B, r, c, type, who }) => {
      const labs = [['Row 1, column 1', 'Row 1, column 2'], ['Row 2, column 1', 'Row 2, column 2']];
      const working = [];
      for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
        const bad = i === r && j === c, a = A[i][j], b = B[i][j], right = a - b;
        const v = bad ? (type === 'neg' ? a - Math.abs(b) : b - a) : right;
        working.push({ text: `${labs[i][j]}: ${a} − ${br(b)} = ${fm(v)}`, ok: v === right });
      }
      const fix = type === 'neg' ? 'Subtracting a negative number is the same as adding. The step with the negative number was worked out as a plain subtraction.' : 'In subtraction the order matters. The element of the second matrix is taken away from the element of the first.';
      const R = A.map((row, i) => row.map((x, j) => x - B[i][j]));
      return { question: `${who.name} worked out ${mat(A)} − ${mat(B)} one element at a time. One step is wrong. Which one?`, working, fix,
        steps: [`The answer is ${mat(R)}.`, 'Subtract each element of the second matrix from the matching element of the first.'] };
    } }),
  fam({ id: 'g9.mat.solve-unknown', skill: 'G11_MATRICES_OPS', outcome: 'G9.MATRICES.e', rung: 3, form: 'direct',
    draw: () => {
      const X = randInt(2, 9), Y = randInt(2, 9), p = randInt(1, 6), q = randInt(1, 6), B = [[randInt(1, 7), randInt(1, 7)], [randInt(1, 7), randInt(1, 7)]];
      const C = [[X + B[0][0], p + B[0][1]], [q + B[1][0], Y + B[1][1]]];
      const ans = X + Y, w1 = C[0][0] + B[0][0] + C[1][1] + B[1][1], w2 = C[0][0] + C[1][1], w3 = X * Y;
      return X !== Y && uniq(ans, w1, w2, w3) ? { X, Y, p, q, B, C, ans, w1, w2, w3 } : null;
    },
    make: ({ X, Y, p, q, B, C, ans, w1, w2, w3 }) => ({
      question: `Find the value of x + y.   [x ${p}; ${q} y] + ${mat(B)} = ${mat(C)}`, story: false,
      answer: ans,
      wrong: [[w1, 'You added when you should have taken away. Subtract the element of the known matrix.'], [w2, 'Those are the elements of the answer matrix. x and y are in the first matrix, before the addition.'], [w3, 'The question asks for x + y, not x × y.']],
      hints: ['Add the matching elements. Which ones contain x and y?', 'Write an equation for the top-left elements, and another for the bottom-right elements.'],
      steps: [`Top left: x + ${B[0][0]} = ${C[0][0]}, so x = ${X}.`, `Bottom right: y + ${B[1][1]} = ${C[1][1]}, so y = ${Y}. Then x + y = ${ans}.`],
    }),
    check: ({ B, C }, a) => a + B[0][0] + B[1][1] === C[0][0] + C[1][1] }),
];

// ---------------------------------------------------------------- STRAIGHT LINES
const eq = (m, c) => `y = ${m === 1 ? '' : m === -1 ? '−' : fm(m)}x${c === 0 ? '' : c < 0 ? ` − ${-c}` : ` + ${c}`}`;
const LINES = [
  fam({ id: 'g9.line.road-percent', skill: 'G8_GRADIENT', outcome: 'G9.LINE.a', rung: 1, form: 'word',
    draw: () => { const g = pick([4, 5, 8, 10, 12]), run = pick([250, 500, 750, 1000, 1500]); return (run * g) % 100 === 0 ? { g, run, rise: (run * g) / 100 } : null; },
    make: ({ g, run, rise }) => ({
      question: `A road sign near Limuru says the hill has a gradient of ${g}%. This means the road rises ${g} m for every 100 m along the horizontal. A stretch of the road covers a horizontal distance of ${commas(run)} m. How many metres does the road rise over this stretch?`,
      answer: rise,
      wrong: [[g * run, 'A gradient of 8% means 8 out of every 100, so divide by 100 after multiplying.'], [round(run / g, 1), 'The rise is the gradient times the horizontal distance. Do not divide by the gradient.'], [run + g, 'The gradient is a rate, not a distance to add.']],
      hints: [`A gradient of ${g}% is ${g} m of rise for every 100 m along.`, `How many lots of 100 m are in ${commas(run)} m?`],
      steps: [`${commas(run)} ÷ 100 = ${run / 100} lots of 100 m.`, `Rise = ${run / 100} × ${g} = ${rise} m.`],
    }),
    check: ({ g, run }, a) => (a / run) * 100 === g }),
  fam({ id: 'g9.line.roof-table', skill: 'G8_GRADIENT', outcome: 'G9.LINE.a', rung: 2, form: 'table',
    draw: () => {
      const rows = [['Classroom roof', randInt(2, 6), randInt(3, 9)], ['Kitchen roof', randInt(2, 6), randInt(3, 9)], ['Library roof', randInt(2, 6), randInt(3, 9)]];
      const g = rows.map(r => r[1] / r[2]), hi = Math.max(...g), tops = g.filter(x => Math.abs(x - hi) < 1e-9).length, riseMax = rows.map(r => r[1]).indexOf(Math.max(...rows.map(r => r[1])));
      return tops === 1 && g.indexOf(hi) !== riseMax && new Set(g.map(x => x.toFixed(6))).size === 3 ? { rows, best: g.indexOf(hi) } : null;
    },
    make: ({ rows, best }) => ({
      question: 'The table shows the rise and the horizontal run of three roofs. Each roof slopes in a straight line. Which roof has the steepest gradient?',
      model: { type: 'table', data: { head: ['Roof', 'Rise (m)', 'Run (m)'], rows: rows.map(r => ({ cells: [r[0], String(r[1]), String(r[2])] })) } },
      options: rows.map((r, i) => ({ text: r[0], right: i === best, why: i === best ? undefined : `Gradient is rise ÷ run. The ${r[0].toLowerCase()} has ${r[1]} ÷ ${r[2]} = ${round(r[1] / r[2], 2)}, which is not the largest.` })),
      hints: ['Gradient = rise ÷ run.', 'Work out the gradient of each roof and compare. The biggest rise is not always the steepest.'],
      steps: rows.map(r => `${r[0]}: ${r[1]} ÷ ${r[2]} = ${round(r[1] / r[2], 2)}.`).concat([`The largest gradient is for the ${rows[best][0].toLowerCase()}.`]),
    }) }),
  fam({ id: 'g9.line.drain-negative', skill: 'G8_GRADIENT', outcome: 'G9.LINE.b', rung: 2, form: 'word', allowNegative: true,
    draw: () => { const t1 = randInt(1, 4), dt = randInt(2, 6), rate = pick([2, 3, 4, 5]), d1 = rate * (dt + randInt(2, 8)); const t2 = t1 + dt, d2 = d1 - rate * dt; return d2 > 0 ? { t1, t2, d1, d2, rate, dt } : null; },
    make: ({ t1, t2, d1, d2, rate, dt }) => ({
      question: `A pump empties a water tank. A straight-line graph of the depth of water in cm against the time in minutes passes through the points (${t1}, ${d1}) and (${t2}, ${d2}). Find the gradient of the line.`,
      answer: -rate,
      wrong: [[rate, 'The depth goes down as time goes up, so the gradient is negative.'], [round(-1 / rate, 2), 'The gradient is the change in depth divided by the change in time, not the other way round.'], [-(d1 - d2) , 'That is the change in depth only. Divide by the change in time as well.']].filter(w => w[0] !== -rate),
      hints: ['Gradient = change in y ÷ change in x.', 'The depth at the second point is less than at the first, so the change in y is negative.'],
      steps: [`Change in depth: ${d2} − ${d1} = ${fm(d2 - d1)}. Change in time: ${t2} − ${t1} = ${dt}.`, `Gradient = ${fm(d2 - d1)} ÷ ${dt} = ${fm(-rate)}.`],
    }),
    check: ({ t1, t2, d1, d2 }, a) => d1 + a * (t2 - t1) === d2 }),
  fam({ id: 'g9.line.spot-gradient', skill: 'G8_GRADIENT', outcome: 'G9.LINE.b', rung: 2, form: 'spot',
    draw: () => {
      const m = pick([-4, -3, -2, 2, 3, 4]), x1 = randInt(-3, 2), dx = randInt(2, 4), x2 = x1 + dx, y1 = randInt(-4, 6), y2 = y1 + m * dx, type = pick(['dy-sign', 'dx-sign', 'multiply']);
      return { x1, y1, x2, y2, m, dx, type, who: person() };
    },
    make: ({ x1, y1, x2, y2, m, dx, type, who }) => {
      const dy = y2 - y1, s1 = type === 'dy-sign' ? -dy : dy, s2 = type === 'dx-sign' ? -dx : dx, g = type === 'multiply' ? s1 * s2 : s1 / s2;
      const working = [
        { text: `Change in y: ${fm(s1)}`, ok: s1 === dy },
        { text: `Change in x: ${fm(s2)}`, ok: s2 === dx },
        { text: `Gradient = ${type === 'multiply' ? `${fm(s1)} × ${fm(s2)}` : `${fm(s1)} ÷ ${fm(s2)}`} = ${fm(g)}`, ok: g === s1 / s2 },
      ];
      const fix = { 'dy-sign': `The change in y is y₂ − y₁ = ${y2} − ${br(y1)}. Step 1 took them the wrong way round.`, 'dx-sign': `The change in x is x₂ − x₁ = ${x2} − ${br(x1)}. Step 2 took them the wrong way round.`, multiply: 'Gradient is the change in y divided by the change in x. Step 3 multiplied.' }[type];
      return { question: `${who.name} found the gradient of the line through (${x1}, ${y1}) and (${x2}, ${y2}). One step is wrong. Which one?`, working, fix,
        steps: [`Change in y: ${y2} − ${br(y1)} = ${fm(dy)}.`, `Change in x: ${x2} − ${br(x1)} = ${dx}. Gradient = ${fm(dy)} ÷ ${dx} = ${fm(m)}.`] };
    } }),
  fam({ id: 'g9.line.steps-two-points', skill: 'G8_EQUATION_OF_LINE', outcome: 'G9.LINE.c', rung: 2, form: 'steps',
    draw: () => {
      const m = pick([-3, -2, -1, 2, 3, 4]), c = pick([-5, -3, -2, 2, 3, 5, 6]), x1 = randInt(1, 3), x2 = x1 + randInt(1, 3), X = x2 + randInt(1, 3);
      const y1 = m * x1 + c, y2 = m * x2 + c;
      return y1 !== c ? { m, c, x1, x2, y1, y2, X } : null;
    },
    make: ({ m, c, x1, x2, y1, y2, X }) => ({
      question: `A straight line passes through the points (${x1}, ${y1}) and (${x2}, ${y2}). Find its equation, y = mx + c, in steps.`,
      parts: [
        { prompt: 'What is the gradient m?', answer: m, hint: 'm = change in y ÷ change in x.', wrong: [[-m, 'Check the order of the subtraction in both the top and the bottom.'], [round(1 / m, 2), 'The gradient is change in y over change in x, not the other way up.']] },
        { prompt: `Put m and the point (${x1}, ${y1}) into y = mx + c. What is c?`, answer: c, hint: `${y1} = ${fm(m)} × ${x1} + c.`, wrong: [[y1, 'c is the value of y when x = 0. This point is not at x = 0.'], [y1 + m * x1, 'To find c, take m × x away from y.']] },
        { prompt: `Use the equation to find y when x = ${X}.`, answer: m * X + c, hint: 'Put x into y = mx + c.', wrong: [[m * X, 'Add c at the end.'], [m + c + X, 'm × x means multiply m by x.']] },
      ],
      steps: [`m = (${y2} − ${br(y1)}) ÷ (${x2} − ${x1}) = ${fm(m)}.`, `c = ${y1} − ${br(m * x1)} = ${fm(c)}, so ${eq(m, c)}.`, `When x = ${X}: y = ${fm(m)} × ${X} + ${br(c)} = ${fm(m * X + c)}.`],
    }),
    check: ({ x1, y1, x2, y2, X }, v) => v[0] * (x2 - x1) === y2 - y1 && v[0] * x1 + v[1] === y1 && v[0] * X + v[1] === v[2] }),
  fam({ id: 'g9.line.why-eq', skill: 'G8_EQUATION_OF_LINE', outcome: 'G9.LINE.c', rung: 3, form: 'why',
    draw: () => { const m = pick([2, 3, 4]), c = pick([-3, -2, 1, 2, 4]), x1 = randInt(2, 3), y1 = m * x1 + c, x2 = x1 + 2, y2 = m * x2 + c; return y1 !== c ? { m, c, x1, y1, x2, y2, who: person() } : null; },
    make: ({ m, c, x1, y1, x2, y2, who }) => ({
      question: `A line has gradient ${m} and goes through (${x1}, ${y1}) and (${x2}, ${y2}). ${who.name} gives y = ${m}x + ${y1} as its equation. What is ${who.her} mistake?`,
      options: [
        { text: `c is the value of y when x = 0, not when x = ${x1}. Put (${x1}, ${y1}) into y = ${m}x + c to find c = ${c}`, right: true },
        { text: `The gradient should be ${y2 - y1}, because that is the difference between the two y-values`, right: false, why: 'The gradient is the change in y divided by the change in x. The given gradient is already correct.' },
        { text: `The equation should be written as y = c x + ${m}`, right: false, why: 'In y = mx + c, m is always the gradient, which is the number multiplying x.' },
        { text: `Nothing is wrong, because ${y1} is a y-value on the line, so it is c`, right: false, why: 'c is the y-value only where the line crosses the y-axis, at x = 0.' },
      ],
      hints: ['What does c stand for in y = mx + c?', 'Put the coordinates of one point into the equation and solve for c.'],
      steps: [`Put x = ${x1} and y = ${y1} into y = ${m}x + c: ${y1} = ${m * x1} + c.`, `c = ${y1} − ${m * x1} = ${fm(c)}, so the equation is ${eq(m, c)}.`],
    }) }),
  fam({ id: 'g9.line.fare-fixed-charge', skill: 'G8_EQUATION_OF_LINE', outcome: 'G9.LINE.c', rung: 2, form: 'word',
    draw: () => { const m = pick([20, 30, 40, 50]), c = pick([50, 70, 100, 120]), [x1, x2] = pick([[2, 6], [3, 7], [2, 5], [4, 8]]); const y1 = m * x1 + c, y2 = m * x2 + c; return uniq(c, m, y1, y1 - m) ? { m, c, x1, x2, y1, y2 } : null; },
    make: ({ m, c, x1, x2, y1, y2 }) => ({
      question: `The fare y shillings for a boda boda ride of x km is given by a straight-line equation y = mx + c. A ${x1} km ride costs ${sh(y1)} and ${x2 === 8 ? 'an' : 'a'} ${x2} km ride costs ${sh(y2)}. What is c, the fixed charge, in shillings? (The fares are for this question only.)`,
      answer: c,
      wrong: [[m, 'That is the gradient: the cost of each extra km. c is the cost before any distance.'], [y1, 'That is the whole fare for the shorter ride. It includes the cost of the distance as well.'], [y1 - m * 1, 'Take away the cost of the whole distance, not just 1 km.']],
      hints: ['Find the gradient first: how much does each extra km cost?', 'Then put one ride into y = mx + c and solve for c.'],
      steps: [`m = (${y2} − ${y1}) ÷ (${x2} − ${x1}) = ${m}.`, `${y1} = ${m} × ${x1} + c, so c = ${y1} − ${m * x1} = ${c}.`],
    }),
    check: ({ m, x1, y1 }, a) => a + m * x1 === y1 }),
  fam({ id: 'g9.line.spot-point-gradient', skill: 'G8_EQUATION_OF_LINE', outcome: 'G9.LINE.d', rung: 3, form: 'spot',
    draw: () => {
      const m = pick([-4, -3, -2, 2, 3, 4, 5]), x1 = randInt(1, 4), y1 = randInt(-4, 8), type = pick(['add', 'sign', 'product']);
      const c = y1 - m * x1;
      if (c === 0) return null;
      if (type === 'product' && m + x1 === m * x1) return null;
      const v1 = type === 'product' ? m + x1 : m * x1, v2 = type === 'add' ? y1 + v1 : y1 - v1, v3 = type === 'sign' ? -v2 : v2;
      return v2 !== 0 && v3 !== 0 ? { m, x1, y1, type, v1, v2, v3, who: person() } : null;
    },
    make: ({ m, x1, y1, type, v1, v2, v3, who }) => {
      const working = [
        { text: `m × x = ${br(m)} × ${x1} = ${fm(v1)}`, ok: v1 === m * x1 },
        { text: `c = y − m × x = ${y1} − (${fm(v1)}) = ${fm(v2)}`, ok: v2 === y1 - v1 },
        { text: `The equation is ${eq(m, v3)}`, ok: v3 === v2 },
      ];
      const fix = { add: 'To find c, take m × x away from y. Step 2 added them.', sign: 'In Step 3, the value of c from Step 2 was written with the wrong sign in the equation.', product: 'm × x means multiply. Step 1 added instead.' }[type];
      const c = y1 - m * x1;
      return { question: `${who.name} found the equation of the line through (${x1}, ${y1}) with gradient ${m}. One step is wrong. Which one?`, working, fix,
        steps: [`m × x = ${br(m)} × ${x1} = ${fm(m * x1)}.`, `c = ${y1} − (${fm(m * x1)}) = ${fm(c)}, so the equation is ${eq(m, c)}.`] };
    } }),
  fam({ id: 'g9.line.steps-rearrange', skill: 'G8_EQUATION_OF_LINE', outcome: 'G9.LINE.e', rung: 2, form: 'steps',
    draw: () => { const b = pick([2, 3, 4, 5]), u = randInt(1, 3), v = randInt(2, 8); return { a: b * u, b, k: b * v, u, v }; },
    make: ({ a, b, k, u, v }) => ({
      question: `Make y the subject of ${a}x + ${b}y = ${k}. This gives the form y = mx + c. Follow the steps.`,
      parts: [
        { prompt: `Take ${a}x from both sides. What is the coefficient of x on the right side, in ${b}y = ?x + ${k}?`, answer: -a, hint: `Moving ${a}x to the other side changes its sign.`, wrong: [[a, 'When a term moves to the other side of the equals sign, its sign changes.']] },
        { prompt: `Divide every term by ${b}. What is m, the number in front of x?`, answer: -u, hint: `Divide ${fm(-a)} by ${b}.`, wrong: [[-a, `Every term must be divided by ${b}, including the x term.`], [u, 'Check the sign of m.']] },
        { prompt: `What is c?`, answer: v, hint: `Divide ${k} by ${b}.`, wrong: [[k, `The constant must be divided by ${b} too.`], [-v, 'The constant did not change sign. Only the term that moved did.']] },
      ],
      steps: [`${b}y = ${fm(-a)}x + ${k}.`, `Divide by ${b}: y = ${fm(-u)}x + ${v}.`, `So m = ${fm(-u)} and c = ${v}.`],
    }),
    check: ({ a, b, k }, p) => p[0] === -a && p[1] * b === p[0] && p[2] * b === k }),
  fam({ id: 'g9.line.spot-rearrange', skill: 'G8_EQUATION_OF_LINE', outcome: 'G9.LINE.e', rung: 3, form: 'spot',
    draw: () => {
      const b = pick([2, 3, 4]), u = randInt(1, 3), v = randInt(2, 6), type = pick(['sign', 'half', 'read']), a = b * u, k = b * v;
      const K1 = type === 'sign' ? -k : k, M2 = u, C2 = type === 'half' ? K1 : K1 / b, g = type === 'read' ? C2 : M2, ic = type === 'read' ? M2 : C2;
      return g !== ic || type !== 'read' ? { a, b, k, u, v, type, K1, M2, C2, g, ic, who: person() } : null;
    },
    make: ({ a, b, k, u, v, type, K1, M2, C2, g, ic, who }) => {
      const working = [
        { text: `${b}y = ${a}x ${K1 < 0 ? '−' : '+'} ${Math.abs(K1)}`, ok: K1 === k },
        { text: `y = ${M2}x ${C2 < 0 ? '−' : '+'} ${Math.abs(C2)}`, ok: M2 === a / b && C2 === K1 / b },
        { text: `m = ${fm(g)} and c = ${fm(ic)}`, ok: g === M2 && ic === C2 },
      ];
      const fix = { sign: `Adding ${a}x to both sides leaves the ${k} unchanged. Step 1 changed its sign.`, half: `In Step 2 every term must be divided by ${b}, including the constant.`, read: 'In y = mx + c, m is the number multiplying x and c is the constant. Step 3 swapped them.' }[type];
      return { question: `${who.name} wants to write ${b}y − ${a}x = ${k} in the form y = mx + c. One step is wrong. Which one?`, working, fix,
        steps: [`${b}y = ${a}x + ${k}.`, `y = ${u}x + ${v}.`, `So m = ${u} and c = ${v}.`] };
    } }),
  fam({ id: 'g9.line.steps-intercepts', skill: 'G8_EQUATION_OF_LINE', outcome: 'G9.LINE.g', rung: 3, form: 'steps',
    draw: () => { const a = pick([2, 3, 4, 5, 6]), b = pick([2, 3, 4, 5, 6]), l = lcm(a, b), k = l * randInt(1, 3), xi = k / a, yi = k / b; return a !== b && (xi * yi) % 2 === 0 ? { a, b, k, xi, yi } : null; },
    make: ({ a, b, k, xi, yi }) => ({
      question: `The line ${a}x + ${b}y = ${k} crosses the x-axis and the y-axis. The line and the two axes make a triangle.`,
      parts: [
        { prompt: 'Put y = 0. At what value of x does the line cross the x-axis?', answer: xi, hint: `${a}x = ${k}.`, wrong: [[yi, 'That is the other intercept. On the x-axis, y = 0.']] },
        { prompt: 'Put x = 0. At what value of y does the line cross the y-axis?', answer: yi, hint: `${b}y = ${k}.`, wrong: [[xi, 'That is the other intercept. On the y-axis, x = 0.']] },
        { prompt: 'The two intercepts are the base and height of the triangle. What is its area, in square units?', answer: (xi * yi) / 2, unit: 'square units', hint: 'Area of a triangle = ½ × base × height.', wrong: [[xi * yi, 'A triangle is half of the rectangle. Halve the product.']] },
      ],
      steps: [`y = 0: ${a}x = ${k}, so x = ${xi}.`, `x = 0: ${b}y = ${k}, so y = ${yi}.`, `Area = ½ × ${xi} × ${yi} = ${(xi * yi) / 2}.`],
    }),
    check: ({ a, b, k }, v) => a * v[0] === k && b * v[1] === k && v[2] * 2 === v[0] * v[1] }),
  fam({ id: 'g9.line.tank-meets-axis', skill: 'G8_EQUATION_OF_LINE', outcome: 'G9.LINE.g', rung: 2, form: 'word',
    draw: () => { const B = pick([3, 4, 5, 6]), x0 = randInt(4, 15), A = B * x0; return uniq(x0, A, B, A * B) ? { A, B, x0 } : null; },
    make: ({ A, B, x0 }) => ({
      question: `The depth y cm of water in a drum after x minutes is given by y = ${A} − ${B}x. The graph of this line meets the x-axis when the drum is empty. After how many minutes does the line meet the x-axis?`,
      answer: x0,
      wrong: [[A, `That is where the line meets the y-axis, at the start. On the x-axis, y = 0.`], [B, 'That is the gradient size: the cm lost each minute.'], [round(A * B, 0), 'Set y = 0 and divide. Do not multiply.']],
      hints: ['On the x-axis, the depth y is 0.', `Solve 0 = ${A} − ${B}x.`],
      steps: [`Put y = 0: 0 = ${A} − ${B}x.`, `${B}x = ${A}, so x = ${A} ÷ ${B} = ${x0} minutes.`],
    }),
    check: ({ A, B }, a) => A - B * a === 0 }),
  fam({ id: 'g9.line.why-intercept', skill: 'G8_EQUATION_OF_LINE', outcome: 'G9.LINE.g', rung: 2, form: 'why',
    draw: () => { const m = pick([2, 3, 4, 5]), r = randInt(1, 4), c = m * r; return { m, c, r, who: person() }; },
    make: ({ m, c, r, who }) => ({
      question: `The line y = ${m}x + ${c} is drawn. ${who.name} reads (${c}, 0) as the point where it meets the x-axis. Why can this not be right?`,
      options: [
        { text: `On the x-axis y = 0, so 0 = ${m}x + ${c} gives x = −${r}. The line meets the x-axis at (−${r}, 0)`, right: true },
        { text: `The line crosses the x-axis at (0, ${c}), because you put x = 0`, right: false, why: 'Putting x = 0 gives the point on the y-axis, not the x-axis.' },
        { text: `The line crosses the x-axis at (−${c}, 0), by moving ${c} to the other side without dividing`, right: false, why: `After moving ${c}, you must also divide by ${m}.` },
        { text: `Nothing is wrong, because ${c} is where every line meets the x-axis`, right: false, why: 'The number c in y = mx + c is where the line meets the y-axis.' },
      ],
      hints: ['What is the value of y at every point on the x-axis?', 'Put that value into the equation and solve for x.'],
      steps: [`On the x-axis, y = 0: 0 = ${m}x + ${c}.`, `${m}x = −${c}, so x = −${c} ÷ ${m} = −${r}.`],
    }) }),
];
// ---------------------------------------------------------------- LINEAR INEQUALITIES
const FLIP = { '>': '<', '≥': '≤', '<': '>', '≤': '≥' };
const INEQ = [
  fam({ id: 'g9.ineq.spot-negative-divide', skill: 'G8_INEQUALITIES', outcome: 'G9.INEQ.a', rung: 3, form: 'spot',
    draw: () => {
      const m = randInt(2, 5), cc = randInt(1, 4), v = randInt(-3, 4), sign = pick(['>', '≥', '<', '≤']), type = pick(['noflip', 'edge', 'subtract']);
      const c = m * cc, k = m * (cc - v), r = k - c;
      const shownR = type === 'subtract' ? k + c : r, sign2 = type === 'noflip' ? sign : FLIP[sign], shownV = shownR / -m;
      const small = sign2 === '<' || sign2 === '≤';
      const good = small ? (sign2 === '<' ? shownV - 1 : shownV) : (sign2 === '>' ? shownV + 1 : shownV);
      const bad = small ? (sign2 === '<' ? shownV : shownV - 1) : (sign2 === '>' ? shownV : shownV + 1);
      return { m, c, k, sign, sign2, r, shownR, shownV, small, N: type === 'edge' ? bad : good, good, type, who: person() };
    },
    make: ({ m, c, k, sign, sign2, r, shownR, shownV, small, N, good, type, who }) => {
      const working = [
        { text: `Take ${c} from both sides: −${m}x ${sign} ${fm(shownR)}`, ok: shownR === r },
        { text: `Divide both sides by −${m}: x ${sign2} ${fm(shownV)}`, ok: sign2 === FLIP[sign] && shownV === shownR / -m },
        { text: `The ${small ? 'largest' : 'smallest'} whole number that works is ${fm(N)}`, ok: N === good },
      ];
      const fix = { noflip: 'Dividing both sides of an inequality by a negative number reverses the sign. Step 2 kept it the same.', edge: `In Step 3, the sign in x ${sign2} ${fm(shownV)} ${sign2 === '<' || sign2 === '>' ? 'does not include' : 'includes'} ${fm(shownV)} itself, which changes the whole number that works.`, subtract: `Taking ${c} from both sides gives ${k} − ${c} on the right. Step 1 added instead.` }[type];
      return { question: `Solve ${c} − ${m}x ${sign} ${k}. ${who.name} worked as shown below. One step is wrong. Which one?`, working, fix,
        steps: [`Take ${c} from both sides: −${m}x ${sign} ${fm(r)}.`, `Divide by −${m} and reverse the sign: x ${FLIP[sign]} ${fm(r / -m)}.`] };
    } }),
  fam({ id: 'g9.ineq.why-reverse', skill: 'G8_INEQUALITIES', outcome: 'G9.INEQ.a', rung: 2, form: 'why',
    draw: () => { const m = randInt(2, 6), v = randInt(2, 7), sign = pick(['<', '≤']); return { m, k: m * v, v, sign, who: person() }; },
    make: ({ m, k, v, sign, who }) => ({
      question: `${who.name} solves −${m}x ${sign} ${k} and writes x ${FLIP[sign]} −${v}. Why does the sign change from ${sign} to ${FLIP[sign]}?`,
      options: [
        { text: `Dividing both sides by a negative reverses the inequality`, right: true },
        { text: `The sign changes every time you divide, whatever the number`, right: false, why: 'Dividing by a positive number keeps the sign. For example, 6 < 9 and 2 < 3.' },
        { text: `The sign changes because ${k} is a positive number`, right: false, why: 'The sign of the number on the right does not decide this. It is the number you divide by.' },
        { text: `The sign changes because x is on the left side`, right: false, why: 'Where x sits does not matter. It is the negative number you divide by.' },
      ],
      hints: ['What happens to the order of two numbers when both are multiplied or divided by a negative number?', 'Try it with 2 and 5.'],
      steps: [`Divide both sides by −${m}. A negative divisor reverses the order.`, `x ${FLIP[sign]} −${v}.`],
    }) }),
  fam({ id: 'g9.ineq.number-line-words', skill: 'G8_INEQUALITIES', outcome: 'G9.INEQ.b', rung: 2, form: 'direct',
    draw: () => ({ v: randInt(-5, 8), solid: Math.random() < 0.5, left: Math.random() < 0.5 }),
    make: ({ v, solid, left }) => {
      const right = left ? (solid ? '≤' : '<') : (solid ? '≥' : '>');
      return { question: `On a number line, there is a ${solid ? 'solid (filled)' : 'open'} circle at ${fm(v)}. The line is shaded to the ${left ? 'left' : 'right'} of the circle. Which inequality does this number line show?`, story: false,
        options: ['<', '≤', '>', '≥'].map(s => {
          const inc = s === '≤' || s === '≥', toLeft = s === '<' || s === '≤';
          const why = inc !== solid && toLeft !== left ? 'Both the circle and the direction of the shading disagree with this sign.' : inc !== solid ? `The circle is ${solid ? 'solid, so the number is included' : 'open, so the number is not included'}.` : `The shading goes to the ${left ? 'left, towards smaller numbers' : 'right, towards bigger numbers'}.`;
          return { text: `x ${s} ${fm(v)}`, right: s === right, why: s === right ? undefined : why };
        }),
        hints: ['A solid circle includes the number. An open circle does not.', 'Shading to the left shows smaller numbers. Shading to the right shows bigger numbers.'],
        steps: [`The circle is ${solid ? 'solid, so the number is included' : 'open, so the number is not included'}.`, `The shading is to the ${left ? 'left' : 'right'}, so the sign is ${right}: x ${right} ${fm(v)}.`] };
    } }),
  fam({ id: 'g9.ineq.why-circle', skill: 'G8_INEQUALITIES', outcome: 'G9.INEQ.b', rung: 2, form: 'why',
    draw: () => ({ v: randInt(-4, 9), sign: pick(['<', '>', '≤', '≥']), who: person() }),
    make: ({ v, sign, who }) => {
      const inc = sign === '≤' || sign === '≥', left = sign === '<' || sign === '≤';
      return { question: `To graph x ${sign} ${fm(v)}, ${who.name} draws ${inc ? 'an open' : 'a solid'} circle and an arrow pointing ${left ? 'left' : 'right'}. The circle is at ${fm(v)}. A teacher marks the circle wrong. Why?`,
        options: [
          { text: inc ? `x ${sign} ${fm(v)} includes ${fm(v)}, so the circle must be solid` : `x ${sign} ${fm(v)} does not include ${fm(v)}, so the circle must be open`, right: true },
          { text: `The circle is right, but the shading should go to the ${left ? 'right' : 'left'}`, right: false, why: `The shading to the ${left ? 'left' : 'right'} is correct for ${sign === '<' || sign === '≤' ? 'smaller' : 'bigger'} numbers. The circle is the problem.` },
          { text: inc ? 'An open circle is used when the sign is ≤ or ≥ and the number is negative' : 'A solid circle is used when the number is on the right of zero', right: false, why: 'The sign of the number does not decide the circle. The sign < > ≤ ≥ does.' },
          { text: `Nothing is wrong: the circle is always ${inc ? 'open' : 'solid'} at the boundary`, right: false, why: 'The circle depends on whether the boundary number is included in the answer.' },
        ],
        hints: ['Does the sign include the boundary number itself?', 'A solid circle includes the number. An open circle leaves it out.'],
        steps: [`${sign} ${inc ? 'includes' : 'does not include'} the boundary number ${fm(v)}.`, `So the circle should be ${inc ? 'solid' : 'open'}.`] };
    } }),
  fam({ id: 'g9.ineq.region-graph', skill: 'G8_INEQUALITIES', outcome: 'G9.INEQ.c', rung: 2, form: 'graph',
    draw: () => {
      const m = pick([1, 2, -1]), c = pick([1, 2, 3, 4]), op = pick(['>', '<']), x0 = randInt(1, 4), d = randInt(1, 3), sg = op === '>' ? 1 : -1;
      const line = (x) => m * x + c, sat = (p) => (op === '>' ? p[1] > line(p[0]) : p[1] < line(p[0]));
      const x1 = x0 % 4 + 1, x2 = (x0 + 1) % 4 + 1;
      const pts = [[x0, line(x0) + sg * d], [x1, line(x1)], [x2, line(x2) - sg * d], [line(x0) + sg * d, x0]];
      return new Set(pts.map(String)).size === 4 && pts.filter(sat).length === 1 && pts.every(p => p[0] >= 0 && p[0] <= 5 && p[1] >= -2 && p[1] <= 14) ? { m, c, op, pts, sat: pts.map(sat) } : null;
    },
    make: ({ m, c, op, pts, sat }) => {
      const xs = [0, 1, 2, 3, 4, 5], ys = xs.map(x => ({ x, y: m * x + c })), all = ys.map(p => p.y).concat(pts.map(p => p[1]));
      const lo = Math.floor(Math.min(0, ...all) / 2) * 2, hi = Math.ceil(Math.max(...all) / 2) * 2, yTicks = []; for (let v = lo; v <= hi; v += 2) yTicks.push(v);
      return { question: `The graph shows the boundary line ${eq(m, c)}. Which point lies in the region y ${op} ${eq(m, c).slice(4)}?`, story: false,
        model: { type: 'line-graph', data: { lines: [ys], xTicks: xs, yTicks, xLabel: 'x', yLabel: 'y' } },
        options: pts.map((p, i) => ({ text: `(${p[0]}, ${p[1]})`, right: sat[i], why: sat[i] ? undefined : `Put x = ${p[0]} into the line: it gives y = ${m * p[0] + c}. The point has y = ${p[1]}, which is ${p[1] === m * p[0] + c ? 'on the line, not in the region' : p[1] > m * p[0] + c ? 'above the line' : 'below the line'}.` })),
        hints: ['Work out what y is on the line at the x of each point.', `The region is where y is ${op === '>' ? 'greater' : 'less'} than that.`],
        steps: pts.map((p, i) => `(${p[0]}, ${p[1]}): the line gives y = ${m * p[0] + c} here, so the point is ${sat[i] ? 'in the region' : 'not in the region'}.`) };
    } }),
  fam({ id: 'g9.ineq.why-boundary', skill: 'G8_INEQUALITIES', outcome: 'G9.INEQ.c', rung: 2, form: 'why',
    draw: () => ({ m: pick([2, 3, 1]), c: pick([1, 2, 4, 5]), sign: pick(['>', '<', '≥', '≤']), who: person() }),
    make: ({ m, c, sign, who }) => {
      const inc = sign === '≥' || sign === '≤', rhs = `${m === 1 ? '' : m}x + ${c}`;
      return { question: `${who.name} shades the region y ${sign} ${rhs} and draws its boundary line as a ${inc ? 'solid' : 'dashed'} line. Why is this correct?`,
        options: [
          { text: inc ? 'The sign includes "equal to", so the line is in the region' : 'The sign leaves out "equal to", so the line is not in the region', right: true },
          { text: `${inc ? 'Solid' : 'Dashed'} lines are used when the gradient is ${m > 1 ? 'big' : 'small'}, whatever the sign`, right: false, why: 'The gradient has nothing to do with it. The inequality sign decides.' },
          { text: `A ${inc ? 'solid' : 'dashed'} line shows which side of the line to shade`, right: false, why: 'The shading shows the side. The line style shows whether the boundary is included.' },
          { text: `A ${inc ? 'solid' : 'dashed'} line is used when the line goes through the origin`, right: false, why: 'Where the line goes does not matter. The inequality sign decides.' },
        ],
        hints: ['Is a point on the line in the region?', 'Does the sign include "equal to"?'],
        steps: [`The sign ${sign} ${inc ? 'includes' : 'does not include'} "equal to".`, `So the boundary is ${inc ? 'solid' : 'dashed'}.`] };
    } }),
  fam({ id: 'g9.ineq.budget-max', skill: 'G8_INEQUALITIES', outcome: 'G9.INEQ.d', rung: 2, form: 'word',
    draw: () => {
      const item = pick(['exercise book', 'loaf of bread', 'kg of rice', 'litre of milk']), p = price(item), n = randInt(8, 15), r = 5 * randInt(1, Math.max(1, Math.floor(p / 5) - 1)), B = p * n + r;
      if (r >= p) return null;
      return uniq(n, n + 1, B - p, round(B / p, 1)) ? { item, p, n, B, who: person() } : null;
    },
    make: ({ item, p, n, B, who }) => ({
      question: `${who.name} has ${sh(B)} to spend. Each ${item} costs ${sh(p)}. What is the maximum number of ${item === 'exercise book' ? 'exercise books' : item === 'loaf of bread' ? 'loaves' : item === 'kg of rice' ? 'kg of rice' : 'litres of milk'} ${who.she} can buy?`,
      answer: n,
      wrong: [[n + 1, `That would cost more than ${sh(B)}. You cannot round up when there is a budget.`], [B - p, 'Take the number of items from the amount of money, not the money left. Divide the budget by the price.'], [round(B / p, 1), 'You can only buy a whole number of items. Take the whole number part.']],
      hints: [`Write an inequality: ${p} × n ≤ ${B}.`, 'Divide, then think about whether n can be a fraction.'],
      steps: [`${p}n ≤ ${commas(B)}, so n ≤ ${commas(B)} ÷ ${p} = ${round(B / p, 2)}.`, `n must be a whole number, so the maximum is ${n}.`],
    }),
    check: ({ p, B }, a) => p * a <= B && p * (a + 1) > B }),
  fam({ id: 'g9.ineq.at-least-tickets', skill: 'G8_INEQUALITIES', outcome: 'G9.INEQ.d', rung: 3, form: 'word',
    draw: () => {
      const E = pick([12000, 15000, 18000, 20000]), X = pick([3000, 5000, 6000]), p = pick([450, 600, 700, 800, 900]);
      if ((E + X) % p === 0) return null;
      const n = Math.ceil((E + X) / p), w1 = Math.floor((E + X) / p), w2 = Math.ceil(X / p), w3 = Math.ceil((E - X) / p);
      return uniq(n, w1, w2, w3) ? { E, X, p, n, w1, w2, w3, who: person() } : null;
    },
    make: ({ E, X, p, n, w1, w2, w3, who }) => ({
      question: `${who.name}'s class hires a bus for a trip. The bus costs ${sh(E)}. Each learner who comes pays ${sh(p)}. The class wants to have at least ${sh(X)} left after paying for the bus. What is the smallest number of learners who must come?`,
      answer: n,
      wrong: [[w1, `With ${w1} learners the money left would be less than ${sh(X)}. Round up, not down.`], [w2, 'The bus must be paid for first. Add its cost to the money the class wants left.'], [w3, 'The amount left over is added to the cost of the bus, not taken from it.']],
      hints: [`Write an inequality: ${p} × n − ${E} ≥ ${X}.`, 'Solve for n, then decide whether to round up or down.'],
      steps: [`${p}n − ${commas(E)} ≥ ${commas(X)}, so ${p}n ≥ ${commas(E + X)}.`, `n ≥ ${round((E + X) / p, 2)}, so the smallest whole number is ${n}.`],
    }),
    check: ({ E, X, p }, a) => p * a - E >= X && p * (a - 1) - E < X }),
  fam({ id: 'g9.ineq.steps-pickup-load', skill: 'G8_INEQUALITIES', outcome: 'G9.INEQ.d', rung: 3, form: 'steps',
    draw: () => { const W = pick([1200, 1500, 2000]), b = pick([150, 200, 300]), w = pick([50, 60, 70, 80]); return (W - b) % w !== 0 ? { W, b, w } : null; },
    make: ({ W, b, w }) => {
      const room = W - b, n = Math.floor(room / w);
      return { question: `A pickup can carry at most ${commas(W)} kg altogether. The driver and tools have a mass of ${b} kg. Each sack of maize has a mass of ${w} kg.`,
        parts: [
          { prompt: 'What is the greatest mass of sacks the pickup can carry, in kg?', answer: room, unit: 'kg', hint: 'Take the mass of the driver and tools from the most the pickup can carry.', wrong: [[W, 'The driver and tools also count towards the load.']] },
          { prompt: 'What is the greatest number of whole sacks it can carry?', answer: n, hint: `Divide by ${w}. You cannot carry part of a sack.`, wrong: [[n + 1, 'That many sacks would be over the limit. Take the whole number part.']] },
          { prompt: 'How many kg of spare room are left?', answer: room - n * w, unit: 'kg', hint: 'Take the mass of the sacks from the greatest mass of sacks.', wrong: [[w, 'The spare room is what is left after the sacks are loaded.']] },
        ],
        steps: [`Greatest mass of sacks: ${commas(W)} − ${b} = ${commas(room)} kg.`, `${commas(room)} ÷ ${w} = ${round(room / w, 2)}, so ${n} whole sacks.`, `Spare room: ${commas(room)} − ${n} × ${w} = ${room - n * w} kg.`] };
    },
    check: ({ W, b, w }, v) => v[0] + b === W && v[1] * w <= v[0] && (v[1] + 1) * w > v[0] && v[2] + v[1] * w === v[0] }),
];

export const FAMILIES = [...INTEGERS, ...CUBES, ...INDICES, ...LOGS, ...PROPORTION, ...MATRICES, ...LINES, ...INEQ];
