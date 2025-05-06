import React, { useState, useEffect, useRef } from 'react';
import { Input, message } from 'antd';
import { Scanner } from '@yudiel/react-qr-scanner';
import { markAttendance } from '../../services/api';
import './index.css';

const CheckInModal = ({ isOpen, onClose }) => {
  const [ticketId, setTicketId] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scannerKey, setScannerKey] = useState(0);
  const [successData, setSuccessData] = useState({ name: '', workshopTitle: '' });
  const [showScanner, setShowScanner] = useState(false);
  const modalRef = useRef(null);

  // Handle modal visibility
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Delay showing scanner to ensure modal is fully visible
      setTimeout(() => {
        setShowScanner(true);
      }, 300);
    } else {
      // Hide scanner immediately when closing
      setShowScanner(false);
      
      // Delay hiding the modal to match CSS transition
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Reset states when modal is fully closed
        setTicketId('');
        setShowSuccess(false);
        setScannerKey(prev => prev + 1);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle clicks outside the modal to prevent them from propagating
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  // Proper close handler
  const handleClose = () => {
    // Stop camera first
    setShowScanner(false);
    // Then close modal
    onClose();
  };

  const handleCheckIn = async (scannedTicketId) => {
    if (isProcessing) return;
    
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
        setShowScanner(false); // Stop scanner while showing success
        const attendeeName = response.data?.user_email || 'Attendee';
        setSuccessData({
          name: attendeeName,
          workshopTitle: response.data?.workshop_title || ''
        });
        
        message.success(response.message || 'Check-in successful');
        
        setTimeout(() => {
          setShowSuccess(false);
          setTicketId('');
          setScannerKey(prev => prev + 1);
          // Only restart scanner if modal is still open
          if (isVisible) {
            setShowScanner(true);
          }
        }, 2000);
      } else {
        if (response.code === 400 && response.data?.workshop_title) {
          message.warning(
            `${response.message} for workshop: ${response.data.workshop_title}`
          );
        } else {
          message.warning(response.message || 'Check-in failed');
        }
        setTicketId('');
        setScannerKey(prev => prev + 1);
      }
    } catch (error) {
      message.error(error.response?.data?.message || error.message || 'Check-in failed');
      console.error('Check-in error:', error);
      setTicketId('');
      setScannerKey(prev => prev + 1);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScan = (result) => {
    if (result && !isProcessing && showScanner) {
      try {
        const scannedData = JSON.parse(result[0].rawValue).ticket;
        console.log('QR Code scanned:', scannedData);
        
        if (scannedData) {
          handleCheckIn(scannedData);
        } else {
          message.error('Invalid QR code format');
          setScannerKey(prev => prev + 1);
        }
      } catch (error) {
        console.error('Error parsing QR code data:', error);
        message.error('Invalid QR code format');
        setScannerKey(prev => prev + 1);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    message.error('Scanner error: Please try again');
    setScannerKey(prev => prev + 1);
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
    <div className="custom-drawer-overlay" onClick={handleOverlayClick}>
      <div className={`custom-drawer ${isOpen ? 'open' : ''}`} ref={modalRef}>
        <div className="custom-drawer-header">
          <div>
            <h2>Check-in</h2>
            <p className="subtitle">Scan attendee's QR code to check in.</p>
          </div>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>

        <div className="custom-drawer-content">
          {showSuccess ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Welcome, {successData.name}!</h3>
              <p>Successfully checked in to:</p>
              <p className="workshop-title">{successData.workshopTitle}</p>
            </div>
          ) : (
            <>
              <div className="qr-scanner-container">
                {showScanner && (
                  <Scanner
                    key={scannerKey}
                    onScan={handleScan}
                    onError={handleError}
                    constraints={{
                      facingMode: 'environment'
                    }}
                  />
                )}
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
