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


// ---- G9: scatter plots & correlation --------------------------------------
// Was two hard-coded questions. Correlation is really five ideas: reading the
// direction, judging the strength, spotting an outlier, using a line of best
// fit, and — the one that matters most for a citizen — knowing that
// correlation is not causation.
export function buildScatter() {
  const kind = pick(['direction', 'strength', 'outlier', 'bestfit', 'causation']);

  if (kind === 'direction') {
    const cases = [
      { ctx: 'Hours spent revising and marks scored in the exam', a: 'positive' },
      { ctx: 'Hours spent revising and the number of mistakes made', a: 'negative' },
      { ctx: 'The age of a car and its resale price', a: 'negative' },
      { ctx: 'The height of a plant and the number of weeks it has grown', a: 'positive' },
      { ctx: 'Daily temperature in Mombasa and sales of cold drinks', a: 'positive' },
      { ctx: 'The price of maize and the quantity households buy', a: 'negative' },
      { ctx: "A learner's shoe size and their score in a maths test", a: 'no correlation' },
      { ctx: 'The number of matatus on a road and the average speed of traffic', a: 'negative' },
    ];
    const c = pick(cases);
    return {
      type: 'scatter-direction', instruction: 'Describe the correlation.',
      question: `${c.ctx}. What type of correlation would you expect?`,
      answer: c.a,
      accepts: accepts(c.a, `${c.a} correlation`, c.a === 'no correlation' ? 'none' : null, c.a === 'no correlation' ? 'zero' : null),
      hints: hintLadder(
        'Ask what happens to the SECOND quantity as the first one increases.',
        'Rising together, one rising while the other falls, or no clear pattern at all?'),
      solution: { steps: [{
        text: c.a === 'positive' ? 'As one increases the other increases too, so the points rise to the right.'
          : c.a === 'negative' ? 'As one increases the other decreases, so the points fall to the right.'
          : 'There is no reason for one to affect the other, so the points are scattered with no trend.',
        expr: c.a }], answer: c.a },
      misconceptions: c.a === 'negative'
        ? [{ when: 'positive', feedback: 'Check the direction: here one quantity goes DOWN as the other goes up, which is negative correlation.' }]
        : c.a === 'positive'
        ? [{ when: 'negative', feedback: 'Check the direction: both quantities rise together here, which is positive correlation.' }]
        : [{ when: 'positive', feedback: 'There is no real link between these two — scattered points with no trend means NO correlation.' }],
      verify: { kind: 'text', value: c.a },
    };
  }

  if (kind === 'strength') {
    const cases = [
      { desc: 'the points lie very close to a straight line rising to the right', a: 'strong positive' },
      { desc: 'the points lie very close to a straight line falling to the right', a: 'strong negative' },
      { desc: 'the points rise to the right but are quite spread out', a: 'weak positive' },
      { desc: 'the points fall to the right but are widely scattered', a: 'weak negative' },
    ];
    const c = pick(cases);
    return {
      type: 'scatter-strength', instruction: 'Describe the correlation fully.',
      question: `On a scatter diagram, ${c.desc}. Describe the correlation (strength and direction).`,
      answer: c.a, accepts: accepts(c.a, `${c.a} correlation`),
      hints: hintLadder(
        'Two things to say: which way the trend goes, and how tightly the points hug it.',
        'Close to the line = strong; widely spread = weak.'),
      solution: { steps: [
        { text: 'Direction comes from which way the trend runs.', expr: c.a.split(' ')[1] },
        { text: 'Strength comes from how tightly the points cluster about it.', expr: c.a }], answer: c.a },
      misconceptions: [],
      verify: { kind: 'text', value: c.a },
    };
  }

  if (kind === 'outlier') {
    // A tidy near-linear set with one obvious stray point.
    const m = randInt(2, 5), cIn = randInt(1, 6);
    const xs = [1, 2, 3, 4, 5];
    const pts = xs.map(x => [x, m * x + cIn]);
    const badIdx = randInt(0, 4);
    const badY = pts[badIdx][1] + pick([-1, 1]) * randInt(9, 15);
    const shown = pts.map((p, i) => i === badIdx ? [p[0], badY] : p);
    return {
      type: 'scatter-outlier', instruction: 'Find the point that does not fit.',
      question: `A scatter diagram has the points ${shown.map(p => `(${p[0]}, ${p[1]})`).join(', ')}. Which x-value gives the outlier?`,
      answer: `${shown[badIdx][0]}`, accepts: accepts(`${shown[badIdx][0]}`),
      hints: hintLadder(
        'All but one of these points follow the same steady pattern.',
        'Work out the step between consecutive y-values — one of them breaks the rhythm.'),
      solution: { steps: [
        { text: 'The other points climb by a constant step, so they lie on a straight line.', expr: `step of ${m}` },
        { text: 'One point sits far off that line — its x-value is the answer.', expr: `x = ${shown[badIdx][0]}` }], answer: `${shown[badIdx][0]}` },
      misconceptions: [],
      verify: { kind: 'fraction', value: shown[badIdx][0] },
    };
  }

  if (kind === 'bestfit') {
    const m = randInt(2, 6), cIn = randInt(2, 10), x = randInt(6, 12);
    const value = m * x + cIn;
    return {
      type: 'scatter-bestfit', instruction: 'Use the line of best fit.',
      question: `The line of best fit for a set of data is y = ${m}x + ${cIn}. Use it to estimate y when x = ${x}.`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        'A line of best fit lets you predict: put the x you were given into the equation.',
        `Substitute x = ${x} into y = ${m}x + ${cIn}.`),
      solution: { steps: [
        { text: `Substitute x = ${x}.`, expr: `y = ${m}(${x}) + ${cIn}` },
        { text: 'Evaluate.', expr: `y = ${value}` }], answer: `${value}` },
      misconceptions: [{ when: `${m * x}`, feedback: `Do not forget the intercept — after ${m} × ${x} you still add ${cIn}.` }],
      verify: { kind: 'fraction', value },
    };
  }

  // correlation is not causation
  const cases = [
    { q: 'Ice-cream sales and cases of sunburn both rise together in January. Does eating ice cream CAUSE sunburn? (yes/no)', a: 'no',
      why: 'Both are driven by a third factor — hot, sunny weather. A correlation on its own never proves cause.' },
    { q: 'Villages with more mobile phones also record more electricity connections. Do phones CAUSE electricity supply? (yes/no)', a: 'no',
      why: 'Both rise with the wealth and development of the village; neither causes the other.' },
    { q: 'A strong correlation is found between two quantities. Is that enough to prove one causes the other? (yes/no)', a: 'no',
      why: 'Correlation shows they move together. Proving cause needs a controlled experiment or a clear mechanism.' },
  ];
  const c = pick(cases);
  return {
    type: 'scatter-causation', instruction: 'Think carefully about cause.',
    question: c.q, answer: c.a, accepts: accepts(c.a),
    hints: hintLadder('Two things moving together can both be driven by something else entirely.',
      'Ask yourself: is there a third factor that would explain both?'),
    solution: { steps: [{ text: c.why, expr: c.a }], answer: c.a },
    misconceptions: [{ when: 'yes', feedback: 'Correlation is not causation — look for a third factor driving both quantities.' }],
    verify: { kind: 'text', value: c.a },
  };
}

// ============================================================================
// CBC GRADE 9 — DATA HANDLING 5.1 Data Interpretation, Grouped Data (8 lessons)
//
// KICD outcomes: choose an appropriate CLASS WIDTH, build a frequency
// distribution table, identify the MODAL CLASS, and calculate the MEAN and
// MEDIAN of grouped data. Cumulative frequency is the running total that the
// median class is read from, which is why it sits in this sub-strand.
// ============================================================================

// A grouped table with clean class boundaries: 10-19, 20-29, ...
const groupedTable = (nClasses = 4, width = 10, start = 10) => {
  const classes = [], mids = [], freqs = [];
  for (let i = 0; i < nClasses; i++) {
    const lo = start + i * width;
    const hi = lo + width - 1;
    classes.push(`${lo}–${hi}`);
    mids.push(lo + (width - 1) / 2);
    freqs.push(randInt(2, 9));
  }
  return { classes, mids, freqs, width, start };
};
const cumulate = (freqs) => freqs.reduce((acc, f) => { acc.push((acc.at(-1) || 0) + f); return acc; }, []);
const tableStr = (classes, freqs) => classes.map((c, i) => `${c}: ${freqs[i]}`).join(',  ');

// ---- G9: cumulative frequency — the running total, and what it is FOR ----
export function buildCumulativeFrequency() {
  const kind = pick(['running-total', 'upto', 'median-class', 'below-value']);
  const { classes, freqs } = groupedTable(4);
  const cum = cumulate(freqs);
  const total = cum.at(-1);

  if (kind === 'running-total') {
    const i = randInt(1, 3);          // never the first (trivial) or beyond
    const value = cum[i];
    return {
      type: 'cf-running', instruction: 'Build the running total.',
      question: `Marks are grouped as —  ${tableStr(classes, freqs)}.  What is the cumulative frequency of the class ${classes[i]}?`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        'Cumulative frequency is a running total, not a single class’s frequency.',
        'It answers "how many altogether up to and including this class?"',
        `So gather every frequency from the first class down to ${classes[i]}.`),
      solution: { steps: [
        { text: 'List the frequencies down to that class.', expr: freqs.slice(0, i + 1).join(' + ') },
        { text: 'Add them.', expr: `${value}` }], answer: `${value}` },
      misconceptions: [
        { when: `${freqs[i]}`, feedback: 'That is the frequency of that class alone. Cumulative means everything up to it as well.' },
        { when: `${total}`, feedback: 'That is the running total for the LAST class — the grand total. Stop at the class you were asked about.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'upto') {
    const i = randInt(0, 2);
    const value = cum[i];
    const upper = classes[i].split('–')[1];
    return {
      type: 'cf-upto', instruction: 'Read it from the running total.',
      question: `Marks are grouped as —  ${tableStr(classes, freqs)}.  How many learners scored ${upper} marks or fewer?`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        '"Or fewer" tells you this is a running total question.',
        `Find which class ends at ${upper}.`,
        'Then gather every frequency from the start up to and including it.'),
      solution: { steps: [
        { text: `${upper} is the top of the class ${classes[i]}.`, expr: classes[i] },
        { text: 'Add all frequencies up to there.', expr: `${freqs.slice(0, i + 1).join(' + ')} = ${value}` }], answer: `${value}` },
      misconceptions: [
        { when: `${freqs[i]}`, feedback: 'That counts only the learners inside that one class — "or fewer" includes everyone below it too.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'median-class') {
    // This is what cumulative frequency is actually for in the KICD design.
    const half = total / 2;
    const idx = cum.findIndex(v => v >= half);
    if (idx < 0) return buildCumulativeFrequency();
    const value = classes[idx];
    return {
      type: 'cf-median-class', instruction: 'Name the class, e.g. 20–29.',
      question: `Marks are grouped as —  ${tableStr(classes, freqs)}.  Which class contains the MEDIAN?`,
      answer: value, accepts: accepts(value, value.replace('–', '-')),
      hints: hintLadder(
        'The median is the middle value once everything is in order.',
        `Work out the total frequency, then halve it to find the middle position.`,
        'Run the cumulative total down the classes until it first reaches that position.'),
      solution: { steps: [
        { text: 'Total frequency.', expr: `${freqs.join(' + ')} = ${total}` },
        { text: 'The middle position.', expr: `${total} ÷ 2 = ${half}` },
        { text: 'Run the cumulative total to that position.', expr: value }], answer: value },
      misconceptions: [
        { when: classes[freqs.indexOf(Math.max(...freqs))], feedback: 'That is the class with the biggest frequency — the MODAL class. The median is about position, not size.' },
      ],
      verify: { kind: 'exact', value },
    };
  }

  const value = total;
  return {
    type: 'cf-total', instruction: 'How many altogether?',
    question: `The cumulative frequency column of a grouped table ends at the last class. Frequencies are ${freqs.join(', ')}. What is the FINAL cumulative frequency?`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder(
      'The running total finishes when every class has been counted.',
      'So the last entry accounts for the whole data set.',
      'Gather all the frequencies together.'),
    solution: { steps: [
      { text: 'Add every frequency.', expr: `${freqs.join(' + ')} = ${value}` }], answer: `${value}` },
    misconceptions: [
      { when: `${freqs.at(-1)}`, feedback: 'That is the last class on its own. The final cumulative frequency counts everyone.' },
    ],
    verify: { kind: 'fraction', value },
  };
}

// ---- G9: class width, mean and median of grouped data ----
export function buildGroupedMeasures() {
  const kind = pick(['class-width', 'mean', 'median-value', 'why-estimate']);

  if (kind === 'class-width') {
    const width = pick([5, 10, 20]);
    const start = pick([0, 10, 20]);
    const lo = start, hi = start + width - 1;
    const value = `${width}`;
    return {
      type: 'grouped-width', instruction: 'Give the class width as a number.',
      question: `A frequency table uses the classes ${lo}–${hi}, ${lo + width}–${hi + width}, ${lo + 2 * width}–${hi + 2 * width}, … What is the CLASS WIDTH?`,
      answer: value, accepts: accepts(value),
      hints: hintLadder(
        'The class width is how much ground each class covers, not how many values are listed in it.',
        'Compare where one class starts with where the NEXT one starts.',
        'The gap between those two starting points is the width.'),
      solution: { steps: [
        { text: 'Compare consecutive lower limits.', expr: `${lo} and ${lo + width}` },
        { text: 'The difference is the width.', expr: value }], answer: value },
      misconceptions: [
        { when: `${width - 1}`, feedback: `Subtracting ${lo} from ${hi} misses the last value in the class. Measure from one class's start to the next class's start.` },
      ],
      verify: { kind: 'fraction', value: width },
    };
  }

  if (kind === 'mean') {
    const { classes, mids, freqs } = groupedTable(4);
    const total = freqs.reduce((a, b) => a + b, 0);
    const sumfx = mids.reduce((s, m, i) => s + m * freqs[i], 0);
    const value = Math.round((sumfx / total) * 100) / 100;
    return {
      type: 'grouped-mean', instruction: 'Give your answer to 2 decimal places.',
      question: `Estimate the MEAN of this grouped data —  ${tableStr(classes, freqs)}.`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}`.replace(/\.?0+$/, '')),
      hints: hintLadder(
        'The raw values are gone, so each class has to be represented by a single number.',
        'Use the midpoint of each class to stand for everything in it.',
        'Multiply each midpoint by its frequency, total those, and share by how many there are altogether.'),
      solution: { steps: [
        { text: 'Find each class midpoint.', expr: mids.join(', ') },
        { text: 'Multiply midpoint by frequency and total.', expr: `Σfx = ${sumfx}` },
        { text: 'Divide by the total frequency.', expr: `${sumfx} ÷ ${total} = ${value}` }], answer: `${value}` },
      misconceptions: [
        { when: `${Math.round((mids.reduce((a, b) => a + b, 0) / mids.length) * 100) / 100}`, feedback: 'That averages the midpoints alone. Classes with more learners in them must count for more — weight each midpoint by its frequency.' },
        { when: `${total}`, feedback: 'That is how many learners there are, not their average.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  if (kind === 'median-value') {
    // Median by interpolation — the Grade 9 method.
    const width = 10;
    const { classes, freqs } = groupedTable(4, width, 10);
    const cum = cumulate(freqs);
    const total = cum.at(-1);
    const half = total / 2;
    const idx = cum.findIndex(v => v >= half);
    if (idx < 1) return buildGroupedMeasures();
    const L = 10 + idx * width - 0.5;         // lower boundary
    const cfBefore = cum[idx - 1];
    const fm = freqs[idx];
    const value = Math.round((L + ((half - cfBefore) / fm) * width) * 100) / 100;
    return {
      type: 'grouped-median', instruction: 'Give your answer to 2 decimal places.',
      question: `Find the MEDIAN of this grouped data —  ${tableStr(classes, freqs)}.`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}`.replace(/\.?0+$/, '')),
      hints: hintLadder(
        'First find which class the middle value falls in, using a running total.',
        'The median is somewhere INSIDE that class, so you have to estimate how far in.',
        'How far in depends on how many are still needed to reach the middle, out of that class’s frequency.'),
      solution: { steps: [
        { text: 'Middle position.', expr: `${total} ÷ 2 = ${half}` },
        { text: 'The class it falls in.', expr: `${classes[idx]}, lower boundary ${L}` },
        { text: 'How far into the class.', expr: `(${half} − ${cfBefore}) ÷ ${fm} × ${width}` },
        { text: 'Add to the lower boundary.', expr: `${value}` }], answer: `${value}` },
      misconceptions: [
        { when: `${L}`, feedback: 'That is the lower boundary of the median class. The median sits somewhere inside it — you still have to work out how far in.' },
        { when: `${half}`, feedback: 'That is the middle POSITION, not the middle value. Use it to find where in the table to look.' },
      ],
      verify: { kind: 'fraction', value },
    };
  }

  const { classes, freqs } = groupedTable(4);
  const value = 'estimate';
  return {
    type: 'grouped-why', instruction: 'Answer with one word: exact or estimate.',
    question: `From the grouped table  ${tableStr(classes, freqs)}  a mean is calculated. Is that mean the exact mean of the original data, or an estimate?`,
    answer: value, accepts: accepts(value, 'an estimate', 'estimated'),
    hints: hintLadder(
      'Look at what the table still tells you about any individual learner.',
      'Grouping records which class someone landed in, but not their actual mark.',
      'Ask whether you could rebuild the original marks from this table alone.'),
    solution: { steps: [
      { text: 'The table keeps classes, not individual values.', expr: classes.join(', ') },
      { text: 'Midpoints stand in for real values, so the result is an estimate.', expr: value }], answer: value },
    misconceptions: [
      { when: 'exact', feedback: 'The original marks are lost once data is grouped — the midpoint is only a stand-in, so the mean can only be an estimate.' },
    ],
    verify: { kind: 'exact', value },
  };
}

export const STATISTICS_CONTENT = {
  // Cambridge gap fill
  G7_DATA_REPRESENT:      withWorkedExample(buildDataRepresent),
  G8_PROBABILITY_COMBINED: withWorkedExample(buildCombinedProbability),
  G9_GROUPED_DATA:        withWorkedExample(buildGroupedData),
  // CBC Grade 9 Data Handling 5.1 — grouped data measures
  G8_CUMULATIVE_FREQ:     withWorkedExample(buildCumulativeFrequency),
  G9_GROUPED_MEASURES:    withWorkedExample(buildGroupedMeasures),
  G6_MEAN:              withWorkedExample(buildMean),
  G7_MEAN_MEDIAN_MODE:  withWorkedExample(buildAverages),
  G8_PROBABILITY_INTRO: withWorkedExample(buildProbability),
  G9_PROBABILITY_ADV:   withWorkedExample(buildProbability),
  G10_PERMUTATIONS:     withWorkedExample(buildPermutations),
  G10_COMBINATIONS:     withWorkedExample(buildCombinations),
  G9_SCATTER_PLOTS:     withWorkedExample(buildScatter),
};

export const STATISTICS_SKILL_IDS = Object.keys(STATISTICS_CONTENT);
