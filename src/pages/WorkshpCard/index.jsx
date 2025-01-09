import React from 'react';
import { Typography, Button } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './index.css';

const { Title, Text, Paragraph } = Typography;

const WorkshopCard = () => {

  const agendaItems = [
    {
      title: 'Introduction to Mental Resilience',
      points: [
        'Understanding mental resilience and why it matters at work',
        'Key traits of resilient individuals',
        'Assessing your current level of resilience'
      ]
    },
    {
      title: 'Stress Management Techniques',
      points: [
        'Identifying stress triggers and response patterns',
        'Practical tools for managing workplace stress',
        'Building positive coping mechanisms for high-stress situations'
      ]
    }
  ];

  return (
    <div className="workshop-container">
      <div className="workshop-card">
        <div className="image-container">
          <img 
            src="./workshop.png" 
            alt="Workshop participants" 
            className="workshop-image"
          />
        </div>
        
        <div className="content-container">
          <Title level={2} className="workshop-title">
            Boosting Mental Resilience in the Workplace
          </Title>

          <div className="event-details">
            <div className="detail-item">
              <CalendarOutlined className="detail-icon" />
              <Text>October 15, 2024</Text>
            </div>
            <div className="detail-item">
              <ClockCircleOutlined className="detail-icon" />
              <Text>10:00 AM - 12:30 PM</Text>
            </div>
            <div className="detail-item">
              <EnvironmentOutlined className="detail-icon" />
              <Text>Mumbai, Maharashtra</Text>
            </div>
          </div>

          <Button type="primary" className="book-button">
            Book a session
          </Button>

          <div className="section">
            <Title level={4} className="section-title">Overview:</Title>
            <Paragraph className="overview-text">
              This workshop focuses on helping employees develop mental resilience, a key factor in handling stress, maintaining work-life balance, and staying productive. Learn practical tools and techniques to handle workplace stress, develop a growth mindset, and build strong coping mechanisms for professional challenges.
            </Paragraph>
          </div>

          <div className="section">
            <Title level={4} className="section-title">Agenda:</Title>
            <div className="agenda-list">
              {agendaItems.map((item, index) => (
                <div key={index} className="agenda-item">
                  <Text strong className="agenda-title">{index + 1}. {item.title}</Text>
                  <ul className="agenda-points">
                    {item.points.map((point, pIndex) => (
                      <li key={pIndex}>{point}</li>
                    ))}
                  </ul>
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