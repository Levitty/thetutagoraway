import React, { useEffect, useMemo, useState } from 'react';
import { HALF_HOUR_LESSONS } from './features.js';
import { supabase } from '../supabase.js';
import { PaymentModal } from '../PaymentModal.jsx';
import { startConversation } from '../Messaging.jsx';
import { requestPush } from '../push.js';
import { SiteNav, SiteFooter, SiteIcon, TutorPhoto, shortName, tutorSubjects, gradeLevels, ksh, photoFirst } from './ui.jsx';
import { getFocus, setFocus, getCheck } from './Check.jsx';

const SUBJECTS = ['Mathematics', 'English', 'Kiswahili', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer Science', 'Business Studies'];
const GRADES = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Form 1', 'Form 2', 'Form 3', 'Form 4', 'University'];
const PRICES = [
  { v: 'all', label: 'Any price' },
  { v: '0-1000', label: 'Under KSh 1,000' },
  { v: '1000-1500', label: 'KSh 1,000 – 1,500' },
  { v: '1500-2000', label: 'KSh 1,500 – 2,000' },
  { v: '2000+', label: 'KSh 2,000+' },
];
// Lesson lengths. Price scales with the tutor's hourly rate.
export const LENGTHS = [{ min: 30, label: '30 min' }, { min: 60, label: '1 hour' }];
export const lessonPrice = (hourlyRate, minutes) => Math.round((Number(hourlyRate) || 0) * (minutes || 60) / 60);

const FocusBanner = ({ focus, onClear }) => focus ? (
  <div className="fromcheck"><SiteIcon name="target" />From {focus.learner ? `${focus.learner}'s` : 'the'} check: {focus.skill.toLowerCase()} <button type="button" onClick={onClear}>Clear</button></div>
) : null;

const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fmtTime = (hhmm) => { const [h] = hhmm.split(':').map(Number); const ap = h >= 12 ? 'pm' : 'am'; return `${((h + 11) % 12) + 1}:00 ${ap}`; };
// The tutor's next open hour in the coming week, from their weekly hours.
// (Booked slots aren't known here; the profile page hides those.)
const nextFree = (t) => {
  if (!Array.isArray(t.availability) || !t.availability.length) return null;
  const now = new Date();
  for (let i = 0; i < 8; i++) {
    const d = new Date(now); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i);
    const hours = t.availability.filter(a => a.day_of_week === d.getDay())
      .flatMap(a => { const out = []; for (let h = parseInt(a.start_time, 10); h < parseInt(a.end_time, 10); h++) out.push(h); return out; })
      .filter(h => i > 0 || h > now.getHours()).sort((a, b) => a - b);
    if (hours.length) return `${i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DAY[d.getDay()]} ${fmtTime(`${hours[0]}:00`)}`;
  }
  return null;
};

export function TutorList({ tutors, loading, onSelect, onNavigate, onSignIn, user, extra }) {
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [price, setPrice] = useState('all');
  const [sort, setSort] = useState('lessons');
  const [focus, setFocusState] = useState(() => getFocus());

  const list = useMemo(() => tutors
    .filter(t => {
      const q = search.trim().toLowerCase();
      if (q && !(`${t.profiles?.full_name || ''} ${t.subject || ''} ${t.headline || ''} ${tutorSubjects(t).join(' ')}`.toLowerCase().includes(q))) return false;
      if (subject && !tutorSubjects(t).includes(subject)) return false;
      if (grade && !gradeLevels(t.grade_levels).includes(grade)) return false;
      const rate = Number(t.hourly_rate) || 0;
      if (price === '0-1000' && !(rate < 1000)) return false;
      if (price === '1000-1500' && !(rate >= 1000 && rate < 1500)) return false;
      if (price === '1500-2000' && !(rate >= 1500 && rate < 2000)) return false;
      if (price === '2000+' && !(rate >= 2000)) return false;
      return true;
    })
    .sort((a, b) => {
      const byPhoto = photoFirst(a, b);
      if (byPhoto) return byPhoto;
      if (sort === 'price-low') return (a.hourly_rate || 0) - (b.hourly_rate || 0);
      if (sort === 'price-high') return (b.hourly_rate || 0) - (a.hourly_rate || 0);
      return (b.lessons_completed || 0) - (a.lessons_completed || 0);
    }), [tutors, search, subject, grade, price, sort]);

  return (
    <div className="tg t-amber">
      <header className="thero">
        <SiteNav onNavigate={onNavigate} onSignIn={onSignIn} user={user} current="tutors" />
        <div className="in">
          <h1 className="display">A tutor for exactly the stuck part.</h1>
          <div className="filters">
            <label className="fsel" style={{ flex: '2 1 220px' }}><span>Search</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name or subject" /></label>
            <label className="fsel"><span>Subject</span><select value={subject} onChange={e => setSubject(e.target.value)}><option value="">All subjects</option>{SUBJECTS.map(s => <option key={s}>{s}</option>)}</select></label>
            <label className="fsel"><span>Grade</span><select value={grade} onChange={e => setGrade(e.target.value)}><option value="">All grades</option>{GRADES.map(g => <option key={g}>{g}</option>)}</select></label>
            <label className="fsel"><span>Price per hour</span><select value={price} onChange={e => setPrice(e.target.value)}>{PRICES.map(p => <option key={p.v} value={p.v}>{p.label}</option>)}</select></label>
            <label className="fsel"><span>Sort by</span><select value={sort} onChange={e => setSort(e.target.value)}><option value="lessons">Most lessons</option><option value="price-low">Price: low first</option><option value="price-high">Price: high first</option></select></label>
          </div>
          <FocusBanner focus={focus} onClear={() => { setFocus(null); setFocusState(null); }} />
        </div>
      </header>

      <section><div className="in">
        <div className="listhead"><b>{loading ? 'Loading tutors…' : `${list.length} tutor${list.length === 1 ? '' : 's'}`}</b><span className="fine">Every tutor here was checked by our team.</span></div>
        {!loading && list.length === 0 && (
          <div className="empty"><p className="sub" style={{ margin: '0 auto 16px' }}>No tutors match those filters.</p><button type="button" className="btn line" onClick={() => { setSearch(''); setSubject(''); setGrade(''); setPrice('all'); }}>Clear filters</button></div>
        )}
        {list.map(t => {
          const langs = Array.isArray(t.languages) ? t.languages : t.languages ? [t.languages] : [];
          const grades = gradeLevels(t.grade_levels);
          return (
            <div className="trow" key={t.id}>
              <div className="ph" onClick={() => onSelect(t)} role="presentation"><TutorPhoto tutor={t} /></div>
              <div style={{ minWidth: 0 }}>
                <h3><button type="button" onClick={() => onSelect(t)}>{shortName(t.profiles?.full_name)}</button> <span className="badge"><SiteIcon name="check" />Checked</span></h3>
                {t.headline && <div className="hl">{t.headline}</div>}
                <div className="meta">
                  <span><SiteIcon name="cap" />{tutorSubjects(t).slice(0, 3).join(', ')}{grades.length ? ` · ${grades[0]}${grades.length > 1 ? ` to ${grades[grades.length - 1]}` : ''}` : ''}</span>
                  {langs.length > 0 && <span><SiteIcon name="globe" />{langs.join(', ')}</span>}
                  {t.experience_years ? <span><SiteIcon name="clock" />{t.experience_years} years teaching</span> : null}
                </div>
                {(() => { const nf = nextFree(t); return <div className={`nextfree${nf ? '' : ' none'}`}><SiteIcon name="calendar" />{nf ? <>Next free: <b>{nf}</b></> : 'No open times this week'}</div>; })()}
                {t.bio && <p className="bio">{t.bio}</p>}
              </div>
              <div className="side">
                <div className="price">{ksh(t.hourly_rate)} <small>/ hour</small></div>
                <div className="stat">{t.lessons_completed ? `${t.lessons_completed} lessons on Tutagora` : 'New on Tutagora'}{HALF_HOUR_LESSONS && t.offers_30_min ? ` · 30 min from ${ksh(lessonPrice(t.hourly_rate, 30))}` : ''}</div>
                <button type="button" className="btn" onClick={() => onSelect(t)}>Book</button>
              </div>
            </div>
          );
        })}
        <div style={{ height: 40 }} />
      </div></section>
      {extra}
      <SiteFooter onNavigate={onNavigate} />
    </div>
  );
}



const DRAFT = 'tg_book_draft';
const readDraft = (tutorId) => {
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT) || 'null');
    if (!d || String(d.tutorId) !== String(tutorId) || Date.now() - d.at > 2 * 3600e3) return null;
    // A day that has already passed is dropped; the rest is kept.
    if (d.date && new Date(`${d.date}T23:59:59`) < new Date()) { d.date = null; d.time = null; }
    return d;
  } catch { return null; }
};
const saveDraft = (tutorId, d) => { try { localStorage.setItem(DRAFT, JSON.stringify({ ...d, tutorId, at: Date.now() })); } catch { /* ignore */ } };
const clearDraft = () => { try { localStorage.removeItem(DRAFT); } catch { /* ignore */ } };

export function TutorProfile({ tutor, user, onBack, onBook, onNavigate, onSignIn, onPaid }) {
  const focus = getFocus();
  const check = getCheck();
  // A booking started before signing in (day, time, learner) is picked up
  // again when the parent comes back, so they don't choose everything twice.
  const draft = useMemo(() => readDraft(tutor.id), [tutor.id]);
  const subjects = tutorSubjects(tutor);
  const [subject, setSubject] = useState(draft?.subject || subjects[0] || tutor.subject || '');
  const [date, setDate] = useState(() => draft?.date ? new Date(`${draft.date}T00:00:00`) : null);
  const [time, setTime] = useState(draft?.time || null);
  const [minutes, setMinutes] = useState(draft?.minutes || 60);
  const [children, setChildren] = useState([]);
  const [childId, setChildId] = useState(null);
  // The child from the free check fills in the form, so it isn't asked twice.
  const [learnerName, setLearnerName] = useState(draft?.name || focus?.learner || check?.name || '');
  const [learnerGrade, setLearnerGrade] = useState(draft?.grade || (check?.grade ? `Grade ${check.grade}` : ''));
  const [focusNote, setFocusNote] = useState(draft?.note ?? (focus?.skill ? `${focus.skill} (from the Tutagora check)` : ''));
  const [reviews, setReviews] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [pending, setPending] = useState(null);
  // Lessons are an hour. A tutor can also offer 30 minutes (their choice, in
  // their profile); the flag only exists once the lesson-length SQL has run.
  const halfHourOk = HALF_HOUR_LESSONS && tutor.offers_30_min === true;

  useEffect(() => {
    supabase.from('reviews').select('*, profiles:student_id(full_name)').eq('tutor_id', tutor.id)
      .order('created_at', { ascending: false }).limit(10).then(({ data }) => setReviews(data || []));
  }, [tutor.id]);

  useEffect(() => {
    if (!user?.id) { setChildren([]); return; }
    supabase.from('children').select('id, name, grade').eq('parent_id', user.id).order('created_at').then(({ data }) => {
      const kids = data || [];
      setChildren(kids);
      if (!kids.length) return;
      // Prefer the child the check was for; otherwise the first saved child.
      const want = (draft?.name || focus?.learner || check?.name || '').trim().toLowerCase();
      const match = want && kids.find(k => k.name.trim().toLowerCase() === want);
      const k = match || kids[0];
      setChildId(k.id); setLearnerName(k.name); setLearnerGrade(k.grade || learnerGrade || '');
    });
  }, [user?.id]);

  const days = useMemo(() => Array.from({ length: 8 }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i); return d; }), []);
  const isoDay = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  // Times already booked (paid, or being paid for right now) are hidden. Needs
  // the taken_slots database function; without it, nothing is hidden and the
  // database rule still stops a clash at booking time.
  const [taken, setTaken] = useState(() => new Set());
  const loadTaken = () => {
    supabase.rpc('taken_slots', { p_tutor: String(tutor.id), p_from: isoDay(days[0]), p_to: isoDay(days[days.length - 1]) })
      .then(({ data, error }) => { if (!error && Array.isArray(data)) setTaken(new Set(data.map(r => `${r.lesson_date}|${String(r.start_time).slice(0, 5)}`))); });
  };
  useEffect(loadTaken, [tutor.id]);
  const slotsFor = (d) => {
    if (!d || !Array.isArray(tutor.availability)) return [];
    const now = new Date();
    const today = d.toDateString() === now.toDateString();
    return tutor.availability.filter(a => a.day_of_week === d.getDay()).flatMap(a => {
      const out = [];
      let h = parseInt(a.start_time, 10);
      const end = parseInt(a.end_time, 10);
      for (; h < end; h++) {
        const t = `${String(h).padStart(2, '0')}:00`;
        if ((!today || h > now.getHours()) && !taken.has(`${isoDay(d)}|${t}`)) out.push(t);
      }
      return out;
    }).sort();
  };
  const slots = slotsFor(date);
  const price = lessonPrice(tutor.hourly_rate, minutes);
  const langs = Array.isArray(tutor.languages) ? tutor.languages : tutor.languages ? [tutor.languages] : [];
  const grades = gradeLevels(tutor.grade_levels);
  const ready = date && time && slots.includes(time) && learnerName.trim() && learnerGrade;

  const signInKeepingDraft = () => {
    saveDraft(tutor.id, { subject, date: date ? isoDay(date) : null, time, minutes, name: learnerName, grade: learnerGrade, note: focusNote });
    onSignIn();
  };

  const book = async () => {
    setErr('');
    if (!user) { signInKeepingDraft(); return; }
    if (!ready) return;
    setBusy(true);
    try {
      let cid = childId;
      if (!cid && learnerName.trim()) {
        const { data: kid } = await supabase.from('children').insert({ parent_id: user.id, name: learnerName.trim(), grade: learnerGrade || null }).select('id, name, grade').single();
        if (kid) { cid = kid.id; setChildren(c => [...c, kid]); setChildId(kid.id); }
      }
      const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const b = await onBook(tutor.id, subject || tutor.subject, iso, time, {
        learner_name: learnerName.trim(), learner_grade: learnerGrade || null,
        focus_note: focusNote.trim() || null, child_id: cid || null, duration_minutes: minutes,
      });
      clearDraft();
      setPending({ ...b, id: b?.id, student_id: user.id, tutor_id: tutor.id, lesson_date: iso, lesson_time: time, duration_minutes: minutes });
    } catch (e) {
      if (/slot_taken/.test(`${e?.message || ''} ${e?.hint || ''}`)) {
        setErr('Someone has just booked that time. Please pick another time.');
        setTime(null); loadTaken();
      } else {
        setErr('We could not book that lesson just now. Please check your connection and try again.');
      }
    }
    setBusy(false);
  };

  const cancelPayment = async (opts) => {
    const id = pending?.id;
    setPending(null);
    // Paid, still being confirmed: keep the booking and show the dashboard.
    if (opts?.keep) { onNavigate('dashboard'); return; }
    if (id && user?.id && /^[0-9a-f-]{36}$/i.test(String(id))) {
      try { await supabase.from('bookings').delete().eq('id', id).eq('student_id', user.id).eq('status', 'pending'); } catch { /* best effort */ }
    }
  };

  const message = async () => {
    if (!user) { signInKeepingDraft(); return; }
    const r = await startConversation(user.id, tutor.user_id, `Hi! I'm interested in ${subject || tutor.subject} lessons.`);
    setErr(r?.success ? '' : 'Could not send the message. Please try again.');
    if (r?.success) alert('Message sent. You can continue the conversation in Messages.');
  };

  return (
    <div className="tg t-amber">
      <SiteNav onNavigate={onNavigate} onSignIn={onSignIn} user={user} current="tutors" onBrand={false} />
      <div className="in prof">
        <div style={{ minWidth: 0 }}>
          <button type="button" className="linkbtn plain" onClick={onBack} style={{ marginBottom: 18 }}><SiteIcon name="back" />All tutors</button>
          <div className="phead">
            <div className="ph"><TutorPhoto tutor={tutor} /></div>
            <div style={{ minWidth: 0 }}>
              <span className="badge"><SiteIcon name="check" />Checked by Tutagora</span>
              <h1 className="display" style={{ marginTop: 10 }}>{shortName(tutor.profiles?.full_name)}</h1>
              {tutor.headline && <p style={{ margin: '8px 0 0', fontWeight: 700 }}>{tutor.headline}</p>}
            </div>
          </div>
          <div className="facts">
            <div><b>{tutor.lessons_completed || 0}</b><span>lessons here</span></div>
            <div><b>{tutor.experience_years ? `${tutor.experience_years} yrs` : 'New'}</b><span>teaching</span></div>
            <div><b>{ksh(tutor.hourly_rate)}</b><span>per hour{halfHourOk ? ` · 30 min ${ksh(lessonPrice(tutor.hourly_rate, 30))}` : ''}</span></div>
          </div>
          {(tutor.bio || tutor.headline) && <><h2 className="display">About</h2><p className="para">{tutor.bio || tutor.headline}</p></>}
          <h2 className="display">Teaches</h2>
          <div className="chips">
            {subjects.map(s => <span key={s} className="chip soft">{s}</span>)}
            {(tutor.specialties || []).map(s => <span key={s} className="chip soft">{s}</span>)}
            {grades.map(g => <span key={g} className="chip soft">{g}</span>)}
            {tutor.degree && <span className="chip soft">{tutor.degree}</span>}
          </div>
          {langs.length > 0 && <p className="para" style={{ marginTop: 12 }}><SiteIcon name="globe" style={{ width: 16, height: 16, verticalAlign: '-3px', marginRight: 6 }} />Teaches in {langs.join(' and ')}</p>}
          <h2 className="display">What families say</h2>
          {reviews.length === 0
            ? <p className="para">No reviews yet. Reviews appear here after real, paid lessons.</p>
            : reviews.map(r => (
              <div key={r.id} className="review">
                {r.text && <b>"{r.text}"</b>}
                <small>{r.profiles?.full_name ? shortName(r.profiles.full_name) : 'A parent'} · {new Date(r.created_at).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}{r.rating ? ` · ${r.rating} of 5` : ''}</small>
              </div>
            ))}
        </div>

        <aside className="bookbox" id="book">
          <h3>Book a lesson</h3>
          {focusNote && <div className="focus"><SiteIcon name="target" style={{ width: 18, height: 18 }} /><span>{learnerName ? `For ${learnerName}` : 'Focus'}<br /><span style={{ fontWeight: 600 }}>{focusNote}</span></span></div>}
          {halfHourOk && <span className="l">Length</span>}
          {halfHourOk && <div className="seg2">{LENGTHS.filter(L => halfHourOk || L.min === 60).map(L => <button key={L.min} type="button" className="slot" aria-pressed={minutes === L.min} onClick={() => setMinutes(L.min)}>{L.label}</button>)}</div>}
          <span className="l">Pick a day</span>
          <div className="days">
            {days.map((d, i) => (
              <button key={i} type="button" className="day" disabled={!slotsFor(d).length} aria-pressed={date?.toDateString() === d.toDateString()} onClick={() => { setDate(d); setTime(null); }}>
                <small>{i === 0 ? 'Today' : i === 1 ? 'Tmrw' : DAY[d.getDay()]}</small><b>{d.getDate()}</b>
              </button>
            ))}
          </div>
          {!days.some(d => slotsFor(d).length) && <p className="fine" style={{ marginTop: 8 }}>No open times this week. Send a message to ask.</p>}
          {date && slots.length > 0 && <>
            <span className="l">Pick a time</span>
            <div className="slots">{slots.map(t => <button key={t} type="button" className="slot" aria-pressed={time === t} onClick={() => setTime(t)}>{fmtTime(t)}</button>)}</div>
          </>}
          {time && <>
            <span className="l">Who is it for?</span>
            {children.length > 0 && <div className="chips" style={{ marginBottom: 8 }}>
              {children.map(c => <button key={c.id} type="button" className="chip" aria-pressed={childId === c.id} onClick={() => { setChildId(c.id); setLearnerName(c.name); setLearnerGrade(c.grade || ''); }}>{c.name}</button>)}
              <button type="button" className="chip" aria-pressed={childId === null} onClick={() => { setChildId(null); setLearnerName(''); setLearnerGrade(''); }}>Someone new</button>
            </div>}
            {childId === null && <div style={{ display: 'grid', gap: 8 }}>
              <input className="inp" value={learnerName} onChange={e => setLearnerName(e.target.value)} placeholder="Learner's name" aria-label="Learner's name" />
              <select className="inp" value={learnerGrade} onChange={e => setLearnerGrade(e.target.value)} aria-label="Grade"><option value="">Grade</option>{GRADES.concat('Adult learner').map(g => <option key={g}>{g}</option>)}</select>
            </div>}
            {subjects.length > 1 && <select className="inp" style={{ marginTop: 8 }} value={subject} onChange={e => setSubject(e.target.value)} aria-label="Subject">{subjects.map(s => <option key={s}>{s}</option>)}</select>}
            <textarea className="inp" style={{ marginTop: 8 }} rows={2} value={focusNote} onChange={e => setFocusNote(e.target.value)} placeholder="What should the tutor focus on? (optional)" aria-label="Focus" />
          </>}
          <div className="total"><span>{minutes === 30 ? '30 minutes' : '1 hour'}</span><span className="price">{ksh(price)}</span></div>
          <button type="button" className="btn full" style={{ marginTop: 14 }} onClick={book} disabled={busy || (user && !ready)}>
            {busy ? 'Booking…' : !user ? 'Sign in to book' : !date || !time ? 'Pick a day and time' : !learnerName.trim() || !learnerGrade ? "Add the learner's name and grade" : `Book and pay ${ksh(price)}`}
          </button>
          {err && <div className="note-err">{err}</div>}
          <button type="button" className="btn line full" style={{ marginTop: 8 }} onClick={message}>Send a message</button>
          <p className="fine" style={{ margin: '10px 0 0' }}>Pay with M-Pesa or card. The lesson happens live inside Tutagora.</p>
        </aside>
      </div>
      <div className="mobilebook"><div className="price" style={{ fontSize: 22 }}>{ksh(tutor.hourly_rate)} <small>/ hour</small></div><a className="btn" href="#book">Book {shortName(tutor.profiles?.full_name).split(' ')[0]}</a></div>
      <SiteFooter onNavigate={onNavigate} />

      {pending && (
        <PaymentModal booking={pending} tutor={tutor} user={user} onClose={cancelPayment}
          onSuccess={() => { const b = pending; setPending(null); setFocus(null); onPaid && onPaid(b); setTimeout(() => requestPush(user?.id), 700); onNavigate('dashboard'); }} />
      )}
    </div>
  );
}
