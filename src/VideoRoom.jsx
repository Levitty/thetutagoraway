import React, { useState, useEffect, useRef, useCallback } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { supabase } from './supabase';

const AGORA_APP_ID = '35a8f51c866e44bfbb7bd5e3970e75e4';

// ==================== VIDEO PLAYER ====================
const VideoPlayer = ({ track }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && track) {
      track.play(ref.current);
    }
    return () => track?.stop();
  }, [track]);
  return <div ref={ref} className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden" />;
};

// ==================== CONTROL BUTTON ====================
const ControlButton = ({ icon, label, active, danger, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all ${
      danger ? 'bg-red-500 hover:bg-red-600 text-white' :
      active ? 'bg-slate-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-xs">{label}</span>
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
  const [activePanel, setActivePanel] = useState(null); // null | 'chat' | 'whiteboard'

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
      {/* Header */}
      <header className="h-14 px-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">T</div>
          <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">Live</span>
          </div>
          <span className="text-slate-400 font-mono text-sm">{formatTime(elapsed)}</span>
        </div>

        <div className="text-center">
          <div className="text-white font-medium text-sm">{booking.subject}</div>
          <div className="text-slate-400 text-xs">with {otherPerson}</div>
        </div>

        <div className="flex items-center gap-1">
          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wide ${isTutor ? 'bg-emerald-900/50 text-emerald-400' : 'bg-blue-900/50 text-blue-400'}`}>
            {isTutor ? 'Tutor' : 'Student'}
          </span>
        </div>
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
              {/* Main Video (Remote or Screen Share) */}
              {remoteUsers.length > 0 && remoteUsers[0].videoTrack ? (
                <VideoPlayer track={remoteUsers[0].videoTrack} />
              ) : isScreenSharing && screenTrack ? (
                <VideoPlayer track={screenTrack} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-3xl mx-auto mb-3">👤</div>
                    <div className="text-slate-400 text-sm">Waiting for {otherPerson} to join...</div>
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
                  <VideoPlayer track={localTracks.video} />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg">{user.name?.[0] || '👤'}</div>
                  </div>
                )}
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-white text-[10px]">
                  You {isMuted && '🔇'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel: Chat or Whiteboard */}
        {activePanel && (
          <div className={`${activePanel === 'whiteboard' ? 'w-full sm:w-[55%]' : 'w-full sm:w-80'} border-l border-slate-800 flex flex-col bg-slate-900/80 min-h-0`}>
            {/* Panel header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-800 flex-shrink-0">
              <h3 className="font-semibold text-white text-sm">
                {activePanel === 'chat' ? '💬 Chat' : '🖊️ Whiteboard'}
              </h3>
              <button onClick={() => setActivePanel(null)} className="text-slate-400 hover:text-white text-lg">✕</button>
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
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="h-20 px-4 flex items-center justify-center gap-2 border-t border-slate-800 bg-slate-900/50 flex-shrink-0">
        <ControlButton
          icon={isMuted ? '🔇' : '🎤'}
          label={isMuted ? 'Unmute' : 'Mute'}
          active={isMuted}
          onClick={toggleMute}
        />
        <ControlButton
          icon={isVideoOff ? '📷' : '📹'}
          label={isVideoOff ? 'Start' : 'Stop'}
          active={isVideoOff}
          onClick={toggleVideo}
        />
        <ControlButton
          icon="🖥️"
          label="Screen"
          active={isScreenSharing}
          onClick={toggleScreenShare}
        />
        <ControlButton
          icon="🖊️"
          label="Board"
          active={activePanel === 'whiteboard'}
          onClick={() => togglePanel('whiteboard')}
        />
        <ControlButton
          icon="💬"
          label="Chat"
          active={activePanel === 'chat'}
          onClick={() => togglePanel('chat')}
        />
        <div className="w-px h-10 bg-slate-700 mx-1" />
        <ControlButton
          icon="📞"
          label="End"
          danger
          onClick={handleEnd}
        />
      </div>
    </div>
  );
};

export default VideoRoom;
