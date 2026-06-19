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
import { getStats, getStrandStats, getEstimatedGradeLevel, findGaps } from './adaptiveEngine.js';
import { getBrainProfile, isEngineAvailable } from './engineClient.js';
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
    accelerated: false,
  };
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
  const [engineLive, setEngineLive] = useState(false);
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  const ctx = useMemo(() => ctxFor(SUBJECT_ID), []);

  // Load the teacher's classes (RLS scopes this to classes they own).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('classes')
        .select('id, name, join_code')
        .order('created_at', { ascending: true });
      if (!cancelled) setClasses(data || []);
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

        // 4. If the brain is live, overlay its sharper level asynchronously.
        const live = await isEngineAvailable();
        if (cancelled) return;
        setEngineLive(live);
        if (live) {
          const enhanced = await Promise.all(base.map(async (st) => {
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
  }, [ctx, teacherProfile?.id]);

  // ---- class summary ----
  const summary = useMemo(() => {
    if (!students.length) return null;
    const levels = students.map(s => s.snap.level);
    const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
    const behind = students.filter(s => s.snap.gapCount > 0 || s.snap.level <= 6).length;
    const ahead = students.filter(s => s.snap.accelerated || s.snap.level >= 9).length;
    return { count: students.length, avg, behind, ahead };
  }, [students]);

  const sorted = useMemo(
    () => [...students].sort((a, b) => b.snap.level - a.snap.level),
    [students]
  );

  // ---- render ----
  if (selected) {
    return <StudentDetail student={selected} onBack={() => setSelected(null)} engineLive={engineLive} />;
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
                {engineLive ? ' · live engine' : ' · offline estimate'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-5">
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
                    <span className="font-bold leading-tight">{st.snap.level.toFixed(st.snap.brain ? 1 : 0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 truncate flex items-center gap-2">
                      {st.name}
                      {st.snap.accelerated && <span title="Working above grade" className="text-emerald-500">⚡</span>}
                      {st.snap.gapCount > 0 && <span title="Foundation gaps" className="text-red-500">⚠️</span>}
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

const SummaryCard = ({ label, value, accent }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-3">
    <div className="text-xs text-slate-500">{label}</div>
    <div className={`text-2xl font-bold ${accent === 'red' ? 'text-red-500' : accent === 'emerald' ? 'text-emerald-600' : 'text-slate-900'}`}>{value}</div>
  </div>
);

// ---- per-student detail ----
function StudentDetail({ student, onBack, engineLive }) {
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
          <div className="text-4xl font-bold">Grade {snap.level.toFixed(snap.brain ? 1 : 0)}</div>
          <div className="text-sm mt-1">
            {snap.mastered}/{snap.total} skills mastered · {snap.percent}%
            {snap.accelerated && ' · ⚡ working above grade'}
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
                    <div className="text-xs text-red-500 mt-0.5">⚠️ accuracy {s.accuracy}%</div>
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

        {!engineLive && (
          <p className="text-xs text-slate-400 text-center">
            Showing offline estimate. Connect the engine for the sharper continuous level.
          </p>
        )}
      </main>
    </div>
  );
}
