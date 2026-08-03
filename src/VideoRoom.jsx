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

// ==================== CONTROL BUTTON ====================
const ControlButton = ({ name, label, active, danger, onClick, slash }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-xl transition-colors shrink-0 min-w-0 ${
      danger ? 'bg-red-500 active:bg-red-600 text-white' :
      active ? 'bg-slate-700 text-white' : 'bg-slate-800 active:bg-slate-700 text-slate-300'
    }`}
  >
    <Icon name={name} slash={slash} className="w-5 h-5" />
    <span className="text-[10px] font-medium leading-none">{label}</span>
  </button>
);

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
      <div className="flex items-center gap-2 p-3 bg-slate-800 border-b border-slate-700 flex-wrap">
        {/* Pen / Eraser toggle */}
        <button
          onClick={() => setTool('pen')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tool === 'pen' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >
          ✏️ Pen
        </button>
        <button
          onClick={() => setTool('eraser')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tool === 'eraser' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >
          🧹 Eraser
        </button>

        <div className="w-px h-6 bg-slate-600 mx-1" />

        {/* Colors */}
        {colors.map(c => (
          <button
            key={c}
            onClick={() => { setColor(c); setTool('pen'); }}
            className={`w-6 h-6 rounded-full border-2 transition-transform ${color === c && tool === 'pen' ? 'border-emerald-400 scale-125' : 'border-slate-600'}`}
            style={{ backgroundColor: c }}
          />
        ))}

        <div className="w-px h-6 bg-slate-600 mx-1" />

        {/* Line widths */}
        {widths.map(w => (
          <button
            key={w}
            onClick={() => setLineWidth(w)}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${lineWidth === w ? 'bg-slate-600' : 'hover:bg-slate-700'}`}
          >
            <div className="rounded-full bg-white" style={{ width: w * 2, height: w * 2 }} />
          </button>
        ))}

        <div className="flex-1" />

        {/* Clear */}
        <button
          onClick={() => clearCanvas(true)}
          className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded-lg text-xs font-medium transition-colors"
        >
          🗑️ Clear
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
export const VideoRoom = ({ booking, user, onEnd }) => {
  const [client] = useState(() => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));
  const [localTracks, setLocalTracks] = useState({ audio: null, video: null });
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenTrack, setScreenTrack] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState(null);

  // Panels
  const [activePanel, setActivePanel] = useState(null); // null | 'chat' | 'whiteboard' | 'spreadsheet'

  // Chat state (synced via Supabase Realtime)
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatChannelRef = useRef(null);
  const chatEndRef = useRef(null);

  const channelName = `lesson-${booking.id}`;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Set up synced chat via Supabase Realtime
  useEffect(() => {
    const channel = supabase.channel(`chat-${channelName}`, {
      config: { broadcast: { self: false } },
    });

    channel.on('broadcast', { event: 'message' }, ({ payload }) => {
      setMessages(prev => [...prev, { ...payload, isRemote: true }]);
    });

    channel.subscribe();
    chatChannelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Join Agora room on mount
  useEffect(() => {
    const init = async () => {
      try {
        client.on('user-published', async (remoteUser, mediaType) => {
          await client.subscribe(remoteUser, mediaType);
          if (mediaType === 'video') {
            setRemoteUsers(prev => {
              if (prev.find(u => u.uid === remoteUser.uid)) {
                return prev.map(u => u.uid === remoteUser.uid ? remoteUser : u);
              }
              return [...prev, remoteUser];
            });
          }
          if (mediaType === 'audio') {
            remoteUser.audioTrack?.play();
          }
        });

        client.on('user-unpublished', (remoteUser, mediaType) => {
          if (mediaType === 'video') {
            setRemoteUsers(prev => prev.map(u =>
              u.uid === remoteUser.uid ? { ...u, videoTrack: null } : u
            ));
          }
        });

        client.on('user-left', (remoteUser) => {
          setRemoteUsers(prev => prev.filter(u => u.uid !== remoteUser.uid));
        });

        await client.join(AGORA_APP_ID, channelName, null, user.id);

        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalTracks({ audio: audioTrack, video: videoTrack });
        await client.publish([audioTrack, videoTrack]);
        setIsJoined(true);
      } catch (err) {
        console.error('Failed to join:', err);
        setError(err.message);
      }
    };

    init();

    return () => {
      localTracks.audio?.close();
      localTracks.video?.close();
      screenTrack?.close();
      client.leave();
    };
  }, []);

  // Toggle mute
  const toggleMute = async () => {
    if (localTracks.audio) {
      await localTracks.audio.setEnabled(isMuted);
      setIsMuted(!isMuted);
    }
  };

  // Toggle video
  const toggleVideo = async () => {
    if (localTracks.video) {
      await localTracks.video.setEnabled(isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  // Toggle screen share
  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing && screenTrack) {
        await client.unpublish(screenTrack);
        screenTrack.close();
        setScreenTrack(null);
        if (localTracks.video) await client.publish(localTracks.video);
        setIsScreenSharing(false);
      } else {
        const track = await AgoraRTC.createScreenVideoTrack({ encoderConfig: '1080p_1' }, 'disable');
        if (localTracks.video) await client.unpublish(localTracks.video);
        await client.publish(track);

        track.on('track-ended', async () => {
          await client.unpublish(track);
          track.close();
          setScreenTrack(null);
          if (localTracks.video) await client.publish(localTracks.video);
          setIsScreenSharing(false);
        });

        setScreenTrack(track);
        setIsScreenSharing(true);
      }
    } catch (err) {
      console.error('Screen share error:', err);
    }
  };

  // End call
  const handleEnd = async () => {
    localTracks.audio?.close();
    localTracks.video?.close();
    screenTrack?.close();
    await client.leave();
    onEnd();
  };

  // Send chat message (synced)
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      text: newMessage,
      sender: user.name || 'You',
      senderId: user.id,
      time: new Date().toISOString(),
    };
    setMessages(prev => [...prev, { ...msg, isRemote: false }]);
    chatChannelRef.current?.send({
      type: 'broadcast',
      event: 'message',
      payload: msg,
    });
    setNewMessage('');
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const isTutor = user.role === 'tutor';
  const otherPerson = isTutor ? 'Student' : booking.tutors?.profiles?.full_name || 'Tutor';

  const togglePanel = (panel) => {
    setActivePanel(prev => prev === panel ? null : panel);
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col">
      {/* Header — pads under the status bar / Dynamic Island; the subject is
          hidden on phones (where it used to overlap the live badge and role). */}
      <header className="px-3 sm:px-4 flex items-center justify-between gap-2 border-b border-slate-800 bg-slate-900/60 flex-shrink-0"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.5rem)', paddingBottom: '0.5rem' }}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/20 rounded-full shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-semibold">Live</span>
          </div>
          <span className="text-slate-300 font-mono text-sm tabular-nums shrink-0">{formatTime(elapsed)}</span>
        </div>

        <div className="hidden sm:block text-center min-w-0">
          <div className="text-white font-medium text-sm truncate">{booking.subject}</div>
          <div className="text-slate-400 text-xs truncate">with {otherPerson}</div>
        </div>

        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide shrink-0 ${isTutor ? 'bg-emerald-900/50 text-emerald-400' : 'bg-blue-900/50 text-blue-300'}`}>
          {isTutor ? 'Tutor' : 'Student'}
        </span>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Video Area */}
        <div className={`flex-1 p-3 flex flex-col min-w-0 ${activePanel ? 'hidden sm:flex' : 'flex'}`}>
          {error ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-red-400 text-lg mb-2">Connection Error</div>
                <div className="text-slate-500 text-sm">{error}</div>
                <button onClick={handleEnd} className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg text-sm">Go Back</button>
              </div>
            </div>
          ) : (
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-slate-900">
              {/* Main Video (Remote or Screen Share) — 'contain' so a shared
                  screen is shown whole, not cropped/zoomed. */}
              {remoteUsers.length > 0 && remoteUsers[0].videoTrack ? (
                <VideoPlayer track={remoteUsers[0].videoTrack} fit="contain" />
              ) : isScreenSharing && screenTrack ? (
                <VideoPlayer track={screenTrack} fit="contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-3">
                      <Icon name="user" className="w-8 h-8" />
                    </div>
                    <div className="text-slate-400 text-sm">Waiting for {otherPerson} to join…</div>
                  </div>
                </div>
              )}

              {/* Remote user label */}
              {remoteUsers.length > 0 && (
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 rounded-lg text-white text-xs">{otherPerson}</div>
              )}

              {/* Self View (PiP) */}
              <div className="absolute bottom-3 right-3 w-36 h-28 sm:w-44 sm:h-32 rounded-xl overflow-hidden border-2 border-slate-700 shadow-xl">
                {localTracks.video && !isVideoOff ? (
                  <VideoPlayer track={localTracks.video} fit="cover" />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg font-semibold text-slate-300 uppercase">{user.name?.[0] || '?'}</div>
                  </div>
                )}
                <div className="absolute bottom-1 left-1 flex items-center gap-1 px-1.5 py-0.5 bg-black/60 rounded text-white text-[10px]">
                  You {isMuted && <Icon name="mic" slash className="w-3 h-3" />}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel: Chat or Whiteboard */}
        {activePanel && (
          <div className={`${activePanel === 'chat' ? 'w-full sm:w-80' : 'w-full sm:w-[55%]'} border-l border-slate-800 flex flex-col bg-slate-900/80 min-h-0`}>
            {/* Panel header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-800 flex-shrink-0">
              <h3 className="font-semibold text-white text-sm">
                {activePanel === 'chat' ? 'Chat' : activePanel === 'whiteboard' ? 'Whiteboard' : 'Spreadsheet'}
              </h3>
              <button onClick={() => setActivePanel(null)} aria-label="Close" className="text-slate-400 hover:text-white"><Icon name="close" className="w-5 h-5" /></button>
            </div>

            {/* Chat Panel */}
            {activePanel === 'chat' && (
              <>
                <div className="flex-1 p-3 overflow-y-auto space-y-2 min-h-0">
                  {messages.length === 0 ? (
                    <div className="text-center text-slate-500 text-xs py-8">No messages yet. Say hello!</div>
                  ) : (
                    messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.isRemote ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg.isRemote ? 'bg-slate-700 text-white' : 'bg-emerald-600 text-white'}`}>
                          {msg.isRemote && <div className="text-[10px] text-slate-400 mb-0.5">{msg.sender}</div>}
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-3 border-t border-slate-800 flex-shrink-0">
                  <div className="flex gap-2">
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button onClick={sendMessage} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm transition-colors">Send</button>
                  </div>
                </div>
              </>
            )}

            {/* Whiteboard Panel */}
            {activePanel === 'whiteboard' && (
              <div className="flex-1 min-h-0">
                <Whiteboard channelName={channelName} userName={user.name} />
              </div>
            )}

            {/* Spreadsheet Panel */}
            {activePanel === 'spreadsheet' && (
              <div className="flex-1 min-h-0">
                <Spreadsheet channelName={channelName} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls Bar — compact so all seven fit on a narrow phone (the End
          button used to overflow off-screen, stranding the student). Scrolls
          horizontally as a last resort, and pads under the home indicator. */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 py-2 border-t border-slate-800 bg-slate-900/60 flex-shrink-0 overflow-x-auto"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.5rem)' }}>
        <ControlButton name="mic" slash={isMuted} label={isMuted ? 'Unmute' : 'Mute'} active={isMuted} onClick={toggleMute} />
        <ControlButton name="video" slash={isVideoOff} label={isVideoOff ? 'Start' : 'Stop'} active={isVideoOff} onClick={toggleVideo} />
        <ControlButton name="screen" label="Screen" active={isScreenSharing} onClick={toggleScreenShare} />
        <ControlButton name="board" label="Board" active={activePanel === 'whiteboard'} onClick={() => togglePanel('whiteboard')} />
        <ControlButton name="sheet" label="Sheet" active={activePanel === 'spreadsheet'} onClick={() => togglePanel('spreadsheet')} />
        <ControlButton name="chat" label="Chat" active={activePanel === 'chat'} onClick={() => togglePanel('chat')} />
        <ControlButton name="end" label="Leave" danger onClick={handleEnd} />
      </div>
    </div>
  );
};

export default VideoRoom;
