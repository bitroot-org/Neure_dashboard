import React, { useState, useEffect } from 'react';
import { HeartOutlined, HeartFilled, EllipsisOutlined } from '@ant-design/icons';

const PlayerModal = ({ isOpen, onClose, track, audio, onLike }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audio) {
      // Update duration when audio metadata is loaded
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      };

      // Update current time while playing
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      // Handle audio errors
      const handleError = (e) => {
        console.error('Audio error in modal:', e);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('error', handleError);

      // Set initial values if already loaded
      if (audio.duration) {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      }

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [audio]);

  const togglePlayPause = () => {
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(e => console.error('Error playing audio:', e));
    } else {
      audio.pause();
    }
  };

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audio && !isNaN(newTime) && isFinite(newTime)) {
      try {
        audio.currentTime = newTime;
        setCurrentTime(newTime);
      } catch (e) {
        console.error('Error setting audio time:', e);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex justify-center items-center z-[1000] backdrop-blur-[5px]">
      <div className="relative bg-[rgba(26,26,26,0.7)] w-full max-w-[700px] rounded-xl overflow-hidden text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div
          className="absolute top-0 left-0 right-0 bottom-0 bg-cover bg-center blur-[40px] opacity-30 -z-10"
          style={{ backgroundImage: `url(${track?.imageUrl || 'https://plus.unsplash.com/premium_photo-1683140707316-42df87760f3f?w=500&auto=format&fit=crop&q=60'})` }}
        />

        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <div className="text-xl font-medium">Now playing</div>
          <button className="bg-none border-none text-white cursor-pointer flex items-center gap-2 text-base hover:text-white/80 transition-colors" onClick={onClose}>
            Minimise <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="flex-shrink-0">
              <img
                src={track.image || "https://plus.unsplash.com/premium_photo-1683140707316-42df87760f3f?w=500&auto=format&fit=crop&q=60"}
                alt={track.title}
                className="w-24 h-24 rounded-xl object-cover shadow-lg"
              />
            </div>

            <div className="flex-1 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold mb-2 text-white">{track.title}</h2>
                {track.artist_name && <p className="text-white/70 text-lg">{track.artist_name}</p>}
              </div>

              <div className="flex gap-3">
                <button
                  className="w-12 h-12 bg-white/10 border-none rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike && onLike(track.id);
                  }}
                >
                  {track.is_liked_by_user === 1 ? (
                    <HeartFilled style={{ color: '#ff4757' }} />
                  ) : (
                    <HeartOutlined />
                  )}
                </button>
                <button className="w-12 h-12 bg-white/10 border-none rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-colors">
                  <EllipsisOutlined />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime || 0}
                onChange={handleProgressChange}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-lg"
              />
              <div className="flex justify-between text-sm text-white/70">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex justify-center items-center gap-6">
              <button className="w-12 h-12 bg-white/10 border-none rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 9L21 12L18 15M18 4L21 7L18 10M3 20L12 12L21 20M3 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="w-12 h-12 bg-white/10 border-none rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 20L9 12L19 4V20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="w-16 h-16 bg-white border-none rounded-full flex items-center justify-center text-black cursor-pointer hover:bg-white/90 transition-colors shadow-lg" onClick={togglePlayPause}>
                {!audio?.paused ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 4H6V20H10V4Z" fill="currentColor" />
                    <path d="M18 4H14V20H18V4Z" fill="currentColor" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 4L19 12L5 20V4Z" fill="currentColor" />
                  </svg>
                )}
              </button>
              <button className="w-12 h-12 bg-white/10 border-none rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4L15 12L5 20V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="w-12 h-12 bg-white/10 border-none rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 2L21 6L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 11V9C3 7.93913 3.42143 6.92172 4.17157 6.17157C4.92172 5.42143 5.93913 5 7 5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 22L3 18L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 13V15C21 16.0609 20.5786 17.0783 19.8284 17.8284C19.0783 18.5786 18.0609 19 17 19H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
