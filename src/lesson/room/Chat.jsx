// What was said in the lesson: the human room's chat, and HOREB's "What we
// said". The same messages and input in the desktop column (ChatPanel) and in
// the phone's bottom sheet (ChatSheet).
//   fade      the oldest lines fade out under the title (HOREB's room)
//   messages  [{ text, isRemote, who?, live? }]: theirs on the left, mine on the right;
//             `who` names the speaker above the words, `live` marks the line being said
import React, { useEffect, useRef } from 'react';
import { C, WELL } from './colours.js';
import { Icon } from './Icon.jsx';

export const Transcript = ({ messages, empty, value, onChange, onSend, placeholder, footnote = null, disabled = false, maxLength = 1000, inputLabel, autoFocus = false, scrollKey, fade = false }) => {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [scrollKey === undefined ? messages : scrollKey]);
  return (
    <>
      <div className="flex-1 overflow-y-auto min-h-0 space-y-2 px-4 py-3" style={fade ? { WebkitMaskImage: 'linear-gradient(transparent, #000 28px)', maskImage: 'linear-gradient(transparent, #000 28px)' } : undefined}>
        {messages.length === 0 ? <div className="text-center text-sm py-8" style={{ color: C.mute }}>{empty}</div> : messages.map((m, i) => (
          <div key={i} className={`flex ${m.isRemote ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-[15px] leading-snug ${m.isRemote ? 'rounded-bl-md' : 'rounded-br-md'}`}
              style={{ background: m.isRemote ? WELL : C.brandSoft, color: C.ink, ...(m.live ? { boxShadow: `inset 3px 0 0 ${C.good}` } : null) }}>
              {m.who ? <small className="block text-[11.5px] font-extrabold" style={{ color: C.mute }}>{m.who}</small> : null}
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="px-3 pb-3 pt-2 shrink-0">
        <div className="flex gap-2">
          <input value={value} onChange={e => onChange(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSend()} maxLength={maxLength} disabled={disabled} autoFocus={autoFocus}
            aria-label={inputLabel} autoComplete="off"
            placeholder={placeholder} className="flex-1 min-w-0 h-11 px-4 rounded-full text-[15px] focus:outline-none" style={{ border: `1.5px solid ${C.line}`, background: '#fff', color: C.ink }} />
          <button type="button" onClick={onSend} disabled={disabled} className="h-11 px-5 rounded-full font-bold" style={{ background: C.ink, color: '#fff' }}>Send</button>
        </div>
        {footnote && <p className="text-[11px] mt-2 px-1" style={{ color: C.mute }}>{footnote}</p>}
      </div>
    </>
  );
};

// Desktop: the panel under the tiles.
export const ChatPanel = ({ title, children }) => (
  <div className="flex-1 min-h-0 rounded-3xl flex flex-col" style={{ background: '#fff', border: `1.5px solid ${C.line}` }}>
    <div className="px-4 pt-3 font-extrabold text-[15px]">{title}</div>
    {children}
  </div>
);

// Phone: a sheet over the board.
export const ChatSheet = ({ title, onClose, children, className = 'lg:hidden' }) => (
  <div className={`${className} fixed inset-0 z-[55] flex flex-col justify-end`} style={{ background: 'rgba(18,17,23,.35)' }} onClick={onClose}>
    <div className="h-[72%] rounded-t-[28px] flex flex-col" style={{ background: C.card, paddingBottom: 'env(safe-area-inset-bottom)' }} onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between px-5 pt-4 pb-1">
        <div className="font-extrabold text-[17px]">{title}</div>
        <button type="button" onClick={onClose} aria-label="Close" className="w-9 h-9 -mr-2 rounded-full flex items-center justify-center" style={{ color: C.ink2 }}><Icon name="close" className="w-5 h-5" /></button>
      </div>
      {children}
    </div>
  </div>
);

export default Transcript;
