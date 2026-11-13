// ============================================================================
// GRADE 4 MATHEMATICS, MEASUREMENT: CAPACITY (litres) and MASS (kilograms).
// The two units are taught the same way, so one builder writes both sets of families,
// each with its own words and its own library misconception codes.
// All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, randInt, pick, distinct, commas, person, mc } from './g4c_lib.js';

const build = (c) => {
  const K = `MEASUR.${c.sub}.`, n = c.id;
  const u = c.unit;
  return [
    fam({ id: `g4c.${n}.read.scale`, cs: `${K}${c.s1}`, form: 'word', rung: 1,
      gen: () => {
        const max = pick([5, 10, 20]), w = randInt(1, max - 2), pe = person(), th = pick(c.things);
        return { question: c.readQ(pe, max, w, th), answer: w,
          wrong: [[max, c.readWhy, c.codes.read], [max - w, `That is how much more it could hold. Read where the ${c.mark} is.`, c.codes.read], [w + 1, `Read the mark exactly: it is one mark lower.`, c.codes.read]],
          hints: [c.readHint, 'The number you want is the reading, not the biggest number on the tool.'], steps: [`The ${c.mark} is at ${w}.`, `So the amount is ${w} ${u}.`], chk: (x) => x === w };
      } }),
    fam({ id: `g4c.${n}.compare`, cs: `${K}${c.s1}`, form: 'direct', rung: 2,
      gen: () => {
        const [a, b] = [randInt(2, 6), randInt(8, 20)], p = pick(c.pairs);
        const options = mc(p.big, [[p.small, c.cmpWhy, c.codes.cmp], ['They are equal.', 'The numbers on them are different.', c.codes.cmp]]);
        return { question: c.cmpQ(p, a, b), options, instruction: 'Choose one.', hints: ['Compare the numbers given, not the sizes you see.', 'The bigger number is the greater amount.'], steps: [`${p.bigName} is ${b} ${u}; ${p.smallName} is ${a} ${u}.`, `${b} is more than ${a}, so ${p.big.toLowerCase()}.`] };
      } }),
    fam({ id: `g4c.${n}.half`, cs: `${K}${c.s2}`, form: 'word', rung: 1,
      gen: () => {
        const k = randInt(2, 8), pe = person();
        return { question: c.halfQ(pe, k), answer: 2 * k,
          wrong: [[3 * k, `Two halves make a whole ${c.one}, not three.`, c.codes.half], [k, `Each ${c.one} needs two halves. Count both halves.`, c.codes.half], [k + 2, `Each ${c.one} is 2 halves. Multiply, do not add.`, c.codes.halfBig], [4 * k, `That is quarters. A half is 2 to the ${c.one}.`, c.codes.quarter]],
          hints: [`Two halves make one ${c.one}.`, `Multiply the ${c.unitPl} by 2.`], steps: [`1 ${c.one} = 2 halves.`, `${k} x 2 = ${2 * k}.`], chk: (x) => x === 2 * k };
      } }),
    fam({ id: `g4c.${n}.quarter`, cs: `${K}${c.s2}`, form: 'word', rung: 2,
      gen: () => {
        const k = randInt(2, 6), pe = person();
        return { question: c.quarterQ(pe, k), answer: 4 * k,
          wrong: [[2 * k, `Four quarters make a whole ${c.one}, not two.`, c.codes.quarter], [k, `Each ${c.one} needs four quarters.`, c.codes.quarter], [3 * k, `Four quarters make a whole ${c.one}, not three.`, c.codes.quarter], [k + 4, `Each ${c.one} is 4 quarters. Multiply, do not add.`, c.codes.halfBig]],
          hints: [`Four quarters make one ${c.one}.`, `Multiply the ${c.unitPl} by 4.`], steps: [`1 ${c.one} = 4 quarters.`, `${k} x 4 = ${4 * k}.`], chk: (x) => x === 4 * k };
      } }),
    fam({ id: `g4c.${n}.add.total`, cs: `${K}${c.s3}`, form: 'word', rung: 1,
      gen: () => {
        const a = randInt(12, 85), b = randInt(11, 60), pe = person(), th = pick(c.things);
        return { question: c.addQ(pe, a, b, th), answer: a + b,
          wrong: [[Math.abs(a - b), 'Altogether means join, so add.', c.codes.addSub], [a, 'That is only the first amount. Add the second too.', c.codes.addSub], [b, 'That is only the second amount. Add the first too.', c.codes.addSub], [a + b + 10, 'Check the carry in your addition.', c.codes.addSub]],
          hints: ['Altogether means add.', 'Add the ones, then the tens.'], steps: [`${a} + ${b} = ${a + b}.`, `The total is ${a + b} ${u}.`], chk: (x) => x - b === a };
      } }),
    fam({ id: `g4c.${n}.add.three`, cs: `${K}${c.s3}`, form: 'word', rung: 2,
      gen: () => {
        const a = randInt(12, 60), b = randInt(11, 50), d = randInt(11, 40), t = a + b + d, pe = person(), th = pick(c.things);
        return { question: `${pe.name} has ${a} ${u} of ${th} on Monday, ${b} ${u} on Tuesday and ${d} ${u} on Wednesday. How many ${u} of ${th} is that in the three days?`, answer: t,
          wrong: [[a + b, 'The third day is missing. Add all three amounts.', c.codes.addSub], [a + b - d, 'Altogether means join, so add all three.', c.codes.addSub], [t + 10, 'Check the carry in your addition.', c.codes.omit], [b + d, 'The first day is missing. Add all three amounts.', c.codes.addSub]],
          hints: ['Altogether means add all three amounts.', 'Add two amounts, then add the third.'], steps: [`${a} + ${b} = ${a + b}, then ${a + b} + ${d} = ${t}.`, `The total is ${t} ${u}.`], chk: (x) => x - d - b === a };
      } }),
    fam({ id: `g4c.${n}.sub.left`, cs: `${K}${c.s4}`, form: 'word', rung: 1,
      gen: () => {
        const a = randInt(30, 99), b = randInt(11, a - 5), pe = person(), th = pick(c.things);
        return { question: c.subQ(pe, a, b, th), answer: a - b,
          wrong: [[a + b, 'The question asks how much is left, so take away.', c.codes.subAdd], [b, `That is the amount used. Take it away from ${a}.`, c.codes.subAdd], [a, 'That is the amount at the start. Take away what was used.', c.codes.subAdd], [a - b + 10, 'Check the regrouping in your subtraction.', c.codes.subAdd]],
          hints: ['Left means take away.', 'Subtract the amount used from the amount at the start.'], steps: [`${a} - ${b} = ${a - b}.`, `${a - b} ${u} are left.`], chk: (x) => x + b === a };
      } }),
    fam({ id: `g4c.${n}.sub.more`, cs: `${K}${c.s4}`, form: 'word', rung: 2,
      gen: () => {
        const full = randInt(40, 99), have = randInt(10, full - 10), pe = person(), th = pick(c.things);
        return { question: c.moreQ(pe, full, have, th), answer: full - have,
          wrong: [[full + have, 'How much more is needed means find the difference.', c.codes.subOrder], [have, 'That is how much there already is. Find how much more.', c.codes.subOrder], [full, 'That is the whole amount. Take away what is already there.', c.codes.subOrder]],
          hints: ['The whole is the full amount.', 'Take away what is already there.'], steps: [`${full} - ${have} = ${full - have}.`, `${full - have} ${u} more are needed.`], chk: (x) => x + have === full };
      } }),
  ];
};

const CAP = {
  id: 'cap', sub: 'CAPACITY', unit: 'litres', one: 'litre', unitPl: 'litres', s1: 'LITRE_MEASURE', s2: 'HALF_QUARTER_LITRE', s3: 'CAPACITY_ADD', s4: 'CAPACITY_SUB', mark: 'liquid level',
  things: ['water', 'milk', 'cooking oil', 'paraffin'],
  readQ: (pe, max, w, th) => `A jug marked up to ${max} litres has ${th} in it. The ${th} level is at the ${w} mark. How many litres of ${th} are in the jug?`,
  readWhy: 'That is the biggest mark on the jug, not where the level is.', readHint: 'Look at where the level is, not at the top mark.',
  pairs: [{ big: 'The wide basin', small: 'The tall bottle', bigName: 'the wide basin', smallName: 'the tall bottle' }, { big: 'The short drum', small: 'The tall tin', bigName: 'the short drum', smallName: 'the tall tin' }, { big: 'The low wide bucket', small: 'The tall jug', bigName: 'the low wide bucket', smallName: 'the tall jug' }],
  cmpWhy: 'A taller container does not always hold more. Compare the litres.',
  cmpQ: (p, a, b) => `${p.smallName[0].toUpperCase() + p.smallName.slice(1)} holds ${a} litres. ${p.bigName[0].toUpperCase() + p.bigName.slice(1)} holds ${b} litres. Which holds more?`,
  halfQ: (pe, k) => `${pe.name} fills a ${k} litre tank using half-litre cups. How many half-litre cups does ${pe.she} need?`,
  quarterQ: (pe, k) => `${pe.name} measures ${k} litres of milk using quarter-litre cups. How many quarter-litre cups are needed?`,
  addQ: (pe, a, b, th) => `A drum already has ${a} litres of ${th} in it. ${pe.name} pours in ${b} litres more. How many litres of ${th} are in the drum now?`,
  subQ: (pe, a, b, th) => `A tank holds ${a} litres of ${th}. ${pe.name} uses ${b} litres. How many litres of ${th} are left in the tank?`,
  moreQ: (pe, full, have, th) => `${pe.name} is filling a big tank that can hold ${full} litres. So far it has ${have} litres of ${th}. How many more litres of ${th} must be poured in before the tank is full?`,
  wrongUnit: 'kg', unitWhy: 'Kilograms measure how heavy something is, not how much a container holds.',
  codes: { read: 'M_CAP_READS_JUG_TOP', cmp: 'M_CAP_BIGGER_CONTAINER_MORE', half: 'M_CAP_HALF_LITRE_THREE', halfBig: 'M_CAP_HALF_AS_5', quarter: 'M_CAP_QUARTER_TWO', addSub: 'M_CAP_ADD_SUBTRACTS', omit: 'M_CAP_ADD_OMIT_UNIT', unit: 'M_CAP_MASS_CONFUSED', subAdd: 'M_CAP_SUB_ADDS', subOrder: 'M_CAP_SUB_ORDER' },
};
const MAS = {
  id: 'mas', sub: 'MASS', unit: 'kg', one: 'kilogram', unitPl: 'kilograms', s1: 'KG_MEASURE', s2: 'HALF_QUARTER_KG', s3: 'MASS_ADD', s4: 'MASS_SUB', mark: 'pointer',
  things: ['maize flour', 'sugar', 'rice', 'potatoes', 'beans'],
  readQ: (pe, max, w, th) => `A scale goes up to ${max} kg. ${pe.name} puts ${th} on it and the pointer stops at ${w}. What is the mass of the ${th} in kilograms?`,
  readWhy: 'That is the biggest number on the scale, not where the pointer is.', readHint: 'Look at where the pointer is, not at the biggest number.',
  pairs: [{ big: 'The stone', small: 'The bag of cotton wool', bigName: 'the small stone', smallName: 'the big bag of cotton wool' }, { big: 'The tin of paint', small: 'The bag of feathers', bigName: 'the small tin of paint', smallName: 'the big bag of feathers' }, { big: 'The iron bar', small: 'The empty box', bigName: 'the thin iron bar', smallName: 'the large empty box' }],
  cmpWhy: 'A bigger object is not always heavier. Compare the kilograms.',
  cmpQ: (p, a, b) => `${p.smallName[0].toUpperCase() + p.smallName.slice(1)} has a mass of ${a} kg. ${p.bigName[0].toUpperCase() + p.bigName.slice(1)} has a mass of ${b} kg. Which is heavier?`,
  halfQ: (pe, k) => `${pe.name} packs ${k} kg of rice into half-kilogram bags. How many half-kilogram bags does ${pe.she} fill?`,
  quarterQ: (pe, k) => `${pe.name} balances a ${k} kg bag of sugar on a beam balance using only quarter-kilogram masses. How many quarter-kilogram masses are needed?`,
  addQ: (pe, a, b, th) => `${pe.name} loads two sacks onto a lorry. One sack has ${a} kg of ${th} and the other has ${b} kg of ${th}. What is the total mass of the two sacks?`,
  subQ: (pe, a, b, th) => `A sack has ${a} kg of ${th}. ${pe.name} sells ${b} kg of it. How many kilograms of ${th} are left?`,
  moreQ: (pe, full, have, th) => `${pe.name} is filling a big sack that can hold ${full} kg. So far it has ${have} kg of ${th}. How many more kilograms of ${th} must be poured in before the sack is full?`,
  wrongUnit: 'litres', unitWhy: 'Litres measure how much a container holds, not how heavy something is.',
  codes: { read: 'M_MASS_SCALE_READ_END', cmp: 'M_MASS_LARGER_IS_HEAVIER', half: 'M_MASS_HALF_KG_AS_500', halfBig: 'M_MASS_HALF_LARGER_THAN_KG', quarter: 'M_MASS_QUARTER_TWO', addSub: 'M_MASS_ADD_SUBTRACTS', omit: 'M_MASS_ADD_OMIT_UNIT', unit: 'M_MASS_CAPACITY_UNIT', subAdd: 'M_MASS_SUB_ADDS', subOrder: 'M_MASS_SUB_CONTAINER' },
};

export const FAMILIES = [...build(CAP), ...build(MAS)];
