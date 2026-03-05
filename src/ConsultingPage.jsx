import React, { useState, useEffect, useRef } from 'react';

// ============ TUTAGORA CONSULTING ============
// Premium consulting page — Marketing, Branding & Software for Schools

const PARTNERS = [
  { name: 'Whitestar Group of Schools', services: 'Marketing, Software, HR' },
  { name: 'Crown of Gold School', services: 'Marketing, Software' },
  { name: 'Utawala Springs School', services: 'Marketing, Software' },
  { name: 'Ongata Crown School', services: 'Marketing, Software' },
];

// Scroll-reveal hook
const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

const Reveal = ({ children, delay = 0, className = '' }) => {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      {children}
    </div>
  );
};

// Contact form
const ContactForm = () => {
  const [form, setForm] = useState({ name: '', school: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">We will be in touch.</h3>
        <p className="text-white/60">Expect to hear from us within 48 hours.</p>
      </div>
    );
  }

  const inputCls = "w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all";
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputCls} placeholder="Your name" />
        <input type="text" required value={form.school} onChange={e => setForm({...form, school: e.target.value})} className={inputCls} placeholder="School / Institution" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={inputCls} placeholder="Email address" />
        <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inputCls} placeholder="+254 7XX XXX XXX" />
      </div>
      <textarea rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className={inputCls + " resize-none"} placeholder="Tell us about your goals" />
      <button type="submit" className="w-full py-3.5 bg-[#c0392b] text-white font-semibold rounded-lg hover:bg-[#a93226] transition-all hover:shadow-lg hover:shadow-[#c0392b]/20">
        Request a Discovery Call
      </button>
    </form>
  );
};

export const ConsultingPage = ({ onBack }) => {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-3 group">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${scrolled ? 'bg-slate-900 text-white' : 'bg-white/15 text-white backdrop-blur-sm'}`}>T</div>
            <div className="flex items-center gap-2">
              <span className={`font-semibold transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>Tutagora</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full transition-colors ${scrolled ? 'bg-slate-100 text-slate-500' : 'bg-white/10 text-white/70'}`}>Consulting</span>
            </div>
          </button>
          <div className="flex items-center gap-6">
            <a href="#services" className={`text-sm font-medium hidden md:block transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/70 hover:text-white'}`}>Services</a>
            <a href="#work" className={`text-sm font-medium hidden md:block transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/70 hover:text-white'}`}>Work</a>
            <a href="#contact" className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-all ${scrolled ? 'bg-[#c0392b] text-white hover:bg-[#a93226]' : 'bg-white text-slate-900 hover:bg-white/90'}`}>
              Get in Touch
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO — Full-bleed dark with geometric elements ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
        {/* Geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[15%] right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.03]" style={{ border: '1px solid white' }} />
          <div className="absolute top-[20%] right-[12%] w-[400px] h-[400px] rounded-full opacity-[0.05]" style={{ border: '1px solid white' }} />
          <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] rounded-full opacity-[0.03]" style={{ border: '1px solid white' }} />
          {/* Accent line */}
          <div className="absolute top-0 left-[30%] w-px h-full opacity-[0.05]" style={{ background: 'linear-gradient(to bottom, transparent, white, transparent)' }} />
          <div className="absolute top-0 left-[70%] w-px h-full opacity-[0.03]" style={{ background: 'linear-gradient(to bottom, transparent, white, transparent)' }} />
          {/* Red accent glow */}
          <div className="absolute top-[40%] right-[20%] w-[200px] h-[200px] rounded-full opacity-20 blur-[100px]" style={{ background: '#c0392b' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-32 w-full">
          <div className="max-w-3xl">
            <Reveal>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-[#c0392b]" />
                <span className="text-[#c0392b] text-sm font-semibold tracking-wider uppercase">Tutagora Consulting</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight">
                Your School<br />Deserves <span className="text-[#c0392b]">to Take<br />Flight.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 text-xl text-white/50 max-w-lg leading-relaxed">
                Marketing, branding, and software built for educational institutions across Kenya and East Africa.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap gap-4 mt-10">
                <a href="#services" className="group px-8 py-4 bg-[#c0392b] text-white font-semibold rounded-full hover:bg-[#a93226] transition-all hover:shadow-xl hover:shadow-[#c0392b]/20 flex items-center gap-2">
                  Explore Our Services
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
                <a href="#contact" className="px-8 py-4 text-white/70 font-semibold rounded-full border border-white/10 hover:border-white/25 hover:text-white hover:bg-white/5 transition-all">
                  Book a Discovery Call
                </a>
              </div>
            </Reveal>

            {/* Stats bar */}
            <Reveal delay={0.4}>
              <div className="flex gap-10 mt-16 pt-10 border-t border-white/10">
                {[
                  { val: '4+', label: 'School Partners' },
                  { val: '3', label: 'Years in Education' },
                  { val: '100%', label: 'Client Retention' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-3xl font-bold text-white">{s.val}</div>
                    <div className="text-sm text-white/40 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/20 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ── PROBLEM STATEMENT — Staggered layout ── */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 md:gap-16">
            <div className="md:col-span-4">
              <Reveal>
                <div className="sticky top-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-px bg-[#c0392b]" />
                    <span className="text-[#c0392b] text-xs font-semibold tracking-wider uppercase">The Reality</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                    Most schools are invisible where it matters most.
                  </h2>
                </div>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <Reveal delay={0.1}>
                <div className="space-y-8 text-lg text-slate-500 leading-relaxed">
                  <p>
                    Parents and students start their research online. They compare, they judge, and they form an opinion before they ever pick up the phone. If your digital presence does not match the quality of your institution, you are losing candidates before the conversation starts.
                  </p>
                  <p>
                    Meanwhile, your administrative staff is buried in spreadsheets, manual fee tracking, and disconnected systems. The result: wasted hours, data gaps, and decisions made without the full picture.
                  </p>
                  <div className="pl-6 border-l-2 border-[#c0392b]">
                    <p className="text-slate-900 font-medium text-xl">
                      We solve both problems. Marketing that builds your brand. Software that runs your school.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES — Bold cards with hover depth ── */}
      <section id="services" className="py-24 md:py-32 px-6 md:px-10" style={{ background: '#f8f9fa' }}>
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#c0392b]" />
              <span className="text-[#c0392b] text-xs font-semibold tracking-wider uppercase">What We Do</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-16 leading-tight">Two pillars.<br />One partner.</h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Marketing & Brand */}
            <Reveal delay={0.1}>
              <div
                className="relative bg-white rounded-2xl p-8 md:p-10 transition-all duration-300 cursor-default group overflow-hidden"
                style={{ boxShadow: hovered === 'mkt' ? '0 25px 60px -12px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.04)', transform: hovered === 'mkt' ? 'translateY(-4px)' : 'none' }}
                onMouseEnter={() => setHovered('mkt')}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Accent stripe */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#c0392b] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-6xl font-bold text-slate-100 absolute top-6 right-8 select-none">01</div>
                <div className="relative">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Marketing & Brand</h3>
                  <p className="text-slate-500 leading-relaxed mb-8">
                    We build your complete marketing infrastructure — from visual identity to student recruitment campaigns to content that tells your story.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      'Brand Identity & Design',
                      'Website Development',
                      'Social Media',
                      'Recruitment Campaigns',
                      'Content & Storytelling',
                      'Email Marketing',
                    ].map(item => (
                      <div key={item} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#c0392b]" />
                        <span className="text-sm text-slate-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Software & AI */}
            <Reveal delay={0.2}>
              <div
                className="relative bg-slate-900 rounded-2xl p-8 md:p-10 transition-all duration-300 cursor-default group overflow-hidden"
                style={{ boxShadow: hovered === 'sw' ? '0 25px 60px -12px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1)', transform: hovered === 'sw' ? 'translateY(-4px)' : 'none' }}
                onMouseEnter={() => setHovered('sw')}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="text-6xl font-bold text-white/5 absolute top-6 right-8 select-none">02</div>
                <div className="relative">
                  <h3 className="text-2xl font-bold text-white mb-4">Software & AI</h3>
                  <p className="text-white/50 leading-relaxed mb-8">
                    Purpose-built school management software and adaptive AI learning technology. Designed for Kenyan schools, maintained by people who understand them.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      'Student Records & Fees',
                      'HR & Staff Systems',
                      'Academic Tracking',
                      'Analytics Dashboards',
                      'Tutagora AI Tutor',
                      'Custom Integrations',
                    ].map(item => (
                      <div key={item} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#c0392b]" />
                        <span className="text-sm text-white/60">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── TUTAGORA AI — Full-bleed spotlight ── */}
      <section className="relative py-24 md:py-32 px-6 md:px-10 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a1a2e 100%)' }}>
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]" style={{ background: '#c0392b' }} />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-6">
              <Reveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-white/60 text-sm mb-6 border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Now Available
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                  Tutagora <span className="text-[#c0392b]">AI</span>
                </h2>
                <p className="text-lg text-white/40 leading-relaxed mb-8">
                  Every student learns differently. Tutagora AI maps what each one knows, identifies the gaps, and builds a personal learning path that adapts in real time. Built for real classrooms, not demos.
                </p>
                <a href="#contact" className="inline-flex items-center gap-2 text-[#c0392b] font-semibold hover:gap-3 transition-all">
                  Learn more
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
              </Reveal>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <Reveal delay={0.2}>
                <div className="space-y-6">
                  {[
                    { num: '01', title: 'Diagnostic', desc: 'Maps each student in minutes. Finds the exact gaps holding them back.' },
                    { num: '02', title: 'Adaptive', desc: 'Paths that adjust in real time. Students work on what they actually need.' },
                    { num: '03', title: 'Measurable', desc: 'Real data on progress. Schools see exactly where each learner stands.' },
                  ].map((item, i) => (
                    <div key={item.num} className="flex gap-5 p-5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-colors">
                      <span className="text-[#c0392b] font-bold text-sm mt-1">{item.num}</span>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-white/40">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS — Timeline style ── */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#c0392b]" />
              <span className="text-[#c0392b] text-xs font-semibold tracking-wider uppercase">How We Work</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-20 leading-tight max-w-xl">Structured for results, not busywork.</h2>
          </Reveal>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { phase: '01', title: 'Discovery & Audit', timeline: 'Weeks 1 - 3', desc: 'Full brand and digital audit. Competitor mapping. Goals alignment. We learn everything about your school before proposing anything.' },
              { phase: '02', title: 'Build', timeline: 'Weeks 4 - 7', desc: 'Visual identity. Website. Messaging. Content strategy. Software setup. Everything designed, built, and tested before it goes live.' },
              { phase: '03', title: 'Launch', timeline: 'Months 2 - 3', desc: 'Social channels go live. Campaigns launch. Email sequences activate. Systems go into production. We manage the transition.' },
              { phase: '04', title: 'Grow', timeline: 'Month 4+', desc: 'Monthly reporting. Campaign optimisation. New intake campaigns each cycle. Quarterly strategy reviews. A long-term partnership.' },
            ].map((step, i) => (
              <Reveal key={step.phase} delay={i * 0.1}>
                <div className="relative group">
                  {/* Connector line */}
                  {i < 3 && <div className="hidden md:block absolute top-6 left-full w-full h-px bg-slate-200 z-0" />}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold mb-5 group-hover:bg-[#c0392b] transition-colors">
                      {step.phase}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h3>
                    <span className="text-xs text-[#c0392b] font-medium">{step.timeline}</span>
                    <p className="text-sm text-slate-500 leading-relaxed mt-3">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRACK RECORD — Dark section with partner logos ── */}
      <section id="work" className="py-24 md:py-32 px-6 md:px-10 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-16">
            <div className="md:col-span-5">
              <Reveal>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-[#c0392b]" />
                  <span className="text-[#c0392b] text-xs font-semibold tracking-wider uppercase">Track Record</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
                  Built for education.<br />Nothing else.
                </h2>
                <p className="text-white/40 leading-relaxed">
                  Active partnerships with schools across Nairobi delivering marketing, school management software, and now AI-powered learning technology.
                </p>
              </Reveal>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <Reveal delay={0.1}>
                <div className="space-y-0">
                  {PARTNERS.map((p, i) => (
                    <div key={p.name} className="flex items-center justify-between py-6 border-b border-white/10 group hover:border-white/20 transition-colors">
                      <div className="flex items-center gap-5">
                        <span className="text-[#c0392b] font-bold text-sm w-6">{String(i + 1).padStart(2, '0')}</span>
                        <span className="font-medium text-white group-hover:text-white/90 transition-colors">{p.name}</span>
                      </div>
                      <span className="text-sm text-white/30">{p.services}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY TUTAGORA — Grid with red accents ── */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#c0392b]" />
              <span className="text-[#c0392b] text-xs font-semibold tracking-wider uppercase">Why Us</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-16 leading-tight max-w-lg">Why schools choose Tutagora.</h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Kenyan, deeply.', desc: 'We understand how families research, shortlist, and choose education across East Africa. No imported playbooks.' },
              { title: 'Education-first.', desc: 'Enrolment cycles, parent psychology, trust dynamics. This is the space we were built for.' },
              { title: 'Full-stack.', desc: 'Strategy, design, development, content, campaigns, and software. One partner. No gaps in accountability.' },
              { title: 'Design-led.', desc: 'Your brand should reflect the quality of your institution. We build for the global stage.' },
              { title: 'Measurement-driven.', desc: 'Every campaign tracked to clear KPIs. Monthly reports in plain language. Marketing spend made accountable.' },
              { title: 'Long-term.', desc: 'Our best partnerships grow with the institution over years. We compound knowledge into better results every cycle.' },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <div className="group p-6 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-1 h-6 bg-[#c0392b] rounded-full mb-4 group-hover:h-8 transition-all" />
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT — Dark full-bleed CTA ── */}
      <section id="contact" className="py-24 md:py-32 px-6 md:px-10 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5 blur-[100px]" style={{ background: '#c0392b' }} />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-5">
              <Reveal>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-[#c0392b]" />
                  <span className="text-[#c0392b] text-xs font-semibold tracking-wider uppercase">Get Started</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
                  Let us talk about your school.
                </h2>
                <p className="text-white/40 leading-relaxed mb-10">
                  45-minute discovery call. No pitch deck, no hard sell. Just a conversation about where your institution is and where you want it to be.
                </p>
                <div className="space-y-5 text-white/30">
                  <div className="flex items-center gap-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <span className="text-white/50">hello@tutagora.com</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span className="text-white/50">Nairobi, Kenya</span>
                  </div>
                </div>
              </Reveal>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <Reveal delay={0.15}>
                <ContactForm />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-6 md:px-10 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-white/10 text-white flex items-center justify-center font-bold text-xs">T</div>
            <span className="text-sm text-white/30">Tutagora Ltd — Marketing & Software Solutions for Education</span>
          </div>
          <span className="text-xs text-white/20">Nairobi, Kenya</span>
        </div>
      </footer>
    </div>
  );
};
