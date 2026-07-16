// ============================================================================
// LOWER-PRIMARY CONTENT (CBC Grades 1–4) — grade-banded, authored to the
// number ranges in the actual KICD curriculum designs (verified 2026-07-16):
//   G1: single-digit add/sub, counting to 100, coins to 20 bob
//   G2: 2-digit add/sub within 100, tables of 2/3/4/5/10, sharing, ½ & ¼
//   G3: 3-digit add/sub within 1000, tables to 10×10, unit fractions of sets
//   G4: within 10,000, 2-digit × 1-digit, long division by 1-digit
// Replaces the old aliases that borrowed Grade-5 difficulty (e.g. "190+640"
// shown to a Grade-1 learner).
// ============================================================================

import { accepts, hintLadder, randInt, pick, coin, withWorkedExample, withKPs } from './schema.js';

// ---------------------------------------------------------------------------
// Shared arithmetic cores, parameterised by grade band
// ---------------------------------------------------------------------------

// Column-arithmetic predicates for KP targeting (regrouping = a carry; borrowing).
const needsCarry = (a, b) => { while (a > 0 && b > 0) { if (a % 10 + b % 10 >= 10) return true; a = Math.floor(a / 10); b = Math.floor(b / 10); } return false; };
const needsBorrow = (a, b) => { while (b > 0) { if (b % 10 > a % 10) return true; a = Math.floor(a / 10); b = Math.floor(b / 10); } return false; };
const randDigits = (d) => d <= 1 ? randInt(2, 9) : randInt(Math.pow(10, d - 1), Math.pow(10, d) - 1);

/** Addition banded by max operand/total. G1: 9/18 · G2: 89/100 · G3: 899/1000 · G4: 8999/10000
 *  KP targeting: pass digitsA/digitsB and regroup (true = must carry, false = must not). */
function buildBandedAdd({ maxOperand, maxTotal, minTotal = 0, digitsA = null, digitsB = null, regroup = null, context = null }) {
  return () => {
    let a, b;
    for (let i = 0; ; i++) {
      a = digitsA ? randDigits(digitsA) : randInt(2, maxOperand);
      b = digitsB ? randDigits(digitsB) : randInt(2, Math.min(maxOperand, maxTotal - a));
      const ok = a + b <= maxTotal && a + b >= minTotal && (regroup === null || needsCarry(a, b) === regroup);
      if (ok || i > 300) break;
    }
    const value = a + b;
    const q = context
      ? context.q(a, b)
      : `${a} + ${b} = ?`;
    return {
      type: 'add', instruction: 'Work out the addition.',
      question: q, answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        maxOperand <= 9 ? 'Count on from the bigger number.' : 'Add the ones first, then the tens (regroup if the ones make ten or more).',
        `Start from ${Math.max(a, b)} and count up ${Math.min(a, b)}.`),
      solution: { steps: [{ text: maxOperand <= 9 ? `Count on: start at ${a}, count up ${b}.` : 'Add column by column from the ones.', expr: `${a} + ${b} = ${value}` }], answer: `${value}` },
      misconceptions: [{ when: `${Math.abs(a - b)}`, feedback: 'That is the difference — this question asks for the total (add, don\'t subtract).' }],
      visual: maxOperand <= 9 ? { type: 'number_line', data: { from: 0, to: 20, start: a, jump: b } } : undefined,
      verify: { kind: 'fraction', value },
    };
  };
}

/** Subtraction banded the same way; never negative.
 *  KP targeting: digitsA/digitsB and borrow (true = must borrow, false = must not). */
function buildBandedSub({ maxOperand, digitsA = null, digitsB = null, borrow = null, context = null }) {
  return () => {
    let a, b;
    for (let i = 0; ; i++) {
      a = digitsA ? randDigits(digitsA) : randInt(3, maxOperand);
      b = digitsB ? randDigits(digitsB) : randInt(1, a - 1);
      const ok = b < a && (borrow === null || needsBorrow(a, b) === borrow);
      if (ok || i > 300) break;
    }
    const value = a - b;
    const q = context ? context.q(a, b) : `${a} − ${b} = ?`;
    return {
      type: 'sub', instruction: 'Work out the subtraction.',
      question: q, answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        maxOperand <= 9 ? 'Count back from the bigger number.' : 'Subtract the ones first, then the tens (borrow if you need to).',
        `Start at ${a} and count back ${b}.`),
      solution: { steps: [{ text: maxOperand <= 9 ? `Count back: start at ${a}, go down ${b}.` : 'Subtract column by column from the ones.', expr: `${a} − ${b} = ${value}` }], answer: `${value}` },
      misconceptions: [{ when: `${a + b}`, feedback: 'That is the total — this question asks what is left (subtract, don\'t add).' }],
      verify: { kind: 'fraction', value },
    };
  };
}

/** Multiplication facts from a fixed set of tables. */
function buildBandedMul({ tables, maxFactor = 10, asRepeatedAddition = false }) {
  return () => {
    const t = pick(tables), n = randInt(2, maxFactor);
    const value = t * n;
    if (asRepeatedAddition === 'always' || (asRepeatedAddition && coin())) {
      const terms = Array(n).fill(t).join(' + ');
      return {
        type: 'mul-repeat', instruction: 'Add the equal groups.',
        question: `${terms} = ?`, answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(`You have ${n} groups of ${t}.`, `That is ${n} × ${t}.`),
        solution: { steps: [{ text: `${n} groups of ${t} = ${n} × ${t}.`, expr: `${value}` }], answer: `${value}` },
        misconceptions: [{ when: `${t + n}`, feedback: 'Don\'t add the two numbers — count ALL the groups.' }],
        visual: { type: 'array_dots', data: { rows: n, cols: t, groupByRow: true } },
        verify: { kind: 'fraction', value },
      };
    }
    return {
      type: 'mul-fact', instruction: 'Work out the multiplication.',
      question: `${t} × ${n} = ?`, answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(`Skip-count in ${t}s, ${n} times.`, `${t}, ${t * 2}, ${t * 3}…`),
      solution: { steps: [{ text: `Skip-count in ${t}s: ${Array.from({ length: Math.min(n, 5) }, (_, i) => t * (i + 1)).join(', ')}…`, expr: `${t} × ${n} = ${value}` }], answer: `${value}` },
      misconceptions: [{ when: `${t + n}`, feedback: 'That\'s adding — multiplication means repeated groups.' }],
      visual: { type: 'array_dots', data: { rows: t, cols: n, groupByRow: true } },
      verify: { kind: 'fraction', value },
    };
  };
}

/** Exact division (sharing) with divisors from a fixed set. */
function buildBandedDiv({ divisors, maxQuotient = 10, sharing = false }) {
  return () => {
    const d = pick(divisors), q = randInt(2, maxQuotient), total = d * q;
    const question = (sharing === 'always' || (sharing && coin()))
      ? `Share ${total} sweets equally among ${d} children. How many does each child get?`
      : `${total} ÷ ${d} = ?`;
    return {
      type: 'div-fact', instruction: 'Work out the division.',
      question, answer: `${q}`, accepts: accepts(`${q}`),
      hints: hintLadder(`How many groups of ${d} make ${total}?`, `Use the ${d} times table: ${d} × ? = ${total}.`),
      solution: { steps: [{ text: `${d} × ${q} = ${total}, so ${total} ÷ ${d} = ${q}.`, expr: `${q}` }], answer: `${q}` },
      misconceptions: [{ when: `${total - d}`, feedback: 'Division is not subtraction — it asks how many equal groups fit.' }],
      visual: { type: 'array_dots', data: { rows: d, cols: q, groupByRow: true } },
      verify: { kind: 'fraction', value: q },
    };
  };
}

/** Counting / number order within a band. */
function buildCounting({ max }) {
  return () => {
    const kind = pick(['after', 'before', 'between', 'compare']);
    if (kind === 'compare') {
      const a = randInt(1, max), bRaw = randInt(1, max), b = bRaw === a ? Math.min(max, a + 1) : bRaw;
      const value = Math.max(a, b);
      return {
        type: 'count-compare', instruction: 'Compare the numbers.',
        question: `Which number is bigger: ${a} or ${b}?`, answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder('The number that comes later when counting is bigger.', `Count up — which of ${a} and ${b} do you reach last?`),
        solution: { steps: [{ text: 'The later number when counting up is the bigger one.', expr: `${value}` }], answer: `${value}` },
        misconceptions: [], verify: { kind: 'fraction', value },
      };
    }
    const n = randInt(2, max - 2);
    const spec = kind === 'after' ? { q: `What number comes just after ${n}?`, value: n + 1 }
      : kind === 'before' ? { q: `What number comes just before ${n}?`, value: n - 1 }
      : { q: `What number is between ${n} and ${n + 2}?`, value: n + 1 };
    return {
      type: 'count-order', instruction: 'Think about counting order.',
      question: spec.q, answer: `${spec.value}`, accepts: accepts(`${spec.value}`),
      hints: hintLadder('Say the numbers out loud in counting order.', `Count: ${n - 1}, ${n}, ${n + 1}, ${n + 2}…`),
      solution: { steps: [{ text: 'Count through the numbers in order.', expr: `${spec.value}` }], answer: `${spec.value}` },
      misconceptions: [], verify: { kind: 'fraction', value: spec.value },
    };
  };
}

/** Place value: what digit is in a given place / value of that digit. */
function buildBandedPlaceValue({ digits }) {
  const places = ['ones', 'tens', 'hundreds', 'thousands'];
  return () => {
    const n = randInt(Math.pow(10, digits - 1) + 1, Math.pow(10, digits) - 1);
    const pos = randInt(0, digits - 1);
    const digit = Math.floor(n / Math.pow(10, pos)) % 10;
    const value = digit * Math.pow(10, pos);
    return {
      type: 'place-value', instruction: 'Use place value.',
      question: `In the number ${n}, what is the VALUE of the digit in the ${places[pos]} place?`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder('Find the digit in that column first.', `The digit is ${digit}; its value is ${digit} × ${Math.pow(10, pos)}.`),
      solution: { steps: [{ text: `Digit ${digit} sits in the ${places[pos]} column.`, expr: `${digit} × ${Math.pow(10, pos)} = ${value}` }], answer: `${value}` },
      misconceptions: [{ when: `${digit}`, feedback: `That's the digit — its VALUE is ${digit} × ${Math.pow(10, pos)}.` }],
      visual: { type: 'place_value_chart', data: { digits: String(n).split('').map(Number), labels: places.slice(0, digits).reverse().map(String), highlight: digits - 1 - pos } },
      verify: { kind: 'fraction', value },
    };
  };
}

/** Unit fraction of a set (G2: ½ ¼ · G3: ½ ⅓ ¼ ⅕ ⅒). */
function buildFractionOfSet({ denominators, maxResult = 10 }) {
  return () => {
    const d = pick(denominators), r = randInt(2, maxResult), total = d * r;
    const name = { 2: 'half', 3: 'a third', 4: 'a quarter', 5: 'a fifth', 10: 'a tenth' }[d];
    return {
      type: 'fraction-of-set', instruction: 'Find the fraction of the set.',
      question: `What is ${name} of ${total}?`, answer: `${r}`, accepts: accepts(`${r}`),
      hints: hintLadder(`Share ${total} into ${d} equal groups.`, `${total} ÷ ${d} = ?`),
      solution: { steps: [{ text: `${name} of ${total} means ${total} ÷ ${d}.`, expr: `${r}` }], answer: `${r}` },
      misconceptions: [{ when: `${total - d}`, feedback: `Finding ${name} means dividing into ${d} equal parts, not subtracting.` }],
      visual: { type: 'array_dots', data: { rows: d, cols: r, groupByRow: true } },
      verify: { kind: 'fraction', value: r },
    };
  };
}

/** Kenyan money word problems banded by amount. */
function buildBandedMoney({ maxAmount, kind }) {
  return () => {
    if (kind === 'count') {           // G1: counting coins
      const coins = pick([5, 10]), n = randInt(2, Math.floor(maxAmount / coins));
      const value = coins * n;
      return {
        type: 'money-count', instruction: 'Count the money.',
        question: `You have ${n} coins of ${coins} shillings each. How much money is that?`,
        answer: `${value}`, accepts: accepts(`${value}`, `${value} shillings`, `sh ${value}`),
        hints: hintLadder(`Skip-count in ${coins}s.`, `${coins}, ${coins * 2}, ${coins * 3}…`),
        solution: { steps: [{ text: `${n} coins of ${coins} bob = ${n} × ${coins}.`, expr: `${value}` }], answer: `${value}` },
        misconceptions: [], verify: { kind: 'fraction', value },
      };
    }
    if (kind === 'change') {          // G2: shopping change
      const price = randInt(10, maxAmount - 10), paid = Math.min(maxAmount, Math.ceil(price / 10) * 10 + pick([0, 10, 20]));
      const value = paid - price;
      return {
        type: 'money-change', instruction: 'Work out the change.',
        question: `A pencil costs ${price} shillings. You pay with ${paid} shillings. How much change do you get?`,
        answer: `${value}`, accepts: accepts(`${value}`, `${value} shillings`),
        hints: hintLadder('Change = what you paid − the price.', `${paid} − ${price} = ?`),
        solution: { steps: [{ text: 'Subtract the price from what was paid.', expr: `${paid} − ${price} = ${value}` }], answer: `${value}` },
        misconceptions: [{ when: `${paid + price}`, feedback: 'Change is the LEFTOVER — subtract, don\'t add.' }],
        verify: { kind: 'fraction', value },
      };
    }
    if (kind === 'profit' || kind === 'loss') {   // G3: profit & loss
      const buy = randInt(20, maxAmount - 20), diff = randInt(5, Math.min(50, kind === 'profit' ? maxAmount - buy : buy - 5));
      const sell = kind === 'profit' ? buy + diff : buy - diff;
      const word = kind === 'profit' ? 'profit' : 'loss';
      return {
        type: `money-${word}`, instruction: `Work out the ${word}.`,
        question: `A trader buys a mango for ${buy} shillings and sells it for ${sell} shillings. What is the ${word}?`,
        answer: `${diff}`, accepts: accepts(`${diff}`, `${diff} shillings`),
        hints: hintLadder(`${word === 'profit' ? 'Profit = selling price − buying price.' : 'Loss = buying price − selling price.'}`, `${Math.max(sell, buy)} − ${Math.min(sell, buy)} = ?`),
        solution: { steps: [{ text: `Find the difference between buying and selling prices.`, expr: `${Math.max(sell, buy)} − ${Math.min(sell, buy)} = ${diff}` }], answer: `${diff}` },
        misconceptions: [{ when: `${sell + buy}`, feedback: `${word[0].toUpperCase() + word.slice(1)} is the DIFFERENCE between the two prices — subtract.` }],
        verify: { kind: 'fraction', value: diff },
      };
    }
    // kind === 'budget' (G4): totals within 10,000
    const items = [['a book', randInt(150, 400)], ['a pen', randInt(20, 80)], ['a bag', randInt(300, 900)]];
    const chosen = items.slice(0, 2);
    const value = chosen.reduce((s, [, p]) => s + p, 0);
    return {
      type: 'money-budget', instruction: 'Work out the total cost.',
      question: `You buy ${chosen[0][0]} for ${chosen[0][1]} shillings and ${chosen[1][0]} for ${chosen[1][1]} shillings. What is the total cost?`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value} shillings`),
      hints: hintLadder('Add the two prices.', `${chosen[0][1]} + ${chosen[1][1]} = ?`),
      solution: { steps: [{ text: 'Add the prices together.', expr: `${chosen[0][1]} + ${chosen[1][1]} = ${value}` }], answer: `${value}` },
      misconceptions: [], verify: { kind: 'fraction', value },
    };
  };
}

/** Measurement comparison/word problems in context units, banded. */
function buildMeasureCompare({ unit, thing, maxOperand }) {
  return () => {
    const a = randInt(Math.max(3, Math.floor(maxOperand / 3)), maxOperand), b = randInt(1, a - 1);
    const value = a - b;
    return {
      type: 'measure-compare', instruction: 'Compare the measurements.',
      question: `One ${thing} is ${a} ${unit} and another is ${b} ${unit}. How much ${unit === 'kg' ? 'heavier' : unit === 'litres' ? 'more' : 'longer'} is the first?`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value} ${unit}`),
      hints: hintLadder('Find the difference between the two.', `${a} − ${b} = ?`),
      solution: { steps: [{ text: 'Subtract the smaller from the bigger.', expr: `${a} − ${b} = ${value}` }], answer: `${value}` },
      misconceptions: [{ when: `${a + b}`, feedback: 'The question asks for the DIFFERENCE — subtract.' }],
      verify: { kind: 'fraction', value },
    };
  };
}

/** Unit conversions for upper-lower-primary measurement (G3/G4). */
function buildUnitConvert({ pairs }) {
  return () => {
    const [big, small, factor] = pick(pairs);
    const n = randInt(2, 9);
    const value = n * factor;
    return {
      type: 'unit-convert', instruction: 'Convert the units.',
      question: `How many ${small} are there in ${n} ${big}?`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value} ${small}`),
      hints: hintLadder(`1 ${big.replace(/s$/, '')} = ${factor} ${small}.`, `${n} × ${factor} = ?`),
      solution: { steps: [{ text: `Multiply by ${factor}.`, expr: `${n} × ${factor} = ${value}` }], answer: `${value}` },
      misconceptions: [{ when: `${n + factor}`, feedback: `Converting means multiplying by ${factor}, not adding.` }],
      verify: { kind: 'fraction', value },
    };
  };
}

/** Shape properties: sides & corners (G1–G4 geometry). */
function buildShapeProperties({ shapes }) {
  return () => {
    const [name, sides] = pick(shapes);
    const askCorners = coin();
    const value = sides;   // for these shapes corners = sides
    return {
      type: 'shape-props', instruction: 'Think about the shape.',
      question: `How many ${askCorners ? 'corners' : 'sides'} does a ${name} have?`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(`Picture a ${name} and count around it.`, 'Count each edge/corner once as you go around.'),
      solution: { steps: [{ text: `A ${name} has ${sides} sides and ${sides} corners.`, expr: `${value}` }], answer: `${value}` },
      misconceptions: [], verify: { kind: 'fraction', value },
    };
  };
}

/** Lines: straight vs curved recognition (G1/G2). */
function buildLineTypes() {
  const items = [
    ['the edge of a ruler', 'straight'], ['the rim of a cup', 'curved'],
    ['a stretched string', 'straight'], ['the letter S', 'curved'],
    ['the side of a book', 'straight'], ['the letter C', 'curved'],
    ['the edge of a door', 'straight'], ['the letter O', 'curved'],
    ['a flag post', 'straight'], ['the edge of a plate', 'curved'],
    ['the corner-to-corner fold of a page', 'straight'], ['a rainbow', 'curved'],
    ['the top of a table', 'straight'], ['the letter U', 'curved'],
    ['railway tracks on flat ground', 'straight'], ['the outline of an egg', 'curved'],
  ];
  return () => {
    const [thing, value] = pick(items);
    return {
      type: 'line-type', instruction: 'Is the line straight or curved?',
      question: `Is the line made by ${thing} straight or curved?`,
      answer: value, accepts: accepts(value),
      hints: hintLadder('A straight line does not bend at all.', 'If it bends anywhere, it is curved.'),
      solution: { steps: [{ text: value === 'straight' ? 'It does not bend — straight.' : 'It bends — curved.', expr: value }], answer: value },
      misconceptions: [
        { when: value === 'straight' ? 'curved' : 'straight', feedback: 'Ask: does it bend anywhere? No bend at all means straight; any bend means curved.' },
      ],
      verify: { kind: 'text', value },
    };
  };
}

/** Position & direction: turns and compass (G3/G4). */
function buildTurnsAndCompass({ withCompass = false }) {
  const compass = ['North', 'East', 'South', 'West'];
  return () => {
    if (withCompass && coin()) {
      const start = randInt(0, 3), quarters = pick([1, 2, 3]);
      const value = compass[(start + quarters) % 4];
      const turnName = quarters === 2 ? 'a half turn' : quarters === 1 ? 'a quarter turn clockwise' : 'three quarter turns clockwise';
      return {
        type: 'compass-turn', instruction: 'Work out the new direction.',
        question: `You are facing ${compass[start]} and make ${turnName}. Which direction are you facing now?`,
        answer: value, accepts: accepts(value, value.toLowerCase()),
        hints: hintLadder('Each quarter turn moves one step: N → E → S → W.', `Count ${quarters} step(s) around from ${compass[start]}.`),
        solution: { steps: [{ text: `Move ${quarters} step(s) clockwise from ${compass[start]}.`, expr: value }], answer: value },
        misconceptions: [], verify: { kind: 'text', value },
      };
    }
    const spec = pick([
      { q: 'How many quarter turns make a full turn?', value: 4 },
      { q: 'How many quarter turns make a half turn?', value: 2 },
      { q: 'How many right angles are there in a full turn?', value: 4 },
    ]);
    return {
      type: 'turns', instruction: 'Think about turns.',
      question: spec.q, answer: `${spec.value}`, accepts: accepts(`${spec.value}`),
      hints: hintLadder('A full turn brings you back to where you started.', 'A quarter turn is one right angle.'),
      solution: { steps: [{ text: 'A full turn = 4 quarter turns = 4 right angles.', expr: `${spec.value}` }], answer: `${spec.value}` },
      misconceptions: [], verify: { kind: 'fraction', value: spec.value },
    };
  };
}

/** Angle classification by size (G4). */
function buildAngleClassify() {
  return () => {
    const kind = pick(['acute', 'right', 'obtuse']);
    const deg = kind === 'acute' ? randInt(11, 84) : kind === 'right' ? 90 : randInt(96, 174);
    const phrasing = pick([
      `An angle measures ${deg}°. Is it acute, right, or obtuse?`,
      `Is an angle of ${deg}° acute, right, or obtuse?`,
      `A gate opens through ${deg}°. Is that angle acute, right, or obtuse?`,
    ]);
    return {
      type: 'angle-classify', instruction: 'Classify the angle.',
      question: phrasing,
      answer: kind, accepts: accepts(kind),
      hints: hintLadder('Compare the angle with 90°.', 'Less than 90° = acute · exactly 90° = right · more than 90° = obtuse.'),
      solution: { steps: [{ text: `${deg}° compared with 90° → ${kind}.`, expr: kind }], answer: kind },
      misconceptions: [
        { when: kind === 'acute' ? 'obtuse' : 'acute', feedback: 'Compare with 90°: LESS than 90° is acute, MORE is obtuse.' },
      ],
      verify: { kind: 'angle_class', deg, value: kind },
    };
  };
}

/** Days/months/clock basics (G1/G2 time). */
function buildBandedTime({ withMonths = false }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return () => {
    const mode = withMonths && coin() ? 'month' : pick(['day', 'count']);
    if (mode === 'month') {
      const i = randInt(0, 10);
      const value = months[i + 1];
      return {
        type: 'time-month', instruction: 'Think about the months.',
        question: `Which month comes just after ${months[i]}?`,
        answer: value, accepts: accepts(value, value.toLowerCase()),
        hints: hintLadder('Say the months in order.', `…${months[i]}, then ?`),
        solution: { steps: [{ text: 'Recite the months in order.', expr: value }], answer: value },
        misconceptions: [], verify: { kind: 'text', value },
      };
    }
    if (mode === 'count') {
      const spec = pick([
        { q: 'How many days are there in a week?', value: 7 },
        { q: 'How many days are there in two weeks?', value: 14 },
        ...(withMonths ? [{ q: 'How many months are there in a year?', value: 12 }] : []),
      ]);
      return {
        type: 'time-count', instruction: 'Think about time.',
        question: spec.q, answer: `${spec.value}`, accepts: accepts(`${spec.value}`),
        hints: hintLadder('Count them out loud.', 'A week runs Monday to Sunday.'),
        solution: { steps: [{ text: 'Count the days/months in order.', expr: `${spec.value}` }], answer: `${spec.value}` },
        misconceptions: [], verify: { kind: 'fraction', value: spec.value },
      };
    }
    const i = randInt(0, 5);
    const value = days[i + 1];
    return {
      type: 'time-day', instruction: 'Think about the days of the week.',
      question: `What day comes just after ${days[i]}?`,
      answer: value, accepts: accepts(value, value.toLowerCase()),
      hints: hintLadder('Say the days of the week in order.', `…${days[i]}, then ?`),
      solution: { steps: [{ text: 'Recite the days in order.', expr: value }], answer: value },
      misconceptions: [], verify: { kind: 'text', value },
    };
  };
}

/** Simple patterns (G1 pre-number). */
function buildSimplePattern() {
  return () => {
    const step = pick([1, 2, 5, 10]), start = randInt(1, 10);
    const seq = [start, start + step, start + 2 * step, start + 3 * step];
    const value = start + 4 * step;
    return {
      type: 'pattern', instruction: 'Continue the pattern.',
      question: `What comes next: ${seq.join(', ')}, __?`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder('How much does it grow each time?', `Each number goes up by ${step}.`),
      solution: { steps: [{ text: `The pattern adds ${step} each time.`, expr: `${seq[3]} + ${step} = ${value}` }], answer: `${value}` },
      misconceptions: [], verify: { kind: 'fraction', value },
    };
  };
}

/** Area/volume with small whole numbers (G4). */
function buildSmallArea() {
  return () => {
    const l = randInt(3, 12), w = randInt(2, 9), value = l * w;
    return {
      type: 'area-rect', instruction: 'Work out the area.',
      question: `A rectangle is ${l} cm long and ${w} cm wide. What is its area in square centimetres?`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value} cm2`, `${value} cm²`),
      hints: hintLadder('Area of a rectangle = length × width.', `${l} × ${w} = ?`),
      solution: { steps: [{ text: 'Multiply length by width.', expr: `${l} × ${w} = ${value}` }], answer: `${value}` },
      misconceptions: [{ when: `${2 * (l + w)}`, feedback: 'That is the PERIMETER — area is length × width.' }],
      visual: { type: 'array_dots', data: { rows: w, cols: l, groupByRow: true } },
      verify: { kind: 'fraction', value },
    };
  };
}

function buildSmallVolume() {
  return () => {
    const l = randInt(2, 4), w = randInt(2, 4), h = randInt(2, 4), value = l * w * h;
    return {
      type: 'volume-count', instruction: 'Count the unit cubes.',
      question: `A cuboid is built from small cubes: ${l} cubes long, ${w} cubes wide, and ${h} cubes tall. How many cubes is that in total?`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder('One layer has length × width cubes.', `Each layer: ${l} × ${w} = ${l * w}. There are ${h} layers.`),
      solution: { steps: [{ text: `One layer = ${l} × ${w} = ${l * w} cubes; ${h} layers.`, expr: `${l * w} × ${h} = ${value}` }], answer: `${value}` },
      misconceptions: [{ when: `${l + w + h}`, feedback: 'Don\'t add the sides — multiply: length × width × height.' }],
      verify: { kind: 'fraction', value },
    };
  };
}

/** 2-digit × 1-digit multiplication (G4). tensOnly → multiples of ten. */
function buildTwoByOneMul({ minA, maxA, maxB, tensOnly = false }) {
  return () => {
    const a = tensOnly ? randInt(2, 9) * 10 : randInt(minA, maxA), b = randInt(2, maxB), value = a * b;
    return {
      type: 'mul-2x1', instruction: 'Work out the multiplication.',
      question: `${a} × ${b} = ?`, answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        tensOnly ? 'Multiply the tens digit, then put the zero back.' : 'Split the 2-digit number into tens and ones.',
        tensOnly ? `${a / 10} × ${b} = ${a / 10 * b}, so ${a} × ${b} = ${value}.` : `(${Math.floor(a / 10) * 10} × ${b}) + (${a % 10} × ${b}) = ?`),
      solution: { steps: [{ text: tensOnly ? 'Multiply the tens, then append the zero.' : 'Multiply tens, multiply ones, then add.', expr: `${a} × ${b} = ${value}` }], answer: `${value}` },
      misconceptions: [{ when: `${a + b}`, feedback: 'That\'s adding — this is multiplication.' }],
      verify: { kind: 'fraction', value },
    };
  };
}

/** Long division with exact quotients (G4). */
function buildLongDiv({ minQ, maxQ }) {
  return () => {
    const d = randInt(2, 9), q = randInt(minQ, maxQ), total = d * q;
    return {
      type: 'div-long', instruction: 'Work out the division.',
      question: `${total} ÷ ${d} = ?`, answer: `${q}`, accepts: accepts(`${q}`),
      hints: hintLadder(`How many ${d}s in ${total}? Work digit by digit.`, `${d} × ${q} = ${total}.`),
      solution: { steps: [{ text: `Divide step by step: ${d} × ${q} = ${total}.`, expr: `${q}` }], answer: `${q}` },
      misconceptions: [], verify: { kind: 'fraction', value: q },
    };
  };
}

/** Choose the symbol <, > or = (G6 Inequalities, rationalised design). */
function buildCompareSymbols({ max }) {
  return () => {
    const a = randInt(10, max), b = coin() ? randInt(10, max) : a;
    const value = a < b ? '<' : a > b ? '>' : '=';
    return {
      type: 'compare-symbols', instruction: 'Choose the correct symbol.',
      question: `Which symbol makes this true: ${a} ☐ ${b}?  (<, > or =)`,
      answer: value, accepts: accepts(value),
      hints: hintLadder('The symbol opens towards the bigger number.', `Compare ${a} and ${b} digit by digit from the left.`),
      solution: { steps: [{ text: `${a} ${value} ${b} — the open side faces the bigger number.`, expr: value }], answer: value },
      misconceptions: [{ when: value === '<' ? '>' : '<', feedback: 'The open (wide) side of the symbol always faces the BIGGER number.' }],
      verify: { kind: 'text', value },
    };
  };
}

// ---------------------------------------------------------------------------
// The grade-banded content map (KICD-verified ranges)
// ---------------------------------------------------------------------------
export const LOWER_PRIMARY_CONTENT = {
  // ── Grade 1 ──────────────────────────────────────────────────────────────
  G1_PRENUMBER:      withWorkedExample(buildSimplePattern()),
  G1_COUNTING:       withWorkedExample(buildCounting({ max: 100 })),
  // KP ladder from the G1 design: sums within 9, then crossing ten (to 18).
  G1_ADD:            withKPs([
                       withWorkedExample(buildBandedAdd({ maxOperand: 9, maxTotal: 9 })),
                       withWorkedExample(buildBandedAdd({ maxOperand: 9, maxTotal: 18, minTotal: 11 })),
                     ]),
  // KP ladder: within 9, then teens minus single digit (crossing ten).
  G1_SUB:            withKPs([
                       withWorkedExample(buildBandedSub({ maxOperand: 9 })),
                       withWorkedExample(buildBandedSub({ maxOperand: 18, digitsA: 2, digitsB: 1, borrow: true })),
                     ]),
  G1_LINES:          withWorkedExample(buildLineTypes()),
  G1_SHAPES:         withWorkedExample(buildShapeProperties({ shapes: [['triangle', 3], ['square', 4], ['rectangle', 4]] })),
  G1_LENGTH:         withWorkedExample(buildMeasureCompare({ unit: 'cm', thing: 'stick', maxOperand: 9 })),
  G1_MASS:           withWorkedExample(buildMeasureCompare({ unit: 'kg', thing: 'bag', maxOperand: 9 })),
  G1_CAPACITY:       withWorkedExample(buildMeasureCompare({ unit: 'litres', thing: 'bucket', maxOperand: 9 })),
  G1_MONEY:          withWorkedExample(buildBandedMoney({ maxAmount: 50, kind: 'count' })),
  G1_TIME:           withWorkedExample(buildBandedTime({ withMonths: false })),

  // ── Grade 2 ──────────────────────────────────────────────────────────────
  G2_COUNTING:       withWorkedExample(buildCounting({ max: 100 })),
  G2_PLACE_VALUE:    withWorkedExample(buildBandedPlaceValue({ digits: 2 })),
  // KP ladder straight from the G2 design (pp.41–42): 2-digit + 1-digit without
  // regrouping → with regrouping → 2-digit + 2-digit without → with, up to 100.
  G2_ADD:            withKPs([
                       withWorkedExample(buildBandedAdd({ maxTotal: 100, digitsA: 2, digitsB: 1, regroup: false })),
                       withWorkedExample(buildBandedAdd({ maxTotal: 100, digitsA: 2, digitsB: 1, regroup: true })),
                       withWorkedExample(buildBandedAdd({ maxTotal: 100, digitsA: 2, digitsB: 2, regroup: false })),
                       withWorkedExample(buildBandedAdd({ maxTotal: 100, digitsA: 2, digitsB: 2, regroup: true })),
                     ]),
  // KP ladder (p.44): 2-digit − 1-digit without borrowing → with → 2-digit − 2-digit.
  G2_SUB:            withKPs([
                       withWorkedExample(buildBandedSub({ maxOperand: 99, digitsA: 2, digitsB: 1, borrow: false })),
                       withWorkedExample(buildBandedSub({ maxOperand: 99, digitsA: 2, digitsB: 1, borrow: true })),
                       withWorkedExample(buildBandedSub({ maxOperand: 99, digitsA: 2, digitsB: 2, borrow: false })),
                       withWorkedExample(buildBandedSub({ maxOperand: 99, digitsA: 2, digitsB: 2, borrow: true })),
                     ]),
  // KP ladder (pp.45–46): equal groups as repeated addition → ×2/×5/×10 facts → ×3/×4.
  G2_MULTIPLY_INTRO: withKPs([
                       withWorkedExample(buildBandedMul({ tables: [2, 3, 4, 5], maxFactor: 5, asRepeatedAddition: 'always' })),
                       withWorkedExample(buildBandedMul({ tables: [2, 5, 10], maxFactor: 5 })),
                       withWorkedExample(buildBandedMul({ tables: [3, 4], maxFactor: 5 })),
                     ]),
  // KP ladder (pp.47–48): sharing stories first, then bare division facts.
  G2_DIVISION_INTRO: withKPs([
                       withWorkedExample(buildBandedDiv({ divisors: [2, 5, 10], maxQuotient: 5, sharing: 'always' })),
                       withWorkedExample(buildBandedDiv({ divisors: [2, 3, 4, 5, 10], maxQuotient: 5 })),
                     ]),
  // KP ladder (pp.50–51): halves first, then quarters.
  G2_FRACTIONS:      withKPs([
                       withWorkedExample(buildFractionOfSet({ denominators: [2], maxResult: 10 })),
                       withWorkedExample(buildFractionOfSet({ denominators: [4], maxResult: 10 })),
                     ]),
  G2_LENGTH:         withWorkedExample(buildMeasureCompare({ unit: 'cm', thing: 'rope', maxOperand: 99 })),
  G2_MASS:           withWorkedExample(buildMeasureCompare({ unit: 'kg', thing: 'sack', maxOperand: 99 })),
  G2_CAPACITY:       withWorkedExample(buildMeasureCompare({ unit: 'litres', thing: 'jerrican', maxOperand: 99 })),
  G2_TIME:           withWorkedExample(buildBandedTime({ withMonths: true })),
  G2_MONEY:          withWorkedExample(buildBandedMoney({ maxAmount: 100, kind: 'change' })),
  G2_LINES:          withWorkedExample(buildLineTypes()),
  G2_SHAPES:         withWorkedExample(buildShapeProperties({ shapes: [['triangle', 3], ['square', 4], ['rectangle', 4], ['pentagon', 5], ['hexagon', 6]] })),

  // ── Grade 3 ──────────────────────────────────────────────────────────────
  G3_COUNTING:       withWorkedExample(buildBandedPlaceValue({ digits: 3 })),
  // KP ladder (pp.79–83): 3-digit sums without regrouping, then with, up to 1000.
  G3_ADD:            withKPs([
                       withWorkedExample(buildBandedAdd({ maxTotal: 1000, digitsA: 3, digitsB: 3, regroup: false })),
                       withWorkedExample(buildBandedAdd({ maxTotal: 1000, digitsA: 3, digitsB: 3, regroup: true })),
                     ]),
  G3_SUB:            withKPs([
                       withWorkedExample(buildBandedSub({ maxOperand: 999, digitsA: 3, digitsB: 3, borrow: false })),
                       withWorkedExample(buildBandedSub({ maxOperand: 999, digitsA: 3, digitsB: 3, borrow: true })),
                     ]),
  // KP ladder (pp.85–86): easy tables (2–5), harder tables (6–9), then all mixed.
  G3_MULTIPLY:       withKPs([
                       withWorkedExample(buildBandedMul({ tables: [2, 3, 4, 5], maxFactor: 10 })),
                       withWorkedExample(buildBandedMul({ tables: [6, 7, 8, 9], maxFactor: 10 })),
                       withWorkedExample(buildBandedMul({ tables: [2, 3, 4, 5, 6, 7, 8, 9, 10], maxFactor: 10 })),
                     ]),
  // KP ladder (pp.87–88): facts for easy divisors, harder divisors, sharing stories.
  G3_DIVIDE:         withKPs([
                       withWorkedExample(buildBandedDiv({ divisors: [2, 3, 4, 5], maxQuotient: 10 })),
                       withWorkedExample(buildBandedDiv({ divisors: [6, 7, 8, 9], maxQuotient: 10 })),
                       withWorkedExample(buildBandedDiv({ divisors: [2, 3, 4, 5, 6, 7, 8, 9, 10], maxQuotient: 10, sharing: 'always' })),
                     ]),
  // KP ladder (pp.89–91): halves/quarters (known) → thirds/fifths (new) → tenths.
  G3_FRACTIONS:      withKPs([
                       withWorkedExample(buildFractionOfSet({ denominators: [2, 4], maxResult: 10 })),
                       withWorkedExample(buildFractionOfSet({ denominators: [3, 5], maxResult: 10 })),
                       withWorkedExample(buildFractionOfSet({ denominators: [10], maxResult: 10 })),
                     ]),
  // KP ladder: profit first, then loss (both in the G3 design).
  G3_MONEY:          withKPs([
                       withWorkedExample(buildBandedMoney({ maxAmount: 500, kind: 'profit' })),
                       withWorkedExample(buildBandedMoney({ maxAmount: 500, kind: 'loss' })),
                     ]),
  G3_LENGTH:         withWorkedExample(buildUnitConvert({ pairs: [['metres', 'centimetres', 100]] })),
  G3_MASS:           withWorkedExample(buildMeasureCompare({ unit: 'kg', thing: 'box', maxOperand: 999 })),
  G3_CAPACITY:       withWorkedExample(buildMeasureCompare({ unit: 'litres', thing: 'tank', maxOperand: 999 })),
  G3_POSITION:       withWorkedExample(buildTurnsAndCompass({ withCompass: false })),
  G3_SHAPES:         withWorkedExample(buildShapeProperties({ shapes: [['triangle', 3], ['square', 4], ['rectangle', 4], ['pentagon', 5], ['hexagon', 6], ['octagon', 8]] })),

  // ── Grade 4 ──────────────────────────────────────────────────────────────
  G4_PLACE_VALUE:    withWorkedExample(buildBandedPlaceValue({ digits: 4 })),
  // KP ladder: 4-digit sums without regrouping, then with, up to 10,000.
  G4_ADD:            withKPs([
                       withWorkedExample(buildBandedAdd({ maxTotal: 10000, digitsA: 4, digitsB: 3, regroup: false })),
                       withWorkedExample(buildBandedAdd({ maxTotal: 10000, digitsA: 4, digitsB: 4, regroup: true })),
                     ]),
  G4_SUB:            withKPs([
                       withWorkedExample(buildBandedSub({ maxOperand: 9999, digitsA: 4, digitsB: 3, borrow: false })),
                       withWorkedExample(buildBandedSub({ maxOperand: 9999, digitsA: 4, digitsB: 4, borrow: true })),
                     ]),
  // KP ladder from the G4 design: teens × small → any 2-digit × 1-digit → tens shortcut.
  G4_MULTIPLY:       withKPs([
                       withWorkedExample(buildTwoByOneMul({ minA: 12, maxA: 19, maxB: 5 })),
                       withWorkedExample(buildTwoByOneMul({ minA: 12, maxA: 99, maxB: 9 })),
                       withWorkedExample(buildTwoByOneMul({ minA: 12, maxA: 99, maxB: 9, tensOnly: true })),
                     ]),
  // KP ladder: 2-digit quotients first, then full range long division.
  G4_DIVIDE:         withKPs([
                       withWorkedExample(buildLongDiv({ minQ: 11, maxQ: 30 })),
                       withWorkedExample(buildLongDiv({ minQ: 31, maxQ: 99 })),
                     ]),
  G4_LENGTH:         withWorkedExample(buildUnitConvert({ pairs: [['kilometres', 'metres', 1000], ['metres', 'centimetres', 100]] })),
  G4_AREA:           withWorkedExample(buildSmallArea()),
  G4_VOLUME:         withWorkedExample(buildSmallVolume()),
  G4_MONEY:          withWorkedExample(buildBandedMoney({ maxAmount: 5000, kind: 'budget' })),
  G4_POSITION:       withWorkedExample(buildTurnsAndCompass({ withCompass: true })),
  G4_ANGLES:         withWorkedExample(buildAngleClassify()),
  G4_PLANE_FIGURES:  withWorkedExample(buildShapeProperties({ shapes: [['triangle', 3], ['square', 4], ['rectangle', 4], ['pentagon', 5], ['hexagon', 6], ['octagon', 8]] })),
};

// Upper grades whose aliases ran above level — tuned here instead.
Object.assign(LOWER_PRIMARY_CONTENT, {
  G5_MONEY:        withKPs([                          // G5 design: profit & loss
                     withWorkedExample(buildBandedMoney({ maxAmount: 1000, kind: 'profit' })),
                     withWorkedExample(buildBandedMoney({ maxAmount: 1000, kind: 'loss' })),
                   ]),
  G6_MONEY:        withKPs([                          // G6 design: bills & charges
                     withWorkedExample(buildBandedMoney({ maxAmount: 5000, kind: 'budget' })),
                     withWorkedExample(buildBandedMoney({ maxAmount: 2000, kind: 'change' })),
                   ]),
  G6_INEQUALITIES: withWorkedExample(buildCompareSymbols({ max: 999999 })),
});

export const LOWER_PRIMARY_SKILL_IDS = Object.keys(LOWER_PRIMARY_CONTENT);
