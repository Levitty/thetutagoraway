// ============================================================================
// THE REPORT TO THE PARENT AFTER A LESSON (11 Nov 2026).
//
// Pure: the facts of one lesson in, a short plain report out. What was worked
// on, what went well, the one idea still being built, one thing to practise at
// home, what the child seems to like. In words a busy parent reads in a minute.
//
// RULES (the owner: "no scores the child would be shamed by"):
//   - no numbers of marks, percentages or "failed"; only what the child could do
//     and what is still being built;
//   - nothing the child said, and nothing about a safeguarding concern, ever goes
//     in: the report is built from the evidence log, the learner model and the
//     profile, never from the transcript;
//   - the same text is shown in the app (lesson_reports.body) and emailed.
// ============================================================================
import { MOVES } from '../voice-tutor/commands.js';

const first = (n) => String(n || '').trim().split(/\s+/)[0] || 'Your child';
const lc = (s) => { const t = String(s || '').trim(); return t ? t[0].toLowerCase() + t.slice(1) : t; };
const list = (xs) => (xs.length <= 1 ? xs[0] || '' : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// One thing to practise at home, from what helped this child or, failing that, the skill itself. Kenyan things to hand.
const AT_HOME = {
  'drawing it': (name, skill) => `Ask ${name} to draw ${lc(skill)} on paper, then to explain the drawing to you.`,
  'counting together': (name, skill) => `Count pieces of a chapati or mandazi together with ${name}, and talk about ${lc(skill)}.`,
  'a real-life example': (name, skill) => `Share a chapati or a loaf of bread with ${name} and ask how much each person gets. This is ${lc(skill)}.`,
  'saying it aloud': (name, skill) => `Ask ${name} to say, in their own words, how to ${lc(skill)}.`,
};
const GENERIC = (name, skill) => `Fold a piece of paper into equal parts with ${name}, shade some parts, and ask what fraction is shaded. This builds ${lc(skill)}.`;

/**
 * @param {object} a
 * @param {string} a.childName
 * @param {object[]} a.rows       this lesson's evidence rows (source tutor, this session)
 * @param {string} a.target       the lesson's target skill code
 * @param {{skills:object}} a.model   readSkills() after the lesson
 * @param {object[]} a.open       openMisconceptions() after the lesson
 * @param {{interests:string[], what_helps:object[]}|null} a.profile   after the lesson
 * @param {(c:string)=>string} a.nameOf
 * @param {object} [a.lib]
 * @param {string} [a.date]       'YYYY-MM-DD'
 */
export function buildLessonReport({ childName, rows = [], target, model, open = [], profile = null, nameOf, lib = {}, date = '' }) {
  const name = first(childName);
  const bySkill = new Map();
  for (const r of rows) { const k = r.cskill || r.skill_id; if (!k) continue; if (!bySkill.has(k)) bySkill.set(k, []); bySkill.get(k).push(r); }
  const tried = [...bySkill.keys()];
  const wentWell = tried.filter((k) => { const l = bySkill.get(k); return l.filter((r) => r.correct).length / l.length >= 0.6; });
  const canDo = tried.filter((k) => model?.skills?.[k]?.secure);
  // The one idea still being built: an open misconception on a skill from this lesson, else the target if it is not secure yet.
  const gapMis = open.find((o) => tried.includes(o.skill) || o.skill === target) || null;
  const gapSkill = gapMis ? gapMis.skill : (target && !model?.skills?.[target]?.secure && (tried.includes(target) || !tried.length) ? target : null);

  const sections = [];
  sections.push({ title: 'What we worked on', text: tried.length ? `${name} worked on ${list(tried.map((k) => lc(nameOf(k))))}.` : `${name} had a short lesson on fractions.` });
  if (wentWell.length) sections.push({ title: 'What went well', text: `${name} got most of the questions right on ${list(wentWell.map((k) => lc(nameOf(k))))}${canDo.length ? `, and can now ${canDo.length === 1 ? 'do this' : 'do these'} confidently: ${list(canDo.map((k) => lc(nameOf(k))))}` : ''}.` });
  else if (tried.length) sections.push({ title: 'What went well', text: `${name} kept trying and explained their thinking, which is what lets us find what to teach next.` });
  if (gapSkill) {
    const err = gapMis ? lib?.[gapMis.code]?.error : null;
    sections.push({ title: 'One idea still being built', text: `${nameOf(gapSkill)}.${err ? ` Sometimes ${lc(err).replace(/\.$/, '')}.` : ''} This is normal at this stage, and the next lesson starts here.` });
  }
  const helped = (profile?.what_helps || []).find((e) => e.helped && AT_HOME[e.move]);
  const homeSkill = gapSkill || target || tried[0];
  if (homeSkill) sections.push({ title: 'One thing to try at home', text: (helped ? AT_HOME[helped.move] : GENERIC)(name, nameOf(homeSkill)) });
  const likes = profile?.interests || [];
  if (likes.length) sections.push({ title: 'What they like', text: `${name} mentioned ${list(likes.slice(0, 3))}. We use things they like in the examples.` });
  const helpedMoves = (profile?.what_helps || []).filter((e) => e.helped && MOVES.includes(e.move)).map((e) => e.move);
  if (helpedMoves.length) sections.push({ title: 'How they learn well', text: `${name} seems to learn well with ${list(helpedMoves.slice(0, 3))}.` });

  const subject = `${name}'s HOREB lesson${date ? ` on ${date}` : ''}`;
  const text = sections.map((s) => `${s.title}\n${s.text}`).join('\n\n');
  const html = `<p style="font-size:15px">${esc(name)} had a one-to-one fractions lesson with HOREB, the AI maths tutor.</p>${sections.map((s) => `<p style="margin:14px 0 2px;font-weight:700">${esc(s.title)}</p><p style="margin:0;font-size:15px;line-height:1.5">${esc(s.text)}</p>`).join('')}<p style="color:#667;font-size:13px;margin-top:18px">You can read every lesson report in the HOREB app, under Messages and goals. To stop these emails, turn them off there.</p>`;
  return {
    subject, text, html, sections,
    facts: { target: target || null, tried, went_well: wentWell, secure: canDo, gap: gapSkill, open_misconceptions: open.map((o) => o.code), interests: likes.slice(0, 8), helped: helpedMoves },
  };
}

export default { buildLessonReport };
