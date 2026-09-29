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
  // Kid-typed decorations (before spaces collapse, so word boundaries work):
  s = s.replace(/^(ksh|kes|sh|shs)\.?\s+/, '');   // currency prefix
  s = s.replace(/\/[=-]\s*$/, '');                 // Kenyan "4500/=" or "/-"
  s = s.replace(/\bremainder\b/g, 'r');            // "5 remainder 2" → "5 r 2"
  s = s.replace(/\.\s*$/, '');                     // trailing full stop
  s = s.replace(/\s+/g, '');             // drop spaces
  s = s.replace(/(\d),(\d{3})/g, '$1$2'); // 1,200 → 1200 (keep value commas)
  s = s.replace(/\(([a-z])\)/g, '$1');   // (x) → x
  s = s.replace(/(\d)[*×·]([a-z])/g, '$1$2'); // 2*x → 2x
  s = s.replace(/(\d)[*×·]\(/g, '$1(');  // 2*(3) → 2(3)
  return s;
}

// Common unit suffixes students append that shouldn't affect a numeric answer.
const UNIT_SUFFIX = /(cm²|cm³|m²|m³|cm2|cm3|m2|m3|cm|mm|km|kg|ml|°|deg|degrees|units?|sq|squareunits?|%|m|l|g)+$/;
// Keys never end in a bare m / l / g (checked by scripts/audit-answers.mjs), so
// a key like "3m" is algebra, not 3 metres.
const KEY_UNIT_SUFFIX = /(cm²|cm³|m²|m³|cm2|cm3|m2|m3|cm|mm|km|kg|ml|°|deg|degrees|units?|sq|squareunits?|%)+$/;

// Words and units children type after a correct number ("40 percent",
// "8600 shillings", "3 hrs", "12 sq cm"). Only ever stripped from what the
// CHILD typed, never from a key, so an algebra key like "3m" keeps its letter.
const CHILD_UNIT_WORDS = /(percent(age)?|per cent|shillings?|shs?|bob|hours?|hrs?|minutes?|mins?|seconds?|secs?|years?|yrs?|days?|weeks?|months?|km\/h|kmh|kph|m\/s|litres?|liters?|millilit(re|er)s?|kilograms?|grams?|kilomet(re|er)s?|centimet(re|er)s?|millimet(re|er)s?|met(re|er)s?|sq\.?(cm|m|km|mm|units?)|square(cm|m|km|mm|units?|centimet(re|er)s?|met(re|er)s?)|(cm|m|km|mm)sq|cubic(cm|m)|cc|people|pupils|children|students|marks|goats|cows|books|pencils|sweets|apples|oranges|mangoes|eggs|items|pieces|boxes|bags|trees|cars|buses|days)$/;

// Parse an answer string into ONE number when it represents a single pure
// quantity; otherwise null (so "A=2, B=1", "(2,5)", "x=3y" fall through to
// string matching). `child` also strips the unit words a child might add.
export function mathValue(raw, child = false) {
  let s = raw.toString().trim().toLowerCase().replace(/[−–—]/g, '-').replace(/,/g, '');
  // Kid-typed decorations that shouldn't change a numeric answer:
  s = s.replace(/^(ksh|kes|sh|shs)\.?\s*/, '');   // currency prefix: "KSh 4500"
  s = s.replace(/\/[=-]$/, '');                    // Kenyan shilling suffix: "4500/=" or "4500/-"
  s = s.replace(/^[a-z]\s*=\s*/, '');              // "x = 5" on a Find-x question
  s = s.replace(/\.$/, '');                        // trailing full stop: "45."
  s = s.replace(/\bremainder\b/, 'r');             // "5 remainder 2" → "5 r 2"
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
  if (child) s = s.replace(CHILD_UNIT_WORDS, '').replace(/\/[=-]$/, '');
  const pct = s.match(/^(-?\d*\.?\d+)%$/);
  if (pct) return parseFloat(pct[1]);
  const stripped = s.replace(child ? UNIT_SUFFIX : KEY_UNIT_SUFFIX, '');
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

  // 2) Single-number match by value — covers integers, decimals, fractions,
  //    mixed numbers, %, and units. A typed DECIMAL is graded at the key's
  //    displayed precision (3.14159 for a key of 3.14). A typed fraction, mixed
  //    number or whole number is exact, so a wrong 1/20 can't pass for a key
  //    shown as 0.1.
  const userVal = mathValue(userAnswer, true);
  if (userVal != null) {
    const typedDecimal = /\d*\.\d/.test(userAnswer.toString());
    if (accepts.some(a => {
      const aVal = mathValue(a);
      if (aVal == null) return false;
      return typedDecimal ? numbersMatch(userVal, a, aVal) : Math.abs(userVal - aVal) <= 1e-9 * Math.max(1, Math.abs(aVal));
    })) return true;
  }

  // 3) Coordinate answers: normalize (x,y) format.
  const coordUser = normalizedUser.replace(/[()]/g, '');
  if (accepts.some(a => normalizeMath(a).replace(/[()]/g, '') === coordUser)) return true;

  return false;
}

export default checkAnswerMatch;
