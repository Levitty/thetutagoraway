// A page for a person to see and try the new questions, by grade and strand,
// with the real marker and the real pictures. It only exists under the dev
// server (npm run horeb:try): it is not an entry of the production build.
import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import { FAMILIES } from '../../src/ai-tutor/content/families/index.js';
import { drawFamily, familyMode } from '../../src/ai-tutor/content/families/core.js';
import { OUTCOMES } from '../../src/ai-tutor/curriculum/outcomes.js';
import { SKILLS } from '../../src/ai-tutor/knowledgeGraph.js';
import { checkAnswerMatch } from '../../src/ai-tutor/answerCheck.js';
import { QuestionMedia } from '../../src/ai-tutor/QuestionMedia.jsx';
import { StepsQuestion } from '../../src/ai-tutor/StepsQuestion.jsx';

const FORM = { direct: 'Plain question', word: 'Story', steps: 'In parts', spot: 'Find the mistake', why: 'Choose the reason', table: 'Read a table', graph: 'Read a graph' };
const strandOf = (o) => (/^Measurement/.test(o.strand) ? 'Measurements' : /^Data/.test(o.strand) ? 'Data' : o.strand);
const ALL = FAMILIES.map(f => ({ f, o: OUTCOMES[f.outcome] }));
const GRADES = [...new Set(ALL.map(x => x.o.grade))].sort((a, b) => b - a);

function Card({ f, o }) {
  const [n, setN] = useState(0);
  const p = useMemo(() => drawFamily(f).p, [f, n]);
  const [val, setVal] = useState('');
  const [result, setResult] = useState(null);
  const [open, setOpen] = useState(false);
  const again = () => { setN(x => x + 1); setVal(''); setResult(null); setOpen(false); };
  const check = (v) => { setVal(v); const m = p.misconceptions?.find(x => String(x.when) === String(v)); setResult({ ok: checkAnswerMatch(String(v), p), note: m?.feedback }); };
  return (
    <div className="bg-white border border-slate-300 rounded-lg p-4 mb-4">
      <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-2">
        <span className="font-semibold">{FORM[f.form]}</span><span>Rung {f.rung}</span><span>{SKILLS[f.skill]?.name}</span>
        <span>{f.core ? 'On for children' : f.reviewed ? 'Reviewed' : 'Not reviewed'}</span>
      </div>
      <p className="text-xs text-slate-500 mb-3">CBC: {o.substrand}: {o.text}</p>
      <p className="text-slate-900 mb-3">{p.question}</p>
      <QuestionMedia problem={p} className="mb-3 max-w-md" />
      {p.shownSteps && <ol className="list-decimal ml-5 mb-3 text-slate-800">{p.shownSteps.map((s, i) => <li key={i}>{s}</li>)}</ol>}
      {p.parts ? (open ? <StepsQuestion key={p.question} problem={p} onDone={(r) => setResult({ ok: r.correct, note: `${r.marks} of ${r.total} marks` })} /> : <button onClick={() => setOpen(true)} className="border border-slate-400 rounded-lg px-3 py-2 mb-2">Answer the {p.parts.length} parts</button>) : (p.mc || p.choices) ? (
        <div className="grid gap-2 mb-2">{(p.mc || p.choices).map(c => (
          <button key={c} onClick={() => check(c)} className={`text-left border rounded-lg px-3 py-2 ${val === c ? 'border-slate-900 bg-slate-100' : 'border-slate-300'}`}>{c}</button>
        ))}</div>
      ) : (
        <form className="flex gap-2 mb-2" onSubmit={(e) => { e.preventDefault(); check(val); }}>
          <input aria-label="Your answer" value={val} onChange={e => { setVal(e.target.value); setResult(null); }} className="border border-slate-400 rounded-lg px-3 py-2 flex-1 min-w-0" />
          <button className="bg-slate-900 text-white rounded-lg px-4">Check</button>
        </form>
      )}
      {result && <p className={`text-sm mb-2 ${result.ok ? 'text-green-800' : 'text-red-800'}`}>{result.ok ? 'Right.' : `Not right. ${result.note || ''}`}{p.explain && !result.ok ? ` ${p.explain}` : ''}</p>}
      <details className="text-sm text-slate-700 mb-2"><summary className="cursor-pointer">Answer and working</summary>
        <p className="mt-1 font-semibold">{String(p.answer)}</p>
        <ul className="list-disc ml-5">{(p.solutionSteps || []).map((s, i) => <li key={i}>{s}</li>)}</ul>
        {p.hints?.length > 0 && <p className="mt-1">Hints: {p.hints.join(' / ')}</p>}
        {p.misconceptions?.length > 0 && <p className="mt-1">Wrong answers it knows: {p.misconceptions.map(m => m.when).join(', ')}</p>}
        <p className="mt-1 text-xs text-slate-500">{f.id}</p>
      </details>
      <button onClick={again} className="text-sm underline">New numbers</button>
    </div>
  );
}

function App() {
  const [grade, setGrade] = useState(GRADES[0]);
  const strands = [...new Set(ALL.filter(x => x.o.grade === grade).map(x => strandOf(x.o)))].sort();
  const [strandPick, setStrand] = useState(null);
  const strand = strands.includes(strandPick) ? strandPick : strands[0];
  const [form, setForm] = useState('');
  const list = ALL.filter(x => x.o.grade === grade && strandOf(x.o) === strand && (!form || x.f.form === form)).sort((a, b) => a.o.substrand.localeCompare(b.o.substrand) || a.f.rung - b.f.rung);
  const pill = (on) => `px-3 py-1.5 rounded-full border text-sm ${on ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-300'}`;
  return (
    <main className="max-w-2xl mx-auto px-4 py-6 min-h-screen text-slate-900">
      <h1 className="text-xl font-bold text-slate-900">Try the new questions</h1>
      <p className="text-sm text-slate-600 mb-3">{FAMILIES.length} families. Only on this computer: {familyMode() === 'all' ? 'every family is switched on, reviewed or not.' : 'run npm run horeb:try to switch the rest on.'} <a className="underline" href="/check">Open HOREB with them on</a>.</p>
      <div className="flex flex-wrap gap-2 mb-2">{GRADES.map(g => <button key={g} className={pill(g === grade)} onClick={() => setGrade(g)}>Grade {g}</button>)}</div>
      <div className="flex flex-wrap gap-2 mb-2">{strands.map(s => <button key={s} className={pill(s === strand)} onClick={() => setStrand(s)}>{s}</button>)}</div>
      <label className="text-sm text-slate-700 block mb-4">Kind of question: <select value={form} onChange={e => setForm(e.target.value)} className="border border-slate-300 rounded px-2 py-1"><option value="">All</option>{Object.entries(FORM).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <p className="text-sm text-slate-600 mb-3">{list.length} here.</p>
      {list.map(({ f, o }) => <Card key={f.id} f={f} o={o} />)}
    </main>
  );
}
createRoot(document.getElementById('root')).render(<App />);
