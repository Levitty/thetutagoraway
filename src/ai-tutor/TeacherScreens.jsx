// ============================================================================
// THE TEACHER SCREENS (4 Nov 2026)
//
// Built from the preview the owner approved ("yes build it into horeb"), in the
// manner of the Edu.ai co-teacher reference: a calm workspace where HOREB's
// findings sit inside the work, never a chatbot, and every suggestion carries
// a reason, where it came from and how sure HOREB is.
//
// Layout only. Every number and sentence is made by teacherInsights.js and the
// engine from the learners' own records; this file decides where it goes.
// Styles: the .tt block at the end of horeb-look.css.
// ============================================================================
import React, { useMemo, useState } from 'react';
import { lastSeenLabel } from './classView.js';
import { fiveMinuteMove } from './teacherMoves.js';

// ---- icons: Lucide paths, one stroke, one size ------------------------------
const PATHS = {
  home: <><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  list: <><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></>,
  rocket: <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></>,
  chev: <path d="m9 18 6-6-6-6" />,
  left: <path d="m15 18-6-6 6-6" />,
  cal: <><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  file: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></>,
};
export const TIcon = ({ name, style }) => (
  <svg className="tt-i" viewBox="0 0 24 24" aria-hidden="true" style={style}>{PATHS[name]}</svg>
);

// ---- small parts ------------------------------------------------------------
export const initials = (name) => String(name || '?').replace(/\(.*?\)/g, '').trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?';
export const shortName = (name) => {
  const w = String(name || '').trim().split(/\s+/);
  return w.length > 1 ? `${w[0]} ${w[w.length - 1][0]}.` : (w[0] || 'Learner');
};
/** "Grade 6 Blue" -> "6B"; anything else -> its first two letters. */
export const classCode = (name) => {
  const m = String(name || '').match(/(\d+)\s*([A-Za-z])?/);
  if (m) return `${m[1]}${(m[2] || '').toUpperCase()}`;
  return String(name || '?').slice(0, 2).toUpperCase();
};
// The UI uses no em dashes; older advice strings carry some.
export const noDash = (t) => (t == null ? t : String(t).replace(/\s*\u2014\s*/g, ', '));
const plainClass = (name) => String(name || '').replace(/\s*\(demo\)\s*$/i, '');

export const Src = ({ children }) => children ? <span className="tt-src"><TIcon name="file" />{children}</span> : null;
export const Pill = ({ tone, children, style }) => <span className={`tt-pill${tone ? ` tt-${tone}` : ''}`} style={style}>{children}</span>;
const Av = ({ name }) => <span className="tt-av">{initials(name)}</span>;

const Why = ({ open, items }) => (
  <dl className={`tt-why${open ? ' tt-open' : ''}`}>
    {items.filter(([, v]) => v).map(([k, v]) => (
      <React.Fragment key={k}><dt>{k}</dt><dd>{noDash(v)}</dd></React.Fragment>
    ))}
  </dl>
);

const greeting = (d = new Date()) => (d.getHours() < 12 ? 'Good morning' : d.getHours() < 17 ? 'Good afternoon' : 'Good evening');
const dayLabel = (d = new Date()) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

// ---- the frame --------------------------------------------------------------
const NAV = [
  { id: 'home', label: 'Home', short: 'Home', icon: 'home' },
  { id: 'class', label: 'Classes', short: 'Class', icon: 'users' },
  { id: 'practice', label: 'Set practice', short: 'Practice', icon: 'list' },
  { id: 'rocket', label: 'Rocket Challenge', short: 'Rocket', icon: 'rocket' },
];

/**
 * One solid labelled sidebar on a laptop (the owner's rule since 1 Nov), a
 * dark tab bar on a phone. `classes` is [{ id, name, size }].
 */
export function TeacherShell({ active, onNav, classes = [], onOpenClass, activeClassId, teacherName, teacherLine, demoNote, children }) {
  return (
    <div className="tt tt-app">
      <aside className="tt-side">
        <div className="tt-brand"><span className="tt-mk">H</span>HOREB</div>
        <div className="tt-lbl">Teaching</div>
        {NAV.map(n => (
          <button key={n.id} className={`tt-nav${active === n.id ? ' tt-on' : ''}`} onClick={() => onNav(n.id)}>
            <span className="tt-tile"><TIcon name={n.icon} /></span>{n.label}
          </button>
        ))}
        {classes.length > 0 && <>
          <hr />
          <div className="tt-lbl">My classes</div>
          {classes.map(c => (
            <button key={c.id} className="tt-cls" onClick={() => onOpenClass && onOpenClass(c.id)}
              aria-current={activeClassId === c.id && active === 'class' ? 'page' : undefined}>
              <span className="tt-code">{classCode(c.name)}</span>
              <span><b>{plainClass(c.name)}</b>{c.size != null && <small>{c.size} {c.size === 1 ? 'learner' : 'learners'}</small>}</span>
            </button>
          ))}
        </>}
        <div className="tt-foot">Mathematics · CBC</div>
      </aside>
      <main style={{ minWidth: 0 }}>
        <div className="tt-top">
          <div className="tt-brandm"><span className="tt-mk">H</span>HOREB</div>
          {demoNote && <Pill tone="am">{demoNote}</Pill>}
          <div className="tt-chip-top"><TIcon name="cal" />{dayLabel()}</div>
          <div className="tt-me"><span className="tt-av">{initials(teacherName)}</span><div><b>{teacherName}</b>{teacherLine && <small>{teacherLine}</small>}</div></div>
        </div>
        {children}
      </main>
      <nav className="tt-tabbar" aria-label="Teaching">
        {NAV.map(n => (
          <button key={n.id} className={active === n.id ? 'tt-on' : ''} onClick={() => onNav(n.id)}>
            <TIcon name={n.icon} />{n.short}
          </button>
        ))}
      </nav>
    </div>
  );
}

// The violet panel: HOREB's one suggestion on a screen, with its reason.
export function SuggestPanel({ title, body, why, inner, innerLabel, foot, action, onAction, onDismiss }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="tt-panel">
      <div className="tt-tag"><span>HOREB suggests</span>{why && <button onClick={() => setOpen(o => !o)}>Why this?</button>}</div>
      <h3>{title}</h3>
      {body && <p>{body}</p>}
      {why && <Why open={open} items={why} />}
      {inner && <div className="tt-inner"><small>{innerLabel}</small>{inner}</div>}
      {foot && <div className="tt-psrc">{foot}</div>}
      {action && <button className="tt-btn tt-yellow" onClick={onAction}>{action}</button>}
      {onDismiss && <button className="tt-btn tt-ghost" onClick={onDismiss}>Not now</button>}
    </div>
  );
}

// ---- 1. home ------------------------------------------------------------------
/**
 * rows: [{ id, name, size, headline }] (headline from classHeadline, or null)
 * suggestion: homeSuggestion() or null
 * workSet: [{ id, title, className, audience, done, count, due, overdue, children }]
 * quiet: [{ id, name, className, days }]
 */
export function TeacherHome({ teacherName, rows, suggestion, onSuggest, workSet, quiet, onOpenClass, extra }) {
  const [openWhy, setOpenWhy] = useState(null);
  const [hidden, setHidden] = useState(false);
  const stuck = rows.filter(r => r.headline);
  const top = stuck[0];
  const others = stuck.length - 1;
  return (
    <section className="tt-screen tt-on">
      <div className="tt-grid2">
        <div className="tt-stack">
          <div className="tt-card tt-hello">
            <h1>{greeting()}, {teacherName}</h1>
            <p className="tt-lead">
              {top
                ? <>{plainClass(top.name)} is held up at one step: {top.headline.skill.name}.{others > 0 && <> {others === 1 ? 'One other class has' : `${others} other classes have`} a gap too.</>}</>
                : rows.length ? 'Nothing is blocking any of your classes.' : 'Create a class and give its code to your learners. Their work appears here as soon as they practise.'}
            </p>
          </div>

          {rows.length > 0 && (
            <div className="tt-card">
              <div className="tt-head-row"><h2>Where each class is stuck</h2><span className="tt-sub">Now</span></div>
              <p className="tt-sub">One skill per class, the one that would unblock the most learners.</p>
              {rows.map(r => {
                const h = r.headline;
                const k = `w-${r.id}`;
                return (
                  <div className="tt-crow" key={r.id}>
                    <span className="tt-code">{classCode(r.name)}</span>
                    <div>
                      <div className="tt-meta">{plainClass(r.name)} · {r.size} {r.size === 1 ? 'learner' : 'learners'}</div>
                      <div className="tt-skill">{h ? h.skill.name : 'Nothing blocking'}</div>
                      <div className="tt-why-line">{h ? h.line : 'No foundation below their grade is missing.'}</div>
                      {h && <>
                        <div className="tt-foot">
                          <Src>{h.evidence.source}</Src>
                          <button className="tt-whyb" onClick={() => setOpenWhy(o => (o === k ? null : k))}>Why this?</button>
                        </div>
                        <Why open={openWhy === k} items={[
                          ['The reason', h.reason],
                          ['Where it came from', h.evidence.source ? `Their own records: ${h.evidence.source.toLowerCase()}.` : null],
                          ['How sure', h.evidence.sure],
                        ]} />
                      </>}
                    </div>
                    <button className="tt-go" onClick={() => onOpenClass(r.id)} aria-label={`Open ${plainClass(r.name)}`}><TIcon name="chev" /></button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="tt-stack">
          {suggestion && !hidden && (
            <SuggestPanel
              title={`Set ${suggestion.skill.name} for the ${suggestion.ids.length} in ${plainClass(suggestion.className)}.`}
              body={suggestion.above ? `They cannot do ${suggestion.above.name} until ${suggestion.skill.name} is in place.` : 'It comes before work they are failing.'}
              why={[
                ['The reason', suggestion.above ? `HOREB's knowledge graph puts ${suggestion.skill.name} before ${suggestion.above.name}. None of the ${suggestion.ids.length} has mastered it.` : null],
                ['Where it came from', suggestion.evidence?.source],
                ['How sure', suggestion.evidence?.sure],
              ]}
              innerLabel="Away from the screen"
              inner={noDash(fiveMinuteMove(suggestion.skill))}
              foot={`Done when each of the ${suggestion.ids.length} masters it in their own practice.`}
              action={`Set practice for the ${suggestion.ids.length}`}
              onAction={onSuggest}
              onDismiss={() => setHidden(true)}
            />
          )}

          {workSet.length > 0 && (
            <div className="tt-card">
              <div className="tt-head-row"><h2>Work set</h2><Pill tone="am">{workSet.length} open</Pill></div>
              {workSet.map(w => (
                <div className="tt-wrow" key={w.id}>
                  <b>{w.title}</b>
                  <div className="tt-sub">{plainClass(w.className)} · {w.audience}</div>
                  {w.count > 10 && <div className="tt-bar"><i style={{ width: `${w.count ? Math.round((w.done / w.count) * 100) : 0}%` }} /></div>}
                  <div className="tt-row">
                    {w.count <= 10 && <span className="tt-dots">{Array.from({ length: w.count }, (_, i) => <i key={i} className={i < w.done ? 'tt-f' : ''} />)}</span>}
                    <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginLeft: w.count <= 10 ? 0 : undefined }}>
                      <Pill tone="gr">{w.done} of {w.count} {w.done === 1 && w.count === 1 ? 'has' : 'have'} mastered it</Pill>
                      {w.due && <Pill tone="am">{w.due}</Pill>}
                    </span>
                  </div>
                  {w.children}
                </div>
              ))}
              <p className="tt-sub" style={{ marginTop: 8 }}>Done means mastered in their own practice. Nothing to mark.</p>
            </div>
          )}

          {quiet.length > 0 && (
            <div className="tt-card tt-dashed">
              <div className="tt-head-row"><h2>Gone quiet</h2></div>
              <p className="tt-sub">No practice for 7 days or more.</p>
              {quiet.slice(0, 6).map(q => (
                <div className="tt-row" key={q.id} style={{ marginTop: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Av name={q.name} />{q.name}</span>
                  <span className="tt-sub">{plainClass(q.className)} · {lastSeenLabel(q.days)}</span>
                </div>
              ))}
            </div>
          )}
          {extra}
        </div>
      </div>
      <p className="tt-note"><b>How this works.</b> Every line above comes from your learners' own answers: the free check, their practice and the work you set. HOREB names a skill only when the answers show it.</p>
    </section>
  );
}

// ---- 2. one class -----------------------------------------------------------------
const GROUP_REASON = {
  foundation: 'Never mastered it, and failing the work that needs it.',
  struggling: 'Have the foundation, and are getting the new step wrong.',
};

/**
 * groups: missingStepGroups(); pattern: groupPattern() or null (or 'loading').
 */
export function ClassScreen({ cls, size, groups, pattern, patternFor, quiet, onBack, onPractice, onOpenLearner, setup }) {
  const held = groups.filter(g => g.kind !== 'clear');
  const heldN = held.reduce((t, g) => t + g.learners.length, 0);
  const clear = groups.find(g => g.kind === 'clear');
  return (
    <section className="tt-screen tt-on">
      <div className="tt-card" style={{ marginBottom: 20 }}>
        <div className="tt-ghead">
          <button className="tt-back" onClick={onBack} aria-label="Back"><TIcon name="left" /></button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="tt-crumb">Classes · Mathematics</div>
            <h1>{plainClass(cls.name)}</h1>
          </div>
          {held.length > 0 && <button className="tt-btn tt-dark" onClick={() => onPractice(held[0])}>Set practice</button>}
        </div>
        <p className="tt-lead">
          {size === 0 ? 'No learners have joined yet. Give them the join code below.'
            : <>{heldN > 0 && <>{heldN} {heldN === 1 ? 'learner is' : 'learners are'} held up at {held.length === 1 ? 'one step' : `${held.length} steps`}. </>}{clear ? `${clear.learners.length} ${clear.learners.length === 1 ? 'has' : 'have'} nothing blocking them.` : ''}</>}
        </p>
      </div>

      <div className="tt-grid2">
        <div className="tt-stack">
          {groups.length > 0 && (
            <div className="tt-card">
              <div className="tt-head-row"><h2>By the step they are missing</h2><span className="tt-sub">{size} learners</span></div>
              <p className="tt-sub">Grouped by what to teach, not ranked.</p>
              {groups.map(g => g.kind === 'clear' ? (
                <div className="tt-group" key={g.key}>
                  <div className="tt-gl"><Pill tone="gr">Nothing blocking · {g.learners.length} {g.learners.length === 1 ? 'learner' : 'learners'}</Pill></div>
                  <div className="tt-gt"><b>{g.next ? `Working on ${g.next} next` : 'Nothing below their grade is missing'}</b></div>
                  {g.ahead > 0 && <p className="tt-reason">{g.ahead} of them {g.ahead === 1 ? 'is' : 'are'} working above their grade.</p>}
                  <div className="tt-avs" style={{ marginTop: 14 }}>
                    {g.learners.map(l => (
                      <button key={l.id} className="tt-av" title={l.name} onClick={() => onOpenLearner(l.id)}>{initials(l.name)}</button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="tt-group" key={g.key}>
                  <div className="tt-gl"><Pill tone="vt">{g.kind === 'foundation' ? 'Missing a foundation' : 'Struggling now'} · {g.learners.length} {g.learners.length === 1 ? 'learner' : 'learners'}</Pill></div>
                  <div className="tt-gt"><b>{g.skill.name}</b>{g.skill.grade != null && <Pill tone="out">Grade {g.skill.grade}</Pill>}</div>
                  <p className="tt-reason">{GROUP_REASON[g.kind]}</p>
                  <div className="tt-learners">
                    {g.learners.map(l => (
                      <button className="tt-lr" key={l.id} onClick={() => onOpenLearner(l.id)} style={{ textAlign: 'left' }}>
                        <span className="tt-av">{initials(l.name)}</span>
                        <span><b>{shortName(l.name)}</b><small className={l.quiet ? 'tt-qt' : ''}>{lastSeenLabel(l.days)}</small></span>
                      </button>
                    ))}
                  </div>
                  <div className="tt-gfoot">
                    <Src>{[g.evidence.source, g.evidence.sure].filter(Boolean).join(' · ')}</Src>
                    <button className="tt-btn tt-line" onClick={() => onPractice(g)}>Set practice for the {g.learners.length}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {setup}
        </div>

        <div className="tt-stack">
          {held.length > 0 && (
            <div className="tt-card">
              <div className="tt-head-row"><h2>Where they went wrong</h2></div>
              <p className="tt-sub">The answers behind {patternFor}.</p>
              {pattern === 'loading' && <p className="tt-sub" style={{ marginTop: 14 }}>Reading their answers.</p>}
              {pattern && pattern !== 'loading' && <>
                <p style={{ marginTop: 16, fontWeight: 600 }}>{pattern.label}</p>
                <p style={{ marginTop: 4 }}><Pill tone="vt">Seen in {pattern.learners} of the {pattern.of}</Pill></p>
                {pattern.examples.map((w, i) => (
                  <div className="tt-answer" key={i}><span>The answer was {w.expected}</span><span>wrote <s>{w.submitted}</s></span></div>
                ))}
                {pattern.advice && <dl className="tt-why tt-open" style={{ marginTop: 14 }}><dt>What to do</dt><dd>{noDash(pattern.advice)}</dd></dl>}
                <p style={{ marginTop: 14 }}><Src>{pattern.source === 'answers' ? 'Their wrong answers' : 'Their practice records'}</Src></p>
              </>}
              {!pattern && <p className="tt-sub" style={{ marginTop: 14 }}>Their wrong answers do not show one pattern yet.</p>}
            </div>
          )}
          {quiet.length > 0 && (
            <div className="tt-card tt-dashed">
              <h2>Gone quiet</h2>
              <p className="tt-sub">No practice for 7 days or more.</p>
              <div className="tt-learners" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {quiet.map(l => (
                  <button className="tt-lr" key={l.id} onClick={() => onOpenLearner(l.id)} style={{ textAlign: 'left' }}>
                    <span className="tt-av">{initials(l.name)}</span>
                    <span><b>{shortName(l.name)}</b><small className="tt-qt">{lastSeenLabel(l.days)}</small></span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ---- 3. set practice ------------------------------------------------------------
const nextWeekdays = (n = 3, from = new Date()) => {
  const out = [];
  const d = new Date(from);
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d));
  }
  return out;
};
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * versions: practiceVersions(); learnersById: Map id -> { name };
 * examples: { [skillId]: generated problem or null }; onSet(versions, dueOn).
 */
export function PracticeScreen({ cls, core, versions, learnersById, examples, sources, canChoose, onBack, onSet, done, error }) {
  const days = useMemo(() => nextWeekdays(3), []);
  const [due, setDue] = useState(1);
  const [off, setOff] = useState(() => new Set());
  const [busy, setBusy] = useState(false);
  const chosen = versions.filter(v => !off.has(v.kind));
  const total = chosen.reduce((t, v) => t + v.learnerIds.length, 0);
  const strand = core?.curricula?.cbc ? `${core.curricula.cbc.strand}, ${core.curricula.cbc.substrand}` : core?.strand;
  const n = versions.length;
  const word = ['No versions', 'One version', 'Two versions', 'Three versions'][n] || `${n} versions`;
  const small = { support: () => `Missing ${versions.find(v => v.kind === 'support')?.skill.name}`, core: () => 'Ready for the new step', stretch: () => `Already mastered ${core?.name}` };
  const dueText = days[due].toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  return (
    <section className="tt-screen tt-on">
      <div className="tt-card" style={{ marginBottom: 20 }}>
        <div className="tt-ghead">
          <button className="tt-back" onClick={onBack} aria-label="Back"><TIcon name="left" /></button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="tt-crumb">{plainClass(cls.name)} · Set practice</div>
            <h1>{word}, one goal</h1>
          </div>
        </div>
        <p className="tt-lead">Every learner in {plainClass(cls.name)} works towards {core?.name}, from where they are.</p>
      </div>

      <div className="tt-p-grid">
        <div className="tt-card">
          <h2>Who gets which</h2>
          <p className="tt-sub">From the class groups. Untick a version to leave it out.</p>
          {versions.map(v => (
            <button className="tt-who" key={v.kind} style={{ width: '100%', textAlign: 'left' }} aria-pressed={!off.has(v.kind)}
              onClick={() => setOff(s => { const x = new Set(s); if (x.has(v.kind)) x.delete(v.kind); else x.add(v.kind); return x; })}>
              <span className="tt-n">{v.learnerIds.length}</span>
              <span><b>{v.label[0] + v.label.slice(1).toLowerCase()}</b><small>{small[v.kind]()}</small></span>
              <span className="tt-tick" style={off.has(v.kind) ? { background: 'var(--line)' } : undefined}>{!off.has(v.kind) && <TIcon name="check" />}</span>
            </button>
          ))}
          <div className="tt-fld"><b>Due</b>
            <div className="tt-seg" role="radiogroup" aria-label="Due">
              {days.map((d, i) => (
                <span key={i} role="radio" aria-checked={due === i} tabIndex={0} className={due === i ? 'tt-on' : ''}
                  onClick={() => setDue(i)} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setDue(i)} style={{ cursor: 'pointer' }}>
                  {d.toLocaleDateString('en-GB', { weekday: 'short' })} {d.getDate()}
                </span>
              ))}
            </div>
          </div>
          <div className="tt-fld"><b>Done when</b>
            <p className="tt-sub" style={{ marginTop: 6 }}>Each learner masters their version in their own practice. HOREB then moves them on.</p>
          </div>
          {sources && <p style={{ marginTop: 22 }}><Src>Groups come from {sources.toLowerCase()}</Src></p>}
        </div>

        <div className="tt-card">
          <div className="tt-head-row"><h2>Side by side</h2></div>
          {strand && <p className="tt-sub">Same goal, same CBC strand: {strand}.</p>}
          <div className="tt-versions">
            {versions.map(v => {
              const ex = examples[v.skill.id];
              const ticks = [
                v.skill.grade != null && `Grade ${v.skill.grade} questions`,
                ex?.model?.type === 'bar-model' && 'Shown with a bar model',
                'Hints after a wrong answer',
                v.kind === 'support' && `Then ${core?.name} once mastered`,
                v.kind === 'core' && 'Marked right in any fair form',
                v.kind === 'stretch' && 'The next skill opens once mastered',
              ].filter(Boolean);
              const who = v.learnerIds.map(id => learnersById.get(id)).filter(Boolean);
              return (
                <div className={`tt-ver tt-${v.kind === 'support' ? 'sup' : v.kind === 'stretch' ? 'str' : 'core'}`} key={v.kind}
                  style={off.has(v.kind) ? { opacity: 0.45 } : undefined}>
                  <div className="tt-vh"><div className="tt-vk">{v.label}</div><div className="tt-vt">{v.skill.name}</div><div className="tt-vd">{v.role}</div></div>
                  <div className="tt-vb">
                    {v.skill.grade != null && <Pill tone="out" style={{ alignSelf: 'flex-start' }}>Grade {v.skill.grade}</Pill>}
                    {ex?.question && <div className="tt-q"><small>Example question</small><div>{ex.question.replace(/\s{2,}/g, ' ')}</div></div>}
                    <ul className="tt-checks">{ticks.map(t => <li key={t}><TIcon name="check" />{t}</li>)}</ul>
                    <div className="tt-vwhy"><small>Why this version</small>{v.why}</div>
                    <div className="tt-vf"><span className="tt-avs">{who.slice(0, 3).map(l => <span className="tt-av" key={l.id}>{initials(l.name)}</span>)}</span>{who.length} {who.length === 1 ? 'learner' : 'learners'}</div>
                  </div>
                </div>
              );
            })}
          </div>
          {done ? (
            <div className="tt-ready"><div><b>Set: {done} for {plainClass(cls.name)}</b><small>It is in Work set on Home.</small></div>
              <button className="tt-btn tt-yellow" onClick={onBack}>Back to the class</button></div>
          ) : (
            <div className="tt-ready">
              <div><b>Ready: {chosen.length} {chosen.length === 1 ? 'version' : 'versions'} for {total} {total === 1 ? 'learner' : 'learners'}</b>
                <small>{canChoose ? `Due ${dueText}` : 'Choosing learners needs the 28 Oct database update.'}</small></div>
              <button className="tt-btn tt-yellow" disabled={busy || !canChoose || !chosen.length}
                style={busy || !canChoose || !chosen.length ? { opacity: 0.5 } : undefined}
                onClick={async () => { setBusy(true); await onSet(chosen, iso(days[due])); setBusy(false); }}>
                {busy ? 'Setting' : 'Set practice'}
              </button>
            </div>
          )}
          {error && <p className="tt-sub" style={{ marginTop: 10, color: 'var(--am-ink)' }}>{error}</p>}
        </div>
      </div>
    </section>
  );
}
