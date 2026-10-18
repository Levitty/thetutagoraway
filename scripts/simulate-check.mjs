// ============================================================================
// FREE-CHECK SIMULATION — does the check find the step a child is really
// missing?
//
//   node scripts/simulate-check.mjs            (400 virtual children)
//   node scripts/simulate-check.mjs --n 2000 --full
//
// Replays the free check exactly as AIMastery runs it — the real selector in
// src/ai-tutor/placement.js, a wrong answer re-asked once before it counts,
// credit propagation, placement and the missing step — with virtual children
// who have a true level and hidden gaps.
//
//   --placement <file>   replay with another placement module (e.g. a saved
//                        copy of the old one) on the SAME children, to compare
//   --grades 4,5         only children who declare these grades
//
// (Until 14 Oct 2026 this replayed a grade focus-walk the app had already
// dropped, so its numbers described a check nobody was taking.)
// Each child answers HOREB's real questions: right answers in children's own
// formats, careless slips, lucky guesses, and "I haven't learned this yet"
// when a skill is truly new. Then HOREB's missing step is compared with the
// truth. The worst outcome is telling a parent their child is missing a skill
// the child actually has.
// ============================================================================

import { SKILLS, getPrerequisiteChain, getPostRequisiteChain, getPostRequisites } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { checkAnswerMatch } from '../src/ai-tutor/answerCheck.js';
import { propagateCredit, withdrawMiss, processDiagnosticResults } from '../src/ai-tutor/diagnosticEngine.js';
import { getRecommendedPath } from '../src/ai-tutor/adaptiveEngine.js';
import { findMissingStep } from '../src/site/missingStep.js';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const N = Number(args[args.indexOf('--n') + 1]) || 400;
const FULL = args.includes('--full');
const SEED = Number(args[args.indexOf('--seed') + 1]) || 7;
// Defaults match the app. --old replays the check as it was before (no
// confirmation, 8-question minimum) for comparison.
const OLD = args.includes('--old');
const CONFIRM = !OLD;                                       // re-ask a wrong answer once
const MIN = Number(args[args.indexOf('--min') + 1]) || (OLD ? 8 : 12);
const PLACEMENT = args.includes('--placement') ? args[args.indexOf('--placement') + 1] : null;
const PL = await import(PLACEMENT ? pathToFileURL(resolve(PLACEMENT)).href : '../src/ai-tutor/placement.js');
const ANYGAP = args.includes('--anygap');
const GRADES = args.includes('--grades') ? args[args.indexOf('--grades') + 1].split(',').map(Number) : null;

// Deterministic randomness for the children (not for the question generators).
let seed = SEED;
const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const pickR = (a) => a[Math.floor(rnd() * a.length)];

const ctx = { skills: SKILLS, getPostReqs: getPostRequisites, getPreChain: (id) => getPrerequisiteChain(id), getPostChain: (id) => getPostRequisiteChain(id), curriculum: 'cbc' };
const LIST = Object.values(SKILLS).filter(s => Number.isFinite(s.grade));
const DIAG_MIN = MIN, DIAG_MAX = 20;
const gradeSpan = (list) => { const g = list.map(s => s.grade); return [Math.min(...g), Math.max(...g)]; };
const clearedG = (pg, g) => pg[g] && pg[g].t >= 2 && pg[g].c / pg[g].t >= 0.5;
const failedG = (pg, g) => pg[g] && pg[g].t >= 2 && pg[g].c / pg[g].t < 0.5;
const STRANDS = args.includes('--strands');
const AHEAD = args.includes('--ahead');
const pickAt = (list, focus, answeredSet, balances) => {
  if (STRANDS) return pickAtStrands(list, focus, answeredSet, balances);
  const [gmin, gmax] = gradeSpan(list);
  for (let d = 0; d <= gmax - gmin; d++) {
    for (const g of (d === 0 ? [focus] : [focus - d, focus + d])) {
      const cands = list.filter(s => s.grade === g && !answeredSet.has(s.id));
      if (cands.length) {
        cands.sort((a, b) => (b.critical ? 1 : 0) - (a.critical ? 1 : 0) || Math.abs(balances[a.id] || 0) - Math.abs(balances[b.id] || 0));
        return cands[0];
      }
    }
  }
  return null;
};

// Candidate: within the nearest grade, prefer a topic (strand) asked least so far.
const pickAtStrands = (list, focus, answeredSet, balances) => {
  const [gmin, gmax] = gradeSpan(list);
  const asked = {};
  for (const id of answeredSet) { const st = SKILLS[id]?.strand; if (st) asked[st] = (asked[st] || 0) + 1; }
  for (let d = 0; d <= gmax - gmin; d++) {
    for (const g of (d === 0 ? [focus] : [focus - d, focus + d])) {
      const cands = list.filter(s => s.grade === g && !answeredSet.has(s.id));
      if (cands.length) {
        cands.sort((a, b) => (b.critical ? 1 : 0) - (a.critical ? 1 : 0) || (asked[a.strand] || 0) - (asked[b.strand] || 0)
          || Math.abs(balances[a.id] || 0) - Math.abs(balances[b.id] || 0));
        return cands[0];
      }
    }
  }
  return null;
};

// ---- a virtual child ---------------------------------------------------------
function makeChild() {
  const declared = GRADES ? pickR(GRADES) : 2 + Math.floor(rnd() * 8);   // Grade 2..9
  // The default population is mostly on grade or behind, which is the common
  // case — but it contains nobody more than ONE grade ahead, so it could not
  // see that placement was capped at declared+1 however able the child.
  // --ahead draws a population of able children to exercise that ceiling.
  const offset = AHEAD ? pickR([1, 1, 2, 2, 3, 0]) : pickR([0, 0, 0, -1, -1, -2, 1]);
  const level = Math.max(1, declared + offset);
  // By default gaps are planted only in "critical" skills — mostly core
  // arithmetic — which flatters a check that samples one question per strand.
  // --anygap lets a gap sit in any skill a child of this level would have met.
  const pool = LIST.filter(s => s.grade <= level && s.grade >= level - 3 && (ANYGAP || s.critical));
  const gaps = new Set();
  const nGaps = pickR([0, 1, 1, 1, 2]);
  for (let i = 0; i < nGaps && pool.length; i++) gaps.add(pickR(pool).id);
  const memo = {};
  const knows = (id) => {
    if (id in memo) return memo[id];
    const s = SKILLS[id];
    memo[id] = false; // cycle guard
    memo[id] = !!s && s.grade <= level && !gaps.has(id) && (s.prerequisites || []).every(p => !SKILLS[p] || knows(p));
    return memo[id];
  };
  return { declared, level, gaps, knows, slip: 0.06, guess: 0.04, honestSkip: 0.7 };
}

const kidType = (p) => {
  const a = String(p.answer).trim();
  // A trailing full stop on an answer that already ends in one ("a.m..") is not
  // something a child types, so it is only added where the answer has none.
  const forms = [a, ` ${a}`, ...(/\.$/.test(a) ? [] : [`${a}.`])];
  // Times the way children write them: "9:15 am", "9.15 a.m.".
  const t = a.match(/^(\d{1,2}):(\d{2}) ([ap])\.m\.$/);
  if (t) forms.push(`${t[1]}:${t[2]} ${t[3]}m`, `${t[1]}.${t[2]} ${t[3]}.m.`, `${t[1]}:${t[2]}${t[3].toUpperCase()}M`);
  if (/^-?\d+$/.test(a) && Math.abs(Number(a)) >= 1000) forms.push(Number(a).toLocaleString('en-US'));
  if (/^[a-z]/i.test(a)) forms.push(a[0].toUpperCase() + a.slice(1));
  return pickR(forms);
};
const wrongType = (p) => {
  const a = String(p.answer).trim();
  if (/^-?\d+$/.test(a)) return String(Number(a) + pickR([-1, 1, 10, -10, 2]));
  return 'I think 7';
};

// ---- one check, exactly as the app runs it ------------------------------------
// Mirrors handleDiagnosticAnswer in AIMastery.jsx: placement.js picks every
// question; a wrong (not skipped) answer is re-asked once, and right the second
// time rebuilds the evidence as a right answer; the check ends when the
// selector has nothing left or the cap is reached.
const POOL = PL.buildPlacementPool ? PL.buildPlacementPool(SKILLS, 'cbc') : LIST;
const CAP = PL.MAX_QUESTIONS;
function runCheck(child) {
  const declared = child.declared;
  let balances = {}, record = [];
  const markErrors = [];
  let asked = 0, pending = null;
  let current = PL.selectQuestion([], declared, POOL, {});
  const answerOnce = (skill) => {
    const p = generateProblem(skill.id);
    const known = child.knows(skill.id);
    let typed = null, skip = false;
    let meantRight = false;
    if (known) { if (rnd() < child.slip) typed = wrongType(p); else { typed = kidType(p); meantRight = true; } }
    else if (rnd() < child.guess) { typed = kidType(p); meantRight = true; }
    else if (rnd() < child.honestSkip) skip = true;
    else typed = wrongType(p);
    const correct = skip ? false : checkAnswerMatch(typed, p);
    // A right answer, written the way children write it, marked wrong.
    if (meantRight && !correct) markErrors.push(`${skill.id}: "${typed}" for ${p.answer}`);
    return { correct, skip };
  };
  while (current && asked < CAP) {
    asked++;
    const { correct, skip } = answerOnce(current);
    const rec = { id: current.id, grade: current.grade, strand: current.strand, unit: current.unit, probeFor: current.probeFor, hunt: current.hunt, correct, ...(skip ? { skipped: true } : {}) };
    if (pending && pending.id === current.id) {
      if (correct) {
        balances = propagateCredit(pending.balances, current.id, true, 1.0, ctx);
        record = pending.record.map(r => r.id === current.id ? { ...r, correct: true, confirmed: true } : r);
      } else {
        record = record.map(r => r.id === current.id ? { ...r, confirmed: true } : r);
      }
      pending = null;
    } else if (record.some(r => r.id === current.id)) {
      // Same as the app: the final ask on the missing step about to be named.
      if (correct) {
        balances = propagateCredit(withdrawMiss(balances, current.id, 1.0, ctx), current.id, true, 1.0, ctx);
        record = record.map(r => r.id === current.id ? { ...r, correct: true, settled: true } : r);
      } else record = record.map(r => r.id === current.id ? { ...r, settled: true } : r);
    } else {
      const before = { id: current.id, balances, record };
      balances = propagateCredit(balances, current.id, correct, 1.0, ctx);
      record = [...record, rec];
      // Same guard as the app: a confirm never pushes the declared sweep past the cap.
      const room = (PL.sweepRemaining ? asked + PL.sweepRemaining(record, declared, POOL) < CAP : asked < CAP)
        && (!PL.worthConfirming || PL.worthConfirming(record));
      if (CONFIRM && !correct && !skip && room) { pending = before; continue; }
    }
    // Same as the app: hold the last slot back so a wrong answer can be confirmed.
    current = !PL.roomForAnother || PL.roomForAnother(asked) ? PL.selectQuestion(record, declared, POOL, balances)
      : PL.nextToSettle && asked < CAP ? PL.nextToSettle(record, POOL) : null;
  }
  const placementGrade = PL.computePlacement(record, declared, POOL);
  const progress = { declaredGrade: declared, placementGrade, diagnosed: true, skills: processDiagnosticResults(balances, ctx) };
  return { answered: record.map(r => r.id), record, asked, placementGrade, r: findMissingStep(progress), markErrors, progress };
}

// ---- run many children and score the result ------------------------------------
const tally = { pathStartsAtStep: 0, pathStartsSolid: 0, pathStartsKnown: 0, pathChecked: 0, children: 0, questions: 0, falseGap: 0, rootFound: 0, realGap: 0, withGaps: 0, placeExact: 0, placeWithin1: 0, noResult: 0, markErrors: 0 };
const examples = { path: [], falseGap: [], missedRoot: [], markErrors: [] };
// Children are drawn up front so a run with --placement meets the same ones.
const CHILDREN = Array.from({ length: N }, () => makeChild());
// Measured on one yardstick for every module: the KICD sub-strand.
const unitOfId = (id) => SKILLS[id]?.curricula?.cbc?.substrand ?? SKILLS[id]?.strand;
const asks = [];
tally.gapAreaAsked = 0;
for (const child of CHILDREN) {
  const { answered, record, asked, placementGrade, r, markErrors, progress } = runCheck(child);
  asks.push(asked);
  // Who sits how long, and who is placed where, by kind of child.
  const kind = child.level < child.declared ? 'below their grade' : child.level > child.declared ? 'above their grade' : child.gaps.size ? 'on grade, with gaps' : 'on grade, no gaps';
  const k = (tally.byKind ||= {})[kind] ||= { n: 0, q: 0, exact: 0, within1: 0 };
  if (process.env.DUMP && placementGrade < child.level && (examples.low ||= []).length < 12) examples.low.push(`${kind}: declared ${child.declared}, level ${child.level}, placed ${placementGrade}, gaps [${[...child.gaps].join(', ')}], ${asked} asked; wrong: ${record.filter(r => !r.correct).map(r => `${r.id}${r.probeFor ? '' : '*'}`).join(' ')}; sweep misses with no follow-up: ${record.filter(r => !r.correct && !r.probeFor && r.grade === child.declared && !record.some(f => f.probeFor === r.unit)).length}`);
  k.n++; k.q += asked; (k.off ||= {})[placementGrade - child.level] = (k.off[placementGrade - child.level] || 0) + 1; if (placementGrade === child.level) k.exact++; if (Math.abs(placementGrade - child.level) <= 1) k.within1++;
  // Coverage: did the check put any question into the sub-strand of a gap?
  if (child.gaps.size) {
    const areas = new Set(answered.map(unitOfId));
    if ([...child.gaps].some(g => areas.has(unitOfId(g)))) tally.gapAreaAsked++;
  }
  // What does practice start with, compared with the plan the parent read?
  if (r.missing) {
    const path = getRecommendedPath(progress, ctx);
    const first = path[0]?.id;
    tally.pathChecked++;
    if (first === r.missing) tally.pathStartsAtStep++;
    if (first && r.solid.includes(first)) tally.pathStartsSolid++;
    if (first && child.knows(first)) tally.pathStartsKnown++;
    if (first !== r.missing && examples.path.length < 6) examples.path.push(`plan says ${r.missing}; practice starts ${first}${r.solid.includes(first) ? ' (shown as SOLID on the plan)' : ''}${child.knows(first) ? ' (child knows it)' : ''}`);
  }
  tally.children++; tally.questions += asked;
  if (markErrors.length) { tally.markErrors++; if (examples.markErrors.length < 5) examples.markErrors.push(markErrors[0]); }
  if (placementGrade === child.level) tally.placeExact++;
  if (Math.abs(placementGrade - child.level) <= 1) tally.placeWithin1++;
  if (!r.missing) { tally.noResult++; continue; }
  const m = SKILLS[r.missing];
  const childKnows = child.knows(r.missing);
  if (childKnows && !r.allClear) {
    tally.falseGap++;
    // Was the named step actually ASKED and got wrong, or only inferred from
    // other answers by credit propagation? The two need different fixes.
    const rec = record.find(x => x.id === r.missing);
    if (!rec) tally.falseInferred = (tally.falseInferred || 0) + 1;
    else if (!rec.correct) {
      tally.falseAskedWrong = (tally.falseAskedWrong || 0) + 1;
      (examples.askedWrong ||= []).push(`${r.missing}: ${rec.skipped ? 'SKIPPED' : rec.confirmed ? 'confirmed wrong' : 'NOT confirmed'} · asked ${asked} · ${rec.probeFor ? 'follow-up for ' + rec.probeFor : 'sweep'}`);
    }
    else tally.falseAskedRight = (tally.falseAskedRight || 0) + 1;
    if (examples.falseGap.length < 8) examples.falseGap.push(`Grade ${child.declared} child, true level ${child.level}, gaps [${[...child.gaps].join(', ') || 'none'}]: told missing ${r.missing} (G${m.grade}), which they know. Asked: ${answered.join(' ')}`);
  } else if (!childKnows) tally.realGap++;
  if (child.gaps.size) {
    tally.withGaps++;
    // Found the gap if the named step is one of the gaps, or a skill the gap blocks.
    const hit = [...child.gaps].some(g => g === r.missing || getPrerequisiteChain(r.missing).includes(g));
    if (hit) tally.rootFound++;
    else if (examples.missedRoot.length < 6) examples.missedRoot.push(`Grade ${child.declared}, level ${child.level}, gap ${[...child.gaps].map(g => `${g} (G${SKILLS[g].grade})`).join(', ')}: HOREB said ${r.missing} (G${m.grade})${childKnows ? ' (known!)' : ''}`);
  }
}
const pct = (a, b) => (b ? `${Math.round(100 * a / b)}%` : '-');
asks.sort((a, b) => a - b);
console.log(`Free-check simulation: ${tally.children} virtual children${GRADES ? ` (declared Grade ${GRADES.join('/')})` : ''}, ${PLACEMENT ? `placement module ${PLACEMENT}` : 'current placement.js'}.`);
console.log(`Questions: ${(tally.questions / tally.children).toFixed(1)} on average · fewest ${asks[0]} · median ${asks[Math.floor(asks.length / 2)]} · most ${asks[asks.length - 1]}\n`);
console.log(`Child with hidden gaps: a question asked in the gap's own area: ${pct(tally.gapAreaAsked, tally.withGaps)}`);
console.log(`Missing step is a skill the child really lacks:   ${pct(tally.realGap, tally.children - tally.noResult)}`);
console.log(`FALSE ALARM (told missing a skill they know):     ${pct(tally.falseGap, tally.children - tally.noResult)}  (${tally.falseGap} children: ${tally.falseInferred || 0} never asked, ${tally.falseAskedWrong || 0} asked and missed, ${tally.falseAskedRight || 0} asked and RIGHT)`);
console.log(`Child with hidden gaps: gap (or what it blocks) named: ${pct(tally.rootFound, tally.withGaps)}`);
console.log(`Placement exactly right: ${pct(tally.placeExact, tally.children)} · within one grade: ${pct(tally.placeWithin1, tally.children)}`);
console.log(`No result at all: ${tally.noResult} · checks with a right answer marked wrong: ${tally.markErrors}`);
console.log(`Practice starts on the plan's missing step: ${pct(tally.pathStartsAtStep, tally.pathChecked)} · on a skill the plan called SOLID: ${pct(tally.pathStartsSolid, tally.pathChecked)} · on a skill the child already knows: ${pct(tally.pathStartsKnown, tally.pathChecked)}`);
const show = (t, xs) => { if (xs.length) { console.log(`\n${t}`); for (const x of (FULL ? xs : xs.slice(0, 4))) console.log('  - ' + x); } };
console.log('\nBy kind of child:');
for (const [kind, k] of Object.entries(tally.byKind || {})) console.log(`  ${kind.padEnd(22)} ${String(k.n).padStart(4)} children · ${(k.q / k.n).toFixed(1)} questions · placed exactly ${pct(k.exact, k.n)} · within one ${pct(k.within1, k.n)} · off by ${Object.keys(k.off).map(Number).sort((a, b) => a - b).map(d => `${d > 0 ? '+' : ''}${d}: ${k.off[d]}`).join(', ')}`);
show('False alarms:', examples.falseGap);
show('False alarms that were asked and missed:', examples.askedWrong || []);
show('Practice does not start where the plan says:', examples.path);
show('Gap not named:', examples.missedRoot);
show('Placed too low:', examples.low || []);
show('Right answers marked wrong during the check:', examples.markErrors);
