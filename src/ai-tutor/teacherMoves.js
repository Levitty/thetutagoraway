// ============================================================================
// FIVE-MINUTE MOVES — what a teacher can do away from the screen about one
// skill. Moved out of TeacherDashboard.jsx (28 Oct) so the homework view and
// its tests can use the same advice the gap rows give: one voice for "what to
// do on Tuesday", wherever the teacher meets it.
// ============================================================================

// A concrete, physical-materials suggestion per stuck skill — the KICD
// designs' own suggested resources (bottle tops, bundles of sticks, cut-outs).
//
// Ordered, most specific first. This was seven patterns covering 62 of the 221
// primary skills, so 72% of the gaps a teacher is shown came back with "five
// minutes with physical counters" — which is not advice about geometry, or
// statistics, or telling the time. Every line below is something a teacher can
// do with what is already in a Kenyan classroom.
export const MOVES = [
  // Number
  [/PRENUMBER|COUNTING|NUMBER_WORDS|NUMBERS_WORDS/, 'Count real objects together out loud, then write the numeral and say it back — the saying and the writing have to meet.'],
  [/PLACE_VALUE|PLACE|BIG_NUMBERS/, 'Place-value chart on paper: build the number with bottle tops in columns, then read it aloud.'],
  [/ORDER_ROUND|ROUND|COMPARE/, 'Draw a number line on paper and let them peg the number where it belongs — rounding is "which end is it nearer?".'],
  [/ODD_EVEN/, 'Pair the counters up. If one is left over with no partner, it is odd — that is the whole rule.'],
  [/ROMAN/, 'Lay out sticks for I, V and X and build the number, then read it back left to right.'],
  [/FACTOR|MULTIPLE|PRIME|DIVISIBILITY|LCM|HCF|GCD/, 'Arrange counters into rectangles. The ones that make a neat rectangle are the factors; the ones that cannot are not.'],
  [/PROFIT_LOSS|INTEREST|DISCOUNT/, 'Real prices on paper: what it cost, what it sold for, and what is left over. Name the leftover before calling it a percentage.'],
  [/STANDARD_FORM/, 'Write the number out in full, then count the places the point moves. The count is the power.'],
  [/UNIT_CONVERSION|CONVERSION/, 'Lay the units out largest to smallest and step between them one at a time, saying each × 10 or ÷ 10 aloud.'],
  [/SQUARE|ROOT|INDICES|POWER/, 'Build an actual square out of counters — 4 rows of 4. The square number is how many you used.'],
  [/INTEGER|TEMPERATURE|NEGATIVE/, 'A number line on the floor with zero in the middle. Stand on a number and walk the moves.'],
  [/DECIMAL/, 'The same place-value chart with a point drawn in — tenths to the right of it, and read the whole thing aloud.'],
  [/PERCENT/, 'A 10 by 10 grid on squared paper. Shade it. Per cent just means "out of this hundred".'],
  [/RATIO|PROPORTION|SHARING/, 'Share bottle tops into the groups the ratio asks for, one round at a time, then count what each group holds.'],
  [/BODMAS|ORDER_OF_OP/, 'Work one line together, saying which part is done next and why, before anything is written down.'],
  [/FRACTION|MIXED_NUMBER|RECIPROCAL/, 'Cut a paper circle into equal parts together — fold first, cut second, name each piece.'],
  [/ADD/, 'Bundle sticks in tens — build both numbers, trade ten singles for one bundle, then retry on HOREB.'],
  [/SUB/, 'Act it out with bottle tops the child physically hands to you, counting what remains each time.'],
  [/MULT/, 'Plates and stones: 3 plates, 4 stones on each — how many plates? how many on each? how many altogether?'],
  [/DIV/, 'Share real counters into equal groups, one at a time, before writing anything.'],
  // Measurement
  [/TIME|CLOCK|TIMETABLE/, 'A paper-plate clock with movable hands — the child sets the times you call out, then reads a real bus timetable.'],
  [/MONEY/, 'Real coins and written price tags. Buy something from them and make them give you the change.'],
  [/LENGTH|DISTANCE/, 'Measure three things in the room with a ruler or a metre rule and write each one down with its unit.'],
  [/MASS|WEIGHT/, 'A simple balance with stones on one side. Heavier, lighter, about the same — then put numbers to it.'],
  [/CAPACITY|VOLUME_LIQUID/, 'Fill a small bottle from a bigger one and count how many it takes. That count IS the relationship.'],
  [/PERIMETER/, 'Run a string all the way round a desk, then straighten the string and measure it. That is the perimeter.'],
  [/AREA/, 'Squared paper: draw the shape and count the squares inside it before using any formula.'],
  [/VOLUME|CUBOID/, 'Stack small boxes or cubes into a bigger box and count them, layer by layer.'],
  [/SPEED/, 'Walk a measured distance and time it. Speed is just how much distance fits into the time.'],
  [/DENSITY/, 'Two objects of the same size but different weight, in the hand. Same space, different mass.'],
  // Geometry
  [/ANGLE/, 'The corner of a sheet of paper is a right angle. Hold it against the angle — bigger, smaller, or the same?'],
  [/TRIANGLE|PYTHAGORAS/, 'Cut triangles out of paper and sort them by their sides and corners before naming any of them.'],
  [/LINES|PARALLEL|PERPENDICULAR/, 'Find them in the room — the edges of a door, the lines on a book — and trace them with a finger.'],
  [/SHAPE|POLYGON|3D|OBJECT|NET|FIGURE|CIRCUMFERENCE|CIRCLE/, 'Fold and cut the shape out of paper, then count its sides, corners and faces by touching each one.'],
  [/POSITION|DIRECTION|COORDINATE|BEARING/, 'Stand up and face the direction. Left and right are from the walker’s point of view, not the page’s.'],
  [/SYMMETRY|TRANSFORM|REFLECT|ROTAT/, 'Fold the paper shape in half. If the halves land on each other, that fold is a line of symmetry.'],
  [/CONSTRUCT/, 'Do it once slowly with a ruler and compasses, saying each step aloud before drawing it.'],
  // Algebra
  [/LETTERS|EXPRESSION|ALGEBRA|EQUATION|MISSING_NUMBER|SUBSTITUT|SIMPLIFY/, 'Hide counters under a cup. The cup is the letter; how many are under it, and how do you know?'],
  [/PATTERN|SEQUENCE/, 'Lay the pattern out in bottle tops and ask what comes next — then what the tenth one would be, without laying it out.'],
  [/INEQUALIT/, 'Two unequal piles of counters. The open end of the sign always faces the bigger pile.'],
  // Statistics
  [/TALLY|DATA/, 'Count something real in the room — shoes, windows — and tally it in fives as you go.'],
  [/MEAN|AVERAGE|MEDIAN|MODE/, 'Build towers of counters of different heights, then level them off. The levelled height is the mean.'],
  [/GRAPH|CHART|PICTOGRAPH|DISPLAY/, 'Draw the graph by hand from the tally they just made, then ask them a question only the graph can answer.'],
  [/PROBABILIT|CHANCE/, 'Bottle tops of two colours in a bag. Predict, draw one out, repeat, and keep score.'],
];
export const fiveMinuteMove = (gap) => {
  const id = gap?.id || '';
  const hit = MOVES.find(([re]) => re.test(id));
  if (hit) return hit[1];
  // The fallback names the strand, so even here a teacher is not told to count
  // counters at a child who is stuck on a bar chart.
  return `Five minutes on ${(gap?.strand || 'this').toLowerCase()} away from the screen — do one together, out loud, with something they can hold, then retry the skill on HOREB.`;
};
