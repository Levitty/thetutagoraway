// ============================================================================
// DATA DISPLAYS — tally charts, frequency tables, pictographs, bar graphs.
//
// These replace a set of questions that SAID a chart was there and then listed
// the numbers as text:
//
//   "In a survey: apples: 15, bananas: 10, oranges: 4, mangoes: 15.
//    How many apples were counted?"
//
// There was no survey and no chart. The answer sat in the question, labelled
// with the very word being asked about, so the task was reading a sentence
// rather than reading data — and its own hint admitted it: "find apples in the
// list and read the number right after it". Reading a display IS the skill the
// design names, so the display is now drawn and the numbers are taken out of
// the question.
//
// Placement follows the KICD designs rather than the old grade labels:
//   Grade 5, 4.1 Data Representation (6 lessons) — tally marks, frequency
//     tables, and interpreting them. No bar graphs, no pictographs.
//   Grade 6, 4.1 Bar Graphs (10 lessons) — frequency tables, pictographs and
//     bar graphs. This is where those two actually belong.
// ============================================================================

import { accepts, hintLadder, randInt, pick, withWorkedExample, withKPs } from './schema.js';

// Kenyan classroom surveys: things a child would actually count.
const SURVEYS = [
  { what: 'fruits the class brought', keys: ['Mango', 'Banana', 'Orange', 'Apple'], noun: 'learners' },
  { what: 'how learners travel to school', keys: ['Walk', 'Matatu', 'Bicycle', 'Boda'], noun: 'learners' },
  { what: 'favourite games in Grade 5', keys: ['Football', 'Netball', 'Athletics', 'Chess'], noun: 'learners' },
  { what: 'animals counted on the farm', keys: ['Goats', 'Cows', 'Chickens', 'Sheep'], noun: 'animals' },
  { what: 'books borrowed each day', keys: ['Mon', 'Tue', 'Wed', 'Thu'], noun: 'books' },
];

/** Distinct counts, so "which is most" and "how many more" are unambiguous. */
const distinctCounts = (n, lo, hi) => {
  const out = new Set();
  let guard = 0;
  while (out.size < n && guard++ < 200) out.add(randInt(lo, hi));
  return [...out];
};

// ---------------------------------------------------------------------------
// GRADE 5, 4.1 — tally marks and frequency tables
// ---------------------------------------------------------------------------

/**
 * Read a tally chart. The marks are DRAWN, in fives with the fifth struck
 * through, and the question carries no numbers at all — counting them is the
 * whole task.
 */
export function buildTallyRead() {
  return () => {
    const set = pick(SURVEYS);
    const keys = set.keys.slice(0, 4);
    const counts = distinctCounts(4, 3, 24);
    const rows = keys.map((label, i) => ({ label, count: counts[i] }));
    const i = randInt(0, keys.length - 1);
    const value = counts[i];
    const fives = Math.floor(value / 5), ones = value % 5;
    return {
      type: 'tally-read', instruction: 'Count the tally marks.',
      question: `The tally chart shows ${set.what}. How many ${set.noun} for ${keys[i]}?`,
      model: { type: 'tally', data: { rows } },
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder(
        'Tally marks are grouped in fives — four upright, with the fifth struck across them.',
        `Count the groups of five on the ${keys[i]} row first.`,
        fives ? `There ${fives === 1 ? 'is 1 group' : `are ${fives} groups`} of five${ones ? `, and ${ones} single mark${ones === 1 ? '' : 's'} left over` : ''}.`
          : 'There is no full group of five here — count the single marks.'),
      solution: { steps: [
        { text: `Each struck group is 5.`, expr: fives ? `${fives} × 5 = ${fives * 5}` : '0' },
        { text: ones ? `Then add the ${ones} single mark${ones === 1 ? '' : 's'}.` : 'There are no marks left over.', expr: `${value}` },
      ], answer: `${value}` },
      misconceptions: [
        { when: `${fives + ones}`, feedback: 'That counts each group of five as one. A struck group stands for 5 marks.' },
        { when: `${fives * 5}`, feedback: 'You counted the full fives but left out the single marks at the end.' },
      ].filter(m => m.when !== `${value}`),
      verify: { kind: 'fraction', value },
    };
  };
}

/**
 * Interpret a frequency table: most, least, total, or the difference between
 * two rows. KICD Grade 5, 4.1 (e).
 */
export function buildFrequencyTable() {
  return () => {
    const set = pick(SURVEYS);
    const keys = set.keys.slice(0, 4);
    const counts = distinctCounts(4, 4, 28);
    const rows = keys.map((label, i) => ({ label, count: counts[i] }));
    const total = counts.reduce((a, b) => a + b, 0);
    const maxI = counts.indexOf(Math.max(...counts));
    const minI = counts.indexOf(Math.min(...counts));
    const mode = pick(['most', 'least', 'total', 'difference']);

    if (mode === 'most' || mode === 'least') {
      const want = mode === 'most' ? maxI : minI;
      const value = keys[want];
      return {
        type: 'frequency-read', instruction: 'Read the chart.', tapChoices: true,
        question: `The tally chart shows ${set.what}. Which had the ${mode === 'most' ? 'most' : 'fewest'}?`,
        model: { type: 'tally', data: { rows } },
        answer: value, accepts: accepts(value, value.toLowerCase()),
        choices: keys,
        hints: hintLadder(
          `The ${mode === 'most' ? 'longest' : 'shortest'} row of marks is the ${mode === 'most' ? 'biggest' : 'smallest'} count.`,
          'Count each row before comparing — a row of fives is longer than it looks.'),
        solution: { steps: [{ text: `${value} has ${counts[want]}, ${mode === 'most' ? 'more' : 'fewer'} than any other row.`, expr: value }], answer: value },
        misconceptions: [{ when: keys[mode === 'most' ? minI : maxI], feedback: `That row has the ${mode === 'most' ? 'fewest' : 'most'}. Read the question again.` }],
        verify: { kind: 'text', value },
      };
    }

    if (mode === 'total') {
      return {
        type: 'frequency-total', instruction: 'Read the chart.',
        question: `The tally chart shows ${set.what}. How many ${set.noun} were counted altogether?`,
        model: { type: 'tally', data: { rows } },
        answer: `${total}`, accepts: accepts(`${total}`),
        hints: hintLadder('Count each row first, then add the four counts.',
          'Write each row’s number down before adding — it is easy to lose one.'),
        solution: { steps: [
          { text: 'Count each row.', expr: counts.join(' + ') },
          { text: 'Add them.', expr: `${total}` },
        ], answer: `${total}` },
        misconceptions: [{ when: `${counts[maxI]}`, feedback: 'That is the biggest row only. Altogether means every row added.' }],
        verify: { kind: 'fraction', value: total },
      };
    }

    const diff = counts[maxI] - counts[minI];
    return {
      type: 'frequency-diff', instruction: 'Read the chart.',
      question: `The tally chart shows ${set.what}. How many more ${keys[maxI]} than ${keys[minI]}?`,
      model: { type: 'tally', data: { rows } },
      answer: `${diff}`, accepts: accepts(`${diff}`),
      hints: hintLadder('Count both rows first.', `Then take the smaller count away from the bigger one.`),
      solution: { steps: [
        { text: 'Count both rows.', expr: `${counts[maxI]} and ${counts[minI]}` },
        { text: 'Subtract.', expr: `${counts[maxI]} − ${counts[minI]} = ${diff}` },
      ], answer: `${diff}` },
      misconceptions: [{ when: `${counts[maxI] + counts[minI]}`, feedback: '"How many more" is a subtraction, not a total.' }],
      verify: { kind: 'fraction', value: diff },
    };
  };
}

// ---------------------------------------------------------------------------
// GRADE 6, 4.1 — pictographs and bar graphs
// ---------------------------------------------------------------------------

/** Read a pictograph where one symbol stands for several of the thing. */
export function buildPictographRead() {
  return () => {
    const set = pick(SURVEYS);
    const keys = set.keys.slice(0, 4);
    const each = pick([2, 5, 10]);
    const wholes = distinctCounts(4, 1, 7);
    const rows = keys.map((label, i) => ({ label, value: wholes[i] * each }));
    const mode = pick(['read', 'diff']);
    // Never ask about a ONE-symbol row: its answer is exactly what one symbol
    // stands for, which the first hint has to say out loud to teach the scale
    // at all ("each symbol stands for 10"). The question would answer itself.
    const multi = wholes.map((w, k) => (w > 1 ? k : -1)).filter(k => k >= 0);
    const i = multi.length ? pick(multi) : wholes.indexOf(Math.max(...wholes));

    if (mode === 'read') {
      const value = rows[i].value;
      return {
        type: 'pictograph-read', instruction: 'Read the pictograph.',
        question: `The pictograph shows ${set.what}. How many ${set.noun} for ${keys[i]}?`,
        model: { type: 'pictograph', data: { rows, each } },
        answer: `${value}`, accepts: accepts(`${value}`),
        hints: hintLadder(`Each symbol stands for ${each}, not for one.`,
          `Count the symbols on the ${keys[i]} row, then multiply by ${each}.`),
        solution: { steps: [
          { text: `There are ${wholes[i]} symbols.`, expr: `${wholes[i]} × ${each}` },
          { text: 'Multiply by what one symbol stands for.', expr: `${value}` },
        ], answer: `${value}` },
        misconceptions: [{ when: `${wholes[i]}`, feedback: `That is the number of SYMBOLS. Each one stands for ${each}.` }],
        verify: { kind: 'fraction', value },
      };
    }
    const a = rows.map(r => r.value);
    const hi = a.indexOf(Math.max(...a)), lo = a.indexOf(Math.min(...a));
    const diff = a[hi] - a[lo];
    return {
      type: 'pictograph-diff', instruction: 'Read the pictograph.',
      question: `The pictograph shows ${set.what}. How many more ${keys[hi]} than ${keys[lo]}?`,
      model: { type: 'pictograph', data: { rows, each } },
      answer: `${diff}`, accepts: accepts(`${diff}`),
      hints: hintLadder(`Each symbol stands for ${each}.`,
        'Work out both rows first, then subtract.'),
      solution: { steps: [
        { text: 'Work out each row.', expr: `${a[hi]} and ${a[lo]}` },
        { text: 'Subtract.', expr: `${a[hi]} − ${a[lo]} = ${diff}` },
      ], answer: `${diff}` },
      misconceptions: [{ when: `${(a[hi] - a[lo]) / each}`, feedback: `That is the difference in SYMBOLS. Each symbol stands for ${each}.` }],
      verify: { kind: 'fraction', value: diff },
    };
  };
}

/** Read a bar graph: a value off the axis, the total, or a comparison. */
export function buildBarGraphRead() {
  return () => {
    const set = pick(SURVEYS);
    const keys = set.keys.slice(0, 4);
    const counts = distinctCounts(4, 4, 30);
    const bars = keys.map((label, i) => ({ label, value: counts[i] }));
    const total = counts.reduce((a, b) => a + b, 0);
    const maxI = counts.indexOf(Math.max(...counts));
    const minI = counts.indexOf(Math.min(...counts));
    const mode = pick(['read', 'total', 'diff', 'most']);

    if (mode === 'read') {
      const i = randInt(0, keys.length - 1);
      return {
        type: 'bargraph-read', instruction: 'Read the bar graph.',
        question: `The bar graph shows ${set.what}. How many ${set.noun} for ${keys[i]}?`,
        model: { type: 'bar-chart', data: { bars, highlight: i } },
        answer: `${counts[i]}`, accepts: accepts(`${counts[i]}`),
        hints: hintLadder('Follow the top of the bar across to the scale on the left.',
          'Check what one step on the scale is worth before you read it off.'),
        solution: { steps: [{ text: `The ${keys[i]} bar reaches ${counts[i]} on the scale.`, expr: `${counts[i]}` }], answer: `${counts[i]}` },
        misconceptions: [], verify: { kind: 'fraction', value: counts[i] },
      };
    }
    if (mode === 'most') {
      const value = keys[maxI];
      return {
        type: 'bargraph-most', instruction: 'Read the bar graph.', tapChoices: true,
        question: `The bar graph shows ${set.what}. Which is the tallest bar?`,
        model: { type: 'bar-chart', data: { bars } },
        answer: value, accepts: accepts(value, value.toLowerCase()), choices: keys,
        hints: hintLadder('The tallest bar is the biggest count.', 'Compare the tops of the bars, not their colours.'),
        solution: { steps: [{ text: `${value} reaches ${counts[maxI]}, higher than any other bar.`, expr: value }], answer: value },
        misconceptions: [], verify: { kind: 'text', value },
      };
    }
    if (mode === 'total') {
      return {
        type: 'bargraph-total', instruction: 'Read the bar graph.',
        question: `The bar graph shows ${set.what}. How many ${set.noun} altogether?`,
        model: { type: 'bar-chart', data: { bars } },
        answer: `${total}`, accepts: accepts(`${total}`),
        hints: hintLadder('Read every bar off the scale first.', 'Then add the four numbers.'),
        solution: { steps: [
          { text: 'Read each bar.', expr: counts.join(' + ') },
          { text: 'Add them.', expr: `${total}` },
        ], answer: `${total}` },
        misconceptions: [{ when: `${counts[maxI]}`, feedback: 'That is the tallest bar only. Altogether means every bar added.' }],
        verify: { kind: 'fraction', value: total },
      };
    }
    const diff = counts[maxI] - counts[minI];
    return {
      type: 'bargraph-diff', instruction: 'Read the bar graph.',
      question: `The bar graph shows ${set.what}. How many more ${keys[maxI]} than ${keys[minI]}?`,
      model: { type: 'bar-chart', data: { bars } },
      answer: `${diff}`, accepts: accepts(`${diff}`),
      hints: hintLadder('Read both bars off the scale first.', 'Then take the shorter from the taller.'),
      solution: { steps: [
        { text: 'Read both bars.', expr: `${counts[maxI]} and ${counts[minI]}` },
        { text: 'Subtract.', expr: `${counts[maxI]} − ${counts[minI]} = ${diff}` },
      ], answer: `${diff}` },
      misconceptions: [{ when: `${counts[maxI] + counts[minI]}`, feedback: '"How many more" is a subtraction, not a total.' }],
      verify: { kind: 'fraction', value: diff },
    };
  };
}

export const DATA_DISPLAY_CONTENT = {
  // Grade 5: tally marks and frequency tables, which is all the design lists.
  G5_TALLY: withKPs([
    withWorkedExample(buildTallyRead()),
    withWorkedExample(buildFrequencyTable()),
  ]),
  // Grade 6 content, kept under its existing ids so no learner's progress is
  // orphaned by a rename. The CBC tags move; the ids stay.
  G5_PICTOGRAPHS: withWorkedExample(buildPictographRead()),
  G5_BAR_GRAPHS: withWorkedExample(buildBarGraphRead()),
};
