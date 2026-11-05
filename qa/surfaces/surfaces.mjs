// ============================================================================
// EVERY SURFACE, SCREENSHOTTED — test code only. Opens the running dev server in
// Playwright as each kind of person, with invented data, at laptop and phone.
//
// NOTHING REACHES THE LIVE DATABASE: every request that is not to the local dev
// server is answered from the fixtures below or refused, before it leaves the
// browser. Writes are answered with an empty success and go nowhere.
//
//   node qa/surfaces/surfaces.mjs --out <dir> [--base http://localhost:5199] [--only tutor]
//
// Playwright is not a dependency of this repo: PLAYWRIGHT_DIR points at any
// folder with it installed. Prints one line per surface: its shell facts.
// ============================================================================
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg('--out', 'qa/surfaces/out');
const BASE = arg('--base', 'http://localhost:5199');
const ONLY = arg('--only', null);
const require = createRequire(join(process.env.PLAYWRIGHT_DIR || '.', 'x.js'));
const { chromium } = require('playwright');

const SB = 'dlqbiayaqjucxsvbesms.supabase.co';
const iso = (d = 0) => new Date(Date.now() + d * 864e5).toISOString();
const date = (d = 0) => iso(d).slice(0, 10);

const USERS = {
  parent: { id: 'p0000000-0000-4000-8000-000000000001', email: 'amina@example.test', role: 'student', full_name: 'Amina Otieno', type: 'parent' },
  learner: { id: 'l0000000-0000-4000-8000-000000000002', email: 'brian@example.test', role: 'student', full_name: 'Brian Mwangi', type: 'student' },
  tutor: { id: 't0000000-0000-4000-8000-000000000003', email: 'grace@example.test', role: 'tutor', full_name: 'Grace Njeri', type: 'tutor' },
  tutorReview: { id: 't0000000-0000-4000-8000-000000000004', email: 'peter@example.test', role: 'tutor', full_name: 'Peter Kamau', type: 'tutor' },
  tutorNew: { id: 't0000000-0000-4000-8000-000000000006', email: 'new@example.test', role: 'tutor', full_name: 'New Tutor', type: 'tutor' },
  parentExpired: { id: 'p0000000-0000-4000-8000-000000000007', email: 'late@example.test', role: 'student', full_name: 'Late Parent', type: 'parent' },
  admin: { id: 'a0000000-0000-4000-8000-000000000005', email: 'mutualevy@gmail.com', role: 'student', full_name: 'Example Admin', type: 'parent' },
};
const tutorRow = (u, over = {}) => ({ id: 'tt' + u.id.slice(2), user_id: u.id, subject: 'Mathematics', subjects: ['Mathematics', 'Physics'], bio: 'Invented bio. Ten years teaching upper primary and junior secondary maths.',
  hourly_rate: 1200, rating: 4.8, reviews_count: 12, students_total: 9, verified: true, verification_status: 'approved', id_document_url: 'x', experience_years: 10, grades: ['Grade 6', 'Grade 7'], profiles: { full_name: u.full_name, avatar_url: null, email: u.email }, ...over });
const kids = (parent) => [{ id: 'k1', parent_id: parent, name: 'Zawadi Otieno', grade: 'Grade 6', avatar: null, created_at: iso(-30) }, { id: 'k2', parent_id: parent, name: 'Tumaini Otieno', grade: 'Grade 4', avatar: null, created_at: iso(-20) }];

function fixtures(u) {
  const t = u && u.role === 'tutor' ? tutorRow(u, u === USERS.tutorReview ? { verified: false, verification_status: 'under_review' } : {}) : tutorRow(USERS.tutor);
  const bookings = [
    { id: 'b1', student_id: USERS.parent.id, tutor_id: t.id, subject: 'Mathematics', learner_name: 'Zawadi Otieno', learner_grade: 'Grade 6', lesson_date: date(2), start_time: '16:00:00', duration_minutes: 60, status: 'confirmed', focus_note: 'Fractions with unlike denominators', price: 1200, profiles: { full_name: 'Amina Otieno', email: USERS.parent.email }, tutors: t },
    { id: 'b2', student_id: USERS.parent.id, tutor_id: t.id, subject: 'Physics', learner_name: 'Tumaini Otieno', learner_grade: 'Grade 4', lesson_date: date(3), start_time: '17:00:00', duration_minutes: 30, status: 'pending', price: 600, profiles: { full_name: 'Amina Otieno' }, tutors: t },
    { id: 'b3', student_id: USERS.parent.id, tutor_id: t.id, subject: 'Mathematics', learner_name: 'Zawadi Otieno', lesson_date: date(-7), start_time: '16:00:00', duration_minutes: 60, status: 'completed', price: 1200, profiles: { full_name: 'Amina Otieno' }, tutors: t },
  ];
  return {
    profiles: u ? [{ id: u.id, role: u.role, full_name: u.full_name, email: u.email, created_at: iso(-90) }] : [],
    tutors: u === USERS.tutorNew ? [] : u && u.role === 'tutor' ? [t] : [t, tutorRow({ id: 'x0000000-0000-4000-8000-000000000009', full_name: 'Daniel Mutua', email: 'd@example.test' }, { subject: 'English', hourly_rate: 900 })],
    bookings, children: u === USERS.parent || u === USERS.parentExpired || u === USERS.admin ? kids(u.id) : [], availability: [{ id: 'av1', tutor_id: t.id, day_of_week: 1, start_time: '16:00:00', end_time: '19:00:00' }],
    payments: [{ id: 'pay1', amount: 1200, status: 'completed', created_at: iso(-7), tutor_id: t.id, bookings: { lesson_date: date(-7), subject: 'Mathematics', status: 'completed' }, tutor: t, payout_status: 'pending' }],
    group_classes: [{ id: 'g1', tutor_id: t.id, title: 'KPSEA maths revision', description: 'Invented class.', subject: 'Mathematics', class_type: 'academic', max_students: 10, price_per_student: 500, lesson_date: date(5), start_time: '09:00', duration_minutes: 60, status: 'open', group_class_enrollments: [{ id: 'e1', student_id: 's1', profiles: { full_name: 'Learner One' } }], tutors: t }],
    subscriptions: u ? [{ user_id: u.id, plan: 'week', pro_until: iso(u === USERS.parentExpired ? -2 : 5) }] : [],
    reviews: [], messages: [], lesson_messages: [], avatars: [], assignments: [], classes: [], class_members: [], response_events: [], learner_goals: [], family_messages: [], compositions: [], report_settings: [], weekly_reports: [], ai_tutor_progress: u === USERS.learner ? [{ user_id: u.id, profile_key: u.id, learner_id: null, total_xp: 840, current_streak: 4, diagnosed: true, progress: { skills: { 'add-fractions-unlike': { mastered: false, attempts: 6, correct: 3 } }, curriculum: 'cbc', declaredGrade: 6, placementGrade: 6, dailyXP: 20, dailyDate: new Date().toDateString(), practiceDays: [date(0), date(-1), date(-2), date(-3)] } }] : [], rocket_challenges: [], rocket_teams: [], rocket_members: [], rocket_log: [], rocket_flights: [], rocket_schools: [], rocket_school_staff: [], rocket_messages: [], device_tokens: [], child_devices: [], progress_snapshots: [], group_class_enrollments: [],
  };
}

async function wire(ctx, u) {
  const fx = fixtures(u);
  await ctx.route('**/*', async (route) => {
    const req = route.request(); const url = new URL(req.url());
    if (url.hostname === 'localhost') return route.continue();
    if (url.hostname !== SB) return route.abort();
    const json = (b, status = 200, headers = {}) => route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*', ...headers }, body: JSON.stringify(b) });
    if (req.method() === 'OPTIONS') return json({});
    if (url.pathname.startsWith('/auth/v1/user')) return u ? json(authUser(u)) : json({ message: 'no' }, 401);
    if (url.pathname.startsWith('/auth/v1/')) return json({});
    if (url.pathname.startsWith('/rest/v1/rpc/')) return json([]);
    if (url.pathname.startsWith('/functions/v1/') || url.pathname.startsWith('/storage/')) return json({});
    if (url.pathname.startsWith('/rest/v1/')) {
      if (req.method() !== 'GET' && req.method() !== 'HEAD') return json([], 201);
      const table = url.pathname.split('/').pop();
      let rows = fx[table] || [];
      const single = (req.headers()['accept'] || '').includes('vnd.pgrst.object');
      if (table === 'profiles' && !single && u !== USERS.admin) rows = rows;
      const hdr = { 'content-range': `0-${Math.max(rows.length - 1, 0)}/${rows.length}` };
      if (single) return rows[0] ? json(rows[0], 200, hdr) : json({ code: 'PGRST116', message: 'none' }, 406);
      return json(rows, 200, hdr);
    }
    return json({});
  });
}
const authUser = (u) => ({ id: u.id, aud: 'authenticated', role: 'authenticated', email: u.email, created_at: iso(-90), user_metadata: { full_name: u.full_name, role: u.role, account_type: u.type }, app_metadata: {} });
const session = (u) => ({ access_token: 'x.' + Buffer.from(JSON.stringify({ exp: 4102444800, sub: u.id })).toString('base64') + '.x', refresh_token: 'r', token_type: 'bearer', expires_in: 3e8, expires_at: 4102444800, user: authUser(u) });

const click = (txt) => async (p) => { await p.getByRole('button', { name: txt }).first().click({ timeout: 4000 }); await p.waitForTimeout(500); };
// A menu item, by its label: in the sidebar on a laptop, on the bar or under More on a phone.
const tab = (label, short = label) => async (p) => {
  const names = [label, short];
  for (const n of names) { const b = p.getByRole('button', { name: n, exact: true }).locator('visible=true').first(); if (await b.count()) { await b.click({ timeout: 4000 }); await p.waitForTimeout(500); return; } }
  await p.getByRole('button', { name: 'More', exact: true }).click({ timeout: 4000 }); await p.waitForTimeout(200);
  await p.getByRole('button', { name: label, exact: true }).locator('visible=true').first().click({ timeout: 4000 }); await p.waitForTimeout(500);
};
// name, who, path, what to do once open.
export const SURFACES = [
  ['public-home', null, '/'], ['public-tutors', null, '/tutors'], ['public-teach', null, '/teach'], ['public-why', null, '/why'],
  ['public-schools', null, '/schools'], ['public-clubs', null, '/clubs'], ['public-consulting', null, '/consulting'], ['public-privacy', null, '/privacy'],
  ['signin-sheet', null, '/', async (p) => { await p.getByRole('button', { name: 'Sign in' }).first().click(); await p.waitForTimeout(400); }],
  ['free-check', null, '/check'],
  ['parent-home', 'parent', '/dashboard'], ['parent-family', 'parent', '/family'], ['parent-handover', 'parent', '/handover'],
  ['parent-find-tutors', 'parent', '/tutors'], ['parent-clubs', 'parent', '/clubs'], ['parent-spreadsheet', 'parent', '/spreadsheet'],
  ['parent-account', 'parent', '/dashboard', async (p) => { await (await p.locator('.hb-me').count() ? p.locator('.hb-me').first() : p.getByRole('button', { name: /Account/ }).first()).click({ timeout: 4000 }); await p.waitForTimeout(400); }],
    ['learner-home', 'learner', '/dashboard'], ['learner-board', 'learner', '/ai'], ['learner-new', 'parent', '/ai'], ['native-home', 'parent', '/', null, true], ['native-myspace', 'parent', '/dashboard', null, true],  ['learner-writing', 'learner', '/writing'], ['learner-rocket', 'learner', '/rocket?demo=1'],
  ['payment-pass', 'parentExpired', '/dashboard', async (p) => { await p.getByRole('button', { name: /Get a pass/ }).first().click({ timeout: 4000 }); await p.waitForTimeout(500); }],
  ['tutor-booking', 'parent', '/tutors', async (p) => { await p.locator('.trow button, .trow a').first().click({ timeout: 4000 }); await p.waitForTimeout(600); }],
  ['tutor-onboarding', 'tutorNew', '/dashboard'],
  ['parent-rocket', 'parent', '/rocket?demo=1&as=parent'],
  ['tutor-overview', 'tutor', '/dashboard'],
  ['tutor-schedule', 'tutor', '/dashboard', tab('Schedule')], ['tutor-students', 'tutor', '/dashboard', tab('Students')],
  ['tutor-group-classes', 'tutor', '/dashboard', tab('Group classes', 'Groups')], ['tutor-earnings', 'tutor', '/dashboard', tab('Earnings')], ['tutor-profile', 'tutor', '/dashboard', tab('Profile')],
  ['tutor-under-review', 'tutorReview', '/dashboard'], ['tutor-find-tutors', 'tutor', '/tutors'], ['tutor-spreadsheet', 'tutor', '/spreadsheet'], ['tutor-account', 'tutor', '/dashboard', async (p) => { await p.locator('.hb-me').first().click({ timeout: 4000 }); await p.waitForTimeout(400); }],
  ['teacher-home', 'tutor', '/classroom?demo=1'],
  ['teacher-class', 'tutor', '/classroom?demo=1', async (p) => { const side = p.locator('.hb-cls').first(); if (await side.isVisible().catch(() => false)) await side.click({ timeout: 4000 }); else await p.locator('.tt-crow .tt-go').first().click({ timeout: 4000 }); await p.waitForTimeout(500); }],
  ['teacher-practice', 'tutor', '/classroom?demo=1', tab('Set practice')],
  ['teacher-rocket', 'tutor', '/rocket?demo=1&as=teacher'],
  ['admin', 'admin', '/admin'],
  ['tutor-messages', 'tutor', '/dashboard', async (p) => { await p.getByRole('button', { name: 'Messages' }).first().click({ timeout: 4000 }); await p.waitForTimeout(500); }],
  ['tutor-more', 'tutor', '/dashboard', async (p) => { const m = p.locator('.hb-tabbar button:has-text("More")'); if (await m.isVisible()) { await m.click(); await p.waitForTimeout(300); } }],
  ['teacher-demo-signed-out', null, '/classroom?demo=1'], ['public-horeb', null, '/horeb'],
  // A child's handed-over device: no menu, no account, no way out but the PIN.
  ['child-home', 'parent', '/student', null, false, { tg_student_mode: { parentId: USERS.parent.id, learnerId: 'k1', name: 'Zawadi', grade: 'Grade 6', avatar: null } }],
  ['child-board', 'parent', '/ai', null, false, { tg_student_mode: { parentId: USERS.parent.id, learnerId: 'k1', name: 'Zawadi', grade: 'Grade 6', avatar: null } }],
];

export const KIT = { chromium, USERS, wire, session, BASE };
if (process.argv[1].endsWith('surfaces.mjs')) {
const browser = await chromium.launch();
const SIZES = { laptop: { width: 1440, height: 900 }, phone: { width: 390, height: 844 }, ...(arg('--tablet', null) ? { tablet: { width: 1024, height: 768 } } : {}) };
for (const [name, who, path, act, native, store] of SURFACES) {
  if (ONLY && !name.includes(ONLY)) continue;
  for (const [sname, viewport] of Object.entries(SIZES)) {
    const u = who ? USERS[who] : null;
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: sname === 'phone', hasTouch: sname === 'phone', reducedMotion: 'reduce' });
    await wire(ctx, u);
    await ctx.addInitScript(([s, v]) => {
      localStorage.setItem('tutagora_privacy_accepted', 'true');
      if (s) localStorage.setItem('sb-dlqbiayaqjucxsvbesms-auth-token', JSON.stringify(s));
      for (const [k, val] of Object.entries(v || {})) localStorage.setItem(k, JSON.stringify(val));
    }, [u ? session(u) : null, store || null]);
    if (native) await ctx.addInitScript(() => { window.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'ios' }; });
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', (e) => errors.push(e.message.split('\n')[0]));
    let note = '';
    try {
      await p.goto(BASE + path, { waitUntil: 'load' });
      await p.waitForTimeout(1200);
      if (act) await act(p);
      await p.waitForTimeout(600);
    } catch (e) { note = ' ACTION-FAILED: ' + e.message.split('\n')[0]; }
    mkdirSync(OUT, { recursive: true });
    await p.screenshot({ path: join(OUT, `${name}-${sname}.png`) });
    const facts = await p.evaluate((screenW) => ({
      bg: getComputedStyle(document.body).backgroundColor,
      font: getComputedStyle(document.querySelector('h1,h2,button') || document.body).fontFamily.split(',')[0],
      overflow: Math.max(document.documentElement.scrollWidth, innerWidth) > screenW,
      shell: !!document.querySelector('.hb-shell'), bar: !!document.querySelector('.hb-tabbar'), side: !!document.querySelector('.hb-side'),
    }), viewport.width);
    console.log([name, sname, JSON.stringify(facts), errors.length ? 'ERRORS ' + errors.join(' | ') : '', note].join(' '));
    await ctx.close();
  }
}
await browser.close();
}
