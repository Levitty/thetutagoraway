// ============================================================================
// GRADE 5 MATHEMATICS, NUMBERS: FRACTIONS (9 skills) and DECIMALS (9 skills).
// Fractions keep denominators to 12 or under, as the design says.
// ============================================================================
import { fam, randInt, pick, shuffle, round, commas, person, sh, mc, tbl, gcd, farFrom } from './g5c_lib.js';

const F = 'NUMBER.FRACTIONS.', DC = 'NUMBER.DECIMALS.';
const fr = (n, d) => `${n}/${d}`;
const simp = (n, d) => { const g = gcd(n, d); return [n / g, d / g]; };
const frs = (n, d) => { const [a, b] = simp(n, d); return b === 1 ? String(a) : fr(a, b); };
const FOODS = ['chapati', 'loaf of bread', 'pawpaw', 'watermelon', 'bar of soap', 'cake'];
const dp = (x, n = 3) => round(x, n);
const places = (x) => (String(x).split('.')[1] || '').length;
const digs = (x, n) => Number(Number(x).toFixed(n).replace('.', ''));
const GRAMS = ['sukuma wiki', 'tomatoes', 'onions', 'potatoes', 'beans'];
const pairs = [[2, 4], [2, 6], [3, 6], [4, 8], [2, 8], [3, 9], [4, 12], [6, 12], [3, 12], [2, 10], [5, 10], [2, 12]];

export const FAMILIES = [
  // ---------------------------------------------------------------- EQUIVALENT_FRACTIONS
  fam({ id: 'g5c.fra.eq.missing', cs: `${F}EQUIVALENT_FRACTIONS`, form: 'word', rung: 1,
    gen: () => {
      const d = pick([2, 3, 4, 5, 6]), k = randInt(2, 4), n = randInt(1, d - 1);
      if (d * k > 24 || gcd(n, d) !== 1) return null;
      const p = person(), f = pick(FOODS), add = n + (d * k - d);
      if (!farFrom(n * k, add, n)) return null;
      return { question: `${p.name} ate ${fr(n, d)} of a ${f}. The ${f} is cut into ${d * k} equal pieces instead. How many of the smaller pieces make the same amount?`, answer: n * k,
        wrong: [[add, `You added ${d * k - d} to the top, as you did to the bottom. That changes the amount. Multiply the top by ${k}, the same as the bottom.`, 'M_EQUIV_ADDITIVE'], [n, `The bottom changed from ${d} to ${d * k}, but you left the top as ${n}. ${n} of the smaller pieces is less than ${p.name} ate.`, 'M_EQUIV_ONE_TERM_ONLY'], [n * k + 1, `One too many. ${d * k} pieces is ${k} times as many as ${d}, so ${n} pieces become ${n} × ${k}.`, 'SLIP'], [n * k - 1, `One too few. Multiply the top ${n} by ${k} and count again.`, 'SLIP']],
        hints: [`How many times bigger is ${d * k} than ${d}?`, 'Do the same to the top number.'], steps: [`${d} × ${k} = ${d * k}, so multiply the top by ${k} as well.`, `${n} × ${k} = ${n * k}. ${fr(n, d)} = ${fr(n * k, d * k)}.`], chk: (v) => v * d === n * d * k };
    } }),
  fam({ id: 'g5c.fra.eq.who-more', cs: `${F}EQUIVALENT_FRACTIONS`, form: 'why', rung: 2,
    gen: () => {
      const d = pick([2, 3, 4]), k = pick([2, 3, 4]), n = randInt(1, d - 1), [a, b] = [person(), person()];
      if (gcd(n, d) !== 1 || a.name === b.name) return null;
      const options = mc('They ate the same amount', [[`${b.name} ate more, because ${fr(n * k, d * k)} has bigger numbers`, `Bigger numbers on top and bottom do not make a bigger amount. The pieces of ${fr(n * k, d * k)} are smaller, so more of them make the same share.`, 'M_EQUIV_BIGGER_NUMBERS_BIGGER'], [`${a.name} ate more, because ${fr(n, d)} has fewer pieces`, `Fewer pieces means each piece is bigger, but ${b.name} has more pieces. Put the shaded parts side by side: they are the same.`, 'M_EQUIV_FEWER_PIECES_BIGGER'], [`${b.name} ate more, because ${d * k} is more than ${d}`, `A bigger bottom number means smaller pieces, not a bigger share. It does not tell us who ate more.`, 'M_COMPARE_BIGGER_DENOMINATOR']]);
      return { question: `${a.name} ate ${fr(n, d)} of a chapati. ${b.name} ate ${fr(n * k, d * k)} of an equal chapati. Who ate more?`, options, instruction: 'Choose the best answer.',
        hints: [`Cut each piece of ${fr(n, d)} into ${k} smaller pieces.`, 'Do you eat more or the same?'], steps: [`${fr(n, d)} = ${fr(n * k, d * k)} when both are multiplied by ${k}.`, 'The two amounts are equal.'] };
    } }),
  fam({ id: 'g5c.fra.eq.truefalse', cs: `${F}EQUIVALENT_FRACTIONS`, form: 'direct', rung: 3,
    gen: () => {
      const d = pick([3, 4, 5, 6]), k = randInt(2, 3), n = randInt(1, d - 1), eq = Math.random() < 0.5;
      if (gcd(n, d) !== 1) return null;
      const second = eq ? fr(n * k, d * k) : fr(n + (d * k - d), d * k);
      const options = mc(eq ? 'True' : 'False', [[eq ? 'False' : 'True', eq ? `Multiply both ${n} and ${d} by ${k} and you get ${n * k}/${d * k}. They are the same amount.` : `${n + (d * k - d)} comes from adding ${d * k - d} to ${n}. Adding the same number does not keep the amount.`, eq ? 'M_EQUIV_ONE_TERM_ONLY' : 'M_EQUIV_ADDITIVE']]);
      return { question: `True or false: ${fr(n, d)} and ${second} are equivalent fractions, so they name the same amount.`, options, instruction: 'Choose true or false.',
        hints: ['Multiply the top and bottom of the first fraction by the same number.', 'Do you get the second fraction?'], steps: [`${fr(n, d)} × ${k}/${k} = ${fr(n * k, d * k)}.`, eq ? 'It matches the second fraction: true.' : `${second} does not match ${fr(n * k, d * k)}: false.`] };
    } }),

  // ---------------------------------------------------------------- SIMPLIFY_FRACTIONS
  fam({ id: 'g5c.fra.simp.mandazi', cs: `${F}SIMPLIFY_FRACTIONS`, form: 'word', rung: 2,
    gen: () => {
      const g = pick([4, 6, 8, 9, 12]), [sn, sd] = pick([[1, 2], [2, 3], [3, 4], [1, 3], [3, 5], [1, 4], [5, 6], [2, 5]]), n = sn * g, d = sd * g;
      if (d > 50) return null;
      const small = [2, 3].find(x => g % x === 0), early = [n / small, d / small];
      if (!farFrom(1, n - g)) return null;
      return { question: `${person().name} ate ${n} of the ${d} mandazi in a pot. What fraction was eaten, in its simplest form?`, answer: fr(sn, sd),
        wrong: [[fr(n - g, d - g), `You took ${g} away from the top and from the bottom. That changes the amount. Divide both by the same number instead.`, 'M_SIMPLIFY_SUBTRACT'], [fr(early[0], early[1]), `You divided by ${small}, but ${early[0]} and ${early[1]} can still both be divided by ${g / small}. Keep going until only 1 divides both.`, 'M_SIMPLIFY_STOPS_EARLY'], [fr(sd, sn), `The part that was eaten goes on top and the whole pot goes on the bottom. You wrote it upside down.`, 'M_FRACTION_UPSIDE_DOWN']],
        hints: ['Find a number that divides both the top and the bottom.', 'Check whether anything still divides both.'], steps: [`${n} and ${d} are both divisible by ${g}.`, `${n} ÷ ${g} = ${sn} and ${d} ÷ ${g} = ${sd}.`], chk: (v) => v === fr(sn, sd) };
    } }),
  fam({ id: 'g5c.fra.simp.is-it', cs: `${F}SIMPLIFY_FRACTIONS`, form: 'why', rung: 2,
    gen: () => {
      const g = pick([4, 6, 9, 12]), [sn, sd] = pick([[2, 3], [3, 4], [1, 2], [3, 5], [2, 5]]), n = sn * g, d = sd * g, small = [2, 3].find(x => g % x === 0);
      const options = mc(`No. Both ${n} and ${d} divide by ${g}, giving ${fr(sn, sd)}`, [[`Yes, because ${n} is smaller than ${d}`, `Being smaller than one whole does not make a fraction simplest. Look for a number that divides both ${n} and ${d}.`, 'M_SIMPLEST_BY_LOOKS'], [`No. Dividing both by ${small} gives ${fr(n / small, d / small)}, which is the simplest form`, `You divided by ${small}, but ${n / small} and ${d / small} still both divide by ${g / small}. Keep going.`, 'M_SIMPLIFY_STOPS_EARLY'], [`No. Take ${g} from each to get ${fr(n - g, d - g)}`, `Taking ${g} away changes the amount. Divide both parts by the same number instead.`, 'M_SIMPLIFY_SUBTRACT']]);
      return { question: `${person().name} says ${fr(n, d)} is not in its simplest form. Which answer shows the simplest form and why?`, options, instruction: 'Choose the answer and the reason.',
        hints: ['Look for a number that divides both the top and bottom.', 'Keep dividing until only 1 divides both.'], steps: [`${n} ÷ ${g} = ${sn} and ${d} ÷ ${g} = ${sd}.`, `${fr(n, d)} = ${fr(sn, sd)}.`] };
    } }),
  fam({ id: 'g5c.fra.simp.spot', cs: `${F}SIMPLIFY_FRACTIONS`, form: 'spot', rung: 3,
    gen: () => {
      const g = pick([6, 9, 12]), [sn, sd] = pick([[2, 3], [1, 2], [3, 4]]), n = sn * g, d = sd * g, p = person();
      const half = g % 2 === 0 ? 2 : 3;
      return { question: `${p.name} simplifies ${fr(n, d)}. Which step has the mistake?`,
        working: [{ text: `Step 1: ${n} and ${d} are both divisible by ${half}.`, ok: true }, { text: `Step 2: ${n} ÷ ${half} = ${n / half} and ${d} ÷ ${half} = ${d / half}.`, ok: true }, { text: `Step 3: The fraction is now in its simplest form: ${fr(n / half, d / half)}.`, ok: false }],
        fix: `${n / half} and ${d / half} both still divide by ${g / half}. The simplest form is ${fr(sn, sd)}.`, mis: 'M_SIMPLIFY_STOPS_EARLY', hints: ['Check if anything still divides both numbers.'], steps: [`Simplest form: ${fr(sn, sd)}.`] };
    } }),

  // ---------------------------------------------------------------- COMPARE_LIKE_FRACTIONS
  fam({ id: 'g5c.fra.cl.loaf', cs: `${F}COMPARE_LIKE_FRACTIONS`, form: 'word', rung: 1,
    gen: () => {
      const d1 = randInt(2, 6), d2 = d1 + randInt(1, 4), f = pick(FOODS), [a, b] = [person(), person()];
      if (a.name === b.name) return null;
      const options = mc(`${a.name}'s piece, cut into ${d1}`, [[`${b.name}'s piece, because ${d2} is more than ${d1}`, 'The bigger bottom number means more pieces, so each piece is smaller.', 'M_COMPARE_BIGGER_DENOMINATOR'], [`They are the same size, each took one piece`, `Each took one piece, but the pieces come from different cuts. A ${f} cut into more pieces has smaller pieces.`, 'M_COMPARE_MATCHING_PART_EQUAL']]);
      return { question: `Two ${f}s of the same size are cut up. One is cut into ${d1} equal pieces and ${a.name} takes 1/${d1}. The other is cut into ${d2} equal pieces and ${b.name} takes 1/${d2}. Whose piece is bigger?`, options, instruction: 'Choose the larger piece.',
        hints: ['Picture each cut into its equal pieces.', 'More pieces means each piece is smaller.'], steps: [`Cut into ${d1} pieces, each is bigger than if cut into ${d2} pieces.`, `1/${d1} is the larger.`] };
    } }),
  fam({ id: 'g5c.fra.cl.symbol', cs: `${F}COMPARE_LIKE_FRACTIONS`, form: 'direct', rung: 2,
    gen: () => {
      const d = randInt(5, 12), a = randInt(1, d - 2), b = a + randInt(1, d - a - 1), same = Math.random() < 0.5;
      const [x, y] = same ? [[a, d], [b, d]] : [[1, a + 1], [1, b + 1]];
      const right = same ? '<' : '>';
      const options = mc(right, [[right === '<' ? '>' : '<', same ? `${fr(...y)} has more of the same size pieces, so it is the bigger fraction. The sign opens towards the bigger number.` : `The same number of pieces, but cut into fewer parts, are bigger pieces. The sign opens towards the bigger number.`, same ? 'M_COMPARE_SYMBOL_REVERSED' : 'M_COMPARE_BIGGER_DENOMINATOR'], ['=', same ? 'The pieces are the same size but the numbers of pieces are different, so the fractions are different.' : 'Each fraction is one piece, but the pieces are different sizes, so the fractions are different.', 'M_COMPARE_MATCHING_PART_EQUAL']]);
      return { question: `Of the same whole, compare ${fr(...x)} and ${fr(...y)}. Which symbol, <, > or =, makes ${fr(...x)} ___ ${fr(...y)} true?`, options, instruction: 'Choose the symbol.',
        hints: [same ? 'The pieces are the same size, so count the pieces.' : 'The same number of pieces, but of different sizes.', 'A smaller bottom number gives bigger pieces.'], steps: [same ? `${a} pieces is less than ${b} pieces of the same size.` : `Cutting into ${a + 1} pieces gives bigger pieces than cutting into ${b + 1} pieces.`, `${fr(...x)} ${right} ${fr(...y)}.`] };
    } }),
  fam({ id: 'g5c.fra.cl.whole', cs: `${F}COMPARE_LIKE_FRACTIONS`, form: 'why', rung: 3,
    gen: () => {
      const [a, b] = [person(), person()];
      if (a.name === b.name) return null;
      const options = mc('Not necessarily. The wholes may not be the same size', [[`Yes, because 1/2 is always more than 1/4`, 'A half of a small thing can be smaller than a quarter of a big thing.', 'M_COMPARE_DIFFERENT_WHOLES'], [`No, because 1/4 has the larger bottom number`, 'The bigger bottom number means smaller pieces, but only for the same whole.', 'M_COMPARE_BIGGER_DENOMINATOR']]);
      return { question: `${a.name} got 1/2 of a small mandazi. ${b.name} got 1/4 of a big cake. ${a.name} says ${a.she} got more because 1/2 is more than 1/4. Is ${a.she} right?`, options, instruction: 'Choose the best answer.',
        hints: ['Are the two wholes the same size?', 'We can only compare fractions of the same whole.'], steps: ['1/2 > 1/4 only when both are parts of the same whole.', 'A quarter of a big cake can be more than half a small mandazi.'] };
    } }),

  // ---------------------------------------------------------------- COMPARE_UNLIKE_FRACTIONS
  fam({ id: 'g5c.fra.cu.plot', cs: `${F}COMPARE_UNLIKE_FRACTIONS`, form: 'word', rung: 2,
    gen: () => {
      const [a, b] = pick([[[2, 3], [3, 4]], [[3, 4], [5, 6]], [[1, 2], [3, 8]], [[2, 3], [5, 12]], [[3, 4], [7, 12]], [[3, 4], [5, 8]], [[1, 2], [5, 12]], [[4, 5], [5, 6]]]), swap = Math.random() < 0.5;
      const [x, y] = swap ? [b, a] : [a, b], l = (x[1] * y[1]) / gcd(x[1], y[1]);
      const vx = x[0] * (l / x[1]), vy = y[0] * (l / y[1]);
      if (vx === vy) return null;
      const big = vx > vy ? x : y, small = vx > vy ? y : x, [n1, n2] = [person().name, person().name];
      if (n1 === n2) return null;
      const gap = (z) => z[1] - z[0] === 1;
      const wrongs = [];
      if (small[0] > big[0] && small[1] > big[1]) wrongs.push([fr(...small), `You picked the fraction with the bigger numbers. Rename both as ${l}ths: ${fr(vx, l)} and ${fr(vy, l)}. The bigger numbers are not the bigger amount here.`, 'M_COMPARE_BIGGER_TERMS']);
      else if (small[1] < big[1]) wrongs.push([fr(...small), `You picked the fraction with fewer, bigger pieces. But the other has more pieces. Rename both as ${l}ths: ${fr(vx, l)} and ${fr(vy, l)}.`, 'M_EQUIV_FEWER_PIECES_BIGGER']);
      else return null;
      if (gap(x) && gap(y)) wrongs.push(['They planted the same amount', `Each is one part short of a whole, but the missing parts are different sizes. In ${l}ths they are ${fr(vx, l)} and ${fr(vy, l)}.`, 'M_COMPARE_GAP_THINKING']);
      else wrongs.push([`The one with the bigger bottom number`, `A bigger bottom number means smaller pieces. Rename both as ${l}ths: ${fr(vx, l)} and ${fr(vy, l)}.`, 'M_COMPARE_BIGGER_DENOMINATOR']);
      if (wrongs[1][2] === 'M_COMPARE_BIGGER_DENOMINATOR' && wrongs[0][2] === 'M_EQUIV_FEWER_PIECES_BIGGER') return null;
      const options = mc(fr(...big), wrongs.map(w => w[2] === 'M_COMPARE_BIGGER_DENOMINATOR' ? [fr(...(x[1] > y[1] ? x : y)), w[1], w[2]] : w));
      if (!options) return null;
      return { question: `${n1} planted ${fr(...x)} of a plot with sukuma wiki. ${n2} planted ${fr(...y)} of a plot of the same size with spinach. Who planted the larger part? Choose the larger fraction.`, options, instruction: 'Choose the larger fraction.',
        hints: [`Rename both fractions as ${l}ths.`, 'Compare the tops once the bottoms are equal.'], steps: [`${fr(...x)} = ${fr(vx, l)} and ${fr(...y)} = ${fr(vy, l)}.`, `${fr(...big)} is larger.`] };
    } }),
  fam({ id: 'g5c.fra.cu.symbol', cs: `${F}COMPARE_UNLIKE_FRACTIONS`, form: 'direct', rung: 2,
    gen: () => {
      const [x, y] = pick([[[2, 3], [3, 4]], [[3, 4], [4, 5]], [[1, 2], [4, 8]], [[3, 6], [2, 4]], [[5, 6], [3, 4]], [[3, 4], [5, 8]], [[2, 3], [5, 12]], [[1, 2], [2, 5]]]);
      const l = (x[1] * y[1]) / gcd(x[1], y[1]), vx = x[0] * (l / x[1]), vy = y[0] * (l / y[1]), right = vx > vy ? '>' : vx < vy ? '<' : '=';
      const gap = (z) => z[1] - z[0] === 1;
      // what each wrong symbol says, and the one idea behind it
      const why = (sym) => {
        if (sym === '=') return gap(x) && gap(y) ? ['Each is one part short of a whole, but the missing parts are different sizes, so the fractions are not equal.', 'M_COMPARE_GAP_THINKING'] : null;
        const [F1, G1] = sym === '>' ? [x, y] : [y, x];   // the fraction this symbol calls bigger
        if (F1[0] > G1[0] && F1[1] > G1[1]) return ['You chose the fraction with the bigger numbers. Bigger numbers do not make a bigger fraction. Rename and compare.', 'M_COMPARE_BIGGER_TERMS'];
        if (F1[1] < G1[1]) return ['You chose the fraction with fewer pieces. Fewer pieces means bigger pieces, but there are more of them in the other. Rename and compare.', 'M_EQUIV_FEWER_PIECES_BIGGER'];
        if (F1[0] > G1[0]) return ['You looked only at the top numbers. Rename to the same bottom number first.', 'M_ORDER_BY_NUMERATOR'];
        return null;
      };
      const wrongs = ['<', '>', '='].filter(z => z !== right).map(z => [z, ...(why(z) || [])]).filter(w => w[1]);
      if (wrongs.length < 2) return null;
      const options = mc(right, wrongs);
      if (!options || new Set(wrongs.map(w => w[2])).size !== wrongs.length) return null;
      return { question: `${person().name} compares two shares of the same loaf: ${fr(...x)} and ${fr(...y)}. Which symbol, <, > or =, makes ${fr(...x)} ___ ${fr(...y)} true? Rename to a common denominator to decide.`, options, instruction: 'Choose the symbol.',
        hints: ['Find a number that both bottom numbers divide into.', 'Compare the tops.'], steps: [`${fr(...x)} = ${fr(vx, l)} and ${fr(...y)} = ${fr(vy, l)}.`, `${vx} ${right} ${vy}, so ${fr(...x)} ${right} ${fr(...y)}.`] };
    } }),
  fam({ id: 'g5c.fra.cu.method', cs: `${F}COMPARE_UNLIKE_FRACTIONS`, form: 'spot', rung: 3,
    gen: () => {
      const [x, y] = pick([[[2, 3], [3, 4]], [[3, 4], [4, 5]], [[5, 6], [6, 7]]]), p = person();
      const l = x[1] * y[1], vx = x[0] * y[1], vy = y[0] * x[1];
      return { question: `${p.name} says ${fr(...x)} = ${fr(...y)} because each is one part short of a whole. Which step has the mistake?`,
        working: [{ text: `Step 1: ${fr(...x)} is 1 part short of a whole, and so is ${fr(...y)}.`, ok: true }, { text: 'Step 2: The missing parts are the same size, so the fractions are equal.', ok: false }, { text: `Step 3: So ${fr(...x)} = ${fr(...y)}.`, ok: true }],
        fix: `The missing parts are different sizes. In ${l}ths, ${fr(vx, l)} < ${fr(vy, l)}, so ${fr(...x)} < ${fr(...y)}.`, mis: 'M_COMPARE_GAP_THINKING', hints: ['Rename both with the same bottom number.'], steps: [`${fr(...x)} = ${fr(vx, l)}, ${fr(...y)} = ${fr(vy, l)}.`] };
    } }),

  // ---------------------------------------------------------------- ORDER_FRACTIONS
  fam({ id: 'g5c.fra.ord.inc', cs: `${F}ORDER_FRACTIONS`, form: 'direct', rung: 2,
    gen: () => {
      const set = pick([[[2, 3], [3, 4], [5, 12]], [[1, 2], [3, 4], [5, 8]], [[1, 3], [1, 6], [1, 2]], [[2, 3], [5, 6], [1, 2]], [[3, 4], [2, 3], [7, 12]], [[3, 5], [1, 2], [7, 10]]]);
      const v = (x) => x[0] / x[1], asc = [...set].sort((a, b) => v(a) - v(b)), shown = shuffle(set), ByNum = [...set].sort((a, b) => a[0] - b[0] || a[1] - b[1]), ByDen = [...set].sort((a, b) => b[1] - a[1]);
      if (JSON.stringify(shown) === JSON.stringify(asc)) return null;
      const f = (l) => l.map(x => fr(...x)).join(', ');
      const unit = set.every(x => x[0] === 1);
      const options = mc(f(asc), [[f([...asc].reverse()), 'That runs from the largest down. Increasing means smallest first.', 'M_ORDER_DIRECTION'], [unit ? f([...set].sort((a, b) => b[1] - a[1]).reverse()) : f(ByNum), unit ? 'The bigger the bottom number, the smaller the fraction.' : 'You compared only the top numbers. Rename to the same bottom number first.', unit ? 'M_ORDER_BY_DENOMINATOR' : 'M_ORDER_BY_NUMERATOR'], [f(ByDen), 'The bottom number alone does not give the order. Rename the fractions.', 'M_ORDER_BY_DENOMINATOR']].filter(w => w[0] !== f(asc)));
      return { question: `Three friends each ate part of a loaf of bread of the same size: ${f(shown)}. Arrange the fractions from the smallest share to the largest.`, options, instruction: 'Choose the correct order, smallest first.',
        hints: ['Rename every fraction with the same bottom number.', 'Put the smallest top number first, then write the original fractions.'], steps: [`Rename to a common denominator and compare.`, `Smallest to largest: ${f(asc)}.`] };
    } }),
  fam({ id: 'g5c.fra.ord.walk', cs: `${F}ORDER_FRACTIONS`, form: 'word', rung: 3,
    gen: () => {
      const set = pick([[[1, 2], [3, 4], [5, 8]], [[2, 3], [5, 6], [1, 2]], [[3, 4], [2, 3], [7, 12]]]), v = (x) => x[0] / x[1], desc = [...set].sort((a, b) => v(b) - v(a)), names = shuffle(['Achieng', 'Baraka', 'Chebet']);
      const shown = shuffle(set.map((x, i) => [x, names[i]]));
      const far = shown.find(([x]) => v(x) === v(desc[0]))[1];
      const l = set.reduce((a, x) => a * x[1] / gcd(a, x[1]), 1);
      const ans = desc[0][0] * (l / desc[0][1]), tops = set.map(x => x[0] * (l / x[1])).sort((a, b) => a - b), maxTop = Math.max(...set.map(x => x[0]));
      const t = (n) => `${n}/${l}`;
      const wr = [];
      if (maxTop !== ans) wr.push([t(maxTop), 'You looked at the top numbers before renaming. The pieces are different sizes until every fraction has the same bottom number.', 'M_ORDER_BY_NUMERATOR']);
      wr.push([t(tops[0]), 'That is the child who walked the shortest distance. Furthest means the largest amount.', 'M_ORDER_DIRECTION'], [t(l), `That is the whole kilometre, ${l} parts out of ${l}. No child walked a whole kilometre.`, 'M_ORDER_BY_DENOMINATOR']);
      if (wr.length < 3) wr.push([t(ans + 1), 'One too many. Multiply the top number by the same number as the bottom and count again.', 'SLIP']);
      const options = mc(t(ans), wr);
      if (!options) return null;
      return { question: `Three children walk to school: ${shown.map(([x, n]) => `${n} ${fr(...x)} km`).join(', ')}. Rename the fractions as ${l}ths. Which renamed fraction shows the child who walked furthest?`, options, instruction: 'Choose the renamed fraction.',
        hints: [`Rename each fraction as ${l}ths.`, 'The largest top number is the furthest walk.'], steps: [`In ${l}ths: ${set.map(x => `${x[0] * (l / x[1])}/${l}`).join(', ')}.`, `The largest is ${ans}/${l}, walked by ${far}.`] };
    } }),
  fam({ id: 'g5c.fra.ord.out', cs: `${F}ORDER_FRACTIONS`, form: 'spot', rung: 3,
    gen: () => {
      const set = [[5, 12], [2, 3], [3, 4]], p = person();
      return { question: `${p.name} arranges 2/3, 3/4 and 5/12 in increasing order. Which step has the mistake?`,
        working: [{ text: 'Step 1: Look at the numerators 2, 3 and 5.', ok: false }, { text: 'Step 2: Put the smallest numerator first: 2/3, 3/4, 5/12.', ok: true }, { text: 'Step 3: This is the increasing order.', ok: true }],
        fix: 'Compare after renaming to the same denominator: 8/12, 9/12, 5/12. The increasing order is 5/12, 2/3, 3/4.', mis: 'M_ORDER_BY_NUMERATOR', hints: ['Are the pieces the same size in each fraction?'], steps: ['Rename as twelfths: 5/12, 8/12, 9/12.', 'Order: 5/12, 2/3, 3/4.'] };
    } }),

  // ---------------------------------------------------------------- ADD_SAME_DENOMINATOR
  fam({ id: 'g5c.fra.add.flour', cs: `${F}ADD_SAME_DENOMINATOR`, form: 'word', rung: 1,
    gen: () => {
      const d = randInt(4, 12), a = randInt(1, d - 2), b = randInt(1, d - a - 1);
      if (a + b >= d) return null;
      const rest = gcd(a + b, d) > 1;
      const wrong = [[fr(a + b, d + d), `The pieces stay the same size, so the bottom number stays ${d}. Do not add the bottom numbers.`, 'M_ADD_DENOMINATORS'], [String(a + b), `The answer is a part of the packet, counted in ${d}ths. Keep the bottom number.`, 'M_ADD_DROPS_DENOMINATOR'], [frs(a + b + 1, d), 'One too many. Add the top numbers again.', 'SLIP']];
      if (rest) wrong.push([fr(a + b, d), `${a + b} and ${d} can both still be divided by ${gcd(a + b, d)}. Write it in its simplest form.`, 'M_SIMPLIFY_STOPS_EARLY']);
      return { question: `Mama used ${fr(a, d)} of a packet of flour on Monday and ${fr(b, d)} of the same packet on Tuesday. What fraction of the packet did she use altogether? Write it in its simplest form.`, answer: frs(a + b, d),
        wrong: wrong.filter(w => w[0] !== frs(a + b, d)),
        hints: ['The pieces are all the same size.', 'Add the number of pieces, keep the name of the piece.'], steps: [`${a} ${d}ths + ${b} ${d}ths = ${a + b} ${d}ths.`, `${fr(a + b, d)} = ${frs(a + b, d)}.`], chk: (v) => v === frs(a + b, d) };
    } }),
  fam({ id: 'g5c.fra.add.missing', cs: `${F}ADD_SAME_DENOMINATOR`, form: 'direct', rung: 2,
    gen: () => {
      const d = randInt(5, 12), a = randInt(1, d - 3), t = randInt(a + 1, d - 1), b = t - a, p = person();
      if (!farFrom(b, t + a, t, b + d)) return null;
      const options = mc(String(b), [[String(t + a), `You added the two numbers you can see. The missing top number is what must be added to ${a} to reach ${t}.`, 'M_MISSING_ADDEND_ADDED'], [String(t), `That is the total, not the missing part. Put it in: ${a} + ${t} is more than ${t}.`, 'M_MISSING_PICKS_SHOWN_NUMBER'], [String(b + d), `The bottom number stays ${d}. Only the top numbers are added.`, 'M_ADD_DENOMINATORS']]);
      return { question: `${p.name} used ${fr(a, d)} of a bag of rice on Monday. By Tuesday evening ${fr(t, d)} of the bag was gone. Find the missing numerator for Tuesday: ${fr(a, d)} + ?/${d} = ${fr(t, d)}.`, options, instruction: 'Choose the missing number.',
        hints: ['The bottom numbers stay the same.', `What must be added to the top number ${a} to reach the total?`], steps: [`${t} − ${a} = ${b}.`, `${fr(a, d)} + ${fr(b, d)} = ${fr(t, d)}.`] };
    } }),
  fam({ id: 'g5c.fra.add.spot', cs: `${F}ADD_SAME_DENOMINATOR`, form: 'spot', rung: 3,
    gen: () => {
      const d = randInt(5, 12), a = randInt(1, d - 3), b = randInt(1, d - a - 1), p = person();
      if (a + b >= d) return null;
      return { question: `${p.name} works out ${fr(a, d)} + ${fr(b, d)}. Which step has the mistake?`,
        working: [{ text: `Step 1: The bottom numbers are the same: ${d} and ${d}.`, ok: true }, { text: `Step 2: Add the tops, ${a} + ${b} = ${a + b}, and add the bottoms, ${d} + ${d} = ${2 * d}.`, ok: false }, { text: `Step 3: The answer is ${fr(a + b, 2 * d)}.`, ok: true }],
        fix: `The pieces stay the same size, so the bottom number stays ${d}. The answer is ${fr(a + b, d)}.`, mis: 'M_ADD_DENOMINATORS', hints: ['Does the size of the pieces change when you add?'], steps: [`${fr(a, d)} + ${fr(b, d)} = ${fr(a + b, d)}.`] };
    } }),

  // ---------------------------------------------------------------- SUBTRACT_SAME_DENOMINATOR
  fam({ id: 'g5c.fra.sub.pawpaw', cs: `${F}SUBTRACT_SAME_DENOMINATOR`, form: 'word', rung: 1,
    gen: () => {
      const d = randInt(4, 12), a = randInt(1, d - 2), p = person();
      return { question: `${p.name} had a whole pawpaw cut into ${d} equal pieces and ate ${fr(a, d)} of it. What fraction of the pawpaw is left? Write it in its simplest form.`, answer: frs(d - a, d),
        wrong: [[fr(a, d), `That is the part ${p.she} ate. Take it away from the whole pawpaw, which is ${fr(d, d)}.`, 'M_SUB_WHOLE_NOT_RENAMED'], [String(d - a), `The pieces stay ${d}ths, so the answer is a fraction. ${d - a} is a number of pieces, not a number of pawpaws.`, 'M_SUB_DROPS_DENOMINATOR'], [fr(d + a, d), `Eating takes some of the pawpaw away, so the amount left is less than the whole, not more. Subtract.`, 'M_SUB_DONE_AS_ADDITION'], [frs(d - a + 1, d), 'One too many. Take the pieces eaten from the whole again.', 'SLIP']].filter(w => w[0] !== frs(d - a, d)),
        hints: [`Write the whole pawpaw as ${fr(d, d)}.`, 'Subtract the pieces eaten.'], steps: [`${fr(d, d)} − ${fr(a, d)} = ${fr(d - a, d)}.`, `Simplest form: ${frs(d - a, d)}.`], chk: (v) => v === frs(d - a, d) };
    } }),
  fam({ id: 'g5c.fra.sub.missing', cs: `${F}SUBTRACT_SAME_DENOMINATOR`, form: 'direct', rung: 2,
    gen: () => {
      const d = randInt(5, 12), t = randInt(4, d - 1), r = randInt(1, t - 1), b = t - r, p = person();
      if (!farFrom(b, t + r, r)) return null;
      const options = mc(String(b), [[String(t + r), `You added the two numbers you can see. We are taking away, so find what must be taken from ${t} to leave ${r}.`, 'M_SUB_DONE_AS_ADDITION'], [String(r), `That is what is left in the jug. We want what was poured out.`, 'M_MISSING_PICKS_SHOWN_NUMBER'], [String(b + 1), `One too many. Take your number from ${t} and see if ${r} is left.`, 'SLIP']]);
      return { question: `${p.name}'s jug held ${fr(t, d)} litre of uji. Some was poured out and ${fr(r, d)} litre is left. Find the missing numerator: ${fr(t, d)} − ?/${d} = ${fr(r, d)}.`, options, instruction: 'Choose the missing number.',
        hints: ['The bottom numbers stay the same.', 'What taken from the top number leaves the answer?'], steps: [`${t} − ${b} = ${r}.`, `${fr(t, d)} − ${fr(b, d)} = ${fr(r, d)}.`] };
    } }),
  fam({ id: 'g5c.fra.sub.line', cs: `${F}SUBTRACT_SAME_DENOMINATOR`, form: 'table', rung: 3,
    gen: () => {
      const d = randInt(6, 12), start = randInt(5, d - 1), used1 = randInt(1, Math.floor(start / 2)), used2 = randInt(1, start - used1 - 1);
      if (used2 < 1) return null;
      const left = start - used1 - used2;
      return { question: 'A water tank is filled to the fraction shown. Some water is used on two days. What fraction of the tank is left? Write it in its simplest form.', model: tbl(['Day', 'Water in the tank'], [['Start', fr(start, d)], ['Used on Monday', fr(used1, d)], ['Used on Tuesday', fr(used2, d)]]), answer: frs(left, d),
        wrong: [[frs(start - used1, d), 'You took away only the water used on Monday. The water used on Tuesday must be taken away too.', 'M_SUB_ONE_STEP_ONLY'], [frs(start + used1 + used2, d), 'Water that is used is taken out of the tank, so there is less, not more. Subtract.', 'M_SUB_DONE_AS_ADDITION'], [String(left), `The pieces stay ${d}ths, so the answer is a fraction. ${left} is a number of pieces, not of tanks.`, 'M_SUB_DROPS_DENOMINATOR'], [frs(left + 1, d), 'One too many. Take both amounts used from the start again.', 'SLIP']].filter(w => w[0] !== frs(left, d)),
        hints: ['Take away the amount used on each day, one at a time.', 'The bottom number stays the same.'], steps: [`${start} − ${used1} − ${used2} = ${left}.`, `${fr(left, d)} = ${frs(left, d)}.`], chk: (v) => v === frs(left, d) };
    } }),

  // ---------------------------------------------------------------- ADD_ONE_RENAMING
  fam({ id: 'g5c.fra.addr.sugar', cs: `${F}ADD_ONE_RENAMING`, form: 'word', rung: 2,
    gen: () => {
      const [d1, d2] = pick(pairs), n1 = randInt(1, d1 - 1), n2 = randInt(1, d2 - 1), k = d2 / d1, tn = n1 * k + n2;
      if (tn >= d2 || gcd(n1, d1) !== 1 && false) return null;
      const p = person();
      return { question: `${p.name} bought ${fr(n1, d1)} kg of sugar and then ${fr(n2, d2)} kg more. How many kilograms of sugar is that altogether? Write it in its simplest form.`, answer: frs(tn, d2),
        wrong: [[fr(n1 + n2, d1 + d2), 'You added the tops and the bottoms. Rename one fraction so both have the same bottom number first.', 'M_RENAME_ADD_DENOMINATORS'], [frs(n1 + n2, d2), `You changed the bottom number of ${fr(n1, d1)} but not its top. Multiply both by ${k}.`, 'M_RENAME_DENOMINATOR_ONLY'], [frs(n1 + (d2 - d1) + n2, d2), `You added ${d2 - d1} to the top and bottom. Multiply both by ${k} instead.`, 'M_RENAME_ADDITIVE'], [frs(tn + 1, d2), `One too many. Add the tops again after renaming ${fr(n1, d1)} as ${fr(n1 * k, d2)}.`, 'SLIP']].filter(w => w[0] !== frs(tn, d2)),
        hints: [`Rename ${fr(n1, d1)} with the bottom number ${d2}.`, 'Add the tops, keep the bottom, then simplify.'], steps: [`${fr(n1, d1)} = ${fr(n1 * k, d2)}.`, `${fr(n1 * k, d2)} + ${fr(n2, d2)} = ${fr(tn, d2)} = ${frs(tn, d2)}.`], chk: (v) => v === frs(tn, d2) };
    } }),
  fam({ id: 'g5c.fra.addr.which', cs: `${F}ADD_ONE_RENAMING`, form: 'direct', rung: 2,
    gen: () => {
      const [d1, d2] = pick(pairs), n1 = randInt(1, d1 - 1), n2 = randInt(1, d2 - 1), k = d2 / d1, tn = n1 * k + n2;
      if (tn >= d2) return null;
      const right = `Rename ${fr(n1, d1)} as ${fr(n1 * k, d2)}`;
      const options = mc(right, [[`Rename ${fr(n2, d2)} as ${fr(n2, d1)}`, 'You cannot make the bottom number smaller by keeping the top. Rename the fraction with the smaller bottom number.', 'M_RENAME_DENOMINATOR_ONLY'], [`Rename ${fr(n1, d1)} as ${fr(n1 + (d2 - d1), d2)}`, `Multiply the top and bottom by ${k}. Adding ${d2 - d1} changes the amount.`, 'M_RENAME_ADDITIVE'], [`Add the tops and add the bottoms`, 'You cannot add pieces of different sizes. Rename first.', 'M_RENAME_ADD_DENOMINATORS']]);
      return { question: `To work out ${fr(n1, d1)} + ${fr(n2, d2)}, which first step is correct?`, options, instruction: 'Choose the first step.',
        hints: ['Both fractions need the same bottom number.', 'Rename the one with the smaller bottom number by multiplying the top and bottom by the same number.'], steps: [`${d1} × ${k} = ${d2}, so ${fr(n1, d1)} = ${fr(n1 * k, d2)}.`, `Then ${fr(n1 * k, d2)} + ${fr(n2, d2)} = ${fr(tn, d2)}.`] };
    } }),
  fam({ id: 'g5c.fra.addr.spot', cs: `${F}ADD_ONE_RENAMING`, form: 'spot', rung: 3,
    gen: () => {
      const [d1, d2] = pick(pairs), n1 = randInt(1, d1 - 1), n2 = randInt(1, d2 - 1), k = d2 / d1, p = person();
      if (n1 * k + n2 >= d2 || d2 - d1 === 0) return null;
      return { question: `${p.name} works out ${fr(n1, d1)} + ${fr(n2, d2)}. Which step has the mistake?`,
        working: [{ text: `Step 1: Rename ${fr(n1, d1)} to ${d2}ths by adding ${d2 - d1} to the top and bottom: ${fr(n1 + d2 - d1, d2)}.`, ok: false }, { text: `Step 2: Add: ${fr(n1 + d2 - d1, d2)} + ${fr(n2, d2)} = ${fr(n1 + d2 - d1 + n2, d2)}.`, ok: true }, { text: `Step 3: The sum is ${fr(n1 + d2 - d1 + n2, d2)}.`, ok: true }],
        fix: `Renaming means multiplying the top and bottom by ${k}: ${fr(n1, d1)} = ${fr(n1 * k, d2)}. The sum is ${fr(n1 * k + n2, d2)}.`, mis: 'M_RENAME_ADDITIVE', hints: ['Is your renamed fraction the same amount as the original?'], steps: [`${fr(n1 * k + n2, d2)}.`] };
    } }),

  // ---------------------------------------------------------------- SUBTRACT_ONE_RENAMING
  fam({ id: 'g5c.fra.subr.milk', cs: `${F}SUBTRACT_ONE_RENAMING`, form: 'word', rung: 2,
    gen: () => {
      const [d1, d2] = pick(pairs.filter(([a, b]) => b <= 12)), n1 = randInt(1, d1 - 1), n2 = randInt(1, d2 - 1), k = d2 / d1, big = n1 * k;
      if (n2 >= big) return null;
      const t = big - n2, p = person();
      return { question: `${p.name} had ${fr(n1, d1)} litre of milk and drank ${fr(n2, d2)} litre. How much milk was left? Write it in its simplest form.`, answer: frs(t, d2),
        wrong: [[fr(Math.abs(n1 - n2) || 1, d2 - d1), 'You subtracted the tops and also the bottoms. The pieces are different sizes until you rename one fraction.', 'M_RENAME_SUB_DENOMINATORS'], [frs(n1 * 1 - n2 > 0 ? Math.abs(n1 - n2) : 1, d2), `You changed the bottom number of ${fr(n1, d1)} to ${d2} but not its top, so the amount changed. Multiply the top by ${k} too.`, 'M_RENAME_SUB_DENOMINATOR_ONLY'], [fr(n2, d2), `That is the amount ${p.she} drank. The question asks how much was left.`, 'M_SUB_THINKS_IMPOSSIBLE'], [frs(t + 1, d2), `One too many. Rename ${fr(n1, d1)} as ${fr(big, d2)} and subtract the tops again.`, 'SLIP']].filter(w => w[0] !== frs(t, d2)),
        hints: [`Rename ${fr(n1, d1)} as ${d2}ths. Is it more than ${fr(n2, d2)}?`, 'Subtract the tops, keep the bottom, then simplify.'], steps: [`${fr(n1, d1)} = ${fr(big, d2)}.`, `${fr(big, d2)} − ${fr(n2, d2)} = ${fr(t, d2)} = ${frs(t, d2)}.`], chk: (v) => v === frs(t, d2) };
    } }),
  fam({ id: 'g5c.fra.subr.moremissing', cs: `${F}SUBTRACT_ONE_RENAMING`, form: 'why', rung: 3,
    gen: () => {
      const d1 = pick([2, 3, 4]), k = pick([2, 3, 4]), d2 = d1 * k, n1 = randInt(1, d1 - 1), n2 = n1 * k - randInt(1, 2), p = person();
      if (n2 < 1 || d2 > 12) return null;
      const options = mc(`Yes: ${fr(n1, d1)} = ${fr(n1 * k, d2)}, which is more than ${fr(n2, d2)}`, [[`No, because ${n2} is more than ${n1}`, 'The top numbers cannot be compared until the bottoms are the same. Rename first.', 'M_SUB_THINKS_IMPOSSIBLE'], [`No, because ${d2} is more than ${d1}`, 'A bigger bottom number means smaller pieces, so the second amount may be smaller, not bigger.', 'M_COMPARE_BIGGER_DENOMINATOR'], [`Yes, because you take ${n2} from ${n1} and ${d2} from ${d1}`, 'Subtracting the tops and the bottoms does not work with pieces of different sizes. Rename first, then subtract the tops.', 'M_RENAME_SUB_DENOMINATORS']]);
      return { question: `${p.name} has ${fr(n1, d1)} litre of milk and wants to pour out ${fr(n2, d2)} litre. Is there enough milk to do that?`, options, instruction: 'Choose the answer and reason.',
        hints: ['Rename so both have the same bottom number.', 'Compare the tops.'], steps: [`${fr(n1, d1)} = ${fr(n1 * k, d2)}.`, `${n1 * k} is more than ${n2}, so yes.`] };
    } }),
  fam({ id: 'g5c.fra.subr.spot', cs: `${F}SUBTRACT_ONE_RENAMING`, form: 'spot', rung: 3,
    gen: () => {
      const [d1, d2] = pick([[2, 4], [3, 6], [4, 8], [2, 6], [3, 12], [4, 12]]), n1 = randInt(1, d1 - 1), k = d2 / d1, n2 = randInt(1, n1 * k - 1), p = person();
      return { question: `${p.name} works out ${fr(n1, d1)} − ${fr(n2, d2)}. Which step has the mistake?`,
        working: [{ text: `Step 1: Rename only the bottom number of ${fr(n1, d1)} to ${d2}, keeping the top: ${fr(n1, d2)}.`, ok: false }, { text: `Step 2: Subtract: ${fr(n1, d2)} − ${fr(n2, d2)} = ${fr(Math.abs(n1 - n2), d2)}.`, ok: true }, { text: `Step 3: The answer is ${fr(Math.abs(n1 - n2), d2)}.`, ok: true }],
        fix: `Renaming changes the top as well: ${fr(n1, d1)} = ${fr(n1 * k, d2)}. The answer is ${fr(n1 * k - n2, d2)}.`, mis: 'M_RENAME_SUB_DENOMINATOR_ONLY', hints: ['Is the renamed fraction the same amount as the original?'], steps: [`${fr(n1 * k, d2)} − ${fr(n2, d2)} = ${fr(n1 * k - n2, d2)}.`] };
    } }),

  // ================================================================ DECIMALS
  // ---------------------------------------------------------------- DEC_PLACE_NAME
  fam({ id: 'g5c.dec.place.name', cs: `${DC}DEC_PLACE_NAME`, form: 'direct', rung: 1,
    gen: () => {
      const d = [randInt(1, 9), randInt(1, 9), randInt(1, 9), randInt(1, 9)], n = `${d[0]}.${d[1]}${d[2]}${d[3]}`, k = randInt(1, 3), names = ['tenths', 'hundredths', 'thousandths'], right = names[k - 1], p = person();
      if (new Set(d).size < 4) return null;
      const near = names[k === 3 ? 1 : k];
      const options = mc(right, [[['tens', 'hundreds', 'thousands'][k - 1], `The places after the point end in -ths, because they are parts of one: tenths, hundredths, thousandths. Tens and hundreds are before the point.`, 'M_TENTHS_AS_TENS'], [near, `You counted from the wrong place. The first place after the point is tenths, then hundredths, then thousandths.`, 'M_PLACE_OFF_BY_ONE']]);
      return { question: `${p.name} reads a mass of ${n} kg from a scale. In the number ${n}, the digit ${d[k]} is in which place?`, options, instruction: 'Choose the place.',
        hints: ['Count the places to the right of the decimal point.', 'tenths, hundredths, thousandths.'], steps: [`After the point: ${d[1]} tenths, ${d[2]} hundredths, ${d[3]} thousandths.`, `${d[k]} is in the ${right} place.`] };
    } }),
  fam({ id: 'g5c.dec.place.size', cs: `${DC}DEC_PLACE_NAME`, form: 'why', rung: 2,
    gen: () => {
      const d = randInt(2, 9), k = pick([['tenths', 'thousandths'], ['tenths', 'hundredths'], ['hundredths', 'thousandths']]), N = { tenths: 10, hundredths: 100, thousandths: 1000 };
      const options = mc(`${d} ${k[0]} is more, because ${k[0]} are bigger pieces`, [[`${d} ${k[1]} is more, because ${N[k[1]]} is a bigger number than ${N[k[0]]}`, `${k[1]} are made by cutting a whole into ${N[k[1]]} pieces. More pieces means each piece is smaller, so the pieces are smaller than ${k[0]}.`, 'M_THOUSANDTH_BIGGER'], [`They are the same, because both have the digit ${d}`, `The digit is the same but the place is not. A ${k[0].slice(0, -1)} is ${N[k[1]] / N[k[0]]} times as big as a ${k[1].slice(0, -1)}.`, 'M_SAME_DIGIT_SAME_VALUE']]);
      return { question: `${person().name} says ${d} ${k[0]} and ${d} ${k[1]} of a litre of water are different amounts. Which is more, ${d} ${k[0]} or ${d} ${k[1]}? Choose the best answer.`, options, instruction: 'Choose the answer and the reason.',
        hints: ['Cut a strip into 10 pieces, then into 100 pieces.', 'More pieces means smaller pieces.'], steps: [`${k[0]} are larger parts than ${k[1]}.`, `So ${d} ${k[0]} is more.`] };
    } }),
  fam({ id: 'g5c.dec.place.chart', cs: `${DC}DEC_PLACE_NAME`, form: 'table', rung: 2,
    gen: () => {
      let w, a, b, c;
      for (let i = 0; i < 300; i++) {
        [w, a, b, c] = [randInt(1, 9), randInt(1, 9), randInt(0, 9), randInt(1, 9)];
        const all = [w, a, b, c];
        if (all.every((x, i2) => all.every((y, j) => i2 === j || Math.abs(x - y) >= 3))) break;
        w = null;
      }
      if (w === null) return null;
      const k = randInt(0, 2), digs3 = [a, b, c], right = digs3[k], near = digs3[k === 2 ? 1 : k + 1], nm = ['tenths', 'hundredths', 'thousandths'][k];
      return { question: `The chart shows the mass of a parcel in kilograms. Which digit is in the ${nm} place?`, model: tbl(['Ones', 'Tenths', 'Hundredths', 'Thousandths'], [[String(w), String(a), String(b), String(c)]]), answer: right,
        wrong: [[near, `That digit is in the next column along. Read the heading above each digit and match it to ${nm}.`, 'M_PLACE_OFF_BY_ONE'], [w, `That digit is in the ones place, before the point. The first column after the point is tenths, not ones.`, 'M_TENTHS_AS_TENS'], [right * 10, `The question asks for the digit, not its worth. ${right} tenths, hundredths or thousandths is not a whole number of tens.`, 'M_DIGIT_VALUE_AS_WHOLE']],
        hints: ['Find the column heading you need.', 'Read the digit below it.'], steps: [`The columns are ones, tenths, hundredths, thousandths.`, `The ${nm} column holds ${right}.`], chk: (v) => v === [a, b, c][k] };
    } }),

  // ---------------------------------------------------------------- DEC_DIGIT_VALUE
  fam({ id: 'g5c.dec.value.worth', cs: `${DC}DEC_DIGIT_VALUE`, form: 'word', rung: 1,
    gen: () => {
      const d = [randInt(1, 9), randInt(1, 9), randInt(1, 9), randInt(1, 9)], k = randInt(1, 3);
      if (d[k] === d[0]) return null;
      const n = `${d[0]}.${d[1]}${d[2]}${d[3]}`, v = dp(d[k] / 10 ** k), near = dp(d[k] / 10 ** (k === 3 ? 2 : k + 1));
      return { question: `A scale shows a mass of ${n} kg. What is the value of the digit ${d[k]} in this number, written as a decimal?`, answer: v,
        wrong: [[d[k], 'After the point a digit is worth part of 1, not a whole number of ones.', 'M_DIGIT_VALUE_AS_WHOLE'], [d[k] * 10 ** k, `A place after the point is not tens or hundreds. It is a part of one, so its value is less than 1.`, 'M_TENTHS_AS_TENS'], [near, `That is the value in the next place along. Count the places from the point again: tenths, hundredths, thousandths.`, 'M_PLACE_OFF_BY_ONE']],
        hints: ['Name the place: tenths, hundredths or thousandths.', 'Say the value aloud, for example 8 hundredths.'], steps: [`The ${d[k]} is in the ${['', 'tenths', 'hundredths', 'thousandths'][k]} place.`, `Its value is ${v}.`], chk: (x) => Math.round(x * 10 ** k) === d[k] };
    } }),
  fam({ id: 'g5c.dec.value.write', cs: `${DC}DEC_DIGIT_VALUE`, form: 'direct', rung: 2,
    gen: () => {
      const w = randInt(2, 9), th = randInt(1, 9), hu = randInt(1, 9), right = `${w}.0${hu}${th}`;
      if (th === hu) return null;
      const options = mc(right, [[`${w}.${hu}${th}`, `The tenths place is empty, and a zero must hold it. Without the zero every digit moves one place to the left and is worth ten times too much.`, 'M_MISSING_PLACEHOLDER_ZERO'], [`${w}.0${th}${hu}`, `The hundredths digit is ${hu} and the thousandths digit is ${th}. You wrote them the wrong way round.`, 'M_PLACES_SWAPPED'], [`${w}.${hu}0${th}`, `The zero belongs in the tenths place, straight after the point. You put it after the ${hu}, in the hundredths place.`, 'M_PLACE_OFF_BY_ONE']]);
      return { question: `A parcel weighs ${w} ones, 0 tenths, ${hu} hundredths and ${th} thousandths of a kilogram. Write its mass as a decimal.`, options, instruction: 'Choose the decimal.',
        hints: ['Make a chart: ones, tenths, hundredths, thousandths.', 'Write a digit in every column.'], steps: [`Ones ${w}, tenths 0, hundredths ${hu}, thousandths ${th}.`, `${right}.`] };
    } }),
  fam({ id: 'g5c.dec.value.expanded', cs: `${DC}DEC_DIGIT_VALUE`, form: 'steps', rung: 3,
    gen: () => {
      const w = randInt(2, 9), a = randInt(1, 9), c = randInt(1, 9), n = dp(w + a / 10 + c / 1000), p = person();
      return { question: `A jerrican of milk holds ${n} litres. ${p.name} writes it as ${w} + ${dp(a / 10)} + ${dp(c / 1000)}.`,
        parts: [{ prompt: 'What is the value of the digit in the hundredths place?', answer: 0, hint: 'Look at the digit two places after the point.', wrong: [[a, 'That is the digit in the tenths place.', 'M_DIGIT_VALUE_AS_WHOLE'], [c, 'That is the digit in the thousandths place.', 'M_DIGIT_VALUE_AS_WHOLE'], [0.01, 'The hundredths digit is 0, so it is worth nothing.', 'M_MISSING_PLACEHOLDER_ZERO']] },
          { prompt: `What is the value of the digit ${c}, as a decimal?`, answer: dp(c / 1000), hint: 'It is in the thousandths place.', wrong: [[dp(c / 100), 'That moves the digit only two places. It is in the thousandths place.', 'M_MISSING_PLACEHOLDER_ZERO'], [c, 'After the point a digit is worth part of 1.', 'M_DIGIT_VALUE_AS_WHOLE'], [dp(c / 10), 'That is tenths. Count three places.', 'M_DIGIT_VALUE_AS_WHOLE']] }],
        steps: [`${n}: ones ${w}, tenths ${a}, hundredths 0, thousandths ${c}.`, `${c} thousandths is ${dp(c / 1000)}.`], chk: (x, v) => v[0] === 0 && v[1] === dp(c / 1000) };
    } }),

  // ---------------------------------------------------------------- DEC_COMPARE
  fam({ id: 'g5c.dec.cmp.which', cs: `${DC}DEC_COMPARE`, form: 'word', rung: 1,
    gen: () => {
      const t = randInt(5, 7), h = randInt(1, 9), a = dp(t / 10 + h / 100), b = dp((t - 1) / 10 + randInt(7, 9) / 100 + randInt(1, 9) / 1000), c = dp((t - 1) / 10);
      const options = mc(String(a), [[String(b), `${b} has more digits, but that does not make it larger. Compare the tenths first: ${Math.floor(b * 10)} tenths is less than ${t} tenths.`, 'M_LONGER_IS_LARGER'], [String(c), `${c} has fewer digits, but that does not make it larger either. Compare the tenths first: ${Math.floor(c * 10 + 1e-9)} tenths is less than ${t} tenths.`, 'M_SHORTER_IS_LARGER']]);
      return { question: `Three parcels weigh ${shuffle([a, b, c]).join(' kg, ')} kg. Which is the largest mass? Choose the larger decimal.`, options, instruction: 'Choose the largest decimal.',
        hints: ['Write them all with the same number of decimal places.', 'Compare tenths, then hundredths.'], steps: [`${a.toFixed(3)}, ${b.toFixed(3)}, ${c.toFixed(3)}.`, `${a} is the largest.`] };
    } }),
  fam({ id: 'g5c.dec.cmp.symbol', cs: `${DC}DEC_COMPARE`, form: 'direct', rung: 2,
    gen: () => {
      const mode = randInt(0, 2), x = randInt(1, 8) / 10, a = mode === 0 ? `${x}0` : mode === 1 ? `${x}` : `${dp(x + 0.012)}`, b = mode === 0 ? `${x}` : mode === 1 ? `${dp(x + 0.125) > x ? dp(x + 0.0125) : x}` : `${x}`;
      const va = Number(a), vb = Number(b), right = va > vb ? '>' : va < vb ? '<' : '=';
      if (a === b) return null;
      const options = mc(right, [[right === '=' ? '>' : '=', right === '=' ? 'A zero at the end of a decimal does not change its value. 0.70 and 0.7 are both 70 hundredths.' : 'The two numbers are not equal. Compare place by place.', right === '=' ? 'M_TRAILING_ZERO_CHANGES_VALUE' : 'M_TRAILING_ZERO_CHANGES_VALUE'], [right === '>' ? '<' : '>', 'Add zeros to give the same number of decimal places, then compare.', right === '=' ? 'M_TRAILING_ZERO_CHANGES_VALUE' : 'M_LONGER_IS_LARGER'], ['<>'.includes(right) ? ('<>'.replace(right, '')) : '<', 'Add zeros to give the same number of decimal places, then compare.', 'M_SHORTER_IS_LARGER']].filter((w, i, arr) => arr.findIndex(z => z[0] === w[0]) === i));
      if (!options || options.length < 3) return null;
      return { question: `Which symbol, >, < or =, makes this true: ${a} ___ ${b}?`, options, instruction: 'Choose the symbol.',
        hints: ['Write both numbers with the same number of decimal places.', 'Compare place by place from the left.'], steps: [`${va.toFixed(3)} and ${vb.toFixed(3)}.`, `${a} ${right} ${b}.`] };
    } }),
  fam({ id: 'g5c.dec.cmp.spot', cs: `${DC}DEC_COMPARE`, form: 'spot', rung: 3,
    gen: () => {
      const a = pick([0.3, 0.4, 0.5, 0.6]), b = dp(a - 0.2 + randInt(1, 9) / 1000 + 0.05), p = person();
      if (!(a > b)) return null;
      return { question: `${p.name} says ${b} is greater than ${a}. Which step has the mistake?`,
        working: [{ text: `Step 1: ${b} has three digits after the point and ${a} has one.`, ok: true }, { text: `Step 2: More digits after the point means a larger number.`, ok: false }, { text: `Step 3: So ${b} is greater than ${a}.`, ok: true }],
        fix: `Compare tenths first. ${a} = ${a.toFixed(3)} is greater than ${b.toFixed(3)}. The number of digits does not decide.`, mis: 'M_LONGER_IS_LARGER', hints: ['Write both with three decimal places.'], steps: [`${a.toFixed(3)} > ${b.toFixed(3)}.`] };
    } }),

  // ---------------------------------------------------------------- DEC_ORDER
  fam({ id: 'g5c.dec.ord.race', cs: `${DC}DEC_ORDER`, form: 'word', rung: 2,
    gen: () => {
      const w = randInt(11, 14), t = [dp(w + 0.9), dp(w + 1 + 0.05 + randInt(0, 4) / 100), dp(w + 0.875)], names = shuffle(['Achieng', 'Baraka', 'Chebet']);
      const s = [...t].sort((a, b) => a - b), shown = names.map((n, i) => `${n} ${t[i]}`);
      return { question: `Three runners finish a race in these times, in seconds: ${shown.join(', ')}. The smallest time wins. What is the winning time in seconds?`, answer: s[0],
        wrong: [[t[0], `${t[2]} has more digits, but a longer decimal is not a bigger number. Compare place by place: ${t[0]} and ${t[2]} have the same whole number and ${t[2]} has fewer tenths, so it is the smaller time.`, 'M_LONGER_IS_LARGER'], [t[1], `You looked at the digits after the point only and saw the small ${String(t[1]).split('.')[1]}. The whole number counts first: ${Math.floor(t[1])} is more than ${Math.floor(t[2])}, so that is the slowest time.`, 'M_IGNORES_WHOLE_PART'], [dp(s[0] + 0.01), `Look at the hundredths digit again. The winning time is a little less than that.`, 'SLIP']],
        hints: ['Compare the whole numbers first.', 'If they match, compare tenths, then hundredths.'], steps: [`In order: ${s.join(', ')}.`, `The winning time is ${s[0]} seconds.`], chk: (v) => t.includes(v) && t.every(x => v <= x) };
    } }),
  fam({ id: 'g5c.dec.ord.list', cs: `${DC}DEC_ORDER`, form: 'direct', rung: 2,
    gen: () => {
      const w = randInt(1, 8), set = pick([[w + 0.05 + 1, w + 0.9, w + 0.875], [w + 1, w + 0.875, w + 0.95], [w + 0.5, w + 0.45, w + 0.075]]).map(x => dp(x));
      if (new Set(set).size < 3) return null;
      const asc = [...set].sort((a, b) => a - b), shown = shuffle(set), f = (l) => l.join(', ');
      if (f(shown) === f(asc)) return null;
      const fracOrder = [...set].sort((a, b) => (a % 1) - (b % 1));
      const options = mc(f(asc), [[f([...asc].reverse()), 'That is largest first. Smallest to largest means the smallest amount is written first.', 'M_ORDER_DIRECTION_REVERSED'], [f(fracOrder), 'You ordered by the digits after the point only. The whole number part counts first.', 'M_IGNORES_WHOLE_PART'], [f([...set].sort((a, b) => String(a).length - String(b).length || a - b)), 'The number of digits does not decide the order. Compare place by place.', 'M_WHOLE_NUMBER_SMALLEST']].filter(w => w[0] !== f(asc)));
      return { question: `Three jerricans hold ${f(shown)} litres of water. Arrange the amounts from the least water to the most.`, options, instruction: 'Choose the correct order.',
        hints: ['Compare the whole numbers first, then tenths, hundredths and thousandths.', 'Write each with three decimal places.'], steps: [`With three decimal places: ${asc.map(x => x.toFixed(3)).join(', ')}.`, `Smallest to largest: ${f(asc)}.`] };
    } }),
  fam({ id: 'g5c.dec.ord.between', cs: `${DC}DEC_ORDER`, form: 'steps', rung: 3,
    gen: () => {
      const a = randInt(1, 8) + randInt(2, 4) / 10, b = dp(a + 0.2), mid = dp(a + 0.1), p = person();
      return { question: `A decimal lies between ${a} and ${b}. ${p.name} tests three numbers.`,
        parts: [{ prompt: `Is ${mid} between ${a} and ${b}? Answer 1 for yes, 0 for no.`, answer: 1, hint: 'Compare tenths.', wrong: [[0, `${mid} is bigger than ${a} and smaller than ${b}.`, 'M_IGNORES_WHOLE_PART'], [2, 'Answer 1 or 0.', 'M_IGNORES_WHOLE_PART']] },
          { prompt: `Is ${dp(a + 0.25)} between ${a} and ${b}? Answer 1 for yes, 0 for no.`, answer: 0, hint: 'Is it larger than the bigger end?', wrong: [[1, `${dp(a + 0.25)} is more than ${b}.`, 'M_LONGER_IS_LARGER'], [2, 'Answer 1 or 0.', 'M_LONGER_IS_LARGER']] }],
        steps: [`${a} < ${mid} < ${b}: yes.`, `${dp(a + 0.25)} > ${b}: no.`], chk: (x, v) => v[0] === 1 && v[1] === 0 };
    } }),

  // ---------------------------------------------------------------- DEC_ADD_SAME_PLACES
  fam({ id: 'g5c.dec.add.same.market', cs: `${DC}DEC_ADD_SAME_PLACES`, form: 'word', rung: 1,
    gen: () => {
      const a = dp(randInt(11, 99) / 10), b = dp(randInt(11, 99) / 10), t = dp(a + b), tenthsSum = Math.round(a * 10) % 10 + Math.round(b * 10) % 10;
      if (tenthsSum < 10) return null;
      const sep = Number(`${Math.floor(a) + Math.floor(b)}.${Math.round(a * 10) % 10 + Math.round(b * 10) % 10}`);
      return { question: `A trader sells ${a} kg of maize flour in the morning and ${b} kg in the afternoon. How many kilograms did the trader sell in all?`, answer: t,
        wrong: [[sep, 'You added the whole numbers and the tenths on their own. When the tenths come to 10 or more, every 10 tenths makes 1 whole, so regroup them into the ones.', 'M_ADD_PARTS_SEPARATELY'], [digs(a, 1) + digs(b, 1), 'The decimal point is missing. Put it back, with one digit after it.', 'M_POINT_DROPPED'], [dp(t + 1), 'One whole too many. Count the ones again, including the one you regrouped from the tenths.', 'SLIP'], [dp(t - 1), 'One whole too few. Count the ones again, including the one you regrouped from the tenths.', 'SLIP']],
        hints: ['Line up the decimal points.', 'Add the tenths first. Regroup tenths as ones when you can.'], steps: [`${a} + ${b}.`, `${t} kg.`], chk: (v) => dp(v - b) === a };
    } }),
  fam({ id: 'g5c.dec.add.same.thousandths', cs: `${DC}DEC_ADD_SAME_PLACES`, form: 'direct', rung: 2,
    gen: () => {
      const a = dp(randInt(1000, 9999) / 1000), b = dp(randInt(1000, 9999) / 1000), t = dp(a + b);
      if (places(a) < 3 || places(b) < 3) return null;
      const options = mc(String(t), [[String(digs(a, 3) + digs(b, 3)), 'The decimal point is missing. Put it in the answer first.', 'M_POINT_DROPPED'], [String(dp(Math.floor(a) + Math.floor(b) + Number(`0.${(digs(a, 3) % 1000) + (digs(b, 3) % 1000)}`))), 'You added the whole numbers and the decimal parts separately. Regroup across the point.', 'M_ADD_PARTS_SEPARATELY'], [String(dp(t + 0.1)), 'One tenth too many. Check the regrouping from the hundredths to the tenths again.', 'SLIP']]);
      return { question: `Which is the sum when ${a.toFixed(3)} metres of rope is joined to ${b.toFixed(3)} metres of rope?`, options, instruction: 'Choose the total length.',
        hints: ['Line up the decimal points.', 'Add from the thousandths, regrouping as needed.'], steps: [`${a.toFixed(3)} + ${b.toFixed(3)}.`, `${t.toFixed(3)} metres.`] };
    } }),
  fam({ id: 'g5c.dec.add.same.missing', cs: `${DC}DEC_ADD_SAME_PLACES`, form: 'spot', rung: 3,
    gen: () => {
      const a = dp(randInt(11, 99) / 10), b = dp(randInt(11, 99) / 10), p = person();
      if (Math.round(a * 10) % 10 + Math.round(b * 10) % 10 < 10) return null;
      const sep = `${Math.floor(a) + Math.floor(b)}.${Math.round(a * 10) % 10 + Math.round(b * 10) % 10}`;
      return { question: `${p.name} works out ${a} + ${b}. Which step has the mistake?`,
        working: [{ text: `Step 1: Add the whole numbers: ${Math.floor(a)} + ${Math.floor(b)} = ${Math.floor(a) + Math.floor(b)}.`, ok: true }, { text: `Step 2: Add the tenths as a separate whole number: ${Math.round(a * 10) % 10} + ${Math.round(b * 10) % 10} = ${Math.round(a * 10) % 10 + Math.round(b * 10) % 10}. Write it after the point.`, ok: false }, { text: `Step 3: The sum is ${sep}.`, ok: true }],
        fix: `More than 9 tenths must be regrouped into ones. The sum is ${dp(a + b)}.`, mis: 'M_ADD_PARTS_SEPARATELY', hints: ['What do 10 tenths make?'], steps: [`${a} + ${b} = ${dp(a + b)}.`] };
    } }),

  // ---------------------------------------------------------------- DEC_ADD_MIXED_PLACES
  fam({ id: 'g5c.dec.addm.market', cs: `${DC}DEC_ADD_MIXED_PLACES`, form: 'word', rung: 2,
    gen: () => {
      const a = dp(randInt(11, 59) / 10), b = dp(randInt(101, 499) / 100), t = dp(a + b);
      if (places(a) !== 1 || places(b) !== 2) return null;
      const r = dp((digs(a, 1) + digs(b, 2)) / 100);
      return { question: `${person().name} bought ${a} kg of ${pick(GRAMS)} and ${b} kg of tomatoes. What is the total mass in kilograms?`, answer: t,
        wrong: [[r, 'You lined up the last digits. Line up the decimal points instead: write the first mass as ' + a.toFixed(2) + '.', 'M_RIGHT_ALIGN_DIGITS'], [dp(r * 10), 'The decimal point is in the wrong place. Count the digits after the point in the numbers you were given.', 'M_POINT_DROPPED'], [dp(t + 0.1), 'One tenth too many. Add the tenths column again.', 'SLIP'], [dp(t - 0.1), 'One tenth too few. Add the tenths column again.', 'SLIP']],
        hints: ['Write both masses with two decimal places.', 'Line up the decimal points, then add.'], steps: [`${a.toFixed(2)} + ${b.toFixed(2)}.`, `${t} kg.`], chk: (v) => dp(v - b) === a };
    } }),
  fam({ id: 'g5c.dec.addm.whole', cs: `${DC}DEC_ADD_MIXED_PLACES`, form: 'direct', rung: 2,
    gen: () => {
      const w = randInt(3, 12), d = dp(randInt(11, 99) / 100), t = dp(w + d);
      if (places(d) !== 2) return null;
      const bad = dp((w + digs(d, 2)) / 100);
      const options = mc(String(t), [[String(bad), 'You put the whole number under the decimal digits. Write ' + w + ' as ' + w + '.00 and line up the points.', 'M_WHOLE_AS_DECIMAL_DIGITS'], [String(w * 100 + digs(d, 2)), 'The decimal point is missing. The length is a few metres and a part of a metre, so put the point back.', 'M_POINT_DROPPED'], [String(dp(t + 0.1)), 'One tenth too many. Write ' + w + '.00 + ' + d.toFixed(2) + ' and add the tenths again.', 'SLIP']]);
      return { question: `A rope is ${w} metres long. A piece ${d.toFixed(2)} metres long is added to it. What is the new length in metres?`, options, instruction: 'Choose the length.',
        hints: [`Rewrite ${w} as ${w}.00.`, 'Line up the decimal points and add.'], steps: [`${w}.00 + ${d.toFixed(2)}.`, `${t.toFixed(2)} metres.`] };
    } }),
  fam({ id: 'g5c.dec.addm.price', cs: `${DC}DEC_ADD_MIXED_PLACES`, form: 'steps', rung: 3,
    gen: () => {
      const a = dp(randInt(21, 99) / 10), b = dp(randInt(5, 9) / 10 + randInt(0, 9) / 100), c = randInt(2, 6), p = person();
      if (places(b) !== 2 && places(b) !== 1) return null;
      return { question: `${p.name} buys ${a} kg of rice, ${b} kg of salt and ${c} kg of flour.`,
        parts: [{ prompt: 'How many kilograms are the rice and the salt together?', answer: dp(a + b), unit: 'kg', hint: 'Line up the decimal points.', wrong: [[dp((digs(a, 1) + digs(b, places(b))) / 10 ** Math.max(1, places(b))), 'You lined up the last digits. Line up the decimal points.', 'M_RIGHT_ALIGN_DIGITS'], [dp(a + b + 0.1), 'Check the tenths column.', 'M_RIGHT_ALIGN_DIGITS'], [dp(a - b), 'Together means add.', 'M_RIGHT_ALIGN_DIGITS']] },
          { prompt: 'How many kilograms is that with the flour added?', answer: dp(a + b + c), unit: 'kg', hint: 'Add the whole number c to the decimal total.', wrong: [[dp((a + b) * 10 + c) / 10, 'Put the whole number in the ones place, not under the decimal digits.', 'M_WHOLE_AS_DECIMAL_DIGITS'], [dp(a + b + c * 0.1), 'The flour is a whole number of kilograms.', 'M_WHOLE_AS_DECIMAL_DIGITS'], [dp(a + b), 'The flour is missing.', 'M_WHOLE_AS_DECIMAL_DIGITS']] }],
        steps: [`${a} + ${b} = ${dp(a + b)}.`, `${dp(a + b)} + ${c} = ${dp(a + b + c)}.`], chk: (x, v) => dp(v[0] - b) === a && dp(v[1] - c) === v[0] };
    } }),

  // ---------------------------------------------------------------- DEC_SUB_SAME_PLACES
  fam({ id: 'g5c.dec.sub.same.change', cs: `${DC}DEC_SUB_SAME_PLACES`, form: 'word', rung: 2,
    gen: () => {
      const a = dp(randInt(300, 900) / 100), b = dp(randInt(100, 299) / 100), t = dp(a - b);
      if (places(a) !== 2 || places(b) !== 2 || Math.abs(subCols(a, b, 2) - t) < 0.001) return null;
      return { question: `A metre of cloth is cut from a roll. The roll was ${a.toFixed(2)} metres long and ${b.toFixed(2)} metres were used. How many metres are left?`, answer: t,
        wrong: [[subCols(a, b, 2), 'In every column you took the smaller digit from the larger. When the top digit is smaller, regroup: exchange 1 tenth for 10 hundredths.', 'M_SMALLER_FROM_LARGER'], [dp(t + 0.1), 'One tenth too many. Check how much you took from the tenths when you regrouped.', 'SLIP'], [dp(t - 0.1), 'One tenth too few. Check how much you took from the tenths when you regrouped.', 'SLIP'], [dp(a + b), 'The roll gets shorter when cloth is used, so the answer is less than the roll. You added instead of taking away.', 'M_SUB_DONE_AS_ADDITION']],
        hints: ['Line up the decimal points.', 'Regroup 1 tenth as 10 hundredths when you need to.'], steps: [`${a.toFixed(2)} − ${b.toFixed(2)}.`, `${t.toFixed(2)} m.`], chk: (v) => dp(v + b) === a };
    } }),
  fam({ id: 'g5c.dec.sub.same.zero', cs: `${DC}DEC_SUB_SAME_PLACES`, form: 'direct', rung: 3,
    gen: () => {
      const a = dp(randInt(3, 9) + 0.003), b = dp(randInt(1, 2) + randInt(1, 9) / 10 + randInt(1, 9) / 100 + randInt(4, 9) / 1000), t = dp(a - b);
      if (a <= b) return null;
      const wrong = noDec(a, b, 3);
      if (wrong === t) return null;
      const options = mc(String(t), [[String(wrong), 'When you regroup across the zeros, each zero becomes 9 and the digit you took from goes down by 1.', 'M_REGROUP_ACROSS_ZERO'], [String(subCols(a, b, 3)), 'Do not take the smaller digit from the larger. Regroup.', 'M_SMALLER_FROM_LARGER'], [String(dp(t + 0.001)), 'One thousandth too many. Check the thousandths column again after you regroup across the zeros.', 'SLIP']]);
      return { question: `Which is the difference when ${b.toFixed(3)} kg is taken from ${a.toFixed(3)} kg?`, options, instruction: 'Choose the difference.',
        hints: ['Line up the decimal points.', 'Exchange one whole for ten tenths, one tenth for ten hundredths, and so on.'], steps: [`${a.toFixed(3)} − ${b.toFixed(3)}.`, `${t.toFixed(3)} kg. Check: ${t.toFixed(3)} + ${b.toFixed(3)} = ${a.toFixed(3)}.`] };
    } }),
  fam({ id: 'g5c.dec.sub.same.spot', cs: `${DC}DEC_SUB_SAME_PLACES`, form: 'spot', rung: 3,
    gen: () => {
      const a = dp(randInt(500, 900) / 100), b = dp(randInt(200, 499) / 100), p = person();
      if (places(a) !== 2 || places(b) !== 2 || subCols(a, b, 2) === dp(a - b)) return null;
      return { question: `${p.name} works out ${a.toFixed(2)} − ${b.toFixed(2)}. Which step has the mistake?`,
        working: [{ text: 'Step 1: Line up the decimal points.', ok: true }, { text: 'Step 2: In each column, subtract the smaller digit from the bigger one.', ok: false }, { text: `Step 3: The difference is ${subCols(a, b, 2).toFixed(2)}.`, ok: true }],
        fix: `When the top digit is smaller, exchange 1 tenth for 10 hundredths. The difference is ${dp(a - b).toFixed(2)}.`, mis: 'M_SMALLER_FROM_LARGER', hints: ['Check by adding the difference to the number taken away.'], steps: [`${dp(a - b).toFixed(2)}.`] };
    } }),

  // ---------------------------------------------------------------- DEC_SUB_MIXED_PLACES
  fam({ id: 'g5c.dec.subm.whole', cs: `${DC}DEC_SUB_MIXED_PLACES`, form: 'word', rung: 2,
    gen: () => {
      const w = randInt(5, 12), d = dp(randInt(11, 99) / 100), t = dp(w - d);
      if (places(d) !== 2) return null;
      const bad = dp(w - Math.floor(d) + (d - Math.floor(d)));
      return { question: `Otieno had ${w} litres of milk and sold ${d.toFixed(2)} litres. How much milk is left?`, answer: t,
        wrong: [[dp((w - 1) + d), 'You subtracted the whole parts and copied the decimal part. Write ' + w + ' as ' + w + '.00 and subtract every column.', 'M_WHOLE_MINUS_DECIMAL'], [dp(w + d), 'Selling milk leaves less than before, not more. You added instead of taking away.', 'M_SUB_DONE_AS_ADDITION'], [dp(t + 0.1), 'One tenth too many. Check the regrouping from the ones to the tenths again.', 'SLIP'], [dp(t - 0.1), 'One tenth too few. Check the regrouping from the ones to the tenths again.', 'SLIP']],
        hints: [`Write ${w} as ${w}.00.`, 'Subtract the hundredths, then the tenths, then the ones.'], steps: [`${w}.00 − ${d.toFixed(2)}.`, `${t.toFixed(2)} litres.`], chk: (v) => dp(v + d) === w };
    } }),
  fam({ id: 'g5c.dec.subm.extra', cs: `${DC}DEC_SUB_MIXED_PLACES`, form: 'direct', rung: 3,
    gen: () => {
      const a = dp(randInt(41, 90) / 10), b = dp(randInt(1001, 3999) / 1000), t = dp(a - b);
      if (places(a) !== 1 || places(b) !== 3 || t <= 0) return null;
      const bring = Number(`${dp(a - Math.floor(b * 10) / 10)}${String(digs(b, 3) % 100).padStart(2, '0')}`);
      const options = mc(String(t), [[String(bring), 'You brought the extra digits straight down. Write ' + a + ' as ' + a.toFixed(3) + ' and subtract every column.', 'M_BRING_DOWN_DIGITS'], [String(dp(t + 0.001)), 'One thousandth too many. Subtract the thousandths column again.', 'SLIP'], [String(dp(a + b)), 'Leaking takes water out of the tank, so less is left than at the start. You added instead of taking away.', 'M_SUB_DONE_AS_ADDITION']]);
      return { question: `A tank holds ${a} litres. ${b.toFixed(3)} litres leak out. Which is the amount left?`, options, instruction: 'Choose the amount.',
        hints: [`Write ${a} as ${a.toFixed(3)}.`, 'Subtract each column from the thousandths.'], steps: [`${a.toFixed(3)} − ${b.toFixed(3)}.`, `${t.toFixed(3)} litres.`] };
    } }),
  fam({ id: 'g5c.dec.subm.change', cs: `${DC}DEC_SUB_MIXED_PLACES`, form: 'steps', rung: 3,
    gen: () => {
      const price = dp(randInt(12, 79) + randInt(1, 9) / 10 * (Math.random() < 0.5 ? 1 : 0)), note = 100, p = person();
      const price2 = dp(randInt(5, 30) + randInt(1, 9) / 10);
      return { question: `${p.name} pays for an item priced sh ${price.toFixed(2)} with a sh 100 note, then buys another item at sh ${price2.toFixed(2)} with the change.`,
        parts: [{ prompt: 'How much change is there from the sh 100 note?', answer: dp(note - price), unit: 'sh', hint: 'Write 100 as 100.00 and subtract.', wrong: [[dp(note - Math.floor(price) + (price % 1)), 'Subtract the whole parts and the decimal parts as one number, not separately.', 'M_WHOLE_MINUS_DECIMAL'], [price, 'That is the price, not the change.', 'M_WHOLE_MINUS_DECIMAL'], [dp(note + price), 'Change is what is left.', 'M_WHOLE_MINUS_DECIMAL']] },
          { prompt: 'How much is left after the second item?', answer: dp(note - price - price2), unit: 'sh', hint: 'Take the second price from the change.', wrong: [[dp(note - price + price2), 'Buying takes money away.', 'M_WHOLE_MINUS_DECIMAL'], [dp(note - price2), 'Take both prices from the note.', 'M_WHOLE_MINUS_DECIMAL'], [dp(note - price), 'The second item has not been taken off yet.', 'M_WHOLE_MINUS_DECIMAL']] }],
        steps: [`${note}.00 − ${price.toFixed(2)} = ${dp(note - price).toFixed(2)}.`, `${dp(note - price).toFixed(2)} − ${price2.toFixed(2)} = ${dp(note - price - price2).toFixed(2)}.`], chk: (x, v) => dp(v[0] + price) === note && dp(v[0] - price2) === v[1] };
    } }),

  // ---------------------------------------------------------------- DEC_MULT_1000
  fam({ id: 'g5c.dec.k.grams', cs: `${DC}DEC_MULT_1000`, form: 'word', rung: 1,
    gen: () => {
      const kg = pick([3.2, 2.45, 0.375, 4.6, 1.25, 0.04, 5.075, 0.9]), t = dp(kg * 1000);
      return { question: `A bag holds ${kg} kg of rice. How many grams is that? Multiply ${kg} × 1000.`, answer: t,
        wrong: [[t / 10, 'The point moves three places, not two. Move it once for each zero of 1000.', 'M_WRONG_NUMBER_OF_PLACES'], [dp(kg / 1000), 'Multiplying by 1000 makes the number bigger, so the digits move to the left, not the right.', 'M_MOVES_WRONG_WAY'], [Number(String(kg).replace('.', '') + '000'), 'You took out the point and wrote three zeros on the end. The digits must move three places instead, so the point moves to the right.', 'M_ANNEX_ZEROS'], [Number(String(kg).replace('.', '')), 'You moved the point to the end but left the empty places. Fill each empty place with a zero.', 'M_NO_ZERO_FILL']].filter(w => w[0] !== t),
        hints: ['Move the digits three places to the left.', 'Put a 0 in every empty place.'], steps: [`${kg} × 1000: three places left.`, `${commas(t)} g.`], chk: (v) => dp(v / 1000) === kg };
    } }),
  fam({ id: 'g5c.dec.k.missing', cs: `${DC}DEC_MULT_1000`, form: 'direct', rung: 2,
    gen: () => {
      const x = pick([2.045, 0.375, 1.8, 0.06, 3.2, 4.075]), t = dp(x * 1000);
      const options = mc(String(x), [[String(dp(x * 10)), 'Undoing × 1000 means dividing by 1000, so the point moves three places to the left. You moved it two.', 'M_WRONG_NUMBER_OF_PLACES'], [String(dp(t)), 'Multiplying by 1000 makes a number 1000 times bigger. The missing number is smaller than ' + commas(t) + ', not the same.', 'M_MOVES_WRONG_WAY']]);
      return { question: `Which number goes in the box? □ × 1000 = ${commas(t)}`, options, instruction: 'Choose the number.',
        hints: ['Undo the multiplication by dividing by 1000.', 'Move the digits three places to the right.'], steps: [`${commas(t)} ÷ 1000 = ${x}.`, `Check: ${x} × 1000 = ${commas(t)}.`] };
    } }),
  fam({ id: 'g5c.dec.k.spot', cs: `${DC}DEC_MULT_1000`, form: 'spot', rung: 3,
    gen: () => {
      const x = pick([2.45, 3.2, 0.375, 1.8]), p = person(), t = dp(x * 1000);
      return { question: `${p.name} works out ${x} × 1000. Which step has the mistake?`,
        working: [{ text: 'Step 1: Multiplying by 1000 makes the number bigger.', ok: true }, { text: `Step 2: Write three zeros on the end of ${x}.`, ok: false }, { text: `Step 3: The answer is ${x}000.`, ok: true }],
        fix: `Move each digit three places to the left. The answer is ${commas(t)}.`, mis: 'M_ANNEX_ZEROS', hints: ['Is 2.45000 any bigger than 2.45?'], steps: [`${x} × 1000 = ${commas(t)}.`] };
    } }),
];

function subCols(a, b, n) { const x = String(digs(a, n)).padStart(8, '0').split('').map(Number), y = String(digs(b, n)).padStart(8, '0').split('').map(Number); return Number(x.map((d, i) => Math.abs(d - y[i])).join('')) / 10 ** n; }
function noDec(a, b, n) { const x = String(digs(a, n)).padStart(8, '0').split('').map(Number).reverse(), y = String(digs(b, n)).padStart(8, '0').split('').map(Number).reverse(); const out = x.map((d, i) => { let t = d - y[i]; if (t < 0) t += 10; return t; }); return Number(out.reverse().join('')) / 10 ** n; }
