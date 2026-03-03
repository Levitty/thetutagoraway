import AgoraRTC from 'agora-rtc-sdk-ng';

// Agora Configuration
const AGORA_APP_ID = '35a8f51c866e44bfbb7bd5e3970e75e4';

// Initialize Agora client
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

export const useVideoRoom = () => {
  const [localTracks, setLocalTracks] = useState({ video: null, audio: null, screen: null });
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);

  // Join a video room
  const joinRoom = async (channelName, userId, role = 'host') => {
    try {
      // Set client role
      await client.setClientRole(role);

      // Subscribe to remote users
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === 'video') {
          setRemoteUsers(prev => {
            const exists = prev.find(u => u.uid === user.uid);
            if (exists) return prev.map(u => u.uid === user.uid ? user : u);
            return [...prev, user];
          });
        }
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      });

      client.on('user-unpublished', (user, mediaType) => {
        if (mediaType === 'video') {
          setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
        }
      });

      client.on('user-left', (user) => {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
      });

      // Join the channel (using null token for testing - use token server in production)
      await client.join(AGORA_APP_ID, channelName, null, userId);

      // Create and publish local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalTracks({ video: videoTrack, audio: audioTrack, screen: null });
      
      await client.publish([audioTrack, videoTrack]);
      setIsJoined(true);
      
      return { audioTrack, videoTrack };
    } catch (err) {
      setError(err.message);
      console.error('Error joining room:', err);
      throw err;
    }
  };

  // Leave the room
  const leaveRoom = async () => {
    // Stop and close local tracks
    if (localTracks.video) {
      localTracks.video.stop();
      localTracks.video.close();
    }
    if (localTracks.audio) {
      localTracks.audio.stop();
      localTracks.audio.close();
    }
    if (localTracks.screen) {
      localTracks.screen.stop();
      localTracks.screen.close();
    }

    // Leave the channel
    await client.leave();
    
    setLocalTracks({ video: null, audio: null, screen: null });
    setRemoteUsers([]);
    setIsJoined(false);
    setIsScreenSharing(false);
  };

  // Toggle microphone
  const toggleMute = async () => {
    if (localTracks.audio) {
      await localTracks.audio.setEnabled(isMuted);
      setIsMuted(!isMuted);
    }
  };

  // Toggle camera
  const toggleVideo = async () => {
    if (localTracks.video) {
      await localTracks.video.setEnabled(isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing, restore camera
        if (localTracks.screen) {
          await client.unpublish(localTracks.screen);
          localTracks.screen.stop();
          localTracks.screen.close();
        }
        if (localTracks.video) {
          await client.publish(localTracks.video);
        }
        setLocalTracks(prev => ({ ...prev, screen: null }));
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        const screenTrack = await AgoraRTC.createScreenVideoTrack({
          encoderConfig: '1080p_1',
        }, 'disable');
        
        // Unpublish camera, publish screen
        if (localTracks.video) {
          await client.unpublish(localTracks.video);
        }
        await client.publish(screenTrack);
        
        // Handle when user stops sharing via browser UI
        screenTrack.on('track-ended', async () => {
          await client.unpublish(screenTrack);
          screenTrack.close();
          if (localTracks.video) {
            await client.publish(localTracks.video);
          }
          setLocalTracks(prev => ({ ...prev, screen: null }));
          setIsScreenSharing(false);
        });

        setLocalTracks(prev => ({ ...prev, screen: screenTrack }));
        setIsScreenSharing(true);
      }
    } catch (err) {
      console.error('Screen share error:', err);
      setError('Could not share screen: ' + err.message);
    }
  };

  return {
    client,
    localTracks,
    remoteUsers,
    isJoined,
    isMuted,
    isVideoOff,
    isScreenSharing,
    isRecording,
    error,
    joinRoom,
    leaveRoom,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
  };
};

// Video Player Component
export const VideoPlayer = ({ track, style = {} }) => {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (containerRef.current && track) {
      track.play(containerRef.current);
    }
    return () => {
      track?.stop();
    };
  }, [track]);

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '100%', backgroundColor: '#1e293b', ...style }}
    />
  );
};

// Need to import useState and useRef at the top
import React, { useState, useRef, useEffect } from 'react';
