// ============================================================================
// COMMON MISTAKES — the wrong answer each classic misconception produces for
// THIS question, with feedback that names the mistake without giving the
// answer away. Read from the question's own wording and numbers, so it covers
// the older generators that were written before misconception lists existed.
//
// Source: docs/qa/research/learning-science.md (42-row catalogue: Steinle &
// Stacey decimals, Brown & Burton subtraction bugs, CSMS algebra, KNEC report
// weak areas). Used for (1) naming the mistake after a wrong answer and
// (2) building answer choices whose every wrong option is a real mistake.
//
// catalogueMistakes(problem) -> [{ when, feedback, source: 'catalogue' }]
// Anything that equals the right answer is dropped later by tidy().
// ============================================================================

const fmt = (n) => (Number.isFinite(n) ? String(Number(Number(n).toPrecision(12))) : null);
const num = (s) => Number(String(s).replace(/,/g, ''));
const dpOf = (s) => (String(s).split('.')[1] || '').length;
const digits = (n, len) => String(n).padStart(len, '0').split('').map(Number);
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const frac = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return d / g === 1 ? `${n / g}` : `${n / g}/${d / g}`; };

// Normalise the question: unicode operators to ASCII, drop "= ?".
const norm = (q) => String(q || '')
  .replace(/[−–]/g, '-').replace(/[×x](?=\s*\(?-?\d)/g, '*').replace(/÷/g, '/')
  .replace(/\s*=\s*\??\s*$/, '').trim();

// ---- column arithmetic bugs (Brown & Burton) --------------------------------
const noCarry = (a, b) => { const L = Math.max(String(a).length, String(b).length); const x = digits(a, L), y = digits(b, L); return +x.map((d, i) => (d + y[i]) % 10).join(''); };
const carryAsDigits = (a, b) => { const L = Math.max(String(a).length, String(b).length); const x = digits(a, L), y = digits(b, L); return +x.map((d, i) => d + y[i]).join(''); };
const smallerFromLarger = (a, b) => { const L = Math.max(String(a).length, String(b).length); const x = digits(a, L), y = digits(b, L); return +x.map((d, i) => Math.abs(d - y[i])).join(''); };
const borrowNoDecrement = (a, b) => {
  const L = Math.max(String(a).length, String(b).length); const x = digits(a, L), y = digits(b, L);
  return +x.map((d, i) => (d < y[i] ? d + 10 - y[i] : d - y[i])).join('');
};

// Tiny safe evaluator for + - * / ^ over numbers (no brackets): correct order,
// or strictly left to right (the BODMAS misconception).
const tokens = (s) => s.match(/\d+(?:\.\d+)?|[+\-*/^]/g);
const evalTokens = (t, ltr) => {
  const vals = [], ops = [];
  for (let i = 0; i < t.length; i++) (i % 2 ? ops : vals).push(i % 2 ? t[i] : +t[i]);
  if (vals.length !== ops.length + 1) return null;
  if (ltr) {
    let v = vals[0];
    for (let i = 0; i < ops.length; i++) v = ap(v, ops[i], vals[i + 1]);
    return v;
  }
  for (const group of [['^'], ['*', '/'], ['+', '-']]) {
    for (let i = 0; i < ops.length;) {
      if (group.includes(ops[i])) { vals.splice(i, 2, ap(vals[i], ops[i], vals[i + 1])); ops.splice(i, 1); } else i++;
    }
  }
  return vals[0];
};
const ap = (a, op, b) => (op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : op === '/' ? a / b : a ** b);

const UNITS = {
  mm: ['len', 0.001], millimetre: ['len', 0.001], millimetres: ['len', 0.001],
  cm: ['len', 0.01], centimetre: ['len', 0.01], centimetres: ['len', 0.01],
  m: ['len', 1], metre: ['len', 1], metres: ['len', 1],
  km: ['len', 1000], kilometre: ['len', 1000], kilometres: ['len', 1000],
  g: ['mass', 1], gram: ['mass', 1], grams: ['mass', 1],
  kg: ['mass', 1000], kilogram: ['mass', 1000], kilograms: ['mass', 1000],
  t: ['mass', 1e6], tonne: ['mass', 1e6], tonnes: ['mass', 1e6],
  ml: ['cap', 1], millilitre: ['cap', 1], millilitres: ['cap', 1],
  l: ['cap', 1000], litre: ['cap', 1000], litres: ['cap', 1000],
};
const unit = (w) => UNITS[String(w || '').toLowerCase()];

const M = (when, feedback) => ({ when, feedback, source: 'catalogue' });

export function catalogueMistakes(p) {
  if (!p || typeof p.question !== 'string') return [];
  const raw = p.question.replace(/\s+/g, ' ');
  const q = norm(raw);
  const out = [];
  const add = (v, feedback) => { const w = typeof v === 'number' ? fmt(v) : v; if (w != null && w !== '' && w !== 'NaN') out.push(M(w, feedback)); };
  let m;

  // ---- plain two-number arithmetic ------------------------------------------
  if ((m = q.match(/^(-?\d+(?:\.\d+)?) ?([+\-*/]) ?\(?(-?\d+(?:\.\d+)?)\)?$/))) {
    const [, as, op, bs] = m; const a = +as, b = +bs;
    const ints = Number.isInteger(a) && Number.isInteger(b) && a >= 0 && b >= 0;
    const hasDec = /\./.test(as + bs);
    if (a < 0 || b < 0) {
      // integers with negatives (catalogue rows 18-20)
      if (op === '+' && a < 0 && b < 0) add(Math.abs(a + b), 'Two negatives make a positive only when you multiply or divide. Adding a negative moves you further down the number line.');
      if (op === '-' && b < 0) add(a + b, `Taking away a negative is the same as adding. Think of removing a debt of ${-b}: you end up better off.`);
      if (op === '-' && a < 0 && b > 0) { add(a + b, `Start at ${a} on the number line and move ${b} further to the left.`); add(-(a + b), 'Check the sign. You start below zero and go further down, so the answer is below zero.'); }
      if (op === '*' || op === '/') add(-(op === '*' ? a * b : a / b), 'Check the sign: negative times negative is positive; negative times positive is negative.');
    } else if (ints && op === '+') {
      if (noCarry(a, b) !== a + b) add(noCarry(a, b), 'Looks like a carry got missed. When a column adds up to ten or more, write the ones digit and carry the one into the next column.');
      if (carryAsDigits(a, b) !== a + b && String(a).length > 1) add(carryAsDigits(a, b), 'You wrote each column total in full. When a column makes ten or more, only the ones digit stays; the ten is carried to the next column.');
    } else if (ints && op === '-' && a > b) {
      if (smallerFromLarger(a, b) !== a - b) add(smallerFromLarger(a, b), 'When the top digit is smaller than the bottom one, you cannot swap them round. Borrow a ten from the next column instead.');
      if (borrowNoDecrement(a, b) !== a - b && borrowNoDecrement(a, b) !== smallerFromLarger(a, b)) add(borrowNoDecrement(a, b), 'You borrowed a ten but forgot to take it away from the next column. After borrowing, that column is one less.');
      add(a + b, `This one is minus, not plus: we are taking ${b} away from ${a}.`);
    } else if (ints && op === '*') {
      const [big, small] = a >= b ? [a, b] : [b, a];
      if (small >= 10 && small <= 99 && big >= 10) {
        const t = Math.floor(small / 10), o = small % 10;
        add(big * t + big * o, `The ${t} in ${small} is ${t} tens. When you multiply by it, the answer is worth ten times more: put a zero down first.`);
      } else if (big >= 10 && big <= 99 && small >= 2 && small <= 9) {
        const T = Math.floor(big / 10) * 10, o = big % 10;
        if (o) add(T * small, `That is only the tens part (${T} × ${small}). The ones part is missing: work it out and add it on.`);
        add(o * small + Math.floor(big / 10) * small, 'The tens part must be worth tens. Check you multiplied the whole tens number, not just its digit.');
      }
      add(a + b, `This one is times, not plus. ${a} × ${b} means ${b} groups of ${a}.`);
    } else if (ints && op === '/' && b && a % b === 0) {
      const qv = a / b;
      if (/0/.test(String(qv).slice(1, -1))) add(+String(qv).replace(/0/g, ''), `A zero is missing in your answer. When a digit of ${a} is too small to share, write 0 in the answer for that place and carry on.`);
    } else if (hasDec && (op === '+' || op === '-')) {
      // right-aligned digits: 3.2 + 1.45 -> 32 + 145 = 177 -> 1.77
      const d = Math.max(dpOf(as), dpOf(bs));
      const ia = +as.replace('.', ''), ib = +bs.replace('.', '');
      const wrong = (op === '+' ? ia + ib : ia - ib) / 10 ** d;
      if (dpOf(as) !== dpOf(bs) && Number.isFinite(wrong)) add(wrong, 'Line up the decimal points, not the last digits. Tenths go under tenths and hundredths under hundredths.');
    } else if (hasDec && op === '*') {
      if (b === 0.5 || a === 0.5) add((a === 0.5 ? b : a) * 2, 'Multiplying by 0.5 does not make a number bigger. Times a half means half of it.');
      const place = Math.max(dpOf(as), dpOf(bs)), sum = dpOf(as) + dpOf(bs);
      if (place !== sum) add((+as.replace('.', '') * +bs.replace('.', '')) / 10 ** place, `Count the decimal places in both numbers together: that is how many the answer needs.`);
      if ((b === 10 || b === 100) && /\./.test(as)) add(as + '0'.repeat(String(b).length - 1), `Multiplying by ${b} is not adding zeros. Every digit moves ${b === 10 ? 'one place' : 'two places'} to the left.`);
    } else if (hasDec && op === '/') {
      if (b === 0.5) add(a / 2, 'Dividing by 0.5 asks how many halves fit in. There are two halves in every whole, so the answer is bigger.');
      if (/\./.test(as) && Number.isInteger(b)) add(+as.replace('.', '') / b, 'Keep the decimal point in the same place in your answer, straight above the point in the number you are dividing.');
    }
  }

  // ---- order of operations and powers (rows 21-23) -----------------------------
  if (/^[\d\s.+\-*/²³^]+$/.test(q) && /[+\-]/.test(q) && /[×*²³^÷]/.test(raw) && !/\d\/\d/.test(raw) && !/^-/.test(q)) {
    const s = q.replace(/²/g, '^2').replace(/³/g, '^3').replace(/\s+/g, '');
    const t = tokens(s);
    if (t && t.join('') === s) {
      const right = evalTokens([...t], false), ltr = evalTokens([...t], true);
      if (right != null && ltr != null && ltr !== right) add(ltr, 'You worked left to right. Powers come first, then × and ÷, and only then + and −.');
      if (/\^2/.test(s)) { const t2 = tokens(s.replace(/(\d+)\^2/g, '$1*2')); const v = evalTokens(t2, false); if (v !== right) add(v, 'Squaring means multiplying a number by itself, not by 2.'); }
    }
  }
  if ((m = q.match(/^(\d+)[²^]2?$/)) || (m = q.match(/^(\d+)\^2$/))) add(+m[1] * 2, `Squaring means ${m[1]} × ${m[1]}, not ${m[1]} × 2.`);
  if ((m = q.match(/^√\s?(\d+)$/))) add(+m[1] / 2, 'The square root is not half the number. Find the number that, times itself, makes it.');

  // ---- percentages (row 39) ---------------------------------------------------
  if ((m = raw.match(/(\d+(?:\.\d+)?) ?% of (?:KSh ?|sh ?)?(\d[\d,]*(?:\.\d+)?)/i))) {
    const x = +m[1], y = num(m[2]);
    add(x * y, `Per cent means out of a hundred. ${x}% of ${y} is ${x} hundredths of ${y}: divide by a hundred as well.`);
    if (y > x) add(y - x, `Finding ${x}% of something is not taking ${x} away. Find 1% first (divide by a hundred), then take ${x} of those.`);
  }

  // ---- unit conversions (rows 33-34) ------------------------------------------
  const conv = raw.match(/how many ([a-z]+) (?:are )?(?:there )?in ([\d,]+(?:\.\d+)?) ?([a-z]+)/i)
    || raw.match(/(?:convert|write|change) ([\d,]+(?:\.\d+)?) ?([a-z]+) (?:to|in|into) ([a-z]+)/i);
  if (conv) {
    let n, from, to;
    if (/how many/i.test(conv[0])) { to = unit(conv[1]); n = num(conv[2]); from = unit(conv[3]); }
    else { n = num(conv[1]); from = unit(conv[2]); to = unit(conv[3]); }
    if (from && to && from[0] === to[0] && from[1] !== to[1] && Number.isFinite(n)) {
      const f = from[1] / to[1];
      add(n / f, f > 1 ? 'You are changing to a smaller unit, so you need MORE of them: multiply, don’t divide.' : 'You are changing to a bigger unit, so you need FEWER of them: divide, don’t multiply.');
      const r = f > 1 ? f : 1 / f, wrongR = r === 1000 ? 100 : r === 100 ? 1000 : r === 10 ? 100 : null;
      if (wrongR) add(f > 1 ? n * wrongR : n / wrongR, n === 1 ? 'Check how many of the small unit make one big unit.' : `Check how many of the small unit make one big unit. It is ${r}, not ${wrongR}.`);
    }
  }

  // ---- time: minutes are not decimals (row 35) -------------------------------
  if ((m = raw.match(/(?:starts|leaves|begins|starts at|left) (?:at )?(\d{1,2})[:.](\d{2}).*?(?:lasts|takes|for) (?:(\d+) hours?)?(?: and)? ?(?:(\d+) min)?/i))) {
    const h = +m[1], mi = +m[2], H = +(m[3] || 0), MI = +(m[4] || 0);
    if (mi + MI >= 60) add(`${h + H}:${String(mi + MI).padStart(2, '0')}`, 'There are 60 minutes in an hour, not 100. When the minutes reach 60, that makes one more hour.');
  }

  // ---- angles (rows 36-37 and KPSEA angle facts) ------------------------------
  if ((m = raw.match(/straight line[^\d]*(\d+)°/i)) && !/point/i.test(raw)) add(360 - +m[1], 'Angles on a straight line add up to 180°. It is angles all the way round a point that make 360°.');
  if ((m = raw.match(/co-?interior angle (?:with|to) (\d+)°?/i))) add(+m[1], 'Co-interior angles are not equal: they sit between the parallel lines and add up to 180°.');
  if ((m = raw.match(/(?:alternate|corresponding) angle (?:with|to) (\d+)°?/i))) add(180 - +m[1], 'Alternate and corresponding angles are equal. It is co-interior angles that add to 180°.');
  if ((m = raw.match(/triangle[^.]*?angles? (?:of )?(\d+)° and (\d+)°/i)) && /find|third|missing|what/i.test(raw)) add(360 - +m[1] - +m[2], 'The angles in a triangle add up to 180°. 360° is for a four-sided shape.');
  if ((m = raw.match(/supplement(?:ary)?[^\d]*(\d+)°?/i))) add(90 - +m[1], 'Supplementary angles add up to 180°. Adding to 90° is complementary.');
  if ((m = raw.match(/complement(?:ary)?[^\d]*(\d+)°?/i)) && +m[1] < 90) add(180 - +m[1], 'Complementary angles add up to 90°. Adding to 180° is supplementary.');

  // ---- statistics (row 41) ---------------------------------------------------
  if ((m = raw.match(/mean of:? ([\d,\s.]+)/i))) {
    const xs = m[1].split(/[,\s]+/).filter(Boolean).map(Number);
    if (xs.length > 1) { const s = xs.reduce((a, b) => a + b, 0); add(s, `That is the total. For the mean, share the total equally: divide by how many numbers there are (${xs.length}).`); }
  }
  if ((m = raw.match(/median of:? ([\d,\s.]+)/i))) {
    const xs = m[1].split(/[,\s]+/).filter(Boolean).map(Number);
    if (xs.length % 2 === 1) add(xs[(xs.length - 1) / 2], 'Put the numbers in order first. The median is the middle one after ordering.');
  }
  if ((m = raw.match(/sector (?:is|of) (\d+)°.*?total (?:is |= ?|of )?(\d+)/i))) add(+m[2] * +m[1] / 100, 'A full pie chart is 360°, not 100. Find what fraction of 360° the sector is.');

  // ---- area, perimeter, volume (rows 31-32) ----------------------------------
  if ((m = raw.match(/rectangle is (\d+(?:\.\d+)?) ?cm long and (\d+(?:\.\d+)?) ?cm wide/i))) {
    const L = +m[1], W = +m[2];
    if (/perimeter/i.test(raw)) { add(L * W, 'That is the area (the space inside). Perimeter is the distance all the way round the edge.'); add(L + W, 'You added one length and one width. The perimeter goes all the way round: there are two of each.'); }
    else if (/area/i.test(raw)) { add(2 * (L + W), 'That is the perimeter (the edge). Area is the space inside: length times width.'); add(L + W, 'Area is length TIMES width, not plus.'); }
  }
  if ((m = raw.match(/cuboid (\d+) ?cm × (\d+) ?cm × (\d+) ?cm/i))) {
    add(+m[1] + +m[2] + +m[3], 'Volume multiplies the three measurements; it doesn’t add them.');
    add(+m[1] * +m[2], 'That covers the base only. Multiply by the height too.');
  }
  if ((m = raw.match(/triangle[^.]*base (?:of )?(\d+(?:\.\d+)?)[^.]*height (?:of )?(\d+(?:\.\d+)?)/i)) && /area/i.test(raw)) add(+m[1] * +m[2], 'A triangle is half of a rectangle. Base times height gives the rectangle: halve it.');

  // ---- ratio and fractions of amounts (rows 12, 38) --------------------------
  if ((m = raw.match(/share (?:KSh ?|sh ?)?(\d[\d,]*) (?:\w+ )?in the ratio (\d+) ?: ?(\d+)/i))) {
    const N = num(m[1]), a = +m[2], b = +m[3];
    if (a !== b) add(N / 2, 'A ratio share is not half each. Add the parts of the ratio to find how many equal shares there are.');
    const small = Math.min(a, b), big = Math.max(a, b);
    if (a !== b && Number.isInteger(N * small / big)) add(N * small / big, `The ratio ${a}:${b} is not the fraction ${small}/${big}. There are ${a + b} equal parts altogether.`);
  }
  if ((m = raw.match(/(\d+)\/(\d+) of (?:KSh ?|sh ?)?(\d[\d,]*)/i))) {
    const a = +m[1], b = +m[2], N = num(m[3]);
    if (a > 1 && Number.isInteger(N / a)) add(N / a, `To find ${a}/${b}, split into ${b} equal parts first (divide by ${b}), then take ${a} of them.`);
  }
  if ((m = q.match(/^(\d+)\/(\d+) = \?\/(\d+)$/)) || (m = raw.match(/(\d+)\/(\d+) = \?\/(\d+)/))) {
    const [a, b, d] = [+m[1], +m[2], +m[3]];
    if (d > b) add(a + (d - b), 'Equivalent fractions come from multiplying top and bottom by the same number, not adding.');
  }
  if ((m = q.match(/^(\d+)\/(\d+) ?\/ ?(\d+)\/(\d+)$/))) {
    const [a, b, c, d] = m.slice(1).map(Number);
    add(frac(a * c, b * d), 'To divide by a fraction, flip the second fraction and multiply. You multiplied straight across without flipping.');
  }

  // ---- algebra (rows 25-30) --------------------------------------------------
  if ((m = raw.match(/solve:? ?(\d*)x ?([+\-−]) ?(\d+) ?= ?(-?\d+)/i))) {
    const a = +(m[1] || 1), sgn = m[2] === '+' ? 1 : -1, b = +m[3], c = +m[4];
    add((c + sgn * b) / a, `To undo ${sgn > 0 ? '+' : '−'} ${b}, do the opposite: ${sgn > 0 ? 'take it away from' : 'add it to'} both sides.`);
    if (a > 1) add(c / a - sgn * b, 'Undo the + or − first, then divide. Doing it the other way breaks the balance.');
  } else if ((m = raw.match(/solve:? ?(\d+)x ?= ?(-?\d+)$/i))) {
    add(+m[2] - +m[1], `${m[1]}x means ${m[1]} times x. Undo it by dividing, not taking away.`);
  }
  if ((m = raw.match(/solve:? ?(\d+)x ?([<>≤≥]) ?(-?\d+)/i))) {
    const a = +m[1], c = +m[3], flip = { '>': '<', '<': '>', '≤': '≥', '≥': '≤' }[m[2]];
    if (Number.isInteger(c / a)) add(`x ${flip} ${c / a}`, 'Dividing by a positive number keeps the sign the same way round.');
    add(`x ${m[2]} ${c - a}`, `${a}x means ${a} times x: divide by ${a}, don’t subtract.`);
  }
  if ((m = raw.match(/simplify:? ?([\dx+\-−\s]+)$/i)) && /-|−/.test(m[1])) {
    const terms = m[1].replace(/−/g, '-').match(/[+-]?\s*\d*x/g);
    if (terms && terms.length > 1) {
      const sum = terms.reduce((s, t) => s + (+(t.replace(/[\s+\-x]/g, '')) || 1), 0);
      add(`${sum}x`, 'Keep each sign with the term after it. A minus in front means take that many x away.');
    }
  }

  // ---- number facts ----------------------------------------------------------
  const pv = raw.match(/in (?:the number )?[\d,]+, what is the (?:total )?value of the highlighted digit \((\d)\)/i)
    || raw.match(/(?:total )?value of (?:the )?digit (\d) in (?:the number )?[\d,]+/i);
  if (pv && pv[1] !== '0') add(pv[1], `The value depends on where the ${pv[1]} sits. Count its place from the right: ones, tens, hundreds...`);
  if ((m = raw.match(/(?:HCF|GCD|highest common factor) of (\d+) and (\d+)/i))) { const a = +m[1], b = +m[2]; add(a * b / gcd(a, b), 'That is the lowest common multiple. The highest common factor is the biggest number that divides into BOTH.'); }
  if ((m = raw.match(/(?:LCM|lowest common multiple) of (\d+) and (\d+)/i))) { const a = +m[1], b = +m[2]; if (gcd(a, b) > 1) { add(a * b, `Multiplying gives a common multiple, but not always the lowest. Try multiples of ${Math.max(a, b)} first.`); add(gcd(a, b), 'That is the highest common factor. The lowest common multiple is the smallest number both go into.'); } }
  if ((m = raw.match(/travels? (\d+(?:\.\d+)?) ?km in (\d+(?:\.\d+)?) hours?/i)) && /speed/i.test(raw)) add(+m[1] * +m[2], 'Speed is distance divided by time: how far in ONE hour.');

  // de-duplicate on the wrong answer
  const seen = new Set();
  return out.filter(x => (seen.has(x.when) ? false : (seen.add(x.when), true)));
}

export default catalogueMistakes;
