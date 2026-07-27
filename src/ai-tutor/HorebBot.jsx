// ============================================================================
// HOREB — the tutor mascot. A friendly little robot guide who speaks to the
// learner. Clean flat SVG in the brand-adjacent palette (indigo body, gold
// antenna, soft-cyan face). Scales crisply at any size; `mood` tweaks the face.
// ============================================================================

import React from 'react';

export const HorebBot = ({ size = 40, className = '', mood = 'happy' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}
    role="img" aria-label="HOREB, your maths guide">
    {/* antenna */}
    <line x1="32" y1="7.5" x2="32" y2="14" stroke="#b8bde0" strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="32" cy="6" r="3.4" fill="#f2a828" />
    {/* ears */}
    <rect x="7.5" y="29" width="5" height="13" rx="2.5" fill="#c7cbe8" />
    <rect x="51.5" y="29" width="5" height="13" rx="2.5" fill="#c7cbe8" />
    {/* head */}
    <rect x="11.5" y="13.5" width="41" height="39" rx="13.5" fill="#6d6fcb" />
    <rect x="11.5" y="13.5" width="41" height="39" rx="13.5" fill="url(#hb-shade)" />
    {/* face screen */}
    <rect x="16.5" y="19.5" width="31" height="25" rx="9.5" fill="#141a3d" />
    {/* eyes */}
    {mood === 'thinking' ? (
      <>
        <rect x="22.5" y="29.5" width="6.5" height="2.6" rx="1.3" fill="#8fe3ff" />
        <rect x="35" y="29.5" width="6.5" height="2.6" rx="1.3" fill="#8fe3ff" />
      </>
    ) : (
      <>
        <circle cx="26" cy="30.5" r="3.1" fill="#8fe3ff" />
        <circle cx="38" cy="30.5" r="3.1" fill="#8fe3ff" />
      </>
    )}
    {/* mouth */}
    {mood === 'cheer' ? (
      <path d="M25 35.5 Q32 42.5 39 35.5 Q32 39 25 35.5 Z" fill="#8fe3ff" />
    ) : (
      <path d="M25.5 36 Q32 41 38.5 36" stroke="#8fe3ff" strokeWidth="2.3" fill="none" strokeLinecap="round" />
    )}
    {/* cheek glow */}
    <circle cx="20.5" cy="37" r="1.5" fill="#f2a828" opacity="0.65" />
    <circle cx="43.5" cy="37" r="1.5" fill="#f2a828" opacity="0.65" />
    <defs>
      <linearGradient id="hb-shade" x1="32" y1="13.5" x2="32" y2="52.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.14" />
        <stop offset="1" stopColor="#000000" stopOpacity="0.12" />
      </linearGradient>
    </defs>
  </svg>
);

export default HorebBot;
