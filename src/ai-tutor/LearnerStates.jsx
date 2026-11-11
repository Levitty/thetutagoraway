// ============================================================================
// ONE LEARNER'S SKILLS IN WORDS (11 Nov 2026, docs/learner-model.md step 2).
//
// Sits in the teacher's existing one-child page. Each skill shows its state in
// the five shared words, grouped by sub-strand, and "Why" opens the evidence
// the state rests on. The rules are in learner/mastery.js; this only reads the
// log and shows what they say. RLS decides who sees whose rows (a teacher reads
// their class's learners, exactly as the rest of the dashboard does).
// ============================================================================
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabase.js';
import { SKILLS } from './knowledgeGraph.js';
import { demoEvidence } from './demoClass.js';
import { learnerMastery, labelFromCode, RULES } from '../learner/mastery.js';

const COLS_BASE = 'id, student_id, skill_id, correct, hints_used, created_at';
const COLS_FULL = `${COLS_BASE}, source, cskill, difficulty, independent, marks, max_marks, outcome_code, substrand_code`;

const SOURCE_WORDS = {
  practice: 'HOREB practice', school_homework: 'School homework', school_exam: 'School exam', tutor: 'Tutor', visual: 'Visual lesson',
};
const labelOf = (key) => SKILLS[key]?.name || labelFromCode(key);
const DOT = { not_assessed: '#D4D4DA', not_enough: '#A3A3AD', emerging: '#B7791F', developing: '#4B6FA8', mastered: '#2F7D5B' };

const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

/** Read one learner's evidence; the richer columns arrive with the learner-evidence migration, so fall back to the base ones. */
async function readEvidence(userId) {
  const read = (cols) => supabase.from('response_events').select(cols)
    .eq('student_id', userId).order('created_at', { ascending: false }).limit(1500);
  let res = await read(COLS_FULL);
  if (res.error) res = await read(COLS_BASE);
  if (res.error) throw new Error(res.error.message);
  return res.data || [];
}

const Word = ({ state, children }) => (
  <span className="inline-flex items-center gap-2 text-[13px] font-bold text-slate-800 shrink-0">
    <span aria-hidden="true" className="w-2 h-2 rounded-full" style={{ background: DOT[state] }} />{children}
  </span>
);

function Why({ skill, byId }) {
  const rows = skill.evidenceIds.map((id) => byId.get(id)).filter(Boolean)
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  return (
    <div className="mt-2.5 rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-[13px] text-slate-700 leading-snug">{skill.reason}</p>
      {rows.length > 0 && (
        <table className="w-full mt-3 text-[12.5px] text-left">
          <thead>
            <tr className="text-slate-400 text-[11px] uppercase tracking-[.06em]">
              <th className="font-bold pb-1 pr-3">Date</th><th className="font-bold pb-1 pr-3">Source</th>
              <th className="font-bold pb-1 pr-3">Answer</th><th className="font-bold pb-1 pr-3">Help</th><th className="font-bold pb-1">Difficulty</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {rows.map((r) => {
              const helped = r.independent === false || Number(r.hints_used) > 0;
              const partial = Number(r.max_marks) > 1 ? `${r.marks ?? 0} of ${r.max_marks}` : null;
              return (
                <tr key={r.id} className="border-t border-slate-200/70">
                  <td className="py-1 pr-3 tabular-nums">{fmtDate(r.created_at)}</td>
                  <td className="py-1 pr-3">{SOURCE_WORDS[r.source] || 'HOREB practice'}</td>
                  <td className="py-1 pr-3">{partial || (r.correct ? 'Right' : 'Wrong')}</td>
                  <td className="py-1 pr-3">{helped ? 'With help' : r.independent === true ? 'On their own' : 'Not recorded'}</td>
                  <td className="py-1">{r.difficulty ? r.difficulty[0].toUpperCase() + r.difficulty.slice(1) : 'Not recorded'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export function LearnerStates({ student, isDemo = false }) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState(null);
  const [open, setOpen] = useState(() => new Set());

  useEffect(() => {
    let live = true;
    setRows(null); setErr(null);
    if (isDemo) { setRows(demoEvidence(student.userId)); return undefined; }
    readEvidence(student.userId).then((r) => live && setRows(r)).catch((e) => live && setErr(e.message));
    return () => { live = false; };
  }, [student.userId, isDemo]);

  const model = useMemo(() => (rows ? learnerMastery(rows, { labelOf }) : null), [rows]);
  const byId = useMemo(() => new Map((rows || []).map((r) => [r.id, r])), [rows]);

  // Skills grouped by sub-strand; a skill with no sub-strand code is listed last.
  const groups = useMemo(() => {
    if (!model) return [];
    const list = model.substrands.map((g) => ({ ...g, title: labelFromCode(g.code), skills: model.skills.filter((s) => g.skillKeys.includes(s.key)) }));
    const loose = model.skills.filter((s) => !s.substrand);
    if (loose.length) list.push({ code: '_other', title: 'Other practice skills', skills: loose, word: null, state: null });
    return list;
  }, [model]);

  const toggle = (key) => setOpen((o) => { const n = new Set(o); n.has(key) ? n.delete(key) : n.add(key); return n; });
  const firstName = String(student.name || '').split(' ')[0] || 'This learner';

  return (
    <div className="bg-white rounded-[28px] p-5 sm:p-6">
      <h2 className="text-[15px] font-extrabold tracking-tight text-slate-900">Skills, in words</h2>
      <p className="text-[12px] text-slate-400 mt-1 leading-snug">
        From the newest {RULES.WINDOW} answers on each skill. Help counts only toward emerging.
      </p>
      {err && <p className="text-[13px] text-slate-500 mt-4">Could not read the answers just now.</p>}
      {!err && !rows && <p className="text-[13px] text-slate-400 mt-4">Reading the answers.</p>}
      {model && !model.skills.length && (
        <p className="text-[13px] text-slate-500 mt-4 leading-snug">{firstName} has no recorded answers on a curriculum skill yet.</p>
      )}
      {model?.assumptions.map((a) => <p key={a} className="text-[12px] text-slate-400 mt-3 leading-snug">{a}</p>)}
      <div className="mt-4 space-y-5">
        {groups.map((g) => (
          <section key={g.code}>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[12px] font-bold tracking-[.06em] uppercase text-slate-500 truncate">{g.title}</h3>
              {g.word && <span className="text-[12px] text-slate-400 shrink-0">{g.word}</span>}
            </div>
            <ul className="mt-1.5 divide-y divide-slate-100">
              {g.skills.map((s) => (
                <li key={s.key} className="py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[14px] text-slate-900 leading-snug min-w-0">{s.label}</span>
                    <span className="flex items-center gap-3">
                      <Word state={s.state}>{s.word}</Word>
                      <button onClick={() => toggle(s.key)} aria-expanded={open.has(s.key)}
                        className="text-[12.5px] font-bold text-slate-500 hover:text-slate-900 underline underline-offset-2">
                        {open.has(s.key) ? 'Hide' : 'Why'}
                      </button>
                    </span>
                  </div>
                  {open.has(s.key) && <Why skill={s} byId={byId} />}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export default LearnerStates;
