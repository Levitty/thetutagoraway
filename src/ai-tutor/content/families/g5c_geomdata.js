// ============================================================================
// GRADE 5 MATHEMATICS: GEOMETRY (Lines, Angles, 3-D objects) and DATA REPRESENTATION.
// Hands-on outcomes (draw, measure with a protractor, collect data) cannot be tested by a
// tapped answer, so these families test what a child must KNOW to do them well: how to
// place the tool, what a good record looks like, which drawing is wrong and why. The
// practical work itself stays with paper and the teacher.
// ============================================================================
import { fam, randInt, pick, shuffle, commas, person, mc, tbl } from './g5c_lib.js';

const G = 'GEOMET.', D = 'DATA_H.DATA_REPRESENTATION.';
const ask = (right, wrongs, q, hints, steps, instruction = 'Choose the best answer.') => { const options = mc(right, wrongs); return options ? { question: q, options, instruction, hints, steps } : null; };
// A scenario pool entry: { q, r (right), w: [[text, why, mis]], s (a fact) }
const fromPool = (pool, lead) => () => { const x = pick(pool); return ask(x.r, x.w, `${lead(person())}${x.q}`, x.h || ['Think about what the words mean.', 'Check each choice against the picture in your mind.'], [x.s, `So the answer is: ${x.r}.`], x.i); };
const spot = (stem, steps3, badIdx, fix, mis, hint) => ({ question: stem, working: steps3.map((text, i) => ({ text, ok: i !== badIdx })), fix, mis, hints: [hint], steps: [fix] });

export const FAMILIES = [
  // ================================================================ LINES
  fam({ id: 'g5c.geol.hv.classify', cs: `${G}LINES.IDENTIFY_HORIZONTAL_VERTICAL`, form: 'direct', rung: 1,
    gen: fromPool([
      { q: 'is tidying the school kitchen and notices the rim of a basin on a flat shelf above the sink. Which word describes that rim: horizontal, vertical or neither?', r: 'horizontal', w: [['vertical', 'A vertical line goes straight up and down. The table top lies level.', 'M_HV_SWAP_NAMES'], ['neither', 'The top of a table is level, so it is horizontal.', 'M_HV_SLANT_COUNTS']], s: 'A level line, like the horizon, is horizontal.' },
      { q: 'walks across the school compound towards the flag pole standing upright by the gate. Which word describes the pole: horizontal, vertical or neither?', r: 'vertical', w: [['horizontal', 'A horizontal line lies level. The flag pole stands upright.', 'M_HV_SWAP_NAMES'], ['neither', 'A pole standing straight up is vertical.', 'M_HV_SLANT_COUNTS']], s: 'An upright line is vertical.' },
      { q: 'sees a painter ladder leaning against the classroom wall. Which word describes the ladder: horizontal, vertical or neither?', r: 'neither', w: [['vertical', 'A leaning ladder slants. A vertical line is straight up.', 'M_HV_SLANT_COUNTS'], ['horizontal', 'A leaning ladder is not level.', 'M_HV_SLANT_COUNTS']], s: 'A slanting line is neither horizontal nor vertical.' },
      { q: 'stands in the classroom and studies the sill at the foot of the window frame. Which word describes the sill: horizontal, vertical or neither?', r: 'horizontal', w: [['vertical', 'The bottom edge lies level on the floor.', 'M_HV_SWAP_NAMES'], ['neither', 'The bottom edge is level, so it is horizontal.', 'M_HV_SLANT_COUNTS']], s: 'A level line is horizontal.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.geol.hv.tilted', cs: `${G}LINES.IDENTIFY_HORIZONTAL_VERTICAL`, form: 'word', rung: 2,
    gen: () => {
      const tilt = Math.random() < 0.5;
      return { question: `${person().name} looks at ${tilt ? 'a square drawn turned so that it stands on one corner, like a diamond' : 'a rectangle drawn with its sides parallel to the page edges'}. How many of its four sides are horizontal?`, answer: tilt ? 0 : 2,
        wrong: tilt ? [[2, 'A turned square has no level sides. All four slant.', 'M_HV_TILTED_SHAPE'], [4, 'Sides slant when the shape is turned. Only level sides are horizontal.', 'M_HV_TILTED_SHAPE'], [1, 'None of the sides is level.', 'M_HV_SWAP_NAMES']] : [[4, 'Only two of the sides are level. The other two are vertical.', 'M_HV_SWAP_NAMES'], [0, 'The top and bottom are level.', 'M_HV_TILTED_SHAPE'], [1, 'There is a top and a bottom.', 'M_HV_SWAP_NAMES']],
        hints: ['A horizontal line lies level.', 'Is each side level or slanting?'], steps: [tilt ? 'Turned on a corner, every side slants.' : 'The top and bottom are level; the two sides are upright.', `Horizontal sides: ${tilt ? 0 : 2}.`], chk: (v) => v === (tilt ? 0 : 2) };
    } }),
  fam({ id: 'g5c.geol.hv.letters', cs: `${G}LINES.IDENTIFY_HORIZONTAL_VERTICAL`, form: 'table', rung: 3,
    gen: () => {
      const L = { E: [3, 1], H: [1, 2], T: [1, 1], L: [1, 1], F: [2, 1], I: [0, 1] }, k = pick(Object.keys(L)), [h, v] = L[k];
      return { question: `${person().name} counts the straight lines in the capital letter ${k} drawn upright in a plain way. The table shows the letters with their horizontal and vertical lines. How many horizontal lines does ${k} have?`, model: tbl(['Letter', 'Horizontal lines', 'Vertical lines'], Object.entries(L).slice(0, 4).map(([a, b]) => [a, String(b[0]), String(b[1])]).concat([[k, '?', String(v)]])), answer: h,
        wrong: [[v, `That is how many vertical lines ${k} has. The question asks for the horizontal lines.`, 'M_HV_SWAP_NAMES'], [h + v, 'Count only the level lines.', 'M_HV_SWAP_NAMES'], [h + 1, 'Check the picture again: count the level lines.', 'M_HV_SLANT_COUNTS'], [Math.max(0, h - 1), 'Check the picture again: count the level lines.', 'M_HV_SLANT_COUNTS']],
        hints: [`Picture the letter ${k}.`, 'Horizontal lines lie level.'], steps: [`${k} has ${v} vertical line${v === 1 ? '' : 's'}.`, `It has ${h} horizontal line${h === 1 ? '' : 's'}.`], chk: (x) => x === h };
    } }),

  fam({ id: 'g5c.geol.drawhv.ruler', cs: `${G}LINES.DRAW_HORIZONTAL_VERTICAL`, form: 'word', rung: 2,
    gen: () => {
      const len = randInt(5, 12), start = randInt(1, 3);
      return { question: `${person().name} draws a horizontal line with a ruler by starting at the ${start} cm mark and stopping at the ${start + len} cm mark. How long is the line in centimetres?`, answer: len,
        wrong: [[start + len, `The line is measured from where it starts. It starts at ${start} cm, not 0.`, 'M_RULER_FROM_ONE'], [len + 1, `Count the gap between the two marks: ${start + len} − ${start}.`, 'M_RULER_FROM_ONE'], [len - 1, `Take the start mark from the end mark: ${start + len} − ${start}.`, 'M_RULER_FROM_ONE'], [start, 'That is where the line starts, not its length.', 'M_RULER_FROM_ONE']],
        hints: ['Length = end mark − start mark.', 'A line from 0 to 8 is 8 cm long.'], steps: [`${start + len} − ${start} = ${len}.`, `${len} cm.`], chk: (x) => x + start === start + len };
    } }),
  fam({ id: 'g5c.geol.drawhv.how', cs: `${G}LINES.DRAW_HORIZONTAL_VERTICAL`, form: 'direct', rung: 1,
    gen: fromPool([
      { q: 'wants to draw a vertical line 6 cm long on plain paper. What is the best way?', r: 'Ruler along the page edge, start at 0', w: [['Hold the ruler at a slant and draw by eye as you go', 'A slanting ruler gives a slanting line. Use the page edge or a grid as a guide.', 'M_DRAW_HV_DRIFT'], ['Start at the 1 cm mark so the line comes out longer', 'Start measuring at 0, not 1, or the length is wrong.', 'M_RULER_FROM_ONE']], s: 'Use the page edge as a guide, and start at 0.' },
      { q: 'must draw a horizontal line 8 cm long. Which is correct?', r: 'Ruler along the page bottom, 0 to 8', w: [['Tilt the book and draw straight to the 8 mark', 'The line will slope. Keep the page level.', 'M_DRAW_HV_DRIFT'], ['Draw from the very end of the ruler to the 8 mark', 'The ruler may have a gap before 0. Start at the 0 mark.', 'M_RULER_FROM_ONE']], s: 'Keep the paper straight and measure from 0.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.geol.drawhv.spot', cs: `${G}LINES.DRAW_HORIZONTAL_VERTICAL`, form: 'spot', rung: 3,
    gen: () => { const p = person(), n = randInt(5, 10); return spot(`${p.name} draws a vertical line ${n} cm long. Which step has the mistake?`, ['Step 1: Put the ruler on the paper.', `Step 2: Turn the book so that the ruler leans, and draw from the 1 mark to the ${n + 1} mark.`, `Step 3: Say the line is ${n} cm long.`], 1, `The page must be straight and measuring starts from 0. A vertical line goes straight up the page from the 0 mark to the ${n} mark.`, 'M_DRAW_HV_DRIFT', 'Is the line really upright?'); } }),

  fam({ id: 'g5c.geol.perp.which', cs: `${G}LINES.IDENTIFY_PERPENDICULAR`, form: 'direct', rung: 1,
    gen: fromPool([
      { q: 'looks at the corner of an exercise book. Are the two edges that meet at the corner perpendicular?', r: 'Yes, they meet at a right angle', w: [['No, because they only touch at the end', 'Perpendicular lines do not have to cross. A corner of a book is a right angle.', 'M_PERP_MUST_CROSS'], ['No, because a book is a rectangle', 'The edges of a rectangle meet at right angles, so they are perpendicular.', 'M_PERP_MUST_CROSS']], s: 'Perpendicular lines meet at a right angle.' },
      { q: 'sees the two arms of the letter V. Are they perpendicular?', r: 'No, the angle is smaller than a right angle', w: [['Yes, because the two lines meet', 'Lines that meet are not always perpendicular. They must meet at a right angle.', 'M_PERP_ANY_CROSSING'], ['Yes, because both lines are straight', 'Perpendicular needs a right angle between them.', 'M_PERP_ANY_CROSSING']], s: 'The arms of a V make a small angle, not a right angle.' },
      { q: 'looks at two paths that cross like the letter X, and a set square fits exactly into each corner. Are the paths perpendicular?', r: 'Yes, the corners are right angles', w: [['No, because they are tilted a little', 'Perpendicular lines can be tilted. Only the right angle matters.', 'M_PERP_MUST_BE_UPRIGHT'], ['No, they only cross each other', 'Crossing at right angles is exactly perpendicular.', 'M_PERP_ANY_CROSSING']], s: 'A set square fits a right angle exactly.' },
      { q: 'checks two lines that meet at an angle just a little smaller than a right angle. A set square leaves a small gap. Are they perpendicular?', r: 'No, it is not exactly a right angle', w: [['Yes, it looks like a right angle to me', 'Judging by eye is not enough. Check with a set square.', 'M_PERP_BY_EYE'], ['Yes, because it is nearly a right angle', 'Nearly is not the same. A gap means it is not a right angle.', 'M_PERP_BY_EYE']], s: 'A gap with the set square means the angle is not a right angle.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.geol.perp.shape', cs: `${G}LINES.IDENTIFY_PERPENDICULAR`, form: 'word', rung: 2,
    gen: () => {
      const n = pick([['a rectangle', 4], ['a square', 4], ['the letter T', 1], ['an L-shaped bracket', 1]]);
      return { question: `${person().name} counts the corners where two sides are perpendicular in ${n[0]}. How many such right-angled corners are there?`, answer: n[1],
        wrong: [[n[1] + 1, 'Count only the corners that are right angles.', 'M_PERP_ANY_CROSSING'], [Math.max(0, n[1] - 1), 'Check each corner with a set square.', 'M_PERP_MUST_CROSS'], [0, 'Right angles do not need lines to cross. A corner counts.', 'M_PERP_MUST_CROSS'], [2 * n[1], 'Count each corner once.', 'M_PERP_ANY_CROSSING']],
        hints: ['A right angle is the corner of a book.', 'Count the corners that fit a set square.'], steps: [`${n[0]} has ${n[1]} such corner${n[1] === 1 ? '' : 's'}.`, `Answer ${n[1]}.`], chk: (v) => v === n[1] };
    } }),
  fam({ id: 'g5c.geol.perp.tilted', cs: `${G}LINES.IDENTIFY_PERPENDICULAR`, form: 'why', rung: 3,
    gen: fromPool([
      { q: 'has a square signboard that hangs tilted. Are the two sides at one corner perpendicular?', r: 'Yes, tilting keeps the right angle', w: [['No, because it is slanting to one side', 'A tilted square still has right angles. Perpendicular does not mean upright.', 'M_PERP_MUST_BE_UPRIGHT'], ['No, because it is only a signboard', 'The shape makes the angle, not the material.', 'M_PERP_MUST_BE_UPRIGHT']], s: 'Turning a square does not change its corners.' },
      { q: 'looks at two lines on a map that cross at a right angle, but neither is horizontal. Are they perpendicular?', r: 'Yes, they meet at a right angle', w: [['No, one of them must be horizontal', 'Perpendicular lines can face any direction.', 'M_PERP_MUST_BE_UPRIGHT'], ['No, they only touch each other', 'Crossing at a right angle is perpendicular.', 'M_PERP_ANY_CROSSING']], s: 'Only the angle between the lines matters.' },
    ], (p) => `${p.name} `) }),

  fam({ id: 'g5c.geol.drawperp.tool', cs: `${G}LINES.DRAW_PERPENDICULAR`, form: 'direct', rung: 2,
    gen: fromPool([
      { q: 'must draw a line perpendicular to a slanting line AB through a point P on AB. What is the best way?', r: 'Set square corner at P, short edge along AB', w: [['Draw a line straight up through P, whatever AB does', 'The given line slants. A straight-up line is not at a right angle to it.', 'M_DRAWPERP_ALWAYS_VERTICAL'], ['Lay the long sloping edge of a set square along AB', 'The sloping edge is not at a right angle. Use one of the short edges.', 'M_SETSQUARE_WRONG_EDGE']], s: 'Use the right angle of a set square placed on the line.' },
      { q: 'wants a line perpendicular to line CD through a point Q marked 3 cm from C. Which is correct?', r: 'Put the set square corner exactly at Q on CD', w: [['Draw the right angle anywhere along CD', 'The line must pass through Q.', 'M_DRAWPERP_MISSES_POINT'], ['Use the long edge of the set square along CD', 'The long edge does not give a right angle.', 'M_SETSQUARE_WRONG_EDGE']], s: 'The right angle goes exactly at the marked point.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.geol.drawperp.check', cs: `${G}LINES.DRAW_PERPENDICULAR`, form: 'why', rung: 3,
    gen: fromPool([
      { q: 'drew a line through a point on a horizontal line XY using the long sloping edge of a set square. It makes a 45° angle. Is it perpendicular?', r: 'No, the sloping edge gives a 45° angle, not 90°', w: [['Yes, because a set square was used', 'The set square must be used with its right-angled corner.', 'M_SETSQUARE_WRONG_EDGE'], ['Yes, because it passes through the point', 'Passing through the point is not enough. The angle must be 90°.', 'M_DRAWPERP_MISSES_POINT']], s: 'A right angle needs the corner of the set square.' },
      { q: 'drew a line that meets a slanting line at a right angle, but 1 cm away from the point P marked on it. Was the task done correctly?', r: 'No, the line must go through P', w: [['Yes, because it is at a right angle', 'The line must go through the marked point P as well.', 'M_DRAWPERP_MISSES_POINT'], ['Yes, near enough', 'Check the instructions. The line must pass through P.', 'M_DRAWPERP_MISSES_POINT']], s: 'The perpendicular must pass through the marked point.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.geol.drawperp.spot', cs: `${G}LINES.DRAW_PERPENDICULAR`, form: 'spot', rung: 3,
    gen: () => { const p = person(); return spot(`${p.name} draws a line perpendicular to a slanting line AB through P. Which step has the mistake?`, ['Step 1: Mark the point P on AB.', 'Step 2: Draw a straight upward line through P, because perpendicular means upright.', 'Step 3: Say the lines are perpendicular.'], 1, 'Perpendicular means at a right angle to the given line, even when it slants. Use a set square on the line at P.', 'M_DRAWPERP_ALWAYS_VERTICAL', 'Is the new line at a right angle to AB?'); } }),

  fam({ id: 'g5c.geol.par.pairs', cs: `${G}LINES.IDENTIFY_PARALLEL`, form: 'direct', rung: 1,
    gen: fromPool([
      { q: 'looks at a horizontal line 3 cm long and another horizontal line 2 cm below it, 7 cm long. Are they parallel?', r: 'Yes, because they stay the same distance apart', w: [['No, because they are different lengths', 'Parallel lines can be different lengths. What matters is the same distance apart.', 'M_PAR_SAME_LENGTH'], ['No, because they do not line up', 'They do not need to start at the same place.', 'M_PAR_SAME_LENGTH']], s: 'Parallel lines stay the same distance apart.' },
      { q: 'looks at two lines that are 4 cm apart at one end and 2 cm apart at the other. Are they parallel?', r: 'No, they are getting closer', w: [['Yes, because they do not touch on the page', 'They would meet if you drew them longer. Parallel lines never get closer.', 'M_PAR_NOT_MEETING_YET'], ['Yes, they are both straight', 'Parallel lines must stay the same distance apart.', 'M_PAR_NOT_MEETING_YET']], s: 'Lines that get closer are not parallel.' },
      { q: 'lays a ruler diagonally on a desk. Are the two long edges of the ruler parallel?', r: 'Yes, parallel lines can slant', w: [['No, they are not lying flat across the desk', 'Parallel lines do not have to be horizontal.', 'M_PAR_ONLY_HORIZONTAL'], ['No, only horizontal lines are parallel', 'Parallel lines can be vertical or slanting too.', 'M_PAR_ONLY_HORIZONTAL']], s: 'The edges of a ruler stay the same distance apart.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.geol.par.shape', cs: `${G}LINES.IDENTIFY_PARALLEL`, form: 'word', rung: 2,
    gen: () => {
      const n = pick([['a rectangle', 2], ['a square', 2], ['a window with four equal panes in a row, counting its two long sides and the three bars', 5], ['the rails of a railway track with two rails', 1]]);
      return { question: `${person().name} counts the pairs of parallel sides in ${n[0].startsWith('a window') ? 'a window frame' : n[0]}. How many pairs are there? Count each pair once.`, answer: n[1],
        wrong: [[n[1] + 1, 'Count each pair of parallel sides once.', 'M_PAR_SAME_LENGTH'], [n[1] * 2, 'A pair has two sides. Count pairs.', 'M_PAR_SAME_LENGTH'], [Math.max(0, n[1] - 1), 'Check which sides are the same distance apart.', 'M_PAR_ONLY_HORIZONTAL'], [0, 'Look for lines that stay the same distance apart.', 'M_PAR_ONLY_HORIZONTAL']],
        hints: ['Parallel lines stay the same distance apart.', 'Count pairs, not single lines.'], steps: [`${n[0]}: ${n[1]} pair${n[1] === 1 ? '' : 's'}.`, `Answer ${n[1]}.`], chk: (v) => v === n[1] };
    } }),
  fam({ id: 'g5c.geol.par.sort', cs: `${G}LINES.IDENTIFY_PARALLEL`, form: 'table', rung: 3,
    gen: () => {
      const rows = shuffle([['Two rails of a railway line', 'Parallel'], ['Two arms of the letter V', 'Not parallel'], ['Opposite sides of a book cover', 'Parallel'], ['Two roads that meet at a junction', 'Not parallel']]);
      const options = mc('Two rails of a railway line', [['Two arms of the letter V', 'The arms of V get closer and meet, so they are not parallel.', 'M_PAR_NOT_MEETING_YET'], ['Two roads that meet at a junction', 'Roads that meet cross each other. They are not parallel.', 'M_PAR_NOT_MEETING_YET']]);
      if (!options) return null;
      return { question: 'The table shows four pairs of lines. Which pair of lines stays the same distance apart, so is parallel? Choose one that is parallel and is a railway.', model: tbl(['Pair of lines'], rows.map(r => [r[0]])), options, instruction: 'Choose the parallel pair.', hints: ['Parallel lines never meet.', 'They stay the same distance apart.'], steps: ['Railway rails stay the same distance apart.', 'They are parallel.'] };
    } }),

  fam({ id: 'g5c.geol.drawpar.how', cs: `${G}LINES.DRAW_PARALLEL`, form: 'direct', rung: 2,
    gen: fromPool([
      { q: 'must draw a line parallel to AB and 3 cm away from it. What is the best way?', r: 'Measure 3 cm in two places, then join', w: [['Measure 3 cm at one end and draw the rest by eye', 'The line must be 3 cm away all along. Measure in at least two places.', 'M_DRAWPAR_ONE_MEASURE'], ['Hold the ruler at a slant to measure 3 cm', 'The distance is measured straight across, at a right angle to the line.', 'M_DRAWPAR_SLANT_MEASURE']], s: 'Measure the distance in two places, straight across.' },
      { q: 'is told line MN slopes downwards from left to right. Which line is parallel to MN?', r: 'A line sloping down the same way', w: [['A horizontal line drawn well below it', 'A parallel line follows the same slant as the given line.', 'M_DRAWPAR_IGNORES_DIRECTION'], ['A vertical line drawn right next to it', 'A parallel line follows the same slant.', 'M_DRAWPAR_IGNORES_DIRECTION']], s: 'Parallel lines have the same direction.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.geol.drawpar.dist', cs: `${G}LINES.DRAW_PARALLEL`, form: 'word', rung: 2,
    gen: () => {
      const d = randInt(2, 6), s = d + randInt(2, 4);
      return { question: `${person().name} measures the distance between two lines along a slant and gets ${s} cm, but the straight-across distance (at a right angle) is ${d} cm. Which distance is the gap between the parallel lines, in centimetres?`, answer: d,
        wrong: [[s, 'A slanting measure is longer than the real gap. Measure at a right angle.', 'M_DRAWPAR_SLANT_MEASURE'], [s - d, 'That is the difference between the two measures, not the gap.', 'M_DRAWPAR_SLANT_MEASURE'], [s + d, 'Do not add the two measures.', 'M_DRAWPAR_ONE_MEASURE'], [d + 1, 'The straight-across distance is the gap.', 'M_DRAWPAR_ONE_MEASURE']],
        hints: ['The gap is measured at a right angle to the lines.', 'A slanting measure is too long.'], steps: ['The gap is the straight-across distance.', `${d} cm.`], chk: (v) => v === d };
    } }),
  fam({ id: 'g5c.geol.drawpar.spot', cs: `${G}LINES.DRAW_PARALLEL`, form: 'spot', rung: 3,
    gen: () => { const p = person(), d = randInt(3, 5); return spot(`${p.name} draws a line parallel to AB, ${d} cm away. Which step has the mistake?`, ['Step 1: Mark the line AB.', `Step 2: Measure ${d} cm from AB at one end only, mark it, and draw the new line by eye.`, 'Step 3: Say the lines are parallel.'], 1, `Measure ${d} cm in at least two places and join the marks so the line stays the same distance from AB.`, 'M_DRAWPAR_ONE_MEASURE', 'Is the distance the same all along?'); } }),

  // ================================================================ ANGLES
  fam({ id: 'g5c.geoa.turn.degrees', cs: `${G}ANGLES.TURNS_AS_ANGLES`, form: 'word', rung: 1,
    gen: () => {
      const t = pick([['a quarter', 90], ['a half', 180], ['three-quarters', 270], ['a full', 360]]);
      return { question: `A door-handle turns through ${t[0]} turn. How many degrees is that? A full turn is 360 degrees.`.replace('turns through a ', 'turns through ') , answer: t[1],
        wrong: [[t[1] === 360 ? 100 : t[1] / 3.6, 'A full turn is 360 degrees, not 100.', 'M_FULL_TURN_100'], [t[1] / 2, 'Check the fraction of 360.', 'M_FULL_TURN_100'], [t[1] === 90 ? 180 : 90, 'Work out the fraction of 360.', 'M_TURN_FROM_TOP'], [t[1] + 90, 'Check the fraction of 360.', 'M_TURN_FROM_TOP']].filter(w => w[0] !== t[1]),
        hints: ['A full turn is 360 degrees.', 'Take the fraction of 360.'], steps: [`${t[0]} of 360 is ${t[1]}.`, `${t[1]} degrees.`], chk: (v) => v === t[1] };
    } }),
  fam({ id: 'g5c.geoa.turn.clock', cs: `${G}ANGLES.TURNS_AS_ANGLES`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(1, 8), b = a + pick([3, 6, 9]), turn = (b - a) % 12, deg = turn * 30;
      if (b > 12) return null;
      const right = deg === 90 ? 'a quarter turn, 90°' : deg === 180 ? 'a half turn, 180°' : 'three-quarters of a turn, 270°';
      const options = mc(right, [[deg === 180 ? 'a quarter turn, 90°' : 'a half turn, 180°', 'Count how far the hand moved from where it started, not where it ended on the clock.', 'M_TURN_FROM_TOP'], ['a full turn, 360°', 'A full turn takes the hand all the way round.', 'M_FULL_TURN_100'], ['a quarter turn, 25°', 'A quarter turn is a quarter of 360°, which is 90°, not 25°.', 'M_FULL_TURN_100']].filter(w => w[0] !== right));
      return { question: `The minute hand of a clock moves from the ${a} to the ${b}. How much has it turned?`, options, instruction: 'Choose the turn.',
        hints: ['Count the numerals it moved over: each is 30°.', 'Compare with a full turn of 360°.'], steps: [`${b - a} numerals × 30° = ${deg}°.`, right + '.'] };
    } }),
  fam({ id: 'g5c.geoa.turn.compass', cs: `${G}ANGLES.TURNS_AS_ANGLES`, form: 'why', rung: 3,
    gen: () => {
      const p = person(), q = person();
      const options = mc('No, they turned through 270° and 90°', [['Yes, because they end up facing the same way', 'The angle of a turn is how far you turned, not where you end up.', 'M_SAME_END_SAME_ANGLE'], ['Yes, because both turns are less than a full turn', 'Different turns have different sizes.', 'M_SAME_END_SAME_ANGLE']]);
      return { question: `${p.name} faces north and makes a three-quarter turn clockwise. ${q.name} faces north and makes a quarter turn anticlockwise. They face the same way at the end. Did they turn through the same angle?`, options, instruction: 'Choose the best answer.',
        hints: ['Find each angle of turn.', 'Three-quarters of 360° and one quarter of 360°.'], steps: ['Three-quarters of 360° is 270°. A quarter is 90°.', 'The turns are different.'] };
    } }),

  fam({ id: 'g5c.geoa.deg.arms', cs: `${G}ANGLES.DEGREE_AS_UNIT`, form: 'direct', rung: 1,
    gen: () => {
      const d = pick([40, 50, 60, 70]), a = randInt(6, 9), b = randInt(2, 3);
      const options = mc('They are equal, both are ' + d + '°', [[`Angle P is bigger, because its arms are longer`, 'The length of the arms does not change the angle. The opening between them does.', 'M_LONGER_ARMS_BIGGER'], [`Angle Q is bigger, because its arms end closer`, 'The distance between the tips is not the angle.', 'M_GAP_BETWEEN_ENDS']]);
      return { question: `${person().name} draws two angles of ${d}°, one with arms ${a} cm long and one with arms ${b} cm long. Which angle is bigger?`, options, instruction: 'Choose the best answer.',
        hints: ['An angle is how wide the opening is.', 'Compare the sizes in degrees.'], steps: [`Both angles are ${d}°.`, 'They are equal.'] };
    } }),
  fam({ id: 'g5c.geoa.deg.which', cs: `${G}ANGLES.DEGREE_AS_UNIT`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(40, 70), b = a + randInt(10, 30), p = person();
      return { question: `Angle A is ${a}° with arms 5 cm long. Angle B is ${b}° with arms 1 cm long. How many degrees bigger is the bigger angle?`, answer: b - a,
        wrong: [[a, 'That is the size of angle A, not the difference.', 'M_LONGER_ARMS_BIGGER'], [a + b, 'Take away to find how much bigger.', 'M_GAP_BETWEEN_ENDS'], [b, 'That is the size of angle B.', 'M_GAP_BETWEEN_ENDS'], [b - a + 10, 'Check the subtraction.', 'M_GAP_BETWEEN_ENDS']],
        hints: ['Compare the degrees, not the arm lengths.', 'Subtract the smaller from the larger.'], steps: [`${b}° is bigger than ${a}°.`, `${b} − ${a} = ${b - a}.`], chk: (v) => v === b - a };
    } }),
  fam({ id: 'g5c.geoa.deg.right', cs: `${G}ANGLES.DEGREE_AS_UNIT`, form: 'why', rung: 3,
    gen: () => {
      const options = mc('90°, whatever the length of its arms', [['100°, because 100 is a round number', 'A right angle is a quarter turn, which is 90°.', 'M_LONGER_ARMS_BIGGER'], ['It depends on how long the arms are', 'The size of an angle does not depend on the arms.', 'M_LONGER_ARMS_BIGGER']]);
      return { question: `${person().name} asks: how many degrees is a right angle, and does it change when its arms are longer?`, options, instruction: 'Choose the best answer.',
        hints: ['A right angle is a quarter turn.', 'Longer arms do not make a bigger angle.'], steps: ['A quarter of 360° is 90°.', 'Arm length does not change it.'] };
    } }),

  fam({ id: 'g5c.geoa.prot.scale', cs: `${G}ANGLES.READ_PROTRACTOR_BOTH_SCALES`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(2, 7) * 10 + randInt(1, 4), tens = Math.floor(a / 10) * 10;
      return { question: `A learner reads a protractor. One arm is on the baseline at 0 on the right. The other arm is ${a - tens} small marks past ${tens} on that scale, on the way to ${tens + 10}. Each small mark is 1°. What is the angle?`, answer: a,
        wrong: [[tens + 10 + (10 - (a - tens)) - 10, 'You counted the marks from the wrong label. Count on from the last label passed.', 'M_COUNT_MARKS_BACKWARDS'], [tens + (a - tens) * 10, 'Each small mark is 1°, not 10°.', 'M_SMALL_MARK_AS_TEN'], [180 - a, 'You read the other scale. Use the scale that starts at 0 on the baseline arm.', 'M_WRONG_SCALE'], [tens + 5 * (a - tens), 'Each small mark is 1°, not 5°.', 'M_SMALL_MARK_AS_TEN']],
        hints: ['Use the scale that starts at 0 on the baseline.', 'Count on from the last label.'], steps: [`${tens} + ${a - tens} = ${a}.`, `${a}°.`], chk: (v) => v === a };
    } }),
  fam({ id: 'g5c.geoa.prot.which', cs: `${G}ANGLES.READ_PROTRACTOR_BOTH_SCALES`, form: 'direct', rung: 2,
    gen: () => {
      const a = randInt(3, 8) * 10, options = mc(`${a}°`, [[`${180 - a}°`, 'You read the scale that does not start at 0 on the baseline arm.', 'M_WRONG_SCALE'], [`${a + 90}°`, 'Check which scale starts at 0.', 'M_WRONG_SCALE'], [`${a / 10}°`, 'A label like 60 means 60°.', 'M_SMALL_MARK_AS_TEN']]);
      return { question: `An angle in a roof plan is measured with a protractor. The other arm passes the marks labelled ${a} and ${180 - a}, and the baseline arm is at the 0 on the right. What is the angle?`, options, instruction: 'Choose the angle.',
        hints: ['Use the scale that starts at 0 on the baseline arm.', 'Ignore the other scale.'], steps: [`The scale from 0 on the baseline gives ${a}.`, `${a}°.`] };
    } }),
  fam({ id: 'g5c.geoa.prot.spot', cs: `${G}ANGLES.READ_PROTRACTOR_BOTH_SCALES`, form: 'spot', rung: 3,
    gen: () => { const p = person(), a = randInt(4, 8) * 10 + randInt(1, 4); return spot(`${p.name} reads an angle of ${a}° on a protractor as ${180 - a}°. Which step has the mistake?`, ['Step 1: One arm lies along the baseline with the 0 on the right.', `Step 2: Read the scale that starts at 0 on the left, ${180 - a}.`, `Step 3: The angle is ${180 - a}°.`], 1, `Read the scale that starts at 0 on the baseline arm. The angle is ${a}°.`, 'M_WRONG_SCALE', 'Which scale starts at 0 on the baseline arm?'); } }),

  fam({ id: 'g5c.geoa.meas.place', cs: `${G}ANGLES.MEASURE_WITH_PROTRACTOR`, form: 'direct', rung: 1,
    gen: fromPool([
      { q: 'wants to measure angle ABC with a protractor. Where does the centre point of the protractor go?', r: 'Exactly on the vertex B', w: [['Anywhere along one arm', 'The centre must be exactly on the point where the arms meet.', 'M_CENTRE_OFF_VERTEX'], ['On the end of an arm', 'The centre goes on the vertex.', 'M_CENTRE_OFF_VERTEX']], s: 'The centre point sits on the vertex.' },
      { q: 'measures an angle with arms only 1 cm long, too short to reach the scale. What should happen?', r: 'Extend the arms with a ruler, then measure', w: [['Guess a reading', 'A guess is not a measurement. Extend the arms.', 'M_SHORT_ARMS_GUESS'], ['Measure only where the arm ends', 'The arms must reach the scale. Extend them.', 'M_SHORT_ARMS_GUESS']], s: 'Longer arms do not change the angle, and make it readable.' },
      { q: 'lines up the bottom edge of the protractor with one arm, instead of the baseline. What is the likely problem?', r: 'The reading may be a few degrees wrong', w: [['The reading will be exactly right', 'The 0 line is the baseline, which may not be the bottom edge.', 'M_EDGE_NOT_BASELINE'], ['The angle gets bigger', 'The angle does not change, but the reading can be wrong.', 'M_EDGE_NOT_BASELINE']], s: 'Use the 0 baseline, not the bottom edge.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.geoa.meas.tilted', cs: `${G}ANGLES.MEASURE_WITH_PROTRACTOR`, form: 'word', rung: 2,
    gen: () => {
      const a = randInt(1, 4) * 10, b = a + randInt(3, 6) * 10;
      return { question: `With the protractor held level and neither arm on the baseline, one arm crosses the scale at ${a} and the other at ${b} (same scale). What is the angle between the arms, in degrees?`, answer: b - a,
        wrong: [[b, 'That is only where the upper arm crosses. Subtract the other reading.', 'M_READ_SECOND_ARM_ONLY'], [a, 'That is only where the lower arm crosses.', 'M_READ_SECOND_ARM_ONLY'], [a + b, 'Take away to find the gap between the arms.', 'M_READ_SECOND_ARM_ONLY'], [b - a + 10, 'Check the subtraction.', 'M_EDGE_NOT_BASELINE']],
        hints: ['Both arms cross the same scale.', 'The angle is the gap between the two readings.'], steps: [`${b} − ${a} = ${b - a}.`, `${b - a}°.`], chk: (v) => v === b - a };
    } }),
  fam({ id: 'g5c.geoa.meas.spot', cs: `${G}ANGLES.MEASURE_WITH_PROTRACTOR`, form: 'spot', rung: 3,
    gen: () => { const p = person(), a = randInt(3, 7) * 10; return spot(`${p.name} measures a ${a}° angle with arms 1 cm long. Which step has the mistake?`, ['Step 1: Put the centre of the protractor on the vertex.', `Step 2: The arms are too short to reach the scale, so guess about ${a + 10}°.`, `Step 3: Write ${a + 10}°.`], 1, `Extend the arms with a ruler until they reach the scale, then read the angle: ${a}°.`, 'M_SHORT_ARMS_GUESS', 'Should we guess a measurement?'); } }),

  fam({ id: 'g5c.geoa.ctx.unit', cs: `${G}ANGLES.MEASURE_ANGLES_IN_CONTEXT`, form: 'direct', rung: 1,
    gen: () => {
      const a = randInt(2, 8) * 10 + 5;
      const options = mc(`${a}°`, [[`${a} cm`, 'Angles are measured in degrees, not centimetres.', 'M_NO_DEGREE_UNIT'], [`${a} degrees too`.replace(' too',' squared'), 'Write the unit: degrees.', 'M_NO_DEGREE_UNIT'], [`${a} cm²`, 'Angles are measured in degrees.', 'M_NO_DEGREE_UNIT']]);
      return { question: `${person().name} measures the angle between a ladder and the ground in a drawing and gets ${a}. How should the angle be written?`, options, instruction: 'Choose the correct way to write it.',
        hints: ['What unit measures an angle?', 'The degree sign is °.'], steps: ['Angles are measured in degrees.', `Write ${a}°.`] };
    } }),
  fam({ id: 'g5c.geoa.ctx.sense', cs: `${G}ANGLES.MEASURE_ANGLES_IN_CONTEXT`, form: 'why', rung: 2,
    gen: () => {
      const a = randInt(2, 4) * 10, p = person();
      const options = mc(`No. It looks small, so it should be about ${a}°`, [[`Yes. ${180 - a}° is a good measurement`, `${180 - a}° is an obtuse angle. This sharp angle is smaller than a right angle.`, 'M_NO_REASONABLENESS_CHECK'], [`Yes. Any reading from a protractor is right`, 'Always check that the reading makes sense with the look of the angle.', 'M_NO_REASONABLENESS_CHECK']]);
      return { question: `${p.name} measures the sharp corner of a triangular scarf drawing, which is clearly smaller than a right angle, and writes ${180 - a}°. Is this reasonable?`, options, instruction: 'Choose the best answer.',
        hints: ['Is the angle smaller or bigger than a right angle?', 'Right angle is 90°.'], steps: ['A sharp corner is less than 90°.', `${180 - a}° is more than 90°, so it is not reasonable.`] };
    } }),
  fam({ id: 'g5c.geoa.ctx.bigger', cs: `${G}ANGLES.MEASURE_ANGLES_IN_CONTEXT`, form: 'word', rung: 3,
    gen: () => {
      const a = randInt(8, 12) * 10, p = person();
      return { question: `A small drawing of a roof has a top angle of ${a}°. A drawing of the same roof twice as big is made. What is the top angle of the bigger drawing, in degrees?`, answer: a,
        wrong: [[a * 2, 'A bigger drawing has longer lines but the same angle.', 'M_BIGGER_SHAPE_BIGGER_ANGLES'], [a + 20, 'The angle does not change with the size.', 'M_BIGGER_SHAPE_BIGGER_ANGLES'], [Math.round(a / 2), 'The angle stays the same.', 'M_BIGGER_SHAPE_BIGGER_ANGLES'], [180 - a, 'The angle does not change.', 'M_NO_REASONABLENESS_CHECK']],
        hints: ['Does making a drawing bigger change the angle?', 'Angles depend on the opening, not the size.'], steps: ['The shape is the same, only bigger.', `The angle stays ${a}°.`], chk: (v) => v === a };
    } }),

  fam({ id: 'g5c.geoa.env.right', cs: `${G}ANGLES.ANGLES_IN_ENVIRONMENT`, form: 'direct', rung: 1,
    gen: fromPool([
      { q: 'sees a square signboard at a bus stop hanging tilted. Is the angle at its corner a right angle?', r: 'Yes, a tilted square still has right angles', w: [['No, because it is slanting', 'Tilting does not change a corner. A square has right angles.', 'M_RIGHT_ANGLE_ONLY_UPRIGHT'], ['No, because it is a sign', 'The shape decides the angle.', 'M_RIGHT_ANGLE_ONLY_UPRIGHT']], s: 'A turned square has the same right angles.' },
      { q: 'opens a pair of scissors. Which shows the angle of the scissors?', r: 'The opening between the two blades', w: [['Only the screw where the blades join', 'The point is not the angle. The angle is the opening between the arms.', 'M_ANGLE_IS_THE_CORNER_POINT'], ['The length of one blade', 'The length does not give the angle.', 'M_ANGLE_IS_THE_CORNER_POINT']], s: 'An angle is the opening between two arms.' },
      { q: 'opens a classroom door a quarter turn. Does the door make an angle with its closed position?', r: 'Yes, a right angle (90°)', w: [['No, there are no drawn lines', 'A turning object makes an angle even with no lines drawn.', 'M_NO_ANGLE_IN_MOVEMENT'], ['No, only drawn shapes have angles', 'Moving objects make angles too.', 'M_NO_ANGLE_IN_MOVEMENT']], s: 'A quarter turn is 90°.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.geoa.env.compare', cs: `${G}ANGLES.ANGLES_IN_ENVIRONMENT`, form: 'why', rung: 2,
    gen: fromPool([
      { q: 'looks at a ladder leaning on a wall. The ladder and the ground make an angle. Which describes where that angle is?', r: 'The opening between ladder and ground', w: [['The top of the ladder only, where it touches', 'The angle is the opening between two arms, not a point.', 'M_ANGLE_IS_THE_CORNER_POINT'], ['The wall behind the ladder and the roof', 'The angle is between the ladder and the ground.', 'M_ANGLE_IS_THE_CORNER_POINT']], s: 'The arms are the ladder and the ground.' },
      { q: 'sees a clock hand move from 12 to 3. What does this show?', r: 'A turn that makes a right angle', w: [['Nothing, because no line is drawn', 'A turning hand makes an angle.', 'M_NO_ANGLE_IN_MOVEMENT'], ['A point only', 'The hand sweeps an opening, which is an angle.', 'M_ANGLE_IS_THE_CORNER_POINT']], s: '12 to 3 is a quarter turn of 90°.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.geoa.env.roof', cs: `${G}ANGLES.ANGLES_IN_ENVIRONMENT`, form: 'word', rung: 3,
    gen: () => {
      const n = randInt(2, 6), p = person();
      return { question: `${p.name} counts the right angles in a room: each of ${n} identical square tiles has 4 corners, all right angles. How many right angles are there on the ${n} tiles altogether?`, answer: 4 * n,
        wrong: [[n, 'Each tile has 4 right angles.', 'M_RIGHT_ANGLE_ONLY_UPRIGHT'], [4, 'That is for one tile. There are several.', 'M_RIGHT_ANGLE_ONLY_UPRIGHT'], [n + 4, 'Multiply, do not add.', 'M_RIGHT_ANGLE_ONLY_UPRIGHT'], [4 * n - 4, 'Count every tile.', 'M_ANGLE_IS_THE_CORNER_POINT']],
        hints: ['How many right angles does one tile have?', 'Multiply by the number of tiles.'], steps: [`${n} × 4 = ${4 * n}.`, `${4 * n} right angles.`], chk: (v) => v === 4 * n };
    } }),

  // ================================================================ 3-D OBJECTS
  fam({ id: 'g5c.geo3.name.object', cs: `${G}3_D_OBJECTS.NAME_3D_OBJECTS`, form: 'direct', rung: 1,
    gen: fromPool([
      { q: 'has a building brick with faces that are not all equal squares. Is it a cube or a cuboid?', r: 'A cuboid', w: [['A cube', 'A cube has six equal square faces. A brick has some faces longer than others.', 'M_EVERY_BOX_IS_CUBE'], ['A cylinder', 'A cylinder has round ends.', 'M_EVERY_BOX_IS_CUBE']], s: 'A cuboid has rectangle faces.' },
      { q: 'sees a tin of Kimbo lying on its side. What 3-D object is it?', r: 'A cylinder', w: [['It is not a cylinder now', 'The shape stays a cylinder however it lies.', 'M_PROTOTYPE_ORIENTATION'], ['A cuboid', 'A cuboid has flat faces all round. The tin is round.', 'M_PROTOTYPE_ORIENTATION']], s: 'Lying on its side does not change the shape.' },
      { q: 'looks at the roof of a round grass-thatched hut, pointed at the top. Is it a pyramid?', r: 'No, it is a cone', w: [['Yes, because it is pointed', 'A pyramid has flat triangle faces. A round roof is a cone.', 'M_POINTED_MEANS_PYRAMID'], ['Yes, all pointed things are pyramids', 'A cone has a round base and a curved surface.', 'M_POINTED_MEANS_PYRAMID']], s: 'A cone has a round base.' },
      { q: 'wonders whether a plastic water tank and a tin of milk are the same kind of 3-D object. Are they?', r: 'Yes, both are cylinders', w: [['No, the tank is much bigger', 'Size does not change the kind of shape.', 'M_SIZE_CHANGES_SHAPE'], ['No, one is plastic', 'Material does not change the shape.', 'M_SIZE_CHANGES_SHAPE']], s: 'Both have two round flat ends and a curved side.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.geo3.name.sort', cs: `${G}3_D_OBJECTS.NAME_3D_OBJECTS`, form: 'table', rung: 2,
    gen: () => {
      const rows = shuffle([['A dice', 'cube'], ['A matchbox', 'cuboid'], ['A football', 'sphere'], ['A tin of beans', 'cylinder'], ['A tent shaped like a four-sided roof', 'pyramid']]).slice(0, 4);
      const t = pick(rows);
      const wrongNames = ['cube', 'cuboid', 'sphere', 'cylinder', 'pyramid'].filter(n => n !== t[1]);
      const options = mc(t[1], shuffle(wrongNames).slice(0, 3).map(n => [n, n === 'cube' || n === 'cuboid' ? 'A cube has six equal squares; a cuboid has rectangles. Check the faces.' : n === 'pyramid' ? 'A pyramid has a point at the top and flat triangle faces.' : 'Check the shape of the faces and edges.', n === 'pyramid' ? 'M_POINTED_MEANS_PYRAMID' : 'M_EVERY_BOX_IS_CUBE']));
      return { question: `The table lists real objects. What is the 3-D shape of ${t[0].toLowerCase()}?`, model: tbl(['Object'], rows.map(r => [r[0]])), options, instruction: 'Choose the name.',
        hints: ['Think about the faces.', 'Is it round, pointed or box-shaped?'], steps: [`${t[0]} is a ${t[1]}.`, 'Match the faces to the name.'] };
    } }),
  fam({ id: 'g5c.geo3.name.odd', cs: `${G}3_D_OBJECTS.NAME_3D_OBJECTS`, form: 'why', rung: 3,
    gen: fromPool([
      { q: 'looks at a dice, a brick, a matchbox and a tin of beans. Which is the odd one out?', r: 'The tin, because it is a cylinder', w: [['The brick, because it is a different size from the rest', 'Size does not decide the shape.', 'M_SIZE_CHANGES_SHAPE'], ['The dice, because it is smaller than the rest', 'A dice, a brick and a matchbox all have flat faces.', 'M_SIZE_CHANGES_SHAPE']], s: 'Only the tin has round ends.' },
      { q: 'compares a football, a ball of string, a tin and an orange. Which is the odd one out?', r: 'The tin, because it is a cylinder', w: [['The orange, because it is a fruit and not a toy', 'The material does not decide the shape.', 'M_SIZE_CHANGES_SHAPE'], ['The football, because it is the biggest of them', 'Size does not change the shape.', 'M_SIZE_CHANGES_SHAPE']], s: 'The football, string ball and orange are spheres.' },
    ], (p) => `${p.name} `) }),

  fam({ id: 'g5c.geo3.feat.surfaces', cs: `${G}3_D_OBJECTS.DESCRIBE_3D_FEATURES`, form: 'direct', rung: 1,
    gen: fromPool([
      { q: 'looks at a tin of cooking fat. How are its surfaces described?', r: 'Two flat circles and one curved surface', w: [['All its surfaces are curved because it is round', 'The top and bottom are flat circles.', 'M_CYLINDER_SURFACES'], ['All its surfaces are flat', 'The side of a tin is curved.', 'M_CYLINDER_SURFACES']], s: 'A cylinder has both flat and curved surfaces.' },
      { q: 'counts every corner of a pyramid that stands on a square base, the top point included. How many corners are there?', r: '5', w: [['1', 'You counted only the top. There are four more around the base.', 'M_PYRAMID_ONE_CORNER'], ['4', 'The top is a corner too.', 'M_PYRAMID_ONE_CORNER'], ['8', 'That is a cube. A pyramid has fewer.', 'M_PYRAMID_ONE_CORNER']], s: 'One at the top and four around the base.' },
      { q: 'wonders which can roll: a football, a tin of milk, a matchbox. Which can roll?', r: 'The football and the tin', w: [['Only the football', 'A tin rolls on its curved side.', 'M_ONLY_BALLS_ROLL'], ['All three', 'A matchbox has flat sides and does not roll.', 'M_ONLY_BALLS_ROLL']], s: 'Curved surfaces can roll.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.geo3.feat.count', cs: `${G}3_D_OBJECTS.DESCRIBE_3D_FEATURES`, form: 'word', rung: 2,
    gen: () => {
      const o = pick([['a cube', 6, 'flat faces'], ['a cuboid', 6, 'flat faces'], ['a square-based pyramid', 5, 'flat faces'], ['a cylinder', 2, 'flat faces']]);
      return { question: `${person().name} runs a finger over ${o[0]} and counts its flat surfaces. How many are there?`, answer: o[1],
        wrong: [[o[1] + 1, 'Count each flat surface once.', 'M_CYLINDER_SURFACES'], [Math.max(1, o[1] - 1), 'Check the base as well as the sides.', 'M_PYRAMID_ONE_CORNER'], [o[0] === 'a cylinder' ? 3 : 4, 'Count only the flat ones.', 'M_CYLINDER_SURFACES'], [0, 'It has flat surfaces.', 'M_CYLINDER_SURFACES']].filter(w => w[0] !== o[1]),
        hints: ['Picture the object and count the flat parts.', 'Do not count curved surfaces.'], steps: [`${o[0]} has ${o[1]} flat surfaces.`, `Answer ${o[1]}.`], chk: (v) => v === o[1] };
    } }),
  fam({ id: 'g5c.geo3.feat.guess', cs: `${G}3_D_OBJECTS.DESCRIBE_3D_FEATURES`, form: 'why', rung: 3,
    gen: fromPool([
      { q: 'describes an object: it has 6 flat faces, all squares, and 8 corners. Which object is it?', r: 'A cube', w: [['A cuboid', 'A cuboid has some rectangle faces. All six here are squares.', 'M_EVERY_BOX_IS_CUBE'], ['A pyramid', 'A pyramid has triangle faces and fewer corners.', 'M_PYRAMID_ONE_CORNER']], s: 'Six equal squares make a cube.' },
      { q: 'describes an object: two flat circles and one curved surface, and it can roll. Which object is it?', r: 'A cylinder', w: [['A sphere', 'A sphere has no flat circles.', 'M_CYLINDER_SURFACES'], ['A cone', 'A cone has one flat circle and a point.', 'M_POINTED_MEANS_PYRAMID']], s: 'A cylinder has two circles and a curved side.' },
    ], (p) => `${p.name} `) }),

  fam({ id: 'g5c.geo3.dim.sort', cs: `${G}3_D_OBJECTS.2D_VS_3D`, form: 'direct', rung: 1,
    gen: fromPool([
      { q: 'looks at an orange. What 3-D object is it?', r: 'A sphere', w: [['A circle', 'A circle is a flat shape. An orange is solid.', 'M_PLANE_NAME_FOR_SOLID'], ['A round', 'The name of a solid ball shape is sphere.', 'M_PLANE_NAME_FOR_SOLID']], s: 'A solid ball is a sphere.' },
      { q: 'looks at a dice. Which is its correct name?', r: 'A cube', w: [['A square', 'A square is a flat shape. A dice is solid.', 'M_PLANE_NAME_FOR_SOLID'], ['A box', 'The mathematical name of a solid with six equal squares is a cube.', 'M_PLANE_NAME_FOR_SOLID']], s: 'A cube has six square faces.' },
      
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.geo3.dim.which', cs: `${G}3_D_OBJECTS.2D_VS_3D`, form: 'why', rung: 2,
    gen: fromPool([
      { q: 'is deciding whether a chapati is a flat 2-D shape or a solid 3-D object. Which is it?', r: '3-D, because it has thickness', w: [['2-D, because it looks like a circle from above', 'A chapati is thin but solid. It is a 3-D object.', 'M_THIN_OBJECT_IS_2D'], ['2-D, because it is flat and thin like paper', 'It has thickness, so it is 3-D.', 'M_THIN_OBJECT_IS_2D']], s: 'Real objects always have some thickness.' },
      { q: 'draws a circle on a page of an exercise book. Is that circle a flat 2-D shape or a solid 3-D object?', r: '2-D, because a drawing is flat', w: [['3-D, because it is round like a ball', 'Round does not mean 3-D. A drawn circle is flat.', 'M_PLANE_NAME_FOR_SOLID'], ['3-D, because it is printed on a page', 'A drawn circle is a flat shape.', 'M_PLANE_NAME_FOR_SOLID']], s: 'A drawn shape is flat.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.geo3.dim.match', cs: `${G}3_D_OBJECTS.2D_VS_3D`, form: 'table', rung: 3,
    gen: () => {
      const rows = shuffle([['Dice', 'cube'], ['Orange', 'sphere'], ['Tin', 'cylinder'], ['Coin', 'cylinder']]).slice(0, 3);
      const t = pick(rows), flat = { cube: 'square', sphere: 'circle', cylinder: 'circle' }[t[1]];
      const options = mc('A solid object with thickness', [['A flat shape like a ' + flat, `${flat === 'circle' ? 'A circle' : 'A square'} is a flat 2-D shape. The ${t[0].toLowerCase()} is solid.`, 'M_PLANE_NAME_FOR_SOLID'], ['A drawing on paper', 'A drawing is flat. The object is solid.', 'M_THIN_OBJECT_IS_2D']]);
      return { question: `The table lists objects and their solid names. What kind of thing is a ${t[0].toLowerCase()}?`, model: tbl(['Object', 'Solid name'], rows), options, instruction: 'Choose the best answer.', hints: ['Does it take up space?', 'Flat shapes do not.'], steps: ['It is a 3-D object.', 'Its solid name is ' + t[1] + '.'] };
    } }),

  fam({ id: 'g5c.geo3.face.count', cs: `${G}3_D_OBJECTS.2D_FACES_IN_3D`, form: 'word', rung: 1,
    gen: () => {
      const o = pick([['a cube-shaped box', 6, 'squares'], ['a cuboid-shaped box', 6, 'rectangles'], ['a square-based pyramid', 5, 'faces in all (four triangles and one square)'], ['a tin of Kimbo', 2, 'circles']]);
      return { question: `Mwangi traces round every flat face of ${o[0]} on paper. How many shapes does he draw in all${o[0] === 'a tin of Kimbo' ? ' (flat shapes only)' : ''}?`, answer: o[1],
        wrong: [[o[0].includes('cube') || o[0].includes('cuboid') ? 3 : o[1] + 1, 'You counted only the faces you can see. Count the hidden ones too.', 'M_VISIBLE_FACES_ONLY'], [o[0] === 'a tin of Kimbo' ? 3 : o[1] - 1, 'The curved side is not a flat face. Count the flat faces only.', 'M_CYLINDER_SIDE_RECTANGLE_FACE'], [4, 'A pyramid also has a base.', 'M_PYRAMID_ALL_TRIANGLES'], [1, 'Count all the flat faces.', 'M_VISIBLE_FACES_ONLY']].filter(w => w[0] !== o[1]),
        hints: ['Include the hidden faces.', 'Count only flat faces.'], steps: [`${o[0]} has ${o[1]} flat faces.`, `Answer ${o[1]}.`], chk: (v) => v === o[1] };
    } }),
  fam({ id: 'g5c.geo3.face.shape', cs: `${G}3_D_OBJECTS.2D_FACES_IN_3D`, form: 'direct', rung: 2,
    gen: fromPool([
      { q: 'looks at a square-based pyramid. What flat shapes are its faces?', r: 'Four triangles and a square', w: [['Triangles only, with no square at all', 'The base is a square.', 'M_PYRAMID_ALL_TRIANGLES'], ['Squares only, all the way round', 'The sides slope up to a point and are triangles.', 'M_PYRAMID_ALL_TRIANGLES']], s: 'The base is a square and the sides are triangles.' },
      { q: 'looks at a football. Which 2-D shape is a flat face of the ball?', r: 'None, it has one curved surface', w: [['A circle, because the ball looks round', 'The outline looks like a circle, but the ball has no flat face.', 'M_SPHERE_HAS_CIRCLE_FACE'], ['A square, like a dice face', 'A football has no flat faces.', 'M_SPHERE_HAS_CIRCLE_FACE']], s: 'A sphere has no flat faces.' },
      { q: 'looks at a tin of Kimbo. What flat shapes are found on it?', r: 'Two circles', w: [['Two circles and a rectangle', 'The side is curved. It is not a flat rectangle.', 'M_CYLINDER_SIDE_RECTANGLE_FACE'], ['One circle', 'There is one at the top and one at the bottom.', 'M_CYLINDER_SIDE_RECTANGLE_FACE']], s: 'A cylinder has two flat circles.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.geo3.face.tf', cs: `${G}3_D_OBJECTS.2D_FACES_IN_3D`, form: 'why', rung: 3,
    gen: fromPool([
      { q: 'says: all the faces of a square-based pyramid are triangles. Is this true or false?', r: 'False. The base is a square', w: [['True. Pyramids have triangle faces', 'The base of a square-based pyramid is a square.', 'M_PYRAMID_ALL_TRIANGLES'], ['True. A point means triangles', 'The base is a square.', 'M_PYRAMID_ALL_TRIANGLES']], s: 'Four triangles and one square.' },
      { q: 'says: a cube-shaped box has only 3 faces because only 3 can be seen. Is this true or false?', r: 'False. It has 6 faces, some hidden', w: [['True. We count only the faces we can see', 'Hidden faces count too.', 'M_VISIBLE_FACES_ONLY'], ['True. A cube has 3 faces', 'A cube has six faces.', 'M_VISIBLE_FACES_ONLY']], s: 'A cube has six faces.' },
    ], (p) => `${p.name} `) }),

  // ================================================================ DATA REPRESENTATION
  fam({ id: 'g5c.dat.plan.categories', cs: `${D}PLAN_DATA_COLLECTION`, form: 'direct', rung: 2,
    gen: fromPool([
      { q: 'will record vehicles passing the school gate using these categories: car, matatu, vehicle, motorcycle. What is wrong?', r: 'Vehicle includes the others', w: [['Nothing is wrong with the categories', 'A matatu is also a vehicle, so it fits two categories. Categories must not overlap.', 'M_OVERLAPPING_CATEGORIES'], ['There are too many categories to count', 'The number is fine. The problem is that they overlap.', 'M_OVERLAPPING_CATEGORIES']], s: 'Each item should fit exactly one category.' },
      { q: 'records favourite foods using: ugali, rice, chapati, food. What is wrong?', r: 'Food includes all the others', w: [['Nothing is wrong with these categories', 'Every food is also food. Categories must not overlap.', 'M_OVERLAPPING_CATEGORIES'], ['Foods cannot be used as data', 'Foods can be data. Data does not have to be numbers.', 'M_DATA_ONLY_NUMBERS']], s: 'Categories must not overlap.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.dat.plan.what', cs: `${D}PLAN_DATA_COLLECTION`, form: 'why', rung: 2,
    gen: fromPool([
      { q: 'asks which of these can be collected as data: shoe sizes, favourite foods, or both?', r: 'Both, because data can be words or numbers', w: [['Only shoe sizes, because data is numbers', 'Favourite foods are data too. Data can be words, colours or numbers.', 'M_DATA_ONLY_NUMBERS'], ['Neither, because they are opinions', 'Opinions and sizes can both be recorded as data.', 'M_DATA_ONLY_NUMBERS']], s: 'Data is information we collect.' },
      { q: 'asks whether the colours of vehicles seen at the gate are data.', r: 'Yes, colours are data', w: [['No, only numbers are data', 'Colours are data. We can count how many of each.', 'M_DATA_ONLY_NUMBERS'], ['No, colours cannot be counted', 'We can count how many are red, blue, white.', 'M_DATA_ONLY_NUMBERS']], s: 'We can count items in each category.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.dat.plan.method', cs: `${D}PLAN_DATA_COLLECTION`, form: 'word', rung: 3,
    gen: () => {
      const cats = pick([['car', 'matatu', 'motorcycle', 'lorry'], ['tea', 'uji', 'milk', 'juice']]), extra = pick(['vehicle', 'drink']);
      const n = cats.length, bad = n + 1;
      return { question: `${person().name} plans categories: ${cats.join(', ')} and ${cats[0] === 'tea' ? 'drink' : 'vehicle'} (which means any of them). How many categories should be kept so none overlap?`, answer: n,
        wrong: [[bad, `The category ${cats[0] === 'tea' ? 'drink' : 'vehicle'} includes all the others and overlaps. Remove it.`, 'M_OVERLAPPING_CATEGORIES'], [1, 'Keep each separate category.', 'M_OVERLAPPING_CATEGORIES'], [n - 1, 'Only the overlapping one is removed.', 'M_OVERLAPPING_CATEGORIES'], [2 * n, 'Do not double the number.', 'M_OVERLAPPING_CATEGORIES']],
        hints: ['Which category includes all the others?', 'Remove it.'], steps: [`${n} separate categories remain.`, `Answer ${n}.`], chk: (v) => v === n };
    } }),

  fam({ id: 'g5c.dat.col.check', cs: `${D}COLLECT_DATA_30`, form: 'word', rung: 2,
    gen: () => {
      const v = [randInt(8, 13), randInt(7, 10), randInt(5, 8), randInt(3, 6)], asked = randInt(26, 32), tot = v.reduce((a, b) => a + b, 0), p = person();
      if (tot === asked) return null;
      return { question: `Records from a survey: ${asked} classmates were asked, and ${p.name} wrote tea ${v[0]}, uji ${v[1]}, milk ${v[2]}, juice ${v[3]}. By how many does the recorded total differ from the number asked?`, answer: Math.abs(tot - asked),
        wrong: [[tot, 'That is the total recorded. Find how far it is from the number asked.', 'M_DOUBLE_COUNTING'], [asked, 'That is the number asked.', 'M_DOUBLE_COUNTING'], [tot + asked, 'Take away to find the difference.', 'M_DOUBLE_COUNTING'], [Math.abs(tot - asked) + 1, 'Check the addition of the four numbers.', 'M_DOUBLE_COUNTING']],
        hints: ['Add the four recorded numbers.', 'Compare with the number asked.'], steps: [`${v.join(' + ')} = ${tot}.`, `${tot} and ${asked} differ by ${Math.abs(tot - asked)}.`], chk: (x) => x === Math.abs(v.reduce((a, b) => a + b, 0) - asked) };
    } }),
  fam({ id: 'g5c.dat.col.error', cs: `${D}COLLECT_DATA_30`, form: 'direct', rung: 2,
    gen: fromPool([
      { q: 'asked 30 learners their shoe size and wrote down only: 3, 4, 5, 6. What has gone wrong?', r: 'Each size was written only once', w: [['Nothing is wrong with the record', 'Thirty learners need thirty records. Each answer must be recorded.', 'M_DISTINCT_VALUES_ONLY'], ['The sizes should all be added together', 'We keep each observation, we do not add them.', 'M_DISTINCT_VALUES_ONLY']], s: 'Every observation must be recorded.' },
      { q: 'asked 30 classmates their favourite drink and the record shows tea 12, uji 9, milk 8, juice 6. What should be checked?', r: 'Whether the total matches the 30 asked', w: [['Nothing is wrong, the numbers look fine to me', 'The total is 35 but only 30 were asked, so some answers were counted twice.', 'M_DOUBLE_COUNTING'], ['Whether tea is the biggest number', 'Check that the total equals the number asked.', 'M_DOUBLE_COUNTING']], s: '12 + 9 + 8 + 6 = 35, not 30.' },
    ], (p) => `${p.name} checks a friend's survey. The friend `) }),
  fam({ id: 'g5c.dat.col.fix', cs: `${D}COLLECT_DATA_30`, form: 'spot', rung: 3,
    gen: () => { const p = person(), v = [11, 9, 8, 6]; return spot(`${p.name} asked 30 classmates their favourite drink and recorded tea ${v[0]}, uji ${v[1]}, milk ${v[2]}, juice ${v[3]}. Which step has the mistake?`, ['Step 1: Ask each of the 30 classmates one question.', `Step 2: Record the answers: ${v.join(', ')}. The record is finished without adding them.`, 'Step 3: Say the record is correct.'], 1, `The numbers add to ${v.reduce((a, b) => a + b, 0)}, not 30, so some answers were counted twice or missed. Check the total against the number asked.`, 'M_DOUBLE_COUNTING', 'Does the total equal 30?'); } }),

  fam({ id: 'g5c.dat.tab.headings', cs: `${D}DRAW_RECORDING_TABLE`, form: 'direct', rung: 1,
    gen: fromPool([
      { q: 'draws a table with two rows: Mango 7 and Orange 4. A visitor asks "7 what?" What should be added?', r: 'A title and column headings', w: [['More colours to make the table clearer', 'Colour does not tell what the numbers mean. Add headings.', 'M_TABLE_NO_HEADINGS'], ['Nothing, it is already clear enough', 'A reader cannot tell what 7 means without headings.', 'M_TABLE_NO_HEADINGS']], s: 'Headings tell the reader what the numbers mean.' },
      { q: 'records numbers of boda bodas and matatus in a table with no title. Why is this a problem?', r: 'The reader cannot tell what was counted', w: [['It is not a problem for the reader', 'A title and headings are needed to read a table.', 'M_TABLE_NO_HEADINGS'], ['The table is far too small to read', 'The size is fine. The headings are missing.', 'M_TABLE_NO_HEADINGS']], s: 'A table needs a title and headings.' },
    ], (p) => `${p.name} `) }),
  fam({ id: 'g5c.dat.tab.align', cs: `${D}DRAW_RECORDING_TABLE`, form: 'table', rung: 2,
    gen: () => {
      const names = shuffle(['Otieno', 'Akinyi', 'Baraka']), ages = [11, 10, 12], who = randInt(0, 2);
      return { question: `A Name and Age table shows ${names.map((n, i) => `${n} is ${ages[i]}`).join(', ')}. What is ${names[who]}'s age? Read the table.`, model: tbl(['Name', 'Age'], names.map((n, i) => [n, String(ages[i])])), answer: ages[who],
        wrong: [[ages[(who + 1) % 3], 'That value is in the next row. Read across the same row.', 'M_ROW_MISALIGNMENT'], [ages[(who + 2) % 3], 'That value belongs to another name.', 'M_ROW_MISALIGNMENT'], [ages[who] + 1, 'Check the row for that name.', 'M_ROW_MISALIGNMENT'], [who + 1, 'That is the row number.', 'M_ROW_MISALIGNMENT']],
        hints: ['Find the name in the first column.', 'Read across the same row.'], steps: [`${names[who]} is in row ${who + 1}.`, `Age ${ages[who]}.`], chk: (v) => v === ages[who] };
    } }),
  fam({ id: 'g5c.dat.tab.build', cs: `${D}DRAW_RECORDING_TABLE`, form: 'why', rung: 3,
    gen: fromPool([
      { q: 'wants to record the names and ages of 3 learners. Which table is set out correctly?', r: 'Headings Name and Age, one row each', w: [['A list of names with ages on the next line', 'A table needs rows and columns with headings.', 'M_TABLE_NO_HEADINGS'], ['A table with each age beside the wrong name', 'Each age must be in the same row as its name.', 'M_ROW_MISALIGNMENT']], s: 'Headings and matching rows.' },
    ], (p) => `${p.name} `) }),

  fam({ id: 'g5c.dat.tg.draw', cs: `${D}DRAW_TALLY_GROUPS`, form: 'direct', rung: 1,
    gen: () => {
      const n = randInt(6, 17), g = Math.floor(n / 5), r = n % 5, mk = (g2, r2, five) => `${Array(g2).fill(five ? '||||/' : '||||/').join(' ')}${r2 ? ' ' + '|'.repeat(r2) : ''}`.trim();
      const right = `${Array(g).fill('[||||/]').join(' ')}${r ? ' ' + '|'.repeat(r) : ''}`.trim();
      const six = `${Array(g).fill('[|||||/]').join(' ')}${r ? ' ' + '|'.repeat(r) : ''}`.trim(), nogroup = '|'.repeat(n);
      const options = mc(right, [[six, 'A group of five is four upright strokes and one across them. Five uprights and a stroke make six.', 'M_GATE_SIX_STROKES'], [nogroup, 'Group the tally in fives so it is easy to count.', 'M_NO_GROUPING'], [`${Array(g + 1).fill('[||||/]').join(' ')}`, 'Count the groups again.', 'M_GATE_SIX_STROKES']].filter(w => w[0] !== right));
      return { question: `Choose the tally picture that correctly stands for ${n} people in a queue, grouped in fives.`, options, instruction: 'Choose the correct tally.',
        hints: ['Each group of five is four uprights and one across.', 'Then draw the single strokes left over.'], steps: [`${n} = ${g} groups of 5 and ${r} left.`, right + '.'] };
    } }),
  fam({ id: 'g5c.dat.tg.count', cs: `${D}DRAW_TALLY_GROUPS`, form: 'word', rung: 2,
    gen: () => {
      const g = randInt(2, 5), r = randInt(0, 4), n = g * 5 + r, shown = `${Array(g).fill('[||||/]').join(' ')}${r ? ' ' + '|'.repeat(r) : ''}`.trim();
      return { question: `A tally shows ${shown}. How many does it stand for?`, answer: n,
        wrong: [[g * 4 + r, 'The crossing stroke is part of the group. A gate stands for 5, not 4.', 'M_GATE_READ_AS_FOUR'], [g * 6 + r, 'A gate is 5, not 6.', 'M_GATE_SIX_STROKES'], [g + r, 'Each group is 5, not 1.', 'M_NO_GROUPING'], [n + 1, 'Count the groups of 5 and then the strokes.', 'M_GATE_SIX_STROKES']],
        hints: ['Each [||||/] is 5.', 'Add the single strokes left.'], steps: [`${g} × 5 = ${g * 5}.`, `${g * 5} + ${r} = ${n}.`], chk: (v) => v === n };
    } }),
  fam({ id: 'g5c.dat.tg.spot', cs: `${D}DRAW_TALLY_GROUPS`, form: 'spot', rung: 3,
    gen: () => { const p = person(), n = randInt(7, 13); return spot(`${p.name} draws ${n} using tally marks. Which step has the mistake?`, ['Step 1: Draw groups of five.', 'Step 2: Draw five upright strokes and then one more crossing them, so each group has six strokes.', 'Step 3: Add the single strokes left.'], 1, 'A group of five is four uprights with one stroke across them. Five uprights and a crossing stroke make six.', 'M_GATE_SIX_STROKES', 'How many strokes make a group of five?'); } }),

  fam({ id: 'g5c.dat.traw.drinks', cs: `${D}TALLY_RAW_DATA`, form: 'word', rung: 1,
    gen: () => {
      const items = shuffle(['tea', 'uji', 'milk']), list = [], count = { tea: 0, uji: 0, milk: 0 }, n = randInt(10, 14);
      for (let i = 0; i < n; i++) { const x = pick(items); list.push(x); count[x]++; }
      const t = pick(items);
      if (count[t] < 3) return null;
      return { question: `A learner records the drinks of ${n} classmates, one after another: ${list.join(', ')}. How many chose ${t}?`, answer: count[t],
        wrong: [[count[t] + 1, 'You counted one item twice. Tick each item as you tally it.', 'M_TALLY_SKIP_OR_REPEAT'], [count[t] - 1, 'You missed one. Tick each item as you tally it.', 'M_TALLY_SKIP_OR_REPEAT'], [n - count[t], 'That is the number who did not choose ' + t + '.', 'M_TALLY_SKIP_OR_REPEAT'], [n, 'That is the total.', 'M_TALLY_SKIP_OR_REPEAT']],
        hints: ['Go through the list in order and tick each item.', `Count only ${t}.`], steps: [`${t} appears ${count[t]} times.`, `${count[t]}.`], chk: (v) => v === count[t] };
    } }),
  fam({ id: 'g5c.dat.traw.sizes', cs: `${D}TALLY_RAW_DATA`, form: 'direct', rung: 2,
    gen: () => {
      const sizes = [4, 5, 6], list = Array.from({ length: randInt(9, 13) }, () => pick(sizes)), s = pick(sizes), c = list.filter(x => x === s).length;
      if (c < 3 || c > 8) return null;
      const g = Math.floor(c / 5), r = c % 5, tal = (n) => `${Array(Math.floor(n / 5)).fill('[||||/]').join(' ')}${n % 5 ? ' ' + '|'.repeat(n % 5) : ''}`.trim();
      const options = mc(tal(c), [[tal(c * s), `You drew one stroke for every unit of the shoe size. Draw one stroke for each learner with size ${s}.`, 'M_TALLY_THE_VALUE'], [tal(c + 1), 'You tallied one learner twice.', 'M_TALLY_SKIP_OR_REPEAT'], [tal(Math.max(1, c - 1)), 'You missed one learner.', 'M_TALLY_SKIP_OR_REPEAT']]);
      if (!options) return null;
      return { question: `The shoe sizes of some learners are ${list.join(', ')}. Which is the tally for size ${s}?`, options, instruction: 'Choose the tally.',
        hints: ['One stroke for each learner with that size.', 'Do not draw strokes for the size itself.'], steps: [`Size ${s} appears ${c} times.`, tal(c) + '.'] };
    } }),
  fam({ id: 'g5c.dat.traw.spot', cs: `${D}TALLY_RAW_DATA`, form: 'spot', rung: 3,
    gen: () => { const p = person(); return spot(`${p.name} tallies the drinks: tea, uji, tea, milk, tea, uji, milk, tea, uji, tea. ${p.She} gets tea ||||, uji |||, milk ||. Which step has the mistake?`, ['Step 1: Go through the list one by one.', 'Step 2: Tally tea 4, uji 3, milk 2 and do not tick the items off.', 'Step 3: The total is 9.'], 1, 'There are 10 items, so one was missed. Tick off each item as it is tallied. Tea has 5, uji 3 and milk 2.', 'M_TALLY_SKIP_OR_REPEAT', 'Does the total match the list?'); } }),

  fam({ id: 'g5c.dat.tf.read', cs: `${D}TALLY_TO_FREQUENCY`, form: 'word', rung: 1,
    gen: () => {
      const g = randInt(1, 4), r = randInt(0, 4), n = g * 5 + r;
      const rows = ['Football', 'Netball', 'Volleyball'].map(x => { const gg = randInt(1, 3), rr = randInt(0, 4); return [x, `${Array(gg).fill('[||||/]').join(' ')}${rr ? ' ' + '|'.repeat(rr) : ''}`.trim(), gg * 5 + rr]; });
      const t = pick(rows);
      return { question: `A tally table shows the games learners like. What is the frequency of ${t[0]}?`, model: tbl(['Game', 'Tally'], rows.map(r => [r[0], r[1]])), answer: t[2],
        wrong: [[t[2] - Math.floor(t[2] / 5), 'The crossing stroke counts: a group of five is 5, not 4.', 'M_GATE_READ_AS_FOUR'], [t[2] + 1, 'Count each group of five as 5.', 'M_GATE_READ_AS_FOUR'], [Math.floor(t[2] / 5), 'That is the number of groups. Each group is 5.', 'M_GATE_READ_AS_FOUR'], [rows.reduce((a, r) => a + r[2], 0), 'That is the total of all the games.', 'M_GATE_READ_AS_FOUR']].filter(w => w[0] !== t[2]),
        hints: ['Each [||||/] stands for 5.', 'Add the single strokes.'], steps: [`${t[1]} stands for ${t[2]}.`, `${t[0]}: ${t[2]}.`], chk: (v) => v === t[2], _n: n };
    } }),
  fam({ id: 'g5c.dat.tf.complete', cs: `${D}TALLY_TO_FREQUENCY`, form: 'table', rung: 2,
    gen: () => {
      const g = [randInt(1, 3), randInt(1, 3)], r = [randInt(0, 4), randInt(0, 4)], f = [g[0] * 5 + r[0], g[1] * 5 + r[1]], tl = (gg, rr) => `${Array(gg).fill('[||||/]').join(' ')}${rr ? ' ' + '|'.repeat(rr) : ''}`.trim();
      if (f[0] === f[1]) return null;
      return { question: 'Complete the frequency column. What is the total frequency of the two rows together?', model: tbl(['Fruit', 'Tally', 'Frequency'], [['Mango', tl(g[0], r[0]), String(f[0])], ['Orange', tl(g[1], r[1]), '?']]), answer: f[1],
        wrong: [[f[1] - g[1], 'A group of five counts as 5, so use all the strokes.', 'M_GATE_READ_AS_FOUR'], [f[0] + f[1], 'That is the total of both rows. The question asks for the missing frequency.', 'M_GATE_READ_AS_FOUR'], [f[1] + 1, 'Count the groups of five and the single strokes.', 'M_GATE_READ_AS_FOUR'], [g[1] + r[1], 'Each group is 5, not 1.', 'M_GATE_READ_AS_FOUR']],
        hints: ['Read the tally for Orange.', 'Each group of five is 5.'], steps: [`${g[1]} groups of 5 and ${r[1]} more.`, `${f[1]}.`], chk: (v) => v === f[1] };
    } }),
  fam({ id: 'g5c.dat.tf.bigger', cs: `${D}TALLY_TO_FREQUENCY`, form: 'direct', rung: 3,
    gen: () => {
      const a = randInt(6, 14), b = randInt(6, 14);
      if (a === b || Math.abs(a - b) < 2) return null;
      const tl = (n) => `${Array(Math.floor(n / 5)).fill('[||||/]').join(' ')}${n % 5 ? ' ' + '|'.repeat(n % 5) : ''}`.trim();
      const big = a > b ? 'A' : 'B';
      const options = mc(`Tally ${big}`, [[`Tally ${big === 'A' ? 'B' : 'A'}`, 'Count each group of five as 5 before you compare.', 'M_GATE_READ_AS_FOUR'], ['They are equal', 'Work out the two numbers first.', 'M_GATE_READ_AS_FOUR']]);
      return { question: `Tally A is ${tl(a)}. Tally B is ${tl(b)}. Which tally shows the larger number?`, options, instruction: 'Choose the larger tally.',
        hints: ['Work out each number first.', 'A group of five is 5.'], steps: [`A = ${a}, B = ${b}.`, `Tally ${big} is larger.`] };
    } }),

  fam({ id: 'g5c.dat.prep.rows', cs: `${D}PREPARE_FREQUENCY_TABLE`, form: 'word', rung: 2,
    gen: () => {
      const ages = [10, 11, 12], list = Array.from({ length: randInt(8, 12) }, () => pick(ages)), rows = ages.filter(a => list.includes(a)).length;
      return { question: `A learner records the ages of some classmates: ${list.join(', ')}. A frequency table has one row for each different age. How many rows does it need?`, answer: rows,
        wrong: [[list.length, 'A table has one row for each different age, not for each learner.', 'M_ROW_PER_OBSERVATION'], [rows + 1, 'Count only the different ages.', 'M_ROW_PER_OBSERVATION'], [Math.max(1, rows - 1), 'Check which different ages appear.', 'M_ROW_PER_OBSERVATION'], [list.length - rows, 'That is not the number of rows.', 'M_ROW_PER_OBSERVATION']],
        hints: ['Which ages appear?', 'One row for each different one.'], steps: [`The ages ${ages.filter(a => list.includes(a)).join(', ')} appear.`, `${rows} rows.`], chk: (v) => v === rows };
    } }),
  fam({ id: 'g5c.dat.prep.total', cs: `${D}PREPARE_FREQUENCY_TABLE`, form: 'table', rung: 2,
    gen: () => {
      const v = [randInt(5, 10), randInt(5, 11), randInt(3, 8)], tot = v.reduce((a, b) => a + b, 0), miss = randInt(0, 2);
      return { question: `Data were collected from ${tot} learners. Find the missing frequency in the table.`, model: tbl(['Drink', 'Frequency'], ['Tea', 'Uji', 'Milk'].map((n, i) => [n, i === miss ? '?' : String(v[i])])), answer: v[miss],
        wrong: [[tot, 'That is the total, not one category.', 'M_FREQ_TOTAL_UNCHECKED'], [tot - v[miss], 'That is the total of the other categories.', 'M_FREQ_TOTAL_UNCHECKED'], [v[miss] + 1, 'Check that the frequencies add to the total.', 'M_FREQ_TOTAL_UNCHECKED'], [v[miss] - 1, 'Check that the frequencies add to the total.', 'M_FREQ_TOTAL_UNCHECKED']],
        hints: ['All the frequencies must add to the total.', 'Subtract the known frequencies from the total.'], steps: [`Total ${tot} minus the others.`, `${v[miss]}.`], chk: (x) => x + v.reduce((a, b, i) => a + (i === miss ? 0 : b), 0) === tot };
    } }),
  fam({ id: 'g5c.dat.prep.check', cs: `${D}PREPARE_FREQUENCY_TABLE`, form: 'why', rung: 3,
    gen: () => {
      const v = [8, 11, 6, 4].map(x => x + randInt(-1, 1)), n = 30, tot = v.reduce((a, b) => a + b, 0);
      if (tot === n) return null;
      const options = mc(`No. The frequencies add to ${tot}, not ${n}`, [['Yes. Frequencies do not need to add to anything', 'The frequencies must add to the number of learners asked.', 'M_FREQ_TOTAL_UNCHECKED'], [`Yes. There are four rows, so it is complete`, 'Check that the frequencies add to the total.', 'M_FREQ_TOTAL_UNCHECKED']]);
      return { question: `A table of favourite fruits for ${n} learners gives the frequencies ${v.join(', ')}. Is the table correct?`, options, instruction: 'Choose the answer and the reason.',
        hints: ['Add the frequencies.', `Do they make ${n}?`], steps: [`${v.join(' + ')} = ${tot}.`, `${tot} is not ${n}.`] };
    } }),

  fam({ id: 'g5c.dat.read.most', cs: `${D}READ_FREQUENCY_TABLE`, form: 'direct', rung: 2,
    gen: () => {
      const ages = [10, 11, 12], f = shuffle([9, 14, 7]);
      const best = ages[f.indexOf(14)];
      const options = mc(`Age ${best}`, [[`Age ${12}`, 'That is the biggest age, not the age with the most learners. Look at the frequency.', 'M_BIGGEST_LABEL_IS_MOST'], [`14 learners`, 'That is the frequency. The question asks for the age.', 'M_VALUE_VS_FREQUENCY'], [`Age ${ages.find(a => a !== best && a !== 12) || 10}`, 'Compare the frequencies.', 'M_BIGGEST_LABEL_IS_MOST']].filter(w => w[0] !== `Age ${best}`));
      return { question: 'The table shows the ages of learners in a club. Which age is the most common?', model: tbl(['Age', 'Number of learners'], ages.map((a, i) => [String(a), String(f[i])])), options, instruction: 'Choose the age.',
        hints: ['The most common has the biggest frequency.', 'Give the age, not the frequency.'], steps: [`14 is the biggest frequency, at age ${best}.`, `Age ${best}.`] };
    } }),
  fam({ id: 'g5c.dat.read.count', cs: `${D}READ_FREQUENCY_TABLE`, form: 'word', rung: 1,
    gen: () => {
      const names = ['Football', 'Netball', 'Volleyball', 'Athletics'], f = [randInt(5, 14), randInt(4, 12), randInt(3, 9), randInt(2, 8)], k = randInt(0, 3);
      return { question: 'The table shows the favourite sports of learners in a class. How many learners chose the sport named in the question?'.replace('named in the question', names[k]), model: tbl(['Sport', 'Number of learners'], names.map((n, i) => [n, String(f[i])])), answer: f[k],
        wrong: [[f[(k + 1) % 4], 'That is the number for another sport. Find the correct row.', 'M_BIGGEST_LABEL_IS_MOST'], [f.reduce((a, b) => a + b, 0), 'That is the total of all sports.', 'M_VALUE_VS_FREQUENCY'], [k + 1, 'That is the row number.', 'M_VALUE_VS_FREQUENCY'], [f[k] + 1, 'Read the number in the row.', 'M_VALUE_VS_FREQUENCY']],
        hints: ['Find the sport in the first column.', 'Read the number in the same row.'], steps: [`${names[k]} has ${f[k]}.`, `${f[k]}.`], chk: (v) => v === f[k] };
    } }),
  fam({ id: 'g5c.dat.read.least', cs: `${D}READ_FREQUENCY_TABLE`, form: 'why', rung: 3,
    gen: () => {
      const sizes = [3, 4, 5, 6], f = shuffle([5, 12, 9, 4]), best = sizes[f.indexOf(12)];
      const options = mc(`Size ${best}, with 12 learners`, [[`Size 6, because it is the biggest size`, 'The biggest label is not the most common. Look at the frequency.', 'M_BIGGEST_LABEL_IS_MOST'], [`Size ${sizes[f.indexOf(9)]}, with 9 learners`, 'Compare all the frequencies.', 'M_BIGGEST_LABEL_IS_MOST'], ['12, because it is the biggest number', 'That is the frequency. The question asks for the size.', 'M_VALUE_VS_FREQUENCY']].filter(w => !w[0].startsWith(`Size ${best}`)));
      return { question: 'The table shows shoe sizes. Which size is the most common, and how many learners wear it?', model: tbl(['Shoe size', 'Learners'], sizes.map((s, i) => [String(s), String(f[i])])), options, instruction: 'Choose the size and number.',
        hints: ['The most common has the biggest frequency.', 'Name the size.'], steps: ['The biggest frequency is 12.', `It is for size ${best}.`] };
    } }),

  fam({ id: 'g5c.dat.cmp.more', cs: `${D}COMPARE_TOTAL_FREQUENCIES`, form: 'word', rung: 1,
    gen: () => {
      const a = randInt(10, 20), b = randInt(5, 9);
      return { question: `In 15 minutes, ${a} matatus and ${b} boda bodas passed the school. How many more matatus than boda bodas passed?`, answer: a - b,
        wrong: [[a + b, '"How many more" means find the difference. Take away.', 'M_HOW_MANY_MORE_ADD'], [a, 'That is the number of matatus.', 'M_HOW_MANY_MORE_ADD'], [b, 'That is the number of boda bodas.', 'M_HOW_MANY_MORE_ADD'], [a - b + 1, 'Check the subtraction.', 'M_HOW_MANY_MORE_ADD']],
        hints: ['How many more means the difference.', 'Subtract the smaller number.'], steps: [`${a} − ${b} = ${a - b}.`, `${a - b} more matatus.`], chk: (v) => v + b === a };
    } }),
  fam({ id: 'g5c.dat.cmp.total', cs: `${D}COMPARE_TOTAL_FREQUENCIES`, form: 'table', rung: 2,
    gen: () => {
      const f = [randInt(6, 12), randInt(5, 9), randInt(3, 7), randInt(2, 6)], tot = f.reduce((a, b) => a + b, 0);
      return { question: 'A class survey recorded drinks as in the table. What is the total number of learners surveyed?', model: tbl(['Drink', 'Learners'], ['Tea', 'Uji', 'Milk', 'Juice'].map((n, i) => [n, String(f[i])])), answer: tot,
        wrong: [[4, 'That is the number of drinks listed. Add the learners.', 'M_TOTAL_IS_ROWS'], [f[0], 'That is one drink only.', 'M_TOTAL_IS_ROWS'], [tot - f[3], 'The last drink is missing.', 'M_TOTAL_IS_ROWS'], [tot + 1, 'Check the addition.', 'M_TOTAL_IS_ROWS']],
        hints: ['Each learner chose one drink.', 'Add all the frequencies.'], steps: [`${f.join(' + ')} = ${tot}.`, `${tot} learners.`], chk: (v) => v === f.reduce((a, b) => a + b, 0) };
    } }),
  fam({ id: 'g5c.dat.cmp.not', cs: `${D}COMPARE_TOTAL_FREQUENCIES`, form: 'direct', rung: 3,
    gen: () => {
      const f = [12, 8, 6, 4].map(x => x + randInt(0, 2)), tot = f.reduce((a, b) => a + b, 0);
      const options = mc(`${tot - f[0]} learners`, [[`${f[0]} learners`, 'That is the number who chose tea. The question asks how many did NOT choose it.', 'M_NOT_CHOOSING_MISREAD'], [`${tot} learners`, 'That is everybody.', 'M_NOT_CHOOSING_MISREAD'], [`${tot - f[0] + f[1]} learners`, 'Take away the tea learners from the total once.', 'M_NOT_CHOOSING_MISREAD']]);
      return { question: `The table shows favourite drinks: tea ${f[0]}, uji ${f[1]}, milk ${f[2]}, juice ${f[3]}. How many learners did not choose tea?`, options, instruction: 'Choose the number.',
        hints: ['Find the total number of learners.', 'Take away those who chose tea.'], steps: [`Total ${tot}.`, `${tot} − ${f[0]} = ${tot - f[0]}.`] };
    } }),

  fam({ id: 'g5c.dat.inf.majority', cs: `${D}INFER_FROM_FREQUENCY_TABLE`, form: 'why', rung: 3,
    gen: () => {
      const f = [12, 8, 6, 4], tot = 30;
      const options = mc('False, 12 is less than half of 30', [['True, because football is the most popular game', 'Most popular is not the same as more than half. Half of 30 is 15.', 'M_MOST_POPULAR_IS_MAJORITY'], ['True, because 12 is more than any other game', 'More than any other game does not mean more than half of all.', 'M_MOST_POPULAR_IS_MAJORITY']]);
      return { question: `${person().name} reads that the favourite games of 30 learners are: football ${f[0]}, netball ${f[1]}, volleyball ${f[2]}, athletics ${f[3]}. True or false: more than half the learners chose football.`, options, instruction: 'Choose true or false, with the reason.',
        hints: ['What is half of 30?', 'Compare 12 with half.'], steps: ['Half of 30 is 15.', '12 is less than 15.'] };
    } }),
  fam({ id: 'g5c.dat.inf.decide', cs: `${D}INFER_FROM_FREQUENCY_TABLE`, form: 'direct', rung: 2,
    gen: () => {
      const f = shuffle([11, 9, 6, 4]), fruits = ['banana', 'mango', 'orange', 'pawpaw'], best = fruits[f.indexOf(11)];
      const options = mc(`${best[0].toUpperCase() + best.slice(1)}, because most learners chose it`, [[`Mango, because I like mangoes best`.replace('Mango', fruits.find(x => x !== best && x !== 'mango') ? 'Mango' : 'Banana'), 'A decision should follow the data, not what one person likes.', 'M_OPINION_OVER_DATA'], [`The fruit with the longest name`, 'Use the numbers in the table.', 'M_OPINION_OVER_DATA'], [`Every fruit, in the same amount`, 'The data show which is chosen most. Use it.', 'M_OPINION_OVER_DATA']].filter(w => !w[0].startsWith(best[0].toUpperCase() + best.slice(1))));
      return { question: `The canteen asked 30 learners for their favourite fruit: ${fruits.map((x, i) => `${x} ${f[i]}`).join(', ')}. Which fruit should the canteen sell the most of?`, options, instruction: 'Choose the best decision.',
        hints: ['Use the table.', 'Which has the highest frequency?'], steps: [`${best} has the highest frequency, 11.`, `Sell the most ${best}.`] };
    } }),
  fam({ id: 'g5c.dat.inf.support', cs: `${D}INFER_FROM_FREQUENCY_TABLE`, form: 'word', rung: 3,
    gen: () => {
      const options = mc('In this class, football was chosen most', [['Football is the favourite game of all children in Kenya', 'One class of 30 cannot tell about every child in Kenya.', 'M_OVERGENERALISE'], ['Every learner in the school likes football', 'The table is for one class only.', 'M_OVERGENERALISE']]);
      return { question: `${person().name} reads: in a survey of one Grade 5 class of 30, football was chosen by 12 learners, more than any other game. Which statement does the table support?`, options, instruction: 'Choose the statement the table supports.',
        hints: ['Who was asked?', 'Only say what the table shows.'], steps: ['The survey asked one class.', 'So we can only say what happened in that class.'] };
    } }),
];
