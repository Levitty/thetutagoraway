// ============================================================================
// QUESTION FAMILIES, GRADES 1 TO 3 (the youngest learners).
// Real Kenyan lower-primary papers ask short stories (had some, got some, how
// many now), comparison sentences, skip-counting gaps, naming shapes and
// reading the day or the hour. HOREB's own drills were bare sums. Every family
// here is `young: true`: the lesson reads it aloud and offers big buttons, so
// the answer is a whole number (the lesson builds three buttons from the first
// `wrong` value) or at most three short options. No parts, working or tables.
// ============================================================================
import { randInt, pick } from '../schema.js';
import { family, commas } from './core.js';
import { person, sh, price } from './kenya.js';

const fam = (def) => family({ reviewed: false, young: true, ...def });
const distinct = (...v) => new Set(v).size === v.length;
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = randInt(0, i); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const opts = (items, rightText, why) => items.map(t => ({ text: t, right: t === rightText, why: t === rightText ? undefined : (typeof why === 'function' ? why(t) : why) }));

export const FAMILIES = [
  // ================================================================ GRADE 1
  fam({ id: 'g1.add.got-more', skill: 'G1_ADD', outcome: 'G1.ADD.0', rung: 1, form: 'word',
    draw: () => { const a = randInt(3, 12), b = randInt(2, 20 - a); return distinct(a, b, Math.abs(a - b), a + b - 1) && a + b <= 20 ? { a, b, p: person(), item: pick(['mangoes', 'books', 'stickers', 'marbles', 'oranges']) } : null; },
    make: ({ a, b, p, item }) => ({
      question: `There are ${a} birds on a tree. ${b} more birds fly in. How many birds are on the tree now?`,
      answer: a + b,
      wrong: [[a + b - 1, `Count on from ${a}. Do not count ${a} itself again.`], [Math.abs(a - b), 'Getting more means the number grows. Add, do not take away.'], [a, `More birds came, so there are more than at the start.`]],
      hints: ['Start with how many there were. Then count on.', 'Getting more means we put the two numbers together.'],
      steps: [`There are ${a} birds. ${b} more come.`, `${a} + ${b} = ${a + b}.`] }),
    check: ({ a, b }, ans) => ans - b === a }),

  fam({ id: 'g1.add.how-many-more', skill: 'G1_ADD', outcome: 'G1.ADD.0', rung: 1, form: 'word',
    draw: () => { const t = randInt(8, 20), a = randInt(3, t - 3); return distinct(t - a, t - a + 1, a, t + a) ? { t, a, p: person() } : null; },
    make: ({ t, a, p }) => ({
      question: `${p.name} has ${a} stickers. ${p.She} wants ${t}. How many more stickers does ${p.she} need?`,
      answer: t - a,
      wrong: [[t - a + 1, `Count up from ${a} to ${t}. Do not count ${a} itself.`], [a, `That is how many ${p.she} has now. Ask how many are still missing.`], [t + a, 'Do not put the two numbers together. Find the gap between them.']],
      hints: ['Count up from the number you have to the number you want.', 'How many steps is that?'],
      steps: [`Count on from ${a} to ${t}.`, `${a} + ${t - a} = ${t}, so ${t - a} more.`] }),
    check: ({ t, a }, ans) => a + ans === t }),

  fam({ id: 'g1.sub.gave-away', skill: 'G1_SUB', outcome: 'G1.SUB.0', rung: 1, form: 'word',
    draw: () => { const a = randInt(6, 20), b = randInt(2, a - 2); return distinct(a, b, a - b, a - b + 1, a + b) ? { a, b, p: person(), item: pick(['sweets', 'mandazi', 'pencils', 'bananas', 'balls']) } : null; },
    make: ({ a, b, p, item }) => ({
      question: `${p.name} has ${a} ${item}. ${p.She} gives ${b} to a friend. How many ${item} are left?`,
      answer: a - b,
      wrong: [[a - b + 1, `Count back ${b} from ${a}. Do not count ${a} itself.`], [a + b, 'Giving away means fewer are left. Take away, do not add.'], [b, `That is how many ${p.she} gave. Ask how many ${p.she} still has.`]],
      hints: ['Start with how many there were. Then count back.', 'Giving away means taking away.'],
      steps: [`${p.name} starts with ${a} and gives away ${b}.`, `${a} − ${b} = ${a - b}.`] }),
    check: ({ a, b }, ans) => ans + b === a }),

  fam({ id: 'g1.sub.how-many-ate', skill: 'G1_SUB', outcome: 'G1.SUB.0', rung: 2, form: 'word',
    draw: () => { const a = randInt(8, 20), left = randInt(2, a - 3); return distinct(a, left, a - left, a + left, a - left + 1) ? { a, left, p: person() } : null; },
    make: ({ a, left, p }) => ({
      question: `${p.name} buys ${a} mandazi and eats some. ${left} mandazi are left. How many did ${p.she} eat?`,
      answer: a - left,
      wrong: [[a - left + 1, `Count up from ${left} to ${a}. Do not count ${left} itself.`], [left, `That is how many are left. Ask how many were eaten.`], [a + left, 'Do not put the numbers together. Find how many went.']],
      hints: ['Some were eaten, so fewer are left than at the start.', `How many must you take from ${a} to get ${left}?`],
      steps: [`${p.name} started with ${a} and has ${left} left.`, `${a} − ${left} = ${a - left} eaten.`] }),
    check: ({ a, left }, ans) => left + ans === a }),

  fam({ id: 'g1.counting.ten-more', skill: 'G1_COUNTING', outcome: 'G1.WHOLE.0', rung: 1, form: 'direct',
    draw: () => ({ n: randInt(11, 40) }),
    make: ({ n }) => ({ story: false, question: `${person().name} counts in tens, starting at ${n}. What number comes next?`,
      answer: n + 10,
      wrong: [[n + 1, 'That is only one more. Ten more is one whole ten.'], [n - 10, 'More means the number grows. Count up, not down.'], [n + 20, 'That is two tens. Only one ten more is needed.']],
      hints: ['Ten more means one more ten.', 'Keep the ones digit the same. Change the tens digit.'],
      steps: [`${n} has ${Math.floor(n / 10)} tens and ${n % 10} ones.`, `One more ten gives ${Math.floor(n / 10) + 1} tens and ${n % 10} ones: ${n + 10}.`] }),
    check: ({ n }, ans) => ans - n === 10 }),

  fam({ id: 'g1.prenumber.skip-gap', skill: 'G1_PRENUMBER', outcome: 'G1.PRENUMBER.0', rung: 1, form: 'direct',
    draw: () => { const s = pick([2, 5, 10]); const a = s === 2 ? pick([2, 4, 6, 8]) : s === 5 ? pick([5, 10, 15]) : pick([10, 20]); return { s, a }; },
    make: ({ s, a }) => ({ story: false,
      question: `Count in ${s}s: ${a}, ${a + s}, __, ${a + 3 * s}, ${a + 4 * s}. Which number fills the gap?`,
      answer: a + 2 * s,
      wrong: [[a + 2 * s - 1, `Each step jumps by ${s}. Count on from the number before the gap.`], [a + 2 * s + 1, `Each step jumps by ${s}. Check with the number after the gap.`], [a + s, 'That number is already in the pattern, before the gap.']],
      hints: ['How far is it from one number to the next?', 'Add that jump to the number before the gap.'],
      steps: [`The numbers go up by ${s} each time.`, `${a + s} + ${s} = ${a + 2 * s}.`] }),
    check: ({ s, a }, ans) => ans - (a + s) === s && a + 3 * s - ans === s }),

  fam({ id: 'g1.prenumber.bead-pattern', skill: 'G1_PRENUMBER', outcome: 'G1.PRENUMBER.0', rung: 1, form: 'word',
    draw: () => {
      const cols = shuffle(['red', 'blue', 'green', 'yellow']);
      const unit = pick([[0, 1], [0, 0, 1], [0, 1, 1], [0, 1, 2]]).map(i => cols[i]);
      const n = unit.length * 2 + randInt(1, unit.length - 1);
      return { p: person(), unit, n, extra: cols[3] };
    },
    make: ({ p, unit, n, extra }) => {
      const shown = Array.from({ length: n }, (_, i) => unit[i % unit.length]);
      const next = unit[n % unit.length];
      const set = [...new Set(unit)];
      if (set.length < 3) set.push(extra);
      return { question: `${p.name} threads beads: ${shown.join(', ')}. Which colour comes next?`,
        options: opts(set, next, 'Look at the pattern. Which colour comes after the last bead, where the pattern repeats?'),
        hints: ['Find the part of the pattern that repeats.', 'Look at the last bead. What came after it before?'],
        steps: [`The pattern repeats: ${unit.join(', ')}.`, `After ${shown[n - 1]} comes ${next}.`] };
    } }),

  fam({ id: 'g1.length.longest-of-three', skill: 'G1_LENGTH', outcome: 'G1.LENGTH.0', rung: 1, form: 'word',
    draw: () => { const all = [['pencil', 15], ['ruler', 30], ['rubber', 5], ['exercise book', 22], ['spoon', 18], ['shoe', 20]]; const three = shuffle(all).slice(0, 3); return { three, longest: Math.random() < 0.5 }; },
    make: ({ three, longest }) => {
      const vals = three.map(t => t[1]);
      const target = longest ? Math.max(...vals) : Math.min(...vals);
      const rightName = three.find(t => t[1] === target)[0];
      return { question: `${three.map(([n, v]) => `A ${n} is ${v} cm.`).join(' ')} Which is the ${longest ? 'longest' : 'shortest'}?`,
        options: opts(three.map(t => t[0]), rightName, `Look at the numbers again. ${longest ? 'Longest' : 'Shortest'} means the ${longest ? 'biggest' : 'smallest'} number of cm.`),
        hints: [longest ? 'Longer things have more centimetres.' : 'Shorter things have fewer centimetres.', 'Compare the three numbers.'],
        steps: [`The lengths are ${vals.join(', ')} cm.`, `The ${longest ? 'biggest' : 'smallest'} is ${target} cm: the ${rightName}.`] };
    } }),

  fam({ id: 'g1.mass.lightest-chain', skill: 'G1_MASS', outcome: 'G1.MASS.0', rung: 2, form: 'word',
    draw: () => { const t = pick([['cow', 'goat', 'hen'], ['goat', 'hen', 'egg'], ['lorry', 'bicycle', 'shoe'], ['donkey', 'dog', 'rabbit']]); return { t, heavy: Math.random() < 0.5, order: Math.random() < 0.5 }; },
    make: ({ t, heavy, order }) => {
      const art = (n) => (/^[aeiou]/.test(n) ? 'an' : 'a') + ' ' + n;
      const s1 = `${art(t[0])} is heavier than ${art(t[1])}.`, s2 = `${art(t[1])} is heavier than ${art(t[2])}.`;
      const cap = (s) => s[0].toUpperCase() + s.slice(1);
      const right = heavy ? t[0] : t[2];
      return { question: `${cap(order ? s1 : s2)} ${cap(order ? s2 : s1)} Which is the ${heavy ? 'heaviest' : 'lightest'}?`,
        options: opts(t, right, 'Put the two sentences together in a line, from heavy to light.'),
        hints: ['Put the things in a line from heavy to light.', `The ${heavy ? 'heaviest' : 'lightest'} is at one end of the line.`],
        steps: [`In order: ${t[0]}, ${t[1]}, ${t[2]} (heavy to light).`, `The ${heavy ? 'heaviest' : 'lightest'} is the ${right}.`] };
    } }),

  fam({ id: 'g1.cap.holds-more', skill: 'G1_CAPACITY', outcome: 'G1.CAP.0', rung: 1, form: 'word',
    draw: () => { const pr = pick([['jug', 'bottle'], ['pot', 'mug'], ['basin', 'bowl'], ['kettle', 'teapot']]); const a = randInt(2, 12), b = Math.random() < 0.2 ? a : randInt(2, 12); return { pr, a, b, more: Math.random() < 0.5 }; },
    make: ({ pr, a, b, more }) => {
      const right = a === b ? 'same' : (more ? (a > b ? pr[0] : pr[1]) : (a < b ? pr[0] : pr[1]));
      return { question: `A ${pr[0]} holds ${a} cups. A ${pr[1]} holds ${b} cups. Which holds ${more ? 'more' : 'less'}?`,
        options: opts([pr[0], pr[1], 'same'], right, a === b ? 'Both hold the same number of cups.' : `Compare ${a} and ${b}. ${more ? 'More' : 'Less'} cups means ${more ? 'a bigger' : 'a smaller'} number.`),
        hints: ['The number of cups tells how much it holds.', more ? 'Holds more means more cups.' : 'Holds less means fewer cups.'],
        steps: [`The ${pr[0]} holds ${a} cups and the ${pr[1]} holds ${b} cups.`, a === b ? 'The numbers are the same.' : `${a > b ? a : b} is bigger than ${a > b ? b : a}, so the answer is the ${right}.`] };
    } }),

  fam({ id: 'g1.time.days-ahead', skill: 'G1_TIME', outcome: 'G1.TIME.0', rung: 1, form: 'word',
    draw: () => ({ i: randInt(0, 6), k: randInt(2, 4) }),
    make: ({ i, k }) => {
      const right = DAYS[(i + k) % 7];
      return { question: `Today is ${DAYS[i]}. What day will it be in ${k} days?`,
        options: opts([DAYS[(i + k - 1) % 7], right, DAYS[(i + k + 1) % 7]], right, 'Count on one day at a time. Say "tomorrow" for the first day.'),
        hints: ['Say the days in order, starting from tomorrow.', `Count on ${k} days.`],
        steps: [`Count on from ${DAYS[i]}: ${Array.from({ length: k }, (_, j) => DAYS[(i + j + 1) % 7]).join(', ')}.`, `So it will be ${right}.`] };
    } }),

  fam({ id: 'g1.time.hours-to-wait', skill: 'G1_TIME', outcome: 'G1.TIME.0', rung: 1, form: 'word',
    draw: () => { const now = randInt(2, 8), k = randInt(1, 4); return distinct(k, k + 1, now + k, now) && now !== k + 1 ? { now, k, p: person() } : null; },
    make: ({ now, k, p }) => ({
      question: `Break is at ${now + k} o'clock. It is ${now} o'clock now. How many hours until break, ${p.name}?`,
      answer: k,
      wrong: [[k + 1, `Count the jumps from ${now} to ${now + k}. Do not count ${now} itself.`], [now + k, 'That is the time of break. Ask how many hours are between now and then.'], [now, 'That is the time now. Count the hours to break.']],
      hints: ['Count on, one hour at a time.', 'Start at the time now and stop at break time.'],
      steps: [`Count on from ${now} o'clock to ${now + k} o'clock.`, `That is ${k} hours.`] }),
    check: ({ now, k }, ans) => now + ans === now + k && ans > 0 }),

  fam({ id: 'g1.money.mixed-coins', skill: 'G1_MONEY', outcome: 'G1.MONEY.0', rung: 2, form: 'word',
    draw: () => ({ a: randInt(1, 3), b: randInt(1, 4), p: person() }),
    make: ({ a, b, p }) => ({
      question: `${p.name} pays with ${a} ten-shilling coin${a > 1 ? 's' : ''} and ${b} five-shilling coin${b > 1 ? 's' : ''}. How many shillings is that?`,
      answer: 10 * a + 5 * b,
      wrong: [[a + b, 'That counts the coins. Count the shillings they are worth.'], [10 * (a + b), 'The 5 shilling coins are worth less than 10. Count them by 5.'], [5 * (a + b), 'The 10 shilling coins are worth more than 5. Count them by 10.']],
      hints: ['Count the 10 shilling coins first: 10, 20, ...', 'Then count on by 5 for the other coins.'],
      steps: [`${a} coin${a > 1 ? 's' : ''} of 10 shillings make ${10 * a} shillings.`, `Then count on ${b} fives: ${10 * a + 5 * b} shillings.`] }),
    check: ({ a, b }, ans) => (ans - 5 * b) / 10 === a }),

  fam({ id: 'g1.lines.curved-edge', skill: 'G1_LINES', outcome: 'G1.LINES.0', rung: 1, form: 'direct',
    draw: () => {
      const ask = Math.random() < 0.5; // true: which is curved
      const curved = shuffle(['plate', 'wheel', 'coin', 'bangle']), straight = shuffle(['ruler', 'book', 'window', 'table top']);
      return { ask, three: ask ? [curved[0], straight[0], straight[1]] : [straight[0], curved[0], curved[1]], right: ask ? curved[0] : straight[0] };
    },
    make: ({ ask, three, right }) => ({ story: false,
      question: `Which one has a ${ask ? 'curved' : 'straight'} edge: ${three.join(', ')}?`,
      options: opts(three, right, ask ? 'This edge goes straight. A curved edge bends round.' : 'This edge bends round. A straight edge does not bend.'),
      hints: ['Think of the edge. Does it bend, or go straight?', 'A wheel and a coin are round.'],
      steps: [`A curved edge bends round, like a wheel. A straight edge does not bend, like a ruler.`, `The ${right} has the ${ask ? 'curved' : 'straight'} edge.`] }) }),

  fam({ id: 'g1.shapes.which-shape', skill: 'G1_SHAPES', outcome: 'G1.SHAPES.0', rung: 1, form: 'direct',
    draw: () => {
      const q = pick([{ t: 'has no corners', r: 'circle' }, { t: 'has 3 sides', r: 'triangle' }, { t: 'has 4 sides that are all equal', r: 'square' }, { t: 'has 4 sides, 2 long and 2 short', r: 'rectangle' }, { t: 'has 3 corners', r: 'triangle' }]);
      const others = shuffle(['circle', 'triangle', 'square', 'rectangle'].filter(s => s !== q.r)).slice(0, 2);
      return { q, three: [q.r, ...others] };
    },
    make: ({ q, three }) => ({ story: false, question: `A shape ${q.t}. Pick it.`,
      options: opts(three, q.r, `That shape does not fit. Count its sides and corners.`),
      hints: ['Picture each shape. Count its sides and corners.', 'A circle is round with no corners.'],
      steps: [`Think about each shape: a circle has no corners, a triangle has 3 sides, a square has 4 equal sides.`, `The answer is the ${q.r}.`] }) }),

  // ================================================================ GRADE 2
  fam({ id: 'g2.add.make-100', skill: 'G2_ADD', outcome: 'G2.ADD.0', rung: 2, form: 'word',
    draw: () => { const a = pick([35, 40, 45, 55, 60, 65, 70, 75, 85, 90, 95]); return { a, p: person() }; },
    make: ({ a, p }) => ({
      question: `${p.name} has ${sh(a)}. ${p.She} needs ${sh(100)} for a book. How much more does ${p.she} need?`,
      answer: 100 - a,
      wrong: [[110 - a, 'Count up from the tens first, then the ones. One ten too many was counted.'], [90 - a, 'Count up from the tens first, then the ones. One ten too few was counted.'], [a, 'That is the money already saved. Ask how much is missing.']],
      hints: ['Count up from the money to the next ten, then to 100.', 'Add the two jumps together.'],
      steps: [`Count on from ${a} to 100.`, `${a} + ${100 - a} = 100, so ${sh(100 - a)} more.`] }),
    check: ({ a }, ans) => a + ans === 100 }),

  fam({ id: 'g2.sub.how-many-fewer', skill: 'G2_SUB', outcome: 'G2.SUB.0', rung: 2, form: 'word',
    draw: () => { const a = randInt(45, 99), b = randInt(15, a - 12); return a % 10 < b % 10 && distinct(a - b, a + b, a - b + 10, a - b - 10) ? { a, b } : null; },
    make: ({ a, b }) => ({
      question: `One shop has ${a} mangoes. Another shop has ${b} mangoes. How many fewer mangoes does the second shop have?`,
      answer: a - b,
      wrong: [[a - b + 10, 'Take care when you take the ones from the ones. Did you take one ten too few?'], [a - b - 10, 'Take care when you borrow a ten. Did you take one ten too many?'], [a + b, 'Fewer means the gap between the two. Take away, do not add.']],
      hints: ['Fewer means find the gap between the two numbers.', 'Take the smaller number from the bigger one.'],
      steps: [`The shops have ${a} and ${b} mangoes.`, `${a} − ${b} = ${a - b} fewer.`] }),
    check: ({ a, b }, ans) => b + ans === a }),

  fam({ id: 'g2.counting.skip-gap', skill: 'G2_COUNTING', outcome: 'G2.WHOLE.0', rung: 1, form: 'direct',
    draw: () => { const s = pick([5, 10]), back = Math.random() < 0.5, d = back ? -s : s; const a = back ? randInt(5, 9) * s + (s === 5 ? 0 : 0) : randInt(1, 6) * s; return a + 4 * d >= 0 && a + 4 * d <= 100 && a <= 100 ? { s, d, a } : null; },
    make: ({ s, d, a }) => ({ story: false,
      question: `Count ${d < 0 ? 'back' : 'on'} in ${s}s: ${a}, ${a + d}, __, ${a + 3 * d}, ${a + 4 * d}. What is the missing number?`,
      answer: a + 2 * d,
      wrong: [[a + 2 * d + 1, `Each jump is ${s}, not 1.`], [a + 2 * d - 1, `Each jump is ${s}, not 1.`], [a + 3 * d, 'That number is already in the pattern, after the gap.']],
      hints: ['Find the jump from one number to the next.', `Do the numbers go ${d < 0 ? 'down' : 'up'}?`],
      steps: [`The numbers go ${d < 0 ? 'down' : 'up'} by ${s} each time.`, `${a + d} ${d < 0 ? '−' : '+'} ${s} = ${a + 2 * d}.`] }),
    check: ({ s, d, a }, ans) => Math.abs(ans - (a + d)) === s && Math.abs(a + 3 * d - ans) === s }),

  fam({ id: 'g2.place.tens-and-ones', skill: 'G2_PLACE_VALUE', outcome: 'G2.WHOLE.0', rung: 1, form: 'direct',
    draw: () => { const t = randInt(2, 9), o = randInt(1, 9); return t !== o ? { t, o } : null; },
    make: ({ t, o }) => ({ story: false, question: `What number is ${t} tens and ${o} ones?`,
      answer: 10 * t + o,
      wrong: [[10 * o + t, 'The tens digit goes first. Check which digit is in the tens place.'], [t + o, 'That adds the digits. Each ten is worth 10.'], [100 * t + o, 'A ten is worth 10, not 100.']],
      hints: ['Each ten is worth 10. Count the tens first.', 'Then add the ones.'],
      steps: [`${t} tens is ${10 * t}.`, `${10 * t} + ${o} = ${10 * t + o}.`] }),
    check: ({ t, o }, ans) => Math.floor(ans / 10) === t && ans % 10 === o }),

  fam({ id: 'g2.mul.rows', skill: 'G2_MULTIPLY_INTRO', outcome: 'G2.MUL.0', rung: 1, form: 'word',
    draw: () => { const r = randInt(2, 5), c = pick([2, 3, 5, 10]); return distinct(r * c, r + c, r * c - c, r * c + c) ? { r, c } : null; },
    make: ({ r, c }) => ({
      question: `A farmer plants ${r} rows of maize. Each row has ${c} plants. How many plants are there?`,
      answer: r * c,
      wrong: [[r * c + c, `Count the rows again. There are only ${r} rows.`], [r * c - c, `Count the rows again. There are ${r} rows, not one less.`], [r + c, 'Do not add the two numbers. Add the plants row by row.']],
      hints: ['Each row has the same number of plants.', 'Add the row amounts: the same number again and again.'],
      steps: [`${r} rows with ${c} plants each.`, `${Array(r).fill(c).join(' + ')} = ${r * c}.`] }),
    check: ({ r, c }, ans) => ans / c === r }),

  fam({ id: 'g2.mul.legs', skill: 'G2_MULTIPLY_INTRO', outcome: 'G2.MUL.0', rung: 1, form: 'word',
    draw: () => { const an = pick([['hens', 2], ['goats', 4], ['cows', 4], ['ducks', 2]]); const n = randInt(3, 6); return distinct(n * an[1], n + an[1], n, n * an[1] + an[1]) ? { an, n } : null; },
    make: ({ an: [name, legs], n }) => ({
      question: `Each of the ${n} ${name} on the farm has ${legs} legs. How many legs are there altogether?`,
      answer: n * legs,
      wrong: [[n + legs, 'Do not add the two numbers. Count the legs animal by animal.'], [n, 'That is the number of animals. Count their legs.'], [n * legs + legs, `Count the animals again. There are only ${n}.`]],
      hints: ['Every animal has the same number of legs.', 'Add the legs animal by animal.'],
      steps: [`${n} animals with ${legs} legs each.`, `${Array(n).fill(legs).join(' + ')} = ${n * legs}.`] }),
    check: ({ an, n }, ans) => ans / n === an[1] }),

  fam({ id: 'g2.div.benches', skill: 'G2_DIVISION_INTRO', outcome: 'G2.DIV.0', rung: 1, form: 'word',
    draw: () => { const per = pick([2, 3, 4, 5]), k = randInt(3, 8); const tot = per * k; return distinct(k, tot - per, per, k + 1) ? { per, k, tot } : null; },
    make: ({ per, k, tot }) => ({
      question: `${tot} learners sit ${per} to a bench. How many benches do they need?`,
      answer: k,
      wrong: [[tot - per, `Take away ${per} again and again. Count how many times.`], [per, 'That is how many sit on one bench. Count how many benches.'], [k + 1, 'Count in groups. Do not count one extra bench.']],
      hints: [`Put the learners in groups of ${per}.`, 'Count the groups.'],
      steps: [`Each bench takes ${per} learners.`, `${per} × ${k} = ${tot}, so ${k} benches.`] }),
    check: ({ per, tot }, ans) => ans * per === tot }),

  fam({ id: 'g2.frac.half-of', skill: 'G2_FRACTIONS', outcome: 'G2.FRAC.0', rung: 1, form: 'word',
    draw: () => { const n = pick([8, 10, 12, 14, 16, 18, 20]); return distinct(n / 2, n, n - 2, n / 2 + 1) ? { n, a: person(), b: person() } : null; },
    make: ({ n, a, b }) => ({
      question: `${a.name} has ${n} mangoes. ${a.She} gives half of them to ${b.name}. How many mangoes does ${b.name} get?`,
      answer: n / 2,
      wrong: [[n, 'Half is not all of them. Share into two equal groups.'], [n - 2, 'Half means two equal groups. Share them one by one between two.'], [n / 2 + 1, 'Check the two groups are equal. One group has one too many.']],
      hints: ['Half means two equal groups.', 'Share the mangoes one by one into two groups.'],
      steps: [`Half means two equal groups of the ${n} mangoes.`, `${n} ÷ 2 = ${n / 2}.`] }),
    check: ({ n }, ans) => ans * 2 === n }),

  fam({ id: 'g2.length.which-unit', skill: 'G2_LENGTH', outcome: 'G2.LENGTH.0', rung: 1, form: 'direct',
    draw: () => { const it = pick([['a pencil', 'centimetres'], ['an exercise book', 'centimetres'], ['a rubber', 'centimetres'], ['a classroom', 'metres'], ['a football pitch', 'metres'], ['a school gate', 'metres']]); return { it }; },
    make: ({ it }) => ({ story: false, question: `Which unit is best for the length of ${it[0]}?`,
      options: opts(['centimetres', 'metres', 'kilometres'], it[1], (t) => (t === 'kilometres' ? 'A kilometre is for long roads between places. This is much shorter.' : t === 'metres' ? 'A metre is as long as a big step. This is much smaller than that.' : 'A centimetre is very small. This is much longer than that.')),
      hints: ['Think how long it is. Is it as small as your finger, or as big as a room?', 'Small things use centimetres. Bigger things use metres.'],
      steps: [`${it[0][0].toUpperCase() + it[0].slice(1)} is ${it[1] === 'metres' ? 'big, so we count in metres' : 'small, so we count in centimetres'}.`, `The best unit is ${it[1]}.`] }) }),

  fam({ id: 'g2.cap.buckets-fill', skill: 'G2_CAPACITY', outcome: 'G2.CAP.0', rung: 1, form: 'word',
    draw: () => { const j = pick([2, 5, 10]), k = randInt(3, 6); return { j, k, tot: j * k }; },
    make: ({ j, k, tot }) => ({
      question: `A bucket holds ${j} litres. A drum holds ${tot} litres. How many full buckets fill the drum?`,
      answer: k,
      wrong: [[tot - j, `Count how many buckets of ${j} litres fit. Do not take away once.`], [j, 'That is the size of one bucket. Count how many buckets.'], [k + 1, 'Count the buckets again. One bucket too many.']],
      hints: [`Each bucket pours ${j} litres.`, 'Count in jumps until you reach the drum.'],
      steps: [`Count in ${j}s up to ${tot}.`, `${j} × ${k} = ${tot}, so ${k} buckets.`] }),
    check: ({ j, tot }, ans) => ans * j === tot }),

  fam({ id: 'g2.time.weeks-days', skill: 'G2_TIME', outcome: 'G2.TIME.0', rung: 2, form: 'word',
    draw: () => ({ w: randInt(2, 4), p: person() }),
    make: ({ w, p }) => ({
      question: `${p.name}'s holiday is ${w} weeks long. How many days is that?`,
      answer: 7 * w,
      wrong: [[w + 7, 'There are 7 days in each week. Count 7 for every week.'], [5 * w, 'A week has 7 days. Weekends are days too.'], [7, 'That is only one week. Count all the weeks.']],
      hints: ['How many days are in one week?', 'Add that for each week.'],
      steps: [`One week is 7 days.`, `${Array(w).fill(7).join(' + ')} = ${7 * w} days.`] }),
    check: ({ w }, ans) => ans / 7 === w }),

  fam({ id: 'g2.money.two-things', skill: 'G2_MONEY', outcome: 'G2.MONEY.0', rung: 1, form: 'word',
    draw: () => { const items = shuffle(['pencil', 'pen', 'rubber', 'ruler', 'exercise book', 'chapati', 'mango']).slice(0, 2); const pa = price(items[0]), pb = price(items[1]); const s = pa + pb; return s <= 100 && distinct(s, Math.abs(pa - pb), s + 10, s - 10, pa, pb) ? { items, pa, pb } : null; },
    make: ({ items, pa, pb }) => {
      const art = (n) => (/^[aeiou]/.test(n) ? 'an ' : 'a ') + n;
      const cap = (s) => s[0].toUpperCase() + s.slice(1);
      return { question: `${cap(art(items[0]))} costs ${sh(pa)}. ${cap(art(items[1]))} costs ${sh(pb)}. How much do they cost together?`,
        answer: pa + pb,
        wrong: [[Math.abs(pa - pb), 'Together means put the prices together. Add, do not take away.'], [pa + pb + 10, 'Check the tens when you add the ones. One ten too many was carried.'], [pa + pb - 10, 'Check the ones when you add them. A ten was left out.']],
        hints: ['Together means add the two prices.', 'Add the tens, then add the ones.'],
        steps: [`Add the two prices: ${pa} + ${pb}.`, `${pa} + ${pb} = ${pa + pb}, so ${sh(pa + pb)}.`] };
    },
    check: ({ pa, pb }, ans) => ans - pb === pa }),

  fam({ id: 'g2.shapes.tile-pattern', skill: 'G2_SHAPES', outcome: 'G2.SHAPES.0', rung: 2, form: 'word',
    draw: () => {
      const sh3 = shuffle(['circle', 'square', 'triangle', 'rectangle']);
      const unit = pick([[0, 1, 2], [0, 0, 1], [0, 1, 1]]).map(i => sh3[i]);
      const n = unit.length * 2 + randInt(1, unit.length - 1);
      return { p: person(), unit, n, spare: sh3[3] };
    },
    make: ({ p, unit, n, spare }) => {
      const shown = Array.from({ length: n }, (_, i) => unit[i % unit.length]);
      const next = unit[n % unit.length];
      const set = [...new Set(unit)]; if (set.length < 3) set.push(spare);
      return { question: `${p.name} lays floor tiles: ${shown.join(', ')}. Which tile comes next?`,
        options: opts(set, next, 'Find the part that repeats. Then see where the last tile is in it.'),
        hints: ['Look for the group of tiles that repeats.', 'Where does the last tile sit in the group?'],
        steps: [`The group that repeats is: ${unit.join(', ')}.`, `After the ${shown[n - 1]} comes the ${next}.`] };
    } }),

  // ================================================================ GRADE 3
  fam({ id: 'g3.count.build-number', skill: 'G3_COUNTING', outcome: 'G3.WHOLE.0', rung: 1, form: 'direct',
    draw: () => { const h = randInt(1, 9), t = randInt(1, 9), o = randInt(1, 9); const n = 100 * h + 10 * t + o; const w = [h + t + o, 100 * o + 10 * t + h, 100 * h + o]; return distinct(n, ...w) ? { h, t, o } : null; },
    make: ({ h, t, o }) => ({ story: false, question: `Write ${h} hundreds, ${t} tens and ${o} ones as a number.`,
      answer: 100 * h + 10 * t + o,
      wrong: [[100 * h + o, 'The tens were left out. Put each digit in its own place.'], [100 * o + 10 * t + h, 'The hundreds digit comes first. Check the order of the places.'], [h + t + o, 'That adds the digits. Each digit is worth its place: hundreds, tens, ones.']],
      hints: ['Write the hundreds digit first, then tens, then ones.', 'Each place needs one digit.'],
      steps: [`${h} hundreds is ${100 * h}, ${t} tens is ${10 * t}, ${o} ones is ${o}.`, `${100 * h} + ${10 * t} + ${o} = ${100 * h + 10 * t + o}.`] }),
    check: ({ h, t, o }, ans) => Math.floor(ans / 100) === h && Math.floor(ans / 10) % 10 === t && ans % 10 === o }),

  fam({ id: 'g3.count.greatest-of-three', skill: 'G3_COUNTING', outcome: 'G3.WHOLE.0', rung: 1, form: 'direct',
    draw: () => { const dg = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3); const perms = shuffle([[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]).slice(0, 3); return { nums: perms.map(p => 100 * dg[p[0]] + 10 * dg[p[1]] + dg[p[2]]), big: Math.random() < 0.5 }; },
    make: ({ nums, big }) => {
      const t = big ? Math.max(...nums) : Math.min(...nums);
      return { story: false, question: `Which number is the ${big ? 'greatest' : 'smallest'}: ${nums[0]}, ${nums[1]} or ${nums[2]}?`,
        options: opts(nums.map(String), String(t), 'Compare the hundreds digits first. If they match, compare the tens.'),
        hints: ['Look at the hundreds digit of each number first.', 'If two hundreds digits match, look at the tens.'],
        steps: [`Compare the hundreds digits: ${nums.map(n => Math.floor(n / 100)).join(', ')}.`, `The ${big ? 'greatest' : 'smallest'} is ${t}.`] };
    } }),

  fam({ id: 'g3.add.two-days', skill: 'G3_ADD', outcome: 'G3.ADD.0', rung: 1, form: 'word',
    draw: () => { const a = randInt(120, 480), b = randInt(110, 400); return a % 10 + b % 10 >= 10 && distinct(a + b, a + b - 10, Math.abs(a - b), a + b + 10) ? { a, b, item: pick(['loaves of bread', 'eggs', 'mandazi', 'exercise books']) } : null; },
    make: ({ a, b, item }) => ({
      question: `A shop sells ${a} ${item} on Monday and ${b} on Tuesday. How many is that altogether?`,
      answer: a + b,
      wrong: [[a + b - 10, 'The ones made a ten. Did you carry it to the tens?'], [Math.abs(a - b), 'Altogether means put the two days together. Add, do not take away.'], [a + b + 10, 'Check the carrying. Did you carry a ten twice?']],
      hints: ['Altogether means add the two numbers.', 'Add the ones first, then the tens, then the hundreds.'],
      steps: [`Add Monday and Tuesday: ${a} + ${b}.`, `${a} + ${b} = ${a + b}.`] }),
    check: ({ a, b }, ans) => ans - a === b }),

  fam({ id: 'g3.sub.trip', skill: 'G3_SUB', outcome: 'G3.SUB.0', rung: 1, form: 'word',
    draw: () => { const a = randInt(300, 900), b = randInt(110, a - 120); const dig = (n) => [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10]; const [x, y] = [dig(a), dig(b)]; const slip = 100 * Math.abs(x[0] - y[0]) + 10 * Math.abs(x[1] - y[1]) + Math.abs(x[2] - y[2]); return a % 10 < b % 10 && distinct(a - b, slip, a + b, a - b - 10) ? { a, b, slip } : null; },
    make: ({ a, b, slip }) => ({
      question: `A school has ${a} learners. ${b} learners go on a trip. How many learners stay at school?`,
      answer: a - b,
      wrong: [[slip, 'You took the smaller digit from the bigger one each time. Borrow a ten when the top digit is too small.'], [a + b, 'Stay means the ones who are left. Take away, do not add.'], [a - b - 10, 'Check your borrowing. Did you borrow a ten twice?']],
      hints: ['Staying behind means the rest after the trip.', 'Take the ones first. Borrow a ten if you need to.'],
      steps: [`Take the trip learners from all learners: ${a} − ${b}.`, `${a} − ${b} = ${a - b}.`] }),
    check: ({ a, b }, ans) => ans + b === a }),

  fam({ id: 'g3.mul.shelves', skill: 'G3_MULTIPLY', outcome: 'G3.MUL.0', rung: 1, form: 'word',
    draw: () => { const r = randInt(3, 9), c = randInt(3, 9); return r !== c && distinct(r * c, r + c, r * c - c, r * c + r) ? { r, c } : null; },
    make: ({ r, c }) => ({
      question: `A shop has ${r} shelves. Each shelf holds ${c} tins. How many tins is that?`,
      answer: r * c,
      wrong: [[r + c, 'Do not add the two numbers. Equal groups mean multiply.'], [r * c - c, `Count the shelves again. There are ${r}, not one less.`], [r * c + r, `Check the table. Each of the ${r} shelves holds ${c} tins.`]],
      hints: ['Each shelf holds the same number of tins.', `Use the ${c} times table.`],
      steps: [`${r} shelves with ${c} tins each.`, `${r} × ${c} = ${r * c}.`] }),
    check: ({ r, c }, ans) => ans / c === r }),

  fam({ id: 'g3.mul.buy-many', skill: 'G3_MULTIPLY', outcome: 'G3.MUL.0', rung: 2, form: 'word',
    draw: () => { const pr = price('mandazi'), n = randInt(3, 9); return distinct(pr * n, pr + n, pr * n - pr, pr * n + pr) ? { pr, n, p: person() } : null; },
    make: ({ pr, n, p }) => ({
      question: `A mandazi costs ${sh(pr)}. ${p.name} buys ${n} mandazi. How much does ${p.she} pay?`,
      answer: pr * n,
      wrong: [[pr + n, 'Do not add the price and the number. Each mandazi costs the same, so multiply.'], [pr * n - pr, `${p.She} buys ${n} mandazi, not one less.`], [pr * n + pr, `${p.She} buys ${n} mandazi, not one more.`]],
      hints: ['Every mandazi costs the same.', 'Multiply the price by how many are bought.'],
      steps: [`${n} mandazi at ${sh(pr)} each.`, `${n} × ${pr} = ${pr * n}, so ${sh(pr * n)}.`] }),
    check: ({ pr, n }, ans) => ans / n === pr }),

  fam({ id: 'g3.div.rope-pieces', skill: 'G3_DIVIDE', outcome: 'G3.DIV.0', rung: 1, form: 'word',
    draw: () => { const s = randInt(3, 9), k = randInt(3, 9); return s !== k && distinct(k, s, k + 1, s * k - s) ? { s, k, tot: s * k } : null; },
    make: ({ s, k, tot }) => ({
      question: `A rope is ${tot} metres long. It is cut into pieces of ${s} metres each. How many pieces are there?`,
      answer: k,
      wrong: [[tot - s, `Cutting one piece leaves ${tot - s} metres. Count how many pieces of ${s} metres fit.`], [s, 'That is the length of one piece. Count how many pieces.'], [k + 1, 'Check with the table. One piece too many.']],
      hints: [`How many ${s}s make ${tot}?`, `Think of the ${s} times table.`],
      steps: [`Find how many ${s}s are in ${tot}.`, `${tot} ÷ ${s} = ${k}.`] }),
    check: ({ s, tot }, ans) => ans * s === tot }),

  fam({ id: 'g3.frac.biggest-piece', skill: 'G3_FRACTIONS', outcome: 'G3.FRAC.0', rung: 2, form: 'direct',
    draw: () => ({ big: Math.random() < 0.5, food: pick(['chapatis', 'cakes', 'watermelons', 'pizzas']) }),
    make: ({ big, food }) => ({ question: `Mama cuts 3 same-size ${food}. One into halves, one into quarters, one into eighths. Which pieces are ${big ? 'the biggest' : 'the smallest'}?`,
      options: opts(['halves', 'quarters', 'eighths'], big ? 'halves' : 'eighths', big ? 'More equal pieces make each piece smaller. Which cut makes the fewest pieces?' : 'Fewer equal pieces make each piece bigger. Which cut makes the most pieces?'),
      hints: ['Cutting into more equal pieces makes each piece smaller.', 'Halves is 2 pieces, quarters is 4 pieces, eighths is 8 pieces.'],
      steps: ['Halves make 2 pieces, quarters 4 pieces and eighths 8 pieces.', big ? 'The fewest pieces are the biggest: halves.' : 'The most pieces are the smallest: eighths.'] }) }),

  fam({ id: 'g3.length.cut-rope', skill: 'G3_LENGTH', outcome: 'G3.LENGTH.0', rung: 2, form: 'word',
    draw: () => { const m = randInt(1, 3), c = pick([10, 20, 30, 40, 60, 70, 80, 90, 25, 35, 45]); return distinct(100 * m - c, 100 * m + c, 1000 * m - c, c) ? { m, c, p: person() } : null; },
    make: ({ m, c, p }) => ({
      question: `A rope is ${m} metre${m > 1 ? 's' : ''} long. ${p.name} cuts off ${c} centimetres. How many centimetres are left?`,
      answer: 100 * m - c,
      wrong: [[100 * m + c, 'Cutting off makes the rope shorter. Take away, do not add.'], [1000 * m - c, 'One metre is 100 centimetres, not 1,000.'], [c, 'That is the piece cut off. Ask how much is left.']],
      hints: ['Change the metres to centimetres first.', 'Then take away the piece that was cut off.'],
      steps: [`${m} m = ${100 * m} cm.`, `${100 * m} − ${c} = ${100 * m - c} cm.`] }),
    check: ({ m, c }, ans) => ans + c === 100 * m }),

  fam({ id: 'g3.cap.pour-buckets', skill: 'G3_CAPACITY', outcome: 'G3.CAP.0', rung: 2, form: 'word',
    draw: () => { const b = pick([4, 5, 6, 8, 10]), n = randInt(3, 9); return distinct(b * n, b + n, b * n - b, b * n + b) ? { b, n, p: person() } : null; },
    make: ({ b, n, p }) => ({
      question: `A bucket holds ${b} litres. ${p.name} pours ${n} full buckets into a tank. How many litres are in the tank?`,
      answer: b * n,
      wrong: [[b + n, 'Do not add the two numbers. Each full bucket holds the same, so multiply.'], [b * n - b, `${p.She} pours ${n} buckets, not one less.`], [b * n + b, `${p.She} pours ${n} buckets, not one more.`]],
      hints: ['Each bucket pours the same amount.', 'Multiply the litres in one bucket by the number of buckets.'],
      steps: [`${n} buckets with ${b} litres each.`, `${n} × ${b} = ${b * n} litres.`] }),
    check: ({ b, n }, ans) => ans / b === n }),

  fam({ id: 'g3.time.weeks-and-days', skill: 'G3_TIME', outcome: 'G3.TIME.0', rung: 2, form: 'word',
    draw: () => { const w = randInt(2, 5), d = randInt(1, 6); return distinct(7 * w + d, w + d, 7 * w, 7 * (w + d)) ? { w, d } : null; },
    make: ({ w, d }) => ({
      question: `A holiday lasts ${w} weeks and ${d} day${d > 1 ? 's' : ''}. How many days is that?`,
      answer: 7 * w + d,
      wrong: [[7 * w, `Do not forget the ${d} extra day${d > 1 ? 's' : ''}.`], [w + d, 'A week is 7 days. Change the weeks to days first.'], [7 * (w + d), `Only the weeks are counted in sevens. The ${d} day${d > 1 ? 's are' : ' is'} already days.`]],
      hints: ['Change the weeks to days first. There are 7 days in a week.', 'Then add the extra days.'],
      steps: [`${w} weeks = ${w} × 7 = ${7 * w} days.`, `${7 * w} + ${d} = ${7 * w + d} days.`] }),
    check: ({ w, d }, ans) => ans - d === 7 * w }),

  fam({ id: 'g3.money.bread-and-milk', skill: 'G3_MONEY', outcome: 'G3.MONEY.0', rung: 2, form: 'word',
    draw: () => { const x = price('loaf of bread'), y = price('litre of milk'); const t = x + y; return t < 200 && distinct(200 - t, t, 200 - x, 200 - y) ? { x, y, p: person() } : null; },
    make: ({ x, y, p }) => ({
      question: `${p.name} buys bread for ${sh(x)} and milk for ${sh(y)}. ${p.She} pays with ${sh(200)}. How much change does ${p.she} get?`,
      answer: 200 - x - y,
      wrong: [[x + y, 'That is the cost of both. The change is what comes back from 200.'], [200 - x, `The milk must be paid for too.`], [200 - y, `The bread must be paid for too.`]],
      hints: ['First find the cost of both things.', 'Then take that from the money paid.'],
      steps: [`Cost: ${x} + ${y} = ${x + y}.`, `Change: ${200} − ${x + y} = ${200 - x - y}, so ${sh(200 - x - y)}.`] }),
    check: ({ x, y }, ans) => ans + x + y === 200 }),

  fam({ id: 'g3.position.turn', skill: 'G3_POSITION', outcome: 'G3.POSITION.0', rung: 1, form: 'word',
    draw: () => ({ f: randInt(0, 3), right: Math.random() < 0.5, p: person() }),
    make: ({ f, right, p }) => {
      const D = ['north', 'east', 'south', 'west'];
      const ans = D[(f + (right ? 1 : 3)) % 4], other = D[(f + (right ? 3 : 1)) % 4], back = D[(f + 2) % 4];
      return { question: `${p.name} faces ${D[f]}. ${p.She} turns ${right ? 'right' : 'left'}. Which way does ${p.she} face now?`,
        options: opts([ans, other, back], ans, (t) => (t === other ? `That is the way a turn to the ${right ? 'left' : 'right'} would go.` : 'That is a full half turn. This is only a quarter turn.')),
        hints: [`Picture yourself facing ${D[f]}. Turn your body ${right ? 'right' : 'left'}.`, 'The four directions in order go: north, east, south, west.'],
        steps: [`Facing ${D[f]}, a ${right ? 'right' : 'left'} turn is a quarter turn.`, `${p.She} now faces ${ans}.`] };
    } }),

  fam({ id: 'g3.shapes.name-by-count', skill: 'G3_SHAPES', outcome: 'G3.SHAPES.0', rung: 1, form: 'direct',
    draw: () => ({ n: pick([5, 6, 8]), what: pick(['sides', 'corners']) }),
    make: ({ n, what }) => { const N = { 5: 'pentagon', 6: 'hexagon', 8: 'octagon' }; return { story: false, question: `A shape has ${n} ${what}. What is it called?`,
      options: opts(['pentagon', 'hexagon', 'octagon'], N[n], 'Count again. A pentagon has 5 sides, a hexagon 6 and an octagon 8.'),
      hints: ['Think of the name for each number of sides.', 'Penta means five. Hexa means six. Octo means eight.'],
      steps: [`A shape with ${n} ${what} also has ${n} ${what === 'sides' ? 'corners' : 'sides'}.`, `A shape with ${n} sides is a ${N[n]}.`] }; } }),
];
