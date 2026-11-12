// ============================================================================
// THE FREE YARDSTICK (PLAN_TO_FOUR.md step 1, owner's yes 12 Nov 2026): the tutor's habits counted in saved run
// transcripts, with NO model calls (US$0). The checks are src/voice-tutor/habits.js, the same functions the live turn
// gate runs (tutorTurn.js), so a count here is what the gate would have caught.
//
//   npm run eval:habits                                   runs 2026-11-12-1045 and 2026-11-12-1142 (the baseline)
//   npm run eval:habits -- 2026-11-12-1142                one run (a folder name under the runs folder, or a path)
//   npm run eval:habits -- --spot 10                      also list 10 flagged turns with the reason, to judge false alarms
//   npm run eval:habits -- --write                        also save HABITS.md in each run's folder
//   npm run eval:habits -- --json                         the counts as JSON
//
// It reads each scenario's markdown transcript (the words the child heard, the board actions, the sealed answers, the
// app's marks, the answer classes and the rules) and replays the lesson's facts turn by turn: the questions still open,
// the answers found, the board, the level and its successes. Care turns (safeguarding) are not counted.
// ============================================================================
import { readFileSync, readdirSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { HABITS, HABIT_NAMES, turnFlags, habitContext, habitsOf, nextLevel, readChild } from '../../src/voice-tutor/habits.js';
import { canonAnswer } from '../../src/voice-tutor/spokenAnswer.js';
import { matchedDrift, driftByBand, driftByThirds, lessonStats, runStats, statsReport, shareByThirds } from './conversation-stats.mjs';
// Not imported from api.mjs: that reads the API key, and this script never needs one.
export const RUNS_DIR = '/Users/mutualevity/Desktop/Tutagora/Build/voice-tutor/evals/runs';

export const BASELINE_RUNS = ['2026-11-12-1045', '2026-11-12-1142'];
const PHASES = ['warmup', 'teach', 'guided', 'independent', 'wrapup'];

/** One scenario's transcript as turns: { n, kind, child, marked, cls, rule, reason, guard, authored, probe, steps }. */
export function parseTranscript(md) {
  const out = { scenario: null, title: '', turns: [] };
  const h = /^# Scenario (\d+): (.*)$/m.exec(md);
  if (h) { out.scenario = Number(h[1]); out.title = h[2].trim(); }
  const parts = md.split(/^## Turn /m).slice(1);
  for (const p of parts) {
    const lines = p.split('\n');
    const head = /^(\d+): ([^|]+)/.exec(lines[0]) || [];
    const t = { n: Number(head[1]), kind: String(head[2] || '').trim(), child: null, marked: null, cls: null, rule: null, reason: '', guard: '', authored: false, probe: /probe/.test(String(head[2] || '')), steps: [] };
    for (const raw of lines.slice(1)) {
      const l = raw.trim();
      let m;
      // A garbled turn reads: Child (what they meant: "..."; what the microphone gave HOREB): "..."
      if ((m = /^Child(?: \(what they meant:.*?\))?: "(.*)"/.exec(l))) t.child = m[1].replace(/" \(.*$/, '').replace(/"$/, '');
      else if ((m = /^Marked by the app from the sealed answer: (right|wrong)/.exec(l))) t.marked = { correct: m[1] === 'right', tentative: /tentative|unsure/.test(l) };
      else if ((m = /^HOREB(?: \{move: ([^}]*)\})?: (.*)$/.exec(l))) t.steps.push({ cmd: 'say', text: m[2], ...(m[1] ? { move: m[1] } : {}) });
      else if ((m = /^\[hand over: child is now (\w+)/.exec(l))) t.steps.push({ cmd: 'pause_for_child', doing: m[1] });
      else if ((m = /^\[(\w+) (\{.*\})\]$/.exec(l))) { try { t.steps.push({ cmd: m[1], ...JSON.parse(m[2]) }); } catch { /* not a step */ } }
      else if ((m = /^\[(\w+)\]$/.exec(l))) t.steps.push({ cmd: m[1] });
      else if ((m = /^\(Sealed answer to ([a-z0-9_]+): (.+?): the tutor must/.exec(l))) { const a = t.steps.find((x) => x.cmd === 'ask' && x.id === m[1]); if (a) a.answer = m[2]; }
      else if ((m = /^Answer class: ([a-z_]+)/.exec(l))) t.cls = m[1];
      else if ((m = /; rule: ([a-z-]+); reason: (.*)$/.exec(l))) { t.rule = m[1]; t.reason = m[2]; }
      else if ((m = /^Guard reasons: (.*)$/.exec(l))) t.guard = m[1];
      else if (/^\(No model call in this turn/.test(l)) t.authored = true;
    }
    out.turns.push(t);
  }
  return out;
}

/** The lesson replayed: each turn with the facts the checks read, and its flags. */
// `strict`: the live gate's late-lesson rule (the repeat check over four turns after the tenth). The counts and the drift
// are measured WITHOUT it, so they stay comparable with the baseline and a rise late is not made by the rule meant to cure it.
export function scoreTranscript(tr, { strict = false } = {}) {
  const history = []; let board = []; let open = null; const found = [];
  let L = { level: 0, wins: 0, stage: 'warmup' }; let helped = false;
  const turns = [];
  for (const t of tr.turns) {
    const exempt = /safeguarding|lesson-ended/.test(t.guard) || /^care/.test(t.rule || '');
    // The answer to the question open before this turn.
    if (t.marked?.correct && open) { found.push(canonAnswer(open.answer)); }
    const stageNow = /^the (\w+) part of the lesson/.exec(t.reason)?.[1];
    if (PHASES.includes(stageNow)) L = { ...L, stage: stageNow };
    const closing = ['close', 'stop'].includes(t.rule) || L.stage === 'wrapup';
    const hidden = open && !(t.marked?.correct) ? [{ answer: open.answer, accepts: [], question: open.question }] : [];
    const ctx = habitContext({ message: t.child || '', marked: t.marked, cls: t.cls, history, hidden, found: [...found], board, level: L, closing, exempt, example: t.rule === 'example', lateRepeat: strict });
    const flags = turnFlags(t.steps, ctx);
    turns.push({ n: t.n, kind: t.kind, child: t.child, rule: t.rule, exempt, flags, habits: habitsOf(flags), text: t.steps.filter((x) => x.cmd === 'say').map((x) => x.text).join(' ') });
    // The facts after the turn.
    if (t.child) history.push({ who: 'child', text: t.child });
    for (const x of t.steps.filter((s) => s.cmd === 'say')) history.push({ who: 'tutor', text: x.text, turn: t.n });
    L = nextLevel(L, { correct: !!t.marked?.correct, cls: t.cls, hedged: readChild(t.child || '', { marked: t.marked }).hedged, helped, steps: t.steps });
    for (const p of t.steps.filter((s) => s.cmd === 'set_phase')) if (PHASES.includes(p.phase)) L = { ...L, stage: p.phase };
    if (t.marked?.correct) { open = null; helped = false; }
    const ask = [...t.steps].reverse().find((s) => s.cmd === 'ask' && s.answer != null);
    if (ask) { open = { answer: ask.answer, question: ask.prompt || '' }; helped = false; }
    if (t.probe || t.steps.some((s) => s.move === 'Smaller-question hint')) helped = true;
    board = boardAfterTurn(board, t.steps);
  }
  return { scenario: tr.scenario, title: tr.title, turns };
}
const DRAWS = ['write_text', 'write_math', 'fraction_bar', 'number_line', 'shape', 'plot_points', 'figure'];
const boardAfterTurn = (board, steps) => {
  const m = new Map(board.map((b) => [b.id, b]));
  for (const x of steps) {
    if (DRAWS.includes(x.cmd) && x.id) m.set(x.id, x);
    else if (x.cmd === 'erase') for (const id of x.targets || []) m.delete(id);
    else if (x.cmd === 'clear') m.clear();
  }
  return [...m.values()];
};

/** A run folder scored: per scenario and in total, plus the judge's worst turns that were flagged. */
export function scoreRun(dir) {
  const files = readdirSync(dir).filter((f) => /^\d\d-.*\.md$/.test(f)).sort();
  const scenarios = files.map((f) => scoreTranscript(parseTranscript(readFileSync(join(dir, f), 'utf8'))));
  const counted = scenarios.flatMap((s) => s.turns.filter((t) => !t.exempt));
  const total = Object.fromEntries(HABITS.map((h) => [h, {
    turns: counted.filter((t) => t.habits.includes(h)).length,
    scenarios: scenarios.filter((s) => s.turns.some((t) => !t.exempt && t.habits.includes(h))).map((s) => s.scenario),
  }]));
  let judge = null;
  const sp = join(dir, 'scores.json');
  if (existsSync(sp)) {
    try {
      const scores = JSON.parse(readFileSync(sp, 'utf8'));
      const worst = scores.flatMap((s) => (s.score?.worst_turns || []).map((w) => ({ scenario: s.scenario, turn: Number(w.turn) })));
      const flagged = worst.filter((w) => scenarios.find((s) => s.scenario === w.scenario)?.turns.find((t) => t.n === w.turn)?.habits.length);
      judge = { worst: worst.length, flagged: flagged.length, given: scores.filter((s) => s.score?.answer_given_away).map((s) => s.scenario) };
    } catch { judge = null; }
  }
  const parsed = files.map((f) => parseTranscript(readFileSync(join(dir, f), 'utf8')));
  const strictScenarios = parsed.map((p) => scoreTranscript(p, { strict: true }));
  const strictCounted = strictScenarios.flatMap((s) => s.turns.filter((t) => !t.exempt));
  const lessons = parsed.map(lessonStats);
  return {
    run: basename(dir), scenarios, tutorTurns: counted.length, flaggedTurns: counted.filter((t) => t.habits.length).length, total, judge,
    keySteps: counted.filter((t) => t.flags.some((f) => /key step/.test(f.reason))).length,
    honesty: counted.filter((t) => t.flags.some((f) => /claims a feeling|promises or invites a secret/.test(f.reason))).length,
    lateRule: { repeat: strictCounted.filter((t) => t.habits.includes('repeat')).length, any: strictCounted.filter((t) => t.habits.length).length },
    bands: driftByBand(scenarios, HABITS), matched: matchedDrift(scenarios), lessons, stats: runStats(lessons),
    // The long lessons, by thirds (scenario 41 and any other of 20 or more tutor turns).
    thirds: scenarios.filter((s) => s.turns.length >= 20).map((s) => ({ scenario: s.scenario, title: s.title, habits: driftByThirds(s), talk: shareByThirds(parsed.find((p) => p.scenario === s.scenario)) })),
  };
}

/**
 * Flagged turns for a person to judge: spread over the habits, the runs (newest first) and the scenarios, one reason
 * wording once, the same every time.
 */
export function spotCheck(runs, n = 10) {
  const order = [...runs].reverse();
  const items = HABITS.map((h) => order.map((r) => r.scenarios.flatMap((s) => s.turns.filter((t) => !t.exempt && t.habits.includes(h))
    .map((t) => ({ run: r.run, scenario: s.scenario, title: s.title, turn: t.n, habit: h, reason: t.flags.find((f) => f.habit === h).reason, child: t.child, said: t.text })))));
  const out = []; const scen = new Set(); const why = new Set();
  const key = (x) => x.reason.replace(/"[^"]*"/g, '').replace(/\d+/g, '').trim();
  for (let round = 0; out.length < n && round < 40; round += 1) {
    for (const perRun of items) {
      if (out.length >= n) break;
      const list = perRun[round % perRun.length] || [];
      const pick = list.find((x) => !scen.has(`${x.run}:${x.scenario}`) && !why.has(key(x)));
      if (pick) { out.push(pick); scen.add(`${pick.run}:${pick.scenario}`); why.add(key(pick)); }
    }
  }
  return out;
}

export function report(runs, { spot = 0 } = {}) {
  const L = [];
  L.push('# Habit counts (the free yardstick, no model calls)', '');
  L.push('Counted per tutor turn by src/voice-tutor/habits.js, the checks the live turn gate runs. Care turns are not counted.', '');
  L.push(`| Habit | ${runs.map((r) => `${r.run}: turns (scenarios)`).join(' | ')} |`, `|---|${runs.map(() => '---').join('|')}|`);
  for (const h of HABITS) L.push(`| ${HABIT_NAMES[h]} (${h}) | ${runs.map((r) => `${r.total[h].turns} (${r.total[h].scenarios.length} of ${r.scenarios.length})`).join(' | ')} |`);
  L.push(`| Any habit | ${runs.map((r) => `${r.flaggedTurns} of ${r.tutorTurns} turns`).join(' | ')} |`, '');
  for (const r of runs) {
    if (r.judge) L.push(`${r.run}: the judge's worst turns flagged by a check: ${r.judge.flagged} of ${r.judge.worst}. The judge said an answer was given away in ${r.judge.given.length} scenarios; the giveaway check flags ${r.total.giveaway.scenarios.length} (${r.total.giveaway.scenarios.filter((s) => r.judge.given.includes(s)).length} of the judge's).`);
  }
  L.push('');
  for (const r of runs) L.push(`${r.run}: of the giveaway turns, ${r.keySteps} are a key intermediate step said for the child (the new check, for example "same bottom number needed"); ${r.honesty} tutor turns claim a feeling or promise a secret.`, '');
  L.push(...statsReport(runs, HABITS, HABIT_NAMES));
  for (const r of runs) L.push(`${r.run}: with the live gate's late-lesson rule (the repeat check over the last four tutor turns after turn 10, not two) the yardstick would flag ${r.lateRule.repeat} repeat turns instead of ${r.total.repeat.turns}, and ${r.lateRule.any} turns in all instead of ${r.flaggedTurns}.`, '');
  for (const r of runs) {
    for (const t of r.thirds) L.push(`Scenario ${t.scenario} (${t.title}) by thirds of the lesson: habits flagged ${t.habits.map((x) => `${x.flagged} of ${x.turns} (${x.rate}%)`).join(' | ')}; child share of words ${t.talk.map((x) => `${x.sharePct}%`).join(' | ')}; tutor words a turn ${t.talk.map((x) => x.tutorWordsPerTurn).join(' | ')}.`, '');
  }
  for (const r of runs) {
    L.push(`## ${r.run}: by scenario`, '', `| # | Scenario | ${HABITS.join(' | ')} |`, `|---|---|${HABITS.map(() => '---').join('|')}|`);
    for (const s of r.scenarios) L.push(`| ${s.scenario} | ${s.title} | ${HABITS.map((h) => s.turns.filter((t) => !t.exempt && t.habits.includes(h)).length || '').join(' | ')} |`);
    L.push('');
  }
  if (spot) {
    L.push(`## ${spot} flagged turns, for a person to judge (false alarm or not)`, '');
    spotCheck(runs, spot).forEach((x, k) => {
      L.push(`${k + 1}. **${x.habit}**, ${x.run}, scenario ${x.scenario} (${x.title}), turn ${x.turn}. ${x.reason}.`);
      if (x.child) L.push(`   - Child: "${x.child.slice(0, 160)}"`);
      L.push(`   - HOREB: "${x.said.slice(0, 260)}"`);
    });
    L.push('');
  }
  return L.join('\n');
}

const isMain = process.argv[1] && process.argv[1].endsWith('habits.mjs');
if (isMain) {
  const args = process.argv.slice(2);
  const flag = (k) => args.includes(k);
  const spotAt = args.indexOf('--spot');
  const spot = spotAt >= 0 ? Number(args[spotAt + 1]) || 10 : 0;
  const names = args.filter((a, k) => !a.startsWith('--') && !(spotAt >= 0 && k === spotAt + 1));
  const dirs = (names.length ? names : BASELINE_RUNS).map((n) => (existsSync(n) && statSync(n).isDirectory() ? resolve(n) : join(RUNS_DIR, n)));
  const runs = dirs.map(scoreRun);
  if (flag('--json')) {
    console.log(JSON.stringify(runs.map((r) => ({ run: r.run, tutorTurns: r.tutorTurns, flaggedTurns: r.flaggedTurns, total: r.total, judge: r.judge, keySteps: r.keySteps, honesty: r.honesty, lateRule: r.lateRule, bands: r.bands, matched: r.matched, stats: r.stats, thirds: r.thirds })), null, 2));
  } else {
    const text = report(runs, { spot });
    console.log(text);
    if (flag('--write')) for (const [k, d] of dirs.entries()) writeFileSync(join(d, 'HABITS.md'), report([runs[k]], { spot }));
  }
}
