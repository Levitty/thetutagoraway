// ============================================================================
// GRADE 3 MATHEMATICS, the skills that had no family (19 Nov 2026): Mass (MEASUR.MASS, 4 skills).
// Written in the young kit (g23c_lib.js). Draft, off for children until a teacher signs them off.
// The beam balance and the holding-to-estimate are done in class (the map's hands-on notes);
// these ask the child to read a balance story, work with kilograms or judge an estimate, which
// the map's question forms list.
// ============================================================================
import { yfam, randInt, pick, person, twoPeople, mc, yesNo, cap } from './g23c_lib.js';

const M = 'MEASUR.MASS.';
const an = (n) => (/^[aeiou]/.test(n) ? 'an ' : 'a ') + n;

export const FAMILIES = [
  // ---------------------------------------------------------------- MEASURE_KG (outcome a)
  yfam({ id: 'g3c.mass.kg.level', g: 3, cs: `${M}MEASURE_KG`, form: 'word', rung: 1,
    gen: () => {
      const p = person(), kg = randInt(2, 6), n = randInt(3, 9), thing = pick(['potatoes', 'mangoes', 'cabbages', 'pawpaws']);
      if (n === kg || n === kg + 1) return null;
      return { question: `${p.name} has a bag of ${n} ${thing}. ${p.She} puts 1 kg masses in the other pan. With ${kg + 1} masses on, the masses' pan drops. ${p.She} takes one off and the beam is level. What is the mass of the bag in kilograms?`,
        answer: kg,
        wrong: [[kg + 1, `With ${kg + 1} masses the beam was not level: the masses' side went down, so that was too much. Read only when level.`, 'M_MASS_NOT_LEVEL'], [n, `${n} is how many ${thing} are in the bag. Count the 1 kg masses instead.`, 'M_MASS_COUNTS_PANS']],
        hints: ['When is the beam level?', 'How many 1 kg masses are on then?'],
        steps: [`${kg + 1} masses were too many. One off leaves ${kg}.`, `The beam is level with ${kg} masses, so the bag is ${kg} kg.`], chk: (v) => v === kg };
    } }),
  yfam({ id: 'g3c.mass.kg.up-side', g: 3, cs: `${M}MEASURE_KG`, form: 'direct', rung: 1,
    gen: () => {
      const kg = randInt(2, 6), it = pick(['sack of beans', 'basket of onions', 'bag of rice', 'box of books']);
      const options = mc(`The ${kg} kg of masses`, [
        [`The ${it}`, 'The pan that goes up is the lighter one. The heavy pan sinks down.', 'M_MASS_HIGH_SIDE_HEAVY'],
        [`They are the same, ${kg} kg each`, `They would be the same only if the beam were level. The beam tips, so they are not the same.`, 'M_MASS_NOT_LEVEL']]);
      return { question: `On a beam balance, the pan with the ${it} rises up. The pan with ${kg} kg of masses goes down. Which is heavier?`, options, instruction: 'Choose one.',
        hints: ['Which pan went down?', 'The heavier pan sinks.'], steps: [`The masses' pan went down.`, `So the ${kg} kg of masses is heavier than the ${it}.`] };
    } }),
  yfam({ id: 'g3c.mass.kg.big-small', g: 3, cs: `${M}MEASURE_KG`, form: 'why', rung: 2,
    gen: () => {
      const [p, q] = twoPeople(), kg = randInt(1, 3), big = pick(['big pillow', 'big bag of cotton wool', 'big bundle of dry grass']), small = pick(['small stone', 'small tin of nails', 'small bag of sand']);
      return { question: `${p.name} weighs a ${big}. It balances ${kg} kg. ${q.name} weighs a ${small}. It also balances ${kg} kg. ${p.name} says the ${big} is heavier because it is bigger. Is ${p.she} right?`,
        options: yesNo(false, `Yes, it is bigger`, `No, both are ${kg} kg`, `Size does not tell us the mass. Both balance ${kg} kg, so they have the same mass.`, 'M_MASS_BIGGER_IS_HEAVIER'), instruction: 'Choose yes or no.',
        hints: ['What did each one balance?', 'Does bigger always mean heavier?'], steps: [`Each balances ${kg} kg.`, 'So they are the same mass, though one is bigger.'] };
    } }),

  // ---------------------------------------------------------------- ADD_KG (outcome b)
  yfam({ id: 'g3c.mass.add.shopping', g: 3, cs: `${M}ADD_KG`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(15, 49), b = randInt(12, 39), p = person();
      if ((a % 10) + (b % 10) < 10 || a + b > 99) return null;
      const noCarry = (Math.floor(a / 10) + Math.floor(b / 10)) * 10 + ((a + b) % 10);
      return { question: `${p.name}'s father takes two sacks to the posho mill. One sack of maize is ${a} kg. The other is ${b} kg. What is the total mass of the two sacks in kg?`,
        answer: a + b,
        wrong: [[noCarry, `${a % 10} + ${b % 10} is more than 9. Carry the ten into the tens column.`, 'M_KADD_CARRY'], [Math.abs(a - b), 'Total means put together, so add. Taking away gives the difference.', 'M_KADD_SUBTRACTS'], [2, 'There are 2 sacks, but the question asks for kilograms. Add the masses.', 'M_KADD_COUNTS_ITEMS']],
        hints: ['Total means add.', 'Add the ones first. Do you need to carry?'],
        steps: [`${a} kg + ${b} kg.`, `Ones: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}, write ${(a + b) % 10} and carry 1 ten.`, `Total: ${a + b} kg.`], chk: (v) => v - b === a };
    } }),
  yfam({ id: 'g3c.mass.add.basket', g: 3, cs: `${M}ADD_KG`, form: 'direct', rung: 1,
    gen: () => {
      const a = randInt(3, 9), b = randInt(2, 8), [g1, g2] = pick([['potatoes', 'onions'], ['tomatoes', 'carrots'], ['beans', 'rice'], ['sugar', 'flour']]);
      if (a === b) return null;
      const options = mc(`${a + b} kg`, [
        [`${Math.abs(a - b)} kg`, 'All together means add. Taking away finds how much more one is.', 'M_KADD_SUBTRACTS'],
        ['2 kg', 'There are two things, but add their kilograms, not count them.', 'M_KADD_COUNTS_ITEMS']]);
      return { question: `A basket holds ${a} kg of ${g1} and ${b} kg of ${g2}. How heavy are they all together?`, options, instruction: 'Choose one.',
        hints: ['All together means add.', `${a} + ${b}`], steps: [`${a} kg + ${b} kg = ${a + b} kg.`, `Together they are ${a + b} kg.`] };
    } }),

  // ---------------------------------------------------------------- SUBTRACT_KG (outcome c)
  yfam({ id: 'g3c.mass.sub.heavier', g: 3, cs: `${M}SUBTRACT_KG`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(31, 59), b = randInt(12, 29), p = person();
      if (a % 10 >= b % 10 || a <= b) return null;
      const swap = (Math.floor(a / 10) - Math.floor(b / 10)) * 10 + ((b % 10) - (a % 10));
      return { question: `${p.name}'s goat has a mass of ${a} kg. ${p.Her} dog has a mass of ${b} kg. By how many kilograms is the goat heavier than the dog?`,
        answer: a - b,
        wrong: [[swap, `In the ones you cannot take ${b % 10} from ${a % 10}. Open a ten: do not take ${a % 10} from ${b % 10}.`, 'M_KSUB_SMALLER_FROM_LARGER'], [a + b, '"Heavier by" asks for the difference, so take away. Adding gives both together.', 'M_KSUB_ADDS_HEAVIER']],
        hints: ['Heavier by means find the difference.', `Take ${b} from ${a}. Do you need to open a ten?`],
        steps: [`${a} kg − ${b} kg.`, `Open a ten: ${10 + (a % 10)} − ${b % 10} = ${(a - b) % 10} in the ones.`, `The goat is ${a - b} kg heavier.`], chk: (v) => v + b === a };
    } }),
  yfam({ id: 'g3c.mass.sub.left', g: 3, cs: `${M}SUBTRACT_KG`, form: 'steps', rung: 2,
    gen: () => {
      const total = pick([20, 25, 30, 40, 50]), sold = randInt(6, 19), p = person(), good = pick(['rice', 'sugar', 'maize flour', 'beans']);
      if (total - sold <= 0 || (total % 10) >= (sold % 10)) return null;
      const swap = (Math.floor(total / 10) - Math.floor(sold / 10)) * 10 + ((sold % 10) - (total % 10));
      return { question: `Mama ${p.name} has a ${total} kg sack of ${good} in her shop. She sells ${sold} kg of it. How many kilograms of ${good} are left in the sack?`,
        answer: total - sold,
        wrong: [[sold, `${sold} kg is what was sold. The question asks what is still in the sack.`, 'M_KSUB_GIVES_USED'], [swap, `You cannot take ${sold % 10} from ${total % 10} in the ones. Open a ten first.`, 'M_KSUB_SMALLER_FROM_LARGER']],
        hints: ['Left means take away what was sold.', 'Open a ten if you need to.'],
        steps: [`${total} kg − ${sold} kg.`, `${total} − ${sold} = ${total - sold}.`, `${total - sold} kg are left.`], chk: (v) => v + sold === total };
    } }),
  yfam({ id: 'g3c.mass.sub.lighter', g: 3, cs: `${M}SUBTRACT_KG`, form: 'direct', rung: 1,
    gen: () => {
      const small = randInt(2, 6), big = small + randInt(2, 7), it = pick([['bag of carrots', 'bag of potatoes'], ['pumpkin', 'watermelon'], ['bucket of sand', 'bucket of stones']]);
      const options = mc(`${big - small} kg`, [
        ['0 kg', `Take the lighter from the heavier: ${big} take away ${small}. Do not take ${big} from ${small}.`, 'M_KSUB_ORDER'],
        [`${big + small} kg`, '"How much lighter" asks for the difference, so take away. Adding gives both together.', 'M_KSUB_ADDS_HEAVIER']]);
      return { question: `The ${it[0]} is ${small} kg. The ${it[1]} is ${big} kg. How much lighter is the ${it[0]}?`, options, instruction: 'Choose one.',
        hints: ['Which one is heavier?', 'Take the smaller mass from the bigger one.'], steps: [`${big} kg − ${small} kg = ${big - small} kg.`, `The ${it[0]} is ${big - small} kg lighter.`] };
    } }),

  // ---------------------------------------------------------------- ESTIMATE_KG (outcome d)
  yfam({ id: 'g3c.mass.est.sensible', g: 3, cs: `${M}ESTIMATE_KG`, form: 'direct', rung: 1,
    gen: () => {
      const [it, right] = pick([['a school bag full of books', 'About 3 kg'], ['a big pumpkin', 'About 4 kg'], ['a small bag of maize flour', 'About 2 kg'], ['a big empty carton', 'Less than 1 kg'], ['an empty plastic basin', 'Less than 1 kg']]);
      const light = right.startsWith('Less');
      const options = mc(right, [
        ['About 100 kg', '100 kg is heavier than a grown-up. Think of a 1 kg packet of flour in your hand.', 'M_KEST_NO_BENCHMARK'],
        light ? ['About 5 kg', `It is big, but it is empty. Big does not mean heavy.`, 'M_KEST_SIZE_GUESS'] : ['Less than 1 kg', `It is heavier than a 1 kg packet of flour. Hold both in your mind.`, 'M_KEST_MORE_LESS_SWAP']]);
      return { question: `Which is a sensible estimate for the mass of ${it}?`, options, instruction: 'Choose one.',
        hints: ['Think of holding a 1 kg packet of flour.', 'Is it lighter or heavier than that? How many packets?'], steps: ['Compare it with a 1 kg packet.', `${right} is sensible.`] };
    } }),
  yfam({ id: 'g3c.mass.est.five', g: 3, cs: `${M}ESTIMATE_KG`, form: 'why', rung: 1,
    gen: () => {
      const heavy = Math.random() < 0.5;
      const it = heavy ? pick(['a full 20 litre jerrycan of water', 'a 10 kg sack of maize', 'a grown-up goat', 'a 25 kg bag of cement']) : pick(['a pencil', 'an exercise book', 'an orange', 'a pair of shoes', 'a cup']);
      const right = heavy ? 'More than 5 kg' : 'Less than 5 kg', wrong = heavy ? 'Less than 5 kg' : 'More than 5 kg';
      const options = mc(right, [[wrong, heavy ? 'It is much heavier than five 1 kg packets of flour, so it is more than 5 kg.' : 'It is lighter than five 1 kg packets of flour, so it is less than 5 kg.', 'M_KEST_MORE_LESS_SWAP']], true);
      return { question: `Is ${it} more or less than 5 kg?`, options, instruction: 'Choose one.',
        hints: ['Think of five 1 kg packets of flour together.', 'Is it lighter or heavier than those?'], steps: ['Five 1 kg packets of flour are 5 kg.', `${cap(it)} is ${heavy ? 'heavier' : 'lighter'}, so it is ${right.toLowerCase()}.`] };
    } }),
  yfam({ id: 'g3c.mass.est.close', g: 3, cs: `${M}ESTIMATE_KG`, form: 'word', rung: 2,
    gen: () => {
      const p = person(), meas = randInt(2, 5), est = meas + pick([-1, 1]), it = pick(['bag of oranges', 'basket of tomatoes', 'school bag', 'bunch of bananas']);
      if (est < 1 || est > 5) return null;
      return { question: `${p.name} holds a ${it} and estimates it is ${est} kg. On the beam balance it is ${meas} kg. Was ${est} kg a good estimate?`,
        options: yesNo(true, 'Yes, it was close', 'No, it was not exact', `An estimate does not have to be exact. ${est} kg is only 1 kg away from ${meas} kg, which is close.`, 'M_KEST_MUST_BE_EXACT'), instruction: 'Choose yes or no.',
        hints: ['Does an estimate have to be exactly right?', `How far is ${est} from ${meas}?`], steps: [`${est} kg and ${meas} kg are 1 kg apart.`, 'That is close, so it was a good estimate.'] };
    } }),
];
