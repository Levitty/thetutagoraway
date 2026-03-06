import React, { useState, useEffect, useRef } from 'react';

// ============ TUTAGORA CONSULTING — v3 Editorial ============

const PARTNERS = [
  { name: 'Whitestar Group of Schools', tag: 'Marketing + Software + HR' },
  { name: 'Crown of Gold School', tag: 'Marketing + Software' },
  { name: 'Utawala Springs School', tag: 'Marketing + Software' },
  { name: 'Ongata Crown School', tag: 'Marketing + Software' },
];

// Scroll reveal
const useReveal = (threshold = 0.12) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
};

const R = ({ children, delay = 0, className = '', as: Tag = 'div' }) => {
  const [ref, vis] = useReveal();
  return (
    <Tag ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(40px)', transition: `opacity 0.8s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}s` }}>
      {children}
    </Tag>
  );
};

// Parallax on mouse for hero
const useParallax = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e) => setPos({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);
  return pos;
};

// Counter animation
const Counter = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [ref, vis] = useReveal();
  useEffect(() => {
    if (!vis) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [vis, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
};

// Contact form
const ContactForm = () => {
  const [form, setForm] = useState({ name: '', school: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  if (submitted) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 rounded-full border-2 border-[#e8734a] flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e8734a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">We will be in touch.</h3>
        <p className="text-white/40">Expect to hear from us within 48 hours.</p>
      </div>
    );
  }

  const fields = [
    { key: 'name', label: 'Your Name', type: 'text', req: true, half: true },
    { key: 'school', label: 'School / Institution', type: 'text', req: true, half: true },
    { key: 'email', label: 'Email', type: 'email', req: true, half: true },
    { key: 'phone', label: 'Phone', type: 'tel', req: false, half: true },
    { key: 'message', label: 'Tell us about your goals', type: 'textarea', req: false, half: false },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {fields.map(f => (
          <div key={f.key} className={f.half ? '' : 'sm:col-span-2'}>
            <label className={`block text-xs font-medium uppercase tracking-wider mb-2 transition-colors ${focused === f.key ? 'text-[#e8734a]' : 'text-white/30'}`}>{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea rows={3} required={f.req} value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} onFocus={() => setFocused(f.key)} onBlur={() => setFocused(null)} className="w-full px-0 py-3 bg-transparent border-b border-white/10 text-white focus:outline-none focus:border-[#e8734a] transition-colors resize-none placeholder-white/20" />
            ) : (
              <input type={f.type} required={f.req} value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} onFocus={() => setFocused(f.key)} onBlur={() => setFocused(null)} className="w-full px-0 py-3 bg-transparent border-b border-white/10 text-white focus:outline-none focus:border-[#e8734a] transition-colors placeholder-white/20" />
            )}
          </div>
        ))}
      </div>
      <button type="submit" className="mt-8 group flex items-center gap-3 text-[#e8734a] font-bold text-sm uppercase tracking-wider hover:gap-5 transition-all">
        <span>Request Discovery Call</span>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </button>
    </form>
  );
};

export const ConsultingPage = ({ onBack }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const parallax = useParallax();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const services = [
    {
      num: '01', title: 'Brand Identity & Design',
      desc: 'Complete visual identity systems — logo, colour, typography, imagery guidelines, and brand standards. Every touchpoint cohesive and crafted.',
    },
    {
      num: '02', title: 'Website & Digital Presence',
      desc: 'Fast, mobile-first, SEO-optimised websites that capture enquiries and convert interest into applications.',
    },
    {
      num: '03', title: 'Social Media & Content',
      desc: 'Consistent content strategy across platforms. Student stories, campus life, career outcomes — content that builds community.',
    },
    {
      num: '04', title: 'Recruitment Campaigns',
      desc: 'Targeted digital campaigns timed to your intake cycles. Google, Meta, and emerging channels — tracked and optimised.',
    },
    {
      num: '05', title: 'School Management Software',
      desc: 'Student records, fee management, HR workflows, academic tracking, and reporting dashboards — built for Kenyan schools.',
    },
    {
      num: '06', title: 'Tutagora AI',
      desc: 'Adaptive learning technology that diagnoses each student, finds their gaps, and builds a personal path forward. Real data on real progress.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-white overflow-x-hidden scroll-smooth">
      {/* Inject custom fonts + animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        html { scroll-behavior: smooth; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes glow { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
        .marquee-track { animation: marquee 25s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
        .glow-border { position: relative; }
        .glow-border::before { content: ''; position: absolute; inset: -2px; border-radius: 9999px; background: linear-gradient(135deg, #e8734a, #ff9a76, #e8734a); opacity: 0; transition: opacity 0.3s; z-index: -1; }
        .glow-border:hover::before { opacity: 1; }
      `}</style>

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0d1117]/95 backdrop-blur-md border-b border-white/5' : ''}`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-4 group">
            <span className="font-display font-bold text-[#e8734a] tracking-wider text-sm">TUTAGORA</span>
            <span className="font-body text-[10px] tracking-[0.15em] uppercase text-white/30 ml-1">Consulting</span>
          </button>
          <div className="flex items-center gap-8">
            <a href="#services" className="text-xs font-medium tracking-wider uppercase text-white/40 hover:text-white transition-colors hidden md:block">Services</a>
            <a href="#work" className="text-xs font-medium tracking-wider uppercase text-white/40 hover:text-white transition-colors hidden md:block">Work</a>
            <a href="#ai" className="text-xs font-medium tracking-wider uppercase text-white/40 hover:text-white transition-colors hidden md:block">AI</a>
            <a href="#contact" className="text-xs font-bold tracking-wider uppercase text-[#e8734a] hover:text-[#f09070] transition-colors flex items-center gap-2">
              Get in Touch
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-end pb-16 md:pb-24 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0d1117 0%, #161b22 40%, #0d1117 100%)' }} />
          {/* Large chevron shapes — like the proposal */}
          <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '50vw', height: '80vh', opacity: 0.04, transform: `translate(${parallax.x * 0.5}px, ${parallax.y * 0.5}px)` }}>
            <svg viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <path d="M200 50L350 300L200 550" stroke="white" strokeWidth="2" />
              <path d="M150 100L300 300L150 500" stroke="white" strokeWidth="1" />
            </svg>
          </div>
          {/* Diagonal accent lines */}
          <div className="absolute top-0 right-[20%] w-px h-full opacity-[0.03]" style={{ background: 'linear-gradient(to bottom, transparent 0%, white 30%, white 70%, transparent 100%)', transform: 'rotate(3deg)' }} />
          <div className="absolute top-0 right-[22%] w-px h-full opacity-[0.02]" style={{ background: 'linear-gradient(to bottom, transparent 0%, white 30%, white 70%, transparent 100%)', transform: 'rotate(3deg)' }} />
          {/* Orange glow */}
          <div className="absolute top-[30%] right-[15%] w-[300px] h-[300px] rounded-full blur-[150px] opacity-[0.07]" style={{ background: '#e8734a' }} />
          <div className="absolute bottom-[20%] left-[10%] w-[200px] h-[200px] rounded-full blur-[100px] opacity-[0.04]" style={{ background: '#e8734a' }} />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            {/* Main heading — left */}
            <div className="md:col-span-8">
              <R>
                <p className="font-display text-xs font-bold tracking-[0.3em] text-[#e8734a] uppercase mb-6 md:mb-10">
                  Tutagora Consulting — Nairobi
                </p>
              </R>
              <R delay={0.1}>
                <h1 className="font-display text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.95] tracking-tight uppercase">
                  Your School<br />
                  Deserves to<br />
                  <span className="text-[#e8734a]">Take Flight.</span>
                </h1>
              </R>
              <R delay={0.25}>
                <p className="font-body mt-8 text-lg text-white/35 max-w-md leading-relaxed">
                  We help schools build brands that attract the right students, and software that runs the operation behind them. Strategy, design, technology — under one roof.
                </p>
              </R>
              <R delay={0.35}>
                <div className="flex flex-wrap items-center gap-6 mt-10">
                  <a href="#services" className="glow-border inline-flex items-center gap-3 px-7 py-3.5 bg-[#e8734a] text-white font-display font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#d4633c] transition-all relative z-10">
                    Explore Services
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </a>
                  <a href="#contact" className="inline-flex items-center gap-4 group">
                    <span className="w-8 h-px bg-white/20 group-hover:w-14 group-hover:bg-[#e8734a] transition-all" />
                    <span className="font-display text-xs font-bold tracking-[0.15em] text-white/40 group-hover:text-[#e8734a] uppercase transition-colors">Book a Call</span>
                  </a>
                </div>
              </R>
            </div>

            {/* Stats sidebar — right */}
            <div className="md:col-span-3 md:col-start-10">
              <R delay={0.3}>
                <div className="space-y-8 md:border-l border-white/10 md:pl-8">
                  {[
                    { val: '6+', label: 'Service Areas' },
                    { val: '4', label: 'School Partners' },
                    { val: '100%', label: 'Client Retention' },
                    { val: 'KE', label: 'Market Focus' },
                  ].map(s => (
                    <div key={s.label} className="group">
                      <div className="font-display text-2xl font-bold text-white/90 group-hover:text-[#e8734a] transition-colors">{s.val}</div>
                      <div className="font-body text-[10px] tracking-[0.15em] uppercase text-white/25 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </R>
            </div>
          </div>
        </div>

        {/* Scroll line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-white/20 animate-pulse" />
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="relative py-5 bg-[#e8734a] overflow-hidden">
        <div className="flex whitespace-nowrap marquee-track" style={{ width: 'max-content' }}>
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex items-center">
              {['Brand Strategy', 'Web Development', 'Social Media', 'Recruitment Campaigns', 'School Software', 'AI Learning', 'Content Production', 'Email Marketing'].map((t, i) => (
                <span key={`${rep}-${i}`} className="flex items-center">
                  <span className="font-display text-sm font-bold text-white/90 uppercase tracking-wider mx-8">{t}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── THE CHALLENGE — Full-width editorial ── */}
      <section className="relative py-24 md:py-40 px-6 md:px-12" style={{ background: '#f7f5f2' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-12 gap-12 md:gap-20">
            <div className="md:col-span-4">
              <R>
                <span className="font-display text-xs font-bold tracking-[0.3em] text-[#e8734a] uppercase">The Challenge</span>
                <h2 className="font-display text-3xl md:text-[2.75rem] font-bold text-[#0d1117] leading-[1.1] mt-4">
                  Schools are losing students before the first conversation.
                </h2>
              </R>
            </div>
            <div className="md:col-span-6 md:col-start-6">
              <R delay={0.15}>
                <div className="space-y-6 font-body text-[#0d1117]/60 text-lg leading-relaxed">
                  <p>Parents and students begin their research online. They search, they compare, and they form an impression before picking up the phone. Schools with weak digital presence lose candidates before the conversation starts.</p>
                  <p>Administrative staff buried in spreadsheets, manual tracking, and disconnected systems only compounds the problem. Wasted hours, data gaps, decisions without the full picture.</p>
                </div>
                <div className="mt-10 pl-6 border-l-2 border-[#e8734a]">
                  <p className="font-display text-xl md:text-2xl font-bold text-[#0d1117] leading-snug">
                    We fix both. Marketing that builds your brand. Software that runs your school.
                  </p>
                </div>
              </R>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES — Interactive accordion style ── */}
      <section id="services" className="relative py-24 md:py-40 px-6 md:px-12 bg-[#0d1117]">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative max-w-[1400px] mx-auto">
          <R>
            <span className="font-display text-xs font-bold tracking-[0.3em] text-[#e8734a] uppercase">What We Do</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-[1.05] mt-4 mb-16 md:mb-24">
              Six service areas.<br />One partner.
            </h2>
          </R>

          <div className="grid md:grid-cols-12 gap-12">
            {/* Service list — left */}
            <div className="md:col-span-5">
              <div className="space-y-0">
                {services.map((s, i) => (
                  <R key={s.num} delay={i * 0.05}>
                    <button
                      onClick={() => setActiveService(i)}
                      className={`w-full text-left py-5 border-b transition-all duration-300 flex items-start gap-4 group ${activeService === i ? 'border-[#e8734a]' : 'border-white/5 hover:border-white/15'}`}
                    >
                      <span className={`font-display text-xs font-bold mt-1 transition-colors ${activeService === i ? 'text-[#e8734a]' : 'text-white/20'}`}>{s.num}</span>
                      <span className={`font-display text-lg font-semibold transition-colors ${activeService === i ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>{s.title}</span>
                    </button>
                  </R>
                ))}
              </div>
            </div>

            {/* Active service detail — right */}
            <div className="md:col-span-6 md:col-start-7 flex items-center">
              <div className="w-full">
                <div className="font-display text-[120px] md:text-[180px] font-bold text-white/[0.02] leading-none select-none">
                  {services[activeService].num}
                </div>
                <div className="-mt-16 md:-mt-24">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                    {services[activeService].title}
                  </h3>
                  <p className="font-body text-white/40 text-lg leading-relaxed max-w-md">
                    {services[activeService].desc}
                  </p>
                  <a href="#contact" className="inline-flex items-center gap-3 mt-8 group">
                    <span className="w-8 h-px bg-[#e8734a] group-hover:w-14 transition-all" />
                    <span className="font-display text-xs font-bold tracking-[0.15em] text-[#e8734a] uppercase">Learn More</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative py-20 md:py-28 px-6 md:px-12 overflow-hidden" style={{ background: '#e8734a' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-[1400px] mx-auto text-center">
          <R>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-[1.1] mb-6">
              Ready to transform how<br />your school is seen?
            </h2>
            <p className="font-body text-white/70 text-lg mb-10 max-w-md mx-auto">
              One conversation. No obligation. Let us show you what is possible.
            </p>
            <a href="#contact" className="glow-border inline-flex items-center gap-3 px-8 py-4 bg-white text-[#0d1117] font-display font-bold text-sm uppercase tracking-wider rounded-full hover:bg-white/95 transition-all relative z-10">
              Book Your Discovery Call
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </R>
        </div>
      </section>

      {/* ── TUTAGORA AI — Full-bleed feature ── */}
      <section id="ai" className="relative py-24 md:py-40 px-6 md:px-12 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        {/* Radial dot grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[200px] opacity-[0.08]" style={{ background: '#e8734a' }} />

        <div className="relative max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-6">
              <R>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-display text-xs font-bold tracking-[0.25em] text-emerald-400/70 uppercase">Now Available</span>
                </div>
                <h2 className="font-display text-4xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">
                  Tutagora<br /><span className="text-[#e8734a]">AI</span>
                </h2>
                <p className="font-body mt-8 text-lg text-white/35 max-w-lg leading-relaxed">
                  Every student learns differently. Tutagora AI gives each one a personal learning path that adapts in real time — diagnosing gaps, adjusting difficulty, and showing schools exactly where each learner stands.
                </p>
              </R>
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <R delay={0.2}>
                <div className="space-y-5">
                  {[
                    { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: 'Diagnostic Engine', desc: 'Maps what each student knows in minutes. Identifies exact knowledge gaps across any subject.' },
                    { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Adaptive Paths', desc: 'Learning sequences that adjust in real time based on student performance and mastery patterns.' },
                    { icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', title: 'School Analytics', desc: 'Real data on student progress. Track performance across classes, subjects, and time periods.' },
                  ].map((item, i) => (
                    <div key={item.title} className="group flex gap-5 p-5 rounded-xl border border-white/5 hover:border-[#e8734a]/20 hover:bg-white/[0.02] transition-all cursor-default">
                      <div className="w-10 h-10 rounded-lg bg-[#e8734a]/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[#e8734a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-white mb-1 group-hover:text-[#e8734a] transition-colors">{item.title}</h4>
                        <p className="font-body text-sm text-white/30 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </R>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS — Horizontal editorial ── */}
      <section className="relative py-24 md:py-40 px-6 md:px-12" style={{ background: '#f7f5f2' }}>
        <div className="max-w-[1400px] mx-auto">
          <R>
            <span className="font-display text-xs font-bold tracking-[0.3em] text-[#e8734a] uppercase">Our Process</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#0d1117] leading-[1.05] mt-4 mb-16 md:mb-24 max-w-xl">
              How a partnership with Tutagora works.
            </h2>
          </R>

          <div className="grid md:grid-cols-4 gap-0">
            {[
              { phase: '01', title: 'Discovery', time: 'Weeks 1-3', desc: 'Full brand audit. Competitor mapping. Student persona development. Goals alignment.' },
              { phase: '02', title: 'Build', time: 'Weeks 4-7', desc: 'Visual identity. Website. Messaging. Software setup. Everything designed and tested.' },
              { phase: '03', title: 'Launch', time: 'Months 2-3', desc: 'Channels go live. Campaigns launch. Systems into production. Managed transition.' },
              { phase: '04', title: 'Grow', time: 'Month 4+', desc: 'Monthly reporting. Campaign optimisation. Quarterly strategy. Long-term partnership.' },
            ].map((s, i) => (
              <R key={s.phase} delay={i * 0.1}>
                <div className={`group py-8 md:px-8 ${i > 0 ? 'md:border-l border-[#0d1117]/10' : ''}`}>
                  <div className="font-display text-[80px] font-bold text-[#0d1117]/[0.04] leading-none mb-2">{s.phase}</div>
                  <div className="flex items-center gap-3 mb-3 -mt-6">
                    <h3 className="font-display text-xl font-bold text-[#0d1117]">{s.title}</h3>
                    <span className="font-body text-xs text-[#e8734a] font-medium">{s.time}</span>
                  </div>
                  <p className="font-body text-sm text-[#0d1117]/40 leading-relaxed">{s.desc}</p>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENT INFRASTRUCTURE — Lenns Hub ── */}
      <section className="relative py-20 md:py-28 px-6 md:px-12 bg-[#0d1117] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <R>
            <div className="grid md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-7">
                <span className="font-display text-xs font-bold tracking-[0.3em] text-[#e8734a] uppercase">Content Infrastructure</span>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight mt-4 mb-4">
                  Cinema-grade production.<br />No middlemen.
                </h3>
                <p className="font-body text-white/35 leading-relaxed max-w-lg">
                  Through our partnership with The Lenns Hub, a Nairobi-based professional equipment company, every shoot we run uses cinema-grade gear. Campus tours, student stories, aerial footage, recruitment videos — all produced in-house with no compromises on quality.
                </p>
              </div>
              <div className="md:col-span-4 md:col-start-9">
                <div className="grid grid-cols-2 gap-4">
                  {['Campus Tours', 'Aerial Footage', 'Student Stories', 'Brand Videos'].map(item => (
                    <div key={item} className="p-4 rounded-lg border border-white/5 hover:border-[#e8734a]/20 transition-colors">
                      <span className="font-display text-sm font-medium text-white/50">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </R>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="relative py-20 md:py-28 px-6 md:px-12" style={{ background: '#f7f5f2' }}>
        <div className="max-w-[900px] mx-auto text-center">
          <R>
            <svg className="w-10 h-10 text-[#e8734a]/20 mx-auto mb-8" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
            <p className="font-display text-2xl md:text-3xl font-bold text-[#0d1117] leading-snug mb-8">
              Since partnering with Tutagora, our digital enquiries have grown consistently and our brand finally matches the quality of education we deliver.
            </p>
            <div>
              <span className="font-display font-bold text-[#0d1117] text-sm">School Partner</span>
              <span className="font-body text-[#0d1117]/40 text-sm ml-2">— Nairobi</span>
            </div>
          </R>
        </div>
      </section>

      {/* ── TRACK RECORD ── */}
      <section id="work" className="relative py-24 md:py-40 px-6 md:px-12 bg-[#0d1117]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-12 gap-16">
            <div className="md:col-span-5">
              <R>
                <span className="font-display text-xs font-bold tracking-[0.3em] text-[#e8734a] uppercase">Track Record</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-[1.1] mt-4 mb-6">
                  Built for education. Nothing else.
                </h2>
                <p className="font-body text-white/30 leading-relaxed">
                  Active partnerships delivering marketing, school management software, and AI-powered learning across Nairobi.
                </p>
              </R>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              {PARTNERS.map((p, i) => (
                <R key={p.name} delay={i * 0.08}>
                  <div className="group flex items-center justify-between py-7 border-b border-white/5 hover:border-[#e8734a]/30 transition-all cursor-default">
                    <div className="flex items-center gap-5">
                      <span className="font-display text-sm font-bold text-[#e8734a] w-8">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-display font-semibold text-white group-hover:text-[#e8734a] transition-colors">{p.name}</span>
                    </div>
                    <span className="font-body text-xs text-white/20 hidden sm:block">{p.tag}</span>
                  </div>
                </R>
              ))}
            </div>
          </div>

          {/* Big number stats */}
          <R delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 pt-16 border-t border-white/5">
              {[
                { val: 4, suffix: '+', label: 'Schools Served' },
                { val: 3, suffix: ' yrs', label: 'In Education' },
                { val: 100, suffix: '%', label: 'Client Retention' },
                { val: 6, suffix: '+', label: 'Service Areas' },
              ].map(s => (
                <div key={s.label} className="text-center md:text-left">
                  <div className="font-display text-4xl md:text-5xl font-bold text-white">
                    <Counter end={s.val} suffix={s.suffix} />
                  </div>
                  <div className="font-body text-xs tracking-[0.15em] uppercase text-white/20 mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </R>
        </div>
      </section>

      {/* ── WHY US — Minimal and editorial ── */}
      <section className="relative py-24 md:py-40 px-6 md:px-12" style={{ background: '#f7f5f2' }}>
        <div className="max-w-[1400px] mx-auto">
          <R>
            <span className="font-display text-xs font-bold tracking-[0.3em] text-[#e8734a] uppercase">Why Us</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#0d1117] leading-[1.05] mt-4 mb-16 md:mb-20">
              Why schools choose Tutagora.
            </h2>
          </R>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14">
            {[
              { title: 'Kenyan. Deeply.', desc: 'We understand how families research, shortlist, and choose education across East Africa. No imported playbooks applied to the local market.' },
              { title: 'Education-first.', desc: 'Enrolment cycles, parent psychology, the trust dynamics of educational decision-making. This is the space we were built for.' },
              { title: 'Full-stack.', desc: 'Strategy, design, development, content, campaigns, and software. One partner. One point of contact. No gaps in accountability.' },
              { title: 'Design-led.', desc: 'Institutions that win are the ones whose brand reflects their quality. We produce work that belongs on the global stage.' },
              { title: 'Measurement-driven.', desc: 'Every campaign tracked to clear KPIs. Monthly plain-language reporting. Marketing spend made accountable.' },
              { title: 'Long-term.', desc: 'Our best partnerships grow with the institution over years. We compound knowledge into better results every cycle.' },
            ].map((item, i) => (
              <R key={item.title} delay={i * 0.06}>
                <div className="group">
                  <div className="w-8 h-0.5 bg-[#e8734a] mb-5 group-hover:w-14 transition-all" />
                  <h3 className="font-display font-bold text-[#0d1117] text-lg mb-3">{item.title}</h3>
                  <p className="font-body text-sm text-[#0d1117]/40 leading-relaxed">{item.desc}</p>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="relative py-24 md:py-40 px-6 md:px-12 bg-[#0d1117] overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[200px] opacity-[0.04]" style={{ background: '#e8734a' }} />
        {/* Chevron decoration */}
        <div className="absolute bottom-0 right-0 opacity-[0.02]" style={{ width: '30vw', height: '60vh' }}>
          <svg viewBox="0 0 300 500" fill="none" style={{ width: '100%', height: '100%' }}>
            <path d="M150 50L280 250L150 450" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="relative max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-12 gap-16 md:gap-24">
            <div className="md:col-span-5">
              <R>
                <span className="font-display text-xs font-bold tracking-[0.3em] text-[#e8734a] uppercase">Get Started</span>
                <h2 className="font-display text-3xl md:text-[2.75rem] font-bold text-white leading-[1.1] mt-4 mb-6">
                  Let us talk about your school.
                </h2>
                <p className="font-body text-white/30 leading-relaxed mb-12">
                  45-minute discovery call. No pitch deck, no pressure. Just a conversation about where your institution is and where it should be.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-white/25 hover:text-white/50 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <span className="font-body text-sm">hello@tutagora.com</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/25 hover:text-white/50 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span className="font-body text-sm">Nairobi, Kenya</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/25 hover:text-white/50 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    <span className="font-body text-sm">tutagora.com</span>
                  </div>
                </div>
              </R>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <R delay={0.15}>
                <ContactForm />
              </R>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-6 md:px-12 bg-[#080b10] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-xs font-bold tracking-wider text-[#e8734a]/50">TUTAGORA <span className="text-white/15">Consulting</span></span>
          <span className="font-body text-xs text-white/15">Marketing & Software Solutions for Education — Nairobi, Kenya</span>
        </div>
      </footer>
    </div>
  );
};
