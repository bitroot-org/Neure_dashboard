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
import { useAudio } from '../AudioPlayer/AudioContext';

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
    <footer className="soundscapes-player">
      <div className="soundscapes-player-progress">
        <div 
          className="progress-bar-container"
          onClick={handleSeek}
        >
          <div 
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="soundscapes-footer-content">
        <div className="soundscapes-now-playing">
          <div className="soundscapes-track-thumbnail">
            {currentTrack.sound_cover_image && (
              <img 
                src={currentTrack.sound_cover_image} 
                alt={currentTrack.title}
                loading="lazy"
                key={currentTrack.id}
              />
            )}
          </div>
          <div className="soundscapes-track-info">
            <h3>{currentTrack.title || 'Unknown Title'}</h3>
            {currentTrack.artist_name && <p>{currentTrack.artist_name}</p>}
          </div>
        </div>

        <div className="soundscapes-player-controls">
          <button 
            className={`soundscapes-shuffle ${shuffle ? 'active' : ''}`}
            onClick={toggleShuffle}
          >
            <SwapOutlined />
          </button>
          <button 
            className="soundscapes-prev"
            onClick={playPrevTrack}
          >
            <StepBackwardOutlined />
          </button>
          <button className="soundscapes-play" onClick={togglePlay}>
            {isPlaying ? <PauseCircleFilled /> : <PlayCircleFilled />}
          </button>
          <button 
            className="soundscapes-next"
            onClick={playNextTrack}
          >
            <StepForwardOutlined />
          </button>
          <button 
            className={`soundscapes-repeat ${repeat ? 'active' : ''}`}
            onClick={toggleRepeat}
          >
            <RetweetOutlined />
          </button>
        </div>

        <div className="soundscapes-player-actions">
          <button 
            className="soundscapes-like-button"
            onClick={(e) => {
              e.stopPropagation();
              onLike && onLike(currentTrack.id);
            }}
          >
            {currentTrack.is_liked_by_user === 1 ? (
              <HeartFilled style={{ color: '#ff4757' }} />
            ) : (
              <HeartOutlined />
            )}
          </button>
          <button className="soundscapes-more-button">
            <EllipsisOutlined />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default PlayerFooter;
