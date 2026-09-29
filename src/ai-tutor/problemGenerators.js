// ============================================================================
// PROBLEM GENERATORS — Every skill gets a generator
// Each returns { question, answer, accepts?, hint?, workedExample? }
// workedExample: { problem, steps[], solution } for KP-based lessons
// ============================================================================

import { SKILLS } from './knowledgeGraph.js';
import { STRUCTURED_CONTENT } from './content/index.js';
import { PRIMARY_ALIAS } from './content/primary.js';
import { checkAnswerMatch } from './answerCheck.js';

// Structured, pedagogically-complete content (worked example + scaffolded steps
// + hint ladder + misconception feedback + verified answers) lives in
// ./content and takes precedence over the legacy generators below.

// ==================== HELPERS ====================
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b);
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
const primeFactorize = (n) => { const f = []; let d = 2; let num = n; while (num > 1) { while (num % d === 0) { f.push(d); num /= d; } d++; } return f; };
const simplifyFraction = (n, d) => { const g = gcd(Math.abs(n), Math.abs(d)); return [n / g, d / g]; };
const roundTo = (n, dp) => Number(n.toFixed(dp));

// Format fraction answer, handling improper fractions
const formatFraction = (num, den) => {
  if (den === 1) return `${num}`;
  const [sn, sd] = simplifyFraction(num, den);
  if (sd === 1) return `${sn}`;
  if (Math.abs(sn) > sd) {
    const whole = Math.floor(Math.abs(sn) / sd);
    const rem = Math.abs(sn) % sd;
    const sign = sn < 0 ? '-' : '';
    if (rem === 0) return `${sign}${whole}`;
    return `${sign}${whole} ${rem}/${sd}`;
  }
  return `${sn}/${sd}`;
};

// ==================== WORKED EXAMPLE TEMPLATES ====================
// Each skill can have multiple KP templates with worked examples

const makeWorkedExample = (problem, steps, solution, opts = {}) => ({
  problem, steps, solution,
  ...(opts.whySteps ? { whySteps: opts.whySteps } : {}),
  ...(opts.definitions ? { definitions: opts.definitions } : {}),
});

// ==================== GENERATORS ====================

// ---- lines, capacity (found by scripts/audit-answers.mjs: these skills had
//      only 2-3 questions, and capacity asked about grams) ----
const LINES_G5 = [
  { q: 'Lines that never meet, however far they go, are called ___ lines.', a: 'parallel' },
  { q: 'Lines that meet at a right angle are called ___ lines.', a: 'perpendicular' },
  { q: 'Lines that cross each other are called ___ lines.', a: 'intersecting', acc: ['intersecting', 'crossing'] },
  { q: 'The two rails of a railway line are parallel or perpendicular?', a: 'parallel' },
  { q: 'At the corner of an exercise book page, the two edges meet at 90°. Are they parallel or perpendicular?', a: 'perpendicular' },
  { q: 'In the letter T, the two lines are parallel or perpendicular?', a: 'perpendicular' },
  { q: 'In the letter H, the two upright lines are parallel or perpendicular?', a: 'parallel' },
  { q: 'Two lines cross, but not at a right angle. Are they parallel, perpendicular or intersecting?', a: 'intersecting' },
  { q: 'A line that goes straight across, like the horizon, is horizontal or vertical?', a: 'horizontal' },
  { q: 'A line that goes straight up and down, like a flag pole, is horizontal or vertical?', a: 'vertical' },
  { q: 'Perpendicular lines meet at an angle of how many degrees?', a: '90', acc: ['90', '90°', 'right angle'] },
  { q: 'Where two perpendicular lines cross, how many right angles are made?', a: '4' },
];
const LINES_G6 = [
  { q: 'The opposite sides of a rectangle are parallel or perpendicular?', a: 'parallel' },
  { q: 'Two sides of a square that meet at a corner are parallel or perpendicular?', a: 'perpendicular' },
  { q: 'How many pairs of parallel sides does a rectangle have?', a: '2' },
  { q: 'How many pairs of parallel sides does a trapezium have?', a: '1' },
  { q: 'How many pairs of parallel sides does a parallelogram have?', a: '2' },
  { q: 'A horizontal line and a vertical line meet. Are they parallel or perpendicular?', a: 'perpendicular' },
];
const linesQuestion = (bank) => {
  const t = pick(bank);
  return { question: t.q, answer: t.a, ...(t.acc ? { accepts: t.acc } : {}),
    hint: 'Parallel lines run side by side and never meet (like rails). Perpendicular lines cross at a right angle (like a + sign).' };
};
const capacityQuestion = (wordProblems) => pick([
  () => { const l = rand(1, 9) + pick([0, 0.25, 0.5, 0.75]); return { question: `How many millilitres are in ${l} litres?`, answer: String(Math.round(l * 1000)), hint: '1 litre = 1000 ml, so multiply the litres by 1000.' }; },
  () => { const ml = rand(1, 36) * 250; return { question: `How many litres are in ${ml.toLocaleString('en-US')} ml?`, answer: String(ml / 1000), hint: '1000 ml = 1 litre, so divide the millilitres by 1000.' }; },
  () => { const l = rand(1, 4), ml = rand(1, 9) * 100 + pick([0, 50]); return { question: `Write ${l} l ${ml} ml in millilitres.`, answer: String(l * 1000 + ml), hint: `${l} l = ${l * 1000} ml. Then add the ${ml} ml.` }; },
  ...(wordProblems ? [
    () => { const jc = pick([5, 10, 20]), b = pick([250, 500]); return { question: `A ${jc} litre jerrycan of water fills how many ${b} ml bottles?`, answer: String(jc * 1000 / b), hint: `${jc} litres = ${jc * 1000} ml. How many ${b} ml bottles is that?` }; },
    () => { const d = pick([250, 500, 750]), n = pick([4, 8, 12]); return { question: `Mama uses ${d} ml of milk a day. How many litres does she use in ${n} days?`, answer: String(d * n / 1000), hint: `${d} ml × ${n} = ${d * n} ml. Divide by 1000 for litres.` }; },
    () => { const t = rand(2, 9) * 100, u = rand(20, 80); return { question: `A tank holds ${t} litres. ${u} litres are used on Monday and ${u + 15} litres on Tuesday. How many litres are left?`, answer: String(t - u - (u + 15)), hint: 'Take both amounts away from what the tank held.' }; },
  ] : [
    () => { const c = pick([250, 500]), n = rand(2, 8); return { question: `A cup holds ${c} ml. How many millilitres are in ${n} cups?`, answer: String(c * n), hint: `Multiply ${c} by ${n}.` }; },
  ]),
])();

const generators = {
  // ======================== GRADE 5 ========================

  G5_PLACE_VALUE: () => {
    const num = rand(1000, 9999);
    const pos = pick(['thousands', 'hundreds', 'tens', 'ones']);
    const mults = { thousands: 1000, hundreds: 100, tens: 10, ones: 1 };
    const digit = Math.floor(num / mults[pos]) % 10;
    return { question: `What digit is in the ${pos} place of ${num.toLocaleString()}?`, answer: digit.toString(),
      workedExample: makeWorkedExample(`What digit is in the hundreds place of 4,567?`, ['The number 4,567 has digits: 4 (thousands), 5 (hundreds), 6 (tens), 7 (ones)', 'The hundreds digit is 5'], '5') };
  },

  G5_ADDITION: () => {
    const a = rand(100, 999), b = rand(100, 999);
    return { question: `${a} + ${b} = ?`, answer: (a + b).toString(),
      workedExample: makeWorkedExample('234 + 567 = ?', ['Line up the digits by place value', '4 + 7 = 11, write 1 carry 1', '3 + 6 + 1 = 10, write 0 carry 1', '2 + 5 + 1 = 8', 'Read the digits: 234 + 567 = 801'], '801') };
  },

  G5_SUBTRACTION: () => {
    const a = rand(200, 999), b = rand(100, a - 1);
    return { question: `${a} - ${b} = ?`, answer: (a - b).toString(),
      workedExample: makeWorkedExample('543 - 278 = ?', ['Line up digits. Start from ones: 3 - 8, need to borrow', '13 - 8 = 5', '3 (was 4, borrowed 1) - 7, borrow again: 13 - 7 = 6', '4 (was 5, borrowed 1) - 2 = 2', 'Read the digits: 543 - 278 = 265'], '265') };
  },

  G5_MULTIPLICATION: () => {
    const a = rand(12, 99), b = rand(2, 9);
    return { question: `${a} × ${b} = ?`, answer: (a * b).toString(),
      workedExample: makeWorkedExample('34 × 7 = ?', ['Multiply ones: 4 × 7 = 28, write 8 carry 2', 'Multiply tens: 3 × 7 = 21, add carry 2 = 23'], '238') };
  },

  G5_DIVISION: () => {
    const b = rand(2, 9), result = rand(10, 99), a = b * result;
    return { question: `${a} ÷ ${b} = ?`, answer: result.toString(),
      workedExample: makeWorkedExample('156 ÷ 6 = ?', ['How many 6s in 15? 2 × 6 = 12, remainder 3', 'Bring down 6: 36 ÷ 6 = 6'], '26') };
  },

  G5_FACTORS: () => {
    const nums = [12, 16, 18, 20, 24, 28, 30, 36];
    const n = pick(nums);
    const factors = [];
    for (let i = 1; i <= n; i++) if (n % i === 0) factors.push(i);
    const askFor = pick(['smallest factor greater than 1', 'largest factor less than ' + n, 'number of factors']);
    let answer;
    if (askFor.includes('smallest')) answer = factors[1].toString();
    else if (askFor.includes('largest')) answer = factors[factors.length - 2].toString();
    else answer = factors.length.toString();
    return { question: `What is the ${askFor} of ${n}?`, answer, hint: `Factors of ${n}: ${factors.join(', ')}`,
      definitions: { 'Factor': 'A number that divides evenly into another number with no remainder. For example, 3 is a factor of 12 because 12 \u00F7 3 = 4 exactly.' } };
  },

  G5_MULTIPLES: () => {
    const n = rand(2, 12), nth = rand(3, 10);
    return { question: `What is the ${nth}${nth === 3 ? 'rd' : 'th'} multiple of ${n}?`, answer: (n * nth).toString(),
      hint: `Multiples of ${n}: ${n}, ${n*2}, ${n*3}, ...`,
      definitions: { 'Multiple': `A multiple of ${n} is what you get when you multiply ${n} by a whole number (1, 2, 3...). Think of it as the ${n}-times table.` } };
  },

  G5_FRACTIONS_INTRO: () => {
    const den = pick([2, 3, 4, 5, 6, 8]);
    const num = rand(1, den - 1);
    const total = den * rand(2, 5);
    const part = num * (total / den);
    return {
      question: `What is ${num}/${den} of ${total}?`, answer: part.toString(),
      hint: 'To find a fraction of a number: divide by the bottom number (denominator), then multiply by the top number (numerator).',
      definitions: {
        'Numerator': 'The top number of a fraction. It tells you how many parts you are taking.',
        'Denominator': 'The bottom number of a fraction. It tells you how many equal parts the whole is divided into.',
      },
      workedExample: makeWorkedExample('What is 3/4 of 20?',
        ['Divide 20 by 4 = 5', 'Multiply 5 by 3 = 15'], '15',
        {
          definitions: {
            'Numerator': 'The top number (3). How many parts we want.',
            'Denominator': 'The bottom number (4). How many equal parts the whole is split into.',
          },
          whySteps: [
            'We divide by the denominator (4) first to find out how big one part is. 20 split into 4 equal parts = 5 each.',
            'Then multiply by the numerator (3) because we want 3 of those parts. 3 parts of size 5 = 15.'
          ]
        }
      )
    };
  },

  G5_FRACTIONS_EQUIV: () => {
    const d1 = pick([2, 3, 4, 5]), n1 = rand(1, d1 - 1), mult = rand(2, 5);
    const d2 = d1 * mult, n2 = n1 * mult;
    return rand(0, 1)
      ? { question: `${n1}/${d1} = ?/${d2}`, answer: n2.toString() }
      : { question: `${n2}/${d2} = ?/${d1}`, answer: n1.toString() };
  },

  G5_FRACTIONS_ADD_LIKE: () => {
    const d = pick([3, 4, 5, 6, 8]);
    const n1 = rand(1, d - 2), n2 = rand(1, d - n1);
    const sum = n1 + n2;
    return { question: `${n1}/${d} + ${n2}/${d} = ?`, answer: formatFraction(sum, d),
      accepts: [formatFraction(sum, d), `${sum}/${d}`] };
  },

  G5_FRACTIONS_SUB_LIKE: () => {
    const d = pick([3, 4, 5, 6, 8]);
    const n1 = rand(2, d - 1), n2 = rand(1, n1 - 1);
    const diff = n1 - n2;
    return { question: `${n1}/${d} - ${n2}/${d} = ?`, answer: formatFraction(diff, d),
      accepts: [formatFraction(diff, d), `${diff}/${d}`] };
  },

  G5_DECIMALS_INTRO: () => {
    const d = pick([2, 4, 5, 10]);
    const n = rand(1, d - 1);
    const decimal = (n / d).toString();
    return rand(0, 1)
      ? { question: `Convert ${n}/${d} to a decimal`, answer: decimal }
      : { question: `What is ${decimal} as a fraction?`, answer: formatFraction(n, d), accepts: [formatFraction(n, d), `${n}/${d}`] };
  },

  G5_DECIMALS_ADD: () => {
    const a = roundTo(rand(10, 99) / 10, 1), b = roundTo(rand(10, 50) / 10, 1);
    return { question: `${a.toFixed(1)} + ${b.toFixed(1)} = ?`, answer: roundTo(a + b, 1).toString() };
  },

  G5_DECIMALS_SUB: () => {
    const a = roundTo(rand(50, 99) / 10, 1), b = roundTo(rand(10, Math.floor(a * 10) - 1) / 10, 1);
    return { question: `${a.toFixed(1)} - ${b.toFixed(1)} = ?`, answer: roundTo(a - b, 1).toString() };
  },

  G5_ANGLES_INTRO: () => {
    const angle = rand(10, 170);
    let type;
    if (angle < 90) type = 'acute';
    else if (angle === 90) type = 'right';
    else type = 'obtuse';
    return { question: `Is a ${angle}° angle acute, right, or obtuse?`, answer: type,
      hint: 'Acute: < 90°, Right: = 90°, Obtuse: > 90°' };
  },

  G5_TRIANGLES_INTRO: () => {
    const kind = rand(0, 5);
    if (kind === 0) { const a = rand(3, 12); return { question: `A triangle has sides ${a} cm, ${a} cm and ${a} cm. What type of triangle is it?`, answer: 'equilateral', hint: 'All three sides are the same length.' }; }
    if (kind === 1) { const a = rand(5, 12), b = rand(3, a + 3 === a ? 4 : a - 1); return { question: `A triangle has sides ${a} cm, ${a} cm and ${b} cm. What type of triangle is it?`, answer: 'isosceles', hint: 'Look for two sides that are the same length.' }; }
    if (kind === 2) { const a = rand(4, 7), b = a + rand(1, 2), c = b + rand(1, 2); return { question: `A triangle has sides ${a} cm, ${b} cm and ${c} cm. What type of triangle is it?`, answer: 'scalene', hint: 'Are any two sides the same length?' }; }
    if (kind === 3) { const a = rand(20, 70); return { question: `A triangle has angles of 90°, ${a}° and ${90 - a}°. Is it acute-angled, right-angled or obtuse-angled?`, answer: 'right-angled', accepts: ['right-angled', 'right angled', 'right'], hint: 'One of the angles is exactly 90°.' }; }
    if (kind === 4) { const a = rand(100, 140), b = rand(10, 180 - a - 10); return { question: `A triangle has angles of ${a}°, ${b}° and ${180 - a - b}°. Is it acute-angled, right-angled or obtuse-angled?`, answer: 'obtuse-angled', accepts: ['obtuse-angled', 'obtuse angled', 'obtuse'], hint: 'Is one angle bigger than 90°?' }; }
    const a = rand(50, 80), b = rand(Math.max(20, 91 - a), 80); return { question: `A triangle has angles of ${a}°, ${b}° and ${180 - a - b}°. Is it acute-angled, right-angled or obtuse-angled?`, answer: 'acute-angled', accepts: ['acute-angled', 'acute angled', 'acute'], hint: 'Are all three angles smaller than 90°?' };
  },

  G5_LINES: () => linesQuestion(LINES_G5),
  G6_LINES: () => linesQuestion([...LINES_G5, ...LINES_G6]),

  G5_LENGTH: () => pick([
    () => { const m = rand(2, 9) + pick([0, 0.5]); return { question: `How many centimetres are in ${m} m?`, answer: String(Math.round(m * 100)), hint: '1 metre = 100 cm, so multiply the metres by 100.' }; },
    () => { const m = rand(2, 60); return { question: `How many metres are in ${m * 100} cm?`, answer: String(m), hint: '100 cm = 1 metre, so divide the centimetres by 100.' }; },
    () => { const c = rand(2, 30) + pick([0, 0.5]); return { question: `How many millimetres are in ${c} cm?`, answer: String(Math.round(c * 10)), hint: '1 cm = 10 mm, so multiply the centimetres by 10.' }; },
    () => { const k = rand(2, 15); return { question: `How many kilometres are in ${(k * 1000).toLocaleString('en-US')} m?`, answer: String(k), hint: '1000 m = 1 km, so divide the metres by 1000.' }; },
    () => { const m = rand(1, 5), c = rand(5, 95); return { question: `Write ${m} m ${c} cm in centimetres.`, answer: String(m * 100 + c), hint: `${m} m = ${m * 100} cm. Then add the ${c} cm.` }; },
    () => { const a = rand(2, 9) * 100 + rand(1, 9) * 10, b = rand(2, 9) * 100; return { question: `Wanjiru walked ${a} m to the shop and ${b} m to school. How many metres did she walk altogether?`, answer: String(a + b), hint: 'Add the two distances.' }; },
  ])(),

  G4_MASS: () => pick([
    () => { const it = pick([['a bag of maize', 'kilograms'], ['a sack of potatoes', 'kilograms'], ['a child', 'kilograms'], ['a pencil', 'grams'], ['a sweet', 'grams'], ['an egg', 'grams'], ['a jerrycan of water', 'litres'], ['a cup of tea', 'millilitres'], ['a spoon of medicine', 'millilitres'], ['a water tank', 'litres']]);
      const unitsFor = /litres|millilitres/.test(it[1]) ? 'litres or millilitres' : 'grams or kilograms';
      const acc = { kilograms: ['kilograms', 'kilogram', 'kg'], grams: ['grams', 'gram', 'g'], litres: ['litres', 'litre', 'liters', 'l'], millilitres: ['millilitres', 'millilitre', 'milliliters', 'ml'] }[it[1]];
      return { question: `Would you measure ${it[0]} in ${unitsFor}?`, answer: it[1], accepts: acc, choices: unitsFor.split(' or '), hint: 'Small, light things use the small unit. Big, heavy things use the big unit.' }; },
    () => { const k = rand(2, 9); return { question: `How many grams are in ${k} kg?`, answer: String(k * 1000), hint: '1 kg = 1000 g.' }; },
    () => { const l = rand(2, 9); return { question: `How many millilitres are in ${l} litres?`, answer: String(l * 1000), hint: '1 litre = 1000 ml.' }; },
    () => { const k = rand(2, 9); return { question: `How many kilograms are in ${(k * 1000).toLocaleString('en-US')} g?`, answer: String(k), hint: '1000 g = 1 kg.' }; },
  ])(),

  G5_MASS: () => pick([
    () => { const k = rand(1, 9) + pick([0, 0.25, 0.5, 0.75]); return { question: `How many grams are in ${k} kg?`, answer: String(Math.round(k * 1000)), hint: '1 kg = 1000 g, so multiply the kilograms by 1000.' }; },
    () => { const g = rand(1, 36) * 250; return { question: `How many kilograms are in ${g.toLocaleString('en-US')} g?`, answer: String(g / 1000), hint: '1000 g = 1 kg, so divide the grams by 1000.' }; },
    () => { const k = rand(1, 4), g = rand(1, 9) * 100 + pick([0, 50]); return { question: `Write ${k} kg ${g} g in grams.`, answer: String(k * 1000 + g), hint: `${k} kg = ${k * 1000} g. Then add the ${g} g.` }; },
    () => { const pk = pick([250, 500]), k = rand(2, 5); return { question: `A packet of sugar weighs ${pk} g. How many packets make ${k} kg?`, answer: String(k * 1000 / pk), hint: `${k} kg = ${k * 1000} g. How many ${pk} g packets fit into that?` }; },
    () => { const a = rand(2, 6) * 250, b = rand(2, 6) * 250; return { question: `Otieno bought ${a} g of rice and ${b} g of beans. What is the total mass in grams?`, answer: String(a + b), hint: 'Add the two masses.' }; },
  ])(),

  G5_CAPACITY: () => capacityQuestion(false),
  G6_CAPACITY: () => capacityQuestion(true),

  G6_MASS: () => pick([
    () => { const t = rand(1, 9) + pick([0, 0.5, 0.25]); return { question: `How many kilograms are in ${t} tonnes?`, answer: String(Math.round(t * 1000)), hint: '1 tonne = 1000 kg.' }; },
    () => { const kg = rand(1, 30) * 500; return { question: `How many tonnes are in ${kg.toLocaleString('en-US')} kg?`, answer: String(kg / 1000), hint: '1000 kg = 1 tonne, so divide by 1000.' }; },
    () => { const bag = pick([50, 90, 100]), n = rand(10, 60); const t = bag * n / 1000; return { question: `A lorry carries ${t} tonnes of maize in ${bag} kg bags. How many bags is that?`, answer: String(n), hint: `${t} tonnes = ${bag * n} kg. Divide by ${bag}.` }; },
    () => { const bag = pick([2, 5]), n = rand(3, 12), pr = pick([150, 180, 200, 250]); return { question: `Flour costs KSh ${pr} for a ${bag} kg packet. How much do ${n * bag} kg cost?`, answer: String(n * pr), hint: `${n * bag} kg is ${n} packets of ${bag} kg.` }; },
    () => { const a = rand(1, 4), b = rand(1, 9) * 100, c = rand(1, 9) * 100; return { question: `A basket holds ${a} kg ${b} g of mangoes. ${c} g more are added. What is the total in grams?`, answer: String(a * 1000 + b + c), hint: `Change ${a} kg ${b} g into grams first.` }; },
  ])(),

  G5_TIME: () => {
    const h1 = rand(8, 11), m1 = rand(0, 3) * 15;
    const durH = rand(1, 3), durM = pick([0, 15, 30, 45]);
    let h2 = h1 + durH, m2 = m1 + durM;
    if (m2 >= 60) { h2++; m2 -= 60; }
    return { question: `A lesson starts at ${h1}:${m1.toString().padStart(2, '0')} and lasts ${durH} hour${durH > 1 ? 's' : ''}${durM > 0 ? ` ${durM} minutes` : ''}. When does it end?`,
      answer: `${h2}:${m2.toString().padStart(2, '0')}`, accepts: [`${h2}:${m2.toString().padStart(2, '0')}`, `${h2 > 12 ? h2 - 12 : h2}:${m2.toString().padStart(2, '0')}`],
      hint: `Add the hours first (${h1} + ${durH}), then add the minutes${durM ? ` (${m1} + ${durM})` : ''} — if minutes reach 60, that's one more hour.` };
  },

  G5_PERIMETER_INTRO: () => {
    const l = rand(5, 20), w = rand(3, 15);
    return { question: `Perimeter of a rectangle: length ${l} cm, width ${w} cm?`, answer: (2 * (l + w)).toString(),
      workedExample: makeWorkedExample('Perimeter of a rectangle: length 8 cm, width 5 cm?', ['P = 2 × (length + width)', 'P = 2 × (8 + 5)', 'P = 2 × 13 = 26 cm'], '26'),
      hint: 'P = 2 × (length + width)' };
  },

  G5_AREA_INTRO: () => {
    const l = rand(3, 12), w = rand(2, 10);
    return { question: `Area of a rectangle: ${l} cm × ${w} cm?`, answer: (l * w).toString(),
      hint: 'A = length × width' };
  },

  G5_TALLY: () => {
    const items = ['apples', 'bananas', 'oranges', 'mangoes'];
    const counts = items.map(() => rand(3, 15));
    const ask = rand(0, items.length - 1);
    return { question: `In a survey: ${items.map((it, i) => `${it}: ${counts[i]}`).join(', ')}. How many ${items[ask]} were counted?`, answer: counts[ask].toString(),
      hint: `Find "${items[ask]}" in the list and read the number right after it.` };
  },

  G5_BAR_GRAPHS: () => {
    const a = rand(10, 30), b = rand(10, 30), c = rand(10, 30);
    return { question: `A bar graph shows: Mon=${a}, Tue=${b}, Wed=${c} visitors. What is the total?`, answer: (a + b + c).toString(),
      hint: `Total means add all three bars: ${a} + ${b} + ${c}.` };
  },

  G5_PICTOGRAPHS: () => {
    const val = pick([2, 5, 10]);
    const symbols = rand(3, 8);
    return { question: `In a pictograph, each symbol = ${val} items. If there are ${symbols} symbols, how many items?`, answer: (val * symbols).toString(),
      hint: `Each symbol stands for ${val}, so multiply: ${symbols} × ${val}.` };
  },

  // ======================== GRADE 6 ========================

  G6_PLACE_VALUE: () => {
    const num = rand(1000000, 9999999);
    const pos = pick(['millions', 'hundred thousands', 'ten thousands']);
    const mults = { millions: 1000000, 'hundred thousands': 100000, 'ten thousands': 10000 };
    return { question: `What digit is in the ${pos} place of ${num.toLocaleString()}?`, answer: (Math.floor(num / mults[pos]) % 10).toString() };
  },

  G6_BODMAS_BASIC: () => {
    const templates = [
      () => { const a = rand(5, 15), b = rand(2, 8), c = rand(2, 5); return { q: `${a} + ${b} × ${c}`, a: a + b * c }; },
      () => { const a = rand(20, 40), b = rand(2, 5), c = rand(2, 5); return { q: `${a} - ${b} × ${c}`, a: a - b * c }; },
      () => { const a = rand(3, 10), b = rand(2, 8), c = rand(2, 4); return { q: `(${a} + ${b}) × ${c}`, a: (a + b) * c }; },
    ];
    const t = pick(templates)();
    return { question: `Calculate: ${t.q}`, answer: t.a.toString(),
      workedExample: makeWorkedExample('Calculate: 5 + 3 × 4', ['BODMAS: Multiplication before Addition', '3 × 4 = 12', '5 + 12 = 17'], '17'),
      hint: 'BODMAS: Brackets, Orders, Division, Multiplication, Addition, Subtraction' };
  },

  G6_FRACTIONS_ADD: () => {
    const d1 = pick([2, 3, 4, 5, 6]), d2 = pick([2, 3, 4, 5, 6].filter(x => x !== d1));
    const n1 = rand(1, d1 - 1), n2 = rand(1, d2 - 1);
    const cd = lcm(d1, d2);
    const sum = n1 * (cd / d1) + n2 * (cd / d2);
    return { question: `${n1}/${d1} + ${n2}/${d2} = ?`, answer: formatFraction(sum, cd),
      workedExample: makeWorkedExample('1/3 + 1/4 = ?', ['Find LCD: LCM of 3 and 4 = 12', '1/3 = 4/12', '1/4 = 3/12', '4/12 + 3/12 = 7/12'], '7/12'),
      hint: 'Find the LCD, convert, then add numerators' };
  },

  G6_FRACTIONS_SUB: () => {
    const d1 = pick([2, 3, 4, 5, 6]), d2 = pick([2, 3, 4, 5, 6].filter(x => x !== d1));
    let n1 = rand(1, d1 - 1), n2 = rand(1, d2 - 1);
    const cd = lcm(d1, d2);
    let diff = n1 * (cd / d1) - n2 * (cd / d2);
    if (diff <= 0) { [n1, n2] = [n2, n1]; diff = -diff; const temp = d1; }
    const actualDiff = n1 * (cd / d1) - n2 * (cd / d2);
    if (actualDiff <= 0) return generators.G6_FRACTIONS_ADD(); // fallback
    return { question: `${n1}/${d1} - ${n2}/${d2} = ?`, answer: formatFraction(actualDiff, cd) };
  },

  G6_FRACTIONS_MUL: () => {
    const n1 = rand(1, 4), d1 = rand(2, 5), n2 = rand(1, 4), d2 = rand(2, 5);
    const numAns = n1 * n2, denAns = d1 * d2;
    return { question: `${n1}/${d1} × ${n2}/${d2} = ?`, answer: formatFraction(numAns, denAns),
      workedExample: makeWorkedExample('2/3 × 3/5 = ?', ['Multiply numerators: 2 × 3 = 6', 'Multiply denominators: 3 × 5 = 15', '6/15 simplifies to 2/5'], '2/5'),
      hint: 'Multiply tops, multiply bottoms, then simplify' };
  },

  G6_FRACTIONS_DIV: () => {
    const n1 = rand(1, 4), d1 = rand(2, 5), n2 = rand(1, 3), d2 = rand(2, 4);
    const numAns = n1 * d2, denAns = d1 * n2;
    return { question: `${n1}/${d1} ÷ ${n2}/${d2} = ?`, answer: formatFraction(numAns, denAns),
      hint: 'Keep, Change, Flip: Keep first, change ÷ to ×, flip the second fraction' };
  },

  G6_MIXED_NUMBERS: () => {
    const whole = rand(1, 5), num = rand(1, 3), den = rand(num + 1, 6);
    const improper = whole * den + num;
    return rand(0, 1)
      ? { question: `Convert ${whole} ${num}/${den} to an improper fraction`, answer: `${improper}/${den}` }
      : { question: `Convert ${improper}/${den} to a mixed number`, answer: `${whole} ${num}/${den}` };
  },

  G6_DECIMALS_MUL: () => {
    const a = roundTo(rand(11, 99) / 10, 1), b = rand(2, 9);
    return { question: `${a.toFixed(1)} × ${b} = ?`, answer: roundTo(a * b, 1).toString(),
      workedExample: makeWorkedExample('3.4 × 5 = ?', ['Ignore decimal: 34 × 5 = 170', 'Original had 1 decimal place', 'Answer: 17.0 = 17'], '17') };
  },

  G6_DECIMALS_DIV: () => {
    const divisor = pick([2, 4, 5]), result = roundTo(rand(10, 50) / 10, 1);
    const dividend = roundTo(result * divisor, 1);
    return { question: `${dividend} ÷ ${divisor} = ?`, answer: result.toString() };
  },

  G6_FRACTIONS_DECIMALS: () => {
    const pairs = [[1, 4, '0.25'], [1, 2, '0.5'], [3, 4, '0.75'], [1, 5, '0.2'], [2, 5, '0.4'], [3, 5, '0.6']];
    const [n, d, dec] = pick(pairs);
    return rand(0, 1)
      ? { question: `Convert ${n}/${d} to a decimal`, answer: dec }
      : { question: `Convert ${dec} to a fraction`, answer: formatFraction(n, d) };
  },

  G6_PERCENTAGES_INTRO: () => {
    const pct = pick([10, 20, 25, 50, 75]), total = pick([40, 60, 80, 100, 120, 200]);
    return { question: `What is ${pct}% of ${total}?`, answer: (pct / 100 * total).toString(),
      workedExample: makeWorkedExample('What is 25% of 80?', ['25% = 25/100 = 1/4', '80 ÷ 4 = 20'], '20'),
      hint: 'Percentage means "per hundred". Divide by 100, then multiply.' };
  },

  G6_RATIOS: () => {
    const a = rand(2, 6), b = rand(2, 6), total = (a + b) * rand(2, 5);
    const partA = (total / (a + b)) * a;
    return { question: `Share ${total} in the ratio ${a}:${b}. What is the larger share?`, answer: Math.max(partA, total - partA).toString(),
      hint: 'Total parts = sum of ratio. Find value per part, then multiply.' };
  },

  G6_INTEGERS_INTRO: () => {
    const a = rand(-10, -1), b = rand(-10, -1);
    return { question: `Which is greater: ${a} or ${b}?`, answer: Math.max(a, b).toString(),
      hint: 'On a number line, numbers to the right are greater' };
  },

  G6_INTEGERS_ADD_SUB: () => {
    const templates = [
      () => { const a = rand(-10, 10), b = rand(-10, 10); return { q: `${a} + (${b})`, a: a + b }; },
      () => { const a = rand(-10, 10), b = rand(-10, 10); return { q: `${a} - (${b})`, a: a - b }; },
    ];
    const t = pick(templates)();
    return { question: `Calculate: ${t.q}`, answer: t.a.toString() };
  },

  G6_SQUARES: () => {
    const n = rand(2, 12);
    return { question: `${n}² = ?`, answer: (n * n).toString(),
      hint: `Squaring means multiplying a number by itself: ${n} × ${n}.` };
  },

  G6_PATTERNS: () => {
    const start = rand(2, 10), step = rand(2, 5);
    const seq = Array.from({ length: 5 }, (_, i) => start + step * i);
    return { question: `What comes next: ${seq.join(', ')}, ...?`, answer: (start + step * 5).toString(), hint: `Look for the common difference` };
  },

  G6_SIMPLE_EQUATIONS: () => {
    const x = rand(2, 15), a = rand(2, 10);
    const type = rand(0, 1);
    if (type === 0) return { question: `x + ${a} = ${x + a}. Find x.`, answer: x.toString(), hint: `Undo the +${a}: subtract ${a} from both sides.` };
    return { question: `x - ${a} = ${x - a}. Find x.`, answer: x.toString(), hint: `Undo the -${a}: add ${a} to both sides.` };
  },

  G6_ANGLE_MEASURE: () => {
    const angle = rand(20, 160);
    const type = angle < 90 ? 'acute' : angle === 90 ? 'right' : 'obtuse';
    return { question: `An angle measures ${angle}°. Is it acute, right, or obtuse?`, answer: type,
      hint: 'Acute is less than 90°, right is exactly 90°, obtuse is more than 90°.' };
  },

  G6_ANGLE_PROPERTIES: () => {
    const a = rand(30, 150);
    const type = rand(0, 1);
    if (type === 0) return { question: `Two angles on a straight line. One is ${a}°. What is the other?`, answer: (180 - a).toString(), hint: 'Angles on a straight line sum to 180°' };
    return { question: `Two angles at a point. One is ${a}°. The other three are equal. Find each.`, answer: ((360 - a) / 3).toString(), hint: 'Angles at a point sum to 360°' };
  },

  G6_TRIANGLE_PROPERTIES: () => {
    const a = rand(30, 80), b = rand(30, 80);
    return { question: `Two angles of a triangle are ${a}° and ${b}°. Find the third angle.`, answer: (180 - a - b).toString(),
      hint: 'Angles in a triangle sum to 180°' };
  },

  G6_SYMMETRY: () => {
    const n = rand(5, 12);
    const shapes = [{ s: 'square', l: 4 }, { s: 'equilateral triangle', l: 3 }, { s: 'rectangle', l: 2 }, { s: 'circle', l: 'infinite' }, { s: 'isosceles triangle', l: 1 },
      { s: 'scalene triangle', l: 0 }, { s: 'rhombus', l: 2 }, { s: 'kite', l: 1 }, { s: 'parallelogram', l: 0 }, { s: 'regular pentagon', l: 5 }, { s: 'regular hexagon', l: 6 }, { s: 'regular octagon', l: 8 },
      { s: `regular polygon with ${n} sides`, l: n }];
    const shape = pick(shapes);
    const accepts = shape.l === 'infinite' ? ['infinite', 'infinitely many', 'infinity', 'unlimited', 'countless', 'many', 'endless', '∞'] : shape.l === 0 ? ['0', 'none', 'zero', 'no lines'] : undefined;
    return { question: `How many lines of symmetry does a ${shape.s} have?`, answer: shape.l.toString(), ...(accepts ? { accepts } : {}),
      hint: 'A line of symmetry folds the shape onto itself exactly. Try folding it in your head — count every fold that works.' };
  },

  G6_PERIMETER: () => {
    const l = rand(5, 15), w = rand(3, 10);
    return { question: `Perimeter of a rectangle: ${l} m × ${w} m?`, answer: (2 * (l + w)).toString() };
  },

  G6_AREA_RECT: () => {
    const l = rand(5, 20), w = rand(3, 15);
    return { question: `Area of a rectangle: ${l} cm × ${w} cm?`, answer: (l * w).toString(), hint: 'A = length × width' };
  },

  G6_AREA_TRIANGLE: () => {
    const b = rand(4, 16), h = rand(3, 12);
    return { question: `Area of a triangle: base ${b} cm, height ${h} cm?`, answer: (b * h / 2).toString(),
      workedExample: makeWorkedExample('Area of triangle: base 10 cm, height 6 cm?', ['A = ½ × base × height', 'A = ½ × 10 × 6', 'A = 30 cm²'], '30'),
      hint: 'A = ½ × base × height' };
  },

  G6_VOLUME_CUBOID: () => {
    const l = rand(3, 10), w = rand(2, 8), h = rand(2, 6);
    return { question: `Volume of a cuboid: ${l} × ${w} × ${h} cm?`, answer: (l * w * h).toString(), hint: 'V = length × width × height' };
  },

  G6_UNIT_CONVERSIONS: () => {
    const convs = [
      () => { const v = roundTo(rand(1, 10) + rand(1, 9) / 10, 1); return { q: `Convert ${v} km to meters`, a: (v * 1000).toString(), h: '1 km = 1000 m, so multiply by 1000.' }; },
      () => { const v = rand(100, 9000); return { q: `Convert ${v} g to kg`, a: (v / 1000).toString(), h: '1000 g = 1 kg, so divide by 1000.' }; },
      () => { const v = rand(100, 5000); return { q: `Convert ${v} ml to litres`, a: (v / 1000).toString(), h: '1000 ml = 1 litre, so divide by 1000.' }; },
    ];
    const c = pick(convs)();
    return { question: c.q, answer: c.a, hint: c.h };
  },

  G6_MEAN: () => {
    const nums = Array.from({ length: rand(4, 6) }, () => rand(5, 20));
    const mean = nums.reduce((s, n) => s + n, 0) / nums.length;
    return { question: `Find the mean of: ${nums.join(', ')}`, answer: Number.isInteger(mean) ? mean.toString() : mean.toFixed(1),
      hint: 'Mean = sum of all values ÷ number of values' };
  },

  G6_PIE_CHARTS: () => {
    const total = pick([36, 72, 100, 120, 180, 360]);
    const deg = rand(30, 180);
    const pct = roundTo(deg / 360 * 100, 0);
    return { question: `A pie chart sector is ${deg}°. If total = ${total}, how many does this sector represent?`, answer: roundTo(deg / 360 * total, 0).toString(),
      hint: 'Amount = (degrees / 360) × total' };
  },

  G6_DATA_COLLECTION: () => {
    const total = rand(30, 50), cat1 = rand(5, 15), cat2 = rand(5, 15);
    const cat3 = total - cat1 - cat2;
    return { question: `Survey of ${total} students: football=${cat1}, basketball=${cat2}, volleyball=? Find volleyball.`, answer: cat3.toString(),
      hint: `All three groups add up to ${total}. Add the two you know (${cat1} + ${cat2}), then subtract from ${total}.` };
  },

  // ======================== GRADE 7 ========================

  G7_PLACE_VALUE: () => {
    const num = rand(100000000, 999999999);
    const pos = pick(['hundred millions', 'ten millions']);
    const mult = pos === 'hundred millions' ? 100000000 : 10000000;
    return { question: `What digit is in the ${pos} place of ${num.toLocaleString()}?`, answer: (Math.floor(num / mult) % 10).toString(),
      hint: 'Write out the place names from the right: ones, tens, hundreds, thousands… and count carefully to the place asked for.' };
  },

  G7_BODMAS_ADV: () => {
    const templates = [
      () => { const a = rand(2, 10), b = rand(2, 8), c = rand(2, 5); return { q: `${a} + ${b} × ${c}`, a: a + b * c }; },
      () => { const a = rand(10, 30), b = rand(2, 5), c = rand(2, 4); return { q: `(${a} - ${b}) × ${c}`, a: (a - b) * c }; },
      () => { const a = rand(2, 5), b = rand(2, 4), c = pick([12, 18, 24, 36]), d = pick([2, 3, 4, 6]); return { q: `${a} × ${b} + ${c} ÷ ${d}`, a: a * b + c / d }; },
    ];
    const t = pick(templates)();
    const ans = t.a;
    return { question: `Calculate: ${t.q}`, answer: Number.isInteger(ans) ? ans.toString() : ans.toFixed(1) };
  },

  G7_PRIMES: () => {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28];
    const isP = rand(0, 1);
    const n = isP ? pick(primes) : pick(composites);
    return { question: `Is ${n} prime or composite?`, answer: isP ? 'prime' : 'composite',
      hint: 'A prime number has exactly 2 factors: 1 and itself' };
  },

  G7_DIVISIBILITY: () => {
    const divisors = [2, 3, 5, 9, 10], d = pick(divisors), base = rand(10, 50);
    const isDivisible = rand(0, 1);
    const num = isDivisible ? d * base : d * base + rand(1, d - 1);
    const hints = { 2: 'Last digit is even', 3: 'Sum of digits divisible by 3', 5: 'Ends in 0 or 5', 9: 'Sum of digits divisible by 9', 10: 'Ends in 0' };
    return { question: `Is ${num} divisible by ${d}? (yes/no)`, answer: num % d === 0 ? 'yes' : 'no', hint: hints[d] };
  },

  G7_PRIME_FACTORIZATION: () => {
    const nums = [12, 18, 24, 30, 36, 40, 42, 48, 54, 60, 72, 84, 90, 96, 100, 120];
    const n = pick(nums);
    const f = primeFactorize(n);
    return { question: `Write ${n} as a product of prime factors`, answer: f.join('×'),
      hint: `Keep dividing ${n} by the smallest prime that fits (2, then 3, then 5…) until you reach 1.`,
      accepts: [f.join('×'), f.join('*'), f.join(' × '), f.join(' x ')],
      workedExample: makeWorkedExample('Prime factorization of 60', ['60 ÷ 2 = 30', '30 ÷ 2 = 15', '15 ÷ 3 = 5', '5 is prime'], '2×2×3×5') };
  },

  G7_GCD: () => {
    const pairs = [[12, 18], [24, 36], [15, 25], [18, 24], [20, 30], [28, 42], [16, 40], [36, 48]];
    const [a, b] = pick(pairs);
    return { question: `Find the GCD of ${a} and ${b}`, answer: gcd(a, b).toString(),
      hint: 'Find prime factorization of each, then multiply common factors' };
  },

  G7_LCM: () => {
    const pairs = [[4, 6], [3, 5], [6, 8], [4, 10], [6, 9], [8, 12], [5, 7], [9, 12]];
    const [a, b] = pick(pairs);
    return { question: `Find the LCM of ${a} and ${b}`, answer: lcm(a, b).toString(),
      hint: 'LCM = (a × b) ÷ GCD(a, b)' };
  },

  G7_FRACTIONS_COMPARE: () => {
    const d1 = rand(2, 8), d2 = rand(2, 8), n1 = rand(1, d1 - 1), n2 = rand(1, d2 - 1);
    const v1 = n1 / d1, v2 = n2 / d2;
    if (Math.abs(v1 - v2) < 0.01) return generators.G7_FRACTIONS_COMPARE();
    return { question: `Which is larger: ${n1}/${d1} or ${n2}/${d2}?`, answer: v1 > v2 ? `${n1}/${d1}` : `${n2}/${d2}`,
      hint: 'Convert to same denominator or to decimals to compare' };
  },

  G7_FRACTIONS_ADD_UNLIKE: () => {
    const d1 = pick([3, 4, 5, 6, 7, 8]), d2 = pick([3, 4, 5, 6, 7, 8].filter(x => x !== d1));
    const n1 = rand(1, d1 - 1), n2 = rand(1, d2 - 1);
    const cd = lcm(d1, d2);
    const sum = n1 * (cd / d1) + n2 * (cd / d2);
    return { question: `${n1}/${d1} + ${n2}/${d2} = ?`, answer: formatFraction(sum, cd),
      hint: `The denominators are different — find a common one first (${cd} works for ${d1} and ${d2}), convert both fractions, then add the tops.` };
  },

  G7_FRACTIONS_MUL: () => {
    const n1 = rand(1, 5), d1 = rand(2, 6), n2 = rand(1, 5), d2 = rand(2, 6);
    return { question: `${n1}/${d1} × ${n2}/${d2} = ?`, answer: formatFraction(n1 * n2, d1 * d2), hint: 'Multiply numerators, multiply denominators' };
  },

  G7_RECIPROCALS: () => {
    const n = rand(2, 9), d = rand(2, 9);
    return { question: `What is the reciprocal of ${n}/${d}?`, answer: `${d}/${n}`,
      hint: 'Flip the fraction: reciprocal of a/b is b/a' };
  },

  G7_FRACTIONS_DIV: () => {
    const n1 = rand(1, 4), d1 = rand(2, 5), n2 = rand(1, 3), d2 = rand(2, 4);
    return { question: `${n1}/${d1} ÷ ${n2}/${d2} = ?`, answer: formatFraction(n1 * d2, d1 * n2),
      hint: 'Keep, Change, Flip' };
  },

  G7_DECIMAL_PV: () => {
    const num = roundTo(rand(1, 999) / 100, 2);
    const pos = pick(['tenths', 'hundredths']);
    const str = num.toFixed(2);
    const digit = pos === 'tenths' ? str.split('.')[1][0] : str.split('.')[1][1];
    return { question: `What is the ${pos} digit of ${str}?`, answer: digit,
      hint: 'After the decimal point the places are: tenths first, then hundredths.' };
  },

  G7_DECIMALS_MUL: () => {
    const a = roundTo(rand(11, 99) / 10, 1), b = roundTo(rand(11, 49) / 10, 1);
    return { question: `${a.toFixed(1)} × ${b.toFixed(1)} = ?`, answer: parseFloat(roundTo(a * b, 2)).toString() };
  },

  G7_DECIMALS_DIV: () => {
    const divisor = pick([2, 4, 5, 8]), result = roundTo(rand(10, 50) / 10, 1);
    return { question: `${roundTo(result * divisor, 1)} ÷ ${divisor} = ?`, answer: result.toString() };
  },

  G7_SQUARES_EXT: () => {
    const n = rand(2, 20);
    return { question: `${n}² = ?`, answer: (n * n).toString(),
      hint: `Squaring means multiplying a number by itself: ${n} × ${n}.` };
  },

  G7_SQUARE_ROOTS: () => {
    const squares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
    const sq = pick(squares);
    return { question: `√${sq} = ?`, answer: Math.sqrt(sq).toString(),
      hint: 'What number times itself gives this?' };
  },

  G7_INTEGERS_MUL_DIV: () => {
    const a = rand(-9, -1), b = rand(-9, 9);
    const op = rand(0, 1);
    if (op === 0) return { question: `${a} × ${b >= 0 ? b : '(' + b + ')'} = ?`, answer: (a * b).toString(), hint: 'Same signs → positive, different signs → negative' };
    const prod = a * (b || 1);
    return { question: `${prod} ÷ ${a} = ?`, answer: (b || 1).toString() };
  },

  G7_PERCENTAGES: () => {
    const templates = [
      () => { const p = rand(5, 95), v = rand(20, 200); return { q: `${p}% of ${v}?`, a: roundTo(p / 100 * v, 2) }; },
      () => { const part = rand(10, 50), whole = rand(60, 200); return { q: `${part} out of ${whole} as a percentage?`, a: roundTo(part / whole * 100, 1) }; },
    ];
    const t = pick(templates)();
    return { question: t.q, answer: parseFloat(t.a).toString() };
  },

  G7_EXPRESSIONS: () => {
    const scenarios = [
      { q: 'A pen costs x shillings. Write an expression for the cost of 5 pens.', a: '5x', accepts: ['5x', '5*x'] },
      { q: 'John has y mangoes and gives away 4. How many remain?', a: 'y-4', accepts: ['y-4', 'y - 4'] },
      { q: 'A rectangle has length (x+3) and width 2. Write its area.', a: '2(x+3)', accepts: ['2(x+3)', '2x+6'] },
    ];
    return pick(scenarios);
  },

  G7_SIMPLIFY: () => {
    const a = rand(2, 6), b = rand(1, 5), c = rand(1, 5);
    return { question: `Simplify: ${a}x + ${b} + ${c}x`, answer: `${a + c}x + ${b}`,
      accepts: [`${a + c}x + ${b}`, `${a + c}x+${b}`] };
  },

  G7_EQUATIONS_FORM: () => {
    const x = rand(2, 10), a = rand(2, 5);
    return { question: `A number multiplied by ${a} equals ${a * x}. Write the equation.`, answer: `${a}x=${a * x}`,
      accepts: [`${a}x=${a * x}`, `${a}x = ${a * x}`] };
  },

  G7_EQUATIONS_SOLVE: () => {
    const x = rand(2, 12), a = rand(2, 5), b = rand(1, 10);
    return { question: `Solve: ${a}x + ${b} = ${a * x + b}`, answer: x.toString(),
      workedExample: makeWorkedExample('Solve: 3x + 5 = 20', ['Subtract 5 from both sides: 3x = 15', 'Divide both sides by 3: x = 5'], '5'),
      hint: `Subtract ${b}, then divide by ${a}` };
  },

  G7_INEQUALITIES_INTRO: () => {
    const a = rand(2, 5), b = rand(3, 15);
    return { question: `Solve: ${a}x > ${a * b}`, answer: `x > ${b}`, accepts: [`x > ${b}`, `x>${b}`],
      hint: 'Solve like an equation, but keep the inequality sign' };
  },

  G7_PYTHAGORAS: () => {
    const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]];
    const [a, b, c] = pick(triples);
    return rand(0, 1)
      ? { question: `Right triangle: legs ${a} and ${b}. Find the hypotenuse.`, answer: c.toString(), hint: 'c² = a² + b²' }
      : { question: `Right triangle: hypotenuse ${c}, one leg ${a}. Find the other leg.`, answer: b.toString(), hint: 'b² = c² - a²' };
  },

  G7_LENGTH_CONV: () => pick([
    () => { const m = rand(11, 95) / 10; return { question: `How many centimetres are in ${m} m?`, answer: String(Math.round(m * 100)), hint: '1 m = 100 cm, so multiply by 100.' }; },
    () => { const c = rand(15, 995); return { question: `How many metres are in ${c} cm?`, answer: String(c / 100), hint: '100 cm = 1 m, so divide by 100.' }; },
    () => { const m = rand(1050, 9950); return { question: `How many kilometres are in ${m.toLocaleString('en-US')} m?`, answer: String(m / 1000), hint: '1000 m = 1 km, so divide by 1000.' }; },
    () => { const k = rand(5, 95) / 100; return { question: `How many metres are in ${k} km?`, answer: String(Math.round(k * 1000)), hint: '1 km = 1000 m, so multiply by 1000.' }; },
    () => { const m = rand(12, 48) / 10; return { question: `How many millimetres are in ${m} m?`, answer: String(Math.round(m * 1000)), hint: '1 m = 1000 mm (100 cm, and 10 mm in each cm).' }; },
    () => { const k = rand(2, 9) / 4; return { question: `How many centimetres are in ${k} km?`, answer: String(Math.round(k * 100000)), hint: '1 km = 1000 m = 100,000 cm.' }; },
    () => { const lap = pick([200, 400]), n = rand(3, 12); return { question: `An athlete runs ${n} laps of a ${lap} m track. How many kilometres is that?`, answer: String(n * lap / 1000), hint: `${n} × ${lap} m = ${n * lap} m. Divide by 1000 for km.` }; },
  ])(),

  G7_PERIMETER: () => {
    const l = rand(5, 15), w = rand(3, 10);
    return { question: `Perimeter of a rectangle ${l}cm by ${w}cm?`, answer: (2 * (l + w)).toString() };
  },

  G7_CIRCUMFERENCE: () => {
    const r = rand(3, 10);
    return { question: `Circumference of a circle with radius ${r} cm? (use π = 3.14)`, answer: roundTo(2 * 3.14 * r, 2).toString(),
      workedExample: makeWorkedExample('Circumference, r = 7 cm', ['C = 2πr', 'C = 2 × 3.14 × 7', 'C = 43.96 cm'], '43.96'),
      hint: 'C = 2πr' };
  },

  G7_AREA_RECT: () => {
    const l = roundTo(rand(30, 150) / 10, 1), w = roundTo(rand(20, 100) / 10, 1);
    return { question: `Area of a rectangle: ${l} m × ${w} m?`, answer: roundTo(l * w, 2).toString() };
  },

  G7_AREA_CIRCLE: () => {
    const r = rand(2, 8);
    return { question: `Area of a circle with radius ${r} cm? (π = 3.14)`, answer: roundTo(3.14 * r * r, 2).toString(),
      hint: 'A = πr²' };
  },

  G7_VOLUME_CUBOID: () => {
    const l = rand(3, 10), w = rand(2, 8), h = rand(2, 6);
    return { question: `Volume of a cuboid: ${l} × ${w} × ${h} cm?`, answer: (l * w * h).toString() };
  },

  G7_VOLUME_CYLINDER: () => {
    const r = rand(2, 6), h = rand(5, 12);
    return { question: `Volume of a cylinder: r=${r}, h=${h}? (π=3.14)`, answer: roundTo(3.14 * r * r * h, 2).toString(),
      hint: 'V = πr²h' };
  },

  G7_SPEED: () => {
    const type = rand(0, 2);
    if (type === 0) { const d = rand(50, 300), t = rand(2, 6); return { question: `${d} km in ${t} hours. Find the speed.`, answer: roundTo(d / t, 1).toString(), hint: 'Speed = Distance ÷ Time' }; }
    if (type === 1) { const s = rand(40, 100), t = rand(2, 5); return { question: `Speed ${s} km/h for ${t} hours. Find the distance.`, answer: (s * t).toString(), hint: 'Distance = Speed × Time' }; }
    const s = rand(40, 100), d = s * rand(2, 5); return { question: `${d} km at ${s} km/h. Find the time.`, answer: (d / s).toString(), hint: 'Time = Distance ÷ Speed' };
  },

  G7_MEAN_MEDIAN_MODE: () => {
    const type = pick(['mean', 'median', 'mode']);
    const nums = Array.from({ length: 7 }, () => rand(2, 15)).sort((a, b) => a - b);
    if (type === 'mean') {
      const mean = nums.reduce((s, n) => s + n, 0) / nums.length;
      return { question: `Find the mean: ${shuffle(nums).join(', ')}`, answer: Number.isInteger(mean) ? mean.toString() : mean.toFixed(1) };
    }
    if (type === 'median') return { question: `Find the median: ${shuffle(nums).join(', ')}`, answer: nums[3].toString(), hint: 'Order the numbers. Median is the middle value.' };
    nums[rand(0, 6)] = nums[0]; // ensure a mode
    return { question: `Find the mode: ${shuffle(nums).join(', ')}`, answer: nums[0].toString(), hint: 'Mode is the most frequent value.' };
  },

  G7_DATA_REPRESENT: () => {
    const vals = Array.from({ length: 4 }, () => rand(10, 50));
    const total = vals.reduce((s, v) => s + v, 0);
    const labels = ['Mon', 'Tue', 'Wed', 'Thu'];
    return { question: `Bar graph shows: ${labels.map((l, i) => `${l}=${vals[i]}`).join(', ')}. Total?`, answer: total.toString(),
      hint: 'Total means add every bar together, one by one.' };
  },

  // ======================== GRADE 8 ========================

  G8_INDICES_INTRO: () => {
    const base = rand(2, 5), exp = rand(2, 4);
    return { question: `${base}${exp === 2 ? '²' : exp === 3 ? '³' : '⁴'} = ?`, answer: Math.pow(base, exp).toString(),
      workedExample: makeWorkedExample('2³ = ?', ['2³ means 2 × 2 × 2', '= 4 × 2', '= 8'], '8') };
  },

  G8_INDICES_LAWS: () => {
    const templates = [
      () => { const b = rand(2, 5), m = rand(2, 4), n = rand(2, 4); return { q: `Simplify: ${b}^${m} × ${b}^${n}`, a: `${b}^${m + n}`, hint: 'aᵐ × aⁿ = aᵐ⁺ⁿ' }; },
      () => { const b = rand(2, 5), m = rand(4, 7), n = rand(2, 3); return { q: `Simplify: ${b}^${m} ÷ ${b}^${n}`, a: `${b}^${m - n}`, hint: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ' }; },
      () => { const b = rand(2, 4), m = rand(2, 3), n = rand(2, 3); return { q: `Simplify: (${b}^${m})^${n}`, a: `${b}^${m * n}`, hint: '(aᵐ)ⁿ = aᵐⁿ' }; },
    ];
    const t = pick(templates)();
    return { question: t.q, answer: t.a, accepts: [t.a, t.a.replace('^', '**')], hint: t.hint };
  },

  G8_STANDARD_FORM: () => {
    const sig = roundTo(rand(10, 99) / 10, 1), exp = rand(2, 7);
    const num = Math.round(sig * 10) * Math.pow(10, exp - 1); // exact: no 980000.0000000001
    return rand(0, 1)
      ? { question: `Write ${num.toLocaleString()} in standard form`, answer: `${sig} × 10^${exp}`, accepts: [`${sig} × 10^${exp}`, `${sig}×10^${exp}`, `${sig}e${exp}`], hint: 'Move the decimal point until one digit is left of it — the number of moves is the power of 10.' }
      : { question: `${sig} × 10^${exp} = ?`, answer: num.toString(), hint: `10^${exp} means move the decimal point ${exp} places to the right.` };
  },

  G8_CUBES_CUBE_ROOTS: () => {
    const n = rand(2, 6);
    return rand(0, 1)
      ? { question: `${n}³ = ?`, answer: (n * n * n).toString() }
      : { question: `∛${n * n * n} = ?`, answer: n.toString() };
  },

  G8_RATIO_PROPORTION: () => {
    const a = rand(2, 6), b = rand(2, 6), total = (a + b) * rand(3, 8);
    return { question: `Divide ${total} in the ratio ${a}:${b}. Find the larger part.`, answer: (Math.max(a, b) * (total / (a + b))).toString(),
      hint: `The ratio ${a}:${b} makes ${a + b} equal shares. One share = ${total} ÷ ${a + b}; the larger part gets ${Math.max(a, b)} shares.` };
  },

  G8_PERCENTAGE_CHANGE: () => {
    const original = rand(50, 200), pct = pick([10, 15, 20, 25, 30]);
    const increase = rand(0, 1);
    const result = increase ? original * (1 + pct / 100) : original * (1 - pct / 100);
    return { question: `${increase ? 'Increase' : 'Decrease'} ${original} by ${pct}%`, answer: roundTo(result, 2).toString(),
      hint: increase ? 'New = Original × (1 + rate)' : 'New = Original × (1 - rate)' };
  },

  G8_PROFIT_LOSS: () => {
    const cost = rand(100, 500), markup = rand(10, 40);
    const selling = roundTo(cost * (1 + markup / 100), 0);
    return { question: `Cost price: KSh ${cost}. Selling price: KSh ${selling}. Find the profit percentage.`, answer: markup.toString(),
      hint: 'Profit % = (Profit / Cost Price) × 100' };
  },

  G8_SIMPLE_INTEREST: () => {
    const p = rand(5, 50) * 100, r = rand(2, 10), t = rand(1, 5);
    const si = p * r * t / 100;
    return { question: `Simple Interest: Principal = KSh ${p}, Rate = ${r}%, Time = ${t} years`, answer: si.toString(),
      hint: 'SI = (P × R × T) / 100' };
  },

  G8_NUMBER_BASES: () => {
    const n = rand(2, 15);
    return { question: `Convert ${n} (base 10) to binary`, answer: n.toString(2),
      hint: `Divide ${n} by 2 again and again, keeping each remainder — then read the remainders from bottom to top.`,
      workedExample: makeWorkedExample('Convert 13 to binary', ['13 ÷ 2 = 6 remainder 1', '6 ÷ 2 = 3 remainder 0', '3 ÷ 2 = 1 remainder 1', '1 ÷ 2 = 0 remainder 1', 'Read remainders upward: 1101'], '1101') };
  },

  G8_EXPAND_BRACKETS: () => {
    const a = rand(2, 5), b = rand(1, 6), c = rand(1, 6);
    return { question: `Expand: ${a}(x + ${b})`, answer: `${a}x + ${a * b}`, accepts: [`${a}x + ${a * b}`, `${a}x+${a * b}`],
      hint: 'Multiply each term inside the bracket by the number outside' };
  },

  G8_FACTORIZE_COMMON: () => {
    const cf = rand(2, 6), a = rand(1, 5), b = rand(1, 5);
    return { question: `Factorize: ${cf * a}x + ${cf * b}`, answer: `${cf}(${a}x + ${b})`,
      accepts: [`${cf}(${a}x + ${b})`, `${cf}(${a}x+${b})`] };
  },

  G8_LINEAR_EQ_ADV: () => {
    const x = rand(1, 10), a = rand(2, 5), b = rand(1, 8), d = rand(1, 10);
    // Keep c < a so (a-c) ≠ 0 — otherwise the equation collapses to an identity
    // (every x a solution) and the single keyed answer would be wrong.
    const c = rand(1, Math.min(3, a - 1));
    const rhs = a * x + b - c * x - d;
    return { question: `Solve: ${a}x + ${b} = ${c}x + ${rhs + d}`, answer: x.toString(),
      accepts: [`x=${x}`, `${x}`],
      hint: 'Collect x terms on one side, numbers on the other' };
  },

  G8_SIMULTANEOUS_INTRO: () => {
    const x = rand(1, 6), y = rand(1, 6);
    const a1 = rand(1, 3), b1 = rand(1, 3), a2 = rand(1, 3), b2 = rand(1, 3);
    return { question: `Solve: ${a1}x + ${b1}y = ${a1 * x + b1 * y}, ${a2}x + ${b2}y = ${a2 * x + b2 * y}`, answer: `x=${x}, y=${y}`,
      accepts: [`x=${x}, y=${y}`, `x=${x},y=${y}`, `(${x},${y})`],
      hint: 'Use elimination or substitution method' };
  },

  G8_INEQUALITIES: () => {
    const a = rand(2, 5), b = rand(2, 15), bound = rand(3, 10);
    return { question: `Solve: ${a}x - ${b} < ${a * bound - b}`, answer: `x < ${bound}`, accepts: [`x < ${bound}`, `x<${bound}`],
      hint: `Treat it like an equation: add ${b} to both sides, then divide by ${a}. The < sign stays the same (dividing by a positive number).` };
  },

  G8_SEQUENCES: () => {
    const a = rand(2, 10), d = rand(2, 5), n = rand(5, 10);
    return { question: `Arithmetic sequence: first term ${a}, common difference ${d}. Find the ${n}th term.`, answer: (a + (n - 1) * d).toString(),
      hint: 'nth term = a + (n-1)d' };
  },

  G8_COORDINATES: () => {
    const x = rand(-5, 5), y = rand(-5, 5);
    const quadrant = x > 0 && y > 0 ? 1 : x < 0 && y > 0 ? 2 : x < 0 && y < 0 ? 3 : x > 0 && y < 0 ? 4 : 0;
    if (quadrant === 0) return generators.G8_COORDINATES();
    return { question: `What quadrant is the point (${x}, ${y}) in?`, answer: quadrant.toString() };
  },

  G8_LINEAR_GRAPHS: () => {
    const m = rand(1, 4), c = rand(-3, 5), x = rand(1, 5);
    return { question: `If y = ${m}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}, find y when x = ${x}`, answer: (m * x + c).toString(),
      hint: 'Substitute the x value into the equation' };
  },

  G8_GRADIENT: () => {
    const x1 = rand(0, 3), y1 = rand(0, 5), x2 = rand(4, 8), y2 = rand(0, 10);
    const rise = y2 - y1, run = x2 - x1;
    const g = gcd(Math.abs(rise), Math.abs(run));
    return { question: `Gradient between (${x1},${y1}) and (${x2},${y2})?`, answer: run !== 0 ? formatFraction(rise, run) : 'undefined',
      hint: 'Gradient = (y₂ - y₁) / (x₂ - x₁)' };
  },

  G8_EQUATION_OF_LINE: () => {
    const m = rand(1, 4), c = rand(-5, 5);
    return { question: `A line has gradient ${m} and y-intercept ${c}. Write the equation.`, answer: `y = ${m}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`,
      accepts: [`y = ${m}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`, `y=${m}x${c >= 0 ? '+' : '-'}${Math.abs(c)}`],
      hint: 'y = mx + c' };
  },

  G8_ANGLE_RELATIONSHIPS: () => {
    const angle = rand(40, 140);
    const type = pick(['alternate', 'corresponding', 'co-interior']);
    if (type === 'co-interior') return { question: `Co-interior angle with ${angle}°?`, answer: (180 - angle).toString(), hint: 'Co-interior angles sum to 180°' };
    return { question: `${type.charAt(0).toUpperCase() + type.slice(1)} angle to ${angle}°?`, answer: angle.toString(), hint: `${type} angles are equal` };
  },

  G8_POLYGON_ANGLES: () => {
    const n = rand(5, 8);
    const names = { 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon' };
    return { question: `Sum of interior angles of a ${names[n]}?`, answer: ((n - 2) * 180).toString(),
      hint: 'Sum = (n - 2) × 180°' };
  },

  G8_CONGRUENCE: () => {
    const c = pick([
      { d: 'all three sides of one triangle are equal to the three sides of the other', a: 'SSS' },
      { d: 'two sides and the angle between them are equal', a: 'SAS' },
      { d: 'two angles and the side between them are equal', a: 'ASA' },
      { d: 'two angles and a side not between them are equal', a: 'AAS' },
      { d: 'both have a right angle, and the hypotenuse and one other side are equal', a: 'RHS' },
      { d: null, a: 'AAA' },
    ]);
    if (!c.d) return { question: 'Which of these does NOT prove two triangles are congruent: SSS, SAS, AAA or RHS?', answer: 'AAA',
      hint: 'Equal angles give the same SHAPE, but the triangles could be different sizes.' };
    return { question: `Two triangles are congruent because ${c.d}. Which condition is this: SSS, SAS, ASA, AAS or RHS?`, answer: c.a,
      accepts: c.a === 'ASA' ? ['ASA', 'AAS'] : c.a === 'AAS' ? ['AAS', 'ASA'] : [c.a],
      hint: 'S stands for a side, A for an angle, R for a right angle, H for the hypotenuse.' };
  },

  G8_SIMILARITY: () => {
    const scale = rand(2, 4), side = rand(3, 10);
    return { question: `Two similar triangles. Smaller has side ${side} cm. Scale factor is ${scale}. Find the corresponding side of the larger.`, answer: (side * scale).toString(),
      hint: 'Corresponding side = original × scale factor' };
  },

  G8_TRANSFORMATIONS_INTRO: () => {
    const x = rand(1, 5), y = rand(1, 5);
    return { question: `Reflect point (${x}, ${y}) in the y-axis. New coordinates?`, answer: `(${-x}, ${y})`,
      accepts: [`(${-x}, ${y})`, `(-${x},${y})`, `${-x},${y}`] };
  },

  G8_AREA_COMPOSITE: () => {
    const l1 = rand(6, 12), w1 = rand(3, 6), l2 = rand(3, 6), w2 = rand(2, 4);
    return { question: `L-shaped figure: rectangle ${l1}×${w1} joined with ${l2}×${w2}. Total area?`, answer: (l1 * w1 + l2 * w2).toString(),
      hint: 'Split into rectangles, find each area, then add' };
  },

  G8_SURFACE_AREA: () => {
    const l = rand(3, 8), w = rand(2, 6), h = rand(2, 5);
    return { question: `Surface area of cuboid: ${l}×${w}×${h} cm?`, answer: (2 * (l * w + l * h + w * h)).toString(),
      hint: 'SA = 2(lw + lh + wh)' };
  },

  G8_VOLUME_ADV: () => {
    const r = rand(2, 6), h = rand(5, 12);
    return { question: `Volume of a cylinder: r=${r} cm, h=${h} cm? (π=3.14)`, answer: roundTo(3.14 * r * r * h, 2).toString(),
      hint: `V = π × r² × h — square the radius first (${r} × ${r}), then multiply by π and the height.` };
  },

  G8_DENSITY: () => {
    const m = rand(100, 500), v = rand(10, 50);
    return { question: `Mass = ${m} g, Volume = ${v} cm³. Find density.`, answer: roundTo(m / v, 1).toString(),
      hint: 'Density = Mass ÷ Volume' };
  },

  G8_PROBABILITY_INTRO: () => {
    const total = rand(8, 20), favorable = rand(2, total - 2);
    return { question: `Bag has ${total} balls, ${favorable} are red. P(red)?`, answer: formatFraction(favorable, total),
      hint: 'P(event) = favorable outcomes / total outcomes' };
  },

  G8_PROBABILITY_COMBINED: () => {
    const p1n = rand(1, 3), p1d = rand(4, 6), p2n = rand(1, 3), p2d = rand(4, 6);
    return { question: `P(A) = ${p1n}/${p1d}, P(B) = ${p2n}/${p2d}. If independent, P(A and B)?`, answer: formatFraction(p1n * p2n, p1d * p2d),
      hint: 'P(A and B) = P(A) × P(B) for independent events' };
  },

  G8_CUMULATIVE_FREQ: () => {
    const freqs = [rand(3, 8), rand(5, 12), rand(8, 15), rand(4, 10), rand(2, 7)];
    const cumFreqs = freqs.reduce((acc, f) => { acc.push((acc.length ? acc[acc.length - 1] : 0) + f); return acc; }, []);
    return { question: `Frequencies: ${freqs.join(', ')}. What is the total cumulative frequency?`, answer: cumFreqs[cumFreqs.length - 1].toString(),
      hint: 'Cumulative frequency keeps a running total — the final one is simply all the frequencies added together.' };
  },

  // ======================== GRADE 9 ========================

  G9_SURDS_INTRO: () => {
    const n = pick([8, 12, 18, 20, 27, 32, 45, 48, 50, 75]);
    const factors = primeFactorize(n);
    // Find simplified form
    let outside = 1, inside = 1;
    const counts = {};
    factors.forEach(f => counts[f] = (counts[f] || 0) + 1);
    Object.entries(counts).forEach(([base, count]) => {
      outside *= Math.pow(parseInt(base), Math.floor(count / 2));
      if (count % 2 === 1) inside *= parseInt(base);
    });
    return { question: `Simplify √${n}`, answer: outside === 1 ? `√${inside}` : `${outside}√${inside}`,
      accepts: [outside === 1 ? `√${inside}` : `${outside}√${inside}`, `${outside}√${inside}`, `${outside}*√${inside}`],
      workedExample: makeWorkedExample('Simplify √18', ['18 = 9 × 2', '√18 = √9 × √2', '= 3√2'], '3√2'),
      hint: 'Find the largest perfect square factor' };
  },

  G9_SURDS_OPERATIONS: () => {
    const a = rand(2, 5), b = rand(2, 5), n = pick([2, 3, 5]);
    return { question: `Simplify: ${a}√${n} + ${b}√${n}`, answer: `${a + b}√${n}`,
      hint: 'Like surds can be added: a√n + b√n = (a+b)√n' };
  },

  G9_COMPOUND_INTEREST: () => {
    const p = rand(5, 20) * 1000, r = pick([5, 8, 10, 12]), t = rand(2, 3);
    const amount = roundTo(p * Math.pow(1 + r / 100, t), 2);
    return { question: `Compound interest: P=${p}, r=${r}%, t=${t} years. Find amount.`, answer: roundTo(amount, 0).toString(),
      hint: 'A = P(1 + r/100)ᵗ' };
  },

  G9_COMMERCIAL_ARITH: () => {
    const salary = rand(30, 80) * 1000, taxRate = pick([10, 15, 20, 25]);
    const tax = salary * taxRate / 100;
    return { question: `Monthly salary: KSh ${salary.toLocaleString()}. Tax rate: ${taxRate}%. Find tax amount.`, answer: tax.toString(),
      hint: `${taxRate}% means ${taxRate} out of every 100 — multiply the salary by ${taxRate}, then divide by 100.` };
  },

  G9_QUADRATIC_EXPAND: () => {
    const a = rand(1, 4), b = rand(1, 5);
    const sign = rand(0, 1);
    if (sign) return { question: `Expand: (x + ${a})(x + ${b})`, answer: `x² + ${a + b}x + ${a * b}`,
      workedExample: makeWorkedExample('Expand: (x + 2)(x + 3)', ['x × x = x²', 'x × 3 = 3x', '2 × x = 2x', '2 × 3 = 6', 'x² + 3x + 2x + 6 = x² + 5x + 6'], 'x² + 5x + 6') };
    return { question: `Expand: (x + ${a})(x - ${b})`, answer: `x² + ${a - b}x - ${a * b}` };
  },

  G9_QUADRATIC_FACTORIZE: () => {
    const a = rand(1, 6), b = rand(1, 6);
    const sum = a + b, prod = a * b;
    return { question: `Factorize: x² + ${sum}x + ${prod}`, answer: `(x + ${a})(x + ${b})`,
      accepts: [`(x + ${a})(x + ${b})`, `(x+${a})(x+${b})`, `(x + ${b})(x + ${a})`],
      hint: 'Find two numbers that multiply to give the constant and add to give the middle coefficient' };
  },

  G9_QUADRATIC_SOLVE: () => {
    const x1 = rand(1, 6), x2 = rand(1, 6);
    const b = -(x1 + x2), c = x1 * x2;
    return { question: `Solve: x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x + ${c} = 0`, answer: `x = ${Math.min(x1, x2)} or x = ${Math.max(x1, x2)}`,
      accepts: [`x = ${x1} or x = ${x2}`, `x=${x1}, x=${x2}`, `${Math.min(x1, x2)}, ${Math.max(x1, x2)}`, `x=${Math.min(x1, x2)} or x=${Math.max(x1, x2)}`],
      hint: 'Factorize, then set each bracket equal to 0' };
  },

  G9_QUADRATIC_FORMULA: () => {
    const x1 = rand(1, 5), x2 = rand(1, 5);
    const a = 1, b = -(x1 + x2), c = x1 * x2;
    return { question: `Use the quadratic formula to solve: x² ${b >= 0 ? '+' : ''} ${b}x + ${c} = 0`, answer: `x = ${Math.min(x1, x2)} or x = ${Math.max(x1, x2)}`,
      accepts: [`x = ${x1} or x = ${x2}`, `${Math.min(x1, x2)}, ${Math.max(x1, x2)}`],
      hint: 'x = (-b ± √(b²-4ac)) / 2a' };
  },

  G9_COMPLETING_SQUARE: () => {
    const h = rand(1, 5), k = rand(1, 10);
    return { question: `Write x² + ${2 * h}x + ${h * h + k} in the form (x + a)² + b`, answer: `(x + ${h})² + ${k}`,
      accepts: [`(x + ${h})² + ${k}`, `(x+${h})²+${k}`] };
  },

  G9_SIMULTANEOUS_ADV: () => {
    const x = rand(1, 5), y = rand(1, 5);
    return { question: `Solve: x + y = ${x + y}, x² + y² = ${x * x + y * y}`, answer: `x=${x}, y=${y}`,
      hint: `From the first equation y = ${x + y} − x. Substitute that into the second and solve the quadratic.`,
      accepts: [`x=${x}, y=${y}`, `x=${y}, y=${x}`, `(${x},${y})`, `(${y},${x})`] };
  },

  G9_VARIATION: () => {
    const k = rand(2, 8), x = rand(2, 5);
    return { question: `y varies directly as x. When x=${x}, y=${k * x}. Find y when x=${x + 2}.`, answer: (k * (x + 2)).toString(),
      hint: 'y = kx, find k first' };
  },

  G9_FUNCTIONS_INTRO: () => {
    const a = rand(2, 5), b = rand(1, 8), x = rand(1, 6);
    return { question: `f(x) = ${a}x + ${b}. Find f(${x}).`, answer: (a * x + b).toString(),
      hint: 'Replace x with the given value' };
  },

  G9_QUADRATIC_GRAPHS: () => {
    const a = 1, h = rand(1, 4), k = rand(-3, 3);
    return { question: `y = (x - ${h})² ${k >= 0 ? '+' : '-'} ${Math.abs(k)}. What are the coordinates of the vertex?`, answer: `(${h}, ${k})`,
      accepts: [`(${h}, ${k})`, `(${h},${k})`],
      hint: 'For y = (x-h)² + k, vertex is at (h, k)' };
  },

  // Rewritten after the audit: every construction's answer used to be accepted
  // for every angle, and the answers were phrases no child types exactly.
  G9_CONSTRUCTION: () => pick([
    () => { const a = pick([40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150]); return { question: `You bisect an angle of ${a}° with a ruler and compasses. What size is each half?`, answer: String(a / 2), hint: 'Bisect means cut exactly in half.' }; },
    () => { const l = rand(3, 9) * 2; return { question: `The perpendicular bisector of a ${l} cm line cuts it into two equal parts. How long is each part?`, answer: String(l / 2), hint: 'A bisector cuts it exactly in half.' }; },
    () => ({ question: 'A perpendicular bisector crosses the line at what angle, in degrees?', answer: '90', accepts: ['90', '90°', 'right angle'], hint: 'Perpendicular means at a right angle.' }),
    () => ({ question: 'Each angle of an equilateral triangle is how many degrees? (This is how you construct 60°.)', answer: '60', hint: 'The three equal angles add up to 180°.' }),
    () => ({ question: 'To construct 120°, you put two angles of how many degrees side by side?', answer: '60', hint: '120 = 60 + 60.' }),
    () => ({ question: 'To construct 30°, you construct 60° and then bisect it. To construct 45°, you construct which angle and bisect it?', answer: '90', accepts: ['90', '90°'], hint: 'Half of it must be 45°.' }),
    () => ({ question: 'Which construction cuts an angle exactly in half: the angle bisector or the perpendicular bisector?', answer: 'angle bisector', accepts: ['angle bisector', 'the angle bisector'], hint: 'It is named after what it cuts.' }),
    () => ({ question: 'Which construction gives a line at 90° through the middle of another line: the angle bisector or the perpendicular bisector?', answer: 'perpendicular bisector', accepts: ['perpendicular bisector', 'the perpendicular bisector'], hint: 'Perpendicular means at 90°.' }),
  ])(),

  G9_LOCI: () => pick([
    () => ({ question: 'The locus of points the same distance from two fixed points is the perpendicular bisector or the angle bisector?', answer: 'perpendicular bisector', accepts: ['perpendicular bisector', 'the perpendicular bisector'], hint: 'Every such point is halfway between the two points, on a line at right angles to the line joining them.' }),
    () => ({ question: 'The locus of points the same distance from two lines that cross is the perpendicular bisector or the angle bisector?', answer: 'angle bisector', accepts: ['angle bisector', 'the angle bisector', 'angle bisectors'], hint: 'Points equally far from both lines sit on the line that halves the angle between them.' }),
    () => { const r = rand(2, 9); return { question: `The locus of points ${r} cm from a fixed point is a circle. What is its radius, in cm?`, answer: String(r), hint: 'Every point is the same distance from the centre: that distance is the radius.' }; },
    () => ({ question: 'The locus of points a fixed distance from a single point is a circle or a straight line?', answer: 'circle', accepts: ['circle', 'a circle'], hint: 'All the points are the same distance from the centre.' }),
    () => { const r = rand(2, 8); return { question: `A goat is tied to a peg with a rope ${r} m long. The edge of the grass it can reach is a circle. What is its diameter, in m?`, answer: String(2 * r), hint: `The rope is the radius. Diameter = 2 × radius.` }; },
    () => { const r = pick([2, 3, 4, 5, 10]); return { question: `A goat is tied to a peg with a rope ${r} m long. What area of grass can it reach? (π = 3.14)`, answer: (3.14 * r * r).toFixed(2), accepts: [(3.14 * r * r).toFixed(2), String(Number((3.14 * r * r).toFixed(2)))], hint: `Area of a circle = πr², with r = ${r}.` }; },
    () => ({ question: 'The locus of points 3 cm from a straight line (on both sides) is a pair of parallel lines or a circle?', answer: 'parallel lines', accepts: ['parallel lines', 'parallel', 'a pair of parallel lines', 'two parallel lines'], hint: 'On each side, the points form a line that never meets the first one.' }),
  ])(),

  G9_CIRCLE_THEOREMS_INTRO: () => {
    const angle = rand(30, 80);
    return { question: `Angle at centre = ${angle * 2}°. Find the angle at the circumference.`, answer: angle.toString(),
      hint: 'Angle at circumference = ½ × angle at centre' };
  },

  G9_TRIG_INTRO: () => {
    const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]];
    const [opp, adj, hyp] = pick(triples);
    const type = pick(['sin', 'cos', 'tan']);
    const answer = type === 'sin' ? formatFraction(opp, hyp) : type === 'cos' ? formatFraction(adj, hyp) : formatFraction(opp, adj);
    return { question: `Right triangle: opposite=${opp}, adjacent=${adj}, hypotenuse=${hyp}. Find ${type}(θ)`, answer,
      workedExample: makeWorkedExample('Right triangle: opp=3, adj=4, hyp=5. Find sin(θ)', ['sin(θ) = opposite / hypotenuse', 'sin(θ) = 3/5'], '3/5'),
      hint: 'SOH CAH TOA: sin=O/H, cos=A/H, tan=O/A' };
  },

  G9_TRIG_PROBLEMS: () => {
    const angle = pick([30, 45, 60]);
    const hyp = rand(5, 15);
    const sinVals = { 30: 0.5, 45: 0.707, 60: 0.866 };
    const opp = roundTo(hyp * sinVals[angle], 1);
    return { question: `Hypotenuse = ${hyp}, angle = ${angle}°. Find the opposite side.`, answer: opp.toString(),
      hint: 'opposite = hypotenuse × sin(angle)' };
  },

  G9_BEARINGS: () => {
    const bearing = rand(0, 35) * 10;
    const direction = bearing === 0 ? 'North' : bearing === 90 ? 'East' : bearing === 180 ? 'South' : bearing === 270 ? 'West' : `${bearing}°`;
    const back = (bearing + 180) % 360;
    return { question: `The bearing of B from A is ${bearing.toString().padStart(3, '0')}°. What is the bearing of A from B?`, answer: back.toString().padStart(3, '0'),
      hint: 'Back bearing = bearing ± 180°' };
  },

  G9_TRANSFORMATIONS_ADV: () => {
    const x = rand(1, 5), y = rand(1, 5), dx = rand(-3, 3), dy = rand(-3, 3);
    return { question: `Translate (${x}, ${y}) by vector (${dx}, ${dy})`, answer: `(${x + dx}, ${y + dy})`,
      accepts: [`(${x + dx}, ${y + dy})`, `(${x + dx},${y + dy})`] };
  },

  G9_ARC_LENGTH: () => {
    const r = rand(5, 14), angle = pick([60, 90, 120, 180]);
    const arcLength = roundTo(angle / 360 * 2 * 3.14 * r, 2);
    return { question: `Arc length: radius ${r} cm, angle ${angle}°? (π=3.14)`, answer: arcLength.toString(),
      hint: 'Arc length = (θ/360) × 2πr' };
  },

  G9_SURFACE_AREA_ADV: () => pick([
    () => { const r = rand(3, 9); const v = 4 * 3.14 * r * r; return { question: `Find the surface area of a sphere with radius ${r} cm. (π = 3.14)`, answer: v.toFixed(2), accepts: [v.toFixed(2), String(Number(v.toFixed(2)))], hint: 'Surface area of a sphere = 4πr².' }; },
    () => { const r = rand(2, 7), h = rand(4, 12); const v = 2 * 3.14 * r * r + 2 * 3.14 * r * h; return { question: `Find the total surface area of a closed cylinder with radius ${r} cm and height ${h} cm. (π = 3.14)`, answer: v.toFixed(2), accepts: [v.toFixed(2), String(Number(v.toFixed(2)))], hint: 'Two circles (2πr²) plus the curved side (2πrh).' }; },
    () => { const a = rand(2, 12); return { question: `Find the surface area of a cube with edges of ${a} cm.`, answer: String(6 * a * a), hint: 'A cube has 6 square faces: 6 × a².' }; },
    () => { const l = rand(3, 12), b = rand(2, 9), h = rand(2, 9); return { question: `Find the surface area of a cuboid ${l} cm long, ${b} cm wide and ${h} cm high.`, answer: String(2 * (l * b + b * h + l * h)), hint: 'Three pairs of rectangles: 2(lb + bh + lh).' }; },
    () => { const r = rand(3, 8), l = r + rand(2, 8); const v = 3.14 * r * l; return { question: `Find the curved surface area of a cone with radius ${r} cm and slant height ${l} cm. (π = 3.14)`, answer: v.toFixed(2), accepts: [v.toFixed(2), String(Number(v.toFixed(2)))], hint: 'Curved surface of a cone = πrl.' }; },
  ])(),

  G9_VOLUME_ADV: () => {
    const r = rand(3, 7), h = rand(6, 12);
    return { question: `Volume of a cone: r=${r}, h=${h}? (π=3.14)`, answer: roundTo(3.14 * r * r * h / 3, 2).toString(),
      hint: 'V = (1/3)πr²h' };
  },

  G9_GROUPED_DATA: () => {
    const intervals = ['0-10', '10-20', '20-30', '30-40'];
    const freqs = intervals.map(() => rand(3, 12));
    const total = freqs.reduce((s, f) => s + f, 0);
    return { question: `Grouped data frequencies: ${intervals.map((iv, i) => `${iv}: ${freqs[i]}`).join(', ')}. Total frequency?`, answer: total.toString(),
      hint: 'Total frequency = add the frequency of every interval.' };
  },

  G9_PROBABILITY_ADV: () => {
    const red = rand(3, 7), blue = rand(3, 7), total = red + blue;
    const p = formatFraction(red * (red - 1), total * (total - 1));
    return { question: `Bag: ${red} red, ${blue} blue. Two drawn without replacement. P(both red)?`, answer: p,
      hint: 'P = (r/n) × ((r-1)/(n-1))' };
  },

  G9_SCATTER_PLOTS: () => {
    const c = pick([
      ['the temperature', 'cold drink sales', 'positive'], ['a child\'s height', 'their shoe size', 'positive'],
      ['the rainfall', 'umbrella sales', 'positive'], ['the distance from school', 'the time taken to walk there', 'positive'],
      ['the hours spent revising', 'the mistakes made in a test', 'negative'], ['the age of a car', 'its value', 'negative'],
      ['the temperature', 'sweater sales', 'negative'], ['the speed of a matatu', 'the time a journey takes', 'negative'],
      ['a pupil\'s house number', 'their height', 'none'], ['a person\'s shoe size', 'their exam score', 'none'],
    ]);
    const acc = { positive: ['positive', 'positive correlation'], negative: ['negative', 'negative correlation'], none: ['none', 'no correlation', 'no', 'zero', 'no relationship'] }[c[2]];
    if (rand(0, 3) === 0) {
      const up = rand(0, 1);
      return { question: `On a scatter graph, the line of best fit goes ${up ? 'up' : 'down'} from left to right. Is the correlation positive, negative or none?`, answer: up ? 'positive' : 'negative', accepts: up ? ['positive', 'positive correlation'] : ['negative', 'negative correlation'], hint: 'Up from left to right: both grow together (positive). Down: one grows as the other falls (negative).' };
    }
    return { question: `As ${c[0]} goes up, what happens to ${c[1]}? Is the correlation positive, negative or none?`, answer: c[2], accepts: acc,
      hint: 'Both go up together: positive. One goes up while the other goes down: negative. No pattern: none.' };
  },

  // ======================== GRADE 10 ========================

  G10_LOGARITHMS_INTRO: () => {
    const bases = [[2, 8, 3], [2, 16, 4], [3, 9, 2], [3, 27, 3], [5, 25, 2], [10, 100, 2], [10, 1000, 3]];
    const [base, val, result] = pick(bases);
    return { question: `log₍${base}₎(${val}) = ?`, answer: result.toString(),
      workedExample: makeWorkedExample('log₍₂₎(8) = ?', ['We need: 2^? = 8', '2¹ = 2, 2² = 4, 2³ = 8', 'So log₍₂₎(8) = 3'], '3'),
      hint: `${base}^? = ${val}` };
  },

  G10_LOG_LAWS: () => {
    const templates = [
      () => { const a = rand(2, 5), b = rand(2, 5); return { q: `Simplify: log(${a}) + log(${b})`, a: `log(${a * b})`, hint: 'log(a) + log(b) = log(ab)' }; },
      () => { const b = rand(2, 5), a = b * rand(3, 12); return { q: `Simplify: log(${a}) - log(${b})`, a: `log(${a / b})`, hint: 'log(a) - log(b) = log(a/b)' }; },
      () => { const a = rand(2, 5), n = rand(2, 4); return { q: `Simplify: ${n}log(${a})`, a: `log(${Math.pow(a, n)})`, hint: 'nlog(a) = log(aⁿ)' }; },
    ];
    const t = pick(templates)();
    return { question: t.q, answer: t.a, hint: t.hint };
  },

  G10_SURDS_ADV: () => {
    const a = rand(1, 5), b = pick([2, 3, 5]);
    return { question: `Rationalize: ${a}/√${b}`, answer: `${a}√${b}/${b}`,
      accepts: [`${a}√${b}/${b}`, `(${a}√${b})/${b}`],
      hint: 'Multiply top and bottom by √b' };
  },

  G10_POLYNOMIALS: () => {
    const a = 1, b = rand(2, 5), c = rand(1, 8);
    const divisor = rand(1, 3);
    return { question: `Divide ${a}x² + ${b}x + ${c} by (x + ${divisor})`, answer: `x + ${b - divisor} remainder ${c - divisor * (b - divisor)}`,
      hint: 'Use polynomial long division' };
  },

  G10_REMAINDER_THEOREM: () => {
    const a = 1, b = rand(-5, 5), c = rand(-5, 5), val = rand(-3, 3);
    const remainder = a * val * val + b * val + c;
    return { question: `f(x) = x² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)}. Find f(${val}).`, answer: remainder.toString(),
      hint: 'By the Remainder Theorem, f(a) is the remainder when dividing by (x-a)' };
  },

  G10_PARTIAL_FRACTIONS: () => {
    // N/((x+1)(x+2)) = A/(x+1) + B/(x+2). Cover-up: A = N at x=-1, B = N at x=-2.
    // With constant numerator N: A = N, B = -N.
    const n = rand(2, 9);
    return { question: `Express ${n}/((x+1)(x+2)) as partial fractions A/(x+1) + B/(x+2). Find A and B.`,
      answer: `A=${n}, B=${-n}`,
      accepts: [`A=${n},B=${-n}`, `A=${n} B=${-n}`, `${n},${-n}`],
      hint: 'Multiply through by the denominator, then substitute x = -1 and x = -2' };
  },

  G10_SEQUENCES_ADV: () => {
    const a = rand(2, 5), r = rand(2, 3), n = rand(4, 6);
    return { question: `Geometric sequence: first term ${a}, common ratio ${r}. Find the ${n}th term.`, answer: (a * Math.pow(r, n - 1)).toString(),
      hint: 'nth term = ar^(n-1)' };
  },

  G10_SERIES: () => {
    const a = rand(2, 8), d = rand(2, 5), n = rand(5, 10);
    const sum = n / 2 * (2 * a + (n - 1) * d);
    return { question: `Arithmetic series: a=${a}, d=${d}, n=${n}. Find the sum.`, answer: sum.toString(),
      hint: 'S = n/2 × (2a + (n-1)d)' };
  },

  G10_BINOMIAL_THEOREM: () => {
    const n = rand(3, 8), r = rand(1, n - 1), k = pick([1, 1, 2, 3]);
    let c = 1; for (let i = 0; i < r; i++) c = c * (n - i) / (i + 1);
    return { question: `Find the coefficient of x^${r} in (1 + ${k === 1 ? '' : k}x)^${n}.`, answer: String(c * k ** r),
      hint: k === 1 ? `C(${n}, ${r}) = ${n}! / (${r}! × ${n - r}!).` : `C(${n}, ${r}) × ${k}^${r}.` };
  },

  G10_FUNCTIONS_ADV: () => {
    const a = rand(2, 4), b = rand(1, 5), x = rand(1, 5);
    // One answer per question: the inverse at a point (the expression is in the hint).
    return { question: `f(x) = ${a}x + ${b}. Find f⁻¹(${a * x + b}).`, answer: `${x}`,
      accepts: [`${x}`, `f⁻¹(${a * x + b}) = ${x}`],
      hint: `For the inverse, swap x and y and solve: f⁻¹(x) = (x - ${b})/${a}.` };
  },

  G10_EXPONENTIAL_GRAPHS: () => {
    const b = rand(2, 5), x = rand(0, 4), a = rand(1, 6);
    return pick([
      { question: `For y = ${b}^x, what is y when x = ${x}?`, answer: String(b ** x), hint: `${b}^${x} means ${x === 0 ? 'any number to the power 0, which is 1' : `${b} multiplied by itself ${x} times`}.` },
      { question: `Where does y = ${a} × ${b}^x cross the y-axis? Give the value of y.`, answer: String(a), hint: 'On the y-axis, x = 0, and anything to the power 0 is 1.' },
      { question: `For y = ${b}^x, what is y when x = −1? Give a fraction.`, answer: `1/${b}`, hint: `A negative power means 1 over: ${b}^−1 = 1/${b}.` },
    ]);
  },

  G10_CIRCLE_THEOREMS_ADV: () => {
    const angle = rand(30, 70);
    return { question: `Angle in a semicircle from a chord. If one angle at circumference is ${angle}°, find the other.`, answer: (90 - angle).toString(),
      hint: 'Angle in a semicircle = 90°' };
  },

  G10_TRIG_IDENTITIES: () => {
    const sinVal = pick(['3/5', '5/13', '8/17']);
    const [n, d] = sinVal.split('/').map(Number);
    const cosVal = Math.sqrt(d * d - n * n);
    return { question: `If sin(θ) = ${sinVal}, find cos(θ) (first quadrant)`, answer: formatFraction(cosVal, d),
      hint: 'sin²θ + cos²θ = 1' };
  },

  G10_TRIG_EQUATIONS: () => {
    const v = pick([
      { f: 'sin', val: '0.5', a: 30 }, { f: 'sin', val: '√3/2', a: 60 }, { f: 'sin', val: '√2/2', a: 45 },
      { f: 'cos', val: '0.5', a: 60 }, { f: 'cos', val: '√3/2', a: 30 }, { f: 'cos', val: '√2/2', a: 45 },
      { f: 'tan', val: '1', a: 45 }, { f: 'tan', val: '√3', a: 60 },
    ]);
    const second = v.f === 'sin' ? 180 - v.a : v.f === 'cos' ? 360 - v.a : 180 + v.a;
    const range = v.f === 'sin' ? '0° ≤ θ ≤ 180°' : '0° ≤ θ ≤ 360°';
    return { question: `Solve ${v.f}(θ) = ${v.val} for ${range}.`, answer: `${v.a}° and ${second}°`,
      accepts: [`${v.a}° and ${second}°`, `${v.a} and ${second}`],
      hint: v.f === 'sin' ? 'sin(180° − θ) = sin(θ) gives the second answer.' : v.f === 'cos' ? 'cos(360° − θ) = cos(θ) gives the second answer.' : 'tan repeats every 180°.' };
  },

  G10_SINE_COSINE_RULE: () => {
    const a = rand(5, 12), b = rand(5, 12), C = pick([30, 45, 60, 90, 120]);
    const cSquared = a * a + b * b - 2 * a * b * Math.cos(C * Math.PI / 180); // exact cos, as a calculator gives
    return { question: `Cosine rule: a=${a}, b=${b}, C=${C}°. Find c² (to 1 d.p.)`, answer: cSquared.toFixed(1),
      hint: 'c² = a² + b² - 2ab cos(C)' };
  },

  G10_3D_TRIG: () => {
    const l = rand(3, 8), w = rand(3, 8), h = rand(3, 8);
    const diag = roundTo(Math.sqrt(l * l + w * w + h * h), 2);
    return { question: `Space diagonal of cuboid ${l}×${w}×${h}?`, answer: diag.toString(),
      hint: 'd = √(l² + w² + h²)' };
  },

  G10_VECTORS_INTRO: () => {
    const x = rand(-5, 5), y = rand(-5, 5);
    const mag = roundTo(Math.sqrt(x * x + y * y), 2);
    return { question: `Magnitude of vector (${x}, ${y})?`, answer: mag.toString(),
      hint: '|v| = √(x² + y²)' };
  },

  G10_VECTORS_OPS: () => {
    const x1 = rand(-5, 5), y1 = rand(-5, 5), x2 = rand(-5, 5), y2 = rand(-5, 5);
    return { question: `(${x1}, ${y1}) + (${x2}, ${y2}) = ?`, answer: `(${x1 + x2}, ${y1 + y2})`,
      hint: `Add the matching parts separately: x with x (${x1} + ${x2}), then y with y (${y1} + ${y2}).`,
      accepts: [`(${x1 + x2}, ${y1 + y2})`, `(${x1 + x2},${y1 + y2})`] };
  },

  G10_PERMUTATIONS: () => {
    const n = rand(5, 8), r = rand(2, 3);
    let result = 1;
    for (let i = 0; i < r; i++) result *= (n - i);
    return { question: `P(${n},${r}) = ?`, answer: result.toString(),
      hint: 'P(n,r) = n!/(n-r)!' };
  },

  G10_COMBINATIONS: () => {
    const n = rand(5, 8), r = rand(2, 3);
    let num = 1, den = 1;
    for (let i = 0; i < r; i++) { num *= (n - i); den *= (i + 1); }
    return { question: `C(${n},${r}) = ?`, answer: (num / den).toString(),
      hint: 'C(n,r) = n! / (r!(n-r)!)' };
  },

  G10_PROBABILITY_DISTRIBUTIONS: () => {
    const n = rand(3, 5), p = pick([0.2, 0.3, 0.4, 0.5]);
    const mean = Math.round(n * p * 10) / 10;
    return { question: `Binomial: n=${n}, p=${p}. Find the mean.`, answer: mean.toString(),
      hint: 'Mean = np' };
  },

  // ======================== GRADE 11 ========================

  G11_MATRICES_INTRO: () => {
    const a = rand(1, 5), b = rand(1, 5), c = rand(1, 5), d = rand(1, 5);
    return { question: `Matrix A = [${a} ${b}; ${c} ${d}]. What is element a₁₂?`, answer: b.toString(),
      hint: 'a₁₂ means row 1, column 2' };
  },

  G11_MATRICES_OPS: () => {
    const a = rand(1, 5), b = rand(1, 5), c = rand(1, 5), d = rand(1, 5);
    const e = rand(1, 5), f = rand(1, 5), g = rand(1, 5), h = rand(1, 5);
    return { question: `[${a} ${b}; ${c} ${d}] + [${e} ${f}; ${g} ${h}] = ?`, answer: `[${a + e} ${b + f}; ${c + g} ${d + h}]`,
      hint: 'Add each position to its matching position: top-left with top-left, top-right with top-right, and so on.' };
  },

  G11_MATRICES_INVERSE: () => {
    const a = rand(1, 4), b = rand(1, 3), c = rand(1, 3), d = rand(1, 4);
    const det = a * d - b * c;
    if (det === 0) return generators.G11_MATRICES_INVERSE();
    return { question: `Determinant of [${a} ${b}; ${c} ${d}]?`, answer: det.toString(),
      hint: 'det = ad - bc' };
  },

  G11_LINEAR_PROGRAMMING: () => {
    // Feasible region x + y <= k, x >= 0, y >= 0: vertices (0,0), (k,0), (0,k).
    const k = rand(4, 15), a = rand(2, 9);
    let b = rand(2, 9); while (b === a) b = rand(2, 9);
    const best = a > b ? `(${k}, 0)` : `(0, ${k})`;
    return rand(0, 1)
      ? { question: `Maximise P = ${a}x + ${b}y subject to x + y ≤ ${k}, x ≥ 0, y ≥ 0. What is the maximum value of P?`, answer: String(Math.max(a, b) * k),
          hint: `Test the corners (0, 0), (${k}, 0) and (0, ${k}).` }
      : { question: `Maximise P = ${a}x + ${b}y subject to x + y ≤ ${k}, x ≥ 0, y ≥ 0. At which corner is P largest?`, answer: best,
          accepts: [best, best.replace(' ', '')], hint: `Work out P at (0, 0), (${k}, 0) and (0, ${k}).` };
  },

  G11_LIMITS: () => {
    const a = rand(1, 5), b = rand(1, 5);
    return { question: `lim(x→${a}) (${b}x + ${a}) = ?`, answer: (b * a + a).toString(),
      hint: 'For polynomial functions, substitute directly' };
  },

  G11_DIFF_FIRST_PRINCIPLES: () => {
    const n = rand(2, 5), a = rand(1, 6), x = rand(1, 4);
    const co = a * n, pw = n - 1;
    const d = pw === 1 ? `${co}x` : `${co}x^${pw}`;
    return rand(0, 1)
      ? { question: `Differentiate f(x) = ${a === 1 ? '' : a}x^${n} from first principles. What is f'(x)?`, answer: d, accepts: [d, d.replace('^', '**')], hint: `The limit of [f(x+h) − f(x)] / h works out to ${n} × ${a} x^${pw}.` }
      : { question: `f(x) = ${a === 1 ? '' : a}x^${n}. Using the derivative from first principles, find the gradient f'(${x}).`, answer: String(co * x ** pw), hint: `f'(x) = ${d}; put x = ${x}.` };
  },

  G11_DIFF_POWER_RULE: () => {
    const a = rand(2, 6), n = rand(2, 5);
    return { question: `Differentiate: ${a}x^${n}`, answer: `${a * n}x^${n - 1}`,
      workedExample: makeWorkedExample('Differentiate: 3x⁴', ['Using power rule: d/dx(axⁿ) = nax^(n-1)', 'd/dx(3x⁴) = 4 × 3 × x³ = 12x³'], '12x³'),
      hint: 'd/dx(axⁿ) = nax^(n-1)' };
  },

  G11_DIFF_CHAIN_RULE: () => {
    const a = rand(2, 5), b = rand(1, 5), n = rand(2, 4);
    return { question: `Differentiate: (${a}x + ${b})^${n}`, answer: `${n * a}(${a}x + ${b})^${n - 1}`,
      hint: 'd/dx[f(g(x))] = f\'(g(x)) × g\'(x)' };
  },

  G11_DIFF_PRODUCT_QUOTIENT: () => {
    return { question: `Differentiate: x² × (3x + 1). What is dy/dx?`, answer: `9x² + 2x`,
      accepts: ['9x² + 2x', '9x^2 + 2x'],
      hint: 'Product rule: d/dx(uv) = u(dv/dx) + v(du/dx)' };
  },

  G11_DIFF_APPLICATIONS: () => {
    const a = rand(1, 3), b = rand(2, 8), c = rand(1, 10);
    return { question: `f(x) = ${a}x² - ${b}x + ${c}. Find the minimum value of f(x).`, answer: roundTo(c - b * b / (4 * a), 2).toString(),
      hint: 'Find f\'(x) = 0, solve for x, then substitute back' };
  },

  G11_STATIONARY_POINTS: () => {
    // y = x³ - 3a·x → dy/dx = 3x² - 3a = 0 → x = ±√a (BOTH roots).
    const a = rand(1, 3);
    const root = a === 1 ? '1' : `√${a}`;
    const dec = roundTo(Math.sqrt(a), 2);
    return { question: `y = x³ - ${3 * a}x. Find the x-coordinates of the stationary points.`,
      answer: `x = ±${root}`,
      accepts: [`±${root}`, `x=±${root}`, `±${dec}`, `x=±${dec}`, `${root},-${root}`],
      hint: 'Set dy/dx = 0 and solve — remember a square root has two values' };
  },

  G11_TRIG_GRAPHS: () => {
    const a = rand(2, 5);
    return { question: `y = ${a}sin(x). What is the amplitude?`, answer: a.toString(),
      hint: 'Amplitude = |a| in y = a sin(x)' };
  },

  G11_TRIG_ADDITION: () => {
    const [A, B, op] = pick([[45, 30, '+'], [60, 45, '+'], [45, 30, '-'], [60, 45, '-'], [90, 45, '+'], [120, 45, '+']]); // never 90° (cos 90° = 0)
    const fn = pick(['sin', 'cos']);
    const ang = op === '+' ? A + B : A - B;
    const v = (fn === 'sin' ? Math.sin : Math.cos)(ang * Math.PI / 180);
    const ans = v.toFixed(3);
    return { question: `Use the ${fn} ${op === '+' ? 'addition' : 'subtraction'} formula to find ${fn}(${ang}°) as ${fn}(${A}° ${op === '+' ? '+' : '−'} ${B}°). Give your answer to 3 decimal places.`, answer: ans,
      hint: fn === 'sin' ? `sin(A ${op} B) = sinA cosB ${op} cosA sinB` : `cos(A ${op} B) = cosA cosB ${op === '+' ? '−' : '+'} sinA sinB` };
  },

  G11_TRIG_DOUBLE_ANGLE: () => {
    const [a, b, c] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]]);
    const g = (x, y) => { x = Math.abs(x); while (y) [x, y] = [y, x % y]; return x; };
    const frac = (n, d) => { const k = g(n, d); return `${n / k}/${d / k}`; };
    return rand(0, 1)
      ? { question: `θ is acute and sin(θ) = ${a}/${c}. Find sin(2θ) as a fraction.`, answer: frac(2 * a * b, c * c), hint: `sin(2θ) = 2 sinθ cosθ, and cosθ = ${b}/${c}.` }
      : { question: `θ is acute and sin(θ) = ${a}/${c}. Find cos(2θ) as a fraction.`, answer: frac(b * b - a * a, c * c), hint: `cos(2θ) = cos²θ − sin²θ, with cosθ = ${b}/${c}.` };
  },

  G11_VECTORS_3D: () => {
    const x = rand(-5, 5), y = rand(-5, 5), z = rand(-5, 5);
    const mag = roundTo(Math.sqrt(x * x + y * y + z * z), 2);
    return { question: `Magnitude of (${x}, ${y}, ${z})?`, answer: mag.toString(),
      hint: '|v| = √(x² + y² + z²)' };
  },

  G11_BINOMIAL_DISTRIBUTION: () => {
    const n = rand(4, 8), p = 0.5, k = rand(0, 2);
    let nCk = 1;
    for (let i = 0; i < k; i++) nCk = nCk * (n - i) / (i + 1);
    const prob = roundTo(nCk * Math.pow(p, k) * Math.pow(1 - p, n - k), 4);
    return { question: `B(${n}, ${p}). P(X = ${k})?`, answer: prob.toString(),
      hint: 'P(X=k) = C(n,k) × p^k × (1-p)^(n-k)' };
  },

  G11_NORMAL_DISTRIBUTION: () => {
    const m = pick([50, 60, 100, 120, 170]), sd = pick([2, 4, 5, 10, 15]), k = pick([1, 2, 3]);
    const pctIn = { 1: '68', 2: '95', 3: '99.7' }[k];
    return rand(0, 1)
      ? { question: `Heights are normally distributed with mean ${m} and standard deviation ${sd}. About what percentage lie between ${m - k * sd} and ${m + k * sd}?`, answer: pctIn,
          accepts: [pctIn, `${pctIn}%`], hint: 'The 68-95-99.7 rule: within 1, 2 and 3 standard deviations of the mean.' }
      : { question: `Marks are normally distributed with mean ${m} and standard deviation ${sd}. About what percentage are above ${m + k * sd}?`, answer: { 1: '16', 2: '2.5', 3: '0.15' }[k],
          accepts: [{ 1: '16', 2: '2.5', 3: '0.15' }[k], { 1: '16%', 2: '2.5%', 3: '0.15%' }[k], ...(k === 1 ? ['15.9', '15.85'] : [])], hint: `${pctIn}% lie within ${k} SD of the mean; the rest is split equally between the two tails.` };
  },

  // ======================== GRADE 12 ========================

  G12_INTEGRATION_INTRO: () => {
    const n = rand(2, 5);
    return { question: `∫x^${n} dx = ?`, answer: `x^${n + 1}/${n + 1} + C`,
      accepts: [`x^${n + 1}/${n + 1} + C`, `x^${n + 1}/${n + 1}+C`, `(1/${n + 1})x^${n + 1} + C`],
      workedExample: makeWorkedExample('∫x³ dx', ['Add 1 to the power: 3 + 1 = 4', 'Divide by new power: x⁴/4', 'Add constant: x⁴/4 + C'], 'x⁴/4 + C'),
      hint: '∫xⁿ dx = x^(n+1)/(n+1) + C' };
  },

  G12_INTEGRATION_POWER: () => {
    const a = rand(2, 6), n = rand(2, 4);
    return { question: `∫${a}x^${n} dx = ?`, answer: `${a}x^${n + 1}/${n + 1} + C`,
      accepts: [`${a}x^${n + 1}/${n + 1} + C`, `${a}/${n + 1}x^${n + 1} + C`] };
  },

  G12_DEFINITE_INTEGRALS: () => {
    const a = 0, b = rand(2, 4), n = 2;
    const result = Math.pow(b, n + 1) / (n + 1) - Math.pow(a, n + 1) / (n + 1);
    return { question: `∫₀^${b} x² dx = ?`, answer: roundTo(result, 2).toString(),
      hint: 'Evaluate the antiderivative at upper and lower bounds, then subtract' };
  },

  G12_AREA_UNDER_CURVE: () => {
    const b = rand(2, 4);
    const area = Math.pow(b, 3) / 3;
    return { question: `Area between y = x² and x-axis from x = 0 to x = ${b}?`, answer: roundTo(area, 2).toString(),
      hint: 'Area = ∫₀^b x² dx' };
  },

  G12_INTEGRATION_BY_PARTS: () => {
    return { question: `∫x·eˣ dx = ? (using integration by parts)`, answer: `xeˣ - eˣ + C`,
      accepts: ['xeˣ - eˣ + C', '(x-1)eˣ + C', 'xe^x - e^x + C'],
      hint: '∫u dv = uv - ∫v du. Let u = x, dv = eˣ dx' };
  },

  G12_INTEGRATION_SUBSTITUTION: () => {
    const a = rand(2, 5);
    return { question: `∫2x(x² + ${a})³ dx using substitution u = x² + ${a}`, answer: `(x² + ${a})⁴/4 + C`,
      accepts: [`(x² + ${a})⁴/4 + C`, `(x^2 + ${a})^4/4 + C`],
      hint: 'Let u = x² + a, then du = 2x dx' };
  },

  G12_DIFF_EQ_INTRO: () => {
    const a = rand(2, 5);
    return { question: `Solve dy/dx = ${a}x, given y(0) = 0`, answer: `y = ${a}x²/2`,
      accepts: [`y = ${a}x²/2`, `y = ${a/2}x²`, `y=${a}x^2/2`],
      hint: 'Integrate both sides with respect to x' };
  },

  G12_FURTHER_DIFF: () => {
    return { question: `Differentiate: eˣ + ln(x)`, answer: `eˣ + 1/x`,
      accepts: ['eˣ + 1/x', 'e^x + 1/x'],
      hint: 'd/dx(eˣ) = eˣ, d/dx(ln x) = 1/x' };
  },

  G12_FURTHER_INTEGRATION: () => {
    const k = rand(2, 9);
    return pick([
      { question: `Evaluate the integral of ${k}/x dx from x = 1 to x = e.`, answer: String(k), hint: `The integral of ${k}/x is ${k} ln|x|, and ln(e) − ln(1) = 1.` },
      { question: `Evaluate the integral of eˣ dx from x = 0 to x = ln(${k}).`, answer: String(k - 1), hint: `The integral of eˣ is eˣ: e^(ln ${k}) − e⁰.` },
      { question: `Evaluate the integral of ${k}/x dx from x = 1 to x = e².`, answer: String(2 * k), hint: `${k} ln|x| from 1 to e²: ln(e²) = 2.` },
    ]);
  },

  G12_PROOF: () => pick([
    () => { const n = rand(2, 8); return { question: `The sum of the first n odd numbers is n². Check it for n = ${n}: what is 1 + 3 + ... + ${2 * n - 1}?`, answer: String(n * n), hint: `Add them, or use n² with n = ${n}.` }; },
    () => { const n = rand(2, 9); return { question: `Check 1 + 2 + ... + n = n(n+1)/2 for n = ${n}. What is the sum?`, answer: String(n * (n + 1) / 2), hint: `${n} × ${n + 1} ÷ 2.` }; },
    () => ({ question: 'In proof by induction, you assume the statement is true for n = k. For which value of n do you then prove it?', answer: 'k+1', accepts: ['k+1', 'k + 1', 'n = k + 1', 'n=k+1'], hint: 'The next one after k.' }),
    () => ({ question: 'In proof by induction, what is the first case you usually check? n = ?', answer: '1', accepts: ['1', 'n = 1', 'n=1'], hint: 'The base case: the smallest n the statement is about.' }),
    () => { const n = rand(1, 6); return { question: `Check 2ⁿ − 1 = 1 + 2 + 4 + ... + 2ⁿ⁻¹ for n = ${n}. What is 2^${n} − 1?`, answer: String(2 ** n - 1), hint: `2^${n} = ${2 ** n}.` }; },
  ])(),

  G12_COMPLEX_NUMBERS: () => {
    const a = rand(1, 5), b = rand(1, 5);
    return { question: `If z = ${a} + ${b}i, find |z|`, answer: roundTo(Math.sqrt(a * a + b * b), 2).toString(),
      hint: '|z| = √(a² + b²)' };
  },

  G12_PARAMETRIC_EQ: () => {
    const a = rand(2, 5), b = rand(1, 4), t = rand(1, 6);
    return rand(0, 1)
      ? { question: `x = ${a}t and y = ${b}t². Find y when x = ${a * t}.`, answer: String(b * t * t), hint: `First find t from x = ${a}t, then put it into y.` }
      : { question: `x = t + ${a} and y = ${b}t. Find y when x = ${t + a}.`, answer: String(b * t), hint: `t = x − ${a}.` };
  },

  G12_POLAR_COORDS: () => {
    const r = rand(2, 6), theta = pick([0, 30, 45, 60, 90]);
    const cosVals = { 0: 1, 30: 0.866, 45: 0.707, 60: 0.5, 90: 0 };
    const sinVals = { 0: 0, 30: 0.5, 45: 0.707, 60: 0.866, 90: 1 };
    return { question: `Convert polar (${r}, ${theta}°) to Cartesian`, answer: `(${roundTo(r * cosVals[theta], 2)}, ${roundTo(r * sinVals[theta], 2)})`,
      hint: 'x = r cos(θ), y = r sin(θ)' };
  },

  G12_VECTORS_ADV: () => {
    const x1 = rand(1, 4), y1 = rand(1, 4), z1 = rand(1, 4);
    const x2 = rand(1, 4), y2 = rand(1, 4), z2 = rand(1, 4);
    const dot = x1 * x2 + y1 * y2 + z1 * z2;
    return { question: `Dot product: (${x1},${y1},${z1}) · (${x2},${y2},${z2}) = ?`, answer: dot.toString(),
      hint: 'a·b = x₁x₂ + y₁y₂ + z₁z₂' };
  },

  G12_HYPOTHESIS_TESTING: () => {
    const alpha = pick([0.01, 0.05, 0.1]);
    let p = rand(1, 150) / 1000; while (Math.abs(p - alpha) < 1e-9) p = rand(1, 150) / 1000;
    const reject = p < alpha;
    return { question: `A test gives a p-value of ${p}. The significance level is ${alpha}. Do we reject H₀? (yes or no)`, answer: reject ? 'yes' : 'no',
      accepts: reject ? ['yes', 'reject', 'reject h0', 'yes, reject'] : ['no', 'do not reject', "don't reject", 'accept', 'no, do not reject'],
      hint: 'Reject H₀ when the p-value is smaller than the significance level.' };
  },

  G12_CORRELATION_REGRESSION: () => {
    const r = (rand(0, 1) ? 1 : -1) * rand(5, 98) / 100;
    const strength = Math.abs(r) >= 0.7 ? 'strong' : Math.abs(r) >= 0.4 ? 'moderate' : 'weak';
    const dir = r > 0 ? 'positive' : 'negative';
    return { question: `A correlation coefficient is r = ${r}. Describe the correlation (strong, moderate or weak; positive or negative).`, answer: `${strength} ${dir}`,
      accepts: [`${strength} ${dir}`, `${strength} ${dir} correlation`, `${strength}, ${dir}`],
      hint: 'The sign gives the direction. Size: 0.7 to 1 strong, 0.4 to 0.7 moderate, below 0.4 weak.' };
  },
};

// ==================== MAIN EXPORT ====================

// How many ordered knowledge points a skill's content ladders through (1 if it
// isn't a withKPs ladder). Lets the lesson loop climb KP0 → KP1 → … in order.
export const kpCount = (skillId) => {
  const id = PRIMARY_ALIAS[skillId] || skillId;
  return STRUCTURED_CONTENT[id]?.kpCount || 1;
};

// Last safety net on every question (found by scripts/audit-answers.mjs):
// tidy computer float noise ("0.8999999999999999" -> "0.9") wherever a child
// would see it, and drop any listed misconception that is really the answer.
const FLOAT_NOISE = /-?\d+\.\d*?(?:0{6,}|9{6,})\d{0,3}(?!\d)/g;
const tidyNum = (t) => (typeof t === 'string' ? t.replace(FLOAT_NOISE, (m) => String(Number(Number(m).toPrecision(12)))) : t);
const tidy = (p) => {
  if (!p || typeof p !== 'object') return p;
  for (const k of ['question', 'answer', 'hint']) p[k] = tidyNum(p[k]);
  if (Array.isArray(p.accepts)) p.accepts = p.accepts.map(tidyNum);
  if (Array.isArray(p.hints)) p.hints = p.hints.map(tidyNum);
  if (p.solution && typeof p.solution.answer === 'string') p.solution.answer = tidyNum(p.solution.answer);
  if (Array.isArray(p.misconceptions)) {
    p.misconceptions = p.misconceptions.filter(m => !m || m.when == null || !checkAnswerMatch(String(m.when), p));
  }
  return p;
};

export const generateProblem = (skillId, opts = {}) => tidy(generateRaw(skillId, opts));
const generateRaw = (skillId, opts = {}) => {
  // Lower-primary (Grade 1–4) skills reuse an equivalent skill's content.
  if (PRIMARY_ALIAS[skillId]) skillId = PRIMARY_ALIAS[skillId];
  // Prefer authored structured content when present. `opts.level` lets the
  // lesson request a concrete/pictorial representation (modality escalation).
  const structured = STRUCTURED_CONTENT[skillId];
  if (structured) {
    try { return structured(opts); }
    catch (e) { console.warn(`Structured content error for ${skillId}:`, e); }
  }
  const gen = generators[skillId];
  if (!gen) {
    const skill = SKILLS[skillId];
    // `placeholder: true` tells the lesson loop NOT to grant mastery/credit from
    // this stand-in problem (a skill with no authored generator must never become
    // free mastery by typing "1"). Today coverage is 100%, so this is a guard.
    return { question: `Practice: ${skill?.name || skillId}`, answer: '1', hint: 'Answer 1 to continue', placeholder: true };
  }
  try {
    return gen();
  } catch (e) {
    console.warn(`Problem generator error for ${skillId}:`, e);
    return { question: `Practice: ${SKILLS[skillId]?.name || skillId}`, answer: '1', placeholder: true };
  }
};

// Generate a worked example for a specific KP of a skill
export const generateWorkedExample = (skillId) => {
  const problem = generateProblem(skillId);
  return problem.workedExample || null;
};

export default generateProblem;
