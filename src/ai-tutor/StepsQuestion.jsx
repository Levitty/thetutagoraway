import React, { useState, useRef, useEffect } from 'react';
import { checkAnswerMatch } from './answerCheck.js';

// A step-marked question (content/stepsItems.js): each part is typed and earns
// a mark if right first time. A wrong part gets feedback and one more try;
// after that its value is shown so the child carries on with it (a slip in
// part 1 must not sink parts 2 and 3). Calls onDone once every part is done.
export function StepsQuestion({ problem, onDone }) {
  const parts = problem.parts || [];
  const [i, setI] = useState(0);                 // current part
  const [val, setVal] = useState('');
  const [res, setRes] = useState([]);            // per part: { first: bool, tries, given }
  const [msg, setMsg] = useState(null);
  const inputRef = useRef(null);
  const done = i >= parts.length;
  useEffect(() => { inputRef.current?.focus(); }, [i]);

  const check = () => {
    const p = parts[i];
    if (!val.trim() || !p) return;
    const ok = checkAnswerMatch(val, p);
    const cur = res[i] || { tries: 0 };
    const tries = cur.tries + 1;
    if (ok || tries >= 2) {
      const entry = { first: ok && tries === 1, right: ok, tries, given: val.trim() };
      const next = [...res]; next[i] = entry;
      setRes(next);
      setMsg(ok ? null : { kind: 'show', text: `The answer to this part is ${p.answer}${p.unit ? ` ${p.unit}` : ''}. Use it for the next part.` });
      setVal('');
      const ni = i + 1;
      setI(ni);
      if (ni >= parts.length) {
        const marks = next.filter(r => r.first).length;
        onDone({ correct: marks === parts.length, marks, total: parts.length, allRight: next.every(r => r.right) });
      }
    } else {
      const m = (p.mistakes || []).find(x => checkAnswerMatch(val, { answer: x.when }));
      const next = [...res]; next[i] = { ...cur, tries };
      setRes(next);
      setMsg({ kind: 'wrong', text: m?.feedback || (p.hint ? `Not quite. Hint: ${p.hint}` : 'Not quite. Check your working.') });
      setVal('');
    }
  };

  const marks = res.filter(r => r?.first).length;
  return (
    <div className="space-y-3">
      {parts.map((p, pi) => {
        const r = res[pi];
        const active = pi === i;
        const shown = pi < i;
        return (
          <div key={pi} className={`rounded-xl border-2 p-3 ${active ? 'border-[#121117] bg-white' : shown ? 'border-slate-200 bg-[#f4f4f6]' : 'border-dashed border-slate-200 bg-white opacity-60'}`}>
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#e8336d] min-w-[22px]">({String.fromCharCode(97 + pi)})</span>
              <span className="text-[15px] text-slate-800 flex-1">{p.prompt}</span>
              {shown && <span className={`text-xs font-bold whitespace-nowrap ${r?.first ? 'text-[#4f7233]' : 'text-[#c0663f]'}`}>{r?.first ? '1 mark' : '0 marks'}</span>}
            </div>
            {shown && (
              <div className="mt-1.5 ml-7 text-sm text-slate-600">
                {r?.right ? <>You wrote <span className="font-mono text-slate-900">{r.given}</span>{r.first ? '' : ' (second try)'}</> : <>Answer: <span className="font-mono text-slate-900">{p.answer}</span></>}
              </div>
            )}
            {active && (
              <div className="mt-2 ml-7">
                <div className="flex gap-2">
                  <input ref={inputRef} type="text" inputMode="decimal" value={val} onChange={e => setVal(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && check()}
                    className="flex-1 min-w-0 bg-white border-2 border-[#121117] text-slate-900 rounded-lg px-3 py-2.5 text-lg focus:outline-none focus:ring-4 focus:ring-amber-300"
                    placeholder="Your answer" aria-label={`Answer for part ${String.fromCharCode(97 + pi)}`} />
                  <button type="button" onClick={check} disabled={!val.trim()} className="shrink-0 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 border-2 border-[#121117] rounded-lg px-4 font-bold">Check</button>
                </div>
                {msg?.kind === 'wrong' && <div className="mt-2 p-2.5 bg-[#fdf2ef] border border-[#f2cdc2] rounded-lg text-sm text-slate-700">{msg.text}</div>}
              </div>
            )}
          </div>
        );
      })}
      {msg?.kind === 'show' && !done && <div className="p-2.5 bg-[#eef1f8] border border-[#d3daf0] rounded-lg text-sm text-slate-700">{msg.text}</div>}
      {done && (
        <div className={`rounded-xl p-3 border ${marks === parts.length ? 'bg-[#eef4e7] border-[#cfe0bd]' : 'bg-[#fdf2ef] border-[#f2cdc2]'}`}>
          <span className="font-bold text-slate-900">{marks} of {parts.length} marks.</span>
          <span className="text-sm text-slate-600"> {marks === parts.length ? 'Every step right first time.' : 'Look back at the parts without a mark: that is the step to practise.'}</span>
        </div>
      )}
    </div>
  );
}

export default StepsQuestion;
