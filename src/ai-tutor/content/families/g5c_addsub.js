// ============================================================================
// GRADE 5 MATHEMATICS, NUMBERS: ADDITION and SUBTRACTION (18 curriculum skills).
// Wrong answers come from running the library's misconceptions as procedures
// (drop the carry, write the column total, subtract the smaller digit...).
// ============================================================================
import { fam, randInt, pick, shuffle, rnd, fl, commas, person, sh, mc, tbl } from './g5c_lib.js';

const A = 'NUMBER.ADDITION.', S = 'NUMBER.SUBTRACTION.';
const cols = (n) => String(n).padStart(7, '0').split('').map(Number).reverse();   // ones first
const num = (c) => Number(c.slice().reverse().join(''));
const addDropCarry = (a, b) => { const x = cols(a), y = cols(b); return num(x.map((d, i) => (d + y[i]) % 10)); };
const addWriteAll = (a, b) => { const x = cols(a), y = cols(b); return Number(x.map((d, i) => d + y[i]).reverse().join('').replace(/^0+/, '')); };
const addTen = (a, b) => { const x = cols(a), y = cols(b); let c = 0; const out = []; for (let i = 0; i < 7; i++) { const s = x[i] + y[i]; if (c === 1 && s === 9) { out.push(0); c = 0; continue; } const t = s + c; out.push(t % 10); c = t >= 10 ? 1 : 0; } return num(out); };
const carries = (a, b) => { const x = cols(a), y = cols(b); let c = 0, n = 0; for (let i = 0; i < 7; i++) { const t = x[i] + y[i] + c; c = t >= 10 ? 1 : 0; n += c; } return n; };
const subSmaller = (a, b) => { const x = cols(a), y = cols(b); return num(x.map((d, i) => Math.abs(d - y[i]))); };
const subNoDec = (a, b) => { const x = cols(a), y = cols(b); let c = 0; const out = []; for (let i = 0; i < 7; i++) { let t = x[i] - y[i]; if (t < 0) t += 10; out.push(t); } return num(out); };
const borrows = (a, b) => { const x = cols(a), y = cols(b); let br = 0, n = 0; for (let i = 0; i < 7; i++) { const t = x[i] - br - y[i]; br = t < 0 ? 1 : 0; n += br; } return n; };
const noZeroDigit = (n) => !String(n).includes('0');
// A subtraction where no column needs regrouping, with some zeros in the bottom number.
const noBorrowPair = () => { const lo = [], hi = []; for (let i = 0; i < 6; i++) { const d2 = i < 5 && Math.random() < 0.3 ? 0 : randInt(0, 4); const d1 = randInt(Math.max(d2, i === 5 ? 5 : 0), 9); lo.push(d2); hi.push(d1); } lo[5] = randInt(1, 4); return [num(hi), num(lo)]; };
const r6 = () => randInt(100000, 499999);
const KG = ['maize', 'beans', 'rice', 'sugar cane', 'potatoes'];
const TOWNS = ['Kisumu', 'Nyeri', 'Nakuru', 'Eldoret', 'Embu', 'Meru'];

export const FAMILIES = [
  // ---------------------------------------------------------------- ADD_NO_REGROUP_UP_TO_THREE
  fam({ id: 'g5c.add.noreg.harvest', cs: `${A}ADD_NO_REGROUP_UP_TO_THREE`, form: 'word', rung: 1,
    gen: () => {
      const x = [randInt(1, 4), randInt(0, 4), randInt(0, 4), randInt(0, 4), randInt(0, 4), randInt(1, 4)], y = [randInt(0, 5), randInt(0, 4), randInt(0, 4), randInt(0, 4), randInt(0, 4)];
      const a = Number(x.join('')), b = Number(y.join('')), c = randInt(1, 9) * 1000 + randInt(0, 9) * 100, t = a + b + c;
      if (carries(a, b) || carries(a + b, c)) return null;
      const p = person(), crop = pick(KG);
      const wrongLeft = a + Number(`${String(b)}${'0'.repeat(String(a).length - String(b).length)}`.slice(0, 6)) + Number(`${String(c)}${'0'.repeat(Math.max(0, 6 - String(c).length))}`.slice(0, 6));
      return { question: `A depot received ${commas(a)} kg of ${crop} on Monday, ${commas(b)} kg on Tuesday and ${commas(c)} kg on Wednesday. How many kilograms did it receive in the three days?`, answer: t,
        wrong: [[wrongLeft, 'You lined the numbers up on the left. Line them up on the right, so ones are under ones.', 'M_LEFT_ALIGN'], [addDropCarry(a, b) + c, 'Check that each column holds only digits of the same place.', 'M_LEFT_ALIGN'], [a + b, 'The third day is missing.', 'M_ZERO_ANNIHILATES'], [t - (c % 1000 ? 0 : 0) + 1000 * 0 - 100 * (c % 1000 / 100), 'A zero digit in a column adds nothing, so the other digit stays. It does not make the column zero.', 'M_ZERO_ANNIHILATES']],
        hints: ['Write the three numbers under each other, ones under ones.', 'Add column by column from the ones.'], steps: [`${commas(a)} + ${commas(b)} = ${commas(a + b)}.`, `${commas(a + b)} + ${commas(c)} = ${commas(t)} kg.`], chk: (v) => v - c - b === a };
    } }),
  fam({ id: 'g5c.add.noreg.zeros', cs: `${A}ADD_NO_REGROUP_UP_TO_THREE`, form: 'direct', rung: 2,
    gen: () => {
      const a = Number(`${randInt(1, 4)}${pick([0, randInt(1, 4)])}${randInt(0, 4)}${pick([0, randInt(1, 4)])}${randInt(0, 4)}${pick([0, randInt(1, 4)])}`), b = Number(`${randInt(1, 5)}${randInt(0, 4)}${pick([0, randInt(1, 5)])}${randInt(0, 4)}${pick([0, 3])}${randInt(0, 4)}`);
      if (carries(a, b) || !String(a).includes('0') || !String(b).includes('0') || String(a).length !== 6 || String(b).length !== 6) return null;
      const t = a + b, zero = num(cols(a).map((d, i) => (d === 0 || cols(b)[i] === 0 ? 0 : d + cols(b)[i])));
      const options = mc(commas(t), [[commas(zero), 'A column with a zero still gives the other digit. 0 + 4 = 4, not 0.', 'M_ZERO_ANNIHILATES'], [commas(t + 10000 * 0 + 1000), 'Check each column again, especially the thousands.', 'M_ZERO_ANNIHILATES'], [commas(Number(String(t).replace(/0/g, ''))), 'You left out the zeros in the answer. Zero holds a place in the sum.', 'M_ZERO_ANNIHILATES']]);
      return { question: `Which is the sum of ${commas(a)} and ${commas(b)}?`, options, instruction: 'Choose the correct sum.',
        hints: ['Add each column. A zero adds nothing, so the other digit stays.', 'Write a digit in every column of the answer.'], steps: [`Add from the ones: ${cols(a).slice(0, 6).reverse().join('')} and ${cols(b).slice(0, 6).reverse().join('')} column by column.`, `Sum: ${commas(t)}.`] };
    } }),
  fam({ id: 'g5c.add.noreg.different-lengths', cs: `${A}ADD_NO_REGROUP_UP_TO_THREE`, form: 'spot', rung: 3,
    gen: () => {
      const a = randInt(1, 4) * 100000 + randInt(0, 4) * 1000 + randInt(0, 4) * 100 + randInt(0, 4) * 10 + randInt(1, 4), b = randInt(11, 45) * 100 + randInt(1, 4) * 10 + randInt(0, 4), p = person();
      if (carries(a, b)) return null;
      const wrong = a + Number(`${b}000`.slice(0, 6));
      return { question: `${p.name} adds ${commas(a)} and ${commas(b)}. Which step has the mistake?`,
        working: [{ text: `Step 1: Write ${commas(a)} first.`, ok: true }, { text: `Step 2: Write ${commas(b)} under it, starting from the left edge, then add each column.`, ok: false }, { text: `Step 3: The sum is ${commas(wrong)}.`, ok: true }],
        fix: `Numbers must be lined up from the ones on the right. The correct sum is ${commas(a + b)}.`, mis: 'M_LEFT_ALIGN', hints: ['Are the ones digits in the same column?'], steps: [`${commas(a)} + ${commas(b)} = ${commas(a + b)}.`] };
    } }),

  // ---------------------------------------------------------------- ADD_DOUBLE_REGROUP_TWO
  fam({ id: 'g5c.add.dbl.fees', cs: `${A}ADD_DOUBLE_REGROUP_TWO`, form: 'word', rung: 2,
    gen: () => {
      const a = r6(), b = r6();
      if (carries(a, b) !== 2 || a + b >= 1e6 || cols(a).some((d, i) => d + cols(b)[i] === 9)) return null;
      const t = a + b, p = person(), tn = pick(TOWNS);
      return { question: `A county in the ${tn} area collected ${sh(a)} in fees in March and ${sh(b)} in April. How much did it collect in the two months?`, answer: t,
        wrong: [[addDropCarry(a, b), 'You wrote the ones digit but forgot to add the carried 1 to the next column.', 'M_DROP_CARRY'], [addWriteAll(a, b), 'A column total of 10 or more cannot sit in one column. Write the ones and carry the ten.', 'M_NO_CARRY_WRITE_ALL'], [t + 100, 'Check the carried 1 is added only once.', 'M_DROP_CARRY'], [t - 10, 'Check each carry again.', 'M_DROP_CARRY']],
        hints: ['Add the ones column first. Write the ones digit and carry the ten.', 'Add each carried 1 into the next column before you write.'], steps: [`${commas(a)} + ${commas(b)}: carry in two columns.`, `Total: ${sh(t)}.`], chk: (v) => v - a === b };
    } }),
  fam({ id: 'g5c.add.dbl.nines', cs: `${A}ADD_DOUBLE_REGROUP_TWO`, form: 'direct', rung: 3,
    gen: () => {
      const a = r6(), b = r6();
      const x = cols(a), y = cols(b);
      let c = 0, hit = false; for (let i = 0; i < 6; i++) { if (c === 1 && x[i] + y[i] === 9) hit = true; const t = x[i] + y[i] + c; c = t >= 10 ? 1 : 0; }
      if (!hit || a + b >= 1e6 || carries(a, b) < 2) return null;
      const t = a + b;
      const options = mc(commas(t), [[commas(addTen(a, b)), 'When a column adds to 9 and a carried 1 comes in, the column makes 10. Write 0 and carry again.', 'M_CARRY_MAKES_TEN'], [commas(addDropCarry(a, b)), 'Each carried 1 must be added into the next column.', 'M_DROP_CARRY'], [commas(addWriteAll(a, b)), 'Write only the ones digit of a column total, then carry the ten.', 'M_NO_CARRY_WRITE_ALL']]);
      return { question: `Which answer is correct for ${commas(a)} plus ${commas(b)}, where one column makes exactly 10 with the carry?`, options, instruction: 'Choose the correct sum.',
        hints: ['Add the carried 1 first, then look at the column total.', 'If a column makes 10 or more, write the ones digit and carry again.'], steps: [`Work from the ones, carrying as needed.`, `${commas(a)} + ${commas(b)} = ${commas(t)}.`] };
    } }),
  fam({ id: 'g5c.add.dbl.spot', cs: `${A}ADD_DOUBLE_REGROUP_TWO`, form: 'spot', rung: 3,
    gen: () => {
      const a = r6(), b = r6();
      if (carries(a, b) !== 2 || a + b >= 1e6 || addDropCarry(a, b) === a + b) return null;
      const p = person(), t = a + b;
      return { question: `${p.name} works out ${commas(a)} + ${commas(b)}. Which step has the mistake?`,
        working: [{ text: `Step 1: Write the numbers with ones under ones.`, ok: true }, { text: `Step 2: Add each column and write the ones digit. Do not add the carried 1s.`, ok: false }, { text: `Step 3: The sum is ${commas(addDropCarry(a, b))}.`, ok: true }],
        fix: `The carried 1 must be added into the next column. The correct sum is ${commas(t)}.`, mis: 'M_DROP_CARRY', hints: ['What happens to a ten made in one column?'], steps: [`Correct sum: ${commas(t)}.`] };
    } }),

  // ---------------------------------------------------------------- ADD_IN_SITUATIONS
  fam({ id: 'g5c.add.sit.words', cs: `${A}ADD_IN_SITUATIONS`, form: 'word', rung: 2,
    gen: () => {
      const th = randInt(2, 4) * 100 + randInt(0, 9) * 10, t2 = th * 1000 + randInt(1, 9) * 10, b = randInt(100000, 190000);
      const a = t2, say = (n) => n;
      return { question: `A county planted ${[ 'two hundred', 'three hundred', 'four hundred'][Math.floor(th / 100) - 2]}${th % 100 ? ` and ${th % 100 / 10 * 10 === 0 ? '' : ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'][Math.floor(th % 100 / 10)]}` : ''} thousand${t2 % 1000 ? ` and ${['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'][Math.floor(t2 % 1000 / 10)]}` : ''} trees in March and ${commas(b)} trees in April. How many trees were planted altogether?`, answer: a + b,
        wrong: [[Number(`${Math.floor(th / 10)}${t2 % 1000}`) + b, 'You left zeros out when writing the number from words. Zero holds a place.', 'M_WORDS_TO_FIGURES_ZEROS'], [a, 'The April trees are missing from the total.', 'M_ADD_ALL_NUMBERS'], [a + b + 1000, 'Check the thousands column.', 'M_WORDS_TO_FIGURES_ZEROS'], [b - a > 0 ? b - a : a - b, 'Altogether means add, not subtract.', 'M_KEYWORD_ADD']],
        hints: ['Write the number in words as figures first, keeping zeros in the empty places.', 'Then add the two numbers.'], steps: [`March: ${commas(a)}. April: ${commas(b)}.`, `Altogether: ${commas(a + b)} trees.`], chk: (v) => v - b === a };
    } }),
  fam({ id: 'g5c.add.sit.extra', cs: `${A}ADD_IN_SITUATIONS`, form: 'steps', rung: 3,
    gen: () => {
      const a = randInt(100, 400) * 1000 + randInt(0, 9) * 100, b = randInt(100, 400) * 1000 + randInt(0, 9) * 100, c = randInt(5, 30) * 1000, m = randInt(12, 30);
      if (carries(a, b) > 2 || a + b + c >= 1e6) return null;
      return { question: `A matatu Sacco with ${m} matatus earned ${sh(a)} in January, ${sh(b)} in February and ${sh(c)} in March.`,
        parts: [{ prompt: 'How much did the Sacco earn in January and February together?', answer: a + b, unit: 'sh', hint: 'The number of matatus is not an amount of money.', wrong: [[a + b + m, `${m} is the number of matatus. It is not money to add.`, 'M_ADD_ALL_NUMBERS'], [a, 'February is missing.', 'M_ADD_ALL_NUMBERS'], [Math.abs(a - b), 'Together means add.', 'M_KEYWORD_ADD']] },
          { prompt: 'How much did it earn in the three months?', answer: a + b + c, unit: 'sh', hint: 'Add March to the first answer.', wrong: [[a + b + c + m, 'Do not add the number of matatus.', 'M_ADD_ALL_NUMBERS'], [a + b, 'March is missing.', 'M_ADD_ALL_NUMBERS'], [a + b + c + 1000, 'Check the addition.', 'M_ADD_ALL_NUMBERS']] }],
        steps: [`${commas(a)} + ${commas(b)} = ${commas(a + b)}.`, `${commas(a + b)} + ${commas(c)} = ${commas(a + b + c)}.`], chk: (x, v) => v[0] === a + b && v[1] === a + b + c };
    } }),
  fam({ id: 'g5c.add.sit.table', cs: `${A}ADD_IN_SITUATIONS`, form: 'table', rung: 2,
    gen: () => {
      const v = [randInt(10, 60) * 1000 + randInt(0, 9) * 100, randInt(10, 60) * 1000 + randInt(0, 9) * 100, randInt(10, 60) * 1000 + randInt(0, 9) * 100], towns = shuffle(TOWNS).slice(0, 3), t = v[0] + v[1] + v[2];
      if (carries(v[0], v[1]) > 2) return null;
      return { question: 'The table shows how many bags of maize three stores sold in a season. How many bags did the three stores sell altogether?', model: tbl(['Store', 'Bags sold'], v.map((x, i) => [towns[i], commas(x)])), answer: t,
        wrong: [[v[0] + v[1], 'The third store is missing from the total.', 'M_ADD_ALL_NUMBERS'], [t + v[0], 'Each store is added once.', 'M_ADD_ALL_NUMBERS'], [addDropCarry(v[0], v[1]) + v[2], 'Remember the carried 1 when adding.', 'M_KEYWORD_ADD'], [Math.max(...v), 'That is only the largest store. Altogether means all three.', 'M_KEYWORD_ADD']],
        hints: ['Read the three numbers from the table.', 'Add all three.'], steps: [`${commas(v[0])} + ${commas(v[1])} + ${commas(v[2])}.`, `Total: ${commas(t)} bags.`], chk: (x) => x - v[2] - v[1] === v[0] };
    } }),

  // ---------------------------------------------------------------- ESTIMATE_SUM_NEAREST_100
  fam({ id: 'g5c.add.e100.round', cs: `${A}ESTIMATE_SUM_NEAREST_100`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(2, 8) * 1000 + 900 + randInt(5, 9) * 10 + randInt(0, 9), b = randInt(2, 8) * 1000 + randInt(1, 9) * 100 + 40 + randInt(5, 9);
      const ra = rnd(a, 100), rb = rnd(b, 100), tr = fl(a, 100) + fl(b, 100), ch = rnd(rnd(a, 10), 100) + rnd(rnd(b, 10), 100), br = (ra - 1000) + rb;
      const p = person();
      return { question: `A school fund has sh ${commas(a)} in one account and sh ${commas(b)} in another. ${p.name} estimates the total by rounding each amount to the nearest hundred and adding. What is the estimate?`, answer: ra + rb,
        wrong: [[tr, 'You always rounded down. Look at the tens digit: 5 or more rounds up.', 'M_ROUND_BY_TRUNCATING'], [ch, 'You rounded in steps. Look only at the tens digit.', 'M_CHAIN_ROUNDING'], [br, 'When the hundreds digit is 9 and rounds up, the thousands digit goes up by 1.', 'M_ROUND_BRIDGE']],
        hints: ['Round each amount to the nearest hundred first.', 'Add the two rounded amounts.'], steps: [`${commas(a)} rounds to ${commas(ra)} and ${commas(b)} rounds to ${commas(rb)}.`, `Estimate: ${commas(ra + rb)}.`], chk: (v) => v % 100 === 0 && Math.abs(v - a - b) <= 100 };
    } }),
  fam({ id: 'g5c.add.e100.best', cs: `${A}ESTIMATE_SUM_NEAREST_100`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(3, 8) * 1000 + 900 + randInt(5, 9) * 10 + randInt(0, 9), b = randInt(2, 8) * 1000 + randInt(1, 9) * 100 + 40 + randInt(5, 9);
      const ra = rnd(a, 100), rb = rnd(b, 100);
      const options = mc(commas(ra + rb), [[commas(fl(a, 100) + fl(b, 100)), 'That rounds both down. Check each tens digit.', 'M_ROUND_BY_TRUNCATING'], [commas(ra - 1000 + rb), 'The thousands digit must go up when 9 hundreds round up.', 'M_ROUND_BRIDGE'], [commas(rnd(rnd(a, 10), 100) + rnd(rnd(b, 10), 100)), 'Rounding in steps changes the answer. Use only the tens digit.', 'M_CHAIN_ROUNDING']]);
      return { question: `Which is the best estimate of ${commas(a)} + ${commas(b)} when each number is first rounded to the nearest hundred?`, options, instruction: 'Choose the estimate.',
        hints: ['Underline the hundreds digit in each number and look at the digit to its right.', 'Add the two rounded numbers.'], steps: [`${commas(a)} → ${commas(ra)}, ${commas(b)} → ${commas(rb)}.`, `${commas(ra)} + ${commas(rb)} = ${commas(ra + rb)}.`] };
    } }),
  fam({ id: 'g5c.add.e100.spot', cs: `${A}ESTIMATE_SUM_NEAREST_100`, form: 'spot', rung: 3,
    gen: () => {
      const a = randInt(3, 8) * 1000 + randInt(1, 8) * 100 + randInt(5, 9) * 10 + randInt(0, 9), b = randInt(2, 8) * 1000 + randInt(1, 9) * 100 + randInt(5, 9) * 10, p = person();
      return { question: `${p.name} estimates ${commas(a)} + ${commas(b)} to the nearest hundred. Which step has the mistake?`,
        working: [{ text: `Step 1: ${commas(a)} has tens digit ${Math.floor(a / 10) % 10}, so it rounds up to ${commas(rnd(a, 100))}.`, ok: true }, { text: `Step 2: ${commas(b)} has tens digit ${Math.floor(b / 10) % 10}, so it rounds down to ${commas(fl(b, 100))}.`, ok: false }, { text: `Step 3: Estimate: ${commas(rnd(a, 100))} + ${commas(fl(b, 100))} = ${commas(rnd(a, 100) + fl(b, 100))}.`, ok: true }],
        fix: `A tens digit of 5 or more rounds up, so ${commas(b)} rounds to ${commas(rnd(b, 100))}. The estimate is ${commas(rnd(a, 100) + rnd(b, 100))}.`, mis: 'M_ROUND_BY_TRUNCATING', hints: ['Which way does a tens digit of 5 or more round?'], steps: [`Estimate: ${commas(rnd(a, 100) + rnd(b, 100))}.`] };
    } }),

  // ---------------------------------------------------------------- ESTIMATE_SUM_NEAREST_1000
  fam({ id: 'g5c.add.e1000.round', cs: `${A}ESTIMATE_SUM_NEAREST_1000`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(20, 80) * 1000 + randInt(6, 9) * 100 + randInt(0, 9) * 10 + randInt(0, 9), b = randInt(10, 60) * 1000 + randInt(1, 4) * 100 + randInt(0, 9) * 10 + 9;
      const ra = rnd(a, 1000), rb = rnd(b, 1000), p = person();
      return { question: `A stadium sold ${commas(a)} tickets for one day and ${commas(b)} tickets the next day. ${p.name} estimates the two days together by rounding each number to the nearest thousand. What is the estimate?`, answer: ra + rb,
        wrong: [[rnd(a, 100) + rnd(b, 100), 'That is the nearest hundred. The question asks for the nearest thousand.', 'M_WRONG_ROUNDING_PLACE'], [rnd(a, 10) > 0 && Math.round(a / 1000) * 1000 + rb + (a % 10 >= 5 ? 0 : 1000) * 0 + (b % 10 > 4 ? 1000 : 0), 'You looked at the ones digit. The hundreds digit decides when rounding to the thousand.', 'M_DECIDE_BY_LAST_DIGIT'], [Number(String(ra / 1000 + rb / 1000)), 'You left off the zeros. A rounded thousand keeps its three zeros.', 'M_DROP_ZEROS_ROUNDED']],
        hints: ['Look at the hundreds digit of each number.', 'Round each to the nearest thousand, then add.'], steps: [`${commas(a)} → ${commas(ra)}, ${commas(b)} → ${commas(rb)}.`, `Estimate: ${commas(ra + rb)}.`], chk: (v) => v % 1000 === 0 && Math.abs(v - a - b) <= 1000 };
    } }),
  fam({ id: 'g5c.add.e1000.both', cs: `${A}ESTIMATE_SUM_NEAREST_1000`, form: 'steps', rung: 3,
    gen: () => {
      const a = randInt(20, 80) * 1000 + randInt(6, 9) * 100 + randInt(1, 9) * 10 + randInt(0, 4), b = randInt(10, 60) * 1000 + randInt(1, 4) * 100 + randInt(5, 9) * 10 + randInt(0, 9), p = person();
      return { question: `${p.name} estimates ${commas(a)} + ${commas(b)} two ways: first to the nearest hundred, then to the nearest thousand.`,
        parts: [{ prompt: 'Estimate to the nearest hundred.', answer: rnd(a, 100) + rnd(b, 100), hint: 'Round each number by its tens digit.', wrong: [[rnd(a, 1000) + rnd(b, 1000), 'That is the nearest thousand. This part asks for the nearest hundred.', 'M_WRONG_ROUNDING_PLACE'], [fl(a, 100) + fl(b, 100), 'Round up when the tens digit is 5 or more.', 'M_DECIDE_BY_LAST_DIGIT']] },
          { prompt: 'Estimate to the nearest thousand.', answer: rnd(a, 1000) + rnd(b, 1000), hint: 'Round each number by its hundreds digit.', wrong: [[rnd(a, 100) + rnd(b, 100), 'That is the nearest hundred. This part asks for the nearest thousand.', 'M_WRONG_ROUNDING_PLACE'], [(rnd(a, 1000) + rnd(b, 1000)) / 1000, 'You left off the zeros of the thousands.', 'M_DROP_ZEROS_ROUNDED'], [fl(a, 1000) + fl(b, 1000), 'Look at the hundreds digit: 5 or more rounds up.', 'M_DECIDE_BY_LAST_DIGIT']] }],
        steps: [`Nearest hundred: ${commas(rnd(a, 100))} + ${commas(rnd(b, 100))} = ${commas(rnd(a, 100) + rnd(b, 100))}.`, `Nearest thousand: ${commas(rnd(a, 1000))} + ${commas(rnd(b, 1000))} = ${commas(rnd(a, 1000) + rnd(b, 1000))}.`], chk: (x, v) => v[0] === rnd(a, 100) + rnd(b, 100) && v[1] === rnd(a, 1000) + rnd(b, 1000) };
    } }),
  fam({ id: 'g5c.add.e1000.spot', cs: `${A}ESTIMATE_SUM_NEAREST_1000`, form: 'spot', rung: 3,
    gen: () => {
      const a = randInt(20, 80) * 1000 + randInt(6, 9) * 100 + randInt(1, 9) * 10, b = randInt(10, 60) * 1000 + randInt(1, 4) * 100 + randInt(1, 9) * 10 + randInt(5, 9), p = person();
      return { question: `${p.name} rounds each addend of ${commas(a)} + ${commas(b)} to the nearest thousand. Which step has the mistake?`,
        working: [{ text: `Step 1: ${commas(a)}: the hundreds digit is ${Math.floor(a / 100) % 10}, so it rounds to ${commas(rnd(a, 1000))}.`, ok: true }, { text: `Step 2: ${commas(b)}: the ones digit is ${b % 10}, so it rounds up to ${commas(fl(b, 1000) + 1000)}.`, ok: false }, { text: `Step 3: Estimate ${commas(rnd(a, 1000))} + ${commas(fl(b, 1000) + 1000)} = ${commas(rnd(a, 1000) + fl(b, 1000) + 1000)}.`, ok: true }],
        fix: `The hundreds digit decides, not the ones digit. ${commas(b)} rounds to ${commas(rnd(b, 1000))}, so the estimate is ${commas(rnd(a, 1000) + rnd(b, 1000))}.`, mis: 'M_DECIDE_BY_LAST_DIGIT', hints: ['Which digit decides when rounding to the thousand?'], steps: [`Estimate: ${commas(rnd(a, 1000) + rnd(b, 1000))}.`] };
    } }),

  // ---------------------------------------------------------------- ESTIMATE_TO_CHECK_SUM
  fam({ id: 'g5c.add.chk.reasonable', cs: `${A}ESTIMATE_TO_CHECK_SUM`, form: 'why', rung: 2,
    gen: () => {
      const a = randInt(200, 700) * 1000 + randInt(100, 999), b = randInt(100, 280) * 1000 + randInt(100, 999), ok = Math.random() < 0.5, p = person();
      const shown = ok ? a + b : a + b - 100000, est = rnd(a, 1000) + rnd(b, 1000);
      const options = mc(ok ? 'Yes, it is close to the estimate' : 'No, it is far from the estimate', [[ok ? 'No, it is not exactly the estimate' : 'Yes, it looks about right', ok ? 'An estimate is only close. A correct answer does not have to match it exactly.' : 'Compare with the estimate. It is far from your answer.', ok ? 'M_EXACT_MUST_EQUAL_ESTIMATE' : 'M_NO_SENSE_CHECK'], [ok ? 'No, the first digit is different' : 'Yes, it ends in a similar digit', 'Compare the whole size of the numbers with the estimate.', ok ? 'M_EXACT_MUST_EQUAL_ESTIMATE' : 'M_NO_SENSE_CHECK']]);
      return { question: `${p.name} works out ${commas(a)} + ${commas(b)} = ${commas(shown)}. A quick estimate rounds each number to the nearest thousand and gives ${commas(est)}. Is ${p.her} answer reasonable?`, options, instruction: 'Choose the best answer.',
        hints: ['Round each number to the nearest thousand and add.', 'Is the exact answer close to the estimate?'], steps: [`${commas(a)} → ${commas(rnd(a, 1000))}, ${commas(b)} → ${commas(rnd(b, 1000))}. Estimate ${commas(est)}.`, ok ? 'The answer is close, so it is reasonable.' : 'The answer is far away, so it must be checked.'] };
    } }),
  fam({ id: 'g5c.add.chk.must-be-wrong', cs: `${A}ESTIMATE_TO_CHECK_SUM`, form: 'direct', rung: 3,
    gen: () => {
      const a = randInt(200, 600) * 1000 + randInt(100, 999), b = randInt(100, 300) * 1000 + randInt(100, 999), t = a + b;
      const bad = t - 100000 * pick([1, 2]), alt = t + 100 * pick([1, 2, 3]);
      const options = mc(commas(bad), [[commas(t), 'This is the exact sum, close to the estimate.', 'M_EXACT_MUST_EQUAL_ESTIMATE'], [commas(t - 150), 'This is close to the estimate, so it could be right.', 'M_EXACT_MUST_EQUAL_ESTIMATE'], [commas(t + 400), 'This is close to the estimate, so it could be right.', 'M_EXACT_MUST_EQUAL_ESTIMATE']]);
      return { question: `By estimating, which of these cannot be the sum of ${commas(a)} and ${commas(b)}?`, options, instruction: 'Choose the answer that must be wrong.',
        hints: ['Round each number to the nearest thousand and add.', 'Which option is far from the estimate?'], steps: [`Estimate: ${commas(rnd(a, 1000) + rnd(b, 1000))}.`, `${commas(bad)} is far from that, so it must be wrong.`] };
    } }),
  fam({ id: 'g5c.add.chk.compare', cs: `${A}ESTIMATE_TO_CHECK_SUM`, form: 'word', rung: 3,
    gen: () => {
      const a = randInt(200, 600) * 1000 + randInt(100, 999), b = randInt(100, 300) * 1000 + randInt(100, 999), p = person(), t = a + b, est = rnd(a, 1000) + rnd(b, 1000);
      return { question: `A Sacco estimates its two incomes, sh ${commas(a)} and sh ${commas(b)}, to the nearest thousand and gets sh ${commas(est)}. The exact total is sh ${commas(t)}. How many shillings is the exact total away from the estimate?`, answer: Math.abs(t - est),
        wrong: [[t, 'That is the exact total. Find the gap between exact and estimate.', 'M_EXACT_MUST_EQUAL_ESTIMATE'], [t + est, 'Take the smaller from the larger to find a gap.', 'M_NO_SENSE_CHECK'], [Math.abs(t - est) + 1000, 'Check the subtraction.', 'M_NO_SENSE_CHECK'], [Math.abs(t - est) === 0 ? 1 : 0, 'The estimate is rarely exactly the same as the sum. Find the gap.', 'M_EXACT_MUST_EQUAL_ESTIMATE']],
        hints: ['Subtract the smaller total from the larger.', 'The gap tells you how good the estimate was.'], steps: [`Exact: ${commas(t)}. Estimate: ${commas(est)}.`, `Gap: ${commas(Math.abs(t - est))}.`], chk: (v) => v === Math.abs(a + b - est) };
    }, allowNegative: false }),

  // ---------------------------------------------------------------- ADD_PATTERN_EXTEND
  fam({ id: 'g5c.add.pat.next', cs: `${A}ADD_PATTERN_EXTEND`, form: 'direct', rung: 2,
    gen: () => {
      const st = pick([1000, 2000, 5000, 10000, 25000]), s = randInt(100, 300) * 1000 + pick([600, 400, 500]) - (st >= 5000 ? 0 : 0);
      const t = [0, 1, 2, 3].map(i => s + i * st), nxt = s + 4 * st;
      if (nxt >= 1e6 || String(nxt).length === String(s).length && Math.floor(nxt / 1e5) === Math.floor(s / 1e5) && st < 5000) return null;
      const options = mc(commas(nxt), [[commas(Number(String(nxt).slice(0, 1) + String(t[3]).slice(1, 3) + String(nxt).slice(3))), 'The new digit total did not carry into the next place. Add the step in columns.', 'M_PATTERN_BRIDGE_DROP'], [commas(t[3] + st * 2), 'Add the step once to the last term.', 'M_PATTERN_NON_ADJACENT_STEP'], [commas(nxt - 10 * (st >= 10000 ? 1000 : 100)), 'Check the addition in columns.', 'M_PATTERN_BRIDGE_DROP']]);
      return { question: `A pattern starts ${t.map(commas).join(', ')}, and carries on. What is the next number?`, options, instruction: 'Choose the next term.',
        hints: ['Find the difference between neighbouring terms.', 'Add that difference to the last term.'], steps: [`Each term adds ${commas(st)}.`, `${commas(t[3])} + ${commas(st)} = ${commas(nxt)}.`] };
    } }),
  fam({ id: 'g5c.add.pat.missing', cs: `${A}ADD_PATTERN_EXTEND`, form: 'word', rung: 2,
    gen: () => {
      const st = pick([5000, 10000, 15000, 25000, 50000]), s = randInt(10, 40) * 10000, k = pick([1, 2]);
      const t = [0, 1, 2, 3].map(i => s + i * st), shown = t.map((v, i) => (i === k ? '___' : commas(v)));
      return { question: `A women's group saves the same amount more each month: ${shown.join(', ')} shillings. How many shillings were saved in the month marked by the blank?`, answer: t[k],
        wrong: [[t[k] + st, 'You used the wrong step. Find the difference between two neighbouring terms.', 'M_PATTERN_NON_ADJACENT_STEP'], [t[k] - st, 'Check the step between the terms next to the blank.', 'M_PATTERN_NON_ADJACENT_STEP'], [(t[k - 1] + t[k + 1]) / 2 + st, 'Use neighbouring terms to find the step.', 'M_PATTERN_NON_ADJACENT_STEP'], [t[3] + st, 'That is the next term after the pattern, not the missing one.', 'M_PATTERN_OFF_BY_ONE']],
        hints: ['Find the step between two terms side by side.', 'Add it to the term before the blank.'], steps: [`The step is ${commas(st)}.`, `Missing: ${commas(t[k - 1])} + ${commas(st)} = ${commas(t[k])}.`], chk: (v) => v - t[k - 1] === st };
    } }),
  fam({ id: 'g5c.add.pat.nth', cs: `${A}ADD_PATTERN_EXTEND`, form: 'table', rung: 3,
    gen: () => {
      const s = randInt(5, 20) * 10000, st = pick([10000, 25000, 5000]), n = randInt(5, 8);
      const rows = [1, 2, 3].map(i => [`Month ${i}`, commas(s + (i - 1) * st)]);
      return { question: `A co-operative's savings grow by the same amount each month, as the table shows. How much will it have in month ${n}?`, model: tbl(['Month', 'Savings (sh)'], rows), answer: s + (n - 1) * st,
        wrong: [[s + n * st, `Month 1 is the start. By month ${n} the step has been added ${n - 1} times, not ${n}.`, 'M_PATTERN_OFF_BY_ONE'], [s + (n - 2) * st, `Count the steps again from month 1 to month ${n}.`, 'M_PATTERN_OFF_BY_ONE'], [s + 2 * st + (n - 3) * 2 * st, 'The step is the same each month.', 'M_PATTERN_NON_ADJACENT_STEP'], [(s + 2 * st) + n, 'The step is not the month number.', 'M_PATTERN_NON_ADJACENT_STEP']],
        hints: ['Find the step from month 1 to month 2.', `From month 1 to month ${n} there are ${n - 1} steps.`], steps: [`Step: ${commas(st)}.`, `Month ${n}: ${commas(s)} + ${n - 1} × ${commas(st)} = ${commas(s + (n - 1) * st)}.`], chk: (v) => v === s + (n - 1) * st };
    } }),

  // ---------------------------------------------------------------- ADD_PATTERN_CREATE
  fam({ id: 'g5c.add.cre.rule', cs: `${A}ADD_PATTERN_CREATE`, form: 'direct', rung: 1,
    gen: () => {
      const st = pick([10000, 5000, 1000, 100000]), s = randInt(100, 400) * 1000 + pick([500, 0]), t = [0, 1, 2, 3].map(i => s + i * st);
      const dig = { 100000: 1, 10000: 1, 1000: 1, 5000: 5 }[st];
      const options = mc(`Add ${commas(st)}`, [[`Add ${dig === 1 ? 1 : dig}`, `That is how one digit changes. The rule is the value added each time, which is ${commas(st)}.`, 'M_RULE_AS_DIGIT_CHANGE'], [`Add ${commas(st * 10)}`, 'Subtract two neighbouring terms to check the size of the step.', 'M_RULE_AS_DIGIT_CHANGE'], [`Add ${commas(st / 10)}`, 'Subtract two neighbouring terms to check the size of the step.', 'M_RULE_AS_DIGIT_CHANGE']]);
      return { question: `What is the rule for this pattern: ${t.map(commas).join(', ')}?`, options, instruction: 'Choose the rule.',
        hints: ['Subtract one term from the next.', 'The rule is the whole amount added, not one digit.'], steps: [`${commas(t[1])} − ${commas(t[0])} = ${commas(st)}.`, `The rule is add ${commas(st)}.`] };
    } }),
  fam({ id: 'g5c.add.cre.make', cs: `${A}ADD_PATTERN_CREATE`, form: 'word', rung: 2,
    gen: () => {
      const st = pick([15000, 25000, 20000, 35000]), s = randInt(2, 8) * 10000, t = [0, 1, 2, 3].map(i => s + i * st), p = person();
      return { question: `${p.name}'s chama starts with sh ${commas(s)} and adds sh ${commas(st)} every month. How much will the chama have in the fourth month?`, answer: t[3],
        wrong: [[t[2] + st + 5000, 'Each step must be the same size. Check each addition.', 'M_PATTERN_RULE_DRIFT'], [s + 4 * st, 'The first month is the start. By the fourth month there have been 3 additions.', 'M_PATTERN_RULE_DRIFT'], [t[2], 'That is the third month.', 'M_PATTERN_RULE_DRIFT'], [s + st + st * 2 - 5000, 'Keep the step the same every time.', 'M_PATTERN_RULE_DRIFT']],
        hints: ['Write the first month, then add the same amount each time.', 'Check the difference between each pair of months.'], steps: [`Months: ${t.map(commas).join(', ')}.`, `Fourth month: sh ${commas(t[3])}.`], chk: (v) => v - 3 * st === s };
    } }),
  fam({ id: 'g5c.add.cre.spot', cs: `${A}ADD_PATTERN_CREATE`, form: 'spot', rung: 3,
    gen: () => {
      const st = pick([15000, 25000, 35000]), s = randInt(2, 8) * 10000, p = person();
      const good = [s, s + st, s + 2 * st, s + 3 * st], bad = [s, s + st, s + 2 * st + 5000, s + 3 * st + 5000];
      return { question: `${p.name} writes a pattern that starts at ${commas(s)} and adds ${commas(st)} each time. Which step has the mistake?`,
        working: [{ text: `Step 1: First term ${commas(s)}.`, ok: true }, { text: `Step 2: Second term ${commas(good[1])}. Third term ${commas(bad[2])}.`, ok: false }, { text: `Step 3: Fourth term ${commas(bad[3])}.`, ok: true }],
        fix: `Each step must add exactly ${commas(st)}. The third term should be ${commas(good[2])} and the fourth ${commas(good[3])}.`, mis: 'M_PATTERN_RULE_DRIFT', hints: ['Check the difference between each pair of terms.'], steps: [`Correct pattern: ${good.map(commas).join(', ')}.`] };
    } }),

  // ---------------------------------------------------------------- SUB_6DIGIT_NO_REGROUP
  fam({ id: 'g5c.sub.noreg.stock', cs: `${S}SUB_6DIGIT_NO_REGROUP`, form: 'word', rung: 1,
    gen: () => {
      const [a, b] = noBorrowPair();
      if (!String(b).includes('0') || a - b === 0) return null;
      const t = a - b, p = person();
      return { question: `A store had ${commas(a)} litres of cooking oil in its tanks. A tanker took away ${commas(b)} litres. How many litres were left?`, answer: t,
        wrong: [[subSmaller(a, b) + 10 * 0 + (String(t).includes('0') ? 0 : 0) + 1 * 0 || a - b + 100, 'Check each column. A zero in the bottom number takes nothing away.', 'M_DIGIT_MINUS_ZERO_IS_ZERO'], [num(cols(a).map((d, i) => (cols(b)[i] === 0 ? 0 : d - cols(b)[i]))), 'Taking 0 away from a digit leaves the digit, not 0.', 'M_DIGIT_MINUS_ZERO_IS_ZERO'], [Number(String(t).replace(/0/g, '')), 'Zero holds a place in the answer. Put it in the column.', 'M_DROP_INTERNAL_ZEROS'], [a + b, 'Left means take away.', 'M_DIGIT_MINUS_ZERO_IS_ZERO']],
        hints: ['Write the bottom number under the top, ones under ones.', 'Subtract each column. A column with 0 on the bottom keeps the top digit.'], steps: [`${commas(a)} − ${commas(b)}.`, `${commas(t)} litres were left.`], chk: (v) => v + b === a };
    } }),
  fam({ id: 'g5c.sub.noreg.short', cs: `${S}SUB_6DIGIT_NO_REGROUP`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(300000, 899999), b = randInt(1000, 9999);
      if (borrows(a, b)) return null;
      const t = a - b, left = a - Number(String(b).padEnd(6, '0'));
      const options = mc(commas(t), [[commas(Math.abs(left)), 'You lined up the shorter number on the left. Line it up so ones are under ones.', 'M_MISALIGN_COLUMNS'], [commas(subSmaller(a, b) === t ? t + 10 : subSmaller(a, b)), 'Check each column again.', 'M_MISALIGN_COLUMNS'], [commas(Number(String(t).replace(/0/g, ''))), 'Zero holds a place in the answer.', 'M_DROP_INTERNAL_ZEROS']]);
      return { question: `Take ${commas(b)} away from ${commas(a)}. Which answer is right?`, options, instruction: 'Choose the difference.',
        hints: ['Label the columns: hundred thousands to ones.', 'Put each number under the labels, starting from the ones.'], steps: [`Line up ones under ones: ${commas(a)} over ${commas(b)}.`, `Difference: ${commas(t)}.`] };
    } }),
  fam({ id: 'g5c.sub.noreg.spot', cs: `${S}SUB_6DIGIT_NO_REGROUP`, form: 'spot', rung: 3,
    gen: () => {
      const [a, b] = noBorrowPair();
      if (!String(b).includes('0') || String(a - b).includes('0')) return null;
      const bad = num(cols(a).map((d, i) => (cols(b)[i] === 0 ? 0 : d - cols(b)[i]))), p = person();
      if (bad === a - b) return null;
      return { question: `${p.name} subtracts ${commas(b)} from ${commas(a)}. Which step has the mistake?`,
        working: [{ text: 'Step 1: Write the numbers with ones under ones.', ok: true }, { text: 'Step 2: Where the bottom digit is 0, write 0 in the answer, because 0 takes everything away.', ok: false }, { text: `Step 3: Difference ${commas(bad)}.`, ok: true }],
        fix: `Taking 0 away leaves the top digit unchanged. The difference is ${commas(a - b)}.`, mis: 'M_DIGIT_MINUS_ZERO_IS_ZERO', hints: ['What is 7 − 0?'], steps: [`${commas(a)} − ${commas(b)} = ${commas(a - b)}.`] };
    } }),

  // ---------------------------------------------------------------- SUB_6DIGIT_REGROUP
  fam({ id: 'g5c.sub.reg.budget', cs: `${S}SUB_6DIGIT_REGROUP`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(500000, 999999), b = randInt(100000, 499999);
      if (!noZeroDigit(a) || !noZeroDigit(b) || borrows(a, b) < 2) return null;
      const t = a - b;
      return { question: `A county had a budget of ${sh(a)} for roads and has spent ${sh(b)}. How much is left?`, answer: t,
        wrong: [[subSmaller(a, b), 'You subtracted the smaller digit from the larger in every column. Regroup when the top digit is smaller.', 'M_SMALLER_FROM_LARGER'], [subNoDec(a, b), 'When you take 10 from the next column, that column becomes 1 smaller.', 'M_REGROUP_NO_DECREMENT'], [t + 100, 'Check each regrouping.', 'M_REGROUP_NO_DECREMENT'], [t - 10, 'Check each regrouping.', 'M_SMALLER_FROM_LARGER']],
        hints: ['Start at the ones. If the top digit is smaller, take 1 from the next column.', 'Check by adding your answer to the amount spent.'], steps: [`${commas(a)} − ${commas(b)} with regrouping.`, `Left: ${sh(t)}.`], chk: (v) => v + b === a };
    } }),
  fam({ id: 'g5c.sub.reg.check', cs: `${S}SUB_6DIGIT_REGROUP`, form: 'steps', rung: 3,
    gen: () => {
      const a = randInt(500000, 999999), b = randInt(100000, 499999);
      if (!noZeroDigit(a) || !noZeroDigit(b) || borrows(a, b) < 2) return null;
      const t = a - b, p = person();
      return { question: `${p.name} works out ${commas(a)} − ${commas(b)} and then checks the answer by adding.`,
        parts: [{ prompt: `Work out ${commas(a)} − ${commas(b)}.`, answer: t, hint: 'Regroup when the top digit is smaller than the one below.', wrong: [[subSmaller(a, b), 'Do not subtract the smaller digit from the larger. Regroup instead.', 'M_SMALLER_FROM_LARGER'], [subNoDec(a, b), 'The column you took from must go down by 1.', 'M_REGROUP_NO_DECREMENT']] },
          { prompt: `Add your answer to ${commas(b)}. What do you get?`, answer: a, hint: 'A correct difference added to the number taken away gives the first number back.', wrong: [[a - 100, 'If the sum is not the first number, the subtraction is wrong.', 'M_REGROUP_NO_DECREMENT'], [t + b + 10, 'Check the addition.', 'M_SMALLER_FROM_LARGER']] }],
        steps: [`${commas(a)} − ${commas(b)} = ${commas(t)}.`, `Check: ${commas(t)} + ${commas(b)} = ${commas(a)}.`], chk: (x, v) => v[0] + b === a && v[1] === a };
    } }),
  fam({ id: 'g5c.sub.reg.spot', cs: `${S}SUB_6DIGIT_REGROUP`, form: 'spot', rung: 3,
    gen: () => {
      const a = randInt(500000, 999999), b = randInt(100000, 499999);
      if (!noZeroDigit(a) || !noZeroDigit(b) || borrows(a, b) < 2 || subSmaller(a, b) === a - b) return null;
      const p = person();
      return { question: `${p.name} works out ${commas(a)} − ${commas(b)}. Which step has the mistake?`,
        working: [{ text: 'Step 1: Write the numbers with ones under ones.', ok: true }, { text: 'Step 2: In each column, take the smaller digit from the larger one.', ok: false }, { text: `Step 3: The difference is ${commas(subSmaller(a, b))}.`, ok: true }],
        fix: `When the top digit is smaller you must regroup, taking 1 from the next column. The difference is ${commas(a - b)}.`, mis: 'M_SMALLER_FROM_LARGER', hints: ['Can you take 7 from 3 and stay in whole numbers?'], steps: [`${commas(a)} − ${commas(b)} = ${commas(a - b)}.`] };
    } }),

  // ---------------------------------------------------------------- SUB_REGROUP_ACROSS_ZEROS
  fam({ id: 'g5c.sub.zero.round', cs: `${S}SUB_REGROUP_ACROSS_ZEROS`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(3, 9) * 100000, b = randInt(100000, a - 20000);
      if (!noZeroDigit(b)) return null;
      const lead = a / 100000, ten = (() => { const x = cols(a), y = cols(b); const out = []; for (let i = 0; i < 6; i++) out.push(i < 5 ? 10 - y[i] : lead - 1 - y[i]); return out; })();
      if (ten.some(v => v < 0 || v > 9)) return null;
      const wTen = num(ten), wZero = (lead - cols(b)[5]) * 100000, t = a - b;
      return { question: `A school has a fund of ${sh(a)} and pays a builder ${sh(b)}. How much is left in the fund?`, answer: t,
        wrong: [[wTen, 'You turned every zero into 10. All the zeros become 9, except the ones column, which becomes 10.', 'M_ZEROS_ALL_BECOME_TEN'], [wZero, 'A zero on top does not make the column zero. Regroup from the first non-zero digit.', 'M_ZERO_MINUS_DIGIT_IS_ZERO'], [t + 1, 'Check that you reduced the first digit only once and made the middle zeros 9.', 'M_ZEROS_ALL_BECOME_TEN'], [t - 1, 'Check the ones column.', 'M_ZEROS_ALL_BECOME_TEN']],
        hints: ['Think of the fund as 99,999 + 1, so the zeros become 9s.', 'Check by adding the answer to the amount paid.'], steps: [`${commas(a)} − ${commas(b)}: regroup across the zeros.`, `Left: ${sh(t)}.`], chk: (v) => v + b === a };
    } }),
  fam({ id: 'g5c.sub.zero.note', cs: `${S}SUB_REGROUP_ACROSS_ZEROS`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(3, 9) * 100000 + randInt(0, 9) * 1000 * 0 + randInt(1, 9) * 100 * 0, b = randInt(100000, a - 10000);
      if (!noZeroDigit(b)) return null;
      const cost = b, t = a - b, lead = a / 100000;
      const ten = (() => { const y = cols(b); const out = []; for (let i = 0; i < 6; i++) out.push(i < 5 ? 10 - y[i] : lead - 1 - y[i]); return out; })();
      if (ten.some(v => v < 0 || v > 9)) return null;
      const options = mc(commas(t), [[commas(num(ten)), 'Only the ones column becomes 10. The other zeros become 9.', 'M_ZEROS_ALL_BECOME_TEN'], [commas((lead - cols(b)[5]) * 100000), 'Do not write 0 for a zero on top. Regroup.', 'M_ZERO_MINUS_DIGIT_IS_ZERO'], [commas(t + 100), 'Check each column after regrouping.', 'M_ZEROS_ALL_BECOME_TEN']]);
      return { question: `A buyer pays for goods that cost sh ${commas(cost)} with a sh ${commas(a)} cheque. How much change is due? Choose the right amount.`, options, instruction: 'Choose the change.',
        hints: [`Write ${commas(a)} as ${commas(a - 1)} + 1 to see the nines.`, 'Subtract column by column.'], steps: [`${commas(a)} − ${commas(cost)}.`, `Change: sh ${commas(t)}.`] };
    } }),
  fam({ id: 'g5c.sub.zero.spot', cs: `${S}SUB_REGROUP_ACROSS_ZEROS`, form: 'spot', rung: 3,
    gen: () => {
      const a = randInt(3, 9) * 100000, b = randInt(100000, a - 20000), lead = a / 100000, y = cols(b), p = person();
      if (!noZeroDigit(b)) return null;
      const ten = []; for (let i = 0; i < 6; i++) ten.push(i < 5 ? 10 - y[i] : lead - 1 - y[i]);
      if (ten.some(v => v < 0 || v > 9)) return null;
      return { question: `${p.name} works out ${commas(a)} − ${commas(b)}. Which step has the mistake?`,
        working: [{ text: `Step 1: The first digit ${lead} is reduced by 1.`, ok: true }, { text: 'Step 2: Every zero becomes 10, and each is worked as 10 minus the digit below it.', ok: false }, { text: `Step 3: The difference is ${commas(num(ten))}.`, ok: true }],
        fix: `Each middle zero becomes 9, and only the ones column becomes 10. The difference is ${commas(a - b)}.`, mis: 'M_ZEROS_ALL_BECOME_TEN', hints: ['What does 500,000 equal if you think of 499,999 + 1?'], steps: [`${commas(a)} − ${commas(b)} = ${commas(a - b)}.`] };
    } }),

  // ---------------------------------------------------------------- SUB_WORD_PROBLEMS
  fam({ id: 'g5c.sub.wp.fewer', cs: `${S}SUB_WORD_PROBLEMS`, form: 'word', rung: 2,
    gen: () => {
      const n = randInt(100, 300) * 1000 + randInt(1, 9) * 100, d = randInt(10, 90) * 1000 + randInt(1, 9) * 100, t1 = TOWNS[randInt(0, 2)], t2 = TOWNS[randInt(3, 5)];
      return { question: `${t1} stored ${commas(n)} bags of maize. This is ${commas(d)} more than ${t2} stored. How many bags did ${t2} store?`, answer: n - d,
        wrong: [[n + d, 'More does not always mean add. The smaller store is the one asked for, so take away.', 'M_KEYWORD_MORE_MEANS_ADD'], [d, 'That is the difference, not the store asked for.', 'M_KEYWORD_MORE_MEANS_ADD'], [n - d + 1000, 'Check the subtraction.', 'M_MISSING_PART_ADDS'], [n, 'That is the bigger store.', 'M_KEYWORD_MORE_MEANS_ADD']],
        hints: ['Draw two bars, the longer one for the bigger store.', 'Which bar are you finding?'], steps: [`The smaller store is the larger one minus the difference.`, `${commas(n)} − ${commas(d)} = ${commas(n - d)} bags.`], chk: (v) => v + d === n };
    } }),
  fam({ id: 'g5c.sub.wp.target', cs: `${S}SUB_WORD_PROBLEMS`, form: 'direct', rung: 1,
    gen: () => {
      const target = randInt(10, 40) * 10000 + randInt(0, 9) * 1000, got = target - randInt(1, 9) * 10000 - randInt(1, 9) * 100, p = person();
      if (got < 10000) return null;
      const options = mc(sh(target - got), [[sh(target + got), 'You added. The amount still needed cannot be bigger than the target.', 'M_MISSING_PART_ADDS'], [sh(got), 'That is the amount already raised.', 'M_MISSING_PART_ADDS'], [sh(target), 'That is the whole target, not the part still needed.', 'M_MISSING_PART_ADDS']]);
      return { question: `A school in Nakuru has raised ${sh(got)} towards a target of ${sh(target)}. How much more does it need? Choose the amount.`, options, instruction: 'Choose the amount still needed.',
        hints: ['Draw a bar for the target and shade the part raised.', 'The part still needed is what is left of the bar.'], steps: [`Needed: ${commas(target)} − ${commas(got)}.`, `Still needed: ${sh(target - got)}.`] };
    } }),
  fam({ id: 'g5c.sub.wp.sentence', cs: `${S}SUB_WORD_PROBLEMS`, form: 'why', rung: 3,
    gen: () => {
      const a = randInt(300, 800) * 1000, b = randInt(100, 290) * 1000 + randInt(1, 9) * 100, p = person();
      const options = mc(`${commas(a)} − ${commas(b)}`, [[`${commas(b)} − ${commas(a)}`, 'The larger number comes first in a subtraction. You cannot take the bigger from the smaller here.', 'M_MISSING_PART_ADDS'], [`${commas(a)} + ${commas(b)}`, 'The story takes away, so subtract.', 'M_KEYWORD_MORE_MEANS_ADD'], [`${commas(a)} × ${commas(b)}`, 'Multiplication is not needed. Take away.', 'M_KEYWORD_MORE_MEANS_ADD']]);
      return { question: `${p.name} has ${sh(a)} in a bank account and spends ${sh(b)} on school fees. Which number sentence finds what is left?`, options, instruction: 'Choose the number sentence.',
        hints: ['Is money going out or coming in?', 'The bigger number goes first in a subtraction.'], steps: ['Money goes out, so subtract.', `${commas(a)} − ${commas(b)} = ${commas(a - b)}.`] };
    } }),

  // ---------------------------------------------------------------- ROUND_NEAREST_100_1000
  fam({ id: 'g5c.sub.round.carry', cs: `${S}ROUND_NEAREST_100_1000`, form: 'word', rung: 2,
    gen: () => {
      const to = pick([100, 1000]), n = (randInt(100, 280) * 1000) + randInt(1, 9) * 100 * (to === 100 ? 0 : 1) + (to === 100 ? 900 : 900) + (to === 100 ? randInt(51, 99) : randInt(51, 99)) - (to === 1000 ? 0 : 0);
      const r = rnd(n, to), p = person();
      const keep = to === 100 ? r - (r % 100) + (n % 100) : r - (r % 1000) + (n % 1000);
      return { question: `A fund has sh ${commas(n)}. ${p.name} writes the amount to the nearest ${to === 100 ? 'hundred' : 'thousand'} shillings in the report. What is written?`, answer: r,
        wrong: [[n - (n % to), 'You looked at the digit in the rounding place. Look at the digit to its right to decide.', 'M_ROUND_USES_OWN_DIGIT'], [keep, 'The digits after the rounding place must become zeros.', 'M_ROUND_KEEPS_TAIL'], [r - to + (n % (to * 10) >= 0 ? 0 : 0) - 0 + (to === 100 ? 0 : 0) - 0 || r - to, 'When you round up a 9 you must carry into the next place.', 'M_ROUND_NO_CARRY'], [rnd(n, to === 100 ? 1000 : 100), `That is the nearest ${to === 100 ? 'thousand' : 'hundred'}.`, 'M_ROUND_USES_OWN_DIGIT']],
        hints: [`Underline the ${to === 100 ? 'hundreds' : 'thousands'} digit and look at the digit to its right.`, 'If a 9 rounds up it carries into the next place.'], steps: [`${commas(n)} lies between ${commas(fl(n, to))} and ${commas(fl(n, to) + to)}.`, `It rounds to ${commas(r)}.`], chk: (v) => v % to === 0 && Math.abs(v - n) <= to / 2 };
    } }),
  fam({ id: 'g5c.sub.round.both', cs: `${S}ROUND_NEAREST_100_1000`, form: 'table', rung: 2,
    gen: () => {
      const n = randInt(11, 98) * 1000 + randInt(6, 9) * 100 + randInt(51, 99), p = person();
      return { question: 'A shop had this stock count. Round it as asked and write the rounded number.', model: tbl(['Stock count', 'Round to the nearest'], [[commas(n), 'hundred']]), answer: rnd(n, 100),
        wrong: [[fl(n, 100), 'The tens digit is 5 or more. Round up.', 'M_ROUND_USES_OWN_DIGIT'], [n - (n % 100) + (n % 100 > 50 ? 0 : 0) + 0 + (n % 10), 'The last two digits must be zeros.', 'M_ROUND_KEEPS_TAIL'], [rnd(n, 1000), 'That is the nearest thousand. The table asks for the hundred.', 'M_ROUND_USES_OWN_DIGIT'], [rnd(n, 100) - 1000 * (Math.floor(n / 100) % 10 === 9 ? 1 : 0), 'When 9 hundreds round up, carry 1 into the thousands.', 'M_ROUND_NO_CARRY']],
        hints: ['Look at the tens digit.', 'Replace the tens and ones with zeros.'], steps: [`${commas(n)} lies between ${commas(fl(n, 100))} and ${commas(fl(n, 100) + 100)}.`, `It is nearer ${commas(rnd(n, 100))}.`], chk: (v) => v % 100 === 0 };
    } }),
  fam({ id: 'g5c.sub.round.halfway', cs: `${S}ROUND_NEAREST_100_1000`, form: 'why', rung: 3,
    gen: () => {
      const th = randInt(10, 98) * 1000, n = th + 500, p = person();
      const options = mc(`${commas(th + 1000)}, because a hundreds digit of 5 rounds up`, [[`${commas(th)}, because 500 is not more than half`, 'A digit of exactly 5 is halfway. By the rule, halfway goes up.', 'M_ROUND_FIVE_DOWN'], [`${commas(th + 500)}, because it is already round`, 'The nearest thousand ends in 000.', 'M_ROUND_KEEPS_TAIL'], [`${commas(th)}, because the thousands digit is ${Math.floor(th / 1000) % 10}`, 'The digit in the rounding place does not decide. The digit to its right does.', 'M_ROUND_USES_OWN_DIGIT']]);
      return { question: `${p.name} rounds ${commas(n)} to the nearest thousand. Which answer, with its reason, is correct?`, options, instruction: 'Choose the answer and reason.',
        hints: ['Mark both thousands on a number line.', 'Where does the halfway point go?'], steps: [`${commas(n)} is exactly halfway between ${commas(th)} and ${commas(th + 1000)}.`, `Halfway goes up: ${commas(th + 1000)}.`] };
    } }),

  // ---------------------------------------------------------------- ESTIMATE_DIFFERENCE
  fam({ id: 'g5c.sub.est.thousand', cs: `${S}ESTIMATE_DIFFERENCE`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(40, 90) * 1000 + randInt(5, 9) * 100 + randInt(10, 99), b = randInt(10, 35) * 1000 + randInt(1, 4) * 100 + randInt(10, 99), p = person();
      const est = rnd(a, 1000) - rnd(b, 1000);
      return { question: `A county had ${commas(a)} learners last year and ${commas(b)} learners in a smaller county. ${p.name} estimates how many more learners the first county had, by rounding both numbers to the nearest thousand. What is the estimate?`, answer: est,
        wrong: [[rnd(a - b, 1000), 'You found the exact difference and then rounded. Round both numbers first, then subtract.', 'M_EXACT_THEN_ROUND'], [rnd(a, 1000) - b, 'Round both numbers, not only one.', 'M_ROUND_ONLY_ONE'], [a - rnd(b, 1000), 'Round both numbers, not only one.', 'M_ROUND_ONLY_ONE'], [rnd(a, 100) - rnd(b, 100), 'That is the nearest hundred. The question asks for the nearest thousand.', 'M_EXACT_THEN_ROUND']],
        hints: ['Round each number to the nearest thousand.', 'Subtract the rounded numbers.'], steps: [`${commas(a)} → ${commas(rnd(a, 1000))}, ${commas(b)} → ${commas(rnd(b, 1000))}.`, `Estimate: ${commas(est)}.`], chk: (v) => v % 1000 === 0 && Math.abs(v - (a - b)) <= 1000 };
    } }),
  fam({ id: 'g5c.sub.est.hundred', cs: `${S}ESTIMATE_DIFFERENCE`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(40, 90) * 100 + randInt(51, 99), b = randInt(10, 35) * 100 + randInt(1, 49);
      const est = rnd(a, 100) - rnd(b, 100);
      const options = mc(commas(est), [[commas(rnd(a - b, 100)), 'Round the two numbers first. Do not subtract and then round.', 'M_EXACT_THEN_ROUND'], [commas(rnd(a, 100) - b), 'Round both numbers.', 'M_ROUND_ONLY_ONE'], [commas(a - rnd(b, 100)), 'Round both numbers.', 'M_ROUND_ONLY_ONE']]);
      return { question: `About how much is ${commas(a)} − ${commas(b)}, when each number is rounded to the nearest hundred first?`, options, instruction: 'Choose the estimate.',
        hints: ['Write each number rounded to the nearest hundred.', 'Subtract the rounded numbers.'], steps: [`${commas(a)} → ${commas(rnd(a, 100))}, ${commas(b)} → ${commas(rnd(b, 100))}.`, `${commas(rnd(a, 100))} − ${commas(rnd(b, 100))} = ${commas(est)}.`] };
    } }),
  fam({ id: 'g5c.sub.est.reasonable', cs: `${S}ESTIMATE_DIFFERENCE`, form: 'why', rung: 3,
    gen: () => {
      const a = randInt(400, 900) * 100 + randInt(11, 89), b = randInt(100, 350) * 100 + randInt(11, 89), p = person(), ok = Math.random() < 0.5;
      const shown = ok ? a - b : a - b + 2000, est = rnd(a, 1000) - rnd(b, 1000);
      const options = mc(ok ? 'Reasonable: it is close to the estimate' : 'Not reasonable: it is far from the estimate', [[ok ? 'Not reasonable: it is not exactly the estimate' : 'Reasonable: it looks right', 'An estimate is only a guide. Compare the sizes.', 'M_EXACT_THEN_ROUND'], [ok ? 'Not reasonable: the digits are different' : 'Reasonable: both numbers are five digits', 'Compare the size of the answer with the estimate.', 'M_EXACT_THEN_ROUND']]);
      return { question: `${p.name} works out ${commas(a)} − ${commas(b)} = ${commas(shown)}. The estimate to the nearest thousand is ${commas(est)}. Is the answer reasonable?`, options, instruction: 'Choose the best answer.',
        hints: ['How far is the exact answer from the estimate?', 'An exact answer may be a little different from an estimate.'], steps: [`Estimate ${commas(est)}, exact answer ${commas(shown)}.`, ok ? 'They are close.' : 'They are far apart.'] };
    } }),

  // ---------------------------------------------------------------- COMBINED_ADD_SUB_CALC
  fam({ id: 'g5c.comb.calc.story', cs: `${S}COMBINED_ADD_SUB_CALC`, form: 'word', rung: 1,
    gen: () => {
      const a = randInt(40, 90) * 1000, b = randInt(10, 30) * 1000, c = randInt(5, 25) * 1000, p = person();
      return { question: `${p.name} had ${commas(a)} shillings, gave away ${commas(b)} shillings, and then received ${commas(c)} shillings. Work out ${commas(a)} − ${commas(b)} + ${commas(c)}.`, answer: a - b + c,
        wrong: [[a - (b + c), 'You added first. Work left to right: subtract, then add.', 'M_ADD_BEFORE_SUBTRACT'], [a + b + c, 'The 2nd amount is given away. Subtract it.', 'M_ADD_BEFORE_SUBTRACT'], [a - b - c, 'The last amount is received. Add it.', 'M_ADD_BEFORE_SUBTRACT'], [a + b - c, 'Check which amounts go out and which come in.', 'M_ADD_BEFORE_SUBTRACT']],
        hints: ['Work from left to right.', 'First do the subtraction, then the addition.'], steps: [`${commas(a)} − ${commas(b)} = ${commas(a - b)}.`, `${commas(a - b)} + ${commas(c)} = ${commas(a - b + c)}.`], chk: (v) => v - c + b === a };
    } }),
  fam({ id: 'g5c.comb.calc.missing', cs: `${S}COMBINED_ADD_SUB_CALC`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(40, 90) * 1000, b = randInt(10, 30) * 1000, c = randInt(5, 25) * 1000, r = a - b + c;
      const options = mc(commas(b), [[commas(b + 2 * c), 'Work the expression left to right to see which number is missing.', 'M_ADD_BEFORE_SUBTRACT'], [commas(a + c - r === b ? b + 1000 : a + c - r + 2 * c), 'Check by working left to right.', 'M_ADD_BEFORE_SUBTRACT'], [commas(c), 'That is a different number in the expression.', 'M_ADD_BEFORE_SUBTRACT']]);
      return { question: `Which number goes in the box to make ${commas(a)} − □ + ${commas(c)} = ${commas(r)} true?`, options, instruction: 'Choose the number for the box.',
        hints: ['Work backwards from the answer.', 'Check by working left to right.'], steps: [`${commas(r)} − ${commas(c)} = ${commas(r - c)}.`, `${commas(a)} − □ = ${commas(r - c)}, so □ = ${commas(b)}.`] };
    } }),
  fam({ id: 'g5c.comb.calc.spot', cs: `${S}COMBINED_ADD_SUB_CALC`, form: 'spot', rung: 3,
    gen: () => {
      const a = randInt(40, 90) * 1000, b = randInt(10, 30) * 1000, c = randInt(5, 25) * 1000, p = person();
      return { question: `${p.name} works out ${commas(a)} − ${commas(b)} + ${commas(c)}. Which step has the mistake?`,
        working: [{ text: `Step 1: Add ${commas(b)} and ${commas(c)} first to get ${commas(b + c)}.`, ok: false }, { text: `Step 2: Take ${commas(b + c)} from ${commas(a)} to get ${commas(a - b - c)}.`, ok: true }, { text: `Step 3: The answer is ${commas(a - b - c)}.`, ok: true }],
        fix: `Work from left to right: ${commas(a)} − ${commas(b)} = ${commas(a - b)}, then add ${commas(c)} to get ${commas(a - b + c)}.`, mis: 'M_ADD_BEFORE_SUBTRACT', hints: ['In which order should the operations go?'], steps: [`Correct: ${commas(a - b + c)}.`] };
    } }),

  // ---------------------------------------------------------------- COMBINED_ADD_SUB_PROBLEMS
  fam({ id: 'g5c.comb.prob.money', cs: `${S}COMBINED_ADD_SUB_PROBLEMS`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(10, 40) * 1000 + randInt(1, 9) * 100, b = randInt(2, 9) * 1000 + randInt(1, 9) * 50, c = randInt(2, 8) * 1000 + randInt(1, 9) * 100, p = person();
      return { question: `${p.name} had ${sh(a)}. ${p.She} spent ${sh(b)} on sugar and flour, then ${p.her} mother gave ${p.herObj} ${sh(c)}. How much does ${p.she} have now?`, answer: a - b + c,
        wrong: [[a + b + c, 'Money spent goes out. Subtract it.', 'M_ADD_ALL_NUMBERS'], [a - b - c, 'Money given to her comes in. Add it.', 'M_ADD_ALL_NUMBERS'], [a + b - c, 'Mark each amount + or −: in or out.', 'M_ADD_ALL_NUMBERS'], [a - b, 'The money she was given is missing.', 'M_ADD_ALL_NUMBERS']],
        hints: ['Mark each amount: comes in (+) or goes out (−).', 'Work from the start amount, one change at a time.'], steps: [`${commas(a)} − ${commas(b)} = ${commas(a - b)}.`, `${commas(a - b)} + ${commas(c)} = ${commas(a - b + c)}.`], chk: (v) => v + b - c === a };
    } }),
  fam({ id: 'g5c.comb.prob.table', cs: `${S}COMBINED_ADD_SUB_PROBLEMS`, form: 'table', rung: 3,
    gen: () => {
      const s = randInt(20, 60) * 100, d1 = randInt(10, 30) * 100, so1 = randInt(5, 15) * 100, d2 = randInt(10, 20) * 100, so2 = randInt(5, 12) * 100;
      const end = s + d1 - so1 + d2 - so2;
      if (end <= 0) return null;
      return { question: 'A shop keeps a record of the kilograms of rice in stock. How many kilograms are in the store at the end of Friday?', model: tbl(['Day', 'What happened', 'Kilograms'], [['Monday', 'Stock at start', commas(s)], ['Tuesday', 'Delivered', commas(d1)], ['Wednesday', 'Sold', commas(so1)], ['Thursday', 'Delivered', commas(d2)], ['Friday', 'Sold', commas(so2)]]), answer: end,
        wrong: [[s + d1 + so1 + d2 + so2, 'Sold goods leave the store, so subtract them.', 'M_ADD_ALL_NUMBERS'], [s + d1 - so1, 'There were two more changes, on Thursday and Friday.', 'M_ADD_ALL_NUMBERS'], [s + d1 + d2 - so1, 'There is one more sale, on Friday.', 'M_ADD_ALL_NUMBERS'], [s - so1 - so2, 'The deliveries are missing.', 'M_ADD_ALL_NUMBERS']],
        hints: ['Start with the stock at the start.', 'Add deliveries and take away sales in order.'], steps: [`${commas(s)} + ${commas(d1)} − ${commas(so1)} + ${commas(d2)} − ${commas(so2)}.`, `End of Friday: ${commas(end)} kg.`], chk: (v) => v + so1 + so2 === s + d1 + d2 };
    } }),
  fam({ id: 'g5c.comb.prob.sentence', cs: `${S}COMBINED_ADD_SUB_PROBLEMS`, form: 'why', rung: 3,
    gen: () => {
      const a = randInt(20, 60) * 1000, b = randInt(5, 15) * 1000, c = randInt(5, 15) * 1000, p = person();
      const options = mc(`${commas(a)} − ${commas(b)} + ${commas(c)}`, [[`${commas(a)} + ${commas(b)} + ${commas(c)}`, 'Not every amount comes in. Marks the ones that go out as minus.', 'M_ADD_ALL_NUMBERS'], [`${commas(a)} − ${commas(b)} − ${commas(c)}`, 'The last amount comes in, so add it.', 'M_ADD_ALL_NUMBERS'], [`${commas(a)} + ${commas(b)} − ${commas(c)}`, 'Check which amounts come in and which go out.', 'M_ADD_ALL_NUMBERS']]);
      return { question: `A bus had ${commas(a)} passengers counted in one week. ${commas(b)} got off at the first stage. ${commas(c)} more got on at the next stage. Which number sentence shows the passengers on the bus now?`, options, instruction: 'Choose the number sentence.',
        hints: ['Got off means minus. Got on means plus.', 'Write the amounts in the order they happen.'], steps: [`Start ${commas(a)}, get off ${commas(b)}, get on ${commas(c)}.`, `${commas(a)} − ${commas(b)} + ${commas(c)} = ${commas(a - b + c)}.`] };
    } }),

  // ---------------------------------------------------------------- SUB_PATTERN_CONTINUE
  fam({ id: 'g5c.subpat.next', cs: `${S}SUB_PATTERN_CONTINUE`, form: 'direct', rung: 2,
    gen: () => {
      const st = pick([1000, 2000, 5000, 10000]), s = 300000 + st * 3, t = [0, 1, 2, 3].map(i => s - i * st), nxt = s - 4 * st;
      if (Math.floor(t[3] / 100000) === Math.floor(nxt / 100000)) return null;
      const options = mc(commas(nxt), [[commas(nxt + 100000 - 0), 'When the pattern passes a boundary, the digit to the left must go down by 1.', 'M_PATTERN_BOUNDARY_NO_REGROUP'], [commas(t[3] + st), 'That goes up. The pattern goes down.', 'M_PATTERN_BOUNDARY_NO_REGROUP'], [commas(nxt - st), 'Take away the step once.', 'M_PATTERN_BOUNDARY_NO_REGROUP']]);
      return { question: `A tank empties by the same amount each day. Its levels in litres are ${t.map(commas).join('; ')}. What is the next level?`, options, instruction: 'Choose the next term.',
        hints: ['Find the step between neighbouring terms.', 'Subtract it from the last term, in columns.'], steps: [`The step is ${commas(st)}.`, `${commas(t[3])} − ${commas(st)} = ${commas(nxt)}.`] };
    } }),
  fam({ id: 'g5c.subpat.rule', cs: `${S}SUB_PATTERN_CONTINUE`, form: 'why', rung: 2,
    gen: () => {
      const st = pick([10000, 100000, 1000]), s = randInt(5, 9) * 100000 + 300, t = [0, 1, 2].map(i => s - i * st);
      const options = mc(`Subtract ${commas(st)}`, [[`Subtract ${1}`, `${1} is how one digit changes. The rule is the whole value taken away, ${commas(st)}.`, 'M_RULE_DIGIT_NOT_VALUE'], [`Subtract ${commas(st * 10)}`, 'Subtract two neighbouring terms in columns to find the step.', 'M_RULE_DIGIT_NOT_VALUE'], [`Subtract ${commas(st / 10)}`, 'Subtract two neighbouring terms in columns to find the step.', 'M_RULE_DIGIT_NOT_VALUE']]);
      return { question: `What is the rule of the pattern ${t.map(commas).join('; ')}?`, options, instruction: 'Choose the rule.',
        hints: ['Subtract one term from the term before it, in columns.', 'The rule is the amount taken away each time.'], steps: [`${commas(t[0])} − ${commas(t[1])} = ${commas(st)}.`, `The rule is subtract ${commas(st)}.`] };
    } }),
  fam({ id: 'g5c.subpat.table', cs: `${S}SUB_PATTERN_CONTINUE`, form: 'table', rung: 3,
    gen: () => {
      const st = pick([10000, 25000, 5000]), s = randInt(50, 90) * 10000 + 0, k = pick([2, 3]);
      const t = [0, 1, 2, 3, 4].map(i => s - i * st), p = person();
      return { question: `The table shows the water left in a tank at the end of each day, falling by the same amount each day. How many litres are left at the end of day ${k + 1}, the blank?`, model: tbl(['Day', 'Litres left'], t.map((v, i) => [`Day ${i}`, i === k + 1 ? '?' : commas(v)])), answer: t[k + 1],
        wrong: [[t[k + 1] + st, 'You added. The tank is emptying, so subtract.', 'M_PATTERN_BOUNDARY_NO_REGROUP'], [t[k + 1] - st, 'That is one day too far.', 'M_PATTERN_BOUNDARY_NO_REGROUP'], [t[k] - 2 * st, 'The step is the same each day.', 'M_RULE_DIGIT_NOT_VALUE'], [t[k + 1] + 100000 * 0 + 10000, 'Check the subtraction in columns.', 'M_PATTERN_BOUNDARY_NO_REGROUP']],
        hints: ['Find the step between days that are side by side.', 'Subtract it from the day before the blank.'], steps: [`The step is ${commas(st)}.`, `Blank: ${commas(t[k])} − ${commas(st)} = ${commas(t[k + 1])}.`], chk: (v) => v + st === t[k] };
    } }),

  // ---------------------------------------------------------------- SUB_PATTERN_CREATE
  fam({ id: 'g5c.subcre.stop', cs: `${S}SUB_PATTERN_CREATE`, form: 'word', rung: 2,
    gen: () => {
      const st = pick([30000, 40000, 25000]), s = pick([100000, 120000, 90000]), terms = []; for (let v = s; v >= 0; v -= st) terms.push(v);
      if (terms.length < 3) return null;
      const n = terms.length;
      return { question: `A water tank holds ${commas(s)} litres. ${commas(st)} litres are used each week, and the tank cannot go below zero. How many weekly levels, counting the full tank at the start, can be listed as whole numbers?`, answer: n,
        wrong: [[n + 1, `After ${terms[n - 1]} litres, ${commas(st)} cannot be taken from the tank. The pattern stops.`, 'M_PATTERN_PAST_ZERO'], [n - 1, 'Count the starting level too.', 'M_PATTERN_STEP_NOT_CONSTANT'], [n + 2, 'The tank cannot go below zero.', 'M_PATTERN_PAST_ZERO'], [Math.floor(s / st), 'Count the full tank at the start as well.', 'M_PATTERN_STEP_NOT_CONSTANT']],
        hints: ['Write the levels one after another.', 'Stop when the next step would go below zero.'], steps: [`Levels: ${terms.map(commas).join('; ')}.`, `That is ${n} levels.`], chk: (v) => (v - 1) * st <= s && v * st > s - 0 };
    } }),
  fam({ id: 'g5c.subcre.make', cs: `${S}SUB_PATTERN_CREATE`, form: 'direct', rung: 1,
    gen: () => {
      const st = pick([5000, 10000, 25000]), s = randInt(6, 9) * 10000, good = [0, 1, 2, 3, 4].map(i => s - i * st);
      const bad = [s, s - st, s - 2 * st, s - 4 * st, s - 5 * st];
      const options = mc(good.map(commas).join('; '), [[bad.map(commas).join('; '), `The step must stay ${commas(st)}. Check each pair of neighbouring terms.`, 'M_PATTERN_STEP_NOT_CONSTANT'], [[s, s - st, s - 2 * st, s - 3 * st, s - 3 * st - st / 2].map(commas).join('; '), 'Every step must be the same size.', 'M_PATTERN_STEP_NOT_CONSTANT'], [[...good.slice(0, 3), good[3] + st, good[4]].map(commas).join('; '), 'The terms must keep going down by the same amount.', 'M_PATTERN_STEP_NOT_CONSTANT']]);
      return { question: `Create a pattern that starts at ${commas(s)} using the rule subtract ${commas(st)}. Which list is the first five terms?`, options, instruction: 'Choose the correct pattern.',
        hints: ['Subtract the rule from each term to get the next.', 'Check: the gap between neighbouring terms is always the same.'], steps: [`Terms: ${good.map(commas).join('; ')}.`, 'Each gap is the same.'] };
    } }),
  fam({ id: 'g5c.subcre.spot', cs: `${S}SUB_PATTERN_CREATE`, form: 'spot', rung: 3,
    gen: () => {
      const st = pick([5000, 10000, 25000]), s = randInt(6, 9) * 10000, p = person();
      const good = [0, 1, 2, 3].map(i => s - i * st);
      return { question: `${p.name} writes a pattern that starts at ${commas(s)} and subtracts ${commas(st)} each time. Which step has the mistake?`,
        working: [{ text: `Step 1: First term ${commas(s)}, second term ${commas(good[1])}.`, ok: true }, { text: `Step 2: Third term ${commas(good[2] - st)}, because the step grows each time.`, ok: false }, { text: `Step 3: Fourth term ${commas(good[2] - 2 * st)}.`, ok: true }],
        fix: `The step stays ${commas(st)} every time. The terms are ${good.map(commas).join('; ')}.`, mis: 'M_PATTERN_STEP_NOT_CONSTANT', hints: ['Subtract each term from the one before it.'], steps: [`Correct: ${good.map(commas).join('; ')}.`] };
    } }),
];
