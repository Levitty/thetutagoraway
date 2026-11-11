// ============================================================================
// PRINT: longer text is written in Figtree, word by word, each word revealed
// left to right as the pen moves along it. To place each word without
// measuring on the page, the advance widths of Figtree (weight 650, the
// board's text weight) are kept here, in thousandths of the font size.
// Measured in the browser from @fontsource-variable/figtree (latin) at 650, 11 Nov 2026.
// ============================================================================
export const PRINT_FONT = '"Figtree Variable", Figtree, -apple-system, "Segoe UI", Roboto, sans-serif';
export const PRINT_WEIGHT = 650;
const W = {"0": 647, "1": 420, "2": 575, "3": 553, "4": 631, "5": 580, "6": 577, "7": 552, "8": 612, "9": 577, " ": 240, "!": 310, "\"": 394, "%": 807, "'": 236, "(": 376, ")": 376, ",": 251, "-": 410, ".": 240, "/": 423, ":": 292, ";": 296, "<": 630, "=": 630, ">": 630, "?": 511, "A": 707, "B": 612, "C": 724, "D": 697, "E": 589, "F": 552, "G": 746, "H": 750, "I": 285, "J": 545, "K": 655, "L": 534, "M": 855, "N": 773, "O": 785, "P": 598, "Q": 787, "R": 641, "S": 608, "T": 578, "U": 704, "V": 717, "W": 980, "X": 666, "Y": 638, "Z": 634, "_": 435, "a": 528, "b": 594, "c": 545, "d": 593, "e": 552, "f": 388, "g": 598, "h": 567, "i": 256, "j": 286, "k": 527, "l": 241, "m": 868, "n": 566, "o": 581, "p": 599, "q": 589, "r": 371, "s": 466, "t": 397, "u": 566, "v": 549, "w": 825, "x": 524, "y": 566, "z": 480, "×": 630, "÷": 630, "−": 630, "+": 630};
const DEFAULT = 560;

export const charWidth = (ch, fs) => ((W[ch] ?? DEFAULT) / 1000) * fs;
export const printWidth = (text, fs) => [...String(text)].reduce((s, ch) => s + charWidth(ch, fs), 0);

/** The words of `text` with where each starts and ends, from x: [{ text, x0, x1 }]. */
export function printWords(text, x, fs) {
  const out = [];
  let cx = x;
  for (const part of String(text).split(/( +)/)) {
    if (!part) continue;
    const w = printWidth(part, fs);
    if (!/^ +$/.test(part)) out.push({ text: part, x0: cx, x1: cx + w });
    cx += w;
  }
  return out;
}
