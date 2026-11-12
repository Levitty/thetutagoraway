// ============================================================================
// THE RE-CHECK SCHEDULER (12 Nov 2026, docs/learner-model.md "Re-checks").
//
// What must hold:
//   a skill that met the mastered level is due a re-check at 2, 4 and 8 weeks (the first never under 14 days)
//   a failed re-check puts it back to developing and takes it off the schedule
//   a re-check overdue by more than 4 weeks is labelled "Mastered, due a re-check"
//   practice and homework mix re-checks at no more than 1 item in 5
//   a re-check answer is an ordinary evidence row, flagged, and mastery.js counts it
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recheckSchedule, dueRechecks, recheckSlots, shouldServeRecheck, pickRecheck, classRechecks, MAX_SHARE } from '../src/learner/recheck.js';
import { skillState, MASTERED_DUE_WORDS } from '../src/learner/mastery.js';
import { recheckRef, isRecheckRow, homeworkEvidence } from '../src/learner/evidence.js';
import { readFileSync } from 'node:fs';
import { drawSet, allowedFamilies, cleanHomeworkSet, sittingsFor, keyItem } from '../src/school/homework.js';

const DAY = 86400000;
const T0 = Date.parse('2026-06-01T08:00:00Z');
const at = (d) => new Date(T0 + d * DAY).toISOString();
const SK = 'MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS';
const row = (d, correct = true, extra = {}) => ({ id: `r${d}-${Math.random()}`, cskill: SK, skill_id: 'G5_EQ', source: 'practice', created_at: at(d), correct,
  marks: correct ? 1 : 0, max_marks: 1, independent: true, difficulty: 'medium', ...extra });
/** Ten right answers on days 0..4: the mastered level is met on day 4 (the re-check clock starts then). */
const reached = () => [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5].map((d) => row(d));

test('the clock starts on the answer that first met the level, and the first re-check is 14 days on', () => {
  const rows = reached();
  const first = skillState(rows.slice(0, 4), { now: T0 + 5 * DAY });
  assert.equal(first.state === 'mastered', false, 'reached but not yet re-checked is not mastered');
  const { schedule } = recheckSchedule(rows, { now: T0 + 5 * DAY });
  assert.equal(schedule.length, 1);
  assert.equal(schedule[0].key, SK);
  assert.equal(schedule[0].week, 2);
  assert.equal(schedule[0].due, at(1.5 + 14).slice(0, 10));
  assert.equal(schedule[0].status, 'upcoming');
  assert.deepEqual(schedule[0].skillIds, ['G5_EQ']);
});

test('due on the day, overdue after 4 more weeks, and the overdue one wears the label', () => {
  const rows = [...reached(), row(16, true), row(16.1, true)];   // 2-week re-check passed
  const early = recheckSchedule(rows, { now: T0 + 17 * DAY }).schedule[0];
  assert.equal(early.week, 4, 'after the 2-week re-check the 4-week one is next');
  assert.equal(early.status, 'upcoming');
  const due = dueRechecks(rows, { now: T0 + 1.5 * DAY + 28 * DAY + 1000 });
  assert.equal(due.length, 1);
  assert.equal(due[0].status, 'due');
  assert.equal(due[0].word, null);
  const late = dueRechecks(rows, { now: T0 + 1.5 * DAY + 28 * DAY + 29 * DAY });
  assert.equal(late[0].status, 'overdue');
  assert.equal(late[0].word, MASTERED_DUE_WORDS);
  assert.equal(skillState(rows, { now: T0 + 1.5 * DAY + 28 * DAY + 29 * DAY }).word, MASTERED_DUE_WORDS, 'the same words mastery.js shows');
});

test('2, 4 and 8 weeks in turn, then nothing is left to schedule', () => {
  const day = (d) => T0 + d * DAY;
  let rows = reached();
  const weeks = [];
  for (const passDay of [16, 30, 58]) {
    weeks.push(recheckSchedule(rows, { now: day(passDay - 0.5) }).schedule[0].week);
    rows = [...rows, row(passDay), row(passDay + 0.1)];
  }
  assert.deepEqual(weeks, [2, 4, 8]);
  assert.equal(recheckSchedule(rows, { now: day(70) }).schedule.length, 0);
  assert.equal(skillState(rows, { now: day(70) }).state, 'mastered');
});

test('a failed re-check goes back to developing and leaves the schedule', () => {
  const rows = [...reached(), row(16, false), row(16.1, false), row(16.2, true)];
  const now = T0 + 17 * DAY;
  assert.equal(skillState(rows, { now }).state, 'developing');
  const { schedule, backToDeveloping } = recheckSchedule(rows, { now });
  assert.equal(schedule.length, 0, 'nothing to re-check until the level is met again');
  assert.deepEqual(backToDeveloping, [SK]);
});

test('a skill not yet at the level, or never answered, has no re-check', () => {
  assert.deepEqual(recheckSchedule([], { now: T0 }).schedule, []);
  const weak = [0, 1, 2, 3, 4].map((d) => row(d, d % 2 === 0));
  assert.deepEqual(recheckSchedule(weak, { now: T0 + 6 * DAY }).schedule, []);
});

test('a reached skill with no practice since still falls due (state says not enough, schedule still asks)', () => {
  const now = T0 + 60 * DAY;
  const rows = reached();
  assert.equal(skillState(rows, { now }).state, 'not_enough');
  assert.equal(dueRechecks(rows, { now })[0].status, 'overdue');
});

test('most overdue first', () => {
  const OTHER = 'MATH.G5.NUMBER.FRACTIONS.ADDING_FRACTIONS';
  const later = reached().map((r) => ({ ...r, cskill: OTHER, skill_id: OTHER, created_at: at(Number(r.created_at ? (Date.parse(r.created_at) - T0) / DAY : 0) + 10) }));
  const out = dueRechecks([...reached(), ...later], { now: T0 + 40 * DAY });
  assert.deepEqual(out.map((s) => s.key), [SK, OTHER]);
});

// ---------------------------------------------------------------- mixing rate
test('re-checks are never more than 1 item in 5', () => {
  assert.equal(MAX_SHARE, 0.2);
  assert.deepEqual([3, 4, 5, 9, 10, 14, 15, 30].map(recheckSlots), [0, 0, 1, 1, 2, 2, 3, 6]);
  // a practice session of 60 items with a re-check always waiting
  let served = 0;
  const positions = [];
  for (let n = 0; n < 60; n++) {
    if (shouldServeRecheck({ position: n, served, anyDue: true })) { served += 1; positions.push(n + 1); }
    assert.ok(served / (n + 1) <= 0.2 + 1e-9, `share at item ${n + 1}`);
  }
  assert.deepEqual(positions.slice(0, 3), [5, 10, 15]);
  assert.equal(served, 12, 'and it does reach the share, it is not a token one');
  assert.equal(shouldServeRecheck({ position: 20, served: 0, anyDue: false }), false, 'nothing due, nothing served');
});

test('the pick is the most overdue, once per session, never the lesson skill', () => {
  const due = [{ key: 'A', skillIds: ['a'] }, { key: 'B', skillIds: ['b'] }, { key: 'C', skillIds: ['c'] }];
  assert.equal(pickRecheck(due).key, 'A');
  assert.equal(pickRecheck(due, { served: ['A'] }).key, 'B');
  assert.equal(pickRecheck(due, { served: ['A'], exclude: ['B'] }).key, 'C');
  assert.equal(pickRecheck(due, { canServe: (d) => d.key === 'C' }).key, 'C');
  assert.equal(pickRecheck(due, { served: ['A', 'B', 'C'] }), null);
});

// ---------------------------------------------------------------- homework
const fams = (cs) => allowedFamilies(cs).families;
const CS = ['MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS'];

test('a homework mixes a fifth at most from the re-check skills, flagged, one every fifth place', async () => {
  const { SKILLS_G5 } = await import('../src/ai-tutor/content/curriculumMap.g5.js');
  const usable = Object.keys(SKILLS_G5).filter((c) => allowedFamilies([c]).ok);
  assert.ok(usable.length >= 3, 'the family bank has skills to draw from');
  const [a, b, rc] = usable;
  const f = fams([a, b, rc]);
  const plain = drawSet({ seed: 's1', cskills: [a, b], families: f, count: 10 });
  const mixed = drawSet({ seed: 's1', cskills: [a, b], families: f, count: 10, recheck: [rc] });
  assert.equal(mixed.length, 10);
  assert.deepEqual(mixed.map((i) => i.n), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const flagged = mixed.filter((i) => i.recheck);
  assert.equal(flagged.length, 2, '10 items: at most 2');
  assert.deepEqual(flagged.map((i) => i.n), [5, 10]);
  assert.ok(flagged.every((i) => i.cskill === rc));
  assert.ok(mixed.filter((i) => !i.recheck).every((i) => i.cskill !== rc));
  assert.equal(keyItem(flagged[0]).recheck, true);
  assert.equal(keyItem(mixed[0]).recheck, undefined);
  assert.deepEqual(drawSet({ seed: 's1', cskills: [a, b], families: f, count: 10, recheck: [] }), plain, 'no re-checks: exactly the old draw');
  assert.equal(drawSet({ seed: 's1', cskills: [a, b], families: f, count: 4, recheck: [rc] }).some((i) => i.recheck), false, 'under 5 items there is no room for one');
  const big = drawSet({ seed: 's1', cskills: [a, b], families: f, count: 30, recheck: [rc] }).filter((i) => i.recheck).length;
  assert.ok(big >= 1 && big <= 6, `30 items: at most 6 (a skill with few distinct questions gives fewer, never more), got ${big}`);
});

test('Tuta may name re-check skills; they are capped, checked and never a reason to refuse', async () => {
  const { SKILLS_G5 } = await import('../src/ai-tutor/content/curriculumMap.g5.js');
  const usable = Object.keys(SKILLS_G5).filter((c) => allowedFamilies([c]).ok);
  const [a, rc1, rc2] = usable;
  const ref = '11111111-1111-1111-1111-111111111111';
  const base = { title: 'T', cskills: [a], count: 10, mode: 'online', homework: [{ homework_ref: ref, learner_refs: ['AAAAAAAA'] }] };
  const ok = cleanHomeworkSet({ ...base, recheck_cskills: [rc1, rc2, a, 'MATH.G5.NOT.A.SKILL'] });
  assert.ok(ok.ok);
  assert.deepEqual(ok.hw.recheck, [rc1, rc2], 'the main skill and the unknown code are dropped');
  assert.deepEqual(cleanHomeworkSet({ ...base, count: 5, recheck_cskills: [rc1, rc2] }).hw.recheck, [rc1], 'capped to the slots');
  assert.deepEqual(cleanHomeworkSet({ ...base, count: 4, recheck_cskills: [rc1] }).hw.recheck, []);
  assert.deepEqual(cleanHomeworkSet(base).hw.recheck, []);
  const sittings = sittingsFor(ok.hw, ref, ['AAAAAAAA', 'BBBBBBBB'], ok.families, () => 'CODE');
  for (const s of sittings) assert.ok(s.items.filter((i) => i.recheck).length <= 2);
});

// ---------------------------------------------------------------- the evidence flag
test('a re-check answer is flagged in item_ref, and mastery.js counts it as the re-check', () => {
  assert.equal(recheckRef('abc'), 'recheck:abc');
  assert.equal(isRecheckRow({ item_ref: 'recheck:abc' }), true);
  assert.equal(isRecheckRow({ item_ref: 'hw:HW1:5:recheck' }), true);
  assert.equal(isRecheckRow({ item_ref: 'hw:HW1:5' }), false);
  assert.equal(isRecheckRow({}), false);
  // the same rows, flagged: the passing re-check makes it mastered, the failing one puts it back
  const flag = (r) => ({ ...r, item_ref: recheckRef(r.id) });
  const pass = [...reached(), flag(row(16)), flag(row(16.1))];
  const fail = [...reached(), flag(row(16, false)), flag(row(16.1, false))];
  assert.equal(skillState(pass, { now: T0 + 17 * DAY }).state, 'mastered');
  assert.equal(skillState(fail, { now: T0 + 17 * DAY }).state, 'developing');
});

test('homework evidence flags a re-check item and leaves the others as they were', () => {
  const homework = { id: 'H1', door_id: 'D1' };
  const mk = (recheck) => ({ homework_id: 'H1', learner_ref: 'AAAAAAAA', items: [{ cskill: SK, ...(recheck ? { recheck: true } : {}) }] });
  const a = { n: 1, chosen: 'A', correct: true, at: at(1) };
  assert.equal(homeworkEvidence({ homework, sitting: mk(false), answer: a }).item_ref, 'hw:H1:1');
  const r = homeworkEvidence({ homework, sitting: mk(true), answer: a });
  assert.equal(r.item_ref, 'hw:H1:1:recheck');
  assert.equal(isRecheckRow(r), true);
  assert.equal(r.cskill, SK);
});

test('the practice writer flags a re-check row, and the practice screen serves re-checks only through the 1-in-5 rule', () => {
  // telemetry.js needs the browser (supabase client), so its wiring is checked in the source.
  const tel = readFileSync(new URL('../src/ai-tutor/telemetry.js', import.meta.url), 'utf8');
  assert.match(tel, /if \(ev\.isRecheck\) \{ row\.item_ref = recheckRef\(row\.client_event_id\); row\.is_review = true; \}/);
  const ui = readFileSync(new URL('../src/ai-tutor/AIMastery.jsx', import.meta.url), 'utf8');
  assert.match(ui, /shouldServeRecheck\(\{/);
  assert.match(ui, /isRecheck: !!interleave\.recheck/);
  assert.match(ui, /\(!due && lg > 3 && shouldServeRecheck/, 'a re-check never takes the turn of the ordinary interlude, and young learners keep their rhythm');
});
