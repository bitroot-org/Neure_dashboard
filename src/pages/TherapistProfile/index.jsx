import React from 'react';
import { Card, Row, Col, Tag, Button, Typography, Rate } from 'antd';
import { MessageOutlined, TranslationOutlined } from '@ant-design/icons';
import './index.css';

const { Title, Text, Paragraph } = Typography;

const TherapistProfile = () => {
  return (
    <div className="profile-container">
      <Row gutter={[24, 24]}>
        {/* Left Column - Profile Card */}
        <Col xs={24} md={8}>
          <Card className="profile-card">
            <div className="profile-header">
              <img 
                src="/placeholder-image.jpg" 
                alt="Therapist"
                className="profile-image"
              />
              <Title level={3} className="profile-name">Pujita Mirwani</Title>
              <Text type="secondary">Counselling psychologist</Text>
              <div className="rating-container">
                <Rate disabled defaultValue={4.5} />
                <Text type="secondary">(23 ratings)</Text>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <MessageOutlined />
                <Text>4-6 year of experience</Text>
              </div>
              <div className="detail-item">
                <TranslationOutlined />
                <Text>English, Hindi</Text>
              </div>
            </div>

            <div className="price-section">
              <Text className="price">₹1500</Text>
              <Text type="secondary">Per session</Text>
            </div>

            <Button type="primary" block size="large">
              Book session
            </Button>
          </Card>
        </Col>

        {/* Right Column - Details */}
        <Col xs={24} md={16}>
          <div className="details-section">
            <section className="about-section">
              <Title level={4}>About me</Title>
              <Paragraph>
                Join this transformative session to discover tools and techniques 
                for managing stress and improving focus. Learn how mindfulness 
                practices can help you regain control and build resilience in 
                your daily life.
              </Paragraph>
            </section>

            <section className="specializations-section">
              <Title level={4}>Specializations</Title>
              <div className="tags-container">
                <Tag>Anxiety</Tag>
                <Tag>Stress</Tag>
                <Tag>Burnout</Tag>
                <Tag>Trauma</Tag>
                <Tag>Work-life balance</Tag>
              </div>
            </section>

            <section className="availability-section">
              <Title level={4}>Availability</Title>
              <div className="availability-details">
                <div className="detail-row">
                  <Text strong>Next Slot:</Text>
                  <Text>Tomorrow 12 PM</Text>
                </div>
                <div className="detail-row">
                  <Text strong>Session Duration:</Text>
                  <Text>60 minutes</Text>
                </div>
              </div>
            </section>

            <section className="qualifications-section">
              <Title level={4}>Qualifications</Title>
              <Text>Master of Arts - Clinical Psychology</Text>
            </section>

            <section className="why-section">
              <Title level={4}>Why did I become a therapist?</Title>
              <Paragraph>
                I became a therapist to help others navigate life's challenges, 
                offering support and guidance to promote healing and growth. 
                It's rewarding to be a part of someone's journey towards better 
                mental well-being.
              </Paragraph>
            </section>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TherapistProfile;