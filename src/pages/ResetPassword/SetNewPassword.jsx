import React, { useState, useEffect } from "react";
import { Form, Button, Typography, message } from "antd";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { resetPasswordWithToken } from "../../services/api";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const { Title } = Typography;

const SetNewPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({ length: true, lowercase: true, uppercase: true, number: true, special: true, match: true });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    const errors = { length: password.length < 8, lowercase: !hasLower, uppercase: !hasUpper, number: !hasNum, special: !hasSpecial, match: password !== confirmPassword && confirmPassword !== "" };
    setValidationErrors(errors);
    setIsFormValid(password !== "" && confirmPassword !== "" && !errors.length && !errors.lowercase && !errors.uppercase && !errors.number && !errors.special && !errors.match);
  }, [password, confirmPassword]);

  const allPasswordRequirementsMet = () => {
    const v = validationErrors;
    return !v.length && !v.lowercase && !v.uppercase && !v.number && !v.special;
  };

  const handleSubmit = async () => {
    if (!isFormValid) { message.error("Passwords do not meet the requirements"); return; }
    setIsLoading(true);
    try {
      await resetPasswordWithToken(token, password);
      message.success("Password reset successful. You can now login.");
      navigate("/login");
    } catch (error) {
      message.error(error.message || "Failed to reset password");
    } finally { setIsLoading(false); }
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
            <Title level={2} className="!m-0 !text-2xl !font-medium !text-white">Set New Password</Title>
          </div>

          <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item label={<span className="text-sm text-gray-200">New Password</span>}>
              <div className="relative">
                <input type={passwordVisible ? "text" : "password"} placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border-0 bg-[#191a20] px-4 py-3 text-white" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400" onClick={() => setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </div>
              </div>
              {password && !allPasswordRequirementsMet() && (
                <div className="mt-2 space-y-1 text-xs">
                  <div className={` ${!validationErrors.length ? 'text-green-400' : 'text-red-400'}`}>• Minimum 8 characters</div>
                  <div className={` ${!validationErrors.lowercase ? 'text-green-400' : 'text-red-400'}`}>• At least one lowercase letter</div>
                  <div className={` ${!validationErrors.uppercase ? 'text-green-400' : 'text-red-400'}`}>• At least one uppercase letter</div>
                  <div className={` ${!validationErrors.number ? 'text-green-400' : 'text-red-400'}`}>• At least one number</div>
                  <div className={` ${!validationErrors.special ? 'text-green-400' : 'text-red-400'}`}>• At least one special character</div>
                </div>
              )}
            </Form.Item>

            <Form.Item label={<span className="text-sm text-gray-200">Confirm Password</span>}>
              <div className="relative">
                <input type={confirmVisible ? "text" : "password"} placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-xl border-0 bg-[#191a20] px-4 py-3 text-white" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400" onClick={() => setConfirmVisible(!confirmVisible)}>
                  {confirmVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </div>
              </div>
              {confirmPassword && validationErrors.match && (
                <div className="text-xs text-red-400">Passwords do not match</div>
              )}
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block className={isFormValid ? "h-12 rounded-full bg-gradient-to-b from-white to-[#797b87] text-black hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]" : "h-12 rounded-full bg-gray-500 text-black/60"} disabled={!isFormValid} loading={isLoading}>
                Reset Password
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-6 text-center text-sm text-gray-400">
            <Link to="/login" className="text-white hover:underline">Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetNewPasswordPage;

