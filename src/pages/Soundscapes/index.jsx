// SoundscapeContainer.jsx
import React, { useState } from 'react';
import './soundscapes.css';
import CustomHeader from '../../components/CustomHeader';
import {EllipsisOutlined, HeartOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import PlayerModal from '../../components/PlayerModal';

const Soundscapes = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);


  const picks = [
    { title: 'Calm Waves', author: 'Peaceful Soundscapes' },
    { title: 'Radiant Journey', author: 'American Creatives' },
    { title: 'Tranquil Retreat', author: 'Serenity Plus' },
    { title: 'Sunset Bliss', author: 'Majestic Records' },
    { title: 'Dreamy Meadows', author: 'Harmony Haven' },
    { title: 'Whispers', author: 'Gentle Dreams' }
  ];

  const tunes = [
    { title: 'Whispering Pines', author: 'NatureTunes Studio', duration: '4:50' },
    { title: 'Gentle Rainfall', author: 'SkyDrop Audio', duration: '5:30' },
    { title: 'Echoes of Calm', author: 'Mindful Audio Lab', duration: '4:00' },
    { title: 'Timeless Stillness', author: 'Serenity Sphere', duration: '7:36' }
  ];

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
    setCurrentTrack(track);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };


  return (
    <div className="soundscape-container">
      <CustomHeader title="Soundscapes" />

      <main className="soundscapes-main-content">
        {/* Top Picks Section */}
        <section className="soundscapes-top-picks">
          <div className="soundscapes-section-header">
            <h2>Top picks for you</h2>
            <button className="soundscapes-see-all">See all <RightOutlined /></button>
          </div>
          <div className="soundscapes-carousel-container">
            <button className="soundscapes-carousel-button soundscapes-left" onClick={slideLeft}><LeftOutlined /></button>
            <div className="soundscapes-carousel-wrapper">
              <div
                className="soundscapes-carousel-content"
                style={{ transform: `translateX(-${currentSlide * 33.33}%)` }}
              >
                {picks.map((pick, index) => (
                  <div key={index} className="soundscapes-carousel-card" onClick={() => handleTrackSelect(pick)}>
                    <div className="soundscapes-card-image">
                      <img
                        src="https://plus.unsplash.com/premium_photo-1683140707316-42df87760f3f?w=500&auto=format&fit=crop&q=60"
                        alt={pick.title}
                        className="soundscapes-card-img"
                      />
                      <div className="soundscapes-play-overlay"><img src='./play.svg'/></div>
                    </div>
                    <div className="soundscapes-card-info">
                      <h3>{pick.title}</h3>
                      <p>{pick.author}</p>
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
            {tunes.map((tune, index) => (
              <div key={index} className="soundscapes-tune-item" onClick={() => handleTrackSelect(tune)}>
                <div className="soundscapes-tune-thumbnail"><img src='https://plus.unsplash.com/premium_photo-1683140707316-42df87760f3f?w=500&auto=format&fit=crop&q=60'/></div>
                <div className="soundscapes-tune-info">
                  <h3>{tune.title}</h3>
                  <p>{tune.author}</p>
                </div>
                <div className="soundscapes-tune-controls">
                  <span className="soundscapes-duration">{tune.duration}</span>
                  <button className="soundscapes-like-button"><HeartOutlined /></button>
                  <button className="soundscapes-more-button"><EllipsisOutlined /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Player Footer */}
      <footer className="soundscapes-player" onClick={() => handleTrackSelect(currentTrack || picks[1])}>
        <div className="soundscapes-now-playing">
          <div className="soundscapes-track-thumbnail"><img src='https://plus.unsplash.com/premium_photo-1683140707316-42df87760f3f?w=500&auto=format&fit=crop&q=60'/></div>
          <div className="soundscapes-track-info">
            <h3>Radiant Journey</h3>
            <p>American Creatives</p>
          </div>
        </div>
        <div className="soundscapes-player-controls">
          <button className="soundscapes-shuffle"><img src='./shuffle.svg'/></button>
          <button className="soundscapes-prev"><img src='./skip-previous.svg'/></button>
          <button className="soundscapes-play"><img src='./pause.svg' /></button>
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
      />
    </div>
  );
};

export default Soundscapes;