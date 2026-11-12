// ============================================================================
// REGRESSIONS FROM THE PAID RUN 2026-11-12-1824 (Tutagora/Build/voice-tutor/evals/runs/2026-11-12-1824), each one the
// exact situation from a transcript, played through the live turn with a fake model. In that run our own layers fought
// the model: the gate dropped steps and played fallback lines about things not on the board, "um..." locked the tutor in
// nudge loops, tentative right answers were classed as guesses, "too" and "tree" were read as questions, and a choice
// question sealed "me" as its answer. The rule now: the code never makes a turn worse than the model's own.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runTutorTurn, recoverLines, boardFacts } from '../src/voice-tutor/tutorTurn.js';
import { settingsFrom } from '../src/voice-tutor/session.js';
import { screen } from '../src/ai/safeguarding.js';
import { cleanLesson, updateLesson, decide } from '../src/voice-tutor/orchestrator.js';
import { hearNumbers, childMove } from '../src/voice-tutor/spokenAnswer.js';
import { validateTurn, sealable, describeItem } from '../src/voice-tutor/commands.js';

const F = 'MATH.G5.NUMBER.FRACTIONS.';
const LIB = Object.fromEntries(Object.entries(JSON.parse(readFileSync(new URL('../engine/data/curriculum/g5.misconceptions.json', import.meta.url), 'utf8'))).filter(([k]) => k.startsWith(F)));
const SECRET = 'test-secret-that-is-long-enough';
const USER = { id: 'u-parent', email: 'tester@example.com' };
const SID = '0b7e4d3c-1111-4222-8333-944455556666';
const NOW = 1_800_000_000_000;
const settings = settingsFrom((k) => ({ VOICE_TUTOR_ENABLED: '1', VOICE_TUTOR_ALLOWLIST: 'tester@example.com' }[k]));
const world = () => ({ usage: [], evidence: [], async getChild() { return null; }, async getProgress() { return { skills: {} }; }, async spend() { return { session: 0, day: 0 }; }, async recordUsage(r) { this.usage.push(r); }, async recordConcern() {}, async recordEvidence(r) { this.evidence.push(r); } });
const turnReply = (steps) => ({ usage: { input_tokens: 4000, output_tokens: 600 }, text: JSON.stringify({ steps }) });
const rewriteReply = (text) => ({ usage: { input_tokens: 400, output_tokens: 40 }, text: JSON.stringify({ text }) });
const model = (...replies) => {
  const calls = [];
  const fn = async (req, { onText } = {}) => {
    calls.push(req);
    const r = replies[Math.min(calls.length - 1, replies.length - 1)];
    for (let i = 0; i < r.text.length; i += 13) onText?.(r.text.slice(i, i + 13));
    return { usage: r.usage, stop_reason: 'end_turn' };
  };
  fn.calls = calls;
  return fn;
};
const say = (text, move) => ({ cmd: 'say', text, ...(move ? { move } : {}) });
const HAND = { cmd: 'pause_for_child', expect: 'any', max_wait_s: 30, doing: 'answer' };
const lesson = (o = {}) => ({ v: 1, stage: 'warmup', doing: 'answer', turns: 5, ...o });
const turn = (o = {}) => runTutorTurn({ user: USER, settings, lib: LIB, secret: SECRET, safeguard: screen, now: NOW, db: o.db || world(), callModel: o.callModel, body: { session_id: SID, turn_index: 5, board: [], history: [], ...o.body } });
const texts = (r) => r.body.steps.filter((x) => x.cmd === 'say').map((x) => x.text);
const UNCUT = [{ id: 'title', cmd: 'write_text', text: 'Today: fractions that are the same amount', slot: 'top' }, { id: 'c1', cmd: 'shape', kind: 'circle', parts: 1, shaded: 0, slot: 'middle' }];
const HALVES = [{ id: 'title', cmd: 'write_text', text: 'Today: fractions that are the same amount', slot: 'top' }, { id: 'ch1', cmd: 'shape', kind: 'circle', parts: 2, shaded: 0, slot: 'middle' }];
// A lesson where the child has said almost nothing (the overtalk check would have fired).
const QUIET = { cw: 4, tw: 200, lastCw: 0 };

// ---------------------------------------------------------------- 1. the gate
test('1824 scenario 17 turn 7: a turn over twice the child\'s reply plus 15 is no longer rewritten or dropped (overtalk is a yardstick measure only)', async () => {
  const words = 'Maybe is fine, you are thinking. Let me draw a round chapati for us, right here on the board. Look at it closely now.';
  const callModel = model(turnReply([say(words, 'Smaller-question hint'), { cmd: 'shape', id: 's1', kind: 'circle', parts: 1, shaded: 0, slot: 'middle', on: 'round chapati' }, say('Where would you cut it to share?', 'Smaller-question hint'), HAND]));
  const r = await turn({ callModel, body: { message: 'maybe Umm', lesson: lesson(QUIET) } });
  assert.equal(callModel.calls.length, 1, 'no rewrite call');
  assert.deepEqual(texts(r), [words, 'Where would you cut it to share?']);
  assert.ok(!r.body.guard.includes('gate-dropped'));
  assert.doesNotMatch(r.body.tester.kept.join(' '), /overtalk/);
});

test('1824 scenario 6 turn 12: a repeat and stock opener whose rewrite fails too is kept (the better of the two), never replaced by a fallback', async () => {
  const history = [{ who: 'tutor', text: 'That is okay. Let us make it easier. Did you ever share food with someone, yes or no?', turn: 3 }, { who: 'child', text: 'I think' }, { who: 'tutor', text: 'That is okay. Say you share one chapati fairly with a friend.', turn: 4 }];
  const callModel = model(
    turnReply([say('That is okay. Here is one whole chapati.', 'Smaller-question hint'), say('Where would you cut it to share it fairly?', 'Smaller-question hint'), HAND]),
    rewriteReply('That is okay. Here is one whole chapati.'),
  );
  const r = await turn({ callModel, body: { probe: { kind: 'answer_smaller', silent_s: 23 }, history, board: UNCUT, lesson: lesson(QUIET) } });
  assert.deepEqual(r.body.dropped, []);
  assert.ok(!r.body.guard.includes('gate-dropped') && !r.body.guard.includes('invalid-turn'), r.body.guard.join(' '));
  assert.deepEqual(texts(r), ['That is okay. Here is one whole chapati.', 'Where would you cut it to share it fairly?']);
  assert.doesNotMatch(texts(r).join(' '), /shaded/);
  // Since run 2026-11-12-1900 (P5) a short kind line said again and a stock opener are noted, not rewritten at all.
  assert.equal(callModel.calls.length, 1, 'no rewrite call');
  assert.match(r.body.tester.kept.join(' '), /gate: noted, not rewritten \(stock/);
});

// ---------------------------------------------------------------- 2. fallback lines from the board's truth
test('1824 scenarios 6, 14, 17 and 30: when the code must speak, it says only what is true of the board ("Which part is shaded?" is gone)', async () => {
  // The model hands back with nothing said (an invalid turn): the code speaks, from the board.
  const empty = () => model(turnReply([HAND]));
  for (const [board, want] of [[UNCUT, /whole/], [HALVES, /one part of the circle/]]) {
    const r = await turn({ callModel: empty(), body: { probe: { kind: 'answer_smaller', silent_s: 22 }, board, lesson: lesson() } });
    const said = texts(r).join(' ');
    assert.match(said, want, said);
    assert.doesNotMatch(said, /shaded part|which part is shaded|the half|the pieces/i, said);
    assert.match(said, /\?\s*$/);
  }
  // Every rule's recovery, on an uncut circle and on an unshaded one: never shading, never a half or pieces that are not there.
  for (const board of [UNCUT, HALVES]) {
    for (const rule of ['stage', 'lost', 'question', 'care-return', 'reteach', 'prerequisite', null]) {
      for (const probe of [null, { kind: 'answer_nudge' }, { kind: 'answer_smaller' }, { kind: 'task_checkin' }]) {
        const t = recoverLines({ rule, probe, board, message: 'um', lastQuestion: null }).lines.join(' ');
        assert.doesNotMatch(t, /(?<!none )\b(is|are) shaded\b|which part is shaded|look at the half|the shaded/i, `${rule} ${probe?.kind} ${t}`);
        if (board === UNCUT) assert.doesNotMatch(t, /\bpieces? (on|in) the\b|\bthe (two )?halves\b|cut in(to)? (two|halves)/i, `${rule} ${probe?.kind} ${t}`);
      }
    }
  }
  // Nothing drawn: no board words at all, the open question only.
  assert.deepEqual(recoverLines({ rule: 'stage', board: [], lastQuestion: 'How would you share one chapati between two children?' }).lines, ['How would you share one chapati between two children?']);
  // The board model the lines are built from.
  assert.deepEqual(boardFacts(UNCUT), { id: 'c1', name: 'circle', parts: 1, shaded: 0 });
  assert.deepEqual(boardFacts([{ id: 'f', cmd: 'figure', type: 'fraction', params: { shape: 'bar', parts: 4, shaded: 1 } }]), { id: 'f', name: 'bar', parts: 4, shaded: 1 });
  // A count is never said when the question asks for it.
  assert.doesNotMatch(recoverLines({ rule: 'stage', board: HALVES, openPrompt: 'How many pieces is it cut into?' }).lines.join(' '), /two/);
  assert.match(recoverLines({ rule: 'stage', board: HALVES, lastQuestion: 'Are the pieces the same size?' }).lines.join(' '), /cut into two parts, and none is shaded yet/);
  // The tutor is told a one-part figure is whole, not "1 equal parts".
  assert.equal(describeItem(UNCUT[1]), 'c1: a whole circle at middle, not cut into parts, nothing shaded');
});

test('1824 scenario 30 turn 37: a question rule recovery never says "You asked tree"', () => {
  for (const message of ['Umm, tree?', 'too?', 'why?']) assert.doesNotMatch(recoverLines({ rule: 'question', message, board: HALVES }).lines.join(' '), /you asked/i);
});

// ---------------------------------------------------------------- 3. fillers alone
test('1824 scenario 6 turns 5 to 22: "um..." alone is not a turn: no model call, a quiet hand-back; one "Take your time" after two, never a loop', async () => {
  const callModel = model(turnReply([say('Mm, I hear you thinking. What do you notice about the pieces on the board?', 'Wait and nudge'), HAND]));
  const history = [{ who: 'tutor', text: 'Look at the chapati. Where would you cut it?', turn: 4 }];
  const r1 = await turn({ callModel, body: { message: 'um...', history, board: UNCUT, lesson: lesson() } });
  assert.equal(callModel.calls.length, 0, 'no model call for a filler');
  assert.deepEqual(r1.body.steps.map((x) => x.cmd), ['pause_for_child']);
  assert.equal(r1.body.steps[0].doing, 'answer');
  assert.equal(r1.body.lesson.fillers, 1);
  const r2 = await turn({ callModel, body: { message: 'Umm', history, board: UNCUT, lesson: r1.body.lesson } });
  assert.deepEqual(texts(r2), ['Take your time.']);
  assert.equal(r2.body.lesson.tyt, true);
  const said = [];
  let l = r2.body.lesson;
  for (const m of ['um...', 'ehh', 'so', 'aah', 'um...']) { const r = await turn({ callModel, body: { message: m, history, board: UNCUT, lesson: l } }); said.push(...texts(r)); l = r.body.lesson; }
  assert.deepEqual(said, [], 'at most one "Take your time" until the child says something');
  assert.equal(callModel.calls.length, 0);
  // Content starts the count again, and goes to the model.
  const r3 = await turn({ callModel, body: { message: 'in the middle', history, board: UNCUT, lesson: l } });
  assert.equal(callModel.calls.length, 1);
  assert.equal(r3.body.lesson.fillers, 0);
  assert.equal(r3.body.lesson.tyt, false);
  // A filler keeps the open question's seal, the diagnosing flag and the probe flag.
  const kept = updateLesson(cleanLesson(lesson({ diagnosing: true, lastProbe: true })), { decision: decide(cleanLesson(lesson()), { turnIndex: 5, message: 'um' }), steps: [HAND], childWords: 1 });
  assert.deepEqual([kept.diagnosing, kept.lastProbe, kept.explain], [true, true, 0]);
});

// ---------------------------------------------------------------- 4. the pace state for the silences
test('1824 scenario 17: a right answer that came slowly (after a probe, or a long think) sets the slow pace; a wrong answer ends it', () => {
  const press = { rule: 'press' };
  const right = { ask: 'q1', correct: true, answer: 'one half', said: 'one half' };
  const s0 = cleanLesson(lesson({ lastProbe: true }));
  assert.equal(updateLesson(s0, { decision: press, marked: right, judged: { class: 'right_unexplained' }, childWords: 2 }).slow, true);
  assert.equal(updateLesson(cleanLesson(lesson()), { decision: press, marked: right, judged: { class: 'right_unexplained' }, childWords: 2, thinkS: 12 }).slow, true);
  assert.equal(updateLesson(cleanLesson(lesson()), { decision: press, marked: right, judged: { class: 'right_unexplained' }, childWords: 2, thinkS: 3 }).slow, false);
  assert.equal(updateLesson(cleanLesson(lesson({ slow: true })), { decision: { rule: 'diagnose' }, marked: { ...right, correct: false }, judged: { class: 'partly_right' }, childWords: 2 }).slow, false);
  // A probe turn marks the next reply as one that came after a silence.
  assert.equal(updateLesson(cleanLesson(lesson()), { decision: { rule: 'probe' }, probe: { kind: 'answer_nudge' }, steps: [say('Take your time.'), HAND] }).lastProbe, true);
});

// ---------------------------------------------------------------- 5. tentative answers and misheard numbers
test('1824 scenarios 1 and 17: a right answer said unsure ("Umm, one half?") is right_unexplained, never guess_or_no_attempt', async () => {
  const first = await turn({ callModel: model(turnReply([say('Say two children share one chapati fairly.', 'Revoice and build'), { cmd: 'ask', id: 'q_share', prompt: 'What is each child\'s share called?', form: 'word', expected: 'one half', accepts: ['half', '1/2'] }, HAND])), body: { message: 'yes', lesson: lesson() } });
  const ask = first.body.steps.find((x) => x.cmd === 'ask');
  assert.ok(ask.seal, 'a real value is sealed');
  const r = await turn({
    callModel: model(turnReply([{ cmd: 'assess', class: 'guess_or_no_attempt', evidence: 'Umm, one half? (unsure)' }, say('One half, you said.', 'Revoice and build'), say('What made you think of half?', 'Press for reasoning'), HAND])),
    body: { message: 'Umm, one half?', answer: { seal: ask.seal, response: 'Umm, one half?' }, lesson: first.body.lesson, history: [{ who: 'tutor', text: 'What is each child\'s share called?', turn: 5 }] },
  });
  assert.equal(r.body.marked.correct, true);
  assert.equal(r.body.marked.tentative, true);
  assert.equal(r.body.tester.judged.class, 'right_unexplained');
  assert.match(r.body.tester.judged.note, /said unsure/);
});

test('1824 scenario 30 turns 35 and 37: "too" and "tree" are read as numbers when a count is asked for, never as a question to the tutor', async () => {
  const history = [{ who: 'tutor', text: 'Look at the chapati. How many pieces is it cut into?', turn: 33 }];
  const callModel = model(turnReply([say('Two, you said.', 'Revoice and build'), say('How did you count them?', 'Press for reasoning'), HAND]));
  const r = await turn({ callModel, body: { message: 'Umm, too?', history, board: HALVES, lesson: lesson() } });
  assert.equal(r.body.tester.rule, 'tentative');
  assert.match(r.body.tester.heard, /"Umm, too\?" read as "Umm, two\?"/);
  assert.match(callModel.calls[0].messages.at(-1).content.map((c) => c.text || '').join(' '), /Umm, two\?/);
  // Turn 37 as it was: the counting question two tutor turns back, nudges since. The model fails the turn: the recovery
  // never says "You asked tree".
  const later = [...history, { who: 'child', text: 'Umm, too?' }, { who: 'tutor', text: 'You can say it your way. What do you see in the bar?', turn: 35 }, { who: 'child', text: 'um...' }, { who: 'tutor', text: 'Take your time. I am here. Look at the circle when you are ready.', turn: 36 }, { who: 'child', text: 'Umm, tree?' }];
  const r2 = await turn({ callModel: model(turnReply([HAND])), body: { message: 'Umm, tree?', history: later, board: HALVES, lesson: lesson() } });
  assert.equal(r2.body.tester.rule, 'tentative');
  assert.doesNotMatch(texts(r2).join(' '), /you asked|tree/i);
  // Not when no number is asked for, and never inside a sentence.
  assert.equal(hearNumbers('Umm, too?', { numberOpen: false }), 'Umm, too?');
  for (const t of ['I want to go', 'for two children', 'I ate it', 'can I go to drink']) assert.equal(hearNumbers(t), t);
  assert.deepEqual(['Umm, tree?', 'I think tree pieces', 'fore', 'ate.'].map((t) => hearNumbers(t)), ['Umm, three?', 'I think three pieces', 'four', 'eight.']);
  assert.equal(childMove(hearNumbers('Umm, too?')), 'tentative');
});

// ---------------------------------------------------------------- 6. what a question may seal
test('1824 scenario 1 turns 13 and 17: an offer ("shade it, or shall I?") is never sealed, so the child\'s right "Two" is not marked wrong against "me"', async () => {
  const first = await turn({
    callModel: model(turnReply([say('That is okay. I will point at the chapati.', 'Show then hand over'), { cmd: 'point', on: 'point', target: 'ch1', part: 1 }, { cmd: 'ask', id: 'q_shade_choice', prompt: 'Do you want to shade it, or shall I?', form: 'word', expected: 'me' }, HAND])),
    body: { message: 'I don\'t', board: HALVES, lesson: lesson() },
  });
  const ask = first.body.steps.find((x) => x.cmd === 'ask');
  assert.ok(ask, 'still asked');
  assert.equal(ask.seal, undefined, 'nothing sealed');
  assert.match(first.body.notes.join(' '), /"me" is not a value nor one of the question's own options/);
  const r = await turn({ callModel: model(turnReply([say('Two, you said.', 'Revoice and build'), say('What are you counting?', 'Press for reasoning'), HAND])), body: { message: 'Two', board: HALVES, lesson: first.body.lesson, history: [{ who: 'tutor', text: 'Do you want to shade it, or shall I?', turn: 5 }] } });
  assert.equal(r.body.marked, null);
  assert.notEqual(r.body.tester.rule, 'diagnose');
});

test('the seal validator: a question seals one of its own options or a real value, nothing else', () => {
  const yes = [['How many parts?', '2'], ['What fraction is shaded?', '1/2'], ['What is each share called?', 'one half'], ['Are they the same size?', 'yes'], ['Which is bigger?', 'the top one'], ['Is it bigger or smaller?', 'smaller'], ['Who gets more, Asha or Baraka?', 'Asha'], ['What is the top number called?', 'numerator'], ['Is two quarters the same as one half?', 'same']];
  const no = [['Do you want to shade it, or shall I?', 'me'], ['Do you want to try?', 'yes'], ['Shall I cut it for you?', 'yes'], ['What is your name?', 'Wanjiru'], ['Who should shade it, you or me?', 'you'], ['What do you think?', 'it is nice']];
  for (const [p, e] of yes) assert.equal(sealable(p, e), true, `${p} -> ${e}`);
  for (const [p, e] of no) assert.equal(sealable(p, e), false, `${p} -> ${e}`);
  // Through the validator: an offer keeps its question but loses the answer; a choice must still seal one of its choices.
  const v = validateTurn({ steps: [say('x'), { cmd: 'ask', id: 'q', prompt: 'Shall I shade it, or will you?', form: 'choice', choices: ['you', 'me'], expected: 'me' }, HAND] }, { board: [] });
  assert.equal(v.steps[1].expected, undefined);
  const bad = validateTurn({ steps: [say('x'), { cmd: 'ask', id: 'q', prompt: 'Which is more?', form: 'choice', choices: ['1/2', '1/4'], expected: '3/4' }, HAND] }, { board: [] });
  assert.equal(bad.steps.find((x) => x.cmd === 'ask'), undefined);
});

// ---------------------------------------------------------------- 7. the free replay of the app's own layers
test('the free replay counts what the code did in a saved run: soft drops, fixed lines, board claims, fillers, misheard numbers, bad seals, early probes', async () => {
  const { parseTranscript } = await import('../scripts/evals/habits.mjs');
  const { replayAppLesson } = await import('../scripts/evals/app-replay.mjs');
  const { boardClaimOf } = await import('../src/voice-tutor/habits.js');
  const md = [
    '# Scenario 6: Very short answers only', '',
    '## Turn 1: opening | 1 s', '', 'HOREB {move: Open the lesson}: Hello. Have you ever shared a chapati?', '[hand over: child is now answer]', '',
    '## Turn 2: reply | 1 s', '', 'Child: "um..."', '', 'HOREB {move: Wait and nudge}: Mm, I hear you thinking. What do you notice about the pieces on the board?', '[hand over: child is now answer]', '',
    '## Turn 3: silence probe (answer_nudge, silent 6 s) | 1 s', '', '[shape {"on":"draw","id":"c1","kind":"circle","parts":1,"shaded":0,"slot":"middle"}]', 'HOREB {move: Wait and nudge}: Look at the half on the board.', '[hand over: child is now answer]', '',
    '## Turn 4: silence probe (answer_smaller, silent 23 s) | 1 s', '', 'HOREB: That is okay.', 'HOREB: Look at the circle. Which part is shaded?', '[hand over: child is now answer]',
    'Guard reasons: gate-dropped; invalid-turn. Dropped steps: gate: repeat: repeats "That is okay." word for word; overtalk: the turn is 22 words, over 15', '',
    '## Turn 5: reply | 1 s', '', 'Child: "um..."', '', 'HOREB {move: Smaller-question hint}: How many pieces is it cut into?', '[ask {"id":"q_shade_choice","prompt":"Do you want to shade it, or shall I?","form":"word"}]', '(Sealed answer to q_shade_choice: me: the tutor must never say it before the child finds it.)', '[hand over: child is now answer]', '',
    '## Turn 6: reply | 1 s', '', 'Child: "Umm, too?"', '', 'HOREB {move: Revoice and build}: You can say it your way.', '[hand over: child is now answer]', 'Teaching moves allowed by the app: Revoice and build; rule: question; reason: the child asked you a question', '',
  ].join('\n');
  const r = replayAppLesson(parseTranscript(md));
  assert.deepEqual([r.dropped, r.droppedSoft, r.fixed, r.fillers, r.fillerLines, r.misheard, r.misheardAsQuestion, r.badSeals.length, r.probes, r.earlyNudge, r.earlySmaller], [1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 0]);
  assert.deepEqual(r.claims.map((c) => [c.turn, c.code]), [[2, false], [3, false], [4, true]]);
  // The board claims, one by one.
  const U = [{ id: 'c1', cmd: 'shape', kind: 'circle', parts: 1, shaded: 0 }]; const H = [{ id: 'c', cmd: 'shape', kind: 'circle', parts: 2, shaded: 0 }];
  assert.match(boardClaimOf('Look at the circle. Which part is shaded?', H), /shading that is not on the board/);
  assert.match(boardClaimOf('What do you see in the bar?', H), /a bar that is not on the board/);
  for (const [t, b] of [['Sorry, nothing is shaded yet.', H], ['Where would you cut it to share?', U], ['Is the chapati whole, or cut into pieces?', U], ['The circle is cut into two parts, and none is shaded yet.', H], ['What does each child get from the chapati?', []]]) assert.equal(boardClaimOf(t, b), null, t);
});

test('the code never repeats a question that points at something not on the board', () => {
  assert.deepEqual(recoverLines({ rule: 'stage', board: HALVES, lastQuestion: 'What do you see in the bar?' }).lines, ['The circle is cut into two parts, and none is shaded yet.', 'What do you think?']);
  assert.deepEqual(recoverLines({ probe: { kind: 'answer_nudge' }, turnIndex: 0, board: UNCUT, lastQuestion: 'Look at the half on the board. What do you notice?' }).lines, ['Take your time.', 'What do you think?']);
});
