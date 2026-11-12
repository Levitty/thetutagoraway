// ============================================================================
// GRADE 8 COVERAGE (12 Nov 2026): question families for outcomes that had no family,
// no skill and no misconception feedback. DRAFT, off for children until a Kenyan maths
// teacher signs them off. Every key is computed from the draw and checked a second way;
// every wrong answer is a named mistake. Outcome letters are the design's own
// (curriculum/mathematics/g8.json). See docs/qa/new-families-2026-11-12.md.
// ============================================================================
import { cov, randInt, pick, round, commas, person, sh, shuffle, distinct, gcd, frac, mc, mcFixed, cap, sup } from './cov.js';

const TOWNS = ['Nyeri', 'Kitale', 'Embu', 'Machakos', 'Kericho', 'Garissa', 'Thika', 'Kakamega', 'Meru', 'Kisii'];
const sgn = (n) => (n < 0 ? `−${-n}` : `${n}`);

export const FAMILIES = [
  // ================================================================ INTEGERS
  cov({ id: 'g8c.int.number-line-lift', skill: 'G6_INTEGERS_ADD_SUB', outcome: 'G8.INTEGERS.c', form: 'word', rung: 2, allowNegative: true,
    gen: () => {
      const s = -randInt(1, 4), n = randInt(2, 7), up = Math.random() < 0.6, d = up ? n : -n, r = s + d;
      if (r === 0 || Math.abs(r) === Math.abs(s)) return null;
      const w = [[Math.abs(s) + d, 'You ignored the minus sign and counted from a positive floor. The basement is below zero on the number line.'], [s - d, 'You moved the wrong way along the number line. Going up moves right, going down moves left.'], [-r, 'The size is right but it is on the wrong side of zero. Check whether the lift ends above or below the ground floor.'], [r + (up ? -1 : 1), 'Count the steps again from the starting floor. Each floor is one step.']];
      return { question: `A lift in a Nairobi office block is at floor ${sgn(s)}. Floors below the ground floor have minus signs. The lift goes ${up ? 'up' : 'down'} ${n} floors. Use a number line. At which floor does it stop?`, answer: r, wrong: w,
        hints: ['Mark the starting floor on a number line. Going up moves to the right.', `Move ${n} steps ${up ? 'right' : 'left'} and read the number.`],
        steps: [`Start at ${sgn(s)} on the number line.`, `Move ${n} steps ${up ? 'right' : 'left'}: ${sgn(s)} ${up ? '+' : '−'} ${n} = ${sgn(r)}.`], chk: (a) => a - s === d };
    } }),

  // ================================================================ DECIMALS
  cov({ id: 'g8c.dec.recurring-to-fraction', skill: 'G8_RECURRING_DECIMALS', outcome: 'G8.DEC.c', form: 'direct', rung: 3,
    gen: () => {
      const two = Math.random() < 0.6, rep = two ? randInt(10, 98) : randInt(1, 8), den = two ? 99 : 9;
      if (two && rep % 11 === 0) return null;
      const right = frac(rep, den), shown = String(rep).padStart(two ? 2 : 1, '0'), dec = `0.${shown.repeat(4)}...`;
      const options = mc(right, [[frac(rep, two ? 100 : 10), 'This is the decimal with no repeating. A repeating decimal is a little more than that.'], [frac(rep, two ? 9 : 99), two ? 'You used 9. Two repeating digits mean 99 on the bottom.' : 'You used 99. One repeating digit means 9 on the bottom.'], [frac(rep, two ? 999 : 90), two ? 'You used 999. Two repeating digits mean 99 on the bottom.' : 'You used 90. One repeating digit means 9 on the bottom.']]);
      return { question: `A calculator shows ${dec}, where ${two ? `the digits ${shown} repeat` : `the digit ${shown} repeats`} for ever. Which fraction in its simplest form is equal to this decimal?`, options, instruction: 'Choose the best answer.',
        hints: [two ? 'Let x be the decimal. Multiply by 100 to move one repeat to the left of the point.' : 'Let x be the decimal. Multiply by 10 to move one repeat to the left of the point.', 'Subtract x from your new number so the repeating parts cancel.'],
        steps: [`Let x = ${dec}. Then ${two ? 100 : 10}x = ${shown}.${shown.repeat(3)}...`, `Subtract: ${two ? 99 : 9}x = ${rep}, so x = ${rep}/${den} = ${right}.`] };
    } }),

  cov({ id: 'g8c.dec.significant-figures', skill: 'G8_STANDARD_FORM', outcome: 'G8.DEC.e', form: 'word', rung: 2,
    gen: () => {
      const big = Math.random() < 0.5, sf = randInt(2, 3), p = person();
      let x, w, txt, unit;
      if (big) { x = randInt(10000, 99999) + (Math.random() < 0.5 ? 0 : 0); unit = 'km'; txt = `${p.name}'s matatu travelled ${commas(x)} km in a year.`; }
      else { x = randInt(10000, 99999) / (Math.random() < 0.5 ? 100 : 1000); unit = 'kg'; txt = `A trader sold ${x} kg of beans in a week.`; }
      const right = Number(Number(x).toPrecision(sf));
      if (right === x) return null;
      const digits = String(x).replace('.', '').length;
      const trunc = big ? Math.floor(x / 10 ** (String(x).length - sf)) * 10 ** (String(x).length - sf) : Number(String(x).slice(0, sf + 1));
      const w1 = [[trunc, 'You cut the number off instead of rounding. Look at the next digit: 5 or more rounds up.'], [Number(Number(x).toPrecision(sf + 1)), `You gave ${sf + 1} significant figures. The question asks for ${sf}.`], [Number(Number(x).toPrecision(sf - 1)), `You gave ${sf - 1} significant figure${sf - 1 === 1 ? '' : 's'}. The question asks for ${sf}.`], [big ? Number((x / 10 ** (String(x).length - sf)).toFixed(0)) : Number(Number(x).toFixed(sf)), big ? 'The zeros that hold the place value were left out.' : `You rounded to ${sf} decimal places. Significant figures count from the first non-zero digit.`]];
      return { question: `${txt} Write ${big ? commas(x) : x} correct to ${sf} significant figures.`, answer: right, wrong: w1,
        hints: ['Count the significant figures from the first digit that is not zero.', 'Look at the digit after the last one you keep. 5 or more rounds up.'],
        steps: [`The first ${sf} significant figures are ${String(x).replace('.', '').slice(0, sf)}.`, `Rounding gives ${big ? commas(right) : right}.`], chk: (a) => Math.abs(a - x) <= (big ? 10 ** (String(x).length - sf) : 10 ** (Math.floor(Math.log10(x)) - sf + 1)) / 2 + 1e-9 };
    } }),

  cov({ id: 'g8c.dec.to-standard-form', skill: 'G8_STANDARD_FORM', outcome: 'G8.DEC.f', form: 'direct', rung: 2,
    gen: () => {
      const small = Math.random() < 0.4, m = randInt(11, 99) / 10, e = small ? -randInt(2, 6) : randInt(3, 8);
      if (m % 1 === 0) return null;
      const value = small ? round(m * 10 ** e, 10) : round(m * 10 ** e, 0);
      const shown = small ? String(value) : commas(value);
      const right = `${m} × 10${sup(e)}`;
      const options = mc(right, [[`${round(m * 10, 0)} × 10${sup(e - 1)}`, 'The first number must be between 1 and 10 in standard form.'], [`${m} × 10${sup(small ? e + 1 : e - 1)}`, 'Count the places the point moves again. The power of 10 matches the number of places.'], [`${m} × 10${sup(-e)}`, small ? 'A very small number needs a negative power of 10.' : 'A very big number needs a positive power of 10.']]);
      const thing = small ? pick([`a grain of pollen has a mass of ${shown} g`, `a thin wire has a width of ${shown} m`]) : pick([`a county has ${shown} people`, `a shipment of tea is worth ${shown} shillings`]);
      return { question: `In a science book, ${thing}. Which is this number in standard form?`, options, instruction: 'Choose the best answer.',
        hints: ['Standard form is a number from 1 up to 10, multiplied by a power of 10.', small ? 'Count how many places the point moves to the right. The power is negative.' : 'Count how many places the point moves to the left. The power is positive.'],
        steps: [`Write ${m} as the first number, so that it is between 1 and 10.`, `The point moves ${Math.abs(e)} places, so the power is ${e}: ${right}.`] };
    } }),

  cov({ id: 'g8c.dec.combined-operations', skill: 'G8_DECIMALS_COMBINED', outcome: 'G8.DEC.g', form: 'direct', rung: 3,
    gen: () => {
      const a = randInt(11, 99) / 10, b = randInt(11, 59) / 10, c = randInt(2, 9) / 2, kind = pick(['add-mul', 'bracket']);
      if (a % 1 === 0 || b % 1 === 0) return null;
      let right, wrong, text;
      if (kind === 'add-mul') { right = round(a + b * c, 3); wrong = round((a + b) * c, 3); text = `${a} + ${b} × ${c}`; }
      else { right = round((a - b) * c, 3); wrong = round(a - b * c, 3); text = `(${a} − ${b}) × ${c}`; if (a <= b) return null; }
      if (!distinct(right, wrong)) return null;
      const w = [[wrong, kind === 'add-mul' ? 'You worked from left to right. Multiplication is done before addition.' : 'The brackets were ignored. Work out the brackets first.'], [round(a + b + c, 3), 'You added everything. Look at the signs: multiplication comes first.'], [round(right * 10, 3), 'The decimal point is in the wrong place in your product. Count the decimal places in both numbers.'], [round(right / 10, 3), 'The decimal point is in the wrong place in your product. Count the decimal places in both numbers.']];
      return { question: `In a class competition, ${person().name} must find the value of ${text}. Write the answer as a decimal number.`, answer: right, wrong: w, instruction: 'Read carefully. Then answer the question.',
        hints: ['Use the order of operations: brackets, then multiplication and division, then addition and subtraction.', 'Work out the part that must come first and write down the answer.'],
        steps: kind === 'add-mul' ? [`${b} × ${c} = ${round(b * c, 3)}.`, `${a} + ${round(b * c, 3)} = ${right}.`] : [`${a} − ${b} = ${round(a - b, 3)}.`, `${round(a - b, 3)} × ${c} = ${right}.`], chk: (r) => (kind === 'add-mul' ? Math.abs(r - a - b * c) < 1e-6 : Math.abs(r - (a - b) * c) < 1e-6) };
    } }),

  cov({ id: 'g8c.dec.shopping-change', skill: 'G8_DECIMALS_COMBINED', outcome: 'G8.DEC.h', form: 'word', rung: 2,
    gen: () => {
      const item = pick([['kg of rice', 142.5], ['kg of sugar', 167.5], ['litres of milk', 62.5], ['kg of beans', 187.5], ['kg of maize flour', 112.5]]), n = randInt(2, 6), per = item[1] + pick([-10, 0, 10, 12.5]), pay = Math.ceil(n * per / 500) * 500 + (Math.random() < 0.5 ? 0 : 500), cost = round(n * per, 2), ch = round(pay - cost, 2), p = person();
      const w = [[round(pay - per, 2), `You took the price of one from the money paid. Find the cost of all ${n} first.`], [cost, 'This is the total cost. The question asks for the change, so take it from the money paid.'], [round(pay + cost, 2), 'You added. Change is the money paid minus the cost.'], [round(pay - n * Math.floor(per), 2), 'The shillings and cents were not both used. Multiply the full price.']];
      return { question: `${p.name} buys ${n} ${item[0]} at ${sh(per)} for each. ${p.She} pays with ${sh(pay)}. How much change does ${p.she} get, in shillings?`, answer: ch, wrong: w,
        hints: ['First find the cost of all the items.', 'Then take the cost from the money paid.'],
        steps: [`${n} × ${per} = ${cost}.`, `${pay} − ${cost} = ${ch}.`], chk: (a) => Math.abs(a + n * per - pay) < 1e-6 };
    } }),

  // ================================================================ SQUARES
  cov({ id: 'g8c.sq.root-plot', skill: 'G8_SQUARES_TABLES', outcome: 'G8.SQUARES.c', form: 'word', rung: 2,
    gen: () => {
      const perfect = Math.random() < 0.5, p = person();
      let A, side, wrong;
      if (perfect) { side = randInt(12, 95); A = side * side; wrong = [[side * 2, 'You doubled the side instead of finding the number that multiplies by itself.'], [A / 2, 'You halved the area. A square root is a number that, multiplied by itself, gives the area.'], [A * A, 'You squared the area. Use the square root key instead.'], [A / 4, 'You divided the area by 4, as if finding a side from the perimeter. Use the square root instead.']]; }
      else { A = pick([20, 50, 70, 90, 150, 200, 300, 500]); side = round(Math.sqrt(A), 1); wrong = [[round(Math.floor(Math.sqrt(A) * 10) / 10, 1), 'You cut the number off instead of rounding to one decimal place.'], [A / 2, 'You halved the area. Use the square root key.'], [A * A, 'You squared the area. Use the square root key instead.'], [round(Math.sqrt(A), 2), 'The answer needs one decimal place only.']]; if (round(Math.floor(Math.sqrt(A) * 10) / 10, 1) === side) wrong.shift(); }
      return { question: `${p.name}'s square plot in ${pick(TOWNS)} has an area of ${commas(A)} m². Use a calculator to find the length of one side${perfect ? '' : ', correct to 1 decimal place'}, in metres.`, answer: side, wrong,
        hints: ['The area of a square is side × side.', 'Press the square root key on your calculator.'],
        steps: [`The side is the square root of ${commas(A)}.`, `√${commas(A)} = ${side}${perfect ? '' : ' (to 1 decimal place)'}.`], chk: (a) => Math.abs(a * a - A) <= (perfect ? 0 : 0.2 * a + 0.01) };
    } }),

  cov({ id: 'g8c.sq.square-decimal', skill: 'G8_SQUARES_TABLES', outcome: 'G8.SQUARES.c', form: 'direct', rung: 2,
    gen: () => {
      const x = randInt(12, 98) / 10;
      if (x % 1 === 0) return null;
      const sq = round(x * x, 2), p = person();
      return { question: `${p.name} uses a calculator to find the area of a square tile with a side of ${x} cm. Work out ${x}² in square centimetres.`, answer: sq,
        wrong: [[round(x * 2, 2), 'You multiplied by 2. Squaring means multiplying the number by itself.'], [round(sq / 10, 3), 'The decimal point is in the wrong place. Count the decimal places in both numbers.'], [round(sq * 10, 1), 'The decimal point is in the wrong place. Count the decimal places in both numbers.'], [Math.round(sq), 'The answer was rounded to a whole number. Give the full answer from the calculator.']],
        hints: ['Squaring a number means multiplying it by itself.', 'Use the x² key on your calculator.'],
        steps: [`${x}² = ${x} × ${x}.`, `${x} × ${x} = ${sq}.`], chk: (a) => Math.abs(Math.sqrt(a) - x) < 1e-6 };
    } }),

  // ================================================================ RATES, RATIO, PROPORTION
  cov({ id: 'g8c.rate.per-unit', skill: 'G8_RATIO_PROPORTION', outcome: 'G8.RATES.b', form: 'word', rung: 2,
    gen: () => {
      const kind = pick([['A cyclist rides from Thika to Nairobi, 45 km, in 3 hours. What is the average rate in kilometres per hour?', 'km', 'hours'], ['A tank fills with 240 litres of water in 8 minutes. What is the rate in litres per minute?', 'litres', 'minutes'], ['A trader paid for sacks of potatoes and a fixed mass of potatoes. What was the price per kilogram, in shillings?', 'sh', 'kg'], ['A typist types words in a fixed time. What is her rate in words per minute?', 'words', 'minutes']]);
      const unit = randInt(4, 15), t = randInt(3, 9), tot = unit * t, p = person();
      let q;
      if (kind[1] === 'km') q = `${p.name} cycles ${tot} km in ${t} hours at a steady speed. What is ${p.her} rate in kilometres per hour?`;
      else if (kind[1] === 'litres') q = `A tank fills with ${tot * 10} litres of water in ${t} minutes. What is the rate in litres per minute?`;
      else if (kind[1] === 'sh') q = `${p.name} pays ${sh(tot * 10)} for ${t} kg of beans. What is the price per kilogram, in shillings?`;
      else q = `${p.name} types ${tot * 5} words in ${t} minutes. What is ${p.her} rate in words per minute?`;
      const amount = kind[1] === 'km' ? tot : kind[1] === 'litres' ? tot * 10 : kind[1] === 'sh' ? tot * 10 : tot * 5;
      const right = amount / t;
      const w = [[amount * t, 'You multiplied. A rate is an amount shared for each one unit, so divide.'], [round(t / amount, 3), 'You divided the wrong way round. Divide the amount by the time or the quantity.'], [amount + t, 'You added. A rate compares two amounts by dividing.'], [amount - t, 'You subtracted. A rate compares two amounts by dividing.']];
      return { question: q, answer: right, wrong: w,
        hints: ['A rate tells you how much for one unit.', 'Divide the total amount by the number of units.'],
        steps: [`Rate = amount ÷ number of units.`, `${amount} ÷ ${t} = ${right}.`], chk: (a) => a * t === amount };
    } }),

  cov({ id: 'g8c.ratio.compare-two', skill: 'G6_RATIOS', outcome: 'G8.RATES.d', form: 'why', rung: 3,
    gen: () => {
      const a = randInt(1, 5), b = randInt(a + 1, 9), equal = Math.random() < 0.25, k = randInt(2, 3);
      let c, d;
      if (equal) { c = a * k; d = b * k; } else { c = randInt(1, 9); d = randInt(c + 1, 14); }
      const s1 = a / (a + b), s2 = c / (c + d);
      if (!equal && Math.abs(s1 - s2) < 0.02) return null;
      const right = equal ? 'The same' : s1 > s2 ? 'Class 8A' : 'Class 8B';
      const options = mc(right, [['Class 8A', right === 'Class 8A' ? null : 'Compare the fraction of each class that are girls. A bigger number in a ratio does not mean a bigger share.'], ['Class 8B', right === 'Class 8B' ? null : 'Compare the fraction of each class that are girls. A bigger number in a ratio does not mean a bigger share.'], ['The same', right === 'The same' ? null : 'The ratios are not equal. Change each one to a fraction of the class and compare.']].filter(x => x[1]));
      return { question: `In Class 8A the ratio of girls to boys is ${a} : ${b}. In Class 8B it is ${c} : ${d}. In which class are girls the bigger share of the class?`, options, instruction: 'Choose the best answer.',
        hints: ['A girls : boys ratio of 2 : 3 means 2 out of 5 learners are girls.', 'Change each ratio to a fraction of the whole class, then compare the fractions.'],
        steps: [`Class 8A: ${a} out of ${a + b} are girls. Class 8B: ${c} out of ${c + d} are girls.`, `${a}/${a + b} and ${c}/${c + d}: ${equal ? 'they are equal' : s1 > s2 ? 'the first is bigger' : 'the second is bigger'}. The answer is ${right}.`] };
    } }),

  cov({ id: 'g8c.pct.change-amount', skill: 'G8_PERCENTAGE_CHANGE', outcome: 'G8.RATES.h', form: 'word', rung: 2,
    gen: () => {
      const up = Math.random() < 0.55, pct = pick([10, 20, 25, 30, 40, 50]), base = pick([2000, 2500, 3000, 3500, 4000, 5000, 8000, 12000]);
      const ch = (base * pct) / 100, nw = up ? base + ch : base - ch;
      if (Number.isNaN(ch) || ch % 1 !== 0) return null;
      const thing = pick(['a bag of maize', 'a bicycle tyre set', 'a school uniform', 'a bag of fertiliser']);
      const w = [[ch, 'This is the amount of the change in shillings. The question asks for the percentage.'], [round((ch / nw) * 100, 1), 'You divided by the new price. A percentage change is worked out from the original price.'], [round((nw / base) * 100, 1), 'This compares the new price to the old one. Use the change, not the new price.'], [round(ch / base, 3), 'This is the change as a decimal. Multiply by 100 to make it a percentage.']];
      return { question: `${person().name} compares prices. Last year ${thing} cost ${sh(base)}. This year it costs ${sh(nw)}. Work out the percentage ${up ? 'increase' : 'decrease'} in the price.`, answer: pct, wrong: w,
        hints: ['First find the change in price.', 'Divide the change by the original price, then multiply by 100.'],
        steps: [`Change = ${commas(Math.max(base, nw))} − ${commas(Math.min(base, nw))} = ${commas(ch)}.`, `${commas(ch)} ÷ ${commas(base)} × 100 = ${pct}%.`], chk: (a) => Math.abs(base * (1 + (up ? 1 : -1) * a / 100) - nw) < 1e-6 };
    } }),

  cov({ id: 'g8c.pct.which-method', skill: 'G8_PERCENTAGE_CHANGE', outcome: 'G8.RATES.h', form: 'why', rung: 3,
    gen: () => {
      const base = pick([2400, 3000, 4500, 6000]), nw = base + pick([300, 600, 900, 1200]), p = person();
      const right = `(${commas(nw)} − ${commas(base)}) ÷ ${commas(base)} × 100`;
      const options = mc(right, [[`(${commas(nw)} − ${commas(base)}) ÷ ${commas(nw)} × 100`, 'This divides by the new amount. A percentage change always compares with the original.'], [`${commas(nw)} ÷ ${commas(base)} × 100`, 'This gives the new amount as a percentage of the old one, not the change.'], [`(${commas(nw)} − ${commas(base)}) × 100`, 'The change must be divided by the original amount before multiplying by 100.']]);
      return { question: `${p.name} earned ${sh(base)} a month and now earns ${sh(nw)}. Which calculation gives the percentage increase?`, options, instruction: 'Choose the best answer.',
        hints: ['The percentage increase compares the increase with the amount before it.', 'Change ÷ original × 100.'],
        steps: ['Find the increase by taking the old amount from the new amount.', `Divide by the original and multiply by 100: ${right}.`] };
    } }),

  cov({ id: 'g8c.prop.direct-or-inverse', skill: 'G8_RATIO_PROPORTION', outcome: 'G8.RATES.i', form: 'direct', rung: 2,
    gen: () => {
      const direct = ['The number of exercise books bought and the total cost, when each book costs the same', 'The litres of petrol bought and the cost, at a fixed price per litre', 'The kilograms of sugar bought and the cost of the sugar', 'The distance a bus travels and the time taken, at a steady speed', 'The number of mandazi bought and the money paid'];
      const inverse = ['The number of workers building a wall and the days they need', 'The speed of a matatu and the time it takes to go from Nakuru to Eldoret', 'The number of taps filling a tank and the time to fill it', 'The number of learners sharing 60 sweets and the number each learner gets', 'The number of machines ploughing a shamba and the hours they need'];
      const neither = ['The age of a learner and the number of books in her bag', 'The height of a boy and the number of letters in his name', 'A learner\'s birth month and her mark in mathematics'];
      const kind = pick(['direct', 'inverse', 'neither']), list = kind === 'direct' ? direct : kind === 'inverse' ? inverse : neither, ex = pick(list);
      const lab = { direct: 'Direct proportion', inverse: 'Inverse proportion', neither: 'Neither' };
      const why = { direct: 'When one doubles, the other doubles too, so this is a direct proportion.', inverse: 'When one doubles, the other halves, so this is an inverse proportion.', neither: 'Changing one does not make the other change by the same rule, so this is neither.' };
      const options = mcFixed(lab[kind], Object.keys(lab).filter(k => k !== kind).map(k => [lab[k], `Check what happens when the first quantity doubles. ${k === 'neither' ? 'Is there any rule linking them?' : k === 'direct' ? 'Does the other double as well?' : 'Does the other halve?'}`]), Object.values(lab));
      return { question: `Which kind of relationship is this? ${ex}.`, options, instruction: 'Choose the best answer.',
        hints: ['Imagine the first quantity doubling. What happens to the second?', 'If the second doubles too, it is direct. If it halves, it is inverse.'],
        steps: [`Double the first quantity and see what happens to the second.`, why[kind]] };
    } }),

  // ================================================================ LINEAR EQUATIONS
  cov({ id: 'g8c.eq.eliminate-subtract', skill: 'G8_SIMULTANEOUS_INTRO', outcome: 'G8.EQUATIONS.c', form: 'steps', rung: 3,
    gen: () => {
      const c = pick([40, 50, 60, 70, 80]), t = pick([20, 30, 40, 50]), a = randInt(2, 4), b1 = randInt(1, 3), b2 = randInt(b1 + 1, 6), P1 = a * c + b1 * t, P2 = a * c + b2 * t;
      const w1 = [[P2 - P1, 'You subtracted the totals but did not divide by the difference in the number of packets of salt.'], [round((P1 + P2) / (b1 + b2), 2), 'The bars of soap are the same in both orders, so subtract the equations. Adding does not remove them.']];
      const w2 = [[round(P1 / a, 2), 'You left out the salt. Put the price of salt into one order and solve for the soap.'], [round((P1 + b1 * t) / a, 2), 'You added the salt instead of taking it away from the total.']];
      const p = person();
      return { question: `${p.name} buys ${a} bars of soap and ${b1} packet${b1 === 1 ? '' : 's'} of salt for ${sh(P1)}. On another day ${p.she} buys ${a} bars of soap and ${b2} packets of salt for ${sh(P2)}. Solve by elimination.`,
        parts: [{ prompt: 'What is the price of one packet of salt, in shillings?', answer: t, wrong: w1, hint: 'Subtract the first order from the second. The soap cancels.' }, { prompt: 'What is the price of one bar of soap, in shillings?', answer: c, wrong: w2, hint: 'Put the price of salt into the first order and solve.' }],
        hints: ['Both orders have the same number of bars of soap, so subtract one equation from the other.', 'Find the price of salt first.'],
        steps: [`Subtract: ${b2 - b1} packets of salt cost ${sh(P2 - P1)}, so one packet is ${sh(t)}.`, `${a} bars of soap cost ${sh(P1)} − ${sh(b1 * t)} = ${sh(a * c)}, so one bar is ${sh(c)}.`], chk: (v) => a * v[1] + b1 * v[0] === P1 && a * v[1] + b2 * v[0] === P2 };
    } }),

  cov({ id: 'g8c.eq.eliminate-add', skill: 'G8_SIMULTANEOUS_INTRO', outcome: 'G8.EQUATIONS.c', form: 'steps', rung: 3,
    gen: () => {
      const small = randInt(20, 60), diff = randInt(4, 30), big = small + diff, S = big + small, p = person();
      const goods = pick(['maize', 'beans', 'rice', 'sugar']), other = pick(['flour', 'salt']);
      const w1 = [[round(S / 2, 2), 'You divided the sum by 2, as if both sacks were equal. They differ.'], [S - diff, 'You took the difference from the sum but did not divide by 2.']];
      const w2 = [[diff, 'This is the difference between the sacks. Find the mass of the lighter sack itself.'], [round((S + diff) / 2, 2), 'You added the difference. To find the lighter sack, take it away from the bigger sack.']];
      return { question: `A sack of ${goods} and a sack of ${other} together have a mass of ${S} kg. The sack of ${goods} is ${diff} kg heavier than the sack of ${other}. Let x be the mass of the ${goods} and y the mass of the ${other}, so x + y = ${S} and x − y = ${diff}. Solve by elimination.`,
        parts: [{ prompt: `What is the mass of the sack of ${goods}, in kg?`, answer: big, wrong: w1, hint: 'Add the two equations. The y terms cancel.' }, { prompt: `What is the mass of the sack of ${other}, in kg?`, answer: small, wrong: w2, hint: 'Put your first answer into x + y and find y.' }],
        hints: ['The y terms have opposite signs, so add the two equations.', 'Find x first, then y.'],
        steps: [`Add the equations: 2x = ${S + diff}, so x = ${big}.`, `${big} + y = ${S}, so y = ${small}.`], chk: (v) => v[0] + v[1] === S && v[0] - v[1] === diff };
    } }),

  // ================================================================ DATA
  cov({ id: 'g8c.data.line-difference', skill: 'G8_DATA_GRAPHS', outcome: 'G8.DATA.d', form: 'graph', rung: 2,
    gen: () => {
      const ys = Array.from({ length: 6 }, () => randInt(5, 14) * 10), i = randInt(0, 2), j = randInt(i + 2, 5);
      if (ys[i] === ys[j]) return null;
      const diff = Math.abs(ys[j] - ys[i]), up = ys[j] > ys[i];
      const top = Math.max(...ys);
      return { question: `The line graph shows the price of a kilogram of onions at a market in six weeks. By how many shillings did the price ${up ? 'rise' : 'fall'} between week ${i + 1} and week ${j + 1}?`, answer: diff,
        model: { type: 'line-graph', data: { points: ys.map((y, k) => ({ x: k + 1, y })), xTicks: [1, 2, 3, 4, 5, 6], yTicks: Array.from({ length: Math.ceil(top / 20) + 1 }, (_, k) => k * 20), xLabel: 'Week', yLabel: 'Price (sh per kg)' } },
        wrong: [[ys[j], `This is the price in week ${j + 1}. Take the price in week ${i + 1} from it.`], [ys[i] + ys[j], 'You added the two prices. The question asks for the change.'], [j - i, 'This is the number of weeks. Read the price on the vertical axis.'], [diff + 20, 'You read one tick too far on the axis. Check which marks the two points sit on.']],
        hints: ['Read each price from the vertical axis. Use a ruler across from the point.', 'Take the smaller price from the bigger one.'],
        steps: [`Week ${i + 1}: ${ys[i]}. Week ${j + 1}: ${ys[j]}.`, `${Math.max(ys[i], ys[j])} − ${Math.min(ys[i], ys[j])} = ${diff} shillings.`], chk: (a) => a === Math.abs(ys[j] - ys[i]) };
    } }),

  cov({ id: 'g8c.data.line-fall', skill: 'G8_DATA_GRAPHS', outcome: 'G8.DATA.d', form: 'graph', rung: 3,
    gen: () => {
      const ys = [randInt(6, 12) * 10]; for (let k = 1; k < 6; k++) ys.push(ys[k - 1] + 10 * randInt(1, 3));
      const f = randInt(1, 4); ys[f] = ys[f - 1] - 10 * randInt(1, 3); for (let k = f + 1; k < 6; k++) ys[k] = ys[k - 1] + 10 * randInt(1, 3);
      const falls = ys.slice(1).map((y, k) => y < ys[k]);
      if (falls.filter(Boolean).length !== 1 || Math.min(...ys) < 10) return null;
      const idx = shuffle([0, 1, 2, 3, 4]).slice(0, 4).sort((a, b) => a - b);
      if (!idx.includes(falls.indexOf(true))) idx[0] = falls.indexOf(true);
      const set = [...new Set(idx)].sort((a, b) => a - b);
      if (set.length < 4) return null;
      const top = Math.max(...ys);
      const options = set.map(k => ({ text: `Between week ${k + 1} and week ${k + 2}`, right: falls[k], why: falls[k] ? undefined : 'The line goes up here, so the number rose. Look for the one place where the line goes down.' }));
      return { question: 'The line graph shows the number of learners who came to a school club each week for six weeks. Between which two weeks did the number fall?', options, instruction: 'Choose the best answer.', fixedOrder: true,
        model: { type: 'line-graph', data: { points: ys.map((y, k) => ({ x: k + 1, y })), xTicks: [1, 2, 3, 4, 5, 6], yTicks: Array.from({ length: Math.ceil(top / 20) + 1 }, (_, k) => k * 20), xLabel: 'Week', yLabel: 'Learners' } },
        hints: ['A fall is where the line goes down as you read from left to right.', 'Look at each pair of weeks in turn.'],
        steps: ys.slice(1).map((y, k) => `Week ${k + 1} to ${k + 2}: ${ys[k]} to ${y}, ${y < ys[k] ? 'a fall' : 'a rise'}.`) };
    } }),

  cov({ id: 'g8c.data.mean-of-scores', skill: 'G6_MEAN', outcome: 'G8.DATA.f', form: 'word', rung: 2,
    gen: () => {
      const n = randInt(4, 6), mean = randInt(8, 30), vals = Array.from({ length: n }, () => mean + randInt(-6, 6));
      const adj = n * mean - vals.reduce((a, b) => a + b, 0); vals[0] += adj;
      if (vals.some(v => v < 1) || new Set(vals).size < n - 1) return null;
      const sorted = [...vals].sort((a, b) => a - b), sum = n * mean, p = person();
      const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
      const w = [[sum, 'This is the total. To find the mean, divide the total by the number of values.'], [round(sum / (n - 1), 2), `You divided by ${n - 1}. Divide by the number of values, which is ${n}.`], [median, 'This is the middle value, the median. The mean is the total divided by the number of values.'], [vals[0], 'This is only one of the values. The mean uses all of them.']];
      return { question: `${p.name} scored ${vals.join(', ')} marks in ${n} short tests. What is ${p.her} mean mark?`, answer: mean, wrong: w,
        hints: ['Add up all the marks.', `Divide the total by the number of tests, ${n}.`],
        steps: [`Total: ${vals.join(' + ')} = ${sum}.`, `Mean = ${sum} ÷ ${n} = ${mean}.`], chk: (a) => a * n === vals.reduce((s, v) => s + v, 0) };
    } }),

  cov({ id: 'g8c.data.mean-missing-value', skill: 'G6_MEAN', outcome: 'G8.DATA.f', form: 'word', rung: 3,
    gen: () => {
      const n = randInt(4, 5), mean = randInt(12, 40), known = Array.from({ length: n - 1 }, () => mean + randInt(-8, 8)), last = n * mean - known.reduce((a, b) => a + b, 0);
      if (last < 1 || last === mean) return null;
      const p = person(), sumK = known.reduce((a, b) => a + b, 0);
      const w = [[mean, 'This is the mean. The missing value is what makes the total reach the mean multiplied by the number of values.'], [round(sumK / (n - 1), 2), 'This is the mean of the values you know. Find the total needed for all values first.'], [n * mean + sumK, 'You added. The missing value is the total needed minus what you already have.'], [mean - sumK + n, 'Check the steps. Total needed = mean × number of values.']];
      return { question: `The mean number of eggs a hen laid in ${n} days was ${mean}. In ${n - 1} of the days it laid ${known.join(', ')} eggs. How many eggs did it lay on the other day, for ${p.name}'s farm?`, answer: last, wrong: w,
        hints: [`The total number of eggs is the mean × ${n}.`, 'Take away the eggs you know about.'],
        steps: [`Total needed = ${mean} × ${n} = ${n * mean}.`, `${n * mean} − ${sumK} = ${last}.`], chk: (a) => (a + sumK) / n === mean };
    } }),

  cov({ id: 'g8c.data.median-of-list', skill: 'G8_DATA_GRAPHS', outcome: 'G8.DATA.g', form: 'word', rung: 2,
    gen: () => {
      const n = pick([5, 6, 7, 8]), vals = Array.from({ length: n }, () => randInt(3, 40)), sorted = [...vals].sort((a, b) => a - b);
      const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
      if (new Set(vals).size < n || median % 0.5 !== 0) return null;
      const mean = round(vals.reduce((a, b) => a + b, 0) / n, 2), unsorted = n % 2 ? vals[(n - 1) / 2] : (vals[n / 2 - 1] + vals[n / 2]) / 2;
      const w = [[unsorted, 'You took the middle of the list as it is written. Put the numbers in order first.'], [mean, 'This is the mean. The median is the middle value when the numbers are in order.'], [n % 2 ? sorted[(n + 1) / 2] : sorted[n / 2], n % 2 ? 'You went one place past the middle. Count again from each end.' : 'With an even number of values, the median is halfway between the two middle ones.'], [Math.max(...vals), 'This is the greatest value. The median is the middle one.']];
      const p = person();
      return { question: `${p.name} records the number of customers at a kiosk on ${n} days: ${vals.join(', ')}. What is the median number of customers?`, answer: median, wrong: w,
        hints: ['Write the numbers in order from smallest to biggest.', n % 2 ? 'The median is the middle number.' : 'With an even number of values, find the number halfway between the two middle ones.'],
        steps: [`In order: ${sorted.join(', ')}.`, n % 2 ? `The middle number is ${median}.` : `The two middle numbers are ${sorted[n / 2 - 1]} and ${sorted[n / 2]}, so the median is ${median}.`], chk: (a) => sorted.filter(v => v < a).length <= n / 2 && sorted.filter(v => v > a).length <= n / 2 };
    } }),

  cov({ id: 'g8c.data.median-spot-reason', skill: 'G8_DATA_GRAPHS', outcome: 'G8.DATA.g', form: 'why', rung: 3,
    gen: () => {
      const vals = Array.from({ length: 5 }, () => randInt(2, 30));
      const sorted = [...vals].sort((a, b) => a - b);
      if (new Set(vals).size < 5 || vals[2] === sorted[2]) return null;
      const p = person();
      const options = mc('He did not put the numbers in order first', [['He should have added the numbers and divided by 5', 'That finds the mean, not the median. The median is the middle value.'], ['He should have chosen the number that appears most often', 'That finds the mode. The median is the middle value.'], ['He should have chosen the biggest number', 'The median is the middle value, not the biggest.']]);
      return { question: `${p.name} finds the median of ${vals.join(', ')}. ${p.She} says it is ${vals[2]}, the number in the middle of the list. What did ${p.she} do wrong?`, options, instruction: 'Choose the best answer.',
        hints: ['The median is the middle number after the numbers are put in order.', 'Is the list in order?'],
        steps: [`In order the numbers are ${sorted.join(', ')}.`, `The middle number is ${sorted[2]}, not ${vals[2]}.`] };
    } }),

  // ================================================================ PROBABILITY
  cov({ id: 'g8c.prob.experimental', skill: 'G8_PROBABILITY_INTRO', outcome: 'G8.PROB.c', form: 'word', rung: 2,
    gen: () => {
      const n = pick([20, 40, 50, 60, 80, 100]), k = randInt(3, n - 3);
      if (k * 2 === n) return null;
      const thing = pick([['A bottle top is flicked', 'lands upright', 'upright'], ['A drawing pin is dropped', 'lands point up', 'point up'], ['A seed from a packet is planted', 'grows', 'grows']]);
      const right = frac(k, n), p = person();
      const w = [[frac(n - k, n), `This is the probability that it does not ${thing[1].replace('lands ', 'land ').replace('grows', 'grow')}. The question asks for the probability that it does.`], [frac(k, n - k), `You compared the two results with each other. A probability is the number of times it happened out of all ${n} tries.`], [frac(n, k), 'You turned the fraction upside down. The number of times it happened goes on top.'], ['1/2', 'This is what you might expect without trying. The experimental probability uses the results.']];
      return { question: `${p.name} tries an experiment ${n} times. ${thing[0]} and it ${thing[1]} ${k} times. What is the experimental probability that it ${thing[1]}? Give the answer as a fraction in its simplest form.`, answer: right, wrong: w,
        hints: ['Experimental probability is based on what actually happened.', 'Write the number of times it happened over the total number of tries.'],
        steps: [`It happened ${k} times out of ${n}.`, `Probability = ${k}/${n} = ${right}.`], chk: (a) => { const [x, y] = a.split('/').map(Number); return x * n === k * y; } };
    } }),

  cov({ id: 'g8c.prob.fraction-to-decimal', skill: 'G8_PROBABILITY_INTRO', outcome: 'G8.PROB.e', form: 'direct', rung: 2,
    gen: () => {
      const d = pick([4, 5, 8, 10, 20, 25, 50]), n = randInt(1, d - 1);
      if (gcd(n, d) !== 1) return null;
      const dec = round(n / d, 3), p = person();
      const w = [[round(n / 10, 3), 'You divided the top number by 10. Divide the top number by the bottom number.'], [round(d / n, 3), 'You divided the wrong way round. Divide the top number by the bottom number.'], [Number(`${n}.${d}`), 'You wrote the two numbers either side of a point. A fraction means divide.'], [round((n / d) * 10, 3), 'The decimal point is in the wrong place. Check the place value of your answer.']];
      return { question: `The probability that ${p.name}'s bus is on time is ${n}/${d}. Write this probability as a decimal.`, answer: dec, wrong: w,
        hints: ['A fraction means the top number divided by the bottom number.', 'Divide, and write the answer as a decimal.'],
        steps: [`${n}/${d} = ${n} ÷ ${d}.`, `${n} ÷ ${d} = ${dec}.`], chk: (a) => Math.abs(a * d - n) < 1e-6 };
    } }),

  cov({ id: 'g8c.prob.as-percentage', skill: 'G8_PROBABILITY_INTRO', outcome: 'G8.PROB.e', form: 'word', rung: 2,
    gen: () => {
      const d = pick([20, 25, 50, 10, 4, 5]), n = randInt(1, d - 1);
      if (gcd(n, d) !== 1) return null;
      const pct = (n * 100) / d;
      if (pct % 1 !== 0) return null;
      const p = person();
      const w = [[round(n / d, 3), 'This is the decimal. A percentage is out of 100, so multiply the decimal by 100.'], [n, 'This is the top of the fraction. Multiply the probability by 100 to get a percentage.'], [round(pct / 10, 2), 'You multiplied by 10 only. A percentage is out of 100.'], [round(pct * 10, 0), 'You multiplied by 1,000. A percentage is out of 100.']];
      return { question: `${p.name} picks a card from a pack. The probability of picking a red card is ${n}/${d}. Express this probability as a percentage. Give the number only.`, answer: pct, wrong: w,
        hints: ['A percentage is out of 100.', 'Multiply the fraction by 100.'],
        steps: [`${n}/${d} × 100.`, `${n} ÷ ${d} × 100 = ${pct}%.`], chk: (a) => a * d === n * 100 };
    } }),

  cov({ id: 'g8c.prob.by-chance', skill: 'G8_PROBABILITY_INTRO', outcome: 'G8.PROB.g', form: 'direct', rung: 1,
    gen: () => {
      const chance = ['A fair coin is tossed and lands on heads', 'A die is rolled and shows a six', 'The first customer at a kiosk buys a mandazi', 'A learner picked from the class by lots is left-handed', 'The next car to pass the school gate is white', 'A raffle ticket drawn at a harambee wins the prize'];
      const sure = ['The sun rises tomorrow morning', 'Saturday comes after Friday', 'A full 5-litre jerrican holds 5 litres of water', 'A learner who is 12 years old will be 13 on her next birthday', 'Water in a closed bottle stays in the bottle until it is poured out'];
      const right = pick(chance), wrongs = shuffle(sure).slice(0, 3);
      const options = mc(right, wrongs.map(w => [w, 'We know what will happen here, so no chance is involved.']));
      return { question: `${person().name} is learning about chance. Which of these events happens by chance, so that no one can be sure of the result?`, options, instruction: 'Choose the best answer.',
        hints: ['An event by chance has results that cannot be known in advance.', 'If you can say for sure what will happen, it is not by chance.'],
        steps: ['Events that happen by chance have uncertain results.', `${right}: no one can be sure of the result.`] };
    } }),

  // ================================================================ COORDINATES AND GRAPHS
  cov({ id: 'g8c.graph.point-description', skill: 'G8_COORDINATES', outcome: 'G8.GRAPHS.c', form: 'direct', rung: 2,
    gen: () => {
      const x = pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), y = pick([-5, -4, -3, -2, 2, 3, 4, 5]);
      if (Math.abs(x) === Math.abs(y)) return null;
      const d = (a, b) => `${Math.abs(a)} unit${Math.abs(a) === 1 ? '' : 's'} ${a > 0 ? 'right' : 'left'} and ${Math.abs(b)} unit${Math.abs(b) === 1 ? '' : 's'} ${b > 0 ? 'up' : 'down'}`;
      const right = `${Math.abs(x)} ${x > 0 ? 'right' : 'left'}, ${Math.abs(y)} ${y > 0 ? 'up' : 'down'}`;
      const t = (a, b) => `${Math.abs(a)} ${a > 0 ? 'right' : 'left'}, ${Math.abs(b)} ${b > 0 ? 'up' : 'down'}`;
      const options = mc(t(x, y), [[`${Math.abs(y)} ${y > 0 ? 'right' : 'left'}, ${Math.abs(x)} ${x > 0 ? 'up' : 'down'}`, 'The numbers are in the wrong order. The first number is across (x) and the second is up or down (y).'], [t(-x, y), 'The first number tells you the direction across. A positive number goes right and a negative number goes left.'], [t(x, -y), 'The second number tells you the direction up or down. A positive number goes up and a negative number goes down.']]);
      return { question: `On a Cartesian plane, you start at the origin (0, 0). Which describes how to reach the point (${sgn(x)}, ${sgn(y)})?`, options, instruction: 'Choose the best answer.',
        hints: ['The first number is how far across, the second is how far up or down.', 'Positive goes right or up. Negative goes left or down.'],
        steps: [`The first number is ${x}: move ${Math.abs(x)} ${x > 0 ? 'right' : 'left'}.`, `The second number is ${y}: move ${Math.abs(y)} ${y > 0 ? 'up' : 'down'}.`] };
    } }),

  cov({ id: 'g8c.graph.point-after-moves', skill: 'G8_COORDINATES', outcome: 'G8.GRAPHS.c', form: 'word', rung: 3,
    gen: () => {
      const a = randInt(2, 7), b = randInt(1, 6), dx = Math.random() < 0.5 ? -a : a, dy = Math.random() < 0.5 ? -b : b;
      if (a === b) return null;
      const f = (x, y) => `(${sgn(x)}, ${sgn(y)})`, p = person();
      const options = mc(f(dx, dy), [[f(dy, dx), 'The numbers are in the wrong order. The first number is across (x) and the second is up or down (y).'], [f(-dx, dy), `Moving ${dx < 0 ? 'left' : 'right'} makes the first number ${dx < 0 ? 'negative' : 'positive'}.`], [f(dx, -dy), `Moving ${dy < 0 ? 'down' : 'up'} makes the second number ${dy < 0 ? 'negative' : 'positive'}.`]]);
      return { question: `${p.name} plots a point on a Cartesian plane. ${p.She} starts at the origin, moves ${a} units ${dx < 0 ? 'left' : 'right'} and then ${b} units ${dy < 0 ? 'down' : 'up'}. What are the coordinates of the point?`, options, instruction: 'Choose the best answer.',
        hints: ['Across first, then up or down.', 'Left and down are negative. Right and up are positive.'],
        steps: [`Across: ${dx < 0 ? 'left' : 'right'} ${a} gives x = ${sgn(dx)}.`, `Up or down: ${dy < 0 ? 'down' : 'up'} ${b} gives y = ${sgn(dy)}. The point is ${f(dx, dy)}.`] };
    } }),

  cov({ id: 'g8c.graph.boda-meet', skill: 'G8_LINEAR_GRAPHS', outcome: 'G8.GRAPHS.h', form: 'steps', rung: 3,
    gen: () => {
      const r1 = randInt(10, 20), r2 = r1 + randInt(5, 10), x = randInt(2, 8), f2 = 10 * randInt(2, 8), f1 = f2 + (r2 - r1) * x;
      if (f1 % 10 !== 0 && f1 % 5 !== 0) return null;
      const cost = f1 + r1 * x, p = person();
      const w1 = [[f1 - f2, 'This is the difference in the fixed charges. Divide by the difference in the rates to find the distance.'], [round((f1 - f2) / (r1 + r2), 2), 'You added the rates. The lines meet where the costs are equal, so use the difference in rates.'], [round((f1 + f2) / (r2 - r1), 2), 'You added the fixed charges. Take one fixed charge from the other.']];
      const w2 = [[f1, 'This is the fixed charge only. Add the cost of the distance travelled.'], [f2 + r1 * x, 'You mixed the two companies. Use the fixed charge and the rate of the same company.'], [cost * 2, 'The cost was doubled. Work out the cost for one company only.']];
      return { question: `Company A charges ${sh(f1)} plus ${sh(r1)} for each kilometre. Company B charges ${sh(f2)} plus ${sh(r2)} for each kilometre. On a graph of cost against distance, the two lines meet at a point.`,
        parts: [{ prompt: 'At what distance, in kilometres, do the two companies charge the same?', answer: x, wrong: w1, hint: `Write ${f1} + ${r1}x = ${f2} + ${r2}x and solve for x.` }, { prompt: 'What is that cost, in shillings?', answer: cost, wrong: w2, hint: 'Put your distance into the charge for Company A.' }],
        hints: ['The lines meet where the two costs are equal.', 'Write one equation for each company, then set the costs equal.'],
        steps: [`${f1} + ${r1}x = ${f2} + ${r2}x, so ${f1 - f2} = ${r2 - r1}x and x = ${x}.`, `Cost = ${f1} + ${r1} × ${x} = ${sh(cost)}.`], chk: (v) => f1 + r1 * v[0] === f2 + r2 * v[0] && v[1] === f1 + r1 * v[0] };
    } }),

  // ================================================================ SCALE DRAWING
  cov({ id: 'g8c.scale.represent-length', skill: 'G8_SCALE_DRAWING', outcome: 'G8.SCALE.a', form: 'table', rung: 2,
    gen: () => {
      const s = pick([2, 4, 5, 10]), ks = [randInt(2, 9), randInt(2, 9), randInt(2, 9)];
      if (new Set(ks).size < 3) return null;
      const names = ['Fence', 'House wall', 'Gate'], reals = ks.map(k => k * s), show = (arr) => arr.map((v, i) => `${names[i]} ${v} cm`).join(', ');
      const sw = [...ks]; [sw[0], sw[2]] = [sw[2], sw[0]];
      const options = mc(show(ks), [[show(reals.map(r => r * s)), 'You multiplied. One centimetre stands for several metres, so the drawn lines are shorter than the real lengths.'], [show(reals), 'These are the real lengths written as centimetres. Each line on the plan is much shorter.'], [show(sw), 'Two of the lengths are swapped. Match each drawn length to its own real length.']]);
      return { question: `A surveyor makes a plan with the scale 1 cm to ${s} m. The table shows the real lengths. Which list gives the lengths to draw on the plan?`, options, instruction: 'Choose the best answer.',
        model: { type: 'table', data: { head: ['Part', 'Real length (m)'], rows: names.map((n, i) => ({ cells: [n, String(reals[i])] })) } },
        hints: [`1 cm on the plan stands for ${s} m in real life.`, `Divide each real length by ${s}.`],
        steps: names.map((n, i) => `${n}: ${reals[i]} ÷ ${s} = ${ks[i]} cm.`) };
    } }),

  cov({ id: 'g8c.scale.map-to-actual', skill: 'G8_SCALE_DRAWING', outcome: 'G8.SCALE.c', form: 'word', rung: 2,
    gen: () => {
      const s = pick([2, 5, 10, 20, 25]), L = randInt(11, 79) / 2, real = L * s, [a, b] = shuffle(['Nakuru', 'Naivasha', 'Gilgil', 'Nyahururu', 'Eldoret', 'Kitale', 'Kisumu', 'Kericho']).slice(0, 2);
      if (real % 0.5 !== 0) return null;
      return { question: `${a} and ${b} are ${L} cm apart on ${person().name}'s map. The key says that 1 cm stands for ${s} km. How far apart are the two towns in real life, in kilometres?`, answer: real,
        wrong: [[round(L / s, 2), 'You divided. To go from the map to the real distance, multiply by what one centimetre stands for.'], [round(L + s, 2), 'You added. Each centimetre on the map stands for several kilometres, so multiply.'], [round(real * 100, 0), 'You changed the answer to centimetres. The question asks for kilometres.'], [round(real / 2, 2), 'Check the multiplication again. Multiply the map distance by the number of kilometres for 1 cm.']],
        hints: ['Each centimetre on the map is one lot of the scale distance.', 'Multiply the map distance by the kilometres for 1 cm.'],
        steps: [`Real distance = ${L} × ${s}.`, `${L} × ${s} = ${real} km.`], chk: (a) => a / s === L };
    } }),

  cov({ id: 'g8c.scale.write-statement', skill: 'G8_SCALE_FORMS', outcome: 'G8.SCALE.e', form: 'direct', rung: 2,
    gen: () => {
      const s = pick([2, 5, 10, 20, 25, 50]), k = randInt(3, 9), real = s * k;
      const right = `1 cm represents ${s} km`;
      const options = mc(right, [[`1 cm represents ${real} km`, 'You used the whole real distance. Divide it by the map distance to get what 1 cm stands for.'], [`${k} cm represents ${s} km`, 'The statement must be for 1 cm. Divide to find it.'], [`1 cm represents ${k} km`, 'You used the map distance. Divide the real distance by the map distance.']]);
      const [a, b] = shuffle(['Thika', 'Nyeri', 'Embu', 'Meru', 'Machakos', 'Kajiado']).slice(0, 2);
      return { question: `The road from ${a} to ${b} measures ${k} cm on a map and ${real} km on the ground. Which sentence gives the scale of the map?`, options, instruction: 'Choose the best answer.',
        hints: ['A scale in statement form says what 1 cm stands for.', 'Divide the real distance by the length on the map.'],
        steps: [`${real} km ÷ ${k} = ${s} km.`, `So ${right}.`] };
    } }),

  cov({ id: 'g8c.scale.ratio-to-ground', skill: 'G8_SCALE_FORMS', outcome: 'G8.SCALE.f', form: 'word', rung: 3,
    gen: () => {
      const r = pick([[10000, 0.1], [20000, 0.2], [50000, 0.5], [100000, 1], [250000, 2.5]]), p = person();
      const w = [[r[0], 'This is the real length in centimetres. The question asks for kilometres.'], [r[0] / 100, 'This is in metres. The question asks for kilometres.'], [r[0] / 1000, 'This is not kilometres. 1 km is 100,000 cm.'], [round(r[1] * 10, 2), 'Check the change from centimetres to kilometres. Divide by 100 and then by 1,000.']];
      return { question: `${p.name}'s map has a scale of 1 : ${commas(r[0])}. A road is 1 cm long on the map. How many kilometres long is the real road?`, answer: r[1], wrong: w,
        hints: ['The ratio 1 : n means 1 cm on the map stands for n cm in real life.', 'Change centimetres to metres by dividing by 100, then to kilometres by dividing by 1,000.'],
        steps: [`1 cm stands for ${commas(r[0])} cm.`, `${commas(r[0])} cm ÷ 100 000 = ${r[1]} km.`], chk: (a) => Math.round(a * 100000) === r[0] };
    } }),

  cov({ id: 'g8c.scale.write-ratio', skill: 'G8_SCALE_FORMS', outcome: 'G8.SCALE.g', form: 'direct', rung: 3,
    gen: () => {
      const c = pick([2, 4, 5, 10]), m = c * randInt(2, 9) * 5 / 5, n = (m * 100) / c;
      if (n % 1 !== 0 || n < 20) return null;
      const options = mc(`1 : ${commas(n)}`, [[`${commas(n)} : 1`, 'The ratio for a scale starts with the length on the drawing, which is the smaller number.'], [`1 : ${commas(m)}`, 'You left the real length in metres. Change both lengths to centimetres first.'], [`1 : ${commas((m * 10) / c)}`, 'Check the change from metres to centimetres. 1 m is 100 cm.']]);
      const thing = pick(['a wall', 'a fence', 'a classroom']);
      return { question: `On a drawing, ${thing} that is really ${m} m long is shown by a line ${c} cm long. Which is the scale of the drawing as a ratio?`, options, instruction: 'Choose the best answer.',
        hints: ['Write both lengths in centimetres first.', 'Divide both by the drawing length so the first number is 1.'],
        steps: [`${m} m = ${m * 100} cm. The ratio is ${c} : ${m * 100}.`, `Divide both by ${c}: 1 : ${commas(n)}.`] };
    } }),

  cov({ id: 'g8c.scale.statement-to-ratio', skill: 'G8_SCALE_FORMS', outcome: 'G8.SCALE.h', form: 'direct', rung: 3,
    gen: () => {
      const k = pick([1, 2, 5, 10, 25]), n = k * 100000, right = `1 : ${commas(n)}`;
      const options = mc(right, [[`1 : ${commas(k)}`, 'The kilometres must be changed to centimetres to compare with 1 cm.'], [`1 : ${commas(k * 1000)}`, 'You changed kilometres to metres only. Both lengths must be in centimetres.'], [`1 : ${commas(k * 10000)}`, '1 km is 100,000 cm, not 10,000 cm.']]);
      return { question: `A map says "1 cm represents ${k} km". Which is the scale written as a ratio?`, options, instruction: 'Choose the best answer.',
        hints: ['A ratio scale has no units, so write both lengths in centimetres.', '1 km = 1,000 m = 100,000 cm.'],
        steps: [`${k} km = ${commas(k * 100000)} cm.`, `The ratio is 1 : ${commas(n)}.`] };
    } }),

  cov({ id: 'g8c.scale.ratio-to-statement', skill: 'G8_SCALE_FORMS', outcome: 'G8.SCALE.h', form: 'word', rung: 3,
    gen: () => {
      const m = pick([5, 10, 20, 25, 50, 100]), n = m * 100, p = person();
      const w = [[n, 'This is in centimetres. The question asks for metres.'], [n / 10, 'You divided by ten only. A metre is much longer than ten centimetres.'], [round(m / 100, 3), 'You divided twice. Divide only once, to change centimetres to metres.'], [n * 100, 'You multiplied. To change centimetres to metres, divide.']];
      return { question: `A surveyor draws ${p.name}'s plot using the ratio 1 : ${commas(n)}. What length on the ground, in metres, does each centimetre of the drawing stand for?`, answer: m, wrong: w,
        hints: ['In the ratio 1 : n, 1 cm on the drawing stands for n cm on the ground.', 'Think of how many centimetres make a metre, and change the units.'],
        steps: [`1 cm stands for ${commas(n)} cm.`, `${commas(n)} ÷ 100 = ${m} m.`], chk: (a) => a * 100 === n };
    } }),
];
