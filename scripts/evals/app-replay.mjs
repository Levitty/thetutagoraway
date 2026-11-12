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
import { boardClaimOf } from '../../src/voice-tutor/habits.js';
import { childMove, hearNumbers, asksForNumber, isTentative } from '../../src/voice-tutor/spokenAnswer.js';
import { sealable } from '../../src/voice-tutor/commands.js';
import { SILENCE } from '../../src/voice-tutor/silence.js';

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
  const out = { dropped: 0, droppedSoft: 0, fixed: 0, claims: [], claimsCode: 0, fillers: 0, fillerLines: 0, unsureGuess: 0, unsureRightGuess: 0, misheard: 0, misheardAsQuestion: 0, badSeals: [], earlyNudge: 0, earlySmaller: 0, probes: 0 };
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

/** Every lesson of a run, added up. */
export function replayAppRun(parsed) {
  const lessons = parsed.map((tr) => ({ scenario: tr.scenario, title: tr.title, ...replayAppLesson(tr) }));
  const sum = (k) => lessons.reduce((n, l) => n + (Array.isArray(l[k]) ? l[k].length : l[k]), 0);
  const keys = ['dropped', 'droppedSoft', 'fixed', 'claims', 'claimsCode', 'fillers', 'fillerLines', 'unsureGuess', 'unsureRightGuess', 'misheard', 'misheardAsQuestion', 'badSeals', 'earlyNudge', 'earlySmaller', 'probes'];
  return { lessons, total: Object.fromEntries(keys.map((k) => [k, sum(k)])) };
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
    '',
  ];
}

export default { replayAppLesson, replayAppRun, appReport, OLD_FIXED };
