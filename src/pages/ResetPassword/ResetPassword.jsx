import React, { useState } from "react";
import { Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/api";

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(108.08%_74.37%_at_50%_0%,_#33353F_0%,_#0D0D11_99.73%)]">
      <div className="mb-8 flex items-center gap-1">
        <img src="/neurelogo.png" alt="Neure Logo" className="h-8" />
        <h1 className="m-0 text-2xl font-medium text-white">neure</h1>
      </div>

      <div className="relative w-[471px] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(100%_100%_at_50%_0%,_#33353f_0%,_#191a20_100%)]">
        <div className="absolute left-0 right-0 top-0 h-20 bg-radial-gradients" />
        <div className="relative z-10 p-6">
          <div className="mb-8">
            <h1 className="m-0 mb-2 text-2xl font-medium text-white">Reset Password</h1>
            <p className="m-0 text-sm font-medium text-white">
              Enter your email and we'll send you instructions to reset your password.
            </p>
          </div>

          <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item
              label={<span className="text-sm text-gray-200">Email*</span>}
              name="email"
              rules={[{ required: true, message: "Please input your email!" }, { type: "email", message: "Please enter a valid email!" }]}
            >
              <input
                type="email"
                placeholder="e.g. example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border-0 bg-[#191a20] px-4 py-3 text-white"
              />
            </Form.Item>

            <Form.Item>
              <button type="submit" className={`w-full h-12 rounded-full ${isFormFilled ? "bg-gradient-to-b from-white to-[#797b87] text-black hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]" : "bg-gray-500 cursor-not-allowed text-black/60"}`} disabled={!isFormFilled}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </Form.Item>
          </Form>

          <div className="mt-6 text-center text-sm text-gray-400">
            <Link to="/login" className="text-white hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

