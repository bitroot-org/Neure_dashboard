import React, { useState, useEffect } from "react";
import "./favouriteSoundscapes.css";
import CustomHeader from "../../components/CustomHeader";
import { HeartOutlined, HeartFilled, EllipsisOutlined } from "@ant-design/icons";
import PlayerModal from "../../components/PlayerModal";
import { AudioProvider, useAudio } from "../../context/AudioContext";
import PlayerFooter from "../../components/PlayerFooter";
import { getLikedSoundscapes, likeSoundscape, unlikeSoundscape } from "../../services/api";
import { message } from 'antd';

const FavouriteSoundscapesContent = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { 
    playTrack, 
    currentTrack, 
    setCurrentTrack, 
    updatePlaylist 
  } = useAudio();

  // Separate useEffect for fetching favourites
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        setLoading(true);
        const response = await getLikedSoundscapes();
        
        if (response?.status && response?.data?.soundscapes) {
          const formattedSoundscapes = response.data.soundscapes.map(track => ({
            ...track,
            is_liked_by_user: 1
          }));
          setFavourites(formattedSoundscapes);
        } else {
          setError("No soundscapes data available");
        }
      } catch (err) {
        console.error("Error fetching favourites:", err);
        setError("Failed to load favourite soundscapes");
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []); // Empty dependency array

  // Separate useEffect for updating playlist
  useEffect(() => {
    if (favourites.length > 0) {
      updatePlaylist(favourites);
    }
  }, [favourites]); // Only depend on favourites

  const handlePlayTrack = (track) => {
    playTrack(track);
  };

  const handleLike = async (trackId) => {
    try {
      const track = favourites.find(t => t.id === trackId);
      const isCurrentlyLiked = track?.is_liked_by_user === 1;

      if (isCurrentlyLiked) {
        await unlikeSoundscape(trackId);
      } else {
        await likeSoundscape(trackId);
      }

      // Update favourites state
      const updatedFavourites = isCurrentlyLiked
        ? favourites.filter(track => track.id !== trackId)
        : favourites.map(track => 
            track.id === trackId 
              ? { ...track, is_liked_by_user: 1 }
              : track
          );

      setFavourites(updatedFavourites);

      // Update currentTrack if it's the one being liked/unliked
      if (currentTrack && currentTrack.id === trackId) {
        if (isCurrentlyLiked) {
          // If current track is unliked, play the next track if available
          const currentIndex = favourites.findIndex(t => t.id === trackId);
          const nextTrack = updatedFavourites[currentIndex] || updatedFavourites[0];
          if (nextTrack) {
            playTrack(nextTrack);
          } else {
            setCurrentTrack(null);
          }
        } else {
          setCurrentTrack(prev => ({
            ...prev,
            is_liked_by_user: 1
          }));
        }
      }

    } catch (error) {
      console.error('Error toggling like:', error);
      message.error('Failed to update like status');
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="fav-soundscapes-container">
        <CustomHeader title="Favourite Soundscapes" />
        <div className="fav-soundscapes-loading">
          <div className="loading-spinner"></div>
          <p>Loading favourites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fav-soundscapes-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="fav-soundscapes-container">
      <CustomHeader title="Favourite Soundscapes" />

      <main className="fav-soundscapes-content">
        {favourites.length === 0 ? (
          <div className="fav-soundscapes-empty">
            <div className="empty-state-container">
              <div className="empty-state-icon">
                <HeartOutlined />
              </div>
              <h2>No Favourites Yet</h2>
              <p>Start adding your favorite soundscapes to create your personal collection</p>
              {/* Optional: Add a CTA button if you want to direct users somewhere */}
              <button 
                className="explore-button"
                onClick={() => window.location.href = '/soundscapes'} // or use your router navigation
              >
                Explore Soundscapes
              </button>
            </div>
          </div>
        ) : (
          <div className="fav-soundscapes-list">
            {favourites.map((track) => (
              <div key={track.id} className="fav-tune-item">
                <div
                  className="fav-tune-thumbnail"
                  onClick={() => handlePlayTrack(track)}
                >
                  <img
                    src={track.sound_cover_image}
                    alt={track.title}
                    loading="lazy"
                  />
                </div>
                <div className="fav-tune-info">
                  <h3>{track.title}</h3>
                  {track.artist_name && <p>{track.artist_name}</p>}
                </div>

                <div className="fav-tune-controls">
                  <div className="fav-duration">
                    {formatDuration(track.duration)}
                  </div>
                  <button 
                    className="fav-like-button"
                    onClick={() => handleLike(track.id)}
                  >
                    {track.is_liked_by_user === 1 ? (
                      <HeartFilled style={{ color: '#ff4757' }} />
                    ) : (
                      <HeartOutlined />
                    )}
                  </button>
                  {/* <button className="fav-more-button">
                    <EllipsisOutlined />
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        )}
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

const FavouriteSoundscapes = () => (
  <AudioProvider>
    <FavouriteSoundscapesContent />
  </AudioProvider>
);

export default FavouriteSoundscapes;
