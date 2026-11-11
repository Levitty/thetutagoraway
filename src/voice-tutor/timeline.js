// ============================================================================
// THE TIMELINE: the tutor's words and the board move together, like a teacher
// showing something as she says it.
//
// One tutor turn becomes one timeline. Each `say` is spoken as its own piece,
// and the speech clock is the master: every drawing step is tied to a word of
// the sentence it belongs to (`on`), and starts as that word is spoken, plus
// its `delay_ms`.
//
//   speakingTimes(text)          estimated word times at a child's listening
//                                pace. Milestone 1 has no audio, so this IS the
//                                speech: the transcript strip reveals each word
//                                at its time. In milestone 3 the speech service
//                                returns real word times in the same shape
//                                ({ word, start, end } in ms from the start of
//                                the sentence) and nothing below changes.
//   buildTimeline(steps, { speech, drawMs })  every step's start time and how
//                                long it draws for; a drawing is squeezed so it
//                                never runs past the next step's word
//   createPlayer / advance / interrupt   playing it, and stopping it when the
//                                child speaks: steps already due are drawn at
//                                once, the rest are dropped, and the tutor is
//                                told exactly what the child heard.
//
// Which sentence a step belongs to: the `say` before it in the list (the
// usual form: say, then the strokes for that sentence). A step before any
// `say` belongs to the first one. A step with no `on` starts when the sentence
// before it has been said. An `on` phrase that is not in the sentence starts
// the step at the beginning of the sentence (and is logged).
//
// STREAMING (milestones 3 and 3b): the voice starts on its first audio chunk, so word
// times arrive while the tutor is already speaking. `speech(text, k)` may then
// return a sentence that is not complete yet ({ words so far, duration: null,
// complete: false }). A stroke whose word has not arrived yet waits (its time
// is Infinity) and never fires early; rebuild the timeline as words arrive and
// hand it to the player with updateTimeline (what has fired stays fired). In
// 3b the steps themselves stream in too: rebuild with the longer list, and a
// sentence the voice has not started yet ({ start: null }) waits likewise.
//
// Pure: the clock is passed in. Tested in tests/voice-tutor-timeline.test.mjs.
// ============================================================================
import { SILENT, DRAWN, MARKS } from './commands.js';

export const WPM = 150;            // unhurried, for a ten year old listening in English
export const SENTENCE_GAP_MS = 350; // between two `say` pieces
const PAUSE = { ',': 160, ';': 200, ':': 200, '.': 320, '?': 320, '!': 320 };

// How long each step takes to draw. The board passes the drawing engine's own
// times (src/draw/index.js drawDuration: each stroke by its length and kind,
// the pen lifting between them, 1.6 times longer at pace 'slow'); this plain
// estimate is only for callers without a board (the server, tests).
// A mark is drawn in its own fixed time; erase and clear are a quick eraser pass.
export const DRAW_MS = {
  write_text: 1200, write_math: 1600, fraction_bar: 3000, number_line: 3000, shape: 3000, plot_points: 3000,
  highlight: 600, underline: 450, point: 450, erase: 350, clear: 350,
};
export const drawMs = (step) => Math.round((DRAW_MS[step.cmd] || 0) * (DRAWN.includes(step.cmd) && step.pace === 'slow' ? 1.6 : 1));

const normWord = (w) => String(w).toLowerCase().replace(/[^a-z0-9/]/g, '');

/**
 * Estimated word times for one sentence. Longer words take longer; a comma or
 * full stop adds a short pause after its word.
 * @returns {{ words: {word:string,start:number,end:number}[], duration:number }}
 */
export function speakingTimes(text, { wpm = WPM } = {}) {
  const base = 60000 / wpm;
  const words = [];
  let t = 0;
  for (const word of String(text).split(/\s+/).filter(Boolean)) {
    const letters = word.replace(/[^A-Za-z0-9]/g, '').length || 1;
    const len = base * (0.55 + 0.45 * Math.min(letters, 12) / 5);
    words.push({ word, start: Math.round(t), end: Math.round(t + len) });
    t += len + (PAUSE[word.slice(-1)] || 0);
  }
  return { words, duration: Math.round(t) };
}

/** The start (ms in the sentence) of the first occurrence of `phrase`, or null. */
export function findAnchor(words, phrase) {
  const want = String(phrase || '').split(/\s+/).map(normWord).filter(Boolean);
  if (!want.length) return null;
  const have = words.map((w) => normWord(w.word));
  for (let i = 0; i + want.length <= have.length; i += 1) {
    if (want.every((w, k) => have[i + k] === w)) return { index: i, start: words[i].start };
  }
  return null;
}

/**
 * Every step's start time, in ms from the start of the turn.
 * `speech(text)` gives word times for a sentence (speakingTimes in milestone 1).
 * @returns {{ duration:number, sentences:{ step:number, text:string, start:number, words:{word,start,end}[] }[],
 *            events:{ i:number, t:number, cmd:string, dur:number, silent:boolean, anchor:'word'|'sentence'|'after'|'missed'|null }[] }}
 */
export function buildTimeline(steps, { speech = speakingTimes, drawMs: timeOf = drawMs } = {}) {
  // Lay the sentences out first. A sentence whose length is not known yet makes
  // every later one unknown too (Infinity), until its audio is complete.
  const sentences = [];
  let cursor = 0;
  let k = 0;
  steps.forEach((s, i) => {
    if (s.cmd !== 'say') return;
    const sp = speech(s.text, k++);
    // A voice that reports when each sentence really starts (streaming: a sentence may
    // arrive after the one before has finished) is taken at its word; otherwise each
    // sentence follows the one before after the gap.
    let start;
    if ('start' in sp) start = sp.start == null ? Infinity : sp.start;
    else start = sentences.length ? cursor + SENTENCE_GAP_MS : cursor;
    const complete = sp.complete !== false && sp.duration != null;
    const end = complete && Number.isFinite(start) ? start + sp.duration : Infinity;
    sentences.push({ step: i, text: s.text, start, end, complete, words: (sp.words || []).map((w) => ({ ...w, start: w.start + start, end: w.end + start })) });
    cursor = end;
  });
  const speechEnd = cursor;
  const owner = (i) => {
    let own = null;
    for (const s of sentences) if (s.step < i) own = s;
    return own || sentences[0] || null;
  };
  const events = [];
  let drawEnd = 0;
  steps.forEach((s, i) => {
    if (s.cmd === 'say') return;
    if (SILENT.includes(s.cmd)) { events.push({ i, t: 0, cmd: s.cmd, dur: 0, silent: true, anchor: null }); return; }
    if (['ask', 'pause_for_child', 'end_session'].includes(s.cmd)) return; // placed below, after everything
    const sen = owner(i);
    let t = 0;
    let anchor = 'after';
    if (sen && s.on) {
      const local = sen.words.map((w) => ({ word: w.word, start: w.start }));
      const hit = findAnchor(local, s.on);
      if (hit) { t = hit.start; anchor = 'word'; } else if (sen.complete) { t = sen.start; anchor = 'missed'; } else { t = Infinity; anchor = 'pending'; }
    } else if (sen) {
      // No word: after the sentence before it; before any sentence: with the first one.
      t = sen.step < i ? sen.end : sen.start;
      anchor = sen.step < i ? 'after' : 'sentence';
    }
    t = Number.isFinite(t) ? Math.max(0, t + (s.delay_ms || 0)) : Infinity;
    const dur = timeOf(s);
    events.push({ i, t, cmd: s.cmd, dur, natural: dur, silent: false, anchor });
  });
  // A drawing never runs past the next step's word: it is drawn quicker to end by then.
  for (const e of events) {
    if (e.silent || !Number.isFinite(e.t) || !(DRAWN.includes(e.cmd) || MARKS.includes(e.cmd))) continue;
    let next = Infinity;
    for (const f of events) if (f.i > e.i && !f.silent && f.t > e.t && f.t < next) next = f.t;
    if (next - e.t < e.dur) { e.dur = Math.round(next - e.t); e.squeezed = true; }
  }
  for (const e of events) if (!e.silent) drawEnd = Math.max(drawEnd, e.t + e.dur);
  const end = Math.max(speechEnd, drawEnd);
  steps.forEach((s, i) => {
    if (['ask', 'pause_for_child', 'end_session'].includes(s.cmd)) events.push({ i, t: end, cmd: s.cmd, dur: 0, silent: false, anchor: null });
  });
  events.sort((a, b) => a.t - b.t || a.i - b.i);
  return { duration: end, sentences, events };
}

/** Swap in a timeline rebuilt with more word times; steps already fired stay fired. */
export const updateTimeline = (player, timeline) => { if (!player.stopped) player.timeline = timeline; return player; };

// ---------------------------------------------------------------- playing it
/** A player for one timeline, started at `startedAt` (the speech clock's time). */
export const createPlayer = (timeline, startedAt = 0) => ({
  timeline, startedAt, fired: new Set(), stopped: false, interruptedAt: null,
});

/** The words spoken by time `t` (ms on the turn's clock), as [sentenceIndex, wordCount]. */
export function wordsSpoken(timeline, t) {
  return timeline.sentences.map((s) => s.words.filter((w) => w.start <= t).length);
}

/**
 * Steps due by `now` that have not fired yet, in order. Marks them fired.
 * @returns {{ due: object[], words: number[], done: boolean }}
 */
export function advance(player, now) {
  const t = now - player.startedAt;
  if (player.stopped) return { due: [], words: player.heardWords || wordsSpoken(player.timeline, t), done: true };
  const due = player.timeline.events.filter((e) => !player.fired.has(e.i) && e.t <= t);
  for (const e of due) player.fired.add(e.i);
  return { due, words: wordsSpoken(player.timeline, t), done: player.fired.size === player.timeline.events.length };
}

/**
 * The child spoke (or typed) over the tutor. Steps already due fire at once
 * (and draw at once), silent steps are kept, everything later is dropped.
 * `heard` is what the child actually heard, for the model's next turn.
 * @returns {{ due: object[], dropped: object[], heard: string, words: number[] }}
 */
export function interrupt(player, now) {
  const t = now - player.startedAt;
  const left = player.timeline.events.filter((e) => !player.fired.has(e.i));
  const due = left.filter((e) => e.t <= t || e.silent);
  const dropped = left.filter((e) => !(e.t <= t || e.silent));
  for (const e of left) player.fired.add(e.i);
  const words = wordsSpoken(player.timeline, t);
  player.stopped = true; player.interruptedAt = t; player.heardWords = words;
  const heard = player.timeline.sentences.map((s, k) => s.words.slice(0, words[k]).map((w) => w.word).join(' ')).filter(Boolean).join(' ');
  const finished = player.timeline.sentences.every((s, k) => words[k] === s.words.length);
  return { due, dropped, heard, words, finished };
}

export default { speakingTimes, findAnchor, buildTimeline, createPlayer, advance, interrupt, wordsSpoken, drawMs };
