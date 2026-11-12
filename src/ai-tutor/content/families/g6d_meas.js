// ============================================================================
// GRADE 6 MATHS, MEASUREMENT (12 Nov 2026): second families for skills that had one structure, first families for skills with none.
// Against curriculum/mathematics/g6.json (curriculumMap.g6.js). DRAFT: off for children until a Kenyan maths teacher signs them off.
// ============================================================================
import { fam, ask, spot, randInt, pick, shuffle, commas, person, sh, distinct, mc } from './g6d_lib.js';

const L = 'MEASUR.LENGTH.', A = 'MEASUR.AREA.', P = 'MEASUR.CAPACITY.', S = 'MEASUR.MASS.', T = 'MEASUR.TIME.';
const cmmm = (mm) => `${Math.floor(mm / 10)} cm ${mm % 10} mm`;
const split = () => { const c = randInt(2, 9), m = randInt(1, 9); return [c, m, c * 10 + m]; };

export const FAMILIES = [
  // ------------------------------------------------------------ LENGTH
  fam({ id: 'g6d.len.read-ruler', cs: `${L}MM_AS_UNIT`, form: 'word', rung: 1,
    gen: () => {
      const c = randInt(3, 12), m = randInt(2, 8), ans = c * 10 + m, p = person();
      return { question: `${p.name} puts a ruler beside a pencil lead. The lead starts at 0 and ends ${m} small marks after the ${c} cm mark. How long is the lead in millimetres? Give the number only.`, answer: ans,
        wrong: [[c + m, 'The centimetres and the small marks were added as if they were the same unit. Each centimetre is 10 small marks.', 'M_CM_MARKS_ADDED'], [ans + 1, 'The marks were counted from 1 instead of from the centimetre mark. The first small mark after the cm mark is 1 mm.', 'M_RULER_COUNT_FROM_ONE'], [ans - 1, 'The last small mark was missed. Count every small mark after the centimetre mark.', 'M_RULER_COUNT_FROM_ONE'], [c * 100 + m, 'A centimetre has 10 small marks, not 100.', 'M_CM_MARKS_ADDED']],
        hints: ['Each centimetre on the ruler is divided into 10 small marks.', `Change the ${c} cm to millimetres, then add the small marks.`], steps: [`${c} cm is ${c * 10} mm.`, `${c * 10} mm + ${m} mm = ${ans} mm.`], chk: (a) => Math.floor(a / 10) === c && a % 10 === m };
    } }),
  fam({ id: 'g6d.len.mm-in-cm-spot', cs: `${L}MM_CM_RELATIONSHIP`, form: 'spot', rung: 3,
    gen: () => {
      const c = randInt(3, 9);
      return spot(`${person().name} changes the length of a pencil, ${c} cm, to millimetres.`, [`Step 1: The pencil is ${c} cm long.`, `Step 2: There are 100 mm in 1 cm, so ${c} cm is ${c * 100} mm.`, `Step 3: The pencil is ${c * 100} mm long.`], 1,
        `There are 10 mm in 1 cm, not 100. So ${c} cm is ${c} × 10 = ${c * 10} mm.`, 'M_HUNDRED_NOT_TEN', ['Count the small marks in one centimetre on a ruler.', 'Check how many millimetres make one centimetre.']);
    } }),
  fam({ id: 'g6d.len.longest-piece', cs: `${L}CONVERT_TO_MM`, form: 'table', rung: 3,
    gen: () => {
      // piece P is longest in mm; Q has the biggest cm + mm total; R has the biggest mm number: three different pieces
      const c1 = randInt(7, 9), m1 = randInt(1, 2), c2 = c1 - 1, m2 = randInt(m1 + 2, 8), m3 = randInt(m2 + 1, 9), c3 = randInt(2, c2 - 2);
      if (c3 + m3 >= c2 + m2 || m3 <= m2) return null;
      const rows = shuffle([{ c: c1, m: m1 }, { c: c2, m: m2 }, { c: c3, m: m3 }]).map(r => ({ ...r, mm: r.c * 10 + r.m }));
      const best = (f) => rows.reduce((b, r, i) => (f(r) > f(rows[b]) ? i : b), 0);
      const t = best(r => r.mm), a = best(r => r.c + r.m), h = best(r => r.m);
      if (!distinct(t, a, h)) return null;
      const names = ['A', 'B', 'C'], text = (i) => `Piece ${names[i]}`;
      const options = mc(text(t), [[text(a), 'The centimetres and millimetres were added without changing the units. Change every length to millimetres first.', 'M_ADD_NOT_MULTIPLY'], [text(h), 'Only the millimetre numbers were compared. The centimetres are part of the length: change each length to millimetres.', 'M_ADD_NOT_MULTIPLY']]);
      return { question: `Three pieces of wire are measured. A: ${rows[0].c} cm ${rows[0].m} mm. B: ${rows[1].c} cm ${rows[1].m} mm. C: ${rows[2].c} cm ${rows[2].m} mm. Which piece is the longest?`, options, instruction: 'Choose the best answer.',
        hints: ['Change each length to millimetres so they can be compared.', 'Multiply the centimetres by 10 and add the millimetres.'], steps: rows.map((r, i) => `${names[i]}: ${r.c} × 10 + ${r.m} = ${r.mm} mm.`).concat([`The longest is ${text(t).toLowerCase()}.`]) };
    } }),
  fam({ id: 'g6d.len.add-ropes', cs: `${L}ADD_CM_MM`, form: 'word', rung: 2,
    gen: () => {
      const [c1, m1] = split(), [c2, m2] = split();
      if (m1 + m2 < 10) return null;
      const tot = c1 * 10 + m1 + c2 * 10 + m2, right = cmmm(tot);
      const w = [`${c1 + c2} cm ${m1 + m2} mm`, `${c1 + c2} cm ${m1 + m2 - 10} mm`];
      if (!distinct(right, ...w)) return null;
      const options = mc(right, [[w[0], 'The millimetres came to 10 or more. Rename each 10 mm as 1 cm.', 'M_MM_OVER_NINE_LEFT'], [w[1], '10 mm were renamed as 1 cm, but that centimetre was not added to the centimetres.', 'M_CARRY_FORGOTTEN']]);
      return { question: `${person().name} joins two ropes. One is ${c1} cm ${m1} mm long and the other is ${c2} cm ${m2} mm long. How long are they together?`, options, instruction: 'Choose the best answer.',
        hints: ['Add the millimetres and the centimetres separately.', 'Rename every 10 mm as 1 cm.'], steps: [`mm: ${m1} + ${m2} = ${m1 + m2} mm, which is 1 cm ${m1 + m2 - 10} mm.`, `cm: ${c1} + ${c2} + 1 = ${c1 + c2 + 1} cm.`, `Together: ${right}.`] };
    } }),
  fam({ id: 'g6d.len.add-spot', cs: `${L}ADD_CM_MM`, form: 'spot', rung: 3,
    gen: () => {
      const [c1, m1] = split(), [c2, m2] = split();
      if (m1 + m2 < 10) return null;
      return spot(`${person().name} adds ${c1} cm ${m1} mm and ${c2} cm ${m2} mm.`, [`Step 1: The centimetres: ${c1} + ${c2} = ${c1 + c2} cm.`, `Step 2: The millimetres: ${m1} + ${m2} = ${m1 + m2} mm.`, `Step 3: The total is ${c1 + c2} cm ${m1 + m2} mm.`], 2,
        `${m1 + m2} mm is more than 10 mm, so rename 10 mm as 1 cm: ${m1 + m2} mm is 1 cm ${m1 + m2 - 10} mm. The total is ${cmmm(c1 * 10 + m1 + c2 * 10 + m2)}.`, 'M_MM_OVER_NINE_LEFT', ['Look at the millimetres in the answer.', 'A length in cm and mm never has 10 mm or more in the mm part.']);
    } }),
  fam({ id: 'g6d.len.subtract-spot', cs: `${L}SUBTRACT_CM_MM`, form: 'spot', rung: 3,
    gen: () => {
      const c1 = randInt(5, 9), m1 = randInt(0, 3), c2 = randInt(1, c1 - 2), m2 = randInt(m1 + 2, 9);
      return spot(`${person().name} subtracts ${c2} cm ${m2} mm from ${c1} cm ${m1} mm.`, [`Step 1: The millimetres: ${m2} mm is more than ${m1} mm.`, `Step 2: Take ${m1} mm from ${m2} mm to get ${m2 - m1} mm.`, `Step 3: The centimetres: ${c1} − ${c2} = ${c1 - c2}, so the answer is ${c1 - c2} cm ${m2 - m1} mm.`], 1,
        `${m2} mm cannot be taken from ${m1} mm. Rename 1 cm as 10 mm, so ${c1} cm ${m1} mm is ${c1 - 1} cm ${m1 + 10} mm. The answer is ${cmmm((c1 * 10 + m1) - (c2 * 10 + m2))}.`, 'M_SMALLER_FROM_LARGER_MM', ['Which is the top mm number, and which is the bottom?', 'The top number must be big enough to take away from.']);
    } }),
  fam({ id: 'g6d.len.multiply-spot', cs: `${L}MULTIPLY_CM_MM`, form: 'spot', rung: 3,
    gen: () => {
      const c = randInt(2, 6), m = randInt(5, 9), k = randInt(3, 6);
      return spot(`${person().name} multiplies ${c} cm ${m} mm by ${k}.`, [`Step 1: The centimetres: ${c} × ${k} = ${c * k} cm.`, `Step 2: The millimetres: ${m} × ${k} = ${m * k} mm.`, `Step 3: The answer is ${c * k} cm ${m * k} mm.`], 2,
        `${m * k} mm is more than 10 mm, so rename it: ${m * k} mm is ${Math.floor(m * k / 10)} cm ${m * k % 10} mm. The answer is ${cmmm((c * 10 + m) * k)}.`, 'M_MM_NOT_RENAMED_AFTER_MULT', ['Look at the millimetres in the answer.', 'The mm part of an answer in cm and mm must be less than 10.']);
    } }),
  fam({ id: 'g6d.len.share-rod-spot', cs: `${L}DIVIDE_CM_MM`, form: 'spot', rung: 3,
    gen: () => {
      const k = pick([2, 3, 4, 5]), each = randInt(12, 90), total = each * k, c = Math.floor(total / 10), m = total % 10;
      if (c % k === 0 || total > 400) return null;
      const sep = Math.floor(c / k) * 10 + Math.floor(m / k);
      return spot(`${person().name} cuts a rod of ${c} cm ${m} mm into ${k} equal pieces.`, [`Step 1: The centimetres: ${c} cm shared by ${k} is ${Math.floor(c / k)} cm, with ${c % k} cm left over that is not used.`, `Step 2: The millimetres: ${m} mm shared by ${k} is ${Math.floor(m / k)} mm.`, `Step 3: Each piece is ${cmmm(sep)}.`], 0,
        `The left-over ${c % k} cm is part of the rod and must be shared too. Change the whole rod to ${total} mm, then ${total} ÷ ${k} = ${each} mm, which is ${cmmm(each)}.`, 'M_REMAINDER_CM_LOST', ['What happens to the centimetres that are left over?', 'Change the whole length to millimetres before dividing.']);
    } }),
  fam({ id: 'g6d.len.measure-round-tin', cs: `${L}CIRCUMFERENCE_PRACTICAL`, form: 'why', rung: 1,
    gen: () => {
      const obj = pick(['a tin of beans', 'a bucket', 'a cooking pot', 'a drum']), p = person();
      const options = mc('Wrap a string round it once, then measure the string with a ruler', [['Measure the distance across the middle of it with a ruler and use that', 'That is the distance across, the diameter. The circumference is the distance round the edge.', 'M_CIRCUMFERENCE_AS_DIAMETER'], ['Measure across it with a ruler and then double that measurement', 'The distance round is a little more than three times the distance across, not two times.', 'M_CIRCUMFERENCE_TWICE_DIAMETER']]);
      return { question: `${p.name} wants to find the distance round ${obj}. Which way gives the best measurement?`, options, instruction: 'Choose the best answer.',
        hints: ['The circumference is the distance round the edge.', 'A string can bend round the edge.'], steps: ['A string follows the curved edge once round.', 'The length of the string is the circumference.'] };
    } }),
  // ------------------------------------------------------------ AREA
  fam({ id: 'g6d.area.wall-gable', cs: `${A}AREA_COMBINED`, form: 'word', rung: 3,
    gen: () => {
      const w = randInt(3, 9) * 2, h = randInt(3, 8), t = randInt(2, 5), rect = w * h, tri = w * t / 2, ans = rect + tri, p = person();
      return { question: `The end wall of ${p.name}'s house is a rectangle ${w} m wide and ${h} m high, with a triangle on top. The triangle has a base of ${w} m and a height of ${t} m. What is the area of the whole wall, in square metres? Give the number only.`, answer: ans,
        wrong: [[rect, 'Only the rectangle was counted. The triangle on top is part of the wall.', 'M_ONE_PART_ONLY'], [rect + w * t, 'The triangle was counted as a whole rectangle. Its area is half of base times height.', 'M_NO_HALF'], [rect * 2 + 2 * t, 'That adds distances round the edge. Area is the space inside.', 'M_PERIMETER_FOR_AREA'], [tri, 'Only the triangle was counted. The rectangle below it is part of the wall.', 'M_ONE_PART_ONLY']],
        hints: ['Split the wall into a rectangle and a triangle.', 'The area of a triangle is half of base times height.'], steps: [`Rectangle: ${w} × ${h} = ${rect} m².`, `Triangle: ${w} × ${t} ÷ 2 = ${tri} m².`, `Whole wall: ${rect} + ${tri} = ${ans} m².`], chk: (a) => a - rect === tri };
    } }),
  // ------------------------------------------------------------ CAPACITY
  fam({ id: 'g6d.cap.litre-equals', cs: `${P}CM3_ML_LITRE_RELATION`, form: 'why', rung: 1,
    gen: () => {
      const k = pick([1, 2, 3, 5]);
      const options = mc(`${commas(k * 1000)} cm³`, [[`${commas(k * 100)} cm³`, 'One litre is 1,000 cm³, not 100 cm³.', 'M_CM3_HUNDRED_ML'], [`${commas(k * 10)} cm³`, 'One litre is much more than 10 cm³. A cm³ is very small: it holds 1 ml.', 'M_CM3_HUNDRED_ML'], [`${commas(k)} cm³`, 'One litre holds 1,000 ml, and each ml is 1 cm³.', 'M_CM3_AS_LITRES']]);
      return { question: `A jug holds ${k} litre${k > 1 ? 's' : ''} of water. Which volume in cm³ is the same?`, options, instruction: 'Choose the best answer.',
        hints: ['1 cm³ holds 1 ml of water.', 'There are 1,000 ml in 1 litre.'], steps: ['1 litre is 1,000 ml, and 1 ml is 1 cm³.', `${k} litre${k > 1 ? 's are' : ' is'} ${commas(k * 1000)} cm³.`] };
    } }),
  fam({ id: 'g6d.cap.box-litres', cs: `${P}CM3_ML_LITRE_RELATION`, form: 'word', rung: 3,
    gen: () => {
      const a = pick([10, 20, 25, 50]), b = pick([10, 20, 40]), c = pick([10, 20, 25, 50]), V = a * b * c;
      if (V % 1000 !== 0 || V > 100000) return null;
      const ans = V / 1000;
      return { question: `${person().name}'s water tank is a box ${a} cm long, ${b} cm wide and ${c} cm high. Its volume is ${commas(V)} cm³. How many litres of water can it hold? Give the number only.`, answer: ans,
        wrong: [[V / 100, '1,000 cm³ make 1 litre, not 100 cm³.', 'M_CM3_HUNDRED_ML'], [V, 'That is the number of cm³. Change cm³ to litres: 1,000 cm³ make 1 litre.', 'M_CM3_AS_LITRES'], [V / 10, '1,000 cm³ make 1 litre, not 10 cm³.', 'M_CM3_HUNDRED_ML']],
        hints: ['1 cm³ holds 1 ml of water.', 'Change the millilitres to litres by dividing by 1,000.'], steps: [`${commas(V)} cm³ holds ${commas(V)} ml.`, `${commas(V)} ÷ 1,000 = ${ans} litres.`], chk: (x) => x * 1000 === V };
    } }),
  fam({ id: 'g6d.cap.decimal-litres', cs: `${P}LITRES_TO_ML`, form: 'word', rung: 2,
    gen: () => {
      const l = pick([0.5, 1.5, 2.5, 3.2, 4.8, 0.75, 1.25, 2.4]), ans = l * 1000, rows = shuffle(['Jerrycan', 'Bucket', 'Drum']).slice(0, 2);
      return { question: `A ${rows[0].toLowerCase()} holds ${l} litres and a ${rows[1].toLowerCase()} holds ${pick([8, 10, 15])} litres. How many millilitres does the ${rows[0].toLowerCase()} hold? Give the number only.`, answer: ans,
        wrong: [[l * 100, 'There are 1,000 ml in a litre, not 100 ml.', 'M_TIMES_HUNDRED'], [Math.floor(l) * 1000 + Number(String(l).split('.')[1]), 'The part after the point is a part of a litre, not a number of millilitres.', 'M_DECIMAL_LITRE'], [l / 1000, 'That divides. Changing litres to millilitres means multiplying by 1,000.', 'M_TIMES_HUNDRED'], [l * 10, 'There are 1,000 ml in a litre.', 'M_TIMES_HUNDRED']],
        hints: ['1 litre is 1,000 ml.', 'Multiply the number of litres by 1,000.'], steps: [`${l} × 1,000 = ${commas(ans)}.`, `The ${rows[0].toLowerCase()} holds ${commas(ans)} ml.`], chk: (a) => a / 1000 === l };
    } }),
  fam({ id: 'g6d.cap.pool-litres', cs: `${P}ML_TO_LITRES`, form: 'word', rung: 3,
    gen: () => {
      const l = randInt(2, 19), ml = pick([250, 500, 750, 125]), N = l * 1000 + ml, ans = N / 1000;
      return { question: `A water tank holds ${commas(N)} ml. How many litres is that? Give the number only, as a decimal if needed.`, answer: ans,
        wrong: [[N / 100, 'There are 1,000 ml in a litre, so divide by 1,000, not by 100.', 'M_DIVIDE_BY_HUNDRED'], [l, 'That drops the leftover millilitres. They are part of a litre and must be kept.', 'M_LEFTOVER_ML_LOST'], [N / 10, 'There are 1,000 ml in a litre, so divide by 1,000.', 'M_DIVIDE_BY_HUNDRED']],
        hints: ['1,000 ml make 1 litre.', 'Divide by 1,000. The millilitres left over become a decimal part of a litre.'], steps: [`${commas(N)} ÷ 1,000 = ${ans}.`, `The tank holds ${ans} litres.`], chk: (a) => Math.round(a * 1000) === N };
    } }),
  // ------------------------------------------------------------ MASS
  fam({ id: 'g6d.mass.choose-unit', cs: `${S}TONNE_AS_UNIT`, form: 'word', rung: 1,
    gen: () => {
      const pool = [
        { q: 'a goat', r: 'kg', w: [['t', 'A tonne is 1,000 kg. A goat is nowhere near that heavy.', 'M_UNIT_FOR_SMALL_OBJECT'], ['g', 'A gramme is very small, about a paper clip. A goat is much heavier.', 'M_UNIT_TOO_SMALL']] },
        { q: 'a lorry load of sand', r: 't', w: [['kg', 'A lorry load is thousands of kilograms. A bigger unit is easier to use.', 'M_TONNE_LESS_THAN_KG'], ['g', 'A gramme is very small. A lorry load is far heavier.', 'M_UNIT_TOO_SMALL']] },
        { q: 'a spoonful of salt', r: 'g', w: [['kg', 'A kilogramme is as heavy as a packet of sugar. A spoonful is much lighter.', 'M_UNIT_FOR_SMALL_OBJECT'], ['t', 'A tonne is 1,000 kg. A spoonful of salt is very light.', 'M_UNIT_FOR_SMALL_OBJECT']] },
        { q: 'a harvest of 200 sacks of maize', r: 't', w: [['kg', 'The harvest is thousands of kg. The tonne is the better unit.', 'M_TONNE_LESS_THAN_KG'], ['g', 'A gramme is very small. The harvest is huge.', 'M_UNIT_TOO_SMALL']] },
      ];
      const x = pick(pool), o = mc(x.r, x.w.map(([t, why, mis]) => [t, why, mis]));
      return o ? { question: `Which unit is best for the mass of ${x.q}: the gramme (g), the kilogramme (kg) or the tonne (t)?`, options: o, instruction: 'Choose the best answer.', hints: ['Think how heavy the load is.', 'A tonne is 1,000 kg, a kilogramme is 1,000 g.'], steps: ['Compare the object with a packet of sugar (1 kg) and a lorry (many tonnes).', `The best unit for ${x.q} is the ${x.r === 't' ? 'tonne' : x.r === 'kg' ? 'kilogramme' : 'gramme'}.`] } : null;
    } }),
  fam({ id: 'g6d.mass.sensible-load', cs: `${S}ITEMS_IN_TONNES`, form: 'direct', rung: 2,
    gen: () => {
      const n = randInt(3, 12), what = pick(['sand', 'maize', 'cement', 'bricks', 'gravel']);
      const options = mc(`${n} t`, [[`${n} kg`, 'That is the mass of a few sacks. A lorry carries many sacks.', 'M_LOAD_TOO_LIGHT'], [`${n} g`, 'That is the mass of a few sweets. A lorry carries far more.', 'M_LOAD_TOO_LIGHT'], [`${n * 1000} t`, 'That is a huge mass, as heavy as a ship. A lorry carries a few tonnes.', 'M_BIG_MEANS_TONNES']]);
      return { question: `A lorry brings ${what} to a building site near ${pick(['Thika', 'Machakos', 'Nakuru', 'Kitale'])}. Which is a sensible mass for the load?`, options, instruction: 'Choose the best answer.',
        hints: ['A lorry load is many sacks.', 'A tonne is 1,000 kg, about 20 sacks of 50 kg.'], steps: ['One sack of cement is 50 kg, so a lorry load is many times that.', `A load of ${n} tonnes is sensible.`] };
    } }),
  fam({ id: 'g6d.mass.tonne-or-kg', cs: `${S}KG_TONNE_RELATIONSHIP`, form: 'why', rung: 2,
    gen: () => {
      const a = randInt(2, 9), b = a * 100 + randInt(20, 80);
      const options = mc(`${a} tonnes is heavier`, [[`${commas(b)} kg is heavier`, `One tonne is 1,000 kg, not 100 kg. ${a} tonnes is ${commas(a * 1000)} kg.`, 'M_HUNDRED_KG']]);
      return { question: `A lorry carries ${a} tonnes of sand and a pick-up carries ${commas(b)} kg. Which load is heavier?`, options, instruction: 'Choose the best answer.',
        hints: ['Change both masses to the same unit.', '1 tonne is 1,000 kg.'], steps: [`${a} tonnes = ${commas(a * 1000)} kg.`, `${commas(a * 1000)} kg is more than ${commas(b)} kg.`] };
    } }),
  fam({ id: 'g6d.mass.estimate-load', cs: `${S}ESTIMATE_TONNES`, form: 'word', rung: 3,
    gen: () => {
      const nr = pick([20, 40, 60, 80]), mr = pick([50, 100, 250]);
      if ((nr * mr) % 1000) return null;
      const n = nr + randInt(-4, 4), m = mr === 50 ? mr + randInt(-3, 3) : mr === 100 ? mr + randInt(-4, 4) : mr + randInt(-4, 4), ans = (nr * mr) / 1000, exact = n * m / 1000;
      if (exact === ans || n % 10 === 0 || m % 10 === 0) return null;
      return { question: `A lorry carries ${n} sacks, each with a mass of about ${m} kg. Estimate the mass of the load in tonnes by rounding each number to the nearest ten. Give the number only.`, answer: ans,
        wrong: [[exact, 'This is the exact mass. An estimate rounds the numbers first.', 'M_ESTIMATE_TOO_PRECISE'], [nr * mr, 'That is the mass in kilograms. The question asks for tonnes: divide by 1,000.', 'M_UNIT_NOT_CONVERTED'], [ans * 10, 'There is a zero too many. Divide the kilograms by 1,000 to change to tonnes.', 'M_UNIT_NOT_CONVERTED'], [ans / 10, 'There is a zero too few. 1,000 kg make 1 tonne.', 'M_UNIT_NOT_CONVERTED']],
        hints: ['Round the number of sacks and the mass of a sack to the nearest ten.', 'Multiply, then change kilograms to tonnes.'], steps: [`${nr} × ${mr} = ${commas(nr * mr)} kg.`, `${commas(nr * mr)} ÷ 1,000 = ${ans} tonnes.`], chk: (a) => a * 1000 === nr * mr };
    } }),
  fam({ id: 'g6d.mass.subtract-spot', cs: `${S}SUBTRACT_TONNES_KG`, form: 'spot', rung: 3,
    gen: () => {
      const t1 = randInt(5, 9), k1 = pick([100, 200, 300]), t2 = randInt(1, t1 - 2), k2 = pick([600, 700, 800, 900]);
      const ans = (t1 * 1000 + k1) - (t2 * 1000 + k2);
      return spot(`A store has ${t1} t ${k1} kg of rice. ${person().name} takes out ${t2} t ${k2} kg. How much is left?`, [`Step 1: ${k2} kg is more than ${k1} kg.`, `Step 2: Take ${k1} kg from ${k2} kg to get ${k2 - k1} kg.`, `Step 3: The tonnes: ${t1} − ${t2} = ${t1 - t2}, so ${t1 - t2} t ${k2 - k1} kg is left.`], 1,
        `${k2} kg cannot be taken from ${k1} kg. Rename 1 t as 1,000 kg, so ${t1} t ${k1} kg is ${t1 - 1} t ${k1 + 1000} kg. The answer is ${Math.floor(ans / 1000)} t ${ans % 1000} kg.`, 'M_SMALLER_FROM_LARGER_KG', ['Which is the top kg number and which is the bottom?', 'The top number must be big enough to take away from.']);
    } }),
  fam({ id: 'g6d.mass.multiply-spot', cs: `${S}MULTIPLY_TONNES_KG`, form: 'spot', rung: 3,
    gen: () => {
      const t = randInt(1, 4), k = pick([300, 400, 600, 700, 800]), n = randInt(3, 6), tot = (t * 1000 + k) * n;
      return spot(`A lorry makes ${n} trips, each carrying ${t} t ${k} kg of sand. ${person().name} works out the total.`, [`Step 1: The tonnes: ${t} × ${n} = ${t * n} t.`, `Step 2: The kilograms: ${k} × ${n} = ${commas(k * n)} kg.`, `Step 3: The total is ${t * n} t ${commas(k * n)} kg.`], 2,
        `${commas(k * n)} kg is more than 1,000 kg, so rename it: ${commas(k * n)} kg is ${Math.floor(k * n / 1000)} t ${k * n % 1000} kg. The total is ${Math.floor(tot / 1000)} t ${tot % 1000} kg.`, 'M_KG_NOT_RENAMED_AFTER_MULT', ['Look at the kilograms in the answer.', 'The kg part of a mass in tonnes and kg must be less than 1,000.']);
    } }),
  fam({ id: 'g6d.mass.share-load', cs: `${S}DIVIDE_TONNES_KG`, form: 'word', rung: 3,
    gen: () => {
      const k = pick([2, 3, 4, 5]), each = randInt(5, 19) * 100 + pick([0, 50]), total = each * k, t = Math.floor(total / 1000), kg = total % 1000;
      if (t % k === 0 || t === 0) return null;
      const sep = Math.floor(t / k) * 1000 + Math.floor(kg / k);
      return { question: `A load of ${t} t ${kg} kg of maize is shared equally among ${k} lorries. What mass does each lorry carry, in kilograms? Give the number only.`, answer: each,
        wrong: [[sep, 'The tonnes and the kilograms were divided separately, so the left-over tonnes were lost. Change the whole mass to kilograms first.', 'M_REMAINDER_TONNE_LOST'], [each / 1000, 'This is in tonnes. The question asks for kilograms.', 'M_UNIT_NOT_CHANGED_BACK_T'], [Math.floor((t * 100 + kg) / k), 'A tonne is 1,000 kg, not 100 kg.', 'M_HUNDRED_KG']],
        hints: ['Change the mass to kilograms first.', `Divide the kilograms by ${k}.`], steps: [`${t} t ${kg} kg = ${commas(total)} kg.`, `${commas(total)} ÷ ${k} = ${commas(each)} kg.`], chk: (a) => a * k === total };
    } }),
  // ------------------------------------------------------------ TIME
  fam({ id: 'g6d.time.which-pm', cs: `${T}AM_PM_IDENTIFY`, form: 'why', rung: 1,
    gen: () => {
      const right = pick(['Kamau eats his lunch at 1:00 in the afternoon.', 'The school bus brings the children home at 4:30 in the afternoon.', 'The evening news starts at 9:00 at night.', 'Choir practice is at 5:15 in the evening.', 'The market closes at 6:00 in the evening.', 'Wanjiru does her homework at 7:30 in the evening.']);
      const n1 = pick(['A night watchman starts his shift at 2:00 in the night, after midnight.', 'A cockerel crows at 3:30 in the night, after midnight.', 'A baker starts work at 1:30 in the night, after midnight.']);
      const n2 = pick(['A baby wakes up at 12:20 just after midnight.', 'A nurse ends a night shift at 12:40, just after midnight.', 'A matatu driver sets off at 12:10, just after midnight.']);
      const options = mc(right, [[n1, 'That time is after midnight, in the night. The hours after midnight are a.m.', 'M_NIGHT_IS_PM'], [n2, 'Just after midnight is a.m. The p.m. hours start at noon.', 'M_NIGHT_IS_PM']]);
      return { question: `${person().name} lists some events from one day in ${pick(['Nyeri', 'Thika', 'Embu', 'Kitale', 'Meru', 'Kisii'])}. Which of these events happens in the p.m.?`, options, instruction: 'Choose the best answer.',
        hints: ['The a.m. hours run from midnight to noon.', 'The p.m. hours run from noon to midnight.'], steps: ['Midnight to noon is a.m.', 'Noon to midnight is p.m.', `The event after noon is the one in the p.m.: ${right}`] };
    } }),
  fam({ id: 'g6d.time.write-quarter-to', cs: `${T}WRITE_AM_PM`, form: 'spot', rung: 3,
    gen: () => {
      const pm = Math.random() < 0.5, h = pm ? randInt(2, 9) : randInt(2, 11), ev = pm ? (h <= 5 ? 'afternoon' : 'evening') : 'morning', ap = pm ? 'p.m.' : 'a.m.';
      return spot(`${person().name} writes a clock time. The clock shows quarter to ${h} in the ${ev}.`, [`Step 1: Quarter to the hour means 15 minutes before the hour.`, `Step 2: So the time is ${h}:45.`, `Step 3: It is in the ${ev}, so the time is written ${h}:45 ${ap}`], 1,
        `Quarter to ${h} is 15 minutes before ${h}, which is 45 minutes past ${h - 1}. The time is written ${h - 1}:45 ${ap}`, 'M_QUARTER_TO_WRONG_HOUR', ['Which hour has the clock just passed at quarter to?', 'Quarter to ${h} is 45 minutes past the hour before.'.replace('${h}', h)]);
    } }),
  fam({ id: 'g6d.time.match-24', cs: `${T}AM_PM_TO_24H_RELATE`, form: 'direct', rung: 1,
    gen: () => {
      const h = randInt(1, 9), m = pick(['00', '15', '20', '30', '45']), pad = (x) => String(x).padStart(2, '0'), f = (x) => `${pad(x)}${m} h`;
      const options = mc(f(h + 12), [[f(h + 10), 'To change a p.m. time to the 24-hour clock add 12 to the hour, not 10.', 'M_ADD_TEN'], [f(h), 'This is the morning time. After noon the 24-hour clock goes on past 12.', 'M_SAME_NUMBER'], [f(h + 14 > 23 ? h + 11 : h + 14), 'Add 12 to the hour to change p.m. to the 24-hour clock.', 'M_ADD_TEN']]);
      return { question: `${person().name}'s match begins at ${h}:${m} p.m. Which 24-hour clock time shows the same time?`, options, instruction: 'Choose the best answer.',
        hints: ['After 12 noon the 24-hour clock keeps counting: 13, 14, 15 and so on.', 'Add 12 to the hour of a p.m. time.'], steps: [`${h} + 12 = ${h + 12}.`, `${h}:${m} p.m. is ${f(h + 12)} on the 24-hour clock.`] };
    } }),
  fam({ id: 'g6d.time.match-12', cs: `${T}AM_PM_TO_24H_RELATE`, form: 'word', rung: 2,
    gen: () => {
      const h = randInt(13, 21), m = pick(['00', '10', '30', '40', '50']), r = h - 12;
      const options = mc(`${r}:${m} p.m.`, [[`${r + 2}:${m} p.m.`, 'To change from the 24-hour clock take 12 away from the hour, not 10.', 'M_ADD_TEN'], [`${r}:${m} a.m.`, 'Hours from 13 to 23 are after noon, so they are p.m.', 'M_SAME_NUMBER'], [`${h}:${m} p.m.`, 'On the 12-hour clock the hour cannot be more than 12. Take 12 away.', 'M_SAME_NUMBER']]);
      return { question: `${person().name} reads ${h}:${m} on a digital clock at the ${pick(['Nakuru', 'Kisumu', 'Mombasa', 'Eldoret'])} bus stage. Which of these shows the same time on the 12-hour clock?`, options, instruction: 'Choose the best answer.',
        hints: ['Hours from 13 to 23 are in the p.m.', 'Take 12 away from the hour.'], steps: [`${h} − 12 = ${r}.`, `${h}:${m} is ${r}:${m} p.m.`] };
    } }),
];
