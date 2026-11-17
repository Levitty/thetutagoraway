// A dock button: rounded square, label underneath. States: normal, on (ink),
// hot (the one obvious button, yellow) and off (red: the microphone is off).
import React from 'react';
import { C } from './colours.js';
import { Icon } from './Icon.jsx';

export const DockButton = ({ name, label, onClick, state = 'normal', slash, badge, className = '', disabled = false }) => (
  <button type="button" onClick={onClick} aria-label={label} aria-pressed={state === 'on'} disabled={disabled} className={`flex flex-col items-center gap-1.5 shrink-0 ${className}${disabled ? ' opacity-50' : ''}`}>
    <span className="relative w-[52px] h-[52px] rounded-[18px] flex items-center justify-center transition-colors" style={
      state === 'on' ? { background: C.ink, color: '#fff' }
      : state === 'hot' ? { background: C.brand, color: C.ink }
      : state === 'off' ? { background: '#fde7e3', color: '#c4302b', border: '1.5px solid #f5c6bf' }
      : { background: '#fff', color: C.ink, border: `1.5px solid ${C.line}` }}>
      <Icon name={name} slash={slash} className="w-[22px] h-[22px]" />
      {badge ? <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full text-white text-[11px] font-bold flex items-center justify-center" style={{ background: '#e5484d' }}>{badge}</span> : null}
    </span>
    <span className="text-[12px] font-bold leading-none" style={{ color: C.ink2 }}>{label}</span>
  </button>
);

export default DockButton;
