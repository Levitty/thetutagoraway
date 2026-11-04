// ============================================================================
// THE HOREB ROCKET CHALLENGE: project mode.
//
// One screen family, four ways in:
//   the team     levels, the guided chat for the step they are on, the log
//   a parent     reads every word of the chat and the log; consent; deletion
//   a teacher    every team of their school, read-only; may open a level
//   organiser    every team, the judging inputs, launch-day results, settings
//
// The rule the whole screen is built round: a team logs a test before HOREB
// helps with the next step. So the next thing to do is always named on screen,
// and when it is "log your test", the log button is the big one.
//
// Look: HOREB's learner home on main (canvas, white cards, the sun button for
// the one action, saturated blocks for the levels). No emojis, no em dashes,
// British English. Phone first; on a laptop the chat and the step sit side by
// side. Example data (/rocket?demo=1) is labelled on every screen.
// ============================================================================
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useHorebLook } from '../ai-tutor/horebLook.js';
import { HorebBot } from '../ai-tutor/HorebBot.jsx';
import { SKILLS } from '../ai-tutor/knowledgeGraph.js';
import { LEVELS, SAFETY_RULES, JUDGING, UNDECIDED, PRESSURE_MAX_BAR, levelByN, stepOf } from './levels.js';
import { teamProgress, validateEntry, logSummary, LOG_FIELDS } from './progress.js';
import { rocketApi } from './rocketData.js';
import { exampleApi } from './example.js';
import { TeacherShell, SuggestPanel, Pill } from '../ai-tutor/TeacherScreens.jsx';

// ------------------------------------------------------------------ helpers
const fmtDay = (iso) => {
  if (!iso) return '';
  const d = new Date(iso.length <= 10 ? `${iso}T12:00:00Z` : iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};
const fmtWhen = (iso) => {
  if (!iso) return 'not yet';
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
};
const firstNames = (members) => members.map((m) => m.first_name).join(' and ') || 'No learners yet';
const tbc = (v) => (v == null || String(v).trim() === '' ? 'To be confirmed' : v);
const lastActive = (team) => {
  const times = [...team.log.map((e) => e.created_at), ...team.messages.map((m) => m.created_at)].filter(Boolean).sort();
  return times[times.length - 1] || null;
};

const Chevron = ({ back }) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {back ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
  </svg>
);
const Tick = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
const Lock = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2.5" /><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3" /></svg>
);

// The rocket, drawn: a bottle with fins and a cone. The only picture on the
// team's home, because it is the thing they are building.
const RocketArt = ({ className = '' }) => (
  <svg viewBox="0 0 120 200" className={className} aria-hidden="true">
    <path d="M60 8c14 10 22 26 22 44H38c0-18 8-34 22-44z" fill="#FF4F91" />
    <rect x="38" y="52" width="44" height="104" rx="10" fill="#FFFFFF" stroke="#16161A" strokeWidth="4" />
    <rect x="42" y="112" width="36" height="40" rx="6" fill="#9BE3C4" />
    <path d="M38 124 16 160v12l22-10z" fill="#6C4BF4" />
    <path d="M82 124l22 36v12l-22-10z" fill="#6C4BF4" />
    <rect x="52" y="156" width="16" height="12" rx="3" fill="#16161A" />
    <path d="M60 176v16" stroke="#FFC93C" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const Eyebrow = ({ children, tone = 'text-slate-500' }) => (
  <div className={`text-[10.5px] font-bold tracking-[.12em] uppercase ${tone}`}>{children}</div>
);
const Card = ({ className = '', children }) => (
  <div className={`bg-white rounded-3xl p-5 ${className}`}>{children}</div>
);

const ExampleBanner = () => (
  <div className="bg-[#16161A] text-white rounded-2xl px-4 py-2.5 text-[12.5px] font-semibold flex items-center justify-between gap-3">
    <span>EXAMPLE DATA. Invented teams and names, nothing is saved.</span>
  </div>
);

// ------------------------------------------------------------------ shell
export function RocketChallenge({ userId, isAdmin = false, onBack, onPractise, onNavigate, teacherName }) {
  useHorebLook();
  const params = useMemo(() => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ''), []);
  const demo = params.get('demo') === '1' || !userId;
  const demoAs = params.get('as') || 'learner';
  const api = useMemo(() => (demo ? exampleApi(demoAs) : rocketApi({ userId, isAdmin })), [demo, demoAs, userId, isAdmin]);
  const me = api.me.id;

  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [view, setView] = useState(null); // { name, teamId?, level? }

  const reload = useCallback(async () => {
    try { setErr(''); setData(await api.load()); } catch (e) { setErr(e.message || 'Could not load the challenge.'); }
  }, [api]);
  useEffect(() => { reload(); }, [reload]);

  const roles = useMemo(() => {
    if (!data) return null;
    const family = data.teams.filter((t) => t.members.some((m) => m.account_id === me));
    const staff = data.teams.filter((t) => t.teacher_id === me || (data.staffSchoolIds || []).includes(t.school_id));
    return { family, staff, admin: api.me.isAdmin };
  }, [data, me, api]);

  // Where to land.
  useEffect(() => {
    if (!roles || view) return;
    if (demo && demoAs === 'parent') return setView({ name: 'parent', teamId: roles.family[0]?.id });
    if (demo && demoAs === 'teacher') return setView(params.get('team') ? { name: 'team', teamId: params.get('team') } : { name: 'teacher' });
    if (demo && demoAs === 'organiser') return setView({ name: 'organiser' });
    if (demo && params.get('screen') === 'level') return setView({ name: 'level', teamId: roles.family[0]?.id, level: Number(params.get('level')) || null });
    if (demo && params.get('screen') === 'log') return setView({ name: 'log', teamId: roles.family[0]?.id });
    if (roles.family.length) return setView({ name: 'home', teamId: roles.family[0].id });
    if (roles.staff.length) return setView({ name: 'teacher' });
    if (roles.admin) return setView({ name: 'organiser' });
    setView({ name: 'join' });
  }, [roles, view, demo, demoAs, params]);

  const go = (v) => { setView(v); try { window.scrollTo({ top: 0 }); } catch { /* jsdom */ } };
  const team = data && view?.teamId ? data.teams.find((t) => t.id === view.teamId) : null;

  const tabs = roles ? [
    roles.family.length && { id: 'home', label: 'Our rocket', to: { name: 'home', teamId: roles.family[0].id } },
    roles.family.length && { id: 'parent', label: 'Parent view', to: { name: 'parent', teamId: roles.family[0].id } },
    roles.staff.length && { id: 'teacher', label: 'Teacher view', to: { name: 'teacher' } },
    roles.admin && { id: 'organiser', label: 'Organiser', to: { name: 'organiser' } },
  ].filter(Boolean) : [];
  const activeTab = view?.name === 'level' || view?.name === 'log' ? 'home' : view?.name === 'team' ? (roles?.admin && !roles.staff.length ? 'organiser' : 'teacher') : view?.name;

  // A teacher (staff, not a family) sees the challenge inside the teacher
  // screens' frame, beside their classes, as approved on 4 Nov.
  if (roles && roles.staff.length && !roles.family.length && (view?.name === 'teacher' || view?.name === 'team')) {
    const onNav = (id) => {
      if (id === 'rocket') { go({ name: 'teacher' }); return; }
      if (onNavigate) onNavigate('classroom'); else window.location.assign('/classroom');
    };
    return (
      <TeacherShell active="rocket" onNav={onNav} teacherName={teacherName || (api.isExample ? 'Mrs Wairimu' : 'Teacher')}
        teacherLine="Rocket Challenge" demoNote={api.isExample ? 'Example data: invented teams, nothing is saved' : null}>
        {err && <Card><p className="text-[14px] text-[#C2255C] font-semibold">{err}</p></Card>}
        {view.name === 'teacher' && <TeacherView teams={roles.staff} go={go} now={api.now ? Date.parse(api.now) : Date.now()} />}
        {view.name === 'team' && team && (
          <div className="space-y-4">
            <TeamDetail team={team} api={api} reload={reload} challenge={data.challenge} canOpen={roles.admin || roles.staff.some((t) => t.id === team.id)} back={() => go({ name: 'teacher' })} initialTab={view.tab || params.get('tab') || 'chat'} />
          </div>
        )}
      </TeacherShell>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef0f2] text-slate-900">
      <div className="max-w-[1180px] mx-auto px-4 lg:px-8 pt-4 pb-16 space-y-4">
        <header className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} aria-label="Back" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0"><Chevron back /></button>
          )}
          <div className="min-w-0 flex-1">
            <Eyebrow>HOREB Rocket Challenge</Eyebrow>
            <div className="text-[15px] font-bold truncate">{data?.challenge ? data.challenge.title : 'Loading'}</div>
          </div>
          <HorebBot size={40} className="shrink-0" />
        </header>
        {api.isExample && <ExampleBanner />}
        {tabs.length > 1 && (
          <nav className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1" aria-label="Views">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => go(t.to)}
                className={`shrink-0 h-10 px-4 rounded-full text-[13.5px] font-bold ${activeTab === t.id ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}>{t.label}</button>
            ))}
          </nav>
        )}
        {err && <Card><p className="text-[14px] text-[#C2255C] font-semibold">{err}</p><button onClick={reload} className="mt-3 h-10 px-4 rounded-full bg-slate-900 text-white text-[13px] font-bold">Try again</button></Card>}
        {!data && !err && <Card><p className="text-sm text-slate-500">Loading the challenge.</p></Card>}
        {data && view?.name === 'home' && team && <TeamHome team={team} challenge={data.challenge} go={go} />}
        {data && view?.name === 'level' && team && <LevelScreen team={team} level={view.level} api={api} me={me} reload={reload} go={go} onPractise={onPractise} />}
        {data && view?.name === 'log' && team && <DesignLog team={team} api={api} reload={reload} go={go} canAdd />}
        {data && view?.name === 'parent' && team && <ParentView team={team} api={api} me={me} reload={reload} />}
        {data && view?.name === 'teacher' && <TeacherView teams={roles.staff} go={go} now={api.now ? Date.parse(api.now) : Date.now()} />}
        {data && view?.name === 'team' && team && <TeamDetail team={team} api={api} reload={reload} challenge={data.challenge} canOpen={roles.admin || roles.staff.some((t) => t.id === team.id)} back={() => go({ name: roles.staff.length ? 'teacher' : 'organiser' })} initialTab={view.tab || params.get('tab') || 'chat'} />}
        {data && view?.name === 'organiser' && <OrganiserView data={data} api={api} reload={reload} go={go} />}
        {data && view?.name === 'join' && <JoinTeam api={api} kids={data.children} reload={async () => { setView(null); await reload(); }} />}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ team home
function TeamHome({ team, challenge, go }) {
  const p = teamProgress(team.log, { openedLevel: team.opened_level });
  const lvl = levelByN(p.level);
  const st = stepOf(p.level, p.step);
  const summary = logSummary(team.log);
  const latest = [...team.log].sort((a, b) => String(a.created_at).localeCompare(String(b.created_at))).pop();
  return (
    <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-5 lg:items-start">
      <div className="space-y-4 min-w-0">
        <div className="bg-white rounded-3xl px-5 py-5 lg:p-8 lg:grid lg:grid-cols-[minmax(0,1fr)_150px] lg:gap-6 lg:items-end">
          <div className="min-w-0">
            <Eyebrow>{p.finished ? 'Every level logged' : `Carry on · Level ${p.level}, step ${p.step} of ${lvl.steps.length}`}</Eyebrow>
            <h1 className="mt-2.5 text-[31px] lg:text-[52px] leading-[1.03] font-extrabold">
              {p.finished ? 'Ready for launch day' : st.title}
              <br /><span className="text-slate-400">{p.finished ? 'Prove how high you went' : lvl.title}</span>
            </h1>
            <p className="mt-3 text-[13.5px] font-medium text-slate-500">
              {team.name} · {firstNames(team.members)} · {team.school?.name}
            </p>
            <button onClick={() => go({ name: 'level', teamId: team.id, level: p.level })}
              className="mt-5 w-full lg:w-auto h-14 lg:px-8 bg-amber-400 text-slate-900 font-extrabold text-[17px] inline-flex items-center justify-center gap-2 rounded-full">
              Continue <Chevron />
            </button>
          </div>
          <RocketArt className="hidden lg:block w-full" />
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-3 px-1">
            <span className="font-extrabold text-[19px] tracking-tight">The five levels</span>
            <span className="text-[12.5px] text-slate-500 font-semibold">Each one opens the next</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 lg:gap-3">
            {LEVELS.map((l, i) => {
              const s = p.levels[i];
              const state = s.complete ? 'Logged' : s.open ? `Step ${l.n === p.level ? p.step : 1} of ${s.total}` : `Opens after level ${l.n - 1}`;
              return (
                <button key={l.n} onClick={() => s.open && go({ name: 'level', teamId: team.id, level: l.n })} disabled={!s.open}
                  style={{ background: s.open ? l.colour.bg : '#FFFFFF' }}
                  className={`text-left rounded-2xl lg:rounded-3xl p-3.5 lg:p-4 min-h-[118px] lg:min-h-[168px] flex flex-col justify-between ${i === 4 ? 'col-span-2 lg:col-span-1' : ''} ${s.open ? '' : 'opacity-80'}`}>
                  <span className="flex items-center justify-between text-[11px] font-bold" style={{ color: s.open ? l.colour.meta : '#8A8A94' }}>
                    <span>Level {l.n}</span>
                    {s.complete ? <Tick /> : !s.open ? <Lock /> : null}
                  </span>
                  <span>
                    <span className="block text-[17px] lg:text-[19px] font-extrabold leading-tight" style={{ color: s.open ? l.colour.ink : '#16161A' }}>{l.title}</span>
                    <span className="block mt-1 text-[11.5px] font-bold" style={{ color: s.open ? l.colour.meta : '#8A8A94' }}>{state}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <div className="flex items-baseline justify-between">
            <span className="font-extrabold text-[17px]">Design log</span>
            <span className="text-[12.5px] font-bold text-slate-500 tabular-nums">{summary.tests} {summary.tests === 1 ? 'test' : 'tests'}</span>
          </div>
          <p className="text-[13.5px] text-slate-500 mt-1.5 leading-snug">
            {latest ? <>Latest, {fmtDay(latest.tested_on)}: {latest.what_changed}.</> : 'Every test goes here. HOREB helps with the next step once this step has a test.'}
          </p>
          <button onClick={() => go({ name: 'log', teamId: team.id })} className="mt-3 h-11 px-4 rounded-full bg-slate-900 text-white text-[13.5px] font-bold">Open the log</button>
        </Card>
        <SafetyCard />
        <Card>
          <span className="font-extrabold text-[17px]">Dates</span>
          <dl className="mt-2 text-[13.5px] space-y-1.5">
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Lab days</dt><dd className="font-semibold text-right">{tbc(challenge?.lab_name)}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Launch day</dt><dd className="font-semibold text-right">{challenge?.launch_on ? fmtDay(challenge.launch_on) : 'To be confirmed'}</dd></div>
          </dl>
        </Card>
      </div>
    </div>
  );
}

const SafetyCard = ({ compact = false }) => (
  <Card className="!bg-[#FFF0F5]">
    <Eyebrow tone="text-[#C2255C]">Safety, every time</Eyebrow>
    <ul className={`mt-2 space-y-1.5 ${compact ? 'text-[12.5px]' : 'text-[13.5px]'} text-slate-700 leading-snug`}>
      {SAFETY_RULES.map((r) => <li key={r} className="flex gap-2"><span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#FF4F91] shrink-0" />{r}</li>)}
    </ul>
  </Card>
);

// ------------------------------------------------------------------ a level
function LevelScreen({ team, level, api, me, reload, go, onPractise }) {
  const p = teamProgress(team.log, { openedLevel: team.opened_level });
  const n = level || p.level;
  const l = levelByN(n);
  const ls = p.levels[n - 1];
  const done = new Set(team.log.filter((e) => Number(e.level) === n).map((e) => Number(e.step)));
  const current = n === p.level ? p.step : null;
  const [logging, setLogging] = useState(false);
  const mine = team.members.filter((m) => m.account_id === me);
  const needsLog = current && team.messages.some((m) => m.level === n && Number(m.step) === current && m.role === 'horeb');

  if (!ls?.open) {
    return (
      <Card>
        <h2 className="text-[24px] font-extrabold">Level {n} is not open yet</h2>
        <p className="text-[14px] text-slate-500 mt-1">It opens when every step of level {n - 1} has a test in the log.</p>
        <button onClick={() => go({ name: 'home', teamId: team.id })} className="mt-4 h-11 px-4 rounded-full bg-slate-900 text-white text-[13.5px] font-bold">Back to the levels</button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <button onClick={() => go({ name: 'home', teamId: team.id })} className="inline-flex items-center gap-1 text-[13.5px] font-bold text-slate-600"><Chevron back /> All levels</button>
      <div className="rounded-3xl p-5 lg:p-8" style={{ background: l.colour.bg, color: l.colour.ink }}>
        <div className="text-[11px] font-bold tracking-[.12em] uppercase" style={{ color: l.colour.meta }}>Level {l.n} · {l.maths}</div>
        <h1 className="mt-2 text-[34px] lg:text-[56px] leading-[1.02] font-extrabold">{l.title}</h1>
        <p className="mt-2 text-[15px] font-semibold" style={{ color: l.colour.meta }}>{l.goal}</p>
      </div>

      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-5 lg:items-start">
        <div className="min-w-0">
          <Chat team={team} level={n} step={current} api={api} mine={mine} reload={reload} readOnly={!mine.length} logFirst={!!needsLog} />
        </div>
        <div className="space-y-4">
          <Card>
            <span className="font-extrabold text-[17px]">Steps</span>
            <ol className="mt-3 space-y-2">
              {l.steps.map((s) => {
                const isDone = done.has(s.n);
                const isNow = s.n === current;
                return (
                  <li key={s.n} className={`rounded-2xl px-3 py-3 ${isNow ? 'bg-[#FFF7DC]' : 'bg-slate-100'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[13px] font-extrabold ${isDone ? 'bg-[#9BE3C4] text-[#16161A]' : isNow ? 'bg-amber-400 text-slate-900' : 'bg-white text-slate-400'}`}>
                        {isDone ? <Tick /> : isNow ? s.n : <Lock />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14.5px] font-bold leading-tight">{s.title}</span>
                        <span className="block text-[12px] text-slate-500 font-semibold">{isDone ? 'Test logged' : isNow ? 'You are here' : `Log step ${s.n - 1} first`}</span>
                      </span>
                    </div>
                    {isNow && <p className="mt-2 text-[13px] text-slate-700 leading-snug"><b>The test:</b> {s.test}</p>}
                  </li>
                );
              })}
            </ol>
            {current && mine.length > 0 && (
              <button onClick={() => setLogging(true)}
                className={`mt-4 w-full h-12 rounded-full font-extrabold text-[15px] ${needsLog ? 'bg-amber-400 text-slate-900' : 'bg-slate-900 text-white'}`}>
                Log the test for step {current}
              </button>
            )}
            {!current && <p className="mt-3 text-[13px] text-slate-500 font-semibold">Every step of this level has a test in the log.</p>}
          </Card>

          <Card>
            <span className="font-extrabold text-[17px]">The maths behind it</span>
            <p className="text-[12.5px] text-slate-500 mt-1">Practise these on HOREB. Each one you master counts for your team.</p>
            <ul className="mt-2.5 space-y-1.5">
              {l.skills.map((id) => {
                const held = (team.maths || []).filter((m) => (m.mastered || []).includes(id)).map((m) => m.label);
                return (
                  <li key={id}>
                    <button onClick={() => onPractise && onPractise(id, mine[0]?.child_id || null)} disabled={!onPractise}
                      className="w-full text-left flex items-center gap-2.5 py-1.5 px-2 -mx-2 rounded-xl hover:bg-slate-100">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${held.length ? 'bg-[#9BE3C4]' : 'bg-slate-100'}`}>{held.length ? <Tick className="w-3.5 h-3.5" /> : null}</span>
                      <span className="flex-1 min-w-0 text-[14px] font-semibold truncate">{SKILLS[id]?.name || id}</span>
                      <span className="text-[11.5px] text-slate-400 font-bold shrink-0">{held.length ? `Mastered by ${held.map((x) => team.members.find((m) => m.label === x)?.first_name || `Learner ${x}`).join(' and ')}` : `Grade ${SKILLS[id]?.grade ?? ''}`}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
          <SafetyCard compact />
        </div>
      </div>
      {logging && <LogForm team={team} level={n} step={current} api={api} mine={mine} onClose={() => setLogging(false)} onSaved={async () => { setLogging(false); await reload(); }} />}
    </div>
  );
}

// ------------------------------------------------------------------ the chat
const KIND_LABEL = { safety: 'Safety rule', hint: 'Hint', 'log-first': 'Log first', budget: 'Help used up', fallback: '' };

function Thread({ messages, members, steps }) {
  const nameOf = (label) => members.find((m) => m.label === label)?.first_name || (label ? `Learner ${label}` : 'The team');
  let lastStep = null;
  return (
    <div className="space-y-3">
      {messages.length === 0 && <p className="text-[13.5px] text-slate-500">Nothing here yet.</p>}
      {messages.map((m) => {
        const divider = m.step && m.step !== lastStep ? steps.find((s) => s.n === Number(m.step)) : null;
        if (m.step) lastStep = m.step;
        return (
          <React.Fragment key={m.id}>
            {divider && <div className="pt-2 text-[11px] font-bold tracking-[.1em] uppercase text-slate-400">Step {divider.n}: {divider.title}</div>}
            {m.role === 'horeb' ? (
              <div className="flex gap-2.5 items-start max-w-[92%]">
                <HorebBot size={30} className="shrink-0 mt-0.5" />
                <div className={`rounded-2xl rounded-tl-md px-3.5 py-2.5 text-[14.5px] leading-snug ${m.kind === 'safety' ? 'bg-[#FFF0F5]' : 'bg-slate-100'}`}>
                  {KIND_LABEL[m.kind] && <div className={`text-[10.5px] font-bold tracking-[.1em] uppercase mb-0.5 ${m.kind === 'safety' ? 'text-[#C2255C]' : 'text-slate-500'}`}>{KIND_LABEL[m.kind]}</div>}
                  {m.body}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-bold text-slate-400 mb-0.5 mr-1">{nameOf(m.author_label)}</span>
                <div className="max-w-[85%] rounded-2xl rounded-tr-md px-3.5 py-2.5 text-[14.5px] leading-snug bg-[#16161A] text-white">
                  {m.kind === 'stuck' ? <i>We are stuck.</i> : m.body}
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Chat({ team, level, step, api, mine, reload, readOnly, logFirst = false }) {
  const l = levelByN(level);
  const msgs = team.messages.filter((m) => m.level === level);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState(mine[0]?.label || 'A');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  // Scroll the thread, never the page: the level's title stays in view.
  const boxRef = useRef(null);
  useEffect(() => { const el = boxRef.current; if (el) el.scrollTop = el.scrollHeight; }, [msgs.length]);

  const send = async (kind) => {
    if (busy || (kind === 'ask' && !text.trim())) return;
    setBusy(true); setErr('');
    try {
      await api.send(team.id, { level, step, message: kind === 'stuck' ? 'We are stuck.' : text.trim(), kind, author });
      setText('');
      await reload();
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const opening = step ? stepOf(level, step)?.opening : null;
  const showOpening = opening && !msgs.some((m) => Number(m.step) === step);
  return (
    <Card className="!p-0 overflow-hidden">
      <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="font-extrabold text-[17px]">Talk it through with HOREB</span>
          <p className="text-[12px] text-slate-500 font-semibold">HOREB asks, you work it out. Your teacher and parents can read this.</p>
        </div>
      </div>
      <div ref={boxRef} className="px-4 lg:px-5 py-4 max-h-[62vh] lg:max-h-[560px] overflow-y-auto">
        <Thread messages={msgs} members={team.members} steps={l.steps} />
        {showOpening && (
          <div className="mt-3 flex gap-2.5 items-start max-w-[92%]">
            <HorebBot size={30} className="shrink-0 mt-0.5" />
            <div className="rounded-2xl rounded-tl-md px-3.5 py-2.5 text-[14.5px] leading-snug bg-[#FFF7DC]">
              <div className="text-[10.5px] font-bold tracking-[.1em] uppercase mb-0.5 text-slate-500">Step {step}: {stepOf(level, step).title}</div>
              {opening}
            </div>
          </div>
        )}
      </div>
      {!readOnly && step && (
        <div className="border-t border-slate-100 p-3 lg:p-4 space-y-2.5">
          {mine.length > 1 && (
            <div className="flex gap-2 items-center text-[12.5px] font-semibold text-slate-500">
              <span>Typing:</span>
              {mine.map((m) => (
                <button key={m.label} onClick={() => setAuthor(m.label)} className={`h-8 px-3 rounded-full font-bold ${author === m.label ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>{m.first_name}</button>
              ))}
            </div>
          )}
          <label htmlFor="rocket-msg" className="sr-only">Message to HOREB</label>
          <textarea id="rocket-msg" value={text} onChange={(e) => setText(e.target.value)} rows={2} maxLength={1200}
            placeholder="What do you think? What did you find?"
            className="w-full resize-none bg-slate-100 rounded-2xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-amber-400" />
          <div className="flex gap-2">
            <button onClick={() => send('stuck')} disabled={busy} className="h-12 px-4 rounded-full bg-white border-2 border-slate-900 text-slate-900 text-[14px] font-bold shrink-0 disabled:opacity-40">We are stuck</button>
            <button onClick={() => send('ask')} disabled={busy || !text.trim()} className={`flex-1 h-12 rounded-full text-[15px] font-extrabold disabled:opacity-40 ${logFirst ? 'bg-slate-900 text-white' : 'bg-amber-400 text-slate-900'}`}>{busy ? 'HOREB is thinking' : 'Send'}</button>
          </div>
          {err && <p className="text-[13px] text-[#C2255C] font-semibold">{err}</p>}
        </div>
      )}
      {!readOnly && !step && <p className="border-t border-slate-100 px-5 py-3 text-[13px] text-slate-500 font-semibold">This level is done. Read back any time.</p>}
    </Card>
  );
}

// ------------------------------------------------------------------ the log
function LogForm({ team, level, step, api, mine, onClose, onSaved }) {
  const l = levelByN(level);
  const [f, setF] = useState({ level, step, tested_on: new Date().toISOString().slice(0, 10), member_label: mine[0]?.label || null });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const save = async () => {
    const entry = { ...f };
    for (const k of ['water_ml', 'pressure_bar']) entry[k] = entry[k] === '' || entry[k] == null ? null : Number(entry[k]);
    const v = validateEntry(entry);
    setErrors(v.errors);
    if (!v.ok) return;
    setBusy(true); setErr('');
    try { await api.addLog(team.id, entry, file); await onSaved(); } catch (e) { setErr(e.message); setBusy(false); }
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end lg:items-center justify-center" role="dialog" aria-modal="true" aria-label="Log a test">
      <div className="bg-white w-full lg:max-w-[560px] rounded-t-3xl lg:rounded-3xl max-h-[92vh] overflow-y-auto p-5 lg:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Eyebrow>Level {level} · {l.title}</Eyebrow>
            <h2 className="text-[24px] font-extrabold leading-tight mt-1">Log a test</h2>
          </div>
          <button onClick={onClose} className="h-10 px-4 rounded-full bg-slate-100 text-[13px] font-bold">Close</button>
        </div>
        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="text-[13px] font-bold">Which step is this test for?</span>
            <select value={f.step ?? ''} onChange={(e) => set('step', Number(e.target.value))} className="mt-1 w-full h-12 rounded-2xl bg-slate-100 px-3 text-[15px]">
              {l.steps.map((s) => <option key={s.n} value={s.n}>Step {s.n}: {s.title}</option>)}
            </select>
            {errors.step && <span className="text-[12.5px] text-[#C2255C] font-semibold">{errors.step}</span>}
          </label>
          {LOG_FIELDS.map((fd) => (
            <label key={fd.key} className="block">
              <span className="text-[13px] font-bold">{fd.label}{fd.required ? '' : ' (if you have it)'}</span>
              {fd.type === 'text' && (fd.key === 'result' || fd.key === 'learned' || fd.key === 'what_changed')
                ? <textarea rows={2} value={f[fd.key] ?? ''} onChange={(e) => set(fd.key, e.target.value)} className="mt-1 w-full rounded-2xl bg-slate-100 px-3 py-2.5 text-[15px] resize-none" />
                : <input type={fd.type === 'number' ? 'number' : fd.type} inputMode={fd.type === 'number' ? 'decimal' : undefined} min={fd.min} max={fd.max} step={fd.step || 'any'}
                    value={f[fd.key] ?? ''} onChange={(e) => set(fd.key, e.target.value)} className="mt-1 w-full h-12 rounded-2xl bg-slate-100 px-3 text-[15px]" />}
              {fd.key === 'pressure_bar' && <span className="block text-[12px] text-slate-500 mt-0.5">Your adult reads the gauge. Never above {PRESSURE_MAX_BAR} bar.</span>}
              {errors[fd.key] && <span className="block text-[12.5px] text-[#C2255C] font-semibold">{errors[fd.key]}</span>}
            </label>
          ))}
          <label className="block">
            <span className="text-[13px] font-bold">Photo (if you want)</span>
            <input type="file" accept="image/*" capture="environment" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-1 block w-full text-[13px]" />
            <span className="block text-[12px] text-slate-500 mt-0.5">Of the rocket, not of people.</span>
          </label>
        </div>
        {err && <p className="mt-3 text-[13px] text-[#C2255C] font-semibold">{err}</p>}
        <button onClick={save} disabled={busy} className="mt-5 w-full h-14 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[17px] disabled:opacity-50">{busy ? 'Saving' : 'Save the test'}</button>
      </div>
    </div>
  );
}

function LogEntry({ e, api }) {
  const [url, setUrl] = useState(null);
  useEffect(() => { let on = true; if (e.photo_path) api.photoUrl(e.photo_path).then((u) => on && setUrl(u)); return () => { on = false; }; }, [e.photo_path, api]);
  const s = stepOf(e.level, e.step);
  const facts = [
    e.water_ml != null && ['Water', `${e.water_ml} ml`],
    e.pressure_bar != null && ['Pressure', `${e.pressure_bar} bar`],
    e.fins_notes && ['Fins', e.fins_notes],
    e.nose_notes && ['Nose cone', e.nose_notes],
    e.weight_notes && ['Weight', e.weight_notes],
  ].filter(Boolean);
  return (
    <li className="rounded-2xl bg-slate-100 p-4">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[11px] font-bold tracking-[.1em] uppercase text-slate-500">Step {e.level}.{e.step} · {s?.title}</span>
        <span className="text-[12px] font-bold text-slate-500 shrink-0">{fmtDay(e.tested_on)}</span>
      </div>
      <div className="mt-1 text-[15.5px] font-extrabold leading-tight">{e.what_changed}</div>
      {facts.length > 0 && (
        <dl className="mt-2 flex flex-wrap gap-1.5">
          {facts.map(([k, v]) => <div key={k} className="bg-white rounded-full px-2.5 py-1 text-[12px]"><dt className="inline text-slate-500">{k} </dt><dd className="inline font-bold">{v}</dd></div>)}
        </dl>
      )}
      <p className="mt-2 text-[14px] leading-snug"><b>What happened:</b> {e.result}</p>
      <p className="mt-1 text-[14px] leading-snug"><b>What we learned:</b> {e.learned}</p>
      {url && <img src={url} alt="The team's rocket for this test" className="mt-3 rounded-2xl max-h-64 object-cover" />}
    </li>
  );
}

function DesignLog({ team, api, reload, go, canAdd = false }) {
  const p = teamProgress(team.log, { openedLevel: team.opened_level });
  const [logging, setLogging] = useState(false);
  const mine = team.members;
  const byLevel = LEVELS.map((l) => ({ l, entries: team.log.filter((e) => Number(e.level) === l.n).sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))) })).filter((x) => x.entries.length);
  return (
    <div className="space-y-4">
      {go && <button onClick={() => go({ name: 'home', teamId: team.id })} className="inline-flex items-center gap-1 text-[13.5px] font-bold text-slate-600"><Chevron back /> All levels</button>}
      <Card>
        <Eyebrow>{team.name}</Eyebrow>
        <h1 className="mt-1 text-[30px] lg:text-[44px] font-extrabold leading-[1.04]">Design log</h1>
        <p className="mt-2 text-[14px] text-slate-500 leading-snug">
          {team.log.length ? `${team.log.length} ${team.log.length === 1 ? 'test' : 'tests'} so far. ` : ''}
          {p.finished ? 'Every step has a test.' : `Next: a test for level ${p.level}, step ${p.step}.`}
        </p>
        {canAdd && !p.finished && <button onClick={() => setLogging(true)} className="mt-4 w-full lg:w-auto h-12 lg:px-6 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[15px]">Log a test</button>}
      </Card>
      {byLevel.length === 0 && <Card><p className="text-[14px] text-slate-500">No tests yet.</p></Card>}
      {byLevel.map(({ l, entries }) => (
        <Card key={l.n}>
          <div className="flex items-center gap-2.5"><span className="w-3 h-3 rounded-full" style={{ background: l.colour.bg }} /><span className="font-extrabold text-[17px]">Level {l.n}: {l.title}</span></div>
          <ul className="mt-3 space-y-2.5">{entries.map((e) => <LogEntry key={e.id} e={e} api={api} />)}</ul>
        </Card>
      ))}
      {logging && <LogForm team={team} level={p.level} step={p.step} api={api} mine={mine} onClose={() => setLogging(false)} onSaved={async () => { setLogging(false); await reload(); }} />}
    </div>
  );
}

// ------------------------------------------------------------------ parent
function ConversationReader({ team }) {
  const p = teamProgress(team.log, { openedLevel: team.opened_level });
  const [level, setLevel] = useState(p.level);
  const l = levelByN(level);
  return (
    <Card>
      <span className="font-extrabold text-[17px]">Every conversation</span>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {LEVELS.map((x) => {
          const count = team.messages.filter((m) => m.level === x.n).length;
          return (
            <button key={x.n} onClick={() => setLevel(x.n)} disabled={!count && x.n !== p.level}
              className={`shrink-0 h-9 px-3.5 rounded-full text-[12.5px] font-bold disabled:opacity-40 ${level === x.n ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
              Level {x.n} <span className="opacity-60 tabular-nums">{count}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 max-h-[520px] overflow-y-auto">
        <Thread messages={team.messages.filter((m) => m.level === level)} members={team.members} steps={l.steps} />
      </div>
    </Card>
  );
}

function ParentView({ team, api, me, reload }) {
  const p = teamProgress(team.log, { openedLevel: team.opened_level });
  const mine = team.members.filter((m) => m.account_id === me);
  const [asking, setAsking] = useState(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const childNames = mine.map((m) => m.first_name).join(' and ');
  const ask = async () => {
    setBusy(true);
    try { await api.requestDeletion(asking.id, note); setAsking(null); setNote(''); await reload(); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-5 lg:items-start">
      <div className="space-y-4 min-w-0">
        <Card className="lg:p-8">
          <Eyebrow>Parent view · {team.name}</Eyebrow>
          <h1 className="mt-2 text-[28px] lg:text-[44px] font-extrabold leading-[1.05]">
            {p.finished ? `${childNames}'s team has logged every level.` : `${childNames}'s team is on level ${p.level}: ${levelByN(p.level).title}.`}
          </h1>
          <p className="mt-3 text-[14.5px] text-slate-600 leading-snug">
            HOREB asks questions and gives hints in small steps. It never gives the answer or the design. The team logs every test before HOREB helps with the next step. You can read every word below.
          </p>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-100 rounded-2xl py-3"><dt className="text-[11px] font-bold text-slate-500">Tests logged</dt><dd className="text-[24px] font-extrabold tabular-nums">{team.log.length}</dd></div>
            <div className="bg-slate-100 rounded-2xl py-3"><dt className="text-[11px] font-bold text-slate-500">Last active</dt><dd className="text-[14px] font-extrabold mt-1.5">{fmtDay(lastActive(team)) || 'Not yet'}</dd></div>
            <div className="bg-slate-100 rounded-2xl py-3"><dt className="text-[11px] font-bold text-slate-500">Level</dt><dd className="text-[24px] font-extrabold tabular-nums">{p.level} of 5</dd></div>
          </dl>
        </Card>
        <ConversationReader team={team} />
        <DesignLog team={team} api={api} reload={reload} />
      </div>
      <div className="space-y-4">
        <Card>
          <span className="font-extrabold text-[17px]">Your consent</span>
          <ul className="mt-2 space-y-2">
            {mine.map((m) => (
              <li key={m.id} className="text-[13.5px] leading-snug">
                <b>{m.first_name}</b>, Grade {m.grade}: you agreed on {fmtDay(m.consent_at)}.
                {m.deletion_requested_at && <span className="block text-[#C2255C] font-semibold">You asked for deletion on {fmtDay(m.deletion_requested_at)}. The organiser carries it out after the challenge.</span>}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12.5px] text-slate-500 leading-snug">No names are sent to the AI. The chat and the log are kept so the team, their teacher, the organiser and the team's parents can read them.</p>
          {mine.filter((m) => !m.deletion_requested_at).map((m) => (
            <button key={m.id} onClick={() => setAsking(m)} className="mt-3 h-10 px-4 rounded-full bg-slate-100 text-[13px] font-bold">Ask for {m.first_name}'s data to be deleted</button>
          ))}
          {asking && (
            <div className="mt-3 rounded-2xl bg-[#FFF0F5] p-3.5">
              <p className="text-[13px] leading-snug">After the challenge, {asking.first_name}'s messages and log entries are removed and their place on the team is closed. HOREB's replies stay, because the other learner's work depends on them; they contain no names.</p>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Anything we should know (optional)" className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-[14px] resize-none" />
              <div className="mt-2 flex gap-2">
                <button onClick={() => setAsking(null)} className="h-10 px-4 rounded-full bg-white text-[13px] font-bold">Cancel</button>
                <button onClick={ask} disabled={busy} className="h-10 px-4 rounded-full bg-slate-900 text-white text-[13px] font-bold">Ask for deletion</button>
              </div>
            </div>
          )}
        </Card>
        <SafetyCard compact />
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ teacher
// The teacher's teams, in the teacher screens' look (4 Nov 2026): one row per
// team with its five levels as dots, and HOREB's one suggestion beside them,
// with the reason and where it came from. The only signal used is the one the
// gate already rests on: when the team last logged a test or wrote.
const QUIET_TEAM_DAYS = 4;
const daysSince = (iso, now = Date.now()) => (iso ? Math.max(0, Math.floor((now - Date.parse(iso)) / 86400000)) : null);
const isToday = (iso, now = Date.now()) => !!iso && new Date(iso).toDateString() === new Date(now).toDateString();

function TeamRow({ t, flag, onOpen, now }) {
  const p = teamProgress(t.log, { openedLevel: t.opened_level });
  const lastTest = [...t.log].map((e) => e.created_at).filter(Boolean).sort().pop() || null;
  const grades = [...new Set(t.members.map((m) => m.grade).filter(Boolean))];
  return (
    <div className={`tt-team${flag ? ' tt-flag' : ''}`}>
      <div>
        <b className="tt-tn">{t.name}</b>
        <div className="tt-ln">{p.finished ? 'Every level logged' : `Level ${p.level}, step ${p.step}: ${stepOf(p.level, p.step).title}`}</div>
        <div className="tt-tm">
          <span className="tt-lv" aria-label={`Level ${p.level} of ${LEVELS.length}`}>
            {p.levels.map((l) => <i key={l.n} className={l.complete ? 'tt-f' : l.n === p.level ? 'tt-c' : ''} />)}
          </span>
          <span>{firstNames(t.members)}{grades.length ? ` · Grade ${grades.join(' and ')}` : ''}</span>
          {lastTest
            ? <Pill tone={flag ? 'am' : isToday(lastTest, now) ? 'gr' : null}>Last test {isToday(lastTest, now) ? 'today' : fmtDay(lastTest)}</Pill>
            : <Pill tone="am">No test logged yet</Pill>}
        </div>
      </div>
      <button className="tt-go tt-btn tt-line" onClick={onOpen}>{flag ? 'Open log' : 'Open'}</button>
    </div>
  );
}

function TeacherView({ teams, go, now = Date.now() }) {
  const [hidden, setHidden] = useState(false);
  const schools = [...new Set(teams.map((t) => t.school?.name).filter(Boolean))];
  const quiet = teams.map((t) => ({ t, days: daysSince(lastActive(t), now) }))
    .filter((x) => x.days == null || x.days > QUIET_TEAM_DAYS)
    .sort((a, b) => (b.days ?? 999) - (a.days ?? 999));
  const flagged = new Set(quiet.map((x) => x.t.id));
  const first = quiet[0];
  const firstLast = first ? [...first.t.log].sort((a, b) => String(a.created_at).localeCompare(String(b.created_at))).pop() : null;
  const firstLevel = first ? levelByN(teamProgress(first.t.log, { openedLevel: first.t.opened_level }).level) : null;
  const ordered = [...quiet.map((x) => x.t), ...teams.filter((t) => !flagged.has(t.id))];
  const gone = (x) => (x.days == null ? 'has not logged a test or written yet' : `has not logged a test or written for ${x.days} days`);
  return (
    <section className="tt-screen tt-on">
      <div className="tt-card" style={{ marginBottom: 20 }}>
        <div className="tt-crumb">Rocket Challenge · {schools.join(', ') || 'your school'}</div>
        <h1>{teams.length} {teams.length === 1 ? 'team' : 'teams'} building rockets</h1>
        <p className="tt-lead">
          {first ? `${first.t.name} ${gone(first)}. ` : ''}HOREB waits for a test before it helps with the next step.
        </p>
      </div>
      <div className="tt-grid2">
        <div className="tt-stack">
          <div className="tt-card">
            <div className="tt-head-row"><h2>Your teams</h2><span className="tt-sub">Levels 1 to {LEVELS.length}</span></div>
            {ordered.map((t) => (
              <TeamRow key={t.id} t={t} flag={flagged.has(t.id)} now={now}
                onOpen={() => go({ name: 'team', teamId: t.id, tab: flagged.has(t.id) ? 'log' : 'chat' })} />
            ))}
            <p className="tt-sub" style={{ marginTop: 14 }}>Open a team to read its conversation with HOREB and its design log, or to open a level early on a lab day.</p>
          </div>
        </div>
        <div className="tt-stack">
          {first && !hidden && (
            <SuggestPanel
              title={`Check in with ${first.t.name}.`}
              body={first.days == null ? 'No test logged and no messages yet.' : `No test logged and no messages for ${first.days} days.`}
              why={[
                ['The reason', 'A team logs a test before HOREB gives the next step, so a team that stops logging stops getting help.'],
                ['Where it came from', firstLast ? `Their design log, last entry ${fmtDay(firstLast.created_at)}.` : 'Their design log has no entries yet.'],
              ]}
              innerLabel={firstLast ? 'Their last log entry' : null}
              inner={firstLast?.result || null}
              foot={firstLevel ? `Their level uses ${firstLevel.maths.charAt(0).toLowerCase()}${firstLevel.maths.slice(1)}.` : null}
              action="Open their log"
              onAction={() => go({ name: 'team', teamId: first.t.id, tab: 'log' })}
              onDismiss={() => setHidden(true)}
            />
          )}
          <div className="tt-card">
            <h2>The {LEVELS.length === 5 ? 'five' : LEVELS.length} levels</h2>
            <div className="tt-levels">
              {LEVELS.map((l) => <div key={l.n}><b>{l.title}</b><span>{l.maths}</span></div>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function JudgingInputs({ team, challenge }) {
  const s = logSummary(team.log);
  return (
    <Card>
      <span className="font-extrabold text-[17px]">For the judges</span>
      <p className="text-[12.5px] text-slate-500 mt-1">The inputs only. Judges weigh them; nothing here ranks children.</p>
      <dl className="mt-3 space-y-3">
        {JUDGING.map((j) => (
          <div key={j.id} className="rounded-2xl bg-slate-100 p-3.5">
            <dt className="flex justify-between gap-2 text-[12px] font-bold text-slate-500"><span>{j.label}</span><span className="tabular-nums">{j.weight}%</span></dt>
            <dd className="mt-1 text-[14px] leading-snug">
              {j.id === 'flight' && (team.flight
                ? <>{team.flight.height_m != null ? <b>{team.flight.height_m} m</b> : 'Height not recorded'}{team.flight.method ? ` by ${team.flight.method}` : ''}. Landing: {team.flight.landing || 'not recorded'}.</>
                : <>Recorded on launch day ({challenge?.launch_on ? fmtDay(challenge.launch_on) : 'date to be confirmed'}).</>)}
              {j.id === 'log' && <><b>{s.tests}</b> tests, <b>{s.complete}</b> with every field, <b>{s.withPhoto}</b> with a photo, across {s.levelsLogged} {s.levelsLogged === 1 ? 'level' : 'levels'}.</>}
              {j.id === 'maths' && (team.maths?.length
                ? team.maths.map((m) => <span key={m.label} className="block"><b>{team.members.find((x) => x.label === m.label)?.first_name || `Learner ${m.label}`}</b>: {(m.mastered || []).length ? (m.mastered || []).map((id) => SKILLS[id]?.name || id).join(', ') : 'none yet'}</span>)
                : 'None yet.')}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function TeamDetail({ team, api, reload, challenge, canOpen, back, initialTab = 'chat' }) {
  const p = teamProgress(team.log, { openedLevel: team.opened_level });
  const [tab, setTab] = useState(initialTab);
  const [busy, setBusy] = useState(false);
  const nextOpen = Math.min(5, Math.max(team.opened_level || 1, p.levels.filter((l) => l.open).length) + 1);
  const open = async () => { setBusy(true); try { await api.openLevel(team.id, nextOpen); await reload(); } finally { setBusy(false); } };
  return (
    <div className="space-y-4">
      <button onClick={back} className="inline-flex items-center gap-1 text-[13.5px] font-bold text-slate-600"><Chevron back /> All teams</button>
      <Card className="lg:p-8">
        <Eyebrow>{team.school?.name} · code {team.join_code}</Eyebrow>
        <h1 className="mt-2 text-[30px] lg:text-[48px] font-extrabold leading-[1.04]">{team.name}</h1>
        <p className="mt-2 text-[14.5px] text-slate-600">
          {team.members.map((m) => `${m.first_name} (Grade ${m.grade})`).join(' and ') || 'No learners yet'}. {p.finished ? 'Every level logged.' : `On level ${p.level}, step ${p.step}.`}
        </p>
        {canOpen && nextOpen <= 5 && !p.levels[nextOpen - 1]?.open && (
          <button onClick={open} disabled={busy} className="mt-4 h-11 px-5 rounded-full bg-slate-900 text-white text-[13.5px] font-bold">Open level {nextOpen} early (lab day)</button>
        )}
      </Card>
      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1">
        {[['chat', 'Conversation'], ['log', 'Design log'], ['judge', 'For the judges']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`shrink-0 whitespace-nowrap h-10 px-4 rounded-full text-[13.5px] font-bold ${tab === id ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}>{label}</button>
        ))}
      </div>
      {tab === 'chat' && <ConversationReader team={team} />}
      {tab === 'log' && <DesignLog team={team} api={api} reload={reload} />}
      {tab === 'judge' && <JudgingInputs team={team} challenge={challenge} />}
    </div>
  );
}

// ------------------------------------------------------------------ organiser
function OrganiserView({ data, api, reload, go }) {
  const c = data.challenge;
  const [edit, setEdit] = useState(null);
  const [flightFor, setFlightFor] = useState(null);
  const [flight, setFlight] = useState({});
  const [nt, setNt] = useState({ schoolName: '', teamName: '', teacherEmail: '' });
  const [made, setMade] = useState('');
  const [err, setErr] = useState('');
  const asks = data.teams.flatMap((t) => t.members.filter((m) => m.deletion_requested_at).map((m) => ({ t, m })));
  const teams = [...data.teams].sort((a, b) => `${a.school?.name}${a.name}`.localeCompare(`${b.school?.name}${b.name}`));
  const saveSettings = async (patch) => {
    setErr('');
    try { await api.saveSettings(patch, c.id); setEdit(null); await reload(); } catch (e) { setErr(e.message); }
  };
  const saveFlight = async () => {
    setErr('');
    try { await api.recordFlight(flightFor, { ...flight, height_m: flight.height_m === '' || flight.height_m == null ? null : Number(flight.height_m) }); setFlightFor(null); setFlight({}); await reload(); } catch (e) { setErr(e.message); }
  };
  const createTeam = async () => {
    setErr(''); setMade('');
    try {
      const existing = data.schools.find((s) => s.name.toLowerCase() === nt.schoolName.trim().toLowerCase());
      const r = await api.createTeam({ challengeId: c.id, schoolId: existing?.id, schoolName: nt.schoolName, teamName: nt.teamName, teacherEmail: nt.teacherEmail.trim() || null });
      setMade(`${nt.teamName} made. Give the families this code: ${r.join_code}`);
      setNt({ schoolName: nt.schoolName, teamName: '', teacherEmail: '' });
      await reload();
    } catch (e) { setErr(e.message); }
  };
  return (
    <div className="space-y-4">
      <Card className="lg:p-8">
        <Eyebrow>Organiser</Eyebrow>
        <h1 className="mt-2 text-[28px] lg:text-[44px] font-extrabold leading-[1.05]">{data.teams.length} teams from {data.schools.length} {data.schools.length === 1 ? 'school' : 'schools'}.</h1>
        <p className="mt-3 text-[14.5px] text-slate-600 leading-snug">Judging inputs for every team are below, in school order. Judges weigh them: flight {JUDGING[0].weight}%, design log {JUDGING[1].weight}%, maths {JUDGING[2].weight}%. Nothing here is shown to children or ranks them.</p>
      </Card>

      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-5 lg:items-start">
        <div className="min-w-0 space-y-4">
          <Card className="!p-0 overflow-hidden">
            <div className="px-5 pt-4 pb-2 font-extrabold text-[17px]">Judging inputs</div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px] min-w-[640px]">
                <thead><tr className="text-left text-[11px] uppercase tracking-[.08em] text-slate-500">
                  <th className="px-5 py-2 font-bold">Team</th><th className="px-2 py-2 font-bold">Flight and landing</th><th className="px-2 py-2 font-bold">Design log</th><th className="px-2 py-2 font-bold">Maths mastered</th><th className="px-5 py-2" />
                </tr></thead>
                <tbody>
                  {teams.map((t) => {
                    const s = logSummary(t.log);
                    return (
                      <tr key={t.id} className="border-t border-slate-100 align-top">
                        <td className="px-5 py-3"><button onClick={() => go({ name: 'team', teamId: t.id })} className="font-extrabold text-left hover:underline">{t.name}</button><div className="text-slate-500 text-[12px]">{t.school?.name}</div></td>
                        <td className="px-2 py-3">{t.flight ? <>{t.flight.height_m != null ? `${t.flight.height_m} m` : 'No height'}{t.flight.method ? `, ${t.flight.method}` : ''}<div className="text-slate-500 text-[12px]">{t.flight.landing || ''}</div></> : <span className="text-slate-400">Launch day</span>}</td>
                        <td className="px-2 py-3 tabular-nums">{s.tests} {s.tests === 1 ? 'test' : 'tests'}<div className="text-slate-500 text-[12px]">{s.complete} complete, {s.withPhoto} photos</div></td>
                        <td className="px-2 py-3">{(t.maths || []).map((m) => <div key={m.label}>{t.members.find((x) => x.label === m.label)?.first_name || `Learner ${m.label}`}: <b className="tabular-nums">{(m.mastered || []).length}</b></div>)}</td>
                        <td className="px-5 py-3 text-right"><button onClick={() => { setFlightFor(t.id); setFlight(t.flight || {}); }} className="h-9 px-3 rounded-full bg-slate-100 text-[12px] font-bold whitespace-nowrap">Record flight</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          {flightFor && (
            <Card>
              <span className="font-extrabold text-[17px]">Launch day: {data.teams.find((t) => t.id === flightFor)?.name}</span>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <label className="block"><span className="text-[12.5px] font-bold">Height (m)</span><input type="number" inputMode="decimal" value={flight.height_m ?? ''} onChange={(e) => setFlight({ ...flight, height_m: e.target.value })} className="mt-1 w-full h-11 rounded-xl bg-slate-100 px-3" /></label>
                <label className="block"><span className="text-[12.5px] font-bold">Measured by</span><select value={flight.method ?? ''} onChange={(e) => setFlight({ ...flight, method: e.target.value })} className="mt-1 w-full h-11 rounded-xl bg-slate-100 px-3"><option value="">Choose</option><option value="clinometer">Clinometer and baseline</option><option value="altimeter">Altimeter</option><option value="other">Other</option></select></label>
                <label className="block"><span className="text-[12.5px] font-bold">Landing</span><input value={flight.landing ?? ''} onChange={(e) => setFlight({ ...flight, landing: e.target.value })} placeholder="Parachute opened, landed gently" className="mt-1 w-full h-11 rounded-xl bg-slate-100 px-3" /></label>
              </div>
              <div className="mt-3 flex gap-2"><button onClick={() => setFlightFor(null)} className="h-10 px-4 rounded-full bg-slate-100 text-[13px] font-bold">Cancel</button><button onClick={saveFlight} className="h-10 px-4 rounded-full bg-slate-900 text-white text-[13px] font-bold">Save</button></div>
            </Card>
          )}
          <Card>
            <span className="font-extrabold text-[17px]">Add a team</span>
            <p className="text-[12.5px] text-slate-500 mt-1">The teacher signs up first; their email adds them to the school. The code goes to the two families.</p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input value={nt.schoolName} onChange={(e) => setNt({ ...nt, schoolName: e.target.value })} placeholder="School" list="rocket-schools" className="h-11 rounded-xl bg-slate-100 px-3 text-[14px]" />
              <datalist id="rocket-schools">{data.schools.map((s) => <option key={s.id} value={s.name} />)}</datalist>
              <input value={nt.teamName} onChange={(e) => setNt({ ...nt, teamName: e.target.value })} placeholder="Team name" className="h-11 rounded-xl bg-slate-100 px-3 text-[14px]" />
              <input value={nt.teacherEmail} onChange={(e) => setNt({ ...nt, teacherEmail: e.target.value })} placeholder="Teacher's email" type="email" className="h-11 rounded-xl bg-slate-100 px-3 text-[14px]" />
            </div>
            <button onClick={createTeam} disabled={!nt.schoolName.trim() || !nt.teamName.trim()} className="mt-3 h-10 px-4 rounded-full bg-slate-900 text-white text-[13px] font-bold disabled:opacity-40">Make the team</button>
            {made && <p className="mt-2 text-[13.5px] font-semibold text-[#2A6B52]">{made}</p>}
          </Card>
          {err && <Card><p className="text-[13.5px] text-[#C2255C] font-semibold">{err}</p></Card>}
        </div>

        <div className="space-y-4">
          <Card>
            <div className="flex items-baseline justify-between">
              <span className="font-extrabold text-[17px]">Still to decide</span>
              {!edit && <button onClick={() => setEdit(Object.fromEntries(UNDECIDED.map((u) => [u.key, c?.[u.key] ?? ''])))} className="text-[12.5px] font-bold text-[#C2255C]">Edit</button>}
            </div>
            {!edit ? (
              <dl className="mt-2 space-y-1.5 text-[13.5px]">
                {UNDECIDED.map((u) => <div key={u.key} className="flex justify-between gap-3"><dt className="text-slate-500">{u.label}</dt><dd className={`font-semibold text-right ${c?.[u.key] ? '' : 'text-slate-400'}`}>{u.key.endsWith('_on') && c?.[u.key] ? fmtDay(c[u.key]) : tbc(c?.[u.key])}</dd></div>)}
                <div className="flex justify-between gap-3 pt-1.5 border-t border-slate-100"><dt className="text-slate-500">HOREB help per learner</dt><dd className="font-semibold">US${Number(c?.budget_usd_per_learner ?? 10)}</dd></div>
              </dl>
            ) : (
              <div className="mt-2 space-y-2">
                {UNDECIDED.map((u) => (
                  <label key={u.key} className="block"><span className="text-[12.5px] font-bold">{u.label}</span>
                    <input type={u.key.endsWith('_on') ? 'date' : 'text'} value={edit[u.key] ?? ''} onChange={(e) => setEdit({ ...edit, [u.key]: e.target.value })} className="mt-1 w-full h-10 rounded-xl bg-slate-100 px-3 text-[14px]" />
                  </label>
                ))}
                <div className="flex gap-2 pt-1"><button onClick={() => setEdit(null)} className="h-10 px-4 rounded-full bg-slate-100 text-[13px] font-bold">Cancel</button>
                  <button onClick={() => { saveSettings(Object.fromEntries(Object.entries(edit).map(([k, v]) => [k, String(v).trim() || null]))); }} className="h-10 px-4 rounded-full bg-slate-900 text-white text-[13px] font-bold">Save</button></div>
              </div>
            )}
          </Card>
          <Card>
            <span className="font-extrabold text-[17px]">Deletion requests</span>
            {asks.length === 0 ? <p className="text-[13.5px] text-slate-500 mt-1.5">None.</p> : (
              <ul className="mt-2 space-y-2 text-[13.5px]">
                {asks.map(({ t, m }) => <li key={m.id}><b>{t.name}</b>, Learner {m.label}: asked {fmtDay(m.deletion_requested_at)}.{m.deletion_note ? ` "${m.deletion_note}"` : ''}</li>)}
              </ul>
            )}
            <p className="text-[12px] text-slate-500 mt-2 leading-snug">After the challenge, run rocket_erase_member for each one in the Supabase SQL editor.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ joining
export const CONSENT_TEXT = 'I am this learner\'s parent or guardian. I agree that they take part in the HOREB Rocket Challenge; that HOREB keeps the team\'s chat and design log so the team, their teacher, the organiser and the other learner\'s parents can read them; that no names are sent to the AI; and that I can ask for the data to be deleted after the challenge.';

function JoinTeam({ api, kids = [], reload }) {
  const [code, setCode] = useState('');
  const [child, setChild] = useState(kids[0]?.id || '');
  const [grade, setGrade] = useState(() => {
    const g = /(\d+)/.exec(kids[0]?.grade || '');
    return g && Number(g[1]) >= 6 && Number(g[1]) <= 9 ? Number(g[1]) : 7;
  });
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const join = async () => {
    setBusy(true); setErr('');
    try { await api.join(code.trim(), child || null, Number(grade), consent); await reload(); } catch (e) { setErr(e.message); setBusy(false); }
  };
  return (
    <div className="max-w-[560px] space-y-4">
      <Card className="lg:p-8">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <Eyebrow>Grades 6 to 9 · teams of two</Eyebrow>
            <h1 className="mt-2 text-[30px] font-extrabold leading-[1.05]">Join your team</h1>
            <p className="mt-2 text-[14px] text-slate-600 leading-snug">Your teacher gives you a team code. A parent or guardian joins with it, on the phone or computer the learner will use.</p>
          </div>
          <RocketArt className="w-16 shrink-0" />
        </div>
        <div className="mt-5 space-y-3">
          <label className="block"><span className="text-[13px] font-bold">Team code</span>
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="R4K2X7" className="mt-1 w-full h-12 rounded-2xl bg-slate-100 px-4 text-[17px] font-mono tracking-wider" /></label>
          <label className="block"><span className="text-[13px] font-bold">Who is taking part?</span>
            <select value={child} onChange={(e) => setChild(e.target.value)} className="mt-1 w-full h-12 rounded-2xl bg-slate-100 px-3 text-[15px]">
              {kids.map((c) => <option key={c.id} value={c.id}>{(c.name || '').split(/\s+/)[0]}</option>)}
              <option value="">The learner signed in here (their own login)</option>
            </select></label>
          <label className="block"><span className="text-[13px] font-bold">Grade</span>
            <select value={grade} onChange={(e) => setGrade(e.target.value)} className="mt-1 w-full h-12 rounded-2xl bg-slate-100 px-3 text-[15px]">
              {[6, 7, 8, 9].map((g) => <option key={g} value={g}>Grade {g}</option>)}
            </select></label>
          <label className="flex gap-3 items-start rounded-2xl bg-[#FFF0F5] p-3.5">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 w-5 h-5 shrink-0" />
            <span className="text-[13px] leading-snug">{CONSENT_TEXT}</span>
          </label>
        </div>
        {err && <p className="mt-3 text-[13px] text-[#C2255C] font-semibold">{err}</p>}
        <button onClick={join} disabled={busy || !consent || code.trim().length < 4} className="mt-5 w-full h-14 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[17px] disabled:opacity-40">{busy ? 'Joining' : 'Join the team'}</button>
      </Card>
      <SafetyCard compact />
    </div>
  );
}

export default RocketChallenge;
