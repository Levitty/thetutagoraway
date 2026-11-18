import { mi, pk, P, E, H, LIT, TC } from '../maths-g6-lib.mjs';
export const key = 'NUMBER.INEQUALITIES';
export const packNotes = 'Inequalities are taught on a number line first (a filled dot when the boundary is allowed, an open dot when it is not), with the words "at least", "at most", "more than" and "fewer than" matched to the symbols. Simplifying uses the balance idea of Grade 5 equations, with the symbol kept the same way.';
export const pre = {};
export const mis = [
  mi('FORM_INEQUALITY', 'M_AT_MOST_AS_MORE', 'Writes "at most" with a greater-than symbol because "most" sounds like "more".', ['"A matatu carries at most 14 passengers" as an inequality', 'x >= 14', 'x <= 14'], 'Matches the word "most" to "more" instead of to the biggest allowed number.', 'The reversed symbol for "at most".', 'Say it as a limit: "at most 14" means 14 or fewer. Mark 14 and shade to the left on a number line.', LIT),
  mi('FORM_INEQUALITY', 'M_EQUALS_FOR_LIMIT', 'Writes an equation for a limit, as if the number had to be exact.', ['"A lift carries no more than 8 people" as an inequality', 'x = 8', 'x <= 8'], 'Has written equations more often than inequalities, so writes = when a number appears.', 'The equation as an option.', 'Ask: could 5 people be in the lift? If yes, the number is not exactly 8.'),
  mi('SIMPLIFY_INEQUALITY', 'M_ONE_SIDE_ONLY', 'Does the operation to one side only.', ['Simplify 3x > 18', 'x > 18', 'x > 6'], 'Removes the 3 from the x side but leaves the other side as it was.', 'The answer with the number side unchanged.', 'Whatever is done to one side is done to the other, as on a balance.'),
  mi('SIMPLIFY_INEQUALITY', 'M_SYMBOL_BECOMES_EQUALS', 'Writes an equals sign in the answer, turning the inequality into an equation.', ['Simplify x + 5 < 12', 'x = 7', 'x < 7'], 'Copies the steps of solving an equation, including the = sign.', 'The equation as an option.', 'Copy the symbol down on every line: the answer is still "less than".'),
  mi('SOLVE_INEQUALITY', 'M_BOUNDARY_LEFT_OUT', 'Leaves the boundary out when the inequality allows it (at least, at most).', ['Smallest whole number with x >= 9', '10', '9'], 'Treats every inequality as strict.', 'The next whole number after the boundary as the answer.', 'Read the line under the symbol as "or equal to": 9 is allowed.'),
  mi('SOLVE_INEQUALITY', 'M_DIVIDE_BEFORE_SUBTRACT', 'In a two-step inequality divides only the x term first, so the number added is left as it was.', ['Solve 2x + 4 < 20', 'x < 6 (2x + 4 < 20 turned into x + 4 < 10)', 'x < 8'], 'Divides the 2x and the 20 but not the 4, or undoes the steps in the wrong order.', 'The answer from dividing before subtracting as an option.', 'Undo the adding first: take 4 from both sides, then divide both sides by 2.', LIT),
];
export const pack = {
  FORM_INEQUALITY: pk({
    key_step: 'The child decides whether the boundary number is allowed and which side is allowed, and then chooses the symbol.',
    floor: ['Uses < and > to compare two numbers.', 'Put < or > : 12 __ 30', '<'],
    reps: ['the story acted with counters (some numbers allowed, some not)', 'a number line with an open or filled dot and a shaded side', 'the inequality written with x'],
    steps: ['Find the boundary number in the story.', 'Ask: is the boundary itself allowed?', 'Ask: are bigger or smaller numbers allowed?', 'Write x with the symbol: >, <, >= or <=.'],
    contexts: ['passengers in a matatu', 'learners needed for a football team', 'shillings to spend at the canteen'],
    board: [['draw', 'Draw a number line from 10 to 18 with a dot at 14.'], ['write', 'Write "A matatu carries at most 14 passengers."'], ['point', 'Point at 14.', 'Can it carry exactly 14?'], ['pause', 'Wait for yes, then fill the dot.'], ['point', 'Point at 15.', 'Can it carry 15?'], ['child_draws', 'Ask the child to shade the side that is allowed.'], ['reveal', 'Write x <= 14.']],
    mis: {
      M_AT_LEAST_STRICT: [['bigger than 30', 'x > 30'], 'Can there be exactly 30 learners?', 'At least 30 includes 30: x >= 30.'],
      M_SYMBOL_DIRECTION: [['x > 12', 'the arrow'], 'Fewer than 12: are 5 mandazi allowed? Are 20?', 'The open end of the symbol faces the bigger number: x < 12.'],
      M_AT_MOST_AS_MORE: [['most means more', 'x >= 14'], 'Can the matatu carry 20 passengers?', 'At most 14 is a top limit: 14 or fewer.'],
      M_EQUALS_FOR_LIMIT: [['x equals 8', 'it is 8'], 'Could the lift carry 5 people?', 'A limit allows more than one number, so use an inequality.'],
    },
    checks: [P('"Not more than 40 learners" as an inequality', 'x <= 40', 'boundary allowed, top limit'), P('"More than 25 mangoes" as an inequality', 'x > 25', 'boundary not allowed')],
  }),
  SIMPLIFY_INEQUALITY: pk({
    key_step: 'The child undoes the operation on the x side by doing its inverse to both sides and writes the same symbol on every line.',
    floor: ['Solves a one-step equation.', 'Solve x + 5 = 12', 'x = 7'],
    reps: ['a balance that tips to one side', 'the inequality with the same step written on both sides', 'a check with a number that should work'],
    steps: ['Find what is done to x.', 'Do the inverse to both sides.', 'Copy the symbol down unchanged.', 'Check with a number from the answer.'],
    contexts: ['money left after buying a book', 'sharing exercise books equally', 'marks needed to pass'],
    board: [['draw', 'Draw a balance tipped to the right with x + 5 on the left and 12 on the right.'], ['point', 'Point at the + 5.', 'What can we take off both sides?'], ['pause', 'Wait for the child to say 5.'], ['write', 'Write x + 5 - 5 < 12 - 5.'], ['predict', 'Ask the child to write the answer and say whether the symbol changes.']],
    mis: {
      M_FLIP_THE_SYMBOL_FOR_NOTHING: [['x > 6', 'turn it round'], 'Does taking 4 from both sides change which side is lighter?', 'Adding, subtracting or dividing by a positive number keeps the symbol the same.'],
      M_OPERATION_NOT_INVERTED: [['x < 17', 'add the 5'], 'What undoes + 5?', 'Do the inverse: subtract 5 from both sides.'],
      M_ONE_SIDE_ONLY: [['x > 18'], 'What did you do to the 18?', 'Both sides get the same step: 18 / 3 = 6.'],
      M_SYMBOL_BECOMES_EQUALS: [['x = 7', 'equals'], 'Is 5 also an answer?', 'Keep the inequality symbol: x < 7.'],
    },
    checks: [P('Simplify x + 9 > 15', 'x > 6', 'subtract from both sides'), P('Simplify 4x < 28', 'x < 7', 'divide both sides')],
  }),
  SOLVE_INEQUALITY: pk({
    key_step: 'The child simplifies to x and a symbol, then lists or picks the whole numbers allowed, saying whether the boundary is one of them.',
    floor: ['Simplifies a one-step inequality.', 'Simplify x + 3 < 10', 'x < 7'],
    reps: ['a number line with the boundary dot and the allowed whole numbers circled', 'the two-step working, one line per step', 'a check by putting a number back in'],
    steps: ['Undo adding or subtracting first, then multiplying or dividing.', 'Write x with the symbol.', 'Mark the boundary: open dot if not allowed, filled if allowed.', 'List or pick the whole numbers asked for and check one.'],
    contexts: ['how many packets a learner can buy', 'learners that fit in a classroom', 'days left to save for a trip'],
    board: [['write', 'Write 2x + 3 < 17.'], ['point', 'Point at the + 3.', 'What do we undo first?'], ['pause', 'Wait for the child to take 3 from both sides.'], ['write', 'Write 2x < 14, then x < 7.'], ['draw', 'Draw a number line with an open dot at 7.'], ['child_draws', 'Ask the child to circle the largest whole number allowed.']],
    mis: {
      M_BOUNDARY_INCLUDED: [['8', 'the number itself'], 'Is 8 less than 8?', 'A strict symbol leaves the boundary out: the largest is 7.'],
      M_ONE_SOLUTION_ONLY: [['5 only', 'one answer'], 'Does 6 also work?', 'An inequality has many answers; check each one.'],
      M_COUNT_ENDS_WRONG: [['6 numbers', 'from 3 to 8'], 'Is 3 more than 3? Is 8 less than 8?', 'Leave out an end that is not allowed, then count.'],
      M_BOUNDARY_LEFT_OUT: [['10', 'more than 9'], 'Does x >= 9 allow 9?', 'The line under the symbol means the boundary is allowed.'],
      M_DIVIDE_BEFORE_SUBTRACT: [['x < 6', 'divide first'], 'Put 7 into 2x + 4: is it less than 20?', 'Take 4 from both sides first, then divide both sides by 2.'],
    },
    checks: [P('What is the largest whole number with 2x + 3 < 17?', '6', 'two steps, strict boundary'), P('List the whole numbers with 3 < x <= 6.', '4, 5, 6', 'one end allowed, one not')],
  }),
};
