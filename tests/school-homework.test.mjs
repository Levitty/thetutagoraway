// ============================================================================
// SCHOOL HOMEWORK (10 Nov 2026): a teacher in Tuta sets homework from the
// curriculum; HOREB draws each child's questions and marks them.
//
// What must hold:
//   the same seed gives the same questions; two children never get the same set
//   only reviewed families, or families a teacher approved for this homework, are drawn
//   the teacher's preview shows the same two samples every time
//   one question at a time, marked at once; leaving the page locks it; a teacher reopens it
//   a wrong answer that a misconception explains is tagged with the library's full code
//   results reach Tuta signed with the door secret, and only codes and references cross
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { drawSet, allowedFamilies, samplesFor, markItem, step, sittingView, resultsFor, cleanHomeworkSet, sittingsFor, misCode, familiesForSkill, publicItem, keyItem, seedOf } from '../src/school/homework.js';
import { doorHomework, makeCodeFrom } from '../src/school/homeworkDoor.js';
import { learnerHomework, resultsBody } from '../src/school/homeworkLearner.js';
import { memoryStore } from '../src/school/homeworkStore.js';
import { signCall, verifyCall } from '../src/school/schoolDoor.js';
import { randomBytes } from 'node:crypto';
import { SKILLS_G5 } from '../src/ai-tutor/content/curriculumMap.g5.js';

const EQ = 'MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS';
const SIMP = 'MATH.G5.NUMBER.FRACTIONS.SIMPLIFY_FRACTIONS';
const CS = [EQ, SIMP];
const allIds = (cs) => cs.flatMap(c => familiesForSkill(c).map(f => f.id));
const fams = allowedFamilies(CS, allIds(CS)).families;
const SECRET = 'test-secret-0123456789abcdef0123456789abcdef';

test('seeded per child: the same seed always gives the same questions, another child gets others', () => {
  const a = drawSet({ seed: 'hw-1:AAAAAAAA', cskills: CS, families: fams, count: 10 });
  const again = drawSet({ seed: 'hw-1:AAAAAAAA', cskills: CS, families: fams, count: 10 });
  const b = drawSet({ seed: 'hw-1:BBBBBBBB', cskills: CS, families: fams, count: 10 });
  assert.equal(a.length, 10);
  assert.deepEqual(a, again, 'reproducible');
  assert.notDeepEqual(a.map(x => x.question), b.map(x => x.question), 'each child differs');
  assert.equal(new Set(a.map(x => x.question)).size, 10, 'no question twice in a set');
  assert.ok(new Set(a.map(x => x.cskill)).size === 2, 'both skills');
  assert.ok(new Set(a.map(x => x.form)).size >= 3, 'forms mix');
  assert.ok(a.every((x, i) => i === 0 || x.rung >= a[i - 1].rung), 'easier rungs first');
  assert.ok(seedOf('x') !== seedOf('y'));
  // Drawing leaves Math.random as it was.
  const r = Math.random; drawSet({ seed: 's', cskills: CS, families: fams, count: 3 }); assert.equal(Math.random, r);
});

test('only reviewed families, or ones a teacher approved for this homework', () => {
  // No Grade 5 curriculum family is reviewed yet, so with no approval there is nothing to draw.
  const none = allowedFamilies(CS, []);
  assert.equal(none.ok, false);
  assert.deepEqual(none.missing, CS);
  const one = familiesForSkill(EQ)[0].id;
  const some = allowedFamilies(CS, [one]);
  assert.deepEqual(some.families[EQ].map(f => f.id), [one]);
  assert.deepEqual(some.missing, [SIMP]);
  const c = cleanHomeworkSet({ title: 'Fractions', cskills: CS, count: 10, mode: 'online', approved: [{ family_id: one, by: 'T. Wanjiku', at: '2026-11-10T09:00:00Z' }],
    homework: [{ homework_ref: '6f1c2b8e-1d2a-4c1e-9a2b-3c4d5e6f7a8b', learner_refs: ['AAAAAAAA'] }] });
  assert.equal(c.ok, false);
  assert.match(c.error, /simplest form/i, 'names the skill in plain words');
  // Multi-part questions stay in the lesson.
  assert.ok(Object.values(SKILLS_G5).length > 100 && Object.keys(SKILLS_G5).every(k => familiesForSkill(k).every(f => f.form !== 'steps')));
});

test("the teacher's preview: two samples per family, the same every time, with each wrong option's misconception", () => {
  const p1 = samplesFor([EQ]); const p2 = samplesFor([EQ]);
  assert.deepEqual(p1, p2);
  assert.equal(p1.length, familiesForSkill(EQ).length);
  assert.ok(p1.every(f => f.samples.length === 2 && f.reviewed === false));
  const choice = p1.flatMap(f => f.samples).find(s => s.kind === 'choice');
  assert.ok(choice.options.some(o => !o.right && o.mis && o.mis.startsWith(EQ + '.M_')));
});

test('marking: right, wrong with the misconception it reveals, a choice by letter or text, and blank', () => {
  const set = drawSet({ seed: 'mark', cskills: [EQ], families: fams, count: 8 });
  const typed = set.find(x => x.kind === 'typed' && x.wrong.some(w => w.mis));
  assert.ok(typed);
  assert.deepEqual(markItem(typed, typed.answer), { correct: true, chosen: typed.answer, mis: null });
  const w = typed.wrong.find(x => x.mis);
  const m = markItem(typed, ` ${w.value} `);
  assert.equal(m.correct, false);
  assert.equal(m.mis, w.mis);
  assert.ok(SKILLS_G5[EQ].mis.includes(m.mis.slice(EQ.length + 1)), 'a code in the library for this skill');
  assert.equal(markItem(typed, '').blank, true);
  const ch = set.find(x => x.kind === 'choice' && x.options.some(o => !o.right && o.mis));
  const right = ch.options.find(o => o.right); const wrong = ch.options.find(o => !o.right && o.mis);
  assert.equal(markItem(ch, right.key).correct, true);
  assert.equal(markItem(ch, right.text.toLowerCase()).correct, true);
  assert.deepEqual(markItem(ch, wrong.key), { correct: false, chosen: wrong.key, mis: wrong.mis });
  assert.equal(misCode(EQ, 'M_EQUIV_ADDITIVE'), `${EQ}.M_EQUIV_ADDITIVE`);
  assert.equal(misCode(EQ, 'M_NOT_A_CODE'), null);
});

test('the phone never sees an answer; Tuta keeps the answer and each wrong answer\'s code', () => {
  const set = drawSet({ seed: 'pub', cskills: CS, families: fams, count: 10 });
  for (const it of set) {
    const pub = JSON.stringify(publicItem(it));
    assert.ok(!/"answer"|"right"|"mis"|"accepts"|"why"/.test(pub), 'no answer, reason or code on the phone');
    const k = keyItem(it);
    assert.equal(k.answer, it.answer); assert.equal(k.cskill, it.cskill);
  }
});

test('one question at a time, in order; leaving locks it; the teacher reopens; handed in at the end', () => {
  const items = drawSet({ seed: 'sit', cskills: [EQ], families: fams, count: 3 });
  let s = { learner_ref: 'AAAAAAAA', items, answers: [], status: 'issued', mode: 'online' };
  assert.equal(step(s, { type: 'answer', n: 1, response: 'x' }, 0).ok, false, 'not before starting');
  s = step(s, { type: 'start' }, 0).s;
  assert.equal(s.status, 'started');
  assert.equal(step(s, { type: 'answer', n: 2, response: 'x' }, 0).ok, false, 'not out of order');
  s = step(s, { type: 'answer', n: 1, response: items[0].kind === 'choice' ? items[0].options.find(o => o.right).key : items[0].answer }, 1000).s;
  assert.equal(s.answers[0].correct, true);
  s = step(s, { type: 'leave', reason: 'switched away' }, 2000).s;
  assert.equal(s.status, 'locked'); assert.equal(s.lock_question, 2); assert.equal(s.lock_reason, 'switched away');
  assert.equal(step(s, { type: 'answer', n: 2, response: '1' }, 0).ok, false, 'a locked sitting takes no answers');
  assert.equal(step(s, { type: 'leave', reason: 'something else' }, 0).s.lock_reason, 'switched away');
  s = step(s, { type: 'reopen' }, 3000).s;
  assert.equal(s.status, 'started'); assert.equal(s.reopen_count, 1); assert.equal(s.answers.length, 1, 'answers kept');
  s = step(s, { type: 'answer', n: 2, response: 'zz' }, 0).s;
  s = step(s, { type: 'answer', n: 3, response: 'zz' }, 0).s;
  assert.equal(s.status, 'submitted');
  assert.equal(sittingView(s).right, 1);
  assert.equal(step({ ...s, mode: 'paper' }, { type: 'start' }, 0).ok, false, 'paper homework is not answered on the phone');
  const r = resultsFor([s]).AAAAAAAA;
  assert.equal(r.score, 1); assert.equal(r.out_of, 3);
  assert.deepEqual(Object.keys(r.items[0]).sort(), ['chosen', 'correct', 'cskill', 'mis', 'n']);
});

test('paper in versions: the class shares 2 to 4 sets, taken in turn; per child otherwise', () => {
  const c = cleanHomeworkSet({ title: 'Fractions', cskills: CS, count: 6, mode: 'paper', versions: 3, approved: allIds(CS).map(id => ({ family_id: id, by: 'T', at: '2026-11-10' })),
    homework: [{ homework_ref: '6f1c2b8e-1d2a-4c1e-9a2b-3c4d5e6f7a8b', learner_refs: ['AAAAAAAA', 'BBBBBBBB', 'CCCCCCCC', 'DDDDDDDD'] }] });
  assert.equal(c.ok, true);
  const s = sittingsFor(c.hw, c.hw.homework[0].homework_ref, c.hw.homework[0].learner_refs, c.families, makeCodeFrom(randomBytes));
  assert.deepEqual(s.map(x => x.version), [1, 2, 3, 1]);
  assert.deepEqual(s[0].items, s[3].items, 'the same version, the same questions');
  assert.notDeepEqual(s[0].items, s[1].items);
  assert.equal(new Set(s.map(x => x.code)).size, 4);
  assert.equal(cleanHomeworkSet({ ...c.hw, versions: 5, homework: c.hw.homework }).ok, false);
});

test('the door: set, the same set again draws nothing new, the child answers, results are pushed signed, the teacher reopens', async () => {
  const door = { id: 'd1', code: 'WSL', secret: SECRET, active: true, results_url: 'https://tuta.example/api/horeb/homework-results' };
  const store = memoryStore([door]);
  const pushed = [];
  const deps = { store, now: () => Date.parse('2026-11-10T10:00:00Z'), makeCode: makeCodeFrom(randomBytes), linkFor: (c) => `https://tutagora.com/hw/?c=${c}`,
    push: async (d, body) => {
      const text = JSON.stringify(body), time = '1793600000';
      const sig = await signCall(d.secret, time, text);
      assert.deepEqual(await verifyCall(SECRET, time, text, sig, 1793600010), { ok: true }, 'Tuta can check it with the same secret');
      pushed.push(body); return true;
    } };
  const ref = '6f1c2b8e-1d2a-4c1e-9a2b-3c4d5e6f7a8b';
  const req = { action: 'homework_set', title: 'Equivalent fractions', cskills: [EQ], count: 4, mode: 'online', due_on: '2026-11-14',
    approved: allIds([EQ]).map(id => ({ family_id: id, by: 'T. Wanjiku', at: '2026-11-10T09:00:00Z' })),
    homework: [{ homework_ref: ref, learner_refs: ['AAAAAAAA', 'BBBBBBBB'] }] };
  const r = await doorHomework(door, req, deps);
  assert.equal(r.status, 200);
  const L = r.body.homework[ref].learners;
  assert.deepEqual(Object.keys(L).sort(), ['AAAAAAAA', 'BBBBBBBB']);
  assert.match(L.AAAAAAAA.link, /^https:\/\/tutagora\.com\/hw\/\?c=[A-Z2-9]{10}$/);
  assert.equal(L.AAAAAAAA.items.length, 4);
  assert.ok(!JSON.stringify(r.body).includes('seed'), 'the seed stays in HOREB');
  const again = await doorHomework(door, req, deps);
  assert.deepEqual(again.body, r.body, 'a retry gets the same codes and questions');
  assert.equal(store.sittings.length, 2);

  // The child: open, start, a wrong option with a misconception, then leave: locked and pushed.
  const code = L.AAAAAAAA.code;
  const o = await learnerHomework({ action: 'open', code }, deps);
  assert.equal(o.body.view.status, 'issued');
  assert.ok(!JSON.stringify(o.body).includes('"answer"'));
  const st = await learnerHomework({ action: 'start', code }, deps);
  const first = st.body.view.item;
  const full = L.AAAAAAAA.items[0];
  const wrongResp = full.kind === 'choice' ? full.options.find(x => !x.right && x.mis)?.key : full.wrong.find(w => w.mis)?.value;
  const a1 = await learnerHomework({ action: 'answer', code, n: first.n, response: wrongResp ?? 'nonsense' }, deps);
  assert.equal(a1.body.mark.correct, false);
  assert.ok(a1.body.mark.answer);
  const lv = await learnerHomework({ action: 'leave', code, reason: 'went back' }, deps);
  assert.equal(lv.body.view.status, 'locked');
  assert.equal(pushed.length, 1);
  const res = pushed[0].results[ref].AAAAAAAA;
  assert.equal(res.status, 'locked'); assert.equal(res.items[0].correct, false);
  if (wrongResp) assert.match(res.items[0].mis, /^MATH\.G5\..+\.M_[A-Z_]+$/);
  assert.equal(res.items[0].cskill, EQ);
  assert.ok(!JSON.stringify(pushed[0]).match(/"question"|seed/), 'results carry codes, not questions');

  const st2 = await doorHomework(door, { action: 'homework_status', homework_refs: [ref] }, deps);
  assert.deepEqual(st2.body.results[ref].AAAAAAAA, res);
  const re = await doorHomework(door, { action: 'homework_reopen', homework_ref: ref, learner_ref: 'AAAAAAAA' }, deps);
  assert.equal(re.body.status, 'started');
  assert.equal((await learnerHomework({ action: 'open', code }, deps)).body.view.answered, 1, 'carries on where it stopped');
  assert.equal((await learnerHomework({ action: 'open', code: 'NOTACODE22' }, deps)).status, 404);
  assert.deepEqual(resultsBody({ homework_ref: ref }, []).results, { [ref]: {} });
});
