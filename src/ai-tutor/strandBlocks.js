// ============================================================================
// STRAND COLOURS — one palette, both sides of the product.
//
// Colour is how a child tells one strand from another at a glance, faster than
// reading five labels, so each gets a fixed one from the HOREB palette (see
// horeb-look.css) and keeps it everywhere. `meta` is the small line inside the
// block and has to clear contrast against its own background, which is why it
// is set per colour rather than inherited.
//
// Shared because the teacher's board uses the same colours as the learner's:
// a teacher looking at "Numbers" should see the yellow the child sees.
// ============================================================================
export const STRAND_BLOCK = {
  Numbers:         { bg: '#FFC93C', ink: '#16161A', meta: '#6B5309' },
  Measurements:    { bg: '#FF4F91', ink: '#16161A', meta: '#7A1538' },
  Geometry:        { bg: '#6C4BF4', ink: '#FFFFFF', meta: '#DCD3FF' },
  Statistics:      { bg: '#9BE3C4', ink: '#16161A', meta: '#2A6B52' },
  'Data Handling': { bg: '#9BE3C4', ink: '#16161A', meta: '#2A6B52' },
  Algebra:         { bg: '#16161A', ink: '#FFFFFF', meta: '#A9A9B4' },
  // Any strand a curriculum adds later still gets a readable block.
  _:               { bg: '#D7D7DE', ink: '#16161A', meta: '#5C5C66' },
};
export const strandBlock = (name) => STRAND_BLOCK[name] || STRAND_BLOCK._;
export default STRAND_BLOCK;
