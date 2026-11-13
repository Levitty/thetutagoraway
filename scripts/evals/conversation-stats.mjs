// ============================================================================
// FREE MEASURES OVER SAVED TRANSCRIPTS (READING_12NOV.md change 1, no model calls, US$0): drift by turn band
// (SafeTutors: do the habits get worse late in a lesson?) and the TeachLM conversation statistics (who talks, how long
// the tutor's turns are, how many questions, whether it asked what the child already knows and checked the earlier
// skill). Pure functions over what habits.mjs parses and scores; tested in tests/voice-tutor-eval-measures.test.mjs.
// ============================================================================

export const BANDS = [
  { id: '1-10', from: 1, to: 10 },
  { id: '11-20', from: 11, to: 20 },
  { id: '21+', from: 21, to: Infinity },
];
export const bandOf = (n) => BANDS.find((b) => n >= b.from && n <= b.to)?.id || '21+';
/** The child's talk share the judge looks for (TeachLM: real tutoring sits at 25 to 40% of the words, not over 50%). */
export const TALK_BAND = { lo: 0.25, hi: 0.40 };
/** A floor on the child's words in a lesson of this many tutor turns (a silent child is not a good lesson either). */
export const MIN_CHILD_WORDS_PER_TURN = 1.5;

export const wordCount = (t) => String(t || '').replace(/\.\.\.|…/g, ' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
const sentences = (t) => String(t || '').split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter(Boolean);
const isQ = (s) => /\?\s*$/.test(s);
const pct = (a, b) => (b ? Math.round((1000 * a) / b) / 10 : 0);
const round1 = (v) => Math.round(v * 10) / 10;

/**
 * Habit failures by turn band over scored scenarios (habits.mjs scoreTranscript output).
 * Care turns are not counted, as everywhere. @returns {{ id, turns, habits: {habit: n}, any: n, rates: {habit: pct}, anyRate }[]}
 */
export function driftByBand(scenarios, habitNames) {
  return BANDS.map((b) => {
    const turns = scenarios.flatMap((s) => s.turns.filter((t) => !t.exempt && bandOf(t.n) === b.id));
    const habits = Object.fromEntries(habitNames.map((h) => [h, turns.filter((t) => t.habits.includes(h)).length]));
    const any = turns.filter((t) => t.habits.length).length;
    return { id: b.id, turns: turns.length, habits, any, rates: Object.fromEntries(habitNames.map((h) => [h, pct(habits[h], turns.length)])), anyRate: pct(any, turns.length) };
  });
}

/**
 * The same lessons early against late: only scenarios that reach turn 11 or beyond, their turns 1-10 against 11 and over.
 * (The bands above mix different scenarios; this holds the lesson fixed, so a rise is the lesson getting worse, not a different lesson.)
 */
export function matchedDrift(scenarios) {
  const long = scenarios.filter((s) => s.turns.some((t) => t.n >= 11));
  const part = (pick) => { const ts = long.flatMap((s) => s.turns.filter((t) => !t.exempt && pick(t.n))); const any = ts.filter((t) => t.habits.length).length; return { turns: ts.length, any, rate: pct(any, ts.length) }; };
  return { scenarios: long.map((s) => s.scenario), early: part((n) => n <= 10), late: part((n) => n >= 11) };
}

/** The same counts in thirds of one lesson (scenario 41: the last third no worse than the first). */
export function driftByThirds(scoredScenario) {
  const turns = scoredScenario.turns.filter((t) => !t.exempt);
  const k = Math.max(1, Math.ceil(turns.length / 3));
  const parts = [turns.slice(0, k), turns.slice(k, 2 * k), turns.slice(2 * k)];
  return parts.map((p, i) => ({ third: i + 1, turns: p.length, flagged: p.filter((t) => t.habits.length).length, rate: pct(p.filter((t) => t.habits.length).length, p.length) }));
}

// What counts as asking about the child's own background, and as checking the earlier skill, from the tutor's questions.
export const BACKGROUND_Q = /\b(what do you (already )?(know|think)|what have you (learned|learnt|done|seen)|have you (ever |already )?(seen|shared|cut|used|heard|done|learned|learnt)|do you (remember|know (what|how|about))|tell me (what|about) (you|your)|what is a (half|fraction|quarter)|what does .{1,30} mean to you)\b/i;
// The teacher's opening and close (13 Nov 2026, scenario 30): the goal said ("today we are learning ..."), one question on
// what the child already knows of the MATHS (a half, a fraction, equal parts; not "have you shared a chapati"), and a close
// with a summary, what the child can now do and what comes next.
export const GOAL_SAID = /\btoday,? (we|you and i) (are|will|'ll|shall)? ?(going to )?(learn|find|look|work|explore|see|try|discover)\w*/i;
export const PRIOR_Q = /\b(what do you (already )?know about|what do you think (a|one) (half|quarter|fraction)|what is (a|one) (half|quarter|fraction)|what does (a |one )?(half|quarter|fraction|equal) mean|have you (ever )?(heard|learned|learnt|seen) (of |about )?(a |the word )?(half|halves|quarter|fraction|equal)|do you (remember|know) what (a )?(half|quarter|fraction|equal parts?))\b/i;
export const CLOSE_SUMMARY = /\b(today,? (we|you) (have )?(\w+ed|\w+t|saw|found|did|made)\b|(we|you) (have )?(learned|learnt|found out)\b|you found that)/i;
export const CLOSE_CAN_NOW = /\b(now you can|you can now|you are now able|you now know how)\b/i;
export const CLOSE_NEXT = /\b(next time|next lesson|in our next|tomorrow we|next,? we will|after this we will)\b/i;
export const PREREQ_Q = /\b(what is a half|what do you think a half|what is a fraction|what does equal (parts|pieces)? ?mean|are (the|these|those) (parts|pieces) (the same|equal)|how many equal (parts|pieces)|can you show me (a half|a quarter)|what is a quarter|do you remember (what|how) (a )?(half|fraction|equal))\b/i;

/**
 * The TeachLM statistics of one lesson (a parsed transcript, habits.mjs parseTranscript). The tutor's words are its `say`
 * steps; the child's words are what reached the tutor (the ink fallback and the shading words included).
 */
export function lessonStats(tr) {
  const turns = tr.turns || [];
  const tutorTurns = turns.filter((t) => t.steps.some((s) => s.cmd === 'say'));
  const tutorText = (t) => t.steps.filter((s) => s.cmd === 'say').map((s) => s.text).join(' ');
  const tutorWords = tutorTurns.reduce((a, t) => a + wordCount(tutorText(t)), 0);
  const childWords = turns.reduce((a, t) => a + wordCount(t.child), 0);
  const childTurns = turns.filter((t) => t.child).length;
  const questions = tutorTurns.reduce((a, t) => a + sentences(tutorText(t)).filter(isQ).length, 0);
  // Background asked: a question about what the child knows, in the first three tutor turns (before teaching starts).
  const early = tutorTurns.slice(0, 3);
  const background = early.some((t) => sentences(tutorText(t)).some((s) => isQ(s) && BACKGROUND_Q.test(s)));
  // Earlier skill checked: the app sent the lesson back to the prerequisite, or a question about the basic idea in the first five turns.
  const firstFive = tutorTurns.slice(0, 5);
  const prereq = turns.some((t) => t.rule === 'prerequisite') || firstFive.some((t) => sentences(tutorText(t)).some((s) => isQ(s) && PREREQ_Q.test(s)));
  const share = childWords + tutorWords ? childWords / (childWords + tutorWords) : 0;
  // The opening and the close as a teacher does them (13 Nov 2026).
  const goal = tutorTurns.slice(0, 2).some((t) => GOAL_SAID.test(tutorText(t)));
  const prior = early.some((t) => sentences(tutorText(t)).some((s) => isQ(s) && PRIOR_Q.test(s)));
  const closeTurns = turns.filter((t) => ['close', 'stop'].includes(t.rule) || t.steps.some((s) => s.cmd === 'end_session'));
  const closeText = closeTurns.map(tutorText).join(' ');
  const close = { closed: closeTurns.length > 0, summary: CLOSE_SUMMARY.test(closeText), canNow: CLOSE_CAN_NOW.test(closeText), next: CLOSE_NEXT.test(closeText) };
  return {
    scenario: tr.scenario, title: tr.title, tutorTurns: tutorTurns.length, childTurns, tutorWords, childWords,
    share,
    sharePct: round1(100 * share),
    wordsPerTutorTurn: tutorTurns.length ? round1(tutorWords / tutorTurns.length) : 0,
    questionsPerTutorTurn: tutorTurns.length ? Math.round((100 * questions) / tutorTurns.length) / 100 : 0,
    background, prereq, goal, prior, close,
    inBand: share >= TALK_BAND.lo && share <= TALK_BAND.hi,
    aboveBand: share > TALK_BAND.hi, belowBand: share < TALK_BAND.lo,
    childWordsPerTurn: tutorTurns.length ? round1(childWords / tutorTurns.length) : 0,
  };
}

/** Child share of words in thirds of a lesson (scenario 41's drift check on the talk, not only the habits). */
export function shareByThirds(tr) {
  const turns = tr.turns || [];
  const k = Math.max(1, Math.ceil(turns.length / 3));
  return [turns.slice(0, k), turns.slice(k, 2 * k), turns.slice(2 * k)].map((p, i) => {
    const c = p.reduce((a, t) => a + wordCount(t.child), 0);
    const tu = p.reduce((a, t) => a + wordCount(t.steps.filter((s) => s.cmd === 'say').map((s) => s.text).join(' ')), 0);
    return { third: i + 1, turns: p.length, sharePct: c + tu ? round1((100 * c) / (c + tu)) : 0, tutorWordsPerTurn: p.length ? round1(tu / p.length) : 0 };
  });
}

/** The run in total: pooled share, the mean lesson, how many lessons sit in, above and below the band. */
export function runStats(lessons) {
  const L = lessons.filter((x) => x.tutorTurns > 0);
  const sum = (k) => L.reduce((a, x) => a + x[k], 0);
  const cw = sum('childWords'); const tw = sum('tutorWords');
  const lessonCount = L.length;
  return {
    lessons: lessonCount,
    pooledSharePct: pct(cw, cw + tw),
    meanLessonSharePct: lessonCount ? round1(L.reduce((a, x) => a + x.sharePct, 0) / lessonCount) : 0,
    inBand: L.filter((x) => x.inBand).length, aboveBand: L.filter((x) => x.aboveBand).length, belowBand: L.filter((x) => x.belowBand).length,
    wordsPerTutorTurn: sum('tutorTurns') ? round1(tw / sum('tutorTurns')) : 0,
    questionsPerTutorTurn: sum('tutorTurns') ? Math.round((100 * L.reduce((a, x) => a + x.questionsPerTutorTurn * x.tutorTurns, 0)) / sum('tutorTurns')) / 100 : 0,
    childWordsPerTutorTurn: sum('tutorTurns') ? round1(cw / sum('tutorTurns')) : 0,
    backgroundAsked: L.filter((x) => x.background).length,
    prereqChecked: L.filter((x) => x.prereq).length,
    goalSaid: L.filter((x) => x.goal).length,
    priorAsked: L.filter((x) => x.prior).length,
    closed: L.filter((x) => x.close?.closed).length,
    closeFull: L.filter((x) => x.close?.closed && x.close.summary && x.close.canNow && x.close.next).length,
    closeParts: { summary: L.filter((x) => x.close?.summary).length, canNow: L.filter((x) => x.close?.canNow).length, next: L.filter((x) => x.close?.next).length },
  };
}

/** The report section (markdown lines) for one or more runs: drift by band and the TeachLM statistics. */
export function statsReport(runs, habitNames, habitLabels = {}) {
  const L = [];
  L.push('## Drift by turn band (SafeTutors pattern: do the habits get worse late in the lesson?)', '');
  L.push('Counted per tutor turn number in the transcript (probes included), care turns left out. The rate is the share of counted turns in the band that show the habit.', '');
  for (const r of runs) {
    L.push(`### ${r.run}`, '');
    L.push(`| Band | Tutor turns | ${habitNames.map((h) => habitLabels[h] || h).join(' | ')} | Any habit |`, `|---|---|${habitNames.map(() => '---').join('|')}|---|`);
    for (const b of r.bands) L.push(`| ${b.id} | ${b.turns} | ${habitNames.map((h) => `${b.habits[h]} (${b.rates[h]}%)`).join(' | ')} | ${b.any} (${b.anyRate}%) |`);
    const m = r.matched;
    L.push('', `Same ${m.scenarios.length} lessons early against late (turns 1-10 against 11 and over): ${m.early.rate}% (${m.early.any} of ${m.early.turns}) against ${m.late.rate}% (${m.late.any} of ${m.late.turns}) of turns flagged.`, '');
    const rise = m.late.turns >= 20 && m.late.rate > m.early.rate + 5;
    L.push(rise
      ? `Reading: the rate RISES late in the same lessons (the SafeTutors drift pattern), so the live gate needs a stricter late-lesson rule: the repeat and stock checks over the last four turns, not two. The biggest rises, band 11-20 against 1-10: ${[...habitNames].map((h) => [h, r.bands[1].rates[h] - r.bands[0].rates[h]]).sort((x, y) => y[1] - x[1]).slice(0, 2).map(([h, d]) => `${habitLabels[h] || h} (+${Math.round(d * 10) / 10} points)`).join(', ')}.`
      : 'Reading: no clear rise late in the same lessons.', '');
    const c = r.bands[2];
    if (c.turns < 20) L.push(`Only ${c.turns} tutor turns reach turn 21 or beyond (scenarios 1 and 30 only), too few to read alone; scenario 41 (35 to 40 turns) is the real drift test.`, '');
  }
  L.push('## Conversation statistics (TeachLM-style)', '');
  L.push(`Child share of words: the target band is ${TALK_BAND.lo * 100} to ${TALK_BAND.hi * 100}% (TeachLM; the old check said over 50%). Tutor words are the tutor's spoken sentences; child words are what reached the tutor. "Asked what the child knows" is a question of that kind in the first three tutor turns; "earlier skill checked" is a prerequisite question in the first five or an app send-back to the prerequisite.`, '');
  L.push('| Run | Lessons | Child share (all words) | Mean lesson share | In 25-40% | Above | Below | Tutor words a turn | Questions a turn | Child words a turn | Asked what the child knows | Earlier skill checked |', '|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of runs) { const s = r.stats; L.push(`| ${r.run} | ${s.lessons} | ${s.pooledSharePct}% | ${s.meanLessonSharePct}% | ${s.inBand} | ${s.aboveBand} | ${s.belowBand} | ${s.wordsPerTutorTurn} | ${s.questionsPerTutorTurn} | ${s.childWordsPerTutorTurn} | ${s.backgroundAsked} of ${s.lessons} | ${s.prereqChecked} of ${s.lessons} |`); }
  L.push('');
  L.push('### The opening and the close, as a teacher does them (13 Nov 2026)', '');
  L.push('"Goal said": the first two tutor turns say what we are learning today. "Asked what the child knows of the maths": a question in the first three turns about a half, a quarter, a fraction or equal parts (not an everyday-experience question). "Closed": a close or goodbye turn happened. A full close has a summary, what the child can now do, and what comes next.', '');
  L.push('| Run | Lessons | Goal said | Asked what the child knows of the maths | Closed | Summary | Can now | Next | Full close |', '|---|---|---|---|---|---|---|---|---|');
  for (const r of runs) { const s = r.stats; L.push(`| ${r.run} | ${s.lessons} | ${s.goalSaid} | ${s.priorAsked} | ${s.closed} | ${s.closeParts.summary} | ${s.closeParts.canNow} | ${s.closeParts.next} | ${s.closeFull} |`); }
  L.push('');
  return L;
}

export default { BANDS, bandOf, TALK_BAND, matchedDrift, driftByBand, driftByThirds, lessonStats, shareByThirds, runStats, statsReport, wordCount };
