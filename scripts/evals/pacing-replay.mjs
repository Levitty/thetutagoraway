// ============================================================================
// FREE REPLAY OF THE PACING RULES (12 Nov 2026, no model calls, US$0): the shorter turns, the child's share of the talk,
// the hand-over after explaining and the warm-up's first question (src/voice-tutor/pacing.js and orchestrator.js), run
// over saved transcripts to say what they WOULD have flagged or trimmed. What the tutor would have said instead is not
// known, so everything after a trim is an ESTIMATE: the same child words, the tutor's turns cut to the cap by the live
// trim (trimToWords). Pure functions over what habits.mjs parses; tested in tests/voice-tutor-pacing.test.mjs.
// ============================================================================
import { wordCap, MAX_SPOKEN_WORDS } from '../../src/voice-tutor/commands.js';
import { wordsIn, explainedTurn, shareLow, talkShare, overtalkLimit, HANDOVER_RULES, preFor, askIsOnPre } from '../../src/voice-tutor/pacing.js';
import { trimToWords } from '../../src/voice-tutor/tutorTurn.js';
import { bandOf, BANDS, TALK_BAND } from './conversation-stats.mjs';
import { newWait, handOver, activity, probed, nextProbe, SILENCE, SLOW_FACTOR } from '../../src/voice-tutor/silence.js';
import { endSilenceMs, CHILD_LISTEN } from '../../src/voice-tutor/childVoice.js';
import { newLesson, decide } from '../../src/voice-tutor/orchestrator.js';

export const OLD_CAP = 45;          // the cap before 12 Nov 2026 (hello: 65)
export const PROBE_CAP = 22;
const pct = (a, b) => (b ? Math.round((1000 * a) / b) / 10 : 0);
const sayText = (t) => t.steps.filter((s) => s.cmd === 'say').map((s) => s.text).join(' ');
const capOf = (n, probe) => (probe ? PROBE_CAP : n === 1 ? MAX_SPOKEN_WORDS + 20 : wordCap(n - 1));
const oldCapOf = (n, probe) => (probe ? PROBE_CAP : n === 1 ? OLD_CAP + 20 : OLD_CAP);

/** The turn's says cut to `limit` words as the live turn does (sentence by sentence; the final question is kept). */
export function trimSays(says, limit) {
  const out = []; let used = 0;
  for (const text of says) {
    const w = (x) => x.split(/\s+/).filter(Boolean).length;
    if (used + w(text) > limit) { const t = trimToWords(text, limit - used, { mustSay: !out.length }); if (t) out.push(t); break; }
    out.push(text); used += w(text);
  }
  return out;
}

/** One lesson (a parsed transcript, habits.mjs parseTranscript) replayed turn by turn. */
export function replayLesson(tr, { target = 'MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS' } = {}) {
  const pre = preFor({ target, prerequisite: null, prerequisites: [] });
  const turns = [];
  let cw = 0; let tw = 0; let lastCw = 0; let explain = 0; let asked = false; let firstAsk = null; let childAfter = 0; let tutorAfter = 0;
  for (const t of tr.turns) {
    const says = t.steps.filter((s) => s.cmd === 'say').map((s) => s.text);
    const exempt = /safeguarding|lesson-ended/.test(t.guard) || /^care/.test(t.rule || '');
    const childWords = wordsIn(t.child);
    if (says.length) {
      const words = wordsIn(says.join(' '));
      const cap = capOf(t.n, t.probe);
      const trimmedSays = words > cap ? trimSays(says, cap) : says;
      const after = wordsIn(trimmedSays.join(' '));
      const over = !exempt && words > cap;
      const handover = !exempt && !t.probe && explain >= 1 && HANDOVER_RULES.includes(t.rule);
      const explainedAgain = handover && explainedTurn(t.steps);
      const low = shareLow({ cw, tw });
      const overtalk = !exempt && !t.probe && low && words > overtalkLimit(lastCw);
      turns.push({ n: t.n, exempt, probe: t.probe, words, after, cap, over, overOld: !exempt && words > oldCapOf(t.n, t.probe), handover, explainedAgain, overtalk, flagged: over || explainedAgain || overtalk });
      if (!exempt) { tutorAfter += after; }
      tw += words;
      if (!t.probe && !exempt && !['close', 'stop', 'open'].includes(t.rule)) explain = explainedTurn(t.steps) ? explain + 1 : 0;
      // The first maths question after the hello.
      if (!asked && t.n >= 2 && !t.probe) {
        const ask = t.steps.find((s) => s.cmd === 'ask');
        if (ask) { asked = true; firstAsk = { turn: t.n, prompt: ask.prompt || '', ok: askIsOnPre(pre, { skill: ask.skill || null, prompt: ask.prompt || '' }) }; }
      }
    }
    if (!t.probe) cw += childWords;
    childAfter += childWords;
    lastCw = t.probe ? 0 : childWords;
  }
  const counted = turns.filter((x) => !x.exempt);
  return {
    scenario: tr.scenario, title: tr.title, turns,
    childWords: cw, tutorWords: tw, tutorWordsTrimmed: tutorAfter,
    sharePct: pct(cw, cw + tw), shareTrimmedPct: pct(childAfter, childAfter + tutorAfter), share: cw + tw ? cw / (cw + tw) : 0, shareTrimmed: childAfter + tutorAfter ? childAfter / (childAfter + tutorAfter) : 0,
    firstAsk, prereqFirstOk: firstAsk ? firstAsk.ok : null, counted: counted.length,
  };
}

/** A whole run: per band, how many tutor turns the new caps and rules would have flagged or trimmed, and the talk share. */
export function replayRun(parsed, opts = {}) {
  const lessons = parsed.map((p) => replayLesson(p, opts));
  const all = lessons.flatMap((l) => l.turns.filter((t) => !t.exempt));
  const row = (id, ts) => ({
    id, turns: ts.length, trimmed: ts.filter((t) => t.over).length, trimmedOld: ts.filter((t) => t.overOld).length, handover: ts.filter((t) => t.handover).length, explainedAgain: ts.filter((t) => t.explainedAgain).length,
    overtalk: ts.filter((t) => t.overtalk).length, any: ts.filter((t) => t.flagged).length,
    wordsBefore: ts.reduce((a, t) => a + t.words, 0), wordsAfter: ts.reduce((a, t) => a + t.after, 0),
  });
  const bands = BANDS.map((b) => row(b.id, all.filter((t) => bandOf(t.n) === b.id)));
  const cw = lessons.reduce((a, l) => a + l.childWords, 0);
  const tw = lessons.reduce((a, l) => a + l.tutorWords, 0);
  const twAfter = lessons.reduce((a, l) => a + l.tutorWordsTrimmed, 0);
  const inBand = (x) => x >= TALK_BAND.lo && x <= TALK_BAND.hi;
  const asked = lessons.filter((l) => l.firstAsk);
  return {
    lessons, bands, total: row('all', all),
    share: { now: pct(cw, cw + tw), trimmed: pct(cw, cw + twAfter), inBandNow: lessons.filter((l) => inBand(l.share)).length, inBandTrimmed: lessons.filter((l) => inBand(l.shareTrimmed)).length, belowNow: lessons.filter((l) => l.share < TALK_BAND.lo).length, belowTrimmed: lessons.filter((l) => l.shareTrimmed < TALK_BAND.lo).length, lessons: lessons.length },
    prereq: { asked: asked.length, onPrereq: asked.filter((l) => l.firstAsk.ok).length, refused: asked.filter((l) => !l.firstAsk.ok).map((l) => l.scenario), noAsk: lessons.length - asked.length },
    silence: savedSilence(parsed),
  };
}

// ---------------------------------------------------------------- silence by context (13 Nov 2026, free round)
// The page's silence rules (silence.js) on a simulated clock, one situation each, against SCENARIOS.md: a nudge, then a
// smaller question, quiet while the child draws, no interrupting a child thinking aloud, and the slow flag doubling the
// times. `spec` is the scenario's wording; the app's own times (8 s and 20 s since run 2026-11-12-1824) are reported beside it.
const probesOver = (w0, seconds, { strokesEvery = 0, from = 0 } = {}) => {
  let w = w0; const out = [];
  for (let t = from + 500; t <= from + seconds * 1000; t += 500) {
    if (strokesEvery && t % (strokesEvery * 1000) === 0) { w = activity(w, t); continue; }
    const p = nextProbe(w, t);
    if (p) { out.push({ kind: p.kind, at: Math.round((t - from) / 1000) }); w = handOver(probed(w), { doing: w.doing, probe: true, now: t }); }
  }
  return { probes: out, wait: w };
};
export function silenceChecks() {
  const R = [];
  const at = (ps) => ps.map((p) => `${p.kind} at ${p.at} s`).join(', ') || 'none';
  // 1. Silent after a question for 40 s.
  const a = probesOver(handOver(null, { doing: 'answer', now: 0 }), 40).probes;
  R.push({ id: 'silent after a question (40 s)', spec: 'a nudge at about 6 s, a smaller question at about 15 s, no more', got: at(a), ok: a.length === 2 && a[0].kind === 'answer_nudge' && a[0].at >= 6 && a[0].at <= 10 && a[1].kind === 'answer_smaller' && a[1].at >= 15 && a[1].at <= 25 });
  // 2. Drawing on the board for 40 s (a stroke every 2 s), then stopping for 60 s.
  const t1 = probesOver(handOver(null, { doing: 'task', now: 0 }), 40, { strokesEvery: 2 });
  const t2 = probesOver(t1.wait, 60, { from: 40000 }).probes;
  R.push({ id: 'drawing for 40 s, then still for 60 s', spec: 'quiet while drawing; react when the child stops (the board picture), one check-in only after a long nothing', got: `while drawing: ${at(t1.probes)}; after: ${at(t2)}`, ok: t1.probes.length === 0 && t2.length === 1 && t2[0].kind === 'task_checkin' && t2[0].at >= 40 });
  // 3. Thinking aloud: "umm... so... maybe it is..." with long pauses.
  const endMs = endSilenceMs('umm... so... maybe it is');
  const s0 = { ...newLesson(), stage: 'teach', turns: 3 };
  const d1 = decide(s0, { turnIndex: 3, message: 'umm...' });
  const think = probesOver(handOver(null, { doing: 'answer', now: 0, thinking: true }), 14).probes;
  R.push({ id: 'thinking aloud with long pauses', spec: 'no interruption', got: `the listener holds ${endMs / 1000} s after "maybe it is" (not ${CHILD_LISTEN.baseEndMs / 1000}); a filler alone: ${d1.authored && !d1.line ? 'no words, no model call' : `"${d1.line}"`}; probes in the next 14 s: ${at(think)}`, ok: endMs >= CHILD_LISTEN.thinkingEndMs && d1.authored && !d1.line && think.length === 0 });
  // 4. The slow flag doubles both times.
  const sl = probesOver(handOver(null, { doing: 'answer', now: 0, slow: true }), 60).probes;
  R.push({ id: 'a slow, careful child (slow flag)', spec: `both times doubled (x${SLOW_FACTOR})`, got: at(sl), ok: sl.length === 2 && sl[0].at === 2 * a[0].at && sl[1].at >= 2 * (SILENCE.answer.secondTotalMs / 1000) });
  // 5. Free talk: gentler and later than an answer.
  const tk = probesOver(handOver(null, { doing: 'talk', now: 0 }), 40).probes;
  R.push({ id: 'free talk, quiet (40 s)', spec: 'like answering, later', got: at(tk), ok: tk.length === 2 && tk[0].at > a[0].at });
  return R;
}
/** What the saved run did: probes by the context of the last hand-over, and probes soon after a thinking reply. */
export function savedSilence(parsed) {
  const out = { probes: 0, inTask: 0, earlyAnswer: 0, afterThinking: 0, afterThinkingEarly: 0 };
  for (const tr of parsed) {
    let doing = 'answer'; let thinking = false;
    for (const t of tr.turns) {
      const m = /probe \((\w+), silent (\d+) s\)/.exec(t.kind || '');
      if (m) {
        out.probes += 1;
        const s = Number(m[2]);
        if (doing === 'task' && m[1] !== 'task_checkin') out.inTask += 1;
        if (m[1] === 'answer_nudge' && s * 1000 < SILENCE.answer.firstMs) out.earlyAnswer += 1;
        if (thinking && /nudge/.test(m[1])) { out.afterThinking += 1; if (s * 1000 < SLOW_FACTOR * SILENCE.answer.firstMs) out.afterThinkingEarly += 1; }
      } else if (t.child != null) thinking = t.rule === 'thinking';
      const h = [...t.steps].reverse().find((x) => x.cmd === 'pause_for_child');
      if (h?.doing) doing = h.doing;
    }
  }
  return out;
}
export function silenceReport(runs) {
  const L = ['### Silence by context (13 Nov 2026; no model calls)', '', 'The page\'s silence rules on a simulated clock, one situation each (SCENARIOS.md 1, 2, 3 and 17):', '', '| Situation | Expected | What the rules do | |', '|---|---|---|---|'];
  for (const c of silenceChecks()) L.push(`| ${c.id} | ${c.spec} | ${c.got} | ${c.ok ? 'PASS' : 'FAIL'} |`);
  L.push('', 'In the saved runs (read from the transcripts):', '', `| | ${runs.map((r) => r.run).join(' | ')} |`, `|---|${runs.map(() => '---').join('|')}|`);
  const row = (label, f) => L.push(`| ${label} | ${runs.map((r) => f(r.pacing.silence)).join(' | ')} |`);
  row('Silence probes', (x) => String(x.probes));
  row('Probes while the child had a board task (other than the one check-in)', (x) => String(x.inTask));
  row('Nudges sooner than 8 s', (x) => String(x.earlyAnswer));
  row('Nudges after a reply that was only thinking ("umm...")', (x) => `${x.afterThinking} (${x.afterThinkingEarly} sooner than ${SLOW_FACTOR * SILENCE.answer.firstMs / 1000} s: now doubled)`);
  L.push('');
  return L;
}

export function pacingReport(runs) {
  const L = ['## Free replay of the new pacing rules (no model calls; an ESTIMATE of what they would have caught)', ''];
  L.push(`The caps are now ${MAX_SPOKEN_WORDS} words a normal turn (was ${OLD_CAP}) and ${wordCap(10)} after tutor turn 10; the hello keeps its allowance (${MAX_SPOKEN_WORDS + 20} words); a probe stays at ${PROBE_CAP}. A saved turn is "trimmed" when its words are over the cap for its turn number. The hand-over rule is checked on the turn after one that explained or showed with no question or ask; the overtalk rule when the running child share is under 25% (after 60 words) and the turn runs past twice the child's last reply plus 15. Care turns are left out. Everything about what the tutor would have said instead is an estimate: the saved child words are kept, the tutor's over-long turns are cut by the live trim.`, '');
  for (const r of runs) {
    const p = r.pacing;
    L.push(`### ${r.run}`, '', '| Band | Tutor turns | Over the new cap (trimmed) | Over the old cap of 45 | Hand-over turns (rule applies) | ... explained again | Overtalk (low share) | Any of the three new checks | Tutor words now | After trimming |', '|---|---|---|---|---|---|---|---|---|---|');
    for (const b of [...p.bands, p.total]) L.push(`| ${b.id} | ${b.turns} | ${b.trimmed} (${pct(b.trimmed, b.turns)}%) | ${b.trimmedOld} | ${b.handover} | ${b.explainedAgain} | ${b.overtalk} | ${b.any} (${pct(b.any, b.turns)}%) | ${b.wordsBefore} | ${b.wordsAfter} |`);
    const s = p.share;
    L.push('', `Child share of the words in the ${s.lessons} lessons: ${s.now}% as run; ESTIMATE if the over-long turns were cut to the cap and the child said the same: ${s.trimmed}%. Lessons in the 25-40% band: ${s.inBandNow} as run, ${s.inBandTrimmed} estimated; below the band: ${s.belowNow} as run, ${s.belowTrimmed} estimated. (A trim alone does not make the child talk more; the hand-over and share rules are what is meant to do that, and only a live run can show it.)`, '');
    const q = p.prereq;
    L.push(`Warm-up rule (first maths question on the earlier skill; these lessons target equivalent fractions, a root skill, so the foundation is "equal parts and what a half is", read from the words of the question, a heuristic): of ${q.asked} lessons that asked a maths question after the hello, ${q.onPrereq} first asked about the foundation and ${q.asked - q.onPrereq} would have had that question refused until the right one was asked${q.refused.length ? ` (scenarios ${q.refused.join(', ')})` : ''}; ${q.noAsk} asked none.`, '');
  }
  L.push(...silenceReport(runs));
  return L;
}
