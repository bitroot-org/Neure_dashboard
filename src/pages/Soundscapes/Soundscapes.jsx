// SoundscapeContainer.jsx
import React, { useState, useEffect } from 'react';
import './Soundscapes.css';
import CustomHeader from '../../components/CustomHeader';
import {EllipsisOutlined, HeartOutlined, HeartFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
import PlayerModal from '../../components/PlayerModal/PlayerModal';
import { getSoundscapes } from '../../services/api';

const Soundscapes = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [picks, setPicks] = useState([]);
  const [tunes, setTunes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [audio] = useState(new Audio());

  useEffect(() => {
    fetchSoundscapes();

    // Cleanup audio on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  useEffect(() => {
    // Handle audio error
    const handleError = (e) => {
      console.error('Audio error:', e);
    };

    if (audio) {
      audio.addEventListener('error', handleError);
      return () => audio.removeEventListener('error', handleError);
    }
  }, [audio]);

  const fetchSoundscapes = async () => {
    try {
      const response = await getSoundscapes({ currentPage: 1 });
      if (response.status && response.data.soundscapes) {
        const allSoundscapes = response.data.soundscapes;
        // Split soundscapes into picks (first 6) and tunes (rest)
        setPicks(allSoundscapes.slice(0, 6));
        setTunes(allSoundscapes.slice(6));
      }
    } catch (error) {
      console.error('Error fetching soundscapes:', error);
    } finally {
      setLoading(false);
    }
  };

  const slideLeft = () => {
    setCurrentSlide(current => {
      // Calculate the maximum valid slide position
      const maxSlide = Math.max(0, picks.length - 3);
      // If at the beginning, go to the end, otherwise go back one
      return current === 0 ? maxSlide : Math.max(0, current - 1);
    });
  };

  const slideRight = () => {
    setCurrentSlide(current => {
      // Calculate the maximum valid slide position
      const maxSlide = Math.max(0, picks.length - 3);
      // If at the end, go to the beginning, otherwise go forward one
      return current >= maxSlide ? 0 : current + 1;
    });
  };

  // Add state to track audio playing status
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedTracks, setLikedTracks] = useState({});
  const [activeMenu, setActiveMenu] = useState(null);

  // Update isPlaying state when audio play/pause state changes
  useEffect(() => {
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audio]);

  // Play a track without opening the modal
  const playTrack = (track, shouldOpenModal = false) => {
    // If track is null/undefined or doesn't have a sound_file_url, don't proceed
    if (!track || !track.sound_file_url) {
      console.warn('Cannot play track: Missing track or sound file URL');
      return;
    }

    if (currentTrack && currentTrack.sound_file_url === track.sound_file_url) {
      // Toggle play/pause if same track
      if (audio.paused) {
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
        });
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } else {
      // Load and play new track
      try {
        audio.src = track.sound_file_url;
        audio.load();
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
        });
        setCurrentTrack(track);
        setIsPlaying(true);
      } catch (error) {
        console.error('Error setting up audio:', error);
        setIsPlaying(false);
      }
    }

    // Only open modal if requested
    if (shouldOpenModal) {
      setModalOpen(true);
    }
  };

  // Handle track selection (play and open modal)
  const handleTrackSelect = (track) => {
    playTrack(track, true);
  };

  // Handle like button click
  const handleLikeToggle = (e, trackId) => {
    e.stopPropagation(); // Prevent opening modal
    setLikedTracks(prev => ({
      ...prev,
      [trackId]: !prev[trackId]
    }));
  };

  // Toggle menu for a track
  const toggleMenu = (e, trackId) => {
    e.stopPropagation(); // Prevent opening modal
    setActiveMenu(activeMenu === trackId ? null : trackId);
  };

  // Handle clicking outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu && !event.target.closest('.soundscapes-menu-container')) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu]);

  const closeModal = () => {
    setModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="soundscape-container">
      <CustomHeader title="Soundscapes" />

      <main className="soundscapes-main-content">
        {/* Top Picks Section */}
        <section className="soundscapes-top-picks">
          <div className="soundscapes-section-header">
            <h2>Top picks for you</h2>
            <p className="soundscapes-see-all">See all <RightOutlined /></p>
          </div>
          <div className="soundscapes-carousel-container">
            <button className="soundscapes-carousel-button soundscapes-left" onClick={slideLeft}><LeftOutlined /></button>
            <div className="soundscapes-carousel-wrapper">
              <div
                className="soundscapes-carousel-content"
                style={{ transform: `translateX(-${currentSlide * 33.33}%)` }}
              >
                {picks.map((pick) => (
                  <div key={pick.id} className="soundscapes-carousel-card" onClick={() => handleTrackSelect(pick)}>
                    <div className="soundscapes-card-image">
                      <img
                        src={pick.sound_cover_image}
                        alt={pick.title}
                        className="soundscapes-card-img"
                      />
                      <div className="soundscapes-play-overlay">
                        <img
                          src={currentTrack && currentTrack.id === pick.id && isPlaying ? './pause.svg' : './play.svg'}
                          alt={currentTrack && currentTrack.id === pick.id && isPlaying ? "Pause" : "Play"}
                        />
                      </div>
                    </div>
                    <div className="soundscapes-card-info">
                      <h3>{pick.title}</h3>
                      {pick.author && <p>{pick.author}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="soundscapes-carousel-button soundscapes-right" onClick={slideRight}><RightOutlined /></button>
          </div>
        </section>

        {/* Fresh Tunes Section */}
        <section className="soundscapes-fresh-tunes">
          <h2>Fresh tunes</h2>
          <div className="soundscapes-tunes-list">
            {tunes.map((tune) => (
              <div key={tune.id} className="soundscapes-tune-item" onClick={() => handleTrackSelect(tune)}>
                <div className="soundscapes-tune-thumbnail">
                  <img src={tune.sound_cover_image} alt={tune.title} />
                  {currentTrack && currentTrack.id === tune.id && isPlaying && (
                    <div className="soundscapes-tune-playing-indicator">Playing</div>
                  )}
                </div>
                <div className="soundscapes-tune-info">
                  <h3>{tune.title}</h3>
                  {tune.author && <p>{tune.author}</p>}
                </div>
                <div className="soundscapes-tune-controls">
                  <button
                    className="soundscapes-tune-play-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening modal
                      if (currentTrack && currentTrack.id === tune.id) {
                        // Toggle play/pause
                        if (audio.paused) {
                          audio.play().catch(console.error);
                        } else {
                          audio.pause();
                        }
                      } else {
                        // Play new track without opening modal
                        playTrack(tune, false);
                      }
                    }}
                  >
                    <img
                      src={currentTrack && currentTrack.id === tune.id && isPlaying ? './pause.svg' : './play.svg'}
                      alt={currentTrack && currentTrack.id === tune.id && isPlaying ? 'Pause' : 'Play'}
                    />
                  </button>
                  <button
                    className="soundscapes-like-button"
                    onClick={(e) => handleLikeToggle(e, tune.id)}
                  >
                    {likedTracks[tune.id] ? (
                      <img src='like-filled.svg' alt='unlike' style={{ filter: 'invert(39%) sepia(57%) saturate(2532%) hue-rotate(330deg) brightness(94%) contrast(96%)' }} />
                    ) : (
                      <img src='like.svg' alt='like' />
                    )}
                  </button>
                  <div className="soundscapes-menu-container">
                    <button
                      className="soundscapes-more-button"
                      onClick={(e) => toggleMenu(e, tune.id)}
                    >
                      <img src='/DotsThreeOutline.svg' alt='action button' />
                    </button>

                    {activeMenu === tune.id && (
                      <div className="soundscapes-menu">
                        <div className="soundscapes-menu-item" onClick={(e) => {
                          e.stopPropagation();
                          console.log('Add to playlist');
                          setActiveMenu(null);
                        }}>
                          Add to playlist
                        </div>
                        <div className="soundscapes-menu-item" onClick={(e) => {
                          e.stopPropagation();
                          console.log('Share');
                          setActiveMenu(null);
                        }}>
                          Share
                        </div>
                        <div className="soundscapes-menu-item" onClick={(e) => {
                          e.stopPropagation();
                          console.log('Download');
                          setActiveMenu(null);
                        }}>
                          Download
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Player Footer */}
      <footer className="soundscapes-player">
        <div
          className="soundscapes-now-playing"
          onClick={() => {
            // Only clicking on the track info should open the modal
            if (currentTrack) {
              setModalOpen(true);
            } else if (picks.length > 0) {
              playTrack(picks[0], true); // Play and open modal
            }
          }}
        >
          <div className="soundscapes-track-thumbnail">
            <img
              src={currentTrack?.sound_cover_image || (picks.length > 0 ? picks[0]?.sound_cover_image : 'https://plus.unsplash.com/premium_photo-1683140707316-42df87760f3f?w=500&auto=format&fit=crop&q=60')}
              alt={currentTrack?.title || 'Track thumbnail'}
            />
          </div>
          <div className="soundscapes-track-info">
            <h3>{currentTrack?.title || (picks.length > 0 && picks[0]?.title)}</h3>
            {(currentTrack?.author || (picks.length > 0 && picks[0]?.author)) &&
              <p>{currentTrack?.author || picks[0]?.author}</p>
            }
          </div>
        </div>
        <div className="soundscapes-player-controls">
          <button
            className="soundscapes-shuffle"
            title="Shuffle (not implemented)"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Shuffle functionality not implemented');
            }}
          >
            <img src='./shuffle.svg' alt="Shuffle"/>
          </button>
          <button
            className="soundscapes-prev"
            title="Previous track"
            onClick={(e) => {
              e.stopPropagation();
              // Find the index of the current track in all tracks (picks + tunes)
              const allTracks = [...picks, ...tunes];
              if (!currentTrack || allTracks.length === 0) return;

              const currentIndex = allTracks.findIndex(track => track.id === currentTrack.id);
              if (currentIndex > 0) {
                playTrack(allTracks[currentIndex - 1], false); // Play without opening modal
              } else {
                // Wrap around to the last track
                playTrack(allTracks[allTracks.length - 1], false); // Play without opening modal
              }
            }}
          >
            <img src='./skip-previous.svg' alt="Previous"/>
          </button>
          <button
            className="soundscapes-play"
            onClick={(e) => {
              e.stopPropagation();
              if (currentTrack) {
                if (audio.paused) {
                  audio.play().catch(error => {
                    console.error('Error playing audio:', error);
                  });
                } else {
                  audio.pause();
                }
              } else if (picks.length > 0) {
                playTrack(picks[0], false); // Play without opening modal
              }
            }}
          >
            <img src={isPlaying ? './pause.svg' : './play.svg'} alt={isPlaying ? "Pause" : "Play"} />
          </button>
          <button
            className="soundscapes-next"
            title="Next track"
            onClick={(e) => {
              e.stopPropagation();
              // Find the index of the current track in all tracks (picks + tunes)
              const allTracks = [...picks, ...tunes];
              if (!currentTrack || allTracks.length === 0) return;

              const currentIndex = allTracks.findIndex(track => track.id === currentTrack.id);
              if (currentIndex < allTracks.length - 1) {
                playTrack(allTracks[currentIndex + 1], false); // Play without opening modal
              } else {
                // Wrap around to the first track
                playTrack(allTracks[0], false); // Play without opening modal
              }
            }}
          >
            <img src='./skip-next.svg' alt="Next"/>
          </button>
          <button
            className="soundscapes-repeat"
            title="Repeat (not implemented)"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Repeat functionality not implemented');
            }}
          >
            <img src='./repeatOne.svg' alt="Repeat"/>
          </button>
        </div>
        <div className="soundscapes-player-actions">
          <button
            className="soundscapes-like-button"
            title={currentTrack && likedTracks[currentTrack.id] ? "Unlike" : "Like"}
            onClick={(e) => {
              e.stopPropagation();
              if (currentTrack) {
                handleLikeToggle(e, currentTrack.id);
              }
            }}
            style={currentTrack && likedTracks[currentTrack.id] ? { color: '#e74c3c' } : {}}
          >
            {currentTrack && likedTracks[currentTrack.id] ? <HeartFilled /> : <HeartOutlined />}
          </button>
          <div className="soundscapes-menu-container">
            <button
              className="soundscapes-more-button"
              title="More options"
              onClick={(e) => {
                e.stopPropagation();
                if (currentTrack) {
                  toggleMenu(e, 'footer-' + currentTrack.id);
                }
              }}
            >
              <EllipsisOutlined/>
            </button>

            {currentTrack && activeMenu === 'footer-' + currentTrack.id && (
              <div className="soundscapes-menu soundscapes-footer-menu">
                <div className="soundscapes-menu-item" onClick={(e) => {
                  e.stopPropagation();
                  console.log('Add to playlist');
                  setActiveMenu(null);
                }}>
                  Add to playlist
                </div>
                <div className="soundscapes-menu-item" onClick={(e) => {
                  e.stopPropagation();
                  console.log('Share');
                  setActiveMenu(null);
                }}>
                  Share
                </div>
                <div className="soundscapes-menu-item" onClick={(e) => {
                  e.stopPropagation();
                  console.log('Download');
                  setActiveMenu(null);
                }}>
                  Download
                </div>
              </div>
            )}
          </div>
        </div>
      </footer>

      <PlayerModal
        isOpen={modalOpen}
        onClose={closeModal}
        track={{
          ...currentTrack,
          // Map sound_cover_image to image for the modal component
          image: currentTrack?.sound_cover_image
        }}
        audio={audio}
        onPrevious={() => {
          // Find the index of the current track in all tracks (picks + tunes)
          const allTracks = [...picks, ...tunes];
          if (!currentTrack || allTracks.length === 0) return;

          const currentIndex = allTracks.findIndex(track => track.id === currentTrack.id);
          if (currentIndex > 0) {
            playTrack(allTracks[currentIndex - 1], false);
          } else {
            // Wrap around to the last track
            playTrack(allTracks[allTracks.length - 1], false);
          }
        }}
        onNext={() => {
          // Find the index of the current track in all tracks (picks + tunes)
          const allTracks = [...picks, ...tunes];
          if (!currentTrack || allTracks.length === 0) return;

          const currentIndex = allTracks.findIndex(track => track.id === currentTrack.id);
          if (currentIndex < allTracks.length - 1) {
            playTrack(allTracks[currentIndex + 1], false);
          } else {
            // Wrap around to the first track
            playTrack(allTracks[0], false);
          }
        }}
      />
    </div>
  );
};

export default Soundscapes;