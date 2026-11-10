// ============================================================================
// GRADE 5 MATHEMATICS, NUMBERS: MULTIPLICATION and DIVISION (16 curriculum skills).
// ============================================================================
import { fam, randInt, pick, shuffle, rnd, fl, commas, person, sh, mc, tbl, gcd } from './g5c_lib.js';

const M = 'NUMBER.MULTIPLICATION.', D = 'NUMBER.DIVISION.';
const dg = (n) => String(n).split('').map(Number);
// misconception procedures for n x m (m one digit)
const dropCarry = (n, m) => Number(dg(n).map(d => (d * m) % 10).join(''));
const writeAll = (n, m) => Number(dg(n).map(d => d * m).join(''));
const carryFirst = (n, m) => { const d = dg(n).reverse(); let c = 0; const out = []; for (let i = 0; i < d.length; i++) { const t = (d[i] + c) * m; if (i === d.length - 1) out.push(t); else { out.push(t % 10); c = Math.floor(t / 10); } } return Number(out.reverse().join('')); };
const zeroSkip = (n, m) => { const d = dg(n).reverse(); let c = 0; const out = []; for (let i = 0; i < d.length; i++) { const t = d[i] === 0 ? 0 : d[i] * m + c; if (d[i] === 0) { out.push(0); continue; } if (i === d.length - 1) out.push(t); else { out.push(t % 10); c = Math.floor(t / 10); } } return Number(out.reverse().join('')); };
const noShift = (n, m) => n * (m % 10) + n * Math.floor(m / 10);
const likeAdd = (n, m) => { const a = dg(n).reverse(), b = dg(m).reverse(); return Number(a.map((d, i) => (i < b.length ? d * b[i] : d)).reverse().join('')); };
const mixedRows = (n, m) => n * (m % 10) + (n * Math.floor(m / 10) + Math.floor((n * (m % 10)) / 100)) * 10;
const DAIRY = ['packets of milk', 'bags of flour', 'crates of soda', 'loaves of bread'];
const place = () => pick(['Nyandarua', 'Murang\'a', 'Kitale', 'Naivasha', 'Kericho']);

export const FAMILIES = [
  // ---------------------------------------------------------------- MULT_3D_BY_1D
  fam({ id: 'g5c.mul.d1.packets', cs: `${M}MULT_3D_BY_1D`, form: 'word', rung: 1,
    gen: () => {
      const n = randInt(150, 999), m = randInt(3, 9), t = n * m;
      if (n % 10 === 0 || dropCarry(n, m) === t || carryFirst(n, m) === t) return null;
      return { question: `A dairy in ${place()} fills ${n} packets of milk every hour. How many packets does it fill in ${m} hours?`, answer: t,
        wrong: [[carryFirst(n, m), 'You added the carried digit before multiplying. Multiply first, then add the carry.', 'M_ADD_CARRY_BEFORE_MULTIPLY'], [dropCarry(n, m), 'You forgot the carried digits. Write the carry above the next column.', 'M_DROP_CARRY'], [writeAll(n, m), 'Each column gives a ones digit and a carry. Regroup, do not write the whole product.', 'M_WRITE_WHOLE_COLUMN_PRODUCTS'], [n + m, 'Equal hours means multiply, not add.', 'M_DROP_CARRY']],
        hints: ['Multiply the ones first, then the tens, then the hundreds.', 'Multiply first, then add the carried digit.'], steps: [`${n} × ${m}: ones, tens, hundreds, with carries.`, `${commas(t)} packets.`], chk: (v) => v / m === n };
    } }),
  fam({ id: 'g5c.mul.d1.zero', cs: `${M}MULT_3D_BY_1D`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(1, 9), c = randInt(2, 9), n = a * 100 + c, m = randInt(4, 9), t = n * m;
      if (zeroSkip(n, m) === t || dropCarry(n, m) === t) return null;
      const options = mc(commas(t), [[commas(zeroSkip(n, m)), 'The zero in the tens place still receives the carried digit from the ones.', 'M_ZERO_DIGIT_SKIPPED'], [commas(dropCarry(n, m)), 'Add the carry into the next column.', 'M_DROP_CARRY'], [commas(writeAll(n, m)), 'Regroup the column products.', 'M_WRITE_WHOLE_COLUMN_PRODUCTS']]);
      return { question: `A school buys ${m} bags of maize, each weighing ${n} kg. Which is the total mass in kilograms?`, options, instruction: 'Choose the total.',
        hints: [`Split ${n} into ${a * 100} and ${c}.`, 'Multiply each part, then add.'], steps: [`${a * 100} × ${m} = ${a * 100 * m}, and ${c} × ${m} = ${c * m}.`, `Total ${commas(t)} kg.`] };
    } }),
  fam({ id: 'g5c.mul.d1.spot', cs: `${M}MULT_3D_BY_1D`, form: 'spot', rung: 3,
    gen: () => {
      const n = randInt(150, 999), m = randInt(3, 9), t = n * m, p = person();
      if (n % 10 === 0 || carryFirst(n, m) === t) return null;
      return { question: `${p.name} multiplies ${n} × ${m}. Which step has the mistake?`,
        working: [{ text: `Step 1: Multiply the ones: ${n % 10} × ${m} = ${(n % 10) * m}. Write ${((n % 10) * m) % 10} and carry ${Math.floor(((n % 10) * m) / 10)}.`, ok: true }, { text: `Step 2: Tens: add the carry to the tens digit first, then multiply by ${m}.`, ok: false }, { text: `Step 3: The answer is ${commas(carryFirst(n, m))}.`, ok: true }],
        fix: `Multiply the digit by ${m} first, then add the carry. The correct answer is ${commas(t)}.`, mis: 'M_ADD_CARRY_BEFORE_MULTIPLY', hints: ['Which comes first, multiplying or adding the carry?'], steps: [`${n} × ${m} = ${commas(t)}.`] };
    } }),

  // ---------------------------------------------------------------- MULT_3D_BY_2D
  fam({ id: 'g5c.mul.d2.grid', cs: `${M}MULT_3D_BY_2D`, form: 'table', rung: 2,
    gen: () => {
      const n = randInt(120, 499), m = randInt(12, 48);
      if (n % 10 === 0 || m % 10 === 0) return null;
      const parts = [Math.floor(n / 100) * 100 * Math.floor(m / 10) * 10, Math.floor(n / 100) * 100 * (m % 10), (Math.floor(n / 10) % 10) * 10 * Math.floor(m / 10) * 10, (Math.floor(n / 10) % 10) * 10 * (m % 10), (n % 10) * Math.floor(m / 10) * 10, (n % 10) * (m % 10)];
      const t = n * m;
      return { question: `A grid is used to work out ${n} × ${m}. Each box holds one partial product. What is ${n} × ${m}?`,
        model: tbl(['', `${Math.floor(m / 10) * 10}`, `${m % 10}`], [[`${Math.floor(n / 100) * 100}`, commas(parts[0]), commas(parts[1])], [`${(Math.floor(n / 10) % 10) * 10}`, commas(parts[2]), commas(parts[3])], [`${n % 10}`, commas(parts[4]), commas(parts[5])]]), answer: t,
        wrong: [[noShift(n, m), 'The tens row of the multiplier is worth ten times more. Include the zero.', 'M_NO_PLACEHOLDER_ZERO'], [likeAdd(n, m), 'You multiplied only digits in the same column. Every digit of one number is multiplied by every digit of the other.', 'M_MULTIPLY_LIKE_ADDITION'], [mixedRows(n, m), 'Do not carry leftovers from one row into the other.', 'M_CARRIES_MIXED_BETWEEN_ROWS']],
        hints: ['Add all six boxes.', 'Add the larger ones first.'], steps: [`Boxes: ${parts.map(commas).join(' + ')}.`, `Total: ${commas(t)}.`], chk: (v) => v / m === n };
    } }),
  fam({ id: 'g5c.mul.d2.compare', cs: `${M}MULT_3D_BY_2D`, form: 'direct', rung: 2,
    gen: () => {
      const n = randInt(120, 499), m = randInt(12, 48), t = n * m;
      if (n % 10 === 0 || m % 10 === 0 || noShift(n, m) === t) return null;
      const options = mc(commas(t), [[commas(noShift(n, m)), 'The second row must be shifted one place, because it is multiplying by tens.', 'M_NO_PLACEHOLDER_ZERO'], [commas(likeAdd(n, m)), 'You multiplied digits only in the same column. Use every pair.', 'M_MULTIPLY_LIKE_ADDITION'], [commas(mixedRows(n, m)), 'Keep the carries of each row separate.', 'M_CARRIES_MIXED_BETWEEN_ROWS']]);
      return { question: `Which is the answer when ${n} is multiplied by ${m} using long multiplication?`, options, instruction: 'Choose the product.',
        hints: [`Write ${n} × ${m % 10}, then ${n} × ${Math.floor(m / 10) * 10}.`, 'Add the two rows.'], steps: [`${n} × ${m % 10} = ${n * (m % 10)}; ${n} × ${Math.floor(m / 10) * 10} = ${n * Math.floor(m / 10) * 10}.`, `Sum: ${commas(t)}.`] };
    } }),
  fam({ id: 'g5c.mul.d2.spot', cs: `${M}MULT_3D_BY_2D`, form: 'spot', rung: 3,
    gen: () => {
      const n = randInt(120, 499), m = randInt(12, 48), p = person();
      if (n % 10 === 0 || m % 10 === 0) return null;
      return { question: `${p.name} works out ${n} × ${m}. Which step has the mistake?`,
        working: [{ text: `Step 1: ${n} × ${m % 10} = ${commas(n * (m % 10))}.`, ok: true }, { text: `Step 2: For the tens digit, ${n} × ${Math.floor(m / 10)} = ${commas(n * Math.floor(m / 10))}, written without a zero.`, ok: false }, { text: `Step 3: ${commas(n * (m % 10))} + ${commas(n * Math.floor(m / 10))} = ${commas(noShift(n, m))}.`, ok: true }],
        fix: `The tens row is ${n} × ${Math.floor(m / 10) * 10} = ${commas(n * Math.floor(m / 10) * 10)}. The correct product is ${commas(n * m)}.`, mis: 'M_NO_PLACEHOLDER_ZERO', hints: ['What is the tens digit really worth?'], steps: [`${n} × ${m} = ${commas(n * m)}.`] };
    } }),

  // ---------------------------------------------------------------- MULT_WORD_PROBLEMS
  fam({ id: 'g5c.mul.wp.buses', cs: `${M}MULT_WORD_PROBLEMS`, form: 'word', rung: 1,
    gen: () => {
      const k = randInt(12, 45), g = randInt(30, 65), t = k * g;
      return { question: `Each school bus carries ${g} pupils to a music festival in Kisumu. How many pupils travel in ${k} buses?`, answer: t,
        wrong: [[k + g, 'Equal groups means multiply, not add.', 'M_ADD_INSTEAD_OF_MULTIPLY'], [noShift(g, k), 'Check the tens row of the multiplication.', 'M_ADD_INSTEAD_OF_MULTIPLY'], [t + g, 'Count the buses again. There are exactly that many groups.', 'M_ADD_INSTEAD_OF_MULTIPLY'], [t - k * 10, 'Check the arithmetic.', 'M_STOP_AFTER_FIRST_STEP']],
        hints: ['How many groups? How many in each group?', 'Multiply the groups by the number in each.'], steps: [`${k} buses × ${g} pupils = ${commas(t)}.`, `${commas(t)} pupils travel.`], chk: (v) => v / k === g };
    } }),
  fam({ id: 'g5c.mul.wp.change', cs: `${M}MULT_WORD_PROBLEMS`, form: 'steps', rung: 3,
    gen: () => {
      const kg = randInt(12, 30), pr = pick([125, 135, 145, 155, 165]), cost = kg * pr, pay = Math.ceil((cost + 500) / 1000) * 1000, p = person();
      return { question: `${p.name} buys ${kg} kg of sugar at sh ${pr} per kg and pays with ${sh(pay)}.`,
        parts: [{ prompt: 'How much does the sugar cost altogether?', answer: cost, unit: 'sh', hint: 'Multiply the kilograms by the price of one kilogram.', wrong: [[kg + pr, 'The price is for each kilogram. Multiply.', 'M_ADD_INSTEAD_OF_MULTIPLY'], [noShift(pr, kg), 'Check the tens row.', 'M_ADD_INSTEAD_OF_MULTIPLY'], [pay, 'That is what she paid with, not the cost.', 'M_STOP_AFTER_FIRST_STEP']] },
          { prompt: 'How much change does she get?', answer: pay - cost, unit: 'sh', hint: 'Take the cost from what she paid.', wrong: [[cost, 'That is the cost. The question asks for the change.', 'M_STOP_AFTER_FIRST_STEP'], [pay + cost, 'Change is what is left. Subtract.', 'M_STOP_AFTER_FIRST_STEP'], [pay - cost + 100, 'Check the subtraction.', 'M_STOP_AFTER_FIRST_STEP']] }],
        steps: [`Cost: ${kg} × ${pr} = ${sh(cost)}.`, `Change: ${pay} − ${cost} = ${sh(pay - cost)}.`], chk: (x, v) => v[0] === kg * pr && v[0] + v[1] === pay };
    } }),
  fam({ id: 'g5c.mul.wp.sentence', cs: `${M}MULT_WORD_PROBLEMS`, form: 'why', rung: 2,
    gen: () => {
      const k = randInt(12, 45), g = randInt(30, 65), p = person();
      const options = mc(`${k} × ${g}`, [[`${k} + ${g}`, 'There are equal groups. Add would only combine two different amounts.', 'M_ADD_INSTEAD_OF_MULTIPLY'], [`${g} − ${k}`, 'Nothing is taken away in this story.', 'M_ADD_INSTEAD_OF_MULTIPLY'], [`${g} ÷ ${k}`, 'The question asks for the total of equal groups, not a share.', 'M_ADD_INSTEAD_OF_MULTIPLY']]);
      return { question: `${p.name} packs ${g} eggs in each tray and fills ${k} trays. Which number sentence finds the total number of eggs?`, options, instruction: 'Choose the number sentence.',
        hints: ['How many groups? How many in each?', 'Equal groups: multiply.'], steps: [`${k} trays of ${g} eggs.`, `${k} × ${g} = ${commas(k * g)}.`] };
    } }),

  // ---------------------------------------------------------------- ESTIMATE_PRODUCT_ROUND10
  fam({ id: 'g5c.mul.est.round', cs: `${M}ESTIMATE_PRODUCT_ROUND10`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(2, 8) * 100 + randInt(4, 9) * 10 + randInt(5, 9), b = randInt(1, 6) * 10 + randInt(5, 9), t = rnd(a, 10) * rnd(b, 10), p = person();
      if (rnd(a, 10) % 100 === 0) return null;
      return { question: `A hospital orders ${b} mattresses at sh ${a} each. ${p.name} estimates the bill by rounding each number to the nearest ten and multiplying. What is the estimate?`, answer: t,
        wrong: [[a * b, 'You worked out the exact product. Round both numbers first, then multiply.', 'M_EXACT_THEN_ROUND'], [fl(a, 10) * fl(b, 10), 'You rounded down by chopping the ones. A ones digit of 5 or more rounds up.', 'M_TRUNCATE_NOT_ROUND'], [t / 10, 'You attached too few zeros. Count the zeros in both rounded numbers.', 'M_ZEROS_MISCOUNTED'], [t * 10, 'You attached too many zeros.', 'M_ZEROS_MISCOUNTED']],
        hints: ['Round each number to the nearest ten.', 'Multiply the rounded numbers, counting all the zeros.'], steps: [`${a} → ${rnd(a, 10)} and ${b} → ${rnd(b, 10)}.`, `${rnd(a, 10)} × ${rnd(b, 10)} = ${commas(t)}.`], chk: (v) => v % 100 === 0 && v === rnd(a, 10) * rnd(b, 10) };
    } }),
  fam({ id: 'g5c.mul.est.best', cs: `${M}ESTIMATE_PRODUCT_ROUND10`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(2, 8) * 100 + randInt(4, 9) * 10 + randInt(5, 9), b = randInt(1, 6) * 10 + randInt(5, 9), t = rnd(a, 10) * rnd(b, 10);
      if (rnd(a, 10) % 100 === 0) return null;
      const options = mc(commas(t), [[commas(fl(a, 10) * fl(b, 10)), 'Rounding down every time is not rounding. Look at each ones digit.', 'M_TRUNCATE_NOT_ROUND'], [commas(t / 10), 'Count the zeros again.', 'M_ZEROS_MISCOUNTED'], [commas(Math.round((a * b) / 100) * 100), 'That rounds the exact answer. Round the numbers first.', 'M_EXACT_THEN_ROUND']]);
      return { question: `Which is the best estimate of ${a} × ${b} after rounding both numbers to the nearest ten?`, options, instruction: 'Choose the estimate.',
        hints: ['Write the rounded numbers.', 'Multiply the non-zero digits, then write the zeros.'], steps: [`${rnd(a, 10)} × ${rnd(b, 10)}.`, `Estimate ${commas(t)}.`] };
    } }),
  fam({ id: 'g5c.mul.est.spot', cs: `${M}ESTIMATE_PRODUCT_ROUND10`, form: 'spot', rung: 3,
    gen: () => {
      const a = randInt(2, 8) * 100 + randInt(4, 9) * 10 + randInt(5, 9), b = randInt(1, 6) * 10 + randInt(5, 9), p = person();
      return { question: `${p.name} estimates ${a} × ${b} by rounding to the nearest ten. Which step has the mistake?`,
        working: [{ text: `Step 1: ${a} rounds to ${rnd(a, 10)}.`, ok: true }, { text: `Step 2: ${b} has ones digit ${b % 10}, so it rounds down to ${fl(b, 10)}.`, ok: false }, { text: `Step 3: Estimate ${rnd(a, 10)} × ${fl(b, 10)} = ${commas(rnd(a, 10) * fl(b, 10))}.`, ok: true }],
        fix: `A ones digit of 5 or more rounds up, so ${b} rounds to ${rnd(b, 10)}. The estimate is ${commas(rnd(a, 10) * rnd(b, 10))}.`, mis: 'M_TRUNCATE_NOT_ROUND', hints: ['Which way does 5 or more round?'], steps: [`Estimate ${commas(rnd(a, 10) * rnd(b, 10))}.`] };
    } }),

  // ---------------------------------------------------------------- ESTIMATE_CHECK_REASONABLE
  fam({ id: 'g5c.mul.chk.reasonable', cs: `${M}ESTIMATE_CHECK_REASONABLE`, form: 'why', rung: 2,
    gen: () => {
      const a = randInt(12, 48), b = randInt(12, 48), ok = Math.random() < 0.5, p = person();
      const exact = a * b, shown = ok ? exact : Math.round(exact / 10), est = rnd(a, 10) * rnd(b, 10);
      if (a % 10 === 0 || b % 10 === 0 || shown === exact && !ok) return null;
      const options = mc(ok ? 'Yes, it is close to the estimate' : 'No, it is about ten times too small', [[ok ? 'No, it is not exactly the estimate' : 'Yes, it looks about right', ok ? 'An estimate is only close. The exact answer does not have to equal it.' : 'Compare the size with the estimate. It is far too small.', ok ? 'M_ESTIMATE_MUST_MATCH' : 'M_NO_SIZE_CHECK'], [ok ? 'No, the digits are different' : 'Yes, it has the same last digit', 'Compare the size of the exact answer with the estimate.', ok ? 'M_ESTIMATE_MUST_MATCH' : 'M_NO_SIZE_CHECK']]);
      return { question: `${p.name} says ${a} × ${b} = ${commas(shown)}. Rounded to tens, the sum is ${commas(est)}. Is the answer reasonable?`, options, instruction: 'Choose the best answer.',
        hints: ['Is the answer close to the estimate, or far away?', 'A product ten times too small is a sign of a missing zero.'], steps: [`Estimate ${commas(est)}.`, ok ? `${commas(exact)} is close to it.` : `${commas(exact)} is the right product, so ${commas(shown)} is too small.`] };
    } }),
  fam({ id: 'g5c.mul.chk.money', cs: `${M}ESTIMATE_CHECK_REASONABLE`, form: 'word', rung: 3,
    gen: () => {
      const n = randInt(12, 48), pr = randInt(11, 39) * 10 + randInt(0, 9), have = randInt(3, 6) * 1000, est = rnd(n, 10) * rnd(pr, 10);
      if (Math.abs(est - have) < 300) return null;
      const enough = have >= est + 200;
      const right = enough ? 1 : 0;
      return { question: `${person().name} has ${sh(have)} and wants to buy ${n} books at sh ${pr} each. Estimate by rounding both numbers to the nearest ten. If the money is enough, answer 1. If it is not enough, answer 0.`, answer: right,
        wrong: [[right ? 0 : 1, 'Compare the estimated cost with the money she has.', 'M_NO_SIZE_CHECK'], [2, 'The answer is 1 for enough or 0 for not enough.', 'M_NO_SIZE_CHECK'], [est, 'That is the estimated cost. Answer 1 or 0.', 'M_ESTIMATE_MUST_MATCH'], [have, 'Answer 1 for enough, 0 for not enough.', 'M_ESTIMATE_MUST_MATCH']],
        hints: ['Round each number to the nearest ten and multiply.', 'Is the money more than the estimated cost?'], steps: [`${n} → ${rnd(n, 10)}, ${pr} → ${rnd(pr, 10)}: about ${commas(est)}.`, enough ? 'The money is enough.' : 'The money is not enough.'], chk: (v) => v === (have >= est + 200 ? 1 : 0) };
    } }),
  fam({ id: 'g5c.mul.chk.wrong', cs: `${M}ESTIMATE_CHECK_REASONABLE`, form: 'direct', rung: 3,
    gen: () => {
      const a = randInt(12, 48), b = randInt(12, 48), t = a * b;
      if (a % 10 === 0 || b % 10 === 0) return null;
      const options = mc(commas(Math.round(t / 10)), [[commas(t), 'This is the exact product.', 'M_ESTIMATE_MUST_MATCH'], [commas(t + 8), 'This is close to the estimate, so it could be right.', 'M_ESTIMATE_MUST_MATCH'], [commas(t - 12), 'This is close to the estimate, so it could be right.', 'M_ESTIMATE_MUST_MATCH']]);
      return { question: `${person().name} multiplies ${a} by ${b}. Which of these answers is impossible if you round both numbers to tens first?`, options, instruction: 'Choose the answer that must be wrong.',
        hints: [`Round: ${rnd(a, 10)} × ${rnd(b, 10)}.`, 'Which answer is far from the estimate?'], steps: [`Estimate ${commas(rnd(a, 10) * rnd(b, 10))}.`, `${commas(Math.round(t / 10))} is far too small.`] };
    } }),

  // ---------------------------------------------------------------- MULT_PATTERN_EXTEND
  fam({ id: 'g5c.mul.pat.next', cs: `${M}MULT_PATTERN_EXTEND`, form: 'direct', rung: 2,
    gen: () => {
      const r = pick([2, 3, 5]), s = pick([2, 3, 4, 5]), t = [0, 1, 2, 3].map(i => s * r ** i), nxt = s * r ** 4;
      if (nxt > 1000) return null;
      const d = t[1] - t[0];
      const options = mc(String(nxt), [[String(t[3] + d), 'You kept adding the first gap. Test the rule on every pair: each term is multiplied.', 'M_ADDITIVE_RULE'], [String(t[3] * 2 === nxt ? t[3] * 3 : t[3] * 2), `Check what each term is multiplied by: ${t[1]} ÷ ${t[0]} is ${r}.`, 'M_ALWAYS_DOUBLE'], [String(nxt + r), 'Multiply the last term by the rule.', 'M_ADDITIVE_RULE']]);
      return { question: `A boda boda business grows like this each year: ${t.join(', ')}. What comes next?`, options, instruction: 'Choose the next number.',
        hints: ['Divide each term by the one before it.', 'Multiply the last term by that number.'], steps: [`${t[1]} ÷ ${t[0]} = ${r}. The rule is × ${r}.`, `${t[3]} × ${r} = ${nxt}.`] };
    } }),
  fam({ id: 'g5c.mul.pat.first', cs: `${M}MULT_PATTERN_EXTEND`, form: 'word', rung: 3,
    gen: () => {
      const r = pick([2, 3, 4, 5]), s = pick([2, 3, 4, 5, 6]), t = [0, 1, 2, 3].map(i => s * r ** i);
      if (t[3] > 1000) return null;
      return { question: `A trader's profit follows a multiplying pattern: ___, ${t[1]}, ${t[2]}, ${t[3]}. What is the missing first number?`, answer: s,
        wrong: [[t[1], 'That is the second term. Work backwards by dividing.', 'M_NO_REVERSE_FOR_EARLIER_TERM'], [t[1] * r, 'Going forward gives a later term, not an earlier one. Divide.', 'M_NO_REVERSE_FOR_EARLIER_TERM'], [t[1] - (t[2] - t[1]), 'The gaps are not equal. The terms are multiplied.', 'M_ADDITIVE_RULE'], [t[1] / (r + 1) > 0 ? Math.round(t[1] / (r + 1)) : 1, 'Check what the term is multiplied by.', 'M_ALWAYS_DOUBLE']],
        hints: ['Find what each term is multiplied by.', 'To go back one term, divide by that number.'], steps: [`${t[2]} ÷ ${t[1]} = ${r}, so the rule is × ${r}.`, `${t[1]} ÷ ${r} = ${s}.`], chk: (v) => v * r === t[1] };
    } }),
  fam({ id: 'g5c.mul.pat.table', cs: `${M}MULT_PATTERN_EXTEND`, form: 'table', rung: 2,
    gen: () => {
      const r = pick([2, 3, 4]), s = pick([2, 3, 5]), n = randInt(5, 6), t = [...Array(n)].map((_, i) => s * r ** i);
      if (t[n - 1] > 1000) return null;
      return { question: 'The table shows the number of mango seedlings in a nursery each year. Each year the number is multiplied by the same amount. How many seedlings will there be in the year marked with a question mark?', model: tbl(['Year', 'Seedlings'], t.map((v, i) => [`Year ${i + 1}`, i === n - 1 ? '?' : String(v)])), answer: t[n - 1],
        wrong: [[t[n - 2] + (t[1] - t[0]), 'You kept adding the first gap. Look at what each term is multiplied by.', 'M_ADDITIVE_RULE'], [t[n - 2] * 2 === t[n - 1] ? t[n - 2] * 3 : t[n - 2] * 2, 'Not every pattern doubles. Divide neighbouring terms.', 'M_ALWAYS_DOUBLE'], [t[n - 2], 'That is the year before the blank.', 'M_ADDITIVE_RULE'], [t[n - 1] + r, 'Multiply, do not add.', 'M_ADDITIVE_RULE']],
        hints: ['Divide one term by the one before it.', 'Multiply the last known term by that number.'], steps: [`Rule: × ${r}.`, `${t[n - 2]} × ${r} = ${t[n - 1]}.`], chk: (v) => v === t[n - 2] * r };
    } }),

  // ---------------------------------------------------------------- MULT_PATTERN_CREATE
  fam({ id: 'g5c.mul.cre.list', cs: `${M}MULT_PATTERN_CREATE`, form: 'direct', rung: 1,
    gen: () => {
      const r = pick([2, 3, 4]), s = pick([2, 3, 5]), good = [0, 1, 2, 3, 4].map(i => s * r ** i);
      if (good[4] > 1000) return null;
      const table = [...Array(5)].map((_, i) => s * (i + 1) * r / r * 0 + s + i * s * (r - 1) + 0);
      const bad = [s, s * r, s * r * r, s * r * r + 2, s * r * r * r + 2];
      const options = mc(good.join(', '), [[[s, s + r, s + 2 * r, s + 3 * r, s + 4 * r].join(', '), 'You added each time. Multiply the previous number each time.', 'M_TABLE_VS_REPEATED_MULTIPLY'], [bad.join(', '), 'Every step must multiply by the same number.', 'M_RULE_CHANGES_MIDWAY'], [[s, s * r, s * 2 * r, s * 3 * r, s * 4 * r].join(', '), 'This is not repeated multiplying. Multiply the previous term each time.', 'M_TABLE_VS_REPEATED_MULTIPLY']]);
      return { question: `Make a pattern of five numbers starting at ${s}. The rule is to multiply the previous number by ${r}. Which list is right?`, options, instruction: 'Choose the pattern.',
        hints: [`Write ${s} × ${r}, then multiply that answer by ${r}.`, 'Use the last number each time.'], steps: [`${good.map((v, i) => (i ? `${good[i - 1]} × ${r} = ${v}` : `${v}`)).join('; ')}.`, `Pattern: ${good.join(', ')}.`] };
    } }),
  fam({ id: 'g5c.mul.cre.stop', cs: `${M}MULT_PATTERN_CREATE`, form: 'word', rung: 2,
    gen: () => {
      const r = pick([2, 3, 5, 10]), s = pick([2, 3, 4, 5, 6, 7]), terms = []; for (let v = s; v <= 1000; v *= r) terms.push(v);
      if (terms.length < 3) return null;
      return { question: `A pattern starts at ${s} and multiplies by ${r} each time. Terms must not be more than 1000. How many terms can be written, counting ${s}?`, answer: terms.length,
        wrong: [[terms.length + 1, `${terms[terms.length - 1] * r} is more than 1000, so the pattern must stop before it.`, 'M_RULE_CHANGES_MIDWAY'], [terms.length - 1, `Count the starting number ${s} too.`, 'M_TABLE_VS_REPEATED_MULTIPLY'], [Math.floor(1000 / s), 'That counts multiples of the start, not repeated multiplying.', 'M_TABLE_VS_REPEATED_MULTIPLY'], [terms.length + 2, 'Stop when the next term would be more than 1000.', 'M_RULE_CHANGES_MIDWAY']],
        hints: ['Write the terms one at a time, multiplying the last term.', 'Stop before a term goes over 1000.'], steps: [`Terms: ${terms.join(', ')}.`, `${terms.length} terms.`], chk: (v) => s * r ** (v - 1) <= 1000 && s * r ** v > 1000 };
    } }),
  fam({ id: 'g5c.mul.cre.spot', cs: `${M}MULT_PATTERN_CREATE`, form: 'spot', rung: 3,
    gen: () => {
      const r = pick([2, 3]), s = pick([2, 3, 4]), g = [0, 1, 2, 3].map(i => s * r ** i), p = person();
      return { question: `${p.name} writes a pattern that starts at ${s} with the rule multiply by ${r}. Which step has the mistake?`,
        working: [{ text: `Step 1: ${s} × ${r} = ${g[1]}.`, ok: true }, { text: `Step 2: Next, add ${g[1] - s} to ${g[1]} to get ${g[1] + g[1] - s}.`, ok: false }, { text: `Step 3: So the pattern is ${s}, ${g[1]}, ${2 * g[1] - s}.`, ok: true }],
        fix: `The rule is multiply by ${r} every time. The pattern is ${g.join(', ')}.`, mis: 'M_RULE_CHANGES_MIDWAY', hints: ['Does the same rule hold between every pair of terms?'], steps: [`Correct pattern: ${g.join(', ')}.`] };
    } }),

  // ---------------------------------------------------------------- DIV_3DIGIT_BY_1DIGIT
  fam({ id: 'g5c.div.d1.zero', cs: `${D}DIV_3DIGIT_BY_1DIGIT`, form: 'word', rung: 2,
    gen: () => {
      const d = randInt(3, 9), q = randInt(1, 9) * 100 + randInt(1, 9), n = q * d;
      if (n > 999) return null;
      const t = Number(String(q).replace(/0/g, ''));
      return { question: `${person().name} has ${n} oranges to put equally into ${d} crates. How many oranges go into each crate?`, answer: q,
        wrong: [[Number(String(q).replace(/0/g, '')), 'When the divisor does not go into a digit, you must write 0 in the quotient.', 'M_ZERO_QUOTIENT_DROPPED'], [Math.floor(q / 10) * 10 + (q % 10), 'Check how many digits the answer should have. 600 ÷ 6 is about 100.', 'M_ZERO_QUOTIENT_DROPPED'], [n * d, 'Sharing means divide, not multiply.', 'M_SHORT_DIV_NO_CARRY'], [q + d, 'Check by multiplying back.', 'M_REMAINDER_TOO_BIG']],
        hints: ['Estimate first: about how many in each crate?', 'Write a digit in the quotient above every digit of the oranges.'], steps: [`${n} ÷ ${d}: estimate ${Math.round(n / 100) * 100} ÷ ${d}.`, `${q} oranges in each crate.`], chk: (v) => v * d === n };
    } }),
  fam({ id: 'g5c.div.d1.remainder', cs: `${D}DIV_3DIGIT_BY_1DIGIT`, form: 'direct', rung: 2,
    gen: () => {
      const d = randInt(4, 9), n = randInt(120, 999), q = Math.floor(n / d), r = n % d;
      if (r === 0 || q < 10) return null;
      const right = `${q} remainder ${r}`;
      const options = mc(right, [[`${q - 1} remainder ${r + d}`, `The remainder ${r + d} is not smaller than ${d}. Take one more group.`, 'M_REMAINDER_TOO_BIG'], [`${q + 1} remainder ${r}`, 'Check by multiplying the quotient by the divisor and adding the remainder.', 'M_SHORT_DIV_NO_CARRY'], [`${Math.floor(n / (d + 1))} remainder ${n % (d + 1)}`, 'Make sure you are dividing by the divisor in the question.', 'M_SHORT_DIV_NO_CARRY']]);
      return { question: `Which is ${n} shared into groups of ${d}, with what is left over?`, options, instruction: 'Choose the quotient and remainder.',
        hints: ['The remainder must be smaller than the divisor.', 'Check: quotient × divisor + remainder = the number.'], steps: [`${q} × ${d} = ${q * d}.`, `${n} − ${q * d} = ${r}, so ${right}.`] };
    } }),
  fam({ id: 'g5c.div.d1.spot', cs: `${D}DIV_3DIGIT_BY_1DIGIT`, form: 'spot', rung: 3,
    gen: () => {
      const d = randInt(3, 6), q = randInt(100, 300), n = q * d, p = person();
      const wrongQ = Number(dg(n).map(x => Math.floor(x / d)).join(''));
      if (wrongQ === q || n > 999 || wrongQ < 10) return null;
      return { question: `${p.name} uses short division to work out ${n} ÷ ${d}. Which step has the mistake?`,
        working: [{ text: `Step 1: Divide each digit of ${n} by ${d} in turn.`, ok: true }, { text: 'Step 2: When a digit does not divide exactly, drop the leftover and move to the next digit without carrying it.', ok: false }, { text: `Step 3: The quotient is ${wrongQ}.`, ok: true }],
        fix: `The leftover from one digit must be carried to the next. The correct quotient is ${q}.`, mis: 'M_SHORT_DIV_NO_CARRY', hints: ['What should happen to a remainder in short division?'], steps: [`${n} ÷ ${d} = ${q}.`] };
    } }),

  // ---------------------------------------------------------------- DIV_3DIGIT_BY_2DIGIT
  fam({ id: 'g5c.div.d2.long', cs: `${D}DIV_3DIGIT_BY_2DIGIT`, form: 'word', rung: 2,
    gen: () => {
      const d = randInt(12, 48), q = randInt(12, 40), n = q * d;
      if (n > 999 || n < 100) return null;
      return { question: `A farm in ${place()} packs ${n} eggs into trays that each hold ${d} eggs. How many trays are filled?`, answer: q,
        wrong: [[q - 1, `One tray fewer leaves ${d} eggs, which is a whole tray. Try one more.`, 'M_TRIAL_DIGIT_TOO_SMALL'], [Math.floor(q / 10), 'Check that every digit of the eggs gets a digit in the answer. Compare with the estimate.', 'M_TRAILING_ZERO_DROPPED'], [n - d, 'Share the total into groups. Do not subtract.', 'M_TRIAL_DIGIT_TOO_SMALL'], [q + 1, 'Multiply back to check.', 'M_TRIAL_DIGIT_TOO_SMALL']],
        hints: ['Write a short list of multiples of the tray size.', 'Find how many fit into the eggs.'], steps: [`${d} × ${q} = ${n}.`, `${q} trays.`], chk: (v) => v * d === n };
    } }),
  fam({ id: 'g5c.div.d2.zero', cs: `${D}DIV_3DIGIT_BY_2DIGIT`, form: 'direct', rung: 3,
    gen: () => {
      const d = randInt(12, 49), q = randInt(2, 9) * 10, n = q * d;
      if (n > 999) return null;
      const options = mc(String(q), [[String(q / 10), 'You left off the last zero of the answer. Bring down every digit. Compare with the estimate.', 'M_TRAILING_ZERO_DROPPED'], [String(q * 10), 'That is ten times too big. Estimate first.', 'M_TRAILING_ZERO_DROPPED'], [String(q - 1) + ' remainder ' + d, 'A remainder as big as the divisor means one more group fits.', 'M_TRIAL_DIGIT_TOO_SMALL']]);
      return { question: `Which is the answer when ${n} is divided into groups of ${d}, with nothing left over?`, options, instruction: 'Choose the quotient.',
        hints: [`Estimate: ${n} ÷ ${Math.round(d / 10) * 10}.`, 'Multiply back to check.'], steps: [`${d} × ${q} = ${n}.`, `So ${n} ÷ ${d} = ${q}.`] };
    } }),
  fam({ id: 'g5c.div.d2.spot', cs: `${D}DIV_3DIGIT_BY_2DIGIT`, form: 'spot', rung: 3,
    gen: () => {
      const d = randInt(12, 40), q = randInt(12, 30), n = q * d, p = person();
      if (n > 999) return null;
      return { question: `${p.name} works out ${n} ÷ ${d} by long division. Which step has the mistake?`,
        working: [{ text: `Step 1: ${d} × ${q - 1} = ${d * (q - 1)}, which is close to ${n}.`, ok: true }, { text: `Step 2: The remainder is ${d}, and that is allowed.`, ok: false }, { text: `Step 3: So ${n} ÷ ${d} = ${q - 1} remainder ${d}.`, ok: true }],
        fix: `A remainder cannot equal the divisor. One more group of ${d} fits, so ${n} ÷ ${d} = ${q}.`, mis: 'M_TRIAL_DIGIT_TOO_SMALL', hints: ['Is the remainder smaller than the divisor?'], steps: [`${n} ÷ ${d} = ${q}.`] };
    } }),

  // ---------------------------------------------------------------- DIV_WORD_PROBLEMS
  fam({ id: 'g5c.div.wp.roundup', cs: `${D}DIV_WORD_PROBLEMS`, form: 'word', rung: 2,
    gen: () => {
      const cap = randInt(12, 48), n = randInt(200, 700);
      if (n % cap === 0) return null;
      const q = Math.floor(n / cap);
      return { question: `${n} pupils are going on a trip to the Nairobi National Park. Each matatu carries ${cap} pupils. How many matatus are needed?`, answer: q + 1,
        wrong: [[q, 'Some pupils would be left behind. They need one more matatu.', 'M_REMAINDER_NOT_INTERPRETED'], [n % cap, 'That is the number of pupils left over, not the number of matatus.', 'M_GIVES_QUOTIENT_NOT_REMAINDER'], [n * cap, 'Each matatu holds a number of pupils. Divide.', 'M_KEYWORD_EACH_MEANS_MULTIPLY'], [q + 2, 'Only one more matatu is needed for the leftover pupils.', 'M_REMAINDER_NOT_INTERPRETED']],
        hints: ['Divide the pupils by what one matatu carries.', 'What happens to the pupils left over?'], steps: [`${n} ÷ ${cap} = ${q} remainder ${n % cap}.`, `The ${n % cap} left over need one more matatu: ${q + 1}.`], chk: (v) => (v - 1) * cap < n && v * cap >= n };
    } }),
  fam({ id: 'g5c.div.wp.left', cs: `${D}DIV_WORD_PROBLEMS`, form: 'direct', rung: 2,
    gen: () => {
      const price = randInt(12, 48) * 5, have = randInt(300, 900), q = Math.floor(have / price), r = have % price;
      if (q < 3 || r === 0) return null;
      const options = mc(sh(r), [[sh(q), 'That is how many she can buy. The question asks how much money is left.', 'M_GIVES_QUOTIENT_NOT_REMAINDER'], [sh(have), 'That is all she started with.', 'M_GIVES_QUOTIENT_NOT_REMAINDER'], [sh(price - r), 'That is how much more she would need for one more.', 'M_REMAINDER_NOT_INTERPRETED']]);
      return { question: `${person().name} has ${sh(have)}. Exercise books cost ${sh(price)} each. She buys as many as she can. How much money is left?`, options, instruction: 'Choose the amount left.',
        hints: ['Divide the money by the price of one book.', 'The remainder is the money left.'], steps: [`${have} ÷ ${price} = ${q} remainder ${r}.`, `She buys ${q} books and has ${sh(r)} left.`] };
    } }),
  fam({ id: 'g5c.div.wp.choose', cs: `${D}DIV_WORD_PROBLEMS`, form: 'why', rung: 3,
    gen: () => {
      const n = randInt(240, 780), g = randInt(12, 36);
      const kind = pick(['crates', 'each']);
      const options = mc(`${n} ÷ ${g}`, [[`${n} × ${g}`, 'Each crate holds a number of mangoes, so the number of crates is fewer than the mangoes. Divide.', 'M_KEYWORD_EACH_MEANS_MULTIPLY'], [`${n} + ${g}`, 'Nothing is combined here. We are finding how many groups fit.', 'M_KEYWORD_EACH_MEANS_MULTIPLY'], [`${n} − ${g}`, 'Taking away once finds what is left after one crate, not how many crates.', 'M_KEYWORD_EACH_MEANS_MULTIPLY']]);
      return { question: `A farmer in Murang'a packs ${n} mangoes into crates. Each crate holds ${g} mangoes. Which number sentence finds how many crates are filled?`, options, instruction: 'Choose the number sentence.',
        hints: ['Should the answer be more or fewer than the mangoes?', 'How many groups of the crate size fit?'], steps: ['Fitting groups into a total is division.', `${n} ÷ ${g} = ${Math.floor(n / g)} remainder ${n % g}.`] };
    } }),

  // ---------------------------------------------------------------- MULT_DIV_FACT_FAMILIES
  fam({ id: 'g5c.div.fam.write', cs: `${D}MULT_DIV_FACT_FAMILIES`, form: 'direct', rung: 1,
    gen: () => {
      const a = randInt(12, 40), b = randInt(3, 9), c = a * b;
      const options = mc(`${c} ÷ ${b} = ${a}`, [[`${b} ÷ ${c} = ${a}`, 'In a division fact the biggest number, the product, is divided. Order matters.', 'M_DIVISION_COMMUTATIVE'], [`${a} ÷ ${c} = ${b}`, 'The product is divided by a factor, not the other way round.', 'M_DIVISION_COMMUTATIVE'], [`${a} ÷ ${b} = ${c}`, 'The product comes first in the division.', 'M_DIVISION_COMMUTATIVE']]);
      return { question: `Given ${a} × ${b} = ${c}, which division fact belongs to the same family?`, options, instruction: 'Choose the division fact.',
        hints: ['The product goes at the front of a division.', 'Divide it by one of the factors.'], steps: [`${a} × ${b} = ${c}.`, `So ${c} ÷ ${b} = ${a} and ${c} ÷ ${a} = ${b}.`] };
    } }),
  fam({ id: 'g5c.div.fam.missing', cs: `${D}MULT_DIV_FACT_FAMILIES`, form: 'word', rung: 2,
    gen: () => {
      const b = randInt(6, 12), q = randInt(12, 90), n = b * q, p = person();
      if (n > 999) return null;
      return { question: `${p.name} thinks of a number. When ${p.she} divides it by ${b}, the answer is ${q}. What was the number?`, answer: n,
        wrong: [[q / b > 0 ? Math.round((q / b) * 100) / 100 : 1, `Do not divide ${q} by ${b}. The missing number is what ${q} groups of ${b} make.`, 'M_MISSING_DIVIDEND_DIVIDES'], [q + b, 'Use the inverse operation. The opposite of dividing by ' + b + ' is multiplying by ' + b + '.', 'M_MISSING_DIVIDEND_DIVIDES'], [q - b, 'Use the inverse operation: multiply.', 'M_MISSING_DIVIDEND_DIVIDES'], [n + b, 'Check by dividing your answer by ' + b + '.', 'M_MISSING_DIVIDEND_DIVIDES']],
        hints: [`Read it as: ${q} groups of ${b} make what?`, 'Use the inverse operation, multiplication.'], steps: [`□ ÷ ${b} = ${q}, so □ = ${q} × ${b}.`, `□ = ${n}.`], chk: (v) => v / b === q };
    } }),
  fam({ id: 'g5c.div.fam.tf', cs: `${D}MULT_DIV_FACT_FAMILIES`, form: 'why', rung: 3,
    gen: () => {
      const a = randInt(12, 40), b = randInt(3, 9), c = a * b, p = person();
      const options = mc(`False. Order matters in division, unlike multiplication`, [[`True. Division works in any order, like multiplication`, 'Multiplication works in any order, but division does not.', 'M_DIVISION_COMMUTATIVE'], [`True. Both sides give ${a}`, `${b} ÷ ${c} is less than 1, not ${a}.`, 'M_DIVISION_COMMUTATIVE']]);
      return { question: `${p.name} says that because ${a} × ${b} = ${b} × ${a}, we also have ${c} ÷ ${b} = ${b} ÷ ${c}. Is this true or false?`, options, instruction: 'Choose true or false, with the reason.',
        hints: ['Is a big number divided by a small one the same as a small one divided by a big one?', 'Try it with real numbers.'], steps: [`${c} ÷ ${b} = ${a}.`, `${b} ÷ ${c} is a small fraction, not ${a}.`] };
    } }),

  // ---------------------------------------------------------------- CHECK_DIVISION_BY_MULT
  fam({ id: 'g5c.div.chk.verify', cs: `${D}CHECK_DIVISION_BY_MULT`, form: 'why', rung: 2,
    gen: () => {
      const d = randInt(7, 15), q = randInt(15, 60), r = randInt(1, d - 1), n = d * q + r;
      if (n > 999) return null;
      const options = mc(`Yes: ${d} × ${q} = ${d * q}, and ${d * q} + ${r} = ${n}`, [[`No, because ${d} × ${q} = ${d * q}, not ${n}`, 'You must also add the remainder. Groups × size + leftover = total.', 'M_CHECK_FORGETS_REMAINDER'], [`No, because ${d} + ${q} + ${r} is not ${n}`, 'The check uses multiplying and adding the remainder, not adding all three.', 'M_CHECK_FORGETS_REMAINDER']]);
      return { question: `${person().name} says ${n} ÷ ${d} = ${q} remainder ${r}. Check by multiplying. Is the answer correct?`, options, instruction: 'Choose the correct check.',
        hints: ['Multiply the quotient by the divisor.', 'Then add the remainder.'], steps: [`${d} × ${q} = ${d * q}.`, `${d * q} + ${r} = ${n}. It matches.`] };
    } }),
  fam({ id: 'g5c.div.chk.dividend', cs: `${D}CHECK_DIVISION_BY_MULT`, form: 'word', rung: 2,
    gen: () => {
      const d = randInt(7, 15), q = randInt(15, 60), r = randInt(1, d - 1), n = d * q + r;
      if (n > 999) return null;
      return { question: `A number was divided by ${d}. The quotient was ${q} and the remainder was ${r}. What was the number divided?`, answer: n,
        wrong: [[d * q, 'The remainder was left over. Add it back.', 'M_CHECK_FORGETS_REMAINDER'], [q + d + r, 'Multiply the groups by their size, then add the remainder.', 'M_CHECK_FORGETS_REMAINDER'], [d * q - r, 'The leftover is added, not taken away.', 'M_CHECK_FORGETS_REMAINDER'], [q * r + d, 'Multiply the quotient by the divisor.', 'M_CHECK_FORGETS_REMAINDER']],
        hints: ['Groups × size + leftover = total.', 'Multiply first, then add the remainder.'], steps: [`${q} × ${d} = ${q * d}.`, `${q * d} + ${r} = ${n}.`], chk: (v) => Math.floor(v / d) === q && v % d === r };
    } }),
  fam({ id: 'g5c.div.chk.which', cs: `${D}CHECK_DIVISION_BY_MULT`, form: 'direct', rung: 3,
    gen: () => {
      const d = randInt(7, 15), n = randInt(150, 900), q = Math.floor(n / d), r = n % d;
      if (r === 0) return null;
      const options = mc(`${q} remainder ${r}`, [[`${q} remainder ${r + 1 < d ? r + 1 : r - 1}`, `Check: ${d} × ${q} + that remainder is not ${n}.`, 'M_CHECK_FORGETS_REMAINDER'], [`${q + 1} remainder ${r}`, `Check: ${d} × ${q + 1} + ${r} is too big.`, 'M_CHECK_FORGETS_REMAINDER'], [`${q - 1} remainder ${r + d}`, 'The remainder must be smaller than the divisor.', 'M_CHECK_FORGETS_REMAINDER']]);
      return { question: `Use multiplication to check which answer is right for ${n} ÷ ${d}.`, options, instruction: 'Choose the correct answer.',
        hints: ['Multiply quotient by divisor, then add the remainder.', 'The result must be the number divided.'], steps: [`${d} × ${q} = ${d * q}.`, `${d * q} + ${r} = ${n}.`] };
    } }),

  // ---------------------------------------------------------------- DIV_BY_1000
  fam({ id: 'g5c.div.k.grams', cs: `${D}DIV_BY_1000`, form: 'word', rung: 1,
    gen: () => {
      const g = pick([45, 60, 75, 125, 250, 375, 480, 750, 905, 12]), kg = g / 1000;
      return { question: `A packet of royco weighs ${g} g. Write its mass in kilograms. Use ${g} ÷ 1000.`, answer: kg,
        wrong: [[g / 100, 'That moves the point only two places. Dividing by 1000 moves it three places.', 'M_DIV1000_DECIMAL_PLACES'], [0, 'A smaller number can be divided by a bigger one. The answer is a part of a kilogram.', 'M_SMALLER_CANNOT_DIVIDE_BIGGER'], [g * 1000, 'Dividing makes the number smaller, not bigger.', 'M_DIV1000_MULTIPLIES'], [g / 10000, 'That moves the point four places. Move it three.', 'M_DIV1000_DECIMAL_PLACES']],
        hints: ['Slide each digit three columns to the right.', 'Fill empty columns with zeros.'], steps: [`${g} ÷ 1000: three places to the right.`, `${kg} kg.`], chk: (v) => Math.round(v * 1000) === g };
    } }),
  fam({ id: 'g5c.div.k.which', cs: `${D}DIV_BY_1000`, form: 'direct', rung: 2,
    gen: () => {
      const n = pick([125, 45, 308, 60, 750, 9, 540, 206]), r = n / 1000;
      const options = mc(String(r), [[String(n / 100), 'Move the decimal point three places, not two.', 'M_DIV1000_DECIMAL_PLACES'], [String(n * 1000), 'Dividing makes the number smaller.', 'M_DIV1000_MULTIPLIES'], ['0', 'The answer is a part of 1, not zero.', 'M_SMALLER_CANNOT_DIVIDE_BIGGER']]);
      return { question: `Which number is the value of ${n} ÷ 1000? Choose the answer.`, options, instruction: 'Choose the value.',
        hints: ['Will the answer be bigger or smaller than 1?', 'Shift the digits three places to the right.'], steps: [`${n} ÷ 1000: shift three places.`, `${r}.`] };
    } }),
  fam({ id: 'g5c.div.k.table', cs: `${D}DIV_BY_1000`, form: 'table', rung: 2,
    gen: () => {
      const a = pick([250, 125, 60, 480]), b = pick([300, 45, 905, 750]);
      if (a === b) return null;
      return { question: 'A shop sells these items. Each mass in grams is divided by 1000 to give kilograms. What is the mass of the first item in kilograms?', model: tbl(['Item', 'Mass in grams'], [['Salt', String(a)], ['Spice', String(b)]]), answer: a / 1000,
        wrong: [[a / 100, 'Divide by 1000, which moves three places.', 'M_DIV1000_DECIMAL_PLACES'], [0, 'A part of a kilogram is not zero.', 'M_SMALLER_CANNOT_DIVIDE_BIGGER'], [a * 1000, 'Dividing makes the number smaller.', 'M_DIV1000_MULTIPLIES'], [b / 1000, 'That is the second item.', 'M_DIV1000_DECIMAL_PLACES']],
        hints: ['Look at the first row of the table.', 'Divide by 1000.'], steps: [`${a} ÷ 1000 = ${a / 1000}.`, `${a / 1000} kg.`], chk: (v) => Math.round(v * 1000) === a };
    } }),

  // ---------------------------------------------------------------- ESTIMATE_QUOTIENTS
  fam({ id: 'g5c.div.est.word', cs: `${D}ESTIMATE_QUOTIENTS`, form: 'word', rung: 2,
    gen: () => {
      const n = randInt(300, 960), d = randInt(1, 4) * 10 + randInt(5, 9), est = rnd(n, 10) / rnd(d, 10);
      if (!Number.isInteger(est)) return null;
      return { question: `${person().name} has sh ${n} to share among ${d} children. About how much does each child get? Estimate by rounding both numbers to the nearest ten, then divide.`, answer: est,
        wrong: [[Math.floor(n / d), 'You worked out the exact quotient. Estimate: round first.', 'M_ESTIMATE_COMPUTED_EXACTLY'], [rnd(n, 10) / fl(d, 10), 'A ones digit of 5 or more rounds up, including in the divisor.', 'M_ROUNDS_DIVISOR_WRONG'], [rnd(n, 10) / d, 'Round the divisor too.', 'M_ESTIMATE_COMPUTED_EXACTLY'], [est * 10, 'Check the number of zeros.', 'M_ROUNDS_DIVISOR_WRONG']],
        hints: ['Round the shillings and the number of children to the nearest ten.', 'Divide the rounded numbers.'], steps: [`${n} → ${rnd(n, 10)} and ${d} → ${rnd(d, 10)}.`, `${rnd(n, 10)} ÷ ${rnd(d, 10)} = ${est}.`], chk: (v) => v * rnd(d, 10) === rnd(n, 10) };
    } }),
  fam({ id: 'g5c.div.est.best', cs: `${D}ESTIMATE_QUOTIENTS`, form: 'direct', rung: 2,
    gen: () => {
      const n = randInt(300, 960), d = randInt(1, 4) * 10 + randInt(5, 9), est = rnd(n, 10) / rnd(d, 10);
      if (!Number.isInteger(est) || est < 5) return null;
      const options = mc(`${rnd(n, 10)} ÷ ${rnd(d, 10)} = ${est}`, [[`${rnd(n, 10)} ÷ ${fl(d, 10)} = ${rnd(n, 10) / fl(d, 10)}`, `${d} rounds up to ${rnd(d, 10)}.`, 'M_ROUNDS_DIVISOR_WRONG'], [`${n} ÷ ${d} = ${Math.floor(n / d)} remainder ${n % d}`, 'That is the exact working, not an estimate.', 'M_ESTIMATE_COMPUTED_EXACTLY'], [`${rnd(n, 10)} ÷ ${d} = about ${Math.round(rnd(n, 10) / d)}`, 'Round both numbers.', 'M_ESTIMATE_COMPUTED_EXACTLY']].filter(w => w[0] !== `${rnd(n, 10)} ÷ ${rnd(d, 10)} = ${est}`));
      return { question: `Which shows the correct estimate of ${n} ÷ ${d} with both numbers rounded to the nearest ten?`, options, instruction: 'Choose the estimate.',
        hints: ['Round each number to the nearest ten.', 'Divide the rounded numbers.'], steps: [`${n} → ${rnd(n, 10)}, ${d} → ${rnd(d, 10)}.`, `${rnd(n, 10)} ÷ ${rnd(d, 10)} = ${est}.`] };
    } }),
  fam({ id: 'g5c.div.est.reasonable', cs: `${D}ESTIMATE_QUOTIENTS`, form: 'why', rung: 3,
    gen: () => {
      const n = randInt(300, 960), d = randInt(1, 4) * 10 + randInt(5, 9), est = rnd(n, 10) / rnd(d, 10), ok = Math.random() < 0.5;
      if (!Number.isInteger(est) || est < 4) return null;
      const shown = ok ? Math.floor(n / d) : Math.floor(n / d) * 10;
      const options = mc(ok ? 'Reasonable: it is close to the estimate' : 'Not reasonable: it is about ten times too big', [[ok ? 'Not reasonable: it is not exactly the estimate' : 'Reasonable: it is a whole number', 'Compare the size with the estimate.', 'M_ESTIMATE_COMPUTED_EXACTLY'], [ok ? 'Not reasonable: the estimate has different digits' : 'Reasonable: it has the same digits as the estimate', 'Compare the size, not the digits.', 'M_ESTIMATE_COMPUTED_EXACTLY']]);
      return { question: `${person().name} says ${n} ÷ ${d} is about ${shown}. Rounding both numbers to tens gives ${est}. Is that sensible?`, options, instruction: 'Choose the best answer.',
        hints: ['Is the answer near the estimate?', 'An answer ten times too big is a sign of a misplaced digit.'], steps: [`Estimate ${est}.`, ok ? `${shown} is close.` : `${shown} is far larger.`] };
    } }),

  // ---------------------------------------------------------------- ORDER_OF_OPERATIONS
  fam({ id: 'g5c.ops.order.value', cs: `${D}ORDER_OF_OPERATIONS`, form: 'word', rung: 1,
    gen: () => {
      const c = randInt(2, 9), b = c * randInt(2, 9), a = randInt(10, 60), t = a + b / c;
      return { question: `A teacher writes the expression ${a} + ${b} ÷ ${c} on the board. What is its value?`, answer: t,
        wrong: [[(a + b) / c, 'Division comes before addition. Do the division first.', 'M_LEFT_TO_RIGHT_ALL'], [a + b * c, 'The sign is ÷, not ×.', 'M_MULTIPLY_BEFORE_DIVIDE'], [a - b / c, 'The sign is +.', 'M_LEFT_TO_RIGHT_ALL'], [a + b + c, 'The sign is ÷.', 'M_LEFT_TO_RIGHT_ALL']].filter(w => Number.isFinite(w[0])),
        hints: ['Multiplication and division come before addition and subtraction.', 'Circle the ÷ part and work it out first.'], steps: [`${b} ÷ ${c} = ${b / c}.`, `${a} + ${b / c} = ${t}.`], chk: (v) => v - a === b / c };
    } }),
  fam({ id: 'g5c.ops.order.addsub', cs: `${D}ORDER_OF_OPERATIONS`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(40, 90), b = randInt(10, 30), c = randInt(5, 25), t = a - b + c;
      const options = mc(String(t), [[String(a - (b + c)), 'Addition and subtraction go left to right. Do not add first.', 'M_ADD_BEFORE_SUBTRACT'], [String(a + b + c), 'Check the signs.', 'M_ADD_BEFORE_SUBTRACT'], [String(a + b - c), 'Check which amounts go out and which come in.', 'M_ADD_BEFORE_SUBTRACT']]);
      return { question: `Wanjiku had sh ${a}, spent sh ${b}, then was given sh ${c}. Which value does the expression ${a} − ${b} + ${c} have?`, options, instruction: 'Choose the value.',
        hints: ['Tell it as a story, left to right.', 'Subtract first, then add.'], steps: [`${a} − ${b} = ${a - b}.`, `${a - b} + ${c} = ${t}.`] };
    } }),
  fam({ id: 'g5c.ops.order.spot', cs: `${D}ORDER_OF_OPERATIONS`, form: 'spot', rung: 3,
    gen: () => {
      const c = randInt(2, 6), b = c * randInt(2, 6), a = randInt(10, 40), p = person();
      return { question: `${p.name} works out ${a} + ${b} ÷ ${c}. Which step has the mistake?`,
        working: [{ text: `Step 1: Work from left to right.`, ok: false }, { text: `Step 2: ${a} + ${b} = ${a + b}.`, ok: true }, { text: `Step 3: ${a + b} ÷ ${c} = ${(a + b) / c}.`, ok: true }],
        fix: `Division comes before addition. ${b} ÷ ${c} = ${b / c}, then ${a} + ${b / c} = ${a + b / c}.`, mis: 'M_LEFT_TO_RIGHT_ALL', hints: ['Which operation should be done first?'], steps: [`${a} + ${b / c} = ${a + b / c}.`] };
    } }),

  // ---------------------------------------------------------------- COMBINED_OPS_PROBLEMS
  fam({ id: 'g5c.ops.prob.change', cs: `${D}COMBINED_OPS_PROBLEMS`, form: 'word', rung: 2,
    gen: () => {
      const k = randInt(3, 9), pr = pick([120, 150, 180, 140, 160]), pay = 1000, cost = k * pr;
      if (cost >= pay) return null;
      return { question: `${person().name} bought ${k} kg of sugar at sh ${pr} per kg and paid with a sh ${pay} note. How much change did ${'she'} get?`, answer: pay - cost,
        wrong: [[cost, 'That is the cost. The question asks for the change.', 'M_STOPS_AFTER_ONE_STEP'], [pay + cost, 'Change is what is left. Subtract.', 'M_STOPS_AFTER_ONE_STEP'], [pay - pr, 'Find the cost of all the kilograms first.', 'M_STOPS_AFTER_ONE_STEP'], [pay - cost + 100, 'Check the multiplication.', 'M_STOPS_AFTER_ONE_STEP']],
        hints: ['First find the cost of all the sugar.', 'Then take the cost from sh 1000.'], steps: [`Cost: ${k} × ${pr} = ${cost}.`, `Change: ${pay} − ${cost} = ${pay - cost}.`], chk: (v) => v + k * pr === pay };
    } }),
  fam({ id: 'g5c.ops.prob.share', cs: `${D}COMBINED_OPS_PROBLEMS`, form: 'steps', rung: 3,
    gen: () => {
      const g = randInt(3, 6), each = randInt(4, 9), give = randInt(1, 3), n = g * each, p = person();
      if (give >= each) return null;
      return { question: `${p.name}, a teacher, has ${n} pencils for ${g} groups of pupils. The pencils are shared out equally. Later each group returns ${give} of them.`,
        parts: [{ prompt: 'How many pencils does each group get at first?', answer: each, hint: 'Share the pencils equally.', wrong: [[n * g, 'Sharing means divide.', 'M_STOPS_AFTER_ONE_STEP'], [n - g, 'Equal sharing is division.', 'M_EXPRESSION_ORDER_SCRAMBLED'], [each + give, 'Check the division.', 'M_STOPS_AFTER_ONE_STEP']] },
          { prompt: 'How many pencils does each group have after giving some away?', answer: each - give, hint: 'Take away what each group gave.', wrong: [[each, 'That is the number before they gave some away.', 'M_STOPS_AFTER_ONE_STEP'], [n / (g - give), 'Share first, then take away.', 'M_EXPRESSION_ORDER_SCRAMBLED'], [each + give, 'They gave pencils away, so subtract.', 'M_STOPS_AFTER_ONE_STEP']] }],
        steps: [`${n} ÷ ${g} = ${each}.`, `${each} − ${give} = ${each - give}.`], chk: (x, v) => v[0] * g === n && v[0] - give === v[1] };
    } }),
  fam({ id: 'g5c.ops.prob.expr', cs: `${D}COMBINED_OPS_PROBLEMS`, form: 'why', rung: 3,
    gen: () => {
      const g = randInt(3, 6), each = randInt(4, 9), give = randInt(1, 3), n = g * each;
      if (give >= each) return null;
      const options = mc(`${n} ÷ ${g} − ${give}`, [[`${n} ÷ (${g} − ${give})`, 'The groups do not change. Share first, then take away.', 'M_EXPRESSION_ORDER_SCRAMBLED'], [`${n} − ${g} ÷ ${give}`, 'Write the operations in the order of the story: share, then subtract.', 'M_EXPRESSION_ORDER_SCRAMBLED'], [`${n} + ${g} − ${give}`, 'Sharing equally is division.', 'M_STOPS_AFTER_ONE_STEP']]);
      return { question: `Choose the expression for this story: ${n} pencils are shared equally among ${g} groups, and each group then hands in ${give}.`, options, instruction: 'Choose the expression.',
        hints: ['What happens first in the story?', 'Write the steps in that order.'], steps: [`${n} ÷ ${g} = ${each}.`, `${each} − ${give} = ${each - give}.`] };
    } }),
];
