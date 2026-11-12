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
  };
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
  return L;
}
