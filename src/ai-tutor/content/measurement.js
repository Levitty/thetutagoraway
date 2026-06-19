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
  const r = randInt(2, 14);
  const value = r2(2 * Math.PI * r);
  return {
    type: 'circumference', instruction: 'Find the circumference (to 2 d.p.).',
    question: `Find the circumference of a circle with radius ${r} cm. (2 d.p.)`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('Circumference = 2πr.', `2 × π × ${r}.`),
    solution: { steps: [{ text: 'Use C = 2πr.', expr: `2 × π × ${r}` }, { text: 'Evaluate.', expr: `${value} cm` }], answer: `${value}` },
    misconceptions: [{ when: numStr(Math.PI * r * r), feedback: 'That is the area (πr²). Circumference is 2πr.' }],
    verify: { kind: 'fraction', value: 2 * Math.PI * r, tol: 0.05 },
  };
}

// ---- circle area ----
export function buildCircleArea() {
  const r = randInt(2, 14);
  const value = r2(Math.PI * r * r);
  return {
    type: 'circle-area', instruction: 'Find the area (to 2 d.p.).',
    question: `Find the area of a circle with radius ${r} cm. (2 d.p.)`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('Area = πr².', `π × ${r}².`, `π × ${r * r}.`),
    solution: { steps: [{ text: 'Use A = πr².', expr: `π × ${r}²` }, { text: 'Evaluate.', expr: `${value} cm²` }], answer: `${value}` },
    misconceptions: [{ when: numStr(2 * Math.PI * r), feedback: 'That is the circumference (2πr). Area is πr².' }],
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
