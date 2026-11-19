// ============================================================================
// GRADE 2 MATHEMATICS, the skills that had no family (19 Nov 2026): Mass (MEASUR.MASS, 3 skills)
// and Lines (GEOMET.LINES, 2 skills). Written in the young kit (g23c_lib.js). Draft, off for
// children until a teacher signs them off. The beam balance and the drawing are done in class
// (the map's hands-on notes); these ask the child to read a balance story or name a line, which
// the map's question forms list.
// ============================================================================
import { yfam, randInt, pick, person, twoPeople, mc, yesNo, cap } from './g23c_lib.js';

const M = 'MEASUR.MASS.', L = 'GEOMET.LINES.';
const SMALL = ['mango', 'exercise book', 'cup', 'shoe', 'toy car', 'orange'];
const an = (n) => (/^[aeiou]/.test(n) ? 'an ' : 'a ') + n;
const KG_GOODS = ['sugar', 'maize flour', 'rice', 'beans', 'potatoes', 'maize'];

export const FAMILIES = [
  // ---------------------------------------------------------------- MEASURE_FIXED_MASS (outcome a)
  yfam({ id: 'g2c.mass.fixed.level', g: 2, cs: `${M}MEASURE_FIXED_MASS`, form: 'word', rung: 1,
    gen: () => {
      const p = person(), it = pick(SMALL), early = randInt(3, 6), level = early + randInt(3, 6);
      return { question: `${p.name} is weighing ${an(it)} with bottle tops. ${early} tops are not enough: the ${it} still sinks. ${p.She} keeps adding tops. When the beam is level, ${p.she} has put on ${level}. How heavy is the ${it}, in bottle tops?`,
        answer: level,
        wrong: [[early, `With ${early} tops the beam was still tipping. Count only when the beam is level.`, 'M_FM_NOT_LEVEL'], [level + 1, `Count the bottle tops only. Do not count the ${it} as well.`, 'SLIP']],
        hints: ['Look for the moment the beam is level.', 'How many bottle tops were on then?'],
        steps: [`With ${early} tops the beam still tips, so the ${it} is heavier than ${early} tops.`, `With ${level} tops the beam is level, so the ${it} balances ${level} bottle tops.`],
        chk: (v) => v === level };
    } }),
  yfam({ id: 'g2c.mass.fixed.down-side', g: 2, cs: `${M}MEASURE_FIXED_MASS`, form: 'direct', rung: 1,
    gen: () => {
      const it = pick(SMALL), n = randInt(4, 9);
      const options = mc(`The ${it} is heavier than ${n} tops`, [
        [`The ${it} is ${n} tops`, 'The beam is not level, so it does not balance yet. Read the count only when the beam is level.', 'M_FM_NOT_LEVEL'],
        [`The ${it} is lighter than ${n} tops`, 'The heavy side goes down, not up. The side that goes down is heavier.', 'M_FM_UP_IS_HEAVY']]);
      return { question: `${cap(an(it))} and ${n} bottle tops sit in the two pans. The ${it} sinks lower. What can we say?`, options, instruction: 'Choose one.',
        hints: ['Press down on one side of a ruler on a pencil. Which side goes down?', 'The heavier side goes down.'],
        steps: [`The side with the ${it} goes down.`, `So the ${it} is heavier than ${n} bottle tops. Add more tops until the beam is level.`] };
    } }),
  yfam({ id: 'g2c.mass.fixed.heavier-unit', g: 2, cs: `${M}MEASURE_FIXED_MASS`, form: 'why', rung: 2,
    gen: () => {
      const p = person(), n = randInt(8, 15), thing = pick(['bag of beans', 'packet of salt', 'tin of sand']);
      const options = mc(`Fewer than ${n}`, [
        [`More than ${n}`, 'Each stone is heavier than a bottle top, so each one does more of the balancing. Fewer stones are needed.', 'M_FM_HEAVIER_UNIT_MORE'],
        [`Exactly ${n}`, 'A stone and a bottle top are not the same mass, so you cannot swap one for one. Units must all be the same to count them.', 'M_FM_MIXED_UNITS']]);
      return { question: `A ${thing} balances ${n} bottle tops. ${p.name} now uses stones instead. Each stone is heavier than a bottle top. How many stones will balance the ${thing}?`, options, instruction: 'Choose one.',
        hints: ['Is one stone heavier or lighter than one bottle top?', 'Heavier units: do you need more of them or fewer?'],
        steps: ['Each stone is heavier than a bottle top.', `So fewer than ${n} stones balance the ${thing}.`] };
    } }),
  yfam({ id: 'g2c.mass.fixed.same-units', g: 2, cs: `${M}MEASURE_FIXED_MASS`, form: 'why', rung: 2,
    gen: () => {
      const [p, q] = twoPeople(), n = randInt(3, 6), it = pick(['a book', 'a water bottle', 'a lunch box']);
      return { question: `${p.name} balances ${it} with ${n} stones. The stones are all different sizes. ${p.She} says, "It is ${n} stones heavy." ${q.name} says that is not a fair measure. Is ${q.name} right?`,
        options: yesNo(true, `Yes, the stones are not all the same`, `No, ${n} stones balance it`, 'To count units, every unit must be the same mass, like bottle tops of one kind. Stones of different sizes are not equal.', 'M_FM_MIXED_UNITS'), instruction: 'Choose yes or no.',
        hints: ['Are all the stones the same?', 'Can we count units that are not the same mass?'],
        steps: ['The stones are different sizes, so they are not the same mass.', `${q.name} is right. Use units that are all the same.`] };
    } }),

  // ---------------------------------------------------------------- KNOW_KILOGRAM (outcome b)
  yfam({ id: 'g2c.mass.kg.short', g: 2, cs: `${M}KNOW_KILOGRAM`, form: 'why', rung: 1,
    gen: () => {
      const n = randInt(2, 9), good = pick(KG_GOODS);
      const options = mc('kg', [
        ['kgs', 'Kilogram is written kg: small letters and no s, even when there are many kilograms.', 'M_KK_WRITES_KILO_WRONG']], true);
      return { question: `A shopkeeper writes a sign: ${n} kilograms of ${good}. Which is the short way to write kilograms on the sign?`, options, instruction: 'Choose one.',
        hints: ['Kilogram has a short way of writing.', 'Small k, small g, no s.'], steps: [`Kilograms is written kg.`, `${n} kilograms is ${n} kg.`] };
    } }),
  yfam({ id: 'g2c.mass.kg.same-kg', g: 2, cs: `${M}KNOW_KILOGRAM`, form: 'why', rung: 2,
    gen: () => {
      const heavy = pick(['maize', 'stones', 'sand', 'beans']), light = pick(['cotton wool', 'feathers', 'dry grass']), order = Math.random() < 0.5;
      const options = mc('They are the same', [
        [`The ${heavy}`, `Both bags balance a 1 kg mass, so both are 1 kg. ${cap(heavy)} feels heavy only when there is more of it.`, 'M_KK_FEATHER_KG'],
        [`The ${light}`, `The ${light} fills a bigger bag, but a bigger bag is not more kilograms. Both are 1 kg.`, 'M_KK_BIG_IS_KG']]);
      const [a, b] = order ? [heavy, light] : [light, heavy];
      return { question: `One bag has 1 kg of ${a}. Another bag has 1 kg of ${b}. Which bag is heavier?`, options, instruction: 'Choose one.',
        hints: ['Look at the mass written for each bag.', 'What does each bag balance?'], steps: ['Each bag is 1 kg.', 'So they are the same mass.'] };
    } }),
  yfam({ id: 'g2c.mass.kg.big-box', g: 2, cs: `${M}KNOW_KILOGRAM`, form: 'word', rung: 1,
    gen: () => {
      const p = person(), big = pick(['big empty carton', 'big empty basket', 'big empty sack']), good = pick(['sugar', 'maize flour', 'rice']);
      return { question: `${p.name} holds a ${big} in one hand and a 1 kg packet of ${good} in the other. Is the ${big} heavier than 1 kg?`,
        options: yesNo(false, `Yes, it is bigger`, `No, it is lighter than 1 kg`, `Big is not the same as heavy. The ${big} is mostly air, so it is lighter than the 1 kg packet.`, 'M_KK_BIG_IS_KG'), instruction: 'Choose yes or no.',
        hints: ['Is it full or empty?', 'A big thing can still be light.'], steps: [`The ${big} has little inside.`, 'It is lighter than the 1 kg packet.'] };
    } }),
  yfam({ id: 'g2c.mass.kg.sold-by', g: 2, cs: `${M}KNOW_KILOGRAM`, form: 'why', rung: 1,
    gen: () => {
      const good = pick(KG_GOODS), p = person();
      const options = mc(`${cap(good)}`, [
        [`Milk to drink`, 'Milk is poured, so we buy it in litres. Kilograms tell us how heavy something is.', 'M_KK_UNIT_MIX']]);
      return { question: `${p.name} goes to the market. Which of these does ${p.she} buy by the kilogram?`, options, instruction: 'Choose one.',
        hints: ['Kilograms say how heavy something is.', 'Which one is weighed on a balance at the shop?'], steps: ['Kilograms tell us how heavy something is.', `${cap(good)} is weighed on a balance, so it is sold in kilograms. Milk is sold in litres.`] };
    } }),

  // ---------------------------------------------------------------- MEASURE_IN_KG (outcome c)
  yfam({ id: 'g2c.mass.inkg.read', g: 2, cs: `${M}MEASURE_IN_KG`, form: 'word', rung: 1,
    gen: () => {
      const items = randInt(4, 9), kg = randInt(2, 5), thing = pick(['oranges', 'mangoes', 'potatoes', 'onions']), p = person();
      if (items === kg || items === kg + 1) return null;
      return { question: `${p.name} weighs ${items} ${thing} against 1 kg masses. When ${p.she} tries ${kg + 1} masses, the masses sink. When ${p.she} tries ${kg} masses, both pans hang level. How many kilograms do the ${thing} weigh?`,
        answer: kg,
        wrong: [[items, `${items} is the number of ${thing}. Count the 1 kg masses, not the ${thing}.`, 'M_MKG_COUNTS_ITEMS'], [kg + 1, `With ${kg + 1} masses the beam was tipping, so that was too many. Read only when the beam is level.`, 'M_MKG_READS_TIPPED']],
        hints: ['Find the moment the beam is level.', 'Count the 1 kg masses then.'],
        steps: [`The beam is level with ${kg} masses of 1 kg.`, `The ${thing} are ${kg} kg.`], chk: (v) => v === kg };
    } }),
  yfam({ id: 'g2c.mass.inkg.heaviest', g: 2, cs: `${M}MEASURE_IN_KG`, form: 'direct', rung: 2,
    gen: () => {
      const p = person(), things = ['a pumpkin', 'a jerrycan of water', 'a bag of maize', 'a basket of sweet potatoes'];
      const [a, b, c] = [things[0], things[1], things[2]].sort(() => Math.random() - 0.5);
      const ka = randInt(2, 4), kb = ka + randInt(2, 3), kc = randInt(ka + 1, kb - 1);
      const options = mc(cap(b), [
        [cap(a), `${cap(a)} balanced the fewest masses, ${ka}. More kilograms means heavier, not lighter.`, 'M_MKG_HEAVIER_LESS'],
        ['They are the same: one thing each', 'Each is one thing, but count the 1 kg masses each one balanced. They are not the same.', 'M_MKG_COUNTS_ITEMS']]);
      return { question: `${p.name} weighs three things on a beam balance with 1 kg masses. ${cap(a)} balances ${ka} masses. ${cap(c)} balances ${kc} masses. ${cap(b)} balances ${kb} masses. Which is the heaviest?`, options, instruction: 'Choose one.',
        hints: ['Each mass is 1 kg. Count kilograms for each thing.', 'The most kilograms is the heaviest.'], steps: [`${cap(a)} is ${ka} kg, ${c} is ${kc} kg and ${b} is ${kb} kg.`, `${kb} kg is the most, so ${b} is the heaviest.`] };
    } }),

  // ---------------------------------------------------------------- STRAIGHT_LINES (outcomes a, b)
  yfam({ id: 'g2c.lines.straight.slanting', g: 2, cs: `${L}STRAIGHT_LINES`, oc: 'b', form: 'why', rung: 1,
    gen: () => {
      const p = person(), [from, to] = pick([['bottom left corner', 'top right corner'], ['top left corner', 'bottom right corner']]);
      return { question: `${p.name} uses a ruler to draw a line from the ${from} of ${p.her} page to the ${to}. The line is slanting. Is it a straight line?`,
        options: yesNo(true, 'Yes, it does not bend', 'No, it is slanting', 'A straight line can point any way: up, across or slanting. Lay a ruler on it: it does not bend, so it is straight.', 'M_SL_SLANT_NOT_STRAIGHT'), instruction: 'Choose yes or no.',
        hints: ['Was it drawn with a ruler?', 'Does the line bend anywhere?'], steps: ['The line does not bend.', 'So it is straight, even though it is slanting.'] };
    } }),
  yfam({ id: 'g2c.lines.straight.zigzag', g: 2, cs: `${L}STRAIGHT_LINES`, oc: 'a', form: 'why', rung: 2,
    gen: () => {
      const [p, q] = twoPeople(), n = randInt(3, 5);
      return { question: `${p.name} makes a zigzag with ${n} sticks on the floor. ${q.name} says, "That is a curved line." Is ${q.name} right?`,
        options: yesNo(false, 'Yes, it is curved', 'No, it is straight lines joined', `Each stick is a straight line. They meet at corners; nothing bends smoothly. A zigzag is made of ${n} straight lines.`, 'M_SL_BROKEN_IS_CURVED'), instruction: 'Choose yes or no.',
        hints: ['Look at one stick at a time.', 'Does any stick bend?'], steps: ['Each stick is straight.', `So the zigzag is ${n} straight lines joined at corners.`] };
    } }),
  yfam({ id: 'g2c.lines.straight.wobbly', g: 2, cs: `${L}STRAIGHT_LINES`, oc: 'b', form: 'word', rung: 1,
    gen: () => {
      const p = person();
      return { question: `${p.name} draws a line without a ruler. When ${p.she} lays a ruler next to it, the line wobbles away from the ruler's edge in places. Is it a straight line?`,
        options: yesNo(false, 'Yes, it is almost straight', 'No, it wobbles', 'A straight line follows the ruler edge all the way. A wobbly line is not straight. Draw it again with a ruler.', 'M_SL_WOBBLY_OK'), instruction: 'Choose yes or no.',
        hints: ['Lay a ruler along the line.', 'Does the line follow the ruler all the way?'], steps: ['The line leaves the ruler edge.', 'So it is not straight. Use a ruler.'] };
    } }),
  yfam({ id: 'g2c.lines.straight.ruler-slips', g: 2, cs: `${L}STRAIGHT_LINES`, oc: 'b', form: 'steps', rung: 2,
    gen: () => {
      const p = person();
      const options = mc('The ruler moved', [
        ['Nothing went wrong', 'A line drawn with a ruler should not bend at all. If it bends at the end, the ruler slipped. Press it down with your other hand.', 'M_SL_RULER_SLIPS'],
        ['The line is slanting', 'A slanting line can still be straight. The trouble is the bend, and the bend came from the ruler slipping.', 'M_SL_SLANT_NOT_STRAIGHT']]);
      return { question: `${p.name} draws a line with a ruler. At the end the line bends a little. What went wrong?`, options, instruction: 'Choose one.',
        hints: ['A ruler has a straight edge.', 'What happens if the ruler moves while you draw?'], steps: ['A line along a still ruler cannot bend.', 'The ruler moved. Hold it firmly.'] };
    } }),

  // ---------------------------------------------------------------- CURVED_LINES (outcomes c, d)
  yfam({ id: 'g2c.lines.curved.plate', g: 2, cs: `${L}CURVED_LINES`, oc: 'c', form: 'direct', rung: 1,
    gen: () => {
      const it = pick(['a round plate', 'the rim of a cup', 'a coin', 'a round tray', 'the lid of a tin']);
      const p = person();
      return { question: `${p.name} puts a crayon on paper and traces round ${it}. Has ${p.she} drawn a line?`,
        options: yesNo(true, 'Yes, a curved line', 'No, a line must be straight', 'A line does not have to be straight. The edge bends smoothly all the way round, so it is a curved line.', 'M_CL_CIRCLE_NOT_LINE'), instruction: 'Choose yes or no.',
        hints: ['Lines can be straight or curved.', 'Does the edge bend?'], steps: ['The crayon goes round and bends smoothly all the way.', 'That is a line: a curved line.'] };
    } }),
  yfam({ id: 'g2c.lines.curved.corner', g: 2, cs: `${L}CURVED_LINES`, oc: 'c', form: 'word', rung: 1,
    gen: () => {
      const it = pick(['the corner of a book', 'the corner of a desk', 'the corner of a window', 'the corner of a door']), p = person();
      return { question: `${p.name} points at ${it} and says it is a curve. Is ${it} a curve?`,
        options: yesNo(false, 'Yes, the line turns', 'No, two straight edges meet', 'A curve bends smoothly. A corner turns sharply where two straight edges meet.', 'M_CL_CORNER_IS_CURVE'), instruction: 'Choose yes or no.',
        hints: ['Does it bend smoothly or turn sharply?', 'Look at the two edges.'], steps: ['Two straight edges meet at the corner.', 'A corner is not a curve.'] };
    } }),
  yfam({ id: 'g2c.lines.curved.rainbow', g: 2, cs: `${L}CURVED_LINES`, oc: 'd', form: 'steps', rung: 2,
    gen: () => {
      const p = person(), what = pick(['a rainbow', 'the top of a hill', 'a smile on a face', 'a path round a tree']);
      const options = mc('Freehand', [
        ['With a ruler', 'A ruler has a straight edge, so it makes straight lines. A curve is drawn freehand or round something round.', 'M_CL_RULER_FOR_CURVE'],
        ['As a zigzag', 'A zigzag is straight lines joined at sharp corners. A curved line bends smoothly, with no corners.', 'M_SL_BROKEN_IS_CURVED']]);
      return { question: `${p.name} wants to draw ${what} with a curved line. How should ${p.she} draw it?`, options, instruction: 'Choose one.',
        hints: ['Can a ruler bend?', 'What round thing could you draw round?'], steps: ['A curved line bends smoothly.', 'Draw it freehand, or round a plate or a cup.'] };
    } }),
  yfam({ id: 'g2c.lines.curved.road', g: 2, cs: `${L}CURVED_LINES`, oc: 'c', form: 'why', rung: 2,
    gen: () => {
      const what = pick(['road', 'river', 'path', 'railway', 'footpath', 'stream', 'fence']), where = pick(['round a hill', 'past the school', 'round the market', 'beside the field']), p = person();
      const options = mc('A curved line', [
        ['A straight line', 'It goes mostly one way, but it bends. Lay a ruler on it: the line leaves the ruler, so it is curved.', 'M_CL_WAVY_STRAIGHT']]);
      return { question: `On ${p.name}'s map, the ${what} ${where} bends gently, a little at a time. What kind of line shows it?`, options, instruction: 'Choose one.',
        hints: ['Lay a ruler along it in your mind.', 'Does it bend away from the ruler?'], steps: ['The line bends smoothly away from a ruler.', 'It is curved.'] };
    } }),
];
