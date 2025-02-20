import React, { useState, useContext } from "react";
import { Form, Button, Typography, message } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { UserDataContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";
import "./index.css";
import axios from "axios";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user, setUser } = useContext(UserDataContext);
  const isFormFilled = email !== "" && password !== "";

  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await loginUser(values.email, values.password);

      // Store tokens
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("expiresAt", response.data.expiresAt);
      localStorage.setItem("companyId", response.data.companyId);

      // Update user context with login data
      const userData = {
        id: response.data.user.user_id,
        email: response.data.user.email,
        roleId: response.data.user.role_id,
        userType: response.data.user.user_type,
        fullName: {
          firstName: response.data.user.first_name,
          lastName: response.data.user.last_name,
        },
      };

      setUser(userData);

      message.success("Login successful!");

      const isCompanyOnboarded = response.data.companyOnboarded;
      navigate(isCompanyOnboarded ? "/" : "/onboarding");
    } catch (error) {
      message.error(error.response?.data?.message || "Login failed");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-black"
      style={{
        background: "linear-gradient(to bottom, #33353F 0%, #0D0D11 30%), #0D0D11",
        minHeight: "100vh",
      }}
    >
      <div className="flex justify-center items-center mb-8">
        <img src="/neurelogo.png" alt="Neure Logo" className="h-full" />
        <Title
          level={1}
          style={{ color: "white", marginLeft: "8px", marginBottom: 0 }}
        >
          neure
        </Title>
      </div>

      <div className="w-[471px] rounded-[20px] border border-white/10 bg-[#1E1F23] relative overflow-hidden">
        {/* Green Gradient Overlay */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-radial-gradients"></div>

        {/* Content with padding */}
        <div className="p-6 relative z-10">
          <div className="mb-8">
            <Title
              level={2}
              style={{
                color: "white",
                fontFamily: "Roboto, sans-serif",
                marginBottom: "8px",
              }}
            >
              Login
            </Title>
            <Text style={{ color: "white", fontFamily: "Roboto, sans-serif" }}>
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
              label={<span style={{ color: "#e5e7eb", fontFamily:"Roboto, sans-serif" }}>Email</span>}
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
                style={{
                  background: "#191A20",
                  borderRadius: "12px",
                  border: "none",
                  padding: "12px 16px",
                  color: "white",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: "#e5e7eb", fontFamily:"Roboto, sans-serif" }}>Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <div style={{ position: "relative" }}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    background: "#191A20",
                    borderRadius: "12px",
                    border: "none",
                    padding: "12px 16px",
                    color: "white",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
                <div
                  onClick={togglePasswordVisibility}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#6b7280",
                  }}
                >
                  {passwordVisible ? (
                    <EyeOutlined />
                  ) : (
                    <EyeInvisibleOutlined />
                  )}
                </div>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{
                  height: "48px",
                  borderRadius: "9999px",
                  background: isFormFilled ? "linear-gradient(to bottom, #FFFFFF 0%, #797B87 100%)" : "#6b7280",
                  color: "black",
                  marginBottom: "-20px",
                  border: "none",
                }}
                loading={isLoading}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-400">
        New to Neure?{" "}
        <a href="#" className="text-white hover:underline">
          Join the waitlist here!
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
