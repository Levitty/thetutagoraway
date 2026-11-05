// Walks the menu as each person, at laptop and phone: each item lands on its page,
// the frame stays, and the browser's back button returns. Same mocks as surfaces.mjs.
//   PLAYWRIGHT_DIR=<dir> node qa/surfaces/flows.mjs [--base http://localhost:5199]
import { KIT } from './surfaces.mjs';
const { chromium, USERS, wire, session, BASE } = KIT;
const WALKS = {
  tutor: [['Schedule', '/dashboard?s=schedule'], ['Students', '/dashboard?s=students'], ['Group classes', '/dashboard?s=groupClasses'], ['Earnings', '/dashboard?s=earnings'], ['Classes', '/classroom'],  ['Rocket Challenge', '/rocket'], ['Profile', '/dashboard?s=profile'], ['Spreadsheet', '/spreadsheet'], ['Home', '/dashboard?s=overview']],
  parent: [['Goals and reports', '/family'], ['Find a tutor', '/tutors'], ['Clubs', '/clubs'], ['Home', '/dashboard']],
  learner: [['Lessons', '/dashboard?s=lessons'], ['Writing', '/writing'], ['Rocket Challenge', '/rocket'], ['Find a tutor', '/tutors'], ['Clubs', '/clubs'], ['Home', '/ai?s=overview']],
};
const start = { tutor: '/dashboard', parent: '/dashboard', learner: '/dashboard' };
const browser = await chromium.launch();
let bad = 0;
for (const who of Object.keys(WALKS)) for (const [sname, viewport] of [['laptop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport, isMobile: sname === 'phone', hasTouch: sname === 'phone' });
  await wire(ctx, USERS[who]);
  await ctx.addInitScript((s) => { localStorage.setItem('tutagora_privacy_accepted', 'true'); localStorage.setItem('sb-dlqbiayaqjucxsvbesms-auth-token', JSON.stringify(s)); }, session(USERS[who]));
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message.split('\n')[0]));
  await p.goto(BASE + start[who]); await p.waitForTimeout(1500);
  const seen = [];
  for (const [label, want] of WALKS[who]) {
    try {
      const inNav = p.locator(sname === 'laptop' ? `.hb-side button.hb-nav:text-is("${label}")` : `.hb-tabbar button:has-text("${label}")`).first();
      const short = { 'Goals and reports': 'Family', 'Find a tutor': 'Tutors', 'Set practice': null, 'Rocket Challenge': null, 'Group classes': null }[label];
      const onBar = sname === 'phone' && short ? p.locator(`.hb-tabbar button:has-text("${short}")`).first() : inNav;
      if (await onBar.count()) await onBar.click({ timeout: 3000 });
      else { await p.locator('.hb-tabbar button:has-text("More")').click({ timeout: 3000 }); await p.locator(`.hb-more button.hb-nav:has-text("${label}")`).first().click({ timeout: 3000 }); }
      await p.waitForTimeout(700);
      const url = new URL(p.url()); const got = url.pathname + url.search;
      const frame = await p.locator('.hb-shell').count();
      const ok = got === want && frame === 1;
      if (!ok) { bad++; console.log(`FAIL ${who} ${sname} ${label}: at ${got}, frame ${frame}`); }
      seen.push(got);
    } catch (e) { bad++; console.log(`FAIL ${who} ${sname} ${label}: ${e.message.split('\n')[0]}`); }
  }
  // The back button walks back through the same pages.
  await p.goBack(); await p.waitForTimeout(500);
  const back = new URL(p.url()); const backTo = back.pathname + back.search;
  if (backTo !== seen[seen.length - 2]) { bad++; console.log(`FAIL ${who} ${sname} back: at ${backTo}, expected ${seen[seen.length - 2]}`); }
  if (errs.length) { bad++; console.log(`ERRORS ${who} ${sname}: ${errs.join(' | ')}`); }
  await ctx.close();
}
await browser.close();
console.log(bad ? `${bad} failed` : 'all menu walks pass');
process.exit(bad ? 1 : 0);
