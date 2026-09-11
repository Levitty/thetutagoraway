// ============================================================================
// WRITING — composition practice with real marking.
//
// The loop that matters: write → get marked against the four-band rubric →
// see the exact sentences to fix → revise → watch the mark climb. Marking is
// done server-side (mark-composition); this file owns the flow and the
// screens. Visual system is HOREB's light one: #eef0f2 ground, white cards,
// amber primary, indigo/olive/rust accents, no emoji.
// ============================================================================

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { supabase } from '../supabase';
import { loadLocalProgress } from '../ai-tutor/progressStore.js';
import { LANGUAGES, GRADES, TYPES, RUBRIC, MAX_MARK, bandForGrade, promptsFor, verdict, wordCount } from './prompts.js';

const Chevron = ({ back }) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {back ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
  </svg>
);

const Label = ({ tone = 'amber', children }) => {
  const c = { amber: 'text-amber-700', indigo: 'text-[#6d6fcb]', olive: 'text-[#5a7a3a]', rust: 'text-[#c0663f]', slate: 'text-slate-400' }[tone];
  return <div className={`text-[11.5px] font-bold tracking-[.08em] uppercase ${c}`}>{children}</div>;
};

const Card = ({ className = '', children, onClick }) => onClick
  ? <button onClick={onClick} className={`w-full text-left bg-white border border-slate-200 shadow-sm rounded-2xl p-4 hover:border-slate-300 transition-colors ${className}`}>{children}</button>
  : <div className={`bg-white border border-slate-200 shadow-sm rounded-2xl p-4 ${className}`}>{children}</div>;

// "Grade 7" / "Form 2" (children.grade) → 7 / 10.
const gradeFromLabel = (g) => {
  const m = /(Grade|Form)\s*(\d+)/i.exec(g || '');
  if (!m) return null;
  const n = Number(m[2]);
  return m[1].toLowerCase() === 'form' ? n + 8 : n;
};

const draftKey = (k) => `tg_writing_draft_${k}`;
const gradeKey = (k) => `tg_writing_grade_${k}`;
const langKey = (k) => `tg_writing_lang_${k}`;
const lsGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch { /* private mode */ } };

const fmtDate = (iso) => {
  const d = new Date(iso), t = new Date();
  const diff = Math.round((new Date(t.getFullYear(), t.getMonth(), t.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000);
  if (diff === 0) return 'Today'; if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
};

// Five-dot meter for a /5 band.
const Dots = ({ n }) => (
  <span className="flex gap-1">{[1, 2, 3, 4, 5].map(i => <span key={i} className={`w-2.5 h-2.5 rounded-full ${i <= n ? 'bg-amber-400' : 'bg-slate-200'}`} />)}</span>
);

// The learner's text with each correction highlighted in place. Tapping a
// highlight scrolls to its card. Corrections were filtered server-side to
// exact substrings, so a plain first-occurrence split is safe.
const MarkedText = ({ body, corrections, onPick }) => {
  const parts = useMemo(() => {
    const out = [];
    const found = corrections.map((c, i) => ({ ...c, i, at: body.indexOf(c.original) })).filter(c => c.at >= 0).sort((a, b) => a.at - b.at);
    let cursor = 0;
    found.forEach(c => {
      if (c.at < cursor) return; // overlapping — skip
      out.push({ t: body.slice(cursor, c.at) });
      out.push({ t: c.original, i: c.i });
      cursor = c.at + c.original.length;
    });
    out.push({ t: body.slice(cursor) });
    return out;
  }, [body, corrections]);
  return (
    <p className="text-[15px] leading-[1.7] text-slate-800 whitespace-pre-wrap">
      {parts.map((p, k) => p.i == null ? <React.Fragment key={k}>{p.t}</React.Fragment>
        : <mark key={k} onClick={() => onPick(p.i)} className="bg-[#fde7e3] text-slate-900 rounded px-0.5 cursor-pointer border-b-2 border-[#c0663f]">{p.t}</mark>)}
    </p>
  );
};

// Chrome lives at module level so React keeps the same element identity
// between renders — defined inside the component they'd remount on every
// keystroke and the editor would drop focus.
const Header = ({ title, back, right }) => (
  <div className="bg-white/85 backdrop-blur border-b border-slate-200/70 sticky top-0 z-40 shrink-0">
    <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2 min-h-14">
      {back && <button onClick={back} aria-label="Back" className="text-slate-400 hover:text-slate-700 -ml-1"><Chevron back /></button>}
      <h1 className="text-[17px] font-extrabold tracking-tight flex-1 truncate">{title}</h1>
      {right}
    </div>
  </div>
);
const Shell = ({ children, header }) => (
  <div className="min-h-screen bg-[#eef0f2] text-slate-900 app-shell">
    {header}
    <div className="app-scroll"><div className="max-w-2xl mx-auto px-4 pt-4 pb-32 space-y-3">{children}</div></div>
  </div>
);

export const Writing = ({ userId, studentName, onBack, onSignIn, isNative = false }) => {
  const [children, setChildren] = useState([]);
  const [activeLearner, setActiveLearner] = useState(null); // null = account holder
  const learnerKey = activeLearner ? `${userId}_c${activeLearner.id}` : userId;
  const learnerId = activeLearner?.id || null;
  const first = ((activeLearner?.name || studentName) || '').trim().split(/\s+/)[0];

  const [lang, setLang] = useState('en');
  const [grade, setGrade] = useState(7);
  const [type, setType] = useState('narrative');
  const [ownPrompt, setOwnPrompt] = useState('');
  const [view, setView] = useState('home'); // home | write | marking | feedback
  const [piece, setPiece] = useState(null);   // { prompt, promptId, type, title, body, revisionOf, baseScore }
  const [result, setResult] = useState(null); // marked piece: { id, score, feedback, body, ... }
  const [history, setHistory] = useState([]);
  const [err, setErr] = useState('');
  const [draft, setDraft] = useState(null);
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (!userId) return;
    supabase.from('children').select('id, name, grade').eq('parent_id', userId).order('created_at')
      .then(({ data }) => setChildren(data || []));
  }, [userId]);

  // Per-learner defaults: language, grade (own choice → child's grade → HOREB's
  // declared grade → 7), and any unfinished draft.
  useEffect(() => {
    setLang(lsGet(langKey(learnerKey)) || 'en');
    const saved = Number(lsGet(gradeKey(learnerKey)));
    const fromChild = gradeFromLabel(activeLearner?.grade);
    const fromHoreb = loadLocalProgress(learnerKey)?.declaredGrade;
    const g = [saved, fromChild, fromHoreb].find(n => Number.isFinite(n) && n >= 4 && n <= 12) || 7;
    setGrade(g);
    try { const d = JSON.parse(lsGet(draftKey(learnerKey)) || 'null'); setDraft(d && d.body ? d : null); } catch { setDraft(null); }
  }, [learnerKey, activeLearner?.grade]);

  const loadHistory = useCallback(() => {
    if (!userId) return;
    let q = supabase.from('compositions').select('id, language, grade, type, prompt, title, body, word_count, score, feedback, revision_of, created_at')
      .eq('user_id', userId).order('created_at', { ascending: false }).limit(30);
    q = learnerId ? q.eq('learner_id', learnerId) : q.is('learner_id', null);
    q.then(({ data }) => setHistory(data || []));
  }, [userId, learnerId]);
  useEffect(() => { loadHistory(); }, [loadHistory]);

  const pickLang = (l) => { setLang(l); lsSet(langKey(learnerKey), l); };
  const pickGrade = (g) => { setGrade(g); lsSet(gradeKey(learnerKey), String(g)); };
  const band = bandForGrade(grade);
  const L = LANGUAGES[lang];
  const sw = lang === 'sw';
  const prompts = useMemo(() => promptsFor(lang, band.id, type === 'own' ? null : type), [lang, band.id, type]);

  const begin = (p, opts = {}) => {
    setErr('');
    setPiece({
      prompt: p.p, promptId: p.id || null, type: p.type || type, lang: p.lang || lang, grade,
      title: opts.title || '', body: opts.body || '', revisionOf: opts.revisionOf || null, baseScore: opts.baseScore ?? null,
      startedAt: Date.now(),
    });
    setView('write');
  };
  const beginOwn = () => {
    const t = ownPrompt.trim();
    if (t.length < 8) return;
    begin({ p: t, id: null, type: 'own', lang });
  };
  const surprise = () => prompts.length && begin(prompts[Math.floor(Math.random() * prompts.length)]);
  const resumeDraft = () => { if (draft) { setPiece({ ...draft, startedAt: Date.now() - (draft.elapsed || 0) }); setView('write'); } };
  const discardDraft = () => { lsSet(draftKey(learnerKey), null); setDraft(null); };

  // ---------- editor ----------
  const saveDraft = useCallback((p) => {
    if (!p) return;
    const d = { ...p, elapsed: Date.now() - (p.startedAt || Date.now()) };
    delete d.startedAt;
    if (d.body?.trim() || d.title?.trim()) { lsSet(draftKey(learnerKey), JSON.stringify(d)); setDraft(d); }
  }, [learnerKey]);
  useEffect(() => {
    if (view !== 'write' || !piece) return;
    const t = setTimeout(() => saveDraft(piece), 800);
    return () => clearTimeout(t);
  }, [piece, view, saveDraft]);

  const [, tick] = useState(0);
  useEffect(() => { if (view !== 'write') return; const t = setInterval(() => tick(n => n + 1), 1000); return () => clearInterval(t); }, [view]);
  const elapsed = piece?.startedAt ? Math.floor((Date.now() - piece.startedAt) / 1000) : 0;
  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
  const words = wordCount(piece?.body);

  const taRef = useRef(null);
  useEffect(() => { const el = taRef.current; if (el) { el.style.height = 'auto'; el.style.height = Math.max(260, el.scrollHeight) + 'px'; } }, [piece?.body, view]);

  const submit = async () => {
    if (!piece || words < 40) return;
    setErr('');
    setView('marking');
    try {
      const { data, error } = await supabase.functions.invoke('mark-composition', {
        body: { language: piece.lang, grade: piece.grade, type: piece.type, prompt: piece.prompt, title: piece.title, body: piece.body, learner_id: learnerId, revision_of: piece.revisionOf },
      });
      if (error) {
        let msg = error.message || 'Marking failed';
        try { const j = await error.context?.json(); if (j?.error) msg = j.error; } catch { /* no body */ }
        if (/not configured|Failed to send|Failed to fetch|non-2xx/i.test(msg)) msg = "Marking isn't switched on yet — your draft is saved, try again later.";
        throw new Error(msg);
      }
      setResult({ ...data, body: piece.body, title: piece.title, prompt: piece.prompt, type: piece.type, language: piece.lang, grade: piece.grade, revision_of: piece.revisionOf, baseScore: piece.baseScore });
      setRemaining(data.remaining);
      lsSet(draftKey(learnerKey), null); setDraft(null);
      loadHistory();
      setView('feedback');
    } catch (e) {
      setErr(e.message || 'Marking failed');
      setView('write');
    }
  };

  const openPast = (row) => {
    const prev = row.revision_of ? history.find(h => h.id === row.revision_of) : null;
    setResult({ ...row, feedback: row.feedback || {}, baseScore: prev?.score ?? null });
    setView('feedback');
  };
  const revise = () => {
    if (!result) return;
    begin({ p: result.prompt, id: null, type: result.type, lang: result.language }, { title: result.title || '', body: result.body, revisionOf: result.id, baseScore: result.score });
  };

  if (!userId) return (
    <Shell header={<Header title="Writing" back={onBack} />}>
      <div>
        <div className="text-[21px] font-extrabold tracking-tight leading-tight">Write, get marked, rewrite</div>
        <div className="text-sm text-slate-500 mt-0.5">English compositions and Kiswahili insha, marked out of 20 the way school does it — with the exact lines to fix.</div>
      </div>
      <Card>
        <div className="text-[15px] font-semibold">Sign in to write</div>
        <p className="text-[13.5px] text-slate-500 mt-1 mb-3">Your pieces and marks are saved to your account, and a parent can see them.</p>
        {onSignIn && <button onClick={onSignIn} className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl py-3 font-bold text-[15px] transition-colors">Sign in</button>}
      </Card>
    </Shell>
  );

  // ================= HOME =================
  if (view === 'home') {
    const label = (t) => sw ? t.sw : t.en;
    return (
      <Shell header={<Header title="Writing" back={onBack} />}>
        <div>
          <div className="text-[21px] font-extrabold tracking-tight leading-tight">{sw ? 'Andika, upate maoni' : 'Write, get marked, rewrite'}</div>
          <div className="text-sm text-slate-500 mt-0.5">{sw ? 'Insha inasahihishwa kama mwalimu — alama /20 na sentensi za kurekebisha.' : 'Marked like a teacher would: a mark out of 20 and the exact lines to fix.'}</div>
        </div>

        {children.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {[{ id: null, name: 'You' }, ...children].map(c => (
              <button key={c.id || 'self'} onClick={() => setActiveLearner(c.id ? c : null)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${(activeLearner?.id || null) === c.id ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                {c.name}
              </button>
            ))}
          </div>
        )}

        {draft && (
          <Card className="border-amber-300">
            <Label>{sw ? 'Rasimu yako' : 'Your draft'}</Label>
            <div className="text-[15px] font-semibold mt-1 truncate">{draft.title || draft.prompt}</div>
            <div className="text-[13px] text-slate-500">{wordCount(draft.body)} {sw ? 'maneno' : 'words'} so far</div>
            <div className="flex gap-2 mt-3">
              <button onClick={resumeDraft} className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl py-2.5 font-bold text-[14.5px]">{sw ? 'Endelea' : 'Continue writing'}</button>
              <button onClick={discardDraft} className="px-4 text-[13.5px] font-semibold text-slate-400 hover:text-slate-600">{sw ? 'Futa' : 'Discard'}</button>
            </div>
          </Card>
        )}

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div className="flex bg-slate-100 rounded-xl p-1">
              {Object.values(LANGUAGES).map(l => (
                <button key={l.id} onClick={() => pickLang(l.id)} className={`px-3.5 py-1.5 rounded-lg text-[13.5px] font-semibold transition-colors ${lang === l.id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>{l.name}</button>
              ))}
            </div>
            <select value={grade} onChange={e => pickGrade(Number(e.target.value))} className="text-[13.5px] font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:outline-none">
              {GRADES.map(g => <option key={g} value={g}>{sw ? 'Gredi' : 'Grade'} {g}</option>)}
            </select>
          </div>
          <div className="text-[12.5px] text-slate-400 mt-2">{band.label[lang]} · {sw ? 'lengo' : 'aim for'} {band.words[0]}–{band.words[1]} {sw ? 'maneno' : 'words'}</div>
        </Card>

        <div>
          <Label tone="indigo">{sw ? 'Aina ya insha' : 'What kind of piece'}</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.values(TYPES).map(t => (
              <button key={t.id} onClick={() => setType(t.id)}
                className={`text-left rounded-2xl p-3.5 border transition-colors ${t.id === 'own' ? 'col-span-2' : ''} ${type === t.id ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'}`}>
                <div className="text-[14.5px] font-bold leading-tight">{label(t)}</div>
                <div className={`text-[12px] mt-1 leading-snug ${type === t.id ? 'text-white/70' : 'text-slate-500'}`}>{t.hint[lang]}</div>
              </button>
            ))}
          </div>
        </div>

        {type === 'own' ? (
          <Card>
            <Label>{sw ? 'Mada kutoka shuleni' : 'Topic from school'}</Label>
            <textarea value={ownPrompt} onChange={e => setOwnPrompt(e.target.value)} rows={3} placeholder={sw ? 'Andika mada kamili kama ulivyopewa…' : 'Type the task exactly as your teacher set it…'}
              className="w-full mt-2 text-[15px] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-slate-400 resize-none" />
            <button onClick={beginOwn} disabled={ownPrompt.trim().length < 8} className="w-full mt-2 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 rounded-xl py-3 font-bold text-[15px] transition-colors">{sw ? 'Anza kuandika' : 'Start writing'}</button>
          </Card>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{sw ? 'Chagua mada' : 'Pick a task'}</Label>
              <button onClick={surprise} className="text-[13px] font-semibold text-[#6d6fcb]">{sw ? 'Nichagulie' : 'Surprise me'}</button>
            </div>
            {prompts.map(p => (
              <Card key={p.id} onClick={() => begin(p)}>
                <div className="flex items-center gap-3">
                  <span className="flex-1 text-[14.5px] text-slate-800 leading-snug">{p.p}</span>
                  <span className="text-slate-300 shrink-0"><Chevron /></span>
                </div>
              </Card>
            ))}
            {prompts.length === 0 && <Card><p className="text-[14px] text-slate-500">No tasks of this kind for {band.label[lang]} yet — try another kind, or use your own topic.</p></Card>}
          </div>
        )}

        {history.length > 0 && (
          <div className="space-y-2 pt-2">
            <Label tone="olive">{sw ? 'Kazi zako' : `${activeLearner ? `${first}'s` : 'Your'} pieces`}</Label>
            {history.map(h => (
              <Card key={h.id} onClick={() => openPast(h)}>
                <div className="flex items-center gap-3">
                  <span className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-extrabold tabular-nums text-[15px] ${h.score == null ? 'bg-slate-100 text-slate-400' : h.score >= 16 ? 'bg-[#e8efdc] text-[#5a7a3a]' : h.score >= 11 ? 'bg-amber-100 text-amber-800' : 'bg-[#fde7e3] text-[#c0663f]'}`}>
                    {h.score == null ? '—' : h.score}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14.5px] font-semibold truncate">{h.title || h.prompt}</span>
                    <span className="block text-[12.5px] text-slate-400">{fmtDate(h.created_at)} · {LANGUAGES[h.language]?.name} · {h.word_count} words{h.revision_of ? ' · revision' : ''}</span>
                  </span>
                  <span className="text-slate-300 shrink-0"><Chevron /></span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Shell>
    );
  }

  // ================= EDITOR =================
  if (view === 'write' || view === 'marking') {
    const T = TYPES[piece.type] || TYPES.own;
    const b = bandForGrade(piece.grade);
    const inRange = words >= b.words[0];
    const pl = piece.lang === 'sw';
    return (
      <Shell header={<Header title={pl ? 'Insha' : 'Composition'} back={() => { saveDraft(piece); setView('home'); }}
        right={<span className="text-[13px] font-semibold text-slate-400 tabular-nums">{mmss}</span>} />}>
        <Card>
          <Label tone="indigo">{pl ? T.sw : T.en}{piece.revisionOf ? (pl ? ' · marudio' : ' · second draft') : ''}</Label>
          <p className="text-[15px] font-semibold mt-1 leading-snug">{piece.prompt}</p>
          <p className="text-[12.5px] text-slate-500 mt-1.5">{T.hint[piece.lang]}</p>
        </Card>

        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <input value={piece.title} onChange={e => setPiece(p => ({ ...p, title: e.target.value }))} placeholder={pl ? 'Anwani (si lazima)' : 'Title (optional)'}
            className="w-full px-4 pt-4 pb-2 text-[17px] font-extrabold tracking-tight placeholder:text-slate-300 placeholder:font-semibold focus:outline-none" />
          <textarea ref={taRef} value={piece.body} onChange={e => setPiece(p => ({ ...p, body: e.target.value }))} disabled={view === 'marking'}
            placeholder={pl ? 'Anza hapa…' : 'Start here…'} spellCheck={false} autoCorrect="off"
            className="w-full px-4 pb-4 text-[16px] leading-[1.7] text-slate-800 placeholder:text-slate-300 focus:outline-none resize-none" />
        </div>
        <p className="text-[12px] text-slate-400 px-1">{pl ? 'Ukaguzi wa tahajia umezimwa kimakusudi — mwalimu wako anataka kuona tahajia yako halisi.' : "Spell-check is off on purpose: the marker needs to see your real spelling."}</p>

        {err && <div className="bg-[#fde7e3] border border-[#f3c9c0] text-[#8a3d22] rounded-xl px-3.5 py-2.5 text-[13.5px]">{err}</div>}

        <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200" style={{ paddingBottom: isNative ? 'calc(0.75rem + env(safe-area-inset-bottom))' : '0.75rem' }}>
          <div className="max-w-2xl mx-auto px-4 pt-3 flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className={`text-[15px] font-extrabold tabular-nums ${inRange ? 'text-[#5a7a3a]' : 'text-slate-900'}`}>{words} <span className="text-[12.5px] font-semibold text-slate-400">/ {b.words[0]}–{b.words[1]} {pl ? 'maneno' : 'words'}</span></div>
              <div className="text-[12px] text-slate-400">{words < 40 ? (pl ? 'Angalau maneno 40' : 'At least 40 words to mark') : inRange ? (pl ? 'Urefu unafaa' : 'Good length') : (pl ? 'Endelea — bado fupi' : 'Keep going — still short')}</div>
            </div>
            <button onClick={submit} disabled={view === 'marking' || words < 40}
              className="shrink-0 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 rounded-xl px-5 py-3 font-bold text-[15px] transition-colors">
              {view === 'marking' ? (pl ? 'Inasahihishwa…' : 'Marking…') : (pl ? 'Sahihisha' : 'Get it marked')}
            </button>
          </div>
        </div>

        {view === 'marking' && (
          <div className="fixed inset-0 z-[45] bg-[#eef0f2]/80 backdrop-blur-sm flex items-center justify-center px-6">
            <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-6 max-w-sm w-full text-center">
              <div className="mx-auto w-10 h-10 rounded-full border-[3px] border-slate-200 border-t-amber-400 animate-spin" />
              <div className="text-[16px] font-extrabold tracking-tight mt-4">{pl ? 'Inasomwa kwa makini…' : 'Reading it properly…'}</div>
              <p className="text-[13.5px] text-slate-500 mt-1">{pl ? 'Sekunde chache. Kila sentensi inaangaliwa.' : 'A few seconds. Every sentence gets looked at.'}</p>
            </div>
          </div>
        )}
      </Shell>
    );
  }

  // ================= FEEDBACK =================
  if (view === 'feedback' && result) {
    const fb = result.feedback || {};
    const pl = result.language === 'sw';
    const corrections = fb.corrections || [];
    // Tap a highlight → scroll to its card and flash it.
    const jump = (i) => { const el = document.getElementById(`corr-${i}`); el?.scrollIntoView({ behavior: 'smooth', block: 'center' }); el?.classList.add('ring-2', 'ring-amber-400'); setTimeout(() => el?.classList.remove('ring-2', 'ring-amber-400'), 1400); };
    const delta = (result.baseScore != null && result.score != null) ? result.score - result.baseScore : null;
    return (
      <Shell header={<Header title={pl ? 'Maoni' : 'Feedback'} back={() => { setResult(null); setView('home'); }} />}>
        {/* the mark */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="shrink-0 text-center">
              <div className="text-[44px] font-extrabold tracking-tight leading-none tabular-nums">{result.score == null ? '—' : result.score}</div>
              <div className="text-[12px] text-slate-400 font-semibold mt-1">/ {MAX_MARK}</div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[17px] font-extrabold tracking-tight">{result.score == null ? (pl ? 'Haikujibu mada' : 'Off task') : verdict(result.score, result.language)}</div>
              {delta != null && (
                <div className={`text-[13px] font-bold mt-0.5 ${delta > 0 ? 'text-[#5a7a3a]' : delta < 0 ? 'text-[#c0663f]' : 'text-slate-400'}`}>
                  {delta > 0 ? `${pl ? 'Umepanda kutoka' : 'Up from'} ${result.baseScore}` : delta < 0 ? `${pl ? 'Umeshuka kutoka' : 'Down from'} ${result.baseScore}` : (pl ? 'Sawa na awali' : 'Same as before')}
                </div>
              )}
              <p className="text-[13.5px] text-slate-600 mt-1 leading-snug">{fb.off_task ? fb.off_task_reason : fb.summary}</p>
            </div>
          </div>
        </Card>

        {/* bands */}
        <Card>
          <Label tone="indigo">{pl ? 'Alama kwa kila kipengele' : 'How the mark breaks down'}</Label>
          <div className="mt-2 space-y-3">
            {RUBRIC.map(r => {
              const bnd = fb.bands?.[r.id];
              return (
                <div key={r.id}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[14.5px] font-semibold">{pl ? r.sw : r.en}</span>
                    <span className="flex items-center gap-2 shrink-0"><Dots n={bnd?.mark || 0} /><span className="text-[12.5px] font-bold text-slate-500 tabular-nums w-6 text-right">{bnd?.mark ?? 0}/5</span></span>
                  </div>
                  {bnd?.note && <p className="text-[13px] text-slate-500 mt-0.5 leading-snug">{bnd.note}</p>}
                </div>
              );
            })}
          </div>
        </Card>

        {(fb.strengths || []).length > 0 && (
          <Card>
            <Label tone="olive">{pl ? 'Ulichofanya vizuri' : 'What worked'}</Label>
            <ul className="mt-2 space-y-1.5">
              {fb.strengths.map((s, i) => <li key={i} className="flex gap-2.5 text-[14px] text-slate-800 leading-snug"><span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#5a7a3a] shrink-0" />{s}</li>)}
            </ul>
          </Card>
        )}

        {/* the text, with fixes in place */}
        <Card>
          <Label tone="rust">{pl ? 'Insha yako — gusa sehemu zilizotiwa alama' : 'Your piece — tap a highlight'}</Label>
          {result.title && <div className="text-[17px] font-extrabold tracking-tight mt-2">{result.title}</div>}
          <div className="mt-2"><MarkedText body={result.body} corrections={corrections} onPick={jump} /></div>
        </Card>

        {corrections.length > 0 && (
          <div className="space-y-2">
            <Label tone="rust">{pl ? `Ya kurekebisha (${corrections.length})` : `Fix these (${corrections.length})`}</Label>
            {corrections.map((c, i) => (
              <div key={i} id={`corr-${i}`} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 transition-shadow">
                <div className="text-[14px] text-slate-400 line-through decoration-[#c0663f]/60">{c.original}</div>
                <div className="text-[15px] font-semibold text-slate-900 mt-1">{c.better}</div>
                <div className="text-[13px] text-slate-500 mt-1.5 leading-snug">{c.why}</div>
              </div>
            ))}
          </div>
        )}

        {(fb.vocabulary || []).length > 0 && (
          <Card>
            <Label tone="indigo">{pl ? 'Msamiati bora' : 'Stronger words'}</Label>
            <div className="mt-2 space-y-2">
              {fb.vocabulary.map((v, i) => (
                <div key={i} className="text-[14px] leading-snug">
                  <span className="text-slate-400">{v.word}</span><span className="text-slate-300 mx-1.5">→</span><span className="font-semibold">{v.better}</span>
                  <span className="block text-[12.5px] text-slate-400 mt-0.5">“{v.where}”</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {fb.next_step && (
          <Card className="border-amber-300">
            <Label>{pl ? 'Jambo moja la kufanya sasa' : 'One thing to do next'}</Label>
            <p className="text-[15px] font-semibold mt-1 leading-snug">{fb.next_step}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={revise} className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl py-3 font-bold text-[15px]">{pl ? 'Rekebisha rasimu hii' : 'Revise this draft'}</button>
              <button onClick={() => { setResult(null); setView('home'); }} className="px-4 text-[13.5px] font-semibold text-slate-500 hover:text-slate-700">{pl ? 'Mpya' : 'New piece'}</button>
            </div>
            {remaining != null && <p className="text-[12px] text-slate-400 mt-2">{remaining} {pl ? 'usahihishaji umesalia leo' : `marking${remaining === 1 ? '' : 's'} left today`}</p>}
          </Card>
        )}
      </Shell>
    );
  }

  return null;
};

export default Writing;
