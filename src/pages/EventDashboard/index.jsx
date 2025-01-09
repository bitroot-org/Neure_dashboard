import React from "react";
import { Row, Col } from "antd";
import CustomCalendar from "../../components/CustomCalendar";
import PresentationSlide from "../../components/PresentationSlide";
// import Header from './Header';
import "./index.css";
import CustomHeader from "../../components/CustomHeader";

const EventDashboard = () => {
  const workshops = [
    {
      title: "Building Resilience: Strategies for Stress Management",
      date: "Mumbai | 15 Oct '24",
      backgroundImage: "./workshop.png",
    },
    {
      title: "Mindfulness in Action: Enhancing Focus and Clarity",
      date: "Mumbai | 15 Oct '24",
      backgroundImage: "./workshop.png",
    },
    {
      title: "Thriving in a Hybrid Workplace",
      date: "Virtual | 18 Oct '24",
      backgroundImage: "./workshop.png",
    },
    
  ];

  return (
    <div className="workshop-page">
      <CustomHeader title="Workshops" />
      <div className="workshop-content">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8} lg={6}>
          <div className="calendar-wrapper">
            <CustomCalendar />
          </div>
        </Col>

        <Col xs={24} md={16} lg={18}>
          <div className="workshops-grid">
            {workshops.map((workshop, index) => (
              <div key={index} className="workshop-item">
                <PresentationSlide
                  title={workshop.title}
                  date={workshop.date}
                  backgroundImage={workshop.backgroundImage}
                />
              </div>
            ))}
          </div>
        </Col>
      </Row>
      </div>
    </div>
  );
};

export default EventDashboard;
