// Faces and tiles: who is in the lesson. A camera picture, or the person's
// first letter when the camera is off, or (the `children` slot) any other
// picture: HOREB in the tutor's seat. The ring shows who is talking: green
// while someone speaks (`speaking`), or another colour given as `ring`
// (yellow while HOREB looks at the board).
import React, { useEffect, useRef } from 'react';
import { C } from './colours.js';
import { Icon } from './Icon.jsx';

// fit: 'contain' shows the whole frame (right for a shared screen); 'cover'
// fills the tile (right for a face).
export const VideoPlayer = ({ track, fit = 'cover' }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && track) track.play(ref.current, { fit });
    return () => track?.stop();
  }, [track, fit]);
  return <div ref={ref} className="w-full h-full overflow-hidden" />;
};

const initialOf = (name) => (name || '?').trim()[0]?.toUpperCase();

// A round face: live video, the person's first letter, or a picture (children).
export const Face = ({ track, name, size, ring, tag, speaking, children }) => (
  <div className="relative shrink-0" style={{ width: size, height: size }}>
    <div className="w-full h-full rounded-full overflow-hidden" style={{
      border: '4px solid #fff', background: C.brandSoft,
      boxShadow: `${speaking ? `0 0 0 3px ${C.good},` : ring ? `0 0 0 3px ${ring},` : ''} 0 10px 24px -10px rgba(0,0,0,.35)`,
    }}>
      {children ? <div className="w-full h-full flex items-center justify-center">{children}</div>
        : track ? <VideoPlayer track={track} fit="cover" /> : (
          <div className="w-full h-full flex items-center justify-center font-extrabold" style={{ color: C.brandDeep, fontSize: size * 0.36 }}>{initialOf(name)}</div>
        )}
    </div>
    {tag && <span className="absolute left-1/2 -translate-x-1/2 -bottom-2 px-2.5 py-0.5 rounded-full text-[11.5px] font-bold text-white whitespace-nowrap" style={{ background: C.ink }}>{tag}</span>}
  </div>
);

// A rectangular tile for the desktop side column and the phone faces view.
//   ring     a colour for the ring when `speaking` is false (HOREB looking at the board)
//   dot      the name pill's dot colour (default: green while speaking)
//   tagTop   the name pill at the top left (HOREB's tile, so its caption has the bottom)
//   caption  words shown over the bottom of the tile
//   children a picture in place of the camera (HOREB) or a custom first letter
export const Tile = ({ track, name, label, speaking, fit = 'cover', muted, ring, dot, tagTop, caption, children }) => {
  const edge = speaking ? C.good : ring;
  const dotColour = dot !== undefined ? dot : speaking ? '#4cc38a' : null;
  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden" style={{ background: C.brandSoft, border: `1.5px solid ${C.line}`, boxShadow: edge ? `inset 0 0 0 3px ${edge}` : 'none' }}>
      {children || (track ? <VideoPlayer track={track} fit={fit} /> : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-extrabold bg-white" style={{ color: C.brandDeep }}>{initialOf(name)}</div>
        </div>
      ))}
      <span className={`absolute left-3 ${tagTop ? 'top-3' : 'bottom-3'} px-2.5 py-1 rounded-full text-[13px] font-bold text-white flex items-center gap-1.5`} style={{ background: 'rgba(18,17,23,.75)' }}>
        {dotColour && <span className="w-2 h-2 rounded-full" style={{ background: dotColour }} />}
        {muted && <Icon name="mic" slash className="w-3.5 h-3.5" />}{label}
      </span>
      {caption}
    </div>
  );
};

export default Tile;
