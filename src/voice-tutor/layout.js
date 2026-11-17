// ============================================================================
// THE LESSON ROOM (owner, 12 Nov 2026: "go, build it with leave at top and dotted
// paper"): a lesson with HOREB happens in the same room as a lesson with a human
// tutor (src/VideoRoom.jsx). The board in the middle on the human room's dotted
// page; HOREB's tile, the child's tile and "What we said" on the right; the dock
// underneath. A phone rearranges the same room: the side column goes, the two
// round faces sit in the board's corner and HOREB's sentence is a bubble over them.
//
// Pure, so the rules can be tested (tests/voice-tutor-layout.test.mjs):
//   roomShape(w, h)          wide (the side column) or not, and the board's height in units
//   tutorBubble(live, log)   the sentence HOREB is saying (or last said), word by word
//   childBubble({...})       what the child's tile holds: their words, or how to answer
//   partLabel(phase)         "Together, part 3 of 5"
// ============================================================================
import { PHASES } from './commands.js';

export const PHASE_LABEL = { warmup: 'Warm-up', teach: 'Learn', guided: 'Together', independent: 'On your own', wrapup: 'Finish' };

// The board is a square page, 1000 by 1000 units, on every screen (as the human room's
// whiteboard): HOREB's drawing lands in the same place on a laptop and on a phone, and the
// board never rescales in the middle of a drawing.
export const BOARD_SQUARE = 1000;

// The side column's width: 340 on a laptop (as the human room), narrower on a phone on its side.
export const SIDE_W = (w) => (w >= 1024 ? 340 : 260);

/**
 * The room's arrangement. Wide: the board with the side column beside it (a laptop, a
 * tablet on its side, a phone on its side in miniature). Otherwise the phone arrangement.
 * @returns {{ wide: boolean, side: number, boardH: number }}
 */
export function roomShape(w, h) {
  const W = Math.max(1, w); const H = Math.max(1, h);
  const wide = W >= 1024 || (W > H && W >= 640);
  return { wide, side: wide ? SIDE_W(W) : 0, boardH: BOARD_SQUARE };
}

const words = (text) => String(text || '').split(/\s+/).filter(Boolean);

/**
 * HOREB's bubble: one sentence, the one being said (revealed word by word as it
 * is heard), with the sentence before it in the same turn above it, quieter.
 * Between turns, the last thing HOREB said. A child does not read a log.
 * @param {{sentences:{text:string,words:{word:string}[]}[], words:number[]}|null} live
 * @param {{who:string,text:string,turn?:number,cut?:boolean}[]} transcript
 * @returns {{ before: string|null, words: string[], shown: number }|null}
 */
export function tutorBubble(live, transcript = []) {
  if (live && Array.isArray(live.sentences)) {
    let k = -1;
    live.words.forEach((n, i) => { if (n > 0) k = i; });
    if (k >= 0) {
      const s = live.sentences[k];
      return { before: k > 0 ? live.sentences[k - 1].text : null, words: s.words.map((x) => x.word), shown: live.words[k] };
    }
  }
  const tutor = transcript.filter((x) => x.who === 'tutor');
  const last = tutor[tutor.length - 1];
  if (!last) return null;
  const prev = tutor[tutor.length - 2];
  // The line before counts only if nothing the child said came between.
  const between = prev ? transcript.slice(transcript.lastIndexOf(prev) + 1, transcript.lastIndexOf(last)).some((x) => x.who !== 'tutor') : true;
  const w = words(last.text);
  return { before: prev && !between && prev.turn === last.turn ? prev.text : null, words: w, shown: w.length };
}

/**
 * What the child's tile holds (on a phone, the line beside the faces).
 *   heard: their words while they speak (the microphone is on all lesson)
 *   said:  the last thing they said or showed (kept while HOREB answers it)
 *   hint:  how to answer, only when it is their turn
 * While HOREB speaks and the child has said nothing yet, the bubble is empty:
 * the microphone button already shows it is on.
 */
export function childBubble({ transcript = [], ask = null, listening = false, partial = '', status = 'ready', canTalk = true }) {
  if (listening) return { kind: 'heard', text: partial || 'Listening...' };
  const last = transcript[transcript.length - 1];
  if (last && last.who === 'child') return { kind: 'said', text: last.text, snap: !!last.snap };
  if (status === 'ended' || status === 'ready') return null;
  if (status === 'listening') {
    if (ask?.form === 'choice') return { kind: 'hint', text: 'Choose your answer, or say it.' };
    return { kind: 'hint', text: canTalk ? 'Say your answer, or write it on the board.' : 'Type your answer, or write it on the board.' };
  }
  const theirs = [...transcript].reverse().find((x) => x.who === 'child');
  return theirs ? { kind: 'said', text: theirs.text, snap: !!theirs.snap } : null;
}

/** "Together, part 3 of 5", or null before the lesson starts. */
export function partLabel(phase) {
  const at = PHASES.indexOf(phase);
  if (at < 0) return null;
  return `${PHASE_LABEL[phase] || phase}, part ${at + 1} of ${PHASES.length}`;
}

export default { roomShape, tutorBubble, childBubble, partLabel, PHASE_LABEL, BOARD_SQUARE };
