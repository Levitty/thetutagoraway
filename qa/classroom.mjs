// ============================================================================
// THE SIMULATED CLASSROOM — the HOREB tester's harness (see tutagora-hq
// projects/horeb/QA.md). Test code only: it plays HOREB as real children
// would, using the engine and content functions directly. No network, no
// database, no real children.
//
//   node qa/classroom.mjs                 (Grades 4-9, 3 learners each)
//   node qa/classroom.mjs --seed 3 --json qa/report.json
//
// For each grade 4..9 a strong, an average and a struggling child sit the free
// check (placement.js, as the app runs it, without the re-ask), then practise
// the recommended path for several sittings. Every question served is checked:
//
//   fit       the skill is at or near the child's grade; a strong child never
//             gets work more than one grade below
//   key       the expected answer is right, worked out independently (own
//             expression parser for identities/equations, arithmetic for
//             "a op b" questions)
//   marking   the right answer is accepted in every fair form (term order,
//             spacing, ^ and superscripts, ×/*, unicode minus, "x = 5"), and
//             a near-miss wrong answer is never accepted
//   pictures  a question that refers to something to look at carries it
//   repeats   no question text repeated within one sitting
//   jumps     no rise of more than one grade straight after a correct answer
//   wording   no empty fields, "{x}" placeholders, undefined/NaN
//   scope     a CBC child is taught only skills in the CBC design
//   help      the worked example is for the same kind of question; no
//             computer noise (0.8333333333333334) in hints or solutions
//
// Sitting model (an approximation of AIMastery's lesson loop, noted in the
// report): 8 questions on a skill; 7 or more right marks it mastered.
// ============================================================================
import { SKILLS, getPrerequisiteChain, getPostRequisiteChain, getPostRequisites } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { checkAnswerMatch } from '../src/ai-tutor/answerCheck.js';
import { propagateCredit, withdrawMiss, processDiagnosticResults } from '../src/ai-tutor/diagnosticEngine.js';
import { getRecommendedPath } from '../src/ai-tutor/adaptiveEngine.js';
import * as PL from '../src/ai-tutor/placement.js';
import { gradeOf } from '../src/ai-tutor/curricula.js';
import { writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
let seed = Number(opt('--seed', 11));
const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const pickR = (a) => a[Math.floor(rnd() * a.length)];
const SITTINGS = Number(opt('--sittings', 6));
const JSON_OUT = opt('--json', null);

const ctx = { skills: SKILLS, getPostReqs: getPostRequisites, getPreChain: (id) => getPrerequisiteChain(id), getPostChain: (id) => getPostRequisiteChain(id), curriculum: 'cbc' };
// Grades are read the way a CBC child meets them (35 skills sit in another
// grade under CBC than in the graph).
const G = (id) => (SKILLS[id] ? gradeOf(SKILLS[id], 'cbc') : undefined);
const outOfScope = (id) => SKILLS[id]?.curricula?.cbc?.inScope === false || (SKILLS[id] && !SKILLS[id].curricula?.cbc);
const POOL = PL.buildPlacementPool ? PL.buildPlacementPool(SKILLS, 'cbc') : Object.values(SKILLS);

// ---------------------------------------------------------------------------
// A small independent expression reader (not the product's): numbers, single
// letter variables, + - * / ^, brackets, implicit multiplication, √.
// ---------------------------------------------------------------------------
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
export function canon(s) {
  return String(s).trim().replace(/[−–—]/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/')
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => '^' + [...m].map(c => SUP.indexOf(c)).join(''));
}
export function parseExpr(src) {
  const s = canon(src).replace(/\s+/g, '');
  if (!s || /[^0-9a-z.+\-*/^()√]/i.test(s)) return null;
  let i = 0;
  const peek = () => s[i];
  function primary() {
    const c = peek();
    if (c === '(') { i++; const e = sum(); if (s[i] !== ')') throw 0; i++; return e; }
    if (c === '√') { i++; const e = primary(); return (v) => Math.sqrt(e(v)); }
    if (/[0-9.]/.test(c)) { let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++; const n = Number(s.slice(i, j)); i = j; if (!Number.isFinite(n)) throw 0; return () => n; }
    if (/[a-z]/i.test(c)) { i++; const name = c.toLowerCase(); return (v) => v[name]; }
    throw 0;
  }
  function power() { const b = primary(); if (peek() === '^') { i++; const neg = peek() === '-' ? (i++, -1) : 1; const e = primary(); return (v) => Math.pow(b(v), neg * e(v)); } return b; }
  function unary() { if (peek() === '-') { i++; const e = unary(); return (v) => -e(v); } if (peek() === '+') { i++; return unary(); } return power(); }
  function product() {
    let e = unary();
    for (;;) {
      const c = peek();
      if (c === '*' || c === '/') { i++; const r = unary(); const l = e; e = c === '*' ? (v) => l(v) * r(v) : (v) => l(v) / r(v); }
      else if (c && /[0-9a-z(√.]/i.test(c)) { const r = power(); const l = e; e = (v) => l(v) * r(v); }
      else return e;
    }
  }
  function sum() {
    let e = product();
    for (;;) { const c = peek(); if (c === '+' || c === '-') { i++; const r = product(); const l = e; e = c === '+' ? (v) => l(v) + r(v) : (v) => l(v) - r(v); } else return e; }
  }
  try { const e = sum(); if (i !== s.length) return null; return e; } catch { return null; }
}
const varsOf = (s) => [...new Set((canon(s).match(/[a-z]/gi) || []).map(c => c.toLowerCase()))];
const POINTS = [{}, {}, {}, {}, {}].map(() => Object.fromEntries('abcdefghijklmnopqrstuvwxyz'.split('').map(c => [c, Math.round((rnd() * 6 + 1.3) * 1000) / 1000])));
export function sameExpr(a, b) {
  const fa = parseExpr(a), fb = parseExpr(b);
  if (!fa || !fb) return null;
  return POINTS.every(p => { const x = fa(p), y = fb(p); return Number.isFinite(x) && Number.isFinite(y) && Math.abs(x - y) <= 1e-6 * Math.max(1, Math.abs(x)); });
}
// An algebra answer: has a letter, reads as an expression, and is not a word.
const isAlgebra = (a) => /[a-z]/i.test(a) && !/[a-z]{2,}/i.test(canon(a).replace(/sqrt|√/g, '')) && !!parseExpr(a);
const isNumber = (a) => /^-?\d+(\.\d+)?$/.test(canon(a).trim());

// Split a top-level sum into signed terms (no brackets touched).
function topTerms(a) {
  const s = canon(a).replace(/\s+/g, '');
  const out = []; let depth = 0, cur = '';
  for (let k = 0; k < s.length; k++) {
    const c = s[k];
    if (c === '(') depth++; if (c === ')') depth--;
    if ((c === '+' || c === '-') && depth === 0 && k > 0 && s[k - 1] !== '^') { out.push(cur); cur = c === '-' ? '-' : ''; }
    else cur += c;
  }
  out.push(cur);
  return out.filter(Boolean);
}
const joinTerms = (ts) => ts.map((t, k) => (k === 0 ? t : t.startsWith('-') ? ` - ${t.slice(1)}` : ` + ${t}`)).join('');

// Fair forms of a right answer, each labelled.
function fairForms(p) {
  const a = String(p.answer).trim();
  const forms = [];
  const add = (label, f) => { if (f !== a && f.trim()) forms.push({ label, f }); };
  if (/[−]/.test(a)) add('hyphen minus', a.replace(/−/g, '-'));
  if (/-/.test(a) && !/−/.test(a)) add('unicode minus', a.replace(/-/g, '−'));
  if (/[⁰¹²³⁴⁵⁶⁷⁸⁹]/.test(a)) add('caret power', a.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => '^' + [...m].map(c => SUP.indexOf(c)).join('')));
  if (/\^\d/.test(a)) add('superscript power', a.replace(/\^(\d+)/g, (_, d) => [...d].map(x => SUP[x]).join('')));
  if (/\s/.test(a) && isAlgebra(a)) add('no spaces', a.replace(/\s+/g, ''));
  if (isAlgebra(a)) {
    if (/\d[a-z]/i.test(a)) add('times sign', a.replace(/(\d)([a-z])/gi, '$1×$2'));
    if (/\d[a-z]/i.test(a)) add('star sign', a.replace(/(\d)([a-z])/gi, '$1*$2'));
    if (!/=/.test(a)) {
      const ts = topTerms(a);
      if (ts.length >= 2) {
        add('terms reordered', joinTerms([...ts.slice(1), ts[0]]).replace(/^\+\s*/, ''));
        add('terms reversed', joinTerms([...ts].reverse()));
      }
    }
  }
  // "Find x" / "Solve": a child writes "x = 5".
  if (isNumber(a) && /\b(find|solve|value of)\s+([a-z])\b/i.test(String(p.question))) {
    const v = String(p.question).match(/\b(?:find|solve for|value of)\s+([a-z])\b/i);
    if (v) add('x = answer', `${v[1]} = ${a}`);
  }
  // Compound quantities in the words children use: "4 hrs 21 mins", "8 kilograms 695 grams".
  const cu = a.match(/^(\d+)\s*(h|kg|m|l)\s+(\d+)\s*(min|g|cm|ml)$/);
  if (cu) {
    const W = { h: 'hrs', kg: 'kilograms', m: 'metres', l: 'litres', min: 'mins', g: 'grams', cm: 'centimetres', ml: 'millilitres' };
    add('units in words', `${cu[1]} ${W[cu[2]]} ${cu[3]} ${W[cu[4]]}`);
  }
  // A pair of named values in the other order or joined by "and": "y = 6, x = 2".
  const pr = a.match(/^([a-z])\s*=\s*(-?[\d./]+),\s*([a-z])\s*=\s*(-?[\d./]+)$/i);
  if (pr) { add('pair swapped', `${pr[3]} = ${pr[4]}, ${pr[1]} = ${pr[2]}`); add('pair with and', `${pr[1]} = ${pr[2]} and ${pr[3]} = ${pr[4]}`); }
  // Keep only forms the independent reader agrees are equal (guards our own bugs).
  return forms.filter(({ f }) => !isAlgebra(a) || /=/.test(a) || sameExpr(a, f) !== false);
}

// Near-miss wrong answers, each one checked to be really wrong.
function nearMisses(p) {
  const a = String(p.answer).trim();
  const out = [];
  if (isNumber(a)) {
    const n = Number(canon(a));
    for (const w of [n + 1, n - 1, -n, n * 10]) if (w !== n) out.push(String(Math.round(w * 1e6) / 1e6));
  } else if (isAlgebra(a) && !/=/.test(a)) {
    const bumped = canon(a).replace(/(\d+)/, (m) => String(Number(m) + 1));
    if (sameExpr(a, bumped) === false) out.push(bumped);
    const flipped = canon(a).replace(/[+]/, '#').replace(/-/, '+').replace('#', '-');
    if (flipped !== canon(a) && sameExpr(a, flipped) === false) out.push(flipped);
  }
  const fr = a.match(/^(-?\d+)\/(\d+)$/);
  if (fr && /simplest form|simplify/i.test(`${p.instruction || ''} ${p.question || ''}`)) out.push(`${Number(fr[1]) * 3}/${Number(fr[2]) * 3}`);
  return out.filter(w => !(p.accepts || []).some(x => String(x).trim() === w));
}

// Independent answer key, where we can work it out ourselves.
function keyProblem(p) {
  const a = String(p.answer).trim();
  const v = p.verify || {};
  const ff = canon(a).replace(/\s+/g, '').match(/^-?(\d+)\((-?\d*)([a-z])([+-]\d+)\)$/i);
  if (ff && /factori[sz]e/i.test(`${p.instruction || ''} ${p.question || ''}`)) {
    const gcd = (x, y) => (y ? gcd(y, x % y) : Math.abs(x));
    const inner = gcd(Number(ff[2] === '' || ff[2] === '-' ? `${ff[2]}1` : ff[2]), Number(ff[4]));
    if (inner > 1) return `key ${a} is not fully factorised (the bracket still has a common factor ${inner})`;
  }
  if (v.kind === 'identity' && typeof v.original === 'function' && isAlgebra(a)) {
    const f = parseExpr(a);
    const ok = [1.7, 2.3, -3.1].every(t => Math.abs(f({ x: t, a: t, n: t, y: t, m: t, p: t, k: t, t, b: t }) - v.original(t)) < 1e-6);
    return ok ? null : `answer ${a} is not equal to the original expression`;
  }
  if (v.kind === 'equation' && typeof v.residual === 'function' && isNumber(a)) {
    return Math.abs(v.residual(Number(a))) < 1e-6 ? null : `x = ${a} does not satisfy the equation`;
  }
  const q = canon(p.question).replace(/,(\d{3})/g, '$1');
  const m = q.match(/^(?:what is |calculate |work out |find )?(-?\d+(?:\.\d+)?)\s*([+\-*/x])\s*(-?\d+(?:\.\d+)?)\s*(?:=\s*\?|\?|=\s*_+)?\s*$/i);
  if (m && isNumber(a)) {
    const x = Number(m[1]), y = Number(m[3]);
    const r = { '+': x + y, '-': x - y, '*': x * y, x: x * y, '/': x / y }[m[2].toLowerCase()];
    if (Number.isFinite(r) && Math.abs(r - Number(a)) > 1e-9 && !(m[2] === '/' && Math.floor(r) === Number(a))) return `${m[1]} ${m[2]} ${m[3]} = ${r}, key says ${a}`;
  }
  return null;
}

// Something to look at, named in the text.
const LOOKS = /\b(look at|shown|(the|this) (picture|diagram|figure|graph|chart|table|grid|number line|clock|drawing below|pictograph|bar graph|tally chart|tally)|in the (picture|diagram|figure)|this (shape|figure|triangle|rectangle|circle|paper|bread|chapati|cloth|net)|^is this |shaded|coloured|colored|folded|tap the)\b/i;
const hasFigure = (p) => !!(p.picture || p.visual || p.model || p.svg || p.figure || p.image);

function wordingFaults(p) {
  const f = [];
  const text = `${p.instruction || ''} ${p.question || ''}`;
  if (!String(p.question || '').trim()) f.push('empty question');
  if (p.answer == null || !String(p.answer).trim()) f.push('empty answer');
  for (const [k, v] of [['question', p.question], ['answer', p.answer], ['hint', p.hint], ...(p.hints || []).map((h, i) => [`hint ${i + 1}`, h])]) {
    if (/\{[a-z_]+\}|\$\{|undefined|\bNaN\b|\[object|\bnull\b/.test(String(v ?? ''))) f.push(`${k} shows "${String(v).slice(0, 60)}"`);
  }
  if (p.placeholder) f.push('placeholder item (no real content)');
  if (/\?\s*\?/.test(text)) f.push('double question mark');
  return f;
}

// ---------------------------------------------------------------------------
// Children
// ---------------------------------------------------------------------------
const PROFILES = {
  strong:     { ahead: 1, slip: 0.03, guess: 0.15 },
  average:    { ahead: 0, slip: 0.12, guess: 0.08 },
  struggling: { ahead: -2, slip: 0.25, guess: 0.04 },
};
function makeChild(grade, kind) {
  const pr = PROFILES[kind];
  const level = grade + pr.ahead;
  const knows = (id) => (G(id) ?? 99) <= level;
  return { grade, kind, level, knows, ...pr };
}

const failures = [];
const counters = {};
const tally = (check, ok) => { const c = (counters[check] ||= { pass: 0, fail: 0 }); ok ? c.pass++ : c.fail++; };
const fail = (check, child, skillId, p, detail) => failures.push({ check, grade: child.grade, learner: child.kind, skill: skillId, skillGrade: G(skillId), question: String(p?.question ?? '').slice(0, 160), answer: p?.answer, detail });

let served = 0;
function inspect(child, skillId, p, sitting) {
  served++;
  const sg = G(skillId);
  // scope: a CBC child is only taught what the CBC design contains
  const inScope = !outOfScope(skillId); tally('scope', inScope);
  if (!inScope) fail('scope', child, skillId, p, `skill outside the CBC design (${SKILLS[skillId]?.curricula?.cbc ? 'inScope false' : 'no CBC tag'}) served to a CBC Grade ${child.grade} child`);
  // fit
  const floor = child.kind === 'strong' ? child.grade - 1 : child.kind === 'average' ? child.grade - 2 : child.grade - 4;
  const fitOk = child.kind === 'sweep' || !Number.isFinite(sg) || (sg >= floor && sg <= child.grade + 2);
  tally('fit', fitOk);
  if (!fitOk) fail('fit', child, skillId, p, `Grade ${sg} skill served to a ${child.kind} Grade ${child.grade} child`);
  // key
  const k = keyProblem(p); tally('key', !k); if (k) fail('key', child, skillId, p, k);
  // key: a number a child can type (no 128.57142857142858)
  const longKey = /\d\.\d{5,}/.test(String(p.answer)); tally('key', !longKey);
  if (longKey) fail('key', child, skillId, p, `key ${p.answer} has more decimals than a child can be expected to type`);
  // marking: the key itself, fair forms, near misses
  const selfOk = checkAnswerMatch(String(p.answer), p);
  tally('marking', selfOk); if (!selfOk) fail('marking', child, skillId, p, `its own answer "${p.answer}" is marked wrong`);
  for (const { label, f } of fairForms(p)) {
    const ok = checkAnswerMatch(f, p); tally('marking', ok);
    if (!ok) fail('marking', child, skillId, p, `right answer as ${label} "${f}" marked wrong`);
  }
  for (const w of nearMisses(p)) {
    const bad = checkAnswerMatch(w, p); tally('marking', !bad);
    if (bad) fail('marking', child, skillId, p, `wrong answer "${w}" marked right`);
  }
  // pictures
  const text = `${p.instruction || ''} ${p.question || ''}`;
  if (LOOKS.test(text)) { const ok = hasFigure(p); tally('pictures', ok); if (!ok) fail('pictures', child, skillId, p, `refers to "${text.match(LOOKS)[0]}" but carries no figure`); }
  // wording
  const w = wordingFaults(p); tally('wording', !w.length); for (const d of w) fail('wording', child, skillId, p, d);
  // help: the worked example shows the same kind of question, without computer noise
  const we = p.workedExample;
  if (we && we.instruction && p.instruction) {
    const kind = (t) => t.trim().toLowerCase().replace(/\d+/g, '#').replace(/\b[a-z]\b/g, '_');
    const ok = kind(we.instruction) === kind(p.instruction); tally('help', ok);
    if (!ok) fail('help', child, skillId, p, `worked example is for another kind of question ("${we.instruction}" vs "${p.instruction}")`);
  }
  // Only what a child reads (a drawing's coordinates are not shown as text).
  const readable = [p.hint, ...(p.hints || []), ...(p.solution?.steps || []).map(st => `${st?.text || st} ${st?.expr || ''}`), ...(we?.steps || []), we?.problem, we?.solution].filter(Boolean).join(' | ');
  const noise = readable.match(/\d\.\d{8,}/);
  tally('help', !noise); if (noise) fail('help', child, skillId, p, `help shows computer noise "${noise[0]}"`);
  // repeats
  const key = `${p.instruction || ''}|${p.question}`;
  const rep = sitting.seen.has(key); tally('repeats', !rep);
  if (rep) fail('repeats', child, skillId, p, 'same question twice in one sitting');
  sitting.seen.add(key);
  // jumps
  if (sitting.last && sitting.last.correct && Number.isFinite(sg) && Number.isFinite(sitting.last.grade)) {
    const ok = sg - sitting.last.grade <= 1; tally('jumps', ok);
    if (!ok) fail('jumps', child, skillId, p, `Grade ${sitting.last.grade} → Grade ${sg} straight after a correct answer`);
  }
}

function answers(child, skillId, p) {
  const knows = child.knows(skillId);
  if (knows ? rnd() > child.slip : rnd() < child.guess) return checkAnswerMatch(String(p.answer), p);
  return false;
}

function runChild(child) {
  // The free check, as handleDiagnosticAnswer runs it: a wrong (not skipped)
  // answer is re-asked once; right the second time counts as right.
  let balances = {}, record = [], asked = 0, pending = null;
  let current = PL.selectQuestion([], child.grade, POOL, {});
  const checkSitting = { seen: new Set(), last: null };
  while (current && asked < PL.MAX_QUESTIONS) {
    asked++;
    const p = generateProblem(current.id);
    // A re-ask is allowed to repeat the question text.
    if (pending && pending.id === current.id) checkSitting.seen.delete(`${p.instruction || ''}|${p.question}`);
    inspect(child, current.id, p, checkSitting);
    const correct = answers(child, current.id, p);
    checkSitting.last = { grade: G(current.id), correct };
    const rec = { id: current.id, grade: current.grade, strand: current.strand, unit: current.unit, probeFor: current.probeFor, hunt: current.hunt, correct };
    if (pending && pending.id === current.id) {
      if (correct) {
        balances = propagateCredit(pending.balances, current.id, true, 1.0, ctx);
        record = pending.record.map(r => r.id === current.id ? { ...r, correct: true, confirmed: true } : r);
      } else record = record.map(r => r.id === current.id ? { ...r, confirmed: true } : r);
      pending = null;
    } else if (record.some(r => r.id === current.id)) {
      if (correct) {
        balances = propagateCredit(withdrawMiss(balances, current.id, 1.0, ctx), current.id, true, 1.0, ctx);
        record = record.map(r => r.id === current.id ? { ...r, correct: true, settled: true } : r);
      } else record = record.map(r => r.id === current.id ? { ...r, settled: true } : r);
    } else {
      const before = { id: current.id, balances, record };
      balances = propagateCredit(balances, current.id, correct, 1.0, ctx);
      record = [...record, rec];
      const room = (PL.sweepRemaining ? asked + PL.sweepRemaining(record, child.grade, POOL) < PL.MAX_QUESTIONS : asked < PL.MAX_QUESTIONS)
        && (!PL.worthConfirming || PL.worthConfirming(record));
      if (!correct && room) { pending = before; continue; }
    }
    current = !PL.roomForAnother || PL.roomForAnother(asked) ? PL.selectQuestion(record, child.grade, POOL, balances)
      : PL.nextToSettle && asked < PL.MAX_QUESTIONS ? PL.nextToSettle(record, POOL) : null;
  }
  const checkGrades = record.map(r => `${r.grade}${r.correct ? '' : 'x'}`);
  const placementGrade = PL.computePlacement(record, child.grade, POOL);
  const progress = { declaredGrade: child.grade, placementGrade, diagnosed: true, skills: processDiagnosticResults(balances, ctx) };
  // Practice sittings.
  const practiceGrades = [];
  for (let s = 0; s < SITTINGS; s++) {
    const path = getRecommendedPath(progress, ctx);
    if (process.env.QA_TRACE === `${child.grade}${child.kind}`) console.error(`sitting ${s + 1}: ` + path.slice(0, 3).map(x => `${x.id}(${x.type}${progress.skills[x.id]?.mastered ? ',mastered' : ''})`).join(', '));
    const sitting = { seen: new Set(), last: null };
    for (const step of path.slice(0, 3)) {
      let right = 0;
      for (let q = 0; q < 8; q++) {
        const p = generateProblem(step.id, { kp: Math.min(q >> 2, 3) });
        inspect(child, step.id, p, sitting);
        const ok = answers(child, step.id, p);
        right += ok;
        sitting.last = { grade: G(step.id), correct: ok };
        practiceGrades.push(G(step.id));
      }
      const sp = progress.skills[step.id] || {};
      progress.skills[step.id] = { ...sp, attempts: (sp.attempts || 0) + 8, correct: (sp.correct || 0) + right, mastered: right >= 7 || !!sp.mastered, passed: right >= 6, lastPractice: Date.now() };
    }
  }
  const lowest = Math.min(...practiceGrades.filter(Number.isFinite));
  const spread = {}; for (const g of practiceGrades) spread[g] = (spread[g] || 0) + 1;
  return { grade: child.grade, learner: child.kind, checkQuestions: asked, checkGrades: checkGrades.join(' '), placementGrade, practiceQuestions: practiceGrades.length, lowestPracticeGrade: lowest, practiceByGrade: spread };
}

const children = [];
const SWEEP = Number(opt('--sweep', 20));
for (let g = 4; g <= 9; g++) for (const kind of Object.keys(PROFILES)) children.push(runChild(makeChild(g, kind)));

// The content sweep: every CBC Grade 4-9 skill, SWEEP draws each, whether or
// not a simulated child reached it (key, marking, pictures, wording, help).
const classroomCounters = JSON.parse(JSON.stringify(counters));
for (const k of Object.keys(counters)) delete counters[k];
const classroomFailures = failures.length;
const sweepIds = Object.values(SKILLS).filter(sk => !outOfScope(sk.id) && G(sk.id) >= 4 && G(sk.id) <= 9).map(sk => sk.id);
for (const id of sweepIds) for (let i = 0; i < SWEEP; i++) inspect({ grade: G(id), kind: 'sweep' }, id, generateProblem(id), { seen: new Set(), last: null });
const sweepCounters = { ...counters };
for (const k of Object.keys(counters)) delete counters[k];
Object.assign(counters, classroomCounters);

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const byCheck = {};
for (const f of failures) (byCheck[f.check] ||= []).push(f);
console.log(`HOREB simulated classroom · seed ${opt('--seed', 11)} · ${children.length} children · ${served} questions served\n`);
console.log('Children');
for (const c of children) console.log(`  G${c.grade} ${c.learner.padEnd(10)} check ${String(c.checkQuestions).padStart(2)} q [${c.checkGrades}] → placed G${c.placementGrade} · practice ${c.practiceQuestions} q, lowest G${c.lowestPracticeGrade} · ${JSON.stringify(c.practiceByGrade)}`);
console.log('\nPass rate per check');
for (const [k, c] of Object.entries(counters)) console.log(`  ${k.padEnd(9)} ${(100 * c.pass / (c.pass + c.fail)).toFixed(1).padStart(5)}%  (${c.fail} of ${c.pass + c.fail} failed)`);
console.log(`\nContent sweep: ${sweepIds.length} CBC Grade 4-9 skills × ${SWEEP} draws`);
for (const [k, c] of Object.entries(sweepCounters)) if (!['fit', 'repeats', 'jumps', 'scope'].includes(k)) console.log(`  ${k.padEnd(9)} ${(100 * c.pass / (c.pass + c.fail)).toFixed(1).padStart(5)}%  (${c.fail} of ${c.pass + c.fail} failed)`);
console.log('\nFailures, grouped by check and skill (first example each; "sweep" = content sweep)');
for (const [k, list] of Object.entries(byCheck)) {
  const bySkill = {};
  for (const f of list) (bySkill[`${f.skill}|${f.detail.replace(/"[^"]*"/g, '"…"').replace(/\d+/g, '#')}`] ||= []).push(f);
  console.log(`\n  [${k}] ${list.length} failures across ${new Set(list.map(f => f.skill)).size} skills`);
  for (const [, fs] of Object.entries(bySkill).sort((a, b) => b[1].length - a[1].length)) {
    const f = fs[0];
    console.log(`   ×${String(fs.length).padStart(3)} G${f.skillGrade} ${f.skill} (G${f.grade} ${f.learner}): ${f.detail}\n         Q: ${f.question}  [key ${f.answer}]`);
  }
}
if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify({ seed: opt('--seed', 11), served, counters, sweepCounters, children, failures }, null, 1));
