import React from 'react';
import './site.css';

// Drawn line icons for the public site. No emojis anywhere.
const PATHS = {
  check: <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />,
  back: <path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />,
  x: <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M8 11V8a4 4 0 018 0v3" fill="none" stroke="currentColor" strokeWidth="2.4" /></>,
  phone: <><rect x="7" y="2.5" width="10" height="19" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M11 18h2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></>,
  chat: <path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />,
  globe: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" strokeWidth="2" /></>,
  cap: <><path d="M2 9l10-5 10 5-10 5z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" /><path d="M6 11v5c3 2 9 2 12 0v-5" fill="none" stroke="currentColor" strokeWidth="2.2" /></>,
  clock: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></>,
  target: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.2" /><circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="2.2" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />,
  video: <><rect x="3" y="6" width="13" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M16 10l5-3v10l-5-3z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" /></>,
  wallet: <><rect x="3" y="6" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M16 12.5h2" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /><path d="M6 6V5a2 2 0 012-2h9" fill="none" stroke="currentColor" strokeWidth="2.2" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></>,
  chart: <path d="M5 20V11M12 20V5M19 20v-6M3 20.5h18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />,
  bell: <><path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" /><path d="M10 20.5h4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></>,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />,
  users: <><circle cx="9" cy="8.5" r="3.5" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M2.5 20c.5-3.5 3.3-5.5 6.5-5.5s6 2 6.5 5.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /><path d="M16 5.2a3.3 3.3 0 010 6.6M18 14.8c2 .7 3.3 2.4 3.5 5.2" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></>,
  shield: <><path d="M12 3l7.5 3v6c0 4.5-3.2 7.8-7.5 9-4.3-1.2-7.5-4.5-7.5-9V6z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" /><path d="M8.5 12l2.5 2.5 4.5-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></>,
  book: <><path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" /><path d="M4 20.5A2.5 2.5 0 016.5 18H20v3H6.5A2.5 2.5 0 014 20.5z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" /></>,
  pen: <path d="M4 20l1-4.5L15.5 5a2.1 2.1 0 013 3L8 18.5zM13.5 7l3 3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />,
  gear: <><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="2.2" /><path d="M12 2.8v2.6M12 18.6v2.6M21.2 12h-2.6M5.4 12H2.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8M18.5 18.5l-1.8-1.8M7.3 7.3L5.5 5.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></>,
  flag: <path d="M5 21V4M5 4h11l-2 4 2 4H5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />,
  plus: <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />,
};

export const SiteIcon = ({ name, className = 'i', style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" aria-hidden="true">{PATHS[name]}</svg>
);

export const Logo = ({ onClick }) => (
  <button type="button" className="logo" onClick={onClick} aria-label="Tutagora home">tutagora<i /></button>
);

// Top navigation for the public pages.
export const SiteNav = ({ onNavigate, onSignIn, user, current, onBrand = true }) => (
  <nav className={`nav ${onBrand ? 'onbrand' : 'lined'}`}>
    <div className="in">
      <Logo onClick={() => onNavigate('home')} />
      <div className="links">
        <button type="button" onClick={() => onNavigate('tutors')} aria-current={current === 'tutors' ? 'page' : undefined}>Find a tutor</button>
        <button type="button" onClick={() => onNavigate('check')} aria-current={current === 'check' ? 'page' : undefined}>Maths check</button>
        <button type="button" onClick={() => onNavigate('schools')} aria-current={current === 'schools' ? 'page' : undefined}>For schools</button>
      </div>
      <div className="right">
        <button type="button" className="txt hide" onClick={() => onNavigate('teach')}>Teach with us</button>
        {user
          ? <button type="button" className="btn" onClick={() => onNavigate('dashboard')}>My account</button>
          : <>
              <button type="button" className="txt" onClick={onSignIn}>Sign in</button>
              <button type="button" className="btn line hide" onClick={() => onNavigate('check')}>Free check</button>
            </>}
      </div>
    </div>
  </nav>
);

export const SiteFooter = ({ onNavigate }) => (
  <footer className="footer">
    <div className="in">
      <div>
        <div className="logo" style={{ cursor: 'default' }}>tutagora<i /></div>
        <div style={{ marginTop: 8 }}>Nairobi, Kenya · tutaeducators@gmail.com · WhatsApp 0759 240 692</div>
      </div>
      <nav aria-label="Footer">
        <button type="button" onClick={() => onNavigate('tutors')}>Find a tutor</button>
        <button type="button" onClick={() => onNavigate('check')}>Maths check</button>
        <button type="button" onClick={() => onNavigate('teach')}>Teach with us</button>
        <button type="button" onClick={() => onNavigate('schools')}>For schools</button>
        <button type="button" onClick={() => onNavigate('privacy')}>Privacy</button>
      </nav>
    </div>
  </footer>
);

// Stand-in portraits for the homepage scrapbook until real photos are added.
const STANDINS = [
  { bg: '#f6d7b0', skin: '#5b3a24', shirt: '#3d3fbf' },
  { bg: '#cfe9d8', skin: '#7a4b2e', shirt: '#f2a900' },
  { bg: '#e6e6ff', skin: '#4a2f1e', shirt: '#1f7a47' },
  { bg: '#ffd6e6', skin: '#6a4128', shirt: '#121117' },
];
export const StandIn = ({ n = 0 }) => {
  const c = STANDINS[n % STANDINS.length];
  return (
    <svg viewBox="0 0 240 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="240" height="260" fill={c.bg} />
      <circle cx="195" cy="45" r="55" fill="#fff" opacity=".3" />
      <ellipse cx="120" cy="112" rx="42" ry="48" fill={c.skin} />
      <path d="M76 104c0-36 20-58 44-58s44 22 44 58c-10-18-24-28-44-28s-34 10-44 28z" fill="#1b120d" />
      <circle cx="105" cy="115" r="4" fill="#1b120d" /><circle cx="135" cy="115" r="4" fill="#1b120d" />
      <path d="M107 136q13 9 26 0" stroke="#2b1a10" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M28 260c0-60 40-94 92-94s92 34 92 94z" fill={c.shirt} />
    </svg>
  );
};

// A tutor's real photo, or their initials on a flat colour when there's none.
const INITIAL_BG = ['#ffe3ee', '#e3f3e9', '#e6e6ff', '#fff1cc'];
export const TutorPhoto = ({ tutor }) => {
  const [broken, setBroken] = React.useState(false);
  const name = tutor?.profiles?.full_name || 'Tutor';
  const url = tutor?.profiles?.avatar_url;
  if (url && !broken) return <img src={url} alt={name} loading="lazy" onError={() => setBroken(true)} />;
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const bg = INITIAL_BG[(name.charCodeAt(0) || 0) % INITIAL_BG.length];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" role="img" aria-label={name}>
      <rect width="100" height="100" fill={bg} />
      <text x="50" y="50" dominantBaseline="central" textAnchor="middle" fontFamily="Archivo Variable, sans-serif" fontWeight="800" fontSize="34" fill="#121117">{initials}</text>
    </svg>
  );
};

// Short display name: "Grace Otieno" -> "Grace O."
export const shortName = (full) => {
  const parts = String(full || 'Tutor').trim().split(/\s+/);
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];
};

export const tutorSubjects = (t) =>
  [...new Set((Array.isArray(t?.subjects) && t.subjects.length ? t.subjects : [t?.subject]).filter(Boolean))];

// grade_levels reached the DB as a real array, a JSON-stringified array, or a
// plain comma string. Normalise all three.
export const gradeLevels = (g) => {
  if (!g) return [];
  if (Array.isArray(g)) return g.filter(Boolean);
  if (typeof g === 'string') {
    try { const parsed = JSON.parse(g); if (Array.isArray(parsed)) return parsed.filter(Boolean); } catch { /* not JSON */ }
    return g.split(',').map(s => s.replace(/[[\]"]/g, '').trim()).filter(Boolean);
  }
  return [String(g)];
};

// Tutors with a real profile photo are listed first: parents trust a face.
export const hasPhoto = (t) => !!(t?.profiles?.avatar_url && String(t.profiles.avatar_url).trim());
export const photoFirst = (a, b) => Number(hasPhoto(b)) - Number(hasPhoto(a));

export const ksh = (n) => `KSh ${Math.round(Number(n) || 0).toLocaleString('en-KE')}`;
