import React, { useState } from "react";
import { Form, Button, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/api";
import "./ResetPassword.css";

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isFormFilled = email !== "";

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await forgotPassword(email);
      message.success("If the email exists, reset instructions have been sent.");
      navigate("/login");
    } catch (error) {
      message.error("Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rp-container">
      <div className="rp-logo">
        <img src="/neurelogo.png" alt="Neure Logo" className="h-full" />
        <h1 className="rp-title-logo">neure</h1>
      </div>

      <div className="rp-card">
        {/* Green Gradient Overlay */}
        <div className="bg-overlay bg-radial-gradients"></div>

        <div className="rp-content">
          <div className="mb-8">
            <h1 className="rp-heading">
              Reset Password
            </h1>
            <h1 className="rp-text">
              Enter your email and we'll send you instructions to reset your password.
            </h1>
          </div>

          <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item
              label={<span className="rp-label">Email*</span>}
              name="email"
              rules={[{ required: true, message: "Please input your email!" }, { type: "email", message: "Please enter a valid email!" }]}
            >
              <input
                type="email"
                placeholder="e.g. example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rp-input"
              />
            </Form.Item>

            <Form.Item>
              <button
                type="primary"
                htmlType="submit"
                block
                className={isFormFilled ? "rp-button enabled" : "rp-button disabled"}
                loading={isLoading}
                disabled={!isFormFilled}
              >
                Send Reset Link
              </button>
            </Form.Item>
          </Form>

          <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#9ca3af" }}>
            <Link to="/login" className="rp-link">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
