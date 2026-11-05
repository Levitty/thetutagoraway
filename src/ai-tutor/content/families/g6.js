// ============================================================================
// GRADE 6: new question forms, written in advance. Every key is computed from
// the draw; every check works it another way. Tables of charges are
// illustrations, never real rates, and the question says so.
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family, round, commas } from './core.js';
import { person, sh, price } from './kenya.js';

const fam = (def) => family({ reviewed: false, ...def });
const uniq = (...a) => new Set(a.map(x => (typeof x === 'number' ? round(x, 6) : x))).size === a.length;
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = randInt(0, i); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const rot = (a, k) => [...a.slice(k % a.length), ...a.slice(0, k % a.length)];
const optionsOf = (right, wrongs, k) => rot([{ text: right, right: true }, ...wrongs.map(([text, why]) => ({ text, right: false, why }))], k);
const hm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}${String(m % 60).padStart(2, '0')}`;
const retry = (f, n = 80) => () => { for (let i = 0; i < n; i++) { const r = f(); if (r) return r; } return null; };
const gcd = (a, b) => (b ? gcd(b, a % b) : a);


const fr = (n, d) => `${n}/${d}`;
const simp = (n, d) => { const g = gcd(n, d); return fr(n / g, d / g); };
const simpPart = (n, d) => { const g = gcd(n, d); return [n / g, d / g]; };
// Whole numbers of ten-thousandths shown as decimals with 4 places.
const T4 = (n) => (n / 10000).toFixed(4);
const digitsOf = (n) => String(n).padStart(7, '0').split('').map(Number);
const noCarry = (A, B) => { const a = digitsOf(A), b = digitsOf(B); return Number(a.map((x, i) => (x + b[i]) % 10).join('')); };

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const below1000 = (n) => {
  const s = [];
  if (n >= 100) { s.push(`${ONES[Math.floor(n / 100)]} hundred`); n %= 100; if (n) s.push('and'); }
  if (n >= 20) s.push(TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : ''));
  else if (n > 0) s.push(ONES[n]);
  return s.join(' ');
};
const words = (n) => {
  const m = Math.floor(n / 1e6), t = Math.floor(n / 1000) % 1000, u = n % 1000, s = [];
  if (m) s.push(`${below1000(m)} million`);
  if (t) s.push(`${below1000(t)} thousand`);
  if (u) s.push(`${(m || t) && u < 100 ? 'and ' : ''}${below1000(u)}`);
  return s.join(' ');
};
const TOWNS = ['Nyeri', 'Kitale', 'Embu', 'Machakos', 'Kericho', 'Garissa', 'Thika', 'Kakamega'];

export const FAMILIES = [
  // =========================================================== WHOLE NUMBERS
  fam({ id: 'g6.place.two-digits', skill: 'G6_PLACE_VALUE', outcome: 'G6.WHOLE.a', rung: 2, form: 'steps',
    draw: () => {
      const ds = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 7);
      const i = randInt(0, 4), j = randInt(i + 1, 5);
      return { ds, i, j, N: Number(ds.join('')) };
    },
    make: ({ ds, i, j, N }) => {
      const A = ds[i], B = ds[j], ea = 6 - i, eb = 6 - j, va = A * 10 ** ea, vb = B * 10 ** eb;
      return {
        question: `A county has ${commas(N)} people. Use place value to answer.`,
        parts: [
          { prompt: `What is the value of the digit ${A}?`, answer: va, hint: 'Say which place the digit is in: ones, tens, hundreds, thousands...', wrong: [[A, 'That is the digit itself. Its value depends on the place it sits in.'], [A * 10 ** (ea - 1), 'Count the places again from the ones place on the right.'], [A * 10 ** (ea + 1), 'Count the places again from the ones place on the right.']] },
          { prompt: `What is the value of the digit ${B}?`, answer: vb, hint: 'Do the same for this digit.', wrong: [[B, 'That is the digit itself. Its value depends on the place it sits in.'], [B * 10 ** (eb + 1), 'Count the places again from the ones place on the right.']] },
          { prompt: `What is the difference between the value of ${A} and the value of ${B}?`, answer: va - vb, unit: 'people', hint: 'Take the smaller value from the bigger value.', wrong: [[va + vb, 'The question asks for the difference, not the total.'], [A - B, 'Use the values of the digits, not the digits themselves.']] },
        ],
        hints: ['Each digit is worth its number times its place.', 'The digit in the thousands place is worth thousands.'],
        steps: [`${A} is in the ${commas(10 ** ea)}s place, so it is worth ${commas(va)}.`, `${B} is in the ${commas(10 ** eb)}s place, so it is worth ${commas(vb)}.`, `${commas(va)} − ${commas(vb)} = ${commas(va - vb)}.`],
      };
    },
    check: ({ ds, i, j }, v) => v[0] - v[1] === v[2] && String(v[0]).length === 7 - i && String(v[1]).length === 7 - j && String(v[0])[0] === String(ds[i]) }),

  fam({ id: 'g6.place.words-to-figures', skill: 'G6_PLACE_VALUE', outcome: 'G6.WHOLE.c', rung: 2, form: 'word',
    draw: () => { const M = randInt(1, 9), T = randInt(1, 999), U = randInt(1, 99); const N = M * 1e6 + T * 1e3 + U; return T === U ? null : { M, T, U, N, p: person() }; },
    make: ({ M, T, U, N, p }) => ({
      question: `${p.name}'s SACCO reports its savings as "${words(N)} shillings". Write the amount in figures.`,
      answer: N,
      wrong: [[Number(`${M}${T}${U}`), 'Each group of three digits needs all three places. A group with fewer digits needs zeros to fill the places.'], [M * 1e6 + T * 1e3, 'The last part of the amount has been left out.'], [M * 1e6 + U * 1e3 + T, 'The thousands and the ones have changed places. Match each number to its word.']],
      hints: ['Write the millions, then the thousands, then the rest, as three groups.', 'Each group after the millions has three digits. Fill empty places with zero.'],
      steps: [`${M} million is ${commas(M * 1e6)}.`, `${T} thousand is ${commas(T * 1e3)}, and the rest is ${U}.`, `Together: ${commas(N)}.`],
    }),
    check: ({ M, T, U }, a) => Math.floor(a / 1e6) === M && Math.floor(a / 1000) % 1000 === T && a % 1000 === U }),

  fam({ id: 'g6.place.figures-to-words', skill: 'G6_PLACE_VALUE', outcome: 'G6.WHOLE.c', rung: 2, form: 'direct',
    draw: () => {
      const M = randInt(1, 9), T = randInt(1, 999), U = randInt(1, 99), N = M * 1e6 + T * 1e3 + U;
      const sw = M * 1e6 + U * 1e3 + T, cc = Number(`${M}${T}${U}`), zs = M * 1e6 + T * 1e3 + U * 10;
      return uniq(N, sw, cc, zs) ? { N, sw, cc, zs, k: randInt(0, 3) } : null;
    },
    make: ({ N, sw, cc, zs, k }) => ({
      question: `Which of these shows ${commas(N)} in words?`, story: false,
      options: optionsOf(words(N), [[words(sw), 'The thousands and the ones have changed places. Read the number in groups of three digits from the right.'], [words(cc), 'A group of three digits has been squeezed into fewer places. Check the commas.'], [words(zs), 'The ones part is not the same size. Check the last group of digits.']], k),
      hints: ['Put commas to split the number into groups of three from the right.', 'Read the millions group, then the thousands group, then the last group.'],
      steps: [`${commas(N)} has three groups: millions, thousands and the last three digits.`, `In words: ${words(N)}.`],
    }) }),

  fam({ id: 'g6.whole.round-stadium', skill: 'G6_PLACE_VALUE', outcome: 'G6.WHOLE.e', rung: 2, form: 'word',
    draw: () => {
      const pl = pick([100, 1000, 10000]), N = randInt(11000, 98999);
      if (N % pl === pl / 2) return null;
      const ans = Math.round(N / pl) * pl;
      const other = ans === Math.floor(N / pl) * pl ? Math.ceil(N / pl) * pl : Math.floor(N / pl) * pl;
      const finer = Math.round(N / (pl / 10)) * (pl / 10), coarser = Math.round(N / (pl * 10)) * (pl * 10);
      return uniq(ans, other, finer, coarser, N) ? { pl, N, ans, other, finer, coarser, town: pick(TOWNS) } : null;
    },
    make: ({ pl, N, ans, other, finer, coarser, town }) => {
      const name = { 100: 'hundred', 1000: 'thousand', 10000: 'ten thousand' }[pl];
      return {
        question: `A football stadium in ${town} holds ${commas(N)} fans. A newspaper rounds this to the nearest ${name}. What number does it print?`,
        answer: ans,
        wrong: [[other, 'Look at the digit just to the right of the rounding place. 5 or more rounds up. Less than 5 rounds down.'], [finer, `That rounds to a smaller place. The question names the nearest ${name}.`], [coarser, `That rounds to a bigger place. The question names the nearest ${name}.`]],
        hints: [`Find the ${name}s digit in the number.`, 'Look at the digit to its right. 5 or more means round up.'],
        steps: [`The number is between ${commas(Math.floor(N / pl) * pl)} and ${commas(Math.floor(N / pl) * pl + pl)}.`, `${commas(N)} is nearer to ${commas(ans)}.`],
      };
    },
    check: ({ pl, N }, a) => a % pl === 0 && Math.abs(N - a) < pl / 2 }),

  fam({ id: 'g6.whole.round-spot', skill: 'G6_PLACE_VALUE', outcome: 'G6.WHOLE.e', rung: 3, form: 'spot',
    draw: () => { const pl = pick([100, 1000, 10000]); const N = randInt(11000, 98999); return N % pl === 0 ? null : { pl, N, p: person() }; },
    make: ({ pl, N, p }) => {
      const pname = { 100: 'hundreds', 1000: 'thousands', 10000: 'ten thousands' }[pl];
      const rname = { 100: 'tens', 1000: 'hundreds', 10000: 'thousands' }[pl];
      const base = Math.floor(N / pl), X = base % 10, Y = Math.floor(N / (pl / 10)) % 10;
      const trueUp = Y >= 5, childUp = !trueUp;
      const childResult = (base + (childUp ? 1 : 0)) * pl;
      return {
        question: `${p.name} rounded ${commas(N)} to the nearest ${pname.replace(/s$/, '')}. Which step has the mistake?`,
        working: [
          { text: `The digit in the ${pname} place is ${X}.`, ok: X === base % 10 },
          { text: `The digit to its right, in the ${rname} place, is ${Y}.`, ok: Y === Math.floor(N / (pl / 10)) % 10 },
          { text: `${Y} is ${Y >= 5 ? '5 or more' : 'less than 5'}, so the ${X} ${childUp ? 'goes up by 1' : 'stays the same'}.`, ok: childUp === trueUp },
          { text: `So ${commas(N)} rounds to ${commas(childResult)}.`, ok: childResult === (base + (childUp ? 1 : 0)) * pl },
        ],
        fix: `${Y} is ${Y >= 5 ? '5 or more, so the digit must go up by 1' : 'less than 5, so the digit must stay the same'}. The answer is ${commas(Math.round(N / pl) * pl)}.`,
        hints: ['Check each step against the one before it.', 'The rule: 5 or more rounds up, less than 5 stays.'],
        steps: [`Round ${commas(N)} to the nearest ${pname.replace(/s$/, '')}: ${commas(Math.round(N / pl) * pl)}.`, 'Look only at the digit to the right of the rounding place.'],
      };
    } }),

  fam({ id: 'g6.squares.root-plot', skill: 'G6_SQUARES', outcome: 'G6.WHOLE.g', rung: 2, form: 'word',
    draw: () => { const n = randInt(11, 100), A = n * n; return { n, A, p: person(), alt: n <= 90 ? n + 10 : n - 10 }; },
    make: ({ n, A, p, alt }) => ({
      question: `${p.name}'s square shamba covers ${commas(A)} m². Find the square root of ${commas(A)} to get the length of one side, in metres.`,
      answer: n,
      wrong: [[A / 2, 'Halving the area does not give the side. The side times itself must give the area.'], [A / 4, 'Dividing by 4 finds a side from a perimeter. Here the area is given.'], [alt, 'Close, but multiply your answer by itself to check it.']],
      hints: ['A square plot has equal sides. Side × side = area.', 'Which number multiplied by itself makes the area?'],
      steps: [`Side × side = ${commas(A)} m².`, `${n} × ${n} = ${commas(A)}, so the side is ${n} m.`],
    }),
    check: ({ A }, a) => a * a === A }),

  fam({ id: 'g6.squares.not-square', skill: 'G6_SQUARES', outcome: 'G6.WHOLE.g', rung: 3, form: 'why',
    draw: () => { const d = pick([2, 3, 7, 8]); const N = randInt(100, 999) * 10 + d; return { N, d, k: randInt(0, 3) }; },
    make: ({ N, d, k }) => ({
      question: `${commas(N)} is not a perfect square, so it has no whole number square root. Which reason is correct?`,
      options: optionsOf(`A perfect square never ends in 2, 3, 7 or 8, and ${commas(N)} ends in ${d}`, [
        ['A perfect square must be an odd number', 'Squares can be even too. 4, 16 and 36 are even.'],
        [`It is bigger than 1,000, and perfect squares stop at 1,000`, 'Perfect squares go on without end: 32 × 32 = 1,024.'],
        ['A perfect square must end in 0', 'Many squares end in other digits, such as 25 and 49.']], k),
      hints: ['Think about the last digit of 1², 2², 3² up to 9².', 'Which digits can a square end in?'],
      steps: ['The squares of 1 to 9 are 1, 4, 9, 16, 25, 36, 49, 64, 81.', `Their last digits are only 1, 4, 9, 6, 5, 0. A number ending in ${d} cannot be a square.`],
    }) }),

  fam({ id: 'g6.squares.seeds-left', skill: 'G6_SQUARES', outcome: 'G6.WHOLE.f', rung: 2, form: 'word',
    draw: () => { const n = randInt(4, 12), extra = randInt(5, 40); return { n, extra, total: n * n + extra, p: person() }; },
    make: ({ n, extra, total, p }) => ({
      question: `${p.name} plants bean seeds in a square: ${n} rows with ${n} seeds in each row. ${p.She} began with ${total} seeds. How many seeds are left?`,
      answer: extra,
      wrong: [[n * n, 'That is the number planted. The question asks how many are left over.'], [total - 2 * n, 'The number planted is n rows of n seeds, which is n × n, not 2 × n.'], [total - n, 'One row only has been taken away. All the rows were planted.']],
      hints: ['Find how many seeds go in the square first.', `Then take that from the seeds ${p.she} began with.`],
      steps: [`Planted: ${n} × ${n} = ${n * n}.`, `Left: ${total} − ${n * n} = ${extra}.`],
    }),
    check: ({ n, total }, a) => a + n * n === total }),

  // =========================================================== MULTIPLICATION
  fam({ id: 'g6.mul.estimate-cost', skill: 'G6_MULTIPLICATION', outcome: 'G6.MUL.b', rung: 2, form: 'word',
    draw: () => {
      const item = pick(['bag of maize', 'sack of potatoes']), a = price(item), b = randInt(21, 79);
      if (b % 10 === 5 || Math.abs((a % 1000) - 500) < 100) return null;
      const ra = Math.round(a / 1000) * 1000, rb = Math.round(b / 10) * 10;
      const w = [a * b, ra * b, Math.floor(a / 1000) * 1000 * Math.floor(b / 10) * 10];
      return uniq(ra * rb, ...w) ? { item, a, b, ra, rb, p: person() } : null;
    },
    make: ({ item, a, b, ra, rb, p }) => ({
      question: `A cooperative buys ${b} ${item === 'bag of maize' ? 'bags of maize' : 'sacks of potatoes'}. Each costs ${sh(a)}. Estimate the total cost. Round the price to the nearest thousand shillings and the number to the nearest ten.`,
      answer: ra * rb,
      wrong: [[a * b, 'That is the exact cost. An estimate rounds first, then multiplies.'], [ra * b, 'Only the price was rounded. Round the number of bags to the nearest ten too.'], [Math.floor(a / 1000) * 1000 * Math.floor(b / 10) * 10, 'Both numbers were rounded down. Look at the next digit to decide.']],
      hints: ['Round each number first.', 'Multiply the two rounded numbers.'],
      steps: [`${commas(a)} rounds to ${commas(ra)}, and ${b} rounds to ${rb}.`, `${commas(ra)} × ${rb} = ${commas(ra * rb)}.`],
    }),
    check: ({ a, b }, v) => Math.abs(v - a * b) < 0.4 * a * b && v % 10000 === 0 && v / 10000 >= 1 }),

  fam({ id: 'g6.mul.estimate-pick', skill: 'G6_MULTIPLICATION', outcome: 'G6.MUL.b', rung: 1, form: 'direct',
    draw: () => {
      const a = randInt(1500, 9500), b = randInt(21, 89);
      if (a % 1000 > 400 && a % 1000 < 600) return null;
      if (b % 10 === 5) return null;
      const ra = Math.round(a / 1000) * 1000, rb = Math.round(b / 10) * 10;
      const e = ra * rb, lowZero = e / 10, down = Math.floor(a / 1000) * 1000 * Math.floor(b / 10) * 10, added = ra + rb;
      return uniq(e, lowZero, down, added) ? { a, b, e, lowZero, down, added, k: randInt(0, 3) } : null;
    },
    make: ({ a, b, e, lowZero, down, added, k }) => ({
      question: `Which is the best estimate of ${commas(a)} × ${b}?`, story: false,
      options: optionsOf(commas(e), [[commas(lowZero), 'A zero has been lost. Count the zeros in the rounded numbers.'], [commas(down), 'Both numbers were rounded down. Round to the nearest instead.'], [commas(added), 'The question is a multiplication. Multiply the rounded numbers.']], k),
      hints: ['Round the big number to the nearest thousand and the small number to the nearest ten.', 'Then multiply, and count the zeros carefully.'],
      steps: [`${commas(a)} is close to ${commas(Math.round(a / 1000) * 1000)}, and ${b} is close to ${Math.round(b / 10) * 10}.`, `The estimate is ${commas(e)}.`],
    }) }),

  fam({ id: 'g6.mul.estimate-spot', skill: 'G6_MULTIPLICATION', outcome: 'G6.MUL.b', rung: 3, form: 'spot',
    draw: () => {
      const a = randInt(2100, 8900), b = randInt(21, 89), kind = pick(['round', 'product']);
      if (a % 1000 > 400 && a % 1000 < 600) return null;
      if (b % 10 === 5 || b % 10 === 0 || (kind === 'round' && b % 10 < 5)) return null;
      return { a, b, kind, p: person() };
    },
    make: ({ a, b, kind, p }) => {
      const ra = Math.round(a / 1000) * 1000, rb = Math.round(b / 10) * 10, lowerB = Math.floor(b / 10) * 10;
      const shownB = kind === 'round' ? lowerB : rb;
      const prod = ra * shownB;
      const shownProd = kind === 'product' ? prod / 10 : prod;
      const fixed = ra * rb;
      return {
        question: `${p.name} estimated ${commas(a)} × ${b} by rounding. Which step has the mistake?`,
        working: [
          { text: `${commas(a)} is closest to ${commas(ra)}.`, ok: ra === Math.round(a / 1000) * 1000 },
          { text: `${b} is closest to ${shownB}.`, ok: shownB === Math.round(b / 10) * 10 },
          { text: `${commas(ra)} × ${shownB} = ${commas(shownProd)}.`, ok: shownProd === ra * shownB },
          { text: `The estimate is about ${commas(shownProd)}.`, ok: true },
        ],
        fix: kind === 'round' ? `${b} is closer to ${rb} than to ${lowerB}. The estimate is ${commas(fixed)}.` : `${commas(ra)} × ${shownB} is ${commas(prod)}. A zero was lost. The estimate is ${commas(fixed)}.`,
        hints: ['Do each step again and compare.', 'Round each number to its nearest ten or thousand.'],
        steps: [`${commas(ra)} × ${rb} = ${commas(fixed)}.`, 'Round both numbers correctly, then multiply and count the zeros.'],
      };
    } }),

  fam({ id: 'g6.pattern.growth', skill: 'G6_PATTERNS', outcome: 'G6.MUL.c', rung: 2, form: 'word',
    draw: () => { const a = randInt(2, 5), r = randInt(2, 4), n = randInt(4, 5); const v = a * r ** (n - 1); return uniq(v, a * r, a + r * (n - 1), a * r ** n) ? { a, r, n, v, p: person() } : null; },
    make: ({ a, r, n, v, p }) => ({
      question: `${p.name} plants ${a} trees in week 1 and follows a pattern. Each week ${p.she} plants ${r} times as many trees as the week before. How many trees does ${p.she} plant in week ${n}?`,
      answer: v,
      wrong: [[a + r * (n - 1), 'The numbers are multiplied each week, not added to.'], [a * r, 'That is only week 2. Keep multiplying until week ' + n + '.'], [a * r ** n, 'One multiplication too many. Week 1 is the start.']],
      hints: ['Write the number of trees for each week in a row.', `Multiply by ${r} to move from one week to the next.`],
      steps: Array.from({ length: n }, (_, i) => `Week ${i + 1}: ${a * r ** i} trees.`),
    }),
    check: ({ a, r, n }, x) => { let t = x; for (let i = 0; i < n - 1; i++) { if (t % r) return false; t /= r; } return t === a; } }),

  fam({ id: 'g6.pattern.table-rule', skill: 'G6_PATTERNS', outcome: 'G6.MUL.c', rung: 3, form: 'table',
    draw: () => { const a = randInt(2, 5), r = pick([2, 3]); const v6 = a * r ** 5; return uniq(v6, a * r ** 4, a * r ** 3 + 2 * (a * r ** 3 - a * r ** 2), a * 6) ? { a, r, v6 } : null; },
    make: ({ a, r, v6 }) => ({
      question: 'The table shows the number of tiles in each row of a pattern. Each number comes from the one before it by multiplying. How many tiles are in row 6?',
      model: { type: 'table', data: { head: ['Row', 'Tiles'], rows: [1, 2, 3, 4].map(i => ({ label: `Row ${i}`, value: String(a * r ** (i - 1)) })) } },
      answer: v6,
      wrong: [[a * r ** 4, 'That is row 5. Keep going to row 6.'], [a * r ** 3 + 2 * (a * r ** 3 - a * r ** 2), 'The numbers grow by more each time. Find what each is multiplied by.'], [a * 6, 'The rows are not multiples of the first number. Find what each number is multiplied by.']],
      hints: ['Divide row 2 by row 1 to find the multiplier.', 'Multiply again for rows 5 and 6.'],
      steps: [`Row 2 ÷ row 1 = ${r}, so each row is ${r} times the one before.`, `Row 5 = ${a * r ** 4}, row 6 = ${a * r ** 4} × ${r} = ${v6}.`],
    }),
    check: ({ a, r }, v) => v / r ** 5 === a }),

  fam({ id: 'g6.pattern.rule-pick', skill: 'G6_PATTERNS', outcome: 'G6.MUL.c', rung: 2, form: 'direct',
    draw: () => { const a = randInt(2, 6), r = randInt(2, 5); return uniq(a, r, a * r - a, r + 1) && a !== r && a * r - a !== r ? { a, r, k: randInt(0, 3) } : null; },
    make: ({ a, r, k }) => ({
      question: `Which rule makes this pattern: ${a}, ${a * r}, ${a * r * r}, ${a * r ** 3}, ...?`, story: false,
      options: optionsOf(`Multiply by ${r} each time`, [[`Add ${a * r - a} each time`, `Check the second step. ${a * r} to ${a * r * r} is not an add of ${a * r - a}.`], [`Multiply by ${a} each time`, `${a} is the first number. Divide the second number by the first to find the multiplier.`], [`Add ${r} each time`, 'The numbers jump by more each time. That is multiplying.']], k),
      hints: ['Divide each number by the one before it.', 'Does the same rule work for every step?'],
      steps: [`${a * r} ÷ ${a} = ${r}, and ${a * r * r} ÷ ${a * r} = ${r}.`, `The rule is: multiply by ${r}.`],
    }) }),

  // =========================================================== DIVISION
  fam({ id: 'g6.div.estimate-trips', skill: 'G6_DIVISION', outcome: 'G6.DIV.b', rung: 2, form: 'word',
    draw: () => {
      const rd = pick([20, 30, 40, 50, 60, 80]), q = randInt(15, 150);
      const rt = rd * q;
      if (rt % 100 || rt < 1000 || rt > 9900) return null;
      const T = rt + pick([-37, -22, -14, 13, 26, 41]), D = rd + pick([-4, -3, -2, 2, 3, 4]);
      const wr = [q * 10, rt - rd, Math.round(rt / (rd + 10))];
      return uniq(q, ...wr) ? { T, D, rt, rd, q, c: pick([['mandazis', 'boxes', 'box'], ['eggs', 'trays', 'tray'], ['oranges', 'bags', 'bag']]), p: person() } : null;
    },
    make: ({ T, D, rt, rd, q, c, p }) => ({
      question: `${p.name} packs ${commas(T)} ${c[0]} into ${c[1]}. Each ${c[2]} holds ${D}. Estimate how many ${c[1]} are needed. Round ${commas(T)} to the nearest hundred and ${D} to the nearest ten.`,
      answer: q,
      wrong: [[q * 10, 'Count the zeros again when you divide.'], [rt - rd, 'The question asks how many groups fit in the total. That is a division.'], [Math.round(rt / (rd + 10)), 'The number in each group was rounded to the wrong ten. Check which ten is nearest.']],
      hints: ['Round both numbers first.', 'Divide the rounded total by the rounded number in each group.'],
      steps: [`${commas(T)} rounds to ${commas(rt)}, and ${D} rounds to ${rd}.`, `${commas(rt)} ÷ ${rd} = ${q}.`],
    }),
    check: ({ T, D }, a) => Math.abs(a - T / D) < 0.25 * (T / D) + 1 }),

  fam({ id: 'g6.div.estimate-pick', skill: 'G6_DIVISION', outcome: 'G6.DIV.b', rung: 1, form: 'direct',
    draw: retry(() => {
      const rd = pick([20, 30, 40, 50, 60]), q = randInt(20, 190);
      const rt = rd * q;
      if (rt % 100 || rt < 1000) return null;
      const T = rt + pick([-31, -18, 12, 27]), D = rd + pick([-3, -2, 2, 3]);
      const wrongs = [q * 10, q / 10, Math.round(rt / (rd + 10))];
      return Number.isInteger(q / 10) && uniq(q, ...wrongs) ? { T, D, q, rt, rd, wrongs, k: randInt(0, 3) } : null;
    }),
    make: ({ T, D, q, rt, rd, wrongs, k }) => ({
      question: `Which is the best estimate of ${commas(T)} ÷ ${D}?`, story: false,
      options: optionsOf(`About ${commas(q)}`, [[`About ${commas(wrongs[0])}`, 'A zero was added by mistake. Count the zeros when you divide.'], [`About ${commas(wrongs[1])}`, 'A zero was lost. Count the zeros when you divide.'], [`About ${commas(wrongs[2])}`, 'The divisor was rounded to the wrong ten.']], k),
      hints: ['Round the big number to the nearest hundred and the divisor to the nearest ten.', 'Divide the rounded numbers.'],
      steps: [`${commas(T)} is close to ${commas(rt)}, and ${D} is close to ${rd}.`, `The estimate is about ${commas(q)}.`],
    }),
    check: ({ T, D, q }) => Math.abs(q - T / D) < 0.25 * q + 1 }),

  fam({ id: 'g6.div.bodmas-pick', skill: 'G6_DIVISION', outcome: 'G6.DIV.c', rung: 2, form: 'direct',
    draw: () => {
      const mul = pick([true, false]), add = pick([true, false]), c = randInt(2, 9), q = randInt(2, 9), a = randInt(12, 60);
      const b = mul ? q : q * c, part = mul ? b * c : q;
      const right = add ? a + part : a - part;
      const left = mul ? (add ? (a + b) * c : (a - b) * c) : (add ? (a + b) / c : (a - b) / c);
      const wrongSign = add ? a - part : a + part;
      return Number.isInteger(left) && right > 0 && uniq(right, left, part, wrongSign) ? { mul, add, a, b, c, part, right, left, wrongSign, k: randInt(0, 3) } : null;
    },
    make: ({ mul, add, a, b, c, part, right, left, wrongSign, k }) => {
      const op1 = add ? '+' : '−', op2 = mul ? '×' : '÷';
      return {
        question: `Use the BODMAS rule to work out ${a} ${op1} ${b} ${op2} ${c}.`, story: false,
        options: optionsOf(String(right), [[String(left), 'That works from left to right. Multiplication and division come before addition and subtraction.'], [String(part), 'The first number was left out. Finish the whole sum.'], [String(wrongSign), 'Check whether to add or to take away the answer of the first operation.']], k),
        hints: ['Which comes first in BODMAS: multiply or divide, or add or subtract?', 'Work out that part first, then do the last operation.'],
        steps: [`${b} ${op2} ${c} = ${part} comes first.`, `Then ${a} ${op1} ${part} = ${right}.`],
      };
    } }),

  // =========================================================== FRACTIONS
  fam({ id: 'g6.fadd.flour', skill: 'G6_FRACTIONS_ADD', outcome: 'G6.FRAC.a', rung: 2, form: 'word',
    draw: () => {
      const [d1, d2] = pick([[2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [2, 7], [3, 7]]);
      const n1 = randInt(1, d1 - 1), n2 = randInt(1, d2 - 1);
      if (gcd(n1, d1) > 1 || gcd(n2, d2) > 1 || n1 / d1 + n2 / d2 >= 1) return null;
      const N = n1 * d2 + n2 * d1, D = d1 * d2, right = simp(N, D);
      const w = [fr(n1 + n2, d1 + d2), simp(n1 + n2, D), simp(n1 * n2, D)];
      return uniq(right, ...w) ? { n1, d1, n2, d2, right, w, thing: pick(['flour', 'sugar', 'rice']), p: person(), k: randInt(0, 3) } : null;
    },
    make: ({ n1, d1, n2, d2, right, w, thing, p, k }) => ({
      question: `${p.name} uses ${fr(n1, d1)} of a bag of ${thing} on Monday and ${fr(n2, d2)} of the bag on Tuesday. What fraction of the bag has been used?`,
      options: optionsOf(right, [[w[0], 'The tops and the bottoms were both added. The pieces must be the same size first.'], [w[1], 'The bottoms were changed, but the tops were added without changing. Change both tops to match.'], [w[2], 'That multiplies the tops. The question asks for the two amounts together.']], k),
      hints: ['Change both fractions to the same denominator.', 'Then add only the numerators.'],
      steps: [`Common denominator: ${d1 * d2}.`, `${fr(n1, d1)} = ${fr(n1 * d2, d1 * d2)} and ${fr(n2, d2)} = ${fr(n2 * d1, d1 * d2)}.`, `${n1 * d2} + ${n2 * d1} = ${n1 * d2 + n2 * d1}, so ${right} of the bag.`],
    }) }),

  fam({ id: 'g6.fadd.steps', skill: 'G6_FRACTIONS_ADD', outcome: 'G6.FRAC.a', rung: 2, form: 'steps',
    draw: () => {
      const [d1, d2] = pick([[2, 3], [3, 4], [3, 5], [4, 5], [2, 5], [5, 6], [3, 7]]);
      const n1 = randInt(1, d1 - 1), n2 = randInt(1, d2 - 1);
      return gcd(n1, d1) > 1 || gcd(n2, d2) > 1 ? null : { n1, d1, n2, d2 };
    },
    make: ({ n1, d1, n2, d2 }) => {
      const D = d1 * d2, a = n1 * d2, b = n2 * d1;
      return {
        question: `Add ${fr(n1, d1)} + ${fr(n2, d2)} in steps.`, story: false,
        parts: [
          { prompt: `Find a common denominator for ${d1} and ${d2}. What is it?`, answer: D, hint: `Both ${d1} and ${d2} must divide into it.`, wrong: [[d1 + d2, 'That adds the denominators. Find a number both denominators divide into.']] },
          { prompt: `Write ${fr(n1, d1)} with that denominator. What is the new numerator?`, answer: a, hint: `Multiply the top by the same number as the bottom.`, wrong: [[n1, 'The top must be multiplied too, so the fraction keeps its value.']] },
          { prompt: `Write ${fr(n2, d2)} with that denominator. What is the new numerator?`, answer: b, hint: 'Do the same for the second fraction.', wrong: [[n2, 'The top must be multiplied too, so the fraction keeps its value.']] },
          { prompt: 'Add the fractions. What is the numerator of the answer?', answer: a + b, hint: 'Add the new numerators. The denominator stays.', wrong: [[n1 + n2, 'Use the new numerators, not the old ones.']] },
        ],
        hints: ['Same denominator first, then add the tops.', `${d1} × ${d2} works as a common denominator.`],
        steps: [`Common denominator: ${D}.`, `${fr(n1, d1)} = ${fr(a, D)}, ${fr(n2, d2)} = ${fr(b, D)}.`, `${a} + ${b} = ${a + b}, so the answer is ${fr(a + b, D)}.`],
      };
    },
    check: ({ n1, d1, n2, d2 }, v) => v[0] % d1 === 0 && v[0] % d2 === 0 && v[1] * d1 === n1 * v[0] && v[2] * d2 === n2 * v[0] && v[3] === v[1] + v[2] }),

  fam({ id: 'g6.fadd.why', skill: 'G6_FRACTIONS_ADD', outcome: 'G6.FRAC.a', rung: 3, form: 'why',
    draw: () => {
      const [d1, d2] = pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5]]);
      const n1 = randInt(1, d1 - 1), n2 = randInt(1, d2 - 1);
      return gcd(n1, d1) > 1 || gcd(n2, d2) > 1 ? null : { n1, d1, n2, d2, p: person(), k: randInt(0, 3) };
    },
    make: ({ n1, d1, n2, d2, p, k }) => ({
      question: `${p.name} says ${fr(n1, d1)} + ${fr(n2, d2)} = ${fr(n1 + n2, d1 + d2)}. Why is this wrong?`,
      options: optionsOf('The pieces are different sizes, so the bottoms must match first', [
        [`Nothing is wrong, because you add the tops and add the bottoms`, `${fr(n1 + n2, d1 + d2)} is smaller than the bigger fraction, but adding must make a bigger answer.`],
        ['The two fractions must be multiplied together, not added', 'Multiplying a fraction by a fraction gives a smaller amount. The question asks for the two amounts together.'],
        ['The tops should be multiplied and the bottoms should be added', 'That mixes two rules. The pieces must be the same size before you add.']], k),
      hints: ['Compare the answer with the bigger of the two fractions. Is it bigger?', 'Pieces can only be added when they are the same size.'],
      steps: ['Fractions with different denominators show pieces of different sizes.', 'Change both to the same denominator, then add the numerators only.'],
    }) }),

  fam({ id: 'g6.fsub.jerrycan', skill: 'G6_FRACTIONS_SUB', outcome: 'G6.FRAC.a', rung: 2, form: 'word',
    draw: retry(() => {
      const d1 = pick([6, 8, 10, 12]), d2 = pick([2, 3, 4, 5].filter(x => d1 % x === 0)), k = d1 / d2;
      const n2 = randInt(1, d2 - 1), n1 = randInt(n2 * k + 1, d1 - 1);
      if (n1 >= d1 || gcd(n2, d2) > 1 || gcd(n1, d1) > 1) return null;
      const right = simp(n1 - n2 * k, d1), w = [simp(n1 - n2, d1 - d2), simp(n1 - n2, d1), simp(n1 + n2 * k, d1)];
      return uniq(right, ...w) && n1 + n2 * k < d1 && n1 - n2 !== d1 - d2 && n1 - n2 * k !== d1 - d2 ? { n1, d1, n2, d2, k, right, w, p: person(), q: randInt(0, 3) } : null;
    }),
    make: ({ n1, d1, n2, d2, k, right, w, p, q }) => ({
      question: `A jerrycan is ${fr(n1, d1)} full of water. ${p.name} uses ${fr(n2, d2)} of the jerrycan to wash clothes. What fraction of the jerrycan is left?`,
      options: optionsOf(right, [[w[0], 'Tops and bottoms were both taken away. The pieces must be the same size first.'], [w[1], `Only ${fr(n1, d1)} was changed. Change ${fr(n2, d2)} to the same denominator first.`], [w[2], 'Using water takes it away. Subtract.']], q),
      hints: ['Change both fractions to the same denominator.', 'Then take the second numerator from the first.'],
      steps: [`${fr(n2, d2)} = ${fr(n2 * k, d1)}.`, `${n1} − ${n2 * k} = ${n1 - n2 * k}, so ${fr(n1 - n2 * k, d1)} is left. Simplest form: ${right}.`],
    }) }),

  fam({ id: 'g6.fsub.spot', skill: 'G6_FRACTIONS_SUB', outcome: 'G6.FRAC.a', rung: 3, form: 'spot',
    draw: () => {
      const d1 = pick([6, 8, 10, 12]), d2 = pick([2, 3, 4, 5].filter(x => d1 % x === 0)), k = d1 / d2;
      const n2 = randInt(1, d2 - 1), n1 = randInt(n2 * k + 1, d1 - 1);
      return n1 >= d1 || gcd(n2, d2) > 1 || gcd(n1, d1) > 1 ? null : { n1, d1, n2, d2, k, p: person() };
    },
    make: ({ n1, d1, n2, d2, k, p }) => {
      const shown = n2, diff = n1 - shown;
      return {
        question: `${p.name} worked out ${fr(n1, d1)} − ${fr(n2, d2)}. Which step has the mistake?`,
        working: [
          { text: `The denominators are ${d1} and ${d2}. ${d1} is a multiple of ${d2}.`, ok: d1 % d2 === 0 },
          { text: `Change ${fr(n2, d2)} to a fraction with denominator ${d1}: ${fr(n2, d2)} = ${fr(shown, d1)}.`, ok: shown === n2 * k },
          { text: `${fr(n1, d1)} − ${fr(shown, d1)} = ${fr(diff, d1)}.`, ok: diff === n1 - shown },
          { text: `So ${fr(n1, d1)} − ${fr(n2, d2)} = ${fr(diff, d1)}.`, ok: true },
        ],
        fix: `Changing the denominator from ${d2} to ${d1} means multiplying both numerator and denominator by ${k}. So ${fr(n2, d2)} = ${fr(n2 * k, d1)}, and the answer is ${fr(n1 - n2 * k, d1)}.`,
        hints: ['Check each step against the one before it.', 'Both the top and the bottom must be multiplied by the same number.'],
        steps: [`${fr(n2, d2)} = ${fr(n2 * k, d1)}.`, `${n1} − ${n2 * k} = ${n1 - n2 * k}, so ${fr(n1 - n2 * k, d1)}.`],
      };
    } }),

  fam({ id: 'g6.mixed.add-cloth', skill: 'G6_MIXED_NUMBERS', outcome: 'G6.FRAC.c', rung: 2, form: 'word',
    draw: () => {
      const w1 = randInt(1, 5), w2 = randInt(1, 5), a = randInt(1, 3), b = randInt(1, 3);
      if (a + b < 5) return null;
      const r = a + b - 4, W = w1 + w2;
      const right = `${W + 1} ${simp(r, 4)}`, ws = [`${W} ${simp(r, 4)}`, `${W} ${fr(a + b, 4)}`, `${W} ${fr(simpPart(a, 4)[0] + simpPart(b, 4)[0], simpPart(a, 4)[1] + simpPart(b, 4)[1])}`];
      return uniq(right, ...ws) ? { w1, w2, a, b, right, ws, p: person(), k: randInt(0, 3), thing: pick([['cloth', 'm'], ['rope', 'm'], ['beans', 'kg']]) } : null;
    },
    make: ({ w1, w2, a, b, right, ws, p, k, thing }) => ({
      question: `${p.name} has ${w1} ${simp(a, 4)} ${thing[1]} of ${thing[0]} and gets ${w2} ${simp(b, 4)} ${thing[1]} more. How much ${thing[0]} does ${p.she} have now?`,
      options: optionsOf(`${right} ${thing[1]}`, [[`${ws[0]} ${thing[1]}`, 'The fractions add up to more than 1 whole. That extra whole must be added in.'], [`${ws[1]} ${thing[1]}`, 'The fraction part is more than 1 whole. Change it to a whole number and a smaller fraction.'], [`${ws[2]} ${thing[1]}`, 'The tops and bottoms were both added. Use the same denominator and add only the tops.']], k),
      hints: ['Add the whole numbers, then add the fractions.', 'If the fractions make more than 1, move the extra whole to the whole numbers.'],
      steps: [`Wholes: ${w1} + ${w2} = ${w1 + w2}.`, `Fractions: ${fr(a, 4)} + ${fr(b, 4)} = ${fr(a + b, 4)}, which is 1 whole and ${simp(a + b - 4, 4)}.`, `Total: ${right} ${thing[1]}.`],
    }) }),

  fam({ id: 'g6.mixed.sub-quarters', skill: 'G6_MIXED_NUMBERS', outcome: 'G6.FRAC.c', rung: 3, form: 'steps',
    draw: () => {
      const w1 = randInt(3, 8), w2 = randInt(1, w1 - 2), a = randInt(1, 3), b = randInt(1, 3);
      return a < b ? { w1, w2, a, b, p: person(), thing: pick(['sugar', 'flour', 'rice']) } : null;
    },
    make: ({ w1, w2, a, b, p, thing }) => {
      const N1 = w1 * 4 + a, N2 = w2 * 4 + b, left = N1 - N2;
      return {
        question: `A shop has ${w1} ${simp(a, 4)} kg of ${thing}. ${p.name} buys ${w2} ${simp(b, 4)} kg. Work out how much is left, in steps.`,
        parts: [
          { prompt: `How many quarters of a kilogram are in ${w1} ${simp(a, 4)} kg?`, answer: N1, hint: 'Each whole kilogram is 4 quarters.', wrong: [[w1 + a, 'Each whole is 4 quarters, so multiply the wholes by 4 first.']] },
          { prompt: `How many quarters of a kilogram are in ${w2} ${simp(b, 4)} kg?`, answer: N2, hint: 'Do the same for the second amount.', wrong: [[w2 + b, 'Each whole is 4 quarters, so multiply the wholes by 4 first.']] },
          { prompt: 'How many quarters are left?', answer: left, hint: 'Take the smaller number of quarters from the bigger.', wrong: [[N1 + N2, 'Buying takes sugar away. Subtract.']] },
          { prompt: 'Write the amount left as a decimal number of kilograms.', answer: left / 4, unit: 'kg', hint: 'Divide the quarters by 4.', wrong: [[left, 'That is the number of quarters. Four quarters make one kilogram.']] },
        ],
        hints: ['Change both amounts to quarters first.', 'Subtract the quarters, then change back.'],
        steps: [`${w1} ${simp(a, 4)} = ${N1} quarters, and ${w2} ${simp(b, 4)} = ${N2} quarters.`, `${N1} − ${N2} = ${left} quarters.`, `${left} ÷ 4 = ${left / 4} kg.`],
      };
    },
    check: ({ a, b }, v) => v[0] - v[1] === v[2] && v[3] * 4 === v[2] && v[0] % 4 === a && v[1] % 4 === b }),

  fam({ id: 'g6.mixed.convert-spot', skill: 'G6_MIXED_NUMBERS', outcome: 'G6.FRAC.c', rung: 3, form: 'spot',
    draw: () => { const d = randInt(3, 9), n = randInt(1, d - 1), w = randInt(2, 6); return gcd(n, d) > 1 ? null : { d, n, w, p: person() }; },
    make: ({ d, n, w, p }) => {
      const s1 = w * n, s2 = s1 + n;
      return {
        question: `${p.name} changed ${w} ${fr(n, d)} to an improper fraction. Which step has the mistake?`,
        working: [
          { text: `Multiply the whole number by the numerator: ${w} × ${n} = ${s1}.`, ok: s1 === w * d },
          { text: `Add the numerator: ${s1} + ${n} = ${s2}.`, ok: s2 === s1 + n },
          { text: `Keep the denominator: ${fr(s2, d)}.`, ok: true },
          { text: `So ${w} ${fr(n, d)} = ${fr(s2, d)}.`, ok: true },
        ],
        fix: `The whole number must be multiplied by the denominator (${d}), because each whole has ${d} parts. The answer is ${fr(w * d + n, d)}.`,
        hints: ['Each whole number is a number of equal parts. How many parts is each whole?', 'Check each step against the one before it.'],
        steps: [`${w} × ${d} = ${w * d} parts, plus ${n} parts is ${w * d + n} parts.`, `${w} ${fr(n, d)} = ${fr(w * d + n, d)}.`],
      };
    } }),

  fam({ id: 'g6.recip.pick', skill: 'G6_MIXED_NUMBERS', outcome: 'G6.FRAC.e', rung: 1, form: 'direct',
    draw: () => {
      const n = randInt(2, 9), d = randInt(2, 9);
      if (n === d || gcd(n, d) > 1) return null;
      const w = [`−${fr(n, d)}`, fr(d - n > 0 ? d - n : n - d, d), `1/${n}`];
      return uniq(fr(d, n), ...w) ? { n, d, w, k: randInt(0, 3) } : null;
    },
    make: ({ n, d, w, k }) => ({
      question: `What is the reciprocal of ${fr(n, d)}?`, story: false,
      options: optionsOf(fr(d, n), [[w[0], 'A reciprocal is not the negative. It turns the fraction upside down.'], [w[1], 'A reciprocal is not what is left from 1. It turns the fraction upside down.'], [w[2], 'Only the top was used. Turn the whole fraction upside down.']], k),
      hints: ['Two numbers are reciprocals when their product is 1.', 'Swap the numerator and the denominator.'],
      steps: [`Swap the top and the bottom of ${fr(n, d)}.`, `The reciprocal is ${fr(d, n)}.`],
    }) }),

  fam({ id: 'g6.recip.check-why', skill: 'G6_MIXED_NUMBERS', outcome: 'G6.FRAC.e', rung: 3, form: 'why',
    draw: () => { const n = randInt(1, 8), d = randInt(n + 1, 9); return gcd(n, d) > 1 ? null : { n, d, p: person(), k: randInt(0, 3) }; },
    make: ({ n, d, p, k }) => ({
      question: `${p.name} says ${fr(d, n)} is the reciprocal of ${fr(n, d)}. Which check shows ${p.she} is right?`,
      options: optionsOf('Multiply the two fractions. The product is 1', [
        ['Add the two fractions. The sum is 1', `${fr(n, d)} + ${fr(d, n)} is more than 1, because ${fr(d, n)} is already more than 1.`],
        ['Subtract one from the other. The answer is 0', 'The answer is 0 only when both numbers are equal. These two are different sizes.'],
        ['Both fractions have the same value', `${fr(n, d)} is less than 1 and ${fr(d, n)} is more than 1. They are not equal.`]], k),
      hints: ['Reciprocals are linked by one operation that gives 1.', 'Try each choice with the two fractions.'],
      steps: [`${fr(n, d)} × ${fr(d, n)} = ${fr(n * d, n * d)} = 1.`, 'Two numbers are reciprocals when their product is 1.'],
    }) }),

  fam({ id: 'g6.fsq.pick', skill: 'G6_SQUARES', outcome: 'G6.FRAC.f', rung: 1, form: 'direct',
    draw: () => {
      const n = randInt(1, 8), d = randInt(2, 9);
      if (n >= d || gcd(n, d) > 1) return null;
      const w = [fr(n * n, d), fr(n, d * d), fr(2 * n, 2 * d)];
      return uniq(fr(n * n, d * d), ...w) && n > 1 ? { n, d, w, k: randInt(0, 3) } : null;
    },
    make: ({ n, d, w, k }) => ({
      question: `What is the square of ${fr(n, d)}, written ${`(${fr(n, d)})²`}?`, story: false,
      options: optionsOf(fr(n * n, d * d), [[w[0], 'Only the top was squared. Square the bottom too.'], [w[1], 'Only the bottom was squared. Square the top too.'], [w[2], 'That doubles the fraction. Squaring means multiplying the fraction by itself.']], k),
      hints: ['Squaring means multiplying a number by itself.', 'Multiply the tops together, and the bottoms together.'],
      steps: [`${fr(n, d)} × ${fr(n, d)} = ${fr(n * n, d * d)}.`, 'Both the numerator and the denominator are squared.'],
    }) }),

  fam({ id: 'g6.fsq.cloth', skill: 'G6_SQUARES', outcome: 'G6.FRAC.f', rung: 2, form: 'word',
    draw: () => {
      const n = randInt(2, 8), d = randInt(3, 9);
      if (n >= d || gcd(n, d) > 1) return null;
      const w = [fr(4 * n, d), fr(2 * n, d), fr(n * n, d)];
      return uniq(fr(n * n, d * d), ...w) ? { n, d, w, p: person(), k: randInt(0, 3) } : null;
    },
    make: ({ n, d, w, p, k }) => ({
      question: `${p.name} has a square cloth. Each side is ${fr(n, d)} m long. What is the area of the cloth, in square metres?`,
      options: optionsOf(`${fr(n * n, d * d)} m²`, [[`${w[0]} m²`, 'That is four sides added up: the distance around. Area is side times side.'], [`${w[1]} m²`, 'That doubles the side. Area is side times side.'], [`${w[2]} m²`, 'The bottom must be multiplied by itself too.']], k),
      hints: ['Area of a square = side × side.', 'Multiply the tops, then multiply the bottoms.'],
      steps: [`Area = ${fr(n, d)} × ${fr(n, d)}.`, `= ${fr(n * n, d * d)} m².`],
    }) }),

  fam({ id: 'g6.fsq.spot', skill: 'G6_SQUARES', outcome: 'G6.FRAC.f', rung: 3, form: 'spot',
    draw: () => { const n = randInt(2, 8), d = randInt(3, 9); return n >= d || gcd(n, d) > 1 || n === 2 ? null : { n, d, kind: pick(['num', 'den']), p: person() }; },
    make: ({ n, d, kind, p }) => {
      const sn = kind === 'num' ? n + n : n * n, sd = kind === 'den' ? d + d : d * d;
      return {
        question: `${p.name} worked out (${fr(n, d)})². Which step has the mistake?`,
        working: [
          { text: `(${fr(n, d)})² means ${fr(n, d)} × ${fr(n, d)}.`, ok: true },
          { text: `Multiply the numerators: ${n} × ${n} = ${sn}.`, ok: sn === n * n },
          { text: `Multiply the denominators: ${d} × ${d} = ${sd}.`, ok: sd === d * d },
          { text: `So (${fr(n, d)})² = ${fr(sn, sd)}.`, ok: true },
        ],
        fix: kind === 'num' ? `${n} × ${n} = ${n * n}, not ${n + n}. The answer is ${fr(n * n, d * d)}.` : `${d} × ${d} = ${d * d}, not ${d + d}. The answer is ${fr(n * n, d * d)}.`,
        hints: ['Check each multiplication.', 'Squaring multiplies the number by itself. It does not double it.'],
        steps: [`${n} × ${n} = ${n * n} and ${d} × ${d} = ${d * d}.`, `(${fr(n, d)})² = ${fr(n * n, d * d)}.`],
      };
    } }),

  fam({ id: 'g6.pct.score', skill: 'G6_PERCENTAGES_INTRO', outcome: 'G6.FRAC.g', rung: 2, form: 'word',
    draw: () => {
      const b = pick([20, 25, 40, 50]), a = randInt(Math.ceil(b * 0.3), b - 1), pct = (a * 100) / b;
      return Number.isInteger(pct) && uniq(pct, a, round(a / b, 2), 100 - pct) ? { a, b, pct, p: person(), sub: pick(['Maths', 'Science', 'English', 'Kiswahili']) } : null;
    },
    make: ({ a, b, pct, p, sub }) => ({
      question: `${p.name} scored ${a} out of ${b} in the ${sub} test. What percentage is that?`,
      answer: pct,
      wrong: [[a, `The mark is ${a} out of ${b}, not out of 100. Change the fraction to out of 100.`], [round(a / b, 2), 'That is the fraction as a decimal. Multiply by 100 to get a percentage.'], [100 - pct, 'That is the part missed. The question asks for the part scored.']],
      hints: [`Write the score as the fraction ${a}/${b}.`, 'A percentage is out of 100. How many times does ' + b + ' go into 100?'],
      steps: [`${a}/${b} = ${a * (100 / b)}/100.`, `So the score is ${pct}%.`],
    }),
    check: ({ a, b }, v) => v * b === a * 100 }),

  fam({ id: 'g6.pct.simplest-fraction', skill: 'G6_PERCENTAGES_INTRO', outcome: 'G6.FRAC.g', rung: 2, form: 'word',
    draw: () => {
      const pct = pick([12, 15, 16, 24, 35, 36, 45, 55, 64, 65, 85]), g = gcd(pct, 100), n = pct / g, d = 100 / g;
      return { pct, n, d, k: randInt(0, 3), p: person() };
    },
    make: ({ pct, n, d, k, p }) => ({
      question: `${p.name} sells ${pct}% of a box of mangoes on Monday. What fraction of the box is that, in its simplest form?`,
      options: optionsOf(fr(n, d), [[fr(pct, 100), 'This has the right value, but it can still be made simpler. Divide top and bottom by the same number.'], [fr(pct, 10), 'Per cent means out of 100, not out of 10.'], [`1/${pct}`, 'Per cent means out of 100. The percentage goes on top.']], k),
      hints: ['Per cent means out of 100.', 'Then divide the top and the bottom by their biggest common factor.'],
      steps: [`${pct}% = ${fr(pct, 100)}.`, `Divide the top and the bottom by ${gcd(pct, 100)}: ${fr(n, d)}.`],
    }) }),

  fam({ id: 'g6.pct.best-subject', skill: 'G6_PERCENTAGES_INTRO', outcome: 'G6.FRAC.g', rung: 3, form: 'table',
    draw: () => {
      const subs = shuffle(['Maths', 'English', 'Science', 'Kiswahili']).slice(0, 3);
      const outs = shuffle([20, 25, 40, 50]).slice(0, 3);
      const marks = outs.map(o => randInt(Math.ceil(o * 0.4), o - 1));
      const pcts = marks.map((m, i) => (m * 100) / outs[i]);
      if (!pcts.every(Number.isInteger) || !uniq(...pcts)) return null;
      const best = pcts.indexOf(Math.max(...pcts)), mostMarks = marks.indexOf(Math.max(...marks));
      return marks.filter((m, i) => m === marks[mostMarks]).length === 1 && best !== mostMarks ? { subs, outs, marks, pcts, best, mostMarks, p: person(), k: randInt(0, 2) } : null;
    },
    make: ({ subs, outs, marks, pcts, best, mostMarks, p, k }) => ({
      question: `${p.name}'s results are in the table. In which subject did ${p.she} do best, by percentage?`,
      model: { type: 'table', data: { head: ['Subject', 'Marks', 'Out of'], rows: subs.map((s, i) => ({ cells: [s, String(marks[i]), String(outs[i])] })) } },
      options: subs.map((s, i) => ({ text: s, right: i === best, why: i === best ? undefined : i === mostMarks ? 'That is the biggest mark, but the tests were out of different totals. Change each to a percentage.' : 'Compare percentages, not marks. Change each score to a percentage first.' })).slice(k).concat(subs.map((s, i) => ({ text: s, right: i === best, why: i === best ? undefined : i === mostMarks ? 'That is the biggest mark, but the tests were out of different totals. Change each to a percentage.' : 'Compare percentages, not marks. Change each score to a percentage first.' })).slice(0, k)),
      hints: ['The tests have different totals, so marks cannot be compared directly.', 'Change each score to a percentage.'],
      steps: subs.map((s, i) => `${s}: ${marks[i]}/${outs[i]} = ${pcts[i]}%.`).concat([`The highest percentage is ${subs[best]}.`]),
    }) }),

  // =========================================================== DECIMALS
  fam({ id: 'g6.dec.round-scale', skill: 'G6_FRACTIONS_DECIMALS', outcome: 'G6.DEC.b', rung: 2, form: 'word',
    draw: () => {
      const N = randInt(11000, 99999);
      if (N % 10 === 0) return null;
      const ans = Math.round(N / 10) / 1000, two = Math.round(N / 100) / 100, one = Math.round(N / 1000) / 10;
      const opp = N % 10 >= 5 ? Math.floor(N / 10) / 1000 : (Math.floor(N / 10) + 1) / 1000;
      return uniq(ans, two, one, opp) ? { x: N / 10000, ans, two, one, opp, thing: pick(['flour', 'sugar', 'rice', 'beans']) } : null;
    },
    make: ({ x, ans, two, one, opp, thing }) => ({
      question: `A digital scale shows ${x} kg of ${thing}. Round this to 3 decimal places. What is the answer, in kg?`,
      answer: ans,
      wrong: [[opp, 'Look at the fourth decimal digit. 5 or more rounds up. Less than 5 stays.'], [two, 'That rounds to 2 decimal places. The question asks for 3.'], [one, 'That rounds to 1 decimal place. The question asks for 3.']],
      hints: ['Count 3 digits after the decimal point.', 'Look at the digit after those 3. Does the third digit go up?'],
      steps: [`Keep 3 decimal places of ${x}, and look at the fourth digit.`, `Rounded: ${ans} kg.`],
    }),
    check: ({ x }, a) => Math.abs(a - x) <= 0.0005 + 1e-9 }),

  fam({ id: 'g6.dec.round-carry', skill: 'G6_FRACTIONS_DECIMALS', outcome: 'G6.DEC.b', rung: 3, form: 'spot',
    draw: () => ({ a: randInt(1, 9), b: randInt(0, 9), c: randInt(0, 8), d: randInt(5, 9), p: person() }),
    make: ({ a, b, c, d, p }) => {
      const x = `${a}.${b}${c}9${d}`, good = `${a}.${b}${c + 1}0`, shown = `${a}.${b}${c}0`;
      return {
        question: `${p.name} rounded ${x} to 3 decimal places. Which step has the mistake?`,
        working: [
          { text: `The third decimal digit is 9 and the next digit is ${d}.`, ok: true },
          { text: `${d} is 5 or more, so round up.`, ok: d >= 5 },
          { text: `9 + 1 = 10. Write 0 and leave out the 1: ${shown}.`, ok: shown === good },
          { text: `So ${x} rounds to ${shown} to 3 decimal places.`, ok: true },
        ],
        fix: `The 1 from 9 + 1 = 10 must be carried to the digit before it. The answer is ${good}.`,
        hints: ['Check each step. What happens to the 1 in 9 + 1 = 10?', 'Rounding up a 9 carries to the next place on the left.'],
        steps: [`9 + 1 = 10: write 0 and carry 1 to the hundredths digit, ${c} + 1 = ${c + 1}.`, `${x} rounds to ${good}.`],
      };
    } }),

  fam({ id: 'g6.dec.to-percent', skill: 'G6_FRACTIONS_DECIMALS', outcome: 'G6.DEC.c', rung: 2, form: 'word',
    draw: () => { const n = randInt(5, 95); return n % 10 === 0 ? null : { n, x: n / 100, p: person() }; },
    make: ({ n, x, p }) => ({
      question: `${p.name} spends ${x} of ${p.her} pocket money on a book. What percentage of the pocket money is that?`,
      answer: n,
      wrong: [[x, 'That is the same number as a decimal. A percentage is out of 100.'], [round(x * 10, 1), 'Multiply by 100, not by 10, to change a decimal to a percentage.'], [100 - n, 'That is the part not spent. The question asks for the part spent.']],
      hints: ['A percentage is a number out of 100.', 'Multiply the decimal by 100.'],
      steps: [`${x} = ${n}/100.`, `So ${x} = ${n}%.`],
    }),
    check: ({ x }, a) => a / 100 === x }),

  fam({ id: 'g6.dec.to-fraction', skill: 'G6_FRACTIONS_DECIMALS', outcome: 'G6.DEC.c', rung: 2, form: 'word',
    draw: () => { const n = pick([12, 15, 24, 35, 45, 55, 65, 75, 85]), g = gcd(n, 100); return { n, x: n / 100, a: n / g, b: 100 / g, k: randInt(0, 3), p: person() }; },
    make: ({ n, x, a, b, k, p }) => ({
      question: `${p.name} uses ${x} of a roll of cloth. Which fraction of the roll is that, in its simplest form?`,
      options: optionsOf(fr(a, b), [[fr(n, 100), 'This has the right value, but it can still be made simpler.'], [fr(n, 10), 'The second decimal place means hundredths, not tenths.'], [`1/${n}`, 'The decimal digits go on top of the fraction, over 10 or 100.']], k),
      hints: ['Two decimal places means hundredths.', 'Write the digits over 100, then simplify.'],
      steps: [`${x} = ${fr(n, 100)}.`, `Divide top and bottom by ${gcd(n, 100)}: ${fr(a, b)}.`],
    }) }),

  fam({ id: 'g6.dec.table-forms', skill: 'G6_FRACTIONS_DECIMALS', outcome: 'G6.DEC.c', rung: 2, form: 'table',
    draw: () => {
      const L = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [1, 20], [3, 20], [7, 20], [9, 20], [1, 25], [3, 25]];
      const rows = shuffle(L).slice(0, 3), kind = pick(['dec', 'pct']);
      const [n, d] = rows[2], v = n / d, pct = (n * 100) / d;
      const ws = kind === 'dec' ? [pct, round(1 - v, 2), round(d / n, 2)] : [v, 100 - pct, n];
      return uniq(kind === 'dec' ? v : pct, ...ws) ? { rows, kind, ws } : null;
    },
    make: ({ rows, kind, ws }) => {
      const [n, d] = rows[2], v = n / d, pct = (n * 100) / d;
      return {
        question: `The table shows the same amounts as fractions, decimals and percentages. Find the missing ${kind === 'dec' ? 'decimal' : 'percentage'}.`,
        model: { type: 'table', data: { head: ['Fraction', 'Decimal', 'Percentage'], rows: [...rows.slice(0, 2).map(([a, b]) => ({ cells: [fr(a, b), String(a / b), `${(a * 100) / b}%`] })), { cells: [fr(n, d), kind === 'dec' ? '?' : String(v), kind === 'dec' ? `${pct}%` : '?'] }] } },
        answer: kind === 'dec' ? v : pct,
        wrong: kind === 'dec'
          ? [[ws[0], 'That is the percentage. A decimal is the percentage divided by 100.'], [ws[1], 'That is the amount not covered. Divide the top by the bottom.'], [ws[2], 'The fraction was divided upside down. Divide the top by the bottom.']]
          : [[ws[0], 'That is the decimal. A percentage is the decimal times 100.'], [ws[1], 'That is the part left out of 100. Find the part itself.'], [ws[2], 'Per cent means out of 100. Use the whole decimal, not the numerator.']],
        hints: ['Look at the other rows to see how a fraction, a decimal and a percentage match.', 'Decimal × 100 gives the percentage.'],
        steps: [`${fr(n, d)} = ${v} as a decimal.`, `${v} × 100 = ${pct}%.`],
      };
    },
    check: ({ rows, kind }, a) => { const [n, d] = rows[2]; return kind === 'dec' ? a * d === n : (a / 100) * d === n; } }),

  fam({ id: 'g6.dec4.add-options', skill: 'G6_FRACTIONS_DECIMALS', outcome: 'G6.DEC.e', rung: 2, form: 'word',
    draw: () => {
      const A = randInt(11000, 59999), B = randInt(11000, 59999);
      if (A % 10 === 0 || B % 10 === 0) return null;
      const S = A + B, nc = noCarry(A, B), df = Math.abs(A - B), rd = (Math.round(A / 100) + Math.round(B / 100)) / 100;
      const t = [T4(S), T4(nc), T4(df), rd.toFixed(2)];
      return uniq(S, nc, df, rd * 10000) && nc !== S ? { A, B, t, k: randInt(0, 3), p: person() } : null;
    },
    make: ({ A, B, t, k, p }) => ({
      question: `In a science class, ${p.name} weighs two packets of seeds. They have masses ${T4(A)} kg and ${T4(B)} kg. What is the total mass?`,
      options: optionsOf(`${t[0]} kg`, [[`${t[1]} kg`, 'A carry was lost somewhere. Add each column from the right, carrying when a column is 10 or more.'], [`${t[2]} kg`, 'That subtracts. The question asks for both packets together.'], [`${t[3]} kg`, 'The numbers were rounded before adding. Add the full 4 decimal places.']], k),
      hints: ['Line up the decimal points, one under the other.', 'Add from the right, and carry when a column is 10 or more.'],
      steps: [`${T4(A)} + ${T4(B)}, with the decimal points lined up.`, `Total: ${t[0]} kg.`],
    }) }),

  fam({ id: 'g6.dec4.wire-cuts', skill: 'G6_FRACTIONS_DECIMALS', outcome: 'G6.DEC.e', rung: 3, form: 'steps',
    draw: () => {
      const T = randInt(8, 12) * 10000 + 5000, c1 = randInt(10000, 39999), c2 = randInt(10000, 29999);
      return T - c1 - c2 > 10000 && c1 % 10 && c2 % 10 ? { T, c1, c2, p: person() } : null;
    },
    make: ({ T, c1, c2, p }) => ({
      question: `${p.name} has a wire ${T4(T)} m long. ${p.She} cuts off ${T4(c1)} m, and then cuts off ${T4(c2)} m more.`,
      parts: [
        { prompt: 'How long is the wire after the first cut?', answer: round((T - c1) / 1e4, 4), unit: 'm', hint: 'Take the first cut from the whole length.', wrong: [[round((T + c1) / 1e4, 4), 'Cutting takes wire away. Subtract.']] },
        { prompt: 'How long is the wire after the second cut?', answer: round((T - c1 - c2) / 1e4, 4), unit: 'm', hint: 'Take the second cut from the length you just found.', wrong: [[round((T - c2) / 1e4, 4), 'The second cut comes from what was left after the first cut.']] },
        { prompt: 'How much wire was cut off altogether?', answer: round((c1 + c2) / 1e4, 4), unit: 'm', hint: 'Add the two cuts.', wrong: [[round((c1 - c2) / 1e4, 4), 'Both pieces were cut off. Add them.']] },
      ],
      hints: ['Line up the decimal points each time.', 'Subtract in two steps, or add the cuts and subtract once.'],
      steps: [`${T4(T)} − ${T4(c1)} = ${T4(T - c1)}.`, `${T4(T - c1)} − ${T4(c2)} = ${T4(T - c1 - c2)}.`, `${T4(c1)} + ${T4(c2)} = ${T4(c1 + c2)}.`],
    }),
    check: ({ T }, v) => Math.round(v[1] * 1e4) + Math.round(v[2] * 1e4) === T }),

  // =========================================================== INEQUALITIES
  fam({ id: 'g6.ineq.at-least-fees', skill: 'G6_INEQUALITIES', outcome: 'G6.INEQ.a', rung: 2, form: 'word',
    draw: () => { const s = pick([100, 150, 200, 250]), have = pick([300, 400, 500, 600]), need = have + s * randInt(4, 12) + pick([0, 50]); return { s, have, need, p: person(), k: randInt(0, 3) }; },
    make: ({ s, have, need, p, k }) => ({
      question: `${p.name} needs at least ${sh(need)} for a school trip. ${p.She} has ${sh(have)} and saves ${sh(s)} each week. After w weeks ${p.she} has enough money. Which inequality shows this?`,
      options: optionsOf(`${have} + ${s}w ≥ ${need}`, [[`${have} + ${s}w > ${need}`, '"At least" includes the amount itself. Having exactly the amount is enough.'], [`${have} + ${s}w ≤ ${need}`, 'That means not more than the amount. She needs the amount or more.'], [`${s}w ≥ ${need}`, `The ${sh(have)} ${p.she} already has must be counted too.`]], k),
      hints: ['"At least" means the amount or more.', 'The money after w weeks is what she has now plus what she saves.'],
      steps: [`Money after w weeks: ${have} + ${s}w.`, `"At least ${sh(need)}" means ≥ ${need}.`, `So ${have} + ${s}w ≥ ${need}.`],
    }) }),

  fam({ id: 'g6.ineq.count-solutions', skill: 'G6_INEQUALITIES', outcome: 'G6.INEQ.a', rung: 3, form: 'word',
    draw: () => { const a = randInt(3, 20), b = a + randInt(4, 12); return { a, b }; },
    make: ({ a, b }) => ({
      question: `The number of learners on a school trip, n, is more than ${a} and at most ${b}. How many different whole numbers can n be?`,
      answer: b - a,
      wrong: [[b - a + 1, `"More than ${a}" does not include ${a} itself.`], [b - a - 1, `"At most ${b}" includes ${b} itself.`], [b, `The numbers start after ${a}. Count only the numbers that fit both rules.`]],
      hints: [`n starts just above ${a}.`, `List the smallest number n can be, then the largest.`],
      steps: [`The smallest value is ${a + 1} and the largest is ${b}.`, `Count from ${a + 1} to ${b}: ${b} − ${a} = ${b - a} numbers.`],
    }),
    check: ({ a, b }, v) => { let c = 0; for (let n = 0; n <= b + 5; n++) if (n > a && n <= b) c++; return c === v; } }),

  fam({ id: 'g6.ineq.spot-solve', skill: 'G6_INEQUALITIES', outcome: 'G6.INEQ.c', rung: 3, form: 'spot',
    draw: () => { const m = randInt(2, 6), x = randInt(3, 9), c = randInt(2, 9); return { m, c, rhs: m * x + c, x, p: person() }; },
    make: ({ m, c, rhs, x, p }) => {
      const shown = rhs + c, right = rhs - c;
      return {
        question: `${p.name} solved ${m}x + ${c} ≤ ${rhs}. Which step has the mistake?`,
        working: [
          { text: `Take ${c} from both sides: ${m}x ≤ ${rhs} + ${c}, which is ${m}x ≤ ${shown}.`, ok: shown === right },
          { text: `Divide both sides by ${m}: x ≤ ${shown / m}.`, ok: true },
          { text: `So x can be any whole number up to ${Math.floor(shown / m)}.`, ok: true },
        ],
        fix: `Taking ${c} from both sides gives ${m}x ≤ ${rhs} − ${c} = ${right}, so x ≤ ${right / m}.`,
        hints: ['To undo + ' + c + ', do the opposite to both sides.', 'Check each step against the one before it.'],
        steps: [`${m}x ≤ ${rhs} − ${c} = ${right}.`, `x ≤ ${right / m}.`],
      };
    } }),

  // =========================================================== MONEY
  fam({ id: 'g6.money.budget-over', skill: 'G6_MONEY', outcome: 'G6.MONEY.a', rung: 3, form: 'table',
    draw: () => {
      const items = shuffle(['Rent', 'Food', 'Transport', 'School fees', 'Water and power']).slice(0, 4);
      const planned = items.map(() => randInt(4, 18) * 500), delta = items.map(() => pick([-500, 0, 500, 1000, 1500]));
      const tp = planned.reduce((x, y) => x + y, 0), net = delta.reduce((x, y) => x + y, 0);
      if (net <= 0) return null;
      const actual = planned.map((v, i) => v + delta[i]), ta = tp + net, maxOver = Math.max(...delta);
      return uniq(net, tp, ta, maxOver) ? { items, planned, actual, tp, ta, net, maxOver, p: person() } : null;
    },
    make: ({ items, planned, actual, tp, ta, net, maxOver, p }) => ({
      question: `The table shows ${p.name}'s family budget for a month: what they planned to spend and what they really spent. By how much did they spend more than planned in total, in shillings?`,
      model: { type: 'table', data: { head: ['Item', 'Planned (sh)', 'Spent (sh)'], rows: items.map((it, i) => ({ cells: [it, commas(planned[i]), commas(actual[i])] })) } },
      answer: net,
      wrong: [[ta, 'That is the total spent. The question asks how much more than the plan.'], [tp, 'That is the total planned. Compare it with the total spent.'], [maxOver, 'That is only one item. Compare the total planned with the total spent.']],
      hints: ['Add up the planned column. Then add up the spent column.', 'Take the smaller total from the bigger total.'],
      steps: [`Planned: ${commas(tp)}. Spent: ${commas(ta)}.`, `${commas(ta)} − ${commas(tp)} = ${commas(net)}.`],
    }),
    check: ({ planned, actual }, a) => actual.reduce((x, y) => x + y, 0) - a === planned.reduce((x, y) => x + y, 0) }),

  fam({ id: 'g6.money.vat-total', skill: 'G6_MONEY', outcome: 'G6.MONEY.e', rung: 2, form: 'word',
    draw: () => { const item = pick(['radio', 'mobile phone', 'bicycle', 'sewing machine', 'television']), a = price(item); return { item, a, p: person() }; },
    make: ({ item, a, p }) => {
      const vat = (a * 16) / 100;
      return {
        question: `${p.name} buys a ${item} with a shop price of ${sh(a)}. VAT is added to the price. In this question, VAT is 16% of the price. How much does ${p.she} pay altogether, in shillings?`,
        answer: a + vat,
        wrong: [[a + 16, 'The VAT is 16% of the price, not 16 shillings.'], [vat, 'That is only the VAT. The buyer pays the price and the VAT.'], [a - vat, 'VAT is added on top of the price. It is not taken off.']],
        hints: ['Find 16% of the shop price first.', 'Then add it to the shop price.'],
        steps: [`16% of ${commas(a)} = ${commas(vat)}.`, `Total: ${commas(a)} + ${commas(vat)} = ${sh(a + vat)}.`],
      };
    },
    check: ({ a }, v) => v * 100 === a * 116 }),

  fam({ id: 'g6.money.payslip', skill: 'G6_MONEY', outcome: 'G6.MONEY.e', rung: 2, form: 'table',
    draw: () => {
      const g = pick([30000, 40000, 45000, 60000, 80000]), paye = g * pick([0.1, 0.15, 0.2]), other = pick([1500, 2000, 2500, 3000]);
      return uniq(g - paye - other, g - paye, g - other, g + paye) ? { g, paye, other, p: person() } : null;
    },
    make: ({ g, paye, other, p }) => ({
      question: `The table is an example of a worker's monthly pay slip. PAYE is a tax taken from the worker's pay. How much does ${p.name} take home, in shillings?`,
      model: { type: 'table', data: { head: ['Item', 'Amount (sh)'], rows: [{ label: 'Gross pay', value: commas(g) }, { label: 'PAYE (tax)', value: commas(paye) }, { label: 'Other deductions', value: commas(other) }] } },
      answer: g - paye - other,
      wrong: [[g - paye, 'The other deductions are taken from the pay too.'], [g - other, 'The PAYE tax is taken from the pay too.'], [g + paye - other, 'PAYE is taken away from the pay, not added.']],
      hints: ['Take-home pay is what is left of the gross pay.', 'Subtract every deduction in the table.'],
      steps: [`Deductions: ${commas(paye)} + ${commas(other)} = ${commas(paye + other)}.`, `Take-home: ${commas(g)} − ${commas(paye + other)} = ${sh(g - paye - other)}.`],
    }),
    check: ({ g, paye, other }, a) => a + paye + other === g }),

  fam({ id: 'g6.money.tomatoes-spoiled', skill: 'G6_MONEY', outcome: 'G6.MONEY.c', rung: 3, form: 'word',
    draw: () => {
      const buy = price('kg of tomatoes'), n = pick([20, 25, 30, 40]), bad = pick([2, 3, 4, 5]), sell = buy + pick([30, 40, 50, 60]);
      const profit = (n - bad) * sell - n * buy;
      return profit > 0 && uniq(profit, n * sell - n * buy, (n - bad) * sell) ? { buy, n, bad, sell, profit, p: person() } : null;
    },
    make: ({ buy, n, bad, sell, profit, p }) => ({
      question: `${p.name} buys ${n} kg of tomatoes at ${sh(buy)} for each kg. ${bad} kg go bad and cannot be sold. ${p.She} sells the rest at ${sh(sell)} for each kg. What is ${p.her} profit, in shillings?`,
      answer: profit,
      wrong: [[n * sell - n * buy, `The ${bad} kg that went bad cannot be sold. Count only the kilograms sold.`], [(n - bad) * sell, 'That is the money received. Take away the cost of all the tomatoes bought.'], [(n - bad) * (sell - buy), `The cost was for all ${n} kg, including the ones that went bad.`]],
      hints: ['Find the money spent on buying, and the money received from selling.', 'Profit = money received − money spent.'],
      steps: [`Cost: ${n} × ${buy} = ${commas(n * buy)}.`, `Sold: ${n - bad} kg × ${sell} = ${commas((n - bad) * sell)}.`, `Profit: ${commas((n - bad) * sell)} − ${commas(n * buy)} = ${sh(profit)}.`],
    }),
    check: ({ buy, n, bad, sell }, a) => a + n * buy === (n - bad) * sell }),

  // =========================================================== AREA
  fam({ id: 'g6.area.l-floor', skill: 'G6_AREA_RECT', outcome: 'G6.AREA.b', rung: 3, form: 'steps',
    draw: () => {
      const W = randInt(10, 16), H = randInt(7, 10), w = randInt(3, W - 5), h = randInt(2, H - 4), rate = pick([300, 400, 500, 600, 800]);
      return { W, H, w, h, rate, p: person() };
    },
    make: ({ W, H, w, h, rate, p }) => ({
      question: `The floor of a hall is a rectangle ${W} m by ${H} m, with a corner ${w} m by ${h} m left out. The floor that is left is L-shaped. ${p.name} will cover it with tiles at ${sh(rate)} for each square metre.`,
      parts: [
        { prompt: `What is the area of the full rectangle ${W} m by ${H} m?`, answer: W * H, unit: 'm²', hint: 'Length × width.', wrong: [[2 * (W + H), 'That is the distance around. Area is length times width.']] },
        { prompt: `What is the area of the corner ${w} m by ${h} m that is left out?`, answer: w * h, unit: 'm²', hint: 'Length × width again.', wrong: [[2 * (w + h), 'That is the distance around. Area is length times width.']] },
        { prompt: 'What is the area of the L-shaped floor?', answer: W * H - w * h, unit: 'm²', hint: 'Take the corner from the full rectangle.', wrong: [[W * H + w * h, 'The corner is left out, so take it away.']] },
        { prompt: 'What is the cost of the tiles?', answer: (W * H - w * h) * rate, unit: 'sh', hint: 'Area × cost for each square metre.', wrong: [[W * H * rate, 'The corner needs no tiles. Use the area of the L-shape.']] },
      ],
      hints: ['Think of the L-shape as a big rectangle with a piece taken out.', 'Find each area, subtract, then multiply by the cost.'],
      steps: [`Full: ${W} × ${H} = ${W * H} m². Corner: ${w} × ${h} = ${w * h} m².`, `L-shape: ${W * H} − ${w * h} = ${W * H - w * h} m².`, `Cost: ${W * H - w * h} × ${rate} = ${sh((W * H - w * h) * rate)}.`],
    }),
    check: ({ W, H, w, h, rate }, v) => v[2] + v[1] === v[0] && v[3] === v[2] * rate && v[0] === W * H && v[1] === w * h }),

  fam({ id: 'g6.area.circle-count', skill: 'G6_AREA_RECT', outcome: 'G6.AREA.c', rung: 2, form: 'word',
    draw: () => {
      const r = pick([3, 4, 5, 6]);
      let whole = 0, part = 0;
      for (let i = -r - 1; i <= r; i++) for (let j = -r - 1; j <= r; j++) {
        const xs = [i, i + 1], ys = [j, j + 1];
        const far = Math.max(...xs.map(Math.abs)) ** 2 + Math.max(...ys.map(Math.abs)) ** 2;
        const nx = i <= 0 && 0 <= i + 1 ? 0 : Math.min(Math.abs(i), Math.abs(i + 1));
        const ny = j <= 0 && 0 <= j + 1 ? 0 : Math.min(Math.abs(j), Math.abs(j + 1));
        const near = nx ** 2 + ny ** 2;
        if (far <= r * r) whole++; else if (near < r * r) part++;
      }
      const est = whole + part / 2, w = [whole, whole + part, (2 * r) ** 2];
      return Math.abs(est - Math.PI * r * r) / (Math.PI * r * r) < 0.08 && uniq(est, ...w) ? { r, whole, part, est, w, p: person() } : null;
    },
    make: ({ whole, part, est, w, p }) => ({
      question: `${p.name} draws a circle on squared paper. Each square is 1 cm by 1 cm. The circle covers ${whole} whole squares and ${part} part squares. Count each part square as half a square. Estimate the area of the circle, in cm².`,
      answer: est,
      wrong: [[w[0], 'The part squares are also inside the circle. Count half of each one.'], [w[1], 'A part square is not a whole square. Count each as half.'], [w[2], 'That is the square around the circle, not the circle.']],
      hints: ['Whole squares count as 1 each. Part squares count as one half each.', 'Find half of the number of part squares, then add.'],
      steps: [`Part squares: ${part} ÷ 2 = ${part / 2}.`, `Area ≈ ${whole} + ${part / 2} = ${est} cm².`],
    }),
    check: ({ whole, part }, a) => a * 2 === whole * 2 + part }),

  fam({ id: 'g6.area.circle-half-why', skill: 'G6_AREA_RECT', outcome: 'G6.AREA.c', rung: 3, form: 'why',
    draw: () => ({ p: person(), k: randInt(0, 3) }),
    make: ({ p, k }) => ({
      question: `${p.name} says the area from counting squares inside a circle is only an estimate, never exact. Why is that?`,
      options: optionsOf('The curved edge cuts squares into pieces that are guessed', [
        ['Squares on paper are not a proper way to measure area', 'Counting squares is a good way to measure area. The problem is only at the curved edge.'],
        ['A circle has no area, so only a guess can be made', 'Every circle has an area. It is the space inside the edge.'],
        ['The whole squares inside the circle are counted wrongly', 'Whole squares inside the circle can be counted exactly. The trouble is the squares the edge cuts through.']], k),
      hints: ['Which squares are easy to count, and which are hard?', 'Think about the squares that the curved edge goes through.'],
      steps: ['Whole squares inside the circle can be counted exactly.', 'The squares cut by the curved edge are only part inside, so their share is guessed. That makes the total an estimate.'],
    }) }),

  fam({ id: 'g6.area.triangle-bed', skill: 'G6_AREA_TRIANGLE', outcome: 'G6.AREA.a', rung: 2, form: 'steps',
    draw: () => { const b = randInt(4, 16) * 2, h = randInt(3, 12), rate = pick([50, 80, 100, 120, 150]); return { b, h, rate, p: person() }; },
    make: ({ b, h, rate, p }) => ({
      question: `${p.name} has a triangular flower bed. The base is ${b} m and the height is ${h} m. ${p.She} plants grass that costs ${sh(rate)} for each square metre.`,
      parts: [
        { prompt: 'What is the area of the flower bed?', answer: (b * h) / 2, unit: 'm²', hint: 'A triangle is half of a rectangle with the same base and height.', wrong: [[b * h, 'That is the area of the whole rectangle. A triangle is half of it.'], [b + h, 'Area comes from multiplying the base and the height, then halving.']] },
        { prompt: 'What is the cost of the grass?', answer: ((b * h) / 2) * rate, unit: 'sh', hint: 'Area × cost for each square metre.', wrong: [[b * h * rate, 'Use the area of the triangle, which is half of base × height.']] },
      ],
      hints: ['Area of a triangle = base × height ÷ 2.', 'Then multiply the area by the cost for each square metre.'],
      steps: [`Area: ${b} × ${h} ÷ 2 = ${(b * h) / 2} m².`, `Cost: ${(b * h) / 2} × ${rate} = ${sh(((b * h) / 2) * rate)}.`],
    }),
    check: ({ b, h, rate }, v) => v[0] * 2 === b * h && v[1] === v[0] * rate }),

  fam({ id: 'g6.area.triangle-height', skill: 'G6_AREA_TRIANGLE', outcome: 'G6.AREA.a', rung: 3, form: 'word',
    draw: () => { const b = randInt(4, 20), h = randInt(3, 15), A = (b * h) / 2; return Number.isInteger(A) && uniq(h, A / b, b * h, A) ? { b, h, A, p: person() } : null; },
    make: ({ b, h, A, p }) => ({
      question: `A triangular sign made by ${p.name} has an area of ${A} cm² and a base of ${b} cm. What is its height, in cm?`,
      answer: h,
      wrong: [[A / b, 'The area is half of base × height. Double the area before dividing.'], [b * h, 'Check by working the area from your answer. A triangle needs the half.'], [A, 'That is the area. The height is a length.']],
      hints: ['Area = base × height ÷ 2, so base × height is double the area.', 'Divide that by the base.'],
      steps: [`Base × height = ${A} × 2 = ${2 * A}.`, `Height = ${2 * A} ÷ ${b} = ${h} cm.`],
    }),
    check: ({ b, A }, v) => (b * v) / 2 === A }),

  // =========================================================== CIRCUMFERENCE
  fam({ id: 'g6.circ.string-table', skill: 'G6_UNIT_CONVERSIONS', outcome: 'G6.LENGTH.h', rung: 2, form: 'table',
    draw: () => {
      const ks = shuffle([1, 2, 3, 4, 5, 6, 7]).slice(0, 4), names = shuffle(['Cup', 'Tin', 'Bucket', 'Drum', 'Basin', 'Pot']).slice(0, 4);
      const [a, b, c, u] = ks;
      return u >= 2 ? { ks: [a, b, c], u, names, ans: 22 * u } : null;
    },
    make: ({ ks, u, names, ans }) => ({
      question: `${'Njeri'} measures the distance across some round objects, and then the length of string that goes round them once. Her measurements are in the table. A ${names[3].toLowerCase()} is ${7 * u} cm across. Using the pattern in the table, how long is the string that goes round it, in cm?`,
      model: { type: 'table', data: { head: ['Round object', 'Across (diameter) in cm', 'Round (circumference) in cm'], rows: ks.map((k, i) => ({ cells: [names[i], String(7 * k), String(22 * k)] })) } },
      answer: ans,
      wrong: [[21 * u, 'Going round is a bit more than 3 times across. Look at the table: 7 cm across gives 22 cm round.'], [14 * u, 'Going round is more than 2 times the distance across.'], [11 * u, 'That is half of the distance round. Look at the table again.']],
      hints: ['Find how the distance round is linked to the distance across in each row.', 'For every 7 cm across, the string is 22 cm.'],
      steps: [`${7 * u} ÷ 7 = ${u}, so the ${names[3].toLowerCase()} is ${u} sevens across.`, `String: ${u} × 22 = ${ans} cm.`],
    }),
    check: ({ u }, a) => a / 22 === u }),

  fam({ id: 'g6.circ.wheel-turns', skill: 'G6_UNIT_CONVERSIONS', outcome: 'G6.LENGTH.h', rung: 3, form: 'steps',
    draw: () => { const k = pick([5, 6, 8, 9, 10, 12]), N = pick([50, 100]); return { d: 7 * k, N, p: person() }; },
    make: ({ d, N, p }) => {
      const c = (d * 22) / 7;
      return {
        question: `A bicycle wheel has a diameter of ${d} cm. Use π = 22/7. ${p.name} rides until the wheel has turned ${N} times.`,
        parts: [
          { prompt: 'What is the circumference of the wheel, in cm?', answer: c, unit: 'cm', hint: 'Circumference = π × diameter.', wrong: [[d * 3, 'Use 22/7 for π, not 3.'], [c / 2, 'That is half way round. Use the diameter, not the radius.']] },
          { prompt: `How far does the wheel go in ${N} turns, in cm?`, answer: c * N, unit: 'cm', hint: 'One turn takes the wheel one circumference.', wrong: [[c + N, 'Each turn covers the whole circumference. Multiply.']] },
          { prompt: 'How far is that in metres?', answer: (c * N) / 100, unit: 'm', hint: '100 cm = 1 m.', wrong: [[(c * N) / 1000, 'There are 100 cm in a metre, not 1,000.']] },
        ],
        hints: ['One full turn of the wheel covers one circumference.', 'Find the circumference first.'],
        steps: [`Circumference = 22/7 × ${d} = ${c} cm.`, `${N} turns: ${c} × ${N} = ${c * N} cm.`, `${c * N} ÷ 100 = ${(c * N) / 100} m.`],
      };
    },
    check: ({ d, N }, v) => (v[0] * 7) / 22 === d && v[1] === v[0] * N && v[2] * 100 === v[1] }),

  fam({ id: 'g6.circ.find-diameter', skill: 'G6_UNIT_CONVERSIONS', outcome: 'G6.LENGTH.h', rung: 2, form: 'word',
    draw: () => { const k = randInt(2, 14), d = 7 * k; return { d, c: 22 * k, p: person() }; },
    make: ({ d, c, p }) => ({
      question: `The distance round the edge of ${p.name}'s round tank cover is ${c} cm. This is the circumference. Use π = 22/7. What is the diameter of the cover, in cm?`,
      answer: d,
      wrong: [[c / 2, 'That divides by 2, as for a radius or half a distance. The circumference is π times the diameter.'], [round(c / 3, 1), 'π is 22/7, a little more than 3. Divide by 22/7 exactly.'], [round(c / 4, 1), 'That finds the side of a square with the same distance round. A circle uses π.']],
      hints: ['Circumference = π × diameter.', 'To find the diameter, divide the circumference by π.'],
      steps: [`Diameter = ${c} ÷ 22/7 = ${c} × 7/22.`, `${c} × 7 ÷ 22 = ${d} cm.`],
    }),
    check: ({ c }, a) => (a * 22) / 7 === c }),

  // =========================================================== MASS
  fam({ id: 'g6.mass.deliveries-table', skill: 'G6_MASS', outcome: 'G6.MASS.e', rung: 2, form: 'table',
    draw: () => {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], kg = days.map(() => randInt(4, 19) * 50);
      const tot = kg.reduce((x, y) => x + y, 0);
      return tot % 100 === 0 && tot > 1000 && uniq(tot / 1000, tot, tot / 100) ? { days, kg, tot, p: person() } : null;
    },
    make: ({ days, kg, tot, p }) => ({
      question: `A lorry brings maize to ${p.name}'s posho mill on four days. The table shows the mass each day. What is the total mass, in tonnes?`,
      model: { type: 'table', data: { head: ['Day', 'Maize (kg)'], rows: days.map((d, i) => ({ label: d, value: commas(kg[i]) })) } },
      answer: tot / 1000,
      wrong: [[tot, 'That is the total in kilograms. The question asks for tonnes.'], [tot / 100, '1 tonne is 1,000 kg, so divide by 1,000.'], [round((tot - kg[3]) / 1000, 3), 'One day was left out. Add all four days.']],
      hints: ['Add the four masses in kilograms first.', '1,000 kg = 1 tonne.'],
      steps: [`Total: ${kg.map(commas).join(' + ')} = ${commas(tot)} kg.`, `${commas(tot)} ÷ 1,000 = ${tot / 1000} tonnes.`],
    }),
    check: ({ kg }, a) => Math.round(a * 1000) === kg.reduce((x, y) => x + y, 0) }),

  fam({ id: 'g6.mass.which-in-tonnes', skill: 'G6_MASS', outcome: 'G6.MASS.a', rung: 1, form: 'direct',
    draw: () => {
      const big = pick(['A lorry full of sand', 'A ship carrying cargo', 'A wagon full of cement', 'A truck full of stones']);
      const small = shuffle(['A sack of maize', 'A goat', 'A bag of sugar', 'A bicycle', 'A school bag full of books']).slice(0, 3);
      return { big, small, k: randInt(0, 3), p: person() };
    },
    make: ({ big, small, k, p }) => ({
      question: `${p.name} lists some things to weigh. Which of these is best measured in tonnes?`, story: false,
      options: optionsOf(big, small.map(s => [s, 'This is small enough to measure in kilograms. A tonne is 1,000 kg, a very heavy load.']), k),
      hints: ['1 tonne = 1,000 kg.', 'Which one is far heavier than a person?'],
      steps: ['A tonne is used for very heavy loads, such as 1,000 kg or more.', `${big} is that heavy.`],
    }) }),

  // =========================================================== TIME
  fam({ id: 'g6.time.wait-then-ride', skill: 'G6_TIME', outcome: 'G6.TIME.e', rung: 3, form: 'table',
    draw: () => {
      const [a, b, km] = pick([['Nairobi', 'Nakuru', 160], ['Nairobi', 'Nyeri', 150], ['Nairobi', 'Machakos', 60], ['Nairobi', 'Thika', 45], ['Nakuru', 'Eldoret', 155], ['Mombasa', 'Malindi', 120]]);
      const base = randInt(6, 9) * 60 + pick([0, 15, 30]), g = pick([30, 45, 60]);
      const dep = [0, 1, 2, 3].map(i => base + i * g), dur = [0, 1, 2, 3].map(() => km + pick([-10, 0, 10, 20]));
      const j = randInt(1, 3), arrive = dep[j] - randInt(5, g - 5);
      if (arrive <= dep[j - 1]) return null;
      const wait = dep[j] - arrive, total = wait + dur[j];
      return uniq(total, dur[j], wait, dep[j] + dur[j] - dep[0]) ? { a, b, dep, dur, j, arrive, wait, total, p: person() } : null;
    },
    make: ({ a, b, dep, dur, j, arrive, wait, total, p }) => ({
      question: `The timetable shows buses from ${a} to ${b}. ${p.name} reaches the bus stage at ${hm(arrive)} h and takes the first bus that leaves after that. How many minutes pass from ${hm(arrive)} h until ${p.she} arrives in ${b}?`,
      model: { type: 'table', data: { head: ['Bus', 'Leaves', 'Arrives'], rows: dep.map((d, i) => ({ cells: [`Bus ${i + 1}`, `${hm(d)} h`, `${hm(d + dur[i])} h`] })) } },
      answer: total,
      wrong: [[dur[j], 'That is only the journey. Count the waiting time too.'], [wait, 'That is only the waiting time. Count the journey as well.'], [dep[j] + dur[j] - dep[0], 'That starts from the first bus on the timetable. Start from the time the traveller reaches the stage.']],
      hints: [`Which bus leaves first after ${hm(arrive)} h?`, 'Waiting time + journey time.'],
      steps: [`The first bus after ${hm(arrive)} h is Bus ${j + 1}, at ${hm(dep[j])} h. Wait: ${wait} minutes.`, `Bus ${j + 1} journey: ${dur[j]} minutes.`, `Total: ${wait} + ${dur[j]} = ${total} minutes.`],
    }),
    check: ({ arrive, dep, dur, j }, a) => dep[j] + dur[j] - arrive === a }),

  fam({ id: 'g6.time.shortest-trip', skill: 'G6_TIME', outcome: 'G6.TIME.e', rung: 2, form: 'table',
    draw: () => {
      const [a, b, km] = pick([['Nairobi', 'Nakuru', 160], ['Nairobi', 'Nyeri', 150], ['Nakuru', 'Eldoret', 155], ['Mombasa', 'Malindi', 120], ['Kisumu', 'Kakamega', 50]]);
      const base = randInt(6, 9) * 60, g = pick([30, 45, 60]);
      const dep = [0, 1, 2, 3].map(i => base + i * g), dur = shuffle([km - 20, km - 10, km, km + 15]);
      const best = dur.indexOf(Math.min(...dur));
      return { a, b, dep, dur, best, k: 0 };
    },
    make: ({ a, b, dep, dur, best }) => ({
      question: `The timetable shows four matatus from ${a} to ${b}. Which matatu has the shortest journey?`,
      model: { type: 'table', data: { head: ['Matatu', 'Leaves', 'Arrives'], rows: dep.map((d, i) => ({ cells: [`Matatu ${i + 1}`, `${hm(d)} h`, `${hm(d + dur[i])} h`] })) } },
      options: dep.map((d, i) => ({ text: `Matatu ${i + 1}`, right: i === best, why: i === best ? undefined : `Work out the journey time for each matatu: the time it arrives minus the time it leaves. ${i === 0 ? 'Leaving first does not mean arriving first or travelling fastest.' : 'Arriving later does not always mean a longer journey.'}` })),
      fixedOrder: true,
      hints: ['For each matatu, find how long it takes from leaving to arriving.', 'Compare the four journey times.'],
      steps: dep.map((d, i) => `Matatu ${i + 1}: ${hm(d)} to ${hm(d + dur[i])} is ${Math.floor(dur[i] / 60)} h ${dur[i] % 60} min.`).concat([`The shortest is Matatu ${best + 1}.`]),
    }) }),

  // =========================================================== ANGLES
  fam({ id: 'g6.angle.sectors-point', skill: 'G6_ANGLE_PROPERTIES', outcome: 'G6.ANGLES.a', rung: 2, form: 'word',
    draw: () => { const a = randInt(8, 18) * 10, b = randInt(5, 15) * 10, x = 360 - a - b; return x > 30 && uniq(x, 180 - a - b, 360 - a, 360 - b, a + b) ? { a, b, x, p: person() } : null; },
    make: ({ a, b, x, p }) => ({
      question: `${p.name} cuts a round cake into three pieces. The three angles meet at a point in the centre. Two angles are ${a}° and ${b}°. What is the third angle, in degrees?`,
      answer: x,
      wrong: [[180 - a - b, 'The angles at a point add up to 360°, not 180°.'], [360 - a, 'The other angle, ' + b + '°, must be taken away too.'], [360 - b, 'The other angle, ' + a + '°, must be taken away too.'], [a + b, 'That is the two angles together. Take them from 360°.']],
      hints: ['All the angles at a point make a full turn.', 'A full turn is 360°.'],
      steps: [`Angles at a point add up to 360°.`, `${a} + ${b} = ${a + b}, and 360 − ${a + b} = ${x}°.`],
    }),
    check: ({ a, b }, v) => a + b + v === 360 }),

  fam({ id: 'g6.angle.line-double', skill: 'G6_ANGLE_PROPERTIES', outcome: 'G6.ANGLES.a', rung: 3, form: 'steps',
    draw: () => ({ k: pick([2, 3, 4, 5, 8, 9]) }),
    make: ({ k }) => ({
      question: `Two angles lie on a straight line. One angle is ${k} times as big as the other. Use x° for the small angle.`,
      parts: [
        { prompt: 'Angles on a straight line add up to how many degrees?', answer: 180, unit: '°', hint: 'Half a full turn.', wrong: [[360, '360° is a full turn. A straight line is half a turn.']] },
        { prompt: `The two angles are x and ${k}x. So x + ${k}x is the same as how many x?`, answer: k + 1, hint: 'Count the x terms.', wrong: [[k, 'There is one more x to count: the small angle itself.']] },
        { prompt: 'What is the size of the small angle x?', answer: 180 / (k + 1), unit: '°', hint: 'Divide 180 by the number of x.', wrong: [[(180 * k) / (k + 1), 'That is the bigger angle. x is the small one.'], [180 / k, `Divide by all the x together, which is ${k + 1}.`]] },
        { prompt: 'What is the size of the bigger angle?', answer: (180 * k) / (k + 1), unit: '°', hint: `It is ${k} times x.`, wrong: [[180 / (k + 1), `The bigger angle is ${k} times x.`]] },
      ],
      hints: ['Write the two angles as x and a multiple of x, and add them.', 'Set the sum equal to 180.'],
      steps: [`x + ${k}x = ${k + 1}x, and ${k + 1}x = 180°.`, `x = ${180 / (k + 1)}°, and the bigger angle is ${(180 * k) / (k + 1)}°.`],
    }),
    check: ({ k }, v) => v[0] === 180 && v[2] * v[1] === v[0] && v[3] + v[2] === v[0] && v[3] === k * v[2] }),

  // =========================================================== DATA
  fam({ id: 'g6.data.freq-learners', skill: 'G6_DATA_COLLECTION', outcome: 'G6.DATA.a', rung: 2, form: 'table',
    draw: () => {
      const fs = [1, 2, 3, 4, 5].map(() => randInt(2, 9)), tot = fs.reduce((x, y) => x + y, 0), books = fs.reduce((x, f, i) => x + f * (i + 1), 0);
      return uniq(tot, 15, books, Math.max(...fs)) ? { fs, tot, books } : null;
    },
    make: ({ fs, tot, books }) => ({
      question: 'A teacher asked each learner in a Grade 6 class how many story books they read last month. The frequency table shows the answers. How many learners were asked?',
      model: { type: 'table', data: { head: ['Books read', 'Frequency (number of learners)'], rows: fs.map((f, i) => ({ label: String(i + 1), value: String(f) })) } },
      answer: tot,
      wrong: [[15, 'That adds the numbers of books, 1 to 5. Each row tells how many learners gave that answer.'], [books, 'That is the total number of books. The question asks for the number of learners.'], [Math.max(...fs), 'That is only one row. Add the frequencies of all the rows.']],
      hints: ['The frequency is the number of learners in that row.', 'Add the frequencies of all the rows.'],
      steps: [`Add the frequencies: ${fs.join(' + ')}.`, `Total learners: ${tot}.`],
    }),
    check: ({ fs }, a) => a === fs.reduce((x, y) => x + y, 0) }),

  fam({ id: 'g6.data.freq-missing', skill: 'G6_DATA_COLLECTION', outcome: 'G6.DATA.a', rung: 3, form: 'table',
    draw: () => {
      const fs = [1, 2, 3, 4].map(() => randInt(3, 12)), hole = randInt(0, 3), tot = fs.reduce((x, y) => x + y, 0), others = tot - fs[hole];
      return uniq(fs[hole], tot, others, tot - Math.max(...fs)) ? { fs, hole, tot, others, p: person() } : null;
    },
    make: ({ fs, hole, tot, others, p }) => ({
      question: `${p.name} did a survey of ${tot} learners to find how many children are in each family. The frequency table has one number missing. How many learners belong in the empty row?`,
      model: { type: 'table', data: { head: ['Children in family', 'Frequency'], rows: fs.map((f, i) => ({ label: String(i + 1), value: i === hole ? '?' : String(f) })) } },
      answer: fs[hole],
      wrong: [[tot, 'That is the total number of learners in the survey. One row is only a part of it.'], [others, 'That is the total of the other rows. Take it from the survey total.'], [tot - Math.max(...fs), 'Take away the frequencies of all the other rows.']],
      hints: ['All the frequencies together make the total number of learners.', 'Add the numbers you can see, then take them from the total.'],
      steps: [`Known rows: ${fs.filter((_, i) => i !== hole).join(' + ')} = ${others}.`, `Missing: ${tot} − ${others} = ${fs[hole]}.`],
    }),
    check: ({ fs, hole, tot }, a) => a + fs.filter((_, i) => i !== hole).reduce((x, y) => x + y, 0) === tot }),
];
