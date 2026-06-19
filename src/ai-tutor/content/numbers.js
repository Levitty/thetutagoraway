// ============================================================================
// NUMBER FOUNDATION CONTENT — decimals, integers, order of operations, indices,
// percentages, roots, primes. The everyday arithmetic that everything else
// rests on. All answers are numbers / index-forms / yes-no, verified by the
// quality gate. Decimal arithmetic uses integer scaling to avoid float drift.
// ============================================================================

import { accepts, hintLadder, randInt, pick, coin, withWorkedExample } from './schema.js';

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
    hints: hintLadder(
      'Line up the decimal points.',
      'Keep the decimal point in the same column in your answer.',
      `${sub ? 'Subtract' : 'Add'} as with whole numbers, then place the point.`,
    ),
    solution: {
      steps: [
        { text: 'Line up the decimal points and the place values.', expr: `${x} ${op} ${y}` },
        { text: `${sub ? 'Subtract' : 'Add'} column by column.`, expr: numStr(res) },
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
    hints: hintLadder(
      'Subtracting a negative is the same as adding; adding a negative is the same as subtracting.',
      'Think of a number line: which direction do you move?',
      `${a} ${op} ${signed(b)} = ?`,
    ),
    solution: {
      steps: [
        { text: 'Rewrite double signs (− − becomes +, + − becomes −).', expr: `${a} ${sub ? (b < 0 ? '+' : '−') : (b < 0 ? '−' : '+')} ${Math.abs(b)}` },
        { text: 'Compute.', expr: `${res}` },
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

export const NUMBERS_CONTENT = {
  G5_PATTERNS:           withWorkedExample(buildNumberPattern),
  G5_MISSING_NUMBER:     withWorkedExample(buildMissingNumber),
  G5_DECIMALS_ADD:       withWorkedExample(() => buildDecimalAddSub({ sub: false })),
  G5_DECIMALS_SUB:       withWorkedExample(() => buildDecimalAddSub({ sub: true })),
  G6_DECIMALS_MUL:       withWorkedExample(buildDecimalMul),
  G6_DECIMALS_DIV:       withWorkedExample(buildDecimalDiv),
  G7_DECIMALS_MUL:       withWorkedExample(buildDecimalMul),
  G7_DECIMALS_DIV:       withWorkedExample(buildDecimalDiv),
  G6_INTEGERS_ADD_SUB:   withWorkedExample(buildIntegerAddSub),
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
