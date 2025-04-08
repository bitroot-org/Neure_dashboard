import React, { useState, useEffect } from 'react';
import { Typography, Button, Spin, message } from 'antd';
import { useParams } from 'react-router-dom';
import { CalendarOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getWorkshopDetails } from '../../services/api';
import CustomHeader from '../../components/CustomHeader';
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

  useEffect(() => {
    const fetchWorkshopDetails = async () => {
      try {
        setLoading(true);
        const response = await getWorkshopDetails(workshopId);
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

  // Add this handler function before the return statement
  // const handleDownload = () => {
  //   if (workshop.pdf_url) {
  //     // Create an anchor element
  //     const link = document.createElement('a');
  //     link.href = workshop.pdf_url;
      
  //     // Set download attribute with filename (extract from URL or use default)
  //     const fileName = workshop.pdf_url.split('/').pop() || `${workshop.title.replace(/\s+/g, '_')}.pdf`;
  //     link.download = fileName;
      
  //     // Append to body, click and remove
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } else {
  //     message.error('PDF not available');
  //   }
  // };

  const handleDownload = () => {
    if (workshop.pdf_url) {
      try {
        // Open in a new tab instead of trying to force download
        window.open(workshop.pdf_url, '_blank');
        
        // Inform the user
        message.info('Opening PDF in a new tab');
      } catch (error) {
        console.error('PDF access error:', error);
        message.error('Unable to access the PDF. The file might be restricted.');
      }
    } else {
      message.error('PDF not available');
    }
  };

  if (loading) return <Spin size="large" />;
  if (!workshop) return <div>Workshop not found</div>;

  return (
    <div className="workshop-container">
      <CustomHeader title="Workshop Details" />
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
            <button 
              className='download-button' 
              onClick={handleDownload}
              disabled={!workshop.pdf_url}
            >
              {workshop.pdf_url ? 'Download worksheet' : 'No worksheet available'}
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
    </div>
  );
};

export default WorkshopCard;
