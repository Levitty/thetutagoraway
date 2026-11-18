// ============================================================================
// GRADE 7 NUMBERS AND ALGEBRA: new question forms, written in advance.
// Whole numbers, factors, fractions, decimals, squares, expressions, equations
// and inequalities. Every family is unreviewed until a person signs it off.
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family, round, commas, oneCodeEach } from './core.js';
import { person, twoPeople, sh, price } from './kenya.js';

const fam = (def) => family({ reviewed: false, ...def });

// ---- helpers ---------------------------------------------------------------
const shuffle = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (a, b) => (a / gcd(a, b)) * b;
const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
const distinct = (...v) => new Set(v).size === v.length;
const circ = (closed) => (closed ? 'a closed circle' : 'an open circle');
const digitsOf = (n) => String(n).split('').map(Number);
const digitSum = (n) => digitsOf(n).reduce((s, x) => s + x, 0);
const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const below100 = (r) => (r < 20 ? ONES[r] : TENS[Math.floor(r / 10)] + (r % 10 ? '-' + ONES[r % 10] : ''));
const below1000 = (n) => { const h = Math.floor(n / 100), r = n % 100; const out = []; if (h) out.push(ONES[h] + ' hundred'); if (r) out.push((h ? 'and ' : '') + below100(r)); return out.join(' '); };
export const words = (n) => {
  const out = []; let rem = n;
  for (const [v, name] of [[1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']]) if (rem >= v) { out.push(`${below1000(Math.floor(rem / v))} ${name}`); rem %= v; }
  if (rem) out.push((out.length && rem < 100 ? 'and ' : '') + below1000(rem));
  return out.join(' ');
};
const PLACES = ['units', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions', 'ten millions', 'hundred millions'];
// a/b in lowest terms, written as a fraction or whole number
const frac = (n, d) => { const g = gcd(Math.abs(n), d); const a = n / g, b = d / g; return b === 1 ? String(a) : `${a}/${b}`; };
const mixed = (n, d) => { const g = gcd(Math.abs(n), d); const a = n / g, b = d / g; if (b === 1) return String(a); if (a > b) return `${Math.floor(a / b)} ${a % b}/${b}`; return `${a}/${b}`; };

export const FAMILIES = [
  // ======================================================================
  // WHOLE NUMBERS
  // ======================================================================
  fam({ id: 'g7.whole.place-chart', skill: 'G7_PLACE_VALUE', outcome: 'MATH.G7.NUMBER.WHOLE_NUMBERS.a', cskill: 'MATH.G7.NUMBER.WHOLE_NUMBERS.TOTAL_VALUE_HM', rung: 2, form: 'table',
    draw: () => {
      const L = randInt(7, 9); const ds = Array.from({ length: L }, () => randInt(1, 9));   // ds[k] is the digit worth 10^k
      const j = randInt(L - 3, L - 1), k = randInt(2, 4);   // a big place and a small one
      const A = ds[j] * 10 ** j, B = ds[k] * 10 ** k;
      return new Set(ds).size >= 5 && distinct(A + B, ds[j] + ds[k], A + ds[k], A * 10 + B) ? { ds, L, j, k } : null;
    },
    make: ({ ds, L, j, k }) => {
      const A = ds[j] * 10 ** j, B = ds[k] * 10 ** k;
      return { question: `The table shows a number, with one digit in each row. Look at the digit in the ${PLACES[j]} place and the digit in the ${PLACES[k]} place. Work out what each digit is worth in this number, then add the two values. What is the total value of the two digits together?`, story: false,
        model: { type: 'table', data: { head: ['Place', 'Digit'], rows: Array.from({ length: L }, (_, i) => ({ label: PLACES[L - 1 - i], value: String(ds[L - 1 - i]) })) } },
        answer: A + B,
        wrong: [[ds[j] + ds[k], 'That adds the digits only. Total value also depends on the place each digit sits in.', 'M_DIGIT_FOR_TOTAL'], [A + ds[k], `The digit in the ${PLACES[k]} place is also worth more than itself.`, 'M_ONE_DIGIT_ONLY_VALUED'], [A * 10 + B, `The digit in the ${PLACES[j]} place has one zero too many after it.`, 'M_ZEROS_MISCOUNTED']],
        hints: ['Find each row in the table and read its digit.', 'Total value = the digit × the value of its place. Do this for both places, then add.'],
        steps: [`${PLACES[j]}: the digit is ${ds[j]}, total value ${commas(A)}.`, `${PLACES[k]}: the digit is ${ds[k]}, total value ${commas(B)}.`, `Sum: ${commas(A)} + ${commas(B)} = ${commas(A + B)}.`] };
    },
    check: ({ ds, j, k }, a) => Number(String(ds[j]) + '0'.repeat(j)) + Number(String(ds[k]) + '0'.repeat(k)) === a }),

  fam({ id: 'g7.whole.words-spot', skill: 'G7_NUMBERS_WORDS', outcome: 'MATH.G7.NUMBER.WHOLE_NUMBERS.c', cskill: 'MATH.G7.NUMBER.WHOLE_NUMBERS.FIGURES_FROM_WORDS', rung: 2, form: 'spot',
    draw: () => ({ A: randInt(101, 899), B: randInt(11, 99), bug: pick([1, 2]), p: person() }),
    make: ({ A, B, bug, p }) => {
      const sa = bug === 1 ? A * 100 : A * 1000, sb = bug === 2 ? B * 10 : B, tot = sa + sb;
      return { question: `${p.name} reads a number written in words: "${words(A)} thousand and ${words(B)}". ${p.She} writes it in figures. Which step has the mistake?`,
        working: [
          { text: `${words(A)} thousand is ${commas(sa)}.`, ok: sa === A * 1000 },
          { text: `${words(B)} is ${sb}.`, ok: sb === B },
          { text: `Add the two parts: ${commas(sa)} + ${sb} = ${commas(tot)}.`, ok: tot === sa + sb },
          { text: `So the number is ${commas(tot)}.`, ok: true },
        ],
        mis: bug === 1 ? 'M_GROUP_ZEROS_MISSING' : 'M_THOUSAND_ONE_ZERO_SHORT',
        fix: bug === 1 ? `${words(A)} thousand means ${A} × 1,000, so it is ${commas(A * 1000)}. One zero was missing.` : `${words(B)} is ${B}. The ${B} belongs in the units, not shifted to the next place.`,
        steps: [`${words(A)} thousand = ${commas(A * 1000)}.`, `${words(B)} = ${B}.`, `${commas(A * 1000)} + ${B} = ${commas(A * 1000 + B)}.`] };
    } }),

  fam({ id: 'g7.whole.words-cheque', skill: 'G7_NUMBERS_WORDS', outcome: 'MATH.G7.NUMBER.WHOLE_NUMBERS.c', cskill: 'MATH.G7.NUMBER.WHOLE_NUMBERS.WORDS_FROM_FIGURES', rung: 2, form: 'word',
    draw: () => {
      const L = 7; const ds = Array.from({ length: L }, (_, i) => (i === 0 ? randInt(1, 9) : randInt(0, 9)));
      const zeros = ds.slice(1).filter(x => x === 0).length; if (zeros < 2) return null;
      const n = Number(ds.join(''));
      // one wrong in the words for each kind of slip: the tens and ones swapped, a digit moved into the next group, two digits of one group swapped
      const kinds = { tu: [], across: [], within: [] };
      for (let i = 0; i < L - 1; i++) if (ds[i] !== ds[i + 1] && !(i === 0 && ds[i + 1] === 0)) { const c = [...ds]; [c[i], c[i + 1]] = [c[i + 1], c[i]]; const w = words(Number(c.join(''))); if (w !== words(n)) kinds[i === 5 ? 'tu' : (i === 0 || i === 3) ? 'across' : 'within'].push(w); }
      return kinds.tu.length && kinds.across.length && kinds.within.length ? { n, wrongs: [pick(kinds.tu), pick(kinds.across), pick(kinds.within)], p: person() } : null;
    },
    make: ({ n, wrongs, p }) => ({
      question: `${p.name} sells a plot of land for ${sh(n)}. Which of these shows the amount in words?`,
      options: shuffle([{ text: words(n), right: true }, ...wrongs.map((w, i) => ({ text: w, right: false, why: ['In these words the tens and the ones of the last group are the wrong way round.', 'In these words a digit has moved out of its group into the next one. Check which group each digit belongs to.', 'In these words two digits of one group are the wrong way round. Read hundreds, tens and ones in order.'][i], mis: ['M_TENS_AND_UNITS_SWAPPED', 'M_DIGIT_MOVED_ACROSS_GROUPS', 'M_ORDER_WITHIN_GROUP_SWAPPED'][i] }))]),
      hints: ['Split the number into groups of three digits, from the right.', 'Say the millions group, then the thousands group, then the last group.'],
      steps: [`Groups: ${commas(n).split(',').join(' | ')}.`, `In words: ${words(n)}.`] }) }),

  fam({ id: 'g7.whole.round-report', skill: 'G7_ROUNDING_WHOLE', outcome: 'MATH.G7.NUMBER.WHOLE_NUMBERS.d', cskill: 'MATH.G7.NUMBER.WHOLE_NUMBERS.ROUND_TO_PLACE', rung: 2, form: 'word',
    draw: () => {
      const N = randInt(101000000, 989999999), r = N % 1e8; if (r === 5e7) return null;
      const ans = Math.round(N / 1e8) * 1e8, up = r > 5e7;
      const other = up ? Math.floor(N / 1e8) * 1e8 : Math.ceil(N / 1e8) * 1e8, tenM = Math.round(N / 1e7) * 1e7, lead = ans / 1e8;
      return distinct(ans, other, tenM, lead) ? { N, ans, other, tenM, lead, p: person() } : null;
    },
    make: ({ N, ans, other, tenM, lead }) => ({
      question: `A report says that ${commas(N)} mobile phone lines are in use in a region. The newspaper rounds this to the nearest hundred million. What number does it print?`,
      answer: ans,
      wrong: [[other, 'You rounded the wrong way. Look at the digit in the ten millions place: 5 or more rounds up, less than 5 stays.', 'M_ROUND_WRONG_DIGIT_CHECKED'], [tenM, 'That is rounded to the nearest ten million. The question asks for the nearest hundred million.', 'M_ROUND_TO_WRONG_PLACE'], [lead, 'That is only the hundred millions digit. Write the number in full, with zeros in the other places.', 'M_ZEROS_NOT_WRITTEN']],
      hints: ['Underline the digit in the hundred millions place.', 'Look at the digit to its right, in the ten millions place.'],
      steps: [`The hundred millions digit is ${Math.floor(N / 1e8)}. The next digit is ${Math.floor((N % 1e8) / 1e7)}.`, `${Math.floor((N % 1e8) / 1e7) >= 5 ? 'It is 5 or more, so round up.' : 'It is less than 5, so keep the digit.'}`, `Rounded: ${commas(ans)}.`] }),
    check: ({ N }, a) => a % 1e8 === 0 && Math.abs(N - a) <= 5e7 }),

  fam({ id: 'g7.whole.prime-jerseys', skill: 'G7_PRIMES', outcome: 'MATH.G7.NUMBER.WHOLE_NUMBERS.e', cskill: 'MATH.G7.NUMBER.WHOLE_NUMBERS.PRIME_NUMBERS', rung: 2, form: 'table',
    draw: () => {
      const nums = new Set(); while (nums.size < 5) nums.add(randInt(2, 40)); const v = [...nums];
      const sum = (a) => a.reduce((t, x) => t + x, 0), pr = sum(v.filter(isPrime)), np = v.filter(isPrime).length, odd = sum(v.filter(x => x % 2)), comp = sum(v.filter(x => !isPrime(x))), small = sum(v.filter(x => x === 2 || x === 3 || (x % 2 && x % 3)));
      const far = (...c) => c.every(a => c.every(b => a === b || Math.abs(a - b) > 2));
      return np >= 1 && np <= 3 && distinct(pr, odd, comp, small) && far(pr, odd, comp, small) ? { v, pr, odd, comp, small, ps: (() => { const ns = []; while (ns.length < 5) { const x = person().name; if (!ns.includes(x)) ns.push(x); } return ns; })() } : null;
    },
    make: ({ v, pr, odd, comp, small, ps }) => ({
      question: 'The table shows the jersey numbers of five players. What is the total of the jersey numbers that are prime?', story: false,
      model: { type: 'table', data: { head: ['Player', 'Jersey number'], rows: v.map((n, i) => ({ label: ps[i], value: String(n) })) } },
      answer: pr,
      wrong: [[odd, 'That is the total of the odd numbers. Some odd numbers are not prime, for example 9 and 15.', 'M_ODD_MEANS_PRIME'], [comp, 'That is the total of the numbers that are not prime. The question asks for the prime ones.', 'M_PRIME_COMPOSITE_CONFUSED'], [small, 'That only tests 2 and 3. A number that passes those two tests can still have 5 or 7 as a factor.', 'M_ONLY_SMALL_DIVISORS_TESTED']],
      hints: ['A prime number has exactly two factors: 1 and itself.', 'Test each jersey number: does anything other than 1 and itself divide it?'],
      steps: [`Check each number: ${v.map(n => `${n} is ${isPrime(n) ? 'prime' : 'not prime'}`).join(', ')}.`, `The prime numbers are ${v.filter(isPrime).join(', ')}. Their total is ${pr}.`] }),
    check: ({ v }, a) => v.filter(n => n > 1 && Array.from({ length: n - 2 }, (_, i) => i + 2).every(f => n % f !== 0)).reduce((t, x) => t + x, 0) === a }),

  fam({ id: 'g7.whole.matatu-takings', skill: 'G7_BODMAS_ADV', outcome: 'MATH.G7.NUMBER.WHOLE_NUMBERS.f', cskill: 'MATH.G7.NUMBER.WHOLE_NUMBERS.OPERATIONS_IN_CONTEXT', rung: 2, form: 'word',
    draw: () => { const f = pick([60, 70, 80, 100]), k = pick([20, 25, 30, 35, 40]), F = pick([600, 800, 1000, 1200]), P = pick([100, 150, 200]); return f * k - F - P >= 200 ? { f, k, F, P } : null; },
    make: ({ f, k, F, P }) => ({
      question: `A matatu charges ${sh(f)} from each passenger. On one trip it carries ${k} passengers. The driver pays ${sh(F)} for fuel and ${sh(P)} for parking. How much money is left from the fares? Answer in shillings.`,
      answer: f * k - (F + P),
      wrong: [[f * k - F, 'The driver also pays for parking. Take that away as well.', 'M_LAST_COST_LEFT_OUT'], [f * k - F + P, 'Both payments come out of the fares. Neither one is added back.', 'M_ADDED_NOT_TAKEN_AWAY'], [f * k, 'That is all the money collected. Take away what the driver pays.', 'M_ONE_STEP_STOPPED']],
      hints: ['First find all the money the passengers pay.', 'Then take away the fuel and the parking.'],
      steps: [`Fares: ${f} × ${k} = ${commas(f * k)}.`, `Costs: ${F} + ${P} = ${commas(F + P)}.`, `Left: ${commas(f * k)} − ${commas(F + P)} = ${commas(f * k - F - P)}.`] }),
    check: ({ f, k, F, P }, a) => a + F + P === f * k }),

  fam({ id: 'g7.whole.mangoes-spot', skill: 'G7_BODMAS_ADV', outcome: 'MATH.G7.NUMBER.WHOLE_NUMBERS.f', cskill: 'MATH.G7.NUMBER.WHOLE_NUMBERS.OPERATIONS_IN_CONTEXT', rung: 2, form: 'spot',
    draw: () => {
      const fm = pick([4, 5, 6]), j = randInt(2, 4), g = fm * j, s = randInt(6, 20), tot = fm * s + g, bags = pick([4, 5, 6, 8]);
      return tot % bags === 0 ? { fm, g, s, bags, per: tot / bags, bug: pick(['A', 'B']), p: person() } : null;
    },
    make: ({ fm, g, s, bags, per, bug, p }) => {
      const t1 = bags * per, t2 = t1 - g;
      const s2 = bug === 'A' ? t1 + g : t2, s3 = bug === 'B' ? s2 * fm : s2 / fm;
      return { question: `${p.name} has ${bags} bags with ${per} mangoes in each bag. ${p.She} gives away ${g} mangoes and shares the rest equally among ${fm} families. Here is ${p.her} working. Which step has the mistake?`,
        working: [
          { text: `Mangoes in all: ${bags} × ${per} = ${t1}.`, ok: t1 === bags * per },
          { text: `Take away the ${g} given away: ${t1} ${bug === 'A' ? '+' : '−'} ${g} = ${s2}.`, ok: s2 === t1 - g },
          { text: `Share equally among ${fm} families: ${s2} ${bug === 'B' ? '×' : '÷'} ${fm} = ${s3}.`, ok: s3 === s2 / fm },
          { text: `Each family gets ${s3} mangoes.`, ok: true },
        ],
        mis: bug === 'A' ? 'M_ADDED_NOT_TAKEN_AWAY' : 'M_SHARE_BY_MULTIPLYING',
        fix: bug === 'A' ? `Giving mangoes away means taking them away, so it is ${t1} − ${g}, not ${t1} + ${g}.` : `Sharing equally means dividing: ${s2} ÷ ${fm}, not ${s2} × ${fm}.`,
        steps: [`${bags} × ${per} = ${t1}.`, `${t1} − ${g} = ${t2}.`, `${t2} ÷ ${fm} = ${s}.`] };
    } }),

  fam({ id: 'g7.whole.hall-rows', skill: 'G7_NUMBER_SEQUENCES', outcome: 'MATH.G7.NUMBER.WHOLE_NUMBERS.g', cskill: 'MATH.G7.NUMBER.WHOLE_NUMBERS.SEQ_NTH_TERM', rung: 2, form: 'table',
    draw: () => ({ a: randInt(10, 30), d: randInt(3, 6), n: pick([8, 10, 12]) }),
    make: ({ a, d, n }) => ({
      question: `The table shows the seats in the first four rows of a hall. The pattern continues, so each row has the same number of extra seats. How many seats are in row ${n}?`, story: false,
      model: { type: 'table', data: { head: ['Row', 'Seats'], rows: [1, 2, 3, 4].map(r => ({ label: String(r), value: String(a + (r - 1) * d) })) } },
      answer: a + (n - 1) * d,
      wrong: [[a + n * d, `Row 1 has ${a} seats already. Row ${n} has one fewer step than ${n}.`, 'M_COUNT_TERMS_NOT_STEPS'], [n * d, 'That ignores the seats in the first row. The pattern starts from the first row.', 'M_FIRST_TERM_LEFT_OUT'], [a + (n - 2) * d, `Count the steps from row 1 to row ${n} again. You stopped one step early.`, 'SLIP']],
      hints: ['How many seats does each row add to the one before it?', `From row 1 to row ${n}, how many times is that added?`],
      steps: [`Each row adds ${d} seats.`, `From row 1 to row ${n} the amount is added ${n - 1} times: ${d} × ${n - 1} = ${d * (n - 1)}.`, `Row ${n}: ${a} + ${d * (n - 1)} = ${a + (n - 1) * d}.`] }),
    check: ({ a, d, n }, x) => (x - a) % d === 0 && (x - a) / d + 1 === n }),

  fam({ id: 'g7.whole.odd-term-out', skill: 'G7_NUMBER_SEQUENCES', outcome: 'MATH.G7.NUMBER.WHOLE_NUMBERS.g', cskill: 'MATH.G7.NUMBER.WHOLE_NUMBERS.SEQ_EXTEND_RULE', rung: 3, form: 'word',
    draw: () => { const a = randInt(3, 20), d = randInt(7, 9), j = pick([2, 3]), e = pick([-4, -3, 3, 4]); return { a, d, j, e, p: person() }; },
    make: ({ a, d, j, e, p }) => {
      const terms = Array.from({ length: 6 }, (_, i) => a + i * d); const shown = [...terms]; shown[j] += e;
      return { question: `${p.name} writes a number sequence that goes up by the same amount each time. One term is wrong: ${shown.join(', ')}. Which term does not fit the pattern?`,
        answer: shown[j],
        wrong: [[shown[j - 1], 'That term fits the pattern. Check the gaps between the terms: one gap is different.', 'M_FIRST_GAP_ONLY'], [shown[j + 1], 'That term fits the pattern. Compare it with the terms after it.', 'M_NEIGHBOUR_BLAMED'], [terms[j], 'That is the number that should be there. The question asks for the wrong term that was written.', 'M_GIVES_CORRECT_TERM']],
        hints: ['Find the usual gap from the first two terms.', 'Check each next term against that gap.'],
        steps: [`The first terms ${shown[0]}, ${shown[1]} go up by ${d}.`, `After ${shown[j - 1]} the next term should be ${terms[j]}, but ${shown[j]} is written.`] };
    },
    check: ({ a, d }, x) => (x - a) % d !== 0 }),

  fam({ id: 'g7.whole.rule-fourth-term', skill: 'G7_NUMBER_SEQUENCES', outcome: 'MATH.G7.NUMBER.WHOLE_NUMBERS.h', cskill: 'MATH.G7.NUMBER.WHOLE_NUMBERS.SEQ_CREATE_RULE', rung: 2, form: 'word',
    draw: () => { const a = randInt(1, 5), m = pick([2, 3]), c = randInt(1, 4); const t = [a]; for (let i = 0; i < 4; i++) t.push(t[i] * m + c); return distinct(t[3], a + 3 * c, a * m ** 3, t[4], t[2]) ? { a, m, c, t, p: person() } : null; },
    make: ({ a, m, c, t, p }) => ({
      question: `${p.name} makes a sequence with this rule: multiply the last term by ${m}, then add ${c}. The first term is ${a}. What is the fourth term?`,
      answer: t[3],
      wrong: [[a + 3 * c, `The rule has two parts. This only used the adding part.`, 'M_ONLY_ADDING_USED'], [a * m ** 3, 'The rule has two parts. This only used the multiplying part.', 'M_ONLY_MULTIPLYING_USED'], [t[2], 'That is the third term. Apply the rule once more.', 'SLIP']],
      hints: ['Find the second term first: use both parts of the rule.', 'Then use the rule again on the second term.'],
      steps: [`Second term: ${a} × ${m} + ${c} = ${t[1]}.`, `Third term: ${t[1]} × ${m} + ${c} = ${t[2]}.`, `Fourth term: ${t[2]} × ${m} + ${c} = ${t[3]}.`] }),
    check: ({ m, c, t }, x) => (x - c) / m === t[2] }),

  fam({ id: 'g7.whole.sticks-rule', skill: 'G7_NUMBER_SEQUENCES', outcome: 'MATH.G7.NUMBER.WHOLE_NUMBERS.g', cskill: 'MATH.G7.NUMBER.WHOLE_NUMBERS.SEQ_NTH_TERM', rung: 3, form: 'steps',
    draw: () => { const s = pick([{ n: 'square', f: 4, d: 3 }, { n: 'pentagon', f: 5, d: 4 }, { n: 'hexagon', f: 6, d: 5 }]); const k = randInt(12, 20); return { ...s, k, S: s.f + (k - 1) * s.d, p: person() }; },
    make: ({ n, f, d, k, S, p }) => ({
      question: `${p.name} joins matchsticks to make a row of ${n}s. The first ${n} uses ${f} sticks. Each new ${n} shares a side with the one before, so it adds ${d} sticks. Use this rule to answer.`,
      parts: [
        { prompt: `How many sticks make a row of 4 ${n}s?`, answer: f + 3 * d, hint: `Start with ${f} and add ${d} three times.`, wrong: [[4 * f, `The ${n}s share sides, so they do not each need ${f} sticks.`, 'M_MULTIPLIES_FIRST_TERM'], [f + 4 * d, 'The first shape is already in place. Only 3 more are added.', 'M_COUNT_TERMS_NOT_STEPS'], [f + 3, 'Each new shape adds more than 1 stick.', 'M_DIFFERENCE_IGNORED']] },
        { prompt: `How many sticks make a row of 10 ${n}s?`, answer: f + 9 * d, hint: 'The rule is added once for each shape after the first.', wrong: [[10 * f, 'Shapes in the row share sides. Use the rule.', 'M_MULTIPLIES_FIRST_TERM'], [f + 10 * d, 'The first shape is not an addition. Count the added shapes again.', 'M_COUNT_TERMS_NOT_STEPS'], [10 * d, 'The first shape uses more sticks than a new one adds.', 'M_FIRST_TERM_LEFT_OUT']] },
        { prompt: `${p.name} has ${S} sticks and uses them all. How many ${n}s are in the row?`, answer: k, hint: `Take off the first ${n}, then see how many lots of ${d} fit.`, wrong: [[Math.floor(S / f), `That would give each ${n} its own sticks. They share sides.`, 'M_MULTIPLIES_FIRST_TERM'], [k - 1, 'Do not forget the first shape.', 'SLIP'], [Math.floor(S / d), 'The first shape uses a different number of sticks from the new ones.', 'M_FIRST_TERM_LEFT_OUT']] },
      ],
      steps: [`4 shapes: ${f} + 3 × ${d} = ${f + 3 * d}.`, `10 shapes: ${f} + 9 × ${d} = ${f + 9 * d}.`, `${S} − ${f} = ${S - f}, and ${S - f} ÷ ${d} = ${k - 1} added shapes. With the first one: ${k} shapes.`] }),
    check: ({ f, d, k, S }, v) => v[0] === f + 3 * d && v[1] === f + 9 * d && v[2] === k && f + (v[2] - 1) * d === S }),

  // ======================================================================
  // FACTORS
  // ======================================================================
  fam({ id: 'g7.factors.div-baskets', skill: 'G7_DIVISIBILITY', outcome: 'MATH.G7.NUMBER.FACTORS.a', cskill: 'MATH.G7.NUMBER.FACTORS.DIV_BY_3_6_9', rung: 2, form: 'word',
    draw: () => {
      const N = randInt(1000, 9999), ks = [2, 3, 4, 5, 6, 8, 9, 10, 11], yes = ks.filter(k => N % k === 0);
      // one wrong divisor from each kind of test: digit sum (3, 9), last digits (4, 8), both tests (6), alternating sum (11)
      const kinds = [[3, 9], [4, 8], [6], [11]].map(c => c.filter(k => N % k !== 0)).filter(c => c.length).map(c => pick(c));
      if (yes.length < 1 || kinds.length < 3) return null;
      return { N, r: pick(yes), ws: shuffle(kinds).slice(0, 3), p: person() };
    },
    make: ({ N, r, ws, p }) => {
      const reason = (k) => ({ 2: 'its last digit is not even', 3: `its digits add up to ${digitSum(N)}, which is not a multiple of 3`, 4: `its last two digits make ${N % 100}, which does not divide by 4`, 5: 'its last digit is not 0 or 5', 6: 'it must divide by both 2 and 3, and it fails one of them', 7: `dividing leaves a remainder of ${N % 7}`, 8: `its last three digits make ${N % 1000}, which does not divide by 8`, 9: `its digits add up to ${digitSum(N)}, which is not a multiple of 9`, 10: 'its last digit is not 0', 11: 'the difference between the sums of its alternate digits is not 0 or a multiple of 11' }[k]);
      return { question: `${p.name} has ${commas(N)} books. ${p.She} packs them into equal bundles with none left over. Which of these numbers is ${commas(N)} divisible by? It must divide exactly.`,
        options: shuffle([{ text: String(r), right: true }, ...ws.map(k => ({ text: String(k), right: false, why: `${commas(N)} does not divide exactly by ${k}: ${reason(k)}.`, mis: { 3: 'M_DIGIT_SUM_NOT_DIVIDED', 9: 'M_DIGIT_SUM_NOT_DIVIDED', 4: 'M_LAST_DIGIT_FOR_4_8', 8: 'M_LAST_DIGIT_FOR_4_8', 6: 'M_SIX_ONLY_EVEN_TESTED', 11: 'M_ELEVEN_ADD_ALL_DIGITS' }[k] }))]),
        hints: ['Use the divisibility test for each number in turn.', 'Only one of the numbers passes its test.'],
        steps: [`Test each number with its divisibility rule.`, `${commas(N)} ÷ ${r} = ${commas(N / r)} with nothing left, so ${r} divides exactly.`] };
    } }),

  fam({ id: 'g7.factors.eleven-spot', skill: 'G7_DIVISIBILITY', outcome: 'MATH.G7.NUMBER.FACTORS.a', cskill: 'MATH.G7.NUMBER.FACTORS.DIV_BY_11', rung: 3, form: 'spot',
    draw: () => {
      const want = Math.random() < 0.5; const ds = [randInt(1, 9), randInt(0, 9), randInt(0, 9), randInt(0, 9)]; const N = Number(ds.join(''));
      const [a, b, c, d] = ds;
      return (N % 11 === 0) === want && a + c !== b + d && (a + b + c + d) % 11 !== 0 ? { ds, N, p: person() } : null;
    },
    make: ({ ds, N, p }) => {
      const [a, b, c, d] = ds, s1 = a + c, s2 = b + d, tot = s1 + s2, diff = Math.abs(s1 - s2), yes = tot % 11 === 0;
      return { question: `${p.name} tests whether ${commas(N)} is divisible by 11. Here is ${p.her} working. Which step has the mistake?`,
        working: [
          { text: `Add the digits in places 1 and 3: ${a} + ${c} = ${s1}.`, ok: true },
          { text: `Add the digits in places 2 and 4: ${b} + ${d} = ${s2}.`, ok: true },
          { text: `Combine the two sums: ${s1} + ${s2} = ${tot}.`, ok: false },
          { text: `${tot} ${yes ? 'is' : 'is not'} 0 or a multiple of 11, so ${commas(N)} ${yes ? 'is' : 'is not'} divisible by 11.`, ok: true },
        ],
        mis: 'M_ELEVEN_ADD_ALL_DIGITS',
        fix: `The test for 11 subtracts the two sums, it does not add them. ${Math.max(s1, s2)} − ${Math.min(s1, s2)} = ${diff}, and the conclusion must follow from that.`,
        steps: [`${s1} − ${s2} gives a difference of ${diff}.`, `${diff} ${diff % 11 === 0 ? 'is' : 'is not'} 0 or a multiple of 11, so ${commas(N)} ${diff % 11 === 0 ? 'is' : 'is not'} divisible by 11.`] };
    } }),

  fam({ id: 'g7.factors.div-six-table', skill: 'G7_DIVISIBILITY', outcome: 'MATH.G7.NUMBER.FACTORS.a', cskill: 'MATH.G7.NUMBER.FACTORS.DIV_BY_3_6_9', rung: 2, form: 'table',
    draw: () => {
      // most draws are rejected by the rules below, so try several before giving up
      for (let t = 0; t < 300; t++) { const r = (() => {
      const v = Array.from({ length: 5 }, () => randInt(1000, 9999)); if (new Set(v).size < 5) return null;
      const six = v.filter(n => n % 6 === 0).length, three = v.filter(n => n % 3 === 0).length, two = v.filter(n => n % 2 === 0).length, sum6 = v.filter(n => digitSum(n) % 6 === 0).length;
      return six >= 1 && six <= 3 && distinct(six, three, two, sum6) ? { v, six, three, two, sum6 } : null;
    })(); if (r) return r; }
      return null;
    },
    make: ({ v, six, three, two, sum6 }) => ({
      question: 'The table shows five numbers and the sum of the digits of each. How many of the numbers are divisible by 6?', story: false,
      model: { type: 'table', data: { head: ['Number', 'Sum of digits'], rows: v.map(n => ({ cells: [commas(n), String(digitSum(n))] })) } },
      answer: six,
      wrong: [[three, 'That counts the numbers divisible by 3 only. A number divisible by 6 must also be even.', 'M_SIX_ONLY_THREE_TESTED'], [two, 'That counts the even numbers only. A number divisible by 6 must also divide by 3.', 'M_SIX_ONLY_EVEN_TESTED'], [sum6, 'That counts the numbers whose digit sum is a multiple of 6. The digit sum rule is for 3 and 9: for 6, test even and the sum for 3.', 'M_DIGIT_SUM_DIVISIBLE_BY_SIX']],
      hints: ['A number divides by 6 when it divides by both 2 and 3.', 'Use the last digit for 2 and the sum of digits for 3.'],
      steps: v.map(n => `${commas(n)}: ${n % 2 === 0 ? 'even' : 'odd'}, digit sum ${digitSum(n)} ${digitSum(n) % 3 === 0 ? 'divides' : 'does not divide'} by 3.`).concat([`Divisible by both: ${six}.`]) }),
    check: ({ v }, a) => v.filter(n => n % 2 === 0 && digitSum(n) % 3 === 0).length === a }),

  fam({ id: 'g7.factors.prime-factor-spot', skill: 'G7_PRIME_FACTORIZATION', outcome: 'MATH.G7.NUMBER.FACTORS.b', cskill: 'MATH.G7.NUMBER.FACTORS.PRIME_FACTORISE', rung: 3, form: 'spot',
    draw: () => ({ r: pick([5, 7, 11, 13]), bug: pick(['composite', 'product']), p: person() }),
    make: ({ r, bug, p }) => {
      const m = 9 * r, N = 4 * m;
      const f3 = bug === 'composite' ? [r, 9] : [3, r], claim = f3.every(isPrime);
      const prod = f3.reduce((x, y) => x * y, 1);
      return { question: `${p.name} writes ${N} as a product of prime factors. Here is ${p.her} working. Which step has the mistake?`,
        working: [
          { text: `${N} = 2 × ${N / 2}.`, ok: true },
          { text: `${N / 2} = 2 × ${m}.`, ok: 2 * m === N / 2 },
          { text: `${m} = ${f3.join(' × ')}, and all of these factors are prime.`, ok: prod === m && claim },
          { text: `So ${N} = 2 × 2 × ${f3.join(' × ')}.`, ok: true },
        ],
        mis: bug === 'composite' ? 'M_FACTORS_NOT_PRIME' : 'M_REPEATED_FACTOR_ONCE',
        fix: bug === 'composite' ? `${r} × 9 is a correct product, but 9 is not prime: 9 = 3 × 3. Keep splitting until every factor is prime.` : `The factors in this step do not multiply to give ${m}: ${f3.join(' × ')} = ${prod}. A repeated factor must be written each time it appears, so one 3 is missing.`,
        steps: [`${m} = 3 × 3 × ${r}, and 3, 3 and ${r} are all prime.`, `${N} = 2 × 2 × 3 × 3 × ${r}.`] };
    } }),

  fam({ id: 'g7.factors.not-prime-why', skill: 'G7_PRIMES', outcome: 'MATH.G7.NUMBER.FACTORS.b', cskill: 'MATH.G7.NUMBER.FACTORS.PRIME_FACTORISE', rung: 3, form: 'why',
    draw: () => { const p = pick([7, 11, 13]), q = pick([7, 11, 13]); return { p, q, N: p * q, who: person() }; },
    make: ({ p, q, N, who }) => ({
      question: `${who.name} says that ${N} is a prime number, because it does not divide by 2, 3 or 5. Why is ${who.her} reasoning not enough?`,
      options: [
        { text: `${N} = ${p} × ${q}, so it has factors besides 1 and itself`, right: true },
        { text: 'A number that does not divide by 2, 3 or 5 is always prime', right: false, why: `That is not true. ${N} passes those three tests and is still not prime.`, mis: 'M_SMALL_PRIMES_ENOUGH' },
        { text: `${N} is even, so it divides by 2`, right: false, why: `${N} ends in an odd digit, so it is odd.`, mis: 'SLIP' },
        { text: 'Prime numbers are never larger than 100', right: false, why: 'There are prime numbers bigger than 100, such as 101. Look for a factor of this number instead.', mis: 'M_PRIMES_STOP_AT_100' },
      ],
      hints: ['Passing a few tests is not the same as having no factors.', 'Try dividing by the next prime numbers: 7, 11, 13.'],
      steps: [`${N} ÷ ${p} = ${q}.`, `So ${N} has the factors ${p} and ${q}, and it is composite.`] }) }),

  fam({ id: 'g7.factors.gcd-rope', skill: 'G7_GCD', outcome: 'MATH.G7.NUMBER.FACTORS.d', cskill: 'MATH.G7.NUMBER.FACTORS.GCD_IN_CONTEXT', rung: 2, form: 'word',
    draw: () => {
      const g = pick([4, 6, 8, 9, 12, 15]), u = randInt(2, 9), v = randInt(2, 9); if (gcd(u, v) !== 1 || u === v) return null;
      const a = g * Math.min(u, v), b = g * Math.max(u, v); const L = lcm(a, b), dif = b - a, pieces = a / g + b / g;
      return distinct(g, L, dif, pieces, a) && Math.abs(pieces - g) > 2 && Math.abs(dif - g) > 2 && b <= 150 ? { a, b, g, L, dif, pieces, p: person() } : null;
    },
    make: ({ a, b, g, L, dif, pieces, p }) => ({
      question: `${p.name} has two ropes, ${a} m and ${b} m long. ${p.She} cuts both into equal pieces with no rope left over. The pieces must be as long as possible, so the length is the GCD (greatest common divisor) of ${a} and ${b}. How many metres long is each piece?`,
      answer: g,
      wrong: [[L, 'That is the least common multiple. A piece cannot be longer than the shorter rope.', 'M_GCD_IS_LCM'], [dif, 'The difference between the lengths does not have to fit into both ropes.', 'M_GCD_DIFFERENCE'], [pieces, 'That is the number of pieces, not their length.', 'M_OTHER_QUANTITY_GIVEN']],
      hints: ['List the factors of each length, or divide both by small numbers.', 'The greatest factor they share is the GCD.'],
      steps: [`Factors of ${a} and ${b} that both share: the biggest is ${g}.`, `Check: ${a} ÷ ${g} = ${a / g} and ${b} ÷ ${g} = ${b / g}, with nothing left.`] }),
    check: ({ a, b }, x) => a % x === 0 && b % x === 0 && gcd(a / x, b / x) === 1 }),

  fam({ id: 'g7.factors.hcf-gift-boxes', skill: 'G7_GCD', outcome: 'MATH.G7.NUMBER.FACTORS.d', cskill: 'MATH.G7.NUMBER.FACTORS.GCD_IN_CONTEXT', rung: 3, form: 'table',
    draw: () => {
      // most draws are rejected by the rules below, so try several before giving up
      for (let t = 0; t < 300; t++) { const r = (() => {
      const g = pick([4, 5, 6, 8, 10]), u = randInt(2, 9), v = randInt(2, 9), w = randInt(2, 9); if (!distinct(u, v, w) || gcd(gcd(u, v), w) !== 1) return null;
      const nums = [g * u, g * v, g * w]; const gab = gcd(nums[0], nums[1]), mn = Math.min(...nums), per = nums.reduce((s, x) => s + x, 0) / g;
      return distinct(g, gab, mn, per) ? { g, nums, gab, mn, per, items: shuffle(['Bars of soap', 'Packets of tea', 'Boxes of matches', 'Tubes of toothpaste', 'Packets of sugar']).slice(0, 3), p: person() } : null;
    })(); if (r) return r; }
      return null;
    },
    make: ({ g, nums, gab, mn, per, items, p }) => ({
      question: `${p.name} packs gift boxes from the stock in the table. Every box must have the same things in it, and nothing is left over. What is the greatest number of boxes ${p.she} can make? Use the HCF (highest common factor) of the three numbers.`, story: false,
      model: { type: 'table', data: { head: ['Item', 'Number in stock'], rows: items.map((l, i) => ({ label: l, value: String(nums[i]) })) } },
      answer: g,
      wrong: [[mn, 'That is the smallest stock. The number of boxes must also divide the other two numbers exactly.', 'M_SMALLEST_QUANTITY_IS_GCD'], [gab, 'That is the HCF of only the first two numbers. The third item must also divide exactly.', 'M_GCD_TWO_OF_THREE'], [per, 'That is the number of items in one box, found by adding. The question asks for the number of boxes.', 'M_OTHER_QUANTITY_GIVEN']],
      hints: ['The number of boxes must divide all three numbers exactly.', 'Find the greatest number that divides all three.'],
      steps: [`The greatest number that divides ${nums.join(', ')} exactly is ${g}.`, `Each box then has ${nums.map(n => n / g).join(', ')} of the items.`] }),
    check: ({ nums }, a) => nums.every(n => n % a === 0) && nums.every(n => gcd(n / a, nums[0] / a) >= 1) && gcd(gcd(nums[0] / a, nums[1] / a), nums[2] / a) === 1 }),

  fam({ id: 'g7.factors.lcm-matatus', skill: 'G7_LCM', outcome: 'MATH.G7.NUMBER.FACTORS.d', cskill: 'MATH.G7.NUMBER.FACTORS.LCM_IN_CONTEXT', rung: 2, form: 'word',
    draw: () => {
      const a = pick([6, 8, 10, 12, 15, 18, 20]), b = pick([6, 8, 9, 10, 12, 15, 18, 20, 24]); if (a === b || gcd(a, b) === 1 || a % b === 0 || b % a === 0) return null;
      const L = lcm(a, b); return L <= 120 && distinct(L, a * b, a + b, Math.max(a, b)) ? { a, b, L, town: pick(['Thika', 'Nakuru', 'Kisumu', 'Eldoret', 'Machakos']) } : null;
    },
    make: ({ a, b, L, town }) => ({
      question: `Two matatus leave the ${town} stage together at 6:00 a.m. One matatu leaves the stage every ${a} minutes. The other leaves every ${b} minutes. After how many minutes do they leave together again?`,
      answer: L,
      wrong: [[a * b, `The two matatus leave together earlier than that. Look for the smallest time that fits both gaps.`, 'M_LCM_PRODUCT'], [a + b, 'Adding the gaps does not give a time when both leave. Both must arrive at a multiple of their own gap.', 'M_LCM_ADD_THE_GAPS'], [Math.max(a, b), 'The shorter gap does not fit exactly into this time. Check it.', 'M_LCM_ONE_GAP_ONLY']],
      hints: ['List the times when the first matatu leaves: multiples of its gap.', 'Find the first time that is also on the second list.'],
      steps: [`Multiples of ${a}: ${[1, 2, 3, 4, 5, 6].map(i => a * i).join(', ')} ...`, `Multiples of ${b}: ${[1, 2, 3, 4, 5, 6].map(i => b * i).join(', ')} ...`, `The first time on both lists is ${L} minutes.`] }),
    check: ({ a, b }, x) => x % a === 0 && x % b === 0 && gcd(x / a, x / b) === 1 }),

  fam({ id: 'g7.factors.lcm-product-why', skill: 'G7_LCM', outcome: 'MATH.G7.NUMBER.FACTORS.c', cskill: 'MATH.G7.NUMBER.FACTORS.LCM_BY_FACTORS', rung: 3, form: 'why',
    draw: () => {
      const a = pick([4, 6, 8, 9, 10, 12, 14, 15]), b = pick([6, 9, 10, 12, 14, 15, 18, 20]); if (a >= b || gcd(a, b) === 1 || b % a === 0) return null;
      return { a, b, L: lcm(a, b), p: person() };
    },
    make: ({ a, b, L, p }) => ({
      question: `${p.name} says the LCM of ${a} and ${b} is ${a * b}, because ${a * b} is a common multiple of both numbers. Why is ${p.her} answer not the least common multiple?`,
      options: [
        { text: `${L} is also a common multiple, and it is smaller`, right: true },
        { text: `${a * b} is not a multiple of ${a}, so it cannot be common`, right: false, why: `${a * b} = ${a} × ${b}, so it is a multiple of ${a}. It is just not the smallest common one.`, mis: 'M_MULTIPLE_VS_FACTOR_CONFUSED' },
        { text: 'The LCM must be smaller than both of the numbers', right: false, why: 'A common multiple is never smaller than the numbers themselves.', mis: 'M_LCM_SMALLER_THAN_NUMBERS' },
        { text: 'The LCM is always found by adding the two numbers', right: false, why: 'Adding does not give a multiple of both numbers. Look at lists of multiples.', mis: 'M_LCM_ADD_THE_GAPS' },
      ],
      hints: ['The least common multiple is the smallest number on both lists of multiples.', `Is there a common multiple of ${a} and ${b} that is smaller than ${a * b}?`],
      steps: [`${a * b} is a common multiple, but not the smallest.`, `${L} ÷ ${a} = ${L / a} and ${L} ÷ ${b} = ${L / b}, so ${L} is a smaller common multiple.`] }) }),

  fam({ id: 'g7.factors.lcm-three-bells', skill: 'G7_LCM', outcome: 'MATH.G7.NUMBER.FACTORS.d', cskill: 'MATH.G7.NUMBER.FACTORS.LCM_IN_CONTEXT', rung: 3, form: 'table',
    draw: () => {
      const v = shuffle([4, 6, 8, 9, 10, 12, 15, 18, 20]).slice(0, 3), L = lcm(lcm(v[0], v[1]), v[2]); const L2 = lcm(v[0], v[1]);
      return L <= 180 && L !== L2 && distinct(L, L2, Math.max(...v), v[0] * v[1] * v[2]) ? { v, L, L2 } : null;
    },
    make: ({ v, L, L2 }) => ({
      question: 'The school has three bells. The table shows how often each one rings. At 8:00 a.m. all three ring at the same time. After how many minutes do they next ring at the same time? Find the LCM.', story: false,
      model: { type: 'table', data: { head: ['Bell', 'Rings every (minutes)'], rows: v.map((n, i) => ({ label: `Bell ${'ABC'[i]}`, value: String(n) })) } },
      answer: L,
      wrong: [[L2, `That is when only the first two bells ring together. The third bell must fit as well.`, 'M_LCM_TWO_OF_THREE'], [v[0] * v[1] * v[2], 'That is a time all three ring together, but a smaller one exists.', 'M_LCM_PRODUCT'], [Math.max(...v), 'The other bells do not ring at that time. Check it.', 'M_LCM_ONE_GAP_ONLY']],
      hints: ['Find the LCM of the first two numbers.', 'Then find the LCM of that answer and the third number.'],
      steps: [`LCM of ${v[0]} and ${v[1]} is ${L2}.`, `LCM of ${L2} and ${v[2]} is ${L}.`] }),
    check: ({ v }, x) => v.every(n => x % n === 0) && gcd(gcd(x / v[0], x / v[1]), x / v[2]) === 1 }),
  // ======================================================================
  // FRACTIONS
  // ======================================================================
  fam({ id: 'g7.frac.compare-books', skill: 'G7_FRACTIONS_COMPARE', outcome: 'MATH.G7.NUMBER.FRACTIONS.a', cskill: 'MATH.G7.NUMBER.FRACTIONS.COMPARE_FRACTIONS', rung: 2, form: 'word',
    draw: () => {
      // the wrong choices need a largest numerator and a largest denominator on different people, so most draws are rejected: try many
      for (let t = 0; t < 4000; t++) { const r = (() => {
      const ds = shuffle([4, 5, 8, 10]).slice(0, 3), fs = ds.map(d => { const a = randInt(1, d - 1); return { a, d }; });
      if (fs.some(f => gcd(f.a, f.d) !== 1)) return null;
      const vals = fs.map(f => f.a / f.d).sort((x, y) => x - y); if (vals[2] - vals[1] < 0.02 || vals[1] - vals[0] < 0.02) return null;
      // the two wrong choices are the largest numerator and the largest denominator, one each, so each wrong answer shows its own slip
      const top = fs.reduce((m, f, i) => (f.a > fs[m].a ? i : m), 0), wide = fs.reduce((m, f, i) => (f.d > fs[m].d ? i : m), 0), bi = fs.reduce((m, f, i) => (f.a / f.d > fs[m].a / fs[m].d ? i : m), 0);
      if (new Set([top, wide, bi]).size < 3) return null;
      const ps = []; while (ps.length < 3) { const q = person(); if (!ps.some(x => x.name === q.name)) ps.push(q); }
      return { fs, ps };
    })(); if (r) return r; }
      return null;
    },
    make: ({ fs, ps }) => {
      const best = fs.reduce((m, f, i) => (f.a / f.d > fs[m].a / fs[m].d ? i : m), 0);
      return { question: `${ps[0].name}, ${ps[1].name} and ${ps[2].name} each read a book of the same length. ${ps[0].name} has read ${fs[0].a}/${fs[0].d} of ${ps[0].her} book, ${ps[1].name} has read ${fs[1].a}/${fs[1].d} and ${ps[2].name} has read ${fs[2].a}/${fs[2].d}. Compare the fractions. Who has read the most?`,
        options: shuffle(ps.map((q, i) => ({ text: q.name, right: i === best, ...(i === best ? {} : i === fs.reduce((m, f, j) => (f.a > fs[m].a ? j : m), 0) ? { why: `${q.name} has the biggest numerator, but the pieces are different sizes. Write the three fractions with the same denominator, then compare.`, mis: 'M_NUMERATOR_ONLY_COMPARED' } : { why: `${q.name} has the biggest denominator, but a bigger denominator means smaller pieces. Write the three fractions with the same denominator, then compare.`, mis: 'M_BIGGER_DENOMINATOR_BIGGER' }) }))),
        hints: ['Fractions with different denominators cannot be compared directly.', 'Write all three with a common denominator.'],
        steps: [`A common denominator is ${lcm(lcm(fs[0].d, fs[1].d), fs[2].d)}.`, `The fractions are ${fs.map(f => `${f.a * lcm(lcm(fs[0].d, fs[1].d), fs[2].d) / f.d}/${lcm(lcm(fs[0].d, fs[1].d), fs[2].d)}`).join(', ')}.`, `The biggest is ${ps[best].name}'s.`] };
    } }),

  fam({ id: 'g7.frac.one-piece-short', skill: 'G7_FRACTIONS_COMPARE', outcome: 'MATH.G7.NUMBER.FRACTIONS.a', cskill: 'MATH.G7.NUMBER.FRACTIONS.COMPARE_FRACTIONS', rung: 3, form: 'why',
    draw: () => { const n = randInt(3, 9); return { n, swap: Math.random() < 0.5 }; },
    make: ({ n, swap }) => {
      const A = `${n - 1}/${n}`, B = `${n}/${n + 1}`, first = swap ? B : A, second = swap ? A : B;
      return { question: `Which is greater: ${first} or ${second}? Choose the best reason.`, story: false,
        options: shuffle([
          { text: `${B} is greater, because less is missing from a whole`, right: true },
          { text: `${A} is greater, because its denominator is smaller`, right: false, why: `A smaller denominator does not decide it. Look at how much is missing from a whole in each fraction.`, mis: 'M_BIGGER_DENOMINATOR_BIGGER' },
          { text: `${B} is greater, because its denominator is bigger`, right: false, why: 'A bigger denominator does not always mean a bigger fraction: 1/9 is less than 1/2. The reason is in the piece that is missing.', mis: 'M_NUMERATOR_ONLY_COMPARED' },
          { text: 'They are equal, because each is one piece short of a whole', right: false, why: `The missing pieces are not the same size: ${n + 1}ths are smaller than ${n}ths.`, mis: 'M_ONE_PIECE_SHORT_EQUAL' },
        ]),
        hints: ['Each fraction is one piece short of a whole. Compare the missing pieces.', 'Which missing piece is smaller?'],
        steps: [`${A} = 1 − 1/${n} and ${B} = 1 − 1/${n + 1}.`, `1/${n + 1} is smaller than 1/${n}, so less is missing from ${B}.`, `So ${B} is greater.`] };
    } }),

  fam({ id: 'g7.frac.recip-cups', skill: 'G7_RECIPROCALS', outcome: 'MATH.G7.NUMBER.FRACTIONS.e', cskill: 'MATH.G7.NUMBER.FRACTIONS.RECIPROCAL', rung: 2, form: 'word',
    draw: () => {
      const [a, b] = pick([[2, 3], [2, 5], [3, 4], [3, 5], [3, 8], [5, 6]]), k = randInt(2, 6), L = a * k;
      const ans = k * b; return [round((L * a) / b, 2), L * b, L * a].every(v => Math.abs(v - ans) > 2) ? { a, b, k, L, ans, p: person() } : null;
    },
    make: ({ a, b, k, L, ans, p }) => ({
      question: `${p.name} has ${L} litres of juice. ${p.She} pours it into small cups that each hold ${a}/${b} of a litre. To find the number of cups, ${p.she} multiplies ${L} by the reciprocal of ${a}/${b}. How many cups does ${p.she} fill?`,
      answer: ans,
      wrong: [[round((L * a) / b, 2), `That multiplies by ${a}/${b} itself. The reciprocal turns the fraction upside down first.`, 'M_NOT_FLIPPED'], [L * b, 'The reciprocal is a fraction. Multiply by the whole fraction, not only the top.', 'M_ONLY_DENOMINATOR_USED'], [L * a, 'The reciprocal has both a top and a bottom. Use both.', 'M_ONLY_NUMERATOR_USED']],
      hints: [`Turn ${a}/${b} upside down to get its reciprocal.`, `Multiply ${L} by the reciprocal.`],
      steps: [`The reciprocal of ${a}/${b} is ${b}/${a}.`, `${L} × ${b}/${a} = ${L * b}/${a} = ${ans}.`] }),
    check: ({ a, b, L }, x) => (x * a) / b === L }),

  fam({ id: 'g7.frac.recip-mixed-why', skill: 'G7_RECIPROCALS', outcome: 'MATH.G7.NUMBER.FRACTIONS.e', cskill: 'MATH.G7.NUMBER.FRACTIONS.RECIPROCAL', rung: 3, form: 'why',
    draw: () => { const b = pick([3, 4, 5, 7]), a = randInt(2, b - 1); return gcd(a, b) === 1 ? { w: randInt(1, 4), a, b, p: person() } : null; },
    make: ({ w, a, b, p }) => {
      const n = w * b + a;
      return { question: `${p.name} finds the reciprocal of ${w} ${a}/${b} and writes ${w} ${b}/${a}. Why is this not the reciprocal?`, story: false,
        options: shuffle([
          { text: `${w} ${a}/${b} must first be written as ${n}/${b}. Its reciprocal is ${b}/${n}`, right: true },
          { text: 'A mixed number does not have a reciprocal', right: false, why: 'Every number except 0 has a reciprocal, including mixed numbers.', mis: 'M_MIXED_NUMBER_HAS_NONE' },
          { text: `The whole number ${w} stays the same in a reciprocal`, right: false, why: 'The reciprocal of the whole number is found with the fraction. The whole number part cannot stay as it is.', mis: 'M_MIXED_NUMBER_FLIPPED_BY_PARTS' },
          { text: `The reciprocal of a number is the same number with a minus sign`, right: false, why: 'That is the opposite, not the reciprocal. A number times its reciprocal is 1.', mis: 'M_RECIPROCAL_IS_NEGATIVE' },
        ]),
        hints: ['A number times its reciprocal is 1.', 'Write the mixed number as one fraction first, then turn it upside down.'],
        steps: [`${w} ${a}/${b} = ${n}/${b}.`, `The reciprocal is ${b}/${n}.`, `Check: ${n}/${b} × ${b}/${n} = 1.`] };
    } }),

  fam({ id: 'g7.frac.div-operation', skill: 'G7_FRACTIONS_DIV', outcome: 'MATH.G7.NUMBER.FRACTIONS.g', cskill: 'MATH.G7.NUMBER.FRACTIONS.DIVIDE_WHOLE_BY_FRACTION', rung: 2, form: 'word',
    draw: () => { const [a, b] = pick([[2, 3], [3, 4], [1, 4], [3, 5], [1, 2]]); return { a, b, L: randInt(3, 12), p: person(), item: pick([['flour', 'kg', 'loaf', 'loaves'], ['maize flour', 'kg', 'bag', 'bags'], ['paint', 'litres', 'door', 'doors']]) }; },
    make: ({ a, b, L, p, item }) => ({
      question: `${p.name} has ${L} ${item[1]} of ${item[0]}. Each ${item[2]} needs ${a}/${b} of a ${item[1] === 'litres' ? 'litre' : 'kg'}. Which calculation gives how many ${item[3]} ${p.she} can make?`,
      options: shuffle([
        { text: `${L} ÷ ${a}/${b}`, right: true },
        { text: `${L} × ${a}/${b}`, right: false, why: `That finds ${a}/${b} of ${L}, not how many lots of ${a}/${b} fit into ${L}.`, mis: 'M_FRACTION_OF_NOT_HOW_MANY' },
        { text: `${a}/${b} ÷ ${L}`, right: false, why: 'This divides the small amount by the large one. The question asks how many of the small amounts fit into the large one.', mis: 'M_SMALL_DIVIDED_BY_LARGE' },
        { text: `${L} − ${a}/${b}`, right: false, why: `Taking away ${a}/${b} once does not count how many times it fits.`, mis: 'M_TAKEN_AWAY_ONCE' },
      ]),
      hints: ['"How many lots of a small amount fit into a big amount" is a division.', 'Which amount is being shared out, and which is the size of each part?'],
      steps: [`Each ${item[2]} needs ${a}/${b}, and there are ${L} ${item[1]} altogether.`, `The number of ${item[3]} is ${L} ÷ ${a}/${b}.`] }) }),

  fam({ id: 'g7.frac.div-tank-buckets', skill: 'G7_FRACTIONS_DIV', outcome: 'MATH.G7.NUMBER.FRACTIONS.f', cskill: 'MATH.G7.NUMBER.FRACTIONS.DIVIDE_FRACTION_BY_WHOLE', rung: 2, form: 'word',
    draw: () => {
      const [a, b] = pick([[3, 4], [2, 3], [3, 5], [4, 5], [5, 6], [3, 8]]), k = pick([2, 3, 4, 5, 6]);
      if (a % k === 0 || k % a === 0) return null;
      const right = frac(a, b * k), w = [frac(a * k, b), frac(a, b + k), frac(b * k, a)];
      return distinct(right, ...w) && !w.includes(right) ? { a, b, k, right, w, p: person() } : null;
    },
    make: ({ a, b, k, right, w, p }) => ({
      question: `A water tank is ${a}/${b} full. ${p.name} divides the water equally among ${k} drums. What fraction of the whole tank is in each drum?`,
      options: shuffle([{ text: right, right: true }, { text: w[0], right: false, why: 'That multiplies by the number of drums. Sharing equally makes each part smaller.', mis: 'M_MULTIPLIED_BY_DIVISOR' }, { text: w[1], right: false, why: 'The denominator is not found by adding. Dividing by a number multiplies the denominator.', mis: 'M_WHOLE_ADDED_TO_DENOMINATOR' }, { text: w[2], right: false, why: 'That turns the fraction upside down and multiplies. Divide the fraction by the number of drums.', mis: 'M_FLIPPED_THE_DIVIDEND' }]),
      hints: ['Sharing equally into drums is dividing the fraction by the number of drums.', 'Dividing a fraction by a whole number is the same as multiplying by one over that number.'],
      steps: [`${a}/${b} ÷ ${k} = ${a}/${b} × 1/${k}.`, `= ${a}/${b * k}${gcd(a, b * k) > 1 ? ` = ${right}` : ''}.`] }) }),

  fam({ id: 'g7.frac.mul-land', skill: 'G7_FRACTIONS_MUL', outcome: 'MATH.G7.NUMBER.FRACTIONS.d', cskill: 'MATH.G7.NUMBER.FRACTIONS.MULT_FRACTION_BY_FRACTION', rung: 2, form: 'word',
    draw: () => {
      const [a, b] = pick([[3, 4], [2, 3], [3, 5], [5, 6], [7, 8]]), [c, d] = pick([[1, 3], [1, 2], [2, 5], [3, 4], [1, 4]]), N = pick([24, 30, 36, 40, 48, 60, 72, 120]);
      if ((N * a * c) % (b * d) !== 0) return null;
      const ans = (N * a * c) / (b * d);
      const far = [(N * a) / b, round(N * c / d, 2), round(N * (a / b + c / d), 2)].every(v => Math.abs(v - ans) > 2);
      return far && distinct(ans, (N * a) / b, round(N * c / d, 2), round(N * (a / b + c / d), 2)) ? { a, b, c, d, N, ans, p: person() } : null;
    },
    make: ({ a, b, c, d, N, ans, p }) => ({
      question: `${p.name} has a shamba of ${N} acres. ${a}/${b} of the shamba is planted with maize. ${c}/${d} of the maize land is near the river. How many acres of maize are near the river?`,
      answer: ans,
      wrong: [[(N * a) / b, `That is all the maize land. Only ${c}/${d} of it is near the river.`, 'M_STOPPED_AFTER_FIRST_FRACTION'], [round((N * c) / d, 2), `${c}/${d} must be taken of the maize land, not of the whole shamba.`, 'M_FRACTION_OF_WRONG_WHOLE'], [round(N * (a / b + c / d), 2), 'Part of a part is found by multiplying the two fractions, not adding them.', 'M_ADD_FRACTIONS_INSTEAD']],
      hints: ['First find the acres of maize.', `Then find ${c}/${d} of that.`],
      steps: [`Maize: ${a}/${b} of ${N} = ${(N * a) / b} acres.`, `Near the river: ${c}/${d} of ${(N * a) / b} = ${ans} acres.`] }),
    check: ({ a, b, c, d, N }, x) => x * b * d === N * a * c }),

  fam({ id: 'g7.frac.seq-tank', skill: 'G7_FRACTIONS_ADD_UNLIKE', outcome: 'MATH.G7.NUMBER.FRACTIONS.h', cskill: 'MATH.G7.NUMBER.FRACTIONS.FRACTION_SEQ_ADD_RULE', rung: 2, form: 'word',
    draw: () => {
      const dir = pick([1, -1]), D = dir === 1 ? pick([10, 12]) : pick([8, 10, 12]), k = 2, s = dir === 1 ? randInt(1, 2) : randInt(9, D);
      if (dir === 1 && s + 4 * k > D) return null; if (dir === -1 && (s - 4 * k < 1 || s > D)) return null;
      const t = (i) => mixed(s + dir * k * i, D);
      const right = t(4), w = [t(5), mixed(s + dir * (k * 3 + 1), D), mixed(s + dir * k * 3 + dir, D + 1)];
      return distinct(right, ...w, t(3)) ? { dir, D, s, k, right, w, shown: [0, 1, 2, 3].map(t), p: person() } : null;
    },
    make: ({ dir, shown, right, w, p }) => ({
      question: `A tank at ${p.name}'s school is ${dir === 1 ? 'filling' : 'emptying'}. The part of the tank that is ${dir === 1 ? 'full' : 'still full'} after each hour follows a pattern: ${shown.join(', ')}. What comes next in the sequence, after the fifth hour?`,
      options: shuffle([{ text: right, right: true }, { text: w[0], right: false, why: 'That skips a term. The next term is the one straight after the last one shown.', mis: 'M_END_NOT_NEXT' }, { text: w[1], right: false, why: 'The same amount is added or taken away each time. Check the gap between the terms you can see.', mis: 'M_GAP_NOT_CONSTANT' }, { text: w[2], right: false, why: 'Only the numerator changes. The denominator stays the same when the same fraction is added each time.', mis: 'M_DENOMINATOR_ALSO_CHANGED' }]),
      hints: ['Write the terms with the same denominator and find the gap between them.', 'Use the same gap once more.'],
      steps: [`Over a common denominator the gap between terms is the same each hour.`, `Adding the gap ${dir === 1 ? 'to' : 'taking it from'} ${shown[3]} gives ${right}.`] }) }),

  fam({ id: 'g7.frac.seq-fill-table', skill: 'G7_FRACTIONS_ADD_UNLIKE', outcome: 'MATH.G7.NUMBER.FRACTIONS.h', cskill: 'MATH.G7.NUMBER.FRACTIONS.FRACTION_SEQ_IN_TABLE', rung: 3, form: 'table',
    draw: () => ({ m: pick([10, 14]), p: person() }),
    make: ({ m, p }) => ({
      question: `${p.name} fills a tank at a steady rate. The table shows the part of the tank that is full after 2, 4 and 6 hours. If the pattern continues, after how many hours is the tank full?`, story: false,
      model: { type: 'table', data: { head: ['Hours', 'Part of the tank full'], rows: [2, 4, 6].map(h => ({ label: String(h), value: mixed(h, m) })) } },
      answer: m,
      wrong: [[6, 'That is the last time in the table, and the tank is not full yet.', 'M_LAST_ROW_TAKEN_AS_ANSWER'], [m / 2, 'The table goes up in steps of 2 hours. Count hours, not steps.', 'M_STEPS_COUNTED_NOT_HOURS'], [m * 2, 'That is too long. Work out the part filled in one hour.', 'M_STEP_RATE_AS_HOURLY']],
      hints: ['Find the part filled in 2 hours, then in 1 hour.', 'How many of those fill the whole tank?'],
      steps: [`In 2 hours the part full is ${mixed(2, m)}, so in 1 hour it is 1/${m}.`, `The tank is full when ${m} lots of 1/${m} are added: ${m} hours.`] }),
    check: ({ m }, a) => a * 1 === m && (a / 2) % 1 === 0 && a > 6 }),

  fam({ id: 'g7.frac.seq-rule', skill: 'G7_FRACTIONS_ADD_UNLIKE', outcome: 'MATH.G7.NUMBER.FRACTIONS.h', cskill: 'MATH.G7.NUMBER.FRACTIONS.FRACTION_SEQ_MULTIPLY_RULE', rung: 2, form: 'direct',
    draw: () => ({ r: pick([2, 3, 4, 5]) }),
    make: ({ r }) => ({
      question: `Look at the pattern of fractions: 1, 1/${r}, 1/${r * r}, 1/${r ** 3}, ... Which rule makes each term from the one before it?`, story: false,
      options: shuffle([
        { text: `Divide by ${r} each time`, right: true },
        { text: `Multiply by ${r} each time`, right: false, why: 'Multiplying by a whole number makes terms bigger. These terms are getting smaller.', mis: 'M_MULTIPLY_FOR_SMALLER' },
        { text: `Take away 1/${r} each time`, right: false, why: `Take 1/${r} away from 1/${r} and nothing is left, but the next term is still there.`, mis: 'M_FRACTION_SUBTRACTED_NOT_SCALED' },
        { text: `Take away ${r} each time`, right: false, why: 'Taking away a whole number would give negative terms.', mis: 'M_WHOLE_SUBTRACTED_FROM_FRACTION' },
      ]),
      hints: ['Compare each term with the one before it: is it bigger or smaller?', 'Try dividing the first term by the second.'],
      steps: [`1 ÷ 1/${r} = ${r}, so each term is 1/${r} of the one before.`, `That means divide by ${r} each time.`] }) }),

  // ======================================================================
  // DECIMALS
  // ======================================================================
  fam({ id: 'g7.dec.read-chart', skill: 'G7_DECIMAL_PV', outcome: 'MATH.G7.NUMBER.DECIMALS.a', cskill: 'MATH.G7.NUMBER.DECIMALS.DEC_PLACE_AND_TOTAL_VALUE', rung: 2, form: 'table',
    draw: () => {
      const ds = [randInt(1, 9), randInt(0, 9), randInt(1, 9), randInt(0, 9), randInt(1, 9)];  // tens, ones, tenths, hundredths, thousandths
      const order = shuffle([0, 1, 2, 3, 4]); const naive = order.map(i => ds[i]);
      const val = ds[0] * 10 + ds[1] + ds[2] / 10 + ds[3] / 100 + ds[4] / 1000;
      return distinct(...ds.filter((_, i) => i !== 1 && i !== 3)) && ds[0] !== ds[1] && ds[2] !== ds[3] && order.join('') !== '01234' ? { ds, order, val: round(val, 3) } : null;
    },
    make: ({ ds, order, val }) => {
      const NAMES = ['Tens', 'Ones', 'Tenths', 'Hundredths', 'Thousandths'];
      const naive = Number(`${order[0] === 0 ? '' : ''}${order.map(i => ds[i]).slice(0, 2).join('')}.${order.map(i => ds[i]).slice(2).join('')}`);
      return { question: 'The table shows the digits of a decimal number. The rows are not in order. Write the number it shows.', story: false,
        model: { type: 'table', data: { head: ['Place', 'Digit'], rows: order.map(i => ({ label: NAMES[i], value: String(ds[i]) })) } },
        answer: val,
        wrong: [[naive, 'You read the digits from the top of the table down. Each row has a place name: put every digit in its own place.', 'M_DIGITS_READ_TOP_DOWN'], [round(ds[1] * 10 + ds[0] + ds[2] / 10 + ds[3] / 100 + ds[4] / 1000, 3), 'The tens digit comes before the ones digit. Check which digit is in which place.', 'M_TENS_AND_ONES_SWAPPED'], [round(ds[0] * 10 + ds[1] + ds[2] / 100 + ds[3] / 10 + ds[4] / 1000, 3), 'Tenths come straight after the point, then hundredths, then thousandths.', 'M_DECIMAL_PLACES_SWAPPED']],
        hints: ['Say the place of each digit by its row name.', 'Tens and ones go before the decimal point. Tenths, hundredths and thousandths go after it.'],
        steps: [`Tens ${ds[0]}, ones ${ds[1]}, tenths ${ds[2]}, hundredths ${ds[3]}, thousandths ${ds[4]}.`, `The number is ${val}.`] };
    },
    check: ({ ds }, a) => String(a).replace('.', '').length >= 3 && Math.floor(a / 10) === ds[0] && Math.round((a * 1000) % 10) === ds[4] }),

  fam({ id: 'g7.dec.how-many-hundredths', skill: 'G7_DECIMAL_PV', outcome: 'MATH.G7.NUMBER.DECIMALS.a', cskill: 'MATH.G7.NUMBER.DECIMALS.DEC_COUNT_TENTHS', rung: 2, form: 'word',
    draw: () => { const dp = pick([1, 2]), N = dp === 1 ? randInt(21, 98) : randInt(121, 998); return N % 10 === 0 ? null : { dp, N, p: person(), what: pick([['cloth', 'metre', 'long'], ['rope', 'metre', 'long'], ['sugar', 'kilogram', 'in the bag']]) }; },
    make: ({ dp, N, p, what }) => {
      const x = round(N / 10 ** dp, 2), unit = dp === 1 ? 'tenths' : 'hundredths';
      return { question: `${p.name} measures ${x} ${what[1]}s of ${what[0]}. How many ${unit} of a ${what[1]} is this?`,
        answer: N,
        wrong: [[x, `That is the same number written as a decimal. Count how many ${unit} make it.`, 'M_SAME_NUMBER_REPEATED'], [dp === 1 ? N * 10 : round(N / 10, 2), `That mixes up the two places: each whole is split into ${dp === 1 ? '10 tenths' : '100 hundredths'}, and ${unit} are not the same as ${dp === 1 ? 'hundredths' : 'tenths'}.`, 'M_TENTHS_HUNDREDTHS_CONFUSED'], [Number(String(N).slice(1)), 'That only counts the digits after the first one. Count the whole ones too.', 'M_WHOLES_NOT_COUNTED']],
        hints: [`One ${what[1]} is ${dp === 1 ? 10 : 100} ${unit}.`, `Multiply the number of ${what[1]}s by ${dp === 1 ? 10 : 100}.`],
        steps: [`1 ${what[1]} = ${dp === 1 ? 10 : 100} ${unit}.`, `${x} × ${dp === 1 ? 10 : 100} = ${N} ${unit}.`] };
    },
    check: ({ dp, N }, a) => a / 10 ** dp === round(N / 10 ** dp, 2) }),

  fam({ id: 'g7.dec.price-per-kg', skill: 'G7_DECIMALS_MUL', outcome: 'MATH.G7.NUMBER.DECIMALS.b', cskill: 'MATH.G7.NUMBER.DECIMALS.MULT_DEC_BY_WHOLE', rung: 1, form: 'word',
    draw: () => { const item = pick(['kg of beans', 'kg of rice', 'kg of sugar', 'kg of tomatoes']), pr = price(item), q = pick([1.5, 2.5, 3.5, 4.5, 5.5]); return { item, pr, q, p: person() }; },
    make: ({ item, pr, q, p }) => ({
      question: `${p.name} buys ${q} kg of ${item.replace('kg of ', '')}. Each kilogram costs ${sh(pr)}. How much does ${p.she} pay? Answer in shillings.`,
      answer: round(pr * q, 2),
      wrong: [[pr * Math.floor(q), 'You paid for the whole kilograms only. The half kilogram costs money too.', 'M_FRACTION_PART_DROPPED'], [round(pr + q, 2), 'The price is for each kilogram, so multiply by the number of kilograms. Do not add.', 'M_ADDED_NOT_MULTIPLIED'], [round(pr * q * 10, 1), 'The decimal point is in the wrong place. Multiplying by a number with one decimal place gives a smaller answer than this.', 'M_POINT_NOT_MOVED_BACK']],
      hints: ['The price is for 1 kg. How many kilograms are bought?', `Multiply ${pr} by ${q}.`],
      steps: [`${pr} × ${q}: first ${pr} × ${q * 10} = ${pr * q * 10}.`, `${q} has 1 decimal place, so divide by 10: ${round(pr * q, 2)}.`] }),
    check: ({ pr, q }, a) => a / q === pr }),

  fam({ id: 'g7.dec.garden-steps', skill: 'G7_DECIMALS_MUL', outcome: 'MATH.G7.NUMBER.DECIMALS.b', cskill: 'MATH.G7.NUMBER.DECIMALS.MULT_DEC_BY_DEC', rung: 3, form: 'steps',
    draw: () => {
      const L = pick([3.2, 4.5, 2.4, 5.5, 3.6, 4.8]), w = pick([2.5, 1.5, 2.4, 3.5, 2.2]), pr = pick([40, 60, 80, 100, 120]); const area = round(L * w, 2), cost = round(area * pr, 2);
      return L !== w && Number.isInteger(cost) && distinct(area, round(2 * (L + w), 2), round(L + w, 2)) ? { L, w, pr, area, cost, per: round(2 * (L + w), 2), p: person() } : null;
    },
    make: ({ L, w, pr, area, cost, per, p }) => ({
      question: `${p.name} has a rectangular garden ${L} m long and ${w} m wide.`,
      parts: [
        { prompt: 'What is the area of the garden, in square metres?', answer: area, unit: 'm²', hint: 'Area of a rectangle = length × width.', wrong: [[round(L + w, 2), 'Area is found by multiplying, not adding.', 'M_ADDED_NOT_MULTIPLIED'], [per, 'That is the distance around the garden, the perimeter.', 'M_PERIMETER_FOR_AREA'], [round(area * 10, 2), 'Count the decimal places in both numbers: the answer has that many in total.', 'M_POINT_NOT_MOVED_BACK']] },
        { prompt: `Grass costs ${sh(pr)} for each square metre. What is the cost of covering the garden with grass? Answer in shillings.`, answer: cost, hint: 'Cost = area × price for each square metre.', wrong: [[round(L * pr, 2), 'Use the whole area, not only the length.', 'M_WRONG_QUANTITY_MULTIPLIED'], [round(area + pr, 2), 'The price is for each square metre. Multiply.', 'M_ADDED_NOT_MULTIPLIED'], [round(per * pr, 2), 'That uses the perimeter. Grass covers the area.', 'M_PERIMETER_FOR_AREA']] },
      ],
      steps: [`Area: ${L} × ${w} = ${area} m².`, `Cost: ${area} × ${pr} = ${commas(cost)}.`] }),
    check: ({ L, w, pr }, v) => Math.abs(v[0] / L - w) < 1e-9 && Math.abs(v[1] / pr - v[0]) < 1e-9 }),

  fam({ id: 'g7.dec.ribbon-bows', skill: 'G7_DECIMALS_DIV', outcome: 'MATH.G7.NUMBER.DECIMALS.c', cskill: 'MATH.G7.NUMBER.DECIMALS.DIV_BY_DECIMAL', rung: 2, form: 'word',
    draw: () => { const q = pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 1.5]), n = randInt(8, 40), t = round(q * n, 2); return { q, n, t, p: person() }; },
    make: ({ q, n, t, p }) => ({
      question: `${p.name} divides a ribbon ${t} m long into pieces of ${q} m each to make bows. How many pieces does ${p.she} get?`,
      answer: n,
      wrong: [[round(t * q, 3), 'To find how many pieces fit, divide. Multiplying gives a smaller number.', 'M_MULTIPLIED_INSTEAD_OF_COUNTING'], [round(n / 10, 2), 'Move the decimal point in both numbers by the same amount, so the divisor is whole. Check how far you moved it.', 'M_POINT_MOVED_ONE_NUMBER'], [round(t - q, 2), 'Taking one piece away is not counting how many pieces fit.', 'M_REPEATED_SUBTRACTION_ONCE']],
      hints: ['How many lots of the piece length fit into the whole ribbon?', 'Multiply both numbers by 100 so neither has a decimal point.'],
      steps: [`${t} ÷ ${q}: multiply both by 100 to get ${round(t * 100, 0)} ÷ ${round(q * 100, 0)}.`, `${round(t * 100, 0)} ÷ ${round(q * 100, 0)} = ${n}.`] }),
    check: ({ q, t }, a) => Math.abs(a * q - t) < 1e-9 }),

  fam({ id: 'g7.dec.beans-steps', skill: 'G7_DECIMALS_DIV', outcome: 'MATH.G7.NUMBER.DECIMALS.c', cskill: 'MATH.G7.NUMBER.DECIMALS.DIV_BY_DECIMAL', rung: 3, form: 'steps',
    draw: () => {
      const pr = pick([120, 150, 160, 180, 200]), q = pick([1.2, 2.5, 3.6, 4.5]), q2 = pick([0.5, 1.5, 2.5, 3.5]); const cost = round(pr * q, 2);
      return q !== q2 && Number.isInteger(cost) ? { pr, q, q2, cost, X: pr * q2, p: person() } : null;
    },
    make: ({ pr, q, q2, cost, X, p }) => ({
      question: `${p.name} pays ${sh(cost)} for ${q} kg of beans at a shop. ${p.She} divides the money by the kilograms to find what 1 kg costs.`,
      parts: [
        { prompt: 'What is the price of 1 kg of beans, in shillings?', answer: pr, hint: `Divide the money paid by ${q}. Multiply both by 10 first.`, wrong: [[round(cost * q, 2), 'To find the price of 1 kg, divide. Multiplying makes a number that is too big.', 'M_MULTIPLIED_NOT_DIVIDED'], [round(cost - q, 2), 'Taking away the kilograms does not give the price of one.', 'M_SUBTRACTED_NOT_DIVIDED'], [pr * 10, 'The point has slipped one place when dividing, so the answer is ten times too big.', 'M_POINT_PLACED_WRONG']] },
        { prompt: 'At that price, how much do 5 kg of beans cost? Answer in shillings.', answer: pr * 5, hint: 'Price of 1 kg × 5.', wrong: [[cost * 5, 'That is 5 times the cost of the first purchase. Use the price of 1 kg.', 'M_WRONG_QUANTITY_MULTIPLIED'], [pr + 5, 'Multiply the price of 1 kg by 5.', 'M_ADDED_NOT_MULTIPLIED'], [round(cost / 5, 2), 'That divides. Buying more costs more.', 'M_DIVIDED_NOT_MULTIPLIED']] },
        { prompt: `${p.name} has ${sh(X)}. How many kilograms of beans can ${p.she} buy at that price?`, answer: q2, unit: 'kg', hint: 'Divide the money by the price of 1 kg.', wrong: [[X * pr, 'The number of kilograms is smaller than the money. Divide.', 'M_MULTIPLIED_NOT_DIVIDED'], [round((X / pr) * 10, 1), 'The point has slipped one place in the division, so the answer is ten times too big.', 'M_POINT_PLACED_WRONG'], [round(X - pr, 2), 'Taking away is not the same as dividing.', 'M_SUBTRACTED_NOT_DIVIDED']] },
      ],
      steps: [`${cost} ÷ ${q} = ${round(cost * 10, 0)} ÷ ${round(q * 10, 0)} = ${pr}.`, `5 × ${pr} = ${pr * 5}.`, `${X} ÷ ${pr} = ${q2} kg.`] }),
    check: ({ cost, q, X }, v) => Math.abs(v[0] * q - cost) < 1e-6 && v[1] === 5 * v[0] && Math.abs(v[2] * v[0] - X) < 1e-6 }),

  // ======================================================================
  // SQUARES AND SQUARE ROOTS
  // ======================================================================
  fam({ id: 'g7.sq.garden-double', skill: 'G7_SQUARES_EXT', outcome: 'MATH.G7.NUMBER.SQUARES_AND_SQUARE_ROOTS.a', cskill: 'MATH.G7.NUMBER.SQUARES_AND_SQUARE_ROOTS.SQUARE_DECIMAL', rung: 3, form: 'steps',
    draw: () => { const s = pick([1.2, 1.5, 2.5, 3.5, 0.8, 4.5]), pr = pick([100, 120, 160, 200]); const area = round(s * s, 4), cost = round(area * pr, 2); return Number.isInteger(cost) ? { s, pr, area, cost, p: person() } : null; },
    make: ({ s, pr, area, cost, p }) => ({
      question: `${p.name} has a square vegetable garden. Each side is ${s} m long.`,
      parts: [
        { prompt: 'What is the area of the garden, in square metres?', answer: area, unit: 'm²', hint: `Area of a square = side × side, so square ${s}.`, wrong: [[round(s * 2, 2), `That doubles the side. Squaring means ${s} × ${s}.`, 'M_DOUBLED_NOT_SQUARED'], [round(s * 4, 2), 'That is the perimeter. Area is side × side.', 'M_PERIMETER_FOR_AREA_SQ'], [round(area * 10, 3), 'The decimal point is in the wrong place. The product of two decimals has as many decimal places as both together.', 'M_POINT_PLACES_NOT_DOUBLED']] },
        { prompt: `${p.name} makes a new square garden with sides twice as long. What is the area of the new garden, in square metres?`, answer: round(4 * area, 4), unit: 'm²', hint: 'The new side is double the old side. Square it.', wrong: [[round(2 * area, 4), 'Doubling the side makes the area more than double. Square the new side.', 'M_AREA_DOUBLES_WITH_SIDE'], [round(area + 2 * s, 4), 'Work out the new side first, then square it.', 'M_ADDED_NOT_SQUARED'], [round(area * 8, 4), 'The area grows by the square of 2, not by the cube.', 'M_CUBED_NOT_SQUARED']] },
      ],
      steps: [`${s} × ${s} = ${area} m².`, `New side ${round(2 * s, 2)} m, and ${round(2 * s, 2)}² = ${round(4 * area, 4)} m².`] }),
    check: ({ s }, v) => Math.abs(v[0] / s - s) < 1e-9 && Math.abs(v[1] / v[0] - 4) < 1e-9 }),

  fam({ id: 'g7.sq.decimal-spot', skill: 'G7_SQUARES_EXT', outcome: 'MATH.G7.NUMBER.SQUARES_AND_SQUARE_ROOTS.a', cskill: 'MATH.G7.NUMBER.SQUARES_AND_SQUARE_ROOTS.SQUARE_DECIMAL', rung: 3, form: 'spot',
    draw: () => ({ dp: pick([1, 2]), a: randInt(2, 9), p: person() }),
    make: ({ dp, a, p }) => {
      const x = round(a / 10 ** dp, 3), shownDp = dp, num = a * a, shown = round(num / 10 ** shownDp, 6);
      const fmt = (v) => String(round(v, 6));
      return { question: `${p.name} works out the square of ${fmt(x)}. Here is ${p.her} working. Which step has the mistake?`,
        working: [
          { text: `Ignore the point: ${a} × ${a} = ${num}.`, ok: num === a * a },
          { text: `${fmt(x)} has ${dp} decimal place${dp > 1 ? 's' : ''}, so its square has ${shownDp} decimal place${shownDp > 1 ? 's' : ''}.`, ok: shownDp === 2 * dp },
          { text: `Put the point in ${num}, with ${shownDp} decimal place${shownDp > 1 ? 's' : ''}: ${fmt(shown)}.`, ok: shown === round(num / 10 ** shownDp, 6) },
          { text: `So (${fmt(x)})² = ${fmt(shown)}.`, ok: true },
        ],
        mis: 'M_POINT_PLACES_NOT_DOUBLED',
        fix: `Squaring multiplies the number by itself, so the decimal places double: ${dp} + ${dp} = ${2 * dp}. The square has ${2 * dp} decimal places.`,
        steps: [`${a} × ${a} = ${num}.`, `${2 * dp} decimal places: ${fmt(round(num / 10 ** (2 * dp), 6))}.`] };
    } }),

  fam({ id: 'g7.sq.fraction-options', skill: 'G7_SQUARES_EXT', outcome: 'MATH.G7.NUMBER.SQUARES_AND_SQUARE_ROOTS.a', cskill: 'MATH.G7.NUMBER.SQUARES_AND_SQUARE_ROOTS.SQUARE_FRACTION', rung: 2, form: 'direct',
    draw: () => { const d = randInt(3, 9), n = randInt(2, d - 1); if (gcd(n, d) !== 1) return null; const right = frac(n * n, d * d), w = [frac(n * n, d), frac(n, d * d), frac(2 * n, d)]; return distinct(right, ...w) ? { n, d, right, w } : null; },
    make: ({ n, d, right, w }) => ({
      question: `Which fraction is the square of ${n}/${d}?`, story: false,
      options: shuffle([{ text: right, right: true }, { text: w[0], right: false, why: 'Only the top was squared. Both the numerator and the denominator are multiplied by themselves.', mis: 'M_ONLY_NUMERATOR_SQUARED' }, { text: w[1], right: false, why: 'Only the bottom was squared. Both the numerator and the denominator are multiplied by themselves.', mis: 'M_ONLY_DENOMINATOR_SQUARED' }, { text: w[2], right: false, why: 'That doubles the top. Squaring means multiplying the fraction by itself.', mis: 'M_NUMERATOR_DOUBLED' }]),
      hints: ['The square of a number is the number times itself.', 'Multiply the numerators, and multiply the denominators.'],
      steps: [`(${n}/${d})² = ${n}/${d} × ${n}/${d}.`, `= ${n * n}/${d * d}${gcd(n * n, d * d) > 1 ? ` = ${right}` : ''}.`] }) }),

  fam({ id: 'g7.sq.plot-side', skill: 'G7_SQUARE_ROOTS', outcome: 'MATH.G7.NUMBER.SQUARES_AND_SQUARE_ROOTS.b', cskill: 'MATH.G7.NUMBER.SQUARES_AND_SQUARE_ROOTS.ROOT_IN_CONTEXT', rung: 3, form: 'steps',
    draw: () => ({ s: randInt(12, 45), pr: pick([60, 80, 100, 120]), p: person() }),
    make: ({ s, pr, p }) => ({
      question: `The area of ${p.name}'s square school plot is ${commas(s * s)} m². Take the square root, √${commas(s * s)}, to find a side.`,
      parts: [
        { prompt: 'How long is one side of the plot, in metres?', answer: s, unit: 'm', hint: `Which number multiplied by itself gives ${commas(s * s)}?`, wrong: [[(s * s) / 2, 'Halving the area is not taking its square root.', 'M_HALVED_NOT_ROOTED'], [(s * s) / 4, 'Dividing by 4 does not undo squaring. Look for a number that multiplied by itself gives the area.', 'M_DIVIDED_BY_FOUR_FOR_ROOT'], [s + 1, 'Check by multiplying your number by itself.', 'SLIP']] },
        { prompt: 'How many metres of fence go all the way round the plot?', answer: 4 * s, unit: 'm', hint: 'A square has 4 equal sides.', wrong: [[2 * s, 'A square has four sides, not two.', 'M_TWO_SIDES_FOR_PERIMETER'], [s * s, 'That is the area. The fence goes round the edge.', 'M_AREA_FOR_PERIMETER'], [s + 4, 'The four sides are added: 4 lots of the side.', 'M_SIDE_PLUS_FOUR']] },
      ],
      steps: [`√${commas(s * s)} = ${s}, because ${s} × ${s} = ${commas(s * s)}.`, `Fence: 4 × ${s} = ${4 * s} m.`] }),
    check: ({ s }, v) => v[0] * v[0] === s * s && v[1] === 4 * v[0] }),

  fam({ id: 'g7.sq.between-roots', skill: 'G7_SQUARE_ROOTS', outcome: 'MATH.G7.NUMBER.SQUARES_AND_SQUARE_ROOTS.b', cskill: 'MATH.G7.NUMBER.SQUARES_AND_SQUARE_ROOTS.ROOT_BY_ANCHORS', rung: 2, form: 'word',
    draw: () => { const k = randInt(6, 14), A = randInt(k * k + 1, k * k + 2 * k); return { k, A, p: person() }; },
    make: ({ k, A, p }) => ({
      question: `${p.name} has a square plot with an area of ${A} square metres. Between which two whole numbers does the square root √${A}, the length of one side in metres, lie?`,
      options: shuffle([{ text: `${k} and ${k + 1}`, right: true }, { text: `${k - 1} and ${k}`, right: false, why: `${k} × ${k} is less than ${A}, so the side is longer than ${k}.`, mis: 'M_ROOT_BOUNDS_ONE_BELOW' }, { text: `${k + 1} and ${k + 2}`, right: false, why: `${k + 1} × ${k + 1} is more than ${A}, so the side is shorter than ${k + 1}.`, mis: 'M_ROOT_BOUNDS_ONE_ABOVE' }, { text: `${Math.floor(A / 2)} and ${Math.floor(A / 2) + 1}`, right: false, why: 'Halving the area does not give the side. Square the numbers to test.', mis: 'M_HALVED_NOT_ROOTED' }]),
      hints: ['Find two square numbers, one just below and one just above the area.', 'The square roots of those two square numbers are the whole numbers you need.'],
      steps: [`${k}² = ${k * k} and ${k + 1}² = ${(k + 1) ** 2}.`, `${A} is between ${k * k} and ${(k + 1) ** 2}, so √${A} is between ${k} and ${k + 1}.`] }) }),

  fam({ id: 'g7.sq.root-of-sum-why', skill: 'G7_SQUARE_ROOTS', outcome: 'MATH.G7.NUMBER.SQUARES_AND_SQUARE_ROOTS.b', cskill: 'MATH.G7.NUMBER.SQUARES_AND_SQUARE_ROOTS.ROOT_WHOLE_NUMBER', rung: 3, form: 'why',
    draw: () => { const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]]); return { a, b, c, p: person() }; },
    make: ({ a, b, c, p }) => ({
      question: `${p.name} writes √(${a * a} + ${b * b}) = √${a * a} + √${b * b} = ${a} + ${b} = ${a + b}. Why is this wrong?`, story: false,
      options: shuffle([
        { text: 'A square root of a sum is not the sum of the roots', right: true },
        { text: `${a + b} is correct, because square roots can be added across a sum`, right: false, why: `Work out ${a * a} + ${b * b} first, then take the root. The two ways give different answers.`, mis: 'M_ROOT_OF_SUM_IS_SUM_OF_ROOTS' },
        { text: `√${c * c} must be found by halving ${c * c}, which gives ${(c * c) / 2}`, right: false, why: `Halving is not taking a square root. Test by multiplying: which number times itself gives ${c * c}?`, mis: 'M_HALVED_NOT_ROOTED' },
        { text: `The roots should be multiplied: ${a} × ${b} = ${a * b}`, right: false, why: 'Multiplying the roots does not give the root of a sum either.', mis: 'M_ROOTS_MULTIPLIED_FOR_SUM' },
      ]),
      hints: ['Work out the sum under the root first, then take the square root.', 'Compare the two answers.'],
      steps: [`${a * a} + ${b * b} = ${c * c}, and √${c * c} = ${c}.`, `${a} + ${b} = ${a + b}, which is a different number, so the two methods do not agree.`] }) }),

  fam({ id: 'g7.sq.root-table-sides', skill: 'G7_SQUARE_ROOTS', outcome: 'MATH.G7.NUMBER.SQUARES_AND_SQUARE_ROOTS.b', cskill: 'MATH.G7.NUMBER.SQUARES_AND_SQUARE_ROOTS.ROOT_IN_CONTEXT', rung: 3, form: 'table',
    draw: () => {
      const ss = shuffle([8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20]).slice(0, 4); const mx = Math.max(...ss), mn = Math.min(...ss);
      return distinct(mx - mn, mx * mx - mn * mn, Math.round(Math.sqrt(mx * mx - mn * mn))) ? { ss, mx, mn } : null;
    },
    make: ({ ss, mx, mn }) => ({
      question: 'The table shows the areas of four square plots. How many metres longer is a side of the biggest plot than a side of the smallest plot? Use the square root of each area.', story: false,
      model: { type: 'table', data: { head: ['Plot', 'Area (m²)'], rows: ss.map((s, i) => ({ label: `Plot ${'ABCD'[i]}`, value: commas(s * s) })) } },
      answer: mx - mn,
      wrong: [[mx * mx - mn * mn, 'That is the difference between the areas. Take the square root of each area first.', 'M_AREA_DIFFERENCE_USED'], [Math.round(Math.sqrt(mx * mx - mn * mn)), 'The square root of the difference is not the difference of the square roots. Take each root first.', 'M_ROOT_OF_DIFFERENCE'], [mx, 'That is the side of the biggest plot only. Take away the side of the smallest.', 'M_ONLY_BIGGEST_ROOT']],
      hints: ['Find the largest and the smallest area in the table.', 'Take the square root of each, then subtract.'],
      steps: [`Largest area: ${commas(mx * mx)}, so its side is ${mx} m. Smallest: ${commas(mn * mn)}, so its side is ${mn} m.`, `${mx} − ${mn} = ${mx - mn} m.`] }),
    check: ({ mx, mn }, a) => (a + mn) ** 2 === mx * mx }),
  // ======================================================================
  // ALGEBRAIC EXPRESSIONS
  // ======================================================================
  fam({ id: 'g7.expr.vendor-table', skill: 'G7_EXPRESSIONS', outcome: 'MATH.G7.ALGEBR.ALGEBRAIC_EXPRESSIONS.a', cskill: 'MATH.G7.ALGEBR.ALGEBRAIC_EXPRESSIONS.FORM_EXPRESSION_RATE_FIXED', rung: 2, form: 'table',
    draw: () => { const r = pick([20, 30, 40, 50]), b = pick([10, 20, 30, 50, 100]); return r === b ? null : { r, b, p: person() }; },
    make: ({ r, b }) => {
      const opts = [{ t: `${r}n + ${b}`, f: (n) => r * n + b }, { t: `${b}n + ${r}`, f: (n) => b * n + r }, { t: `${r + b}n`, f: (n) => (r + b) * n }, { t: `${r}(n + ${b})`, f: (n) => r * (n + b) }];
      const fits = (o) => [1, 2, 3].every(n => o.f(n) === r * n + b);
      return { question: 'A water vendor charges to deliver jerricans of water to a home. The table shows some charges. Which expression gives the charge in shillings for n jerricans?', story: false,
        model: { type: 'table', data: { head: ['Jerricans', 'Charge (sh)'], rows: [1, 2, 3].map(n => ({ label: String(n), value: String(r * n + b) })) } },
        options: shuffle(opts.map((o, i) => ({ text: o.t, right: fits(o), why: fits(o) ? undefined : [undefined, `Try n = 1 in ${o.t}. It does not give the first charge in the table. The fixed charge and the charge for each jerrican are mixed up.`, `Try n = 2 in ${o.t}. It does not give the second charge in the table. A fixed charge is not multiplied by n.`, `Try n = 2 in ${o.t}. It does not give the second charge in the table. The fixed amount is added once, after multiplying.`][i], ...(fits(o) ? {} : { mis: [undefined, 'M_RATE_AND_FIXED_SWAPPED', 'M_FIXED_CHARGE_MULTIPLIED', 'M_FIXED_ADDED_BEFORE_MULTIPLYING'][i] }) }))),
        hints: ['Look at how much the charge goes up for each extra jerrican.', 'Then see what is charged even for 0 jerricans, or test each expression with n = 1 and n = 2.'],
        steps: [`Each extra jerrican adds ${r} shillings.`, `For n = 1 the charge is ${r + b}, which is ${r} + ${b}.`, `So the expression is ${r}n + ${b}.`] };
    } }),

  fam({ id: 'g7.expr.three-ages', skill: 'G7_EXPRESSIONS', outcome: 'MATH.G7.ALGEBR.ALGEBRAIC_EXPRESSIONS.a', cskill: 'MATH.G7.ALGEBR.ALGEBRAIC_EXPRESSIONS.FORM_EXPRESSION_RELATIONS', rung: 2, form: 'word',
    draw: () => ({ j: randInt(2, 6), m: pick([2, 3, 4]), p: person() }),
    make: ({ j, m, p }) => ({
      question: `${p.name} is x years old. ${p.Her} brother is ${j} years younger than ${p.herObj}. ${p.Her} mother is ${m} times as old as ${p.name}. Write an expression for the total of the three ages, in years.`,
      options: shuffle([
        { text: `${m + 2}x − ${j}`, right: true },
        { text: `${m + 2}x + ${j}`, right: false, why: 'The brother is younger, so his age is x take away a number, not plus.', mis: 'M_YOUNGER_ADDED' },
        { text: `${m + 1}x − ${j}`, right: false, why: 'One age is missing from the total. Count the three people.', mis: 'M_PERSON_MISSED' },
        { text: `${m + 2}(x − ${j})`, right: false, why: 'Only the brother is younger. The other ages do not have the number taken away.', mis: 'M_RELATION_APPLIED_TO_ALL' },
      ]),
      hints: ['Write each age as an expression: the child, the brother, the mother.', 'Add the three expressions, then collect like terms.'],
      steps: [`Child: x. Brother: x − ${j}. Mother: ${m}x.`, `Total: x + (x − ${j}) + ${m}x = ${m + 2}x − ${j}.`] }) }),

  fam({ id: 'g7.expr.perimeter-spot', skill: 'G7_EXPRESSIONS', outcome: 'MATH.G7.ALGEBR.ALGEBRAIC_EXPRESSIONS.c', cskill: 'MATH.G7.ALGEBR.ALGEBRAIC_EXPRESSIONS.SIMPLIFY_WITH_BRACKETS', rung: 3, form: 'spot',
    draw: () => ({ a: randInt(2, 6), b: randInt(2, 7), bug: pick(['unlike', 'double']), p: person() }),
    make: ({ a, b, bug, p }) => {
      const s = a + b;
      const step3 = bug === 'unlike' ? `= 2 × ${s + 1}x.` : `= 2 × (x + ${s}).`;
      const step4 = bug === 'unlike' ? `= ${2 * (s + 1)}x.` : `= 2x + ${s}.`;
      return { question: `A rectangular plot has a length of (x + ${a}) m and a width of ${b} m. A fence goes all the way round it. ${p.name} writes an expression for the length of the fence. Here is ${p.her} working. Which step has the mistake?`,
        working: [
          { text: 'Fence = 2 × (length + width).', ok: true },
          { text: `= 2 × (x + ${a} + ${b}).`, ok: true },
          { text: step3, ok: bug !== 'unlike' },
          { text: step4, ok: bug !== 'double' },
        ],
        mis: bug === 'unlike' ? 'M_UNLIKE_TERMS_JOINED' : 'M_BRACKET_FIRST_TERM_ONLY',
        fix: bug === 'unlike' ? `x and the numbers are different kinds of term, so ${a} + ${b} = ${s} is added inside the bracket but it is not joined with x: 2 × (x + ${s}) = 2x + ${2 * s}.` : `Both parts inside the bracket must be multiplied by 2: 2 × (x + ${s}) = 2x + ${2 * s}.`,
        steps: [`${a} + ${b} = ${s}.`, `2 × (x + ${s}) = 2x + ${2 * s}.`] };
    } }),

  fam({ id: 'g7.simplify.triangle-plot', skill: 'G7_SIMPLIFY', outcome: 'MATH.G7.ALGEBR.ALGEBRAIC_EXPRESSIONS.c', cskill: 'MATH.G7.ALGEBR.ALGEBRAIC_EXPRESSIONS.SIMPLIFY_LIKE_TERMS', rung: 3, form: 'steps',
    draw: () => {
      const a = [randInt(1, 4), randInt(1, 4), randInt(1, 4)], c = [randInt(1, 6), randInt(1, 6), -randInt(1, 4)], t = randInt(3, 8);
      const A = a[0] + a[1] + a[2], C = c[0] + c[1] + c[2];
      return A > 3 && C > 0 && distinct(A, a[0] + a[1], a[0] * a[1] * a[2]) && distinct(C, c[0] + c[1] + Math.abs(c[2]), c[0] + c[1]) ? { a, c, t, A, C, p: person() } : null;
    },
    make: ({ a, c, t, A, C, p }) => {
      const side = (k, n) => `${k === 1 ? '' : k}x ${n < 0 ? '−' : '+'} ${Math.abs(n)}`;
      return { question: `${p.name}'s triangular plot has sides of (${side(a[0], c[0])}) m, (${side(a[1], c[1])}) m and (${side(a[2], c[2])}) m. The perimeter is the sum of the three sides. Simplify the expression for the perimeter by collecting like terms.`,
        parts: [
          { prompt: 'The simplified perimeter is ax + b metres. What is a?', answer: A, hint: 'Add the numbers in front of x. A plain x counts as 1x.', wrong: [[a[0] + a[1], 'The third side also has an x term.', 'M_TERM_MISSED'], [a[0] * a[1] * a[2], 'Like terms are added, not multiplied.', 'M_LIKE_TERMS_MULTIPLIED'], [3, 'Each x is not just 1. Add the numbers in front of each x.', 'M_COEFFICIENT_ONE_ASSUMED']] },
          { prompt: 'What is b?', answer: C, hint: 'Add the plain numbers. Keep the sign of each one.', wrong: [[c[0] + c[1] + Math.abs(c[2]), 'The last side takes away a number. Keep its minus sign.', 'M_SIGN_DROPPED'], [c[0] + c[1], 'The third side has a number term too.', 'M_CONSTANT_TERM_MISSED'], [c[0] * c[1] * c[2], 'Like terms are added, not multiplied.', 'M_CONSTANTS_MULTIPLIED']] },
          { prompt: `Now take x = ${t}. How long is the perimeter, in metres?`, answer: A * t + C, unit: 'm', hint: `Put x = ${t} into the simplified expression.`, wrong: [[A + C, `Replace x with ${t}: ${A}x means ${A} × ${t}.`, 'M_COEFFICIENT_ADDED_TO_VALUE'], [A * t, `Do not forget the number b.`, 'M_CONSTANT_LEFT_OUT'], [A * t - C, 'The number b is added, with its own sign.', 'M_CONSTANT_SIGN_FLIPPED']] },
        ],
        steps: [`x terms: ${a.join('x + ')}x = ${A}x.`, `Numbers: ${c[0]} + ${c[1]} + (${c[2]}) = ${C}.`, `When x = ${t}: ${A} × ${t} + ${C} = ${A * t + C} m.`] };
    },
    check: ({ a, c, t }, v) => v[2] === (a[0] * t + c[0]) + (a[1] * t + c[1]) + (a[2] * t + c[2]) && v[0] * t + v[1] === v[2] }),

  // ======================================================================
  // LINEAR EQUATIONS
  // ======================================================================
  fam({ id: 'g7.eq.form-books', skill: 'G7_EQUATIONS_FORM', outcome: 'MATH.G7.ALGEBR.LINEAR_EQUATIONS.a', cskill: 'MATH.G7.ALGEBR.LINEAR_EQUATIONS.FORM_EQUATION_FROM_STORY', rung: 2, form: 'word',
    draw: () => { const a = randInt(3, 8), x0 = randInt(20, 60), b = pick([150, 200, 250, 300]); return { a, b, c: a * x0 + b, p: person() }; },
    make: ({ a, b, c, p }) => ({
      question: `${p.name} buys ${a} exercise books and a geometry set. Each exercise book costs x shillings. The geometry set costs ${sh(b)}. The total is ${sh(c)}. Let x be the price of one exercise book. Which equation fits the story?`,
      options: shuffle([
        { text: `${a}x + ${b} = ${c}`, right: true },
        { text: `${a}(x + ${b}) = ${c}`, right: false, why: 'This adds the price of the geometry set to every exercise book. The geometry set is bought once.', mis: 'M_BRACKET_ADDED_TO_EVERY_TERM' },
        { text: `x + ${a} + ${b} = ${c}`, right: false, why: `There are ${a} exercise books, each costing x. That is ${a} times x, not x plus ${a}.`, mis: 'M_MULTIPLIER_AS_ADDEND' },
        { text: `${a}x = ${c} + ${b}`, right: false, why: `The geometry set is part of the total, so it is added to the cost of the books on the left. Check the sides.`, mis: 'M_FIXED_ON_WRONG_SIDE' },
      ]),
      hints: ['What is the cost of all the exercise books together?', 'Add the geometry set. What does the total equal?'],
      steps: [`${a} books cost ${a}x.`, `Add the geometry set: ${a}x + ${b}.`, `The total is ${c}, so ${a}x + ${b} = ${c}.`] }) }),

  fam({ id: 'g7.eq.consecutive-spot', skill: 'G7_EQUATIONS_FORM', outcome: 'MATH.G7.ALGEBR.LINEAR_EQUATIONS.b', cskill: 'MATH.G7.ALGEBR.LINEAR_EQUATIONS.SOLVE_TWO_STEP', rung: 3, form: 'spot',
    draw: () => { const n0 = randInt(5, 30); return { n0, S: 3 * n0 + 3, bug: pick(['divide', 'move']), p: person() }; },
    make: ({ n0, S, bug, p }) => {
      const k2 = 3, r3 = bug === 'move' ? S + 3 : S - k2, n4 = bug === 'divide' ? r3 * 3 : r3 / 3;
      return { question: `The sum of three consecutive whole numbers is ${S}. ${p.name} takes n as the smallest number, forms an equation and solves it. Here is ${p.her} working. Which step has the mistake?`,
        working: [
          { text: 'The numbers are n, n + 1 and n + 2.', ok: true },
          { text: 'Add them: n + (n + 1) + (n + 2) = 3n + 3.', ok: true },
          { text: `So 3n + 3 = ${S}. Take 3 from both sides: 3n = ${S} ${bug === 'move' ? '+' : '−'} 3 = ${r3}.`, ok: r3 === S - 3 },
          { text: `Divide both sides by 3: n = ${r3} ${bug === 'divide' ? '×' : '÷'} 3 = ${n4}.`, ok: n4 === r3 / 3 },
        ],
        mis: bug === 'move' ? 'M_SIGN_NOT_REVERSED' : 'M_INVERSE_OPERATION_WRONG',
        fix: bug === 'divide' ? `3n means 3 times n, so undo it by dividing: ${r3} ÷ 3, not ${r3} × 3.` : `To remove +3 from the left, take 3 away from both sides: 3n = ${S} − 3, not ${S} + 3.`,
        steps: [`n + (n + 1) + (n + 2) = 3n + 3 = ${S}.`, `3n = ${S - 3}, so n = ${n0}.`] };
    } }),

  fam({ id: 'g7.eq.solve-from-table', skill: 'G7_EQUATIONS_SOLVE', outcome: 'MATH.G7.ALGEBR.LINEAR_EQUATIONS.b', cskill: 'MATH.G7.ALGEBR.LINEAR_EQUATIONS.SOLVE_TWO_STEP', rung: 2, form: 'table',
    draw: () => { const a = randInt(2, 6), b = randInt(2, 9), r = randInt(6, 12), T = a * r + b; return Math.abs((T + b) / a - r) > 2 && Math.abs(T / a - r) > 2 ? { a, b, r, T } : null; },
    make: ({ a, b, r, T }) => ({
      question: `Find the solution of the equation ${a}x + ${b} = ${T}. The table shows the value of ${a}x + ${b} for the first few values of x, to show how it grows.`, story: false,
      model: { type: 'table', data: { head: ['x', `${a}x + ${b}`], rows: [1, 2, 3].map(x => ({ label: String(x), value: String(a * x + b) })) } },
      answer: r,
      wrong: [[T - b, `That is ${a}x. You still have to divide by ${a}.`, 'M_DIVISION_STEP_MISSED'], [round((T + b) / a, 2), 'The number ' + b + ' is added to the term in x, so take it away from both sides, not add.', 'M_SIGN_NOT_REVERSED'], [3, 'That is the last x in the table, but its value is not yet the one in the equation.', 'M_LAST_ROW_TAKEN']],
      hints: ['Notice how much the value goes up when x goes up by 1.', 'Or undo the steps: take away the number first, then divide.'],
      steps: [`${a}x + ${b} = ${T}, so ${a}x = ${T} − ${b} = ${T - b}.`, `x = ${T - b} ÷ ${a} = ${r}.`] }),
    check: ({ a, b, T }, x) => a * x + b === T }),

  fam({ id: 'g7.eq.both-sides-spot', skill: 'G7_EQUATIONS_SOLVE', outcome: 'MATH.G7.ALGEBR.LINEAR_EQUATIONS.b', cskill: 'MATH.G7.ALGEBR.LINEAR_EQUATIONS.SOLVE_BOTH_SIDES', rung: 3, form: 'spot',
    draw: () => { const dd = pick([2, 3, 4]), q = randInt(1, 4), u = randInt(1, 3), x0 = randInt(2 * u + 1, 2 * u + 8); return { p: q + dd, q, c: dd * u, d: dd * (x0 - u), dd, x0, bug: pick(['sign', 'divide']), who: person() }; },
    make: ({ p, q, c, d, dd, x0, bug, who }) => {
      const s2 = bug === 'sign' ? d - c : d + c, s3 = bug === 'divide' ? s2 * dd : s2 / dd;
      return { question: `${who.name} solves the equation ${p}x − ${c} = ${q === 1 ? '' : q}x + ${d}. Here is ${who.her} working. Which step has the mistake?`,
        working: [
          { text: `Take away ${q === 1 ? '' : q}x from both sides: ${dd}x − ${c} = ${d}.`, ok: true },
          { text: `Add ${c} to both sides: ${dd}x = ${d} ${bug === 'sign' ? '−' : '+'} ${c} = ${s2}.`, ok: s2 === d + c },
          { text: `Divide both sides by ${dd}: x = ${s2} ${bug === 'divide' ? '×' : '÷'} ${dd} = ${s3}.`, ok: s3 === s2 / dd },
          { text: `So x = ${s3}.`, ok: true },
        ],
        mis: bug === 'sign' ? 'M_SIGN_NOT_REVERSED' : 'M_INVERSE_OPERATION_WRONG',
        fix: bug === 'sign' ? `To get rid of − ${c}, add ${c} to both sides: ${d} + ${c}, not ${d} − ${c}.` : `To undo "times ${dd}", divide both sides by ${dd}. ${s2} ÷ ${dd}, not ${s2} × ${dd}.`,
        steps: [`${dd}x − ${c} = ${d}, so ${dd}x = ${d + c}.`, `x = ${d + c} ÷ ${dd} = ${x0}.`] };
    } }),

  fam({ id: 'g7.eq.apply-ages', skill: 'G7_EQUATIONS_FORM', outcome: 'MATH.G7.ALGEBR.LINEAR_EQUATIONS.c', cskill: 'MATH.G7.ALGEBR.LINEAR_EQUATIONS.SOLVE_IN_CONTEXT', rung: 3, form: 'word',
    draw: () => { const x = randInt(9, 14), m = pick([3, 4]), t = randInt(3, 6), S = (m + 1) * x + 2 * t; return distinct(m * x, x, round((m * S) / (m + 1), 2), m * x + t) && Math.abs(round((m * S) / (m + 1), 2) - m * x) > 2 ? { x, m, t, S, p: person() } : null; },
    make: ({ x, m, t, S, p }) => ({
      question: `${p.name}'s mother is ${m} times as old as ${p.name}. In ${t} years' time the sum of their ages will be ${S} years. Form an equation and solve it to find the age of ${p.name}'s mother now. Answer in years.`,
      answer: m * x,
      wrong: [[x, `That is ${p.name}'s age. The question asks for the age of the mother.`, 'M_ASKED_QUANTITY_MIXED'], [round((m * S) / (m + 1), 2), `In ${t} years, both of them are ${t} years older, so the sum now is not ${S}.`, 'M_TIME_CHANGE_NOT_APPLIED_TO_BOTH'], [m * x + t, `That is the mother's age in ${t} years. The question asks for her age now.`, 'M_FUTURE_AGE_AS_NOW']],
      hints: [`Let ${p.name}'s age now be x. What is the mother's age now? What will each be in ${t} years?`, `Their ages in ${t} years add up to ${S}.`],
      steps: [`Now: ${p.name} is x, the mother is ${m}x. In ${t} years: x + ${t} and ${m}x + ${t}.`, `(x + ${t}) + (${m}x + ${t}) = ${S}, so ${m + 1}x + ${2 * t} = ${S}.`, `${m + 1}x = ${S - 2 * t}, x = ${x}. The mother is ${m} × ${x} = ${m * x}.`] }),
    check: ({ m, t, S }, a) => (a + t) + (a / m + t) === S }),

  fam({ id: 'g7.eq.parking-table', skill: 'G7_EQUATIONS_SOLVE', outcome: 'MATH.G7.ALGEBR.LINEAR_EQUATIONS.c', cskill: 'MATH.G7.ALGEBR.LINEAR_EQUATIONS.SOLVE_IN_CONTEXT', rung: 3, form: 'table',
    draw: () => { const b = pick([20, 30, 50]), r = pick([20, 30, 40, 50]), h = randInt(5, 10), T = b + r * h; return Math.abs(T / r - h) > 2 && Math.abs((T + b) / r - h) > 2 ? { b, r, h, T, p: person() } : null; },
    make: ({ b, r, h, T, p }) => ({
      question: `The table shows the parking charges at a market. ${p.name} pays ${sh(T)} to park. Write an equation, using h for the number of hours, and solve it. For how many hours did ${p.she} park?`, story: false,
      model: { type: 'table', data: { head: ['Hours', 'Charge (sh)'], rows: [1, 2, 3].map(x => ({ label: String(x), value: String(b + r * x) })) } },
      answer: h,
      wrong: [[round(T / r, 2), 'The charge has a fixed part as well. Take it away before dividing.', 'M_FIXED_PART_IGNORED'], [round((T + b) / r, 2), 'The fixed part is already inside the total, so take it away, do not add it.', 'M_SIGN_NOT_REVERSED'], [T - b, 'That is the money for the hours. Divide by the charge for each hour.', 'M_DIVISION_STEP_MISSED']],
      hints: ['Find the charge for each extra hour, and the fixed part.', 'Write fixed part + charge per hour × h = total, then solve.'],
      steps: [`Each hour adds ${r}, so the fixed part is ${b + r} − ${r} = ${b}.`, `${b} + ${r}h = ${T}, so ${r}h = ${T - b}.`, `h = ${T - b} ÷ ${r} = ${h}.`] }),
    check: ({ b, r, T }, a) => b + r * a === T }),

  fam({ id: 'g7.eq.mango-boxes', skill: 'G7_EQUATIONS_FORM', outcome: 'MATH.G7.ALGEBR.LINEAR_EQUATIONS.c', cskill: 'MATH.G7.ALGEBR.LINEAR_EQUATIONS.SOLVE_IN_CONTEXT', rung: 2, form: 'steps',
    draw: () => { const n = randInt(4, 9), x = randInt(8, 20), loose = randInt(6, 20); return { n, x, loose, T: n * x + loose, p: person() }; },
    make: ({ n, x, loose, T, p }) => ({
      question: `${p.name} packs mangoes into ${n} boxes, with the same number in each box. There are also ${loose} loose mangoes. There are ${T} mangoes in all. Let x be the number of mangoes in each box, so ${n}x + ${loose} = ${T}.`,
      parts: [
        { prompt: 'How many mangoes are in the full boxes?', answer: T - loose, hint: 'Take the loose mangoes away from the total.', wrong: [[T + loose, 'The loose mangoes are part of the total, so take them away.', 'M_SIGN_NOT_REVERSED'], [T, 'The total also includes the loose mangoes.', 'M_FIXED_PART_IGNORED'], [loose, 'That is only the loose mangoes.', 'M_ASKED_QUANTITY_MIXED']] },
        { prompt: 'How many mangoes are in each box?', answer: x, hint: 'Share the mangoes in the boxes equally among the boxes.', wrong: [[T - loose - n, 'Dividing, not taking away, shares them equally.', 'M_SUBTRACTED_TO_SHARE'], [round(T / n, 2), 'The loose mangoes are not in the boxes. Take them away first.', 'M_LOOSE_NOT_REMOVED'], [(T - loose) * n, 'Sharing equally is dividing.', 'M_MULTIPLIED_TO_SHARE']] },
        { prompt: `${p.name} sells 3 boxes. How many mangoes are left?`, answer: T - 3 * x, hint: 'Take away the mangoes in 3 boxes.', wrong: [[T - 3, 'Each box has more than 1 mango.', 'M_ONE_PER_BOX'], [T - x, 'Three boxes are sold, not one.', 'M_ONE_BOX_NOT_THREE'], [T - 3 * x - loose, 'The loose mangoes are still there.', 'M_LOOSE_COUNTED_AGAIN']] },
      ],
      steps: [`${n}x = ${T} − ${loose} = ${T - loose}.`, `x = ${T - loose} ÷ ${n} = ${x}.`, `Left: ${T} − 3 × ${x} = ${T - 3 * x}.`] }),
    check: ({ n, loose, T }, v) => n * v[1] + loose === T && v[0] === n * v[1] && v[2] === T - 3 * v[1] }),

  // ======================================================================
  // LINEAR INEQUALITIES
  // ======================================================================
  fam({ id: 'g7.ineq.symbol-notice', skill: 'G7_INEQUALITIES_INTRO', outcome: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.a', cskill: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.INEQUALITY_SYMBOLS', rung: 1, form: 'direct',
    draw: () => ({ ph: pick([['at least', '≥'], ['at most', '≤'], ['fewer than', '<'], ['more than', '>'], ['no more than', '≤'], ['not less than', '≥'], ['under', '<'], ['no fewer than', '≥']]), v: randInt(10, 60) }),
    make: ({ ph, v }) => {
      const MEAN = { '<': 'less than', '>': 'greater than', '≤': 'less than or equal to', '≥': 'greater than or equal to' };
      // the wrong sign says which idea slipped: the "or equal" part, the direction, or one word read alone ("no more" as more)
      const incl = (s) => s === '≤' || s === '≥', up = (s) => s === '>' || s === '≥';
      const KEY = { 'at least': '<', 'at most': '>', 'no more than': '>', 'not less than': '<', 'no fewer than': '<' };
      const code = (s) => (up(s) === up(ph[1]) ? 'M_EQUAL_PART_MIXED' : incl(s) === incl(ph[1]) ? 'M_DIRECTION_REVERSED' : KEY[ph[0]] === s ? 'M_KEYWORD_READ_ALONE' : 'SLIP');
      return { question: `A notice at a stage says the number of passengers, n, must be ${ph[0]} ${v}. Which symbol goes in the inequality for n?`, story: false, fixedOrder: true,
        options: ['<', '>', '≤', '≥'].map(s => ({ text: s, right: s === ph[1], why: s === ph[1] ? undefined : `${s} means ${MEAN[s]}. That does not match "${ph[0]}".`, mis: s === ph[1] ? undefined : code(s) })),
        hints: ['Decide whether the number itself is allowed.', '"Than" with no "or equal" leaves the number out. "At least" and "at most" keep it in.'],
        steps: [`"${ph[0]} ${v}" ${['≤', '≥'].includes(ph[1]) ? 'includes' : 'does not include'} ${v} itself.`, `The symbol is ${ph[1]}: n ${ph[1]} ${v}.`] };
    } }),

  fam({ id: 'g7.ineq.true-statement', skill: 'G7_INEQUALITIES_INTRO', outcome: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.a', cskill: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.INEQUALITY_SYMBOLS', rung: 2, form: 'word',
    draw: () => {
      const v = randInt(9, 15), ops = ['<', '>', '≤', '≥'], cands = []; for (const op of ops) for (const off of [-2, -1, 0, 1, 2]) { const k = v + off; cands.push({ op, k, ok: op === '<' ? v < k : op === '>' ? v > k : op === '≤' ? v <= k : v >= k }); }
      const yes = shuffle(cands.filter(c => c.ok)), no = shuffle(cands.filter(c => !c.ok)); const pickOpts = [yes[0]]; for (const c of no) if (pickOpts.length < 4 && !pickOpts.some(o => o.op === c.op && o.k === c.k)) pickOpts.push(c);
      return { v, opts: pickOpts, p: person() };
    },
    make: ({ v, opts, p }) => ({
      question: `${p.name} is ${v} years old. Let a be ${p.her} age in years. Which of these inequalities is true for ${p.herObj}?`,
      // a < v or a > v with a = v: the strict sign taken to include the number; any other false one reads the sign from the wrong side
      options: shuffle(oneCodeEach(opts.map(o => ({ text: `a ${o.op} ${o.k}`, right: o.ok, why: o.ok ? undefined : o.k === v ? `Put a = ${v} into it: ${v} ${o.op} ${o.k} is false, because ${o.op} does not include ${v} itself.` : `Put a = ${v} into it: ${v} ${o.op} ${o.k} is false. Read the sign starting from a.`, mis: o.ok ? undefined : o.k === v ? 'M_STRICT_INCLUDES_NUMBER' : 'M_SYMBOL_READ_BACKWARDS' })))),
      hints: [`Put a = ${v} into each inequality in turn.`, 'Exactly one of them is a true statement.'],
      steps: [`Test each one with a = ${v}.`, `Only a ${opts[0].op} ${opts[0].k} is true: ${v} ${opts[0].op} ${opts[0].k}.`] }) }),

  fam({ id: 'g7.ineq.form-pickup', skill: 'G7_INEQUALITIES_INTRO', outcome: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.b', cskill: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.FORM_SIMPLE_INEQUALITY', rung: 2, form: 'word',
    draw: () => ({ L: pick([1000, 1200, 1500, 2000]), c: pick([200, 300, 400, 500]), s: pick([50, 90, 100]), p: person() }),
    make: ({ L, c, s, p }) => ({
      question: `A pick-up can carry at most ${commas(L)} kg. It already carries ${c} kg of cement. ${p.name} loads n sacks of maize of ${s} kg each. Which inequality shows that the load is allowed?`,
      options: shuffle([
        { text: `${c} + ${s}n ≤ ${commas(L)}`, right: true },
        { text: `${c} + ${s}n < ${commas(L)}`, right: false, why: '"At most" allows the load to be exactly the limit, so the symbol must include "or equal to".', mis: 'M_AT_MOST_AS_STRICT' },
        { text: `${c} + ${s}n ≥ ${commas(L)}`, right: false, why: 'The total load must not go above the limit, so it cannot be "at least".', mis: 'M_LIMIT_SIGN_REVERSED' },
        { text: `${s}n ≤ ${commas(L)}`, right: false, why: 'The cement is already on the pick-up. It counts towards the load too.', mis: 'M_FIXED_LOAD_LEFT_OUT' },
      ]),
      hints: ['What is the total load? Add the cement and the sacks.', '"At most" means the load can be up to the limit and no more.'],
      steps: [`Total load: ${c} + ${s}n kg.`, `"At most ${commas(L)}" means ≤ ${commas(L)}.`, `So ${c} + ${s}n ≤ ${commas(L)}.`] }) }),

  fam({ id: 'g7.ineq.seats-spot', skill: 'G7_INEQUALITIES_INTRO', outcome: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.b', cskill: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.FORM_SIMPLE_INEQUALITY', rung: 3, form: 'spot',
    draw: () => { const T = pick([120, 150, 200, 240]), c = randInt(31, 99); return { T, c, bug: pick(['symbol', 'subtract']), p: person() }; },
    make: ({ T, c, bug, p }) => {
      const left = bug === 'subtract' ? T + c : T - c, sym = bug === 'symbol' ? '≥' : '≤';
      return { question: `A hall has ${T} seats and ${c} are taken. At most n more people can sit down. ${p.name} writes an inequality for n. Here is ${p.her} working. Which step has the mistake?`,
        working: [
          { text: `Seats left: ${T} − ${c} = ${left}.`, ok: left === T - c },
          { text: `The new people, n, can fill up to the seats left, but not more than that.`, ok: true },
          { text: `So the symbol is ${sym}.`, ok: sym === '≤' },
          { text: `The inequality is n ${sym} ${left}.`, ok: true },
        ],
        mis: bug === 'symbol' ? 'M_LIMIT_SIGN_REVERSED' : 'M_TAKEN_ADDED_NOT_SUBTRACTED',
        fix: bug === 'symbol' ? '"At most" and "not more than" mean ≤, not ≥. The number of people can be up to the seats left.' : `The seats left are found by taking away the seats already taken: ${T} − ${c} = ${T - c}.`,
        steps: [`Seats left: ${T} − ${c} = ${T - c}.`, `n cannot be more than ${T - c}, so n ≤ ${T - c}.`] };
    } }),

  fam({ id: 'g7.ineq.most-books', skill: 'G7_INEQUALITIES_INTRO', outcome: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.b', cskill: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.SOLVE_SIMPLE_IN_CONTEXT', rung: 3, form: 'word',
    draw: () => { const B = pick([500, 600, 700, 800, 1000]), g = pick([100, 120, 150, 200]), e = pick([30, 40, 60, 70, 80]), n = Math.floor((B - g) / e); return (B - g) % e !== 0 && n >= 3 && distinct(n, n + 1, Math.floor(B / e), round((B - g) / e, 2)) ? { B, g, e, n, p: person() } : null; },
    make: ({ B, g, e, n, p }) => ({
      question: `${p.name} has ${sh(B)}. ${p.She} buys a school bag for ${sh(g)} and then some exercise books at ${sh(e)} each. Form an inequality for n, the number of books, and solve it. What is the greatest number of books ${p.she} can buy?`,
      answer: n,
      wrong: [[round((B - g) / e, 2), 'A number of books must be a whole number. Think about how many whole books fit.', 'M_DECIMAL_ANSWER_KEPT'], [n + 1, `That many books would cost more than the money left.`, 'M_ROUNDED_UP_PAST_LIMIT'], [Math.floor(B / e), 'The bag has to be paid for first.', 'M_FIXED_COST_LEFT_OUT']],
      hints: ['The money spent must be at most the money she has.', 'Write bag + books ≤ money, solve for n, then think about whole books.'],
      steps: [`${g} + ${e}n ≤ ${B}.`, `${e}n ≤ ${B - g}, so n ≤ ${round((B - g) / e, 2)}.`, `Whole books only: the greatest is ${n}.`] }),
    check: ({ B, g, e }, a) => g + e * a <= B && g + e * (a + 1) > B }),

  fam({ id: 'g7.ineq.circle-why', skill: 'G7_INEQUALITIES_INTRO', outcome: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.c', cskill: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.SIMPLE_ON_NUMBER_LINE', rung: 3, form: 'why',
    draw: () => ({ sym: pick(['<', '>', '≤', '≥']), v: randInt(-5, 12), x: pick(['x', 'n', 'y']), p: person() }),
    make: ({ sym, v, x, p }) => {
      const closed = sym === '≤' || sym === '≥', vt = v < 0 ? `−${-v}` : String(v), drawn = closed ? 'open' : 'closed', needed = closed ? 'closed' : 'open';
      return { question: `${p.name} draws ${x} ${sym} ${vt} on a number line. ${p.She} puts ${circ(drawn === 'closed')} at ${vt}. Why is the circle wrong?`, story: false,
        options: shuffle([
          { text: `${x} ${sym} ${vt} ${closed ? 'includes' : 'does not include'} ${vt} itself, so the circle must be ${needed}`, right: true },
          { text: `A circle on a number line is always ${drawn}`, right: false, why: 'Both kinds of circle are used. Which one to draw depends on the sign.', mis: 'M_CIRCLE_TYPE_FIXED' },
          { text: `The circle should be at ${v === 0 ? '1' : '0'}, not at ${vt}`, right: false, why: `The circle goes at the number in the inequality, which is ${vt}.`, mis: 'M_CIRCLE_AT_ZERO' },
          { text: `The circle shows which way to shade, so it should be ${needed} to point the other way`, right: false, why: 'The circle does not show a direction. It shows whether the end number is included. The shading shows the direction.', mis: 'M_CIRCLE_SHOWS_DIRECTION' },
        ]),
        hints: ['Ask whether the number in the inequality is one of the answers.', 'A closed circle includes the number. An open circle leaves it out.'],
        steps: [`${sym} ${closed ? 'means "or equal to": the number is included' : 'does not include the number'}.`, `So the circle at ${vt} must be ${needed}.`] };
    } }),

  fam({ id: 'g7.ineq.match-line', skill: 'G7_INEQUALITIES_INTRO', outcome: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.c', cskill: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.SIMPLE_ON_NUMBER_LINE', rung: 2, form: 'word',
    draw: () => ({ sym: pick(['<', '>', '≤', '≥']), v: randInt(-5, 12), x: pick(['x', 'n', 'y']) }),
    make: ({ sym, v, x }) => {
      const vt = v < 0 ? `−${-v}` : String(v), closed = sym === '≤' || sym === '≥', right = sym === '>' || sym === '≥';
      const combos = [[true, true], [true, false], [false, true], [false, false]];
      return { question: `Which number line shows ${x} ${sym} ${vt}? Each line has a circle at ${vt}; each line is shaded in one direction.`,
        options: shuffle(combos.map(([c, r]) => ({ text: `${c ? 'A closed' : 'An open'} circle at ${vt}, shaded to the ${r ? 'right' : 'left'}`, right: c === closed && r === right, why: c === closed && r === right ? undefined : c !== closed && r !== right ? `This line shows the numbers that do not fit ${x} ${sym} ${vt}: both the circle and the side are the other way.` : c !== closed ? `${x} ${sym} ${vt} ${closed ? 'includes' : 'does not include'} ${vt} itself, so the circle must not be ${c ? 'closed' : 'open'}.` : `${r ? 'Shading to the right' : 'Shading to the left'} shows ${r ? 'bigger' : 'smaller'} numbers than ${vt}, which does not fit ${sym}.`,
          mis: c === closed && r === right ? undefined : c !== closed && r !== right ? 'M_SHADED_EXCLUDED_PART' : c !== closed ? 'M_OPEN_CLOSED_SWAPPED' : 'M_SHADED_WRONG_WAY' }))),
        hints: ['Does the number itself belong to the answers? That decides the circle.', 'Are the answers bigger or smaller than the number? That decides the direction.'],
        steps: [`${sym} ${closed ? 'includes' : 'does not include'} ${vt}: a ${closed ? 'closed' : 'open'} circle.`, `The answers are ${right ? 'bigger' : 'smaller'} than ${vt}: shade to the ${right ? 'right' : 'left'}.`] };
    } }),

  fam({ id: 'g7.ineq.which-in-shade', skill: 'G7_INEQUALITIES_INTRO', outcome: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.c', cskill: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.SIMPLE_ON_NUMBER_LINE', rung: 3, form: 'word',
    draw: () => ({ closed: Math.random() < 0.5, right: Math.random() < 0.5, v: randInt(-4, 10) }),
    make: ({ closed, right, v }) => {
      const ok = (t) => (right ? (closed ? t >= v : t > v) : (closed ? t <= v : t < v));
      const tS = right ? [v + 1, v + 2, v + 3] : [v - 1, v - 2, v - 3], fS = right ? [v - 1, v - 2, v - 3] : [v + 1, v + 2, v + 3];
      const vals = closed ? [v, ...shuffle(fS).slice(0, 3)] : [shuffle(tS)[0], v, ...shuffle(fS).slice(0, 2)];
      const t = (n) => (n < 0 ? `−${-n}` : String(n));
      return { question: `Mwende shades a number line. The shading starts at ${circ(closed)} at ${t(v)}. It runs to the ${right ? 'right' : 'left'}. Which of these numbers lies under the shading?`,
        options: shuffle(oneCodeEach(vals.map(n => ({ text: t(n), right: ok(n), why: ok(n) ? undefined : n === v ? `The circle at ${t(v)} is ${closed ? 'closed' : 'open'}, so ${t(v)} is ${closed ? '' : 'not '}in the shaded part.` : `${t(n)} is on the side of ${t(v)} that is not shaded.`, mis: ok(n) ? undefined : n === v ? 'M_OPEN_CIRCLE_INCLUDED' : 'M_SHADED_WRONG_WAY' })))),
        hints: ['Which side of the circle is shaded?', 'Is the number at the circle included? Look at whether the circle is open or closed.'],
        steps: [`The shaded part is the numbers ${right ? 'greater' : 'less'} than ${t(v)}${closed ? `, and ${t(v)} itself` : ''}.`, 'Only one of the four numbers is in that part.'] };
    } }),

  fam({ id: 'g7.ineq.compound-swim', skill: 'G7_INEQUALITIES_INTRO', outcome: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.d', cskill: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.FORM_COMPOUND_INEQUALITY', rung: 2, form: 'word',
    draw: () => { const lo = randInt(6, 12); return { lo, hi: lo + randInt(3, 8), li: Math.random() < 0.5, hi_i: Math.random() < 0.5 }; },
    make: ({ lo, hi, li, hi_i }) => {
      const LS = (b) => (b ? '≤' : '<'), txt = (a, b) => `${lo} ${LS(a)} a ${LS(b)} ${hi}`;
      return { question: `A swimming class is for children who are ${li ? 'at least' : 'older than'} ${lo} years old and ${hi_i ? 'at most' : 'younger than'} ${hi} years old. Which compound inequality shows the ages a that can join?`,
        options: shuffle(oneCodeEach([[true, true], [true, false], [false, true], [false, false]].map(([a, b]) => ({ text: txt(a, b), right: a === li && b === hi_i, why: a === li && b === hi_i ? undefined : a !== li && b !== hi_i ? `Both ends are wrong. ${lo} years old ${li ? 'can' : 'cannot'} join and ${hi} years old ${hi_i ? 'can' : 'cannot'}, but this inequality says the opposite at each end.` : a !== li ? `At the lower end, ${lo} years old ${li ? 'can' : 'cannot'} join, but this inequality ${a ? 'allows' : 'does not allow'} it.` : `At the upper end, ${hi} years old ${hi_i ? 'can' : 'cannot'} join, but this inequality ${b ? 'allows' : 'does not allow'} it.`,
          mis: a === li && b === hi_i ? undefined : a !== li && b !== hi_i ? (li === hi_i ? (li ? 'M_INCLUSIVE_WORD_AS_STRICT' : 'M_STRICT_WORD_AS_INCLUSIVE') : 'M_SIGNS_MEANINGS_SWAPPED') : li === hi_i ? 'M_ONE_END_MISREAD' : (a !== li ? li : hi_i) ? 'M_INCLUSIVE_WORD_AS_STRICT' : 'M_STRICT_WORD_AS_INCLUSIVE' })))),
        hints: ['Look at each end separately: is the number itself allowed?', '"At least" and "at most" use ≤. "Older than" and "younger than" use <.'],
        steps: [`Lower end: "${li ? 'at least' : 'older than'} ${lo}" gives ${LS(li)}.`, `Upper end: "${hi_i ? 'at most' : 'younger than'} ${hi}" gives ${LS(hi_i)}.`, `Together: ${txt(li, hi_i)}.`] };
    } }),

  fam({ id: 'g7.ineq.compound-line', skill: 'G7_INEQUALITIES_INTRO', outcome: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.e', cskill: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.COMPOUND_ON_NUMBER_LINE', rung: 2, form: 'word',
    draw: () => { const lo = randInt(-4, 5); return { lo, hi: lo + randInt(3, 8), li: Math.random() < 0.5, hi_i: Math.random() < 0.5, x: pick(['x', 'n']) }; },
    make: ({ lo, hi, li, hi_i, x }) => {
      const t = (n) => (n < 0 ? `−${-n}` : String(n)), LS = (b) => (b ? '≤' : '<'), txt = (a, b) => `${t(lo)} ${LS(a)} ${x} ${LS(b)} ${t(hi)}`;
      return { question: `On a number line, ${circ(li)} is at ${t(lo)}; ${circ(hi_i)} is at ${t(hi)}. The line between the two circles is shaded. Which inequality does it show?`,
        options: shuffle(oneCodeEach([[true, true], [true, false], [false, true], [false, false]].map(([a, b]) => ({ text: txt(a, b), right: a === li && b === hi_i, why: a === li && b === hi_i ? undefined : a !== li && b !== hi_i ? `Both signs are the wrong way round. A closed circle means the end number is included (≤); an open circle means it is not (<).` : a !== li ? `The circle at ${t(lo)} is ${li ? 'closed' : 'open'}, so ${t(lo)} ${li ? 'is' : 'is not'} included. This inequality ${a ? 'includes' : 'leaves out'} it.` : `The circle at ${t(hi)} is ${hi_i ? 'closed' : 'open'}, so ${t(hi)} ${hi_i ? 'is' : 'is not'} included. This inequality ${b ? 'includes' : 'leaves out'} it.`,
          mis: a === li && b === hi_i ? undefined : a !== li && b !== hi_i ? 'M_CIRCLE_SIGN_MISMATCH' : 'M_ONE_CIRCLE_READ' })))),
        hints: ['A closed circle means the end number is included (≤). An open circle means it is not (<).', 'The smaller number goes on the left of x, and the bigger number on the right.'],
        steps: [`Left end: ${circ(li)} at ${t(lo)}, so ${LS(li)}.`, `Right end: ${circ(hi_i)} at ${t(hi)}, so ${LS(hi_i)}.`, `The inequality is ${txt(li, hi_i)}.`] };
    } }),

  fam({ id: 'g7.ineq.compound-fridge', skill: 'G7_INEQUALITIES_INTRO', outcome: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.d', cskill: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.FORM_COMPOUND_INEQUALITY', rung: 3, form: 'word',
    draw: () => { const lo = randInt(1, 4), hi = lo + randInt(4, 8), kind = pick(['A', 'B', 'C']); return { lo, hi, kind }; },
    make: ({ lo, hi, kind }) => {
      const li = kind === 'B', hi_i = kind === 'A', LS = (b) => (b ? '≤' : '<');
      const ok = (t) => (li ? t >= lo : t > lo) && (hi_i ? t <= hi : t < hi);
      const vals = kind === 'C' ? [lo, hi, lo + 2, hi + 1] : [lo, hi, lo - 1, hi + 1];
      return { question: `A clinic fridge must keep its temperature t, in °C, so that ${lo} ${LS(li)} t ${LS(hi_i)} ${hi}. Which of these readings is allowed?`,
        options: shuffle(oneCodeEach(vals.map(t => ({ text: `${t} °C`, right: ok(t), why: ok(t) ? undefined : t === lo ? `The sign at the lower end is ${LS(li)}, so ${lo} °C is ${li ? '' : 'not '}included.` : t === hi ? `The sign at the upper end is ${LS(hi_i)}, so ${hi} °C is ${hi_i ? '' : 'not '}included.` : `${t} °C passes one part only. It is outside the two end values.`, mis: ok(t) ? undefined : t === lo || t === hi ? 'M_END_VALUE_ALWAYS_IN' : 'M_ONE_PART_TESTED' })))),
        hints: ['Test each reading in both parts of the inequality.', 'Be careful with the readings that sit exactly on an end value.'],
        steps: [`The allowed readings are bigger than ${lo}${li ? ' or equal to it' : ''}, and smaller than ${hi}${hi_i ? ' or equal to it' : ''}.`, 'Check each option against both ends. Only one passes.'] };
    } }),

  fam({ id: 'g7.ineq.compound-list', skill: 'G7_INEQUALITIES_INTRO', outcome: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.d', cskill: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.FORM_COMPOUND_INEQUALITY', rung: 2, form: 'word',
    draw: () => { const lo = randInt(-3, 3); return { lo, hi: lo + randInt(3, 5), li: Math.random() < 0.5, hi_i: Math.random() < 0.5, p: person() }; },
    make: ({ lo, hi, li, hi_i, p }) => {
      const t = (n) => (n < 0 ? `−${-n}` : String(n)), LS = (b) => (b ? '≤' : '<');
      const list = (a, b) => { const out = []; for (let k = lo; k <= hi; k++) if ((a ? k >= lo : k > lo) && (b ? k <= hi : k < hi)) out.push(t(k)); return out.join(', '); };
      // both ends wrong the same way: ends always in, or always out; wrong in opposite ways: the signs swapped; one end wrong: that end misread
      const code = (a, b) => (a !== li && b !== hi_i ? (a && b ? 'M_END_VALUE_ALWAYS_IN' : !a && !b ? 'M_END_VALUE_ALWAYS_OUT' : 'M_SIGNS_MEANINGS_SWAPPED') : 'M_ONE_END_MISREAD');
      return { question: `${p.name} lists the whole numbers x that satisfy the compound inequality ${t(lo)} ${LS(li)} x ${LS(hi_i)} ${t(hi)}. Which list is correct?`,
        options: shuffle(oneCodeEach([[true, true], [true, false], [false, true], [false, false]].map(([a, b]) => ({ text: list(a, b), right: a === li && b === hi_i, why: a === li && b === hi_i ? undefined : `This list ${a ? 'includes' : 'leaves out'} ${t(lo)} and ${b ? 'includes' : 'leaves out'} ${t(hi)}. Check what each sign says about the end numbers.`, mis: a === li && b === hi_i ? undefined : code(a, b) })))),
        hints: ['List the whole numbers from the left end to the right end.', '< leaves the end number out. ≤ keeps it in.'],
        steps: [`Whole numbers from ${t(lo)} to ${t(hi)}: ${list(true, true)}.`, `${LS(li)} ${li ? 'keeps' : 'removes'} ${t(lo)}, and ${LS(hi_i)} ${hi_i ? 'keeps' : 'removes'} ${t(hi)}.`] };
    } }),

  fam({ id: 'g7.ineq.compound-rides', skill: 'G7_INEQUALITIES_INTRO', outcome: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.d', cskill: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.FORM_COMPOUND_INEQUALITY', rung: 3, form: 'table',
    draw: () => {
      const A = randInt(9, 13), k = randInt(2, 4), names = shuffle(['Ferris wheel', 'Train', 'Boat', 'Bumper cars']), fl = () => Math.random() < 0.5;
      const specs = [{ lo: A, hi: A + k, li: true, hi_i: fl() }, { lo: A - k, hi: A, li: fl(), hi_i: false }, { lo: A - randInt(1, 3), hi: A + randInt(1, 3), li: fl(), hi_i: fl() }, { lo: A + 1, hi: A + 1 + k, li: fl(), hi_i: fl() }];
      const rows = shuffle(specs).map((r, i) => ({ ...r, n: names[i] }));
      const cnt = (f) => rows.filter(f).length, ans = cnt(r => (r.li ? A >= r.lo : A > r.lo) && (r.hi_i ? A <= r.hi : A < r.hi)), bothIn = cnt(r => A >= r.lo && A <= r.hi), bothOut = cnt(r => A > r.lo && A < r.hi);
      return distinct(ans, bothIn, bothOut, 4) ? { A, rows, ans, bothIn, bothOut, p: person() } : null;
    },
    make: ({ A, rows, ans, bothIn, bothOut, p }) => ({
      question: `The table shows the ages a allowed on four rides at a show. ${p.name} is ${A} years old. On how many of the rides can ${p.she} go?`, story: false,
      model: { type: 'table', data: { head: ['Ride', 'Ages allowed'], rows: rows.map(r => ({ label: r.n, value: `${r.lo} ${r.li ? '≤' : '<'} a ${r.hi_i ? '≤' : '<'} ${r.hi}` })) } },
      answer: ans,
      wrong: [[bothIn, 'That counts every ride where the age is inside the two ends or on one. Some of the signs are < and leave an end out.', 'M_END_VALUE_ALWAYS_IN'], [bothOut, 'That counts only rides where the age is strictly between the ends. Some of the signs are ≤ and keep an end in.', 'M_END_VALUE_ALWAYS_OUT'], [4, 'Not every ride allows this age. Test each row.', 'SLIP']],
      hints: ['Test the age in each row, one at a time.', 'Check both ends. Look carefully at < and ≤.'],
      steps: rows.map(r => `${r.n}: ${r.lo} ${r.li ? '≤' : '<'} ${A} ${r.hi_i ? '≤' : '<'} ${r.hi} is ${(r.li ? A >= r.lo : A > r.lo) && (r.hi_i ? A <= r.hi : A < r.hi) ? 'true' : 'false'}.`).concat([`The age fits ${ans} rides.`]) }),
    check: ({ A, rows }, a) => rows.map(r => (A > r.lo || (r.li && A === r.lo)) && (A < r.hi || (r.hi_i && A === r.hi))).filter(Boolean).length === a }),

  fam({ id: 'g7.ineq.compound-solve-spot', skill: 'G7_INEQUALITIES_INTRO', outcome: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.d', cskill: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.SOLVE_COMPOUND', rung: 3, form: 'spot',
    draw: () => { const a = pick([2, 3, 4]), u = randInt(1, 2), t = randInt(1, 2), h = t + randInt(3, 5); return { a, c: a * u, lo: a * (u + t), hi: a * (u + h), t, h, bug: pick(['subtract', 'list']), p: person() }; },
    make: ({ a, c, lo, hi, t, h, bug, p }) => {
      const slo = bug === 'subtract' ? lo : lo - c, shi = hi - c, L = slo / a, H = shi / a;
      const ints = []; for (let k = Math.floor(L); k <= H; k++) if (k > L && k <= H) ints.push(k);
      const shown = bug === 'list' ? [t, ...Array.from({ length: h - t }, (_, i) => t + 1 + i)] : ints;
      const trueInts = Array.from({ length: h - t }, (_, i) => t + 1 + i);
      return { question: `${p.name} solves the compound inequality ${lo} < ${a}x + ${c} ≤ ${hi} and lists the whole numbers that fit. Here is ${p.her} working. Which step has the mistake?`,
        working: [
          { text: `Take away ${c} from all three parts: ${slo} < ${a}x ≤ ${shi}.`, ok: slo === lo - c },
          { text: `Divide all three parts by ${a}: ${L} < x ≤ ${H}.`, ok: L === slo / a && H === shi / a },
          { text: `The whole numbers are ${shown.join(', ')}.`, ok: shown.join() === ints.join() },
          { text: `So there are ${shown.length} whole numbers.`, ok: true },
        ],
        mis: bug === 'subtract' ? 'M_ONE_PART_NOT_CHANGED' : 'M_EXCLUDED_END_LISTED',
        fix: bug === 'subtract' ? `Whatever is done to one part must be done to all three. ${c} must also be taken from ${lo}.` : `${t} is not allowed: the sign next to ${t} is <, which leaves it out. The whole numbers start at ${t + 1}.`,
        steps: [`${lo - c} < ${a}x ≤ ${hi - c}, so ${t} < x ≤ ${h}.`, `The whole numbers are ${trueInts.join(', ')}: ${trueInts.length} of them.`] };
    } }),

  fam({ id: 'g7.ineq.compound-or-why', skill: 'G7_INEQUALITIES_INTRO', outcome: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.d', cskill: 'MATH.G7.ALGEBR.LINEAR_INEQUALITIES.FORM_COMPOUND_INEQUALITY', rung: 3, form: 'why',
    draw: () => { const lo = randInt(2, 9); return { lo, hi: lo + randInt(3, 8), p: person() }; },
    make: ({ lo, hi, p }) => ({
      question: `${p.name} wants to write "x is less than ${lo} or greater than ${hi}". ${p.She} writes ${hi} < x < ${lo}. Why is this wrong?`, story: false,
      options: shuffle([
        { text: `No number is both greater than ${hi} and less than ${lo}`, right: true },
        { text: `${hi} < x < ${lo} is correct: it means x is outside the two numbers`, right: false, why: `A chain like ${hi} < x < ${lo} says x is between the two numbers, both at once.`, mis: 'M_OR_WRITTEN_AS_CHAIN' },
        { text: 'An inequality can only ever have one sign in it', right: false, why: 'A compound inequality can have two signs, for example 2 < x < 5.', mis: 'M_ONE_SIGN_ONLY' },
        { text: 'It should use ≤ instead of <, because x can equal the end numbers', right: false, why: `The words say "less than" and "greater than", so the end numbers are not included. The real problem is the order of the numbers.`, mis: 'M_STRICT_WORD_AS_INCLUSIVE' },
      ]),
      hints: ['Read the chain from left to right: x must be bigger than the first number and smaller than the last.', 'Can one number be both?'],
      steps: [`${hi} < x < ${lo} means x is greater than ${hi} and less than ${lo} at the same time.`, `${hi} is bigger than ${lo}, so no number can do both. The two conditions must be written separately: x < ${lo} or x > ${hi}.`] }) }),
  // @@END
];
