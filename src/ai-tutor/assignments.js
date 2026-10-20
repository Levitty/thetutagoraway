// ============================================================================
// ASSIGNMENTS — "master these by Friday", and who has.
//
// The design decision that makes this small: an assignment sets SKILLS, and
// done means MASTERED. HOREB already measures mastery per skill for every
// learner, so completion is derived from data that exists rather than tracked
// again. There is no submissions table, no "mark as done" button, and no
// write path from the student at all — a child does their normal practice and
// the assignment is a lens over it.
//
// Two things follow from that, both worth having:
//   a teacher sees real mastery rather than "opened it and clicked through"
//   nothing can disagree — there is only one record of what a child knows
//
// Everything here is pure: dates in, strings out, no clock of its own. The
// caller passes `today` so a test can sit on any date it likes and so one
// render cannot disagree with another halfway through midnight.
// ============================================================================

/** YYYY-MM-DD for a Date, in local time — the day a person is living in. */
export const isoDay = (d = new Date()) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};

const dayDiff = (a, b) => Math.round(
  (Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`)) / 86400000
);

/**
 * One learner's standing on one assignment.
 * `skillIds` that are not in the graph are dropped by the caller, so every id
 * counted here is one the learner can actually be asked to do.
 */
export const assignmentProgress = (assignment, progress) => {
  const ids = assignment?.skill_ids || [];
  const skills = progress?.skills || {};
  const doneIds = ids.filter(id => skills[id]?.mastered);
  const startedIds = ids.filter(id => !skills[id]?.mastered && (skills[id]?.attempts > 0));
  return {
    total: ids.length,
    done: doneIds.length,
    doneIds,
    // What to hand the learner next: the first set skill they have not
    // mastered, so "Start" always means the right thing.
    nextId: ids.find(id => !skills[id]?.mastered) || null,
    started: startedIds.length > 0 || doneIds.length > 0,
    complete: ids.length > 0 && doneIds.length === ids.length,
    percent: ids.length ? Math.round((doneIds.length / ids.length) * 100) : 0,
  };
};

/**
 * How a due date reads to the person looking at it. Plain words, because
 * "2026-10-23" is a date and "due Friday" is an instruction.
 */
export const dueLabel = (dueOn, today = isoDay()) => {
  if (!dueOn) return { text: 'No due date', tone: 'calm', overdue: false, days: null };
  const days = dayDiff(dueOn, today);
  if (days < 0) return { text: days === -1 ? 'Due yesterday' : `${-days} days overdue`, tone: 'late', overdue: true, days };
  if (days === 0) return { text: 'Due today', tone: 'urgent', overdue: false, days };
  if (days === 1) return { text: 'Due tomorrow', tone: 'urgent', overdue: false, days };
  if (days <= 7) return { text: `Due in ${days} days`, tone: 'soon', overdue: false, days };
  return { text: `Due ${dueOn}`, tone: 'calm', overdue: false, days };
};

/**
 * What a learner should still see. An assignment disappears once it is both
 * finished and past — but never while it is unfinished, however late, because
 * a child who is behind is exactly the child who must not have the work
 * quietly removed from their screen.
 */
export const openForLearner = (assignments, progress, today = isoDay()) =>
  (assignments || [])
    .map(a => ({ ...a, status: assignmentProgress(a, progress), due: dueLabel(a.due_on, today) }))
    .filter(a => !(a.status.complete && a.due.overdue))
    // Soonest first; an overdue one leads, because it is the most urgent thing
    // on the page and sorting by date alone buries it behind everything.
    .sort((a, b) =>
      (b.due.overdue ? 1 : 0) - (a.due.overdue ? 1 : 0)
      || (a.due.days ?? 9999) - (b.due.days ?? 9999)
      || String(a.title).localeCompare(String(b.title)));

/**
 * The teacher's view of one assignment across a roster: who has finished, who
 * has started, who has not touched it. Names, not counts — a count tells a
 * teacher there is a problem and a name tells them who to sit with.
 */
export const assignmentRoster = (assignment, learners) => {
  const done = [], started = [], notStarted = [];
  for (const l of learners || []) {
    const st = assignmentProgress(assignment, l?.progress);
    const row = { id: l.id, name: l.name, done: st.done, total: st.total, percent: st.percent };
    if (st.complete) done.push(row);
    else if (st.started) started.push(row);
    else notStarted.push(row);
  }
  const byProgress = (a, b) => b.percent - a.percent || String(a.name).localeCompare(String(b.name));
  return {
    done: done.sort(byProgress),
    started: started.sort(byProgress),
    notStarted: notStarted.sort((a, b) => String(a.name).localeCompare(String(b.name))),
    count: (learners || []).length,
    // The number a teacher reads first, and the only one that needs no thought.
    percent: (learners || []).length ? Math.round((done.length / learners.length) * 100) : 0,
  };
};
