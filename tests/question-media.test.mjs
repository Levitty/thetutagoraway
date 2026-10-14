// ============================================================================
// A QUESTION ABOUT A PICTURE MUST SHOW THE PICTURE
//
// Found in live testing by a real Grade 5 learner, in the memory check:
//
//     "What fraction of the sheet of paper is coloured?"   — no picture
//     "Is this slice of bread cut into eight equal parts?"  — no bread
//
// Three screens ask a question — the diagnostic, the lesson and the timed
// review — and each had its own copy of the answer markup. Only the lesson
// drew the picture, so the other two served picture questions as a bare text
// box. The learner cannot answer, and the placement then records a gap in
// fractions that the child does not actually have: a wrong diagnosis caused
// entirely by a missing drawing.
//
// The same screens also dropped the tap buttons on questions that ship their
// own options, which is worse than it sounds: a child cannot type "½" on a
// phone keyboard, and "yes / no" was being asked for as free text.
//
// These tests therefore guard both ends — the content side (a question that
// names a picture carries one) and the view side (every screen that asks a
// question renders the media and the options).
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SKILLS } from '../src/ai-tutor/knowledgeGraph.js';
import { generateProblem } from '../src/ai-tutor/problemGenerators.js';
import { ownChoicesOnly } from '../src/ai-tutor/choices.js';

const DRAWS = 12;

// Phrases that only make sense when something is drawn on the screen.
const REFERS_TO_A_PICTURE = /look at the (picture|path|arrow)|tap the right picture|^is this |this (chapati|paper|cloth|bread|handkerchief|circle)|the arrow shows/i;

test('a question that refers to a picture actually carries one', () => {
  const orphans = new Set();
  for (const id of Object.keys(SKILLS)) {
    for (let i = 0; i < DRAWS; i++) {
      let p;
      try { p = generateProblem(id); } catch { break; }
      if (!p) break;
      const text = `${p.instruction || ''} ${p.question || ''}`;
      // `visual` and `model` are drawings too — any of the three satisfies it.
      if (REFERS_TO_A_PICTURE.test(text) && !p.picture && !p.visual && !p.model) {
        orphans.add(`${id}: ${p.question}`);
      }
    }
  }
  assert.deepEqual([...orphans], [], `\n  ${[...orphans].join('\n  ')}\n`);
});

test('a tap-only question is served with its buttons', () => {
  // `tapChoices` means the content author decided this question is answered by
  // tapping. If the options never become `mc`, the learner gets a text box and
  // has to type "½" or "anticlockwise" on a phone.
  const typed = new Set();
  for (const id of Object.keys(SKILLS)) {
    for (let i = 0; i < DRAWS; i++) {
      let p;
      try { p = ownChoicesOnly(generateProblem(id)); } catch { break; }
      if (!p) break;
      if (p.tapChoices && !(Array.isArray(p.mc) && p.mc.length)) typed.add(`${id}: ${p.question}`);
    }
  }
  assert.deepEqual([...typed], [], `\n  ${[...typed].join('\n  ')}\n`);
});

test('an answer the learner must tap is always among the options', () => {
  // A button set that does not contain the right answer makes the question
  // impossible in a way that looks like the child simply got it wrong.
  const unanswerable = new Set();
  for (const id of Object.keys(SKILLS)) {
    for (let i = 0; i < DRAWS; i++) {
      let p;
      try { p = ownChoicesOnly(generateProblem(id)); } catch { break; }
      if (!p || !p.tapChoices || !Array.isArray(p.mc)) break;
      const answer = String(p.answer ?? '');
      const accepted = [answer, ...(p.accepts || [])].map(String);
      if (!p.mc.some(o => accepted.includes(String(o)))) {
        unanswerable.add(`${id}: answer ${JSON.stringify(answer)} is not among ${JSON.stringify(p.mc)}`);
      }
    }
  }
  assert.deepEqual([...unanswerable], [], `\n  ${[...unanswerable].join('\n  ')}\n`);
});

// ---------------------------------------------------------------------------
// The view side. This is where the bug actually lived: the content was right
// all along and three near-identical blocks of JSX disagreed about what to
// render. node:test cannot import JSX, so the screens are read as source.
// ---------------------------------------------------------------------------
const src = readFileSync(new URL('../src/ai-tutor/AIMastery.jsx', import.meta.url), 'utf8');

const viewBlock = (startMarker, endMarker) => {
  const a = src.indexOf(startMarker);
  const b = src.indexOf(endMarker, a);
  assert.ok(a >= 0, `could not find the start of the view: ${startMarker}`);
  assert.ok(b > a, `could not find the end of the view: ${endMarker}`);
  return src.slice(a, b);
};

const VIEWS = {
  diagnostic: viewBlock("if (view === 'diagnostic')", 'RENDER: LESSON'),
  lesson: viewBlock("if (view === 'lesson' && activeSkill)", 'RENDER: REVIEW (TIMED)'),
  review: viewBlock("if (view === 'review' && reviewProblems.length > 0)", 'RENDER: REVIEW COMPLETE'),
};

test('every screen that asks a question draws the picture it asks about', () => {
  const blind = Object.entries(VIEWS)
    // The lesson predates the shared component and renders the two pieces
    // itself; either way round counts, as long as both are drawn.
    .filter(([, body]) => !(body.includes('QuestionMedia')
      || (body.includes('problem.picture') && body.includes('problem.model'))))
    .map(([name]) => name);
  assert.deepEqual(blind, [], `these screens would show a picture question with no picture: ${blind.join(', ')}`);
});

test('every screen that asks a question offers the options it came with', () => {
  const blind = Object.entries(VIEWS)
    .filter(([, body]) => !(body.includes('ChoiceGrid') || body.includes('problem.mc')))
    .map(([name]) => name);
  assert.deepEqual(blind, [], `these screens would ask a tap question as free text: ${blind.join(', ')}`);
});

test('the diagnostic and the review attach a question’s own options', () => {
  // The generated four-choice items are deliberately kept out of reviews, so
  // these screens must call ownChoicesOnly — plain generateProblem would leave
  // a tap question with no buttons again.
  for (const name of ['diagnostic', 'review']) {
    const body = VIEWS[name];
    // The serving happens outside the render block, so check the file as a
    // whole does not serve a review/diagnostic problem unwrapped.
    assert.ok(body.length > 0, `${name} view is empty`);
  }
  const unwrapped = [...src.matchAll(/setProblem\(\s*generateProblem\(/g)].length;
  assert.equal(unwrapped, 0, 'a diagnostic or review problem is served without its own options attached');
});

// ---------------------------------------------------------------------------
// A QUESTION THAT SAYS A CHART IS THERE MUST DRAW ONE
//
// Found in live testing, in the diagnostic:
//
//   "In a survey: apples: 15, bananas: 10, oranges: 4, mangoes: 15.
//    How many apples were counted?"
//
// There was no survey and no chart. The answer sat in the question, labelled
// with the very word being asked about, and the hint said so out loud: "find
// apples in the list and read the number right after it". Seven questions
// across Grades 4 to 8 worked this way — "a bar graph shows Mon: 15, Tue: 17"
// with no graph anywhere — which turns reading a display, the skill the design
// actually names, into arithmetic on a sentence.
//
// The rule is narrow on purpose. A question MAY mention a chart while being
// self-contained ("1 square on the axis represents 5 learners; a bar reaches 7
// squares"), and that is fine. What it may not do is ASSERT that a display is
// in front of the learner and then not draw it.
// ---------------------------------------------------------------------------

// "The bar graph shows…", "The tally chart shows…" — an assertion that
// something is on screen, as opposed to a mention in passing.
const ASSERTS_A_DISPLAY = /\b(the|this)\s+(bar graph|tally chart|pictograph|pie chart|table|graph|chart)\s+(shows|gives)\b/i;

test('a question that says a chart is shown actually draws it', () => {
  const undrawn = new Map();
  for (const id of Object.keys(SKILLS)) {
    for (let i = 0; i < DRAWS; i++) {
      let p;
      try { p = generateProblem(id); } catch { break; }
      if (!p || p.placeholder) break;
      if (ASSERTS_A_DISPLAY.test(p.question || '') && !p.model && !p.picture && !p.visual) {
        if (!undrawn.has(id)) undrawn.set(id, p.question);
      }
    }
  }
  const report = [...undrawn].map(([id, q]) => `${id}: ${q}`);
  assert.deepEqual(report, [], `\n  ${report.join('\n  ')}\n`);
});

test('a drawn display is not also spelled out in the question', () => {
  // The other half of the same fault: drawing the chart but ALSO listing the
  // numbers leaves the chart decorative and the lookup intact.
  const spelled = new Map();
  for (const id of Object.keys(SKILLS)) {
    for (let i = 0; i < DRAWS; i++) {
      let p;
      try { p = generateProblem(id); } catch { break; }
      if (!p || !p.model) break;
      const d = p.model.data || {};
      // `rows` is an array of {label, value} on a table or tally, but a plain
      // COUNT on fraction-grid ({ rows: 6, cols: 2 }). Spreading that throws, so
      // only genuine lists are read.
      const list = (v) => (Array.isArray(v) ? v : []);
      const values = [...list(d.rows), ...list(d.bars)]
        .map(r => r?.value ?? r?.count).filter(v => v != null);
      // Three or more of the display's own values repeated in the stem means
      // the data was written out as well as drawn.
      if (values.length >= 3) {
        const inStem = values.filter(v => new RegExp(`(?<![\\d.])${v}(?![\\d.])`).test(p.question || '')).length;
        if (inStem >= 3 && !spelled.has(id)) spelled.set(id, p.question);
      }
    }
  }
  const report = [...spelled].map(([id, q]) => `${id}: ${q}`);
  assert.deepEqual(report, [], `\n  ${report.join('\n  ')}\n`);
});
