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
import { assignmentRoster, dueLabel, isoDay } from './assignments.js';
import { demoMode, demoStudents, demoClasses, demoMembers, demoAssignments } from './demoClass.js';
import { useHorebLook } from './horebLook.js';
import { STRAND_BLOCK } from './strandBlocks.js';
import {
  BUCKETS, bucketCounts, inBucket, sortForTeacher, attentionOf, lastSeenLabel,
  rowToProgress,
} from './classView.js';
import { Icon } from './components/Icons.jsx';
import { isOwnMathRow } from './classRows.js';

const SUBJECT_ID = 'math';

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

// A concrete, physical-materials suggestion per stuck skill — the KICD
// designs' own suggested resources (bottle tops, bundles of sticks, cut-outs).
//
// Ordered, most specific first. This was seven patterns covering 62 of the 221
// primary skills, so 72% of the gaps a teacher is shown came back with "five
// minutes with physical counters" — which is not advice about geometry, or
// statistics, or telling the time. Every line below is something a teacher can
// do with what is already in a Kenyan classroom.
const MOVES = [
  // Number
  [/PRENUMBER|COUNTING|NUMBER_WORDS|NUMBERS_WORDS/, 'Count real objects together out loud, then write the numeral and say it back — the saying and the writing have to meet.'],
  [/PLACE_VALUE|PLACE|BIG_NUMBERS/, 'Place-value chart on paper: build the number with bottle tops in columns, then read it aloud.'],
  [/ORDER_ROUND|ROUND|COMPARE/, 'Draw a number line on paper and let them peg the number where it belongs — rounding is "which end is it nearer?".'],
  [/ODD_EVEN/, 'Pair the counters up. If one is left over with no partner, it is odd — that is the whole rule.'],
  [/ROMAN/, 'Lay out sticks for I, V and X and build the number, then read it back left to right.'],
  [/FACTOR|MULTIPLE|PRIME|DIVISIBILITY|LCM|HCF|GCD/, 'Arrange counters into rectangles. The ones that make a neat rectangle are the factors; the ones that cannot are not.'],
  [/PROFIT_LOSS|INTEREST|DISCOUNT/, 'Real prices on paper: what it cost, what it sold for, and what is left over. Name the leftover before calling it a percentage.'],
  [/STANDARD_FORM/, 'Write the number out in full, then count the places the point moves. The count is the power.'],
  [/UNIT_CONVERSION|CONVERSION/, 'Lay the units out largest to smallest and step between them one at a time, saying each × 10 or ÷ 10 aloud.'],
  [/SQUARE|ROOT|INDICES|POWER/, 'Build an actual square out of counters — 4 rows of 4. The square number is how many you used.'],
  [/INTEGER|TEMPERATURE|NEGATIVE/, 'A number line on the floor with zero in the middle. Stand on a number and walk the moves.'],
  [/DECIMAL/, 'The same place-value chart with a point drawn in — tenths to the right of it, and read the whole thing aloud.'],
  [/PERCENT/, 'A 10 by 10 grid on squared paper. Shade it. Per cent just means "out of this hundred".'],
  [/RATIO|PROPORTION|SHARING/, 'Share bottle tops into the groups the ratio asks for, one round at a time, then count what each group holds.'],
  [/BODMAS|ORDER_OF_OP/, 'Work one line together, saying which part is done next and why, before anything is written down.'],
  [/FRACTION|MIXED_NUMBER|RECIPROCAL/, 'Cut a paper circle into equal parts together — fold first, cut second, name each piece.'],
  [/ADD/, 'Bundle sticks in tens — build both numbers, trade ten singles for one bundle, then retry on HOREB.'],
  [/SUB/, 'Act it out with bottle tops the child physically hands to you, counting what remains each time.'],
  [/MULT/, 'Plates and stones: 3 plates, 4 stones on each — how many plates? how many on each? how many altogether?'],
  [/DIV/, 'Share real counters into equal groups, one at a time, before writing anything.'],
  // Measurement
  [/TIME|CLOCK|TIMETABLE/, 'A paper-plate clock with movable hands — the child sets the times you call out, then reads a real bus timetable.'],
  [/MONEY/, 'Real coins and written price tags. Buy something from them and make them give you the change.'],
  [/LENGTH|DISTANCE/, 'Measure three things in the room with a ruler or a metre rule and write each one down with its unit.'],
  [/MASS|WEIGHT/, 'A simple balance with stones on one side. Heavier, lighter, about the same — then put numbers to it.'],
  [/CAPACITY|VOLUME_LIQUID/, 'Fill a small bottle from a bigger one and count how many it takes. That count IS the relationship.'],
  [/PERIMETER/, 'Run a string all the way round a desk, then straighten the string and measure it. That is the perimeter.'],
  [/AREA/, 'Squared paper: draw the shape and count the squares inside it before using any formula.'],
  [/VOLUME|CUBOID/, 'Stack small boxes or cubes into a bigger box and count them, layer by layer.'],
  [/SPEED/, 'Walk a measured distance and time it. Speed is just how much distance fits into the time.'],
  [/DENSITY/, 'Two objects of the same size but different weight, in the hand. Same space, different mass.'],
  // Geometry
  [/ANGLE/, 'The corner of a sheet of paper is a right angle. Hold it against the angle — bigger, smaller, or the same?'],
  [/TRIANGLE|PYTHAGORAS/, 'Cut triangles out of paper and sort them by their sides and corners before naming any of them.'],
  [/LINES|PARALLEL|PERPENDICULAR/, 'Find them in the room — the edges of a door, the lines on a book — and trace them with a finger.'],
  [/SHAPE|POLYGON|3D|OBJECT|NET|FIGURE|CIRCUMFERENCE|CIRCLE/, 'Fold and cut the shape out of paper, then count its sides, corners and faces by touching each one.'],
  [/POSITION|DIRECTION|COORDINATE|BEARING/, 'Stand up and face the direction. Left and right are from the walker’s point of view, not the page’s.'],
  [/SYMMETRY|TRANSFORM|REFLECT|ROTAT/, 'Fold the paper shape in half. If the halves land on each other, that fold is a line of symmetry.'],
  [/CONSTRUCT/, 'Do it once slowly with a ruler and compasses, saying each step aloud before drawing it.'],
  // Algebra
  [/LETTERS|EXPRESSION|ALGEBRA|EQUATION|MISSING_NUMBER|SUBSTITUT|SIMPLIFY/, 'Hide counters under a cup. The cup is the letter; how many are under it, and how do you know?'],
  [/PATTERN|SEQUENCE/, 'Lay the pattern out in bottle tops and ask what comes next — then what the tenth one would be, without laying it out.'],
  [/INEQUALIT/, 'Two unequal piles of counters. The open end of the sign always faces the bigger pile.'],
  // Statistics
  [/TALLY|DATA/, 'Count something real in the room — shoes, windows — and tally it in fives as you go.'],
  [/MEAN|AVERAGE|MEDIAN|MODE/, 'Build towers of counters of different heights, then level them off. The levelled height is the mean.'],
  [/GRAPH|CHART|PICTOGRAPH|DISPLAY/, 'Draw the graph by hand from the tally they just made, then ask them a question only the graph can answer.'],
  [/PROBABILIT|CHANCE/, 'Bottle tops of two colours in a bag. Predict, draw one out, repeat, and keep score.'],
];
const fiveMinuteMove = (gap) => {
  const id = gap?.id || '';
  const hit = MOVES.find(([re]) => re.test(id));
  if (hit) return hit[1];
  // The fallback names the strand, so even here a teacher is not told to count
  // counters at a child who is stuck on a bar chart.
  return `Five minutes on ${(gap?.strand || 'this').toLowerCase()} away from the screen — do one together, out loud, with something they can hold, then retry the skill on HOREB.`;
};

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
      const [{ data: cls }, { data: mem }, asg] = await Promise.all([
        supabase.from('classes').select('id, name, join_code').order('created_at', { ascending: true }),
        supabase.from('class_members').select('class_id, student_id'),
        supabase.from('assignments').select('id, class_id, title, skill_ids, due_on, created_at')
          .order('due_on', { ascending: true, nullsFirst: false }),
      ]);
      if (cancelled) return;
      setClasses(cls || []);
      setMembers(mem || []);
      if (asg.error) setAssignmentsReady(false);
      else setAssignments(asg.data || []);
    })();
    return () => { cancelled = true; };
  }, [teacherProfile?.id]);

  // Set work straight from a gap row. That is the whole point of having found
  // it: a teacher who has just been shown the one skill holding up nine
  // children should not then have to go and describe it to a form.
  const assignGap = async (gap, cid, dueOn) => {
    setAssignError(null);
    // In a demo the whole flow still works — pick a class, pick a date, see it
    // land in "Work set" with who has it — it just never touches the database.
    if (isDemo) {
      setAssignments(a => [...a, { id: `demo-${Date.now()}`, class_id: cid, title: gap.name, skill_ids: [gap.id], due_on: dueOn || null }]);
      setAssigning(null);
      return;
    }
    const { data, error: err } = await supabase.from('assignments').insert({
      class_id: cid,
      teacher_id: teacherProfile?.id,
      title: gap.name,
      skill_ids: [gap.id],
      due_on: dueOn || null,
    }).select('id, class_id, title, skill_ids, due_on, created_at').single();
    if (err) { setAssignError(err.message); return; }
    setAssignments(a => [...a, data]);
    setAssigning(null);
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
    return <StudentDetail student={selected} onBack={() => setSelected(null)} />;
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
            Done when the child masters the skill in their ordinary practice. */}
        {assignmentsReady && shownAssignments.length > 0 && (
          <div className="bg-white rounded-[28px] p-5 sm:p-6">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-semibold text-slate-900">Work set</h2>
              <span className="text-xs text-slate-400">done = mastered, from their own practice</span>
            </div>
            <div className="divide-y divide-slate-100">
              {shownAssignments.map(a => {
                const ids = new Set(members.filter(m => m.class_id === a.class_id).map(m => m.student_id));
                const cohort = students.filter(s => ids.has(s.userId));
                const r = assignmentRoster(a, cohort.map(s => ({ id: s.userId, name: s.name, progress: s.progress })));
                const due = dueLabel(a.due_on, today);
                const cls = classes.find(c => c.id === a.class_id);
                return (
                  <div key={a.id} className="py-3">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <span className="font-semibold text-slate-900">{a.title}</span>
                      {cls && <span className="text-xs text-slate-400">{cls.name}</span>}
                      <span className={`text-xs font-semibold ${due.overdue ? 'text-red-600' : due.tone === 'urgent' ? 'text-amber-600' : 'text-slate-400'}`}>{due.text}</span>
                      <button onClick={() => removeAssignment(a.id)}
                        className="ml-auto text-xs text-slate-400 hover:text-red-600">Remove</button>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${r.percent}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-600 tabular-nums">{r.done.length} of {r.count}</span>
                    </div>
                    {/* The three groups by name. "Not started" is the list a
                        teacher acts on first, so it is never a bare number. */}
                    <div className="mt-1.5 space-y-0.5 text-xs">
                      {r.notStarted.length > 0 && (
                        <p className="text-slate-600"><span className="font-semibold text-red-600">Not started: </span>{r.notStarted.map(l => l.name).join(' · ')}</p>
                      )}
                      {r.started.length > 0 && (
                        <p className="text-slate-600"><span className="font-semibold text-amber-600">Working on it: </span>{r.started.map(l => `${l.name} (${l.percent}%)`).join(' · ')}</p>
                      )}
                      {r.done.length > 0 && (
                        <p className="text-slate-500"><span className="font-semibold text-emerald-600">Done: </span>{r.done.map(l => l.name).join(' · ')}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
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

// Setting work from a gap row: which class, and by when. The skill and the
// title are already decided — they are the row the teacher just read — so this
// asks only what it cannot know.
const AssignRow = ({ gap, classes, classId, onCancel, onAssign }) => {
  // Default to the class being looked at; "Everyone" is not a class you can
  // set work for, so fall back to the first real one.
  const [cid, setCid] = useState(classId !== 'all' ? classId : classes[0]?.id);
  // A week on Friday is nobody's deadline. Default to one week, which is the
  // commonest answer, and let them change it.
  const [due, setDue] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return isoDay(d);
  });
  const [busy, setBusy] = useState(false);
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 bg-white/80 rounded-2xl px-3 py-2.5">
      <span className="text-[12.5px] font-bold text-slate-500">Set for</span>
      <select value={cid} onChange={e => setCid(e.target.value)}
        aria-label="Class to set this work for"
        className="text-[13px] font-bold rounded-lg px-2 h-9 bg-slate-100 text-slate-900 focus:outline-none">
        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <label className="text-[12.5px] font-bold text-slate-500" htmlFor={`due-${gap.id}`}>by</label>
      <input id={`due-${gap.id}`} type="date" value={due} onChange={e => setDue(e.target.value)}
        className="text-[13px] font-bold rounded-lg px-2 h-9 bg-slate-100 text-slate-900 focus:outline-none" />
      <button disabled={busy || !cid}
        onClick={async () => { setBusy(true); await onAssign(gap, cid, due); setBusy(false); }}
        className="h-9 px-4 text-[13px] font-bold text-white bg-[#16161A] hover:bg-[#2b2b33] disabled:opacity-25 rounded-full transition-colors">
        {busy ? 'Setting…' : 'Set work'}
      </button>
      <button onClick={onCancel} className="text-[12.5px] font-bold text-slate-400 hover:text-slate-700 px-1">Cancel</button>
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
function StudentDetail({ student, onBack }) {
  useHorebLook();
  const { name, snap, diagnosed } = student;
  const a = attentionOf(student);
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
                      </div>
                    );
                  })}
                </div>
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
