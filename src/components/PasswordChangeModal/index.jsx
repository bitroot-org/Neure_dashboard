import React, { useState, useEffect } from 'react';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import './passwordChangeModal.css';

const PasswordChangeModal = ({ isOpen, onClose, onSubmit, isFirstLogin = false, onSkip, isFromSettings = false }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    length: true,
    lowercase: true,
    uppercase: true,
    number: true,
    special: true,
    match: true
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Add state for password visibility
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Check password requirements whenever newPassword or confirmPassword changes
  useEffect(() => {
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
    
    const errors = {
      length: newPassword.length < 8,
      lowercase: !hasLowerCase,
      uppercase: !hasUpperCase,
      number: !hasNumber,
      special: !hasSpecialChar,
      match: newPassword !== confirmPassword && confirmPassword !== ''
    };

    setValidationErrors(errors);

    // Form is valid when all fields are filled and no validation errors
    setIsFormValid(
      currentPassword !== '' &&
      newPassword !== '' &&
      confirmPassword !== '' &&
      !errors.length &&
      !errors.lowercase &&
      !errors.uppercase &&
      !errors.number &&
      !errors.special &&
      !errors.match
    );
  }, [currentPassword, newPassword, confirmPassword]);

  // Check if all password requirements are met
  const allPasswordRequirementsMet = () => {
    return !validationErrors.length && 
           !validationErrors.lowercase && 
           !validationErrors.uppercase && 
           !validationErrors.number && 
           !validationErrors.special;
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

  const overlayClass = isFirstLogin 
    ? 'reset-modal-overlay first-login' 
    : isFromSettings 
      ? 'reset-modal-overlay settings-page' 
      : 'reset-modal-overlay';

  return (
    <div className={overlayClass}>
      <div className="pcm-modal-container">
        <div className="pcm-modal-header">
          <h2 className="pcm-modal-title">Change password</h2>
          {!isFirstLogin && (
            <button className="pcm-modal-close-button" onClick={onClose}>×</button>
          )}
        </div>

        <div className="pcm-modal-divider"></div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="current-password">Current password</label>
            <div className="password-input-wrapper">
              <input
                id="current-password"
                type={currentPasswordVisible ? "text" : "password"}
                placeholder="Type here.."
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}
              >
                {currentPasswordVisible ? 
                  <EyeOutlined style={{ color: 'white', fontSize: '16px' }} /> : 
                  <EyeInvisibleOutlined style={{ color: 'white', fontSize: '16px' }} />
                }
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="new-password">New password</label>
            <div className="password-input-wrapper">
              <input
                id="new-password"
                type={newPasswordVisible ? "text" : "password"}
                placeholder="Type here.."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setNewPasswordVisible(!newPasswordVisible)}
              >
                {newPasswordVisible ? 
                  <EyeOutlined style={{ color: 'white', fontSize: '16px' }} /> : 
                  <EyeInvisibleOutlined style={{ color: 'white', fontSize: '16px' }} />
                }
              </button>
            </div>
            {newPassword && !allPasswordRequirementsMet() && (
              <div className="password-requirements">
                <div className={`requirement ${!validationErrors.length ? 'met' : 'not-met'}`}>
                  <span className="bullet">•</span> Minimum 8 characters
                </div>
                <div className={`requirement ${!validationErrors.lowercase ? 'met' : 'not-met'}`}>
                  <span className="bullet">•</span> At least one lowercase letter
                </div>
                <div className={`requirement ${!validationErrors.uppercase ? 'met' : 'not-met'}`}>
                  <span className="bullet">•</span> At least one uppercase letter
                </div>
                <div className={`requirement ${!validationErrors.number ? 'met' : 'not-met'}`}>
                  <span className="bullet">•</span> At least one number
                </div>
                <div className={`requirement ${!validationErrors.special ? 'met' : 'not-met'}`}>
                  <span className="bullet">•</span> At least one special character
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm password</label>
            <div className="password-input-wrapper">
              <input
                id="confirm-password"
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Type here.."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              >
                {confirmPasswordVisible ? 
                  <EyeOutlined style={{ color: 'white', fontSize: '16px' }} /> : 
                  <EyeInvisibleOutlined style={{ color: 'white', fontSize: '16px' }} />
                }
              </button>
            </div>
            {confirmPassword && validationErrors.match && (
              <div className="validation-error">Passwords do not match</div>
            )}
          </div>

          <div className="pcm-modal-divider"></div>

          <div className="pcm-modal-footer">
            {isFirstLogin && onSkip && (
              <button 
                type="button" 
                className="pcm-skip-button"
                onClick={onSkip}
                disabled={isSubmitting}
              >
                Skip for now
              </button>
            )}
            <button
              type="submit"
              className={`pcm-confirm-button ${!isFormValid || isSubmitting ? 'pcm-disabled' : ''}`}
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
