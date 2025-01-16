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
    month: 'long',
    day: 'numeric',
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
          <Title className="workshop-title">
            {workshop.title}
          </Title>

          {/* Update the event-details section */}
          <div className="event-details">
            <div className="detail-item">
              <CalendarOutlined className="detail-icon" />
              <Text>
                {formatDateTime(
                  workshop.conference_date,
                  workshop.schedules[0]?.start_time,
                  workshop.schedules[0]?.end_time
                )}
              </Text>
            </div>
            <div className="detail-item">
              <EnvironmentOutlined className="detail-icon" />
              <Text>{workshop.location}</Text>
            </div>
          </div>

          <Button type="primary" className="book-button">
            Book a session
          </Button>

          <div className="section">
            <Title level={4} className="section-title">Overview:</Title>
            <p className="overview-text">
              {workshop.description}
            </p>
          </div>

          <div className="section">
            <Title level={4} className="section-title">Agenda:</Title>
            <div className="agenda-list">
              {workshop.agenda.split(',').map((item, index) => (
                <div key={index} className="agenda-item">
                  <Text className="agenda-title">{index + 1}. {item.trim()}</Text>
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
