// ============================================================================
// THE LEARNER HOME (11 Nov 2026): all of one school learner's homework, opened
// with the link code Tuta prints (no account) or from the family app.
//
// What must hold:
//   a valid link code opens that learner's home; a wrong check, an unknown or
//   closed school, and a malformed code all get the same refusal
//   ten wrong codes an hour per address, then even a right one waits
//   another learner's homework (same school, or the same reference at another
//   school) is never in the payload; no names, no answers, no other codes
//   the family app sees the same home only for a child the parent linked
//   the next step, the streak, got-it and practise-next follow the answers
//   the drawing: big plain words, no emojis, no em dashes, everything escaped
//   public/hw/home.js is built from the tested drawing
// ============================================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { learnerHomework } from '../src/school/homeworkLearner.js';
import { learnerHome, buildHome, HOME_TRIES_PER_HOUR, dayOf } from '../src/school/learnerHome.js';
import { homeHtml, HOME_CSS, dueWords, dayWords } from '../src/school/learnerHomeView.js';
import { memoryStore } from '../src/school/homeworkStore.js';
import { linkCheck } from '../src/school/schoolDoor.js';

const SECRET = 'test-secret-0123456789abcdef0123456789abcdef';
const OTHER_SECRET = 'other-secret-0123456789abcdef0123456789abcd';
const NOW = Date.parse('2026-11-11T09:00:00Z');   // a Wednesday, 12:00 in Nairobi
const FR = 'MATH.G5.NUMBER.FRACTIONS.EQUIVALENT_FRACTIONS';
const SIMP = 'MATH.G5.NUMBER.FRACTIONS.SIMPLIFY_FRACTIONS';
const PARENT = '11111111-1111-4111-8111-111111111111';
const CHILD = '22222222-2222-4222-8222-222222222222';

const item = (n, cskill) => ({ n, cskill, kind: 'typed', question: `Q${n}`, answer: `A${n}`, wrong: [] });
const ans = (n, correct, at) => ({ n, chosen: correct ? `A${n}` : 'x', correct, mis: correct ? null : `${FR}.M_ADD_TOPS`, at });

async function world() {
  const doors = [
    { id: 'd1', code: 'WSL', name: 'Example Academy', secret: SECRET, active: true },
    { id: 'd2', code: 'OTH', name: 'Other School', secret: OTHER_SECRET, active: true },
    { id: 'd3', code: 'OFF', name: 'Closed School', secret: SECRET, active: false },
  ];
  const store = memoryStore(doors, [{ door_id: 'd1', learner_ref: 'AAAAAAAA', parent_id: PARENT, child_id: CHILD }]);
  const hw = async (door_id, title, mode, due_on, created_at) => store.saveHomework({ door_id, homework_ref: crypto.randomUUID(), title, mode, cskills: [FR], count: 4, versions: 0, due_on, approved: [], created_at });
  const h1 = await hw('d1', 'Fractions homework', 'online', '2026-11-13', '2026-11-10T06:00:00Z');   // due Friday, not started
  const h2 = await hw('d1', 'Equivalent fractions', 'online', '2026-11-09', '2026-11-05T06:00:00Z');  // handed in
  const h3 = await hw('d1', 'Simplify', 'paper', '2026-11-12', '2026-11-10T06:00:00Z');
  const h4 = await hw('d2', 'Not this school', 'online', '2026-11-12', '2026-11-10T06:00:00Z');
  const items = [item(1, FR), item(2, FR), item(3, SIMP), item(4, SIMP)];
  await store.saveSittings([
    { homework_id: h1.id, learner_ref: 'AAAAAAAA', code: 'CODEAAAA22', seed: 's', items, answers: [], status: 'issued' },
    { homework_id: h2.id, learner_ref: 'AAAAAAAA', code: 'CODEAAAA33', seed: 's', items: [...items, item(5, FR), item(6, FR)], status: 'submitted', finished_at: '2026-11-10T15:00:00Z',
      answers: [ans(1, true, '2026-11-09T15:00:00Z'), ans(2, true, '2026-11-10T15:00:00Z'), ans(3, false, '2026-11-10T15:00:00Z'), ans(4, true, '2026-11-11T08:00:00Z'), ans(5, true, '2026-11-11T08:00:00Z'), ans(6, true, '2026-11-11T08:01:00Z')] },
    { homework_id: h3.id, learner_ref: 'AAAAAAAA', code: 'CODEAAAA44', seed: 's', items, answers: [], status: 'issued' },
    // Someone else at the same school, and the same reference at another school.
    { homework_id: h1.id, learner_ref: 'BBBBBBBB', code: 'CODEBBBB22', seed: 's', items, answers: [ans(1, false, '2026-11-11T07:00:00Z')], status: 'started' },
    { homework_id: h4.id, learner_ref: 'AAAAAAAA', code: 'CODEOTHR22', seed: 's', items, answers: [], status: 'issued' },
  ]);
  return store;
}
const linkOf = async (door, ref, secret = SECRET) => `${door}-${ref}-${await linkCheck(secret, door, ref)}`;
const deps = (store, extra = {}) => ({ store, now: () => NOW, ipKey: 'ip-1', userId: async () => null, ...extra });

test('a valid link code opens that learner\'s home, and only theirs', async () => {
  const store = await world();
  const r = await learnerHomework({ action: 'learner_home', link: (await linkOf('WSL', 'AAAAAAAA')).toLowerCase() }, deps(store));
  assert.equal(r.status, 200);
  const h = r.body.home;
  assert.equal(h.school, 'Example Academy');
  const text = JSON.stringify(r.body);
  assert.ok(!text.includes('CODEBBBB22') && !text.includes('BBBBBBBB'), 'another learner at the school is never in it');
  assert.ok(!text.includes('CODEOTHR22') && !text.includes('Not this school'), 'the same reference at another school is not this learner');
  assert.ok(!text.includes('AAAAAAAA'), 'not even the learner\'s own reference');
  assert.ok(!/"(answer|answers|items|wrong|options|mis|chosen|secret|first_name|last_name|name_of|phone)"/.test(text), 'no answers, no misconception codes, no names');
  assert.ok(!text.includes(SECRET));
  // The order: online and due first; paper after; the handed-in one under Done with its score.
  assert.deepEqual(h.todo.map(t => [t.title, t.status]), [['Fractions homework', 'issued'], ['Simplify', 'paper']]);
  assert.equal(h.todo[0].code, 'CODEAAAA22');
  assert.equal(h.todo[1].code, undefined, 'paper homework has no link');
  assert.deepEqual(h.done.map(d => [d.title, d.right, d.total]), [['Equivalent fractions', 5, 6]]);
});

test('a wrong check, an unknown or closed school and a bad code all get the same answer', async () => {
  const store = await world();
  const good = await linkOf('WSL', 'AAAAAAAA');
  const bad = [good.slice(0, -1) + (good.endsWith('A') ? 'B' : 'A'), await linkOf('XYZ', 'AAAAAAAA'), await linkOf('OFF', 'AAAAAAAA'), await linkOf('WSL', 'AAAAAAAA', OTHER_SECRET), 'nonsense', '', null];
  const answers = new Set();
  for (const link of bad) {
    const r = await learnerHome({ action: 'learner_home', link }, deps(store));
    assert.equal(r.status, 404); assert.equal(r.body.success, false); assert.equal(r.body.home, undefined);
    answers.add(r.body.error);
  }
  assert.equal(answers.size, 1, 'nothing to learn from which part was wrong');
  assert.equal(store.tries.length, bad.length, 'each wrong one counted');
});

test('ten wrong codes an hour per address, then even a right code waits; another address is not held up', async () => {
  const store = await world();
  const good = await linkOf('WSL', 'AAAAAAAA');
  for (let i = 0; i < HOME_TRIES_PER_HOUR; i++) assert.equal((await learnerHome({ link: 'WSL-AAAAAAAA-ZZZZ' }, deps(store))).status, 404);
  const held = await learnerHome({ link: good }, deps(store));
  assert.equal(held.status, 429); assert.match(held.body.error, /Wait an hour/);
  assert.equal((await learnerHome({ link: good }, deps(store, { ipKey: 'ip-2' }))).status, 200);
  // An hour later it opens again.
  assert.equal((await learnerHome({ link: good }, deps(store, { now: () => NOW + 3601 * 1000 }))).status, 200);
});

test('the family app: the same home for a child the parent linked, nothing for anyone else', async () => {
  const store = await world();
  const signedIn = deps(store, { userId: async () => PARENT });
  const r = await learnerHome({ action: 'learner_home', child: CHILD }, signedIn);
  assert.equal(r.status, 200); assert.equal(r.body.linked, true);
  const viaLink = await learnerHome({ link: await linkOf('WSL', 'AAAAAAAA') }, deps(store));
  assert.deepEqual(r.body.home, viaLink.body.home, 'one home, two doors');
  assert.equal((await learnerHome({ child: CHILD }, deps(store))).status, 401, 'signed out');
  const other = await learnerHome({ child: CHILD }, deps(store, { userId: async () => '33333333-3333-4333-8333-333333333333' }));
  assert.deepEqual(other.body, { success: true, linked: false }, 'another parent learns nothing');
  assert.equal((await learnerHome({ child: 'not-a-uuid' }, signedIn)).status, 400);
});

test('the next step, the streak, got it and practise next follow the answers', async () => {
  const store = await world();
  const h = (await learnerHome({ link: await linkOf('WSL', 'AAAAAAAA') }, deps(store))).body.home;
  assert.equal(h.today, '2026-11-11');
  // Answers on the 9th, 10th and 11th (Nairobi): three days in a row, today included.
  assert.deepEqual(h.streak, { days: 3, today: true, week: ['05', '06', '07', '08', '09', '10', '11'].map(d => ({ day: `2026-11-${d}`, done: ['09', '10', '11'].includes(d) })) });
  // Equivalent fractions: 4 answers, 4 right: got it. Simplify: 1 of 2 right: practise next.
  assert.deepEqual(h.mastered.map(m => m.code), [FR]);
  assert.deepEqual(h.practise.map(p => [p.code, p.right, p.of]), [[SIMP, 1, 2]]);
  assert.equal(h.practise[0].topic, 'Fractions');
  // Yesterday's streak still counts until today ends; a gap breaks it.
  const b = buildHome('S', [{ homework: { title: 't', mode: 'online' }, sitting: { status: 'started', items: [item(1, FR), item(2, FR)], answers: [ans(1, true, '2026-11-10T10:00:00Z')] } }], NOW);
  assert.deepEqual([b.streak.days, b.streak.today], [1, false]);
  const gapped = buildHome('S', [{ homework: { title: 't', mode: 'online' }, sitting: { status: 'started', items: [item(1, FR)], answers: [ans(1, true, '2026-11-08T10:00:00Z')] } }], NOW);
  assert.equal(gapped.streak.days, 0);
  // 21:30 UTC is the next morning in Nairobi.
  assert.equal(dayOf(Date.parse('2026-11-10T21:30:00Z')), '2026-11-11');
  // Long overdue and never handed in: off the to-do list.
  const old = buildHome('S', [{ homework: { title: 'Old', mode: 'online', due_on: '2026-10-01' }, sitting: { status: 'issued', code: 'X', items: [item(1, FR)], answers: [] } }], NOW);
  assert.deepEqual([old.todo.length, old.done[0].status], [0, 'missed']);
  // Something started comes before something not started, then the soonest due.
  const order = buildHome('S', [
    { homework: { title: 'Later', mode: 'online', due_on: '2026-11-20' }, sitting: { status: 'issued', code: 'L', items: [item(1, FR)], answers: [] } },
    { homework: { title: 'Soon', mode: 'online', due_on: '2026-11-12' }, sitting: { status: 'issued', code: 'S', items: [item(1, FR)], answers: [] } },
    { homework: { title: 'Begun', mode: 'online', due_on: '2026-11-25' }, sitting: { status: 'started', code: 'B', items: [item(1, FR), item(2, FR)], answers: [ans(1, true, '2026-11-11T07:00:00Z')] } },
  ], NOW);
  assert.deepEqual(order.todo.map(t => t.title), ['Begun', 'Soon', 'Later']);
});

test('the drawing: one obvious next step, calm when nothing is due, plain words, no emojis or em dashes', async () => {
  const store = await world();
  const h = (await learnerHome({ link: await linkOf('WSL', 'AAAAAAAA') }, deps(store))).body.home;
  const html = homeHtml(h, { hwBase: 'https://tutagora.com' });
  assert.match(html, /Do this next/);
  assert.match(html, /Fractions homework<\/h2><p class="lh-next-l">4 questions, due Friday\.<\/p>/);
  assert.match(html, /href="https:\/\/tutagora.com\/hw\/\?c=CODEAAAA22"[^>]*>Start<\/a>/);
  assert.match(html, /3<\/b><span>days in a row/);
  assert.match(html, /On paper, due tomorrow\. Your teacher has the worksheet\./);
  assert.match(html, /Handed in yesterday/);
  assert.match(html, /You have got these/); assert.match(html, /Practise next/);
  assert.equal((html.match(/class="lh-go"/g) || []).length, 1, 'one big button');
  const calm = homeHtml({ school: 'S', today: '2026-11-11', todo: [], done: [], mastered: [], practise: [], streak: { days: 0, today: false, week: [] } });
  assert.match(calm, /All done\.<\/h2><p>Next homework will show here\.<\/p>/);
  assert.match(calm, /Your next homework starts a streak/);
  for (const t of [html, calm, HOME_CSS]) {
    assert.doesNotMatch(t, /—/, 'no em dash');
    assert.doesNotMatch(t, /\p{Extended_Pictographic}/u, 'no emojis');
  }
  // A teacher's title is escaped, never markup.
  const x = homeHtml({ today: '2026-11-11', school: '<b>S</b>', todo: [{ title: '<img src=x onerror=alert(1)>', status: 'issued', total: 3, answered: 0, code: 'C"D' }], done: [], streak: { days: 0, week: [] } });
  assert.ok(!x.includes('<img') && !x.includes('<b>S</b>') && !x.includes('c=C"D'));
  // In the app: no page heading of its own.
  assert.doesNotMatch(homeHtml(h, { inApp: true }), /Your homework<\/h1>/);
  // Started, locked, overdue.
  const v = (t) => homeHtml({ today: '2026-11-11', todo: [t], done: [], streak: { days: 0, week: [] } });
  assert.match(v({ title: 'T', status: 'started', total: 10, answered: 3, code: 'C', due_on: '2026-11-13' }), /You are on question 4 of 10, due Friday\.[\s\S]*>Carry on</);
  assert.match(v({ title: 'T', status: 'locked', total: 10, answered: 3, lock_question: 4 }), /Locked at question 4\. Ask your teacher to open it again\./);
  assert.doesNotMatch(v({ title: 'T', status: 'locked', total: 10, answered: 3, lock_question: 4 }), /lh-go/);
  assert.match(v({ title: 'T', status: 'issued', total: 10, answered: 0, code: 'C', due_on: '2026-11-09' }), /was due Monday\. You can still do it\./);
  assert.equal(dueWords('2026-11-11', '2026-11-11'), 'due today');
  assert.equal(dayWords('2026-11-30', '2026-11-11'), '30 November');
});

test('public/hw/home.js is built from the tested drawing, and the page asks once', async () => {
  const { buildHomeJs } = await import('../scripts/build-school-practice-fn.mjs');
  assert.ok(readFileSync(new URL('../public/hw/home.js', import.meta.url), 'utf8') === await buildHomeJs(), 'public/hw/home.js is out of date: run npm run build:school-fn');
  const page = readFileSync(new URL('../public/hw/index.html', import.meta.url), 'utf8');
  assert.match(page, /action: 'learner_home', link: homeCode/);
  assert.ok(Buffer.byteLength(await buildHomeJs()) < 16000, 'small');
  const fn = readFileSync(new URL('../supabase/functions/school-homework/index.ts', import.meta.url), 'utf8');
  assert.match(fn, /learner_home/);
  const sql = readFileSync(new URL('../supabase/migrations/20261111_learner_home.sql', import.meta.url), 'utf8');
  assert.match(sql, /revoke all on public\.school_home_attempts from anon, authenticated/);
  assert.doesNotMatch(sql.replace(/--.*$/gm, ''), /\b(first_name|last_name|phone|ip_address)\b/);
});
