import { mi, pk, P, E, H, LIT, TC } from '../maths-g6-lib.mjs';
export const key = 'GEOMET.LINES';
export const packNotes = 'Lines are practical: a ruler, a set square and a pair of compasses in the child\'s hands. The tutor talks the child through the drawing and asks them to check it (measure the gap at both ends, measure the right angle, measure both halves). Lines in the classroom (window frames, ruled lines, the corner of a door) come first.';
export const pre = {};
export const mis = [
  mi('PARALLEL_LINES', 'M_SAME_LENGTH_NEEDED', 'Believes parallel lines must be the same length or start and end together.', ['One line is 3 cm long and another 8 cm long, always 2 cm apart. Are they parallel?', 'No, they are not the same length', 'Yes: they stay the same distance apart'], 'Has mostly seen parallel lines drawn as equal pairs.', 'A no because of different lengths.', 'Parallel is about the gap, not the length: measure the gap at two places.', LIT),
  mi('PARALLEL_LINES', 'M_SET_SQUARE_TURNED', 'Turns the set square between drawing the two lines, so the lines are not parallel.', ['Wanjiku slides her set square along the ruler but turns it a little before drawing the second line. Are her lines parallel?', 'Yes, she used a set square', 'No: the set square must slide without turning'], 'Thinks using the tool is enough, whatever the movement.', 'A yes because a set square was used.', 'Hold the ruler still and slide the set square along it without turning it.'),
  mi('BISECT_LINES', 'M_BISECTOR_ANY_ANGLE', 'Believes any line through the midpoint is the perpendicular bisector.', ['A line cuts AB at its midpoint at 60 degrees. Is it the perpendicular bisector of AB?', 'Yes, it goes through the middle', 'No: the perpendicular bisector meets AB at 90 degrees'], 'Remembers the "middle" and forgets the right angle.', 'A yes for a slanting line through the midpoint.', 'Check two things: equal halves, and a right angle at the midpoint.'),
  mi('BISECT_LINES', 'M_ARCS_TOO_SMALL', 'Uses a compass radius of half the line or less, so the arcs from the two ends do not meet.', ['Arcs of radius 3 cm are drawn from each end of an 8 cm line. Where do they cross?', 'At the midpoint, above and below', 'They do not meet: the radius must be more than half of the line (more than 4 cm)'], 'Opens the compasses to any size.', 'A crossing point that cannot exist.', 'Open the compasses to more than half the line, and keep the same opening for both ends.'),
  mi('PERPENDICULAR_LINES', 'M_MUST_CROSS', 'Believes perpendicular lines must cross, so a corner (L) or a T is not perpendicular.', ['Are the two lines of a capital L perpendicular?', 'No, they do not cross', 'Yes: they meet at a right angle'], 'Has seen perpendicular lines drawn as a cross.', 'A no for lines that meet at a corner.', 'Perpendicular means meeting at a right angle; they can meet at an end.'),
  mi('PERPENDICULAR_LINES', 'M_RIGHT_ANGLE_BY_EYE', 'Calls lines perpendicular because they look square, without checking the angle.', ['Two lines meet at 85 degrees. Are they perpendicular?', 'Yes, it looks like a right angle', 'No: perpendicular means exactly 90 degrees'], 'Judges by eye.', 'A yes for an angle close to 90.', 'Check with the corner of a set square or a protractor.'),
];
export const pack = {
  PARALLEL_LINES: pk({
    key_step: 'The child says parallel lines stay the same distance apart all along, and checks by measuring the gap at two places.',
    floor: ['Picks out parallel lines in pictures.', 'Are the ruled lines in an exercise book parallel?', 'Yes'],
    reps: ['railway lines, ruled lines, a window frame', 'two lines with the gap measured at both ends', 'a set square sliding along a ruler'],
    steps: ['Look for two lines that never meet.', 'Measure the gap at one end and the other.', 'If the gaps are equal, the lines are parallel; length does not matter.', 'To draw them, slide a set square along a ruler without turning it.'],
    contexts: ['the SGR railway lines', 'lines on a football pitch', 'the edges of a ruler'],
    board: [['draw', 'Draw two lines, 2 cm apart at the left and 4 cm apart at the right.'], ['point', 'Point at the two gaps.', 'Is the gap the same at both ends?'], ['pause', 'Wait for the child to say no.'], ['predict', 'Ask whether the lines would meet if they were longer.'], ['child_draws', 'Ask the child to draw two parallel lines with a ruler and a set square.']],
    mis: {
      M_SAME_DIRECTION_ENOUGH: [['they go the same way'], 'Is the gap the same at both ends?', 'Parallel lines stay the same distance apart.'],
      M_PARALLEL_MEANS_HORIZONTAL: [['they are not flat', 'slanting'], 'Are the edges of a slanting ladder parallel?', 'Parallel lines can point any way.'],
      M_SAME_LENGTH_NEEDED: [['not the same length'], 'Does length change the gap between them?', 'Length does not matter, only the gap.'],
      M_SET_SQUARE_TURNED: [['I used a set square'], 'Did the set square turn as it moved?', 'Slide the set square along the ruler without turning it.'],
    },
    checks: [P('Are the two rails of a railway line parallel?', 'Yes', 'same distance apart'), P('Two lines are 2 cm apart at one end and 4 cm apart at the other. Are they parallel?', 'No', 'gaps differ')],
  }),
  BISECT_LINES: pk({
    key_step: 'The child says that bisecting cuts a line into two equal halves and that the perpendicular bisector meets it at its midpoint at a right angle, drawn with arcs of the same radius, more than half the line, from both ends.',
    floor: ['Halves a length.', 'What is half of 12 cm?', '6 cm'],
    reps: ['a strip of paper folded end to end', 'a line with arcs from both ends crossing above and below', 'the two halves measured'],
    steps: ['Open the compasses to more than half the line.', 'Draw arcs above and below from one end.', 'Keep the same opening and draw arcs from the other end.', 'Join the crossings; check equal halves and a right angle.'],
    contexts: ['marking the centre line of a pitch', 'cutting a plank in half', 'folding a paper in a craft lesson'],
    board: [['draw', 'Draw a line AB of 8 cm.'], ['point', 'Point at the middle.', 'How long must each half be?'], ['pause', 'Wait for 4 cm.'], ['child_draws', 'Ask the child to fold a paper strip end to end and look at the fold.'], ['write', 'Write: the fold meets the line at 90 degrees.']],
    mis: {
      M_BISECT_MEANS_CUT_ANYWHERE: [['5 and 7', 'cut it'], 'Are the two parts equal?', 'Bisect means cut into two equal parts.'],
      M_HALF_OF_WRONG_LENGTH: [['18 cm', 'the whole'], 'Is that one part or the whole line?', 'Each part is half: 9 cm.'],
      M_BISECTOR_ANY_ANGLE: [['it goes through the middle'], 'What angle does the fold make with the line?', 'The perpendicular bisector meets at 90 degrees.'],
      M_ARCS_TOO_SMALL: [['3 cm radius', 'they meet at the middle'], 'Do arcs of 3 cm from each end of 8 cm reach each other?', 'Use more than half the line, the same for both ends.'],
    },
    checks: [P('A 12 cm line is bisected. How long is each part?', '6 cm', 'equal halves'), P('At what angle does the perpendicular bisector meet the line?', '90 degrees', 'right angle')],
  }),
  PERPENDICULAR_LINES: pk({
    key_step: 'The child says perpendicular lines meet at a right angle, at a cross, a T or a corner, and checks with a set square.',
    floor: ['Recognises a right angle.', 'Is the corner of an exercise book a right angle?', 'Yes'],
    reps: ['the corner of a door or a window', 'a set square placed in a corner', 'lines drawn as a cross, a T and an L'],
    steps: ['Find where the two lines meet.', 'Put the corner of a set square there.', 'If both lines run along its edges, they are perpendicular.', 'To draw, use the set square or the compass method.'],
    contexts: ['a wall and the floor', 'a flag pole and the ground', 'the lines of a cross on a road sign'],
    board: [['draw', 'Draw a cross, a T and an L.'], ['point', 'Point at the L.', 'Do these two lines meet at a right angle?'], ['pause', 'Wait for the child to decide.'], ['child_draws', 'Ask the child to check each with the corner of a book.']],
    mis: {
      M_PERPENDICULAR_AS_STRAIGHT: [['180', 'straight'], 'Is a corner a straight line?', 'Perpendicular lines make 90 degrees.'],
      M_PERPENDICULAR_AS_VERTICAL: [['one must be up'], 'Turn the page: are they still at a right angle?', 'Turning does not change the angle.'],
      M_MUST_CROSS: [['they do not cross'], 'Do they meet at a right angle?', 'Lines that meet at a right angle at a corner are perpendicular.'],
      M_RIGHT_ANGLE_BY_EYE: [['it looks square'], 'Does the set square fit exactly?', 'Perpendicular is exactly 90 degrees: check it.'],
    },
    checks: [P('What angle do perpendicular lines make?', '90 degrees', 'right angle'), P('Are the two lines of a capital L perpendicular?', 'Yes', 'meeting at a corner')],
  }),
};
