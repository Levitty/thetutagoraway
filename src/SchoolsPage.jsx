// ============================================================================
// HOREB FOR SCHOOLS — the B2B pitch page (route: /schools).
//
// Same product language as /clubs: atmospheric navy canvas, floating nav pill,
// big confident display type, elevated white cards. The hero leads with the
// thing that actually sells — the teacher's Monday-morning screen — because a
// head teacher understands the product in ten seconds when they see it.
//
// Learning is free for individual learners; a school pays 50 KSh/student/term
// for the institutional layer: assignment, oversight, reporting.
// ============================================================================

import React from 'react';

const WA = 'https://wa.me/254759240692?text=Hi%20Tutagora%20%E2%80%94%20I%27d%20like%20a%20HOREB%20demo%20for%20my%20school';
const MAIL = 'mailto:tutaeducators@gmail.com?subject=HOREB%20for%20Schools%20%E2%80%94%20demo%20request';
const CANVAS = 'radial-gradient(1100px 520px at 80% -6%, rgba(242,168,40,.20), transparent 62%), linear-gradient(165deg,#0a1a30 0%,#12345c 62%,#173a66 100%)';

/* the teacher's screen — the hero visual */
function TeacherGlimpse() {
  const rows = [
    { n: 'Baraka O.', s: 'Addition — regrouping ones', w: 'Writes 27 + 6 as 213 — carrying the ten as its own digit.', m: 'Bundle sticks in tens; trade ten singles for one bundle.' },
    { n: 'Neema K.', s: 'Subtraction — within 20', w: 'Counts the take-away group back into her total.', m: 'Act it out with bottle tops she hands to you.' },
  ];
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-2xl">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="font-extrabold text-slate-900 text-[18px] tracking-tight">2 children need you today</h3>
        <span className="text-[12px] text-slate-400">Grade 2 Blue · 31</span>
      </div>
      <p className="text-[12.5px] text-slate-400 mb-3">stuck on a foundation</p>
      <div className="divide-y divide-slate-100">
        {rows.map(r => (
          <div key={r.n} className="py-3">
            <div className="flex flex-wrap items-baseline gap-x-2.5">
              <span className="font-bold text-slate-900 text-[15px]">{r.n}</span>
              <span className="text-[13px] font-bold text-rose-600">{r.s}</span>
            </div>
            <p className="text-[13px] text-slate-500 mt-0.5">{r.w}</p>
            <p className="text-[13px] text-slate-700 mt-1">
              <span className="font-bold text-amber-600">Five-minute move: </span>{r.m}
            </p>
          </div>
        ))}
      </div>
      <div className="pt-3 border-t border-slate-100 text-[12.5px] text-slate-500">
        The other 29 are on track — the engine is handling them. <span className="font-semibold text-slate-700">Addition: 24 of 31 mastered.</span>
      </div>
    </div>
  );
}

/* the child's screen */
function ChildGlimpse() {
  return (
    <div className="rounded-3xl p-6 shadow-2xl" style={{ background: '#faf3e7' }}>
      <p className="text-[11px] font-bold uppercase tracking-[.12em] text-amber-700">The child’s screen</p>
      <div className="mt-4 text-center">
        <div className="text-[34px] font-serif text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
          4 + 5 = <span className="text-rose-700">?</span>
        </div>
        <div className="mt-5 flex justify-center gap-2 flex-wrap max-w-[230px] mx-auto">
          {[1, 2, 3, 4].map(n => (
            <span key={n} className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[16px]"
              style={{ background: '#c96a4a', fontFamily: 'Georgia, serif' }}>{n}</span>
          ))}
          {[5, 6, 7, 8, 9].map(n => (
            <span key={n} className="w-10 h-10 rounded-full flex items-center justify-center text-[16px]"
              style={{ background: '#e9b64d', color: '#5a4310', fontFamily: 'Georgia, serif' }}>{n}</span>
          ))}
        </div>
        <p className="mt-5 text-[15px] italic text-slate-500" style={{ fontFamily: 'Georgia, serif' }}>
          “Vizuri sana — that’s it exactly.”
        </p>
      </div>
      <p className="mt-5 text-[13px] leading-relaxed text-slate-600">
        Questions read aloud for pre-readers, counters they tap to count, praise in a voice a
        six-year-old trusts. Grades 1–4 get their own lesson modes — not a shrunken adult app.
      </p>
    </div>
  );
}

export default function SchoolsPage({ onNavigate }) {
  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: CANVAS }}>

      {/* floating nav pill */}
      <div className="sticky top-4 z-30 px-4">
        <nav className="max-w-5xl mx-auto flex items-center justify-between gap-4 rounded-full bg-white/10 backdrop-blur-md border border-white/15 pl-3 pr-3 py-2">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 pl-1">
            <img src="/logo.png" alt="" className="w-7 h-7" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <span className="font-extrabold text-[14px] tracking-tight">Tutagora</span>
            <span className="text-[13px] text-white/50 hidden sm:inline">for Schools</span>
          </button>
          <a href={WA} target="_blank" rel="noreferrer"
            className="px-4 py-2 rounded-full bg-amber-400 text-slate-900 text-[13.5px] font-bold hover:bg-amber-300 transition-colors">
            Book a demo
          </a>
        </nav>
      </div>

      {/* hero — headline + the teacher's screen */}
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-12 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[12.5px] font-semibold text-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300" /> HOREB · Adaptive CBC mathematics
          </span>
          <h1 className="mt-5 text-[42px] sm:text-[54px] font-extrabold leading-[1.03] tracking-[-.03em]">
            Every child in your school, taught at <span className="text-amber-300">their</span> level.
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-white/70 max-w-md">
            HOREB measures each learner, quietly rebuilds the gaps beneath their grade, and lets
            the strong ones advance without a ceiling — mapped to the KICD designs, grade by grade.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href={WA} target="_blank" rel="noreferrer"
              className="px-6 py-3.5 rounded-xl bg-amber-400 text-slate-900 font-bold text-[15px] hover:bg-amber-300 transition-colors">
              Book a 20-minute demo
            </a>
            <a href={MAIL} className="px-6 py-3.5 rounded-xl bg-white/10 border border-white/20 font-semibold text-[15px] hover:bg-white/15 transition-colors">
              Email us
            </a>
          </div>
        </div>
        <TeacherGlimpse />
      </section>

      {/* proof strip */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <div className="grid sm:grid-cols-3 gap-4">
          {[['Grades 1–12', 'the full maths curriculum'], ['CBC-mapped', 'every KICD sub-strand'], ['Any phone', 'built for low-end devices']].map(([n, l]) => (
            <div key={n} className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
              <div className="text-[22px] font-extrabold tracking-tight text-amber-300">{n}</div>
              <div className="text-[13px] text-white/55 mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* the problem */}
      <section className="max-w-5xl mx-auto px-6 pb-14">
        <div className="rounded-3xl bg-white/5 border border-white/10 p-7 sm:p-9">
          <h2 className="text-[28px] sm:text-[32px] font-extrabold tracking-[-.02em] leading-tight max-w-xl">
            One teacher. Forty children. Forty different levels. One lesson.
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-white/65 max-w-2xl">
            A Grade 6 classroom quietly holds children working anywhere from Grade 2 to Grade 8.
            CBC asks for mastery from every one of them — something no teacher can personalise for
            forty at once, and the exam is usually the first place the gaps become visible. By then
            it is late.
          </p>
        </div>
      </section>

      {/* what the school gets */}
      <section className="max-w-5xl mx-auto px-6 pb-14">
        <h2 className="text-[28px] font-extrabold tracking-[-.02em] mb-6">What your school gets</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            ['📋', 'Whole-class assignment', 'Assign HOREB to a class in one step; every child gets an adaptive path from wherever they actually are.'],
            ['🎯', 'The teacher dashboard', 'Each week: who is stuck, on which CBC sub-strand — with a five-minute move to unstick each child.'],
            ['📊', 'Per-student mastery reports', 'Progress by strand in the official CBC names. Ready for the report card and the head teacher.'],
            ['💬', 'Parent updates', 'Termly progress in plain language — the message that keeps families enrolled.'],
            ['🪜', 'Foundations rebuilt', 'Struggling learners are taken back to the missing step, quietly, without shame.'],
            ['🚀', 'No ceiling above', 'Gifted children keep climbing past their grade instead of waiting for the class.'],
          ].map(([ic, t, d]) => (
            <div key={t} className="rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/[.07] transition-colors">
              <div className="text-[22px]">{ic}</div>
              <h3 className="mt-2 font-bold text-[16.5px]">{t}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-white/60">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* both sides of the product */}
      <section className="max-w-5xl mx-auto px-6 pb-14">
        <h2 className="text-[28px] font-extrabold tracking-[-.02em]">Two screens, one system</h2>
        <p className="text-white/60 text-[15px] mt-2 mb-6 max-w-xl">
          The child gets a lesson built for their age. You get the oversight. Same engine underneath.
        </p>
        <div className="grid lg:grid-cols-2 gap-5">
          <ChildGlimpse />
          <div className="rounded-3xl bg-white/5 border border-white/10 p-7 flex flex-col justify-center">
            <h3 className="text-[21px] font-extrabold tracking-tight">Verified against the KICD designs</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-white/65">
              Every skill is tagged to its official CBC strand and sub-strand, checked against the
              KICD curriculum documents from Grade 1 to Grade 12. Lessons teach the CBC way —
              concrete first, then pictorial, then abstract.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-white/65">
              That means the report you hand a parent uses the same words as the curriculum the
              school is inspected against. Not maths dressed up as CBC.
            </p>
          </div>
        </div>
      </section>

      {/* how a term works */}
      <section className="max-w-5xl mx-auto px-6 pb-14">
        <h2 className="text-[28px] font-extrabold tracking-[-.02em] mb-6">How a term looks</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ['We set up your classes', 'Send the class lists — we create the logins. Young pupils don’t need email addresses.'],
            ['Students practise', 'On school tablets or their own phones. A few focused minutes a day is enough.'],
            ['Teachers act', 'A weekly glance shows who needs help and exactly what to do about it.'],
            ['Reports at term end', 'Per-student CBC mastery for parents and the head teacher.'],
          ].map(([t, d], i) => (
            <div key={t} className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[15px] flex items-center justify-center">{i + 1}</div>
              <h3 className="mt-3 font-bold text-[15.5px]">{t}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/60">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* pricing */}
      <section className="max-w-5xl mx-auto px-6 pb-14">
        <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-2xl text-slate-900">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11.5px] font-bold uppercase tracking-[.14em] text-amber-600">Pricing</p>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-[56px] font-extrabold tracking-[-.03em] leading-none text-slate-900">KSh 50</span>
                <span className="text-[15px] text-slate-500">per student, per term</span>
              </div>
              <p className="mt-3 text-[15px] text-slate-600 max-w-lg leading-relaxed">
                Less than a single exercise book — for a term of adaptive teaching, the dashboard
                and every report. A 300-student school is <b>KSh 15,000 a term</b>; onboarding
                included, volume terms for school groups.
              </p>
            </div>
            <a href={WA} target="_blank" rel="noreferrer"
              className="px-7 py-4 rounded-xl bg-slate-900 text-white font-bold text-[15px] hover:bg-slate-800 transition-colors whitespace-nowrap">
              Book a demo
            </a>
          </div>
          <p className="mt-6 pt-5 border-t border-slate-100 text-[13.5px] text-slate-500 max-w-2xl leading-relaxed">
            <b className="text-slate-800">And for families:</b> individual learners on Tutagora practise
            on HOREB free. What a school buys is the institutional layer — assignment, oversight and
            reporting for the whole class.
          </p>
        </div>
      </section>

      {/* closing */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-3xl bg-white/5 border border-white/10 p-8 sm:p-10">
          <h2 className="text-[30px] sm:text-[34px] font-extrabold tracking-[-.025em] max-w-lg leading-tight">
            See it with your own pupils.
          </h2>
          <p className="mt-4 text-[15.5px] text-white/65 max-w-xl leading-relaxed">
            A demo takes twenty minutes: one class, real children, and the dashboard doing its work.
            We handle children’s data to the Kenya Data Protection Act — the minimum needed to teach
            and report, no advertising, ever.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a href={WA} target="_blank" rel="noreferrer"
              className="px-7 py-4 rounded-xl bg-amber-400 text-slate-900 font-bold text-[15px] hover:bg-amber-300 transition-colors">
              WhatsApp us — 0759 240 692
            </a>
            <a href={MAIL} className="text-[15px] text-white/70 hover:text-white transition-colors border-b border-white/25 pb-0.5">
              tutaeducators@gmail.com
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-7 flex flex-wrap items-center justify-between gap-3 text-[13px] text-white/45">
          <span>© Tutagora · HOREB for Schools</span>
          <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Back to main site</button>
        </div>
      </footer>
    </div>
  );
}
