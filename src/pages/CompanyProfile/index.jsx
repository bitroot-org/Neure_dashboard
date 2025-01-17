import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Typography, Select, Input, message, Spin, Radio } from "antd";
import { getCompanyById } from "../../services/api";
import "./index.css";
import CustomHeader from "../../components/CustomHeader";

const { Text } = Typography;

const CompanyHeader = ({ companyInfo }) => (
  <div className="header-container">
    <Avatar className="company-avatar">{companyInfo.company_name.charAt(0).toUpperCase()}</Avatar>
    <div className="header-text">
      <Text className="company-name">{companyInfo.company_name}</Text>
      <Text className="company-email">{companyInfo.email_domain}</Text>
    </div>
  </div>
);

const CompanyForm = ({ companyInfo, contactInfo, disabled, onChange }) => {
  const sizeOptions = ["10-50", "51-200", "201-500", "500+"];

  const getSizeRange = (size) => {
    if (!size) return "10-50";
    if (size <= 50) return "10-50";
    if (size <= 200) return "51-200";
    if (size <= 500) return "201-500";
    return "500+";
  };

  const handleSizeChange = (value) => {
    const sizeMap = {
      "10-50": 50,
      "51-200": 200,
      "201-500": 500,
      "500+": 1000
    };
    onChange('company', 'company_size', sizeMap[value]);
  };

  return (
    <div className="form-container">
      
      <div className="form-section">
        <Text className="section-title">Company info</Text>

        <div className="form-group">
          <div className="input-group">
            <label className="input-label">Company name*</label>
            <Input
              className="custom-input"
              value={companyInfo.company_name}
              disabled={disabled}
              onChange={(e) => onChange('company', 'company_name', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Industry*</label>
            <Select
              className="custom-select"
              value={companyInfo.industry}
              suffixIcon={<span className="select-arrow">▼</span>}
              disabled={disabled}
              onChange={(value) => onChange('company', 'industry', value)}
            >
              <Select.Option value="Technology">Technology</Select.Option>
            </Select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Company size*</label>
          <Radio.Group
            className="size-radio-group"
            value={getSizeRange(companyInfo.company_size)}
            disabled={disabled}
            onChange={(e) => handleSizeChange(e.target.value)}
          >
            {sizeOptions.map(size => (
              <Radio.Button key={size} value={size}>
                {size}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
      </div>

      <div className="divider" />

      <div className="form-section">
        <Text className="section-title">Contact person Info</Text>

        <div className="form-group">
          <div className="input-group">
            <label className="input-label">Full name*</label>
            <Input
              className="custom-input"
              value={contactInfo.first_name + " " + contactInfo.last_name}
              disabled={disabled}
              onChange={(e) => {
                const [firstName, lastName] = e.target.value.split(' ');
                onChange('contact_person', 'first_name', firstName);
                onChange('contact_person', 'last_name', lastName);
              }}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Job title*</label>
            <Input
              className="custom-input"
              value={contactInfo.job_title}
              disabled={disabled}
              onChange={(e) => onChange('contact_person', 'job_title', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-group">
            <label className="input-label">Email*</label>
            <Input
              className="custom-input"
              value={contactInfo.email}
              disabled={disabled}
              onChange={(e) => onChange('contact_person', 'email', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Phone number*</label>
            <Input
              className="custom-input"
              value={contactInfo.phone}
              disabled={disabled}
              onChange={(e) => onChange('contact_person', 'phone', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CompanyProfile = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    company: {},
    contact_person: {}
  });
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const response = await getCompanyById(1);
        if (response.status) {
          setCompany(response.data);
          setFormData(response.data); // Initialize form data
        }
      } catch (err) {
        setError("Error fetching company data");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, [companyId]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log('Form Data:', formData);
      setIsEditable(false);
      setCompany(formData);
    } catch (error) {
      message.error('Failed to update company details');
    }
  };

  return (
    <div className="profile-container">
      <CustomHeader 
        title="Company Profile"
        showBackButton={true}
        showEditButton={true}
        onEditClick={() => {
          if (isEditable) {
            handleSubmit();
          } else {
            setIsEditable(true);
          }
        }}
        buttonText={isEditable ? "Save" : "Edit"}
      />
      
      {!loading && (
        <>
        <CompanyHeader companyInfo={formData?.company} />
        <CompanyForm 
          companyInfo={formData?.company}
          contactInfo={formData?.contact_person}
          disabled={!isEditable}
          onChange={handleInputChange}
        />
        </>
      )}
    </div>
  );
};

export default CompanyProfile;
