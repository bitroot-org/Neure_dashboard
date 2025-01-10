import React, { useState } from 'react';
import { Avatar, Typography, Select, Input, Button, Space, DatePicker } from 'antd';
import './index.css';
import CustomHeader from '../../components/CustomHeader';

const { Text } = Typography;

const dummyData = {
  company: {
    name: "Swagpro",
    email: "ajit@swagpro.in",
    info: {
      companyName: "Swagpro pvt. ltd",
      industry: "Technology",
      size: "10-50"
    }
  },
  contact: {
    fullName: "Ajit Rao",
    jobTitle: "General manager",
    email: "ajit@swagpro.in",
    phone: "+91 9876543210"
  }
};

const CompanyHeader = ({ company }) => (
  <div className="header-container">
    <Avatar className="company-avatar">
      {company.name[0]}
    </Avatar>
    <div className="header-text">
      <Text className="company-name">{company.name}</Text>
      <Text className="company-email">{company.email}</Text>
    </div>
  </div>
);

const CompanyForm = ({ companyInfo, contactInfo, disabled }) => {
  const sizeOptions = ["10-50", "51-200", "201-500", "500+"];

  return (
    <div className="form-container">
      <div className="form-section">
        <Text className="section-title">Company info</Text>
        
        <div className="form-group">
          <div className="input-group">
            <label className="input-label">Company name*</label>
            <Input 
              className="custom-input"
              value={companyInfo.companyName}
              disabled={disabled}
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">Industry*</label>
            <Select
              className="custom-select"
              value={companyInfo.industry}
              suffixIcon={<span className="select-arrow">▼</span>}
              disabled={disabled}
            >
              <Select.Option value="Technology">Technology</Select.Option>
            </Select>
          </div>
        </div>

        <div className="size-section">
          <label className="input-label">Company size (no. of employees)*</label>
          <div className="size-buttons">
            {sizeOptions.map((size) => (
              <button 
                key={size}
                className={`size-btn ${size === companyInfo.size ? 'active' : ''}`}
                disabled={disabled}
              >
                {size}
              </button>
            ))}
          </div>
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
              value={contactInfo.fullName}
              disabled={disabled}
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">Job title*</label>
            <Input 
              className="custom-input"
              value={contactInfo.jobTitle}
              disabled={disabled}
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
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">Phone number*</label>
            <Input 
              className="custom-input"
              value={contactInfo.phone}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CompanyProfile = () => {
  const [isEditable, setIsEditable] = useState(false);

  const handleEditClick = () => {
    setIsEditable(!isEditable);
  };

  return (
    <div className="profile-container">
      <CustomHeader 
        title="Dashboard"
        showBackButton={true}
        showEditButton={true}
        showFilterButton={false}
        onEditClick={handleEditClick}
        defaultFilterValue="Monthly"
        buttonText={isEditable ? "Save" : "Edit"}
      />
      <CompanyHeader company={dummyData.company} />
      <CompanyForm 
        companyInfo={dummyData.company.info}
        contactInfo={dummyData.contact}
        disabled={!isEditable}
      />
    </div>
  );
};

export default CompanyProfile;