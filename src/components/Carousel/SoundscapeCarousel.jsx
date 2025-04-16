import React from 'react';
import PropTypes from 'prop-types';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useAudio } from '../AudioPlayer/AudioContext';

const SoundscapeCarousel = ({ items }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const { playTrack } = useAudio();

  const slideLeft = () => {
    setCurrentSlide(current => 
      current === 0 ? items.length - 3 : current - 1
    );
  };

  const slideRight = () => {
    setCurrentSlide(current =>
      current === items.length - 3 ? 0 : current + 1
    );
  };

  return (
    <div className="soundscapes-carousel-container">
      <button 
        className="soundscapes-carousel-button soundscapes-left" 
        onClick={slideLeft}
        disabled={items.length <= 3}
      >
        <LeftOutlined />
      </button>
      <div className="soundscapes-carousel-wrapper">
        <div
          className="soundscapes-carousel-content"
          style={{ transform: `translateX(-${currentSlide * 33.33}%)` }}
        >
          {items.map((item) => (
            <div 
              key={item.id} 
              className="soundscapes-carousel-card" 
              onClick={() => playTrack(item)}
            >
              <div className="soundscapes-card-image">
                <img
                  src={item.sound_cover_image}
                  alt={item.title}
                  className="soundscapes-card-img"
                  loading="lazy"
                />
                <div className="soundscapes-play-overlay">
                  <img src='./play.svg' alt="Play"/>
                </div>
              </div>
              <div className="soundscapes-card-info">
                <h3>{item.title}</h3>
                {item.author && <p>{item.author}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button 
        className="soundscapes-carousel-button soundscapes-right" 
        onClick={slideRight}
        disabled={items.length <= 3}
      >
        <RightOutlined />
      </button>
    </div>
  );
};

SoundscapeCarousel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string,
      sound_cover_image: PropTypes.string.isRequired,
      sound_file_url: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SoundscapeCarousel;
