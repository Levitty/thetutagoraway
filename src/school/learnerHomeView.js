// ============================================================================
// THE LEARNER HOME, drawn (11 Nov 2026). One component, two doors:
//   public/hw/?l=<link code>   the page with no account (public/hw/home.js is
//                              built from this file: npm run build:school-fn)
//   the family app             AIMastery.jsx, inside the child's home, beside
//                              their own plan
// Both draw the payload of learnerHome.js with homeHtml() and the same CSS
// (HOME_CSS, every class starts lh-). Plain HTML: no library, small, quick on
// a slow phone. Words a ten-year-old reads; British English; no emojis.
// ============================================================================

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ms = (d) => Date.parse(d + 'T00:00:00Z');
const gap = (d, today) => Math.round((ms(d) - ms(today)) / 86400000);
const weekday = (d) => DAYS[new Date(ms(d)).getUTCDay()];

/** A day in words, from today: today, tomorrow, yesterday, Friday, or 21 November. */
export function dayWords(d, today) {
  if (!d) return '';
  const g = gap(d, today);
  if (g === 0) return 'today';
  if (g === 1) return 'tomorrow';
  if (g === -1) return 'yesterday';
  if (Math.abs(g) <= 6) return weekday(d);
  const x = new Date(ms(d));
  return x.getUTCDate() + ' ' + MONTHS[x.getUTCMonth()];
}

/** "due Friday", "was due Monday", or ''. */
export function dueWords(due, today) {
  if (!due) return '';
  return (gap(due, today) < 0 ? 'was due ' : 'due ') + dayWords(due, today);
}

const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);

/** One homework still to do, in words: [the line under the title, the button or ''] */
function todoWords(t, today) {
  const due = dueWords(t.due_on, today);
  const late = t.due_on && gap(t.due_on, today) < 0;
  if (t.status === 'paper') return ['On paper' + (due ? ', ' + due : '') + '. Your teacher has the worksheet.', ''];
  if (t.status === 'locked') return ['Locked at question ' + t.lock_question + '. Ask your teacher to open it again.', ''];
  if (t.status === 'started') return ['You are on question ' + Math.min(t.answered + 1, t.total) + ' of ' + t.total + (due ? ', ' + due : '') + '.', 'Carry on'];
  return [plural(t.total, 'question', 'questions') + (due ? ', ' + due : '') + '.' + (late ? ' You can still do it.' : ''), 'Start'];
}

const link = (hwBase, code) => esc((hwBase || '') + '/hw/?c=' + encodeURIComponent(code));
// The homework page shows "Back to all your homework" when it knows where the child came from.
const remember = "try{sessionStorage.setItem('horeb-home',location.href)}catch(e){}";

export function homeHtml(home, opts = {}) {
  const h = home || {}; const today = h.today; const base = opts.hwBase || '';
  const todo = h.todo || []; const done = h.done || [];
  let out = '<div class="lh">';
  if (!opts.inApp) out += '<div class="lh-top"><span class="lh-brand">HOREB</span>' + (h.school ? '<span class="lh-school">' + esc(h.school) + '</span>' : '') + '</div><h1 class="lh-h1">Your homework</h1>';
  else out += '<div class="lh-eyebrow">Homework from ' + esc(h.school || 'school') + '</div>';

  // One obvious next step.
  const next = todo[0];
  if (next) {
    const [line, go] = todoWords(next, today);
    out += '<section class="lh-next' + (go ? '' : ' lh-next-wait') + '"><p class="lh-next-k">' + (go ? 'Do this next' : 'Next') + '</p><h2 class="lh-next-t">' + esc(next.title) + '</h2><p class="lh-next-l">' + esc(line) + '</p>'
      + (go ? '<a class="lh-go" href="' + link(base, next.code) + '" onclick="' + remember + '">' + go + '</a>' : '') + '</section>';
  } else {
    out += '<section class="lh-calm"><h2 class="lh-calm-t">All done.</h2><p>Next homework will show here.</p></section>';
  }

  // Streak.
  const s = h.streak || { days: 0, week: [] };
  out += '<section class="lh-card lh-streak"><div class="lh-streak-n"><b>' + s.days + '</b><span>' + (s.days === 1 ? 'day in a row' : 'days in a row') + '</span></div>'
    + '<p class="lh-streak-l">' + (s.days === 0 ? (next ? 'Do some homework to start a streak.' : 'Your next homework starts a streak.') : s.today ? 'Homework done today. Well done.' : next ? 'Do some homework today to keep it going.' : 'Well done. Your next homework keeps it going.') + '</p>'
    + '<ol class="lh-week">' + (s.week || []).map(w => '<li class="' + (w.done ? 'lh-on' : '') + (w.day === today ? ' lh-today' : '') + '"><i></i><span>' + weekday(w.day).slice(0, 3) + '</span></li>').join('') + '</ol></section>';

  // The rest still to do.
  if (todo.length > 1) {
    out += '<section class="lh-card"><h3 class="lh-h3">Also to do</h3><ul class="lh-list">' + todo.slice(1).map(t => {
      const [line, go] = todoWords(t, today);
      const inner = '<span class="lh-row-t"><b>' + esc(t.title) + '</b><span>' + esc(line) + '</span></span>';
      return '<li>' + (go ? '<a class="lh-row" href="' + link(base, t.code) + '" onclick="' + remember + '">' + inner + '<span class="lh-open">' + go + '</span></a>' : '<div class="lh-row">' + inner + '</div>') + '</li>';
    }).join('') + '</ul></section>';
  }

  // What the homework shows.
  if ((h.mastered || []).length) {
    out += '<section class="lh-card lh-got"><h3 class="lh-h3">You have got these</h3><ul class="lh-chips">'
      + h.mastered.map(m => '<li><b>' + esc(m.topic || 'Maths') + '</b><span>' + esc(m.name) + '</span></li>').join('') + '</ul></section>';
  }
  if ((h.practise || []).length) {
    out += '<section class="lh-card lh-prac"><h3 class="lh-h3">Practise next</h3><ul class="lh-list">'
      + h.practise.map(p => '<li><div class="lh-row"><span class="lh-row-t"><b>' + esc(p.topic || 'Maths') + '</b><span>' + esc(p.name) + '</span></span><span class="lh-score">' + p.right + ' of ' + p.of + ' right</span></div></li>').join('')
      + '</ul><p class="lh-note">Your teacher sees these too, and sets more homework on them.</p></section>';
  }

  if (done.length) {
    out += '<section class="lh-card"><h3 class="lh-h3">Done</h3><ul class="lh-list">' + done.map(d => {
      const when = d.status === 'submitted' ? 'Handed in ' + (d.finished_on ? dayWords(d.finished_on, today) : '') : 'Not handed in';
      return '<li><div class="lh-row"><span class="lh-row-t"><b>' + esc(d.title) + '</b><span>' + esc(when.trim()) + '</span></span>'
        + (d.status === 'submitted' ? '<span class="lh-score lh-big">' + d.right + ' <small>of ' + d.total + '</small></span>' : '') + '</div></li>';
    }).join('') + '</ul></section>';
  }

  if (!opts.inApp) out += '<p class="lh-foot">Keep this link. Every homework from your school shows here.</p>';
  return out + '</div>';
}

export const HOME_CSS = `
.lh { --lh-ink:#16161A; --lh-ink2:#3A3A44; --lh-muted:#5F6072; --lh-faint:#9A9AA6; --lh-ground:#F4F2EC; --lh-line:#E6E3DA;
  --lh-sun:#FFC93C; --lh-violet:#4318D1; --lh-violet-tint:#ECE8FF; --lh-green:#E2F5E8; --lh-green-ink:#17663A; --lh-pink:#FFF0F5; --lh-pink-ink:#C2255C;
  color: var(--lh-ink); display: grid; gap: 14px; font-size: 17px; line-height: 1.4; }
.lh * { box-sizing: border-box; }
.lh p, .lh h1, .lh h2, .lh h3, .lh ul, .lh ol { margin: 0; }
.lh-top { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
.lh-brand { font-weight: 800; letter-spacing: -.02em; font-size: 15px; color: var(--lh-violet); }
.lh-school { font-size: 13px; color: var(--lh-muted); text-align: right; }
.lh-h1 { font-size: 32px; line-height: 1.05; letter-spacing: -.035em; font-weight: 800; margin-top: 4px; }
.lh-eyebrow { font-size: 11.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--lh-violet); }
.lh-next { background: var(--lh-violet); color: #fff; border-radius: 28px; padding: 22px 20px 20px; }
.lh-next-wait { background: var(--lh-violet-tint); color: var(--lh-ink); }
.lh-next-k { font-size: 13px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--lh-sun); }
.lh-next-wait .lh-next-k { color: var(--lh-violet); }
.lh-next-t { font-size: 28px; line-height: 1.1; letter-spacing: -.03em; font-weight: 800; margin: 6px 0 6px; overflow-wrap: anywhere; }
.lh-next-l { font-size: 17px; opacity: .92; }
.lh-go { display: flex; align-items: center; justify-content: center; min-height: 60px; margin-top: 18px; border-radius: 99px; background: var(--lh-sun);
  color: var(--lh-ink); font-size: 19px; font-weight: 800; text-decoration: none; letter-spacing: -.01em; }
.lh-calm { background: var(--lh-green); color: var(--lh-green-ink); border-radius: 28px; padding: 24px 20px; }
.lh-calm-t { font-size: 28px; font-weight: 800; letter-spacing: -.03em; margin-bottom: 4px; }
.lh-calm p { color: var(--lh-ink2); }
.lh-card { background: #fff; border-radius: 24px; padding: 18px 18px; }
.lh-h3 { font-size: 13px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--lh-muted); margin-bottom: 10px; }
.lh-streak { display: grid; gap: 8px; }
.lh-streak-n { display: flex; align-items: baseline; gap: 10px; }
.lh-streak-n b { font-size: 48px; line-height: 1; font-weight: 800; letter-spacing: -.04em; font-variant-numeric: tabular-nums; }
.lh-streak-n span { font-size: 18px; font-weight: 700; }
.lh-streak-l { color: var(--lh-ink2); font-size: 16px; }
.lh-week { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-top: 4px; }
.lh-week li { display: grid; justify-items: center; gap: 4px; font-size: 12px; color: var(--lh-muted); }
.lh-week i { width: 30px; height: 30px; border-radius: 99px; background: var(--lh-ground); display: block; }
.lh-week .lh-on i { background: var(--lh-sun); }
.lh-week .lh-today i { box-shadow: 0 0 0 2px var(--lh-ink); }
.lh-week .lh-today span { color: var(--lh-ink); font-weight: 800; }
.lh-list { list-style: none; padding: 0; display: grid; gap: 8px; }
.lh-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 60px; padding: 12px 14px; border-radius: 18px;
  background: var(--lh-ground); color: var(--lh-ink); text-decoration: none; }
a.lh-row { border: 2px solid var(--lh-line); background: #fff; }
.lh-row-t { display: grid; gap: 2px; min-width: 0; }
.lh-row-t b { font-size: 17px; font-weight: 800; letter-spacing: -.01em; overflow-wrap: anywhere; }
.lh-row-t span { font-size: 14px; color: var(--lh-muted); }
.lh-open { flex: 0 0 auto; min-height: 44px; padding: 0 18px; border-radius: 99px; background: var(--lh-sun); font-weight: 800; font-size: 15px; display: inline-flex; align-items: center; }
.lh-score { flex: 0 0 auto; font-weight: 800; font-size: 15px; font-variant-numeric: tabular-nums; color: var(--lh-ink2); }
.lh-big { font-size: 24px; color: var(--lh-ink); letter-spacing: -.02em; }
.lh-big small { font-size: 14px; color: var(--lh-muted); font-weight: 700; }
.lh-got { background: var(--lh-green); }
.lh-got .lh-h3 { color: var(--lh-green-ink); }
.lh-chips { list-style: none; padding: 0; display: grid; gap: 8px; }
.lh-chips li { background: #fff; border-radius: 16px; padding: 10px 14px; display: grid; gap: 1px; }
.lh-chips b { font-size: 13px; font-weight: 800; color: var(--lh-green-ink); }
.lh-chips span { font-size: 15px; color: var(--lh-ink2); }
.lh-prac { background: var(--lh-pink); }
.lh-prac .lh-h3 { color: var(--lh-pink-ink); }
.lh-prac .lh-row { background: #fff; }
.lh-prac .lh-row-t b { color: var(--lh-pink-ink); font-size: 14px; }
.lh-prac .lh-row-t span { color: var(--lh-ink2); font-size: 15px; }
.lh-note { font-size: 14px; color: var(--lh-ink2); margin-top: 10px; }
.lh-foot { font-size: 13px; color: var(--lh-faint); text-align: center; padding-top: 8px; }
@media (min-width: 900px) { .lh-h1 { font-size: 40px; } .lh-next-t { font-size: 34px; } }
`;
