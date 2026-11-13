// ============================================================================
// GRADE 4 MATHEMATICS, MEASUREMENT: LENGTH, AREA and VOLUME.
// Written from the KICD 2024 design through the curriculum map. Every wrong answer
// names the library misconception it reveals. All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, randInt, pick, shuffle, distinct, commas, person, sh, mc, tbl } from './g4c_lib.js';

const Le = 'MEASUR.LENGTH.', Ar = 'MEASUR.AREA.', V = 'MEASUR.VOLUME.';
const L = (m, c) => (m && c ? `${m} m ${c} cm` : m ? `${m} m` : `${c} cm`);
const CLOTH = ['cloth', 'rope', 'ribbon', 'wire', 'string'];

export const FAMILIES = [
  // ------------------------------------------------------------ CM_UNIT
  fam({ id: 'g4c.len.unit.pick', cs: `${Le}CM_UNIT`, form: 'direct', rung: 1,
    gen: () => {
      const o = pick([['a pencil', 'centimetres', 'metres'], ['an exercise book', 'centimetres', 'metres'], ['a matchstick', 'centimetres', 'metres'], ['the length of a classroom', 'metres', 'centimetres'], ['a football field', 'metres', 'centimetres'], ['a school bus', 'metres', 'centimetres'], ['a thumb nail', 'centimetres', 'metres']]);
      const options = mc(o[1], [[o[2], o[1] === 'centimetres' ? 'Metres are too big for something this short.' : 'Centimetres are too small for something this long.', 'M_LEN_WRONG_UNIT'], ['kilograms', 'Kilograms measure how heavy something is, not how long.', 'M_LEN_WRONG_UNIT'], ['litres', 'Litres measure how much a container holds, not how long.', 'M_LEN_WRONG_UNIT']]);
      return { question: `Which unit is best for measuring the length of ${o[0]}?`, options, instruction: 'Choose the best unit.',
        hints: ['Think about how long the object is.', 'Short things are measured in centimetres, long things in metres.'], steps: [`Picture ${o[0]}.`, `It is best measured in ${o[1]}.`] };
    } }),
  fam({ id: 'g4c.len.unit.size', cs: `${Le}CM_UNIT`, form: 'word', rung: 2,
    gen: () => {
      const o = pick([['a new pencil', 15, 'cm'], ['an exercise book', 21, 'cm'], ['a door', 2, 'm'], ['a classroom wall', 8, 'm'], ['a ruler', 30, 'cm'], ['a bed', 2, 'm'], ['a spoon', 18, 'cm']]), pe = person();
      const right = `${o[1]} ${o[2]}`, other = o[2] === 'cm' ? 'm' : 'cm';
      const options = mc(right, [[`${o[1]} ${other}`, o[2] === 'cm' ? 'That would be far too long for this object.' : 'That would be far too short for this object.', 'M_LEN_WRONG_UNIT'], [`${o[1] * 10} ${o[2]}`, 'Picture the object next to a ruler. This is ten times too long.', 'M_LEN_CM_AS_M_SIZE'], [`${Math.max(1, Math.round(o[1] / 10))} ${o[2]}`, 'Picture the object next to a ruler. This is far too short.', 'M_LEN_CM_AS_M_SIZE']]);
      if (!options) return null;
      return { question: `${pe.name} wants to say how long ${o[0]} is. Which length is about right?`, options, instruction: 'Choose the sensible length.',
        hints: ['Think of a ruler (30 cm) and a door (2 m).', 'Choose the length that fits the object.'], steps: [`Picture ${o[0]} beside a ruler or a door.`, `About ${right} is sensible.`] };
    } }),

  // ------------------------------------------------------------ MEASURE_CM
  fam({ id: 'g4c.len.measure.ruler', cs: `${Le}MEASURE_CM`, form: 'word', rung: 1,
    gen: () => {
      const s = randInt(1, 4), e = s + randInt(4, 12), th = pick(['pencil', 'leaf', 'strip of paper', 'piece of chalk']), pe = person();
      return { question: `${pe.name} lays a ${th} against a ruler. Its left end is at the ${s} cm mark and its right end is at the ${e} cm mark. How long is the ${th}?`, answer: e - s,
        wrong: [[e, 'The ruler does not start at the end of the object. Count the gaps from the left end, not the number at the right end.', 'M_LEN_NOT_FROM_ZERO'], [e - s + 1, 'You counted the marks. Count the gaps between marks.', 'M_LEN_COUNTS_MARKS'], [e + s, 'Take the readings away from each other; do not add them.', 'M_LEN_NOT_FROM_ZERO'], [e - s - 1, 'Count the gaps from the left end to the right end.', 'M_LEN_COUNTS_MARKS']],
        hints: ['Find the reading at each end of the object.', 'Subtract the left reading from the right reading.'], steps: [`Right end ${e} cm, left end ${s} cm.`, `${e} - ${s} = ${e - s} cm.`], chk: (x) => x + s === e };
    } }),
  fam({ id: 'g4c.len.measure.more', cs: `${Le}MEASURE_CM`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(12, 60), b = randInt(5, a - 3), x = pick(CLOTH), y = pick(CLOTH.filter(c => c !== x)), pe = person();
      return { question: `A piece of ${x} measures ${a} cm and a piece of ${y} measures ${b} cm. ${pe.name} wants to know how much longer the ${x} is than the ${y}. How many centimetres longer is it?`, answer: a - b,
        wrong: [[a, 'That is the length of the longer piece, not the difference.', 'M_LEN_DIFFERENCE_AS_END'], [a + b, 'Adding finds the total length. To compare, subtract.', 'M_LEN_DIFFERENCE_AS_END'], [b, 'That is the length of the shorter piece, not the difference.', 'M_LEN_DIFFERENCE_AS_END']],
        hints: ['How much longer means find the difference.', 'Subtract the shorter length from the longer.'], steps: [`${a} cm - ${b} cm = ${a - b} cm.`, `The ${x} is ${a - b} cm longer.`], chk: (v) => v + b === a };
    } }),

  // ------------------------------------------------------------ M_CM_RELATION
  fam({ id: 'g4c.len.rel.fraction', cs: `${Le}M_CM_RELATION`, form: 'word', rung: 1,
    gen: () => {
      const k = pick([['half a metre', 50, 25], ['a quarter of a metre', 25, 50], ['three quarters of a metre', 75, 25], ['a tenth of a metre', 10, 100]]), th = pick(CLOTH), pe = person();
      return { question: `${pe.name} cuts ${k[0]} of ${th} from a 1 metre roll. How many centimetres long is the piece?`, answer: k[1],
        wrong: [[k[2], 'Check the fraction again: halve 100 cm, or halve it twice for a quarter.', 'M_LEN_HALF_METRE_WRONG'], [k[1] / 10 >= 1 ? k[1] / 10 : k[1] * 10, 'A metre is 100 centimetres, not 10.', 'M_LEN_10_NOT_100'], [100, 'That is the whole metre.', 'M_LEN_10_NOT_100'], [k[1] + 10, 'Take that fraction of 100 cm.', 'M_LEN_HALF_METRE_WRONG']],
        hints: ['1 metre is 100 centimetres.', 'Take that fraction of 100 cm.'], steps: [`1 m = 100 cm.`, `${k[0]} is ${k[1]} cm.`], chk: (x) => x === k[1] };
    } }),
  fam({ id: 'g4c.len.rel.longer', cs: `${Le}M_CM_RELATION`, form: 'direct', rung: 2,
    gen: () => {
      const m = randInt(2, 5), c = randInt(m * 10 + 20, m * 100 - 20), a = `${m} m`, b = `${c} cm`;
      if (c % 10 === 0 && Math.random() < 0.3) return null;
      const longer = m * 100 > c ? a : b;
      const options = mc(longer, [[longer === a ? b : a, 'Change the metres to centimetres: 1 m is 100 cm. Then compare.', 'M_LEN_10_NOT_100'], ['They are the same length.', 'Change the metres to centimetres first, then compare.', 'M_LEN_10_NOT_100']]);
      return { question: `Which is longer, ${a} or ${b}?`, options, instruction: 'Choose the longer length.',
        hints: ['Change both lengths to the same unit.', '1 metre is 100 centimetres.'], steps: [`${a} is ${m * 100} cm.`, `${m * 100} cm and ${c} cm: ${m * 100 > c ? a : b} is longer.`] };
    } }),

  // ------------------------------------------------------------ CONVERT_M_CM
  fam({ id: 'g4c.len.conv.to-cm', cs: `${Le}CONVERT_M_CM`, form: 'word', rung: 1,
    gen: () => {
      const m = randInt(2, 9), c = randInt(1, 9), th = pick(CLOTH), pe = person();
      return { question: `${pe.name} has ${m} m ${c} cm of ${th}. How many centimetres is that in all?`, answer: m * 100 + c,
        wrong: [[Number(`${m}${c}`), `The centimetres need two places. Write ${c} as 0${c} after the ${m * 100}.`, 'M_CONV_ADD_DIGITS'], [m * 1000 + c, '1 metre is 100 cm, not 1,000 cm.', 'M_CONV_WRONG_FACTOR'], [m * 10 + c, '1 metre is 100 cm, not 10 cm.', 'M_CONV_WRONG_FACTOR'], [m * 100, 'You left out the centimetres.', 'M_CONV_ADD_DIGITS']],
        hints: ['Change the metres to centimetres first.', 'Then add the centimetres.'], steps: [`${m} m = ${m * 100} cm.`, `${m * 100} + ${c} = ${m * 100 + c} cm.`], chk: (x) => x - c === m * 100 };
    } }),
  fam({ id: 'g4c.len.conv.to-m', cs: `${Le}CONVERT_M_CM`, form: 'direct', rung: 2,
    gen: () => {
      const m = randInt(2, 9), c = randInt(11, 99), total = m * 100 + c;
      if (c % 10 === 0) return null;
      const options = mc(L(m, c), [[`${total} m`, 'A metre is bigger than a centimetre, so there are fewer metres than centimetres.', 'M_CONV_DIRECTION'], [`${Math.floor(total / 10)} m ${total % 10} cm`, '100 cm make 1 m, not 10 cm.', 'M_CONV_WRONG_FACTOR'], [`${m} m ${c % 10} cm`, 'The centimetres left over are the last two digits.', 'M_CONV_ADD_DIGITS']]);
      if (!options) return null;
      return { question: `${person().name} measures the height of the school flagpole with a long tape and reads ${total} cm. The teacher asks for the height in metres and centimetres. Which answer is correct?`, options, instruction: 'Choose the correct length.',
        hints: ['100 cm make 1 m.', 'How many whole hundreds are in the number? The rest are centimetres.'], steps: [`${total} cm = ${m * 100} cm + ${c} cm.`, `${m * 100} cm is ${m} m, so ${L(m, c)}.`] };
    } }),

  // ------------------------------------------------------------ PERIMETER
  fam({ id: 'g4c.len.perim.rect', cs: `${Le}PERIMETER`, form: 'word', rung: 1,
    gen: () => {
      const l = randInt(6, 30), w = randInt(3, l - 1), pe = person();
      return { question: `A greeting card is ${l} cm long and ${w} cm wide. ${pe.name} sticks a strip of paper all the way round its edge. How long must the strip be?`, answer: 2 * (l + w),
        wrong: [[l + w, 'That is only two sides. A rectangle has four sides.', 'M_PER_TWO_SIDES_ONLY'], [l * w, 'That is the area. Go round the edge by adding all four sides.', 'M_PER_AREA_NOT_PERIMETER'], [2 * l + w, 'The other long side is missing, or the second width. Add all four sides.', 'M_PER_TWO_SIDES_ONLY']],
        hints: ['Go round the edge: two lengths and two widths.', 'Add all four sides.'], steps: [`${l} + ${w} + ${l} + ${w}.`, `${2 * (l + w)} cm.`], chk: (x) => x === l + w + l + w };
    } }),
  fam({ id: 'g4c.len.perim.square', cs: `${Le}PERIMETER`, form: 'word', rung: 2,
    gen: () => {
      const s = randInt(4, 40), pe = person(), th = pick(['garden', 'compound', 'plot', 'playing field']);
      return { question: `A square ${th} has sides of ${s} m. ${pe.name} walks once all the way round it. How many metres does ${pe.she} walk?`, answer: 4 * s,
        wrong: [[s, 'That is one side. A square has four equal sides.', 'M_PER_SQUARE_ONE_SIDE'], [s * s, 'That is the area. Add the four sides to go round.', 'M_PER_AREA_NOT_PERIMETER'], [2 * s, 'That is two sides. A square has four sides.', 'M_PER_TWO_SIDES_ONLY']],
        hints: ['A square has four equal sides.', 'Add the four sides.'], steps: [`${s} + ${s} + ${s} + ${s}.`, `${4 * s} m.`], chk: (x) => x === s * 4 };
    } }),

  // ------------------------------------------------------------ LENGTH_ADD
  fam({ id: 'g4c.len.add.pieces', cs: `${Le}LENGTH_ADD`, form: 'word', rung: 2,
    gen: () => {
      const m1 = randInt(1, 6), m2 = randInt(1, 6), c1 = 5 * randInt(11, 19), c2 = 5 * randInt(11, 19), tc = c1 + c2 - 100, th = pick(CLOTH), pe = person();
      const options = mc(L(m1 + m2 + 1, tc), [[`${m1 + m2} m ${c1 + c2} cm`, '100 cm make 1 m. Change the extra 100 cm into a metre.', 'M_LADD_NO_REGROUP'], [L(m1 + m2, tc), 'You forgot to add the extra metre from the 100 cm.', 'M_LADD_NO_REGROUP'], [`${m1 + m2 + c1 + c2} m`, 'Add metres to metres and centimetres to centimetres. Do not add them together.', 'M_LADD_ADDS_ACROSS']]);
      if (!options || tc === 0) return null;
      return { question: `${pe.name} joins a piece of ${th} ${L(m1, c1)} long to another piece ${L(m2, c2)} long. How long is the joined ${th}?`, options, instruction: 'Choose the correct length.',
        hints: ['Add the centimetres first. Change 100 cm into 1 m when you can.', 'Then add the metres.'], steps: [`${c1} cm + ${c2} cm = ${c1 + c2} cm = 1 m ${tc} cm.`, `${m1} m + ${m2} m + 1 m = ${m1 + m2 + 1} m, so ${L(m1 + m2 + 1, tc)}.`] };
    } }),
  fam({ id: 'g4c.len.add.total-cm', cs: `${Le}LENGTH_ADD`, form: 'word', rung: 3,
    gen: () => {
      const m1 = randInt(1, 5), m2 = randInt(1, 5), c1 = randInt(20, 85), c2 = randInt(20, 85), pe = person();
      const ans = (m1 + m2) * 100 + c1 + c2;
      return { question: `A tailor uses ${L(m1, c1)} of cloth for one dress and ${L(m2, c2)} for another. How many centimetres of cloth is that in all?`, answer: ans,
        wrong: [[m1 + c1 + m2 + c2, 'You added the metres to the centimetres. Change the metres to centimetres first.', 'M_LADD_ADDS_ACROSS'], [(m1 + m2) * 10 + c1 + c2, '1 m is 100 cm, not 10 cm.', 'M_CONV_WRONG_FACTOR'], [(m1 + m2) * 100 + c1 + c2 - 100, 'Check that you did not take away a metre by mistake.', 'M_LADD_NO_REGROUP'], [(m1 + m2) * 1000 + c1 + c2, '1 m is 100 cm, not 1,000 cm.', 'M_CONV_WRONG_FACTOR']],
        hints: ['Change each length to centimetres.', 'Then add.'], steps: [`${L(m1, c1)} = ${m1 * 100 + c1} cm and ${L(m2, c2)} = ${m2 * 100 + c2} cm.`, `${m1 * 100 + c1} + ${m2 * 100 + c2} = ${ans} cm.`], chk: (x) => x === m1 * 100 + c1 + m2 * 100 + c2 };
    } }),

  // ------------------------------------------------------------ LENGTH_SUB
  fam({ id: 'g4c.len.sub.left', cs: `${Le}LENGTH_SUB`, form: 'word', rung: 2,
    gen: () => {
      const m1 = randInt(4, 9), m2 = randInt(1, m1 - 2), c1 = randInt(10, 40), c2 = c1 + randInt(2, 9), th = pick(CLOTH), pe = person();
      const rm = m1 - m2 - 1, rc = 100 + c1 - c2;
      const options = mc(L(rm, rc), [[L(m1 - m2, c2 - c1), 'You took the smaller number of centimetres from the larger. Change 1 m into 100 cm first.', 'M_LSUB_SMALLER_FROM_LARGER'], [L(rm, c1 + 10 - c2), '1 m is 100 cm, so regroup 100 cm, not 10 cm.', 'M_LSUB_BORROW_100_NOT_10'], [L(m1 - m2, rc), 'You forgot to take 1 m away when you changed it into 100 cm.', 'M_LSUB_BORROW_100_NOT_10']]);
      if (!options) return null;
      return { question: `${pe.name} has ${L(m1, c1)} of ${th} and uses ${L(m2, c2)}. How much ${th} is left?`, options, instruction: 'Choose the correct length.',
        hints: ['You cannot take more centimetres than you have. Change 1 m into 100 cm.', 'Then subtract the centimetres, then the metres.'], steps: [`${L(m1, c1)} = ${m1 - 1} m ${100 + c1} cm.`, `${100 + c1} - ${c2} = ${rc} cm and ${m1 - 1} - ${m2} = ${rm} m: ${L(rm, rc)}.`] };
    } }),
  fam({ id: 'g4c.len.sub.difference', cs: `${Le}LENGTH_SUB`, form: 'word', rung: 3,
    gen: () => {
      const m1 = randInt(3, 8), m2 = randInt(1, m1 - 1), c1 = randInt(5, 45), c2 = c1 + randInt(10, 50), a = m1 * 100 + c1, b = m2 * 100 + c2, pe = person();
      if (a <= b) return null;
      return { question: `A tree is ${L(m1, c1)} tall and a fence is ${L(m2, c2)} high. How many centimetres taller is the tree than the fence?`, answer: a - b,
        wrong: [[(m1 - m2) * 100 + (c2 - c1), 'You took the smaller number of centimetres from the larger. Change both lengths to centimetres first.', 'M_LSUB_SMALLER_FROM_LARGER'], [a + b, 'Taller means find the difference: subtract.', 'M_LSUB_SMALLER_FROM_LARGER'], [(m1 - m2) * 100 + c1 - c2 + 10, 'Check the regrouping: 1 m is 100 cm.', 'M_LSUB_BORROW_100_NOT_10']],
        hints: ['Change both lengths to centimetres.', 'Subtract the smaller from the larger.'], steps: [`${L(m1, c1)} = ${a} cm and ${L(m2, c2)} = ${b} cm.`, `${a} - ${b} = ${a - b} cm.`], chk: (x) => x + b === a };
    } }),

  // ------------------------------------------------------------ LENGTH_MULT
  fam({ id: 'g4c.len.mul.pieces', cs: `${Le}LENGTH_MULT`, form: 'word', rung: 2,
    gen: () => {
      const m = randInt(1, 5), c = pick([30, 40, 50, 60, 70, 80, 90]), k = randInt(3, 6), tc = c * k, rm = m * k + Math.floor(tc / 100), rcm = tc % 100, th = pick(CLOTH), pe = person();
      if (tc < 100 || rcm === 0) return null;
      const options = mc(L(rm, rcm), [[`${m * k} m ${tc} cm`, 'Change the extra 100 cm into metres.', 'M_LMUL_NO_REGROUP'], [L(m * k, c), 'You multiplied the metres only. Multiply the centimetres too.', 'M_LMUL_ONLY_METRES'], [L(m * k + Math.floor(tc / 100) + 1, rcm), 'The extra metres from the centimetres were counted twice.', 'M_LMUL_NO_REGROUP']]);
      if (!options) return null;
      return { question: `${pe.name} needs ${k} pieces of ${th}, each ${L(m, c)} long. How much ${th} is that altogether?`, options, instruction: 'Choose the correct length.',
        hints: ['Multiply the metres and the centimetres separately.', 'Change 100 cm into 1 m where you can.'], steps: [`${k} x ${m} m = ${m * k} m and ${k} x ${c} cm = ${tc} cm.`, `${tc} cm = ${Math.floor(tc / 100)} m ${rcm} cm, so ${L(rm, rcm)}.`] };
    } }),
  fam({ id: 'g4c.len.mul.total-cm', cs: `${Le}LENGTH_MULT`, form: 'word', rung: 3,
    gen: () => {
      const m = randInt(1, 4), c = randInt(15, 85), k = randInt(3, 8), a = m * 100 + c, pe = person();
      return { question: `A fence has ${k} equal sections. Each section is ${L(m, c)} long. How many centimetres long is the fence?`, answer: a * k,
        wrong: [[m * k * 100 + c, 'You multiplied the metres only. Multiply the whole length by ' + k + '.', 'M_LMUL_ONLY_METRES'], [m * k + c * k, 'Change the metres to centimetres before multiplying.', 'M_LMUL_ONLY_METRES'], [(m * 10 + c) * k, '1 m is 100 cm, not 10 cm.', 'M_CONV_WRONG_FACTOR']],
        hints: ['Change one section to centimetres.', `Multiply by ${k}.`], steps: [`${L(m, c)} = ${a} cm.`, `${k} x ${a} = ${a * k} cm.`], chk: (x) => x === a * k };
    } }),

  // ------------------------------------------------------------ LENGTH_DIV
  fam({ id: 'g4c.len.div.pieces', cs: `${Le}LENGTH_DIV`, form: 'word', rung: 2,
    gen: () => {
      const k = pick([2, 3, 4, 5]), pm = randInt(1, 4), pc = pick([10, 20, 25, 30, 40, 50, 60, 75]), T = (pm * 100 + pc) * k, M = Math.floor(T / 100), C = T % 100, th = pick(CLOTH), pe = person();
      if (C === 0 || M === 0) return null;
      const options = mc(L(pm, pc), [[L(Math.floor(M / k), C), 'You divided the metres only. Change to centimetres, then divide.', 'M_LDIV_METRES_ONLY'], [L(Math.floor(M / k), Math.floor(C / k)), 'The leftover metres were dropped. Change to centimetres first.', 'M_LDIV_REMAINDER_METRES_LOST'], [L(pm, pc + 10), 'Check by multiplying your answer by ' + k + '.', 'M_LDIV_METRES_ONLY']]);
      if (!options) return null;
      return { question: `${pe.name} cuts ${L(M, C)} of ${th} into ${k} equal pieces. How long is each piece?`, options, instruction: 'Choose the correct length.',
        hints: ['Change the length to centimetres first.', `Divide by ${k}, then write the answer in metres and centimetres.`], steps: [`${L(M, C)} = ${T} cm.`, `${T} divided by ${k} = ${T / k} cm = ${L(pm, pc)}.`] };
    } }),
  fam({ id: 'g4c.len.div.each-cm', cs: `${Le}LENGTH_DIV`, form: 'word', rung: 3,
    gen: () => {
      const k = pick([2, 4, 5, 8]), each = randInt(12, 90), T = each * k, M = Math.floor(T / 100), C = T % 100;
      if (M === 0 || C === 0) return null;
      return { question: `A shopkeeper shares a roll of ribbon ${L(M, C)} long equally among ${k} children. How many centimetres of ribbon does each child get?`, answer: each,
        wrong: [[Math.floor(M * 100 / k) + C, 'You divided the metres only. Change the whole rope to centimetres, then divide.', 'M_LDIV_METRES_ONLY'], [Math.floor(M / k) * 100 + Math.floor(C / k), 'The metres that do not share equally were lost. Change to centimetres first.', 'M_LDIV_REMAINDER_METRES_LOST'], [T - k, 'That is not sharing equally. Divide the whole length.', 'M_LDIV_METRES_ONLY'], [each + 10, `Check by multiplying your answer by ${k}.`, 'M_LDIV_METRES_ONLY']],
        hints: ['Change the whole length to centimetres.', `Divide by ${k}.`], steps: [`${L(M, C)} = ${T} cm.`, `${T} divided by ${k} = ${each} cm.`], chk: (x) => x * k === T };
    } }),

  // ------------------------------------------------------------ AREA
  fam({ id: 'g4c.area.count.grid', cs: `${Ar}AREA_COUNT`, form: 'word', rung: 1,
    gen: () => {
      const r = randInt(3, 8), c = randInt(3, 8), pe = person();
      if (r === c) return null;
      return { question: `A caretaker tiles the floor of a small store. The floor is ${c} tiles wide and ${r} tiles long, and every tile touches the next with no gap. How many tiles does ${pe.she} need for the whole floor?`, answer: r * c,
        wrong: [[2 * (r + c) - 4, 'That counts the squares round the border only. Count every square, row by row.', 'M_AREA_COUNTS_EDGE_ONLY'], [r * c + 1, 'One square was counted twice. Mark each square as you count it.', 'M_AREA_COUNTS_TWICE'], [r * c - 1, 'One square was missed. Count row by row.', 'M_AREA_COUNTS_TWICE'], [r + c, 'That is the number of squares along two sides. Count every square.', 'M_AREA_COUNTS_EDGE_ONLY']],
        hints: ['Count the squares in one row, then in every row.', 'Or add the same row number of times.'], steps: [`There are ${r} rows of ${c} squares.`, `${r} x ${c} = ${r * c} squares.`], chk: (x) => x === r * c };
    } }),
  fam({ id: 'g4c.area.count.unit', cs: `${Ar}AREA_COUNT`, form: 'direct', rung: 1,
    gen: () => {
      const n = randInt(8, 48), pe = person();
      const options = mc(`${n} squares`, [[`${n} cm`, 'Area is not a length. It counts squares.', 'M_AREA_UNIT_LENGTH'], [`${n} cm in a line`, 'Area is how many squares cover the surface, not how long it is.', 'M_AREA_UNIT_LENGTH'], [`${n * 2} squares`, 'Count the squares only once.', 'M_AREA_COUNTS_TWICE']]);
      return { question: `${pe.name} covers a table top with ${n} unit squares and no gaps. What is the area of the table top?`, options, instruction: 'Choose the area.',
        hints: ['Area is how many squares cover the surface.', 'The answer is a number of squares.'], steps: [`${n} unit squares cover the table top.`, `The area is ${n} squares.`] };
    } }),
  // ---- COMPARE_AREA
  fam({ id: 'g4c.area.compare.strip', cs: `${Ar}COMPARE_AREA`, form: 'word', rung: 2,
    gen: () => {
      const long = randInt(8, 14), r = randInt(3, 4), c = randInt(4, 6), big = r * c;
      if (long >= big) return null;
      const options = mc('B', [['A', 'The longer strip is not the larger area. Count the squares that cover each shape.', 'M_AREA_LONGER_IS_LARGER'], ['They have the same area.', 'Count the squares: the numbers are different.', 'M_AREA_COUNTS_EDGES']]);
      return { question: `Shape A is a long thin strip made of ${long} unit squares in one row. Shape B is a rectangle of ${r} rows and ${c} columns of unit squares. Which shape has the larger area?`, options, instruction: 'Choose the shape.',
        hints: ['Count the squares that cover each shape.', 'The shape that needs more squares has the larger area.'], steps: [`A is ${long} squares. B is ${r} x ${c} = ${big} squares.`, `${big} is more than ${long}, so B has the larger area.`] };
    } }),
  fam({ id: 'g4c.area.compare.difference', cs: `${Ar}COMPARE_AREA`, form: 'word', rung: 2,
    gen: () => {
      const r1 = randInt(3, 7), c1 = randInt(3, 7), r2 = randInt(2, 6), c2 = randInt(2, 6), a = r1 * c1, b = r2 * c2, pe = person();
      if (a <= b + 2) return null;
      return { question: `${pe.name} covers a floor with ${r1} rows of ${c1} tiles and a veranda with ${r2} rows of ${c2} tiles. How many more tiles does the floor need than the veranda?`, answer: a - b,
        wrong: [[a, 'That is the number of tiles for the floor only. Find how many more.', 'M_AREA_COUNTS_EDGES'], [a + b, 'More means find the difference: subtract.', 'M_AREA_COUNTS_EDGES'], [(r1 + c1) - (r2 + c2), 'You added the rows and columns. Multiply them to count the tiles first.', 'M_AREA_LONGER_IS_LARGER']],
        hints: ['Find the number of tiles for each surface first.', 'Then find the difference.'], steps: [`Floor: ${r1} x ${c1} = ${a}. Veranda: ${r2} x ${c2} = ${b}.`, `${a} - ${b} = ${a - b} more tiles.`], chk: (x) => x + b === a };
    } }),

  // ------------------------------------------------------------ VOLUME
  fam({ id: 'g4c.vol.stack.layer', cs: `${V}STACK_CUBES`, form: 'word', rung: 1,
    gen: () => {
      const r = randInt(2, 5), c = randInt(2, 5), L = randInt(3, 6), pe = person();
      if (r === c) return null;
      const layer = r * c;
      return { question: `${pe.name} stacks ${layer * L} tins on a shop shelf. Each layer of tins is ${r} tins long and ${c} tins wide. How many layers does the stack have?`, answer: L,
        wrong: [[layer * L - layer, 'You took one layer away from the blocks. Divide the blocks by the number in one layer.', 'M_VOL_ONE_LAYER_ONLY'], [layer, 'That is the number of blocks in one layer. Find how many layers there are.', 'M_VOL_ONE_LAYER_ONLY'], [r + c, 'You added the rows and the blocks in a row. Multiply them to find one layer first.', 'M_VOL_ADDS_DIMENSIONS'], [layer * L / r, 'Divide by the blocks in a whole layer, not by the rows only.', 'M_VOL_COUNT_VISIBLE_ONLY']],
        hints: ['Find the number of blocks in one layer first.', 'Divide all the blocks by the blocks in one layer.'], steps: [`One layer: ${r} x ${c} = ${layer} blocks.`, `${layer * L} divided by ${layer} = ${L} layers.`], chk: (x) => x * r * c === layer * L };
    } }),
  fam({ id: 'g4c.vol.cuboid.fill', cs: `${V}VOLUME_CUBOID`, form: 'word', rung: 2,
    gen: () => {
      const l = randInt(2, 8), w = randInt(2, 6), h = randInt(2, 6), pe = person();
      if (distinct(l, w, h) === false) return null;
      return { question: `A box is ${l} cubes long, ${w} cubes wide and ${h} cubes high. ${pe.name} fills it with identical cubes. How many cubes fill the box?`, answer: l * w * h,
        wrong: [[l + w + h, 'You added the three numbers. Find the cubes in one layer, then multiply by the layers.', 'M_VOL_ADDS_DIMENSIONS'], [l * w, 'That is the cubes in one layer only. Multiply by the number of layers.', 'M_VOL_ONE_LAYER_ONLY'], [l * w + h, 'Multiply the layer by the number of layers; do not add.', 'M_VOL_ADDS_DIMENSIONS'], [2 * (l * w + w * h + l * h), 'That counts faces. Volume counts the cubes inside.', 'M_VOL_SURFACE_NOT_VOLUME']],
        hints: ['Find the cubes in one layer first.', 'Multiply by the number of layers.'], steps: [`One layer: ${l} x ${w} = ${l * w}.`, `${h} layers: ${l * w} x ${h} = ${l * w * h}.`], chk: (x) => x === l * w * h };
    } }),
  fam({ id: 'g4c.vol.cube.blocks', cs: `${V}VOLUME_CUBE`, form: 'word', rung: 2,
    gen: () => {
      const s = randInt(2, 6), pe = person();
      return { question: `${pe.name} builds a big cube from small blocks. It is ${s} blocks long, ${s} blocks wide and ${s} blocks high. How many small blocks make the big cube?`, answer: s ** 3,
        wrong: [[s, 'That is the number of blocks along one edge. Count the blocks in a layer, then all the layers.', 'M_VOL_CUBE_SIDE_ONLY'], [s * s, 'That is one layer. A cube has as many layers as its side.', 'M_VOL_CUBE_SQUARES_SIDE'], [3 * s, 'You multiplied the side by three. Multiply the side by itself three times.', 'M_VOL_CUBE_TIMES_THREE']],
        hints: ['Find the blocks in one layer.', 'A cube has as many layers as the number of blocks along its edge.'], steps: [`One layer: ${s} x ${s} = ${s * s}.`, `${s} layers: ${s * s} x ${s} = ${s ** 3}.`], chk: (x) => x === s * s * s };
    } }),
  fam({ id: 'g4c.vol.cube.edge', cs: `${V}VOLUME_CUBE`, form: 'word', rung: 3,
    gen: () => {
      const s = randInt(2, 5), n = s ** 3, th = pick(['sugar cubes', 'blocks', 'wooden cubes']), pe = person();
      return { question: `${pe.name} makes a big cube from ${n} ${th}. How many ${th} are along one edge of the big cube?`, answer: s,
        wrong: [[Math.round(n / 3), 'Dividing by three does not give the edge. The edge multiplied by itself three times gives the total.', 'M_VOL_CUBE_TIMES_THREE'], [s * s, 'That is the number in one layer, not along one edge.', 'M_VOL_CUBE_SQUARES_SIDE'], [Math.round(n / 2), 'Think of the layers: the edge times the edge times the edge is the total.', 'M_VOL_CUBE_SIDE_ONLY'], [s + 1, `Check: ${s + 1} x ${s + 1} x ${s + 1} is not ${n}.`, 'M_VOL_CUBE_SIDE_ONLY']],
        hints: ['A cube has the same number along each edge.', 'Which number multiplied by itself three times gives the total?'], steps: [`Try ${s}: ${s} x ${s} x ${s} = ${n}.`, `So ${s} ${th} are along one edge.`], chk: (x) => x * x * x === n };
    } }),
];
