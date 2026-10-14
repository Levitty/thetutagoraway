// ============================================================================
// GRADE 5 CONTENT — authored to the difficulty the skill names actually claim.
//
// Why this file exists: Grade 5 arithmetic used to be wired to the generic
// small builders in numbers.js. "Multiplication (3-digit × 2-digit)" generated
// `44 × 5`; "Division (3-digit by 2-digit)" generated `80 ÷ 8` — easier than
// Grade 4's own `477 ÷ 9`. A learner answered trivial questions, was credited
// with the Grade 5 skill, and was placed too high. Every arithmetic builder
// here therefore carries a `band` descriptor (op + the operands actually
// rendered), and tests/difficulty.test.mjs holds it to the name's promise and
// to being harder than the grade below.
//
// Contexts are Kenyan — shillings, matatus, maize, water tanks, harambees —
// matching the existing lower-primary content. Text only: `model` renders
// nothing on this branch.
// ============================================================================

import {
  accepts, hintLadder, randInt, pick, coin,
  withWorkedExample, withKPs, columnSteps, columnOpModel,
} from './schema.js';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const needsCarry = (a, b) => { while (a > 0 && b > 0) { if (a % 10 + b % 10 >= 10) return true; a = Math.floor(a / 10); b = Math.floor(b / 10); } return false; };
const needsBorrow = (a, b) => { while (b > 0) { if (b % 10 > a % 10) return true; a = Math.floor(a / 10); b = Math.floor(b / 10); } return false; };
const randDigits = (d) => d <= 1 ? randInt(2, 9) : randInt(Math.pow(10, d - 1), Math.pow(10, d) - 1);

// The classic column error: every column worked on its own, so carries are
// dropped and borrows become "big digit minus small digit".
const digitwiseWrong = (a, b, sub) => {
  const da = String(a).split('').reverse().map(Number);
  const db = String(b).split('').reverse().map(Number);
  const n = Math.max(da.length, db.length);
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = da[i] || 0, y = db[i] || 0;
    out = String(sub ? Math.abs(x - y) : x + y) + out;
  }
  return String(Number(out));
};

// ---------------------------------------------------------------------------
// Addition & subtraction to six digits (KICD Grade 5, Numbers 1.2 / 1.3)
// ---------------------------------------------------------------------------

const ADD_STORIES = [
  (a, b) => `A maize cooperative sold ${a} kg of maize in June and ${b} kg in July. How many kilogrammes is that altogether?`,
  (a, b) => `A harambee for a school bus raised Ksh ${a} on Saturday and Ksh ${b} on Sunday. How much was raised in total?`,
  (a, b) => `A matatu sacco carried ${a} passengers last month and ${b} passengers this month. How many passengers in the two months?`,
  (a, b) => `A county planted ${a} tree seedlings in the dry season and ${b} in the wet season. How many seedlings were planted in all?`,
];

const SUB_STORIES = [
  (a, b) => `A water tank holds ${a} litres. ${b} litres are drawn off to irrigate the kitchen garden. How many litres are left?`,
  (a, b) => `A shopkeeper banked Ksh ${a} and later withdrew Ksh ${b}. How many shillings are still in the account?`,
  (a, b) => `A warehouse held ${a} bags of cement and ${b} bags were taken to a site. How many bags remain?`,
  (a, b) => `A dam held ${a} cubic metres of water. After the dry spell ${b} cubic metres had been used. How much water is left?`,
];

/** Column addition/subtraction for the five- and six-digit Grade 5 band.
 *  `regroup` targets the knowledge point: true = must carry/borrow, false = must not. */
function buildWideColumnAddSub({ digitsA, digitsB, sub = false, regroup = null, story = 0.35 }) {
  return () => {
    let a, b;
    for (let i = 0; ; i++) {
      a = randDigits(digitsA);
      b = randDigits(digitsB);
      if (sub && b >= a) { if (i > 400) { b = Math.max(1, a - randInt(1, 9)); } else continue; }
      const regroups = sub ? needsBorrow(a, b) : needsCarry(a, b);
      if (regroup === null || regroups === regroup || i > 400) break;
    }
    const value = sub ? a - b : a + b;
    const asStory = Math.random() < story;
    const question = asStory
      ? pick(sub ? SUB_STORIES : ADD_STORIES)(a, b)
      : `${a} ${sub ? '−' : '+'} ${b} = ?`;
    const wrong = digitwiseWrong(a, b, sub);
    return {
      type: sub ? 'g5-column-sub' : 'g5-column-add',
      instruction: `Use column ${sub ? 'subtraction' : 'addition'} — start from the ones.`,
      question, answer: `${value}`, accepts: accepts(`${value}`),
      model: columnOpModel(a, b, sub),
      hints: hintLadder(
        'Line the digits up by place value — ones under ones, tens under tens, and so on up to the highest column.',
        'Work one column at a time, starting from the ones on the right.',
        sub ? 'If the digit on top is smaller than the one below it, borrow a ten from the column to its left.'
            : 'When a column makes ten or more, write down the ones digit and carry the one into the next column.'),
      solution: {
        steps: [
          ...columnSteps(a, b, sub),
          { text: 'Read the answer off the bottom row.', expr: `${value}`,
            model: columnOpModel(a, b, sub, { showResult: true }) },
        ],
        answer: `${value}`,
      },
      misconceptions: [
        ...(wrong !== `${value}` ? [{ when: wrong, feedback: sub
          ? 'Each column was worked on its own. When the top digit is smaller you must BORROW a ten from the column on the left, not swap the two digits round.'
          : 'The carries were dropped. When a column makes ten or more, only the ones digit stays — the one moves to the next column.' }] : []),
        { when: `${sub ? a + b : Math.abs(a - b)}`, feedback: sub
          ? 'That is the total of the two numbers. This question asks what is LEFT, so subtract.'
          : 'That is the difference between the two numbers. This question asks for the TOTAL, so add.' },
      ],
      band: { op: sub ? 'sub' : 'add', a, b },
      verify: { kind: 'fraction', value },
    };
  };
}

// ---------------------------------------------------------------------------
// Multiplication: up to 3-digit × 2-digit (KICD Grade 5, Numbers 1.4)
// ---------------------------------------------------------------------------

const MUL_STORIES = [
  (a, b) => `A school buys ${b} desks costing Ksh ${a} each. What is the total cost in shillings?`,
  (a, b) => `A matatu carries ${a} passengers in a day. How many passengers does it carry in ${b} days?`,
  (a, b) => `One sack of maize weighs ${a} kg. What is the mass of ${b} sacks in kilogrammes?`,
  (a, b) => `A water vendor sells ${a} litres a day. How many litres does he sell in ${b} days?`,
];

/** Long multiplication. A 2-digit multiplier splits into tens and ones; a
 *  1-digit multiplier splits the multiplicand into hundreds, tens and ones. */
function buildLongMul({ minA, maxA, twoDigitB, minB = null, maxB = null, story = 0.3 }) {
  // The multiplier's range depends on which path we are on, so the defaults
  // cannot be shared: a two-digit multiplier defaulting to 3–9 can never
  // satisfy the two-digit filter below, and the loop would never end.
  const lo = minB ?? (twoDigitB ? 12 : 3);
  const hi = maxB ?? (twoDigitB ? 99 : 9);
  return () => {
    const a = randInt(minA, maxA);
    let b;
    if (twoDigitB) {
      // A multiplier of 20, 30… hides the ones step, and ×11, ×21 makes it
      // trivial; keep both digits doing real work.
      do { b = randInt(lo, hi); } while (b % 10 < 2 || b < 10);
    } else {
      b = randInt(lo, hi);
    }
    const value = a * b;
    const asStory = Math.random() < story;
    const question = asStory ? pick(MUL_STORIES)(a, b) : `${a} × ${b} = ?`;

    if (twoDigitB) {
      const bT = Math.floor(b / 10) * 10, bO = b % 10;
      return {
        type: 'g5-long-mul', instruction: 'Use long multiplication.',
        question, answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(
          'Split the two-digit number into its tens and its ones, and multiply by each part separately.',
          `That means working out ${a} × ${bO} and ${a} × ${bT}.`,
          'Add the two partial products, keeping each one lined up in its own place-value columns.'),
        solution: { steps: [
          { text: `Split ${b} into tens and ones.`, expr: `${bT} + ${bO}` },
          { text: 'Multiply by the ones.', expr: `${a} × ${bO} = ${a * bO}` },
          { text: 'Multiply by the tens.', expr: `${a} × ${bT} = ${a * bT}` },
          { text: 'Add the two partial products.', expr: `${a * bO} + ${a * bT} = ${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${a * bO + a * (bT / 10)}`, feedback: `The tens row was multiplied as ${bT / 10} instead of ${bT} — its answer must be shifted one column to the left (or written with a zero in the ones place).` },
          { when: `${a * bO}`, feedback: 'That is only the ones part of the multiplier. The tens part still has to be multiplied and added on.' },
          { when: `${a + b}`, feedback: 'That is adding the two numbers. This question asks for the product.' },
        ],
        band: { op: 'mul', a, b },
        verify: { kind: 'fraction', value },
      };
    }

    const h = Math.floor(a / 100) * 100, t = Math.floor((a % 100) / 10) * 10, o = a % 10;
    return {
      type: 'g5-long-mul', instruction: 'Use long multiplication.',
      question, answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        'Split the three-digit number into hundreds, tens and ones.',
        `That means working out ${h} × ${b}, ${t} × ${b} and ${o} × ${b}.`,
        'Add the three partial products together.'),
      solution: { steps: [
        { text: `Split ${a} by place value.`, expr: `${h} + ${t} + ${o}` },
        { text: 'Multiply each part.', expr: `${h * b} + ${t * b} + ${o * b}` },
        { text: 'Add the partial products.', expr: `${value}` },
      ], answer: `${value}` },
      misconceptions: [
        { when: `${h * b + o * b}`, feedback: 'The tens were left out. All three parts — hundreds, tens and ones — have to be multiplied.' },
        { when: `${a + b}`, feedback: 'That is adding the two numbers. This question asks for the product.' },
      ],
      band: { op: 'mul', a, b },
      verify: { kind: 'fraction', value },
    };
  };
}

// ---------------------------------------------------------------------------
// Division: 3-digit by 2-digit (KICD Grade 5, Numbers 1.5)
// ---------------------------------------------------------------------------

const DIV_STORIES = [
  (t, d) => `Ksh ${t} is shared equally among ${d} pupils. How many shillings does each pupil get?`,
  (t, d) => `${t} kg of beans is packed into ${d} equal sacks. How many kilogrammes go into each sack?`,
  (t, d) => `A matatu owner shares ${t} shillings of fare equally over ${d} trips. How much per trip?`,
  (t, d) => `${t} seedlings are planted in ${d} equal rows. How many seedlings are in each row?`,
];

/** Long division of a 3-digit dividend by a 2-digit divisor, exact. */
// `totalMin`/`totalMax` bound the dividend: 3-digit by default (Grade 5); the
// Grade 6 design asks for "up to a 4-digit number by up to a 3-digit number".
function buildTwoDigitDiv({ dMin, dMax, qMin, qMax, story = 0.3, totalMin = 100, totalMax = 999 }) {
  return () => {
    let d, q, total;
    for (let i = 0; ; i++) {
      d = randInt(dMin, dMax);
      q = randInt(qMin, qMax);
      total = d * q;
      if ((total >= totalMin && total <= totalMax && q !== d) || i > 400) break;
    }
    const asStory = Math.random() < story;
    const question = asStory ? pick(DIV_STORIES)(total, d) : `${total} ÷ ${d} = ?`;
    // The long-division walkthrough: the first two digits, then bring one down.
    const front = Math.floor(total / 10), last = total % 10;
    const q1 = Math.floor(front / d), rem1 = front - d * q1;
    const brought = rem1 * 10 + last, q0 = Math.floor(brought / d);
    return {
      type: 'g5-long-div', instruction: 'Use long division.',
      question, answer: `${q}`, accepts: accepts(`${q}`),
      hints: hintLadder(
        'Set it out as long division and start at the LEFT of the big number, not the right.',
        `A two-digit divisor is hard to judge by eye — round ${d} to the nearest ten to estimate how many times it fits, then adjust.`,
        'Multiply your estimate by the divisor, subtract, bring the next digit down, and repeat.'),
      solution: { steps: [
        { text: `Take the first two digits: how many ${d}s fit into ${front}?`, expr: `${d} × ${q1} = ${d * q1}, remainder ${rem1}` },
        { text: `Bring the last digit down to make ${brought}.`, expr: `${d} × ${q0} = ${d * q0}` },
        { text: 'Read the quotient off the top line.', expr: `${q}` },
      ], answer: `${q}` },
      misconceptions: [
        { when: `${q1}`, feedback: 'That is only the first digit of the quotient. After bringing the last digit down there is another digit still to find.' },
        { when: `${total - d}`, feedback: 'Division is not subtraction — it asks how many whole lots of the divisor fit into the number.' },
      ],
      band: { op: 'div', a: total, b: d, q },
      verify: { kind: 'fraction', value: q },
    };
  };
}

/** Division with a remainder — the Grade 5 "how many are left over" question. */
function buildTwoDigitDivRemainder({ dMin, dMax, qMin, qMax }) {
  return () => {
    let d, q, r, total;
    for (let i = 0; ; i++) {
      d = randInt(dMin, dMax);
      q = randInt(qMin, qMax);
      r = randInt(1, d - 1);
      total = d * q + r;
      if ((total >= 100 && total <= 999) || i > 400) break;
    }
    const spec = pick([
      { q: `${total} eggs are packed into trays holding ${d} eggs each. How many eggs are left over?`, unit: 'eggs' },
      { q: `${total} exercise books are tied into bundles of ${d}. How many books are left over?`, unit: 'books' },
      { q: `${total} mangoes are packed into crates of ${d}. How many mangoes remain unpacked?`, unit: 'mangoes' },
      { q: `${total} ÷ ${d} — what is the remainder?`, unit: '' },
    ]);
    return {
      type: 'g5-long-div-rem', instruction: 'Divide and give the remainder.',
      question: spec.q, answer: `${r}`, accepts: accepts(`${r}`),
      hints: hintLadder(
        'Work out how many WHOLE groups can be filled first.',
        'A remainder is what is still in your hand once no further whole group can be made.',
        'So it must be smaller than the number in one group — if it is not, another whole group still fits.'),
      solution: { steps: [
        { text: 'Divide to find the whole groups.', expr: `${total} ÷ ${d} = ${q} remainder ${r}` },
        { text: 'Check it.', expr: `${d} × ${q} = ${d * q}, and ${total} − ${d * q} = ${r}` },
      ], answer: `${r}` },
      misconceptions: [
        { when: `${q}`, feedback: 'That is the number of whole groups. The question asks how many are LEFT OVER after those groups are filled.' },
        { when: `${d - r}`, feedback: 'That is how many more would be needed to fill one more group, not how many are left over.' },
      ],
      band: { op: 'div', a: total, b: d, q },
      verify: { kind: 'fraction', value: r },
    };
  };
}

// ---------------------------------------------------------------------------
// Factors, multiples, divisibility, LCM & HCF (KICD Grade 5, Numbers 1.1)
// ---------------------------------------------------------------------------

const factorsOf = (n) => {
  const out = [];
  for (let i = 1; i <= n; i++) if (n % i === 0) out.push(i);
  return out;
};
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

function buildFactors({ max = 60 }) {
  return () => {
    const n = randInt(12, max);
    const fs = factorsOf(n);
    const mode = pick(['count', 'pair', 'largest-proper', 'odd-one-out']);

    if (mode === 'count') {
      const value = fs.length;
      return {
        type: 'factors-count', instruction: 'Count the factors.',
        question: `How many factors does ${n} have altogether?`,
        answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(
          'A factor divides into the number leaving nothing over.',
          'Work upwards from 1 and test each number in turn — every one that divides exactly is a factor.',
          'Factors come in pairs that multiply to give the number, so each one found names its partner too. Remember 1 and the number itself.'),
        solution: { steps: [
          { text: `Test each number from 1 upwards.`, expr: fs.join(', ') },
          { text: 'Count them.', expr: `${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${fs.length - 2}`, feedback: 'Both 1 and the number itself are factors of every number — they must be counted too.' },
        ],
        verify: { kind: 'fraction', value },
      };
    }

    if (mode === 'pair') {
      const inner = fs.filter(f => f !== 1 && f !== n);
      if (!inner.length) return buildFactors({ max })();
      const f = pick(inner), value = n / f;
      return {
        type: 'factors-pair', instruction: 'Find the matching factor.',
        question: `${f} is a factor of ${n}. What is the factor that multiplies with it to give ${n}?`,
        answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(
          'Factors come in pairs that multiply to give the number.',
          `So one of the pair is ${f}, and the pair must multiply to ${n}.`,
          `Finding the partner means dividing ${n} by ${f}.`),
        solution: { steps: [
          { text: 'The pair multiplies to the number.', expr: `${f} × ? = ${n}` },
          { text: 'So divide.', expr: `${n} ÷ ${f} = ${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${n - f}`, feedback: 'A factor PAIR multiplies to the number, so the partner is found by dividing, not by subtracting.' },
        ],
        verify: { kind: 'fraction', value },
      };
    }

    if (mode === 'largest-proper') {
      const value = fs[fs.length - 2];
      if (value === 1) return buildFactors({ max })();
      return {
        type: 'factors-largest', instruction: 'Find the largest factor below the number itself.',
        question: `What is the largest factor of ${n}, not counting ${n} itself?`,
        answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(
          'Every number is a factor of itself, but that one is ruled out here.',
          'The largest factor below the number is the partner of the SMALLEST factor above 1.',
          `So find the smallest number above 1 that divides ${n} exactly, then divide.`),
        solution: { steps: [
          { text: `Smallest factor above 1.`, expr: `${n / value}` },
          { text: 'Its partner is the largest factor below the number.', expr: `${n} ÷ ${n / value} = ${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${n}`, feedback: `${n} is a factor of itself, but the question rules it out.` },
        ],
        verify: { kind: 'fraction', value },
      };
    }

    // Which of these four numbers is NOT a factor?
    const inner = fs.filter(f => f !== 1);
    const shown = [];
    while (shown.length < 3 && inner.length) shown.push(inner.splice(randInt(0, inner.length - 1), 1)[0]);
    let value = 0;
    for (let t = 2; t < n; t++) if (n % t !== 0 && !shown.includes(t)) { value = t; break; }
    if (!value || shown.length < 3) return buildFactors({ max })();
    const list = [...shown, value].sort((a, b) => a - b);
    return {
      type: 'factors-odd-one-out', instruction: 'Find the number that is not a factor.',
      question: `Three of these are factors of ${n} and one is not: ${list.join(', ')}. Which one is NOT a factor of ${n}?`,
      answer: `${value}`, accepts: accepts(`${value}`), choices: list.map(String),
      hints: hintLadder(
        'A factor divides the number leaving nothing over.',
        `Divide ${n} by each one in turn and watch for a remainder.`,
        'The one that leaves something over is the odd one out.'),
      solution: { steps: [
        { text: `Divide ${n} by each.`, expr: list.map(x => `${n} ÷ ${x}`).join(',  ') },
        { text: 'One of them leaves a remainder.', expr: `${value}` },
      ], answer: `${value}` },
      misconceptions: [
        { when: `${list[0]}`, feedback: `Check by dividing: ${n} ÷ ${list[0]} — if nothing is left over, it IS a factor.` },
      ],
      verify: { kind: 'fraction', value },
    };
  };
}

function buildMultiples({ maxBase = 12 }) {
  return () => {
    const base = randInt(3, maxBase);
    const mode = pick(['nth', 'between', 'first-above', 'odd-one-out']);

    if (mode === 'nth') {
      const k = randInt(4, 12);
      const value = base * k;
      return {
        type: 'multiples-nth', instruction: 'Find the multiple.',
        question: `What is the ${k}th multiple of ${base}?`,
        answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(
          'The multiples of a number are what you land on counting up in steps of that size.',
          `The first multiple of ${base} is ${base} itself, the second is two steps, and so on.`,
          `So the ${k}th one is ${k} steps of ${base} — that is ${k} × ${base}.`),
        solution: { steps: [
          { text: `The ${k}th multiple means ${k} lots of ${base}.`, expr: `${k} × ${base}` },
          { text: 'Work it out.', expr: `${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${base * (k - 1)}`, feedback: `The FIRST multiple of ${base} is ${base} itself, not ${base} × 2 — so counting starts one step earlier than it looks.` },
          { when: `${base + k}`, feedback: 'Multiples are made by multiplying, not adding.' },
        ],
        verify: { kind: 'fraction', value },
      };
    }

    if (mode === 'between') {
      const k = randInt(5, 14);
      const value = base * k;
      const lo = value - randInt(1, Math.max(1, base - 1));
      const hi = lo + base;        // exactly one multiple of `base` sits inside
      if (lo <= 0 || Math.floor(hi / base) * base !== value) return buildMultiples({ maxBase })();
      return {
        type: 'multiples-between', instruction: 'Find the multiple in the range.',
        question: `Write the multiple of ${base} that lies between ${lo} and ${hi}.`,
        answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(
          `Count up in steps of ${base} and watch for the step that falls inside the range.`,
          `Dividing ${lo} by ${base} shows roughly how many steps have been taken already.`,
          'Only one step of that size can land between two numbers this close together.'),
        solution: { steps: [
          { text: `How many ${base}s fit into ${lo}?`, expr: `${lo} ÷ ${base} ≈ ${k - 1}` },
          { text: 'Take one more step.', expr: `${k} × ${base} = ${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${value - base}`, feedback: 'That multiple falls below the range — take one more step.' },
        ],
        verify: { kind: 'fraction', value },
      };
    }

    if (mode === 'first-above') {
      const target = randInt(30, 150);
      const value = Math.ceil((target + 1) / base) * base;
      return {
        type: 'multiples-above', instruction: 'Find the first multiple past the number.',
        question: `What is the smallest multiple of ${base} that is greater than ${target}?`,
        answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(
          `Count up in steps of ${base} until the number is passed.`,
          `Dividing ${target} by ${base} shows how many whole steps fit inside it.`,
          'The answer is the very next step after those whole ones.'),
        solution: { steps: [
          { text: `How many whole ${base}s fit into ${target}?`, expr: `${target} ÷ ${base} = ${Math.floor(target / base)} remainder ${target % base}` },
          { text: 'Take the next step up.', expr: `${value / base} × ${base} = ${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${value - base}`, feedback: `That one is not greater than ${target} — the question asks for the first multiple PAST it.` },
        ],
        verify: { kind: 'fraction', value },
      };
    }

    const k = randInt(3, 9);
    const good = [base * k, base * (k + 1), base * (k + 3)];
    const value = base * (k + 2) + randInt(1, base - 1);
    if (good.includes(value)) return buildMultiples({ maxBase })();
    const list = [...good, value].sort((a, b) => a - b);
    return {
      type: 'multiples-odd-one-out', instruction: 'Find the number that is not a multiple.',
      question: `Three of these are multiples of ${base} and one is not: ${list.join(', ')}. Which one is NOT a multiple of ${base}?`,
      answer: `${value}`, accepts: accepts(`${value}`), choices: list.map(String),
      hints: hintLadder(
        `A multiple of ${base} can be divided by ${base} leaving nothing over.`,
        `Divide each one by ${base} in turn.`,
        'The one that leaves a remainder is the odd one out.'),
      solution: { steps: [
        { text: `Divide each by ${base}.`, expr: list.map(x => `${x} ÷ ${base}`).join(',  ') },
        { text: 'One leaves a remainder.', expr: `${value}` },
      ], answer: `${value}` },
      misconceptions: [
        { when: `${list[0]}`, feedback: `Check it: divide ${list[0]} by ${base} and see whether anything is left over.` },
      ],
      verify: { kind: 'fraction', value },
    };
  };
}

function buildDivisibility2510() {
  return () => {
    const rule = pick([2, 5, 10]);
    const mode = pick(['which-of', 'count', 'missing-digit', 'last-digit']);

    if (mode === 'last-digit') {
      const spec = rule === 10
        ? { q: 'What must the last digit of a number be for it to be divisible by 10?', value: 0 }
        : rule === 5
          ? { q: 'A number is divisible by 5 and does not end in 0. What must its last digit be?', value: 5 }
          : { q: 'A number is divisible by 2. Which of these could be its last digit: 3, 5, 6 or 9?', value: 6 };
      return {
        type: 'divisibility-rule', instruction: 'Use the last-digit rule.',
        question: spec.q, answer: `${spec.value}`, accepts: accepts(`${spec.value}`),
        hints: hintLadder(
          'The tests for 2, 5 and 10 only ever look at the LAST digit — the rest of the number does not matter.',
          'Even numbers end in 0, 2, 4, 6 or 8; multiples of 5 end in 0 or 5; multiples of 10 end in 0.',
          'Work out which of those endings the question is pointing at.'),
        solution: { steps: [
          { text: 'Only the last digit matters for 2, 5 and 10.' },
          { text: 'Apply the ending rule.', expr: `${spec.value}` },
        ], answer: `${spec.value}` },
        misconceptions: [],
        verify: { kind: 'fraction', value: spec.value },
      };
    }

    if (mode === 'which-of') {
      const value = randInt(11, 99) * rule;
      const others = [];
      while (others.length < 3) {
        const c = randInt(100, 999);
        if (c % rule !== 0 && !others.includes(c) && c !== value) others.push(c);
      }
      const list = [value, ...others].sort((a, b) => a - b);
      return {
        type: 'divisibility-which', instruction: 'Apply the divisibility test.',
        question: `Which one of these is divisible by ${rule}:  ${list.join(',  ')}?`,
        answer: `${value}`, accepts: accepts(`${value}`), choices: list.map(String),
        hints: hintLadder(
          `There is no need to divide — the test for ${rule} only looks at the last digit.`,
          rule === 2 ? 'A number is divisible by 2 when it ends in 0, 2, 4, 6 or 8.'
            : rule === 5 ? 'A number is divisible by 5 when it ends in 0 or in 5.'
            : 'A number is divisible by 10 when it ends in 0.',
          'Check the last digit of each one against that rule.'),
        solution: { steps: [
          { text: `Look at the last digit of each.`, expr: list.map(x => String(x).slice(-1)).join(', ') },
          { text: `Only one of those endings passes the test for ${rule}.`, expr: `${value}` },
        ], answer: `${value}` },
        misconceptions: [],
        verify: { kind: 'fraction', value },
      };
    }

    if (mode === 'count') {
      const list = Array.from({ length: 6 }, () => randInt(20, 400));
      const value = list.filter(x => x % rule === 0).length;
      if (value === 0 || value === 6) return buildDivisibility2510()();
      return {
        type: 'divisibility-count', instruction: 'Apply the divisibility test to each.',
        question: `How many of these are divisible by ${rule}:  ${list.join(',  ')}?`,
        answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(
          `The test for ${rule} looks only at the last digit of each number.`,
          rule === 2 ? 'Numbers divisible by 2 end in 0, 2, 4, 6 or 8.'
            : rule === 5 ? 'Numbers divisible by 5 end in 0 or 5.'
            : 'Numbers divisible by 10 end in 0.',
          'Go along the list once, checking each last digit, and keep a count.'),
        solution: { steps: [
          { text: 'Last digits in order.', expr: list.map(x => String(x).slice(-1)).join(', ') },
          { text: `Count the ones that pass the test for ${rule}.`, expr: `${value}` },
        ], answer: `${value}` },
        misconceptions: [],
        verify: { kind: 'fraction', value },
      };
    }

    const base = randInt(21, 98);
    const want = pick(['smallest', 'largest']);
    const endings = rule === 2 ? [0, 2, 4, 6, 8] : rule === 5 ? [0, 5] : [0];
    const value = want === 'smallest' ? endings[0] : endings[endings.length - 1];
    return {
      type: 'divisibility-digit', instruction: 'Choose the digit that passes the test.',
      question: `Replace the ☐ in ${base}☐ with the ${want} digit that makes the number divisible by ${rule}.`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        `Only the digit in the box decides this — the ${base} in front makes no difference to the test for ${rule}.`,
        rule === 2 ? 'The endings that work for 2 are 0, 2, 4, 6 and 8.'
          : rule === 5 ? 'The endings that work for 5 are 0 and 5.'
          : 'The only ending that works for 10 is 0.',
        `Of those endings, pick the ${want} one.`),
      solution: { steps: [
        { text: `Endings that pass the test for ${rule}.`, expr: endings.join(', ') },
        { text: `Take the ${want}.`, expr: `${value}` },
      ], answer: `${value}` },
      misconceptions: [],
      verify: { kind: 'fraction', value },
    };
  };
}

function buildLcmHcf({ which }) {
  return () => {
    // A coprime pair makes "just multiply them" the right answer every time,
    // which teaches exactly the wrong habit — so insist on a shared factor.
    let a, b;
    for (let i = 0; ; i++) {
      a = randInt(4, 18);
      b = randInt(4, 24);
      if ((b !== a && gcd(a, b) > 1) || i > 200) break;
    }
    const hcf = gcd(a, b), lcm = (a * b) / hcf;

    if (which === 'hcf') {
      if (hcf === 1) return buildLcmHcf({ which })();
      return {
        type: 'hcf', instruction: 'Find the highest common factor.',
        question: `What is the highest common factor (HCF) of ${a} and ${b}?`,
        answer: `${hcf}`, accepts: accepts(`${hcf}`),
        hints: hintLadder(
          'A common factor divides into BOTH numbers leaving nothing over.',
          `Write out the factors of ${a}, then the factors of ${b}, and look for the ones in both lists.`,
          'Of the factors that appear in both lists, the answer is the biggest.'),
        solution: { steps: [
          { text: `Factors of ${a}.`, expr: factorsOf(a).join(', ') },
          { text: `Factors of ${b}.`, expr: factorsOf(b).join(', ') },
          { text: 'The biggest one in both lists.', expr: `${hcf}` },
        ], answer: `${hcf}` },
        misconceptions: [
          { when: `${lcm}`, feedback: 'That is the lowest common MULTIPLE. A common factor divides into both numbers; it cannot be bigger than either of them.' },
          { when: '1', feedback: '1 does divide into both, but it is not the HIGHEST that does — look for a bigger common factor.' },
        ],
        verify: { kind: 'fraction', value: hcf },
      };
    }

    if (which === 'word') {
      let m1, m2;
      for (let i = 0; ; i++) {
        m1 = randInt(4, 12);
        m2 = randInt(4, 15);
        if ((m2 !== m1 && gcd(m1, m2) > 1) || i > 200) break;
      }
      const value = (m1 * m2) / gcd(m1, m2);
      if (value > 120) return buildLcmHcf({ which })();
      const spec = pick([
        `One matatu leaves the stage every ${m1} minutes and another every ${m2} minutes. They have just left together. After how many minutes will they next leave together?`,
        `A posho mill is serviced every ${m1} days and its generator every ${m2} days. Both were serviced today. In how many days will both be serviced on the same day again?`,
        `A bell rings every ${m1} minutes and a siren every ${m2} minutes. They have just sounded together. After how many minutes do they sound together again?`,
      ]);
      return {
        type: 'lcm-word', instruction: 'Work out when they meet again.',
        question: spec, answer: `${value}`, accepts: accepts(`${value}`, `${value} minutes`, `${value} days`),
        hints: hintLadder(
          'Each one happens on its own multiples, so they meet on a time that is a multiple of BOTH.',
          `Count up in ${m1}s, and separately in ${m2}s, and look for the first time that appears in both counts.`,
          'The first time in both counts is the lowest common multiple of the two numbers.'),
        solution: { steps: [
          { text: `Multiples of ${m1}.`, expr: Array.from({ length: 6 }, (_, i) => m1 * (i + 1)).join(', ') + '…' },
          { text: `Multiples of ${m2}.`, expr: Array.from({ length: 6 }, (_, i) => m2 * (i + 1)).join(', ') + '…' },
          { text: 'The first one in both lists.', expr: `${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${m1 * m2}`, feedback: 'Multiplying the two always gives a time when both happen, but not always the FIRST one — check for an earlier common multiple.' },
          { when: `${m1 + m2}`, feedback: 'Adding the two gaps does not give a time that is a multiple of either.' },
        ],
        verify: { kind: 'fraction', value },
      };
    }

    if (lcm > 120) return buildLcmHcf({ which })();
    return {
      type: 'lcm', instruction: 'Find the lowest common multiple.',
      question: `What is the lowest common multiple (LCM) of ${a} and ${b}?`,
      answer: `${lcm}`, accepts: accepts(`${lcm}`),
      hints: hintLadder(
        'A common multiple is a number that BOTH numbers divide into exactly.',
        `Count up in ${a}s and check each one to see whether ${b} divides into it too.`,
        'The first one that works is the lowest common multiple — stop there, do not keep going.'),
      solution: { steps: [
        { text: `Count up in ${a}s.`, expr: Array.from({ length: 6 }, (_, i) => a * (i + 1)).join(', ') + '…' },
        { text: `Find the first that ${b} also divides into.`, expr: `${lcm}` },
      ], answer: `${lcm}` },
      misconceptions: [
        { when: `${a * b}`, feedback: 'Multiplying the two always gives A common multiple, but not always the LOWEST one.' },
        { when: `${hcf}`, feedback: 'That is the highest common FACTOR. A common multiple is at least as big as the bigger of the two numbers.' },
      ],
      verify: { kind: 'fraction', value: lcm },
    };
  };
}

// ---------------------------------------------------------------------------
// Simple equations with one unknown (KICD Grade 5, Numbers 1.9)
// ---------------------------------------------------------------------------

/** Whole numbers only, and the answer is always positive: the alias to
 *  G6_SIMPLE_EQUATIONS served a Grade 5 learner things like x − 10 = −13. */
function buildOneStepEquation({ ops }) {
  return () => {
    const letter = pick(['x', 'n', 'a', 'k']);
    const op = pick(ops);
    const x = randInt(2, 20);

    if (op === 'add') {
      const b = randInt(2, 25), c = x + b;
      return {
        type: 'g5-equation', instruction: 'Find the value of the letter.',
        question: `Solve:   ${letter} + ${b} = ${c}`,
        answer: `${letter} = ${x}`, accepts: accepts(`${letter}=${x}`, `${letter} = ${x}`, `${x}`),
        hints: hintLadder(
          `The aim is to leave ${letter} alone on one side.`,
          `Something is being ADDED to ${letter}, so undo it by taking the same amount off BOTH sides.`,
          `Take ${b} off each side and see what is left.`),
        solution: { steps: [
          { text: `Take ${b} off both sides.`, expr: `${letter} = ${c} − ${b}` },
          { text: 'Work out the right-hand side.', expr: `${letter} = ${x}` },
        ], answer: `${letter} = ${x}` },
        misconceptions: [
          { when: `${c + b}`, feedback: `${b} was added again. To undo an addition you SUBTRACT the same amount from both sides.` },
        ],
        verify: { kind: 'equation', solution: x, residual: (t) => (t + b) - c },
      };
    }

    if (op === 'sub') {
      const b = randInt(2, 15), c = x;          // letter − b = c, so letter = c + b
      return {
        type: 'g5-equation', instruction: 'Find the value of the letter.',
        question: `Solve:   ${letter} − ${b} = ${c}`,
        answer: `${letter} = ${x + b}`, accepts: accepts(`${letter}=${x + b}`, `${letter} = ${x + b}`, `${x + b}`),
        hints: hintLadder(
          `The aim is to leave ${letter} alone on one side.`,
          `Something has been TAKEN OFF ${letter}, so undo it by putting the same amount back on BOTH sides.`,
          `Add ${b} to each side and see what is left.`),
        solution: { steps: [
          { text: `Add ${b} to both sides.`, expr: `${letter} = ${c} + ${b}` },
          { text: 'Work out the right-hand side.', expr: `${letter} = ${x + b}` },
        ], answer: `${letter} = ${x + b}` },
        misconceptions: [
          { when: `${c - b}`, feedback: `${b} was taken off again. To undo a subtraction you ADD the same amount to both sides.` },
        ],
        verify: { kind: 'equation', solution: x + b, residual: (t) => (t - b) - c },
      };
    }

    // a × letter = c, chosen so the answer is a whole number
    const a = randInt(2, 9), c = a * x;
    return {
      type: 'g5-equation', instruction: 'Find the value of the letter.',
      question: `Solve:   ${a}${letter} = ${c}`,
      answer: `${letter} = ${x}`, accepts: accepts(`${letter}=${x}`, `${letter} = ${x}`, `${x}`),
      hints: hintLadder(
        `${a}${letter} means ${a} lots of ${letter}.`,
        `${letter} is being MULTIPLIED, so undo it by dividing BOTH sides by the same number.`,
        `Divide each side by ${a}.`),
      solution: { steps: [
        { text: `${a} lots of ${letter} make ${c}.`, expr: `${a} × ${letter} = ${c}` },
        { text: `Divide both sides by ${a}.`, expr: `${letter} = ${x}` },
      ], answer: `${letter} = ${x}` },
      misconceptions: [
        { when: `${c - a}`, feedback: `${a}${letter} is a multiplication, not an addition — undo it by dividing, not by subtracting.` },
        { when: `${c * a}`, feedback: 'To undo a multiplication you DIVIDE both sides.' },
      ],
      verify: { kind: 'equation', solution: x, residual: (t) => (a * t) - c },
    };
  };
}

// ---------------------------------------------------------------------------
// Geometry (KICD Grade 5, 4.1 Lines · 4.2 Angles · 4.3 Triangles · 4.4 3-D)
// Grade 5 geometry was nought out of four authored. Angles stopped at
// acute/right/obtuse (the Grade 4 band); triangles answered "equilateral"
// whatever was asked, because the legacy generator only ever drew three equal
// sides; 3-D objects aliased to G6_VOLUME_CUBOID, a different skill entirely.
// ---------------------------------------------------------------------------

/** Five named angle types — Grade 4 covers three, Grade 5 adds straight and reflex. */
function buildAngleTypes({ withReflex = true }) {
  return () => {
    const kinds = withReflex
      ? ['acute', 'right', 'obtuse', 'straight', 'reflex']
      : ['acute', 'right', 'obtuse'];
    const mode = pick(['measure', 'measure', 'turn']);

    if (mode === 'turn') {
      const spec = pick([
        { q: 'A door swings through a quarter turn.', value: 'right' },
        { q: 'A matatu makes a half turn to head back the way it came.', value: 'straight' },
        { q: 'A dancer turns three quarters of the way round.', value: 'reflex' },
        { q: 'A gate opens only a little way, less than a quarter turn.', value: 'acute' },
        { q: 'A hoe handle is tipped past a quarter turn but not as far as a half turn.', value: 'obtuse' },
      ].filter(s => kinds.includes(s.value)));
      return {
        type: 'angle-type-turn', instruction: 'Name the type of angle.',
        question: `${spec.q} What type of angle has it turned through?`,
        answer: spec.value, accepts: accepts(spec.value, `${spec.value} angle`), choices: kinds,
        hints: hintLadder(
          'Work out how many degrees the turn is worth first — a quarter turn is 90° and a half turn is 180°.',
          'Then compare that measure with 90° and with 180°.',
          'Each band — under 90°, exactly 90°, between 90° and 180°, exactly 180°, over 180° — carries its own name.'),
        solution: { steps: [
          { text: 'Turn the description into degrees (quarter = 90°, half = 180°).' },
          { text: 'Compare with 90° and 180° and name the band.', expr: spec.value },
        ], answer: spec.value },
        misconceptions: [
          { when: spec.value === 'acute' ? 'obtuse' : 'acute', feedback: 'Check against 90°: an angle smaller than a quarter turn and one bigger than it have different names.' },
        ],
        verify: { kind: 'text', value: spec.value },
      };
    }

    const kind = pick(kinds);
    const deg = kind === 'acute' ? randInt(12, 88)
      : kind === 'right' ? 90
      : kind === 'obtuse' ? randInt(94, 176)
      : kind === 'straight' ? 180
      : randInt(190, 350);
    return {
      type: 'angle-type', instruction: 'Name the type of angle.',
      question: pick([
        `An angle measures ${deg}°. What type of angle is it?`,
        `What type of angle measures ${deg}°?`,
        `A roof truss has an angle of ${deg}° at one joint. What type of angle is that?`,
      ]),
      answer: kind, accepts: accepts(kind, `${kind} angle`), choices: kinds,
      hints: hintLadder(
        'Compare the measure with 90° and with 180°.',
        'A quarter turn is 90° and a half turn is 180°; those are the two fences to check against.',
        'Each band — under 90°, exactly 90°, between 90° and 180°, exactly 180°, over 180° — carries its own name.'),
      solution: { steps: [
        { text: `Compare ${deg}° with 90° and 180°.` },
        { text: 'Name the band it falls in.', expr: kind },
      ], answer: kind },
      misconceptions: [
        { when: kind === 'reflex' ? 'obtuse' : 'reflex', feedback: 'An obtuse angle is still less than a half turn (180°); past 180° the angle is reflex.' },
        { when: kind === 'acute' ? 'obtuse' : 'acute', feedback: 'Check against 90°: below it and above it have different names.' },
      ],
      verify: { kind: 'text', value: kind },
    };
  };
}

/** Triangles by sides, then by angles (KICD Grade 5, 4.3). */
function buildTriangleTypes({ byAngles = false }) {
  return () => {
    if (!byAngles) {
      const kind = pick(['equilateral', 'isosceles', 'scalene']);
      let s1, s2, s3;
      if (kind === 'equilateral') { s1 = s2 = s3 = randInt(4, 14); }
      else if (kind === 'isosceles') {
        s1 = s2 = randInt(6, 14);
        do { s3 = randInt(3, 2 * s1 - 1); } while (s3 === s1);
      } else {
        // Scalene, and the three must still close into a triangle.
        for (;;) {
          s1 = randInt(4, 9); s2 = randInt(5, 12); s3 = randInt(6, 15);
          if (new Set([s1, s2, s3]).size === 3 && s1 + s2 > s3 && s1 + s3 > s2 && s2 + s3 > s1) break;
        }
      }
      return {
        type: 'triangle-sides', instruction: 'Name the triangle from its sides.',
        question: `A triangle has sides ${s1} cm, ${s2} cm and ${s3} cm. What type of triangle is it?`,
        answer: kind, accepts: accepts(kind, `${kind} triangle`),
        choices: ['equilateral', 'isosceles', 'scalene'],
        hints: hintLadder(
          'Triangles are named by their sides according to how many of the sides are equal.',
          'Compare the three measurements: count how many of them are the same length.',
          'All three the same, exactly two the same, and none the same each have their own name.'),
        solution: { steps: [
          { text: 'Compare the three side lengths.', expr: `${s1}, ${s2}, ${s3}` },
          { text: `${kind === 'equilateral' ? 'All three are equal' : kind === 'isosceles' ? 'Exactly two are equal' : 'No two are equal'}.`, expr: kind },
        ], answer: kind },
        misconceptions: [
          { when: kind === 'isosceles' ? 'equilateral' : 'isosceles',
            feedback: 'Count the equal sides carefully: ALL three equal and exactly TWO equal are different names.' },
          { when: 'scalene', feedback: 'Scalene means no two sides are the same length — check the measurements again.' },
        ],
        verify: { kind: 'text', value: kind },
      };
    }
    const kind = pick(['right-angled', 'acute-angled', 'obtuse-angled']);
    let a, b, c;
    if (kind === 'right-angled') { a = 90; b = randInt(20, 69); c = 90 - b; }
    else if (kind === 'obtuse-angled') { a = randInt(95, 150); b = randInt(10, 180 - a - 10); c = 180 - a - b; }
    else { for (;;) { a = randInt(50, 85); b = randInt(50, 85); c = 180 - a - b; if (c > 0 && c < 90) break; } }
    return {
      type: 'triangle-angles', instruction: 'Name the triangle from its angles.',
      question: `A triangle has angles ${a}°, ${b}° and ${c}°. What type of triangle is it?`,
      answer: kind, accepts: accepts(kind, kind.replace('-angled', ''), `${kind} triangle`),
      choices: ['right-angled', 'acute-angled', 'obtuse-angled'],
      hints: hintLadder(
        'Triangles are also named by their angles — look at the BIGGEST angle only.',
        'Compare that biggest angle with 90°.',
        'Exactly 90°, less than 90°, and more than 90° each give the triangle a different name.'),
      solution: { steps: [
        { text: 'Find the biggest angle.', expr: `${Math.max(a, b, c)}°` },
        { text: 'Compare it with 90°.', expr: kind },
      ], answer: kind },
      misconceptions: [
        { when: kind === 'acute-angled' ? 'obtuse-angled' : 'acute-angled',
          feedback: 'Only the BIGGEST angle decides this. An obtuse-angled triangle still has two small angles in it.' },
      ],
      verify: { kind: 'text', value: kind },
    };
  };
}

/** Cubes, cuboids and cylinders: name them, then count their parts. */
const SOLIDS = {
  cube:     { faces: 6, edges: 12, vertices: 8, desc: 'six square faces, all the same size' },
  cuboid:   { faces: 6, edges: 12, vertices: 8, desc: 'six rectangular faces, with opposite faces matching' },
  cylinder: { faces: 2, edges: 2, vertices: 0, desc: 'two circular ends joined by one curved surface' },
};

function buildSolids({ counting = false }) {
  return () => {
    const names = Object.keys(SOLIDS);
    if (!counting) {
      const value = pick(names);
      const s = SOLIDS[value];
      const everyday = {
        cube: ['a dice', 'a stock cube', 'a Rubik box with all sides equal'],
        cuboid: ['a packet of tea leaves', 'a brick', 'an exercise book box'],
        cylinder: ['a tin of tomato paste', 'a jiko charcoal tin', 'a roller for flattening a pitch'],
      }[value];
      const askEveryday = coin();
      return {
        type: 'solid-name', instruction: 'Name the 3-D object.',
        question: askEveryday
          ? `What is the mathematical name for the shape of ${pick(everyday)}?`
          : `A 3-D object has ${s.desc}. What is it called?`,
        answer: value, accepts: accepts(value), choices: names,
        hints: hintLadder(
          'Start with the faces: are they all flat, or is one of them curved?',
          'If the faces are all flat, check whether they are squares or rectangles.',
          'If a surface curves right round, the ends of the object tell you what it is.'),
        solution: { steps: [
          { text: 'Check for a curved surface first, then look at the shape of the flat faces.' },
          { text: 'Match that against the named objects.', expr: value },
        ], answer: value },
        misconceptions: [
          { when: value === 'cube' ? 'cuboid' : 'cube',
            feedback: 'Both have six flat faces — the difference is whether every face is a square or some are rectangles.' },
        ],
        verify: { kind: 'text', value },
      };
    }
    const name = pick(names);
    const s = SOLIDS[name];
    const part = pick(['faces', 'edges', 'vertices']);
    const value = s[part];
    const what = part === 'vertices' ? 'vertices (corners)' : part === 'faces' ? 'flat faces' : 'edges';
    return {
      type: 'solid-count', instruction: 'Count the parts of the object.',
      question: `How many ${what} does a ${name} have?`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        part === 'faces' ? 'A face is a flat surface you could stand the object on.'
          : part === 'edges' ? 'An edge is the line where two surfaces meet.'
          : 'A vertex is a sharp corner where edges come together.',
        name === 'cylinder'
          ? 'A cylinder has round ends and one surface that curves all the way round — the curved surface is not a flat face, and it has no sharp corners at all.'
          : 'Work round the object in an order — top, bottom, then the sides — so nothing is counted twice and nothing is missed.',
        name === 'cylinder' ? 'Picture a tin: what is flat, what is curved, and where do the surfaces meet?'
          : 'Picture a box in your hands and count the top and bottom first, then the four sides.'),
      solution: { steps: [
        { text: `A ${name} has ${s.desc}.` },
        { text: `Counting its ${what}.`, expr: `${value}` },
      ], answer: `${value}` },
      misconceptions: [
        { when: `${part === 'faces' ? 4 : part === 'edges' ? 8 : 4}`,
          feedback: 'The faces, edges and corners on the hidden side of the object count too — work right round it.' },
      ],
      verify: { kind: 'fraction', value },
    };
  };
}

/** Parallel, perpendicular, intersecting, horizontal, vertical (KICD G5 4.1). */
function buildLineRelationships({ withHorizontalVertical = false }) {
  return () => {
    const relational = [
      { q: 'Two lines run side by side across a page and never meet, however far they are drawn.', value: 'parallel' },
      { q: 'The two long rails of a railway line stay exactly the same distance apart all the way.', value: 'parallel' },
      { q: 'Two lines cross each other and make a square corner where they meet.', value: 'perpendicular' },
      { q: 'The corner of an exercise book is made by two straight edges meeting.', value: 'perpendicular' },
      { q: 'Two lines cross at a point, but the corners they make are not square ones.', value: 'intersecting' },
      { q: 'The opposite edges of a ruler are drawn on a page.', value: 'parallel' },
      { q: 'A goalpost upright meets the crossbar at the top of the goal.', value: 'perpendicular' },
    ];
    const orientation = [
      { q: 'The surface of still water in a basin.', value: 'horizontal' },
      { q: 'A flagpole standing in the school field.', value: 'vertical' },
      { q: 'The top edge of a closed door.', value: 'horizontal' },
      { q: 'A plumb line hanging from a builder\'s hand.', value: 'vertical' },
      { q: 'A line drawn along the floor of a classroom.', value: 'horizontal' },
    ];
    const useOrientation = withHorizontalVertical && coin();
    const pool = useOrientation ? orientation : relational;
    const spec = pick(pool);
    const choices = useOrientation ? ['horizontal', 'vertical'] : ['parallel', 'perpendicular', 'intersecting'];
    return {
      type: useOrientation ? 'line-orientation' : 'line-relationship',
      instruction: useOrientation ? 'Say whether the line is horizontal or vertical.' : 'Name the relationship between the lines.',
      question: `${spec.q} ${useOrientation ? 'Is that line horizontal or vertical?' : 'What are such lines called?'}`,
      answer: spec.value, accepts: accepts(spec.value, `${spec.value} lines`), choices,
      hints: useOrientation
        ? hintLadder(
            'Think which way the line lies compared with the ground.',
            'A line that lies flat, the way a calm water surface does, runs one way; a line that stands straight up and down runs the other.',
            'Picture the line in the real object and ask: flat like the ground, or upright like a pole?')
        : hintLadder(
            'The first question is always whether the two lines ever meet at all.',
            'If they never meet, that settles it. If they do meet, look at the corner they make.',
            'A square corner where they cross has its own name; any other crossing has a more general one.'),
      solution: { steps: [
        { text: useOrientation ? 'Compare the line with the ground.' : 'Decide whether the lines meet, and if so what corner they make.' },
        { text: 'Name it.', expr: spec.value },
      ], answer: spec.value },
      misconceptions: [
        { when: useOrientation ? (spec.value === 'horizontal' ? 'vertical' : 'horizontal') : (spec.value === 'parallel' ? 'perpendicular' : 'parallel'),
          feedback: useOrientation
            ? 'Horizontal lies flat, like the surface of still water; vertical stands straight up, like a flagpole.'
            : 'Lines that never meet and lines that cross at a square corner are opposites — check first whether these lines meet at all.' },
      ],
      verify: { kind: 'text', value: spec.value },
    };
  };
}

// ---------------------------------------------------------------------------
// Measurement (KICD Grade 5, 2.x) — Grade 4 converts between units; Grade 5
// does arithmetic WITH them, which is where the difficulty actually is.
// ---------------------------------------------------------------------------

const MEASURES = {
  length: { big: 'm', small: 'cm', factor: 100, bigWord: 'metres', smallWord: 'centimetres' },
  mass: { big: 'kg', small: 'g', factor: 1000, bigWord: 'kilogrammes', smallWord: 'grams' },
  capacity: { big: 'l', small: 'ml', factor: 1000, bigWord: 'litres', smallWord: 'millilitres' },
};

const MEASURE_STORIES = {
  length: {
    add: (x, y) => `A tailor uses ${x} of cloth for a school dress and ${y} for a shirt. How much cloth is that in all?`,
    sub: (x, y) => `A rope is ${x} long. ${y} is cut off for a swing. How much rope is left?`,
    mul: (x, n) => `Each desk is ${x} wide. How wide are ${n} desks placed side by side?`,
    div: (x, n) => `A plank ${x} long is cut into ${n} equal pieces. How long is each piece?`,
  },
  mass: {
    add: (x, y) => `A sack holds ${x} of maize and another holds ${y}. What is their total mass?`,
    sub: (x, y) => `A tin of beans has a mass of ${x}. After ${y} is sold, what mass is left?`,
    mul: (x, n) => `One packet of sugar has a mass of ${x}. What is the mass of ${n} packets?`,
    div: (x, n) => `${x} of flour is shared equally into ${n} bags. What is the mass of each bag?`,
  },
  capacity: {
    add: (x, y) => `A jerrican holds ${x} of water and a bucket holds ${y}. How much is that altogether?`,
    sub: (x, y) => `A tank holds ${x} of milk. ${y} is taken to the market. How much milk is left?`,
    mul: (x, n) => `One bottle holds ${x} of juice. How much do ${n} bottles hold?`,
    div: (x, n) => `${x} of milk is poured equally into ${n} cans. How much is in each can?`,
  },
};

/** Arithmetic on a measurement, answered in the smaller unit (one number). */
function buildMeasureArithmetic({ kind, ops = ['add', 'sub'] }) {
  return () => {
    const u = MEASURES[kind];
    const op = pick(ops);
    const fmt = (small) => {
      const b = Math.floor(small / u.factor), s = small % u.factor;
      return b ? (s ? `${b} ${u.big} ${s} ${u.small}` : `${b} ${u.big}`) : `${s} ${u.small}`;
    };
    let a, b, value, story, steps, hints;

    if (op === 'mul' || op === 'div') {
      const n = randInt(3, 8);
      if (op === 'mul') {
        a = randInt(1, 4) * u.factor + randInt(1, u.factor - 1);
        value = a * n;
        story = MEASURE_STORIES[kind].mul(fmt(a), n);
        steps = [
          { text: `Change ${fmt(a)} into ${u.smallWord} first.`, expr: `${a} ${u.small}` },
          { text: `Multiply by ${n}.`, expr: `${a} × ${n} = ${value} ${u.small}` },
        ];
        hints = hintLadder(
          `Mixed units are awkward to multiply — change the whole measurement into ${u.smallWord} first.`,
          `1 ${u.big} is ${u.factor} ${u.small}, so the ${u.big} part becomes ${u.smallWord} and the two parts join up.`,
          `Then multiply that single number by ${n}.`);
      } else {
        const each = randInt(1, 3) * u.factor + randInt(1, u.factor - 1);
        a = each * n;
        value = each;
        story = MEASURE_STORIES[kind].div(fmt(a), n);
        steps = [
          { text: `Change ${fmt(a)} into ${u.smallWord} first.`, expr: `${a} ${u.small}` },
          { text: `Divide by ${n}.`, expr: `${a} ÷ ${n} = ${value} ${u.small}` },
        ];
        hints = hintLadder(
          `Mixed units are awkward to divide — change the whole measurement into ${u.smallWord} first.`,
          `1 ${u.big} is ${u.factor} ${u.small}, so the ${u.big} part becomes ${u.smallWord} and the two parts join up.`,
          `Then share that single number into ${n} equal parts.`);
      }
    } else if (op === 'add') {
      a = randInt(1, 5) * u.factor + randInt(Math.floor(u.factor / 2), u.factor - 1);
      b = randInt(1, 4) * u.factor + randInt(Math.floor(u.factor / 2), u.factor - 1);
      value = a + b;                      // the small parts always carry over
      story = MEASURE_STORIES[kind].add(fmt(a), fmt(b));
      steps = [
        { text: `Change both into ${u.smallWord}.`, expr: `${a} ${u.small} and ${b} ${u.small}` },
        { text: 'Add.', expr: `${a} + ${b} = ${value} ${u.small}` },
      ];
      hints = hintLadder(
        `Add like with like: the ${u.smallWord} go with the ${u.smallWord} and the ${u.bigWord} with the ${u.bigWord}.`,
        `${u.factor} ${u.small} make 1 ${u.big}, so if the ${u.smallWord} reach ${u.factor} they carry over into the ${u.bigWord}.`,
        `The simplest way is to change both measurements into ${u.smallWord} and add the two numbers.`);
    } else {
      a = randInt(3, 6) * u.factor + randInt(1, Math.floor(u.factor / 2));
      b = randInt(1, 2) * u.factor + randInt(Math.floor(u.factor / 2) + 1, u.factor - 1);
      value = a - b;                      // always needs a borrow from the big unit
      story = MEASURE_STORIES[kind].sub(fmt(a), fmt(b));
      steps = [
        { text: `Change both into ${u.smallWord}.`, expr: `${a} ${u.small} and ${b} ${u.small}` },
        { text: 'Subtract.', expr: `${a} − ${b} = ${value} ${u.small}` },
      ];
      hints = hintLadder(
        `Subtract like from like: ${u.smallWord} from ${u.smallWord}, ${u.bigWord} from ${u.bigWord}.`,
        `If there are not enough ${u.smallWord} to take from, borrow 1 ${u.big} and turn it into ${u.factor} ${u.small}.`,
        `The simplest way is to change both measurements into ${u.smallWord} and subtract the two numbers.`);
    }

    return {
      type: `g5-${kind}-arith`, instruction: `Give the answer in ${u.smallWord}.`,
      question: `${story} Give your answer in ${u.smallWord}.`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value} ${u.small}`),
      hints,
      solution: { steps, answer: `${value}` },
      misconceptions: [
        { when: `${Math.floor(value / u.factor)}`, feedback: `That is only the ${u.bigWord} part. The question asks for the whole amount in ${u.smallWord}.` },
        { when: `${op === 'sub' ? a + b : op === 'add' ? Math.abs(a - b) : value}`,
          feedback: op === 'sub' ? 'That is the total of the two. The question asks what is left.'
            : op === 'add' ? 'That is the difference between the two. The question asks for the total.'
            : 'Check which operation the story needs.' },
      ],
      verify: { kind: 'fraction', value },
    };
  };
}

/** The same measurement written in mixed units — the Grade 5 answer form. */
function buildMeasureMixedUnits({ kind }) {
  return () => {
    const u = MEASURES[kind];
    const toward = coin() ? 'to-mixed' : 'to-small';
    const b = randInt(2, 9), s = randInt(1, u.factor - 1);
    const total = b * u.factor + s;
    if (toward === 'to-mixed') {
      const value = `${b} ${u.big} ${s} ${u.small}`;
      return {
        type: `g5-${kind}-mixed`, instruction: `Write it in ${u.bigWord} and ${u.smallWord}.`,
        question: `Write ${total} ${u.small} in ${u.bigWord} and ${u.smallWord}.`,
        answer: value,
        accepts: accepts(value, `${b}${u.big}${s}${u.small}`, `${b} ${u.big} and ${s} ${u.small}`),
        hints: hintLadder(
          `${u.factor} ${u.small} make 1 ${u.big}.`,
          `So ask how many whole lots of ${u.factor} fit into the number.`,
          `Those whole lots are the ${u.bigWord}, and whatever is left over stays as ${u.smallWord}.`),
        solution: { steps: [
          { text: `Divide by ${u.factor} to find the whole ${u.bigWord}.`, expr: `${total} ÷ ${u.factor} = ${b} remainder ${s}` },
          { text: 'The remainder stays in the smaller unit.', expr: value },
        ], answer: value },
        misconceptions: [
          { when: `${b} ${u.big}`, feedback: `The ${s} ${u.small} left over are part of the measurement too — they must be written as well.` },
        ],
        verify: { kind: 'text', value },
      };
    }
    return {
      type: `g5-${kind}-mixed`, instruction: `Write it in ${u.smallWord}.`,
      question: `Write ${b} ${u.big} ${s} ${u.small} in ${u.smallWord}.`,
      answer: `${total}`, accepts: accepts(`${total}`, `${total} ${u.small}`),
      hints: hintLadder(
        `1 ${u.big} is ${u.factor} ${u.small}.`,
        `So the ${u.bigWord} have to be turned into ${u.smallWord} first.`,
        `Then the ${u.smallWord} already there are added on.`),
      solution: { steps: [
        { text: `Change the ${u.bigWord}.`, expr: `${b} × ${u.factor} = ${b * u.factor} ${u.small}` },
        { text: `Add the loose ${u.smallWord}.`, expr: `${b * u.factor} + ${s} = ${total}` },
      ], answer: `${total}` },
      misconceptions: [
        { when: `${b * u.factor}`, feedback: `The ${s} ${u.small} still have to be added on.` },
        { when: `${b + s}`, feedback: `Converting means MULTIPLYING the ${u.bigWord} by ${u.factor}, not adding the two numbers.` },
      ],
      verify: { kind: 'fraction', value: total },
    };
  };
}

/** Kilometres and metres (KICD Grade 5, 2.1 — journeys, not just conversion). */
function buildKilometres() {
  return () => {
    const mode = pick(['journey', 'convert', 'compare']);
    if (mode === 'journey') {
      const legs = [randInt(2, 9) * 1000 + randInt(100, 900), randInt(1, 7) * 1000 + randInt(100, 900)];
      const value = legs[0] + legs[1];
      const fmt = (m) => `${Math.floor(m / 1000)} km ${m % 1000} m`;
      return {
        type: 'g5-km-journey', instruction: 'Give the answer in metres.',
        question: `A matatu travels ${fmt(legs[0])} from the stage to the market, then ${fmt(legs[1])} to the next town. How far has it travelled in metres?`,
        answer: `${value}`, accepts: accepts(`${value}`, `${value} m`),
        hints: hintLadder(
          '1 km is 1000 m, so both distances can be written as a single number of metres.',
          'Change each leg of the journey into metres on its own first.',
          'Then add the two numbers of metres together.'),
        solution: { steps: [
          { text: 'Change each leg into metres.', expr: `${legs[0]} m and ${legs[1]} m` },
          { text: 'Add.', expr: `${legs[0]} + ${legs[1]} = ${value} m` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${Math.floor(value / 1000)}`, feedback: 'That is only the whole kilometres. The question asks for the whole distance in metres.' },
        ],
        verify: { kind: 'fraction', value },
      };
    }
    if (mode === 'compare') {
      const km = randInt(2, 9), m = km * 1000 + pick([-1, 1]) * randInt(50, 900);
      const value = km * 1000 > m ? `${km} km` : `${m} m`;
      return {
        type: 'g5-km-compare', instruction: 'Compare the two distances.',
        question: `Which is further: ${km} km or ${m} m?`,
        answer: value, accepts: accepts(value, value.replace(' ', '')),
        choices: [`${km} km`, `${m} m`],
        hints: hintLadder(
          'Two measurements can only be compared once they are in the SAME unit.',
          '1 km is 1000 m, so the kilometres can be written as metres.',
          'Then it is just a matter of which number is bigger.'),
        solution: { steps: [
          { text: 'Put both in metres.', expr: `${km} km = ${km * 1000} m` },
          { text: 'Compare.', expr: value },
        ], answer: value },
        misconceptions: [
          { when: km * 1000 > m ? `${m} m` : `${km} km`, feedback: 'Change the kilometres into metres before comparing — a bigger-looking number in a smaller unit can still be less.' },
        ],
        verify: { kind: 'text', value },
      };
    }
    const km = randInt(2, 9), m = randInt(1, 999);
    const value = km * 1000 + m;
    return {
      type: 'g5-km-convert', instruction: 'Convert to metres.',
      question: `Write ${km} km ${m} m in metres.`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value} m`),
      hints: hintLadder(
        '1 km is 1000 m.',
        'So the kilometres have to be turned into metres first.',
        'Then the loose metres are added on.'),
      solution: { steps: [
        { text: 'Change the kilometres.', expr: `${km} × 1000 = ${km * 1000} m` },
        { text: 'Add the loose metres.', expr: `${km * 1000} + ${m} = ${value}` },
      ], answer: `${value}` },
      misconceptions: [
        { when: `${km * 1000}`, feedback: `The ${m} m still have to be added on.` },
        { when: `${km + m}`, feedback: 'Converting kilometres to metres means multiplying by 1000, not adding.' },
      ],
      verify: { kind: 'fraction', value },
    };
  };
}

/** Duration arithmetic and seconds (KICD Grade 5, 2.5). Grade 4 stops at
 *  a.m./p.m. and a single duration; Grade 5 adds and subtracts them. */
function buildTimeArithmetic({ withSeconds = false }) {
  return () => {
    const mode = withSeconds ? pick(['add', 'sub', 'seconds', 'minutes']) : pick(['add', 'sub', 'minutes']);

    if (mode === 'seconds') {
      const m = randInt(3, 15), s = randInt(5, 55);
      const value = m * 60 + s;
      return {
        type: 'g5-time-seconds', instruction: 'Change the time to seconds.',
        question: `An athlete runs 800 m in ${m} minutes ${s} seconds. How many seconds is that?`,
        answer: `${value}`, accepts: accepts(`${value}`, `${value} seconds`),
        hints: hintLadder(
          'One minute is sixty seconds.',
          'So the minutes have to be turned into seconds first.',
          'Then the loose seconds are added on.'),
        solution: { steps: [
          { text: 'Change the minutes.', expr: `${m} × 60 = ${m * 60} s` },
          { text: 'Add the loose seconds.', expr: `${m * 60} + ${s} = ${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${m * 100 + s}`, feedback: 'A minute is 60 seconds, not 100 — multiply the minutes by 60.' },
          { when: `${m * 60}`, feedback: `The ${s} loose seconds still have to be added on.` },
        ],
        verify: { kind: 'fraction', value },
      };
    }

    if (mode === 'minutes') {
      const h = randInt(2, 9), m = randInt(5, 55);
      const value = h * 60 + m;
      return {
        type: 'g5-time-minutes', instruction: 'Change the time to minutes.',
        question: `A journey to Kisumu takes ${h} hours ${m} minutes. How many minutes is that?`,
        answer: `${value}`, accepts: accepts(`${value}`, `${value} minutes`),
        hints: hintLadder(
          'One hour is sixty minutes.',
          'So the hours have to be turned into minutes first.',
          'Then the loose minutes are added on.'),
        solution: { steps: [
          { text: 'Change the hours.', expr: `${h} × 60 = ${h * 60} min` },
          { text: 'Add the loose minutes.', expr: `${h * 60} + ${m} = ${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${h * 100 + m}`, feedback: 'An hour is 60 minutes, not 100 — multiply the hours by 60.' },
          { when: `${h * 60}`, feedback: `The ${m} loose minutes still have to be added on.` },
        ],
        verify: { kind: 'fraction', value },
      };
    }

    // Add or subtract two durations given in hours and minutes.
    const h1 = randInt(1, 4), m1 = randInt(35, 55);
    const h2 = randInt(1, 3), m2 = randInt(35, 55);
    const t1 = h1 * 60 + m1, t2 = h2 * 60 + m2;
    const fmt = (t) => `${Math.floor(t / 60)} h ${t % 60} min`;
    if (mode === 'add') {
      const value = t1 + t2;
      return {
        type: 'g5-time-add', instruction: 'Add the two times. Give the answer in hours and minutes.',
        question: `Wanjiru works ${fmt(t1)} in the morning and ${fmt(t2)} in the afternoon. How long does she work altogether? (Give hours and minutes.)`,
        answer: fmt(value),
        accepts: accepts(fmt(value), fmt(value).replace(/ /g, ''),
          `${Math.floor(value / 60)} hours ${value % 60} minutes`, `${value}`),
        hints: hintLadder(
          'Add the minutes to the minutes and the hours to the hours, kept apart.',
          'Sixty minutes make one more hour, so minutes past sixty have to be carried.',
          'Carry the extra hour across and leave only what is under sixty in the minutes column.'),
        solution: { steps: [
          { text: 'Add the minutes.', expr: `${m1} + ${m2} = ${m1 + m2} min` },
          { text: 'Carry sixty minutes into the hours.', expr: `${m1 + m2} min = 1 h ${m1 + m2 - 60} min` },
          { text: 'Add the hours.', expr: fmt(value) },
        ], answer: fmt(value) },
        misconceptions: [
          { when: `${h1 + h2} h ${m1 + m2} min`, feedback: 'The minutes have gone past sixty — sixty of them make another hour, which has to be carried over.' },
        ],
        verify: { kind: 'text', value: fmt(value) },
      };
    }
    const big = Math.max(t1, t2) + 60, small = Math.min(t1, t2);
    const value = big - small;
    return {
      type: 'g5-time-sub', instruction: 'Subtract the two times. Give the answer in hours and minutes.',
      question: `A film lasts ${fmt(big)}. Otieno has already watched ${fmt(small)} of it. How much is left? (Give hours and minutes.)`,
      answer: fmt(value),
      accepts: accepts(fmt(value), fmt(value).replace(/ /g, ''),
        `${Math.floor(value / 60)} hours ${value % 60} minutes`, `${value}`),
      hints: hintLadder(
        'Take minutes from minutes and hours from hours, kept apart.',
        'If there are not enough minutes to take from, borrow one hour and turn it into sixty minutes.',
        'Another way is to change both times into minutes, subtract, and change back at the end.'),
      solution: { steps: [
        { text: 'Change both into minutes.', expr: `${big} min − ${small} min` },
        { text: 'Subtract.', expr: `${value} min` },
        { text: 'Change back into hours and minutes.', expr: fmt(value) },
      ], answer: fmt(value) },
      misconceptions: [
        { when: `${Math.floor(big / 60) - Math.floor(small / 60)} h ${Math.abs(big % 60 - small % 60)} min`,
          feedback: 'Each column was worked on its own. When there are not enough minutes you must borrow an hour, not just take the smaller number from the bigger.' },
      ],
      verify: { kind: 'text', value: fmt(value) },
    };
  };
}

/** Volume of cubes and cuboids, and the cm³/ml link (KICD Grade 5, 2.6). */
function buildVolumeCubic({ withMlLink = false }) {
  return () => {
    if (withMlLink && coin()) {
      const l = randInt(2, 10), w = randInt(2, 10), h = randInt(2, 10);
      const value = l * w * h;
      return {
        type: 'g5-volume-ml', instruction: 'Use the link between cubic centimetres and millilitres.',
        question: `A closed tin measures ${l} cm by ${w} cm by ${h} cm. How many millilitres of water does it hold when full?`,
        answer: `${value}`, accepts: accepts(`${value}`, `${value} ml`),
        hints: hintLadder(
          'Work out the space inside the tin first: that is length × width × height, in cubic centimetres.',
          'One cubic centimetre of space holds exactly one millilitre of water.',
          'So the number of cubic centimetres and the number of millilitres are the same number.'),
        solution: { steps: [
          { text: 'Volume of a cuboid.', expr: `${l} × ${w} × ${h} = ${value} cm³` },
          { text: '1 cm³ holds 1 ml.', expr: `${value} ml` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${l + w + h}`, feedback: 'Volume multiplies the three measurements; adding them gives nothing useful.' },
          { when: `${value * 1000}`, feedback: '1 cm³ is 1 ml, not 1 litre — the number does not change when cm³ becomes ml.' },
        ],
        verify: { kind: 'fraction', value },
      };
    }
    const cube = coin();
    const l = randInt(3, 12), w = cube ? l : randInt(3, 12), h = cube ? l : randInt(3, 12);
    const value = l * w * h;
    return {
      type: 'g5-volume', instruction: 'Find the volume in cubic centimetres.',
      question: cube
        ? `Find the volume of a cube of side ${l} cm.`
        : `A matchbox measures ${l} cm long, ${w} cm wide and ${h} cm high. Find its volume in cubic centimetres.`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value} cm³`, `${value} cm3`),
      hints: hintLadder(
        'Volume is the space inside, measured in cubes of 1 cm each way.',
        'One layer of those cubes covers length × width.',
        'Then count how many such layers are stacked up — that is the height.'),
      solution: { steps: [
        { text: 'One layer.', expr: `${l} × ${w} = ${l * w} cubes` },
        { text: `There are ${h} layers.`, expr: `${l * w} × ${h} = ${value} cm³` },
      ], answer: `${value}` },
      misconceptions: [
        { when: `${l + w + h}`, feedback: 'Volume multiplies the three measurements — it does not add them.' },
        { when: `${l * w}`, feedback: 'That is the area of one face. Volume needs the height as well, to count the layers.' },
        ...(cube ? [{ when: `${l * 6}`, feedback: 'A cube has six faces, but volume is about the space inside, not the faces — multiply the side by itself three times.' }] : []),
      ],
      verify: { kind: 'fraction', value },
    };
  };
}

// ---------------------------------------------------------------------------
// Statistics (KICD Grade 5, 5.1) — nought out of three authored.
// ---------------------------------------------------------------------------

const DATA_SETS = [
  { label: 'the fruits sold at the school gate', keys: ['Mangoes', 'Bananas', 'Oranges', 'Avocados'], noun: 'fruits' },
  { label: 'the vehicles counted at the junction', keys: ['Matatus', 'Lorries', 'Boda bodas', 'Cars'], noun: 'vehicles' },
  { label: 'the trees planted by each class', keys: ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'], noun: 'trees' },
  { label: 'the bags of maize harvested each week', keys: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], noun: 'bags' },
];

/** Tally marks into a frequency table (KICD Grade 5, 5.1). */
function buildTally() {
  return () => {
    const set = pick(DATA_SETS);
    const counts = set.keys.map(() => randInt(4, 23));
    if (new Set(counts).size !== counts.length) return buildTally()();
    const tally = (n) => `${'|||| '.repeat(Math.floor(n / 5))}${'|'.repeat(n % 5)}`.trim();
    const rows = set.keys.map((k, i) => `${k}: ${tally(counts[i])}`).join('   ·   ');
    const stem = `A tally chart of ${set.label} (each complete group of five is written ||||):   ${rows}.`;
    const mode = pick(['read', 'total', 'most', 'difference']);

    if (mode === 'read') {
      const i = randInt(0, set.keys.length - 1);
      const value = counts[i];
      return {
        type: 'tally-read', instruction: 'Turn the tally marks into a number.',
        question: `${stem}   What is the frequency for ${set.keys[i]}?`,
        answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(
          'Each stroke stands for one, and a complete group stands for five.',
          `Find the row for ${set.keys[i]} and count its complete groups of five first.`,
          'Then count the loose strokes left after the groups, and join the two counts.'),
        solution: { steps: [
          { text: 'Count the complete groups of five.', expr: `${Math.floor(value / 5)} groups = ${Math.floor(value / 5) * 5}` },
          { text: 'Add the loose strokes.', expr: `${Math.floor(value / 5) * 5} + ${value % 5} = ${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${Math.floor(value / 5) + (value % 5)}`, feedback: 'Each complete group is worth FIVE, not one — count the groups in fives before adding the loose strokes.' },
          { when: `${Math.floor(value / 5) * 5}`, feedback: 'The loose strokes after the last complete group count too.' },
        ],
        verify: { kind: 'fraction', value },
      };
    }
    if (mode === 'total') {
      const value = counts.reduce((a, b) => a + b, 0);
      return {
        type: 'tally-total', instruction: 'Give the total frequency.',
        question: `${stem}   How many ${set.noun} were counted altogether?`,
        answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(
          'Turn each row of tally marks into a number first, before adding anything.',
          'A complete group is worth five; loose strokes are worth one each.',
          'Then add the row frequencies together, checking that no row is left out.'),
        solution: { steps: [
          { text: 'Frequencies row by row.', expr: counts.join(', ') },
          { text: 'Add them.', expr: `${counts.join(' + ')} = ${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${value - counts[counts.length - 1]}`, feedback: 'A row was left out — every row of the chart belongs in the total.' },
        ],
        verify: { kind: 'fraction', value },
      };
    }
    if (mode === 'difference') {
      const hi = Math.max(...counts), lo = Math.min(...counts), value = hi - lo;
      return {
        type: 'tally-difference', instruction: 'Compare the longest and shortest rows.',
        question: `${stem}   How many more ${set.noun} are in the longest row than in the shortest?`,
        answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(
          'Turn the longest row and the shortest row into numbers first.',
          '"How many more" compares two frequencies rather than joining them.',
          'Comparing two amounts like this is a subtraction.'),
        solution: { steps: [
          { text: 'Longest and shortest rows.', expr: `${hi} and ${lo}` },
          { text: 'Find the difference.', expr: `${hi} − ${lo} = ${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${hi + lo}`, feedback: '"How many more" is a comparison — subtract the smaller frequency from the bigger.' },
        ],
        verify: { kind: 'fraction', value },
      };
    }
    const value = set.keys[counts.indexOf(Math.max(...counts))];
    return {
      type: 'tally-most', instruction: 'Name the commonest item.',
      question: `${stem}   Which was counted most often?`,
      answer: value, accepts: accepts(value), choices: set.keys,
      hints: hintLadder(
        'The longest row of tally marks is the commonest item.',
        'Count the complete groups of five in each row before judging — a row with more loose strokes can still be shorter.',
        'Compare the row frequencies and keep the biggest so far in mind.'),
      solution: { steps: [
        { text: 'Frequencies row by row.', expr: counts.join(', ') },
        { text: 'The biggest names the answer.', expr: value },
      ], answer: value },
      misconceptions: [
        { when: set.keys[counts.indexOf(Math.min(...counts))], feedback: 'That row is the shortest. The question asks which was counted MOST often.' },
      ],
      verify: { kind: 'text', value },
    };
  };
}

/** Bar graphs with a SCALE on the axis — Grade 4 reads bars worth one each. */
function buildScaledBarGraph() {
  return () => {
    const set = pick(DATA_SETS);
    const step = pick([2, 5, 10, 20]);
    const squares = set.keys.map(() => randInt(2, 9));
    if (new Set(squares).size !== squares.length) return buildScaledBarGraph()();
    const vals = squares.map(s => s * step);
    const rows = set.keys.map((k, i) => `${k}: ${squares[i]} squares`).join(',   ');
    const stem = `A bar graph of ${set.label} has a vertical axis on which 1 square stands for ${step} ${set.noun}. The bars reach —  ${rows}.`;
    const mode = pick(['read', 'total', 'difference']);

    if (mode === 'read') {
      const i = randInt(0, set.keys.length - 1);
      const value = vals[i];
      return {
        type: 'bar-scaled-read', instruction: 'Use the scale to read the bar.',
        question: `${stem}   How many ${set.noun} does the ${set.keys[i]} bar stand for?`,
        answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(
          'The scale tells you what ONE square on the axis is worth — the bar is not read off directly.',
          `Here every single square is worth ${step}, not 1.`,
          `So the height of the bar in squares has to be combined with the ${step} that each square is worth.`),
        solution: { steps: [
          { text: 'One square is worth the scale.', expr: `${step} ${set.noun}` },
          { text: `The bar is ${squares[i]} squares tall.`, expr: `${squares[i]} × ${step} = ${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${squares[i]}`, feedback: `That is the height in squares. Each square stands for ${step}, so the squares must be multiplied by ${step}.` },
          { when: `${squares[i] + step}`, feedback: 'The scale multiplies the height; it is not added to it.' },
        ],
        verify: { kind: 'fraction', value },
      };
    }
    if (mode === 'total') {
      const value = vals.reduce((a, b) => a + b, 0);
      return {
        type: 'bar-scaled-total', instruction: 'Use the scale, then total.',
        question: `${stem}   How many ${set.noun} altogether?`,
        answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(
          'Every bar has to be turned into a real amount using the scale before anything is added.',
          `One square is worth ${step}, so each bar is its height in squares multiplied by ${step}.`,
          'Another way: add all the square heights first, then multiply the total by the scale once.'),
        solution: { steps: [
          { text: 'Heights in squares.', expr: squares.join(' + ') + ` = ${squares.reduce((a, b) => a + b, 0)}` },
          { text: 'Multiply by the scale once.', expr: `${squares.reduce((a, b) => a + b, 0)} × ${step} = ${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${squares.reduce((a, b) => a + b, 0)}`, feedback: `That is the total height in squares. Each square stands for ${step} ${set.noun}.` },
        ],
        verify: { kind: 'fraction', value },
      };
    }
    const hi = Math.max(...vals), lo = Math.min(...vals), value = hi - lo;
    return {
      type: 'bar-scaled-difference', instruction: 'Use the scale, then compare.',
      question: `${stem}   How many more ${set.noun} does the tallest bar stand for than the shortest?`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        'Find the tallest and the shortest bar, and turn both into real amounts using the scale.',
        `One square is worth ${step}, so each height in squares has to be multiplied by ${step}.`,
        '"How many more" then asks for the difference between the two amounts.'),
      solution: { steps: [
        { text: 'The two bars in real amounts.', expr: `${hi} and ${lo}` },
        { text: 'Find the difference.', expr: `${hi} − ${lo} = ${value}` },
      ], answer: `${value}` },
      misconceptions: [
        { when: `${(hi - lo) / step}`, feedback: `That is the difference in SQUARES. Each square stands for ${step} ${set.noun}.` },
        { when: `${hi + lo}`, feedback: '"How many more" is a comparison — subtract, do not add.' },
      ],
      verify: { kind: 'fraction', value },
    };
  };
}

/** Pictographs where one symbol stands for several, including half symbols. */
function buildPictograph({ halves = false }) {
  return () => {
    const set = pick(DATA_SETS);
    const each = pick([2, 4, 5, 10, 20]);
    const symbols = set.keys.map(() => (halves && coin() ? randInt(2, 7) + 0.5 : randInt(2, 8)));
    const vals = symbols.map(s => s * each);
    if (new Set(vals).size !== vals.length) return buildPictograph({ halves })();
    const sym = (n) => (Number.isInteger(n) ? `${n} symbols` : `${Math.floor(n)} and a half symbols`);
    const rows = set.keys.map((k, i) => `${k}: ${sym(symbols[i])}`).join(',   ');
    const stem = `A pictograph of ${set.label} uses a symbol that stands for ${each} ${set.noun}${halves ? ' (a half symbol stands for half as many)' : ''}. The rows show —  ${rows}.`;
    const mode = pick(['read', 'total', 'symbols']);

    if (mode === 'symbols') {
      const n = randInt(3, 9), value = n * each;
      return {
        type: 'pictograph-symbols', instruction: 'Work out how many symbols are needed.',
        question: `On a pictograph of ${set.label}, one symbol stands for ${each} ${set.noun}. How many ${set.noun} would ${n} symbols stand for?`,
        answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(
          'The key tells you what ONE symbol is worth.',
          `Here one symbol is worth ${each} ${set.noun}.`,
          `So the number of symbols has to be combined with the ${each} that each one stands for.`),
        solution: { steps: [
          { text: 'One symbol is worth the key.', expr: `${each} ${set.noun}` },
          { text: `There are ${n} symbols.`, expr: `${n} × ${each} = ${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${n + each}`, feedback: 'The key multiplies the number of symbols; it is not added to it.' },
        ],
        verify: { kind: 'fraction', value },
      };
    }
    if (mode === 'read') {
      const i = randInt(0, set.keys.length - 1);
      const value = vals[i];
      return {
        type: 'pictograph-read', instruction: 'Use the key to read the row.',
        question: `${stem}   How many ${set.noun} for ${set.keys[i]}?`,
        answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(
          'The key says what one symbol is worth — the symbols are not counted as ones.',
          `One whole symbol is worth ${each} ${set.noun}${halves ? `, and a half symbol is worth ${each / 2}` : ''}.`,
          `So the row's symbols have to be combined with the ${each} each one stands for.`),
        solution: { steps: [
          { text: `The ${set.keys[i]} row has ${sym(symbols[i])}.` },
          { text: 'Multiply by the key.', expr: `${symbols[i]} × ${each} = ${value}` },
        ], answer: `${value}` },
        misconceptions: [
          { when: `${symbols[i]}`, feedback: `That is the number of symbols. Each one stands for ${each} ${set.noun}.` },
        ],
        verify: { kind: 'fraction', value },
      };
    }
    const value = vals.reduce((a, b) => a + b, 0);
    return {
      type: 'pictograph-total', instruction: 'Use the key, then total.',
      question: `${stem}   How many ${set.noun} altogether?`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        'Every row must be turned into a real amount with the key before anything is added.',
        `One symbol is worth ${each} ${set.noun}${halves ? `, and a half symbol half of that` : ''}.`,
        'Another way: count all the symbols first, then multiply the total by the key once.'),
      solution: { steps: [
        { text: 'Symbols in each row.', expr: symbols.join(' + ') + ` = ${symbols.reduce((a, b) => a + b, 0)}` },
        { text: 'Multiply by the key once.', expr: `${symbols.reduce((a, b) => a + b, 0)} × ${each} = ${value}` },
      ], answer: `${value}` },
      misconceptions: [
        { when: `${symbols.reduce((a, b) => a + b, 0)}`, feedback: `That is the number of symbols. Each symbol stands for ${each} ${set.noun}.` },
      ],
      verify: { kind: 'fraction', value },
    };
  };
}

// ---------------------------------------------------------------------------
// The Grade 5 content map
// ---------------------------------------------------------------------------

export const GRADE5_CONTENT = {
  // KP ladder: five-digit without regrouping → five-digit with → six-digit.
  // "Addition (up to 6 digits)" now actually reaches six digits.
  G5_ADDITION:        withKPs([
                        withWorkedExample(buildWideColumnAddSub({ digitsA: 5, digitsB: 4, regroup: false })),
                        withWorkedExample(buildWideColumnAddSub({ digitsA: 5, digitsB: 5, regroup: true })),
                        withWorkedExample(buildWideColumnAddSub({ digitsA: 6, digitsB: 6, regroup: true })),
                      ]),
  G5_SUBTRACTION:     withKPs([
                        withWorkedExample(buildWideColumnAddSub({ digitsA: 5, digitsB: 4, sub: true, regroup: false })),
                        withWorkedExample(buildWideColumnAddSub({ digitsA: 5, digitsB: 5, sub: true, regroup: true })),
                        withWorkedExample(buildWideColumnAddSub({ digitsA: 6, digitsB: 6, sub: true, regroup: true })),
                      ]),
  // KP ladder: two-digit × two-digit (the new idea: two partial products) →
  // three-digit × a teens multiplier → three-digit × two-digit, full range.
  // Every rung keeps a TWO-digit multiplier, because the diagnostic serves
  // whichever rung the ladder happens to be on and must not credit
  // "3-digit × 2-digit" off a one-digit multiplier.
  G5_MULTIPLICATION:  withKPs([
                        withWorkedExample(buildLongMul({ minA: 12, maxA: 99, twoDigitB: true })),
                        withWorkedExample(buildLongMul({ minA: 112, maxA: 999, twoDigitB: true, minB: 12, maxB: 19 })),
                        withWorkedExample(buildLongMul({ minA: 112, maxA: 999, twoDigitB: true, minB: 22, maxB: 99 })),
                      ]),
  // KP ladder: friendly two-digit divisors → the full range → remainders.
  G5_DIVISION:        withKPs([
                        withWorkedExample(buildTwoDigitDiv({ dMin: 11, dMax: 20, qMin: 11, qMax: 49 })),
                        withWorkedExample(buildTwoDigitDiv({ dMin: 21, dMax: 45, qMin: 11, qMax: 40 })),
                        withWorkedExample(buildTwoDigitDivRemainder({ dMin: 12, dMax: 30, qMin: 11, qMax: 30 })),
                      ]),

  // ── Grade 6 rungs of the same two ladders ───────────────────────────────
  // KICD Grade 6, 1.2 and 1.3. Neither sub-strand had a skill: Multiplication
  // was represented only by a number-patterns skill, and Division by nothing at
  // all, so a Grade 6 check could not ask a Grade 6 long-division question.
  G6_MULTIPLICATION:  withKPs([
                        withWorkedExample(buildLongMul({ minA: 1012, maxA: 4999, twoDigitB: true, minB: 12, maxB: 39 })),
                        withWorkedExample(buildLongMul({ minA: 1012, maxA: 9999, twoDigitB: true, minB: 42, maxB: 99 })),
                      ]),
  G6_DIVISION:        withKPs([
                        withWorkedExample(buildTwoDigitDiv({ dMin: 12, dMax: 99, qMin: 21, qMax: 99, totalMin: 1000, totalMax: 9999 })),
                        withWorkedExample(buildTwoDigitDiv({ dMin: 101, dMax: 250, qMin: 11, qMax: 49, totalMin: 1000, totalMax: 9999 })),
                      ]),

  // ── Numbers: factors, multiples, divisibility, LCM & HCF ────────────────
  G5_FACTORS:         withKPs([
                        withWorkedExample(buildFactors({ max: 40 })),
                        withWorkedExample(buildFactors({ max: 72 })),
                      ]),
  G5_MULTIPLES:       withKPs([
                        withWorkedExample(buildMultiples({ maxBase: 9 })),
                        withWorkedExample(buildMultiples({ maxBase: 12 })),
                      ]),
  G5_DIVISIBILITY:    withWorkedExample(buildDivisibility2510()),
  // KP ladder: the two ideas separately, then the word problem that needs one.
  G5_LCM_HCF:         withKPs([
                        withWorkedExample(buildLcmHcf({ which: 'lcm' })),
                        withWorkedExample(buildLcmHcf({ which: 'hcf' })),
                        withWorkedExample(buildLcmHcf({ which: 'word' })),
                      ]),

  // ── Algebra: one unknown, whole numbers, never a negative answer ────────
  G5_SIMPLE_EQUATIONS: withKPs([
                        withWorkedExample(buildOneStepEquation({ ops: ['add'] })),
                        withWorkedExample(buildOneStepEquation({ ops: ['sub'] })),
                        withWorkedExample(buildOneStepEquation({ ops: ['mul'] })),
                        withWorkedExample(buildOneStepEquation({ ops: ['add', 'sub', 'mul'] })),
                      ]),

  // ── Geometry ────────────────────────────────────────────────────────────
  // Grade 4 classifies acute/right/obtuse; Grade 5 adds straight and reflex.
  G5_ANGLES_INTRO:    withKPs([
                        withWorkedExample(buildAngleTypes({ withReflex: false })),
                        withWorkedExample(buildAngleTypes({ withReflex: true })),
                      ]),
  G5_TRIANGLES_INTRO: withKPs([
                        withWorkedExample(buildTriangleTypes({ byAngles: false })),
                        withWorkedExample(buildTriangleTypes({ byAngles: true })),
                      ]),
  G5_3D_OBJECTS:      withKPs([
                        withWorkedExample(buildSolids({ counting: false })),
                        withWorkedExample(buildSolids({ counting: true })),
                      ]),
  G5_LINES:           withKPs([
                        withWorkedExample(buildLineRelationships({ withHorizontalVertical: false })),
                        withWorkedExample(buildLineRelationships({ withHorizontalVertical: true })),
                      ]),

  // ── Measurement ─────────────────────────────────────────────────────────
  // Grade 4 converts between units; Grade 5 does arithmetic with them.
  // Each of these three sub-strands runs to TWELVE lessons in the KICD design,
  // and the design splits each one the same way: outcomes (a)-(e) are the unit
  // and converting between units, (f)-(i) are the four operations on it. One
  // skill carrying all of that is twelve lessons behind a single node, so the
  // learner's progress on "can you convert litres to millilitres" and "can you
  // subtract 1 l 950 ml from 4 l 107 ml" was a single number. Split on the
  // design's own seam, each half is tracked, reviewed and remediated on its own.
  G5_LENGTH:          withKPs([
                        withWorkedExample(buildMeasureMixedUnits({ kind: 'length' })),
                        withWorkedExample(buildKilometres()),
                      ]),
  G5_LENGTH_OPS:      withKPs([
                        withWorkedExample(buildMeasureArithmetic({ kind: 'length', ops: ['add', 'sub'] })),
                        withWorkedExample(buildMeasureArithmetic({ kind: 'length', ops: ['mul', 'div'] })),
                      ]),
  G5_MASS:            withWorkedExample(buildMeasureMixedUnits({ kind: 'mass' })),
  G5_MASS_OPS:        withKPs([
                        withWorkedExample(buildMeasureArithmetic({ kind: 'mass', ops: ['add', 'sub'] })),
                        withWorkedExample(buildMeasureArithmetic({ kind: 'mass', ops: ['mul', 'div'] })),
                      ]),
  G5_CAPACITY:        withWorkedExample(buildMeasureMixedUnits({ kind: 'capacity' })),
  G5_CAPACITY_OPS:    withKPs([
                        withWorkedExample(buildMeasureArithmetic({ kind: 'capacity', ops: ['add', 'sub'] })),
                        withWorkedExample(buildMeasureArithmetic({ kind: 'capacity', ops: ['mul', 'div'] })),
                      ]),
  G5_TIME:            withKPs([
                        withWorkedExample(buildTimeArithmetic({ withSeconds: false })),
                        withWorkedExample(buildTimeArithmetic({ withSeconds: true })),
                      ]),
  G5_VOLUME:          withKPs([
                        withWorkedExample(buildVolumeCubic({ withMlLink: false })),
                        withWorkedExample(buildVolumeCubic({ withMlLink: true })),
                      ]),

  // ── Statistics ──────────────────────────────────────────────────────────
  G5_TALLY:           withWorkedExample(buildTally()),
  G5_BAR_GRAPHS:      withWorkedExample(buildScaledBarGraph()),
  G5_PICTOGRAPHS:     withKPs([
                        withWorkedExample(buildPictograph({ halves: false })),
                        withWorkedExample(buildPictograph({ halves: true })),
                      ]),
};

export const GRADE5_SKILL_IDS = Object.keys(GRADE5_CONTENT);
