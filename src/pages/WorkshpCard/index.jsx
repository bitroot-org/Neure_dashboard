import React, { useState, useEffect } from 'react';
import { Typography, Button, Spin, message } from 'antd';
import { useParams } from 'react-router-dom';
import { CalendarOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getWorkshopDetails , markAttendance} from '../../services/api';
import CustomHeader from '../../components/CustomHeader';
import CheckInModal from '../../components/CheckInModal';
import AttendeeModal from '../../components/AttendeeModal';
import './index.css';

const { Title, Text, Paragraph } = Typography;

// Add this helper function at the top of the file
const formatDateTime = (date, startTime, endTime) => {
  const eventDate = new Date(date);
  const start = new Date(startTime);
  const end = new Date(endTime);

  const formattedDate = eventDate.toLocaleString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const formattedStartTime = start.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const formattedEndTime = end.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return `${formattedDate} | ${formattedStartTime} - ${formattedEndTime}`;
};

const WorkshopCard = () => {
  const { workshopId } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);

  const handleViewAttendees = () => {
    setIsAttendeeModalOpen(true);
  };

  const handleCheckIn = () => {
    setIsCheckInModalOpen(true);
  };

  // Add this function to check if the workshop is scheduled for today
  const isWorkshopToday = () => {
    if (!workshop?.schedules?.[0]?.start_time) return false;
    
    const startTime = new Date(workshop.schedules[0].start_time);
    const today = new Date();
    
    return (
      startTime.getDate() === today.getDate() &&
      startTime.getMonth() === today.getMonth() &&
      startTime.getFullYear() === today.getFullYear()
    );
  };

  // Add this function to check if workshop is canceled
  const isWorkshopCanceled = () => {
    return workshop?.schedules?.[0]?.status === 'canceled';
  };

  // Add this function to get button disabled state
  const getButtonsDisabled = () => {
    return !isWorkshopToday() || isWorkshopCanceled();
  };

  // Add this function to get tooltip text
  const getButtonTooltip = () => {
    if (isWorkshopCanceled()) return 'This workshop is yet to be held ';
    if (!isWorkshopToday()) return 'These actions are only available on the day of the workshop';
    return '';
  };

  useEffect(() => {
    const fetchWorkshopDetails = async () => {
      const companyId = localStorage.getItem('companyId');
      try {
        setLoading(true);
      const companyId = localStorage.getItem('companyId');
      const response = await getWorkshopDetails(workshopId, companyId);
        if (response.status) {
          setWorkshop(response.data);
        } else {
          message.error('Failed to fetch workshop details');
        }
      } catch (error) {
        message.error('Error fetching workshop details');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshopDetails();
  }, [workshopId]);

  const handleDownload = () => {
    if (workshop?.pdf_url) {
      window.open(workshop.pdf_url, '_blank');
    } else {
      message.error('PDF not available');
    }
  };

  if (loading) return <Spin size="large" />;
  if (!workshop) return <div>Workshop not found</div>;

  return (
    <div className="workshop-container">
      <CustomHeader 
        title="Workshop Details" 
        showAttendeeButtons={true}
        onViewAttendeesClick={handleViewAttendees}
        onCheckInClick={handleCheckIn}
        buttonDisabled={getButtonsDisabled()}
        buttonTooltip={getButtonTooltip()}
      />
      <div className="workshop-card">
        <div className="image-container">
          <img
            src={workshop.poster_image}
            alt="Workshop"
            className="workshop-image"
          />
        </div>

        <div className="content-container">
          <div className='title-container'>
            <Title className="workshop-title">
              {workshop.title}
            </Title>
            <p>By <span>{workshop.organizer}</span></p>
          </div>


          {/* Update the event-details section */}
          <div className="event-details">
            <div className="detail-item">
              <img src='/calendarIcon.png' alt='calendar-icon' className="detail-icon" />
              <h3 className='detail-text'>
                {formatDateTime(
                  workshop.conference_date,
                  workshop.schedules[0]?.start_time,
                  workshop.schedules[0]?.end_time
                )}
              </h3>
            </div>
            {/* <div className="detail-item">
              <EnvironmentOutlined className="detail-icon" />
              <Text>{workshop.location}</Text>
            </div> */}
            <button className='download-button' onClick={handleDownload}>
              Download worksheet
            </button>
          </div>

          <div className="section">
            <h3 className="section-title">Overview:</h3>
            <p className="overview-text">
              {workshop.description}
            </p>
          </div>

          <div className="section">
            <h3  className="section-title">Agenda:</h3>
            <div className="agenda-list">
              {workshop.agenda.split(',').map((item, index) => (
                <div key={index} className="agenda-item">
                  <p className="agenda-title">{index + 1}. {item.trim()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
      />
      <AttendeeModal
        isOpen={isAttendeeModalOpen}
        onClose={() => setIsAttendeeModalOpen(false)}
      />
    </div>
  );
};

export default WorkshopCard;
