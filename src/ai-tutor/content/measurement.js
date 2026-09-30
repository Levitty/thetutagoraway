// ============================================================================
// MEASUREMENT CONTENT — perimeter, area, volume, circles, speed, density.
// Everyday applied number work; all numeric answers (rounded answers carry a
// tolerance in their verify hook). π uses Math.PI; rounded to 2 d.p. on display.
// ============================================================================

import { accepts, hintLadder, randInt, pick, coin, withWorkedExample } from './schema.js';

const r2 = (x) => Math.round(x * 100) / 100;
const numStr = (x) => `${r2(x)}`;

// ---- rectangle perimeter ----
export function buildRectanglePerimeter() {
  const l = randInt(3, 20), w = randInt(2, l);
  const value = 2 * (l + w);
  return {
    type: 'rect-perimeter', instruction: 'Find the perimeter.',
    question: `A rectangle is ${l} cm long and ${w} cm wide. Find its perimeter.`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}cm`),
    hints: hintLadder('Perimeter is the total distance around the edge.',
      'Add all four sides, or use P = 2(l + w).', `2 × (${l} + ${w}).`),
    solution: { steps: [
      { text: 'Use P = 2(length + width).', expr: `2 × (${l} + ${w})` },
      { text: 'Evaluate.', expr: `${value} cm` }], answer: `${value}` },
    misconceptions: [{ when: `${l * w}`, feedback: 'That is the AREA. Perimeter is the distance around (add the sides).' }],
    verify: { kind: 'fraction', value },
  };
}

// ---- rectangle area ----
export function buildRectangleArea() {
  const l = randInt(3, 20), w = randInt(2, 15);
  const value = l * w;
  return {
    type: 'rect-area', instruction: 'Find the area.',
    question: `Find the area of a rectangle ${l} cm by ${w} cm.`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('Area of a rectangle = length × width.', `${l} × ${w}.`),
    solution: { steps: [{ text: 'Area = length × width.', expr: `${l} × ${w} = ${value} cm²` }], answer: `${value}` },
    misconceptions: [{ when: `${2 * (l + w)}`, feedback: 'That is the perimeter. Area = length × width.' }],
    verify: { kind: 'fraction', value },
  };
}

// ---- triangle area ----
export function buildTriangleArea() {
  const b = randInt(2, 20), h = randInt(2, 18);
  // ensure ½bh is clean by making b·h even
  const base = b * h % 2 === 0 ? b : b + 1;
  const value = (base * h) / 2;
  return {
    type: 'triangle-area', instruction: 'Find the area.',
    question: `Find the area of a triangle with base ${base} cm and height ${h} cm.`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('Area of a triangle = ½ × base × height.', `½ × ${base} × ${h}.`),
    solution: { steps: [{ text: 'Area = ½ × base × height.', expr: `½ × ${base} × ${h} = ${value} cm²` }], answer: `${value}` },
    misconceptions: [{ when: `${base * h}`, feedback: 'Don’t forget the ½ — a triangle is half of the rectangle.' }],
    verify: { kind: 'fraction', value },
  };
}

// ---- circle circumference ----
export function buildCircumference() {
  // Radius or diameter with a calculator's π (2 d.p.), π = 22/7 with a whole
  // answer, and the reverse: the distance round, find the radius.
  const mode = pick(['r', 'd', 'r7', 'rev']);
  if (mode === 'r7' || mode === 'rev') {
    const k = randInt(1, 6), r = 7 * k, C = 44 * k;
    const ctx = pick([['A bicycle wheel', 'cm', 'How far does the wheel roll in one full turn'], ['A round water tank lid', 'cm', 'What is the distance round its edge'], ['A circular flower bed at school', 'm', 'What is the distance round it']]);
    return mode === 'r7'
      ? { type: 'circumference', instruction: 'Use π = 22/7.', question: `${ctx[0]} has radius ${r} ${ctx[1]}. ${ctx[2]}? (π = 22/7)`,
          answer: `${C}`, accepts: accepts(`${C}`),
          hints: hintLadder('Circumference = 2πr.', `2 × 22/7 × ${r}: divide ${r} by 7 first.`),
          solution: { steps: [{ text: 'Use C = 2πr with π = 22/7.', expr: `2 × 22/7 × ${r} = ${C}` }], answer: `${C}` },
          misconceptions: [{ when: `${22 * r * r / 7}`, feedback: 'That is the area (πr²). The distance round is 2πr.' }, { when: `${22 * k}`, feedback: 'You used πr. The distance round is 2πr (or π × diameter).' }],
          verify: { kind: 'fraction', value: C } }
      : { type: 'circumference-reverse', instruction: 'Work backwards from the circumference.', question: `${ctx[0]} has a circumference of ${C} ${ctx[1]}. Using π = 22/7, find its radius.`,
          answer: `${r}`, accepts: accepts(`${r}`),
          hints: hintLadder('C = 2πr, so r = C ÷ (2π).', `2π = 44/7. Divide ${C} by 44/7.`),
          solution: { steps: [{ text: 'r = C ÷ 2π.', expr: `${C} ÷ 44/7 = ${C} × 7/44 = ${r}` }], answer: `${r}` },
          misconceptions: [{ when: `${2 * r}`, feedback: 'That is the diameter. The radius is half of it.' }],
          verify: { kind: 'fraction', value: r } };
  }
  const x = mode === 'r' ? randInt(2, 25) : randInt(3, 40);
  const C = mode === 'r' ? 2 * Math.PI * x : Math.PI * x;
  const value = r2(C);
  return {
    type: 'circumference', instruction: 'Find the circumference (to 2 d.p.).',
    question: `Find the circumference of a circle with ${mode === 'r' ? 'radius' : 'diameter'} ${x} cm. (2 d.p.)`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder(mode === 'r' ? 'Circumference = 2πr.' : 'Circumference = π × diameter.', mode === 'r' ? `2 × π × ${x}.` : `π × ${x}.`),
    solution: { steps: [{ text: mode === 'r' ? 'Use C = 2πr.' : 'Use C = πd.', expr: mode === 'r' ? `2 × π × ${x}` : `π × ${x}` }, { text: 'Evaluate.', expr: `${value} cm` }], answer: `${value}` },
    misconceptions: mode === 'r'
      ? [{ when: numStr(Math.PI * x * x), feedback: 'That is the area (πr²). Circumference is 2πr.' }]
      : [{ when: numStr(2 * Math.PI * x), feedback: `${x} cm is the diameter, not the radius: use π × d.` }],
    verify: { kind: 'fraction', value: C, tol: 0.05 },
  };
}

// ---- circle area ----
export function buildCircleArea() {
  const mode = pick(['r', 'd', 'r7', 'rev']);
  if (mode === 'r7' || mode === 'rev') {
    const k = randInt(1, 4), r = 7 * k, A = 154 * k * k;
    const what = pick(['a round table top', 'a circular shamba plot', 'a round mat', 'a circular water tank base']);
    return mode === 'r7'
      ? { type: 'circle-area', instruction: 'Use π = 22/7.', question: `Find the area of ${what} with radius ${r} ${what.includes('shamba') ? 'm' : 'cm'}. (π = 22/7)`,
          answer: `${A}`, accepts: accepts(`${A}`),
          hints: hintLadder('Area = πr².', `22/7 × ${r} × ${r}: divide one ${r} by 7 first.`),
          solution: { steps: [{ text: 'Use A = πr² with π = 22/7.', expr: `22/7 × ${r} × ${r} = ${A}` }], answer: `${A}` },
          misconceptions: [{ when: `${44 * k}`, feedback: 'That is the circumference (2πr). Area is πr².' }, { when: `${22 * r * 2 / 7}`, feedback: 'r² means r × r, not r × 2.' }],
          verify: { kind: 'fraction', value: A } }
      : { type: 'circle-area-reverse', instruction: 'Work backwards from the area.', question: `The area of ${what} is ${A} ${what.includes('shamba') ? 'm²' : 'cm²'}. Using π = 22/7, find its radius.`,
          answer: `${r}`, accepts: accepts(`${r}`),
          hints: hintLadder('A = πr², so r² = A ÷ π.', `${A} ÷ 22/7 = ${A} × 7/22. Then take the square root.`),
          solution: { steps: [{ text: 'r² = A ÷ π.', expr: `${A} × 7/22 = ${r * r}` }, { text: 'Square root.', expr: `r = ${r}` }], answer: `${r}` },
          misconceptions: [{ when: `${r * r}`, feedback: 'That is r². Take the square root to find r.' }],
          verify: { kind: 'fraction', value: r } };
  }
  const x = mode === 'r' ? randInt(2, 20) : 2 * randInt(2, 15);
  const r = mode === 'r' ? x : x / 2;
  const value = r2(Math.PI * r * r);
  return {
    type: 'circle-area', instruction: 'Find the area (to 2 d.p.).',
    question: `Find the area of a circle with ${mode === 'r' ? 'radius' : 'diameter'} ${x} cm. (2 d.p.)`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('Area = πr².', mode === 'r' ? `π × ${r}².` : `The radius is half the diameter: ${r} cm.`),
    solution: { steps: [...(mode === 'd' ? [{ text: 'Radius = diameter ÷ 2.', expr: `${x} ÷ 2 = ${r}` }] : []), { text: 'Use A = πr².', expr: `π × ${r}²` }, { text: 'Evaluate.', expr: `${value} cm²` }], answer: `${value}` },
    misconceptions: mode === 'r'
      ? [{ when: numStr(2 * Math.PI * r), feedback: 'That is the circumference (2πr). Area is πr².' }]
      : [{ when: numStr(Math.PI * x * x), feedback: `${x} cm is the diameter. Halve it to get the radius first.` }],
    verify: { kind: 'fraction', value: Math.PI * r * r, tol: 0.05 },
  };
}

// ---- cuboid volume ----
export function buildCuboidVolume() {
  const l = randInt(2, 12), w = randInt(2, 10), h = randInt(2, 10);
  const value = l * w * h;
  return {
    type: 'cuboid-volume', instruction: 'Find the volume.',
    question: `Find the volume of a cuboid ${l} cm × ${w} cm × ${h} cm.`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('Volume of a cuboid = length × width × height.', `${l} × ${w} × ${h}.`),
    solution: { steps: [{ text: 'Volume = l × w × h.', expr: `${l} × ${w} × ${h} = ${value} cm³` }], answer: `${value}` },
    misconceptions: [], verify: { kind: 'fraction', value },
  };
}

// ---- cylinder volume ----
export function buildCylinderVolume() {
  const r = randInt(2, 8), h = randInt(3, 15);
  const value = r2(Math.PI * r * r * h);
  return {
    type: 'cylinder-volume', instruction: 'Find the volume (to 2 d.p.).',
    question: `Find the volume of a cylinder with radius ${r} cm and height ${h} cm. (2 d.p.)`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('Volume of a cylinder = πr²h.', `π × ${r}² × ${h}.`),
    solution: { steps: [{ text: 'Use V = πr²h.', expr: `π × ${r * r} × ${h}` }, { text: 'Evaluate.', expr: `${value} cm³` }], answer: `${value}` },
    misconceptions: [], verify: { kind: 'fraction', value: Math.PI * r * r * h, tol: 0.05 },
  };
}

// ---- speed = distance / time ----
export function buildSpeed() {
  const speed = pick([20, 30, 40, 50, 60, 80, 100]);
  const time = randInt(2, 6);
  const dist = speed * time;
  const ask = pick(['speed', 'distance', 'time']);
  if (ask === 'speed') return mk('speed', `A car travels ${dist} km in ${time} hours. Find its speed.`, speed, 'Speed = distance ÷ time.', `${dist} ÷ ${time}`, 'km/h');
  if (ask === 'distance') return mk('distance', `A car travels at ${speed} km/h for ${time} hours. Find the distance.`, dist, 'Distance = speed × time.', `${speed} × ${time}`, 'km');
  return mk('time', `A car travels ${dist} km at ${speed} km/h. Find the time taken.`, time, 'Time = distance ÷ speed.', `${dist} ÷ ${speed}`, 'hours');
  function mk(kind, q, value, rule, expr, unit) {
    return {
      type: 'speed', instruction: 'Work it out.', question: q, answer: `${value}`, accepts: accepts(`${value}`, `${value}${unit}`),
      hints: hintLadder(rule, 'Remember the distance–speed–time triangle.', expr),
      solution: { steps: [{ text: rule, expr }, { text: 'Evaluate.', expr: `${value} ${unit}` }], answer: `${value}` },
      misconceptions: [], verify: { kind: 'fraction', value },
    };
  }
}

// ---- density = mass / volume ----
export function buildDensity() {
  const density = pick([2, 3, 4, 5, 8, 10]);
  const volume = randInt(2, 12);
  const mass = density * volume;
  return {
    type: 'density', instruction: 'Find the density.',
    question: `An object has mass ${mass} g and volume ${volume} cm³. Find its density.`,
    answer: `${density}`, accepts: accepts(`${density}`, `${density}g/cm³`),
    hints: hintLadder('Density = mass ÷ volume.', `${mass} ÷ ${volume}.`),
    solution: { steps: [{ text: 'Use density = mass ÷ volume.', expr: `${mass} ÷ ${volume} = ${density} g/cm³` }], answer: `${density}` },
    misconceptions: [], verify: { kind: 'fraction', value: density },
  };
}

export const MEASUREMENT_CONTENT = {
  G5_PERIMETER_INTRO: withWorkedExample(buildRectanglePerimeter),
  G5_AREA_INTRO:      withWorkedExample(buildRectangleArea),
  G6_PERIMETER:       withWorkedExample(buildRectanglePerimeter),
  G6_AREA_RECT:       withWorkedExample(buildRectangleArea),
  G6_AREA_TRIANGLE:   withWorkedExample(buildTriangleArea),
  G6_VOLUME_CUBOID:   withWorkedExample(buildCuboidVolume),
  G7_PERIMETER:       withWorkedExample(buildRectanglePerimeter),
  G7_AREA_RECT:       withWorkedExample(buildRectangleArea),
  G7_CIRCUMFERENCE:   withWorkedExample(buildCircumference),
  G7_AREA_CIRCLE:     withWorkedExample(buildCircleArea),
  G7_VOLUME_CUBOID:   withWorkedExample(buildCuboidVolume),
  G7_VOLUME_CYLINDER: withWorkedExample(buildCylinderVolume),
  G7_SPEED:           withWorkedExample(buildSpeed),
  G8_DENSITY:         withWorkedExample(buildDensity),
};

export const MEASUREMENT_SKILL_IDS = Object.keys(MEASUREMENT_CONTENT);
