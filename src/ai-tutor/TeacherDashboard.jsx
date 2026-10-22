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
import { getStats, getStrandStats, getEstimatedGradeLevel, findGaps, classGaps } from './adaptiveEngine.js';
import { assignmentRoster, dueLabel, isoDay } from './assignments.js';
import { Icon } from './components/Icons.jsx';

const SUBJECT_ID = 'math';

const ctxFor = (subjectId) => {
  const s = SUBJECTS[subjectId];
  return s ? { skills: s.skills, getPostReqs: s.getPostReqs } : null;
};

// Reconstruct the in-memory progress object from a stored row.
const rowToProgress = (row) => ({
  skills: row.progress?.skills || {},
  diagnosticBalances: row.progress?.diagnosticBalances || null,
  diagnosed: row.diagnosed || false,
  totalXP: row.total_xp || 0,
  currentStreak: row.current_streak || 0,
  lastPracticeDate: row.last_practice_date || null,
});

// JS-engine snapshot for one student (always available).
const jsSnapshot = (progress, ctx) => {
  const stats = getStats(progress, ctx);
  const strands = getStrandStats(progress, ctx);
  const grade = getEstimatedGradeLevel(progress, ctx);
  const gaps = findGaps(progress, ctx);
  return {
    level: grade,
    mastered: stats.mastered,
    total: stats.total,
    percent: stats.percent,
    accuracy: stats.accuracy,
    strands: strands.map(s => ({ name: s.name, percent: s.percent, accuracy: s.accuracy })),
    gapCount: gaps.length,
    // Keep the NAMES — "3 gaps" tells a teacher nothing; "Addition —
    // regrouping ones" tells them exactly where to sit down.
    topGaps: gaps.slice(0, 3).map(g => ({ id: g.id, name: g.name, strand: g.strand, grade: g.grade })),
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

const bandColor = (level) => {
  if (level <= 6) return 'text-red-500 bg-red-50 border-red-200';
  if (level <= 8) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-emerald-600 bg-emerald-50 border-emerald-200';
};

export function TeacherDashboard({ onBack, teacherProfile }) {
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

  const ctx = useMemo(() => ctxFor(SUBJECT_ID), []);

  // Load the teacher's classes and their rosters (RLS scopes both to classes
  // they own).
  useEffect(() => {
    let cancelled = false;
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
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Progress rows this teacher is permitted to read.
        const { data: rows, error: e1 } = await supabase
          .from('ai_tutor_progress')
          .select('user_id, progress, total_xp, current_streak, last_practice_date, diagnosed, updated_at');
        if (e1) throw e1;

        // Real per-user math rows only (composite keys like `uuid_afm` are
        // skipped), and never list the teacher's own row as a "student".
        const teacherId = teacherProfile?.id;
        const mathRows = (rows || []).filter(
          r => r.user_id && !r.user_id.includes('_') && r.user_id !== teacherId
        );
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

  // ---- class summary ----
  const summary = useMemo(() => {
    if (!inClass.length) return null;
    const levels = inClass.map(s => s.snap.level);
    const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
    const behind = inClass.filter(s => s.snap.gapCount > 0 || s.snap.level <= 6).length;
    const ahead = inClass.filter(s => s.snap.accelerated || s.snap.level >= 9).length;
    return { count: inClass.length, avg, behind, ahead };
  }, [inClass]);

  const sorted = useMemo(
    () => [...inClass].sort((a, b) => b.snap.level - a.snap.level),
    [inClass]
  );

  // One day, read once per render, so no two parts of this page can disagree
  // about whether something is due today.
  const today = useMemo(() => isoDay(), []);
  const shownAssignments = useMemo(
    () => (classId === 'all' ? assignments : assignments.filter(a => a.class_id === classId)),
    [assignments, classId]
  );

  // ---- render ----
  if (selected) {
    return <StudentDetail student={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && <button onClick={onBack} className="text-slate-400 hover:text-slate-600"><Icon name="back" /></button>}
            <div>
              <h1 className="text-lg font-bold text-slate-900">Class Insights</h1>
              <p className="text-xs text-slate-500">
                {SUBJECTS[SUBJECT_ID].name}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-5">
        {/* Which class. The roster table has existed since the first migration
            and nothing read it, so every number here was about "everyone whose
            row I can see" rather than about a class. */}
        {classes.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-xs text-slate-400 mr-1">Showing</span>
            {[{ id: 'all', name: 'Everyone' }, ...classes].map(c => (
              <button key={c.id} onClick={() => setClassId(c.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${classId === c.id ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                {c.name}
              </button>
            ))}
          </div>
        )}

        {/* TEACH THIS NEXT — the teacher's real question, answered first.
            A roster answers "how is Amani doing?" thirty-four times. Nobody
            can act on thirty-four answers before the bell. This is the same
            measurements read down the other axis: one skill, the children it
            is holding up, and something to do about it on Tuesday. */}
        {gaps.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-semibold text-slate-900">Teach this next</h2>
              <span className="text-xs text-slate-400">across {inClass.length} {inClass.length === 1 ? 'student' : 'students'}</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Ranked by how many children one lesson would unblock.
            </p>
            <div className="divide-y divide-slate-100">
              {gaps.map(g => {
                const who = [...g.blocked, ...g.failing];
                const share = inClass.length ? Math.round((g.count / inClass.length) * 100) : 0;
                return (
                  <div key={g.id} className="py-3">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <span className="text-xl font-bold text-slate-900 tabular-nums">{g.count}</span>
                      <span className="text-sm font-semibold text-red-600">{g.name}</span>
                      <span className="text-xs text-slate-400">{g.strand} · Grade {g.grade}</span>
                      {inClass.length > 1 && <span className="text-xs text-slate-400">{share}% of the class</span>}
                    </div>
                    {/* The two readings ask for different lessons, so they are
                        never merged into one number without saying which — but
                        the counts are only spelled out when both apply, since
                        otherwise they just repeat the number above.

                        No "unlocks 166 later skills" here: that is the whole
                        transitive chain, every foundation scores between 140
                        and 190, and a number that is always enormous tells a
                        teacher nothing. It still ranks the list; `critical` is
                        the part of it worth reading. */}
                    <p className="mt-0.5 text-xs text-slate-500">
                      {g.blocked.length > 0 && g.failing.length > 0
                        ? <>{g.blocked.length} missing it as a foundation · {g.failing.length} struggling with it right now</>
                        : g.blocked.length > 0
                        ? <>missing it as a foundation — they are failing work that needs it</>
                        : <>struggling with it right now</>}
                      {g.critical && <span className="text-slate-400"> · a foundation skill</span>}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      <span className="font-semibold text-amber-600">Five-minute move: </span>
                      {fiveMinuteMove(g)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {who.slice(0, 8).map(l => l.name).join(' · ')}
                      {who.length > 8 && ` · +${who.length - 8} more`}
                    </p>

                    {/* Set it as work, here, on the row that found it. */}
                    {assignmentsReady && classes.length > 0 && (
                      assigning === g.id
                        ? <AssignRow gap={g} classes={classes} classId={classId}
                            onCancel={() => setAssigning(null)} onAssign={assignGap} />
                        : <button onClick={() => { setAssigning(g.id); setAssignError(null); }}
                            className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md px-2.5 py-1 transition-colors">
                            Set as work →
                          </button>
                    )}
                  </div>
                );
              })}
            </div>
            {assignError && <p className="text-xs text-red-500 mt-2">{assignError}</p>}
          </div>
        )}

        {/* WORK SET — what was assigned, and who has actually mastered it.
            Not "who submitted": there is nothing to submit. A name moves into
            Done when the child masters the skill in their ordinary practice. */}
        {assignmentsReady && shownAssignments.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5">
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

        {/* Classes & join codes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900">Your classes</h2>
          </div>
          {classes.length > 0 ? (
            <div className="space-y-2 mb-3">
              {classes.map((c) => (
                <div key={c.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium text-slate-700">{c.name}</span>
                  <button
                    onClick={() => copyCode(c.join_code)}
                    className="flex items-center gap-2 text-sm font-mono font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md px-2.5 py-1 transition-colors"
                    title="Copy join code"
                  >
                    {c.join_code}
                    <span className="text-xs font-sans text-emerald-600">{copiedCode === c.join_code ? 'copied!' : 'copy'}</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 mb-3">No classes yet. Create one and share its code with your students.</p>
          )}
          <div className="flex gap-2">
            <input
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createClass()}
              placeholder="New class name (e.g. Form 2 Math)"
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              onClick={createClass}
              disabled={creating || !newClassName.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold rounded-lg text-sm transition-colors"
            >
              {creating ? 'Creating…' : 'Create'}
            </button>
          </div>
          {createError && <p className="text-xs text-red-500 mt-1.5">{createError}</p>}
        </div>

        {loading && <div className="text-center text-slate-400 py-16">Loading class…</div>}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            Couldn’t load students: {error}
          </div>
        )}

        {!loading && !error && students.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Icon name="brain" className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-700 mb-1">No student data visible yet</p>
            <p className="text-sm max-w-md mx-auto">
              Once your students use the AI Tutor, their progress appears here. If you
              expect students but see none, your account may need a class roster and
              read access configured (Supabase RLS).
            </p>
          </div>
        )}

        {!loading && summary && (
          <>
            {/* Class summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <SummaryCard label="Students" value={summary.count} />
              <SummaryCard label="Avg level" value={`G${summary.avg.toFixed(1)}`} />
              <SummaryCard label="Need support" value={summary.behind} accent="red" />
              <SummaryCard label="Racing ahead" value={summary.ahead} accent="emerald" />
            </div>

            {/* Roster */}
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
              {sorted.map((st) => (
                <button
                  key={st.userId}
                  onClick={() => setSelected(st)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center ${bandColor(st.snap.level)}`}>
                    <span className="text-[10px] leading-none opacity-70">level</span>
                    <span className="font-bold leading-tight">{st.snap.level.toFixed(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 truncate flex items-center gap-2">
                      {st.name}
                      {st.snap.accelerated && <span title="Working above grade" className="text-emerald-500"><Icon name="zap" className="w-3.5 h-3.5 inline" /></span>}
                      {st.snap.gapCount > 0 && <span title="Foundation gaps" className="text-red-500"><Icon name="alert" className="w-3.5 h-3.5 inline" /></span>}
                    </div>
                    <div className="text-xs text-slate-500">
                      {st.snap.mastered}/{st.snap.total} skills · {st.snap.percent}% mastered
                      {!st.diagnosed && ' · not placed yet'}
                    </div>
                  </div>
                  <Icon name="arrow" className="w-5 h-5 text-slate-300" />
                </button>
              ))}
            </div>
          </>
        )}
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
    <div className="mt-2 flex flex-wrap items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2">
      <span className="text-xs text-slate-500">Set “{gap.name}” for</span>
      <select value={cid} onChange={e => setCid(e.target.value)}
        aria-label="Class to set this work for"
        className="text-xs border border-slate-300 rounded-md px-2 py-1 bg-white">
        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <label className="text-xs text-slate-500" htmlFor={`due-${gap.id}`}>by</label>
      <input id={`due-${gap.id}`} type="date" value={due} onChange={e => setDue(e.target.value)}
        className="text-xs border border-slate-300 rounded-md px-2 py-1 bg-white" />
      <button disabled={busy || !cid}
        onClick={async () => { setBusy(true); await onAssign(gap, cid, due); setBusy(false); }}
        className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-md px-2.5 py-1">
        {busy ? 'Setting…' : 'Set work'}
      </button>
      <button onClick={onCancel} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
    </div>
  );
};

const SummaryCard = ({ label, value, accent }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-3">
    <div className="text-xs text-slate-500">{label}</div>
    <div className={`text-2xl font-bold ${accent === 'red' ? 'text-red-500' : accent === 'emerald' ? 'text-emerald-600' : 'text-slate-900'}`}>{value}</div>
  </div>
);

// ---- per-student detail ----
function StudentDetail({ student, onBack }) {
  const { name, snap, diagnosed } = student;
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600"><Icon name="back" /></button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">{name}</h1>
            <p className="text-xs text-slate-500">{diagnosed ? 'Placed' : 'Not placed yet'}</p>
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        <div className={`rounded-2xl border p-5 ${bandColor(snap.level)}`}>
          <div className="text-sm opacity-70">Overall level</div>
          <div className="text-4xl font-bold">Grade {snap.level.toFixed(0)}</div>
          <div className="text-sm mt-1">
            {snap.mastered}/{snap.total} skills mastered · {snap.percent}%
            {snap.accelerated && ' · working above grade'}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-3">By strand</h2>
          <div className="space-y-3">
            {snap.strands.map((s) => {
              const unassessed = s.confidence != null && s.confidence < 0.15;
              return (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">{s.name}</span>
                    <span className="text-slate-500">
                      {unassessed ? 'not assessed' : s.level != null ? `level ${s.level.toFixed(1)}` : `${s.percent}%`}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    {!unassessed && (
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${s.level != null ? Math.min(100, (s.level / 12) * 100) : s.percent}%` }}
                      />
                    )}
                  </div>
                  {s.accuracy != null && s.accuracy < 70 && (
                    <div className="text-xs text-red-500 mt-0.5">Accuracy {s.accuracy}%</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {snap.gapCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
            {snap.gapCount} foundation gap{snap.gapCount > 1 ? 's' : ''} detected — this student needs
            prerequisite support before moving on.
          </div>
        )}

      </main>
    </div>
  );
}
