import React, { useState } from 'react';
import './deactivateAccountModal.css';

const DeactivateAccountModal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');

  const reasons = [
    "Company restructuring",
    "No longer required",
    "Business closure",
    "Duplicate account",
    "Cost reduction efforts",
    "Other"
  ];

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare payload with the deactivation reason and additional details
    const payload = {
      reason: selectedReason,
      details: details,
    };

    onSubmit(payload);

    // Reset the form fields after submission
    setSelectedReason('');
    setDetails('');
  };

  return (
    <div className="deactivate-modal-overlay">
      <div className="deactivate-modal-container">
        <div className="deactivate-modal-header">
          <h2 className="deactivate-modal-title">Deactivate Account</h2>
          <button className="deactivate-modal-close-button" onClick={onClose}>×</button>
        </div>

        <div className="deactivate-modal-divider"></div>

        <form onSubmit={handleSubmit}>
          <div className="deactivate-form-group">
            <label htmlFor="reason">Deactivation Reason</label>
            <select
              id="reason"
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="deactivate-select"
            >
              <option value="" disabled>Select a reason</option>
              {reasons.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          <div className="deactivate-form-group">
            <label htmlFor="details">Tell us more</label>
            <textarea
              id="details"
              placeholder="Please provide additional details..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows="4"
              className="deactivate-textarea"
            ></textarea>
          </div>

          <div className="deactivate-modal-divider"></div>

          <div className="deactivate-modal-footer">
            <button
              type="submit"
              className={`deactivate-confirm-button ${!selectedReason ? 'deactivate-disabled' : ''}`}
              disabled={!selectedReason}
            >
              Send request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeactivateAccountModal;