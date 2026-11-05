// ============================================================================
// GRADE 8 NUMBERS AND ALGEBRA: new question forms.
// Integers, fractions, decimals, squares and roots, rates and ratio, percentages,
// proportion, expressions and linear equations. Every answer is computed from
// the draw; every check works the question backwards another way.
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family, round, commas } from './core.js';
import { person, twoPeople, sh, price } from './kenya.js';

const fam = (def) => family({ reviewed: false, ...def });

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const neg = (n) => (n < 0 ? `−${-n}` : String(n));
const distinct = (...v) => new Set(v).size === v.length;
const simp = (n, d) => { const g = gcd(n, d); return [n / g, d / g]; };
const frt = ([n, d]) => (d === 1 ? `${n}` : `${n}/${d}`);
const signed = (c) => (c < 0 ? `− ${-c}` : `+ ${c}`);

export const FAMILIES = [
  // ======================================================== INTEGERS
  fam({ id: 'g8.int.lift-floors', skill: 'G6_INTEGERS_INTRO', outcome: 'G8.INTEGERS.a', rung: 2, form: 'word', allowNegative: true,
    draw: () => { const s = randInt(1, 6); return { s, d: s + randInt(2, 8), p: person() }; },
    make: ({ s, d }) => ({
      question: `A lift in a Nairobi office block is at floor ${s}. The ground floor is 0. The basement floors are −1, −2, −3 and so on. The lift goes down ${d} floors. Which floor does it reach?`,
      answer: s - d,
      wrong: [[d - s, 'That treats the answer as above the ground. Going down further than the ground floor takes you into the basement.'], [s + d, 'Going down takes floors away. Start at the floor the lift is on and count downwards.'], [-d, 'That ignores where the lift started.'], [s - d + 1, 'Floor 0 counts as a floor. Count it when you go down past the ground.']],
      hints: ['Draw a number line standing up, with floor 0 in the middle.', 'Start at the floor the lift is on and move down, one floor at a time.'],
      steps: [`The lift starts at floor ${s}.`, `Going down ${d} floors: ${s} − ${d} = ${neg(s - d)}.`, `The lift is at floor ${neg(s - d)}, in the basement.`],
    }),
    check: ({ s, d }, a) => a + d === s }),

  fam({ id: 'g8.int.order-why', skill: 'G6_INTEGERS_INTRO', outcome: 'G8.INTEGERS.a', rung: 1, form: 'why',
    draw: () => { const lo = -randInt(6, 20), hi = -randInt(1, 5); return { lo, hi, p: person() }; },
    make: ({ lo, hi, p }) => ({
      question: `Because ${-hi} is smaller than ${-lo}, ${p.name} says ${neg(hi)} is smaller than ${neg(lo)}. Why is this wrong?`,
      options: [
        { text: `${neg(lo)} is further left of zero, so it is smaller`, right: lo < hi },
        { text: 'Negative numbers cannot be compared with each other', right: false, why: 'They can. Every integer has its own place on the number line.' },
        { text: `${p.name} is right: the number with the smaller digit is the smaller number`, right: false, why: 'That is true above zero only. Below zero, the further a number is from zero, the smaller it is.' },
        { text: 'The two numbers are equal because both have a minus sign', right: false, why: 'The minus sign only says which side of zero. The digits still tell how far from zero.' },
      ],
      hints: ['Mark both numbers on a number line.', 'On a number line, smaller numbers are further to the left.'],
      steps: [`On the number line, ${neg(lo)} is ${-lo} places left of zero and ${neg(hi)} is ${-hi} places left of zero.`, `${neg(lo)} is further left, so ${neg(lo)} < ${neg(hi)}.`],
    }) }),

  fam({ id: 'g8.int.distance-spot', skill: 'G6_INTEGERS_INTRO', outcome: 'G8.INTEGERS.a', rung: 2, form: 'spot',
    draw: () => { const a = randInt(3, 9), b = randInt(a + 1, 14); return { a, b, p: person() }; },
    make: ({ a, b, p }) => {
      const shown = b - a;
      return { question: `${p.name} works out by how many degrees the temperature rises from ${neg(-a)} °C to ${b} °C. Which step has the mistake?`,
        working: [
          { text: `From ${neg(-a)} up to 0 is ${a} degrees.`, ok: true },
          { text: `From 0 up to ${b} is ${b} degrees.`, ok: true },
          { text: `Rise: ${b} − ${a} = ${shown}.`, ok: shown === a + b },
          { text: `So the temperature rises by ${shown} degrees.`, ok: true },
        ],
        fix: `The two parts are one after the other, so they are added: ${a} + ${b} = ${a + b}, not ${b} − ${a}.`,
        steps: ['Count up to zero first.', 'Then count on from zero to the warmer temperature.', 'Add the two parts.'] };
    } }),

  fam({ id: 'g8.int.balance-table', skill: 'G6_INTEGERS_ADD_SUB', outcome: 'G8.INTEGERS.b', rung: 2, form: 'table', allowNegative: true,
    draw: () => {
      const start = pick([200, 300, 400, 500]); const ch = []; for (let i = 0; i < 5; i++) ch.push(pick([-1, 1]) * randInt(1, 7) * 100);
      const total = start + ch.reduce((a, b) => a + b, 0);
      const pos = ch.filter(c => c > 0).reduce((a, b) => a + b, 0);
      const absSum = ch.reduce((a, b) => a + Math.abs(b), 0);
      const cands = [total, total - start, start + absSum, start + pos];
      return distinct(...cands) && total > -1500 ? { start, ch, total } : null;
    },
    make: ({ start, ch, total }) => {
      const pos = ch.filter(c => c > 0).reduce((a, b) => a + b, 0), absSum = ch.reduce((a, b) => a + Math.abs(b), 0);
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      return { question: 'A shop starts the week with money in its account. The table shows the change each day in shillings. A minus sign means money went out. What is the balance on Friday evening, in shillings?',
        model: { type: 'table', data: { head: ['Day', 'Change (sh)'], rows: [{ label: 'Start of week', value: `${start}` }, ...ch.map((c, i) => ({ label: days[i], value: `${c < 0 ? '−' : '+'}${Math.abs(c)}` }))] } },
        answer: total,
        wrong: [[total - start, 'The week began with money already in the account. Include the starting amount.'], [start + absSum, 'Money that went out must be taken away. A minus sign means subtract.'], [start + pos, 'You added only the money coming in. The minus amounts take money away too.']],
        hints: ['Start from the balance at the start of the week.', 'Add the plus amounts and take away the minus amounts, day by day.'],
        steps: [`Start: ${start}.`, `Money in: ${pos}. Money out: ${absSum - pos}.`, `${start} + ${pos} − ${absSum - pos} = ${neg(total)}.`] };
    },
    check: ({ start, ch }, a) => start + ch.reduce((s, c) => s + c, 0) === a }),

  fam({ id: 'g8.int.mountain-rate', skill: 'G7_INTEGERS_MUL_DIV', outcome: 'G8.INTEGERS.b', rung: 2, form: 'word', allowNegative: true,
    draw: () => { const h = randInt(3, 8), per = randInt(2, 5), start = randInt(2, 8); return { h, per, start }; },
    make: ({ h, per, start }) => ({
      question: `At noon on Mount Kenya it is ${start} °C. It then falls at the same rate each hour for ${h} hours, and is ${neg(start - per * h)} °C at the end. By how many degrees does the temperature change each hour? Write it as a negative integer.`,
      answer: -per,
      wrong: [[per, 'The temperature goes down, so the change each hour is negative.'], [(start - per * h) / h, 'You divided the final temperature by the hours. Divide the total change instead.'], [-(per * h), 'That is the whole change over all the hours. How much is it each hour?'], [h - per * h, 'The total change has to be shared out equally over the hours. Divide it.']],
      hints: ['First find the total change from noon to the end.', 'Share the total change equally over the hours: use ÷.'],
      steps: [`Total change: ${neg(start - per * h)} − ${start} = ${neg(-per * h)} °C.`, `Change each hour: ${neg(-per * h)} ÷ ${h} = ${neg(-per)} °C.`],
    }),
    check: ({ h, start, per }, a) => start + a * h === start - per * h }),

  fam({ id: 'g8.int.borehole-steps', skill: 'G7_INTEGERS_MUL_DIV', outcome: 'G8.INTEGERS.b', rung: 3, form: 'steps', allowNegative: true,
    draw: () => { const a = randInt(6, 14), f = randInt(2, 5), n = randInt(2, 4), k = n + randInt(2, 4); return { a, f, n, k }; },
    make: ({ a, f, n, k }) => ({
      question: `The water in a borehole is ${a} m below the ground. A pump lowers the water by ${f} m every month. Levels below the ground are written as negative numbers, for example −2 m.`,
      parts: [
        { prompt: `What is the change in the level after ${n} months, in metres?`, answer: -f * n, unit: 'm', hint: `Each month the change is −${f}. Multiply by ${n}.`, wrong: [[f * n, 'The level goes down, so the change is negative.'], [-f - n, 'Months of change are multiplied, not added.']] },
        { prompt: `What is the water level after ${n} months, in metres?`, answer: -a - f * n, unit: 'm', hint: `Start at −${a} and add the change from the step before.`, wrong: [[-a + f * n, 'Moving down makes the level more negative.'], [-f * n, 'Start from the first level, not from the ground.']] },
        { prompt: `After how many months from the start is the level −${a + f * k} m?`, answer: k, unit: 'months', hint: `How far must the level fall from −${a}? Divide by the fall each month.`, wrong: [[(a + f * k) / f, 'The pump started at a depth already. Take the starting depth away first.'], [a + f * k - f, 'Divide the extra fall by the fall each month.']] },
      ],
      steps: [`Change: −${f} × ${n} = ${neg(-f * n)} m.`, `Level: ${neg(-a)} + ${neg(-f * n)} = ${neg(-a - f * n)} m.`, `Fall needed: ${a + f * k} − ${a} = ${f * k} m. Months: ${f * k} ÷ ${f} = ${k}.`],
    }),
    check: ({ a, f, n, k }, v) => v[0] === -f * n && v[1] === -a + v[0] && -a - f * v[2] === -(a + f * k) }),

  // ======================================================== FRACTIONS
  fam({ id: 'g8.frac.shamba-share', skill: 'G8_FRACTIONS_COMBINED', outcome: 'G8.FRAC.b', rung: 2, form: 'word',
    draw: () => {
      const [a, b, c, d] = pick([[1, 3, 1, 4], [1, 2, 1, 5], [2, 5, 1, 4], [1, 2, 1, 3], [3, 8, 1, 4], [1, 3, 2, 5], [1, 4, 1, 6]]);
      const l = (b * d) / gcd(b, d); const A = l * randInt(1, Math.max(1, Math.floor(80 / l)));
      const m = (A * a) / b, be = (A * c) / d, rest = A - m - be;
      const p = person();
      return rest > 0 && distinct(rest, m + be, A - m, m * be) ? { a, b, c, d, A, m, be, rest, p } : null;
    },
    make: ({ a, b, c, d, A, m, be, rest, p }) => ({
      question: `${p.name}'s shamba is ${A} acres. ${a}/${b} of the shamba has maize and ${c}/${d} of the shamba has beans. The rest is grass. How many acres are grass?`,
      answer: rest,
      wrong: [[m + be, 'That is the land with crops. The grass is what is left after the crops.'], [A - m, 'You took away the maize only. The beans take land too.'], [m * be, 'The two fractions are of the same shamba, so you do not multiply the amounts.']],
      hints: ['Find the acres for maize and for beans.', 'Take both away from the whole shamba.'],
      steps: [`Maize: ${a}/${b} of ${A} = ${m} acres.`, `Beans: ${c}/${d} of ${A} = ${be} acres.`, `Grass: ${A} − ${m} − ${be} = ${rest} acres.`],
    }),
    check: ({ A, m, be }, x) => x + m + be === A }),

  fam({ id: 'g8.frac.tank-steps', skill: 'G8_FRACTIONS_COMBINED', outcome: 'G8.FRAC.b', rung: 2, form: 'steps',
    draw: () => { const [n1, d1] = pick([[3, 5], [2, 3], [3, 4], [5, 6]]), d2 = pick([2, 3, 4]); const C = d1 * d2 * randInt(4, 12); const now = (C * n1) / d1, used = now / d2; return Number.isInteger(now) && Number.isInteger(used) ? { n1, d1, d2, C, now, used } : null; },
    make: ({ n1, d1, d2, C, now, used }) => ({
      question: `A water tank holds ${commas(C)} litres when full. It is ${n1}/${d1} full. A school then uses 1/${d2} of the water in the tank.`,
      parts: [
        { prompt: 'How many litres are in the tank at first?', answer: now, unit: 'litres', hint: `Find ${n1}/${d1} of the full tank.`, wrong: [[C - now, 'That is the empty space, not the water.']] },
        { prompt: 'How many litres does the school use?', answer: used, unit: 'litres', hint: `Take 1/${d2} of the water in the tank, not of the full tank.`, wrong: [[C / d2, `That is 1/${d2} of the full tank. The school uses a fraction of the water that is there.`]] },
        { prompt: 'How many litres are left in the tank?', answer: now - used, unit: 'litres', hint: 'Take the litres used away from the litres at first.', wrong: [[used, 'That is what was used. The question asks what is left.']] },
      ],
      steps: [`At first: ${n1}/${d1} of ${commas(C)} = ${commas(now)} litres.`, `Used: 1/${d2} of ${commas(now)} = ${commas(used)} litres.`, `Left: ${commas(now)} − ${commas(used)} = ${commas(now - used)} litres.`],
    }),
    check: ({ C, d1, d2, n1 }, v) => v[0] * d1 === C * n1 && v[1] * d2 === v[0] && v[2] + v[1] === v[0] }),

  fam({ id: 'g8.frac.divide-first-spot', skill: 'G8_FRACTIONS_COMBINED', outcome: 'G8.FRAC.a', rung: 3, form: 'spot',
    draw: () => {
      const [a, b] = pick([[3, 4], [5, 6], [4, 5], [2, 3], [7, 8], [5, 4], [3, 2]]), [c, d] = pick([[1, 2], [1, 3], [2, 3], [3, 4], [1, 4]]), [e, f] = pick([[2, 3], [3, 2], [4, 3], [3, 5], [5, 3], [2, 5]]);
      if (e === f || a === b) return null;
      const [rn, rd] = simp(c * f, d * e);                // correct c/d ÷ e/f
      const [wn, wd] = simp(c * e, d * f);                // child's c/d × e/f
      const [sn, sd] = simp(a * wd - wn * b, b * wd);     // child's answer
      if (a * wd - wn * b <= 0 || sd === 1 || rd === 1 || (wn === rn && wd === rd) || (wn === wd) || (sn === sd)) return null;
      if (a * rd - rn * b <= 0) return null;
      return { a, b, c, d, e, f, wn, wd, rn, rd, sn, sd, p: person() };
    },
    make: ({ a, b, c, d, e, f, wn, wd, sn, sd, p }) => ({
      question: `${p.name} works out ${a}/${b} − ${c}/${d} ÷ ${e}/${f}. Which step has the mistake?`,
      working: [
        { text: `Division first: ${c}/${d} ÷ ${e}/${f} = ${c}/${d} × ${e}/${f}`, ok: false },
        { text: `${c}/${d} × ${e}/${f} = ${wn}/${wd}`, ok: simp(c * e, d * f).join('/') === `${wn}/${wd}` },
        { text: `${a}/${b} − ${wn}/${wd} = ${sn}/${sd}`, ok: simp(a * wd - wn * b, b * wd).join('/') === `${sn}/${sd}` },
        { text: `Answer: ${sn}/${sd}`, ok: true },
      ],
      fix: `To divide by ${e}/${f}, turn it upside down and multiply by ${f}/${e}. The child multiplied by ${e}/${f}.`,
      steps: ['Do the division before the subtraction.', 'To divide by a fraction, multiply by its reciprocal.'],
    }) }),

  fam({ id: 'g8.frac.day-table', skill: 'G8_FRACTIONS_COMBINED', outcome: 'G8.FRAC.a', rung: 2, form: 'table',
    draw: () => {
      const fr = [pick([[1, 2], [1, 3], [2, 5], [3, 8], [1, 4]]), pick([[1, 12], [1, 10], [1, 8], [1, 6]]), pick([[1, 12], [1, 10], [1, 8], [1, 16]])];
      if (fr[1][1] === fr[2][1]) return null;
      const used = fr.reduce((s, [n, d]) => s + n / d, 0);
      const mins = round(480 * (1 - used), 6); const minsUsed = 480 - mins;
      const cands = [mins, minsUsed, round(8 * (1 - used), 2), Math.round(480 * (1 - fr[0][0] / fr[0][1] - fr[1][0] / fr[1][1]))];
      return Number.isInteger(mins) && distinct(...cands) ? { fr, mins, minsUsed } : null;
    },
    make: ({ fr, mins, minsUsed }) => {
      const used = fr.reduce((s, [n, d]) => s + n / d, 0);
      return { question: 'A school day is 8 hours long. The table shows the fraction of the day for each activity. The rest of the day is for clubs. How many minutes are for clubs?',
        model: { type: 'table', data: { head: ['Activity', 'Fraction of the day'], rows: [{ label: 'Lessons', value: `${fr[0][0]}/${fr[0][1]}` }, { label: 'Games', value: `${fr[1][0]}/${fr[1][1]}` }, { label: 'Meals and breaks', value: `${fr[2][0]}/${fr[2][1]}` }, { label: 'Clubs', value: 'the rest' }] } },
        answer: mins,
        wrong: [[minsUsed, 'That is the time used by the three activities. Clubs have the rest.'], [round(8 * (1 - used), 2), 'The answer must be in minutes. Change the 8 hours to minutes first.'], [Math.round(480 * (1 - fr[0][0] / fr[0][1] - fr[1][0] / fr[1][1])), 'Meals and breaks take time too. Take that fraction away as well.']],
        hints: ['Change 8 hours to minutes.', 'Find the three fractions in minutes, then take them from the whole day.'],
        steps: ['8 hours = 480 minutes.', `Lessons: ${round(480 * fr[0][0] / fr[0][1], 2)} min. Games: ${round(480 * fr[1][0] / fr[1][1], 2)} min. Meals and breaks: ${round(480 * fr[2][0] / fr[2][1], 2)} min.`, `Clubs: 480 − ${minsUsed} = ${mins} minutes.`] };
    },
    check: ({ fr, mins }, a) => Math.abs(a / 480 + fr.reduce((s, [n, d]) => s + n / d, 0) - 1) < 1e-9 }),

  // ======================================================== DECIMALS
  fam({ id: 'g8.dec.recurring-why', skill: 'G8_RECURRING_DECIMALS', outcome: 'G8.DEC.a', rung: 2, form: 'why',
    draw: () => { const den = pick([12, 14, 15, 18, 21, 22, 24, 33]); const n = randInt(1, den - 1); return gcd(n, den) === 1 ? { n, den } : null; },
    make: ({ n, den }) => {
      let q = den; for (const f of [2, 5]) while (q % f === 0) q /= f;
      const prime = (() => { for (let f = 3; f <= q; f += 2) if (q % f === 0) return f; return q; })();
      return { question: `A calculator shows that ${n}/${den} is a recurring decimal. Why does it never stop?`,
        options: [
          { text: `${den} has a prime factor ${prime}, not only 2 and 5`, right: q > 1 },
          { text: `The top number is smaller than the bottom number`, right: false, why: 'Every proper fraction is like that, and 3/4 = 0.75 stops.' },
          { text: `${den} is bigger than 10, so the decimal never stops`, right: false, why: '1/20 = 0.05 stops, and 20 is bigger than 10.' },
          { text: 'Every fraction gives a recurring decimal in the end', right: false, why: 'Not so. 1/2 = 0.5 and 3/4 = 0.75 both stop.' },
        ],
        hints: [`Break ${den} into prime factors.`, 'A decimal stops only if the bottom number is made of 2s and 5s.'],
        steps: [`${den} = ${(() => { const f = []; let m = den; for (let k = 2; m > 1; k++) while (m % k === 0) { f.push(k); m /= k; } return f.join(' × '); })()}.`, `A factor of ${prime} is not 2 or 5, so the division never ends and the digits repeat.`] };
    } }),

  fam({ id: 'g8.dec.recurring-steps', skill: 'G8_RECURRING_DECIMALS', outcome: 'G8.DEC.a', rung: 3, form: 'steps',
    draw: () => { const ab = randInt(12, 98); return ab % 11 === 0 || gcd(ab, 99) === 1 ? null : { ab }; },
    make: ({ ab }) => {
      const g = gcd(ab, 99);
      return { question: `Let x = 0.${ab}${ab}${ab}... where the digits ${ab} repeat for ever. You want to write x as a fraction. Follow the method.`,
        parts: [
          { prompt: 'The repeating block has 2 digits. What do you multiply x by so the blocks line up?', answer: 100, hint: 'Move the point past one whole block of digits.', wrong: [[10, 'That moves the point one place. A block has 2 digits.']] },
          { prompt: `Take x away from your new line. What whole number is 100x − x?`, answer: ab, hint: 'The repeating digits cancel and only one block is left.', wrong: [[99, '99 tells how many x you have. Its value is the block of digits.']] },
          { prompt: `So 99x = ${ab}. What is the highest common factor of ${ab} and 99?`, answer: g, hint: `List the factors of ${ab} and of 99.`, wrong: [[1, 'The two numbers share a bigger factor. Look again.'], [99, '99 does not divide into the smaller number.']] },
          { prompt: 'Divide the top and bottom of the fraction by that factor. What is the denominator of x in simplest form?', answer: 99 / g, hint: 'x = block ÷ 99, then divide both by the factor.', wrong: [[99, 'That is the fraction before simplifying.'], [ab / g, 'That is the numerator. The question asks for the bottom number.']] },
        ],
        steps: ['100x = block.block block... and x = 0.block block..., so 100x − x = the block.', `99x = ${ab}, so x = ${ab}/99.`, `Divide by ${g}: x = ${ab / g}/${99 / g}.`] };
    },
    check: ({ ab }, v) => v[0] === 100 && v[1] === ab && gcd(v[1], 99) === v[2] && Math.abs(ab / 99 - (ab / v[2]) / v[3]) < 1e-12 }),

  fam({ id: 'g8.dec.cloth-profit', skill: 'G8_DECIMALS_COMBINED', outcome: 'G8.DEC.b', rung: 2, form: 'word',
    draw: () => {
      const len = pick([1.5, 1.75, 2.25]), rate = pick([120, 160, 200, 240]), n = randInt(4, 8), cost = round(len * rate, 2);
      const sell = Math.ceil(cost / 100) * 100 + 100 * randInt(1, 4); const profit = n * (sell - cost);
      return distinct(profit, n * sell, n * cost, sell - cost, n * (sell - rate)) ? { len, rate, n, cost, sell, profit, p: person() } : null;
    },
    make: ({ len, rate, n, cost, sell, profit, p }) => ({
      question: `${p.name} is a tailor. ${p.She} makes ${n} dresses. Each dress uses ${len} metres of cloth. The cloth costs sh ${rate} a metre. ${p.She} sells each dress for sh ${commas(sell)}. How much profit does ${p.she} make altogether, in shillings?`,
      answer: profit,
      wrong: [[n * sell, 'That is the money from selling. Take away what the cloth cost.'], [n * cost, 'That is only the cost of the cloth. Profit is money in minus money spent.'], [sell - cost, 'That is the profit on one dress. How many dresses are there?'], [n * (sell - rate), 'Each dress uses more than 1 metre of cloth. Use the length for the cost of one dress.']],
      hints: ['First find the cost of the cloth for one dress.', 'Profit on one dress = selling price − cost. Then multiply.'],
      steps: [`Cloth for one dress: ${len} × ${rate} = sh ${cost}.`, `Profit on one dress: ${sell} − ${cost} = sh ${round(sell - cost, 2)}.`, `For ${n} dresses: ${n} × ${round(sell - cost, 2)} = sh ${profit}.`],
    }),
    check: ({ n, cost, sell, len, rate }, a) => a / n + len * rate === sell && cost === len * rate }),

  fam({ id: 'g8.dec.point-spot', skill: 'G8_DECIMALS_COMBINED', outcome: 'G8.DEC.b', rung: 2, form: 'spot',
    draw: () => { const B = randInt(11, 39), C = randInt(11, 39); if (B % 10 === 0 || C % 10 === 0) return null; return { a: randInt(21, 99) / 10, B, C, p: person() }; },
    make: ({ a, B, C, p }) => {
      const b = B / 10, c = C / 10, right = round(b * c, 2), shown = round((B * C) / 10, 1);
      return { question: `${p.name} works out ${a} + ${b} × ${c}. Which step has the mistake?`,
        working: [
          { text: `Multiply first. Ignore the points: ${B} × ${C} = ${B * C}.`, ok: true },
          { text: `So ${b} × ${c} = ${shown}.`, ok: shown === right },
          { text: `Then add: ${a} + ${shown} = ${round(a + shown, 2)}.`, ok: true },
          { text: `Answer: ${round(a + shown, 2)}.`, ok: true },
        ],
        fix: `${b} has 1 decimal place and ${c} has 1, so the answer needs 2 decimal places, not 1. The point goes 2 places from the right in ${B * C}.`,
        steps: ['Multiply before you add.', 'Count the decimal places in both numbers and put that many in the answer.'] };
    } }),

  fam({ id: 'g8.dec.sf-spot', skill: 'G8_STANDARD_FORM', outcome: 'G8.DEC.d', rung: 2, form: 'spot',
    draw: () => { const sig = randInt(11, 99) / 10; if (Number.isInteger(sig)) return null; return { sig, k: randInt(4, 7), p: person() }; },
    make: ({ sig, k, p }) => {
      const N = Math.round(sig * 10) * 10 ** (k - 1), shown = k + 1;
      return { question: `${p.name} writes the sh ${commas(N)} raised at a harambee in standard form. Which step has the mistake?`,
        working: [
          { text: `Put a point after the first digit of ${commas(N)}: ${sig}.`, ok: true },
          { text: `The point has moved ${shown} places.`, ok: shown === k },
          { text: `So ${commas(N)} = ${sig} × 10^${shown}.`, ok: true },
          { text: `Answer: ${sig} × 10^${shown}.`, ok: true },
        ],
        fix: `The power of 10 is the number of places the point moves. Here it moves ${k} places, not the ${shown} digits in the number.`,
        steps: ['Count how far the point moves.', 'That count is the power of 10.'] };
    } }),

  fam({ id: 'g8.dec.sf-product-steps', skill: 'G8_STANDARD_FORM', outcome: 'G8.DEC.d', rung: 3, form: 'steps',
    draw: () => { const a = randInt(2, 9), b = randInt(2, 9); return a * b >= 10 ? { a, b, m: pick([3, 4]), n: pick([2, 3]) } : null; },
    make: ({ a, b, m, n }) => ({
      question: `A county has ${a} × 10^${m} households. Each household pays ${b} × 10^${n} shillings a year for water. Find the total paid, in standard form.`,
      parts: [
        { prompt: `What is ${a} × ${b}?`, answer: a * b, hint: 'Multiply the two front numbers.', wrong: [[a + b, 'The households and the payment are multiplied, not added.']] },
        { prompt: `Multiplying 10^${m} by 10^${n} gives 10 to which power?`, answer: m + n, hint: 'When you multiply powers of 10, add the powers.', wrong: [[m * n, 'Powers are added when you multiply, not multiplied.']] },
        { prompt: `The total is ${a * b} × 10^${m + n}. In standard form the front number is between 1 and 10. What is the new power of 10?`, answer: m + n + 1, hint: `${a * b} is 10 times a number between 1 and 10.`, wrong: [[m + n, `${a * b} is too big to be a front number. Move one factor of 10 into the power.`]] },
        { prompt: 'How many shillings is that, written as an ordinary number?', answer: a * b * 10 ** (m + n), unit: 'sh', hint: 'Write the front number, then that many zeros.', wrong: [[a * b * 10 ** (m + n + 1), 'Check how many zeros the power gives.']] },
      ],
      steps: [`${a} × ${b} = ${a * b}.`, `10^${m} × 10^${n} = 10^${m + n}.`, `${a * b} × 10^${m + n} = ${a * b / 10} × 10^${m + n + 1}.`, `As a number: ${commas(a * b * 10 ** (m + n))}.`],
    }),
    check: ({ a, b, m, n }, v) => v[0] === a * b && v[1] === m + n && v[2] === m + n + 1 && v[3] === a * 10 ** m * (b * 10 ** n) }),

  // ======================================================== SQUARES AND ROOTS
  fam({ id: 'g8.sq.table-shift', skill: 'G8_SQUARES_TABLES', outcome: 'G8.SQUARES.a', rung: 2, form: 'table',
    draw: () => { const s = randInt(21, 85); const ns = [0, 1, 2, 3, 4].map(i => s + i); return { ns, t: pick(ns), sh: pick([10, 100]) }; },
    make: ({ ns, t, sh }) => {
      const sq = (k) => round((k / 10) ** 2, 2), v = sq(t), K = t * (sh / 10);
      const answer = round(v * sh * sh, 2);
      return { question: `Here is part of a printed table of squares. Without a calculator, find ${commas(K)}².`,
        model: { type: 'table', data: { head: ['Number', 'Square'], rows: ns.map(k => ({ label: `${k / 10}`, value: `${sq(k)}` })) } },
        answer,
        wrong: [[v, `The table has ${t / 10}, not ${commas(K)}. Your number is ${sh} times bigger, so its square is much bigger.`], [round(v * sh, 2), `A number ${sh} times bigger has a square ${sh} × ${sh} times bigger, not ${sh} times.`], [round(v * sh * sh * 10, 2), 'The point has moved one place too far. Check how many zeros the answer needs.'], [K * 2, 'Squaring is the number times itself, not times 2.']],
        hints: [`Which number in the table has the same digits as ${commas(K)}?`, `Your number is ${sh} times bigger than the table number. How does that change its square?`],
        steps: [`The table gives ${t / 10}² = ${v}.`, `${commas(K)} is ${sh} times ${t / 10}, so its square is ${sh} × ${sh} = ${commas(sh * sh)} times ${v}.`, `Answer: ${commas(answer)}.`] };
    },
    check: ({ t, sh }, a) => a === (t * (sh / 10)) ** 2 }),

  fam({ id: 'g8.sq.root-table-shift', skill: 'G8_SQUARES_TABLES', outcome: 'G8.SQUARES.b', rung: 2, form: 'table',
    draw: () => { const N = pick([2, 3, 5, 6, 7]); return { N, sc: pick([100, 10000]) }; },
    make: ({ N, sc }) => {
      const T = { 2: 1.414, 3: 1.732, 5: 2.236, 6: 2.449, 7: 2.646 }, t = T[N], f = Math.sqrt(sc), dp = sc === 100 ? 2 : 1;
      const answer = round(t * f, dp);
      return { question: `A table of square roots to 3 decimal places is printed below. Write √${commas(N * sc)} to ${dp} decimal place${dp === 1 ? '' : 's'}.`,
        model: { type: 'table', data: { head: ['Number', 'Square root'], rows: [2, 3, 5, 6, 7].map(k => ({ label: `${k}`, value: `${T[k]}` })) } },
        answer,
        wrong: sc === 100 ? [[t, 'That is the root of the small number. The root of a number 100 times bigger is 10 times bigger.'], [round(t * 100, 1), 'A number 100 times bigger has a root only 10 times bigger.'], [N * 10, 'That multiplies the number by 10. It does not take a root.']]
          : [[t, 'That is the root of the small number. The root of a number 10,000 times bigger is 100 times bigger.'], [round(t * 10, 2), 'A number 10,000 times bigger has a root 100 times bigger, not 10.'], [round(t * 1000, 0), 'A number 10,000 times bigger has a root 100 times bigger, not 1,000.'], [N * 100, 'That multiplies the number by 100. It does not take a root.']],
        hints: [`${commas(N * sc)} = ${N} × ${commas(sc)}. Find ${N} in the table.`, `The root of ${commas(sc)} is a whole number.`],
        steps: [`${commas(N * sc)} = ${N} × ${commas(sc)}.`, `√${commas(sc)} = ${f}, and the table gives √${N} = ${t}.`, `√${commas(N * sc)} = ${t} × ${f} = ${answer}.`] };
    },
    check: ({ N, sc }, a) => Math.abs(a * a / (N * sc) - 1) < 0.01 }),

  fam({ id: 'g8.sq.between-why', skill: 'G8_SQUARES_TABLES', outcome: 'G8.SQUARES.b', rung: 2, form: 'why',
    draw: () => { const n = randInt(50, 150); const lo = Math.floor(Math.sqrt(n)); return lo * lo === n ? null : { n, lo, p: person() }; },
    make: ({ n, lo, p }) => ({
      question: `${p.name} says √${n} lies between ${lo} and ${lo + 1}. Why is that correct?`,
      options: [
        { text: `${n} is between ${lo}² = ${lo * lo} and ${lo + 1}² = ${(lo + 1) ** 2}`, right: lo * lo < n && n < (lo + 1) ** 2 },
        { text: `${n} lies between ${lo} and ${lo + 1}, so its root does too`, right: false, why: `${n} is much bigger than ${lo + 1}. Roots are compared through squares.` },
        { text: `${lo} × ${lo + 1} = ${lo * (lo + 1)}, which is close to ${n}, so that is the root`, right: false, why: 'Multiplying two neighbouring numbers is not how a root is placed. Square each end instead.' },
        { text: `A square root is found by dividing ${n} by 2, to get half`, right: false, why: 'Dividing by 2 gives a half. A root is the number that multiplies by itself to give the number.' },
      ],
      hints: ['Square the two whole numbers.', 'Compare the number under the root sign with those two squares.'],
      steps: [`${lo}² = ${lo * lo} and ${lo + 1}² = ${(lo + 1) ** 2}.`, `${lo * lo} < ${n} < ${(lo + 1) ** 2}, so ${lo} < √${n} < ${lo + 1}.`],
    }) }),

  fam({ id: 'g8.sq.tiles-cost', skill: 'G8_SQUARES_TABLES', outcome: 'G8.SQUARES.a', rung: 2, form: 'word',
    draw: () => ({ s: pick([2.5, 3.5, 4.5, 5.5]), rate: pick([600, 800, 1000]), p: person() }),
    make: ({ s, rate, p }) => ({
      question: `${p.name} tiles a square room with sides of ${s} m. The tiles cost sh ${commas(rate)} for each square metre. Work out ${s}² to find the area. How much do the tiles cost, in shillings?`,
      answer: round(s * s * rate, 2),
      wrong: [[round(4 * s * rate, 2), 'That uses the distance around the room. Tiles cover the floor, which is the area.'], [round(2 * s * rate, 2), 'A square is the side times itself, not times 2.'], [round(s * rate, 2), 'That is for a strip 1 m wide. The floor is the side times the side.']],
      hints: [`Area of a square = side × side. Work out ${s} × ${s}.`, 'Then multiply the area by the cost of each square metre.'],
      steps: [`Area: ${s}² = ${round(s * s, 2)} m².`, `Cost: ${round(s * s, 2)} × ${commas(rate)} = sh ${commas(round(s * s * rate, 2))}.`],
    }),
    check: ({ s, rate }, a) => Math.abs(Math.sqrt(a / rate) - s) < 1e-9 }),

  // ======================================================== RATES, RATIO, PERCENTAGE, PROPORTION
  fam({ id: 'g8.rates.boda-same-rate', skill: 'G8_RATIO_PROPORTION', outcome: 'G8.RATES.a', rung: 1, form: 'word',
    draw: () => { const v = pick([20, 30, 40, 50, 60]), h1 = pick([1.5, 2.5]), h2 = pick([3, 4, 5, 6]); return { v, h1, h2, km1: v * h1, p: person() }; },
    make: ({ v, h1, h2, km1, p }) => ({
      question: `${p.name} rides a boda boda for ${h1} hours and covers ${km1} km. At the same rate, how many km does ${p.she} cover in ${h2} hours?`,
      answer: v * h2,
      wrong: [[km1 * h2, 'The distance in the first trip is not the distance in one hour. Find the distance for 1 hour first.'], [v, 'That is the distance for 1 hour only. The ride lasts longer.'], [km1 + h2, 'Distance is not found by adding hours to kilometres. Use the rate.']],
      hints: ['Find how far the rider goes in 1 hour.', 'Then multiply by the number of hours.'],
      steps: [`In 1 hour: ${km1} ÷ ${h1} = ${v} km.`, `In ${h2} hours: ${v} × ${h2} = ${v * h2} km.`],
    }),
    check: ({ km1, h1, h2 }, a) => a / h2 === km1 / h1 }),

  fam({ id: 'g8.rates.pump-steps', skill: 'G8_RATIO_PROPORTION', outcome: 'G8.RATES.a', rung: 2, form: 'steps',
    draw: () => { const r = pick([10, 12, 15, 20, 25]), t0 = pick([3, 4, 5]), k = randInt(8, 30), have = randInt(2, 12) * 50; return { r, t0, k, have, need: r * k, C: have + r * k }; },
    make: ({ r, t0, k, have, need, C }) => ({
      question: `A pump fills a water tank at a steady rate. The tank holds ${commas(C)} litres and has ${have} litres in it now. In ${t0} minutes the pump puts in ${r * t0} litres.`,
      parts: [
        { prompt: 'How many more litres are needed to fill the tank?', answer: need, unit: 'litres', hint: 'Take what is in the tank from what it holds.', wrong: [[C, 'The tank already has some water. Take that away.']] },
        { prompt: 'What is the rate of the pump, in litres per minute?', answer: r, unit: 'litres per minute', hint: `Share the litres by the minutes: ${r * t0} ÷ ${t0}.`, wrong: [[r * t0, 'That is the litres in the whole time. How many in 1 minute?']] },
        { prompt: 'How many minutes does the pump need to fill the tank?', answer: k, unit: 'minutes', hint: 'Litres needed ÷ litres each minute.', wrong: [[need * r, 'To find the time you divide the litres by the rate.'], [C / r, 'The tank is not empty. Use the litres still needed.']] },
      ],
      steps: [`Litres needed: ${commas(C)} − ${have} = ${commas(need)}.`, `Rate: ${r * t0} ÷ ${t0} = ${r} litres per minute.`, `Time: ${commas(need)} ÷ ${r} = ${k} minutes.`],
    }),
    check: ({ C, have, r, t0 }, v) => v[0] + have === C && v[1] * t0 === r * t0 && v[2] * v[1] === v[0] }),

  fam({ id: 'g8.rates.sugar-table', skill: 'G8_RATIO_PROPORTION', outcome: 'G8.RATES.a', rung: 2, form: 'table',
    draw: () => {
      const us = [150, 160, 170, 180, 190, 200]; const u = []; while (u.length < 3) { const x = pick(us); if (!u.includes(x)) u.push(x); }
      const kg = [2, 5, 10].sort(() => Math.random() - 0.5);
      const best = u.indexOf(Math.min(...u));
      return kg[best] === 2 ? null : { u, kg, best };
    },
    make: ({ u, kg, best }) => {
      const names = ['Shop A', 'Shop B', 'Shop C'], tot = u.map((x, i) => x * kg[i]), cheap = tot.indexOf(Math.min(...tot));
      const other = [0, 1, 2].find(i => i !== best && i !== cheap);
      return { question: 'Three shops sell the same sugar in different packs. The table shows each pack. Which shop sells sugar at the lowest price per kg?',
        model: { type: 'table', data: { head: ['Shop', 'Pack (kg)', 'Price (sh)'], rows: names.map((n, i) => ({ cells: [n, `${kg[i]}`, `${commas(tot[i])}`] })) } },
        options: names.map((n, i) => ({ text: n, right: i === best, why: i === cheap ? 'That pack has the lowest price, but it holds the least sugar. Compare the price of 1 kg.' : 'Work out the price of 1 kg for each shop. Dividing the price by the kg gives it.' })),
        hints: ['The packs are different sizes, so you cannot compare the prices as they are.', 'Divide each price by the kg to find the price per kg.'],
        steps: names.map((n, i) => `${n}: ${commas(tot[i])} ÷ ${kg[i]} = sh ${u[i]} per kg.`).concat([`The lowest is ${names[best]}.`]) };
    } }),

  fam({ id: 'g8.ratio.class-table', skill: 'G8_RATIO_PROPORTION', outcome: 'G8.RATES.c', rung: 2, form: 'table',
    draw: () => {
      const [a, b] = pick([[2, 3], [3, 5], [3, 4], [4, 5], [2, 5], [3, 7]]);
      const ks = []; while (ks.length < 3) { const k = randInt(3, 9); if (!ks.includes(k)) ks.push(k); }
      const rows = [[a * ks[0], b * ks[0]], [b * ks[1], a * ks[1]], [a * ks[2] + 2, b * ks[2]]];
      const ok = rows.map(([x, y]) => x * b === y * a);
      if (ok.filter(Boolean).length !== 1) return null;
      const order = [0, 1, 2].sort(() => Math.random() - 0.5);
      return { a, b, rows: order.map(i => rows[i]), swapped: order.indexOf(1) };
    },
    make: ({ a, b, rows, swapped }) => {
      const names = ['8 North', '8 South', '8 East'];
      return { question: `The table shows the number of boys and girls in three classes. Which class has boys to girls in the ratio ${a}:${b}?`,
        model: { type: 'table', data: { head: ['Class', 'Boys', 'Girls'], rows: names.map((n, i) => ({ cells: [n, `${rows[i][0]}`, `${rows[i][1]}`] })) } },
        options: names.map((n, i) => ({ text: `Class ${n}`, right: rows[i][0] * b === rows[i][1] * a, why: i === swapped ? 'That class has the numbers the other way round: girls to boys. Read the order in the question.' : 'Divide both numbers by their common factor. The boys to girls ratio does not match.' })),
        hints: ['Boys come first in the ratio, then girls.', 'Divide the boys and the girls in each class by the same number to simplify.'],
        steps: rows.map(([x, y], i) => `${names[i]}: ${x} : ${y} = ${x / gcd(x, y)} : ${y / gcd(x, y)}.`).concat([`The class with ${a}:${b} is the answer.`]) };
    } }),

  fam({ id: 'g8.ratio.mix-why', skill: 'G8_RATIO_PROPORTION', outcome: 'G8.RATES.c', rung: 3, form: 'why',
    draw: () => {
      const a = randInt(4, 9), c = randInt(a + 2, 12), b = randInt(2, a - 1), d = randInt(3, c - 1);
      const L = (c * d) / gcd(c, d);
      return b * c > a * d && L <= 60 && c !== d ? { a, b, c, d, L } : null;
    },
    make: ({ a, b, c, d, L }) => {
      const strong = a * d > b * c ? 'A' : 'B';
      const [sa, sb] = [a * L / c, b * L / d];
      return { question: `Cement and sand are mixed for mortar. Mix A has cement to sand in the ratio ${a}:${c}. Mix B has the ratio ${b}:${d}. Which mix has more cement for each bag of sand, and why?`,
        options: [
          { text: `Mix ${strong}. With ${L} bags of sand each, it has more cement`, right: strong === (sa > sb ? 'A' : 'B') },
          { text: `Mix ${strong === 'A' ? 'B' : 'A'}, because its cement number is the bigger one`, right: false, why: 'That compares the cement only. The sand is different in each mix, so the ratios must be compared on the same amount of sand.' },
          { text: `Mix ${strong === 'A' ? 'B' : 'A'}, because it makes the bigger batch of mortar`, right: false, why: 'The size of the batch is not what is asked. The question is how much cement for each bag of sand.' },
          { text: 'Both are the same, because each has more sand than cement', right: false, why: 'Make the sand equal in both mixes and the cement amounts are different.' },
        ],
        hints: ['Make the sand the same amount in both mixes.', 'Then compare the bags of cement.'],
        steps: [`Both ratios can be written with ${L} bags of sand: ${a}:${c} = ${sa}:${L} and ${b}:${d} = ${sb}:${L}.`, `Compare the cement: ${sa} and ${sb}.`] };
    } }),

  fam({ id: 'g8.ratio.rope-units', skill: 'G8_RATIO_PROPORTION', outcome: 'G8.RATES.c', rung: 2, form: 'word',
    draw: () => { const m = pick([2, 3, 4, 5]), s = pick([20, 25, 40, 50]); if ((100 * m) % s !== 0 || (100 * m) / s < 4) return null; const n = (100 * m) / s - 1; return { m, s, n, p: person() }; },
    make: ({ m, s, n, p }) => ({
      question: `${p.name} cuts a ${m} m rope into two pieces. The short piece is ${s} cm. The ratio of the short piece to the long piece is 1 : n. Find n.`,
      answer: n,
      wrong: [[n + 1, 'That compares the short piece with the whole rope. The long piece is what is left.'], [round((1000 * m - s) / s, 2), 'There are 100 cm in 1 m, not 1,000.'], [100 * m - s, 'That is the length of the long piece in cm. The ratio compares it with the short piece.']],
      hints: ['Change the metres to centimetres first.', `Find the long piece, then divide it by ${s}.`],
      steps: [`${m} m = ${100 * m} cm.`, `Long piece: ${100 * m} − ${s} = ${100 * m - s} cm.`, `${100 * m - s} ÷ ${s} = ${n}, so the ratio is 1 : ${n}.`],
    }),
    check: ({ m, s }, a) => s * (1 + a) === 100 * m }),

  fam({ id: 'g8.ratio.three-way-share', skill: 'G8_RATIO_PROPORTION', outcome: 'G8.RATES.e', rung: 2, form: 'word',
    draw: () => {
      const r = pick([[2, 3, 5], [1, 2, 3], [2, 3, 4], [3, 4, 5], [1, 3, 4]]), u = randInt(2, 9) * 100;
      const [a, b] = twoPeople(); let c = person(); while (c.name === a.name || c.name === b.name) c = person();
      return { r, u, total: u * (r[0] + r[1] + r[2]), a, b, c };
    },
    make: ({ r, u, total, a, b, c }) => ({
      question: `${a.name}, ${b.name} and ${c.name} start a chama business. They share the profit of sh ${commas(total)} in the ratio ${r[0]}:${r[1]}:${r[2]}. How much more than ${a.name} does ${c.name} get, in shillings?`,
      answer: u * (r[2] - r[0]),
      wrong: [[u * r[2], `That is ${c.name}'s share. The question asks how much more than ${a.name}.`], [r[2] - r[0], 'That is the difference in parts. Each part is worth some shillings.'], [u * (r[2] - r[1]), `That compares ${c.name} with ${b.name}.`], [total / r[2], `${c.name} gets ${r[2]} parts, not 1 part.`]],
      hints: ['Add the parts of the ratio to find how many equal shares there are.', 'Find the value of one part, then the two shares.'],
      steps: [`Parts: ${r[0]} + ${r[1]} + ${r[2]} = ${r[0] + r[1] + r[2]}.`, `One part: ${commas(total)} ÷ ${r[0] + r[1] + r[2]} = sh ${u}.`, `Difference: (${r[2]} − ${r[0]}) × ${u} = sh ${commas(u * (r[2] - r[0]))}.`],
    }),
    check: ({ r, total }, x) => x * (r[0] + r[1] + r[2]) === total * (r[2] - r[0]) }),

  fam({ id: 'g8.ratio.one-part-known', skill: 'G8_RATIO_PROPORTION', outcome: 'G8.RATES.e', rung: 2, form: 'word',
    draw: () => { const [g, s] = pick([[3, 5], [2, 5], [3, 4], [2, 3], [4, 7]]), k = randInt(3, 12); return { g, s, k, p: person() }; },
    make: ({ g, s, k, p }) => ({
      question: `${p.name} keeps goats and sheep in the ratio ${g}:${s}. There are ${s * k} sheep. How many animals does ${p.she} keep altogether?`,
      answer: (g + s) * k,
      wrong: [[g * k, 'That is the number of goats only. Add the sheep.'], [s * k + g, 'The ratio number for goats is not the number of goats. Find what one part is worth.'], [(g + s) * s * k, 'The sheep are already counted in the amount given. Find one part first.']],
      hints: ['Find how many animals are in one part of the ratio.', 'Then count all the parts.'],
      steps: [`${s} parts are ${s * k} sheep, so 1 part is ${s * k} ÷ ${s} = ${k} animals.`, `Altogether there are ${g} + ${s} = ${g + s} parts.`, `${g + s} × ${k} = ${(g + s) * k} animals.`],
    }),
    check: ({ g, s, k }, a) => a * s === (g + s) * s * k }),

  fam({ id: 'g8.ratio.increase-flour', skill: 'G8_RATIO_PROPORTION', outcome: 'G8.RATES.f', rung: 2, form: 'word',
    draw: () => { const [big, small] = pick([[5, 4], [3, 2], [7, 5], [6, 5], [4, 3]]), k = randInt(2, 9) * 10; return { big, small, base: small * k, p: person() }; },
    make: ({ big, small, base, p }) => ({
      question: `${p.name} bakes with ${base} g of flour. For a big order ${p.she} increases the flour in the ratio ${big}:${small}, new amount to old amount. How many grams of flour does ${p.she} now use?`,
      answer: (base * big) / small,
      wrong: [[(base * small) / big, 'That makes the amount smaller. An increase gives more, so the bigger ratio number goes on top.'], [base + big, 'A ratio is not a number to add. It tells how many times as much, new to old.'], [base * big, 'First divide by the old number, to find what one part is.']],
      hints: ['New : old is the same as the bigger number : the smaller number.', 'Find one part of the old amount, then multiply by the new number.'],
      steps: [`Old amount = ${small} parts, so 1 part = ${base} ÷ ${small} = ${base / small} g.`, `New amount = ${big} parts = ${big} × ${base / small} = ${(base * big) / small} g.`],
    }),
    check: ({ base, big, small }, a) => a * small === base * big }),

  fam({ id: 'g8.ratio.decrease-rent', skill: 'G8_RATIO_PROPORTION', outcome: 'G8.RATES.f', rung: 2, form: 'word',
    draw: () => { const [nw, old] = pick([[5, 6], [4, 5], [3, 4], [7, 8], [9, 10]]), rent = old * pick([500, 1000, 1500, 2000]); return rent >= 6000 && rent <= 30000 ? { nw, old, rent } : null; },
    make: ({ nw, old, rent }) => ({
      question: `A landlord decreases a rent of ${sh(rent)} a month in the ratio ${nw}:${old}. This is the new rent to the old rent. What is the new rent, in shillings?`,
      answer: (rent * nw) / old,
      wrong: [[(rent * old) / nw, 'That would make the rent go up. A decrease means the new rent is smaller.'], [rent / old, `That is the value of 1 part. The new rent is ${nw} parts.`], [rent - (old - nw), 'The ratio does not take shillings away. It says how many parts of the old rent are left.']],
      hints: [`The old rent is ${old} parts.`, `The new rent is ${nw} of those parts.`],
      steps: [`1 part = ${commas(rent)} ÷ ${old} = ${commas(rent / old)}.`, `New rent = ${nw} × ${commas(rent / old)} = ${commas((rent * nw) / old)}.`],
    }),
    check: ({ rent, nw, old }, a) => a * old === rent * nw }),

  fam({ id: 'g8.ratio.fare-steps', skill: 'G8_RATIO_PROPORTION', outcome: 'G8.RATES.f', rung: 3, form: 'steps',
    draw: () => { const [big, small] = pick([[7, 5], [6, 5], [5, 4], [3, 2]]), u = randInt(2, 8) * 4; return { big, small, u, old: small * u }; },
    make: ({ big, small, u, old }) => ({
      question: `A matatu fare is sh ${old}. The company increases it in the ratio ${big}:${small}, new fare to old fare.`,
      parts: [
        { prompt: `The old fare is ${small} parts. How many shillings is 1 part?`, answer: u, unit: 'sh', hint: `${old} ÷ ${small}`, wrong: [[old * small, 'To find one part, divide the old fare by its number of parts.']] },
        { prompt: 'What is the new fare?', answer: u * big, unit: 'sh', hint: `The new fare is ${big} parts.`, wrong: [[old + big, 'The new fare is parts of the old one, not the old fare plus the ratio number.']] },
        { prompt: 'By how many shillings has the fare gone up?', answer: u * (big - small), unit: 'sh', hint: 'New fare take away old fare.', wrong: [[big - small, 'That is the rise in parts. What is each part worth?']] },
        { prompt: 'What is the percentage increase?', answer: (100 * (big - small)) / small, unit: '%', hint: 'Rise ÷ old fare × 100.', wrong: [[(100 * (big - small)) / big, 'The rise is measured against the old fare, not the new one.']] },
      ],
      steps: [`1 part = ${old} ÷ ${small} = ${u}.`, `New fare = ${big} × ${u} = ${u * big}.`, `Rise = ${u * big} − ${old} = ${u * (big - small)}.`, `Increase = ${u * (big - small)} ÷ ${old} × 100 = ${(100 * (big - small)) / small}%.`],
    }),
    check: ({ big, small, old }, v) => v[0] * small === old && v[1] * small === old * big && v[2] + old === v[1] && Math.abs(old * (1 + v[3] / 100) - v[1]) < 1e-9 }),

  fam({ id: 'g8.ratio.increase-why', skill: 'G8_RATIO_PROPORTION', outcome: 'G8.RATES.f', rung: 3, form: 'why',
    draw: () => { const [big, small] = pick([[7, 6], [5, 4], [4, 3], [6, 5]]); return { big, small, base: small * randInt(5, 20), p: person() }; },
    make: ({ big, small, base, p }) => ({
      question: `${p.name} must increase ${base} in the ratio ${big}:${small}. ${p.She} works out ${base} × ${small}/${big}. Why is that wrong?`,
      options: [
        { text: `An increase must give more than ${base}, so multiply by ${big}/${small}`, right: big > small },
        { text: `${base} × ${small}/${big} is correct, because it uses the ratio`, right: false, why: `It gives a number smaller than ${base}. An increase must give a bigger number.` },
        { text: `${p.She} should add ${big} to ${base}, because the ratio is ${big}:${small}`, right: false, why: 'A ratio is not a number to add. It says what to multiply by.' },
        { text: `${p.She} should divide ${base} by ${big} and then by ${small}`, right: false, why: 'That divides twice and makes the number far too small.' },
      ],
      hints: ['Will the answer be more than or less than the starting number?', 'For an increase, the bigger ratio number goes on top.'],
      steps: [`Increase means the new amount is bigger, so multiply by ${big}/${small}.`, `${base} × ${big}/${small} = ${(base * big) / small}.`],
    }) }),

  fam({ id: 'g8.pct.fare-change', skill: 'G8_PERCENTAGE_CHANGE', outcome: 'G8.RATES.g', rung: 2, form: 'word',
    draw: () => {
      const old = pick([80, 120, 160, 200, 240, 300, 400]), pc = pick([10, 15, 20, 25, 30, 40, 50]), up = Math.random() < 0.5;
      const nw = old * (up ? 100 + pc : 100 - pc) / 100;
      const diff = Math.abs(nw - old);
      return distinct(pc, diff, round((diff / nw) * 100, 1), round((nw / old) * 100, 1)) ? { old, nw, pc, up, diff, p: person() } : null;
    },
    make: ({ old, nw, pc, up, diff }) => ({
      question: `A matatu fare from Nairobi to Thika ${up ? 'goes up' : 'comes down'} from ${sh(old)} to ${sh(nw)}. What is the percentage ${up ? 'increase' : 'decrease'}?`,
      answer: pc,
      wrong: [[diff, `That is the change in shillings. A percentage compares the change with the old fare, out of 100.`], [round((diff / nw) * 100, 1), 'A percentage change is measured against the fare you started with, not the new one.'], [round((nw / old) * 100, 1), 'That is the new fare as a percentage of the old fare. Take 100% away to get the change.']],
      hints: ['First find the change in shillings.', 'Divide the change by the fare you started with, then multiply by 100.'],
      steps: [`Change: ${Math.abs(nw - old)} shillings.`, `${Math.abs(nw - old)} ÷ ${old} × 100 = ${pc}%.`],
    }),
    check: ({ old, nw, up }, a) => Math.abs(old * (up ? 1 + a / 100 : 1 - a / 100) - nw) < 1e-9 }),

  fam({ id: 'g8.pct.before-change', skill: 'G8_PERCENTAGE_CHANGE', outcome: 'G8.RATES.g', rung: 3, form: 'word',
    draw: () => {
      const up = Math.random() < 0.5, pc = pick([10, 20, 25, 30, 40]), item = up ? 'bicycle' : 'school bag', orig = price(item);
      const final = (orig * (up ? 100 + pc : 100 - pc)) / 100;
      const wrongA = up ? (final * (100 - pc)) / 100 : (final * (100 + pc)) / 100, wrongB = up ? final - pc : final + pc, wrongC = (final * pc) / 100;
      return Number.isInteger(final) && Number.isInteger(wrongA) && Number.isInteger(wrongC) && distinct(orig, wrongA, wrongB, wrongC) ? { up, pc, item, orig, final, wrongA, wrongB, wrongC } : null;
    },
    make: ({ up, pc, item, orig, final, wrongA, wrongB, wrongC }) => ({
      question: `${up ? `After a price rise of ${pc}%` : `In a sale, a ${pc}% discount is taken off a ${item}. It now costs`} ${up ? `a ${item} costs` : ''} ${sh(final)}. What was the price before the ${up ? 'rise' : 'sale'}, in shillings?`.replace(/\s+/g, ' ').replace(' .', '.'),
      answer: orig,
      wrong: [[wrongA, `The ${pc}% was taken from the old price, not from ${up ? 'this' : 'the new'} price. Do not ${up ? 'take' : 'add'} ${pc}% of the new price.`], [wrongB, `The ${pc}% is a percentage of the price. It is not ${pc} shillings.`], [wrongC, 'That is only the amount of the change. The question asks for the whole price before.']],
      hints: [`The new price is ${up ? 100 + pc : 100 - pc}% of the old price.`, `Divide the new price by ${up ? 100 + pc : 100 - pc}, then multiply by 100.`],
      steps: [`New price = ${up ? 100 + pc : 100 - pc}% of the old price.`, `1% = ${commas(final)} ÷ ${up ? 100 + pc : 100 - pc} = ${commas(final / (up ? 100 + pc : 100 - pc))}.`, `100% = ${commas(final / (up ? 100 + pc : 100 - pc))} × 100 = ${commas(orig)}.`],
    }),
    check: ({ up, pc, final }, a) => Math.abs(a * (up ? 100 + pc : 100 - pc) / 100 - final) < 1e-9 }),

  fam({ id: 'g8.pct.enrolment-table', skill: 'G8_PERCENTAGE_CHANGE', outcome: 'G8.RATES.g', rung: 3, form: 'table',
    draw: () => {
      const v0 = randInt(10, 30) * 10, d = [randInt(1, 15) * 10, randInt(1, 15) * 10, randInt(1, 15) * 10];
      const v = [v0, v0 + d[0], v0 + d[0] + d[1], v0 + d[0] + d[1] + d[2]];
      const pc = d.map((x, i) => x / v[i]);
      const bestP = pc.indexOf(Math.max(...pc)), bestD = d.indexOf(Math.max(...d));
      return new Set(pc).size === 3 && new Set(d).size === 3 && bestP !== bestD ? { v, d, bestP, bestD } : null;
    },
    make: ({ v, d, bestP, bestD }) => {
      const yrs = [2023, 2024, 2025, 2026];
      return { question: 'The table shows the number of learners in a school each January. Between which two years was the percentage increase the greatest?',
        model: { type: 'table', data: { head: ['Year', 'Learners'], rows: yrs.map((y, i) => ({ label: `${y}`, value: `${v[i]}` })) } },
        options: [0, 1, 2].map(i => ({ text: `${yrs[i]} to ${yrs[i + 1]}`, right: i === bestP, why: i === bestD ? 'That has the biggest rise in learners, but a percentage compares the rise with the number at the start of that year.' : 'Divide the rise by the learners at the start of that period, and compare.' })),
        hints: ['For each pair of years, find the rise in learners.', 'Divide each rise by the number of learners at the start of that pair.'],
        steps: [0, 1, 2].map(i => `${yrs[i]} to ${yrs[i + 1]}: ${d[i]} ÷ ${v[i]} × 100 = ${round((d[i] / v[i]) * 100, 1)}%.`).concat([`The greatest is ${yrs[bestP]} to ${yrs[bestP + 1]}.`]) };
    } }),

  fam({ id: 'g8.prop.workers-days', skill: 'G8_RATIO_PROPORTION', outcome: 'G8.RATES.j', rung: 2, form: 'word',
    draw: () => {
      const w = pick([4, 6, 8, 10, 12, 15]), d = randInt(3, 12), w2 = pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30]);
      if (w2 === w || (w * d) % w2 !== 0) return null;
      const t = w * d / w2; return distinct(t, (d * w2) / w, w * d, d + w2 - w) && t >= 1 && (d * w2) / w === Math.round((d * w2) / w * 10) / 10 ? { w, d, w2, p: person() } : null;
    },
    make: ({ w, d, w2 }) => ({
      question: `${w} workers build a school fence in ${d} days. They all work at the same speed. How many days would ${w2} workers take to build the same fence?`,
      answer: (w * d) / w2,
      wrong: [[round((d * w2) / w, 1), 'More workers take fewer days, and fewer workers take more days. These go the opposite way, so do not multiply by the ratio of workers.'], [w * d, 'That is the total work in worker-days. Share it between the new number of workers.'], [d + w2 - w, 'Days and workers are not linked by adding. Find the total work first.']],
      hints: ['Find the total work: workers × days.', 'Share that work between the new number of workers.'],
      steps: [`Total work: ${w} × ${d} = ${w * d} worker-days.`, `With ${w2} workers: ${w * d} ÷ ${w2} = ${(w * d) / w2} days.`],
    }),
    check: ({ w, d, w2 }, a) => a * w2 === w * d }),

  fam({ id: 'g8.prop.which-inverse', skill: 'G8_RATIO_PROPORTION', outcome: 'G8.RATES.j', rung: 2, form: 'why',
    draw: () => {
      const inv = [['The number of workers and the days they take to do one job', 'More workers finish the same job in fewer days.'], ['The speed of a matatu and the time it takes for the same journey', 'A faster matatu takes less time for the same road.'], ['The number of friends sharing a fixed bill and what each pays', 'More friends means each pays less of the same bill.']];
      const dir = [['The kilograms of sugar bought and the cost', 'Twice the sugar costs twice as much, so this is direct proportion.'], ['The number of pens bought and the cost, at one price each', 'Twice the pens cost twice as much, so this is direct proportion.'], ['The age of a child and the height of the child', 'Neither doubles when the other doubles, so this is not in proportion.'], ['The number of learners in a class and the height of the classroom', 'These are not linked, so this is not in proportion.']];
      const r = pick(inv), w = dir.sort(() => Math.random() - 0.5).slice(0, 3);
      return { r, w, p: person() };
    },
    make: ({ r, w, p }) => ({
      question: `${p.name} is asked which pair of quantities is in inverse proportion. Which pair is it?`,
      options: [{ text: r[0], right: true }, ...w.map(x => ({ text: x[0], right: false, why: x[1] }))],
      hints: ['In inverse proportion, when one quantity doubles the other halves.', 'Try doubling the first quantity in each pair.'],
      steps: [`${r[1]}`, 'So when one doubles, the other halves: inverse proportion.'],
    }) }),

  fam({ id: 'g8.prop.wall-table', skill: 'G8_RATIO_PROPORTION', outcome: 'G8.RATES.j', rung: 3, form: 'table',
    draw: () => {
      const P = pick([60, 120, 240]); const ds = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].filter(x => P % x === 0 && P / x <= 60);
      const ws = ds.sort(() => Math.random() - 0.5).slice(0, 4).sort((a, b) => a - b); const bad = randInt(0, 3), off = pick([1, 2, 3, -1]);
      const days = ws.map(w => P / w); days[bad] += off;
      return days[bad] > 0 && new Set(days).size === 4 && new Set(ws).size === 4 ? { P, ws, days, bad } : null;
    },
    make: ({ P, ws, days, bad }) => ({
      question: 'The table shows the days that different numbers of workers need to build a wall. The days are in inverse proportion to the workers. One row is wrong. For how many workers is the row wrong?',
      model: { type: 'table', data: { head: ['Workers', 'Days'], rows: ws.map((w, i) => ({ label: `${w}`, value: `${days[i]}` })) } },
      options: ws.map((w, i) => ({ text: `${w} workers`, right: i === bad, why: 'In this row, workers × days gives the same total as the other rows. Check the other rows.' })),
      hints: ['In inverse proportion, workers × days is always the same number.', 'Multiply workers by days in each row.'],
      steps: ws.map((w, i) => `${w} × ${days[i]} = ${w * days[i]}.`).concat([`Three rows give ${P}. The row for ${ws[bad]} workers does not.`]),
    }) }),

  // ======================================================== ALGEBRAIC EXPRESSIONS
  fam({ id: 'g8.fact.fully-outside', skill: 'G8_FACTORIZE_COMMON', outcome: 'G8.EXPR.a', rung: 1, form: 'direct',
    draw: () => {
      const g = pick([6, 8, 9, 10, 12, 15]), h = pick([2, 3, 5].filter(x => g % x === 0)), p = randInt(2, 4), q = randInt(1, 5), v = pick(['x', 'y', 'm', 'n', 'a']);
      return gcd(p, q) === 1 && p !== q && distinct(g, h, p, q) ? { g, h, p, q, v } : null;
    },
    make: ({ g, h, p, q, v }) => ({
      question: `${g * p}${v} + ${g * q} is factorised fully as a number times a bracket. What is the number outside the bracket?`, story: false,
      answer: g,
      wrong: [[h, 'This number divides both terms, but the bracket still has a common factor inside. Look for the highest one.'], [p, `That is the number left in front of ${v} inside the bracket.`], [q, 'That is the number left after dividing the second term.']],
      hints: [`List the factors of ${g * p} and of ${g * q}.`, 'The number outside is the biggest factor they share.'],
      steps: [`The highest common factor of ${g * p} and ${g * q} is ${g}.`, `${g * p}${v} + ${g * q} = ${g}(${p}${v} + ${q}).`],
    }),
    check: ({ g, p, q }, a) => gcd(a * p, a * q) === a }),

  fam({ id: 'g8.fact.rectangle-steps', skill: 'G8_FACTORIZE_COMMON', outcome: 'G8.EXPR.a', rung: 3, form: 'steps',
    draw: () => { const g = randInt(2, 6), p = randInt(2, 4), q = randInt(1, 7), X = randInt(2, 5); return gcd(p, q) === 1 ? { g, p, q, X } : null; },
    make: ({ g, p, q, X }) => ({
      question: `A rectangle has an area of ${g * p}x + ${g * q} square metres. Factorise the area. The length is the common factor, and the width is what is left inside the bracket.`,
      parts: [
        { prompt: `What is the highest common factor of ${g * p} and ${g * q}? This is the length in metres.`, answer: g, unit: 'm', hint: `List the factors of ${g * p} and ${g * q}.`, wrong: [[1, 'There is a bigger factor that divides both numbers.']] },
        { prompt: `The width is ${p === 1 ? '' : p}x + ${q} metres. What is the width when x = ${X}?`, answer: p * X + q, unit: 'm', hint: `Put x = ${X} into the width.`, wrong: [[p + X + q, `${p}x means ${p} times x.`]] },
        { prompt: `Work out the original area ${g * p}x + ${g * q} when x = ${X}, in square metres.`, answer: g * p * X + g * q, unit: 'm²', hint: `Put x = ${X} into the area you were given.`, wrong: [[g * (p * X + q) + g, 'Multiply first, then add.']] },
      ],
      steps: [`${g * p}x + ${g * q} = ${g}(${p}x + ${q}). The length is ${g} m.`, `Width at x = ${X}: ${p} × ${X} + ${q} = ${p * X + q} m.`, `Area at x = ${X}: ${g * p} × ${X} + ${g * q} = ${g * p * X + g * q} m². This equals length × width.`],
    }),
    check: ({ g, p, q, X }, v) => v[0] === g && v[1] === p * X + q && v[2] === v[0] * v[1] && v[2] === g * p * X + g * q }),

  fam({ id: 'g8.fact.hcf-spot', skill: 'G8_FACTORIZE_COMMON', outcome: 'G8.EXPR.a', rung: 2, form: 'spot',
    draw: () => {
      const g = pick([6, 8, 9, 10, 12, 15]), h = pick([2, 3, 5].filter(x => g % x === 0)), p = randInt(2, 4), q = randInt(1, 5);
      return gcd(p, q) === 1 && p !== q ? { g, h, p, q, p0: person() } : null;
    },
    make: ({ g, h, p, q, p0 }) => {
      const A = g * p, B = g * q;
      return { question: `${p0.name} factorises ${A}x + ${B} completely. Which step has the mistake?`,
        working: [
          { text: `The numbers are ${A} and ${B}. Their highest common factor is ${h}.`, ok: h === gcd(A, B) },
          { text: `${A}x ÷ ${h} = ${A / h}x.`, ok: true },
          { text: `${B} ÷ ${h} = ${B / h}.`, ok: true },
          { text: `So ${A}x + ${B} = ${h}(${A / h}x + ${B / h}).`, ok: true },
        ],
        fix: `The highest common factor of ${A} and ${B} is ${g}, not ${h}. With ${h}, the bracket still has a common factor, so it is not fully factorised.`,
        steps: [`Find the highest common factor of the numbers.`, 'Divide each term by it.'] };
    } }),

  fam({ id: 'g8.algfrac.divide-top-spot', skill: 'G8_LINEAR_EQ_ADV', outcome: 'G8.EXPR.b', rung: 2, form: 'spot',
    draw: () => { const c = pick([2, 3, 4, 5]), al = randInt(2, 5), be = randInt(2, 6); return be === c ? null : { c, al, be, p: person() }; },
    make: ({ c, al, be, p }) => ({
      question: `${p.name} simplifies the algebraic fraction (${c * al}x + ${c * be})/${c}. Which step has the mistake?`,
      working: [
        { text: `Divide each part of the top by ${c}.`, ok: true },
        { text: `${c * al}x ÷ ${c} = ${al}x.`, ok: true },
        { text: `${c * be} ÷ ${c} = ${c * be}.`, ok: c * be === be },
        { text: `Answer: ${al}x + ${c * be}.`, ok: true },
      ],
      fix: `Every part of the top is divided by ${c}, including the number. ${c * be} ÷ ${c} = ${be}.`,
      steps: ['Divide each part of the top by the bottom number.', 'Do not leave any part undivided.'],
    }) }),

  fam({ id: 'g8.algfrac.add-why', skill: 'G8_LINEAR_EQ_ADV', outcome: 'G8.EXPR.b', rung: 2, form: 'why',
    draw: () => { const [a, b] = pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [3, 7]]); return { a, b, p: person() }; },
    make: ({ a, b, p }) => ({
      question: `${p.name} says x/${a} + x/${b} = 2x/${a + b}. Why is this wrong?`,
      options: [
        { text: 'The fractions need a common denominator first', right: true },
        { text: 'The top should be x, not 2x, because both tops are x', right: false, why: 'Both fractions do have x on top, but tops and bottoms cannot be added separately.' },
        { text: `The answer should be x/${a * b}, the product of the bottoms`, right: false, why: `The bottom number is ${a * b} only after the tops are changed too. Write each fraction over ${a * b} first.` },
        { text: 'Algebraic fractions cannot be added at all, only multiplied', right: false, why: 'They can, once they have a common denominator.' },
      ],
      hints: ['Think about 1/2 + 1/3. Do you add the bottoms?', 'Change both fractions to the same denominator, then add the tops.'],
      steps: [`Common denominator of ${a} and ${b}: ${a * b}.`, `x/${a} + x/${b} = ${b}x/${a * b} + ${a}x/${a * b} = ${a + b}x/${a * b}.`],
    }) }),

  fam({ id: 'g8.algfrac.shamba-solve', skill: 'G8_LINEAR_EQ_ADV', outcome: 'G8.EXPR.b', rung: 3, form: 'word',
    draw: () => { const [a, b] = pick([[3, 4], [2, 3], [2, 5], [3, 5], [4, 5]]), k = randInt(2, 8); return { a, b, k, T: (a + b) * k, x: a * b * k, p: person() }; },
    make: ({ a, b, k, T, x, p }) => ({
      question: `${p.name} plants maize on x/${a} acres and beans on x/${b} acres. Together they cover ${T} acres. Find x.`,
      answer: x,
      wrong: [[T * (a + b), 'You cannot add the bottom numbers. Give both fractions the same denominator first.'], [T * a, `That solves only the first fraction, x/${a} = ${T}. The beans cover land too.`], [T * a * b, `Multiplying by ${a * b} clears the fractions, but the left side then has ${a + b} lots of x. Divide by that too.`]],
      hints: [`Multiply every term by ${a * b} to clear the fractions.`, 'Collect the x terms, then divide.'],
      steps: [`x/${a} + x/${b} = ${T}. Multiply by ${a * b}: ${b}x + ${a}x = ${T * a * b}.`, `${a + b}x = ${T * a * b}.`, `x = ${T * a * b} ÷ ${a + b} = ${x}.`],
    }),
    check: ({ a, b, T }, x) => x / a + x / b === T }),

  fam({ id: 'g8.subst.boda-fare', skill: 'G8_EXPAND_BRACKETS', outcome: 'G8.EXPR.c', rung: 1, form: 'word',
    draw: () => ({ f: pick([50, 100]), r: pick([20, 30, 40]), k: randInt(3, 9), p: person() }),
    make: ({ f, r, k }) => ({
      question: `A boda boda fare is F = ${f} + ${r}d shillings, where d is the distance in km. Find F when d = ${k}.`,
      answer: f + r * k,
      wrong: [[(f + r) * k, `${r}d means ${r} times d. Only the ${r}d part uses the distance.`], [r * k, 'You left out the fixed charge.'], [f * k + r, `The distance multiplies the ${r}, not the ${f}.`]],
      hints: [`Put d = ${k} into the formula.`, `${r}d means ${r} × d. Multiply before you add.`],
      steps: [`F = ${f} + ${r} × ${k}`, `F = ${f} + ${r * k} = ${f + r * k}.`],
    }),
    check: ({ f, r, k }, a) => (a - f) / r === k }),

  fam({ id: 'g8.subst.negative-steps', skill: 'G8_EXPAND_BRACKETS', outcome: 'G8.EXPR.c', rung: 3, form: 'steps', allowNegative: true,
    draw: () => { const a = randInt(2, 4), b = randInt(2, 6), s = randInt(2, 4), t = randInt(3, 9); return { a, b, s, t }; },
    make: ({ a, b, s, t }) => ({
      question: `Evaluate E = ${a}m² − ${b}n when m = −${s} and n = ${t}.`,
      parts: [
        { prompt: `What is m² when m = −${s}?`, answer: s * s, hint: `m² means m × m. A negative times a negative is positive.`, wrong: [[-s * s, 'Negative times negative gives a positive answer.'], [-2 * s, 'm² means m × m, not 2 × m.']] },
        { prompt: `What is ${a}m²?`, answer: a * s * s, hint: `Multiply the answer to the step before by ${a}.`, wrong: [[(a * s) * (a * s), `Only m is squared, not the ${a}.`]] },
        { prompt: `What is ${b}n?`, answer: b * t, hint: `${b} × ${t}`, wrong: [[b + t, `${b}n means ${b} times n.`]] },
        { prompt: 'What is E?', answer: a * s * s - b * t, hint: 'Take your answer for the third part from your answer for the second part.', wrong: [[a * s * s + b * t, 'The sign in front of the bn is a minus.']] },
      ],
      steps: [`m² = (−${s}) × (−${s}) = ${s * s}.`, `${a}m² = ${a} × ${s * s} = ${a * s * s}.`, `${b}n = ${b} × ${t} = ${b * t}.`, `E = ${a * s * s} − ${b * t} = ${neg(a * s * s - b * t)}.`],
    }),
    check: ({ a, b, s, t }, v) => v[0] === (-s) * (-s) && v[1] === a * v[0] && v[2] === b * t && v[3] === a * (-s) ** 2 - b * t }),

  fam({ id: 'g8.subst.sign-why', skill: 'G8_EXPAND_BRACKETS', outcome: 'G8.EXPR.c', rung: 2, form: 'why',
    draw: () => { const c = randInt(5, 20), r = randInt(2, 6), s = randInt(2, 5); return { c, r, s, p: person() }; },
    make: ({ c, r, s, p }) => ({
      question: `${p.name} substitutes into ${c} − ${r}x. Here x = −${s}. Which working is right?`,
      options: [
        { text: `${c} − ${r} × (−${s}) = ${c} + ${r * s}. Taking away a negative adds`, right: true },
        { text: `${c} − ${r} × ${s} = ${neg(c - r * s)}. The minus sign of x is not needed`, right: false, why: 'x is −' + s + ', not ' + s + '. The minus sign must stay.' },
        { text: `${c} − ${r} × (−${s}) = ${neg(c - r * s)}. A minus times a minus stays minus`, right: false, why: 'A negative times a negative is a positive, so the term being taken away is positive.' },
        { text: `${c} − ${r} − ${s} = ${neg(c - r - s)}. Replace x by −${s} and write it straight in`, right: false, why: `${r}x means ${r} times x. The −${s} replaces the whole x, so it multiplies by ${r}.` },
      ],
      hints: ['Put the number in a bracket where x was.', 'Work out the multiplication first. Then deal with the minus.'],
      steps: [`${c} − ${r}x with x = −${s}: ${c} − ${r} × (−${s}).`, `${r} × (−${s}) = ${neg(-r * s)}.`, `${c} − (${neg(-r * s)}) = ${c} + ${r * s} = ${c + r * s}.`],
    }) }),

  // ======================================================== LINEAR EQUATIONS
  fam({ id: 'g8.eq.form-prices', skill: 'G8_SIMULTANEOUS_INTRO', outcome: 'G8.EQUATIONS.a', rung: 2, form: 'direct',
    draw: () => {
      const m = price('mandazi'), c = price('chapati'), a1 = randInt(2, 4), b1 = randInt(1, 3), a2 = randInt(1, 4), b2 = randInt(2, 5);
      if (m >= c || a1 === b1 || a2 === b2 || a1 * b2 === a2 * b1) return null;
      const T1 = a1 * m + b1 * c, T2 = a2 * m + b2 * c;
      return { m, c, a1, b1, a2, b2, T1, T2, ps: twoPeople() };
    },
    make: ({ m, c, a1, b1, a2, b2, T1, T2, ps }) => {
      const sat = ([x1, y1, t1, x2, y2, t2]) => x1 * m + y1 * c === t1 && x2 * m + y2 * c === t2;
      const opts = [[a1, b1, T1, a2, b2, T2], [b1, a1, T1, b2, a2, T2], [1, 1, T1, 1, 1, T2], [a1, b1, T1, a2, b2, T1 + T2]];
      const whys = ['', 'The numbers of mandazi and chapati are the wrong way round. Match each number to its item.', 'The equations must say how many of each item was bought. Do not leave the numbers out.', 'Each person pays their own total. The second total is not the two bills added.'];
      const txt = ([x1, y1, t1, x2, y2, t2]) => `${x1 === 1 ? '' : x1}m + ${y1 === 1 ? '' : y1}c = ${t1} and ${x2 === 1 ? '' : x2}m + ${y2 === 1 ? '' : y2}c = ${t2}`;
      return { question: `Let m be the price of one mandazi and c the price of one chapati, in shillings. ${ps[0].name} pays ${sh(T1)} for ${a1} mandazi and ${b1} chapati. ${ps[1].name} pays ${sh(T2)} for ${a2} mandazi and ${b2} chapati. Form two equations. Which pair is right?`, story: false,
        options: opts.map((o, i) => ({ text: txt(o), right: sat(o), why: whys[i] })),
        hints: ['Each person gives one equation.', 'Write mandazi times the price, plus chapati times the price, equals the total paid.'],
        steps: [`${ps[0].name}: ${a1} mandazi and ${b1} chapati make ${a1}m + ${b1}c = ${T1}.`, `${ps[1].name}: ${a2}m + ${b2}c = ${T2}.`] };
    } }),

  fam({ id: 'g8.eq.form-sign-spot', skill: 'G8_SIMULTANEOUS_INTRO', outcome: 'G8.EQUATIONS.a', rung: 3, form: 'spot',
    draw: () => ({ S: randInt(14, 40) * 2, d: randInt(2, 6) * 2, p: person() }),
    make: ({ S, d, p }) => {
      const sign = '−';
      return { question: `Two bags of maize weigh ${S} kg together. The big bag is ${d} kg heavier than the small bag. ${p.name} forms two equations and solves them. Which step has the mistake?`,
        working: [
          { text: 'Let x be the mass of the big bag and y the mass of the small bag.', ok: true },
          { text: `Together: x + y = ${S}.`, ok: true },
          { text: `The big bag is heavier: x = y ${sign} ${d}.`, ok: sign === '+' },
          { text: `Substitute: (y ${sign} ${d}) + y = ${S}, so 2y = ${S + d}.`, ok: true },
        ],
        fix: `If the big bag is ${d} kg heavier, you add ${d} to the small bag: x = y + ${d}.`,
        steps: ['Write what is the same in both statements.', 'A heavier bag is the lighter one plus the difference.'] };
    } }),

  fam({ id: 'g8.eq.eliminate-steps', skill: 'G8_SIMULTANEOUS_INTRO', outcome: 'G8.EQUATIONS.b', rung: 3, form: 'steps',
    draw: () => { const a = randInt(2, 5), b1 = randInt(1, 3), b2 = b1 + randInt(1, 3), x = randInt(1, 6), y = randInt(1, 6); return { a, b1, b2, x, y, c1: a * x + b1 * y, c2: a * x + b2 * y }; },
    make: ({ a, b1, b2, x, y, c1, c2 }) => ({
      question: `The equations ${a}x + ${b1 === 1 ? '' : b1}y = ${c1} and ${a}x + ${b2}y = ${c2} are true together. Follow the method of elimination to find x and y.`,
      parts: [
        { prompt: 'Take the first equation from the second. The x terms cancel. What number is on the right-hand side?', answer: c2 - c1, hint: `${c2} − ${c1}`, wrong: [[c1 + c2, 'To make the x terms cancel you subtract the equations.']] },
        { prompt: `The left-hand side is ${b2 - b1}y. What is y?`, answer: y, hint: `Divide the right-hand side by ${b2 - b1}.`, wrong: [[c2 - c1, `Divide by the number in front of y, which is ${b2 - b1}.`]] },
        { prompt: `Put your y into the first equation. What is x?`, answer: x, hint: `${a}x + ${b1} × y = ${c1}. Solve for x.`, wrong: [[c1 - b1 * y, `That is ${a}x. Divide by ${a} to find x.`]] },
      ],
      steps: [`(${a}x + ${b2}y) − (${a}x + ${b1}y) = ${c2} − ${c1}, so ${b2 - b1}y = ${c2 - c1}.`, `y = ${c2 - c1} ÷ ${b2 - b1} = ${y}.`, `${a}x + ${b1} × ${y} = ${c1}, so ${a}x = ${c1 - b1 * y} and x = ${x}.`],
    }),
    check: ({ a, b1, b2, c1, c2 }, v) => a * v[2] + b1 * v[1] === c1 && a * v[2] + b2 * v[1] === c2 && v[0] === (b2 - b1) * v[1] }),

  fam({ id: 'g8.eq.substitute-spot', skill: 'G8_SIMULTANEOUS_INTRO', outcome: 'G8.EQUATIONS.b', rung: 3, form: 'spot',
    draw: () => {
      const x0 = randInt(2, 6), m = randInt(2, 4), c = pick([-3, -2, -1, 1, 2, 3]), pp = randInt(2, 4), y0 = m * x0 + c;
      return y0 > 0 ? { x0, m, c, pp, y0, t: pp * x0 + y0, p: person() } : null;
    },
    make: ({ x0, m, c, pp, y0, t, p }) => {
      const wrongY = m * x0 - c;
      return { question: `${p.name} solves y = ${m}x ${signed(c)} and ${pp}x + y = ${t} by substitution. Which step has the mistake?`,
        working: [
          { text: `Replace y in the second equation: ${pp}x + (${m}x ${signed(c)}) = ${t}.`, ok: true },
          { text: `${pp + m}x ${signed(c)} = ${t}.`, ok: true },
          { text: `${pp + m}x = ${t - c}, so x = ${x0}.`, ok: (t - c) === (pp + m) * x0 },
          { text: `Put x = ${x0} into y = ${m}x ${signed(c)}: y = ${m} × ${x0} ${signed(-c)} = ${wrongY}.`, ok: wrongY === m * x0 + c },
          { text: `So x = ${x0} and y = ${wrongY}.`, ok: true },
        ],
        fix: `The equation says y = ${m}x ${signed(c)}, so the ${Math.abs(c)} is ${c < 0 ? 'taken away' : 'added'}. The sign was changed when ${p.name} used it again.`,
        steps: ['Use the same equation, with the same signs, to find y.', `y = ${m} × ${x0} ${signed(c)} = ${y0}.`] };
    } }),

  fam({ id: 'g8.eq.museum-tickets', skill: 'G8_SIMULTANEOUS_INTRO', outcome: 'G8.EQUATIONS.d', rung: 3, form: 'word',
    draw: () => {
      const A = pick([100, 150, 200, 250, 300]), C = pick([50, 60, 70, 80, 90, 100]), a1 = randInt(1, 3), a2 = a1 + randInt(1, 3), n = randInt(3, 8);
      const T1 = a1 * A + n * C, T2 = a2 * A + n * C;
      return distinct(A, T2 - T1, round(T1 / (a1 + n), 2), C, T1 / a1) ? { A, C, a1, a2, n, T1, T2 } : null;
    },
    make: ({ A, C, a1, a2, n, T1, T2 }) => ({
      question: `A museum in Nairobi charges one price for an adult and one price for a child. A group of ${a1} adult${a1 > 1 ? 's' : ''} and ${n} children pays sh ${commas(T1)} in total. A group of ${a2} adults and ${n} children pays sh ${commas(T2)} in total. How much is one adult ticket, in shillings?`,
      answer: A,
      wrong: [[T2 - T1, `That is the cost of ${a2 - a1} extra adult${a2 - a1 > 1 ? 's' : ''}. Share it between them.`], [round(T1 / (a1 + n), 2), 'Adults and children pay different prices, so you cannot share the total equally.'], [C, 'That is the price for a child. The question asks about an adult.'], [T1 / a1, 'The first group also has children, who pay too.']],
      hints: ['Both groups have the same number of children.', 'So the difference in the totals is paid only by the extra adults.'],
      steps: [`Extra adults: ${a2} − ${a1} = ${a2 - a1}. Extra cost: ${commas(T2)} − ${commas(T1)} = ${commas(T2 - T1)}.`, `One adult: ${commas(T2 - T1)} ÷ ${a2 - a1} = sh ${A}.`],
    }),
    check: ({ a1, a2, n, T1, T2, C }, a) => a1 * a + n * C === T1 && a2 * a + n * C === T2 }),

  fam({ id: 'g8.eq.coins', skill: 'G8_SIMULTANEOUS_INTRO', outcome: 'G8.EQUATIONS.d', rung: 3, form: 'word',
    draw: () => { const x = randInt(4, 14), y = randInt(4, 14), N = x + y, V = 5 * x + 10 * y; return distinct(y, x, V / 10, N / 2) ? { x, y, N, V, p: person() } : null; },
    make: ({ x, y, N, V, p }) => ({
      question: `${p.name}'s purse holds ${N} coins. Some are sh 5 coins and the rest are sh 10 coins. The coins are worth sh ${V} altogether. How many sh 10 coins are in the purse?`,
      answer: y,
      wrong: [[x, 'That is the number of sh 5 coins. The question asks about the sh 10 coins.'], [V / 10, 'That would be right only if every coin were sh 10. Some are sh 5.'], [N / 2, 'The two kinds of coin are not equal in number. Use the total value.']],
      hints: ['Let one letter stand for the sh 5 coins and another for the sh 10 coins.', 'One equation counts the coins. The other adds up the money.'],
      steps: [`Let f be the sh 5 coins and t the sh 10 coins: f + t = ${N} and 5f + 10t = ${V}.`, `Multiply the first by 5: 5f + 5t = ${5 * N}. Subtract from the second: 5t = ${V - 5 * N}.`, `t = ${(V - 5 * N) / 5}.`],
    }),
    check: ({ N, V }, a) => 5 * (N - a) + 10 * a === V }),

  fam({ id: 'g8.eq.hens-goats-steps', skill: 'G8_SIMULTANEOUS_INTRO', outcome: 'G8.EQUATIONS.d', rung: 3, form: 'steps',
    draw: () => { const h = randInt(5, 20), g = randInt(4, 15); return h !== g ? { h, g, N: h + g, L: 2 * h + 4 * g } : null; },
    make: ({ N, L }) => ({
      question: `A farmer keeps hens and goats. There are ${N} animals in total and ${L} legs in total. Let h be the number of hens and g the number of goats. Then h + g = ${N} and 2h + 4g = ${L}.`,
      parts: [
        { prompt: 'Double the first equation. What does 2h + 2g equal?', answer: 2 * N, hint: 'Double both sides.', wrong: [[N + 2, 'Both sides are doubled, not increased by 2.']] },
        { prompt: 'Take that from the second equation. What does 2g equal?', answer: L - 2 * N, hint: 'The 2h terms cancel. Take the right-hand sides away.', wrong: [[L + 2 * N, 'The terms must cancel, so subtract.']] },
        { prompt: 'How many goats are there?', answer: (L - 2 * N) / 2, unit: 'goats', hint: 'Divide by 2.', wrong: [[L - 2 * N, 'That is 2g. How many goats is that?']] },
        { prompt: 'How many hens are there?', answer: N - (L - 2 * N) / 2, unit: 'hens', hint: 'Take the goats from the total animals.', wrong: [[(L - 2 * N) / 2, 'That is the number of goats.']] },
      ],
      steps: [`2h + 2g = ${2 * N}.`, `(2h + 4g) − (2h + 2g) = ${L} − ${2 * N}, so 2g = ${L - 2 * N}.`, `g = ${(L - 2 * N) / 2}.`, `h = ${N} − ${(L - 2 * N) / 2} = ${N - (L - 2 * N) / 2}.`],
    }),
    check: ({ N, L }, v) => v[0] === 2 * N && v[1] === L - v[0] && v[2] * 2 === v[1] && v[3] + v[2] === N && 2 * v[3] + 4 * v[2] === L }),

  fam({ id: 'g8.eq.eliminate-why', skill: 'G8_LINEAR_EQ_ADV', outcome: 'G8.EQUATIONS.b', rung: 2, form: 'why',
    draw: () => { const a = randInt(2, 5), b1 = randInt(1, 3), b2 = b1 + randInt(1, 3), x = randInt(1, 6), y = randInt(1, 6); return { a, b1, b2, c1: a * x + b1 * y, c2: a * x + b2 * y, p: person() }; },
    make: ({ a, b1, b2, c1, c2, p }) => ({
      question: `To solve ${a}x + ${b1 === 1 ? '' : b1}y = ${c1} and ${a}x + ${b2}y = ${c2}, ${p.name} subtracts one equation from the other. Why does that help?`,
      options: [
        { text: 'The x terms are the same, so they cancel out', right: true },
        { text: 'It makes all the numbers in the equations smaller', right: false, why: 'Smaller numbers are not the aim. The aim is to remove one unknown.' },
        { text: 'It gives the value of x straight away, in one step', right: false, why: 'The x terms disappear, so you find y first and then x.' },
        { text: 'Subtracting is always the way to solve two equations', right: false, why: 'Sometimes you add, when the terms are opposites. The aim is to cancel one unknown.' },
      ],
      hints: ['Look at the numbers in front of x in the two equations.', 'What happens to terms that are the same when you subtract?'],
      steps: [`Both equations have ${a}x.`, `Subtracting gives ${a}x − ${a}x = 0, so only y is left.`],
    }) }),
];
