import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  message,
  Upload,

} from "antd";
import {
  ArrowLeftOutlined,
  UploadOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import "./index.css";
import { updateCompanyInfo } from "../../services/api";
import { useNavigate } from "react-router";
import TermsModal from "../../components/TermsModal";
import ConfirmationPage from "../../components/ConfirmationPage";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

// Step 1: Company Info Component
const CompanyInfoStep = ({ onNext, initialValues }) => {
  const [form] = Form.useForm();
  const [value, setValue] = useState(500);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  return (
    <>
      <Title
        level={2}
        className="responsive-title"
        style={{
          color: "white",
          marginBottom: "30px",
          fontWeight: "350",
        }}
      >
        Company info
      </Title>

      <Form form={form} layout="vertical" onFinish={onNext}>
        <Form.Item
          name="companyName"
          label={<Text className="form-label">Company name*</Text>}
          rules={[{ required: true, message: "Please enter company name" }]}
        >
          <input
            type="text"
            placeholder="e.g. swagpro"
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
          name="companySize"
          label={<Text className="form-label">Number of employees*</Text>}
          rules={[
            { required: true, message: "Please select number of employees" },
          ]}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-45%)",
                  height: "8px",
                  backgroundColor: "#4ADE80",
                  width: `${value / 100}%`,
                  zIndex: 3,
                  borderRadius: "2px",
                }}
              />
              <input
                type="range"
                min="1"
                max="10000"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                style={{
                  width: "100%",
                  appearance: "none",
                  background: "transparent",
                  cursor: "pointer",
                  position: "relative",
                  zIndex: 2,
                }}
                className="custom-slider"
              />
            </div>
            <input
              type="number"
              min="1"
              max="10000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{
                backgroundColor: "#191A20",
                borderRadius: "12px",
                border: "none",
                padding: "8px 12px",
                width: "80px",
                color: "white",
                fontSize: "16px",
                outline: "none",
                textAlign: "center", 
              }}
            />
          </div>
        </Form.Item>

        <Form.Item>
          <div className="button-container">
            <Button className="cancel-button">Cancel</Button>
            <Button type="primary" htmlType="submit" className="next-button">
              Next
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

// Step 2: Contact Person Info Component
const ContactInfoStep = ({ onNext, onPrevious, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  // Add this function to handle form submission
  const handleSubmit = async (values) => {
    try {
      // Validate all fields manually
      await form.validateFields();
      // If validation passes, call onNext with the form values
      onNext(values);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  return (
    <>
      <Title
        level={2}
        className="responsive-title"
        style={{
          color: "white",
          fontWeight: "350",
          marginBottom: "30px",
        }}
      >
        Contact person Info
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues} // Add this line
      >
        <Form.Item
          name="fullName"
          label={<Text className="form-label">Full name*</Text>}
          rules={[{ required: true, message: "Please enter full name" }]}
          style={{ marginBottom: "12px" }}
        >
          <input
            type="text"
            placeholder="e.g. Raj Rao"
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
          name="jobTitle"
          label={<Text className="form-label">Job title*</Text>}
          rules={[{ required: true, message: "Please enter job title" }]}
          style={{ marginBottom: "12px" }}
          validateTrigger={["onChange", "onBlur"]} // Add this line
        >
          <input
            type="text"
            placeholder="e.g. Manager or CEO"
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
          name="email"
          label={<Text className="form-label">Email*</Text>}
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter valid email" },
          ]}
          style={{ marginBottom: "12px" }}
          validateTrigger={["onChange", "onBlur"]} // Add this line
        >
          <input
            type="email" // Change to email type
            placeholder="e.g. ajit@swagpro.in"
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
          name="phone"
          label={<Text className="form-label">Phone number*</Text>}
          rules={[{ required: true, message: "Please enter phone number" }]}
          style={{ marginBottom: "12px" }}
          validateTrigger={["onChange", "onBlur"]} // Add this line
        >
          <input
            type="tel" // Change to tel type
            placeholder="e.g. +91 9876543210"
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

        <Form.Item style={{ marginBottom: "0px" }}>
          <div className="button-container">
            <Button
              onClick={onPrevious}
              icon={<ArrowLeftOutlined />}
              className="previous-button"
            >
              Previous
            </Button>
            <Button type="primary" htmlType="submit" className="next-button">
              Next
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

// Step 3: Service Interests Component
// const ServiceInterestsStep = ({ onNext, onPrevious, initialValues }) => {
//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (initialValues) {
//       form.setFieldsValue(initialValues);
//     }
//   }, [form, initialValues]);

//   const services = [
//     "Workshops & Webinars",
//     "Well-being metrics & analytics",
//     "Rewards & recognition",
//     "Custom solutions",
//     "Other",
//   ];

//   return (
//     <>
//       <Title
//         level={2}
//         className="responsive-title"
//         style={{
//           color: "white",
//           marginBottom: "30px",
//           fontWeight: "350",
//         }}
//       >
//         Service interests
//       </Title>
//       <Form form={form} layout="vertical" onFinish={onNext}>
//         <Form.Item
//           name="services"
//           label={
//             <Text className="form-label">
//               Choose the services you need assistance with
//             </Text>
//           }
//           rules={[
//             { required: true, message: "Please select at least one service" },
//           ]}
//         >
//           <Checkbox.Group style={{ width: "100%" }}>
//             <Row gutter={[16, 16]}>
//               {services.map((service) => (
//                 <Col xs={24} sm={12} key={service}>
//                   <div className="service-checkbox-wrapper">
//                     <Checkbox value={service} className="service-checkbox">
//                       {service}
//                     </Checkbox>
//                   </div>
//                 </Col>
//               ))}
//             </Row>
//           </Checkbox.Group>
//         </Form.Item>

//         <Form.Item>
//           <div className="button-container">
//             <Button
//               onClick={onPrevious}
//               icon={<ArrowLeftOutlined />}
//               className="previous-button"
//             >
//               Previous
//             </Button>
//             <Button type="primary" htmlType="submit" className="next-button">
//               Next
//             </Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </>
//   );
// };

// Step 4: Additional Info Component
// const AdditionalInfoStep = ({ onNext, onPrevious, initialValues }) => {
//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (initialValues) {
//       form.setFieldsValue(initialValues);
//     }
//   }, [form, initialValues]);

//   return (
//     <>
//       <Title
//         level={2}
//         className="responsive-title "
//         style={{
//           color: "white",
//           marginBottom: "30px",
//           fontWeight: "350",
//         }}
//       >
//         Additional Info
//       </Title>
//       <Form form={form} layout="vertical" onFinish={onNext}>
//         <Form.Item
//           name="additionalInfo"
//           label={
//             <Text className="form-label">Tell us more about your company*</Text>
//           }
//           rules={[
//             {
//               required: true,
//               message: "Please provide additional information",
//             },
//           ]}
//         >
//           <TextArea
//             rows={4}
//             placeholder="e.g. Tell us about your company"
//             className="custom-textarea custom-input"
//           />
//         </Form.Item>

//         <Form.Item>
//           <div className="button-container">
//             <Button
//               onClick={onPrevious}
//               icon={<ArrowLeftOutlined />}
//               className="previous-button"
//             >
//               Previous
//             </Button>
//             <Button type="primary" htmlType="submit" className="next-button">
//               Next
//             </Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </>
//   );
// };

const EmployeeDetailsStep = ({ onNext, onPrevious }) => {
  const [fileList, setFileList] = useState([]);

  const props = {
    name: "file",
    multiple: false,
    fileList,
    accept: ".csv",
    onChange(info) {
      const { status } = info.file;
      setFileList(info.fileList.slice(-1));

      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    customRequest({ file, onSuccess }) {
      // Simulate a successful upload after 1 second
      setTimeout(() => {
        onSuccess("ok");
      }, 1000);
    },
  };

  const handlePreview = () => {
    if (fileList.length === 0) {
      message.warning("Please upload a CSV file before proceeding");
      return;
    }

    const file = fileList[0].originFileObj;
    const reader = new FileReader();

    reader.onload = (event) => {
      const csvText = event.target.result;

      // Parse CSV data
      const lines = csvText.split("\n");
      const headers = lines[0].split(",").map((header) => header.trim());

      const parsedData = lines
        .slice(1)
        .filter((line) => line.trim())
        .map((line, index) => {
          const values = line.split(",").map((value) => value.trim());
          const row = { key: index + 1 };
          headers.forEach((header, i) => {
            row[header.toLowerCase()] = values[i];
          });
          return row;
        });

      onNext({ employeeData: parsedData });
    };

    reader.onerror = (error) => {
      console.error("File reading error:", error);
      message.error("Failed to read CSV file");
    };

    reader.readAsText(file);
  };

  return (
    <>
      <Title
        className="responsive-title"
        style={{
          color: "white",
          marginBottom: "30px",
          fontSize: "24px",
          fontWeight: "500",
        }}
      >
        Employee details
      </Title>

      <div style={{ marginBottom: "30px", backgroundColor: "#191A20" }}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined style={{ color: "white" }} />
          </p>
          <p
            className="ant-upload-text"
            style={{ color: "white", fontSize: "16px", fontWeight: "500" }}
          >
            Drop your CSV file here, or{" "}
            <span style={{ color: "#00D885", textDecoration: "underline" }}>
              click to browse
            </span>
          </p>
        </Dragger>
      </div>

      <div style={{ textAlign: "center", marginBottom: "42px" }}>
        <a
          href="/template.csv"
          download
          style={{ color: "white", textDecoration: "underline" }}
        >
          Download our CSV template
        </a>
      </div>

      <div className="button-container">
        <Button onClick={onPrevious} className="previous-button">
          Previous
        </Button>
        <Button type="primary" className="next-button" onClick={handlePreview}>
          Preview
        </Button>
      </div>
    </>
  );
};

const SuccessStep = ({ onReset }) => {
  const navigate = useNavigate();

  const handleOkayClick = () => {
    navigate("/", { state: { showTerms: true } });
  };

  return (
    <>
      <div className="success-container">
        <div className="success-icon">✓</div>
        <Title level={3} style={{ color: "white" }}>
          Get ready to begin your company's well-being journey with Neure.
        </Title>
        <Text style={{ color: "white" }}>
          Our team will review your details and activate your access within the
          next 24 hours. Keep an eye on your inbox for a confirmation email.
        </Text>
        <div className="button-container" style={{ marginTop: "24px" }}>
          <Button className="Submit-another-response" onClick={onReset}>
            Submit Another
          </Button>
          <Button className="okay-button" onClick={handleOkayClick}>
            Okay
          </Button>
        </div>
        <Text className="contact-info">
          <p style={{ color: "GrayText" }}>
            If you have any questions, don't hesitate to contact us at{" "}
          </p>
          <a href="mailto:founder@neure.co.in" style={{ color: "white" }}>
            founder@neure.co.in
          </a>
        </Text>
      </div>
    </>
  );
};

// Main Onboarding Component
const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(() => {
    return parseInt(localStorage.getItem("currentStep")) || 1;
  });
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("formData");
    return savedData ? JSON.parse(savedData) : {};
  });

  const getFormattedCompanyInfo = () => {
    return {
      name: formData.companyName || "",
      employeeCount: formData.companySize || 0,
    };
  };

  const getFormattedContactInfo = () => {
    return {
      fullName: formData.fullName || "",
      department: formData.jobTitle || "",
      email: formData.email || "",
      phoneNumber: formData.phone || "",
    };
  };

  const handleNext = (values) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setCurrentStep((prev) => prev + 1);
  };

  useEffect(() => {
    localStorage.setItem("currentStep", currentStep);
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [currentStep, formData]);

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (values) => {
    try {
      const finalData = { ...formData, ...values };
      const companyId = localStorage.getItem("companyId");
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const userId = userData.id;

      // Split name handling
      let firstName = "",
        lastName = "";
      if (finalData.fullName) {
        const nameParts = finalData.fullName.trim().split(/\s+/);
        firstName = nameParts[0] || "";
        lastName = nameParts.slice(1).join(" ") || "";
      }

      const formattedData = {
        company: {
          id: companyId,
          company_name: finalData.companyName,
          company_size: parseInt(finalData.companySize),
          onboarding_status: 1,
        },
        contact_person: {
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          job_title: finalData.jobTitle,
          email: finalData.email,
          phone: finalData.phone,
        },

        employees: formData.employeeData.map((employee, index) => ({
          id: index + 1,
          first_name: employee['first name'],
          last_name: employee['last name'],
          email: employee.email,
          phone: employee.phone,
          gender: employee.gender,
          dob: employee.dob,
          department: employee.department,
          city: employee.city,
        }))

      };

      console.log("Formatted Data:", formattedData);


      // const response = await updateCompanyInfo(formattedData);

      if (response.status) {
        localStorage.removeItem("formData");
        setCurrentStep(6);
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update company information"
      );
      console.error("Update error:", error);
    }
  };

  const handleReset = () => {
    localStorage.removeItem("formData");
    localStorage.removeItem("currentStep");
    setFormData({});
    setCurrentStep(1);
  };

  return (
    <div className="onboarding-container">
      <div className="logo-container">
        <img src="/neurelogo.png" alt="Neure Logo" className="logo-image" />
        <Title level={1} className="logo-text">
          neure
        </Title>
      </div>

      <Title level={2} className="main-title">
        {currentStep === 4 ? (
          "Preview and confirm before submitting"
        ) : (
          <>
            Welcome to the future of
            <br className="hide-mobile" />
            workplace well-being{" "}
          </>
        )}
      </Title>

      {currentStep === 4 ? (
        <div
          style={{
            width: "90%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "24px",
          }}
        >
          <ConfirmationPage
            companyInfo={getFormattedCompanyInfo()}
            contactPersonInfo={getFormattedContactInfo()}
            employeeData={formData.employeeData || []}
            setCurrentStep={setCurrentStep} 
            onSubmit={handleSubmit} // Add this prop
          />
        </div>
      ) : (
        <div className="login-form-container">
          <div className="bg-radial-gradient"></div>
          <div className="form-content">
            <Text className="step-indicator">STEP {currentStep}/3</Text>
            {currentStep === 1 && (
              <CompanyInfoStep onNext={handleNext} initialValues={formData} />
            )}
            {currentStep === 2 && (
              <ContactInfoStep
                onNext={handleNext}
                onPrevious={handlePrevious}
                initialValues={formData}
              />
            )}
            {currentStep === 3 && (
              <EmployeeDetailsStep
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            )}
            {currentStep === 5 && <SuccessStep onReset={handleReset} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingFlow;
