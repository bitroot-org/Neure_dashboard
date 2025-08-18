import React, { useState, useEffect, useRef } from 'react';
import { Input, message } from 'antd';
import { Scanner } from '@yudiel/react-qr-scanner';
import { markAttendance } from '../services/api';

const CheckInModal = ({ isOpen, onClose, scheduleId }) => {
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

      const payload = {
        ticketCode: scannedTicketId,
        company_id: companyId
      };

      // Add schedule_id to payload if available
      if (scheduleId) {
        payload.schedule_id = scheduleId;
      }

      const response = await markAttendance(payload);

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
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-[1000]" onClick={handleOverlayClick}>
      <div className={`fixed top-0 w-[480px] h-screen bg-[#191A20] transition-all duration-300 ease-in-out z-[1001] flex flex-col ${isOpen ? 'right-0' : '-right-[480px]'}`} ref={modalRef}>
        <div className="p-6 flex justify-between items-start border-b border-white/10">
          <div>
            <h2 className="text-white text-2xl m-0 font-medium">Check-in</h2>
            <p className="text-white/60 mt-2 mb-0 text-sm">Scan attendee's QR code to check in.</p>
          </div>
          <button className="bg-none border-none text-white text-2xl cursor-pointer p-0 leading-none hover:text-gray-300" onClick={handleClose}>×</button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">✓</div>
              <h3 className="text-white text-xl font-medium mb-2">Welcome, {successData.name}!</h3>
              <p className="text-white/80 mb-2">Successfully checked in to:</p>
              <p className="text-white font-medium">{successData.workshopTitle}</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                {showScanner && (
                  <div className="w-full h-64 bg-black rounded-lg overflow-hidden">
                    <Scanner
                      key={scannerKey}
                      onScan={handleScan}
                      onError={handleError}
                      constraints={{
                        facingMode: 'environment'
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-white/60 text-center text-sm">Or, Enter Ticket ID</p>
                <div className="space-y-2">
                  <label className="block text-white text-sm font-medium">Ticket ID</label>
                  <Input
                    placeholder="Type here"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                    onPressEnter={handleManualCheckIn}
                    className="w-full p-3 bg-[#2A2B32] border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-blue-500 focus:outline-none"
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
