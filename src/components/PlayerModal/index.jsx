import React, { useState, useEffect } from 'react';
import { HeartOutlined, EllipsisOutlined } from '@ant-design/icons';
import './PlayerModal.css';

const PlayerModal = ({ isOpen, onClose, track }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Reset state when a new track is loaded
    if (track) {
      setIsPlaying(true);
      setCurrentTime(0);

      // Convert duration string to seconds if available
      if (track.duration) {
        const [minutes, seconds] = track.duration.split(':').map(Number);
        setDuration(minutes * 60 + seconds);
      } else {
        // Default duration if not provided
        setDuration(5 * 60);
      }
    }
  }, [track]);

  // Update current time every second when playing
  useEffect(() => {
    let interval;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(prevTime => {
          const newTime = prevTime + 1;
          return newTime <= duration ? newTime : duration;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressChange = (e) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="player-modal">
        <div
          className="modal-background"
          style={{ backgroundImage: `url(${track?.imageUrl || 'https://plus.unsplash.com/premium_photo-1683140707316-42df87760f3f?w=500&auto=format&fit=crop&q=60'})` }}
        />
        <div className="modal-header">
          <div className="now-playing-text">Now playing</div>
          <button className="minimize-button" onClick={onClose}>
            Minimise <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="modal-content">
          <div className="track-conatiner">
            <div className="track-image-container">
              <img
                src={track.image || "https://plus.unsplash.com/premium_photo-1683140707316-42df87760f3f?w=500&auto=format&fit=crop&q=60"}
                alt={track.title}
                className="track-image"
              />
            </div>

            <div className="track-details">
              <div className='track-info'>
                <h2 className="track-title">{track.title}</h2>
                <p className="track-author">{track.author}</p>
              </div>

              <div className="track-actions">
                <button className="action-button">
                  <HeartOutlined />
                </button>
                <button className="action-button">
                  <EllipsisOutlined />
                </button>
              </div>
            </div>
          </div>

          <div className="playback-controls">
            <div className="progress-container">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleProgressChange}
                className="progress-slider"
              />
              <div className="time-display">
                <span>{formatTime(currentTime)}</span>
                <span>{track.duration || formatTime(duration)}</span>
              </div>
            </div>

            <div className="control-buttons">
              <button className="control-button shuffle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 9L21 12L18 15M18 4L21 7L18 10M3 20L12 12L21 20M3 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="control-button previous">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 20L9 12L19 4V20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="control-button play-pause" onClick={togglePlayPause}>
                {isPlaying ? (
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
              <button className="control-button next">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4L15 12L5 20V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="control-button repeat">
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