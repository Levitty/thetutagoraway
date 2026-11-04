// Feedback F27: the right number with a wrong unit is a wrong answer ("28 kg"
// for an area, "62.5 m" for 62.5 cm), and the right unit is right in every
// spelling a child uses. The sweeps guard the worse fault too: a right answer
// must never be turned away because a unit was guessed wrongly.
import test from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { checkAnswerMatch, rightNumberWrongUnit, readUnit, askedUnit } from '../src/ai-tutor/answerCheck.js';
import { diagnoseError } from '../src/ai-tutor/remediation.js';

const q = (question, answer, extra = {}) => ({ question, answer, ...extra });
const right = (a, p) => assert.equal(checkAnswerMatch(a, p), true, `"${a}" should pass: ${p.question}`);
const wrong = (a, p) => assert.equal(checkAnswerMatch(a, p), false, `"${a}" should fail: ${p.question}`);

test('the examples in the report', () => {
  const area = q('A rectangle is 7 cm long and 4 cm wide. What is its area in square centimetres?', '28');
  for (const a of ['28', '28 cm²', '28 cm2', '28 cm^2', '28 sq cm', '28 square centimetres', '28 cm squared']) right(a, area);
  for (const a of ['28 m', '28 kg', '28 cm', '28 m²']) wrong(a, area);
  const plank = q('The length of a plank is 63 cm to the nearest cm. What is the lower bound?', '62.5');
  for (const a of ['62.5', '62.5 cm', '62.5 centimetres']) right(a, plank);
  wrong('62.5 m', plank);
  const goat = q('A goat is tethered by a rope 9 m long. What area can it reach? (Use π = 3.142, answer to the nearest m².)', '254');
  for (const a of ['254', '254 m²', '254 m2', '254 square metres', '254 metres squared', '254 sq m']) right(a, goat);
  for (const a of ['254 cm', '254 m', '254 kg', '254 cm²']) wrong(a, goat);
});

test('a key that carries a unit decides, paired with its own number', () => {
  const p = q('Convert the mass.', '1500 g', { accepts: ['1500 g', '1.5 kg'] });
  for (const a of ['1500 g', '1500 grams', '1.5 kg', '1.5 kilograms']) right(a, p);
  for (const a of ['1500 kg', '1.5 g', '1500 cm']) wrong(a, p);
  // A plain number next to a unit in the list does not open the door to others.
  const both = q('Work it out.', '42', { accepts: ['42', '42 cm²'] });
  right('42', both); right('42 sq cm', both); wrong('42 kg', both); wrong('42 cm', both);
});

test('what is asked is read from the ask, not from the first measure mentioned', () => {
  const width = q('A rectangle has area 24 cm² and length 6 cm. Find its width.', '4');
  right('4 cm', width); wrong('4 cm²', width); wrong('4 kg', width); wrong('4 m', width);
  const area = q('What is the area of a rectangle of length 7 cm and width 4 cm?', '28');
  right('28 cm²', area); wrong('28 cm', area);
  const length = q('Find the length of a rectangle of area 24 cm² and width 4 cm.', '6');
  right('6 cm', length); wrong('6 cm²', length);
  const time = q('A car travels 120 km at 30 km/h. Find the time taken.', '4');
  right('4 hours', time); right('4 hrs', time); wrong('4 km', time);
  const speed = q('A car travels 200 km in 5 hours. Find its speed.', '40');
  for (const a of ['40 km/h', '40 kmh', '40 km per hour']) right(a, speed);
  wrong('40 km', speed);
  const rate = q('What is its speed in km per hour?', '30');
  right('30 km/h', rate); wrong('30 km', rate);
  const period = q('A loan of KSh 5000 earned interest of KSh 600 at 4%. Find the time.', '3');
  right('3 years', period);
});

test('a question that does not say is left alone', () => {
  // Things counted, percentages, and a side found from an angle alone.
  right('6 pieces', q('A rope 3 m long is cut into pieces of 50 cm. How many pieces?', '6'));
  right('5 kg', q('Sugar costs 100 shillings for a kg. How much sugar for 500 shillings?', '5'));
  right('3.9 cm', q('In a right-angled triangle the hypotenuse is 6 and one angle is 40°. Find the opposite side.', '3.9'));
  const pct = q('An item marked KSh 2,500 is sold for KSh 1,875. What is the percentage discount?', '25');
  right('25%', pct); right('25 percent', pct);
  // Letters: "5 m" is algebra here, not metres.
  right('14', q('If m = 3, find 4m + 2.', '14'));
  assert.equal(askedUnit(q('If m = 3, find 4m + 2.', '14')), null);
  // Capital letters are points, not units.
  assert.equal(askedUnit(q('Find the route from P to S.', '4')), null);
  // Millilitres and cubic centimetres are the same size.
  const tin = q('Find the volume of a tin 6 cm by 4 cm by 9 cm.', '216');
  right('216 cm³', tin); right('216 ml', tin);
});

test('readUnit reads every spelling as one unit, and only units', () => {
  for (const w of ['cm²', 'cm2', 'cm^2', 'sq cm', 'sq. cm', 'square centimetres', 'centimetres squared', 'cm squared']) assert.equal(readUnit(w)?.unit, 'cm2', w);
  for (const w of ['m³', 'm3', 'cubic metres', 'metres cubed']) assert.equal(readUnit(w)?.unit, 'm3', w);
  for (const w of ['km/h', 'km per hour', 'kilometres per hour', 'kmh', 'kph']) assert.equal(readUnit(w)?.unit, 'km/h', w);
  for (const w of ['goats', 'pieces', 'x', 'mrs', 'pupils', '']) assert.equal(readUnit(w), null, w);
});

test('the child is told their number is right and to check the unit', () => {
  const p = q('A rectangle is 7 cm long and 4 cm wide. What is its area in square centimetres?', '28');
  assert.equal(rightNumberWrongUnit('28 kg', p), true);
  assert.equal(rightNumberWrongUnit('28 cm²', p), false);
  assert.equal(rightNumberWrongUnit('29 kg', p), false);
  assert.equal(rightNumberWrongUnit('28', p), false);
  assert.match(diagnoseError(p, '28 kg'), /number is right.*unit/i);
});

// Sweeps: every skill, 30 draws.
const draws = function* (n = 30) {
  for (const id of Object.keys(SKILLS)) for (let k = 0; k < n; k++) {
    let p; try { p = generateProblem(id); } catch { continue; }
    yield [id, p];
  }
};
const numberAndUnit = (a) => {
  const m = String(a).trim().match(/^(-?[\d,]*\.?\d+)\s*([^\d\s].*)$/);
  const u = m && readUnit(m[2]);
  return u ? { number: m[1], unit: u } : null;
};
const SPELLINGS = {
  cm: ['cm', 'centimetres'], m: ['m', 'metres'], km: ['km', 'kilometres'], mm: ['mm', 'millimetres'],
  kg: ['kg', 'kilograms'], g: ['g', 'grams'], l: ['l', 'litres'], ml: ['ml', 'millilitres'],
  h: ['h', 'hours', 'hrs'], min: ['min', 'minutes'], s: ['s', 'seconds'], day: ['days'],
  cm2: ['cm²', 'cm2', 'sq cm', 'square centimetres'], m2: ['m²', 'm2', 'square metres'],
  cm3: ['cm³', 'cm3', 'cubic centimetres'], m3: ['m³', 'cubic metres'], deg: ['°', 'degrees'], sh: ['shillings'],
};

test('no skill turns away its own key in any spelling of its unit', () => {
  const bad = []; let seen = 0;
  for (const [id, p] of draws()) {
    const found = numberAndUnit(p.answer);
    const asked = askedUnit(p);
    const bare = /^-?[\d,]*\.?\d+$/.test(String(p.answer).trim());
    const unit = found?.unit || (bare && asked?.units?.[0]);
    // A percentage question mentions kg or shillings but is not answered in them.
    if (!unit || !SPELLINGS[unit.unit] || /percentage|percent|%/i.test(`${p.instruction} ${p.question}`)) continue;
    const number = found?.number || String(p.answer).trim();
    for (const w of SPELLINGS[unit.unit]) {
      seen++;
      if (!checkAnswerMatch(`${number} ${w}`, p)) bad.push(`${id}: ${p.question} => ${p.answer}, tried "${number} ${w}"`);
    }
  }
  assert.ok(seen > 3000, `only ${seen} tried`);
  assert.deepEqual(bad.slice(0, 5), []);
});

test('no skill lists a unit its own question rules out', () => {
  const bad = []; let seen = 0;
  for (const [id, p] of draws()) {
    for (const a of [p.answer, ...(p.accepts || [])]) {
      const found = numberAndUnit(a);
      if (!found) continue;
      seen++;
      // The same answer without its key's help, as the question alone reads it.
      const unitAsWritten = String(a).trim().slice(found.number.length).trim();
      if (!checkAnswerMatch(`${found.number} ${unitAsWritten}`, { question: p.question, instruction: p.instruction, answer: found.number })) bad.push(`${id}: ${p.question} lists "${a}"`);
    }
  }
  assert.ok(seen > 1500, `only ${seen} seen`);
  assert.deepEqual(bad.slice(0, 5), []);
});

test('a measured answer with a unit from another family is never marked right', () => {
  const OTHER = { length: 'kg', area: 'kg', volume: 'kg', mass: 'cm', capacity: 'cm', time: 'kg', money: 'cm', angle: 'kg', speed: 'kg' };
  const bad = []; let seen = 0;
  for (const [id, p] of draws()) {
    const found = numberAndUnit(p.answer);
    const family = found?.unit.family || askedUnit(p)?.family;
    if (!OTHER[family]) continue;
    const number = found?.number || String(p.answer).trim();
    if (!/^-?[\d,]*\.?\d+$/.test(number)) continue;
    seen++;
    if (checkAnswerMatch(`${number} ${OTHER[family]}`, p)) bad.push(`${id}: ${p.question} => ${p.answer} took "${number} ${OTHER[family]}"`);
  }
  assert.ok(seen > 1000, `only ${seen} tried`);
  assert.deepEqual(bad.slice(0, 5), []);
});
