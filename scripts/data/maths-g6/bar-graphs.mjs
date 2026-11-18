import { mi, pk, P, E, H, LIT, TC } from '../maths-g6-lib.mjs';
export const key = 'DATA_H.BAR_GRAPHS';
export const packNotes = 'Data starts with the class: favourite foods, ways of coming to school, number of siblings. The same data goes from a tally to a frequency table, to piles of bottle tops, to a pictograph and to a bar graph, so the child sees one set of numbers in five pictures. The key or the scale is read aloud before any graph is read.';
export const pre = {
  PILING: [['G5:DATA_H.DATA_REPRESENTATION.COMPARE_TOTAL_FREQUENCIES', H, 'Comparing which group has more is what the piles show.']],
  BAR_GRAPH_DRAW: [['G5:DATA_H.DATA_REPRESENTATION.READ_FREQUENCY_TABLE', E, 'The bars are drawn from the frequencies in a table.']],
};
export const mis = [
  mi('FREQUENCY_TABLE', 'M_TALLY_GATE_AS_FOUR', 'Counts a tally gate (four lines and one across) as 4, or as 6.', ['What does one gate of tally marks (four lines and one across them) stand for?', '4', '5'], 'Counts only the upright lines, or counts the cross line twice.', 'A count one off for each gate.', 'Draw the marks one by one while counting: 1, 2, 3, 4, and the fifth goes across.'),
  mi('FREQUENCY_TABLE', 'M_MISSING_FREQUENCY_ADDED', 'Adds the total to the known frequencies to find a missing one, instead of taking them away.', ['30 learners were asked. The frequencies are 8, 12 and one missing. What is the missing frequency?', '50', '10'], 'Adds every number in the question.', 'The sum as an option.', 'All the frequencies make the total: 8 + 12 + ? = 30.'),
  mi('PICTOGRAPH', 'M_DRAW_ONE_PER_ITEM', 'Draws one symbol for each item even when the key says a symbol stands for more.', ['Each symbol stands for 5 mangoes. How many symbols show 20 mangoes?', '20', '4'], 'Does not use the key when drawing.', 'One symbol per item as an option.', 'Read the key aloud: one symbol is 5 mangoes. How many fives make 20?'),
  mi('PICTOGRAPH', 'M_HALF_SYMBOL_AS_ONE', 'Counts a half symbol as 1 whatever the key says.', ['Each symbol stands for 10. A row has 2 and a half symbols. How many?', '21', '25'], 'Thinks a part symbol is a single item.', 'A count with the half symbol as 1.', 'Half a symbol is half of the key: half of 10 is 5.'),
  mi('PILING', 'M_UNEQUAL_OBJECTS_COMPARED', 'Compares piles of objects of different sizes by height.', ['Learners pile bottle tops for juice and large stones for water. The stone pile is taller. Did more learners choose water?', 'Yes, its pile is taller', 'We cannot tell until we count: the objects are different sizes'], 'Takes height as the count.', 'A yes from height alone.', 'Use the same kind of object for every pile, or count each pile.'),
  mi('BAR_GRAPH_DRAW', 'M_UNEVEN_SCALE', 'Numbers the axis with uneven steps.', ['Which scale is right for a bar graph: 0, 5, 10, 20, 40 or 0, 10, 20, 30, 40?', '0, 5, 10, 20, 40', '0, 10, 20, 30, 40'], 'Writes the numbers needed for the bars, not a steady scale.', 'An uneven scale as an option.', 'Each square must stand for the same amount: count up the axis in equal steps.'),
  mi('BAR_GRAPH_DRAW', 'M_SCALE_DOES_NOT_FIT', 'Chooses a scale that makes the tallest bar run off the grid.', ['The biggest frequency is 45 and the grid is 10 squares tall. Which scale fits: each square 1, 5 or 10?', '1', '5 (45 needs 9 squares)'], 'Uses each square as 1 out of habit.', 'A scale that is too small as an option.', 'Divide the biggest frequency by the number of squares and pick a step at least that big.'),
  mi('BAR_GRAPH_INTERPRET', 'M_SQUARES_COUNTED_NOT_SCALE', 'Counts the squares a bar covers instead of reading the scale.', ['Each square on the bar graph is 5. A bar is 6 squares tall. What is its value?', '6', '30'], 'Reads the height in squares, not in the scale.', 'The number of squares as an option.', 'Read the number on the axis level with the top of the bar.'),
];
export const pack = {
  FREQUENCY_TABLE: pk({
    key_step: 'The child tallies in gates of five, writes each frequency, adds the frequencies for the total, and says the most frequent value (not its frequency).',
    floor: ['Draws tally marks.', 'Show 7 with tally marks.', 'one gate and two lines'],
    reps: ['a class survey with tally marks', 'a frequency table: value, tally, frequency', 'the total row at the bottom'],
    steps: ['Tally each answer, the fifth mark across the four.', 'Count each tally and write the frequency.', 'Add the frequencies for the total.', 'The most frequent value is the one with the biggest frequency.'],
    contexts: ['books read by learners in a week', 'how learners come to school', 'goals in a football league'],
    board: [['draw', 'Draw a table: books read 0, 1, 2, 3 with frequencies 4, 6, 5, 2.'], ['point', 'Point at the frequency column.', 'How many learners were asked?'], ['pause', 'Wait for the child to add 4 + 6 + 5 + 2.'], ['point', 'Point at the 6.', 'What is the most common number of books?'], ['predict', 'Ask whether the answer is 6 or 1, and why.']],
    mis: {
      M_ADD_VALUES_NOT_FREQUENCIES: [['6', '0 + 1 + 2 + 3'], 'Which column tells how many learners?', 'Add the frequencies: 17 learners.'],
      M_FREQUENCY_AS_VALUE: [['the most is 6'], 'Is 6 a number of books or a number of learners?', 'The most common value is the number of books with the biggest frequency.'],
      M_TALLY_GATE_AS_FOUR: [['4 for a gate'], 'Count the lines in a gate one by one.', 'A gate is 5.'],
      M_MISSING_FREQUENCY_ADDED: [['50', 'add them'], 'Do all the frequencies together make 30?', 'Take the known ones from the total: 30 - 20 = 10.'],
    },
    checks: [P('Books read: 0, 1, 2, 3 with frequencies 4, 6, 5, 2. How many learners are there?', '17', 'add frequencies'), P('30 learners were asked. Two frequencies are 8 and 12. What is the third?', '10', 'missing frequency')],
  }),
  PICTOGRAPH: pk({
    key_step: 'The child reads the key aloud and multiplies the number of symbols by it, taking a half symbol as half the key.',
    floor: ['Reads a frequency table.', 'In a table, mangoes have frequency 20. How many mangoes?', '20'],
    reps: ['real objects grouped in fives', 'a pictograph with a key', 'the key written as a multiplication'],
    steps: ['Read the key: one symbol stands for how many?', 'Count the symbols.', 'Multiply by the key; a half symbol is half the key.', 'To draw, divide the frequency by the key.'],
    contexts: ['fruit sold at a market', 'learners in each house at sports day', 'cows on farms'],
    board: [['draw', 'Draw a pictograph row with 3 and a half symbols and a key: one symbol = 10.'], ['point', 'Point at the key.', 'What is one symbol worth?'], ['pause', 'Wait for 10.'], ['point', 'Point at the half symbol.', 'What is half a symbol worth?'], ['predict', 'Ask for the total of the row.']],
    mis: {
      M_KEY_IGNORED: [['4', 'four symbols'], 'What does one symbol stand for?', 'Multiply by the key: 4 x 5 = 20.'],
      M_HALF_SYMBOL_AS_WHOLE: [['40'], 'Is half a symbol a whole one?', 'Half a symbol is half of 10: 35.'],
      M_DRAW_ONE_PER_ITEM: [['20 symbols'], 'If one symbol is 5, how many symbols make 20?', 'Divide by the key: 4 symbols.'],
      M_HALF_SYMBOL_AS_ONE: [['21'], 'What is half of the key?', 'Half a symbol is 5 when the key is 10.'],
    },
    checks: [P('Each symbol stands for 5. A row has 4 symbols. How many?', '20', 'multiply by the key'), P('Each symbol stands for 10. A row has 3 and a half symbols. How many?', '35', 'half symbol')],
  }),
  PILING: pk({
    key_step: 'The child says each object in a pile stands for one answer, compares piles of the same objects by counting, and adds all the piles for the total.',
    floor: ['Counts objects.', 'Count these bottle tops: there are 8 in a row.', '8'],
    reps: ['piles of bottle tops or stones on the floor', 'piles lined up from a base line', 'the piles written as a frequency table'],
    steps: ['Use the same kind of object for every pile.', 'Put one object on a pile for each answer.', 'Line the piles up and count each.', 'Add all the piles for the total.'],
    contexts: ['favourite fruits in class', 'votes for class prefect', 'colours of school bags'],
    board: [['draw', 'Draw three piles of 5, 8 and 3 bottle tops.'], ['point', 'Point at all three piles.', 'How many learners voted in all?'], ['pause', 'Wait for the child to add.'], ['point', 'Point at the 3.', 'Which pile has the fewest?']],
    mis: {
      M_PILE_HEIGHT_NOT_COUNT: [['the wide one'], 'How many objects are in each pile?', 'Count, do not judge by how it looks.'],
      M_TOTAL_OF_TALLEST_ONLY: [['8'], 'Does the total include the other piles?', 'Add all the piles: 16.'],
      M_PILE_LEFT_OUT: [['16 for four piles'], 'Did you count every pile?', 'Tick each pile as you add it.'],
      M_UNEQUAL_OBJECTS_COMPARED: [['the stones are taller'], 'Are the stones and the bottle tops the same size?', 'Use the same objects, or count.'],
    },
    checks: [P('Piles of 5, 8 and 3 bottle tops. How many objects in all?', '16', 'total of piles'), P('Piles of 5, 8 and 3 bottle tops. Which pile has the fewest?', 'the pile of 3', 'compare by counting')],
  }),
  BAR_GRAPH_DRAW: pk({
    key_step: 'The child picks a scale with equal steps so the tallest bar fits, works out each bar\'s height from the scale, and labels the title and both axes.',
    floor: ['Divides by 2, 5 and 10.', 'What is 20 divided by 5?', '4'],
    reps: ['squared paper with an axis numbered in equal steps', 'a frequency table beside the graph', 'a checklist: title, labels, equal widths, scale'],
    steps: ['Find the biggest frequency and the number of squares.', 'Choose a step (1, 2, 5 or 10) so the biggest bar fits.', 'Number the axis in equal steps from 0.', 'Draw bars of equal width with gaps and write the title and labels.'],
    contexts: ['milk from cows on a farm', 'rainfall each month', 'learners in each club'],
    board: [['draw', 'Draw an empty grid 10 squares tall.'], ['write', 'Write frequencies 15, 45, 30.'], ['point', 'Point at 45 and the 10 squares.', 'If each square is 1, does 45 fit?'], ['pause', 'Wait for the child to say no.'], ['child_draws', 'Ask the child to number the axis in fives and draw the bars.']],
    mis: {
      M_SCALE_STEP_ONE: [['20 squares'], 'What does one square stand for?', 'Divide by the scale: 20 / 5 = 4 squares.'],
      M_BARS_UNEVEN_OR_NO_LABELS: [['nothing is missing'], 'How would someone know what the bars show?', 'A bar graph needs a title, labelled axes and equal widths.'],
      M_UNEVEN_SCALE: [['0, 5, 10, 20, 40'], 'Do all the steps go up by the same amount?', 'Equal steps: 0, 10, 20, 30, 40.'],
      M_SCALE_DOES_NOT_FIT: [['each square is 1'], 'How many squares would 45 need?', 'Pick a step so 45 fits: each square 5.'],
    },
    checks: [P('Each square stands for 5. How many squares tall is a bar for 20?', '4', 'use the scale'), P('The biggest frequency is 45 and the grid is 10 squares tall. Which scale fits: each square 1, 5 or 10?', '5', 'choose the scale')],
  }),
  BAR_GRAPH_INTERPRET: pk({
    key_step: 'The child reads the scale first, reads each bar at its top against the axis, and answers the question asked (difference, total, second highest).',
    floor: ['Reads a scale that goes up in 5s.', 'On a scale 0, 5, 10, 15, a point is halfway between 10 and 15. What value?', '12.5'],
    reps: ['a bar graph with a ruler laid across the top of a bar', 'the bars written as a table', 'the question words underlined'],
    steps: ['Read the scale: what is each line worth?', 'Read each bar at its top.', 'Underline what is asked: how many more, how many in all, second highest.', 'Work it out and answer in a sentence.'],
    contexts: ['crops grown by farmers', 'learners\' favourite subjects', 'matatus passing a stage each hour'],
    board: [['draw', 'Draw a bar graph: maize 40, beans 30, rice 15, scale in 5s.'], ['point', 'Point at the scale.', 'What is each line worth?'], ['pause', 'Wait for 5.'], ['point', 'Point at the maize and beans bars.', 'How many more chose maize than beans?'], ['predict', 'Ask the child to answer before you work it out.']],
    mis: {
      M_READ_TOP_OF_BAR_WRONG_LINE: [['10 or 20'], 'Is the bar on a line or between two lines?', 'Halfway between 10 and 20 is 15.'],
      M_SECOND_HIGHEST_AS_HIGHEST: [['the tallest'], 'Which bar is next after the tallest?', 'Second highest is the next tallest.'],
      M_DIFFERENCE_AS_TOTAL: [['70', 'add them'], 'Does "how many more" mean add or compare?', 'How many more is the difference: 40 - 30 = 10.'],
      M_SQUARES_COUNTED_NOT_SCALE: [['6'], 'What is each square worth?', 'Read the scale: 6 squares x 5 = 30.'],
    },
    checks: [P('Maize 40, beans 30 on a bar graph. How many more chose maize than beans?', '10', 'difference'), P('Each square is 5. A bar is 6 squares tall. What is its value?', '30', 'read the scale')],
  }),
};
