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

import { checkAnswerMatch } from './answerCheck.js';
// The answer rule, so the hint ladder built here is held to the same one the
// authored hints and the model's replies answer to, rather than a second copy.
import { revealed } from './answerRule.js';

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
  const f = parseFractionArithmetic(problem?.question);
  if (f) return fractionSteps(f);
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
  // The question's own mistake list first (authored, then the common-mistake
  // catalogue): the child's answer is matched the same forgiving way answers
  // are marked, so "1 3/4" and "7/4" both find the same mistake.
  for (const m of problem?.misconceptions || []) {
    if (m?.when == null || !m.feedback) continue;
    if (checkAnswerMatch(String(studentAnswer), { answer: String(m.when) })) return m.feedback;
  }
  const f = parseFractionArithmetic(problem?.question);
  if (f) return diagnoseFraction(f, studentAnswer);
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

// ---- fractions: "n1/d1 + n2/d2" — the add-tops-AND-bottoms misconception ----
// "1/6 + 2/6 = ?" → { n1, d1, n2, d2, op }; anything else null.
export const parseFractionArithmetic = (question) => {
  if (!question) return null;
  const clean = String(question).replace(/=\s*\??\s*$/, '').replace(/\s+/g, '');
  const m = clean.match(/^(\d+)\/(\d+)([+\-−])(\d+)\/(\d+)$/);
  if (!m) return null;
  const [, n1, d1, opRaw, n2, d2] = m;
  if (+d1 === 0 || +d2 === 0) return null;
  return { n1: +n1, d1: +d1, n2: +n2, d2: +d2, op: opRaw === '+' ? '+' : '-' };
};

const parseFracValue = (s) => {
  const m = String(s).trim().match(/^(\d+)\s*\/\s*(\d+)$/);
  if (m && +m[2] !== 0) return (+m[1]) / (+m[2]);
  const n = Number(String(s).trim());
  return Number.isFinite(n) ? n : null;
};

// Diagnose a typed fraction answer. Returns a message or null.
const diagnoseFraction = (f, studentAnswer) => {
  const { n1, d1, n2, d2, op } = f;
  const correct = op === '+' ? n1 / d1 + n2 / d2 : n1 / d1 - n2 / d2;
  const saVal = parseFracValue(studentAnswer);
  if (saVal !== null && Math.abs(saVal - correct) < 1e-9) return null; // equivalent form — not a mistake
  const sm = String(studentAnswer).trim().match(/^(\d+)\s*\/\s*(\d+)$/);
  if (!sm) return null;
  const sn = +sm[1], sd = +sm[2];
  const acrossTop = op === '+' ? n1 + n2 : Math.abs(n1 - n2);
  if (sn === acrossTop && sd === d1 + d2) {
    return d1 === d2
      ? `The bottoms got ${op === '+' ? 'added' : 'combined'} too — but the denominator says what SIZE the pieces are, and the size doesn't change. ${op === '+' ? 'Add' : 'Subtract'} only the tops; the bottom stays ${d1}.`
      : `Careful — you can't work straight across when the bottoms are different. Make the denominators match first, then ${op === '+' ? 'add' : 'subtract'} only the tops.`;
  }
  if (d1 === d2 && sd === d1 && sn !== acrossTop) {
    return `The bottom is right — the pieces stay ${d1}ths. Check the top: ${n1} ${op} ${n2}.`;
  }
  return null;
};

// Steps for the learner's own fraction sum (used by hints and the reveal).
const fractionSteps = (f) => {
  const { n1, d1, n2, d2, op } = f;
  const g = (x, y) => (y ? g(y, x % y) : x);
  if (d1 === d2) {
    const top = op === '+' ? n1 + n2 : n1 - n2;
    const cd = g(Math.abs(top), d1);
    const steps = [
      `The bottoms match — both are ${d1} — so the piece size stays the same.`,
      // the "first steps" hint shows the first two lines only, so this one names
      // the operation without computing it — the child does the sum
      `${op === '+' ? 'Add' : 'Subtract'} only the tops: ${n1} ${op === '+' ? '+' : '−'} ${n2}.`,
      `That makes ${top} — the bottom stays ${d1}.`,
    ];
    steps.push(cd > 1
      ? `So the answer is ${top}/${d1}, which simplifies to ${top / cd}/${d1 / cd}.`
      : `So the answer is ${top}/${d1}.`);
    return steps;
  }
  const lcmD = (d1 * d2) / g(d1, d2);
  const c1 = n1 * (lcmD / d1), c2 = n2 * (lcmD / d2);
  const top = op === '+' ? c1 + c2 : c1 - c2;
  const cd = g(Math.abs(top), lcmD);
  return [
    `The bottoms are different (${d1} and ${d2}) — find a common one: ${lcmD}.`,
    `Convert both: ${n1}/${d1} = ${c1}/${lcmD} and ${n2}/${d2} = ${c2}/${lcmD}.`,
    `Now ${op === '+' ? 'add' : 'subtract'} the tops: ${c1} ${op === '+' ? '+' : '−'} ${c2} = ${top}.`,
    cd > 1 ? `So the answer is ${top}/${lcmD}, which simplifies to ${top / cd}/${lcmD / cd}.` : `So the answer is ${top}/${lcmD}.`,
  ];
};

// A short, op-appropriate nudge when we can't diagnose the exact slip.
export const genericNudge = (problem) => {
  const f = parseFractionArithmetic(problem?.question);
  if (f) return f.d1 === f.d2
    ? `The bottoms match, so ${f.op === '+' ? 'add' : 'subtract'} only the tops — the denominator stays the same.`
    : 'Make the denominators match first, then work with the tops only.';
  const p = parseArithmetic(problem?.question);
  if (!p) return 'Work through it one step at a time — check each part.';
  return { '+': 'Add one column at a time, right to left, and carry when a column reaches ten.',
    '-': 'Subtract one column at a time, right to left, and borrow when the top digit is smaller.',
    '*': 'Split the bigger number into tens and ones, multiply each, then add the parts.',
    '/': 'Ask how many of the second number fit into the first.' }[p.op];
};

/**
 * Partial reveal — the steps a hint rung may show. Never the last step (that
 * is the answer), never more than two, and any step shown that ends in
 * "= <answer>" is cut at the equals sign. Before this, a one- or two-step
 * solution was shown whole: on a four-choice question the "hint" was a free
 * tick, and the first-steps box read "→ 18 × 4 = 72" with 72 sitting in
 * option C.
 */
export const withholdAnswer = (steps, answer) => {
  if (!Array.isArray(steps) || !steps.length) return steps;
  const shown = steps.length > 1 ? steps.slice(0, Math.min(2, steps.length - 1)) : steps.slice(0, 1);
  const a = String(answer ?? '').trim().replace(/\u2212/g, '-');
  if (!a) return shown;
  const esc = a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/-/g, '[-\u2212]');
  const tail = new RegExp('\\s*=\\s*' + esc + '\\s*$');
  const cut = (str) => str.replace(tail, ' = ?');
  return shown.map(st => typeof st === 'string' ? cut(st)
    : (st && typeof st.expr === 'string') ? { ...st, expr: cut(st.expr) } : st);
};

/**
 * A step that ends by stating a value splits into the work to do and the value
 * it reaches: "380 × 4 = 1520." is really "work out 380 × 4". The value is the
 * one thing a rung of the hint ladder must not hand over, so with the split in
 * hand the label goes on the left of the rung and the value behind a blank the
 * child fills in — "never the answer" applied to every rung, not only the last.
 *
 * Everything after the equals must be a bare number for the split to happen.
 * "Ones: 5 + 8 = 13 — write 3, carry 1." keeps its carry instruction and stays
 * prose, because the sentence after the value IS the teaching there.
 */
const STEP_SLOT = /^(.+?)\s*=\s*([-−]?[\d.,/\s]+)\.?\s*$/;
export const splitStep = (step) => {
  const s = String(typeof step === 'string' ? step : (step?.expr ?? step ?? '')).trim();
  const m = s.match(STEP_SLOT);
  // The numeric class has to contain "." so that 1.5 is captured whole, which
  // means it also swallows the sentence's full stop — hence the trim here
  // rather than a tidier pattern.
  return m ? { label: m[1].trim(), value: m[2].trim().replace(/\.$/, ''), slot: true }
    : { label: s.replace(/\.$/, ''), value: null, slot: false };
};

/**
 * The rungs of the hint ladder for one problem, in the order they are climbed.
 * Rung 1 orients; each rung after it adds one step of the method. The whole
 * ladder lives here rather than in the screen so tests/hint-ladder.test.mjs
 * can hold every rung of every skill to the answer rule.
 */
export const hintRungs = (problem, { steps = null } = {}) => {
  const nudge = problem?.hint || genericNudge(problem);
  const all = steps || computeSteps(problem);
  const shown = Array.isArray(all) && all.length ? withholdAnswer(all, problem?.answer) : [];
  const answers = [problem?.answer, ...(problem?.accepts || [])].filter(a => a != null);
  const rungs = [{ kind: 'nudge', text: nudge }];
  for (const st of shown) {
    const parts = splitStep(st);
    // A step can reach the answer without being the LAST step, which is all
    // withholdAnswer guards against. "7 + 5 = ?" solves in a single column, so
    // its ones-column step states the answer outright — and the old
    // first-steps box printed it. Where that happens the ladder stops short:
    // the honest ladder for a one-column sum is one rung long, because there
    // is no part of it that is not the answer.
    // No question-quoting exemption here, deliberately. revealed() excuses a
    // number the child can already see in the question, which is right for an
    // authored hint and wrong for a generated step: that exemption is a loose
    // substring test, so "19" counts as visible because the question says
    // "190", and "190 ÷ 10 = 19 books each" went straight through it. A step
    // that states the answer is a leak whatever the question says.
    if (answers.some(a => revealed(a, parts.label, ''))) break;
    rungs.push({ kind: 'step', step: st, ...parts });
  }
  return rungs;
};

export default { parseArithmetic, computeSteps, diagnoseError, genericNudge, withholdAnswer, splitStep, hintRungs };
