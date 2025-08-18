import React, { useEffect, useState } from 'react';
import { 
  HeartOutlined, 
  HeartFilled,
  EllipsisOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  PlayCircleFilled,
  PauseCircleFilled,
  RetweetOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { useAudio } from '../context/AudioContext';

const PlayerFooter = ({ onLike }) => {
  const [progress, setProgress] = useState(0);
  const { 
    currentTrack, 
    isPlaying, 
    shuffle, 
    repeat, 
    togglePlay, 
    toggleShuffle, 
    toggleRepeat,
    playNextTrack,
    playPrevTrack,
    audio
  } = useAudio();

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audio) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        setProgress(progressPercent || 0);
      }
    };

    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, [audio]);

  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const seekTime = (clickPosition / progressBarWidth) * audio.duration;
    
    if (audio) {
      audio.currentTime = seekTime;
    }
  };

  if (!currentTrack) return null;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-[1000] w-full bg-[#191A2080] backdrop-blur-md">
      <div className="h-1 w-full cursor-pointer">
        <div className="relative h-full w-full cursor-pointer bg-white/20" onClick={handleSeek}>
          <div className="h-full bg-[#1DB954] transition-[width] duration-100" style={{ width: `${progress}%` }} />
        </div>
      </div>
      
      <div className="flex items-center justify-between border-t border-white/10 px-8 py-4">
        <div className="min-w-[240px] flex items-center gap-4">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
            {currentTrack.sound_cover_image && (
              <img 
                src={currentTrack.sound_cover_image} 
                alt={currentTrack.title}
                loading="lazy"
                key={currentTrack.id}
              />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="m-0 truncate text-base font-medium text-white">{currentTrack.title || 'Unknown Title'}</h3>
            {currentTrack.artist_name && <p className="m-0 mt-1 truncate text-sm text-white/70">{currentTrack.artist_name}</p>}
          </div>
        </div>

        <div className="mx-auto flex max-w-[400px] flex-1 items-center justify-center gap-6">
          <button className={`${shuffle ? 'text-[#1db954]' : ''} rounded-full p-2 text-white/70 transition hover:scale-110`} onClick={toggleShuffle}>
            <SwapOutlined />
          </button>
          <button className="rounded-full p-2 text-white/70 transition hover:scale-110" onClick={playPrevTrack}>
            <StepBackwardOutlined />
          </button>
          <button className="h-10 w-10 rounded-full bg-white text-black" onClick={togglePlay}>
            {isPlaying ? <PauseCircleFilled /> : <PlayCircleFilled />}
          </button>
          <button className="rounded-full p-2 text-white/70 transition hover:scale-110" onClick={playNextTrack}>
            <StepForwardOutlined />
          </button>
          <button className={`${repeat ? 'text-[#1db954]' : ''} rounded-full p-2 text-white/70 transition hover:scale-110`} onClick={toggleRepeat}>
            <RetweetOutlined />
          </button>
        </div>

        <div className="min-w-[240px] flex items-center justify-end gap-4">
          <button className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20" onClick={(e) => { e.stopPropagation(); onLike && onLike(currentTrack.id); }}>
            {currentTrack.is_liked_by_user === 1 ? (
              <HeartFilled style={{ color: '#ff4757' }} />
            ) : (
              <HeartOutlined />
            )}
          </button>
          <button className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20">
            <EllipsisOutlined />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default PlayerFooter;