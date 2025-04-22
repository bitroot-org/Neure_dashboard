import React from 'react';
import Button from '../Button/Button';
import './SuccessModal.css';

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay">
      <div className="success-modal-content">
        <img src="/CheckCircle.svg" alt="Success" className="success-icon" />
        <h2>Thank you for sharing your thoughts!</h2>
        <p>Your input helps us build a more inclusive and psychologically safe workplace.</p>
        <Button 
          onClick={onClose}
          className="back-button"
        >
          Back to main
        </Button>
      </div>
    </div>
  );
};

export default SuccessModal;