// ============================================================================
// HOREB FOR SCHOOLS — the B2B pitch page (route: /schools).
//
// Editorial register, matched to the HOREB "how it works" page: light canvas,
// bold navy display type, one amber accent, numbered thinking, a dark closing
// band. The hero still leads with the product itself — the teacher's Monday
// screen — because a head teacher understands it in ten seconds. The one piece
// of imagery is real, public-domain art from the Art Institute of Chicago:
// Cassatt's "The Child's Bath" — one adult, one child — the human counterpoint
// to a classroom of forty.
//
// Learning is free for individual learners; a school pays 50 KSh/student/term
// for the institutional layer: assignment, oversight, reporting.
// ============================================================================

import React from 'react';

const WA = 'https://wa.me/254759240692?text=Hi%20Tutagora%20%E2%80%94%20I%27d%20like%20a%20HOREB%20demo%20for%20my%20school';
const MAIL = 'mailto:tutaeducators@gmail.com?subject=HOREB%20for%20Schools%20%E2%80%94%20demo%20request';

/* the teacher's screen — the hero visual */
function TeacherGlimpse() {
  const rows = [
    { n: 'Baraka O.', s: 'Addition — regrouping ones', w: 'Writes 27 + 6 as 213 — carrying the ten as its own digit.', m: 'Bundle sticks in tens; trade ten singles for one bundle.' },
    { n: 'Neema K.', s: 'Subtraction — within 20', w: 'Counts the take-away group back into her total.', m: 'Act it out with bottle tops she hands to you.' },
  ];
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-2xl ring-1 ring-slate-900/5 border border-slate-100">
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
    <div className="rounded-3xl p-6 shadow-xl ring-1 ring-amber-900/5 border border-amber-100" style={{ background: '#faf3e7' }}>
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
  const gets = [
    ['M4 6 h16 M4 12 h16 M4 18 h10', 'Whole-class assignment', 'Assign HOREB to a class in one step; every child gets an adaptive path from wherever they actually are.'],
    ['M12 12 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0-16 0 M12 12 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0-6 0', 'The teacher dashboard', 'Each week: who is stuck, on which CBC sub-strand — with a five-minute move to unstick each child.'],
    ['M5 19 v-7 M12 19 v-12 M19 19 v-4 M3 21 h18', 'Per-student mastery reports', 'Progress by strand in the official CBC names. Ready for the report card and the head teacher.'],
    ['M4 5 h16 v11 h-9 l-5 4 v-4 H4z', 'Parent updates', 'Termly progress in plain language — the message that keeps families enrolled.'],
    ['M7 21 V6 M17 21 V6 M7 17 h10 M7 12 h10 M7 7 h10', 'Foundations rebuilt', 'Struggling learners are taken back to the missing step, quietly, without shame.'],
    ['M12 3 l3 6 6 1-4.5 4 1 6.5-5.5-3-5.5 3 1-6.5L3 10l6-1z', 'No ceiling above', 'Gifted children keep climbing past their grade instead of waiting for the class.'],
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="w-7 h-7" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <span className="font-extrabold text-[15px] tracking-tight">Tutagora</span>
            <span className="text-[13px] text-slate-400 hidden sm:inline">for Schools</span>
          </button>
          <a href={WA} target="_blank" rel="noreferrer"
            className="px-4 py-2 rounded-full bg-slate-900 text-white text-[13.5px] font-bold hover:bg-slate-800 transition-colors">
            Book a demo
          </a>
        </div>
      </header>

      {/* hero — headline + the teacher's screen */}
      <section className="max-w-5xl mx-auto px-6 pt-16 sm:pt-20 pb-14 grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
        <div>
          <div className="text-[13px] font-bold tracking-[.16em] text-amber-600">HOREB · ADAPTIVE CBC MATHEMATICS</div>
          <h1 className="mt-4 text-[42px] sm:text-[56px] font-extrabold leading-[0.99] tracking-[-.035em]">
            Every child in your school,<br />taught at <span className="text-amber-500">their</span> level.
          </h1>
          <p className="mt-6 text-[18.5px] leading-relaxed text-slate-600 max-w-md">
            HOREB measures each learner, quietly rebuilds the gaps beneath their grade, and lets the
            strong ones advance without a ceiling — mapped to the KICD designs, grade by grade.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={WA} target="_blank" rel="noreferrer"
              className="px-7 py-3.5 rounded-xl bg-amber-400 text-slate-900 font-bold text-[15px] hover:bg-amber-300 transition-colors">
              Book a 20-minute demo
            </a>
            <a href={MAIL} className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold text-[15px] hover:bg-slate-50 transition-colors">
              Email us
            </a>
          </div>
        </div>
        <TeacherGlimpse />
      </section>

      {/* proof strip */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid sm:grid-cols-3 gap-4">
          {[['Grades 1–12', 'the full maths curriculum'], ['CBC-mapped', 'every KICD sub-strand'], ['Any phone', 'built for low-end devices']].map(([n, l]) => (
            <div key={n} className="rounded-2xl border border-slate-200 px-5 py-4">
              <div className="text-[22px] font-extrabold tracking-tight text-slate-900">{n}</div>
              <div className="text-[13px] text-slate-500 mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* the problem — paired with real art (one adult, one child) */}
      <section className="max-w-5xl mx-auto px-6 pb-16 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        <div>
          <div className="text-[13px] font-bold tracking-[.16em] text-amber-600">THE PROBLEM</div>
          <h2 className="mt-4 text-[30px] sm:text-[38px] font-extrabold tracking-[-.03em] leading-[1.02]">
            One teacher. Forty children. Forty different levels. One lesson.
          </h2>
          <p className="mt-5 text-[16.5px] leading-relaxed text-slate-600 max-w-xl">
            A Grade 6 classroom quietly holds children working anywhere from Grade 2 to Grade 8.
            CBC asks for mastery from every one of them — something no teacher can personalise for
            forty at once, and the exam is usually the first place the gaps become visible. By then
            it is late.
          </p>
          <p className="mt-4 text-[16.5px] leading-relaxed text-slate-800 font-medium max-w-xl">
            HOREB gives every child the one thing a class of forty can’t: full attention.
          </p>
        </div>
        <figure>
          <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
            <img src="/art/childs-bath.jpg" alt="Mary Cassatt, The Child’s Bath — one adult attending one child" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <figcaption className="mt-2.5 text-[11.5px] text-slate-400 leading-snug">
            Mary Cassatt, <em>The Child’s Bath</em>, 1893. Art Institute of Chicago (public domain).
          </figcaption>
        </figure>
      </section>

      {/* what the school gets */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="text-[13px] font-bold tracking-[.16em] text-amber-600">WHAT YOUR SCHOOL GETS</div>
        <h2 className="mt-3 mb-7 text-[30px] sm:text-[36px] font-extrabold tracking-[-.03em] leading-tight">The institutional layer.</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {gets.map(([d0, t, d]) => (
            <div key={t} className="rounded-2xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d0} /></svg>
              <h3 className="mt-3 font-extrabold text-[16.5px] text-slate-900">{t}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* both sides of the product */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="text-[13px] font-bold tracking-[.16em] text-amber-600">TWO SCREENS, ONE SYSTEM</div>
        <p className="mt-3 mb-7 text-[30px] sm:text-[36px] font-extrabold tracking-[-.03em] leading-tight max-w-2xl">
          The child gets a lesson built for their age.<br className="hidden sm:block" /> You get the oversight.
        </p>
        <div className="grid lg:grid-cols-2 gap-5">
          <ChildGlimpse />
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7 flex flex-col justify-center">
            <h3 className="text-[21px] font-extrabold tracking-tight text-slate-900">Verified against the KICD designs</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
              Every skill is tagged to its official CBC strand and sub-strand, checked against the
              KICD curriculum documents from Grade 1 to Grade 12. Lessons teach the CBC way —
              concrete first, then pictorial, then abstract.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
              That means the report you hand a parent uses the same words as the curriculum the
              school is inspected against. Not maths dressed up as CBC.
            </p>
          </div>
        </div>
      </section>

      {/* how a term works */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="text-[13px] font-bold tracking-[.16em] text-amber-600">HOW A TERM LOOKS</div>
        <h2 className="mt-3 mb-7 text-[30px] sm:text-[36px] font-extrabold tracking-[-.03em] leading-tight">Four steps, once.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ['We set up your classes', 'Send the class lists — we create the logins. Young pupils don’t need email addresses.'],
            ['Students practise', 'On school tablets or their own phones. A few focused minutes a day is enough.'],
            ['Teachers act', 'A weekly glance shows who needs help and exactly what to do about it.'],
            ['Reports at term end', 'Per-student CBC mastery for parents and the head teacher.'],
          ].map(([t, d], i) => (
            <div key={t} className="rounded-2xl border border-slate-200 p-5">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[15px] flex items-center justify-center">{i + 1}</div>
              <h3 className="mt-3 font-extrabold text-[15.5px] text-slate-900">{t}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-600">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* pricing */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-10">
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
          <p className="mt-6 pt-5 border-t border-slate-200 text-[13.5px] text-slate-500 max-w-2xl leading-relaxed">
            <b className="text-slate-800">And for families:</b> individual learners on Tutagora practise
            on HOREB free. What a school buys is the institutional layer — assignment, oversight and
            reporting for the whole class.
          </p>
        </div>
      </section>

      {/* closing — dark band */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-3xl bg-slate-900 text-white p-9 sm:p-11">
          <h2 className="text-[30px] sm:text-[36px] font-extrabold tracking-[-.03em] max-w-lg leading-[1.02]">
            See it with your own pupils.
          </h2>
          <p className="mt-4 text-[16.5px] text-white/70 max-w-xl leading-relaxed">
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

      <footer className="border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-7 flex flex-wrap items-center justify-between gap-3 text-[13px] text-slate-400">
          <span>© Tutagora · HOREB for Schools</span>
          <button onClick={() => onNavigate('home')} className="hover:text-slate-700 transition-colors">Back to main site</button>
        </div>
      </footer>
    </div>
  );
}
