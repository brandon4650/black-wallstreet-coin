import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const playerRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);

  // YouTube Video ID extracted from URL
  const videoId = 'wEBlaMOmKV4';

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('yt-player', {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          loop: 1,
          playlist: videoId, // Required for looping
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            setPlayerReady(true);
            // Try to autoplay (may be blocked by browser)
            tryAutoplay();
          },
          onStateChange: (event) => {
            // When video ends, it should loop automatically due to playlist param
            if (event.data === window.YT.PlayerState.ENDED) {
              playerRef.current.playVideo();
            }
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const tryAutoplay = () => {
    if (playerRef.current) {
      playerRef.current.playVideo();
      // Check if actually playing after a delay
      setTimeout(() => {
        if (playerRef.current && playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING) {
          setIsPlaying(true);
          setShowPrompt(false);
        }
      }, 500);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current || !playerReady) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
      setShowPrompt(false);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current || !playerReady) return;

    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const handleEnableMusic = () => {
    if (playerRef.current && playerReady) {
      playerRef.current.playVideo();
      setIsPlaying(true);
      setShowPrompt(false);
    }
  };

  return (
    <>
      {/* Hidden YouTube Player */}
      <div id="yt-player" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} />

      {/* Music Enable Prompt - Shows on first visit */}
      {showPrompt && (
        <div className="fixed bottom-4 left-4 z-50 animate-fade-in">
          <button
            onClick={handleEnableMusic}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-500 rounded-full font-semibold text-sm shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all group"
          >
            <Music className="h-5 w-5 group-hover:animate-pulse" />
            <span>Enable Music</span>
          </button>
        </div>
      )}

      {/* Music Controls - Shows after enabling */}
      {!showPrompt && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2">
          <button
            onClick={togglePlay}
            className={`p-3 rounded-full transition-all ${
              isPlaying 
                ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
            title={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            <Music className={`h-5 w-5 ${isPlaying ? 'animate-pulse' : ''}`} />
          </button>
          <button
            onClick={toggleMute}
            className={`p-3 rounded-full transition-all ${
              isMuted 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
        </div>
      )}
    </>
  );
};

export default BackgroundMusic;
