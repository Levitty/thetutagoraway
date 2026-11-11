// ============================================================================
// THE FIVE STATES (11 Nov 2026, src/learner/mastery.js).
// What must hold: each state from its written rule, at its boundaries; help counts
// toward emerging only; the newest 10 marks decide; mastered needs medium or hard
// items (or 8 unaided marks when difficulty is not recorded) and a re-check 14+ days
// later; failed and overdue re-checks; roll-up is worst-of; reasons are plain words.
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { skillState, learnerMastery, rollUp, RULES, STATE_WORDS, labelFromCode, substrandFromCode } from '../src/learner/mastery.js';

const NOW = Date.parse('2026-11-11T12:00:00Z');
const D = 86400000;
const SK = 'MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS';
let n = 0;
/** One mark `days` days before NOW. */
const mk = (days, o = {}) => ({
  id: `r${++n}`, cskill: SK, correct: true, independent: true, hints_used: 0, difficulty: null, source: 'practice',
  created_at: new Date(NOW - days * D).toISOString(), ...o,
});
const wrong = (days, o = {}) => mk(days, { correct: false, ...o });
const plainWords = (s) => {
  assert.ok(s.reason.endsWith('.'), s.reason);
  assert.equal((s.reason.match(/[.!?](\s|$)/g) || []).length, 1, `one sentence: ${s.reason}`);
  assert.doesNotMatch(s.reason, /undefined|null|NaN|\[object|_|independent|hints_used|=>/i, s.reason);
  assert.ok(s.reason.length < 330, s.reason);
};

// ---------------------------------------------------------------- the five states
test('no evidence is not yet assessed', () => {
  const s = skillState([], { now: NOW });
  assert.equal(s.state, 'not_assessed'); assert.equal(s.word, 'Not yet assessed'); assert.deepEqual(s.evidenceIds, []); plainWords(s);
});

test('fewer than 4 marks is not enough evidence, 4 is enough to judge', () => {
  const three = [mk(3), mk(2), mk(1)];
  const s3 = skillState(three, { now: NOW });
  assert.equal(s3.state, 'not_enough'); plainWords(s3);
  assert.deepEqual(s3.evidenceIds, three.map((r) => r.id));
  assert.equal(skillState([wrong(4), wrong(3), wrong(2), wrong(1)], { now: NOW }).state, 'emerging');
});

test('only easy items is not enough evidence while they are going well, but failing easy items is emerging', () => {
  const ok = [1, 2, 3, 4, 5].map((d) => mk(d, { difficulty: 'easy' }));
  const s = skillState(ok, { now: NOW });
  assert.equal(s.state, 'not_enough'); assert.match(s.reason, /easy/); plainWords(s);
  assert.equal(skillState([1, 2, 3, 4, 5].map((d) => wrong(d, { difficulty: 'easy' })), { now: NOW }).state, 'emerging');
});

test('emerging: under 50% right without help; exactly 50% is developing', () => {
  const e = skillState([mk(5), wrong(4), wrong(3), wrong(2), mk(1)], { now: NOW }); // 2/5
  assert.equal(e.state, 'emerging'); plainWords(e);
  assert.equal(skillState([mk(4), wrong(3), mk(2), wrong(1)], { now: NOW }).state, 'developing'); // 2/4
});

test('developing: 50% or more right unaided but not mastered; the reason says what mastered still needs', () => {
  const rows = [mk(6, { difficulty: 'easy' }), mk(5, { difficulty: 'easy' }), wrong(4, { difficulty: 'easy' }), mk(3, { difficulty: 'easy' }), mk(2, { difficulty: 'easy' }), mk(1, { difficulty: 'medium' })];
  const s = skillState(rows, { now: NOW });
  assert.equal(s.state, 'developing'); plainWords(s);
  assert.match(s.reason, /medium or hard/);
});

// ---------------------------------------------------------------- mastered
const goodRun = (start) => [
  mk(start + 0.5, { difficulty: 'easy' }), mk(start + 0.4, { difficulty: 'easy' }), mk(start + 0.3, { difficulty: 'medium' }),
  mk(start + 0.2, { difficulty: 'hard' }), mk(start + 0.1, { difficulty: 'medium' }), mk(start, { difficulty: 'easy' }),
];

test('80% right unaided with medium or hard items is NOT mastered until a re-check 14+ days later', () => {
  const s = skillState(goodRun(3), { now: NOW });
  assert.equal(s.state, 'developing'); plainWords(s);
  assert.match(s.reason, /re-check/);
});

test('mastered once the re-check, at least 14 days after, is right; with its evidence ids and a plain reason', () => {
  const run = goodRun(30);
  const recheck = [mk(15, { difficulty: 'medium' }), mk(14.99, { difficulty: 'easy' })];
  const s = skillState([...run, ...recheck], { now: NOW });
  assert.equal(s.state, 'mastered'); assert.equal(s.word, 'Mastered'); assert.equal(s.dueRecheck, false);
  plainWords(s);
  for (const r of [...run.slice(0, 4), ...recheck]) assert.ok(s.evidenceIds.includes(r.id), 'rests on the marks that reached it and the re-check');
  assert.equal(s.recheckPassed, 1);
});

test('marks less than 14 days after reaching it are not a re-check', () => {
  const run = goodRun(30); // reached 30 days ago
  assert.notEqual(skillState([...run, mk(17.5), mk(17.4)], { now: NOW }).state, 'mastered'); // 12.5 days after
  assert.equal(skillState([...run, mk(15.9), mk(15.8)], { now: NOW }).state, 'mastered'); // 14.1 days after
});

test('a failed re-check returns it to developing, with a reason that says so', () => {
  const failed = [wrong(15), wrong(14.99), mk(14.98, { difficulty: 'easy' })]; // 1 of 3 right
  const s = skillState([...goodRun(30), ...failed], { now: NOW });
  assert.equal(s.state, 'developing'); assert.match(s.reason, /slipped back/); plainWords(s);
});

test('re-checks are due at 2, 4 and 8 weeks and each must hold', () => {
  const run = goodRun(80);
  const c2 = [mk(65), mk(64.99)];
  const c4 = [mk(50), mk(49.99)];
  const one = skillState([...run, ...c2], { now: NOW });
  assert.equal(one.recheckPassed, 1); assert.ok(one.nextRecheck);
  assert.equal(skillState([...run, ...c2, ...c4], { now: NOW }).recheckPassed, 2);
  const c8 = [mk(20), mk(19.99)];
  const three = skillState([...run, ...c2, ...c4, ...c8], { now: NOW });
  assert.equal(three.recheckPassed, 3); assert.equal(three.nextRecheck, null); assert.match(three.reason, /all re-checks are done/);
  assert.equal(skillState([...run, ...c2, ...c4, wrong(20), wrong(19.99)], { now: NOW }).state, 'developing');
});

test('a re-check overdue by more than 4 weeks shows "mastered, due a re-check"; less than that does not', () => {
  const s = skillState([...goodRun(100), mk(85), mk(84.99)], { now: NOW }); // week 4 fell due 72 days ago... 44 days overdue
  assert.equal(s.state, 'mastered'); assert.equal(s.dueRecheck, true); assert.equal(s.word, 'Mastered, due a re-check'); plainWords(s);
  const fresh = skillState([...goodRun(40), mk(25), mk(24.99)], { now: NOW }); // week 4 fell due 12 days ago
  assert.equal(fresh.state, 'mastered'); assert.equal(fresh.dueRecheck, false); assert.equal(fresh.recheckDue, true);
});

test('mastered is not given on easy items alone when difficulty is recorded', () => {
  const easyOnly = [1, 2, 3, 4, 5, 6].map((d) => mk(30 + d / 10, { difficulty: 'easy' }));
  const s = skillState([...easyOnly, mk(14, { difficulty: 'easy' }), mk(13.99, { difficulty: 'easy' })], { now: NOW });
  assert.notEqual(s.state, 'mastered');
});

test('when no item records a difficulty, mastered needs 8 or more unaided marks (a stated assumption), and the result says so', () => {
  const eight = [8, 7, 6, 5, 4, 3, 2, 1].map((i) => mk(31 + i / 10));
  const recheck = [mk(15), mk(14.99)];
  const lm = learnerMastery([...eight, ...recheck], { now: NOW });
  assert.equal(lm.difficultyKnown, false);
  assert.equal(lm.assumptions.length, 1); assert.match(lm.assumptions[0], /8 or more answers without help/);
  assert.equal(lm.skills[0].state, 'mastered');
  const seven = [7, 6, 5, 4, 3, 2, 1].map((i) => mk(31 + i / 10));
  assert.notEqual(learnerMastery([...seven, ...recheck], { now: NOW }).skills[0].state, 'mastered', 'only 7 unaided marks, so no mastered');
});

// ---------------------------------------------------------------- help
test('help counts toward emerging only', () => {
  const s = skillState([1, 2, 3, 4, 5, 6].map((d) => mk(d, { independent: false })), { now: NOW });
  assert.equal(s.state, 'emerging'); assert.match(s.reason, /help/); plainWords(s);
  assert.equal(skillState([1, 2, 3, 4, 5, 6].map((d) => mk(d, { hints_used: 1 })), { now: NOW }).state, 'emerging');
  assert.equal(skillState([1, 2, 3, 4].map((d) => mk(d, { independent: null })), { now: NOW }).state, 'developing', 'unknown independence with no hints counts as unaided');
});

test('help can never lift a skill to mastered', () => {
  const run = goodRun(20).map((r) => ({ ...r, independent: false }));
  assert.equal(skillState([...run, mk(3), mk(2.99)], { now: NOW }).state, 'emerging');
});

// ---------------------------------------------------------------- recency
test('the newest 10 marks decide: old failures fade out of the window', () => {
  const old = [28, 27, 26, 25, 24, 23].map((d) => wrong(d));
  const fresh = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((d) => mk(d));
  const s = skillState([...old, ...fresh], { now: NOW });
  assert.notEqual(s.state, 'emerging');
  assert.equal(s.evidenceIds.length, RULES.WINDOW);
  assert.ok(!s.evidenceIds.includes(old[0].id));
});

test('marks older than 30 days do not count for the lower states; nothing recent is not enough evidence', () => {
  const s = skillState([60, 59, 58, 57, 56].map((d) => mk(d)), { now: NOW });
  assert.equal(s.state, 'not_enough'); assert.match(s.reason, /30 days/); plainWords(s);
  assert.equal(skillState([30, 29.9, 29.8, 29.7].map((d) => mk(d)), { now: NOW }).state, 'developing', 'exactly 30 days old still counts');
});

test('marks with partial credit weigh by marks over max marks', () => {
  const part = [1, 2, 3, 4].map((d) => ({ ...mk(d), correct: null, marks: 1, max_marks: 4 }));
  assert.equal(skillState(part, { now: NOW }).state, 'emerging');
  const full = [1, 2, 3, 4].map((d) => ({ ...mk(d), marks: 4, max_marks: 4 }));
  assert.equal(skillState(full, { now: NOW }).state, 'developing');
});

test('falls back to skill_id when there is no cskill, and ignores rows with neither', () => {
  const rows = [1, 2, 3, 4].map((d) => mk(d, { cskill: null, skill_id: 'G5_ADDITION' }));
  const lm = learnerMastery([...rows, mk(1, { cskill: null, skill_id: null })], { now: NOW });
  assert.equal(lm.skills.length, 1); assert.equal(lm.skills[0].key, 'G5_ADDITION'); assert.equal(lm.skills[0].label, 'Addition');
});

// ---------------------------------------------------------------- roll-up
const S = (key, state, extra = {}) => ({ key, state, evidenceIds: [`${key}-e`], dueRecheck: false, ...extra });

test('roll-up: a group is only as strong as its weakest skill', () => {
  const r = rollUp([S('A.B.C.D.X', 'mastered'), S('A.B.C.D.Y', 'developing'), S('A.B.C.D.Z', 'mastered')]);
  assert.equal(r.state, 'developing'); assert.deepEqual(r.evidenceIds, ['A.B.C.D.Y-e']);
  assert.equal(rollUp([S('a', 'mastered'), S('b', 'emerging')]).state, 'emerging');
  assert.equal(rollUp([S('a', 'mastered'), S('b', 'mastered')]).state, 'mastered');
});

test('roll-up: skills not yet assessed are left out and named; not enough holds a group at developing at most', () => {
  const r = rollUp([S('a', 'mastered'), S('b', 'not_assessed')]);
  assert.equal(r.state, 'mastered'); assert.match(r.reason, /1 skill not yet assessed/);
  assert.equal(rollUp([S('a', 'not_assessed')]).state, 'not_assessed');
  assert.equal(rollUp([S('a', 'not_enough'), S('b', 'not_enough')]).state, 'not_enough');
  const capped = rollUp([S('a', 'mastered'), S('b', 'not_enough')]);
  assert.equal(capped.state, 'developing'); plainWords(capped);
});

test('roll-up: a mastered group with an overdue skill shows the re-check wording', () => {
  assert.equal(rollUp([S('a', 'mastered', { dueRecheck: true })]).word, 'Mastered, due a re-check');
});

test('learnerMastery groups skills into outcomes and sub-strands, from the row fields or the skill code', () => {
  const A = 'MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS';
  const B = 'MATH.G5.NUMBER.FRACTIONS.ADD_SAME_DENOM';
  const C = 'MATH.G5.MEASUREMENT.LENGTH.CONVERT';
  const rows = [
    ...[1, 2, 3, 4].map((d) => mk(d, { cskill: A, outcome_code: 'OUT-1' })),
    ...[1, 2, 3, 4].map((d) => wrong(d, { cskill: B, outcome_code: 'OUT-1' })),
    ...[1, 2, 3, 4].map((d) => mk(d, { cskill: C, substrand_code: 'MATH.G5.MEASUREMENT.LENGTH' })),
  ];
  const lm = learnerMastery(rows, { now: NOW });
  assert.deepEqual(lm.substrands.map((s) => s.code), ['MATH.G5.MEASUREMENT.LENGTH', 'MATH.G5.NUMBER.FRACTIONS']);
  const fr = lm.substrands.find((s) => s.code === 'MATH.G5.NUMBER.FRACTIONS');
  assert.equal(fr.state, 'emerging'); assert.deepEqual([...fr.skillKeys].sort(), [A, B].sort());
  assert.equal(lm.outcomes.length, 1); assert.equal(lm.outcomes[0].code, 'OUT-1'); assert.equal(lm.outcomes[0].state, 'emerging');
  plainWords(fr);
});

// ---------------------------------------------------------------- words
test('the five states have the words parents and teachers share', () => {
  assert.deepEqual(Object.values(STATE_WORDS), ['Not yet assessed', 'Not enough evidence', 'Emerging', 'Developing', 'Mastered']);
});

test('every reason, for every state, is one plain sentence a teacher can read', () => {
  const cases = [
    skillState([], { now: NOW }), skillState([mk(1)], { now: NOW }), skillState([1, 2, 3, 4].map((d) => wrong(d)), { now: NOW }),
    skillState([1, 2, 3, 4, 5].map((d) => mk(d, { independent: false })), { now: NOW }),
    skillState([mk(4), wrong(3), mk(2), wrong(1)], { now: NOW }), skillState(goodRun(3), { now: NOW }),
    skillState([...goodRun(30), mk(15), mk(14.99)], { now: NOW }), skillState([...goodRun(100), mk(85), mk(84.99)], { now: NOW }),
    skillState([60, 59, 58, 57].map((d) => mk(d)), { now: NOW }),
  ];
  assert.deepEqual(new Set(cases.map((c) => c.state)), new Set(['not_assessed', 'not_enough', 'emerging', 'developing', 'mastered']));
  cases.forEach(plainWords);
});

test('code helpers: labels and sub-strand from codes', () => {
  assert.equal(labelFromCode(SK), 'Equivalent Fractions');
  assert.equal(labelFromCode('G6_FRACTIONS_ADD'), 'Fractions Add');
  assert.equal(substrandFromCode(SK), 'MATH.G5.NUMBER.FRACTIONS');
  assert.equal(substrandFromCode('G5_ADDITION'), null);
});
