import { mi, pk, P, E, H, LIT, TC } from '../maths-g6-lib.mjs';
export const key = 'MEASUR.AREA';
export const packNotes = 'The area of a triangle is shown as half of a rectangle by cutting a paper rectangle along its diagonal, so the half has a reason. Combined shapes are split with a coloured line before any working; the circle is drawn on 1 cm squared paper.';
export const pre = {
  AREA_CIRCLE_BY_COUNTING: [['G5:MEASUR.AREA.CM2_UNIT_MEANING', E, 'Each square counted is 1 cm2.']],
};
export const mis = [
  mi('AREA_TRIANGLE', 'M_HALF_BOTH', 'Halves both the base and the height before multiplying.', ['Triangle base 8 cm, height 5 cm: area?', '10 cm2 (4 x 2.5)', '20 cm2'], 'Knows "half" is in the rule and applies it to every length.', 'A quarter of base times height as an option.', 'Cut a rectangle 8 by 5 along its diagonal: each triangle is half of 40.', LIT),
  mi('AREA_TRIANGLE', 'M_AREA_IN_CM', 'Gives an area in cm instead of cm2.', ['Triangle base 8 cm, height 5 cm: area?', '20 cm', '20 cm2'], 'Copies the unit of the lengths.', 'The right number with the wrong unit.', 'Area counts squares: each square is 1 cm by 1 cm, written cm2.'),
  mi('AREA_COMBINED', 'M_OVERLAP_COUNTED_TWICE', 'Uses a length of the whole shape for one of its parts, so a piece is counted twice.', ['An L-shape is a 10 cm by 4 cm rectangle on top of a 4 cm by 6 cm rectangle (total height 10 cm). Area?', '80 cm2 (10 x 4 + 4 x 10)', '64 cm2 (10 x 4 + 4 x 6)'], 'Reads the 10 cm side for the second rectangle as well.', 'The area with the corner counted twice.', 'Draw the split line and write the two lengths of each part on the part before multiplying.'),
  mi('AREA_COMBINED', 'M_TRIANGLE_PART_NOT_HALVED', 'Forgets to halve the triangle part of a combined shape.', ['A house shape: a 6 cm square with a triangle roof of base 6 cm and height 4 cm. Area?', '60 cm2 (36 + 24)', '48 cm2 (36 + 12)'], 'Works the triangle as a rectangle while busy with the other parts.', 'The answer with the triangle not halved.', 'Name each part first: square, triangle. The triangle uses half base times height.'),
  mi('AREA_CIRCLE_BY_COUNTING', 'M_SQUARE_AROUND_CIRCLE', 'Counts every square inside the square drawn round the circle.', ['A circle of diameter 6 cm is drawn on 1 cm squares. Estimate its area.', '36 cm2 (the 6 by 6 square)', 'about 28 cm2'], 'Takes the box the circle sits in as the circle.', 'The area of the surrounding square as an option.', 'Shade only the squares inside the circle; the corners of the box are outside it.'),
  mi('AREA_CIRCLE_BY_COUNTING', 'M_ESTIMATE_CALLED_EXACT', 'Believes counting squares gives the exact area.', ['A circle covers 20 whole squares and 12 part squares, so about 26 cm2. Is this exact?', 'Yes, it was counted', 'No: the part squares were each taken as a half, so it is an estimate'], 'Thinks counting is always exact.', 'A yes-or-no choice about the estimate.', 'Look at the part squares: some are nearly whole, some are tiny, so taking each as a half is only close.'),
];
export const pack = {
  AREA_TRIANGLE: pk({
    key_step: 'The child shows that a triangle is half of a rectangle with the same base and height, and uses the height at right angles to the base.',
    floor: ['Finds the area of a rectangle.', 'Area of a rectangle 8 cm by 5 cm?', '40 cm2'],
    reps: ['a paper rectangle cut along its diagonal', 'a triangle drawn on squared paper with its height dotted', 'the rule half x base x height'],
    steps: ['Find the base.', 'Find the height at right angles to the base, not a slanting side.', 'Multiply base by height.', 'Halve, and write cm2.'],
    contexts: ['a triangular flag for sports day', 'a gable of a house', 'a triangular plot'],
    board: [['draw', 'Draw a rectangle 8 by 5 and its diagonal.'], ['point', 'Point at one triangle.', 'What part of the rectangle is this triangle?'], ['pause', 'Wait for half.'], ['write', 'Write area = half of 8 x 5.'], ['predict', 'Ask the child for the area before you write it.']],
    mis: {
      M_NO_HALF: [['40', 'base times height'], 'Is the triangle the whole rectangle?', 'The triangle is half of the rectangle: halve 40.'],
      M_SLANT_SIDE_AS_HEIGHT: [['the slanting side', '8 for height'], 'Does that side stand at right angles to the base?', 'The height is the straight-up distance, dotted at right angles.'],
      M_PERIMETER_FOR_AREA: [['16', 'add the sides'], 'Are we going round the edge or covering the inside?', 'Area covers the inside: half base times height.'],
      M_HALF_BOTH: [['10', 'half of each'], 'How many times do we halve?', 'Halve once: half of 8 x 5.'],
      M_AREA_IN_CM: [['cm', 'centimetres'], 'Are we counting lengths or squares?', 'Area is in square units: cm2.'],
    },
    checks: [P('A triangle has base 8 cm and height 5 cm. What is its area?', '20 cm2', 'half base times height'), P('A triangle has area 24 cm2 and base 8 cm. What is its height?', '6 cm', 'missing height')],
  }),
  AREA_COMBINED: pk({
    key_step: 'The child splits the shape into rectangles, squares and triangles with a line, writes the two lengths of each part on it, and adds (or subtracts a cut-out).',
    floor: ['Finds areas of rectangles and triangles.', 'Area of a triangle with base 6 cm and height 4 cm?', '12 cm2'],
    reps: ['a paper shape cut into pieces', 'the shape with a coloured split line and lengths on each part', 'a table of parts and their areas'],
    steps: ['Draw a line to split the shape.', 'Write the length and width of each part, finding missing sides by subtracting.', 'Find each area.', 'Add the parts, or take away a part that is cut out.'],
    contexts: ['a classroom floor with an alcove', 'a house wall with a roof', 'a garden with a path cut out'],
    board: [['draw', 'Draw a house shape: a 6 cm square with a triangle roof of height 4 cm.'], ['point', 'Point at the roof.', 'What shape is this part, and what rule does it use?'], ['pause', 'Wait for triangle, half base times height.'], ['child_draws', 'Ask the child to write the area inside each part.'], ['reveal', 'Write 36 + 12 = 48 cm2.']],
    mis: {
      M_ONE_PART_ONLY: [['only the top', 'one rectangle'], 'Does your answer cover the whole shape?', 'Find every part and add them.'],
      M_CUT_OUT_ADDED: [['64', 'add the hole'], 'Is the cut-out part still there?', 'A cut-out is taken away.'],
      M_OVERLAP_COUNTED_TWICE: [['80', 'used the 10 again'], 'Is the second rectangle really 10 cm long?', 'Write each part\'s own lengths; the overlap is counted once.'],
      M_TRIANGLE_PART_NOT_HALVED: [['60', '6 times 4'], 'Is the roof a rectangle or a triangle?', 'Halve the triangle part.'],
    },
    checks: [P('A rectangle 10 cm by 6 cm has a 2 cm by 2 cm square cut out. What area is left?', '56 cm2', 'take away a cut-out'), P('A house shape is a 6 cm square with a triangle roof of base 6 cm and height 4 cm. What is its area?', '48 cm2', 'rectangle and triangle')],
  }),
  AREA_CIRCLE_BY_COUNTING: pk({
    key_step: 'The child counts the whole squares inside the circle, counts the part squares and takes each as half, adds, and says the answer is an estimate.',
    floor: ['Counts squares to find an area.', 'A shape covers 12 whole squares of 1 cm2. What is its area?', '12 cm2'],
    reps: ['a round lid traced on squared paper', 'whole squares ticked and part squares dotted', 'a table: whole, part, half of part, total'],
    steps: ['Tick every whole square inside the circle.', 'Dot every part square.', 'Add the whole squares and half the part squares.', 'Say "about" and the unit cm2.'],
    contexts: ['a round tabletop', 'a circular flower bed', 'the bottom of a sufuria'],
    board: [['draw', 'Draw a circle on squared paper.'], ['count', 'Count the whole squares inside with the child.'], ['count', 'Count the part squares with the child.'], ['point', 'Point at a part square.', 'Is this a whole square of the circle?'], ['pause', 'Wait for the child to say part of one.'], ['write', 'Write wholes + half the parts = about ... cm2.']],
    mis: {
      M_COUNT_WHOLE_ONLY: [['20', 'only the full ones'], 'Are the part squares inside the circle at all?', 'Add half of the part squares too.'],
      M_COUNT_PART_AS_WHOLE: [['32', 'all of them'], 'Is a part square a whole square?', 'Take each part square as about a half.'],
      M_SQUARE_AROUND_CIRCLE: [['36', 'six by six'], 'Are the corners of the box inside the circle?', 'Count only squares inside the circle.'],
      M_ESTIMATE_CALLED_EXACT: [['exact', 'it is counted'], 'Is every part square exactly a half?', 'It is an estimate: say "about".'],
    },
    checks: [P('A circle covers 20 whole squares and 12 part squares of 1 cm2. Estimate its area.', 'about 26 cm2', 'wholes plus half the parts'), P('A circle covers 30 whole squares and 10 part squares of 1 cm2. Estimate its area.', 'about 35 cm2', 'wholes plus half the parts')],
  }),
};
