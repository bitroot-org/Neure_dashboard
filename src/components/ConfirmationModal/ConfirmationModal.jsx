import React from 'react';
import Button from '../Button/Button';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Are you sure you want to submit this assessment?</h2>
        <p>Once submitted, your responses cannot be changed. Your answers will remain anonymous. This helps improve workplace well-being.</p>
        <div className="modal-actions">
          <Button 
            onClick={onClose}
            className="cancel-button"
            variant="outline"
          >
            No
          </Button>
          <Button 
            onClick={onConfirm}
            className="confirm-button"
          >
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;