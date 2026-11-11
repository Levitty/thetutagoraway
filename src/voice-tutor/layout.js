// ============================================================================
// THE LESSON SCREEN'S ARRANGEMENT ("Across the table", chosen 12 Nov 2026):
// HOREB on one side with what it is saying in its bubble, the board between,
// the child on the other side with their own bubble and Talk. On an upright
// phone the three stack (HOREB, the board, the child); on a phone on its side
// the board sits left and HOREB above the child on the right.
//
// Pure, so the rules can be tested (tests/voice-tutor-layout.test.mjs):
//   lessonShape(w, h)        which arrangement, and the board's height in units
//   tutorBubble(live, log)   the sentence HOREB is saying (or last said), word by word
//   childBubble({...})       what the child's bubble holds: their words, or how to answer
//   partLabel(phase)         "Together, part 3 of 5"
// ============================================================================
import { PHASES } from './commands.js';
import { MAX_HEIGHT } from './snapshot.js';

export const PHASE_LABEL = { warmup: 'Warm-up', teach: 'Learn', guided: 'Together', independent: 'On your own', wrapup: 'Finish' };

// The board is 1000 units wide; its height follows the sheet's shape, never
// shorter than the wide board's rows allow, and never taller than a picture of
// the board may be (snapshot.js MAX_HEIGHT, checked again on the server).
const MIN_H = 600;
const clampH = (v) => Math.max(MIN_H, Math.min(MAX_HEIGHT, Math.round(v)));

// Room the other parts take, in CSS pixels (the sheet gets the rest).
export const SIDE_W = (w) => (w >= 1200 ? 290 : 250);   // HOREB's side and the child's side on a laptop
const GAP = 20;
const STACK_TOP = 104;      // HOREB's row on an upright phone
const STACK_BOTTOM = 196;   // the child's row: their bubble, Talk, Write and Type

/**
 * Which arrangement fits the window, and the board's height in board units.
 * Changes only when the window does (rotate, resize), never with what is said,
 * so the board never rescales in the middle of a drawing.
 * @returns {{ kind: 'table'|'stack'|'side', boardH: number }}
 */
export function lessonShape(w, h) {
  const W = Math.max(1, w); const H = Math.max(1, h);
  if (H > W) {
    const sheetW = W - GAP * 2;
    const sheetH = H - STACK_TOP - STACK_BOTTOM - GAP * 3;
    return { kind: 'stack', boardH: clampH((1000 * sheetH) / Math.max(1, sheetW)) };
  }
  if (W >= 900 && H >= 560) {
    const sheetW = W - SIDE_W(W) * 2 - GAP * 4;
    const sheetH = H - GAP * 2;
    return { kind: 'table', boardH: clampH((1000 * sheetH) / Math.max(1, sheetW)) };
  }
  // A phone on its side: the wide board, as before.
  return { kind: 'side', boardH: 640 };
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
 * The child's bubble, on their side of the table.
 *   heard: their words while they speak (Talk is on)
 *   said:  the last thing they said or showed (kept while HOREB answers it)
 *   hint:  how to answer, only when it is their turn
 * While HOREB speaks and the child has said nothing yet, the bubble is empty:
 * the Talk button already says how to stop it.
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

export default { lessonShape, tutorBubble, childBubble, partLabel, PHASE_LABEL };
