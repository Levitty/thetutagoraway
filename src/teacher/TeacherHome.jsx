// ============================================================================
// HOREB FOR ANY TEACHER, step 1 (owner, 16 Nov 2026). An independent teacher's
// home: the first time, the five things we ask (school they teach at, county,
// grades, subjects, an optional TSC number), saved by teacher_save_profile
// (supabase/migrations/20261116_teachers.sql); after that, their own home.
// Lessons (step 2) and classes with learners (step 3) open here next.
// Teachers in Tuta schools never come here: they sign in through their school.
// ============================================================================
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase.js';

export const TEACHER_SUBJECTS = ['Mathematics', 'English', 'Kiswahili', 'Integrated Science', 'Science and Technology', 'Social Studies',
  'Religious Education', 'Agriculture', 'Creative Arts', 'Pre-Technical Studies', 'Environmental Activities', 'Literacy'];
export const COUNTIES = ['Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega',
  'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit',
  'Meru', 'Migori', 'Mombasa', "Murang'a", 'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya',
  'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'];
const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/** The teacher's saved details, or null when they have not given them yet. */
export async function loadTeacherProfile(userId) {
  const { data, error } = await supabase.from('teacher_profiles').select('school_name, county, grades, subjects, tsc_number').eq('user_id', userId).maybeSingle();
  if (error) return { error: error.message };
  return { data };
}

const chip = (on) => `px-3 py-2 rounded-full border text-sm font-semibold transition ${on ? 'bg-violet-600 border-violet-600 text-white' : 'bg-white border-slate-200 text-slate-700 hover:border-violet-300'}`;

export function TeacherSetup({ initial, onSaved, onCancel }) {
  const [f, setF] = useState({
    school: initial?.school_name || '', county: initial?.county || '',
    grades: initial?.grades || [], subjects: initial?.subjects || [], tsc: initial?.tsc_number || '',
  });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const toggle = (k, v) => setF((x) => ({ ...x, [k]: x[k].includes(v) ? x[k].filter((y) => y !== v) : [...x[k], v] }));

  const save = async (e) => {
    e.preventDefault(); setErr('');
    if (f.school.trim().length < 2) return setErr('Type the name of the school you teach at.');
    if (!f.county.trim()) return setErr('Pick your county.');
    if (!f.grades.length) return setErr('Tick the grades you teach.');
    if (!f.subjects.length) return setErr('Tick the subjects you teach.');
    setBusy(true);
    const { data, error } = await supabase.rpc('teacher_save_profile', {
      p_school: f.school.trim(), p_county: f.county.trim(), p_grades: [...f.grades].sort((a, b) => a - b), p_subjects: f.subjects, p_tsc: f.tsc.trim() || null,
    });
    setBusy(false);
    if (error) return setErr(/teacher_save_profile|function/i.test(error.message) ? 'Teacher accounts open once the database update is run. Try again later.' : error.message);
    if (!data?.success) return setErr(data?.error || 'Not saved. Try again.');
    onSaved?.();
  };

  return (
    <form onSubmit={save} className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-violet-600">Your teacher account</p>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">Tell us what you teach</h1>
      <p className="text-slate-500 mt-1">Five things, once. You can change them later.</p>
      {err && <div className="mt-4 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold" role="alert">{err}</div>}

      <label className="block mt-6 text-sm font-bold text-slate-700">The school you teach at
        <input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-base font-normal" value={f.school} maxLength={120}
          onChange={(e) => setF({ ...f, school: e.target.value })} placeholder="e.g. Kilimani Primary School" autoComplete="organization" />
        <span className="block mt-1 text-xs font-normal text-slate-400">Your account is yours, not the school's. This only tells us where you teach.</span>
      </label>

      <label className="block mt-5 text-sm font-bold text-slate-700">County
        <select className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-base font-normal bg-white" value={f.county} onChange={(e) => setF({ ...f, county: e.target.value })}>
          <option value="">Choose</option>
          {COUNTIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>

      <fieldset className="mt-5">
        <legend className="text-sm font-bold text-slate-700">Grades you teach</legend>
        <div className="flex flex-wrap gap-2 mt-2">
          {GRADES.map((g) => <button type="button" key={g} aria-pressed={f.grades.includes(g)} className={chip(f.grades.includes(g))} onClick={() => toggle('grades', g)}>Grade {g}</button>)}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-sm font-bold text-slate-700">Subjects you teach</legend>
        <div className="flex flex-wrap gap-2 mt-2">
          {TEACHER_SUBJECTS.map((s) => <button type="button" key={s} aria-pressed={f.subjects.includes(s)} className={chip(f.subjects.includes(s))} onClick={() => toggle('subjects', s)}>{s}</button>)}
        </div>
      </fieldset>

      <label className="block mt-5 text-sm font-bold text-slate-700">TSC number <span className="font-normal text-slate-400">(optional)</span>
        <input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-base font-normal" inputMode="numeric" value={f.tsc} maxLength={10}
          onChange={(e) => setF({ ...f, tsc: e.target.value.replace(/\D/g, '') })} placeholder="Digits only" />
      </label>

      <div className="flex flex-wrap gap-3 mt-7">
        <button type="submit" disabled={busy} className="rounded-xl bg-lime-300 px-6 py-3 font-bold text-slate-900 disabled:opacity-60" style={{ background: 'var(--hb-lime, #DCFF72)' }}>
          {busy ? 'Saving' : initial ? 'Save changes' : 'Open my teacher home'}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700">Cancel</button>}
      </div>
    </form>
  );
}

export default function TeacherHome({ profile }) {
  const [state, setState] = useState({ loading: true, data: null, error: '' });
  const [editing, setEditing] = useState(false);
  const load = async () => {
    const r = await loadTeacherProfile(profile.id);
    setState({ loading: false, data: r.data || null, error: r.error || '' });
  };
  useEffect(() => { load(); }, [profile?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (state.loading) return <div className="p-10 text-center text-slate-400">Opening your teacher home</div>;
  if (!state.data || editing) {
    return (
      <div className="px-4 py-8">
        <TeacherSetup initial={state.data} onSaved={() => { setEditing(false); load(); }} onCancel={state.data ? () => setEditing(false) : null} />
      </div>
    );
  }
  const t = state.data;
  const first = (profile.full_name || '').split(' ')[0] || 'Teacher';
  const grades = t.grades.length > 1 ? `Grades ${t.grades[0]} to ${t.grades[t.grades.length - 1]}` : `Grade ${t.grades[0]}`;
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <p className="text-xs font-bold uppercase tracking-widest text-violet-600">Teacher</p>
      <h1 className="text-3xl font-bold text-slate-900 mt-2">Karibu, {first}</h1>
      <p className="text-slate-500 mt-1">{t.subjects.join(', ')} · {grades} · {t.school_name}, {t.county}</p>

      <div className="grid gap-4 sm:grid-cols-2 mt-8">
        <div className="rounded-3xl p-6 text-white" style={{ background: 'var(--hb-violet, #4318D1)' }}>
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Next to open here</p>
          <h2 className="text-xl font-bold mt-2">Lessons, written for you</h2>
          <p className="mt-2 opacity-90">A scheme of work, a lesson plan and notes from the CBC curriculum for {t.subjects[0]}, printed in the format you hand in.</p>
        </div>
        <div className="rounded-3xl p-6 bg-white">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">After that</p>
          <h2 className="text-xl font-bold text-slate-900 mt-2">Your classes</h2>
          <p className="mt-2 text-slate-600">Learners join with a code, parents agree, and homework marks itself, with results by question.</p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-bold text-slate-900">Your details</p>
          <p className="text-sm text-slate-500">{t.school_name} · {t.county}{t.tsc_number ? ` · TSC ${t.tsc_number}` : ''}</p>
        </div>
        <button type="button" onClick={() => setEditing(true)} className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700">Change</button>
      </div>
    </div>
  );
}
