import React, { useState, useEffect } from "react";
import { Collapse, Card, Button, Space, Spin } from "antd";
import FeedbackModal from "../../components/FeedBackModal/FeedbackModal";
import "./index.css";
import CustomHeader from "../../components/CustomHeader";
import { getQna } from "../../services/api";

const FAQShimmer = () => (
  <>
    <div className="description-shimmer shimmer-effect" />
    {[...Array(5)].map((_, index) => (
      <div
        key={`faq-shimmer-${index}`}
        className="faq-shimmer-item shimmer-effect"
      />
    ))}
  </>
);

const FooterCardShimmer = ({ type }) => (
  <div className="footer-card-shimmer">
    <div className="shimmer-title shimmer-effect" />
    <div className="shimmer-text shimmer-effect" />
    {type === "feedback" && <div className="shimmer-button shimmer-effect" />}
  </div>
);

const HelpAndSupport = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faqItems, setFaqItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await getQna();
        if (response.status && response.data) {
          const formattedFaqs = response.data.map((item) => ({
            key: item.id || Math.random(),
            label: item.question,
            children: item.answer,
          }));
          setFaqItems(formattedFaqs);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <div className="faq-container">
      <div className="faq-inner">
        <CustomHeader title="Help and Support" />
        <h2 className="description">
          Welcome to our Mental Health Support Center. Here you'll find answers
          to commonly asked questions about our mental health services,
          resources, and support systems. If you can't find what you're looking
          for, don't hesitate to reach out to our dedicated support team.
        </h2>
        {loading ? (
          <>
            <FAQShimmer />
            <div className="footer-grid">
              <FooterCardShimmer type="feedback" />
              <FooterCardShimmer type="support" />
            </div>
          </>
        ) : (
          <Collapse accordion className="faq-collapse" items={faqItems} />
        )}

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
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default HelpAndSupport;
