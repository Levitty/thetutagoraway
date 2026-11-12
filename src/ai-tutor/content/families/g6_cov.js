// ============================================================================
// GRADE 6 COVERAGE (12 Nov 2026): question families for outcomes that had no family,
// no skill and no misconception feedback. DRAFT, off for children until a Kenyan maths
// teacher signs them off. Every key is computed from the draw and checked a second way;
// every wrong answer is a named mistake. Outcome letters are the design's own
// (curriculum/mathematics/g6.json). See docs/qa/new-families-2026-11-12.md.
// ============================================================================
import { cov, randInt, pick, round, commas, person, sh, shuffle, distinct, gcd, lcm, frac, mc, mcFixed, cap } from './cov.js';

const T4 = (n) => (n / 10000).toFixed(4);
const TOWNS = ['Nyeri', 'Kitale', 'Embu', 'Machakos', 'Kericho', 'Garissa', 'Thika', 'Kakamega', 'Meru', 'Kisii'];
const PLACE = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands'];

export const FAMILIES = [
  // ================================================================ WHOLE NUMBERS
  cov({ id: 'g6c.whole.symbols-from-parts', skill: 'G6_PLACE_VALUE', cskill: 'MATH.G6.NUMBER.WHOLE_NUMBERS.SYMBOLS_MILLIONS', outcome: 'MATH.G6.NUMBER.WHOLE_NUMBERS.b', misMapped: false, reveals: ['M_JOIN_PARTS', 'M_MISPLACED_GROUP'], form: 'direct', rung: 2,
    gen: () => {
      const M = randInt(1, 9), T = randInt(1, 99) * (Math.random() < 0.5 ? 1 : 10) + (Math.random() < 0.5 ? 0 : 100 * randInt(1, 9)), U = randInt(1, 99);
      if (T > 999 || T % 100 === 0) return null;
      const N = M * 1e6 + T * 1e3 + U, cat = Number(`${M}${T}${U}`), tenfold = N * 10, swap = M * 1e6 + U * 1e3 + T;
      if (!distinct(N, cat, tenfold, swap)) return null;
      const options = mc(commas(N), [[commas(cat), 'Each group of three digits after the millions needs all three places. A group with fewer digits is filled with zeros.'], [commas(tenfold), 'There is one place too many. Count the groups of three digits again.'], [commas(swap), 'The thousands and the last group have changed places. Read the amount in order.']]);
      return { question: `A school in ${pick(TOWNS)} paid ${M} million, ${T} thousand and ${U} shillings for a new classroom block. Which number in symbols shows the amount?`, options, instruction: 'Choose the best answer.',
        hints: ['Write the millions first, then the thousands, then the last three digits.', 'After the millions, every group has three digits. Use zeros to fill empty places.'],
        steps: [`${M} million is ${commas(M * 1e6)}.`, `${T} thousand is ${commas(T * 1e3)} and the last part is ${U}.`, `Together: ${commas(N)}.`] };
    } }),

  cov({ id: 'g6c.whole.order-list', skill: 'G6_PLACE_VALUE', cskill: 'MATH.G6.NUMBER.WHOLE_NUMBERS.ORDER_100K', outcome: 'MATH.G6.NUMBER.WHOLE_NUMBERS.d', misMapped: false, reveals: ['M_FIRST_DIGIT_ONLY', 'M_LARGEST_FIRST'], form: 'word', rung: 2,
    gen: () => {
      const four = [randInt(5, 9) * 1000 + randInt(0, 999), randInt(5, 9) * 1000 + randInt(0, 999)], five = [randInt(10, 99) * 1000 + randInt(0, 999), randInt(10, 99) * 1000 + randInt(0, 999)];
      const nums = [...four, ...five];
      if (new Set(nums).size < 4) return null;
      const asc = [...nums].sort((a, b) => a - b), lex = [...nums].sort((a, b) => (String(a) < String(b) ? -1 : 1)), desc = [...asc].reverse();
      const swapped = [...asc]; const i = randInt(0, 2); [swapped[i], swapped[i + 1]] = [swapped[i + 1], swapped[i]];
      const show = (l) => l.map(commas).join(' < ');
      const options = mc(show(asc), [[show(lex), 'This puts the numbers in order by their first digit only. A number with more digits is bigger.'], [show(desc), 'This is from largest to smallest. The question asks for smallest to largest.'], [show(swapped), 'Two neighbours are the wrong way round. Compare each pair.']]);
      const p = person();
      return { question: `${p.name} wrote down the number of people who came to four ${pick(['matches', 'church services', 'market days', 'concerts'])}: ${shuffle(nums).map(commas).join(', ')}. Which list puts them in order, from smallest to largest?`, options, instruction: 'Choose the best answer.',
        hints: ['First count the digits of each number. More digits means a bigger number.', 'For numbers with the same number of digits, compare place by place from the left.'],
        steps: [`Four-digit numbers are smaller than five-digit numbers.`, `Order: ${show(asc)}.`] };
    } }),

  // ================================================================ DECIMALS
  cov({ id: 'g6c.dec.name-the-place', skill: 'G6_FRACTIONS_DECIMALS', cskill: 'MATH.G6.NUMBER.DECIMALS.DECIMAL_PLACES_TEN_THOUSANDTHS', outcome: 'MATH.G6.NUMBER.DECIMALS.a', misMapped: false, reveals: ['M_PLACE_NAME_SHIFT'], form: 'direct', rung: 1,
    gen: () => {
      const ds = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4), W = randInt(0, 9), i = randInt(0, 3);
      const names = ['tenths', 'hundredths', 'thousandths', 'ten-thousandths'];
      const ord = ['first', 'second', 'third', 'fourth'];
      const options = mcFixed(names[i], names.filter((_, j) => j !== i).map(n => [n, `The ${n} place is the ${ord[names.indexOf(n)]} place after the point. Count the places to the digit ${ds[i]} again.`]), names);
      return { question: `A pharmacist's scale shows ${W}.${ds.join('')} g. In which place is the digit ${ds[i]}?`, options, instruction: 'Choose the best answer.',
        hints: ['Start at the decimal point. The first place after it is tenths.', 'Count the places to the right until you reach the digit.'],
        steps: ['The places after the point are tenths, hundredths, thousandths, ten-thousandths.', `The digit ${ds[i]} is in the ${ord[i]} place, the ${names[i]} place.`] };
    } }),

  cov({ id: 'g6c.dec.write-ten-thousandths', skill: 'G6_FRACTIONS_DECIMALS', cskill: 'MATH.G6.NUMBER.DECIMALS.DECIMAL_PLACES_TEN_THOUSANDTHS', outcome: 'MATH.G6.NUMBER.DECIMALS.a', misMapped: false, reveals: ['M_TH_SOUNDS_LIKE_WHOLE', 'M_PLACE_NAME_SHIFT'], form: 'word', rung: 2,
    gen: () => {
      const n = randInt(2, 9), tot = n / 10000, T = T4(n);
      const options = mc(T, [[(n / 1000).toFixed(3), 'That is thousandths. A ten-thousandth is ten times smaller.'], [(n / 100).toFixed(2), 'That is hundredths. Count four places after the point.'], [(n / 100000).toFixed(5), 'That is hundred-thousandths. Count only four places after the point.']]);
      const p = person();
      return { question: `${p.name} reads ${n} ten-thousandths of a gram on a very fine scale. Which decimal shows this?`, options, instruction: 'Choose the best answer.',
        hints: ['Ten-thousandths is the fourth place after the decimal point.', 'Put the digit in the fourth place and fill the other places with zeros.'],
        steps: ['The fourth place after the point is the ten-thousandths place.', `${n} ten-thousandths is ${T}.`] };
    } }),

  cov({ id: 'g6c.dec.to-percent', skill: 'G6_FRACTIONS_DECIMALS', cskill: 'MATH.G6.NUMBER.DECIMALS.DECIMAL_TO_PERCENT', outcome: 'MATH.G6.NUMBER.DECIMALS.d', misMapped: false, reveals: ['M_MOVE_ONE_PLACE'], form: 'word', rung: 2,
    gen: () => {
      const v = randInt(3, 97) / 100;
      if (Math.round(v * 100) % 10 === 0) return null;
      const pc = Math.round(v * 100), p = person();
      return { question: `A water tank on ${p.name}'s shamba is ${v.toFixed(2)} full. What percentage of the tank is full? Give the number only.`, answer: pc,
        wrong: [[v * 10, 'You moved the point one place. To change a decimal to a percentage, multiply by 100.'], [v, 'This is the same decimal. A percentage is out of 100, so multiply by 100.'], [v * 1000, 'You moved the point three places. Multiply by 100, not 1000.'], [pc / 100, 'You divided by 100. To change a decimal to a percentage, multiply by 100.']],
        hints: ['A percentage means out of 100.', 'Multiply the decimal by 100.'], steps: [`${v.toFixed(2)} × 100 = ${pc}.`, `So the tank is ${pc}% full.`], chk: (a) => round(a / 100, 4) === v };
    } }),

  cov({ id: 'g6c.dec.from-percent', skill: 'G6_FRACTIONS_DECIMALS', cskill: 'MATH.G6.NUMBER.DECIMALS.PERCENT_TO_DECIMAL', outcome: 'MATH.G6.NUMBER.DECIMALS.d', misMapped: false, reveals: ['M_DIVIDE_BY_TEN'], form: 'direct', rung: 2,
    gen: () => {
      const pc = randInt(2, 98);
      if (pc % 10 === 0) return null;
      const d = pc / 100, p = person();
      return { question: `A shop in ${pick(TOWNS)} takes ${pc}% off the price of ${p.name}'s school shoes. Write ${pc}% as a decimal.`, answer: d,
        wrong: [[pc / 10, 'You divided by 10. A percentage is out of 100, so divide by 100.'], [pc, 'This is the percentage number itself. Divide by 100 to get the decimal.'], [pc / 1000, 'You divided by 1,000. Divide by 100 only.'], [round(1 - d, 2), 'You found what is left after the discount. The question asks for the discount as a decimal.']],
        hints: ['Per cent means out of 100.', 'Divide the number by 100.'], steps: [`${pc}% = ${pc} ÷ 100.`, `${pc} ÷ 100 = ${d}.`], chk: (a) => Math.round(a * 100) === pc };
    } }),

  cov({ id: 'g6c.dec.subtract-four-places', skill: 'G6_FRACTIONS_DECIMALS', cskill: 'MATH.G6.NUMBER.DECIMALS.SUBTRACT_DECIMALS_4DP', outcome: 'MATH.G6.NUMBER.DECIMALS.f', misMapped: false, reveals: ['M_SMALLER_FROM_LARGER_DIGIT'], form: 'word', rung: 3,
    gen: () => {
      const A = randInt(20000, 99999), B = randInt(10000, A - 5000), R = A - B;
      const dig = (n) => String(n).padStart(5, '0').split('').map(Number);
      const a = dig(A), b = dig(B);
      const columnwise = Number(a.map((x, i) => Math.abs(x - b[i])).join(''));
      if (columnwise === R) return null;
      const w = [[T4(columnwise), 'You took the smaller digit from the bigger one in each column. When the top digit is smaller, regroup from the next place.'], [T4(A + B), 'You added. The question asks how much heavier, so subtract.'], [T4(Math.max(R - 1000, 0)), 'Check the regrouping. Taking a tenth for the next place on the right means ten of that place, not a hundred.'], [T4(Math.round(R / 10) * 10), 'The answer has been rounded. Keep all four places.']];
      const p = person();
      return { question: `A scientist weighs two samples of soil. The first has a mass of ${T4(A)} kg and the second ${T4(B)} kg. How many kilograms heavier is the first sample than the second?`, answer: T4(R), wrong: w,
        hints: ['Line up the decimal points. Write zeros so each number has four places.', 'Start with the ten-thousandths on the right. Regroup when the top digit is smaller.'],
        steps: [`${T4(A)} − ${T4(B)}, with the decimal points lined up.`, `The answer is ${T4(R)} m.`], chk: (a) => Math.round(Number(a) * 10000) + B === A };
    } }),

  // ================================================================ FRACTIONS
  cov({ id: 'g6c.frac.subtract-lcm', skill: 'G6_FRACTIONS_SUB', cskill: 'MATH.G6.NUMBER.FRACTIONS.SUBTRACT_FRACTIONS_LCM', outcome: 'MATH.G6.NUMBER.FRACTIONS.b', misMapped: false, reveals: ['M_SUBTRACT_ACROSS', 'M_RENAME_BOTTOM_ONLY'], form: 'word', rung: 2,
    gen: () => {
      const dens = [2, 3, 4, 5, 6, 8, 10, 12], b = pick(dens), d = pick(dens);
      if (b === d || b % d === 0 || d % b === 0) return null;
      const a = randInt(1, b - 1), c = randInt(1, d - 1), L = lcm(b, d);
      const top = (a * L) / b - (c * L) / d;
      if (top <= 0 || gcd(a, b) !== 1 || gcd(c, d) !== 1) return null;
      const right = frac(top, L), p = person();
      const w = [[frac(Math.abs(a - c), L), 'You found the common denominator but did not change the numerators to match.'], [b > d && a > c && frac(a - c, b - d) !== '1/1' ? frac(a - c, b - d) : frac(c, b), 'You took the numerators from each other and the denominators from each other. The denominator stays the same size.'], [frac(Math.abs(a - c), b), 'You kept the first denominator. Both fractions must be changed to the common denominator first.'], [frac((a * L) / b + (c * L) / d, L), 'You added. The question asks how much more, so subtract.']];
      return { question: `Maize grows on ${a}/${b} of ${p.name}'s shamba and beans grow on ${c}/${d} of it. What fraction more of the shamba is under maize than under beans? Give the answer in its simplest form.`, answer: right, wrong: w,
        hints: [`Find a number that both ${b} and ${d} divide into. Use the smallest.`, 'Change both fractions to that denominator, then subtract the numerators.'],
        steps: [`The LCM of ${b} and ${d} is ${L}.`, `${(a * L) / b}/${L} − ${(c * L) / d}/${L} = ${top}/${L}.`, `In simplest form: ${right}.`], chk: (r) => { const [n, m] = r.split('/').map(Number); return n * b * d === (a * d - c * b) * m; } };
    } }),

  cov({ id: 'g6c.frac.subtract-mixed', skill: 'G6_MIXED_NUMBERS', cskill: 'MATH.G6.NUMBER.FRACTIONS.SUBTRACT_MIXED_NUMBERS', outcome: 'MATH.G6.NUMBER.FRACTIONS.d', misMapped: false, reveals: ['M_WHOLE_NOT_REDUCED', 'M_SMALLER_FROM_LARGER_FRACTION'], form: 'word', rung: 3,
    gen: () => {
      const pairs = [[2, 4], [3, 6], [4, 2], [6, 3], [5, 10], [4, 8]], [d1, d2] = pick(pairs), L = lcm(d1, d2);
      const w1 = randInt(4, 9), w2 = randInt(1, w1 - 2), n1 = randInt(1, d1 - 1), n2 = randInt(1, d2 - 1);
      const f1 = (n1 * L) / d1, f2 = (n2 * L) / d2;
      if (f1 >= f2) return null;
      const total = (w1 * L + f1) - (w2 * L + f2), wh = Math.floor(total / L), rem = total % L;
      const show = (w, n) => (n === 0 ? `${w}` : `${w} ${frac(n, L)}`);
      const mixed = (w, n, d) => `${w} ${n}/${d}`;
      const right = show(wh, rem);
      const options = mc(right, [[show(w1 - w2, f2 - f1), 'You took the smaller fraction from the bigger one. The top fraction is smaller, so regroup one whole first.'], [show(w1 - w2, L + f1 - f2), 'You changed a whole into fractions but did not take one away from the whole numbers.'], [show(w1 + w2 + Math.floor((f1 + f2) / L), (f1 + f2) % L), 'You added. The question asks how much is left.']]);
      const p = person();
      return { question: `${p.name} has ${mixed(w1, n1, d1)} m of cloth and uses ${mixed(w2, n2, d2)} m to make a dress. How many metres of cloth are left?`, options, instruction: 'Choose the best answer.',
        hints: [`Change both fractions to ${L}ths first.`, 'If the first fraction is smaller, take one whole from the whole number and add it to the fraction.'],
        steps: [`${w1} ${frac(f1, L)} − ${w2} ${frac(f2, L)}: ${f1}/${L} is smaller than ${f2}/${L}, so regroup.`, `${w1 - 1} and ${L + f1}/${L}, then subtract: ${right}.`] };
    } }),

  cov({ id: 'g6c.frac.percent-to-fraction', skill: 'G6_PERCENTAGES_INTRO', cskill: 'MATH.G6.NUMBER.FRACTIONS.PERCENT_TO_FRACTION', outcome: 'MATH.G6.NUMBER.FRACTIONS.h', misMapped: false, reveals: ['M_PERCENT_ONE_OVER'], form: 'word', rung: 2,
    gen: () => {
      const pc = pick([4, 6, 8, 12, 15, 16, 24, 28, 35, 36, 45, 55, 60, 65, 72, 75, 85]);
      const right = frac(pc, 100), p = person();
      if (right.startsWith('1/')) return null;
      const w = [[frac(1, pc), 'Per cent means out of 100, not 1 out of the number.'], [frac(pc, 10), 'You wrote the amount out of 10. A percentage is out of 100.'], [frac(100, pc), 'You turned the fraction upside down. The percentage is the top number and 100 is the bottom.'], [`${pc}/${pc + 100}`, 'You added 100 to the bottom. Per cent means out of 100.']];
      return { question: `${p.name} scored ${pc}% in a maths test. Write ${pc}% as a fraction in its simplest form.`, answer: right, wrong: w,
        hints: ['Per cent means out of 100, so write the number over 100.', 'Divide the top and the bottom by the same number until they cannot be divided more.'],
        steps: [`${pc}% = ${pc}/100.`, `Divide the top and the bottom by ${gcd(pc, 100)}: ${right}.`], chk: (r) => { const [n, m] = r.split('/').map(Number); return n * 100 === pc * m; } };
    } }),

  // ================================================================ INEQUALITIES
  cov({ id: 'g6c.ineq.simplify-add', skill: 'G6_INEQUALITIES', cskill: 'MATH.G6.NUMBER.INEQUALITIES.SIMPLIFY_INEQUALITY', outcome: 'MATH.G6.NUMBER.INEQUALITIES.b', misMapped: false, reveals: ['M_FLIP_THE_SYMBOL_FOR_NOTHING', 'M_OPERATION_NOT_INVERTED'], form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(8, 30), b = a + randInt(5, 40), ops = [['≤', 'at most', '≥'], ['≥', 'at least', '≤'], ['<', 'fewer than', '>'], ['>', 'more than', '<']], [sym, words, flip] = pick(ops), r = b - a;
      const options = mc(`n ${sym} ${r}`, [[`n ${flip} ${r}`, 'The sign has been turned the wrong way. Read the words again: which way does the sign point?'], [`n ${sym} ${a + b}`, 'You added the numbers. To get n alone, take away the number added to it.'], [`n ${sym} ${b}`, `You ignored the ${a}. It must be taken from both sides.`]]);
      return { question: `A hall can hold ${words} ${b} people. ${a} people are inside and n more are waiting outside, so n + ${a} ${sym} ${b}. Which inequality shows what n can be?`, options, instruction: 'Choose the best answer.',
        hints: ['Take the same number away from both sides to get n alone.', 'The sign stays the same when you add or subtract.'],
        steps: [`n + ${a} ${sym} ${b}.`, `Take ${a} from both sides: n ${sym} ${b} − ${a}.`, `n ${sym} ${r}.`] };
    } }),

  cov({ id: 'g6c.ineq.simplify-multiply', skill: 'G6_INEQUALITIES', cskill: 'MATH.G6.NUMBER.INEQUALITIES.SIMPLIFY_INEQUALITY', outcome: 'MATH.G6.NUMBER.INEQUALITIES.b', misMapped: false, reveals: ['M_OPERATION_NOT_INVERTED', 'M_FLIP_THE_SYMBOL_FOR_NOTHING'], form: 'word', rung: 3,
    gen: () => {
      const k = randInt(2, 9), r = randInt(3, 30), b = k * r, [sym, words, flip] = pick([['≥', 'at least', '≤'], ['≤', 'at most', '≥'], ['>', 'more than', '<'], ['<', 'less than', '>']]);
      const options = mc(`n ${sym} ${r}`, [[`n ${flip} ${r}`, 'The sign has been turned the wrong way. Read the words again.'], [`n ${sym} ${b * k}`, 'You multiplied. The number is multiplying n, so divide both sides by it.'], [`n ${sym} ${b - k}`, 'You took the number away. It is multiplying n, so divide both sides by it.']]);
      const p = person();
      return { question: `${p.name} buys ${k} tickets for a school trip at n shillings each. The total is ${words} ${commas(b)} shillings, so ${k}n ${sym} ${commas(b)}. Which inequality shows the price n of one ticket?`, options, instruction: 'Choose the best answer.',
        hints: [`${k}n means ${k} times n. Do the opposite to get n alone.`, 'Divide both sides by the same positive number. The sign stays the same.'],
        steps: [`${k}n ${sym} ${commas(b)}.`, `Divide both sides by ${k}: n ${sym} ${commas(b)} ÷ ${k}.`, `n ${sym} ${r}.`] };
    } }),

  // ================================================================ LENGTH (mm and cm)
  cov({ id: 'g6c.len.best-in-mm', skill: 'G6_UNIT_CONVERSIONS', cskill: 'MATH.G6.MEASUR.LENGTH.MM_AS_UNIT', outcome: 'MATH.G6.MEASUR.LENGTH.a', misMapped: false, reveals: ['M_UNIT_TOO_BIG'], form: 'direct', rung: 1,
    gen: () => {
      const mm = pick(['the thickness of a one-shilling coin', 'the thickness of a page of an exercise book', 'the thickness of a thin mobile phone', 'the width of a grain of rice', 'the thickness of a ruler', 'the length of an ant']);
      const others = shuffle([['the length of a classroom', 'metres (m), because a classroom is several metres long'], ['the distance from Kisumu to Kakamega', 'kilometres (km), because the road is many kilometres long'], ['the height of a mango tree', 'metres (m), because a tree is several metres tall'], ['the length of a football pitch', 'metres (m), because a pitch is many metres long'], ['the distance from Nairobi to Thika', 'kilometres (km), because towns are far apart']]).slice(0, 3);
      const options = mc(cap(mm), others.map(([t, u]) => [cap(t), `That is best measured in ${u}. It is much bigger than a millimetre.`]));
      return { question: `${person().name} is learning about units. A millimetre (mm) is a very small unit. Which of these is best measured in millimetres?`, options, instruction: 'Choose the best answer.',
        hints: ['A millimetre is about as thick as a coin.', 'Pick the thing that is tiny. Big things are measured in metres or kilometres.'],
        steps: ['A millimetre is one thousandth of a metre, so it suits very small lengths.', `${cap(mm)} is tiny, so it is measured in millimetres.`] };
    } }),

  cov({ id: 'g6c.len.ruler-marks', skill: 'G6_UNIT_CONVERSIONS', cskill: 'MATH.G6.MEASUR.LENGTH.MM_CM_RELATIONSHIP', outcome: 'MATH.G6.MEASUR.LENGTH.b', misMapped: false, reveals: ['M_HUNDRED_NOT_TEN', 'M_RULER_COUNT_FROM_ONE'], form: 'word', rung: 2,
    gen: () => {
      const lo = randInt(1, 8), hi = randInt(lo + 2, 14), diff = hi - lo;
      return { question: `A ruler has a small mark every millimetre. How many millimetre spaces are between the ${lo} cm mark and the ${hi} cm mark?`, answer: 10 * diff,
        wrong: [[diff, 'That is the number of centimetres. Each centimetre has more than one millimetre in it.'], [100 * diff, 'A centimetre holds ten of the small marks, not a hundred. Count them on a ruler.'], [10 * hi, `You counted from 0 cm. The count starts at the ${lo} cm mark.`], [10 * lo, `You used the first mark only. Take ${lo} cm from ${hi} cm first.`]],
        hints: ['Look at a ruler. How many small marks are in 1 cm?', 'Find the number of centimetres between the marks, then multiply by the millimetres in each.'],
        steps: ['1 cm = 10 mm.', `${hi} cm − ${lo} cm = ${diff} cm.`, `${diff} × 10 = ${10 * diff} mm.`], chk: (a) => a / 10 + lo === hi };
    } }),

  cov({ id: 'g6c.len.to-millimetres', skill: 'G6_UNIT_CONVERSIONS', cskill: 'MATH.G6.MEASUR.LENGTH.CONVERT_TO_MM', outcome: 'MATH.G6.MEASUR.LENGTH.c', misMapped: false, reveals: ['M_TIMES_HUNDRED', 'M_ADD_NOT_MULTIPLY'], form: 'direct', rung: 2,
    gen: () => {
      const c = randInt(2, 19), m = randInt(1, 9);
            return { question: `The label on a box of screws says each screw measures ${c} cm ${m} mm. Write this measurement using millimetres only.`, answer: 10 * c + m,
        wrong: [[100 * c + m, 'There are 10 mm in 1 cm, not 100.'], [c + m, 'You added the numbers. Change the centimetres to millimetres first.'], [10 * c, 'You left out the extra millimetres.'], [Number(`${c}${m}`) * 10, 'The millimetres were changed too. Only the centimetres are multiplied by 10.']],
        hints: ['1 cm is the same as 10 mm.', 'Change the centimetres to millimetres, then add the millimetres.'],
        steps: [`${c} cm = ${c} × 10 = ${10 * c} mm.`, `${10 * c} mm + ${m} mm = ${10 * c + m} mm.`], chk: (a) => Math.floor(a / 10) === c && a % 10 === m };
    } }),

  cov({ id: 'g6c.len.subtract-cm-mm', skill: 'G6_UNIT_CONVERSIONS', cskill: 'MATH.G6.MEASUR.LENGTH.SUBTRACT_CM_MM', outcome: 'MATH.G6.MEASUR.LENGTH.e', misMapped: false, reveals: ['M_SMALLER_FROM_LARGER_MM', 'M_TIMES_HUNDRED'], form: 'word', rung: 3,
    gen: () => {
      const c1 = randInt(10, 30), c2 = randInt(2, c1 - 3), m1 = randInt(0, 6), m2 = randInt(m1 + 1, 9);
      const A = 10 * c1 + m1, B = 10 * c2 + m2, R = A - B;
      const w = [[10 * (c1 - c2) + (m2 - m1), 'In the millimetre column the top number is smaller, so you cannot take the smaller from the bigger the other way round. Regroup one centimetre.'], [10 * (c1 - c2 - 1) + (m1 + 100 - m2), 'One centimetre is 10 mm, not 100 mm, when you regroup.'], [A + B, 'You added. The question asks how much ribbon is left.'], [10 * (c1 - c2), 'You left out the millimetres.']];
      const p = person();
      return { question: `${p.name} has a ribbon ${c1} cm ${m1} mm long. ${p.She} cuts off ${c2} cm ${m2} mm. How many millimetres of ribbon are left?`, answer: R, wrong: w,
        hints: ['Change each length to millimetres only before you subtract.', '1 cm = 10 mm.'],
        steps: [`${c1} cm ${m1} mm = ${A} mm.`, `${c2} cm ${m2} mm = ${B} mm.`, `${A} − ${B} = ${R} mm.`], chk: (a) => a + B === A };
    } }),

  cov({ id: 'g6c.len.multiply-cm-mm', skill: 'G6_UNIT_CONVERSIONS', cskill: 'MATH.G6.MEASUR.LENGTH.MULTIPLY_CM_MM', outcome: 'MATH.G6.MEASUR.LENGTH.f', misMapped: false, reveals: ['M_MULTIPLY_CM_ONLY', 'M_TIMES_HUNDRED'], form: 'word', rung: 3,
    gen: () => {
      const c = randInt(1, 4), m = randInt(1, 9), n = randInt(3, 9), one = 10 * c + m;
      const w = [[10 * c * n + m, 'Each book has the extra millimetres too. Multiply the millimetres by the number of books as well.'], [100 * c * n + m * n, 'There are 10 mm in a centimetre, not 100.'], [c * n + m * n, 'You multiplied but did not change the centimetres to millimetres.'], [one + n, 'You added. A stack of equal books needs multiplying.']];
      const p = person();
      return { question: `Each exercise book on ${p.name}'s desk is ${c} cm ${m} mm thick. ${p.She} puts ${n} of them in one pile. How many millimetres thick is the pile?`, answer: one * n, wrong: w,
        hints: ['Change the thickness of one book to millimetres first.', 'Then multiply by the number of books.'],
        steps: [`${c} cm ${m} mm = ${one} mm.`, `${one} × ${n} = ${one * n} mm.`], chk: (a) => a / n === one };
    } }),

  cov({ id: 'g6c.len.divide-cm-mm', skill: 'G6_UNIT_CONVERSIONS', cskill: 'MATH.G6.MEASUR.LENGTH.DIVIDE_CM_MM', outcome: 'MATH.G6.MEASUR.LENGTH.g', misMapped: false, reveals: ['M_REMAINDER_CM_LOST'], form: 'word', rung: 3,
    gen: () => {
      const n = pick([2, 3, 4, 5, 6]), each = randInt(6, 39), total = each * n, c = Math.floor(total / 10), m = total % 10;
      if (each % 10 === 0) return null;
      const w = [[total * n, 'You multiplied. Sharing a length equally needs dividing.'], [round(total / (10 * n), 3), 'This is in centimetres. The question asks for millimetres.'], [Math.floor(c / n) * 10 + m, 'Only the centimetres were divided. Change the whole length to millimetres and divide it all.'], [round(c / n + m / n, 3), 'You divided the centimetres and the millimetres separately, without changing the units first.']];
      const p = person();
      return { question: `${p.name} cuts a strip of wire ${c} cm ${m} mm long into ${n} equal pieces. How many millimetres long is each piece?`, answer: each, wrong: w,
        hints: ['Change the whole length to millimetres first.', 'Then divide by the number of pieces.'],
        steps: [`${c} cm ${m} mm = ${total} mm.`, `${total} ÷ ${n} = ${each} mm.`], chk: (a) => a * n === total };
    } }),

  cov({ id: 'g6c.len.round-the-edge', skill: 'G6_UNIT_CONVERSIONS', cskill: 'MATH.G6.MEASUR.LENGTH.CIRCUMFERENCE_DIAMETER_RELATION', outcome: 'MATH.G6.MEASUR.LENGTH.i', misMapped: false, reveals: ['M_CIRCUMFERENCE_TWICE_DIAMETER'], form: 'direct', rung: 2,
    gen: () => {
      const [thing, ds] = pick([['a round cake tin', [14, 21]], ['a bicycle wheel', [70]], ['a round table', [70, 140]], ['a round water tank', [140, 210]]]), d = pick(ds), C = (22 * d) / 7;
      const options = mc(`about ${C} cm`, [[`about ${d} cm`, 'That is the distance across, the diameter. The rope goes round the edge, which is longer.'], [`about ${2 * d} cm`, 'Going round is more than two times across. Try a little more than three diameters.'], [`about ${4 * d} cm`, 'Going round is less than four diameters. It is a little more than three.']]);
      return { question: `${cap(thing)} has a diameter of ${d} cm. A string is tied once round its edge. About how long is the string?`, options, instruction: 'Choose the best answer.',
        hints: ['The distance round a circle is a little more than three times the distance across.', 'Find three times the diameter, then add a little more.'],
        steps: ['The circumference of a circle is about 3.14 times its diameter, or about 22/7 times.', `${d} × 22 ÷ 7 = ${C} cm.`] };
    } }),

  // ================================================================ CAPACITY
  cov({ id: 'g6c.cap.litres-to-ml', skill: 'G6_CAPACITY', cskill: 'MATH.G6.MEASUR.CAPACITY.LITRES_TO_ML', outcome: 'MATH.G6.MEASUR.CAPACITY.b', misMapped: false, reveals: ['M_TIMES_HUNDRED'], form: 'direct', rung: 1,
    gen: () => {
      const l = pick([2, 3, 4, 5, 6, 8, 10, 1.5, 2.5, 3.5]), ml = l * 1000, p = person();
      return { question: `${p.name}'s jerrican holds ${l} litres of water. How many millilitres is that?`, answer: ml,
        wrong: [[l * 100, 'There are 1,000 millilitres in a litre, not 100.'], [l * 10, 'There are 1,000 millilitres in a litre, not 10.'], [l / 1000, 'You divided. Changing litres to the smaller unit millilitres needs multiplying.'], [l * 10000, 'There are 1,000 millilitres in a litre, not 10,000.']],
        hints: ['A litre is a bigger unit than a millilitre, so the number gets bigger.', '1 litre = 1,000 ml.'],
        steps: ['1 litre = 1,000 ml.', `${l} × 1,000 = ${commas(ml)} ml.`], chk: (a) => a / 1000 === l };
    } }),

  cov({ id: 'g6c.cap.ml-to-litres', skill: 'G6_CAPACITY', cskill: 'MATH.G6.MEASUR.CAPACITY.ML_TO_LITRES', outcome: 'MATH.G6.MEASUR.CAPACITY.c', misMapped: false, reveals: ['M_DIVIDE_BY_HUNDRED'], form: 'word', rung: 2,
    gen: () => {
      const bot = pick([250, 300, 500, 750]), n = pick([4, 6, 8, 12]), ml = bot * n, l = ml / 1000;
      if (ml % 10 !== 0) return null;
      const p = person();
      return { question: `${p.name} sells ${n} bottles of milk, ${bot} ml each. How many litres of milk is that altogether?`, answer: l,
        wrong: [[ml, 'This is the number of millilitres. The question asks for litres, so divide by 1,000.'], [l * 10, 'You divided by 100. There are 1,000 millilitres in a litre.'], [l / 10, 'You divided by 10,000. There are 1,000 millilitres in a litre.'], [bot + n, 'You added. Find the total number of millilitres by multiplying first.']],
        hints: ['First find how many millilitres there are altogether.', 'Then divide by 1,000 to change to litres.'],
        steps: [`${n} × ${bot} = ${commas(ml)} ml.`, `${commas(ml)} ÷ 1,000 = ${l} litres.`], chk: (a) => Math.round(a * 1000) === bot * n };
    } }),

  // ================================================================ MASS
  cov({ id: 'g6c.mass.which-in-tonnes', skill: 'G6_MASS', cskill: 'MATH.G6.MEASUR.MASS.ITEMS_IN_TONNES', outcome: 'MATH.G6.MEASUR.MASS.b', misMapped: false, reveals: ['M_BIG_MEANS_TONNES'], form: 'direct', rung: 1,
    gen: () => {
      const t = pick(['a lorry full of sand', 'a container loaded at Mombasa port', 'an adult elephant', 'a loaded bus', 'a train wagon full of maize']);
      const l = shuffle([['a bag of sugar', 'kilograms'], ['a chicken', 'kilograms'], ['a school bag', 'kilograms'], ['a mango', 'grams'], ['a loaf of bread', 'grams'], ['a cooking-oil bottle', 'kilograms']]).slice(0, 3);
      const options = mc(cap(t), l.map(([x, u]) => [cap(x), `This is light enough to be measured in ${u}. A tonne is 1,000 kilograms.`]));
      return { question: `${person().name} is learning about units. A tonne is a very large unit of mass. Which of these is best measured in tonnes?`, options, instruction: 'Choose the best answer.',
        hints: ['A tonne is 1,000 kilograms. Think of something very heavy.', 'Things you can carry by hand are measured in grams or kilograms.'],
        steps: ['1 tonne = 1,000 kg, so tonnes are for very heavy things.', `${cap(t)} is very heavy, so it is measured in tonnes.`] };
    } }),

  cov({ id: 'g6c.mass.sacks-in-tonne', skill: 'G6_MASS', cskill: 'MATH.G6.MEASUR.MASS.KG_TONNE_RELATIONSHIP', outcome: 'MATH.G6.MEASUR.MASS.c', misMapped: false, reveals: ['M_HUNDRED_KG'], form: 'word', rung: 2,
    gen: () => {
      const w = pick([20, 25, 40, 50, 100]), n = 1000 / w, goods = pick(['cement', 'maize', 'sugar', 'rice', 'fertiliser']);
      return { question: `A lorry can carry 1 tonne. Each sack of ${goods} has a mass of ${w} kg. How many sacks can the lorry carry?`, answer: n,
        wrong: [[100 / w, 'You used 100 kg for a tonne. A tonne is 1,000 kg.'], [10000 / w, 'You used 10,000 kg for a tonne. A tonne is 1,000 kg.'], [1000, 'This is the number of kilograms in a tonne. Divide it by the mass of one sack.'], [1000 * w, 'You multiplied. Find how many sacks fit into 1,000 kg by dividing.']],
        hints: ['How many kilograms are there in 1 tonne?', 'Divide that by the mass of one sack.'],
        steps: ['1 tonne = 1,000 kg.', `1,000 ÷ ${w} = ${n} sacks.`], chk: (a) => a * w === 1000 };
    } }),

  cov({ id: 'g6c.mass.estimate-tonnes', skill: 'G6_MASS', cskill: 'MATH.G6.MEASUR.MASS.ESTIMATE_TONNES', outcome: 'MATH.G6.MEASUR.MASS.d', misMapped: false, reveals: ['M_UNIT_NOT_CONVERTED'], form: 'direct', rung: 2,
    gen: () => {
      const items = [['an adult elephant', '5 tonnes', ['5 kg', '50 kg', '500 tonnes']], ['a loaded sand lorry', '12 tonnes', ['12 kg', '120 kg', '1,200 tonnes']], ['a school bus with no passengers', '8 tonnes', ['8 kg', '80 kg', '800 tonnes']], ['an adult hippopotamus', '2 tonnes', ['2 kg', '20 kg', '200 tonnes']], ['a loaded container at the port', '20 tonnes', ['20 kg', '200 kg', '2,000 tonnes']], ['a small tractor', '3 tonnes', ['3 kg', '30 kg', '300 tonnes']]];
      const [what, right, wr] = pick(items);
      const options = mc(right, wr.map(w => [w, /tonnes/.test(w) ? 'That is far too heavy. Compare it with the heaviest things you know.' : 'That is far too light. It is the mass of something you could lift.']));
      return { question: `Which is the best estimate for the mass of ${what}?`, options, instruction: 'Choose the best answer.',
        hints: ['Think of the mass of a person, about 50 kg. Is this thing lighter or heavier?', '1 tonne is 1,000 kg, as much as about 20 adults.'],
        steps: ['A tonne is 1,000 kg.', `${cap(what)} is much heavier than a person, but not as heavy as a thousand tonnes: about ${right}.`] };
    } }),

  cov({ id: 'g6c.mass.add-tonnes-kg', skill: 'G6_MASS', cskill: 'MATH.G6.MEASUR.MASS.ADD_TONNES_KG', outcome: 'MATH.G6.MEASUR.MASS.f', misMapped: false, reveals: ['M_HUNDRED_KG', 'M_KG_OVER_THOUSAND_LEFT'], form: 'word', rung: 2,
    gen: () => {
      const t1 = randInt(1, 5), t2 = randInt(1, 5), k1 = randInt(1, 9) * 100 + randInt(0, 1) * 50, k2 = randInt(1, 9) * 100 + randInt(0, 1) * 50;
      if (k1 + k2 < 1000) return null;
      const R = (t1 + t2) * 1000 + k1 + k2, p = person();
      const w = [[(t1 + t2) * 100 + k1 + k2, 'A tonne is 1,000 kg, not 100 kg.'], [t1 + t2 + k1 + k2, 'You added the numbers without changing the tonnes to kilograms.'], [(t1 + t2) * 1000, 'You left out the kilograms.'], [(t1 + t2) * 1000 + k1 + k2 - 1000, 'The kilograms came to 1,000 or more, which is another tonne. Check the carrying.']];
      return { question: `A grain store receives ${t1} tonnes ${k1} kg of rice on Monday and ${t2} tonnes ${k2} kg of rice on Tuesday. How many kilograms does it receive in the two days?`, answer: R, wrong: w,
        hints: ['Change each load to kilograms: 1 tonne = 1,000 kg.', 'Then add the two loads.'],
        steps: [`${t1} t ${k1} kg = ${commas(t1 * 1000 + k1)} kg.`, `${t2} t ${k2} kg = ${commas(t2 * 1000 + k2)} kg.`, `Total: ${commas(R)} kg.`], chk: (a) => a - (t1 * 1000 + k1) === t2 * 1000 + k2 };
    } }),

  cov({ id: 'g6c.mass.subtract-tonnes-kg', skill: 'G6_MASS', cskill: 'MATH.G6.MEASUR.MASS.SUBTRACT_TONNES_KG', outcome: 'MATH.G6.MEASUR.MASS.g', misMapped: false, reveals: ['M_SMALLER_FROM_LARGER_KG', 'M_HUNDRED_KG'], form: 'word', rung: 3,
    gen: () => {
      const t1 = randInt(5, 12), t2 = randInt(1, t1 - 3), k1 = randInt(1, 4) * 100, k2 = randInt(k1 / 100 + 1, 9) * 100;
      const A = t1 * 1000 + k1, B = t2 * 1000 + k2, R = A - B;
      const w = [[(t1 - t2) * 1000 + (k2 - k1), 'In the kilogram column the top number is smaller. Regroup one tonne, do not take the smaller from the bigger the other way round.'], [(t1 - t2 - 1) * 1000 + k1 + 100 - k2, 'One tonne is 1,000 kg, not 100 kg, when you regroup.'], [A + B, 'You added. The question asks how much cement is left.'], [(t1 - t2) * 1000, 'You left out the kilograms.']];
      const p = person();
      return { question: `A hardware shop in ${pick(TOWNS)} receives ${t1} tonnes ${k1} kg of cement. ${p.name} sells ${t2} tonnes ${k2} kg of it. How many kilograms of cement are left?`, answer: R, wrong: w,
        hints: ['Change both masses to kilograms first.', 'Then take the smaller from the bigger.'],
        steps: [`${t1} t ${k1} kg = ${commas(A)} kg.`, `${t2} t ${k2} kg = ${commas(B)} kg.`, `${commas(A)} − ${commas(B)} = ${commas(R)} kg.`], chk: (a) => a + B === A };
    } }),

  cov({ id: 'g6c.mass.multiply-tonnes-kg', skill: 'G6_MASS', cskill: 'MATH.G6.MEASUR.MASS.MULTIPLY_TONNES_KG', outcome: 'MATH.G6.MEASUR.MASS.h', misMapped: false, reveals: ['M_MULTIPLY_TONNES_ONLY', 'M_HUNDRED_KG'], form: 'word', rung: 3,
    gen: () => {
      const t = randInt(1, 4), k = randInt(1, 9) * 100 + randInt(0, 1) * 50, n = randInt(3, 8), one = t * 1000 + k;
      const w = [[t * n * 1000 + k, 'Every trip carries the kilograms too. Multiply the kilograms as well.'], [t * n * 100 + k * n, 'A tonne is 1,000 kg, not 100 kg.'], [t * n + k * n, 'You multiplied but did not change the tonnes to kilograms.'], [one + n, 'You added. Equal trips need multiplying.']];
      const p = person();
      return { question: `A truck makes ${n} trips to a quarry. Each trip carries ${t} tonnes ${k} kg of sand to ${p.name}'s building site. How many kilograms of sand are delivered in all?`, answer: one * n, wrong: w,
        hints: ['Change the load of one trip to kilograms first.', 'Then multiply by the number of trips.'],
        steps: [`${t} t ${k} kg = ${commas(one)} kg.`, `${commas(one)} × ${n} = ${commas(one * n)} kg.`], chk: (a) => a / n === one };
    } }),

  cov({ id: 'g6c.mass.divide-tonnes-kg', skill: 'G6_MASS', cskill: 'MATH.G6.MEASUR.MASS.DIVIDE_TONNES_KG', outcome: 'MATH.G6.MEASUR.MASS.i', misMapped: false, reveals: ['M_REMAINDER_TONNE_LOST', 'M_HUNDRED_KG'], form: 'word', rung: 3,
    gen: () => {
      const n = pick([3, 4, 5]), t = randInt(n + 1, 14), k = randInt(1, 9) * 100, total = t * 1000 + k;
      if (t % n === 0 || total % n !== 0) return null;
      const each = total / n;
      const w = [[total * n, 'You multiplied. Sharing a load equally needs dividing.'], [round(each / 1000, 3), 'This is in tonnes. The question asks for kilograms.'], [Math.floor(t / n) * 1000 + k / n, 'The leftover tonnes were dropped. Change everything to kilograms and divide it all.'], [Math.floor(t / n) * 100 + k / n, 'A tonne is 1,000 kg, not 100 kg.']];
      return { question: `A load of ${t} tonnes ${k} kg of sugar is shared equally between ${n} shops. What is each shop's share, in kilograms?`, answer: each, wrong: w,
        hints: ['Change the whole load to kilograms first.', 'Then divide by the number of shops.'],
        steps: [`${t} t ${k} kg = ${commas(total)} kg.`, `${commas(total)} ÷ ${n} = ${commas(each)} kg.`], chk: (a) => a * n === total };
    } }),

  // ================================================================ MONEY
  cov({ id: 'g6c.money.selling-price', skill: 'G6_MONEY', cskill: 'MATH.G6.MEASUR.MONEY.BUYING_SELLING_PRICE', outcome: 'MATH.G6.MEASUR.MONEY.b', misMapped: false, reveals: ['M_SELLING_FOR_BUYING'], form: 'word', rung: 2,
    gen: () => {
      const item = pick([['box of soap', 800], ['box of chalk', 450], ['bale of cloth', 3000], ['sack of onions', 2500]]), buy = item[1] + 10 * randInt(0, 30), profit = pick([50, 100, 150, 200, 300]), p = person();
      const w = [[buy - profit, 'You took the profit away. A profit is added to the buying price to get the selling price.'], [profit, 'This is only the profit. The selling price includes the buying price too.'], [buy, 'This is the buying price. To make a profit, sell for more than this.'], [buy + 2 * profit, 'The profit has been added twice.']];
      return { question: `${p.name} runs a small shop. A ${item[0]} costs ${sh(buy)} to buy, and ${p.she} wants ${sh(profit)} profit on it. What selling price, in shillings, should be written on the ${item[0].split(' ')[0]}?`, answer: buy + profit, wrong: w,
        hints: ['The buying price is what the trader pays. The selling price is what the customer pays.', 'To make a profit, the selling price must be more than the buying price.'],
        steps: ['Selling price = buying price + profit.', `${commas(buy)} + ${profit} = ${commas(buy + profit)}.`], chk: (a) => a - profit === buy };
    } }),

  cov({ id: 'g6c.money.buying-price', skill: 'G6_MONEY', cskill: 'MATH.G6.MEASUR.MONEY.BUYING_SELLING_PRICE', outcome: 'MATH.G6.MEASUR.MONEY.b', misMapped: false, reveals: ['M_SELLING_FOR_BUYING'], form: 'direct', rung: 3,
    gen: () => {
      const sell = 20 * randInt(30, 120), profit = pick([100, 150, 200, 250, 300]), p = person();
      const w = [[sell + profit, 'You added the profit. The buyer paid the selling price, which already includes the profit.'], [profit, 'This is only the profit. Take it away from the selling price.'], [sell, 'This is the selling price. The buying price was less, as there was a profit.'], [sell - 2 * profit, 'The profit has been taken away twice.']];
      return { question: `${p.name} sold a school bag for ${sh(sell)} and made a profit of ${sh(profit)}. What was the buying price, in shillings?`, answer: sell - profit, wrong: w,
        hints: ['The selling price is bigger than the buying price when there is a profit.', 'Work backwards from the selling price.'],
        steps: ['Buying price = selling price − profit.', `${commas(sell)} − ${profit} = ${commas(sell - profit)}.`], chk: (a) => a + profit === sell };
    } }),

  cov({ id: 'g6c.money.loss-amount', skill: 'G6_MONEY', cskill: 'MATH.G6.MEASUR.MONEY.LOSS_FROM_SALES', outcome: 'MATH.G6.MEASUR.MONEY.d', misMapped: false, reveals: [], form: 'word', rung: 2,
    gen: () => {
      const buy = 10 * randInt(100, 300), loss = 10 * randInt(5, 40), sell = buy - loss, item = pick(['dress', 'pair of shoes', 'radio', 'blanket']), p = person();
      const w = [[buy + sell, 'You added. The loss is the difference between the two prices.'], [buy, 'This is the buying price. The loss is how much less ' + 'it was sold for.'], [sell, 'This is the selling price. Find how much less it is than the buying price.'], [loss * 10, 'There is one zero too many. Check the place values when you take the selling price from the buying price.']];
      return { question: `${p.name} bought a ${item} for ${sh(buy)} and sold it for ${sh(sell)}. How much money did ${p.she} lose, in shillings?`, answer: loss, wrong: w,
        hints: ['A loss happens when the selling price is less than the buying price.', 'Take the smaller price from the bigger one.'],
        steps: ['Loss = buying price − selling price.', `${commas(buy)} − ${commas(sell)} = ${loss}.`], chk: (a) => sell + a === buy };
    } }),

  cov({ id: 'g6c.money.profit-or-loss', skill: 'G6_MONEY', cskill: 'MATH.G6.MEASUR.MONEY.LOSS_FROM_SALES', outcome: 'MATH.G6.MEASUR.MONEY.d', misMapped: false, reveals: ['M_LOSS_AS_PROFIT'], form: 'why', rung: 2,
    gen: () => {
      const n = pick([10, 12, 20, 24]), each = pick([20, 25, 30, 35, 40]), buy = n * each, sellEach = each + pick([-10, -5, 5, 10]);
      if (sellEach <= 0) return null;
      const sell = n * sellEach, diff = Math.abs(sell - buy), isLoss = sell < buy, p = person();
      const right = isLoss ? `A loss of ${sh(diff)}` : `A profit of ${sh(diff)}`;
      const options = mc(right, [[isLoss ? `A profit of ${sh(diff)}` : `A loss of ${sh(diff)}`, isLoss ? 'The money received is less than the money paid, so this is not a profit.' : 'The money received is more than the money paid, so this is not a loss.'], [`A loss of ${sh(sellEach - each > 0 ? sellEach - each : each - sellEach)}`, 'This is the difference for one item only. Find the difference for all of them.'], ['No profit and no loss', 'The two amounts are not equal.']]);
      return { question: `${p.name} buys ${n} mangoes for ${sh(each)} each and sells all of them for ${sh(sellEach)} each. What is the result?`, options, instruction: 'Choose the best answer.',
        hints: ['Find the total money paid for the mangoes, and the total money received.', 'If more was received than paid, it is a profit. If less, a loss.'],
        steps: [`Paid: ${n} × ${each} = ${sh(buy)}. Received: ${n} × ${sellEach} = ${sh(sell)}.`, `${isLoss ? 'Less' : 'More'} was received than paid: ${right.toLowerCase()}.`] };
    } }),

  // ================================================================ TIME
  cov({ id: 'g6c.time.ampm-event', skill: 'G6_TIME', cskill: 'MATH.G6.MEASUR.TIME.AM_PM_IDENTIFY', outcome: 'MATH.G6.MEASUR.TIME.a', misMapped: false, reveals: ['M_NIGHT_IS_PM'], form: 'why', rung: 1,
    gen: () => {
      const ev = [['morning assembly starts', 8, 0, 'a.m.'], ['the first lesson begins', 7, 30, 'a.m.'], ['lunch break starts', 1, 0, 'p.m.'], ['the family eats supper', 7, 30, 'p.m.'], ['the evening news is read', 9, 0, 'p.m.'], ['the cock crows at dawn', 5, 45, 'a.m.'], ['school closes for the day', 4, 0, 'p.m.']];
      const [what, h, m, ap] = pick(ev), other = ap === 'a.m.' ? 'p.m.' : 'a.m.', mm = String(m).padStart(2, '0');
      const options = mc(`${h}:${mm} ${ap}`, [[`${h}:${mm} ${other}`, ap === 'a.m.' ? 'The hours from midnight to noon are a.m. This event happens before noon.' : 'The hours from noon to midnight are p.m. This event happens after noon.']]);
      const p = person();
      return { question: `At ${p.name}'s school, ${what} at ${h}:${mm}. Which way of writing the time is correct?`, options, instruction: 'Choose the best answer.',
        hints: ['a.m. is for the time from midnight until noon. p.m. is from noon until midnight.', 'Is this event in the morning or after midday?'],
        steps: ['a.m. means before noon. p.m. means after noon.', `This event is ${ap === 'a.m.' ? 'before' : 'after'} noon, so it is ${h}:${mm} ${ap}.`] };
    } }),

  cov({ id: 'g6c.time.write-ampm', skill: 'G6_TIME', cskill: 'MATH.G6.MEASUR.TIME.WRITE_AM_PM', outcome: 'MATH.G6.MEASUR.TIME.b', misMapped: false, reveals: ['M_AM_PM_LEFT_OUT'], form: 'direct', rung: 2,
    gen: () => {
      const part = pick([['in the morning', 'a.m.', [6, 7, 8, 9, 10, 11]], ['in the afternoon', 'p.m.', [1, 2, 3, 4, 5]], ['in the evening', 'p.m.', [6, 7, 8, 9]]]);
      const [dayWord, ap, hours] = part, other = ap === 'a.m.' ? 'p.m.' : 'a.m.';
      const kind = pick(['half', 'quarter-past', 'to']);
      let h = pick(hours), words, hh = h, mm;
      if (kind === 'half') { words = `half past ${h}`; mm = 30; } else if (kind === 'quarter-past') { words = `quarter past ${h}`; mm = 15; } else { if (h === 1 || h === 6 && ap === 'p.m.' && dayWord === 'in the evening') h += 1; words = `quarter to ${h}`; hh = h - 1; mm = 45; }
      const t = (x, y) => `${x}:${String(y).padStart(2, '0')}`;
      const wrongMinutes = kind === 'to' ? t(h, 45) : kind === 'half' ? t(hh, 15) : t(hh, 45);
      const options = mc(`${t(hh, mm)} ${ap}`, [[`${t(hh, mm)} ${other}`, `Check whether the time is before noon (a.m.) or after noon (p.m.). It is ${dayWord}.`], [`${wrongMinutes} ${ap}`, kind === 'to' ? 'Quarter to the hour is 15 minutes before it, so the hour shown is one less.' : 'Check the minutes: quarter past is 15, half past is 30.'], [`${t(hh, mm)}`, 'This does not say a.m. or p.m. The time is not clear without it.']]);
      return { question: `The match ends at ${words} ${dayWord}. Which is the correct way to write this time?`, options, instruction: 'Choose the best answer.',
        hints: ['First write the time in numbers: hours, then minutes.', `Then decide on a.m. (before noon) or p.m. (after noon): it is ${dayWord}.`],
        steps: [`${words} is ${t(hh, mm)}.`, `${dayWord.charAt(0).toUpperCase()}${dayWord.slice(1)} is ${ap}, so ${t(hh, mm)} ${ap}.`] };
    } }),

  cov({ id: 'g6c.time.to-24-hour', skill: 'G6_TIME', cskill: 'MATH.G6.MEASUR.TIME.CONVERT_12_24', outcome: 'MATH.G6.MEASUR.TIME.d', misMapped: false, reveals: ['M_ADD_TEN', 'M_SAME_NUMBER'], form: 'direct', rung: 2,
    gen: () => {
      const h = randInt(1, 11), m = pick([0, 5, 10, 15, 20, 30, 40, 45, 50]), mm = String(m).padStart(2, '0'), pm = Math.random() < 0.6, pad = (x) => String(x).padStart(2, '0');
      const right = pm ? `${h + 12}${mm} h` : `${pad(h)}${mm} h`;
      const w = pm ? [[`${pad(h)}${mm} h`, 'This is the morning time. For p.m. times, add 12 to the hour.'], [`${h + 10}${mm} h`, 'You added 10. Add 12 to the hour to change a p.m. time to the 24-hour clock.'], [`${h + 12}${pad((m + 30) % 60)} h`, 'The minutes do not change. Only the hour changes.']] : [[`${h + 12}${mm} h`, 'This is the p.m. time. A.m. times keep the same hour.'], [`${pad(12 - h)}${mm} h`, 'You took the hour away from 12. A.m. times keep the same hour.'], [`${pad(h)}${pad((m + 30) % 60)} h`, 'The minutes do not change. A.m. times keep the same hour and minutes.']];
      const options = mc(right, w);
      const ev = pick(['The school choir performs', 'The market opens', 'The clinic closes', 'The football match kicks off']);
      return { question: `${ev} at ${h}:${mm} ${pm ? 'p.m.' : 'a.m.'} Which of these shows the same time on the 24-hour clock?`, options, instruction: 'Choose the best answer.',
        hints: ['On the 24-hour clock the hours go from 00 to 23.', pm ? 'For p.m. times, add 12 to the hour.' : 'For a.m. times, the hour stays the same.'],
        steps: [pm ? `${h} p.m. is ${h} + 12 = ${h + 12}.` : `${h} a.m. stays ${pad(h)}.`, `The time is ${right}.`] };
    } }),

  cov({ id: 'g6c.time.to-12-hour', skill: 'G6_TIME', cskill: 'MATH.G6.MEASUR.TIME.CONVERT_12_24', outcome: 'MATH.G6.MEASUR.TIME.d', misMapped: false, reveals: ['M_ADD_TEN'], form: 'word', rung: 3,
    gen: () => {
      const H = randInt(13, 23), m = pick([0, 10, 15, 25, 30, 45]), mm = String(m).padStart(2, '0'), h = H - 12;
      const right = `${h}:${mm} p.m.`;
      const options = mc(right, [[`${h}:${mm} a.m.`, 'Hours from 13 to 23 are after noon, so they are p.m.'], [`${H - 10}:${mm} p.m.`, 'You took 10 away. Take 12 away from the hour to change from the 24-hour clock.'], [`${H}:${mm} p.m.`, 'On the 12-hour clock the hour cannot be more than 12. Take 12 away.']]);
      const p = person();
      return { question: `${p.name}'s train ticket says: Departs ${H}${mm} h. How would ${p.she} write this time on a 12-hour clock?`, options, instruction: 'Choose the best answer.',
        hints: ['Hours from 13 to 23 are in the afternoon or evening.', 'Take 12 away from the hour and write p.m.'],
        steps: [`${H} − 12 = ${h}.`, `${H}${mm} h is ${right}.`] };
    } }),

  // ================================================================ ANGLES
  cov({ id: 'g6c.ang.straight-two', skill: 'G6_ANGLE_PROPERTIES', cskill: 'MATH.G6.GEOMET.ANGLES.SUM_ANGLES_STRAIGHT_LINE', outcome: 'MATH.G6.GEOMET.ANGLES.c', misMapped: false, reveals: ['M_NINETY_NOT_180', 'M_THREE_HUNDRED_SIXTY'], form: 'word', rung: 1,
    gen: () => {
      const a = pick([20, 35, 40, 55, 65, 70, 85, 110, 125, 130, 145, 160]);
      return { question: `A carpenter fixes a brace to a straight beam. On one side of the brace the angle is ${a}°. What is the angle on the other side of the brace, on the same straight beam?`, answer: 180 - a,
        wrong: [[90 - a, 'You used a right angle. Angles on a straight line add up to a half turn, which is more than that.'], [360 - a, 'You used a full turn. Angles on a straight line make only a half turn.'], [a, 'This is the angle you were given. The other angle is different, so subtract.'], [a + 180, 'You added. The two angles together make 180°, so subtract.']],
        hints: ['The angles on a straight line add up to a half turn.', 'Take the angle you know away from 180°.'],
        steps: ['Angles on a straight line add up to 180°.', `180° − ${a}° = ${180 - a}°.`], chk: (r) => r + a === 180 };
    } }),

  cov({ id: 'g6c.ang.straight-three', skill: 'G6_ANGLE_PROPERTIES', cskill: 'MATH.G6.GEOMET.ANGLES.SUM_ANGLES_STRAIGHT_LINE', outcome: 'MATH.G6.GEOMET.ANGLES.c', misMapped: false, reveals: ['M_NINETY_NOT_180', 'M_THREE_HUNDRED_SIXTY'], form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(2, 8) * 10, b = randInt(2, 8) * 10, x = 180 - a - b;
      if (x < 10) return null;
      return { question: `A carpenter fixes two braces to a straight beam, which makes three angles along the beam. Two of the angles are ${a}° and ${b}°. Find the third angle, in degrees.`, answer: x,
        wrong: [[180 - a, 'You took away only one of the angles. All three add up to 180°, so take away both.'], [a + b, 'This is the sum of the two angles you know. Take it away from 180°.'], [360 - a - b, 'You used a full turn. Angles on a straight line make only a half turn.'], [90 - a - b > 0 ? 90 - a - b : a * b, 'You used a right angle. Angles on a straight line add up to a half turn, which is more than that.']],
        hints: ['The three angles add up to 180°.', 'Add the two known angles, then take the total from 180°.'],
        steps: [`${a}° + ${b}° = ${a + b}°.`, `180° − ${a + b}° = ${x}°.`], chk: (r) => a + b + r === 180 };
    } }),

  // ================================================================ 3-D OBJECTS
  cov({ id: 'g6c.3d.cylinder-parts', skill: 'G6_3D_OBJECTS', cskill: 'MATH.G6.GEOMET.3_D_OBJECTS.CYLINDER_PARTS', outcome: 'MATH.G6.GEOMET.3_D_OBJECTS.b', misMapped: false, reveals: ['M_CYLINDER_THREE_FACES_ALL_FLAT', 'M_CYLINDER_HAS_VERTICES'], form: 'direct', rung: 1,
    gen: () => {
      const q = pick([
        ['How many flat faces does it have?', 2, [[1, 'A cylinder has a flat top and a flat bottom. Count both.'], [3, 'The side is curved, not flat. Only the top and the bottom are flat.'], [0, 'The top and the bottom of a cylinder are flat circles.']]],
        ['How many curved faces does it have?', 1, [[2, 'The top and bottom are flat. Only the side is curved.'], [0, 'The side of a cylinder is one curved face.'], [3, 'The top and bottom are flat, so only the side is curved.']]],
        ['How many edges does it have? An edge is where a flat face meets a curved face.', 2, [[1, 'There is one edge round the top and one round the bottom.'], [0, 'The top and the bottom each meet the curved side along an edge.'], [3, 'Only the top and the bottom meet the curved side, so count two.']]],
        ['How many corners (vertices) does it have?', 0, [[1, 'A cylinder has no sharp point. The edges are smooth circles.'], [2, 'The edges are smooth circles with no sharp corner.'], [4, 'A cylinder has no corners. Its edges are smooth circles.']]],
      ]);
      const obj = pick(['A tin of beans', 'A tin of milk', 'A drum of water', 'A candle']);
      return { question: `${obj} is shaped like a cylinder. ${q[0]}`, answer: q[1], wrong: q[2],
        hints: ['Think of a tin. Look at its top, its bottom and its side.', 'The top and the bottom are circles. The side wraps round.'],
        steps: ['A cylinder has two flat circular faces and one curved face.', `It has two edges and no corners. The answer is ${q[1]}.`], chk: (a) => [0, 1, 2].includes(a) };
    } }),

  cov({ id: 'g6c.3d.plane-in-solid', skill: 'G6_3D_OBJECTS', cskill: 'MATH.G6.GEOMET.3_D_OBJECTS.PLANE_FIGURES_IN_SOLIDS', outcome: 'MATH.G6.GEOMET.3_D_OBJECTS.c', misMapped: false, reveals: [], form: 'direct', rung: 2,
    gen: () => {
      const items = [['The top of a tin of beans (a cylinder) is a flat face. What plane figure is it?', 'Circle'], ['The biggest face of a matchbox (a cuboid) is a flat face. What plane figure is it?', 'Rectangle'], ['Each face of a dice (a cube) is a flat face. What plane figure is it?', 'Square'], ['A roof is shaped like a triangular prism. The two ends are flat. What plane figure are they?', 'Triangle'], ['The base of a cone-shaped party hat is a flat face. What plane figure is it?', 'Circle']];
      const [q, right] = pick(items);
      const all = ['Circle', 'Triangle', 'Rectangle', 'Square'];
      const why = { Circle: 'A circle is round with no corners and no straight sides.', Triangle: 'A triangle has three sides and three corners.', Rectangle: 'A rectangle has four sides, with opposite sides equal, and its sides are not all equal.', Square: 'A square has four equal sides.' };
      const options = mcFixed(right, all.filter(a => a !== right).map(a => [a, `That is not the shape of this face. ${why[a]}`]), all);
      return { question: q, options, instruction: 'Choose the best answer.',
        hints: ['Picture the flat face of the object and look at its outline.', 'Count its sides and corners.'],
        steps: ['A solid is made up of plane figures, such as circles, squares, rectangles and triangles.', `The shape of this face is a ${right.toLowerCase()}.`] };
    } }),

  // ================================================================ BAR GRAPHS AND PICTOGRAPHS
  cov({ id: 'g6c.data.pictograph-symbols', skill: 'G6_DATA_COLLECTION', cskill: 'MATH.G6.DATA_H.BAR_GRAPHS.PICTOGRAPH', outcome: 'MATH.G6.DATA_H.BAR_GRAPHS.b', misMapped: false, reveals: ['M_KEY_IGNORED', 'M_HALF_SYMBOL_AS_WHOLE'], form: 'word', rung: 2,
    gen: () => {
      const each = pick([10, 20, 50]), u = randInt(2, 17) / 2, v = u * each, p = person(), thing = pick(['learners who walk to school', 'bags of maize sold in a week', 'eggs sold at a kiosk']);
      return { question: `${p.name} draws a pictograph of ${thing}. One whole symbol stands for ${each}, and a half symbol stands for ${each / 2}. How many whole symbols should ${p.she} draw for ${v}? Count a half symbol as 0.5.`, answer: u,
        wrong: [[v, 'You drew one symbol for each. One symbol stands for more than one.'], [v / 10, 'You used 10 for each symbol. Use the number each symbol stands for.'], [u * 2, 'You used half of the number each symbol stands for. A whole symbol stands for the full amount.'], [Math.ceil(u) + (u % 1 === 0 ? 1 : 0), 'Check the half symbol. The amount left over after whole symbols needs a half symbol.']],
        hints: [`How many symbols make ${each}?`, 'Divide the number by what one symbol stands for.'],
        steps: [`One symbol = ${each}.`, `${v} ÷ ${each} = ${u} symbols.`], chk: (a) => a * each === v };
    } }),

  cov({ id: 'g6c.data.pictograph-key', skill: 'G6_DATA_COLLECTION', cskill: 'MATH.G6.DATA_H.BAR_GRAPHS.PICTOGRAPH', outcome: 'MATH.G6.DATA_H.BAR_GRAPHS.b', misMapped: false, reveals: [], form: 'word', rung: 3,
    gen: () => {
      const R = pick([10, 20, 50]), units = [randInt(2, 9), randInt(2, 9), randInt(2, 9)];
      if (units.every(x => x % 2 === 0) || units.some(x => x % 2 === 1) === false) return null;
      const vals = units.map(x => x * R), opts = [R / 2, R, 2 * R, 4 * R];
      const valid = (e) => vals.every(v => v % e === 0) && Math.max(...vals) / e <= 10;
      if (opts.filter(valid).length !== 1 || !valid(R)) return null;
      const p = person();
      const options = mcFixed(`${R}`, opts.filter(e => e !== R).map(e => [`${e}`, vals.some(v => v % e !== 0) ? `Some numbers cannot be shown with whole symbols when one symbol stands for ${e}.` : `The longest row would need more than 10 symbols when one symbol stands for ${e}.`]), opts.map(String));
      return { question: `${p.name} will draw a pictograph for ${vals.join(', ')} learners in three classes. Only whole symbols are allowed, and a row may have at most 10 symbols. How many learners should one symbol stand for?`, options, instruction: 'Choose the best answer.',
        hints: ['Each number must be a whole number of symbols.', 'The longest row must not be more than 10 symbols.'],
        steps: opts.map(e => `${e} for one symbol: ${valid(e) ? 'works' : vals.some(v => v % e !== 0) ? 'some numbers do not fit' : 'too many symbols'}.`) };
    } }),

  cov({ id: 'g6c.data.bar-squares', skill: 'G6_DATA_COLLECTION', cskill: 'MATH.G6.DATA_H.BAR_GRAPHS.BAR_GRAPH_DRAW', outcome: 'MATH.G6.DATA_H.BAR_GRAPHS.d', misMapped: false, reveals: ['M_SCALE_STEP_ONE'], form: 'word', rung: 2,
    gen: () => {
      const s = pick([5, 10, 20, 50]), k = randInt(3, 9), v = s * k, p = person(), thing = pick(['kilograms of tomatoes', 'litres of milk', 'bags of maize']);
      return { question: `${p.name} is drawing a bar graph of ${v} ${thing} sold on Monday. On the vertical axis, one square stands for ${s}. How many squares tall should the Monday bar be?`, answer: k,
        wrong: [[v, 'You used one square for each. One square stands for more than one.'], [s, 'This is what one square stands for. Divide the amount by it to count the squares.'], [v * s, 'You multiplied. Divide the amount by what one square stands for.'], [v / 10, 'You divided by 10 whatever the scale. Divide by the number one square stands for.']],
        hints: ['Each square stands for a fixed amount.', 'Divide the amount by what one square stands for.'],
        steps: [`One square = ${s}.`, `${v} ÷ ${s} = ${k} squares.`], chk: (a) => a * s === v };
    } }),

  cov({ id: 'g6c.data.bar-heights', skill: 'G6_DATA_COLLECTION', cskill: 'MATH.G6.DATA_H.BAR_GRAPHS.BAR_GRAPH_DRAW', outcome: 'MATH.G6.DATA_H.BAR_GRAPHS.d', misMapped: false, reveals: ['M_SCALE_STEP_ONE'], form: 'table', rung: 3,
    gen: () => {
      const s = pick([10, 20]), days = ['Mon', 'Tue', 'Wed', 'Thu'], k = days.map(() => randInt(2, 9)), vals = k.map(x => x * s);
      if (new Set(k).size < 4) return null;
      const show = (arr) => days.map((d, i) => `${d} ${arr[i]}`).join(', ');
      const sw = [...k]; [sw[0], sw[1]] = [sw[1], sw[0]];
      const one = [...k]; one[2] = one[2] + 1;
      const options = mc(show(k), [[show(vals), 'These are the amounts, not the heights. Divide each amount by the number each square stands for.'], [show(sw), 'Two of the bars have swapped places. Match each day to its own amount.'], [show(one), 'One bar is a square too tall. Check each division.']]);
      return { question: `The table shows the bags of maize a shop sold. A bar graph will use one square for each ${s} bags. Which list gives the heights of the bars, in squares?`, options, instruction: 'Choose the best answer.',
        model: { type: 'table', data: { head: ['Day', 'Bags sold'], rows: days.map((d, i) => ({ cells: [d, String(vals[i])] })) } },
        hints: [`Divide each amount by ${s}.`, 'Keep the days in the same order.'],
        steps: days.map((d, i) => `${d}: ${vals[i]} ÷ ${s} = ${k[i]} squares.`) };
    } }),

  cov({ id: 'g6c.data.bar-difference', skill: 'G6_DATA_COLLECTION', cskill: 'MATH.G6.DATA_H.BAR_GRAPHS.BAR_GRAPH_INTERPRET', outcome: 'MATH.G6.DATA_H.BAR_GRAPHS.e', misMapped: false, reveals: ['M_DIFFERENCE_AS_TOTAL'], form: 'graph', rung: 2,
    gen: () => {
      const u = pick([10, 20]), days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], vals = days.map(() => u * randInt(1, 8));
      const hi = Math.max(...vals), lo = Math.min(...vals);
      if (vals.filter(v => v === hi).length > 1 || vals.filter(v => v === lo).length > 1 || hi - lo < 2 * u) return null;
      const thing = pick(['litres of milk a dairy sold', 'kilograms of tomatoes a stall sold', 'eggs a farm collected']);
      return { question: `The bar graph shows the ${thing} each day from Monday to Friday. How many more were sold on the busiest day than on the quietest day?`, answer: hi - lo,
        model: { type: 'bar-chart', data: { bars: days.map((label, i) => ({ label, value: vals[i] })) } },
        wrong: [[hi, 'This is the busiest day only. Take away the quietest day.'], [hi + lo, '"How many more" asks for the difference, so subtract.'], [lo, 'This is the quietest day only. Find the difference between the busiest and quietest.'], [vals.reduce((a, b) => a + b, 0), 'This adds all five days. The question asks about two days only.']],
        hints: ['Read the height of each bar against the scale.', 'Find the tallest and the shortest bar, then subtract.'],
        steps: [`The tallest bar is ${hi} and the shortest is ${lo}.`, `${hi} − ${lo} = ${hi - lo}.`], chk: (a) => a + lo === hi };
    } }),

  cov({ id: 'g6c.data.bar-second-highest', skill: 'G6_DATA_COLLECTION', cskill: 'MATH.G6.DATA_H.BAR_GRAPHS.BAR_GRAPH_INTERPRET', outcome: 'MATH.G6.DATA_H.BAR_GRAPHS.e', misMapped: false, reveals: ['M_SECOND_HIGHEST_AS_HIGHEST'], form: 'graph', rung: 3,
    gen: () => {
      const u = pick([10, 20]), days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], vals = days.map(() => u * randInt(1, 8)), s = [...vals].sort((a, b) => b - a);
      if (new Set(vals).size < 5) return null;
      const second = days[vals.indexOf(s[1])], top = days[vals.indexOf(s[0])], third = days[vals.indexOf(s[2])], least = days[vals.indexOf(s[4])];
      const options = mcFixed(second, [[top, 'This day has the tallest bar. The question asks for the second tallest.'], [third, 'This day has the third tallest bar. Look for the one just below the tallest.'], [least, 'This day has the shortest bar. Look for the second tallest.']], days.filter(d => [second, top, third, least].includes(d)));
      return { question: 'The bar graph shows the number of bicycles a repair shop mended each day from Monday to Friday. On which day did it mend the second greatest number of bicycles?', options, instruction: 'Choose the best answer.',
        model: { type: 'bar-chart', data: { bars: days.map((label, i) => ({ label, value: vals[i] })) } },
        hints: ['Find the tallest bar first.', 'Then find the tallest bar among the rest.'],
        steps: days.map((d, i) => `${d}: ${vals[i]}.`).concat([`The second greatest is ${s[1]}, on ${second}.`]) };
    } }),
];
