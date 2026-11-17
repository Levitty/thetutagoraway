// ============================================================================
// GRADE 5 MATHEMATICS, NUMBERS: SIMPLE EQUATIONS (7 skills). Whole numbers, one letter.
// ============================================================================
import { fam, randInt, pick, shuffle, commas, person, sh, mc, tbl, farFrom, price } from './g5c_lib.js';

const Q = 'NUMBER.SIMPLE_EQUATIONS.';
const LETTERS = ['n', 'p', 'x', 'm', 'a', 'b'];
const SHOP = ['mandazi', 'exercise books', 'pencils', 'bananas', 'eggs'];
const ONE_OF = { mandazi: ['mandazi', 'mandazi'], 'exercise book': ['exercise book', 'exercise books'], pencil: ['pencil', 'pencils'], banana: ['banana', 'bananas'], egg: ['egg', 'eggs'] };
const L = () => pick(LETTERS);
// Numbers for ax + b = c where every wrong route gives a whole number, so no distractor looks odd:
// dividing first (b a multiple of a), and joining ax + b into (a + b)x (a + b divides c).
const twoStep = () => {
  for (let i = 0; i < 4000; i++) {
    const k = randInt(2, 6), x = randInt(5, 30), b = randInt(5, 30), c = k * x + b;
    if (c % k === 0 && c % (k + b) === 0 && c / k - b > 0 && c / (k + b) !== x && c / k - b !== x && x > 1) return { k, x, b, c };
  }
  return null;
};

export const FAMILIES = [
  // ---------------------------------------------------------------- EQ_MEANING
  fam({ id: 'g5c.eq.mean.pick', cs: `${Q}EQ_MEANING`, form: 'direct', rung: 1,
    gen: () => {
      const l = L(), a = randInt(6, 30), b = a + randInt(8, 40), p = person(), thing = pick(['mandazi', 'eggs', 'mangoes', 'exercise books']);
      const options = mc(`${l} + ${a} = ${b}`, [[`${l} + ${a}`, 'This has no equals sign, so it does not say two things have the same value. It is an expression, not an equation.', 'M_EXPRESSION_IS_EQUATION'], [`${b}`, 'A single number says nothing is equal to anything. An equation needs an equals sign with something on each side.', 'M_NUMBER_IS_EQUATION'], [`${l} + ${a} =`, 'There is an equals sign but nothing after it, so it is waiting for an answer. An equation has something on both sides.', 'M_EQUALS_MEANS_ANSWER']]);
      return { question: `${p.name} had some ${thing}. ${p.She} was given ${a} more and now has ${b}. Let ${l} be the number ${p.she} had at first. Which of these is an equation for this story?`, options, instruction: 'Choose the equation.',
        hints: ['An equation says two things have the same value.', 'Look for an equals sign with something on each side.'], steps: [`${l} + ${a} = ${b} has an equals sign with a side on each side: what ${p.she} had plus ${a} is the same as ${b}.`, 'The others are an expression, a single number and a sum with nothing after the equals sign.'] };
    } }),
  fam({ id: 'g5c.eq.mean.balance', cs: `${Q}EQ_MEANING`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(5, 15), b = randInt(2, 9), c = randInt(3, 9), box = a + b - c;
      if (box <= 0) return null;
      return { question: `A balance scale has ${a} + ${b} on one side and □ + ${c} on the other side, and it balances. What number goes in the box?`, answer: box,
        wrong: [[a + b, 'The sign = means both sides have the same value, not "write the answer now". The box is not the whole sum.', 'M_EQUALS_MEANS_ANSWER'], [a + b + c, 'Both sides must be equal. Take the ' + c + ' away from the total, do not add it.', 'SLIP'], [a + c, 'That adds the ' + a + ' to the ' + c + ' beside the box. Work out the left side first, then find what goes with the ' + c + '.', 'SLIP'], [box + 1, 'One too many. Put your number in the box: it plus ' + c + ' must make ' + (a + b) + '.', 'SLIP']],
        hints: ['The sides of a balance are equal.', `First work out the left side. What added to ${c} makes it?`], steps: [`${a} + ${b} = ${a + b}.`, `□ + ${c} = ${a + b}, so □ = ${box}.`], chk: (v) => v + c === a + b };
    } }),
  fam({ id: 'g5c.eq.mean.letter', cs: `${Q}EQ_MEANING`, form: 'why', rung: 2,
    gen: () => {
      const l = pick(['p', 'n', 'c']), one = pick(Object.keys(ONE_OF)), sw = pick([5, 10]), cost = price(one), q = cost + sw, p = person();
      const options = mc(`The cost of one ${one}, in shillings`, [[`The ${one} itself, the actual thing`, 'A letter in an equation stands for a number, not for the thing you buy.', 'M_LETTER_AS_OBJECT'], [`The total, sh ${q}`, `The ${q} is already written in the equation. The letter stands for the number we have not found yet.`, 'M_LETTER_IS_GIVEN_NUMBER'], [`Any number we like, and it can change`, `In this equation the letter is one number only. Only ${cost} keeps both sides equal.`, 'M_LETTER_ANY_NUMBER']]);
      return { question: `${p.name} bought one ${one} and a sweet. ${p.She} paid sh ${q} in all, and the sweet cost sh ${sw}. ${p.She} writes ${l} + ${sw} = ${q}. What does ${l} stand for?`, options, instruction: 'Choose what the letter stands for.',
        hints: ['Is the letter an object or a number?', 'Which number in the story do we not know yet?'], steps: ['A letter stands for an unknown number.', `Here it is the number of shillings the ${one} cost.`] };
    } }),

  // ---------------------------------------------------------------- EQ_FORM_ADD_SUB
  fam({ id: 'g5c.eq.fadd.spent', cs: `${Q}EQ_FORM_ADD_SUB`, form: 'direct', rung: 2,
    gen: () => {
      const l = L(), a = randInt(2, 9) * 10, b = randInt(10, 40) * 10, c = b - a, p = person();
      if (c <= 0) return null;
      const right = `${l} − ${a} = ${c}`;
      const options = mc(right, [[`${a} − ${l} = ${c}`, `This takes the amount ${p.she} had away from ${a}. ${p.She} started with ${l} and then spent ${a}, so ${l} comes first.`, 'M_SUBTRACTION_ORDER_REVERSED'], [`${l} = ${b}`, 'This is only an answer, and it is not the right one. The question asks for an equation that shows what happened: start, spend, left.', 'M_WRITES_ANSWER_NOT_EQUATION'], [`${l} + ${a} = ${c}`, `${p.She} spent money, so ${p.her} money went down. A plus sign would mean ${p.she} was given more.`, 'M_OPERATION_OPPOSITE_TO_STORY']]);
      return { question: `${p.name} had some shillings. ${p.She} spent sh ${a} on bus fares and was left with sh ${c}. Let ${l} be the number of shillings ${p.she} had. Which equation fits?`, options, instruction: 'Choose the equation.',
        hints: ['What did she start with? What happened next?', 'Write the start first, then take away what she spent.'], steps: [`Start ${l}, spent ${a}, left ${c}.`, `${l} − ${a} = ${c}.`] };
    } }),
  fam({ id: 'g5c.eq.fadd.more', cs: `${Q}EQ_FORM_ADD_SUB`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(3, 9), b = randInt(15, 30), l = pick(['a', 'e']), [p, q] = [person(), person()], thing = pick(['eggs', 'mangoes', 'exercise books', 'bananas']);
      if (p.name === q.name) return null;
      const options = mc(`${l} + ${a} = ${b}`, [[`${b} + ${a} = ${l}`, `${p.name} has more than ${q.name}, so ${q.name} has fewer. Adding ${a} to ${b} gives a number bigger than ${p.name}'s.`, 'M_KEYWORD_MORE_MEANS_ADD'], [`${l} − ${a} = ${b}`, `This says ${q.name} has ${b} after giving up ${a}, which makes ${q.name} the one with more. It is the wrong way round.`, 'M_OPERATION_OPPOSITE_TO_STORY'], [`${l} = ${b} − ${a}`, `This already works out the answer. The question asks for an equation that shows the story: ${q.name}'s ${thing} plus ${a} make ${p.name}'s.`, 'M_WRITES_ANSWER_NOT_EQUATION']]);
      return { question: `${p.name} has ${b} ${thing}. That is ${a} more than ${q.name} has. Let ${l} be the number of ${thing} ${q.name} has. Which equation shows this?`, options, instruction: 'Choose the equation.',
        hints: ['Draw two bars: one for each child.', `Which child has fewer? What must be added to that child's ${thing} to match the other?`], steps: [`${q.name}'s ${thing} plus ${a} more make ${p.name}'s ${b}.`, `${l} + ${a} = ${b}.`] };
    } }),
  fam({ id: 'g5c.eq.fadd.spot', cs: `${Q}EQ_FORM_ADD_SUB`, form: 'spot', rung: 3,
    gen: () => {
      const l = pick(['p', 'n']), a = randInt(5, 15), t = a + randInt(8, 30), p = person();
      return { question: `A matatu had some passengers. At Kisumu ${a} more got in, making ${t}. Let ${l} be the number at first. ${p.name} forms the equation. Which step has the mistake?`,
        working: [{ text: `Step 1: Start with ${l} passengers.`, ok: true }, { text: `Step 2: ${a} got in, so add ${a}.`, ok: true }, { text: `Step 3: Write ${l} = ${t - a}.`, ok: false }],
        fix: `The question asks to form an equation, not to solve it. The equation is ${l} + ${a} = ${t}.`, mis: 'M_WRITES_ANSWER_NOT_EQUATION', hints: ['Is this an equation that shows the story?'], steps: [`${l} + ${a} = ${t}.`] };
    } }),

  // ---------------------------------------------------------------- EQ_FORM_MUL_DIV
  fam({ id: 'g5c.eq.fmul.times', cs: `${Q}EQ_FORM_MUL_DIV`, form: 'direct', rung: 2,
    gen: () => {
      const k = randInt(3, 6), c = randInt(3, 9), g = k * c, p = person(), [big, small] = pick([['goats', 'cows'], ['hens', 'ducks'], ['sheep', 'goats']]), l = L();
      if (big === 'goats' && small === 'goats') return null;
      const options = mc(`${k}${l} = ${g}`, [[`${l} = ${k} × ${g}`, `${p.name} has more ${big} than ${small}, so the ${big} are the bigger number: ${big} = ${k} × ${small}. This makes the ${small} the bigger number.`, 'M_TIMES_AS_MANY_REVERSED'], [`${l} = ${g} ÷ ${k}`, `This already works out the answer. The question asks for an equation that shows the story: ${k} times the ${small} is the ${big}.`, 'M_WRITES_ANSWER_NOT_EQUATION'], [`${k} + ${l} = ${g}`, `Times as many means multiply. ${k} times as many is ${k} × ${l}, not ${k} + ${l}.`, 'M_REPEATED_COST_AS_ADD']]);
      return { question: `${p.name} keeps ${k} times as many ${big} as ${small}. ${p.She} has ${g} ${big}. Let ${l} be the number of ${small}. Which equation fits?`, options, instruction: 'Choose the equation.',
        hints: [`Which is more, the ${small} or the ${big}?`, `The ${big} are the ${small} times ${k}.`], steps: [`${big} = ${k} × ${small}, so ${k}${l} = ${g}.`, `${l} = ${c}.`] };
    } }),
  fam({ id: 'g5c.eq.fmul.share', cs: `${Q}EQ_FORM_MUL_DIV`, form: 'why', rung: 2,
    gen: () => {
      const k = randInt(3, 6), each = randInt(4, 9), p = person();
      const options = mc(`x ÷ ${k} = ${each}`, [[`${k} ÷ x = ${each}`, 'The oranges that are shared come first in a division. The number of oranges is the unknown x.', 'M_SHARING_ORDER_REVERSED'], [`x × ${k} = ${each}`, `Sharing among ${k} children cuts x into ${k} parts. Multiplying would make it bigger, not shared out.`, 'M_OPERATION_OPPOSITE_TO_STORY'], [`x = ${each} × ${k}`, 'This already works out the answer. The question asks for an equation that shows the story: x shared among the children gives each one their share.', 'M_WRITES_ANSWER_NOT_EQUATION']]);
      return { question: `${p.name} bought x oranges and shared them equally among ${k} children. Each child got ${each}. Which equation fits the story?`, options, instruction: 'Choose the equation.',
        hints: ['Which number is shared out: the oranges or the children?', 'The thing shared goes first in a division.'], steps: [`x oranges shared among ${k}: x ÷ ${k}.`, `Each gets ${each}: x ÷ ${k} = ${each}.`] };
    } }),
  fam({ id: 'g5c.eq.fmul.cost', cs: `${Q}EQ_FORM_MUL_DIV`, form: 'word', rung: 2,
    gen: () => {
      const k = randInt(3, 8), one = pick(Object.keys(ONE_OF)), b = price(one), t = k * b, item = ONE_OF[one][1];
      if (!farFrom(b, t - k, t * k, t - 10 * k)) return null;
      return { question: `${k} ${item} are bought, all at the same price, and the seller is paid sh ${t} in all. Let b be the cost of one in shillings, so ${k}b = ${t}. How many shillings does one cost?`, answer: b,
        wrong: [[t - k, `${k}b means ${k} × b, not ${k} + b. Taking ${k} away from ${t} treats it as an addition.`, 'M_REPEATED_COST_AS_ADD'], [t * k, `One cannot cost more than all ${k} together. Multiplying makes it bigger. Divide to undo the multiplying.`, 'M_MULTIPLIES_FOR_AX'], [t - 10 * k, `${k}b is ${k} × b, not ${k} tens and b. Do not read it as a number like ${k}0 + b.`, 'M_3X_AS_TWO_DIGIT_NUMBER'], [b + 1, `One too many. Multiply your answer by ${k} to see if it gives ${t}.`, 'SLIP']],
        hints: [`${k}b means ${k} groups of b.`, 'Divide the total by the number of items.'], steps: [`${k} × b = ${t}.`, `b = ${t} ÷ ${k} = ${b}.`], chk: (v) => v * k === t };
    } }),

  // ---------------------------------------------------------------- EQ_SOLVE_ADD_SUB
  fam({ id: 'g5c.eq.sadd.plus', cs: `${Q}EQ_SOLVE_ADD_SUB`, form: 'word', rung: 1,
    gen: () => {
      const l = L(), a = randInt(10, 90), b = a + randInt(10, 90), p = person(), r = b - a;
      return { question: `${p.name} had some shillings. After an aunt gave ${p.herObj} sh ${a}, ${p.she} had sh ${b}. Solve ${l} + ${a} = ${b}. How many shillings did ${p.name} have at first?`, answer: r,
        wrong: [[b + a, `You added the two numbers. Undo the plus: take ${a} away from both sides.`, 'M_SAME_OPERATION_NOT_INVERSE'], [b, `That is how much ${p.she} has now, after the gift. What ${p.she} had at first is less.`, 'M_EQUALS_MEANS_ANSWER'], [r - 10, 'Ten too small. Look at your tens when you take away, and check whether you borrowed correctly.', 'SLIP'], [r + 1, `One too many. Add ${a} to your answer to see if it makes ${b}.`, 'SLIP']],
        hints: ['Take the same number from both sides.', 'Check by putting the answer back in.'], steps: [`${l} + ${a} = ${b}.`, `${l} = ${b} − ${a} = ${r}.`], chk: (v) => v + a === b };
    } }),
  fam({ id: 'g5c.eq.sadd.minus', cs: `${Q}EQ_SOLVE_ADD_SUB`, form: 'direct', rung: 2,
    gen: () => {
      const l = L(), a = randInt(10, 60), b = randInt(10, 60), t = a + b, up = Math.random() < 0.5, p = person();
      const val = up ? t : a, other = up ? Math.abs(a - b) : t + b;
      if (!farFrom(val, other, b)) return null;
      const options = mc(String(val), [[String(other), up ? `${l} − ${a} = ${b} means ${l} is more than ${b}, because ${a} was taken away. Taking the smaller number from the bigger one cannot give it. Add ${a} to both sides.` : `${t} − ${l} = ${b} means ${l} is less than ${t}. Adding ${b} to ${t} makes it bigger.`, up ? 'M_SUBTRACTS_FOR_X_MINUS' : 'M_UNKNOWN_SUBTRACTED_TREATED_AS_X_MINUS'], [String(b), `That is the amount left over at the end. The answer is not the number after the equals sign.`, 'M_EQUALS_MEANS_ANSWER'], [String(val + 10), 'Ten too many. Check the tens when you add or take away, and see if you carried correctly.', 'SLIP']]);
      if (!options) return null;
      return { question: up ? `${p.name} had some shillings. ${p.She} spent sh ${a} and was left with sh ${b}. Solve ${l} − ${a} = ${b}. How much did ${p.she} have at first?` : `${p.name} had sh ${t}. ${p.She} spent some on a book and was left with sh ${b}. Solve ${t} − ${l} = ${b}. How much did the book cost?`, options, instruction: 'Choose the value.',
        hints: [up ? `Read it as: I had some, spent ${a}, and have ${b} left.` : `Read it as: from ${t}, what do I take away to leave ${b}?`, 'Check by putting your answer back.'], steps: [up ? `${l} = ${b} + ${a} = ${val}.` : `${l} = ${t} − ${b} = ${val}.`, 'Check by substitution.'] };
    } }),
  fam({ id: 'g5c.eq.sadd.spot', cs: `${Q}EQ_SOLVE_ADD_SUB`, form: 'spot', rung: 3,
    gen: () => {
      const l = L(), a = randInt(10, 40), b = randInt(10, 40), p = person();
      return { question: `${p.name} solves ${l} − ${a} = ${b}. Which step has the mistake?`,
        working: [{ text: `Step 1: ${l} − ${a} = ${b}.`, ok: true }, { text: `Step 2: Take the smaller number from the larger: ${Math.max(a, b)} − ${Math.min(a, b)} = ${Math.abs(a - b)}.`, ok: false }, { text: `Step 3: ${l} = ${Math.abs(a - b)}.`, ok: true }],
        fix: `${l} is bigger than ${b}. Add ${a} to both sides: ${l} = ${b} + ${a} = ${a + b}.`, mis: 'M_SUBTRACTS_FOR_X_MINUS', hints: ['Check by putting your answer into the equation.'], steps: [`${l} = ${a + b}.`] };
    } }),

  // ---------------------------------------------------------------- EQ_SOLVE_MUL_DIV
  fam({ id: 'g5c.eq.smul.groups', cs: `${Q}EQ_SOLVE_MUL_DIV`, form: 'word', rung: 1,
    gen: () => {
      const k = randInt(3, 9), x = randInt(11, 25), t = k * x, l = L(), p = person();
      if (!farFrom(x, t * k, t - k, t - 10 * k)) return null;
      return { question: `${p.name} shares bottle tops equally into ${k} bags for a game. There are ${t} bottle tops in all. Solve ${k}${l} = ${t}, where ${l} is the number in each bag (${k}${l} means ${k} × ${l}). What is ${l}?`, answer: x,
        wrong: [[t * k, `${k}${l} means ${k} groups of ${l}. Multiplying makes a number far bigger than ${t}. Divide to undo it.`, 'M_MULTIPLIES_FOR_AX'], [t - k, `${k}${l} is ${k} × ${l}, not ${k} + ${l}. Taking ${k} away from ${t} treats it as an addition.`, 'M_REPEATED_COST_AS_ADD'], [t - 10 * k, `${k}${l} does not mean ${k}0 + ${l}. It means ${k} × ${l}.`, 'M_3X_AS_TWO_DIGIT_NUMBER'], [x + 1, `One too many. Multiply your answer by ${k} to see if it makes ${t}.`, 'SLIP']],
        hints: [`${k} groups of what make ${t}?`, `Divide both sides by ${k}.`], steps: [`${k} × ${l} = ${t}.`, `${l} = ${t} ÷ ${k} = ${x}.`], chk: (v) => v * k === t };
    } }),
  fam({ id: 'g5c.eq.smul.divide', cs: `${Q}EQ_SOLVE_MUL_DIV`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(3, 9), b = randInt(5, 12), x = a * b, l = L(), p = person();
      const options = mc(String(x), [[String(b - a), `${l} ÷ ${a} = ${b} means ${l} shared among ${a} gives ${b}. Taking ${a} away from ${b} does not undo a sharing. Multiply instead.`, 'M_DIVIDES_FOR_X_DIV'], [String(b), `That is how many each child gets. The question asks how many sweets there were in all, before sharing.`, 'M_EQUALS_MEANS_ANSWER'], [String(x + 1), `One too many. Divide your answer by ${a} to see if each child gets ${b}.`, 'SLIP']]);
      if (!options || b - a <= 0) return null;
      return { question: `${p.name} shares a bag of sweets equally among ${a} children and each gets ${b}. Solve ${l} ÷ ${a} = ${b}. How many sweets were in the bag?`, options, instruction: 'Choose the value.',
        hints: [`${l} was shared among ${a} and each got ${b}.`, 'Multiply to find the total.'], steps: [`${l} = ${b} × ${a} = ${x}.`, `Check: ${x} ÷ ${a} = ${b}.`] };
    } }),
  fam({ id: 'g5c.eq.smul.spot', cs: `${Q}EQ_SOLVE_MUL_DIV`, form: 'spot', rung: 3,
    gen: () => {
      const k = randInt(3, 9), x = randInt(4, 15), t = k * x, l = L(), p = person();
      return { question: `${p.name} solves ${k}${l} = ${t}. Which step has the mistake?`,
        working: [{ text: `Step 1: ${k}${l} = ${t} means ${k} times ${l} is ${t}.`, ok: true }, { text: `Step 2: To find ${l}, multiply ${t} by ${k}.`, ok: false }, { text: `Step 3: ${l} = ${t * k}.`, ok: true }],
        fix: `Undo multiplying by dividing: ${l} = ${t} ÷ ${k} = ${x}.`, mis: 'M_MULTIPLIES_FOR_AX', hints: ['Is ' + k + ' times your answer equal to ' + t + '?'], steps: [`${l} = ${x}.`] };
    } }),

  // ---------------------------------------------------------------- EQ_SOLVE_IN_CONTEXT
  fam({ id: 'g5c.eq.ctx.sukuma', cs: `${Q}EQ_SOLVE_IN_CONTEXT`, form: 'word', rung: 2,
    gen: () => {
      const k = randInt(3, 8), s = randInt(2, 10) * 5, t = k * s;
      return { question: `${k} bunches of sukuma wiki cost sh ${t}. Let s be the cost of one bunch in shillings. Form the equation ${k}s = ${t} and solve it. How much does one bunch cost?`, answer: s,
        wrong: [[t * k, `One bunch costs less than all ${k} together. Multiplying gives far too much. Divide.`, 'M_NO_REASONABLENESS_CHECK'], [t - k, `${k}s means ${k} × s, not ${k} + s. Taking ${k} away from ${t} treats it as an addition.`, 'M_REPEATED_COST_AS_ADD'], [t + k, `Adding ${k} to ${t} just follows the word "cost" and uses the two numbers in the order they come. Think what the story is saying: ${k} bunches at the same price make ${t}.`, 'M_NUMBERS_IN_STORY_ORDER'], [s + 1, `One too many. Multiply your answer by ${k} to see if it makes ${t}.`, 'SLIP']],
        hints: ['Does one bunch cost more or less than all the bunches?', 'Divide the total by the number of bunches.'], steps: [`${k}s = ${t}, so s = ${t} ÷ ${k} = ${s}.`, `One bunch costs sh ${s}.`], chk: (v) => v * k === t };
    } }),
  fam({ id: 'g5c.eq.ctx.matatu', cs: `${Q}EQ_SOLVE_IN_CONTEXT`, form: 'steps', rung: 3,
    gen: () => {
      const off = randInt(5, 14), left = randInt(8, 30), p0 = off + left;
      const w1 = [[Math.abs(left - off) || 1, `Some got off, so there were more passengers at first, not fewer. Take ${off} from p to get ${left}, so p is bigger than ${left}. Add them.`, 'M_SUBTRACTS_FOR_X_MINUS'], [left, `That is how many are still on the matatu after the others got off. We want the number at first.`, 'M_EQUALS_MEANS_ANSWER'], [p0 + 1, `One too many. Take ${off} off your answer to see if ${left} are left.`, 'SLIP']];
      return { question: `A matatu had some passengers. At Kisumu ${off} got off and ${left} remained. Let p be the number of passengers at first.`,
        parts: [{ prompt: 'Which number is p? Write the number of passengers at first.', answer: p0, hint: `p − ${off} = ${left}.`, wrong: w1 },
          { prompt: `Check: how many passengers remain after ${off} get off, if p is your answer?`, answer: left, hint: `Take ${off} from your answer.`, wrong: [[p0 + off, `${off} got off, so the number goes down. Taking ${off} away is subtraction, not addition.`, 'M_OPERATION_OPPOSITE_TO_STORY'], [p0, `That is the number at the start. Take away the ${off} who got off.`, 'M_NO_REASONABLENESS_CHECK']] }],
        steps: [`p − ${off} = ${left}, so p = ${left} + ${off} = ${p0}.`, `Check: ${p0} − ${off} = ${left}.`], chk: (x, v) => v[0] - off === left && v[1] === left };
    } }),
  fam({ id: 'g5c.eq.ctx.sense', cs: `${Q}EQ_SOLVE_IN_CONTEXT`, form: 'why', rung: 3,
    gen: () => {
      const k = randInt(3, 8), s = randInt(2, 10) * 5, t = k * s, wrong = t * k, p = person();
      const options = mc(`No. One bunch costs less than all ${k} together.`, [[`Yes. Multiplying the total by ${k} is how to find the cost of one bunch.`, `Multiplying makes the answer bigger than ${t}. To find one share of ${t}, divide it into ${k} equal parts.`, 'M_MULTIPLIES_FOR_AX'], [`Yes. A whole number is always a sensible answer.`, 'A whole number is not enough. The answer must make sense in the story, and one bunch cannot cost more than all of them.', 'M_NO_REASONABLENESS_CHECK'], [`No. It should be ${t} + ${k} = ${t + k}.`, `Adding the two numbers does not fit the story. ${k} bunches at one price make ${t}, so share ${t} into ${k} equal parts.`, 'M_NUMBERS_IN_STORY_ORDER']]);
      return { question: `${k} bunches of sukuma wiki cost sh ${t}. ${p.name} says one bunch costs sh ${wrong}. Is the answer sensible?`, options, instruction: 'Choose the best answer.',
        hints: ['Does one bunch cost more or less than all the bunches?', 'Check by multiplying the answer by the number of bunches.'], steps: [`${k} bunches cost sh ${t}, so one costs ${t} ÷ ${k} = ${s}.`, `sh ${wrong} is far too big.`] };
    } }),

  // ---------------------------------------------------------------- EQ_TWO_STEP
  fam({ id: 'g5c.eq.two.pens', cs: `${Q}EQ_TWO_STEP`, form: 'word', rung: 3,
    gen: () => {
      const D = twoStep(); if (!D) return null;
      const { k, x, b, c } = D, p = person();
      if (!farFrom(x, c / k - b, c / (k + b), c - b)) return null;
      return { question: `${p.name} buys ${k} pens at sh p each and a sweet for sh ${b}. The total is sh ${c}. The equation is ${k}p + ${b} = ${c}. How much does one pen cost?`, answer: x,
        wrong: [[c / k - b, 'You divided the whole total by the number of pens first, then took the sweet away. Undo the plus first: take the sweet off the total, then share.', 'M_UNDOES_IN_WRONG_ORDER'], [c / (k + b), `You joined ${k}p and ${b} into one ${k + b}p. The pens and the sweet are different kinds of thing, so they cannot be joined.`, 'M_COMBINES_UNLIKE_TERMS'], [c - b, `That is the cost of all ${k} pens together. You still have to share it among the pens. A pen cannot cost that much.`, 'M_NO_REASONABLENESS_CHECK'], [x + 1, `One too many. Put your answer in: ${k} × it + ${b} should make ${c}.`, 'SLIP']],
        hints: [`Take the sh ${b} for the sweet off both sides first.`, 'Then share what is left among the pens.'], steps: [`${k}p = ${c} − ${b} = ${c - b}.`, `p = ${c - b} ÷ ${k} = ${x}.`], chk: (v) => k * v + b === c };
    } }),
  fam({ id: 'g5c.eq.two.order', cs: `${Q}EQ_TWO_STEP`, form: 'direct', rung: 3,
    gen: () => {
      const D = twoStep(); if (!D) return null;
      const { k, x, b, c } = D, p = person();
      if (!farFrom(x, c / k - b, c / (k + b), c - b)) return null;
      const options = mc(String(x), [[String(c / k - b), 'You divided the whole total first, then took the added number away. Undo the plus first, then divide.', 'M_UNDOES_IN_WRONG_ORDER'], [String(c / (k + b)), `You joined ${k}x and ${b} into one ${k + b}x. Letters and plain numbers are different kinds of thing, so they cannot be joined.`, 'M_COMBINES_UNLIKE_TERMS'], [String(c - b), `That is the value of ${k}x, not x. One more step is needed: divide by ${k}.`, 'M_NO_REASONABLENESS_CHECK']]);
      if (!options) return null;
      return { question: `${p.name} is working out how many sweets x are in each packet. ${p.She} has ${k} packets and ${b} loose sweets, ${c} sweets in all, so ${k}x + ${b} = ${c}. Which value of x is right?`, options, instruction: 'Choose the value.',
        hints: [`First take ${b} from both sides.`, `Then divide both sides by ${k}.`], steps: [`${k}x = ${c} − ${b} = ${c - b}.`, `x = ${c - b} ÷ ${k} = ${x}.`] };
    } }),
  fam({ id: 'g5c.eq.two.spot', cs: `${Q}EQ_TWO_STEP`, form: 'spot', rung: 3,
    gen: () => {
      const k = randInt(2, 6), x = randInt(4, 15), b = randInt(5, 30), c = k * x + b, p = person();
      if (c % k !== 0) return null;
      return { question: `${p.name} solves ${k}x + ${b} = ${c}. Which step has the mistake?`,
        working: [{ text: `Step 1: Divide both sides by ${k} first: x + ${b} ÷ ${k} = ${c / k}.`, ok: false }, { text: `Step 2: Take ${b} from ${c / k}: x = ${c / k - b}.`, ok: true }, { text: `Step 3: x = ${c / k - b}.`, ok: true }],
        fix: `Undo the addition first: ${k}x = ${c - b}, then divide: x = ${x}.`, mis: 'M_UNDOES_IN_WRONG_ORDER', hints: ['Check by putting your answer into the equation.'], steps: [`x = ${x}.`] };
    } }),
];
