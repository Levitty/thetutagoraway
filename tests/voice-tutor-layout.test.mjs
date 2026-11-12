// ============================================================================
// THE LESSON ROOM: which arrangement fits the window, the square board,
// and what each caption holds. No log on the child's screen.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { roomShape, tutorBubble, childBubble, partLabel } from '../src/voice-tutor/layout.js';
import { MAX_HEIGHT, validateSnapshot } from '../src/voice-tutor/snapshot.js';

test('a laptop has the side column, an upright phone rearranges, a phone on its side keeps the column in miniature', () => {
  assert.equal(roomShape(1280, 800).wide, true);
  assert.equal(roomShape(1440, 900).side, 340);
  assert.equal(roomShape(390, 844).wide, false);
  assert.equal(roomShape(360, 640).side, 0);
  assert.deepEqual(roomShape(844, 390), { wide: true, side: 260, boardH: 1000 });
});

test('the board is the same square page on every screen, within what a picture of it may be', () => {
  for (const [w, h] of [[1280, 800], [1440, 900], [1024, 600], [390, 844], [360, 640], [320, 568], [768, 1024], [3000, 600]]) {
    const { boardH } = roomShape(w, h);
    assert.equal(boardH, 1000, `${w}x${h}`);
    assert.ok(boardH <= MAX_HEIGHT);
  }
});

test('a picture of the tallest board is a valid snapshot', () => {
  const r = validateSnapshot({ id: 'snap-1', media: 'image/jpeg', data: '/9j/AAAA', w: 1000, h: MAX_HEIGHT, reason: 'check' });
  assert.ok(!r.error, r.error);
});

const live = (sentences, shown) => ({
  sentences: sentences.map((text) => ({ text, words: text.split(' ').map((word) => ({ word })) })),
  words: shown,
});

test("HOREB's bubble holds the sentence being said, word by word, and the one before it", () => {
  const b = tutorBubble(live(['Count the eaten pieces with me.', 'One. Two.', 'Now you carry on counting.'], [6, 2, 3]), []);
  assert.deepEqual(b.words, ['Now', 'you', 'carry', 'on', 'counting.']);
  assert.equal(b.shown, 3);
  assert.equal(b.before, 'One. Two.');
  const first = tutorBubble(live(['Here is a chapati.', 'Cut into four.'], [2, 0]), []);
  assert.equal(first.before, null);
  assert.equal(first.shown, 2);
});

test('between turns the bubble keeps the last thing HOREB said, never a log', () => {
  const log = [
    { who: 'tutor', text: 'Hello.', turn: 1 },
    { who: 'child', text: 'Hi', turn: 1 },
    { who: 'tutor', text: 'Now you carry on counting.', turn: 2 },
    { who: 'tutor', text: 'What fraction of the chapati was eaten?', turn: 2 },
  ];
  const b = tutorBubble(null, log);
  assert.equal(b.words.join(' '), 'What fraction of the chapati was eaten?');
  assert.equal(b.shown, b.words.length);
  assert.equal(b.before, 'Now you carry on counting.');
  // A child's words in between: the earlier line is not shown above.
  assert.equal(tutorBubble(null, log.slice(0, 3)).before, null);
  assert.equal(tutorBubble(null, []), null);
});

test("the child's bubble: their words while they speak, then what they said, else how to answer", () => {
  assert.deepEqual(childBubble({ listening: true, partial: 'three' }), { kind: 'heard', text: 'three' });
  assert.equal(childBubble({ listening: true }).text, 'Listening...');
  const said = childBubble({ transcript: [{ who: 'tutor', text: 'What?' }, { who: 'child', text: 'three quarters' }], status: 'thinking' });
  assert.equal(said.kind, 'said');
  assert.equal(said.text, 'three quarters');
  const hint = childBubble({ transcript: [{ who: 'tutor', text: 'What fraction?' }], ask: { form: 'fraction' }, status: 'listening' });
  assert.equal(hint.kind, 'hint');
  assert.match(hint.text, /Say your answer/);
  assert.match(childBubble({ transcript: [{ who: 'tutor', text: 'x' }], status: 'listening', canTalk: false }).text, /Type your answer/);
  // While HOREB speaks: their last words stay, or nothing at all (no standing instructions).
  assert.equal(childBubble({ transcript: [{ who: 'tutor', text: 'x' }], status: 'speaking' }), null);
  assert.equal(childBubble({ transcript: [{ who: 'child', text: 'half' }, { who: 'tutor', text: 'Yes.' }], status: 'speaking' }).text, 'half');
  assert.equal(childBubble({ status: 'ready' }), null);
});

test('progress reads as a part of the lesson, in words a child knows', () => {
  assert.equal(partLabel('guided'), 'Together, part 3 of 5');
  assert.equal(partLabel('warmup'), 'Warm-up, part 1 of 5');
  assert.equal(partLabel('teach'), 'Learn, part 2 of 5');
  assert.equal(partLabel(null), null);
});
