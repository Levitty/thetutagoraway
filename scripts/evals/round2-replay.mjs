#!/usr/bin/env node
// ============================================================================
// ROUND 2 OF THE FREE FIXES, REPLAYED OVER SAVED RUNS (13 Nov 2026; no model calls, US$0).
//
//   node scripts/evals/round2-replay.mjs                       the runs of 12 and 13 Nov (1045, 1142, 1824, 1900, 1027)
//   node scripts/evals/round2-replay.mjs 2026-11-13-1027       one run (a folder under the runs folder, or a path)
//   node scripts/evals/round2-replay.mjs --json
//
// Each saved transcript is replayed turn by turn with the facts the live code holds (the board, the child's words, the
// tutor's recent questions, a cut said and not drawn, the questions failed twice on a shape). For each Round 2 fix it
// counts what the OLD tutor did (before) and what the NEW code does with the same inputs (after). "After" is the code's
// own decision or check, which a replay can show; what the model would write in a new lesson only a paid run shows.
//   1 diagnose     wrong, partly right, unclear or guessed answers (with words to quote); how many the tutor met with a
//                  question quoting the child and asking how, and nothing else (before); how many the code now diagnoses
//                  itself (after), and the either/or choices holding the reason and the reason said for the child
//   2 board        sentences that do not match the board as the child saw it (habits.js boardFlagOf), the code's own and
//                  the gate's rewrites among them; after: each is rewritten once, then dropped
//   3 hearing      sound-alike numbers and tentative pointing classed as a question to HOREB (before), and now
//   4 guards       an orphaned question kept, "Name what was right" required on a do-not-say-yes press, the assess step
//                  dropped for its ask id, a right answer said unsure classed partly right
//   5 repeat       a question asked again on a shape where it had failed twice
// ============================================================================
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { parseTranscript, RUNS_DIR } from './habits.mjs';
import { boardFlagOf, leadingChoiceOf, tellsReasonOf, failedAgainOf, defersCut, gaveReason, sentencesOf } from '../../src/voice-tutor/habits.js';
import { childMove, hearNumbers, numberFits, loneNumberWord } from '../../src/voice-tutor/spokenAnswer.js';
import { quoteOf, boardMark, DIAG_CLASSES } from '../../src/voice-tutor/diagnosis.js';
import { ASKS_HOW, figOf, finalClass, STUCK_AFTER } from '../../src/voice-tutor/orchestrator.js';
import { orphanQ, lastQuestionOnly } from '../../src/voice-tutor/tutorTurn.js';
import { questionKind, isClosed } from '../../src/voice-tutor/pacing.js';

export const ROUND2_RUNS = ['2026-11-12-1045', '2026-11-12-1142', '2026-11-12-1824', '2026-11-12-1900', '2026-11-13-1027'];
const DRAWS = ['write_text', 'write_math', 'fraction_bar', 'number_line', 'shape', 'plot_points', 'figure'];
const FIGS = ['shape', 'fraction_bar', 'figure'];
const boardAfter = (board, steps) => {
  const m = new Map(board.map((b) => [b.id, b]));
  for (const x of steps) {
    if (DRAWS.includes(x.cmd) && x.id) m.set(x.id, x);
    else if (x.cmd === 'erase') for (const id of x.targets || []) m.delete(id);
    else if (x.cmd === 'clear') m.clear();
  }
  return [...m.values()];
};
const maxParts = (board) => Math.max(1, ...board.filter((b) => FIGS.includes(b.cmd)).map((b) => (b.cmd === 'figure' ? Number(b.params?.parts) : Number(b.parts)) || 1));
const isQ = (x) => /\?\s*$/.test(String(x || ''));
const NOT_TAKEN = ['diagnose', 'reteach', 'example', 'change', 'close', 'stop', 'bored', 'care', 'care-wait', 'care-return', 'open', 'probe', 'thinking', 'lost', 'reason', 'question', 'press', 'advance', 'fresh-check', 'move-on'];
const TASK = (steps) => steps.some((x) => x.cmd === 'ask' || (FIGS.includes(x.cmd) || x.cmd === 'number_line'));

/** One lesson replayed. */
export function replayRound2Lesson(tr) {
  const o = {
    wrongish: 0, diagnosedBefore: 0, movedOnBefore: 0, codeNow: 0, codeNowMarked: 0, codeNowBoard: 0, codeNowAssess: 0, leftToModel: 0,
    leading: 0, tells: 0,
    board: 0, boardCode: 0, boardRewrite: 0, boardExamples: [],
    soundAlike: 0, soundAlikeAsQuestion: 0, soundAlikeAsQuestionNow: 0, pointing: 0, pointingAsQuestion: 0, pointingAsQuestionNow: 0,
    orphanKept: 0, orphanKeptNow: 0, nwrOnPress: 0, badAskId: 0, hedgedPartly: 0, hedgedPartlyNow: 0,
    failedAgain: 0, failedAgainExamples: [],
  };
  let board = []; const history = []; let promised = 0; const failed = new Set(); let step = null; let fig = null;
  const recentQs = () => history.filter((h) => h.who === 'tutor').slice(-8).flatMap((h) => sentencesOf(h.text)).filter(isQ).slice(-3);
  for (const t of tr.turns) {
    const says = t.steps.filter((x) => x.cmd === 'say');
    const lastQ = recentQs().slice(-1)[0] || null;
    const child = t.child && !t.probe ? t.child : null;
    // 3. Hearing: a sound-alike number, and tentative pointing.
    if (child) {
      const fits = recentQs().some(numberFits) || loneNumberWord(child);
      if (fits && hearNumbers(child) !== child) {
        o.soundAlike += 1;
        if (t.rule === 'question') { o.soundAlikeAsQuestion += 1; if (childMove(hearNumbers(child)) === 'question') o.soundAlikeAsQuestionNow += 1; }
      }
      if (/^(?:\W*(?:um+|uh+|hmm+)\W*)*(this|that|here|there)\b[^.?!]{0,12}\?\s*$/i.test(child)) {
        o.pointing += 1;
        if (t.rule === 'question') { o.pointingAsQuestion += 1; if (childMove(child) === 'question') o.pointingAsQuestionNow += 1; }
      }
    }
    // 1. Diagnose: the answer, how the old tutor met it, and what the code does now.
    const bm = child && !t.marked ? boardMark(lastQ, board, child) : null;
    const q = child ? quoteOf(child) : null;
    const wrongMarked = !!t.marked && !t.marked.correct;
    const wrongClass = !t.marked?.correct && !bm?.correct && DIAG_CLASSES.includes(t.cls);
    if (child && q && (wrongMarked || wrongClass || (bm && !bm.correct)) && !['lost', 'question', 'stop', 'filler'].includes(childMove(child))) {
      o.wrongish += 1;
      const quoted = says.some((x) => String(x.text).toLowerCase().includes(q.split(' ')[0]));
      const how = says.some((x) => ASKS_HOW.test(x.text));
      const closedQ = says.flatMap((x) => sentencesOf(x.text)).filter(isQ).some(isClosed);
      if (quoted && how && !TASK(t.steps) && !closedQ) o.diagnosedBefore += 1;
      else if (TASK(t.steps) || closedQ || !how) o.movedOnBefore += 1;
      // Now: a marked wrong answer with no reason, or one the board shows wrong, is the code's before the model; one the
      // model reads as wrong is taken over when its judgement arrives (outside the rules that answer something else).
      const reason = gaveReason(child);
      if (wrongMarked && !reason) { o.codeNow += 1; o.codeNowMarked += 1; }
      else if (bm && !bm.correct && !reason) { o.codeNow += 1; o.codeNowBoard += 1; }
      else if (wrongClass && !NOT_TAKEN.includes(t.rule || '')) { o.codeNow += 1; o.codeNowAssess += 1; }
      else o.leftToModel += 1;
    }
    // The child's reason, owed: an either/or that holds it, or the reason said for them.
    const ctxR = { recentQuestions: recentQs(), child: t.child || '', childRead: {}, closing: ['close', 'stop'].includes(t.rule) };
    for (const x of says) { if (leadingChoiceOf(x.text, ctxR)) o.leading += 1; if (tellsReasonOf(x.text, ctxR)) o.tells += 1; }
    // 2. Board: each sentence against the board the child saw (the turn's drawings before it and straight after it).
    for (let i = 0; i < t.steps.length; i += 1) {
      const x = t.steps[i];
      if (x.cmd !== 'say') continue;
      let j = i + 1; const after = [];
      while (j < t.steps.length && t.steps[j].cmd !== 'say' && t.steps[j].cmd !== 'pause_for_child') { after.push(t.steps[j]); j += 1; }
      const f = boardFlagOf(x, { board, promised: promised > 0, closing: ['close', 'stop'].includes(t.rule) }, t.steps.slice(0, i), after);
      if (f) {
        o.board += 1; if (!x.move) o.boardCode += 1;
        if (/gate: (rewritten|kept the rewrite)/.test(t.check || '')) o.boardRewrite += 1;
        if (o.boardExamples.length < 4) o.boardExamples.push(`turn ${t.n}: ${f}`);
      }
    }
    // 4. Guards.
    if (/one question a turn: only the last question of/.test(t.check || '')) {
      const kept = says.flatMap((x) => sentencesOf(x.text)).filter(isQ).pop();
      if (kept && orphanQ(kept)) { o.orphanKept += 1; if (orphanQ(lastQuestionOnly(`Earlier question here? ${kept}`).split(/(?<=[?])\s+/).pop())) o.orphanKeptNow += 1; }
    }
    if (t.rule === 'press' && /do not say yes yet/.test(t.reason || '') && /Name what was right\W{1,3}was required/.test(t.check || '')) o.nwrOnPress += 1;
    if (/assess: bad ask id/.test(t.guard || '')) o.badAskId += 1;
    if (child && t.cls === 'partly_right' && (t.marked?.correct || bm?.correct)) {
      o.hedgedPartly += 1;
      const c = finalClass({ assessment: { class: 'partly_right', evidence: '' }, marked: t.marked?.correct ? { ...t.marked, correct: true } : null, message: child, boardMarked: bm });
      if (c?.class === 'partly_right') o.hedgedPartlyNow += 1;
    }
    // 5. A question failed twice on a shape, asked there again.
    const shape = fig ? fig.split(':')[0] : null;
    const right = !!t.marked?.correct || (!t.marked && ['understood', 'right_unexplained'].includes(t.cls)) || !!bm?.correct;
    const fail = t.probe || t.rule === 'lost' || (t.marked && !t.marked.correct) || ['partly_right', 'misconception', 'guess_or_no_attempt'].includes(t.cls);
    if (step && t.rule !== 'thinking') {
      if (right && !t.probe) step = { ...step, tries: 0 }; else if (fail) step = { ...step, tries: step.tries + 1 };
      if (fail && step.tries >= STUCK_AFTER && shape && !['reason', 'other', 'notice'].includes(step.kind)) failed.add(`${step.kind}@${shape}`);
    }
    if (says.length && !t.authored) {
      const qn = says.flatMap((x) => sentencesOf(x.text)).filter(isQ).pop();
      const boardNow = boardAfter(board, t.steps);
      if (qn) {
        const hit = failedAgainOf(qn, { failed: [...failed], board: boardNow });
        if (hit) { o.failedAgain += 1; if (o.failedAgainExamples.length < 3) o.failedAgainExamples.push(`turn ${t.n}: "${qn.slice(0, 70)}"`); }
        const k = questionKind(qn);
        if (k) step = { kind: k, tries: step && step.kind === k && !right ? step.tries : 0 };
      }
    }
    // The facts after the turn.
    const next = boardAfter(board, t.steps);
    if (t.rule !== 'thinking') {
      if (maxParts(next) > maxParts(board)) promised = 0;
      else if (says.some((x) => defersCut(x.text))) promised = 3;
      else promised = Math.max(0, promised - 1);
    }
    if (t.child) history.push({ who: 'child', text: t.child });
    for (const x of says) history.push({ who: 'tutor', text: x.text });
    board = next;
    const f2 = figOf(board);
    if (f2 !== fig) fig = f2;
  }
  return o;
}

const KEYS = ['wrongish', 'diagnosedBefore', 'movedOnBefore', 'codeNow', 'codeNowMarked', 'codeNowBoard', 'codeNowAssess', 'leftToModel', 'leading', 'tells', 'board', 'boardCode', 'boardRewrite', 'soundAlike', 'soundAlikeAsQuestion', 'soundAlikeAsQuestionNow', 'pointing', 'pointingAsQuestion', 'pointingAsQuestionNow', 'orphanKept', 'orphanKeptNow', 'nwrOnPress', 'badAskId', 'hedgedPartly', 'hedgedPartlyNow', 'failedAgain'];
/** A run folder replayed: every lesson, and the totals. */
export function replayRound2Run(dir) {
  const files = readdirSync(dir).filter((f) => /^\d\d-.*\.md$/.test(f)).sort();
  const lessons = files.map((f) => { const tr = parseTranscript(readFileSync(join(dir, f), 'utf8')); return { scenario: tr.scenario, title: tr.title, turns: tr.turns.length, ...replayRound2Lesson(tr) }; });
  const total = Object.fromEntries(KEYS.map((k) => [k, lessons.reduce((n, l) => n + l[k], 0)]));
  return { run: basename(dir), lessons: lessons.length, total, examples: { board: lessons.flatMap((l) => l.boardExamples.map((e) => `scenario ${l.scenario} ${e}`)).slice(0, 4), failedAgain: lessons.flatMap((l) => l.failedAgainExamples.map((e) => `scenario ${l.scenario} ${e}`)).slice(0, 3) } };
}

/** The report, one column per run. */
export function round2Report(runs) {
  const T = (r) => r.total;
  const row = (label, f) => `| ${label} | ${runs.map((r) => f(T(r))).join(' | ')} |`;
  return [
    '## Round 2, replayed (no model calls)', '',
    `| | ${runs.map((r) => r.run).join(' | ')} |`, `|---|${runs.map(() => '---').join('|')}|`,
    row('Lessons', (_, i) => '') .replace(/\| \|/g, '|'),
    row('1. Wrong, partly right, unclear or guessed answers (words to quote)', (t) => String(t.wrongish)),
    row('... met with a question quoting the child and asking how, nothing else (before)', (t) => String(t.diagnosedBefore)),
    row('... met with a new task, a closed question or no "how" (before)', (t) => String(t.movedOnBefore)),
    row('... diagnosed by the code now (marked wrong / board shows wrong / model reads wrong)', (t) => `${t.codeNow} (${t.codeNowMarked} / ${t.codeNowBoard} / ${t.codeNowAssess})`),
    row('... left to the model now (a reply to "how did you know", a question back, ...)', (t) => String(t.leftToModel)),
    row('Either/or choices holding the reason owed (now rewritten, then dropped)', (t) => String(t.leading)),
    row('The reason said for the child (now rewritten, then dropped)', (t) => String(t.tells)),
    row('2. Sentences not matching the board (now rewritten once, then dropped)', (t) => `${t.board} (${t.boardCode} the code's; ${t.boardRewrite} in turns with a gate rewrite)`),
    row('3. Sound-alike numbers heard where a number fits', (t) => String(t.soundAlike)),
    row('... classed as a question to HOREB: before / now', (t) => `${t.soundAlikeAsQuestion} / ${t.soundAlikeAsQuestionNow}`),
    row('Tentative pointing ("this one?") classed as a question: before / now', (t) => `${t.pointingAsQuestion} / ${t.pointingAsQuestionNow} (of ${t.pointing})`),
    row('4. One-question guard kept an orphaned question: before / now', (t) => `${t.orphanKept} / ${t.orphanKeptNow}`),
    row('"Name what was right" required on a do-not-say-yes press (now: the press is required)', (t) => String(t.nwrOnPress)),
    row('Assess dropped for its ask id (now: the id is dropped, the judgement kept)', (t) => String(t.badAskId)),
    row('Right answers classed partly_right: before / now', (t) => `${t.hedgedPartly} / ${t.hedgedPartlyNow}`),
    row('5. A question asked again on a shape where it failed twice (now rewritten, then dropped)', (t) => String(t.failedAgain)),
    '',
  ].filter((l) => !/^\| Lessons/.test(l)).join('\n');
}

if (process.argv[1] && process.argv[1].endsWith('round2-replay.mjs')) {
  const args = process.argv.slice(2);
  const names = args.filter((a) => !a.startsWith('--'));
  const dirs = (names.length ? names : ROUND2_RUNS).map((n) => (existsSync(n) && statSync(n).isDirectory() ? resolve(n) : join(RUNS_DIR, n)));
  const runs = dirs.map(replayRound2Run);
  if (args.includes('--json')) console.log(JSON.stringify(runs, null, 2));
  else {
    console.log(round2Report(runs));
    for (const r of runs) for (const e of [...r.examples.board, ...r.examples.failedAgain]) console.log(`${r.run}: ${e}`);
  }
}

export default { replayRound2Lesson, replayRound2Run, round2Report, ROUND2_RUNS };
