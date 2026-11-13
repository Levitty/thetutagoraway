// ============================================================================
// FREE REPLAY OF THE APP'S OWN LAYERS (12 Nov 2026, after run 2026-11-12-1824 got worse; no model calls, US$0).
// The habits count what the tutor said; this counts what OUR code did to the turns in a saved run, and what the rules
// since then would do instead, from the transcripts alone:
//   dropped      steps the gate dropped, and how many of those drops were for soft faults only (overtalk, repeat, stock,
//                unanswered), which the gate now never drops
//   fixed lines  the old fallback lines the code played ("Look at the circle. Which part is shaded?", "You asked tree.")
//   board claims sentences that point at something the board does not show (habits.js boardClaimOf), the code's and the model's
//   fillers      filler-only replies ("um...") that went to the model; now a wait with no model call, and the one
//                "Take your time" the rule allows after two in a row
//   unsure right tentative answers classed guess_or_no_attempt (the seal now holds a right one to right_unexplained)
//   misheard     sound-alike numbers ("too", "tree") a counting question now reads as numbers, and how many were read as questions
//   seals        questions sealed with an answer that is neither a value nor one of their own options (commands.js sealable)
//   probes       silence probes that fired sooner than the new times (a nudge before 8 s, a smaller question before 20 s)
// Pure over habits.mjs parseTranscript; tested in tests/voice-tutor-run-1824.test.mjs.
// ============================================================================
import { boardClaimOf, asksReason, stepFlags, habitContext } from '../../src/voice-tutor/habits.js';
import { childMove, hearNumbers, asksForNumber, isTentative, markSpoken, readAnswer } from '../../src/voice-tutor/spokenAnswer.js';
import { questionKind, isClosed, trivialAnswer } from '../../src/voice-tutor/pacing.js';
import { figOf } from '../../src/voice-tutor/orchestrator.js';
import { lastQuestionOnly } from '../../src/voice-tutor/tutorTurn.js';
import { sealable } from '../../src/voice-tutor/commands.js';
import { SILENCE } from '../../src/voice-tutor/silence.js';
import { freshLines } from '../../src/voice-tutor/tutorTurn.js';

// The fallback lines the code played before 12 Nov 2026 evening (tutorTurn.js recoverLines), now gone.
export const OLD_FIXED = [/^Look at the (circle|bar|grid|shape|number line)( again)?\.$/, /^Which part is shaded\?$/, /Look at the (circle|bar|grid|shape)\. Which part is shaded\?/, /^Point at the part of the \w+ you mean\.$/, /^You asked .+\.$/, /^Keep thinking out loud\.$/, /^Go on, I am listening\.$/];
const SOFT = ['overtalk', 'repeat', 'stock', 'unanswered'];
const DRAWS = ['write_text', 'write_math', 'fraction_bar', 'number_line', 'shape', 'plot_points', 'figure'];
const boardAfter = (board, steps) => {
  const m = new Map(board.map((b) => [b.id, b]));
  for (const x of steps) {
    if (DRAWS.includes(x.cmd) && x.id) m.set(x.id, x);
    else if (x.cmd === 'erase') for (const id of x.targets || []) m.delete(id);
    else if (x.cmd === 'clear') m.clear();
  }
  return [...m.values()];
};

/** One lesson (habits.mjs parseTranscript) replayed for the app's own layers. */
export function replayAppLesson(tr) {
  const out = { dropped: 0, droppedSoft: 0, fixed: 0, claims: [], claimsCode: 0, fillers: 0, fillerLines: 0, unsureGuess: 0, unsureRightGuess: 0, misheard: 0, misheardAsQuestion: 0, badSeals: [], earlyNudge: 0, earlySmaller: 0, probes: 0, sameLine: 0, sameLineCode: 0, sameLineCodeAfter: 0, probeCopy: 0 };
  const tutorTurns = [];
  let board = []; const recentQs = []; let fillersInRow = 0; let tyt = false; let openNumeric = false;
  for (const t of tr.turns) {
    // The child's words.
    if (t.child != null && !t.probe) {
      if (childMove(t.child) === 'filler') {
        out.fillers += 1; fillersInRow += 1;
        if (fillersInRow >= 2 && !tyt) { out.fillerLines += 1; tyt = true; }
      } else { fillersInRow = 0; tyt = false; }
      const numberOpen = recentQs.slice(-3).some((qs) => qs.some(asksForNumber)) || openNumeric;
      if (numberOpen && hearNumbers(t.child) !== t.child) { out.misheard += 1; if (t.rule === 'question') out.misheardAsQuestion += 1; }
      if (t.cls === 'guess_or_no_attempt' && isTentative(t.child)) { out.unsureGuess += 1; if (t.marked?.correct) out.unsureRightGuess += 1; }
    }
    // Silence probes, against the new times.
    const pm = /probe \((\w+), silent (\d+) s\)/.exec(t.kind || '');
    if (pm) {
      out.probes += 1;
      if (pm[1] === 'answer_nudge' && Number(pm[2]) * 1000 < SILENCE.answer.firstMs) out.earlyNudge += 1;
      if (pm[1] === 'answer_smaller' && Number(pm[2]) * 1000 < SILENCE.answer.secondTotalMs) out.earlySmaller += 1;
    }
    // What the code did to the turn.
    if (/gate-dropped|answer-in-question/.test(t.guard)) {
      out.dropped += 1;
      const habits = [...new Set([...String(t.guard).matchAll(/(?:gate: |; )(giveaway|repeat|stock|confirm_hedged|level_jump|unanswered|overtalk): /g)].map((m) => m[1]))];
      if (habits.length && habits.every((h) => SOFT.includes(h))) out.droppedSoft += 1;
    }
    board = boardAfter(board, t.steps);
    const says = t.steps.filter((x) => x.cmd === 'say');
    // Free round 13 Nov 2026: a sentence said again within the last four tutor turns (the code's, and the model's), what
    // freshLines would leave of the code's, and probes that open with the probe shape's old example words.
    const recent = tutorTurns.slice(-4).flat();
    const nl = (x) => String(x).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
    const sentencesOf = (x) => String(x.text).split(/(?<=[.!?])\s+/).map((y) => y.trim()).filter(Boolean);
    const seen = new Set(recent.map(nl));
    const codeLines = [];
    for (const x of says) for (const y of sentencesOf(x)) { if (seen.has(nl(y))) { out.sameLine += 1; if (!x.move) out.sameLineCode += 1; } if (!x.move) codeLines.push(y); }
    if (codeLines.length && t.rule !== 'care' && !/safeguarding/.test(t.guard)) out.sameLineCodeAfter += freshLines(codeLines, { recent }).filter((y) => seen.has(nl(y))).length;
    if (t.probe && says[0] && /^take your time\b/i.test(says[0].text) && says[0].move) out.probeCopy += 1;
    tutorTurns.push(says.flatMap(sentencesOf));
    for (const x of says) {
      const code = !x.move;
      if (code && OLD_FIXED.some((re) => re.test(x.text))) out.fixed += 1;
      const c = boardClaimOf(x.text, board);
      if (c) { out.claims.push({ turn: t.n, code, claim: c }); if (code) out.claimsCode += 1; }
    }
    for (const a of t.steps.filter((x) => x.cmd === 'ask' && x.answer != null)) {
      if (!sealable(a.prompt, a.answer)) out.badSeals.push({ turn: t.n, ask: a.id, prompt: a.prompt, answer: a.answer });
    }
    const ask = [...t.steps].reverse().find((x) => x.cmd === 'ask' && x.answer != null);
    if (ask) openNumeric = /^\d+(\/\d+)?$/.test(String(ask.answer).trim()) || /\b(half|quarter|third|one|two|three|four)\b/i.test(String(ask.answer));
    else if (t.marked?.correct) openNumeric = false;
    if (says.length) recentQs.push(says.flatMap((x) => String(x.text).split(/(?<=[.!?])\s+/)).filter((x) => /\?\s*$/.test(x)));
  }
  return out;
}

// ---------------------------------------------------------------- the step rules (P5, after run 2026-11-12-1900)
// What the run's tutor did that the step rules now hold, read from the transcript alone:
//   presses        "how did you know" questions after an answer: on a count or a name (trivial), straight after another
//                  press, or for an unsure child who had just been helped; and the ones the code itself added
//   loops          a question of a kind the child had already got right on the same picture; the same kind a third time
//                  after two non-answers or wrong answers; a closed question straight after a closed one
//   two questions  tutor turns with more than one question (now only the last is said)
//   child's step   a drawing or a sentence that did the cut or the shading the open question asked the child for
//   stock rewrites the gate's rewrites for a stock phrase alone (now noted, never rewritten)
//   missed right   a right answer (the sealed one) the app did not mark, that the spoken marker now reads as right
const SOLVABLE = ['count_total', 'count_shaded', 'fraction', 'state', 'cut', 'equal'];
const sentencesOf = (t) => String(t || '').split(/(?<=[.!?])\s+/).filter(Boolean);
const isQ = (x) => /\?\s*$/.test(x);
export function replayStepLesson(tr) {
  const out = { presses: 0, pressTrivial: 0, pressAgain: 0, pressHelped: 0, pressCode: 0, reAskSolved: 0, thirdSame: 0, closedTwice: 0, twoQuestions: 0, childStep: 0, stockRewrites: 0, missedRight: 0, tutorTurns: 0 };
  let board = []; const history = []; let lastQ = null; let lastPress = false; let step = null; let solved = []; let fig = null; let closedLast = false;
  let open = null; let helpedRecently = false;
  for (const t of tr.turns) {
    const says = t.steps.filter((x) => x.cmd === 'say');
    const childSaid = t.child != null && !t.probe && childMove(t.child) !== 'filler';
    // The child's answer to the step: right (marked, or classed right), or one more try.
    const right = !!t.marked?.correct || (!t.marked && ['understood', 'right_unexplained'].includes(t.cls));
    const fail = t.probe || t.rule === 'lost' || (t.marked && !t.marked.correct) || ['partly_right', 'misconception', 'guess_or_no_attempt'].includes(t.cls);
    if (step && t.rule !== 'thinking') { if (right && !t.probe) { solved = [...new Set([...solved, step.kind])]; step = { ...step, tries: 0 }; } else if (fail) step = { ...step, tries: step.tries + 1 }; }
    // A right answer the app did not mark, that the spoken marker reads as right now.
    if (childSaid && open && !t.marked && /^\d+(\/\d+)?$/.test(String(open.answer).trim())) {
      const r = markSpoken({ kind: 'typed', question: open.question, answer: open.answer, accepts: [open.answer], wrong: [] }, hearNumbers(t.child, { numberOpen: true }));
      if (r.correct) out.missedRight += 1;
    }
    if (says.length && !t.authored) {
      out.tutorTurns += 1;
      const qs = says.flatMap((x) => sentencesOf(x.text)).filter(isQ);
      if (qs.length > 1) out.twoQuestions += 1;
      const pressed = says.some((x) => asksReason(x.text));
      if (pressed && (childSaid || t.probe)) {
        out.presses += 1;
        const answered = childSaid && (t.marked || t.cls) && !/^reason|^diagnose|^reteach/.test(t.rule || '');
        if (answered && trivialAnswer({ question: lastQ || '', answer: t.marked?.correct && open ? open.answer : null })) out.pressTrivial += 1;
        if (lastPress) out.pressAgain += 1;
        if (childSaid && isTentative(t.child) && helpedRecently) out.pressHelped += 1;
        if (says.some((x) => !x.move && asksReason(x.text))) out.pressCode += 1;
      }
      // The child's step done for them, by the checks the live gate runs now.
      const ctx = habitContext({ message: t.child || '', history, board, level: { level: 0, wins: 0, stage: 'teach' }, example: t.rule === 'example' });
      for (let i = 0; i < t.steps.length; i += 1) if (stepFlags(t.steps[i], ctx, t.steps.slice(0, i)).some((f) => /^does the child's step/.test(f.reason))) { out.childStep += 1; break; }
      if (/gate: rewritten \(stock[^;)]*\)/.test(t.check || '') && !/repeat|giveaway|unanswered|level_jump/.test((/gate: rewritten \(([^)]*)\)/.exec(t.check || '') || [])[1] || '')) out.stockRewrites += 1;
      const q = qs.length ? qs[qs.length - 1] : null;
      if (q) {
        const k = questionKind(q);
        if (k && SOLVABLE.includes(k) && solved.includes(k)) out.reAskSolved += 1;
        if (k && step && step.kind === k && step.tries >= 2) out.thirdSame += 1;
        if (isClosed(q) && closedLast) out.closedTwice += 1;
        closedLast = isClosed(q);
        if (k) step = { kind: k, tries: step && step.kind === k && !right ? step.tries : 0 };
        lastQ = q;
      }
      lastPress = pressed;
    }
    helpedRecently = !!t.probe || t.rule === 'lost' || t.steps.some((x) => x.move === 'Smaller-question hint') || (helpedRecently && t.rule === 'thinking');
    if (t.child) history.push({ who: 'child', text: t.child });
    for (const x of says) history.push({ who: 'tutor', text: x.text, turn: t.n });
    board = boardAfter(board, t.steps);
    const f = figOf(board);
    if (f !== fig) { if (fig) solved = []; fig = f; }
    if (t.marked?.correct) open = null;
    const ask = [...t.steps].reverse().find((x) => x.cmd === 'ask' && x.answer != null);
    if (ask) open = { answer: ask.answer, question: ask.prompt || '' };
  }
  return out;
}
const STEP_KEYS = ['presses', 'pressTrivial', 'pressAgain', 'pressHelped', 'pressCode', 'reAskSolved', 'thirdSame', 'closedTwice', 'twoQuestions', 'childStep', 'stockRewrites', 'missedRight', 'tutorTurns'];

/** Every lesson of a run, added up. */
export function replayAppRun(parsed) {
  const lessons = parsed.map((tr) => ({ scenario: tr.scenario, title: tr.title, ...replayAppLesson(tr), step: replayStepLesson(tr) }));
  const sum = (k) => lessons.reduce((n, l) => n + (Array.isArray(l[k]) ? l[k].length : l[k]), 0);
  const keys = ['dropped', 'droppedSoft', 'fixed', 'claims', 'claimsCode', 'fillers', 'fillerLines', 'unsureGuess', 'unsureRightGuess', 'misheard', 'misheardAsQuestion', 'badSeals', 'earlyNudge', 'earlySmaller', 'probes', 'sameLine', 'sameLineCode', 'sameLineCodeAfter', 'probeCopy'];
  const step = Object.fromEntries(STEP_KEYS.map((k) => [k, lessons.reduce((n, l) => n + l.step[k], 0)]));
  return { lessons, total: { ...Object.fromEntries(keys.map((k) => [k, sum(k)])), step } };
}

/** The report section, one column per run. */
export function appReport(runs) {
  const T = (r) => r.app.total;
  const row = (label, f) => `| ${label} | ${runs.map((r) => f(T(r))).join(' | ')} |`;
  return [
    '## The app\'s own layers, replayed (no model calls)', '',
    'What our code did to the turns of each run, and what the rules of 12 Nov 2026 evening (after run 2026-11-12-1824) would do instead: the gate never drops a sentence for a soft fault and has no overtalk check, the code\'s lines come from the board, a filler alone gets no model call, an unsure right answer is right_unexplained, a sound-alike number is read as a number when a count is asked for, an offer is never sealed, and the silence probes come at 8 s and 20 s. Read from the transcripts; what the tutor would have said instead is not known.', '',
    `| | ${runs.map((r) => r.run).join(' | ')} |`, `|---|${runs.map(() => '---').join('|')}|`,
    row('Turns with a step dropped by the gate', (t) => `${t.dropped} (${t.droppedSoft} for soft faults only: now kept)`),
    row('Old fixed fallback lines played (now gone)', (t) => String(t.fixed)),
    row('Sentences pointing at something not on the board', (t) => `${t.claims} (${t.claimsCode} the code's own)`),
    row('Filler-only replies sent to the model', (t) => `${t.fillers} (now no model call; ${t.fillerLines} "Take your time" in all)`),
    row('Unsure answers classed guess_or_no_attempt', (t) => `${t.unsureGuess} (${t.unsureRightGuess} marked right by the seal: now right_unexplained)`),
    row('Sound-alike numbers to a counting question', (t) => `${t.misheard} (${t.misheardAsQuestion} read as a question to HOREB)`),
    row('Questions sealed with no real answer', (t) => String(t.badSeals)),
    row('Silence probes / sooner than the new times', (t) => `${t.probes} / ${t.earlyNudge} nudges before 8 s, ${t.earlySmaller} smaller questions before 20 s`),
    row('Sentences said again within four tutor turns (13 Nov)', (t) => `${t.sameLine} (${t.sameLineCode} the code's; ${t.sameLineCodeAfter} of the code's left by the no-repeat rule)`),
    row('Probes opening "Take your time" (the old probe shape\'s example words, now removed)', (t) => String(t.probeCopy)),
    '',
    '### The step rules (P5, after run 2026-11-12-1900)', '',
    'Read from the transcripts: what the tutor did that the step rules now hold. "Now" says what the app does instead; what the model would write is not known, so the brief-only rows are what the model is now told not to do, not a promise it will not.', '',
    `| | ${runs.map((r) => r.run).join(' | ')} |`, `|---|${runs.map(() => '---').join('|')}|`,
    row('"How did you know?" after an answer', (t) => `${t.step.presses} in ${t.step.tutorTurns} tutor turns`),
    row('... on a count or a name', (t) => `${t.step.pressTrivial} (now: decide allows no press, the brief says so, the code adds none)`),
    row('... straight after another press', (t) => `${t.step.pressAgain} (now: once per idea; the reason rule moves on)`),
    row('... for an unsure child just helped', (t) => `${t.step.pressHelped} (now: no press)`),
    row('... added by the code itself', (t) => `${t.step.pressCode} (now: only when decide allows a press)`),
    row('Questions asking again what the child had found on the picture', (t) => `${t.step.reAskSolved} (now: the brief names them and the gate rewrites the re-ask)`),
    row('The same kind of question a third time after two misses', (t) => `${t.step.thirdSame} (now: stuck, shown another way or smaller)`),
    row('A closed question straight after a closed one', (t) => `${t.step.closedTwice} (now: the brief asks for an open one)`),
    row('Tutor turns with two or more questions', (t) => `${t.step.twoQuestions} (now: only the last is said)`),
    row('The child\'s cut or shading done for them', (t) => `${t.step.childStep} (now: the sentence is rewritten, the drawing not made)`),
    row('Rewrites for a stock phrase alone', (t) => `${t.step.stockRewrites} (now: none, noted only)`),
    row('Right answers the app did not mark, read right now', (t) => String(t.step.missedRight)),
    '',
  ];
}

export default { replayAppLesson, replayStepLesson, replayAppRun, appReport, OLD_FIXED };
