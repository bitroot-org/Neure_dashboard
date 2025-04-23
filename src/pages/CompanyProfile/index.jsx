import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Typography,
  Slider,
  InputNumber,
  message,
  Spin,
  Radio,
} from "antd";
import "./index.css";
import CustomHeader from "../../components/CustomHeader";
import { updateCompanyInfo, getCompanyById } from "../../services/api";

const { Text } = Typography;

const CompanyHeader = ({
  companyInfo,
  isEditable,
  onEditClick,
  onDomainChange,
}) => (
  <div className="header-container">
    <div className="left-part">
      <Avatar className="company-avatar">
        {companyInfo.company_name.charAt(0).toUpperCase()}
      </Avatar>
      <Text className="company-name">{companyInfo.company_name}</Text>


      {/* <div className="avatar-container">
        <Avatar className="company-avatar">
          {companyInfo.company_name.charAt(0).toUpperCase()}
        </Avatar>
        <button className="avatar-edit-button" onClick={onEditClick}>
          <img src="./editIcon.png" alt="edit" />
        </button>
      </div> */}
      {/* <div className="header-text">
        <Text className="company-name">{companyInfo.company_name}</Text>
        {isEditable ? (
          <input
            className="domain-input"
            value={companyInfo.email_domain}
            onChange={(e) => onDomainChange(e.target.value)}
            placeholder="Enter email domain"
          />
        ) : (
          <Text className="company-email">{companyInfo.email_domain}</Text>
        )}
      </div> */}
    </div>
    <div className="right-part">
      <button className="edit-button" onClick={onEditClick}>
        {isEditable ? "Save" : "Edit"}
      </button>
    </div>
  </div>
);

const CompanyForm = ({ companyInfo, contactInfo, disabled, onChange }) => {
  const [value, setValue] = useState(companyInfo.company_size || 500);

  // Handle slider/input change
  const handleValueChange = (newValue) => {
    if (!disabled) {
      setValue(newValue);
      onChange("company", "company_size", newValue);
    }
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
              onChange={(e) =>
                !disabled && onChange("company", "company_name", e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <label className="input-label">Number of employees*</label>
            <div className="slider-container">
              <Slider
                min={1}
                max={1000}
                value={value}
                onChange={handleValueChange}
                disabled={false}
                tooltip={{ formatter: (val) => `${val} employees` }}
                className="custom-ant-slider"
              />
              <InputNumber
                min={1}
                max={1000}
                value={value}
                onChange={handleValueChange}
                disabled={disabled}
                className="custom-ant-input-number"
                style={{
                  width: 80,
                }}
              />
            </div>
          </div>
        </div>
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
                  const parts = e.target.value.split(" ");
                  const firstName = parts[0] || "";
                  const lastName = parts.slice(1).join(" ") || "";
                  onChange("contact_person", "first_name", firstName);
                  onChange("contact_person", "last_name", lastName);
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
              onChange={(e) =>
                !disabled &&
                onChange("contact_person", "job_title", e.target.value)
              }
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-group">
            <label className="input-label">Email*</label>
            <input
              className="custom-input"
              value={contactInfo.email}
              disabled={true}
              onChange={(e) =>
                !disabled && onChange("contact_person", "email", e.target.value)
              }
            />
          </div>

          <div className="input-group">
            <label className="input-label">Phone number*</label>
            <input
              className="custom-input"
              value={contactInfo.phone}
              disabled={disabled}
              onChange={(e) =>
                !disabled && onChange("contact_person", "phone", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CompanyHeaderShimmer = () => (
  <div className="header-container">
    <div className="left-part">
      <div className="company-avatar shimmer"></div>
      <div className="shimmer-text">
        <div className="company-name-shimmer shimmer"></div>
      </div>
    </div>
    <div className="right-part">
      <div className="edit-button-shimmer shimmer"></div>
    </div>
  </div>
);

const CompanyFormShimmer = () => (
  <div className="form-container">
    <div className="form-section">
      <div className="section-title-shimmer shimmer"></div>
      <div className="form-group">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="input-group">
            <div className="label-shimmer shimmer"></div>
            <div className="input-shimmer shimmer"></div>
          </div>
        ))}
      </div>
    </div>
    <div className="form-section">
      <div className="section-title-shimmer shimmer"></div>
      <div className="form-group">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="input-group">
            <div className="label-shimmer shimmer"></div>
            <div className="input-shimmer shimmer"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CompanyProfile = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    company: {},
    contact_person: {},
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
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleDomainChange = (value) => {
    handleInputChange("company", "email_domain", value);
  };

  const handleSubmit = async () => {
    try {
      console.log("Form Data:", formData);
      setLoading(true);
      const response = await updateCompanyInfo(formData);
      if (response.status) {
        message.success("Company information updated successfully");
        setIsEditable(false);
      }
    } catch (error) {
      message.error("Failed to update company information");
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
      <CustomHeader title="Account details" showBackButton={true} />

      {loading ? (
        <>
          <CompanyHeaderShimmer />
          <CompanyFormShimmer />
        </>
      ) : (
        <>
          <CompanyHeader
            companyInfo={formData?.company}
            isEditable={isEditable}
            onEditClick={handleEditSave}
            onDomainChange={handleDomainChange}
          />
          <CompanyForm
            companyInfo={formData?.company}
            contactInfo={formData?.contact_person}
            disabled={!isEditable}
            onChange={handleInputChange}
            onDomainChange={handleDomainChange}
          />
        </>
      )}
    </div>
  );
};

export default CompanyProfile;
