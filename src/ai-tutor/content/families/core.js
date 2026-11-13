// ============================================================================
// QUESTION FAMILIES: a real question form, written in advance.
//
// A family is one way of asking something, with new numbers on every draw:
// a story with a stop on the way, a table to read, a child's working with one
// wrong step, a choice of reasons. It emits exactly the problem object the
// builders in schema.js emit, so the lesson, the marker, the mistake catalogue
// and the quality gate treat it like any other question. This is not a second
// content path: generateRaw asks for a family first, and gets the skill's own
// generator when there is none to serve.
//
// THE RULES THE GATE ENFORCES (engine/scripts/quality_gate.mjs, tests/families.test.mjs):
//  - The key is computed from the draw. Nobody types an answer. `check` is a
//    second, independent relation the answer must satisfy (usually working the
//    question backwards), so a wrong formula has to be wrong twice.
//  - Tap questions say which option is right by computing it. Exactly one must
//    come out right on every draw.
//  - A spot-the-mistake working computes each step's truth. Exactly one step
//    must be false.
//  - Wrong options come from named mistakes, each with feedback. A family that
//    carries `cskill` (a skill of the Grade 5 curriculum map) names the library
//    misconception behind each wrong answer: [value, why, 'M_CODE'], or
//    { text, why, mis } on an option. The code is the library's own, without
//    the skill prefix; the checks resolve it.
//  - Every family is tagged to one outcome in curriculum/outcomes.js and must
//    match its signal, and it must not repeat a form its skill already has.
//
// `reviewed: false` keeps a family away from children until a person signs it
// off. It is the one flag, on the family, read at serve time. See switch below.
// ============================================================================

import { accepts, hintLadder, stepText } from '../schema.js';

const num = (v) => Number(Number(v).toPrecision(12));
export const fmtNum = (v) => String(num(v));
export const commas = (v) => {
  const [i, d] = fmtNum(v).split('.');
  return i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d ? `.${d}` : '');
};
// Round to dp places the way a child would, away from float noise.
export const round = (v, dp = 0) => num(Math.round((v + Number.EPSILON * Math.sign(v)) * 10 ** dp) / 10 ** dp);

// A negative option next to a question about sacks of sugar is no mistake a child
// makes, so it is dropped unless the family is about negative numbers.
const wrongList = (wrong, answer, negativesFair) => (wrong || [])
  .filter(([when]) => negativesFair || typeof when !== 'number' || when >= 0)
  .map(([when, feedback, mis]) => ({ when: typeof when === 'number' ? fmtNum(round(when, 3)) : String(when), feedback, ...(mis ? { mis } : {}) }))
  .filter(m => m.when !== String(answer));

// Numbers change on every draw, so the grammar around them has to change too:
// "1 tonne", not "1 tonnes"; "an 8 litre jug", "an open circle". One place, for
// every family, rather than a condition in each.
const SINGULAR = { tonnes: 'tonne', kilograms: 'kilogram', kilometres: 'kilometre', metres: 'metre', litres: 'litre', hours: 'hour', minutes: 'minute', seconds: 'second', days: 'day', weeks: 'week', months: 'month', years: 'year', packets: 'packet', bags: 'bag', bottles: 'bottle', tickets: 'ticket', boxes: 'box', cubes: 'cube', pieces: 'piece', learners: 'learner', mangoes: 'mango', oranges: 'orange', eggs: 'egg', sweets: 'sweet', books: 'book', pens: 'pen', pencils: 'pencil', children: 'child', people: 'person', rows: 'row', columns: 'column', sides: 'side', cows: 'cow', goats: 'goat', hens: 'hen', parts: 'part', layers: 'layer', trees: 'tree', sacks: 'sack', tins: 'tin', workers: 'worker', shillings: 'shilling' };
const ONE_PLURAL = new RegExp(`(^|[^\\d.,/])1 (${Object.keys(SINGULAR).join('|')})\\b`, 'g');
export const polish = (t) => t
  .replace(ONE_PLURAL, (_, b, w) => `${b}1 ${SINGULAR[w]}`)
  .replace(/\b([Aa]) (open|oval|octagon|exercise|orange|egg|hour|empty|old|acre|apple|8|11|18|8\d)\b/g, '$1n $2');
const polishAll = (v) => {
  if (typeof v === 'string') return polish(v);
  if (Array.isArray(v)) return v.map(polishAll);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typeof x === 'function' ? x : polishAll(x)]));
  return v;
};

// English items are authored with a full stop after every stem. A question ends with "?": any sentence that
// opens with a question word and ends with a full stop (outside quotation marks) gets one. Instructions
// ("Choose the noun.") do not open with a question word and keep their full stop.
const Q_WORD = /(^|[.?!]\s+)((?:Which|What|Whose|Whom|Who|Why|How|Is|Are|Do|Does|Did|Can|Will|Would|Should|Has|Have)\b[^.?!"\n]*|(?:When|Where)\b[^.?!",\n]*)\.(?=\s|"|$)/g;
export const asQuestion = (t) => (typeof t === 'string' ? t.replace(Q_WORD, '$1$2?') : t);

// Turn one draw's make() output into the engine's problem object.
export const toProblem = (def, d) => polishAll(buildProblem(def, d));
function buildProblem(def, d) {
  const m = def.make(d);
  const base = {
    type: `family-${def.form}`,
    familyId: def.id,
    familyForm: def.form,
    rung: def.rung,
    outcome: def.outcome,
    ...(def.cskill ? { cskill: def.cskill } : {}),
    ...(def.marker ? { marker: def.marker } : {}),   // 'text': marked by answerCheckText.js (English), not the Maths marker
    question: def.subject === 'english' ? asQuestion(m.question) : m.question,
    hints: hintLadder(...(m.hints || [])),
    hint: (m.hints || [])[0],
    solutionSteps: m.steps || [],
    solution: { steps: (m.steps || []).map(text => ({ text })), answer: '' },
  };
  if (m.model) base.model = m.model;
  if (m.passage) base.passage = m.passage;   // a short text to read first (English comprehension): { title, text }
  if (m.mis) base.mis = [].concat(m.mis);
  if (m.story !== false && def.form !== 'direct') base.story = true;

  if (m.parts) {
    const parts = m.parts.map(q => ({
      prompt: q.prompt,
      answer: fmtNum(q.answer),
      accepts: accepts(fmtNum(q.answer), commas(q.answer), ...(q.accepts || [])),
      unit: q.unit || '',
      hint: q.hint || '',
      mistakes: wrongList(q.wrong, fmtNum(q.answer), def.allowNegative),
    }));
    const last = parts[parts.length - 1];
    return { ...base, instruction: 'Answer each part. Each part earns a mark.', parts, marks: parts.length,
      answer: last.answer, accepts: last.accepts, hint: parts[0].hint,
      solution: { ...base.solution, answer: last.answer } };
  }
  if (m.working) {
    // The frame speaks the family's language: a Kiswahili family (lang: 'sw', or subject 'kiswahili') says "Hatua".
    const sw = def.lang === 'sw' || def.subject === 'kiswahili';
    const word = sw ? 'Hatua' : 'Step';
    const labels = m.working.map((_, i) => `${word} ${i + 1}`);
    const bad = m.working.findIndex(s => !s.ok);
    const L = sw
      ? { instruction: 'Hatua moja ina kosa. Itafute.', right: l => `${l} ni sahihi. Endelea kukagua hatua zinazofuata.`, later: l => `${l} inafuata vizuri kutoka hatua iliyotangulia. Kosa lilitokea mapema zaidi.` }
      : { instruction: 'One step has a mistake. Find it.', right: l => `${l} is right. Keep checking the steps after it.`, later: l => `${l} follows on correctly from the step before it. The mistake happens earlier.` };
    return { ...base, ...(sw ? { lang: 'sw' } : {}), type: 'spot-mistake', instruction: L.instruction,
      shownSteps: m.working.map(s => s.text), mc: labels, answer: labels[bad],
      accepts: [labels[bad], `${bad + 1}`, `${word.toLowerCase()}${bad + 1}`, `step${bad + 1}`], explain: m.fix,
      workingTruth: m.working.map(s => s.ok),
      misconceptions: labels.map((l, i) => (i === bad ? null : { when: l, feedback: i < bad ? L.right(l) : L.later(l) })).filter(Boolean),
      solution: { ...base.solution, answer: labels[bad] }, solutionSteps: [m.fix, ...(m.steps || [])] };
  }
  if (m.options) {
    const right = m.options.find(o => o.right);
    return { ...base, instruction: m.instruction || 'Choose the best answer.',
      choices: m.options.map(o => String(o.text)), choicesFixed: !!m.fixedOrder,
      optionTruth: m.options.map(o => !!o.right),
      answer: right ? String(right.text) : '', accepts: right ? [String(right.text)] : [],
      misconceptions: m.options.filter(o => !o.right && o.why).map(o => ({ when: String(o.text), feedback: o.why, ...(o.mis ? { mis: o.mis } : {}) })),
      solution: { ...base.solution, answer: right ? String(right.text) : '' } };
  }
  const isNum = typeof m.answer === 'number';
  const answer = isNum ? fmtNum(m.answer) : String(m.answer);
  return { ...base, instruction: m.instruction || 'Read carefully. Then answer the question.',
    answer,
    accepts: accepts(answer, ...(isNum ? [commas(m.answer)] : []), ...(m.accepts || [])),
    misconceptions: wrongList(m.wrong, answer, def.allowNegative),
    verify: isNum ? { kind: 'number', value: num(m.answer) } : { kind: 'text', value: answer },
    answerValue: isNum ? num(m.answer) : null,
    solution: { ...base.solution, answer } };
}

// A draw: draw() may return null to say "not this one, try again" (a price
// that would not divide evenly, two options that came out equal).
export function drawFamily(def, tries = 200) {
  for (let i = 0; i < tries; i++) {
    const d = def.draw();
    if (d) return { d, p: toProblem(def, d) };
  }
  throw new Error(`family ${def.id}: no acceptable draw in ${tries} tries`);
}

// The problem a child gets: one draw, plus a separate solved example to study.
export function serveFamily(def) {
  const { p } = drawFamily(def);
  const { p: ex } = drawFamily(def);
  p.workedExample = {
    problem: ex.question,
    steps: ex.solutionSteps,
    solution: ex.solution.answer,
    instruction: ex.instruction,
    richSteps: ex.solution.steps,
  };
  return p;
}

export const FORMS = ['direct', 'word', 'steps', 'spot', 'why', 'table', 'graph'];
// Reads well at the call site; the gate does the checking. `cskill` (the Grade 5
// curriculum skill code) rides beside the HOREB `skill` and the official `outcome`.
export const family = (def) => def;
export { stepText };

// ---------------------------------------------------------------- the switch
// Unreviewed families reach nobody but a person testing on their own machine.
//   - npm run horeb:try sets VITE_HOREB_ALL_FAMILIES=1 under the dev server.
//     A production build has DEV false, so the variable does nothing there.
//   - node scripts and tests set HOREB_ALL_FAMILIES=1 or call setFamilyMode().
// There is deliberately no URL parameter and no setting in the app.
export const allOnFrom = (env) => env?.DEV === true && env?.VITE_HOREB_ALL_FAMILIES === '1';
let mode = (allOnFrom(import.meta.env) || (globalThis.process?.env?.HOREB_ALL_FAMILIES === '1' && globalThis.process?.env?.NODE_ENV !== 'production')) ? 'all' : 'reviewed';
export const familyMode = () => mode;
export const setFamilyMode = (m) => { mode = m; };   // tools and tests only
// THE ONE RULE for every subject (Maths, Science, English): a family a person has not signed off is never served to a child.
// Signed off = `core` (Maths labels that were wrong) or `reviewed: true`, which each subject's signed list sets on the family.
export const isSigned = (def) => def.core === true || def.reviewed === true;
export const isOn = (def) => isSigned(def) || mode === 'all';
