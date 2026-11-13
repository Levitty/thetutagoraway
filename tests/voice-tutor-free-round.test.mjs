// The free round of 13 Nov 2026 (Tutagora/Build/voice-tutor/evals/FREE_ROUND_13NOV.md): the standard for the move in the
// brief, no stock line said twice, the teacher's opening and close. No model calls.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newLesson, cleanLesson, decide, updateLesson, turnBrief, MOVE_STANDARD, FIVE_AT_FOUR } from '../src/voice-tutor/orchestrator.js';
import { recoverLines, freshLines, recentSays } from '../src/voice-tutor/tutorTurn.js';
import { lessonFrame, FRACTION_SKILLS, LESSON_FRAMES } from '../src/voice-tutor/fractions.js';
import { PLAYBOOK_MOVES } from '../src/voice-tutor/commands.js';
import { GOAL_SAID, PRIOR_Q, CLOSE_SUMMARY, CLOSE_CAN_NOW, CLOSE_NEXT } from '../scripts/evals/conversation-stats.mjs';

const EQ = 'MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS';
const words = (t) => String(t).split(/\s+/).filter(Boolean).length;

test('the brief carries the 4 and the 5 for the move it allows, and the five measures at 4, short', () => {
  for (const m of PLAYBOOK_MOVES) {
    const st = MOVE_STANDARD[m];
    assert.ok(st, `${m} has a standard`);
    assert.ok(words(`${st[1]} ${st[2]}`) <= 40, `${m}: short (${words(`${st[1]} ${st[2]}`)} words)`);
  }
  for (const k of ['teaching', 'diagnosis', 'naturalness', 'adapting', 'curriculum']) assert.match(FIVE_AT_FOUR, new RegExp(k));
  const s = { ...newLesson(), stage: 'teach', turns: 3 };
  const d = decide(s, { turnIndex: 3, message: 'two sixths', marked: { correct: false, ask: 'q1', answer: '2/6' } });
  const b = turnBrief(s, d, { message: 'two sixths', marked: { correct: false }, skill: EQ, turnIndex: 3 });
  const std = b.find((l) => /standard you are judged on/.test(l));
  assert.match(std, /4: .*5: /);
  assert.ok(b.includes(`- ${FIVE_AT_FOUR}`));
  // Shorter than the two generic anchors it replaced (about 120 words).
  assert.ok(words(std) + words(FIVE_AT_FOUR) < 100, `${words(std) + words(FIVE_AT_FOUR)} words`);
});

test('a code line is never said again: a recent line is left out, a repeated question becomes a different one, or silence', () => {
  const board = [{ cmd: 'shape', id: 'c', kind: 'circle', parts: 4, shaded: 1 }];
  const first = recoverLines({ probe: { kind: 'answer_nudge' }, turnIndex: 0, openPrompt: 'How many parts are shaded?', board });
  const recent = first.lines;
  const again = recoverLines({ probe: { kind: 'answer_nudge' }, turnIndex: 3, openPrompt: 'How many parts are shaded?', board, recent });
  for (const l of again.lines) assert.ok(!recent.includes(l), `"${l}" was said a moment ago`);
  assert.ok(again.lines.some((l) => /\?$/.test(l)), 'still ends on a question');
  // Everything already said: no words rather than the same words.
  assert.deepEqual(freshLines(['Take your time.'], { recent: ['Take your time.'] }), []);
  // Care and goodbye lines are kept as written.
  assert.deepEqual(freshLines(['I am listening.'], { recent: ['I am listening.'], rule: 'care' }), ['I am listening.']);
  assert.deepEqual(recentSays([{ who: 'tutor', text: 'Take your time. How many?' }, { who: 'child', text: 'four' }]), ['Take your time.', 'How many?']);
});

test('the opening is a teacher\'s: the goal, then one question on what the child already knows', () => {
  for (const c of FRACTION_SKILLS) {
    const f = lessonFrame(c);
    assert.match(f.goal, GOAL_SAID, c);
    assert.match(f.prior, PRIOR_Q, c);
    assert.match(`Now you can ${f.can}.`, CLOSE_CAN_NOW);
    assert.match(`Next time we will look at ${f.next}.`, CLOSE_NEXT);
  }
  assert.equal(Object.keys(LESSON_FRAMES).length, FRACTION_SKILLS.length);
  const s = newLesson();
  const b = turnBrief(s, decide(s, { turnIndex: 0 }), { skill: EQ, turnIndex: 0 }).join('\n');
  assert.match(b, /Open as a teacher does: the goal in one sentence \("Today we are learning about fractions that look different but are the same amount\."\)/);
  assert.match(b, /ONE question on what the child already knows \("What do you already know about a half\?"/);
});

test('the close is a teacher\'s: the child says what they learned, then summary, can now, next, and the lesson ends', () => {
  let s = { ...newLesson(), stage: 'independent', turns: 20, found: ['1/2', '2/4'] };
  const d1 = decide(s, { turnIndex: 20, elapsedMin: 18, message: 'two quarters' });
  assert.equal(d1.rule, 'close');
  assert.equal(d1.closeStep, 'recall');
  assert.match(turnBrief(s, d1, { skill: EQ, turnIndex: 20 }).join('\n'), /say one thing they learned today, in their own words/);
  s = updateLesson(s, { decision: d1, steps: [{ cmd: 'say', text: 'What is one thing you learned today?' }], elapsedMin: 18 });
  assert.equal(s.closes, 1);
  assert.equal(cleanLesson(JSON.parse(JSON.stringify(s))).closes, 1, 'the count travels in the lesson state');
  const d2 = decide(s, { turnIndex: 21, elapsedMin: 18.5, message: 'that a half is two quarters' });
  assert.equal(d2.closeStep, 'final');
  const b2 = turnBrief(s, d2, { skill: EQ, turnIndex: 21 }).join('\n');
  assert.match(b2, /Close as a teacher does, in three short sentences, then end_session \(no question\)/);
  assert.match(b2, /Now you can show two fractions that are the same amount, with a picture/);
  assert.match(b2, /Next time we will look at simplest form/);
  const r = recoverLines({ rule: 'close', closeStep: 'final', found: s.found, target: EQ });
  const text = r.lines.join(' ');
  for (const re of [CLOSE_SUMMARY, CLOSE_CAN_NOW, CLOSE_NEXT]) assert.match(text, re);
  assert.ok(!/\?/.test(text), 'no question after the summary');
  assert.equal(r.end.cmd, 'end_session');
});

test('silence by context: every situation passes on the simulated clock, and a thinking child waits twice as long', async () => {
  const { silenceChecks } = await import('../scripts/evals/pacing-replay.mjs');
  const { handOver, nextProbe } = await import('../src/voice-tutor/silence.js');
  const checks = silenceChecks();
  assert.equal(checks.length, 5);
  for (const c of checks) assert.ok(c.ok, `${c.id}: ${c.got}`);
  // After "umm..." alone the first nudge waits 16 s, not 8; a real reply ends it.
  const w = handOver(null, { doing: 'answer', now: 0, thinking: true });
  assert.equal(nextProbe(w, 9000), null);
  assert.equal(nextProbe(w, 16000)?.kind, 'answer_nudge');
  const w2 = handOver(w, { doing: 'answer', now: 0, thinking: false });
  assert.equal(nextProbe(w2, 8000)?.kind, 'answer_nudge');
  // A probe's own hand-over keeps it.
  assert.equal(handOver(w, { doing: 'answer', probe: true, now: 1 }).thinking, true);
});
