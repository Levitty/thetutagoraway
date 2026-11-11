// ============================================================================
// HANDWRITING: single-line glyphs, each a list of pen strokes in the order a
// child in a Kenyan classroom is taught to form them (print script, the
// "ball and stick" letters of the lower primary handwriting books):
//   0 starts at the top and goes round anticlockwise; 1 is a small flag and
//   one stroke down; 4 is "down, across", then the stick down through it;
//   5 is "down, round, then the hat"; 9 is a ball, then its stick;
//   a, d, g, q start like c and go round, then up and down the stick;
//   b, h, k, l, p start at the top of the stick; letters with a cross (f, t)
//   cross last; i and j get their dot last.
// The box: x from 0 to w, y from 0 (top of a digit or capital) to 1 (the
// line). Small letters sit between .4 and 1; tails go down to 1.34.
// Only M L C (absolute), one pen-down per stroke: path.js reads them.
// Pure. Tested in tests/draw-engine.test.mjs (every glyph is there and reads).
// ============================================================================
const G = (w, ...strokes) => ({ w, strokes });

export const DIGITS = '0123456789';
export const SIGNS = '/+-−×÷=?().<>';
export const LOWER = 'abcdefghijklmnopqrstuvwxyz';
export const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const GLYPHS = {
  // ---------------------------------------------------------------- digits
  0: G(0.6, 'M .3 0 C .06 0 0 .3 0 .5 C 0 .74 .08 1 .3 1 C .52 1 .6 .74 .6 .5 C .6 .26 .53 0 .3 0'),
  1: G(0.46, 'M .1 .2 C .2 .14 .3 .08 .36 0 L .36 1'),
  2: G(0.6, 'M .04 .22 C .1 .02 .5 -.04 .55 .22 C .6 .44 .3 .64 .02 1 L .6 1'),
  3: G(0.6, 'M .05 .12 C .16 -.02 .52 -.04 .54 .2 C .56 .42 .32 .47 .22 .47 C .44 .47 .62 .57 .6 .76 C .57 1.03 .16 1.04 .02 .86'),
  4: G(0.64, 'M .42 0 L .02 .68 L .64 .68', 'M .46 .04 L .46 1'),
  5: G(0.6, 'M .12 0 L .08 .44 C .2 .37 .3 .35 .36 .36 C .56 .39 .62 .55 .6 .71 C .57 .92 .4 1 .26 1 C .15 1 .06 .95 0 .88', 'M .12 0 L .56 0'),
  6: G(0.6, 'M .5 .05 C .38 -.02 .1 .02 .04 .4 C -.02 .78 .1 1 .32 1 C .52 1 .6 .84 .6 .68 C .6 .5 .48 .38 .32 .38 C .16 .38 .05 .5 .03 .62'),
  7: G(0.6, 'M 0 0 L .6 0 L .2 1'),
  8: G(0.6, 'M .52 .14 C .46 .02 .14 -.02 .1 .2 C .06 .4 .54 .5 .58 .74 C .62 .96 .42 1 .3 1 C .18 1 -.02 .96 .02 .74 C .06 .5 .54 .4 .5 .2 C .48 .08 .4 0 .3 0'),
  9: G(0.6, 'M .58 .24 C .56 .08 .44 0 .3 0 C .14 0 .02 .12 .02 .27 C .02 .43 .14 .53 .3 .53 C .46 .53 .58 .42 .58 .24 L .58 1'),
  // ---------------------------------------------------------------- signs
  '/': G(0.5, 'M .48 0 L .04 1'),
  '+': G(0.6, 'M .3 .3 L .3 .9', 'M 0 .6 L .6 .6'),
  '-': G(0.56, 'M .04 .6 L .52 .6'),
  '−': G(0.56, 'M .04 .6 L .52 .6'),
  '×': G(0.56, 'M .06 .36 L .5 .84', 'M .5 .36 L .06 .84'),
  '÷': G(0.6, 'M .04 .6 L .56 .6', 'M .29 .35 L .31 .36', 'M .29 .85 L .31 .86'),
  '=': G(0.56, 'M .04 .48 L .52 .48', 'M .04 .74 L .52 .74'),
  '?': G(0.56, 'M .06 .22 C .1 .02 .5 -.04 .54 .2 C .58 .4 .3 .46 .3 .7', 'M .29 .95 L .31 .96'),
  '(': G(0.36, 'M .32 -.04 C .02 .22 .02 .8 .32 1.06'),
  ')': G(0.36, 'M .04 -.04 C .34 .22 .34 .8 .04 1.06'),
  '.': G(0.2, 'M .09 .96 L .11 .97'),
  '<': G(0.56, 'M .52 .34 L .04 .62 L .52 .9'),
  '>': G(0.56, 'M .04 .34 L .52 .62 L .04 .9'),
  // ---------------------------------------------------------------- small letters
  a: G(0.52, 'M .48 .52 C .44 .44 .36 .4 .26 .4 C .1 .4 .02 .54 .02 .7 C .02 .88 .12 1 .26 1 C .38 1 .48 .9 .48 .76 L .48 .4 L .48 1'),
  b: G(0.54, 'M .04 0 L .04 1 L .04 .7 C .06 .5 .18 .4 .3 .4 C .44 .4 .52 .54 .52 .7 C .52 .88 .42 1 .28 1 C .16 1 .07 .92 .04 .82'),
  c: G(0.5, 'M .46 .5 C .4 .42 .34 .4 .26 .4 C .1 .4 .02 .54 .02 .7 C .02 .88 .12 1 .26 1 C .34 1 .42 .96 .47 .9'),
  d: G(0.52, 'M .48 .52 C .44 .44 .36 .4 .26 .4 C .1 .4 .02 .54 .02 .7 C .02 .88 .12 1 .26 1 C .38 1 .48 .9 .48 .76 L .48 0 L .48 1'),
  e: G(0.52, 'M .04 .7 L .48 .7 C .48 .52 .38 .4 .26 .4 C .1 .4 .02 .54 .02 .7 C .02 .88 .12 1 .26 1 C .36 1 .43 .96 .48 .9'),
  f: G(0.42, 'M .4 .06 C .35 0 .29 -.01 .24 .02 C .18 .06 .17 .14 .17 .24 L .17 1', 'M .02 .42 L .36 .42'),
  g: G(0.52, 'M .48 .52 C .44 .44 .36 .4 .26 .4 C .1 .4 .02 .54 .02 .68 C .02 .84 .12 .94 .26 .94 C .38 .94 .48 .86 .48 .74 L .48 .4 L .48 1.16 C .48 1.28 .38 1.34 .26 1.34 C .16 1.34 .08 1.3 .04 1.24'),
  h: G(0.54, 'M .04 0 L .04 1 L .04 .64 C .08 .48 .18 .4 .3 .4 C .44 .4 .5 .5 .5 .64 L .5 1'),
  i: G(0.2, 'M .1 .42 L .1 1', 'M .09 .22 L .11 .23'),
  j: G(0.36, 'M .28 .42 L .28 1.16 C .28 1.3 .2 1.34 .12 1.34 C .06 1.34 .02 1.32 0 1.3', 'M .27 .22 L .29 .23'),
  k: G(0.5, 'M .04 0 L .04 1', 'M .44 .42 L .04 .74 L .48 1'),
  l: G(0.2, 'M .1 0 L .1 1'),
  m: G(0.76, 'M .04 .4 L .04 1 L .04 .6 C .08 .46 .14 .4 .22 .4 C .32 .4 .38 .48 .38 .6 L .38 1 L .38 .6 C .42 .46 .48 .4 .56 .4 C .66 .4 .72 .48 .72 .6 L .72 1'),
  n: G(0.54, 'M .04 .4 L .04 1 L .04 .62 C .08 .48 .18 .4 .3 .4 C .44 .4 .5 .5 .5 .64 L .5 1'),
  o: G(0.52, 'M .26 .4 C .1 .4 .02 .54 .02 .7 C .02 .88 .12 1 .26 1 C .42 1 .5 .88 .5 .7 C .5 .52 .42 .4 .26 .4'),
  p: G(0.54, 'M .04 .4 L .04 1.34 L .04 .7 C .06 .5 .18 .4 .3 .4 C .44 .4 .52 .54 .52 .7 C .52 .88 .42 1 .28 1 C .16 1 .07 .92 .04 .82'),
  q: G(0.52, 'M .48 .52 C .44 .44 .36 .4 .26 .4 C .1 .4 .02 .54 .02 .7 C .02 .88 .12 1 .26 1 C .38 1 .48 .9 .48 .76 L .48 .4 L .48 1.34'),
  r: G(0.44, 'M .04 .4 L .04 1 L .04 .64 C .08 .48 .18 .4 .3 .4 C .35 .4 .39 .42 .42 .44'),
  s: G(0.5, 'M .44 .48 C .4 .42 .32 .4 .24 .4 C .12 .4 .04 .46 .04 .55 C .04 .66 .16 .68 .26 .7 C .38 .72 .46 .76 .46 .86 C .46 .96 .36 1 .24 1 C .14 1 .06 .96 .02 .9'),
  t: G(0.44, 'M .18 .08 L .18 .88 C .18 .96 .24 1 .3 1 C .36 1 .4 .98 .42 .96', 'M .02 .42 L .38 .42'),
  u: G(0.54, 'M .04 .4 L .04 .76 C .04 .92 .14 1 .26 1 C .38 1 .48 .92 .5 .78 L .5 .4 L .5 1'),
  v: G(0.5, 'M .02 .4 L .25 1 L .48 .4'),
  w: G(0.72, 'M .02 .4 L .18 1 L .36 .52 L .54 1 L .7 .4'),
  x: G(0.5, 'M .04 .4 L .46 1', 'M .46 .4 L .04 1'),
  y: G(0.52, 'M .02 .4 L .26 .96', 'M .5 .4 L .2 1.2 C .16 1.3 .1 1.34 .02 1.32'),
  z: G(0.52, 'M .04 .4 L .46 .4 L .04 1 L .48 1'),
  // ---------------------------------------------------------------- capitals
  A: G(0.6, 'M .3 0 L 0 1', 'M .3 0 L .6 1', 'M .1 .66 L .5 .66'),
  B: G(0.6, 'M .04 0 L .04 1', 'M .04 0 L .3 0 C .48 0 .54 .1 .54 .24 C .54 .38 .44 .48 .3 .48 L .04 .48 L .34 .48 C .52 .48 .6 .6 .6 .74 C .6 .9 .5 1 .32 1 L .04 1'),
  C: G(0.6, 'M .56 .16 C .5 .06 .4 0 .3 0 C .12 0 .02 .2 .02 .5 C .02 .8 .12 1 .3 1 C .42 1 .52 .94 .57 .84'),
  D: G(0.62, 'M .04 0 L .04 1', 'M .04 0 L .24 0 C .48 0 .6 .2 .6 .5 C .6 .8 .48 1 .24 1 L .04 1'),
  E: G(0.56, 'M .04 0 L .04 1', 'M .04 0 L .52 0', 'M .04 .48 L .44 .48', 'M .04 1 L .54 1'),
  F: G(0.54, 'M .04 0 L .04 1', 'M .04 0 L .52 0', 'M .04 .48 L .44 .48'),
  G: G(0.62, 'M .56 .16 C .5 .06 .4 0 .3 0 C .12 0 .02 .2 .02 .5 C .02 .8 .12 1 .3 1 C .46 1 .58 .9 .58 .72 L .58 .56 L .36 .56'),
  H: G(0.6, 'M .04 0 L .04 1', 'M .56 0 L .56 1', 'M .04 .5 L .56 .5'),
  I: G(0.2, 'M .1 0 L .1 1'),
  J: G(0.52, 'M .46 0 L .46 .74 C .46 .92 .36 1 .24 1 C .12 1 .04 .92 .02 .8'),
  K: G(0.58, 'M .04 0 L .04 1', 'M .54 0 L .04 .6', 'M .2 .44 L .56 1'),
  L: G(0.52, 'M .04 0 L .04 1 L .5 1'),
  M: G(0.72, 'M .04 1 L .04 0 L .36 .7 L .68 0 L .68 1'),
  N: G(0.6, 'M .04 1 L .04 0 L .56 1 L .56 0'),
  O: G(0.64, 'M .32 0 C .1 0 .02 .24 .02 .5 C .02 .76 .1 1 .32 1 C .54 1 .62 .76 .62 .5 C .62 .24 .54 0 .32 0'),
  P: G(0.58, 'M .04 0 L .04 1', 'M .04 0 L .3 0 C .5 0 .56 .12 .56 .26 C .56 .42 .46 .52 .3 .52 L .04 .52'),
  Q: G(0.64, 'M .32 0 C .1 0 .02 .24 .02 .5 C .02 .76 .1 1 .32 1 C .54 1 .62 .76 .62 .5 C .62 .24 .54 0 .32 0', 'M .4 .74 L .62 1'),
  R: G(0.6, 'M .04 0 L .04 1', 'M .04 0 L .3 0 C .5 0 .56 .12 .56 .26 C .56 .42 .46 .52 .3 .52 L .04 .52 L .3 .52 L .56 1'),
  S: G(0.6, 'M .54 .14 C .48 .04 .38 0 .28 0 C .14 0 .04 .08 .04 .24 C .04 .4 .2 .44 .32 .48 C .46 .52 .58 .58 .58 .74 C .58 .92 .44 1 .3 1 C .16 1 .06 .94 .02 .84'),
  T: G(0.6, 'M .3 0 L .3 1', 'M 0 0 L .6 0'),
  U: G(0.6, 'M .04 0 L .04 .72 C .04 .9 .14 1 .3 1 C .46 1 .56 .9 .56 .72 L .56 0'),
  V: G(0.6, 'M 0 0 L .3 1 L .6 0'),
  W: G(0.76, 'M 0 0 L .2 1 L .38 .3 L .56 1 L .76 0'),
  X: G(0.6, 'M .02 0 L .58 1', 'M .58 0 L .02 1'),
  Y: G(0.6, 'M .02 0 L .3 .5', 'M .58 0 L .3 .5 L .3 1'),
  Z: G(0.6, 'M .04 0 L .56 0 L .04 1 L .58 1'),
};

/** The space between two glyphs, and a word space, as fractions of the glyph height. */
export const TRACK = 0.14;
export const SPACE = 0.42;

export const hasGlyph = (ch) => ch === ' ' || Object.prototype.hasOwnProperty.call(GLYPHS, ch);
/** True when every character of `text` can be handwritten. */
export const canHandwrite = (text) => [...String(text)].every(hasGlyph);

/** How wide `text` is when handwritten `h` high. */
export function handWidth(text, h) {
  let w = 0;
  [...String(text)].forEach((ch, i) => { w += (ch === ' ' ? SPACE : GLYPHS[ch].w) * h + (i ? TRACK * h : 0); });
  return w;
}

const place = (d, x, top, h) => d.replace(/(-?\.?\d+(?:\.\d+)?) (-?\.?\d+(?:\.\d+)?)/g, (_, a, b) => `${(x + parseFloat(a) * h).toFixed(1)} ${(top + parseFloat(b) * h).toFixed(1)}`);

/** One glyph's strokes, placed with its box's top-left at (x, top), `h` high. */
export const glyphAt = (ch, x, top, h) => (GLYPHS[ch]?.strokes || []).map((d) => place(d, x, top, h));

/**
 * A line of handwriting from (x, top), `h` high: [{ d, ch, word, letter }] in writing
 * order, left to right, each letter's strokes in its own order
 * (`letter` is the character's index in the text).
 */
export function handwrite(text, x, top, h) {
  const out = [];
  let cx = x; let word = 0;
  [...String(text)].forEach((ch, i) => {
    if (i) cx += TRACK * h;
    if (ch === ' ') { cx += SPACE * h; word += 1; return; }
    for (const d of glyphAt(ch, cx, top, h)) out.push({ d, ch, word, letter: i });
    cx += GLYPHS[ch].w * h;
  });
  return out;
}

export default { GLYPHS, handwrite, glyphAt, handWidth, canHandwrite, hasGlyph };
