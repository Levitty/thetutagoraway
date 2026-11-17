// ============================================================================
// PACING (12 Nov 2026, after the free yardstick): shorter turns (30 words, 25 after turn 10), the child's share of the
// talk and the hand-over after explaining, the warm-up's first question on the earlier skill, and the free replay.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MAX_SPOKEN_WORDS, LATE_SPOKEN_WORDS, wordCap } from '../src/voice-tutor/commands.js';
import { wordsIn, talkShare, shareLow, overtalkLimit, explainedTurn, handoverMoves, pacingFlags, preFor, askIsOnPre, handsOver } from '../src/voice-tutor/pacing.js';
import { newLesson, cleanLesson, decide, judgeTurn, updateLesson, turnBrief, stageAllowed, PRE_GIVE_UP_TURNS } from '../src/voice-tutor/orchestrator.js';
import { trimToWords } from '../src/voice-tutor/tutorTurn.js';
import { replayLesson, replayRun, trimSays } from '../scripts/evals/pacing-replay.mjs';
import { parseTranscript } from '../scripts/evals/habits.mjs';

const F = 'MATH.G5.NUMBER.FRACTIONS.';
const say = (text, move) => ({ cmd: 'say', text, ...(move ? { move } : {}) });
const at = (o = {}) => ({ ...newLesson(), stage: 'teach', turns: 5, ...o });
const words = (n) => Array(n).fill('word').join(' ');

test('the caps: 30 words a normal turn, 25 after tutor turn 10; the trim keeps the final question', () => {
  assert.equal(MAX_SPOKEN_WORDS, 30);
  assert.equal(LATE_SPOKEN_WORDS, 25);
  assert.equal(wordCap(1), 30);
  assert.equal(wordCap(9), 30);   // tutor turn 10
  assert.equal(wordCap(10), 25);  // tutor turn 11
  const text = `We cut the chapati into four equal pieces and I shade one of them for you. ${words(8)}. How many pieces are shaded?`;
  const cut = trimToWords(text, wordCap(10), { mustSay: true });
  assert.match(cut, /How many pieces are shaded\?$/);
  assert.ok(wordsIn(cut) <= 25, cut);
});

test('the brief tells the model its word budget: 30, 25 late, the hello 50', () => {
  const brief = (turnIndex, o = {}) => turnBrief(at(), decide(at(), { turnIndex }), { turnIndex, ...o }).join('\n');
  assert.match(brief(3), /Word budget this turn: at most 30 words/);
  assert.match(brief(12), /Word budget this turn: at most 25 words/);
  assert.match(turnBrief(newLesson(), decide(newLesson(), { turnIndex: 0 }), { turnIndex: 0 }).join('\n'), /at most 50 words/);
  assert.match(brief(3, { maxWords: 22 }), /at most 22 words/);
});

test('an explaining turn is one with nothing handed to the child', () => {
  assert.equal(explainedTurn([say('Here is a bar cut in four. One part is shaded.')]), true);
  assert.equal(explainedTurn([say('Here is a bar. Okay?')]), true, 'an empty check is not a hand-over');
  assert.equal(explainedTurn([say('Here is a bar. What do you notice?')]), false);
  assert.equal(explainedTurn([say('Here is a bar.'), { cmd: 'ask', id: 'q1', prompt: 'How many parts?', form: 'number' }]), false);
  assert.equal(explainedTurn([say('Goodbye.'), { cmd: 'end_session', summary: 'x' }]), false);
  assert.equal(explainedTurn([{ cmd: 'pause_for_child' }]), false, 'saying nothing is not explaining');
  assert.equal(handsOver('Why do you think so?'), true);
  assert.equal(handsOver('Does that make sense?'), false);
});

test('after an explaining turn the next must hand over: Show then hand over, Check for understanding', () => {
  const base = decide(at(), { turnIndex: 5, message: 'ok' });
  assert.equal(base.handover, false);
  const d = decide(at({ explain: 1 }), { turnIndex: 5, message: 'ok' });
  assert.equal(d.handover, true);
  assert.deepEqual(d.moves, ['Show then hand over', 'Check for understanding']);
  assert.match(d.reason, /hands over first/);
  assert.match(decide(at({ explain: 2 }), { turnIndex: 5, message: 'ok' }).reason, /last 2 turns explained/);
  // The earlier-skill path also hands over (and may hint); a probe, a care turn and the close are not changed.
  assert.ok(decide(at({ explain: 1, classes: ['missing_prerequisite'] }), { turnIndex: 5, message: 'ok', prerequisite: 'Equal parts' }).moves.includes('Smaller-question hint'));
  assert.equal(decide(at({ explain: 1 }), { turnIndex: 5, probe: { kind: 'answer_nudge' } }).handover, false);
  assert.equal(decide(at({ explain: 1 }), { turnIndex: 30, elapsedMin: 18 }).handover, false);
  assert.deepEqual(handoverMoves('stage'), ['Show then hand over', 'Check for understanding']);
  // The brief says so, and the judge notes a turn that explains again.
  assert.match(turnBrief(at({ explain: 1 }), d, { turnIndex: 5 }).join('\n'), /Hand over first/);
  assert.match(judgeTurn(d, [say('The bar has four parts.', 'Show then hand over')]).join(' '), /explained again/);
  assert.deepEqual(judgeTurn(d, [say('Now you try. How many parts?', 'Show then hand over')]).filter((n) => /explained again/.test(n)), []);
});

test('the lesson state counts who talks and the explaining turns in a row', () => {
  let s = updateLesson(newLesson(), { decision: decide(newLesson(), { turnIndex: 0 }), steps: [say(`${words(10)}. What is a half?`)], childWords: 0 });
  assert.deepEqual([s.cw, s.tw, s.explain], [0, 14, 0]);
  const d = decide(s, { turnIndex: 1, message: 'a half' });
  s = updateLesson(s, { decision: d, steps: [say(`${words(8)}.`)], childWords: 2 });
  assert.deepEqual([s.cw, s.tw, s.lastCw, s.explain], [2, 22, 2, 1]);
  s = updateLesson(s, { decision: decide(s, { turnIndex: 2, message: 'ok' }), steps: [say(`${words(5)}.`)], childWords: 1 });
  assert.equal(s.explain, 2);
  s = updateLesson(s, { decision: decide(s, { turnIndex: 3, message: 'ok' }), steps: [say('Now you try. What do you see?')], childWords: 1 });
  assert.equal(s.explain, 0);
  // A silence probe adds the tutor's words but is not an explaining turn and adds no child words.
  const p = updateLesson({ ...s, explain: 1 }, { decision: decide(s, { turnIndex: 4, probe: { kind: 'answer_nudge' } }), steps: [say('Take your time.')], probe: { kind: 'answer_nudge' }, childWords: 0 });
  assert.equal(p.explain, 1);
});

test('the share is read after 60 words; below 25% the brief says so and the gate holds the turn to twice the child plus 15', () => {
  assert.equal(talkShare({ cw: 5, tw: 40 }), null, 'too early');
  assert.equal(talkShare({ cw: 10, tw: 90 }), 0.1);
  assert.equal(shareLow({ cw: 10, tw: 90 }), true);
  assert.equal(shareLow({ cw: 30, tw: 70 }), false);
  const s = at({ cw: 10, tw: 90, lastCw: 3 });
  assert.equal(overtalkLimit(3), 21);
  assert.match(turnBrief(s, decide(s, { turnIndex: 5, message: 'ok' }), { turnIndex: 5 }).join('\n'), /spoken only 10% of the words.*21 words at most/);
  assert.doesNotMatch(turnBrief(at({ cw: 30, tw: 70 }), decide(at(), { turnIndex: 5 }), { turnIndex: 5 }).join('\n'), /spoken only/);
  const ctx = { talk: { low: true, lastChildWords: 3 } };
  assert.equal(pacingFlags(say(`${words(20)}.`), ctx, []).length, 0);
  const f = pacingFlags(say(`${words(22)}.`), ctx, []);
  assert.equal(f[0].habit, 'overtalk');
  assert.match(f[0].reason, /22 words, over 21/);
  assert.equal(pacingFlags(say(`${words(10)}.`), ctx, [say(`${words(12)}.`)]).length, 1, 'the turn so far counts');
  assert.deepEqual(pacingFlags(say(`${words(40)}.`), { talk: { low: false, lastChildWords: 0 } }, []), [], 'only when the share is low');
});

test('the lesson state cleans the new fields', () => {
  const s = cleanLesson({ v: 1, cw: 12, tw: 99, lastCw: 4, explain: 2, pre: 'asked' });
  assert.deepEqual([s.cw, s.tw, s.lastCw, s.explain, s.pre], [12, 99, 4, 2, 'asked']);
  const bad = cleanLesson({ v: 1, cw: -3, tw: 'x', lastCw: 1e9, explain: 1.5, pre: 'yes' });
  assert.deepEqual([bad.cw, bad.tw, bad.lastCw, bad.explain, bad.pre], [0, 0, 0, 0, null]);
});

test('the warm-up: the first maths question is on the weakest prerequisite, else the nearest one, else the foundation', () => {
  const nameOf = (c) => c.split('.').pop();
  const ADD = `${F}ADD_SAME_DENOMINATOR`;
  const w = preFor({ target: ADD, prerequisite: `${F}SIMPLIFY_FRACTIONS`, prerequisites: [`${F}SIMPLIFY_FRACTIONS`, `${F}EQUIVALENT_FRACTIONS`], nameOf });
  assert.equal(w.skill, `${F}SIMPLIFY_FRACTIONS`);
  assert.equal(preFor({ target: ADD, prerequisites: [`${F}SIMPLIFY_FRACTIONS`], nameOf }).skill, `${F}SIMPLIFY_FRACTIONS`);
  const root = preFor({ target: `${F}EQUIVALENT_FRACTIONS`, prerequisites: [], nameOf });
  assert.equal(root.skill, null);
  assert.match(root.name, /equal parts/);
  assert.equal(preFor({ target: `${F}SOMETHING_ELSE`, prerequisites: [] }), null);
  assert.equal(askIsOnPre(w, { skill: `${F}SIMPLIFY_FRACTIONS` }), true);
  assert.equal(askIsOnPre(w, { skill: ADD }), false);
  assert.equal(askIsOnPre(root, { prompt: 'What fraction of the chapati is shaded?' }), true);
  assert.equal(askIsOnPre(root, { prompt: 'One third is how many sixths?' }), false);
  assert.equal(askIsOnPre(null, { skill: 'x' }), true);
});

test('the lesson does not reach the teach part until the first question is asked and answered, right or wrong', () => {
  const pre = { skill: `${F}SIMPLIFY_FRACTIONS`, name: 'Simplifying' };
  const L0 = newLesson();
  let s = updateLesson(L0, { decision: decide(L0, { turnIndex: 0, pre }), steps: [say('Hello. What is a half?')], preNeeded: true });
  assert.equal(s.pre, 'ask');
  assert.equal(s.stage, 'warmup');
  // Turn 2: the brief names the earlier skill; the teach stage is not allowed even after an answer.
  const d = decide({ ...s, answers: 1 }, { turnIndex: 1, message: 'a half', pre });
  assert.equal(d.stageMax, 'warmup');
  assert.deepEqual(d.preFirst, { skill: pre.skill, name: 'Simplifying' });
  assert.match(d.reason, /first maths question is on the earlier skill \(Simplifying\)/);
  const brief = turnBrief(s, d, { turnIndex: 1 }).join('\n');
  assert.match(brief, new RegExp(`write ask.skill as "${pre.skill}"`));
  // The ask goes out: waiting. The stage still holds until it is answered.
  s = updateLesson(s, { decision: d, steps: [say('Try this. How many parts?'), { cmd: 'ask', id: 'w1', prompt: 'How many parts?', form: 'number' }], preNeeded: true });
  assert.equal(s.pre, 'asked');
  assert.equal(stageAllowed({ ...s, answers: 3 }), 'warmup');
  assert.equal(stageAllowed({ ...s, answers: 3 }, { preNow: true }), 'teach');
  assert.equal(decide({ ...s, answers: 0 }, { turnIndex: 2, marked: { ask: 'w1', skill: pre.skill, correct: true, answer: '2', said: 'two' }, message: 'two because halves', pre }).preFirst, null);
  // A right answer ends it; a wrong answer ends it too and sends the lesson down the earlier-skill path.
  const right = updateLesson(s, { decision: d, steps: [say('Yes, two.')], marked: { ask: 'w1', skill: pre.skill, correct: true, answer: '2' }, judged: { class: 'understood' }, preNeeded: true });
  assert.deepEqual([right.pre, right.prereq], ['done', false]);
  const wrong = updateLesson(s, { decision: d, steps: [say('How did you get that?')], marked: { ask: 'w1', skill: pre.skill, correct: false, answer: '3' }, judged: { class: 'misconception' }, preNeeded: true });
  assert.deepEqual([wrong.pre, wrong.prereq], ['done', true]);
  // A lesson whose question never comes carries on rather than deadlocking.
  let stuck = updateLesson(L0, { decision: d, steps: [say('Hello.')], preNeeded: true });
  for (let i = 1; i < PRE_GIVE_UP_TURNS; i += 1) stuck = updateLesson(stuck, { decision: d, steps: [say('Tell me more.')], preNeeded: true });
  assert.equal(stuck.pre, 'done');
  // Nothing to check first: no state, no rule.
  assert.equal(updateLesson(L0, { decision: d, steps: [say('Hello.')] }).pre, null);
});

test('the replay: caps, hand-over and share over a saved lesson, with the trim estimated', () => {
  const md = `# Scenario 99: Test\n\n## Turn 1: opening | 1 s\n\nHOREB: Hello. I am HOREB, an AI tutor.\nHOREB: What is a half?\n[hand over: child is now answer]\n\n## Turn 2: reply | 1 s\n\nChild: "one of two"\n\nHOREB {move: Show then hand over}: ${words(20)}. ${words(15)}. What fraction is shaded?\n[ask {"id":"w1","prompt":"What fraction is shaded?","form":"fraction"}]\n[hand over: child is now answer]\n\n## Turn 3: reply | 1 s\n\nChild: "ok"\n\nHOREB: ${words(12)}.\nHOREB: ${words(5)}.\n[hand over: child is now talk]\n\n## Turn 4: reply | 1 s\n\nChild: "ok"\n\nHOREB: ${words(12)}.\n`;
  const lesson = replayLesson(parseTranscript(md));
  const [t1, t2, t3, t4] = lesson.turns;
  assert.equal(t2.words, 39);
  assert.equal(t2.over, true);
  assert.ok(t2.after <= 30);
  assert.equal(t3.over, false);
  assert.equal(t4.explainedAgain, false, 'the rule needs a stage rule on the turn');
  assert.ok(lesson.shareTrimmedPct >= lesson.sharePct);
  assert.equal(lesson.firstAsk.ok, true);
  assert.deepEqual(trimSays([`${words(20)}.`, `${words(15)}. What now?`], 30).length, 2);
  const run = replayRun([parseTranscript(md)]);
  assert.equal(run.total.trimmed, 1);
  assert.equal(run.share.lessons, 1);
});
