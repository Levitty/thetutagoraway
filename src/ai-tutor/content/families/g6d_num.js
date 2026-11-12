// ============================================================================
// GRADE 6 MATHS, NUMBERS (12 Nov 2026): second families for skills that had one structure, and first families for skills with none.
// Written against curriculum/mathematics/g6.json (curriculumMap.g6.js). DRAFT: off for children until a Kenyan maths teacher signs them off.
// ============================================================================
import { fam, ask, spot, randInt, pick, shuffle, commas, person, sh, price, distinct, mc } from './g6d_lib.js';

const W = 'NUMBER.WHOLE_NUMBERS.', M = 'NUMBER.MULTIPLICATION.', D = 'NUMBER.DIVISION.', C = 'NUMBER.DECIMALS.';
const PLACES = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions'];
const digitsOf7 = () => { const d = [randInt(1, 9)]; for (let i = 1; i < 7; i++) d.push(randInt(0, 9)); return d; };   // millions first

export const FAMILIES = [
  // ------------------------------------------------------------ WHOLE NUMBERS
  fam({ id: 'g6d.whole.which-place', cs: `${W}PLACE_VALUE_MILLIONS`, form: 'direct', rung: 1,
    gen: () => {
      const d = digitsOf7(), pos = randInt(2, 6), idx = 6 - pos;   // idx from the left
      if (d[idx] === 0 || d.filter(x => x === d[idx]).length > 1 || d.slice(idx + 1).every(x => x !== 0)) return null;   // the digit is not zero, and a zero lies to its right
      const N = Number(d.join('')), right = PLACES[pos], left = PLACES[idx], low = PLACES[pos - 1], high = PLACES[pos + 1];
      if (!high || !distinct(right, left, low, high)) return null;
      const p = person();
      const a = ask(right, [[left, 'Places are counted from the ones place on the right, not from the left of the number.', 'M_COUNT_FROM_LEFT'], [low, 'A zero is a place too. Count the zeros as places.', 'M_ZERO_NOT_A_PLACE'], [high, 'That is one place too far. Count again from the ones place.', 'M_COUNT_FROM_LEFT']],
        `The population of a county is ${commas(N)}. ${p.name} underlines the digit ${d[idx]}. In which place is that digit?`, ['Start at the ones place on the right and name each place going left.', 'Zeros are places too.'], [`The places from the right are ones, tens, hundreds, thousands, ten thousands, hundred thousands, millions.`, `The digit ${d[idx]} is in the ${right} place.`]);
      return a;
    } }),
  fam({ id: 'g6d.whole.total-value', cs: `${W}TOTAL_VALUE_MILLIONS`, form: 'word', rung: 2,
    gen: () => {
      const d = digitsOf7(), pos = randInt(2, 6), idx = 6 - pos;
      if (d[idx] === 0 || d[idx] === 1) return null;
      const N = Number(d.join('')), ans = d[idx] * 10 ** pos, p = person();
      return { question: `A school fund has collected sh ${commas(N)}. ${p.name} says the digit ${d[idx]} is in the ${PLACES[pos]} place. What is the total value of that digit? Give the number only.`, answer: ans,
        wrong: [[d[idx], 'That is the digit itself. Its total value is the digit times the value of its place.', 'M_PLACE_FOR_TOTAL'], [ans * 10, 'That has one zero too many. Count the places to the right of the digit.', 'M_ZEROS_WRONG_COUNT'], [ans / 10, 'That has one zero too few. Count the places to the right of the digit.', 'M_ZEROS_WRONG_COUNT'], [d[idx] * 10 ** (pos + 1) / 100 || 7, 'Check how many places lie to the right of the digit.', 'M_ZEROS_WRONG_COUNT']],
        hints: ['Total value is the digit multiplied by the value of its place.', `The ${PLACES[pos]} place is worth ${commas(10 ** pos)}.`], steps: [`The ${PLACES[pos]} place is worth ${commas(10 ** pos)}.`, `${d[idx]} × ${commas(10 ** pos)} = ${commas(ans)}.`], chk: (a) => a / d[idx] === 10 ** pos };
    } }),
  fam({ id: 'g6d.whole.expanded-gap', cs: `${W}TOTAL_VALUE_MILLIONS`, form: 'table', rung: 3,
    gen: () => {
      const d = digitsOf7().map((x, i) => (i === 0 ? x : x)), gap = randInt(2, 5), idx = gap;
      if (d.some((x, i) => i !== idx && x === 0 && i < 2) || d[idx] < 2) return null;
      const terms = d.map((x, i) => x * 10 ** (6 - i));
      const shown = terms.map((t, i) => (i === idx ? '____' : t === 0 ? null : commas(t))).filter(x => x !== null);
      const N = Number(d.join('')), ans = terms[idx];
      return { question: `${person().name} writes ${commas(N)} in expanded form as ${shown.join(' + ')}. What number goes in the gap?`, answer: ans,
        wrong: [[d[idx], 'That is the digit only. The gap holds its total value, which includes the zeros of its place.', 'M_PLACE_FOR_TOTAL'], [ans * 10, 'There is one zero too many in the gap.', 'M_ZEROS_WRONG_COUNT'], [ans / 10, 'There is one zero too few in the gap.', 'M_ZEROS_WRONG_COUNT']],
        hints: ['Find the digit that is missing from the expanded form.', 'Write the digit followed by zeros for its place.'], steps: [`The missing digit is ${d[idx]}, in the ${PLACES[6 - idx]} place.`, `Its total value is ${commas(ans)}.`], chk: (a) => terms.reduce((s, t, i) => s + (i === idx ? a : t), 0) === N };
    } }),
  fam({ id: 'g6d.whole.symbols-spot', cs: `${W}SYMBOLS_MILLIONS`, form: 'spot', rung: 3,
    gen: () => {
      const m = randInt(1, 9), t = randInt(11, 99), u = randInt(2, 9);
      const good = `${m},${String(t).padStart(3, '0')},${String(u).padStart(3, '0')}`, bad = `${m},${t}${u}`;
      return spot(`${person().name} writes ${m} million, ${t} thousand and ${u} in symbols.`, [`Step 1: The millions are ${m},000,000.`, `Step 2: The ${t} thousand and the ${u} are joined as ${t}${u}, with no zeros.`, `Step 3: So the number is ${bad}.`], 1,
        `Each group of three digits needs all its places: ${t} thousand is ${String(t).padStart(3, '0')} thousand and ${u} is ${String(u).padStart(3, '0')}. The number is ${good}.`, 'M_JOIN_PARTS', ['Look at how many digits each group after the millions should have.', 'A group with fewer than three digits needs zeros in front.']);
    } }),
  fam({ id: 'g6d.whole.largest-crowd', cs: `${W}ORDER_100K`, form: 'why', rung: 2,
    gen: () => {
      const a = randInt(10, 49) * 1000 + randInt(100, 999), b = randInt(5, 9) * 1000 + randInt(0, 999), c = a - randInt(2, 9) * 1000 - randInt(1, 99), d = randInt(1, 4) * 1000 + randInt(0, 999);
      if (!(b > a / 10 && String(b)[0] > String(a)[0]) || c < 10000 || !distinct(a, b, c, d)) return null;
      const mk = (x) => commas(x);
      const options = mc(mk(a), [[mk(b), 'This number has a bigger first digit, but it has fewer digits. A number with more digits is bigger.', 'M_FIRST_DIGIT_ONLY'], [mk(c), 'This is a five-digit number, but another five-digit number is bigger. Compare place by place from the left.', 'M_FIRST_DIGIT_ONLY'], [mk(d), 'This is the smallest of the four, not the largest. Read the question again.', 'M_LARGEST_FIRST']]);
      return { question: `The crowds at four matches were ${shuffle([a, b, c, d]).map(mk).join(', ')}. Which match had the largest crowd?`, options, instruction: 'Choose the best answer.',
        hints: ['Count the digits of each number first.', 'If two numbers have the same number of digits, compare place by place from the left.'], steps: [`Two of the numbers have five digits, so the largest is one of them.`, `${mk(a)} is bigger than ${mk(c)}, so ${mk(a)} is the largest.`] };
    } }),
  fam({ id: 'g6d.whole.square-of-tens', cs: `${W}SQUARES_TO_100`, form: 'direct', rung: 2,
    gen: () => {
      const n = randInt(2, 9) * 10, ans = n * n;
      return { question: `A square plot has sides of ${n} m. What is ${n} squared, in square metres? Give the number only.`, answer: ans,
        wrong: [[2 * n, 'That doubles the number. Squaring means multiplying the number by itself.', 'M_DOUBLE_NOT_SQUARE'], [ans / 10, 'One zero is missing. 3 tens times 3 tens is 9 hundreds.', 'M_SQUARE_OF_TENS'], [(n / 10) ** 2, 'Two zeros are missing. Each ten is multiplied by ten.', 'M_SQUARE_OF_TENS'], [n * 10, 'That is the number times ten. Multiply the number by itself.', 'M_SQUARE_OF_TENS']],
        hints: ['Squaring a number means multiplying it by itself.', `Square ${n / 10} first, then put back the zeros.`], steps: [`${n / 10} × ${n / 10} = ${(n / 10) ** 2}.`, `${n} × ${n} = ${commas(ans)}.`], chk: (a) => Math.sqrt(a) === n };
    } }),

  // ------------------------------------------------------------ MULTIPLICATION
  fam({ id: 'g6d.mul.shop-total', cs: `${M}MULT_4D_BY_2D`, form: 'word', rung: 2,
    gen: () => {
      const n = randInt(12, 98) * 50 + randInt(0, 4) * 10, t = randInt(1, 9), u = randInt(2, 9), k = t * 10 + u, ans = n * k, p = person();
      if (n < 1000 || n > 9999 || ans > 900000) return null;
      return { question: `A printing press in ${pick(['Nyeri', 'Kitale', 'Embu', 'Machakos', 'Meru'])} prints ${commas(n)} copies of a ${pick(['school newsletter', 'church programme', 'market notice', 'sports fixture list'])} for each of ${k} schools. How many copies does it print in all? Give the number only.`, answer: ans,
        wrong: [[n * u + n * t, 'The tens digit must be multiplied as tens, with a zero placed in the ones place of its row.', 'M_NO_PLACE_HOLDER_ZERO'], [n * u, 'The number was multiplied by the ones digit only. The tens digit counts too.', 'M_MULTIPLY_ONES_ONLY'], [ans - 100, 'A carry was lost somewhere. Check each column of the working.', 'M_CARRY_ADDED_BEFORE'], [ans + 1000, 'A carry was added twice. Check each column of the working.', 'M_CARRY_ADDED_BEFORE']],
        hints: [`Split ${k} into ${t * 10} and ${u}.`, `Multiply ${commas(n)} by ${u}, then by ${t * 10}, and add.`], steps: [`${commas(n)} × ${u} = ${commas(n * u)}.`, `${commas(n)} × ${t * 10} = ${commas(n * t * 10)}.`, `${commas(n * u)} + ${commas(n * t * 10)} = ${commas(ans)}.`], chk: (a) => a / k === n };
    } }),
  fam({ id: 'g6d.mul.partial-spot', cs: `${M}MULT_4D_BY_2D`, form: 'spot', rung: 3,
    gen: () => {
      const n = randInt(11, 99) * 25 + randInt(0, 3) * 5, t = randInt(2, 9), u = randInt(2, 9), k = t * 10 + u;
      if (n < 1000 || n > 4999 || n % 10 === 0) return null;
      const r1 = n * u, r2 = n * t, ans = n * k;
      return spot(`${person().name} works out ${commas(n)} × ${k}.`, [`Step 1: ${commas(n)} × ${u} = ${commas(r1)}.`, `Step 2: ${commas(n)} × ${t} = ${commas(r2)}, written under ${commas(r1)} with no zero in the ones place.`, `Step 3: ${commas(r1)} + ${commas(r2)} = ${commas(r1 + r2)}.`], 1,
        `The ${t} in ${k} stands for ${t * 10}, so ${commas(n)} × ${t * 10} = ${commas(n * t * 10)}. Putting a zero in the ones place gives ${commas(ans)} as the total.`, 'M_NO_PLACE_HOLDER_ZERO', ['Check what the tens digit really stands for.', 'The second row is multiplied by tens, so it needs a zero in the ones place.']);
    } }),

  // ------------------------------------------------------------ DIVISION
  fam({ id: 'g6d.div.share-sacks', cs: `${D}DIV_4D_BY_UP_TO_3D`, form: 'word', rung: 2,
    gen: () => {
      const div = randInt(12, 48), q = randInt(1, 9) * 100 + randInt(1, 9), N = div * q;
      if (N < 1000 || N > 9999) return null;
      const zl = Number(String(q).replace('0', '')), p = person();
      const options = mc(String(q), [[String(zl), 'A zero is missing from the answer. When a digit is too small to divide, write 0 in the answer.', 'M_ZERO_IN_QUOTIENT_LOST'], [String(q * 10), 'There is a zero too many in the answer. Check each step of the division.', 'M_ZERO_IN_QUOTIENT_LOST']]);
      return { question: `${p.name} shares ${commas(N)} kg of maize equally among ${div} families in a village near ${pick(['Kitale', 'Eldoret', 'Nyeri', 'Embu'])}. How many kilograms does each family get?`, options, instruction: 'Choose the best answer.',
        hints: [`Divide ${commas(N)} by ${div} by long division.`, 'Write 0 in the answer when a digit is too small to divide.'], steps: [`${commas(N)} ÷ ${div} = ${q}.`, `Check: ${q} × ${div} = ${commas(N)}.`] };
    } }),
  fam({ id: 'g6d.div.trays-left', cs: `${D}DIV_4D_BY_UP_TO_3D`, form: 'word', rung: 3,
    gen: () => {
      const div = pick([12, 15, 24, 30, 36]), q = randInt(40, 300), r = randInt(1, div - 1), N = div * q + r;
      if (N < 1000 || N > 9999) return null;
      return { question: `A farm packs ${commas(N)} eggs into trays of ${div}. How many full trays are packed? Give the number only.`, answer: q,
        wrong: [[r, 'That is the number of eggs left over. The question asks for the full trays.', 'M_REMAINDER_AS_PART'], [q * 10 + r, 'The remainder has been written as another digit of the answer. It is not part of the quotient.', 'M_REMAINDER_AS_PART'], [q + 1, 'The leftover eggs do not fill another tray, so that tray is not full.', 'M_REMAINDER_AS_PART']],
        hints: [`Divide ${commas(N)} by ${div}.`, 'The remainder is what is left over; it is not a full tray.'], steps: [`${commas(N)} ÷ ${div} = ${q} remainder ${r}.`, `There are ${q} full trays.`], chk: (a) => a * div + r === N };
    } }),
  fam({ id: 'g6d.ops.brackets-spot', cs: `${D}COMBINED_OPERATIONS`, form: 'spot', rung: 3,
    gen: () => {
      const x = randInt(3, 9), y = randInt(11, 60), z = randInt(11, 60), good = x * (y + z), bad = x * y + z;
      return spot(`${person().name} works out ${x} × (${y} + ${z}).`, [`Step 1: The line has a number, a multiplication and a bracket.`, `Step 2: Multiply first: ${x} × ${y} = ${x * y}, then add ${z} to get ${bad}.`, `Step 3: The answer is ${commas(bad)}.`], 1,
        `The brackets must be worked out first: ${y} + ${z} = ${y + z}. Then multiply: ${x} × ${y + z} = ${commas(good)}.`, 'M_BRACKET_IGNORED', ['Look at what is inside the brackets.', 'Work out the brackets before anything else.']);
    } }),

  // ------------------------------------------------------------ DECIMALS
  fam({ id: 'g6d.dec.to-fraction-word', cs: `${C}DECIMAL_TO_FRACTION`, form: 'direct', rung: 2,
    gen: () => {
      const pl = pick([1, 2, 3]), top = randInt(1, 9 * 10 ** (pl - 1)), N = top / 10 ** pl;
      if (pl === 1 && top % 5 === 0) return null;
      const g = (a, b) => (b ? g(b, a % b) : a), den = 10 ** pl, k = g(top, den), simple = `${top / k}/${den / k}`;
      if (k === 1 && pl > 1) { /* already simplest */ }
      const wrong10 = `${top}/10`, digitsCount = `${top}/${String(top).length}`, unsimplified = `${top}/${den}`;
      const texts = [simple, wrong10, digitsCount, unsimplified];
      if (new Set(texts).size < 4) return null;
      const options = mc(simple, [[wrong10, 'The denominator depends on the number of decimal places: one place is tenths, two is hundredths, three is thousandths.', 'M_DENOMINATOR_TEN_ALWAYS'], [digitsCount, 'The denominator is 1 followed by as many zeros as decimal places, not the number of digits.', 'M_POINT_DROPPED_THEN_ONE'], [unsimplified, 'This is the right value, but it is not in simplest form. Divide top and bottom by their common factor.', 'M_DENOMINATOR_TEN_ALWAYS']]);
      return { question: `A scale shows ${N} kg of tea. Write ${N} as a fraction in its simplest form.`, options, instruction: 'Choose the best answer.',
        hints: ['Count the decimal places to find the denominator.', 'Then simplify by dividing top and bottom by the same number.'], steps: [`${N} has ${pl} decimal place${pl > 1 ? 's' : ''}, so the denominator is ${den}.`, `${top}/${den} = ${simple} in simplest form.`] };
    } }),
  fam({ id: 'g6d.dec.fraction-to-decimal', cs: `${C}FRACTION_TO_DECIMAL`, form: 'word', rung: 2,
    gen: () => {
      const den = pick([4, 5, 8, 20, 25, 50]), num = randInt(1, den - 1);
      if (num % 2 === 0 && den % 2 === 0) return null;
      const ans = num / den;
      if (String(ans).length > 7) return null;
      const g = ans.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
      return { question: `${person().name} drinks ${num}/${den} of a litre of milk. Write ${num}/${den} as a decimal. Give the number only.`, answer: Number(g),
        wrong: [[Number(`${num}.${den}`), 'The bar is not a decimal point. Divide the top number by the bottom number.', 'M_NUMERATOR_POINT_DENOMINATOR'], [den / num, 'The bottom number was divided by the top. A proper fraction is less than 1, so its decimal must be less than 1.', 'M_DIVIDE_THE_WRONG_WAY'], [Number((Math.round(ans * 10) / 10).toFixed(1)) === ans ? ans + 0.1 : Number((Math.round(ans * 10) / 10).toFixed(1)), 'The answer has been rounded. Keep all the decimal places.', 'M_DIVIDE_THE_WRONG_WAY'], [Number(`0.${num}${den}`), 'The two numbers were joined. Divide the top number by the bottom number.', 'M_NUMERATOR_POINT_DENOMINATOR']],
        hints: ['Divide the top number by the bottom number.', `A fraction of 1 whole is less than 1, so the decimal starts with 0.`], steps: [`${num} ÷ ${den} = ${g}.`, `${num}/${den} = ${g}.`], chk: (a) => Math.abs(a * den - num) < 1e-9 };
    } }),
  fam({ id: 'g6d.dec.percent-to-decimal-small', cs: `${C}PERCENT_TO_DECIMAL`, form: 'direct', rung: 2,
    gen: () => {
      const pc = pick([2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 35, 45, 65, 8.5, 7.5, 12.5]), dec = pc / 100;
      return { question: `A bank pays interest of ${pc}% a year. Write ${pc}% as a decimal. Give the number only.`, answer: dec,
        wrong: [[pc / 10, 'You divided by 10. A percentage is out of 100, so divide by 100.', 'M_DIVIDE_BY_TEN'], [pc, 'This is the percentage number itself. Divide by 100.', 'M_PERCENT_AS_WHOLE'], [pc / 1000, 'You divided by 1,000. Divide by 100 only.', 'M_DIVIDE_BY_TEN'], [pc < 10 ? Number(`0.${pc}`) : pc / 10, 'The percentage number was put after the point without dividing by 100.', 'M_PERCENT_AS_WHOLE']],
        hints: ['Per cent means out of 100.', 'Divide by 100: move the point two places to the left.'], steps: [`${pc}% = ${pc} ÷ 100.`, `${pc} ÷ 100 = ${dec}.`], chk: (a) => Math.abs(a * 100 - pc) < 1e-9 };
    } }),
  fam({ id: 'g6d.dec.add-aligned-spot', cs: `${C}ADD_DECIMALS_4DP`, form: 'spot', rung: 3,
    gen: () => {
      const a = randInt(10, 99) / 10, b = randInt(1001, 9999) / 10000;
      const pa = (a).toFixed(4), pb = b.toFixed(4), sum = (a + b).toFixed(4);
      const wrongSum = (Number(a.toFixed(1).replace('.', '')) / 10000 + b).toFixed(4);
      if (wrongSum === sum) return null;
      return spot(`${person().name} adds ${a} m and ${pb} m of rope.`, [`Step 1: Write ${a} and ${pb} one under the other with the right-hand digits in line.`, `Step 2: Add the columns from the right, carrying when a column is 10 or more.`, `Step 3: The sum is ${wrongSum} m.`], 0,
        `The decimal points must be in line, not the right-hand digits. Write ${a} as ${pa}, then add: the sum is ${sum} m.`, 'M_RIGHT_ALIGN', ['Look at how the two numbers are written one under the other.', 'The decimal points must be directly above each other.']);
    } }),
];
