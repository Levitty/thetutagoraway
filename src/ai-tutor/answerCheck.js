// ============================================================================
// ANSWER CHECKING — tolerant grading of a student's typed answer.
//
// Factored out of AIMastery.jsx so it can be unit-tested directly (see the
// generator regression test). Handles the answer forms our generators emit:
// integers, decimals (graded at the key's precision), fractions, mixed
// numbers, percentages, unit-suffixed quantities, coordinates, and exact
// string/algebra matches.
// ============================================================================

import { algebraicallyEqual } from './algebraEquivalence.js';

export function normalizeMath(str) {
  let s = str.toString().trim().toLowerCase();
  s = s.replace(/[−–—]/g, '-');          // unicode minus/dash → hyphen
  // Superscript powers the way phones type them: x² → x^2, x¹⁰ → x^10.
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => '^' + [...m].map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c)).join(''));
  s = s.replace(/\*\*/g, '^');           // x**2 → x^2
  // Kid-typed decorations (before spaces collapse, so word boundaries work):
  s = s.replace(/^(ksh|kes|sh|shs)\.?\s+/, '');   // currency prefix
  s = s.replace(/\/[=-]\s*$/, '');                 // Kenyan "4500/=" or "/-"
  s = s.replace(/\bremainder\b/g, 'r');            // "5 remainder 2" → "5 r 2"
  s = s.replace(/\.\s*$/, '');                     // trailing full stop
  // A mixed number's space is the only thing separating it from a different
  // number, so it becomes an explicit plus BEFORE spaces are dropped. Without
  // this, "3 1/4" and "31/4" both collapse to "31/4" and the literal match
  // below marks 31/4 (7.75) correct for an answer of 3 1/4 (3.25). Nothing
  // shipped had a mixed-number answer, so this never bit until Grade 7
  // fractions got one.
  s = s.replace(/^(-?\d+)\s+(\d+\/\d+)$/, '$1+$2');
  s = s.replace(/\s+/g, '');             // drop spaces
  // Phone keyboards have no √ or π, so a child who knows the answer is 2√5 has
  // no way to type it. Accept the words instead. Both sides are normalised, so
  // authored answers written with the glyphs still match. Ported from the
  // content branch, where live testing turned it up: "they can't find symbols
  // like the square root one". Powers are left alone — the superscript rule
  // above already folds x² and x^2 together, in the other direction.
  s = s.replace(/cuberoot(of)?/g, '∛');
  s = s.replace(/(squareroot(of)?|sqrt|root)/g, '√');
  s = s.replace(/√\((\d+)\)/g, '√$1');          // sqrt(5) → √5
  s = s.replace(/(^|\d)pi(?![a-z])/g, '$1π');   // 2pi → 2π
  while (/(\d),(\d{3})(?!\d)/.test(s)) s = s.replace(/(\d),(\d{3})(?!\d)/, '$1$2'); // 1,200 and 8,200,000 (keep value commas)
  s = s.replace(/\(([a-z])\)/g, '$1');   // (x) → x
  s = s.replace(/(\d)[*×·]([a-z])/g, '$1$2'); // 2*x → 2x
  s = s.replace(/(\d)[*×·]\(/g, '$1(');  // 2*(3) → 2(3)
  return s;
}

// Two-unit quantities the way children write them: "4 hrs 21 mins",
// "8 kilograms 695 grams", "9 metres and 28 cm". Read as { family, small },
// the whole amount in the smaller unit. The small part must be less than one
// big unit, so "3 h 81 min" is not taken for 4 h 21 min. Null if not one.
const COMPOUND_UNITS = [
  { family: 'time', big: /^(h|hr|hrs|hour|hours)$/, small: /^(min|mins|minute|minutes)$/, per: 60 },
  { family: 'mass', big: /^(kg|kgs|kilogram|kilograms|kilogramme|kilogrammes)$/, small: /^(g|gm|gms|gram|grams|gramme|grammes)$/, per: 1000 },
  { family: 'length', big: /^(m|metre|metres|meter|meters)$/, small: /^(cm|cms|centimetre|centimetres|centimeter|centimeters)$/, per: 100 },
  { family: 'capacity', big: /^(l|ltr|ltrs|litre|litres|liter|liters)$/, small: /^(ml|mls|millilitre|millilitres|milliliter|milliliters)$/, per: 1000 },
];
export function compoundValue(raw) {
  const m = raw.toString().trim().toLowerCase().replace(/\.$/, '')
    .match(/^(\d+)\s*([a-z]+)\.?\s*(?:,|and|&)?\s*(\d+)\s*([a-z]+)\.?$/);
  if (!m) return null;
  const big = Number(m[1]), small = Number(m[3]);
  const u = COMPOUND_UNITS.find(f => f.big.test(m[2]) && f.small.test(m[4]));
  if (!u || small >= u.per) return null;
  return { family: u.family, small: big * u.per + small };
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

// ---- Units: what one is, however a child writes it ----
// readUnit("square centimetres") and readUnit("cm^2") are both { family: 'area',
// unit: 'cm2' }. Null for anything that is not a clear unit ("goats", "pieces").
const LENGTH_NAMES = { mm: 'mm|millimet(?:re|er)s?', cm: 'cms?|centimet(?:re|er)s?', m: 'm|mtrs?|met(?:re|er)s?', km: 'kms?|kilomet(?:re|er)s?' };
const SIMPLE_UNITS = [
  ['capacity', 'ml', /^(ml|mls|millilit(re|er)s?)$/], ['capacity', 'l', /^(l|ltrs?|lit(re|er)s?)$/],
  ['mass', 'mg', /^(mg|milligrams?)$/], ['mass', 'g', /^(g|gms?|grams?|grammes?)$/],
  ['mass', 'kg', /^(kgs?|kilos?|kilograms?|kilogrammes?)$/], ['mass', 't', /^(t|tonnes?|tons?)$/],
  ['time', 's', /^(s|secs?|seconds?)$/], ['time', 'min', /^(mins?|minutes?)$/], ['time', 'h', /^(h|hrs?|hours?)$/],
  ['time', 'day', /^days?$/], ['time', 'week', /^(wks?|weeks?)$/], ['time', 'month', /^months?$/], ['time', 'year', /^(yrs?|years?)$/],
  ['money', 'sh', /^(ksh|kes|shs?|shillings?|bob)$/],
  ['angle', 'deg', /^(°|degs?|degrees?)$/], ['percent', '%', /^(%|percent|percentage|percents)$/],
  ['area', 'ha', /^(ha|hectares?)$/], ['area', 'acre', /^acres?$/],
];
export function readUnit(raw) {
  const w = String(raw ?? '').toLowerCase().replace(/²/g, '2').replace(/³/g, '3').replace(/\^/g, '')
    .replace(/[\s.]+/g, '').replace(/\bper\b|(?<=[a-z])per(?=[a-z])/g, '/').replace(/\/[=-]$/, 'sh');
  if (!w) return null;
  if (w === 'sh') return { family: 'money', unit: 'sh' };
  if (w === 'cc') return { family: 'volume', unit: 'cm3' };
  for (const [family, unit, re] of SIMPLE_UNITS) if (re.test(w)) return { family, unit };
  for (const [unit, names] of Object.entries(LENGTH_NAMES)) {
    if (new RegExp(`^(${names})$`).test(w)) return { family: 'length', unit };
    if (new RegExp(`^((sq|square|squared)(${names})|(${names})(sq|square|squared|2))$`).test(w)) return { family: 'area', unit: `${unit}2` };
    if (new RegExp(`^((cu|cubic|cubed)(${names})|(${names})(cu|cubic|cubed|3))$`).test(w)) return { family: 'volume', unit: `${unit}3` };
  }
  // A rate: km/h, m/s, g/cm³, shillings per kg. Each side read by the rules above.
  const rate = w.match(/^([^/]+)\/([^/]+)$/);
  if (rate) {
    const top = readUnit(rate[1]), under = readUnit(rate[2]);
    if (top && under) {
      const family = top.family === 'length' && under.family === 'time' ? 'speed' : top.family === 'mass' && under.family === 'volume' ? 'density' : 'rate';
      return { family, unit: `${top.unit}/${under.unit}` };
    }
  }
  if (/^(kmh|kph|kmph)$/.test(w)) return { family: 'speed', unit: 'km/h' };
  if (w === 'mps') return { family: 'speed', unit: 'm/s' };
  return null;
}

// Parse an answer string into ONE number when it represents a single pure
// quantity; otherwise null (so "A=2, B=1", "(2,5)", "x=3y" fall through to
// string matching). `child` also strips the unit words a child might add.
export function mathValue(raw, child = false) {
  // Commas only as thousands separators ("1,200"): "6, 0" is not sixty.
  let s = raw.toString().trim().toLowerCase().replace(/[−–—]/g, '-');
  while (/(\d),(\d{3})(?!\d)/.test(s)) s = s.replace(/(\d),(\d{3})(?!\d)/, '$1$2');
  if (/\d\s*,\s*\d/.test(s)) return null;
  // Kid-typed decorations that shouldn't change a numeric answer:
  s = s.replace(/^(ksh|kes|sh|shs)\.?\s*/, '');   // currency prefix: "KSh 4500"
  s = s.replace(/\/[=-]$/, '');                    // Kenyan shilling suffix: "4500/=" or "4500/-"
  s = s.replace(/^[a-z]\s*=\s*/, '');              // "x = 5" on a Find-x question
  s = s.replace(/\.$/, '');                        // trailing full stop: "45."
  s = s.replace(/\bremainder\b/, 'r');             // "5 remainder 2" → "5 r 2"
  // A signed number in brackets, the way integer questions write it: "(-4)",
  // "( -4 )", "(+5)". Only one bare number inside, so "(3, 4)" is untouched
  // (feedback F25).
  if (child) s = s.replace(/^\(\s*([+-]?)\s*(\d*\.?\d+)\s*\)$/, (_, sign, n) => (sign === '-' ? '-' : '') + n);
  if (child) s = s.replace(/^\+\s*(?=\d)/, '');
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
  if (child) {
    // Any spelling of a unit readUnit knows: "28 cm squared", "28 cm^2", "5 m/s".
    const tail = s.match(/^(-?\d*\.?\d+)([^\d.].*)$/);
    if (tail && readUnit(tail[2])) return parseFloat(tail[1]);
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

// ---- Times, compass points, days and months, the way children write them ----
const NUM_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
const hourOf = (w) => (/^\d+$/.test(w) ? Number(w) : NUM_WORDS[w]);
// Minutes past midnight, folded onto a 12-hour clock; null if not a time.
export function timeValue(raw) {
  let t = raw.toString().trim().toLowerCase().replace(/\s+/g, ' ').replace(/\.$/, '');
  t = t.replace(/\b(a\.?\s?m\.?|p\.?\s?m\.?|hrs|hours|h)$/, '').trim();
  let m = t.match(/^(\d{1,2})\s*[:.]\s*(\d{2})$/);
  if (m && Number(m[2]) < 60 && Number(m[1]) <= 24) return ((Number(m[1]) % 12) * 60 + Number(m[2]));
  m = t.match(/^(\d{1,2}|[a-z]+)\s*(o'?clock|o clock|oclock)?$/);
  if (m && m[2] && hourOf(m[1]) != null) return (hourOf(m[1]) % 12) * 60;
  m = t.match(/^half past (\d{1,2}|[a-z]+)$/);
  if (m && hourOf(m[1]) != null) return (hourOf(m[1]) % 12) * 60 + 30;
  m = t.match(/^(a )?quarter past (\d{1,2}|[a-z]+)$/);
  if (m && hourOf(m[2]) != null) return (hourOf(m[2]) % 12) * 60 + 15;
  m = t.match(/^(a )?quarter to (\d{1,2}|[a-z]+)$/);
  if (m && hourOf(m[2]) != null) return ((hourOf(m[2]) + 11) % 12) * 60 + 45;
  return null;
}
const isClockKey = (a) => /^\d{1,2}:\d{2}$/.test(String(a).trim());

// 12-hour times with a.m./p.m. The clock match above only recognises a
// 24-hour key ("13:30"), so a key written "9:15 a.m." never qualified and only
// an exact copy passed: "9:15 am", "9:15 AM" and the Kenyan classroom's own
// "9.15 a.m." were all marked wrong on a Grade 4 time question. Found by the
// check simulator, where it was the commonest way a child who knew the answer
// was told they had a gap.
//
// a.m. and p.m. stay distinct — telling them apart IS the skill — and a bare
// "9:15" is not accepted for "9:15 a.m." because it does not say which. A
// 24-hour answer counts only where it is unambiguous ("21:15" for 9:15 p.m.).
const MERIDIEM = /^(\d{1,2})\s*[:.]\s*(\d{2})\s*([ap])\.?\s*m\.?$/;
const meridiemTime = (raw) => {
  const t = String(raw ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
  let m = t.match(MERIDIEM);
  if (m) {
    const h = Number(m[1]), mi = Number(m[2]);
    if (h < 1 || h > 12 || mi > 59) return null;
    return { h: (h % 12) + (m[3] === 'p' ? 12 : 0), mi, meridiem: true };
  }
  m = t.match(/^(\d{1,2})\s*[:.]\s*(\d{2})\s*(hrs|h|hours)?$/);
  if (m) {
    const h = Number(m[1]), mi = Number(m[2]);
    if (mi <= 59 && (h === 0 || (h >= 13 && h <= 23))) return { h, mi, meridiem: false };
  }
  return null;
};
const isMeridiemKey = (a) => meridiemTime(a)?.meridiem === true;
const COMPASS = { n: 'north', s: 'south', e: 'east', w: 'west', ne: 'north east', nw: 'north west', se: 'south east', sw: 'south west' };
const SHORT_NAMES = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
  'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
// "S" -> "south", "Tue"/"Tues" -> "tuesday", "Sept" -> "september".
const expandShort = (w) => {
  const x = w.toLowerCase().replace(/[.\s-]/g, '');
  if (COMPASS[x]) return COMPASS[x].replace(' ', '');
  if (x.length >= 3) { const hit = SHORT_NAMES.filter(n => n.startsWith(x)); if (hit.length === 1) return hit[0]; }
  return x;
};

// The exact value of the answer when we can know it: the builder's own
// verified value, or a plain calculation in the question ("7.4 × 0.5",
// "Write 4/5 as a decimal"). Used so an EXACT key is marked exactly: the
// rounding margin is only for keys that were rounded (π, square roots).
function exactValue(problem) {
  const v = problem?.verify?.value;
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  const q = String(problem?.question || '').replace(/[−–]/g, '-').replace(/\s*=\s*\??\s*$/, '').trim();
  let m = q.match(/^(-?\d+(?:\.\d+)?)\s*([+\-×x*÷/])\s*(-?\d+(?:\.\d+)?)$/);
  if (m) {
    const a = +m[1], b = +m[3], op = m[2];
    const r = op === '+' ? a + b : op === '-' ? a - b : (op === '÷' || op === '/') ? (b ? a / b : NaN) : a * b;
    return Number.isFinite(r) ? r : null;
  }
  m = q.match(/write (\d+)\/(\d+) as a decimal/i);
  if (m && +m[2]) return +m[1] / +m[2];
  return null;
}

// ---- Is the unit the child wrote the one asked for? (feedback F27) ----
// "28 kg" for an area and "62.5 m" for 62.5 cm are wrong answers, as a teacher
// marks them. A number with no unit is never a conflict, and neither is a word
// readUnit does not know ("6 pieces"). Marking a right answer wrong is the worse
// fault, so every rule below that guesses says nothing when it is unsure.
const unitAfterNumber = (raw) => {
  const t = String(raw ?? '').trim().replace(/[−–—]/g, '-').replace(/\.$/, '');
  if (/^(ksh|kes|shs?)\b\.?\s*-?\d/i.test(t)) return readUnit('sh');
  const m = t.match(/^\(?[+-]?\s*(?:\d[\d,]*)?(?:\.\d+)?(?:\s+\d+\/\d+|\/\d+)?\)?\s*([^\d\s.,/(][^]*|\/[=-])$/);
  return m ? readUnit(m[1]) : null;
};
const sameUnit = (a, b) => a.unit === b.unit
  || (a.unit === 'ml' && b.unit === 'cm3') || (a.unit === 'cm3' && b.unit === 'ml');

// Words of a question that name what it asks for, in the order they count.
const ASK_WORDS = [
  ['area', /\barea\b/i], ['volume', /\bvolume\b/i], ['capacity', /\bcapacity\b/i],
  ['length', /\b(perimeter|circumference|length|width|breadth|height|distance|radius|diameter|how far|how tall|how wide|how high|lower bound|upper bound)\b/i],
  ['mass', /\b(mass|weight|how heavy)\b/i], ['speed', /\b(speed|velocity)\b/i], ['density', /\bdensity\b/i],
  ['angle', /\b(angle|bearing)\b/i], ['time', /\b(time|how long (?:does|did|will|would))\b/i],
  ['money', /\b(cost|price|profit|loss|commission|interest|discount)\b/i],
];
const ASK_VERB = /\b(find|calculate|work out|determine|what|which|state|give)\b/i;
// The first thing named after the asking word: "What is the area of a rectangle
// of length 7" asks for area, "Find the length of a rectangle of area 24" for
// length. With no asking word, only a sentence naming one kind of thing counts.
function askedKind(sentence) {
  const verb = sentence.match(ASK_VERB);
  const hits = ASK_WORDS.flatMap(([family, re]) => {
    const m = (verb ? sentence.slice(verb.index) : sentence).match(re);
    return m ? [{ family, at: m.index, bound: /bound/i.test(m[0]) }] : [];
  });
  if (!hits.length) return null;
  // A bound is asked of whatever is measured, so it says nothing about the kind.
  if (hits.some(h => h.bound)) return null;
  if (verb) return hits.sort((a, b) => a.at - b.at)[0].family;
  return hits.length === 1 ? hits[0].family : null;
}

// Every unit a question mentions. Single letters ("5 m") count only straight
// after a number, and only in a question that is not algebra.
function unitsInText(text) {
  const out = [];
  const add = (w) => { const u = readUnit(w); if (u) out.push(u); };
  for (const m of text.matchAll(/(?:square|sq\.?|cubic)\s+[a-z]+|\b[a-z]{2,}(?:[²³]|\^[23])?(?:\s*(?:\/|per)\s*[a-z]+(?:[²³]|\^[23])?)?/gi)) add(m[0]);
  for (const m of text.matchAll(/\d\s*(m|g|l|h|s|t)(?:[²³]|\^[23])?(?:\/[a-z]+(?:[²³]|\^[23])?)?(?![a-z0-9])/g)) add(m[0].replace(/^\d\s*/, ''));
  if (/\d\s*°/.test(text)) add('°');
  if (/\b(ksh|kes)\.?\s*\d/i.test(text)) add('sh');
  return out;
}
const isAlgebraText = (t) => /\d[a-z]\s*[-+=×]|[-+=]\s*\d*[a-z]\b|\b[a-z]\s*=/.test(t);
const GEOMETRY = { length: 1, area: 2, volume: 3 };
const POWER = { 2: 'area', 3: 'volume' };
// The units that would be right for a kind of answer, from the question's own
// units: an area in a question measured in cm is in cm².
function unitsOfKind(family, units) {
  const same = units.filter(u => u.family === family);
  const power = GEOMETRY[family];
  if (power > 1) for (const u of units) if (u.family === 'length') same.push({ family, unit: `${u.unit}${power}` });
  return same;
}

// What the question asks for, without looking at the key: exact units when it
// says so, a kind of unit when it only implies one, null when it does not say.
export function askedUnit(problem) {
  const instruction = String(problem?.instruction || '');
  const question = String(problem?.question || '');
  const text = `${instruction} ${question}`.trim();
  if (isAlgebraText(text)) return null;
  const said = [];
  const pushSaid = (w, original) => {
    // "from P to S": a capital letter is a point, not seconds.
    if (original.length === 1 && original !== original.toLowerCase()) return;
    const u = readUnit(w); if (u) said.push(u);
  };
  for (const m of text.matchAll(/how many\s+((?:square\s+|cubic\s+)?([a-z]+(?:\s*(?:\/|per\b)\s*[a-z]+)?))/gi)) pushSaid(m[1], m[2]);
  if (!said.length) {
    for (const m of text.matchAll(/\b(?:in|into|to)\s+(?:the\s+unit\s+)?((?:square\s+|sq\.?\s+|cubic\s+)?([a-z]+(?:[²³23]|\^[23])?(?:\s*(?:\/|per\b)\s*[a-z]+(?:[²³23]|\^[23])?)?))(?![a-z])/gi)) pushSaid(m[1], m[2]);
    for (const m of text.matchAll(/\(\s*((?:square\s+|cubic\s+)?([a-z]+(?:[²³])?(?:\/[a-z]+[²³]?)?))\s*\)\s*\??\s*$/gi)) pushSaid(m[1], m[2]);
  }
  if (said.length) return { units: said };

  const units = unitsInText(text);
  // A closing "(π = 3.142, 2 d.p.)" is a rule for the answer, not the ask.
  const sentences = question.replace(/(\s*\([^()]*\))+\s*$/, '').split(/(?<=[.?!])\s+/).filter(Boolean);
  const kind = askedKind(sentences[sentences.length - 1] || '') || askedKind(instruction);
  if (kind) return { family: kind, units: unitsOfKind(kind, units) };

  // Nothing named: a question measured in one kind of unit only is answered in
  // it. Not for money and time, which many stories mention in passing, nor for
  // angles, since a side found from an angle has a length.
  const groups = new Set(units.filter(u => u.family !== 'percent').map(u => (GEOMETRY[u.family] ? 'geometry' : u.family)));
  if (groups.size !== 1) return null;
  const only = [...groups][0];
  if (!['geometry', 'mass', 'capacity'].includes(only)) return null;
  return only === 'geometry' ? { group: 'geometry', units } : { family: only, units: units.filter(u => u.family === only) };
}

function unitConflict(userAnswer, problem) {
  const given = unitAfterNumber(userAnswer);
  if (!given) return false;
  const asked = askedUnit(problem);
  if (!asked) return false;
  // Percentages are said so many ways around a measure that "40%" is left alone.
  if (given.family === 'percent' && !asked.family) return false;
  if (asked.group === 'geometry') {
    if (!GEOMETRY[given.family]) return true;
    const samePower = asked.units.filter(u => u.family === given.family);
    return samePower.length > 0 && !samePower.some(u => sameUnit(u, given));
  }
  if (asked.family) {
    if (given.family === 'percent') return false;
    const liquid = new Set(['volume', 'capacity']);
    if (asked.family !== given.family) return !(liquid.has(asked.family) && liquid.has(given.family));
    return asked.units.length > 0 && !asked.units.some(u => sameUnit(u, given));
  }
  return !asked.units.some(u => sameUnit(u, given));
}

// The right number with the wrong unit, for the lesson's "check your unit".
export function rightNumberWrongUnit(userAnswer, problem) {
  if (!unitAfterNumber(userAnswer) || checkAnswerMatch(userAnswer, problem)) return false;
  const number = String(userAnswer).trim().match(/^\(?[+-]?\s*[\d,]*\.?\d+(?:\s+\d+\/\d+|\/\d+)?\)?/);
  return !!number && checkAnswerMatch(number[0], problem);
}

export function checkAnswerMatch(userAnswer, problem) {
  const normalizedUser = normalizeMath(userAnswer);
  const accepts = problem.accepts || [problem.answer];

  // 1) Exact match after normalization (handles "x=-3", algebra, words).
  if (accepts.some(a => normalizedUser === normalizeMath(a))) return true;

  // 1b) Word answers, the way children phrase them: "parallel lines",
  //     "an obtuse angle", "It is scalene", "Right angled" for "right-angled".
  const wordy = (t) => t.toString().trim().toLowerCase().replace(/[-_]/g, ' ').replace(/[.!]+$/, '')
    .replace(/^(it is|it's|its|they are|they're|this is|the answer is|answer:?)\s+/, '')
    .replace(/^(a|an|the)\s+/, '')
    .replace(/\s+(lines?|angles?|angled|triangles?|shapes?|polygons?)$/, '')
    .replace(/\s+/g, '');
  if (/^[a-z][a-z\s'-]*$/i.test(userAnswer.toString().trim())) {
    const w = wordy(userAnswer);
    if (w && accepts.some(a => /^[a-z][a-z\s'-]*$/i.test(String(a).trim()) && wordy(a) === w)) return true;
  }

  // 1c) Clock times: "1:30", "1.30 pm", "13.30", "half past one" for a 13:30 key.
  if (accepts.some(isClockKey)) {
    const tv = timeValue(userAnswer);
    if (tv != null && accepts.some(a => isClockKey(a) && timeValue(a) === tv)) return true;
  }
  if (accepts.some(isMeridiemKey)) {
    const u = meridiemTime(userAnswer);
    if (u && accepts.some(a => { const k = meridiemTime(a); return k?.meridiem && k.h === u.h && k.mi === u.mi; })) return true;
  }

  // 1d) Compass points and day/month names, shortened: "S", "Tue", "Sept".
  if (/^[a-z][a-z.\s-]{0,10}$/i.test(userAnswer.toString().trim())) {
    const u = expandShort(userAnswer.toString().trim());
    if (accepts.some(a => /^[a-z][a-z\s-]*$/i.test(String(a).trim()) && expandShort(String(a).trim()) === u && u.length > 2)) return true;
  }

  // 1e) Several numbers, in any order: "30° and 150°" also as "30, 150",
  //     "150 and 30", "θ = 30 or θ = 150", "x = -4, x = 6".
  const numList = (t) => {
    const x = t.toString().toLowerCase().replace(/[−–—]/g, '-').replace(/°|degrees?/g, '')
      .replace(/(^|[\s,])[a-zθ]\s*=\s*/g, '$1').replace(/\s+(and|or|&)\s+/g, ',').replace(/;/g, ',');
    if (!/^[\s\d.,-]+$/.test(x)) return null;
    const parts = x.split(',').map(v => v.trim()).filter(Boolean);
    if (parts.length < 2 || parts.some(v => !/^-?\d*\.?\d+$/.test(v))) return null;
    return parts.map(Number).sort((a, b) => a - b);
  };
  const userList = numList(userAnswer);
  // Only for answers written as a set ("30° and 150°"), never coordinates, where order matters.
  const isSet = (a) => /\s(and|or)\s|°/.test(String(a));
  if (userList && accepts.some(a => { if (!isSet(a)) return false; const k = numList(a); return k && k.length === userList.length && k.every((v, i) => Math.abs(v - userList[i]) < 1e-9); })) return true;

  // 1h) Named values, in any order and joined any way: "y = 6, x = 2",
  //     "x = 2 and y = 6", "x=2; y=6" for a key of "x=2, y=6". Unnamed values
  //     ("2 and 6") are read in the key's letter order, x before y.
  const named = (t) => {
    const s = t.toString().toLowerCase().replace(/[−–—]/g, '-');
    const NV = /([a-z])\s*=\s*(-?\d+(?:\.\d+)?(?:\/\d+)?)/g;
    const found = [...s.matchAll(NV)];
    if (found.length < 2 || s.replace(NV, '').replace(/\b(and|&)\b|[\s,;&]/g, '')) return null;
    const out = {};
    for (const [, k, v] of found) {
      if (k in out) return null;                 // "x = -3 or x = 4" is a set, not a pair
      out[k] = v.includes('/') ? Number(v.split('/')[0]) / Number(v.split('/')[1]) : Number(v);
    }
    return out;
  };
  const sameNamed = (u, k) => Object.keys(u).length === Object.keys(k).length
    && Object.keys(k).every(x => x in u && Math.abs(u[x] - k[x]) < 1e-9);
  const keyPairs = accepts.map(a => named(a)).filter(Boolean);
  if (keyPairs.length) {
    const u = named(userAnswer);
    if (u && keyPairs.some(k => sameNamed(u, k))) return true;
    const bare = userAnswer.toString().trim().replace(/[−–—]/g, '-').replace(/\s+(and|&)\s+/gi, ',');
    if (/^-?\d+(\.\d+)?(\s*[,;\s]\s*-?\d+(\.\d+)?)+$/.test(bare)) {
      const vals = bare.split(/\s*[,;\s]\s*/).map(Number);
      if (keyPairs.some(k => { const ks = Object.keys(k).sort(); return ks.length === vals.length && ks.every((x, i) => Math.abs(k[x] - vals[i]) < 1e-9); })) return true;
    }
  }

  // 1f) Addition commutes, so "3 + 5x" is the same answer as "5x + 3".
  //
  //     A child who writes the terms in the other order has not made a mistake,
  //     and marking it wrong teaches them to guess at our preferred spelling
  //     instead of at the mathematics. This matters most in Grades 4-6, where
  //     forming an expression IS the skill being assessed.
  //
  //     Only the top-level sum is reordered, and the sign travels with its term,
  //     so subtraction is still ordered: "5 - x" and "x - 5" stay different.
  //     Brackets are left alone, since they can hide a sum of their own.
  const sumKey = (s) => {
    if (!/[a-z]/.test(s)) return null;      // pure arithmetic is matched by value below
    if (/[()]/.test(s)) return null;        // 2(x+3) — do not take apart
    if (/\^-/.test(s)) return null;         // x^-2: the minus is an exponent, not a term
    if (/\de[-+]?\d/.test(s)) return null;  // 1e-5 is one number, not a subtraction
    const terms = s.replace(/-/g, '+-').split('+').filter(Boolean);
    if (terms.length < 2 || terms.some(t => t === '-')) return null;
    return terms.sort().join('|');
  };
  // An equation is compared side by side, so "x + 3 = 8" accepts "3 + x = 8"
  // without also accepting the sides swapped.
  const sidesKey = (s) => {
    const parts = s.split('=');
    if (parts.length < 2) { const k = sumKey(s); return k && `|${k}`; }
    const keys = parts.map(p => sumKey(p) ?? p);
    return keys.some((k, i) => k !== parts[i]) ? keys.join('=') : null;
  };
  const userKey = sidesKey(normalizedUser);
  if (userKey && accepts.some(a => sidesKey(normalizeMath(a)) === userKey)) return true;

  // 1g) Two-unit quantities in any spelling: "4 hrs 21 mins" for a key of
  //     "4 h 21 min". Only compared with a key written the same two-unit way.
  const cu = compoundValue(userAnswer);
  if (cu && accepts.some(a => { const k = compoundValue(a); return k && k.family === cu.family && k.small === cu.small; })) return true;

  // 1i) Any expression equal in value to the key, in the form the question
  //     asks for: "x·5 + 3", "2(3 + x)", "yx", "(x+2)(x+1)" (algebraEquivalence.js).
  //     Keys that read as a plain number are left to the value match below.
  if (accepts.some(a => mathValue(a) == null && algebraicallyEqual(userAnswer, a, problem?.question))) return true;

  // 2) Single-number match by value — covers integers, decimals, fractions,
  //    mixed numbers, %, and units. A typed DECIMAL is graded at the key's
  //    displayed precision (3.14159 for a key of 3.14). A typed fraction, mixed
  //    number or whole number is exact, so a wrong 1/20 can't pass for a key
  //    shown as 0.1.
  // A question that asks for the simplest form is not answered by an equal
  // fraction that can still be simplified: 3/12 is not 1/4 there (feedback F8).
  // It is marked wrong; the lesson's mistake feedback can say "now simplify".
  if (/simplest form|simplify|lowest terms/i.test(`${problem.instruction || ''} ${problem.question || ''}`)) {
    const f = userAnswer.toString().trim().replace(/[−–—]/g, '-').match(/^(?:-?\d+\s+)?(-?\d+)\s*\/\s*(\d+)$/);
    const gcd = (m, n) => (n ? gcd(n, m % n) : Math.abs(m));
    if (f && gcd(Number(f[1]), Number(f[2])) > 1) return false;
  }
  const userVal = mathValue(userAnswer, true);
  // A key that carries a unit says exactly what is asked for; only without one
  // is the unit read from the question.
  const givenUnit = unitAfterNumber(userAnswer);
  const keyUnits = accepts.map(unitAfterNumber);
  const keyHasUnit = keyUnits.some(Boolean);
  const unitFits = (i) => !givenUnit || !keyHasUnit
    || (keyUnits[i] ? sameUnit(givenUnit, keyUnits[i]) : keyUnits.some(u => u && sameUnit(givenUnit, u)));
  if (userVal != null && (keyHasUnit || !unitConflict(userAnswer, problem))) {
    const typedDecimal = /\d*\.\d/.test(userAnswer.toString());
    const exact = exactValue(problem);
    const wholeKey = /^-?\d+$/.test(String(problem.answer ?? '').trim());
    if (accepts.some((a, i) => {
      if (!unitFits(i)) return false;
      // "24/30" listed for a "?/30" blank is a literal alternative: "4/5" has
      // the same value but is the question, not the answer.
      if (wholeKey && /^\s*-?\d+\s*\/\s*\d+\s*$/.test(String(a))) return false;
      // A key with a spaced or spelled-out unit ("5 m", "60 km/h") is that number.
      const aVal = mathValue(a) ?? (keyUnits[i] ? mathValue(a, true) : null);
      if (aVal == null) return false;
      if (!typedDecimal) return Math.abs(userVal - aVal) <= 1e-9 * Math.max(1, Math.abs(aVal));
      // An exact key (4/5 = 0.8) must be matched exactly: 0.75 is wrong.
      // A rounded key (π, √) keeps the half-a-unit margin.
      if (exact != null && Math.abs(exact - aVal) <= 1e-9 * Math.max(1, Math.abs(aVal))) return Math.abs(userVal - exact) <= 1e-9 * Math.max(1, Math.abs(exact));
      return numbersMatch(userVal, a, aVal);
    })) return true;
  }

  // 3) Coordinate answers: normalize (x,y) format. Only for keys that ARE
  //    coordinates (a comma inside): stripping brackets from algebra made
  //    "2k + 8" pass for "2(k + 8)", a child who forgot the brackets.
  const coordUser = normalizedUser.replace(/[()]/g, '');
  if (accepts.some(a => /,/.test(String(a)) && normalizeMath(a).replace(/[()]/g, '') === coordUser)) return true;

  return false;
}

export default checkAnswerMatch;
