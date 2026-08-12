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
    model: { type: 'shape', data: { kind: 'rect', dims: { l, w }, emphasis: 'perimeter', unit: 'cm' } },
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
    model: { type: 'shape', data: { kind: 'rect', dims: { l, w }, emphasis: 'area', unit: 'cm' } },
    hints: hintLadder('Area of a rectangle = length × width.', `${l} × ${w}.`),
    solution: { steps: [{ text: 'Area = length × width.', expr: `${l} × ${w} = ${value} cm²` }], answer: `${value}` },
    misconceptions: [{ when: `${2 * (l + w)}`, feedback: 'That is the perimeter. Area = length × width.' }],
    verify: { kind: 'fraction', value },
  };
}

// ---- triangle area ----
export function buildTriangleArea() {
  const b = randInt(3, 20), h = randInt(3, 18);   // h or b of 2 makes the area equal the other side
  // ensure ½bh is clean by making b·h even
  const base = b * h % 2 === 0 ? b : b + 1;
  const value = (base * h) / 2;
  return {
    type: 'triangle-area', instruction: 'Find the area.',
    question: `Find the area of a triangle with base ${base} cm and height ${h} cm.`,
    answer: `${value}`, accepts: accepts(`${value}`),
    model: { type: 'shape', data: { kind: 'triangle', dims: { base, h }, emphasis: 'area', unit: 'cm', caption: 'the dashed blue line is the height — half of base × height' } },
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
    model: { type: 'shape', data: { kind: 'circle', dims: { r }, emphasis: 'circumference', unit: 'cm' } },
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
    model: { type: 'shape', data: { kind: 'circle', dims: { r }, emphasis: 'area', unit: 'cm' } },
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
      model: { type: 'formula-triangle', data: { top: 'D', left: 'S', right: 'T', caption: `cover the one you want: D = S×T, S = D÷T, T = D÷S` } },
      hints: hintLadder(rule, 'Remember the distance–speed–time triangle.', expr),
      solution: { steps: [{ text: rule, expr }, { text: 'Evaluate.', expr: `${value} ${unit}` }], answer: `${value}` },
      misconceptions: [], verify: { kind: 'fraction', value },
    };
  }
}

// ---- temperature: read, compare, convert °C ↔ K (CBC G7 Measurements) ----
// KICD Grade 7 outcomes: compare temperature conditions, identify °C and K,
// convert between them (K = °C + 273), work out temperatures in real life.
export function buildTemperatureRead() {
  const kind = pick(['toK', 'toC', 'colder']);
  if (kind === 'toK') {
    const c = randInt(-10, 35);
    const value = c + 273;
    return {
      type: 'temp-convert', instruction: 'Convert the temperature.',
      question: `Convert ${c}°C to kelvin.`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}K`, `${value} K`),
      hints: hintLadder('Kelvin and Celsius use the same size of degree — the scales just start at different points.',
        'To change °C to K, add 273.', `${c} + 273.`),
      solution: { steps: [
        { text: 'Use K = °C + 273.', expr: `${c} + 273` },
        { text: 'Evaluate.', expr: `${value} K` }], answer: `${value}` },
      misconceptions: [{ when: `${c - 273}`, feedback: 'You subtracted 273. Going from °C to K you ADD 273 (kelvin values are bigger).' }],
      verify: { kind: 'fraction', value },
    };
  }
  if (kind === 'toC') {
    const k = randInt(263, 308);
    const value = k - 273;
    return {
      type: 'temp-convert', instruction: 'Convert the temperature.',
      question: `Convert ${k} K to degrees Celsius.`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}°C`, `${value}C`),
      hints: hintLadder('Kelvin and Celsius use the same size of degree — the scales just start at different points.',
        'To change K to °C, subtract 273.', `${k} − 273.`),
      solution: { steps: [
        { text: 'Use °C = K − 273.', expr: `${k} − 273` },
        { text: 'Evaluate.', expr: `${value}°C` }], answer: `${value}` },
      misconceptions: [{ when: `${k + 273}`, feedback: 'You added 273. Going from K to °C you SUBTRACT 273 (Celsius values are smaller).' }],
      verify: { kind: 'fraction', value },
    };
  }
  // colder/warmer comparison, including negatives
  let a = randInt(-9, 30), b = randInt(-9, 30);
  while (b === a) b = randInt(-9, 30);
  const value = Math.min(a, b), other = Math.max(a, b);
  const [placeA, placeB] = pick([['Nairobi', 'Mt Kenya'], ['Mombasa', 'Limuru'], ['Kisumu', 'Nyahururu'], ['Eldoret', 'Malindi']]);
  return {
    type: 'temp-compare', instruction: 'Answer with the temperature (the number).',
    question: `One morning it is ${a}°C in ${placeA} and ${b}°C in ${placeB}. Which temperature is colder?`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}°C`, `${value}C`),
    hints: hintLadder('Picture both temperatures on a thermometer scale.',
      'The temperature lower down the scale is colder — negative values are below zero.',
      `Compare ${a} and ${b}: which is lower?`),
    solution: { steps: [
      { text: 'Put both on the thermometer scale.', expr: `${value} is below ${other}` },
      { text: 'The lower temperature is colder.', expr: `${value}°C` }], answer: `${value}` },
    misconceptions: [{ when: `${other}`, feedback: `${other} is HIGHER on the scale, so it is warmer. The colder temperature is the lower number — remember negatives sit below zero.` }],
    verify: { kind: 'fraction', value },
  };
}

// ---- temperature change: rises, falls and differences across zero ----
export function buildTemperatureChange() {
  const kind = pick(['rise', 'fall', 'diff']);
  if (kind === 'rise') {
    const t = randInt(-10, 5), r = randInt(3, 15);
    const value = t + r;
    return {
      type: 'temp-change', instruction: 'Find the new temperature.',
      question: `At 6 a.m. the temperature was ${t}°C. By noon it had risen by ${r}°C. What was the temperature at noon?`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}°C`, `${value}C`),
      model: { type: 'numberline-jump', data: { from: t, delta: r, to: value, unit: '°C', hideResult: true } },
      hints: hintLadder('A rise means the temperature goes UP the scale.',
        'Add the rise to the starting temperature.', `${t} + ${r}.`),
      solution: { steps: [
        { text: 'A rise is an addition.', expr: `${t} + ${r}` },
        { text: 'Evaluate.', expr: `${value}°C`,
          model: { type: 'numberline-jump', data: { from: t, delta: r, to: value, unit: '°C' } } }], answer: `${value}` },
      misconceptions: [{ when: `${t - r}`, feedback: 'You subtracted — but the temperature ROSE, so add the change.' }],
      verify: { kind: 'fraction', value },
    };
  }
  if (kind === 'fall') {
    const t = randInt(2, 12);
    let f = randInt(3, 18);
    while (f === t) f = randInt(3, 18);   // keep answer ≠ 0 so the sign-slip misconception stays distinct
    const value = t - f;
    return {
      type: 'temp-change', instruction: 'Find the new temperature.',
      question: `In the evening the temperature was ${t}°C. Overnight it fell by ${f}°C. What was the temperature by morning?`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}°C`, `${value}C`),
      model: { type: 'numberline-jump', data: { from: t, delta: -f, to: value, unit: '°C', hideResult: true, caption: 'falling temperature moves LEFT — past zero into negatives' } },
      hints: hintLadder('A fall means the temperature goes DOWN the scale.',
        'Subtract the fall from the starting temperature — it may pass below zero.', `${t} − ${f}.`),
      solution: { steps: [
        { text: 'A fall is a subtraction.', expr: `${t} − ${f}` },
        { text: 'Evaluate (crossing zero if needed).', expr: `${value}°C`,
          model: { type: 'numberline-jump', data: { from: t, delta: -f, to: value, unit: '°C' } } }], answer: `${value}` },
      misconceptions: [{ when: `${f - t}`, feedback: `Sign slip: ${t} − ${f} lands BELOW zero at ${value}, not at ${f - t}. Count down the scale past 0.` }],
      verify: { kind: 'fraction', value },
    };
  }
  const a = randInt(-10, 3), b = a + randInt(3, 18);
  const value = b - a;
  const wrong = b - Math.abs(a);
  return {
    type: 'temp-diff', instruction: 'Find the change in temperature.',
    question: `The temperature rose from ${a}°C to ${b}°C. By how many degrees did it rise?`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}°C`, `${value}C`),
    model: { type: 'numberline-jump', data: { from: a, delta: value, to: b, unit: '°C', hideDelta: true, caption: 'the answer is the SIZE of the jump' } },
    hints: hintLadder('The change is the gap between the two temperatures on the scale.',
      'Change = final − start. Subtracting a negative adds.', `${b} − (${a}).`),
    solution: { steps: [
      { text: 'Change = final − start.', expr: `${b} − (${a})` },
      { text: 'Evaluate.', expr: `${value}°C`,
        model: { type: 'numberline-jump', data: { from: a, delta: value, to: b, unit: '°C' } } }], answer: `${value}` },
    misconceptions: (a < 0 && wrong !== value)
      ? [{ when: `${wrong}`, feedback: `You ignored the minus sign on ${a}. From ${a} up to 0 is ${-a} degrees, then 0 up to ${b} is ${b} more: ${value} in total.` }]
      : [],
    verify: { kind: 'fraction', value },
  };
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
    model: { type: 'formula-triangle', data: { top: 'M', left: 'D', right: 'V', caption: 'cover the one you want: M = D×V, D = M÷V, V = M÷D' } },
    hints: hintLadder('Density = mass ÷ volume.', `${mass} ÷ ${volume}.`),
    solution: { steps: [{ text: 'Use density = mass ÷ volume.', expr: `${mass} ÷ ${volume} = ${density} g/cm³` }], answer: `${density}` },
    misconceptions: [], verify: { kind: 'fraction', value: density },
  };
}

// ---- rounding & estimation: d.p., s.f., estimate-by-rounding (CBC G9) ----
// Answers are built by integer/digit arithmetic; the verify hook recomputes the
// value through the float route (toFixed/toPrecision) so the two are independent.
export function buildRounding() {
  const kind = pick(['dp', 'sfInt', 'sfDec', 'estimate']);
  if (kind === 'dp') {
    const k = pick([1, 2]);
    const intPart = randInt(1, 99);
    // Exclude exact ties (a dropped 5 with only zeros after it): binary floats
    // sit a hair below the tie, so the toFixed verify route would round the
    // other way. Non-tie 5s (e.g. .457 → .5) still exercise the ≥5 rule.
    let d3 = randInt(1, 999);
    while ((k === 1 && d3 % 100 === 50) || (k === 2 && d3 % 10 === 5)) d3 = randInt(1, 999);
    const xStr = `${intPart}.${String(d3).padStart(3, '0')}`;
    const n = intPart * 1000 + d3;                        // exact integer form
    const factor = Math.pow(10, 3 - k);
    const roundedScaled = Math.round(n / factor);
    const value = roundedScaled / Math.pow(10, k);
    const shown = value.toFixed(k);
    const truncated = Math.floor(n / factor) / Math.pow(10, k);
    return {
      type: 'round-dp', instruction: `Round to ${k} decimal place${k > 1 ? 's' : ''}.`,
      question: `Round ${xStr} to ${k} decimal place${k > 1 ? 's' : ''}.`,
      answer: shown, accepts: accepts(shown, `${value}`),
      hints: hintLadder(`Keep ${k} digit${k > 1 ? 's' : ''} after the decimal point.`,
        'Look at the NEXT digit: 5 or more rounds up, less than 5 rounds down.',
        `The digit after the cut is ${xStr.replace('.', '')[String(intPart).length + k]}.`),
      solution: { steps: [
        { text: `Cut after ${k} decimal place${k > 1 ? 's' : ''}.`, expr: `${xStr} → ${xStr.slice(0, String(intPart).length + 1 + k)}…` },
        { text: 'Check the next digit: ≥5 rounds up.', expr: shown }], answer: shown },
      misconceptions: truncated !== value
        ? [{ when: truncated.toFixed(k), feedback: 'You cut the number off (truncated). Rounding looks at the next digit — 5 or more rounds UP.' }]
        : [],
      verify: { kind: 'fraction', value: parseFloat((n / 1000).toFixed(k)) },
    };
  }
  if (kind === 'sfInt') {
    const d = pick([3, 4]);
    const n = randInt(Math.pow(10, d - 1) + 1, Math.pow(10, d) - 1);
    const k = pick([1, 2]);
    const factor = Math.pow(10, d - k);
    const value = Math.round(n / factor) * factor;
    const bare = Math.round(n / factor);                  // classic wrong answer: drops place value
    return {
      type: 'round-sf', instruction: `Round to ${k} significant figure${k > 1 ? 's' : ''}.`,
      question: `Round ${n} to ${k} significant figure${k > 1 ? 's' : ''}.`,
      answer: `${value}`, accepts: accepts(`${value}`),
      hints: hintLadder('Significant figures count from the FIRST non-zero digit.',
        `Keep ${k} digit${k > 1 ? 's' : ''}, then replace the rest with zeros to hold the size.`,
        `The digit after the first ${k} decides: 5 or more rounds up.`),
      solution: { steps: [
        { text: `Keep the first ${k} digit${k > 1 ? 's' : ''}; the next digit decides up or down.`, expr: `${n} → ${bare} × ${factor}` },
        { text: 'Pad with zeros so the number keeps its size.', expr: `${value}` }], answer: `${value}` },
      misconceptions: bare !== value
        ? [{ when: `${bare}`, feedback: `Keep the SIZE of the number — ${n} is in the ${factor >= 1000 ? 'thousands' : 'hundreds'}, so pad with zeros: ${value}, not ${bare}.` }]
        : [],
      verify: { kind: 'fraction', value: parseFloat(n.toPrecision(k)) },
    };
  }
  if (kind === 'sfDec') {
    let n = randInt(102, 987);
    // Skip trailing 0 (ambiguous s.f.) and trailing 5 (exact tie — float repr
    // sits below the tie, so the toPrecision verify route rounds the other way).
    while (n % 10 === 0 || n % 10 === 5) n = randInt(102, 987);
    const x = n / 100000;                                  // 0.00102 … 0.00987
    const xStr = x.toFixed(5).replace(/0+$/, '');
    const k = 2;
    const rounded2 = Math.round(n / 10);                  // first 2 significant digits
    const value = rounded2 / 10000;
    const shown = value.toFixed(4);
    return {
      type: 'round-sf', instruction: 'Round to 2 significant figures.',
      question: `Round ${xStr} to 2 significant figures.`,
      answer: shown, accepts: accepts(shown, `${value}`),
      hints: hintLadder('Leading zeros are NOT significant — find the first non-zero digit.',
        'Count 2 digits starting there, then look at the next digit to round.',
        `Start counting at the ${xStr[3] === '0' ? 'fourth' : 'third'} decimal place.`),
      solution: { steps: [
        { text: 'First significant digit is the first non-zero digit.', expr: `${xStr}` },
        { text: 'Keep 2 significant digits; next digit decides.', expr: shown }], answer: shown },
      misconceptions: [{ when: '0.00', feedback: 'Leading zeros are not significant figures — they only place the decimal point. Count from the first non-zero digit.' }],
      verify: { kind: 'fraction', value: parseFloat(x.toPrecision(k)) },
    };
  }
  // estimate a product by rounding each factor to 1 s.f.
  const a = randInt(21, 89) / 10, b = randInt(21, 89) / 10;
  const ra = Math.round(a), rb = Math.round(b);
  const value = ra * rb;
  const exact = Math.round(a * b * 100) / 100;
  return {
    type: 'estimate', instruction: 'Estimate by rounding first.',
    question: `Estimate ${a} × ${b} by first rounding each number to 1 significant figure.`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('An estimate uses easy, rounded numbers — not the exact ones.',
      'Round each number to 1 significant figure first.', `${ra} × ${rb}.`),
    solution: { steps: [
      { text: 'Round each factor to 1 s.f.', expr: `${a} ≈ ${ra},  ${b} ≈ ${rb}` },
      { text: 'Multiply the rounded values.', expr: `${ra} × ${rb} = ${value}` }], answer: `${value}` },
    misconceptions: exact !== value
      ? [{ when: `${exact}`, feedback: 'That is the exact answer. An ESTIMATE rounds first — round each number to 1 s.f., then multiply.' }]
      : [],
    verify: { kind: 'fraction', value: parseFloat(a.toPrecision(1)) * parseFloat(b.toPrecision(1)) },
  };
}

// ---- errors: absolute error, percentage error, bounds (CBC G9 / 9Np.02) ----
export function buildErrors() {
  const kind = pick(['abs', 'pct', 'bound']);
  if (kind === 'abs') {
    let A, err, E;
    do {
      A = randInt(20, 200); err = randInt(2, 15);
      E = coin() ? A + err : A - err;
    } while (E === err);   // estimate equal to the error puts the answer on the page
    const item = pick([['rope', 'length', 'cm'], ['parcel', 'mass', 'g'], ['bucket', 'capacity', 'litres'], ['desk', 'length', 'cm']]);
    return {
      type: 'error-abs', instruction: 'Find the error.',
      question: `The actual ${item[1]} of a ${item[0]} is ${A} ${item[2]}. A learner estimates it as ${E} ${item[2]}. Find the error in the estimate.`,
      answer: `${err}`, accepts: accepts(`${err}`, `${err}${item[2]}`),
      hints: hintLadder('Error = the gap between the estimate and the actual measurement.',
        'Subtract the smaller from the larger — error is a positive size.', `|${A} − ${E}|.`),
      solution: { steps: [
        { text: 'Error = |actual − estimate|.', expr: `|${A} − ${E}|` },
        { text: 'Evaluate.', expr: `${err} ${item[2]}` }], answer: `${err}` },
      misconceptions: E > A
        ? [{ when: `${A - E}`, feedback: 'Error is a SIZE, so give it as a positive number — how far off the estimate is, regardless of direction.' }]
        : [],
      verify: { kind: 'fraction', value: Math.abs(A - E) },
    };
  }
  if (kind === 'pct') {
    let A, p, err;
    do {
      A = pick([20, 40, 50, 80, 100, 200, 400]);
      p = pick([2, 4, 5, 10, 15, 20, 25]);
      err = (A * p) / 100;
    } while (!Number.isInteger(err) || A + err === p || A - err === p);
    const E = coin() ? A + err : A - err;
    return {
      type: 'error-pct', instruction: 'Find the percentage error.',
      question: `The actual mass of a bag of maize is ${A} kg. A trader estimates it as ${E} kg. Find the percentage error.`,
      answer: `${p}`, accepts: accepts(`${p}`, `${p}%`),
      hints: hintLadder('Percentage error compares the error with the ACTUAL value.',
        'Percentage error = (error ÷ actual) × 100.', `(|${A} − ${E}| ÷ ${A}) × 100.`),
      solution: { steps: [
        { text: 'Find the error.', expr: `|${A} − ${E}| = ${err}` },
        { text: 'Divide by the actual value and make it a percentage.', expr: `(${err} ÷ ${A}) × 100 = ${p}%` }], answer: `${p}` },
      misconceptions: err !== p
        ? [{ when: `${err}`, feedback: `${err} is the absolute error. For PERCENTAGE error, divide by the actual value and multiply by 100.` }]
        : [],
      verify: { kind: 'fraction', value: (Math.abs(A - E) / A) * 100 },
    };
  }
  const nearest = pick([1, 10]);
  const M = nearest === 1 ? randInt(12, 96) : randInt(2, 9) * 10;
  const side = pick(['lower', 'upper']);
  const value = side === 'lower' ? M - nearest / 2 : M + nearest / 2;
  const naive = side === 'lower' ? M - nearest : M + nearest;
  return {
    type: 'error-bound', instruction: `Find the ${side} bound.`,
    question: `The length of a plank is ${M} cm to the nearest ${nearest === 1 ? 'cm' : '10 cm'}. What is the ${side} bound of the actual length?`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}cm`),
    // The rounding interval made visible: the stated value sits mid-band; the
    // asked bound is the '?' bracket. Reveal shows both bounds labeled.
    model: { type: 'numberline-interval', data: {
      value: M, lo: M - nearest / 2, hi: M + nearest / 2, unit: 'cm', ask: side,
    } },
    hints: hintLadder('A rounded measurement could be up to HALF a unit out either way.',
      `Half of ${nearest === 1 ? '1 cm' : '10 cm'} is ${nearest / 2} cm.`,
      `${side === 'lower' ? 'Subtract' : 'Add'} ${nearest / 2} ${side === 'lower' ? 'from' : 'to'} ${M}.`),
    solution: { steps: [
      { text: `Rounding to the nearest ${nearest === 1 ? 'cm' : '10 cm'} means the true value lies within ±${nearest / 2} cm.`, expr: `${M} ± ${nearest / 2}` },
      { text: `Take the ${side} end.`, expr: `${value} cm`,
        model: { type: 'numberline-interval', data: {
          value: M, lo: M - nearest / 2, hi: M + nearest / 2, unit: 'cm',
          caption: `anything below ${M - nearest / 2} or at/above ${M + nearest / 2} would round elsewhere`,
        } } }], answer: `${value}` },
    misconceptions: [{ when: `${naive}`, feedback: `A whole ${nearest === 1 ? 'cm' : '10 cm'} off would round to a different value — the bound is HALF a unit away: ${M} ${side === 'lower' ? '−' : '+'} ${nearest / 2}.` }],
    verify: { kind: 'fraction', value: side === 'lower' ? M - nearest * 0.5 : M + nearest * 0.5 },
  };
}


// ============================================================================
// CAMBRIDGE GAP FILL — advanced conversions, composite areas, surface area,
// prism/cylinder volume.
// ============================================================================

// ---- G7: length conversions with decimals ----
export function buildLengthConvAdvanced() {
  const kind = pick(['km-m', 'm-cm', 'cm-mm', 'mm-cm', 'cm-m', 'm-km']);
  const up = { 'km-m': 1000, 'm-cm': 100, 'cm-mm': 10 }[kind];
  if (up) {
    const n = randInt(11, 89) / 10;                        // 1.1 … 8.9
    const value = Math.round(n * up);
    const [from, to] = kind.split('-');
    const wrongF = up === 1000 ? 100 : up === 100 ? 1000 : 100;
    return {
      type: 'length-conv', instruction: 'Convert the units.',
      question: `Convert ${n} ${from} to ${to}.`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}${to}`),
      hints: hintLadder(`Going to a SMALLER unit means MORE of them — multiply.`,
        `1 ${from} = ${up} ${to}.`,
        `${n} × ${up}.`),
      solution: { steps: [
        { text: `1 ${from} = ${up} ${to}.`, expr: `× ${up}` },
        { text: 'Multiply.', expr: `${n} × ${up} = ${value} ${to}` }], answer: `${value}` },
      misconceptions: Math.round(n * wrongF) !== value ? [{ when: `${Math.round(n * wrongF)}`, feedback: `Wrong factor — 1 ${from} is ${up} ${to}, not ${wrongF}.` }] : [],
      verify: { kind: 'fraction', value },
    };
  }
  const down = { 'mm-cm': 10, 'cm-m': 100, 'm-km': 1000 }[kind];
  const [from, to] = kind.split('-');
  // whole === 10 converts to exactly 1 of the bigger unit ("1000 m to km"),
  // which the "1000 m make 1 km" hint would answer outright.
  let whole = randInt(2, 89);
  while (whole === 10) whole = randInt(2, 89);
  const raw = whole * down / 10;                            // gives one decimal place
  const value = raw / down * 10 / 10;
  const shown = raw;
  const ans = +(shown / down).toFixed(3);
  return {
    type: 'length-conv', instruction: 'Convert the units.',
    question: `Convert ${shown} ${from} to ${to}.`,
    answer: `${ans}`, accepts: accepts(`${ans}`, `${ans}${to}`),
    hints: hintLadder('Going to a BIGGER unit means FEWER of them — divide.',
      `${down} ${from} make 1 ${to}.`,
      `${shown} ÷ ${down}.`),
    solution: { steps: [
      { text: `${down} ${from} = 1 ${to}.`, expr: `÷ ${down}` },
      { text: 'Divide.', expr: `${shown} ÷ ${down} = ${ans} ${to}` }], answer: `${ans}` },
    misconceptions: [{ when: `${+(shown * down).toFixed(2)}`, feedback: `You multiplied — going to the BIGGER unit (${to}) you divide by ${down}.` }],
    verify: { kind: 'fraction', value: shown / down },
  };
}

// ---- G8: composite (L-shape) areas ----
export function buildCompositeArea() {
  const L = randInt(8, 16), W = randInt(6, 12);
  const l = randInt(2, L - 3), w = randInt(2, W - 3);
  const value = L * W - l * w;
  return {
    type: 'composite-area', instruction: 'Big rectangle minus the missing piece.',
    question: `An L-shaped garden is a ${L} m by ${W} m rectangle with a ${l} m by ${w} m rectangular corner cut out. Find its area.`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}m²`, `${value}m2`),
    hints: hintLadder('Two ways: subtract the cut-out from the full rectangle, or split the L into two rectangles.',
      `Full rectangle: ${L} × ${W} = ${L * W}.`,
      `Cut-out: ${l} × ${w} = ${l * w}. Subtract.`),
    solution: { steps: [
      { text: 'Area of the full rectangle.', expr: `${L} × ${W} = ${L * W} m²` },
      { text: 'Subtract the cut-out corner.', expr: `${L * W} − ${l * w} = ${value} m²` }], answer: `${value}` },
    misconceptions: [{ when: `${L * W}`, feedback: `That is the FULL rectangle — the ${l} × ${w} corner is missing, so subtract it.` }],
    verify: { kind: 'fraction', value },
  };
}

// ---- G8: surface area of a cuboid ----
export function buildSurfaceAreaCuboid() {
  const l = randInt(3, 10), w = randInt(2, 8), h = randInt(2, 8);
  const value = 2 * (l * w + l * h + w * h);
  const volume = l * w * h;
  return {
    type: 'surface-area-cuboid', instruction: 'Six faces, in three equal pairs.',
    question: `Find the surface area of a cuboid ${l} cm × ${w} cm × ${h} cm.`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}cm²`, `${value}cm2`),
    model: { type: 'shape', data: { kind: 'rect', dims: { l, w }, emphasis: 'area', unit: 'cm', caption: `one face is ${l} × ${w} — a cuboid has three PAIRS of faces` } },
    hints: hintLadder('A cuboid has 6 faces in 3 identical pairs: top/bottom, front/back, sides.',
      `The pairs: ${l}×${w}, ${l}×${h}, ${w}×${h}.`,
      `SA = 2(${l * w} + ${l * h} + ${w * h}).`),
    solution: { steps: [
      { text: 'Area of each different face.', expr: `${l}×${w}=${l * w},  ${l}×${h}=${l * h},  ${w}×${h}=${w * h}` },
      { text: 'Each appears twice — double the sum.', expr: `2 × ${l * w + l * h + w * h} = ${value} cm²` }], answer: `${value}` },
    misconceptions: volume !== value ? [{ when: `${volume}`, feedback: 'That is the VOLUME (l × w × h). Surface area adds up the six FACES.' }] : [],
    verify: { kind: 'fraction', value },
  };
}

// ---- G8: volume of prisms & cylinders ----
export function buildVolumePrism() {
  if (coin()) {
    let b = randInt(3, 10), h = randInt(2, 8);
    if ((b * h) % 2 !== 0) b += 1;
    const len = randInt(5, 15);
    const value = (b * h / 2) * len;
    return {
      type: 'volume-prism', instruction: 'Volume of a prism = area of cross-section × length.',
      question: `A triangular prism has a cross-section of base ${b} cm and height ${h} cm, and is ${len} cm long. Find its volume.`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}cm³`, `${value}cm3`),
      hints: hintLadder('A prism is its cross-section, stretched.',
        `Cross-section (triangle): ½ × ${b} × ${h} = ${b * h / 2}.`,
        `Multiply by the length: ${b * h / 2} × ${len}.`),
      solution: { steps: [
        { text: 'Area of the triangular cross-section.', expr: `½ × ${b} × ${h} = ${b * h / 2} cm²` },
        { text: 'Multiply by the length.', expr: `${b * h / 2} × ${len} = ${value} cm³` }], answer: `${value}` },
      misconceptions: [{ when: `${b * h * len}`, feedback: 'The cross-section is a TRIANGLE — don\'t forget the ½.' }],
      verify: { kind: 'fraction', value },
    };
  }
  const r = randInt(2, 7), h = randInt(4, 15);
  const value = r2(Math.PI * r * r * h);
  return {
    type: 'volume-cylinder-adv', instruction: 'Same prism idea: circle area × height. (2 d.p.)',
    question: `Find the volume of a cylinder with radius ${r} cm and height ${h} cm. (2 d.p.)`,
    answer: `${value}`, accepts: accepts(`${value}`),
    hints: hintLadder('A cylinder is a prism with a circular cross-section.',
      `Circle area: π × ${r}² = π × ${r * r}.`,
      `Multiply by the height ${h}.`),
    solution: { steps: [
      { text: 'Area of the circular cross-section.', expr: `π × ${r * r}` },
      { text: 'Multiply by the height.', expr: `π × ${r * r} × ${h} = ${value} cm³` }], answer: `${value}` },
    misconceptions: [{ when: numStr(r2(2 * Math.PI * r * h)), feedback: 'That used the circumference — volume needs the circle\'s AREA (πr²) times height.' }],
    verify: { kind: 'fraction', value: Math.PI * r * r * h, tol: 0.05 },
  };
}


// ============================================================================
// GRADE 9 MEASUREMENTS — circles beyond area, and solids beyond the cuboid.
// CBC G9: Area (arc/sector), Volume of Solids, Surface Area.
// ============================================================================

const PI = 3.142;   // the value CBC/KICD papers tell learners to use

// ---- G9: arc length & sector area ----
export function buildArcSector() {
  const kind = pick(['arc', 'sector', 'perimeter', 'reverse']);
  // Angles that divide 360 cleanly keep the arithmetic honest, not fiddly.
  const angle = pick([30, 45, 60, 90, 120, 135, 150, 180, 240, 270]);
  const r = randInt(4, 21);
  const frac = angle / 360;

  if (kind === 'arc') {
    const value = Math.round(frac * 2 * PI * r * 10) / 10;
    return {
      type: 'arc-length', instruction: 'Find the arc length.',
      question: `A sector of a circle of radius ${r} cm has an angle of ${angle}° at the centre. Find the length of its arc. (π = 3.142, 1 d.p.)`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}cm`),
      hints: hintLadder(
        'An arc is just a fraction of the way round the whole circle.',
        `That fraction is ${angle}/360 of the full circumference.`,
        `Circumference = 2πr = 2 × 3.142 × ${r}. Take ${angle}/360 of it.`),
      solution: { steps: [
        { text: 'The sector is this fraction of the whole circle.', expr: `${angle}/360` },
        { text: 'Full circumference first.', expr: `2 × 3.142 × ${r} = ${Math.round(2 * PI * r * 100) / 100} cm` },
        { text: 'Take that fraction of it.', expr: `${angle}/360 × ${Math.round(2 * PI * r * 100) / 100} = ${value} cm` }], answer: `${value}` },
      misconceptions: [
        { when: `${Math.round(frac * PI * r * r * 10) / 10}`, feedback: 'That is the sector AREA. An arc is a length, so it comes from the circumference (2πr), not the area (πr²).' },
        { when: `${Math.round(2 * PI * r * 10) / 10}`, feedback: `That is the whole circumference — you still need to take the ${angle}/360 fraction of it.` },
      ],
      verify: { kind: 'fraction', value, tol: 0.11 },
    };
  }

  if (kind === 'sector') {
    const value = Math.round(frac * PI * r * r * 10) / 10;
    return {
      type: 'sector-area', instruction: 'Find the sector area.',
      question: `Find the area of a sector of radius ${r} cm with an angle of ${angle}° at the centre. (π = 3.142, 1 d.p.)`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}cm²`),
      hints: hintLadder(
        'A sector is a slice — a fraction of the whole circle’s area.',
        `The slice is ${angle}/360 of the circle.`,
        `Whole area = πr² = 3.142 × ${r}². Take ${angle}/360 of it.`),
      solution: { steps: [
        { text: 'The slice as a fraction of the circle.', expr: `${angle}/360` },
        { text: 'Area of the whole circle.', expr: `3.142 × ${r}² = ${Math.round(PI * r * r * 100) / 100} cm²` },
        { text: 'Take that fraction.', expr: `${angle}/360 × ${Math.round(PI * r * r * 100) / 100} = ${value} cm²` }], answer: `${value}` },
      misconceptions: [
        { when: `${Math.round(frac * 2 * PI * r * 10) / 10}`, feedback: 'That is the ARC LENGTH. Area of a sector uses πr², not 2πr.' },
      ],
      verify: { kind: 'fraction', value, tol: 0.11 },
    };
  }

  if (kind === 'perimeter') {
    // Perimeter of a sector = arc + the two radii. The classic dropped detail.
    const arc = frac * 2 * PI * r;
    const value = Math.round((arc + 2 * r) * 10) / 10;
    return {
      type: 'sector-perimeter', instruction: 'Find the perimeter of the sector.',
      question: `A sector has radius ${r} cm and an angle of ${angle}° at the centre. Find its PERIMETER. (π = 3.142, 1 d.p.)`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}cm`),
      hints: hintLadder(
        'Trace right round the edge of the slice with your finger — what do you travel along?',
        'Along the curved arc, then back down one straight side and up the other.',
        `Perimeter = arc + r + r, with r = ${r}.`),
      solution: { steps: [
        { text: 'Arc length first.', expr: `${angle}/360 × 2 × 3.142 × ${r} = ${Math.round(arc * 100) / 100} cm` },
        { text: 'Add the two straight radii.', expr: `${Math.round(arc * 100) / 100} + ${r} + ${r} = ${value} cm` }], answer: `${value}` },
      misconceptions: [
        { when: `${Math.round(arc * 10) / 10}`, feedback: 'You stopped at the arc. The perimeter goes all the way round, so add the two radii as well.' },
      ],
      verify: { kind: 'fraction', value, tol: 0.11 },
    };
  }

  // reverse: given the arc, find the angle
  const value = angle;
  const arc = Math.round(frac * 2 * PI * r * 100) / 100;
  return {
    type: 'sector-reverse', instruction: 'Work backwards to the angle.',
    question: `An arc of length ${arc} cm is drawn on a circle of radius ${r} cm. Find the angle it subtends at the centre. (π = 3.142)`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}°`),
    hints: hintLadder(
      'The arc is some fraction of the full circumference — the angle is that same fraction of 360°.',
      `Full circumference = 2 × 3.142 × ${r}.`,
      'Divide the arc by the circumference, then multiply by 360.'),
    solution: { steps: [
      { text: 'Circumference of the whole circle.', expr: `2 × 3.142 × ${r} = ${Math.round(2 * PI * r * 100) / 100} cm` },
      { text: 'The arc as a fraction of it.', expr: `${arc} ÷ ${Math.round(2 * PI * r * 100) / 100}` },
      { text: 'That same fraction of 360°.', expr: `× 360 = ${value}°` }], answer: `${value}` },
    misconceptions: [],
    verify: { kind: 'fraction', value, tol: 1.1 },
  };
}

// ---- G9: surface area of cones, spheres and cylinders ----
export function buildSurfaceAreaAdv() {
  const solid = pick(['sphere', 'cone-curved', 'cone-total', 'cylinder']);
  const r = randInt(3, 14);

  if (solid === 'sphere') {
    const value = Math.round(4 * PI * r * r * 10) / 10;
    return {
      type: 'sa-sphere', instruction: 'Find the surface area.',
      question: `Find the surface area of a sphere of radius ${r} cm. (π = 3.142, 1 d.p.)`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}cm²`),
      hints: hintLadder('A sphere has one curved surface and no flat faces.',
        'Surface area of a sphere = 4πr².', `4 × 3.142 × ${r}².`),
      solution: { steps: [
        { text: 'Use A = 4πr².', expr: `4 × 3.142 × ${r}²` },
        { text: 'Evaluate.', expr: `${value} cm²` }], answer: `${value}` },
      misconceptions: [
        { when: `${Math.round((4 / 3) * PI * r * r * r * 10) / 10}`, feedback: 'That is the VOLUME (⁴⁄₃πr³). Surface area is 4πr² — an area, so r is squared, not cubed.' },
        { when: `${Math.round(PI * r * r * 10) / 10}`, feedback: 'πr² is the area of a flat circle. A sphere’s surface is four times that: 4πr².' },
      ],
      verify: { kind: 'fraction', value, tol: 0.11 },
    };
  }

  if (solid === 'cylinder') {
    const h = randInt(5, 20);
    const value = Math.round((2 * PI * r * r + 2 * PI * r * h) * 10) / 10;
    return {
      type: 'sa-cylinder', instruction: 'Find the total surface area.',
      question: `A closed cylinder has radius ${r} cm and height ${h} cm. Find its total surface area. (π = 3.142, 1 d.p.)`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}cm²`),
      hints: hintLadder(
        'Imagine cutting it open and flattening it: two circles and one rectangle.',
        'The rectangle’s width is the circumference of the circle, 2πr, and its height is h.',
        `Total = 2πr² + 2πrh, with r = ${r} and h = ${h}.`),
      solution: { steps: [
        { text: 'The two circular ends.', expr: `2 × 3.142 × ${r}² = ${Math.round(2 * PI * r * r * 100) / 100} cm²` },
        { text: 'The curved surface unrolls into a rectangle 2πr by h.', expr: `2 × 3.142 × ${r} × ${h} = ${Math.round(2 * PI * r * h * 100) / 100} cm²` },
        { text: 'Add them.', expr: `${value} cm²` }], answer: `${value}` },
      misconceptions: [
        { when: `${Math.round(2 * PI * r * h * 10) / 10}`, feedback: 'That is only the curved surface. A CLOSED cylinder also has two circular ends — add 2πr².' },
      ],
      verify: { kind: 'fraction', value, tol: 0.11 },
    };
  }

  // cone: use 3-4-5 style triples so the slant height is exact
  const [rr, h, l] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]);
  const curved = PI * rr * l;
  if (solid === 'cone-curved') {
    const value = Math.round(curved * 10) / 10;
    return {
      type: 'sa-cone-curved', instruction: 'Find the curved surface area.',
      question: `A cone has base radius ${rr} cm and slant height ${l} cm. Find its CURVED surface area. (π = 3.142, 1 d.p.)`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}cm²`),
      hints: hintLadder('The curved surface of a cone opens out into a sector of a circle.',
        'Curved surface area = πrl, where l is the SLANT height.',
        `3.142 × ${rr} × ${l}.`),
      solution: { steps: [
        { text: 'Use curved area = πrl.', expr: `3.142 × ${rr} × ${l}` },
        { text: 'Evaluate.', expr: `${value} cm²` }], answer: `${value}` },
      misconceptions: [
        { when: `${Math.round(PI * rr * h * 10) / 10}`, feedback: `You used the vertical height ${h}. Curved surface area needs the SLANT height ${l} — the distance up the sloping side.` },
      ],
      verify: { kind: 'fraction', value, tol: 0.11 },
    };
  }

  const value = Math.round((curved + PI * rr * rr) * 10) / 10;
  return {
    type: 'sa-cone-total', instruction: 'Find the total surface area.',
    question: `A solid cone has base radius ${rr} cm and slant height ${l} cm. Find its TOTAL surface area. (π = 3.142, 1 d.p.)`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}cm²`),
    hints: hintLadder('A solid cone has a curved surface AND a flat circular base.',
      'Total = πrl + πr².', `3.142 × ${rr} × ${l}, then add 3.142 × ${rr}².`),
    solution: { steps: [
      { text: 'Curved surface.', expr: `3.142 × ${rr} × ${l} = ${Math.round(curved * 100) / 100} cm²` },
      { text: 'Circular base.', expr: `3.142 × ${rr}² = ${Math.round(PI * rr * rr * 100) / 100} cm²` },
      { text: 'Add them.', expr: `${value} cm²` }], answer: `${value}` },
    misconceptions: [
      { when: `${Math.round(curved * 10) / 10}`, feedback: 'That is only the curved part. A SOLID cone also has its circular base — add πr².' },
    ],
    verify: { kind: 'fraction', value, tol: 0.11 },
  };
}

// ---- G9: volume of cones, spheres and pyramids ----
export function buildVolumeAdv() {
  const solid = pick(['cone', 'sphere', 'pyramid', 'cylinder']);

  if (solid === 'sphere') {
    const r = randInt(3, 12);
    const value = Math.round((4 / 3) * PI * r * r * r * 10) / 10;
    return {
      type: 'vol-sphere', instruction: 'Find the volume.',
      question: `Find the volume of a sphere of radius ${r} cm. (π = 3.142, 1 d.p.)`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}cm³`),
      hints: hintLadder('Volume fills space, so the radius appears three times — cubed.',
        'Volume of a sphere = ⁴⁄₃πr³.', `(4 ÷ 3) × 3.142 × ${r}³.`),
      solution: { steps: [
        { text: 'Use V = ⁴⁄₃πr³.', expr: `(4/3) × 3.142 × ${r}³` },
        { text: 'Evaluate.', expr: `${value} cm³` }], answer: `${value}` },
      misconceptions: [
        { when: `${Math.round(4 * PI * r * r * 10) / 10}`, feedback: 'That is the SURFACE AREA (4πr²). Volume cubes the radius and carries the ⁴⁄₃.' },
      ],
      verify: { kind: 'fraction', value, tol: 0.11 },
    };
  }

  if (solid === 'cone') {
    const r = randInt(3, 12), h = randInt(6, 21);
    const value = Math.round((1 / 3) * PI * r * r * h * 10) / 10;
    return {
      type: 'vol-cone', instruction: 'Find the volume.',
      question: `A cone has base radius ${r} cm and vertical height ${h} cm. Find its volume. (π = 3.142, 1 d.p.)`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}cm³`),
      hints: hintLadder(
        'A cone is exactly one third of the cylinder that would box it in.',
        'Volume of a cone = ⅓πr²h — and h here is the VERTICAL height.',
        `(1 ÷ 3) × 3.142 × ${r}² × ${h}.`),
      solution: { steps: [
        { text: 'The matching cylinder first.', expr: `3.142 × ${r}² × ${h} = ${Math.round(PI * r * r * h * 100) / 100} cm³` },
        { text: 'A cone is one third of it.', expr: `÷ 3 = ${value} cm³` }], answer: `${value}` },
      misconceptions: [
        { when: `${Math.round(PI * r * r * h * 10) / 10}`, feedback: 'That is the whole cylinder. A cone holds only ONE THIRD as much — multiply by ⅓.' },
      ],
      verify: { kind: 'fraction', value, tol: 0.11 },
    };
  }

  if (solid === 'cylinder') {
    const r = randInt(3, 12), h = randInt(5, 20);
    const value = Math.round(PI * r * r * h * 10) / 10;
    return {
      type: 'vol-cylinder', instruction: 'Find the volume.',
      question: `A cylindrical water tank has radius ${r} m and height ${h} m. Find its volume. (π = 3.142, 1 d.p.)`,
      answer: `${value}`, accepts: accepts(`${value}`, `${value}m³`),
      hints: hintLadder('A cylinder is a circle pushed straight upwards.',
        'Volume = area of the circular base × height = πr²h.',
        `3.142 × ${r}² × ${h}.`),
      solution: { steps: [
        { text: 'Area of the circular base.', expr: `3.142 × ${r}² = ${Math.round(PI * r * r * 100) / 100} m²` },
        { text: 'Multiply by the height.', expr: `× ${h} = ${value} m³` }], answer: `${value}` },
      misconceptions: [
        { when: `${Math.round(2 * PI * r * h * 10) / 10}`, feedback: 'That is the curved surface AREA (2πrh). Volume needs the base area πr² times the height.' },
      ],
      verify: { kind: 'fraction', value, tol: 0.11 },
    };
  }

  // pyramid on a square base — kept to whole numbers
  const a = randInt(3, 15), h = pick([3, 6, 9, 12, 15, 18]);
  const value = Math.round((1 / 3) * a * a * h * 100) / 100;
  return {
    type: 'vol-pyramid', instruction: 'Find the volume.',
    question: `A pyramid has a square base of side ${a} cm and vertical height ${h} cm. Find its volume.`,
    answer: `${value}`, accepts: accepts(`${value}`, `${value}cm³`),
    hints: hintLadder(
      'A pyramid is one third of the prism that would box it in.',
      'Volume = ⅓ × base area × height.',
      `Base area = ${a} × ${a}, then × ${h} ÷ 3.`),
    solution: { steps: [
      { text: 'Area of the square base.', expr: `${a} × ${a} = ${a * a} cm²` },
      { text: 'Volume = ⅓ × base × height.', expr: `(1/3) × ${a * a} × ${h} = ${value} cm³` }], answer: `${value}` },
    misconceptions: [
      { when: `${a * a * h}`, feedback: 'That is the full prism (box). A pyramid holds only one third of it.' },
    ],
    verify: { kind: 'fraction', value, tol: 0.02 },
  };
}

export const MEASUREMENT_CONTENT = {
  // Cambridge gap fill
  G7_LENGTH_CONV:     withWorkedExample(buildLengthConvAdvanced),
  G8_AREA_COMPOSITE:  withWorkedExample(buildCompositeArea),
  G8_SURFACE_AREA:    withWorkedExample(buildSurfaceAreaCuboid),
  G8_VOLUME_ADV:      withWorkedExample(buildVolumePrism),
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
  // Main's graph models temperature as ONE skill — mix reading/units with change.
  G7_TEMPERATURE:     withWorkedExample(() => Math.random() < 0.45 ? buildTemperatureRead() : buildTemperatureChange()),
  G8_DENSITY:         withWorkedExample(buildDensity),
  G9_ROUNDING:        withWorkedExample(buildRounding),
  G9_ERRORS:          withWorkedExample(buildErrors),
  G9_ARC_LENGTH:      withWorkedExample(buildArcSector),
  G9_SURFACE_AREA_ADV: withWorkedExample(buildSurfaceAreaAdv),
  G9_VOLUME_ADV:      withWorkedExample(buildVolumeAdv),
};

export const MEASUREMENT_SKILL_IDS = Object.keys(MEASUREMENT_CONTENT);
