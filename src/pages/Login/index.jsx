import React, { useState } from "react";
import './index.css'

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFormFilled = email !== "" && password !== "";
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black">
      <div className="flex justify-center items-center mb-8">
        <img src="/neurelogo.png" alt="Neure Logo" className="h-full" />
        <h1 className="text-4xl font-semibold text-white  ml-2">neure</h1>
      </div>

      <div className="w-[471px] rounded-[20px] border border-white/10 bg-[#1E1F23] relative overflow-hidden">
        {/* Green Gradient Overlay */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-radial-gradient"></div>

        {/* Content with padding */}
        <div className="p-8 relative z-10">
          {/* Login Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-satoshi text-white font-semibold mb-2">
              Login
            </h2>
            <p className="text-white font-satoshi text-sm">
              Please enter your login credentials to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm text-gray-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="e.g. example@mail.com"
                className="w-full px-4 py-3 rounded-xl bg-[#141517] border-none
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm text-gray-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl bg-[#141517] border-none
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className={`w-full py-3 px-4 ${
                isFormFilled ? "bg-white text-black" : "bg-gray-500 text-black"
              } 
                       rounded-full transition-colors duration-200 font-medium`}
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Register Link - Outside container */}
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
