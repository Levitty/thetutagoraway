// Today's step: what this lesson is for, in the room's yellow strip. The
// HOREB room adds the lesson's parts on the right (`children`).
//   compact  a phone: no target chip and no kicker, only the goal and the parts
import React from 'react';
import { C } from './colours.js';
import { Icon } from './Icon.jsx';

export const StepStrip = ({ kicker, value, children = null, compact = false, className = 'mx-4 lg:ml-6 lg:mr-[380px] mb-3', style = null }) => (
  <div className={`${className} rounded-[20px] px-4 py-3 flex items-center gap-3 shrink-0${compact ? ' flex-wrap' : ''}`} style={{ background: C.brandSoft, ...style }}>
    {!compact && <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.brand, color: C.ink }}><Icon name="target" className="w-5 h-5" sw={2} /></span>}
    <div className="min-w-0">
      {!compact && <div className="text-[11.5px] font-extrabold uppercase tracking-[.08em]" style={{ color: C.brandDeep }}>{kicker}</div>}
      <div className="text-[15px] font-bold leading-snug line-clamp-2">{value}</div>
    </div>
    {children}
  </div>
);

export default StepStrip;
