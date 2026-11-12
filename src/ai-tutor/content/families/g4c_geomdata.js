// ============================================================================
// GRADE 4 MATHEMATICS, GEOMETRY and DATA: turns, angles, plane figures, and tables.
// Hands-on outcomes (demonstrate a turn, draw a shape, collect data) stay with the teacher:
// these families test only what a tapped or typed answer can.
// Every wrong answer names the library misconception it reveals. All stay reviewed:false until a teacher signs them off.
// ============================================================================
import { fam, randInt, pick, shuffle, distinct, commas, person, mc, tbl } from './g4c_lib.js';

const P = 'GEOMET.POSITION_AND_DIRECTION.', A = 'GEOMET.ANGLES.', F = 'GEOMET.PLANE_FIGURES.', D = 'DATA_H.DATA.';
const DIRS = ['north', 'east', 'south', 'west'];

export const FAMILIES = [
  // ------------------------------------------------------------ CLOCKWISE_ANTI
  fam({ id: 'g4c.pos.turn.direction', cs: `${P}CLOCKWISE_ANTI`, form: 'direct', rung: 1,
    gen: () => {
      const cw = Math.random() < 0.5, obj = pick(['a wheel', 'a tap', 'a door handle', 'a screw', 'a ceiling fan', 'a key']), pe = person();
      const right = cw ? 'clockwise' : 'anticlockwise', wrong = cw ? 'anticlockwise' : 'clockwise';
      const options = mc(right, [[wrong, cw ? 'The hands of a clock turn to the right at the top. That is clockwise.' : 'Anticlockwise is the opposite way from the hands of a clock.', 'M_TURN_CLOCKWISE_AS_LEFT'], ['a quarter turn', 'That says how far it turns, not which way.', 'M_TURN_ANTI_MEANING'], ['a full turn', 'That says how far it turns, not which way.', 'M_TURN_ANTI_MEANING']]);
      return { question: `${pe.name} turns ${obj} ${cw ? 'the same way as the hands of a clock move' : 'the opposite way from the hands of a clock'}. What is this turn called?`, options, instruction: 'Choose the name of the turn.',
        hints: ['Think of the hands of a clock going round.', 'The same way as the hands is clockwise. The opposite way is anticlockwise.'], steps: [cw ? 'The hands of a clock turn clockwise.' : 'The opposite way from the hands of a clock is anticlockwise.', `So the turn is ${right}.`] };
    } }),
  fam({ id: 'g4c.pos.turn.opposite', cs: `${P}CLOCKWISE_ANTI`, form: 'word', rung: 2,
    gen: () => {
      const cw = Math.random() < 0.5, obj = pick(['a lid', 'a bottle top', 'a tap', 'a jar', 'a padlock dial']), pe = person();
      const right = cw ? 'anticlockwise' : 'clockwise', wrong = cw ? 'clockwise' : 'anticlockwise';
      const options = mc(right, [[wrong, 'That is the same way, not the opposite.', 'M_TURN_ANTI_MEANING'], ['a half turn', 'A half turn says how far, not which way.', 'M_TURN_ANTI_MEANING'], ['a quarter turn', 'A quarter turn says how far, not which way.', 'M_TURN_ANTI_MEANING']]);
      return { question: `${pe.name} closes ${obj} by turning it ${cw ? 'clockwise' : 'anticlockwise'}. To open it again, which way must ${pe.she} turn it?`, options, instruction: 'Choose the direction.',
        hints: ['Opening is the opposite of closing.', 'Anti means against.'], steps: [`Closing was ${cw ? 'clockwise' : 'anticlockwise'}.`, `The opposite turn is ${right}.`] };
    } }),

  // ------------------------------------------------------------ TURN_FRACTIONS
  fam({ id: 'g4c.pos.frac.facing', cs: `${P}TURN_FRACTIONS`, form: 'word', rung: 2,
    gen: () => {
      const s = randInt(0, 3), kind = pick([['a half turn', 2], ['a quarter turn clockwise', 1], ['a quarter turn anticlockwise', 3]]), end = (s + kind[1]) % 4, pe = person();
      const all = ['a half turn', 'a quarter turn clockwise', 'a quarter turn anticlockwise', 'a full turn'];
      const options = mc(kind[0], all.filter(a => a !== kind[0]).map(a => [a, a === 'a full turn' ? 'A full turn brings you back to the same way you started.' : a === 'a half turn' ? 'A half turn faces you the opposite way.' : 'Turn clockwise: north, east, south, west. Check which side you end up on.', a === 'a full turn' ? 'M_TURN_FULL_AS_NO_TURN' : a === 'a half turn' ? 'M_TURN_HALF_AS_RIGHT' : 'M_TURN_FACING_WRONG']));
      return { question: `${pe.name} stands in the school compound facing ${DIRS[s]}. After one turn ${pe.she} faces ${DIRS[end]}. Which turn did ${pe.she} make?`, options, instruction: 'Choose the turn.',
        hints: ['Clockwise from north goes east, then south, then west.', 'A half turn faces the opposite way.'], steps: [`From ${DIRS[s]} to ${DIRS[end]}.`, `That is ${kind[0]}.`] };
    } }),
  fam({ id: 'g4c.pos.frac.fraction', cs: `${P}TURN_FRACTIONS`, form: 'direct', rung: 1,
    gen: () => {
      const k = pick([[1, 'a quarter turn'], [2, 'a half turn'], [4, 'a full turn']]), pe = person(), way = pick(['clockwise', 'anticlockwise']);
      const names = ['a quarter turn', 'a half turn', 'a full turn'];
      const options = mc(k[1], names.filter(n => n !== k[1]).map(n => [n, 'Four quarter turns make a full turn, so two quarter turns make a half turn.', 'M_TURN_QUARTER_AS_HALF']));
      return { question: `In a playground game ${pe.name} turns on the spot. ${pe.She} makes ${k[0]} quarter ${k[0] === 1 ? 'turn' : 'turns'} ${way} one after the other without stopping. How far has ${pe.she} turned altogether?`, options, instruction: 'Choose the turn.',
        hints: ['Four quarter turns make a full turn.', 'Two quarter turns make a half turn.'], steps: [`${k[0]} quarter ${k[0] === 1 ? 'turn is' : 'turns are'} ${k[1].replace('a ', '')} of the way round.`, `It is ${k[1]}.`] };
    } }),

  // ------------------------------------------------------------ ANGLE_AT_POINT
  fam({ id: 'g4c.ang.point.what', cs: `${A}ANGLE_AT_POINT`, form: 'direct', rung: 1,
    gen: () => {
      const o = pick([['the two arms of a pair of scissors', 'the blades'], ['two sticks joined at one end', 'the sticks'], ['the hands of a clock', 'the hands'], ['an open book', 'the pages'], ['the two sides of a folded paper', 'the paper'], ['a door and its frame', 'the door']]), pe = person();
      const options = mc('an angle', [['a circle', 'A circle has no corner where two lines meet.', 'M_ANGLE_IS_THE_LINE'], ['a straight line', 'An angle is the opening between the lines, not a line.', 'M_ANGLE_IS_THE_LINE'], ['a side', 'A side is a line. An angle is the opening where two lines meet.', 'M_ANGLE_IS_THE_LINE']]);
      return { question: `${pe.name} opens ${o[0]}. What is made between ${o[1]} where they meet at a point?`, options, instruction: 'Choose the name.',
        hints: ['Two lines meet at one point.', 'The opening between them has a name.'], steps: [`Two lines meet at a point.`, 'The opening between them is an angle.'] };
    } }),
  fam({ id: 'g4c.ang.point.bigger', cs: `${A}ANGLE_AT_POINT`, form: 'word', rung: 2,
    gen: () => {
      const a = pick([10, 15, 20]), b = pick([30, 40, 50]), turn = pick(['a quarter turn', 'a half turn']);
      const options = mc('They are the same size.', [['The one with the longer arms.', 'Arm length does not change the size of the angle. The opening does.', 'M_ANGLE_ARM_LENGTH'], ['The one with the shorter arms.', 'Arm length does not change the size of the angle. The opening does.', 'M_ANGLE_ARM_LENGTH']]);
      return { question: `Angle P has arms ${a} cm long and is opened ${turn}. Angle Q has arms ${b} cm long and is opened ${turn}. Which angle is bigger?`, options, instruction: 'Choose one.',
        hints: ['The size of an angle is how far the arms are opened.', 'Does the length of the arms change how far they are opened?'], steps: ['Both angles are opened the same amount.', 'So they are the same size.'] };
    } }),

  // ------------------------------------------------------------ ANGLES_IN_OBJECTS
  fam({ id: 'g4c.ang.obj.corners', cs: `${A}ANGLES_IN_OBJECTS`, form: 'direct', rung: 1,
    gen: () => {
      const o = pick([['a rectangle', 4], ['a triangle', 3], ['a square', 4], ['a book cover', 4], ['a triangular flag', 3], ['a door', 4], ['a chalkboard', 4]]), pe = person();
      return { question: `${pe.name} counts the corners of ${o[0]}. Each corner is an angle. How many angles does ${o[0]} have?`, answer: o[1],
        wrong: [[o[1] * 2, 'You counted the sides as well as the corners. Count each corner once.', 'M_ANGLE_COUNT_SIDES'], [o[1] === 4 ? 2 : 6, 'Count the corners one by one.', 'M_ANGLE_RECTANGLE_ANGLES'], [o[1] === 4 ? 3 : 4, 'Count the corners one by one.', 'M_ANGLE_COUNT_SIDES'], [0, 'Where two sides meet there is a corner, so there are angles.', 'M_ANGLE_CURVED_HAS_ANGLE']],
        hints: ['A corner is where two sides meet.', 'Touch each corner once as you count.'], steps: [`${o[0][0].toUpperCase() + o[0].slice(1)} has ${o[1]} corners.`, `So it has ${o[1]} angles.`], chk: (x) => x === o[1] };
    } }),
  fam({ id: 'g4c.ang.obj.which', cs: `${A}ANGLES_IN_OBJECTS`, form: 'direct', rung: 2,
    gen: () => {
      const good = pick(['the corner of a page of a book', 'the corner of a window', 'the corner of a table top', 'the corner of a classroom wall', 'the corner of a chalkboard']), bad = shuffle(['the edge of a round plate', 'the rim of a cup', 'the side of a ball', 'the edge of a coin', 'the curve of a wheel']).slice(0, 3);
      const options = mc(good, bad.map(b => [b, 'This is curved. A curved edge has no corner where two lines meet.', 'M_ANGLE_CURVED_HAS_ANGLE']));
      return { question: `${person().name} looks for a square corner, which is a right angle. Which of these has one?`, options, instruction: 'Choose the object.',
        hints: ['A right angle is a square corner, like the corner of a page.', 'Curved edges do not have square corners.'], steps: ['A right angle is where two straight edges meet like the corner of a page.', `${good[0].toUpperCase() + good.slice(1)} has one.`] };
    } }),

  // ------------------------------------------------------------ IDENTIFY_FIGURES
  fam({ id: 'g4c.fig.id.object', cs: `${F}IDENTIFY_FIGURES`, form: 'direct', rung: 1,
    gen: () => {
      const o = pick([['the top of a round plate', 'circle'], ['an egg drawn flat', 'oval'], ['a slice of bread cut square', 'square'], ['a door of a cupboard', 'rectangle'], ['a flag flown from a pole', 'triangle'], ['a road sign with three sides', 'triangle'], ['a wall tile with four equal sides', 'square'], ['a football pitch from above', 'rectangle']]), pe = person();
      const names = ['circle', 'oval', 'square', 'rectangle', 'triangle'].filter(n => n !== o[1]);
      const options = mc(o[1], (o[1] === 'circle' ? ['oval', 'square', 'triangle'] : o[1] === 'oval' ? ['circle', 'square', 'triangle'] : shuffle(names).slice(0, 3)).map(n => [n, n === 'oval' || n === 'circle' ? 'A circle is the same width all the way round; an oval is longer one way.' : 'Count the sides and the corners to check.', 'M_SHAPE_OVAL_CIRCLE']));
      return { question: `${pe.name} looks at ${o[0]}. What shape is it?`, options, instruction: 'Choose the shape.',
        hints: ['Count the sides and the corners.', 'A circle and an oval have no straight sides.'], steps: [`Look at ${o[0]}.`, `Its shape is a ${o[1]}.`] };
    } }),
  fam({ id: 'g4c.fig.id.turned', cs: `${F}IDENTIFY_FIGURES`, form: 'word', rung: 2,
    gen: () => {
      const o = pick(['tile', 'napkin', 'card', 'cloth', 'sticker']), pe = person();
      const options = mc('square', [['diamond', 'A diamond is not a shape on its own here. Turn the page: it is still a square with four equal sides.', 'M_SHAPE_ORIENTATION'], ['triangle', 'Count the sides: there are four, not three.', 'M_SHAPE_ORIENTATION'], ['circle', 'Circles have no straight sides.', 'M_SHAPE_ORIENTATION']]);
      return { question: `${pe.name} puts a square ${o} on a table so that it stands on one corner. It has four equal sides and four square corners. What shape is the ${o}?`, options, instruction: 'Choose the shape.',
        hints: ['Does turning a shape change its sides and corners?', 'Count the sides.'], steps: ['Turning a shape does not change its sides or corners.', 'It is still a square.'] };
    } }),

  // ------------------------------------------------------------ FIGURE_PROPERTIES
  fam({ id: 'g4c.fig.prop.opposite', cs: `${F}FIGURE_PROPERTIES`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(6, 15), b = randInt(3, a - 1), pe = person();
      return { question: `A rectangle has two sides of ${a} cm and two sides of ${b} cm. How long is the side opposite a ${a} cm side?`, answer: a,
        wrong: [[b, 'The opposite sides of a rectangle are equal, so the side opposite a ' + a + ' cm side is also that long.', 'M_PROP_RECT_ALL_SIDES_EQUAL'], [a + b, 'A side is one length. Opposite sides are equal.', 'M_PROP_RECT_ALL_SIDES_EQUAL'], [2 * a, 'A side is one length. Opposite sides are equal.', 'M_PROP_RECT_ALL_SIDES_EQUAL']],
        hints: ['Opposite sides of a rectangle are equal.', 'The side opposite a long side is also long.'], steps: ['In a rectangle, opposite sides are equal.', `The opposite side is ${a} cm.`], chk: (x) => x === a };
    } }),
  fam({ id: 'g4c.fig.prop.which', cs: `${F}FIGURE_PROPERTIES`, form: 'direct', rung: 2,
    gen: () => {
      const q = pick([['four equal sides and four square corners', 'square', ['rectangle that is not a square', 'triangle', 'circle']], ['three straight sides', 'triangle', ['square', 'rectangle', 'oval']], ['two long sides, two short sides and four square corners', 'rectangle', ['triangle', 'circle', 'oval']]]), pe = person();
      const options = mc(q[1], q[2].map(n => [n, 'Check the sides and the corners against what is described.', 'M_PROP_COUNT_SIDES_CORNERS']));
      return { question: `${pe.name} draws a shape with ${q[0]}. Which shape is it?`, options, instruction: 'Choose the shape.',
        hints: ['Count the sides and corners described.', 'Think about which shape has them.'], steps: [`The shape has ${q[0]}.`, `It is a ${q[1]}.`] };
    } }),

  // ------------------------------------------------------------ DATA_MATERIALS
  fam({ id: 'g4c.data.mat.tool', cs: `${D}DATA_MATERIALS`, form: 'direct', rung: 1,
    gen: () => {
      const t = pick([['the number of learners who like each fruit', 'tally marks in a table'], ['how many learners are in each class', 'a table'], ['how many learners walk, cycle or take a bus to school', 'tally marks in a table'], ['the number of goals scored by each team', 'a table']]), pe = person();
      const options = mc(t[1], [['a ruler', 'A ruler measures length. It does not record counts.', 'M_DATA_WRONG_TOOL'], ['a clock', 'A clock tells the time. It does not record counts.', 'M_DATA_WRONG_TOOL'], ['a bucket', 'A bucket holds things. It does not record counts.', 'M_DATA_WRONG_TOOL']]);
      return { question: `${pe.name} wants to record ${t[0]}. What can ${pe.she} use to record it?`, options, instruction: 'Choose the best way.',
        hints: ['Data is recorded by writing it down.', 'A table keeps data in rows and columns.'], steps: ['Counts can be written as tally marks or numbers in a table.', `The best way is ${t[1]}.`] };
    } }),
  fam({ id: 'g4c.data.mat.tally', cs: `${D}DATA_MATERIALS`, form: 'word', rung: 2,
    gen: () => {
      const g = randInt(1, 4), r = randInt(1, 4), n = g * 5 + r, pe = person(), th = pick(['learners wearing red', 'cars that pass the school gate', 'goals scored in a match', 'books borrowed']);
      return { question: `${pe.name} records ${th} with tally marks. The tally shows ${g} bundles of five (four lines with a line across) and ${r} more single lines. How many are recorded?`, answer: n,
        wrong: [[g * 4 + r, 'A crossed bundle counts as five, not four.', 'M_DATA_TALLY_ONES'], [g + r, 'Each bundle is worth five, so multiply the bundles by 5.', 'M_DATA_TALLY_ONES'], [g * 5, 'The single lines are missing.', 'M_DATA_TALLY_ONES'], [g * 5 + r + 1, 'Count the single lines again.', 'M_DATA_TALLY_ONES']],
        hints: ['Each crossed bundle is 5.', 'Count in fives, then add the single lines.'], steps: [`${g} bundles of 5 is ${g * 5}.`, `${g * 5} + ${r} = ${n}.`], chk: (x) => x === g * 5 + r };
    } }),

  // ------------------------------------------------------------ TABLE_RECORD
  fam({ id: 'g4c.data.table.total', cs: `${D}TABLE_RECORD`, form: 'table', rung: 2,
    gen: () => {
      const items = shuffle(['Mangoes', 'Oranges', 'Bananas', 'Pawpaws', 'Avocados']).slice(0, randInt(3, 4)), vals = items.map(() => randInt(3, 15)), tot = vals.reduce((a, b) => a + b, 0), pe = person();
      return { question: `${pe.name} sold fruit at the school market. The table shows how many of each kind were sold. How many fruits were sold in all?`, model: tbl(['Fruit', 'Number sold'], items.map((it, i) => [it, String(vals[i])])), answer: tot,
        wrong: [[tot - vals[vals.length - 1], 'One row of the table was left out. Add every row.', 'M_TABLE_ITEM_LEFT_OUT'], [tot + vals[0], 'One row was counted twice. Add each row once.', 'M_TABLE_ITEM_LEFT_OUT'], [Math.max(...vals), 'That is the biggest number in the table, not the total.', 'M_TABLE_NAME_NOT_NUMBER'], [tot - vals[0], 'One row of the table was left out. Add every row.', 'M_TABLE_ITEM_LEFT_OUT']],
        hints: ['Add the numbers in the second column.', 'Tick each row as you add it.'], steps: [`${vals.join(' + ')}.`, `The total is ${tot}.`], chk: (x) => x === vals.reduce((a, b) => a + b, 0) };
    } }),
  fam({ id: 'g4c.data.table.fromtally', cs: `${D}TABLE_RECORD`, form: 'word', rung: 2,
    gen: () => {
      const g1 = randInt(1, 3), r1 = randInt(0, 4), g2 = randInt(1, 3), r2 = randInt(1, 4), pe = person(), a = pick(['football', 'netball', 'running']), b = pick(['swimming', 'volleyball', 'athletics']);
      const n1 = g1 * 5 + r1, n2 = g2 * 5 + r2;
      if (n1 === n2) return null;
      return { question: `${pe.name} tallies the games learners like. ${a[0].toUpperCase() + a.slice(1)} has ${g1} bundle${g1 > 1 ? 's' : ''} of five and ${r1} single line${r1 === 1 ? '' : 's'}. ${b[0].toUpperCase() + b.slice(1)} has ${g2} bundle${g2 > 1 ? 's' : ''} of five and ${r2} single line${r2 === 1 ? '' : 's'}. ${pe.She} puts the counts in a table. What number goes in the table beside ${a}?`, answer: n1,
        wrong: [[g1 * 4 + r1, 'A crossed bundle counts as five, not four.', 'M_TABLE_TALLY_COUNTS_BARS'], [n2, `That is the number for ${b}. Write the number for ${a}.`, 'M_TABLE_ITEM_LEFT_OUT'], [g1 + r1, 'Each bundle is worth five.', 'M_TABLE_TALLY_COUNTS_BARS']],
        hints: ['Each crossed bundle is 5.', 'Count in fives and add the single lines.'], steps: [`${g1} bundles of 5 is ${g1 * 5}.`, `${g1 * 5} + ${r1} = ${n1}.`], chk: (x) => x === g1 * 5 + r1 };
    } }),

  // ------------------------------------------------------------ INTERPRET_TABLE
  fam({ id: 'g4c.data.read.most', cs: `${D}INTERPRET_TABLE`, form: 'table', rung: 1,
    gen: () => {
      const items = shuffle(['Maize', 'Beans', 'Millet', 'Sorghum', 'Cassava']).slice(0, 4), vals = shuffle([randInt(5, 9), randInt(10, 14), randInt(15, 19), randInt(20, 25)]), mx = vals.indexOf(Math.max(...vals)), mn = vals.indexOf(Math.min(...vals)), most = Math.random() < 0.5, i = most ? mx : mn, pe = person();
      if (i === items.length - 1 && Math.random() < 0.5) return null;
      const options = mc(items[i], [[items[items.length - 1], 'You read the last row. Compare the numbers, not the order of the list.', 'M_TABLE_MOST_AS_LAST_ROW'], ...items.filter((_, k) => k !== i && k !== items.length - 1).map(n => [n, 'Compare the numbers in the table to see which is the ' + (most ? 'largest' : 'smallest') + '.', 'M_TABLE_MOST_AS_LAST_ROW'])].filter(w => w[0] !== items[i]));
      if (!options) return null;
      return { question: `The table shows how many bags of each crop a farmer ${pe.she === 'she' ? 'sold' : 'sold'}. Which crop sold the ${most ? 'most' : 'fewest'} bags?`, model: tbl(['Crop', 'Bags sold'], items.map((it, k) => [it, String(vals[k])])), options, instruction: `Choose the crop that sold the ${most ? 'most' : 'fewest'}.`,
        hints: ['Look at the numbers in the second column.', most ? 'Find the biggest number.' : 'Find the smallest number.'], steps: [`The numbers are ${vals.join(', ')}.`, `The ${most ? 'biggest' : 'smallest'} is ${vals[i]}: ${items[i]}.`] };
    } }),
  fam({ id: 'g4c.data.read.difference', cs: `${D}INTERPRET_TABLE`, form: 'table', rung: 2,
    gen: () => {
      const items = shuffle(['Class 4A', 'Class 4B', 'Class 4C', 'Class 4D']).slice(0, 3), vals = [randInt(20, 45), randInt(20, 45), randInt(20, 45)], pe = person();
      if (!distinct(...vals)) return null;
      const big = vals.indexOf(Math.max(...vals)), small = vals.indexOf(Math.min(...vals)), d = vals[big] - vals[small];
      return { question: `The table shows how many learners are present in three classes. How many more learners are in ${items[big]} than in ${items[small]}?`, model: tbl(['Class', 'Learners present'], items.map((it, k) => [it, String(vals[k])])), answer: d,
        wrong: [[vals[big] + vals[small], 'More means find the difference: subtract.', 'M_TABLE_ADDS_FOR_DIFFERENCE'], [vals[big], 'That is the number in the bigger class. Find how many more.', 'M_TABLE_ADDS_FOR_DIFFERENCE'], [vals[small], 'That is the number in the smaller class. Find how many more.', 'M_TABLE_ADDS_FOR_DIFFERENCE']],
        hints: ['How many more means find the difference.', 'Subtract the smaller number from the bigger.'], steps: [`${vals[big]} - ${vals[small]} = ${d}.`, `There are ${d} more learners.`], chk: (x) => x + vals[small] === vals[big] };
    } }),
];
