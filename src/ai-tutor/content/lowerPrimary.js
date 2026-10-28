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
import {
  buildHalvesQuarters, buildEighthsOfWhole, buildFractionOfGroup,
  buildLeftRight, buildTurnDirection, buildTurnAmount, buildTurnPractice,
} from './pictureLessons.js';

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
      // maxTotal happens to cap `a` here even when digitsA bypasses
      // maxOperand, so addition never showed the fault subtraction did —
      // but relying on that is luck. Bind the operand cap explicitly too.
      const inBand = (maxOperand == null || (a <= maxOperand && b <= maxOperand));
      const ok = inBand && a + b <= maxTotal && a + b >= minTotal && (regroup === null || needsCarry(a, b) === regroup);
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
      band: { op: 'add', a, b },
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
      // maxOperand has to keep binding when digitsA is given, or the two
      // constraints silently disagree and the looser one wins. G1_SUB asks
      // for 2-digit minus 1-digit WITHIN 18 — "crossing ten" — and without
      // this it served "57 − 8" under a skill named "Subtraction (Single
      // Digit)", which is Grade 2 work with a Grade 1 label on it.
      const inBand = (maxOperand == null || a <= maxOperand);
      const ok = b < a && inBand && (borrow === null || needsBorrow(a, b) === borrow);
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
      band: { op: 'sub', a, b },
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
        band: { op: 'mul', a: t, b: n },
        verify: { kind: 'fraction', value },
      };
    }
    return {
      type: 'mul-fact', instruction: 'Work out the multiplication.',
      question: `${t} × ${n} = ?`, answer: `${value}`, accepts: accepts(`${value}`),
      // The list stops short of the answer: at n = 2 or 3 it used to land on it.
      hints: hintLadder(`Skip-count in ${t}s, ${n} times.`,
        `${Array.from({ length: Math.max(1, Math.min(3, n - 1)) }, (_, i) => t * (i + 1)).join(', ')}, …`),
      solution: { steps: [{ text: `Skip-count in ${t}s: ${Array.from({ length: Math.min(n, 5) }, (_, i) => t * (i + 1)).join(', ')}…`, expr: `${t} × ${n} = ${value}` }], answer: `${value}` },
      misconceptions: [{ when: `${t + n}`, feedback: 'That\'s adding — multiplication means repeated groups.' }],
      visual: { type: 'array_dots', data: { rows: t, cols: n, groupByRow: true } },
      band: { op: 'mul', a: t, b: n },
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
      band: { op: 'div', a: total, b: d, q },
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
        choices: [a, b], // the two numbers being compared — not near-misses of the answer
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
      hints: hintLadder('Say the numbers out loud in counting order.',
        kind === 'after' ? `Start at ${n} and take one step forward.`
          : kind === 'before' ? `Start at ${n} and take one step back.`
          : `Say the numbers in order from ${n} to ${n + 2} — the answer is the one in the middle.`),
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
      hints: hintLadder('Find the digit in that column first.',
        `The digit is ${digit}, and it sits in the ${places[pos]} column — so its value is that many ${places[pos]}.`),
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
const coinFlip = () => Math.random() < 0.5;
function buildBandedMoney({ maxAmount, kind }) {
  return () => {
    if (kind === 'count') {           // G1: counting coins
      // Kenyan coins: 1, 5, 10 and 20 shillings; sometimes two kinds together.
      const coins = pick([1, 5, 5, 10, 10, 20]), n = randInt(2, Math.min(10, Math.floor(maxAmount / coins)));
      const extra = coins >= 10 && coinFlip() ? randInt(1, 4) : 0;
      const value = coins * n + extra;
      return {
        type: 'money-count', instruction: 'Count the money.',
        question: extra
          ? `You have ${n} coins of ${coins} shillings and ${extra} coin${extra > 1 ? 's' : ''} of 1 shilling. How much money is that?`
          : `You have ${n} coins of ${coins} shilling${coins > 1 ? 's' : ''} each. How much money is that?`,
        answer: `${value}`, accepts: accepts(`${value}`, `${value} shillings`, `sh ${value}`),
        hints: hintLadder(`Skip-count in ${coins}s.`,
          extra ? 'Then count on the 1-shilling coins.' : `Start at ${coins} and keep adding ${coins}, once for each coin.`),
        solution: { steps: [{ text: `${n} coins of ${coins} bob = ${n} × ${coins}${extra ? `, plus ${extra}` : ''}.`, expr: `${value}` }], answer: `${value}` },
        misconceptions: [], verify: { kind: 'fraction', value },
      };
    }
    if (kind === 'change') {          // G2: shopping change
      // Always some change back: paying the exact price gave a key of 0
      // (the class of fault in feedback F26).
      const price = randInt(10, maxAmount - 10), paid = Math.min(maxAmount, Math.floor(price / 10) * 10 + pick([10, 20, 30]));
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
    const mode = randInt(0, 3);
    const one = big.replace(/s$/, '');
    if (mode === 1) {           // small -> big
      return { type: 'unit-convert', instruction: 'Convert the units.',
        question: `How many ${big} are there in ${(n * factor).toLocaleString('en-US')} ${small}?`,
        answer: `${n}`, accepts: accepts(`${n}`, `${n} ${big}`),
        hints: hintLadder(`${factor} ${small} make 1 ${one}.`, `${n * factor} ÷ ${factor} = ?`),
        solution: { steps: [{ text: `Divide by ${factor}.`, expr: `${n * factor} ÷ ${factor} = ${n}` }], answer: `${n}` },
        misconceptions: [], verify: { kind: 'fraction', value: n } };
    }
    if (mode === 2) {           // which is longer / heavier
      // The second measurement has to stay a real quantity. The offset used to
      // be drawn from the unit's size alone, so "2 metres" could be compared
      // against 490 centimetres LESS than itself: "Which is more: 2 metres or
      // -200 centimetres?" — nonsense at any age, and this is Grade 4. Cap the
      // offset by the measurement itself as well.
      const step = factor >= 100 ? 10 : 1;
      const maxOffset = Math.max(1, Math.min(Math.floor(factor / 2) - 1, Math.floor((n * factor - step) / step)));
      const other = n * factor + pick([-1, 1]) * randInt(1, maxOffset) * step;
      const bigger = n * factor > other ? `${n} ${big}` : `${other} ${small}`;
      return { type: 'unit-compare', instruction: 'Compare the measurements.',
        question: `Which is more: ${n} ${big} or ${other} ${small}?`,
        answer: bigger, accepts: accepts(bigger, bigger.replace(' ', ''), n * factor > other ? `${n}${big.slice(0, 1)}` : `${other}`),
        choices: [`${n} ${big}`, `${other} ${small}`],
        hints: hintLadder(`Change ${n} ${big} into ${small} first.`, `${n} ${big} = ${n * factor} ${small}.`),
        solution: { steps: [{ text: `${n} ${big} = ${n * factor} ${small}.`, expr: bigger }], answer: bigger },
        misconceptions: [], verify: { kind: 'text', value: bigger } };
    }
    if (mode === 3) {           // n big and m small, in small
      const m = factor >= 1000 ? randInt(1, 9) * 100 : randInt(5, 95);
      const value = n * factor + m;
      return { type: 'unit-convert', instruction: 'Convert the units.',
        question: `Write ${n} ${big} and ${m} ${small} in ${small}.`,
        answer: `${value}`, accepts: accepts(`${value}`, `${value} ${small}`),
        hints: hintLadder(`${n} ${big} = ${n * factor} ${small}.`, `Then add the ${m} ${small}.`),
        solution: { steps: [{ text: `${n} × ${factor} + ${m}.`, expr: `${n * factor} + ${m} = ${value}` }], answer: `${value}` },
        misconceptions: [], verify: { kind: 'fraction', value } };
    }
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
const SHAPE_RIDDLES = [
  ['I have 3 sides and 3 corners. What shape am I?', 'triangle'],
  ['I have 4 equal sides and 4 corners. What shape am I?', 'square'],
  ['I have 2 long sides, 2 short sides and 4 corners. What shape am I?', 'rectangle'],
  ['I am round and I have no corners. What shape am I?', 'circle'],
  ['A chapati is shaped like a ...?', 'circle'],
  ['A door is shaped like a ...?', 'rectangle'],
  ['A slice cut from the middle of a round cake to the edge, is shaped like a ...?', 'triangle'],
  ['A face of a dice is shaped like a ...?', 'square'],
  ['A coin is shaped like a ...?', 'circle'],
  ['An exercise book cover is shaped like a ...?', 'rectangle'],
];
const SHAPE_RIDDLES_MORE = [
  ['I have 5 sides and 5 corners. What shape am I?', 'pentagon'],
  ['I have 6 sides and 6 corners. What shape am I?', 'hexagon'],
  ['A honeycomb cell is shaped like a ...?', 'hexagon'],
];
function buildShapeProperties({ shapes }) {
  const bigShapes = shapes.some(([, n]) => n >= 5);
  const riddles = bigShapes ? [...SHAPE_RIDDLES, ...SHAPE_RIDDLES_MORE] : SHAPE_RIDDLES;
  return () => {
    const mode = randInt(0, 2);
    if (mode === 1) {
      const [q, value] = pick(riddles);
      const names = [...new Set(riddles.map(([, n]) => n))].filter(n => n !== value);
      const wrong = []; while (wrong.length < 2 && names.length) wrong.push(names.splice(randInt(0, names.length - 1), 1)[0]);
      return { type: 'shape-name', instruction: 'Name the shape.', question: q,
        answer: value, accepts: accepts(value, `a ${value}`), choices: [value, ...wrong],
        hints: hintLadder('Count the sides and corners.', 'Then ask whether all the sides are the same length, or whether some are longer than others.'),
        solution: { steps: [{ text: `That is a ${value}.`, expr: value }], answer: value },
        misconceptions: [], verify: { kind: 'text', value } };
    }
    if (mode === 2) {
      const [name, sides] = pick(shapes), k = randInt(2, 4);
      const value = sides * k;
      return { type: 'shape-props', instruction: 'Think about the shapes.',
        question: `How many sides do ${k} ${name}s have altogether?`,
        answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(`One ${name} has ${sides} sides.`, `Add ${sides} ${k} times.`),
        solution: { steps: [{ text: `${k} × ${sides}.`, expr: `${value}` }], answer: `${value}` },
        misconceptions: [], verify: { kind: 'fraction', value } };
    }
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
    ['a stick of sugarcane', 'straight'], ['the edge of a chapati', 'curved'],
    ['a new pencil', 'straight'], ['the outline of a football', 'curved'],
    ['the letter L', 'straight'], ['the letter J', 'curved'],
    ['the edge of the blackboard', 'straight'], ['a bicycle wheel', 'curved'],
    ['the letter T', 'straight'], ['a banana', 'curved'],
    ['the edge of a window', 'straight'], ['the rim of a sufuria', 'curved'],
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
        answer: value, accepts: accepts(value, value.toLowerCase()), choices: [value, ...compass.filter(c => c !== value && c !== compass[start]).slice(0, 2)],
        hints: hintLadder('Each quarter turn moves one step: N → E → S → W.', `Count ${quarters} step(s) around from ${compass[start]}.`),
        solution: { steps: [{ text: `Move ${quarters} step(s) clockwise from ${compass[start]}.`, expr: value }], answer: value },
        misconceptions: [], verify: { kind: 'text', value },
      };
    }
    if (coin()) {
      // The hand can start at 12, 3, 6 or 9 and move 1-4 quarters clockwise.
      const from = pick([12, 3, 6, 9]), quarters = randInt(1, 4), to = ((from % 12) + 3 * quarters) % 12 || 12;
      const startAt12 = quarters === 4 ? `goes all the way round from ${from} back to ${from}` : `moves clockwise from ${from} to ${to}`;
      const value = ['quarter', 'half', 'three quarter', 'full'][quarters - 1];
      const turnChoices = [value, ...['quarter', 'half', 'full', 'three quarter'].filter(t => t !== value).slice(0, 2)];
      return {
        type: 'turn-name', instruction: 'Name the turn.', choices: turnChoices,
        question: `The minute hand of a clock ${startAt12}. Is that a quarter, half, three quarter or full turn?`,
        answer: value, accepts: accepts(value, `${value} turn`, `a ${value} turn`, value === 'three quarter' ? '3/4' : value === 'half' ? '1/2' : value === 'quarter' ? '1/4' : 'full'),
        hints: hintLadder('Each jump of 3 numbers on the clock is a quarter of the way round.', `Count the quarters from ${from}.`),
        solution: { steps: [{ text: 'Each quarter of the clock face is a quarter turn.', expr: value }], answer: value },
        misconceptions: [], verify: { kind: 'text', value },
      };
    }
    const spec = pick([
      { q: 'How many quarter turns make a full turn?', value: 4 },
      { q: 'How many quarter turns make a half turn?', value: 2 },
      { q: 'How many right angles are there in a full turn?', value: 4 },
      { q: 'How many half turns make a full turn?', value: 2 },
      { q: 'How many right angles are there in a half turn?', value: 2 },
      { q: 'How many quarter turns make three quarters of a turn?', value: 3 },
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
      answer: kind, accepts: accepts(kind), choices: ['acute', 'right', 'obtuse'],
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
    const mode = withMonths && coin() ? 'month' : pick(['day', 'day', 'count', 'before', 'tomorrow', 'clock']);
    if (mode === 'before' || mode === 'tomorrow') {
      const i = randInt(1, 5);
      const yesterday = mode === 'before' || coin();
      const q = mode === 'before' ? `What day comes just before ${days[i]}?`
        : yesterday ? `Today is ${days[i]}. What day was yesterday?` : `Today is ${days[i]}. What day is tomorrow?`;
      const value = yesterday ? days[i - 1] : days[i + 1];
      return {
        type: 'time-day', instruction: 'Think about the days of the week.', question: q,
        answer: value, accepts: accepts(value, value.toLowerCase()),
        hints: hintLadder('Say the days of the week in order.', yesterday ? 'Go back one day.' : 'Go forward one day.'),
        solution: { steps: [{ text: yesterday ? 'One day back.' : 'One day forward.', expr: value }], answer: value },
        misconceptions: [], verify: { kind: 'text', value },
      };
    }
    if (mode === 'clock') {
      const h = randInt(1, 12);
      const value = `${h} o'clock`;
      const others = [(h % 12) + 1, ((h + 9) % 12) + 1].map(x => `${x} o'clock`);
      return {
        type: 'time-oclock', instruction: 'Read the clock.',
        question: `The long hand points to 12 and the short hand points to ${h}. What time is it?`,
        answer: value, accepts: accepts(value, `${h}:00`, `${h}.00`), choices: [value, ...others],
        hints: hintLadder("When the long hand points to 12, it is something o'clock.", `The short hand shows the hour: ${h}.`),
        solution: { steps: [{ text: `Short hand on ${h}, long hand on 12.`, expr: `${h} o'clock` }], answer: value },
        misconceptions: [], verify: { kind: 'text', value },
      };
    }
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
        tensOnly ? `${a / 10} × ${b} = ${a / 10 * b}, and then the zero goes back on the end.` : `(${Math.floor(a / 10) * 10} × ${b}) + (${a % 10} × ${b}) = ?`),
      solution: { steps: [{ text: tensOnly ? 'Multiply the tens, then append the zero.' : 'Multiply tens, multiply ones, then add.', expr: `${a} × ${b} = ${value}` }], answer: `${value}` },
      misconceptions: [{ when: `${a + b}`, feedback: 'That\'s adding — this is multiplication.' }],
      band: { op: 'mul', a, b },
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
      hints: hintLadder(
        `How many ${d}s in ${total}? Work digit by digit, left to right.`,
        `Start with the front of the number: how many ${d}s fit into ${String(total).slice(0, String(total).length - 1) || String(total)}? Write that above, then bring the last digit down.`,
        `Check as you go: multiply what you wrote by ${d} and take it away, then carry on.`),
      solution: { steps: [{ text: `Divide step by step: ${d} × ${q} = ${total}.`, expr: `${q}` }], answer: `${q}` },
      misconceptions: [], band: { op: 'div', a: total, b: d, q },
      verify: { kind: 'fraction', value: q },
    };
  };
}

/** 2-digit × 2-digit (KICD Grade 4, 1.4b: "multiply up to a two-digit number
 *  by two-digit number with and without regrouping"). The ladder stopped at a
 *  one-digit multiplier, so the two-partial-product method the design asks for
 *  was never practised at Grade 4 at all. */
function buildTwoByTwoMul({ minA, maxA, minB, maxB }) {
  return () => {
    const a = randInt(minA, maxA);
    let b;
    // ×10, ×20… hides the ones step (the tensOnly rung already covers it) and
    // ×11, ×21 makes the ones step trivial.
    do { b = randInt(minB, maxB); } while (b % 10 < 2);
    const value = a * b;
    const bT = Math.floor(b / 10) * 10, bO = b % 10;
    return {
      type: 'mul-2x2', instruction: 'Work out the multiplication.',
      question: `${a} × ${b} = ?`, answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        'Split the second number into its tens and its ones, and multiply by each part on its own.',
        `That means working out ${a} × ${bO} and ${a} × ${bT}.`,
        'Then add the two answers together — keeping each lined up in its own place-value columns.'),
      solution: { steps: [
        { text: `Split ${b} into tens and ones.`, expr: `${bT} + ${bO}` },
        { text: 'Multiply by the ones.', expr: `${a} × ${bO} = ${a * bO}` },
        { text: 'Multiply by the tens.', expr: `${a} × ${bT} = ${a * bT}` },
        { text: 'Add the two partial products.', expr: `${a * bO} + ${a * bT} = ${value}` },
      ], answer: `${value}` },
      misconceptions: [
        { when: `${a * bO + a * (bT / 10)}`, feedback: `The tens row was multiplied as ${bT / 10} instead of ${bT} — that row must shift one column to the left (or be written with a zero in the ones place).` },
        { when: `${a * bO}`, feedback: 'That is only the ones part of the second number. The tens part still has to be multiplied and added on.' },
        { when: `${a + b}`, feedback: 'That\'s adding — this is multiplication.' },
      ],
      band: { op: 'mul', a, b },
      verify: { kind: 'fraction', value },
    };
  };
}

/** 2-digit ÷ 1-digit leaving a remainder (KICD Grade 4, 1.5a: "divide up to a
 *  two-digit number by a one-digit number WITH and without remainder"). Every
 *  Grade 4 division divided exactly, so remainders were never met. */
function buildDivWithRemainder({ minTotal, maxTotal }) {
  return () => {
    let d, total, r;
    for (let i = 0; ; i++) {
      d = randInt(3, 9);
      total = randInt(minTotal, maxTotal);
      r = total % d;
      if (r !== 0 || i > 300) break;
    }
    const q = Math.floor(total / d);
    const spec = pick([
      `${total} mangoes are shared equally among ${d} children. How many are left over?`,
      `${total} exercise books are tied into bundles of ${d}. How many books are left over?`,
      `${total} eggs are packed into trays of ${d}. How many eggs are left over?`,
      `${total} ÷ ${d} — what is the remainder?`,
    ]);
    return {
      type: 'div-remainder', instruction: 'Divide and give the remainder.',
      question: spec, answer: `${r}`, accepts: accepts(`${r}`),
      hints: hintLadder(
        'Share out as many WHOLE groups as you can first.',
        `Use the ${d} times table: find the biggest multiple of ${d} that still fits.`,
        'Whatever is left in your hand after that is the remainder — and it is always smaller than one group.'),
      solution: { steps: [
        { text: `The biggest multiple of ${d} that fits.`, expr: `${d} × ${q} = ${d * q}` },
        { text: 'Take it away to see what is left.', expr: `${total} − ${d * q} = ${r}` },
      ], answer: `${r}` },
      misconceptions: [
        { when: `${q}`, feedback: 'That is the number of whole groups. The question asks how many are LEFT OVER once those groups are made.' },
        { when: `${d - r}`, feedback: 'That is how many more would be needed to fill another group, not how many are left over.' },
      ],
      band: { op: 'div', a: total, b: d, q },
      verify: { kind: 'fraction', value: r },
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
// KICD Grade 4, Numbers 1.8 "Use of letters": a letter standing in for a
// number we do not know yet. The graph had no Grade 4 algebra at all.
function buildUseOfLetters() {
  return () => {
    const letter = pick(['a', 'n', 'k', 'm']);
    if (coin()) {
      const known = randInt(2, 20), answer = randInt(2, 30);
      const total = known + answer;
      const wrong = [...new Set([total, Math.abs(known - answer), answer + 1])].filter(w => w !== answer).slice(0, 2);
      return { type: 'use-of-letters', instruction: 'Find the number the letter stands for.',
        question: `If ${letter} + ${known} = ${total}, what is ${letter}?`,
        answer: `${answer}`, accepts: accepts(`${answer}`), choices: [answer, ...wrong].map(String),
        hints: hintLadder(`${letter} stands for a number we do not know yet.`,
                          `What do you add to ${known} to reach ${total}?`,
                          `Take ${known} away from ${total}.`),
        solution: { steps: [
          { text: `${letter} stands for a number we do not know yet.` },
          { text: `What adds to ${known} to make ${total}?`, expr: `${total} − ${known}` },
          { text: `So ${letter} = ${answer}.`, expr: `${letter} = ${answer}` }],
          answer: `${answer}` },
        misconceptions: [
          { when: `${total}`, feedback: `${total} is the total the two sides add up to, not the missing number — take ${known} away from it.` },
          { when: `${total + known}`, feedback: `${known} was added again. To undo an addition you take the same amount away.` },
        ], verify: { kind: 'number', value: answer } };
    }
    const each = randInt(2, 9), groups = randInt(2, 9);
    const value = each * groups;
    const wrong = [...new Set([each + groups, value + each, value - each])].filter(w => w !== value).slice(0, 2);
    return { type: 'use-of-letters', instruction: 'Find the number the letter stands for.',
      question: `If ${groups} × ${letter} = ${value}, what is ${letter}?`,
      answer: `${each}`, accepts: accepts(`${each}`), choices: [each, ...wrong].map(String),
      hints: hintLadder(`${letter} stands for a number we do not know yet.`,
                        `How many ${groups}s make ${value}?`,
                        `Share ${value} into ${groups} equal groups.`),
      solution: { steps: [
        { text: `${letter} stands for a number we do not know yet.` },
        { text: `How many ${groups}s make ${value}?`, expr: `${value} ÷ ${groups}` },
        { text: `So ${letter} = ${each}.`, expr: `${letter} = ${each}` }],
        answer: `${each}` },
      misconceptions: [
        { when: `${value}`, feedback: `${value} is the answer to the multiplication, not the number ${letter} stands for — share it into ${groups} equal groups.` },
        { when: `${value - groups}`, feedback: `${groups} × ${letter} is a multiplication, so undo it by dividing, not by subtracting.` },
      ], verify: { kind: 'number', value: each } };
  };
}

// ---------------------------------------------------------------------------
// Grade 4 sub-strands that had no authored content and fell back to the thin
// legacy generators (a bare question and answer, no hints, no steps, no
// misconceptions) or to a Grade 5/6 alias that ran above level.
// ---------------------------------------------------------------------------

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

/** KICD Grade 4, 1.6: equivalent fractions by multiplying/dividing both parts. */
function buildEquivalentFraction({ maxDen = 10, divideToo = false }) {
  return () => {
    const den = randInt(2, maxDen);
    const num = randInt(1, den - 1);
    const k = randInt(2, 6);
    if (divideToo && coin()) {
      // The other direction: cancel down to the simplest form.
      const bigN = num * k, bigD = den * k;
      const g = gcd(bigN, bigD);
      const sn = bigN / g, sd = bigD / g;
      return {
        type: 'fraction-simplify', instruction: 'Write the fraction in its simplest form.',
        question: `Write ${bigN}/${bigD} in its simplest form.`,
        answer: `${sn}/${sd}`, accepts: accepts(`${sn}/${sd}`, `${sn} / ${sd}`),
        hints: hintLadder(
          'Look for a number that divides into BOTH the top and the bottom.',
          'Keep dividing top and bottom by the same number until no number but 1 goes into both.',
          `Try the biggest number that goes into both ${bigN} and ${bigD}.`),
        solution: { steps: [
          { text: `${g} divides into both.`, expr: `${bigN} ÷ ${g} = ${sn},  ${bigD} ÷ ${g} = ${sd}` },
          { text: 'Nothing but 1 divides into both now.', expr: `${sn}/${sd}` },
        ], answer: `${sn}/${sd}` },
        misconceptions: [
          { when: `${bigN - g}/${bigD - g}`, feedback: 'Simplifying means DIVIDING top and bottom by the same number, not taking the same number away from each.' },
        ],
        verify: { kind: 'fraction', value: sn / sd },
      };
    }
    const value = num * k;
    return {
      type: 'fraction-equiv', instruction: 'Find the missing number.',
      question: `Fill in the blank:   ${num}/${den} = ?/${den * k}`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        'Equivalent fractions are the same amount cut into more, smaller pieces.',
        `Ask what ${den} was multiplied by to become ${den * k}.`,
        'Whatever the bottom was multiplied by, the top must be multiplied by the same.'),
      solution: { steps: [
        { text: 'See what happened to the bottom.', expr: `${den} × ${k} = ${den * k}` },
        { text: 'Do the same to the top.', expr: `${num} × ${k} = ${value}` },
      ], answer: `${value}` },
      misconceptions: [
        { when: `${num + (den * k - den)}`, feedback: `The bottom was MULTIPLIED by ${k}, not added to — so the top must be multiplied by ${k} as well.` },
        { when: `${num}`, feedback: 'The top cannot stay the same: the pieces got smaller, so more of them are needed to make the same amount.' },
      ],
      verify: { kind: 'fraction', value },
    };
  };
}

/** KICD Grade 4, 1.6: compare fractions — same bottom, same top, then halves. */
function buildCompareFractions({ unlike = false }) {
  return () => {
    const mode = unlike ? pick(['same-num', 'vs-half']) : 'same-den';
    let n1, d1, n2, d2, why;
    if (mode === 'same-den') {
      d1 = d2 = randInt(3, 10);
      n1 = randInt(1, d1 - 1);
      do { n2 = randInt(1, d1 - 1); } while (n2 === n1);
      why = 'The pieces are the same size, so the fraction with more pieces is bigger.';
    } else if (mode === 'same-num') {
      n1 = n2 = randInt(1, 4);
      d1 = randInt(n1 + 1, 9);
      do { d2 = randInt(n1 + 1, 12); } while (d2 === d1);
      why = 'The same number of pieces, but cutting a whole into more parts makes every part smaller.';
    } else {
      d1 = randInt(3, 12); n1 = randInt(1, d1 - 1);
      n2 = 1; d2 = 2;
      if (n1 * 2 === d1) { n1 = n1 === 1 ? 1 : n1 - 1; }     // never ask half vs half
      why = 'Compare each one with a half: is the top more or less than half of the bottom?';
    }
    const diff = n1 / d1 - n2 / d2;
    const value = diff > 1e-9 ? '>' : diff < -1e-9 ? '<' : '=';
    return {
      type: 'fraction-compare', instruction: 'Choose <, > or = .',
      question: `Which symbol makes this true:   ${n1}/${d1} ☐ ${n2}/${d2}?   (<, > or =)`,
      answer: value, accepts: accepts(value), choices: ['<', '>', '='],
      hints: hintLadder(
        'The open side of the symbol always faces the bigger amount.',
        why,
        mode === 'same-den' ? 'The bottoms match, so only the tops need comparing.'
          : mode === 'same-num' ? 'The tops match, so look at how many pieces each whole was cut into.'
          : 'Half of the bottom number is the mark to compare the top against.'),
      solution: { steps: [
        { text: why },
        { text: 'So the symbol opens towards the bigger fraction.', expr: `${n1}/${d1} ${value} ${n2}/${d2}` },
      ], answer: value },
      misconceptions: [
        { when: value === '<' ? '>' : '<', feedback: mode === 'same-num'
            ? 'A BIGGER bottom number means SMALLER pieces — 1/8 is less than 1/4, even though 8 is more than 4.'
            : 'The open (wide) side of the symbol faces the bigger amount.' },
      ],
      verify: { kind: 'compare', diff },
    };
  };
}

/** KICD Grade 4, 1.7: tenths and hundredths — fraction to decimal and back. */
function buildDecimalsIntro({ hundredths = false }) {
  return () => {
    const den = hundredths ? 100 : 10;
    const num = hundredths ? randInt(11, 99) : randInt(1, 9);
    const dec = (num / den).toFixed(hundredths ? 2 : 1);
    const mode = pick(['to-decimal', 'to-fraction', 'place']);
    if (mode === 'to-fraction') {
      return {
        type: 'decimal-to-fraction', instruction: 'Write the decimal as a fraction.',
        question: `Write ${dec} as a fraction over ${den}.`,
        answer: `${num}/${den}`, accepts: accepts(`${num}/${den}`, `${num} / ${den}`, `${num}`),
        hints: hintLadder(
          hundredths ? 'Two digits after the point means hundredths.' : 'One digit after the point means tenths.',
          `So the bottom of the fraction is ${den}.`,
          'The digits after the point become the top of the fraction.'),
        solution: { steps: [
          { text: `${hundredths ? 'Two places' : 'One place'} after the point means ${hundredths ? 'hundredths' : 'tenths'}.`, expr: `over ${den}` },
          { text: 'The digits after the point go on top.', expr: `${num}/${den}` },
        ], answer: `${num}/${den}` },
        misconceptions: [
          { when: `${num}/${hundredths ? 10 : 100}`, feedback: `Count the places after the point: ${hundredths ? 'two places is hundredths' : 'one place is tenths'}.` },
        ],
        verify: { kind: 'fraction', value: num / den },
      };
    }
    if (mode === 'place') {
      // Which place is a named digit in? (Place value of decimals.)
      const digitsAfter = dec.split('.')[1];
      const idx = hundredths ? randInt(0, 1) : 0;
      const d = digitsAfter[idx];
      const value = idx === 0 ? 'tenths' : 'hundredths';
      return {
        type: 'decimal-place', instruction: 'Name the place value.',
        question: `In the number ${dec}, the digit ${d} is in which place?`,
        answer: value, accepts: accepts(value), choices: ['tenths', 'hundredths'],
        hints: hintLadder(
          'Read the places going right from the point.',
          'The first place after the point is one of ten equal parts of a whole; the next is one of a hundred.',
          `Count how many steps past the point the digit ${d} sits.`),
        solution: { steps: [
          { text: 'Places after the point, in order: first, then second.', expr: 'tenths, hundredths' },
          { text: `The digit ${d} is ${idx === 0 ? 'first' : 'second'} after the point.`, expr: value },
        ], answer: value },
        misconceptions: [
          { when: value === 'tenths' ? 'hundredths' : 'tenths', feedback: 'Count from the point outwards: the FIRST place is tenths, the SECOND is hundredths.' },
        ],
        verify: { kind: 'text', value },
      };
    }
    return {
      type: 'fraction-to-decimal', instruction: 'Write the fraction as a decimal.',
      question: `Write ${num}/${den} as a decimal.`,
      answer: dec, accepts: accepts(dec, dec.replace(/^0/, '')),
      hints: hintLadder(
        `A bottom number of ${den} means ${hundredths ? 'hundredths' : 'tenths'}.`,
        `${hundredths ? 'Hundredths' : 'Tenths'} need ${hundredths ? 'two digits' : 'one digit'} after the decimal point.`,
        'Write a zero and a point for the whole part, then fill the places after it.'),
      solution: { steps: [
        { text: `${num} out of ${den} is ${hundredths ? 'hundredths' : 'tenths'}.`, expr: `${hundredths ? 'two places' : 'one place'} after the point` },
        { text: 'Write it with the point.', expr: dec },
      ], answer: dec },
      misconceptions: [
        { when: `0.${num}`, feedback: hundredths
            ? 'Hundredths need TWO places after the point — check how many places were written.'
            : 'Tenths need exactly one place after the point.' },
        { when: `${num}`, feedback: 'The point matters: this is part of one whole, so it is less than 1.' },
      ],
      verify: { kind: 'fraction', value: num / den },
    };
  };
}

/** KICD Grade 4, Measurement 2.5: a.m./p.m. and duration inside one day. */
function buildAmPmDuration({ withDuration = true }) {
  return () => {
    const mode = withDuration ? pick(['duration', 'duration', 'ampm', 'minutes']) : 'ampm';
    if (mode === 'ampm') {
      const spec = pick([
        { q: 'Learners arrive at school at 7:20 in the morning.', value: 'am' },
        { q: 'The Friday assembly ends at 8:00 in the morning.', value: 'am' },
        { q: 'Games start at 4:15 in the afternoon.', value: 'pm' },
        { q: 'The evening news is at 9:00 at night.', value: 'pm' },
        { q: 'Lunch is served at 1:00 in the afternoon.', value: 'pm' },
        { q: 'The milk is delivered at 5:30 before sunrise.', value: 'am' },
        { q: 'The shop closes at 7:45 in the evening.', value: 'pm' },
        { q: 'Mathematics is the first lesson, at 8:30 in the morning.', value: 'am' },
      ]);
      return {
        type: 'time-ampm', instruction: 'Write a.m. or p.m.',
        question: `${spec.q} Is that time a.m. or p.m.?`,
        answer: spec.value, accepts: accepts(spec.value, `${spec.value[0]}.${spec.value[1]}.`),
        choices: ['am', 'pm'],
        hints: hintLadder(
          'The day is split at midday into two halves of twelve hours each.',
          'Midnight to noon is the first half; noon to midnight is the second.',
          'Decide which half of the day the time described falls in.'),
        solution: { steps: [
          { text: 'Midnight to noon is the first twelve hours; noon to midnight the second.' },
          { text: 'Place the time in its half of the day.', expr: spec.value },
        ], answer: spec.value },
        misconceptions: [
          { when: spec.value === 'am' ? 'pm' : 'am', feedback: 'a.m. runs from midnight up to noon; p.m. runs from noon up to midnight.' },
        ],
        verify: { kind: 'text', value: spec.value },
      };
    }
    if (mode === 'minutes') {
      const h = randInt(2, 6), m = pick([15, 20, 30, 40, 45]);
      const value = h * 60 + m;
      return {
        type: 'time-to-minutes', instruction: 'Change the time to minutes.',
        question: `How many minutes are there in ${h} hours and ${m} minutes?`,
        answer: `${value}`, accepts: accepts(`${value}`, `${value} minutes`),
        hints: hintLadder(
          'One hour is sixty minutes.',
          `So the hours have to be changed into minutes first: ${h} × 60.`,
          `Then the extra ${m} minutes are added on.`),
        solution: { steps: [
          { text: 'Change the hours to minutes.', expr: `${h} × 60 = ${h * 60}` },
          { text: 'Add the loose minutes.', expr: `${h * 60} + ${m} = ${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${h * 100 + m}`, feedback: 'An hour is 60 minutes, not 100 — the hours must be multiplied by 60.' },
          { when: `${h * 60}`, feedback: `The extra ${m} minutes still have to be added on.` },
        ],
        verify: { kind: 'fraction', value },
      };
    }
    // Duration inside one day, 12-hour clock with a.m./p.m.
    const startH = randInt(8, 11), startM = pick([0, 10, 15, 20, 30, 40, 45]);
    const runH = randInt(1, 3), runM = pick([0, 15, 20, 30, 45]);
    let endMin = startH * 60 + startM + runH * 60 + runM;
    const endH24 = Math.floor(endMin / 60), endM = endMin % 60;
    const endH12 = endH24 > 12 ? endH24 - 12 : endH24;
    const half = endH24 >= 12 ? 'p.m.' : 'a.m.';
    const value = `${endH12}:${String(endM).padStart(2, '0')} ${half}`;
    const spec = pick([
      `A matatu leaves Nakuru at ${startH}:${String(startM).padStart(2, '0')} a.m. and the journey takes ${runH} hour${runH > 1 ? 's' : ''}${runM ? ` ${runM} minutes` : ''}.`,
      `A Mathematics lesson starts at ${startH}:${String(startM).padStart(2, '0')} a.m. and lasts ${runH} hour${runH > 1 ? 's' : ''}${runM ? ` ${runM} minutes` : ''}.`,
      `Maize is put out to dry at ${startH}:${String(startM).padStart(2, '0')} a.m. for ${runH} hour${runH > 1 ? 's' : ''}${runM ? ` ${runM} minutes` : ''}.`,
    ]);
    return {
      type: 'time-duration', instruction: 'Give the finishing time with a.m. or p.m.',
      question: `${spec} At what time does it finish? (Give a.m. or p.m.)`,
      answer: value,
      accepts: accepts(value, value.replace(/\./g, ''), value.replace(' ', ''), `${endH12}:${String(endM).padStart(2, '0')}${half.replace(/\./g, '')}`),
      hints: hintLadder(
        'Add the whole hours on first, then the loose minutes.',
        'Sixty minutes make one more hour, so if the minutes pass sixty, carry an hour.',
        'Then check whether the finishing time has passed noon, which decides a.m. or p.m.'),
      solution: { steps: [
        { text: 'Add the hours.', expr: `${startH}:${String(startM).padStart(2, '0')} + ${runH} h` },
        { text: 'Add the minutes, carrying an hour for every sixty.', expr: `+ ${runM} min` },
        { text: 'Past noon means p.m.', expr: value },
      ], answer: value },
      misconceptions: [
        { when: `${endH12}:${String(endM).padStart(2, '0')} ${half === 'a.m.' ? 'p.m.' : 'a.m.'}`,
          feedback: 'The clock time is right, but check the half of the day: noon is where a.m. becomes p.m.' },
      ],
      verify: { kind: 'text', value },
    };
  };
}

/** KICD Grade 4, Measurement 2.3/2.4: choose the sensible unit for the job. */
function buildUnitChoice({ pairs }) {
  return () => {
    const [small, big, items] = pick(pairs);
    const [thing, want] = pick(items);
    const value = want === 'small' ? small : big;
    return {
      type: 'unit-choice', instruction: 'Choose the sensible unit.',
      question: `Would you measure ${thing} in ${small} or in ${big}?`,
      answer: value, accepts: accepts(value), choices: [small, big],
      hints: hintLadder(
        'Picture the thing itself before picking a unit.',
        'The bigger unit is a thousand times the smaller one.',
        'A sensible unit gives a small, easy number — not a few thousandths and not tens of thousands.'),
      solution: { steps: [
        { text: `Think how much ${thing} really is.` },
        { text: 'Pick the unit that gives an easy, everyday number.', expr: value },
      ], answer: value },
      misconceptions: [
        { when: want === 'small' ? big : small, feedback: 'That unit gives an awkward number here — a sensible unit keeps the measurement easy to say.' },
      ],
      verify: { kind: 'text', value },
    };
  };
}

/** KICD Grade 4, Data Handling 5.1: read a table, total it, compare two bars. */
function buildTablesAndBars() {
  return () => {
    const sets = [
      { label: 'exercise books sold', keys: ['Mon', 'Tue', 'Wed', 'Thu'], noun: 'books' },
      { label: 'pupils present', keys: ['Grade 4', 'Grade 5', 'Grade 6'], noun: 'pupils' },
      { label: 'litres of milk collected', keys: ['Mon', 'Tue', 'Wed', 'Thu'], noun: 'litres' },
      { label: 'mango trees counted', keys: ['Kamau', 'Achieng', 'Mwikali', 'Otieno'], noun: 'trees' },
    ];
    const set = pick(sets);
    const vals = set.keys.map(() => randInt(3, 20));
    // Distinct values keep "which is biggest" and the readings unambiguous.
    if (new Set(vals).size !== vals.length) return buildTablesAndBars()();
    const mode = pick(['read', 'total', 'difference', 'most']);
    // The data is DRAWN, never written into the question. Spelled out as
    // "Mon: 7, Tue: 9, Wed: 20", reading a table collapses into finding the
    // label and copying the number beside it — which is not the skill.
    const rows = set.keys.map((k, i) => ({ label: k, value: vals[i] }));
    const tableModel = { type: 'table', data: { head: ['', set.noun], rows } };
    const barModel = { type: 'bar-chart', data: { bars: rows } };

    if (mode === 'read') {
      const i = randInt(0, set.keys.length - 1);
      return {
        type: 'table-read', instruction: 'Read the value out of the table.',
        question: `The table shows ${set.label}. How many ${set.noun} for ${set.keys[i]}?`,
        model: tableModel,
        answer: `${vals[i]}`, accepts: accepts(`${vals[i]}`),
        hints: hintLadder(
          'Each row of the table names one group and gives its count.',
          `Find the row labelled ${set.keys[i]}.`,
          'Read the number written beside that label — no working out is needed.'),
        solution: { steps: [
          { text: `Find the row for ${set.keys[i]}.` },
          { text: 'Read its number.', expr: `${vals[i]}` },
        ], answer: `${vals[i]}` },
        misconceptions: [
          { when: `${vals.reduce((a, b) => a + b, 0)}`, feedback: 'That is every row added together. This question asks about one row only.' },
        ],
        verify: { kind: 'fraction', value: vals[i] },
      };
    }
    if (mode === 'total') {
      const value = vals.reduce((a, b) => a + b, 0);
      return {
        type: 'table-total', instruction: 'Give the total.',
        question: `The table shows ${set.label}. How many ${set.noun} altogether?`,
        model: tableModel,
        answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(
          'Every row stands for part of the whole.',
          'A total needs every row accounted for, none left out.',
          'Gather the rows together one at a time so none is missed.'),
        solution: { steps: [
          { text: 'Read every row.', expr: vals.join(', ') },
          { text: 'Add them.', expr: `${vals.join(' + ')} = ${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${value - vals[vals.length - 1]}`, feedback: 'One row was left out — check that every row in the table was added.' },
        ],
        verify: { kind: 'fraction', value },
      };
    }
    if (mode === 'difference') {
      const hi = Math.max(...vals), lo = Math.min(...vals), value = hi - lo;
      return {
        type: 'bar-difference', instruction: 'Compare the tallest and shortest bars.',
        question: `The bar graph shows ${set.label}. How many more ${set.noun} has the tallest bar than the shortest?`,
        model: barModel,
        answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(
          'Find the tallest bar and the shortest bar first.',
          '"How many more" compares two readings rather than joining them.',
          'Comparing two amounts like this is a subtraction.'),
        solution: { steps: [
          { text: 'Read the tallest and the shortest.', expr: `${hi} and ${lo}` },
          { text: 'Take the smaller from the bigger.', expr: `${hi} − ${lo} = ${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${hi + lo}`, feedback: '"How many more" is a comparison — subtract the smaller from the bigger.' },
          { when: `${hi}`, feedback: 'That is the biggest bar on its own. The question asks how much MORE it is than the smallest.' },
        ],
        verify: { kind: 'fraction', value: hi - lo },
      };
    }
    const hi = Math.max(...vals);
    const value = set.keys[vals.indexOf(hi)];
    return {
      type: 'bar-most', instruction: 'Name the biggest bar.',
      question: `The bar graph shows ${set.label}. Which has the most?`,
      model: barModel,
      answer: value, accepts: accepts(value), choices: set.keys,
      hints: hintLadder(
        'The tallest bar always stands for the biggest count.',
        'Compare the numbers rather than the labels.',
        'Work along the rows keeping the biggest so far in mind.'),
      solution: { steps: [
        { text: 'Compare every reading.', expr: vals.join(', ') },
        { text: 'The biggest reading names the answer.', expr: value },
      ], answer: value },
      misconceptions: [
        { when: set.keys[vals.indexOf(Math.min(...vals))], feedback: 'That is the smallest bar. The question asks which has the MOST.' },
      ],
      verify: { kind: 'text', value },
    };
  };
}

// ---------------------------------------------------------------------------
// KICD Grade 4, 1.1 Whole Numbers (20 lessons) — the outcomes beyond place value
//
// The design lists ten outcomes for this sub-strand and only (a), place and
// total value, had a skill behind it. Reading and writing numbers, ordering,
// rounding, factors, multiples, odd and even numbers and Roman numerals were
// all absent, so the biggest sub-strand of the Grade 4 year — a fifth of its
// lessons — was taught by a single place-value drill. These builders cover
// outcomes (b) through (j), to the design's own number ranges.
// ---------------------------------------------------------------------------

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
  'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

/** 0–1,000 in words, the way Kenyan classrooms say them: "three hundred and forty-five". */
const inWords = (n) => {
  if (n === 1000) return 'one thousand';
  if (n < 20) return ONES[n];
  if (n < 100) {
    const t = TENS[Math.floor(n / 10)], o = n % 10;
    return o ? `${t}-${ONES[o]}` : t;
  }
  const h = `${ONES[Math.floor(n / 100)]} hundred`;
  const r = n % 100;
  return r ? `${h} and ${inWords(r)}` : h;
};

// The same number said without the "and", and without the hyphen, both of
// which a child may well write. All three spellings are the same answer.
const wordForms = (n) => {
  const w = inWords(n);
  return accepts(w, w.replace(' and ', ' '), w.replace('-', ' '),
    w.replace(' and ', ' ').replace('-', ' '));
};

/** KICD 1.1 b, c: read and write numbers in symbols (to 10,000) and words (to 1,000). */
function buildNumberWords() {
  return () => {
    // Words are required only up to 1,000; symbols run to 10,000.
    if (coin()) {
      const n = randInt(21, 999);
      const w = inWords(n);
      return {
        type: 'number-words', instruction: 'Write the number in words.',
        question: `Write ${n} in words.`,
        answer: w, accepts: wordForms(n),
        hints: hintLadder('Say the number out loud first.',
          n % 100 === 0 ? 'How many hundreds is it?' : 'Start with the hundreds, then say the rest.'),
        solution: { steps: [
          { text: `${Math.floor(n / 100)} hundred${n % 100 ? `, then ${n % 100}` : ''}.`, expr: w }], answer: w },
        misconceptions: [], verify: { kind: 'text', value: w },
      };
    }
    const n = randInt(1001, 9999);
    // Read the symbols aloud: the design asks for numbers up to 10,000 read in
    // symbols, which in practice is "how many thousands, hundreds, tens, ones".
    const th = Math.floor(n / 1000), rest = n % 1000;
    return {
      type: 'number-symbols', instruction: 'Write the number in symbols.',
      question: `Write ${th} thousand ${rest ? `${rest} ` : ''}in symbols.`,
      answer: `${n}`, accepts: accepts(`${n}`, n.toLocaleString('en-US')),
      hints: hintLadder('Thousands come first, then the rest of the number.',
        'Four places to fill: thousands, hundreds, tens, ones. Put the thousands digit down first and work along to the right.'),
      solution: { steps: [
        { text: `${th} thousand is ${th * 1000}${rest ? `, and ${rest} more` : ''}.`, expr: `${n}` }], answer: `${n}` },
      misconceptions: [], verify: { kind: 'fraction', value: n },
    };
  };
}

/** KICD 1.1 d, e: order numbers up to 1,000, and round to the nearest ten. */
function buildOrderRound() {
  return () => {
    const mode = pick(['order', 'order', 'round', 'round']);
    if (mode === 'round') {
      // The design is specific: up to 1,000, to the NEAREST TEN. A number that
      // is already a multiple of ten rounds to itself, which teaches nothing
      // and reads like a trick, so those are never drawn.
      let n = randInt(11, 989);
      while (n % 10 === 0) n = randInt(11, 989);
      const down = Math.floor(n / 10) * 10, up = down + 10;
      const ans = (n % 10) >= 5 ? up : down;
      return {
        type: 'round-ten', instruction: 'Round to the nearest ten.',
        question: `Round ${n} to the nearest ten.`,
        answer: `${ans}`, accepts: accepts(`${ans}`),
        choices: [`${down}`, `${up}`],
        hints: hintLadder('Look at the ones digit.',
          'If it is 5 or more, round up. If it is less than 5, round down.'),
        solution: { steps: [
          { text: `${n} sits between ${down} and ${up}.` },
          { text: `The ones digit is ${n % 10}, so round ${(n % 10) >= 5 ? 'up' : 'down'}.`, expr: `${ans}` }], answer: `${ans}` },
        misconceptions: [{ when: `${(n % 10) >= 5 ? down : up}`, feedback: `The ones digit is ${n % 10}, so you round ${(n % 10) >= 5 ? 'UP' : 'DOWN'}.` }],
        verify: { kind: 'fraction', value: ans },
      };
    }
    // Order: three numbers up to 1,000, smallest or largest.
    const set = new Set();
    while (set.size < 3) set.add(randInt(101, 999));
    const nums = [...set];
    const wantLargest = coin();
    const ans = wantLargest ? Math.max(...nums) : Math.min(...nums);
    return {
      type: 'order-numbers', instruction: 'Compare the numbers.',
      question: `Which is the ${wantLargest ? 'largest' : 'smallest'}: ${nums.join(', ')}?`,
      answer: `${ans}`, accepts: accepts(`${ans}`),
      choices: nums.map(String), choicesFixed: true,
      hints: hintLadder('Compare the hundreds digit first.',
        'If two numbers have the same hundreds, compare the tens.'),
      solution: { steps: [
        { text: 'Compare the hundreds digit, then the tens, then the ones.', expr: `${ans}` }], answer: `${ans}` },
      misconceptions: [{ when: `${wantLargest ? Math.min(...nums) : Math.max(...nums)}`, feedback: `That is the ${wantLargest ? 'smallest' : 'largest'}. Read the question again.` }],
      verify: { kind: 'fraction', value: ans },
    };
  };
}

/** KICD 1.1 f, g: factors of numbers up to 50, multiples of numbers up to 100. */
function buildFactorsMultiples() {
  return () => {
    if (coin()) {
      const n = pick([12, 15, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50]);
      const factors = [];
      for (let i = 1; i <= n; i++) if (n % i === 0) factors.push(i);
      // Ask whether ONE number is a factor: a list answer is hard to type.
      const isFactor = coin();
      const cand = isFactor ? pick(factors.filter(f => f > 1 && f < n))
        : pick([...Array(n).keys()].map(i => i + 2).filter(i => n % i !== 0 && i < n));
      const value = n % cand === 0 ? 'yes' : 'no';
      return {
        type: 'factors', instruction: 'Think about factors.', tapChoices: true,
        question: `Is ${cand} a factor of ${n}?`,
        answer: value, accepts: accepts(value), choices: ['yes', 'no'],
        hints: hintLadder('A factor divides the number exactly, with nothing left over.',
          `Try ${n} ÷ ${cand}.`),
        solution: { steps: [
          { text: `${n} ÷ ${cand} ${n % cand === 0 ? `= ${n / cand}, exactly` : `leaves ${n % cand} over`}.`, expr: value }], answer: value },
        misconceptions: [], verify: { kind: 'text', value },
      };
    }
    const base = randInt(2, 12);
    const k = randInt(2, Math.floor(100 / base));
    const value = base * k;
    return {
      type: 'multiples', instruction: 'Think about multiples.',
      question: `What is the ${k === 2 ? '2nd' : k === 3 ? '3rd' : `${k}th`} multiple of ${base}?`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(`Count up in ${base}s.`, `${base} × ${k} = ?`),
      solution: { steps: [{ text: `Multiples of ${base} are ${base}, ${base * 2}, ${base * 3}, …`, expr: `${base} × ${k} = ${value}` }], answer: `${value}` },
      misconceptions: [{ when: `${base + k}`, feedback: `A multiple means ${base} × ${k}, not ${base} + ${k}.` }],
      verify: { kind: 'fraction', value },
    };
  };
}

/** KICD 1.1 h, i: even and odd numbers up to 100, and patterns made from them. */
function buildOddEven() {
  return () => {
    if (coin()) {
      const n = randInt(11, 100);
      const value = n % 2 === 0 ? 'even' : 'odd';
      return {
        type: 'odd-even', instruction: 'Even or odd?', tapChoices: true,
        question: `Is ${n} even or odd?`,
        answer: value, accepts: accepts(value), choices: ['even', 'odd'],
        hints: hintLadder('Look at the ones digit.',
          'A number ending in 0, 2, 4, 6 or 8 is even. The rest are odd.'),
        solution: { steps: [{ text: `${n} ends in ${n % 10}, so it is ${value}.`, expr: value }], answer: value },
        misconceptions: [], verify: { kind: 'text', value },
      };
    }
    // A pattern made of even or of odd numbers: the next term.
    const even = coin();
    const start = even ? randInt(1, 20) * 2 : randInt(1, 20) * 2 + 1;
    const step = pick([2, 4, 6]);
    const seq = [0, 1, 2, 3].map(i => start + i * step);
    const next = start + 4 * step;
    return {
      type: 'odd-even-pattern', instruction: 'Find the next number.',
      question: `What comes next?   ${seq.join(', ')}, ?`,
      answer: `${next}`, accepts: accepts(`${next}`),
      hints: hintLadder(`These are all ${even ? 'even' : 'odd'} numbers.`, `How much is added each time?`),
      solution: { steps: [
        { text: `Each number is ${step} more than the one before.`, expr: `${seq[3]} + ${step} = ${next}` }], answer: `${next}` },
      misconceptions: [], verify: { kind: 'fraction', value: next },
    };
  };
}

/**
 * KICD Grade 5, 1.1 d: round off numbers up to tens of thousands to the nearest
 * hundred AND thousand. Grade 4 rounds to the nearest ten; this is the next
 * rung, and before it was written the whole idea of rounding first appeared at
 * Grade 7 — three years after the design asks for it.
 */
export function buildRoundHundredThousand() {
  return () => {
    const toThousand = coin();
    const unit = toThousand ? 1000 : 100;
    const word = toThousand ? 'thousand' : 'hundred';
    let n = randInt(1001, 99999);
    while (n % unit === 0) n = randInt(1001, 99999);   // already rounded: no question
    const down = Math.floor(n / unit) * unit, up = down + unit;
    const ans = (n % unit) >= unit / 2 ? up : down;
    // The digit the decision rests on: tens for hundreds, hundreds for thousands.
    const deciding = Math.floor((n % unit) / (unit / 10));
    return {
      type: 'round-place', instruction: `Round to the nearest ${word}.`,
      question: `Round ${n.toLocaleString('en-US')} to the nearest ${word}.`,
      answer: `${ans}`, accepts: accepts(`${ans}`, ans.toLocaleString('en-US')),
      choices: [down, up].map(v => v.toLocaleString('en-US')),
      hints: hintLadder(
        `Look at the digit in the ${toThousand ? 'hundreds' : 'tens'} place.`,
        'If it is 5 or more, round up. If it is less than 5, round down.'),
      solution: { steps: [
        { text: `${n.toLocaleString('en-US')} sits between ${down.toLocaleString('en-US')} and ${up.toLocaleString('en-US')}.` },
        { text: `The ${toThousand ? 'hundreds' : 'tens'} digit is ${deciding}, so round ${deciding >= 5 ? 'up' : 'down'}.`, expr: `${ans}` }],
        answer: `${ans}` },
      misconceptions: [{ when: `${deciding >= 5 ? down : up}`, feedback: `The ${toThousand ? 'hundreds' : 'tens'} digit is ${deciding}, so round ${deciding >= 5 ? 'UP' : 'DOWN'}.` }],
      verify: { kind: 'fraction', value: ans },
    };
  };
}

const ROMAN = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
  [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
const toRoman = (n) => ROMAN.reduce((out, [v, sym]) => { while (n >= v) { out += sym; n -= v; } return out; }, '');

/** KICD 1.1 j: represent Hindu-Arabic numerals using Roman numerals. */
function buildRomanNumerals() {
  return () => {
    // The design's examples stay in the range a Grade 4 child meets on clocks,
    // chapter headings and dates.
    // The hint gives the learner the symbol chart (I, V, X, L, C), because
    // that chart IS the teaching here. So the numbers that ARE a single chart
    // entry — 1, 5, 10, 50, 100 — are never asked: the hint would hand over the
    // whole answer. Every number drawn has to be composed from two or more.
    const CHART = [1, 5, 10, 50, 100];
    const n = pick([...Array(39).keys()].map(i => i + 1)
      .concat([40, 44, 45, 49, 50, 60, 70, 90, 100])
      .filter(v => !CHART.includes(v)));
    const r = toRoman(n);
    if (coin()) {
      return {
        type: 'roman-write', instruction: 'Write the Roman numeral.',
        question: `Write ${n} in Roman numerals.`,
        answer: r, accepts: accepts(r, r.toLowerCase()),
        hints: hintLadder('I is 1, V is 5, X is 10, L is 50, C is 100.',
          'A smaller letter BEFORE a bigger one is taken away from it; after it, it is added on. That is how the fours and the nines are written.'),
        solution: { steps: [{ text: `${n} is written ${r}.`, expr: r }], answer: r },
        misconceptions: [], verify: { kind: 'text', value: r },
      };
    }
    return {
      type: 'roman-read', instruction: 'Write the number.',
      question: `What number is ${r}?`,
      answer: `${n}`, accepts: accepts(`${n}`),
      hints: hintLadder('I is 1, V is 5, X is 10, L is 50, C is 100.',
        'A smaller letter BEFORE a bigger one is taken away from it; after it, it is added on. Read the letters left to right.'),
      solution: { steps: [{ text: `${r} is ${n}.`, expr: `${n}` }], answer: `${n}` },
      misconceptions: [], verify: { kind: 'fraction', value: n },
    };
  };
}

export const LOWER_PRIMARY_CONTENT = {
  // ── Grade 1 ──────────────────────────────────────────────────────────────
  G1_PRENUMBER:      withWorkedExample(buildSimplePattern()),
  // "Counting & Numbers (1-50)" — it asked up to 100, which made it the same
  // skill as G2_COUNTING ("Whole Numbers (to 100)") one grade below it.
  G1_COUNTING:       withWorkedExample(buildCounting({ max: 50 })),
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
  // KICD Grade 2, 1.7: ½ and ¼ as part of a WHOLE shape (folding circles and
  // rectangles). Fraction of a group ("half of 16") is Grade 3.
  G2_FRACTIONS:      withKPs([
                       withWorkedExample(buildHalvesQuarters({ level: 1 })),
                       withWorkedExample(buildHalvesQuarters({ level: 2 })),
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
  // KICD Grade 3, 1.7: ½, ¼ and ⅛ as part of a whole, then of a group.
  // No thirds or fifths in the Grade 3 design (they stay for Cambridge below).
  G3_FRACTIONS:      withKPs([
                       withWorkedExample(buildEighthsOfWhole()),
                       withWorkedExample(buildFractionOfGroup()),
                     ]),
  // KP ladder: profit first, then loss (both in the G3 design).
  G3_MONEY:          withKPs([
                       withWorkedExample(buildBandedMoney({ maxAmount: 500, kind: 'profit' })),
                       withWorkedExample(buildBandedMoney({ maxAmount: 500, kind: 'loss' })),
                     ]),
  G3_LENGTH:         withWorkedExample(buildUnitConvert({ pairs: [['metres', 'centimetres', 100]] })),
  G3_MASS:           withWorkedExample(buildMeasureCompare({ unit: 'kg', thing: 'box', maxOperand: 999 })),
  G3_CAPACITY:       withWorkedExample(buildMeasureCompare({ unit: 'litres', thing: 'tank', maxOperand: 999 })),
  // KICD Grade 3, 3.1: walk straight, then turn left or right. Walking up the
  // page first (her right is our right), then down towards us.
  G3_POSITION:       withKPs([
                       withWorkedExample(buildLeftRight({ level: 1 })),
                       withWorkedExample(buildLeftRight({ level: 2 })),
                     ]),
  G3_SHAPES:         withWorkedExample(buildShapeProperties({ shapes: [['triangle', 3], ['square', 4], ['rectangle', 4], ['pentagon', 5], ['hexagon', 6], ['octagon', 8]] })),

  // ── Grade 4 ──────────────────────────────────────────────────────────────
  G4_PLACE_VALUE:    withWorkedExample(buildBandedPlaceValue({ digits: 4 })),
  G4_NUMBER_WORDS:   withWorkedExample(buildNumberWords()),
  G4_ORDER_ROUND:    withWorkedExample(buildOrderRound()),
  G4_FACTORS_MULTIPLES: withWorkedExample(buildFactorsMultiples()),
  G4_ODD_EVEN:       withWorkedExample(buildOddEven()),
  G4_ROMAN_NUMERALS: withWorkedExample(buildRomanNumerals()),
  G5_ROUNDING:       withWorkedExample(buildRoundHundredThousand()),
  // KP ladder: 4-digit sums without regrouping, then with, up to 10,000.
  G4_ADD:            withKPs([
                       withWorkedExample(buildBandedAdd({ maxTotal: 10000, digitsA: 4, digitsB: 3, regroup: false })),
                       withWorkedExample(buildBandedAdd({ maxTotal: 10000, digitsA: 4, digitsB: 4, regroup: true })),
                     ]),
  G4_SUB:            withKPs([
                       withWorkedExample(buildBandedSub({ maxOperand: 9999, digitsA: 4, digitsB: 3, borrow: false })),
                       withWorkedExample(buildBandedSub({ maxOperand: 9999, digitsA: 4, digitsB: 4, borrow: true })),
                     ]),
  // KICD Grade 4, 1.4 (verified against the design, p.9): (a) 2-digit by
  // multiples of 10, (b) 2-digit by 2-digit with and without regrouping.
  // The ladder used to stop at a ONE-digit multiplier, so outcome (b) — the
  // two-partial-product method — was never practised at Grade 4 at all.
  G4_MULTIPLY:       withKPs([
                       withWorkedExample(buildTwoByOneMul({ minA: 12, maxA: 19, maxB: 5 })),
                       withWorkedExample(buildTwoByOneMul({ minA: 12, maxA: 99, maxB: 9 })),
                       withWorkedExample(buildTwoByOneMul({ minA: 12, maxA: 99, maxB: 9, tensOnly: true })),
                       withWorkedExample(buildTwoByTwoMul({ minA: 12, maxA: 49, minB: 12, maxB: 29 })),
                     ]),
  // KICD Grade 4, 1.5a (design p.10): "divide up to a two-digit number by a
  // one-digit number WITH and without remainder". Every Grade 4 division
  // divided exactly, so remainders were never met; the long-division rungs
  // (3-digit dividends) stay on as the stretch above the design.
  G4_DIVIDE:         withKPs([
                       withWorkedExample(buildLongDiv({ minQ: 11, maxQ: 30 })),
                       withWorkedExample(buildDivWithRemainder({ minTotal: 13, maxTotal: 99 })),
                       withWorkedExample(buildLongDiv({ minQ: 31, maxQ: 99 })),
                     ]),
  G4_LETTERS:        withWorkedExample(buildUseOfLetters()),
  // KICD Grade 4, 1.6: equivalent fractions, then comparing. The alias to
  // G5_FRACTIONS_EQUIV gave only the "fill in the blank" half of the label.
  G4_FRACTIONS:      withKPs([
                       withWorkedExample(buildEquivalentFraction({ maxDen: 8 })),
                       withWorkedExample(buildEquivalentFraction({ maxDen: 10, divideToo: true })),
                       withWorkedExample(buildCompareFractions({ unlike: false })),
                       withWorkedExample(buildCompareFractions({ unlike: true })),
                     ]),
  // KICD Grade 4, 1.7: tenths first, then hundredths, with place value.
  G4_DECIMALS:       withKPs([
                       withWorkedExample(buildDecimalsIntro({ hundredths: false })),
                       withWorkedExample(buildDecimalsIntro({ hundredths: true })),
                     ]),
  G4_LENGTH:         withWorkedExample(buildUnitConvert({ pairs: [['kilometres', 'metres', 1000], ['metres', 'centimetres', 100]] })),
  // KICD Grade 4, 2.5: a.m./p.m. first, then duration across the hour.
  G4_TIME:           withKPs([
                       withWorkedExample(buildAmPmDuration({ withDuration: false })),
                       withWorkedExample(buildAmPmDuration({ withDuration: true })),
                     ]),
  // KICD Grade 4, 2.5 Mass: choose the unit, then convert. Grade 5 takes this
  // on to multi-step word problems in mixed units.
  G4_MASS:           withKPs([
                       withWorkedExample(buildUnitChoice({ pairs: [
                         ['grams', 'kilograms', [
                           ['a sweet', 'small'], ['a bag of cement', 'big'], ['a pencil', 'small'],
                           ['a sack of maize', 'big'], ['a letter', 'small'], ['a cow', 'big'],
                           ['a spoonful of salt', 'small'], ['a motorbike', 'big'],
                         ]],
                       ] })),
                       withWorkedExample(buildUnitConvert({ pairs: [['kilograms', 'grams', 1000]] })),
                     ]),
  // KICD Grade 4, 2.4 Capacity — its own six-lesson sub-strand in the design,
  // which had no skill behind it at all. It used to ride along inside
  // G4_MASS's title while the tag said Mass, so nothing counted it.
  G4_CAPACITY:       withKPs([
                       withWorkedExample(buildUnitChoice({ pairs: [
                         ['millilitres', 'litres', [
                           ['a spoonful of cough syrup', 'small'], ['a jerrican of water', 'big'],
                           ['the ink in a pen', 'small'], ['a water tank', 'big'],
                           ['a dose of medicine', 'small'], ['a drum of paraffin', 'big'],
                           ['a teaspoon of vanilla', 'small'], ['a lorry fuel tank', 'big'],
                         ]],
                       ] })),
                       withWorkedExample(buildUnitConvert({ pairs: [['litres', 'millilitres', 1000]] })),
                     ]),

  G4_AREA:           withWorkedExample(buildSmallArea()),
  G4_VOLUME:         withWorkedExample(buildSmallVolume()),
  G4_MONEY:          withWorkedExample(buildBandedMoney({ maxAmount: 5000, kind: 'budget' })),
  // KICD Grade 4, 3.1: clockwise and anticlockwise; quarter, half and full
  // turns. No compass points and no three-quarter turns (not in the design).
  G4_POSITION:       withKPs([
                       withWorkedExample(buildTurnDirection()),
                       withWorkedExample(buildTurnAmount()),
                       withWorkedExample(buildTurnPractice()),
                     ]),

  // ── Cambridge only (mapped in cambridgeContent.js) ──────────────────────
  // The earlier Grade 3 fractions (thirds, fifths, tenths of a set) and the
  // compass turns: Cambridge content, not in the KICD Grade 2-6 designs.
  CAM_FRACTIONS_SET: withKPs([
                       withWorkedExample(buildFractionOfSet({ denominators: [2, 4], maxResult: 10 })),
                       withWorkedExample(buildFractionOfSet({ denominators: [3, 5], maxResult: 10 })),
                       withWorkedExample(buildFractionOfSet({ denominators: [10], maxResult: 10 })),
                     ]),
  CAM_TURNS_COMPASS: withWorkedExample(buildTurnsAndCompass({ withCompass: true })),
  // KICD Grade 4, 5.1: read a table, total it, compare two bars. Grade 5 then
  // adds a scale to the axis, which is where the real difficulty sits.
  G4_DATA:           withWorkedExample(buildTablesAndBars()),
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
