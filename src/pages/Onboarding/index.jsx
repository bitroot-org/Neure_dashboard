import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Typography,
  Radio,
  Checkbox,
  Row,
  Col,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./index.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Step 1: Company Info Component
const CompanyInfoStep = ({ onNext, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  const companySizes = [
    { label: "10-50", value: "10-50" },
    { label: "51-200", value: "51-200" },
    { label: "201-500", value: "201-500" },
    { label: "500+", value: "500+" },
  ];

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
          <Input placeholder="e.g. swagpro" className="custom-input" />
        </Form.Item>

        <Form.Item
          name="industry"
          label={<Text className="form-label">Industry*</Text>}
          rules={[{ required: true, message: "Please select industry" }]}
        >
          <Select
            placeholder="Select"
            className="custom-select"
            dropdownStyle={{
              background: "#191A20",
            }}
          >
            <Select.Option value="tech">Technology</Select.Option>
            <Select.Option value="health">Healthcare</Select.Option>
            <Select.Option value="finance">Finance</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="companySize"
          label={
            <Text className="form-label">Company size (no. of employees)*</Text>
          }
          rules={[{ required: true, message: "Please select company size" }]}
        >
          <Radio.Group className="company-size-group">
            <Row gutter={[8, 8]}>
              {companySizes.map((size) => (
                <Col xs={12} sm={6} key={size.value}>
                  <Radio.Button
                    value={size.value}
                    className="company-size-button"
                  >
                    {size.label}
                  </Radio.Button>
                </Col>
              ))}
            </Row>
          </Radio.Group>
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
        Contact person Info
      </Title>
      <Form form={form} layout="vertical" onFinish={onNext}>
        <Form.Item
          name="fullName"
          label={<Text className="form-label">Full name*</Text>}
          rules={[{ required: true, message: "Please enter full name" }]}
        >
          <Input placeholder="e.g. Raj Rao" className="custom-input" />
        </Form.Item>

        <Form.Item
          name="jobTitle"
          label={<Text className="form-label">Job title*</Text>}
          rules={[{ required: true, message: "Please enter job title" }]}
        >
          <Input placeholder="e.g. Manager or CEO" className="custom-input" />
        </Form.Item>

        <Form.Item
          name="email"
          label={<Text className="form-label">Email*</Text>}
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter valid email" },
          ]}
        >
          <Input placeholder="e.g. ajit@swagpro.in" className="custom-input" />
        </Form.Item>

        <Form.Item
          name="phone"
          label={<Text className="form-label">Phone number*</Text>}
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input placeholder="e.g. +91 9876543210" className="custom-input" />
        </Form.Item>

        <Form.Item>
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
const ServiceInterestsStep = ({ onNext, onPrevious, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);
  
  const services = [
    "Workshops & Webinars",
    "Well-being metrics & analytics",
    "Rewards & recognition",
    "Custom solutions",
    "Other",
  ];

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
        Service interests
      </Title>
      <Form form={form} layout="vertical" onFinish={onNext}>
        <Form.Item
          name="services"
          label={
            <Text className="form-label">
              Choose the services you need assistance with
            </Text>
          }
          rules={[
            { required: true, message: "Please select at least one service" },
          ]}
        >
          <Checkbox.Group style={{ width: "100%" }}>
            <Row gutter={[16, 16]}>
              {services.map((service) => (
                <Col xs={24} sm={12} key={service}>
                  <div className="service-checkbox-wrapper">
                    <Checkbox value={service} className="service-checkbox">
                      {service}
                    </Checkbox>
                  </div>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item>
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

// Step 4: Additional Info Component
const AdditionalInfoStep = ({ onPrevious, onSubmit }) => {
  const [form] = Form.useForm();

  return (
    <>
      <Title
        level={2}
        className="responsive-title "
        style={{
          color: "white",
          marginBottom: "30px",
          fontWeight: "350",
        }}
      >
        Additional Info
      </Title>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="additionalInfo"
          label={
            <Text className="form-label">Tell us more about your company*</Text>
          }
          rules={[
            {
              required: true,
              message: "Please provide additional information",
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="e.g. Tell us about your company"
            className="custom-textarea custom-input"
          />
        </Form.Item>

        <Form.Item>
          <div className="button-container">
            <Button
              onClick={onPrevious}
              icon={<ArrowLeftOutlined />}
              className="previous-button"
            >
              Previous
            </Button>
            <Button type="primary" htmlType="submit" className="submit-button">
              Submit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

const SuccessStep = ({ onReset }) => {
  return (
    <div className="success-container">
      <div className="success-icon">✓</div>
      <Title level={3} style={{ color: "white" }}>
        Thank you for your submission
      </Title>
      <Text className="success-text">
        Our team will review your information and reach out to you within the
        next 48 hours to discuss your needs and how we can support your
        company's mental well-being initiatives.
      </Text>
      <div className="button-container">
        <Button className="Submit-another-response" onClick={onReset}>
          Submit Another
        </Button>
        <Button
          style={{
            width: "100%",
            height: "48px",
            background: "#ffffff",
            borderRadius: "20px",
            color: "black",
          }}
          className="okay-button"
        >
          Okay
        </Button>
      </div>
      <Text className="contact-info">
        If you have any questions, don't hesitate to contact us at{" "}
        <a href="mailto:founder@neure.co.in" style={{ color: "white" }}>
          founder@neure.co.in
        </a>
      </Text>
    </div>
  );
};

// Main Onboarding Component
const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(() => {
    return parseInt(localStorage.getItem("currentStep")) || 1;
  });
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('formData');
    return savedData ? JSON.parse(savedData) : {};
  });
  
  const handleNext = (values) => {
    setFormData((prev) => ({ ...prev, ...values }));
    setCurrentStep((prev) => prev + 1);
  };

  useEffect(() => {
    localStorage.setItem('currentStep', currentStep);
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [currentStep, formData]);

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (values) => {
    const finalData = { ...formData, ...values };
    setFormData(finalData);
    console.log("Final Data:", finalData);
    localStorage.removeItem('formData');
    setCurrentStep(5);
  };

  const handleReset = () => {
    localStorage.removeItem('formData');
    localStorage.removeItem('currentStep');
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
        Get Early Access to Neure's Tailored
        <br className="hide-mobile" />
        Well-being Solutions
      </Title>

      <div className="form-container">
        <div className="bg-radial-gradient"></div>
        <div className="form-content">
          {currentStep !== 5 && (
            <Text className="step-indicator">STEP {currentStep}/4</Text>
          )}
          {currentStep === 1 && <CompanyInfoStep onNext={handleNext} initialValues={formData}/>}
          {currentStep === 2 && (
            <ContactInfoStep onNext={handleNext} onPrevious={handlePrevious}
            initialValues={formData}
            />
          )}
          {currentStep === 3 && (
            <ServiceInterestsStep
              onNext={handleNext}
              onPrevious={handlePrevious}
              initialValues={formData}
            />
          )}
          {currentStep === 4 && (
            <AdditionalInfoStep
              onSubmit={handleSubmit}
              onPrevious={handlePrevious}
              initialValues={formData}

            />
          )}
          {currentStep === 5 && <SuccessStep onReset={handleReset} />}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
