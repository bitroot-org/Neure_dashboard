// import React, { useState } from "react";
// import { Modal, Button, Input, Space } from "antd";
// const { TextArea } = Input;
// import './index.css'

// const FeedbackModal = ({ isOpen, onClose }) => {
//   const [feedbackType, setFeedbackType] = useState("");

//   return (
//     <Modal
//       open={isOpen}
//       onCancel={onClose}
//       footer={null}
//       closable={true}
//       className="feedback-modal"
//     >
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Share feedback</h2>
//         </div>
//         <div className="feedback-section">
//           <div className="section-label">Type of feedback</div>
//           <Space className="button-group">
//             <Button
//               className={`feedback-type-btn ${
//                 feedbackType === "bug" ? "active" : ""
//               }`}
//               onClick={() => setFeedbackType("bug")}
//             >
//               Bug
//             </Button>
//             <Button
//               className={`feedback-type-btn ${
//                 feedbackType === "suggestion" ? "active" : ""
//               }`}
//               onClick={() => setFeedbackType("suggestion")}
//             >
//               Suggestion
//             </Button>
//             <Button
//               className={`feedback-type-btn ${
//                 feedbackType === "other" ? "active" : ""
//               }`}
//               onClick={() => setFeedbackType("other")}
//             >
//               Other
//             </Button>
//           </Space>
//         </div>

//         {/* Company Name Section */}
//         <div className="feedback-section">
//           <div className="section-label">Company name*</div>
//           <TextArea
//             placeholder="Describe in details.."
//             className="feedback-textarea"
//             style={{
//               resize: "none",
//             }}
//           />
//         </div>

//         {/* Submit Button Section */}
//         <div className="submit-section">
//           <Button type="primary" className="submit-button">
//             Submit
//           </Button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default FeedbackModal;



import React, { useState } from "react";
import { Modal, Button, Input, Space, Form } from "antd";
const { TextArea } = Input;
import './index.css'

const FeedbackModal = ({ isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = useState("");
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      console.log('Feedback submitted:', { ...values, feedbackType });
      form.resetFields();
      setFeedbackType("");
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
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
      <div className="modal-content">
        <div className="modal-header">
          <h2>Share feedback</h2>
        </div>

        <Form form={form} layout="vertical">
          <div className="feedback-section">
            <div className="section-label">Type of feedback</div>
            <Space className="button-group">
              {feedbackTypes.map(({ key, label }) => (
                <Button
                  key={key}
                  className={`feedback-type-btn ${
                    feedbackType === key ? "active" : ""
                  }`}
                  onClick={() => setFeedbackType(key)}
                >
                  {label}
                </Button>
              ))}
            </Space>
          </div>

          <div className="feedback-section">
            <Form.Item
              name="description"
              label={<div className="section-label">Company name*</div>}
              rules={[
                { required: true, message: 'Please provide company details' }
              ]}
            >
              <TextArea
                placeholder="Describe in details.."
                className="feedback-textarea"
              />
            </Form.Item>
          </div>

          <div className="submit-section">
            <Button
              type="primary"
              className="submit-button"
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