import React from 'react';
import { Modal, Button } from 'antd';
import './index.css';

const TermsModal = ({ isOpen = false, onClose, onAccept }) => {
  const handleAccept = () => {
    onAccept();
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button 
          key="accept" 
          type="primary" 
          onClick={handleAccept}
          className="accept-button"
        >
          Accept
        </Button>
      ]}
      title="Terms & conditions"
      className="terms-modal"
    >
      <div className="terms-content">
        <div className="terms-text">
          <p className="effective-date">Effective Date: January 1, 2025</p>
          
          <p className="welcome-text">
            Welcome to [Your Company Name] ("we," "our," or "us"). These Terms and 
            Conditions govern your use of our platform. By accessing or using our services, 
            you agree to be bound by these terms. If you do not agree, please do not use the 
            platform.
          </p>

          <div className="terms-section">
            <h2>1. Use of the Platform</h2>
            <div className="section-content">
              <p>1.1. You must be at least 18 years old to use our platform.</p>
              <p>1.2. You are responsible for maintaining the confidentiality of your account 
                credentials.</p>
              <p>1.3. Unauthorized use of the platform may result in suspension or termination of 
                your account.</p>
            </div>
          </div>

          <div className="terms-section">
            <h2>2. Services Provided</h2>
            <div className="section-content">
              <p>2.1. We provide tools and features to support [specific service details, e.g., 
                employee well-being management].</p>
              <p>2.2. Features may vary based on your subscription plan.</p>
            </div>
          </div>
        </div>

        <div className="terms-text">
          <p className="effective-date">Effective Date: January 1, 2025</p>
          
          <p className="welcome-text">
            Welcome to [Your Company Name] ("we," "our," or "us"). These Terms and 
            Conditions govern your use of our platform. By accessing or using our services, 
            you agree to be bound by these terms. If you do not agree, please do not use the 
            platform.
          </p>

          <div className="terms-section">
            <h2>1. Use of the Platform</h2>
            <div className="section-content">
              <p>1.1. You must be at least 18 years old to use our platform.</p>
              <p>1.2. You are responsible for maintaining the confidentiality of your account 
                credentials.</p>
              <p>1.3. Unauthorized use of the platform may result in suspension or termination of 
                your account.</p>
            </div>
          </div>

          <div className="terms-section">
            <h2>2. Services Provided</h2>
            <div className="section-content">
              <p>2.1. We provide tools and features to support [specific service details, e.g., 
                employee well-being management].</p>
              <p>2.2. Features may vary based on your subscription plan.</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TermsModal;