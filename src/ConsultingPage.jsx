import React, { useState } from 'react';

// ============ CONSULTING PAGE ============
// Tutagora Consulting — Marketing, Branding & Software Solutions for Schools

const PARTNERS = [
  { name: 'Whitestar Group of Schools', services: 'Marketing, School Management Software, HR System' },
  { name: 'Crown of Gold School', services: 'Marketing, School Management Software' },
  { name: 'Utawala Springs School', services: 'Marketing, School Management Software' },
  { name: 'Ongata Crown School', services: 'Marketing, School Management Software' },
];

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', school: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just show confirmation. Can wire to Supabase or email later.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">We'll be in touch.</h3>
        <p className="text-slate-500">Expect to hear from us within 48 hours to schedule your discovery call.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Name</label>
          <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors" placeholder="e.g. John Kamau" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">School / Institution</label>
          <input type="text" required value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors" placeholder="e.g. Nairobi Academy" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors" placeholder="you@school.ac.ke" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
          <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors" placeholder="+254 7XX XXX XXX" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">What are you looking for?</label>
        <textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors resize-none" placeholder="Tell us about your school's goals — we'll tailor our approach to you." />
      </div>
      <button type="submit" className="w-full py-3.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors">
        Request a Discovery Call
      </button>
      <p className="text-xs text-slate-400 text-center">No commitment. We'll schedule a 45-minute call to understand your needs.</p>
    </form>
  );
};

export const ConsultingPage = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">T</div>
            <span className="font-semibold text-slate-900">Tutagora</span>
            <span className="text-slate-300 mx-1">|</span>
            <span className="text-sm text-slate-500">Consulting</span>
          </button>
          <a href="#contact" className="px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-colors">
            Get in Touch
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-5">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium tracking-wide text-[#c0392b] uppercase mb-4">Tutagora Consulting</p>
          <h1 className="text-4xl md:text-[3.25rem] md:leading-[1.15] font-bold text-slate-900">
            Your School Deserves<br />
            <span className="text-[#c0392b]">to Take Flight.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 max-w-xl leading-relaxed">
            Marketing, branding, and software built specifically for educational institutions across Kenya and East Africa. Not a template. A partnership.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <a href="#services" className="px-7 py-3.5 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-colors">
              See What We Do
            </a>
            <a href="#contact" className="px-7 py-3.5 text-slate-700 font-medium rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors">
              Book a Discovery Call
            </a>
          </div>
        </div>
      </section>

      {/* ── Divider line ── */}
      <div className="max-w-5xl mx-auto px-5">
        <div className="border-t border-slate-100" />
      </div>

      {/* ── The Problem ── */}
      <section className="py-20 px-5">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium tracking-wide text-slate-400 uppercase mb-3">The reality</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">Most schools are invisible where it matters most.</h2>
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p>
              Parents and students start their research online. They compare, they judge, and they form an opinion before they ever call your admissions office. If your digital presence does not match the quality of your institution, you are losing them before the conversation starts.
            </p>
            <p>
              Meanwhile, your administrative staff is buried in spreadsheets, manual fee tracking, and systems that do not talk to each other. The result: wasted hours, data gaps, and decisions made without the full picture.
            </p>
            <p>
              Tutagora exists to solve both problems — under one roof.
            </p>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-20 px-5 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-medium tracking-wide text-slate-400 uppercase mb-3">What we do</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-14">Two pillars. One partner.</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pillar 1: Marketing & Brand */}
            <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-100">
              <div className="w-12 h-12 bg-[#c0392b]/10 rounded-xl flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Marketing & Brand</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                We build your school's complete marketing infrastructure — from visual identity to student recruitment campaigns. Everything a modern institution needs to attract, engage, and enrol the right students.
              </p>
              <div className="space-y-3">
                {[
                  'Brand identity & design systems',
                  'Website design & development',
                  'Social media management',
                  'Student recruitment campaigns',
                  'Content creation & storytelling',
                  'Email marketing & nurture sequences',
                ].map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#c0392b] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span className="text-sm text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pillar 2: Software & AI */}
            <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-100">
              <div className="w-12 h-12 bg-slate-900/10 rounded-xl flex items-center justify-center mb-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Software & AI Solutions</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                Purpose-built school management software and AI-powered learning technology. Designed for Kenyan schools, maintained by people who understand how they operate.
              </p>
              <div className="space-y-3">
                {[
                  'Student records & fee management',
                  'HR & staff lifecycle workflows',
                  'Academic performance tracking',
                  'Reporting dashboards & analytics',
                  'Tutagora AI — adaptive learning for every student',
                  'Custom integrations & support',
                ].map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-slate-900 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span className="text-sm text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tutagora AI Spotlight ── */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Subtle background texture */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/3 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-white/80 text-xs font-medium mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                New
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Tutagora AI</h2>
              <p className="text-slate-300 max-w-xl leading-relaxed mb-8">
                Every student learns differently. Tutagora AI gives each one a personal tutor that knows exactly what they've mastered, where the gaps are, and what to teach them next. Adaptive learning paths, diagnostic testing, and spaced repetition — built for real classrooms, not Silicon Valley demos.
              </p>

              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold text-white mb-1">Diagnostic</div>
                  <p className="text-sm text-slate-400">Maps each student's knowledge in minutes, not weeks. Finds the exact gaps holding them back.</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">Adaptive</div>
                  <p className="text-sm text-slate-400">Learning paths that adjust in real time. Students work on what they actually need, not a fixed syllabus order.</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white mb-1">Measurable</div>
                  <p className="text-sm text-slate-400">Real data on student progress. Schools see exactly where each learner stands and how they're improving.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How We Work ── */}
      <section className="py-20 px-5 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium tracking-wide text-slate-400 uppercase mb-3">Our process</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-12">Structured for results, not busywork.</h2>

          <div className="space-y-10">
            {[
              {
                phase: '01',
                title: 'Discovery & Audit',
                timeline: 'Weeks 1–3',
                desc: 'We study your school inside out — your brand, your competitors, your market, and your goals. No assumptions. This phase sets the foundation for everything that follows.',
              },
              {
                phase: '02',
                title: 'Brand Build & Setup',
                timeline: 'Weeks 4–7',
                desc: 'Visual identity, website, messaging, content strategy, and software deployment. This is where the infrastructure gets built — designed, developed, and tested before anything goes live.',
              },
              {
                phase: '03',
                title: 'Launch & Activate',
                timeline: 'Months 2–3',
                desc: 'Social channels go live, recruitment campaigns launch, email sequences activate, and your new systems go into production. We manage the transition so your team is not overwhelmed.',
              },
              {
                phase: '04',
                title: 'Grow & Optimise',
                timeline: 'Month 4+',
                desc: 'Monthly reporting, continuous campaign optimisation, new intake campaigns each cycle, and quarterly strategy reviews. This is a long-term partnership, not a handoff.',
              },
            ].map(step => (
              <div key={step.phase} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                    {step.phase}
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                    <span className="text-xs text-slate-400 font-medium">{step.timeline}</span>
                  </div>
                  <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Track Record ── */}
      <section className="py-20 px-5">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium tracking-wide text-slate-400 uppercase mb-3">Track record</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">We work with schools. That's it.</h2>
          <p className="text-slate-500 leading-relaxed mb-10">
            Tutagora was built for the education sector from day one. We currently have active partnerships with schools across Nairobi, delivering both marketing services and purpose-built school management software.
          </p>

          <div className="space-y-4">
            {PARTNERS.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-300 font-medium w-6">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-medium text-slate-900">{p.name}</span>
                </div>
                <span className="text-sm text-slate-400 hidden sm:block">{p.services}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Tutagora ── */}
      <section className="py-20 px-5 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium tracking-wide text-slate-400 uppercase mb-3">Why us</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-12">Here's why schools choose Tutagora.</h2>

          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
            {[
              {
                title: 'We are Kenyan, deeply.',
                desc: 'We understand how families research, shortlist, and decide on education in Nairobi and across East Africa. No generic Western playbooks.',
              },
              {
                title: 'We are education-first.',
                desc: 'Enrolment cycles, parent psychology, trust dynamics — this is the space we were built for, not a vertical we service.',
              },
              {
                title: 'Full-stack capability.',
                desc: 'Strategy, design, web development, content, campaigns, and software — all under one roof. One partner. No gaps.',
              },
              {
                title: 'Design-led.',
                desc: 'Your brand should reflect the quality of your institution. We produce work that belongs on the global stage.',
              },
              {
                title: 'Measurement-driven.',
                desc: 'Every campaign is tracked to clear KPIs. Every month, you get a plain-language report on what is working and what we are adjusting.',
              },
              {
                title: 'Long-term commitment.',
                desc: 'Our best partnerships are the ones where we grow with the institution over years. We compound knowledge into better results every cycle.',
              },
            ].map(item => (
              <div key={item.title}>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact / CTA ── */}
      <section id="contact" className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <p className="text-sm font-medium tracking-wide text-[#c0392b] uppercase mb-3">Get started</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Let's talk about your school.</h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                We start every partnership with a 45-minute discovery call. No pitch deck, no hard sell — just a conversation about where your institution is, where you want it to be, and whether we are the right fit to get you there.
              </p>
              <div className="space-y-4 text-sm text-slate-500">
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <span>hello@tutagora.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>Nairobi, Kenya</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  <span>tutagora.com</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 md:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 py-8 px-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">T</div>
            <span className="text-sm text-slate-500">Tutagora Ltd — Marketing & Software Solutions for Education</span>
          </div>
          <span className="text-xs text-slate-400">Nairobi, Kenya</span>
        </div>
      </footer>
    </div>
  );
};
