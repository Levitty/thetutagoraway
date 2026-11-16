// ============================================================================
// THE COLOURS OF A FIGURE ON ITS LIGHT CARD
//
// The answer figures (fraction bar, hundred square, number lines, place value)
// sit on InteractiveVisual's light card. They were first drawn for a dark page,
// so an empty part was dark navy: on the light card it read as already shaded,
// and a child saw a full bar over a counter saying "Shaded: 0/7".
//
// An empty part is paper, a chosen part is filled. Every SVG figure takes its
// colours from here, and tests/figure-palette.test.mjs holds them to it.
// ============================================================================
export const FIGURE = {
  card: '#f4f4f6',       // InteractiveVisual's card
  empty: '#ffffff',      // a part not chosen yet
  filled: '#16a34a',     // a part the child has chosen
  outline: '#475569',    // the edge of every part, and number lines
  label: '#334155',      // words and numbers drawn on the card
  emphasis: '#e9d5ff',   // the one part being pointed at
  mark: '#1d4ed8',       // a marker the question places (the "start" of a jump)
};
