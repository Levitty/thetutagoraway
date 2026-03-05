// ============================================================================
// PROBLEM GENERATORS — Every skill gets a generator
// Each returns { question, answer, accepts?, hint?, workedExample? }
// workedExample: { problem, steps[], solution } for KP-based lessons
// ============================================================================

import { SKILLS } from './knowledgeGraph.js';

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

const makeWorkedExample = (problem, steps, solution) => ({ problem, steps, solution });

// ==================== GENERATORS ====================

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
      workedExample: makeWorkedExample('234 + 567 = ?', ['Line up the digits by place value', '4 + 7 = 11, write 1 carry 1', '3 + 6 + 1 = 10, write 0 carry 1', '2 + 5 + 1 = 8'], '801') };
  },

  G5_SUBTRACTION: () => {
    const a = rand(200, 999), b = rand(100, a - 1);
    return { question: `${a} - ${b} = ?`, answer: (a - b).toString(),
      workedExample: makeWorkedExample('543 - 278 = ?', ['Line up digits. Start from ones: 3 - 8, need to borrow', '13 - 8 = 5', '3 (was 4, borrowed 1) - 7, borrow again: 13 - 7 = 6', '4 (was 5, borrowed 1) - 2 = 2'], '265') };
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
    return { question: `What is the ${askFor} of ${n}?`, answer, hint: `Factors of ${n}: ${factors.join(', ')}` };
  },

  G5_MULTIPLES: () => {
    const n = rand(2, 12), nth = rand(3, 10);
    return { question: `What is the ${nth}${nth === 3 ? 'rd' : 'th'} multiple of ${n}?`, answer: (n * nth).toString(),
      hint: `Multiples of ${n}: ${n}, ${n*2}, ${n*3}, ...` };
  },

  G5_FRACTIONS_INTRO: () => {
    const den = pick([2, 3, 4, 5, 6, 8]);
    const num = rand(1, den - 1);
    const total = den * rand(2, 5);
    const part = num * (total / den);
    return { question: `What is ${num}/${den} of ${total}?`, answer: part.toString(),
      workedExample: makeWorkedExample('What is 3/4 of 20?', ['Divide 20 by 4 = 5', 'Multiply 5 by 3 = 15'], '15') };
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
    const types = [
      { desc: 'all sides equal', answer: 'equilateral' },
      { desc: 'two sides equal', answer: 'isosceles' },
      { desc: 'no sides equal', answer: 'scalene' },
    ];
    const t = pick(types);
    return { question: `A triangle with ${t.desc} is called...?`, answer: t.answer };
  },

  G5_LINES: () => {
    const q = pick([
      { question: 'Lines that never meet are called...?', answer: 'parallel' },
      { question: 'Lines that meet at 90° are called...?', answer: 'perpendicular' },
    ]);
    return q;
  },

  G5_LENGTH: () => {
    const convs = [
      { q: 'How many cm in 3.5 meters?', a: '350' },
      { q: 'How many meters in 4500 cm?', a: '45' },
      { q: 'How many mm in 2.5 cm?', a: '25' },
      { q: 'How many km in 7000 meters?', a: '7' },
    ];
    return pick(convs);
  },

  G5_MASS: () => {
    const convs = [
      { q: 'How many grams in 2.5 kg?', a: '2500' },
      { q: 'How many kg in 4000 g?', a: '4' },
    ];
    const c = pick(convs);
    return { question: c.q, answer: c.a };
  },

  G5_TIME: () => {
    const h1 = rand(8, 11), m1 = rand(0, 3) * 15;
    const durH = rand(1, 3), durM = pick([0, 15, 30, 45]);
    let h2 = h1 + durH, m2 = m1 + durM;
    if (m2 >= 60) { h2++; m2 -= 60; }
    return { question: `A lesson starts at ${h1}:${m1.toString().padStart(2, '0')} and lasts ${durH} hour${durH > 1 ? 's' : ''}${durM > 0 ? ` ${durM} minutes` : ''}. When does it end?`,
      answer: `${h2}:${m2.toString().padStart(2, '0')}`, accepts: [`${h2}:${m2.toString().padStart(2, '0')}`, `${h2 > 12 ? h2 - 12 : h2}:${m2.toString().padStart(2, '0')}`] };
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
    return { question: `In a survey: ${items.map((it, i) => `${it}: ${counts[i]}`).join(', ')}. How many ${items[ask]} were counted?`, answer: counts[ask].toString() };
  },

  G5_BAR_GRAPHS: () => {
    const a = rand(10, 30), b = rand(10, 30), c = rand(10, 30);
    return { question: `A bar graph shows: Mon=${a}, Tue=${b}, Wed=${c} visitors. What is the total?`, answer: (a + b + c).toString() };
  },

  G5_PICTOGRAPHS: () => {
    const val = pick([2, 5, 10]);
    const symbols = rand(3, 8);
    return { question: `In a pictograph, each symbol = ${val} items. If there are ${symbols} symbols, how many items?`, answer: (val * symbols).toString() };
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
    return { question: `${n}² = ?`, answer: (n * n).toString() };
  },

  G6_PATTERNS: () => {
    const start = rand(2, 10), step = rand(2, 5);
    const seq = Array.from({ length: 5 }, (_, i) => start + step * i);
    return { question: `What comes next: ${seq.join(', ')}, ...?`, answer: (start + step * 5).toString(), hint: `Look for the common difference` };
  },

  G6_SIMPLE_EQUATIONS: () => {
    const x = rand(2, 15), a = rand(2, 10);
    const type = rand(0, 1);
    if (type === 0) return { question: `x + ${a} = ${x + a}. Find x.`, answer: x.toString() };
    return { question: `x - ${a} = ${x - a}. Find x.`, answer: x.toString() };
  },

  G6_ANGLE_MEASURE: () => {
    const angle = rand(20, 160);
    const type = angle < 90 ? 'acute' : angle === 90 ? 'right' : 'obtuse';
    return { question: `An angle measures ${angle}°. Is it acute, right, or obtuse?`, answer: type };
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
    const shapes = [{ s: 'square', l: 4 }, { s: 'equilateral triangle', l: 3 }, { s: 'rectangle', l: 2 }, { s: 'circle', l: 'infinite' }, { s: 'isosceles triangle', l: 1 }];
    const shape = pick(shapes);
    return { question: `How many lines of symmetry does a ${shape.s} have?`, answer: shape.l.toString() };
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
      () => { const v = roundTo(rand(1, 10) + rand(1, 9) / 10, 1); return { q: `Convert ${v} km to meters`, a: (v * 1000).toString() }; },
      () => { const v = rand(100, 9000); return { q: `Convert ${v} g to kg`, a: (v / 1000).toString() }; },
      () => { const v = rand(100, 5000); return { q: `Convert ${v} ml to litres`, a: (v / 1000).toString() }; },
    ];
    const c = pick(convs)();
    return { question: c.q, answer: c.a };
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
    return { question: `Survey of ${total} students: football=${cat1}, basketball=${cat2}, volleyball=? Find volleyball.`, answer: cat3.toString() };
  },

  // ======================== GRADE 7 ========================

  G7_PLACE_VALUE: () => {
    const num = rand(100000000, 999999999);
    const pos = pick(['hundred millions', 'ten millions']);
    const mult = pos === 'hundred millions' ? 100000000 : 10000000;
    return { question: `What digit is in the ${pos} place of ${num.toLocaleString()}?`, answer: (Math.floor(num / mult) % 10).toString() };
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
    return { question: `${n1}/${d1} + ${n2}/${d2} = ?`, answer: formatFraction(sum, cd) };
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
    return { question: `What is the ${pos} digit of ${str}?`, answer: digit };
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
    return { question: `${n}² = ?`, answer: (n * n).toString() };
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

  G7_LENGTH_CONV: () => {
    const convs = [
      { q: 'How many cm in 2.5 m?', a: '250' },
      { q: 'How many m in 450 cm?', a: '4.5' },
      { q: 'How many km in 3500 m?', a: '3.5' },
    ];
    return pick(convs);
  },

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
    return { question: `Bar graph shows: ${labels.map((l, i) => `${l}=${vals[i]}`).join(', ')}. Total?`, answer: total.toString() };
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
    const num = sig * Math.pow(10, exp);
    return rand(0, 1)
      ? { question: `Write ${num.toLocaleString()} in standard form`, answer: `${sig} × 10^${exp}`, accepts: [`${sig} × 10^${exp}`, `${sig}×10^${exp}`, `${sig}e${exp}`] }
      : { question: `${sig} × 10^${exp} = ?`, answer: num.toString() };
  },

  G8_CUBES_CUBE_ROOTS: () => {
    const n = rand(2, 6);
    return rand(0, 1)
      ? { question: `${n}³ = ?`, answer: (n * n * n).toString() }
      : { question: `∛${n * n * n} = ?`, answer: n.toString() };
  },

  G8_RATIO_PROPORTION: () => {
    const a = rand(2, 6), b = rand(2, 6), total = (a + b) * rand(3, 8);
    return { question: `Divide ${total} in the ratio ${a}:${b}. Find the larger part.`, answer: (Math.max(a, b) / (a + b) * total).toString() };
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
    const x = rand(1, 10), a = rand(2, 5), b = rand(1, 8), c = rand(1, 3), d = rand(1, 10);
    const rhs = a * x + b - c * x - d;
    return { question: `Solve: ${a}x + ${b} = ${c}x + ${rhs + d}`, answer: x.toString(),
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
    return { question: `Solve: ${a}x - ${b} < ${a * bound - b}`, answer: `x < ${bound}`, accepts: [`x < ${bound}`, `x<${bound}`] };
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
    const conditions = ['SSS', 'SAS', 'ASA', 'RHS'];
    return { question: `Which congruence condition: two sides and the included angle are equal?`, answer: 'SAS',
      hint: 'SSS, SAS, ASA, RHS' };
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
    return { question: `Volume of a cylinder: r=${r} cm, h=${h} cm? (π=3.14)`, answer: roundTo(3.14 * r * r * h, 2).toString() };
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
    return { question: `Frequencies: ${freqs.join(', ')}. What is the total cumulative frequency?`, answer: cumFreqs[cumFreqs.length - 1].toString() };
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
    return { question: `Monthly salary: KSh ${salary.toLocaleString()}. Tax rate: ${taxRate}%. Find tax amount.`, answer: tax.toString() };
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

  G9_CONSTRUCTION: () => {
    const angle = pick([60, 90, 120]);
    return { question: `What compass construction gives you a ${angle}° angle?`, answer: angle === 60 ? 'equilateral triangle construction' : angle === 90 ? 'perpendicular bisector' : 'two 60° angles',
      accepts: ['equilateral triangle construction', 'perpendicular bisector', 'two 60° angles', 'equilateral triangle', 'perpendicular'] };
  },

  G9_LOCI: () => {
    return { question: `The locus of points equidistant from two fixed points is a...?`, answer: 'perpendicular bisector',
      accepts: ['perpendicular bisector', 'line'] };
  },

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

  G9_SURFACE_AREA_ADV: () => {
    const r = rand(3, 7);
    return { question: `Surface area of a sphere with radius ${r} cm? (π=3.14)`, answer: roundTo(4 * 3.14 * r * r, 2).toString(),
      hint: 'SA = 4πr²' };
  },

  G9_VOLUME_ADV: () => {
    const r = rand(3, 7), h = rand(6, 12);
    return { question: `Volume of a cone: r=${r}, h=${h}? (π=3.14)`, answer: roundTo(3.14 * r * r * h / 3, 2).toString(),
      hint: 'V = (1/3)πr²h' };
  },

  G9_GROUPED_DATA: () => {
    const intervals = ['0-10', '10-20', '20-30', '30-40'];
    const freqs = intervals.map(() => rand(3, 12));
    const total = freqs.reduce((s, f) => s + f, 0);
    return { question: `Grouped data frequencies: ${intervals.map((iv, i) => `${iv}: ${freqs[i]}`).join(', ')}. Total frequency?`, answer: total.toString() };
  },

  G9_PROBABILITY_ADV: () => {
    const red = rand(3, 7), blue = rand(3, 7), total = red + blue;
    const p = formatFraction(red * (red - 1), total * (total - 1));
    return { question: `Bag: ${red} red, ${blue} blue. Two drawn without replacement. P(both red)?`, answer: p,
      hint: 'P = (r/n) × ((r-1)/(n-1))' };
  },

  G9_SCATTER_PLOTS: () => {
    return pick([
      { question: 'Temperature increases, ice cream sales increase. What type of correlation?', answer: 'positive', accepts: ['positive', 'positive correlation'] },
      { question: 'Hours of study increases, test errors decrease. What type of correlation?', answer: 'negative', accepts: ['negative', 'negative correlation'] },
    ]);
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
      () => { const a = rand(10, 50), b = rand(2, 5); return { q: `Simplify: log(${a}) - log(${b})`, a: `log(${a / b})`, hint: 'log(a) - log(b) = log(a/b)' }; },
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
    const a = rand(1, 5), b = rand(1, 5);
    return { question: `Express ${a + b}/((x+1)(x+2)) as partial fractions if A/(x+1) + B/(x+2)`, answer: `A=${a}, B=${b-a > 0 ? b - a : -(a-b)}`,
      hint: 'Multiply through by denominator, then substitute convenient x values' };
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
    const n = rand(3, 5);
    return { question: `Find the coefficient of x² in (1 + x)^${n}`, answer: (n * (n - 1) / 2).toString(),
      hint: 'Use C(n, r) = n! / (r!(n-r)!)' };
  },

  G10_FUNCTIONS_ADV: () => {
    const a = rand(2, 4), b = rand(1, 5), x = rand(1, 5);
    return { question: `f(x) = ${a}x + ${b}. Find f⁻¹(x) and f⁻¹(${a * x + b}).`, answer: `f⁻¹(x) = (x - ${b})/${a}, f⁻¹(${a * x + b}) = ${x}`,
      accepts: [`${x}`, `f⁻¹(${a * x + b}) = ${x}`],
      hint: 'For inverse: swap x and y, solve for y' };
  },

  G10_EXPONENTIAL_GRAPHS: () => {
    const base = rand(2, 3);
    return { question: `For y = ${base}^x, what is y when x = 0?`, answer: '1',
      hint: 'Any number raised to the power 0 equals 1' };
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
    const vals = [{ sin: 0.5, angle: 30 }, { sin: 0.866, angle: 60 }, { cos: 0.5, angle: 60 }];
    const v = pick(vals);
    if (v.sin !== undefined) return { question: `Solve sin(θ) = ${v.sin} for 0° ≤ θ ≤ 180°`, answer: `${v.angle}° and ${180 - v.angle}°` };
    return { question: `Solve cos(θ) = ${v.cos} for 0° ≤ θ ≤ 360°`, answer: `${v.angle}° and ${360 - v.angle}°` };
  },

  G10_SINE_COSINE_RULE: () => {
    const a = rand(5, 12), b = rand(5, 12), C = pick([30, 45, 60, 90, 120]);
    const cosC = { 30: 0.866, 45: 0.707, 60: 0.5, 90: 0, 120: -0.5 }[C];
    const cSquared = a * a + b * b - 2 * a * b * cosC;
    return { question: `Cosine rule: a=${a}, b=${b}, C=${C}°. Find c² (to 1 d.p.)`, answer: roundTo(cSquared, 1).toString(),
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
    const mean = n * p;
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
    return { question: `[${a} ${b}; ${c} ${d}] + [${e} ${f}; ${g} ${h}] = ?`, answer: `[${a + e} ${b + f}; ${c + g} ${d + h}]` };
  },

  G11_MATRICES_INVERSE: () => {
    const a = rand(1, 4), b = rand(1, 3), c = rand(1, 3), d = rand(1, 4);
    const det = a * d - b * c;
    if (det === 0) return generators.G11_MATRICES_INVERSE();
    return { question: `Determinant of [${a} ${b}; ${c} ${d}]?`, answer: det.toString(),
      hint: 'det = ad - bc' };
  },

  G11_LINEAR_PROGRAMMING: () => {
    return { question: `Maximize P = 3x + 2y subject to x + y ≤ 10, x ≥ 0, y ≥ 0. Maximum P at which vertex?`, answer: `(10, 0)`,
      accepts: ['(10, 0)', '(10,0)', '10,0'],
      hint: 'Test each vertex of the feasible region' };
  },

  G11_LIMITS: () => {
    const a = rand(1, 5), b = rand(1, 5);
    return { question: `lim(x→${a}) (${b}x + ${a}) = ?`, answer: (b * a + a).toString(),
      hint: 'For polynomial functions, substitute directly' };
  },

  G11_DIFF_FIRST_PRINCIPLES: () => {
    const n = rand(2, 4);
    return { question: `Differentiate f(x) = x^${n} from first principles. What is f'(x)?`, answer: `${n}x^${n - 1}`,
      accepts: [`${n}x^${n - 1}`, `${n}x^${n-1}`],
      hint: 'f\'(x) = lim(h→0) [f(x+h) - f(x)] / h' };
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
    const a = rand(1, 3), b = rand(2, 6);
    return { question: `y = x³ - ${3 * a}x. Find the x-coordinates of the stationary points.`, answer: `x = ${a === 1 ? '' : '±'}√${a === 1 ? 1 : a}`,
      accepts: [`√${a}`, `x = ±√${a}`, `${roundTo(Math.sqrt(a), 2)}`],
      hint: 'Set dy/dx = 0 and solve' };
  },

  G11_TRIG_GRAPHS: () => {
    const a = rand(2, 5);
    return { question: `y = ${a}sin(x). What is the amplitude?`, answer: a.toString(),
      hint: 'Amplitude = |a| in y = a sin(x)' };
  },

  G11_TRIG_ADDITION: () => {
    return { question: `Using sin(A+B) = sinAcosB + cosAsinB, find sin(75°) as sin(45°+30°)`, answer: `(√6+√2)/4`,
      accepts: ['(√6+√2)/4', '0.966'],
      hint: 'sin(45+30) = sin45cos30 + cos45sin30' };
  },

  G11_TRIG_DOUBLE_ANGLE: () => {
    return { question: `If sin(θ) = 3/5, find sin(2θ)`, answer: `24/25`,
      hint: 'sin(2θ) = 2sin(θ)cos(θ)' };
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
    return { question: `Normal distribution: mean=100, std=15. What percentage is within 1 standard deviation?`, answer: '68',
      accepts: ['68', '68%', '68.27'],
      hint: '68-95-99.7 rule' };
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
    return { question: `∫1/x dx = ?`, answer: `ln|x| + C`,
      accepts: ['ln|x| + C', 'ln(x) + C', 'lnx + C'],
      hint: '∫(1/x) dx = ln|x| + C' };
  },

  G12_PROOF: () => {
    return { question: `Prove by mathematical induction: 1 + 2 + ... + n = n(n+1)/2. What is the base case when n=1?`, answer: '1',
      hint: 'Check: left side = 1, right side = 1(2)/2 = 1' };
  },

  G12_COMPLEX_NUMBERS: () => {
    const a = rand(1, 5), b = rand(1, 5);
    return { question: `If z = ${a} + ${b}i, find |z|`, answer: roundTo(Math.sqrt(a * a + b * b), 2).toString(),
      hint: '|z| = √(a² + b²)' };
  },

  G12_PARAMETRIC_EQ: () => {
    const t = rand(1, 4);
    return { question: `x = 2t, y = t². Find y in terms of x.`, answer: `y = x²/4`,
      accepts: ['y = x²/4', 'y=x^2/4', 'y = x²/ 4'],
      hint: 'Express t in terms of x, substitute into y' };
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
    return { question: `In a hypothesis test, if p-value = 0.03 and significance level = 0.05, do we reject H₀?`, answer: 'yes',
      accepts: ['yes', 'reject'],
      hint: 'Reject H₀ if p-value < significance level' };
  },

  G12_CORRELATION_REGRESSION: () => {
    return { question: `If r = -0.92, describe the correlation.`, answer: 'strong negative',
      accepts: ['strong negative', 'strong negative correlation'],
      hint: 'r close to -1 = strong negative, r close to +1 = strong positive' };
  },
};

// ==================== MAIN EXPORT ====================

export const generateProblem = (skillId) => {
  const gen = generators[skillId];
  if (!gen) {
    const skill = SKILLS[skillId];
    return { question: `Practice: ${skill?.name || skillId}`, answer: '1', hint: 'Answer 1 to continue' };
  }
  try {
    return gen();
  } catch (e) {
    console.warn(`Problem generator error for ${skillId}:`, e);
    return { question: `Practice: ${SKILLS[skillId]?.name || skillId}`, answer: '1' };
  }
};

// Generate a worked example for a specific KP of a skill
export const generateWorkedExample = (skillId) => {
  const problem = generateProblem(skillId);
  return problem.workedExample || null;
};

export default generateProblem;
