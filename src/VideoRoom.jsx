import React, { useState, useEffect, useRef, useCallback } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { supabase } from './supabase';
import { Spreadsheet } from './Spreadsheet';

const AGORA_APP_ID = '35a8f51c866e44bfbb7bd5e3970e75e4';

// ==================== ICONS (SVG, not emoji) ====================
const ICONS = {
  mic: 'M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3zM5 10v1a7 7 0 0 0 14 0v-1M12 19v3',
  video: 'M4 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM16 10l5-3v10l-5-3',
  screen: 'M3 4h18v12H3zM8 20h8M12 16v4',
  board: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  sheet: 'M3 4h18v16H3zM3 9h18M3 14h18M9 4v16M15 4v16',
  chat: 'M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z',
  end: 'M3 5a2 2 0 0 1 2-2h2l1.5 4.5-2 1.4a12 12 0 0 0 5.6 5.6l1.4-2L20 18v2a2 2 0 0 1-2 2A16 16 0 0 1 3 5z',
  close: 'M6 6l12 12M18 6L6 18',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  pen: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  eraser: 'M7 21h10M5.5 13.5l7-7a2 2 0 0 1 2.8 0l3.2 3.2a2 2 0 0 1 0 2.8L12 19H8.5l-3-3a1.8 1.8 0 0 1 0-2.5zM9 10l5 5',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
};
const Icon = ({ name, className = 'w-5 h-5', slash }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d={ICONS[name]} />
    {slash && <path d="M4 4l16 16" />}
  </svg>
);

// ==================== VIDEO PLAYER ====================
// fit: 'contain' shows the WHOLE frame (right for a shared screen — the old
// default 'cover' cropped it, so a laptop screen came through zoomed in on the
// student's phone). 'cover' fills nicely for a face-cam PiP.
const VideoPlayer = ({ track, fit = 'cover' }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && track) {
      track.play(ref.current, { fit });
    }
    return () => track?.stop();
  }, [track, fit]);
  return <div ref={ref} className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden" />;
};

// ==================== COLLABORATIVE WHITEBOARD ====================
const Whiteboard = ({ channelName, userName }) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef(null);
  const channelRef = useRef(null);
  const [color, setColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState('pen'); // pen | eraser
  const [history, setHistory] = useState([]);

  const colors = ['#ffffff', '#ef4444', '#22c55e', '#3b82f6', '#eab308', '#f97316', '#a855f7', '#ec4899'];
  const widths = [2, 4, 8];

  // Set up Supabase Realtime channel for whiteboard
  useEffect(() => {
    const channel = supabase.channel(`whiteboard-${channelName}`, {
      config: { broadcast: { self: false } },
    });

    channel.on('broadcast', { event: 'draw' }, ({ payload }) => {
      drawStroke(payload);
    });

    channel.on('broadcast', { event: 'clear' }, () => {
      clearCanvas(false);
    });

    channel.subscribe();
    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // Set canvas size to match display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2; // 2x for retina
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // Dark background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
      ctx.putImageData(imageData, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCanvasPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    };
  };

  const drawStroke = useCallback(({ fromX, fromY, toX, toY, color: c, width: w, tool: t }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    ctx.beginPath();
    ctx.strokeStyle = t === 'eraser' ? '#1e293b' : c;
    ctx.lineWidth = t === 'eraser' ? w * 4 : w;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(fromX * rect.width, fromY * rect.height);
    ctx.lineTo(toX * rect.width, toY * rect.height);
    ctx.stroke();
  }, []);

  const handleStart = (e) => {
    e.preventDefault();
    isDrawing.current = true;
    lastPoint.current = getCanvasPoint(e);
  };

  const handleMove = (e) => {
    e.preventDefault();
    if (!isDrawing.current || !lastPoint.current) return;
    const point = getCanvasPoint(e);
    const stroke = {
      fromX: lastPoint.current.x,
      fromY: lastPoint.current.y,
      toX: point.x,
      toY: point.y,
      color,
      width: lineWidth,
      tool,
    };

    // Draw locally
    drawStroke(stroke);

    // Broadcast to other user
    channelRef.current?.send({
      type: 'broadcast',
      event: 'draw',
      payload: stroke,
    });

    lastPoint.current = point;
  };

  const handleEnd = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  const clearCanvas = (broadcast = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, rect.width, rect.height);

    if (broadcast) {
      channelRef.current?.send({
        type: 'broadcast',
        event: 'clear',
        payload: {},
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[.08] flex-wrap">
        <div className="flex rounded-full bg-white/10 p-1">
          {[['pen', 'Pen'], ['eraser', 'Eraser']].map(([t, l]) => (
            <button key={t} type="button" onClick={() => setTool(t)} aria-pressed={tool === t}
              className={`h-9 px-3 rounded-full text-sm font-bold flex items-center gap-1.5 transition-colors ${tool === t ? 'bg-[#ff7aac] text-[#121117]' : 'text-white/75'}`}>
              <Icon name={t} className="w-4 h-4" />{l}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {colors.map(c => (
            <button key={c} type="button" aria-label={`Colour ${c}`} onClick={() => { setColor(c); setTool('pen'); }}
              className={`w-7 h-7 rounded-full transition-transform ${color === c && tool === 'pen' ? 'ring-2 ring-offset-2 ring-offset-[#17171f] ring-white scale-110' : ''}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="flex items-center rounded-full bg-white/10 p-1">
          {widths.map(w => (
            <button key={w} type="button" aria-label={`Line ${w}`} onClick={() => setLineWidth(w)}
              className={`w-9 h-9 rounded-full flex items-center justify-center ${lineWidth === w ? 'bg-white/20' : ''}`}>
              <span className="rounded-full bg-white" style={{ width: w * 2, height: w * 2 }} />
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button type="button" onClick={() => clearCanvas(true)} className="h-9 px-3 rounded-full text-sm font-bold text-[#ff8a8e] bg-[#e5484d]/15 flex items-center gap-1.5">
          <Icon name="trash" className="w-4 h-4" />Clear
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>
    </div>
  );
};

// ==================== MAIN VIDEO ROOM ====================
const SUPPORT_WA = '254759240692';
const firstName = (s) => (s || '').trim().split(/\s+/)[0] || '';
const initialsOf = (s) => (s || '').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';
const lessonStart = (b) => {
  if (!b?.lesson_date || !b?.start_time) return null;
  const t = new Date(`${b.lesson_date}T${String(b.start_time).slice(0, 5)}:00+03:00`).getTime();
  return Number.isFinite(t) ? t : null;
};
const LATE_MIN = 10; // a tutor this late means the family can ask for a refund

// A round control with its label underneath.
const RoundButton = ({ name, label, onClick, state = 'normal', slash, badge, className = '' }) => (
  <button type="button" onClick={onClick} aria-label={label} aria-pressed={state === 'on'}
    className={`flex flex-col items-center gap-1.5 shrink-0 ${className}`}>
    <span className={`relative w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-full flex items-center justify-center transition-colors ${
      state === 'on' ? 'bg-[#ff7aac] text-[#121117]' : state === 'off' ? 'bg-[#e5484d] text-white' : 'bg-white/10 text-white active:bg-white/20 hover:bg-white/15'}`}>
      <Icon name={name} slash={slash} className="w-[22px] h-[22px]" />
      {badge ? <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#ff7aac] text-[#121117] text-[11px] font-bold flex items-center justify-center">{badge}</span> : null}
    </span>
    <span className="text-[11px] font-semibold text-white/75 leading-none">{label}</span>
  </button>
);

// A person's tile: their video, or their initials when the camera is off.
const PersonTile = ({ track, name, label, muted, fit = 'cover', big }) => (
  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#1c1c25]">
    {track ? <VideoPlayer track={track} fit={fit} /> : (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        <div className={`${big ? 'w-24 h-24 text-3xl' : 'w-10 h-10 text-sm'} rounded-full bg-[#ff7aac] text-[#121117] font-extrabold flex items-center justify-center`}>{initialsOf(name)}</div>
        {big && <div className="text-white/60 text-sm font-medium">{firstName(name)}'s camera is off</div>}
      </div>
    )}
    <div className={`absolute ${big ? 'bottom-3 left-3 text-sm px-2.5 py-1' : 'bottom-1.5 left-1.5 text-[11px] px-1.5 py-0.5'} rounded-lg bg-black/60 text-white font-semibold flex items-center gap-1`}>
      {muted && <Icon name="mic" slash className="w-3.5 h-3.5 text-[#ff8a8e]" />}{label}
    </div>
  </div>
);

export const VideoRoom = ({ booking, user, onEnd }) => {
  const [client] = useState(() => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));
  const tracksRef = useRef({ audio: null, video: null, screen: null });
  const [local, setLocal] = useState({ audio: null, video: null });
  const [noCam, setNoCam] = useState(false);
  const [remote, setRemote] = useState(null);      // { user, v } — lessons are one to one
  const [everJoined, setEverJoined] = useState(false);
  const [phase, setPhase] = useState('connecting'); // connecting | live | error
  const [failure, setFailure] = useState(null);     // { kind, message }
  const [attempt, setAttempt] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [panel, setPanel] = useState(null);         // null | 'board' | 'chat' | 'sheet'
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [joinedAt] = useState(Date.now());

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [unread, setUnread] = useState(0);
  const chatChannelRef = useRef(null);
  const chatEndRef = useRef(null);
  const panelRef = useRef(null);
  panelRef.current = panel;

  const channelName = `lesson-${booking.id}`;
  const isTutor = user.role === 'tutor';
  const tutorName = booking.tutors?.profiles?.full_name || 'your tutor';
  const learnerName = booking.learner_name || booking.profiles?.full_name || 'your student';
  const otherName = isTutor ? learnerName : tutorName;
  const other = firstName(otherName) || otherName;
  const subject = booking.subject || 'Lesson';

  // Lesson clock: time left, not time since joining.
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const startMs = lessonStart(booking);
  const endMs = startMs ? startMs + (Number(booking.duration_minutes) || 60) * 60000 : null;
  const minsTo = (ms) => Math.max(1, Math.ceil(ms / 60000));
  const clock = !startMs
    ? { text: `${Math.floor((now - joinedAt) / 60000)} min`, tone: 'live' }
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
      if (panelRef.current !== 'chat') setUnread(n => n + 1);
    });
    channel.subscribe();
    chatChannelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [channelName]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, panel]);

  // The other person coming and going.
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

  const toggleMute = async () => {
    if (!local.audio) return;
    await local.audio.setEnabled(isMuted); setIsMuted(!isMuted);
  };
  const toggleVideo = async () => {
    if (!local.video) return;
    await local.video.setEnabled(isVideoOff); setIsVideoOff(!isVideoOff);
  };
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

  const togglePanel = (p) => { setPanel(prev => prev === p ? null : p); if (p === 'chat') setUnread(0); };

  const remoteTrack = remote?.user?.videoTrack || null;
  const remoteMuted = remote && !remote.user?.hasAudio;
  const selfTrack = local.video && !isVideoOff ? local.video : null;
  const refundLink = `https://wa.me/${SUPPORT_WA}?text=${encodeURIComponent(`Hi Tutagora, my tutor didn't join. Please refund lesson ${String(booking.id).slice(0, 8)}: ${subject} with ${tutorName}, ${booking.lesson_date || ''} ${String(booking.start_time || '').slice(0, 5)}.`)}`;

  // What fills the main tile when the other person isn't on camera.
  const waitingCard = (
    <div className="w-full h-full rounded-2xl bg-[#1c1c25] flex items-center justify-center p-6">
      {tutorLate ? (
        <div className="max-w-sm text-center">
          <div className="w-14 h-14 rounded-full bg-[#ffb224]/15 text-[#ffb224] flex items-center justify-center mx-auto mb-4"><Icon name="clock" className="w-7 h-7" /></div>
          <h2 className="text-white text-xl font-extrabold tracking-tight">{other} is more than {LATE_MIN} minutes late</h2>
          <p className="text-white/65 text-[15px] mt-2 leading-relaxed">You get a full refund when a tutor is this late. You can keep waiting: if {other} joins, the lesson goes ahead.</p>
          <a href={refundLink} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center justify-center w-full h-12 rounded-xl bg-[#ff7aac] text-[#121117] font-bold">Ask for a refund</a>
          <p className="text-white/45 text-xs mt-3">This opens WhatsApp with your lesson details filled in.</p>
        </div>
      ) : (
        <div className="max-w-xs text-center">
          <div className="w-20 h-20 rounded-full bg-[#ff7aac] text-[#121117] text-2xl font-extrabold flex items-center justify-center mx-auto mb-4 relative">
            {(otherName || '?').trim()[0]?.toUpperCase()}
            <span className="absolute inset-0 rounded-full border-2 border-[#ff7aac] animate-ping opacity-30" />
          </div>
          <h2 className="text-white text-lg font-extrabold tracking-tight">{startMs && now < startMs ? `Your lesson starts at ${startLabel}` : `Waiting for ${other}`}</h2>
          <p className="text-white/60 text-sm mt-1.5">You're in the room. {other}'s video will appear here when they join.</p>
        </div>
      )}
    </div>
  );

  const mainTile = remote ? <PersonTile track={remoteTrack} name={otherName} label={other} muted={remoteMuted} fit="contain" big /> : waitingCard;
  const selfTile = <PersonTile track={selfTrack} name={user.name || 'You'} label="You" muted={isMuted} />;

  const Tone = { live: 'bg-[#30a46c]/15 text-[#4cc38a]', soon: 'bg-white/10 text-white/80', ending: 'bg-[#ffb224]/15 text-[#ffb224]' }[clock.tone];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0e0e13] text-white" style={{ fontFamily: '"Figtree Variable", -apple-system, "Segoe UI", Roboto, sans-serif' }}>
      {/* Header: what, with whom, how long is left, and a clear way out. */}
      <header className="flex items-center gap-3 px-4 sm:px-5 border-b border-white/[.08] shrink-0"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.6rem)', paddingBottom: '0.6rem' }}>
        <div className="min-w-0 flex-1">
          <div className="font-extrabold text-[16px] sm:text-[17px] tracking-tight truncate">{subject} with {other}</div>
          <div className="mt-1 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${Tone}`}>
              {clock.tone !== 'soon' && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}{clock.text}
            </span>
            {phase === 'live' && <span className="text-white/45 text-xs font-medium hidden sm:inline">Live</span>}
          </div>
        </div>
        <button type="button" onClick={() => setConfirmLeave(true)} className="shrink-0 h-10 px-4 rounded-full border border-[#e5484d]/60 text-[#ff8a8e] font-bold text-sm hover:bg-[#e5484d]/10">Leave</button>
      </header>

      {/* Stage */}
      <div className={`flex-1 min-h-0 flex ${panel ? 'flex-col lg:flex-row-reverse' : 'flex-col'} gap-2 sm:gap-3 p-2 sm:p-3`}>
        {phase === 'error' ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-sm text-center">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4"><Icon name={failure?.kind === 'permission' ? 'video' : 'user'} className="w-7 h-7" /></div>
              <h2 className="text-xl font-extrabold tracking-tight">
                {failure?.kind === 'permission' ? 'Allow your camera and microphone' : failure?.kind === 'denied' ? failure.message : "We couldn't connect to the lesson"}
              </h2>
              <p className="text-white/65 text-[15px] mt-2 leading-relaxed">
                {failure?.kind === 'permission' ? `${other} needs to see and hear you. Tap the camera or lock icon next to the web address, choose Allow, then try again.`
                  : failure?.kind === 'denied' ? 'If you think this is a mistake, message us on WhatsApp.'
                  : 'Check your internet connection, then try again.'}
              </p>
              {failure?.kind !== 'denied' && <button type="button" onClick={() => setAttempt(a => a + 1)} className="mt-5 w-full h-12 rounded-xl bg-[#ff7aac] text-[#121117] font-bold">Try again</button>}
              <button type="button" onClick={() => handleEnd({ failed: true })} className="mt-2 w-full h-12 rounded-xl bg-white/10 font-bold">Go back</button>
            </div>
          </div>
        ) : phase === 'connecting' ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full border-[3px] border-white/15 border-t-[#ff7aac] animate-spin" />
            <div className="text-white/70 font-semibold">Joining the lesson…</div>
          </div>
        ) : panel ? (
          <>
            {/* With the board, chat or sheet open, both faces stay in view. */}
            <div className="flex lg:flex-col gap-2 shrink-0 h-[92px] lg:h-auto lg:w-[300px]">
              <div className="flex-1 lg:flex-none lg:h-[200px] min-w-0">{remote ? <PersonTile track={remoteTrack} name={otherName} label={other} muted={remoteMuted} fit="cover" /> : (
                <div className="w-full h-full rounded-2xl bg-[#1c1c25] flex items-center justify-center text-white/55 text-xs font-semibold px-2 text-center">{tutorLate ? `${other} is late` : `Waiting for ${other}`}</div>)}</div>
              <div className="w-[76px] lg:w-full lg:h-[140px] shrink-0">{selfTile}</div>
              {tutorLate && <a href={refundLink} target="_blank" rel="noreferrer" className="hidden lg:flex h-11 rounded-xl bg-[#ff7aac] text-[#121117] font-bold items-center justify-center">Ask for a refund</a>}
            </div>
            <div className="flex-1 min-h-0 rounded-2xl overflow-hidden bg-[#17171f] border border-white/[.08] flex flex-col">
              <div className="flex items-center justify-between px-4 h-12 border-b border-white/[.08] shrink-0">
                <h3 className="font-bold text-[15px]">{panel === 'chat' ? `Chat with ${other}` : panel === 'board' ? 'Whiteboard' : 'Spreadsheet'}</h3>
                <button type="button" onClick={() => setPanel(null)} aria-label="Close" className="w-9 h-9 -mr-2 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"><Icon name="close" className="w-5 h-5" /></button>
              </div>
              {panel === 'chat' && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
                    {messages.length === 0 ? <div className="text-center text-white/45 text-sm py-10">No messages yet. Say hello to {other}.</div> : messages.map((m, i) => (
                      <div key={i} className={`flex ${m.isRemote ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-[15px] leading-snug ${m.isRemote ? 'bg-white/10 rounded-bl-md' : 'bg-[#ff7aac] text-[#121117] rounded-br-md'}`}>{m.text}</div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="p-3 border-t border-white/[.08] shrink-0">
                    <div className="flex gap-2">
                      <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} maxLength={1000}
                        placeholder={`Message ${other}`} className="flex-1 min-w-0 h-11 px-4 rounded-full bg-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#ff7aac]/60" />
                      <button type="button" onClick={sendMessage} className="h-11 px-5 rounded-full bg-[#ff7aac] text-[#121117] font-bold">Send</button>
                    </div>
                    <p className="text-white/35 text-[11px] mt-2 px-1">Chat is kept for 30 days in case there's a problem with the lesson.</p>
                  </div>
                </>
              )}
              {panel === 'board' && <div className="flex-1 min-h-0"><Whiteboard channelName={channelName} userName={user.name} /></div>}
              {panel === 'sheet' && <div className="flex-1 min-h-0"><Spreadsheet channelName={channelName} /></div>}
            </div>
          </>
        ) : (
          <div className="relative flex-1 min-h-0">
            {mainTile}
            {/* Your own camera, small, top corner so it never covers names or buttons. */}
            <div className="absolute top-3 right-3 w-[92px] h-[124px] sm:w-[180px] sm:h-[120px] shadow-2xl rounded-2xl ring-1 ring-white/15">{selfTile}</div>
          </div>
        )}
      </div>

      {noCam && phase === 'live' && <div className="mx-3 mb-1 text-center text-xs text-white/55">We couldn't find a camera, so {other} can hear you but not see you.</div>}

      {/* Controls */}
      {phase !== 'error' && <div className="shrink-0 border-t border-white/[.08] px-3 pt-3 flex items-start justify-center gap-4 sm:gap-6"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}>
        <RoundButton name="mic" label={isMuted ? 'Unmute' : 'Mute'} slash={isMuted} state={isMuted ? 'off' : 'normal'} onClick={toggleMute} />
        <RoundButton name="video" label={isVideoOff || noCam ? 'Camera off' : 'Camera'} slash={isVideoOff || noCam} state={isVideoOff || noCam ? 'off' : 'normal'} onClick={toggleVideo} />
        <RoundButton name="board" label="Board" state={panel === 'board' ? 'on' : 'normal'} onClick={() => togglePanel('board')} />
        <RoundButton name="chat" label="Chat" state={panel === 'chat' ? 'on' : 'normal'} badge={unread || null} onClick={() => togglePanel('chat')} />
        <RoundButton name="screen" label={isScreenSharing ? 'Stop sharing' : 'Share screen'} state={isScreenSharing ? 'on' : 'normal'} onClick={toggleScreenShare} className="hidden sm:flex" />
        {isTutor && <RoundButton name="sheet" label="Sheet" state={panel === 'sheet' ? 'on' : 'normal'} onClick={() => togglePanel('sheet')} className="hidden sm:flex" />}
      </div>}

      {/* Leaving is never one accidental tap. */}
      {confirmLeave && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setConfirmLeave(false)}>
          <div className="w-full sm:max-w-sm bg-[#1c1c25] rounded-t-3xl sm:rounded-3xl p-6" onClick={e => e.stopPropagation()} style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}>
            <h2 className="text-xl font-extrabold tracking-tight">Leave the lesson?</h2>
            <p className="text-white/65 text-[15px] mt-2">{endMs && now < endMs ? `There ${minsTo(endMs - now) === 1 ? 'is 1 minute' : `are ${minsTo(endMs - now)} minutes`} left. ` : ''}You can come back in from your dashboard until the lesson ends.</p>
            <button type="button" onClick={() => setConfirmLeave(false)} className="mt-5 w-full h-12 rounded-xl bg-[#ff7aac] text-[#121117] font-bold">Stay in the lesson</button>
            <button type="button" onClick={() => handleEnd()} className="mt-2 w-full h-12 rounded-xl bg-white/10 text-[#ff8a8e] font-bold">Leave</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoRoom;
