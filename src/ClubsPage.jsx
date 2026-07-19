// ============================================================================
// CLUBS — interest-led classes (route: /clubs).
//
// A product page, not a document: an atmospheric navy canvas, a floating nav
// pill, big confident display type, and elevated white cards carrying real
// artwork (ClubArt) for every category. The Tutagora palette (logo navy +
// gold) keeps it ours rather than a template.
// ============================================================================

import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase.js';
import { INTEREST_CATEGORIES, CATEGORY_BY_KEY } from './groupClassCategories.js';
import ClubArt from './ClubArt.jsx';

const WA = 'https://wa.me/254759240692?text=My%20child%20would%20love%20a%20club%20about...';

const initialsAvatar = (name) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="40" fill="#12345c"/><text x="40" y="53" font-family="Helvetica" font-weight="bold" font-size="32" fill="#fff" text-anchor="middle">${(name || 'T').trim()[0].toUpperCase()}</text></svg>`)}`;

const dayName = (iso) => new Date(iso).toLocaleDateString('en-KE', { weekday: 'long' });
const dateShort = (iso) => new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });

/* ── one club card ─────────────────────────────────────────────────────── */
function ClubCard({ gc, onJoin, user, setShowAuth }) {
  const c = CATEGORY_BY_KEY[gc.category] || { label: 'Club', emoji: '✨' };
  const enrolled = gc.group_class_enrollments?.length || 0;
  const left = gc.max_students - enrolled;
  const full = left <= 0;
  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col">
      <div className="relative h-36 overflow-hidden">
        <ClubArt categoryKey={gc.category} className="w-full h-full object-cover" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-sm text-white text-[11px] font-bold tracking-wide">
          {c.emoji} {c.label}
        </span>
        {gc.recurring && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 text-slate-900 text-[11px] font-bold">
            Weekly
          </span>
        )}
        <h3 className="absolute bottom-3 left-4 right-4 text-white font-extrabold text-[18px] leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,.6)]">
          {gc.title}
        </h3>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        {gc.description && <p className="text-[13.5px] text-slate-500 leading-relaxed line-clamp-2">{gc.description}</p>}
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
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="font-extrabold text-slate-900 text-[17px]">KSh {Number(gc.price_per_student).toLocaleString()}</div>
            <div className={`text-[11.5px] ${full ? 'text-rose-600' : 'text-slate-400'}`}>
              {full ? 'Club full' : `${left} ${left === 1 ? 'spot' : 'spots'} left`}
            </div>
          </div>
          <button
            disabled={full}
            onClick={() => { if (!user) { setShowAuth && setShowAuth('signup'); return; } onJoin(gc); }}
            className="px-5 py-2.5 rounded-xl text-[13.5px] font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 transition-colors">
            {full ? 'Full' : 'Join'}
          </button>
        </div>
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
  const featured = clubs.slice(0, 4);
  const showcase = INTEREST_CATEGORIES.slice(0, 4);

  return (
    <div className="min-h-screen text-white relative overflow-hidden"
      style={{ background: 'radial-gradient(1100px 520px at 78% -6%, rgba(242,168,40,.20), transparent 62%), linear-gradient(165deg,#0a1a30 0%,#12345c 62%,#173a66 100%)' }}>

      {/* floating nav pill */}
      <div className="sticky top-4 z-30 px-4">
        <nav className="max-w-5xl mx-auto flex items-center justify-between gap-4 rounded-full bg-white/10 backdrop-blur-md border border-white/15 pl-3 pr-3 py-2">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 pl-1">
            <img src="/logo.png" alt="" className="w-7 h-7" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <span className="font-extrabold text-[14px] tracking-tight">Tutagora</span>
            <span className="text-[13px] text-white/50 hidden sm:inline">Clubs</span>
          </button>
          <div className="flex items-center gap-1.5">
            <button onClick={() => onNavigate('tutors')} className="px-3.5 py-2 text-[13.5px] text-white/75 hover:text-white transition-colors hidden sm:block">Find a tutor</button>
            <button onClick={() => onNavigate('teach')} className="px-4 py-2 rounded-full bg-white text-slate-900 text-[13.5px] font-bold hover:bg-white/90 transition-colors">Teach a club</button>
          </div>
        </nav>
      </div>

      {/* hero */}
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-10 grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[12.5px] font-semibold text-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300" /> Interest-led · with real mentors
          </span>
          <h1 className="mt-5 text-[44px] sm:text-[56px] font-extrabold leading-[1.02] tracking-[-.03em]">
            The classes kids <span className="text-amber-300">ask</span> to come back to.
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-white/70 max-w-md">
            Chess, coding, art, debate, space — small weekly clubs led by mentors who love the
            subject. Not revision. Not homework. The part of school everyone remembers.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#browse" className="px-6 py-3.5 rounded-xl bg-amber-400 text-slate-900 font-bold text-[15px] hover:bg-amber-300 transition-colors">
              Browse clubs
            </a>
            <a href={WA} target="_blank" rel="noreferrer" className="px-6 py-3.5 rounded-xl bg-white/10 border border-white/20 font-semibold text-[15px] hover:bg-white/15 transition-colors">
              Request a club
            </a>
          </div>
        </div>

        {/* elevated card — this week's clubs, or what's coming */}
        <div className="bg-white rounded-3xl p-5 shadow-2xl">
          <div className="flex items-baseline justify-between mb-4 px-1">
            <h2 className="font-extrabold text-slate-900 text-[19px] tracking-tight">
              {featured.length ? 'Starting soon' : 'Clubs we run'}
            </h2>
            <span className="text-[12.5px] text-slate-400">{featured.length ? 'this week' : 'coming soon'}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(featured.length ? featured : showcase).map((item, i) => {
              const isClub = !!featured.length;
              const key = isClub ? item.category : item.key;
              const c = CATEGORY_BY_KEY[key] || {};
              return (
                <div key={isClub ? item.id : item.key} className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-default">
                  <ClubArt categoryKey={key} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/35 backdrop-blur-sm text-white text-[10.5px] font-bold">
                    {c.label}
                  </span>
                  <p className="absolute bottom-2.5 left-3 right-3 text-white font-bold text-[13.5px] leading-tight">
                    {isClub ? item.title : (c.examples?.[0] || c.label)}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-4 px-1 text-[13px] text-slate-500 leading-relaxed">
            {featured.length
              ? 'Interest-led clubs with mentors across games, art, science, writing and more.'
              : 'Our first mentors are setting up clubs now — tell us what your child would love and we’ll find the mentor.'}
          </p>
        </div>
      </section>

      {/* browse */}
      <section id="browse" className="max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
          <h2 className="text-slate-900 font-extrabold text-[24px] tracking-tight">Browse every club</h2>
          <p className="text-slate-500 text-[14px] mt-1">Pick an interest — new clubs open each week.</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => setCat('')}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${cat === '' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              All
            </button>
            {(liveCats.length ? liveCats : INTEREST_CATEGORIES).map(c => (
              <button key={c.key} onClick={() => setCat(cat === c.key ? '' : c.key)}
                className="px-4 py-2 rounded-full text-[13px] font-semibold transition-colors"
                style={cat === c.key
                  ? { background: c.c1, color: '#fff' }
                  : { background: '#f1f5f9', color: '#475569' }}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {loading ? null : shown.length === 0 ? (
              <div className="py-14 text-center">
                <div className="max-w-md mx-auto">
                  <div className="grid grid-cols-4 gap-2 mb-6 opacity-90">
                    {INTEREST_CATEGORIES.slice(0, 4).map(c => (
                      <div key={c.key} className="rounded-xl overflow-hidden aspect-square">
                        <ClubArt categoryKey={c.key} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-[19px]">New clubs are being planted</h3>
                  <p className="text-[14px] text-slate-500 mt-2 leading-relaxed">
                    Our mentors are setting up the first ones now. Tell us what your child would
                    love and we’ll find the mentor for it.
                  </p>
                  <a href={WA} target="_blank" rel="noreferrer"
                    className="inline-block mt-5 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-[14px] hover:bg-slate-800 transition-colors">
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
        </div>

        {/* mentor call */}
        <div className="mt-6 rounded-3xl border border-white/15 bg-white/5 backdrop-blur-sm p-6 sm:p-8 flex flex-wrap items-center justify-between gap-5">
          <div>
            <h3 className="font-extrabold text-[20px] tracking-tight">Could you run one?</h3>
            <p className="text-white/65 text-[14px] mt-1 max-w-md">
              If you can hold a room of curious kids for an hour a week, we’ll handle the
              bookings, the payments and the platform. You keep 85%.
            </p>
          </div>
          <button onClick={() => onNavigate('teach')}
            className="px-6 py-3.5 rounded-xl bg-amber-400 text-slate-900 font-bold text-[15px] hover:bg-amber-300 transition-colors">
            Teach a club
          </button>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-7 flex flex-wrap items-center justify-between gap-3 text-[13px] text-white/45">
          <span>© Tutagora · Clubs</span>
          <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Back to main site</button>
        </div>
      </footer>
    </div>
  );
}
