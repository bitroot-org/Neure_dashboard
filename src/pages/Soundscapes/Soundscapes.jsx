// SoundscapeContainer.jsx
import React, { useState, useEffect, useRef } from "react";
import "./soundscapes.css";
import CustomHeader from "../../components/CustomHeader";
import {
  RightOutlined,
  HeartOutlined,
  HeartFilled,
  EllipsisOutlined,
} from "@ant-design/icons";
import PlayerModal from "../../components/PlayerModal/PlayerModal";
import { getSoundscapesByUserId, likeSoundscape, unlikeSoundscape } from "../../services/api";
import {
  AudioProvider,
  useAudio,
} from "../../components/AudioPlayer/AudioContext";
import SoundscapeCarousel from "../../components/Carousel/SoundscapeCarousel";
import PlayerFooter from "../../components/Player/PlayerFooter";
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const SoundscapeContent = () => {
  const [picks, setPicks] = useState([]);
  const [tunes, setTunes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [soundscapes, setSoundscapes] = useState([]);
  const [likedTracks, setLikedTracks] = useState(new Set());
  const { playTrack, currentTrack, setCurrentTrack, updatePlaylist } = useAudio();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const handleLike = async (trackId) => {
    try {
      const isCurrentlyLiked = likedTracks.has(trackId);
      
      if (isCurrentlyLiked) {
        await unlikeSoundscape(trackId);
        // Update likedTracks set
        setLikedTracks(prev => {
          const newSet = new Set(prev);
          newSet.delete(trackId);
          return newSet;
        });
      } else {
        await likeSoundscape(trackId);
        // Update likedTracks set
        setLikedTracks(prev => new Set(prev).add(trackId));
      }

      // Update all soundscapes states
      const updateSoundscapeState = (prevTracks) => 
        prevTracks.map(track => 
          track.id === trackId 
            ? { ...track, is_liked_by_user: isCurrentlyLiked ? 0 : 1 }
            : track
        );

      setSoundscapes(updateSoundscapeState);
      setPicks(updateSoundscapeState);
      setTunes(updateSoundscapeState);

      // Update currentTrack if it's the one being liked/unliked
      if (currentTrack && currentTrack.id === trackId) {
        setCurrentTrack(prev => ({
          ...prev,
          is_liked_by_user: isCurrentlyLiked ? 0 : 1
        }));
      }

    } catch (error) {
      console.error('Error toggling like:', error);
      message.error('Failed to update like status');
    }
  };

  // Move the data fetching to a separate useEffect with empty dependency array
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getSoundscapesByUserId({ currentPage: 1 });
        if (data.status && data.data.soundscapes) {
          const allSoundscapes = data.data.soundscapes.map(soundscape => ({
            ...soundscape,
            sound_cover_image: soundscape.sound_cover_image,
            title: soundscape.title,
            artist_name: soundscape.artist_name,
            sound_file_url: soundscape.sound_file_url,
            is_liked: soundscape.is_liked_by_user === 1 // Convert is_liked_by_user to boolean
          }));

          // Set initially liked tracks based on is_liked_by_user field
          const initialLikedTracks = new Set(
            allSoundscapes
              .filter(track => track.is_liked_by_user === 1)
              .map(track => track.id)
          );
          setLikedTracks(initialLikedTracks);

          setPicks(allSoundscapes.slice(0, 6));
          setTunes(allSoundscapes.slice(6));
          setSoundscapes(allSoundscapes);
          
          // Update the playlist in AudioContext
          updatePlaylist(allSoundscapes);
          
          // Set the first track as default if no track is currently set
          if (allSoundscapes.length > 0 && !currentTrack) {
            setCurrentTrack(allSoundscapes[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching soundscapes:", err);
        setError("Failed to load soundscapes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array since we only want to fetch once on mount

  const handleTimeUpdate = (currentTime, duration) => {
    const progressPercent = (currentTime / duration) * 100;
    setProgress(progressPercent);
    setDuration(duration);
  };

  const handleSeek = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const seekTime = (clickPosition / progressBarWidth) * duration;
    
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  // When playing a track from the list
  const handlePlayTrack = (track) => {
    console.log('Playing track:', track); // Debug log
    playTrack(track);
  };

  if (loading) {
    return (
      <div className="soundscapes-loading">
        <div className="loading-spinner"></div>
        <p>Loading soundscapes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="soundscapes-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="soundscape-container">
      <CustomHeader title="Soundscapes" />

      <main className="soundscapes-main-content">
        {/* Top Picks Section */}
        <section className="soundscapes-top-picks">
          <div className="soundscapes-section-header">
            <h2>Top picks for you</h2>
            <button 
              className="soundscapes-like-button"
              onClick={() => navigate('/favourite-soundscapes')}
            >
              <HeartOutlined style={{ fontSize: '24px', color: '#fff' }} />
            </button>
          </div>
          <SoundscapeCarousel items={picks} />
        </section>

        {/* Fresh Tunes Section */}
        <section className="soundscapes-fresh-tunes">
          <h2>Fresh tunes</h2>
          <div className="soundscapes-tunes-list">
            {tunes.map((tune) => (
              <div key={tune.id} className="soundscapes-tune-item">
                <div
                  className="soundscapes-tune-thumbnail"
                  onClick={() => handlePlayTrack(tune)}
                >
                  <img
                    src={tune.sound_cover_image}
                    alt={tune.title}
                    loading="lazy"
                  />
                </div>
                <div className="soundscapes-tune-info">
                  <h3>{tune.title}</h3>
                  {tune.artist_name && <p>{tune.artist_name}</p>}
                </div>

                <div className="soundscapes-tune-controls">
                  <div className="soundscapes-duration">
                    {formatDuration(tune.duration)}
                  </div>
                  <button 
                    className={`soundscapes-like-button ${likedTracks.has(tune.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(tune.id);
                    }}
                  >
                    {tune.is_liked_by_user === 1 ? (
                      <HeartFilled style={{ color: '#ff4757' }} />
                    ) : (
                      <HeartOutlined />
                    )}
                  </button>
                  <button className="soundscapes-more-button">
                    <img src="/DotsThreeOutline.svg" alt="More options" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {currentTrack && <PlayerFooter onLike={handleLike} />}

      <PlayerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        track={currentTrack}
        onLike={handleLike}
      />
    </div>
  );
};

const Soundscapes = () => (
  <AudioProvider>
    <SoundscapeContent />
  </AudioProvider>
);

export default Soundscapes;
