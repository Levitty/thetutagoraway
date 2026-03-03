import React, { useState, useEffect, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

const AGORA_APP_ID = '35a8f51c866e44bfbb7bd5e3970e75e4';

// Video Player Component
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

// Control Button Component
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

// Main Video Room Component
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
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Join room on mount
  useEffect(() => {
    const init = async () => {
      try {
        // Set up event handlers
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

        // Generate channel name from booking
        const channelName = `lesson-${booking.id}`;
        
        // Join channel
        await client.join(AGORA_APP_ID, channelName, null, user.id);

        // Create and publish local tracks
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

    // Cleanup on unmount
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
        if (localTracks.video) {
          await client.publish(localTracks.video);
        }
        setIsScreenSharing(false);
      } else {
        const track = await AgoraRTC.createScreenVideoTrack({
          encoderConfig: '1080p_1'
        }, 'disable');
        
        if (localTracks.video) {
          await client.unpublish(localTracks.video);
        }
        await client.publish(track);
        
        track.on('track-ended', async () => {
          await client.unpublish(track);
          track.close();
          setScreenTrack(null);
          if (localTracks.video) {
            await client.publish(localTracks.video);
          }
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

  // Send chat message
  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: 'me', time: new Date() }]);
      setNewMessage('');
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // Determine who is the tutor and who is the student
  const isTutor = user.role === 'tutor';
  const otherPerson = isTutor ? 'Student' : booking.tutors?.profiles?.full_name || 'Tutor';

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col">
      {/* Header */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold">T</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">Live</span>
            </div>
            <span className="text-slate-400 font-mono">{formatTime(elapsed)}</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-white font-medium">{booking.subject}</div>
          <div className="text-slate-400 text-sm">with {otherPerson}</div>
        </div>

        <button onClick={() => setShowChat(!showChat)} className="relative text-slate-400 hover:text-white p-2">
          💬
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              {messages.length}
            </span>
          )}
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 p-4">
          {error ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-red-400 text-lg mb-2">Connection Error</div>
                <div className="text-slate-500">{error}</div>
                <button onClick={handleEnd} className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg">
                  Go Back
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col gap-4">
              {/* Main Video (Remote or Screen Share) */}
              <div className="flex-1 relative rounded-2xl overflow-hidden bg-slate-900">
                {remoteUsers.length > 0 && remoteUsers[0].videoTrack ? (
                  <VideoPlayer track={remoteUsers[0].videoTrack} />
                ) : isScreenSharing && screenTrack ? (
                  <VideoPlayer track={screenTrack} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-4xl mx-auto mb-4">
                        👤
                      </div>
                      <div className="text-slate-400">Waiting for {otherPerson} to join...</div>
                    </div>
                  </div>
                )}
                
                {/* Remote user name overlay */}
                {remoteUsers.length > 0 && (
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/60 rounded-lg text-white text-sm">
                    {otherPerson}
                  </div>
                )}
              </div>

              {/* Self View (Picture-in-Picture) */}
              <div className="absolute bottom-28 right-8 w-48 h-36 rounded-xl overflow-hidden border-2 border-slate-700 shadow-xl">
                {localTracks.video && !isVideoOff ? (
                  <VideoPlayer track={localTracks.video} />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-xl">
                      {user.name?.[0] || '👤'}
                    </div>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-white text-xs">
                  You {isMuted && '🔇'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 border-l border-slate-800 flex flex-col bg-slate-900/50">
            <div className="p-4 border-b border-slate-800">
              <h3 className="font-semibold text-white">Chat</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-slate-500 text-sm py-8">No messages yet</div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                      msg.sender === 'me' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-slate-800">
              <div className="flex gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
                />
                <button onClick={sendMessage} className="px-3 py-2 bg-emerald-500 text-white rounded-lg">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="h-24 px-6 flex items-center justify-center gap-3 border-t border-slate-800 bg-slate-900/50">
        <ControlButton 
          icon={isMuted ? '🔇' : '🎤'} 
          label={isMuted ? 'Unmute' : 'Mute'} 
          active={isMuted}
          onClick={toggleMute} 
        />
        <ControlButton 
          icon={isVideoOff ? '📷' : '📹'} 
          label={isVideoOff ? 'Start Video' : 'Stop Video'} 
          active={isVideoOff}
          onClick={toggleVideo} 
        />
        <ControlButton 
          icon="🖥️" 
          label={isScreenSharing ? 'Stop Share' : 'Share Screen'} 
          active={isScreenSharing}
          onClick={toggleScreenShare} 
        />
        <ControlButton 
          icon="💬" 
          label="Chat" 
          active={showChat}
          onClick={() => setShowChat(!showChat)} 
        />
        <div className="w-px h-12 bg-slate-700 mx-2" />
        <ControlButton 
          icon="📞" 
          label="End Lesson" 
          danger
          onClick={handleEnd} 
        />
      </div>
    </div>
  );
};

export default VideoRoom;
