// ============================================================================
// ONE ACCENT PER SCENE (owner, 11 Nov 2026). A scene is the tutor's drawing
// between two clears. Ink stays ink; the first colour the tutor uses in the
// scene becomes its accent, and every later colour in that scene (other items,
// second bars, shading, number-line jumps, and the marks: rings, boxes, the
// highlighter, underlines, arrows) is drawn in it. A scene with no colour yet
// draws its marks in the default accent, orange. The child's ink is never
// touched (it is not a tutor stroke).
// Pure. Tested in tests/draw-engine.test.mjs.
// ============================================================================
import { PALETTE } from '../voice-tutor/commands.js';

export const DEFAULT_ACCENT = PALETTE.orange;

// The colour an item draws in when it names none (commands.js defaults); null: it has no colour of its own.
const OWN = { fraction_bar: 'blue', shape: 'orange', plot_points: 'blue', write_text: 'ink', write_math: 'ink', number_line: null };
/** The colour name an item uses, or null. */
export const itemColour = (item) => (item ? (item.colour || OWN[item.cmd] || null) : null);

/** The scene's accent (a hex colour): the first colour, in drawing order, among the tutor's items on the board. */
export function sceneAccent(board) {
  for (const id of board?.order || []) {
    const c = itemColour(board.items[id]);
    if (c && c !== 'ink' && PALETTE[c]) return PALETTE[c];
  }
  return DEFAULT_ACCENT;
}

/** The strokes with every colour that is not ink drawn in the accent. */
export const withAccent = (strokes, accent) => strokes.map((s) => (s.colour === PALETTE.ink || s.colour === accent ? s : { ...s, colour: accent }));
