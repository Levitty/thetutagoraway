// ============================================================================
// CLUBS — interest-led classes (route: /clubs).
//
// Editorial register, matched to the HOREB "how it works" page: light canvas,
// big confident navy display type, a single amber accent, numbered thinking,
// a dark closing band. The imagery is real, public-domain artwork from the
// Art Institute of Chicago (CC0) — never generated filler. Club cards are
// type-led with a small monoline category glyph, so nothing reads as app art.
// ============================================================================

import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase.js';
import { INTEREST_CATEGORIES, CATEGORY_BY_KEY } from './groupClassCategories.js';
import { ClubGlyph } from './ClubArt.jsx';

const WA = 'https://wa.me/254759240692?text=My%20child%20would%20love%20a%20club%20about...';

const initialsAvatar = (name) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="40" fill="#12345c"/><text x="40" y="53" font-family="Helvetica" font-weight="bold" font-size="32" fill="#fff" text-anchor="middle">${(name || 'T').trim()[0].toUpperCase()}</text></svg>`)}`;

const dayName = (iso) => new Date(iso).toLocaleDateString('en-KE', { weekday: 'long' });
const dateShort = (iso) => new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });

/* ── one club card — type-led, editorial ───────────────────────────────── */
function ClubCard({ gc, onJoin, user, setShowAuth }) {
  const c = CATEGORY_BY_KEY[gc.category] || { label: 'Club', c1: '#f2a828' };
  const enrolled = gc.group_class_enrollments?.length || 0;
  const left = gc.max_students - enrolled;
  const full = left <= 0;
  return (
    <article className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200 p-5 flex flex-col">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
          style={{ background: (c.c1 || '#f2a828') + '18', color: c.c1 || '#b4790f' }}>
          <ClubGlyph categoryKey={gc.category} className="w-3.5 h-3.5" /> {c.label}
        </span>
        {gc.recurring && <span className="text-[11px] font-bold tracking-wide text-slate-400">WEEKLY</span>}
      </div>

      <h3 className="mt-3.5 font-extrabold text-slate-900 text-[19px] leading-tight tracking-[-.01em]">{gc.title}</h3>
      {gc.description && <p className="mt-1.5 text-[13.5px] text-slate-500 leading-relaxed line-clamp-2">{gc.description}</p>}

      <div className="mt-3 flex items-center gap-2.5">
        <img src={gc.profiles?.avatar_url || initialsAvatar(gc.profiles?.full_name)}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = initialsAvatar(gc.profiles?.full_name); }}
          alt="" className="w-7 h-7 rounded-full object-cover bg-slate-100" />
        <span className="text-[13px] text-slate-600">
          with <span className="font-semibold text-slate-900">{gc.profiles?.full_name || 'a Tutagora mentor'}</span>
        </span>
      </div>
      <div className="mt-2 text-[12.5px] text-slate-500">
        {gc.recurring ? `${dayName(gc.lesson_date)}s` : dateShort(gc.lesson_date)} · {gc.start_time} · {gc.duration_minutes} min
        {gc.age_range ? ` · ages ${gc.age_range}` : ''}
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="font-extrabold text-slate-900 text-[17px]">KSh {Number(gc.price_per_student).toLocaleString()}</div>
          <div className={`text-[11.5px] ${full ? 'text-rose-600' : 'text-slate-400'}`}>
            {full ? 'Club full' : `${left} ${left === 1 ? 'spot' : 'spots'} left`}
          </div>
        </div>
        <button
          disabled={full}
          onClick={() => { if (!user) { setShowAuth && setShowAuth('signup'); return; } onJoin(gc); }}
          className="px-5 py-2.5 rounded-xl text-[13.5px] font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-colors">
          {full ? 'Full' : 'Join'}
        </button>
      </div>
    </article>
  );
}

export default function ClubsPage({ user, onNavigate, setShowAuth, onEnroll }) {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('');

  const fetchClubs = useCallback(async () => {
    const { data } = await supabase
      .from('group_classes')
      .select('*, profiles:tutor_id(full_name, avatar_url), group_class_enrollments(id)')
      .eq('status', 'open')
      .eq('class_type', 'interest')
      .gte('lesson_date', new Date().toISOString().split('T')[0])
      .order('lesson_date', { ascending: true });
    setClubs(data || []);
    setLoading(false);
  }, []);
  useEffect(() => { fetchClubs(); }, [fetchClubs]);

  const liveCats = INTEREST_CATEGORIES.filter(c => clubs.some(x => x.category === c.key));
  const shown = cat ? clubs.filter(c => c.category === cat) : clubs;

  const beats = [
    { k: 'Led by someone who loves it.', p: 'Not a supervised worksheet. A chess player, a coder, an illustrator — a mentor who lights up about the thing and makes the room light up too.' },
    { k: 'Small, and the same faces each week.', p: 'A handful of children, meeting weekly. Small enough that everyone gets a turn, familiar enough that they build something over a term.' },
    { k: 'The part of school everyone remembers.', p: 'Years later nobody remembers a mock exam. They remember the club — the play they staged, the robot that finally worked, the debate they won.' },
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="w-7 h-7" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <span className="font-extrabold text-[15px] tracking-tight">Tutagora</span>
            <span className="text-[13px] text-slate-400 hidden sm:inline">Clubs</span>
          </button>
          <div className="flex items-center gap-1">
            <button onClick={() => onNavigate('tutors')} className="px-3.5 py-2 text-[13.5px] text-slate-500 hover:text-slate-900 transition-colors hidden sm:block">Find a tutor</button>
            <button onClick={() => onNavigate('teach')} className="px-4 py-2 rounded-full bg-slate-900 text-white text-[13.5px] font-bold hover:bg-slate-800 transition-colors">Teach a club</button>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 sm:pt-20 pb-14 grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
        <div>
          <div className="text-[13px] font-bold tracking-[.16em] text-amber-600">TUTAGORA · CLUBS</div>
          <h1 className="mt-4 text-[44px] sm:text-[60px] font-extrabold leading-[0.98] tracking-[-.035em]">
            The classes kids<br /><span className="text-amber-500">ask</span> to come back to.
          </h1>
          <p className="mt-6 text-[18.5px] leading-relaxed text-slate-600 max-w-md">
            Chess, coding, art, debate, space — small weekly clubs led by mentors who love
            the subject. Not revision. Not homework. The part of school everyone remembers.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#browse" className="px-7 py-3.5 rounded-xl bg-amber-400 text-slate-900 font-bold text-[15px] hover:bg-amber-300 transition-colors">
              Browse clubs
            </a>
            <a href={WA} target="_blank" rel="noreferrer" className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold text-[15px] hover:bg-slate-50 transition-colors">
              Request a club
            </a>
          </div>
        </div>

        {/* real artwork — Seurat, a Sunday at leisure */}
        <figure className="lg:-mr-6">
          <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
            <img src="/art/grande-jatte.jpg" alt="Georges Seurat, A Sunday on La Grande Jatte" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <figcaption className="mt-2.5 text-[11.5px] text-slate-400 leading-snug">
            Georges Seurat, <em>A Sunday on La Grande Jatte</em>, 1884. Art Institute of Chicago (public domain).
          </figcaption>
        </figure>
      </section>

      {/* the idea — numbered, like how-it-works */}
      <section className="max-w-4xl mx-auto px-6 pb-8">
        <div className="space-y-11">
          {beats.map((b, i) => (
            <div key={i} className="border-t border-slate-200 pt-8">
              <div className="flex items-baseline gap-4">
                <span className="text-amber-500 font-extrabold text-[15px] tabular-nums">0{i + 1}</span>
                <h2 className="text-[24px] sm:text-[28px] font-extrabold leading-tight tracking-[-.02em]">{b.k}</h2>
              </div>
              <p className="mt-3 sm:pl-10 text-[16.5px] leading-relaxed text-slate-600 max-w-2xl">{b.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* browse */}
      <section id="browse" className="max-w-5xl mx-auto px-6 pt-14 pb-16">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[13px] font-bold tracking-[.16em] text-amber-600">BROWSE</div>
            <h2 className="mt-2 text-[32px] sm:text-[38px] font-extrabold tracking-[-.03em] leading-tight">Every club, open now.</h2>
          </div>
          <p className="text-slate-500 text-[14.5px] max-w-xs">Pick an interest — new clubs open each week.</p>
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          <button onClick={() => setCat('')}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${cat === '' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            All
          </button>
          {(liveCats.length ? liveCats : INTEREST_CATEGORIES).map(c => (
            <button key={c.key} onClick={() => setCat(cat === c.key ? '' : c.key)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-colors"
              style={cat === c.key ? { background: c.c1, color: '#fff' } : { background: '#f1f5f9', color: '#475569' }}>
              <ClubGlyph categoryKey={c.key} className="w-3.5 h-3.5" /> {c.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {loading ? null : shown.length === 0 ? (
            <div className="py-12 rounded-3xl border border-slate-200 bg-slate-50 text-center px-6">
              <div className="max-w-md mx-auto">
                <h3 className="font-extrabold text-slate-900 text-[22px] tracking-[-.02em]">New clubs are being planted.</h3>
                <p className="text-[15px] text-slate-500 mt-2.5 leading-relaxed">
                  Our first mentors are setting up now. Tell us what your child would love, and we’ll find
                  the mentor for it.
                </p>
                <a href={WA} target="_blank" rel="noreferrer"
                  className="inline-block mt-6 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-[14px] hover:bg-slate-800 transition-colors">
                  Request a club on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {shown.map(gc => (
                <ClubCard key={gc.id} gc={gc} user={user} setShowAuth={setShowAuth} onJoin={onEnroll} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* mentor call — dark closing band, like how-it-works */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-3xl bg-slate-900 text-white p-9 sm:p-11 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-[26px] sm:text-[30px] font-extrabold leading-tight tracking-[-.02em]">Could you run one?</h3>
            <p className="mt-3 text-[16.5px] leading-relaxed text-white/70">
              If you can hold a room of curious kids for an hour a week, we’ll handle the bookings,
              the payments and the platform. You keep 85%.
            </p>
          </div>
          <button onClick={() => onNavigate('teach')}
            className="px-7 py-3.5 rounded-xl bg-amber-400 text-slate-900 font-bold text-[15px] hover:bg-amber-300 transition-colors whitespace-nowrap">
            Teach a club
          </button>
        </div>
      </section>

      <footer className="border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-7 flex flex-wrap items-center justify-between gap-3 text-[13px] text-slate-400">
          <span>© Tutagora · Clubs</span>
          <button onClick={() => onNavigate('home')} className="hover:text-slate-700 transition-colors">Back to main site</button>
        </div>
      </footer>
    </div>
  );
}
