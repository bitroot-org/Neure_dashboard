import React, { useState } from "react";
import { Collapse, Card, Button, Space } from "antd";
import FeedbackModal from "../../components/FeedBackModal/FeedbackModal";
import BackButton from "../../components/Button";
import { faqData } from "../../constants/faqData";
import "./index.css";

const HelpAndSupport = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="faq-container">
      <div className="faq-inner">
        <div className="faq-header">
          <BackButton text="Help & Support" />
          <div className="border-line" />
          <p className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Suspendisse varius enim in eros elementum tristique.
          </p>
        </div>

        <Collapse accordion className="faq-collapse" items={faqData} />

        <div className="footer-grid">
          <Card className="footer-card">
            <Space className="feedback-space" direction="horizontal">
              <div className="feedback-content">
                <h3>Help us improve</h3>
                <p>Got a suggestion or found a bug? Let us know!</p>
              </div>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="feedback-button"
              >
                Share feedback
              </Button>
            </Space>
          </Card>

          <Card className="footer-card">
            <div className="support-content">
              <h3>Need help?</h3>
              <p>
                reach out to us at{" "}
                <a href="mailto:info@neure.co.in">info@neure.co.in</a>
              </p>
            </div>
          </Card>
        </div>
      </div>
      <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default HelpAndSupport;