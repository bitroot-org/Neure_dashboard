import React, { useState } from "react";
import { Modal, Button, Form, message } from "antd";
import {createFeedback} from "../services/api";

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
      className="[&_.ant-modal-content]:bg-[#1a1a1a] [&_.ant-modal-content]:rounded-xl [&_.ant-modal-header]:bg-transparent [&_.ant-modal-title]:text-white [&_.ant-modal-close]:text-white"
    >
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-white text-2xl font-semibold m-0">Share feedback</h2>
        </div>

        <Form form={form} layout="vertical">
          <div className="mb-6">
            <div className="text-white text-base font-medium mb-3">Type of feedback</div>
            <div className="flex gap-3">
              {feedbackTypes.map(({ key, label }) => (
                <Button
                  key={key}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    feedbackType === key
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-transparent border-white/20 text-white hover:border-blue-500 hover:text-blue-400"
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
              label={<div className="feedback-section-label">Feedback description*</div>}
              rules={[
                { required: true, message: 'Please provide feedback details' }
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