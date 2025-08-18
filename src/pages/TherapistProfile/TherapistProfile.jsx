import React from 'react';
import { Card, Row, Col, Tag, Button, Typography, Rate } from 'antd';
import { MessageOutlined, TranslationOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const TherapistProfile = () => {
  return (
    <div className="mx-auto max-w-[1200px] p-6 md:p-4">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card className="h-full">
            <div className="mb-6 text-center">
              <img src="/placeholder-image.jpg" alt="Therapist" className="mx-auto mb-4 h-30 w-30 rounded-full object-cover" />
              <Title level={3} className="!my-2">Pujita Mirwani</Title>
              <Text type="secondary">Counselling psychologist</Text>
              <div className="my-4 flex items-center justify-center gap-2">
                <Rate disabled defaultValue={4.5} />
                <Text type="secondary">(23 ratings)</Text>
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2"><MessageOutlined /><Text>4-6 year of experience</Text></div>
              <div className="mb-3 flex items-center gap-2"><TranslationOutlined /><Text>English, Hindi</Text></div>
            </div>

            <div className="my-6 text-center">
              <Text className="mr-2 text-2xl font-bold">₹1500</Text>
              <Text type="secondary">Per session</Text>
            </div>

            <Button type="primary" block size="large">
              Book session
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <div className="space-y-8">
            <section>
              <Title level={4}>About me</Title>
              <Paragraph>
                Join this transformative session to discover tools and techniques for managing stress and improving focus. Learn how mindfulness practices can help you regain control and build resilience in your daily life.
              </Paragraph>
            </section>

            <section>
              <Title level={4}>Specializations</Title>
              <div className="flex flex-wrap gap-2">
                <Tag>Anxiety</Tag>
                <Tag>Stress</Tag>
                <Tag>Burnout</Tag>
                <Tag>Trauma</Tag>
                <Tag>Work-life balance</Tag>
              </div>
            </section>

            <section>
              <Title level={4}>Availability</Title>
              <div className="space-y-2">
                <div className="flex justify-between"><Text strong>Next Slot:</Text><Text>Tomorrow 12 PM</Text></div>
                <div className="flex justify-between"><Text strong>Session Duration:</Text><Text>60 minutes</Text></div>
              </div>
            </section>

            <section>
              <Title level={4}>Qualifications</Title>
              <Text>Master of Arts - Clinical Psychology</Text>
            </section>

            <section>
              <Title level={4}>Why did I become a therapist?</Title>
              <Paragraph>
                I became a therapist to help others navigate life's challenges, offering support and guidance to promote healing and growth. It's rewarding to be a part of someone's journey towards better mental well-being.
              </Paragraph>
            </section>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TherapistProfile;

