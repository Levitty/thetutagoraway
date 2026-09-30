// ============================================================================
// KENYAN WORD PROBLEMS WITH A BAR MODEL
//
// KPSEA/KJSEA items are mostly short stories in Kenyan settings (sh, shamba,
// matatu, harambee, school), and KNEC's reports say applying maths in context
// is where learners are weakest. Only about 1 in 7 HOREB questions was a word
// problem. These follow the plain-language rules for second-language readers
// (research: learning-science.md §7): short sentences, one fact each, present
// tense, familiar names and settings, the question last.
//
// Each carries a Singapore bar model (`diagram`) that the practice screen
// shows after a wrong try or when the child is struggling, never on the
// first look: the child reads and thinks first.
//
// Structures (Ng & Lee 2009): part-whole, comparison, "times as many",
// fraction of an amount, fraction left, ratio, percentage off.
// Numbers are generated; nothing is copied from an exam paper.
// ============================================================================

import { randInt, pick } from './schema.js';

const GIRLS = ['Wanjiru', 'Achieng', 'Amina', 'Nyambura', 'Halima', 'Chebet', 'Wambui', 'Akinyi', 'Njeri', 'Asha', 'Nyaboke', 'Zawadi'];
const BOYS = ['Juma', 'Kiprono', 'Otieno', 'Baraka', 'Mutua', 'Omondi', 'Kamau', 'Kioko', 'Mugambi', 'Wafula', 'Barasa', 'Kipchoge'];
const c = (n) => Number(n).toLocaleString('en-US');
const two = () => { const a = pick([...GIRLS, ...BOYS]); let b = a; while (b === a) b = pick([...GIRLS, ...BOYS]); return [a, b]; };
const pron = (name) => (GIRLS.includes(name) ? ['she', 'her'] : ['he', 'his']);
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const M = (when, feedback) => ({ when: String(when), feedback });

// diagram: { type: 'bar', rows: [{ label, segs: [{ w, text, tone }] }], note }
// w = relative width; tone: 'a' (pink), 'b' (yellow), 'q' (unknown, dashed).
const seg = (w, text, tone = 'a') => ({ w, text, tone });

const item = (o) => ({
  type: `word-${o.kind}`,
  instruction: 'Read carefully. Then answer the question.',
  ...o,
  accepts: o.accepts || [String(o.answer), c(o.answer)],
  answer: String(o.answer),
  hints: o.hints,
  hint: o.hints[0],
  solutionSteps: o.steps,
  solution: { steps: o.steps.map(t => ({ text: t })), answer: String(o.answer) },
  story: true,
});

const B = {
  // part-whole: join
  join: () => {
    const [a] = two(); const [she, her] = pron(a);
    const x = randInt(120, 680), y = randInt(105, 490);
    const ctx = pick([
      [`${a} has sh ${c(x)}.`, `${cap(her)} uncle gives ${she === 'she' ? 'her' : 'him'} sh ${c(y)}.`, `How much money does ${a} have now?`, 'sh'],
      [`A shop sells ${c(x)} loaves of bread on Monday.`, `It sells ${c(y)} loaves on Tuesday.`, 'How many loaves does it sell on the two days?', ''],
    ]);
    return item({ kind: 'join', question: `${ctx[0]} ${ctx[1]} ${ctx[2]}`, answer: x + y,
      hints: ['Draw two parts that make one whole. Is the whole known?', `The whole is ${c(x)} and ${c(y)} put together.`],
      steps: [`The two parts are ${c(x)} and ${c(y)}.`, `Put them together: ${c(x)} + ${c(y)} = ${c(x + y)}.`],
      misconceptions: [M(Math.abs(x - y), 'The story puts two amounts together, so add them.')],
      diagram: { type: 'bar', rows: [{ label: '', segs: [seg(x, c(x)), seg(y, c(y), 'b')] }], note: 'total = ?' } });
  },
  // part-whole: separate
  part: () => {
    const total = randInt(640, 1480), part = randInt(210, total - 180);
    const ctx = pick([
      [`A school has ${c(total)} learners.`, `${c(part)} of them are girls.`, 'How many boys are there?'],
      [`A farmer harvests ${c(total)} kg of maize.`, `She sells ${c(part)} kg at the market.`, 'How many kilograms are left?'],
      [`A water tank holds ${c(total)} litres.`, `The school uses ${c(part)} litres.`, 'How many litres are left in the tank?'],
    ]);
    return item({ kind: 'part', question: ctx.join(' '), answer: total - part,
      hints: ['The whole is known. One part is known. What is the other part?', `Take the known part from the whole: ${c(total)} − ${c(part)}.`],
      steps: [`The whole is ${c(total)}; one part is ${c(part)}.`, `The other part is ${c(total)} − ${c(part)} = ${c(total - part)}.`],
      misconceptions: [M(total + part, 'The whole is already given. Take the part away from it; don’t add.')],
      diagram: { type: 'bar', rows: [{ label: '', segs: [seg(part, c(part)), seg(total - part, '?', 'q')] }], note: `whole = ${c(total)}` } });
  },
  // comparison: more than
  compare: () => {
    const [a, b] = two(); const x = randInt(24, 90), d = randInt(9, 45);
    const thing = pick(['mangoes', 'eggs', 'oranges', 'exercise books', 'bottle tops']);
    if (Math.random() < 0.5) {
      return item({ kind: 'compare', question: `${a} has ${x} ${thing}. ${b} has ${d} more ${thing} than ${a}. How many ${thing} does ${b} have?`, answer: x + d,
        hints: [`Draw ${a}'s bar. ${b}'s bar is the same, plus ${d} more.`, `${b} has ${x} + ${d}.`],
        steps: [`${b} has the same as ${a} (${x}) and ${d} more.`, `${x} + ${d} = ${x + d}.`],
        misconceptions: [M(x - d, `"More than" means ${b} has MORE than ${a}. Add the ${d} on.`)],
        diagram: { type: 'bar', rows: [{ label: a, segs: [seg(x, String(x))] }, { label: b, segs: [seg(x, String(x)), seg(d, `${d} more`, 'b')] }], note: `${b} = ?` } });
    }
    return item({ kind: 'compare', question: `${a} has ${x + d} ${thing}. ${b} has ${x} ${thing}. How many more ${thing} does ${a} have than ${b}?`, answer: d,
      hints: ['Put the two bars one above the other. The difference is the part that sticks out.', `Take the smaller from the bigger: ${x + d} − ${x}.`],
      steps: [`The bars are ${x + d} and ${x}.`, `The difference is ${x + d} − ${x} = ${d}.`],
      misconceptions: [M(2 * x + d, '"How many more" asks for the difference between them, not the total.')],
      diagram: { type: 'bar', rows: [{ label: a, segs: [seg(x, String(x)), seg(d, '?', 'q')] }, { label: b, segs: [seg(x, String(x))] }], note: '' } });
  },
  // multiplicative comparison
  times: () => {
    const [a, b] = two(); const k = randInt(2, 5), u = randInt(6, 25), tot = u * (k + 1);
    const thing = pick(['goats', 'chickens', 'books', 'shillings']);
    const moneyish = thing === 'shillings';
    const q = moneyish
      ? `${a} has ${k} times as much money as ${b}. Together they have sh ${c(tot)}. How much does ${a} have?`
      : `${a} has ${k} times as many ${thing} as ${b}. Together they have ${tot} ${thing}. How many ${thing} does ${a} have?`;
    return item({ kind: 'times', question: q, answer: k * u,
      hints: [`Draw ${b}'s bar as 1 box and ${a}'s as ${k} boxes. How many boxes altogether?`, `${k + 1} boxes are ${tot}. One box is ${tot} ÷ ${k + 1}.`],
      steps: [`${b} has 1 box, ${a} has ${k} boxes: ${k + 1} boxes altogether.`, `1 box = ${tot} ÷ ${k + 1} = ${u}.`, `${a} has ${k} × ${u} = ${k * u}.`],
      misconceptions: [M(Math.round(tot / k), `There are ${k + 1} equal boxes altogether, not ${k}.`), M(u, `That is ${b}'s amount (1 box). ${a} has ${k} boxes.`)],
      diagram: { type: 'bar', rows: [{ label: a, segs: Array.from({ length: k }, () => seg(1, '', 'a')) }, { label: b, segs: [seg(1, '', 'b')] }], note: `all ${k + 1} boxes = ${c(tot)}` } });
  },
  // fraction of an amount
  fractionOf: () => {
    const [a] = two(); const [she] = pron(a);
    const [n, d] = pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [3, 8], [5, 8]]); const u = randInt(4, 18), N = u * d;
    const ctx = pick([
      [`A farmer has ${N} bags of maize.`, `She sells ${n}/${d} of them.`, 'How many bags does she sell?'],
      [`${a} has sh ${c(N)}.`, `${cap(she)} spends ${n}/${d} of it on books.`, `How much does ${a} spend?`],
      [`A class has ${N} learners.`, `${n}/${d} of them walk to school.`, 'How many learners walk to school?'],
    ]);
    return item({ kind: 'fraction', question: ctx.join(' '), answer: n * u,
      hints: [`Split the bar into ${d} equal boxes. What is one box worth?`, `One box is ${N} ÷ ${d} = ${u}. Now take ${n} boxes.`],
      steps: [`${d} equal boxes make ${N}, so 1 box = ${N} ÷ ${d} = ${u}.`, `${n} boxes = ${n} × ${u} = ${n * u}.`],
      misconceptions: [M(N / n, `Split into ${d} equal parts first (the bottom number), then take ${n} of them.`), M(u, `That is one box (1/${d}). The question asks for ${n}/${d}: take ${n} boxes.`)],
      diagram: { type: 'bar', rows: [{ label: '', segs: Array.from({ length: d }, (_, i) => seg(1, '', i < n ? 'a' : 'b')) }], note: `whole = ${c(N)}` } });
  },
  // fraction left: find the whole
  fractionLeft: () => {
    const [a] = two(); const [she, her] = pron(a);
    const [n, d] = pick([[1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [3, 8]]); const u = randInt(20, 90) * 2, left = u * (d - n);
    return item({ kind: 'fraction-left', question: `${a} spends ${n}/${d} of ${her} money on a school bag. ${cap(she)} has sh ${c(left)} left. How much did ${she} have at first?`, answer: u * d,
      hints: [`Split the bar into ${d} boxes. ${n} are spent. How many boxes are left?`, `${d - n} boxes are sh ${c(left)}. What is 1 box?`],
      steps: [`Spent ${n} of ${d} boxes, so ${d - n} boxes are left.`, `${d - n} boxes = sh ${c(left)}, so 1 box = sh ${c(u)}.`, `At first: ${d} boxes = ${d} × ${c(u)} = sh ${c(u * d)}.`],
      misconceptions: [
        ...(Number.isInteger((left / n) * d) ? [M((left / n) * d, `The sh ${c(left)} is what is LEFT, which is ${d - n} boxes, not ${n}.`)] : []),
        ...(Number.isInteger(left + (left * n) / d) ? [M(left + (left * n) / d, `Find what 1 box is worth first: the money left fills ${d - n} of the ${d} boxes.`)] : []),
        ...(n * 2 !== d ? [M(left * 2, 'Doubling is only right when exactly half was spent. Use the boxes.')] : []),
      ],
      diagram: { type: 'bar', rows: [{ label: '', segs: Array.from({ length: d }, (_, i) => seg(1, i === n ? `left = ${c(left)}` : '', i < n ? 'a' : 'b')) }], note: 'at first = ?' } });
  },
  // ratio share
  ratio: () => {
    const [a, b] = two(); const x = randInt(1, 4), y = randInt(x + 1, 7), u = randInt(5, 40) * 10, N = u * (x + y);
    const ctx = pick([`${a} and ${b} share sh ${c(N)} in the ratio ${x}:${y}.`, `A harambee raises sh ${c(N)}. It is shared between a school and a clinic in the ratio ${x}:${y}.`]);
    const who = ctx.startsWith('A harambee') ? 'the clinic' : b;
    return item({ kind: 'ratio', question: `${ctx} How much does ${who} get?`, answer: u * y,
      hints: [`Draw ${x} boxes and ${y} boxes. How many boxes altogether?`, `${x + y} boxes = sh ${c(N)}. Find 1 box.`],
      steps: [`${x} + ${y} = ${x + y} equal boxes.`, `1 box = ${c(N)} ÷ ${x + y} = sh ${c(u)}.`, `${cap(who)} gets ${y} boxes: ${y} × ${c(u)} = sh ${c(u * y)}.`],
      misconceptions: [M(u * x, `That is the other share (${x} boxes). ${cap(who)} gets ${y} boxes.`), M(N / 2, 'A ratio share is not half each. Count the boxes in the ratio.'), M(Math.round(N * y / (x + y + 1)), `Add the parts of the ratio: ${x} + ${y}.`)],
      diagram: { type: 'bar', rows: [{ label: ctx.startsWith('A harambee') ? 'school' : a, segs: Array.from({ length: x }, () => seg(1, '', 'b')) }, { label: ctx.startsWith('A harambee') ? 'clinic' : b, segs: Array.from({ length: y }, () => seg(1, '', 'a')) }], note: `all boxes = sh ${c(N)}` } });
  },
  // percentage off
  percentOff: () => {
    const p = pick([10, 20, 25, 50]), price = pick([400, 600, 800, 1200, 1500, 2000, 2400]) ;
    const thing = pick(['A school bag', 'A pair of shoes', 'A radio', 'A jacket']);
    const off = (price * p) / 100, parts = 100 / p;
    return item({ kind: 'percent', question: `${thing} costs sh ${c(price)}. In a sale it is ${p}% off. What is the sale price?`, answer: price - off,
      hints: [`${p}% is 1 of ${parts} equal parts. What is one part worth?`, `${p}% of ${c(price)} is ${c(off)}. Take it off the price.`],
      steps: [`${p}% of ${c(price)} = ${c(off)}.`, `Sale price = ${c(price)} − ${c(off)} = sh ${c(price - off)}.`],
      misconceptions: [M(off, 'That is the discount (the amount taken off). The question asks for the price you pay.'), M(price - p, `${p}% off is not ${p} shillings off. Find ${p}% of the price first.`)],
      diagram: { type: 'bar', rows: [{ label: '', segs: Array.from({ length: parts }, (_, i) => seg(1, i === 0 ? `${p}% off` : '', i === 0 ? 'q' : 'a')) }], note: `whole = sh ${c(price)}` } });
  },
  // KPSEA-style shopping with change
  shopping: () => {
    const [a] = two(); const [she] = pron(a);
    const sugar = pick([140, 150, 160, 180]), kg = randInt(2, 3), bread = pick([55, 65, 70, 80]), flour = pick([180, 210, 230]);
    const cost = sugar * kg + bread + flour, notes = cost <= 500 ? 1 : 2, paid = notes * 500;
    return item({ kind: 'shopping', question: `${a} buys ${kg} kg of sugar at sh ${sugar} a kg, a loaf of bread for sh ${bread} and a packet of flour for sh ${flour}. ${cap(she)} pays with ${notes === 1 ? 'a sh 500 note' : 'two sh 500 notes'}. How much change does ${she} get?`, answer: paid - cost,
      hints: ['Find the total cost first. How much is the sugar alone?', `Sugar is ${kg} × ${sugar} = ${sugar * kg}. Add the bread and flour, then take the total from ${paid}.`],
      steps: [`Sugar: ${kg} × ${sugar} = sh ${sugar * kg}.`, `Total: ${sugar * kg} + ${bread} + ${flour} = sh ${cost}.`, `Change: ${paid} − ${cost} = sh ${paid - cost}.`],
      misconceptions: [M(paid - (sugar + bread + flour), `Sugar is ${kg} kg at sh ${sugar} EACH kg.`), M(cost, 'That is what she spends. The question asks for the change.'), M(paid - cost + flour, 'Check that every item is in the total.'), ...(notes === 2 ? [M(500 - cost, 'Two notes of sh 500 make sh 1,000.')] : [])],
      diagram: { type: 'bar', rows: [{ label: 'paid', segs: [seg(sugar * kg, `sugar ${sugar * kg}`), seg(bread + flour, `${bread} + ${flour}`, 'b'), seg(Math.max(paid - cost, 40), 'change ?', 'q')] }], note: `paid = sh ${c(paid)}` } });
  },
  // equal groups (× and ÷)
  groups: () => {
    const g = randInt(6, 12), n = randInt(12, 36);
    if (Math.random() < 0.5) return item({ kind: 'groups', question: `A hall has ${g} rows of chairs. Each row has ${n} chairs. How many chairs are there?`, answer: g * n,
      hints: [`${g} equal groups of ${n}. Is that + or ×?`, `${g} × ${n}.`], steps: [`${g} rows of ${n} is ${g} × ${n} = ${g * n}.`],
      misconceptions: [M(g + n, `There are ${g} rows, and EACH has ${n}: that is ${g} lots of ${n}.`)],
      diagram: { type: 'bar', rows: [{ label: '', segs: Array.from({ length: Math.min(g, 12) }, () => seg(1, String(n), 'a')) }], note: 'total = ?' } });
    return item({ kind: 'groups', question: `A teacher shares ${g * n} exercise books equally among ${g} groups. How many books does each group get?`, answer: n,
      hints: [`Split the bar into ${g} equal boxes.`, `${g * n} ÷ ${g}.`], steps: [`${g * n} ÷ ${g} = ${n} books each.`],
      misconceptions: [M(g * n - g, 'Sharing equally means dividing, not taking away.')],
      diagram: { type: 'bar', rows: [{ label: '', segs: Array.from({ length: Math.min(g, 12) }, () => seg(1, '?', 'q')) }], note: `total = ${g * n}` } });
  },
};

const MAP = {
  G4_ADD: ['join'], G5_ADDITION: ['join'], G4_SUB: ['part', 'compare'], G5_SUBTRACTION: ['part', 'compare'],
  G4_MULTIPLY: ['groups'], G5_MULTIPLICATION: ['groups', 'times'], G4_DIVIDE: ['groups'], G5_DIVISION: ['groups', 'times'],
  G4_MONEY: ['shopping', 'join'], G5_MONEY: ['shopping'], G6_MONEY: ['shopping', 'percentOff'], G7_MONEY: ['shopping', 'percentOff'],
  G4_FRACTIONS: ['fractionOf'], G5_FRACTIONS_INTRO: ['fractionOf'], G6_FRACTIONS_MUL: ['fractionOf', 'fractionLeft'],
  G7_FRACTIONS_MUL: ['fractionLeft'], G7_FRACTIONS_DIV: ['fractionLeft'],
  G6_RATIOS: ['ratio', 'times'], G8_RATIO_PROPORTION: ['ratio'],
  G6_PERCENTAGES_INTRO: ['percentOff'], G7_PERCENTAGES: ['percentOff'], G8_PERCENTAGE_CHANGE: ['percentOff'],
  G7_EQUATIONS_FORM: ['times'],
};

export const hasWordProblem = (skillId) => !!MAP[skillId];
export function wordProblemFor(skillId) {
  const k = MAP[skillId]; if (!k) return null;
  const p = B[pick(k)]();
  // Only answers a child could really write: positive, and whole when the
  // answer is whole (no "11.67" options).
  const whole = Number.isInteger(Number(p.answer));
  p.misconceptions = (p.misconceptions || []).filter(m => { const v = Number(m.when); return v > 0 && Number.isFinite(v) && v !== Number(p.answer) && (!whole || Number.isInteger(v)); });
  return p;
}
export const WORD_KINDS = Object.keys(B);
export const WORD_BUILDERS = B;
