// ============================================================================
// ANSWER AUDIT — does HOREB mark answers the way a teacher would?
//
//   node scripts/audit-answers.mjs            (summary)
//   node scripts/audit-answers.mjs --full     (every example)
//   node scripts/audit-answers.mjs --n 120    (questions per skill)
//
// For every skill it generates many questions and checks four things:
//   A. The question itself: no NaN / undefined / float noise, the key is in
//      the choices, repeated questions, grade-inappropriate answers.
//   B. Correct answers typed the way children type them are ACCEPTED
//      ("KSh 1,200", "250cm", "x = 5", "5 r 2", "Acute", "(2, 3)"...).
//   C. Nearly-right wrong answers are REJECTED (off by one, sign flipped,
//      the remainder dropped, a number copied from the question).
//   D. A listed misconception is never also marked correct.
// Findings are grouped by check and skill, with one example each.
// ============================================================================

import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { CAMBRIDGE_SKILLS } from '../src/ai-tutor/cambridgeKnowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { cambridgeGenerate } from '../src/ai-tutor/cambridgeContent.js';
import { checkAnswerMatch, mathValue } from '../src/ai-tutor/answerCheck.js';

const args = process.argv.slice(2);
const FULL = args.includes('--full');
const N = Number(args[args.indexOf('--n') + 1]) || 60;
const ONLY = args.includes('--skill') ? args[args.indexOf('--skill') + 1] : null;

const findings = new Map(); // check -> Map(skill -> {count, example})
let problems = 0, variantsTried = 0;
const note = (check, skill, example) => {
  if (!findings.has(check)) findings.set(check, new Map());
  const m = findings.get(check);
  const f = m.get(skill) || { count: 0, example };
  f.count++; m.set(skill, f);
};

const str = (v) => (v == null ? '' : String(v));
const UNITS = [
  [/\b(ksh|kes|shillings?|sh\.?)\b/i, 'money'],
  [/\bcm²|square cent|cm2|cm\^2/i, 'cm²'], [/\bm²|square met|m2\b/i, 'm²'],
  [/\bcm³|cubic cent/i, 'cm³'],
  [/\b(km|kilomet)/i, 'km'], [/\b(cm|centimet)/i, 'cm'], [/\b(mm|millimet)/i, 'mm'],
  [/\b(kg|kilogram)/i, 'kg'], [/\b(ml|millilit)/i, 'ml'], [/\blitres?\b/i, 'l'],
  [/\bdegrees?\b|°/i, '°'], [/\bminutes?\b/i, 'minutes'], [/\bhours?\b/i, 'hours'],
  [/\bmet(re|er)s?\b|\d\s?m\b/i, 'm'], [/\bgrams?\b|\d\s?g\b/i, 'g'],
];
const unitsIn = (q) => UNITS.filter(([re]) => re.test(q)).map(([, u]) => u);

// ---- Correct answers, the way children type them ---------------------------
function kidVariants(p) {
  const a = str(p.answer).trim();
  const q = str(p.question);
  const out = [];
  const add = (v, kind) => { if (v !== a) out.push([v, kind]); };
  add(` ${a} `, 'spaces around');
  add(`${a}.`, 'full stop');
  if (/^[a-z]/i.test(a) && !/\d/.test(a)) {                 // word answers
    add(a[0].toUpperCase() + a.slice(1), 'Capital letter');
    add(a.toUpperCase(), 'ALL CAPS');
    if (/^[a-z]+(-[a-z]+)?$/i.test(a)) {
      if (!/angled/.test(a) && /angle|acute|obtuse|reflex|right|straight/.test(q + a)) add(`an ${a} angle`.replace('an r', 'a r').replace('an s', 'a s'), 'with "an ... angle"');
      if (/lines?\b/i.test(q)) add(`${a} lines`, 'with "lines"');
      add(`It is ${a}`, '"It is ..."');
      if (a.includes('-')) add(a.replace('-', ' '), 'hyphen as space');
    }
  }
  const n = mathValue(a);
  const isInt = /^-?\d+$/.test(a);
  if (isInt) {
    const v = Number(a);
    if (Math.abs(v) >= 1000) {
      add(v.toLocaleString('en-US'), 'thousands comma');
      add(v.toLocaleString('en-US').replace(/,/g, ' '), 'thousands space');
    }
    if (v < 0) add('−' + a.slice(1), 'unicode minus');
    add(`=${a}`, 'leading =');
    // Only the unit the question ASKS for (its last sentence), not every unit it mentions.
    const ask = (q.split(/(?<=[.?!])\s+/).pop() || q) + ' ' + str(p.instruction);
    const asksMoney = /how much|cost|price|profit|loss|interest|tax|change|amount|pay|spen[dt]|earn|salary|save|share/i.test(ask) && !/percent|%|rate|ratio/i.test(ask);
    const asksPercent = /percent|percentage|as a %|what %/i.test(ask);
    const asksTime = /how long|how many (hours|minutes)|time taken/i.test(ask);
    // "How many metres are in 900 cm?" asks for metres: "9 cm" is a wrong
    // unit (marked wrong on purpose), so only the asked unit is tried.
    const target = ask.match(/how many ([a-z²³]+)/i) || ask.match(/\b(?:to|into|in)\s+([a-z²³]+)\s*\??\s*$/i);
    const asked = target ? unitsIn(` ${target[1]} `).filter(u => u !== 'money') : [];
    for (const u of (asked.length ? asked : unitsIn(ask))) {
      if (u === 'money' && !asksMoney) continue;
      if ((u === 'minutes' || u === 'hours') && !asksTime) continue;
      if (u === 'money') { add(`KSh ${a}`, 'KSh prefix'); add(`Ksh.${a}`, 'Ksh. prefix'); add(`${a}/=`, 'Kenyan /='); add(`sh ${a}`, 'sh prefix'); add(`${a} shillings`, 'word shillings'); }
      else if (u === 'minutes' || u === 'hours') add(`${a} ${u}`, `unit ${u}`);
      else { add(`${a}${u}`, `unit ${u}`); add(`${a} ${u}`, `unit ${u} spaced`); }
    }
    if (asksPercent) { add(`${a}%`, 'percent sign'); add(`${a} percent`, 'word percent'); }
  }
  if (/^-?\d*\.\d+$/.test(a)) {
    if (a.startsWith('0.')) add(a.slice(1), 'no leading zero');
    add(a + '0', 'trailing zero');
  }
  const fr = a.match(/^(-?\d+)\/(\d+)$/);
  if (fr) { add(`${fr[1]} / ${fr[2]}`, 'fraction spaced'); }
  const mixed = a.match(/^(\d+) (\d+)\/(\d+)$/);
  if (mixed) {
    const imp = `${Number(mixed[1]) * Number(mixed[3]) + Number(mixed[2])}/${mixed[3]}`;
    add(imp, 'improper for mixed');
    add(`${mixed[1]}  ${mixed[2]}/${mixed[3]}`, 'double space mixed');
  }
  const rem = a.match(/^(\d+)\s*r\s*(\d+)$/i);
  if (rem) {
    add(`${rem[1]}r${rem[2]}`, 'remainder no spaces');
    add(`${rem[1]} R ${rem[2]}`, 'remainder capital R');
    add(`${rem[1]} rem ${rem[2]}`, 'remainder "rem"');
    add(`${rem[1]} remainder ${rem[2]}`, 'remainder word');
  }
  const clock = a.match(/^(\d{1,2}):(\d{2})$/);
  if (clock) {
    const h = Number(clock[1]), mm = clock[2], h12 = ((h + 11) % 12) + 1;
    add(`${h}.${mm}`, 'time with dot'); add(`${h12}:${mm} ${h >= 12 ? 'pm' : 'am'}`, 'time with am/pm'); add(`${h12}.${mm} ${h >= 12 ? 'p.m.' : 'a.m.'}`, 'time p.m. dotted');
    const words = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
    if (mm === '30') add(`half past ${words[h12]}`, 'half past'); if (mm === '00') add(`${h12} o'clock`, "o'clock");
    if (mm === '15') add(`quarter past ${h12}`, 'quarter past'); if (mm === '45') add(`quarter to ${h12 % 12 + 1}`, 'quarter to');
  }
  if (/^(north|south|east|west)$/i.test(a)) add(a[0].toUpperCase(), 'compass letter');
  if (/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/i.test(a)) add(a.slice(0, 3), 'short day');
  const ratio = a.match(/^(\d+)\s*:\s*(\d+)$/);
  if (ratio) { add(`${ratio[1]} : ${ratio[2]}`, 'ratio spaced'); }
  const coord = a.match(/^\((-?\d+),\s*(-?\d+)\)$/);
  if (coord) { add(`(${coord[1]}, ${coord[2]})`, 'coord spaced'); add(`${coord[1]},${coord[2]}`, 'coord no brackets'); add(`( ${coord[1]} , ${coord[2]} )`, 'coord loose'); }
  const xeq = a.match(/^([a-z])\s*=\s*(-?[\d./]+)$/i);
  if (xeq) add(xeq[2], 'value without x =');
  if (isInt && /\bsolve\b|\bfind [a-z]\b|value of [a-z]\b/i.test(q + ' ' + str(p.instruction))) {
    const letter = (q.match(/\b([a-z])\s*[=+\-×*/]/i) || q.match(/\b([xyzabn])\b/))?.[1];
    if (letter) add(`${letter} = ${a}`, 'x = value');
  }
  if (n != null && out.length === 0) add(`${a} `, 'trailing space');
  return out;
}

// ---- Nearly-right wrong answers that must be rejected -----------------------
function nearMisses(p) {
  const a = str(p.answer).trim();
  const out = [];
  if (/^-?\d+$/.test(a)) {
    const v = Number(a);
    out.push([String(v + 1), 'off by one'], [String(v - 1), 'off by one']);
    if (v !== 0) out.push([String(-v), 'sign flipped']);
    if (v !== 0 && Math.abs(v) < 1e6) out.push([String(v * 10), 'times ten']);
  }
  const rem = a.match(/^(\d+)\s*r\s*(\d+)$/i);
  if (rem && rem[2] !== '0') out.push([rem[1], 'remainder dropped']);
  const fr = a.match(/^(\d+)\/(\d+)$/);
  if (fr && fr[1] !== fr[2]) out.push([`${fr[2]}/${fr[1]}`, 'fraction upside down']);
  if (/^-?\d*\.\d+$/.test(a)) out.push([String(Number(a) * 10), 'decimal point moved']);
  return out;
}

// ---- Independent answers: work the question out ourselves -------------------
// Exact rational arithmetic with the right order of operations.
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const R = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g, d: d / g }; };
const ops = { '+': (x, y) => R(x.n * y.d + y.n * x.d, x.d * y.d), '-': (x, y) => R(x.n * y.d - y.n * x.d, x.d * y.d),
  '*': (x, y) => R(x.n * y.n, x.d * y.d), '/': (x, y) => (y.n === 0 ? null : R(x.n * y.d, x.d * y.n)) };
function evalExpr(src) {
  // A written fraction a/b binds tighter than ÷, as children read "1/4 ÷ 7/2".
  const t = src.replace(/(\d+)\/(\d+)/g, '($1/$2)').replace(/[−–]/g, '-').replace(/[×x·]/g, '*').replace(/÷/g, '/').replace(/,(?=\d{3})/g, '').replace(/\s+/g, '');
  if (!/^[\d+\-*/().]+$/.test(t) || !/[+\-*/]/.test(t.slice(1))) return null;
  let i = 0;
  const num = () => { const m = t.slice(i).match(/^\d+(\.\d+)?/); if (!m) return null; i += m[0].length; const [w, f = ''] = m[0].split('.'); return R(Number(w + f), 10 ** f.length); };
  const atom = () => { if (t[i] === '(') { i++; const v = expr(); if (t[i] !== ')') throw 0; i++; return v; } if (t[i] === '-') { i++; const v = atom(); return v && R(-v.n, v.d); } return num(); };
  const term = () => { let v = atom(); while (v && (t[i] === '*' || t[i] === '/')) { const o = t[i++]; const w = atom(); if (!w) return null; v = ops[o](v, w); } return v; };
  const expr = () => { let v = term(); while (v && (t[i] === '+' || t[i] === '-')) { const o = t[i++]; const w = term(); if (!w) return null; v = ops[o](v, w); } return v; };
  try { const v = expr(); return i === t.length ? v : null; } catch { return null; }
}
const fmt = (r) => (r.d === 1 ? String(r.n) : `${r.n}/${r.d}`);
function independentAnswer(p) {
  const q = str(p.question).trim();
  let m = q.match(/^(?:work out:?\s*|calculate:?\s*|what is\s+)?([\d\s+\-−–×x÷*/().,·]+?)\s*(=\s*\?|\?)?$/i);
  if (m && /\d\s*[+\-−–×x÷*/·]\s*[\d(]/.test(m[1])) { const v = evalExpr(m[1]); if (v) return fmt(v); }
  m = q.match(/what is (\d+(?:\.\d+)?)% of (\d+(?:\.\d+)?)\??$/i);
  if (m) { const v = ops['*'](evalExpr(`${m[1]}/100+0`) || R(0), evalExpr(`${m[2]}+0`) || R(0)); return fmt(v); }
  m = q.match(/find the mean(?: of)?:?\s*([\d,\s.]+)$/i);
  if (m) { const xs = m[1].split(/[,\s]+/).filter(Boolean).map(Number); if (xs.length > 1) { const s = xs.reduce((a, b) => a + b, 0); const r = R(Math.round(s * 1000), xs.length * 1000); return r.d === 1 ? fmt(r) : String(Number((r.n / r.d).toFixed(1))); } }
  return null;
}

const CHECKED = [['MATH', SKILLS], ['CAMBRIDGE', CAMBRIDGE_SKILLS]];
for (const [bank, S] of CHECKED) {
  for (const [id, skill] of Object.entries(S)) {
    if (ONLY && id !== ONLY) continue;
    const key = `${bank}/${id} (G${skill.grade})`;
    const seen = new Set();
    const byQuestion = new Map(); // question -> its key, to spot accepts that belong to another question
    let made = 0;
    for (let i = 0; i < N; i++) {
      let p;
      // Every representation (concrete / pictorial / abstract) and every sub-step.
      const opts = { level: ['abstract', 'pictorial', 'concrete'][i % 3], kp: i % 2 ? Math.floor(i / 2) % 6 : undefined };
      try { p = bank === 'CAMBRIDGE' ? cambridgeGenerate(id, opts) : generateProblem(id, opts); } catch (e) { note('generator threw', key, e.message); continue; }
      if (!p || p.placeholder) { note('no generator', key, ''); break; }
      made++; problems++;
      const q = str(p.question), a = str(p.answer);
      seen.add(q);
      byQuestion.set(q, p);
      const all = [q, a, str(p.hint), ...(p.hints || []).map(str), ...(p.accepts || []).map(str)].join(' | ');
      if (/\bNaN\b|undefined|\[object|Infinity|\bnull\b/.test(all)) note('A. broken text (NaN/undefined/null)', key, `${q} => ${a}`);
      if (/\d\.\d{7,}/.test(a) || /\d\.\d{7,}/.test(q)) note('A. float noise', key, `${q} => ${a}`);
      if (!a.trim()) note('A. empty answer', key, q);
      if (/(^|[^\d√])(\d+)\/\2(?!\d)/.test(q)) note('A. n/n fraction in the question (just 1)', key, q);
      if (skill.grade <= 4 && /^-\d/.test(a)) note('A. negative answer in lower primary', key, `${q} => ${a}`);
      if (skill.grade <= 3 && /^\d+\.\d+$/.test(a) && !/\bm\b|kg|litre|money|sh/i.test(q)) note('A. decimal answer in Grade 1-3', key, `${q} => ${a}`);
      const choices = p.choices || p.options;
      if (Array.isArray(choices) && choices.length && !choices.map(c => str(c.value ?? c.label ?? c)).some(c => checkAnswerMatch(c, p))) note('A. key not among the choices', key, `${q} => ${a} | ${choices.map(c => str(c.label ?? c)).join(', ')}`);
      if (a && !checkAnswerMatch(a, p)) note('A. own key rejected', key, `${q} => ${a}`);
      // E. The worked solution must end on an answer the key accepts.
      if (p.solution && p.solution.answer != null && str(p.solution.answer).trim() && !checkAnswerMatch(str(p.solution.answer), p))
        note("E. worked solution's answer is marked wrong", key, `${q} => key "${a}", solution says "${p.solution.answer}"`);
      // A. The first hint should nudge, not give the answer away.
      // General rules are not giveaways: "percent means out of 100",
      // "(n − 2) × 180°", "back bearing = bearing ± 180°".
      const firstHint = str((p.hints && p.hints[0]) || p.hint).replace(/out of 100|[×±]\s*180°/g, '');
      if (/^-?\d{2,}(\.\d+)?$/.test(a) && new RegExp(`(^|[^\\d.])${a.replace('.', '\\.')}([^\\d]|$)`).test(firstHint) && !q.includes(a))
        note('A. first hint gives the answer away', key, `${q} => ${a} | hint: ${firstHint}`);
      // E. Is the key actually right?
      if (p.verify && p.verify.kind === 'fraction' && Number.isFinite(Number(p.verify.value)) && !checkAnswerMatch(String(p.verify.value), p))
        note('E. key disagrees with its own verify value', key, `${q} => key "${a}", verify ${p.verify.value}`);
      const mine = independentAnswer(p);
      if (mine != null && !checkAnswerMatch(mine, p)) note('E. key disagrees with an independent calculation', key, `${q} => key "${a}", worked out ${mine}`);
      if (mine != null) note('(info) questions double-checked by calculation', 'all', '');
      for (const [v, kind] of kidVariants(p)) {
        variantsTried++;
        if (!checkAnswerMatch(v, p)) note(`B. rejected correct: ${kind}`, key, `${q} => key "${a}", child typed "${v}"`);
      }
      for (const [v, kind] of nearMisses(p)) {
        variantsTried++;
        if ((p.accepts || [a]).some(x => str(x).trim() === v)) continue; // genuinely also correct
        if (checkAnswerMatch(v, p)) note(`C. accepted wrong: ${kind}`, key, `${q} => key "${a}", accepted "${v}"`);
      }
      for (const m of (p.misconceptions || [])) {
        if (m && m.when != null && checkAnswerMatch(str(m.when), p)) note('D. misconception also marked correct', key, `${q} => key "${a}", misconception "${m.when}"`);
      }
    }
    if (made >= 20 && seen.size / made < 0.25) note('A. low variety (questions repeat)', key, `${seen.size} different out of ${made}`);
    // C. A question that accepts the answer to a DIFFERENT question of the same
    // skill (e.g. every construction's answer accepted for every angle).
    const all = [...byQuestion.values()];
    for (const p of all) for (const o of all) {
      if (p === o || str(o.answer).trim().toLowerCase() === str(p.answer).trim().toLowerCase()) continue;
      // "9 metres" and "9" are the same answer, not another question's.
      const ov = mathValue(str(o.answer), true), pv = mathValue(str(p.answer), true);
      if (ov != null && pv != null && Math.abs(ov - pv) < 1e-9) continue;
      // "7" for "7 o'clock" is the same answer from a six-year-old.
      if (/o'clock$/.test(str(p.answer)) && str(p.answer).startsWith(`${str(o.answer)} `)) continue;
      if (checkAnswerMatch(str(o.answer), o) && checkAnswerMatch(str(o.answer), p) && !checkAnswerMatch(str(p.answer), o)) {
        note("C. accepts another question's answer", key, `"${p.question}" (key "${p.answer}") also accepts "${o.answer}"`); break;
      }
    }
  }
}

// ---- report -----------------------------------------------------------------
console.log(`Answer audit: ${problems} questions, ${variantsTried} child-typed answers tried.\n`);
const checks = [...findings.keys()].sort();
let total = 0;
for (const c of checks) {
  const m = findings.get(c);
  const n = [...m.values()].reduce((s, f) => s + f.count, 0);
  total += m.size;
  console.log(`${c}: ${m.size} skill(s), ${n} case(s)`);
  const rows = [...m.entries()].sort((x, y) => y[1].count - x[1].count);
  for (const [skill, f] of (FULL ? rows : rows.slice(0, 6))) console.log(`   ${skill} ×${f.count}: ${f.example}`);
  if (!FULL && rows.length > 6) console.log(`   ... ${rows.length - 6} more`);
}
if (!checks.length) console.log('No findings.');
process.exitCode = 0;
