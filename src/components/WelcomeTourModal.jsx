import React from 'react';

const WelcomeTourModal = ({ onStartTour, onSkip }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/75 flex justify-center items-center z-[1000] animate-fadeIn">
      <div className="bg-[#1a1a1a] rounded-xl p-8 w-[400px] text-center shadow-[0_10px_30px_rgba(0,0,0,0.25)] animate-slideUp">
        <h2 className="text-white mb-4 text-2xl">Welcome to Neure!</h2>
        <p className="text-[#cccccc] mb-6 text-base leading-6">Would you like to take a quick tour to explore the dashboard features?</p>
        <div className="flex gap-3 justify-center">
          <button className="bg-[#4361ee] text-white border-none px-6 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-[#3651d3] hover:-translate-y-0.5" onClick={onStartTour}>
            Start Tour
          </button>
          <button className="bg-transparent text-[#cccccc] border border-[#cccccc] px-6 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:text-white hover:border-white" onClick={onSkip}>
            Skip Tour
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTourModal;