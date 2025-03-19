// SoundscapeContainer.jsx
import React, { useState, useEffect } from 'react';
import './Soundscapes.css';
import CustomHeader from '../../components/CustomHeader';
import {EllipsisOutlined, HeartOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
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
    fetchSoundscapes();
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
    setCurrentSlide(current =>
      current === 0 ? picks.length - 3 : current - 1
    );
  };

  const slideRight = () => {
    setCurrentSlide(current =>
      current === picks.length - 3 ? 0 : current + 1
    );
  };

  const handleTrackSelect = (track) => {
    if (!track?.sound_file_url) return;

    if (currentTrack?.sound_file_url === track.sound_file_url) {
      // Toggle play/pause if same track
      if (audio.paused) {
        audio.play().catch(console.error);
      } else {
        audio.pause();
      }
    } else {
      // Load and play new track
      audio.src = track.sound_file_url;
      audio.load();
      audio.play().catch(console.error);
      setCurrentTrack(track);
    }
    setModalOpen(true);
  };

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
                {picks.map((pick, index) => (
                  <div key={pick.id} className="soundscapes-carousel-card" onClick={() => handleTrackSelect(pick)}>
                    <div className="soundscapes-card-image">
                      <img
                        src={pick.sound_cover_image}
                        alt={pick.title}
                        className="soundscapes-card-img"
                      />
                      <div className="soundscapes-play-overlay"><img src='./play.svg'/></div>
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
                <div className="soundscapes-tune-thumbnail"><img src={tune.sound_cover_image}/></div>
                <div className="soundscapes-tune-info">
                  <h3>{tune.title}</h3>
                  {tune.author && <p>{tune.author}</p>}
                </div>
                <div className="soundscapes-tune-controls">
                  <p className="soundscapes-like-button"><img src='like.svg' alt='like-button' /></p>
                  <p className="soundscapes-more-button"><img src='/DotsThreeOutline.svg' alt='action button' /></p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Player Footer */}
      <footer className="soundscapes-player" onClick={() => handleTrackSelect(currentTrack || picks[0])}>
        <div className="soundscapes-now-playing">
          <div className="soundscapes-track-thumbnail"><img src='https://plus.unsplash.com/premium_photo-1683140707316-42df87760f3f?w=500&auto=format&fit=crop&q=60'/></div>
          <div className="soundscapes-track-info">
            <h3>{currentTrack?.title || (picks[0] && picks[0].title)}</h3>
            {(currentTrack?.author || (picks[0] && picks[0].author)) && 
              <p>{currentTrack?.author || picks[0].author}</p>
            }
          </div>
        </div>
        <div className="soundscapes-player-controls">
          <button className="soundscapes-shuffle"><img src='./shuffle.svg'/></button>
          <button className="soundscapes-prev"><img src='./skip-previous.svg'/></button>
          <button className="soundscapes-play">
            <img src={audio.paused ? './play.svg' : './pause.svg'} />
          </button>
          <button className="soundscapes-next"><img src='./skip-next.svg'/></button>
          <button className="soundscapes-repeat"><img src='./repeatOne.svg'/></button>
        </div>
        <div className="soundscapes-player-actions">
          <button className="soundscapes-like-button"><HeartOutlined/></button>
          <button className="soundscapes-more-button"><EllipsisOutlined/></button>
        </div>
      </footer>

      <PlayerModal 
        isOpen={modalOpen} 
        onClose={closeModal} 
        track={currentTrack}
        audio={audio}
      />
    </div>
  );
};

export default Soundscapes;