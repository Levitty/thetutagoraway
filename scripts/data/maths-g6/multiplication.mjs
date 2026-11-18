import { mi, pk, P, E, H, LIT, TC } from '../maths-g6-lib.mjs';
export const key = 'NUMBER.MULTIPLICATION';
export const packNotes = 'Long multiplication is taught with partitioning (x 3 and x 20) side by side with the written method, so the zero in the second row has a reason. Estimates are always done before the exact answer and used to check it.';
export const pre = {
  MULT_PATTERNS: [['G5:NUMBER.MULTIPLICATION.MULT_PATTERN_CREATE', H, 'Making a pattern from a rule is the reverse of finding the rule.']],
};
export const mis = [
  mi('MULT_4D_BY_2D', 'M_COLUMN_BY_COLUMN', 'Multiplies each digit only by the digit under it, as in column addition.', ['1,324 x 12', '1,328 (4 x 2 and 2 x 1, the rest copied)', '15,888'], 'Lines the numbers up on the right and works down each column, the way addition is done.', 'An answer about the size of the bigger number as an option.', 'Estimate first: 1,300 x 10 is already 13,000, so 1,328 cannot be right. Then multiply every digit by 2, and every digit by 10.', LIT),
  mi('MULT_4D_BY_2D', 'M_STORY_ADDED', 'Adds the two numbers in a story that needs multiplying.', ['A school buys 24 crates of milk at Ksh 1,350 each. What is the total cost?', 'Ksh 1,374 (1,350 + 24)', 'Ksh 32,400'], 'Reaches for the operation used most often instead of picturing 24 crates each costing 1,350.', 'The sum of the two numbers in the story as an option.', 'Draw the crates: 24 crates each costing 1,350 is 1,350 written 24 times, which is 1,350 x 24.'),
  mi('ESTIMATE_PRODUCT_ROUND10', 'M_EXACT_THEN_ROUNDED', 'Works out the exact product and rounds it, instead of rounding the numbers first.', ['Estimate 38 x 62 by rounding each number to the nearest ten.', '2,360 (38 x 62 = 2,356, then rounded)', '40 x 60 = 2,400'], 'Thinks an estimate is a rounded answer, not a quick answer from rounded numbers.', 'The rounded exact product as an option.', 'An estimate is done in the head before working: round both numbers first, then multiply.'),
  mi('ESTIMATE_PRODUCT_ROUND10', 'M_ROUND_TO_HUNDRED', 'Rounds a three-digit factor to the nearest hundred instead of the nearest ten.', ['Estimate 236 x 47 by rounding each number to the nearest ten.', '200 x 50 = 10,000', '240 x 50 = 12,000'], 'Rounds to the first digit of every number, the way a quick guess is often made.', 'The estimate from rounding to the hundred as an option.', 'Read the place in the question: nearest ten means look at the ones digit only.'),
  mi('MULT_PATTERNS', 'M_BACKWARDS_MULTIPLIED', 'Multiplies to find a missing term before the given ones, instead of dividing.', ['__, 24, 72, 216: what is the first term?', '72 (24 x 3)', '8'], 'Uses the rule in the forward direction whichever way the gap is.', 'The forward-rule answer for a term at the start.', 'Going back along a times 3 pattern means dividing by 3: 24 / 3 = 8.'),
  mi('MULT_PATTERNS', 'M_NEXT_ROW_ONLY', 'Continues the output column by its gap instead of using the rule on the input.', ['Inputs 2, 3, 4 give outputs 6, 9, 12. What does input 10 give?', '15 (added 3 once more)', '30'], 'Looks down the output column only and treats the table as a list.', 'The next output in the list as the answer for an input far down.', 'Ask what was done to each input: 2 became 6, 3 became 9. Do the same to 10.', LIT),
];
export const pack = {
  MULT_4D_BY_2D: pk({
    key_step: 'The child splits the two-digit number into tens and ones, multiplies by each, and explains that the second row ends in zero because it is times tens.',
    floor: ['Multiplies a 3-digit number by a 2-digit number.', 'What is 314 x 12?', '3,768'],
    reps: ['a rectangle split into a strip for the ones and a strip for the tens', 'partitioning: 2,314 x 3 and 2,314 x 20 written side by side', 'the standard written method with two rows'],
    steps: ['Estimate the product first.', 'Multiply by the ones digit and write the first row.', 'Write 0 in the ones place, then multiply by the tens digit for the second row.', 'Add the two rows and compare with the estimate.'],
    contexts: ['crates of milk for a school', 'bags of fertiliser for a cooperative', 'bus fares for a school trip'],
    board: [['write', 'Write 2,314 x 23 and next to it 23 = 20 + 3.'], ['write', 'Work 2,314 x 3 = 6,942 as the first row.'], ['point', 'Point at the 2 in 23.', 'What does this 2 stand for?'], ['pause', 'Wait for the child to say 20.'], ['child_draws', 'Ask the child to write the second row starting with 0.'], ['reveal', 'Add the rows: 6,942 + 46,280 = 53,222.']],
    mis: {
      M_NO_PLACE_HOLDER_ZERO: [['4,628', 'no zero', '11,570'], 'What does the 2 in 23 stand for?', 'It is 2 tens, so the second row is times 20 and ends in 0.'],
      M_CARRY_ADDED_BEFORE: [['I forgot the carry', 'add then multiply'], 'Where did you write the carried digit, and when did you add it?', 'Multiply first, then add the carried digit; write it small and cross it off.'],
      M_MULTIPLY_ONES_ONLY: [['6,000', 'only times 5'], 'Is 1,200 x 15 the same as 1,200 x 5?', 'Multiply by the tens too: 15 is 10 + 5.'],
      M_COLUMN_BY_COLUMN: [['1,328', 'down the columns'], 'Is 1,324 x 12 more or less than 1,324 x 10?', 'Every digit of the top number is multiplied by each digit of 12, not only the digit under it.'],
      M_STORY_ADDED: [['1,374', 'plus 24'], 'If there were 2 crates, what would they cost?', 'Equal groups of the same cost means multiply: 24 crates of 1,350.'],
    },
    checks: [P('What is 2,314 x 23?', '53,222', 'zero in the tens row'), P('A cooperative buys 18 bags of fertiliser at Ksh 2,450 each. What is the total cost?', 'Ksh 44,100', 'a story that needs multiplying')],
  }),
  ESTIMATE_PRODUCT_ROUND10: pk({
    key_step: 'The child rounds each number to the nearest ten before doing anything else, multiplies the rounded numbers, and uses the estimate to judge an exact answer.',
    floor: ['Rounds a number to the nearest ten.', 'Round 47 to the nearest ten.', '50'],
    reps: ['each number on a number line between two tens', 'the rounded numbers multiplied as tens (4 tens x 6 tens)', 'an exact answer set beside the estimate'],
    steps: ['Round the first number to the nearest ten.', 'Round the second number to the nearest ten.', 'Multiply the non-zero digits, then put back all the zeros.', 'Say whether the exact answer is close to the estimate.'],
    contexts: ['the cost of exercise books for a class', 'the price of school uniforms in bulk', 'chairs for a church hall'],
    board: [['write', 'Write 38 x 62.'], ['point', 'Point at 38.', 'What is 38 to the nearest ten?'], ['pause', 'Wait for 40.'], ['point', 'Point at 62.', 'And 62?'], ['predict', 'Ask the child to say the estimate before working it out.'], ['write', 'Write 40 x 60 = 2,400.']],
    mis: {
      M_ROUND_ONE_FACTOR: [['40 x 62', 'only the first'], 'Is 62 rounded yet?', 'Round both numbers before you multiply.'],
      M_ZEROS_LOST_IN_ESTIMATE: [['1,960', 'one zero'], 'How many zeros are in 280 and 70 together?', 'Put back every zero from both numbers: 28 x 7 = 196, then two zeros.'],
      M_EXACT_THEN_ROUNDED: [['2,356', 'I worked it out first'], 'Could you do this one in your head in a few seconds?', 'Round first, then multiply: the estimate is quick and comes before the exact answer.'],
      M_ROUND_TO_HUNDRED: [['200 x 50', 'to the hundred'], 'Which place does nearest ten tell you to round to?', 'Nearest ten: 236 becomes 240, not 200.'],
    },
    checks: [P('Estimate 38 x 62 by rounding each number to the nearest ten.', '2,400', 'both rounded'), P('Estimate 236 x 47 by rounding each number to the nearest ten.', '12,000', 'three-digit factor to the ten')],
  }),
  MULT_PATTERNS: pk({
    key_step: 'The child finds the number each term is multiplied by to get the next, checks it on every pair, and uses it forwards (multiply) or backwards (divide).',
    floor: ['Continues a pattern that adds the same number.', 'What comes next: 7, 14, 21, 28, __?', '35'],
    reps: ['terms in a row with an arrow and "x ?" between each pair', 'an input and output table', 'a growing pile of counters'],
    steps: ['Divide each term by the one before it.', 'Check the same number works for every pair.', 'Multiply to go forward, divide to go back.', 'For a table, do the rule to the input, not to the last output.'],
    contexts: ['bacteria doubling in a science lesson', 'savings in a chama that double', 'chairs in rows that triple'],
    board: [['write', 'Write 2, 6, 18, 54 with arrows between the terms.'], ['point', 'Point at the first arrow.', 'What do we multiply 2 by to get 6?'], ['pause', 'Wait for the child to say times 3.'], ['child_draws', 'Ask the child to write x 3 on each arrow and check it.'], ['predict', 'Ask what comes after 54.']],
    mis: {
      M_ADD_NOT_MULTIPLY: [['add 12', 'the gap'], 'Is the gap the same each time?', 'If the gaps grow, divide each term by the one before.'],
      M_CONSTANT_DIFFERENCE: [['36', 'same gap again'], 'What do you multiply 12 by to get 24?', 'The pattern doubles; the gap doubles too.'],
      M_BACKWARDS_MULTIPLIED: [['72', 'times 3 again'], 'Which way are you going along the pattern?', 'Going back, undo the rule: divide by 3.'],
      M_NEXT_ROW_ONLY: [['15', 'add 3 more'], 'What did the rule do to the input 2?', 'Use the rule on the input: 10 x 3 = 30.'],
    },
    checks: [P('What comes next: 3, 6, 12, 24, __?', '48', 'doubling'), P('What is the first term: __, 24, 72, 216?', '8', 'backwards by dividing')],
  }),
};
