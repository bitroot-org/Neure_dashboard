// import React, { useState } from "react";
// import "./index.css";

// const SignUp = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const isFormFilled = email !== "" && password !== "";
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle login logic here
//   };

//   return (
//     <div>
//       <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black">
//         <div className="flex justify-center items-center mb-8">
//           <img src="/neurelogo.png" alt="Neure Logo" className="h-full" />
//           <h1 className="text-4xl font-semibold text-white  ml-2">neure</h1>
//         </div>

//         <div className="w-[400px] text-center mb-4">
//           <h2 className="text-2xl font-satoshi text-white font-semibold mb-2">
//             Get Early Access to Neure's Tailored Well-being Solutions
//           </h2>
//         </div>

//         <div className="w-[471px] rounded-[20px] border border-white/10 bg-[#1E1F23] relative overflow-hidden">
//           {/* Green Gradient Overlay */}
//           <div className="absolute top-0 left-0 right-0 h-20 bg-radial-gradient"></div>

//           {/* Content with padding */}
//           <div className="p-8 relative z-10">
//             {/* Login Header */}
//             <div className="mb-8">
//               <h2 className="text-2xl font-satoshi text-white font-semibold mb-2">
//                 Company info
//               </h2>
//             </div>

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Email Field */}
//               <div className="space-y-2">
//                 <label htmlFor="email" className="block text-sm text-gray-200">
//                   Company name*
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   placeholder="e.g. example@mail.com"
//                   className="w-full px-4 py-3 rounded-xl bg-[#141517] border-none
//                          text-white placeholder-gray-500 focus:outline-none focus:ring-2 
//                          focus:ring-blue-500 focus:border-transparent"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>

//               {/* Password Field */}
//               <div className="space-y-2">
//                 <label
//                   htmlFor="password"
//                   className="block text-sm text-gray-200"
//                 >
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   type="password"
//                   placeholder="Enter your password"
//                   className="w-full px-4 py-3 rounded-xl bg-[#141517] border-none
//                          text-white placeholder-gray-500 focus:outline-none focus:ring-2 
//                          focus:ring-blue-500 focus:border-transparent"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>

//               {/* Login Button */}
//               <button
//                 type="submit"
//                 className={`w-full py-3 px-4 ${
//                   isFormFilled
//                     ? "bg-white text-black"
//                     : "bg-gray-500 text-black"
//                 } 
//                        rounded-full transition-colors duration-200 font-medium`}
//               >
//                 Login
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;



import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import "./index.css";

const { Title } = Typography;

const SignUp = () => {
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (values) => {
    // Handle login logic here
    console.log('Form values:', values);
  };

  const isFormFilled = email !== "" && password !== "";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black">
      <div className="flex justify-center items-center mb-8">
        <img src="/neurelogo.png" alt="Neure Logo" className="h-full" />
        <Title level={1} style={{ color: 'white', marginLeft: '8px', marginBottom: 0 }}>
          neure
        </Title>
      </div>

      <div className="w-[400px] text-center mb-4">
        <Title level={2} style={{ color: 'white', fontFamily: 'satoshi', fontSize: '24px' }}>
          Get Early Access to Neure's Tailored Well-being Solutions
        </Title>
      </div>

      <div className="w-[471px] rounded-[20px] border border-white/10 bg-[#1E1F23] relative overflow-hidden">
        {/* Green Gradient Overlay */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-radial-gradient"></div>

        {/* Content with padding */}
        <div className="p-8 relative z-10">
          <Title level={2} style={{ color: 'white', fontFamily: 'satoshi', marginBottom: '32px' }}>
            Company info
          </Title>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
          >
            <Form.Item
              label={<span style={{ color: '#e5e7eb' }}>Company name*</span>}
              name="email"
              rules={[{ required: true, message: 'Please input your company name!' }]}
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
              <Input.Password
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 