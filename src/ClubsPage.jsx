// ============================================================================
// CLUBS — the interest-led classes discovery page (route: /clubs).
//
// Recess-style energy in the Tutagora editorial language: paper ground, serif
// headlines, and rich club cards each carrying its category's own colour and
// an oversized emblem — because clubs are joined with the heart, not the
// timetable. Academic revision stays on the tutors page; this page is play.
// ============================================================================

import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase.js';
import { INTEREST_CATEGORIES, CATEGORY_BY_KEY } from './groupClassCategories.js';

const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" };
const INK = '#171410';
const NAVY = '#12345c';
const GOLD = '#b8860b';
const PAPER = '#faf7f0';
const RULE = '#e6e0d1';
const SOFT = '#6f6a5c';

const initialsAvatar = (name) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="40" fill="#12345c"/><text x="40" y="52" font-family="Georgia" font-size="34" fill="#faf7f0" text-anchor="middle">${(name || 'T').trim()[0].toUpperCase()}</text></svg>`)}`;

const dayName = (iso) => new Date(iso).toLocaleDateString('en-KE', { weekday: 'long' });
const dateShort = (iso) => new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });

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

  return (
    <div className="min-h-screen" style={{ background: PAPER, color: INK }}>
      {/* masthead */}
      <header style={{ borderBottom: `1px solid ${RULE}` }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="w-7 h-7" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <span className="font-semibold text-[13px]" style={{ letterSpacing: '.18em' }}>TUTAGORA</span>
            <span className="text-[13px]" style={{ letterSpacing: '.14em', color: SOFT }}>· CLUBS</span>
          </button>
          <button onClick={() => onNavigate('tutors')} className="text-sm pb-0.5" style={{ color: SOFT, borderBottom: `1px solid ${RULE}` }}>
            Looking for a tutor instead?
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        {/* opening */}
        <section className="pt-14 pb-10">
          <p className="text-[11.5px] font-bold uppercase" style={{ letterSpacing: '.16em', color: GOLD }}>Interest-led classes · with mentors</p>
          <h1 className="mt-3 text-[38px] sm:text-[46px] leading-[1.06] max-w-2xl" style={{ ...SERIF, fontWeight: 500, letterSpacing: '-.01em', color: NAVY }}>
            The classes kids <em>ask</em> to come back to.
          </h1>
          <p className="mt-5 text-[16.5px] leading-relaxed max-w-xl" style={{ color: SOFT }}>
            Chess, coding, art, debate, space — small weekly clubs led by real mentors, joined
            for the love of it. Not revision. Not homework. The part of school everyone remembers.
          </p>
        </section>

        {/* category chips */}
        <section className="pb-8 flex flex-wrap gap-2.5">
          <button onClick={() => setCat('')}
            className="px-4 py-2 rounded-full text-[13.5px] font-medium transition-colors"
            style={cat === '' ? { background: INK, color: PAPER } : { background: '#fff', color: SOFT, border: `1px solid ${RULE}` }}>
            All clubs
          </button>
          {(liveCats.length ? liveCats : INTEREST_CATEGORIES).map(c => (
            <button key={c.key} onClick={() => setCat(cat === c.key ? '' : c.key)}
              className="px-4 py-2 rounded-full text-[13.5px] font-medium transition-colors"
              style={cat === c.key ? { background: c.c1, color: '#fff' } : { background: '#fff', color: SOFT, border: `1px solid ${RULE}` }}>
              {c.emoji} {c.label}
            </button>
          ))}
        </section>

        {/* club cards */}
        <section className="pb-20">
          {loading ? null : shown.length === 0 ? (
            <div className="py-16 text-center" style={{ borderTop: `1px solid ${RULE}` }}>
              <div className="text-4xl mb-3">🌱</div>
              <p className="text-[17px]" style={{ ...SERIF, color: NAVY }}>New clubs are being planted.</p>
              <p className="text-[14px] mt-2 max-w-sm mx-auto" style={{ color: SOFT }}>
                Our mentors are setting up the first ones now — check back this week, or tell us
                what your child would love and we'll find the mentor.
              </p>
              <a href="https://wa.me/254759240692?text=My%20child%20would%20love%20a%20club%20about..." target="_blank" rel="noreferrer"
                className="inline-block mt-5 px-6 py-3 rounded-xl text-[14px] font-semibold text-white" style={{ background: NAVY }}>
                Request a club on WhatsApp
              </a>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shown.map(gc => {
                const c = CATEGORY_BY_KEY[gc.category] || { emoji: '✨', label: 'Club', c1: NAVY, c2: '#2d5f96' };
                const enrolled = gc.group_class_enrollments?.length || 0;
                const left = gc.max_students - enrolled;
                const full = left <= 0;
                return (
                  <article key={gc.id} className="flex flex-col rounded-2xl overflow-hidden bg-white transition-transform hover:-translate-y-1"
                    style={{ border: `1px solid ${RULE}`, boxShadow: '0 1px 3px rgba(23,20,16,.05)' }}>
                    {/* cover — the category's own colour, oversized emblem */}
                    <div className="relative h-28 flex items-end p-4 overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${c.c1}, ${c.c2})` }}>
                      <span className="absolute -right-3 -top-5 text-[92px] leading-none select-none" style={{ opacity: .28 }} aria-hidden="true">{c.emoji}</span>
                      <span className="relative text-[11px] font-bold uppercase text-white/90" style={{ letterSpacing: '.1em' }}>
                        {c.label}{gc.recurring ? ' · weekly' : ''}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col p-5">
                      <h3 className="text-[19px] leading-snug" style={{ ...SERIF, fontWeight: 500, color: INK }}>{gc.title}</h3>
                      {gc.description && <p className="mt-1.5 text-[13.5px] leading-relaxed line-clamp-2" style={{ color: SOFT }}>{gc.description}</p>}
                      {/* mentor */}
                      <div className="mt-4 flex items-center gap-2.5">
                        <img src={gc.profiles?.avatar_url || initialsAvatar(gc.profiles?.full_name)}
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = initialsAvatar(gc.profiles?.full_name); }}
                          alt="" className="w-8 h-8 rounded-full object-cover" style={{ background: RULE }} />
                        <div className="text-[13px]">
                          <span style={{ color: SOFT }}>with </span>
                          <span className="font-semibold" style={{ color: INK }}>{gc.profiles?.full_name || 'a Tutagora mentor'}</span>
                        </div>
                      </div>
                      {/* meta */}
                      <div className="mt-3 text-[13px]" style={{ color: SOFT }}>
                        {gc.recurring ? `${dayName(gc.lesson_date)}s` : dateShort(gc.lesson_date)} · {gc.start_time} · {gc.duration_minutes} min
                        {gc.age_range ? ` · ages ${gc.age_range}` : ''}
                      </div>
                      {/* foot */}
                      <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: `1px solid ${RULE}` }}>
                        <div>
                          <div className="text-[17px] font-bold" style={{ color: NAVY }}>KSh {Number(gc.price_per_student).toLocaleString()}</div>
                          <div className="text-[11.5px]" style={{ color: full ? '#b5452f' : SOFT }}>
                            {full ? 'Club full' : `${left} ${left === 1 ? 'spot' : 'spots'} left`}
                          </div>
                        </div>
                        <button
                          onClick={() => { if (!user) { setShowAuth && setShowAuth('signup'); return; } onEnroll && onEnroll(gc); }}
                          disabled={full}
                          className="px-5 py-2.5 rounded-xl text-[13.5px] font-semibold text-white transition-transform hover:-translate-y-px disabled:opacity-40"
                          style={{ background: full ? SOFT : INK }}>
                          {full ? 'Full' : 'Join the club'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer style={{ borderTop: `1px solid ${RULE}` }}>
        <div className="max-w-5xl mx-auto px-6 py-7 flex flex-wrap items-center justify-between gap-3 text-[13px]" style={{ color: SOFT }}>
          <span>© Tutagora · Clubs</span>
          <span>Are you a mentor with a club idea? <button onClick={() => onNavigate('teach')} className="pb-0.5" style={{ color: INK, borderBottom: `1px solid ${GOLD}` }}>Teach on Tutagora</button></span>
        </div>
      </footer>
    </div>
  );
}
