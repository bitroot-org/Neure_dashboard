// SoundscapeContainer.jsx
import React, { useState, useEffect, useRef } from "react";
// Tailwind-only: styles moved inline
import CustomHeader from "../../components/CustomHeader";
import {
  RightOutlined,
  HeartOutlined,
  HeartFilled,
  EllipsisOutlined,
} from "@ant-design/icons";
import PlayerModal from "../../components/PlayerModal";
import { getSoundscapesByUserId, likeSoundscape, unlikeSoundscape } from "../../services/api";
import {
  AudioProvider,
  useAudio,
} from "../../context/AudioContext";
import SoundscapeCarousel from "../../components/Carousel";
import PlayerFooter from "../../components/PlayerFooter";
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
    <div className="min-h-[calc(100vh-88px)] w-full overflow-y-auto px-0 pt-10 text-white md:px-10 xl:px-24">
      <CustomHeader title="Soundscapes" />

      <main className="flex flex-col flex-1 overflow-y-auto mb-5">
        {/* Top Picks Section */}
        <section className="mb-10">
          <div className="mt-2 mb-6 flex items-center justify-between">
            <h2 className="m-0 text-2xl font-medium">Top picks for you</h2>
            <button
              className="flex items-center justify-center rounded-full bg-white/25 p-2 transition hover:scale-105"
              onClick={() => navigate('/favourite-soundscapes')}
            >
              <HeartOutlined style={{ fontSize: '24px', color: '#fff' }} />
            </button>
          </div>
          <SoundscapeCarousel items={picks} />
        </section>

        {/* Fresh Tunes Section */}
        <section className="mb-24">
          <h2 className="mb-6 text-2xl font-medium">Fresh tunes</h2>
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8">
            {tunes.map((tune) => (
              <div key={tune.id} className="flex h-[74px] items-center rounded-lg pr-3 transition-colors">
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
                <div className="min-w-0 flex-1">
                  <h3 className="m-0 truncate text-base font-medium">{tune.title}</h3>
                  {tune.artist_name && <p className="m-0 mt-1 truncate text-sm text-white/50">{tune.artist_name}</p>}
                </div>

                <div className="ml-4 flex shrink-0 items-center gap-3">
                  <div className="text-sm text-white/70">
                    {formatDuration(tune.duration)}
                  </div>
                  <button
                    className={`flex items-center justify-center rounded-full bg-white/10 p-2 transition ${likedTracks.has(tune.id) ? 'bg-[rgba(255,71,87,0.1)]' : ''}`}
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
                  <button className="flex items-center justify-center rounded-full bg-white/10 p-2">
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
