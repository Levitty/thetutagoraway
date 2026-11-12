// ============================================================================
// GRADE 4 MATHEMATICS, NUMBERS: WHOLE NUMBERS. Written from the KICD 2024 design through the
// curriculum map (curriculum/mathematics/g4.json). Every wrong answer names the library
// misconception it reveals. All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, randInt, pick, shuffle, distinct, commas, person, sh, mc, tbl, words } from './g4c_lib.js';

const W = 'NUMBER.WHOLE_NUMBERS.';
const PLACES = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands'];
const digitAt = (n, p) => Math.floor(n / 10 ** p) % 10;
// A five-digit number with a zero in the thousands place and a non-zero digit after it.
const withZero = () => { let n; do { n = randInt(1, 9) * 10000 + randInt(1, 9) * 100 + randInt(1, 9) * 10 + randInt(1, 9); } while (new Set(String(n)).size < 4); return n; };
const fiveDigits = () => { let n; do { n = randInt(10000, 99999); } while (String(n).includes('0') || new Set(String(n)).size < 5); return n; };

export const FAMILIES = [
  // ------------------------------------------------------------ PLACE_VALUE_TENTH
  fam({ id: 'g4c.whole.pv.name-place', cs: `${W}PLACE_VALUE_TENTH`, form: 'direct', rung: 1,
    gen: () => {
      const n = fiveDigits(), p = randInt(1, 4), d = digitAt(n, p);
      const tv = d * 10 ** p, left = PLACES[4 - p];
      const options = mc(PLACES[p], [[commas(tv), `${commas(tv)} is what the digit is worth. The question asks for the name of its place.`, 'M_PV_GIVES_TOTAL_VALUE'], [left, 'You counted the places from the left. Count from the ones on the right.', 'M_PV_COUNT_FROM_LEFT'], [PLACES[p === 4 ? 3 : p + 1], 'That is the next place to the left. Count again from the ones.', 'M_PV_COUNT_FROM_LEFT']].filter(w => w[0] !== PLACES[p]));
      if (!options) return null;
      return { question: `A school has ${commas(n)} books in its library. Which place name tells where the digit ${d} sits in ${commas(n)}?`, options, instruction: 'Choose the name of the place.',
        hints: ['Count the places from the ones on the right.', 'Ones, tens, hundreds, thousands, ten thousands.'],
        steps: [`Write ${commas(n)} on a place value chart, ones at the right end.`, `The ${d} sits in the ${PLACES[p]} place.`] };
    } }),
  fam({ id: 'g4c.whole.pv.zero-gap', cs: `${W}PLACE_VALUE_TENTH`, form: 'word', rung: 2,
    gen: () => {
      const n = withZero(), p = pick([2, 1, 0].filter(q => digitAt(n, q) !== 0)), d = digitAt(n, p);
      const options = mc(PLACES[p], [[PLACES[p + 1], 'The zero is a place too. It holds the thousands place, so the digits after it sit lower.', 'M_PV_ZERO_IS_NOT_A_PLACE'], [PLACES[4 - p], 'You counted from the left. Count from the ones.', 'M_PV_COUNT_FROM_LEFT'], [String(d * 10 ** p), 'That is the total value, not the name of the place.', 'M_PV_GIVES_TOTAL_VALUE']].filter(w => w[0] !== PLACES[p]));
      if (!options) return null;
      return { question: `A bus company sold ${commas(n)} tickets in a year. The number has a zero in the thousands place. Which place is the digit ${d} in?`, options, instruction: 'Choose the place name.',
        hints: ['Zero is a place holder. It still takes up a place.', 'Count from the ones: ones, tens, hundreds, thousands.'],
        steps: [`Write the places under the digits of ${commas(n)}, starting at the ones.`, `The 0 holds the thousands place, so the ${d} is in the ${PLACES[p]} place.`] };
    } }),
  fam({ id: 'g4c.whole.pv.change-digit', cs: `${W}PLACE_VALUE_TENTH`, form: 'word', rung: 2,
    gen: () => {
      const n = fiveDigits(), p = randInt(1, 3), a = digitAt(n, p), pe = person();
      return { question: `A bus company printed ${commas(n)} tickets for a county show. The printer made a mistake and the digit in the ${PLACES[p]} place of that number was changed to 0. What number does the printer show now?`, answer: n - a * 10 ** p,
        wrong: [[n - a, `${a} is only the digit. Take away what the digit is worth in its place, with its zeros.`, 'M_TV_FACE_VALUE'], [n - a * 10 ** (p + 1), `Count the places again: the ${PLACES[p]} place has ${p} digits to its right.`, 'M_TV_WRONG_ZEROS'], [n - a * 10 ** (p - 1 >= 0 ? p - 1 : 0), `Count the places again from the ones.`, 'M_TV_WRONG_ZEROS'], [Number(String(n).replace(String(a), '')), 'Zero is a place holder. Keep five digits and put 0 where the digit was.', 'M_PV_ZERO_IS_NOT_A_PLACE']],
        hints: ['Find which place the changed digit is in.', 'The number goes down by what that digit was worth in that place.'], steps: [`The digit in the ${PLACES[p]} place of ${commas(n)} is ${a}, worth ${commas(a * 10 ** p)}.`, `${commas(n)} - ${commas(a * 10 ** p)} = ${commas(n - a * 10 ** p)}.`], chk: (x) => n - x === a * 10 ** p };
    } }),

  // ------------------------------------------------------------ TOTAL_VALUE_TENTH
  fam({ id: 'g4c.whole.tv.worth', cs: `${W}TOTAL_VALUE_TENTH`, form: 'word', rung: 1,
    gen: () => {
      const n = fiveDigits(), p = randInt(1, 4), d = digitAt(n, p), t = d * 10 ** p, pe = person();
      return { question: `${pe.name} counts ${commas(n)} sacks of maize at a depot. How much is the digit ${d} worth in ${commas(n)}?`, answer: t,
        wrong: [[d, `${d} is only the digit. In this place it stands for much more.`, 'M_TV_FACE_VALUE'], [t * 10, 'That has one zero too many. Count the digits to the right of the ' + d + '.', 'M_TV_WRONG_ZEROS'], [t / 10, 'That has one zero too few. Count the digits to the right of the ' + d + '.', 'M_TV_WRONG_ZEROS']],
        hints: ['Count how many digits are to the right of it.', 'Write the digit, then that many zeros.'],
        steps: [`There are ${p} digits to the right of the ${d}.`, `${d} followed by ${p} zeros is ${commas(t)}.`], chk: (x) => x / d === 10 ** p };
    } }),
  fam({ id: 'g4c.whole.tv.expand', cs: `${W}TOTAL_VALUE_TENTH`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(1, 9), b = randInt(0, 9), c = randInt(0, 9), e = randInt(1, 9), f = randInt(0, 9);
      if (b === 0 && c === 0) return null;
      const parts = [a * 10000, b * 1000, c * 100, e * 10, f].filter(x => x), n = a * 10000 + b * 1000 + c * 100 + e * 10 + f;
      const sum = parts.map(commas).join(' + ');
      const bare = parts.map(x => String(x).replace(/0+$/, '') || x).join(' + ');
      const options = mc(sum, [[bare, 'Each digit is worth its digit followed by the zeros of its place. A bare digit is only its face value.', 'M_TV_FACE_VALUE'], [parts.map(x => x * 10).join(' + '), 'Each total value here has one zero too many.', 'M_TV_WRONG_ZEROS'], [parts.map(x => x >= 10 ? x / 10 : x).join(' + '), 'Each total value here has one zero too few.', 'M_TV_WRONG_ZEROS']]);
      if (!options || new Set([sum, bare]).size < 2) return null;
      return { question: `${person().name} writes ${commas(n)} as a sum of what each digit is worth. Which sum is written correctly?`, options, instruction: 'Choose the correct sum.',
        hints: ['Find the total value of the first digit by counting the digits to its right.', 'A zero digit is worth nothing, so it is left out of the sum.'],
        steps: [`Total values: ${sum}.`, `They add up to ${commas(n)}, the number we started with.`] };
    } }),
  fam({ id: 'g4c.whole.tv.rebuild', cs: `${W}TOTAL_VALUE_TENTH`, form: 'steps', rung: 3,
    gen: () => {
      const a = randInt(1, 9), b = randInt(1, 9), c = randInt(1, 9), pa = 4, pb = randInt(2, 3), pc = randInt(0, 1);
      if (pb <= pc) return null;
      const n = a * 10 ** pa + b * 10 ** pb + c * 10 ** pc, p = person();
      return { question: `${p.name} thinks of a number. It has ${a} in the ${PLACES[pa]} place, ${b} in the ${PLACES[pb]} place and ${c} in the ${PLACES[pc]} place. Every other place holds zero.`,
        parts: [
          { prompt: 'Write the number.', answer: n, hint: 'Make a five-column chart and write 0 in every empty column.', wrong: [[Number(`${a}${b}${c}`), 'Zero is a place too. Put a 0 in every column no digit was given for.', 'M_TV_COMPOSE_DROPS_ZEROS'], [n * 10, 'Check how many digits the number has: five columns.', 'M_TV_WRONG_ZEROS'], [n / 10 >= 1 ? Math.round(n / 10) : n + 1, 'The number has five places, not four.', 'M_TV_WRONG_ZEROS']] },
          { prompt: `What is the total value of the ${b}?`, answer: b * 10 ** pb, hint: `The ${b} is in the ${PLACES[pb]} place.`, wrong: [[b, `${b} is only the digit. Its total value depends on its place.`, 'M_TV_FACE_VALUE'], [b * 10 ** (pb + 1), 'That has one zero too many.', 'M_TV_WRONG_ZEROS'], [b * 10 ** (pb - 1), 'That has one zero too few.', 'M_TV_WRONG_ZEROS']] },
        ],
        steps: [`Chart: the ${a} goes in the ${PLACES[pa]} column, the ${b} in the ${PLACES[pb]} column, the ${c} in the ${PLACES[pc]} column, and zeros fill the rest.`, `The number is ${commas(n)}. The ${b} is in the ${PLACES[pb]} place, so it is worth ${commas(b * 10 ** pb)}.`],
        chk: (x, v) => v[0] === n && v[1] === b * 10 ** pb };
    } }),

  // ------------------------------------------------------------ SYMBOLS_10000 (the older families sit beside these)
  fam({ id: 'g4c.whole.sym.parts', cs: `${W}SYMBOLS_10000`, form: 'word', rung: 1,
    gen: () => {
      const t = randInt(1, 9), h = pick([0, randInt(1, 9)]), te = pick([0, randInt(1, 9)]), o = randInt(1, 9);
      if (h === 0 && te === 0) return null;
      const n = t * 1000 + h * 100 + te * 10 + o, wr = Number(`${t}${h ? h : ''}${te ? te : ''}${o}`);
      const said = `${t} thousand${h ? `, ${h} hundred${h > 1 ? 's' : ''}` : ''}${te ? `, ${te} ten${te > 1 ? 's' : ''}` : ''} and ${o} one${o > 1 ? 's' : ''}`;
      return { question: `A shopkeeper counts ${said}. Write the number in symbols.`, answer: n,
        wrong: [[wr, 'Zero is a place holder. Write 0 in each place that has none.', 'M_SYM_JOIN_PARTS'], [Number(`${t}${te}${h}${o}`), 'The hundreds come before the tens. Check the order of the places.', 'M_SYM_REVERSE_DIGITS'], [n * 10 + 0, 'The number has four digits: thousands, hundreds, tens and ones.', 'M_SYM_PARTS_WRITTEN_IN_FULL'], [Number(`${t}${h}${te}${o}0`.slice(0, 4)) + 100, 'Check each place again.', 'M_SYM_JOIN_PARTS']],
        hints: ['Make four columns: thousands, hundreds, tens, ones.', 'Write 0 in any column with nothing in it.'], steps: [`Thousands ${t}, hundreds ${h}, tens ${te}, ones ${o}.`, `The number is ${commas(n)}.`], chk: (x) => x === n };
    } }),

  // ------------------------------------------------------------ WORDS_1000
  fam({ id: 'g4c.whole.words.choose', cs: `${W}WORDS_1000`, form: 'direct', rung: 1,
    gen: () => {
      const h = randInt(1, 9), r = pick([13, 14, 15, 16, 17, 18, 19, 21, 25, 32, 34, 46, 58, 63, 77, 85, 92, 49, 54, 69]), n = h * 100 + r;
      const t = Math.floor(r / 10), o = r % 10;
      const right = words(n), dropped = `${words(h)} and ${words(r)}`;
      const swapped = r >= 13 && r <= 19 ? words(h * 100 + (r - 10) * 10) : words(h * 100 + o * 10 + t);
      const tyTeen = r >= 20 ? words(h * 100 + 10 + o) : words(h * 100 + t * 10 + (o ? 0 : 1));
      const options = mc(right, [[dropped, 'The word hundred is missing. Say the hundreds first, then the rest.', 'M_WORDS_HUNDRED_DROPPED'], [swapped, 'Teen and ty words sound alike. Check which one the digits make.', 'M_WORDS_SPELLING_TY'], [tyTeen, 'Check the tens and ones digits again. Each has its own word.', 'M_WORDS_SPELLING_TY']]);
      if (!options) return null;
      return { question: `A price tag at the market shows sh ${n}. Which line shows ${n} in words?`, options, instruction: 'Choose the correct words.',
        hints: ['Cover the last two digits. Say the hundreds first.', 'Then say the tens and ones, with and between.'], steps: [`${h} hundreds is ${words(h * 100)}.`, `The whole number is ${right}.`] };
    } }),

  fam({ id: 'g4c.whole.words.cheque', cs: `${W}WORDS_1000`, form: 'word', rung: 2,
    gen: () => {
      const n = pick([340, 414, 540, 619, 846, 913, 190, 714, 616, 281, 374, 448, 549, 794, 470, 391]), p = person();
      const right = words(n);
      const spell = right.replace(/forty/, 'fourty').replace(/ninety/, 'ninty').replace(/fourteen/, 'forteen').replace(/fifty/, 'fivty');
      const swap = right.replace(/fourteen/, 'forty').replace(/forty/, 'fourteen').replace(/thirty/, 'thirteen').replace(/sixteen/, 'sixty').replace(/seventy/, 'seventeen').replace(/nineteen/, 'ninety');
      if (spell === right || swap === right) return null;
      const options = mc(right, [[spell, 'The number is right but a word is spelt wrongly. Check forty and ninety: they have no u in forty.', 'M_WORDS_SPELLING_FORTY'], [swap, 'Teen and ty words sound alike. Say the number slowly to hear which one it is.', 'M_WORDS_SPELLING_TY'], [`${words(Math.floor(n / 100))} and ${words(n % 100)}`, 'The word hundred is missing.', 'M_WORDS_HUNDRED_DROPPED']]);
      if (!options) return null;
      return { question: `${p.name} writes the amount sh ${n} in words on a receipt. Which is written correctly?`, options, instruction: 'Choose the correct words.',
        hints: ['Say the hundreds first, then the tens and ones.', 'Check forty, ninety and the teen words carefully.'], steps: [`${Math.floor(n / 100)} hundreds is ${words(Math.floor(n / 100) * 100)}.`, `Whole amount: ${right}.`] };
    } }),

  // ------------------------------------------------------------ ORDER_1000
  fam({ id: 'g4c.whole.order.largest', cs: `${W}ORDER_1000`, form: 'word', rung: 1,
    gen: () => {
      const a = randInt(51, 99), hs = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), v = hs.map(h => h * 100 + randInt(0, 99)), s = [...v].sort((x, y) => y - x), pe = person();
      return { question: `${pe.name} sees four bags of maize flour. They show ${a}, ${v[0]}, ${v[1]} and ${v[2]} grams. How many grams is on the bag with the most flour?`, answer: s[0],
        wrong: [[a, 'You looked at the tens digit only. A number with more digits is larger.', 'M_ORDER_FIRST_DIGIT_ONLY'], [s[1], 'That is the second largest. Compare the hundreds digits.', 'M_ORDER_ZERO_TENS'], [s[2], 'That is smaller than another bag. Compare the hundreds digits.', 'M_ORDER_ZERO_TENS'], [Math.min(a, ...v), 'That is the smallest. The question asks for the most.', 'M_ORDER_DIRECTION']],
        hints: ['Count the digits first. More digits means a bigger number.', 'If the digits are the same count, compare the hundreds.'], steps: [`${a} has 2 digits; the others have 3.`, `Compare the hundreds digits: ${s[0]} is the largest.`], chk: (x) => x >= a && v.every(y => x >= y) };
    } }),
  fam({ id: 'g4c.whole.order.list', cs: `${W}ORDER_1000`, form: 'direct', rung: 2,
    gen: () => {
      const v = new Set(); while (v.size < 4) v.add(randInt(100, 999));
      const l = [...v]; const asc = [...l].sort((x, y) => x - y), dsc = [...asc].reverse();
      const up = Math.random() < 0.5, right = (up ? asc : dsc).join(', ');
      const first = [...l].sort((x, y) => String(x).slice(2) - String(y).slice(2) || x - y).join(', ');
      const options = mc(right, [[(up ? dsc : asc).join(', '), 'This is the order the other way round. Read the direction words.', 'M_ORDER_DIRECTION'], [l.join(', '), 'That is the list as it was given. It is not in order.', 'M_ORDER_FIRST_DIGIT_ONLY'], [[...l].sort((x, y) => (x % 100) - (y % 100)).join(', '), 'You ordered by the last two digits. Compare the hundreds first.', 'M_ORDER_ZERO_TENS']]);
      if (!options) return null;
      return { question: `The numbers of learners in four schools are ${l.join(', ')}. Which line puts them in order from ${up ? 'smallest to largest' : 'largest to smallest'}?`, options, instruction: 'Choose the correct order.',
        hints: ['Compare the hundreds digit first.', up ? 'The smallest number comes first.' : 'The largest number comes first.'], steps: [`Hundreds digits: ${l.map(x => Math.floor(x / 100)).join(', ')}.`, `In order: ${right}.`] };
    } }),

  // ------------------------------------------------------------ ROUND_TEN_1000
  fam({ id: 'g4c.whole.round.nearest-ten', cs: `${W}ROUND_TEN_1000`, form: 'word', rung: 1,
    gen: () => {
      const n = randInt(101, 998), o = n % 10;
      if (o === 0) return null;
      const r = Math.round(n / 10) * 10, down = Math.floor(n / 10) * 10, up = down + 10, pe = person();
      return { question: `A water tank at ${pe.name}'s school holds ${n} litres when it is full. The caretaker writes the amount on a notice board to the nearest ten litres so that it is easy to read. What number does the caretaker write on the notice board?`, answer: r,
        wrong: [[o >= 5 ? down : up, o >= 5 ? 'You rounded down. The ones digit is 5 or more, so go up to the next ten.' : 'You rounded up. The ones digit is less than 5, so stay at the ten below.', 'M_ROUND_DROP_ONES'], [Math.round(n / 100) * 100, 'You rounded to the nearest hundred. The question asks for the nearest ten.', 'M_ROUND_WRONG_PLACE'], [n - o + (o >= 5 ? 0 : 0) + 100 * (o >= 5 ? 1 : 0), 'Check the digit next to the tens.', 'M_ROUND_NO_CARRY']],
        hints: ['Look at the ones digit.', 'If it is 5 or more, go up to the next ten. If it is less than 5, stay.'], steps: [`${n} is between ${down} and ${up}.`, `The ones digit is ${o}, so ${n} rounds to ${r}.`], chk: (x) => x % 10 === 0 && Math.abs(x - n) <= 5 };
    } }),
  fam({ id: 'g4c.whole.round.carry', cs: `${W}ROUND_TEN_1000`, form: 'word', rung: 2,
    gen: () => {
      const h = randInt(1, 9), o = randInt(5, 9), n = h * 100 + 90 + o, r = (h + 1) * 100, pe = person();
      return { question: `A tank holds ${n} litres. ${pe.name} rounds ${n} to the nearest ten. What does ${pe.she} write?`, answer: r,
        wrong: [[h * 100 + 90, 'The ones digit is 5 or more, so round up to the next ten.', 'M_ROUND_DROP_ONES'], [Number(`${h}100`), 'When the 9 tens go up by one it makes 10 tens, which is a whole hundred. Carry it into the hundreds.', 'M_ROUND_NO_CARRY'], [h * 100, 'You dropped the tens and ones. Round to the nearest ten, not to the hundred below.', 'M_ROUND_DROP_ONES'], [r + 10, 'That goes up one ten too many.', 'M_ROUND_NO_CARRY']],
        hints: ['Look at the ones digit and the next ten.', 'Count up to the next ten on a number line.'], steps: [`${n} is between ${h * 100 + 90} and ${r}.`, `The ones digit is ${o}, so go up to ${r}.`], chk: (x) => x % 10 === 0 && Math.abs(x - n) <= 5 };
    } }),

  // ------------------------------------------------------------ FACTORS_50
  fam({ id: 'g4c.whole.factors.list-count', cs: `${W}FACTORS_50`, form: 'word', rung: 1,
    gen: () => {
      const n = pick([12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50]), f = []; for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i);
      const pe = person();
      return { question: `${pe.name} packs ${n} mangoes into bags, with the same number in each bag and none left over. How many different bag sizes can ${pe.she} use? (A bag size is a factor of ${n}.)`, answer: f.length,
        wrong: [[f.length - 2, 'You left out 1 and the number itself. Both are factors.', 'M_FACTOR_ONLY_ITSELF'], [f.length - 1, 'A factor pair was missed. Test every number from 1 up.', 'M_FACTOR_MISSED_PAIR'], [Math.floor(n / 2), 'You counted the multiples of 2. Factors are numbers that go into ' + n + ' exactly.', 'M_FACTOR_MULTIPLE_SWAP'], [f.length + 1, 'One number counted is not a factor. Check each by dividing.', 'M_FACTOR_MISSED_PAIR']],
        hints: ['Write the factors in pairs that multiply to the number.', 'Start with 1 times the number.'], steps: [`The factors of ${n} are ${f.join(', ')}.`, `There are ${f.length} of them.`], chk: (x) => x === f.length };
    } }),
  fam({ id: 'g4c.whole.factors.which', cs: `${W}FACTORS_50`, form: 'direct', rung: 2,
    gen: () => {
      const n = pick([24, 28, 30, 36, 40, 42, 48, 45, 32]), f = []; for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i);
      const non = []; for (let i = 2; i < n; i++) if (n % i) non.push(i);
      const m = n * 2 > 100 ? n : n * 2, right = pick(f.filter(x => x > 1 && x < n)), bad = pick(non.filter(x => x < 12));
      const options = mc(String(right), [[String(m), `${m} is a multiple of ${n}, not a factor. A factor goes into ${n}.`, 'M_FACTOR_MULTIPLE_SWAP'], [String(bad), `${bad} does not divide ${n} exactly, so it is not a factor.`, 'M_FACTOR_MISSED_PAIR'], [String(n + 1), `${n + 1} is bigger than ${n}. A factor cannot be bigger than the number.`, 'M_FACTOR_MULTIPLE_SWAP']]);
      if (!options) return null;
      return { question: `${person().name} wants to pack ${n} oranges into boxes so that every box has the same number of oranges and none is left over. Which of these could be the number of oranges in each box?`, options, instruction: 'Choose the factor.',
        hints: ['A factor divides the number exactly, with nothing left over.', 'Try dividing the number by each choice.'], steps: [`${n} divided by ${right} is ${n / right}, with nothing left over.`, `So ${right} is a factor of ${n}.`] };
    } }),

  // ------------------------------------------------------------ MULTIPLES_100
  fam({ id: 'g4c.whole.multiples.list', cs: `${W}MULTIPLES_100`, form: 'word', rung: 1,
    gen: () => {
      const k = randInt(3, 9), n = randInt(4, 8) , pe = person();
      if (k * n > 100) return null;
      return { question: `For her maths homework ${pe.name} counts in ${k}s and writes down the multiples of ${k}: ${k}, ${k * 2}, ${k * 3}, and so on, without stopping. Which number does ${pe.she} write in the ${n}th place of the list?`, answer: k * n,
        wrong: [[k + n, `${k + n} is ${k} plus ${n}. A multiple is ${k} times a number.`, 'M_MULTIPLE_STARTS_AT_ZERO_OR_ONE'], [k * (n - 1), 'That is one multiple too early. The list starts at 1 times ' + k + '.', 'M_MULTIPLE_STARTS_AT_ZERO_OR_ONE'], [k * (n + 1), 'That is one multiple too late.', 'M_MULTIPLE_STARTS_AT_ZERO_OR_ONE'], [n, `${n} is the position, not the multiple.`, 'M_MULTIPLE_FACTOR_SWAP']],
        hints: [`Skip count in ${k}s.`, `The ${n}th multiple is ${n} times ${k}.`], steps: [`Multiples of ${k}: ${Array.from({ length: n }, (_, i) => k * (i + 1)).join(', ')}.`, `The ${n}th is ${k * n}.`], chk: (x) => x === k * n };
    } }),
  fam({ id: 'g4c.whole.multiples.which', cs: `${W}MULTIPLES_100`, form: 'direct', rung: 2,
    gen: () => {
      const k = randInt(4, 9), right = k * randInt(3, Math.floor(100 / k) - 1), near = right + pick([1, -1]), fac = k;
      const options = mc(String(right), [[String(near), `${near} is not in the ${k} times table. Skip count in ${k}s to check.`, 'M_MULTIPLE_NOT_CHECKED'], [String(k + 1 + k), `Skip count in ${k}s: this number is not said.`, 'M_MULTIPLE_NOT_CHECKED'], [String(right + 2), `Skip count in ${k}s to check this number.`, 'M_MULTIPLE_NOT_CHECKED']]);
      if (!options) return null;
      return { question: `A matatu leaves the stage every ${k} minutes. The first leaves at minute ${k}, the second at minute ${2 * k}, and so on. At which of these minutes does a matatu leave the stage?`, options, instruction: 'Choose the multiple.',
        hints: [`Skip count in ${k}s: ${k}, ${k * 2}, ${k * 3}.`, `A multiple of ${k} is in the ${k} times table.`], steps: [`${k} times ${right / k} is ${right}.`, `So ${right} is a multiple of ${k}.`] };
    } }),

  // ------------------------------------------------------------ EVEN_ODD_100
  fam({ id: 'g4c.whole.evenodd.which', cs: `${W}EVEN_ODD_100`, form: 'direct', rung: 1,
    gen: () => {
      const wantEven = Math.random() < 0.5, ev = (n) => n % 2 === 0;
      const pool = []; while (pool.length < 3) { const x = randInt(11, 98); if (ev(x) !== wantEven && !pool.includes(x) && x % 10 !== 0) pool.push(x); }
      let right; do { right = randInt(11, 98); } while (ev(right) !== wantEven || pool.includes(right) || right % 10 === 0);
      const options = mc(String(right), pool.map(x => [String(x), wantEven ? `${x} ends in ${x % 10}, an odd digit, so it does not share into two equal groups.` : `${x} ends in ${x % 10}, an even digit, so it is even.`, 'M_EVEN_ODD_TENS_DIGIT']));
      if (!options) return null;
      const shown = shuffle([right, ...pool]).join(', ');
      return { question: `Four houses on a road are numbered ${shown}. Which house number is ${wantEven ? 'even' : 'odd'}?`, options, instruction: `Choose the ${wantEven ? 'even' : 'odd'} number.`,
        hints: ['Look at the digit in the ones place only.', 'Even numbers end in 0, 2, 4, 6 or 8.'], steps: [`${right} ends in ${right % 10}.`, `So ${right} is ${wantEven ? 'even' : 'odd'}.`] };
    } }),
  fam({ id: 'g4c.whole.evenodd.share', cs: `${W}EVEN_ODD_100`, form: 'word', rung: 2,
    gen: () => {
      const n = randInt(21, 79), pe = person();
      if (n % 10 === 0) return null;
      const left = n % 2;
      return { question: `${pe.name} has ${n} sweets and shares them into two equal groups. How many sweets are left over?`, answer: left,
        wrong: [[left === 0 ? 1 : 0, left === 0 ? `${n} is even, so nothing is left over.` : `${n} is odd, so one sweet is left over.`, 'M_EVEN_ODD_TENS_DIGIT'], [2, 'Two groups cannot leave 2: you could make another group of one each.', 'M_EVEN_MEANS_BIG'], [Math.floor(n / 2), `${Math.floor(n / 2)} is how many in each group, not the number left over.`, 'M_EVEN_MEANS_BIG'], [3, 'At most one can be left over when sharing into two groups.', 'M_EVEN_MEANS_BIG']],
        hints: ['Look at the ones digit.', 'An even number shares into two equal groups with none left over.'], steps: [`${n} ends in ${n % 10}.`, `So ${n} is ${left ? 'odd and one sweet is left over' : 'even and none is left over'}.`], chk: (x) => x === n % 2 };
    } }),

  // ------------------------------------------------------------ ROMAN_TO_X
  fam({ id: 'g4c.whole.roman.to-number', cs: `${W}ROMAN_TO_X`, form: 'direct', rung: 1,
    gen: () => {
      const R = { 4: 'IV', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 3: 'III', 2: 'II' }, n = pick([4, 6, 7, 8, 9]), pe = person();
      const wrongs = { 4: [[6, 'IV is not I after V. A smaller numeral before a larger one is taken away.', 'M_ROMAN_IV_AS_6'], [5, 'IV is 5 take away 1.', 'M_ROMAN_X_AS_5'], [3, 'Count again: 5 take away 1.', 'M_ROMAN_IV_AS_6']], 9: [[11, 'IX is not I after X. 1 before 10 means 10 take away 1.', 'M_ROMAN_IV_AS_6'], [10, 'IX is 10 take away 1.', 'M_ROMAN_X_AS_5'], [8, 'Count again: 10 take away 1.', 'M_ROMAN_IV_AS_6']], 6: [[4, 'VI is V and then I, so it is 5 plus 1.', 'M_ROMAN_IV_AS_6'], [5, 'VI is 5 plus 1.', 'M_ROMAN_X_AS_5'], [7, 'Count again: V is 5, I is 1.', 'M_ROMAN_X_AS_5']], 7: [[5, 'VII is V and two I: 5 plus 2.', 'M_ROMAN_X_AS_5'], [6, 'VII has two I.', 'M_ROMAN_X_AS_5'], [8, 'VII has two I, not three.', 'M_ROMAN_X_AS_5']], 8: [[7, 'VIII has three I: 5 plus 3.', 'M_ROMAN_X_AS_5'], [6, 'VIII has three I.', 'M_ROMAN_X_AS_5'], [9, 'VIII is 5 plus 3.', 'M_ROMAN_IV_AS_6']] };
      return { question: `On the wall clock in the school hall the hour hand is pointing straight at the Roman numeral ${R[n]}. Which hour of the clock is that when the hour is written as an ordinary number?`, answer: n, wrong: wrongs[n],
        hints: ['V is 5 and X is 10. I is 1.', 'A smaller numeral before a larger one is taken away.'], steps: [`${R[n]}: ${n === 4 ? '5 take away 1' : n === 9 ? '10 take away 1' : `5 and ${n - 5} more`}.`, `${R[n]} is ${n}.`], chk: (x) => x === n };
    } }),
  fam({ id: 'g4c.whole.roman.write', cs: `${W}ROMAN_TO_X`, form: 'direct', rung: 2,
    gen: () => {
      const R = { 4: 'IV', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 3: 'III' }, n = pick([4, 6, 7, 9]), pe = person();
      const wrongs = { 4: [['V', 'V is 5. For 4 put the I before the V.', 'M_ROMAN_X_AS_5'], ['III', 'III is 3. 4 is 5 take away 1.', 'M_ROMAN_IIII_FOR_4'], ['VII', 'VII is 7. 4 is 5 take away 1.', 'M_ROMAN_X_AS_5']], 6: [['V', 'V is 5. 6 is V and one I.', 'M_ROMAN_X_AS_5'], ['VII', 'VII is 7. 6 is V and one I.', 'M_ROMAN_X_AS_5'], ['VIII', 'VIII is 8. 6 is V and one I.', 'M_ROMAN_X_AS_5']], 7: [['VI', 'VI is 6. 7 is V and two I.', 'M_ROMAN_X_AS_5'], ['VIII', 'VIII is 8. 7 is V and two I.', 'M_ROMAN_X_AS_5'], ['IX', 'IX is 9. 7 is V and two I.', 'M_ROMAN_IV_AS_6']], 9: [['X', 'X is 10. 9 is 10 take away 1: IX.', 'M_ROMAN_X_AS_5'], ['VIII', 'VIII is 8. 9 is 10 take away 1.', 'M_ROMAN_X_AS_5'], ['VII', 'VII is 7. 9 is 10 take away 1.', 'M_ROMAN_X_AS_5']] };
      const options = mc(R[n], wrongs[n]);
      if (!options) return null;
      return { question: `${pe.name} writes the page number ${n} in Roman numerals. Which is correct?`, options, instruction: 'Choose the Roman numeral.',
        hints: ['V is 5, X is 10, I is 1.', 'A smaller numeral before a larger one is taken away; after it, added.'], steps: [`${n === 4 ? '5 take away 1 is IV' : n === 9 ? '10 take away 1 is IX' : `5 plus ${n - 5} is ${R[n]}`}.`, `${n} is ${R[n]}.`] };
    } }),
];
