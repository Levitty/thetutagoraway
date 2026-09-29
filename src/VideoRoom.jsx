import React, { useState, useEffect, useRef, useCallback } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { supabase } from './supabase';
import { Spreadsheet } from './Spreadsheet';

const AGORA_APP_ID = '35a8f51c866e44bfbb7bd5e3970e75e4';

// The lesson room: a light "classroom" where the whiteboard is the centre of
// the lesson and the faces sit beside it. Colours follow the public site.
const C = {
  paper: '#f7f3ee', card: '#fffdf8', line: '#ece4d8', ink: '#121117', ink2: '#3f3f4a', mute: '#6c6c78',
  brand: '#ffc53d', brandDeep: '#7a5200', brandSoft: '#fff3d1', good: '#30a46c', goodSoft: '#e3f3e9', amber: '#b86e00', amberSoft: '#fff1d6',
};

// ==================== ICONS (drawn, not emoji) ====================
const ICONS = {
  mic: 'M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3zM5 10v1a7 7 0 0 0 14 0v-1M12 19v3',
  video: 'M4 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM16 10l5-3v10l-5-3',
  screen: 'M3 4h18v12H3zM8 20h8M12 16v4',
  board: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  sheet: 'M3 4h18v16H3zM3 9h18M3 14h18M9 4v16M15 4v16',
  chat: 'M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z',
  close: 'M6 6l12 12M18 6L6 18',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  eraser: 'M7 21h10M5.5 13.5l7-7a2 2 0 0 1 2.8 0l3.2 3.2a2 2 0 0 1 0 2.8L12 19H8.5l-3-3a1.8 1.8 0 0 1 0-2.5zM9 10l5 5',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  photo: 'M3 7a2 2 0 0 1 2-2h2.5l1.5-2h6l1.5 2H19a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  back: 'M15 18l-6-6 6-6',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  faces: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M17 11a2.5 2.5 0 1 0 0-5M17.5 14.5A5 5 0 0 1 21 19',
};
const Icon = ({ name, className = 'w-5 h-5', slash, sw = 1.9 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d={ICONS[name]} />
    {slash && <path d="M4 4l16 16" />}
  </svg>
);

// ==================== VIDEO PLAYER ====================
// fit: 'contain' shows the whole frame (right for a shared screen); 'cover'
// fills the tile (right for a face).
const VideoPlayer = ({ track, fit = 'cover' }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && track) track.play(ref.current, { fit });
    return () => track?.stop();
  }, [track, fit]);
  return <div ref={ref} className="w-full h-full overflow-hidden" />;
};

// ==================== COLLABORATIVE WHITEBOARD ====================
// Strokes are drawn on a transparent layer over paper (and over a homework
// photo when one is shared), and synced to the other person live.
const PENS = ['#121117', '#e5484d', '#3b5bdb', '#30a46c', '#f08c00'];
const Whiteboard = ({ channelName, photo, onRemovePhoto }) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef(null);
  const channelRef = useRef(null);
  const [color, setColor] = useState(PENS[0]);
  const [tool, setTool] = useState('pen'); // pen | eraser

  const sizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ctx = canvas.getContext('2d');
    const keep = canvas.width ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;
    canvas.width = Math.round(rect.width * 2);
    canvas.height = Math.round(rect.height * 2);
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    if (keep) ctx.putImageData(keep, 0, 0);
  };

  const drawStroke = useCallback(({ fromX, fromY, toX, toY, color: c, width: w, tool: t }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.save();
    ctx.globalCompositeOperation = t === 'eraser' ? 'destination-out' : 'source-over';
    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.lineWidth = t === 'eraser' ? 26 : (w || 3.5);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(fromX * rect.width, fromY * rect.height);
    ctx.lineTo(toX * rect.width, toY * rect.height);
    ctx.stroke();
    ctx.restore();
  }, []);

  const clearCanvas = (broadcast = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    if (broadcast) channelRef.current?.send({ type: 'broadcast', event: 'clear', payload: {} });
  };

  useEffect(() => {
    const channel = supabase.channel(`whiteboard-${channelName}`, { config: { broadcast: { self: false } } });
    channel.on('broadcast', { event: 'draw' }, ({ payload }) => drawStroke(payload));
    channel.on('broadcast', { event: 'clear' }, () => clearCanvas(false));
    channel.subscribe();
    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [channelName]);

  // Size to the space it's given, and keep the drawing when that changes.
  useEffect(() => {
    sizeCanvas();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => sizeCanvas()) : null;
    if (ro && canvasRef.current) ro.observe(canvasRef.current);
    return () => ro?.disconnect();
  }, []);

  const point = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: (p.clientX - rect.left) / rect.width, y: (p.clientY - rect.top) / rect.height };
  };
  const start = (e) => { e.preventDefault(); isDrawing.current = true; lastPoint.current = point(e); };
  const move = (e) => {
    e.preventDefault();
    if (!isDrawing.current || !lastPoint.current) return;
    const p = point(e);
    const stroke = { fromX: lastPoint.current.x, fromY: lastPoint.current.y, toX: p.x, toY: p.y, color, width: 3.5, tool };
    drawStroke(stroke);
    channelRef.current?.send({ type: 'broadcast', event: 'draw', payload: stroke });
    lastPoint.current = p;
  };
  const end = () => { isDrawing.current = false; lastPoint.current = null; };

  return (
    <div className="absolute inset-0" style={{ background: C.card, backgroundImage: `radial-gradient(${C.line} 1.4px, transparent 1.6px)`, backgroundSize: '26px 26px' }}>
      {photo && <img src={photo} alt="Shared homework" className="absolute inset-0 w-full h-full object-contain p-3 pointer-events-none select-none" />}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none" style={{ cursor: tool === 'eraser' ? 'cell' : 'crosshair' }}
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end} />

      {/* Pens, eraser and clear: one small floating row. */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 p-1.5 rounded-full bg-white/95 shadow-sm" style={{ border: `1.5px solid ${C.line}` }}>
        {PENS.map(p => (
          <button key={p} type="button" aria-label="Pen colour" onClick={() => { setColor(p); setTool('pen'); }}
            className="w-7 h-7 rounded-full transition-transform"
            style={{ background: p, boxShadow: tool === 'pen' && color === p ? `0 0 0 2.5px #fff, 0 0 0 4.5px ${p}` : 'none', transform: tool === 'pen' && color === p ? 'scale(1.05)' : 'none' }} />
        ))}
        <span className="w-px h-5 mx-0.5" style={{ background: C.line }} />
        <button type="button" aria-label="Eraser" aria-pressed={tool === 'eraser'} onClick={() => setTool('eraser')}
          className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: tool === 'eraser' ? C.ink : 'transparent', color: tool === 'eraser' ? '#fff' : C.ink2 }}>
          <Icon name="eraser" className="w-[18px] h-[18px]" />
        </button>
        <button type="button" aria-label="Clear the board" onClick={() => clearCanvas(true)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ color: '#c4302b' }}>
          <Icon name="trash" className="w-[18px] h-[18px]" />
        </button>
      </div>
      {photo && (
        <button type="button" onClick={onRemovePhoto} className="absolute left-3 bottom-3 lg:bottom-auto lg:left-auto lg:top-3 lg:right-3 h-9 px-3 rounded-full bg-white/95 text-sm font-bold flex items-center gap-1.5 shadow-sm" style={{ border: `1.5px solid ${C.line}`, color: C.ink2 }}>
          <Icon name="close" className="w-4 h-4" />Remove photo
        </button>
      )}
    </div>
  );
};

// ==================== HELPERS ====================
const SUPPORT_WA = '254759240692';
const LATE_MIN = 10; // a tutor this late means the family can ask for a refund
const firstName = (s) => (s || '').trim().split(/\s+/)[0] || '';
const lessonStart = (b) => {
  if (!b?.lesson_date || !b?.start_time) return null;
  const t = new Date(`${b.lesson_date}T${String(b.start_time).slice(0, 5)}:00+03:00`).getTime();
  return Number.isFinite(t) ? t : null;
};

// A photo is shrunk on the phone, then sent to the other person in pieces
// (live messages have a size limit). It is never stored.
const shrinkPhoto = (file) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => {
    const max = 1400, k = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(img.src);
    resolve(c.toDataURL('image/jpeg', 0.72));
  };
  img.onerror = () => reject(new Error("That photo couldn't be opened. Try a JPG or PNG."));
  img.src = URL.createObjectURL(file);
});
const CHUNK = 24000;

// A round face: live video, or the person's first letter when the camera is off.
const Face = ({ track, name, size, ring, tag, speaking }) => (
  <div className="relative shrink-0" style={{ width: size, height: size }}>
    <div className="w-full h-full rounded-full overflow-hidden" style={{
      border: '4px solid #fff', background: C.brandSoft,
      boxShadow: `${speaking ? `0 0 0 3px ${C.good},` : ring ? `0 0 0 3px ${ring},` : ''} 0 10px 24px -10px rgba(0,0,0,.35)`,
    }}>
      {track ? <VideoPlayer track={track} fit="cover" /> : (
        <div className="w-full h-full flex items-center justify-center font-extrabold" style={{ color: C.brandDeep, fontSize: size * 0.36 }}>{(name || '?').trim()[0]?.toUpperCase()}</div>
      )}
    </div>
    {tag && <span className="absolute left-1/2 -translate-x-1/2 -bottom-2 px-2.5 py-0.5 rounded-full text-[11.5px] font-bold text-white whitespace-nowrap" style={{ background: C.ink }}>{tag}</span>}
  </div>
);

// A rectangular video tile for the desktop side column and the phone faces view.
const Tile = ({ track, name, label, speaking, fit = 'cover', muted }) => (
  <div className="relative w-full h-full rounded-3xl overflow-hidden" style={{ background: C.brandSoft, border: `1.5px solid ${C.line}`, boxShadow: speaking ? `inset 0 0 0 3px ${C.good}` : 'none' }}>
    {track ? <VideoPlayer track={track} fit={fit} /> : (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-extrabold bg-white" style={{ color: C.brandDeep }}>{(name || '?').trim()[0]?.toUpperCase()}</div>
      </div>
    )}
    <span className="absolute left-3 bottom-3 px-2.5 py-1 rounded-full text-[13px] font-bold text-white flex items-center gap-1.5" style={{ background: 'rgba(18,17,23,.75)' }}>
      {speaking && <span className="w-2 h-2 rounded-full" style={{ background: '#4cc38a' }} />}
      {muted && <Icon name="mic" slash className="w-3.5 h-3.5" />}{label}
    </span>
  </div>
);

// A dock button: rounded square, label underneath.
const DockButton = ({ name, label, onClick, state = 'normal', slash, badge, className = '' }) => (
  <button type="button" onClick={onClick} aria-label={label} aria-pressed={state === 'on'} className={`flex flex-col items-center gap-1.5 shrink-0 ${className}`}>
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

// ==================== MAIN VIDEO ROOM ====================
export const VideoRoom = ({ booking, user, onEnd }) => {
  const [client] = useState(() => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));
  const tracksRef = useRef({ audio: null, video: null, screen: null });
  const [local, setLocal] = useState({ audio: null, video: null });
  const [noCam, setNoCam] = useState(false);
  const [remote, setRemote] = useState(null);      // { user, v }: lessons are one to one
  const [everJoined, setEverJoined] = useState(false);
  const [speaking, setSpeaking] = useState({ me: false, them: false });
  const [phase, setPhase] = useState('connecting'); // connecting | live | error
  const [failure, setFailure] = useState(null);     // { kind, message }
  const [attempt, setAttempt] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [view, setView] = useState('board');        // phone: board | faces
  const [sheetOpen, setSheetOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);  // phone only; always shown on desktop
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [photo, setPhoto] = useState(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [note, setNote] = useState('');

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [unread, setUnread] = useState(0);
  const chatChannelRef = useRef(null);
  const photoChannelRef = useRef(null);
  const photoParts = useRef({});
  const chatEndRef = useRef(null);
  const chatOpenRef = useRef(false);
  chatOpenRef.current = chatOpen;
  const fileRef = useRef(null);

  const channelName = `lesson-${booking.id}`;
  const isTutor = user.role === 'tutor';
  const tutorName = booking.tutors?.profiles?.full_name || 'your tutor';
  const learnerName = booking.learner_name || booking.profiles?.full_name || 'your student';
  const otherName = isTutor ? learnerName : tutorName;
  const other = firstName(otherName) || otherName;
  const subject = (booking.subject || 'Lesson').replace(/^Mathematics$/i, 'Maths');
  const who = [firstName(learnerName), booking.learner_grade].filter(Boolean).join(' · ');
  // The step to work on: the parent's focus note, which carries the skill
  // the free check found when the booking came from a check result.
  const focusRaw = (booking.focus_note || '').trim();
  const fromCheck = /\(from the Tutagora check\)/i.test(focusRaw);
  const focus = focusRaw.replace(/\s*\(from the Tutagora check\)\s*/i, '').trim();

  // Lesson clock: time left, not time since joining.
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const startMs = lessonStart(booking);
  const endMs = startMs ? startMs + (Number(booking.duration_minutes) || 60) * 60000 : null;
  const minsTo = (ms) => Math.max(1, Math.ceil(ms / 60000));
  const clock = !startMs ? null
    : now < startMs ? { text: `Starts in ${minsTo(startMs - now)} min`, tone: 'soon' }
    : now < endMs ? { text: `${minsTo(endMs - now)} min left`, tone: endMs - now <= 5 * 60000 ? 'ending' : 'live' }
    : { text: "Time's up", tone: 'ending' };
  const tutorLate = !isTutor && !everJoined && startMs && now > startMs + LATE_MIN * 60000;
  const startLabel = startMs ? new Date(startMs).toLocaleTimeString('en-KE', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Africa/Nairobi' }) : '';

  // Chat: live between the two, and saved for 30 days in case of a complaint.
  useEffect(() => {
    supabase.from('lesson_messages').select('sender_id, sender_name, body, created_at').eq('booking_id', booking.id).order('created_at')
      .then(({ data, error }) => {
        if (error || !data?.length) return;
        setMessages(data.map(m => ({ text: m.body, sender: m.sender_name, time: m.created_at, isRemote: m.sender_id !== user.id })));
      });
    const channel = supabase.channel(`chat-${channelName}`, { config: { broadcast: { self: false } } });
    channel.on('broadcast', { event: 'message' }, ({ payload }) => {
      setMessages(prev => [...prev, { ...payload, isRemote: true }]);
      if (!chatOpenRef.current) setUnread(n => n + 1);
    });
    channel.subscribe();
    chatChannelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [channelName]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, chatOpen]);

  // Homework photos, sent live in pieces.
  useEffect(() => {
    const channel = supabase.channel(`photo-${channelName}`, { config: { broadcast: { self: false } } });
    channel.on('broadcast', { event: 'part' }, ({ payload: { id, i, n, d } }) => {
      const got = photoParts.current[id] || (photoParts.current[id] = { n, parts: [] });
      got.parts[i] = d;
      if (got.parts.filter(Boolean).length === n) {
        setPhoto(got.parts.join('')); setView('board');
        setNote(`${other} shared a photo on the board`);
        delete photoParts.current[id];
      }
    });
    channel.on('broadcast', { event: 'clear' }, () => setPhoto(null));
    channel.subscribe();
    photoChannelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [channelName]);
  useEffect(() => { if (!note) return; const t = setTimeout(() => setNote(''), 3500); return () => clearTimeout(t); }, [note]);

  const sharePhoto = async (file) => {
    if (!file) return;
    setPhotoBusy(true);
    try {
      const data = await shrinkPhoto(file);
      setPhoto(data); setView('board');
      const id = `${Date.now()}`, n = Math.ceil(data.length / CHUNK);
      for (let i = 0; i < n; i++) {
        await photoChannelRef.current?.send({ type: 'broadcast', event: 'part', payload: { id, i, n, d: data.slice(i * CHUNK, (i + 1) * CHUNK) } });
        await new Promise(r => setTimeout(r, 60));
      }
      setNote(`${other} can see the photo now`);
    } catch (e) { setNote(e.message || "The photo couldn't be shared."); }
    setPhotoBusy(false);
    if (fileRef.current) fileRef.current.value = '';
  };
  const removePhoto = () => { setPhoto(null); photoChannelRef.current?.send({ type: 'broadcast', event: 'clear', payload: {} }); };

  // The other person coming and going, and who is talking.
  useEffect(() => {
    const bump = (u) => setRemote({ user: u, v: Date.now() });
    client.on('user-joined', (u) => { setEverJoined(true); bump(u); });
    client.on('user-published', async (u, mediaType) => {
      await client.subscribe(u, mediaType);
      if (mediaType === 'audio') u.audioTrack?.play();
      setEverJoined(true); bump(u);
    });
    client.on('user-unpublished', (u) => bump(u));
    client.on('user-left', () => setRemote(null));
    client.on('volume-indicator', (vols) => {
      const me = vols.some(v => String(v.uid) === String(user.id) && v.level > 6);
      const them = vols.some(v => String(v.uid) !== String(user.id) && v.level > 6);
      setSpeaking(s => (s.me === me && s.them === them ? s : { me, them }));
    });
    try { client.enableAudioVolumeIndicator?.(); } catch { /* optional */ }
    return () => client.removeAllListeners();
  }, [client]);

  // Join: get a key for this lesson, then camera and microphone.
  useEffect(() => {
    let cancelled = false;
    const join = async () => {
      setPhase('connecting'); setFailure(null);
      try { await client.leave(); } catch { /* not joined yet */ }
      let appId = AGORA_APP_ID, token = null, channel = channelName, uid = user.id;
      const { data, error } = await supabase.functions.invoke('lesson-token', { body: { booking_id: booking.id } });
      if (data?.token) ({ appId = appId, token, channel = channel, uid = uid } = data);
      else if (error && [401, 403, 404].includes(error.context?.status)) {
        let body = {};
        try { body = await error.context.json(); } catch { /* no body */ }
        throw Object.assign(new Error(body.message || "You can't join this lesson."), { kind: 'denied' });
      }
      // No key (the key service isn't set up yet): the room still opens while
      // the video service accepts joins without one.
      try { await client.join(appId, channel, token, uid); }
      catch (e) { if (!token) throw e; await client.join(appId, channel, null, uid); }

      let audio = null, video = null;
      try { [audio, video] = await AgoraRTC.createMicrophoneAndCameraTracks(); }
      catch {
        try { audio = await AgoraRTC.createMicrophoneAudioTrack(); setNoCam(true); }
        catch (e) { throw Object.assign(new Error(e?.message || 'permission'), { kind: 'permission' }); }
      }
      if (cancelled) { audio?.close(); video?.close(); return; }
      tracksRef.current = { ...tracksRef.current, audio, video };
      setLocal({ audio, video });
      await client.publish([audio, video].filter(Boolean));
      setPhase('live');
    };
    join().catch(e => {
      console.error('Lesson join failed:', e);
      if (cancelled) return;
      const kind = e.kind || (/permission|notallowed|denied/i.test(String(e?.message || e?.name)) ? 'permission' : 'network');
      setFailure({ kind, message: e.message }); setPhase('error');
    });
    return () => { cancelled = true; };
  }, [attempt]);

  // Leaving the page for any reason turns the camera off.
  useEffect(() => () => {
    const t = tracksRef.current;
    t.audio?.close(); t.video?.close(); t.screen?.close();
    client.leave().catch(() => {});
  }, []);

  const toggleMute = async () => { if (!local.audio) return; await local.audio.setEnabled(isMuted); setIsMuted(!isMuted); };
  const toggleVideo = async () => { if (!local.video) return; await local.video.setEnabled(isVideoOff); setIsVideoOff(!isVideoOff); };
  const toggleScreenShare = async () => {
    try {
      const t = tracksRef.current;
      if (isScreenSharing && t.screen) {
        await client.unpublish(t.screen); t.screen.close(); tracksRef.current.screen = null;
        if (t.video) await client.publish(t.video);
        setIsScreenSharing(false);
      } else {
        const track = await AgoraRTC.createScreenVideoTrack({ encoderConfig: '1080p_1' }, 'disable');
        if (t.video) await client.unpublish(t.video);
        await client.publish(track);
        track.on('track-ended', async () => {
          await client.unpublish(track); track.close(); tracksRef.current.screen = null;
          if (tracksRef.current.video) await client.publish(tracksRef.current.video);
          setIsScreenSharing(false);
        });
        tracksRef.current.screen = track; setIsScreenSharing(true);
      }
    } catch (err) { console.error('Screen share error:', err); }
  };

  const handleEnd = async (opts = {}) => {
    const t = tracksRef.current;
    t.audio?.close(); t.video?.close(); t.screen?.close();
    try { await client.leave(); } catch { /* already disconnected */ }
    onEnd(opts && opts.failed ? { failed: true } : {});
  };

  const sendMessage = () => {
    const text = newMessage.trim();
    if (!text) return;
    const msg = { text, sender: user.name || 'You', senderId: user.id, time: new Date().toISOString() };
    setMessages(prev => [...prev, { ...msg, isRemote: false }]);
    chatChannelRef.current?.send({ type: 'broadcast', event: 'message', payload: msg });
    supabase.from('lesson_messages').insert({ booking_id: booking.id, sender_id: user.id, sender_name: user.name || null, body: text.slice(0, 1000) })
      .then(({ error }) => { if (error) console.warn('Chat not saved:', error.message); });
    setNewMessage('');
  };
  const openChat = () => { setChatOpen(o => !o); setUnread(0); };

  const remoteTrack = remote?.user?.videoTrack || null;
  const remoteMuted = remote && remote.user?.hasAudio === false;
  const selfTrack = local.video && !isVideoOff ? local.video : null;
  const refundLink = `https://wa.me/${SUPPORT_WA}?text=${encodeURIComponent(`Hi Tutagora, my tutor didn't join. Please refund lesson ${String(booking.id).slice(0, 8)}: ${subject} with ${tutorName}, ${booking.lesson_date || ''} ${String(booking.start_time || '').slice(0, 5)}.`)}`;
  const clockStyle = !clock ? null : clock.tone === 'live' ? { background: C.goodSoft, color: '#1f7a47' } : clock.tone === 'ending' ? { background: C.amberSoft, color: C.amber } : { background: '#fff', color: C.ink2, border: `1.5px solid ${C.line}` };

  // Messages shown in both the phone sheet and the desktop column.
  const chatBody = (
    <>
      <div className="flex-1 overflow-y-auto min-h-0 space-y-2 px-4 py-3">
        {messages.length === 0 ? <div className="text-center text-sm py-8" style={{ color: C.mute }}>No messages yet. Say hello to {other}.</div> : messages.map((m, i) => (
          <div key={i} className={`flex ${m.isRemote ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-[15px] leading-snug ${m.isRemote ? 'rounded-bl-md' : 'rounded-br-md'}`}
              style={{ background: m.isRemote ? '#f4efe7' : C.brandSoft, color: C.ink }}>{m.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="px-3 pb-3 pt-2 shrink-0">
        <div className="flex gap-2">
          <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} maxLength={1000}
            placeholder={`Message ${other}`} className="flex-1 min-w-0 h-11 px-4 rounded-full text-[15px] focus:outline-none" style={{ border: `1.5px solid ${C.line}`, background: '#fff', color: C.ink }} />
          <button type="button" onClick={sendMessage} className="h-11 px-5 rounded-full font-bold" style={{ background: C.ink, color: '#fff' }}>Send</button>
        </div>
        <p className="text-[11px] mt-2 px-1" style={{ color: C.mute }}>Chat is kept for 30 days in case there's a problem with the lesson.</p>
      </div>
    </>
  );

  // Over the board: "not started yet", "waiting", and "tutor late".
  const banner = phase !== 'live' ? null : tutorLate ? (
    <div className="absolute left-3 right-3 bottom-3 lg:left-auto lg:w-[380px] z-10 rounded-2xl p-4 shadow-lg" style={{ background: C.amberSoft, border: '1.5px solid #f5d9a8' }}>
      <div className="font-extrabold text-[16px]" style={{ color: C.ink }}>{other} is more than {LATE_MIN} minutes late</div>
      <p className="text-[14px] mt-1 leading-snug" style={{ color: C.ink2 }}>You get a full refund when a tutor is this late. You can keep waiting: if {other} joins, the lesson goes ahead.</p>
      <a href={refundLink} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center h-11 rounded-xl font-bold" style={{ background: C.ink, color: '#fff' }}>Ask for a refund on WhatsApp</a>
    </div>
  ) : !remote ? (
    <div className="absolute left-1/2 -translate-x-1/2 top-16 z-10 px-4 py-2.5 rounded-full text-[14px] font-bold shadow-sm whitespace-nowrap" style={{ background: '#fff', border: `1.5px solid ${C.line}`, color: C.ink2 }}>
      {startMs && now < startMs ? `Your lesson starts at ${startLabel}` : `Waiting for ${other} to join`}
    </div>
  ) : null;

  const fullCard = (children) => (
    <div className="flex-1 min-h-0 rounded-[28px] flex items-center justify-center p-6" style={{ background: C.card, border: `1.5px solid ${C.line}` }}>
      <div className="max-w-sm text-center">{children}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: C.paper, color: C.ink, fontFamily: '"Figtree Variable", -apple-system, "Segoe UI", Roboto, sans-serif' }}>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => sharePhoto(e.target.files?.[0])} />

      {/* Header: a clear way out, what and with whom, and time left. */}
      <header className="flex items-center gap-3 px-4 lg:px-6 shrink-0" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)', paddingBottom: '0.75rem' }}>
        <button type="button" onClick={() => setConfirmLeave(true)} className="h-10 pl-2.5 pr-4 rounded-full font-bold text-[15px] flex items-center gap-1 shrink-0" style={{ background: '#fff', border: `1.5px solid ${C.line}`, color: C.ink2 }}>
          <Icon name="back" className="w-[18px] h-[18px]" />Leave
        </button>
        <div className="min-w-0 flex-1">
          <div className="font-extrabold text-[17px] tracking-tight truncate" style={{ fontFamily: '"Archivo Variable", "Figtree Variable", sans-serif', fontStretch: '92%' }}>{subject} with {other}</div>
          {who && <div className="text-[13px] font-semibold truncate" style={{ color: C.mute }}>{who}</div>}
        </div>
        {clock && <span className="h-9 px-3 rounded-full text-[14px] font-extrabold flex items-center gap-1.5 shrink-0" style={clockStyle}><Icon name="clock" className="w-4 h-4" sw={2.2} /><span>{clock.tone === 'soon' ? <><span className="hidden sm:inline">Starts </span>{clock.text.replace('Starts in', 'in')}</> : <>{clock.text.replace(' left', '')}<span className="hidden sm:inline"> left</span></>}</span></span>}
      </header>

      {/* Today's step: what this lesson is for. */}
      {focus && (
        <div className="mx-4 lg:ml-6 lg:mr-[380px] mb-3 rounded-[20px] px-4 py-3 flex items-center gap-3 shrink-0" style={{ background: C.brandSoft }}>
          <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: C.brand, color: C.ink }}><Icon name="target" className="w-5 h-5" sw={2} /></span>
          <div className="min-w-0">
            <div className="text-[11.5px] font-extrabold uppercase tracking-[.08em]" style={{ color: C.brandDeep }}>{fromCheck ? `Today's step · from ${firstName(learnerName)}'s check` : 'What to work on'}</div>
            <div className="text-[15px] font-bold leading-snug line-clamp-2">{focus}</div>
          </div>
        </div>
      )}

      {/* Main: the board (and on desktop, the faces and chat beside it). */}
      <div className="flex-1 min-h-0 flex gap-4 px-4 lg:px-6">
        {phase === 'error' ? fullCard(<>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: C.brandSoft, color: C.brandDeep }}><Icon name={failure?.kind === 'permission' ? 'video' : 'user'} className="w-7 h-7" /></div>
          <h2 className="text-xl font-extrabold tracking-tight">{failure?.kind === 'permission' ? 'Allow your camera and microphone' : failure?.kind === 'denied' ? failure.message : "We couldn't connect to the lesson"}</h2>
          <p className="text-[15px] mt-2 leading-relaxed" style={{ color: C.ink2 }}>
            {failure?.kind === 'permission' ? `${other} needs to see and hear you. Tap the camera or lock icon next to the web address, choose Allow, then try again.`
              : failure?.kind === 'denied' ? 'If you think this is a mistake, message us on WhatsApp.' : 'Check your internet connection, then try again.'}
          </p>
          {failure?.kind !== 'denied' && <button type="button" onClick={() => setAttempt(a => a + 1)} className="mt-5 w-full h-12 rounded-xl font-bold" style={{ background: C.ink, color: '#fff' }}>Try again</button>}
          <button type="button" onClick={() => handleEnd({ failed: true })} className="mt-2 w-full h-12 rounded-xl font-bold" style={{ background: '#fff', border: `1.5px solid ${C.line}` }}>Go back</button>
        </>) : phase === 'connecting' ? fullCard(<>
          <div className="w-10 h-10 rounded-full border-[3px] animate-spin mx-auto mb-3" style={{ borderColor: C.line, borderTopColor: C.brand }} />
          <div className="font-bold" style={{ color: C.ink2 }}>Joining the lesson…</div>
        </>) : (
          <>
            <div className="relative flex-1 min-w-0 rounded-[28px] overflow-hidden" style={{ border: `1.5px solid ${C.line}`, boxShadow: '0 18px 40px -26px rgba(60,40,20,.35)' }}>
              <Whiteboard channelName={channelName} photo={photo} onRemovePhoto={removePhoto} />
              {sheetOpen && <div className="absolute inset-0 z-20 bg-white"><Spreadsheet channelName={channelName} /></div>}
              {banner}

              {/* Phone: the two faces sit in the corner of the board. */}
              {!tutorLate && (
                <div className="lg:hidden absolute right-3 bottom-4 z-10 flex items-end gap-2.5">
                  <button type="button" onClick={() => setView('faces')} aria-label="Show faces"><Face track={selfTrack} name={user.name || 'You'} size={70} tag="You" speaking={speaking.me} /></button>
                  <button type="button" onClick={() => setView('faces')} aria-label={`Show ${other}`}><Face track={remoteTrack} name={otherName} size={108} tag={remote ? other : 'Waiting'} speaking={!!remote && speaking.them} ring={remote ? null : C.line} /></button>
                </div>
              )}

              {/* Phone: faces view, big. */}
              {view === 'faces' && (
                <div className="lg:hidden absolute inset-0 z-20 p-3 flex flex-col gap-3" style={{ background: C.paper }}>
                  <div className="flex-1 min-h-0"><Tile track={remoteTrack} name={otherName} label={remote ? other : `Waiting for ${other}`} speaking={!!remote && speaking.them} muted={remoteMuted} /></div>
                  <div className="h-[150px] flex gap-3 shrink-0">
                    <div className="w-[120px]"><Tile track={selfTrack} name={user.name || 'You'} label="You" speaking={speaking.me} muted={isMuted} /></div>
                    <button type="button" onClick={() => setView('board')} className="flex-1 rounded-3xl font-bold text-[16px] flex flex-col items-center justify-center gap-2" style={{ background: C.ink, color: '#fff' }}>
                      <Icon name="board" className="w-6 h-6" />Back to the board
                    </button>
                  </div>
                </div>
              )}

              {note && <div className="absolute left-1/2 -translate-x-1/2 top-16 z-30 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg whitespace-nowrap" style={{ background: C.ink }}>{note}</div>}
            </div>

            {/* Desktop: faces and chat beside the board. */}
            <aside className="hidden lg:flex w-[340px] shrink-0 flex-col gap-3 min-h-0">
              <div className="h-[230px] shrink-0"><Tile track={remoteTrack} name={otherName} label={remote ? other : `Waiting for ${other}`} speaking={!!remote && speaking.them} muted={remoteMuted} /></div>
              <div className="h-[150px] shrink-0"><Tile track={selfTrack} name={user.name || 'You'} label="You" speaking={speaking.me} muted={isMuted} /></div>
              <div className="flex-1 min-h-0 rounded-3xl flex flex-col" style={{ background: '#fff', border: `1.5px solid ${C.line}` }}>
                <div className="px-4 pt-3 font-extrabold text-[15px]">Chat</div>
                {chatBody}
              </div>
            </aside>
          </>
        )}
      </div>

      {noCam && phase === 'live' && <div className="mx-4 mt-2 text-center text-xs font-semibold" style={{ color: C.mute }}>We couldn't find a camera, so {other} can hear you but not see you.</div>}

      {/* Dock */}
      {phase === 'live' ? (
        <div className="shrink-0 px-3 pt-3 flex items-start justify-center gap-3 sm:gap-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.9rem)' }}>
          <DockButton name="mic" label={isMuted ? 'Unmute' : 'Mute'} slash={isMuted} state={isMuted ? 'off' : 'normal'} onClick={toggleMute} />
          <DockButton name="video" label={isVideoOff || noCam ? 'Camera off' : 'Camera'} slash={isVideoOff || noCam} state={isVideoOff || noCam ? 'off' : 'normal'} onClick={toggleVideo} />
          <DockButton name={view === 'faces' ? 'board' : 'faces'} label={view === 'faces' ? 'Board' : 'Faces'} onClick={() => setView(v => (v === 'faces' ? 'board' : 'faces'))} className="lg:hidden" />
          <DockButton name="photo" label={photoBusy ? 'Sending…' : isTutor ? 'Photo' : 'Homework'} state="hot" onClick={() => !photoBusy && fileRef.current?.click()} />
          <DockButton name="chat" label="Chat" state={chatOpen ? 'on' : 'normal'} badge={unread || null} onClick={openChat} className="lg:hidden" />
          <DockButton name="screen" label={isScreenSharing ? 'Stop sharing' : 'Share screen'} state={isScreenSharing ? 'on' : 'normal'} onClick={toggleScreenShare} className="hidden lg:flex" />
          {isTutor && <DockButton name="sheet" label="Sheet" state={sheetOpen ? 'on' : 'normal'} onClick={() => setSheetOpen(o => !o)} className="hidden lg:flex" />}
        </div>
      ) : <div className="h-4 shrink-0" />}

      {/* Phone chat: a sheet over the board. */}
      {chatOpen && (
        <div className="lg:hidden fixed inset-0 z-[55] flex flex-col justify-end" style={{ background: 'rgba(18,17,23,.35)' }} onClick={() => setChatOpen(false)}>
          <div className="h-[72%] rounded-t-[28px] flex flex-col" style={{ background: C.card, paddingBottom: 'env(safe-area-inset-bottom)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 pt-4 pb-1">
              <div className="font-extrabold text-[17px]">Chat with {other}</div>
              <button type="button" onClick={() => setChatOpen(false)} aria-label="Close" className="w-9 h-9 -mr-2 rounded-full flex items-center justify-center" style={{ color: C.ink2 }}><Icon name="close" className="w-5 h-5" /></button>
            </div>
            {chatBody}
          </div>
        </div>
      )}

      {/* Leaving is never one accidental tap. */}
      {confirmLeave && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(18,17,23,.45)' }} onClick={() => setConfirmLeave(false)}>
          <div className="w-full sm:max-w-sm rounded-t-[28px] sm:rounded-[28px] p-6" style={{ background: C.card, paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }} onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-extrabold tracking-tight">Leave the lesson?</h2>
            <p className="text-[15px] mt-2" style={{ color: C.ink2 }}>{endMs && now < endMs ? `There ${minsTo(endMs - now) === 1 ? 'is 1 minute' : `are ${minsTo(endMs - now)} minutes`} left. ` : ''}You can come back in from your dashboard until the lesson ends.</p>
            <button type="button" onClick={() => setConfirmLeave(false)} className="mt-5 w-full h-12 rounded-xl font-bold" style={{ background: C.ink, color: '#fff' }}>Stay in the lesson</button>
            <button type="button" onClick={() => handleEnd()} className="mt-2 w-full h-12 rounded-xl font-bold" style={{ background: '#fff', border: `1.5px solid ${C.line}`, color: '#c4302b' }}>Leave</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoRoom;
