// ============================================================================
// GRADE 5 MEASUREMENT: the compound-unit skills of Length (km, m), Capacity (l, ml),
// Mass (kg, g) and Time (min, s): the relationship, both conversions, and add,
// subtract, multiply and divide. One factory, four sets of units, so the four
// strands are built the same careful way and every wrong answer is a procedure
// the misconception library names (regroup at 100, forget to reduce, ...).
// Answers are typed in words: "4 km 300 m".
// ============================================================================
import { fam, randInt, pick, shuffle, commas, person, mc } from './g5c_lib.js';

const M = 'MEASUR.';
const comp = (b, s, big, small) => (b && s ? `${b} ${big} ${s} ${small}` : b ? `${b} ${big}` : `${s} ${small}`);
const plain = (b, s, f) => b * f + s;
const norm = (t, f) => [Math.floor(t / f), t % f];

// kind -> misconception code, per unit set. A kind a set lacks falls back (see code()).
const SETS = {
  length: { key: 'LENGTH', big: 'km', small: 'm', f: 1000, sk: { rel: 'KM_M_RELATIONSHIP', k2s: 'CONVERT_KM_TO_M', s2k: 'CONVERT_M_TO_KM', add: 'ADD_KM_M', sub: 'SUBTRACT_KM_M', mul: 'MULTIPLY_KM_M', div: 'DIVIDE_KM_M' },
    mis: { rel100: 'M_KM_EQUALS_100M', relcmp: 'M_BIGGER_NUMBER_LONGER', relhalf: 'M_KM_EQUALS_100M', k2s100: 'M_KM_TO_M_TIMES_100', k2sconcat: 'M_MISSING_PLACEHOLDER_ZERO', s2kd100: 'M_M_TO_KM_DIVIDE_100', s2kzero: 'M_M_TO_KM_DROPS_ZERO', s2kdir: 'M_M_TO_KM_DIVIDE_100', s2kdec: 'M_M_TO_KM_DIVIDE_100',
      addNo: 'M_ADD_NO_REGROUP', add100: 'M_ADD_REGROUP_AT_100', addLost: 'M_ADD_NO_REGROUP', subSm: 'M_SUB_SMALLER_FROM_LARGER', sub100: 'M_SUB_EXCHANGE_100', subNoRed: 'M_SUB_FORGET_REDUCE_KM', mulNo: 'M_MULT_NO_REGROUP', mulOne: 'M_MULT_ONE_PART_ONLY', mul100: 'M_MULT_NO_REGROUP', mulCarry: 'M_MULT_NO_REGROUP', divIgn: 'M_DIV_IGNORE_REMAINDER', div100: 'M_DIV_REMAINDER_AS_100', divOne: 'M_DIV_IGNORE_REMAINDER' } },
  capacity: { key: 'CAPACITY', big: 'l', small: 'ml', f: 1000, sk: { rel: 'L_ML_RELATIONSHIP', k2s: 'CONVERT_L_TO_ML', s2k: 'CONVERT_ML_TO_L', add: 'ADD_L_ML', sub: 'SUBTRACT_L_ML', mul: 'MULTIPLY_L_ML', div: 'DIVIDE_L_ML' },
    mis: { rel100: 'M_LITRE_IS_100_ML', relcmp: 'M_LITRE_IS_100_ML', relhalf: 'M_HALF_LITRE_50', k2s100: 'M_MULTIPLY_BY_100', k2sconcat: 'M_MIXED_UNIT_PLACEHOLDER', s2kd100: 'M_DIVIDE_BY_100', s2kzero: 'M_SPLIT_DIGITS_WRONG', s2kdir: 'M_DIVIDE_BY_100', s2kdec: 'M_SPLIT_DIGITS_WRONG',
      addNo: 'M_ADD_REGROUP_AT_100', add100: 'M_ADD_REGROUP_AT_100', addLost: 'M_ADD_REGROUP_AT_100', subSm: 'M_SMALLER_FROM_LARGER', sub100: 'M_BORROW_100', subNoRed: 'M_SMALLER_FROM_LARGER', mulNo: 'M_MULT_REGROUP_AT_100', mulOne: 'M_MULTIPLY_LITRES_ONLY', mul100: 'M_MULT_REGROUP_AT_100', mulCarry: 'M_CARRY_BEFORE_MULTIPLY', divIgn: 'M_DROP_REMAINDER_LITRES', div100: 'M_REMAINDER_AS_100ML', divOne: 'M_DIVIDE_LITRES_ONLY' } },
  mass: { key: 'MASS', big: 'kg', small: 'g', f: 1000, sk: { rel: 'MASS_KG_G_RELATIONSHIP', k2s: 'MASS_CONVERT_KG_TO_G', s2k: 'MASS_CONVERT_G_TO_KG', add: 'MASS_ADD_KG_G', sub: 'MASS_SUBTRACT_KG_G', mul: 'MASS_MULTIPLY_KG_G', div: 'MASS_DIVIDE_KG_G' },
    mis: { rel100: 'M_KG_IS_100G', relcmp: 'M_COMPARE_IGNORE_UNITS', relhalf: 'M_HALF_QUARTER_MIXUP', k2s100: 'M_KG_TO_G_TIMES_100', k2sconcat: 'M_MISSING_PLACEHOLDER_ZERO', s2kd100: 'M_G_TO_KG_SPLIT_AT_HUNDREDS', s2kzero: 'M_DROP_ZERO_IN_GRAMMES', s2kdir: 'M_CONVERT_WRONG_DIRECTION', s2kdec: 'M_G_TO_KG_SPLIT_AT_HUNDREDS',
      addNo: 'M_ADD_DROP_CARRY', add100: 'M_ADD_REGROUP_AT_100', addLost: 'M_ADD_DROP_CARRY', subSm: 'M_SUB_SMALLER_FROM_LARGER', sub100: 'M_SUB_BORROW_100', subNoRed: 'M_SUB_EXCHANGE_NOT_REDUCED', mulNo: 'M_MULT_NO_REGROUP', mulOne: 'M_MULT_ONE_PART', mul100: 'M_MULT_NO_REGROUP', mulCarry: 'M_MULT_NO_REGROUP', divIgn: 'M_DIV_IGNORE_KG_REMAINDER', div100: 'M_DIV_REMAINDER_AS_100', divOne: 'M_DIV_WRONG_WAY' } },
  time: { key: 'TIME', big: 'min', small: 's', f: 60, sk: { rel: 'MINUTE_SECOND_RELATION', k2s: 'CONVERT_MIN_TO_SEC', s2k: 'CONVERT_SEC_TO_MIN', add: 'ADD_MIN_SEC', sub: 'SUBTRACT_MIN_SEC', mul: 'MULTIPLY_MIN_SEC', div: 'DIVIDE_MIN_SEC' },
    mis: { rel100: 'M_100_SECONDS_IN_MINUTE', relcmp: 'M_100_SECONDS_IN_MINUTE', relhalf: 'M_100_SECONDS_IN_MINUTE', k2s100: 'M_MIN_TO_SEC_TIMES_100', k2sconcat: 'M_MIXED_CONCATENATE', s2kd100: 'M_SEC_TO_MIN_BY_100', s2kzero: 'M_SEC_TO_MIN_BY_100', s2kdir: 'M_CONVERT_WRONG_DIRECTION', s2kdec: 'M_DECIMAL_REMAINDER',
      addNo: 'M_ADD_NO_REGROUP', add100: 'M_ADD_REGROUP_AT_100', addLost: 'M_ADD_CARRY_LOST', subSm: 'M_SUB_SMALLER_FROM_LARGER', sub100: 'M_SUB_BORROW_100', subNoRed: 'M_SUB_BORROW_NOT_REDUCED', mulNo: 'M_MULT_NO_REGROUP', mulOne: 'M_MULT_MINUTES_ONLY', mul100: 'M_MULT_REGROUP_100', mulCarry: 'M_MULT_NO_REGROUP', divIgn: 'M_DIV_REMAINDER_DROPPED', div100: 'M_DIV_REMAINDER_AS_TEN', divOne: 'M_DIV_ONE_PART_ONLY' } },
};

// Words around the numbers, so the same procedure is not asked the same way twice.
const CTX = {
  length: { add: (p, a, b) => `${p.name} cycles ${a} to a market and then ${b} on to a farm. How far does ${p.she} cycle in all?`, sub: (p, a, b) => `A road to a town is ${a} long. ${p.name} has already covered ${b}. How much further is there to go?`, mul: (p, a, n) => `A boda boda rider makes ${n} trips, each ${a} long. What is the total distance ridden?`, div: (p, a, n) => `A road ${a} long is cleaned in ${n} equal sections by volunteers. How long is each section?`, conv: (p) => `${p.name} reads a distance on a road sign.`, parts: 'lengths', ex: 'a race route' },
  capacity: { add: (p, a, b) => `${p.name} fills one water tank with ${a} of rainwater and a second tank with ${b}. How much rainwater has ${p.she} collected in all?`, sub: (p, a, b) => `From ${a} of cooking oil in a shop drum, ${b} is sold. What quantity of oil is left?`, mul: (p, a, n) => `${p.name} fills ${n} bottles with ${a} of juice each. How much juice is that in total?`, div: (p, a, n) => `Each of ${n} identical jerrycans gets the same share of ${a} of well water. How much is in one jerrycan?`, conv: (p) => `${p.name} reads the amount on a jerrycan.`, parts: 'cups', ex: 'a jerrycan' },
  mass: { add: (p, a, b) => `${p.name} buys ${a} of rice and then ${b} of beans. What is the total mass of the shopping?`, sub: (p, a, b) => `A trader weighs ${a} of onions and sells ${b}. What mass of onions is left?`, mul: (p, a, n) => `A baker uses ${a} of flour for one batch of bread. How much flour is used for ${n} batches?`, div: (p, a, n) => `A farmer divides ${a} of maize seed equally between ${n} plots. How much seed goes to each plot?`, conv: (p) => `${p.name} reads the mass on a market scale.`, parts: 'packets', ex: 'a sack' },
  time: { add: (p, a, b) => `${p.name} sweeps the classroom for ${a} and then the verandah for ${b}. What is the total time spent sweeping?`, sub: (p, a, b) => `${p.name} ran a race in ${a} and a friend ran it in ${b}. How much longer did ${p.she} take?`, mul: (p, a, n) => `One batch of mandazi fries in ${a}. How long do ${n} batches take, one after another?`, div: (p, a, n) => `A lesson of ${a} is shared equally among ${n} groups for reading. How long does each group read?`, conv: (p) => `${p.name} times an activity with a stopwatch.`, parts: 'songs', ex: 'a song' },
};

function build(name) {
  const S = SETS[name], C = CTX[name], { big, small, f } = S, sk = (k) => `${M}${S.key}.${S.sk[k]}`, mis = S.mis;
  const fmt = (b, s) => comp(b, s, big, small), W = `${name.slice(0, 3)}`;
  const acc = (b, s) => [`${plain(b, s, f)} ${small}`];
  const out = [];
  const F = (o) => out.push(fam(o));
  const rnd1 = () => randInt(1, f === 60 ? 9 : 9);
  const smallPart = () => (f === 60 ? randInt(5, 55) : randInt(1, 9) * 50 + (Math.random() < 0.4 ? randInt(1, 9) * 5 : 0) * 1);
  const any = (n) => Array.from({ length: n }, () => 0);

  // ------------------------------------------------------------- relationship
  F({ id: `g5c.${W}.rel.parts`, cs: sk('rel'), form: 'word', rung: 1,
    gen: () => {
      const part = pick(f === 60 ? [5, 10, 15, 20, 30] : [100, 200, 250, 500]), n = f / part, p = person();
      return { question: f === 60 ? `${p.name} counts ${part} ${small} at a time on a stopwatch. How many counts of ${part} ${small} make exactly 1 ${big}?` : `${p.name} makes up one ${big} using ${C.parts === 'lengths' ? `${part} ${small} lengths` : C.parts === 'cups' ? `${part} ${small} cups` : `${part} ${small} packets`}. How many are needed to make exactly 1 ${big}?`, answer: n,
        wrong: [[Math.round(100 / part * 100) / 100, `1 ${big} is ${f} ${small}, not 100 ${small}.`, mis.rel100], [10, `You used 10 as the link between ${big} and ${small}. Check with the full ${f}.`, mis.rel100], [f, `That is the number of ${small} in 1 ${big}, not the number of ${part} ${small} pieces.`, mis.rel100], [f * part, 'Divide the total by the size of one piece.', mis.rel100], [n + 1, 'Check by multiplying the number by ' + part + '.', mis.rel100]],
        hints: [`1 ${big} = ${f} ${small}.`, `How many lots of ${part} fit into ${f}?`], steps: [`${f} ÷ ${part} = ${n}.`, `${n} pieces make 1 ${big}.`], chk: (v) => v * part === f };
    } });
  F({ id: `g5c.${W}.rel.compare`, cs: sk('rel'), form: 'why', rung: 2,
    gen: () => {
      const a = randInt(2, 5), b = a * f - randInt(1, 4) * (f === 60 ? 6 : 100), p = person();
      const options = mc(`${a} ${big} is more, because ${a} ${big} = ${a * f} ${small}`, [[`${b} ${small} is more, because 500 is a bigger number than ${a}`.replace('500', String(b)), 'The units matter. Change both to the same unit before comparing.', mis.relcmp], [`They are the same size`, `${a} ${big} is ${a * f} ${small}, which is not ${b} ${small}.`, mis.relcmp], [`${b} ${small} is more, because ${small} is the smaller unit`, 'A small unit does not make a smaller or bigger total. Compare in the same unit.', mis.relcmp]]);
      return { question: `${person().name} compares two amounts: ${a} ${big} and ${b} ${small}. Which is the larger, and why?`, options, instruction: 'Choose the answer and the reason.',
        hints: [`Change ${a} ${big} to ${small}.`, 'Compare the two numbers in the same unit.'], steps: [`${a} ${big} = ${a * f} ${small}.`, `${a * f} is more than ${b}.`] };
    } });
  F({ id: `g5c.${W}.rel.half`, cs: sk('rel'), form: 'direct', rung: 3,
    gen: () => {
      const half = f / 2, fr = pick([['half', f / 2], ['a quarter', f / 4]]);
      if (f === 60 && fr[0] === 'a quarter') return null;
      const options = mc(String(fr[1]), [[String(fr[1] / 10), `Half and quarter of ${f} are not that small.`, mis.relhalf], [String(fr[1] === f / 2 ? f / 4 : f / 2), 'Check which fraction you need: half is the bigger share.', mis.relhalf], [String(f === 60 ? 50 : 100 * (fr[1] === f / 2 ? 1 : 0.5)), `1 ${big} is ${f} ${small}, so use ${f}.`, mis.rel100]].filter(w => w[0] !== String(fr[1])));
      return { question: f === 60 ? `${person().name} waits for ${fr[0]} of a minute. For how many seconds is that? Choose the number.` : `${person().name} uses ${fr[0]} of a ${big}. How many ${small} is that? Choose the number.`, options, instruction: 'Choose the number.',
        hints: [`1 ${big} = ${f} ${small}.`, `Take ${fr[0]} of ${f}.`], steps: [`${f} ÷ ${fr[0] === 'half' ? 2 : 4} = ${fr[1]}.`, `${fr[1]} ${small}.`] };
    } });

  // ------------------------------------------------------------- conversions
  F({ id: `g5c.${W}.k2s.word`, cs: sk('k2s'), form: 'word', rung: 1,
    gen: () => {
      const b = randInt(2, 9), s = pick([0, 0, randInt(1, 9) * 5, randInt(11, 99), randInt(101, 900)]), t = plain(b, s, f);
      if (f === 60 && s >= 60) return null;
      const p = person();
      return { question: `${C.conv(p)} It reads ${fmt(b, s)}. How many ${small} is that?`, answer: t, accepts: [fmt(b, s)],
        wrong: [[b * 100 + s, `1 ${big} is ${f} ${small}, not 100. Multiply by ${f}.`, mis.k2s100], [Number(`${b}${s}`), `Zeros hold places. Write ${b} ${big} as ${b * f} ${small} and then add ${s}.`, mis.k2sconcat], [b * f, `The extra ${small} are missing. Add ${s} to ${b * f}.`, mis.k2sconcat], [b * 10 + s, `Multiply the ${big} by ${f}.`, mis.k2s100]],
        hints: [`1 ${big} = ${f} ${small}.`, `Multiply the ${big} by ${f}, then add the ${small}.`], steps: [`${b} × ${f} = ${b * f}.`, `${b * f} + ${s} = ${t} ${small}.`], chk: (v) => v - s === b * f };
    } });
  F({ id: `g5c.${W}.k2s.options`, cs: sk('k2s'), form: 'direct', rung: 2,
    gen: () => {
      const b = randInt(2, 9), s = f === 60 ? randInt(5, 55) : pick([5, 45, 50, 8, 75]), t = plain(b, s, f);
      if (f === 60 && s === 5) return null;
      const options = mc(String(t), [[String(b * 100 + s), `1 ${big} is ${f} ${small}.`, mis.k2s100], [String(Number(`${b}${s}`)), 'Place-holder zeros are needed. Convert the big unit first, then add.', mis.k2sconcat], [String(b * f), `The ${s} ${small} must be added on.`, mis.k2sconcat]]);
      return { question: `Which number of ${small} equals ${fmt(b, s)}?`, options, instruction: 'Choose the number.',
        hints: [`${b} ${big} is ${b * f} ${small}.`, 'Then add the rest.'], steps: [`${b} × ${f} = ${b * f}.`, `${b * f} + ${s} = ${t}.`] };
    } });
  F({ id: `g5c.${W}.k2s.spot`, cs: sk('k2s'), form: 'spot', rung: 3,
    gen: () => {
      const b = randInt(2, 9), s = f === 60 ? randInt(10, 55) : randInt(11, 99), t = plain(b, s, f), p = person();
      return { question: `${p.name} changes ${fmt(b, s)} into ${small}. Which step has the mistake?`,
        working: [{ text: `Step 1: ${b} ${big} = ${b * f} ${small}.`, ok: true }, { text: `Step 2: Write the ${big} and ${small} digits side by side: ${b}${s}.`, ok: false }, { text: `Step 3: So the answer is ${b}${s} ${small}.`, ok: true }],
        fix: `Add the ${small} to the converted ${big}: ${b * f} + ${s} = ${t} ${small}.`, mis: mis.k2sconcat, hints: ['Is the number far too small?'], steps: [`${t} ${small}.`] };
    } });
  F({ id: `g5c.${W}.s2k.word`, cs: sk('s2k'), form: 'word', rung: 2,
    gen: () => {
      const b = randInt(2, 9), s = pick([randInt(10, 99), randInt(101, 900), f === 60 ? randInt(10, 59) : randInt(101, 900)]), t = plain(b, s, f);
      if (f === 60 && s >= 60) return null;
      const d100 = fmt(Math.floor(t / 100), t % 100), zero = fmt(b, Number(String(s).replace(/0/g, '')) || 5);
      const dec = fmt(b, Math.round(((t / f) - Math.floor(t / f)) * 10));
      const p = person();
      const wr = f === 60
        ? [[dec, 'You divided and used the decimal digits as seconds. The leftover seconds are what remains after taking out whole minutes.', mis.s2kdec], [d100, 'You split at 100. One minute is 60 seconds.', mis.s2kd100], [`${t * f} min`, 'Dividing by 60, not multiplying, changes seconds to minutes.', mis.s2kdir]]
        : [[d100, `You split off every ${100} ${small}. 1 ${big} is ${f} ${small}.`, mis.s2kd100], [fmt(b, Math.floor(s / 10)), 'The leftover must keep all its digits. Do not cut it short.', mis.s2kzero], [fmt(b + 1, f - s), 'Do not round up. Count the whole units and keep the leftover.', mis.s2kdir], [zero, 'Check any zero in the middle of the number. Zeros hold places.', mis.s2kzero]];
      return { question: `${C.conv(p)} It shows ${t} ${small}. Write this in ${big} and ${small}.`, answer: fmt(b, s), accepts: [`${t} ${small}`], wrong: wr,
        hints: [`Take out as many whole ${big} as you can: 1 ${big} is ${f} ${small}.`, 'What is left over?'], steps: [`${t} ÷ ${f} = ${b} remainder ${s}.`, `${fmt(b, s)}.`], chk: (v) => v === fmt(b, s) };
    } });
  F({ id: `g5c.${W}.s2k.options`, cs: sk('s2k'), form: 'direct', rung: 2,
    gen: () => {
      const b = randInt(2, 9), s = f === 60 ? randInt(10, 55) : pick([45, 50, 105, 250, 308, 640]), t = plain(b, s, f);
      const options = mc(fmt(b, s), [[fmt(Math.floor(t / 100), t % 100), `1 ${big} is ${f} ${small}, not 100.`, mis.s2kd100], [fmt(b, Math.round(((t / f) - b) * 10) || 5), 'The leftover seconds are what remains after whole units are taken out.', mis.s2kdec], [fmt(b * 10 + 1, s), 'Check how many whole units fit.', mis.s2kzero]]);
      return { question: `Which of these is ${t} ${small} written in ${big} and ${small}?`, options, instruction: 'Choose the correct amount.',
        hints: [`${f} ${small} make 1 ${big}.`, 'Count the whole units, then the leftover.'], steps: [`${t} ÷ ${f} = ${b} remainder ${s}.`, fmt(b, s) + '.'] };
    } });
  F({ id: `g5c.${W}.s2k.spot`, cs: sk('s2k'), form: 'spot', rung: 3,
    gen: () => {
      const b = randInt(2, 9), s = f === 60 ? randInt(10, 55) : randInt(101, 900), t = plain(b, s, f), p = person();
      return { question: `${p.name} writes ${t} ${small} in ${big} and ${small}. Which step has the mistake?`,
        working: [{ text: `Step 1: Look for whole ${big} in ${t} ${small}.`, ok: true }, { text: `Step 2: Split the number after the hundreds digit: ${Math.floor(t / 100)} and ${t % 100}.`, ok: false }, { text: `Step 3: ${fmt(Math.floor(t / 100), t % 100)}.`, ok: true }],
        fix: `${f} ${small} make 1 ${big}, so divide by ${f}: ${fmt(b, s)}.`, mis: mis.s2kd100, hints: [`How many ${small} make 1 ${big}?`], steps: [`${fmt(b, s)}.`] };
    } });

  // ------------------------------------------------------------- add
  const addDraw = (carry) => {
    const b1 = randInt(1, 6), b2 = randInt(1, 6);
    let s1, s2;
    if (f === 60) { s1 = randInt(20, 55); s2 = carry ? randInt(Math.max(5, 100 - s1), 59) : randInt(5, 59 - s1 > 5 ? 59 - s1 : 5); }
    else { s1 = randInt(10, 90) * 10; s2 = carry ? randInt(Math.max(1, (f - s1) / 10), 99) * 10 : randInt(10, Math.max(10, (f - 1 - s1) / 10)) * 10; if (!carry) { s1 = randInt(10, 40) * 10; s2 = randInt(Math.max(10, 10 - s1 / 10 + 10), 50) * 10; } }
    return [b1, s1, b2, s2];
  };
  F({ id: `g5c.${W}.add.word`, cs: sk('add'), form: 'word', rung: 2,
    gen: () => {
      const [b1, s1, b2, s2] = addDraw(true), sum = s1 + s2;
      if (sum < f || (f === 60 && sum < 100)) return null;
      const [rb, rs] = [b1 + b2 + Math.floor(sum / f), sum % f];
      const p = person();
      return { question: C.add(p, fmt(b1, s1), fmt(b2, s2)), answer: fmt(rb, rs), accepts: acc(rb, rs),
        wrong: [[fmt(b1 + b2, sum), `${sum} ${small} is more than ${f}, so regroup ${f} ${small} as 1 ${big}.`, mis.addNo], [fmt(b1 + b2 + Math.floor(sum / 100), sum % 100), `${big} are made at ${f} ${small}, not 100.`, mis.add100], [fmt(b1 + b2, sum % f), 'You forgot to add the carried unit to the bigger column.', mis.addLost], [fmt(rb, rs + 10), 'Check the column of smaller units again.', mis.addNo]].filter(w => w[0] !== fmt(rb, rs)),
        hints: [`Add the ${small} first.`, `Every ${f} ${small} becomes 1 ${big}.`], steps: [`${s1} + ${s2} = ${sum} ${small} = ${Math.floor(sum / f)} ${big} ${sum % f} ${small}.`, `${b1} + ${b2} + ${Math.floor(sum / f)} = ${b1 + b2 + Math.floor(sum / f)} ${big}.`], chk: (v) => v === fmt(rb, rs) };
    } });
  F({ id: `g5c.${W}.add.options`, cs: sk('add'), form: 'direct', rung: 2,
    gen: () => {
      const [b1, s1, b2, s2] = addDraw(true), sum = s1 + s2;
      if (sum < f || (f === 60 && sum < 100)) return null;
      const [rb, rs] = [b1 + b2 + Math.floor(sum / f), sum % f];
      const options = mc(fmt(rb, rs), [[fmt(b1 + b2, sum), `${sum} ${small} is more than ${f}, so regroup.`, mis.addNo], [fmt(b1 + b2 + Math.floor(sum / 100), sum % 100), `Regroup at ${f}, not 100.`, mis.add100], [fmt(b1 + b2, sum % f), 'The carried unit is missing.', mis.addLost]]);
      return { question: `Which is the sum of ${fmt(b1, s1)} and ${fmt(b2, s2)}?`, options, instruction: 'Choose the sum.',
        hints: [`Add the ${small} first and regroup.`, `Then add the ${big}.`], steps: [`${s1} + ${s2} = ${sum} ${small}.`, `${fmt(rb, rs)}.`] };
    } });
  F({ id: `g5c.${W}.add.spot`, cs: sk('add'), form: 'spot', rung: 3,
    gen: () => {
      const b1 = randInt(1, 6), b2 = randInt(1, 6), s1 = f === 60 ? randInt(30, 50) : randInt(5, 8) * 10, s2 = f === 60 ? randInt(30, 45) : randInt(5, 9) * 10, sum = s1 + s2;
      const ok = f === 60 ? sum >= 60 && sum < 100 : sum >= 100 && sum < f;
      if (!ok) return null;
      const rb = b1 + b2 + (f === 60 ? 1 : 0), rs = f === 60 ? sum - 60 : sum, wb = f === 60 ? b1 + b2 : b1 + b2 + 1, ws = f === 60 ? sum : sum - 100, p = person();
      return { question: `${p.name} adds ${fmt(b1, s1)} and ${fmt(b2, s2)}. Which step has the mistake?`,
        working: [{ text: `Step 1: ${s1} + ${s2} = ${sum} ${small}.`, ok: true }, { text: f === 60 ? `Step 2: ${sum} is less than 100, so no regrouping is needed.` : `Step 2: ${sum} is 100 or more, so change 100 ${small} into 1 ${big}.`, ok: false }, { text: `Step 3: ${fmt(wb, ws)}.`, ok: true }],
        fix: `${f} ${small} make 1 ${big}. ${fmt(b1 + b2 + Math.floor(sum / f), sum % f)} is the sum.`, mis: mis.add100, hints: [`How many ${small} make 1 ${big}?`], steps: [`${fmt(b1 + b2 + Math.floor(sum / f), sum % f)}.`] };
    } });

  // ------------------------------------------------------------- subtract
  const subDraw = () => { const b1 = randInt(3, 9), b2 = randInt(1, b1 - 1), s1 = f === 60 ? randInt(5, 30) : randInt(1, 4) * 100 + (Math.random() < 0.3 ? 50 : 0), s2 = f === 60 ? randInt(s1 + 5, 55) : randInt(s1 / 100 + 1, 9) * 100 + 0; return [b1, s1, b2, s2]; };
  F({ id: `g5c.${W}.sub.word`, cs: sk('sub'), form: 'word', rung: 2,
    gen: () => {
      const [b1, s1, b2, s2] = subDraw(), t = plain(b1, s1, f) - plain(b2, s2, f);
      if (s2 <= s1 || t <= 0) return null;
      const [rb, rs] = norm(t, f), p = person();
      const sm = [b1 - b2, s2 - s1], e100 = [b1 - b2 - 1, s1 + 100 - s2], nr = [b1 - b2, s1 + f - s2];
      return { question: C.sub(p, fmt(b1, s1), fmt(b2, s2)), answer: fmt(rb, rs), accepts: acc(rb, rs),
        wrong: [[fmt(...sm), 'You took the smaller number from the larger in the smaller-unit column. Exchange 1 ' + big + ' for ' + f + ' ' + small + ' instead.', mis.subSm], [e100[1] > 0 ? fmt(...e100) : fmt(b1 - b2 - 1, 20), `1 ${big} is ${f} ${small}, not 100.`, mis.sub100], [fmt(...nr), `You exchanged 1 ${big} but did not reduce the ${big} by 1.`, mis.subNoRed], [fmt(rb, rs + 10 > f ? rs - 10 : rs + 10), 'Check the exchange again.', mis.subSm]].filter(w => w[0] !== fmt(rb, rs)),
        hints: [`Is ${s1} ${small} enough to take away ${s2} ${small}?`, `Exchange 1 ${big} for ${f} ${small}.`], steps: [`${s1} < ${s2}, so exchange: ${b1 - 1} ${big} and ${s1 + f} ${small}.`, `${fmt(rb, rs)}.`], chk: (v) => v === fmt(rb, rs) };
    } });
  F({ id: `g5c.${W}.sub.options`, cs: sk('sub'), form: 'direct', rung: 2,
    gen: () => {
      const [b1, s1, b2, s2] = subDraw(), t = plain(b1, s1, f) - plain(b2, s2, f);
      if (s2 <= s1 || t <= 0) return null;
      const [rb, rs] = norm(t, f);
      const options = mc(fmt(rb, rs), [[fmt(b1 - b2, s2 - s1), 'Exchange when the top is smaller. Do not take the smaller from the larger.', mis.subSm], [fmt(b1 - b2 - 1, s1 + 100 - s2), `1 ${big} is ${f} ${small}.`, mis.sub100], [fmt(b1 - b2, s1 + f - s2), `The ${big} must go down by 1 after the exchange.`, mis.subNoRed]]);
      return { question: `Which is the difference when ${fmt(b2, s2)} is taken from ${fmt(b1, s1)}?`, options, instruction: 'Choose the difference.',
        hints: ['Look at the smaller units first.', `Exchange 1 ${big} when you need to.`], steps: [`Exchange 1 ${big} for ${f} ${small}.`, `${fmt(rb, rs)}.`] };
    } });
  F({ id: `g5c.${W}.sub.spot`, cs: sk('sub'), form: 'spot', rung: 3,
    gen: () => {
      const [b1, s1, b2, s2] = subDraw(), t = plain(b1, s1, f) - plain(b2, s2, f);
      if (s2 <= s1 || t <= 0) return null;
      const [rb, rs] = norm(t, f), p = person();
      return { question: `${p.name} works out ${fmt(b1, s1)} − ${fmt(b2, s2)}. Which step has the mistake?`,
        working: [{ text: `Step 1: ${s1} ${small} is less than ${s2} ${small}, so exchange 1 ${big} for ${f} ${small}.`, ok: true }, { text: `Step 2: ${s1} + ${f} − ${s2} = ${s1 + f - s2} ${small}. Keep ${b1} ${big}.`, ok: false }, { text: `Step 3: ${b1} − ${b2} = ${b1 - b2} ${big}. Answer ${fmt(b1 - b2, s1 + f - s2)}.`, ok: true }],
        fix: `After the exchange the ${big} go down by 1: ${b1 - 1} − ${b2} = ${b1 - 1 - b2}. The answer is ${fmt(rb, rs)}.`, mis: mis.subNoRed, hints: [`What happens to the ${big} when you exchange one?`], steps: [`${fmt(rb, rs)}.`] };
    } });

  // ------------------------------------------------------------- multiply
  const mulDraw = () => { const b = randInt(1, 5), s = f === 60 ? randInt(15, 55) : randInt(3, 9) * 100 + pick([0, 50]), n = randInt(2, 6); return [b, s, n]; };
  F({ id: `g5c.${W}.mul.word`, cs: sk('mul'), form: 'word', rung: 2,
    gen: () => {
      const [b, s, n] = mulDraw(), sm = s * n;
      if (sm < f || (f === 60 && sm < 100) || (f === 1000 && sm % 100 === 0 && false)) return null;
      const [cb, cs2] = [Math.floor(sm / f), sm % f], rb = b * n + cb, rs = cs2, p = person();
      const w100 = [b * n + Math.floor(sm / 100), sm % 100];
      return { question: C.mul(p, fmt(b, s), n), answer: fmt(rb, rs), accepts: acc(rb, rs),
        wrong: [[fmt(b * n, sm), `${sm} ${small} is more than ${f}, so regroup ${f} ${small} as 1 ${big}.`, mis.mulNo], [fmt(b * n, s), `You multiplied only the ${big} and copied the ${small}. Multiply both.`, mis.mulOne], [fmt(...w100), `Regroup at ${f} ${small}, not at 100.`, mis.mul100], [fmt((b + cb) * n, rs), 'You added the carried unit before multiplying the bigger unit. Multiply first, then add the carry.', mis.mulCarry]].filter(w => w[0] !== fmt(rb, rs)),
        hints: [`Multiply the ${small} first, then regroup.`, `Multiply the ${big}, then add the carried ${big}.`], steps: [`${s} × ${n} = ${sm} ${small} = ${cb} ${big} ${rs} ${small}.`, `${b} × ${n} + ${cb} = ${b * n + cb} ${big}.`], chk: (v) => v === fmt(rb, rs) };
    } });
  F({ id: `g5c.${W}.mul.options`, cs: sk('mul'), form: 'direct', rung: 2,
    gen: () => {
      const [b, s, n] = mulDraw(), sm = s * n;
      if (sm < f || (f === 60 && sm < 100)) return null;
      const cb = Math.floor(sm / f), rb = b * n + cb, rs = sm % f;
      const options = mc(fmt(rb, rs), [[fmt(b * n, sm), `Regroup the ${small} into ${big}.`, mis.mulNo], [fmt(b * n, s), `Multiply both parts, not just one.`, mis.mulOne], [fmt(b * n + Math.floor(sm / 100), sm % 100), `Regroup at ${f}, not 100.`, mis.mul100]]);
      return { question: `Which is ${fmt(b, s)} multiplied by ${n}?`, options, instruction: 'Choose the product.',
        hints: [`Multiply the ${small} first.`, 'Regroup, then multiply the bigger unit.'], steps: [`${s} × ${n} = ${sm}.`, fmt(rb, rs) + '.'] };
    } });
  F({ id: `g5c.${W}.mul.spot`, cs: sk('mul'), form: 'spot', rung: 3,
    gen: () => {
      const [b, s, n] = mulDraw(), sm = s * n;
      if (sm < f || (f === 60 && sm < 100)) return null;
      const cb = Math.floor(sm / f), p = person();
      return { question: `${p.name} works out ${fmt(b, s)} × ${n}. Which step has the mistake?`,
        working: [{ text: `Step 1: ${b} × ${n} = ${b * n} ${big}.`, ok: true }, { text: `Step 2: ${s} × ${n} = ${sm} ${small}. Copy ${sm} ${small} into the answer.`, ok: false }, { text: `Step 3: ${fmt(b * n, sm)}.`, ok: true }],
        fix: `${sm} ${small} = ${cb} ${big} ${sm % f} ${small}. The answer is ${fmt(b * n + cb, sm % f)}.`, mis: mis.mulNo, hints: [`Can ${sm} ${small} stay in the ${small} column?`], steps: [`${fmt(b * n + cb, sm % f)}.`] };
    } });

  // ------------------------------------------------------------- divide
  const divDraw = () => { const n = randInt(2, 5), q = f === 60 ? [randInt(1, 6), 0] : [randInt(1, 5), 0], b = (n * q[0]) + randInt(1, n - 1), qs = f === 60 ? randInt(5, 40) : randInt(1, 9) * 50 + (Math.random() < 0.5 ? 0 : 0); const s = n * qs % f === n * qs ? n * qs : null; return [b, s, n]; };
  F({ id: `g5c.${W}.div.word`, cs: sk('div'), form: 'word', rung: 3,
    gen: () => {
      const [b, s, n] = divDraw();
      if (s === null || s >= f) return null;
      const t = plain(b, s, f);
      if (t % n !== 0 || b % n === 0) return null;
      const [rb, rs] = norm(t / n, f), rem = b % n, p = person();
      return { question: C.div(p, fmt(b, s), n), answer: fmt(rb, rs), accepts: acc(rb, rs),
        wrong: [[fmt(Math.floor(b / n), s / n), `You threw away the leftover ${big} when dividing the ${big}. Change it into ${small} and carry it on.`, mis.divIgn], [fmt(Math.floor(b / n), (rem * (f === 60 ? 10 : 100) + s) / n), `A leftover ${big} is ${f} ${small}, not ${f === 60 ? 10 : 100}.`, mis.div100], [fmt(Math.floor(b / n), s), `You divided only the ${big} and left the ${small} as they were. Divide the whole amount.`, mis.divOne], [fmt(rb, rs + 10 > f ? rs - 10 : rs + 10), 'Check by multiplying.', mis.divIgn]].filter(w => w[0] !== fmt(rb, rs)),
        hints: [`Divide the ${big}. What is left over?`, `Change the leftover ${big} into ${small}, add the ${small}, and divide again.`], steps: [`${b} ÷ ${n} = ${Math.floor(b / n)} remainder ${rem}.`, `${rem} × ${f} + ${s} = ${rem * f + s}; ÷ ${n} = ${rs}. Answer ${fmt(rb, rs)}.`], chk: (v) => v === fmt(rb, rs) };
    } });
  F({ id: `g5c.${W}.div.options`, cs: sk('div'), form: 'direct', rung: 3,
    gen: () => {
      const [b, s, n] = divDraw();
      if (s === null || s >= f) return null;
      const t = plain(b, s, f);
      if (t % n !== 0 || b % n === 0) return null;
      const [rb, rs] = norm(t / n, f), rem = b % n;
      const options = mc(fmt(rb, rs), [[fmt(Math.floor(b / n), s / n), 'The leftover must be carried on, not dropped.', mis.divIgn], [fmt(Math.floor(b / n), (rem * (f === 60 ? 10 : 100) + s) / n), `A leftover ${big} is ${f} ${small}.`, mis.div100], [fmt(Math.floor(b / n), s), 'Divide the smaller unit too.', mis.divOne]]);
      return { question: `Which is ${fmt(b, s)} divided by ${n}?`, options, instruction: 'Choose the answer.',
        hints: [`Divide the ${big} first.`, 'Carry any leftover into the smaller unit.'], steps: [`Whole amount in ${small}: ${t}. ${t} ÷ ${n} = ${t / n}.`, fmt(rb, rs) + '.'] };
    } });
  F({ id: `g5c.${W}.div.check`, cs: sk('div'), form: 'spot', rung: 3,
    gen: () => {
      const [b, s, n] = divDraw();
      if (s === null || s >= f) return null;
      const t = plain(b, s, f);
      if (t % n !== 0 || b % n === 0) return null;
      const [rb, rs] = norm(t / n, f), rem = b % n, p = person();
      return { question: `${p.name} divides ${fmt(b, s)} by ${n}. Which step has the mistake?`,
        working: [{ text: `Step 1: ${b} ÷ ${n} = ${Math.floor(b / n)} remainder ${rem}.`, ok: true }, { text: `Step 2: Ignore the remainder and divide the ${small}: ${s} ÷ ${n} = ${s / n}.`, ok: false }, { text: `Step 3: ${fmt(Math.floor(b / n), s / n)}.`, ok: true }],
        fix: `The ${rem} left ${big} is ${rem * f} ${small}. Add it to ${s}: ${rem * f + s} ÷ ${n} = ${(rem * f + s) / n}. The answer is ${fmt(rb, rs)}.`, mis: mis.divIgn, hints: ['Check by multiplying your answer by ' + n + '.'], steps: [`${fmt(rb, rs)}.`] };
    } });
  return out;
}

export const FAMILIES = [...build('length'), ...build('capacity'), ...build('mass'), ...build('time')];
