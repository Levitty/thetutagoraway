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
    for (const u of unitsIn(ask)) {
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

const CHECKED = [['MATH', SKILLS], ['CAMBRIDGE', CAMBRIDGE_SKILLS]];
for (const [bank, S] of CHECKED) {
  for (const [id, skill] of Object.entries(S)) {
    if (ONLY && id !== ONLY) continue;
    const key = `${bank}/${id} (G${skill.grade})`;
    const seen = new Set();
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
      const all = [q, a, str(p.hint), ...(p.hints || []).map(str), ...(p.accepts || []).map(str)].join(' | ');
      if (/\bNaN\b|undefined|\[object|Infinity|\bnull\b/.test(all)) note('A. broken text (NaN/undefined/null)', key, `${q} => ${a}`);
      if (/\d\.\d{7,}/.test(a) || /\d\.\d{7,}/.test(q)) note('A. float noise', key, `${q} => ${a}`);
      if (!a.trim()) note('A. empty answer', key, q);
      if (skill.grade <= 4 && /^-\d/.test(a)) note('A. negative answer in lower primary', key, `${q} => ${a}`);
      if (skill.grade <= 3 && /^\d+\.\d+$/.test(a) && !/\bm\b|kg|litre|money|sh/i.test(q)) note('A. decimal answer in Grade 1-3', key, `${q} => ${a}`);
      const choices = p.choices || p.options;
      if (Array.isArray(choices) && choices.length && !choices.map(c => str(c.value ?? c.label ?? c)).some(c => checkAnswerMatch(c, p))) note('A. key not among the choices', key, `${q} => ${a} | ${choices.map(c => str(c.label ?? c)).join(', ')}`);
      if (a && !checkAnswerMatch(a, p)) note('A. own key rejected', key, `${q} => ${a}`);
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
