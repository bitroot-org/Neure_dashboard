import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Typography, Select, Input, message, Spin, Radio, Slider, InputNumber } from "antd";
import { getCompanyById } from "../../services/api";
import "./index.css";
import CustomHeader from "../../components/CustomHeader";
import { updateCompanyInfo } from "../../services/api";

const { Text } = Typography;

const CompanyHeader = ({ companyInfo, isEditable, onEditClick }) => (
  <div className="header-container">
    <div className="left-part">
      <div className="avatar-container">
        <Avatar className="company-avatar">{companyInfo.company_name.charAt(0).toUpperCase()}</Avatar>
        <button
          className="avatar-edit-button"
          onClick={onEditClick}
        >
          <img src="./editIcon.png" alt="edit" />
        </button>
      </div>
      <div className="header-text">
        <Text className="company-name">{companyInfo.company_name}</Text>
        <Text className="company-email">{companyInfo.email_domain}</Text>
      </div>
    </div>
    <div className="right-part">
      <button
        className="edit-button"
        onClick={onEditClick}
      >
        {isEditable ? 'Save' : 'Edit'}
      </button>
    </div>
  </div>
);

const CompanyForm = ({ companyInfo, contactInfo, disabled, onChange }) => {
  const [value, setValue] = useState(companyInfo.company_size || 500);

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
        <h3 className="section-title">Company info</h3>

        <div className="form-group">
          <div className="input-group">
            <label className="input-label">Company name*</label>
            <input
              className="custom-input"
              value={companyInfo.company_name}
              disabled={disabled}
              onChange={(e) => !disabled && onChange('company', 'company_name', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Number of employees*</label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-10%)",
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
                  onChange={(e) => !disabled && setValue(e.target.value)}
                  disabled={disabled}
                  style={{
                    width: "100%",
                    appearance: "none",
                    background: "transparent",
                    cursor: "pointer",
                    position: "relative",
                    zIndex: 2,
                    opacity: disabled ? 0.5 : 1,
                  }}
                  className="custom-slider"
                />
              </div>
              <input
                type="number"
                min="1"
                max="10000"
                value={value}
                onChange={(e) => !disabled && setValue(e.target.value)}
                style={{
                  backgroundColor: "#191A20",
                  borderRadius: "12px",
                  border: "2px solid rgba(255, 255, 255, 0.1)",
                  padding: "8px 12px",
                  width: "80px",
                  color: "white",
                  fontSize: "16px",
                  outline: "none",
                  textAlign: "center",
                  cursor: disabled ? "not-allowed" : "text",
                  opacity: disabled ? 0.5 : 1,
                }}
              />
            </div>
          </div>

        </div>

        {/* <div className="input-group">
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
        </div> */}
      </div>

      <div className="divider" />

      <div className="form-section">
        <h3 className="section-title">Contact person Info</h3>

        <div className="form-group">
          <div className="input-group">
            <label className="input-label">Full name*</label>
            <input
              className="custom-input"
              value={contactInfo.first_name + " " + contactInfo.last_name}
              disabled={disabled}
              onChange={(e) => {
                if (!disabled) {
                  const [firstName, lastName] = e.target.value.split(' ');
                  onChange('contact_person', 'first_name', firstName);
                  onChange('contact_person', 'last_name', lastName);
                }
              }}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Job title*</label>
            <input
              className="custom-input"
              value={contactInfo.job_title}
              disabled={disabled}
              onChange={(e) => !disabled && onChange('contact_person', 'job_title', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-group">
            <label className="input-label">Email*</label>
            <input
              className="custom-input"
              value={contactInfo.email}
              disabled={disabled}
              onChange={(e) => !disabled && onChange('contact_person', 'email', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Phone number*</label>
            <input
              className="custom-input"
              value={contactInfo.phone}
              disabled={disabled}
              onChange={(e) => !disabled && onChange('contact_person', 'phone', e.target.value)}
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
    const companyId = localStorage.getItem("companyId");
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const response = await getCompanyById(companyId);
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
      setLoading(true);
      const response = await updateCompanyInfo(formData);
      if (response.status) {
        message.success('Company information updated successfully');
        setIsEditable(false);
      }
    } catch (error) {
      message.error('Failed to update company information');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (isEditable) {
      // Save functionality
      await handleSubmit();
    } else {
      // Edit functionality
      setIsEditable(true);
    }
  };

  return (
    <div className="profile-container">
      <CustomHeader
        title="Account details"
        showBackButton={true}
      />

      {!loading && (
        <>
          <CompanyHeader
            companyInfo={formData?.company}
            isEditable={isEditable}
            onEditClick={handleEditSave}
          />
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
