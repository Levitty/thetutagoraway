// ============================================================================
// NUMBER FOUNDATION CONTENT — decimals, integers, order of operations, indices,
// percentages, roots, primes. The everyday arithmetic that everything else
// rests on. All answers are numbers / index-forms / yes-no, verified by the
// quality gate. Decimal arithmetic uses integer scaling to avoid float drift.
// ============================================================================

import { accepts, hintLadder, randInt, nonzero, pick, coin, withWorkedExample, withLevels } from './schema.js';

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
  const A = randInt(11, 99), B = randInt(2, 19);     // a.b  ×  c.d / c
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
  const Q = randInt(11, 99);              // quotient in tenths
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
  const a = randInt(-12, 12), b = randInt(-12, 12), sub = coin();
  const res = sub ? a - b : a + b, op = sub ? '−' : '+';
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
  const base = pick([20, 40, 60, 80, 120, 160, 200, 240, 400]);
  const p = pick([5, 10, 15, 20, 25, 50]);
  const up = coin();
  const value = up ? base + (base * p) / 100 : base - (base * p) / 100;
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
  const h = randInt(1, 99), val = h / 100, vs = `${val}`;
  return {
    type: 'decimal-grid', instruction: 'Shade the grid to show the decimal.',
    question: `Shade the grid to show ${vs}.`,
    answer: vs, accepts: accepts(vs, `${h}/100`),
    hints: hintLadder(
      'The whole grid is 1. Each small square is 0.01 (one hundredth).',
      `${vs} means ${h} hundredths — shade ${h} squares.`,
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
  const d = randInt(2, 9), q = randInt(2, 12), a = d * q;
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
  const rows = randInt(2, 6), cols = randInt(2, 6), total = rows * cols;
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
  const hi = randInt(0, nDigits - 1);
  const digit = digits[hi], place = placeVals[hi], value = digit * place;
  const numStr = Number(digits.join('')).toLocaleString('en-US');
  return {
    type: 'place-value-chart', instruction: 'Find the value of the highlighted digit.',
    question: `In ${numStr}, what is the value of the highlighted digit (${digit})?`,
    answer: `${value}`, accepts: accepts(`${value}`, value.toLocaleString('en-US')),
    hints: hintLadder(
      `The digit ${digit} sits in the ${place}s column.`,
      `Its value is ${digit} × ${place}.`,
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
  const askFirst = coin();
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
      `${asked} gets ${parts} part${parts > 1 ? 's' : ''} of ${per} each.`,
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
      `${n} = ${tree}.`),
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

export const NUMBERS_CONTENT = {
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
  G8_SIMPLE_INTEREST:    withWorkedExample(buildSimpleInterest),
};

export const NUMBERS_SKILL_IDS = Object.keys(NUMBERS_CONTENT);
