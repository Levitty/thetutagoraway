// The lesson whiteboard.
//
// The board is a square page that looks the same on every screen, so a mark
// made on a laptop lands in the same place on a phone, including on top of a
// shared homework photo. Drawing is kept as lines (not pixels): that lets it
// be redrawn at any size, caught up for someone who joins late or reconnects,
// undone, and saved as lesson notes at the end.
//
// Sync is live between the two people in the lesson (Supabase Realtime
// broadcast); nothing is stored until the notes are saved.
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { supabase } from '../supabase';

const PAPER = '#fffdf8', LINE = '#ece4d8', INK = '#121117', INK2 = '#3f3f4a';
export const PENS = ['#121117', '#e5484d', '#3b5bdb', '#30a46c', '#f08c00'];
const PEN_W = 0.0072;    // line width as a share of the page size
const ERASER_W = 0.05;
const PHOTO_PAD = 0.025; // photo inset as a share of the page size
const TOP = 60, SIDE = 12;
const CHUNK = 24000;     // live messages have a size limit; big things go in pieces

const P = {
  undo: 'M9 14L4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11',
  eraser: 'M7 21h10M5.5 13.5l7-7a2 2 0 0 1 2.8 0l3.2 3.2a2 2 0 0 1 0 2.8L12 19H8.5l-3-3a1.8 1.8 0 0 1 0-2.5zM9 10l5 5',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  left: 'M15 18l-6-6 6-6', right: 'M9 18l6-6-6-6', plus: 'M12 5v14M5 12h14', close: 'M6 6l12 12M18 6L6 18',
};
const I = ({ d, s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

const newId = (who) => `${String(who || 'x').slice(0, 6)}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

// Draw one page (photo and strokes) onto a 2D context of the given size.
const paintStrokes = (ctx, strokes, size) => {
  for (const s of strokes) {
    if (!s.pts.length) continue;
    ctx.save();
    ctx.globalCompositeOperation = s.tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = s.color; ctx.fillStyle = s.color;
    ctx.lineWidth = (s.tool === 'eraser' ? ERASER_W : PEN_W) * size;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (s.pts.length === 1) {
      ctx.beginPath(); ctx.arc(s.pts[0][0] * size, s.pts[0][1] * size, ctx.lineWidth / 2, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.beginPath(); ctx.moveTo(s.pts[0][0] * size, s.pts[0][1] * size);
      for (let i = 1; i < s.pts.length; i++) ctx.lineTo(s.pts[i][0] * size, s.pts[i][1] * size);
      ctx.stroke();
    }
    ctx.restore();
  }
};
const loadImg = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });

export const Whiteboard = forwardRef(function Whiteboard({ channelName, userId, onNote, onChange, bottom = 60 }, ref) {
  const BOTTOM = bottom; // room kept free under the page (pages bar, and faces on phones)
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const chanRef = useRef(null);
  const strokes = useRef(new Map());   // id -> { id, by, page, color, tool, pts }
  const photos = useRef({});           // page -> data URL
  const undoStack = useRef([]);        // my own actions, newest last
  const drawing = useRef(null);        // { id, pending: [] } while my pen is down
  const flushTimer = useRef(null);
  const bigParts = useRef({});
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(1);
  const [size, setSize] = useState(0);
  const [top, setTop] = useState(TOP);
  const [color, setColor] = useState(PENS[0]);
  const [tool, setTool] = useState('pen');
  const [, setTick] = useState(0);
  const pageRef = useRef(0); pageRef.current = page;
  const countRef = useRef(1); countRef.current = count;
  // Handlers registered once read the latest callbacks through refs.
  const onChangeRef = useRef(onChange); onChangeRef.current = onChange;
  const onNoteRef = useRef(onNote); onNoteRef.current = onNote;
  const bump = () => { setTick(t => t + 1); onChangeRef.current?.(); };

  // ---- drawing on screen
  const redraw = useCallback(() => {
    const c = canvasRef.current;
    if (!c || !size) return;
    const ctx = c.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    paintStrokes(ctx, [...strokes.current.values()].filter(s => s.page === pageRef.current), size);
  }, [size]);
  const frame = useRef(0);
  const redrawRef = useRef(redraw); redrawRef.current = redraw;
  const scheduleRedraw = () => { cancelAnimationFrame(frame.current); frame.current = requestAnimationFrame(() => redrawRef.current()); };

  // The page is the largest square that fits between the toolbar and the pager.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const sz = Math.max(120, Math.floor(Math.min(r.width - SIDE * 2, r.height - TOP - BOTTOM)));
      setSize(sz);
      setTop(TOP + Math.max(0, Math.floor((r.height - TOP - BOTTOM - sz) / 2))); // centred in the free space
    };
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [BOTTOM]);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !size) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(size * dpr); c.height = Math.round(size * dpr);
    redraw();
  }, [size, redraw]);
  useEffect(() => { scheduleRedraw(); }, [page]);

  // ---- live sync
  const send = (event, payload) => chanRef.current?.send({ type: 'broadcast', event, payload });
  const sendBig = async (kind, obj) => {
    const s = JSON.stringify(obj), mid = newId(userId), n = Math.max(1, Math.ceil(s.length / CHUNK));
    for (let i = 0; i < n; i++) {
      await send('big', { mid, i, n, kind, d: s.slice(i * CHUNK, (i + 1) * CHUNK) });
      if (n > 1) await new Promise(r => setTimeout(r, 50));
    }
  };
  const snapshot = () => ({ strokes: [...strokes.current.values()], photos: photos.current, page: pageRef.current, count: countRef.current });
  const hasContent = () => strokes.current.size > 0 || Object.keys(photos.current).length > 0;

  const merge = ({ strokes: list = [], photos: ph = {}, count: n = 1 }) => {
    for (const s of list) {
      const mine = strokes.current.get(s.id);
      if (!mine || (s.pts?.length || 0) > mine.pts.length) strokes.current.set(s.id, { ...s, pts: s.pts || [] });
    }
    photos.current = { ...ph, ...photos.current };
    setCount(c => Math.max(c, n || 1));
    scheduleRedraw(); bump();
  };

  const onBig = (kind, obj) => {
    if (kind === 'state') merge(obj);
    else if (kind === 'photo') {
      photos.current = { ...photos.current, [obj.page]: obj.data };
      setCount(c => Math.max(c, obj.page + 1)); setPage(obj.page);
      onNoteRef.current?.('photo'); bump();
    } else if (kind === 'restore') {
      for (const s of obj.strokes || []) strokes.current.set(s.id, s);
      if (obj.photo) photos.current = { ...photos.current, [obj.page]: obj.photo };
      scheduleRedraw(); bump();
    }
  };

  useEffect(() => {
    const ch = supabase.channel(`whiteboard2-${channelName}`, { config: { broadcast: { self: false } } });
    ch.on('broadcast', { event: 'pts' }, ({ payload: p }) => {
      let s = strokes.current.get(p.id);
      if (!s) { s = { id: p.id, by: p.by, page: p.page, color: p.color, tool: p.tool, pts: [] }; strokes.current.set(p.id, s); }
      s.pts.push(...p.pts);
      if (s.page === pageRef.current) scheduleRedraw();
      onChangeRef.current?.();
    });
    ch.on('broadcast', { event: 'undo' }, ({ payload: { id } }) => { strokes.current.delete(id); scheduleRedraw(); bump(); });
    ch.on('broadcast', { event: 'clear' }, ({ payload: { page: pg } }) => {
      for (const [id, s] of strokes.current) if (s.page === pg) strokes.current.delete(id);
      const { [pg]: _gone, ...rest } = photos.current; photos.current = rest;
      scheduleRedraw(); bump();
    });
    ch.on('broadcast', { event: 'photo-remove' }, ({ payload: { page: pg } }) => { const { [pg]: _g, ...rest } = photos.current; photos.current = rest; bump(); });
    ch.on('broadcast', { event: 'page' }, ({ payload: { page: pg, count: n } }) => { setCount(c => Math.max(c, n)); setPage(pg); });
    ch.on('broadcast', { event: 'hello' }, () => { if (hasContent()) sendBig('state', snapshot()); });
    ch.on('broadcast', { event: 'big' }, ({ payload: { mid, i, n, kind, d } }) => {
      const got = bigParts.current[mid] || (bigParts.current[mid] = { n, parts: [] });
      got.parts[i] = d;
      if (got.parts.filter(x => x != null).length === n) {
        delete bigParts.current[mid];
        try { onBig(kind, JSON.parse(got.parts.join(''))); } catch { /* ignore a broken piece */ }
      }
    });
    // Say hello on (re)connecting: the other side answers with the board so far.
    ch.subscribe((status) => { if (status === 'SUBSCRIBED') send('hello', {}); });
    chanRef.current = ch;
    return () => { supabase.removeChannel(ch); clearInterval(flushTimer.current); };
  }, [channelName]);

  // ---- my pen
  const at = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return [Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))].map(v => Math.round(v * 10000) / 10000);
  };
  const flush = () => {
    const d = drawing.current;
    if (!d || !d.pending.length) return;
    const s = strokes.current.get(d.id);
    send('pts', { id: d.id, by: userId, page: s.page, color: s.color, tool: s.tool, pts: d.pending });
    d.pending = [];
  };
  const down = (e) => {
    e.preventDefault();
    canvasRef.current.setPointerCapture?.(e.pointerId);
    const id = newId(userId), p = at(e);
    strokes.current.set(id, { id, by: userId, page: pageRef.current, color, tool, pts: [p] });
    drawing.current = { id, pending: [p] };
    clearInterval(flushTimer.current);
    flushTimer.current = setInterval(flush, 50); // a few messages a second, not one per movement
    scheduleRedraw();
  };
  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const p = at(e), s = strokes.current.get(drawing.current.id), last = s.pts[s.pts.length - 1];
    if (Math.abs(p[0] - last[0]) + Math.abs(p[1] - last[1]) < 0.002) return;
    s.pts.push(p); drawing.current.pending.push(p);
    scheduleRedraw();
  };
  const up = () => {
    if (!drawing.current) return;
    flush(); clearInterval(flushTimer.current);
    undoStack.current.push({ type: 'stroke', id: drawing.current.id });
    drawing.current = null;
    bump();
  };

  // ---- actions
  const undo = () => {
    const a = undoStack.current.pop();
    if (!a) return;
    if (a.type === 'stroke') { strokes.current.delete(a.id); send('undo', { id: a.id }); }
    else if (a.type === 'clear') {
      for (const s of a.strokes) strokes.current.set(s.id, s);
      if (a.photo) photos.current = { ...photos.current, [a.page]: a.photo };
      sendBig('restore', { page: a.page, strokes: a.strokes, photo: a.photo || null });
      goTo(a.page);
    } else if (a.type === 'photo') { removePhoto(a.page, false); }
    scheduleRedraw(); bump();
  };
  const clearPage = () => {
    const pg = pageRef.current;
    const gone = [...strokes.current.values()].filter(s => s.page === pg);
    const photo = photos.current[pg];
    if (!gone.length && !photo) return;
    gone.forEach(s => strokes.current.delete(s.id));
    const { [pg]: _p, ...rest } = photos.current; photos.current = rest;
    undoStack.current.push({ type: 'clear', page: pg, strokes: gone, photo });
    send('clear', { page: pg });
    scheduleRedraw(); bump();
  };
  const goTo = (pg, n = countRef.current) => { setPage(pg); send('page', { page: pg, count: n }); };
  const newPage = () => { const n = countRef.current + 1; setCount(n); goTo(n - 1, n); bump(); };
  const pageEmpty = (pg) => !photos.current[pg] && ![...strokes.current.values()].some(s => s.page === pg);
  const removePhoto = (pg = pageRef.current, remember = true) => {
    const photo = photos.current[pg];
    if (!photo) return;
    const { [pg]: _p, ...rest } = photos.current; photos.current = rest;
    if (remember) undoStack.current.push({ type: 'clear', page: pg, strokes: [], photo });
    send('photo-remove', { page: pg });
    bump();
  };

  useImperativeHandle(ref, () => ({
    // A shared photo goes on this page if it's empty, otherwise on a new one.
    async addPhoto(data) {
      let pg = pageRef.current, n = countRef.current;
      if (!pageEmpty(pg)) { n = countRef.current + 1; pg = n - 1; setCount(n); }
      photos.current = { ...photos.current, [pg]: data };
      undoStack.current.push({ type: 'photo', page: pg });
      setPage(pg); bump();
      await sendBig('photo', { page: pg, data });
      send('page', { page: pg, count: n });
    },
    hasContent,
    // Each page with something on it, as a JPEG, for the lesson notes.
    async exportPages(px = 1200) {
      const out = [];
      for (let pg = 0; pg < countRef.current; pg++) {
        if (pageEmpty(pg)) { out.push({ page: pg, blob: null }); continue; }
        const c = document.createElement('canvas'); c.width = px; c.height = px;
        const ctx = c.getContext('2d');
        ctx.fillStyle = PAPER; ctx.fillRect(0, 0, px, px);
        ctx.fillStyle = LINE;
        for (let y = px / 46; y < px; y += px / 23) for (let x = px / 46; x < px; x += px / 23) { ctx.beginPath(); ctx.arc(x, y, px / 700, 0, 7); ctx.fill(); }
        if (photos.current[pg]) {
          try {
            const img = await loadImg(photos.current[pg]);
            const pad = PHOTO_PAD * px, box = px - pad * 2, k = Math.min(box / img.width, box / img.height);
            const w = img.width * k, h = img.height * k;
            ctx.drawImage(img, (px - w) / 2, (px - h) / 2, w, h);
          } catch { /* skip a photo that won't load */ }
        }
        const ink = document.createElement('canvas'); ink.width = px; ink.height = px;
        paintStrokes(ink.getContext('2d'), [...strokes.current.values()].filter(s => s.page === pg), px);
        ctx.drawImage(ink, 0, 0);
        out.push({ page: pg, blob: await new Promise(r => c.toBlob(r, 'image/jpeg', 0.85)) });
      }
      return out;
    },
  }));

  const photo = photos.current[page];
  const mine = undoStack.current.length > 0;
  return (
    <div ref={wrapRef} className="absolute inset-0" style={{ background: '#f4efe7' }}>
      {/* Toolbar: pens, eraser, undo, clear page. */}
      <div className="absolute top-3 left-3 z-[2] flex items-center gap-1.5 p-1.5 rounded-full bg-white shadow-sm" style={{ border: `1.5px solid ${LINE}` }}>
        {PENS.map(p => (
          <button key={p} type="button" aria-label="Pen colour" onClick={() => { setColor(p); setTool('pen'); }} className="w-7 h-7 rounded-full"
            style={{ background: p, boxShadow: tool === 'pen' && color === p ? `0 0 0 2.5px #fff, 0 0 0 4.5px ${p}` : 'none' }} />
        ))}
        <span className="w-px h-5 mx-0.5" style={{ background: LINE }} />
        <button type="button" aria-label="Eraser" aria-pressed={tool === 'eraser'} onClick={() => setTool('eraser')}
          className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: tool === 'eraser' ? INK : 'transparent', color: tool === 'eraser' ? '#fff' : INK2 }}><I d={P.eraser} /></button>
        <button type="button" aria-label="Undo" onClick={undo} disabled={!mine} className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-30" style={{ color: INK2 }}><I d={P.undo} /></button>
        <button type="button" aria-label="Clear this page" onClick={clearPage} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ color: '#c4302b' }}><I d={P.trash} /></button>
      </div>

      {/* The page: the same square on every screen. */}
      {size > 0 && (
        <div className="absolute rounded-[18px] overflow-hidden" style={{
          top, left: '50%', transform: 'translateX(-50%)', width: size, height: size,
          background: PAPER, backgroundImage: `radial-gradient(${LINE} ${size / 330}px, transparent ${size / 300}px)`, backgroundSize: `${size / 23}px ${size / 23}px`, backgroundPosition: `${size / 46}px ${size / 46}px`,
          boxShadow: '0 1px 0 #e6dfd5, 0 14px 30px -20px rgba(60,40,20,.35)', border: `1.5px solid ${LINE}`,
        }}>
          {photo && <img src={photo} alt="Shared homework" className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none" style={{ padding: PHOTO_PAD * size }} />}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ touchAction: 'none', cursor: tool === 'eraser' ? 'cell' : 'crosshair' }}
            onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={(e) => { if (e.pointerType === 'mouse') up(); }} />
          {photo && (
            <button type="button" onClick={() => removePhoto()} className="absolute top-2 right-2 h-8 pl-2 pr-3 rounded-full bg-white/95 text-[13px] font-bold flex items-center gap-1 shadow-sm" style={{ border: `1.5px solid ${LINE}`, color: INK2 }}>
              <I d={P.close} s={15} />Remove photo
            </button>
          )}
        </div>
      )}

      {/* Pages. */}
      <div className="absolute left-3 bottom-3 z-[2] flex items-center gap-1 p-1 rounded-full bg-white shadow-sm" style={{ border: `1.5px solid ${LINE}` }}>
        <button type="button" aria-label="Previous page" disabled={page === 0} onClick={() => goTo(page - 1)} className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-30" style={{ color: INK }}><I d={P.left} /></button>
        <span className="text-[13px] font-bold px-1 tabular-nums" style={{ color: INK2 }}><span className="hidden sm:inline">Page </span>{page + 1}<span className="hidden sm:inline"> of </span><span className="sm:hidden"> / </span>{count}</span>
        <button type="button" aria-label="Next page" disabled={page >= count - 1} onClick={() => goTo(page + 1)} className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-30" style={{ color: INK }}><I d={P.right} /></button>
        <button type="button" onClick={newPage} aria-label="New page" className="h-8 px-2 sm:pl-2 sm:pr-3 rounded-full text-[13px] font-bold flex items-center gap-1" style={{ background: INK, color: '#fff' }}><I d={P.plus} s={15} /><span className="hidden sm:inline">New page</span></button>
      </div>
    </div>
  );
});

export default Whiteboard;
