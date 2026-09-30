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
    question: `A bag has ${total} equally likely outcomes; ${fav} are favourable. What is the probability of a favourable outcome?`,
    answer: ans, accepts: accepts(ans, `${+(fav / total).toFixed(6)}`),
    hints: hintLadder('Probability = favourable ÷ total.', `${fav}/${total}, then simplify.`),
    solution: { steps: [
      { text: 'Probability = favourable ÷ total.', expr: `${fav}/${total}` },
      { text: 'Simplify.', expr: ans }], answer: ans },
    misconceptions: [], verify: { kind: 'fraction', value: fav / total },
  };
}

// ---- nPr / nCr ----
const fact = (n) => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
export function buildPermutations() {
  const mode = pick(['npr', 'npr', 'officers', 'word', 'factorial']);
  if (mode === 'word') {
    const w = pick(['KENYA', 'MAIZE', 'LAMU', 'BUSIA', 'EMBU', 'THIKA', 'MERU', 'VOI', 'MANGO', 'BORA']);
    const value = fact(w.length);
    return { type: 'permutations', instruction: 'Count the arrangements.', question: `In how many different orders can the letters of the word ${w} be arranged? (All the letters are different.)`,
      answer: `${value}`, accepts: accepts(`${value}`), hints: hintLadder(`${w.length} choices for the first letter, then ${w.length - 1}, and so on.`),
      solution: { steps: [{ text: `${w.length}!`, expr: `${Array.from({ length: w.length }, (_, i) => w.length - i).join(' × ')} = ${value}` }], answer: `${value}` },
      misconceptions: [{ when: `${w.length * (w.length - 1)}`, feedback: 'Keep multiplying all the way down to 1.' }], verify: { kind: 'fraction', value } };
  }
  const n = mode === 'factorial' ? randInt(3, 8) : randInt(4, 10), r = mode === 'factorial' ? n : mode === 'officers' ? 3 : randInt(2, Math.min(4, n));
  const value = fact(n) / fact(n - r);
  const question = mode === 'factorial' ? `Evaluate ${n}!`
    : mode === 'officers' ? `A class of ${n} learners chooses a captain, a deputy and a secretary. No one can hold two posts. In how many ways can this be done?`
    : `Evaluate ${n}P${r} (the number of ordered arrangements).`;
  return {
    type: 'permutations', instruction: 'Evaluate.', question,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder(mode === 'factorial' ? `${n}! = ${n} × ${n - 1} × … × 1.` : 'nPr = n! ÷ (n−r)!: multiply r numbers counting down from n.'),
    solution: { steps: [{ text: mode === 'factorial' ? 'Multiply down to 1.' : `${r} numbers counting down from ${n}.`, expr: `${Array.from({ length: r }, (_, i) => n - i).join(' × ')} = ${value}` }], answer: `${value}` },
    misconceptions: mode === 'officers' ? [{ when: `${fact(n) / (fact(3) * fact(n - 3))}`, feedback: 'The posts are different, so order matters: that is an arrangement, not a selection.' }] : [],
    verify: { kind: 'fraction', value },
  };
}
export function buildCombinations() {
  const mode = pick(['ncr', 'ncr', 'team', 'handshakes']);
  const n = randInt(4, 12), r = mode === 'handshakes' ? 2 : randInt(2, Math.min(4, n - 1));
  const value = fact(n) / (fact(r) * fact(n - r));
  const question = mode === 'team' ? `A teacher picks ${r} learners from ${n} to carry the class books. Order does not matter. How many different groups are possible?`
    : mode === 'handshakes' ? `${n} people at a meeting each shake hands once with every other person. How many handshakes are there?`
    : `Evaluate ${n}C${r} (the number of unordered selections).`;
  return {
    type: 'combinations', instruction: 'Evaluate.', question,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('nCr = n! ÷ [r!(n−r)!]', 'Order does NOT matter for combinations.'),
    solution: { steps: [{ text: 'Use nCr = n!/(r!(n−r)!).', expr: `${n}C${r} = ${value}` }], answer: `${value}` },
    misconceptions: [{ when: `${fact(n) / fact(n - r)}`, feedback: 'That counts every order. A group is the same group in any order: divide by r!.' },
      ...(mode === 'handshakes' ? [{ when: `${n * (n - 1)}`, feedback: 'Each handshake has been counted twice (once for each person).' }] : [])],
    verify: { kind: 'fraction', value },
  };
}

export const STATISTICS_CONTENT = {
  G6_MEAN:              withWorkedExample(buildMean),
  G7_MEAN_MEDIAN_MODE:  withWorkedExample(buildAverages),
  G8_PROBABILITY_INTRO: withWorkedExample(buildProbability),
  G9_PROBABILITY_ADV:   withWorkedExample(buildProbability),
  G10_PERMUTATIONS:     withWorkedExample(buildPermutations),
  G10_COMBINATIONS:     withWorkedExample(buildCombinations),
};

export const STATISTICS_SKILL_IDS = Object.keys(STATISTICS_CONTENT);
