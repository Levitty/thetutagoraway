import { mi, pk, P, E, H, LIT, TC } from '../maths-g6-lib.mjs';
export const key = 'NUMBER.DIVISION';
export const packNotes = 'Long division is taught as sharing a number of thousands, hundreds, tens and ones in turn, so a zero in the quotient means "none of this place". Every answer is checked by multiplying back and adding the remainder.';
export const pre = {
  ESTIMATE_QUOTIENT: [['G5:NUMBER.MULTIPLICATION.ESTIMATE_PRODUCT_ROUND10', H, 'Rounding both numbers to the nearest ten before working is done the same way for products.']],
  COMBINED_OPERATIONS: [['G5:NUMBER.DIVISION.COMBINED_OPS_PROBLEMS', H, 'Grade 5 stories with two operations.']],
};
export const mis = [
  mi('DIV_4D_BY_UP_TO_3D', 'M_REMAINDER_TOO_BIG', 'Stops with a remainder as big as the divisor or bigger.', ['1,000 / 12', '82 remainder 16', '83 remainder 4'], 'Takes a quotient digit that is one too small and does not compare the remainder with the divisor.', 'A remainder bigger than the divisor as an option.', 'After each step ask: is what is left smaller than 12? If not, another 12 fits.', LIT),
  mi('DIV_4D_BY_UP_TO_3D', 'M_STORY_REMAINDER_IGNORED', 'Drops the remainder in a story where it needs one more group.', ['1,250 learners travel in buses that carry 60 each. How many buses are needed?', '20', '21 (20 buses carry 1,200, and 50 learners need one more bus)'], 'Writes the quotient as the answer without asking what the remainder means in the story.', 'The quotient without the extra group as an option.', 'Read the remainder back into the story: 50 learners are still waiting, so they need a bus.'),
  mi('ESTIMATE_QUOTIENT', 'M_EXACT_THEN_ROUNDED_Q', 'Divides exactly and rounds the answer, instead of rounding the numbers first.', ['Estimate 2,396 / 59 by rounding both numbers to the nearest ten.', '41 (2,396 / 59 = 40.6, rounded)', '2,400 / 60 = 40'], 'Thinks an estimate is a rounded answer.', 'The rounded exact quotient as an option.', 'Round both numbers first; the estimate should take a few seconds.'),
  mi('ESTIMATE_QUOTIENT', 'M_DIVIDEND_TO_HUNDRED', 'Rounds the dividend to the nearest hundred instead of the nearest ten.', ['Estimate 1,438 / 18 by rounding both numbers to the nearest ten.', '1,400 / 20 = 70', '1,440 / 20 = 72'], 'Rounds a big number to its front digits out of habit.', 'The estimate from rounding to the hundred as an option.', 'Nearest ten: look at the ones digit only; 1,438 becomes 1,440.'),
];
export const pack = {
  DIV_4D_BY_UP_TO_3D: pk({
    key_step: 'The child divides place by place from the left, writes 0 in the quotient when a place cannot be shared, and checks by multiplying back and adding the remainder.',
    floor: ['Divides a 3-digit number by a 2-digit number.', 'What is 864 / 12?', '72'],
    reps: ['bundles of thousands, hundreds, tens and ones shared into groups', 'the long division layout with one quotient digit above each place', 'the check: quotient x divisor + remainder'],
    steps: ['Start with the fewest digits on the left that the divisor goes into.', 'Write the quotient digit above the last digit used, multiply and subtract.', 'Bring down the next digit; if the divisor does not go in, write 0 in the quotient.', 'Check: quotient x divisor + remainder = dividend, and the remainder is smaller than the divisor.'],
    contexts: ['sharing bags of maize among schools', 'learners into buses', 'packing 1,000 eggs into trays'],
    board: [['write', 'Write 3,248 / 8 in the long division layout.'], ['point', 'Point at the 32.', 'How many 8s in 32?'], ['pause', 'Wait for 4, then subtract.'], ['point', 'Bring down the 4.', 'How many 8s in 4?'], ['pause', 'Wait for the child to say none.'], ['child_draws', 'Ask the child to write the 0 in the quotient and go on.'], ['reveal', 'Check: 406 x 8 = 3,248.']],
    mis: {
      M_ZERO_IN_QUOTIENT_LOST: [['46', 'skip the 4'], 'How many 8s are in 4, and what do we write for none?', 'Write 0 above the 4: none of that place, but the place is still there.'],
      M_REMAINDER_AS_PART: [['834', 'the 4 is the last digit'], 'Is the 4 a group of 12, or what is left over?', 'The remainder is left over; write it as "remainder 4", not as a digit of the answer.'],
      M_DIVIDE_SMALL_BY_BIG: [['12 divided by 4', 'three'], 'Are we sharing 12 into groups of 4, or 45 into groups of 12?', 'The number being divided is always the one inside the bracket.'],
      M_REMAINDER_TOO_BIG: [['remainder 16'], 'Is 16 bigger than 12?', 'If what is left is as big as the divisor, one more group fits.'],
      M_STORY_REMAINDER_IGNORED: [['20 buses', 'drop the remainder'], 'What happens to the 50 learners who are left?', 'In a story the remainder may need one more group.'],
    },
    checks: [P('What is 3,248 / 8?', '406', 'zero in the quotient'), P('1,250 learners travel in buses that carry 60 each. How many buses are needed?', '21', 'remainder in a story')],
  }),
  ESTIMATE_QUOTIENT: pk({
    key_step: 'The child rounds the dividend and the divisor to the nearest ten, divides the rounded numbers, and uses the estimate to say whether an exact answer is sensible.',
    floor: ['Rounds to the nearest ten.', 'Round 4,183 to the nearest ten.', '4,180'],
    reps: ['each number on a number line between two tens', 'the rounded numbers with matching zeros crossed out', 'the estimate beside an exact answer'],
    steps: ['Round the dividend to the nearest ten.', 'Round the divisor to the nearest ten.', 'Cross out the same number of zeros from both, then divide.', 'Compare the estimate with any exact answer.'],
    contexts: ['how many trips a lorry makes', 'how many bags each school gets', 'how many weeks of saving'],
    board: [['write', 'Write 6,300 / 70.'], ['point', 'Point at one zero in each number.', 'If we cross out one zero from each, what is left?'], ['pause', 'Wait for 630 / 7.'], ['predict', 'Ask the child for the answer before you write it.'], ['write', 'Write 630 / 7 = 90.']],
    mis: {
      M_ROUND_ONLY_DIVIDEND: [['4,183 divided by 20', 'only one rounded'], 'Have both numbers been rounded?', 'Round the dividend and the divisor.'],
      M_ZEROS_CANCELLED_WRONG: [['9', 'two zeros off'], 'How many zeros does 70 have to give?', 'Cross out the same number of zeros from both numbers, no more than the divisor has.'],
      M_EXACT_THEN_ROUNDED_Q: [['40.6', 'worked it out exactly'], 'Could you do this in your head?', 'Round first, then divide: that is the estimate.'],
      M_DIVIDEND_TO_HUNDRED: [['1,400', 'to the hundred'], 'Which place does nearest ten mean?', '1,438 to the nearest ten is 1,440.'],
    },
    checks: [P('Estimate 4,183 / 21 by rounding both numbers to the nearest ten.', '209', '4,180 / 20'), P('Estimate 1,438 / 18 by rounding both numbers to the nearest ten.', '72', '1,440 / 20')],
  }),
  COMBINED_OPERATIONS: pk({
    key_step: 'The child does brackets first, then multiplication and division from left to right, then addition and subtraction from left to right, and says which step comes next before doing it.',
    floor: ['Knows the order of operations with two operations.', 'What is 6 + 2 x 3?', '12'],
    reps: ['the expression with each step underlined in order', 'a story turned into an expression', 'two working lines side by side, one in the right order'],
    steps: ['Work out anything in brackets.', 'Do multiplication and division as they come from left to right.', 'Do addition and subtraction as they come from left to right.', 'Write one step per line.'],
    contexts: ['shopping at a duka with change', 'sharing and adding marks', 'fare for a group plus luggage'],
    board: [['write', 'Write 8 + 4 x 5.'], ['point', 'Point at the x.', 'Which do we do first, the + or the x?'], ['pause', 'Wait for the child to say the x.'], ['child_draws', 'Ask the child to underline 4 x 5 and write 20.'], ['reveal', 'Write 8 + 20 = 28.']],
    mis: {
      M_LEFT_TO_RIGHT_ONLY: [['60', 'left to right'], 'Which operation comes first, wherever it is?', 'Multiply and divide before adding and subtracting.'],
      M_DIVIDE_AFTER_MULTIPLY: [['4', 'multiply first'], 'Which of / and x comes first from the left?', 'Multiplication and division are on the same level: do them in the order they come.'],
      M_BRACKET_IGNORED: [['23', 'no brackets'], 'What do the brackets tell us?', 'Brackets come first: 5 + 3 = 8, then 4 x 8.'],
      M_SUBTRACT_BEFORE_MULTIPLY: [['276', 'minus first'], 'Is there a multiplication in the line?', 'Do 4 x 6 first, then 50 - 24.'],
    },
    checks: [P('What is 50 - 4 x 6?', '26', 'multiply before subtract'), P('What is (12 + 8) / 4 x 3?', '15', 'brackets, then left to right')],
  }),
};
