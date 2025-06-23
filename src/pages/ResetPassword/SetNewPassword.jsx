import React, { useState, useEffect } from "react";
import { Form, Button, Typography, message } from "antd";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { resetPasswordWithToken } from "../../services/api";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import "./ResetPassword.css";

const { Title, Text } = Typography;

const SetNewPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    length: true,
    lowercase: true,
    uppercase: true,
    number: true,
    special: true,
    match: true,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    const errors = {
      length: password.length < 8,
      lowercase: !hasLower,
      uppercase: !hasUpper,
      number: !hasNum,
      special: !hasSpecial,
      match: password !== confirmPassword && confirmPassword !== "",
    };
    setValidationErrors(errors);

    setIsFormValid(
      password !== "" &&
        confirmPassword !== "" &&
        !errors.length &&
        !errors.lowercase &&
        !errors.uppercase &&
        !errors.number &&
        !errors.special &&
        !errors.match
    );
  }, [password, confirmPassword]);

  const allPasswordRequirementsMet = () => {
    const v = validationErrors;
    return !v.length && !v.lowercase && !v.uppercase && !v.number && !v.special;
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      message.error("Passwords do not meet the requirements");
      return;
    }

    setIsLoading(true);
    try {
      await resetPasswordWithToken(token, password);
      message.success("Password reset successful. You can now login.");
      navigate("/login");
    } catch (error) {
      message.error(error.message || "Failed to reset password");
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
        <div className="bg-overlay bg-radial-gradients"></div>
        <div className="rp-content">
          <div className="mb-8">
            <Title level={2} className="rp-heading">
              Set New Password
            </Title>
          </div>

          <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item label={<span className="rp-label">New Password</span>}>
              <div className="password-wrapper">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rp-input"
                />
                <div className="password-toggle" onClick={() => setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </div>
              </div>
              {password && !allPasswordRequirementsMet() && (
                <div className="password-requirements">
                  <div className={`requirement ${!validationErrors.length ? 'met' : 'not-met'}`}>• Minimum 8 characters</div>
                  <div className={`requirement ${!validationErrors.lowercase ? 'met' : 'not-met'}`}>• At least one lowercase letter</div>
                  <div className={`requirement ${!validationErrors.uppercase ? 'met' : 'not-met'}`}>• At least one uppercase letter</div>
                  <div className={`requirement ${!validationErrors.number ? 'met' : 'not-met'}`}>• At least one number</div>
                  <div className={`requirement ${!validationErrors.special ? 'met' : 'not-met'}`}>• At least one special character</div>
                </div>
              )}
            </Form.Item>

            <Form.Item label={<span className="rp-label">Confirm Password</span>}>
              <div className="password-wrapper">
                <input
                  type={confirmVisible ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rp-input"
                />
                <div className="password-toggle" onClick={() => setConfirmVisible(!confirmVisible)}>
                  {confirmVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </div>
              </div>
              {confirmPassword && validationErrors.match && (
                <div className="rp-validation-error">Passwords do not match</div>
              )}
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className={isFormValid ? "rp-button enabled" : "rp-button disabled"}
                loading={isLoading}
                disabled={!isFormValid}
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>

          <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#9ca3af" }}>
            <Link to="/login" className="text-white hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetNewPasswordPage;
