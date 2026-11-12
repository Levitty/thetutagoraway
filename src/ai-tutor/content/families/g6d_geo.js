// ============================================================================
// GRADE 6 MATHS, GEOMETRY AND DATA (12 Nov 2026): families for skills that had none or one structure.
// Construction and drawing outcomes (lines, triangles, piling) are hands-on: these questions test the idea behind the practical,
// not the practical itself. Against curriculum/mathematics/g6.json (curriculumMap.g6.js). DRAFT: off for children until a teacher signs them off.
// ============================================================================
import { fam, ask, randInt, pick, shuffle, commas, person, distinct, mc, tbl } from './g6d_lib.js';

const N = 'GEOMET.LINES.', G = 'GEOMET.ANGLES.', H = 'GEOMET.3_D_OBJECTS.', B = 'DATA_H.BAR_GRAPHS.';

export const FAMILIES = [
  // ------------------------------------------------------------ LINES
  fam({ id: 'g6d.lines.which-parallel', cs: `${N}PARALLEL_LINES`, form: 'direct', rung: 1,
    gen: () => {
      const right = pick(['The two long rails of a railway line', 'Two lines in an exercise book', 'The two long edges of a ruler', 'The top and bottom edges of a classroom door', 'Two slanting rails of a hillside path, the same distance apart all the way']);
      const w1 = pick(['The two legs of a leaning ladder, which are closer together at the top', 'The two sides of a roof that meet at the ridge', 'Two roads that run the same way but meet at a junction ahead']);
      const w2 = pick(['A level shelf and the sloping line of the roof above it', 'The top of the blackboard and a line sloping down from it', 'A level beam and a slanting support under it']);
      const options = mc(right, [[w1, 'These lines are not the same distance apart everywhere, so they will meet. Pointing the same way is not enough.', 'M_SAME_DIRECTION_ENOUGH'], [w2, 'A level line and a sloping line are not parallel. Parallel lines are the same distance apart and may be level or slanting.', 'M_PARALLEL_MEANS_HORIZONTAL']]);
      return { question: `${person().name} looks for parallel lines around ${pick(['school', 'home', 'the village', 'the market'])}. Which pair of lines is parallel?`, options, instruction: 'Choose the best answer.',
        hints: ['Parallel lines are always the same distance apart.', 'They never meet, however far they are drawn.'], steps: ['Parallel lines stay the same distance apart.', `${right} is a pair of parallel lines.`] };
    } }),
  fam({ id: 'g6d.lines.draw-parallel-how', cs: `${N}PARALLEL_LINES`, form: 'why', rung: 2,
    gen: () => {
      const right = 'Slide a set square along a ruler and draw a line in each position', k = pick(['neat', 'straight', 'careful']);
      const options = mc(right, [['Draw two lines that point to the same place far away without checking the gap', 'Lines that point to one place will meet there. Parallel lines stay the same distance apart.', 'M_SAME_DIRECTION_ENOUGH'], ['Draw two level lines, one anywhere and one further down, whatever the gap', 'Parallel lines need the same gap everywhere. Two level lines drawn anywhere may not keep the same gap.', 'M_PARALLEL_MEANS_HORIZONTAL']]);
      return { question: `${person().name} wants to draw two ${k} parallel lines with a ruler and a set square. Which method works?`, options, instruction: 'Choose the best answer.',
        hints: ['A set square keeps the same angle as it slides along the ruler.', 'The two lines must be the same distance apart all along.'], steps: ['The ruler stays still and the set square slides along it.', 'Each line drawn is at the same angle, so the lines are parallel.'] };
    } }),
  fam({ id: 'g6d.lines.half-length', cs: `${N}BISECT_LINES`, form: 'word', rung: 2,
    gen: () => {
      const half = randInt(3, 24), len = half * 2, p = person();
      return { question: `A line AB is ${len} cm long. ${p.name} bisects it at M. How long is AM, in centimetres? Give the number only.`, answer: half,
        wrong: [[len, 'That is the whole line. Bisecting cuts it into two equal parts.', 'M_HALF_OF_WRONG_LENGTH'], [len / 4, 'That halves the line twice. Bisecting cuts it into two equal parts once.', 'M_HALF_OF_WRONG_LENGTH'], [len - 5, 'That would be a cut near one end. Bisecting cuts the line into two equal parts, at its middle.', 'M_BISECT_MEANS_CUT_ANYWHERE'], [half + 3, 'The parts must be equal. AM and MB are the same length.', 'M_BISECT_MEANS_CUT_ANYWHERE']],
        hints: ['To bisect is to cut into two equal parts.', 'Each part is half of the whole line.'], steps: [`Bisecting AB makes AM and MB equal.`, `${len} ÷ 2 = ${half} cm.`], chk: (a) => a * 2 === len };
    } }),
  fam({ id: 'g6d.lines.bisect-meaning', cs: `${N}BISECT_LINES`, form: 'why', rung: 1,
    gen: () => {
      const options = mc('Cut it into two equal parts', [['Cut it into two parts anywhere along it', 'Bisect means two equal parts. A cut anywhere may give unequal parts.', 'M_BISECT_MEANS_CUT_ANYWHERE'], ['Make the whole line half as long by rubbing out one end', 'Bisecting keeps the whole line and marks its middle. Each half is half of the length.', 'M_HALF_OF_WRONG_LENGTH']]);
      return { question: `${person().name} is told to bisect a line with a compass and a ruler. What does bisect mean?`, options, instruction: 'Choose the best answer.',
        hints: ['The word bis means two.', 'The two parts must be the same length.'], steps: ['Bisect means to divide into two equal parts.', 'The point where the line is cut is its midpoint.'] };
    } }),
  fam({ id: 'g6d.lines.angle-between', cs: `${N}PERPENDICULAR_LINES`, form: 'direct', rung: 1,
    gen: () => {
      const options = mc('90 degrees', [['180 degrees', 'That is a straight line. Perpendicular lines meet at a right angle, a quarter of a full turn.', 'M_PERPENDICULAR_AS_STRAIGHT'], ['360 degrees', 'That is a full turn. Perpendicular lines meet at a right angle, a quarter of a full turn.', 'M_PERPENDICULAR_AS_STRAIGHT'], ['45 degrees', 'That is half of a right angle. Perpendicular lines meet at exactly one right angle.', 'M_PERPENDICULAR_AS_STRAIGHT']]);
      return { question: `Two perpendicular lines cross on ${person().name}'s drawing. What is the size of the angle where one line meets the other?`, options, instruction: 'Choose the best answer.',
        hints: ['Think of the corner of a book.', 'Perpendicular lines meet at a right angle.'], steps: ['Perpendicular lines meet at a right angle.', 'A right angle is 90 degrees.'] };
    } }),
  fam({ id: 'g6d.lines.which-perpendicular', cs: `${N}PERPENDICULAR_LINES`, form: 'why', rung: 2,
    gen: () => {
      const right = pick(['The two edges at a corner of a tilted picture frame', 'The corner of a set square, held at a slant', 'The edges at a book corner, the book lying at a slant']);
      const w1 = pick(['A leaning flagpole and the level ground under it', 'A tent pole leaning to one side and the ground', 'A slanting ladder and the wall it leans on']);
      const w2 = pick(['Two lines that join to make one straight line', 'Two roads that join and go straight on as one']);
      const options = mc(right, [[w1, 'These do not meet at a right angle. A pole may stand upright and still lean, so check the angle, not just the up-and-down direction.', 'M_PERPENDICULAR_AS_VERTICAL'], [w2, 'Two lines that make a straight line are at 180 degrees, not 90 degrees.', 'M_PERPENDICULAR_AS_STRAIGHT']]);
      return { question: `${person().name} looks for perpendicular lines. Which pair of lines is perpendicular?`, options, instruction: 'Choose the best answer.',
        hints: ['Perpendicular lines meet at a right angle, 90 degrees.', 'The pair does not have to be one level and one upright.'], steps: ['Perpendicular lines meet at 90 degrees.', `${right} meet at a right angle even though they are tilted.`] };
    } }),
  // ------------------------------------------------------------ ANGLES
  fam({ id: 'g6d.ang.name-type', cs: `${G}ANGLES_STRAIGHT_LINE_IDENTIFY`, form: 'direct', rung: 1,
    gen: () => {
      const a = randInt(95, 175);
      if (a % 5 === 0 && a % 10 === 0) { /* fine */ }
      const options = mc('obtuse', [['acute', 'An acute angle is less than 90 degrees. This angle is bigger than a right angle.', 'M_OBTUSE_AS_ACUTE'], ['right', 'A right angle is exactly 90 degrees. This angle is bigger than that.', 'M_OBTUSE_AS_ACUTE'], ['reflex', 'A reflex angle is more than 180 degrees. This angle is less than a straight line.', 'M_OBTUSE_AS_ACUTE']]);
      return { question: `Two angles lie on a straight line at a point. One of them is ${a}°. Is this angle acute, right, obtuse or reflex?`, options, instruction: 'Choose the best answer.',
        hints: ['Compare the angle with 90 degrees and with 180 degrees.', 'An angle between 90 and 180 degrees has a special name.'], steps: [`${a}° is more than 90° and less than 180°.`, 'An angle between 90° and 180° is obtuse.'] };
    } }),
  fam({ id: 'g6d.ang.triangle-missing', cs: `${G}ANGLE_SUM_RECT_TRIANGLE`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(30, 80), b = randInt(30, 80), c = 180 - a - b;
      if (c < 20 || a === b) return null;
      return { question: `${person().name} cuts a triangle from card. The corner that is torn off was the third one. The other two corners measure ${a}° and ${b}°. How big was the torn corner, in degrees? Give the number only.`, answer: c,
        wrong: [[360 - a - b, 'The angles of a triangle add up to 180 degrees, not 360 degrees.', 'M_TRIANGLE_360'], [180 - a, 'Only one of the known angles was taken from 180. Take both away.', 'M_SUBTRACT_ONE_ANGLE_ONLY'], [180 - b, 'Only one of the known angles was taken from 180. Take both away.', 'M_SUBTRACT_ONE_ANGLE_ONLY'], [a + b, 'That is the sum of the two angles you know. The third angle makes the three add up to 180.', 'M_SUBTRACT_ONE_ANGLE_ONLY']],
        hints: ['The three angles of a triangle add up to 180 degrees.', 'Add the two angles you know, then take the total from 180.'], steps: [`${a} + ${b} = ${a + b}.`, `180 − ${a + b} = ${c}.`], chk: (x) => a + b + x === 180 };
    } }),
  fam({ id: 'g6d.ang.rectangle-sum', cs: `${G}ANGLE_SUM_RECT_TRIANGLE`, form: 'why', rung: 1,
    gen: () => {
      const what = pick(['a rectangular window', 'a rectangular classroom floor', 'a rectangular maize plot', 'a rectangular blackboard']);
      const options = mc('360 degrees', [['180 degrees', 'The angles of a triangle add up to 180 degrees. A rectangle has four corners.', 'M_RECTANGLE_180'], ['90 degrees', 'That is the size of one corner. A rectangle has four corners, all right angles.', 'M_ONE_CORNER_ONLY']]);
      return { question: `${person().name} measures the four angles of ${what}. What do the four angles add up to?`, options, instruction: 'Choose the best answer.',
        hints: ['A rectangle has four corners.', 'Each corner is a right angle.'], steps: ['Each corner of a rectangle is 90 degrees.', '4 × 90 = 360 degrees.'] };
    } }),
  fam({ id: 'g6d.tri.name-by-sides', cs: `${G}CONSTRUCT_TRIANGLES`, form: 'direct', rung: 1,
    gen: () => {
      const items = [{ d: 'three equal sides', r: 'equilateral', w: ['isosceles', 'right-angled'] }, { d: 'two equal sides and one side that is different', r: 'isosceles', w: ['equilateral', 'right-angled'] }, { d: 'one angle of exactly 90 degrees', r: 'right-angled', w: ['equilateral', 'isosceles'] }];
      const x = pick(items), n = mc(x.r, x.w.map(w => [w, `A ${w} triangle is not the one with ${x.d}. Think what each name tells you.`, w === 'isosceles' && x.r === 'equilateral' ? 'M_ISOSCELES_THREE_EQUAL' : 'M_TRIANGLE_NAMES_MIXED']));
      return { question: `${person().name} draws a triangle with ${x.d}. What is the triangle called?`, options: n, instruction: 'Choose the best answer.',
        hints: ['Equilateral means equal sides all round.', 'Isosceles has two equal sides, and a right-angled triangle has a 90 degree angle.'], steps: [`A triangle with ${x.d} is called ${x.r}.`, 'The name tells what the sides or angles are like.'] };
    } }),
  fam({ id: 'g6d.tri.equilateral-angle', cs: `${G}CONSTRUCT_TRIANGLES`, form: 'word', rung: 2,
    gen: () => {
      const what = pick(['a road sign', 'a roof frame', 'a kite', 'a shelf bracket']);
      return { question: `${person().name} makes ${what} in the shape of an equilateral triangle. What is the size of each angle, in degrees? Give the number only.`, answer: 60,
        wrong: [[90, 'A right angle is 90 degrees. The three angles of a triangle add up to 180 degrees, so each of three equal angles is smaller.', 'M_EQUILATERAL_ANGLE_90'], [45, 'Three equal angles add up to 180 degrees, not 135 degrees.', 'M_EQUILATERAL_ANGLE_90'], [180, 'That is the sum of all three angles. Share it between the three equal angles.', 'M_EQUILATERAL_ANGLE_90'], [30, 'Three equal angles of 30 degrees add up to 90 degrees. They must add up to 180 degrees.', 'M_EQUILATERAL_ANGLE_90']],
        hints: ['The three angles of a triangle add up to 180 degrees.', 'An equilateral triangle has three equal angles.'], steps: ['The three equal angles add up to 180 degrees.', '180 ÷ 3 = 60 degrees.'], chk: (a) => a * 3 === 180 };
    } }),
  fam({ id: 'g6d.tri.isosceles-base', cs: `${G}INTERIOR_ANGLES_TRIANGLES`, form: 'word', rung: 2,
    gen: () => {
      const base = randInt(35, 75), apex = 180 - 2 * base;
      if (apex < 20 || apex === base) return null;
      return { question: `A roof is an isosceles triangle. The angle at the top is ${apex}°. The two angles at the bottom are equal. What is each bottom angle, in degrees? Give the number only.`, answer: base,
        wrong: [[180 - apex, 'That is the two bottom angles together. They are equal, so each is half of that.', 'M_BASE_ANGLES_NOT_EQUAL'], [apex, 'The bottom angles are not the same size as the top angle unless the triangle is equilateral. Share the rest of 180 between them.', 'M_BASE_ANGLES_NOT_EQUAL'], [90 - apex, 'Check the sum: the three angles add up to 180 degrees, not 90 degrees.', 'M_BASE_ANGLES_NOT_EQUAL'], [Math.round((360 - apex) / 2), 'The angles of a triangle add up to 180 degrees, not 360 degrees.', 'M_TRIANGLE_360']],
        hints: ['The three angles add up to 180 degrees.', 'The two bottom angles of an isosceles triangle are equal.'], steps: [`180 − ${apex} = ${180 - apex}.`, `${180 - apex} ÷ 2 = ${base} degrees.`], chk: (a) => apex + 2 * a === 180 };
    } }),
  fam({ id: 'g6d.tri.right-other', cs: `${G}INTERIOR_ANGLES_TRIANGLES`, form: 'direct', rung: 2,
    gen: () => {
      const b = randInt(20, 70), c = 90 - b;
      if (b === c) return null;
      return { question: `A right-angled triangle has one angle of ${b}° besides the right angle. What is the third angle, in degrees? Give the number only.`, answer: c,
        wrong: [[90, 'That is the right angle already in the triangle. The third angle is the one that is left.', 'M_RIGHT_ANGLED_OTHER_90'], [180 - b, 'The right angle was left out. Take away both the right angle and the other angle from 180.', 'M_RIGHT_ANGLED_OTHER_90'], [b, 'The two angles besides the right angle are equal only in a special triangle. Use the sum of 180.', 'M_RIGHT_ANGLED_OTHER_90'], [270 - b, 'The angles of a triangle add up to 180 degrees, not 270 degrees.', 'M_TRIANGLE_360']],
        hints: ['The three angles add up to 180 degrees.', 'The right angle is 90 degrees.'], steps: [`90 + ${b} = ${90 + b}.`, `180 − ${90 + b} = ${c} degrees.`], chk: (a) => 90 + b + a === 180 };
    } }),
  // ------------------------------------------------------------ 3-D OBJECTS
  fam({ id: 'g6d.3d.cylinder-true', cs: `${H}CYLINDER_PARTS`, form: 'why', rung: 2,
    gen: () => {
      const obj = pick(['a tin of beans', 'a water pipe', 'a jerrycan drum', 'a cup']);
      const options = mc('It has two flat circular faces and one curved surface', [['It has three flat faces: a top, a bottom and a side', 'The side of a cylinder is curved. Only the top and the bottom are flat.', 'M_CYLINDER_THREE_FACES_ALL_FLAT'], ['It has two vertices where the top and bottom meet the side', 'A cylinder has no sharp corners. The edges are smooth circles, so there are no vertices.', 'M_CYLINDER_HAS_VERTICES']]);
      return { question: `${person().name} studies ${obj}, which is shaped like a cylinder. Which statement about a cylinder is true?`, options, instruction: 'Choose the best answer.',
        hints: ['Roll the object on a table: which part rolls?', 'Run a finger round the top edge: is there a sharp point?'], steps: ['The top and bottom are flat circles.', 'The side is one curved surface and there are no vertices.'] };
    } }),
  fam({ id: 'g6d.3d.trace-face', cs: `${H}PLANE_FIGURES_IN_SOLIDS`, form: 'word', rung: 2,
    gen: () => {
      const pool = [{ s: 'cube', r: 'square', w: [['cube', 'A cube is a solid. The shape traced from one face is flat.', 'M_FACE_AS_SOLID'], ['cuboid', 'A cuboid is a solid. The shape traced from one face is flat.', 'M_FACE_AS_SOLID']] }, { s: 'tin of beans', r: 'circle', w: [['cylinder', 'A cylinder is a solid. The shape traced from the flat end is flat.', 'M_FACE_AS_SOLID'], ['oval', 'The end of a tin is round with the same distance from the centre all round, a circle.', 'M_CYLINDER_FACE_OVAL']] }, { s: 'matchbox', r: 'rectangle', w: [['cuboid', 'A cuboid is a solid. The shape traced from one face is flat.', 'M_FACE_AS_SOLID'], ['cube', 'A matchbox is not a cube. A cube is a solid, and the face is flat.', 'M_FACE_AS_SOLID']] }];
      const x = pick(pool), options = mc(x.r, x.w);
      return { question: `${person().name} presses one flat face of a ${x.s} into clay and lifts it off. What shape is the print?`, options, instruction: 'Choose the best answer.',
        hints: ['The print is flat, not a solid.', 'Think about the outline of the face.'], steps: [`The face of a ${x.s} is a flat shape.`, `Its print is a ${x.r}.`] };
    } }),
  // ------------------------------------------------------------ DATA: PILING
  fam({ id: 'g6d.data.tallest-pile', cs: `${B}PILING`, form: 'word', rung: 1,
    gen: () => {
      const cols = shuffle(['red', 'blue', 'green', 'yellow', 'white']).slice(0, 3), v = [randInt(4, 9), randInt(10, 15), randInt(4, 9)];
      if (v[0] === v[2]) return null;
      const order = shuffle([0, 1, 2]), best = 1;
      const spread = v[0] > v[2] ? 0 : 2;
      const options = mc(`${cols[best]} bottle tops`, [[`${cols[spread]} bottle tops, because that pile is spread over a wider space`, 'The number in a pile is found by counting, not by how wide the pile looks.', 'M_PILE_HEIGHT_NOT_COUNT'], [`${cols[best === 1 ? (spread === 0 ? 2 : 0) : 1]} bottle tops, because they were sorted first`, 'The order of sorting does not matter. Count the bottle tops in each pile.', 'M_PILE_HEIGHT_NOT_COUNT']]);
      return { question: `${person().name} sorts bottle tops into piles by colour. There are ${v[0]} ${cols[0]}, ${v[1]} ${cols[1]} and ${v[2]} ${cols[2]}. Which colour shows the most?`, options, instruction: 'Choose the best answer.',
        hints: ['Each bottle top stands for one item.', 'The pile with the most bottle tops shows the most.'], steps: [`Count: ${cols[0]} ${v[0]}, ${cols[1]} ${v[1]}, ${cols[2]} ${v[2]}.`, `The biggest number is ${v[1]}, so ${cols[1]} shows the most.`] };
    } }),
  fam({ id: 'g6d.data.pile-total', cs: `${B}PILING`, form: 'word', rung: 2,
    gen: () => {
      const v = [randInt(3, 12), randInt(3, 12), randInt(3, 12), randInt(3, 12)];
      if (new Set(v).size < 4) return null;
      const tot = v.reduce((a, b) => a + b, 0), mx = Math.max(...v);
      return { question: `${person().name} piles stones into four heaps to show how many learners walk, cycle, ride a bus or are driven to school. The heaps hold ${v.join(', ')} stones. How many learners are shown altogether? Give the number only.`, answer: tot,
        wrong: [[mx, 'That is the biggest heap only. The total is all the heaps together.', 'M_TOTAL_OF_TALLEST_ONLY'], [tot - v[0], 'One heap has been left out of the total. Add all four heaps.', 'M_PILE_LEFT_OUT'], [tot - v[3], 'One heap has been left out of the total. Add all four heaps.', 'M_PILE_LEFT_OUT'], [tot + mx, 'The biggest heap was counted twice. Count each heap once.', 'M_PILE_LEFT_OUT']],
        hints: ['Each stone stands for one learner.', 'Add the number of stones in all four heaps.'], steps: [`${v.join(' + ')} = ${tot}.`, `${tot} learners are shown.`], chk: (a) => a - v.reduce((s, x) => s + x, 0) === 0 };
    } }),
];
