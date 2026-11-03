// ============================================================================
// THE HOREB ROCKET CHALLENGE: the five levels, their steps, and their maths.
//
// Pure data, no imports. It is read by the learner screens, by the guide's
// system prompt (scripts/rocket-guide.template.ts inlines this file), and by
// the tests, so the level a child sees, the level HOREB is told about and the
// level the tests check are the same object.
//
// How HOREB guides without solving (the owner's outline, Nov 2026):
//   - questions first; a team is asked what they think before anything else;
//   - hints come in steps, and only when a team says it is stuck;
//   - a hint teaches the maths behind the step, never the design;
//   - nothing here names "the best" amount of water, fin shape or height,
//     because there is none to give: the team finds theirs by testing.
//
// Each step ends in a test the team writes in its design log. The guide will
// not help with the next step until that test is logged (see progress.js).
//
// Wording: British English, no em dashes, no emojis. tests/rocket.test.mjs
// holds every string here to that.
// ============================================================================

// The hard limit on pressure. The outline says "about 4 to 5 bar via a gauge,
// an adult pumps". 5 is the ceiling the code enforces; the guide always says
// "your adult keeps it at or under the limit on the gauge".
export const PRESSURE_MAX_BAR = 5;
export const PSI_PER_BAR = 14.5038;

// Judging weights from the outline. Shown to teachers and the organiser as
// inputs; nothing ranks children.
export const JUDGING = [
  { id: 'flight', label: 'Flight height and landing', weight: 40 },
  { id: 'log', label: 'Design log', weight: 40 },
  { id: 'maths', label: 'Maths skills mastered on HOREB during the challenge', weight: 20 },
];

// What the owner has not decided yet. Every one is a setting on the
// challenge row (rocket_challenges) and shows as "To be confirmed" until set.
export const UNDECIDED = [
  { key: 'lab_name', label: 'Robotics lab' },
  { key: 'starts_on', label: 'Start date' },
  { key: 'launch_on', label: 'Launch day' },
  { key: 'fee_note', label: 'Sponsorship fee' },
  { key: 'prizes_note', label: 'Prizes' },
];

export const SAFETY_RULES = [
  'Plastic soda bottles only. Never glass, never metal.',
  'Water and air only. No fuel, no fire, no chemicals, nothing that burns.',
  `An adult pumps, with a gauge, and stops at ${PRESSURE_MAX_BAR} bar or less.`,
  'Launch only in an open field, with an adult there.',
  'Everyone stands well back and wears eye protection. Never aim at anyone.',
];

export const LEVELS = [
  {
    n: 1,
    title: 'It flies',
    goal: 'Get your rocket off the ground safely.',
    maths: 'Volume, capacity and fractions',
    colour: { bg: '#FFC93C', ink: '#16161A', meta: '#6B5309' },
    skills: ['G5_CAPACITY', 'G6_CAPACITY', 'G6_UNIT_CONVERSIONS', 'G6_FRACTIONS_MUL', 'G7_VOLUME_CYLINDER'],
    steps: [
      {
        n: 1,
        title: 'How much does your bottle hold?',
        opening: 'Before you add any water, how could you find out how much your bottle holds? What could you use to measure it?',
        hints: [
          'Look at the label first. What does it say, and in which unit?',
          'A kitchen measuring jug can check the label. How many millilitres are in one litre?',
          'If a bottle holds 1.5 litres, that is 1.5 times 1,000 millilitres. Try the same idea with your own bottle.',
        ],
        test: 'Measure how much your bottle really holds and write it down.',
      },
      {
        n: 2,
        title: 'What fraction should be water?',
        opening: 'What do you think will happen if you add more water? And if you add less? How could you test it fairly?',
        hints: [
          'Pick a few fractions of the bottle to try, and keep everything else the same each time.',
          'To find a fraction of an amount, divide by the bottom number and multiply by the top. What is one quarter of your bottle?',
          'Here is the method on a different bottle: two fifths of 2,000 ml is 2,000 divided by 5, times 2. Now use your own bottle and your own fractions.',
        ],
        test: 'Launch with one fraction of water, write down the amount in millilitres and what happened.',
      },
      {
        n: 3,
        title: 'Launch day checklist',
        opening: 'Before your first real launch, what has to be true about the place, the people and the pump? What goes on your own checklist?',
        hints: [
          'Think about where you are, who is with you, and what everyone is wearing.',
          `Your adult reads the gauge. What is the most it may ever show? (${PRESSURE_MAX_BAR} bar.)`,
          'A good checklist has the field, the adult, eye protection, everyone standing back, and the pressure limit.',
        ],
        test: 'Do one safe launch with your checklist and log it.',
      },
    ],
  },
  {
    n: 2,
    title: 'It flies straight',
    goal: 'Make it fly straight instead of tumbling.',
    maths: 'Centre of mass, symmetry, angles and measurement',
    colour: { bg: '#FF4F91', ink: '#16161A', meta: '#7A1538' },
    skills: ['G6_SYMMETRY', 'G6_ANGLE_MEASURE', 'G6_ANGLE_PROPERTIES', 'G5_LENGTH', 'G5_MASS'],
    steps: [
      {
        n: 1,
        title: 'Fins that match',
        opening: 'Why do you think arrows and darts have feathers or fins at the back? What might fins do for your rocket?',
        hints: [
          'If one fin is bigger than the others, what might the rocket do in the air?',
          'Three fins spaced evenly round a circle: how many degrees apart is each one?',
          'A full turn is 360 degrees. Divide it by the number of fins to find the gap. Measure each fin with a ruler so they match.',
        ],
        test: 'Fit your fins, write how many, their size and the angle between them, launch and log what happened.',
      },
      {
        n: 2,
        title: 'Nose cone',
        opening: 'Look at the front of fast things: birds, planes, cars. What shape are they, and why do you think that is?',
        hints: [
          'Try to describe the shape you want. Is it symmetrical?',
          'Find the line of symmetry on your nose cone. Does it line up with the middle of the bottle?',
          'Measure the cone from tip to base on two sides. Equal lengths mean it is centred.',
        ],
        test: 'Fit a nose cone, describe it, launch and log.',
      },
      {
        n: 3,
        title: 'Weight at the front',
        opening: 'Try balancing your empty rocket on one finger. Where is the balance point? What do you think happens if it moves forward?',
        hints: [
          'The balance point is the centre of mass. Mark it with a pen.',
          'Add a small weight (a lump of modelling clay) at the nose and find the balance point again. Measure how far it moved.',
          'Write both measurements in centimetres and the mass you added in grams. That is the data you will compare.',
        ],
        test: 'Log a launch with the weight at the front: the mass added and where the balance point moved to.',
      },
    ],
  },
  {
    n: 3,
    title: 'It flies high',
    goal: 'Find out what makes it go higher, one change at a time.',
    maths: 'Data tables, graphs and averages',
    colour: { bg: '#6C4BF4', ink: '#FFFFFF', meta: '#DCD3FF' },
    skills: ['G6_DATA_COLLECTION', 'G6_MEAN', 'G7_MEAN_MEDIAN_MODE', 'G8_DATA_GRAPHS', 'G8_LINEAR_GRAPHS'],
    steps: [
      {
        n: 1,
        title: 'Plan a fair test',
        opening: 'You can change the water, the pressure or the weight. If you change two things at once, what goes wrong?',
        hints: [
          'Choose ONE thing to change. Everything else stays the same every time.',
          'Draw a table: one column for the thing you change, one for the result.',
          'Each row is one launch. Leave room to launch each setting more than once.',
        ],
        test: 'Write your plan and do the first launch of it.',
      },
      {
        n: 2,
        title: 'Repeat and average',
        opening: 'If you launch the same rocket the same way twice, will it do exactly the same thing? Why might it not?',
        hints: [
          'Launch each setting three times.',
          'The mean is the total divided by how many there are.',
          'For three flight times of 2, 3 and 4 seconds, the mean is (2 + 3 + 4) divided by 3. Use your own numbers.',
        ],
        test: 'Log at least three launches of one setting and their mean.',
      },
      {
        n: 3,
        title: 'Draw the graph',
        opening: 'Looking at your table, what pattern do you notice? How could a graph help you see it?',
        hints: [
          'Put the thing you changed along the bottom and the result up the side.',
          'Plot each mean as a point. Do the points go up, go down, or rise and then fall?',
          'Describe the pattern in one sentence in your log. What would you test next?',
        ],
        test: 'Log what your graph shows and the setting you will use next.',
      },
    ],
  },
  {
    n: 4,
    title: 'It lands safely',
    goal: 'A parachute that opens at the top and brings it down gently.',
    maths: 'Area, timing and speed',
    colour: { bg: '#9BE3C4', ink: '#16161A', meta: '#2A6B52' },
    skills: ['G6_AREA_RECT', 'G7_AREA_CIRCLE', 'G6_TIME', 'G7_SPEED'],
    steps: [
      {
        n: 1,
        title: 'Size of the parachute',
        opening: 'What do you think a bigger parachute does to how fast something falls? How could you test it without a launch?',
        hints: [
          'Drop the parachute with a small weight from the same height each time.',
          'Work out the area of each canopy you try. For a square, length times width.',
          'For a circle, the area is pi times the radius times the radius. Use your own measurements.',
        ],
        test: 'Drop-test two canopy sizes, log their areas and the fall times.',
      },
      {
        n: 2,
        title: 'Opening at the top',
        opening: 'Your parachute has to stay folded on the way up and open at the top. What could hold it in, and what could let it go?',
        hints: [
          'Think about what changes at the very top: the rocket slows and turns over.',
          'A loose nose cone that falls off when the rocket turns is one idea. Can you think of another?',
          'Time the flight. How many seconds after launch does it reach the top?',
        ],
        test: 'Launch with the parachute packed, log whether it opened and when.',
      },
      {
        n: 3,
        title: 'How fast did it come down?',
        opening: 'If you know how high it opened and how long it took to land, how could you work out how fast it fell?',
        hints: [
          'Speed is distance divided by time.',
          'Use metres and seconds, so the answer is in metres per second.',
          'If something falls 20 metres in 8 seconds, the speed is 20 divided by 8. Use your own measurements.',
        ],
        test: 'Log the fall time, your height estimate and the speed you worked out.',
      },
    ],
  },
  {
    n: 5,
    title: 'Proving how high',
    goal: 'Measure your height from the ground, and show your working.',
    maths: 'Angles of elevation and trigonometry',
    colour: { bg: '#16161A', ink: '#FFFFFF', meta: '#C9C9D1' },
    skills: ['G6_ANGLE_MEASURE', 'G8_SCALE_DRAWING', 'G9_TRIG_INTRO', 'G9_ELEVATION_DEPRESSION'],
    steps: [
      {
        n: 1,
        title: 'Make a clinometer',
        opening: 'How could you measure an angle up into the sky? What could you make from a protractor, a straw and a string with a weight?',
        hints: [
          'Tape a straw along the flat edge of the protractor and hang the string from the centre.',
          'When you look through the straw at something level, the string hangs at 90 degrees. Tilt it up: how does the reading change?',
          'The angle of elevation is 90 minus the reading on the string. Test it on a tree or a building first.',
        ],
        test: 'Log a practice angle on something you can measure another way.',
      },
      {
        n: 2,
        title: 'Baseline and angle',
        opening: 'If you stand a measured distance from the launch, and measure the angle at the top, what do you know about the triangle?',
        hints: [
          'The baseline is the distance along the ground. Measure it with a tape, in metres.',
          'You have a right-angled triangle: the ground, the height, and your line of sight.',
          'The tangent of the angle is the height divided by the baseline. Remember to add your eye height.',
        ],
        test: 'Launch, log the baseline, the angle and your eye height.',
      },
      {
        n: 3,
        title: 'Check your height',
        opening: 'How sure are you of your height? What could make it wrong, and how could you check it?',
        hints: [
          'Two people measuring from two different places should get close answers.',
          'A scale drawing of the triangle is a second way to check the tangent.',
          'Write both answers and say which you trust more and why.',
        ],
        test: 'Log your final height with both checks and your reasons.',
      },
    ],
  },
];

export const levelByN = (n) => LEVELS.find((l) => l.n === Number(n)) || null;
export const stepOf = (level, step) => levelByN(level)?.steps.find((s) => s.n === Number(step)) || null;
export const allChallengeSkills = () => [...new Set(LEVELS.flatMap((l) => l.skills))];
