// ============================================================================
// MESSAGES AND GOALS — the parent's side of the parent–child loop.
//
// Per child: this week's practice days, a weekly goal ("practise 5 days →
// trip to the park") and a one-tap message that shows up in the child's
// space. The child's side is FamilyCards, rendered inside StudentHome.
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { Shell, Header, Card, Eyebrow, PrimaryButton, BackIcon, LearnerAvatar } from './StudentSpace.jsx';
import { isOlderLearner, getLook } from './studentMode.js';
import { weekDates } from '../ai-tutor/gamification.js';
import { SKILLS as MATH_SKILLS } from '../ai-tutor/knowledgeGraph.js';
import { buildWeeklyReport, normalisePhone } from './weeklyReport.js';
import {
  MESSAGE_PRESETS, REWARD_PRESETS, SIGN_OFFS, isMissingTable, getSignOff, setSignOff,
  sendMessage, lastMessage, markSeen, getGoal, saveGoal, removeGoal, learnerPracticeDays,
  getReportSettings, saveReportSettings, recentReports, sendTestReport, learnerReportData,
} from './family.js';

const firstName = (n) => (n || '').trim().split(/\s+/)[0] || '';
const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const todayUTC = () => new Date().toISOString().slice(0, 10);

// Monday to Sunday, filled for each day practised.
export const WeekDots = ({ days }) => {
  const done = new Set(days);
  const today = todayUTC();
  return (
    <div className="grid grid-cols-7 gap-1.5 text-center" role="img"
      aria-label={`Practised ${weekDates().filter(d => done.has(d)).length} of 7 days this week`}>
      {weekDates().map((d, i) => (
        <div key={d} className="text-[11px] font-bold text-slate-400">
          {DAY_LETTERS[i]}
          <div className={`h-6 mt-1 rounded-lg ${done.has(d) ? 'bg-[#8ca86a]' : 'bg-[#eef0f2]'} ${d === today ? 'ring-2 ring-slate-300' : ''}`} />
        </div>
      ))}
    </div>
  );
};

const GoalMeter = ({ count, target }) => (
  <div className="flex items-center gap-3">
    <div className="flex-1 h-2.5 rounded-full bg-[#eef0f2] overflow-hidden">
      <div className="h-full rounded-full bg-[#8ca86a]" style={{ width: `${Math.min(100, Math.round((count / target) * 100))}%` }} />
    </div>
    <span className="text-[14px] font-extrabold tabular-nums">{Math.min(count, target)}/{target}</span>
  </div>
);

const Chip = ({ active, children, ...p }) => (
  <button {...p} aria-pressed={!!active}
    className={`px-3 py-2 rounded-full text-[13px] font-semibold border transition-colors ${active ? 'bg-[#6d6fcb] border-[#6d6fcb] text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
    {children}
  </button>
);

// ---- One child ------------------------------------------------------------

const ChildPanel = ({ parentId, kid, onMissingTables }) => {
  const older = isOlderLearner(kid.grade);
  const age = older ? 'older' : 'young';
  const n = firstName(kid.name);
  const week = weekDates();

  const [days, setDays] = useState([]);
  const [goal, setGoal] = useState(undefined);      // undefined = loading, null = none
  const [editing, setEditing] = useState(false);
  const [target, setTarget] = useState(5);
  const [reward, setReward] = useState(REWARD_PRESETS[age][0]);
  const [msg, setMsg] = useState(null);             // last message sent
  const [text, setText] = useState('');
  const [sign, setSign] = useState(getSignOff());
  const [status, setStatus] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(null);

  const showPreview = async () => {
    if (preview) { setPreview(null); return; }
    try {
      const d = await learnerReportData(parentId, kid.id);
      setPreview(buildWeeklyReport({ name: kid.name, ...d, goal, skillName: (id) => MATH_SKILLS[id]?.name || id }).text);
    } catch { setErr("Couldn't build the preview. Check your connection."); }
  };

  const fail = useCallback((e) => {
    if (isMissingTable(e)) onMissingTables();
    else setErr("Couldn't save. Check your connection and try again.");
  }, [onMissingTables]);

  useEffect(() => {
    learnerPracticeDays(parentId, kid.id).then(setDays).catch(() => {});
    getGoal(kid.id).then(g => { setGoal(g); if (g) { setTarget(g.target_days); setReward(g.reward); } }).catch(e => { setGoal(null); if (isMissingTable(e)) onMissingTables(); });
    lastMessage(parentId, kid.id).then(setMsg).catch(() => {});
  }, [parentId, kid.id, onMissingTables]);

  const thisWeek = days.filter(d => week.includes(d)).length;

  const onSaveGoal = async () => {
    setBusy(true); setErr('');
    try { const g = await saveGoal(parentId, kid.id, target, reward); setGoal(g); setEditing(false); setStatus(`Goal saved. ${n} sees it in their space.`); }
    catch (e) { fail(e); }
    setBusy(false);
  };
  const onRemoveGoal = async () => {
    setBusy(true); setErr('');
    try { await removeGoal(kid.id); setGoal(null); setEditing(false); setStatus('Goal removed.'); }
    catch (e) { fail(e); }
    setBusy(false);
  };
  const onSend = async (body) => {
    setBusy(true); setErr('');
    try { const m = await sendMessage(parentId, kid.id, sign, body); setMsg(m); setText(''); setStatus(`Sent. ${n} sees it next time they open their space.`); }
    catch (e) { fail(e); }
    setBusy(false);
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3">
        <LearnerAvatar name={kid.name} look={getLook(kid.id)} size={42} />
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-[16px] truncate">{kid.name}</div>
          <div className="text-[13px] text-slate-500">{kid.grade ? `${kid.grade} · ` : ''}{thisWeek} {thisWeek === 1 ? 'day' : 'days'} practised this week</div>
        </div>
      </div>
      <WeekDots days={days} />

      {/* Weekly goal */}
      <div className="border-t border-slate-100 pt-4 space-y-3">
        <Eyebrow tone="text-[#5a7a3a]">Weekly goal</Eyebrow>
        {goal === undefined && <div className="text-sm text-slate-400">Loading…</div>}
        {goal && !editing && (
          <>
            <div className="text-[15px] font-bold">Practise {goal.target_days} days → {goal.reward}</div>
            <GoalMeter count={thisWeek} target={goal.target_days} />
            {thisWeek >= goal.target_days && <div className="text-[13.5px] font-semibold text-[#5a7a3a]">Reached this week. {n} has earned it.</div>}
            <button onClick={() => setEditing(true)} className="text-[13px] font-semibold text-[#6d6fcb]">Change goal</button>
          </>
        )}
        {goal === null && !editing && (
          <>
            <p className="text-sm text-slate-500">Agree a reward for practising a set number of days. It restarts every Monday.</p>
            <button onClick={() => setEditing(true)} className="w-full bg-white border border-slate-200 hover:bg-slate-50 rounded-xl py-2.5 font-bold text-[14px]">Set a goal</button>
          </>
        )}
        {editing && (
          <div className="space-y-3">
            <div className="text-[13px] font-bold text-slate-700">Days of practice this week</div>
            <div className="flex flex-wrap gap-2">
              {[3, 4, 5, 6, 7].map(d => <Chip key={d} active={target === d} onClick={() => setTarget(d)}>{d} days</Chip>)}
            </div>
            <div className="text-[13px] font-bold text-slate-700">Reward</div>
            <div className="flex flex-wrap gap-2">
              {REWARD_PRESETS[age].map(r => <Chip key={r} active={reward === r} onClick={() => setReward(r)}>{r}</Chip>)}
            </div>
            <label className="block text-[12.5px] font-bold text-slate-700">Or write your own
              <input value={reward} onChange={e => setReward(e.target.value)} maxLength={120}
                className="mt-1.5 w-full bg-white border-[1.5px] border-slate-200 rounded-xl px-3 py-2.5 text-[15px] font-semibold focus:outline-none focus:border-[#6d6fcb]" />
            </label>
            <PrimaryButton onClick={onSaveGoal} disabled={busy || !reward.trim()}>{busy ? 'Saving…' : 'Save goal'}</PrimaryButton>
            <div className="flex justify-between">
              <button onClick={() => setEditing(false)} className="text-[13px] font-semibold text-slate-500">Cancel</button>
              {goal && <button onClick={onRemoveGoal} className="text-[13px] font-semibold text-[#c0663f]">Remove goal</button>}
            </div>
          </div>
        )}
      </div>

      {/* Message */}
      <div className="border-t border-slate-100 pt-4 space-y-3">
        <Eyebrow tone="text-[#6d6fcb]">Send {n} a message</Eyebrow>
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-slate-500">
          Sign as
          {SIGN_OFFS.map(s => <Chip key={s} active={sign === s} onClick={() => { setSign(s); setSignOff(s); }}>{s}</Chip>)}
        </div>
        <div className="flex flex-wrap gap-2">
          {MESSAGE_PRESETS[age].map(m => <Chip key={m} disabled={busy} onClick={() => onSend(m)}>{m}</Chip>)}
        </div>
        <div className="flex gap-2">
          <input value={text} onChange={e => setText(e.target.value)} maxLength={200} placeholder="Or write your own"
            aria-label={`Message to ${n}`}
            className="flex-1 min-w-0 bg-white border-[1.5px] border-slate-200 rounded-xl px-3 py-2.5 text-[15px] focus:outline-none focus:border-[#6d6fcb]" />
          <button onClick={() => onSend(text)} disabled={busy || !text.trim()}
            className="shrink-0 bg-[#6d6fcb] hover:bg-[#5658b8] disabled:opacity-50 text-white rounded-xl px-4 font-bold text-[14px]">Send</button>
        </div>
        {msg && (
          <div className="text-[13px] text-slate-500">
            Last message: "{msg.body}" · {msg.seen_at ? `${n} has seen it` : 'not seen yet'}
          </div>
        )}
      </div>

      {/* Sunday report preview */}
      <div className="border-t border-slate-100 pt-4 space-y-3">
        <button onClick={showPreview} className="text-[13px] font-semibold text-[#6d6fcb]">
          {preview ? 'Hide the Sunday report' : `Preview ${n}'s Sunday report`}
        </button>
        {preview && (
          <div className="bg-[#efe7dd] rounded-2xl p-3">
            <div className="bg-white rounded-[0_12px_12px_12px] px-3 py-2.5 text-[13.5px] leading-relaxed text-[#111b21] whitespace-pre-line shadow-sm">{preview}</div>
          </div>
        )}
      </div>

      <div aria-live="polite" className="text-[13px] font-semibold">
        {err ? <span className="text-[#c0663f]">{err}</span> : status ? <span className="text-[#5a7a3a]">{status}</span> : null}
      </div>
    </Card>
  );
};

// ---- Sunday report settings ----------------------------------------------

const ReportSettings = ({ parentId, kids, onMissingTables }) => {
  const [settings, setSettings] = useState(undefined);  // undefined = loading
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState('whatsapp');
  const [agree, setAgree] = useState(false);
  const [history, setHistory] = useState([]);
  const [msg, setMsg] = useState({ ok: '', err: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getReportSettings(parentId)
      .then(sv => { setSettings(sv); if (sv) { setPhone(sv.phone); setChannel(sv.channel); } else setEditing(true); })
      .catch(e => { setSettings(null); if (isMissingTable(e)) onMissingTables(); });
    recentReports(parentId).then(setHistory).catch(() => {});
  }, [parentId, onMissingTables]);

  const save = async (active = true) => {
    const e164 = normalisePhone(phone);
    if (!e164) { setMsg({ ok: '', err: 'Enter a mobile number, for example 0712 345 678.' }); return; }
    if (!settings && !agree) { setMsg({ ok: '', err: 'Tick the box to agree to the weekly message.' }); return; }
    setBusy(true); setMsg({ ok: '', err: '' });
    try {
      const sv = await saveReportSettings(parentId, { phone: e164, channel, active });
      setSettings(sv); setPhone(sv.phone); setEditing(false);
      setMsg({ ok: active ? 'Saved. Your first report arrives on Sunday evening.' : 'Weekly reports turned off.', err: '' });
    } catch (e) {
      if (isMissingTable(e)) onMissingTables(); else setMsg({ ok: '', err: "Couldn't save. Check your connection and try again." });
    }
    setBusy(false);
  };

  const test = async () => {
    setBusy(true); setMsg({ ok: '', err: '' });
    try {
      const r = await sendTestReport();
      const sent = (r.results || []).filter(x => x.status === 'sent').length;
      setMsg(sent ? { ok: `Sent ${sent} ${sent === 1 ? 'report' : 'reports'} to ${settings.phone}.`, err: '' } : { ok: '', err: 'Nothing was sent. Check the number and try again later.' });
    } catch (e) {
      setMsg({ ok: '', err: /(not|isn't) set up|non-2xx|Failed to send|Failed to fetch/i.test(e.message) ? "Sending isn't switched on yet. Your settings are saved, and reports will start once it is." : e.message });
    }
    setBusy(false);
  };

  const kidName = (id) => firstName(kids.find(k => k.id === id)?.name) || 'Child';

  return (
    <Card className="space-y-3">
      <Eyebrow tone="text-[#5a7a3a]">Sunday report</Eyebrow>
      <div className="text-[16px] font-extrabold tracking-tight">A short message every Sunday evening</div>
      <p className="text-sm text-slate-500">For each child: days practised, skills mastered, what they are finding hard and how the goal is going. You don't need to open the app.</p>

      {settings === undefined && <div className="text-sm text-slate-400">Loading…</div>}

      {settings && !editing && (
        <>
          <div className="text-[14px] font-semibold">
            {settings.active ? `Goes to ${settings.phone} by ${settings.channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}.` : 'Turned off.'}
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip onClick={() => setEditing(true)}>Change number</Chip>
            <Chip onClick={() => save(!settings.active)} disabled={busy}>{settings.active ? 'Turn off' : 'Turn on'}</Chip>
            {settings.active && <Chip onClick={test} disabled={busy}>Send me a test now</Chip>}
          </div>
        </>
      )}

      {editing && (
        <div className="space-y-3">
          <label className="block text-[12.5px] font-bold text-slate-700">Your mobile number
            <input value={phone} onChange={e => setPhone(e.target.value)} inputMode="tel" placeholder="0712 345 678"
              className="mt-1.5 w-full bg-white border-[1.5px] border-slate-200 rounded-xl px-3 py-2.5 text-[15px] font-semibold focus:outline-none focus:border-[#6d6fcb]" />
          </label>
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-slate-500">
            Send by
            <Chip active={channel === 'whatsapp'} onClick={() => setChannel('whatsapp')}>WhatsApp</Chip>
            <Chip active={channel === 'sms'} onClick={() => setChannel('sms')}>SMS</Chip>
          </div>
          {!settings && (
            <label className="flex gap-2.5 items-start text-[13.5px] text-slate-600">
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-1 w-4 h-4 accent-[#6d6fcb]" />
              <span>I agree to get one message a week from Tutagora about my children's practice. I can turn it off here at any time.</span>
            </label>
          )}
          <PrimaryButton onClick={() => save(true)} disabled={busy}>{busy ? 'Saving…' : 'Save'}</PrimaryButton>
          {settings && <button onClick={() => { setEditing(false); setPhone(settings.phone); setChannel(settings.channel); }} className="text-[13px] font-semibold text-slate-500">Cancel</button>}
        </div>
      )}

      {history.length > 0 && (
        <div className="border-t border-slate-100 pt-3 space-y-1">
          <div className="text-[12px] font-bold uppercase tracking-[.06em] text-slate-400">Recent reports</div>
          {history.map(h => (
            <div key={h.id} className="flex justify-between text-[13px]">
              <span className="text-slate-600">{kidName(h.learner_id)} · week of {h.week_start}</span>
              <span className={h.status === 'sent' ? 'text-[#5a7a3a] font-semibold' : h.status === 'failed' ? 'text-[#c0663f] font-semibold' : 'text-slate-400'}>
                {h.status === 'sent' ? 'Sent' : h.status === 'failed' ? 'Not delivered' : 'Not sent'}
              </span>
            </div>
          ))}
        </div>
      )}

      <div aria-live="polite" className="text-[13px] font-semibold">
        {msg.err ? <span className="text-[#c0663f]">{msg.err}</span> : msg.ok ? <span className="text-[#5a7a3a]">{msg.ok}</span> : null}
      </div>
    </Card>
  );
};

// ---- The page -------------------------------------------------------------

export const FamilyPage = ({ user, onBack, onHandOver }) => {
  const [kids, setKids] = useState(null);
  const [missing, setMissing] = useState(false);
  const onMissingTables = useCallback(() => setMissing(true), []);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('children').select('id, name, grade').eq('parent_id', user.id).order('created_at')
      .then(({ data }) => setKids(data || []));
  }, [user?.id]);

  return (
    <Shell header={
      <Header>
        <button onClick={onBack} aria-label="Back" className="text-slate-400 hover:text-slate-700"><BackIcon /></button>
        <h1 className="text-[17px] font-extrabold tracking-tight">Messages and goals</h1>
      </Header>
    }>
      {missing && (
        <Card className="border-amber-300 bg-amber-50">
          <div className="font-bold text-[14px]">One database update needed</div>
          <p className="text-[13.5px] text-slate-600 mt-1">Some of this page needs new database tables. Run the latest SQL update in Supabase, then reopen this page.</p>
        </Card>
      )}
      {kids === null && <div className="text-center text-sm text-slate-400 py-6">Loading…</div>}
      {kids && kids.length === 0 && (
        <Card className="text-center space-y-3">
          <div className="font-bold">No children added yet</div>
          <p className="text-sm text-slate-500">Add a child when you hand over a device, then come back to set goals and send messages.</p>
          <PrimaryButton onClick={onHandOver}>Hand over to your child</PrimaryButton>
        </Card>
      )}
      {kids && kids.length > 0 && <ReportSettings parentId={user.id} kids={kids} onMissingTables={onMissingTables} />}
      {kids?.map(k => <ChildPanel key={k.id} parentId={user.id} kid={k} onMissingTables={onMissingTables} />)}
    </Shell>
  );
};

// ---- The child's side: shown inside StudentHome ---------------------------

export const FamilyCards = ({ parentId, learnerId, name, older }) => {
  const [msg, setMsg] = useState(null);
  const [goal, setGoal] = useState(null);
  const [days, setDays] = useState([]);
  const n = firstName(name);
  const week = weekDates();

  useEffect(() => {
    lastMessage(parentId, learnerId).then(m => setMsg(m && !m.seen_at ? m : null)).catch(() => {});
    getGoal(learnerId).then(setGoal).catch(() => {});
    learnerPracticeDays(parentId, learnerId).then(setDays).catch(() => {});
  }, [parentId, learnerId]);

  const thisWeek = days.filter(d => week.includes(d)).length;
  const reached = goal && thisWeek >= goal.target_days;
  if (!msg && !goal) return null;

  return (
    <>
      {msg && (
        <div className="bg-[#ecedfa] border border-[#d5d6f3] rounded-2xl p-4 flex gap-3 items-start">
          <div className="flex-1 min-w-0">
            <div className="text-[11.5px] font-bold tracking-[.08em] uppercase text-[#6d6fcb]">From {msg.from_label}</div>
            <p className="font-bold text-[15px] mt-0.5 break-words">{msg.body}</p>
          </div>
          <button onClick={() => { markSeen(msg.id).catch(() => {}); setMsg(null); }}
            className="shrink-0 bg-white border border-[#d5d6f3] rounded-xl px-3 py-1.5 text-[13px] font-bold text-[#6d6fcb]">
            {older ? 'Got it' : 'Thanks!'}
          </button>
        </div>
      )}
      {goal && (
        <Card className="space-y-3">
          <Eyebrow tone="text-[#5a7a3a]">{older ? 'Goal you agreed' : 'Your reward'}</Eyebrow>
          <div className="text-[15px] font-bold">Practise {goal.target_days} days this week → {goal.reward}</div>
          <GoalMeter count={thisWeek} target={goal.target_days} />
          <WeekDots days={days} />
          <div className="text-[13px] font-semibold text-slate-500">
            {reached
              ? (older ? `Done for this week. Remind your parent: ${goal.reward}.` : `You did it, ${n}! Tell your parent you earned it.`)
              : `${goal.target_days - thisWeek} more ${goal.target_days - thisWeek === 1 ? 'day' : 'days'} to go. A new week starts on Monday.`}
          </div>
        </Card>
      )}
    </>
  );
};
