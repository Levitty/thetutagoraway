// ============================================================================
// GRADE 4 QUESTION FAMILIES: estimating by rounding to the nearest ten,
// relating multiplication and division, types of fractions, improper and
// mixed numbers, ordering decimals, expressions with letters, shillings and
// cents, shopping lists, lines of symmetry, and the skills that had too few
// forms (number words, volume, angles, area, length).
// A nine year old reading a second language: short sentences, one or two steps.
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family, round, commas } from './core.js';
import { person, sh, price, PRICES } from './kenya.js';

const fam = (def) => family({ reviewed: false, ...def });
const rot = (arr, k) => { const n = k % arr.length; return [...arr.slice(n), ...arr.slice(0, n)]; };
const uniq = (...v) => new Set(v.map(String)).size === v.length;
const r10 = (n) => Math.round(n / 10) * 10;
const f10 = (n) => Math.floor(n / 10) * 10;
const sum = (a) => a.reduce((x, y) => x + y, 0);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const w99 = (n) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : ''));
const words = (n) => {
  const t = Math.floor(n / 1000), h = Math.floor((n % 1000) / 100), u = n % 100, s = [];
  if (t) s.push(`${ONES[t]} thousand`);
  if (h) s.push(`${ONES[h]} hundred`);
  if (u) s.push(t || h ? `and ${w99(u)}` : w99(u));
  return s.join(' ');
};
const ROMAN = { 2: 'II', 3: 'III', 4: 'IV', 7: 'VII', 8: 'VIII', 9: 'IX' };

export const FAMILIES = [
  // ======================================================================
  // WHOLE NUMBERS
  // ======================================================================
  fam({ id: 'g4.num.figures-notice', skill: 'G4_NUMBER_WORDS', cskill: 'MATH.G4.NUMBER.WHOLE_NUMBERS.SYMBOLS_10000', outcome: 'MATH.G4.NUMBER.WHOLE_NUMBERS.b', misMapped: false, reveals: ['M_SYM_JOIN_PARTS'], rung: 1, form: 'word',
    draw: () => ({ t: randInt(1, 9), tu: randInt(1, 99) }),
    make: ({ t, tu }) => {
      const n = t * 1000 + tu;
      return { question: `A school fee notice says: "${cap(words(n))} shillings." Write the amount in figures. Give your answer as a number.`,
        answer: n,
        wrong: [[t * 100 + tu, 'You left out a zero. The word "thousand" tells you the 1st digit is in the thousands place. No hundreds are named, so the hundreds place holds a zero.'], [t * 1000 + tu * 10, 'Check the last part of the words. It names tens and ones, not hundreds.'], [Number(`${t}000${tu}`), 'That has too many digits. A number in the thousands has four digits.']],
        hints: ['Find the word "thousand". The digit before it goes in the thousands place.', 'No hundreds are named. What goes in the hundreds place when there are none?'],
        steps: [`The thousands: ${ONES[t]} thousand is ${t}000.`, `The rest: ${w99(tu)} is ${tu}.`, `Put them together: ${commas(n)}.`] };
    },
    check: ({ t, tu }, a) => a % 1000 === tu && Math.floor(a / 1000) === t && words(a) === words(t * 1000 + tu) }),

  fam({ id: 'g4.num.words-pick', skill: 'G4_NUMBER_WORDS', cskill: 'MATH.G4.NUMBER.WHOLE_NUMBERS.SYMBOLS_10000', outcome: 'MATH.G4.NUMBER.WHOLE_NUMBERS.b', misMapped: false, reveals: ['M_WORDS_HUNDRED_DROPPED'], rung: 1, form: 'direct',
    draw: () => ({ t: randInt(1, 9), tu: randInt(11, 99), k: randInt(0, 3) }),
    make: ({ t, tu, k }) => {
      const n = t * 1000 + tu, n2 = t * 1000 + tu * 10, n3 = t * 100 + tu, n4 = t * 1000 + 100 + tu;
      const opts = [{ text: cap(words(n)), right: true }, ...[n2, n3, n4].map(v => ({ text: cap(words(v)), right: false, why: `Those words say ${commas(v)}. Say the number ${commas(n)} again: thousands, then hundreds, then tens and ones.` }))];
      return { question: `A sign at the market shows sh ${commas(n)}. Which line shows the amount in words?`, story: false, options: rot(opts, k),
        hints: [`${commas(n)} has ${t} in the thousands place.`, 'There is a zero in the hundreds place. You do not say "zero hundred".'],
        steps: [`The thousands part is ${ONES[t]} thousand.`, `There are no hundreds. The tens and ones make ${w99(tu)}.`, `In words: ${words(n)}.`] };
    } }),

  fam({ id: 'g4.place.chart-total', skill: 'G4_PLACE_VALUE', cskill: 'MATH.G4.NUMBER.WHOLE_NUMBERS.TOTAL_VALUE_TENTH', outcome: 'MATH.G4.NUMBER.WHOLE_NUMBERS.a', misMapped: false, reveals: ['M_TV_FACE_VALUE'], rung: 1, form: 'table',
    draw: () => {
      const ds = []; while (ds.length < 4) { const x = randInt(1, 9); if (!ds.includes(x)) ds.push(x); }
      const col = randInt(0, 2), place = [1000, 100, 10][col], n = ds[0] * 1000 + ds[1] * 100 + ds[2] * 10 + ds[3], dg = ds[col];
      return uniq(dg * place, dg, n, dg * place * 10, dg * (place / 10 || 1)) ? { ds, col, place, n, dg } : null;
    },
    make: ({ ds, col, place, n, dg }) => ({
      question: `Look at the place value chart. How much is the digit in the ${['Thousands', 'Hundreds', 'Tens'][col]} column worth altogether?`,
      model: { type: 'table', data: { head: ['Thousands', 'Hundreds', 'Tens', 'Ones'], rows: [{ cells: ds.map(String) }] } },
      answer: dg * place,
      wrong: [[dg, 'That is the digit itself. Its total value depends on the column it sits in.'], [n, 'That is the whole number. The question asks about one digit only.'], [dg * place * 10, 'Check the column name again. Is it worth that much?'], [dg * (place === 10 ? 1 : place / 10), 'You used the column to the right. Look at the heading above the digit.']],
      hints: ['Look at the digit under the heading you are asked about.', 'Each column has its own size. A digit is worth more in a column further to the left.'],
      steps: [`The digit in that column is ${dg}.`, `${dg} × ${commas(place)} = ${commas(dg * place)}.`] }),
    check: ({ n, place }, a) => Math.floor((n % (place * 10)) / place) * place === a }),

  fam({ id: 'g4.order.third-smallest', skill: 'G4_ORDER_ROUND', cskill: 'MATH.G4.NUMBER.WHOLE_NUMBERS.ORDER_1000', outcome: 'MATH.G4.NUMBER.WHOLE_NUMBERS.d', misMapped: false, reveals: ['M_ORDER_DIRECTION'], rung: 2, form: 'table',
    draw: () => {
      const names = ['Amani', 'Tumaini', 'Upendo', 'Baraka', 'Jamii', 'Mwangaza'];
      const vals = Array.from({ length: 4 }, () => randInt(21, 98) * 10 + randInt(0, 9));
      const s = [...vals].sort((a, b) => a - b);
      if (!uniq(...vals) || !uniq(s[3], vals[2], s[1], s[2])) return null;
      const nm = [...names].sort(() => Math.random() - 0.5).slice(0, 4);
      return { vals, nm, s };
    },
    make: ({ vals, nm, s }) => ({
      question: 'The table shows how many learners are in four schools. Put the schools in order, from the smallest to the largest. How many learners are in the third school in that order?',
      model: { type: 'table', data: { head: ['School', 'Learners'], rows: nm.map((n, i) => ({ label: `${n} Primary`, value: String(vals[i]) })) } },
      answer: s[2],
      wrong: [[s[3], 'That is the largest number, the fourth in the order. Count from the smallest.'], [vals[2], 'That is the third school in the table. The question asks for the third one after putting them in order.'], [s[1], 'That is the second in the order. Count one more.']],
      hints: ['Write the four numbers from the smallest to the largest.', 'Compare the hundreds first, then the tens.'],
      steps: [`In order: ${s.join(', ')}.`, `The third number is ${s[2]}.`] }),
    check: ({ vals, s }, a) => vals.filter(v => v < a).length === 2 && vals.includes(a) && s.indexOf(a) === 2 }),

  fam({ id: 'g4.round.spot-ones', skill: 'G4_ORDER_ROUND', cskill: 'MATH.G4.NUMBER.WHOLE_NUMBERS.ROUND_TEN_1000', outcome: 'MATH.G4.NUMBER.WHOLE_NUMBERS.e', misMapped: false, reveals: ['M_ROUND_DROP_ONES'], rung: 2, form: 'spot',
    draw: () => {
      const n = randInt(11, 99) * 10 + randInt(1, 9), u = n % 10;
      const kind = u >= 5 ? pick(['rule', 'write']) : 'rule';
      return { n, u, kind, p: person() };
    },
    make: ({ n, u, kind, p }) => {
      const down = f10(n), up = down + 10, truth = u >= 5 ? up : down;
      const claimBig = kind === 'rule' ? !(u >= 5) : u >= 5;
      const shownResult = kind === 'rule' ? (claimBig ? up : down) : down;
      return {
        question: `${p.name} rounded ${n} to the nearest ten. Which step has the mistake?`,
        working: [
          { text: `Look at the ones digit of ${n}. It is ${u}.`, ok: n % 10 === u },
          { text: `${u} is ${claimBig ? '5 or more' : 'less than 5'}.`, ok: claimBig === (u >= 5) },
          { text: `So round ${claimBig ? 'up' : 'down'}.`, ok: true },
          { text: `${n} is about ${shownResult}.`, ok: shownResult === (claimBig ? up : down) },
        ],
        fix: kind === 'rule' ? `${u} is ${u >= 5 ? '5 or more' : 'less than 5'}, so the number rounds ${u >= 5 ? 'up' : 'down'} to ${truth}.` : `Rounding up means the tens digit goes up by one. ${n} rounds up to ${up}, not ${down}.`,
        hints: ['Check the ones digit first. Then check the rule for 5.', '5 or more rounds up. Less than 5 rounds down.'],
        steps: [`The ones digit is ${u}.`, `${u} is ${u >= 5 ? '5 or more' : 'less than 5'}, so round ${u >= 5 ? 'up' : 'down'}.`, `${n} is about ${truth}.`],
      };
    } }),

  fam({ id: 'g4.factors.not-a-factor', skill: 'G4_FACTORS_MULTIPLES', cskill: 'MATH.G4.NUMBER.WHOLE_NUMBERS.FACTORS_50', outcome: 'MATH.G4.NUMBER.WHOLE_NUMBERS.f', misMapped: false, reveals: [], rung: 2, form: 'word',
    draw: () => {
      const n = pick([24, 30, 36, 40, 42, 48]);
      const fs = []; for (let i = 2; i <= 12; i++) if (n % i === 0) fs.push(i);
      const non = []; for (let i = 2; i <= 12; i++) if (n % i !== 0) non.push(i);
      const three = [...fs].sort(() => Math.random() - 0.5).slice(0, 3), x = pick(non);
      return { n, three, x, p: person(), k: randInt(0, 3) };
    },
    make: ({ n, three, x, p, k }) => {
      const opts = [{ text: String(x), right: true }, ...three.map(f => ({ text: String(f), right: false, why: `${n} ÷ ${f} = ${n / f} with nothing left over, so ${f} is a factor.` }))];
      return { question: `${p.name} packs ${n} eggs into trays of the same size. No egg is left over. Which of these numbers is NOT a factor of ${n}?`, options: rot(opts, k),
        hints: ['A factor divides the number exactly. Nothing is left over.', 'Try dividing by each number in turn.'],
        steps: [`Test each number. Divide ${n} by it.`, `${n} ÷ ${x} leaves a remainder, so ${x} is not a factor.`] };
    } }),

  fam({ id: 'g4.multiples.why-multiple', skill: 'G4_FACTORS_MULTIPLES', cskill: 'MATH.G4.NUMBER.WHOLE_NUMBERS.MULTIPLES_100', outcome: 'MATH.G4.NUMBER.WHOLE_NUMBERS.g', misMapped: false, reveals: ['M_MULTIPLE_NOT_CHECKED'], rung: 2, form: 'why',
    draw: () => {
      const m = pick([3, 4, 5, 6, 7, 8, 9]), k = randInt(4, 12), n = m * k;
      return n % 2 === 0 && n <= 100 ? { m, k, n, r: randInt(0, 3), p: person() } : null;
    },
    make: ({ m, k, n, r, p }) => {
      const opts = [
        { text: `${m} × ${k} = ${n}, so ${m} goes into ${n}`, right: true },
        { text: `${n} is an even number, and even numbers are multiples`, right: false, why: `Many even numbers are not multiples of ${m}. For example, ${n + 2} is even but ${m} does not go into it exactly.` },
        { text: `${n} is bigger than ${m}, and bigger numbers are multiples`, right: false, why: `${n + 1} is also bigger than ${m}, but it is not a multiple of ${m}.` },
        { text: `${m} + ${n - m} = ${n}, so the two numbers make ${n}`, right: false, why: `Any two numbers can be added to make ${n}. A multiple of ${m} comes from counting in ${m}s or multiplying ${m}.` },
      ];
      return { question: `${p.name} counts in ${m}s and reaches ${n}. ${p.She} says ${n} is a multiple of ${m}. Why is ${p.she} right?`, options: rot(opts, r),
        hints: [`Count in ${m}s: ${m}, ${m * 2}, ${m * 3} and so on.`, 'A multiple is made by multiplying the number by 1, 2, 3 and so on.'],
        steps: [`Counting in ${m}s reaches ${n}.`, `${m} × ${k} = ${n}, so ${n} is a multiple of ${m}.`] };
    } }),

  fam({ id: 'g4.oddeven.pattern-why', skill: 'G4_ODD_EVEN', cskill: 'MATH.G4.NUMBER.WHOLE_NUMBERS.EVEN_ODD_PATTERNS', outcome: 'MATH.G4.NUMBER.WHOLE_NUMBERS.i', misMapped: false, reveals: ['M_PATTERN_WRONG_PARITY'], rung: 2, form: 'why',
    draw: () => ({ s: randInt(1, 9), d: pick([3, 5, 7, 9]), r: randInt(0, 3) }),
    make: ({ s, d, r }) => {
      const t = [0, 1, 2, 3, 4].map(i => s + i * d).join(', ');
      const opts = [
        { text: `Each time we add ${d}, an odd number, so odd and even swap`, right: true },
        { text: 'The numbers get bigger each time, so they must swap between odd and even', right: false, why: 'Numbers can get bigger and stay odd. Think of adding 2 each time to 5: 5, 7, 9.' },
        { text: 'Adding any number at all changes an odd number to an even number', right: false, why: 'Adding an even number, such as 4, keeps an odd number odd.' },
        { text: `The first number is ${s % 2 ? 'odd' : 'even'}, so all the numbers are ${s % 2 ? 'odd' : 'even'} too`, right: false, why: 'Look at the pattern again. The numbers are not all the same kind.' },
      ];
      return { question: `Look at this pattern: ${t}. The numbers change from odd to even, and from even to odd, again and again. Why?`, options: rot(opts, r),
        hints: [`The pattern adds ${d} each time. Is ${d} odd or even?`, 'Try: odd + odd, and then even + odd.'],
        steps: [`${d} is an odd number, and we add it each time.`, 'Odd + odd = even. Even + odd = odd.', 'So the numbers swap between odd and even.'] };
    } }),

  fam({ id: 'g4.oddeven.house-numbers', skill: 'G4_ODD_EVEN', cskill: 'MATH.G4.NUMBER.WHOLE_NUMBERS.EVEN_ODD_PATTERNS', outcome: 'MATH.G4.NUMBER.WHOLE_NUMBERS.i', misMapped: false, reveals: ['M_PATTERN_HOUSES_ONE_SIDE'], rung: 2, form: 'word',
    draw: () => { const o = pick([1, 3, 5, 7, 9, 11]), n = randInt(7, 9); return uniq(2 * n, o + 2 * n, o + n - 1, o + 2 * (n - 1)) ? { o, n } : null; },
    make: ({ o, n }) => ({
      question: `The odd house numbers on one side of a road follow a pattern: ${o}, ${o + 2}, ${o + 4}, ${o + 6}. What is the number of the ${['', '', '', '', '', '', '', '7th', '8th', '9th'][n]} house on that side?`,
      answer: o + 2 * (n - 1),
      wrong: [[2 * n, 'That is an even number. The houses on this side all have odd numbers.'], [o + 2 * n, 'That is one step too far. Count the houses carefully.'], [o + n - 1, 'The pattern goes up by 2 each time, not by 1.']],
      hints: ['Look at how much the numbers go up each time.', 'The 1st house is the first number. Each house after it adds the same amount.'],
      steps: ['The numbers go up by 2 each time.', `For the ${n}th house we add 2 a total of ${n - 1} times to ${o}.`, `${o} + ${2 * (n - 1)} = ${o + 2 * (n - 1)}.`] }),
    check: ({ o, n }, a) => a % 2 === 1 && (a - o) / 2 === n - 1 }),

  fam({ id: 'g4.roman.minute-hand', skill: 'G4_ROMAN_NUMERALS', cskill: 'MATH.G4.NUMBER.WHOLE_NUMBERS.ROMAN_TO_X', outcome: 'MATH.G4.NUMBER.WHOLE_NUMBERS.j', misMapped: false, reveals: [], rung: 2, form: 'word',
    draw: () => ({ n: pick([2, 3, 4, 7, 8, 9]), p: person() }),
    make: ({ n, p }) => ({
      question: `${p.name}'s watch shows Roman numerals on its face. The minute hand points to ${ROMAN[n]}. How many minutes past the hour is it?`,
      answer: 5 * n,
      wrong: [[n, `Read the Roman numeral first. Then remember that each number on a clock face is worth 5 minutes.`], [60 - 5 * n, 'That is how many minutes are left to the next hour. Count the minutes past the hour.'], [5 * (n + 1), 'Check the Roman numeral again. Which number does it stand for?']],
      hints: [`What number does ${ROMAN[n]} stand for?`, 'Each number on a clock face is 5 minutes.'],
      steps: [`${ROMAN[n]} is ${n}.`, `${n} × 5 = ${5 * n} minutes.`] }),
    check: ({ n }, a) => a % 5 === 0 && ROMAN[a / 5] === ROMAN[n] }),

  // ======================================================================
  // ADDITION: estimate, patterns
  // ======================================================================
  fam({ id: 'g4.add.estimate-sales', skill: 'G4_ADD', cskill: 'MATH.G4.NUMBER.ADDITION.ESTIMATE_SUM_TEN', outcome: 'MATH.G4.NUMBER.ADDITION.c', misMapped: false, reveals: ['M_EST_ROUND_WRONG'], rung: 2, form: 'word',
    draw: () => {
      const pk = () => { let v; do { v = randInt(12, 99) * 10 + randInt(1, 9); } while (v % 10 === 5); return v; };
      const a = pk(), b = pk(), est = r10(a) + r10(b), ex = a + b;
      return uniq(est, ex, f10(a) + f10(b), r10(a) + b) ? { a, b, est, what: pick(['mandazi', 'loaves of bread', 'eggs', 'oranges']), p: person() } : null;
    },
    make: ({ a, b, est, what, p }) => ({
      question: `${p.name} sells ${a} ${what} on Saturday and ${b} ${what} on Sunday. Round each number to the nearest ten. Estimate how many ${what} ${p.she} sells in all.`,
      answer: est,
      wrong: [[a + b, 'That is the exact total. An estimate rounds each number first.'], [f10(a) + f10(b), 'You rounded both numbers down. Look at the ones digit of each one to decide.'], [r10(a) + b, 'Only one number was rounded. Round both numbers.']],
      hints: ['Round each number to the nearest ten first.', 'Then add the two rounded numbers.'],
      steps: [`${a} is about ${r10(a)}. ${b} is about ${r10(b)}.`, `${r10(a)} + ${r10(b)} = ${est}.`] }),
    check: ({ a, b }, v) => v % 10 === 0 && Math.abs(v - (a + b)) <= 10 }),

  fam({ id: 'g4.add.estimate-water', skill: 'G4_ADD', cskill: 'MATH.G4.NUMBER.ADDITION.ESTIMATE_SUM_TEN', outcome: 'MATH.G4.NUMBER.ADDITION.c', misMapped: false, reveals: ['M_EST_ROUND_WRONG'], rung: 2, form: 'table',
    draw: () => {
      const v = Array.from({ length: 3 }, () => { let x; do { x = randInt(100, 330) * 10 + randInt(1, 9); } while (x % 10 === 5); return x; });
      const est = sum(v.map(r10));
      return uniq(est, sum(v), sum(v.map(f10)), r10(v[0]) + r10(v[1])) ? { v, est } : null;
    },
    make: ({ v, est }) => ({
      question: 'The table shows litres of water used at a school. Round each number to the nearest ten. Estimate how many litres are used in the three months.',
      model: { type: 'table', data: { head: ['Month', 'Litres used'], rows: ['January', 'February', 'March'].map((m, i) => ({ label: m, value: commas(v[i]) })) } },
      answer: est,
      wrong: [[sum(v), 'That is the exact total. An estimate rounds each number first.'], [sum(v.map(f10)), 'You rounded every number down. Look at the ones digit of each one.'], [r10(v[0]) + r10(v[1]), 'That leaves out one month. The question asks for all three months.']],
      hints: ['Round each of the three numbers to the nearest ten.', 'Then add the three rounded numbers.'],
      steps: [`The rounded numbers are ${v.map(r10).join(', ')}.`, `${v.map(r10).join(' + ')} = ${commas(est)}.`] }),
    check: ({ v }, a) => a % 10 === 0 && Math.abs(a - sum(v)) <= 15 }),

  fam({ id: 'g4.add.pattern-savings', skill: 'G4_ADD', cskill: 'MATH.G4.NUMBER.ADDITION.ADD_PATTERNS', outcome: 'MATH.G4.NUMBER.ADDITION.d', misMapped: false, reveals: ['M_PAT_ADD_ONE_STEP_ONLY'], rung: 2, form: 'word',
    draw: () => { const s = randInt(5, 50) * 10, d = pick([20, 30, 40, 50, 60]), n = pick([5, 6]); return uniq(s + (n - 1) * d, s + n * d, s + (n - 2) * d, d * n) ? { s, d, n, p: person() } : null; },
    make: ({ s, d, n, p }) => ({
      question: `${p.name} saves money each week. The amounts follow a pattern: ${sh(s)}, ${sh(s + d)}, ${sh(s + 2 * d)}. The pattern goes on. How much does ${p.she} save in week ${n}?`,
      answer: s + (n - 1) * d,
      wrong: [[s + n * d, 'That is one step too far. Week 1 is the start. Count the weeks again.'], [s + (n - 2) * d, 'That is one step too early. Count how many times the same amount is added.'], [d * n, 'The first amount is not zero. Start from the first amount.']],
      hints: ['Find how much more is saved each week.', 'Week 1 is the first amount. Each new week adds the same amount.'],
      steps: [`Each week ${p.she} saves ${sh(d)} more.`, `Week ${n} adds ${sh(d)} a total of ${n - 1} times to ${sh(s)}.`, `${s} + ${(n - 1) * d} = ${s + (n - 1) * d}.`] }),
    check: ({ s, d, n }, a) => (a - s) / d === n - 1 }),

  fam({ id: 'g4.add.pattern-missing', skill: 'G4_ADD', cskill: 'MATH.G4.NUMBER.ADDITION.ADD_PATTERNS', outcome: 'MATH.G4.NUMBER.ADDITION.d', misMapped: false, reveals: ['M_PAT_MISSING_NOT_CHECKED'], rung: 2, form: 'table',
    draw: () => { const a = randInt(10, 80) * 10, d = pick([30, 40, 50, 60, 70, 80]); return uniq(a + d, a + 2 * d, d, 2 * a + 2 * d) ? { a, d, p: person() } : null; },
    make: ({ a, d }) => ({
      question: 'A farmer plants the same number of extra trees each month. The table shows the pattern. How many trees go in the empty box?',
      model: { type: 'table', data: { head: ['Month', 'Trees planted'], rows: [{ label: 'Month 1', value: String(a) }, { label: 'Month 2', value: '?' }, { label: 'Month 3', value: String(a + 2 * d) }, { label: 'Month 4', value: String(a + 3 * d) }] } },
      answer: a + d,
      wrong: [[a + 2 * d, 'That is Month 3. The empty box is between Month 1 and Month 3.'], [d, 'That is how many more trees are planted each month. Add it to Month 1.'], [2 * a + 2 * d, 'Adding two rows does not follow the pattern. Find what is added each month.']],
      hints: ['Look at Month 3 and Month 4. How much more is planted?', 'Month 2 is one step after Month 1.'],
      steps: [`Month 4 − Month 3 = ${d}. So ${d} more trees each month.`, `Month 2 = ${a} + ${d} = ${a + d}.`] }),
    check: ({ a, d }, v) => v - a === d && a + 2 * d - v === d }),

  // ======================================================================
  // SUBTRACTION: estimate, patterns
  // ======================================================================
  fam({ id: 'g4.sub.estimate-stock', skill: 'G4_SUB', cskill: 'MATH.G4.NUMBER.SUBTRACTION.ESTIMATE_DIFF_TEN', outcome: 'MATH.G4.NUMBER.SUBTRACTION.c', misMapped: false, reveals: ['M_EST_DIFF_ROUND_DOWN'], rung: 2, form: 'word',
    draw: () => {
      const pk = () => { let v; do { v = randInt(12, 99) * 10 + randInt(1, 9); } while (v % 10 === 5); return v; };
      let a = pk(), b = pk(); if (a < b) [a, b] = [b, a];
      const est = r10(a) - r10(b);
      return a - b >= 60 && uniq(est, a - b, f10(a) - f10(b), r10(a) + r10(b)) ? { a, b, est, what: pick(['litres of cooking oil', 'kg of rice', 'bottles of soda', 'litres of milk']) } : null;
    },
    make: ({ a, b, est, what }) => ({
      question: `A shop has ${a} ${what}. The shop sells ${b} of them in a week. Round each number to the nearest ten. Estimate how many ${what} are left.`,
      answer: est,
      wrong: [[a - b, 'That is the exact answer. An estimate rounds each number first.'], [f10(a) - f10(b), 'You rounded both numbers down. Look at the ones digit of each one.'], [r10(a) + r10(b), 'The shop sells some, so there are fewer left. Take away.']],
      hints: ['Round each number to the nearest ten.', 'Then take the smaller rounded number from the bigger one.'],
      steps: [`${a} is about ${r10(a)}. ${b} is about ${r10(b)}.`, `${r10(a)} − ${r10(b)} = ${est}.`] }),
    check: ({ a, b }, v) => v % 10 === 0 && Math.abs(v - (a - b)) <= 10 && v + r10(b) === r10(a) }),

  fam({ id: 'g4.sub.estimate-steps', skill: 'G4_SUB', cskill: 'MATH.G4.NUMBER.SUBTRACTION.ESTIMATE_DIFF_TEN', outcome: 'MATH.G4.NUMBER.SUBTRACTION.c', misMapped: false, reveals: ['M_EST_EXACT_REQUIRED'], rung: 2, form: 'steps',
    draw: () => {
      const pk = () => { let v; do { v = randInt(150, 480) * 10 + randInt(1, 9); } while (v % 10 === 5); return v; };
      let a = pk(), b = pk(); if (a < b) [a, b] = [b, a];
      b = Math.min(b, a - 600);
      if (b % 10 === 0 || b % 10 === 5 || b < 1000) return null;
      return uniq(r10(a) - r10(b), a - b, f10(a), r10(a), f10(b), r10(b)) ? { a, b, p: person() } : null;
    },
    make: ({ a, b, p }) => ({
      question: `${p.name}'s school had ${commas(a)} books. It gave out ${commas(b)} books. ${p.name} wants to estimate how many are left.`,
      parts: [
        { prompt: `Round ${commas(a)} to the nearest ten.`, answer: r10(a), hint: `Look at the ones digit of ${commas(a)}.`, wrong: [[f10(a), 'The ones digit decides. 5 or more goes up.']] },
        { prompt: `Round ${commas(b)} to the nearest ten.`, answer: r10(b), hint: `Look at the ones digit of ${commas(b)}.`, wrong: [[f10(b), 'The ones digit decides. 5 or more goes up.']] },
        { prompt: 'Now estimate how many books are left.', answer: r10(a) - r10(b), unit: 'books', hint: 'Take the second rounded number from the first.', wrong: [[r10(a) + r10(b), 'Books were given out. Take away.']] },
        { prompt: `Now work out the exact number of books left: ${commas(a)} − ${commas(b)}.`, answer: a - b, unit: 'books', hint: 'Subtract the exact numbers. Regroup where you need to.', wrong: [[r10(a) - r10(b), 'That is the estimate. Use the exact numbers here.']] },
      ],
      steps: [`${commas(a)} is about ${commas(r10(a))}. ${commas(b)} is about ${commas(r10(b))}.`, `Estimate: ${commas(r10(a))} − ${commas(r10(b))} = ${commas(r10(a) - r10(b))}.`, `Exact: ${commas(a)} − ${commas(b)} = ${commas(a - b)}.`] }),
    check: ({ a, b }, v) => v[0] + 0 === r10(a) && v[1] === r10(b) && v[2] === v[0] - v[1] && v[3] + b === a && Math.abs(v[2] - v[3]) <= 10 }),

  fam({ id: 'g4.sub.pattern-next', skill: 'G4_SUB', cskill: 'MATH.G4.NUMBER.SUBTRACTION.SUB_PATTERNS', outcome: 'MATH.G4.NUMBER.SUBTRACTION.d', misMapped: false, reveals: ['M_SUBPAT_ADDS'], rung: 1, form: 'direct',
    draw: () => { const d = pick([20, 30, 40, 50, 60, 70, 80]), s = randInt(30, 150) * 10 + 0; return s - 5 * d > 0 ? { s, d } : null; },
    make: ({ s, d }) => {
      const seq = [0, 1, 2, 3].map(i => commas(s - i * d)).join(', ');
      return { question: `What is the next number in this pattern: ${seq}?`, story: false,
        answer: s - 4 * d,
        wrong: [[s - 3 * d, 'That is the last number shown. The next one is smaller again.'], [s - 5 * d, 'That skips a number. Take away the same amount just once.'], [s - 2 * d, 'That is a number that is already in the pattern. The pattern keeps going down.']],
        hints: ['Find how much the numbers go down each time.', 'Take that amount from the last number.'],
        steps: [`${commas(s)} − ${commas(s - d)} = ${d}. The numbers go down by ${d}.`, `${commas(s - 3 * d)} − ${d} = ${commas(s - 4 * d)}.`] };
    },
    check: ({ s, d }, a) => (s - a) / d === 4 }),

  fam({ id: 'g4.sub.pattern-tank', skill: 'G4_SUB', cskill: 'MATH.G4.NUMBER.SUBTRACTION.SUB_PATTERNS', outcome: 'MATH.G4.NUMBER.SUBTRACTION.d', misMapped: false, reveals: ['M_SUBPAT_STEP_NOT_CONSTANT'], rung: 2, form: 'word',
    draw: () => { const d = pick([50, 60, 75, 80, 90]), n = pick([4, 5, 6]), s = pick([10, 12, 15]) * 100; return s - n * d > 0 && uniq(s - n * d, s - (n - 1) * d, s + n * d, n * d) ? { s, d, n } : null; },
    make: ({ s, d, n }) => ({
      question: `A water tank has ${commas(s)} litres. Each day ${d} litres are used. The amount left each day follows a pattern. How many litres are left after ${n} days?`,
      answer: s - n * d,
      wrong: [[s - (n - 1) * d, 'That is one day too few. Count all the days.'], [s + n * d, 'Water is used, so the amount goes down.'], [n * d, 'That is the water used. The question asks for the water left.']],
      hints: ['Each day the amount goes down by the same number of litres.', `Find the water used in ${n} days. Then take it from the start.`],
      steps: [`Water used in ${n} days: ${n} × ${d} = ${n * d} litres.`, `${commas(s)} − ${n * d} = ${commas(s - n * d)} litres.`] }),
    check: ({ s, d, n }, a) => a + n * d === s }),

  // ======================================================================
  // MULTIPLICATION: estimate, patterns
  // ======================================================================
  fam({ id: 'g4.mul.estimate-boxes', skill: 'G4_MULTIPLY', cskill: 'MATH.G4.NUMBER.MULTIPLICATION.ESTIMATE_PRODUCT_TEN', outcome: 'MATH.G4.NUMBER.MULTIPLICATION.c', misMapped: false, reveals: ['M_EST_PROD_ROUND_ONE'], rung: 2, form: 'word',
    draw: () => {
      let n; do { n = randInt(23, 88); } while (n % 5 === 0);
      const k = randInt(3, 9), u = n % 10, est = r10(n) * k, other = (u < 5 ? r10(n) + 10 : r10(n) - 10) * k;
      return uniq(est, n * k, other, r10(n) + k) ? { n, k, u, est, other, p: person(), what: pick([['sweets', 'bag', 'bags'], ['mandazi', 'tray', 'trays'], ['oranges', 'crate', 'crates'], ['exercise books', 'packet', 'packets']]) } : null;
    },
    make: ({ n, k, est, other, p, what }) => ({
      question: `${p.name} buys ${k} ${what[2]} of ${what[0]}. Each ${what[1]} has ${n} ${what[0]}. Round ${n} to the nearest ten. Estimate how many ${what[0]} ${p.she} buys.`,
      answer: est,
      wrong: [[n * k, 'That is the exact answer. An estimate rounds first.'], [other, `You rounded ${n} the wrong way. Look at its ones digit.`], [r10(n) + k, 'The question has equal groups. Multiply, do not add.']],
      hints: [`Round ${n} to the nearest ten first.`, `Then multiply by ${k}.`],
      steps: [`${n} is about ${r10(n)}.`, `${r10(n)} × ${k} = ${est}.`] }),
    check: ({ n, k }, a) => a % k === 0 && a / k === r10(n) }),

  fam({ id: 'g4.mul.estimate-why', skill: 'G4_MULTIPLY', cskill: 'MATH.G4.NUMBER.MULTIPLICATION.ESTIMATE_PRODUCT_TEN', outcome: 'MATH.G4.NUMBER.MULTIPLICATION.c', misMapped: false, reveals: [], rung: 2, form: 'why',
    draw: () => { let n; do { n = randInt(23, 88); } while (n % 5 === 0); return { n, k: randInt(3, 9), r: randInt(0, 3), p: person() }; },
    make: ({ n, k, r, p }) => {
      const e = r10(n), up = e > n, more = up ? 'more' : 'less', big = up ? 'bigger' : 'smaller';
      const opts = [
        { text: `${n} was rounded ${up ? 'up' : 'down'} to ${e}, which is ${big} than ${n}`, right: true },
        { text: `An estimate is always ${big} than the exact answer`, right: false, why: 'An estimate can be bigger or smaller. It depends on how the numbers were rounded.' },
        { text: `${k} was rounded as well`, right: false, why: `${k} was not changed. Only the other number was rounded.` },
        { text: 'The exact answer is wrong', right: false, why: 'The exact answer is right. The estimate is only close to it.' },
      ];
      return { question: `${p.name} estimates ${n} × ${k}. ${p.She} rounds ${n} to ${e} and works out ${e} × ${k} = ${e * k}. The exact answer is ${n * k}. Why is the estimate ${more} than the exact answer?`, options: rot(opts, r),
        hints: [`Compare ${n} with the rounded number.`, `If a number is made ${big}, what happens to the product?`],
        steps: [`${n} became ${e}. That is ${big}.`, `A ${big} number multiplied by ${k} gives a ${big} product.`] };
    } }),

  fam({ id: 'g4.mul.pattern-seedlings', skill: 'G4_MULTIPLY', cskill: 'MATH.G4.NUMBER.MULTIPLICATION.MULT_PATTERNS', outcome: 'MATH.G4.NUMBER.MULTIPLICATION.d', misMapped: false, reveals: ['M_MULPAT_ADD_STEP'], rung: 2, form: 'word',
    draw: () => { const a = pick([2, 3, 4, 5]), m = pick([2, 3]); return uniq(a * m ** 3, a * m * m + a * m, a * m * m + a, a * m ** 4) ? { a, m, p: person() } : null; },
    make: ({ a, m, p }) => ({
      question: `${p.name} plants seedlings. In week 1 there are ${a}. In week 2 there are ${a * m}. In week 3 there are ${a * m * m}. This pattern goes on. How many seedlings are there in week 4?`,
      answer: a * m ** 3,
      wrong: [[a * m * m + a * m, 'That adds the last two numbers. Check how week 1 changes to week 2: is it adding?'], [a * m * m + a, 'The pattern is not adding. Check how the numbers change from week to week.'], [a * m ** 4, 'That is one step too far. Week 4 comes right after week 3.']],
      hints: ['How do you get from week 1 to week 2? Is it adding or multiplying?', 'Do the same step again after week 3.'],
      steps: [`${a} × ${m} = ${a * m}, and ${a * m} × ${m} = ${a * m * m}. The number is multiplied by ${m} each week.`, `Week 4: ${a * m * m} × ${m} = ${a * m ** 3}.`] }),
    check: ({ a, m }, v) => v / m / m / m === a }),

  fam({ id: 'g4.mul.pattern-table', skill: 'G4_MULTIPLY', cskill: 'MATH.G4.NUMBER.MULTIPLICATION.MULT_PATTERNS', outcome: 'MATH.G4.NUMBER.MULTIPLICATION.d', misMapped: false, reveals: ['M_MULPAT_SKIP_TABLE'], rung: 2, form: 'table',
    draw: () => {
      const c = pick([{ u: 4, head: 'Chairs', what: 'Legs', thing: 'chairs', e: 'legs' }, { u: 7, head: 'Weeks', what: 'Days', thing: 'weeks', e: 'days' }, { u: 6, head: 'Trays', what: 'Eggs', thing: 'trays of eggs', e: 'eggs' }, { u: 5, head: 'Packets', what: 'Biscuits', thing: 'packets', e: 'biscuits' }]);
      const k = randInt(7, 9);
      return uniq(k * c.u, k + c.u, (k - 1) * c.u, 4 * c.u + (k - 4)) ? { c, k } : null;
    },
    make: ({ c, k }) => ({
      question: `The table shows a pattern. How many ${c.e} are there in ${k} ${c.thing}?`,
      model: { type: 'table', data: { head: [c.head, c.what], rows: [1, 2, 3, 4].map(i => ({ label: String(i), value: String(i * c.u) })) } },
      answer: k * c.u,
      wrong: [[k + c.u, 'The numbers in the table grow by multiplying. Do not add.'], [(k - 1) * c.u, `That is for one ${c.head === 'Weeks' ? 'week' : c.head.slice(0, -1).toLowerCase()} fewer. Use the number you are asked about.`], [4 * c.u + (k - 4), 'Counting on by 1 from the last row does not follow the pattern.']],
      hints: ['Look at row 1. How many are there for one?', 'Each row is that number multiplied by the number in the first column.'],
      steps: [`One of them has ${c.u}. The table goes up by ${c.u} each time.`, `${k} × ${c.u} = ${k * c.u}.`] }),
    check: ({ c, k }, a) => a % c.u === 0 && a / c.u === k }),

  // ======================================================================
  // DIVISION: relating multiplication and division
  // ======================================================================
  fam({ id: 'g4.div.related-facts', skill: 'G4_DIVIDE', cskill: 'MATH.G4.NUMBER.DIVISION.MULT_DIV_RELATE', outcome: 'MATH.G4.NUMBER.DIVISION.b', misMapped: false, reveals: ['M_RELATE_WRONG_FACT'], rung: 1, form: 'steps',
    draw: () => { const a = randInt(4, 9), b = randInt(6, 9); return a !== b ? { a, b, p: person() } : null; },
    make: ({ a, b, p }) => ({
      question: `${p.name} packs eggs. ${p.She} fills ${a} trays with ${b} eggs in each tray. Answer the parts. They use related facts.`,
      parts: [
        { prompt: `How many eggs are there? ${a} × ${b} = ?`, answer: a * b, unit: 'eggs', hint: `${a} trays with ${b} eggs in each tray.`, wrong: [[a + b, 'Equal trays: multiply.']] },
        { prompt: `Share ${a * b} eggs equally into ${a} trays. ${a * b} ÷ ${a} = ?`, answer: b, unit: 'eggs', hint: 'Which multiplication fact is related to this division?', wrong: [[a, 'That is the number of trays. How many eggs go in each tray?']] },
        { prompt: `Put ${a * b} eggs into trays of ${b}. ${a * b} ÷ ${b} = ?`, answer: a, unit: 'trays', hint: 'Use the same fact again.', wrong: [[b, 'That is the number in each tray. The question asks how many trays.']] },
      ],
      steps: [`${a} × ${b} = ${a * b}.`, `The related divisions are ${a * b} ÷ ${a} = ${b} and ${a * b} ÷ ${b} = ${a}.`] }),
    check: ({ a, b }, v) => v[0] === a * b && v[1] * a === v[0] && v[2] * b === v[0] }),

  fam({ id: 'g4.div.spot-check', skill: 'G4_DIVIDE', cskill: 'MATH.G4.NUMBER.DIVISION.MULT_DIV_RELATE', outcome: 'MATH.G4.NUMBER.DIVISION.b', misMapped: false, reveals: [], rung: 2, form: 'spot',
    draw: () => { const d = randInt(3, 9), q = randInt(11, 19); return { d, q, n: d * q, kind: pick(['div', 'times', 'end']), off: pick([-1, 1]), slip: pick([-10, 10, 1, -1]), p: person() }; },
    make: ({ d, q, n, kind, off, slip, p }) => {
      const q2 = kind === 'div' ? q + off : q, prod = kind === 'times' ? q * d + slip : q2 * d;
      return {
        question: `${p.name} divides ${n} by ${d}. Then ${p.she} checks the answer with multiplication. Which step has the mistake?`,
        working: [
          { text: `${n} ÷ ${d} = ${q2}`, ok: q2 * d === n },
          { text: `Check: ${q2} × ${d} = ${prod}`, ok: prod === q2 * d },
          { text: kind === 'end' ? `${prod} is the same as ${n}.` : `${prod} is not ${n}.`, ok: kind === 'end' ? prod === n : prod !== n },
          { text: 'So the division is wrong.', ok: prod !== n },
        ],
        fix: kind === 'div' ? `${n} ÷ ${d} = ${q}, not ${q2}. The check showed the problem, but the first step is where the mistake is.` : kind === 'times' ? `${q} × ${d} = ${n}. The multiplication in the check was wrong, so the check failed although the division was right.` : `The check gives back ${n}, which is the starting number. So the division is right.`,
        hints: ['Check each line one at a time.', 'Multiplying the answer by the divider should give back the starting number.'],
        steps: [`${n} ÷ ${d} = ${q}.`, `Check: ${q} × ${d} = ${n}, so the division is right.`],
      };
    } }),

  fam({ id: 'g4.div.why-check', skill: 'G4_DIVIDE', cskill: 'MATH.G4.NUMBER.DIVISION.MULT_DIV_RELATE', outcome: 'MATH.G4.NUMBER.DIVISION.b', misMapped: false, reveals: ['M_RELATE_CHECK_ADDS'], rung: 2, form: 'why',
    draw: () => { const d = randInt(3, 9), q = randInt(11, 19); return { d, q, n: d * q, r: randInt(0, 3), p: person() }; },
    make: ({ d, q, n, r, p }) => {
      const opts = [
        { text: `Multiplying undoes dividing, so ${q} × ${d} must give back ${n}`, right: true },
        { text: 'Multiplying is easier than dividing', right: false, why: 'Easy or hard is not the reason. Multiplying undoes dividing, so it can be used to check.' },
        { text: `${q} + ${d} must be the same as ${n}`, right: false, why: 'Adding does not undo dividing.' },
        { text: `The answer to a division is always smaller than ${d}`, right: false, why: 'The answer to a division can be bigger or smaller than the divider.' },
      ];
      return { question: `${p.name} divides ${n} by ${d} and gets ${q}. To check a division, ${p.she} works out ${q} × ${d}. Why does this check work?`, options: rot(opts, r),
        hints: ['Think of sharing into equal groups, then putting the groups back together.', 'Dividing splits a number up. What puts it back?'],
        steps: [`${n} ÷ ${d} = ${q} means ${d} equal groups of ${q}.`, `Putting the groups back: ${q} × ${d} = ${n}. We get the number we started with.`] };
    } }),

  // ======================================================================
  // FRACTIONS: numerator and denominator, types, improper and mixed
  // ======================================================================
  fam({ id: 'g4.frac.denominator-chapati', skill: 'G4_FRACTIONS', cskill: 'MATH.G4.NUMBER.FRACTIONS.NUM_DEN', outcome: 'MATH.G4.NUMBER.FRACTIONS.a', misMapped: false, reveals: ['M_FRAC_TWO_NUMBERS_SEPARATE'], rung: 1, form: 'word',
    draw: () => { const d = pick([4, 5, 6, 8, 10]), n = randInt(2, d - 2); return { d, n, p: person(), k: randInt(0, 3) }; },
    make: ({ d, n, p, k }) => {
      const opts = [
        { text: `The chapati was cut into ${d} equal pieces`, right: true },
        { text: `${p.name} ate ${d} pieces of the chapati`, right: false, why: 'The number of pieces eaten is the top number, the numerator.' },
        { text: `There are ${n} equal pieces in the whole chapati`, right: false, why: `${n} is the numerator. It tells how many pieces ${p.name} ate.` },
        { text: `${d - n} pieces are left over after ${p.name} eats`, right: false, why: 'The bottom number does not tell how many are left. It tells how many equal parts the whole has.' },
      ];
      return { question: `${p.name} cuts a chapati into ${d} equal pieces. ${p.She} eats ${n} pieces. ${p.She} writes the fraction ${n}/${d}. What does the denominator ${d} tell us?`, options: rot(opts, k),
        hints: ['The denominator is the bottom number of a fraction.', 'It names the equal parts that make one whole.'],
        steps: [`The denominator is ${d}, the bottom number.`, `It tells how many equal pieces make the whole chapati.`] };
    } }),

  fam({ id: 'g4.frac.type-pick', skill: 'G4_FRACTIONS', cskill: 'MATH.G4.NUMBER.FRACTIONS.TYPES_OF_FRACTIONS', outcome: 'MATH.G4.NUMBER.FRACTIONS.c', misMapped: false, reveals: ['M_TYPE_MIXED_AS_PROPER'], rung: 1, form: 'direct',
    draw: () => {
      const T = pick(['proper', 'improper', 'mixed']);
      const mk = (t) => { const d = randInt(3, 9); return t === 'proper' ? `${randInt(1, d - 1)}/${d}` : t === 'improper' ? `${randInt(d + 1, 2 * d - 1)}/${d}` : `${randInt(1, 4)} ${randInt(1, d - 1)}/${d}`; };
      const others = ['proper', 'improper', 'mixed'].filter(t => t !== T);
      const kinds = [T, pick(others), pick(others), pick(others)];
      const texts = kinds.map(mk);
      const val = (x) => { const m = x.match(/^(?:(\d+) )?(\d+)\/(\d+)$/); return ((Number(m[1] || 0) * Number(m[3]) + Number(m[2])) / Number(m[3])).toFixed(6); };
      return new Set(texts.map(val)).size === 4 ? { T, kinds, texts, k: randInt(0, 3), p: person() } : null;
    },
    make: ({ T, kinds, texts, k, p }) => {
      const name = { proper: 'a proper fraction', improper: 'an improper fraction', mixed: 'a mixed number' };
      const why = (t, x) => ({ proper: `${x} has a numerator smaller than its denominator, so it is a proper fraction.`, improper: `${x} has a numerator bigger than its denominator, so it is an improper fraction.`, mixed: `${x} has a whole number and a fraction, so it is a mixed number.` })[t];
      const opts = kinds.map((t, i) => ({ text: texts[i], right: i === 0, why: i === 0 ? undefined : why(t, texts[i]) }));
      return { question: `${p.name} sorts fractions into types. Which of these is ${name[T]}?`, story: false, options: rot(opts, k),
        hints: ['Proper: the top is smaller than the bottom. Improper: the top is bigger. Mixed: a whole number and a fraction.', 'Look at each choice and name its type.'],
        steps: [`Name the type of each choice.`, `${texts[0]} is ${name[T]}.`] };
    } }),

  fam({ id: 'g4.frac.type-why', skill: 'G4_FRACTIONS', cskill: 'MATH.G4.NUMBER.FRACTIONS.TYPES_OF_FRACTIONS', outcome: 'MATH.G4.NUMBER.FRACTIONS.c', misMapped: false, reveals: ['M_TYPE_IMPROPER_NOT_FRACTION'], rung: 2, form: 'why',
    draw: () => { const d = randInt(3, 9); return { d, n: randInt(d + 1, 2 * d - 1), r: randInt(0, 3) }; },
    make: ({ d, n, r }) => {
      const opts = [
        { text: `The top number ${n} is bigger than the bottom number ${d}`, right: true },
        { text: 'It is smaller than one whole, so the top is smaller', right: false, why: 'A fraction smaller than one whole is a proper fraction. Compare the top and bottom numbers.' },
        { text: 'It has a whole number and a fraction written together', right: false, why: `That describes a mixed number. ${n}/${d} has no whole number written beside it.` },
        { text: `The bottom number ${d} is ${d % 2 ? 'an odd' : 'an even'} number`, right: false, why: 'Odd or even does not decide the type. Compare the two numbers instead.' },
      ];
      return { question: `Why is ${n}/${d} called an improper fraction?`, options: rot(opts, r),
        hints: ['Compare the top number with the bottom number.', 'What does it mean when the top is bigger?'],
        steps: [`The top number ${n} is bigger than the bottom number ${d}.`, `So ${n}/${d} is more than 1 whole. It is an improper fraction.`] };
    } }),

  fam({ id: 'g4.frac.type-table', skill: 'G4_FRACTIONS', cskill: 'MATH.G4.NUMBER.FRACTIONS.TYPES_OF_FRACTIONS', outcome: 'MATH.G4.NUMBER.FRACTIONS.c', misMapped: false, reveals: [], rung: 2, form: 'table',
    draw: () => {
      const counts = [1, 2, 3].sort(() => Math.random() - 0.5), types = ['proper', 'improper', 'mixed'];
      const list = []; types.forEach((t, i) => { for (let j = 0; j < counts[i]; j++) list.push(t); });
      list.sort(() => Math.random() - 0.5);
      const mk = (t) => { const d = randInt(3, 8); return t === 'proper' ? `${randInt(1, d - 1)}/${d}` : t === 'improper' ? `${randInt(d + 1, 2 * d - 1)}/${d}` : `${randInt(1, 3)} ${randInt(1, d - 1)}/${d}`; };
      const texts = list.map(mk);
      return new Set(texts).size === 6 ? { counts, types, list, texts, ask: randInt(0, 2), p: person() } : null;
    },
    make: ({ counts, types, texts, ask }) => {
      const nm = ['proper fractions', 'improper fractions', 'mixed numbers'][ask];
      return { question: `The table shows litres of water a learner drinks each day. How many of the amounts are ${nm}?`,
        model: { type: 'table', data: { head: ['Day', 'Litres of water'], rows: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => ({ label: day, value: texts[i] })) } },
        answer: counts[ask],
        wrong: [[counts[(ask + 1) % 3], 'That counts a different type. Check the meaning of the type asked for.'], [counts[(ask + 2) % 3], 'That counts a different type. Check the meaning of the type asked for.'], [6, 'That counts every amount in the table. Count only the ones of the type asked for.']],
        hints: ['Look at each amount and decide its type.', 'Proper: top smaller than bottom. Improper: top bigger. Mixed: a whole number and a fraction.'],
        steps: ['Go down the table and name the type of each amount.', `The number of ${nm} is ${counts[ask]}.`] };
    },
    check: ({ texts, ask }, a) => texts.filter(x => (ask === 2 ? x.includes(' ') : ask === 1 ? !x.includes(' ') && Number(x.split('/')[0]) > Number(x.split('/')[1]) : !x.includes(' ') && Number(x.split('/')[0]) < Number(x.split('/')[1]))).length === a }),

  fam({ id: 'g4.frac.improper-to-mixed-pick', skill: 'G4_FRACTIONS', cskill: 'MATH.G4.NUMBER.FRACTIONS.IMPROPER_TO_MIXED', outcome: 'MATH.G4.NUMBER.FRACTIONS.d', misMapped: false, reveals: ['M_MIX_REMAINDER_AS_WHOLE', 'M_MIX_REMAINDER_OVER_QUOTIENT'], rung: 2, form: 'word',
    draw: () => { const d = randInt(3, 8), q = randInt(1, 4), r = randInt(1, d - 1); return q !== r ? { d, q, r, n: q * d + r, p: person(), k: randInt(0, 3) } : null; },
    make: ({ d, q, r, n, p, k }) => {
      const opts = [
        { text: `${q} ${r}/${d}`, right: true },
        { text: `${r} ${q}/${d}`, right: false, why: `The whole number shows how many times ${d} goes into ${n}. The leftover goes on top of the fraction.` },
        { text: `${q} ${r}/${n}`, right: false, why: 'The denominator stays the same as in the improper fraction.' },
        { text: `${q + 1} ${r}/${d}`, right: false, why: `Check how many whole ones you can make from ${n} parts. Do not go over.` },
      ];
      return { question: `${p.name} drinks ${n}/${d} litres of water in one day. Write ${n}/${d} as a mixed number.`, options: rot(opts, k),
        hints: [`How many times does ${d} go into ${n}?`, 'The leftover parts make the fraction.'],
        steps: [`${n} ÷ ${d} = ${q} with ${r} left over.`, `So ${n}/${d} = ${q} ${r}/${d}.`] };
    } }),

  fam({ id: 'g4.frac.improper-to-mixed-steps', skill: 'G4_FRACTIONS', cskill: 'MATH.G4.NUMBER.FRACTIONS.IMPROPER_TO_MIXED', outcome: 'MATH.G4.NUMBER.FRACTIONS.d', misMapped: false, reveals: ['M_MIX_REMAINDER_AS_WHOLE'], rung: 2, form: 'steps',
    draw: () => { const d = randInt(3, 9), q = randInt(2, 4), r = randInt(1, d - 1); return { d, q, r, n: q * d + r, p: person() }; },
    make: ({ d, q, r, n, p }) => ({
      question: `${p.name} pours ${n}/${d} litres of juice. ${p.She} wants to write it as a mixed number. Answer the parts.`,
      parts: [
        { prompt: `How many whole litres are in ${n}/${d}? How many times does ${d} go into ${n}?`, answer: q, unit: 'litres', hint: `Count in ${d}s up to ${n}.`, wrong: [[q + 1, `That goes over ${n}. Check by multiplying.`]] },
        { prompt: `How many parts are left over?`, answer: r, hint: `Take ${q} × ${d} from ${n}.`, wrong: [[d - r, 'That is how many parts are missing from the next whole. Count the ones left over.']] },
        { prompt: `Check the mixed number. ${q} × ${d} + ${r} = ?`, answer: n, hint: 'Whole litres times the denominator, plus the parts left over.', wrong: [[q + r, 'Multiply the whole number by the denominator first.']] },
      ],
      steps: [`${n} ÷ ${d} = ${q} with ${r} left over.`, `So ${n}/${d} = ${q} ${r}/${d}.`, `Check: ${q} × ${d} + ${r} = ${n}.`] }),
    check: ({ d, n }, v) => v[0] * d + v[1] === n && v[1] < d && v[2] === n }),

  fam({ id: 'g4.frac.improper-to-mixed-spot', skill: 'G4_FRACTIONS', cskill: 'MATH.G4.NUMBER.FRACTIONS.IMPROPER_TO_MIXED', outcome: 'MATH.G4.NUMBER.FRACTIONS.d', misMapped: false, reveals: ['M_MIX_REMAINDER_OVER_QUOTIENT'], rung: 2, form: 'spot',
    draw: () => { const d = randInt(4, 9), q = randInt(2, 4), r = randInt(1, d - 1); return { d, q, r, n: q * d + r, kind: pick(['rem', 'write']), p: person(), off: r === 1 ? 1 : pick([1, -1]) }; },
    make: ({ d, q, r, n, kind, p, off }) => {
      const rs = kind === 'rem' ? r + off : r, den = kind === 'write' ? n : d;
      return {
        question: `${p.name} writes ${n}/${d} as a mixed number. Which step has the mistake?`,
        working: [
          { text: `${d} goes into ${n} ${q} times, because ${d} × ${q} = ${d * q}.`, ok: d * q <= n && d * (q + 1) > n },
          { text: `${n} − ${d * q} = ${rs}`, ok: rs === n - d * q },
          { text: kind === 'rem' ? `So ${rs} parts are left over.` : `So the fraction part is ${r}/${den}.`, ok: kind === 'rem' ? true : den === d },
          { text: `So ${n}/${d} = ${q} ${rs}/${den}.`, ok: true },
        ],
        fix: kind === 'rem' ? `${n} − ${d * q} = ${r}, not ${rs}.` : `The denominator stays ${d}. The mixed number is ${q} ${r}/${d}.`,
        hints: ['Check the sum first. Then check how the fraction part is written.', 'The denominator does not change when you write a mixed number.'],
        steps: [`${n} ÷ ${d} = ${q} with ${r} left over.`, `${n}/${d} = ${q} ${r}/${d}.`],
      };
    } }),

  fam({ id: 'g4.frac.mixed-to-improper-pick', skill: 'G4_FRACTIONS', cskill: 'MATH.G4.NUMBER.FRACTIONS.MIXED_TO_IMPROPER', outcome: 'MATH.G4.NUMBER.FRACTIONS.e', misMapped: false, reveals: ['M_IMP_ADDS_WHOLE', 'M_IMP_WHOLE_TIMES_NUMERATOR'], rung: 2, form: 'word',
    draw: () => { const d = randInt(3, 8), w = randInt(2, 4), n = randInt(1, d - 1); return uniq(w * d + n, w + n, w * n + d, w * d) && w + n !== d ? { d, w, n, p: person(), k: randInt(0, 3) } : null; },
    make: ({ d, w, n, p, k }) => {
      const opts = [
        { text: `${w * d + n}/${d}`, right: true },
        { text: `${w + n}/${d}`, right: false, why: 'You added the whole number and the numerator. First find how many parts the whole numbers make.' },
        { text: `${w * n + d}/${d}`, right: false, why: 'The whole number is multiplied by the denominator, not by the numerator.' },
        { text: `${w * d}/${d}`, right: false, why: 'That only counts the whole ones. Add the extra parts too.' },
      ];
      return { question: `${p.name} has ${w} ${n}/${d} cakes. Write ${w} ${n}/${d} as an improper fraction.`, options: rot(opts, k),
        hints: [`How many parts are in ${w} whole cakes, if each cake has ${d} parts?`, 'Then add the extra parts.'],
        steps: [`${w} × ${d} = ${w * d} parts in the whole cakes.`, `${w * d} + ${n} = ${w * d + n} parts, so ${w * d + n}/${d}.`] };
    } }),

  fam({ id: 'g4.frac.mixed-to-improper-steps', skill: 'G4_FRACTIONS', cskill: 'MATH.G4.NUMBER.FRACTIONS.MIXED_TO_IMPROPER', outcome: 'MATH.G4.NUMBER.FRACTIONS.e', misMapped: false, reveals: ['M_IMP_WHOLE_TIMES_NUMERATOR'], rung: 2, form: 'steps',
    draw: () => ({ d: randInt(3, 8), w: randInt(2, 5), n: 0, p: person() }),
    make: ({ d, w, p }) => {
      const n = randInt(1, d - 1);
      return {
        question: `${p.name} has ${w} ${n}/${d} loaves of bread. Each loaf is cut into ${d} equal slices. ${p.She} wants to write ${w} ${n}/${d} as an improper fraction. Answer the parts.`,
        parts: [
          { prompt: 'How many slices are in one whole loaf?', answer: d, unit: 'slices', hint: 'The denominator tells how many equal slices.', wrong: [[n, 'That is the extra slices. Look at the denominator.']] },
          { prompt: `How many slices are in ${w} whole loaves?`, answer: w * d, unit: 'slices', hint: `${w} loaves, each with ${d} slices.`, wrong: [[w + d, 'Equal groups: multiply.']] },
          { prompt: `Add the ${n} extra slices. How many slices are there in all?`, answer: w * d + n, unit: 'slices', hint: 'The slices of the whole loaves, plus the extra slices.', wrong: [[w * d, 'You have not added the extra slices.']] },
        ],
        steps: [`Each loaf has ${d} slices.`, `${w} × ${d} = ${w * d}.`, `${w * d} + ${n} = ${w * d + n}. So the improper fraction has numerator ${w * d + n} and denominator ${d}.`] };
    },
    check: ({ d, w }, v) => v[0] === d && v[1] === w * d && v[2] > v[1] && v[2] < v[1] + d }),

  // ======================================================================
  // DECIMALS: order, place value
  // ======================================================================
  fam({ id: 'g4.dec.largest-ribbon', skill: 'G4_DECIMALS', cskill: 'MATH.G4.NUMBER.DECIMALS.ORDER_DECIMALS', outcome: 'MATH.G4.NUMBER.DECIMALS.d', misMapped: false, reveals: ['M_DEC_LONGER_IS_LARGER'], rung: 2, form: 'table',
    draw: () => {
      const t = randInt(4, 9), hv = [];
      while (hv.length < 3) { const x = randInt(11, t * 10 - 1); if (x % 10 !== 0 && !hv.includes(x)) hv.push(x); }
      return { t, hv };
    },
    make: ({ t, hv }) => {
      const txt = (h) => (h % 10 === 0 ? `0.${h / 10}` : `0.${String(h).padStart(2, '0')}`);
      const all = [t * 10, ...hv].sort(() => Math.random() - 0.5), top = Math.max(...hv);
      return { question: 'The table shows the lengths of four ribbons in metres. Which length is the largest? Write the largest length.',
        model: { type: 'table', data: { head: ['Ribbon', 'Length (m)'], rows: all.map((h, i) => ({ label: 'ABCD'[i], value: txt(h) })) } },
        answer: (t * 10) / 100,
        wrong: hv.map(h => [h / 100, h === top ? 'This one has more digits, but more digits does not mean bigger. Compare the tenths first.' : 'That is smaller than another length. Compare the tenths first.']),
        hints: ['Compare the digit in the tenths place first.', 'If the tenths are the same, compare the hundredths.'],
        steps: ['Look at the tenths digit of each length.', `The largest length has ${t} tenths, which is ${txt(t * 10)} m.`] };
    },
    check: ({ t, hv }, a) => hv.every(h => h / 100 < a) && Math.round(a * 10) === t }),

  fam({ id: 'g4.dec.why-bigger', skill: 'G4_DECIMALS', cskill: 'MATH.G4.NUMBER.DECIMALS.ORDER_DECIMALS', outcome: 'MATH.G4.NUMBER.DECIMALS.d', misMapped: false, reveals: ['M_DEC_DIGITS_AFTER_POINT_AS_WHOLE'], rung: 2, form: 'why',
    draw: () => { const t = randInt(4, 9); let h; do { h = randInt(11, t * 10 - 1); } while (h % 10 === 0); return { t, h, r: randInt(0, 3), p: person() }; },
    make: ({ t, h, r, p }) => {
      const a = `0.${String(h).padStart(2, '0')}`, b = `0.${t}`;
      const opts = [
        { text: `${b} has ${t} tenths, but ${a} has only ${Math.floor(h / 10)} tenths`, right: true },
        { text: `${h} is not bigger than ${t}, so ${a} is the smaller one`, right: false, why: `${h} is bigger than ${t}. But the digits after the point are compared place by place, not as one whole number.` },
        { text: 'A decimal with more digits after the point is always smaller', right: false, why: 'Not always. Compare place by place, starting with the tenths.' },
        { text: 'Decimals cannot be compared with each other at all', right: false, why: 'Decimals can be compared. Start with the tenths.' },
      ];
      return { question: `${p.name} says ${a} is bigger than ${b}, because ${h} is bigger than ${t}. Why is ${p.she} wrong?`, options: rot(opts, r),
        hints: ['Look at the tenths place of each decimal.', `${b} is the same as ${t} tenths and 0 hundredths.`],
        steps: [`${b} = ${t} tenths. ${a} = ${Math.floor(h / 10)} tenths and ${h % 10} hundredths.`, `${t} tenths is more than ${Math.floor(h / 10)} tenths, so ${b} is bigger.`] };
    } }),

  fam({ id: 'g4.dec.place-chart', skill: 'G4_DECIMALS', cskill: 'MATH.G4.NUMBER.DECIMALS.DECIMAL_PLACE_VALUE', outcome: 'MATH.G4.NUMBER.DECIMALS.c', misMapped: false, reveals: ['M_DEC_VALUE_OF_DIGIT'], rung: 1, form: 'table',
    draw: () => {
      const ds = []; while (ds.length < 3) { const x = randInt(1, 9); if (!ds.includes(x)) ds.push(x); }
      const col = pick([1, 2]), dg = ds[col];
      return { ds, col, dg };
    },
    make: ({ ds, col, dg }) => {
      const val = col === 1 ? dg / 10 : dg / 100, whole = ds[0] + ds[1] / 10 + ds[2] / 100;
      const wrong = col === 1 ? [[dg, 'That is the digit itself. Its value depends on its place.'], [dg / 100, 'That is the value if the digit were in the hundredths place.'], [ds[2] / 100, 'That is a different column. Look at the heading again.']] : [[dg, 'That is the digit itself. Its value depends on its place.'], [dg / 10, 'That is the value if the digit were in the tenths place.'], [ds[1] / 10, 'That is a different column. Look at the heading again.']];
      return { question: `Look at the place value chart. What is the value of the digit in the ${col === 1 ? 'Tenths' : 'Hundredths'} column? Write it as a decimal.`,
        model: { type: 'table', data: { head: ['Ones', 'Tenths', 'Hundredths'], rows: [{ cells: ds.map(String) }] } },
        answer: round(val, 3), wrong: wrong.map(([v, f]) => [round(v, 3), f]),
        hints: ['Find the column with that heading.', 'Tenths means out of 10. Hundredths means out of 100.'],
        steps: [`The digit in that column is ${dg}.`, `${dg} ${col === 1 ? 'tenths' : 'hundredths'} is ${round(val, 3)}.`] };
    },
    check: ({ col, dg }, a) => Math.round(a * (col === 1 ? 10 : 100)) === dg }),

  // ======================================================================
  // LETTERS: simplify, expressions, what a letter stands for
  // ======================================================================
  fam({ id: 'g4.letters.spot-simplify', skill: 'G4_LETTERS', cskill: 'MATH.G4.NUMBER.USE_OF_LETTERS.SIMPLIFY_EXPRESSIONS', outcome: 'MATH.G4.NUMBER.USE_OF_LETTERS.c', misMapped: false, reveals: ['M_SIM_SUBTRACT_WRONG'], rung: 2, form: 'spot',
    draw: () => { const a = randInt(3, 8), b = randInt(2, 7), c = randInt(2, 5); return a + b - c >= 3 ? { a, b, c, v: pick(['x', 'y', 'n', 'k']), kind: pick(['add', 'sub', 'drop']), p: person() } : null; },
    make: ({ a, b, c, v, kind, p }) => {
      const s1 = kind === 'add' ? a + b + 1 : a + b, s2 = kind === 'sub' ? s1 - c + 1 : s1 - c;
      return {
        question: `${p.name} simplifies ${a}${v} + ${b}${v} − ${c}${v}. Which step has the mistake?`,
        working: [
          { text: `All the parts are lots of ${v}, so work with the numbers in front.`, ok: true },
          { text: `${a}${v} + ${b}${v} = ${s1}${v}`, ok: s1 === a + b },
          { text: `${s1}${v} − ${c}${v} = ${s2}${v}`, ok: s2 === s1 - c },
          { text: kind === 'drop' ? `So the answer is ${s2}.` : `So the answer is ${s2}${v}.`, ok: kind !== 'drop' },
        ],
        fix: kind === 'add' ? `${a} + ${b} = ${a + b}, so ${a}${v} + ${b}${v} = ${a + b}${v}.` : kind === 'sub' ? `${s1} − ${c} = ${s1 - c}, so the answer is ${s1 - c}${v}.` : `The letter must stay in the answer. It is ${s2}${v}.`,
        hints: ['Check each line one at a time.', `The letter ${v} stays in the answer.`],
        steps: [`${a}${v} + ${b}${v} = ${a + b}${v}.`, `${a + b}${v} − ${c}${v} = ${a + b - c}${v}.`],
      };
    } }),

  fam({ id: 'g4.letters.why-same-thing', skill: 'G4_LETTERS', cskill: 'MATH.G4.NUMBER.USE_OF_LETTERS.SIMPLIFY_EXPRESSIONS', outcome: 'MATH.G4.NUMBER.USE_OF_LETTERS.c', misMapped: false, reveals: ['M_SIM_ADD_UNLIKE'], rung: 2, form: 'why',
    draw: () => { const [v, w] = [...['x', 'y', 'n', 'p', 'k']].sort(() => Math.random() - 0.5); return { a: randInt(2, 8), b: randInt(2, 8), v, w, r: randInt(0, 3) }; },
    make: ({ a, b, v, w, r }) => {
      const opts = [
        { text: `${a}${v} and ${b}${v} are lots of the same thing, but ${b}${w} is not`, right: true },
        { text: `${w} is a smaller letter than ${v}, so it cannot be added`, right: false, why: 'The size of a letter does not matter. What matters is whether the letters are the same.' },
        { text: 'Letters can never be added to anything at all', right: false, why: `Letters can be added when they stand for the same thing. ${a}${v} + ${b}${v} = ${a + b}${v}.` },
        { text: `${a} and ${b} in front must be the same number to add`, right: false, why: `The numbers in front can be different. ${a}${v} + ${b}${v} = ${a + b}${v}.` },
      ];
      return { question: `We can simplify ${a}${v} + ${b}${v}. We cannot simplify ${a}${v} + ${b}${w}. Why?`, options: rot(opts, r),
        hints: [`Think of ${v} as pens and ${w} as books.`, 'Can you add 3 pens and 2 books to make one kind of thing?'],
        steps: [`${a}${v} + ${b}${v} = ${a + b}${v}, because both are lots of ${v}.`, `${a}${v} and ${b}${w} are lots of different things, so they stay as they are.`] };
    } }),

  fam({ id: 'g4.letters.form-boxes', skill: 'G4_LETTERS', cskill: 'MATH.G4.NUMBER.USE_OF_LETTERS.FORM_EXPRESSIONS', outcome: 'MATH.G4.NUMBER.USE_OF_LETTERS.b', misMapped: false, reveals: ['M_EXP_WRONG_OPERATION'], rung: 2, form: 'table',
    draw: () => ({ k: randInt(4, 12), v: pick(['n', 'b', 't']), r: randInt(0, 3), what: pick([['box', 'boxes', 'pens'], ['packet', 'packets', 'biscuits'], ['bag', 'bags', 'oranges']]) }),
    make: ({ k, v, r, what }) => {
      const opts = [
        { text: `${k}${v}`, right: true },
        { text: `${v} + ${k}`, right: false, why: `Test 2 ${what[1]}: ${v} + ${k} gives ${2 + k}, but the table shows a different number.` },
        { text: `${k - 1}${v}`, right: false, why: `Test 2 ${what[1]}: ${k - 1} × 2 gives ${2 * (k - 1)}, but the table shows a different number.` },
        { text: `${v} ÷ ${k}`, right: false, why: `Test 2 ${what[1]}: 2 ÷ ${k} is not a whole number, but the table shows many ${what[2]}.` },
      ];
      return { question: `Every ${what[0]} has the same number of ${what[2]}. The table shows some ${what[1]}. Which expression shows the number of ${what[2]} in ${v} ${what[1]}?`,
        model: { type: 'table', data: { head: [cap(what[1]), cap(what[2])], rows: [1, 2, 3].map(i => ({ label: String(i), value: String(i * k) })) } },
        options: rot(opts, r),
        hints: ['Look at 1 in the first row. How many are in one?', 'Each row is that number multiplied by the number in the first column.'],
        steps: [`One ${what[0]} has ${k}. The table goes up by ${k} each time.`, `${v} ${what[1]} have ${v} × ${k}, written ${k}${v}.`] };
    } }),

  fam({ id: 'g4.letters.price-p', skill: 'G4_LETTERS', cskill: 'MATH.G4.NUMBER.USE_OF_LETTERS.LETTERS_REPRESENT', outcome: 'MATH.G4.NUMBER.USE_OF_LETTERS.a', misMapped: false, reveals: ['M_LET_LETTER_IS_OBJECT'], rung: 2, form: 'word',
    draw: () => { const k = randInt(3, 8), pp = price('pencil'), rub = price('rubber'); return uniq(k * pp + rub, Number(`${k}${pp}`) + rub, k + pp + rub, pp + rub) ? { k, pp, rub, p: person() } : null; },
    make: ({ k, pp, rub, p }) => ({
      question: `${p.name} buys ${k} pencils and 1 rubber. The cost is ${k}p + ${rub} shillings. The letter p stands for the price of one pencil. A pencil costs ${sh(pp)}. How much does ${p.name} pay in all?`,
      answer: k * pp + rub,
      wrong: [[Number(`${k}${pp}`) + rub, `${k}p means ${k} times p. It does not mean ${k} and the price written side by side.`], [k + pp + rub, `${k}p means ${k} lots of p, so multiply. Do not add.`], [pp + rub, `There are ${k} pencils. Use ${k}p, not p.`]],
      hints: ['Put the price of a pencil in the place of the letter p.', `${k}p means ${k} times the price of a pencil.`],
      steps: [`${k}p = ${k} × ${pp} = ${k * pp}.`, `${k * pp} + ${rub} = ${k * pp + rub} shillings.`] }),
    check: ({ k, pp, rub }, a) => (a - rub) / pp === k }),

  // ======================================================================
  // LENGTH, AREA, VOLUME
  // ======================================================================
  fam({ id: 'g4.length.compare-cloth', skill: 'G4_LENGTH', cskill: 'MATH.G4.MEASUR.LENGTH.CONVERT_M_CM', outcome: 'MATH.G4.MEASUR.LENGTH.d', misMapped: false, reveals: ['M_CONV_WRONG_FACTOR'], rung: 2, form: 'table',
    draw: () => {
      const L = Array.from({ length: 3 }, () => randInt(12, 48) * 10 + randInt(1, 9)).filter(x => x % 100 !== 0);
      if (L.length < 3 || !uniq(...L)) return null;
      const fmt = [0, 1, 1].sort(() => Math.random() - 0.5);
      return { L, fmt, k: randInt(0, 2) };
    },
    make: ({ L, fmt, k }) => {
      const txt = (x, f) => (f ? `${Math.floor(x / 100)} m ${x % 100} cm` : `${x} cm`), best = L.indexOf(Math.max(...L));
      const opts = L.map((x, i) => ({ text: `Piece ${'ABC'[i]}`, right: i === best, why: i === best ? undefined : `Piece ${'ABC'[i]} is ${x} cm. Change every length to centimetres, then compare.` }));
      return { question: 'The table shows the lengths of three pieces of cloth. Which piece is the longest?',
        model: { type: 'table', data: { head: ['Piece', 'Length'], rows: L.map((x, i) => ({ label: `Piece ${'ABC'[i]}`, value: txt(x, fmt[i]) })) } }, options: rot(opts, k),
        hints: ['Lengths in different units cannot be compared yet.', '1 m = 100 cm. Change the metres to centimetres.'],
        steps: L.map((x, i) => `Piece ${'ABC'[i]} is ${x} cm.`).concat([`The longest is Piece ${'ABC'[best]}.`]) };
    } }),

  fam({ id: 'g4.perimeter.fence-posts', skill: 'G5_PERIMETER_INTRO', cskill: 'MATH.G4.MEASUR.LENGTH.PERIMETER', outcome: 'MATH.G4.MEASUR.LENGTH.e', misMapped: false, reveals: [], rung: 3, form: 'word',
    draw: () => { const g = pick([2, 4, 5]), l = randInt(10, 30), w = randInt(6, 20); return (l + w) % g === 0 ? { g, l, w, p: person() } : null; },
    make: ({ g, l, w, p }) => ({
      question: `A school garden is ${l} m long and ${w} m wide. ${p.name} puts a fence all the way round it. The fence posts are ${g} m apart. How many posts does ${p.she} need?`,
      answer: (2 * (l + w)) / g,
      wrong: [[2 * (l + w), 'That is the length of the fence in metres. The question asks for the number of posts.'], [(2 * (l + w)) / g + 1, 'A fence that goes all the way round has no end, so there is no extra post.'], [(l + w) / g, 'That is for two sides only. The fence goes round all four sides.']],
      hints: ['First find the distance all the way round the garden.', 'Then find how many gaps of the same size fit in it.'],
      steps: [`Distance round: ${l} + ${w} + ${l} + ${w} = ${2 * (l + w)} m.`, `${2 * (l + w)} ÷ ${g} = ${(2 * (l + w)) / g} posts.`] }),
    check: ({ g, l, w }, a) => a * g === 2 * l + 2 * w }),

  fam({ id: 'g4.area.rows-missing', skill: 'G4_AREA', cskill: 'MATH.G4.MEASUR.AREA.AREA_ROWS_COLS', outcome: 'MATH.G4.MEASUR.AREA.c', misMapped: false, reveals: ['M_AREA_MISSING_ROW_ADDS'], rung: 2, form: 'word',
    draw: () => { const r = randInt(4, 9), c = randInt(5, 12); return uniq(c, r * c, r + c, r * c - r) ? { r, c, p: person() } : null; },
    make: ({ r, c, p }) => ({
      question: `${p.name} covers a floor with ${r * c} square tiles. The area of the floor is ${r * c} tiles. The tiles are in ${r} equal rows. How many tiles are in each row?`,
      answer: c,
      wrong: [[r * c - r, 'Taking away does not share the tiles equally into rows.'], [r * c * r, 'The tiles are shared into rows, so the number in each row is smaller than the total.'], [r, 'That is the number of rows. The question asks how many tiles are in each row.']],
      hints: ['Area is rows times tiles in each row.', 'Share all the tiles equally into the rows.'],
      steps: [`rows × tiles in each row = ${r * c}.`, `${r * c} ÷ ${r} = ${c} tiles in each row.`] }),
    check: ({ r }, a) => a * r === r * a && a >= 5 && (a * r) % r === 0 }),

  fam({ id: 'g4.area.rooms-table', skill: 'G4_AREA', cskill: 'MATH.G4.MEASUR.AREA.AREA_COUNT', outcome: 'MATH.G4.MEASUR.AREA.b', misMapped: false, reveals: [], rung: 2, form: 'table',
    draw: () => {
      const rows = Array.from({ length: 3 }, () => randInt(3, 9)), cols = Array.from({ length: 3 }, () => randInt(4, 12)), a = rows.map((r, i) => r * cols[i]);
      const best = a.indexOf(Math.max(...a));
      return uniq(...a) && rows[best] !== Math.max(...rows) ? { rows, cols, a, best, k: randInt(0, 2) } : null;
    },
    make: ({ rows, cols, a, best, k }) => {
      const opts = rows.map((r, i) => ({ text: `Room ${'ABC'[i]}`, right: i === best, why: i === best ? undefined : `Room ${'ABC'[i]} has ${a[i]} tiles. Find the number of tiles in each room, then compare.` }));
      return { question: 'Each tile is one unit square. The table shows the tiles on the floors of three rooms. Which room has the greatest area?',
        model: { type: 'table', data: { head: ['Room', 'Rows of tiles', 'Tiles in each row'], rows: rows.map((r, i) => ({ cells: [`Room ${'ABC'[i]}`, String(r), String(cols[i])] })) } }, options: rot(opts, k),
        hints: ['Area is the number of unit squares that cover the floor.', 'Multiply the rows by the tiles in each row for each room.'],
        steps: rows.map((r, i) => `Room ${'ABC'[i]}: ${r} × ${cols[i]} = ${a[i]}.`).concat([`The greatest area is Room ${'ABC'[best]}.`]) };
    } }),

  fam({ id: 'g4.area.why-multiply', skill: 'G4_AREA', cskill: 'MATH.G4.MEASUR.AREA.AREA_ROWS_COLS', outcome: 'MATH.G4.MEASUR.AREA.c', misMapped: false, reveals: ['M_AREA_ADDS_ROWS_COLS'], rung: 2, form: 'why',
    draw: () => ({ r: randInt(3, 8), c: randInt(4, 9), k: randInt(0, 3) }),
    make: ({ r, c, k }) => {
      const opts = [
        { text: `There are ${r} equal rows with ${c} squares in each row`, right: true },
        { text: 'Area is the distance around the outside of the rectangle', right: false, why: 'The distance around is the perimeter. Area is how many unit squares cover the rectangle.' },
        { text: `${r} + ${c} counts all the squares inside the rectangle`, right: false, why: 'Adding counts the squares along two sides only, not the squares inside.' },
        { text: 'We must double the longest side of the rectangle', right: false, why: 'Doubling a side does not count the squares inside the rectangle.' },
      ];
      return { question: `A rectangle is covered by ${r} rows of ${c} unit squares. Why can we find its area by working out ${r} × ${c}?`, options: rot(opts, k),
        hints: ['Picture one row of unit squares.', 'Equal rows are equal groups.'],
        steps: [`One row has ${c} squares. There are ${r} rows.`, `${r} groups of ${c} is ${r} × ${c} = ${r * c} squares.`] };
    } }),

  fam({ id: 'g4.vol.tower-layers', skill: 'G4_VOLUME', cskill: 'MATH.G4.MEASUR.VOLUME.STACK_CUBES', outcome: 'MATH.G4.MEASUR.VOLUME.a', misMapped: false, reveals: ['M_VOL_ONE_LAYER_ONLY'], rung: 2, form: 'word',
    draw: () => { const a = randInt(2, 5), b = randInt(2, 6), c = randInt(2, 6); return uniq(a * b * c, a + b + c, a * b, a * b + c) ? { a, b, c, p: person() } : null; },
    make: ({ a, b, c, p }) => ({
      question: `${p.name} builds a tower from cubes. Each layer has ${a} rows of ${b} cubes. There are ${c} layers. How many cubes are in the tower?`,
      answer: a * b * c,
      wrong: [[a * b, 'That is the cubes in one layer. There are more layers.'], [a + b + c, 'Layers are equal groups. Multiply, do not add.'], [a * b + c, 'Each layer has the same number of cubes. Multiply the cubes in a layer by the number of layers.']],
      hints: ['First find how many cubes are in one layer.', 'Then count all the layers.'],
      steps: [`One layer: ${a} × ${b} = ${a * b} cubes.`, `${c} layers: ${a * b} × ${c} = ${a * b * c} cubes.`] }),
    check: ({ a, b, c }, v) => v % c === 0 && v / c === a * b }),

  fam({ id: 'g4.vol.boxes-table', skill: 'G4_VOLUME', cskill: 'MATH.G4.MEASUR.VOLUME.VOLUME_CUBOID', outcome: 'MATH.G4.MEASUR.VOLUME.b', misMapped: false, reveals: ['M_VOL_ADDS_DIMENSIONS'], rung: 2, form: 'table',
    draw: () => {
      const L = [0, 1, 2].map(() => [randInt(2, 6), randInt(2, 6), randInt(2, 6)]), v = L.map(([a, b, c]) => a * b * c), best = v.indexOf(Math.max(...v)), sums = L.map(x => x[0] + x[1] + x[2]);
      return uniq(...v) && sums.some((x, i) => i !== best && x >= sums[best]) ? { L, v, best, k: randInt(0, 2) } : null;
    },
    make: ({ L, v, best, k }) => {
      const opts = L.map((_, i) => ({ text: `Box ${'ABC'[i]}`, right: i === best, why: i === best ? undefined : `Box ${'ABC'[i]} holds ${v[i]} cubes. Work out how many cubes each box holds, then compare.` }));
      return { question: 'Three boxes are filled with cubes. The table shows the cubes along each side. Which box has the greatest volume?',
        model: { type: 'table', data: { head: ['Box', 'Cubes long', 'Cubes wide', 'Cubes high'], rows: L.map((x, i) => ({ cells: [`Box ${'ABC'[i]}`, ...x.map(String)] })) } }, options: rot(opts, k),
        hints: ['Volume is the number of cubes that fill the box.', 'Multiply long, wide and high for each box.'],
        steps: L.map((x, i) => `Box ${'ABC'[i]}: ${x[0]} × ${x[1]} × ${x[2]} = ${v[i]}.`).concat([`The greatest volume is Box ${'ABC'[best]}.`]) };
    } }),

  // ======================================================================
  // MONEY: cents, shopping lists
  // ======================================================================
  fam({ id: 'g4.money.cents-purse', skill: 'G4_MONEY', cskill: 'MATH.G4.MEASUR.MONEY.SHILLINGS_CENTS', outcome: 'MATH.G4.MEASUR.MONEY.a', misMapped: false, reveals: ['M_MONEY_CENTS_AS_DECIMAL_WHOLE'], rung: 1, form: 'word',
    draw: () => { const a = randInt(2, 9), b = pick([20, 25, 50, 75]); return { a, b, p: person() }; },
    make: ({ a, b, p }) => ({
      question: `${p.name} has ${sh(a)} and ${b} cents in a purse. How many cents is that in all?`,
      answer: 100 * a + b,
      wrong: [[a + b, 'There are 100 cents in 1 shilling. Change the shillings to cents first.'], [10 * a + b, 'Check how many cents make 1 shilling.'], [100 * a, 'That changes the shillings but leaves out the cents in the purse.']],
      hints: ['1 shilling is 100 cents.', 'Change the shillings to cents. Then add the cents.'],
      steps: [`${a} shillings = ${a} × 100 = ${100 * a} cents.`, `${100 * a} + ${b} = ${100 * a + b} cents.`] }),
    check: ({ a, b }, v) => v % 100 === b && Math.floor(v / 100) === a }),

  fam({ id: 'g4.money.cents-to-shillings', skill: 'G4_MONEY', cskill: 'MATH.G4.MEASUR.MONEY.SHILLINGS_CENTS', outcome: 'MATH.G4.MEASUR.MONEY.a', misMapped: false, reveals: ['M_MONEY_DIRECTION'], rung: 2, form: 'steps',
    draw: () => { const w = randInt(3, 9), r = pick([25, 50, 75]), s = randInt(1, w - 1); return { w, r, s, c: 100 * w + r, p: person() }; },
    make: ({ w, r, s, c, p }) => ({
      question: `${p.name} has ${commas(c)} cents. ${p.She} wants to change it to shillings. Answer the parts.`,
      parts: [
        { prompt: `How many whole shillings are in ${c} cents?`, answer: w, unit: 'shillings', hint: '100 cents make 1 shilling.', wrong: [[Math.floor(c / 10), 'Divide by 100, not by 10.']] },
        { prompt: 'How many cents are left over?', answer: r, unit: 'cents', hint: `Take ${w} × 100 from ${c}.`, wrong: [[100 - r, 'That is the amount needed to make the next shilling. Count the cents left over.']] },
        { prompt: `${p.name} buys a sweet for ${sh(s)}. How many cents are left?`, answer: c - 100 * s, unit: 'cents', hint: `Change ${sh(s)} to cents, then take it away.`, wrong: [[c - s, `${sh(s)} is ${s * 100} cents, not ${s} cents.`]] },
      ],
      steps: [`${c} ÷ 100 = ${w} with ${r} left over.`, `So ${c} cents = ${sh(w)} and ${r} cents.`, `${c} − ${100 * s} = ${c - 100 * s} cents.`] }),
    check: ({ c, s }, v) => v[0] * 100 + v[1] === c && v[2] === c - s * 100 }),

  fam({ id: 'g4.money.list-table-total', skill: 'G4_MONEY', cskill: 'MATH.G4.MEASUR.MONEY.TOTAL_COST', outcome: 'MATH.G4.MEASUR.MONEY.c', misMapped: false, reveals: ['M_COST_ONE_ITEM_ONLY'], rung: 2, form: 'table',
    draw: () => {
      const ITEMS = [['kg of rice', 'Rice (1 kg)'], ['kg of sugar', 'Sugar (1 kg)'], ['loaf of bread', 'Bread (1 loaf)'], ['litre of milk', 'Milk (1 litre)'], ['exercise book', 'Exercise book'], ['pencil', 'Pencil'], ['egg', 'Egg'], ['kg of beans', 'Beans (1 kg)']];
      const its = [...ITEMS].sort(() => Math.random() - 0.5).slice(0, 3), q = its.map(() => randInt(2, 6)), pr = its.map(([k]) => price(k)), cost = q.map((n, i) => n * pr[i]), total = sum(cost);
      return uniq(total, sum(pr), total - cost[2], sum(q.map((n, i) => n + pr[i]))) ? { its, q, pr, cost, total } : null;
    },
    make: ({ its, q, pr, cost, total }) => ({
      question: 'The table shows a shopping list. What is the total cost, in shillings?',
      model: { type: 'table', data: { head: ['Item', 'Number bought', 'Price each (sh)'], rows: its.map(([, l], i) => ({ cells: [l, String(q[i]), String(pr[i])] })) } },
      answer: total,
      wrong: [[sum(pr), 'That adds the prices of one of each item. Count how many of each are bought.'], [total - cost[2], 'That leaves out the last item. Include every row.'], [sum(q.map((n, i) => n + pr[i])), 'The number bought and the price are not added. Multiply them for each item.']],
      hints: ['For each row, multiply the number bought by the price each.', 'Then add the three costs.'],
      steps: its.map(([, l], i) => `${l}: ${q[i]} × ${pr[i]} = ${cost[i]}.`).concat([`Total: ${cost.join(' + ')} = ${commas(total)}.`]) }),
    check: ({ q, pr, total }, a) => q.reduce((t, n, i) => t + pr[i] * n, 0) === a && a === total }),

  fam({ id: 'g4.money.list-three-items', skill: 'G4_MONEY', cskill: 'MATH.G4.MEASUR.MONEY.SHOPPING_LIST', outcome: 'MATH.G4.MEASUR.MONEY.b', misMapped: false, reveals: ['M_LIST_OVER_BUDGET'], rung: 3, form: 'table',
    draw: () => {
      const ITEMS = [['kg of rice', 'Rice', 'Rice (1 kg)'], ['kg of sugar', 'Sugar', 'Sugar (1 kg)'], ['loaf of bread', 'Bread', 'Bread (1 loaf)'], ['litre of milk', 'Milk', 'Milk (1 litre)'], ['kg of beans', 'Beans', 'Beans (1 kg)'], ['kg of maize flour', 'Maize flour', 'Maize flour (1 kg)']];
      const its = [...ITEMS].sort(() => Math.random() - 0.5).slice(0, 4), pr = its.map(([k]) => price(k)), skip = randInt(0, 3), tot = sum(pr);
      return uniq(...pr) ? { its, pr, skip, tot, k: randInt(0, 3), p: person() } : null;
    },
    make: ({ its, pr, skip, tot, k, p }) => {
      const budget = tot - pr[skip];
      const opts = its.map((_, i) => ({ text: its.filter((__, j) => j !== i).map(x => x[1]).join(', '), right: i === skip, why: i === skip ? undefined : `That list costs ${sh(tot - pr[i])}. Add the three prices.` }));
      return { question: `${p.name} wants three items from the price list. ${p.She} must spend exactly ${sh(budget)}. Which shopping list does ${p.she} buy?`,
        model: { type: 'table', data: { head: ['Item', 'Price (sh)'], rows: its.map(([, , l], i) => ({ label: l, value: String(pr[i]) })) } }, options: rot(opts, k),
        hints: ['Add the prices of three items. Try one list at a time.', 'Check if the total is the amount to spend.'],
        steps: [`Try each list and add its three prices.`, `The list with a total of ${sh(budget)} is ${its.filter((_, j) => j !== skip).map(x => x[1]).join(', ')}.`] };
    } }),

  // ======================================================================
  // ANGLES AND SYMMETRY
  // ======================================================================
  fam({ id: 'g4.angles.turn-kind', skill: 'G4_ANGLES', cskill: 'MATH.G4.GEOMET.ANGLES.TURN_TO_ANGLE', outcome: 'MATH.G4.GEOMET.ANGLES.c', misMapped: false, reveals: ['M_TURN_QUARTER_AS_STRAIGHT'], rung: 2, form: 'word',
    draw: () => ({ obj: pick(['door', 'window', 'gate', 'box lid', 'book cover']), kind: pick(['acute', 'right', 'obtuse']), k: randInt(0, 2) }),
    make: ({ obj, kind, k }) => {
      const how = { acute: 'a little, less than a quarter turn', right: 'a quarter turn', obtuse: 'more than a quarter turn, but less than a half turn' }[kind];
      const feed = { acute: 'An acute angle is smaller than a quarter turn.', right: 'A right angle is exactly a quarter turn, like the corner of a page.', obtuse: 'An obtuse angle is bigger than a quarter turn but smaller than a half turn.' };
      const opts = ['acute', 'right', 'obtuse'].map(t => ({ text: `${cap(t)} angle`, right: t === kind, why: t === kind ? undefined : feed[t] }));
      return { question: `A ${obj} opens ${how}. What kind of angle does it make?`, options: rot(opts, k),
        hints: ['A right angle is a quarter turn.', 'Is the turn smaller or bigger than a quarter turn?'],
        steps: [`The turn is ${how}.`, `So it makes ${kind === 'acute' ? 'an acute' : kind === 'right' ? 'a right' : 'an obtuse'} angle.`] };
    } }),

  fam({ id: 'g4.angles.clock-hands', skill: 'G4_ANGLES', cskill: 'MATH.G4.GEOMET.ANGLES.TURN_TO_ANGLE', outcome: 'MATH.G4.GEOMET.ANGLES.c', misMapped: false, reveals: ['M_TURN_HOUR_HAND_RIGHT_ANGLE'], rung: 2, form: 'word',
    draw: () => ({ h: pick([1, 2, 3, 4, 8, 9, 10, 11]), k: randInt(0, 2) }),
    make: ({ h, k }) => {
      const deg = Math.min(h * 30, 360 - h * 30), kind = deg < 90 ? 'acute' : deg === 90 ? 'right' : 'obtuse';
      const feed = { acute: 'An acute angle is smaller than a quarter turn.', right: 'A right angle is exactly a quarter turn.', obtuse: 'An obtuse angle is bigger than a quarter turn but smaller than a half turn.' };
      const opts = ['acute', 'right', 'obtuse'].map(t => ({ text: `${cap(t)} angle`, right: t === kind, why: t === kind ? undefined : feed[t] }));
      return { question: `At ${h} o'clock, the hour hand points to ${h} and the minute hand points to 12. What kind of angle do the two hands make?`, options: rot(opts, k),
        hints: ['A full turn of the clock face has 12 numbers. A quarter turn is 3 numbers.', `How many numbers are between ${h} and 12? Compare with 3.`],
        steps: [`The hands are ${Math.min(h, 12 - h)} numbers apart.`, `A quarter turn is 3 numbers, so it is ${kind === 'acute' ? 'smaller than a quarter turn: an acute angle' : kind === 'right' ? 'a quarter turn: a right angle' : 'bigger than a quarter turn: an obtuse angle'}.`] };
    } }),

  fam({ id: 'g4.symmetry.count-lines', skill: 'G4_PLANE_FIGURES', cskill: 'MATH.G4.GEOMET.PLANE_FIGURES.LINES_SYMMETRY', outcome: 'MATH.G4.GEOMET.PLANE_FIGURES.c', misMapped: false, reveals: ['M_SYM_DIAGONAL_RECTANGLE'], rung: 1, form: 'direct',
    draw: () => ({ sh: pick([['a square', 4, 4], ['a rectangle that is not a square', 2, 4], ['an equilateral triangle', 3, 3], ['a regular hexagon', 6, 6], ['a regular pentagon', 5, 5]]), k: randInt(0, 3), p: person() }),
    make: ({ sh: [name, lines, sides], k, p }) => {
      const ws = [...new Set([sides, 1, 2, 3, 4, 6, 0])].filter(x => x !== lines).slice(0, 3);
      const opts = [{ text: String(lines), right: true }, ...ws.map(x => ({ text: String(x), right: false, why: x === sides ? 'That is the number of sides. A line of symmetry is a fold line, not a side.' : 'Fold the shape in your mind. Count the fold lines where the two halves match exactly.' }))];
      return { question: `${p.name} cuts a paper shape. The shape is ${name}. How many lines of symmetry does the shape have?`, story: false, options: rot(opts, k),
        hints: ['A line of symmetry is a fold line. The two halves match exactly.', 'Try folding the shape in different ways, and count the ones that work.'],
        steps: ['Find every fold line where the two halves match.', `${cap(name)} has ${lines} lines of symmetry.`] };
    } }),

  fam({ id: 'g4.symmetry.letters', skill: 'G4_PLANE_FIGURES', cskill: 'MATH.G4.GEOMET.PLANE_FIGURES.LINES_SYMMETRY', outcome: 'MATH.G4.GEOMET.PLANE_FIGURES.c', misMapped: false, reveals: [], rung: 1, form: 'direct',
    draw: () => {
      const G = { none: ['F', 'G', 'J', 'L', 'P', 'R'], one: ['A', 'B', 'C', 'D', 'E', 'K', 'M', 'T', 'U', 'V', 'W', 'Y'], two: ['H', 'I', 'O', 'X'] };
      const T = pick(['none', 'one', 'two']), others = ['none', 'one', 'two'].filter(t => t !== T);
      const right = pick(G[T]), ws = [];
      while (ws.length < 3) { const x = pick(G[pick(others)]); if (!ws.includes(x)) ws.push(x); }
      const kinds = ws.map(x => Object.keys(G).find(t => G[t].includes(x)));
      return { T, right, ws, kinds, k: randInt(0, 3), p: person() };
    },
    make: ({ T, right, ws, kinds, k, p }) => {
      const say = { none: 'no line of symmetry', one: 'exactly one line of symmetry', two: 'exactly two lines of symmetry' };
      const cnt = { none: 'no lines', one: 'one line', two: 'two lines' };
      const opts = [{ text: right, right: true }, ...ws.map((x, i) => ({ text: x, right: false, why: `The capital letter ${x} has ${cnt[kinds[i]]} of symmetry. Fold it up and down, then left and right, and count again.` }))];
      return { question: `${p.name} looks at capital letters in plain print. Which capital letter has ${say[T]}?`, story: false, options: rot(opts, k),
        hints: ['Picture each letter in plain print. Fold it up and down, then left and right.', 'A line of symmetry gives two halves that match exactly.'],
        steps: [`Try folding each letter.`, `The capital letter ${right} has ${say[T]}.`] };
    } }),

  fam({ id: 'g4.add.spot-estimate', skill: 'G4_ADD', cskill: 'MATH.G4.NUMBER.ADDITION.ESTIMATE_SUM_TEN', outcome: 'MATH.G4.NUMBER.ADDITION.c', misMapped: false, reveals: ['M_EST_ROUND_WRONG'], rung: 2, form: 'spot',
    draw: () => {
      const kind = pick(['a', 'b', 'sum']), pk = (hi) => { let v; do { v = randInt(12, 99) * 10 + (hi ? randInt(6, 9) : pick([1, 2, 3, 4, 6, 7, 8, 9])); } while (v % 10 === 5); return v; };
      return { a: pk(kind === 'a'), b: pk(kind === 'b'), kind, slip: pick([-10, 10, -100]), p: person() };
    },
    make: ({ a, b, kind, slip, p }) => {
      const x = kind === 'a' ? f10(a) : r10(a), y = kind === 'b' ? f10(b) : r10(b), s = kind === 'sum' ? x + y + slip : x + y;
      return {
        question: `${p.name} estimates ${a} + ${b} by rounding each number to the nearest ten. Which step has the mistake?`,
        working: [
          { text: `${a} is about ${x}.`, ok: x === r10(a) },
          { text: `${b} is about ${y}.`, ok: y === r10(b) },
          { text: `${x} + ${y} = ${s}`, ok: s === x + y },
          { text: `So the estimate is ${s}.`, ok: true },
        ],
        fix: kind === 'a' ? `${a} rounds to ${r10(a)}, because its ones digit is 5 or more.` : kind === 'b' ? `${b} rounds to ${r10(b)}, because its ones digit is 5 or more.` : `${x} + ${y} = ${x + y}.`,
        hints: ['Check the rounding of each number first.', 'Then check the addition of the rounded numbers.'],
        steps: [`${a} is about ${r10(a)}, and ${b} is about ${r10(b)}.`, `${r10(a)} + ${r10(b)} = ${r10(a) + r10(b)}.`],
      };
    } }),

  fam({ id: 'g4.money.spot-cents', skill: 'G4_MONEY', cskill: 'MATH.G4.MEASUR.MONEY.SHILLINGS_CENTS', outcome: 'MATH.G4.MEASUR.MONEY.a', misMapped: false, reveals: ['M_MONEY_10_CENTS_SHILLING'], rung: 2, form: 'spot',
    draw: () => ({ a: randInt(2, 9), b: pick([20, 25, 50, 75]), kind: pick(['rule', 'add']), p: person() }),
    make: ({ a, b, kind, p }) => {
      const per = kind === 'rule' ? 10 : 100, x = a * per, t = kind === 'add' ? x + b + 10 : x + b;
      return {
        question: `${p.name} has ${sh(a)} and ${b} cents. ${p.She} changes it all to cents. Which step has the mistake?`,
        working: [
          { text: `1 shilling is ${per} cents.`, ok: per === 100 },
          { text: `${a} shillings = ${a} × ${per} = ${x} cents.`, ok: x === a * per },
          { text: `${x} + ${b} = ${t}`, ok: t === x + b },
          { text: `So ${p.she} has ${t} cents.`, ok: true },
        ],
        fix: kind === 'rule' ? `1 shilling is 100 cents, not 10 cents. ${a} shillings is ${a * 100} cents.` : `${x} + ${b} = ${x + b}.`,
        hints: ['Check how many cents make 1 shilling.', 'Then check each sum.'],
        steps: [`1 shilling is 100 cents, so ${a} shillings is ${a * 100} cents.`, `${a * 100} + ${b} = ${a * 100 + b} cents.`],
      };
    } }),
];
