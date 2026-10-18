// ============================================================================
// SAFEGUARDING SCREEN
//
// src/ai/safeguarding.js decides when a child's writing needs a person to read
// it. It is tested from both sides, and the SECOND side is the one that keeps
// it useful:
//
//   MUST CATCH    — a disclosure that reaches no one is the whole failure.
//
//   MUST NOT CATCH — children write about canings, funerals, fights, war and
//   failing exams, constantly and innocently. A screen that fires on those
//   buries the real ones in noise until nobody reads the alerts, which turns a
//   precision problem into a missed child. Every case below is a sentence a
//   Kenyan primary pupil plausibly writes.
//
// Offline and deterministic. No model is called.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { screen, assess, CHILD_HELPLINE } from '../src/ai/safeguarding.js';

const tierOf = (s) => screen(s).tier;

// ---- must catch: crisis ---------------------------------------------------

test('a plain statement of wanting to die is crisis', () => {
  for (const s of [
    'Sometimes I want to die.',
    'I do not want to live anymore.',
    'I think about killing myself at night.',
    'Everyone would be happier without me.',
  ]) assert.equal(tierOf(s), 'crisis', s);
});

test('a deliberate act of self-harm is crisis', () => {
  assert.equal(tierOf('I cut my wrists last week.'), 'crisis');
  assert.equal(tierOf('I took all the tablets in the cupboard.'), 'crisis');
  assert.equal(tierOf('I cut myself on purpose when I am sad.'), 'crisis');
});

test('Kiswahili self-harm is caught without translation', () => {
  assert.equal(tierOf('Mimi nataka kufa.'), 'crisis', 'nataka kufa');
  assert.equal(tierOf('Nilifikiria kujiua.'), 'crisis', 'kujiua');
  assert.equal(tierOf('Sitaki kuishi tena.'), 'crisis', 'sitaki kuishi');
});

test('a threat to the child’s life is crisis', () => {
  assert.equal(tierOf('My stepfather said he will kill me if I tell anyone.'), 'crisis');
});

// ---- must catch: concern --------------------------------------------------

test('sexual abuse is caught in both languages', () => {
  assert.equal(tierOf('My uncle touched my private parts and I was scared.'), 'concern');
  assert.equal(tierOf('Alinifuata na amenibaka.'), 'concern', 'amenibaka');
});

test('grooming language is caught', () => {
  assert.equal(tierOf('He told me not to tell my mother because it is our secret.'), 'concern');
  assert.equal(tierOf('Alisema usimwambie mama.'), 'concern', 'usimwambie mama');
});

test('violence by someone at home is caught on its own', () => {
  assert.equal(tierOf('My father beats me when he comes home.'), 'concern');
  assert.equal(tierOf('Baba ananipiga kila siku.'), 'concern', 'ananipiga');
});

test('neglect is caught', () => {
  assert.equal(tierOf('We have no food at home and I have not eaten for three days.'), 'concern');
  assert.equal(tierOf('Sijala kwa siku mbili.'), 'concern', 'sijala');
});

// ---- the hard half: must NOT catch ---------------------------------------

test('an ordinary report of caning does not fire', () => {
  // Unlawful, still commonplace, and written about constantly. Flagging every
  // one of these would drown the disclosures that matter.
  for (const s of [
    'The teacher caned us for coming late to school.',
    'I was caned because I forgot my homework.',
    'We were caned and then we went back to class.',
  ]) assert.equal(tierOf(s), 'none', s);
});

test('caning WITH injury or repetition does fire', () => {
  assert.equal(
    tierOf('The teacher caned me until my hands were bleeding.'), 'concern',
    'corroborated by injury',
  );
  assert.equal(
    tierOf('The teacher beats me every day and I am scared to go home.'), 'concern',
    'corroborated by repetition',
  );
});

test('exam hyperbole about being killed does not fire', () => {
  // The commonest sentence in Kenyan exam-season writing.
  for (const s of [
    'If I fail this exam my mother will kill me.',
    'When I fail, my father will kill me.',
    'My mother will kill me if she sees my results.',
  ]) assert.equal(tierOf(s), 'none', s);
});

test('accidents are not self-harm', () => {
  // "I hurt myself" is how a child writes about falling over.
  for (const s of [
    'I fell down from the tree and hurt myself.',
    'I burnt myself on the jiko while helping my mother cook.',
    'I scratched myself on the wire fence.',
    'I cut myself with a knife when I was peeling potatoes.',
  ]) assert.equal(tierOf(s), 'none', s);
});

test('grief, fiction and violence at a distance do not fire', () => {
  for (const s of [
    'My grandmother died last year and I was very sad at the funeral.',
    'In the story the boy wanted to kill the dragon and save the village.',
    'The lion killed the goat and dragged it into the bushes.',
    'The soldiers killed many people during the war.',
    'My father beat the drum at the ceremony.',
    'We were beaten by the rain on the way home.',
    'I was so hungry because I had not eaten breakfast.',
  ]) assert.equal(tierOf(s), 'none', s);
});

test('a whole innocent composition stays clean', () => {
  const piece = `Last holiday I travelled to the village to see my grandmother.
    We woke up early and my mother cooked chapati. On the way the bus broke down
    and we waited for two hours in the sun. I was tired and hungry. When we
    arrived my cousins were playing football and I joined them. I fell down and
    hurt myself but I did not cry. In the evening my grandmother told us stories
    about the war and how soldiers killed many people long ago. It was the best
    holiday I have ever had.`;
  assert.equal(screen(piece).tier, 'none');
});

// ---- the shape of the result ---------------------------------------------

test('the result names the category and quotes only a short window', () => {
  const r = screen('I am fine at school but at home my father beats me every night.');
  assert.equal(r.tier, 'concern');
  assert.deepEqual(r.categories, ['physical-abuse']);
  assert.ok(r.hits[0].excerpt.length <= 220, 'excerpt is bounded, not the whole piece');
  assert.match(r.hits[0].excerpt, /beats me/);
});

test('empty and junk input are safe', () => {
  for (const s of ['', null, undefined, '   ', '....']) {
    assert.equal(screen(s).tier, 'none', JSON.stringify(s));
  }
});

// ---- assess(): the rule and the model are independent signals -------------

test('either the rule or the model is enough to raise an event', () => {
  const ruleOnly = assess({ text: 'I want to die.', modelFlagged: false });
  assert.equal(ruleOnly.flagged, true);
  assert.equal(ruleOnly.tier, 'crisis');
  assert.equal(ruleOnly.source, 'rule');

  // The model sees nuance no regex will. A flag with no pattern match still
  // reaches a person — at concern urgency, since the rule sets crisis.
  const modelOnly = assess({
    text: 'Nothing here matches a pattern.', modelFlagged: true, modelNote: 'tone of despair throughout',
  });
  assert.equal(modelOnly.flagged, true);
  assert.equal(modelOnly.tier, 'concern');
  assert.equal(modelOnly.source, 'model');
  assert.equal(modelOnly.modelNote, 'tone of despair throughout');

  const both = assess({ text: 'I want to die.', modelFlagged: true });
  assert.equal(both.source, 'both');
  assert.equal(both.tier, 'crisis', 'the rule still sets the urgency');

  const neither = assess({ text: 'I went to the shop.', modelFlagged: false });
  assert.equal(neither.flagged, false);
  assert.equal(neither.tier, 'none');
});

test('the helpline is Kenya’s national child line', () => {
  // Verified: 116 is free, 24/7, run with the Department of Children's
  // Services. It goes to the reviewer's notification, never to the child.
  assert.equal(CHILD_HELPLINE.phone, '116');
  assert.equal(CHILD_HELPLINE.country, 'KE');
});
