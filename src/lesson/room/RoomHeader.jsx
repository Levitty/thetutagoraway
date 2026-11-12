// The room's header: a clear way out (Leave), what the lesson is and with whom,
// and anything on the right (the human room's clock).
import React from 'react';
import { C } from './colours.js';
import { Icon } from './Icon.jsx';

export const RoomHeader = ({ title, who, onLeave, children = null }) => (
  <header className="flex items-center gap-3 px-4 lg:px-6 shrink-0" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)', paddingBottom: '0.75rem' }}>
    <button type="button" onClick={onLeave} className="h-10 pl-2.5 pr-4 rounded-full font-bold text-[15px] flex items-center gap-1 shrink-0" style={{ background: '#fff', border: `1.5px solid ${C.line}`, color: C.ink2 }}>
      <Icon name="back" className="w-[18px] h-[18px]" />Leave
    </button>
    <div className="min-w-0 flex-1">
      <div className="font-extrabold text-[17px] tracking-tight truncate" style={{ fontFamily: '"Figtree Variable", sans-serif', fontStretch: '92%' }}>{title}</div>
      {who && <div className="text-[13px] font-semibold truncate" style={{ color: C.mute }}>{who}</div>}
    </div>
    {children}
  </header>
);

export default RoomHeader;
