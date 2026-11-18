import { mi, pk, P, E, H, LIT, TC } from '../maths-g6-lib.mjs';
export const key = 'MEASUR.CAPACITY';
export const packNotes = 'Capacity starts with a 1 cm cube (1 ml) and a 10 cm cube or a 1 litre bottle (1,000 ml); conversions always say "1 l = 1,000 ml" first and keep a place value chart for the zeros.';
export const pre = {
  LITRES_TO_ML: [['G6:MEASUR.CAPACITY.CM3_ML_LITRE_RELATION', E, 'Changing litres to ml uses 1 l = 1,000 ml.']],
};
export const mis = [
  mi('CM3_ML_LITRE_RELATION', 'M_CUBE_SIDE_AS_ML', 'Uses the length of a side, or three sides added, as the capacity of a cube.', ['A cube with 10 cm sides holds how many ml?', '30 ml (10 + 10 + 10)', '1,000 ml'], 'Adds or copies the lengths instead of finding the volume.', 'The sum of the sides as an option.', 'Volume is length x width x height: 10 x 10 x 10 = 1,000 cm3, and 1 cm3 holds 1 ml.'),
  mi('LITRES_TO_ML', 'M_LITRES_ML_JOINED', 'Writes the litres and the millilitres side by side, losing the place-holder zero.', ['3 l 25 ml in ml', '325 ml', '3,025 ml'], 'Joins the digits as they are said.', 'The joined digits as an option.', 'Change the litres first: 3 l = 3,000 ml, then add 25 ml.'),
  mi('LITRES_TO_ML', 'M_DIVIDE_FOR_SMALLER_UNIT', 'Divides by 1,000 to change litres to ml.', ['4 l in ml', '0.004 ml', '4,000 ml'], 'Not sure which way to go, so divides.', 'A tiny answer as an option.', 'A smaller unit needs more of them: multiply by 1,000.'),
  mi('ML_TO_LITRES', 'M_ML_PLACE_HOLDER_LOST', 'Loses the zero in the ml part when writing litres and ml or a decimal.', ['2,050 ml in litres and millilitres', '2 l 5 ml (or 2.5 l)', '2 l 50 ml (2.05 l)'], 'Drops the zero between the litres and the ml.', 'The answer with the zero dropped.', 'Split off three digits from the right for the ml: 2 | 050.'),
  mi('ML_TO_LITRES', 'M_MULTIPLY_FOR_BIGGER_UNIT', 'Multiplies by 1,000 to change ml to litres.', ['3,000 ml in litres', '3,000,000 l', '3 l'], 'Multiplies whenever 1,000 appears.', 'A huge answer as an option.', 'A bigger unit needs fewer of them: divide by 1,000.'),
];
export const pack = {
  CM3_ML_LITRE_RELATION: pk({
    key_step: 'The child says that 1 cm3 holds 1 ml and that 1,000 cm3 (a 10 cm cube) holds 1 litre.',
    floor: ['Knows 1 l = 1,000 ml.', 'How many ml in 1 litre?', '1,000'],
    reps: ['a 1 cm cube and a 10 cm cube box', 'a litre bottle filled from the 10 cm cube', 'the chain 1 cm3 = 1 ml, 1,000 cm3 = 1 l'],
    steps: ['Find the volume of the box in cm3.', 'Each cm3 holds 1 ml.', 'Divide the ml by 1,000 for litres.', 'Use cm3 for space inside a box, ml and l for liquid.'],
    contexts: ['a water tank', 'a juice box', 'a medicine bottle'],
    board: [['draw', 'Draw a 10 cm cube.'], ['point', 'Point at one side.', 'How many 1 cm cubes fit along this edge?'], ['pause', 'Wait for 10.'], ['write', 'Write 10 x 10 x 10 = 1,000 cm3.'], ['predict', 'Ask how many ml and how many litres the cube holds.']],
    mis: {
      M_CM3_HUNDRED_ML: [['10 litres', 'a hundred'], 'How many cm3 make one litre?', '1,000 cm3 is 1 litre.'],
      M_CM3_NOT_CAPACITY: [['cm', 'length'], 'Are we measuring along the box or the space inside?', 'Space inside is measured in cm3, ml or litres.'],
      M_CM3_AS_LITRES: [['5,000 litres'], 'How many cm3 fill one litre?', 'Divide by 1,000: 5 litres.'],
      M_CUBE_SIDE_AS_ML: [['30', 'add the sides'], 'How many small cubes fill the big cube?', 'Multiply the three sides: 1,000 cm3 = 1,000 ml.'],
    },
    checks: [P('A box of 5,000 cm3 holds how many litres?', '5 litres', 'divide by 1,000'), P('A cube with 10 cm sides holds how many ml?', '1,000 ml', 'volume to ml')],
  }),
  LITRES_TO_ML: pk({
    key_step: 'The child multiplies the litres by 1,000 and adds the ml, keeping zeros in the empty places.',
    floor: ['Knows 1 l = 1,000 ml.', 'How many ml in 2 l?', '2,000 ml'],
    reps: ['litre bottles and a measuring jug', 'a place value chart with the ml filled in', 'the two-step working'],
    steps: ['Multiply the litres by 1,000.', 'Add the ml.', 'For a decimal of a litre, multiply the decimal by 1,000.', 'Check: ml are a bigger number than l.'],
    contexts: ['milk from a dairy cow', 'a jerrycan of water', 'cooking oil'],
    board: [['write', 'Write 3 l 25 ml.'], ['point', 'Point at the 3 l.', 'How many ml is 3 l?'], ['pause', 'Wait for 3,000.'], ['child_draws', 'Ask the child to add the 25 ml in the right places.'], ['reveal', 'Write 3,025 ml.']],
    mis: {
      M_TIMES_HUNDRED: [['300 ml', 'a hundred'], 'How many ml in one litre?', 'Multiply by 1,000.'],
      M_DECIMAL_LITRE: [['2,005', 'two litres five'], 'Is 0.5 l five ml or half a litre?', 'Half a litre is 500 ml.'],
      M_LITRES_ML_JOINED: [['325', 'join them'], 'How many ml is 3 l on its own?', '3,000 + 25 = 3,025.'],
      M_DIVIDE_FOR_SMALLER_UNIT: [['0.004', 'divide'], 'Is 0.004 ml more or less than a drop?', 'Smaller unit, more of them: multiply.'],
    },
    checks: [P('Write 2.5 l in ml.', '2,500 ml', 'decimal of a litre'), P('Write 3 l 25 ml in ml.', '3,025 ml', 'place-holder zero')],
  }),
  ML_TO_LITRES: pk({
    key_step: 'The child divides the ml by 1,000 by splitting off the last three digits as ml, and gives litres and ml or a decimal of a litre.',
    floor: ['Knows 1 l = 1,000 ml.', 'How many litres is 1,000 ml?', '1 litre'],
    reps: ['a measuring jug and litre bottles', 'the number with a line three digits from the right', 'litres and ml, and the decimal'],
    steps: ['Draw a line three digits from the right.', 'The left part is litres, the right part ml.', 'For a decimal, the three ml digits go after the point.', 'Check: litres are a smaller number than ml.'],
    contexts: ['water used in a day', 'soda bottles at a party', 'paint for a classroom'],
    board: [['write', 'Write 2,050 ml.'], ['draw', 'Draw a line before the 050.'], ['point', 'Point at the 2.', 'How many whole litres?'], ['pause', 'Wait for 2.'], ['point', 'Point at 050.', 'And how many ml are left?'], ['reveal', 'Write 2 l 50 ml = 2.05 l.']],
    mis: {
      M_DIVIDE_BY_HUNDRED: [['45 l', 'divide by a hundred'], 'How many ml make one litre?', 'Divide by 1,000.'],
      M_LEFTOVER_ML_LOST: [['3 l', 'forgot the rest'], 'What happened to the 250 ml?', 'Write the leftover ml: 3 l 250 ml.'],
      M_ML_PLACE_HOLDER_LOST: [['2 l 5 ml', '2.5'], 'How many digits does the ml part have?', 'Three digits for ml: 050 is 50 ml.'],
      M_MULTIPLY_FOR_BIGGER_UNIT: [['3,000,000', 'times'], 'Is a litre bigger or smaller than a ml?', 'Bigger unit, fewer of them: divide.'],
    },
    checks: [P('Write 4,500 ml in litres.', '4.5 l', 'divide by 1,000'), P('Write 2,050 ml in litres and millilitres.', '2 l 50 ml', 'zero in the ml')],
  }),
};
