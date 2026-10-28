// ============================================================================
// TEACHER DASHBOARD — the sellable surface.
//
// Lets a teacher see each student's measured level per subject at a glance:
// who's behind on foundations, who's on track, who's racing ahead. Works on
// the JS engine out of the box; when the Python brain is reachable it overlays
// the sharper continuous level + acceleration flag.
//
// Data source: the `ai_tutor_progress` table (one row per student per subject).
// NOTE: a teacher can only see students whose progress rows their Supabase RLS
// policy permits them to read. Until a class/roster table + policy exist, this
// shows whatever rows are readable and explains the empty state.
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabase.js';
import { SUBJECTS } from './subjects.js';
import {
  getStats, getStrandStats, getEstimatedGradeLevel, findGaps, classGaps,
  getNextToLearn, strandsInReach,
} from './adaptiveEngine.js';
import { assignmentRoster, assignedLearners, audienceLabel, dueLabel, isoDay } from './assignments.js';
import { assignmentStruggles, answerPattern, patternInfo } from './struggles.js';
import { fiveMinuteMove } from './teacherMoves.js';
import { demoMode, demoStudents, demoClasses, demoMembers, demoAssignments, demoEvents } from './demoClass.js';
import { useHorebLook } from './horebLook.js';
import { STRAND_BLOCK } from './strandBlocks.js';
import {
  BUCKETS, bucketCounts, inBucket, sortForTeacher, attentionOf, lastSeenLabel,
  rowToProgress,
} from './classView.js';
import { Icon } from './components/Icons.jsx';
import { isOwnMathRow } from './classRows.js';

const SUBJECT_ID = 'math';
const ASSIGNMENT_COLS = 'id, class_id, title, skill_ids, due_on, created_at';
const EVENT_COLS_BASE = 'student_id, skill_id, correct, hints_used, created_at';
const EVENT_COLS_FULL = `${EVENT_COLS_BASE}, learner_id, skipped, submitted_value, expected_value, client_ts`;

const ctxFor = (subjectId) => {
  const s = SUBJECTS[subjectId];
  return s ? { skills: s.skills, getPostReqs: s.getPostReqs } : null;
};

// `rowToProgress` lives in classView.js — it is the function that was silently
// dropping declaredGrade, placementGrade and curriculum, so it belongs where a
// test can reach it.

// JS-engine snapshot for one student (always available).
const jsSnapshot = (progress, baseCtx) => {
  // Which syllabus THIS child is on. Grade and strand reads route through it,
  // so one ctx shared by the whole class reads a child on another curriculum
  // against the wrong grades. It is stored per child; it was simply never read
  // back out of the row.
  const ctx = progress.curriculum ? { ...baseCtx, curriculum: progress.curriculum } : baseCtx;
  const stats = getStats(progress, ctx);
  const strands = getStrandStats(progress, ctx);
  const grade = getEstimatedGradeLevel(progress, ctx);
  const gaps = findGaps(progress, ctx);
  // Count against what is IN REACH, not the whole graph. The roster read
  // "2/311 skills · 1% mastered" for every child, because the denominator was
  // every skill from Grade 1 to Grade 12 — work a Grade 5 is years from
  // meeting. A teacher learns nothing from a number that is 1% for the child
  // who is struggling and 5% for the child who is flying.
  const declared = progress.declaredGrade ?? grade;
  const all = Object.values(SUBJECTS[SUBJECT_ID]?.skills || {});
  const inReach = all.filter(s => !Number.isFinite(s.grade) || s.grade <= declared);
  const masteredInReach = inReach.filter(s => progress.skills?.[s.id]?.mastered).length;
  return {
    level: grade,
    declared,
    mastered: masteredInReach,
    total: inReach.length,
    percent: inReach.length ? Math.round((masteredInReach / inReach.length) * 100) : 0,
    percentAll: stats.percent,
    accuracy: stats.accuracy,
    // Per strand, counted against what is in reach for the grade the child is
    // in — the same correction the overall count needed. And `assessed` is
    // carried through: the detail page read `s.confidence`, which this map
    // never produced, so a strand the check had never reached drew an empty
    // bar instead of saying "not assessed". Every child looked as though they
    // had failed geometry when they had simply never met it.
    strands: strandsInReach(strands, progress, declared).map(b => ({
      name: b.s.name,
      assessed: !!b.s.assessed,
      accuracy: b.s.accuracy,
      done: b.done,
      total: b.total,
      pct: b.pct,
    })),
    gapCount: gaps.length,
    // Keep the NAMES — "3 gaps" tells a teacher nothing; "Addition —
    // regrouping ones" tells them exactly where to sit down.
    topGaps: gaps.slice(0, 3).map(g => ({ id: g.id, name: g.name, strand: g.strand, grade: g.grade })),
    // The skill this child opens HOREB to next — the engine's own answer, the
    // same one the child is about to be given. A roster row that says
    // "2/13 skills · 15% mastered" tells a teacher nothing they can use; a row
    // that names the skill tells them what the child is working on today.
    next: (() => {
      const n = getNextToLearn(progress, ctx)[0];
      return n ? { id: n.id, name: n.name, strand: n.strand, grade: n.grade } : null;
    })(),
    streak: progress.currentStreak || 0,
    xp: progress.totalXP || 0,
    accelerated: false,
  };
};

// The five-minute moves live in teacherMoves.js, shared with the homework view.

// Behind, near, or ahead of the grade this child is actually IN — not an
// absolute number. The old rule was "level <= 6 is red", which painted every
// child in a primary class red and told a teacher of Grade 4s that their whole
// class was failing. A Grade 5 working at Grade 5 is fine; a Grade 9 working at
// Grade 5 is not, and the same number cannot mean both.
const bandColor = (level, declared) => {
  const d = level - (declared ?? level);
  if (d <= -2) return 'text-red-500 bg-red-50 border-red-200';
  if (d < 0) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-emerald-600 bg-emerald-50 border-emerald-200';
};

export function TeacherDashboard({ onBack, teacherProfile }) {
  // Archivo/Figtree and the HOREB tokens, the same as the learner's screens.
  useHorebLook();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  // Which class is being looked at. The roster table has existed since the
  // first migration and nothing read it, so every number on this page was a
  // number about "everyone whose row I can see" — which is not a class, and
  // not something a teacher teaches.
  const [classId, setClassId] = useState('all');
  const [members, setMembers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  // The table is created by a migration the owner runs. Until they have, every
  // query 404s — so the feature hides itself rather than papering the page
  // with an error a teacher can do nothing about.
  const [assignmentsReady, setAssignmentsReady] = useState(true);
  const [assigning, setAssigning] = useState(null);   // the gap row being set
  const [assignError, setAssignError] = useState(null);
  // Choosing learners needs the 28 Oct migration (assignments.student_ids).
  // Until it is run, work is set for the whole class, as before, and the
  // picker says so instead of failing on save.
  const [learnersReady, setLearnersReady] = useState(true);
  // "Where they struggled": opened per assignment, and its answers fetched
  // only then, so the page does not read every answer for every piece of work
  // on load.
  const [openStruggle, setOpenStruggle] = useState(null);
  const [eventsFor, setEventsFor] = useState({});      // assignment id -> rows | 'loading' | { error }
  // Which question is being asked of the roster — see classView.js.
  const [bucket, setBucket] = useState('all');
  // Join codes and "create a class" are setup. Done once, then permanently in
  // the way: the form used to sit ABOVE the children. Closed unless there is
  // nothing set up yet, in which case it is the only thing to do here.
  const [setupOpen, setSetupOpen] = useState(false);

  const ctx = useMemo(() => ctxFor(SUBJECT_ID), []);
  // ?demo=1 — a class to present with. Nothing is read from or written to the
  // database, and the numbers on screen are still computed by the real engine
  // from these answer histories: the data is invented, the reasoning is not.
  const isDemo = useMemo(() => demoMode(), []);

  // Load the teacher's classes and their rosters (RLS scopes both to classes
  // they own).
  useEffect(() => {
    let cancelled = false;
    if (isDemo) {
      setClasses(demoClasses());
      setMembers(demoMembers());
      setAssignments(demoAssignments());
      return () => { cancelled = true; };
    }
    (async () => {
      const readAssignments = (cols) => supabase.from('assignments').select(cols)
        .order('due_on', { ascending: true, nullsFirst: false });
      const [{ data: cls }, { data: mem }, first] = await Promise.all([
        supabase.from('classes').select('id, name, join_code').order('created_at', { ascending: true }),
        supabase.from('class_members').select('class_id, student_id'),
        readAssignments(`${ASSIGNMENT_COLS}, student_ids`),
      ]);
      // Without the student_ids column, read what there is: every assignment
      // made before it is whole-class anyway.
      let asg = first;
      let withLearners = !first.error;
      if (first.error) {
        asg = await readAssignments(ASSIGNMENT_COLS);
      }
      if (cancelled) return;
      setClasses(cls || []);
      setMembers(mem || []);
      setLearnersReady(withLearners);
      if (asg.error) setAssignmentsReady(false);
      else setAssignments(asg.data || []);
    })();
    return () => { cancelled = true; };
  }, [teacherProfile?.id]);

  // Set work straight from a gap row. That is the whole point of having found
  // it: a teacher who has just been shown the one skill holding up nine
  // children should not then have to go and describe it to a form.
  // `studentIds` null = the whole class; a list = only those learners.
  const assignGap = async (gap, cid, dueOn, studentIds = null) => {
    setAssignError(null);
    const chosen = Array.isArray(studentIds) && studentIds.length ? studentIds : null;
    // In a demo the whole flow still works — pick a class, pick a date, see it
    // land in "Work set" with who has it — it just never touches the database.
    if (isDemo) {
      setAssignments(a => [...a, {
        id: `demo-${Date.now()}`, class_id: cid, title: gap.name, skill_ids: [gap.id],
        student_ids: chosen, due_on: dueOn || null, created_at: new Date().toISOString(),
      }]);
      setAssigning(null);
      return true;
    }
    const row = {
      class_id: cid,
      teacher_id: teacherProfile?.id,
      title: gap.name,
      skill_ids: [gap.id],
      due_on: dueOn || null,
    };
    if (learnersReady) row.student_ids = chosen;
    const { data, error: err } = await supabase.from('assignments').insert(row)
      .select(learnersReady ? `${ASSIGNMENT_COLS}, student_ids` : ASSIGNMENT_COLS).single();
    if (err) { setAssignError(err.message); return false; }
    setAssignments(a => [...a, data]);
    setAssigning(null);
    return true;
  };

  // The answers behind one assignment: these learners, these skills, since it
  // was set. RLS already limits a teacher to learners in classes they own;
  // the filters here only keep the read small.
  const loadStruggles = async (a, cohortIds) => {
    if (eventsFor[a.id] && eventsFor[a.id] !== 'loading' && !eventsFor[a.id].error) return;
    if (isDemo) { setEventsFor(m => ({ ...m, [a.id]: demoEvents() })); return; }
    if (!cohortIds.length) { setEventsFor(m => ({ ...m, [a.id]: [] })); return; }
    setEventsFor(m => ({ ...m, [a.id]: 'loading' }));
    const read = (cols) => {
      let q = supabase.from('response_events').select(cols)
        .in('student_id', cohortIds)
        .in('skill_id', a.skill_ids || []);
      if (a.created_at) q = q.gte('created_at', a.created_at);
      return q.order('created_at', { ascending: false }).limit(3000);
    };
    // The richer columns arrived with later migrations; fall back to the base
    // ones rather than show nothing.
    let res = await read(EVENT_COLS_FULL);
    if (res.error) res = await read(EVENT_COLS_BASE);
    setEventsFor(m => ({ ...m, [a.id]: res.error ? { error: res.error.message } : (res.data || []) }));
  };

  const removeAssignment = async (id) => {
    if (isDemo) { setAssignments(a => a.filter(x => x.id !== id)); return; }
    const { error: err } = await supabase.from('assignments').delete().eq('id', id);
    if (err) { setAssignError(err.message); return; }
    setAssignments(a => a.filter(x => x.id !== id));
  };

  const createClass = async () => {
    const name = newClassName.trim();
    if (!name || creating) return;
    setCreating(true);
    setCreateError(null);
    const { data, error: err } = await supabase.rpc('create_class', { p_name: name });
    setCreating(false);
    if (err) { setCreateError(err.message); return; }
    const created = Array.isArray(data) ? data[0] : data;
    if (created) {
      setClasses(c => [...c, created]);
      setNewClassName('');
    }
  };

  const copyCode = async (code) => {
    try { await navigator.clipboard.writeText(code); } catch { /* ignore */ }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  useEffect(() => {
    let cancelled = false;
    if (isDemo) {
      // The snapshot is computed by the same jsSnapshot() a real roster goes
      // through, so levels, strand bars and gaps are the engine's own reading
      // of these answers — not numbers typed into a fixture.
      setStudents(demoStudents().map(s => ({ ...s, snap: jsSnapshot(s.progress, ctx) })));
      setLoading(false);
      return () => { cancelled = true; };
    }
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Progress rows this teacher is permitted to read.
        const { data: rows, error: e1 } = await supabase
          .from('ai_tutor_progress')
          .select('user_id, profile_key, learner_id, progress, total_xp, current_streak, last_practice_date, diagnosed, updated_at');
        if (e1) throw e1;

        // Each account's own maths row only: a parent's children and other
        // subjects share the parent's user_id (see classRows.js), and never
        // list the teacher's own row as a "student".
        const teacherId = teacherProfile?.id;
        const mathRows = (rows || []).filter(r => isOwnMathRow(r, teacherId));
        const ids = mathRows.map(r => r.user_id);

        // 2. Names for those students.
        let nameById = {};
        if (ids.length) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', ids);
          for (const p of profiles || []) nameById[p.id] = p.full_name || p.email || 'Student';
        }

        // 3. Compute a JS snapshot per student immediately.
        const base = mathRows.map(r => {
          const progress = rowToProgress(r);
          return {
            userId: r.user_id,
            name: nameById[r.user_id] || 'Student',
            updatedAt: r.updated_at,
            diagnosed: r.diagnosed,
            progress,
            snap: jsSnapshot(progress, ctx),
          };
        });
        if (cancelled) return;
        setStudents(base);
        setLoading(false);

      } catch (err) {
        if (!cancelled) { setError(err.message || 'Failed to load'); setLoading(false); }
      }
    })();
    return () => { cancelled = true; };
  }, [ctx, teacherProfile?.id]);

  // ---- the class being looked at ----
  const inClass = useMemo(() => {
    if (classId === 'all') return students;
    const ids = new Set(members.filter(m => m.class_id === classId).map(m => m.student_id));
    return students.filter(s => ids.has(s.userId));
  }, [students, members, classId]);

  // The children of one class, by name, for the learner picker and for every
  // "who is this work for" question below.
  const learnersOf = (cid) => {
    const ids = new Set(members.filter(m => m.class_id === cid).map(m => m.student_id));
    return students.filter(s => ids.has(s.userId))
      .map(s => ({ id: s.userId, name: s.name, progress: s.progress }))
      .sort((a, b) => String(a.name).localeCompare(String(b.name)));
  };

  // ---- what to teach next, and to whom ----
  // The same measurements as the roster below, read down the other axis.
  const gaps = useMemo(
    () => classGaps(inClass.map(s => ({ id: s.userId, name: s.name, progress: s.progress })), ctx).slice(0, 5),
    [inClass, ctx]
  );

  // ---- how the class is read ----
  // Four cards used to sit here: Students, Avg level, Need support, Racing
  // ahead. "Avg level G4.2" is a number no teacher can act on — nothing they
  // do on Tuesday changes in response to a class mean — and the other three
  // were counts you could only look at. These are the same question asked so
  // that the answer is a LIST: tap it and the roster below is that list.
  const counts = useMemo(() => bucketCounts(inClass), [inClass]);
  const roster = useMemo(() => sortForTeacher(inBucket(inClass, bucket)), [inClass, bucket]);

  // One day, read once per render, so no two parts of this page can disagree
  // about whether something is due today.
  const today = useMemo(() => isoDay(), []);
  const shownAssignments = useMemo(
    () => (classId === 'all' ? assignments : assignments.filter(a => a.class_id === classId)),
    [assignments, classId]
  );
  // With nothing on the left there is no second column to make, and an empty
  // 7fr track would push the whole class into the right-hand third.
  const twoCol = gaps.length > 0 || (assignmentsReady && shownAssignments.length > 0);

  // ---- render ----
  if (selected) {
    // The classes this child is in: work set from their page can only go to
    // a class that has them in it.
    const theirClasses = classes.filter(c => members.some(m => m.class_id === c.id && m.student_id === selected.userId));
    return (
      <StudentDetail student={selected} onBack={() => setSelected(null)}
        canAssign={assignmentsReady && theirClasses.length > 0}
        classes={theirClasses} learnersOf={learnersOf} learnersReady={learnersReady}
        onAssign={assignGap} assignError={assignError} />
    );
  }

  return (
    /* HOREB's own ground, not the generic admin slate this page was built on
       before the student side got its design pass. Same canvas, same card
       radii, same display face — a teacher and a child should be looking at
       one product. */
    <div className="min-h-screen bg-[#E8E8EC]">
      {/* A laptop is 1400–1900px wide and this page used max-w-4xl (896px) in a
          single stack, so a quarter of the screen carried everything and the
          roster sat below the fold under a create-class form. The width is the
          working surface now: the thinking on the left, the class on the
          right, and the class picker up in the header where it costs no row. */}
      <header className="sticky top-0 z-10 bg-[#E8E8EC]/90 backdrop-blur">
        <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 pt-6 pb-3 flex items-center gap-3.5">
          {onBack && (
            <button onClick={onBack} aria-label="Back"
              className="w-11 h-11 shrink-0 rounded-[14px] bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
              <Icon name="back" className="w-5 h-5" />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-[26px] font-extrabold tracking-tight text-slate-900 leading-none">Class Insights</h1>
            <p className="text-[13px] text-slate-500 mt-1">{SUBJECTS[SUBJECT_ID].name}</p>
          </div>
          {classes.length > 0 && (
            <div className="ml-auto flex items-center gap-1.5 flex-wrap justify-end">
              {[{ id: 'all', name: 'Everyone' }, ...classes].map(c => (
                <button key={c.id} onClick={() => setClassId(c.id)}
                  className={`px-3.5 h-9 rounded-full text-[13.5px] font-bold transition-colors ${classId === c.id ? 'bg-[#16161A] text-white' : 'bg-white text-slate-600 hover:text-slate-900'}`}>
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 pb-12 pt-1">
        {/* Say so. A screen full of children's names and gaps must never be
            mistaken for real children, by the room or by the person running
            the demo. */}
        {isDemo && (
          <div className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 flex items-center gap-2.5">
            <span className="text-[10px] font-extrabold tracking-[.1em] bg-amber-400 text-slate-900 rounded-full px-2 py-1">DEMO</span>
            <span className="text-[13px] text-amber-900">
              Invented class. Nothing here is saved, and no real child's work is shown —
              but every level and gap below is worked out by the live engine.
            </span>
          </div>
        )}

        <div className={`grid gap-5 items-start ${twoCol ? 'xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]' : ''}`}>
        {/* LEFT — what to do about the class. */}
        <div className="min-w-0 space-y-5">

        {/* TEACH THIS NEXT — the teacher's real question, answered first.
            A roster answers "how is Amani doing?" thirty-four times. Nobody
            can act on thirty-four answers before the bell. This is the same
            measurements read down the other axis: one skill, the children it
            is holding up, and something to do about it on Tuesday. */}
        {gaps.length > 0 && (
          <div className="bg-white rounded-[28px] p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900">Teach this next</h2>
              <span className="text-[12px] text-slate-400 shrink-0">{inClass.length} {inClass.length === 1 ? 'child' : 'children'}</span>
            </div>
            <p className="text-[13px] text-slate-500 mb-6">Ranked by how many one lesson would unblock.</p>

            {/* A ranking has to LOOK ranked. Every row used to carry the same
                weight — same red heading, same orange "Five-minute move:", same
                button — so five rows read as five emergencies and the number,
                the only thing that orders them, was the smallest text on the
                row. The lead finding gets the space now and the tail compresses
                to one line each. */}
            <div className="flex flex-col gap-3">
              {gaps.map((g, i) => {
                const who = [...g.blocked, ...g.failing];
                const share = inClass.length ? Math.round((g.count / inClass.length) * 100) : 0;
                const lead = i === 0;
                const c = STRAND_BLOCK[g.strand] || STRAND_BLOCK._;
                const setWork = assignmentsReady && classes.length > 0 && (
                  assigning === g.id
                    ? <AssignRow gap={g} classes={classes} classId={classId}
                        learnersOf={learnersOf} learnersReady={learnersReady}
                        // "Set this for the learners who have this gap": the
                        // children on this row are ticked to begin with.
                        preset={who.map(l => l.id)}
                        onCancel={() => setAssigning(null)} onAssign={assignGap} />
                    : <button onClick={() => { setAssigning(g.id); setAssignError(null); }}
                        className={`shrink-0 rounded-full font-bold transition-colors ${lead
                          ? 'h-11 px-5 text-[14px] bg-[#16161A] text-white hover:bg-[#2b2b33]'
                          : 'h-8 px-3.5 text-[12.5px] text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                        Set as work
                      </button>
                );

                if (!lead) {
                  return (
                    <div key={g.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5 border-t border-slate-100">
                      <span className="w-7 text-[17px] font-extrabold text-slate-900 tabular-nums shrink-0">{g.count}</span>
                      <span className="font-bold text-slate-900 text-[15px]">{g.name}</span>
                      <span className="text-[12px] text-slate-400">{g.strand} · Grade {g.grade}</span>
                      <span className="text-[12px] text-slate-500 flex-1 min-w-0 truncate">{who.map(l => l.name).join(', ')}</span>
                      {setWork}
                    </div>
                  );
                }

                return (
                  <div key={g.id} className="rounded-[22px] p-5 sm:p-6" style={{ background: c.bg }}>
                    <div className="flex items-start gap-4 sm:gap-5">
                      {/* The count, finally the size of its importance. */}
                      <span className="font-extrabold tabular-nums leading-none text-[44px] sm:text-[56px] tracking-tighter shrink-0"
                        style={{ color: c.ink }}>{g.count}</span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[21px] sm:text-[25px] font-extrabold tracking-tight leading-tight" style={{ color: c.ink }}>{g.name}</h3>
                        <p className="text-[12.5px] font-bold mt-1" style={{ color: c.meta }}>
                          {g.strand} · Grade {g.grade}{inClass.length > 1 && <> · {share}% of the class</>}
                        </p>
                        {/* Which of the two readings this is. They ask for
                            different lessons, so they are never merged. */}
                        <p className="text-[13.5px] mt-2 leading-snug" style={{ color: c.ink, opacity: 0.8 }}>
                          {g.blocked.length > 0 && g.failing.length > 0
                            ? <>{g.blocked.length} never mastered it · {g.failing.length} struggling with it now</>
                            : g.blocked.length > 0
                            ? <>Never mastered it, and failing the work that needs it</>
                            : <>Struggling with it right now</>}
                        </p>
                        <p className="text-[14px] font-bold mt-2.5" style={{ color: c.ink }}>
                          {who.map(l => l.name).join(' · ')}
                        </p>
                      </div>
                    </div>
                    {/* The move is a detail, not a headline. It used to be an
                        orange shout repeated down every row. */}
                    <div className="mt-4 rounded-2xl bg-white/70 px-4 py-3">
                      <p className="text-[11px] font-bold tracking-[.08em] uppercase text-slate-500">Away from the screen</p>
                      <p className="text-[14px] text-slate-800 leading-snug mt-0.5">{fiveMinuteMove(g)}</p>
                    </div>
                    <div className="mt-4">{setWork}</div>
                  </div>
                );
              })}
            </div>
            {assignError && <p className="text-[13px] text-red-500 mt-3">{assignError}</p>}
          </div>
        )}

        {/* WORK SET — what was assigned, and who has actually mastered it.
            Not "who submitted": there is nothing to submit. A name moves into
            Done when the child masters the skill in their ordinary practice.
            Work set for chosen learners counts only those learners. */}
        {assignmentsReady && shownAssignments.length > 0 && (
          <div className="bg-white rounded-[28px] p-5 sm:p-6">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900">Work set</h2>
              <span className="text-[12px] text-slate-400">done = mastered, from their own practice</span>
            </div>
            <div className="divide-y divide-slate-100">
              {shownAssignments.map(a => {
                const classLearners = learnersOf(a.class_id);
                const r = assignmentRoster(a, classLearners);
                const due = dueLabel(a.due_on, today);
                const cls = classes.find(c => c.id === a.class_id);
                const aud = audienceLabel(a, classLearners);
                const open = openStruggle === a.id;
                return (
                  <div key={a.id} className="py-3.5">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-bold text-[15px] text-slate-900">{a.title}</span>
                      {cls && <span className="text-[12px] text-slate-400">{cls.name}</span>}
                      <span className={`text-[11px] font-bold rounded-full px-2 py-0.5 ${aud.whole ? 'bg-slate-100 text-slate-500' : 'bg-[#16161A] text-white'}`}>{aud.text}</span>
                      <span className={`text-[12px] font-bold ${due.overdue ? 'text-red-600' : due.tone === 'urgent' ? 'text-amber-600' : 'text-slate-400'}`}>{due.text}</span>
                      <button onClick={() => removeAssignment(a.id)}
                        className="ml-auto text-[12px] text-slate-400 hover:text-red-600">Remove</button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${r.percent}%` }} />
                      </div>
                      <span className="text-[12px] font-bold text-slate-600 tabular-nums">{r.done.length} of {r.count}</span>
                    </div>
                    {/* The three groups by name. "Not started" is the list a
                        teacher acts on first, so it is never a bare number. */}
                    <div className="mt-1.5 space-y-0.5 text-[12px]">
                      {r.notStarted.length > 0 && (
                        <p className="text-slate-600"><span className="font-bold text-red-600">Not started: </span>{r.notStarted.map(l => l.name).join(' · ')}</p>
                      )}
                      {r.started.length > 0 && (
                        <p className="text-slate-600"><span className="font-bold text-amber-600">Working on it: </span>{r.started.map(l => `${l.name} (${l.percent}%)`).join(' · ')}</p>
                      )}
                      {r.done.length > 0 && (
                        <p className="text-slate-500"><span className="font-bold text-emerald-600">Done: </span>{r.done.map(l => l.name).join(' · ')}</p>
                      )}
                    </div>
                    {r.count > 0 && (
                      <button
                        onClick={() => {
                          if (open) { setOpenStruggle(null); return; }
                          setOpenStruggle(a.id);
                          loadStruggles(a, assignedLearners(a, classLearners).map(l => l.id));
                        }}
                        className={`mt-2.5 h-8 px-3.5 rounded-full text-[12.5px] font-bold transition-colors ${open ? 'bg-[#16161A] text-white' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                        {open ? 'Hide where they struggled' : 'Where they struggled'}
                      </button>
                    )}
                    {open && (
                      <StrugglePanel
                        state={eventsFor[a.id]}
                        assignment={a}
                        learners={classLearners}
                        skills={ctx?.skills || {}}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            {assignError && <p className="text-[13px] text-red-500 mt-3">{assignError}</p>}
          </div>
        )}

        </div>
        {/* ------------------------------------------------------------------
            RIGHT — the class itself. Thirty-four children is a list, and a
            list wants a column, not the full width of a laptop.
            ------------------------------------------------------------------ */}
        <div className="min-w-0 space-y-5">

          {loading && (
            <div className="bg-white rounded-[28px] p-10 text-center text-slate-400">Loading class…</div>
          )}

          {error && (
            <div className="bg-white rounded-[28px] p-6">
              <p className="font-bold text-slate-900 mb-1">Couldn’t load the class</p>
              <p className="text-[13px] text-slate-500">{error}</p>
            </div>
          )}

          {!loading && !error && students.length === 0 && (
            <div className="bg-white rounded-[28px] p-8 text-center">
              <Icon name="brain" className="w-10 h-10 mx-auto mb-3 text-slate-300" />
              <p className="font-bold text-slate-900 mb-1">No children here yet</p>
              <p className="text-[13px] text-slate-500 leading-snug">
                Create a class below, give its code to your students, and their work
                appears here as soon as they practise.
              </p>
            </div>
          )}

          {!loading && !error && inClass.length > 0 && (
            <div className="bg-white rounded-[28px] p-5 sm:p-6">
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900">The class</h2>
                <span className="text-[12px] text-slate-400 shrink-0">{inClass.length} {inClass.length === 1 ? 'child' : 'children'}</span>
              </div>
              <p className="text-[13px] text-slate-500 mb-4">Whoever needs you most is at the top.</p>

              {/* Four cards used to sit above this: Students, Avg level, Need
                  support, Racing ahead. A number you can only read is not
                  useful; a number you can open into the list of children it
                  counts is. They overlap — a child can be stuck AND quiet —
                  so these are filters, not a pie chart pretending to sum. */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {BUCKETS.map(b => {
                  const n = counts[b.id] ?? 0;
                  const on = bucket === b.id;
                  const empty = n === 0 && b.id !== 'all';
                  return (
                    <button key={b.id} title={b.hint || undefined} disabled={empty}
                      onClick={() => setBucket(b.id)}
                      className={`h-9 pl-2 pr-3.5 rounded-full text-[13px] font-bold inline-flex items-center gap-1.5 transition-colors ${
                        on ? 'bg-[#16161A] text-white'
                        : empty ? 'bg-slate-50 text-slate-300 cursor-default'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      <span className={`tabular-nums text-[15px] font-extrabold ${on ? '' : 'text-slate-900'}`}>{n}</span>
                      {b.label}
                    </button>
                  );
                })}
              </div>
              {bucket !== 'all' && (
                <p className="text-[12.5px] text-slate-500 mb-3 leading-snug">
                  {BUCKETS.find(b => b.id === bucket)?.hint}{' '}
                  <button onClick={() => setBucket('all')} className="font-bold text-slate-900 underline decoration-slate-300 hover:decoration-slate-900">Show everyone</button>
                </p>
              )}

              <div className="-mx-2.5">
                {roster.map(st => (
                  <RosterRow key={st.userId} st={st} onOpen={() => setSelected(st)} />
                ))}
              </div>
            </div>
          )}

          {/* SETUP. Join codes and "create a class" are done once and then in
              the way forever — this form used to sit above the children. Open
              by default only when there is nothing set up, in which case it is
              the one thing to do on this page. */}
          {(() => {
            const open = setupOpen || classes.length === 0;
            return (
              <div className="bg-white rounded-[28px] p-5 sm:p-6">
                <button onClick={() => setSetupOpen(o => !o)}
                  className="w-full flex items-center justify-between gap-3 text-left">
                  <h2 className="text-[15px] font-extrabold tracking-tight text-slate-900">
                    Classes &amp; join codes
                    {classes.length > 0 && <span className="font-bold text-slate-400"> · {classes.length}</span>}
                  </h2>
                  <span className="text-[12.5px] font-bold text-slate-400">{open ? 'Hide' : 'Set up'}</span>
                </button>

                {open && (
                  <div className="mt-4">
                    {classes.length > 0 && (
                      <div className="space-y-1.5 mb-3">
                        {classes.map((c) => (
                          <div key={c.id} className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl px-3 py-2">
                            <span className="text-[14px] font-bold text-slate-800 truncate">{c.name}</span>
                            <button onClick={() => copyCode(c.join_code)} title="Copy join code"
                              className="shrink-0 flex items-center gap-2 text-[13px] font-mono font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg px-2.5 py-1 transition-colors">
                              {c.join_code}
                              <span className="text-[11px] font-sans font-bold text-slate-400">{copiedCode === c.join_code ? 'copied' : 'copy'}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && createClass()}
                        placeholder="New class name (e.g. Grade 5 Blue)"
                        className="flex-1 min-w-0 bg-slate-50 rounded-xl px-3.5 h-11 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16161A]/20"
                      />
                      <button onClick={createClass} disabled={creating || !newClassName.trim()}
                        className="shrink-0 px-5 h-11 bg-[#16161A] hover:bg-[#2b2b33] disabled:opacity-25 text-white font-bold rounded-full text-[14px] transition-colors">
                        {creating ? 'Creating…' : 'Create'}
                      </button>
                    </div>
                    {createError && <p className="text-[12.5px] text-red-500 mt-2">{createError}</p>}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
        </div>
      </main>
    </div>
  );
}

// Setting work from a gap row: which class, by when, and for whom. The skill
// and the title are already decided — they are the row the teacher just read —
// so this asks only what it cannot know.
//
// For whom: the children on the gap row are ticked to begin with, because
// "set this for the ones who have this gap" is the commonest answer. The whole
// class is one tap away, and any child in the class can be added or taken off.
const AssignRow = ({ gap, classes, classId, learnersOf, learnersReady = true, preset = [], onCancel, onAssign }) => {
  // Default to the class being looked at; "Everyone" is not a class you can
  // set work for, so fall back to the first real one.
  const [cid, setCid] = useState(classId !== 'all' && classes.some(c => c.id === classId) ? classId : classes[0]?.id);
  // A week on Friday is nobody's deadline. Default to one week, which is the
  // commonest answer, and let them change it.
  const [due, setDue] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return isoDay(d);
  });
  const [busy, setBusy] = useState(false);
  const pool = useMemo(() => (learnersOf ? learnersOf(cid) : []), [learnersOf, cid]);
  const presetHere = useMemo(() => (preset || []).filter(id => pool.some(l => l.id === id)), [preset, pool]);
  const [mode, setMode] = useState('all');
  const [picked, setPicked] = useState(() => new Set());
  // A new class is a new set of children: start again from the gap row.
  const presetKey = presetHere.join(',');
  useEffect(() => {
    setPicked(new Set(presetHere));
    setMode(learnersReady && presetHere.length > 0 && presetHere.length < pool.length ? 'some' : 'all');
  }, [cid, presetKey, learnersReady, pool.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (id) => setPicked(p => {
    const n = new Set(p);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });
  const chosen = mode === 'some' ? pool.filter(l => picked.has(l.id)).map(l => l.id) : null;
  const ready = !!cid && (mode === 'all' || chosen.length > 0);
  const label = mode === 'all' ? 'Set for the class' : `Set for ${chosen.length}`;

  return (
    <div className="mt-2 bg-white/80 rounded-2xl px-3 py-2.5 space-y-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12.5px] font-bold text-slate-500">Set for</span>
        <select value={cid} onChange={e => setCid(e.target.value)}
          aria-label="Class to set this work for"
          className="text-[13px] font-bold rounded-lg px-2 h-9 bg-slate-100 text-slate-900 focus:outline-none">
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label className="text-[12.5px] font-bold text-slate-500" htmlFor={`due-${gap.id}`}>by</label>
        <input id={`due-${gap.id}`} type="date" value={due} onChange={e => setDue(e.target.value)}
          className="text-[13px] font-bold rounded-lg px-2 h-9 bg-slate-100 text-slate-900 focus:outline-none" />
      </div>

      {learnersReady ? (
        <div>
          <div className="inline-flex rounded-full bg-slate-100 p-0.5" role="radiogroup" aria-label="Who this work is for">
            {[['all', `Whole class${pool.length ? ` (${pool.length})` : ''}`], ['some', 'Chosen learners']].map(([m, text]) => (
              <button key={m} role="radio" aria-checked={mode === m} onClick={() => setMode(m)}
                className={`h-8 px-3.5 rounded-full text-[12.5px] font-bold transition-colors ${mode === m ? 'bg-[#16161A] text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                {text}
              </button>
            ))}
          </div>
          {mode === 'some' && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {pool.length === 0 && <span className="text-[12.5px] text-slate-400">Nobody in this class has practised yet.</span>}
              {pool.map(l => {
                const on = picked.has(l.id);
                const gapChild = presetHere.includes(l.id);
                return (
                  <button key={l.id} onClick={() => toggle(l.id)} aria-pressed={on}
                    title={gapChild ? 'Has this gap' : undefined}
                    className={`h-8 px-3 rounded-full text-[12.5px] font-bold inline-flex items-center gap-1.5 transition-colors ${on ? 'bg-[#16161A] text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
                    {gapChild && <span className={`w-1.5 h-1.5 rounded-full ${on ? 'bg-white' : 'bg-slate-400'}`} />}
                    {l.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <p className="text-[12px] text-slate-400">Set for the whole class. Choosing learners comes with the next database update.</p>
      )}

      <div className="flex items-center gap-2">
        <button disabled={busy || !ready}
          onClick={async () => { setBusy(true); await onAssign(gap, cid, due, chosen); setBusy(false); }}
          className="h-9 px-4 text-[13px] font-bold text-white bg-[#16161A] hover:bg-[#2b2b33] disabled:opacity-25 rounded-full transition-colors">
          {busy ? 'Setting…' : label}
        </button>
        <button onClick={onCancel} className="text-[12.5px] font-bold text-slate-400 hover:text-slate-700 px-1">Cancel</button>
      </div>
    </div>
  );
};

// ---- where they struggled -------------------------------------------------
// One assignment, read from the answers the learners gave since it was set.
// Visual first: the split of the group as one bar, the skill most missed as a
// coloured block, a square per learner per skill, and then only the children
// a teacher should sit with, each with what they got wrong and what to do.
const STATE_STYLE = {
  stuck: { bar: 'bg-red-500', cell: 'bg-red-500 text-white', label: 'Stuck' },
  working: { bar: 'bg-amber-400', cell: 'bg-amber-300 text-slate-900', label: 'Working on it' },
  untouched: { bar: 'bg-slate-200', cell: 'bg-slate-100 text-slate-400', label: 'Not started' },
  done: { bar: 'bg-emerald-500', cell: 'bg-emerald-500 text-white', label: 'Mastered' },
};
const cellStyle = (state) => STATE_STYLE[state === 'mastered' ? 'done' : state] || STATE_STYLE.untouched;

const Trail = ({ trail }) => (
  trail?.length > 0 ? (
    <span className="inline-flex items-center gap-[3px]" aria-label={`${trail.filter(Boolean).length} right of the last ${trail.length}`}>
      {trail.map((ok, i) => (
        <span key={i} className={`w-2 h-2 rounded-full ${ok ? 'bg-emerald-500' : 'bg-red-400'}`} />
      ))}
    </span>
  ) : null
);

const WrongChip = ({ w }) => (
  <span className="inline-flex items-baseline gap-1 rounded-lg bg-white px-2 py-1 text-[12px]">
    <span className="text-slate-400">wrote</span>
    <span className="font-bold text-red-600 tabular-nums">{w.submitted || '(blank)'}</span>
    {w.expected && <><span className="text-slate-400">for</span><span className="font-bold text-slate-900 tabular-nums">{w.expected}</span></>}
    {w.n > 1 && <span className="text-slate-400">· {w.n} times</span>}
  </span>
);

const StrugglePanel = ({ state, assignment, learners, skills }) => {
  if (!state || state === 'loading') {
    return <div className="mt-3 rounded-[22px] bg-slate-50 p-5 text-[13px] text-slate-400">Reading their answers…</div>;
  }
  if (state.error) {
    return <div className="mt-3 rounded-[22px] bg-slate-50 p-5 text-[13px] text-slate-500">Could not read their answers: {state.error}</div>;
  }
  const r = assignmentStruggles(assignment, learners, state, { skills });
  if (!r.counts.assigned) {
    return <div className="mt-3 rounded-[22px] bg-slate-50 p-5 text-[13px] text-slate-500">None of the learners this was set for has practised yet.</div>;
  }
  const many = r.skills.length > 1;
  const mm = r.mostMissed;
  const mmBlock = mm ? (STRAND_BLOCK[mm.strand] || STRAND_BLOCK._) : null;
  const shared = mm?.commonWrong;
  const sharedPattern = shared ? patternInfo(answerPattern(shared.submitted, shared.expected)) : null;

  return (
    <div className="mt-3 rounded-[22px] bg-[#F4F4F6] p-4 sm:p-5 space-y-4">
      {/* The group in one bar. */}
      <div>
        <div className="flex h-3 rounded-full overflow-hidden bg-white">
          {['stuck', 'working', 'untouched', 'done'].map(k => r.counts[k] > 0 && (
            <div key={k} className={STATE_STYLE[k].bar} style={{ width: `${(r.counts[k] / r.counts.assigned) * 100}%` }} />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {['stuck', 'working', 'untouched', 'done'].map(k => (
            <span key={k} className="inline-flex items-center gap-1.5 text-[12.5px] text-slate-600">
              <span className={`w-2.5 h-2.5 rounded-full ${STATE_STYLE[k].bar}`} />
              <span className="font-extrabold text-slate-900 tabular-nums">{r.counts[k]}</span> {STATE_STYLE[k].label.toLowerCase()}
            </span>
          ))}
        </div>
      </div>

      {/* The skill most missed, as a block in its strand's colour. */}
      {mm && (
        <div className="rounded-[18px] p-4" style={{ background: mmBlock.bg }}>
          <p className="text-[11px] font-bold tracking-[.08em] uppercase" style={{ color: mmBlock.meta }}>
            {many ? 'Most missed' : 'The skill'}
          </p>
          <div className="flex items-baseline gap-3 mt-0.5">
            <span className="text-[34px] font-extrabold tabular-nums leading-none tracking-tighter" style={{ color: mmBlock.ink }}>{mm.accuracy ?? 0}%</span>
            <span className="text-[17px] font-extrabold tracking-tight leading-tight" style={{ color: mmBlock.ink }}>{mm.name}</span>
          </div>
          <p className="text-[12.5px] font-bold mt-1" style={{ color: mmBlock.meta }}>
            right across {mm.attempts} {mm.attempts === 1 ? 'answer' : 'answers'} · {mm.wrongCount} wrong{mm.stuck > 0 && <> · {mm.stuck} stuck</>}
          </p>
          {shared && (
            <div className="mt-3 rounded-2xl bg-white/75 px-3.5 py-2.5">
              <p className="text-[13.5px] text-slate-800 leading-snug">
                <span className="font-bold">{shared.learners.join(' and ')}</span> {shared.learners.length === 2 ? 'both' : 'all'} wrote{' '}
                <span className="font-bold text-red-600 tabular-nums">{shared.submitted}</span> where the answer was{' '}
                <span className="font-bold tabular-nums">{shared.expected}</span>.
                {sharedPattern && <> {sharedPattern.label}: teach it once, to them together.</>}
              </p>
            </div>
          )}
        </div>
      )}

      {/* A square per learner per skill: the whole group at a glance. */}
      <div>
        {many && (
          <div className="flex items-end gap-1.5 pl-[128px] mb-1">
            {r.skills.map(sk => (
              <span key={sk.id} title={sk.name} className="w-14 text-[10.5px] font-bold text-slate-400 leading-tight truncate">{sk.name}</span>
            ))}
          </div>
        )}
        <div className="space-y-1.5">
          {r.learners.map(l => (
            <div key={l.id} className="flex items-center gap-1.5">
              <span className="w-[122px] shrink-0 text-[13px] font-bold text-slate-800 truncate">{l.name}</span>
              {l.cells.map(c => {
                const st = cellStyle(c.state);
                return (
                  <span key={c.skillId}
                    title={`${c.attempts} ${c.attempts === 1 ? 'try' : 'tries'}${c.accuracy != null ? `, ${c.accuracy}% right` : ''}${c.mastered ? ', mastered' : ''}`}
                    className={`w-14 h-9 shrink-0 rounded-lg flex flex-col items-center justify-center leading-none ${st.cell}`}>
                    <span className="text-[13px] font-extrabold tabular-nums">{c.mastered ? 'done' : c.accuracy != null ? `${c.accuracy}%` : '–'}</span>
                    {c.attempts > 0 && <span className="text-[9.5px] font-bold opacity-75 mt-0.5">{c.attempts} tries</span>}
                  </span>
                );
              })}
              {!many && <span className="ml-1.5"><Trail trail={l.cells[0]?.trail} /></span>}
            </div>
          ))}
        </div>
      </div>

      {/* Only the children to sit with, each with a next step. */}
      {r.stuck.length > 0 && (
        <div>
          <h3 className="text-[15px] font-extrabold tracking-tight text-slate-900">
            Sit with {r.stuck.length === 1 ? 'this one' : `these ${r.stuck.length}`}
          </h3>
          <p className="text-[12px] text-slate-500 mb-2">Tried at least four times, under half right, not mastered.</p>
          <div className="space-y-2">
            {r.stuck.map(x => (
              <div key={x.id} className="rounded-[18px] bg-white p-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-extrabold text-[15px] text-slate-900">{x.name}</span>
                  <span className="text-[12.5px] text-slate-500">{x.skillName} · {x.attempts} tries · {x.accuracy}% right</span>
                  <span className="ml-auto"><Trail trail={x.trail} /></span>
                </div>
                {x.wrong.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 rounded-xl bg-[#F4F4F6] p-1.5">
                    {x.wrong.map((w, i) => <WrongChip key={i} w={w} />)}
                  </div>
                )}
                {x.pattern && (
                  <p className="text-[13px] font-bold text-slate-900 mt-2.5">{x.pattern.label}</p>
                )}
                <p className="text-[11px] font-bold tracking-[.08em] uppercase text-slate-500 mt-2">Next step</p>
                <p className="text-[13.5px] text-slate-800 leading-snug mt-0.5">{x.step}</p>
                {x.step !== x.move && (
                  <p className="text-[12.5px] text-slate-500 leading-snug mt-1.5">
                    <span className="font-bold">Away from the screen:</span> {x.move}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {r.source === 'progress' && (
        <p className="text-[12px] text-slate-400 leading-snug">
          No answers have reached the server since this was set, so these counts come from their practice
          overall, and the wrong answers themselves are not shown.
        </p>
      )}
    </div>
  );
};

// ---- one child, one line --------------------------------------------------
// This row used to read "2/13 skills · 15% mastered" — a percentage of a
// denominator the teacher never chose and cannot see. It now carries the two
// facts a teacher acts on: when the child was last seen, and the name of the
// skill they are stuck on or working on next. Both were already loaded; the
// practice date was read from the database on every page load and thrown away.
const RosterRow = ({ st, onOpen }) => {
  const a = attentionOf(st);
  const gap = st.snap.topGaps?.[0];
  const line = gap
    ? { label: 'Stuck on', name: gap.name, strand: gap.strand }
    : st.snap.next
      ? { label: 'Next', name: st.snap.next.name, strand: st.snap.next.strand }
      : null;
  const c = line ? (STRAND_BLOCK[line.strand] || STRAND_BLOCK._) : null;
  return (
    /* There was a 44px grade chip on the left of this row. Inside a class it
       showed the same number on every line — a child's measured level and the
       grade they are in agree by construction for most of a class — and it was
       GREEN on all of them, including children with foundation gaps, because
       the band compares the two and the difference is zero. A reassuring
       colour that cannot fire is worse than no colour. The level is on the
       child's own page, where the comparison has somewhere to go. */
    <button onClick={onOpen}
      className="w-full text-left flex items-center gap-3 px-2.5 py-2.5 rounded-2xl hover:bg-slate-50 transition-colors">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-slate-900 truncate text-[15px]">{st.name}</span>
          {/* Silence is the one thing a gap cannot tell you, so it gets a mark
              of its own rather than a colour someone has to decode. */}
          {a.quiet && (
            <span className="shrink-0 text-[9.5px] font-extrabold tracking-[.08em] uppercase bg-[#16161A] text-white rounded-full px-2 py-0.5">quiet</span>
          )}
          {!st.diagnosed && (
            <span className="shrink-0 text-[9.5px] font-extrabold tracking-[.08em] uppercase bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">not placed</span>
          )}
        </div>
        {line && (
          <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.bg }} />
            <span className="text-[12.5px] text-slate-500 truncate">
              <span className="font-bold text-slate-600">{line.label}:</span> {line.name}
            </span>
          </div>
        )}
      </div>
      <div className="shrink-0 text-right">
        <div className="text-[12.5px] font-bold text-slate-600">{lastSeenLabel(a.days)}</div>
        {st.snap.gapCount > 0 && (
          <div className="text-[11.5px] text-slate-400">{st.snap.gapCount} gap{st.snap.gapCount > 1 ? 's' : ''}</div>
        )}
      </div>
      <Icon name="arrow" className="w-4 h-4 text-slate-300 shrink-0" />
    </button>
  );
};

// ---- one child ------------------------------------------------------------
// This page used to be strictly LESS informative than the list that led to it.
// It said "3 foundation gaps detected — this student needs prerequisite
// support before moving on" while `snap.topGaps` held the three skill names,
// so a teacher who clicked a child to find out what was wrong learned nothing
// they did not already know and had nowhere to go next.
function StudentDetail({ student, onBack, canAssign = false, classes = [], learnersOf, learnersReady, onAssign, assignError }) {
  useHorebLook();
  const { name, snap, diagnosed } = student;
  const a = attentionOf(student);
  // Set one of this child's gaps as work for this child (and anyone else the
  // teacher adds), straight from their page.
  const [assigning, setAssigning] = useState(null);
  const [setIds, setSetIds] = useState(() => new Set());
  const firstName = String(name || '').split(' ')[0] || 'them';
  return (
    <div className="min-h-screen bg-[#E8E8EC]">
      <header className="sticky top-0 z-10 bg-[#E8E8EC]/90 backdrop-blur">
        <div className="mx-auto w-full max-w-[1100px] px-5 sm:px-8 pt-6 pb-3 flex items-center gap-3.5">
          <button onClick={onBack} aria-label="Back to the class"
            className="w-11 h-11 shrink-0 rounded-[14px] bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
            <Icon name="back" className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-[26px] font-extrabold tracking-tight text-slate-900 leading-none truncate">{name}</h1>
            <p className="text-[13px] text-slate-500 mt-1">
              {diagnosed ? `Working at Grade ${snap.level.toFixed(0)}` : 'Not placed yet'} · last practised {lastSeenLabel(a.days)}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] px-5 sm:px-8 pb-12 pt-1">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">

          {/* WHAT TO DO ABOUT THIS CHILD, named. */}
          <div className="min-w-0 space-y-5">
            {snap.topGaps.length > 0 ? (
              <div className="bg-white rounded-[28px] p-6 sm:p-7">
                <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900">
                  {snap.gapCount === 1 ? 'One foundation is missing' : `${snap.gapCount} foundations are missing`}
                </h2>
                <p className="text-[13px] text-slate-500 mt-1 mb-5">
                  Work above these keeps collapsing until they are in place. Deepest first.
                </p>
                <div className="space-y-3">
                  {snap.topGaps.map((g, i) => {
                    const c = STRAND_BLOCK[g.strand] || STRAND_BLOCK._;
                    return (
                      <div key={g.id} className="rounded-[22px] p-5" style={{ background: i === 0 ? c.bg : '#F4F4F6' }}>
                        <h3 className="text-[19px] font-extrabold tracking-tight leading-tight"
                          style={{ color: i === 0 ? c.ink : '#16161A' }}>{g.name}</h3>
                        <p className="text-[12px] font-bold mt-1"
                          style={{ color: i === 0 ? c.meta : '#6B6B76' }}>{g.strand} · Grade {g.grade}</p>
                        <div className="mt-3.5 rounded-2xl bg-white/70 px-4 py-3">
                          <p className="text-[11px] font-bold tracking-[.08em] uppercase text-slate-500">Away from the screen</p>
                          <p className="text-[14px] text-slate-800 leading-snug mt-0.5">{fiveMinuteMove(g)}</p>
                        </div>
                        {canAssign && (
                          setIds.has(g.id)
                            ? <p className="mt-3 text-[13px] font-bold" style={{ color: i === 0 ? c.ink : '#16161A' }}>Set as work for {firstName}.</p>
                            : assigning === g.id
                            ? <AssignRow gap={g} classes={classes} classId={classes[0]?.id}
                                learnersOf={learnersOf} learnersReady={learnersReady}
                                preset={[student.userId]}
                                onCancel={() => setAssigning(null)}
                                onAssign={async (...args) => {
                                  const ok = await onAssign(...args);
                                  if (ok) { setSetIds(x => new Set([...x, g.id])); setAssigning(null); }
                                  return ok;
                                }} />
                            : <button onClick={() => setAssigning(g.id)}
                                className="mt-3 h-9 px-4 rounded-full text-[13px] font-bold bg-[#16161A] text-white hover:bg-[#2b2b33] transition-colors">
                                Set as work for {firstName}
                              </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                {assignError && <p className="text-[13px] text-red-500 mt-3">{assignError}</p>}
                {snap.gapCount > snap.topGaps.length && (
                  <p className="text-[12.5px] text-slate-400 mt-3">
                    {snap.gapCount - snap.topGaps.length} more behind these. Clear the deepest first — some of the
                    rest usually go with it.
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-[28px] p-6 sm:p-7">
                <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900">Nothing is blocking them</h2>
                <p className="text-[13.5px] text-slate-500 mt-1.5 leading-snug">
                  No foundation below their grade is missing. {a.quiet
                    ? 'They have not practised in a while, though — that is the thing to chase.'
                    : 'Keep them moving.'}
                </p>
                {snap.next && (
                  <div className="mt-5 rounded-[22px] p-5" style={{ background: (STRAND_BLOCK[snap.next.strand] || STRAND_BLOCK._).bg }}>
                    <p className="text-[11px] font-bold tracking-[.08em] uppercase"
                      style={{ color: (STRAND_BLOCK[snap.next.strand] || STRAND_BLOCK._).meta }}>Working on next</p>
                    <h3 className="text-[20px] font-extrabold tracking-tight mt-0.5"
                      style={{ color: (STRAND_BLOCK[snap.next.strand] || STRAND_BLOCK._).ink }}>{snap.next.name}</h3>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* THE MEASUREMENTS. */}
          <div className="min-w-0 space-y-5">
            <div className="bg-white rounded-[28px] p-5 sm:p-6">
              <div className="grid grid-cols-3 gap-3 text-center">
                {/* Here the band has somewhere to point: this child's measured
                    level against the grade they are in. On a roster row it
                    could only ever read zero. */}
                <Stat label="Working at" value={`G${snap.level.toFixed(0)}`}
                  className={`rounded-xl ${bandColor(snap.level, snap.declared)} border-0 bg-transparent`} />
                <Stat label="Day streak" value={snap.streak} className="text-slate-900" />
                <Stat label="Mastered" value={`${snap.percent}%`} className="text-slate-900" />
              </div>
              <p className="text-[12px] text-slate-400 mt-3 leading-snug">
                In Grade {snap.declared}. {snap.mastered} of the {snap.total} skills up to that grade are
                mastered — not of the whole curriculum, which runs to Grade 12.
              </p>
            </div>

            <div className="bg-white rounded-[28px] p-5 sm:p-6">
              <h2 className="text-[15px] font-extrabold tracking-tight text-slate-900 mb-4">By strand</h2>
              <div className="space-y-3.5">
                {snap.strands.filter(s => s.total > 0).map((s) => {
                  const c = STRAND_BLOCK[s.name] || STRAND_BLOCK._;
                  const pct = s.pct == null ? 0 : Math.round(s.pct * 100);
                  return (
                    <div key={s.name}>
                      <div className="flex justify-between items-baseline text-[13px] mb-1.5 gap-2">
                        <span className="font-bold text-slate-800">{s.name}</span>
                        <span className="text-slate-400 shrink-0 tabular-nums">
                          {s.assessed ? `${s.done}/${s.total}` : 'not assessed'}
                        </span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        {s.assessed && (
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.bg }} />
                        )}
                      </div>
                      {s.assessed && s.accuracy != null && s.accuracy < 70 && (
                        <div className="text-[11.5px] text-slate-500 mt-1">Getting {s.accuracy}% right — worth watching</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const Stat = ({ label, value, className = '' }) => (
  <div className={className}>
    <div className="text-[26px] font-extrabold tracking-tight tabular-nums leading-none">{value}</div>
    <div className="text-[11px] font-bold tracking-[.06em] uppercase opacity-60 mt-1.5">{label}</div>
  </div>
);
