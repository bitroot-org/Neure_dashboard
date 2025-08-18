import React, { useState, useEffect } from "react";
// Tailwind-only: styles moved inline
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
      <div className="min-h-[calc(100vh-88px)] w-full px-4 pt-10 md:px-10 xl:px-24">
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
    <div className="min-h-[calc(100vh-88px)] w-full px-4 pt-10 md:px-10 xl:px-24">
      <CustomHeader title="Favourite Soundscapes" />

      <main className="mt-6">
        {favourites.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center p-5">
            <div className="mx-auto flex max-w-[400px] flex-col items-center rounded-2xl border border-[#4c4d52] bg-transparent p-10 text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#373945]">
                <HeartOutlined className="text-[48px] text-[#ff4757]" />
              </div>
              <h2 className="mb-3 bg-gradient-to-r from-[#ff4757] to-[#ff6b81] bg-clip-text text-xl font-semibold text-transparent">No Favourites Yet</h2>
              <p className="mb-8 max-w-[300px] text-sm text-white/60">Start adding your favorite soundscapes to create your personal collection</p>
              {/* Optional: Add a CTA button if you want to direct users somewhere */}
              <button
                className="rounded-xl border-0 bg-gradient-to-r from-[#ff4757] to-[#ff6b81] px-8 py-3 text-white shadow-[0_4px_15px_rgba(255,71,87,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,71,87,0.3)]"
                onClick={() => window.location.href = '/soundscapes'}
              >
                Explore Soundscapes
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {favourites.map((track) => (
              <div key={track.id} className="flex items-center rounded-xl bg-white/10 p-3 transition-colors hover:bg-white/20">
                <div className="h-16 w-16 cursor-pointer overflow-hidden rounded-md" onClick={() => handlePlayTrack(track)}>
                  <img className="h-full w-full object-cover" src={track.sound_cover_image} alt={track.title} loading="lazy" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="m-0 text-base font-medium text-white">{track.title}</h3>
                  {track.artist_name && <p className="m-0 mt-1 text-sm text-white/70">{track.artist_name}</p>}
                </div>

                <div className="ml-4 flex items-center gap-4">
                  <div className="text-sm text-white/70">
                    {formatDuration(track.duration)}
                  </div>
                  <button className="rounded-full bg-white/20 p-2 text-white transition hover:scale-110" onClick={() => handleLike(track.id)}>
                    {track.is_liked_by_user === 1 ? (
                      <HeartFilled style={{ color: '#ff4757' }} />
                    ) : (
                      <HeartOutlined className="text-[48px] text-[#ff4757]" />
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
