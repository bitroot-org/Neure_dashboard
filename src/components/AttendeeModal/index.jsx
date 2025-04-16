import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { message, Spin } from 'antd';
import { getWorkshopAttendees } from '../../services/api';
import './index.css';

const AttendeeModal = ({ isOpen, onClose }) => {
  const { workshopId } = useParams();
  const [activeTab, setActiveTab] = useState('total');
  const [loading, setLoading] = useState(false);
  const [attendees, setAttendees] = useState({
    total: [],
    checkedIn: [],
    notCheckedIn: []
  });

  useEffect(() => {
    if (isOpen && workshopId) {
      fetchAttendees();
    }
  }, [isOpen, workshopId]);

  const fetchAttendees = async () => {
    try {
      setLoading(true);
      const companyId = localStorage.getItem('companyId');
      
      if (!companyId) {
        throw new Error('Company ID not found');
      }

      const response = await getWorkshopAttendees(workshopId, companyId);

      if (response.status) {
        const allAttendees = response.data || [];
        
        // Separate attendees based on is_attended status
        const checkedIn = allAttendees.filter(a => a.is_attended === 1);
        const notCheckedIn = allAttendees.filter(a => a.is_attended === 0);

        setAttendees({
          total: allAttendees,
          checkedIn,
          notCheckedIn
        });
      } else {
        message.error(response.message || 'Failed to fetch attendees');
      }
    } catch (error) {
      console.error('Error fetching attendees:', error);
      message.error('Failed to fetch attendees');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayData = () => {
    switch (activeTab) {
      case 'checkedIn':
        return attendees.checkedIn;
      case 'notCheckedIn':
        return attendees.notCheckedIn;
      default:
        return attendees.total;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="attendee-modal-overlay">
      <div className="attendee-modal">
        <div className="attendee-modal-header">
          <div>
            <h2>Attendees</h2>
            {/* {attendees.total.length > 0 && (
              <p className="workshop-title">{attendees.total[0].workshop_title}</p>
            )} */}
          </div>
          <div>
            <button className="download-csv">Download CSV</button>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="attendee-tabs">
          <button 
            className={`tab ${activeTab === 'total' ? 'active' : ''}`}
            onClick={() => setActiveTab('total')}
          >
            Total RSVP ({attendees.total.length})
          </button>
          <button 
            className={`tab ${activeTab === 'checkedIn' ? 'active' : ''}`}
            onClick={() => setActiveTab('checkedIn')}
          >
            Checked-in ({attendees.checkedIn.length})
          </button>
          <button 
            className={`tab ${activeTab === 'notCheckedIn' ? 'active' : ''}`}
            onClick={() => setActiveTab('notCheckedIn')}
          >
            Not checked-in ({attendees.notCheckedIn.length})
          </button>
        </div>

        <div className="attendee-list">
          {loading ? (
            <div className="loading-state">
              <Spin size="large" />
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Sr no.</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Ticket Code</th>
                  {/* <th>Registration Time</th> */}
                  {activeTab === 'checkedIn' && <th>Check-in Time</th>}
                </tr>
              </thead>
              <tbody>
                {getDisplayData().map((attendee, index) => (
                  <tr key={attendee.ticket_code}>
                    <td>{index + 1}</td>
                    <td>{`${attendee.first_name} ${attendee.last_name}`}</td>
                    <td>{attendee.email}</td>
                    <td>{attendee.ticket_code}</td>
                    {/* <td>{formatDate(attendee.ticket_generated_at)}</td> */}
                    {activeTab === 'checkedIn' && (
                      <td>{formatDate(attendee.updated_at)}</td>
                    )}
                  </tr>
                ))}
                {getDisplayData().length === 0 && (
                  <tr>
                    <td colSpan={activeTab === 'checkedIn' ? 6 : 5} className="no-data">
                      No attendees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendeeModal;
