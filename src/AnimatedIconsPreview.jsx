import React, { useState, useEffect } from 'react';

// Animated Counter - numbers count up when visible
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
};

// Floating Icon Wrapper
const FloatingIcon = ({ children, delay = 0 }) => (
  <div 
    className="animate-float"
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);

// Pulse Icon Wrapper
const PulseIcon = ({ children }) => (
  <div className="animate-pulse-soft">
    {children}
  </div>
);

// Draw-in Checkmark
const AnimatedCheck = ({ size = 24, color = '#10b981' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle 
      cx="12" cy="12" r="10" 
      stroke={color} 
      strokeWidth="2"
      className="animate-draw-circle"
      style={{ strokeDasharray: 63, strokeDashoffset: 63 }}
    />
    <path 
      d="M8 12l3 3 5-6" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="animate-draw-check"
      style={{ strokeDasharray: 20, strokeDashoffset: 20 }}
    />
  </svg>
);

// Spinning Loader
const SpinnerIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="animate-spin">
    <circle cx="12" cy="12" r="10" stroke="#e2e8f0" strokeWidth="3" fill="none" />
    <path 
      d="M12 2a10 10 0 0 1 10 10" 
      stroke="#0f172a" 
      strokeWidth="3" 
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// Bouncing Dot Loader
const DotsLoader = () => (
  <div className="flex gap-1">
    {[0, 1, 2].map(i => (
      <div 
        key={i}
        className="w-2 h-2 bg-slate-900 rounded-full animate-bounce-dot"
        style={{ animationDelay: `${i * 150}ms` }}
      />
    ))}
  </div>
);

// Subject Icons with hover effects
const SubjectIcon = ({ letter, color, name }) => (
  <div className="group cursor-pointer">
    <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg`}>
      {letter}
    </div>
    <p className="text-sm text-slate-600 mt-2 text-center group-hover:text-slate-900 transition-colors">{name}</p>
  </div>
);

// Stat Card with animated icon
const StatCard = ({ icon, value, label, color }) => (
  <div className="bg-white rounded-xl p-5 border border-slate-200 group hover:shadow-md transition-shadow">
    <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110`}>
      {icon}
    </div>
    <div className="text-2xl font-bold text-slate-900">
      <AnimatedCounter end={parseInt(value.replace(/,/g, ''))} suffix={value.includes('%') ? '%' : ''} />
    </div>
    <div className="text-sm text-slate-500">{label}</div>
  </div>
);

// Success Animation
const SuccessAnimation = () => (
  <div className="flex flex-col items-center gap-4">
    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center animate-scale-in">
      <AnimatedCheck size={40} />
    </div>
    <p className="text-lg font-semibold text-slate-900 animate-fade-in-up">Booking Confirmed!</p>
  </div>
);

// Preview Component
export default function AnimatedIconsPreview() {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes draw-circle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes scale-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in-up {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }
        .animate-draw-circle { animation: draw-circle 0.6s ease-out forwards; }
        .animate-draw-check { animation: draw-check 0.4s ease-out 0.4s forwards; }
        .animate-bounce-dot { animation: bounce-dot 1.4s ease-in-out infinite; }
        .animate-scale-in { animation: scale-in 0.5s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out 0.3s forwards; opacity: 0; }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Animated Icons Preview</h1>
          <p className="text-slate-500">Subtle, professional animations - no emojis</p>
        </div>

        {/* Stat Cards */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Stat Cards with Counting Animation</h2>
          <div className="grid grid-cols-4 gap-4">
            <StatCard 
              icon={<svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>}
              value="847"
              label="Total Tutors"
              color="bg-blue-50"
            />
            <StatCard 
              icon={<svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
              value="12453"
              label="Students"
              color="bg-emerald-50"
            />
            <StatCard 
              icon={<svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              value="10847"
              label="Lessons"
              color="bg-purple-50"
            />
            <StatCard 
              icon={<svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
              value="94%"
              label="Satisfaction"
              color="bg-amber-50"
            />
          </div>
        </section>

        {/* Subject Icons */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Subject Icons with Hover Effects</h2>
          <div className="flex gap-6">
            <SubjectIcon letter="M" color="bg-blue-500" name="Math" />
            <SubjectIcon letter="E" color="bg-emerald-500" name="English" />
            <SubjectIcon letter="P" color="bg-purple-500" name="Physics" />
            <SubjectIcon letter="C" color="bg-rose-500" name="Chemistry" />
            <SubjectIcon letter="B" color="bg-teal-500" name="Biology" />
          </div>
          <p className="text-sm text-slate-400 mt-3">Hover over the icons</p>
        </section>

        {/* Floating Icons */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Floating Animation (for hero sections)</h2>
          <div className="flex gap-8 items-center">
            <FloatingIcon delay={0}>
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
            </FloatingIcon>
            <FloatingIcon delay={200}>
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </div>
            </FloatingIcon>
            <FloatingIcon delay={400}>
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              </div>
            </FloatingIcon>
          </div>
        </section>

        {/* Loading States */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Loading States</h2>
          <div className="flex gap-12 items-center">
            <div className="text-center">
              <SpinnerIcon size={32} />
              <p className="text-sm text-slate-500 mt-2">Spinner</p>
            </div>
            <div className="text-center">
              <DotsLoader />
              <p className="text-sm text-slate-500 mt-2">Dots</p>
            </div>
          </div>
        </section>

        {/* Success Animation */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Success Animation</h2>
          <div className="flex items-center gap-8">
            <button 
              onClick={() => { setShowSuccess(false); setTimeout(() => setShowSuccess(true), 50); }}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
            >
              Trigger Success
            </button>
            {showSuccess && <SuccessAnimation />}
          </div>
        </section>

        {/* Checkmark */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Draw-in Checkmark</h2>
          <div className="flex gap-6">
            <AnimatedCheck size={32} />
            <AnimatedCheck size={32} color="#3b82f6" />
            <AnimatedCheck size={32} color="#0f172a" />
          </div>
        </section>

      </div>
    </div>
  );
}
