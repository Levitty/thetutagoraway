// ============================================================================
// THE CHILD'S SPOKEN ANSWER (src/voice-tutor/spokenAnswer.js). The first test-set run (12 Nov 2026) had about
// 98 right answers marked wrong because the seal marked the child's whole sentence as typed text.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readAnswer, markSpoken, canonAnswer, childMove, wantsToStop, wantsToCarryOn, speakAnswer, inWords } from '../src/voice-tutor/spokenAnswer.js';
import { fixMathsWords } from '../src/voice-tutor/childVoice.js';

const EQ = 'MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS';
const item = (answer, question = 'What fraction is it?', o = {}) => ({ kind: 'typed', cskill: EQ, question, answer, accepts: [answer], wrong: [], ...o });
const mark = (answer, said, question, o) => markSpoken(item(answer, question, o), said);
const right = (answer, said, question) => { const r = mark(answer, said, question); assert.equal(r.correct, true, `"${said}" for ${answer}: ${r.why}`); return r; };
const wrong = (answer, said, question) => { const r = mark(answer, said, question); assert.deepEqual([r.correct, r.attempt], [false, true], `"${said}" for ${answer} should be wrong: ${r.why}`); return r; };
const noTry = (answer, said, question) => { const r = mark(answer, said, question); assert.deepEqual([r.correct, r.attempt], [false, false], `"${said}" for ${answer} is not an answer: ${r.why}`); return r; };

test('fractions in words: one half, a half, nusu, two quarters, four eighths, two over four, out of', () => {
  for (const said of ['one half', 'One half!', 'a half', 'half', 'It is one half.', 'Nusu! One half.', 'nusu', '1/2', '1 / 2', 'one over two', 'one out of two', 'One piece out of two.', 'One half. Because he got one part and there are two parts.', 'Hmm... wait, let me think. It is one half.', 'Each of us gets one half.', 'Each one gets half', 'two quarters', 'four eighths', 'two over four', 'three sixths', 'won have.', 'one harf']) right('1/2', said);
  for (const said of ['two quarters', 'two over four', 'two fourths', '2/4', 'two out of four']) right('2/4', said);
  right('4/8', 'four eighths'); right('4/8', 'four eights');
  right('3/4', 'three quarters'); right('3/4', 'robo tatu');
  right('1/4', 'a quarter'); right('1/4', 'robo'); right('1/4', 'one fourth');
  right('5/10', 'Five tenths'); right('1/3', 'One third is bigger, because the pieces are bigger.');
  // The key may itself be in words.
  right('one half', 'Nusu! One half.'); right('one half', '1/2');
  wrong('1/2', 'one quarter'); wrong('1/2', 'two halves'); wrong('3/4', 'three eighths');
});

test('numbers in words and in sentences, and counts of pieces ("two quarters" for "how many quarters?")', () => {
  for (const said of ['four', 'Four pieces!', 'Four pieces. Two times two is four.', '4', 'There are 4 equal pieces now.', 'Three, four! Four pieces, ndiyo.', 'nne', 'Maybe four pieces?', 'Now there are four pieces?', 'is it four?']) right('4', said, 'How many pieces are there now?');
  right('2', 'Two quarters', 'How many quarters make a half?');
  right('2', 'I think two pieces make one half', 'How many pieces make one half?');
  right('9', 'Nine twelfths!', 'How many twelfths?');
  right('3', 'Three pieces, because three is half of six', 'How many pieces are shaded?');
  right('8', 'Eight?', 'How many pieces now?');
  right('12', 'twelve', 'How many?'); right('24', 'twenty four', 'How many?');
  wrong('4', 'three', 'How many pieces?');
  wrong('4', 'I counted six pieces', 'How many pieces?');
  wrong('4', 'not four, five', 'How many pieces?');
});

test('a wrong spoken answer still names the misconception it reveals', () => {
  const it = item('2', '1/3 = ?/6', { wrong: [{ value: '4', mis: `${EQ}.M_EQUIV_ADDITIVE` }] });
  assert.deepEqual([markSpoken(it, 'four sixths').correct, markSpoken(it, 'I think it is four').mis], [false, `${EQ}.M_EQUIV_ADDITIVE`]);
  assert.equal(markSpoken(it, '4').mis, `${EQ}.M_EQUIV_ADDITIVE`);
});

test('word answers, and yes or no', () => {
  right('the same', 'The same amount, I think'); right('same', 'The same. Two quarters is the same as one half.');
  right('same', 'They are equal');
  wrong('same', 'they are not the same');
  right('smaller', 'Smaller, because there will be more pieces.'); right('more', 'More!');
  right('the top one', 'the top one is longer');
  right('yes', 'Yes, they look the same size to me.', 'Do they look the same size?');
  right('yes', 'They look the same size', 'Are they the same size?');
  right('yes', 'ndiyo'); right('No', "Hmm, I don't think so. Two times two is four, not six.", 'Is 2/3 the same as 4/6?');
  right('No', 'hapana');
  wrong('yes', 'no');
  // "Is 4/8 the same as 1/2?" with the key "same": a yes is the key.
  right('same', 'yes', 'Is four eighths the same as one half?');
  wrong('same', 'no', 'Is four eighths the same as one half?');
});

test('a question back, a filler, "I don\'t know" or "say it again" is not an answer: never marked wrong', () => {
  for (const said of ['umm...', 'Umm, let me think', 'hmm', 'is it three?', 'Wait, why do you cut each piece again?', 'But nothing is shaded on the board. How can I tell if it is the same?', 'Can I see it again?', 'I did not hear a question', "I don't know", 'sijui', 'A half? Or is it a whole?', 'Is it two or four?']) noTry('4', said, 'How many pieces are there now?');
  noTry('the same', 'Is it bigger or the same?');
  noTry('1/2', '');
  // A statement with no number in it, for a number answer: not answered yet. With a number: an answer.
  noTry('1/2', 'I would cut it in the middle');
  wrong('1/2', 'I would cut it into three');
});

test('choices said aloud', () => {
  const ch = { kind: 'choice', cskill: EQ, question: 'Which is the same as 1/2?', answer: '2/4', options: [{ key: 'A', text: '2/4', right: true }, { key: 'B', text: '2/3', right: false, mis: `${EQ}.M_EQUIV_ADDITIVE` }] };
  assert.equal(markSpoken(ch, 'A').correct, true);
  assert.equal(markSpoken(ch, 'two quarters').correct, true);
  assert.equal(markSpoken(ch, 'I think two thirds').mis, `${EQ}.M_EQUIV_ADDITIVE`);
});

test('reading the words: what was said back, one form for an answer, what a message is doing', () => {
  assert.equal(right('1/2', 'Nusu! One half.').said, 'nusu');
  assert.equal(speakAnswer('1/2'), 'one half');
  assert.equal(speakAnswer('Four pieces'), 'four pieces');
  assert.equal(speakAnswer('yes'), null, 'never "Yes, yes."');
  assert.equal(right('the same', 'The same amount, I think').said, 'the same');
  assert.equal(right('4', 'Four pieces!', 'How many pieces?').said, 'four pieces');
  assert.deepEqual(['1/2', '3/4', '2/4', '4', '12', '7/100'].map(inWords), ['one half', 'three quarters', 'two quarters', 'four', 'twelve', null]);
  assert.deepEqual(['one half', '1/2', 'a half', 'Four', '4', 'the same', 'Same'].map(canonAnswer), ['1/2', '1/2', '1/2', '4', '4', 'same', 'same']);
  assert.deepEqual(readAnswer('two quarters').found.map((f) => [f.value, f.kind]), [['2/4', 'fraction'], ['2', 'count']]);
  assert.equal(childMove('umm'), 'filler');
  assert.equal(childMove('why?'), 'question');
  assert.equal(childMove('I dont know'), 'lost');
  assert.equal(childMove('four'), null);
  for (const t of ['I want to stop', 'this is boring', "I'm bored", 'can we stop now', 'I am tired', 'nataka kucheza']) assert.equal(wantsToStop(t), true, t);
  for (const t of ['stop cutting it', 'the bus stop', 'four', 'can we play the guessing game?', 'I want to play the game']) assert.equal(wantsToStop(t), false, t);
  assert.equal(wantsToCarryOn('ok, I want to carry on'), true);
  assert.equal(wantsToCarryOn('I want to stop'), false);
  assert.equal(fixMathsWords('won have'), 'one half');
});
