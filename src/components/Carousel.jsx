import React from "react";
import PropTypes from "prop-types";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useAudio } from "../context/AudioContext";

const SoundscapeCarousel = ({ items }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const { playTrack } = useAudio();

  const slideLeft = () => {
    setCurrentSlide((current) =>
      current === 0 ? items.length - 3 : current - 1
    );
  };

  const slideRight = () => {
    setCurrentSlide((current) =>
      current === items.length - 3 ? 0 : current + 1
    );
  };

  return (
    <div className="flex h-[280px] items-center justify-center overflow-hidden">
      <button
        className="mr-4 h-8 w-8 shrink-0 rounded-full border-0 bg-white/25 text-white"
        onClick={slideLeft}
        disabled={items.length <= 3}
      >
        <LeftOutlined />
      </button>
      <div className="flex-1 overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 33.33}%)` }}
        >
          {items.map((item) => (
            <div key={item.id} className="mr-4 w-[200px] overflow-hidden rounded-lg bg-transparent">
              <div className="relative h-[200px] w-full overflow-hidden rounded-2xl">
                <img src={item.sound_cover_image} alt={item.title} className="h-full w-full object-cover bg-white/10" loading="lazy" />
                <div
                  className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 p-2 text-white opacity-70 transition-opacity group-hover:opacity-100"
                  onClick={() => playTrack(item)}
                >
                  <img src="./play.svg" alt="Play" />
                </div>
              </div>
              <div className="flex flex-col items-start p-2 text-left">
                <h3 className="m-0 text-lg font-medium text-white">{item.title}</h3>
                {item.author && <p className="m-0 mt-1 text-base text-[#b1b3c0]">{item.author}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="ml-4 h-8 w-8 shrink-0 rounded-full border-0 bg-white/25 text-white"
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
