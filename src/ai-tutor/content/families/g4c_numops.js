// ============================================================================
// GRADE 4 MATHEMATICS, NUMBERS: ADDITION, SUBTRACTION, MULTIPLICATION and DIVISION.
// Wrong answers come from running the library's misconceptions as procedures
// (drop the carry, write the column total, subtract the smaller digit...).
// All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, randInt, pick, shuffle, distinct, commas, person, sh, mc, tbl } from './g4c_lib.js';

const A = 'NUMBER.ADDITION.', S = 'NUMBER.SUBTRACTION.', M = 'NUMBER.MULTIPLICATION.', D = 'NUMBER.DIVISION.';
const cols = (n) => String(n).padStart(5, '0').split('').map(Number).reverse();   // ones first
const num = (c) => Number(c.slice().reverse().join(''));
const addDropCarry = (a, b) => { const x = cols(a), y = cols(b); return num(x.map((d, i) => (d + y[i]) % 10)); };
const addWriteAll = (a, b) => { const x = cols(a), y = cols(b); return Number(x.map((d, i) => d + y[i]).reverse().join('').replace(/^0+/, '') || 0); };
const carries = (a, b) => { const x = cols(a), y = cols(b); let c = 0, n = 0; for (let i = 0; i < 5; i++) { const t = x[i] + y[i] + c; c = t >= 10 ? 1 : 0; n += c; } return n; };
const subSmaller = (a, b) => { const x = cols(a), y = cols(b); return num(x.map((d, i) => Math.abs(d - y[i]))); };
const borrows = (a, b) => { const x = cols(a), y = cols(b); let br = 0, n = 0; for (let i = 0; i < 5; i++) { const t = x[i] - br - y[i]; br = t < 0 ? 1 : 0; n += br; } return n; };
const subNoReduce = (a, b) => { const x = cols(a), y = cols(b); return num(x.map((d, i) => (d < y[i] ? d + 10 : d) - y[i])); };
const row = (a, m) => { let c = 0; return Number(cols(a).slice(0, 4).map(d => { const t = d * m + c; c = Math.floor(t / 10); return t % 10; }).reverse().join('')) + c * 10000; };
const rowDrop = (a, m) => num(cols(a).map(d => (d * m) % 10));
const rowBefore = (a, m) => { let c = 0; return num(cols(a).map(d => { const t = (d + c) * m; c = Math.floor(((d + c) * m) / 10) > 0 ? Math.floor(t / 10) : 0; return t % 10; })); };
const noZero = (n) => !String(n).includes('0');
const THINGS = ['mandazi', 'oranges', 'eggs', 'pencils', 'exercise books', 'bananas', 'mangoes', 'bottles'];

export const FAMILIES = [
  // ------------------------------------------------------------ ADD_SINGLE_REGROUP
  fam({ id: 'g4c.add.single.depot', cs: `${A}ADD_SINGLE_REGROUP`, form: 'word', rung: 1,
    gen: () => {
      const a = randInt(1200, 6999), b = randInt(1100, 2999), t = a + b, p = person();
      if (carries(a, b) !== 1 || !noZero(a) || !noZero(b)) return null;
      return { question: `A depot received ${commas(a)} kg of maize on Monday and ${commas(b)} kg on Tuesday. How many kilograms did it receive in the two days?`, answer: t,
        wrong: [[addDropCarry(a, b), 'You wrote the ones digit but forgot the carried ten. Add the carried digit to the next column.', 'M_ADD_CARRY_FORGOTTEN'], [addWriteAll(a, b), 'A column total above 9 must be split: write the ones digit and carry the ten.', 'M_ADD_NO_CARRY'], [t + 1000 * (Math.random() < 0.5 ? 1 : -1) * 0 + 100, 'Check the column where you carried.', 'M_ADD_CARRY_FORGOTTEN'], [a + b - 10, 'Check the ones column: the carry makes the next column one more.', 'M_ADD_CARRY_FORGOTTEN']],
        hints: ['Write the numbers under each other, ones under ones.', 'Add column by column from the ones and carry when a column is more than 9.'], steps: [`${commas(a)} + ${commas(b)}: add the ones, carry the ten, and go on to the next column.`, `The total is ${commas(t)} kg.`], chk: (x) => x - b === a };
    } }),
  fam({ id: 'g4c.add.single.align', cs: `${A}ADD_SINGLE_REGROUP`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(2000, 8999), b = randInt(11, 99), t = a + b, p = person();
      if (carries(a, b) !== 1 || !noZero(a)) return null;
      return { question: `${p.name} has sh ${commas(a)} in a savings account and adds sh ${b}. How much money is in the account now?`, answer: t,
        wrong: [[a + b * 10, `You lined ${b} up under the tens. The ones of ${b} go under the ones.`, 'M_ADD_COLUMNS_MISALIGNED'], [a + b * 100, `You lined ${b} up under the hundreds. The ones of ${b} go under the ones.`, 'M_ADD_COLUMNS_MISALIGNED'], [addDropCarry(a, b), 'You forgot the carried ten. Add it to the next column.', 'M_ADD_CARRY_FORGOTTEN'], [addWriteAll(a, b), 'A column total above 9 must be split: write the ones digit and carry the ten.', 'M_ADD_NO_CARRY']],
        hints: ['Write the two numbers so that ones are under ones.', 'Add from the ones column and carry when needed.'], steps: [`${commas(a)} + ${b}: ones under ones, tens under tens.`, `The total is sh ${commas(t)}.`], chk: (x) => x - a === b };
    } }),

  // ------------------------------------------------------------ ADD_DOUBLE_REGROUP
  fam({ id: 'g4c.add.double.market', cs: `${A}ADD_DOUBLE_REGROUP`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(1500, 6999), b = randInt(1500, 3999), t = a + b, p = person();
      if (carries(a, b) !== 2 || !noZero(a) || !noZero(b) || t >= 10000) return null;
      const th = pick(['mangoes', 'eggs', 'bananas']);
      return { question: `A market seller counted ${commas(a)} ${th} in the morning and ${commas(b)} ${th} in the afternoon. How many ${th} did ${p.she} count in all?`, answer: t,
        wrong: [[addDropCarry(a, b), 'You forgot the carried tens. Add each carry to the next column.', 'M_ADD_CARRY_FORGOTTEN'], [addWriteAll(a, b), 'Each column total above 9 must be split: write the ones digit and carry the ten.', 'M_ADD_NO_CARRY'], [t - 100, 'Check the second carry: it goes into the hundreds column.', 'M_ADD_CARRY_ONLY_ONCE'], [t - 10, 'Check the first carry: it goes into the tens column.', 'M_ADD_CARRY_ONLY_ONCE']],
        hints: ['Write the numbers under each other and add from the ones.', 'Carry in each column that goes above 9. There are two carries.'], steps: [`${commas(a)} + ${commas(b)}: carry in two columns.`, `The total is ${commas(t)}.`], chk: (x) => x - b === a };
    } }),
  fam({ id: 'g4c.add.double.pick', cs: `${A}ADD_DOUBLE_REGROUP`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(2500, 7999), b = randInt(1500, 1999), t = a + b;
      if (carries(a, b) !== 2 || !noZero(a) || !noZero(b) || t >= 10000) return null;
      const options = mc(commas(t), [[commas(addDropCarry(a, b)), 'This forgets the carried ten in each column.', 'M_ADD_CARRY_FORGOTTEN'], [commas(t - 100), 'One carry is missing from the hundreds column.', 'M_ADD_CARRY_ONLY_ONCE'], [commas(t + 10), 'A carry has been added twice.', 'M_ADD_CARRY_ONLY_ONCE']]);
      if (!options) return null;
      return { question: `${person().name} adds ${commas(a)} and ${commas(b)}. Which sum is correct?`, options, instruction: 'Choose the correct sum.',
        hints: ['Add from the ones and write the carry above the next column.', 'Check by adding the numbers in the other order.'], steps: [`${commas(a)} + ${commas(b)}: carry twice.`, `The sum is ${commas(t)}.`] };
    } }),

  // ------------------------------------------------------------ SUB_NO_REGROUP
  fam({ id: 'g4c.sub.noreg.sold', cs: `${S}SUB_NO_REGROUP`, form: 'word', rung: 1,
    gen: () => {
      const bd = [randInt(1, 4), randInt(0, 8), randInt(0, 8), randInt(0, 8)], ad = bd.map((d, i) => randInt(i === 0 ? Math.max(d, 2) : Math.max(d, 1), 9));
      const a = Number(ad.join('')), b = Number(bd.join('')), t = a - b, p = person(), th = pick(THINGS);
      if (borrows(a, b) !== 0 || t < 100 || !noZero(a)) return null;
      return { question: `A shop had ${commas(a)} ${th}. It sold ${commas(b)} of them. How many ${th} are left?`, answer: t,
        wrong: [[a + b, 'The question asks how many are left, so take away. Do not add.', 'M_SUB_ADDS'], [subSmaller(a, b), 'Take the lower number from the upper number in every column.', 'M_SUB_ADDS'], [Number(String(t).replace(/0/g, '')), 'A zero in the answer must be written: it holds a place.', 'M_SUB_ZERO_RESULT_DROPPED'], [t + 100, 'Check each column again.', 'M_SUB_COLUMNS_MISALIGNED']],
        hints: ['Left means take away.', 'Subtract column by column from the ones.'], steps: [`${commas(a)} - ${commas(b)}: subtract each column.`, `${commas(t)} ${th} are left.`], chk: (x) => x + b === a };
    } }),
  fam({ id: 'g4c.sub.noreg.align', cs: `${S}SUB_NO_REGROUP`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(3000, 9999), b = randInt(11, 399), t = a - b;
      if (borrows(a, b) !== 0 || !noZero(a)) return null;
      const options = mc(commas(t), [[commas(a - b * 10), `You lined ${b} up one place too far left. Ones go under ones.`, 'M_SUB_COLUMNS_MISALIGNED'], [commas(a - b * 100 > 0 ? a - b * 100 : a - b * 10 - 10), `You lined ${b} up two places too far left.`, 'M_SUB_COLUMNS_MISALIGNED'], [commas(a + b), 'The sign is take away, so subtract.', 'M_SUB_ADDS']]);
      if (!options) return null;
      return { question: `${person().name} works out ${commas(a)} - ${b}. Which answer is correct?`, options, instruction: 'Choose the correct answer.',
        hints: ['Write the smaller number under the larger, ones under ones.', 'Subtract each column.'], steps: [`${commas(a)} - ${b}: line up the ones.`, `The answer is ${commas(t)}.`] };
    } }),

  // ------------------------------------------------------------ SUB_REGROUP
  fam({ id: 'g4c.sub.regroup.tank', cs: `${S}SUB_REGROUP`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(3000, 9999), b = randInt(1100, 2999), t = a - b, p = person();
      if (borrows(a, b) < 1 || !noZero(a) || !noZero(b) || !noZero(t)) return null;
      return { question: `A school water tank held ${commas(a)} litres. ${commas(b)} litres were used in a week. How many litres are left in the tank?`, answer: t,
        wrong: [[subSmaller(a, b), 'You took the smaller digit from the larger in each column. Regroup a ten when the top digit is too small.', 'M_SUB_SMALLER_FROM_LARGER'], [subNoReduce(a, b), 'You added ten to the top digit but did not reduce the next digit by one.', 'M_SUB_BORROW_NOT_REDUCED'], [a + b, 'The water was used, so take away.', 'M_SUB_ADDS'], [t + 10, 'Check the column where you regrouped.', 'M_SUB_BORROW_NOT_REDUCED']],
        hints: ['If the top digit is smaller, take a ten from the next column.', 'Remember to reduce that next digit by one.'], steps: [`${commas(a)} - ${commas(b)}: regroup where the top digit is too small.`, `${commas(t)} litres are left.`], chk: (x) => x + b === a };
    } }),
  fam({ id: 'g4c.sub.regroup.zero', cs: `${S}SUB_REGROUP`, form: 'word', rung: 3,
    gen: () => {
      const th = randInt(2, 8), a = th * 1000 + pick([0, 5, 0]) , b = randInt(1100, th * 1000 - 800), t = a - b, p = person();
      if (!noZero(b) || borrows(a, b) < 2 || t <= 0) return null;
      return { question: `${p.name} has sh ${commas(a)} in a bank and takes out sh ${commas(b)}. How much is left in the bank?`, answer: t,
        wrong: [[subSmaller(a, b), 'You took the smaller digit from the larger in each column. You cannot take from a zero: exchange from the next column.', 'M_SUB_SMALLER_FROM_LARGER'], [subNoReduce(a, b), 'The zero must be reduced too when you take from it.', 'M_SUB_ZERO_REGROUP'], [a + b, 'The money was taken out, so take away.', 'M_SUB_ADDS'], [t - 100, 'Check the regrouping across the zeros.', 'M_SUB_ZERO_REGROUP']],
        hints: ['You cannot take from 0. Take one from the first digit that is not 0 and move it along.', 'Check by adding the answer to the amount taken out.'], steps: [`${commas(a)} - ${commas(b)}: regroup across the zeros one place at a time.`, `The money left is sh ${commas(t)}.`], chk: (x) => x + b === a };
    } }),

  // ------------------------------------------------------------ MULT_BY_TENS
  fam({ id: 'g4c.mul.tens.boxes', cs: `${M}MULT_BY_TENS`, form: 'word', rung: 1,
    gen: () => {
      const a = randInt(3, 49), t = pick([20, 30, 40, 50, 60, 70, 80, 90]), p = a * t, th = pick(THINGS), pe = person();
      if (p > 4500) return null;
      return { question: `A school buys ${t} boxes. Each box has ${a} ${th}. How many ${th} does the school buy?`, answer: p,
        wrong: [[a * t / 10, `You left out the zero of ${t}. Multiply by ${t / 10} tens and write a zero.`, 'M_MUL_TENS_ZERO_FORGOTTEN'], [p * 10, 'That has one zero too many. Multiply by the tens digit, then write one zero.', 'M_MUL_TENS_ZERO_TWICE'], [a + t, 'You added. The question has equal boxes, so multiply.', 'M_MUL_TENS_ADDS'], [p / 10 + a, 'Check each step again.', 'M_MUL_TENS_ZERO_FORGOTTEN']],
        hints: [`${t} is ${t / 10} tens. Multiply ${a} by ${t / 10}.`, 'Then write a zero at the end.'], steps: [`${a} x ${t / 10} = ${a * t / 10}.`, `Write a zero: ${commas(p)} ${th}.`], chk: (x) => x % 10 === 0 && x / t === a };
    } }),
  fam({ id: 'g4c.mul.tens.missing', cs: `${M}MULT_BY_TENS`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(3, 49), t = pick([20, 30, 40, 50, 60, 70, 80, 90]), p = a * t;
      if (p > 4500) return null;
      return { question: `A number multiplied by ${t} gives ${commas(p)}. What is the number?`, answer: a,
        wrong: [[a * 10, 'That is ten times too big. A zero from the multiple of ten stays in the answer.', 'M_MUL_TENS_ZERO_TWICE'], [Math.round(a / 10) || a + 1, 'Divide the product by ten first, then by the tens digit.', 'M_MUL_TENS_ZERO_FORGOTTEN'], [p - t, 'Take care: this is a multiplication, so use division to undo it.', 'M_MUL_TENS_ADDS'], [a + 10, 'Check by multiplying your answer by ' + t + '.', 'M_MUL_TENS_ADDS']],
        hints: [`${t} is ${t / 10} tens. Undo the multiplication by dividing.`, `Divide ${commas(p)} by ten, then by ${t / 10}.`], steps: [`${commas(p)} divided by 10 is ${p / 10}.`, `${p / 10} divided by ${t / 10} is ${a}.`], chk: (x) => x * t === p };
    } }),

  // ------------------------------------------------------------ MULT_2D_NO_REGROUP
  fam({ id: 'g4c.mul.two.rows', cs: `${M}MULT_2D_NO_REGROUP`, form: 'word', rung: 2,
    gen: () => {
      const aT = randInt(1, 3), aO = randInt(1, 3), bT = randInt(1, 3), bO = randInt(1, 3), a = aT * 10 + aO, b = bT * 10 + bO, p = a * b, pe = person();
      if (!distinct(aT, aO, bT, bO) && Math.random() < 0.8) return null;
      return { question: `A hall has ${a} rows of chairs with ${b} chairs in each row. How many chairs are in the hall?`, answer: p,
        wrong: [[aT * bT * 100 + aO * bO, 'You multiplied tens by tens and ones by ones only. Every part of one number meets every part of the other.', 'M_MUL_ONES_ONLY'], [a * bO + a * bT, 'The second row is a row of tens: write a zero first (or multiply by ' + bT * 10 + ').', 'M_MUL_SECOND_ROW_ZERO'], [p - aT * bO * 10, 'One of the four parts is missing.', 'M_MUL_ADDS_PARTS'], [a + b, 'The chairs are in equal rows, so multiply.', 'M_MUL_ADDS_PARTS']],
        hints: [`Split ${b} into ${bT * 10} and ${bO}.`, `Multiply ${a} by ${bO}, then ${a} by ${bT * 10}, and add.`], steps: [`${a} x ${bO} = ${a * bO}.`, `${a} x ${bT * 10} = ${a * bT * 10}. The sum is ${commas(p)}.`], chk: (x) => x === a * bO + a * bT * 10 };
    } }),
  fam({ id: 'g4c.mul.two.grid', cs: `${M}MULT_2D_NO_REGROUP`, form: 'direct', rung: 2,
    gen: () => {
      const aT = randInt(1, 3), aO = randInt(1, 3), bT = randInt(1, 3), bO = randInt(1, 3), a = aT * 10 + aO, b = bT * 10 + bO, p = a * b;
      const options = mc(commas(p), [[commas(aT * bT * 100 + aO * bO), 'This multiplies tens by tens and ones by ones only.', 'M_MUL_ONES_ONLY'], [commas(a * bO + a * bT), 'The tens digit was used as if it were ones.', 'M_MUL_SECOND_ROW_ZERO'], [commas(p - aT * bO * 10), 'One part of the grid is missing.', 'M_MUL_ADDS_PARTS']]);
      if (!options || p === aT * bT * 100 + aO * bO) return null;
      return { question: `${person().name} uses a grid to work out ${a} x ${b}. The grid has the parts ${aT * 10} and ${aO} across, and ${bT * 10} and ${bO} down. What is ${a} x ${b}?`, options, instruction: 'Choose the correct product.',
        hints: ['There are four boxes in the grid. Multiply the numbers for each box.', 'Add the four products.'], steps: [`${aT * 10} x ${bT * 10} = ${aT * bT * 100}, ${aT * 10} x ${bO} = ${aT * bO * 10}, ${aO} x ${bT * 10} = ${aO * bT * 10}, ${aO} x ${bO} = ${aO * bO}.`, `The sum is ${commas(p)}.`] };
    } }),

  // ------------------------------------------------------------ MULT_2D_REGROUP
  fam({ id: 'g4c.mul.carry.crates', cs: `${M}MULT_2D_REGROUP`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(13, 49), b = randInt(12, 39), p = a * b, th = pick(THINGS), pe = person();
      if (a % 10 < 4 || b % 10 < 3 || p < 400) return null;
      const bO = b % 10, bT = Math.floor(b / 10);
      return { question: `A farmer packs ${a} ${th} in each crate. ${pe.name} packs ${b} crates. How many ${th} are packed?`, answer: p,
        wrong: [[rowDrop(a, bO) + rowDrop(a, bT) * 10, 'You forgot the carried digits. Add each carry to the next product.', 'M_MUL_CARRY_FORGOTTEN'], [a * bO + a * bT, 'The second row is a row of tens. Write a zero first, or multiply by ' + bT * 10 + '.', 'M_MUL_PARTIAL_PRODUCTS_SWAPPED'], [rowBefore(a, bO) + rowBefore(a, bT) * 10, 'Multiply first, then add the carry. Do not add the carry before multiplying.', 'M_MUL_CARRY_ADDED_BEFORE'], [p + 10, 'Check the carry again.', 'M_MUL_CARRY_FORGOTTEN']],
        hints: [`Split ${b} into ${bT * 10} and ${bO}.`, `Multiply ${a} by ${bO} and by ${bT * 10}, then add. Carry carefully.`], steps: [`${a} x ${bO} = ${a * bO}.`, `${a} x ${bT * 10} = ${a * bT * 10}. The total is ${commas(p)}.`], chk: (x) => x === a * bO + a * bT * 10 };
    } }),
  fam({ id: 'g4c.mul.carry.pick', cs: `${M}MULT_2D_REGROUP`, form: 'direct', rung: 3,
    gen: () => {
      const a = randInt(23, 49), b = randInt(23, 49), p = a * b;
      if (a % 10 < 4 || b % 10 < 4) return null;
      const bO = b % 10, bT = Math.floor(b / 10);
      const options = mc(commas(p), [[commas(rowDrop(a, bO) + rowDrop(a, bT) * 10), 'The carried digits were forgotten.', 'M_MUL_CARRY_FORGOTTEN'], [commas(a * bO + a * bT), 'The tens row was not shifted.', 'M_MUL_PARTIAL_PRODUCTS_SWAPPED'], [commas(rowBefore(a, bO) + rowBefore(a, bT) * 10), 'The carry was added before multiplying.', 'M_MUL_CARRY_ADDED_BEFORE']]);
      if (!options) return null;
      return { question: `What is ${a} x ${b}?`, options, instruction: 'Choose the correct product.',
        hints: ['Multiply by the ones digit, then by the tens digit, and add.', 'In the second row, write a zero in the ones place first.'], steps: [`${a} x ${bO} = ${a * bO} and ${a} x ${bT * 10} = ${a * bT * 10}.`, `${a * bO} + ${a * bT * 10} = ${commas(p)}.`] };
    } }),

  // ------------------------------------------------------------ DIV_NO_REMAINDER
  fam({ id: 'g4c.div.exact.share', cs: `${D}DIV_NO_REMAINDER`, form: 'word', rung: 1,
    gen: () => {
      const d = randInt(2, 9), q = randInt(3, Math.floor(99 / d)), n = d * q, th = pick(THINGS), pe = person();
      if (String(q).length === 2 && String(q)[0] === String(q)[1]) return null;
      const swap = Number(String(q).split('').reverse().join(''));
      return { question: `The Class 4 teacher puts ${n} ${th} into ${d} equal piles for a counting game. How many ${th} are in each pile?`, answer: q,
        wrong: [[n - d, 'Sharing is not taking ' + d + ' away. Divide ' + n + ' by ' + d + '.', 'M_DIV_SUBTRACT'], [swap === q ? q + 1 : swap, 'Check the order of the digits in your answer.', 'M_DIV_LARGER_BY_SMALLER'], [Math.floor(n / 10) + (n % 10), 'Divide the tens first, then what is left in the ones.', 'M_DIV_LARGER_BY_SMALLER'], [q * 10, 'That has a zero too many. Check by multiplying by ' + d + '.', 'M_DIV_ZERO_DROPPED']],
        hints: [`Share the tens first, then the ones.`, `Check by multiplying your answer by ${d}.`], steps: [`${n} divided by ${d}: share the tens, then the ones.`, `Each child gets ${q}.`], chk: (x) => x * d === n };
    } }),
  fam({ id: 'g4c.div.exact.zero', cs: `${D}DIV_NO_REMAINDER`, form: 'direct', rung: 2,
    gen: () => {
      const d = pick([2, 3, 4, 5, 6, 7, 8, 9]), q = randInt(1, Math.floor(9 / 1)) * 10, n = d * q;
      if (n > 99) return null;
      const options = mc(String(q), [[String(q / 10), 'A zero is missing. Check by multiplying by ' + d + '.', 'M_DIV_ZERO_DROPPED'], [String(n - d), 'That is taking ' + d + ' away, not dividing.', 'M_DIV_SUBTRACT'], [String(q + d), 'Check by multiplying your answer by ' + d + '.', 'M_DIV_LARGER_BY_SMALLER']]);
      if (!options) return null;
      return { question: `What is ${n} divided by ${d}?`, options, instruction: 'Choose the correct answer.',
        hints: ['Divide the tens first. A place that gets nothing needs a zero.', `Check: your answer times ${d} must give ${n}.`], steps: [`${n / 10} tens divided by ${d} is ${q / 10} tens.`, `${q / 10} tens is ${q}.`] };
    } }),

  // ------------------------------------------------------------ DIV_WITH_REMAINDER
  fam({ id: 'g4c.div.rem.left-over', cs: `${D}DIV_WITH_REMAINDER`, form: 'word', rung: 2,
    gen: () => {
      const d = randInt(3, 9), q = randInt(3, Math.floor(95 / d)), r = randInt(1, d - 1), n = d * q + r, th = pick(THINGS), pe = person();
      return { question: `A teacher has ${n} ${th} to share equally among ${d} learners. Each learner is given as many as possible, and the teacher keeps the rest. How many ${th} does the teacher keep?`, answer: r,
        wrong: [[q, `${q} is how many full bags. The question asks how many are left over.`, 'M_DIV_REMAINDER_AS_ANSWER'], [r + d, `A remainder must be smaller than ${d}. Another bag could be filled.`, 'M_DIV_REMAINDER_TOO_BIG'], [d - r, `${d - r} more would fill another bag. The left over is what remains.`, 'M_DIV_REMAINDER_IGNORED'], [n - d, `That is ${n} take away ${d}. Divide to find the full bags first.`, 'M_DIV_REMAINDER_TOO_BIG']],
        hints: [`Divide ${n} by ${d} to find the full bags.`, 'Multiply the full bags by the bag size and take that from the total.'], steps: [`${n} divided by ${d} is ${q} with ${r} left over.`, `${r} ${th} are left over.`], chk: (x) => d * q + x === n && x < d };
    } }),
  fam({ id: 'g4c.div.rem.buses', cs: `${D}DIV_WITH_REMAINDER`, form: 'word', rung: 3,
    gen: () => {
      const d = pick([10, 5, 6, 8, 7, 4, 9]), q = randInt(3, Math.floor(95 / d)), r = randInt(1, d - 1), n = d * q + r, pe = person();
      return { question: `${n} children go on a trip. Each bus carries ${d} children. How many buses are needed so that every child has a seat?`, answer: q + 1,
        wrong: [[q, 'The left over children also need a seat, so one more bus is needed.', 'M_DIV_STORY_REMAINDER_DOWN'], [r, `${r} is the number of children left over, not the number of buses.`, 'M_DIV_REMAINDER_AS_ANSWER'], [q + 2, `Only one more bus is needed: ${r} children is less than ${d}.`, 'M_DIV_REMAINDER_TOO_BIG'], [n - d, 'Divide to find the buses.', 'M_DIV_SUBTRACT']],
        hints: [`Divide ${n} by ${d}.`, 'Think about the children who are left over.'], steps: [`${n} divided by ${d} is ${q} with ${r} left over.`, `The ${r} left over children need one more bus: ${q + 1} buses.`], chk: (x) => (x - 1) * d < n && x * d >= n };
    } }),
];
