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
  accepts, hintLadder, randInt, pick,
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
function buildLongMul({ minA, maxA, twoDigitB, minB = 3, maxB = 9, story = 0.3 }) {
  return () => {
    const a = randInt(minA, maxA);
    let b;
    if (twoDigitB) {
      // A multiplier of 20, 30… hides the ones step, and ×11, ×21 makes it
      // trivial; keep both digits doing real work.
      do { b = randInt(12, 99); } while (b % 10 < 2);
    } else {
      b = randInt(minB, maxB);
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
function buildTwoDigitDiv({ dMin, dMax, qMin, qMax, story = 0.3 }) {
  return () => {
    let d, q, total;
    for (let i = 0; ; i++) {
      d = randInt(dMin, dMax);
      q = randInt(qMin, qMax);
      total = d * q;
      if ((total >= 100 && total <= 999 && q !== d) || i > 400) break;
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
  // three-digit × one-digit → three-digit × two-digit, which is the label.
  G5_MULTIPLICATION:  withKPs([
                        withWorkedExample(buildLongMul({ minA: 12, maxA: 99, twoDigitB: true })),
                        withWorkedExample(buildLongMul({ minA: 112, maxA: 999, twoDigitB: false })),
                        withWorkedExample(buildLongMul({ minA: 112, maxA: 999, twoDigitB: true })),
                      ]),
  // KP ladder: friendly two-digit divisors → the full range → remainders.
  G5_DIVISION:        withKPs([
                        withWorkedExample(buildTwoDigitDiv({ dMin: 11, dMax: 20, qMin: 11, qMax: 49 })),
                        withWorkedExample(buildTwoDigitDiv({ dMin: 21, dMax: 45, qMin: 11, qMax: 40 })),
                        withWorkedExample(buildTwoDigitDivRemainder({ dMin: 12, dMax: 30, qMin: 11, qMax: 30 })),
                      ]),
};

export const GRADE5_SKILL_IDS = Object.keys(GRADE5_CONTENT);
