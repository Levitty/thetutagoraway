// ============================================================================
// HOREB FOR SCHOOLS — the B2B pitch page (route: /schools).
//
// This is what a head teacher / director sees when Tutagora is sold to a
// school. The *learning* is free for individual learners; what a school pays
// for (50 KSh/student/term) is the institutional layer: whole-class
// assignment, the teacher dashboard, and per-student CBC mastery reports.
// So this page sells the OVERSIGHT, not the engine.
// ============================================================================

import React from 'react';

const WHATSAPP = 'https://wa.me/254711344702?text=Hi%20Tutagora%20%E2%80%94%20I%27d%20like%20a%20HOREB%20demo%20for%20my%20school';
const MAILTO = 'mailto:hello@tutagora.com?subject=HOREB%20for%20Schools%20%E2%80%94%20demo%20request';

const Stat = ({ n, l }) => (
  <div className="text-center">
    <div className="text-3xl font-extrabold text-white">{n}</div>
    <div className="text-xs text-slate-300 mt-1 tracking-wide">{l}</div>
  </div>
);

const Check = () => (
  <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.1 3.1 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd"/></svg>
);

export default function SchoolsPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* top bar */}
      <header className="border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur z-40">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
            <img src="/logo.png" alt="Tutagora" className="w-8 h-8" onError={(e)=>{e.currentTarget.style.display='none';}} />
            <span className="font-bold tracking-widest text-sm text-slate-800">TUTAGORA <span className="text-slate-400 font-semibold">· FOR SCHOOLS</span></span>
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('home')} className="hidden sm:block text-sm text-slate-500 hover:text-slate-800">Main site</button>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors">Book a demo</a>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-5 py-20 md:py-28">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-amber-400 mb-5">
            <span className="w-6 h-px bg-amber-400" /> HOREB · Adaptive CBC Maths
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl text-balance">
            An adaptive maths tutor for <span className="text-amber-400">every child</span> in your school.
          </h1>
          <p className="mt-5 text-lg text-slate-300 max-w-2xl leading-relaxed">
            HOREB measures each learner, rebuilds the gaps below their grade, and lets the strong ones race ahead — all aligned to the KICD CBC curriculum. Your teachers finally see exactly who is stuck, and on what.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold transition-colors">Book a free demo</a>
            <a href={MAILTO} className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-colors">Get a quote</a>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg border-t border-white/10 pt-8">
            <Stat n="CBC" l="Aligned to KICD designs" />
            <Stat n="Grades 1–12" l="Full maths curriculum" />
            <Stat n="Any phone" l="Runs on low-end devices" />
          </div>
        </div>
      </section>

      {/* the problem */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <p className="text-xs font-bold tracking-widest uppercase text-emerald-600">The problem every teacher knows</p>
        <h2 className="text-2xl md:text-3xl font-bold mt-2 max-w-2xl text-balance">One teacher, forty different levels, one lesson.</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {[
            ['Hidden gaps', 'A Grade 6 class holds children working anywhere from Grade 2 to Grade 8. The struggling ones fall further behind in silence.'],
            ['CBC demands mastery', 'Competency-based learning expects every child to actually master each strand — impossible to personalise for 40 at once.'],
            ['No visibility', 'Teachers can’t see who is stuck, on which sub-strand, until the exam already exposed it.'],
          ].map(([t, d]) => (
            <div key={t} className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
              <div className="font-bold text-lg">{t}</div>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* what teachers get — the paid value */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <p className="text-xs font-bold tracking-widest uppercase text-emerald-600">What your school gets</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 max-w-2xl text-balance">The engine teaches the child. The dashboard tells you what to do.</h2>
          <div className="mt-8 grid md:grid-cols-2 gap-x-10 gap-y-5">
            {[
              ['Whole-class assignment', 'Assign HOREB to a class in one step. Every child gets their own adaptive path from wherever they actually are.'],
              ['The teacher dashboard', 'See at a glance who is stuck and on exactly which CBC sub-strand — with a five-minute move to unstick each child.'],
              ['Per-student mastery reports', 'Every learner’s progress by strand, mapped to the official CBC sub-strands — ready for the report card.'],
              ['Parent updates', 'Termly progress in plain language parents understand — the thing that keeps them enrolling.'],
              ['Rebuilds foundations', 'HOREB quietly fills the gaps below grade level, so the whole class can move forward together.'],
              ['No ceiling for the gifted', 'Strong learners keep advancing with no grade cap — they never sit bored.'],
            ].map(([t, d]) => (
              <div key={t} className="flex gap-3 py-3 border-t border-slate-200">
                <Check />
                <div>
                  <div className="font-semibold">{t}</div>
                  <p className="text-slate-600 text-sm mt-0.5 leading-relaxed">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* credibility */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-emerald-600">Built on the real curriculum</p>
            <h2 className="text-2xl md:text-3xl font-bold mt-2 text-balance">Verified against the KICD CBC designs — grade by grade.</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Every skill in HOREB is mapped to an official CBC strand and sub-strand, checked against the actual KICD curriculum documents from Grade 1 to Grade 12. It isn’t generic maths dressed up — it is your syllabus, made adaptive.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {['Full CBC maths, Grades 1–12','Every skill tagged to its CBC sub-strand','Concrete → pictorial → abstract teaching, the CBC way','Also available: Cambridge & SAT maths'].map(x => (
                <li key={x} className="flex gap-2 items-start"><Check /><span className="text-slate-700">{x}</span></li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-900 text-white rounded-2xl p-8">
            <div className="text-sm text-slate-400 mb-4">How a term looks</div>
            <ol className="space-y-4">
              {[
                ['We set up your classes', 'Send us your class lists — we create logins (no email needed for young pupils).'],
                ['Students practise', 'On school tablets or their own phones, in class or at home. Just a few minutes a day.'],
                ['Teachers act on the dashboard', 'Each week, see who needs help and exactly what to do about it.'],
                ['Reports at term-end', 'Per-student CBC mastery, ready for parents and the head teacher.'],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                  <div><div className="font-semibold">{t}</div><p className="text-slate-400 text-sm mt-0.5">{d}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* pricing */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
            <p className="text-xs font-bold tracking-widest uppercase text-emerald-600">Simple, per-student pricing</p>
            <div className="mt-4 flex items-baseline justify-center gap-1">
              <span className="text-5xl font-extrabold">KSh 50</span>
              <span className="text-slate-500 font-medium">/ student / term</span>
            </div>
            <p className="text-slate-500 text-sm mt-2">Less than a single textbook — every term, for every child.</p>
            <div className="mt-6 text-left space-y-2 text-sm">
              {['Adaptive CBC maths for every learner','Teacher dashboard + per-student reports','Whole-class setup and onboarding','Termly parent progress updates','Works on low-end phones & school tablets'].map(x => (
                <div key={x} className="flex gap-2"><Check /><span className="text-slate-700">{x}</span></div>
              ))}
            </div>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="mt-7 block w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors">Book a demo for your school</a>
            <p className="text-xs text-slate-400 mt-3">A 300-student school = KSh 15,000 / term. Volume terms available.</p>
          </div>
        </div>
      </section>

      {/* trust + final CTA */}
      <section className="max-w-6xl mx-auto px-5 py-16 text-center">
        <p className="text-xs font-bold tracking-widest uppercase text-emerald-600">Safe with children’s data</p>
        <h2 className="text-2xl md:text-3xl font-bold mt-2 max-w-2xl mx-auto text-balance">Aligned with the Kenya Data Protection Act. Minimal data, no ads, ever.</h2>
        <p className="mt-4 text-slate-600 max-w-xl mx-auto">We collect only what’s needed to teach and report — no advertising, no selling data. Verification and pupil records are handled to the DPA 2019.</p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors">Talk to us on WhatsApp</a>
          <a href={MAILTO} className="px-7 py-3.5 border border-slate-300 hover:border-slate-400 font-semibold rounded-xl transition-colors">Email us</a>
        </div>
      </section>

      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-400">
          <span>© Tutagora · HOREB for Schools</span>
          <button onClick={() => onNavigate('home')} className="hover:text-slate-700">Back to main site →</button>
        </div>
      </footer>
    </div>
  );
}
