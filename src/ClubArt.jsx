// ============================================================================
// CLUB COVER ART — a crafted abstract graphic per interest category.
//
// Every club card carries real artwork, not a gradient with an emoji dropped
// on it. Each piece is drawn from its subject's own visual vocabulary —
// circuit traces for coding, orbits for science, a waveform for music — in
// that category's colours. Pure SVG: no image files, no CDN, sharp on any
// screen, and weightless on a Kenyan data plan.
// ============================================================================

import React from 'react';
import { CATEGORY_BY_KEY } from './groupClassCategories.js';

const VB = '0 0 320 180';

function Art({ k, c1, c2 }) {
  const L = 'rgba(255,255,255,.34)';   // light strokes over the colour field
  const F = 'rgba(255,255,255,.16)';   // soft fills
  const common = { fill: 'none', stroke: L, strokeWidth: 2, strokeLinecap: 'round' };

  switch (k) {
    case 'coding': // circuit traces + nodes
      return (
        <g>
          {[40, 80, 120].map((y, i) => (
            <path key={y} d={`M-10 ${y} H${70 + i * 40} L${100 + i * 40} ${y + 34} H330`} {...common} />
          ))}
          {[[70, 40], [110, 80], [150, 120], [230, 74], [270, 114]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="6" fill={L} />
          ))}
          <rect x="196" y="24" width="58" height="42" rx="6" {...common} />
        </g>
      );
    case 'chess': // checker field dissolving
      return (
        <g>
          {Array.from({ length: 40 }, (_, i) => {
            const cx = i % 8, cy = Math.floor(i / 8);
            if ((cx + cy) % 2) return null;
            return <rect key={i} x={cx * 40} y={cy * 36} width="40" height="36" fill={F} opacity={1 - cy * 0.18} />;
          })}
          <circle cx="232" cy="60" r="20" fill={L} />
          <rect x="216" y="78" width="32" height="10" rx="3" fill={L} />
        </g>
      );
    case 'art': // overlapping paint pools
      return (
        <g>
          <circle cx="96" cy="86" r="54" fill={F} />
          <circle cx="164" cy="66" r="42" fill={F} />
          <circle cx="212" cy="112" r="48" fill={F} />
          <path d="M40 150 Q110 108 176 148 T300 126" {...common} strokeWidth="3" />
        </g>
      );
    case 'drama': // curtain arcs + spotlight
      return (
        <g>
          <path d="M0 0 Q60 96 0 180" fill={F} />
          <path d="M320 0 Q260 96 320 180" fill={F} />
          <path d="M160 -10 L96 180 H224 Z" fill={F} />
          <circle cx="160" cy="52" r="16" fill={L} />
        </g>
      );
    case 'debate': // sound radiating
      return (
        <g>
          {[26, 50, 74, 98].map(r => <circle key={r} cx="78" cy="90" r={r} {...common} opacity={1 - r / 150} />)}
          <circle cx="78" cy="90" r="13" fill={L} />
          <rect x="196" y="52" width="14" height="46" rx="7" fill={L} />
          <path d="M186 100 a17 17 0 0 0 34 0" {...common} />
          <path d="M203 117 v14" {...common} />
        </g>
      );
    case 'writing': // flowing script
      return (
        <g>
          <path d="M-10 128 q40 -46 80 -6 t80 -12 t80 -8 t90 -14" {...common} strokeWidth="3" />
          <path d="M-10 152 q40 -46 80 -6 t80 -12 t80 -8 t90 -14" {...common} opacity=".6" />
          <path d="M214 40 l44 -22 10 20 -44 22z" fill={L} />
          <path d="M214 40 l-8 26 26 -12z" fill={F} />
        </g>
      );
    case 'science': // orbits
      return (
        <g>
          <ellipse cx="160" cy="90" rx="112" ry="42" {...common} />
          <ellipse cx="160" cy="90" rx="112" ry="42" {...common} transform="rotate(60 160 90)" />
          <ellipse cx="160" cy="90" rx="112" ry="42" {...common} transform="rotate(-60 160 90)" />
          <circle cx="160" cy="90" r="17" fill={L} />
          <circle cx="266" cy="66" r="7" fill={L} />
        </g>
      );
    case 'music': // waveform
      return (
        <g>
          {Array.from({ length: 22 }, (_, i) => {
            const h = 14 + Math.abs(Math.sin(i * 0.9)) * 96;
            return <rect key={i} x={12 + i * 14} y={90 - h / 2} width="7" height={h} rx="3.5" fill={L} opacity={.5 + (i % 3) * 0.2} />;
          })}
        </g>
      );
    case 'film': // aperture
      return (
        <g>
          {[0, 60, 120, 180, 240, 300].map(a => (
            <path key={a} d="M160 90 L160 22 L218 56 Z" fill={F} transform={`rotate(${a} 160 90)`} />
          ))}
          <circle cx="160" cy="90" r="68" {...common} />
          <circle cx="160" cy="90" r="16" fill={L} />
        </g>
      );
    case 'languages': // meridians
      return (
        <g>
          <circle cx="160" cy="90" r="72" {...common} />
          {[0.35, 0.7, 1].map((s, i) => (
            <ellipse key={i} cx="160" cy="90" rx={72 * s} ry="72" {...common} opacity=".8" />
          ))}
          <path d="M88 90 H232 M100 50 H220 M100 130 H220" {...common} />
        </g>
      );
    case 'entrepreneur': // rising bars + spark
      return (
        <g>
          {[0, 1, 2, 3].map(i => (
            <rect key={i} x={44 + i * 52} y={140 - (i + 1) * 26} width="34" height={(i + 1) * 26} rx="5" fill={F} />
          ))}
          <path d="M40 128 L100 88 L152 108 L268 34" {...common} strokeWidth="3" />
          <path d="M244 30 h28 v28" {...common} strokeWidth="3" />
        </g>
      );
    case 'games': // puzzle dots
      return (
        <g>
          {Array.from({ length: 24 }, (_, i) => {
            const x = 30 + (i % 8) * 37, y = 46 + Math.floor(i / 8) * 44;
            return i % 5 === 0
              ? <rect key={i} x={x - 11} y={y - 11} width="22" height="22" rx="6" fill={L} />
              : <circle key={i} cx={x} cy={y} r="9" fill={F} />;
          })}
        </g>
      );
    case 'life': // pan + steam
      return (
        <g>
          <path d="M78 96 a52 52 0 0 0 104 0 z" fill={F} />
          <path d="M182 96 h74" {...common} strokeWidth="7" />
          <path d="M104 62 q10 -20 0 -38 M130 58 q10 -24 0 -44 M156 62 q10 -20 0 -38" {...common} />
        </g>
      );
    case 'reading': // book spines
      return (
        <g>
          {[0, 1, 2, 3, 4].map(i => (
            <rect key={i} x={44 + i * 46} y={44 + (i % 2) * 10} width="32" height={{ 0: 96, 1: 86, 2: 100, 3: 84, 4: 92 }[i]} rx="4" fill={F} />
          ))}
          {[0, 1, 2, 3, 4].map(i => (
            <rect key={`b${i}`} x={44 + i * 46} y={62 + (i % 2) * 10} width="32" height="5" fill={L} />
          ))}
        </g>
      );
    default:
      return (
        <g>
          <circle cx="160" cy="90" r="62" {...common} />
          <path d="M160 44 v92 M114 90 h92" {...common} />
        </g>
      );
  }
}

/** Cover artwork for a club card. `h` sets the height class. */
export default function ClubArt({ categoryKey, className = '', style }) {
  const c = CATEGORY_BY_KEY[categoryKey] || { c1: '#12345c', c2: '#2d5f96' };
  const id = `g-${categoryKey || 'x'}`;
  return (
    <svg viewBox={VB} preserveAspectRatio="xMidYMid slice" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c.c1} />
          <stop offset="100%" stopColor={c.c2} />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#${id})`} />
      <Art k={categoryKey} c1={c.c1} c2={c.c2} />
    </svg>
  );
}
