// ============================================================================
// WEEKLY REPORT — the Sunday message a parent gets about each child.
//
// Pure and dependency-free on purpose: the app uses it for the in-app preview,
// and scripts/build-weekly-report-fn.mjs inlines this same file into the
// weekly-report edge function, so what the parent previews is what is sent.
// Keep it free of imports and browser/Deno APIs.
//
// No emojis. Plain sentences a busy parent can read in five seconds.
// ============================================================================

const DAY = 86400000;

// Monday to Sunday (UTC dates, like HOREB's practice log) of the week `now` is in.
export const reportWeek = (now = new Date()) => {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const monday = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * DAY);
  const days = Array.from({ length: 7 }, (_, i) => new Date(monday.getTime() + i * DAY).toISOString().slice(0, 10));
  return { start: days[0], days, startMs: monday.getTime(), endMs: monday.getTime() + 7 * DAY };
};

const firstName = (n) => String(n || '').trim().split(/\s+/)[0] || 'Your child';
const listOf = (names) => names.length <= 1 ? (names[0] || '')
  : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;

/**
 * @param {object} a
 * @param {string} a.name           the child's name
 * @param {string[]} a.practiceDays HOREB practice log ('YYYY-MM-DD')
 * @param {object} a.skills         HOREB progress.skills: { id: { mastered, masteredAt, attempts, correct } }
 * @param {(id:string)=>string} a.skillName
 * @param {{target_days:number, reward:string}|null} a.goal
 * @param {{score:number|null, created_at:string}[]} a.essays  this child's marked pieces (any dates)
 * @param {Date} [a.now]
 * @returns {{ text:string, vars:Record<string,string>, stats:object }}
 */
export const buildWeeklyReport = ({ name, practiceDays = [], skills = {}, skillName = (id) => id, goal = null, essays = [], now = new Date() }) => {
  const n = firstName(name);
  const week = reportWeek(now);
  const inWeek = (iso) => { const t = Date.parse(iso); return t >= week.startMs && t < week.endMs; };

  const days = week.days.filter(d => practiceDays.includes(d)).length;

  const masteredNow = Object.entries(skills)
    .filter(([, s]) => s && s.mastered && s.masteredAt && inWeek(s.masteredAt))
    .map(([id]) => skillName(id));

  const stuck = Object.entries(skills)
    .filter(([, s]) => s && !s.mastered && (s.attempts || 0) >= 3 && ((s.correct || 0) / (s.attempts || 1)) < 0.6)
    .sort((a, b) => ((a[1].correct || 0) / a[1].attempts) - ((b[1].correct || 0) / b[1].attempts))
    .map(([id, s]) => ({ name: skillName(id), attempts: s.attempts }))[0] || null;

  const weekEssays = essays.filter(e => e && inWeek(e.created_at));
  const scored = weekEssays.filter(e => Number.isFinite(e.score));
  const best = scored.length ? Math.max(...scored.map(e => e.score)) : null;

  const lines = [`${n}'s week on Tutagora`];
  if (days === 0) {
    lines.push(`${n} didn't practise maths this week. Ten minutes today starts a new streak.`);
  } else {
    lines.push(`Practised maths ${days} of 7 days.`);
    if (masteredNow.length) {
      const shown = masteredNow.slice(0, 3);
      const more = masteredNow.length - shown.length;
      lines.push(`Mastered ${masteredNow.length} ${masteredNow.length === 1 ? 'skill' : 'skills'}: ${listOf(shown)}${more > 0 ? ` and ${more} more` : ''}.`);
    }
  }
  if (stuck) lines.push(`Finding hard: ${stuck.name}. Tried ${stuck.attempts} times, still under 60% correct. A session with a tutor usually clears this.`);
  if (goal) {
    lines.push(days >= goal.target_days
      ? `Goal reached: ${goal.target_days} days. ${n} has earned "${goal.reward}".`
      : `Goal: ${days} of ${goal.target_days} days towards "${goal.reward}".`);
  }
  if (weekEssays.length) {
    lines.push(`Writing: ${weekEssays.length} ${weekEssays.length === 1 ? 'piece' : 'pieces'} marked${best != null ? `, best ${best}/20` : ''}.`);
  }
  lines.push(`Send ${n} a message: tutagora.com/family`);

  // For a WhatsApp template ({{1}}–{{5}}): WhatsApp rejects newlines in variables.
  const vars = {
    1: n,
    2: `${days} of 7 days`,
    3: masteredNow.length ? listOf(masteredNow.slice(0, 3)) : 'no new skills yet',
    4: stuck ? stuck.name : 'nothing flagged',
    5: goal ? `${Math.min(days, goal.target_days)} of ${goal.target_days} days towards ${goal.reward}` : 'no goal set',
  };

  return {
    text: lines.join('\n'),
    vars,
    stats: { weekStart: week.start, days, mastered: masteredNow.length, stuck: stuck?.name || null, goalTarget: goal?.target_days || null, essays: weekEssays.length, bestEssay: best },
  };
};

// "0712 345 678" / "712345678" / "254712345678" / "+254 712 345 678" → "+254712345678".
// Returns null for anything that isn't a plausible Kenyan mobile or +E.164 number.
export const normalisePhone = (raw) => {
  const digits = String(raw || '').replace(/[^\d+]/g, '');
  if (/^\+\d{9,15}$/.test(digits)) return digits;
  const d = digits.replace(/\+/g, '');
  if (/^254[17]\d{8}$/.test(d)) return `+${d}`;
  if (/^0[17]\d{8}$/.test(d)) return `+254${d.slice(1)}`;
  if (/^[17]\d{8}$/.test(d)) return `+254${d}`;
  return null;
};

export default { buildWeeklyReport, reportWeek, normalisePhone };
