// ============================================================================
// HOREB FOR SCHOOLS — the B2B pitch page (route: /schools).
//
// What a head teacher / director sees when Tutagora is sold to a school.
// The LEARNING is free for individual learners; a school pays 50 KSh/student
// /term for the institutional layer — whole-class assignment, the teacher
// dashboard, per-student CBC mastery reports. This page sells the oversight.
//
// Design: the HOREB editorial language — paper ground, serif headlines, the
// logo's navy + gold, hairline rules. Intentional, not templated.
// ============================================================================

import React from 'react';

const WHATSAPP = 'https://wa.me/254759240692?text=Hi%20Tutagora%20%E2%80%94%20I%27d%20like%20a%20HOREB%20demo%20for%20my%20school';
const MAILTO = 'mailto:tutaeducators@gmail.com?subject=HOREB%20for%20Schools%20%E2%80%94%20demo%20request';

const SERIF = { fontFamily: "Georgia, 'Times New Roman', serif" };
const INK = '#171410';
const NAVY = '#12345c';
const GOLD = '#b8860b';
const PAPER = '#faf7f0';
const RULE = '#e6e0d1';
const SOFT = '#6f6a5c';

const Eyebrow = ({ children }) => (
  <p className="text-[11.5px] font-bold uppercase" style={{ letterSpacing: '.16em', color: GOLD }}>{children}</p>
);

export default function SchoolsPage({ onNavigate }) {
  return (
    <div className="min-h-screen" style={{ background: PAPER, color: INK }}>

      {/* ── masthead ── */}
      <header style={{ borderBottom: `1px solid ${RULE}` }}>
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="w-7 h-7" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            <span className="font-semibold text-[13px]" style={{ letterSpacing: '.18em', color: INK }}>TUTAGORA</span>
            <span className="text-[13px]" style={{ letterSpacing: '.14em', color: SOFT }}>· FOR SCHOOLS</span>
          </button>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="text-sm font-medium pb-0.5"
            style={{ color: INK, borderBottom: `1px solid ${GOLD}` }}>Book a demo</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6">

        {/* ── opening ── */}
        <section className="pt-16 pb-14">
          <Eyebrow>HOREB · Adaptive CBC mathematics</Eyebrow>
          <h1 className="mt-4 text-[40px] sm:text-[48px] leading-[1.06]" style={{ ...SERIF, fontWeight: 500, letterSpacing: '-.01em', color: NAVY }}>
            Every child in your school, taught at <em>their</em> level.
          </h1>
          <p className="mt-6 text-[17px] leading-relaxed max-w-xl" style={{ color: SOFT }}>
            HOREB measures each learner, quietly rebuilds the gaps beneath their grade, and lets the
            strong ones advance without a ceiling — all of it mapped to the KICD curriculum designs,
            grade by grade. Your teachers finally see who is stuck, and on exactly what.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-6">
            <a href={WHATSAPP} target="_blank" rel="noreferrer"
              className="px-7 py-3.5 rounded-xl text-[15px] font-semibold text-white transition-transform hover:-translate-y-px"
              style={{ background: INK }}>Book a demo</a>
            <a href={MAILTO} className="text-[15px] pb-0.5" style={{ color: SOFT, borderBottom: `1px solid ${RULE}` }}>
              or write to us
            </a>
          </div>
        </section>

        {/* ── the problem, said plainly ── */}
        <section className="py-12" style={{ borderTop: `1px solid ${RULE}` }}>
          <Eyebrow>The problem every teacher knows</Eyebrow>
          <h2 className="mt-3 text-[26px] leading-snug max-w-xl" style={{ ...SERIF, fontWeight: 500, color: INK }}>
            One teacher. Forty children. Forty different levels. One lesson.
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed max-w-xl" style={{ color: SOFT }}>
            A Grade 6 classroom quietly holds children working anywhere from Grade 2 to Grade 8.
            CBC asks for mastery from every one of them — something no teacher can personalise for
            forty at once, and the exam is usually the first place the gaps become visible.
            By then it is late.
          </p>
        </section>

        {/* ── what the school gets ── */}
        <section className="py-12" style={{ borderTop: `1px solid ${RULE}` }}>
          <Eyebrow>What your school gets</Eyebrow>
          <h2 className="mt-3 text-[26px] leading-snug" style={{ ...SERIF, fontWeight: 500, color: INK }}>
            The engine teaches the child. The dashboard tells you what to do.
          </h2>
          <div className="mt-7">
            {[
              ['Whole-class assignment', 'Assign HOREB to a class in one step; every child gets an adaptive path from wherever they actually are.'],
              ['The teacher dashboard', 'Each week: who is stuck, on which CBC sub-strand — with a five-minute move to unstick each child.'],
              ['Per-student mastery reports', 'Progress by strand, in the official CBC sub-strand names. Ready for the report card and the head teacher.'],
              ['Parent updates', 'Termly progress in plain language — the message that keeps families enrolled.'],
              ['Foundations rebuilt, no ceiling above', 'Struggling learners are taken back to the missing step; gifted ones keep climbing past their grade.'],
            ].map(([t, d]) => (
              <div key={t} className="py-4 flex flex-col sm:flex-row sm:gap-8" style={{ borderBottom: `1px solid ${RULE}` }}>
                <div className="sm:w-56 shrink-0 font-semibold text-[15.5px]" style={{ color: NAVY }}>{t}</div>
                <p className="text-[14.5px] leading-relaxed mt-1 sm:mt-0" style={{ color: SOFT }}>{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── the product, glimpsed ── */}
        <section className="py-12" style={{ borderTop: `1px solid ${RULE}` }}>
          <Eyebrow>What the teacher sees, Monday morning</Eyebrow>
          <h2 className="mt-3 text-[26px] leading-snug max-w-xl" style={{ ...SERIF, fontWeight: 500, color: INK }}>
            Not a spreadsheet of scores. A short list of children who need you.
          </h2>
          {/* an honest glimpse of the dashboard — same information design as the product */}
          <div className="mt-7 rounded-2xl bg-white p-6 sm:p-7" style={{ border: `1px solid ${RULE}` }}>
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <span className="text-[13px] font-semibold" style={{ color: NAVY }}>Grade 2 Blue · 31 learners</span>
              <span className="text-[12px]" style={{ color: SOFT }}>this week</span>
            </div>
            <div className="mt-4 space-y-4">
              {[
                ['Baraka O.', 'Addition — regrouping ones', 'Writes 27 + 6 as 213 — carrying the ten as its own digit.', 'Five-minute move: bundle sticks in tens; trade ten singles for one bundle. Then retry.'],
                ['Neema K.', 'Subtraction — within 20', 'Counts the take-away group back into her total.', 'Five-minute move: act it out with bottle tops she physically hands to you.'],
              ].map(([name, skill, why, move]) => (
                <div key={name} className="pt-4" style={{ borderTop: `1px solid ${RULE}` }}>
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-semibold text-[15px]" style={{ color: INK }}>{name}</span>
                    <span className="text-[13px] font-semibold" style={{ color: '#b5452f' }}>{skill}</span>
                  </div>
                  <p className="mt-1 text-[13.5px]" style={{ color: SOFT }}>{why}</p>
                  <p className="mt-1 text-[13.5px]" style={{ color: INK }}><span className="font-semibold" style={{ color: GOLD }}>→ </span>{move}</p>
                </div>
              ))}
              <div className="pt-4 text-[13px]" style={{ borderTop: `1px solid ${RULE}`, color: SOFT }}>
                The other 29? On track — the engine is handling them. Addition: 24 of 31 mastered.
              </div>
            </div>
          </div>
          <p className="mt-3 text-[12.5px]" style={{ color: SOFT }}>Names illustrative; the exact sub-strand language comes from the KICD designs.</p>
        </section>

        {/* ── credibility ── */}
        <section className="py-12" style={{ borderTop: `1px solid ${RULE}` }}>
          <Eyebrow>Built on the real curriculum</Eyebrow>
          <h2 className="mt-3 text-[26px] leading-snug max-w-xl" style={{ ...SERIF, fontWeight: 500, color: INK }}>
            Verified against the KICD designs — not maths dressed up as CBC.
          </h2>
          <p className="mt-4 text-[15.5px] leading-relaxed max-w-xl" style={{ color: SOFT }}>
            Every skill in HOREB is tagged to its official CBC strand and sub-strand, checked against
            the KICD curriculum documents from Grade 1 to Grade 12. Lessons teach the CBC way —
            concrete first, then pictorial, then abstract — and speak to young learners out loud.
          </p>
          <div className="mt-8 grid grid-cols-3 max-w-md" style={{ borderTop: `1px solid ${RULE}` }}>
            {[['Grades 1–12', 'full maths curriculum'], ['CBC', 'KICD sub-strand mapped'], ['Any phone', 'built for low-end devices']].map(([n, l]) => (
              <div key={n} className="pt-4 pr-6">
                <div className="text-[22px]" style={{ ...SERIF, color: NAVY }}>{n}</div>
                <div className="text-[12px] mt-0.5" style={{ color: SOFT }}>{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── how a term looks ── */}
        <section className="py-12" style={{ borderTop: `1px solid ${RULE}` }}>
          <Eyebrow>How a term looks</Eyebrow>
          <ol className="mt-6 space-y-6 max-w-xl">
            {[
              ['We set up your classes', 'Send us the class lists — we create the logins. Young pupils don’t need email addresses.'],
              ['Students practise', 'On school tablets or their own phones, in class or at home. A few focused minutes a day is enough.'],
              ['Teachers act on the dashboard', 'A weekly glance shows who needs help and precisely what to do about it.'],
              ['Reports at term end', 'Per-student CBC mastery for parents and the head teacher — and the next term picks up where this one ended.'],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-5">
                <span className="text-[22px] w-8 shrink-0 text-right" style={{ ...SERIF, color: GOLD }}>{i + 1}</span>
                <div>
                  <div className="font-semibold text-[15.5px]" style={{ color: INK }}>{t}</div>
                  <p className="text-[14.5px] leading-relaxed mt-0.5" style={{ color: SOFT }}>{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── pricing ── */}
        <section className="py-12" style={{ borderTop: `1px solid ${RULE}` }}>
          <Eyebrow>Pricing</Eyebrow>
          <div className="mt-5 flex flex-wrap items-baseline gap-x-3">
            <span className="text-[52px] leading-none" style={{ ...SERIF, color: NAVY }}>KSh 50</span>
            <span className="text-[15px]" style={{ color: SOFT }}>per student, per term</span>
          </div>
          <p className="mt-3 text-[15.5px] max-w-xl leading-relaxed" style={{ color: SOFT }}>
            Less than a single exercise book — for a term of adaptive teaching, the dashboard, and
            every report. A 300-student school is KSh 15,000 a term; onboarding is included, and
            volume terms are available for school groups.
          </p>
          <p className="mt-4 text-[13.5px] max-w-xl leading-relaxed" style={{ color: SOFT }}>
            <span className="font-semibold" style={{ color: INK }}>And for families:</span> individual
            learners on Tutagora practise on HOREB free. What a school buys is the institutional
            layer — assignment, oversight, and reporting for the whole class.
          </p>
        </section>

        {/* ── closing ── */}
        <section className="py-14 pb-20" style={{ borderTop: `1px solid ${RULE}` }}>
          <h2 className="text-[30px] leading-snug max-w-lg" style={{ ...SERIF, fontWeight: 500, color: NAVY }}>
            See it with your own pupils.
          </h2>
          <p className="mt-3 text-[15.5px] max-w-xl leading-relaxed" style={{ color: SOFT }}>
            A demo takes twenty minutes: one class, real children, and the dashboard doing its work.
            We handle children’s data to the Kenya Data Protection Act — the minimum needed to teach
            and report, no advertising, ever.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <a href={WHATSAPP} target="_blank" rel="noreferrer"
              className="px-7 py-3.5 rounded-xl text-[15px] font-semibold text-white transition-transform hover:-translate-y-px"
              style={{ background: NAVY }}>WhatsApp us — 0759 240 692</a>
            <a href={MAILTO} className="text-[15px] pb-0.5" style={{ color: SOFT, borderBottom: `1px solid ${RULE}` }}>
              tutaeducators@gmail.com
            </a>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: `1px solid ${RULE}` }}>
        <div className="max-w-3xl mx-auto px-6 py-7 flex flex-wrap items-center justify-between gap-3 text-[13px]" style={{ color: SOFT }}>
          <span>© Tutagora · HOREB for Schools</span>
          <button onClick={() => onNavigate('home')} className="pb-0.5" style={{ borderBottom: `1px solid ${RULE}` }}>Back to main site</button>
        </div>
      </footer>
    </div>
  );
}
