// ============================================================================
// ANSWER CHECKING — tolerant grading of a student's typed answer.
//
// Factored out of AIMastery.jsx so it can be unit-tested directly (see the
// generator regression test). Handles the answer forms our generators emit:
// integers, decimals (graded at the key's precision), fractions, mixed
// numbers, percentages, unit-suffixed quantities, coordinates, and exact
// string/algebra matches.
// ============================================================================

export function normalizeMath(str) {
  let s = str.toString().trim().toLowerCase();
  s = s.replace(/[−–—]/g, '-');          // unicode minus/dash → hyphen
  s = s.replace(/\s+/g, '');             // drop spaces
  s = s.replace(/(\d),(\d{3})/g, '$1$2'); // 1,200 → 1200 (keep value commas)
  s = s.replace(/\(([a-z])\)/g, '$1');   // (x) → x
  s = s.replace(/(\d)[*×·]([a-z])/g, '$1$2'); // 2*x → 2x
  s = s.replace(/(\d)[*×·]\(/g, '$1(');  // 2*(3) → 2(3)
  return s;
}

// Common unit suffixes students append that shouldn't affect a numeric answer.
const UNIT_SUFFIX = /(cm²|cm³|m²|m³|cm2|cm3|m2|m3|cm|mm|km|kg|ml|°|deg|degrees|units?|sq|squareunits?|%|m|l|g)+$/;

// Parse an answer string into ONE number when it represents a single pure
// quantity; otherwise null (so "A=2, B=1", "(2,5)", "x=3y" fall through to
// string matching).
export function mathValue(raw) {
  let s = raw.toString().trim().toLowerCase().replace(/[−–—]/g, '-').replace(/,/g, '');
  // Mixed number "1 1/6" → 1 + 1/6  (BEFORE collapsing whitespace)
  const mixed = s.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const whole = parseInt(mixed[1]);
    const num = parseInt(mixed[2]) / parseInt(mixed[3]);
    return whole < 0 ? whole - num : whole + num;
  }
  s = s.replace(/\s+/g, '').replace(/^=+/, '');
  const frac = s.match(/^(-?\d+)\/(-?\d+)$/);
  if (frac) {
    const d = parseInt(frac[2]);
    return d === 0 ? null : parseInt(frac[1]) / d;
  }
  const pct = s.match(/^(-?\d*\.?\d+)%$/);
  if (pct) return parseFloat(pct[1]);
  const stripped = s.replace(UNIT_SUFFIX, '');
  if (/^-?\d*\.?\d+$/.test(stripped)) return parseFloat(stripped);
  return null;
}

// Decimal places shown in a numeric string (to grade at the key's precision).
export function decimalsOf(raw) {
  const m = raw.toString().match(/\.(\d+)/);
  return m ? m[1].length : 0;
}

// Two numbers match if equal at the precision the KEY was written to. A rounded
// key "12.3" accepts 12.33; an integer key "150" stays tight (rejects 150.4).
export function numbersMatch(userVal, acceptRaw, acceptVal) {
  const dec = decimalsOf(acceptRaw);
  if (dec === 0) return Math.abs(userVal - acceptVal) < 0.01;
  const tol = 0.5 * Math.pow(10, -dec) + 1e-9; // half a unit in the last shown place
  return Math.abs(userVal - acceptVal) <= tol;
}

export function checkAnswerMatch(userAnswer, problem) {
  const normalizedUser = normalizeMath(userAnswer);
  const accepts = problem.accepts || [problem.answer];

  // 1) Exact match after normalization (handles "x=-3", algebra, words).
  if (accepts.some(a => normalizedUser === normalizeMath(a))) return true;

  // 2) Single-number match by value, graded at the key's displayed precision —
  //    covers integers, decimals, fractions, mixed numbers, %, and units.
  const userVal = mathValue(userAnswer);
  if (userVal != null) {
    if (accepts.some(a => {
      const aVal = mathValue(a);
      return aVal != null && numbersMatch(userVal, a, aVal);
    })) return true;
  }

  // 3) Coordinate answers: normalize (x,y) format.
  const coordUser = normalizedUser.replace(/[()]/g, '');
  if (accepts.some(a => normalizeMath(a).replace(/[()]/g, '') === coordUser)) return true;

  return false;
}

export default checkAnswerMatch;
