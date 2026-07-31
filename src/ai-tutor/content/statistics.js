// ============================================================================
// STATISTICS CONTENT — averages, range, probability, counting. All numeric.
// ============================================================================

import { accepts, hintLadder, randInt, pick, coin, withWorkedExample } from './schema.js';

const sum = (a) => a.reduce((s, x) => s + x, 0);
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; };

// ---- mean of a list (engineered to be a whole number) ----
export function buildMean() {
  const n = randInt(4, 6), mean = randInt(4, 20);
  const vals = [];
  for (let i = 0; i < n - 1; i++) vals.push(randInt(1, 2 * mean));
  vals.push(n * mean - sum(vals));               // last value forces a clean mean
  if (vals[n - 1] < 1) return buildMean();        // retry if it went negative
  return {
    type: 'mean', instruction: 'Find the mean.',
    question: `Find the mean of:  ${vals.join(', ')}`,
    answer: `${mean}`, accepts: accepts(`${mean}`),
    hints: hintLadder('Mean = (sum of values) ÷ (how many values).',
      `Add them up: ${sum(vals)}.`, `Divide by ${n}.`),
    solution: { steps: [
      { text: 'Add all the values.', expr: `${sum(vals)}` },
      { text: `Divide by how many there are (${n}).`, expr: `${sum(vals)} ÷ ${n} = ${mean}` }], answer: `${mean}` },
    misconceptions: [], verify: { kind: 'fraction', value: mean },
  };
}

// ---- mean / median / mode / range (one asked per problem) ----
export function buildAverages() {
  const n = pick([5, 7]);
  const vals = Array.from({ length: n }, () => randInt(1, 12));
  // guarantee a unique mode by duplicating one value
  vals[1] = vals[0];
  const sorted = [...vals].sort((a, b) => a - b);
  const measure = pick(['median', 'mode', 'range']);
  let value, rule, expr;
  if (measure === 'median') { value = sorted[(n - 1) / 2]; rule = 'The median is the middle value once the data is in order.'; expr = `ordered: ${sorted.join(', ')} → middle = ${value}`; }
  else if (measure === 'mode') { value = vals[0]; rule = 'The mode is the value that appears most often.'; expr = `${vals[0]} appears most`; }
  else { value = sorted[n - 1] - sorted[0]; rule = 'The range is largest minus smallest.'; expr = `${sorted[n - 1]} − ${sorted[0]} = ${value}`; }
  return {
    type: 'averages', instruction: `Find the ${measure}.`,
    question: `Find the ${measure} of:  ${vals.join(', ')}`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder(rule, measure === 'range' ? 'Find the biggest and smallest first.' : 'Put the numbers in order first.'),
    solution: { steps: [{ text: rule, expr }], answer: `${value}` },
    misconceptions: [], verify: { kind: 'fraction', value },
  };
}

// ---- simple probability (as a reduced fraction) ----
export function buildProbability() {
  const total = pick([6, 8, 10, 12, 20]);
  const fav = randInt(1, total - 1);
  const g = gcd(fav, total);
  const ansN = fav / g, ansD = total / g;
  const ans = ansD === 1 ? `${ansN}` : `${ansN}/${ansD}`;
  return {
    type: 'probability', instruction: 'Give the probability as a fraction in simplest form.',
    question: `A bag has ${total} equally likely outcomes; ${fav} ${fav === 1 ? 'is' : 'are'} favourable. What is the probability of a favourable outcome?`,
    answer: ans, accepts: accepts(ans, `${+(fav / total).toFixed(6)}`),
    hints: hintLadder('Probability = favourable ÷ total.', 'Write favourable over total as a fraction, then simplify it.'),
    solution: { steps: [
      { text: 'Probability = favourable ÷ total.', expr: `${fav}/${total}` },
      { text: 'Simplify.', expr: ans }], answer: ans },
    misconceptions: [], verify: { kind: 'fraction', value: fav / total },
  };
}

// ---- nPr / nCr ----
const fact = (n) => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
export function buildPermutations() {
  const n = randInt(4, 7), r = randInt(2, Math.min(4, n));
  const value = fact(n) / fact(n - r);
  return {
    type: 'permutations', instruction: 'Evaluate.',
    question: `Evaluate  ${n}P${r}  (the number of ordered arrangements).`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('nPr = n! ÷ (n−r)!', `${n}! ÷ ${n - r}!`, `= ${n} × ${n - 1} × … (${r} factors).`),
    solution: { steps: [{ text: 'Use nPr = n!/(n−r)!.', expr: `${n}! ÷ ${n - r}! = ${value}` }], answer: `${value}` },
    misconceptions: [], verify: { kind: 'fraction', value },
  };
}
export function buildCombinations() {
  const n = randInt(4, 8), r = randInt(2, Math.min(4, n));
  const value = fact(n) / (fact(r) * fact(n - r));
  return {
    type: 'combinations', instruction: 'Evaluate.',
    question: `Evaluate  ${n}C${r}  (the number of unordered selections).`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('nCr = n! ÷ [r!(n−r)!]', 'Order does NOT matter for combinations.'),
    solution: { steps: [{ text: 'Use nCr = n!/(r!(n−r)!).', expr: `${value}` }], answer: `${value}` },
    misconceptions: [], verify: { kind: 'fraction', value },
  };
}


// ============================================================================
// CAMBRIDGE GAP FILL — reading charts, combined probability, grouped data.
// ============================================================================

// ---- G7: data representation (pie & bar chart arithmetic) ----
export function buildDataRepresent() {
  if (coin()) {
    const p = pick([5, 10, 15, 20, 25, 30, 40, 50]);
    const value = p * 3.6;
    const cat = pick(['football', 'music', 'reading', 'ugali', 'athletics']);
    return {
      type: 'pie-angle', instruction: 'The whole pie is 360°.',
      question: `In a survey, ${p}% of students chose ${cat}. What ANGLE represents ${cat} on a pie chart?`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}°`),
      hints: hintLadder('The full circle (100%) is 360°.',
        'So every 1% is 3.6°.',
        `${p} × 3.6.`),
      solution: { steps: [
        { text: '100% ↔ 360°, so 1% ↔ 3.6°.', expr: '× 3.6' },
        { text: 'Scale the percentage.', expr: `${p} × 3.6 = ${value}°` }], answer: `${value}` },
      misconceptions: [{ when: `${p}`, feedback: `${p} is the PERCENTAGE. The pie chart needs the ANGLE — percent of 360°.` }],
      verify: { kind: 'fraction', value },
    };
  }
  const angle = pick([30, 45, 60, 90, 120, 180]);
  const per = 360 / angle;
  const total = per * randInt(2, 9) * per;   // divisible total
  const value = total / per;
  const cat = pick(['matatu', 'bicycle', 'walking', 'bus']);
  return {
    type: 'pie-count', instruction: 'Fraction of the circle = fraction of the people.',
    question: `A pie chart of how ${total} students travel to school gives "${cat}" a ${angle}° slice. How many students is that?`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('Work out what fraction of the whole circle the slice is.',
      `${angle}/360 = 1/${per}.`,
      `That fraction of ${total} students.`),
    solution: { steps: [
      { text: 'Slice as a fraction of the circle.', expr: `${angle}/360 = 1/${per}` },
      { text: 'Take that fraction of the total.', expr: `${total} ÷ ${per} = ${value}` }], answer: `${value}` },
    misconceptions: [{ when: `${angle}`, feedback: `${angle} is the angle. The question asks how many STUDENTS — take the fraction of ${total}.` }],
    verify: { kind: 'fraction', value },
  };
}

// ---- G8: combined events — multiply along the branches ----
export function buildCombinedProbability() {
  if (coin()) {
    // Independent: spinner / coin twice
    const n = pick([3, 4, 5, 6]);
    const value = 1 / (n * n);
    return {
      type: 'prob-independent', instruction: 'Two spins — multiply along the branches.',
      question: `A fair ${n}-sided spinner (numbered 1 to ${n}) is spun twice. What is the probability of getting ${n} BOTH times?`,
      answer: `1/${n * n}`, accepts: accepts(`1/${n * n}`),
      hints: hintLadder('For "this AND that", multiply the probabilities.',
        `Each spin: P(${n}) = 1/${n}.`,
        `1/${n} × 1/${n}.`),
      solution: { steps: [
        { text: 'Probability on each spin.', expr: `1/${n}` },
        { text: 'AND means multiply.', expr: `1/${n} × 1/${n} = 1/${n * n}` }], answer: `1/${n * n}` },
      misconceptions: [{ when: `2/${n}`, feedback: 'You ADDED. Adding is for "this OR that" — for BOTH (and), multiply along the tree branches.' }],
      verify: { kind: 'fraction', value },
    };
  }
  // Without replacement — the tree diagram classic
  const r = randInt(3, 6), b = randInt(2, 5);
  const T = r + b;
  const num = r * (r - 1), den = T * (T - 1);
  const g = gcd(num, den);
  const ans = `${num / g}/${den / g}`;
  const naive = `${r * r}/${T * T}`;
  return {
    type: 'prob-no-replacement', instruction: 'The second pick has one sweet fewer.',
    question: `A bag holds ${r} red and ${b} blue sweets. Two are taken WITHOUT replacement. Find the probability both are red.`,
    answer: ans, accepts: accepts(ans, `${num}/${den}`),
    hints: hintLadder('Draw the tree: the second branch depends on the first pick.',
      `First pick: ${r}/${T}. After a red is gone: ${r - 1}/${T - 1}.`,
      `Multiply along the red-red branch.`),
    solution: { steps: [
      { text: 'First pick red.', expr: `${r}/${T}` },
      { text: 'Second pick red (one red and one sweet fewer).', expr: `${r - 1}/${T - 1}` },
      { text: 'Multiply along the branch.', expr: `${r}/${T} × ${r - 1}/${T - 1} = ${ans}` }], answer: ans },
    misconceptions: [{ when: naive, feedback: 'You "replaced" the sweet — WITHOUT replacement the second pick is from one fewer sweet, so use ' + `${r - 1}/${T - 1}.` }],
    verify: { kind: 'fraction', value: num / den },
  };
}

// ---- G9: grouped data — modal class, midpoints, totals ----
export function buildGroupedData() {
  const classes = ['0–9', '10–19', '20–29', '30–39'];
  const mids = [4.5, 14.5, 24.5, 34.5];
  const freqs = [randInt(2, 9), randInt(2, 9), randInt(2, 9), randInt(2, 9)];
  const maxF = Math.max(...freqs);
  if (freqs.filter(f => f === maxF).length > 1) return buildGroupedData();   // unique mode
  const modal = classes[freqs.indexOf(maxF)];
  const table = classes.map((c, i) => `${c}: ${freqs[i]}`).join(',  ');
  const kind = pick(['modal', 'midpoint', 'total']);
  if (kind === 'modal') {
    return {
      type: 'grouped-modal', instruction: 'The class with the HIGHEST frequency.',
      question: `Marks (grouped) with frequencies —  ${table}.  Which is the modal class?`,
      answer: modal, accepts: accepts(modal, modal.replace('–', '-')),
      hints: hintLadder('Modal = most frequent.',
        'Scan the frequencies for the biggest one.',
        `The biggest frequency is ${maxF}.`),
      solution: { steps: [
        { text: 'Find the highest frequency.', expr: `${maxF}` },
        { text: 'Name ITS class.', expr: modal }], answer: modal },
      misconceptions: [{ when: classes[3], feedback: classes[3] !== modal ? 'That is the class with the biggest NUMBERS in it — modal means biggest FREQUENCY.' : 'Check again.' }].filter(m => m.when !== modal),
      verify: { kind: 'exact', value: modal },
    };
  }
  if (kind === 'midpoint') {
    const i = randInt(0, 3);
    return {
      type: 'grouped-midpoint', instruction: 'Halfway across the class.',
      question: `For grouped data, what is the MIDPOINT of the class ${classes[i]}?`,
      answer: `${mids[i]}`, accepts: accepts(`${mids[i]}`),
      hints: hintLadder('The midpoint is the average of the two ends.',
        `(${classes[i].split('–')[0]} + ${classes[i].split('–')[1]}) ÷ 2.`),
      solution: { steps: [
        { text: 'Average the class ends.', expr: `(${classes[i].split('–')[0]} + ${classes[i].split('–')[1]}) ÷ 2 = ${mids[i]}` }], answer: `${mids[i]}` },
      misconceptions: [{ when: `${(i + 1) * 10 - 5}`, feedback: `${(i + 1) * 10 - 5} splits the GAP, not the class — average the actual endpoints.` }].filter(m => m.when !== `${mids[i]}`),
      verify: { kind: 'fraction', value: mids[i] },
    };
  }
  const total = freqs.reduce((s2, f) => s2 + f, 0);
  return {
    type: 'grouped-total', instruction: 'How many data points in all?',
    question: `Marks (grouped) with frequencies —  ${table}.  How many students were surveyed in total?`,
    answer: `${total}`, accepts: accepts(`${total}`),
    hints: hintLadder('Every student sits in exactly one class.',
      `Add the frequencies: ${freqs.join(' + ')}.`),
    solution: { steps: [
      { text: 'Sum all the frequencies.', expr: `${freqs.join(' + ')} = ${total}` }], answer: `${total}` },
    misconceptions: [],
    verify: { kind: 'fraction', value: total },
  };
}

export const STATISTICS_CONTENT = {
  // Cambridge gap fill
  G7_DATA_REPRESENT:      withWorkedExample(buildDataRepresent),
  G8_PROBABILITY_COMBINED: withWorkedExample(buildCombinedProbability),
  G9_GROUPED_DATA:        withWorkedExample(buildGroupedData),
  G6_MEAN:              withWorkedExample(buildMean),
  G7_MEAN_MEDIAN_MODE:  withWorkedExample(buildAverages),
  G8_PROBABILITY_INTRO: withWorkedExample(buildProbability),
  G9_PROBABILITY_ADV:   withWorkedExample(buildProbability),
  G10_PERMUTATIONS:     withWorkedExample(buildPermutations),
  G10_COMBINATIONS:     withWorkedExample(buildCombinations),
};

export const STATISTICS_SKILL_IDS = Object.keys(STATISTICS_CONTENT);
