// ============================================================================
// REASONING QUESTIONS — "spot the mistake" and "always, sometimes or never".
//
// Cambridge builds reasoning into its papers (critiquing, convincing,
// characterising); KNEC's reports say children can calculate but struggle to
// apply. These ask the child to judge maths, not only produce it:
//
//  • Spot the mistake: a child's three-step working with ONE wrong step (a
//    catalogued misconception); later steps follow on from it, the way a real
//    child's would. Explaining an incorrect worked example alongside correct
//    ones improves understanding (Booth et al. 2013) — so these are served
//    only after the child has answered the skill correctly a couple of times.
//  • Always / sometimes / never: a statement children often believe, with the
//    example that settles it.
//
// Everything is generated or written for HOREB; no exam item is copied.
// reasoningFor(skillId) -> problem | null
// ============================================================================

import { randInt, pick } from './schema.js';

const NAMES = ['Juma', 'Achieng', 'Wanjiru', 'Kiprono', 'Amina', 'Otieno', 'Nyambura', 'Baraka', 'Halima', 'Mutua', 'Chebet', 'Omondi', 'Wambui', 'Kamau', 'Akinyi', 'Njeri'];
const fmt = (n) => String(Number(Number(n).toPrecision(12)));
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const frac = (n, d) => { const g = gcd(n, d); return d / g === 1 ? `${n / g}` : `${n / g}/${d / g}`; };

// ---- spot the mistake -------------------------------------------------------
// steps: the child's working, shown numbered; wrong: index of the bad step;
// fix: what went wrong and the right result (shown after answering).
const spot = ({ task, steps, wrong, fix, hint }) => {
  const name = pick(NAMES);
  const labels = steps.map((_, i) => `Step ${i + 1}`);
  return {
    type: 'spot-mistake',
    instruction: 'One step has a mistake. Find it.',
    question: `${name} worked out ${task}. Which step has the mistake?`,
    shownSteps: steps,
    mc: labels,
    answer: labels[wrong],
    accepts: [labels[wrong], `${wrong + 1}`, `step${wrong + 1}`],
    hint: hint || 'Check each step on its own. Is it true?',
    hints: [hint || 'Check each step on its own. Is it true?'],
    misconceptions: labels.map((l, i) => (i === wrong ? null : {
      when: l,
      feedback: i < wrong
        ? `${l} is right. Keep checking the steps after it.`
        : `${l} follows on correctly from the step before it. The mistake happens earlier.`,
    })).filter(Boolean),
    explain: fix,
    solutionSteps: [fix],
    solution: { steps: [{ text: fix }], answer: labels[wrong] },
  };
};

const SPOT = {
  subtraction: () => {
    const at = randInt(4, 9), bt = randInt(1, at - 2), ao = randInt(0, 6), bo = randInt(ao + 1, 9);
    const a = at * 10 + ao, b = bt * 10 + bo;
    if (Math.random() < 0.5) {
      return spot({ task: `${a} − ${b}`, wrong: 0,
        steps: [`Ones: ${bo} − ${ao} = ${bo - ao}`, `Tens: ${at} − ${bt} = ${at - bt}`, `Answer: ${(at - bt) * 10 + (bo - ao)}`],
        fix: `Step 1. The top ones digit is ${ao}, which is smaller than ${bo}, so ${ao} − ${bo} needs a borrow; you can't swap them round. Borrow a ten: ${ao + 10} − ${bo} = ${ao + 10 - bo}. Then the tens are ${at - 1} − ${bt} = ${at - 1 - bt}. The answer is ${a - b}.`,
        hint: 'In column subtraction, which digit is on top in the ones column?' });
    }
    return spot({ task: `${a} − ${b}`, wrong: 1,
      steps: [`Ones: borrow a ten, ${ao + 10} − ${bo} = ${ao + 10 - bo}`, `Tens: ${at} − ${bt} = ${at - bt}`, `Answer: ${(at - bt) * 10 + (ao + 10 - bo)}`],
      fix: `Step 2. A ten was borrowed for the ones, so the tens column has ${at - 1}, not ${at}: ${at - 1} − ${bt} = ${at - 1 - bt}. The answer is ${a - b}.`,
      hint: 'After you borrow a ten, what happens to the tens column?' });
  },
  addition: () => {
    const at = randInt(1, 7), bt = randInt(1, 8 - at), ao = randInt(3, 9), bo = randInt(10 - ao, 9);
    const a = at * 10 + ao, b = bt * 10 + bo, s = ao + bo;
    if (s < 11 || Math.random() < 0.6) {
      return spot({ task: `${a} + ${b}`, wrong: 1,
        steps: [`Ones: ${ao} + ${bo} = ${s}. Write ${s % 10}, carry 1.`, `Tens: ${at} + ${bt} = ${at + bt}`, `Answer: ${(at + bt) * 10 + (s % 10)}`],
        fix: `Step 2. The 1 carried from the ones must be added in: ${at} + ${bt} + 1 = ${at + bt + 1}. The answer is ${a + b}.`,
        hint: 'What happened to the 1 that was carried?' });
    }
    return spot({ task: `${a} + ${b}`, wrong: 0,
      steps: [`Ones: ${ao} + ${bo} = ${s - 1}. Write ${(s - 1) % 10}, carry ${s - 1 >= 10 ? 1 : 0}.`, `Tens: ${at} + ${bt}${s - 1 >= 10 ? ' + 1' : ''} = ${at + bt + (s - 1 >= 10 ? 1 : 0)}`, `Answer: ${(at + bt + (s - 1 >= 10 ? 1 : 0)) * 10 + ((s - 1) % 10)}`],
      fix: `Step 1. ${ao} + ${bo} is ${s}, not ${s - 1}. Write ${s % 10} and carry 1. The answer is ${a + b}.`,
      hint: 'Check the ones sum carefully.' });
  },
  fractionsLike: () => {
    const d = randInt(5, 12), a = randInt(1, d - 3), b = randInt(1, d - a - 1);
    return spot({ task: `${a}/${d} + ${b}/${d}`, wrong: 1,
      steps: [`Add the tops: ${a} + ${b} = ${a + b}`, `Add the bottoms: ${d} + ${d} = ${2 * d}`, `Answer: ${a + b}/${2 * d}`],
      fix: `Step 2. The bottom number says what size the pieces are (${d}ths), and adding doesn't change the size. Keep the bottom as ${d}: the answer is ${frac(a + b, d)}.`,
      hint: 'Does adding pieces change what size each piece is?' });
  },
  fractionsUnlike: () => {
    const [b, d] = pick([[2, 3], [3, 4], [2, 5], [4, 5], [3, 5], [2, 7], [4, 3], [5, 6]]);
    const a = randInt(1, b - 1), c = randInt(1, d - 1), L = (b * d) / gcd(b, d);
    return spot({ task: `${a}/${b} + ${c}/${d}`, wrong: 1,
      steps: [`A common denominator of ${b} and ${d} is ${L}.`, `So ${a}/${b} = ${a}/${L} and ${c}/${d} = ${c}/${L}.`, `Answer: ${a + c}/${L}`],
      fix: `Step 2. When the bottom is multiplied, the top must be multiplied by the same number: ${a}/${b} = ${a * (L / b)}/${L} and ${c}/${d} = ${c * (L / d)}/${L}. The answer is ${frac(a * (L / b) + c * (L / d), L)}.`,
      hint: 'Is the new fraction really the same size as the old one?' });
  },
  fractionsDiv: () => {
    const [a, b] = pick([[1, 2], [2, 3], [3, 4], [3, 5], [2, 5]]), [c, d] = pick([[1, 3], [1, 4], [2, 3], [3, 4], [1, 5]]);
    return spot({ task: `${a}/${b} ÷ ${c}/${d}`, wrong: 0,
      steps: [`Flip the first fraction: ${b}/${a}`, `Multiply: ${b}/${a} × ${c}/${d} = ${b * c}/${a * d}`, `Answer: ${frac(b * c, a * d)}`],
      fix: `Step 1. Keep the first fraction and flip the SECOND one: ${a}/${b} × ${d}/${c} = ${frac(a * d, b * c)}.`,
      hint: 'Which fraction do you flip when dividing?' });
  },
  decimalsAdd: () => {
    const x = randInt(11, 89) / 10, y = randInt(101, 899) / 100;
    const xs = fmt(x), ys = fmt(y);
    if (!/\.\d$/.test(xs) || !/\.\d\d$/.test(ys)) return SPOT.decimalsAdd();
    const wrong = (+xs.replace('.', '') + +ys.replace('.', '')) / 100;
    return spot({ task: `${xs} + ${ys}`, wrong: 0,
      steps: [`Line up the last digits: ${xs.replace('.', '')} + ${ys.replace('.', '')}`, `${xs.replace('.', '')} + ${ys.replace('.', '')} = ${+xs.replace('.', '') + +ys.replace('.', '')}`, `Put the point back: ${fmt(wrong)}`],
      fix: `Step 1. Line up the decimal points, not the last digits: ${xs}0 + ${ys} = ${fmt(x + y)}.`,
      hint: 'What must line up when you add decimals?' });
  },
  bodmas: () => {
    const a = randInt(2, 9), b = randInt(2, 6), c = randInt(2, 6);
    if (Math.random() < 0.5) return spot({ task: `${a} + ${b} × ${c}`, wrong: 0,
      steps: [`${a} + ${b} = ${a + b}`, `${a + b} × ${c} = ${(a + b) * c}`, `Answer: ${(a + b) * c}`],
      fix: `Step 1. Multiply before you add: ${b} × ${c} = ${b * c}, then ${a} + ${b * c} = ${a + b * c}.`,
      hint: 'Which comes first, × or +?' });
    return spot({ task: `${a} × ${b}²`, wrong: 0,
      steps: [`${b}² = ${2 * b}`, `${a} × ${2 * b} = ${a * 2 * b}`, `Answer: ${a * 2 * b}`],
      fix: `Step 1. ${b}² means ${b} × ${b} = ${b * b}, not ${b} × 2. Then ${a} × ${b * b} = ${a * b * b}.`,
      hint: 'What does the small 2 mean?' });
  },
  equations: () => {
    const a = randInt(2, 6), x = randInt(2, 9), b = randInt(2, 12), c = a * x + b;
    if (Math.random() < 0.5) return spot({ task: `${a}x + ${b} = ${c}`, wrong: 0,
      steps: [`Add ${b} to both sides: ${a}x = ${c + b}`, `Divide both sides by ${a}: x = ${fmt((c + b) / a)}`, `Answer: x = ${fmt((c + b) / a)}`],
      fix: `Step 1. To undo + ${b}, take ${b} away from both sides: ${a}x = ${c - b}. Then x = ${x}.`,
      hint: 'What undoes adding?' });
    return spot({ task: `${a}x + ${b} = ${c}`, wrong: 1,
      steps: [`Take ${b} from both sides: ${a}x = ${c - b}`, `Take ${a} from both sides: x = ${c - b - a}`, `Answer: x = ${c - b - a}`],
      fix: `Step 2. ${a}x means ${a} times x, so undo it by dividing: x = ${c - b} ÷ ${a} = ${x}.`,
      hint: 'What does 3x mean? What undoes it?' });
  },
  brackets: () => {
    const k = randInt(2, 6), m = randInt(1, 9), n = randInt(1, k - 1);
    return spot({ task: `${k}(x + ${m}) − ${n}x`, wrong: 0,
      steps: [`${k}(x + ${m}) = ${k}x + ${m}`, `${k}x + ${m} − ${n}x = ${k - n === 1 ? '' : k - n}x + ${m}`, `Answer: ${k - n === 1 ? '' : k - n}x + ${m}`],
      fix: `Step 1. The ${k} multiplies everything inside the bracket: ${k}(x + ${m}) = ${k}x + ${k * m}. The answer is ${k - n === 1 ? '' : k - n}x + ${k * m}.`,
      hint: 'Does the number outside multiply every term inside?' });
  },
  percent: () => {
    const y = pick([200, 300, 400, 500, 600, 800, 1200, 1500, 2000]), x = pick([5, 10, 15, 20, 25, 30, 40]);
    if (Math.random() < 0.5) return spot({ task: `${x}% of ${y}`, wrong: 0,
      steps: [`1% of ${y} is ${y} ÷ 10 = ${y / 10}`, `${x}% is ${y / 10} × ${x} = ${(y / 10) * x}`, `Answer: ${(y / 10) * x}`],
      fix: `Step 1. Per cent means out of 100, so 1% is ${y} ÷ 100 = ${y / 100}. Then ${x}% is ${y / 100} × ${x} = ${(y * x) / 100}.`,
      hint: 'How many parts is "per cent" out of?' });
    return spot({ task: `${x}% of ${y}`, wrong: 1,
      steps: [`1% of ${y} is ${y} ÷ 100 = ${y / 100}`, `${x}% is ${y / 100} + ${x} = ${y / 100 + x}`, `Answer: ${y / 100 + x}`],
      fix: `Step 2. ${x}% is ${x} lots of 1%, so multiply: ${y / 100} × ${x} = ${(y * x) / 100}.`,
      hint: 'If 1% is known, how do you get many per cent?' });
  },
  time: () => {
    const h = randInt(6, 14), m = pick([35, 40, 45, 50]), H = randInt(1, 3), M = pick([25, 30, 35, 40, 45]);
    const tot = h * 60 + m + H * 60 + M, eh = Math.floor(tot / 60), em = tot % 60;
    return spot({ task: `when a trip that starts at ${h}:${m} and takes ${H} h ${M} min ends`, wrong: 2,
      steps: [`Add the hours: ${h} + ${H} = ${h + H}`, `Add the minutes: ${m} + ${M} = ${m + M}`, `End time: ${h + H}:${m + M}`],
      fix: `Step 3. There are only 60 minutes in an hour. ${m + M} minutes is 1 hour ${m + M - 60} minutes, so the trip ends at ${eh}:${String(em).padStart(2, '0')}.`,
      hint: 'Can a clock show more than 59 minutes?' });
  },
  perimeter: () => {
    const L = randInt(5, 15), W = randInt(2, L - 1);
    if (Math.random() < 0.5) return spot({ task: `the perimeter of a rectangle ${L} cm by ${W} cm`, wrong: 1,
      steps: [`The sides are ${L} cm, ${W} cm, ${L} cm and ${W} cm.`, `Perimeter = ${L} × ${W}`, `Answer: ${L * W} cm`],
      fix: `Step 2. Perimeter is the distance all the way round: add the four sides. ${L} + ${W} + ${L} + ${W} = ${2 * (L + W)} cm. ${L} × ${W} is the area.`,
      hint: 'Perimeter: walk round the edge. What do you add?' });
    return spot({ task: `the area of a rectangle ${L} cm by ${W} cm`, wrong: 1,
      steps: [`The rectangle is ${L} cm long and ${W} cm wide.`, `Area = ${L} + ${W} + ${L} + ${W}`, `Answer: ${2 * (L + W)} cm²`],
      fix: `Step 2. That adds up the edge (the perimeter). Area is the space inside: ${L} × ${W} = ${L * W} cm².`,
      hint: 'Area is how many squares fit inside.' });
  },
  mean: () => {
    const n = randInt(4, 6), mean = randInt(4, 12), xs = Array.from({ length: n - 1 }, () => randInt(mean - 3, mean + 4));
    const last = mean * n - xs.reduce((a, b) => a + b, 0); if (last < 1) return SPOT.mean();
    const list = [...xs, last], sum = mean * n;
    return spot({ task: `the mean of ${list.join(', ')}`, wrong: 1,
      steps: [`Total: ${list.join(' + ')} = ${sum}`, `There are ${n - 1} numbers.`, `Mean: ${sum} ÷ ${n - 1} = ${fmt(Math.round((sum / (n - 1)) * 100) / 100)}`],
      fix: `Step 2. Count again: there are ${n} numbers. Mean = ${sum} ÷ ${n} = ${mean}.`,
      hint: 'Count the numbers in the list.' });
  },
  units: (kind) => {
    const all = { len: [['km', 'm', 1000], ['m', 'cm', 100]], mass: [['kg', 'g', 1000]], cap: [['litres', 'ml', 1000]] };
    const [big, small, f] = pick(all[kind] || [...all.len, ...all.mass, ...all.cap]);
    const n = randInt(12, 95) / 10;
    return spot({ task: `${fmt(n)} ${big} in ${small}`, wrong: 1,
      steps: [`1 ${big === 'litres' ? 'litre' : big} = ${f} ${small}`, `${fmt(n)} ÷ ${f} = ${fmt(n / f)}`, `Answer: ${fmt(n / f)} ${small}`],
      fix: `Step 2. ${small} are smaller, so you need MORE of them: multiply. ${fmt(n)} × ${f} = ${fmt(n * f)} ${small}.`,
      hint: 'Changing to a smaller unit: more of them or fewer?' });
  },
  integers: () => {
    const a = randInt(2, 9), b = randInt(2, 9);
    if (Math.random() < 0.5) return spot({ task: `${a} − (−${b})`, wrong: 0,
      steps: [`Taking away −${b} is the same as taking away ${b}.`, `${a} − ${b} = ${neg(a - b)}`, `Answer: ${neg(a - b)}`],
      fix: `Step 1. Taking away a negative is the same as adding: ${a} − (−${b}) = ${a} + ${b} = ${a + b}. Think of cancelling a debt of ${b}.`,
      hint: 'If someone cancels your debt, are you richer or poorer?' });
    const up = randInt(a + 1, a + 9);
    return spot({ task: `how much the temperature rises from −${a} °C to ${up} °C`, wrong: 1,
      steps: [`Start at −${a} °C and count up to ${up} °C.`, `${up} − ${a} = ${up - a}`, `Answer: a rise of ${up - a} °C`],
      fix: `Step 2. From −${a} up to 0 is ${a} degrees, then 0 up to ${up} is ${up} more: ${a} + ${up} = ${a + up} °C.`,
      hint: 'How far is it from −' + a + ' up to 0?' });
  },
  pythagoras: () => {
    const [p, q, r] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]);
    return spot({ task: `the hypotenuse of a right-angled triangle with sides ${p} cm and ${q} cm`, wrong: 2,
      steps: [`${p}² = ${p * p} and ${q}² = ${q * q}`, `c² = ${p * p} + ${q * q} = ${r * r}`, `c = ${r * r} ÷ 2 = ${(r * r) / 2}`],
      fix: `Step 3. To undo squaring, take the square root, not half: √${r * r} = ${r} cm.`,
      hint: 'What undoes squaring a number?' });
  },
  indices: () => {
    const base = pick([2, 3, 5, 10]), m = randInt(2, 5), n = randInt(2, 5);
    return spot({ task: `${base}^${m} × ${base}^${n}`, wrong: 1,
      steps: [`Same base (${base}), so combine the powers.`, `${m} × ${n} = ${m * n}`, `Answer: ${base}^${m * n}`],
      fix: `Step 2. When you multiply powers of the same base, ADD the powers: ${m} + ${n} = ${m + n}. The answer is ${base}^${m + n}.`,
      hint: `Write ${base}^${m} × ${base}^${n} out in full. How many ${base}s are multiplied?` });
  },
  ratio: () => {
    const a = randInt(1, 4), b = randInt(a + 1, 7), u = randInt(3, 12), N = u * (a + b);
    return spot({ task: `sh ${N} shared in the ratio ${a}:${b}`, wrong: 2,
      steps: [`Total parts: ${a} + ${b} = ${a + b}`, `One part: ${N} ÷ ${a + b} = sh ${u}`, `The larger share: ${u} × ${a} = sh ${u * a}`],
      fix: `Step 3. The larger share has ${b} parts, not ${a}: ${u} × ${b} = sh ${u * b}.`,
      hint: 'How many parts does the larger share get?' });
  },
  triangleArea: () => {
    const B = randInt(4, 20), Hh = randInt(3, 12) * 2;
    return spot({ task: `the area of a triangle with base ${B} cm and height ${Hh} cm`, wrong: 1,
      steps: [`Base ${B} cm, height ${Hh} cm.`, `Area = ${B} × ${Hh}`, `Answer: ${B * Hh} cm²`],
      fix: `Step 2. A triangle is half of a rectangle: area = ½ × ${B} × ${Hh} = ${(B * Hh) / 2} cm².`,
      hint: 'Draw the rectangle around the triangle. How much of it is the triangle?' });
  },
  circumference: () => {
    const d = pick([7, 14, 21, 28, 35]);
    return spot({ task: `the circumference of a circle with diameter ${d} cm (π = 22/7)`, wrong: 0,
      steps: [`C = 2 × π × ${d}`, `C = 2 × 22/7 × ${d} = ${(2 * 22 * d) / 7}`, `Answer: ${(2 * 22 * d) / 7} cm`],
      fix: `Step 1. 2 × π × r uses the RADIUS. With the diameter it is π × d = 22/7 × ${d} = ${(22 * d) / 7} cm.`,
      hint: 'Is ' + d + ' cm the radius or the diameter?' });
  },
  interest: () => {
    const P = pick([10000, 20000, 25000, 40000, 50000]), R = pick([5, 8, 10, 12]), T = randInt(2, 5);
    const c = (n) => n.toLocaleString('en-US');
    return spot({ task: `the simple interest on sh ${c(P)} at ${R}% a year for ${T} years`, wrong: 1,
      steps: [`Interest for 1 year: ${R}% of ${c(P)} = sh ${c((P * R) / 100)}`, `For ${T} years: ${c((P * R) / 100)} + ${T} = sh ${c((P * R) / 100 + T)}`, `Answer: sh ${c((P * R) / 100 + T)}`],
      fix: `Step 2. ${T} years is ${T} lots of one year's interest: ${c((P * R) / 100)} × ${T} = sh ${c((P * R * T) / 100)}.`,
      hint: 'Each year earns the same interest. How many years?' });
  },
  speed: () => {
    const t = randInt(2, 5), v = pick([40, 45, 50, 60, 80]), dist = v * t;
    return spot({ task: `the speed of a matatu that goes ${dist} km in ${t} hours`, wrong: 0,
      steps: [`Speed = distance × time`, `${dist} × ${t} = ${dist * t}`, `Answer: ${dist * t} km/h`],
      fix: `Step 1. Speed is how far in ONE hour: distance ÷ time = ${dist} ÷ ${t} = ${v} km/h.`,
      hint: 'Speed in km/h: how many km in one hour?' });
  },
  profit: () => {
    const C = pick([400, 500, 800, 1000, 1200, 2000]), p = pick([10, 20, 25, 50]), S = C + (C * p) / 100;
    return spot({ task: `the profit percentage on goods bought for sh ${C} and sold for sh ${S}`, wrong: 1,
      steps: [`Profit = ${S} − ${C} = sh ${S - C}`, `Profit % = ${S - C} ÷ ${S} × 100`, `Answer: ${fmt(Math.round(((S - C) / S) * 1000) / 10)}%`],
      fix: `Step 2. Profit per cent is worked out on the COST price: ${S - C} ÷ ${C} × 100 = ${p}%.`,
      hint: 'Is the profit compared with what was paid or what was received?' });
  },
  money: () => {
    const x = pick([120, 150, 160, 180, 210, 240]), y = pick([55, 75, 90, 110, 130]), k = randInt(2, 3), tot = x * k + y;
    const notes = tot < 500 ? 1 : 2, paid = notes * 500;
    return spot({ task: `the change for ${k} kg of sugar at sh ${x} a kg and bread for sh ${y}, paid with ${notes === 1 ? 'a sh 500 note' : 'two sh 500 notes'}`, wrong: 0,
      steps: [`Cost: ${x} + ${y} = sh ${x + y}`, `Paid: sh ${paid}`, `Change: ${paid} − ${x + y} = sh ${paid - x - y}`],
      fix: `Step 1. ${k} kg of sugar costs ${k} × ${x} = sh ${k * x}, so the cost is ${k * x} + ${y} = sh ${tot}. The change is ${paid} − ${tot} = sh ${paid - tot}.`,
      hint: 'How many kg of sugar were bought?' });
  },
  placeValue: () => {
    const digits = [randInt(1, 9), randInt(1, 9), randInt(1, 9), randInt(1, 9), randInt(1, 9)];
    const pos = randInt(1, 3), d = digits[pos], place = 10 ** (4 - pos), N = +digits.join('');
    const names = { 1000: 'thousands', 100: 'hundreds', 10: 'tens' };
    return spot({ task: `the value of the ${d} in ${N.toLocaleString('en-US')} (the ${ordinal(pos + 1)} digit from the left)`, wrong: 1,
      steps: [`The ${d} is in the ${names[place]} column.`, `So its value is ${d} × ${place / 10} = ${(d * place) / 10}.`, `Answer: ${(d * place) / 10}`],
      fix: `Step 2. The ${names[place]} column is worth ${place}, so the value is ${d} × ${place} = ${d * place}.`,
      hint: `What is one ${names[place].slice(0, -1)} worth?` });
  },
};
const neg = (n) => String(n).replace('-', '−');
const ordinal = (n) => ['first', 'second', 'third', 'fourth', 'fifth'][n - 1];

// ---- always, sometimes or never ---------------------------------------------
// Statements children often believe, each with what settles it.
const ASN = [
  { k: ['mulDec', 'mulFrac'], s: 'Multiplying makes a number bigger.', a: 'Sometimes', e: '6 × 3 = 18 is bigger, but 6 × 0.5 = 3 is smaller. Times a half means half of.' },
  { k: ['divDec', 'divFrac'], s: 'Dividing makes a number smaller.', a: 'Sometimes', e: '12 ÷ 3 = 4 is smaller, but 12 ÷ 0.5 = 24 is bigger: there are 24 halves in 12.' },
  { k: ['decimals'], s: 'A decimal with more digits after the point is bigger.', a: 'Sometimes', e: '0.55 is bigger than 0.5, but 0.45 is smaller than 0.5. Compare tenths first, then hundredths.' },
  { k: ['add'], s: 'An odd number plus an odd number is even.', a: 'Always', e: 'Each odd number is a pair plus 1 left over. The two left-overs make another pair: 3 + 5 = 8, 7 + 9 = 16.' },
  { k: ['mul'], s: 'An odd number times an odd number is even.', a: 'Never', e: 'Odd groups of an odd number always leave one over: 3 × 5 = 15, 7 × 9 = 63.' },
  { k: ['mul'], s: 'The product of two whole numbers is bigger than their sum.', a: 'Sometimes', e: '4 × 5 = 20 is bigger than 4 + 5 = 9, but 1 × 7 = 7 is smaller than 1 + 7 = 8, and 2 × 2 = 2 + 2.' },
  { k: ['div'], s: 'An even number divided by 2 gives an even number.', a: 'Sometimes', e: '8 ÷ 2 = 4 is even, but 6 ÷ 2 = 3 is odd.' },
  { k: ['factors'], s: 'A number ending in 0 can be divided exactly by 5.', a: 'Always', e: 'A number ending in 0 is a multiple of 10, and every multiple of 10 is a multiple of 5.' },
  { k: ['factors', 'squares'], s: 'A square number has an even number of factors.', a: 'Never', e: 'Factors come in pairs, but in a square one pair is the same number twice: 16 has 1, 2, 4, 8, 16, which is 5 factors.' },
  { k: ['primes'], s: 'A prime number is odd.', a: 'Sometimes', e: '3, 5 and 7 are odd, but 2 is prime and even.' },
  { k: ['divisibility'], s: 'If the digits of a number add up to a multiple of 3, the number divides exactly by 3.', a: 'Always', e: '372: 3 + 7 + 2 = 12, a multiple of 3, and 372 ÷ 3 = 124. This test always works.' },
  { k: ['fractions'], s: 'A fraction with a bigger denominator is smaller.', a: 'Sometimes', e: '1/8 is smaller than 1/4, but 7/8 is bigger than 1/4. The top number matters too.' },
  { k: ['equivFrac'], s: 'Multiplying the top and bottom of a fraction by the same number gives an equal fraction.', a: 'Always', e: '2/3 = 4/6 = 20/30. Each piece is cut into the same number of smaller pieces, so the amount stays the same.' },
  { k: ['area', 'perimeter'], s: 'Two rectangles with the same area have the same perimeter.', a: 'Sometimes', e: '1 cm by 12 cm and 3 cm by 4 cm both have area 12 cm², but perimeters of 26 cm and 14 cm.' },
  { k: ['shapes'], s: 'A square is a rectangle.', a: 'Always', e: 'A rectangle has four right angles and opposite sides equal. A square has all of that, and its sides are all equal too.' },
  { k: ['shapes'], s: 'A shape with four equal sides is a square.', a: 'Sometimes', e: 'A rhombus has four equal sides but its angles need not be right angles.' },
  { k: ['triangles'], s: 'A triangle can have two right angles.', a: 'Never', e: 'Two right angles already make 180°, leaving nothing for the third angle.' },
  { k: ['triangles'], s: 'The angles inside a triangle add up to 180°.', a: 'Always', e: 'Tear off the three corners and put them side by side: they always make a straight line.' },
  { k: ['angles'], s: 'An obtuse angle is bigger than a right angle.', a: 'Always', e: 'Obtuse means between 90° and 180°, so it is always more than a right angle (90°).' },
  { k: ['lines'], s: 'Parallel lines meet if you make them long enough.', a: 'Never', e: 'Parallel lines stay the same distance apart for ever, like the two rails of a railway line.' },
  { k: ['integers'], s: 'Taking away a negative number makes the answer bigger.', a: 'Always', e: '5 − (−3) = 8. Taking away a debt leaves you better off.' },
  { k: ['intMul'], s: 'A negative number times a negative number is negative.', a: 'Never', e: '(−3) × (−4) = 12. Negative times negative is always positive.' },
  { k: ['squares'], s: 'Squaring a number makes it bigger.', a: 'Sometimes', e: '5² = 25 is bigger, but 0.5² = 0.25 is smaller, and 1² = 1 stays the same.' },
  { k: ['roots'], s: 'The square root of a number is smaller than the number.', a: 'Sometimes', e: '√16 = 4 is smaller, but √0.25 = 0.5 is bigger, and √1 = 1.' },
  { k: ['algebra'], s: '2x is bigger than x.', a: 'Sometimes', e: 'If x = 3, 2x = 6 is bigger. If x = −3, 2x = −6 is smaller. If x = 0 they are equal.' },
  { k: ['brackets'], s: '3(x + 2) is the same as 3x + 2.', a: 'Never', e: '3(x + 2) = 3x + 6, which is always 4 more than 3x + 2.' },
  { k: ['bodmas'], s: 'a − b gives the same answer as b − a.', a: 'Sometimes', e: 'Only when a and b are equal: 5 − 5 = 0 both ways. 7 − 2 = 5 but 2 − 7 = −5.' },
  { k: ['bodmas'], s: 'a + b gives the same answer as b + a.', a: 'Always', e: 'Adding works in any order: 3 + 8 = 8 + 3 = 11.' },
  { k: ['mean'], s: 'The mean of a list of numbers is one of the numbers in the list.', a: 'Sometimes', e: 'The mean of 2, 4, 6 is 4, which is in the list. The mean of 1, 2 is 1.5, which is not.' },
  { k: ['mean'], s: 'The median is the middle number once the list is in order.', a: 'Always', e: 'That is what median means. With an even count, it is halfway between the two middle numbers.' },
  { k: ['percentChange'], s: 'If a price goes up by 10% and then down by 10%, it is back where it started.', a: 'Never', e: 'sh 100 up 10% is sh 110. Down 10% of sh 110 is sh 11, leaving sh 99.' },
  { k: ['percent'], s: '50% of a number is the same as half of it.', a: 'Always', e: '50% is 50 out of 100, which is one half.' },
  { k: ['time'], s: '1 hour 30 minutes is the same as 1.3 hours.', a: 'Never', e: '30 minutes is half of 60, so 1 hour 30 minutes is 1.5 hours.' },
  { k: ['probability'], s: 'A probability can be bigger than 1.', a: 'Never', e: 'A probability of 1 means certain. Nothing is more likely than certain.' },
  { k: ['probability'], s: 'When you roll a fair die, a 6 is harder to get than a 1.', a: 'Never', e: 'Every face of a fair die has the same chance: 1/6.' },
  { k: ['pythagoras'], s: 'The hypotenuse is the longest side of a right-angled triangle.', a: 'Always', e: 'It is opposite the biggest angle (90°), so it is always the longest side.' },
  { k: ['cubes'], s: 'A cube number is odd.', a: 'Sometimes', e: '27 = 3³ is odd, but 8 = 2³ is even.' },
  { k: ['rounding'], s: 'Rounding a number to the nearest 10 makes it bigger.', a: 'Sometimes', e: '47 rounds up to 50, but 43 rounds down to 40.' },
];

const asn = ({ s, a, e }) => {
  const other = ['Always', 'Sometimes', 'Never'].filter(x => x !== a);
  const why = {
    Always: 'Can you find an example where it fails? If you can, it is not always true.',
    Sometimes: a === 'Always' ? 'Try to find an example where it fails. Can you?' : 'Try a few different numbers, including fractions, decimals or negatives.',
    Never: 'Can you find even one example where it works?',
  };
  return {
    type: 'always-sometimes-never',
    instruction: 'Is this always true, sometimes true, or never true?',
    question: `"${s}"`,
    mc: ['Always', 'Sometimes', 'Never'],
    answer: a,
    accepts: [a, a.toLowerCase(), `${a.toLowerCase()} true`],
    hint: 'Try a few examples. Include small numbers, big numbers, and ones that are not whole numbers.',
    hints: ['Try a few examples. Include small numbers, big numbers, and ones that are not whole numbers.'],
    misconceptions: other.map(o => ({ when: o, feedback: why[o] })),
    explain: `${a}. ${e}`,
    solutionSteps: [e],
    solution: { steps: [{ text: e }], answer: a },
  };
};

// ---- which skills get which reasoning questions -----------------------------
const MAP = {
  G3_SUB: ['subtraction'], G4_SUB: ['subtraction'], G5_SUBTRACTION: ['subtraction'],
  G3_ADD: ['addition'], G4_ADD: ['addition', 'asn:add'], G5_ADDITION: ['addition', 'asn:add'],
  G4_MULTIPLY: ['asn:mul'], G5_MULTIPLICATION: ['asn:mul'], G4_DIVIDE: ['asn:div'], G5_DIVISION: ['asn:div'],
  G5_FACTORS: ['asn:factors'], G6_SQUARES: ['asn:squares'], G7_SQUARES_EXT: ['asn:squares'], G7_SQUARE_ROOTS: ['asn:roots'],
  G7_PRIMES: ['asn:primes'], G7_DIVISIBILITY: ['asn:divisibility'], G8_CUBES_CUBE_ROOTS: ['asn:cubes'],
  G4_PLACE_VALUE: ['placeValue', 'asn:rounding'], G5_PLACE_VALUE: ['placeValue', 'asn:rounding'], G6_PLACE_VALUE: ['placeValue'],
  G4_FRACTIONS: ['asn:fractions'], G5_FRACTIONS_INTRO: ['asn:fractions'], G7_FRACTIONS_COMPARE: ['asn:fractions'],
  G5_FRACTIONS_EQUIV: ['asn:equivFrac'], G5_FRACTIONS_ADD_LIKE: ['fractionsLike'],
  G6_FRACTIONS_ADD: ['fractionsUnlike'], G7_FRACTIONS_ADD_UNLIKE: ['fractionsUnlike'],
  G6_FRACTIONS_DIV: ['fractionsDiv', 'asn:divFrac'], G7_FRACTIONS_DIV: ['fractionsDiv', 'asn:divFrac'],
  G6_FRACTIONS_MUL: ['asn:mulFrac'], G7_FRACTIONS_MUL: ['asn:mulFrac'],
  G4_DECIMALS: ['asn:decimals'], G5_DECIMALS_INTRO: ['asn:decimals'], G7_DECIMAL_PV: ['asn:decimals'],
  G5_DECIMALS_ADD: ['decimalsAdd'], G6_DECIMALS_MUL: ['asn:mulDec'], G7_DECIMALS_MUL: ['asn:mulDec'],
  G6_DECIMALS_DIV: ['asn:divDec'], G7_DECIMALS_DIV: ['asn:divDec'],
  G6_BODMAS_BASIC: ['bodmas', 'asn:bodmas'], G7_BODMAS_ADV: ['bodmas', 'asn:bodmas'],
  G6_SIMPLE_EQUATIONS: ['equations'], G7_EQUATIONS_SOLVE: ['equations'], G8_LINEAR_EQ_ADV: ['equations'],
  G7_EXPRESSIONS: ['asn:algebra'], G7_SIMPLIFY: ['asn:algebra'], G8_EXPAND_BRACKETS: ['brackets', 'asn:brackets'],
  G6_PERCENTAGES_INTRO: ['percent', 'asn:percent'], G7_PERCENTAGES: ['percent', 'asn:percentChange'], G8_PERCENTAGE_CHANGE: ['asn:percentChange'],
  G4_TIME: ['time'], G5_TIME: ['time', 'asn:time'], G6_TIME: ['time', 'asn:time'],
  G5_PERIMETER_INTRO: ['perimeter', 'asn:perimeter'], G6_PERIMETER: ['perimeter', 'asn:perimeter'], G7_PERIMETER: ['perimeter'],
  G5_AREA_INTRO: ['perimeter', 'asn:area'], G6_AREA_RECT: ['perimeter', 'asn:area'], G4_AREA: ['asn:area'],
  G6_AREA_TRIANGLE: ['triangleArea'], G7_CIRCUMFERENCE: ['circumference'],
  G6_MEAN: ['mean', 'asn:mean'], G7_MEAN_MEDIAN_MODE: ['mean', 'asn:mean'],
  G6_UNIT_CONVERSIONS: ['units'], G5_LENGTH: ['units:len'], G7_LENGTH_CONV: ['units:len'], G5_MASS: ['units:mass'], G6_CAPACITY: ['units:cap'],
  G6_INTEGERS_ADD_SUB: ['integers', 'asn:integers'], G7_TEMPERATURE: ['integers'], G7_INTEGERS_MUL_DIV: ['asn:intMul'],
  G7_PYTHAGORAS: ['pythagoras', 'asn:pythagoras'], G8_INDICES_LAWS: ['indices'], G8_INDICES_INTRO: ['indices'],
  G6_RATIOS: ['ratio'], G8_RATIO_PROPORTION: ['ratio'],
  G8_SIMPLE_INTEREST: ['interest'], G7_SPEED: ['speed'], G8_PROFIT_LOSS: ['profit'],
  G4_MONEY: ['money'], G5_MONEY: ['money'], G6_MONEY: ['money'], G7_MONEY: ['money'],
  G4_PLANE_FIGURES: ['asn:shapes'], G6_SYMMETRY: ['asn:shapes'],
  G5_TRIANGLES_INTRO: ['asn:triangles'], G6_TRIANGLE_PROPERTIES: ['asn:triangles'],
  G5_ANGLES_INTRO: ['asn:angles'], G6_ANGLE_MEASURE: ['asn:angles'], G5_LINES: ['asn:lines'], G6_LINES: ['asn:lines'],
  G8_PROBABILITY_INTRO: ['asn:probability'],
};

export const hasReasoning = (skillId) => !!MAP[skillId];

export function reasoningFor(skillId, kind) {
  const opts = MAP[skillId];
  if (!opts) return null;
  const pool = kind === 'spot' ? opts.filter(o => !o.startsWith('asn:')) : kind === 'asn' ? opts.filter(o => o.startsWith('asn:')) : opts;
  if (!pool.length) return null;
  const choice = pick(pool);
  if (choice.startsWith('asn:')) {
    const key = choice.slice(4);
    const bank = ASN.filter(x => x.k.includes(key));
    return bank.length ? asn(pick(bank)) : null;
  }
  const [name, arg] = choice.split(':');
  return SPOT[name] ? SPOT[name](arg) : null;
}

export const REASONING_SPOT_KINDS = Object.keys(SPOT);
export const ASN_BANK = ASN;
