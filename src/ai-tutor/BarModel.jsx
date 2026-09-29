import React from 'react';

// Singapore bar model for a word problem (content/wordProblems.js `diagram`).
// Bars are drawn to scale inside one row; each row can carry a name label.
// Tones: 'a' pink (the part in focus), 'b' yellow (the other part),
// 'q' dashed (the unknown). Display only — the child still types the answer.
const TONE = {
  a: { fill: '#fde7ef', stroke: '#121117', dash: undefined },
  b: { fill: '#fde68a', stroke: '#121117', dash: undefined },
  q: { fill: '#ffffff', stroke: '#e8336d', dash: '5 4' },
};

export function BarModel({ diagram }) {
  if (!diagram || diagram.type !== 'bar' || !diagram.rows?.length) return null;
  const rows = diagram.rows;
  const hasLabels = rows.some(r => r.label);
  const LW = hasLabels ? 78 : 0, W = 320, RH = 34, GAP = 12, TOP = 6;
  // Rows share one scale so a comparison shows the real difference.
  const maxTotal = Math.max(...rows.map(r => r.segs.reduce((s, g) => s + g.w, 0)));
  const scale = (W - LW - 4) / maxTotal;
  const H = TOP + rows.length * (RH + GAP) + (diagram.note ? 18 : 0);
  return (
    <figure className="my-4 rounded-xl border border-slate-200 bg-[#f4f4f6] p-3" aria-label="Bar model picture">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img">
        {rows.map((r, ri) => {
          let x = LW;
          const y = TOP + ri * (RH + GAP);
          return (
            <g key={ri}>
              {r.label && <text x={LW - 8} y={y + RH / 2 + 5} textAnchor="end" fontSize="13" fontWeight="600" fill="#334155">{r.label}</text>}
              {r.segs.map((g, gi) => {
                const w = Math.max(g.w * scale, 14), t = TONE[g.tone] || TONE.a;
                const el = (
                  <g key={gi}>
                    <rect x={x} y={y} width={w} height={RH} fill={t.fill} stroke={t.stroke} strokeWidth="1.5" strokeDasharray={t.dash} />
                    {g.text && <text x={x + w / 2} y={y + RH / 2 + 5} textAnchor="middle" fontSize={g.text.length > 10 ? 11 : 13} fontWeight="700" fill={g.tone === 'q' ? '#e8336d' : '#121117'}>{g.text}</text>}
                  </g>
                );
                x += w;
                return el;
              })}
            </g>
          );
        })}
        {diagram.note && <text x={W - 4} y={H - 4} textAnchor="end" fontSize="13" fontWeight="700" fill="#e8336d">{diagram.note}</text>}
      </svg>
    </figure>
  );
}

export default BarModel;
