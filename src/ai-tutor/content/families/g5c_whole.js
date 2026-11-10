// ============================================================================
// GRADE 5 MATHEMATICS, NUMBERS: WHOLE NUMBERS (17 curriculum skills).
// Written from the KICD 2024 design through the curriculum map. Every wrong answer
// names the library misconception it reveals. All stay reviewed:false until a
// teacher signs them off.
// ============================================================================
import { fam, randInt, pick, shuffle, distinct, gcd, lcm, rnd, fl, commas, person, sh, mc, tbl, words } from './g5c_lib.js';

const W = 'NUMBER.WHOLE_NUMBERS.';
const PLACES = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands'];
const sixDigits = () => { let n; do { n = randInt(100000, 999999); } while (String(n).includes('0') && Math.random() < 0.7); return n; };
const place = (n, p) => PLACES[p];                     // p counted from the ones
const digitAt = (n, p) => Math.floor(n / 10 ** p) % 10;
const tv = (n, p) => digitAt(n, p) * 10 ** p;
const SCHOOLS = ['Mwangaza', 'Tumaini', 'Baraka', 'Upendo', 'Jitegemee', 'Amani'];
const TOWNS = ['Nyeri', 'Kisumu', 'Nakuru', 'Embu', 'Kakamega', 'Meru'];

export const FAMILIES = [
  // ---------------------------------------------------------------- PLACE_VALUE_HTH
  fam({ id: 'g5c.whole.pv.choose', cs: `${W}PLACE_VALUE_HTH`, form: 'direct', rung: 1,
    gen: () => {
      const n = sixDigits(), p = randInt(2, 5), d = digitAt(n, p);
      if (d === 0 || digitAt(n, p) === digitAt(n, p - 1)) return null;
      const options = mc(place(n, p), [[commas(tv(n, p)), `${commas(tv(n, p))} is what the digit is worth, its total value. The question asks for the name of its place.`, 'M_PV_GIVES_TOTAL_VALUE'], [place(n, p - 1), `Count the places again from the ones on the right: ones, tens, hundreds, then thousands. The ${d} is one place further left.`, 'M_PV_MISCOUNT_PLACES'], [place(n, Math.min(5, p + 1)) === place(n, p) ? 'millions' : place(n, p + 1), 'Be careful. The digit is not that far to the left.', 'M_PV_MISCOUNT_PLACES']]);
      return { question: `A water tank gauge shows ${commas(n)} litres. Which place name tells where the digit ${d} sits in that reading?`, options, instruction: 'Choose the name of the place.',
        hints: ['Count the places from the ones on the right.', 'Ones, tens, hundreds, then after the comma: thousands, ten thousands, hundred thousands.'],
        steps: [`Write ${commas(n)} under a place value chart, ones at the right end.`, `The ${d} sits in the ${place(n, p)} place.`] };
    } }),
  fam({ id: 'g5c.whole.pv.digit-in', cs: `${W}PLACE_VALUE_HTH`, form: 'word', rung: 2,
    gen: () => {
      const n = sixDigits(), p = randInt(1, 5), s = SCHOOLS[randInt(0, 5)];
      if (String(n).includes('0') === false && Math.random() < 0.5) return null;
      const a = digitAt(n, p);
      return { question: `The county library has ${commas(n)} books. Which digit is in the ${place(n, p)} place of that number?`, answer: a,
        wrong: [[digitAt(n, p - 1), 'That is the digit in the next place to the right. Count again from the ones.', 'M_PV_MISCOUNT_PLACES'], [digitAt(n, Math.min(5, p + 1)), 'That is the digit one place to the left of the place asked.', 'M_PV_MISCOUNT_PLACES'], [tv(n, p) || 0, `That is the total value of the digit. The question asks for the digit itself.`, 'M_PV_GIVES_TOTAL_VALUE'], [digitAt(n, Math.max(0, p - 2)), 'Zeros are places too. Write the number in a chart and do not skip any column.', 'M_PV_SKIPS_ZERO']],
        hints: ['Write the number in a place value chart, with the ones at the right end.', `Find the column named ${place(n, p)} and read the digit in it.`],
        steps: [`Places from the right: ${PLACES.slice(0, 6).join(', ')}.`, `In ${commas(n)} the ${place(n, p)} place holds ${a}.`],
        chk: (x) => Math.floor(n / 10 ** p) % 10 === x };
    } }),
  fam({ id: 'g5c.whole.pv.build', cs: `${W}PLACE_VALUE_HTH`, form: 'steps', rung: 3,
    gen: () => {
      const a = randInt(1, 9), b = randInt(1, 9), c = randInt(1, 9), pa = 5, pb = randInt(3, 4), pc = randInt(0, 2);
      const n = a * 10 ** pa + b * 10 ** pb + c * 10 ** pc;
      const p = person();
      return { question: `${p.name} thinks of a number. It has ${a} in the ${PLACES[pa]} place, ${b} in the ${PLACES[pb]} place and ${c} in the ${PLACES[pc]} place. Every other place holds zero.`,
        parts: [
          { prompt: 'Write the number.', answer: n, hint: 'Make a six-column chart and write 0 in every empty column.', wrong: [[Number(`${a}${b}${c}`), 'Zero is a place too. Put a 0 in every column no digit was given for.', 'M_TV_COMPOSE_DROPS_ZEROS'], [Number(`${a}${b}0${c}`), 'Check each digit against its place name, counting from the ones.', 'M_PV_MISCOUNT_PLACES'], [n / 10, 'Count the places again. The first digit is in the hundred thousands, so the number has six digits.', 'M_PV_MISCOUNT_PLACES']] },
          { prompt: `What is the total value of the ${b}?`, answer: b * 10 ** pb, hint: `The ${b} is in the ${PLACES[pb]} place.`, wrong: [[b, `${b} is only the digit. Its total value depends on its place.`, 'M_TV_FACE_VALUE'], [b * 10 ** (pb + 1), 'You wrote one zero too many. Count the places to the right of the digit.', 'M_TV_WRONG_NUMBER_OF_ZEROS'], [n, 'That is the whole number. Give the worth of this one digit only.', 'M_TV_WRONG_NUMBER_OF_ZEROS']] },
        ],
        steps: [`Chart: ${a} | ${b} | 0 or the digit for each place, ${PLACES[pa]} first.`, `The number is ${commas(n)}.`, `The ${b} is in the ${PLACES[pb]} place, so it is worth ${commas(b * 10 ** pb)}.`],
        chk: (x, v) => v[0] === n && v[1] === b * 10 ** pb };
    } }),

  // ---------------------------------------------------------------- TOTAL_VALUE_HTH
  fam({ id: 'g5c.whole.tv.worth', cs: `${W}TOTAL_VALUE_HTH`, form: 'word', rung: 1,
    gen: () => {
      const n = sixDigits(), p = randInt(1, 5), d = digitAt(n, p);
      if (d === 0 || p === 0) return null;
      const t = tv(n, p), pe = person();
      return { question: `${pe.name} counts ${commas(n)} bags of maize at a depot. How much is the digit ${d} worth in that number?`, answer: t,
        wrong: [[d, `${d} is just the digit. In this place it stands for much more.`, 'M_TV_FACE_VALUE'], [t * 10, 'That has one zero too many. Count the digits to the right of the ' + d + '.', 'M_TV_WRONG_NUMBER_OF_ZEROS'], [t / 10, 'That has one zero too few. Count the digits to the right of the ' + d + '.', 'M_TV_WRONG_NUMBER_OF_ZEROS'], [Math.floor(n / 10 ** p) * 10 ** p, 'That is the digits from the left to the ' + d + ', not the ' + d + ' alone.', 'M_TV_WRONG_NUMBER_OF_ZEROS']],
        hints: ['Count how many digits are to the right of it.', 'Write the digit, then that many zeros.'],
        steps: [`There are ${p} digits to the right of the ${d}.`, `${d} followed by ${p} zeros is ${commas(t)}.`],
        chk: (x) => x / d === 10 ** p };
    } }),
  fam({ id: 'g5c.whole.tv.expand', cs: `${W}TOTAL_VALUE_HTH`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(1, 9), b = randInt(0, 9), c = randInt(0, 9), e = randInt(1, 9), f = randInt(0, 9), g = randInt(1, 9);
      if (b === 0 && c === 0) return null;
      const n = a * 1e5 + b * 1e4 + c * 1e3 + e * 100 + f * 10 + g;
      const sum = [a * 1e5, b * 1e4, c * 1e3, e * 100, f * 10, g].filter(x => x).map(commas).join(' + ');
      const wrongDrop = String(n).replace(/0/g, '');
      const options = mc(sum, [[[a * 1e5, b * 1e4, c * 1e3, e * 100, f * 10, g].filter(x => x).map(x => String(x).replace(/0+$/, '') || x).join(' + '), 'Each digit is worth its digit followed by the zeros of its place. A bare digit is only its face value.', 'M_TV_FACE_VALUE'], [[a * 1e5, b * 1e4, c * 1e3, e * 100, f * 10, g].filter(x => x).map(x => commas(x * 10)).join(' + '), 'Each total value here has one zero too many. Count the digits to the right of each digit.', 'M_TV_WRONG_NUMBER_OF_ZEROS'], [[a * 1e5, b * 1e4, c * 1e3, e * 100, f * 10, g].filter(x => x).map(x => commas(x / 10 < 1 ? x : x)).slice(0, -1).join(' + ') || 'x', 'The ones are missing. Every non-zero digit is added into the sum.', 'M_TV_COMPOSE_DROPS_ZEROS']]);
      if (!options) return null;
      return { question: `${person().name} writes ${commas(n)} as a sum of what each digit is worth. Which sum has been written correctly?`, options, instruction: 'Choose the correct expanded form.',
        hints: ['Find the total value of the first digit by counting the digits to its right.', 'A zero digit is worth nothing, so it is left out of the sum.'],
        steps: [`Total values: ${sum}.`, `Their total is ${commas(n)}, the number we started with.`] };
    } }),
  fam({ id: 'g5c.whole.tv.rebuild-spot', cs: `${W}TOTAL_VALUE_HTH`, form: 'spot', rung: 3,
    gen: () => {
      const a = randInt(1, 9), b = randInt(1, 9), c = randInt(1, 9), pa = randInt(4, 5), pc = randInt(1, 2), pb = pa === 5 ? 3 : 2, k = randInt(0, 2);
      const n = a * 10 ** pa + b * 10 ** pb + c * 10 ** pc;
      if (pb <= pc) return null;
      const t = [a * 10 ** pa, b * 10 ** pb, c * 10 ** pc];
      const wrongNum = Number(`${a}${b}${c}`);
      const p = person();
      return { question: `${p.name} writes ${commas(t[0])} + ${commas(t[1])} + ${commas(t[2])} as one number. Which step has the mistake?`,
        working: [
          { text: `Step 1: Put the total values in order, largest place first: ${commas(t[0])}, then ${commas(t[1])}, then ${commas(t[2])}.`, ok: true },
          { text: `Step 2: Write only the non-zero digits side by side: ${a}, ${b}, ${c}.`, ok: false },
          { text: `Step 3: The number is ${commas(wrongNum)}.`, ok: true },
        ],
        fix: 'The empty places must hold zeros. Writing only the non-zero digits side by side makes the number far too small.',
        mis: 'M_TV_COMPOSE_DROPS_ZEROS',
        hints: ['Check how many digits the number should have, from its biggest place.'], steps: [`${commas(t[0])} + ${commas(t[1])} + ${commas(t[2])} = ${commas(n)}.`, 'Fill a six-column chart and write 0 in each empty column.'],
        _force: k };
    }, check: () => true }),

  // ---------------------------------------------------------------- NUMBERS_TO_WORDS
  fam({ id: 'g5c.whole.words.choose', cs: `${W}NUMBERS_TO_WORDS`, form: 'direct', rung: 2,
    gen: () => {
      const th = randInt(10, 99), r = pick([randInt(1, 99), randInt(101, 999)]);
      if (th % 10 === 0 && Math.random() < 0.5) return null;
      const n = th * 1000 + r, right = words(n);
      const dropped = r < 100 ? `${words(th % 10 === 0 ? th / 10 : th % 10)} thousand and ${words(r)}`.replace(/^(.*) thousand/, (m) => m) : `${words(Math.floor(th / 10))} thousand, ${words(r)}`;
      const options = mc(right, [[`${words(Math.floor(th / 10) || 1)} thousand${r < 100 ? ' and ' + words(r) : ', ' + words(r)}`, 'That reads a different number. The thousands part is the first two digits together.', 'M_WORDS_OMITS_THOUSAND_GROUP'], [`${words(th)} ${r < 100 ? 'hundred and ' + words(r) : 'hundred, ' + words(r)}`, 'Read the first group of digits before the comma as thousands, not hundreds.', 'M_WORDS_OMITS_THOUSAND_GROUP'], [`${words(th)}, ${r < 100 ? 'one hundred and ' + words(r) : words(r)}`, 'The word thousand is missing. Say the thousands group before the rest.', 'M_WORDS_OMITS_THOUSAND_GROUP']]);
      return { question: `Which of these is ${commas(n)} written in words?`, options, instruction: 'Choose the correct words.',
        hints: ['Cover the last three digits. Read the thousands group first.', 'Then read the last three digits and join them with and.'],
        steps: [`The thousands group is ${th}: ${words(th)} thousand.`, `The last digits ${r} read ${words(r)}. Together: ${right}.`] };
    } }),
  fam({ id: 'g5c.whole.words.cheque', cs: `${W}NUMBERS_TO_WORDS`, form: 'word', rung: 2,
    gen: () => {
      const th = pick([40, 50, 90, 14, 44, 94, 49, 19]), r = pick([randInt(1, 99), randInt(101, 999)]);
      const n = th * 1000 + r, right = words(n), p = person();
      const spell = (w) => w.replace(/forty/g, 'fourty').replace(/ninety/g, 'ninty').replace(/fourteen/g, 'forteen').replace(/fifty/g, 'fivty');
      if (spell(right) === right) return null;
      const options = mc(right, [[spell(right), 'The number is right but a word is spelt wrongly. Check forty, ninety and the other tens words.', 'M_WORDS_SPELLING_TY'], [`${words(th)} thousand, ${words(r % 100 || r)}`, 'The hundreds are missing from the last group. Read every digit.', 'M_WORDS_OMITS_THOUSAND_GROUP'], [`${words(Math.floor(th / 10))} thousand, ${words(th % 10)} hundred and ${words(r % 100 || 1)}`, 'The first two digits make the thousands group together.', 'M_WORDS_OMITS_THOUSAND_GROUP']]);
      return { question: `${p.name} must write the amount sh ${commas(n)} in words on a cheque. Which is written correctly?`, options, instruction: 'Choose the correct spelling and wording.',
        hints: ['First say the thousands group, then the rest.', 'Check the spelling of the tens words, such as forty and ninety.'], steps: [`Thousands group: ${words(th)} thousand.`, `Whole amount: ${right}.`] };
    } }),
  fam({ id: 'g5c.whole.words.spot', cs: `${W}NUMBERS_TO_WORDS`, form: 'spot', rung: 3,
    gen: () => {
      const th = pick([40, 50, 90, 60]), r = randInt(101, 999), n = th * 1000 + r;
      if (r % 10 === 0) return null;
      const right = words(n), bad = `${words(th / 10)} thousand, ${words(r)}`;
      const p = person();
      return { question: `${p.name} writes ${commas(n)} in words. Which step has the mistake?`,
        working: [{ text: `Step 1: Split the number into groups: ${th} | ${r}.`, ok: true }, { text: `Step 2: Read the first group as ${words(th / 10)} thousand.`, ok: false }, { text: `Step 3: Join it to the last group: ${bad}.`, ok: true }],
        fix: `The first group is ${th}, so it is ${words(th)} thousand. The correct words are: ${right}.`, mis: 'M_WORDS_OMITS_THOUSAND_GROUP',
        hints: ['Read the first group of digits again.'], steps: [`${th} thousand is ${words(th)} thousand.`, right] };
    }, check: () => true }),

  // ---------------------------------------------------------------- WORDS_TO_SYMBOLS
  fam({ id: 'g5c.whole.sym.news', cs: `${W}WORDS_TO_SYMBOLS`, form: 'word', rung: 2,
    gen: () => {
      const th = randInt(10, 99), r = pick([randInt(1, 9), randInt(11, 99), randInt(101, 999)]);
      if (th % 10 === 0 && Math.random() < 0.5) return null;
      const n = th * 1000 + r, t = TOWNS[randInt(0, 5)];
      const asHeard = Number(`${th}${r}`), pad = r < 10 ? Number(`${th}0${r}`) : r < 100 ? Number(`${th}${r}`) : null;
      return { question: `A report says the population of a small town near ${t} is ${words(n)}. Write that number in figures, without a comma.`, answer: n,
        wrong: [[asHeard, 'Every group after thousand has three digits. Put zeros in the places the words do not mention.', 'M_SYMBOLS_MISSING_PLACEHOLDER'], [Number(`${th}0${String(r).padStart(3, '0')}`), 'Write the words as spoken, but keep exactly three digits after the thousands: that is one 0 too many here.', 'M_SYMBOLS_WRITE_AS_HEARD'], [Number(`${th}${String(r).padStart(4, '0')}`), 'After the thousands there are only three places, not four.', 'M_SYMBOLS_WRITE_AS_HEARD'], [th * 1000, 'The last part of the words is missing in your number.', 'M_SYMBOLS_MISSING_PLACEHOLDER']],
        hints: ['Write the thousands part first, then the three digits after it.', 'A place not named in the words holds 0.'],
        steps: [`${words(th)} thousand is ${commas(th * 1000)}.`, `Add ${r}: ${commas(n)}.`], chk: (x) => x - th * 1000 === r };
    } }),
  fam({ id: 'g5c.whole.sym.match', cs: `${W}WORDS_TO_SYMBOLS`, form: 'direct', rung: 1,
    gen: () => {
      const th = randInt(11, 19), r = randInt(1, 9) * 100 + randInt(1, 9) * pick([0, 1]), n = th * 1000 + r;
      const ty = (th - 10) * 10000 + r;
      const options = mc(commas(n), [[commas(ty), `You heard ${words(th)} as a ty number. ${th} is a teen number, one ten and some ones.`, 'M_SYMBOLS_TEEN_TY'], [commas(Number(`${th}${r % 100 === 0 ? r / 100 : r}`)), 'A group after thousand must have three digits. Fill the empty places with 0.', 'M_SYMBOLS_MISSING_PLACEHOLDER'], [commas(th * 1e4 + r), 'That number has thousands in the wrong place. Count the digits.', 'M_SYMBOLS_WRITE_AS_HEARD']]);
      return { question: `Match the words to the numeral: ${words(n)}.`, options, instruction: 'Choose the correct figures.',
        hints: ['Teen words, like seventeen, mean 1 ten and some ones.', 'Write the thousands group, then exactly three digits.'],
        steps: [`${words(th)} thousand is ${th},000.`, `Add the rest: ${commas(n)}.`] };
    } }),
  fam({ id: 'g5c.whole.sym.dictate', cs: `${W}WORDS_TO_SYMBOLS`, form: 'steps', rung: 3,
    gen: () => {
      const a = randInt(10, 99), b = randInt(1, 9) * 100 + randInt(0, 9), c = randInt(1, 99), p = person();
      if (a % 10 === 0 || b % 100 === 0) return null;
      const n1 = a * 1000 + c, n2 = a * 1000 + b;
      return { question: `${p.name} is told two numbers to write: ${words(n1)}, and ${words(n2)}.`,
        parts: [
          { prompt: `Write the first number in figures, no comma: ${words(n1)}.`, answer: n1, wrong: [[Number(`${a}${c}`), 'Zeros are needed in the places that are not mentioned.', 'M_SYMBOLS_MISSING_PLACEHOLDER'], [Number(`${a}0${c}`), 'After thousand there are three places. Fill the empty one.', 'M_SYMBOLS_WRITE_AS_HEARD'], [a * 1000, 'The last part of the words is missing in your number.', 'M_SYMBOLS_MISSING_PLACEHOLDER']] },
          { prompt: `Write the second number in figures, no comma: ${words(n2)}.`, answer: n2, wrong: [[Number(`${a}${b}0`), 'Put the thousands group first and then exactly three digits.', 'M_SYMBOLS_WRITE_AS_HEARD'], [Number(`${a}${String(b).replace(/0/g, '')}`), 'Zeros hold places. Do not leave them out.', 'M_SYMBOLS_MISSING_PLACEHOLDER'], [a * 1000 + b + 1000, 'Check the thousands group again.', 'M_SYMBOLS_TEEN_TY']] },
        ],
        steps: [`${words(a)} thousand is ${a},000.`, `First number: ${commas(n1)}.`, `Second number: ${commas(n2)}.`], chk: (x, v) => v[0] === n1 && v[1] === n2 };
    } }),

  // ---------------------------------------------------------------- COMPARE_NUMBERS
  fam({ id: 'g5c.whole.cmp.longer', cs: `${W}COMPARE_NUMBERS`, form: 'word', rung: 1,
    gen: () => {
      const big = randInt(10000, 40000), s1 = randInt(5000, 9999), s2 = randInt(5000, 9999);
      if (Math.abs(s1 - s2) < 300 || Math.floor(s1 / 1000) <= Math.floor(big / 10000) || Math.floor(s2 / 1000) <= Math.floor(big / 10000)) return null;
      const [x, y, z] = shuffle([big, s1, s2]), n = shuffle(SCHOOLS).slice(0, 3);
      const options = mc(commas(big), [[commas(Math.max(s1, s2)), `Count the digits first. ${commas(big)} has five digits and ${commas(Math.max(s1, s2))} has four, so ${commas(big)} is the largest.`, 'M_COMPARE_FIRST_DIGIT_ONLY'], [commas(Math.min(s1, s2)), `${commas(big)} has more digits, so it is bigger than ${commas(Math.min(s1, s2))}.`, 'M_COMPARE_FIRST_DIGIT_ONLY']]);
      return { question: `Three schools collect money for a charity: ${n[0]} school ${commas(x)} shillings, ${n[1]} school ${commas(y)} shillings and ${n[2]} school ${commas(z)} shillings. Which amount is the largest?`, options, instruction: 'Choose the amount.',
        hints: ['Count the digits first. The number with more digits is larger.', 'If two numbers have the same number of digits, compare from the left.'], steps: [`${commas(big)} has five digits. The other two have four digits.`, `The largest is ${commas(big)}.`] };
    } }),
  fam({ id: 'g5c.whole.cmp.symbol', cs: `${W}COMPARE_NUMBERS`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(10000, 99999);
      const t = a - (a % 100);
      const b = pick([a + 90, a - 90, a + 9000, a - 9000, a + 900, a - 900]);
      if (b < 10000 || b > 99999 || b === a) return null;
      const right = a > b ? '>' : '<';
      const options = mc(right, [[right === '>' ? '<' : '>', 'The symbol is the wrong way round. The wide, open side faces the bigger number.', 'M_COMPARE_SYMBOL_DIRECTION'], ['=', 'The two numbers are not the same. Compare the digits from the left.', 'M_COMPARE_FIRST_DIGIT_ONLY']]);
      return { question: `Fill in the symbol so the statement is true, using the largest number as the guide: ${commas(a)} ___ ${commas(b)}`, options, instruction: 'Choose >, < or =.',
        hints: ['Compare the digits from the left, place by place.', 'The open side of the symbol faces the larger number.'], steps: [`Compare from the left until the digits differ: ${commas(a)} and ${commas(b)}.`, `${commas(a)} ${right} ${commas(b)}.`] };
    } }),
  fam({ id: 'g5c.whole.cmp.explain', cs: `${W}COMPARE_NUMBERS`, form: 'why', rung: 3,
    gen: () => {
      const a = randInt(1, 9) * 1000 + randInt(100, 999), b = randInt(1, 4) * 10000 + randInt(1000, 9999), s = person(), t = person();
      if (!distinct(a, b) || s.name === t.name) return null;
      const small = String(a), big = String(b);
      const options = mc(`${commas(b)} is larger because it has ${big.length} digits and ${commas(a)} has only ${small.length}`, [[`${commas(a)} is larger because its first digit, ${small[0]}, is larger than ${big[0]}`.replace(/^(.*)$/, (m) => (Number(small[0]) > Number(big[0]) ? m : `${commas(a)} is larger because its first digit, ${small[0]}, is greater`)), 'The first digit does not decide it. A number with more digits is always larger.', 'M_COMPARE_FIRST_DIGIT_ONLY'], [`They are about the same, because both start with similar digits`, 'Numbers with a different number of digits are never close in size like that.', 'M_COMPARE_FIRST_DIGIT_ONLY']]);
      return { question: `${s.name} says ${commas(a)} is the larger number because its first digit looks large. ${t.name} says ${commas(b)} is larger. Who is right, and why?`, options, instruction: 'Choose the best reason.',
        hints: ['Count the digits in each number.', 'More digits means a larger number, whatever the first digit is.'], steps: [`${commas(a)} has ${small.length} digits. ${commas(b)} has ${big.length} digits.`, `${commas(b)} is larger.`] };
    } }),

  // ---------------------------------------------------------------- ORDER_NUMBERS
  fam({ id: 'g5c.whole.ord.increasing', cs: `${W}ORDER_NUMBERS`, form: 'direct', rung: 2,
    gen: () => {
      const base = randInt(2, 9) * 10000 + randInt(1, 9) * 1000;
      const set = [...new Set([base + randInt(1, 9) * 100 + randInt(0, 9) * 10 + randInt(1, 9), base + randInt(1, 9) * 100 + randInt(0, 9) * 10 + randInt(1, 9), base + randInt(1, 9) * 100 + randInt(0, 9) * 10 + randInt(1, 9)])];
      if (set.length < 3) return null;
      const asc = [...set].sort((x, y) => x - y), shown = shuffle(set);
      if (JSON.stringify(shown) === JSON.stringify(asc)) return null;
      const lastDigit = [...set].sort((x, y) => (x % 10) - (y % 10) || x - y);
      const desc = [...asc].reverse();
      const f = (l) => l.map(commas).join('; ');
      const options = mc(f(asc), [[f(desc), 'This goes down, from the largest. Increasing means getting bigger.', 'M_ORDER_DIRECTION_CONFUSED'], [f(lastDigit), 'You sorted by the ones digit. Sort by the biggest place that differs, starting from the left.', 'M_ORDER_LAST_DIGIT']]);
      return { question: `Arrange these numbers in increasing order, from the smallest: ${shown.map(commas).join('; ')}`, options, instruction: 'Choose the correct order.',
        hints: ['The numbers start with the same digits. Find the first place from the left where they differ.', 'Increasing order means smallest first.'], steps: ['Line the numbers up in a chart and compare place by place from the left.', `Smallest to largest: ${f(asc)}.`] };
    } }),
  fam({ id: 'g5c.whole.ord.distances', cs: `${W}ORDER_NUMBERS`, form: 'word', rung: 2,
    gen: () => {
      const d = [randInt(11, 99) * 100 + randInt(1, 9), randInt(11, 99) * 100 + randInt(1, 9), randInt(11, 99) * 100 + randInt(1, 9)];
      if (new Set(d).size < 3) return null;
      const towns = shuffle(['Mombasa', 'Kisumu', 'Eldoret', 'Garissa', 'Lodwar']).slice(0, 3);
      const rank = [...d].sort((x, y) => x - y);
      const k = randInt(0, 2);
      const asked = ['nearest', 'furthest', 'middle one'][k];
      const mid = rank[1], far = rank[2], near = rank[0];
      const ans = [near, far, mid][k], idx = d.indexOf(ans);
      return { question: `The distances in metres from a school to three markets are: ${towns[0]} ${commas(d[0])}, ${towns[1]} ${commas(d[1])} and ${towns[2]} ${commas(d[2])}. Put them in order from smallest to largest. Which market is the ${asked}? Give the number of metres.`, answer: ans,
        wrong: [...[near, far, mid].filter(v => v !== ans).map(v => [v, 'That is another distance in the list. Put all three in order from smallest to largest, then pick the one asked.', 'M_ORDER_DIRECTION_CONFUSED']), [d.reduce((a, b) => a + b, 0), 'Adding is not needed. Put the distances in order.', 'M_ORDER_DIRECTION_CONFUSED'], [d.slice().sort((x, y) => (x % 10) - (y % 10))[0], 'You compared the ones digits. Compare from the left, starting with the biggest place.', 'M_ORDER_LAST_DIGIT']],
        hints: ['Write the three distances in a list and order them.', 'Smallest to largest: the first is the nearest, the last is the furthest.'], steps: [`In order: ${rank.map(commas).join(', ')}.`, `The ${asked} is ${commas(ans)} metres.`], chk: (x) => rank.includes(x) };
    } }),
  fam({ id: 'g5c.whole.ord.out-of-place', cs: `${W}ORDER_NUMBERS`, form: 'spot', rung: 3,
    gen: () => {
      const b = randInt(2, 8) * 10000 + randInt(1, 9) * 1000, s = [b + 105, b + 158, b + 581, b + 815];
      const k = randInt(0, 1);
      const list = k === 0 ? [s[0], s[2], s[1], s[3]] : [s[0], s[1], s[2], s[3]];
      const wrongList = k === 0 ? list : [s[0], s[1], s[3], s[2]];
      const p = person();
      return { question: `${p.name} arranges these numbers in increasing order: ${shuffle(s).map(commas).join('; ')}. Which step of ${p.her} working has the mistake?`,
        working: [{ text: `Step 1: The four numbers share their first two digits, so look at the places after them.`, ok: true }, { text: `Step 2: Sort by the ones digit: ${[...s].sort((x, y) => x % 10 - y % 10).map(commas).join('; ')}`, ok: false }, { text: `Step 3: So the order is ${[...s].sort((x, y) => x % 10 - y % 10).map(commas).join('; ')}`, ok: true }],
        fix: `When the leading digits match, compare the next place, not the ones. The correct order is ${s.map(commas).join('; ')}.`, mis: 'M_ORDER_LAST_DIGIT', hints: ['Which digit should decide the order?'], steps: [`Correct order: ${s.map(commas).join('; ')}.`] };
    }, check: () => true }),

  // ---------------------------------------------------------------- ROUND_NEAREST_HUNDRED
  fam({ id: 'g5c.whole.rh.fees', cs: `${W}ROUND_NEAREST_HUNDRED`, form: 'word', rung: 1,
    gen: () => {
      const n = randInt(10000, 99999), tens = Math.floor(n / 10) % 10, ones = n % 10, h = rnd(n, 100), p = person();
      const down = h < n;
      const lowest = n - (n % 100);
      const wr = down
        ? [[h + 100, 'You rounded in steps. Look only at the tens digit, then stop.', 'M_ROUND_CHAIN_ROUNDING'], [h - 100, 'When you round down the hundreds digit stays the same.', 'M_ROUND_DOWN_DECREASES_DIGIT'], [Math.floor(n / 100), 'Rounding keeps the number about the same size. Write zeros for the tens and ones.', 'M_ROUND_DROPS_DIGITS']]
        : [[h - 100, 'When the tens digit is 5 or more, round up.', 'M_ROUND_FIVE_DOWN'], [Math.floor(n / 100), 'Rounding keeps the number about the same size. Write zeros for the tens and ones.', 'M_ROUND_DROPS_DIGITS'], [rnd(n, 1000), 'That is the nearest thousand. Round to the nearest hundred.', 'M_ROUND_WRONG_PLACE'], [lowest, 'Look at the tens digit to decide.', 'M_ROUND_FIVE_DOWN']];
      if (down && !(tens === 4 && ones >= 5)) return null;
      if (!down && tens !== 5 && Math.random() < 0.7) return null;
      return { question: `A matatu company earned sh ${commas(n)} this month. ${p.name} writes the amount to the nearest hundred shillings in a report. What does ${p.she} write?`, answer: h, wrong: wr,
        hints: ['Underline the hundreds digit. Look at the digit to its right, the tens digit.', 'Tens digit 5 or more: round up. Less than 5: round down.'], steps: [`The tens digit is ${tens}.`, `${commas(n)} rounds to ${commas(h)}.`], chk: (x) => Math.abs(x - n) <= 50 && x % 100 === 0 };
    } }),
  fam({ id: 'g5c.whole.rh.which', cs: `${W}ROUND_NEAREST_HUNDRED`, form: 'direct', rung: 2,
    gen: () => {
      const h = randInt(100, 990) * 100, ks = [h + 49, h - 50, h + 30, h - 49, h + 51, h - 51].map(x => x + randInt(0, 1) * 0);
      const pickN = pick(ks), right = rnd(pickN, 100);
      if (right !== h) return null;
      const options = mc(commas(right), [[commas(right + 100), 'You looked at more than the tens digit. Only the tens digit decides.', 'M_ROUND_CHAIN_ROUNDING'], [commas(right - 100), 'The hundreds digit should stay or go up by one at most, never down by one for rounding the nearest.', 'M_ROUND_DOWN_DECREASES_DIGIT'], [commas(Math.floor(right / 100)), 'The answer is the same size as the number, with zeros in the last two places.', 'M_ROUND_DROPS_DIGITS']]);
      return { question: `Which number is ${commas(pickN)} closest to on a number line marked in hundreds?`, options, instruction: 'Choose the nearest hundred.',
        hints: ['Find the two hundreds the number lies between.', 'Which one is it closer to? Check the tens digit.'], steps: [`${commas(pickN)} lies between ${commas(fl(pickN, 100))} and ${commas(fl(pickN, 100) + 100)}.`, `It is closer to ${commas(right)}.`] };
    } }),
  fam({ id: 'g5c.whole.rh.list', cs: `${W}ROUND_NEAREST_HUNDRED`, form: 'why', rung: 3,
    gen: () => {
      const h = randInt(100, 990) * 100, ok = [h - 50, h + 49], no = [h + 50, h - 51];
      const t = pick(ok), bad = pick(no);
      const options = mc(commas(t), [[commas(bad), `${commas(bad)} rounds to ${commas(rnd(bad, 100))}, not ${commas(h)}.`, 'M_ROUND_CHAIN_ROUNDING'], [commas(h + 100 + 30), 'It rounds to a different hundred.', 'M_ROUND_DOWN_DECREASES_DIGIT'], [commas(h - 100 - 20), 'It rounds to a different hundred.', 'M_ROUND_DOWN_DECREASES_DIGIT']]);
      return { question: `A shopkeeper rounds every price to the nearest hundred shillings. Which of these prices becomes sh ${commas(h)}?`, options, instruction: 'Choose the number.',
        hints: ['Round each number to the nearest hundred and compare.', 'A tens digit of 5 or more rounds up.'], steps: [`${commas(t)} rounds to ${commas(h)}.`, `${commas(bad)} rounds to ${commas(rnd(bad, 100))}.`] };
    } }),

  // ---------------------------------------------------------------- ROUND_NEAREST_THOUSAND
  fam({ id: 'g5c.whole.rt.crowd', cs: `${W}ROUND_NEAREST_THOUSAND`, form: 'word', rung: 1,
    gen: () => {
      const n = randInt(10000, 99999), hund = Math.floor(n / 100) % 10, t = rnd(n, 1000), p = person();
      const nines = Math.floor(n / 1000) % 10 === 9 && hund >= 5;
      const wr = hund >= 5
        ? [[t - 1000, 'When the hundreds digit is 5 or more, round up.', 'M_ROUND_FIVE_DOWN'], [rnd(n, 100), 'That is the nearest hundred. Round to the nearest thousand.', 'M_ROUND_WRONG_PLACE'], [Math.floor(n / 1000) * 1000 + 10000 * 0 + Number(`${Math.floor(n / 10000) % 10}0` + '0'), '', 'M_ROUND_NO_REGROUP']]
        : [[t + 1000, 'Look only at the hundreds digit.', 'M_ROUND_CHAIN_ROUNDING'], [rnd(n, 100), 'That is the nearest hundred. Round to the nearest thousand.', 'M_ROUND_WRONG_PLACE'], [t - 1000, 'When you round down the thousands digit stays.', 'M_ROUND_DOWN_DECREASES_DIGIT']];
      if (nines) {
        const bad = Number(`${Math.floor(n / 10000)}10000`.replace(/^(\d)10000$/, (m, a) => `${a}10,000`.replace(',', '')));
        wr[2] = [Number(String(Math.floor(n / 10000) % 10) + '10000'), 'You wrote 10 inside the number. Regroup: 9 thousands + 1 thousand makes the next ten thousand.', 'M_ROUND_NO_REGROUP'];
      } else if (hund >= 5) wr[2] = [t + 1000, 'That is one thousand too many. Round up only one thousand.', 'M_ROUND_FIVE_DOWN'];
      return { question: `A football match at Kasarani had ${commas(n)} people. ${p.name} tells friends the crowd to the nearest thousand. What does ${p.she} say?`, answer: t, wrong: wr,
        hints: ['Look at the hundreds digit.', 'Hundreds digit 5 or more: round up to the next thousand.'], steps: [`The hundreds digit is ${hund}.`, `${commas(n)} rounds to ${commas(t)}.`], chk: (x) => Math.abs(x - n) <= 500 && x % 1000 === 0 };
    } }),
  fam({ id: 'g5c.whole.rt.both', cs: `${W}ROUND_NEAREST_THOUSAND`, form: 'steps', rung: 2,
    gen: () => {
      const n = randInt(11000, 98999), p = person();
      const h = rnd(n, 100), t = rnd(n, 1000);
      if (h === t) return null;
      return { question: `The number of people at a harambee in ${pick(TOWNS)} was ${commas(n)}. ${p.name} rounds this number two ways.`,
        parts: [
          { prompt: 'Round the number to the nearest hundred.', answer: h, hint: 'Look at the tens digit.', wrong: [[t, 'That is the nearest thousand. This part asks for the nearest hundred.', 'M_ROUND_WRONG_PLACE'], [Math.floor(n / 100), 'Write zeros in the last two places.', 'M_ROUND_DROPS_DIGITS'], [h + 100, 'Look at the tens digit only.', 'M_ROUND_CHAIN_ROUNDING']] },
          { prompt: 'Round the number to the nearest thousand.', answer: t, hint: 'Look at the hundreds digit.', wrong: [[h, 'That is the nearest hundred. This part asks for the nearest thousand.', 'M_ROUND_WRONG_PLACE'], [t - 1000, 'Check whether the hundreds digit is 5 or more.', 'M_ROUND_FIVE_DOWN'], [t + 1000, 'Look at the hundreds digit only.', 'M_ROUND_CHAIN_ROUNDING']] },
        ],
        steps: [`Nearest hundred: look at the tens digit. ${commas(n)} rounds to ${commas(h)}.`, `Nearest thousand: look at the hundreds digit. ${commas(n)} rounds to ${commas(t)}.`], chk: (x, v) => v[0] % 100 === 0 && v[1] % 1000 === 0 && Math.abs(v[0] - n) <= 50 && Math.abs(v[1] - n) <= 500 };
    } }),
  fam({ id: 'g5c.whole.rt.spot', cs: `${W}ROUND_NEAREST_THOUSAND`, form: 'spot', rung: 3,
    gen: () => {
      const th = randInt(10, 98) * 1000, n = th + randInt(5, 9) * 100 + randInt(10, 90), p = person();
      return { question: `${p.name} rounds ${commas(n)} to the nearest thousand. Which step has the mistake?`,
        working: [{ text: `Step 1: The thousands digit is ${Math.floor(n / 1000) % 10}, so the number lies between ${commas(th)} and ${commas(th + 1000)}.`, ok: true }, { text: `Step 2: The hundreds digit is ${Math.floor(n / 100) % 10}, which is 5 or more, so round down.`, ok: false }, { text: `Step 3: ${commas(n)} rounds to ${commas(th)}.`, ok: true }],
        fix: `A hundreds digit of 5 or more rounds up. ${commas(n)} rounds to ${commas(th + 1000)}.`, mis: 'M_ROUND_FIVE_DOWN', hints: ['Which way does a digit of 5 or more round?'], steps: [`${commas(n)} rounds up to ${commas(th + 1000)}.`] };
    }, check: () => true }),

  // ---------------------------------------------------------------- DIVISIBLE_BY_2
  fam({ id: 'g5c.whole.d2.yesno', cs: `${W}DIVISIBLE_BY_2`, form: 'why', rung: 1,
    gen: () => {
      const n = randInt(1000, 99999), even = n % 2 === 0, p = person();
      if (n % 10 === 0 && Math.random() < 0.5) return null;
      const o = n % 10, firstEven = Number(String(n)[0]) % 2 === 0;
      if (firstEven === even) return null;
      const right = even ? `Yes, the ones digit ${o} is even` : `No, the ones digit ${o} is odd`;
      const options = mc(right, [[even ? `No, the ones digit ${o} is odd` : `Yes, the ones digit ${o} is even`, even ? 'The ones digit is 0, 2, 4, 6 or 8, so it is even.' : 'Look at the ones digit again. It is 1, 3, 5, 7 or 9, so it is odd.', even ? 'M_DIV2_ZERO_NOT_EVEN' : 'M_DIV2_WRONG_DIGIT'], [`${firstEven ? 'Yes' : 'No'}, the first digit ${String(n)[0]} is ${firstEven ? 'even' : 'odd'}`, 'Only the ones digit decides. The first digit does not matter.', 'M_DIV2_WRONG_DIGIT']]);
      return { question: `${p.name} is told there are ${commas(n)} sweets to share equally between 2 children. Is ${commas(n)} divisible by 2, so each child gets the same?`, options, instruction: 'Choose the answer and the reason.',
        hints: ['Look only at the ones digit.', 'A number is divisible by 2 when its ones digit is 0, 2, 4, 6 or 8.'], steps: [`The ones digit of ${commas(n)} is ${o}.`, even ? `${o} is even, so the number is divisible by 2.` : `${o} is odd, so the number is not divisible by 2.`] };
    } }),
  fam({ id: 'g5c.whole.d2.pick', cs: `${W}DIVISIBLE_BY_2`, form: 'direct', rung: 2,
    gen: () => {
      const evens = [randInt(100, 9999) * 10 + pick([0, 2, 4, 6, 8])], odds = [randInt(100, 9999) * 10 + pick([1, 3, 5, 7, 9]), randInt(100, 9999) * 10 + pick([1, 3, 5, 7, 9]), randInt(100, 9999) * 10 + pick([1, 3, 5, 7, 9])];
      const right = evens[0];
      if (!distinct(right, ...odds)) return null;
      const firstEven = odds.find(o => Number(String(o)[0]) % 2 === 0 && o % 2 === 1);
      const options = mc(commas(right), odds.map((o, i) => [commas(o), Number(String(o)[0]) % 2 === 0 ? `The first digit is even but the ones digit ${o % 10} is odd. Only the ones digit decides.` : `The ones digit ${o % 10} is odd, so ${commas(o)} does not divide by 2 exactly.`, 'M_DIV2_WRONG_DIGIT']));
      return { question: `${person().name} wants to share one of these amounts of shillings, below, exactly between 2 people with none left over. Which amount is divisible by 2?`, options, instruction: 'Choose the number.',
        hints: ['Check the ones digit of each number.', 'The ones digit must be 0, 2, 4, 6 or 8.'], steps: [`Only ${commas(right)} ends in ${right % 10}, an even digit.`, `So ${commas(right)} is divisible by 2.`] };
    } }),
  fam({ id: 'g5c.whole.d2.missing', cs: `${W}DIVISIBLE_BY_2`, form: 'word', rung: 3,
    gen: () => {
      const a = randInt(1, 9), b = randInt(1, 9), c = randInt(1, 9), d = pick([0, 2, 4, 6, 8]);
      const ok = pick([1, 2, 4, 6, 8, 0].filter(x => true)), p = person();
      const n = Number(`${a}${b}${c}${ok === 1 ? 2 : ok}`);
      const big = Number(`${a}${b}${c}0`);
      // ask: smallest digit that makes it divisible by 2 (typed): 0
      const wrongDig = [1, 3, 5, 7, 9][randInt(0, 4)];
      return { question: `A number ${a}${b}${c}_ has a missing ones digit. ${p.name} needs the number to be divisible by 2. What is the smallest digit that can go in the box?`, answer: 0,
        wrong: [[1, 'The smallest digit is 0 and it works: a number ending in 0 is divisible by 2. A ones digit of 1 is odd.', 'M_DIV2_ZERO_NOT_EVEN'], [2, '2 works, but 0 is smaller and works too. A number ending in 0 is divisible by 2.', 'M_DIV2_ZERO_NOT_EVEN'], [a, 'The first digit does not matter. Only the ones digit decides.', 'M_DIV2_WRONG_DIGIT'], [4, '4 works, but there is a smaller digit that works as well.', 'M_DIV2_ZERO_NOT_EVEN']],
        hints: ['The ones digit must be even.', 'Is 0 an even digit? Count in twos: 2, 4, 6, 8, 10.'], steps: ['Even ones digits are 0, 2, 4, 6 and 8.', 'The smallest is 0.'], chk: (x) => (Number(`${a}${b}${c}${x}`)) % 2 === 0 && x === 0 };
    } }),

  // ---------------------------------------------------------------- DIVISIBLE_BY_5_AND_10
  fam({ id: 'g5c.whole.d510.packs', cs: `${W}DIVISIBLE_BY_5_AND_10`, form: 'word', rung: 1,
    gen: () => {
      const k = pick([2, 3, 4, 7]), n = k * 100 + pick([0, 5, 1, 3]) + randInt(1, 9) * 10 * pick([0, 1, 1]) , t = pick([5, 10]);
      const ok = n % t === 0, p = person();
      const o = n % 10;
      const right = ok ? `Yes, the ones digit ${o} means it divides by ${t}` : `No, the ones digit ${o} means it does not divide by ${t}`;
      const options = mc(right, [[ok ? `No, the ones digit ${o} means it does not divide by ${t}` : `Yes, the ones digit ${o} means it divides by ${t}`, ok ? (t === 5 ? 'Numbers ending in 0 as well as 5 are divisible by 5.' : 'A number is divisible by 10 when its ones digit is 0.') : 'Check the ones digit against the rule again.', ok ? 'M_DIV5_ONLY_ENDS_5' : 'M_DIV10_ANY_ZERO'], [`Yes, because the number contains a zero somewhere`, 'A zero in the middle does not matter. Only the ones digit decides.', 'M_DIV10_ANY_ZERO']].filter(w => !(String(n).includes('0') === false && w[2] === 'M_DIV10_ANY_ZERO' && false)));
      return { question: `${p.name} has ${n} eggs to pack in trays of ${t}. Test the number with a divisibility rule: can all the eggs be packed with none left over?`, options, instruction: 'Choose the answer and the reason.',
        hints: [`A number is divisible by ${t} when its ones digit is ${t === 5 ? '0 or 5' : '0'}.`, 'Look only at the ones digit.'], steps: [`The ones digit of ${n} is ${o}.`, ok ? `So ${n} is divisible by ${t}.` : `So ${n} is not divisible by ${t}.`] };
    } }),
  fam({ id: 'g5c.whole.d510.sort', cs: `${W}DIVISIBLE_BY_5_AND_10`, form: 'direct', rung: 2,
    gen: () => {
      const n = [randInt(100, 999) * 10, randInt(100, 999) * 10 + 5, randInt(100, 999) * 10 + 2, randInt(100, 999) * 10 + 3];
      const asked = pick(n.slice(0, 1));
      const rows = n.map(x => [commas(x), x % 2 === 0 ? 'divisible' : 'not', x % 5 === 0 ? 'divisible' : 'not', x % 10 === 0 ? 'divisible' : 'not']);
      const target = n[0];
      const options = mc('2, 5 and 10', [['10 only', 'A number that divides by 10 also divides by 2 and by 5. The tests are not separate boxes.', 'M_DIV_TESTS_EXCLUSIVE'], ['2 and 10 only', 'Numbers ending in 0 are divisible by 5 as well.', 'M_DIV5_ONLY_ENDS_5'], ['5 and 10 only', 'Numbers ending in 0 are divisible by 2 as well.', 'M_DIV_TESTS_EXCLUSIVE']]);
      return { question: `Which of 2, 5 and 10 divide ${commas(target)} exactly? Use the divisibility tests, not long division.`, options, instruction: 'Choose all the numbers that divide it.',
        hints: ['A number ending in 0 is divisible by 10.', 'Every multiple of 10 is also a multiple of 2 and of 5.'], steps: [`${commas(target)} ends in 0.`, 'So it is divisible by 10, and therefore by 2 and 5 as well.'] };
    } }),
  fam({ id: 'g5c.whole.d510.pattern', cs: `${W}DIVISIBLE_BY_5_AND_10`, form: 'why', rung: 3,
    gen: () => {
      const n = [10 * randInt(10, 90), 10 * randInt(10, 90) + 5].map(x => x), t = randInt(0, 1), v = n[t], p = person();
      const options = mc(t === 0 ? 'divisible by 10' : 'divisible by 5 but not by 10', [[t === 0 ? 'divisible by 5 but not by 10' : 'divisible by 10', t === 0 ? 'A number ending in 0 is divisible by 10 as well as 5.' : 'It ends in 5, not 0. Only numbers ending in 0 divide by 10.', t === 0 ? 'M_DIV_TESTS_EXCLUSIVE' : 'M_DIV10_ANY_ZERO'], ['divisible by neither', 'A ones digit of 0 or 5 means it divides by 5.', 'M_DIV5_ONLY_ENDS_5'], [t === 0 ? 'divisible by 2 only' : 'divisible by 2 but not 5', t === 0 ? 'It ends in 0, so it is divisible by 5 and 10 too.' : 'It ends in 5, an odd digit, so it is not divisible by 2.', 'M_DIV_TESTS_EXCLUSIVE']]);
      return { question: `${p.name} has noticed that some numbers end in 0 and some in 5. Which statement is true about ${commas(v)}?`, options, instruction: 'Choose the true statement.',
        hints: ['Look at the ones digit of the number.', 'Compare the ones digit with the tests for 5 and 10.'], steps: [`The ones digit of ${commas(v)} is ${v % 10}.`, t === 0 ? 'It ends in 0: divisible by 10, 5 and 2.' : 'It ends in 5: divisible by 5, but not by 10 or 2.'] };
    } }),

  // ---------------------------------------------------------------- DIVISIBILITY_PROBLEMS
  fam({ id: 'g5c.whole.dp.share', cs: `${W}DIVISIBILITY_PROBLEMS`, form: 'word', rung: 1,
    gen: () => {
      const n = randInt(100, 999) * 2 + pick([0, 1]), ok = n % 2 === 0, t = TOWNS[randInt(0, 5)];
      const right = ok ? `Yes, ${n} is even, so each class gets ${n / 2}` : `No, ${n} is odd, so 1 is left over`;
      const options = mc(right, [[ok ? `No, ${n} is even, so 1 is left over` : `Yes, each class gets ${Math.floor(n / 2)} and a half`, ok ? 'An even number divides into two equal shares with nothing left.' : 'A half banana is not allowed here. We need none left over.', 'M_DIVPROB_DIVIDE_ANYWAY'], [`Yes, any number can be shared`, 'Not every number shares exactly. Test the ones digit.', 'M_DIVPROB_DIVIDE_ANYWAY']]);
      return { question: `A school near ${t} has ${commas(n)} bananas. Can they be shared equally between 2 classes with none left over? Use a divisibility test to decide.`, options, instruction: 'Choose the answer and the reason.',
        hints: ['Which divisibility test is needed for sharing between 2?', 'Look at the ones digit.'], steps: [`Sharing between 2 needs divisibility by 2. The ones digit is ${n % 10}.`, ok ? 'It is even, so there is nothing left.' : 'It is odd, so 1 is left.'] };
    } }),
  fam({ id: 'g5c.whole.dp.pack', cs: `${W}DIVISIBILITY_PROBLEMS`, form: 'direct', rung: 2,
    gen: () => {
      const t = pick([5, 10]), n = randInt(20, 99) * 5 + pick([0, 0, 1, 2]), ok = n % t === 0, p = person();
      const wrongTest = t === 5 ? 'No, because it does not end in 0' : 'No, because it ends in 5';
      const right = ok ? `Yes, the test for ${t} says it divides` : `No, the test for ${t} says it does not divide`;
      const options = mc(right, [[ok ? (t === 5 ? 'No, because it does not end in 0' : `No, ${n} does not divide by ${t}`) : `Yes, ${n} divides by ${t}`, ok ? (t === 5 ? 'Numbers ending in 5 are divisible by 5. The test for 10 is a different test.' : 'Check the ones digit against 0.') : 'Check the ones digit.', ok && t === 5 ? 'M_DIVPROB_5_NEEDS_0' : 'M_DIVPROB_DIVIDE_ANYWAY'], [`It cannot be decided without dividing`, 'The divisibility tests decide it from the ones digit alone.', 'M_DIVPROB_DIVIDE_ANYWAY']]);
      return { question: `${p.name} has ${n} mandazi to pack into bags of ${t}, with none left over. Which statement is correct?`, options, instruction: 'Choose the correct statement.',
        hints: [`Underline the group size, ${t}, and write: test for ${t}.`, `Check the ones digit of ${n}.`], steps: [`The test for ${t}: the ones digit must be ${t === 5 ? '0 or 5' : '0'}.`, `${n} ends in ${n % 10}.`] };
    } }),
  fam({ id: 'g5c.whole.dp.coins', cs: `${W}DIVISIBILITY_PROBLEMS`, form: 'steps', rung: 3,
    gen: () => {
      const a = randInt(11, 99) * 10, b = randInt(11, 99) * 10 + 5, p = person();
      return { question: `${p.name} wants to pay exactly with sh 5 coins, and also with sh 10 coins. The first bill is sh ${a} and the second is sh ${b}.`,
        parts: [{ prompt: `How many sh 5 coins pay the first bill, sh ${a}, exactly?`, answer: a / 5, hint: 'Sh 5 coins: how many fives make the bill?', wrong: [[a / 10, 'That is the number of sh 10 coins. This part asks for sh 5 coins.', 'M_DIVPROB_5_NEEDS_0'], [a - 5, 'Share the bill by 5. Do not take 5 away.', 'M_DIVPROB_DIVIDE_ANYWAY'], [a / 2, 'Divide by the value of one coin, which is 5.', 'M_DIVPROB_DIVIDE_ANYWAY']] },
          { prompt: `How many sh 10 coins pay the second bill, sh ${b}, exactly? Write 0 if it cannot be paid exactly with sh 10 coins.`, answer: 0, hint: 'Check the ones digit of the bill against the test for 10.', wrong: [[Math.floor(b / 10), 'The bill ends in 5, so there is 5 left over. It cannot be paid exactly.', 'M_DIVPROB_DIVIDE_ANYWAY'], [b / 5, 'That is the number of sh 5 coins. This part asks for sh 10 coins.', 'M_DIVPROB_5_NEEDS_0'], [b / 10, 'That is not a whole number of coins.', 'M_DIVPROB_DIVIDE_ANYWAY']] }],
        steps: [`${a} ÷ 5 = ${a / 5} coins of sh 5.`, `${b} ends in 5, so it is not divisible by 10: 0 coins of sh 10 pay it exactly.`], chk: (x, v) => v[0] * 5 === a && b % 10 !== 0 && v[1] === 0 };
    } }),

  // ---------------------------------------------------------------- COMMON_FACTORS
  fam({ id: 'g5c.whole.cf.list', cs: `${W}COMMON_FACTORS`, form: 'direct', rung: 1,
    gen: () => {
      const n = pick([12, 18, 20, 24, 30, 36, 28, 40, 45]), fs = []; for (let i = 1; i <= n; i++) if (n % i === 0) fs.push(i);
      const mult = [n, 2 * n, 3 * n, 4 * n], noEnds = fs.filter(f => f !== 1 && f !== n), miss = fs.slice(0, -1).filter((f, i) => i !== 1 && f !== 1);
      const incomplete = fs.filter((f, i) => i < Math.ceil(fs.length / 2) + 0 && i !== fs.length - 2 || f === 1).slice(0, fs.length - 2);
      const options = mc(fs.join(', '), [[mult.join(', '), 'Those are multiples, which grow out of the number. Factors fit into it.', 'M_FACTORS_AS_MULTIPLES'], [noEnds.join(', '), 'Every number has 1 and itself as factors. Include both.', 'M_FACTORS_MISS_1_AND_SELF'], [incomplete.join(', '), 'Some factor pairs are missing. List pairs until they start to repeat.', 'M_FACTORS_INCOMPLETE']]);
      if (incomplete.length === fs.length || incomplete.join() === noEnds.join()) return null;
      return { question: `Which list shows all the factors of ${n}?`, options, instruction: 'Choose the complete list.',
        hints: ['A factor divides the number exactly.', 'List pairs: 1 × the number, 2 × ..., until the pairs repeat.'], steps: [`Pairs: ${fs.filter(f => f <= Math.sqrt(n)).map(f => `${f} × ${n / f}`).join(', ')}.`, `Factors: ${fs.join(', ')}.`] };
    } }),
  fam({ id: 'g5c.whole.cf.common', cs: `${W}COMMON_FACTORS`, form: 'word', rung: 2,
    gen: () => {
      const [a, b] = pick([[8, 12], [12, 18], [18, 24], [16, 24], [20, 30], [14, 28], [15, 25], [12, 30]]), p = person();
      const f = (n) => [...Array(n)].map((_, i) => i + 1).filter(i => n % i === 0);
      const c = f(a).filter(x => b % x === 0);
      return { question: `${p.name} wants to put ${a} mangoes and ${b} oranges into identical boxes, with the same number of each fruit in every box and none left over. How many different box counts are possible, counting the case of one box? Count the common factors of ${a} and ${b}.`, answer: c.length,
        wrong: [[c.length - 1, 'One box holding everything is a common factor too (1). Include 1 and the biggest.', 'M_FACTORS_MISS_1_AND_SELF'], [f(a).length, `That is the number of factors of ${a} alone. Keep only those that are also factors of ${b}.`, 'M_FACTORS_INCOMPLETE'], [Math.min(f(a).length, f(b).length) + 1, 'Check each factor against both numbers.', 'M_FACTORS_INCOMPLETE'], [c.length + 1, 'Check each factor against both numbers.', 'M_FACTORS_AS_MULTIPLES']],
        hints: [`List the factors of ${a}, then of ${b}.`, 'Count the ones that appear in both lists.'], steps: [`Factors of ${a}: ${f(a).join(', ')}. Factors of ${b}: ${f(b).join(', ')}.`, `Common: ${c.join(', ')}. That is ${c.length}.`], chk: (x) => [...Array(Math.min(a, b))].map((_, i) => i + 1).filter(i => a % i === 0 && b % i === 0).length === x };
    } }),
  fam({ id: 'g5c.whole.cf.spot', cs: `${W}COMMON_FACTORS`, form: 'spot', rung: 3,
    gen: () => {
      const [a, b] = pick([[8, 12], [18, 24], [12, 30], [16, 40]]), p = person();
      const f = (n) => [...Array(n)].map((_, i) => i + 1).filter(i => n % i === 0);
      const c = f(a).filter(x => b % x === 0), wrong = c.filter(x => x !== 1);
      return { question: `${p.name} finds the common factors of ${a} and ${b}. Which step has the mistake?`,
        working: [{ text: `Step 1: Factors of ${a}: ${f(a).join(', ')}.`, ok: true }, { text: `Step 2: Factors of ${b}: ${f(b).join(', ')}.`, ok: true }, { text: `Step 3: Common factors: ${wrong.join(', ')}.`, ok: false }],
        fix: `1 is a factor of every number, so it is a common factor too. The common factors are ${c.join(', ')}.`, mis: 'M_FACTORS_MISS_1_AND_SELF', hints: ['Is 1 a factor of both numbers?'], steps: [`Common factors: ${c.join(', ')}.`] };
    }, check: () => true }),

  // ---------------------------------------------------------------- HCF_GCD
  fam({ id: 'g5c.whole.hcf.find', cs: `${W}HCF_GCD`, form: 'word', rung: 1,
    gen: () => {
      const [a, b] = pick([[12, 18], [24, 36], [8, 12], [20, 30], [16, 24], [30, 45], [18, 27], [28, 42], [36, 48], [40, 60]]);
      const g = gcd(a, b), l = lcm(a, b), small = Math.min(a, b), p = person();
      const first = [...Array(small)].map((_, i) => i + 1).filter(i => a % i === 0 && b % i === 0)[1] || 1;
      return { question: `${p.name} lists the factors of ${a} and of ${b}, then picks the biggest number that appears in both lists. Which number does ${p.she} pick?`, answer: g,
        wrong: [[l, 'That is the LCM or a multiple. The HCF divides both numbers, so it cannot be bigger than the smaller one.', 'M_HCF_GIVES_LCM_OR_PRODUCT'], [a * b, 'That is the product. The HCF is a factor of both numbers, not bigger than either.', 'M_HCF_GIVES_LCM_OR_PRODUCT'], [first, 'That is a common factor but not the highest. List all the common factors and pick the greatest.', 'M_HCF_ANY_COMMON'], [small === g ? 1 : small, `Does ${small} divide the other number exactly? Test before you decide.`, 'M_HCF_SMALLER_NUMBER']],
        hints: ['List the factors of each number.', 'Pick the greatest factor that is on both lists.'], steps: [`Common factors of ${a} and ${b} include ${g}.`, `The greatest is ${g}.`], chk: (x) => a % x === 0 && b % x === 0 && gcd(a / x, b / x) === 1 };
    } }),
  fam({ id: 'g5c.whole.hcf.truefalse', cs: `${W}HCF_GCD`, form: 'why', rung: 2,
    gen: () => {
      const [a, b] = pick([[12, 18], [24, 36], [20, 30], [16, 24], [30, 45], [28, 42]]), g = gcd(a, b), p = person();
      const claimed = pick([g, 2, Math.min(a, b), lcm(a, b)]);
      const ok = claimed === g;
      const options = mc(ok ? 'True: it divides both and no bigger number does' : 'False', [[ok ? 'False: it is too small' : 'True: it divides both', ok ? 'Check whether a bigger number also divides both.' : 'Check: is it the highest common factor, or just a common factor or a multiple?', ok ? 'M_HCF_ANY_COMMON' : claimed === lcm(a, b) ? 'M_HCF_GIVES_LCM_OR_PRODUCT' : claimed === Math.min(a, b) ? 'M_HCF_SMALLER_NUMBER' : 'M_HCF_ANY_COMMON']]);
      return { question: `${p.name} says the GCD of ${a} and ${b} is ${claimed}. The GCD is the greatest common divisor, another name for the HCF. Is ${p.she} right?`, options, instruction: 'Choose true or false.',
        hints: [`Does ${claimed} divide both numbers?`, 'Is there a bigger number that also divides both?'], steps: [`Common factors of ${a} and ${b}: ${[...Array(Math.min(a, b))].map((_, i) => i + 1).filter(i => a % i === 0 && b % i === 0).join(', ')}.`, `The greatest is ${g}.`] };
    } }),
  fam({ id: 'g5c.whole.hcf.three', cs: `${W}HCF_GCD`, form: 'steps', rung: 3,
    gen: () => {
      const [a, b, c] = pick([[12, 18, 30], [24, 36, 60], [16, 24, 40], [20, 30, 50], [18, 27, 45], [14, 21, 35]]), g = gcd(gcd(a, b), c), g2 = gcd(a, b), p = person();
      return { question: `${p.name} finds the HCF of ${a}, ${b} and ${c} in two steps.`,
        parts: [{ prompt: `What is the HCF of ${a} and ${b}?`, answer: g2, hint: 'List the common factors of the first two numbers.', wrong: [[lcm(a, b), 'That is a multiple. The HCF divides both numbers.', 'M_HCF_GIVES_LCM_OR_PRODUCT'], [Math.min(a, b), 'Check that the smaller number divides the larger exactly.', 'M_HCF_SMALLER_NUMBER'], [2, 'That is a common factor, but is there a greater one?', 'M_HCF_ANY_COMMON']] },
          { prompt: `What is the HCF of ${a}, ${b} and ${c} together?`, answer: g, hint: 'It must divide all three numbers.', wrong: [[a * b * c, 'That is far too big to divide all three numbers.', 'M_HCF_GIVES_LCM_OR_PRODUCT'], [Math.min(a, b, c), 'Does the smallest divide all three?', 'M_HCF_SMALLER_NUMBER'], [g2 === g ? 1 : g2, `${g2} divides ${a} and ${b}. Does it divide ${c}?`, 'M_HCF_ANY_COMMON']] }],
        steps: [`HCF of ${a} and ${b} is ${g2}.`, `Then check ${c}: the HCF of all three is ${g}.`], chk: (x, v) => v[1] === g && v[0] === g2 && a % v[1] === 0 && b % v[1] === 0 && c % v[1] === 0 };
    } }),

  // ---------------------------------------------------------------- HCF_PROBLEMS
  fam({ id: 'g5c.whole.hp.ribbon', cs: `${W}HCF_PROBLEMS`, form: 'word', rung: 1,
    gen: () => {
      const [a, b] = pick([[24, 36], [18, 30], [12, 20], [30, 45], [16, 40], [20, 50]]), g = gcd(a, b), p = person();
      return { question: `${p.name}, a tailor in Kisumu, has two ribbons, ${a} m and ${b} m long. ${p.She} cuts both ribbons into equal pieces, so a piece length is a common factor of ${a} and ${b}, as long as possible, with nothing left. How long is each piece, in metres?`, answer: g,
        wrong: [[lcm(a, b), `A piece cannot be longer than the ribbon. A ${lcm(a, b)} m piece cannot come from a ${a} m ribbon.`, 'M_HCFPROB_USES_LCM'], [a / g + b / g, 'That is the number of pieces. The question asks how long each piece is.', 'M_HCFPROB_WRONG_QUANTITY'], [Math.min(a, b), 'Does the shorter ribbon length go into the longer exactly?', 'M_HCFPROB_USES_LCM'], [2, 'That is a possible length, but not the longest.', 'M_HCFPROB_WRONG_QUANTITY']],
        hints: ['A piece must go into both lengths exactly.', 'It should be as long as possible: use the HCF.'], steps: [`The longest equal piece is the HCF of ${a} and ${b}.`, `HCF = ${g} m.`], chk: (x) => a % x === 0 && b % x === 0 && gcd(a / x, b / x) === 1 };
    } }),
  fam({ id: 'g5c.whole.hp.bags', cs: `${W}HCF_PROBLEMS`, form: 'steps', rung: 2,
    gen: () => {
      const [a, b] = pick([[24, 36], [18, 27], [30, 45], [20, 30], [16, 24], [28, 42]]), g = gcd(a, b), p = person();
      return { question: `${p.name} packs ${a} mangoes and ${b} oranges into identical gift bags. Every bag has the same number of mangoes and of oranges, none are left over, and the number of bags is a common factor of ${a} and ${b}. ${p.She} wants as many bags as possible.`,
        parts: [{ prompt: 'How many bags can be made?', answer: g, hint: 'The number of bags must divide both counts exactly. It should be as large as possible.', wrong: [[lcm(a, b), 'That is a multiple of both. It cannot be more than the number of fruits.', 'M_HCFPROB_USES_LCM'], [a / g, 'That is the number of mangoes in each bag, not the number of bags.', 'M_HCFPROB_WRONG_QUANTITY'], [2, 'That works, but is it the most bags possible?', 'M_HCFPROB_WRONG_QUANTITY']] },
          { prompt: 'How many mangoes are in each bag?', answer: a / g, hint: 'Share the mangoes equally into the bags.', wrong: [[g, 'That is the number of bags. Mangoes per bag is mangoes divided by bags.', 'M_HCFPROB_WRONG_QUANTITY'], [b / g, 'That is the number of oranges in each bag.', 'M_HCFPROB_WRONG_QUANTITY'], [a, 'That is all the mangoes together.', 'M_HCFPROB_WRONG_QUANTITY']] }],
        steps: [`Bags = HCF of ${a} and ${b} = ${g}.`, `Mangoes per bag = ${a} ÷ ${g} = ${a / g}.`], chk: (x, v) => v[0] * v[1] === a && b % v[0] === 0 };
    } }),
  fam({ id: 'g5c.whole.hp.which', cs: `${W}HCF_PROBLEMS`, form: 'why', rung: 3,
    gen: () => {
      const [a, b] = pick([[12, 18], [24, 30], [20, 28], [16, 36]]), g = gcd(a, b), l = lcm(a, b), p = person(), cut = Math.random() < 0.5;
      const q = cut ? `${p.name} packs ${a} kg of rice and ${b} kg of beans into the largest identical sacks, with nothing left over. Which should ${p.she} find, the HCF or the LCM, and what is the sack size?` : `Two bells ring every ${a} and ${b} minutes. When will they ring together again? Which should be found?`;
      const right = cut ? `The HCF: each sack is ${g} kg` : `The LCM: ${l} minutes later`;
      const options = mc(right, [[cut ? `The LCM: each sack is ${l} kg` : `The HCF: ${g} minutes later`, cut ? 'A sack cannot hold more than all the rice. The largest equal sack is the HCF.' : 'A time when both ring again is a multiple of both intervals, so it is the LCM.', cut ? 'M_HCFPROB_USES_LCM' : 'M_LCMPROB_USES_HCF'], [cut ? `The HCF: there are ${a / g + b / g} sacks` : `The LCM: ${a + b} minutes later`, cut ? 'That is how many sacks there are, not the size of each one.' : 'Adding the two intervals does not give the next meeting time. Find the LCM.', cut ? 'M_HCFPROB_WRONG_QUANTITY' : 'M_LCMPROB_ADDS_INTERVALS']]);
      return { question: q, options, instruction: 'Choose the method and the answer.',
        hints: cut ? ['Largest equal sacks that fit both loads: which tool finds the largest number that divides both?', 'Check that the sack size divides both amounts.'] : ['The time must be a multiple of both intervals.', 'Find the least common multiple.'], steps: cut ? [`HCF of ${a} and ${b} is ${g}.`, `Each sack is ${g} kg.`] : [`Multiples of ${a} and ${b}: the first in both is ${l}.`, `They ring together after ${l} minutes.`] };
    } }),

  // ---------------------------------------------------------------- COMMON_MULTIPLES
  fam({ id: 'g5c.whole.cm.list', cs: `${W}COMMON_MULTIPLES`, form: 'direct', rung: 1,
    gen: () => {
      const n = pick([4, 6, 7, 8, 9, 12]), r = (k) => [1, 2, 3, 4].map(i => n * i * k);
      const right = [1, 2, 3, 4].map(i => n * i).join(', ');
      const options = mc(right, [[[n, n + 1, n + 2, n + 3].join(', '), 'Multiples go up in equal jumps of the number. These just count on one at a time.', 'M_MULT_EXCLUDES_SELF'], [[2, 3, 4, 5].map(i => n * i).join(', '), 'The first multiple is the number itself, 1 times the number. Start there.', 'M_MULT_EXCLUDES_SELF'], [[...Array(n)].map((_, i) => i + 1).filter(i => n % i === 0).slice(0, 4).join(', '), 'Those are factors. They fit into the number. Multiples come out of it.', 'M_FACTORS_AS_MULTIPLES']]);
      return { question: `Which list shows the first four multiples of ${n}?`, options, instruction: 'Choose the list.',
        hints: [`Start with ${n} × 1.`, 'Then 2 times the number, 3 times, and so on.'], steps: [`${n} × 1 = ${n}, ${n} × 2 = ${2 * n}, ${n} × 3 = ${3 * n}, ${n} × 4 = ${4 * n}.`, `The list is ${right}.`] };
    } }),
  fam({ id: 'g5c.whole.cm.common', cs: `${W}COMMON_MULTIPLES`, form: 'word', rung: 2,
    gen: () => {
      const [a, b] = pick([[4, 6], [3, 4], [6, 8], [4, 10], [6, 9], [5, 6], [8, 12], [10, 15]]), l = lcm(a, b), p = person();
      const prod = a * b;
      return { question: `${p.name} lists multiples of ${a} and of ${b}. What is the second number that appears in both lists, the second common multiple?`, answer: 2 * l,
        wrong: [[l, `${l} is the first common multiple. The question asks for the second.`, 'M_MULT_PRODUCT_ONLY'], [2 * prod, `Common multiples do not start at ${a} × ${b}. They repeat every ${l}.`, 'M_MULT_PRODUCT_ONLY'], [prod, `Common multiples do not start at ${a} × ${b}. They repeat every ${l}.`, 'M_MULT_PRODUCT_ONLY'], [3 * l, `${3 * l} is the third common multiple.`, 'M_MULT_EXCLUDES_SELF']],
        hints: [`List multiples of ${a} and multiples of ${b}.`, 'Circle the numbers that are in both lists.'], steps: [`Multiples of ${a}: ${[1, 2, 3, 4, 5, 6].map(i => a * i).join(', ')}. Multiples of ${b}: ${[1, 2, 3, 4, 5, 6].map(i => b * i).join(', ')}.`, `Common: ${l}, ${2 * l}, ... The second is ${2 * l}.`], chk: (x) => x % a === 0 && x % b === 0 && x / lcm(a, b) === 2 };
    } }),
  fam({ id: 'g5c.whole.cm.yesno', cs: `${W}COMMON_MULTIPLES`, form: 'spot', rung: 3,
    gen: () => {
      const [a, b] = pick([[2, 6], [3, 9], [4, 12], [5, 10]]), p = person();
      return { question: `${p.name} checks whether ${b} is a common multiple of ${a} and ${b}. Which step has the mistake?`,
        working: [{ text: `Step 1: ${a} × ${b / a} = ${b}, so ${b} is a multiple of ${a}.`, ok: true }, { text: `Step 2: Multiples of ${b} start at ${2 * b}, because ${b} is the number itself.`, ok: false }, { text: `Step 3: So ${b} is not a common multiple of ${a} and ${b}.`, ok: true }],
        fix: `A number is a multiple of itself: ${b} × 1 = ${b}. So ${b} is a common multiple of ${a} and ${b}.`, mis: 'M_MULT_EXCLUDES_SELF', hints: ['Is a number a multiple of itself?'], steps: [`${b} × 1 = ${b}.`, `${b} is a common multiple of ${a} and ${b}.`] };
    }, check: () => true }),

  // ---------------------------------------------------------------- LCM
  fam({ id: 'g5c.whole.lcm.find', cs: `${W}LCM`, form: 'word', rung: 1,
    gen: () => {
      const [a, b] = pick([[4, 6], [6, 8], [3, 5], [4, 10], [6, 9], [8, 12], [5, 6], [9, 12], [10, 15], [12, 18]]), l = lcm(a, b), g = gcd(a, b), p = person();
      return { question: `${p.name} writes the multiples of ${a} in one row and of ${b} in another, then circles the first number found in both rows. Which number is circled?`, answer: l,
        wrong: [[a * b, `That is the product. A smaller number may be a multiple of both. Check the multiples of ${Math.max(a, b)}.`, 'M_LCM_ALWAYS_PRODUCT'], [g, 'That is the HCF. The LCM must be at least as big as the larger number.', 'M_LCM_GIVES_HCF'], [Math.min(a, b), `The LCM is a multiple of both numbers. Is ${Math.min(a, b)} a multiple of ${Math.max(a, b)}?`, 'M_LCM_SMALLER_NUMBER'], [l * 2, 'There is a smaller number that is a multiple of both.', 'M_LCM_ALWAYS_PRODUCT']],
        hints: [`List the multiples of ${Math.max(a, b)}.`, `Find the first one that ${Math.min(a, b)} divides exactly.`], steps: [`Multiples of ${Math.max(a, b)}: ${[1, 2, 3, 4, 5, 6].map(i => Math.max(a, b) * i).join(', ')}.`, `The first that ${Math.min(a, b)} divides is ${l}.`], chk: (x) => x % a === 0 && x % b === 0 && gcd(x / a, x / b) === 1 };
    }, allowNegative: false }),
  fam({ id: 'g5c.whole.lcm.truefalse', cs: `${W}LCM`, form: 'why', rung: 2,
    gen: () => {
      const [a, b] = pick([[3, 9], [4, 6], [6, 8], [4, 12], [5, 10], [6, 9]]), l = lcm(a, b), p = person();
      const claimed = pick([l, a * b, Math.min(a, b), gcd(a, b)]);
      const ok = claimed === l;
      const codeMap = claimed === a * b ? 'M_LCM_ALWAYS_PRODUCT' : claimed === gcd(a, b) ? 'M_LCM_GIVES_HCF' : 'M_LCM_SMALLER_NUMBER';
      const options = mc(ok ? 'True: it is the smallest number both divide into' : 'False', [[ok ? 'False: the LCM is the product' : 'True', ok ? 'The LCM is not always the product. Check for a smaller common multiple.' : 'Check: is it a multiple of both numbers, and is it the smallest such number?', ok ? 'M_LCM_ALWAYS_PRODUCT' : codeMap]]);
      return { question: `${p.name} claims that ${claimed} is the smallest number both ${a} and ${b} go into evenly. Is the claim true or false? Give a reason.`, options, instruction: 'Choose true or false.',
        hints: [`Is ${claimed} a multiple of ${a}? Of ${b}?`, 'Is there a smaller number that is a multiple of both?'], steps: [`The first number in both lists of multiples is ${l}.`, `So the LCM of ${a} and ${b} is ${l}.`] };
    } }),
  fam({ id: 'g5c.whole.lcm.three', cs: `${W}LCM`, form: 'steps', rung: 3,
    gen: () => {
      const [a, b, c] = pick([[2, 3, 4], [2, 3, 5], [3, 4, 6], [2, 4, 5], [3, 5, 6], [4, 6, 8], [2, 5, 10]]), l2 = lcm(a, b), l = lcm(l2, c), p = person();
      return { question: `${p.name} looks for the least common multiple of ${a}, ${b} and ${c}, working in two steps.`,
        parts: [{ prompt: `What is the LCM of ${a} and ${b}?`, answer: l2, hint: 'List multiples of the larger number.', wrong: [[a * b, 'A smaller number may be a multiple of both.', 'M_LCM_ALWAYS_PRODUCT'], [gcd(a, b), 'The LCM is at least as big as the larger number.', 'M_LCM_GIVES_HCF'], [Math.min(a, b), 'That is not a multiple of the larger number.', 'M_LCM_SMALLER_NUMBER']].filter(x => x[0] !== l2) },
          { prompt: `What is the LCM of ${a}, ${b} and ${c} together?`, answer: l, hint: `It must be a multiple of ${c} as well as of the first answer.`, wrong: [[a * b * c, 'Multiplying all three makes a common multiple, but not the least.', 'M_LCM_ALWAYS_PRODUCT'], [l2, `Is ${l2} a multiple of ${c}?`, 'M_LCM_SMALLER_NUMBER'], [Math.max(a, b, c), 'Is the biggest number a multiple of all three?', 'M_LCM_SMALLER_NUMBER']].filter(x => x[0] !== l) }],
        steps: [`LCM of ${a} and ${b} is ${l2}.`, `Next multiples of ${l2} until ${c} divides: ${l}.`], chk: (x, v) => v[1] % a === 0 && v[1] % b === 0 && v[1] % c === 0 && v[1] === l };
    } }),

  // ---------------------------------------------------------------- LCM_PROBLEMS
  fam({ id: 'g5c.whole.lp.matatu', cs: `${W}LCM_PROBLEMS`, form: 'word', rung: 2,
    gen: () => {
      const [a, b] = pick([[12, 18], [10, 15], [8, 12], [6, 8], [20, 30], [15, 20]]), l = lcm(a, b), p = person();
      return { question: `Two lamps on a tower flash, one every ${a} seconds and the other every ${b} seconds. They flash together now. After how many seconds will they flash together again, a common multiple of ${a} and ${b}?`, answer: l,
        wrong: [[gcd(a, b), 'That is the HCF. They leave together at a time that is a multiple of both intervals.', 'M_LCMPROB_USES_HCF'], [a + b, `Adding the intervals does not work: does the first leave again after ${a + b} minutes?`, 'M_LCMPROB_ADDS_INTERVALS'], [a * b, 'That is a time they leave together, but there is an earlier one.', 'M_LCMPROB_ADDS_INTERVALS'], [l * 2, 'That is later than the first time.', 'M_LCMPROB_ADDS_INTERVALS']],
        hints: ['List the leaving times of each matatu in minutes after 8:00.', 'Find the first time that is in both lists.'], steps: [`First matatu: ${[1, 2, 3, 4, 5].map(i => a * i).join(', ')}.`, `Second matatu: ${[1, 2, 3, 4, 5].map(i => b * i).join(', ')}. First match: ${l} minutes.`], chk: (x) => x % a === 0 && x % b === 0 && gcd(x / a, x / b) === 1 };
    } }),
  fam({ id: 'g5c.whole.lp.clock', cs: `${W}LCM_PROBLEMS`, form: 'direct', rung: 3,
    gen: () => {
      const [a, b] = pick([[12, 18], [10, 15], [8, 12], [20, 30], [15, 20], [6, 9]]), l = lcm(a, b), p = person(), h0 = pick([7, 8, 9]);
      const t = (m) => { const mm = (h0 * 60 + m); return `${Math.floor(mm / 60) % 12 || 12}:${String(mm % 60).padStart(2, '0')} ${mm >= 720 ? 'p.m.' : 'a.m.'}`; };
      if (l > 90) return null;
      const options = mc(t(l), [[t(gcd(a, b)), 'You used the HCF. They ring together at a multiple of both intervals.', 'M_LCMPROB_USES_HCF'], [t(a + b), 'You added the two intervals. List the times for each bell instead.', 'M_LCMPROB_ADDS_INTERVALS'], [t(2 * l), 'That is a later time. Look for the first time both ring.', 'M_LCMPROB_ADDS_INTERVALS']]);
      return { question: `Two bells at a school ring every ${a} minutes and every ${b} minutes. At ${t(0)} they ring together. At what time will they ring together again?`, options, instruction: 'Choose the time.',
        hints: ['List the times each bell rings.', 'Find the first time that appears for both.'], steps: [`The LCM of ${a} and ${b} is ${l}.`, `${t(0)} plus ${l} minutes is ${t(l)}.`] };
    } }),
  fam({ id: 'g5c.whole.lp.packs', cs: `${W}LCM_PROBLEMS`, form: 'steps', rung: 3,
    gen: () => {
      const [a, b] = pick([[6, 8], [4, 6], [12, 18], [10, 15], [6, 9]]), l = lcm(a, b), p = person();
      return { question: `A shop sells exercise books in packs of ${a} and pencils in packs of ${b}. ${p.name} wants exactly the same number of each, and buys whole packs only, so each total is a multiple of its pack size.`,
        parts: [{ prompt: 'What is the smallest number of books and of pencils that are equal?', answer: l, hint: 'The number must be a multiple of both pack sizes.', wrong: [[gcd(a, b), 'That is too small to be a multiple of both pack sizes.', 'M_LCMPROB_USES_HCF'], [a + b, 'Adding the pack sizes does not make equal numbers.', 'M_LCMPROB_ADDS_INTERVALS'], [a * b, 'That works, but there is a smaller number that does too.', 'M_LCM_ALWAYS_PRODUCT']] },
          { prompt: `How many packs of ${a} books must ${p.she} buy?`, answer: l / a, hint: 'Share the number of books by the pack size.', wrong: [[l / b, `That is the number of packs of ${b}.`, 'M_LCMPROB_USES_HCF'], [l, 'That is the number of books, not packs.', 'M_LCMPROB_ADDS_INTERVALS'], [a, 'That is the number of books in one pack.', 'M_LCMPROB_ADDS_INTERVALS']] }],
        steps: [`LCM of ${a} and ${b} is ${l}.`, `Packs of ${a}: ${l} ÷ ${a} = ${l / a}.`], chk: (x, v) => v[0] % a === 0 && v[0] % b === 0 && v[1] * a === v[0] };
    } }),
];
