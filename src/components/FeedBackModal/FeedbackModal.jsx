import React, { useState } from "react";
import { Modal, Button, Form, message } from "antd";
import {createFeedback} from "../../services/api";
import './index.css'

const FeedbackModal = ({ isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = useState("");
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      
      // Get company ID from localStorage
      const companyId = localStorage.getItem('companyId');
      if (!companyId) {
        throw new Error('Company ID not found');
      }
      
      // Check if feedback type is selected
      if (!feedbackType) {
        throw new Error('Please select a feedback type');
      }
      
      // Prepare payload
      const payload = {
        company_id: companyId,
        feedback_type: feedbackType,
        feedback_description: values.description
      };
      
      // Call API
      const response = await createFeedback(payload);
      console.log('Feedback submitted successfully:', response);
      
      // Reset form and close modal
      form.resetFields();
      setFeedbackType("");
      onClose();
      
      // Show success message
      message.success('Feedback submitted successfully!');
    } catch (error) {
      console.error('Feedback submission failed:', error);
      
      // Show appropriate error message
      if (error.message === 'Please select a feedback type') {
        message.error('Please select a feedback type');
      } else if (error.message === 'Company ID not found') {
        message.error('Company ID not found. Please log in again.');
      } else {
        message.error('Failed to submit feedback. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackTypes = [
    { key: 'bug', label: 'Bug' },
    { key: 'suggestion', label: 'Suggestion' },
    { key: 'other', label: 'Other' }
  ];

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      closable={true}
      className="feedback-modal"
    >
      <div className="feedback-modal-content">
        <div className="feedback-modal-header">
          <h2>Share feedback</h2>
        </div>

        <Form form={form} layout="vertical">
          <div className="feedback-section">
            <div className="feedback-section-label">Type of feedback</div>
            <div className="feedback-button-group">
              {feedbackTypes.map(({ key, label }) => (
                <Button
                  key={key}
                  className={`feedback-type-btn ${feedbackType === key ? "active" : ""
                    }`}
                  onClick={() => setFeedbackType(key)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div className="feedback-section">
            <Form.Item
              name="description"
              label={<div className="feedback-section-label">Company name*</div>}
              rules={[
                { required: true, message: 'Please provide company details' }
              ]}
            >
              <textarea
                placeholder="Describe in details.."
                className="feedback-textarea"
              />
            </Form.Item>
          </div>

          <div className="feedback-submit-section">
            <Button
              type="primary"
              className="feedback-submit-button"
              onClick={handleSubmit}
              loading={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default FeedbackModal;