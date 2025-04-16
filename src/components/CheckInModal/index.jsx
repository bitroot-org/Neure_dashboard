import React, { useState, useEffect } from 'react';
import { Input, message } from 'antd';
import { Scanner } from '@yudiel/react-qr-scanner';
import { markAttendance } from '../../services/api';
import './index.css';

const CheckInModal = ({ isOpen, onClose }) => {
  const [ticketId, setTicketId] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scannerKey, setScannerKey] = useState(0); // Add this state for scanner reset

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Match this with CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCheckIn = async (scannedTicketId) => {
    if (isProcessing) return; // Prevent multiple simultaneous check-ins
    
    try {
      setIsProcessing(true);
      const companyId = localStorage.getItem('companyId');
      
      if (!companyId) {
        throw new Error('Company ID not found');
      }

      const response = await markAttendance({
        ticketCode: scannedTicketId,
        company_id: companyId
      });

      if (response.status) {
        setShowSuccess(true);
        message.success(response.message || 'Check-in successful');
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          setTicketId(''); // Reset ticket input
          setScannerKey(prev => prev + 1); // Reset scanner
        }, 3000);
      } else {
        // Handle already attended case
        if (response.code === 400 && response.data?.workshop_title) {
          message.warning(
            `${response.message} for workshop: ${response.data.workshop_title}`
          );
        } else {
          message.warning(response.message || 'Check-in failed');
        }
        setTicketId(''); // Reset ticket input
        setScannerKey(prev => prev + 1); // Reset scanner
      }
    } catch (error) {
      // Handle network or other errors
      message.error(error.response?.data?.message || error.message || 'Check-in failed');
      console.error('Check-in error:', error);
      setTicketId(''); // Reset ticket input
      setScannerKey(prev => prev + 1); // Reset scanner
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScan = (result) => {
    if (result && !isProcessing) {
      try {
        const scannedData = JSON.parse(result[0].rawValue).ticket;
        console.log('QR Code scanned:', scannedData);
        
        if (scannedData) {
          handleCheckIn(scannedData);
        } else {
          message.error('Invalid QR code format');
          setScannerKey(prev => prev + 1); // Reset scanner
        }
      } catch (error) {
        console.error('Error parsing QR code data:', error);
        message.error('Invalid QR code format');
        setScannerKey(prev => prev + 1); // Reset scanner
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    message.error('Scanner error: Please try again');
    setScannerKey(prev => prev + 1); // Reset scanner
  };

  const handleManualCheckIn = () => {
    if (!ticketId.trim()) {
      message.warning('Please enter a ticket ID');
      return;
    }
    handleCheckIn(ticketId);
  };

  if (!isVisible) return null;

  return (
    <div className="custom-drawer-overlay">
      <div className={`custom-drawer ${isOpen ? 'open' : ''}`}>
        <div className="custom-drawer-header">
          <div>
            <h2>Check-in</h2>
            <p className="subtitle">Scan attendee's QR code to check in.</p>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="custom-drawer-content">
          {showSuccess ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Thank you for attending!</h3>
              <p>Check-in successful</p>
            </div>
          ) : (
            <>
              <div className="qr-scanner-container">
                <Scanner
                  key={scannerKey} // Add key prop here
                  onScan={handleScan}
                  onError={handleError}
                  constraints={{
                    facingMode: 'environment'
                  }}
                />
              </div>

              <div className="ticket-id-section">
                <p className="or-text">Or, Enter Ticket ID</p>
                <div className="ticket-input-container">
                  <label>Ticket ID</label>
                  <Input
                    placeholder="Type here"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                    onPressEnter={handleManualCheckIn}
                    className="ticket-input"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInModal;
