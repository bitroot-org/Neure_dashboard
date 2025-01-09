import React, { useState, useContext } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { UserDataContext } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom';
import "./index.css";
import axios from 'axios'

const { Title, Text } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user, setUser } = useContext(UserDataContext)
  const isFormFilled = email !== "" && password !== "";

  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, {
        email: values.email,
        password: values.password
      });

      // Update user context with login data
      setUser({
        id: response.data.data.user.id,
        email: response.data.data.user.email,
        role_id: response.data.data.user.role_id,
        fullName: {
          firstName: response.data.data.user.first_name || '',
          lastName: response.data.data.user.last_name || ''
        }
      });

      // Store token in localStorage
      localStorage.setItem('token', response.data.data.token);
      
      message.success('Login successful!');
      navigate('/');

    } catch (error) {
      message.error(error.response?.data?.message || 'Login failed');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black">
      <div className="flex justify-center items-center mb-8">
        <img src="/neurelogo.png" alt="Neure Logo" className="h-full" />
        <Title level={1} style={{ color: 'white', marginLeft: '8px', marginBottom: 0 }}>
          neure
        </Title>
      </div>

      <div className="w-[471px] rounded-[20px] border border-white/10 bg-[#1E1F23] relative overflow-hidden">
        {/* Green Gradient Overlay */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-radial-gradient"></div>

        {/* Content with padding */}
        <div className="p-8 relative z-10">
          <div className="mb-8">
            <Title level={2} style={{ color: 'white', fontFamily: 'satoshi', marginBottom: '8px' }}>
              Login
            </Title>
            <Text style={{ color: 'white', fontFamily: 'satoshi' }}>
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
              label={<span style={{ color: '#e5e7eb' }}>Email</span>}
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                placeholder="e.g. example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: '#141517',
                  borderRadius: '12px',
                  border: 'none',
                  padding: '12px 16px',
                  color: 'white'
                }}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: '#e5e7eb' }}>Password</span>}
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                suffix={
                  <div onClick={togglePasswordVisibility} style={{ cursor: 'pointer', color: '#6b7280' }}>
                    {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  </div>
                }
                style={{
                  background: '#141517',
                  borderRadius: '12px',
                  border: 'none',
                  padding: '12px 16px',
                  color: 'white'
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{
                  marginTop: '24px',
                  height: '48px',
                  borderRadius: '9999px',
                  background: isFormFilled ? 'white' : '#6b7280',
                  color: 'black'
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