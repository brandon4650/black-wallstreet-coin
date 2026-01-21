import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Volume1, Music, SkipForward } from 'lucide-react';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50); // 0-100
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const playerRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);
  const volumeSliderRef = useRef(null);

  // Playlist of YouTube Video IDs
  const playlist = [
    { id: 'wEBlaMOmKV4', title: "What's Going On" },      // Marvin Gaye
    { id: 'Srns7NiO278', title: "For the Love of You" }, // Isley Brothers
  ];

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    const initPlayer = () => {
      if (playerRef.current) return; // Already initialized
      
      playerRef.current = new window.YT.Player('yt-player', {
        height: '0',
        width: '0',
        videoId: playlist[0].id,
        playerVars: {
          autoplay: 1, // Try to autoplay
          loop: 0,     // We handle looping manually for playlist
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            setPlayerReady(true);
            // Set initial volume
            event.target.setVolume(volume);
            // Try to autoplay immediately
            tryAutoplay();
          },
          onStateChange: handleStateChange,
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  // Close volume slider when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (volumeSliderRef.current && !volumeSliderRef.current.contains(event.target)) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStateChange = (event) => {
    // When video ends, play next song in playlist
    if (event.data === window.YT.PlayerState.ENDED) {
      playNextTrack();
    }
    // Update playing state
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      setShowPrompt(false);
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
    }
  };

  const playNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    if (playerRef.current) {
      playerRef.current.loadVideoById(playlist[nextIndex].id);
      playerRef.current.playVideo();
    }
  };

  const tryAutoplay = () => {
    if (playerRef.current) {
      playerRef.current.playVideo();
      // Check if actually playing after a delay
      setTimeout(() => {
        if (playerRef.current) {
          const state = playerRef.current.getPlayerState();
          if (state === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            setShowPrompt(false);
          }
        }
      }, 1000);
    }
  };

  const hasAutoPlayedRef = useRef(false);

  // Global Interaction Listener for Autoplay
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasAutoPlayedRef.current && playerRef.current && playerReady) {
        playerRef.current.playVideo();
        hasAutoPlayedRef.current = true;
        
        // Remove listeners immediately
        window.removeEventListener('click', handleInteraction);
        window.removeEventListener('scroll', handleInteraction);
        window.removeEventListener('touchstart', handleInteraction);
      }
    };

    if (!hasAutoPlayedRef.current) {
      window.addEventListener('click', handleInteraction);
      window.addEventListener('scroll', handleInteraction);
      window.addEventListener('touchstart', handleInteraction);
    }

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [playerReady]);

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

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (playerRef.current && playerReady) {
      playerRef.current.setVolume(newVolume);
      if (newVolume === 0) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    }
  };

  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  const handleEnableMusic = () => {
    if (playerRef.current && playerReady) {
      playerRef.current.playVideo();
      setIsPlaying(true);
      setShowPrompt(false);
    }
  };

  const handleSkipTrack = () => {
    playNextTrack();
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-5 w-5" />;
    if (volume < 50) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
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
          {/* Play/Pause Button */}
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

          {/* Skip Button */}
          <button
            onClick={handleSkipTrack}
            className="p-3 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-all"
            title={`Skip to: ${playlist[(currentTrackIndex + 1) % playlist.length].title}`}
          >
            <SkipForward className="h-5 w-5" />
          </button>

          {/* Volume Control */}
          <div className="relative" ref={volumeSliderRef}>
            <button
              onClick={toggleVolumeSlider}
              className={`p-3 rounded-full transition-all ${
                volume === 0 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
              title={`Volume: ${volume}%`}
            >
              {getVolumeIcon()}
            </button>

            {/* Volume Slider Popup */}
            {showVolumeSlider && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-zinc-900 rounded-xl border border-zinc-700 shadow-xl">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-zinc-400">{volume}%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-2 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-amber-500"
                    style={{
                      WebkitAppearance: 'none',
                      background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${volume}%, #3f3f46 ${volume}%, #3f3f46 100%)`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BackgroundMusic;
