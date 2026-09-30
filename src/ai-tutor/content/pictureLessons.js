// ============================================================================
// PICTURE LESSONS: Kenyan Grade 2-4 fractions and position, matched to the
// KICD 2024 designs in docs/curriculum-sources/.
//   Grade 2, 1.7: ½ and ¼ as part of a whole (folding circles and rectangles)
//   Grade 3, 1.7: ½, ¼ and ⅛ as part of a whole and of a group
//   Grade 3, 3.1: move along a straight line, turn right, turn left
//   Grade 4, 3.1: clockwise and anticlockwise; quarter, half and full turns
// Every item carries tap `choices` (the right answer is always one of them)
// and a `picture` spec drawn by YoungPicture.jsx.
// ============================================================================

import { accepts, hintLadder, randInt, pick, coin } from './schema.js';

const FR = { 2: '½', 4: '¼', 8: '⅛' };
const FR_WORD = { 2: 'a half', 4: 'a quarter', 8: 'an eighth' };
const FR_ACC = {
  2: ['½', '1/2', 'half', 'a half', 'one half'],
  4: ['¼', '1/4', 'quarter', 'a quarter', 'one quarter'],
  8: ['⅛', '1/8', 'eighth', 'an eighth', 'one eighth'],
};
const ROUND = ['chapati', 'round cake', 'paper circle'];
const FLAT = ['sheet of paper', 'piece of cloth', 'handkerchief', 'slice of bread'];
const PEOPLE = ['Mama', 'Baba', 'Cucu', 'Your teacher', 'Your big sister', 'Your big brother'];
const CHILDREN = [['Achieng', 'she'], ['Juma', 'he'], ['Wanjiru', 'she'], ['Kiprop', 'he'], ['Amina', 'she'], ['Otieno', 'he'], ['Njeri', 'she'], ['Baraka', 'he']];

const shuffle = (a) => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(([, v]) => v);
const an = (w) => (/^[aeiou]/i.test(w) ? `an ${w}` : `a ${w}`);

// A shape picture: `parts` pieces, `shaded` indices, equal or not.
const shapePic = (round, parts, { equal = true, shaded = [0] } = {}) => ({
  kind: 'shape', shape: round ? 'circle' : 'rect', parts, equal, shaded,
  layout: !round && parts === 4 && coin() ? 'grid' : 'strips',
});

// One part shaded: "What part of the chapati is shaded?"
function shadedItem(dens, { round = coin() } = {}) {
  const d = pick(dens), obj = pick(round ? ROUND : FLAT);
  const others = dens.filter(x => x !== d);
  return {
    type: 'fraction-shape', instruction: 'Look at the picture.', tapChoices: true,
    question: coin() ? `What part of the ${obj} is shaded?` : `What fraction of the ${obj} is coloured?`,
    picture: shapePic(round, d, { shaded: [randInt(0, d - 1)] }),
    answer: FR[d], accepts: FR_ACC[d], choices: dens.map(x => FR[x]),
    hints: hintLadder('Count the equal parts.', `There are ${d} equal parts. One of them is shaded.`),
    solution: { steps: [{ text: `The ${obj} is cut into ${d} equal parts and 1 part is shaded.`, expr: FR[d] }], answer: FR[d] },
    misconceptions: others.map(x => ({ when: FR[x], feedback: `Count the parts: there are ${d} equal parts, so one part is ${FR_WORD[d]}.` })),
    verify: { kind: 'text', value: FR[d] },
  };
}

// "Is this paper folded into two equal halves?" (yes or no)
function equalItem(dens) {
  const round = coin(), d = pick(dens), obj = pick(round ? ROUND : FLAT), equal = coin();
  const value = equal ? 'yes' : 'no';
  return {
    type: 'fraction-equal', instruction: 'Look at the picture.', tapChoices: true,
    question: d === 2 ? `Is this ${obj} folded into two equal halves?` : `Is this ${obj} cut into ${d === 4 ? 'four' : 'eight'} equal parts?`,
    picture: shapePic(round, d, { equal }),
    answer: value, accepts: accepts(value), choices: ['yes', 'no'],
    hints: hintLadder('Equal parts are all the same size.', 'Would the parts fit exactly on top of each other?'),
    solution: { steps: [{ text: equal ? 'All the parts are the same size.' : 'The parts are not the same size, so they are not equal.', expr: value }], answer: value },
    misconceptions: [], verify: { kind: 'text', value },
  };
}

// "Tap the paper that shows a half." Three pictures A, B, C.
function pickItem(dens) {
  const round = coin(), d = pick(dens), obj = pick(round ? ROUND : FLAT);
  const other = pick(dens.filter(x => x !== d));
  const pics = shuffle([
    { right: true, pic: shapePic(round, d) },
    { pic: shapePic(round, other) },
    { pic: shapePic(round, d, { equal: false }) },
  ]);
  const value = ['A', 'B', 'C'][pics.findIndex(p => p.right)];
  return {
    type: 'fraction-pick', instruction: 'Tap the right picture.', tapChoices: true, choicesFixed: true,
    question: `Tap the ${obj} that shows ${FR_WORD[d]}.`,
    picture: { kind: 'pick', options: pics.map(p => p.pic) },
    answer: value, accepts: accepts(value, value.toLowerCase()), choices: ['A', 'B', 'C'],
    hints: hintLadder(`${FR_WORD[d][0].toUpperCase()}${FR_WORD[d].slice(1)} is 1 of ${d} EQUAL parts.`, 'Check that the parts are the same size.'),
    solution: { steps: [{ text: `Picture ${value} has ${d} equal parts with 1 shaded.`, expr: value }], answer: value },
    misconceptions: [], verify: { kind: 'text', value },
  };
}

// Day-to-day: "Mama cuts a chapati into 4 equal parts and gives you one."
function storyItem(dens) {
  const d = pick(dens), who = pick(PEOPLE), obj = pick([...ROUND, 'sheet of paper', 'slice of bread']);
  return {
    type: 'fraction-story', instruction: 'Listen to the story.', tapChoices: true,
    question: `${who} cuts ${an(obj)} into ${d} equal parts and gives you one part. What part of the ${obj} do you get?`,
    answer: FR[d], accepts: FR_ACC[d], choices: dens.map(x => FR[x]),
    hints: hintLadder(`How many equal parts is the ${obj} cut into?`, `One part out of ${d} equal parts.`),
    solution: { steps: [{ text: `1 part out of ${d} equal parts is ${FR_WORD[d]}.`, expr: FR[d] }], answer: FR[d] },
    misconceptions: dens.filter(x => x !== d).map(x => ({ when: FR[x], feedback: `It was cut into ${d} equal parts, so one part is ${FR_WORD[d]}.` })),
    verify: { kind: 'text', value: FR[d] },
  };
}

/** Grade 2: ½ and ¼ of a whole shape. Level 1 leans on halves. */
export function buildHalvesQuarters({ level = 2 } = {}) {
  return () => {
    const dens = [2, 4];
    const kind = pick(level === 1 ? ['shaded', 'equal', 'equal', 'pick', 'story'] : ['shaded', 'shaded', 'equal', 'pick', 'story']);
    if (kind === 'equal') return equalItem(level === 1 ? [2] : dens);
    if (kind === 'pick') return pickItem(dens);
    if (kind === 'story') return storyItem(dens);
    return shadedItem(dens);
  };
}

/** Grade 3: ½, ¼ and ⅛ of a whole shape. */
export function buildEighthsOfWhole() {
  return () => {
    const dens = [2, 4, 8];
    const kind = pick(['shaded', 'shaded', 'equal', 'story']);
    if (kind === 'equal') return equalItem([8]);
    if (kind === 'story') return storyItem(dens);
    return shadedItem(dens);
  };
}

const ITEMS = [['oranges', 'orange'], ['eggs', 'egg'], ['mangoes', 'mango'], ['sweets', 'sweet'], ['balls', 'ball'], ['pencils', 'pencil']];

/** Grade 3: ½, ¼ and ⅛ of a group: which part is circled, or how many in one share. */
export function buildFractionOfGroup() {
  return () => {
    if (coin()) {
      const n = pick([4, 8, 8]), d = pick([2, 4, 8].filter(x => x <= n)), k = n / d;
      const [items, item] = pick(ITEMS);
      return {
        type: 'fraction-group', instruction: 'Look at the picture.', tapChoices: true,
        question: `There are ${n} ${items}. What part of the ${items} is circled?`,
        picture: { kind: 'group', n, circled: k, item },
        answer: FR[d], accepts: FR_ACC[d], choices: [2, 4, 8].map(x => FR[x]),
        hints: hintLadder(`How many groups of ${k} can you make from ${n}?`, `${n} ${items} make ${d} equal groups of ${k}.`),
        solution: { steps: [{ text: `${n} ${items} make ${d} equal groups of ${k}. One group is circled.`, expr: FR[d] }], answer: FR[d] },
        misconceptions: [{ when: FR[k] || '', feedback: `Not the number circled: count how many equal groups of ${k} make all ${n}.` }].filter(m => m.when && m.when !== FR[d]),
        verify: { kind: 'text', value: FR[d] },
      };
    }
    const d = pick([2, 4, 8]), r = randInt(2, d === 8 ? 5 : 10), total = d * r;
    const [items] = pick([['mandazi'], ['sweets'], ['oranges'], ['pencils'], ['eggs'], ['books']]);
    const story = coin();
    const wrong = [total - d, d === 2 ? r + 2 : total / 2, r + 1].filter(x => x !== r && x > 0);
    const choices = [...new Set([r, ...wrong])].slice(0, 3);
    return {
      type: 'fraction-of-set', instruction: 'Share equally.', tapChoices: true,
      question: story
        ? `${pick(PEOPLE.slice(0, 3))} shares ${total} ${items} equally onto ${d} plates. How many ${items} are on one plate?`
        : `What is ${FR[d]} of ${total}?`,
      picture: story ? { kind: 'plates', total, plates: d, item: items } : undefined,
      answer: `${r}`, accepts: accepts(`${r}`), choices: choices.map(String),
      hints: hintLadder(`Share ${total} into ${d} equal groups.`, `${total} ÷ ${d} = ?`),
      solution: { steps: [{ text: `${FR[d]} of ${total} means ${total} ÷ ${d}.`, expr: `${r}` }], answer: `${r}` },
      misconceptions: [{ when: `${total - d}`, feedback: `Sharing means dividing into ${d} equal parts, not taking ${d} away.` }]
        .concat(d !== 2 ? [{ when: `${total / 2}`, feedback: `That is half. Share into ${d} equal parts, not 2.` }] : []),
      verify: { kind: 'fraction', value: r },
    };
  };
}

const PLACES = ['school', 'shop', 'church', 'market', 'clinic', 'well'];
const flip = (s) => (s === 'left' ? 'right' : 'left');

/**
 * Grade 3: turn left or right. Level 1: the child walks up the page, so her
 * right is our right. Level 2: she walks down towards us, so it swaps.
 */
export function buildLeftRight({ level = 1 } = {}) {
  return () => {
    const [name, pr] = pick(CHILDREN), facing = level === 1 ? 'up' : 'down';
    const way = facing === 'up' ? 'up the path' : 'down the path towards you';
    const hint2 = facing === 'up'
      ? `${name} walks the same way you face, so ${pr === 'she' ? 'her' : 'his'} right is your right.`
      : `${name} walks towards you, so ${pr === 'she' ? 'her' : 'his'} right is on YOUR left.`;
    const kind = pick(['junction', 'path', 'follow']);
    const turn = pick(['left', 'right']);
    // The side of the picture the turn goes to (our view).
    const screen = facing === 'up' ? turn : flip(turn);
    const common = { tapChoices: true, hints: hintLadder(`Imagine you are ${name}, walking ${way}.`, hint2), misconceptions: [] };
    if (kind === 'path') {
      return {
        ...common, type: 'turn-lr', instruction: 'Look at the path.',
        question: `${name} walks ${way}, then turns. Did ${pr} turn left or right?`,
        picture: { kind: 'path', facing, turn: screen },
        answer: turn, accepts: accepts(turn), choices: ['left', 'right'],
        solution: { steps: [{ text: `Walking ${facing === 'up' ? 'up the page' : 'down the page'}, ${name}'s ${turn} is on our ${screen}.`, expr: turn }], answer: turn },
        verify: { kind: 'text', value: turn },
      };
    }
    const [place, other] = shuffle(PLACES).slice(0, 2);
    if (kind === 'junction') {
      return {
        ...common, type: 'turn-lr', instruction: 'Look at the picture.',
        question: `${name} walks ${way} to the ${place}. Which way must ${pr} turn at the end?`,
        picture: { kind: 'junction', facing, places: screen === 'left' ? [place, other] : [other, place] },
        answer: turn, accepts: accepts(turn), choices: ['left', 'right'],
        solution: { steps: [{ text: `The ${place} is on ${name}'s ${turn}.`, expr: turn }], answer: turn },
        verify: { kind: 'text', value: turn },
      };
    }
    // Follow the direction: which place do you reach?
    return {
      ...common, type: 'turn-follow', instruction: 'Follow the directions.',
      question: `${name} walks ${way}, then turns ${turn}. Where does ${pr} get to?`,
      picture: { kind: 'junction', facing, places: screen === 'left' ? [place, other] : [other, place] },
      answer: place, accepts: accepts(place, `the ${place}`), choices: [place, other],
      solution: { steps: [{ text: `${name}'s ${turn} is on our ${screen}: the ${place}.`, expr: place }], answer: place },
      verify: { kind: 'text', value: place },
    };
  };
}

const TURNS = ['quarter', 'half', 'full'];
const turnAccepts = (t) => accepts(t, `${t} turn`, `a ${t} turn`, t === 'quarter' ? '1/4' : t === 'half' ? '1/2' : 'whole');
const ROOM = ['door', 'cupboard', 'window', 'blackboard'];   // clockwise from facing the door

/** Grade 4, KP1: clockwise or anticlockwise. */
export function buildTurnDirection() {
  return () => {
    const dir = pick(['clockwise', 'anticlockwise']);
    const common = {
      type: 'turn-direction', tapChoices: true, choices: ['clockwise', 'anticlockwise'],
      answer: dir, accepts: accepts(dir, dir === 'anticlockwise' ? 'anti-clockwise' : 'clockwise'),
      hints: hintLadder('Clockwise is the way the hands of a clock move.', 'Follow the arrow: does it go the same way as a clock\'s hands?'),
      solution: { steps: [{ text: dir === 'clockwise' ? 'The arrow goes the same way as the hands of a clock.' : 'The arrow goes the opposite way to the hands of a clock.', expr: dir }], answer: dir },
      misconceptions: [], verify: { kind: 'text', value: dir },
    };
    if (coin()) {
      const from = pick([12, 3, 6, 9]);
      return { ...common, instruction: 'Look at the arrow.', question: 'The hand turns the way the arrow shows. Is that clockwise or anticlockwise?', picture: { kind: 'clock', from, quarters: 1, dir } };
    }
    const obj = pick(['bottle top', 'wheel', 'tap', 'jar lid', 'windmill', 'merry-go-round']);
    return { ...common, instruction: 'Look at the arrow.', question: `The ${obj} turns the way the arrow shows. Is that clockwise or anticlockwise?`, picture: { kind: 'spin', label: obj, dir } };
  };
}

/** Grade 4, KP2: quarter, half or full turn (no three-quarter turns: not in the design). */
export function buildTurnAmount() {
  return () => {
    const q = pick([1, 2, 4]), value = TURNS[[1, 2, 4].indexOf(q)];
    const dir = pick(['clockwise', 'anticlockwise']);
    const common = {
      type: 'turn-name', tapChoices: true, choices: [...TURNS],
      answer: value, accepts: turnAccepts(value),
      hints: hintLadder('A full turn goes all the way round. A half turn faces the opposite way.', 'A quarter turn is one right angle, like 12 to 3 on a clock.'),
      misconceptions: [], verify: { kind: 'text', value },
    };
    if (coin()) {
      const from = pick([12, 3, 6, 9]);
      const to = ((from % 12) + (dir === 'clockwise' ? 3 : -3) * q + 24) % 12 || 12;
      return {
        ...common, instruction: 'Name the turn.',
        question: q === 4
          ? `The minute hand goes all the way round from ${from} back to ${from}. Is that a quarter, half or full turn?`
          : `The minute hand moves ${dir} from ${from} to ${to}. Is that a quarter, half or full turn?`,
        picture: { kind: 'clock', from, quarters: q, dir },
        solution: { steps: [{ text: 'Each jump of 3 numbers on the clock is a quarter turn.', expr: value }], answer: value },
      };
    }
    const [name, pr] = pick(CHILDREN);
    const target = q === 4 ? 'door' : ROOM[(dir === 'clockwise' ? q : 4 - q) % 4];
    return {
      ...common, instruction: 'Name the turn.',
      question: q === 4
        ? `${name} faces the door and turns all the way round until ${pr} faces the door again. What turn is that?`
        : `${name} faces the door and turns ${dir} until ${pr} faces the ${target}. What turn is that?`,
      picture: { kind: 'room', quarters: q, dir },
      solution: { steps: [{ text: q === 2 ? `The ${target} is behind: that is a half turn.` : q === 1 ? `The ${target} is at the side: that is a quarter turn.` : 'Back to the start: a full turn.', expr: value }], answer: value },
    };
  };
}

/** Grade 4, KP3: act out a turn, and how turns fit together. */
export function buildTurnPractice() {
  return () => {
    if (coin()) {
      const [name, pr] = pick(CHILDREN), q = pick([1, 1, 2]), dir = pick(['clockwise', 'anticlockwise']);
      const value = ROOM[(dir === 'clockwise' ? q : 4 - q) % 4];
      const turn = q === 1 ? `a quarter turn ${dir}` : 'a half turn';
      return {
        type: 'turn-face', instruction: 'Act it out.', tapChoices: true,
        question: `${name} faces the door and makes ${turn}. What does ${pr} face now?`,
        picture: { kind: 'room', quarters: 0, dir },
        answer: value, accepts: accepts(value, `the ${value}`), choices: ROOM.slice(1),
        hints: hintLadder('Stand up and try it: face the door, then turn.', 'Clockwise from the door is towards the cupboard.'),
        solution: { steps: [{ text: `${turn[0].toUpperCase()}${turn.slice(1)} from the door ends facing the ${value}.`, expr: value }], answer: value },
        misconceptions: [], verify: { kind: 'text', value },
      };
    }
    const spec = pick([
      { q: 'How many quarter turns make a full turn?', value: 4 },
      { q: 'How many quarter turns make a half turn?', value: 2 },
      { q: 'How many half turns make a full turn?', value: 2 },
      { q: 'How many right angles are there in a full turn?', value: 4 },
      { q: 'How many right angles are there in a half turn?', value: 2 },
      { q: 'How many right angles are there in a quarter turn?', value: 1 },
    ]);
    return {
      type: 'turns', instruction: 'Think about turns.', tapChoices: true,
      question: spec.q, answer: `${spec.value}`, accepts: accepts(`${spec.value}`), choices: ['1', '2', '4'],
      hints: hintLadder('A full turn brings you back to where you started.', 'A quarter turn is one right angle.'),
      solution: { steps: [{ text: 'A full turn = 2 half turns = 4 quarter turns = 4 right angles.', expr: `${spec.value}` }], answer: `${spec.value}` },
      misconceptions: [], verify: { kind: 'fraction', value: spec.value },
    };
  };
}
