import React, { useState, useContext } from "react";
import { Form, Button, Typography, message } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { UserDataContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { loginUser, changePassword } from "../../services/api";
import PasswordChangeModal from "../../components/PasswordChangeModal";
import "./Login.css";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { user, setUser } = useContext(UserDataContext);
  const isFormFilled = email !== "" && password !== "";
  const navigate = useNavigate();

  const buttonClass = isFormFilled ? "login-button enabled" : "login-button disabled";

  const handlePasswordChange = async (passwordData) => {
    try {
      const response = await changePassword({
        email: email,
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });

      message.success("Password changed successfully!");
      setShowPasswordModal(false);
      
      // Navigate directly to dashboard
      navigate("/");
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to change password");
    }
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    
    try {
      const response = await loginUser(values.email, values.password);
      
      // Check if the response indicates an error
      if (response.error || !response.status) {
        message.error({
          content: response.message || "Login failed",
          key: "loginError",
          style: {marginTop: "5vh"},
        });
        setIsLoading(false);
        return; // Stop execution here
      }

      // Store tokens
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("expiresAt", response.data.expiresAt);
      localStorage.setItem("companyId", response.data.companyId); // Fixed: correct path to companyId

      // Update user context with login data
      const userData = {
        id: response.data.user.user_id,
        email: response.data.user.email,
        roleId: response.data.user.role_id,
        userType: response.data.roleType,
        fullName: {
          firstName: response.data.user.first_name,
          lastName: response.data.user.last_name,
        },
        profileUrl: response.data.user.profile_url,
        profile: {
          accepted_terms: response.data.user.accepted_terms,
          has_seen_dashboard_tour: response.data.user.has_seen_dashboard_tour
        }
      };

      setUser(userData);
      localStorage.setItem("userData", JSON.stringify(userData));

      message.success("Login successful!");

      if (response.data.user.last_login === null) {
        setShowPasswordModal(true);
      } else {
        navigate("/", {
          state: {
            showTerms: response.data.user.accepted_terms === 0,
            showTour: response.data.user.has_seen_dashboard_tour === 0
          }
        });
      }
    } catch (error) {
      // This should not be reached with the updated loginUser function
      message.error("An unexpected error occurred");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Add a function to handle skipping password change
  const handleSkipPasswordChange = () => {
    setShowPasswordModal(false);
    
    // Get user data from localStorage to check tour status
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    
    // Navigate directly to dashboard
    navigate("/", {
      state: {
        showTerms: true, // Always show terms when skipping password change
        showTour: userData.profile?.has_seen_dashboard_tour === 0
      }
    });
  };

  return (
    <>
      <div className="login-container flex flex-col items-center justify-center w-full">
        <div className="login-logo">
          <img src="/neurelogo.png" alt="Neure Logo" className="h-full" />
          <h1 className="login-title">
            neure
          </h1>
        </div>

        <div className="login-card">
          {/* Green Gradient Overlay */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-radial-gradients"></div>

          {/* Content with padding */}
          <div className="content p-6 relative z-10">
            <div className="mb-8">
              <Title level={2} className="login-title">
                Login
              </Title>
              <Text className="login-text">
                Please enter your login credentials to continue
              </Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <Form.Item
                label={<span className="login-label">Email</span>}
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <input
                  type="email"
                  placeholder="e.g. example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                />
              </Form.Item>

              <Form.Item
                label={<span className="login-label">Password</span>}
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <div className="password-wrapper">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                  />
                  <div className="password-toggle" onClick={togglePasswordVisibility}>
                    {passwordVisible ? (
                      <EyeOutlined />
                    ) : (
                      <EyeInvisibleOutlined />
                    )}
                  </div>
                </div>
              </Form.Item>

              <Form.Item>
                <button
                  type="submit"
                  block
                  className={buttonClass}
                  loading={isLoading}
                  disabled={!isFormFilled}
                >
                  Login
                </button>
              </Form.Item>
            </Form>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          <a href="/forgot-password" className="text-white hover:underline">
            Forgot your password?
          </a>
        </div>

      </div>

      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          // Navigate directly to dashboard
          navigate("/");
        }}
        onSubmit={handlePasswordChange}
        isFirstLogin={true}
        onSkip={handleSkipPasswordChange}
      />
    </>
  );
};

export default LoginPage;
