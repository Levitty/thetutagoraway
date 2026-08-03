// ============================================================================
// TEACHER DASHBOARD — the sellable surface.
//
// Answers a teacher's four real questions, in the order they ask them:
//   1. Who needs me today?        named stuck skills + a five-minute move
//   2. What do I teach tomorrow?  the skills the CLASS is stuck on, ranked
//   3. Is this actually used?     who practised this week, who has gone quiet
//   4. How is each child doing?   per-student level, strands, recent work
//
// Everything is scoped to a CLASS the teacher owns. Students join with a code
// (join_class RPC); the roster comes from class_members, so a student who
// joined but has never practised still appears — "hasn't started" is one of
// the most actionable states a teacher can see, and it is invisible if you
// only list progress rows.
//
// Data sources (all RLS-scoped to enrolled students — see
// supabase/migrations/20260615_classes_roster.sql):
//   classes / class_members   the roster
//   profiles                  student names
//   ai_tutor_progress         mastery state  (keyed by profile_key)
//   response_events           per-question telemetry, for engagement
// ============================================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../supabase.js';
import { SUBJECTS } from './subjects.js';
import { getStats, getStrandStats, getEstimatedGradeLevel, findGaps } from './adaptiveEngine.js';
import { getBrainProfile, isEngineAvailable } from './engineClient.js';
import { Icon } from './components/Icons.jsx';

const SUBJECT_ID = 'math';
const ACTIVITY_DAYS = 7;          // "this week" window for engagement
const EVENT_LIMIT = 5000;         // cap the telemetry pull for a big school

const ctxFor = (subjectId) => {
  const s = SUBJECTS[subjectId];
  return s ? { skills: s.skills, getPostReqs: s.getPostReqs } : null;
};

// Reconstruct the in-memory progress object from a stored row. Spread the
// stored blob first so declaredGrade / placementGrade / curriculum survive —
// the engine's level and gap logic reads them.
const rowToProgress = (row) => ({
  ...(row.progress || {}),
  skills: row.progress?.skills || {},
  diagnosticBalances: row.progress?.diagnosticBalances || null,
  diagnosed: row.diagnosed || false,
  totalXP: row.total_xp || 0,
  currentStreak: row.current_streak || 0,
  lastPracticeDate: row.last_practice_date || null,
});

// ai_tutor_progress is keyed by profile_key, not user_id: one account can hold
// several rows (a second subject → "<uid>_physics", a parent's child →
// "<uid>_c<childId>"). The account holder's MATH row is the one whose
// profile_key is just the user id. Without this filter a student taking two
// subjects appears twice, with the wrong subject's numbers.
const isOwnMathRow = (r) => !r.profile_key || r.profile_key === String(r.user_id);

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
const fiveMinuteMove = (gap) => {
  const id = gap?.id || '';
  if (/ADD/.test(id)) return 'Bundle sticks in tens — build both numbers, trade ten singles for one bundle, then retry on HOREB.';
  if (/SUB/.test(id)) return 'Act it out with bottle tops the child physically hands to you, counting what remains each time.';
  if (/MULT/.test(id)) return 'Plates and stones: 3 plates, 4 stones on each — how many plates? how many on each? how many altogether?';
  if (/DIV/.test(id)) return 'Share real counters into equal groups, one at a time, before writing anything.';
  if (/FRACTION/.test(id)) return 'Cut a paper circle into equal parts together — fold first, cut second, name each piece.';
  if (/PLACE|COUNT/.test(id)) return 'Place-value chart on paper: build the number with bottle tops in columns, then read it aloud.';
  if (/TIME|CLOCK/.test(id)) return 'A paper-plate clock with movable hands — the child sets the times you call out.';
  return 'Five minutes with physical counters, counting together out loud, then retry the skill on HOREB.';
};

const bandColor = (level) => {
  if (level <= 6) return 'text-rose-600 bg-rose-50 border-rose-200';
  if (level <= 8) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-emerald-600 bg-emerald-50 border-emerald-200';
};

// "3 days ago" beats a timestamp when the question is "has this child gone quiet?"
const relTime = (iso) => {
  if (!iso) return 'never';
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return 'last week';
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
};

export function TeacherDashboard({ onBack, teacherProfile }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [engineLive, setEngineLive] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classesLoaded, setClassesLoaded] = useState(false);  // avoids flashing the empty state
  const [activeClassId, setActiveClassId] = useState(null);   // null = all classes
  const [newClassName, setNewClassName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [focusSkill, setFocusSkill] = useState(null);         // drill-down from the weakness list
  const [reloadKey, setReloadKey] = useState(0);

  const ctx = useMemo(() => ctxFor(SUBJECT_ID), []);

  // ---- classes (RLS scopes this to classes the teacher owns) ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('classes')
        .select('id, name, join_code')
        .order('created_at', { ascending: true });
      if (!cancelled) { setClasses(data || []); setClassesLoaded(true); }
    })();
    return () => { cancelled = true; };
  }, [teacherProfile?.id]);

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

  const removeStudent = useCallback(async (student) => {
    const names = student.classIds.map(id => classes.find(c => c.id === id)?.name).filter(Boolean);
    if (!confirm(`Remove ${student.name} from ${names.join(' and ') || 'this class'}? Their own progress is not deleted.`)) return;
    const classIds = activeClassId ? [activeClassId] : student.classIds;
    await supabase.from('class_members').delete().eq('student_id', student.userId).in('class_id', classIds);
    setSelected(null);
    setReloadKey(k => k + 1);
  }, [activeClassId, classes]);

  // ---- roster + progress + engagement ----
  useEffect(() => {
    if (!classesLoaded) return;                                    // still resolving; keep the spinner
    if (!classes.length) { setStudents([]); setLoading(false); return; }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const classIds = classes.map(c => c.id);

        // 1. The roster itself. This — not the progress table — defines who is
        //    in the class, so a student who has never practised still shows up.
        const { data: members, error: e0 } = await supabase
          .from('class_members')
          .select('class_id, student_id, created_at')
          .in('class_id', classIds);
        if (e0) throw e0;

        const teacherId = teacherProfile?.id;
        const byStudent = new Map();
        for (const m of members || []) {
          if (!m.student_id || m.student_id === teacherId) continue;
          const cur = byStudent.get(m.student_id) || { classIds: [], joinedAt: m.created_at };
          cur.classIds.push(m.class_id);
          if (m.created_at < cur.joinedAt) cur.joinedAt = m.created_at;
          byStudent.set(m.student_id, cur);
        }
        const ids = [...byStudent.keys()];

        if (!ids.length) {
          if (!cancelled) { setStudents([]); setLoading(false); }
          return;
        }

        // 2. Names, progress and this week's telemetry — in parallel.
        const since = new Date(Date.now() - ACTIVITY_DAYS * 86400000).toISOString();
        const [profilesRes, progressRes, eventsRes] = await Promise.all([
          supabase.from('profiles').select('id, full_name, email').in('id', ids),
          supabase
            .from('ai_tutor_progress')
            .select('user_id, profile_key, progress, total_xp, current_streak, last_practice_date, diagnosed, updated_at')
            .in('user_id', ids),
          supabase
            .from('response_events')
            .select('student_id, skill_id, correct, created_at')
            .in('student_id', ids)
            .eq('subject', SUBJECT_ID)
            .gte('created_at', since)
            .order('created_at', { ascending: false })
            .limit(EVENT_LIMIT),
        ]);

        const nameById = {};
        for (const p of profilesRes.data || []) nameById[p.id] = p.full_name || p.email || 'Student';

        const rowById = {};
        for (const r of progressRes.data || []) {
          if (!r.user_id || !isOwnMathRow(r)) continue;
          rowById[r.user_id] = r;
        }

        // Engagement per student: questions answered, accuracy, last seen.
        const activityById = {};
        for (const ev of eventsRes.data || []) {
          const a = activityById[ev.student_id] || { answered: 0, correct: 0, lastAt: null, skills: new Set() };
          a.answered++;
          if (ev.correct) a.correct++;
          if (!a.lastAt || ev.created_at > a.lastAt) a.lastAt = ev.created_at;
          if (ev.skill_id) a.skills.add(ev.skill_id);
          activityById[ev.student_id] = a;
        }

        // 3. One record per enrolled student — with or without progress.
        const base = ids.map((id) => {
          const meta = byStudent.get(id);
          const row = rowById[id];
          const progress = row ? rowToProgress(row) : null;
          const act = activityById[id];
          return {
            userId: id,
            name: nameById[id] || 'Student',
            classIds: meta.classIds,
            joinedAt: meta.joinedAt,
            started: !!row,
            diagnosed: !!row?.diagnosed,
            updatedAt: row?.updated_at || null,
            lastPractice: row?.last_practice_date || null,
            streak: row?.current_streak || 0,
            xp: row?.total_xp || 0,
            progress,
            snap: progress ? jsSnapshot(progress, ctx) : null,
            activity: act
              ? { answered: act.answered, correct: act.correct, lastAt: act.lastAt, skillCount: act.skills.size }
              : { answered: 0, correct: 0, lastAt: null, skillCount: 0 },
          };
        });
        if (cancelled) return;
        setStudents(base);
        setLoading(false);

        // 4. If the brain is live, overlay its sharper level asynchronously.
        const live = await isEngineAvailable();
        if (cancelled) return;
        setEngineLive(live);
        if (live) {
          const enhanced = await Promise.all(base.map(async (st) => {
            if (!st.progress) return st;
            const p = await getBrainProfile(st.progress, SUBJECT_ID);
            if (!p) return st;
            return {
              ...st,
              snap: {
                ...st.snap,
                level: p.overall_level,
                mastered: p.mastered,
                percent: p.percent,
                accelerated: p.accelerated,
                strands: p.strands.map(s => ({ name: s.strand, percent: s.percent, level: s.level, confidence: s.confidence })),
                brain: true,
              },
            };
          }));
          if (!cancelled) setStudents(enhanced);
        }
      } catch (err) {
        if (!cancelled) { setError(err.message || 'Failed to load'); setLoading(false); }
      }
    })();
    return () => { cancelled = true; };
  }, [ctx, teacherProfile?.id, classes, classesLoaded, reloadKey]);

  // ---- the students in view (one class, or all) ----
  const inView = useMemo(
    () => (activeClassId ? students.filter(s => s.classIds.includes(activeClassId)) : students),
    [students, activeClassId]
  );

  const started = useMemo(() => inView.filter(s => s.started && s.snap), [inView]);

  // ---- class summary ----
  const summary = useMemo(() => {
    if (!inView.length) return null;
    const levels = started.map(s => s.snap.level);
    const avg = levels.length ? levels.reduce((a, b) => a + b, 0) / levels.length : null;
    return {
      count: inView.length,
      avg,
      notStarted: inView.filter(s => !s.started).length,
      activeWeek: inView.filter(s => s.activity.answered > 0).length,
      answered: inView.reduce((t, s) => t + s.activity.answered, 0),
    };
  }, [inView, started]);

  // ---- what to teach next: the skills the CLASS is stuck on ----
  // A single child stuck on fractions is a five-minute conversation. Eleven
  // children stuck on the same skill is tomorrow's lesson. Ranking gaps by how
  // many students share them turns individual data into a teaching decision.
  const classWeakness = useMemo(() => {
    const bySkill = new Map();
    for (const st of started) {
      for (const g of st.snap.topGaps || []) {
        const e = bySkill.get(g.id) || { ...g, students: [] };
        e.students.push({ userId: st.userId, name: st.name });
        bySkill.set(g.id, e);
      }
    }
    return [...bySkill.values()]
      .filter(e => e.students.length >= 2)          // 1 student = the "needs you today" list
      .sort((a, b) => b.students.length - a.students.length)
      .slice(0, 4);
  }, [started]);

  const sorted = useMemo(() => {
    // Not-started students sort to the bottom; otherwise by measured level.
    return [...inView].sort((a, b) => {
      if (a.started !== b.started) return a.started ? -1 : 1;
      if (!a.started) return a.name.localeCompare(b.name);
      return b.snap.level - a.snap.level;
    });
  }, [inView]);

  const activeClass = classes.find(c => c.id === activeClassId) || null;

  // ---- render ----
  if (selected) {
    return (
      <StudentDetail
        student={selected}
        onBack={() => setSelected(null)}
        onRemove={() => removeStudent(selected)}
        engineLive={engineLive}
        className={activeClass?.name}
      />
    );
  }

  if (focusSkill) {
    return <SkillFocus entry={focusSkill} onBack={() => setFocusSkill(null)} onPick={(id) => {
      const st = students.find(s => s.userId === id);
      if (st) { setFocusSkill(null); setSelected(st); }
    }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {onBack && <button onClick={onBack} className="text-slate-400 hover:text-slate-600"><Icon name="back" /></button>}
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-slate-900 truncate">
                {activeClass ? activeClass.name : 'Class Insights'}
              </h1>
              <p className="text-xs text-slate-500">
                {SUBJECTS[SUBJECT_ID].name}
                {summary ? ` · ${summary.count} student${summary.count === 1 ? '' : 's'}` : ''}
                {engineLive ? ' · live engine' : ''}
              </p>
            </div>
          </div>

          {/* Class switcher — a teacher with Form 1, 2 and 3 must never see
              them blended into one average. */}
          {classes.length > 1 && (
            <div className="flex gap-2 mt-2.5 overflow-x-auto pb-0.5">
              <ClassPill active={activeClassId === null} onClick={() => setActiveClassId(null)} label="All students" />
              {classes.map(c => (
                <ClassPill key={c.id} active={activeClassId === c.id} onClick={() => setActiveClassId(c.id)} label={c.name} />
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-5">
        {/* No classes yet — the one thing to do, said plainly. */}
        {classesLoaded && !classes.length && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center mb-5">
            <Icon name="map" className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <h2 className="font-bold text-slate-900 mb-1">Create your first class</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
              You'll get a join code to give your students. Once they enter it in HOREB,
              their progress appears here — no accounts to set up for them.
            </p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createClass()}
                placeholder="e.g. Form 2 Blue"
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
            {createError && <p className="text-xs text-rose-500 mt-1.5">{createError}</p>}
          </div>
        )}

        {/* 1. Who needs me today */}
        {(() => {
          const needs = started
            .filter(s => s.snap.topGaps?.length > 0)
            .sort((a, b) => b.snap.gapCount - a.snap.gapCount)
            .slice(0, 3);
          if (!needs.length) return null;
          return (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5">
              <div className="flex items-baseline justify-between mb-1">
                <h2 className="font-semibold text-slate-900">
                  {needs.length === 1 ? 'One child needs you today' : `${needs.length} children need you today`}
                </h2>
                <span className="text-xs text-slate-400">stuck on a foundation</span>
              </div>
              <div className="divide-y divide-slate-100">
                {needs.map(st => {
                  const gap = st.snap.topGaps[0];
                  return (
                    <button key={st.userId} onClick={() => setSelected(st)} className="w-full text-left py-3 group">
                      <div className="flex flex-wrap items-baseline gap-x-3">
                        <span className="font-semibold text-slate-900 group-hover:underline">{st.name}</span>
                        <span className="text-sm font-semibold text-rose-600">{gap.name}</span>
                        <span className="text-xs text-slate-400">{gap.strand} · Grade {gap.grade}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        <span className="font-semibold text-amber-600">Five-minute move: </span>
                        {fiveMinuteMove(gap)}
                      </p>
                      {st.snap.topGaps.length > 1 && (
                        <p className="mt-0.5 text-xs text-slate-400">
                          Also stuck: {st.snap.topGaps.slice(1).map(g => g.name).join(' · ')}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* 2. What to teach next — shared gaps become a lesson plan */}
        {classWeakness.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="font-semibold text-slate-900">What to teach next</h2>
              <span className="text-xs text-slate-400">skills several students share</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              One child stuck is a quiet word. Several stuck on the same skill is tomorrow's lesson.
            </p>
            <div className="divide-y divide-slate-100">
              {classWeakness.map(entry => (
                <button key={entry.id} onClick={() => setFocusSkill(entry)} className="w-full text-left py-3 group">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="text-lg font-bold text-rose-600 tabular-nums">{entry.students.length}</span>
                    <span className="text-sm text-slate-500">students stuck on</span>
                    <span className="font-semibold text-slate-900 group-hover:underline">{entry.name}</span>
                    <span className="text-xs text-slate-400">{entry.strand} · Grade {entry.grade}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    <span className="font-semibold text-amber-600">Whole-class move: </span>
                    {fiveMinuteMove(entry)}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400 truncate">
                    {entry.students.map(s => s.name).join(' · ')}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <div className="text-center text-slate-400 py-16">Loading class…</div>}

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-700">
            Couldn't load students: {error}
          </div>
        )}

        {!loading && !error && classes.length > 0 && inView.length === 0 && (
          <div className="text-center py-14 text-slate-500 bg-white rounded-2xl border border-slate-200 mb-5">
            <Icon name="brain" className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-700 mb-1">No students have joined yet</p>
            <p className="text-sm max-w-md mx-auto">
              Share the join code below. Students enter it in HOREB under
              “Join a class”, and they'll appear here straight away.
            </p>
          </div>
        )}

        {!loading && summary && inView.length > 0 && (
          <>
            {/* 3. Is it being used */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <SummaryCard label="Students" value={summary.count} />
              <SummaryCard label="Avg level" value={summary.avg != null ? `G${summary.avg.toFixed(1)}` : '—'} />
              <SummaryCard
                label={`Active (${ACTIVITY_DAYS}d)`}
                value={`${summary.activeWeek}/${summary.count}`}
                accent={summary.activeWeek === 0 ? 'rose' : 'emerald'}
              />
              <SummaryCard label="Not started" value={summary.notStarted} accent={summary.notStarted > 0 ? 'amber' : undefined} />
            </div>

            {/* 4. The roster */}
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 mb-5">
              {sorted.map((st) => (
                <button
                  key={st.userId}
                  onClick={() => setSelected(st)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left"
                >
                  {st.started && st.snap ? (
                    <div className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center shrink-0 ${bandColor(st.snap.level)}`}>
                      <span className="text-[10px] leading-none opacity-70">level</span>
                      <span className="font-bold leading-tight">{st.snap.level.toFixed(st.snap.brain ? 1 : 0)}</span>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-300 shrink-0">
                      <Icon name="clock" className="w-5 h-5" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 truncate flex items-center gap-2">
                      {st.name}
                      {st.snap?.accelerated && <span title="Working above grade" className="text-emerald-500">⚡</span>}
                      {st.snap?.gapCount > 0 && <span title="Foundation gaps" className="text-rose-500">⚠️</span>}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {st.started && st.snap ? (
                        <>
                          {st.snap.mastered}/{st.snap.total} skills · {st.snap.percent}% mastered
                          {!st.diagnosed && ' · not placed yet'}
                        </>
                      ) : (
                        <span className="text-amber-600 font-medium">Joined {relTime(st.joinedAt)} · hasn't started</span>
                      )}
                    </div>
                    {st.started && (
                      <div className="text-xs text-slate-400 mt-0.5">
                        {st.activity.answered > 0
                          ? `${st.activity.answered} questions this week · last seen ${relTime(st.activity.lastAt)}`
                          : `No practice this week · last seen ${relTime(st.lastPractice || st.updatedAt)}`}
                      </div>
                    )}
                  </div>
                  <Icon name="arrow" className="w-5 h-5 text-slate-300 shrink-0" />
                </button>
              ))}
            </div>
          </>
        )}

        {/* Classes & join codes */}
        {classes.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900 mb-3">Your classes</h2>
            <div className="space-y-2 mb-3">
              {classes.map((c) => {
                const n = students.filter(s => s.classIds.includes(c.id)).length;
                return (
                  <div key={c.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-700 truncate">{c.name}</div>
                      <div className="text-xs text-slate-400">{n} student{n === 1 ? '' : 's'}</div>
                    </div>
                    <button
                      onClick={() => copyCode(c.join_code)}
                      className="flex items-center gap-2 text-sm font-mono font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md px-2.5 py-1 transition-colors shrink-0"
                      title="Copy join code"
                    >
                      {c.join_code}
                      <span className="text-xs font-sans text-emerald-600">{copiedCode === c.join_code ? 'copied!' : 'copy'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
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
            {createError && <p className="text-xs text-rose-500 mt-1.5">{createError}</p>}
          </div>
        )}
      </main>
    </div>
  );
}

const ClassPill = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
      active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`}
  >
    {label}
  </button>
);

const SummaryCard = ({ label, value, accent }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-3">
    <div className="text-xs text-slate-500">{label}</div>
    <div className={`text-2xl font-bold ${
      accent === 'rose' ? 'text-rose-500'
      : accent === 'amber' ? 'text-amber-600'
      : accent === 'emerald' ? 'text-emerald-600'
      : 'text-slate-900'
    }`}>{value}</div>
  </div>
);

// ---- who exactly is stuck on this skill ----
function SkillFocus({ entry, onBack, onPick }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600"><Icon name="back" /></button>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-900 truncate">{entry.name}</h1>
            <p className="text-xs text-slate-500">{entry.strand} · Grade {entry.grade}</p>
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-3xl font-bold text-rose-600">{entry.students.length}</div>
          <div className="text-sm text-slate-600 mb-3">students are stuck on this skill</div>
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-amber-600">Whole-class move: </span>
            {fiveMinuteMove(entry)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {entry.students.map(s => (
            <button key={s.userId} onClick={() => onPick(s.userId)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-left transition-colors">
              <span className="font-medium text-slate-800">{s.name}</span>
              <Icon name="arrow" className="w-5 h-5 text-slate-300" />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

// ---- per-student detail ----
function StudentDetail({ student, onBack, onRemove, engineLive, className }) {
  const { name, snap, diagnosed, started, activity, streak, xp, joinedAt, lastPractice, updatedAt } = student;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-slate-400 hover:text-slate-600"><Icon name="back" /></button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900 truncate">{name}</h1>
            <p className="text-xs text-slate-500">
              {className ? `${className} · ` : ''}
              {!started ? 'Hasn’t started' : diagnosed ? 'Placed' : 'Not placed yet'}
            </p>
          </div>
          <button onClick={onRemove} className="text-xs text-slate-400 hover:text-rose-600 shrink-0">Remove</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {!started ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
            <Icon name="clock" className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="font-semibold text-slate-800 mb-1">Joined {relTime(joinedAt)}, hasn't practised yet</p>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Nothing to show until they answer their first questions. The level check
              takes about ten minutes and places them automatically.
            </p>
          </div>
        ) : (
          <>
            <div className={`rounded-2xl border p-5 ${bandColor(snap.level)}`}>
              <div className="text-sm opacity-70">Overall level</div>
              <div className="text-4xl font-bold">Grade {snap.level.toFixed(snap.brain ? 1 : 0)}</div>
              <div className="text-sm mt-1">
                {snap.mastered}/{snap.total} skills mastered · {snap.percent}%
                {snap.accelerated && ' · ⚡ working above grade'}
              </div>
            </div>

            {/* This week — the engagement question, answered concretely */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-900 mb-3">This week</h2>
              {activity.answered > 0 ? (
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-2xl font-bold text-slate-900 tabular-nums">{activity.answered}</div>
                    <div className="text-xs text-slate-500">questions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 tabular-nums">
                      {Math.round((activity.correct / activity.answered) * 100)}%
                    </div>
                    <div className="text-xs text-slate-500">correct</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 tabular-nums">{activity.skillCount}</div>
                    <div className="text-xs text-slate-500">skills touched</div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No practice in the last {ACTIVITY_DAYS} days — last seen {relTime(lastPractice || updatedAt)}.
                </p>
              )}
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
                {streak > 0 ? `${streak}-day streak · ` : ''}{xp} XP total
              </div>
            </div>

            {snap.topGaps?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h2 className="font-semibold text-slate-900 mb-1">Stuck on</h2>
                <p className="text-xs text-slate-500 mb-3">Foundations to shore up before moving on.</p>
                <div className="divide-y divide-slate-100">
                  {snap.topGaps.map(g => (
                    <div key={g.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex flex-wrap items-baseline gap-x-2.5">
                        <span className="font-semibold text-rose-600 text-sm">{g.name}</span>
                        <span className="text-xs text-slate-400">{g.strand} · Grade {g.grade}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        <span className="font-semibold text-amber-600">Five-minute move: </span>
                        {fiveMinuteMove(g)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                        <div className="text-xs text-rose-500 mt-0.5">⚠️ accuracy {s.accuracy}%</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {!engineLive && (
              <p className="text-xs text-slate-400 text-center">
                Showing offline estimate. Connect the engine for the sharper continuous level.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
