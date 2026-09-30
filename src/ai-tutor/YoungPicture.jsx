// Pictures for the Grade 2-4 fraction and position lessons (specs come from
// content/pictureLessons.js). Plain SVG, no interaction: the child answers with
// the tap buttons. `PickOption` draws one picture inside a choice button.

import React, { useId } from 'react';

const LINE = '#8a6a3a', SHADE = '#e8336d', INK = '#1d1a16', MUTED = '#8a7f72';
const BASE = { circle: '#f3d9a4', rect: '#fffdf8' };

// ---- shapes: equal sectors / strips, or deliberately unequal parts ----------
function sectorPath(cx, cy, r, a0, a1) {
  const p = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`;
}

// Rectangles that tile a box: strips across, or a 2-row grid.
function rectRegions(x, y, w, h, parts, equal, layout) {
  if (!equal) {
    // Unequal on purpose: the first cut is well off-centre.
    const cuts = parts === 2 ? [0.68] : parts === 4 ? [0.15, 0.4, 0.72] : [0.06, 0.14, 0.25, 0.38, 0.52, 0.68, 0.84];
    const xs = [0, ...cuts, 1];
    return xs.slice(0, -1).map((a, i) => ({ x: x + a * w, y, w: (xs[i + 1] - a) * w, h }));
  }
  if (layout === 'grid' || parts === 8) {
    const cols = parts / 2;
    return [...Array(parts).keys()].map(i => ({ x: x + (i % cols) * (w / cols), y: y + Math.floor(i / cols) * (h / 2), w: w / cols, h: h / 2 }));
  }
  return [...Array(parts).keys()].map(i => ({ x: x + i * (w / parts), y, w: w / parts, h }));
}

function Shape({ spec, size = 190 }) {
  const clip = useId().replace(/:/g, '');
  const { shape, parts, equal, shaded = [], layout } = spec;
  if (shape === 'circle') {
    const cx = 100, cy = 100, r = 86;
    let body;
    if (equal) {
      body = [...Array(parts).keys()].map(i => {
        const a0 = -Math.PI / 2 + (i * 2 * Math.PI) / parts, a1 = a0 + (2 * Math.PI) / parts;
        return <path key={i} d={sectorPath(cx, cy, r, a0, a1)} fill={shaded.includes(i) ? SHADE : BASE.circle} fillOpacity={shaded.includes(i) ? 0.75 : 1} stroke={LINE} strokeWidth="3" />;
      });
    } else {
      // Off-centre cuts through the circle, clipped to it.
      const regs = rectRegions(cx - r, cy - r, 2 * r, 2 * r, parts, false, 'strips');
      body = (
        <g clipPath={`url(#${clip})`}>
          {regs.map((g, i) => <rect key={i} x={g.x} y={g.y} width={g.w} height={g.h} fill={i === 0 ? SHADE : BASE.circle} fillOpacity={i === 0 ? 0.75 : 1} stroke={LINE} strokeWidth="3" />)}
        </g>
      );
    }
    return (
      <svg viewBox="0 0 200 200" width={size} role="img" aria-label={`a circle cut into ${parts} ${equal ? 'equal' : 'unequal'} parts`}>
        <defs><clipPath id={clip}><circle cx={cx} cy={cy} r={r} /></clipPath></defs>
        {!equal && <circle cx={cx} cy={cy} r={r} fill={BASE.circle} />}
        {body}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={LINE} strokeWidth="3" />
      </svg>
    );
  }
  const regs = rectRegions(10, 15, 220, 120, parts, equal, layout);
  return (
    <svg viewBox="0 0 240 150" width={size * 1.2} role="img" aria-label={`a rectangle cut into ${parts} ${equal ? 'equal' : 'unequal'} parts`}>
      {regs.map((g, i) => {
        const on = equal ? shaded.includes(i) : i === 0;
        return <rect key={i} x={g.x} y={g.y} width={g.w} height={g.h} fill={on ? SHADE : BASE.rect} fillOpacity={on ? 0.75 : 1} stroke={LINE} strokeWidth="3" />;
      })}
    </svg>
  );
}

// ---- a group of objects with the first k circled ----------------------------
const ITEM_FILL = { orange: ['#f59e0b', '#b45309'], egg: ['#fff7e6', '#a8895c'], mango: ['#f2b233', '#8a6a1f'], sweet: ['#e8336d', '#8f1d42'], ball: ['#1f8a7a', '#0c4a40'], pencil: ['#fde68a', '#8a6a3a'] };
function Group({ n, circled, item }) {
  const [fill, stroke] = ITEM_FILL[item] || ITEM_FILL.orange;
  const cols = 4, rows = Math.ceil(n / cols);
  const pos = (i) => [35 + (i % cols) * 60, 35 + Math.floor(i / cols) * 58];
  const [x0, y0] = pos(0), [x1] = pos(circled - 1);
  return (
    <svg viewBox={`0 0 250 ${rows * 58 + 14}`} width="250" role="img" aria-label={`${n} ${item}s, ${circled} circled`}>
      {[...Array(n).keys()].map(i => {
        const [x, y] = pos(i);
        return item === 'pencil'
          ? <rect key={i} x={x - 6} y={y - 20} width="12" height="40" rx="2" fill={fill} stroke={stroke} strokeWidth="2" />
          : item === 'egg' || item === 'mango'
            ? <ellipse key={i} cx={x} cy={y} rx="15" ry="19" fill={fill} stroke={stroke} strokeWidth="2" />
            : <circle key={i} cx={x} cy={y} r="17" fill={fill} stroke={stroke} strokeWidth="2" />;
      })}
      <rect x={x0 - 26} y={y0 - 26} width={x1 - x0 + 52} height="52" rx="24" fill="none" stroke={SHADE} strokeWidth="3.5" />
    </svg>
  );
}

function Plates({ total, plates, item }) {
  const cols = Math.min(plates, 4), rows = Math.ceil(plates / 4), w = cols * 62 + 10;
  return (
    <svg viewBox={`0 0 ${w} ${60 + rows * 40}`} width={Math.min(260, w)} role="img" aria-label={`${total} ${item} and ${plates} plates`}>
      <text x={w / 2} y="35" textAnchor="middle" fontFamily="Georgia" fontSize="16" fill={MUTED}>{total} {item}</text>
      {[...Array(plates).keys()].map(i => <ellipse key={i} cx={36 + (i % 4) * 62} cy={80 + Math.floor(i / 4) * 40} rx="27" ry="11" fill="#fff" stroke={LINE} strokeWidth="2.5" />)}
    </svg>
  );
}

// ---- position: a person seen from above, walking up or down the page --------
function Walker({ x, y, down }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${down ? 180 : 0})`}>
      <path d="M0 -26 L-8 -14 L8 -14 Z" fill={INK} />
      <circle cx="0" cy="-4" r="8" fill="#6b3f1f" />
      <rect x="-8" y="4" width="16" height="18" rx="4" fill={SHADE} />
    </g>
  );
}
function Place({ x, y, label }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-26" y="0" width="52" height="34" fill="#fde68a" stroke={LINE} strokeWidth="2" />
      <path d="M-32 2 L0 -18 L32 2 Z" fill="#c0392b" />
      <text x="0" y="24" textAnchor="middle" fontSize="11" fontFamily="system-ui" fill={INK}>{label}</text>
    </g>
  );
}
// T-junction. places = [screen-left, screen-right].
function Junction({ facing, places }) {
  const down = facing === 'down';
  const roadY = down ? 110 : 70;
  return (
    <svg viewBox="0 0 260 220" width="240" role="img" aria-label={`a road junction with the ${places[0]} on the left and the ${places[1]} on the right of the picture`}>
      <rect x="110" y={down ? 0 : 70} width="40" height="150" fill="#e9dcc3" />
      <rect x="10" y={roadY} width="240" height="40" fill="#e9dcc3" />
      <Place x={45} y={down ? 168 : 20} label={places[0]} />
      <Place x={215} y={down ? 168 : 20} label={places[1]} />
      <Walker x={130} y={down ? 30 : 190} down={down} />
    </svg>
  );
}
// Straight, then a turn to the screen side `turn`.
function Path({ facing, turn }) {
  const down = facing === 'down', sx = turn === 'left' ? -1 : 1;
  const y0 = down ? 20 : 185, y1 = down ? 150 : 50, bend = down ? -20 : 20;
  const endX = 110 + sx * 85;
  const d = `M110 ${y0} L110 ${y1 + bend} Q110 ${y1} ${110 + sx * 20} ${y1} L${endX} ${y1}`;
  return (
    <svg viewBox="0 0 220 205" width="210" role="img" aria-label="a path that goes straight, then turns">
      <path d={d} fill="none" stroke={SHADE} strokeWidth="7" strokeLinecap="round" />
      <path d={`M${endX + sx * 6} ${y1} L${endX - sx * 14} ${y1 - 12} L${endX - sx * 14} ${y1 + 12} Z`} fill={SHADE} />
      <circle cx="110" cy={y0} r="9" fill={INK} />
      <text x="126" y={y0 + 5} fontSize="12" fontFamily="system-ui" fill={MUTED}>start</text>
    </svg>
  );
}

// ---- turning arrows ---------------------------------------------------------
// Arc from angle a0 through `sweep` radians (positive = clockwise on screen).
function Arrow({ cx, cy, r, a0, sweep, color = SHADE, width = 5 }) {
  const n = 40, pts = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + (sweep * i) / n;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  const a1 = a0 + sweep, s = Math.sign(sweep);
  const ex = cx + r * Math.cos(a1), ey = cy + r * Math.sin(a1);
  const tx = -Math.sin(a1) * s, ty = Math.cos(a1) * s;   // direction of travel
  const nx = Math.cos(a1), ny = Math.sin(a1);
  const head = `M${(ex + tx * 10).toFixed(1)} ${(ey + ty * 10).toFixed(1)} L${(ex + nx * 8).toFixed(1)} ${(ey + ny * 8).toFixed(1)} L${(ex - nx * 8).toFixed(1)} ${(ey - ny * 8).toFixed(1)} Z`;
  return (
    <g>
      <path d={`M${pts.join(' L')}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
      <path d={head} fill={color} />
    </g>
  );
}
const numAngle = (n) => ((n % 12) / 12) * 2 * Math.PI - Math.PI / 2;

function Clock({ from, quarters, dir }) {
  const s = dir === 'clockwise' ? 1 : -1;
  const a0 = numAngle(from), full = quarters === 4;
  const sweep = s * (full ? 2 * Math.PI - 0.5 : quarters * (Math.PI / 2) - 0.25);
  const hx = 100 + 52 * Math.cos(a0), hy = 100 + 52 * Math.sin(a0);
  return (
    <svg viewBox="-14 -14 228 228" width="200" role="img" aria-label={`a clock with an arrow turning ${dir}`}>
      <circle cx="100" cy="100" r="80" fill="#fff" stroke={INK} strokeWidth="3" />
      <g fontFamily="Georgia" fontSize="16" textAnchor="middle" fill={INK}>
        <text x="100" y="40">12</text><text x="166" y="106">3</text><text x="100" y="172">6</text><text x="34" y="106">9</text>
      </g>
      <line x1="100" y1="100" x2={hx} y2={hy} stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="100" r="5" fill={INK} />
      <Arrow cx={100} cy={100} r={96} a0={a0 + s * 0.08} sweep={sweep} />
    </svg>
  );
}

function Spin({ label, dir }) {
  const s = dir === 'clockwise' ? 1 : -1;
  return (
    <svg viewBox="0 0 200 200" width="180" role="img" aria-label={`a ${label} turning ${dir}`}>
      <circle cx="100" cy="100" r="46" fill="#fde68a" stroke={LINE} strokeWidth="3" />
      <line x1="100" y1="58" x2="100" y2="142" stroke={LINE} strokeWidth="3" />
      <line x1="58" y1="100" x2="142" y2="100" stroke={LINE} strokeWidth="3" />
      <text x="100" y="192" textAnchor="middle" fontSize="13" fontFamily="system-ui" fill={MUTED}>{label}</text>
      <Arrow cx={100} cy={100} r={66} a0={-Math.PI / 2 - s * 1.9} sweep={s * 3.8} />
    </svg>
  );
}

// A room from above: door (top), cupboard (right), window (bottom), blackboard (left).
function Room({ quarters, dir }) {
  const s = dir === 'clockwise' ? 1 : -1;
  return (
    <svg viewBox="0 0 220 200" width="210" role="img" aria-label="a room seen from above with a child facing the door">
      <rect x="20" y="10" width="180" height="180" fill="#fffdf8" stroke={LINE} strokeWidth="2" />
      <rect x="85" y="10" width="50" height="10" fill="#c9a36b" stroke={LINE} strokeWidth="2" />
      <text x="110" y="36" textAnchor="middle" fontSize="11" fontFamily="system-ui" fill={MUTED}>door</text>
      <rect x="80" y="180" width="60" height="10" fill="#bfe3f2" stroke="#4b8aa6" strokeWidth="2" />
      <text x="110" y="173" textAnchor="middle" fontSize="11" fontFamily="system-ui" fill={MUTED}>window</text>
      <rect x="188" y="75" width="12" height="50" fill="#c9a36b" stroke={LINE} strokeWidth="2" />
      <text x="182" y="140" textAnchor="end" fontSize="11" fontFamily="system-ui" fill={MUTED}>cupboard</text>
      <rect x="20" y="70" width="8" height="60" fill="#2f3b33" />
      <text x="34" y="145" fontSize="11" fontFamily="system-ui" fill={MUTED}>blackboard</text>
      <Walker x={110} y={104} />
      {quarters > 0 && (
        <Arrow cx={110} cy={100} r={34} a0={-Math.PI / 2 + s * 0.2}
          sweep={s * (quarters === 4 ? 2 * Math.PI - 0.6 : quarters * (Math.PI / 2) - 0.3)} width={3} />
      )}
    </svg>
  );
}

export function PickOption({ spec }) {
  return <Shape spec={spec} size={80} />;
}

export function YoungPicture({ picture, withLetters = true }) {
  if (!picture) return null;
  let body;
  switch (picture.kind) {
    case 'shape': body = <Shape spec={picture} />; break;
    case 'group': body = <Group {...picture} />; break;
    case 'plates': body = <Plates {...picture} />; break;
    case 'junction': body = <Junction {...picture} />; break;
    case 'path': body = <Path {...picture} />; break;
    case 'clock': body = <Clock {...picture} />; break;
    case 'spin': body = <Spin {...picture} />; break;
    case 'room': body = <Room {...picture} />; break;
    case 'pick':
      body = (
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          {picture.options.map((o, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <Shape spec={o} size={90} />
              {withLetters && <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600 }}>{'ABC'[i]}</div>}
            </div>
          ))}
        </div>
      );
      break;
    default: return null;
  }
  return <div className="young-pic" style={{ display: 'flex', justifyContent: 'center', margin: '4px auto 14px', maxWidth: '100%' }}>{body}</div>;
}
