import React, { useState, useEffect } from "react";
import "./favouriteSoundscapes.css";
import CustomHeader from "../../components/CustomHeader";
import { HeartOutlined, EllipsisOutlined } from "@ant-design/icons";
import PlayerModal from "../../components/PlayerModal/PlayerModal";
import { AudioProvider, useAudio } from "../../components/AudioPlayer/AudioContext";
import PlayerFooter from "../../components/Player/PlayerFooter";
import { getLikedSoundscapes } from "../../services/api";

const FavouriteSoundscapesContent = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { playTrack, currentTrack } = useAudio();

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        setLoading(true);
        const response = await getLikedSoundscapes();
        
        // Check if response and data.soundscapes exists
        if (response?.status && response?.data?.soundscapes) {
          setFavourites(response.data.soundscapes);
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
  }, []);

  const handlePlayTrack = (track) => {
    playTrack(track);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="fav-soundscapes-loading">
        <div className="loading-spinner"></div>
        <p>Loading favourites...</p>
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
            <p>No favourite soundscapes yet</p>
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
                  <button className="fav-like-button">
                    <HeartOutlined style={{ color: '#ff4757' }} />
                  </button>
                  <button className="fav-more-button">
                    <EllipsisOutlined />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {currentTrack && <PlayerFooter />}

      <PlayerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        track={currentTrack}
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
