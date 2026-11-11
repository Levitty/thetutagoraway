// ============================================================================
// THE DRAWING ENGINE (rendering engine phase 1, agreed 11 Nov 2026): the live
// tutor's board drawn stroke by stroke, the way a teacher draws, with the
// felt-marker pen of the approved study (Build/render-engine/phase0/study.html).
//
//   strokes.js   each board item and mark as ordered strokes
//   timing.js    each stroke's time, in order, from the item's start
//   glyphs.js    single-line handwriting: digits, signs, letters
//   print.js     Figtree print for longer text, placed without measuring
//   geometry.js  the slots and each item's frame (shared with marks)
//   path.js      reading and measuring a stroke once
//   accent.js    one accent per scene: ink, plus the scene's one colour
// Board.jsx draws through it; timeline.js takes its times (drawDuration).
// ============================================================================
import { DRAWN } from '../voice-tutor/commands.js';
import { itemStrokes } from './strokes.js';
import { naturalMs } from './timing.js';
import { drawMs } from '../voice-tutor/timeline.js';
import { BOARD_H } from './geometry.js';

/** How long a step draws for on a board H high: a drawn item by its strokes; anything else as the timeline says. */
export const drawDuration = (step, H = BOARD_H) => (DRAWN.includes(step.cmd) ? Math.round(naturalMs(itemStrokes(step, H), { pace: step.pace })) : drawMs(step));

export { itemStrokes, markStrokes, strokesBox, PEN } from './strokes.js';
export { strokeTimes, progress, ease } from './timing.js';
export { sceneAccent, withAccent, itemColour, DEFAULT_ACCENT } from './accent.js';
