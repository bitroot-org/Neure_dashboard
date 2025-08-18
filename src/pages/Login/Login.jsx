import React, { useState, useContext } from "react";
import { Form, message } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { UserDataContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { loginUser, changePassword } from "../../services/api";
import PasswordChangeModal from "../../components/PasswordChangeModal";

const LoginPage = () => {
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { setUser } = useContext(UserDataContext);
  const isFormFilled = email !== "" && password !== "";
  const navigate = useNavigate();

  const handlePasswordChange = async (passwordData) => {
    try {
      await changePassword({
        email: email,
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });
      message.success("Password changed successfully!");
      setShowPasswordModal(false);
      navigate("/");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to change password"
      );
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await loginUser(email, password);
      if (response.error || !response.status) {
        message.error(response.message || "Login failed");
        setIsLoading(false);
        return;
      }
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("expiresAt", response.data.expiresAt);
      localStorage.setItem("companyId", response.data.companyId);

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
          has_seen_dashboard_tour: response.data.user.has_seen_dashboard_tour,
        },
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
            showTour: response.data.user.has_seen_dashboard_tour === 0,
          },
        });
      }
    } catch (error) {
      message.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipPasswordChange = () => {
    setShowPasswordModal(false);
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    navigate("/", {
      state: {
        showTerms: true,
        showTour: userData.profile?.has_seen_dashboard_tour === 0,
      },
    });
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center w-full relative overflow-hidden">
        {/* Background with radial gradient */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#33353F] to-[#0D0D11] z-0" />

        <div className="flex gap-2 items-center mb-8 z-10">
          <img src="/neurelogo.png" alt="Neure Logo" className="h-12" />
          <h1 className="text-4xl font-bold text-white">neure</h1>
        </div>

        <div className="relative w-full max-w-md bg-[#191A20]/80 rounded-2xl shadow-xl overflow-hidden z-10">
          {/* Top radial glow for the form */}
          <div
            className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 400px 80px at 50% 0%, 
                  rgba(0, 216, 133, 0.3) 0%, 
                  rgba(0, 216, 133, 0.1) 50%, 
                  transparent 100%
                )
              `,
            }}
          />

          <div className="relative z-10 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Login</h2>
              <p className="text-[#B1B3C0] text-base">
                Please enter your login credentials to continue
              </p>
            </div>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <div className="mb-5">
                <label
                  className="block text-[#B1B3C0] text-sm mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input peer w-full px-4 py-3 rounded-lg bg-[#23242B] border border-transparent focus:border-[#00D885] text-white placeholder-[#B1B3C0] outline-none transition"
                  autoComplete="username"
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  className="block text-[#B1B3C0] text-sm mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input peer w-full px-4 py-3 rounded-lg bg-[#23242B] border border-transparent focus:border-[#00D885] text-white placeholder-[#B1B3C0] outline-none transition pr-12"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B1B3C0] hover:text-[#00D885] focus:outline-none"
                    onClick={() => setPasswordVisible((v) => !v)}
                  >
                    {passwordVisible ? (
                      <EyeOutlined />
                    ) : (
                      <EyeInvisibleOutlined />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className={`w-full py-3 rounded-full font-semibold text-black bg-gradient-to-b from-white to-[#797b87] transition disabled:opacity-60 disabled:cursor-not-allowed mt-2 `}
                disabled={!isFormFilled || isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </Form>
            <div className="mt-6 text-center text-sm">
              <a href="/forgot-password" className="text-white hover:underline">
                Forgot your password?
              </a>
            </div>
          </div>
        </div>
      </div>
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
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
