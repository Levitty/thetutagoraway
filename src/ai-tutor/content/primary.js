// ============================================================================
// PRIMARY CONTENT (Grade 1–4) — the foundation years, taught the way a
// lower-primary teacher teaches: every concept arrives WITH its manipulative.
//
//   counting/adding      → ten frames (making ten made visible)
//   place value          → base-ten blocks, then the place-value chart
//   multiplication       → dot arrays (rows × columns you can count)
//   division             → equal-groups sharing (remainder in red)
//   fractions            → shaded bars
//   time                 → an analog clock face
//   money                → Kenyan shillings (coins & notes)
//
// Answers stay countable on purpose: at this age, counting the picture IS the
// method — fluency comes later and the mastery system tracks it separately.
// ============================================================================

import { accepts, hintLadder, randInt, pick, coin, withWorkedExample } from './schema.js';

const pad2 = (m) => String(m).padStart(2, '0');

// ---- G1: counting objects ----
export function buildCountObjects() {
  const total = randInt(6, 20);
  const item = pick(['mangoes', 'goats', 'pencils', 'stones', 'bottle tops', 'beads']);
  return {
    type: 'count-objects', instruction: 'Count them.',
    question: `Count the ${item} in the picture. How many are there?`,
    answer: `${total}`, accepts: accepts(`${total}`),
    model: { type: 'dot-array', data: { total, groupSize: 5, caption: 'count in fives — each full row is 5' } },
    hints: hintLadder('Touch each one as you count so you never skip or repeat.',
      'The dots are in rows of 5 — count 5, 10, … then the extras.',
      `How many full rows of 5? Then add the leftover ones.`),
    solution: { steps: [
      { text: 'Count the full rows of 5.', expr: `${Math.floor(total / 5)} row${Math.floor(total / 5) > 1 ? 's' : ''} = ${Math.floor(total / 5) * 5}` },
      { text: 'Add the extra ones.', expr: `${Math.floor(total / 5) * 5} + ${total % 5} = ${total}` }], answer: `${total}` },
    misconceptions: [{ when: `${total - 1}`, feedback: 'So close — you missed one! Touch each dot as you count.' }],
    verify: { kind: 'fraction', value: total },
  };
}

// ---- G1: what comes next (counting to 100) ----
export function buildNumberAfter() {
  const kind = pick(['after', 'before', 'between']);
  if (kind === 'after') {
    const n = randInt(8, 98);
    return mkSeq(`What number comes just after ${n}?`, n + 1, n - 1, 'Count on by one.');
  }
  if (kind === 'before') {
    const n = randInt(9, 99);
    return mkSeq(`What number comes just before ${n}?`, n - 1, n + 1, 'Count back by one.');
  }
  const n = randInt(8, 97);
  return mkSeq(`What number is between ${n} and ${n + 2}?`, n + 1, n, 'It is one more than the smaller number.');
  function mkSeq(q, value, wrong, hint1) {
    return {
      type: 'number-order', instruction: 'Think of the counting order.',
      question: q, answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(hint1, 'Say the numbers out loud in order.', `Start counting from nearby: …${value - 1}, ${value}, ${value + 1}…`),
      solution: { steps: [{ text: 'Count in order.', expr: `${value - 1}, ${value}, ${value + 1}` }], answer: `${value}` },
      misconceptions: [{ when: `${wrong}`, feedback: 'That is the wrong direction on the number line — check whether you should count ON or BACK.' }],
      verify: { kind: 'fraction', value },
    };
  }
}

// ---- G1: which is more / less ----
export function buildCompareNumbers() {
  let a = randInt(2, 20), b = randInt(2, 20);
  while (b === a) b = randInt(2, 20);
  const more = coin();
  const value = more ? Math.max(a, b) : Math.min(a, b);
  const other = more ? Math.min(a, b) : Math.max(a, b);
  return {
    type: 'compare-numbers', instruction: 'Answer with the number.',
    question: `Which number is ${more ? 'more' : 'less'}: ${a} or ${b}?`,
    answer: `${value}`, accepts: accepts(`${value}`),
    model: { type: 'bar-model', data: {
      bars: [{ n: a, d: 20, label: `${a}` }, { n: b, d: 20, label: `${b}` }],
      caption: 'the longer shaded bar is the bigger number',
    } },
    hints: hintLadder('Picture both numbers as bars — longer means more.',
      'When you count, the number you reach LATER is more.',
      `Count up: which of ${Math.min(a, b)} and ${Math.max(a, b)} comes later?`),
    solution: { steps: [
      { text: 'Compare the bars.', expr: `${Math.max(a, b)} is longer than ${Math.min(a, b)}` },
      { text: `So the ${more ? 'more' : 'less'} one is…`, expr: `${value}` }], answer: `${value}` },
    misconceptions: [{ when: `${other}`, feedback: `Careful — the question asks which is ${more ? 'MORE' : 'LESS'}. Look at the bars again.` }],
    verify: { kind: 'fraction', value },
  };
}

// ---- G1: add & subtract within 10 (ten frames) ----
export function buildAddSubWithin10({ sub = false } = {}) {
  if (!sub) {
    const a = randInt(2, 8), b = randInt(1, 10 - a);
    const value = a + b;
    return {
      type: 'add-within-10', instruction: 'Add.',
      question: `${a} + ${b} = ?`,
      answer: `${value}`, accepts: accepts(`${value}`),
      model: { type: 'ten-frame', data: { a, b, op: '+', caption: `${a} green dots, then ${b} blue dots — count them all` } },
      hints: hintLadder('Use the ten frame: count the green dots, then keep counting the blue ones.',
        `Start at ${a} and count on ${b} more.`,
        `${a}… then ${a + 1}${b > 1 ? `, ${a + 2}` : ''}…`),
      solution: { steps: [
        { text: `Start at ${a}.`, expr: `${a}` },
        { text: `Count on ${b}.`, expr: `${value}` }], answer: `${value}` },
      misconceptions: [{ when: `${value - 1}`, feedback: `One short! When you count on, the NEXT number after ${a} is ${a + 1}.` }],
      verify: { kind: 'fraction', value },
    };
  }
  const a = randInt(3, 10), b = randInt(1, a - 1);
  const value = a - b;
  return {
    type: 'sub-within-10', instruction: 'Subtract.',
    question: `${a} − ${b} = ?`,
    answer: `${value}`, accepts: accepts(`${value}`),
    model: { type: 'ten-frame', data: { a, b, op: '−', caption: `${a} dots, ${b} crossed out — count what is left` } },
    hints: hintLadder('Cross out the ones you take away, then count what is left.',
      `Start at ${a} and count back ${b}.`,
      `${a}… ${a - 1}${b > 1 ? `, ${a - 2}` : ''}…`),
    solution: { steps: [
      { text: `Start with ${a} dots.`, expr: `${a}` },
      { text: `Cross out ${b}; count the rest.`, expr: `${value}` }], answer: `${value}` },
    misconceptions: [{ when: `${a + b}`, feedback: 'You added! Subtraction means taking away — the answer must be SMALLER.' }],
    verify: { kind: 'fraction', value },
  };
}

// ---- G2-G4: column addition & subtraction (place-value chart) ----
export function buildColumnAddSub({ digits = 2, sub = false } = {}) {
  const lo = Math.pow(10, digits - 1), hi = Math.pow(10, digits) - 1;
  let a = randInt(lo + 1, hi), b = randInt(lo, hi);
  if (sub && a < b) [a, b] = [b, a];
  const value = sub ? a - b : a + b;
  // Classic wrong answers: digit-wise concatenation of an uncarried ones-sum
  // (47+38 → "715"), and smaller-from-larger in subtraction (52−38 → 26).
  const onesA = a % 10, onesB = b % 10;
  let classic = null, classicWhy = null;
  if (!sub && onesA + onesB >= 10) {
    classic = `${Math.floor(a / 10) + Math.floor(b / 10)}${onesA + onesB}`;
    classicWhy = `The ones make ${onesA + onesB} — that is ${Math.floor((onesA + onesB) / 10)} ten and ${(onesA + onesB) % 10}. CARRY the ten; don't write both digits.`;
  } else if (sub && onesA < onesB) {
    const wrongOnes = onesB - onesA;
    const wrongTens = Math.floor(a / 10) - Math.floor(b / 10);
    if (wrongTens >= 0) {
      classic = `${wrongTens}${wrongOnes}`;
      classicWhy = `You flipped the ones (${onesB} − ${onesA} instead of borrowing). Regroup: take a ten so the ones become ${onesA + 10} − ${onesB}.`;
    }
  }
  return {
    type: sub ? 'column-sub' : 'column-add', instruction: `${sub ? 'Subtract' : 'Add'} using columns.`,
    question: `${a} ${sub ? '−' : '+'} ${b} = ?`,
    answer: `${value}`, accepts: accepts(`${value}`),
    model: { type: 'place-value', data: { numbers: [`${a}`, `${b}`], op: sub ? '−' : '+' } },
    hints: hintLadder('Line the numbers up by place value — ones under ones, tens under tens.',
      `${sub ? 'Subtract' : 'Add'} the ones first, then the tens${digits > 2 ? ', then the hundreds' : ''}.`,
      sub ? 'If the top digit is too small, borrow a ten from the next column.' : 'If a column makes 10 or more, carry the ten to the next column.'),
    solution: { steps: [
      { text: 'Line up the place values.', expr: `${a} ${sub ? '−' : '+'} ${b}` },
      { text: `Work right to left, ${sub ? 'borrowing' : 'carrying'} when needed.`, expr: `${value}`,
        model: { type: 'place-value', data: { numbers: [`${a}`, `${b}`], op: sub ? '−' : '+', result: `${value}` } } }], answer: `${value}` },
    misconceptions: classic && classic !== `${value}` ? [{ when: classic, feedback: classicWhy }] : [],
    verify: { kind: 'fraction', value },
  };
}

// ---- G2/G3: what number do the blocks show ----
export function buildBlocksNumber({ max = 99 } = {}) {
  const value = randInt(21, max);
  const h = Math.floor(value / 100), t = Math.floor((value % 100) / 10), o = value % 10;
  const swapped = h * 100 + o * 10 + t;
  return {
    type: 'base-ten-read', instruction: 'Read the blocks.',
    question: 'What number do the base-ten blocks show?',
    answer: `${value}`, accepts: accepts(`${value}`),
    model: { type: 'base-ten', data: { value } },
    hints: hintLadder('Each big square is 100, each rod is 10, each small cube is 1.',
      'Count the rods first (tens), then the cubes (ones).',
      `${h ? `${h} hundreds, ` : ''}${t} tens and ${o} ones.`),
    solution: { steps: [
      { text: 'Count each kind of block.', expr: `${h ? `${h}×100 + ` : ''}${t}×10 + ${o}×1` },
      { text: 'Add them up.', expr: `${value}` }], answer: `${value}` },
    misconceptions: swapped !== value && o !== t ? [{ when: `${swapped}`, feedback: 'Tens and ones swapped! The RODS are tens; the small cubes are ones.' }] : [],
    verify: { kind: 'fraction', value },
  };
}

// ---- G4: value of a digit (to 10 000) ----
export function buildDigitValue() {
  const value = randInt(1234, 9876);
  const s = `${value}`;
  const pos = randInt(0, 3);                       // which digit we ask about
  const digit = +s[pos];
  if (digit === 0) return buildDigitValue();       // re-roll: "value of 0" is a trick, not teaching
  const placeValue = digit * Math.pow(10, 3 - pos);
  const placeName = ['thousands', 'hundreds', 'tens', 'ones'][pos];
  return {
    type: 'digit-value', instruction: 'Think about the place of the digit.',
    question: `In the number ${value}, what is the VALUE of the digit ${digit}?`,
    answer: `${placeValue}`, accepts: accepts(`${placeValue}`),
    model: { type: 'place-value', data: { numbers: [s], caption: `which column is the ${digit} standing in?` } },
    hints: hintLadder('A digit\'s value depends on its column.',
      `The ${digit} is in the ${placeName} column.`,
      `${digit} ${placeName} = ${digit} × ${Math.pow(10, 3 - pos)}.`),
    solution: { steps: [
      { text: `Find the digit's column.`, expr: `${digit} is in the ${placeName}` },
      { text: 'Multiply by the column value.', expr: `${digit} × ${Math.pow(10, 3 - pos)} = ${placeValue}` }], answer: `${placeValue}` },
    misconceptions: [{ when: `${digit}`, feedback: `${digit} is the DIGIT. Its value counts the column it stands in: ${digit} ${placeName}.` }],
    verify: { kind: 'fraction', value: placeValue },
  };
}

// ---- G2: skip counting ----
export function buildSkipCount() {
  const step = pick([2, 5, 10]);
  const start = step * randInt(1, 3);
  const t = [start, start + step, start + 2 * step];
  const value = start + 3 * step;
  return {
    type: 'skip-count', instruction: 'Continue the pattern.',
    question: `Continue:  ${t[0]}, ${t[1]}, ${t[2]}, __ ?`,
    answer: `${value}`, accepts: accepts(`${value}`),
    model: (start + 3 * step <= 24)
      ? { type: 'pattern-growth', data: { start, diff: step, count: 4, caption: `counting in ${step}s — each tower grows by ${step}` } }
      : undefined,
    hints: hintLadder('Find how much the numbers jump each time.',
      `${t[1]} − ${t[0]} = ${step}: it is counting in ${step}s.`,
      `${t[2]} + ${step} = ?`),
    solution: { steps: [
      { text: 'Find the jump.', expr: `+${step} each time` },
      { text: 'Add it once more.', expr: `${t[2]} + ${step} = ${value}` }], answer: `${value}` },
    misconceptions: [{ when: `${t[2] + 1}`, feedback: `This pattern jumps in ${step}s, not in 1s. Add ${step}.` }],
    verify: { kind: 'fraction', value },
  };
}

// ---- G2/G3: multiplication as arrays ----
export function buildTimesArray({ asRepeated = false } = {}) {
  const a = randInt(2, asRepeated ? 5 : 9), b = randInt(2, asRepeated ? 6 : 9);
  const value = a * b;
  const q = asRepeated
    ? `There are ${a} rows of ${b} desks. How many desks altogether?`
    : `${a} × ${b} = ?`;
  return {
    type: asRepeated ? 'mult-groups' : 'times-table', instruction: asRepeated ? 'Count the groups.' : 'Multiply.',
    question: q,
    answer: `${value}`, accepts: accepts(`${value}`),
    model: { type: 'dot-array', data: { rows: a, cols: b, caption: `${a} rows of ${b}` } },
    hints: hintLadder('An array shows it: rows of equal groups.',
      `${a} × ${b} means ${a} groups of ${b}: ${Array.from({ length: Math.min(a, 3) }, () => b).join(' + ')}${a > 3 ? ' + …' : ''}.`,
      `Skip-count in ${b}s, ${a} times.`),
    solution: { steps: [
      { text: `${a} rows of ${b}.`, expr: Array.from({ length: a }, () => b).join(' + ') },
      { text: 'Add them (or just know the fact!).', expr: `${value}` }], answer: `${value}` },
    misconceptions: [{ when: `${a + b}`, feedback: 'You ADDED the two numbers. Multiplication is repeated addition — count the whole array.' }],
    verify: { kind: 'fraction', value },
  };
}

// ---- G3: division as sharing / G4: with remainders ----
export function buildShareEqually({ remainder = false } = {}) {
  if (!remainder) {
    const k = randInt(2, 6), each = randInt(2, 9);
    const total = k * each;
    return {
      type: 'divide-share', instruction: 'Share equally.',
      question: `Share ${total} sweets equally among ${k} children. How many does each child get?`,
      answer: `${each}`, accepts: accepts(`${each}`),
      model: { type: 'dot-array', data: { total, groupSize: each, caption: `${total} sweets in ${k} equal rows — one row per child` } },
      hints: hintLadder('Deal them out one at a time, like cards.',
        `Sharing is division: ${total} ÷ ${k}.`,
        `${k} × ? = ${total}.`),
      solution: { steps: [
        { text: 'Sharing equally is division.', expr: `${total} ÷ ${k}` },
        { text: 'Each child gets one row.', expr: `${each}` }], answer: `${each}` },
      misconceptions: [{ when: `${total - k}`, feedback: 'You took away instead of sharing. Divide — split into equal groups.' }],
      verify: { kind: 'fraction', value: each },
    };
  }
  const k = randInt(3, 6), each = randInt(3, 9);
  const r = randInt(1, Math.min(k, each) - 1);
  const total = k * each + r;
  return {
    type: 'divide-remainder', instruction: 'Divide and find the remainder.',
    question: `${total} mangoes are packed into bags of ${each}. How many mangoes are LEFT OVER?`,
    answer: `${r}`, accepts: accepts(`${r}`),
    model: { type: 'dot-array', data: { total, groupSize: each, caption: `full bags of ${each} — the red ones don't fill a bag` } },
    hints: hintLadder('Fill as many full bags as you can first.',
      `${total} ÷ ${each} = ${k} full bags with something left.`,
      `${k} × ${each} = ${k * each}. How many remain from ${total}?`),
    solution: { steps: [
      { text: 'Fill full bags.', expr: `${k} bags × ${each} = ${k * each}` },
      { text: 'What is left is the remainder.', expr: `${total} − ${k * each} = ${r}` }], answer: `${r}` },
    misconceptions: [{ when: `${k}`, feedback: `${k} is the number of FULL BAGS. The question asks what is LEFT OVER.` }],
    verify: { kind: 'fraction', value: r },
  };
}

// ---- G2: halves & quarters from a shaded bar ----
export function buildShadedFraction() {
  const d = pick([2, 4, 4, 3]);
  const n = randInt(1, d - 1);
  const g = (x, y) => { let a = x, b = y; while (b) [a, b] = [b, a % b]; return a; };
  const gg = g(n, d);
  return {
    type: 'shaded-fraction', instruction: 'What fraction is shaded?',
    question: 'What fraction of the bar is shaded?',
    answer: `${n}/${d}`, accepts: accepts(`${n}/${d}`, gg > 1 ? `${n / gg}/${d / gg}` : null),
    model: { type: 'bar-model', data: { bars: [{ n, d, label: '?' }], caption: `the bar is cut into ${d} EQUAL parts` } },
    hints: hintLadder('Count the equal parts first — that is the bottom number.',
      'Count the shaded parts — that is the top number.',
      `${d} parts, ${n} shaded.`),
    solution: { steps: [
      { text: 'Total equal parts → denominator.', expr: `${d}` },
      { text: 'Shaded parts → numerator.', expr: `${n}/${d}` }], answer: `${n}/${d}` },
    misconceptions: [{ when: `${d}/${n}`, feedback: 'Upside down! Shaded goes on TOP, total parts on the BOTTOM.' }],
    verify: { kind: 'fraction', value: n / d },
  };
}

// ---- G3: unit fraction of an amount / G4: fraction of a set ----
export function buildFractionOfAmount({ nonUnit = false } = {}) {
  const d = pick([2, 3, 4, 5, 6, 8]);
  const per = randInt(2, 9);
  const X = d * per;
  const n = nonUnit ? randInt(2, d - 1) : 1;
  const value = n * per;
  return {
    type: 'fraction-of-amount', instruction: 'Find the fraction of the amount.',
    question: `What is ${n}/${d} of ${X}?`,
    answer: `${value}`, accepts: accepts(`${value}`),
    model: { type: 'dot-array', data: { total: X, groupSize: per, caption: `${X} split into ${d} equal rows of ${per}` } },
    hints: hintLadder(`The bottom number cuts ${X} into ${d} equal groups.`,
      `${X} ÷ ${d} = ${per} in each group.`,
      n > 1 ? `Take ${n} groups: ${n} × ${per}.` : 'One group is the answer.'),
    solution: { steps: [
      { text: `Divide by the denominator.`, expr: `${X} ÷ ${d} = ${per}` },
      ...(n > 1 ? [{ text: `Multiply by the numerator.`, expr: `${n} × ${per} = ${value}` }] : [{ text: 'One part is the answer.', expr: `${value}` }])], answer: `${value}` },
    misconceptions: [{ when: `${X - d}`, feedback: `Don't subtract! ${n}/${d} OF ${X} means divide ${X} into ${d} equal parts${n > 1 ? ` and take ${n}` : ''}.` }],
    verify: { kind: 'fraction', value },
  };
}

// ---- G2/G3: reading the clock ----
export function buildClockRead({ fiveMin = false } = {}) {
  const h = randInt(1, 12);
  const m = fiveMin ? pick([5, 10, 15, 20, 25, 35, 40, 45, 50, 55]) : pick([0, 30]);
  const value = `${h}:${pad2(m)}`;
  const swappedH = m / 5 === 0 ? 12 : m / 5;
  const swapped = fiveMin && h * 5 <= 55 ? `${swappedH}:${pad2(h * 5)}` : null;
  return {
    type: 'clock-read', instruction: 'Read the clock.',
    question: 'What time does the clock show? (write it like 7:30)',
    answer: value, accepts: accepts(value, m === 0 ? `${h} o'clock` : null, m === 30 ? `half past ${h}` : null),
    model: { type: 'clock', data: { h, m } },
    hints: hintLadder('The SHORT green hand tells the hour; the LONG blue hand tells the minutes.',
      fiveMin ? 'Each number the long hand points at counts 5 minutes.' : 'Long hand at 12 = o\'clock; long hand at 6 = half past.',
      `The short hand is ${m > 30 ? 'past' : 'at or just past'} the ${h}.`),
    solution: { steps: [
      { text: 'Hour: where the short hand is.', expr: `${h}` },
      { text: fiveMin ? 'Minutes: long hand × 5.' : 'Minutes: 12 → :00, 6 → :30.', expr: `:${pad2(m)}` }], answer: value },
    misconceptions: swapped && swapped !== value ? [{ when: swapped, feedback: 'Hands swapped! The SHORT hand is the hour, the LONG hand is the minutes.' }] : [],
    verify: { kind: 'exact', value },
  };
}

// ---- G4: duration in minutes ----
export function buildDuration() {
  const h = randInt(7, 10), m1 = pick([0, 15, 30]);
  const addMin = pick([30, 45, 60, 75, 90]);
  const endTotal = h * 60 + m1 + addMin;
  const h2 = Math.floor(endTotal / 60), m2 = endTotal % 60;
  return {
    type: 'duration', instruction: 'Work out the time taken.',
    question: `A lesson starts at ${h}:${pad2(m1)} and ends at ${h2}:${pad2(m2)}. How many minutes long is it?`,
    answer: `${addMin}`, accepts: accepts(`${addMin}`, `${addMin}min`),
    model: { type: 'clock', data: { h, m: m1, caption: `starts here — ends at ${h2}:${pad2(m2)}` } },
    hints: hintLadder('Count up from the start time to the end time.',
      `First count to the next full hour, then the rest.`,
      `${h}:${pad2(m1)} → ${h + 1}:00 is ${60 - m1} min, then keep going.`),
    solution: { steps: [
      { text: 'Count up to the end time.', expr: `${h}:${pad2(m1)} → ${h2}:${pad2(m2)}` },
      { text: 'Total the minutes.', expr: `${addMin} min` }], answer: `${addMin}` },
    misconceptions: [{ when: `${h2 - h}`, feedback: 'That is hours, not minutes — and check the minute hands too.' }],
    verify: { kind: 'fraction', value: addMin },
  };
}

// ---- G1-G4: money (count / total / change) ----
export function buildMoneyCount() {
  const denomSets = [[1, 5], [5, 10], [10, 20], [1, 10], [5, 20]];
  const [d1, d2] = pick(denomSets);
  const c1 = randInt(1, 4), c2 = randInt(1, 3);
  const value = d1 * c1 + d2 * c2;
  return {
    type: 'money-count', instruction: 'Count the money.',
    question: 'How many shillings is this altogether?',
    answer: `${value}`, accepts: accepts(`${value}`, `${value}/-`, `Sh${value}`),
    model: { type: 'money', data: { items: [{ value: d1, count: c1 }, { value: d2, count: c2 }] } },
    hints: hintLadder('Count the big coins first.',
      `${c2} coin${c2 > 1 ? 's' : ''} of ${d2}/- make ${d2 * c2}.`,
      `${d2 * c2} + ${d1 * c1} = ?`),
    solution: { steps: [
      { text: `Count the ${d2}/- coins.`, expr: `${c2} × ${d2} = ${d2 * c2}` },
      { text: `Count the ${d1}/- coins and add.`, expr: `${d2 * c2} + ${c1} × ${d1} = ${value}` }], answer: `${value}` },
    misconceptions: [{ when: `${c1 + c2}`, feedback: 'That counts the COINS, not the shillings. Each coin is worth its number.' }],
    verify: { kind: 'fraction', value },
  };
}

export function buildMoneyChange({ budget = false } = {}) {
  if (!budget) {
    const pay = pick([50, 100, 200]);
    const cost = randInt(Math.round(pay * 0.3), pay - 5);
    const value = pay - cost;
    return {
      type: 'money-change', instruction: 'Work out the change.',
      question: `Njoroge buys a snack for ${cost} shillings and pays with a ${pay}/- note. How much change does he get?`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}/-`),
      model: { type: 'money', data: { items: [{ value: pay, count: 1 }], caption: `pays ${pay}/-, the snack costs ${cost}/-` } },
      hints: hintLadder('Change = what you pay MINUS what it costs.',
        `${pay} − ${cost}.`,
        `Count up from ${cost} to ${pay}.`),
      solution: { steps: [
        { text: 'Change = paid − cost.', expr: `${pay} − ${cost}` },
        { text: 'Evaluate.', expr: `${value}/-` }], answer: `${value}` },
      misconceptions: [{ when: `${pay + cost}`, feedback: 'You added. Change is what comes BACK: paid minus cost.' }],
      verify: { kind: 'fraction', value },
    };
  }
  const a = randInt(15, 60), b = randInt(15, 60);
  const pay = a + b > 100 ? 200 : 100;
  const value = pay - a - b;
  return {
    type: 'money-budget', instruction: 'Total the shopping, then find the change.',
    question: `Wambui buys bread for ${a}/- and milk for ${b}/-. She pays with a ${pay}/- note. What change does she get?`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}/-`),
    model: { type: 'money', data: { items: [{ value: pay, count: 1 }], caption: `pays ${pay}/- for ${a}/- + ${b}/- of shopping` } },
    hints: hintLadder('First find the TOTAL cost of the shopping.',
      `${a} + ${b} = ${a + b}.`,
      `Then ${pay} − ${a + b}.`),
    solution: { steps: [
      { text: 'Total the shopping.', expr: `${a} + ${b} = ${a + b}` },
      { text: 'Subtract from what she paid.', expr: `${pay} − ${a + b} = ${value}` }], answer: `${value}` },
    misconceptions: [{ when: `${pay - a}`, feedback: 'You only subtracted the bread — total BOTH items first.' }],
    verify: { kind: 'fraction', value },
  };
}

// ---- G1: naming shapes / G2: sides & corners ----
const SHAPES = [
  { name: 'square', sides: 4, corners: 4, kind: 'square' },
  { name: 'rectangle', sides: 4, corners: 4, kind: 'rect' },
  { name: 'triangle', sides: 3, corners: 3, kind: 'triangle' },
  { name: 'circle', sides: 0, corners: 0, kind: 'circle' },
  { name: 'oval', sides: 0, corners: 0, kind: 'oval' },
];
export function buildShapeName() {
  const s = pick(SHAPES);
  const who = pick(['Amina', 'Baraka', 'Njeri', 'Otieno', 'Zawadi', 'Kiprop', 'Wanjiku', 'Mwangi']);
  const templates = [
    `${who} drew this shape. What is it called?`,
    `What is the name of the shape ${who} drew?`,
    `${who} cut this shape out of paper. Which shape is it?`,
    `Look at ${who}'s drawing. What shape is it?`,
  ];
  return {
    type: 'shape-name', instruction: 'Name it.',
    question: pick(templates),
    answer: s.name, accepts: accepts(s.name, `a ${s.name}`, s.name === 'oval' ? 'ellipse' : null),
    model: { type: 'shape', data: { kind: s.kind, dims: s.kind === 'rect' ? { l: 6, w: 4 } : s.kind === 'square' ? { s: 4 } : s.kind === 'triangle' ? { base: 6, h: 4 } : { r: 4 }, plain: true } },
    hints: hintLadder('Count the sides and corners.',
      s.sides ? `It has ${s.sides} sides.` : 'It has no straight sides at all.',
      s.name === 'square' ? 'All four sides are the same length.' : s.name === 'rectangle' ? 'Opposite sides are the same length.' : ''),
    solution: { steps: [{ text: s.sides ? `${s.sides} sides, ${s.corners} corners.` : 'No straight sides — it is round.', expr: s.name }], answer: s.name },
    misconceptions: s.name === 'square' ? [{ when: 'rectangle', feedback: 'Close! But ALL four sides are equal — that makes it a square.' }]
      : s.name === 'oval' ? [{ when: 'circle', feedback: 'Look again — it is stretched, not perfectly round. That is an oval.' }] : [],
    verify: { kind: 'exact', value: s.name },
  };
}

export function buildShapeSides() {
  const s = pick(SHAPES.filter(x => x.sides > 0).concat([{ name: 'pentagon', sides: 5, corners: 5 }, { name: 'hexagon', sides: 6, corners: 6 }]));
  const askSides = coin();
  const value = askSides ? s.sides : s.corners;
  return {
    type: 'shape-sides', instruction: 'Count them.',
    question: `How many ${askSides ? 'sides' : 'corners'} does a ${s.name} have?`,
    answer: `${value}`, accepts: accepts(`${value}`),
    model: s.kind ? { type: 'shape', data: { kind: s.kind, dims: s.kind === 'rect' ? { l: 6, w: 4 } : s.kind === 'square' ? { s: 4 } : { base: 6, h: 4 }, plain: true } } : undefined,
    hints: hintLadder('Trace the shape with your finger and count.',
      'Every straight edge is a side; every point where two sides meet is a corner.',
      `A ${s.name} has the same number of corners as sides.`),
    solution: { steps: [{ text: `Count the ${askSides ? 'sides' : 'corners'} of the ${s.name}.`, expr: `${value}` }], answer: `${value}` },
    misconceptions: [],
    verify: { kind: 'fraction', value },
  };
}

// ---- G1: longer / shorter ----
export function buildLengthCompare() {
  const items = pick([['pencil', 'crayon'], ['rope', 'stick'], ['snake', 'lizard'], ['road', 'path']]);
  let a = randInt(3, 18), b = randInt(3, 18);
  while (b === a) b = randInt(3, 18);
  const longer = coin();
  const value = longer ? Math.max(a, b) : Math.min(a, b);
  return {
    type: 'length-compare', instruction: 'Answer with the length (the number).',
    question: `A ${items[0]} is ${a} cm and a ${items[1]} is ${b} cm. Which length is ${longer ? 'longer' : 'shorter'}?`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}cm`),
    model: { type: 'bar-model', data: {
      bars: [{ n: a, d: 18, label: `${a} cm` }, { n: b, d: 18, label: `${b} cm` }],
      caption: 'the bars show the two lengths',
    } },
    hints: hintLadder('Longer means the bigger number of centimetres.',
      'Compare the two bars.',
      `Which is ${longer ? 'bigger' : 'smaller'}: ${a} or ${b}?`),
    solution: { steps: [{ text: `The ${longer ? 'longer' : 'shorter'} one has the ${longer ? 'bigger' : 'smaller'} number.`, expr: `${value} cm` }], answer: `${value}` },
    misconceptions: [{ when: `${longer ? Math.min(a, b) : Math.max(a, b)}`, feedback: `That is the ${longer ? 'SHORTER' : 'LONGER'} one — read the question again.` }],
    verify: { kind: 'fraction', value },
  };
}

// ---- G3: unit conversions (length / mass / capacity) ----
export function buildUnitConvert() {
  const kind = pick(['m-cm', 'km-m', 'kg-g', 'l-ml']);
  const n = randInt(2, 9);
  const map = {
    'm-cm': { q: `Convert ${n} metres to centimetres.`, factor: 100, unit: 'cm', wrongFactor: 10 },
    'km-m': { q: `Convert ${n} kilometres to metres.`, factor: 1000, unit: 'm', wrongFactor: 100 },
    'kg-g': { q: `Convert ${n} kilograms to grams.`, factor: 1000, unit: 'g', wrongFactor: 100 },
    'l-ml': { q: `Convert ${n} litres to millilitres.`, factor: 1000, unit: 'ml', wrongFactor: 100 },
  };
  const c = map[kind];
  const value = n * c.factor;
  return {
    type: 'unit-convert', instruction: 'Convert the units.',
    question: c.q,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}${c.unit}`),
    hints: hintLadder(`How many ${c.unit} in ONE of the bigger unit?`,
      `1 of the bigger unit = ${c.factor} ${c.unit}.`,
      `${n} × ${c.factor}.`),
    solution: { steps: [
      { text: `1 big unit = ${c.factor} ${c.unit}.`, expr: `× ${c.factor}` },
      { text: 'Multiply.', expr: `${n} × ${c.factor} = ${value} ${c.unit}` }], answer: `${value}` },
    misconceptions: [{ when: `${n * c.wrongFactor}`, feedback: `Wrong factor — 1 of the bigger unit is ${c.factor} ${c.unit}, not ${c.wrongFactor}.` }],
    verify: { kind: 'fraction', value },
  };
}

// ---- G4: multiply 2-digit by 1-digit ----
export function buildMult2Digit() {
  const a = randInt(12, 49), b = randInt(3, 9);
  const value = a * b;
  const tens = Math.floor(a / 10) * 10, ones = a % 10;
  const noCarry = Math.floor(a / 10) * b * 10 + (ones * b) % 10;   // dropped carry
  return {
    type: 'mult-2digit', instruction: 'Multiply.',
    question: `${a} × ${b} = ?`,
    answer: `${value}`, accepts: accepts(`${value}`),
    model: { type: 'area-model', data: {
      rows: [`${b}`], cols: [`${tens}`, `${ones}`],
      cells: [['?', '?']],
      caption: `split ${a} into ${tens} + ${ones}, multiply each part`,
    } },
    hints: hintLadder(`Split ${a} into ${tens} + ${ones}.`,
      `${b} × ${tens} and ${b} × ${ones}, then add.`,
      `${b * tens} + ${b * ones}.`),
    solution: { steps: [
      { text: `Multiply the tens.`, expr: `${b} × ${tens} = ${b * tens}` },
      { text: `Multiply the ones.`, expr: `${b} × ${ones} = ${b * ones}` },
      { text: 'Add the parts.', expr: `${b * tens} + ${b * ones} = ${value}`,
        model: { type: 'area-model', data: {
          rows: [`${b}`], cols: [`${tens}`, `${ones}`],
          cells: [[`${b * tens}`, `${b * ones}`]],
          caption: `${a} × ${b} = ${value}`,
        } } }], answer: `${value}` },
    misconceptions: noCarry !== value ? [{ when: `${noCarry}`, feedback: 'A carry went missing — add ALL of both partial products.' }] : [],
    verify: { kind: 'fraction', value },
  };
}

// ---- G4: tenths as decimals ----
export function buildTenthsDecimal() {
  const n = randInt(1, 9);
  const toDecimal = coin();
  const value = toDecimal ? `0.${n}` : `${n}/10`;
  return {
    type: 'tenths-decimal', instruction: 'Write it the other way.',
    question: toDecimal ? `Write ${n}/10 as a decimal.` : `Write 0.${n} as a fraction.`,
    answer: value, accepts: accepts(value, toDecimal ? `.${n}` : null),
    model: { type: 'bar-model', data: { bars: [{ n, d: 10, label: toDecimal ? `${n}/10` : `0.${n}` }], caption: 'ten equal parts — each part is one tenth = 0.1' } },
    hints: hintLadder('Tenths live one place after the decimal point.',
      `${n} tenths = ${n} parts out of 10.`,
      toDecimal ? `0 point ${n}.` : `${n} over 10.`),
    solution: { steps: [{ text: `${n} tenths, written ${toDecimal ? 'as a decimal' : 'as a fraction'}.`, expr: value }], answer: value },
    misconceptions: [{ when: toDecimal ? `0.0${n}` : `${n}/100`, feedback: 'Those are HUNDREDTHS. Tenths are the FIRST place after the point.' }],
    verify: { kind: 'fraction', value: n / 10 },
  };
}

// ---- G4: compare like-denominator fractions ----
export function buildCompareLikeFractions() {
  const d = pick([5, 6, 8, 10, 12]);
  let a = randInt(1, d - 1), b = randInt(1, d - 1);
  while (b === a) b = randInt(1, d - 1);
  const bigger = coin();
  const vn = bigger ? Math.max(a, b) : Math.min(a, b);
  const other = bigger ? Math.min(a, b) : Math.max(a, b);
  return {
    type: 'compare-fractions-like', instruction: 'Compare the fractions.',
    question: `Which is ${bigger ? 'larger' : 'smaller'}: ${a}/${d} or ${b}/${d}?`,
    answer: `${vn}/${d}`, accepts: accepts(`${vn}/${d}`),
    model: { type: 'bar-model', data: {
      bars: [{ n: a, d, label: `${a}/${d}` }, { n: b, d, label: `${b}/${d}` }],
      caption: 'same-size pieces — just compare how many are shaded',
    } },
    hints: hintLadder('The pieces are the same size (same denominator).',
      'So the fraction with MORE pieces shaded is larger.',
      `Compare ${a} and ${b}.`),
    solution: { steps: [
      { text: 'Same denominator — compare numerators.', expr: `${Math.max(a, b)} > ${Math.min(a, b)}` },
      { text: `So the ${bigger ? 'larger' : 'smaller'} is…`, expr: `${vn}/${d}` }], answer: `${vn}/${d}` },
    misconceptions: [{ when: `${other}/${d}`, feedback: `Check the question — it asks for the ${bigger ? 'LARGER' : 'SMALLER'} one.` }],
    verify: { kind: 'fraction', value: vn / d },
  };
}

// ---- G4: turns & right angles ----
export function buildTurns() {
  const cases = [
    { q: 'facing North, turning clockwise to East', frac: '1/4', v: 0.25 },
    { q: 'facing North, turning clockwise to South', frac: '1/2', v: 0.5 },
    { q: 'facing North, turning clockwise to West', frac: '3/4', v: 0.75 },
    { q: 'facing East, turning clockwise to South', frac: '1/4', v: 0.25 },
    { q: 'facing East, turning clockwise to West', frac: '1/2', v: 0.5 },
    { q: 'facing South, turning clockwise to West', frac: '1/4', v: 0.25 },
    { q: 'facing West, turning clockwise to North', frac: '1/4', v: 0.25 },
    { q: 'facing South, turning clockwise to East', frac: '3/4', v: 0.75 },
  ];
  const c = pick(cases);
  return {
    type: 'turns', instruction: 'Give the fraction of a full turn.',
    question: `You are ${c.q}. What fraction of a full turn is that?`,
    answer: c.frac, accepts: accepts(c.frac),
    hints: hintLadder('A full turn goes all the way around: N → E → S → W → N.',
      'Each step to the next compass point is a quarter turn.',
      'Count the quarter turns.'),
    solution: { steps: [
      { text: 'Count quarter turns between the directions.', expr: c.frac === '1/4' ? '1 quarter' : c.frac === '1/2' ? '2 quarters' : '3 quarters' },
      { text: 'Write as a fraction of a full turn.', expr: c.frac }], answer: c.frac },
    misconceptions: [{ when: c.frac === '1/4' ? '1/2' : '1/4', feedback: 'Count the quarter-steps around the compass: N → E → S → W.' }],
    verify: { kind: 'fraction', value: c.v },
  };
}

// ---- G4: lines of symmetry ----
export function buildSymmetry() {
  const cases = [
    { name: 'square', v: 4, kind: 'square', wrong: 2, why: 'A square folds along BOTH diagonals and both middles — 4 lines.' },
    { name: 'rectangle', v: 2, kind: 'rect', wrong: 4, why: 'The diagonals do NOT fold a rectangle onto itself — only the two middle lines do.' },
    { name: 'equilateral triangle', v: 3, kind: 'triangle', wrong: 1, why: 'Every side of an equilateral triangle has a fold line — 3 in total.' },
    { name: 'isosceles triangle', v: 1, kind: 'triangle', wrong: 3, why: 'Only the middle line folds it onto itself.' },
    { name: 'regular pentagon', v: 5, wrong: 4, why: 'A regular shape has as many lines of symmetry as sides.' },
    { name: 'regular hexagon', v: 6, wrong: 3, why: 'A regular shape has as many lines of symmetry as sides.' },
    { name: 'parallelogram', v: 0, wrong: 2, why: 'Surprise: a parallelogram has NO lines of symmetry — try folding one!' },
  ];
  const c = pick(cases);
  return {
    type: 'symmetry-lines', instruction: 'Count the fold lines.',
    question: `How many lines of symmetry does a ${c.name} have?`,
    answer: `${c.v}`, accepts: accepts(`${c.v}`),
    model: c.kind ? { type: 'shape', data: { kind: c.kind, dims: c.kind === 'rect' ? { l: 6, w: 4 } : c.kind === 'square' ? { s: 4 } : { base: 6, h: 5 }, plain: true } } : undefined,
    hints: hintLadder('A line of symmetry folds the shape exactly onto itself.',
      'Imagine folding — every crease that matches both halves counts.',
      c.v === 0 ? 'Careful: some shapes have none at all.' : `Think about middles${c.v >= 3 ? ' AND diagonals' : ''}.`),
    solution: { steps: [{ text: 'Count the fold lines that map the shape onto itself.', expr: `${c.v}` }], answer: `${c.v}` },
    misconceptions: c.wrong !== c.v ? [{ when: `${c.wrong}`, feedback: c.why }] : [],
    verify: { kind: 'fraction', value: c.v },
  };
}

// ---- G4: scaled bar graphs / pictographs ----
export function buildScaledData() {
  const scale = pick([2, 5, 10]);
  const units = randInt(3, 9);
  const value = scale * units;
  const ctx = pick([
    ['books read', 'Grade 4', 'books'],
    ['goals scored', 'Simba team', 'goals'],
    ['trees planted', 'Eco club', 'trees'],
    ['cups sold', 'the school shop', 'cups'],
  ]);
  return {
    type: 'scaled-data', instruction: 'Use the scale.',
    question: `On a chart of ${ctx[0]}, each symbol stands for ${scale}. The row for ${ctx[1]} shows ${units} symbols. How many ${ctx[2]} is that?`,
    answer: `${value}`, accepts: accepts(`${value}`),
    model: { type: 'dot-array', data: { rows: 1, cols: units, caption: `${units} symbols × ${scale} each` } },
    hints: hintLadder('Each symbol is worth MORE than one — read the scale.',
      `One symbol = ${scale}.`,
      `${units} × ${scale}.`),
    solution: { steps: [
      { text: 'Read the scale.', expr: `1 symbol = ${scale}` },
      { text: 'Multiply.', expr: `${units} × ${scale} = ${value}` }], answer: `${value}` },
    misconceptions: [{ when: `${units}`, feedback: `${units} is the number of SYMBOLS. Each one stands for ${scale} — multiply.` }],
    verify: { kind: 'fraction', value },
  };
}

// ============================================================================
// Registry
// ============================================================================
export const PRIMARY_CONTENT = {
  // Grade 1
  G1_COUNT_20:          withWorkedExample(buildCountObjects),
  G1_NUMBER_ORDER:      withWorkedExample(buildNumberAfter),
  G1_COMPARE:           withWorkedExample(buildCompareNumbers),
  G1_ADD_10:            withWorkedExample(() => buildAddSubWithin10({ sub: false })),
  G1_SUB_10:            withWorkedExample(() => buildAddSubWithin10({ sub: true })),
  G1_SHAPES:            withWorkedExample(buildShapeName),
  G1_LENGTH_COMPARE:    withWorkedExample(buildLengthCompare),
  G1_MONEY_COINS:       withWorkedExample(buildMoneyCount),
  // Grade 2
  G2_PLACE_VALUE_100:   withWorkedExample(() => buildBlocksNumber({ max: 99 })),
  G2_ADD_100:           withWorkedExample(() => buildColumnAddSub({ digits: 2, sub: false })),
  G2_SUB_100:           withWorkedExample(() => buildColumnAddSub({ digits: 2, sub: true })),
  G2_SKIP_COUNT:        withWorkedExample(buildSkipCount),
  G2_MULT_INTRO:        withWorkedExample(() => buildTimesArray({ asRepeated: true })),
  G2_FRACTIONS_HALVES:  withWorkedExample(buildShadedFraction),
  G2_TIME_HOURS:        withWorkedExample(() => buildClockRead({ fiveMin: false })),
  G2_MONEY_ADD:         withWorkedExample(buildMoneyCount),
  G2_SHAPES_PROPERTIES: withWorkedExample(buildShapeSides),
  // Grade 3
  G3_PLACE_VALUE_1000:  withWorkedExample(() => buildBlocksNumber({ max: 999 })),
  G3_ADD_1000:          withWorkedExample(() => buildColumnAddSub({ digits: 3, sub: false })),
  G3_SUB_1000:          withWorkedExample(() => buildColumnAddSub({ digits: 3, sub: true })),
  G3_TIMES_TABLES:      withWorkedExample(() => buildTimesArray({ asRepeated: false })),
  G3_DIVISION_SHARE:    withWorkedExample(() => buildShareEqually({ remainder: false })),
  G3_FRACTIONS_UNIT:    withWorkedExample(() => buildFractionOfAmount({ nonUnit: false })),
  G3_TIME_5MIN:         withWorkedExample(() => buildClockRead({ fiveMin: true })),
  G3_MONEY_CHANGE:      withWorkedExample(() => buildMoneyChange({ budget: false })),
  G3_UNIT_CONVERT:      withWorkedExample(buildUnitConvert),
  // Grade 4
  G4_PLACE_VALUE_10000: withWorkedExample(buildDigitValue),
  G4_ADD_SUB_BIG:       withWorkedExample(() => buildColumnAddSub({ digits: 4, sub: Math.random() < 0.5 })),
  G4_MULT_2DIGIT:       withWorkedExample(buildMult2Digit),
  G4_DIVISION_REMAINDER: withWorkedExample(() => buildShareEqually({ remainder: true })),
  G4_FRACTIONS_OF_SET:  withWorkedExample(() => buildFractionOfAmount({ nonUnit: true })),
  G4_FRACTIONS_COMPARE: withWorkedExample(buildCompareLikeFractions),
  G4_DECIMALS_TENTHS:   withWorkedExample(buildTenthsDecimal),
  G4_TIME_DURATION:     withWorkedExample(buildDuration),
  G4_MONEY_BUDGET:      withWorkedExample(() => buildMoneyChange({ budget: true })),
  G4_ANGLES_TURNS:      withWorkedExample(buildTurns),
  G4_SYMMETRY:          withWorkedExample(buildSymmetry),
  G4_DATA_SCALED:       withWorkedExample(buildScaledData),
};

export const PRIMARY_SKILL_IDS = Object.keys(PRIMARY_CONTENT);
