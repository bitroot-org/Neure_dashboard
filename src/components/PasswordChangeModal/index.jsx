import React, { useState, useEffect } from 'react';
import './passwordChangeModal.css';

const PasswordChangeModal = ({ isOpen, onClose, onSubmit, isFirstLogin = false, onSkip }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    length: true,
    mix: true,
    match: true
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check password requirements whenever newPassword or confirmPassword changes
  useEffect(() => {
    const errors = {
      length: newPassword.length < 8,
      mix: !hasCharacterMix(newPassword),
      match: newPassword !== confirmPassword && confirmPassword !== ''
    };

    setValidationErrors(errors);

    // Form is valid when all fields are filled and no validation errors
    setIsFormValid(
      currentPassword !== '' &&
      newPassword !== '' &&
      confirmPassword !== '' &&
      !errors.length &&
      !errors.mix &&
      !errors.match
    );
  }, [currentPassword, newPassword, confirmPassword]);

  // Check if password has a mix of character types
  const hasCharacterMix = (password) => {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    // Password should have at least 3 of the 4 character types
    return (hasLowerCase + hasUpperCase + hasNumber + hasSpecialChar) >= 3;
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid && !isSubmitting) {
      setIsSubmitting(true);
      
      try {
        await onSubmit({ currentPassword, newPassword });
        
        // Reset form fields - this will only happen after successful submission
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (error) {
        // If there's an error, we don't reset the form
        console.error("Password change error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className={`modal-overlay ${isFirstLogin ? 'first-login' : ''}`}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Change password</h2>
          {!isFirstLogin && (
            <button className="modal-close-button" onClick={onClose}>×</button>
          )}
        </div>

        <div className="modal-divider"></div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="current-password">Current password</label>
            <input
              id="current-password"
              type="password"
              placeholder="Type here.."
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              placeholder="Type here.."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {newPassword && (validationErrors.length || validationErrors.mix) && (
              <div className="password-requirements">
                <div className={`requirement ${(!validationErrors.length && !validationErrors.mix) ? 'met' : 'not-met'}`}>
                  <span className="bullet"></span> Minimum 8 characters, Mix of uppercase, lowercase, numbers, and special characters
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Type here.."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPassword && validationErrors.match && (
              <div className="validation-error">Passwords do not match</div>
            )}
          </div>

          <div className="modal-divider"></div>

          <div className="modal-footer">
            {isFirstLogin && onSkip && (
              <button 
                type="button" 
                className="skip-button"
                onClick={onSkip}
                disabled={isSubmitting}
              >
                Skip for now
              </button>
            )}
            <button
              type="submit"
              className={`confirm-button ${!isFormValid || isSubmitting ? 'disabled' : ''}`}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Change password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
