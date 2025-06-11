import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Typography,
  message,
  Spin,
  Upload,
} from "antd";
import { CameraOutlined } from "@ant-design/icons";
import "./index.css";
import CustomHeader from "../../components/CustomHeader";
import { updateCompanyInfo, getCompanyById } from "../../services/api";
import { CompanyDataContext } from "../../context/CompanyContext";

const { Text } = Typography;

// Company Header Component
const CompanyHeader = ({ companyInfo, isEditable, onEditClick, onDomainChange, onImageUpload, previewLogoUrl }) => (
  <div className="header-container">
    <div className="left-part">
      <div className="avatar-container">
        <div className="avatar-circle">
          {previewLogoUrl ? (
            <img 
              src={previewLogoUrl} 
              alt="Company Logo Preview" 
              className="company-logo"
            />
          ) : companyInfo?.company_profile_url ? (
            <img 
              src={companyInfo.company_profile_url} 
              alt="Company Logo" 
              className="company-logo"
            />
          ) : (
            <div className="company-initial">
              {companyInfo?.company_name ? companyInfo.company_name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </div>
        
        {isEditable && (
          <Upload
            name="logo"
            showUploadList={false}
            beforeUpload={(file) => {
              onImageUpload(file);
              return false; // Prevent default upload behavior
            }}
          >
            <button className="avatar-edit-button">
              <CameraOutlined />
            </button>
          </Upload>
        )}
      </div>
      <Text className="company-name">{companyInfo?.company_name || 'Company'}</Text>
    </div>
    <div className="right-part">
      <button className="edit-button" onClick={onEditClick}>
        {isEditable ? "Save" : "Edit"}
      </button>
    </div>
  </div>
);

// Company Form Component
const CompanyForm = ({ companyInfo, contactInfo, disabled, onChange }) => {
  const [employeeCount, setEmployeeCount] = useState(companyInfo?.company_size || 0);

  const handleEmployeeCountChange = (e) => {
    if (!disabled) {
      let newValue = parseInt(e.target.value, 10);
      
      if (isNaN(newValue)) {
        newValue = 0;
      } else if (newValue < 0) {
        newValue = 0;
      }
      
      setEmployeeCount(newValue);
      onChange("company", "company_size", newValue);
    }
  };

  return (
    <div className="form-container">
      {/* Company Info Section */}
      <div className="form-section">
        <h3 className="section-title">Company info</h3>
        <div className="form-group">
          <div className="input-group">
            <label className="input-label">Company name*</label>
            <input
              className="custom-input"
              value={companyInfo?.company_name || ''}
              disabled={disabled}
              readOnly={disabled}
              onChange={(e) => !disabled && onChange("company", "company_name", e.target.value)}
              style={{ 
                cursor: disabled ? 'not-allowed' : 'text',
                pointerEvents: disabled ? 'none' : 'auto'
              }}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Number of employees*</label>
            <input
              type="number"
              min="0"
              className="custom-input"
              value={employeeCount}
              disabled={disabled}
              readOnly={disabled}
              onChange={handleEmployeeCountChange}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e') {
                  e.preventDefault();
                }
              }}
              style={{ 
                cursor: disabled ? 'not-allowed' : 'text',
                pointerEvents: disabled ? 'none' : 'auto'
              }}
            />
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* Contact Person Section */}
      <div className="form-section">
        <h3 className="section-title">Contact person Info</h3>
        <div className="form-group">
          <div className="input-group">
            <label className="input-label">Full name*</label>
            <input
              className="custom-input"
              value={`${contactInfo?.first_name || ''} ${contactInfo?.last_name || ''}`}
              disabled={disabled}
              readOnly={disabled}
              onChange={(e) => {
                if (!disabled) {
                  const parts = e.target.value.split(" ");
                  const firstName = parts[0] || "";
                  const lastName = parts.slice(1).join(" ") || "";
                  onChange("contact_person", "first_name", firstName);
                  onChange("contact_person", "last_name", lastName);
                }
              }}
              style={{ 
                cursor: disabled ? 'not-allowed' : 'text',
                pointerEvents: disabled ? 'none' : 'auto'
              }}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Job title*</label>
            <input
              className="custom-input"
              value={contactInfo?.job_title || ''}
              disabled={disabled}
              readOnly={disabled}
              onChange={(e) => !disabled && onChange("contact_person", "job_title", e.target.value)}
              style={{ 
                cursor: disabled ? 'not-allowed' : 'text',
                pointerEvents: disabled ? 'none' : 'auto'
              }}
            />
          </div>
        </div>
        <div className="form-group">
          <div className="input-group">
            <label className="input-label">Email*</label>
            <input
              className="custom-input"
              value={contactInfo?.email || ''}
              disabled={true}
              readOnly={true}
              style={{ cursor: 'not-allowed', pointerEvents: 'none' }}
              onChange={(e) => !disabled && onChange("contact_person", "email", e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Phone number*</label>
            <input
              className="custom-input"
              value={contactInfo?.phone || ''}
              disabled={disabled}
              readOnly={disabled}
              onChange={(e) => !disabled && onChange("contact_person", "phone", e.target.value)}
              style={{ 
                cursor: disabled ? 'not-allowed' : 'text',
                pointerEvents: disabled ? 'none' : 'auto'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Shimmer Components
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

// Main CompanyProfile Component
const CompanyProfile = () => {
  // Add CompanyDataContext
  const { refreshCompanyData } = useContext(CompanyDataContext);
  
  // State variables
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    company: {},
    contact_person: {},
  });
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedLogoFile, setUploadedLogoFile] = useState(null);
  const [previewLogoUrl, setPreviewLogoUrl] = useState(null);

  // Fetch company data on component mount
  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const response = await getCompanyById(companyId);
        
        // Check if response has the nested data structure
        if (response.status && response.data) {
          // Handle nested data structure
          const companyData = response.data.data || response.data;
          setCompany(companyData);
          setFormData(companyData); // Initialize form data
          console.log("Processed company data:", companyData);
        }
      } catch (err) {
        console.error("Error fetching company data:", err);
        setError("Error fetching company data");
      } finally {
        setLoading(false);
      }
    };
    
    if (companyId) {
      fetchCompanyData();
    } else {
      setError("Company ID not found");
      setLoading(false);
    }
  }, []);

  // Handle image upload
  const handleImageUpload = (file) => {
    // Check file type and size
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG files!');
      return false;
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }
    
    // Store the file in state
    setUploadedLogoFile(file);
    
    // Create a preview URL
    const previewURL = URL.createObjectURL(file);
    setPreviewLogoUrl(previewURL);
    
    // Show success message
    message.success('Logo selected. Click Save to apply changes.');
    
    return false; // Prevent default upload behavior
  };

  // Handle form input changes
  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Handle domain change
  const handleDomainChange = (value) => {
    handleInputChange("company", "email_domain", value);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      console.log("Form Data:", formData);
      setLoading(true);
      
      // Create FormData for submission
      const formDataToSend = new FormData();
      
      // Add company ID
      const companyId = localStorage.getItem("companyId");
      formDataToSend.append('companyId', companyId);
      
      // Add company data fields directly (not as JSON)
      formDataToSend.append('companyName', formData.company?.company_name || '');
      formDataToSend.append('companySize', formData.company?.company_size || '');
      
      // Add contact person data fields
      formDataToSend.append('contactPerson[id]', formData.contact_person?.id || '');
      formDataToSend.append('contactPerson[firstName]', formData.contact_person?.first_name || '');
      formDataToSend.append('contactPerson[lastName]', formData.contact_person?.last_name || '');
      formDataToSend.append('contactPerson[email]', formData.contact_person?.email || '');
      formDataToSend.append('contactPerson[phone]', formData.contact_person?.phone || '');
      formDataToSend.append('contactPerson[jobTitle]', formData.contact_person?.job_title || '');
      
      // Add the logo file if one was uploaded (as is)
      if (uploadedLogoFile) {
        formDataToSend.append('file', uploadedLogoFile);
      }
      
      // Call the API with FormData
      const response = await updateCompanyInfo(formDataToSend);
      
      if (response.status) {
        message.success("Company information updated successfully");
        
        // Reset the uploaded file state
        setUploadedLogoFile(null);
        setPreviewLogoUrl(null);
        
        // Refresh company data in context
        await refreshCompanyData();
        
        // Refresh company data
        const refreshResponse = await getCompanyById(companyId);
        if (refreshResponse.status && refreshResponse.data) {
          const refreshedData = refreshResponse.data.data || refreshResponse.data;
          setFormData(refreshedData);
        }
        
        setIsEditable(false);
      } else {
        throw new Error(response.message || "Failed to update company information");
      }
    } catch (error) {
      console.error("Error updating company information:", error);
      message.error(error.message || "Failed to update company information");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit/save button click
  const handleEditSave = async () => {
    if (isEditable) {
      // Save functionality
      await handleSubmit();
    } else {
      // Edit functionality
      setIsEditable(true);
    }
  };

  // Render component
  return (
    <div className="profile-container">
      <CustomHeader title="Account details" showBackButton={true} />

      {loading ? (
        // Show loading shimmer when data is being fetched
        <>
          <CompanyHeaderShimmer />
          <CompanyFormShimmer />
        </>
      ) : (
        // Show actual content when data is loaded
        <>
          <CompanyHeader
            companyInfo={formData?.company}
            isEditable={isEditable}
            onEditClick={handleEditSave}
            onDomainChange={handleDomainChange}
            onImageUpload={handleImageUpload}
            previewLogoUrl={previewLogoUrl}
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
