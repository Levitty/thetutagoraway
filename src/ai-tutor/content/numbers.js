// ============================================================================
// NUMBER FOUNDATION CONTENT — decimals, integers, order of operations, indices,
// percentages, roots, primes. The everyday arithmetic that everything else
// rests on. All answers are numbers / index-forms / yes-no, verified by the
// quality gate. Decimal arithmetic uses integer scaling to avoid float drift.
// ============================================================================

import { accepts, hintLadder, randInt, nonzero, pick, coin, withWorkedExample, withLevels, columnOpModel, columnSteps } from './schema.js';

// Render a number cleanly (trim trailing zeros): 1.50 -> "1.5", 2.0 -> "2".
const numStr = (x) => {
  const r = Math.round(x * 1e6) / 1e6;
  return Number.isInteger(r) ? `${r}` : `${r}`.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
};
const signed = (x) => (x < 0 ? `(${x})` : `${x}`);

// ---- decimals: add / subtract (work in hundredths) ----
export function buildDecimalAddSub({ sub = false } = {}) {
  const A = randInt(11, 999), B = randInt(11, 999);   // hundredths
  let a = A, b = B;
  if (sub && a < b) [a, b] = [b, a];
  const res = (sub ? a - b : a + b) / 100;
  const x = numStr(a / 100), y = numStr(b / 100), op = sub ? '−' : '+';
  return {
    type: sub ? 'decimal-sub' : 'decimal-add',
    instruction: `${sub ? 'Subtract' : 'Add'} the decimals.`,
    question: `${x} ${op} ${y}`,
    answer: numStr(res),
    accepts: accepts(numStr(res)),
    // Place-value chart: the whole game is ALIGNMENT — points stacked in one
    // column. Practice shows the two numbers lined up; the reveal adds the
    // result row under the line.
    model: { type: 'place-value', data: { numbers: [x, y], op } },
    hints: hintLadder(
      'Line up the decimal points.',
      'Keep the decimal point in the same column in your answer.',
      `${sub ? 'Subtract' : 'Add'} as with whole numbers, then place the point.`,
    ),
    solution: {
      steps: [
        { text: 'Line up the decimal points and the place values.', expr: `${x} ${op} ${y}` },
        { text: `${sub ? 'Subtract' : 'Add'} column by column.`, expr: numStr(res),
          model: { type: 'place-value', data: { numbers: [x, y], op, result: numStr(res) } } },
      ],
      answer: numStr(res),
    },
    misconceptions: [],
    verify: { kind: 'fraction', value: res },
  };
}

// ---- decimals: multiply ----
export function buildDecimalMul() {
  let A = randInt(11, 99), B = randInt(2, 19);       // a.b  ×  c.d / c
  while (A % 10 === 0) A = randInt(11, 99);          // whole-number factors would break
  while (B % 10 === 0) B = randInt(2, 19);           // the "2 decimal places" teaching
  const a = A / 10, b = B / 10;
  const res = (A * B) / 100;
  return {
    type: 'decimal-mul',
    instruction: 'Multiply the decimals.',
    question: `${numStr(a)} × ${numStr(b)}`,
    answer: numStr(res),
    accepts: accepts(numStr(res)),
    hints: hintLadder(
      'Ignore the points and multiply as whole numbers.',
      `${A} × ${B} = ${A * B}.`,
      'Count the decimal places in the question (2 here) and put that many in the answer.',
    ),
    solution: {
      steps: [
        { text: 'Multiply without the points.', expr: `${A} × ${B} = ${A * B}` },
        { text: 'Replace the decimal point (2 places total).', expr: numStr(res) },
      ],
      answer: numStr(res),
    },
    misconceptions: [],
    verify: { kind: 'fraction', value: res },
  };
}

// ---- decimals: divide (engineered to terminate) ----
export function buildDecimalDiv() {
  const divisor = randInt(2, 9);
  let Q = randInt(11, 99);                // quotient in tenths
  while (Q % 10 === 0) Q = randInt(11, 99);   // keep the quotient genuinely decimal
  const dividend = (Q / 10) * divisor;
  return {
    type: 'decimal-div',
    instruction: 'Divide.',
    question: `${numStr(dividend)} ÷ ${divisor}`,
    answer: numStr(Q / 10),
    accepts: accepts(numStr(Q / 10)),
    hints: hintLadder(
      'Divide as normal, keeping the decimal point lined up.',
      `How many ${divisor}s make ${numStr(dividend)}?`,
    ),
    solution: { steps: [{ text: 'Short division, keeping the point in place.', expr: `${numStr(dividend)} ÷ ${divisor} = ${numStr(Q / 10)}` }], answer: numStr(Q / 10) },
    misconceptions: [],
    verify: { kind: 'fraction', value: Q / 10 },
  };
}

// ---- integers: add / subtract (signed) ----
export function buildIntegerAddSub() {
  let a, b, sub, res;
  do {
    a = randInt(-12, 12); b = randInt(-12, 12); sub = coin();
    res = sub ? a - b : a + b;
  } while (b === 0 || a === 0 || res === a || res === b);   // answer must not be an operand on the page
  const op = sub ? '−' : '+';
  return {
    type: 'integer-add-sub',
    instruction: 'Work out the answer.',
    question: `${a} ${op} ${signed(b)}`,
    answer: `${res}`,
    accepts: accepts(`${res}`),
    // Number-line picture: start at a, jump by ±b. Subtracting a negative
    // becomes a visible jump to the RIGHT — the model shows why. During
    // practice the landing value is hidden (that IS the answer); the worked
    // example / reveal shows the complete jump via the final step's model.
    model: { type: 'numberline-jump', data: {
      from: a, delta: sub ? -b : b, to: res, hideResult: true,
      caption: sub && b < 0 ? 'subtracting a negative moves you RIGHT' : undefined,
    } },
    hints: hintLadder(
      'Subtracting a negative is the same as adding; adding a negative is the same as subtracting.',
      'Think of a number line: which direction do you move?',
      `${a} ${op} ${signed(b)} = ?`,
    ),
    solution: {
      steps: [
        { text: 'Rewrite double signs (− − becomes +, + − becomes −).', expr: `${a} ${sub ? (b < 0 ? '+' : '−') : (b < 0 ? '−' : '+')} ${Math.abs(b)}` },
        { text: 'Compute.', expr: `${res}`,
          model: { type: 'numberline-jump', data: { from: a, delta: sub ? -b : b, to: res } } },
      ],
      answer: `${res}`,
    },
    misconceptions: [
      { when: `${sub ? a + b : a - b}`, feedback: 'Watch the signs — subtracting a negative ADDS.' },
    ],
    verify: { kind: 'fraction', value: res },
  };
}

// ---- integers: multiply / divide (signed) ----
export function buildIntegerMulDiv() {
  const mul = coin();
  let a, b, res;
  if (mul) { a = randInt(-9, 9) || 2; b = randInt(-9, 9) || 3; res = a * b; }
  else { b = randInt(2, 9) * (coin() ? 1 : -1); const q = randInt(-9, 9) || 2; a = b * q; res = q; }
  return {
    type: 'integer-mul-div',
    instruction: 'Work out the answer.',
    question: mul ? `${signed(a)} × ${signed(b)}` : `${signed(a)} ÷ ${signed(b)}`,
    answer: `${res}`,
    accepts: accepts(`${res}`),
    hints: hintLadder(
      'Same signs give a positive; different signs give a negative.',
      'Work out the size first, then decide the sign.',
    ),
    solution: {
      steps: [
        { text: 'Decide the sign: same → +, different → −.', expr: res < 0 ? 'negative' : 'positive' },
        { text: 'Multiply/divide the sizes.', expr: `${res}` },
      ],
      answer: `${res}`,
    },
    misconceptions: [
      { when: `${-res}`, feedback: 'Sign rule: same signs → positive, different signs → negative.' },
    ],
    verify: { kind: 'fraction', value: res },
  };
}

// ---- order of operations (BODMAS) ----
export function buildBodmas({ advanced = false } = {}) {
  let question, value;
  if (!advanced) {
    const a = randInt(2, 12), b = randInt(2, 9), c = randInt(2, 9);
    if (coin()) { question = `${a} + ${b} × ${c}`; value = a + b * c; }
    else { question = `${a + b * c} − ${b} × ${c}`; value = (a + b * c) - b * c; }
  } else {
    const a = randInt(2, 6), b = randInt(2, 6), c = randInt(2, 5), n = pick([2, 3]);
    if (coin()) { question = `(${a} + ${b}) × ${c}`; value = (a + b) * c; }
    else { question = `${a} × ${b}² − ${c}`; value = a * b * b - c; }
  }
  return {
    type: advanced ? 'bodmas-adv' : 'bodmas',
    instruction: 'Evaluate using the correct order of operations.',
    question,
    answer: `${value}`,
    accepts: accepts(`${value}`),
    hints: hintLadder(
      'BODMAS: Brackets, Orders (powers), Division/Multiplication, then Addition/Subtraction.',
      'Do multiplication/division before addition/subtraction.',
      'Work left to right within the same level.',
    ),
    solution: {
      steps: [
        { text: 'Apply BODMAS order.', expr: question },
        { text: 'Evaluate.', expr: `${value}` },
      ],
      answer: `${value}`,
    },
    misconceptions: [],
    verify: { kind: 'fraction', value },
  };
}

// ---- indices: evaluate a power ----
export function buildIndicesEval() {
  const base = randInt(2, 6), exp = randInt(2, 4);
  const value = Math.pow(base, exp);
  return {
    type: 'indices-eval',
    instruction: 'Evaluate.',
    question: `${base}^${exp}`,
    answer: `${value}`,
    accepts: accepts(`${value}`),
    hints: hintLadder(`${base}^${exp} means ${base} multiplied by itself ${exp} times.`,
      `${Array(exp).fill(base).join(' × ')}.`),
    solution: { steps: [{ text: 'Multiply the base repeatedly.', expr: `${Array(exp).fill(base).join(' × ')} = ${value}` }], answer: `${value}` },
    misconceptions: [{ when: `${base * exp}`, feedback: `${base}^${exp} is NOT ${base}×${exp}. It is ${base} multiplied by itself ${exp} times.` }],
    verify: { kind: 'fraction', value },
  };
}

// ---- indices: laws (write as a single power) ----
export function buildIndicesLaws() {
  const base = pick(['x', 'y', 'a']);
  const op = pick(['mul', 'div', 'pow']);
  let a, b, exp, q;
  if (op === 'mul') { a = randInt(2, 8); b = randInt(2, 8); exp = a + b; q = `${base}^${a} × ${base}^${b}`; }
  else if (op === 'div') { a = randInt(6, 12); b = randInt(2, 5); exp = a - b; q = `${base}^${a} ÷ ${base}^${b}`; }
  else { a = randInt(2, 5); b = randInt(2, 4); exp = a * b; q = `(${base}^${a})^${b}`; }
  const rule = op === 'mul' ? 'Multiplying: ADD the powers.' : op === 'div' ? 'Dividing: SUBTRACT the powers.' : 'Power of a power: MULTIPLY the powers.';
  return {
    type: 'indices-laws',
    instruction: `Simplify, leaving your answer as a single power of ${base}.`,
    question: `Simplify:   ${q}`,
    answer: `${base}^${exp}`,
    accepts: accepts(`${base}^${exp}`, `${base}^(${exp})`),
    hints: hintLadder(rule, `So the new power is ${op === 'mul' ? `${a}+${b}` : op === 'div' ? `${a}−${b}` : `${a}×${b}`} = ${exp}.`),
    solution: { steps: [{ text: rule, expr: `${base}^${exp}` }], answer: `${base}^${exp}` },
    misconceptions: [
      { when: op === 'mul' ? `${base}^${a * b}` : `${base}^${a + b}`, feedback: rule },
    ],
    verify: { kind: 'index', base, a, b, op },
  };
}

// ---- squares & square roots ----
export function buildSquare() {
  const n = randInt(2, 15);
  return {
    type: 'square', instruction: 'Find the square.',
    question: `${n}²`, answer: `${n * n}`, accepts: accepts(`${n * n}`),
    hints: hintLadder(`${n}² means ${n} × ${n}.`),
    solution: { steps: [{ text: 'Multiply the number by itself.', expr: `${n} × ${n} = ${n * n}` }], answer: `${n * n}` },
    misconceptions: [{ when: `${2 * n}`, feedback: `${n}² is ${n}×${n}, not ${n}×2.` }],
    verify: { kind: 'fraction', value: n * n },
  };
}

export function buildSquareRoot() {
  const n = randInt(2, 15);
  return {
    type: 'square-root', instruction: 'Find the square root.',
    question: `√${n * n}`, answer: `${n}`, accepts: accepts(`${n}`),
    hints: hintLadder('What number times itself gives this?', `? × ? = ${n * n}.`),
    solution: { steps: [{ text: 'Find the number whose square is this.', expr: `${n} × ${n} = ${n * n}, so √${n * n} = ${n}` }], answer: `${n}` },
    misconceptions: [{ when: `${(n * n) / 2}`, feedback: 'A square root is not half — find what multiplies by itself to give the number.' }],
    verify: { kind: 'fraction', value: n },
  };
}

// ---- cubes & cube roots ----
export function buildCubeRoot() {
  const n = randInt(2, 8), askRoot = coin();
  return askRoot
    ? {
        type: 'cube-root', instruction: 'Find the cube root.',
        question: `∛${n * n * n}`, answer: `${n}`, accepts: accepts(`${n}`),
        hints: hintLadder('What number cubed gives this?', `? × ? × ? = ${n * n * n}.`),
        solution: { steps: [{ text: 'Find the number whose cube is this.', expr: `${n}³ = ${n * n * n}` }], answer: `${n}` },
        misconceptions: [], verify: { kind: 'fraction', value: n },
      }
    : {
        type: 'cube', instruction: 'Find the cube.',
        question: `${n}³`, answer: `${n * n * n}`, accepts: accepts(`${n * n * n}`),
        hints: hintLadder(`${n}³ means ${n} × ${n} × ${n}.`),
        solution: { steps: [{ text: 'Multiply the number by itself three times.', expr: `${n} × ${n} × ${n} = ${n * n * n}` }], answer: `${n * n * n}` },
        misconceptions: [{ when: `${3 * n}`, feedback: `${n}³ is ${n}×${n}×${n}, not ${n}×3.` }],
        verify: { kind: 'fraction', value: n * n * n },
      };
}

// ---- prime or composite ----
const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
export function buildPrime() {
  const n = randInt(11, 60);
  const ans = isPrime(n) ? 'yes' : 'no';
  return {
    type: 'prime', instruction: 'Answer yes or no.',
    question: `Is ${n} a prime number?`, answer: ans, accepts: accepts(ans),
    hints: hintLadder(
      'A prime has exactly two factors: 1 and itself.',
      `Does any number from 2 up to √${n} (~${Math.floor(Math.sqrt(n))}) divide ${n}?`,
    ),
    solution: { steps: [{ text: 'Test for factors other than 1 and itself.', expr: `${n} is ${ans === 'yes' ? 'prime' : 'composite'}` }], answer: ans },
    misconceptions: [], verify: { kind: 'exact', value: ans },
  };
}

// ---- percentage increase / decrease ----
export function buildPercentageChange() {
  let base, up, p, value;
  do {
    base = pick([20, 40, 60, 80, 120, 160, 200, 240, 400]);
    up = coin();
    // decreasing by 50% would make the hint's "50% of base = …" the answer itself
    p = pick(up ? [5, 10, 15, 20, 25, 50] : [5, 10, 15, 20, 25]);
    value = up ? base + (base * p) / 100 : base - (base * p) / 100;
  } while (value === p);   // "Increase 20 by 25%" = 25 — answer already on the page
  return {
    type: 'percentage-change',
    instruction: 'Work out the new amount.',
    question: `${up ? 'Increase' : 'Decrease'} ${base} by ${p}%.`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder(
      `Find ${p}% of ${base} first.`,
      `${p}% of ${base} = ${(base * p) / 100}.`,
      `Then ${up ? 'add it to' : 'subtract it from'} ${base}.`,
    ),
    solution: {
      steps: [
        { text: `Find ${p}% of ${base}.`, expr: `${(base * p) / 100}` },
        { text: `${up ? 'Add to' : 'Subtract from'} the original.`, expr: `${value}` },
      ],
      answer: `${value}`,
    },
    misconceptions: [{ when: `${(base * p) / 100}`, feedback: `That's just ${p}% of the amount — ${up ? 'add it to' : 'subtract it from'} the original.` }],
    verify: { kind: 'fraction', value },
  };
}

// ---- simple interest ----
export function buildSimpleInterest() {
  const P = pick([1000, 2000, 4000, 5000, 8000, 10000]);
  const R = pick([2, 4, 5, 8, 10]);
  const T = randInt(2, 5);
  const value = (P * R * T) / 100;
  return {
    type: 'simple-interest',
    instruction: 'Find the simple interest.',
    question: `Find the simple interest on ${P} at ${R}% per year for ${T} years.`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('Simple Interest = (P × R × T) ÷ 100.', `P = ${P}, R = ${R}, T = ${T}.`),
    solution: {
      steps: [
        { text: 'Use I = PRT/100.', expr: `(${P} × ${R} × ${T}) ÷ 100` },
        { text: 'Evaluate.', expr: `${value}` },
      ],
      answer: `${value}`,
    },
    misconceptions: [], verify: { kind: 'fraction', value },
  };
}

// ---- number patterns: find the next term (G5 algebra readiness) ----
export function buildNumberPattern() {
  const geometric = Math.random() < 0.3;
  const start = randInt(1, 8);
  let seq, next;
  if (geometric) {
    const r = pick([2, 3]);
    seq = [0, 1, 2, 3].map((i) => start * Math.pow(r, i));
    next = start * Math.pow(r, 4);
  } else {
    const d = randInt(2, 9) * (coin() ? 1 : -1);
    seq = [0, 1, 2, 3].map((i) => start + i * d);
    next = start + 4 * d;
  }
  return {
    type: 'number-pattern', instruction: 'Find the next term in the pattern.',
    question: `What comes next?   ${seq.join(', ')}, ?`,
    answer: `${next}`, accepts: accepts(`${next}`),
    hints: hintLadder('Look at how you get from one term to the next.',
      geometric ? 'Each term is multiplied by the same number.' : 'The same amount is added each time.'),
    solution: { steps: [
      { text: geometric ? 'Find the common ratio (each ÷ previous).' : 'Find the common difference (each − previous).', expr: geometric ? `× ${seq[1] / seq[0]}` : `${seq[1] - seq[0] >= 0 ? '+' : ''}${seq[1] - seq[0]}` },
      { text: 'Apply it to the last term.', expr: `${next}` }], answer: `${next}` },
    misconceptions: [], verify: { kind: 'fraction', value: next },
  };
}

// ---- find the missing number (G5 algebra readiness) ----
export function buildMissingNumber() {
  const a = randInt(2, 12), miss = randInt(1, 15);
  const form = pick(['add', 'addFront', 'sub']);
  let question, value;
  if (form === 'add') { question = `${a} + ☐ = ${a + miss}`; value = miss; }
  else if (form === 'addFront') { question = `☐ + ${a} = ${a + miss}`; value = miss; }
  else { question = `☐ − ${a} = ${miss}`; value = a + miss; }
  return {
    type: 'missing-number', instruction: 'Find the missing number (☐).',
    question: `Find the missing number:   ${question}`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('Use the inverse operation to undo what is done.',
      form === 'sub' ? 'To undo a subtraction, add.' : 'To find a missing part, subtract from the total.'),
    solution: { steps: [{ text: 'Work backwards with the inverse operation.', expr: `☐ = ${value}` }], answer: `${value}` },
    misconceptions: [], verify: { kind: 'fraction', value },
  };
}

// ============================================================================
// CONCRETE / PICTORIAL builders (CPA) — integers on a number line, decimals on
// a 10×10 grid. For kids who don't yet have the concept.
// ============================================================================

// CONCRETE: place an integer on the number line (G6_INTEGERS_INTRO).
export function buildPlaceInteger() {
  const v = nonzero(-9, 9);
  return {
    type: 'place-integer', instruction: 'Place the integer on the number line.',
    question: `Place ${v} on the number line.`,
    answer: `${v}`, accepts: accepts(`${v}`),
    hints: hintLadder(
      'Zero is in the middle. Positive numbers go right, negative numbers go left.',
      `${v} is ${Math.abs(v)} steps to the ${v < 0 ? 'left' : 'right'} of 0.`,
    ),
    solution: { steps: [{ text: `Count ${Math.abs(v)} from 0 going ${v < 0 ? 'left' : 'right'}.`, expr: `${v}` }], answer: `${v}` },
    misconceptions: [{ when: `${-v}`, feedback: 'Check the sign — negatives are to the LEFT of zero.' }],
    visual: { type: 'integer_line', data: { min: -10, max: 10 }, check: 'number-line', target: v, tolerance: 0.5 },
    verify: { kind: 'fraction', value: v },
  };
}

// CONCRETE: add/subtract integers as a jump on the number line (G6_INTEGERS_ADD_SUB).
export function buildIntegerJump() {
  const a = nonzero(-6, 6), b = randInt(2, 7), sub = coin();
  const result = sub ? a - b : a + b, dir = sub ? 'left' : 'right';
  return {
    type: 'integer-jump',
    instruction: 'Use the number line to find where you land.',
    question: `Start at ${a}, then ${sub ? 'subtract' : 'add'} ${b} (jump ${b} ${dir}). Where do you land?`,
    answer: `${result}`, accepts: accepts(`${result}`),
    hints: hintLadder(
      `${sub ? 'Subtracting' : 'Adding'} moves you to the ${dir} on the number line.`,
      `Start at ${a} and count ${b} steps ${dir}.`,
    ),
    solution: { steps: [
      { text: `From ${a}, jump ${b} ${dir}.`, expr: `${a} ${sub ? '−' : '+'} ${b}` },
      { text: 'Land here.', expr: `${result}` },
    ], answer: `${result}` },
    misconceptions: [{ when: `${sub ? a + b : a - b}`, feedback: `Wrong direction — ${sub ? 'subtracting goes LEFT' : 'adding goes RIGHT'}.` }],
    visual: { type: 'integer_line', data: { min: -13, max: 13, start: a }, check: 'number-line', target: result, tolerance: 0.5 },
    verify: { kind: 'fraction', value: result },
  };
}

// CONCRETE: shade a 10×10 grid to show a decimal (G5_DECIMALS_INTRO).
export function buildDecimalGrid() {
  // Avoid 0.01 and 0.10: the teaching hints ("each square is 0.01", "each row
  // is 0.1") would state those answers outright.
  let h = randInt(2, 99);
  while (h === 10) h = randInt(2, 99);
  const val = h / 100, vs = `${val}`;
  return {
    type: 'decimal-grid', instruction: 'Shade the grid to show the decimal.',
    question: `Shade the grid to show ${vs}.`,
    answer: vs, accepts: accepts(vs, `${h}/100`),
    hints: hintLadder(
      'The whole grid is 1. Each small square is 0.01 (one hundredth).',
      'Read the digits after the point as hundredths — that counts your squares.',
      'Each full row is 0.1 (ten hundredths).',
    ),
    solution: { steps: [{ text: `${vs} = ${h} hundredths, so shade ${h} of the 100 squares.`, expr: vs }], answer: vs },
    misconceptions: [],
    visual: { type: 'decimal_grid', data: { mode: 'make' }, check: 'fraction-bar', target: val, tolerance: 0.001 },
    verify: { kind: 'fraction', value: val },
  };
}

// ABSTRACT: 2-digit × 1-digit multiplication.
export function buildMultiplyFact() {
  const a = randInt(11, 49), b = randInt(2, 9), value = a * b;
  const tens = Math.floor(a / 10) * 10, ones = a % 10;
  return {
    type: 'multiply-fact', instruction: 'Work out the product.',
    question: `${a} × ${b}`, answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder(
      'Split the bigger number into tens and ones.',
      `${tens} × ${b}  and  ${ones} × ${b}, then add.`,
    ),
    solution: { steps: [
      { text: 'Multiply the tens and the ones separately.', expr: `${tens}×${b} + ${ones}×${b}` },
      { text: 'Add.', expr: `${value}` },
    ], answer: `${value}` },
    misconceptions: [], verify: { kind: 'fraction', value },
  };
}

// CONCRETE: multiplication as a dot array (rows of columns).
export function buildMultiplicationArray() {
  const rows = randInt(2, 6), cols = randInt(2, 6), value = rows * cols;
  return {
    type: 'multiply-array', instruction: 'Count the dots.',
    question: `How many dots altogether?  (${rows} rows of ${cols})`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder(
      'Multiplication is "rows of" — equal groups.',
      `${rows} rows, each with ${cols} dots.`,
      `${rows} × ${cols}.`,
    ),
    solution: { steps: [{ text: `${rows} rows of ${cols} = ${rows} × ${cols}.`, expr: `${value}` }], answer: `${value}` },
    misconceptions: [{ when: `${rows + cols}`, feedback: 'That\'s adding — multiply: count every dot, which is rows × columns.' }],
    visual: { type: 'array_dots', data: { rows, cols, groupByRow: true } },
    verify: { kind: 'fraction', value },
  };
}

// ABSTRACT: exact division fact.
export function buildDivideFact() {
  const d = randInt(2, 9);
  let q = randInt(2, 12);
  while (q === d) q = randInt(2, 12);   // q === d would put the answer in the hint ("how many 3s make 9?")
  const a = d * q;
  return {
    type: 'divide-fact', instruction: 'Work out the quotient.',
    question: `${a} ÷ ${d}`, answer: `${q}`, accepts: accepts(`${q}`),
    hints: hintLadder('How many groups of the divisor fit?', `How many ${d}s make ${a}?`),
    solution: { steps: [{ text: `${d} × ? = ${a}.`, expr: `${a} ÷ ${d} = ${q}` }], answer: `${q}` },
    misconceptions: [], verify: { kind: 'fraction', value: q },
  };
}

// CONCRETE: division as sharing a dot array into equal rows.
export function buildDivisionArray() {
  const rows = randInt(2, 6);
  let cols = randInt(2, 6);
  while (cols === rows) cols = randInt(2, 6);   // rows === cols would make the hint's row count the answer
  const total = rows * cols;
  return {
    type: 'divide-array', instruction: 'Share equally and count.',
    question: `${total} dots are arranged in ${rows} equal rows. How many in each row?`,
    answer: `${cols}`, accepts: accepts(`${cols}`),
    hints: hintLadder(
      'Division is sharing into equal groups.',
      `Share ${total} into ${rows} equal rows — count one row.`,
      `${total} ÷ ${rows}.`,
    ),
    solution: { steps: [{ text: `${total} shared into ${rows} rows = ${total} ÷ ${rows}.`, expr: `${cols}` }], answer: `${cols}` },
    misconceptions: [], visual: { type: 'array_dots', data: { rows, cols, groupByRow: true } },
    verify: { kind: 'fraction', value: cols },
  };
}

// PICTORIAL: value of a digit shown in a place-value chart (column = value).
export function buildPlaceValueChart() {
  const nDigits = pick([4, 5]);
  const placeVals = [];
  for (let i = nDigits - 1; i >= 0; i--) placeVals.push(Math.pow(10, i));   // 1000,100,10,1
  const digits = placeVals.map(() => randInt(1, 9));                         // no zeros, clean questions
  const hi = randInt(0, nDigits - 2);       // skip the ones column (value = digit is no test)
  digits[hi] = randInt(2, 9);               // digit 1 would make the column name in the hint the answer
  const digit = digits[hi], place = placeVals[hi], value = digit * place;
  const numStr = Number(digits.join('')).toLocaleString('en-US');
  return {
    type: 'place-value-chart', instruction: 'Find the value of the highlighted digit.',
    question: `In ${numStr}, what is the value of the highlighted digit (${digit})?`,
    answer: `${value}`, accepts: accepts(`${value}`, value.toLocaleString('en-US')),
    hints: hintLadder(
      `The digit ${digit} sits in the ${place}s column.`,
      'Multiply the digit by what its column is worth.',
    ),
    solution: { steps: [{ text: `That column is worth ${place}.`, expr: `${digit} × ${place} = ${value}` }], answer: `${value}` },
    misconceptions: [{ when: `${digit}`, feedback: `A digit's value depends on its COLUMN — it's ${digit} × ${place}, not just ${digit}.` }],
    visual: { type: 'place_value_chart', data: { digits, labels: placeVals.map(String), highlight: hi } },
    verify: { kind: 'fraction', value },
  };
}

// ---- share a quantity in a ratio (G6) — taught with a two-colour ratio bar ----
export function buildRatioShare() {
  const [a, b] = pick([[1, 2], [1, 3], [2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [2, 7]]);
  const per = randInt(2, 9);
  const total = (a + b) * per;
  const [name1, name2] = pick([['Amina', 'Baraka'], ['Wanjiku', 'Otieno'], ['Zawadi', 'Kiprop'], ['Njeri', 'Mwangi']]);
  const item = pick(['sweets', 'mangoes', 'shillings', 'marbles']);
  // never ask about a 1-part share: "one part = total ÷ parts" would BE the answer
  const askFirst = a === 1 ? false : b === 1 ? true : coin();
  const share1 = a * per, share2 = b * per;
  const value = askFirst ? share1 : share2;
  const asked = askFirst ? name1 : name2;
  const parts = askFirst ? a : b;
  const barData = (labeled) => ({ type: 'bar-model', data: {
    bars: [{ n: 0, d: a + b, label: `${total}`, parts: [
      { count: a, color: '#34d399', label: labeled ? `${name1}: ${share1}` : name1 },
      { count: b, color: '#38bdf8', label: labeled ? `${name2}: ${share2}` : name2 },
    ] }],
    caption: labeled
      ? `${a + b} equal parts of ${per} each — ${name1} takes ${a} parts, ${name2} takes ${b}`
      : `${total} ${item} cut into ${a} + ${b} = ${a + b} equal parts`,
  } });
  return {
    type: 'ratio-share',
    instruction: 'Share in the given ratio.',
    question: `${name1} and ${name2} share ${total} ${item} in the ratio ${a}:${b}. How many does ${asked} get?`,
    answer: `${value}`, accepts: accepts(`${value}`),
    model: barData(false),
    hints: hintLadder(
      'The ratio tells you how many equal parts each person gets.',
      `Total parts = ${a} + ${b} = ${a + b}. One part = ${total} ÷ ${a + b}.`,
      `How many parts does ${asked} get? Multiply that by the size of one part.`,
    ),
    solution: {
      steps: [
        { text: `Add the ratio numbers to get the total parts.`, expr: `${a} + ${b} = ${a + b} parts` },
        { text: `Divide to find one part.`, expr: `${total} ÷ ${a + b} = ${per}` },
        { text: `${asked} gets ${parts} part${parts > 1 ? 's' : ''}.`, expr: `${parts} × ${per} = ${value}`,
          model: barData(true) },
      ],
      answer: `${value}`,
    },
    misconceptions: [
      ...(total / 2 !== value ? [{ when: `${total / 2}`, feedback: `Halving shares it equally — but the ratio ${a}:${b} is NOT equal. Split into ${a + b} parts first.` }] : []),
      { when: `${askFirst ? share2 : share1}`, feedback: `That is ${askFirst ? name2 : name1}'s share — the question asks for ${asked}, who gets ${parts} part${parts > 1 ? 's' : ''}.` },
    ],
    verify: { kind: 'fraction', value },
  };
}


// ============================================================================
// CAMBRIDGE GAP FILL — Number strand (Stages 7-9). Authored to the full bar:
// worked examples, hint ladders, NAMED misconceptions, verified answers.
// ============================================================================

// ---- G7: place value in large numbers (to hundred millions) ----
export function buildBigPlaceValue() {
  const len = pick([6, 7, 8, 9]);
  const digits = [randInt(1, 9), ...Array.from({ length: len - 1 }, () => randInt(0, 9))];
  const pos = pick(digits.map((d, i) => d !== 0 ? i : null).filter(i => i !== null));
  const digit = digits[pos];
  const placeVal = Math.pow(10, len - 1 - pos);
  // ones place (value = digit) and digit 1 (value = place named in the hint)
  // both put the answer on the page — reroll
  if (placeVal === 1 || digit === 1) return buildBigPlaceValue();
  const value = digit * placeVal;
  const nStr = digits.join('');
  const pretty = Number(nStr).toLocaleString('en-KE');
  const NAMES = { 1: 'ones', 10: 'tens', 100: 'hundreds', 1000: 'thousands', 10000: 'ten thousands', 100000: 'hundred thousands', 1000000: 'millions', 10000000: 'ten millions', 100000000: 'hundred millions' };
  return {
    type: 'big-place-value', instruction: 'Think about the digit\'s column.',
    question: `In the number ${pretty}, what is the VALUE of the digit ${digit}${digits.filter(d => d === digit).length > 1 ? ` in the ${NAMES[placeVal]} place` : ''}?`,
    answer: `${value}`, accepts: accepts(`${value}`, value.toLocaleString('en-KE')),
    hints: hintLadder('Read the number in groups of three from the right: ones, thousands, millions.',
      `Count the digits after the ${digit}: each one multiplies its value by 10.`,
      `The ${digit} sits in the ${NAMES[placeVal]} place.`),
    solution: { steps: [
      { text: 'Find the digit\'s place.', expr: `${digit} is in the ${NAMES[placeVal]}` },
      { text: 'Multiply digit × place.', expr: `${digit} × ${placeVal.toLocaleString('en-KE')} = ${value.toLocaleString('en-KE')}` }], answer: `${value}` },
    misconceptions: [{ when: `${digit}`, feedback: `${digit} is just the digit. Its VALUE depends on the column: ${digit} ${NAMES[placeVal]} = ${value.toLocaleString('en-KE')}.` }],
    verify: { kind: 'fraction', value },
  };
}

// ---- G7: divisibility tests ----
export function buildDivisibility() {
  const rule = pick([2, 3, 4, 5, 9, 10]);
  const kind = pick(['yesno', 'digit']);
  if (kind === 'digit') {
    // "What is the smallest digit that makes 51_ divisible by 3?"
    const base = randInt(10, 98);
    const target = pick([3, 9]);
    let value = 0;
    const digitSum = `${base}`.split('').reduce((t, d) => t + +d, 0);
    while ((digitSum + value) % target !== 0) value++;
    return {
      type: 'divisibility-digit', instruction: 'Use the digit-sum rule.',
      question: `What is the SMALLEST digit that can replace _ so that ${base}_ is divisible by ${target}?`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(`A number is divisible by ${target} when its DIGIT SUM is divisible by ${target}.`,
        `The digits so far add to ${digitSum}.`,
        `What is the smallest digit that lifts ${digitSum} to a multiple of ${target}?`),
      solution: { steps: [
        { text: 'Add the known digits.', expr: `${'${base}'.split('').join(' + ')} = ${digitSum}` },
        { text: `Find the smallest digit reaching a multiple of ${target}.`, expr: `${digitSum} + ${value} = ${digitSum + value}` }], answer: `${value}` },
      misconceptions: [],
      verify: { kind: 'fraction', value },
    };
  }
  // yes/no with an engineered near-miss
  const divisible = coin();
  let n;
  do {
    n = randInt(120, 9800);
    if (divisible) n = n - (n % rule);
    else if (n % rule === 0) n += 1;
  } while (rule === 4 && n < 100);
  const value = n % rule === 0 ? 'yes' : 'no';
  const RULES = {
    2: 'its last digit is even', 3: 'its digit sum is divisible by 3',
    4: 'its last TWO digits form a number divisible by 4', 5: 'it ends in 0 or 5',
    9: 'its digit sum is divisible by 9', 10: 'it ends in 0',
  };
  const evidence = rule === 3 || rule === 9
    ? `digit sum = ${'${n}'.split('').join(' + ')} = ${`${n}`.split('').reduce((t, d) => t + +d, 0)}`
    : rule === 4 ? `last two digits: ${`${n}`.slice(-2)}` : `last digit: ${n % 10}`;
  return {
    type: 'divisibility', instruction: 'Answer yes or no — no long division needed.',
    question: `Is ${n.toLocaleString('en-KE')} divisible by ${rule}?`,
    answer: value, accepts: accepts(value),
    hints: hintLadder(`There is a shortcut: a number is divisible by ${rule} when ${RULES[rule]}.`,
      `Check: ${evidence}.`, 'No long division needed — just the test.'),
    solution: { steps: [
      { text: `Test for ${rule}: ${RULES[rule]}.`, expr: evidence },
      { text: 'Conclude.', expr: value }], answer: value },
    misconceptions: (rule === 3 || rule === 9)
      ? [{ when: value === 'yes' ? 'no' : 'yes', feedback: `Don't judge by the last digit — for ${rule} you must add ALL the digits.` }]
      : [],
    verify: { kind: 'exact', value },
  };
}

// ---- G7: prime factorization ----
export function buildPrimeFactorization() {
  const exps = { 2: randInt(1, 3), 3: randInt(0, 2), 5: coin() ? 1 : 0, 7: coin() ? 1 : 0 };
  let n = 1;
  for (const [p, e] of Object.entries(exps)) n *= Math.pow(+p, e);
  if (n < 12 || n > 900) return buildPrimeFactorization();
  const primes = Object.entries(exps).filter(([, e]) => e > 0).map(([p]) => +p);
  const largest = Math.max(...primes);
  const count = Object.values(exps).reduce((t, e) => t + e, 0);
  const askLargest = coin();
  const value = askLargest ? largest : count;
  const tree = Object.entries(exps).filter(([, e]) => e > 0).map(([p, e]) => e > 1 ? `${p}^${e}` : `${p}`).join(' × ');
  return {
    type: 'prime-factorization', instruction: 'Break it into primes first.',
    question: askLargest
      ? `What is the LARGEST prime factor of ${n}?`
      : `How many prime factors does ${n} have in total (counting repeats)?`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('Divide by the smallest primes first: 2, then 3, then 5…',
      'Keep dividing until every branch of the factor tree ends in a prime.',
      askLargest ? 'Divide out the small primes completely — the prime left standing at the end is the one.' : `${n} = ${tree}.`),
    solution: { steps: [
      { text: 'Build the factor tree (divide by small primes repeatedly).', expr: `${n} = ${tree}` },
      { text: askLargest ? 'Pick the largest prime in the product.' : 'Count every prime, including repeats.', expr: `${value}` }], answer: `${value}` },
    misconceptions: askLargest
      ? [{ when: `${n}`, feedback: `${n} is the whole number — we want the largest PRIME in its factor tree.` }]
      : [{ when: `${primes.length}`, feedback: primes.length !== count ? 'Count repeats too: 2 × 2 × 3 has THREE prime factors.' : 'Recount carefully.' }].filter(m => m.when !== `${value}`),
    verify: { kind: 'fraction', value },
  };
}

// ---- G7: decimal place value — the "longer means larger" killer ----
export function buildDecimalPV() {
  if (coin()) {
    // Compare: engineered so the SHORTER decimal is often the larger one.
    const a = randInt(3, 9) / 10;                       // e.g. 0.4
    const b = +(a - 0.1 + randInt(1, 9) / 100).toFixed(2);   // e.g. 0.35
    if (b >= a || b <= 0) return buildDecimalPV();
    const value = a;
    return {
      type: 'decimal-compare', instruction: 'Answer with the number.',
      question: `Which is larger: ${b} or ${a}?`,
      answer: `${value}`, accepts: accepts(`${value}`),
      model: { type: 'place-value', data: { numbers: [`${b}`, `${a}`], caption: 'line up the tenths column and compare there first' } },
      hints: hintLadder('Compare place by place, starting from the TENTHS.',
        `Tenths: ${Math.floor(b * 10) % 10} against ${Math.floor(a * 10) % 10}.`,
        'More digits does NOT mean bigger.'),
      solution: { steps: [
        { text: 'Compare the tenths first.', expr: `${Math.floor(b * 10) % 10} < ${Math.floor(a * 10) % 10}` },
        { text: 'The larger tenths digit wins.', expr: `${value}` }], answer: `${value}` },
      misconceptions: [{ when: `${b}`, feedback: `${b} has more digits but they sit in SMALLER columns. ${a} wins in the tenths — longer is not larger.` }],
      verify: { kind: 'fraction', value },
    };
  }
  const intPart = randInt(1, 9), d1 = randInt(1, 9), d2 = randInt(1, 9), d3 = randInt(1, 9);
  const x = `${intPart}.${d1}${d2}${d3}`;
  const which = pick([1, 2, 3]);
  const digit = [d1, d2, d3][which - 1];
  const value = digit / Math.pow(10, which);
  const NAME = { 1: 'tenths', 2: 'hundredths', 3: 'thousandths' }[which];
  return {
    type: 'decimal-digit-value', instruction: 'Think about the column after the point.',
    question: `In ${x}, what is the VALUE of the digit ${digit}${[d1, d2, d3].filter(d => d === digit).length > 1 ? ` in the ${NAME} place` : ''}?`,
    answer: `${value}`, accepts: accepts(`${value}`, `${digit}/${Math.pow(10, which)}`),
    model: { type: 'place-value', data: { numbers: [x] } },
    hints: hintLadder('After the point the columns shrink: tenths, hundredths, thousandths.',
      `Count the places after the point up to the ${digit}.`,
      `The ${digit} is in the ${NAME} column.`),
    solution: { steps: [
      { text: 'Locate the column.', expr: `${digit} is in the ${NAME}` },
      { text: 'Write its value.', expr: `${digit} ÷ ${Math.pow(10, which)} = ${value}` }], answer: `${value}` },
    misconceptions: [{ when: `${digit}`, feedback: `${digit} is the digit; its VALUE in the ${NAME} column is ${value}.` }],
    verify: { kind: 'fraction', value },
  };
}

// ---- G7: squares of decimals and fractions ----
export function buildSquaresExtended() {
  if (coin()) {
    const d = randInt(2, 9);
    const x = d / 10;
    const value = +(x * x).toFixed(2);
    return {
      type: 'square-decimal', instruction: 'Square it.',
      question: `Work out (${x})²`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder('Squaring means multiplying the number by ITSELF.',
        `${x} × ${x} — multiply ${d} × ${d}, then place the decimal.`,
        `${d} × ${d} = ${d * d}, and tenths × tenths = hundredths.`),
      solution: { steps: [
        { text: 'Multiply the digits.', expr: `${d} × ${d} = ${d * d}` },
        { text: 'Tenths × tenths gives hundredths (two decimal places).', expr: `${value}` }], answer: `${value}` },
      misconceptions: [{ when: `${+(2 * x).toFixed(1)}`, feedback: 'That is DOUBLING. Squaring multiplies the number by itself.' }],
      verify: { kind: 'fraction', value },
    };
  }
  let a = randInt(1, 7), b = randInt(2, 9);
  while (a >= b) { a = randInt(1, 7); b = randInt(2, 9); }
  const g = (x, y) => { let p = x, q = y; while (q) [p, q] = [q, p % q]; return p; };
  const gg = g(a, b); a /= gg; b /= gg;
  const value = (a * a) / (b * b);
  return {
    type: 'square-fraction', instruction: 'Square it.',
    question: `Work out (${a}/${b})²`,
    answer: `${a * a}/${b * b}`, accepts: accepts(`${a * a}/${b * b}`),
    hints: hintLadder('Squaring a fraction squares BOTH the top and the bottom.',
      `(${a}/${b})² = (${a} × ${a})/(${b} × ${b}).`,
      `Top: ${a * a}. Bottom: ${b * b}.`),
    solution: { steps: [
      { text: 'Square numerator and denominator separately.', expr: `${a}²/${b}² = ${a * a}/${b * b}` }], answer: `${a * a}/${b * b}` },
    misconceptions: [{ when: `${a * a}/${b}`, feedback: 'You squared only the top — the DENOMINATOR gets squared too.' }],
    verify: { kind: 'fraction', value },
  };
}

// ---- G8: standard form ----
export function buildStandardForm() {
  const mant = randInt(11, 99) / 10;                    // 1.1 … 9.9
  const exp = randInt(3, 6);
  const ordinary = Math.round(mant * Math.pow(10, exp));
  if (coin()) {
    return {
      type: 'standard-to-ordinary', instruction: 'Write it out in full.',
      question: `Write ${mant} × 10^${exp} as an ordinary number.`,
      answer: `${ordinary}`, accepts: accepts(`${ordinary}`, ordinary.toLocaleString('en-KE')),
      hints: hintLadder(`10^${exp} means the point moves ${exp} places to the RIGHT.`,
        `Start at ${mant} and shift the decimal point ${exp} places, filling with zeros.`,
        `${mant} → ${mant * 10} → ${mant * 100} → …`),
      solution: { steps: [
        { text: `Shift the decimal point ${exp} places right.`, expr: `${mant} × 10^${exp} = ${ordinary.toLocaleString('en-KE')}` }], answer: `${ordinary}` },
      misconceptions: [{ when: `${Math.round(mant * Math.pow(10, exp - 1))}`, feedback: `Count again — the power says ${exp} shifts, one for every factor of 10.` }],
      verify: { kind: 'fraction', value: ordinary },
    };
  }
  const answer = `${mant}×10^${exp}`;
  return {
    type: 'ordinary-to-standard', instruction: 'One digit before the point, times a power of 10.',
    question: `Write ${ordinary.toLocaleString('en-KE')} in standard form.`,
    answer,
    accepts: accepts(answer, `${mant}x10^${exp}`, `${mant}*10^${exp}`, `${mant} × 10^${exp}`, `${mant}e${exp}`),
    hints: hintLadder('Standard form is  a × 10^n  with 1 ≤ a < 10.',
      `Place the point after the first digit: ${mant}.`,
      `Count how many places the point moved — that is the power.`),
    solution: { steps: [
      { text: 'Put the point after the first significant digit.', expr: `${mant}` },
      { text: `Count the shifts back to the original number.`, expr: `${exp} places → ${answer}` }], answer },
    misconceptions: [{ when: `${mant}×10^${exp + 1}`, feedback: 'Off by one — count the point\'s moves carefully, not the number of digits.' }],
    verify: { kind: 'exact', value: answer },
  };
}

// ---- G8: proportion (unitary method) — with the additive-error trap ----
export function buildProportion() {
  const unit = pick([15, 20, 25, 30, 40, 50]);
  const n1 = randInt(3, 8);
  let n2 = randInt(3, 12);
  while (n2 === n1) n2 = randInt(3, 12);
  const cost1 = unit * n1, value = unit * n2;
  const item = pick(['exercise books', 'pens', 'mandazi', 'oranges', 'chapati']);
  const additive = cost1 + (n2 - n1);
  return {
    type: 'proportion', instruction: 'Find the value of ONE first.',
    question: `${n1} ${item} cost ${cost1} shillings. How much do ${n2} ${item} cost?`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}/-`),
    hints: hintLadder('Unitary method: find the price of ONE first.',
      `One costs ${cost1} ÷ ${n1}.`,
      `Then multiply by ${n2}.`),
    solution: { steps: [
      { text: 'Price of one.', expr: `${cost1} ÷ ${n1} = ${unit}` },
      { text: `Price of ${n2}.`, expr: `${unit} × ${n2} = ${value}` }], answer: `${value}` },
    misconceptions: additive !== value ? [{ when: `${additive}`, feedback: `Prices don't grow by ADDING the extra count — each ${item.slice(0, -1)} costs ${unit}/-, so scale by multiplying.` }] : [],
    verify: { kind: 'fraction', value },
  };
}

// ---- G8: profit, loss & percentage — always on the COST price ----
export function buildProfitLoss() {
  const cp = pick([200, 400, 500, 800, 1000, 1200, 2000]);
  const pct = pick([5, 10, 15, 20, 25, 30]);
  const isProfit = coin();
  const change = (cp * pct) / 100;
  const sp = isProfit ? cp + change : cp - change;
  const askPct = coin();
  if (askPct) {
    const wrongOnSP = Math.round((change / sp) * 100);
    return {
      type: 'profit-percent', instruction: 'Percentage change is measured on the BUYING price.',
      question: `A trader buys a radio for ${cp}/- and sells it for ${sp}/-. Find the percentage ${isProfit ? 'profit' : 'loss'}.`,
      answer: `${pct}`, accepts: accepts(`${pct}`, `${pct}%`),
      hints: hintLadder(`First find the actual ${isProfit ? 'profit' : 'loss'} in shillings.`,
        `${isProfit ? 'Profit' : 'Loss'} = ${isProfit ? `${sp} − ${cp}` : `${cp} − ${sp}`} = ${change}.`,
        `Percentage = (${change} ÷ ${cp}) × 100 — divide by what was PAID.`),
      solution: { steps: [
        { text: `Find the ${isProfit ? 'profit' : 'loss'}.`, expr: `${change}/-` },
        { text: 'Divide by the COST price and make it a percentage.', expr: `(${change} ÷ ${cp}) × 100 = ${pct}%` }], answer: `${pct}` },
      misconceptions: wrongOnSP !== pct ? [{ when: `${wrongOnSP}`, feedback: `You divided by the SELLING price. Percentage profit/loss is always measured against the COST price (${cp}/-).` }] : [],
      verify: { kind: 'fraction', value: pct },
    };
  }
  return {
    type: 'selling-price', instruction: 'Work out the selling price.',
    question: `A shopkeeper buys a bag for ${cp}/- and sells it at a ${pct}% ${isProfit ? 'profit' : 'loss'}. Find the selling price.`,
    answer: `${sp}`, accepts: accepts(`${sp}`, `${sp}/-`),
    hints: hintLadder(`${pct}% of the cost price is the ${isProfit ? 'profit' : 'loss'} in shillings.`,
      `${pct}% of ${cp} = ${change}.`,
      `${isProfit ? 'Add it to' : 'Subtract it from'} the cost price.`),
    solution: { steps: [
      { text: `Find ${pct}% of the cost.`, expr: `${pct}% × ${cp} = ${change}` },
      { text: isProfit ? 'Add the profit.' : 'Subtract the loss.', expr: `${cp} ${isProfit ? '+' : '−'} ${change} = ${sp}` }], answer: `${sp}` },
    misconceptions: [{ when: `${change}`, feedback: `${change}/- is only the ${isProfit ? 'profit' : 'loss'}. The question asks the full SELLING price.` }],
    verify: { kind: 'fraction', value: sp },
  };
}

// ---- G9: compound interest — taught year by year, not by formula magic ----
export function buildCompoundInterest() {
  const combo = pick([
    { P: 10000, r: 10, n: 2 }, { P: 20000, r: 10, n: 2 }, { P: 5000, r: 10, n: 3 },
    { P: 10000, r: 10, n: 3 }, { P: 8000, r: 5, n: 2 }, { P: 40000, r: 5, n: 2 },
    { P: 2500, r: 20, n: 2 }, { P: 5000, r: 20, n: 2 },
  ]);
  const { P, r, n } = combo;
  const years = [];
  let amount = P;
  for (let y = 1; y <= n; y++) {
    const interest = (amount * r) / 100;
    years.push({ y, start: amount, interest, end: amount + interest });
    amount += interest;
  }
  const value = amount;
  const simple = P + (P * r * n) / 100;
  return {
    type: 'compound-interest', instruction: 'Interest earns interest — work year by year.',
    question: `${P.toLocaleString('en-KE')} shillings is saved at ${r}% COMPOUND interest per year. How much is in the account after ${n} years?`,
    answer: `${value}`, accepts: accepts(`${value}`, value.toLocaleString('en-KE')),
    hints: hintLadder('Each year\'s interest is calculated on the NEW balance, not the original.',
      `Year 1: ${r}% of ${P.toLocaleString('en-KE')} = ${years[0].interest.toLocaleString('en-KE')} → balance ${years[0].end.toLocaleString('en-KE')}.`,
      `Now repeat on ${years[0].end.toLocaleString('en-KE')}, not on ${P.toLocaleString('en-KE')}.`),
    solution: { steps: [
      ...years.map(({ y, start, interest, end }) => (
        { text: `Year ${y}: ${r}% of ${start.toLocaleString('en-KE')}.`, expr: `+${interest.toLocaleString('en-KE')} → ${end.toLocaleString('en-KE')}` }
      ))], answer: `${value}` },
    misconceptions: simple !== value ? [{ when: `${simple}`, feedback: `That is SIMPLE interest (${r}% of the original every year). Compound interest grows on the growing balance.` }] : [],
    verify: { kind: 'fraction', value },
  };
}

// ---- G9: surds — simplify √N ----
export function buildSurds() {
  const k = pick([2, 2, 3, 3, 4, 5]);
  const m = pick([2, 3, 5, 6, 7]);
  const N = k * k * m;
  const answer = `${k}√${m}`;
  return {
    type: 'surd-simplify', instruction: 'Pull out the largest square factor.',
    question: `Simplify √${N}`,
    answer,
    accepts: accepts(answer, `${k}sqrt(${m})`, `${k}sqrt${m}`, `${k}root${m}`, `${k} √${m}`),
    hints: hintLadder('Look for the largest SQUARE number that divides it.',
      `${N} = ${k * k} × ${m}, and ${k * k} is a perfect square.`,
      `√(${k * k} × ${m}) = √${k * k} × √${m}.`),
    solution: { steps: [
      { text: 'Split out the square factor.', expr: `√${N} = √(${k * k} × ${m})` },
      { text: 'Take the square root of the square.', expr: `${k}√${m}` }], answer },
    misconceptions: [
      { when: `${N / 2}`, feedback: 'A square root is not "half of" — it asks what number MULTIPLIES BY ITSELF to give this.' },
      ...(k === 4 ? [{ when: `2√${4 * m}`, feedback: `Keep going — ${4 * m} still has a square factor of 4 inside.` }] : []),
    ],
    verify: { kind: 'numeric', f: () => k * Math.sqrt(m), at: 0, value: Math.sqrt(N) },
  };
}

// ---- G9: direct & inverse variation ----
export function buildVariation() {
  const inverse = coin();
  if (!inverse) {
    const k = randInt(2, 8), x1 = randInt(2, 6);
    let x2 = randInt(2, 12);
    while (x2 === x1) x2 = randInt(2, 12);
    const y1 = k * x1, value = k * x2;
    return {
      type: 'direct-variation', instruction: 'Find the constant first.',
      question: `y varies DIRECTLY as x, and y = ${y1} when x = ${x1}. Find y when x = ${x2}.`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder('Direct variation: y = kx for some constant k.',
        `Find k from the given pair: k = ${y1} ÷ ${x1}.`,
        `k = ${k}; now use y = ${k} × ${x2}.`),
      solution: { steps: [
        { text: 'Find the constant of variation.', expr: `k = ${y1}/${x1} = ${k}` },
        { text: 'Apply it to the new x.', expr: `y = ${k} × ${x2} = ${value}` }], answer: `${value}` },
      misconceptions: [{ when: `${y1 + (x2 - x1)}`, feedback: 'y doesn\'t grow by ADDING what x added — direct variation SCALES: y = kx.' }],
      verify: { kind: 'fraction', value },
    };
  }
  const k = pick([24, 36, 48, 60, 72]);
  const divisors = [2, 3, 4, 6, 8, 12].filter(d => k % d === 0);
  const x1 = pick(divisors);
  let x2 = pick(divisors);
  while (x2 === x1) x2 = pick(divisors);
  const y1 = k / x1, value = k / x2;
  return {
    type: 'inverse-variation', instruction: 'The PRODUCT stays constant.',
    question: `y varies INVERSELY as x, and y = ${y1} when x = ${x1}. Find y when x = ${x2}.`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('Inverse variation: y = k/x, so x × y is always the same.',
      `k = x × y = ${x1} × ${y1} = ${k}.`,
      `y = ${k} ÷ ${x2}.`),
    solution: { steps: [
      { text: 'Find the constant product.', expr: `k = ${x1} × ${y1} = ${k}` },
      { text: 'Divide by the new x.', expr: `y = ${k}/${x2} = ${value}` }], answer: `${value}` },
    misconceptions: [{ when: `${(y1 * x2) / x1 === Math.round((y1 * x2) / x1) ? (y1 * x2) / x1 : ''}`, feedback: 'That is DIRECT variation. Inversely means as x grows, y SHRINKS — their product stays fixed.' }].filter(m => m.when !== '' && m.when !== `${value}`),
    verify: { kind: 'fraction', value },
  };
}

// ---- G5: column addition / subtraction with carrying & borrowing ----------
// The board picture levitty asked for: the vertical algorithm with the carry
// written above the column, and borrows crossed out the way a teacher does it.
const digitwiseWrong = (a, b, sub) => {
  // The classic error: working each column alone (writing 13 without carrying,
  // or always subtracting the smaller digit from the larger).
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

export function buildColumnAddSub({ sub = false } = {}) {
  const needsCarry = (a, b) => { while (a > 0 && b > 0) { if (a % 10 + b % 10 >= 10) return true; a = Math.floor(a / 10); b = Math.floor(b / 10); } return false; };
  const needsBorrow = (a, b) => { while (b > 0) { if (b % 10 > a % 10) return true; a = Math.floor(a / 10); b = Math.floor(b / 10); } return false; };
  const wantRegroup = Math.random() < 0.7;          // mostly the interesting case
  let a, b, value;
  for (let i = 0; ; i++) {
    a = randInt(214, 8985);
    b = sub ? randInt(103, a - 7) : randInt(103, 979);
    value = sub ? a - b : a + b;
    const regroups = sub ? needsBorrow(a, b) : needsCarry(a, b);
    if ((regroups === wantRegroup && value !== b && value !== a) || i > 400) break;
  }
  const wrong = digitwiseWrong(a, b, sub);
  const steps = columnSteps(a, b, sub).map(s => ({ text: s.text, expr: s.expr }));
  return {
    type: sub ? 'column-sub' : 'column-add',
    instruction: `Use column ${sub ? 'subtraction' : 'addition'} — start from the ones.`,
    question: `${a} ${sub ? '−' : '+'} ${b} = ?`,
    answer: `${value}`, accepts: accepts(`${value}`),
    model: columnOpModel(a, b, sub),
    hints: hintLadder(
      'Line the numbers up by place value — ones under ones, tens under tens.',
      'Work one column at a time, starting from the ones on the right.',
      sub ? 'If the top digit is smaller, borrow a ten from the next column to the left.'
          : 'If a column makes ten or more, write the ones digit and carry the 1 to the next column.',
    ),
    solution: {
      steps: [
        ...steps,
        { text: 'Read the answer off the bottom row.', expr: `${value}`,
          model: columnOpModel(a, b, sub, { showResult: true }) },
      ],
      answer: `${value}`,
    },
    misconceptions: wrong !== `${value}`
      ? [{ when: wrong, feedback: sub
          ? 'Each column was worked alone — when the top digit is smaller you must BORROW from the next column, not swap the digits around.'
          : 'The carries were dropped — when a column makes ten or more, the 1 moves to the next column.' }]
      : [],
    verify: { kind: 'fraction', value },
  };
}


// ---- G9: operations with surds --------------------------------------------
export function buildSurdsOps() {
  const kind = pick(['multiply', 'add-like', 'simplify-add', 'rationalise', 'square']);
  const SQ = { 4: 2, 9: 3, 16: 4, 25: 5, 36: 6, 49: 7, 64: 8, 100: 10 };

  if (kind === 'multiply') {
    const a = pick([2, 3, 5, 6, 7, 10]), b = pick([2, 3, 5, 6, 7, 10]);
    const prod = a * b;
    // If the product is a perfect square the answer is a whole number.
    const whole = SQ[prod];
    const value = whole ? `${whole}` : `√${prod}`;
    return {
      type: 'surds-multiply', instruction: 'Multiply the surds.',
      question: `Simplify:   √${a} × √${b}`,
      answer: value, accepts: accepts(value, whole ? null : `root${prod}`),
      hints: hintLadder('Surds multiply straight across under one root sign.',
        '√a × √b = √(ab).', `So this is √(${a} × ${b}).`),
      solution: { steps: [
        { text: 'Combine under a single root.', expr: `√(${a} × ${b}) = √${prod}` },
        ...(whole ? [{ text: `${prod} is a perfect square.`, expr: `${whole}` }] : [])], answer: value },
      misconceptions: [
        { when: `√${a + b}`, feedback: 'Roots do NOT add like that. √a × √b = √(ab) — multiply what is under the roots.' },
      ],
      verify: { kind: 'exact', value },
    };
  }

  if (kind === 'add-like') {
    const n = pick([2, 3, 5, 6, 7, 11]);
    const p1 = randInt(2, 9), p2 = randInt(1, p1 - 1);
    const add = coin();
    const coef = add ? p1 + p2 : p1 - p2;
    const value = coef === 1 ? `√${n}` : `${coef}√${n}`;
    return {
      type: 'surds-add', instruction: 'Collect like surds.',
      question: `Simplify:   ${p1}√${n} ${add ? '+' : '−'} ${p2}√${n}`,
      answer: value, accepts: accepts(value, value.replace('√', 'root')),
      hints: hintLadder(
        'Treat √' + n + ' like a letter — it is the same "thing" in both terms.',
        `Just as ${p1}x ${add ? '+' : '−'} ${p2}x = ${coef}x, collect the counts.`),
      solution: { steps: [
        { text: `Both terms are multiples of the same surd, √${n}.`, expr: `(${p1} ${add ? '+' : '−'} ${p2})√${n}` },
        { text: 'Collect.', expr: value }], answer: value },
      misconceptions: [
        { when: `${coef}√${n * 2}`, feedback: 'Only the COUNTS in front combine — the surd itself stays as √' + n + '.' },
      ],
      verify: { kind: 'exact', value },
    };
  }

  if (kind === 'simplify-add') {
    // e.g. √50 + √8 = 5√2 + 2√2 = 7√2
    const base = pick([2, 3, 5]);
    const k1 = pick([2, 3, 4, 5]), k2 = pick([2, 3, 4, 5]);
    const n1 = base * k1 * k1, n2 = base * k2 * k2;
    const coef = k1 + k2;
    const value = `${coef}√${base}`;
    return {
      type: 'surds-simplify-add', instruction: 'Simplify each surd first, then collect.',
      question: `Simplify:   √${n1} + √${n2}`,
      answer: value, accepts: accepts(value, value.replace('√', 'root')),
      hints: hintLadder(
        'They look unlike, but each one hides a square factor — pull it out first.',
        `Split each number into a perfect square times something: ${n1} = ${k1 * k1} × ${base}.`,
        'Once both are multiples of the same surd, collect them like terms.'),
      solution: { steps: [
        { text: 'Take the square factor out of each.', expr: `√${n1} = ${k1}√${base},  √${n2} = ${k2}√${base}` },
        { text: 'Now they are like terms — collect.', expr: `(${k1} + ${k2})√${base} = ${value}` }], answer: value },
      misconceptions: [
        { when: `√${n1 + n2}`, feedback: 'You cannot add under the root: √a + √b is NOT √(a+b). Simplify each surd first, then collect like terms.' },
      ],
      verify: { kind: 'exact', value },
    };
  }

  if (kind === 'square') {
    const n = pick([2, 3, 5, 6, 7, 10, 11, 13]);
    return {
      type: 'surds-square', instruction: 'Square the surd.',
      question: `Simplify:   (√${n})²`,
      answer: `${n}`, accepts: accepts(`${n}`),
      hints: hintLadder('Squaring undoes a square root — they are opposite operations.',
        `√${n} × √${n} = √(${n} × ${n}).`),
      solution: { steps: [
        { text: 'Squaring and square-rooting cancel out.', expr: `(√${n})² = ${n}` }], answer: `${n}` },
      misconceptions: [
        { when: `${n * n}`, feedback: `You squared ${n} itself. But (√${n})² just removes the root, leaving ${n}.` },
      ],
      verify: { kind: 'fraction', value: n },
    };
  }

  // rationalise a simple denominator
  const n = pick([2, 3, 5, 7, 11]);
  const p1 = randInt(1, 6);
  const value = p1 % n === 0 ? `${p1 / n}√${n}` : `${p1}√${n}/${n}`;
  return {
    type: 'surds-rationalise', instruction: 'Rationalise the denominator.',
    question: `Rationalise the denominator:   ${p1}/√${n}`,
    answer: value, accepts: accepts(value, value.replace('√', 'root')),
    hints: hintLadder(
      'A surd is not left on the bottom of a fraction — it must be cleared.',
      `Multiply top and bottom by √${n}. That changes how it looks, not its value.`,
      `The bottom becomes √${n} × √${n} = ${n}.`),
    solution: { steps: [
      { text: `Multiply numerator and denominator by √${n}.`, expr: `(${p1} × √${n}) / (√${n} × √${n})` },
      { text: 'The denominator loses its root.', expr: `${p1}√${n} / ${n}` },
      ...(p1 % n === 0 ? [{ text: 'Simplify.', expr: value }] : [])], answer: value },
    misconceptions: [],
    verify: { kind: 'exact', value },
  };
}

// ---- G9: commercial arithmetic — tax, bills, wages -------------------------
// CBC G9 Money: PAYE, VAT, utility bills, commission, hire purchase. The
// contextual financial literacy the curriculum actually centres on.
export function buildCommercialArith() {
  const kind = pick(['vat', 'commission', 'hire-purchase', 'bill', 'paye', 'discount-then-vat']);

  if (kind === 'vat') {
    const net = pick([1200, 2400, 3600, 5000, 8000, 12000, 20000]);
    const rate = 16;                       // Kenya's standard VAT rate
    const vat = net * rate / 100;
    const askTotal = coin();
    const value = askTotal ? net + vat : vat;
    return {
      type: 'ca-vat', instruction: 'Work out the VAT.',
      question: askTotal
        ? `A television is marked KSh ${net.toLocaleString('en-KE')} before VAT. VAT is charged at ${rate}%. What is the total price?`
        : `A shopkeeper sells goods worth KSh ${net.toLocaleString('en-KE')} before VAT. How much VAT is charged at ${rate}%?`,
      answer: `${value}`, accepts: accepts(`${value}`, value.toLocaleString('en-KE'), `KSh ${value}`),
      hints: hintLadder(
        'VAT is a percentage ADDED on top of the marked price.',
        `Find ${rate}% of ${net.toLocaleString('en-KE')} first.`,
        askTotal ? 'Then add it to the original price.' : 'That percentage IS the answer.'),
      solution: { steps: [
        { text: `Find ${rate}% of the price.`, expr: `${rate}/100 × ${net} = ${vat}` },
        ...(askTotal ? [{ text: 'Add it to the marked price.', expr: `${net} + ${vat} = ${value}` }] : [])], answer: `${value}` },
      misconceptions: askTotal
        ? [{ when: `${vat}`, feedback: 'That is the VAT alone. The TOTAL price is the marked price plus the VAT.' }]
        : [{ when: `${net + vat}`, feedback: 'That is the total including VAT. The question asks only for the VAT charged.' }],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'commission') {
    const sales = pick([40000, 60000, 80000, 120000, 150000, 200000]);
    const rate = pick([2, 3, 4, 5, 8, 10]);
    const basic = pick([8000, 10000, 12000, 15000]);
    const comm = sales * rate / 100;
    const askTotal = coin();
    const value = askTotal ? basic + comm : comm;
    return {
      type: 'ca-commission', instruction: 'Work out the earnings.',
      question: askTotal
        ? `A salesperson earns a basic wage of KSh ${basic.toLocaleString('en-KE')} plus ${rate}% commission on sales. In a month she sells goods worth KSh ${sales.toLocaleString('en-KE')}. What are her TOTAL earnings?`
        : `A salesperson is paid ${rate}% commission on sales. She sells goods worth KSh ${sales.toLocaleString('en-KE')}. How much commission does she earn?`,
      answer: `${value}`, accepts: accepts(`${value}`, value.toLocaleString('en-KE'), `KSh ${value}`),
      hints: hintLadder(
        'Commission is a percentage of what was SOLD, not of the wage.',
        `Find ${rate}% of ${sales.toLocaleString('en-KE')}.`,
        askTotal ? 'Then add the basic wage.' : 'That is the commission.'),
      solution: { steps: [
        { text: `Commission = ${rate}% of sales.`, expr: `${rate}/100 × ${sales} = ${comm}` },
        ...(askTotal ? [{ text: 'Add the basic wage.', expr: `${basic} + ${comm} = ${value}` }] : [])], answer: `${value}` },
      misconceptions: askTotal
        ? [{ when: `${comm}`, feedback: 'That is the commission only — she also receives her basic wage.' }]
        : [{ when: `${basic + comm}`, feedback: 'The question asks for the COMMISSION alone, not her total earnings.' }],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'hire-purchase') {
    const cash = pick([24000, 36000, 48000, 60000, 75000]);
    const deposit = Math.round(cash * pick([0.1, 0.2, 0.25]) / 100) * 100;
    const months = pick([6, 10, 12]);
    const monthly = pick([2500, 3000, 3500, 4000, 5000]);
    const hp = deposit + months * monthly;
    const askExtra = coin();
    const value = askExtra ? hp - cash : hp;
    return {
      type: 'ca-hire-purchase', instruction: 'Compare hire purchase with cash.',
      question: `A fridge costs KSh ${cash.toLocaleString('en-KE')} cash. On hire purchase it needs a deposit of KSh ${deposit.toLocaleString('en-KE')} and ${months} monthly instalments of KSh ${monthly.toLocaleString('en-KE')}. ${askExtra ? 'How much MORE than the cash price is the hire-purchase price?' : 'What is the total hire-purchase price?'}`,
      answer: `${value}`, accepts: accepts(`${value}`, value.toLocaleString('en-KE'), `KSh ${value}`),
      hints: hintLadder(
        'Hire purchase means a deposit up front plus a fixed payment each month.',
        `Instalments total ${months} × ${monthly.toLocaleString('en-KE')}.`,
        askExtra ? 'Add the deposit to get the HP price, then compare with the cash price.' : 'Add the deposit to the instalment total.'),
      solution: { steps: [
        { text: 'Total of the instalments.', expr: `${months} × ${monthly} = ${months * monthly}` },
        { text: 'Add the deposit for the hire-purchase price.', expr: `${deposit} + ${months * monthly} = ${hp}` },
        ...(askExtra ? [{ text: 'Compare with the cash price.', expr: `${hp} − ${cash} = ${value}` }] : [])], answer: `${value}` },
      misconceptions: askExtra
        ? [{ when: `${hp}`, feedback: 'That is the hire-purchase price. The question asks how much MORE it is than paying cash — subtract the cash price.' }]
        : [{ when: `${months * monthly}`, feedback: 'You left out the deposit — the hire-purchase price is deposit PLUS all the instalments.' }],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'bill') {
    const units = randInt(60, 400);
    const rate = pick([12, 15, 18, 20, 25]);
    const standing = pick([150, 200, 300]);
    const value = units * rate + standing;
    return {
      type: 'ca-bill', instruction: 'Work out the bill.',
      question: `An electricity bill has a standing charge of KSh ${standing} plus KSh ${rate} for each unit used. A household uses ${units} units. What is the total bill?`,
      answer: `${value}`, accepts: accepts(`${value}`, value.toLocaleString('en-KE'), `KSh ${value}`),
      hints: hintLadder(
        'A bill has two parts: a fixed charge you always pay, and a charge for what you actually used.',
        `Units cost ${units} × ${rate}.`,
        `Then add the standing charge of ${standing}.`),
      solution: { steps: [
        { text: 'Cost of the units used.', expr: `${units} × ${rate} = ${units * rate}` },
        { text: 'Add the fixed standing charge.', expr: `${units * rate} + ${standing} = ${value}` }], answer: `${value}` },
      misconceptions: [
        { when: `${units * rate}`, feedback: 'You forgot the standing charge — it is paid on top of the units used.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'discount-then-vat') {
    const marked = pick([4000, 5000, 8000, 10000, 20000]);
    const disc = pick([5, 10, 20, 25]);
    const afterDisc = marked * (100 - disc) / 100;
    const value = Math.round(afterDisc * 1.16);
    return {
      type: 'ca-discount-vat', instruction: 'Order matters — discount first, then VAT.',
      question: `A shop offers ${disc}% discount on an item marked KSh ${marked.toLocaleString('en-KE')}. VAT of 16% is then added to the discounted price. What does the customer pay?`,
      answer: `${value}`, accepts: accepts(`${value}`, value.toLocaleString('en-KE'), `KSh ${value}`),
      hints: hintLadder(
        'Do the two steps in the order the question states them.',
        `First take ${disc}% off ${marked.toLocaleString('en-KE')}.`,
        'Then add 16% VAT to THAT figure, not to the original.'),
      solution: { steps: [
        { text: `Take off the ${disc}% discount.`, expr: `${marked} × ${(100 - disc)}/100 = ${afterDisc}` },
        { text: 'Add 16% VAT to the discounted price.', expr: `${afterDisc} × 1.16 = ${value}` }], answer: `${value}` },
      misconceptions: [
        { when: `${Math.round(marked * 1.16 * (100 - disc) / 100)}`, feedback: 'Close — but apply the discount FIRST, then charge VAT on the reduced price, as the question says.' },
        { when: `${afterDisc}`, feedback: 'You stopped after the discount. VAT of 16% still has to be added.' },
      ],
      verify: { kind: 'fraction', value, tol: 1.1 },
    };
  }

  // PAYE on a simple two-band scale
  const income = pick([24000, 30000, 36000, 48000, 60000]);
  const band1 = 24000, r1r = 10, r2r = 25;
  const tax = income <= band1 ? income * r1r / 100 : band1 * r1r / 100 + (income - band1) * r2r / 100;
  const relief = 2400;
  const value = Math.max(0, Math.round(tax - relief));
  return {
    type: 'ca-paye', instruction: 'Work through the tax bands in order.',
    question: `PAYE is charged at ${r1r}% on the first KSh ${band1.toLocaleString('en-KE')} of monthly income and ${r2r}% on anything above that. A worker earns KSh ${income.toLocaleString('en-KE')} a month and gets a personal relief of KSh ${relief.toLocaleString('en-KE')}. How much tax does she actually pay?`,
    answer: `${value}`, accepts: accepts(`${value}`, value.toLocaleString('en-KE'), `KSh ${value}`),
    hints: hintLadder(
      'Tax bands are charged in slices — the higher rate applies only to the part ABOVE the band, not to everything.',
      `First slice: ${r1r}% of ${band1.toLocaleString('en-KE')}.`,
      'Add the tax on the remainder, then subtract the personal relief at the very end.'),
    solution: { steps: [
      { text: `Tax on the first ${band1.toLocaleString('en-KE')}.`, expr: `${r1r}% × ${band1} = ${band1 * r1r / 100}` },
      ...(income > band1 ? [{ text: `Tax on the rest (${(income - band1).toLocaleString('en-KE')}).`, expr: `${r2r}% × ${income - band1} = ${(income - band1) * r2r / 100}` }] : []),
      { text: 'Subtract the personal relief.', expr: `${tax} − ${relief} = ${value}` }], answer: `${value}` },
    misconceptions: [
      { when: `${Math.round(income * r2r / 100)}`, feedback: `You charged ${r2r}% on the WHOLE income. The higher rate applies only to the part above KSh ${band1.toLocaleString('en-KE')}.` },
      { when: `${Math.round(tax)}`, feedback: 'That is the tax before relief. Personal relief is subtracted to give what is actually paid.' },
    ],
    verify: { kind: 'fraction', value, tol: 1.1 },
  };
}

// ============================================================================
// CBC GRADE 9 — NUMBERS
// Authored against the KICD Grade 9 Mathematics Curriculum Design:
//   1.1 Integers (5 lessons)                     — combined operations
//   1.3 Indices and Logarithms (6 lessons)       — relate powers of 10 to
//                                                  common logarithms
//   1.4 Compound Proportions and Rates of Work (12 lessons)
// ============================================================================

// ---- G9 1.3: common logarithms — a logarithm IS the power of ten ----
// The KICD outcome is "relate powers of 10 to common logarithms", so base 10
// carries the work and other bases appear only as a stretch. Every variant is
// the same idea read in a different direction, which is the point: log and
// index form say one thing two ways.
export function buildCommonLogs() {
  const pows = [[1, 10], [2, 100], [3, 1000], [4, 10000], [5, 100000]];
  const kind = pick(['log-of-power', 'to-index-form', 'to-log-form', 'other-base', 'between']);

  if (kind === 'log-of-power') {
    const [p, v] = pick(pows);
    return {
      type: 'log-common', instruction: 'Answer with the power of ten.',
      question: `What is log ${v.toLocaleString('en-KE')}?  (common logarithm, base 10)`,
      answer: `${p}`, accepts: accepts(`${p}`),
      hints: hintLadder(
        'A common logarithm asks one question: ten to WHAT power gives this number?',
        `So you are solving 10^? = ${v.toLocaleString('en-KE')}.`,
        'Count the zeros after the 1.'),
      solution: { steps: [
        { text: 'Write the number as a power of ten.', expr: `${v.toLocaleString('en-KE')} = 10^${p}` },
        { text: 'The logarithm IS that power.', expr: `log ${v.toLocaleString('en-KE')} = ${p}` }], answer: `${p}` },
      misconceptions: [
        { when: `${v}`, feedback: 'That is the number itself. The logarithm is the POWER you raise 10 to, not the number.' },
        { when: `${p + 1}`, feedback: 'Careful counting the zeros — log 10 is 1, not 2. The power counts the zeros exactly.' },
      ],
      verify: { kind: 'fraction', value: p },
    };
  }

  if (kind === 'to-index-form') {
    const [p, v] = pick(pows);
    const ans = `10^${p}`;
    return {
      type: 'log-to-index', instruction: 'Write it as a power of ten.',
      question: `log ${v.toLocaleString('en-KE')} = ${p}.  Write this in index form.`,
      answer: ans, accepts: accepts(ans, `10^${p} = ${v}`, `10**${p}`, `${v} = 10^${p}`),
      hints: hintLadder(
        'Index form and logarithm form say the SAME thing, read in opposite directions.',
        'log (number) = power  means  10 raised to that power gives the number.',
        'Start your answer with 10.'),
      solution: { steps: [
        { text: 'Name the base, the power and the number.', expr: `base 10, power ${p}` },
        { text: 'Write base to the power.', expr: `10^${p} = ${v.toLocaleString('en-KE')}` }], answer: ans },
      misconceptions: [
        { when: `${p}^10`, feedback: 'The base and the power have swapped places — 10 is the base of a COMMON logarithm.' },
      ],
      verify: { kind: 'exact', value: ans },
    };
  }

  if (kind === 'to-log-form') {
    const [p, v] = pick(pows);
    const ans = `log ${v} = ${p}`;
    return {
      type: 'index-to-log', instruction: 'Write it as a common logarithm.',
      question: `10^${p} = ${v.toLocaleString('en-KE')}.  Write this in logarithm form.`,
      answer: ans,
      accepts: accepts(ans, `log${v}=${p}`, `log(${v}) = ${p}`, `log ${v.toLocaleString('en-KE')} = ${p}`),
      hints: hintLadder(
        'Logarithm form starts with the word log and ends with the power.',
        'The number that 10 produced goes inside the log; the power goes on the right.',
        'Lay it out as  log (number) = power.'),
      solution: { steps: [
        { text: 'The power becomes the value of the logarithm.', expr: `power = ${p}` },
        { text: 'The result goes inside the log.', expr: ans }], answer: ans },
      misconceptions: [
        { when: `log ${p} = ${v}`, feedback: 'These are the wrong way round — the big number goes INSIDE the log, the power is the answer.' },
      ],
      verify: { kind: 'exact', value: ans },
    };
  }

  if (kind === 'between') {
    // Estimation without tables — a real KICD habit before reaching for logs.
    const [p, v] = pick(pows.slice(1, 4));
    const n = randInt(v + 1, v * 9);
    return {
      type: 'log-between', instruction: 'Give the whole number just below it.',
      question: `log ${n.toLocaleString('en-KE')} lies between two whole numbers. What is the SMALLER one?`,
      answer: `${p}`, accepts: accepts(`${p}`),
      hints: hintLadder(
        'Find the two powers of ten this number sits between.',
        `Is ${n.toLocaleString('en-KE')} bigger or smaller than 10, 100, 1000, 10000?`,
        'The smaller power of ten gives the smaller whole number.'),
      solution: { steps: [
        { text: 'Trap the number between powers of ten.', expr: `10^${p} < ${n} < 10^${p + 1}` },
        { text: 'Read off the lower power.', expr: `${p}` }], answer: `${p}` },
      misconceptions: [
        { when: `${p + 1}`, feedback: 'That is the UPPER whole number — the question asks for the one below.' },
      ],
      verify: { kind: 'fraction', value: p },
    };
  }

  const [base, val, res] = pick([[2, 8, 3], [2, 16, 4], [2, 32, 5], [3, 9, 2], [3, 27, 3], [5, 25, 2], [5, 125, 3]]);
  return {
    type: 'log-other-base', instruction: 'Answer with the power.',
    question: `log₍${base}₎ ${val} = ?`,
    answer: `${res}`, accepts: accepts(`${res}`),
    hints: hintLadder(
      'The little number is the base — the number being raised to a power.',
      `So you are solving ${base}^? = ${val}.`,
      `Keep multiplying by ${base} and count how many times you did it.`),
    solution: { steps: [
      { text: 'Turn it into an index question.', expr: `${base}^? = ${val}` },
      { text: 'Find the power.', expr: `${base}^${res} = ${val}` }], answer: `${res}` },
    misconceptions: [
      { when: `${val / base}`, feedback: `That is ${val} ÷ ${base}. A logarithm counts how many times you MULTIPLY by ${base}, it is not a division.` },
    ],
    verify: { kind: 'fraction', value: res },
  };
}

// ---- G9 1.3: laws of logarithms, grounded in powers of ten ----
// The laws are the laws of INDICES wearing different clothes, so the hints
// point back to indices rather than reciting the rule being tested.
export function buildLogLaws() {
  const kind = pick(['product', 'quotient', 'power', 'evaluate-product', 'from-known']);

  if (kind === 'product') {
    const a = pick([2, 3, 4, 5, 6, 7]), b = pick([2, 3, 5, 8, 9]);
    const ans = `log ${a * b}`;
    return {
      type: 'log-product', instruction: 'Write it as a single logarithm.',
      question: `Express as a single logarithm:  log ${a} + log ${b}`,
      answer: ans, accepts: accepts(ans, `log(${a * b})`, `log${a * b}`),
      hints: hintLadder(
        'Behind every log is a power of ten, and adding powers means multiplying the numbers.',
        'So ADDING two logs collapses into ONE log of a single number.',
        `Decide what to do with ${a} and ${b} to get that number.`),
      solution: { steps: [
        { text: 'Adding logs combines the numbers by multiplying.', expr: `log ${a} + log ${b} = log (${a} × ${b})` },
        { text: 'Work out the inside.', expr: ans }], answer: ans },
      misconceptions: [
        { when: `log ${a + b}`, feedback: `You added the numbers inside. Adding the LOGS multiplies what is inside — ${a} × ${b}, not ${a} + ${b}.` },
      ],
      verify: { kind: 'exact', value: ans },
    };
  }

  if (kind === 'quotient') {
    const b = pick([2, 3, 4, 5]), q = pick([2, 3, 4, 5, 6, 7, 8]);
    const a = b * q;
    const ans = `log ${q}`;
    return {
      type: 'log-quotient', instruction: 'Write it as a single logarithm.',
      question: `Express as a single logarithm:  log ${a} − log ${b}`,
      answer: ans, accepts: accepts(ans, `log(${q})`, `log${q}`),
      hints: hintLadder(
        'Behind every log is a power of ten, and subtracting powers means dividing the numbers.',
        'So SUBTRACTING logs collapses into ONE log of a single number.',
        `Decide what to do with ${a} and ${b} to get that number.`),
      solution: { steps: [
        { text: 'Subtracting logs divides what is inside.', expr: `log ${a} − log ${b} = log (${a} ÷ ${b})` },
        { text: 'Work out the inside.', expr: ans }], answer: ans },
      misconceptions: [
        { when: `log ${a - b}`, feedback: `You subtracted the numbers inside. Subtracting the LOGS divides what is inside — ${a} ÷ ${b}.` },
        { when: `log ${b}/log ${a}`, feedback: 'A difference of logs is one log of a quotient, not a quotient of two logs.' },
      ],
      verify: { kind: 'exact', value: ans },
    };
  }

  if (kind === 'power') {
    const a = pick([2, 3, 5]), n = randInt(2, 4);
    const ans = `log ${Math.pow(a, n)}`;
    return {
      type: 'log-power', instruction: 'Write it as a single logarithm.',
      question: `Express as a single logarithm:  ${n} log ${a}`,
      answer: ans, accepts: accepts(ans, `log(${Math.pow(a, n)})`, `log${Math.pow(a, n)}`),
      hints: hintLadder(
        `${n} log ${a} is just log ${a} added to itself ${n} times.`,
        'And adding logs multiplies what is inside.',
        `So ${a} gets multiplied by itself — how many times?`),
      solution: { steps: [
        { text: 'A multiplier in front becomes a power inside.', expr: `${n} log ${a} = log (${a}^${n})` },
        { text: 'Work out the power.', expr: ans }], answer: ans },
      misconceptions: [
        { when: `log ${a * n}`, feedback: `The ${n} does not multiply ${a} — it becomes a POWER, so ${a} is multiplied by itself ${n} times.` },
      ],
      verify: { kind: 'exact', value: ans },
    };
  }

  if (kind === 'evaluate-product') {
    const [p1, v1] = pick([[1, 10], [2, 100], [3, 1000]]);
    const [p2, v2] = pick([[1, 10], [2, 100]]);
    const value = p1 + p2;
    return {
      type: 'log-evaluate', instruction: 'Give a number, not a log.',
      question: `Evaluate:  log ${v1.toLocaleString('en-KE')} + log ${v2.toLocaleString('en-KE')}`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        'Each of these is a common logarithm you can read straight off — a power of ten.',
        'Work out each one on its own first.',
        'Then do what the sign between them says.'),
      solution: { steps: [
        { text: 'Read each logarithm as a power of ten.', expr: `log ${v1} = ${p1},  log ${v2} = ${p2}` },
        { text: 'Add them.', expr: `${p1} + ${p2} = ${value}` }], answer: `${value}` },
      misconceptions: [
        { when: `${v1 * v2}`, feedback: 'You multiplied the numbers instead of adding their logarithms. The answer is a small whole number.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  // The KICD "use mathematical tables" habit, without needing the tables.
  const known = pick([[2, '0.3010'], [3, '0.4771'], [5, '0.6990'], [7, '0.8451']]);
  const [base, logv] = known;
  const n = randInt(2, 3);
  const target = Math.pow(base, n);
  const value = (parseFloat(logv) * n).toFixed(4);
  return {
    type: 'log-from-known', instruction: 'Give your answer to 4 decimal places.',
    question: `Given that log ${base} = ${logv}, find log ${target}.`,
    answer: `${value}`, accepts: accepts(`${value}`, `${parseFloat(value)}`),
    hints: hintLadder(
      `First write ${target} as a power of ${base}.`,
      'A power inside a log comes out to the front as a multiplier.',
      `So you need ${logv} multiplied by that power.`),
    solution: { steps: [
      { text: `Write ${target} as a power of ${base}.`, expr: `${target} = ${base}^${n}` },
      { text: 'Bring the power out in front.', expr: `log ${target} = ${n} × log ${base}` },
      { text: 'Substitute the given value.', expr: `${n} × ${logv} = ${value}` }], answer: `${value}` },
    misconceptions: [
      { when: `${(parseFloat(logv) + n).toFixed(4)}`, feedback: `The power is a MULTIPLIER of log ${base}, not something you add to it.` },
    ],
    verify: { kind: 'fraction', value: parseFloat(value) },
  };
}

// ---- G9 1.1: combined operations on integers ----
// Order of operations where every number can be negative — the two rules the
// learner already has, now colliding. Answers are checked as plain integers.
export function buildIntegersCombined() {
  const shape = pick(['mul-then-add', 'brackets-first', 'div-then-sub', 'three-term']);

  if (shape === 'mul-then-add') {
    const a = nonzero(-12, 12), b = nonzero(-9, 9), c = nonzero(-9, 9);
    const value = a + b * c;
    return {
      type: 'int-combined', instruction: 'Use the correct order of operations.',
      question: `Work out:  ${a} + (${b}) × (${c})`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        'Multiplication is settled before addition — always.',
        'Do the multiplying part on its own first, sign and all.',
        'Two negatives multiplied give a positive; one negative gives a negative.'),
      solution: { steps: [
        { text: 'Multiply first.', expr: `(${b}) × (${c}) = ${b * c}` },
        { text: 'Now add.', expr: `${a} + (${b * c}) = ${value}` }], answer: `${value}` },
      misconceptions: [
        { when: `${(a + b) * c}`, feedback: 'You added before multiplying. Multiplication comes first unless brackets say otherwise.' },
        { when: `${a - b * c}`, feedback: 'Check the sign of the product before you combine it.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  if (shape === 'brackets-first') {
    const a = nonzero(-9, 9), b = nonzero(-9, 9), c = nonzero(-8, 8);
    const value = (a + b) * c;
    return {
      type: 'int-combined', instruction: 'Use the correct order of operations.',
      question: `Work out:  (${a} + (${b})) × (${c})`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        'Brackets are settled before anything else.',
        'Combine what is inside the brackets into a single signed number first.',
        'Then multiply that by the number outside, watching the signs.'),
      solution: { steps: [
        { text: 'Do the brackets.', expr: `${a} + (${b}) = ${a + b}` },
        { text: 'Multiply.', expr: `(${a + b}) × (${c}) = ${value}` }], answer: `${value}` },
      misconceptions: [
        { when: `${a + b * c}`, feedback: 'The brackets came first here — they group the addition, so it must be done before multiplying.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  if (shape === 'div-then-sub') {
    const q = nonzero(-8, 8), d = nonzero(-6, 6);
    const n = q * d;
    const a = nonzero(-15, 15);
    const value = a - q;
    return {
      type: 'int-combined', instruction: 'Use the correct order of operations.',
      question: `Work out:  ${a} − (${n}) ÷ (${d})`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        'Division outranks subtraction — settle it first.',
        'Divide, keeping track of the sign, before you take anything away.',
        'Same signs divide to a positive; different signs to a negative.'),
      solution: { steps: [
        { text: 'Divide first.', expr: `(${n}) ÷ (${d}) = ${q}` },
        { text: 'Now subtract.', expr: `${a} − (${q}) = ${value}` }], answer: `${value}` },
      misconceptions: [
        { when: `${a + q}`, feedback: `Watch the subtraction: you are taking ${q} away, and subtracting a negative is what turns into adding.` },
        { when: `${(a - n) / d}`, feedback: 'You subtracted before dividing. Division is settled first.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  const a = nonzero(-10, 10), b = nonzero(-6, 6), c = nonzero(-6, 6), d = nonzero(-9, 9);
  const value = a - b * c + d;
  return {
    type: 'int-combined', instruction: 'Use the correct order of operations.',
    question: `Work out:  ${a} − (${b}) × (${c}) + (${d})`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder(
      'One multiplication is hiding between two additions/subtractions.',
      'Settle the multiplication first, then work left to right.',
      'Keep the sign that belongs to each term attached to it.'),
    solution: { steps: [
      { text: 'Multiply first.', expr: `(${b}) × (${c}) = ${b * c}` },
      { text: 'Then left to right.', expr: `${a} − (${b * c}) = ${a - b * c}` },
      { text: 'Finish.', expr: `${a - b * c} + (${d}) = ${value}` }], answer: `${value}` },
    misconceptions: [
      { when: `${(a - b) * c + d}`, feedback: 'You worked strictly left to right. Multiplication jumps the queue.' },
    ],
    verify: { kind: 'fraction', value },
  };
}

// ---- G9 1.4: compound proportion (ratio method) + proportional parts ----
// KICD asks for the RATIO method: change one factor at a time and ask, each
// time, whether more of it means more or less of the answer.
export function buildCompoundProportion() {
  const kind = pick(['parts', 'compound', 'compound-3']);

  if (kind === 'parts') {
    const r = pick([[2, 3], [3, 5], [1, 4], [4, 5], [2, 7], [3, 7]]);
    const unit = pick([300, 400, 500, 600, 800, 1200]);
    const total = (r[0] + r[1]) * unit;
    const which = coin() ? 0 : 1;
    const value = r[which] * unit;
    const thing = pick(['a piece of land', 'a sum of money', 'a harvest of maize']);
    const units = thing === 'a sum of money' ? 'KSh ' : '';
    return {
      type: 'prop-parts', instruction: 'Share it in the given ratio.',
      question: `${thing[0].toUpperCase()}${thing.slice(1)} of ${units}${total.toLocaleString('en-KE')} is shared between Amina and Otieno in the ratio ${r[0]}:${r[1]}. How much does ${which === 0 ? 'Amina' : 'Otieno'} get?`,
      answer: `${value}`, accepts: accepts(`${value}`, value.toLocaleString('en-KE'), `${units}${value}`),
      hints: hintLadder(
        'A ratio tells you how many equal parts to cut the whole into.',
        `Add the ratio numbers to find the total number of parts.`,
        'Find what ONE part is worth, then take as many parts as that person’s share.'),
      solution: { steps: [
        { text: 'Count the parts.', expr: `${r[0]} + ${r[1]} = ${r[0] + r[1]} parts` },
        { text: 'Find one part.', expr: `${total} ÷ ${r[0] + r[1]} = ${unit}` },
        { text: 'Take that share.', expr: `${r[which]} × ${unit} = ${value}` }], answer: `${value}` },
      misconceptions: [
        { when: `${r[1 - which] * unit}`, feedback: 'That is the other person’s share — check which of the two ratio numbers belongs to the person asked about.' },
        { when: `${total / 2}`, feedback: 'A ratio share is only an equal split when the two numbers are the same. Here they are not.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'compound') {
    // men × days × hours is constant work
    const m1 = pick([4, 5, 6, 8]), d1 = pick([6, 8, 9, 10, 12]), h1 = pick([4, 5, 6]);
    const m2 = pick([2, 3, 4, 6, 10, 12].filter(x => x !== m1));
    const h2 = pick([3, 4, 5, 6, 8].filter(x => x !== h1));
    const work = m1 * d1 * h1;
    if (work % (m2 * h2) !== 0) return buildCompoundProportion();
    const value = work / (m2 * h2);
    if (value <= 0 || value > 60) return buildCompoundProportion();
    return {
      type: 'prop-compound', instruction: 'Change one thing at a time.',
      question: `${m1} workers dig a trench in ${d1} days, working ${h1} hours a day. How many days would ${m2} workers take, working ${h2} hours a day?`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value} days`),
      hints: hintLadder(
        'Deal with the change in workers first, then the change in hours — one at a time.',
        `Ask each time: with ${m2 > m1 ? 'MORE' : 'FEWER'} workers, should the job take more days or fewer?`,
        'The total amount of work does not change; only how it is spread does.'),
      solution: { steps: [
        { text: 'The total work stays the same.', expr: `${m1} × ${d1} × ${h1} = ${work} worker-hours` },
        { text: 'Spread it over the new workers and hours.', expr: `${work} ÷ (${m2} × ${h2})` },
        { text: 'That is the number of days.', expr: `${value}` }], answer: `${value}` },
      misconceptions: [
        { when: `${(d1 * m2 * h2 / (m1 * h1)).toFixed(2).replace(/\.?0+$/, '')}`, feedback: 'The ratios have gone in the wrong direction — more workers means FEWER days, not more.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  const p1 = pick([3, 4, 5, 6]), d1 = pick([4, 6, 8, 10]);
  const p2 = pick([2, 6, 8, 10, 12].filter(x => x !== p1));
  const work = p1 * d1;
  if (work % p2 !== 0) return buildCompoundProportion();
  const value = work / p2;
  return {
    type: 'prop-inverse', instruction: 'Think about which way the answer moves.',
    question: `${p1} taps fill a tank in ${d1} hours. How long would ${p2} taps of the same size take?`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value} hours`),
    hints: hintLadder(
      'More taps do not take longer — this is an inverse proportion.',
      'Work out the total tap-hours the tank needs.',
      'Then share that total among the new number of taps.'),
    solution: { steps: [
      { text: 'Find the total work.', expr: `${p1} × ${d1} = ${work} tap-hours` },
      { text: 'Divide among the new taps.', expr: `${work} ÷ ${p2} = ${value}` }], answer: `${value}` },
    misconceptions: [
      { when: `${(d1 * p2 / p1).toFixed(2).replace(/\.?0+$/, '')}`, feedback: 'That scales the wrong way — check whether more taps should mean more hours or fewer.' },
    ],
    verify: { kind: 'fraction', value },
  };
}

// ---- G9 1.4: rates of work ----
// The heart of it is the per-hour (or per-day) rate: what fraction of the job
// does each worker finish in one unit of time?
export function buildRatesOfWork() {
  const kind = pick(['together', 'one-rate', 'remaining']);

  if (kind === 'together') {
    // Chosen so the combined time is exact.
    const pairs = [[2, 2, 1], [3, 6, 2], [4, 4, 2], [6, 3, 2], [12, 4, 3], [10, 15, 6], [6, 12, 4], [20, 5, 4], [8, 8, 4]];
    const [a, b, value] = pick(pairs);
    return {
      type: 'work-together', instruction: 'Work with what each does in ONE hour.',
      question: `Wanjiku can paint a room in ${a} hours. Kamau can paint the same room in ${b} hours. Working together, how many hours do they take?`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value} hours`),
      hints: hintLadder(
        'Do not add the times — two people working together are FASTER than either alone.',
        `Ask what fraction of the room each one paints in a single hour.`,
        'Add those two fractions to get what they paint together in one hour, then turn it upside down.'),
      solution: { steps: [
        { text: 'Rate of each per hour.', expr: `1/${a}  and  1/${b} of the room` },
        { text: 'Add the rates.', expr: `1/${a} + 1/${b} = 1/${value}` },
        { text: 'Invert to get the time.', expr: `${value} hours` }], answer: `${value}` },
      misconceptions: [
        { when: `${a + b}`, feedback: 'You added the two times. Working together must come out FASTER than either person alone.' },
        { when: `${(a + b) / 2}`, feedback: 'The average of the two times is not the answer — add the RATES, not the times.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'one-rate') {
    const total = pick([12, 18, 24, 30, 36, 48]);
    const hrs = pick([2, 3, 4, 6]);
    const value = total / hrs;
    if (!Number.isInteger(value)) return buildRatesOfWork();
    const job = pick(['bricks', 'chairs', 'loaves']);
    return {
      type: 'work-rate', instruction: 'Find the rate per hour.',
      question: `A machine makes ${total} ${job} in ${hrs} hours. Working at the same rate, how many ${job} does it make in ONE hour?`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        'A rate per hour means "how many in a single hour".',
        `You know the amount for ${hrs} hours — share it out evenly.`,
        'This is a division, not a multiplication.'),
      solution: { steps: [
        { text: 'Share the total over the hours.', expr: `${total} ÷ ${hrs} = ${value}` }], answer: `${value}` },
      misconceptions: [
        { when: `${total * hrs}`, feedback: 'Multiplying makes the rate bigger than the total — to find a rate per hour you divide.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  const a = pick([6, 8, 10, 12]);
  const worked = randInt(2, a - 2);
  const value = a - worked;
  return {
    type: 'work-remaining', instruction: 'How much of the job is left?',
    question: `A tap fills a tank in ${a} hours. It has already run for ${worked} hours. How many more hours are needed to fill the tank?`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value} hours`),
    hints: hintLadder(
      'The tap works at a steady rate the whole way through.',
      `In ${worked} hours it has done ${worked} hours’ worth of the ${a} hours needed.`,
      'The rest is what remains of the total time.'),
    solution: { steps: [
      { text: 'Fraction filled so far.', expr: `${worked}/${a}` },
      { text: 'Time still needed.', expr: `${a} − ${worked} = ${value} hours` }], answer: `${value}` },
    misconceptions: [
      { when: `${worked}`, feedback: 'That is how long it has already run. The question asks how much longer it still needs.' },
    ],
    verify: { kind: 'fraction', value },
  };
}

// ============================================================================
// CBC GRADE 7 & 8 — NUMBERS AND MONEY
// Authored against the KICD Grade 7 and Grade 8 Mathematics Curriculum Designs:
//   G7 1.1 Whole Numbers (20 lessons)  — the largest sub-strand in Grade 7:
//          place/total value, reading and writing in words, rounding off,
//          classifying naturals, operations, and number sequences
//   G7 3.7 Money (12 lessons)          — profit/loss, discount, commission,
//          bills, postal charges, mobile money services
//   G8 1.3 Decimals (8 lessons)        — recurring decimals and combined
//          operations
//   G8 1.4 Squares and Square Roots (6 lessons) — of decimals and larger
//          numbers, as read from tables or a calculator
// ============================================================================

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
  'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

// Number to words, to the millions the Grade 7 design asks for.
function inWords(n) {
  if (n === 0) return 'zero';
  const under1000 = (x) => {
    let s = '';
    if (x >= 100) { s += `${ONES[Math.floor(x / 100)]} hundred`; x %= 100; if (x) s += ' and '; }
    if (x >= 20) { s += TENS[Math.floor(x / 10)]; if (x % 10) s += `-${ONES[x % 10]}`; }
    else if (x > 0) s += ONES[x];
    return s;
  };
  const parts = [];
  const millions = Math.floor(n / 1e6), thousands = Math.floor((n % 1e6) / 1000), rest = n % 1000;
  if (millions) parts.push(`${under1000(millions)} million`);
  if (thousands) parts.push(`${under1000(thousands)} thousand`);
  if (rest) parts.push(under1000(rest));
  return parts.join(' ').trim();
}

const PLACE_NAMES = [
  [1, 'ones'], [10, 'tens'], [100, 'hundreds'], [1000, 'thousands'],
  [10000, 'ten thousands'], [100000, 'hundred thousands'], [1000000, 'millions'],
];

// ---- G7 1.1: reading, writing and the TOTAL value of a digit ----
export function buildNumbersInWords() {
  const kind = pick(['to-words', 'to-symbols', 'total-value', 'place-name']);

  if (kind === 'to-words') {
    const n = pick([randInt(1001, 9999), randInt(10001, 99999), randInt(100001, 999999)]);
    const value = inWords(n);
    return {
      type: 'num-to-words', instruction: 'Write the number in words.',
      question: `Write ${n.toLocaleString('en-KE')} in words.`,
      answer: value,
      accepts: accepts(value, value.replace(/-/g, ' '), value.replace(/ and /g, ' ')),
      hints: hintLadder(
        'Break the number into groups of three digits from the right.',
        'Name each group, then say which group it is — thousand, million.',
        'Write the smallest group last, exactly as you would say it aloud.'),
      solution: { steps: [
        { text: 'Split into groups of three from the right.', expr: n.toLocaleString('en-KE') },
        { text: 'Say each group with its name.', expr: value }], answer: value },
      misconceptions: [],
      verify: { kind: 'exact', value },
    };
  }

  if (kind === 'to-symbols') {
    const n = pick([randInt(1001, 9999), randInt(10001, 99999), randInt(100001, 999999)]);
    const value = `${n}`;
    return {
      type: 'num-to-symbols', instruction: 'Write the number in symbols (digits only).',
      question: `Write in symbols:  ${inWords(n)}.`,
      answer: value, accepts: accepts(value, n.toLocaleString('en-KE')),
      hints: hintLadder(
        'Work through the words in the order they are said.',
        'Each named group — million, thousand — fills exactly three digit places.',
        'Where a group is not mentioned, those places are held by zeros.'),
      solution: { steps: [
        { text: 'Take each named group in turn.', expr: inWords(n) },
        { text: 'Fill every place, using zeros where nothing is said.', expr: n.toLocaleString('en-KE') }], answer: value },
      misconceptions: [],
      verify: { kind: 'fraction', value: n },
    };
  }

  if (kind === 'total-value') {
    // The distinction the design keeps separate: the DIGIT versus its value.
    const idx = randInt(2, 5);
    const digits = Array.from({ length: idx + 1 }, () => randInt(1, 9));
    const n = Number(digits.join(''));
    const pos = randInt(0, idx);                       // 0 = ones place
    const digit = digits[idx - pos];
    const value = digit * PLACE_NAMES[pos][0];
    return {
      type: 'num-total-value', instruction: 'Give the TOTAL value, not the digit.',
      question: `In the number ${n.toLocaleString('en-KE')}, what is the TOTAL VALUE of the digit ${digit} in the ${PLACE_NAMES[pos][1]} place?`,
      answer: `${value}`, accepts: accepts(`${value}`, value.toLocaleString('en-KE')),
      hints: hintLadder(
        'Place value and total value are two different things.',
        'The digit tells you HOW MANY; the column tells you how many OF WHAT.',
        `So put the digit together with what one ${PLACE_NAMES[pos][1].replace(/s$/, '')} is worth.`),
      solution: { steps: [
        { text: 'Name the place.', expr: `${PLACE_NAMES[pos][1]} — worth ${PLACE_NAMES[pos][0].toLocaleString('en-KE')} each` },
        { text: 'Multiply the digit by that.', expr: `${digit} × ${PLACE_NAMES[pos][0].toLocaleString('en-KE')} = ${value.toLocaleString('en-KE')}` }], answer: `${value}` },
      misconceptions: [
        { when: `${digit}`, feedback: 'That is the digit itself — its PLACE value. The total value also counts the column it sits in.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  const idx = randInt(3, 6);
  const digits = Array.from({ length: idx + 1 }, () => randInt(1, 9));
  const n = Number(digits.join(''));
  const pos = randInt(1, idx);
  const digit = digits[idx - pos];
  const value = PLACE_NAMES[pos][1];
  return {
    type: 'num-place-name', instruction: 'Name the place, e.g. thousands.',
    question: `In ${n.toLocaleString('en-KE')}, which place does the digit ${digit} occupy? (counting from the right)`,
    answer: value, accepts: accepts(value, value.replace(/s$/, '')),
    hints: hintLadder(
      'Places are counted from the RIGHT-hand end of the number.',
      'Each step to the left is worth 10 times as much as the column before it.',
      `Count how many digits stand to the right of the ${digit} — that is how many steps left it sits.`),
    solution: { steps: [
      { text: 'Count places from the right.', expr: `${pos} place${pos === 1 ? '' : 's'} across` },
      { text: 'Name it.', expr: value }], answer: value },
    misconceptions: [],
    verify: { kind: 'exact', value },
  };
}

// ---- G7 1.1: rounding whole numbers ----
export function buildRoundWholeNumbers() {
  const places = [[10, 'ten'], [100, 'hundred'], [1000, 'thousand'], [10000, 'ten thousand'], [1000000, 'million']];
  const [unit, name] = pick(places);
  const n = randInt(unit * 2, unit * 40);
  // Never land exactly on a boundary — there is nothing to decide then.
  if (n % unit === 0) return buildRoundWholeNumbers();
  const value = Math.round(n / unit) * unit;
  const down = Math.floor(n / unit) * unit;
  const up = down + unit;
  return {
    type: 'round-whole', instruction: 'Round the number as asked.',
    question: `Round ${n.toLocaleString('en-KE')} to the nearest ${name}.`,
    answer: `${value}`, accepts: accepts(`${value}`, value.toLocaleString('en-KE')),
    hints: hintLadder(
      `The answer is one of the two nearest ${name}s — one below, one above.`,
      'Look at the digit immediately to the RIGHT of the place you are rounding to.',
      'That single digit decides which way you go: 5 or more goes up, less than 5 stays.'),
    solution: { steps: [
      { text: 'Find the two candidates.', expr: `${down.toLocaleString('en-KE')} and ${up.toLocaleString('en-KE')}` },
      { text: 'Check the deciding digit.', expr: `the digit after the ${name}s place` },
      { text: 'Round.', expr: value.toLocaleString('en-KE') }], answer: `${value}` },
    misconceptions: [
      { when: `${value === down ? up : down}`, feedback: `That is the other candidate. Only the digit immediately to the right of the ${name}s place decides the direction — 5 or more rounds up.` },
      { when: `${n}`, feedback: 'Rounding must change the number to end in zeros at that place — this is the original.' },
    ],
    verify: { kind: 'fraction', value },
  };
}

// ---- G7 1.1: number sequences ----
export function buildNumberSequences() {
  const kind = pick(['linear', 'multiply', 'square-ish', 'rule']);

  if (kind === 'multiply') {
    const a = randInt(2, 5), r = randInt(2, 4);
    const terms = [a, a * r, a * r * r, a * r * r * r];
    const value = terms[3] * r;
    return {
      type: 'seq-multiply', instruction: 'Find the next term.',
      question: `What is the next number in the sequence  ${terms.join(', ')},  … ?`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        'Check what happens between one term and the next.',
        'Try dividing a term by the one before it — is it always the same?',
        'The sequence grows by repeated multiplying, not by adding a fixed amount.'),
      solution: { steps: [
        { text: 'Compare consecutive terms.', expr: `${terms[1]} ÷ ${terms[0]} = ${r}` },
        { text: 'Apply the same step again.', expr: `${terms[3]} × ${r} = ${value}` }], answer: `${value}` },
      misconceptions: [
        { when: `${terms[3] + (terms[3] - terms[2])}`, feedback: 'You continued by adding the last gap. The gaps here are growing — the rule multiplies.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'square-ish') {
    const start = randInt(1, 4);
    const terms = [0, 1, 2, 3].map(k => start + k * (k + 1) / 2 * 0 + start + (k * (k + 1)) / 2).slice(0, 4);
    const gaps = terms.slice(1).map((t, i) => t - terms[i]);
    const value = terms[3] + (gaps[2] + 1);
    return {
      type: 'seq-growing', instruction: 'Find the next term.',
      question: `What is the next number in the sequence  ${terms.join(', ')},  … ?`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        'Write down the gap between each pair of terms.',
        'The gaps are not all the same — look at how the gaps themselves change.',
        'Continue the pattern in the gaps, then add the next one on.'),
      solution: { steps: [
        { text: 'Find the gaps.', expr: gaps.join(', ') },
        { text: 'The gaps grow by 1 each time, so the next gap follows.', expr: `${gaps[2] + 1}` },
        { text: 'Add it to the last term.', expr: `${terms[3]} + ${gaps[2] + 1} = ${value}` }], answer: `${value}` },
      misconceptions: [
        { when: `${terms[3] + gaps[2]}`, feedback: 'You repeated the last gap. The gaps themselves are increasing, so the next one is bigger.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'rule') {
    const a = randInt(2, 9), d = randInt(2, 9);
    const terms = [0, 1, 2, 3].map(k => a + k * d);
    const value = `${d}`;
    return {
      type: 'seq-rule', instruction: 'Give the constant difference as a number.',
      question: `In the sequence  ${terms.join(', ')},  …  by how much does each term increase?`,
      answer: value, accepts: accepts(value, `+${d}`),
      hints: hintLadder(
        'Compare any term with the one immediately before it.',
        'Subtract, and check you get the same result for every pair.',
        'That constant step is what the question is asking for.'),
      solution: { steps: [
        { text: 'Subtract consecutive terms.', expr: `${terms[1]} − ${terms[0]} = ${d}` },
        { text: 'Check it holds throughout.', expr: `${terms[3]} − ${terms[2]} = ${d}` }], answer: value },
      misconceptions: [
        { when: `${a}`, feedback: 'That is the first term, not the step between terms.' },
      ],
      verify: { kind: 'fraction', value: d },
    };
  }

  const a = randInt(3, 30), d = pick([3, 4, 5, 6, 7, 8, 9, 11, 12, -3, -4, -5]);
  const terms = [0, 1, 2, 3].map(k => a + k * d);
  if (terms.some(t => t < 0)) return buildNumberSequences();
  const value = a + 4 * d;
  return {
    type: 'seq-linear', instruction: 'Find the next term.',
    question: `What is the next number in the sequence  ${terms.join(', ')},  … ?`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder(
      'Look at what is done to get from one term to the next.',
      'Subtract each term from the one after it and see if the step is constant.',
      d < 0 ? 'The sequence is going down, so the step is a subtraction.' : 'Apply that same step once more.'),
    solution: { steps: [
      { text: 'Find the step.', expr: `${terms[1]} − ${terms[0]} = ${d}` },
      { text: 'Apply it to the last term.', expr: `${terms[3]} ${d < 0 ? '−' : '+'} ${Math.abs(d)} = ${value}` }], answer: `${value}` },
    misconceptions: [
      { when: `${a + 3 * d}`, feedback: 'That is the term already shown at the end of the list — go one step further.' },
      ...(d > 0 ? [{ when: `${terms[3] * 2}`, feedback: 'The sequence steps by a fixed amount each time; it does not double.' }] : []),
    ],
    verify: { kind: 'fraction', value },
  };
}

// ---- G7 3.7: discount, commission, bills and mobile money ----
// The design names mobile money services explicitly, and M-Pesa charges are
// the arithmetic these learners actually meet.
export function buildMoneyTransactions() {
  const kind = pick(['discount', 'pct-discount', 'commission', 'bill', 'mobile-money']);

  if (kind === 'discount') {
    const marked = pick([800, 1200, 1500, 2400, 3000, 4500, 6000]);
    const rate = pick([5, 10, 15, 20, 25]);
    const disc = marked * rate / 100;
    const askPaid = coin();
    const value = askPaid ? marked - disc : disc;
    return {
      type: 'money-discount', instruction: 'Work in shillings.',
      question: askPaid
        ? `A jacket is marked KSh ${marked.toLocaleString('en-KE')}. The shop gives a ${rate}% discount. How much does a customer PAY?`
        : `A jacket is marked KSh ${marked.toLocaleString('en-KE')}. The shop gives a ${rate}% discount. How much is the DISCOUNT?`,
      answer: `${value}`, accepts: accepts(`${value}`, value.toLocaleString('en-KE'), `KSh ${value}`),
      hints: hintLadder(
        'A discount is an amount taken OFF the marked price.',
        `Work out ${rate}% of the marked price first.`,
        askPaid ? 'Then take that off what was marked.' : 'That amount is what the question wants.'),
      solution: { steps: [
        { text: `Find ${rate}% of the marked price.`, expr: `${rate}/100 × ${marked} = ${disc}` },
        ...(askPaid ? [{ text: 'Subtract it from the marked price.', expr: `${marked} − ${disc} = ${value}` }] : [])], answer: `${value}` },
      misconceptions: askPaid
        ? [{ when: `${disc}`, feedback: 'That is the discount itself. The customer pays what is LEFT after it is taken off.' }]
        : [{ when: `${marked - disc}`, feedback: 'That is what the customer pays. The question asks only for the amount taken off.' }],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'pct-discount') {
    const marked = pick([500, 800, 1000, 1500, 2000, 2500]);
    const rate = pick([5, 10, 20, 25, 40]);
    const paid = marked * (100 - rate) / 100;
    const value = rate;
    return {
      type: 'money-pct-discount', instruction: 'Give the percentage.',
      question: `An item marked KSh ${marked.toLocaleString('en-KE')} is sold for KSh ${paid.toLocaleString('en-KE')}. What is the percentage discount?`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}%`),
      hints: hintLadder(
        'First find the actual amount taken off in shillings.',
        'A percentage discount is always measured against the MARKED price.',
        'So compare the amount taken off with the marked price.'),
      solution: { steps: [
        { text: 'Find the discount in shillings.', expr: `${marked} − ${paid} = ${marked - paid}` },
        { text: 'Compare with the marked price.', expr: `${marked - paid}/${marked} × 100 = ${value}%` }], answer: `${value}` },
      misconceptions: [
        { when: `${Math.round((marked - paid) / paid * 10000) / 100}`, feedback: 'A discount is measured against the MARKED price, not against what was actually paid.' },
        { when: `${marked - paid}`, feedback: 'That is the discount in shillings. The question asks for it as a percentage.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'commission') {
    const sales = pick([20000, 35000, 50000, 80000, 120000]);
    const rate = pick([2, 3, 4, 5, 8]);
    const value = sales * rate / 100;
    return {
      type: 'money-commission', instruction: 'Work in shillings.',
      question: `An agent is paid ${rate}% commission on all sales. In one month she sells goods worth KSh ${sales.toLocaleString('en-KE')}. How much commission does she earn?`,
      answer: `${value}`, accepts: accepts(`${value}`, value.toLocaleString('en-KE'), `KSh ${value}`),
      hints: hintLadder(
        'Commission is a share of what was SOLD.',
        `So the percentage is taken of the sales figure.`,
        'Nothing is added or subtracted here — it is a single percentage.'),
      solution: { steps: [
        { text: `Find ${rate}% of the sales.`, expr: `${rate}/100 × ${sales.toLocaleString('en-KE')} = ${value.toLocaleString('en-KE')}` }], answer: `${value}` },
      misconceptions: [
        { when: `${sales - value}`, feedback: 'Commission is what she EARNS, not what is left after it.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'bill') {
    // An electricity bill: fixed charge + units at a rate.
    const fixed = pick([150, 200, 250, 300]);
    const rate = pick([12, 15, 18, 20, 25]);
    const units = pick([30, 45, 60, 80, 120]);
    const value = fixed + units * rate;
    return {
      type: 'money-bill', instruction: 'Work in shillings.',
      question: `An electricity bill has a fixed charge of KSh ${fixed} plus KSh ${rate} for every unit used. A household uses ${units} units in a month. What is the TOTAL bill?`,
      answer: `${value}`, accepts: accepts(`${value}`, value.toLocaleString('en-KE'), `KSh ${value}`),
      hints: hintLadder(
        'A bill like this has two separate parts.',
        'One part is charged no matter how much is used; the other depends on the units.',
        'Work out the part that depends on units first, then bring in the fixed charge.'),
      solution: { steps: [
        { text: 'Cost of the units used.', expr: `${units} × ${rate} = ${units * rate}` },
        { text: 'Add the fixed charge.', expr: `${units * rate} + ${fixed} = ${value.toLocaleString('en-KE')}` }], answer: `${value}` },
      misconceptions: [
        { when: `${units * rate}`, feedback: 'That covers only the units. The fixed charge is payable on top of it.' },
        { when: `${(fixed + rate) * units}`, feedback: 'The fixed charge is paid ONCE for the month, not on every unit.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  const amount = pick([500, 1000, 2500, 5000, 10000]);
  const charge = pick([10, 25, 55, 100]);
  const askTotal = coin();
  const value = askTotal ? amount + charge : amount - charge;
  return {
    type: 'money-mobile', instruction: 'Work in shillings.',
    question: askTotal
      ? `Achieng sends KSh ${amount.toLocaleString('en-KE')} by mobile money. The sending charge is KSh ${charge}, paid by her. How much is deducted from her account altogether?`
      : `Achieng withdraws KSh ${amount.toLocaleString('en-KE')} from her mobile money account. A withdrawal charge of KSh ${charge} is deducted from the account as well. If she had exactly KSh ${amount.toLocaleString('en-KE')} plus the charge, how much cash does she receive?`,
    answer: `${askTotal ? value : amount}`,
    accepts: accepts(`${askTotal ? value : amount}`, (askTotal ? value : amount).toLocaleString('en-KE')),
    hints: hintLadder(
      'The amount moved and the charge for moving it are two separate sums.',
      askTotal ? 'The charge is paid on TOP of what is sent.' : 'The cash handed over is the amount withdrawn; the charge comes out of the account separately.',
      'Decide which of the two the question is actually asking about.'),
    solution: { steps: [
      { text: 'Separate the amount from the charge.', expr: `KSh ${amount.toLocaleString('en-KE')} and KSh ${charge}` },
      { text: askTotal ? 'The account loses both.' : 'The cash received is the amount itself.', expr: `${askTotal ? value : amount}` }], answer: `${askTotal ? value : amount}` },
    misconceptions: askTotal
      ? [{ when: `${amount}`, feedback: 'That is what she sent. The charge leaves her account as well, so more than that is deducted.' }]
      : [{ when: `${amount - charge}`, feedback: 'The charge is taken from the account, not out of the cash she is handed.' }],
    verify: { kind: 'fraction', value: askTotal ? value : amount },
  };
}

// ---- G8 1.3: recurring decimals, and converting both ways ----
export function buildRecurringDecimals() {
  const kind = pick(['classify', 'fraction-to-decimal', 'recurring-to-fraction', 'notation']);

  if (kind === 'classify') {
    const terminating = [[1, 2, '0.5'], [3, 4, '0.75'], [1, 5, '0.2'], [7, 8, '0.875'], [3, 10, '0.3'], [1, 4, '0.25']];
    const recurring = [[1, 3], [2, 3], [1, 6], [5, 6], [1, 9], [4, 9], [1, 7], [2, 11]];
    const isRec = coin();
    const f = isRec ? pick(recurring) : pick(terminating);
    const value = isRec ? 'recurring' : 'terminating';
    return {
      type: 'dec-classify', instruction: 'Answer recurring or terminating.',
      question: `Written as a decimal, is  ${f[0]}/${f[1]}  recurring or terminating?`,
      answer: value, accepts: accepts(value, isRec ? 'repeating' : 'terminates'),
      hints: hintLadder(
        'A terminating decimal stops; a recurring one repeats forever.',
        'It depends entirely on the denominator once the fraction is in simplest form.',
        'Ask whether the denominator can be built out of 2s and 5s alone.'),
      solution: { steps: [
        { text: 'Look at the denominator in simplest form.', expr: `${f[1]}` },
        { text: isRec ? 'It has a factor other than 2 or 5, so the division never ends.' : 'It is made only of 2s and 5s, so the division ends.', expr: value }], answer: value },
      misconceptions: [
        { when: isRec ? 'terminating' : 'recurring', feedback: 'Check the denominator: only denominators built from 2s and 5s give a decimal that stops.' },
      ],
      verify: { kind: 'exact', value },
    };
  }

  if (kind === 'fraction-to-decimal') {
    const f = pick([[1, 2, '0.5'], [1, 4, '0.25'], [3, 4, '0.75'], [1, 5, '0.2'], [2, 5, '0.4'],
      [3, 5, '0.6'], [1, 8, '0.125'], [5, 8, '0.625'], [7, 20, '0.35'], [9, 25, '0.36']]);
    const value = f[2];
    return {
      type: 'dec-from-fraction', instruction: 'Give the decimal.',
      question: `Convert  ${f[0]}/${f[1]}  to a decimal.`,
      answer: value, accepts: accepts(value, value.replace(/^0/, '')),
      hints: hintLadder(
        'A fraction bar means divide.',
        `So this is ${f[0]} shared into ${f[1]} equal parts.`,
        'Carry the division past the decimal point, adding zeros as needed.'),
      solution: { steps: [
        { text: 'Treat the fraction as a division.', expr: `${f[0]} ÷ ${f[1]}` },
        { text: 'Divide.', expr: value }], answer: value },
      misconceptions: [
        { when: `${f[1] / f[0]}`, feedback: 'The division has gone the wrong way round — the top number is divided BY the bottom.' },
      ],
      verify: { kind: 'fraction', value: parseFloat(value) },
    };
  }

  if (kind === 'recurring-to-fraction') {
    // Single-digit recurrence: 0.ẋ = x/9 — the case Grade 8 is asked for.
    const d = randInt(1, 8);
    const g = (a, b) => (b === 0 ? a : g(b, a % b));
    const k = g(d, 9);
    const value = `${d / k}/${9 / k}`;
    return {
      type: 'dec-to-fraction', instruction: 'Give the fraction in simplest form.',
      question: `Express the recurring decimal  0.${d}${d}${d}…  as a fraction in its simplest form.`,
      answer: value, accepts: accepts(value, `${d}/9`),
      hints: hintLadder(
        'Call the decimal x, then make a second copy of it with the repeating part shifted.',
        'Multiplying by 10 moves the point one place — and the tail still repeats identically.',
        'Subtract the two so the endless tail cancels, then solve for x and simplify.'),
      solution: { steps: [
        { text: 'Let x be the decimal.', expr: `x = 0.${d}${d}${d}…` },
        { text: 'Multiply by 10.', expr: `10x = ${d}.${d}${d}${d}…` },
        { text: 'Subtract — the tails cancel.', expr: `9x = ${d}` },
        { text: 'Solve and simplify.', expr: value }], answer: value },
      misconceptions: [
        { when: `${d}/10`, feedback: `${d}/10 is the terminating decimal 0.${d}, which stops. The recurring one is slightly larger because the digits never end.` },
        ...(k > 1 ? [{ when: `${d}/9`, feedback: 'Correct before simplifying — but this fraction still cancels down.' }] : []),
      ],
      verify: { kind: 'fraction', value: d / 9 },
    };
  }

  const d = randInt(1, 9);
  const value = `0.${d}`;
  return {
    type: 'dec-notation', instruction: 'Write the decimal the dot stands for, to 1 decimal place.',
    question: `The notation 0.${d}̇ means the digit ${d} repeats forever. Written out to ONE decimal place, what is this number?`,
    answer: value, accepts: accepts(value, `.${d}`),
    hints: hintLadder(
      'The dot above a digit is a shorthand for "this repeats without end".',
      'Writing to one decimal place means keeping only the first digit after the point.',
      'The repeating tail sits beyond the place you are asked for.'),
    solution: { steps: [
      { text: 'Expand the notation.', expr: `0.${d}${d}${d}…` },
      { text: 'Keep one decimal place.', expr: value }], answer: value },
    misconceptions: [],
    verify: { kind: 'fraction', value: parseFloat(value) },
  };
}

// ---- G8 1.4: squares and square roots beyond the perfect squares ----
// The design assumes tables or a calculator, so decimals and larger numbers
// are fair game — the skill is knowing which operation is wanted and how the
// size of the answer should behave.
export function buildSquaresTables() {
  const kind = pick(['square-decimal', 'root-larger', 'between', 'root-decimal']);

  if (kind === 'square-decimal') {
    const a = randInt(11, 99) / 10;
    const value = Math.round(a * a * 100) / 100;
    return {
      type: 'sq-decimal', instruction: 'Give your answer to 2 decimal places.',
      question: `Work out  ${a}²`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}`.replace(/0+$/, '').replace(/\.$/, '')),
      hints: hintLadder(
        'Squaring means multiplying the number by itself.',
        'Multiply as though there were no decimal point first.',
        'Then count the decimal places in BOTH numbers to place the point.'),
      solution: { steps: [
        { text: 'Multiply the number by itself.', expr: `${a} × ${a}` },
        { text: 'Place the decimal point.', expr: `${value}` }], answer: `${value}` },
      misconceptions: [
        { when: `${Math.round(a * 2 * 100) / 100}`, feedback: 'That doubles the number. Squaring multiplies it by ITSELF.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'root-larger') {
    const r = randInt(13, 40);
    const value = r;
    return {
      type: 'sq-root-larger', instruction: 'Give the square root.',
      question: `Find  √${r * r}`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        'A square root asks which number multiplied by itself gives this.',
        `The answer is smaller than ${r * r} — considerably smaller.`,
        'Try squaring a few likely two-digit numbers to close in on it.'),
      solution: { steps: [
        { text: 'Look for the number that squares to it.', expr: `? × ? = ${r * r}` },
        { text: 'Check.', expr: `${value} × ${value} = ${r * r}` }], answer: `${value}` },
      misconceptions: [
        { when: `${(r * r) / 2}`, feedback: 'Halving is not the same as taking a square root — check by multiplying your answer by itself.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'root-decimal') {
    const base = pick([1.2, 1.5, 2.5, 3.5, 0.4, 0.6, 0.8]);
    const sq = Math.round(base * base * 100) / 100;
    const value = base;
    return {
      type: 'sq-root-decimal', instruction: 'Give the square root.',
      question: `Find  √${sq}`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        'Ask which number multiplied by itself gives this.',
        base < 1
          ? 'Careful — squaring a number below 1 makes it SMALLER, so the root is bigger than the number you were given.'
          : 'The answer has fewer decimal places than the number you were given.',
        'Try squaring a candidate and compare.'),
      solution: { steps: [
        { text: 'Look for the number that squares to it.', expr: `? × ? = ${sq}` },
        { text: 'Check.', expr: `${value} × ${value} = ${sq}` }], answer: `${value}` },
      misconceptions: [
        { when: `${sq / 2}`, feedback: 'Halving is not a square root — multiply your answer by itself and compare with what you were given.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  const r = randInt(5, 20);
  const n = randInt(r * r + 1, (r + 1) * (r + 1) - 1);
  const value = r;
  return {
    type: 'sq-between', instruction: 'Give the whole number just below it.',
    question: `√${n} lies between two whole numbers. What is the SMALLER one?`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder(
      'Find the perfect squares that this number sits between.',
      'Their square roots are the two whole numbers you want.',
      'The lower perfect square gives the smaller of the two.'),
    solution: { steps: [
      { text: 'Trap it between perfect squares.', expr: `${r * r} < ${n} < ${(r + 1) * (r + 1)}` },
      { text: 'Take the root of the lower one.', expr: `${value}` }], answer: `${value}` },
    misconceptions: [
      { when: `${r + 1}`, feedback: 'That is the UPPER whole number — the question asks for the one below.' },
    ],
    verify: { kind: 'fraction', value },
  };
}

export const NUMBERS_CONTENT = {
  G5_ADDITION:           withWorkedExample(() => buildColumnAddSub()),
  G5_SUBTRACTION:        withWorkedExample(() => buildColumnAddSub({ sub: true })),
  G6_RATIOS:             withWorkedExample(buildRatioShare),
  // Cambridge gap fill (Stages 7-9)
  G7_PLACE_VALUE:        withWorkedExample(buildBigPlaceValue),
  G7_DIVISIBILITY:       withWorkedExample(buildDivisibility),
  G7_PRIME_FACTORIZATION: withWorkedExample(buildPrimeFactorization),
  G7_DECIMAL_PV:         withWorkedExample(buildDecimalPV),
  G7_SQUARES_EXT:        withWorkedExample(buildSquaresExtended),
  G8_STANDARD_FORM:      withWorkedExample(buildStandardForm),
  G8_RATIO_PROPORTION:   withWorkedExample(buildProportion),
  G8_PROFIT_LOSS:        withWorkedExample(buildProfitLoss),
  G9_COMPOUND_INTEREST:  withWorkedExample(buildCompoundInterest),
  G9_SURDS_INTRO:        withWorkedExample(buildSurds),
  G9_VARIATION:          withWorkedExample(buildVariation),
  G5_PATTERNS:           withWorkedExample(buildNumberPattern),
  G5_MISSING_NUMBER:     withWorkedExample(buildMissingNumber),

  // Place value — taught pictorially with a place-value chart.
  G5_PLACE_VALUE:        withWorkedExample(buildPlaceValueChart),
  G6_PLACE_VALUE:        withWorkedExample(buildPlaceValueChart),

  // Multiplication & division escalate to the dot-array model on struggle.
  G5_MULTIPLICATION:     withLevels({
                            abstract: withWorkedExample(buildMultiplyFact),
                            concrete: withWorkedExample(buildMultiplicationArray),
                          }),
  G5_DIVISION:           withLevels({
                            abstract: withWorkedExample(buildDivideFact),
                            concrete: withWorkedExample(buildDivisionArray),
                          }),

  // Concept-first (concrete): integers on a number line, decimals on a grid.
  G6_INTEGERS_INTRO:     withWorkedExample(buildPlaceInteger),
  G5_DECIMALS_INTRO:     withWorkedExample(buildDecimalGrid),
  G5_DECIMALS_ADD:       withWorkedExample(() => buildDecimalAddSub({ sub: false })),
  G5_DECIMALS_SUB:       withWorkedExample(() => buildDecimalAddSub({ sub: true })),
  G6_DECIMALS_MUL:       withWorkedExample(buildDecimalMul),
  G6_DECIMALS_DIV:       withWorkedExample(buildDecimalDiv),
  G7_DECIMALS_MUL:       withWorkedExample(buildDecimalMul),
  G7_DECIMALS_DIV:       withWorkedExample(buildDecimalDiv),
  G6_INTEGERS_ADD_SUB:   withLevels({
                            abstract: withWorkedExample(buildIntegerAddSub),
                            concrete: withWorkedExample(buildIntegerJump),
                          }),
  G7_INTEGERS_MUL_DIV:   withWorkedExample(buildIntegerMulDiv),
  G6_BODMAS_BASIC:       withWorkedExample(() => buildBodmas({ advanced: false })),
  G7_BODMAS_ADV:         withWorkedExample(() => buildBodmas({ advanced: true })),
  G8_INDICES_INTRO:      withWorkedExample(buildIndicesEval),
  G8_INDICES_LAWS:       withWorkedExample(buildIndicesLaws),
  G6_SQUARES:            withWorkedExample(buildSquare),
  G7_SQUARE_ROOTS:       withWorkedExample(buildSquareRoot),
  G8_CUBES_CUBE_ROOTS:   withWorkedExample(buildCubeRoot),
  G7_PRIMES:             withWorkedExample(buildPrime),
  G8_PERCENTAGE_CHANGE:  withWorkedExample(buildPercentageChange),
  G9_SURDS_OPERATIONS:   withWorkedExample(buildSurdsOps),
  G9_COMMERCIAL_ARITH:   withWorkedExample(buildCommercialArith),
  G8_SIMPLE_INTEREST:    withWorkedExample(buildSimpleInterest),
  G10_LOGARITHMS_INTRO:  withWorkedExample(buildCommonLogs),
  G10_LOG_LAWS:          withWorkedExample(buildLogLaws),
  G9_INTEGERS_COMBINED:  withWorkedExample(buildIntegersCombined),
  G9_COMPOUND_PROPORTION: withWorkedExample(buildCompoundProportion),
  G9_RATES_OF_WORK:      withWorkedExample(buildRatesOfWork),
  // CBC Grade 7 Numbers 1.1 (20 lessons) and Money 3.7 (12 lessons)
  G7_NUMBERS_WORDS:      withWorkedExample(buildNumbersInWords),
  G7_ROUNDING_WHOLE:     withWorkedExample(buildRoundWholeNumbers),
  G7_NUMBER_SEQUENCES:   withWorkedExample(buildNumberSequences),
  G7_MONEY_TRANSACTIONS: withWorkedExample(buildMoneyTransactions),
  // CBC Grade 8 Numbers 1.3 Decimals and 1.4 Squares and Square Roots
  G8_RECURRING_DECIMALS: withWorkedExample(buildRecurringDecimals),
  G8_SQUARES_TABLES:     withWorkedExample(buildSquaresTables),
};

export const NUMBERS_SKILL_IDS = Object.keys(NUMBERS_CONTENT);
