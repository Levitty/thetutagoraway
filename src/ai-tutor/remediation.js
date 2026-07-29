// ============================================================================
// REMEDIATION — turn a wrong answer into a teaching moment.
//
// Two pure helpers, both derived from the *actual* problem's numbers (never a
// stand-in example):
//
//   computeSteps(problem)  → correct, parts-showing working for the learner's
//                            own problem (fixes both the "wrong problem's steps"
//                            bug and the collapsed "Add → 168" reveal).
//   diagnoseError(problem, studentAnswer) → a warm, specific line that names the
//                            likely mistake behind THIS answer, or null when we
//                            can't recognise it (caller falls back to a nudge).
//
// Scope: the integer arithmetic that Grade 1–8 practise (+ − × ÷). Fractions,
// decimals, and word problems parse to null and keep their existing behaviour.
// ============================================================================

// "42 × 4 = ?" / "727 + 112" / "207 - 174 = ?" / "56 ÷ 8" → { a, b, op }.
// Only plain two-operand integer arithmetic; anything else returns null.
export const parseArithmetic = (question) => {
  if (!question) return null;
  const clean = String(question).replace(/=\s*\??\s*$/, '').replace(/\s+/g, '');
  const m = clean.match(/^(\d+)([+\-−x×*÷/])(\d+)$/i);
  if (!m) return null;
  const a = +m[1], b = +m[2 + 1 - 1]; // a, then op, then b
  const opRaw = m[2];
  const op = ('+' === opRaw) ? '+'
    : ('-' === opRaw || '−' === opRaw) ? '-'
    : ('x' === opRaw.toLowerCase() || '×' === opRaw || '*' === opRaw) ? '*'
    : ('÷' === opRaw || '/' === opRaw) ? '/'
    : null;
  if (!op) return null;
  return { a: +m[1], b: +m[3], op };
};

const digitsOf = (n, len) => String(n).padStart(len, '0').split('').map(Number);
const place = (r) => ['Ones', 'Tens', 'Hundreds', 'Thousands'][r] || 'Next column';

// ---- correct working, showing the parts, for the learner's own numbers -------
export const computeSteps = (problem) => {
  const p = parseArithmetic(problem?.question);
  if (!p) return null;
  const { a, b, op } = p;

  if (op === '+') {
    const total = a + b;
    const L = Math.max(String(a).length, String(b).length, String(total).length);
    const d1 = digitsOf(a, L), d2 = digitsOf(b, L);
    const steps = ['Line the digits up by place value.'];
    let carry = 0;
    for (let r = 0; r < L; r++) {
      const i = L - 1 - r;
      const sum = d1[i] + d2[i] + carry;
      const carryTxt = carry ? ` + ${carry} carried` : '';
      steps.push(sum >= 10
        ? `${place(r)}: ${d1[i]} + ${d2[i]}${carryTxt} = ${sum} — write ${sum % 10}, carry 1.`
        : `${place(r)}: ${d1[i]} + ${d2[i]}${carryTxt} = ${sum}.`);
      carry = sum >= 10 ? 1 : 0;
    }
    steps.push(`So ${a} + ${b} = ${total}.`);
    return steps;
  }

  if (op === '-') {
    const diff = a - b;
    if (diff < 0) return [`${a} − ${b} = ${diff}.`];
    const L = Math.max(String(a).length, String(b).length);
    const d1 = digitsOf(a, L), d2 = digitsOf(b, L);
    const steps = ['Line the digits up by place value.'];
    let borrow = 0;
    for (let r = 0; r < L; r++) {
      const i = L - 1 - r;
      let avail = d1[i] - borrow;
      const lent = borrow ? `After lending 1, ${d1[i]} becomes ${avail}. ` : '';
      borrow = 0;
      if (avail < d2[i]) {
        steps.push(`${place(r)}: ${lent}${avail} − ${d2[i]} won't go — borrow, so ${avail + 10} − ${d2[i]} = ${avail + 10 - d2[i]}.`);
        avail += 10;
        borrow = 1;
      } else {
        steps.push(`${place(r)}: ${lent}${avail} − ${d2[i]} = ${avail - d2[i]}.`);
      }
    }
    steps.push(`So ${a} − ${b} = ${diff}.`);
    return steps;
  }

  if (op === '*') {
    const total = a * b;
    // 2-digit × 1-digit: show the two partial products the child must add.
    let big = a, small = b;
    if (a < 10 && b >= 10) { big = b; small = a; }
    if (big >= 10 && big <= 99 && small >= 2 && small <= 9) {
      const tens = Math.floor(big / 10) * 10, ones = big % 10;
      return [
        `Split ${big} into ${tens} + ${ones}.`,
        `${tens} × ${small} = ${tens * small}.`,
        `${ones} × ${small} = ${ones * small}.`,
        `Add the parts: ${tens * small} + ${ones * small} = ${total}.`,
      ];
    }
    return [`${a} × ${b} means ${b} groups of ${a}.`, `So ${a} × ${b} = ${total}.`];
  }

  if (op === '/') {
    if (b === 0) return null;
    const q = Math.floor(a / b), rem = a % b;
    return rem === 0
      ? [`Ask: how many ${b}s make ${a}?`, `${b} × ${q} = ${a}, so ${a} ÷ ${b} = ${q}.`]
      : [`${b} × ${q} = ${b * q}, which leaves ${rem} over.`, `So ${a} ÷ ${b} = ${q} remainder ${rem}.`];
  }

  return null;
};

// The wrong number you'd get by adding each column but never carrying.
const forgotCarrySum = (a, b) => {
  const L = Math.max(String(a).length, String(b).length);
  const d1 = digitsOf(a, L), d2 = digitsOf(b, L);
  return +d1.map((d, i) => (d + d2[i]) % 10).join('');
};
// The wrong number from "always take the smaller digit from the larger" (no borrow).
const smallerFromLargerDiff = (a, b) => {
  const L = Math.max(String(a).length, String(b).length);
  const d1 = digitsOf(a, L), d2 = digitsOf(b, L);
  return +d1.map((d, i) => Math.abs(d - d2[i])).join('');
};

// ---- name the likely mistake behind THIS specific answer ---------------------
export const diagnoseError = (problem, studentAnswer) => {
  const p = parseArithmetic(problem?.question);
  if (!p) return null;
  const sa = Number(String(studentAnswer).trim());
  if (!Number.isFinite(sa)) return null;
  const { a, b, op } = p;

  if (op === '*') {
    const total = a * b;
    if (sa === total) return null;
    let big = a, small = b;
    if (a < 10 && b >= 10) { big = b; small = a; }
    if (big >= 10 && big <= 99 && small >= 2 && small <= 9) {
      const tens = Math.floor(big / 10) * 10, ones = big % 10;
      // Name the missing piece but leave the assembly to the child — a diagnosis
      // that states the final answer becomes a free-answer machine (hint farming).
      if (sa === tens * small) return `So close — that's only the tens part (${tens} × ${small}). Now work out the ones part too, ${ones} × ${small}, and add the two parts together.`;
      if (sa === ones * small) return `That's just the ones part (${ones} × ${small}). The tens are missing — work out ${tens} × ${small}, then add the two parts together.`;
    }
    if (sa === a + b) return `Careful — this one is times, not plus. ${a} × ${b} means ${b} groups of ${a}.`;
    return null;
  }

  if (op === '+') {
    const total = a + b;
    if (sa === total) return null;
    if (sa === a - b || sa === b - a) return `This one is plus, not minus — we're putting the numbers together.`;
    if (sa === forgotCarrySum(a, b) && forgotCarrySum(a, b) !== total) return `Looks like a carry got missed. When a column adds up to ten or more, write the ones digit and carry the one into the next column.`;
    return null;
  }

  if (op === '-') {
    const diff = a - b;
    if (sa === diff) return null;
    if (sa === a + b) return `This one is minus, not plus — we're taking ${b} away from ${a}.`;
    if (sa === smallerFromLargerDiff(a, b) && smallerFromLargerDiff(a, b) !== diff) return `When the top digit is smaller than the bottom one, you borrow from the next column — you can't just take the small digit from the big one.`;
    return null;
  }

  if (op === '/') {
    const q = Math.floor(a / b);
    if (sa === q) return null;
    if (sa === a - b) return `This one is divide, not minus. Ask: how many ${b}s fit into ${a}?`;
    if (sa === a * b) return `This one is divide, not times. Ask: how many ${b}s fit into ${a}?`;
    return null;
  }

  return null;
};

// A short, op-appropriate nudge when we can't diagnose the exact slip.
export const genericNudge = (problem) => {
  const p = parseArithmetic(problem?.question);
  if (!p) return 'Work through it one step at a time — check each part.';
  return { '+': 'Add one column at a time, right to left, and carry when a column reaches ten.',
    '-': 'Subtract one column at a time, right to left, and borrow when the top digit is smaller.',
    '*': 'Split the bigger number into tens and ones, multiply each, then add the parts.',
    '/': 'Ask how many of the second number fit into the first.' }[p.op];
};

export default { parseArithmetic, computeSteps, diagnoseError, genericNudge };
