// ============================================================================
// CLUB ARTWORK — screen-print posters, one per interest.
//
// Rules that keep this from looking like generated filler:
//   · flat colour fields, no gradients-as-decoration
//   · THICK strokes (10–16 on a 320×180 frame) and shapes that fill the frame
//   · two ink colours + paper, like a two-pass risograph — never a wash of
//     faint lines
//   · a real motif from the subject, not an abstract swoosh
// Also exports monoline glyphs for chips, so no emoji appear anywhere.
// ============================================================================

import React from 'react';
import { CATEGORY_BY_KEY } from './groupClassCategories.js';

/* ── the poster plates ─────────────────────────────────────────────────── */
function Plate({ k, ink, paper }) {
  const S = { fill: 'none', stroke: ink, strokeWidth: 13, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const F = { fill: ink };
  const P = { fill: paper };

  switch (k) {
    case 'coding': // angle brackets + caret block
      return (<g>
        <path d="M104 44 L48 90 L104 136" {...S} />
        <path d="M216 44 L272 90 L216 136" {...S} />
        <rect x="146" y="76" width="28" height="30" {...F} />
      </g>);
    case 'chess': // bold board + pawn
      return (<g>
        {[0, 1, 2, 3].map(r => [0, 1, 2, 3].map(c => (
          (r + c) % 2 === 0 ? <rect key={`${r}${c}`} x={c * 46} y={r * 45} width="46" height="45" {...F} opacity=".9" /> : null
        )))}
        <circle cx="246" cy="70" r="30" {...F} />
        <path d="M212 138 q34 -30 68 0 z" {...F} />
      </g>);
    case 'art': // three ink pools overlapping
      return (<g>
        <circle cx="112" cy="88" r="52" {...F} opacity=".95" />
        <circle cx="172" cy="70" r="46" {...P} opacity=".55" />
        <circle cx="196" cy="118" r="44" {...F} opacity=".75" />
      </g>);
    case 'drama': // curtains + spot
      return (<g>
        <path d="M0 0 h74 q-30 90 0 180 H0z" {...F} />
        <path d="M320 0 h-74 q30 90 0 180 H320z" {...F} />
        <circle cx="160" cy="82" r="34" {...F} opacity=".9" />
        <path d="M160 116 L104 180 h112z" {...F} opacity=".45" />
      </g>);
    case 'debate': // radiating arcs + mic
      return (<g>
        {[46, 82, 118].map((r, i) => (
          <path key={r} d={`M64 ${90 - r} A${r} ${r} 0 0 1 64 ${90 + r}`} {...S} strokeWidth={14 - i * 2} opacity={1 - i * .22} />
        ))}
        <rect x="196" y="40" width="34" height="64" rx="17" {...F} />
        <path d="M182 104 a31 31 0 0 0 62 0" {...S} />
        <path d="M213 136 v20" {...S} />
      </g>);
    case 'writing': // nib + ruled lines
      return (<g>
        <path d="M96 30 L176 30 L136 122 Z" {...F} />
        <path d="M136 122 v28" {...S} strokeWidth="10" />
        <path d="M196 66 H300 M196 100 H300 M196 134 H272" {...S} strokeWidth="11" opacity=".85" />
      </g>);
    case 'science': // nucleus + orbits
      return (<g>
        <ellipse cx="160" cy="90" rx="120" ry="46" {...S} strokeWidth="12" />
        <ellipse cx="160" cy="90" rx="120" ry="46" {...S} strokeWidth="12" transform="rotate(62 160 90)" opacity=".8" />
        <circle cx="160" cy="90" r="30" {...F} />
      </g>);
    case 'music': // heavy equaliser
      return (<g>
        {[54, 104, 150, 92, 132, 66, 116].map((h, i) => (
          <rect key={i} x={30 + i * 40} y={90 - h / 2} width="24" height={h} rx="12" {...F} opacity={i % 2 ? .78 : 1} />
        ))}
      </g>);
    case 'film': // aperture
      return (<g>
        {[0, 60, 120, 180, 240, 300].map((a, i) => (
          <path key={a} d="M160 90 L160 18 L222 54 Z" {...F} opacity={i % 2 ? .95 : .65} transform={`rotate(${a} 160 90)`} />
        ))}
        <circle cx="160" cy="90" r="24" {...P} />
      </g>);
    case 'languages': // globe
      return (<g>
        <circle cx="160" cy="90" r="74" {...S} strokeWidth="13" />
        <ellipse cx="160" cy="90" rx="30" ry="74" {...S} strokeWidth="11" opacity=".85" />
        <path d="M88 66 H232 M88 114 H232" {...S} strokeWidth="11" opacity=".85" />
      </g>);
    case 'entrepreneur': // growth bars + arrow
      return (<g>
        {[0, 1, 2].map(i => <rect key={i} x={44 + i * 58} y={150 - (i + 1) * 34} width="40" height={(i + 1) * 34} rx="6" {...F} opacity={.55 + i * .2} />)}
        <path d="M212 118 L268 46" {...S} strokeWidth="14" />
        <path d="M232 42 h40 v40" {...S} strokeWidth="14" />
      </g>);
    case 'games': // chunky pieces
      return (<g>
        <rect x="34" y="34" width="58" height="58" rx="10" {...F} />
        <circle cx="160" cy="63" r="30" {...F} opacity=".8" />
        <path d="M228 34 h58 v58 h-58z" {...S} strokeWidth="13" />
        <circle cx="63" cy="140" r="26" {...F} opacity=".7" />
        <rect x="130" y="112" width="58" height="58" rx="28" {...F} opacity=".9" />
        <path d="M232 116 l30 52 h-60z" {...F} opacity=".8" />
      </g>);
    case 'life': // pan + steam
      return (<g>
        <path d="M64 92 a58 58 0 0 0 116 0 z" {...F} />
        <rect x="180" y="82" width="88" height="18" rx="9" {...F} />
        <path d="M92 58 q14 -24 0 -46 M122 54 q14 -28 0 -50 M152 58 q14 -24 0 -46" {...S} strokeWidth="12" opacity=".85" />
      </g>);
    case 'reading': // shelf of spines
      return (<g>
        {[[40, 100], [86, 128], [132, 86], [178, 140], [224, 108], [270, 92]].map(([x, h], i) => (
          <rect key={x} x={x} y={160 - h} width="34" height={h} rx="4" {...F} opacity={i % 2 ? .72 : 1} />
        ))}
        <rect x="24" y="160" width="272" height="12" rx="6" {...F} />
      </g>);
    default:
      return (<g><circle cx="160" cy="90" r="56" {...S} strokeWidth="14" /><path d="M160 50 v80 M120 90 h80" {...S} strokeWidth="14" /></g>);
  }
}

/** Full-bleed poster cover for a club card. */
export default function ClubArt({ categoryKey, className = '', style }) {
  const c = CATEGORY_BY_KEY[categoryKey] || { c1: '#12345c', c2: '#f2a828' };
  return (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" className={className} style={style} aria-hidden="true">
      <rect width="320" height="180" fill={c.c1} />
      <Plate k={categoryKey} ink={c.c2} paper={c.c1} />
    </svg>
  );
}

/* ── monoline glyphs for chips (no emoji, anywhere) ────────────────────── */
const GLYPH = {
  coding: 'M9 8 L5 12 L9 16 M15 8 L19 12 L15 16',
  chess: 'M8 19 h8 M9 19 c0-4 6-4 6-8 a3 3 0 1 0-6 0',
  art: 'M12 4 a8 8 0 1 0 0 16 c1.5 0 2-1 1.5-2 s0-2 1.5-2 h1 A5 5 0 0 0 12 4z',
  drama: 'M5 5 v7 a7 7 0 0 0 14 0 V5 M9 15 a4 4 0 0 0 6 0',
  debate: 'M12 4 v9 M9 7 a4 4 0 0 1 6 0 M12 16 v4 M8 20 h8',
  writing: 'M4 20 l3-1 11-11-2-2L5 17z M15 6 l3 3',
  science: 'M12 12 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0-4 0 M4 12 a8 4 0 1 0 16 0 a8 4 0 1 0-16 0 M6 6 a4 8 0 1 0 12 12',
  music: 'M9 18 V6 l9-2 v12 M9 18 a2 2 0 1 1-4 0 a2 2 0 0 1 4 0 M18 16 a2 2 0 1 1-4 0 a2 2 0 0 1 4 0',
  film: 'M12 4 a8 8 0 1 0 0 16 a8 8 0 0 0 0-16 M12 12 L19 9 M12 12 L8 19 M12 12 L5 10',
  languages: 'M12 4 a8 8 0 1 0 0 16 a8 8 0 0 0 0-16 M4 12 h16 M12 4 a12 8 0 0 1 0 16 a12 8 0 0 1 0-16',
  entrepreneur: 'M5 18 v-4 M11 18 v-8 M17 18 v-12 M4 8 l5-3 4 3 6-5',
  games: 'M7 8 h4 v-3 h2 v3 h4 v9 h-10z M9 12 h6',
  life: 'M5 11 h11 a5 5 0 0 1-11 0z M16 11 h4 M8 6 q2-2 0-4 M12 6 q2-2 0-4',
  reading: 'M4 6 v12 h7 v-12z M13 6 v12 h7 v-12z M4 6 h7 M13 6 h7',
};

/** Small monoline mark for a category — crafted, not an emoji. */
export function ClubGlyph({ categoryKey, className = 'w-4 h-4', color = 'currentColor' }) {
  const d = GLYPH[categoryKey];
  if (!d) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
