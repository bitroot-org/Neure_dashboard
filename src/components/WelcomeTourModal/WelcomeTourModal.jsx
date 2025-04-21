import React from 'react';
import './WelcomeTourModal.css';

const WelcomeTourModal = ({ onStartTour, onSkip }) => {
  return (
    <div className="welcome-modal-overlay">
      <div className="welcome-modal">
        <h2>Welcome to Neure!</h2>
        <p>Would you like to take a quick tour to explore the dashboard features?</p>
        <div className="welcome-modal-buttons">
          <button className="start-tour-btn" onClick={onStartTour}>
            Start Tour
          </button>
          <button className="skip-tour-btn" onClick={onSkip}>
            Skip Tour
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTourModal;