// ============================================================================
// GRADE 5 MATHEMATICS, NUMBERS: SIMPLE EQUATIONS (7 skills). Whole numbers, one letter.
// ============================================================================
import { fam, randInt, pick, shuffle, commas, person, sh, mc, tbl } from './g5c_lib.js';

const Q = 'NUMBER.SIMPLE_EQUATIONS.';
const LETTERS = ['n', 'p', 'x', 'm', 'a', 'b'];
const SHOP = ['mandazi', 'exercise books', 'pencils', 'bananas', 'eggs'];
const L = () => pick(LETTERS);

export const FAMILIES = [
  // ---------------------------------------------------------------- EQ_MEANING
  fam({ id: 'g5c.eq.mean.pick', cs: `${Q}EQ_MEANING`, form: 'direct', rung: 1,
    gen: () => {
      const l = L(), a = randInt(3, 20), b = a + randInt(3, 40);
      const options = mc(`${l} + ${a} = ${b}`, [[`${l} + ${a}`, 'This has no equals sign, so it does not say two things are equal. It is an expression.', 'M_EXPRESSION_IS_EQUATION'], [`${b}`, 'A single number is not an equation. An equation has an equals sign with a side on each side.', 'M_EXPRESSION_IS_EQUATION'], [`${l} + ${a} + ${b}`, 'This is an expression with no equals sign.', 'M_EXPRESSION_IS_EQUATION']]);
      return { question: `${person().name} writes four lines on the board. Which of these is an equation?`, options, instruction: 'Choose the equation.',
        hints: ['An equation says two things have the same value.', 'Look for an equals sign with something on each side.'], steps: [`${l} + ${a} = ${b} has an equals sign with a side on each side.`, 'The others are expressions.'] };
    } }),
  fam({ id: 'g5c.eq.mean.balance', cs: `${Q}EQ_MEANING`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(5, 15), b = randInt(2, 9), c = randInt(2, 9), box = a + b - c;
      if (box <= 0) return null;
      return { question: `A balance scale has ${a} + ${b} on one side and □ + ${c} on the other side, and it balances. What number goes in the box?`, answer: box,
        wrong: [[a + b, 'The sign = means both sides have the same value, not "write the answer now". The box is not the whole sum.', 'M_EQUALS_MEANS_ANSWER'], [a + b + c, 'Both sides must be equal. Take the ' + c + ' away from the total, do not add it.', 'M_EQUALS_MEANS_ANSWER'], [a + c, 'Check that both sides are equal.', 'M_EQUALS_MEANS_ANSWER'], [box + 1, 'Check that both sides are the same.', 'M_EQUALS_MEANS_ANSWER']],
        hints: ['The sides of a balance are equal.', `First work out the left side. What added to ${c} makes it?`], steps: [`${a} + ${b} = ${a + b}.`, `□ + ${c} = ${a + b}, so □ = ${box}.`], chk: (v) => v + c === a + b };
    } }),
  fam({ id: 'g5c.eq.mean.letter', cs: `${Q}EQ_MEANING`, form: 'why', rung: 2,
    gen: () => {
      const l = pick(['p', 'n', 'c']), item = pick(SHOP);
      const options = mc(`The cost of one, in shillings`, [[`The ${item.replace(/s$/, '')} itself, the actual thing`, 'A letter in an equation stands for a number, not an object.', 'M_LETTER_AS_OBJECT'], [`The name of the shop it comes from`, 'A letter stands for an unknown number.', 'M_LETTER_AS_OBJECT'], [`Any word the writer chooses`, 'A letter stands for an unknown number, such as a cost or a count.', 'M_LETTER_AS_OBJECT']]);
      return { question: `Let ${l} be the cost of one of ${person().name}'s ${item} in shillings. In the equation ${l} + 5 = 25, what does ${l} stand for?`, options, instruction: 'Choose what the letter stands for.',
        hints: ['Is the letter an object or a number?', 'Say the full meaning: let ' + l + ' be the number of shillings.'], steps: ['A letter stands for an unknown number.', 'Here it is the number of shillings one costs.'] };
    } }),

  // ---------------------------------------------------------------- EQ_FORM_ADD_SUB
  fam({ id: 'g5c.eq.fadd.spent', cs: `${Q}EQ_FORM_ADD_SUB`, form: 'direct', rung: 2,
    gen: () => {
      const l = L(), a = randInt(20, 90) * 10 / 10, b = randInt(100, 400), c = b - a, p = person();
      if (c <= 0) return null;
      const right = `${l} − ${a} = ${c}`;
      const options = mc(right, [[`${a} − ${l} = ${c}`, 'Write the subtraction in the order of the story: start with what she had, then take away.', 'M_SUBTRACTION_ORDER_REVERSED'], [`${l} = ${c}`, 'This gives only an answer. An equation shows the story.', 'M_WRITES_ANSWER_NOT_EQUATION'], [`${l} + ${a} = ${c}`, 'She spent money, so the amount went down.', 'M_SUBTRACTION_ORDER_REVERSED']]);
      return { question: `${p.name} had some shillings. ${p.She} spent sh ${a} on bus fares and was left with sh ${c}. Let ${l} be the number of shillings ${p.she} had. Which equation fits?`, options, instruction: 'Choose the equation.',
        hints: ['What did she start with? What happened next?', 'Write the start first, then take away what she spent.'], steps: [`Start ${l}, spent ${a}, left ${c}.`, `${l} − ${a} = ${c}.`] };
    } }),
  fam({ id: 'g5c.eq.fadd.more', cs: `${Q}EQ_FORM_ADD_SUB`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(3, 9), b = randInt(15, 30), l = pick(['a', 'e']), [p, q] = [person(), person()];
      if (p.name === q.name) return null;
      return { question: `${p.name} has ${b} eggs. That is ${a} more than ${q.name} has. Let ${l} be the number of eggs ${q.name} has. The equation is ${l} + ${a} = ${b}. How many eggs does ${q.name} have?`, answer: b - a,
        wrong: [[b + a, 'More than does not always mean add the numbers. The smaller number is what we want.', 'M_KEYWORD_MORE_MEANS_ADD'], [a, 'That is the difference.', 'M_KEYWORD_MORE_MEANS_ADD'], [b, 'That is what the first child has.', 'M_KEYWORD_MORE_MEANS_ADD'], [b - a + 1, 'Check by adding.', 'M_WRITES_ANSWER_NOT_EQUATION']],
        hints: ['Draw two bars: one for each child.', 'Take the difference from the bigger.'], steps: [`${l} + ${a} = ${b}.`, `${l} = ${b} − ${a} = ${b - a}.`], chk: (v) => v + a === b };
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
      const k = randInt(3, 6), c = randInt(3, 9), g = k * c, p = person();
      const options = mc(`${k}c = ${g}`, [[`c = ${k} × ${g}`, 'The farmer has more goats than cows, so the goats are the bigger number: goats = k × cows.', 'M_TIMES_AS_MANY_REVERSED'], [`c ÷ ${k} = ${g}`, 'There are fewer cows than goats, so the cows are not the bigger number.', 'M_TIMES_AS_MANY_REVERSED'], [`${k} + c = ${g}`, 'Times as many means multiply.', 'M_REPEATED_COST_AS_ADD']]);
      return { question: `A farmer in Nakuru has ${k} times as many goats as cows. He has ${g} goats. Let c be the number of cows. Which equation fits?`, options, instruction: 'Choose the equation.',
        hints: ['Which is more, cows or goats?', 'The bigger number is the cows times the multiplier.'], steps: [`Goats = ${k} × cows, so ${k}c = ${g}.`, `c = ${c}.`] };
    } }),
  fam({ id: 'g5c.eq.fmul.share', cs: `${Q}EQ_FORM_MUL_DIV`, form: 'why', rung: 2,
    gen: () => {
      const k = randInt(3, 6), each = randInt(4, 9), p = person();
      const options = mc(`x ÷ ${k} = ${each}`, [[`${k} ÷ x = ${each}`, 'The total that is shared comes first in a division. The total is the unknown x.', 'M_SHARING_ORDER_REVERSED'], [`x × ${k} = ${each}`, 'The oranges are shared, so divide the total by the number of children.', 'M_SHARING_ORDER_REVERSED'], [`x − ${k} = ${each}`, 'Sharing equally is division, not subtraction.', 'M_REPEATED_COST_AS_ADD']]);
      return { question: `${p.name} bought x oranges and shared them equally among ${k} children. Each child got ${each}. Which equation fits the story?`, options, instruction: 'Choose the equation.',
        hints: ['Which number is shared out: the oranges or the children?', 'The thing shared goes first in a division.'], steps: [`x oranges shared among ${k}: x ÷ ${k}.`, `Each gets ${each}: x ÷ ${k} = ${each}.`] };
    } }),
  fam({ id: 'g5c.eq.fmul.cost', cs: `${Q}EQ_FORM_MUL_DIV`, form: 'word', rung: 2,
    gen: () => {
      const k = randInt(3, 8), b = randInt(8, 40), t = k * b, item = pick(SHOP);
      return { question: `${k} ${item} each cost b shillings. Together they cost sh ${t}. The equation is ${k}b = ${t}. How many shillings does one cost?`, answer: b,
        wrong: [[t + k, `${k}b means ${k} × b, not ${k} + b.`, 'M_REPEATED_COST_AS_ADD'], [t - k, `${k}b means ${k} × b.`, 'M_REPEATED_COST_AS_ADD'], [t * k, 'Multiplying would make the cost of one bigger than all of them.', 'M_REPEATED_COST_AS_ADD'], [b + 1, 'Check by multiplying.', 'M_REPEATED_COST_AS_ADD']],
        hints: [`${k}b means ${k} groups of b.`, 'Divide the total by the number of items.'], steps: [`${k} × b = ${t}.`, `b = ${t} ÷ ${k} = ${b}.`], chk: (v) => v * k === t };
    } }),

  // ---------------------------------------------------------------- EQ_SOLVE_ADD_SUB
  fam({ id: 'g5c.eq.sadd.plus', cs: `${Q}EQ_SOLVE_ADD_SUB`, form: 'word', rung: 1,
    gen: () => {
      const l = L(), a = randInt(10, 90), b = a + randInt(10, 90), p = person();
      return { question: `${p.name} thinks of a number. ${l} + ${a} = ${b}. Solve the equation: what is ${l}?`, answer: b - a,
        wrong: [[b + a, 'You added. Use the opposite operation: take ' + a + ' from both sides.', 'M_SAME_OPERATION_NOT_INVERSE'], [a, 'That is the number added, not the unknown.', 'M_SAME_OPERATION_NOT_INVERSE'], [b, 'That is the total.', 'M_SAME_OPERATION_NOT_INVERSE'], [b - a - 10, 'Check by putting your answer back.', 'M_SAME_OPERATION_NOT_INVERSE']],
        hints: ['Take the same number from both sides.', 'Check by putting the answer back in.'], steps: [`${l} + ${a} = ${b}.`, `${l} = ${b} − ${a} = ${b - a}.`], chk: (v) => v + a === b };
    } }),
  fam({ id: 'g5c.eq.sadd.minus', cs: `${Q}EQ_SOLVE_ADD_SUB`, form: 'direct', rung: 2,
    gen: () => {
      const l = L(), a = randInt(10, 60), b = randInt(10, 60), t = a + b, up = Math.random() < 0.5;
      const eq = up ? `${l} − ${a} = ${b}` : `${t} − ${l} = ${b}`, r = up ? t : t - b;
      const val = up ? a + b : t - b;
      const options = mc(String(val), [[String(up ? Math.abs(a - b) : t + b), up ? `${l} − ${a} = ${b} means ${l} is bigger than ${b}. Add ${a} to both sides.` : `${t} − ${l} = ${b} means ${l} is what is taken away. ${l} is less than ${t}.`, up ? 'M_SUBTRACTS_FOR_X_MINUS' : 'M_UNKNOWN_SUBTRACTED_TREATED_AS_X_MINUS'], [String(up ? b : t), 'Check by putting it into the equation.', up ? 'M_SAME_OPERATION_NOT_INVERSE' : 'M_UNKNOWN_SUBTRACTED_TREATED_AS_X_MINUS'], [String(up ? a : b), 'Check by putting it into the equation.', 'M_SAME_OPERATION_NOT_INVERSE']]);
      if (!options) return null;
      return { question: `Solve ${eq}. Which value of ${l} makes it true?`, options, instruction: 'Choose the value.',
        hints: [up ? 'Read it as: I had some, took away ' + a + ', and have ' + b + ' left.' : 'Read it as: from ' + t + ', what do I take away to leave ' + b + '?', 'Check by putting your answer back.'], steps: [up ? `${l} = ${b} + ${a} = ${val}.` : `${l} = ${t} − ${b} = ${val}.`, 'Check by substitution.'] };
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
      const k = randInt(3, 9), x = randInt(4, 15), t = k * x, l = L(), p = person();
      return { question: `${p.name} solves ${k}${l} = ${t}. Read ${k}${l} as ${k} × ${l}. What is ${l}?`, answer: x,
        wrong: [[t * k, `${k}${l} means ${k} groups of ${l}. Divide to undo it.`, 'M_MULTIPLIES_FOR_AX'], [t - k, 'Use division to undo multiplication.', 'M_MULTIPLIES_FOR_AX'], [t / k + (k > 5 ? 0 : 0) + 1, 'Check by multiplying.', 'M_3X_AS_TWO_DIGIT_NUMBER'], [Number(String(t).slice(-1)) || 1, `${k}${l} is not a two-digit number. It means ${k} × ${l}.`, 'M_3X_AS_TWO_DIGIT_NUMBER']],
        hints: [`${k} groups of what make ${t}?`, 'Divide both sides by ' + k + '.'], steps: [`${k} × ${l} = ${t}.`, `${l} = ${t} ÷ ${k} = ${x}.`], chk: (v) => v * k === t };
    } }),
  fam({ id: 'g5c.eq.smul.divide', cs: `${Q}EQ_SOLVE_MUL_DIV`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(3, 9), b = randInt(4, 12), x = a * b, l = L();
      const options = mc(String(x), [[String(Math.floor(x / a) === b ? b : b), `${l} ÷ ${a} = ${b} means ${l} shared by ${a} gives ${b}. Undo it by multiplying.`, 'M_DIVIDES_FOR_X_DIV'], [String(x + a), 'Check: divide your answer by ' + a + '.', 'M_DIVIDES_FOR_X_DIV'], [String(b - a > 0 ? b - a : b + a), 'Use the opposite operation.', 'M_DIVIDES_FOR_X_DIV']]);
      if (!options) return null;
      return { question: `Solve ${l} ÷ ${a} = ${b}. Which value of ${l} is right?`, options, instruction: 'Choose the value.',
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
      const k = randInt(3, 8), s = randInt(15, 60), t = k * s;
      return { question: `${k} bunches of sukuma wiki cost sh ${t}. Let s be the cost of one bunch in shillings. Form the equation ${k}s = ${t} and solve it. How much does one bunch cost?`, answer: s,
        wrong: [[t * k, 'One bunch costs less than all of them. Divide, do not multiply.', 'M_NO_REASONABLENESS_CHECK'], [t - k, 'Use division to undo the multiplication.', 'M_NUMBERS_IN_STORY_ORDER'], [t + k, 'Use division to undo the multiplication.', 'M_NUMBERS_IN_STORY_ORDER'], [s + 5, 'Check by multiplying.', 'M_NO_REASONABLENESS_CHECK']],
        hints: ['Does one bunch cost more or less than all the bunches?', 'Divide the total by the number of bunches.'], steps: [`${k}s = ${t}, so s = ${t} ÷ ${k} = ${s}.`, `One bunch costs sh ${s}.`], chk: (v) => v * k === t };
    } }),
  fam({ id: 'g5c.eq.ctx.matatu', cs: `${Q}EQ_SOLVE_IN_CONTEXT`, form: 'steps', rung: 3,
    gen: () => {
      const off = randInt(5, 14), left = randInt(8, 30), p0 = off + left;
      return { question: `A matatu had some passengers. At Kisumu ${off} got off and ${left} remained. Let p be the number of passengers at first.`,
        parts: [{ prompt: 'Which number is p? Write the number of passengers at first.', answer: p0, hint: `p − ${off} = ${left}.`, wrong: [[off + left + 0 - 2 * 0 - (off - left > 0 ? off - left : 0) , 'Do not operate on the numbers in the order of the story. The starting number is bigger than ' + left + '.', 'M_NUMBERS_IN_STORY_ORDER'], [left - off > 0 ? left - off : Math.abs(left - off) + 1, 'Some got off, so there were more at first.', 'M_NUMBERS_IN_STORY_ORDER'], [left, 'That is how many remained.', 'M_NUMBERS_IN_STORY_ORDER']] },
          { prompt: 'Check: how many passengers remain after ' + off + ' get off, if p is your answer?', answer: left, hint: 'Take ' + off + ' from your answer.', wrong: [[p0 + off, 'Some got off. Subtract.', 'M_NO_REASONABLENESS_CHECK'], [off, 'That is how many got off.', 'M_NO_REASONABLENESS_CHECK'], [p0, 'That is the start. Take away those who got off.', 'M_NO_REASONABLENESS_CHECK']] }],
        steps: [`p − ${off} = ${left}, so p = ${left} + ${off} = ${p0}.`, `Check: ${p0} − ${off} = ${left}.`], chk: (x, v) => v[0] - off === left && v[1] === left };
    } }),
  fam({ id: 'g5c.eq.ctx.sense', cs: `${Q}EQ_SOLVE_IN_CONTEXT`, form: 'why', rung: 3,
    gen: () => {
      const k = randInt(3, 8), s = randInt(15, 60), t = k * s, wrong = t * k;
      const options = mc(`No, one bunch costs less than all`, [[`Yes, because ${k} times the total works`, 'Check the answer against the story. A single bunch should cost less than all of them.', 'M_NO_REASONABLENESS_CHECK'], [`Yes, because it is a whole number`, 'A whole number is not enough. The answer must make sense in the story.', 'M_NO_REASONABLENESS_CHECK'], [`No, it should be a sum of the two`, 'Use division, not addition.', 'M_NUMBERS_IN_STORY_ORDER']]);
      return { question: `${k} bunches of sukuma wiki cost sh ${t}. ${person().name} says one bunch costs sh ${wrong}. Is the answer sensible?`, options, instruction: 'Choose the best answer.',
        hints: ['Does one bunch cost more or less than all the bunches?', 'Check by multiplying the answer by the number of bunches.'], steps: [`${k} bunches cost sh ${t}, so one costs ${t} ÷ ${k} = ${s}.`, `sh ${wrong} is far too big.`] };
    } }),

  // ---------------------------------------------------------------- EQ_TWO_STEP
  fam({ id: 'g5c.eq.two.pens', cs: `${Q}EQ_TWO_STEP`, form: 'word', rung: 3,
    gen: () => {
      const k = randInt(2, 6), x = randInt(5, 30), b = randInt(5, 40), c = k * x + b, p = person();
      return { question: `${p.name} buys ${k} pens at sh p each and a sweet for sh ${b}. The total is sh ${c}. The equation is ${k}p + ${b} = ${c}. How much does one pen cost?`, answer: x,
        wrong: [[(c / k) - b > 0 ? Math.round((c / k - b) * 100) / 100 : x + 1, 'You divided first and then subtracted. Undo the addition first: take the sweet off the total.', 'M_UNDOES_IN_WRONG_ORDER'], [Math.round((c - b + k) * 10) / 10, 'After taking away the sweet, divide to find one pen.', 'M_COMBINES_UNLIKE_TERMS'], [c - b, 'That is the cost of all the pens together.', 'M_UNDOES_IN_WRONG_ORDER'], [Math.round(c / (k + b) * 100) / 100 || 1, `Terms with p and plain numbers cannot be joined into one kind of term.`, 'M_COMBINES_UNLIKE_TERMS']],
        hints: [`Take the sh ${b} for the sweet off both sides first.`, 'Then share what is left among the pens.'], steps: [`${k}p = ${c} − ${b} = ${c - b}.`, `p = ${c - b} ÷ ${k} = ${x}.`], chk: (v) => k * v + b === c };
    } }),
  fam({ id: 'g5c.eq.two.order', cs: `${Q}EQ_TWO_STEP`, form: 'direct', rung: 3,
    gen: () => {
      const k = randInt(2, 6), x = randInt(4, 15), b = randInt(5, 30), c = k * x + b;
      const options = mc(String(x), [[String(Math.round((c / k - b) * 100) / 100), 'Divide only after taking the added number off. Undo in the opposite order.', 'M_UNDOES_IN_WRONG_ORDER'], [String(Math.round(c / (k + b) * 100) / 100), `Terms with x and plain numbers cannot be joined into one kind of term.`, 'M_COMBINES_UNLIKE_TERMS'], [String(c - b), 'That is the value of ' + k + 'x, not x.', 'M_UNDOES_IN_WRONG_ORDER']]);
      if (!options) return null;
      return { question: `Solve ${k}x + ${b} = ${c}. Which value of x is right?`, options, instruction: 'Choose the value.',
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
