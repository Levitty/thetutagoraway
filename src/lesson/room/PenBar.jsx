// The board's toolbar pill: pens, eraser, undo, clear. The human board offers
// five pens; HOREB's board offers the child's one pen (its colour is how HOREB
// tells the child's writing from its own in a picture of the board).
import React from 'react';
import { C, DOTS, RED } from './colours.js';
import { BoardIcon } from './Icon.jsx';

export const PenBar = ({ pens, color, tool, onPen, onEraser, onUndo, canUndo, onClear, canClear, clearLabel = 'Clear this page', eraserLabel = 'Eraser', className = 'absolute top-3 left-3 z-[2]' }) => (
  <div className={`${className} flex items-center gap-1.5 p-1.5 rounded-full bg-white shadow-sm`} style={{ border: `1.5px solid ${DOTS}` }} role="toolbar" aria-label="Pen">
    {pens.map(p => (
      <button key={p} type="button" aria-label="Pen colour" onClick={() => onPen(p)} className="w-7 h-7 rounded-full"
        style={{ background: p, boxShadow: tool === 'pen' && color === p ? `0 0 0 2.5px #fff, 0 0 0 4.5px ${p}` : 'none' }} />
    ))}
    <span className="w-px h-5 mx-0.5" style={{ background: DOTS }} />
    <button type="button" aria-label={eraserLabel} aria-pressed={tool === 'eraser'} onClick={onEraser}
      className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: tool === 'eraser' ? C.ink : 'transparent', color: tool === 'eraser' ? '#fff' : C.ink2 }}><BoardIcon name="eraser" /></button>
    <button type="button" aria-label="Undo" onClick={onUndo} disabled={!canUndo} className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-30" style={{ color: C.ink2 }}><BoardIcon name="undo" /></button>
    <button type="button" aria-label={clearLabel} onClick={onClear} disabled={canClear === undefined ? undefined : !canClear} className={`w-8 h-8 rounded-full flex items-center justify-center${canClear === undefined ? '' : ' disabled:opacity-30'}`} style={{ color: RED }}><BoardIcon name="trash" /></button>
  </div>
);

export default PenBar;
