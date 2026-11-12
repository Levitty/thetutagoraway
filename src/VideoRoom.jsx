import React, { useState, useEffect, useRef, useCallback } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { supabase } from './supabase';
import { Spreadsheet } from './Spreadsheet';
import { Whiteboard } from './lesson/Whiteboard.jsx';
import { C, Icon, Face, Tile, DockButton, RoomHeader, StepStrip, Transcript, ChatPanel, ChatSheet } from './lesson/room/index.js';

const AGORA_APP_ID = '35a8f51c866e44bfbb7bd5e3970e75e4';

// The lesson room: a light "classroom" where the whiteboard is the centre of
// the lesson and the faces sit beside it. Its parts (colours, icons, tiles,
// dock, header, step strip, chat) are shared with the HOREB room: src/lesson/room/.

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
// by the whiteboard. It is only kept if it ends up in the lesson notes.
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
  const [photoBusy, setPhotoBusy] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [isLg, setIsLg] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  useEffect(() => { const f = () => setIsLg(window.innerWidth >= 1024); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  const boardRef = useRef(null);
  const boardDirty = useRef(false);
  const [note, setNote] = useState('');

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [unread, setUnread] = useState(0);
  const chatChannelRef = useRef(null);
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

  useEffect(() => { if (!note) return; const t = setTimeout(() => setNote(''), 3500); return () => clearTimeout(t); }, [note]);

  const sharePhoto = async (file) => {
    if (!file) return;
    setPhotoBusy(true);
    try {
      const data = await shrinkPhoto(file);
      setView('board');
      await boardRef.current?.addPhoto(data);
      setNote(`${other} can see the photo now`);
    } catch (e) { setNote(e.message || "The photo couldn't be shared."); }
    setPhotoBusy(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  // Lesson notes: the board's pages, saved as pictures for the parent. Both
  // people's devices save the same pages, so the notes survive either one
  // dropping out. Saved every couple of minutes, and when leaving.
  const saveNotes = async () => {
    const board = boardRef.current;
    if (!board || !board.hasContent()) return;
    const pages = await board.exportPages();
    const store = supabase.storage.from('lesson-notes');
    await Promise.all(pages.map(({ page, blob }) => {
      const path = `${booking.id}/page-${page + 1}.jpg`;
      return blob ? store.upload(path, blob, { upsert: true, contentType: 'image/jpeg' }) : store.remove([path]);
    }));
    boardDirty.current = false;
  };
  useEffect(() => {
    const t = setInterval(() => { if (boardDirty.current) saveNotes().catch(() => {}); }, 120000);
    const hide = () => { if (document.visibilityState === 'hidden' && boardDirty.current) saveNotes().catch(() => {}); };
    document.addEventListener('visibilitychange', hide);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', hide); };
  }, []);

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
        // Only a refusal from the key service itself closes the room. A 404
        // from Supabase because the function isn't deployed yet must not.
        const REFUSALS = ['signed_out', 'not_found', 'not_yours', 'not_confirmed', 'too_early', 'too_late'];
        if (REFUSALS.includes(body.error)) throw Object.assign(new Error(body.message || "You can't join this lesson."), { kind: 'denied' });
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
    // Save the board for the parent first (but never hold anyone for long).
    if (!opts.failed) {
      setLeaving(true);
      await Promise.race([saveNotes().catch(() => {}), new Promise(r => setTimeout(r, 6000))]);
    }
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
    <Transcript messages={messages} empty={`No messages yet. Say hello to ${other}.`} value={newMessage} onChange={setNewMessage} onSend={sendMessage}
      placeholder={`Message ${other}`} footnote="Chat is kept for 30 days in case there's a problem with the lesson." />
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
      <RoomHeader title={`${subject} with ${other}`} who={who} onLeave={() => setConfirmLeave(true)}>
        {clock && <span className="h-9 px-3 rounded-full text-[14px] font-extrabold flex items-center gap-1.5 shrink-0" style={clockStyle}><Icon name="clock" className="w-4 h-4" sw={2.2} /><span>{clock.tone === 'soon' ? <><span className="hidden sm:inline">Starts </span>{clock.text.replace('Starts in', 'in')}</> : <>{clock.text.replace(' left', '')}<span className="hidden sm:inline"> left</span></>}</span></span>}
      </RoomHeader>

      {/* Today's step: what this lesson is for. */}
      {focus && <StepStrip kicker={fromCheck ? `Today's step · from ${firstName(learnerName)}'s check` : 'What to work on'} value={focus} />}

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
              <Whiteboard ref={boardRef} channelName={channelName} userId={user.id} bottom={isLg ? 60 : 104} onChange={() => { boardDirty.current = true; }} onNote={() => { setView('board'); setNote(`${other} shared a photo on the board`); }} />
              {sheetOpen && <div className="absolute inset-0 z-20 bg-white"><Spreadsheet channelName={channelName} /></div>}
              {banner}

              {/* Phone: the two faces sit in the corner of the board. */}
              {!tutorLate && (
                <div className="lg:hidden absolute right-3 bottom-4 z-10 flex items-end gap-2">
                  <button type="button" onClick={() => setView('faces')} aria-label="Show faces"><Face track={selfTrack} name={user.name || 'You'} size={58} tag="You" speaking={speaking.me} /></button>
                  <button type="button" onClick={() => setView('faces')} aria-label={`Show ${other}`}><Face track={remoteTrack} name={otherName} size={84} tag={remote ? other : 'Waiting'} speaking={!!remote && speaking.them} ring={remote ? null : C.line} /></button>
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

              {note && <div className="absolute left-1/2 -translate-x-1/2 bottom-[112px] lg:bottom-4 z-30 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg whitespace-nowrap" style={{ background: C.ink }}>{note}</div>}
            </div>

            {/* Desktop: faces and chat beside the board. */}
            <aside className="hidden lg:flex w-[340px] shrink-0 flex-col gap-3 min-h-0">
              <div className="h-[230px] shrink-0"><Tile track={remoteTrack} name={otherName} label={remote ? other : `Waiting for ${other}`} speaking={!!remote && speaking.them} muted={remoteMuted} /></div>
              <div className="h-[150px] shrink-0"><Tile track={selfTrack} name={user.name || 'You'} label="You" speaking={speaking.me} muted={isMuted} /></div>
              <ChatPanel title="Chat">{chatBody}</ChatPanel>
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
      {chatOpen && <ChatSheet title={`Chat with ${other}`} onClose={() => setChatOpen(false)}>{chatBody}</ChatSheet>}

      {/* Leaving is never one accidental tap. */}
      {confirmLeave && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(18,17,23,.45)' }} onClick={() => setConfirmLeave(false)}>
          <div className="w-full sm:max-w-sm rounded-t-[28px] sm:rounded-[28px] p-6" style={{ background: C.card, paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }} onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-extrabold tracking-tight">Leave the lesson?</h2>
            <p className="text-[15px] mt-2" style={{ color: C.ink2 }}>{endMs && now < endMs ? `There ${minsTo(endMs - now) === 1 ? 'is 1 minute' : `are ${minsTo(endMs - now)} minutes`} left. ` : ''}You can come back in from your dashboard until the lesson ends.</p>
            <button type="button" onClick={() => setConfirmLeave(false)} className="mt-5 w-full h-12 rounded-xl font-bold" style={{ background: C.ink, color: '#fff' }}>Stay in the lesson</button>
            <button type="button" onClick={() => handleEnd()} disabled={leaving} className="mt-2 w-full h-12 rounded-xl font-bold" style={{ background: '#fff', border: `1.5px solid ${C.line}`, color: '#c4302b' }}>{leaving ? 'Saving the board…' : 'Leave'}</button>
            <p className="text-[12.5px] mt-3 text-center" style={{ color: C.mute }}>The whiteboard is saved as lesson notes for the family.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoRoom;
