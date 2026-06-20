// ============================================================================
// FRACTIONS & NUMBER FOUNDATION — the strand where struggling students live.
//
// Fraction proficiency around age 10–12 is the single best predictor of later
// algebra success (Siegler et al.), so this content leans hard on the two
// things that make fractions stick: SIMPLEST-FORM answers (with verified,
// reduced fractions) and MISCONCEPTION-SPECIFIC feedback — above all the
// notorious "add across" error (a/b + c/d ≠ (a+c)/(b+d)).
//
// All answers are single reduced fractions / whole numbers / terminating
// decimals, which the lesson UI's answer-matcher compares by value — so a
// student who writes 6/8 still matches 3/4.
// ============================================================================

import { accepts, hintLadder, randInt, pick, coin, withWorkedExample, withLevels } from './schema.js';

// ---- fraction helpers ----
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; };
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const reduce = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
const terminates = (d) => { let x = Math.abs(d); while (x % 2 === 0) x /= 2; while (x % 5 === 0) x /= 5; return x === 1; };
const fracStr = (n, d) => { const [rn, rd] = reduce(n, d); return rd === 1 ? `${rn}` : `${rn}/${rd}`; };
const fracAccepts = (n, d) => {
  const [rn, rd] = reduce(n, d);
  const list = [rd === 1 ? `${rn}` : `${rn}/${rd}`];
  if (rd !== 1 && terminates(rd)) list.push(`${+(rn / rd).toFixed(6)}`);
  return accepts(...list);
};

// ---- equivalent fractions: a/b = ?/(b·k) ----
export function buildEquivalentFraction() {
  let a, b;
  do { b = randInt(2, 9); a = randInt(1, b - 1); } while (gcd(a, b) !== 1);  // start in lowest terms
  const k = randInt(2, 6);
  const ans = a * k, newDen = b * k;
  return {
    type: 'equivalent-fraction',
    instruction: 'Find the missing numerator.',
    question: `Fill in the blank:   ${a}/${b} = ?/${newDen}`,
    answer: `${ans}`,
    accepts: accepts(`${ans}`, `${ans}/${newDen}`),
    hints: hintLadder(
      'What do you multiply the bottom by to get the new denominator?',
      `${b} × ${k} = ${newDen}, so multiply the TOP by the same ${k}.`,
      `${a} × ${k} = ?`,
    ),
    solution: {
      steps: [
        { text: `The denominator was multiplied by ${k} (${b}×${k}=${newDen}).`, expr: `×${k}` },
        { text: 'Multiply the numerator by the same number.', expr: `${a} × ${k} = ${ans}` },
      ],
      answer: `${ans}`,
    },
    misconceptions: [
      { when: `${a + k}`, feedback: 'Multiply the numerator by the same factor — don’t add it.' },
    ],
    // The answer is the missing NUMERATOR; verify it independently via the
    // equivalence x = a·(newDen)/b.
    verify: { kind: 'fraction', value: (a * newDen) / b },
  };
}

// ---- add/subtract with LIKE denominators (G5) ----
export function buildAddSubLike({ sub = false } = {}) {
  const d = randInt(3, 12);
  let a = randInt(1, d - 1), c = randInt(1, d - 1);
  if (sub && a < c) [a, c] = [c, a];           // keep result ≥ 0
  const num = sub ? a - c : a + c, op = sub ? '−' : '+';
  return {
    type: sub ? 'subtract-like' : 'add-like',
    instruction: `${sub ? 'Subtract' : 'Add'} the fractions. Give the answer in simplest form.`,
    question: `${a}/${d} ${op} ${c}/${d}`,
    answer: fracStr(num, d),
    accepts: fracAccepts(num, d),
    hints: hintLadder(
      'The denominators are the same, so the bottom number stays the same.',
      `Just ${sub ? 'subtract' : 'add'} the numerators: ${a} ${op} ${c}.`,
      'Then simplify if you can.',
    ),
    solution: {
      steps: [
        { text: `Same denominator — ${sub ? 'subtract' : 'add'} the numerators only.`, expr: `${num}/${d}` },
        { text: 'Simplify if possible.', expr: fracStr(num, d) },
      ],
      answer: fracStr(num, d),
    },
    misconceptions: [
      { when: `${num}/${d + d}`, feedback: 'Keep the denominator the same — only the numerators are added/subtracted.' },
    ],
    verify: { kind: 'fraction', value: num / d },
  };
}

// ---- add/subtract with UNLIKE denominators (G6) — the big one ----
export function buildAddSubUnlike({ sub = false } = {}) {
  let b = randInt(2, 9), d; do { d = randInt(2, 9); } while (d === b);
  let a = randInt(1, b), c = randInt(1, d);
  if (sub && a * d < c * b) { [a, b, c, d] = [c, d, a, b]; }    // keep result ≥ 0
  const L = lcm(b, d), a2 = a * (L / b), c2 = c * (L / d);
  const num = sub ? a2 - c2 : a2 + c2, op = sub ? '−' : '+';
  const simplifies = reduce(num, L)[1] !== L;
  return {
    type: sub ? 'subtract-unlike' : 'add-unlike',
    instruction: `${sub ? 'Subtract' : 'Add'} the fractions. Give the answer in simplest form.`,
    question: `${a}/${b} ${op} ${c}/${d}`,
    answer: fracStr(num, L),
    accepts: fracAccepts(num, L),
    hints: hintLadder(
      `You need a common denominator before you can ${sub ? 'subtract' : 'add'}.`,
      `The lowest common denominator of ${b} and ${d} is ${L}.`,
      `Rewrite as ${a2}/${L} ${op} ${c2}/${L}, then ${sub ? 'subtract' : 'add'} the numerators.`,
    ),
    solution: {
      steps: [
        { text: `Find the lowest common denominator of ${b} and ${d}.`, expr: `LCD = ${L}` },
        { text: 'Rewrite both fractions over it.', expr: `${a2}/${L} ${op} ${c2}/${L}` },
        { text: `${sub ? 'Subtract' : 'Add'} the numerators (keep the denominator).`, expr: `${num}/${L}` },
        ...(simplifies ? [{ text: 'Simplify.', expr: fracStr(num, L) }] : []),
      ],
      answer: fracStr(num, L),
    },
    misconceptions: [
      { when: `${a + c}/${b + d}`, feedback: `Don’t add across! ${a}/${b} ${op} ${c}/${d} is NOT (${a}${op}${c})/(${b}${op}${d}). Use a common denominator first.` },
    ],
    verify: { kind: 'fraction', value: sub ? a / b - c / d : a / b + c / d },
  };
}

// ---- multiply fractions ----
export function buildMulFractions() {
  const a = randInt(1, 8), b = randInt(2, 9), c = randInt(1, 8), d = randInt(2, 9);
  const num = a * c, den = b * d;
  return {
    type: 'multiply-fractions',
    instruction: 'Multiply the fractions. Give the answer in simplest form.',
    question: `${a}/${b} × ${c}/${d}`,
    answer: fracStr(num, den),
    accepts: fracAccepts(num, den),
    hints: hintLadder(
      'To multiply fractions, multiply straight across — no common denominator needed.',
      `Numerators: ${a} × ${c}.   Denominators: ${b} × ${d}.`,
      'Then simplify.',
    ),
    solution: {
      steps: [
        { text: 'Multiply numerators, and denominators.', expr: `${num}/${den}` },
        { text: 'Simplify.', expr: fracStr(num, den) },
      ],
      answer: fracStr(num, den),
    },
    misconceptions: [
      { when: fracStr(a * d, b * c), feedback: 'That looks like division — to multiply, do NOT flip either fraction.' },
    ],
    verify: { kind: 'fraction', value: (a / b) * (c / d) },
  };
}

// ---- divide fractions ----
export function buildDivFractions() {
  const a = randInt(1, 8), b = randInt(2, 9), c = randInt(1, 8), d = randInt(2, 9);
  const num = a * d, den = b * c;
  return {
    type: 'divide-fractions',
    instruction: 'Divide the fractions. Give the answer in simplest form.',
    question: `${a}/${b} ÷ ${c}/${d}`,
    answer: fracStr(num, den),
    accepts: fracAccepts(num, den),
    hints: hintLadder(
      'Dividing by a fraction means multiplying by its reciprocal.',
      `Flip the second fraction: ${c}/${d} becomes ${d}/${c}.`,
      `Then multiply: ${a}/${b} × ${d}/${c}.`,
    ),
    solution: {
      steps: [
        { text: 'Keep the first, flip the second, multiply (KFC).', expr: `${a}/${b} × ${d}/${c}` },
        { text: 'Multiply across.', expr: `${num}/${den}` },
        { text: 'Simplify.', expr: fracStr(num, den) },
      ],
      answer: fracStr(num, den),
    },
    misconceptions: [
      { when: fracStr(a * c, b * d), feedback: 'You multiplied without flipping. To divide, flip the SECOND fraction first.' },
    ],
    verify: { kind: 'fraction', value: (a / b) / (c / d) },
  };
}

// ---- mixed number -> improper fraction ----
export function buildMixedToImproper() {
  const w = randInt(2, 5), d = randInt(2, 9), n = randInt(1, d - 1);
  const num = w * d + n;
  return {
    type: 'mixed-to-improper',
    instruction: 'Write as an improper fraction.',
    question: `Convert to an improper fraction:   ${w} ${n}/${d}`,
    answer: fracStr(num, d),
    accepts: fracAccepts(num, d),
    hints: hintLadder(
      'Multiply the whole number by the denominator, then add the numerator.',
      `${w} × ${d} = ${w * d}, then + ${n}.`,
      'Keep the same denominator.',
    ),
    solution: {
      steps: [
        { text: `Whole × denominator: ${w} × ${d}.`, expr: `${w * d}` },
        { text: `Add the numerator: ${w * d} + ${n}.`, expr: `${num}` },
        { text: 'Put over the original denominator.', expr: fracStr(num, d) },
      ],
      answer: fracStr(num, d),
    },
    misconceptions: [
      { when: `${w + n}/${d}`, feedback: 'Multiply the whole number by the denominator first — don’t just add it to the numerator.' },
    ],
    verify: { kind: 'fraction', value: num / d },
  };
}

// ---- compare two fractions ----
export function buildCompareFractions() {
  let b = randInt(2, 9), d; do { d = randInt(2, 9); } while (d === b);
  const a = randInt(1, b), c = randInt(1, d);
  const diff = a / b - c / d;
  const sym = diff > 1e-9 ? '>' : diff < -1e-9 ? '<' : '=';
  return {
    type: 'compare-fractions',
    instruction: 'Compare the fractions. Answer with <, > or =.',
    question: `Insert <, > or =:   ${a}/${b}  ?  ${c}/${d}`,
    answer: sym,
    accepts: accepts(sym),
    hints: hintLadder(
      'Cross-multiply: compare a×d with c×b.',
      `Compare ${a}×${d} = ${a * d}  with  ${c}×${b} = ${c * b}.`,
      'The side with the larger cross-product is the larger fraction.',
    ),
    solution: {
      steps: [
        { text: 'Cross-multiply.', expr: `${a}×${d} = ${a * d},  ${c}×${b} = ${c * b}` },
        { text: 'Compare the two products.', expr: `${a / b} ${sym} ${c / d}` },
      ],
      answer: sym,
    },
    misconceptions: [
      { when: diff > 1e-9 ? '<' : '>', feedback: 'A bigger denominator does NOT mean a bigger fraction — cross-multiply to be sure.' },
    ],
    verify: { kind: 'compare', diff },
  };
}

// ---- reciprocal of a fraction ----
export function buildReciprocal() {
  const a = randInt(2, 9), b = randInt(2, 9);
  return {
    type: 'reciprocal',
    instruction: 'Write the reciprocal.',
    question: `What is the reciprocal of ${a}/${b}?`,
    answer: fracStr(b, a),
    accepts: fracAccepts(b, a),
    hints: hintLadder('The reciprocal flips the fraction upside down.', `${a}/${b} becomes ${b}/${a}.`),
    solution: { steps: [{ text: 'Swap numerator and denominator.', expr: fracStr(b, a) }], answer: fracStr(b, a) },
    misconceptions: [],
    verify: { kind: 'fraction', value: b / a },
  };
}

// ---- LCM / GCD (supporting number skills) ----
export function buildLCM() {
  const a = randInt(3, 12), b = randInt(3, 12);
  const v = lcm(a, b);
  return {
    type: 'lcm',
    instruction: 'Find the lowest common multiple.',
    question: `Find the LCM of ${a} and ${b}.`,
    answer: `${v}`,
    accepts: accepts(`${v}`),
    hints: hintLadder('List the multiples of each and find the first they share.',
      `Or use LCM = (a × b) ÷ HCF.  HCF(${a},${b}) = ${gcd(a, b)}.`),
    solution: { steps: [{ text: 'LCM = product ÷ HCF.', expr: `${a}×${b} ÷ ${gcd(a, b)} = ${v}` }], answer: `${v}` },
    misconceptions: [{ when: `${a * b}`, feedback: 'The product works but isn’t always the LOWEST — divide by the HCF.' }],
    verify: { kind: 'fraction', value: v },
  };
}

export function buildGCD() {
  let a = randInt(8, 40), b = randInt(8, 40);
  const v = gcd(a, b);
  return {
    type: 'gcd',
    instruction: 'Find the highest common factor.',
    question: `Find the HCF of ${a} and ${b}.`,
    answer: `${v}`,
    accepts: accepts(`${v}`),
    hints: hintLadder('Find the largest number that divides both exactly.',
      'List the factors of each, or use prime factorisation.'),
    solution: { steps: [{ text: 'Largest factor common to both.', expr: `HCF = ${v}` }], answer: `${v}` },
    misconceptions: [],
    verify: { kind: 'fraction', value: v },
  };
}

// ---- fraction -> decimal (terminating) ----
export function buildFractionToDecimal() {
  const d = pick([2, 4, 5, 8, 10, 20, 25]);   // terminating denominators
  const a = randInt(1, d - 1);
  const [rn, rd] = reduce(a, d);
  const dec = +(rn / rd).toFixed(6);
  return {
    type: 'fraction-to-decimal',
    instruction: 'Write as a decimal.',
    question: `Write ${a}/${d} as a decimal.`,
    answer: `${dec}`,
    accepts: accepts(`${dec}`, fracStr(rn, rd)),
    hints: hintLadder('Divide the numerator by the denominator.',
      `Or scale to a denominator of 10, 100, …  ${a}/${d} = ?`),
    solution: { steps: [{ text: 'Numerator ÷ denominator.', expr: `${a} ÷ ${d} = ${dec}` }], answer: `${dec}` },
    misconceptions: [],
    verify: { kind: 'fraction', value: rn / rd },
  };
}

// ---- percentage of a quantity ----
export function buildPercentageOf() {
  const p = pick([5, 10, 15, 20, 25, 30, 40, 50, 60, 75]);
  const base = pick([20, 40, 60, 80, 100, 120, 200, 240]);
  const v = (p * base) / 100;
  return {
    type: 'percentage-of',
    instruction: 'Find the percentage of the amount.',
    question: `What is ${p}% of ${base}?`,
    answer: `${v}`,
    accepts: accepts(`${v}`),
    hints: hintLadder(
      'Percent means “out of 100”. Convert to a fraction or decimal first.',
      `${p}% = ${p}/100 = ${p / 100}.`,
      `Multiply: ${p / 100} × ${base}.`,
    ),
    solution: {
      steps: [
        { text: `Write ${p}% as a decimal.`, expr: `${p / 100}` },
        { text: `Multiply by ${base}.`, expr: `${v}` },
      ],
      answer: `${v}`,
    },
    misconceptions: [],
    verify: { kind: 'fraction', value: v },
  };
}

// CONCRETE: shade the 10×10 grid to show a percentage (percent = out of 100).
export function buildShadePercent() {
  const p = randInt(1, 99);
  return {
    type: 'shade-percent', instruction: 'Shade the grid to show the percentage.',
    question: `Shade the grid to show ${p}%.`,
    answer: `${p}`, accepts: accepts(`${p}`, `${p}%`),
    hints: hintLadder(
      'Percent means "out of 100". The grid has exactly 100 squares.',
      `${p}% means ${p} out of 100 — shade ${p} squares.`,
      'Each full row is 10%.',
    ),
    solution: { steps: [{ text: `${p}% = ${p} out of 100, so shade ${p} squares.`, expr: `${p}%` }], answer: `${p}` },
    misconceptions: [],
    visual: { type: 'decimal_grid', data: { mode: 'make' }, check: 'fraction-bar', target: p / 100, tolerance: 0.001 },
    verify: { kind: 'fraction', value: p },
  };
}

// ============================================================================
// CONCRETE / PICTORIAL builders — for a kid who doesn't yet have the concept.
// These teach the IDEA of a fraction by manipulation, before any symbols.
// ============================================================================

// CONCRETE: shade a bar to show a fraction (understanding "n out of d parts").
export function buildShadeFraction() {
  const d = randInt(2, 8), n = randInt(1, d - 1);
  return {
    type: 'shade-fraction',
    instruction: 'Shade the bar to show the fraction.',
    question: `Shade the bar to show ${n}/${d}.`,
    answer: `${n}/${d}`, accepts: fracAccepts(n, d),
    hints: hintLadder(
      `The bottom number, ${d}, is how many EQUAL parts the whole is split into.`,
      `The top number, ${n}, is how many of those parts to shade.`,
      `So shade ${n} of the ${d} parts.`,
    ),
    solution: { steps: [{ text: `Split the whole into ${d} equal parts, then shade ${n}.`, expr: `${n}/${d}` }], answer: `${n}/${d}` },
    misconceptions: [],
    visual: { type: 'fraction_bar', data: { total: d, mode: 'make' }, check: 'fraction-bar', target: n / d, tolerance: 0.001 },
    verify: { kind: 'fraction', value: n / d },
  };
}

// CONCRETE: place a fraction on the number line (the key conceptual anchor).
export function buildPlaceOnNumberLine() {
  const d = pick([2, 3, 4, 5, 6, 8]), n = randInt(1, d - 1);
  return {
    type: 'place-number-line',
    instruction: 'Place the fraction on the number line.',
    question: `Place ${n}/${d} on the number line.`,
    answer: `${n}/${d}`, accepts: fracAccepts(n, d),
    hints: hintLadder(
      'The line runs from 0 to 1.',
      `Split it into ${d} equal steps (each step is 1/${d}).`,
      `Count ${n} steps from 0.`,
    ),
    solution: { steps: [{ text: `Each step is 1/${d}; count ${n} steps from 0.`, expr: `${n}/${d}` }], answer: `${n}/${d}` },
    misconceptions: [],
    visual: { type: 'number_line', data: { denom: d, max: 1 }, check: 'number-line', target: n / d, tolerance: 0.001 },
    verify: { kind: 'fraction', value: n / d },
  };
}

// PICTORIAL: add/subtract unlike fractions with the two bars shown, so the
// different piece-sizes (the reason you need a common denominator) are visible.
export function buildAddSubFractionsPictorial({ sub = false } = {}) {
  let b = randInt(2, 6), d; do { d = randInt(2, 6); } while (d === b);
  let a = randInt(1, b), c = randInt(1, d);
  if (sub && a * d < c * b) { [a, b, c, d] = [c, d, a, b]; }      // keep result ≥ 0
  const L = lcm(b, d), a2 = a * (L / b), c2 = c * (L / d);
  const num = sub ? a2 - c2 : a2 + c2, op = sub ? '−' : '+';
  return {
    type: sub ? 'sub-fractions-pictorial' : 'add-fractions-pictorial',
    instruction: `${sub ? 'Subtract' : 'Add'} the fractions. The bars show why you need equal-sized pieces.`,
    question: `${a}/${b} ${op} ${c}/${d}`,
    answer: fracStr(num, L), accepts: fracAccepts(num, L),
    hints: hintLadder(
      `Look at the bars — the pieces are different sizes, so you can’t just ${sub ? 'subtract' : 'add'} them yet.`,
      `Re-cut both into ${L} equal pieces (the common denominator).`,
      `That gives ${a2}/${L} ${op} ${c2}/${L}.`,
    ),
    solution: { steps: [
      { text: 'The pieces are different sizes — make them equal.', expr: `common denominator = ${L}` },
      { text: `Re-cut both bars into ${L} pieces, then ${sub ? 'subtract' : 'add'}.`, expr: `${a2}/${L} ${op} ${c2}/${L} = ${num}/${L}` },
      { text: 'Simplify.', expr: fracStr(num, L) },
    ], answer: fracStr(num, L) },
    misconceptions: [
      { when: `${sub ? a - c : a + c}/${sub ? b - d : b + d}`, feedback: `See the bars — ${sub ? 'subtracting' : 'adding'} across mixes different-sized pieces. Make them equal first.` },
    ],
    visual: { type: 'fraction_compare', data: { fractions: [{ n: a, d: b, color: '#22c55e' }, { n: c, d: d, color: '#3b82f6' }] } },
    verify: { kind: 'fraction', value: sub ? a / b - c / d : a / b + c / d },
  };
}

// PICTORIAL: multiply fractions via the area model (a/b OF c/d).
export function buildMulFractionsPictorial() {
  const b = randInt(2, 5), d = randInt(2, 5), a = randInt(1, b - 1), c = randInt(1, d - 1);
  const num = a * c, den = b * d;
  return {
    type: 'multiply-fractions-pictorial',
    instruction: 'Multiply. The grid shows a/b OF c/d.',
    question: `${a}/${b} × ${c}/${d}`,
    answer: fracStr(num, den), accepts: fracAccepts(num, den),
    hints: hintLadder(
      'Multiplying fractions means taking "a fraction OF a fraction".',
      'Count the doubly-shaded (overlap) squares out of the total squares.',
      `${a}×${c} over ${b}×${d}.`,
    ),
    solution: { steps: [
      { text: 'The overlap = multiply the tops and multiply the bottoms.', expr: `${a}×${c} / ${b}×${d} = ${num}/${den}` },
      { text: 'Simplify.', expr: fracStr(num, den) },
    ], answer: fracStr(num, den) },
    misconceptions: [
      { when: fracStr(a + c, b + d), feedback: 'To multiply, multiply straight across — don’t add or find a common denominator.' },
    ],
    visual: { type: 'fraction_area', data: { a, b, c, d } },
    verify: { kind: 'fraction', value: (a / b) * (c / d) },
  };
}

// CONCRETE: shade a different-sized bar to make an equivalent fraction.
export function buildEquivConcrete() {
  let a, b; do { b = randInt(2, 5); a = randInt(1, b - 1); } while (gcd(a, b) !== 1);
  const k = randInt(2, 3), total = b * k, shaded = a * k;
  return {
    type: 'equivalent-concrete',
    instruction: 'Shade the bar to show a fraction equal to the one given.',
    question: `Shade the bar to make a fraction equal to ${a}/${b}.`,
    answer: `${a}/${b}`, accepts: fracAccepts(a, b),
    hints: hintLadder(
      `${a}/${b} means ${a} out of ${b} equal parts — that much of the whole.`,
      `This bar has ${total} parts. Shade the same AMOUNT of the whole.`,
      `Shade ${shaded} of the ${total}.`,
    ),
    solution: { steps: [{ text: `The same amount of the whole = ${shaded} of ${total}.`, expr: `${shaded}/${total} = ${a}/${b}` }], answer: `${a}/${b}` },
    misconceptions: [],
    visual: { type: 'fraction_bar', data: { total, mode: 'make' }, check: 'fraction-bar', target: a / b, tolerance: 0.001 },
    verify: { kind: 'fraction', value: a / b },
  };
}

// PICTORIAL: add/subtract LIKE fractions on bars (same-size pieces).
export function buildAddSubLikePictorial({ sub = false } = {}) {
  const d = randInt(4, 8);
  let a = randInt(1, d - 1), c = randInt(1, d - 1);
  if (sub && a < c) [a, c] = [c, a];
  if (!sub && a + c > d) { a = randInt(1, d - 2); c = randInt(1, d - a); }
  const num = sub ? a - c : a + c, op = sub ? '−' : '+';
  return {
    type: sub ? 'sub-like-pictorial' : 'add-like-pictorial',
    instruction: `${sub ? 'Subtract' : 'Add'} using the bars. The pieces are already the same size.`,
    question: `${a}/${d} ${op} ${c}/${d}`,
    answer: fracStr(num, d), accepts: fracAccepts(num, d),
    hints: hintLadder(
      'The bottom numbers match, so the pieces are the same size.',
      `Just ${sub ? 'take away' : 'put together'} the shaded pieces: ${a} ${op} ${c}.`,
      'The bottom number stays the same.',
    ),
    solution: { steps: [
      { text: `Same-size pieces — ${sub ? 'subtract' : 'add'} the numerators, keep the denominator.`, expr: `${num}/${d}` },
      { text: 'Simplify.', expr: fracStr(num, d) },
    ], answer: fracStr(num, d) },
    misconceptions: [{ when: `${num}/${d + d}`, feedback: 'The pieces don’t change size — keep the same denominator.' }],
    visual: { type: 'fraction_compare', data: { fractions: [{ n: a, d, color: '#22c55e' }, { n: c, d, color: '#3b82f6' }] } },
    verify: { kind: 'fraction', value: num / d },
  };
}

export const FRACTIONS_CONTENT = {
  // Concept-first: "understanding fractions" is taught concretely (bar / number line).
  G5_FRACTIONS_INTRO:    withWorkedExample(() => (coin() ? buildShadeFraction() : buildPlaceOnNumberLine())),

  // Grade 5 — foundations (each escalates to a concrete/pictorial view on struggle)
  G5_FRACTIONS_EQUIV:    withLevels({
                            abstract: withWorkedExample(buildEquivalentFraction),
                            concrete: withWorkedExample(buildEquivConcrete),
                          }),
  G5_FRACTIONS_ADD_LIKE: withLevels({
                            abstract: withWorkedExample(() => buildAddSubLike({ sub: false })),
                            concrete: withWorkedExample(() => buildAddSubLikePictorial({ sub: false })),
                          }),
  G5_FRACTIONS_SUB_LIKE: withLevels({
                            abstract: withWorkedExample(() => buildAddSubLike({ sub: true })),
                            concrete: withWorkedExample(() => buildAddSubLikePictorial({ sub: true })),
                          }),

  // Grade 6 — the core operations. Each is symbolic by default but escalates to
  // a concrete/pictorial representation when the student struggles.
  G6_FRACTIONS_ADD:      withLevels({
                            abstract: withWorkedExample(() => buildAddSubUnlike({ sub: false })),
                            concrete: withWorkedExample(() => buildAddSubFractionsPictorial({ sub: false })),
                          }),
  G6_FRACTIONS_SUB:      withLevels({
                            abstract: withWorkedExample(() => buildAddSubUnlike({ sub: true })),
                            concrete: withWorkedExample(() => buildAddSubFractionsPictorial({ sub: true })),
                          }),
  G6_FRACTIONS_MUL:      withLevels({
                            abstract: withWorkedExample(buildMulFractions),
                            concrete: withWorkedExample(buildMulFractionsPictorial),
                          }),
  G6_FRACTIONS_DIV:      withWorkedExample(buildDivFractions),
  G6_MIXED_NUMBERS:      withWorkedExample(buildMixedToImproper),
  G6_FRACTIONS_DECIMALS: withWorkedExample(buildFractionToDecimal),
  G6_PERCENTAGES_INTRO:  withLevels({
                            abstract: withWorkedExample(buildPercentageOf),
                            concrete: withWorkedExample(buildShadePercent),
                          }),

  // Grade 7 — fluency & supporting number skills
  G7_FRACTIONS_MUL:      withLevels({
                            abstract: withWorkedExample(buildMulFractions),
                            concrete: withWorkedExample(buildMulFractionsPictorial),
                          }),
  G7_FRACTIONS_DIV:      withWorkedExample(buildDivFractions),
  G7_FRACTIONS_COMPARE:  withWorkedExample(buildCompareFractions),
  G7_RECIPROCALS:        withWorkedExample(buildReciprocal),
  G7_LCM:                withWorkedExample(buildLCM),
  G7_GCD:                withWorkedExample(buildGCD),
  G7_PERCENTAGES:        withWorkedExample(buildPercentageOf),
};

export const FRACTIONS_SKILL_IDS = Object.keys(FRACTIONS_CONTENT);
