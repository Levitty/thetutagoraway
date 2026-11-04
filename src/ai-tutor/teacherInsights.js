// ============================================================================
// WHAT HOREB TELLS A TEACHER, AND WHAT IT RESTS ON (4 Nov 2026)
//
// The teacher screens were rebuilt on one rule taken from the Edu.ai reference
// the owner chose: every suggestion carries a reason, a source and how sure
// HOREB is. Nothing here measures anything new. It reads the findings the
// engine already makes (findGaps, isStruggling, classGaps, the knowledge
// graph) and says, in words, what each one rests on.
//
// Where a signal does not exist, the line is left out. Skill records carry no
// dates, so a source says "Free check" or "Practice", never a date.
// ============================================================================
import { findGaps, isStruggling, classGaps } from './adaptiveEngine.js';
import { attentionOf } from './classView.js';

const ctxOf = (ctx, progress) => (progress?.curriculum ? { ...ctx, curriculum: progress.curriculum } : ctx);
const list = (ctx) => Object.values(ctx?.skills || {});
const brief = (s) => (s ? { id: s.id, name: s.name, grade: s.grade ?? null, strand: s.strand ?? null } : null);

// ---- evidence ---------------------------------------------------------------

/**
 * Why one learner's record on one skill counts as "getting it wrong", or null
 * when it does not. These are the two clauses of isStruggling, kept apart
 * because they are different evidence: one wrong answer in the free check,
 * or three or more tries here at under 60% right.
 */
export const recordEvidence = (sp) => {
  if (!isStruggling(sp)) return null;
  if (sp.attempts >= 3 && (sp.correct / sp.attempts) < 0.6) return sp.fromDiagnostic && !sp.practisedHere ? 'check' : 'practice';
  return 'check';
};

/**
 * Where a finding about several learners came from, and how sure it is.
 * `items` is [{ progress, skillIds }]: for each learner, the skills whose
 * records the finding rests on (the skill itself, or the skills above a
 * missing foundation). Returns { source, sure } in words, or nulls.
 */
export const evidenceFor = (items) => {
  let check = 0, practice = 0;
  for (const it of items || []) {
    const kinds = (it.skillIds || []).map(id => recordEvidence(it.progress?.skills?.[id])).filter(Boolean);
    if (kinds.includes('practice')) practice += 1;
    else if (kinds.includes('check')) check += 1;
  }
  const source = check && practice ? 'Free check and practice' : check ? 'Free check' : practice ? 'Practice' : null;
  let sure = null;
  if (practice && !check) sure = practice === 1 ? '3 or more tries, under 60% right' : 'Each has 3 or more tries, under 60% right';
  else if (check && !practice) sure = check === 1 ? 'Got it wrong in the free check' : 'Each got it wrong in the free check';
  else if (check && practice) sure = `${practice} with 3 or more tries under 60% right; ${check} wrong in the free check`;
  return { source, sure, check, practice };
};

// ---- one class, by the step each learner is missing --------------------------

/**
 * One group per missing step. A learner goes in exactly one group, the one a
 * teacher would teach them first:
 *   foundation  a skill below that they never mastered, holding up work they
 *               are failing (findGaps' first, deepest-priority answer)
 *   struggling  no foundation missing; getting this skill itself wrong
 *   clear       nothing blocking them
 * Groups are sorted by size; foundations before struggling on a tie, because
 * teaching the foundation is what clears the struggle above it.
 */
export const missingStepGroups = (learners, ctx, now = new Date()) => {
  const groups = new Map();
  const clear = { kind: 'clear', key: 'clear', learners: [], next: null, ahead: 0 };
  const nextTally = new Map();
  for (const l of learners || []) {
    const progress = l.progress || { skills: {} };
    const c = ctxOf(ctx, progress);
    const a = attentionOf(l, now);
    const who = { id: l.id, name: l.name, days: a.days, quiet: a.quiet };
    const gap = findGaps(progress, c)[0];
    if (gap) {
      const key = `foundation:${gap.id}`;
      const above = list(c).filter(s => isStruggling(progress.skills?.[s.id])
        && (s.keyPrerequisites || s.prerequisites || []).includes(gap.id));
      const g = groups.get(key) || { kind: 'foundation', key, skill: brief(gap), above: new Map(), learners: [], items: [] };
      above.forEach(s => g.above.set(s.id, brief(s)));
      g.learners.push(who);
      g.items.push({ progress, skillIds: above.map(s => s.id) });
      groups.set(key, g);
      continue;
    }
    const wrong = list(c).filter(s => isStruggling(progress.skills?.[s.id]))
      .sort((x, y) => (x.grade ?? 99) - (y.grade ?? 99))[0];
    if (wrong) {
      const key = `struggling:${wrong.id}`;
      const g = groups.get(key) || { kind: 'struggling', key, skill: brief(wrong), learners: [], items: [] };
      g.learners.push(who);
      g.items.push({ progress, skillIds: [wrong.id] });
      groups.set(key, g);
      continue;
    }
    clear.learners.push(who);
    if (l.snap?.next) nextTally.set(l.snap.next.name, (nextTally.get(l.snap.next.name) || 0) + 1);
    if (l.snap && (l.snap.accelerated || l.snap.level > (l.snap.declared ?? l.snap.level))) clear.ahead += 1;
  }
  const top = [...nextTally.entries()].sort((a, b) => b[1] - a[1])[0];
  clear.next = top ? top[0] : null;
  const rank = { foundation: 0, struggling: 1 };
  const out = [...groups.values()].map(g => ({
    ...g,
    above: g.above ? [...g.above.values()] : undefined,
    evidence: evidenceFor(g.items),
  })).sort((a, b) => b.learners.length - a.learners.length || rank[a.kind] - rank[b.kind]);
  if (clear.learners.length) out.push(clear);
  return out;
};

// ---- one class, in one line ------------------------------------------------

/**
 * The skill that would unblock the most learners in a class, with the line a
 * teacher reads on the home screen, the reason behind it, and its evidence.
 * `learners` is [{ id, name, progress }]. Null when nothing is wrong.
 */
export const classHeadline = (learners, ctx) => {
  const rows = classGaps(learners, ctx);
  if (!rows.length) return null;
  // The same ranking as the class page's gap finder: most learners first,
  // then the foundation over the symptom.
  const lead = rows[0];
  const total = (learners || []).length;
  const byId = new Map((learners || []).map(l => [l.id, l]));
  const ids = [...lead.blocked, ...lead.failing].map(x => x.id);
  let line, reason, items;
  if (lead.failing.length && !lead.blocked.length) {
    items = lead.failing.map(x => ({ progress: byId.get(x.id)?.progress, skillIds: [lead.id] }));
    const ev = evidenceFor(items);
    line = `${lead.count} of ${total} ${ev.source === 'Free check' ? 'missed it in the free check' : 'are getting it wrong'}.`;
    // A foundation under the same learners is the reason.
    const failing = new Set(lead.failing.map(x => x.id));
    const below = rows.filter(r => r !== lead && r.blocked.length
      && String(r.reason || '').includes(lead.name)
      && r.blocked.some(x => failing.has(x.id)))
      .sort((a, b) => b.blocked.length - a.blocked.length)[0];
    if (below) {
      const n = below.blocked.filter(x => failing.has(x.id)).length;
      const rest = lead.count - n;
      reason = `${n} of the ${lead.count} never mastered ${below.name}${below.grade != null ? ` (Grade ${below.grade})` : ''}, which comes before it.`
        + (rest > 0 ? ` ${rest} ${rest === 1 ? 'has' : 'have'} it and ${rest === 1 ? 'is' : 'are'} struggling with this step.` : '');
    } else {
      reason = 'They are struggling with this step itself, not with a step before it.';
    }
    return { skill: brief(lead), count: lead.count, total, line, reason, evidence: ev, foundation: below ? { ...brief(below), ids: below.blocked.filter(x => failing.has(x.id)).map(x => x.id) } : null, ids };
  }
  items = ids.map(id => {
    const p = byId.get(id)?.progress;
    const above = list(ctxOf(ctx, p)).filter(s => isStruggling(p?.skills?.[s.id])
      && (s.keyPrerequisites || s.prerequisites || []).includes(lead.id)).map(s => s.id);
    return { progress: p, skillIds: [lead.id, ...above] };
  });
  line = `${lead.count} of ${total} never mastered it, and are failing the work that needs it.`;
  reason = lead.reason ? `${lead.reason}.` : 'It comes before work they are failing.';
  return { skill: brief(lead), count: lead.count, total, line, reason, evidence: evidenceFor(items), foundation: { ...brief(lead), ids: lead.blocked.map(x => x.id) }, ids };
};

/**
 * HOREB's one suggestion for the home screen: the largest missing foundation
 * across the teacher's classes. `classes` is [{ id, name, headline }].
 */
export const homeSuggestion = (classes) => {
  const best = (classes || [])
    .filter(c => c.headline?.foundation?.ids?.length)
    .sort((a, b) => b.headline.foundation.ids.length - a.headline.foundation.ids.length)[0];
  if (!best) return null;
  const h = best.headline;
  return {
    classId: best.id,
    className: best.name,
    skill: h.foundation,
    ids: h.foundation.ids,
    above: h.skill.id !== h.foundation.id ? h.skill : null,
    evidence: h.evidence,
  };
};

// ---- three versions of one piece of practice ----------------------------------

const prereqsOf = (s) => s?.keyPrerequisites || s?.prerequisites || [];

/**
 * Support, core and stretch for one skill, each with the learners it fits.
 *   support  the step before it that most of the class has not mastered
 *   core     the skill itself
 *   stretch  the next skill after it in HOREB's knowledge graph
 * Every learner is in exactly one version. Versions with nobody in them, or
 * with no skill to give, are left out.
 */
export const practiceVersions = (learners, coreId, ctx) => {
  const skills = ctx?.skills || {};
  const core = skills[coreId];
  if (!core) return [];
  const all = learners || [];
  const notCore = all.filter(l => !l.progress?.skills?.[coreId]?.mastered);
  // The step before: the prerequisite the most learners still lack.
  const tally = prereqsOf(core).filter(id => skills[id]).map(id => ({
    id, n: notCore.filter(l => !l.progress?.skills?.[id]?.mastered).length,
  })).sort((a, b) => b.n - a.n);
  const support = tally[0]?.n ? skills[tally[0].id] : null;
  let stretch = null;
  try {
    const posts = (ctx.getPostReqs ? ctx.getPostReqs(coreId) : []).map(p => (typeof p === 'string' ? skills[p] : p)).filter(Boolean);
    stretch = posts.sort((a, b) => (a.strand === core.strand ? 0 : 1) - (b.strand === core.strand ? 0 : 1)
      || (a.grade ?? 99) - (b.grade ?? 99))[0] || null;
  } catch { stretch = null; }

  const supportIds = support ? notCore.filter(l => !l.progress?.skills?.[support.id]?.mastered).map(l => l.id) : [];
  const stretchIds = stretch ? all.filter(l => l.progress?.skills?.[coreId]?.mastered).map(l => l.id) : [];
  const taken = new Set([...supportIds, ...stretchIds]);
  const coreIds = all.filter(l => !taken.has(l.id) && !(l.progress?.skills?.[coreId]?.mastered && !stretch)).map(l => l.id);

  return [
    support && { kind: 'support', label: 'SUPPORT', role: 'The step before', skill: brief(support), learnerIds: supportIds,
      why: `Not mastered yet, and it comes before ${core.name}.` },
    { kind: 'core', label: 'CORE', role: 'The goal itself', skill: brief(core), learnerIds: coreIds,
      why: support ? 'They have the step before. This is the new step.' : 'This is the step they are on.' },
    stretch && { kind: 'stretch', label: 'STRETCH', role: 'The step after', skill: brief(stretch), learnerIds: stretchIds,
      why: `Already mastered ${core.name}.` },
  ].filter(v => v && v.learnerIds.length > 0);
};

/** The assignment rows that setting the versions writes: one per version, for its learners only. */
export const practiceRows = (versions, { classId, teacherId = null, dueOn = null }) =>
  (versions || []).filter(v => v.learnerIds?.length).map(v => ({
    class_id: classId,
    teacher_id: teacherId,
    title: v.skill.name,
    skill_ids: [v.skill.id],
    student_ids: [...v.learnerIds],
    due_on: dueOn || null,
  }));

// ---- what the wrong answers say ---------------------------------------------

/**
 * The commonest pattern across a group's wrong answers, from the summary
 * assignmentStruggles() makes. { label, advice, learners, of, examples } or
 * null when the answers show no pattern.
 */
export const groupPattern = (struggles) => {
  const rows = struggles?.learners || [];
  const tally = new Map();
  const examples = [];
  for (const r of rows) {
    for (const c of r.cells || []) {
      if (c.pattern?.id) {
        const t = tally.get(c.pattern.id) || { label: c.pattern.label, advice: c.pattern.advice, learners: 0 };
        t.learners += 1;
        tally.set(c.pattern.id, t);
      }
      for (const w of c.wrong || []) {
        if (w.submitted && w.expected && examples.length < 2 && !examples.some(e => e.submitted === w.submitted)) examples.push(w);
      }
    }
  }
  const top = [...tally.values()].sort((a, b) => b.learners - a.learners)[0];
  if (!top) return null;
  return { ...top, of: rows.length, examples, source: struggles.source };
};
