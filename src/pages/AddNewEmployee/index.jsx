import React, { useState } from "react";
import CustomHeader from "../../components/CustomHeader";
import { UploadOutlined } from "@ant-design/icons";
import "./addNewEmployee.css";

const AddNewEmployee = () => {
  // Employee type: "single" or "bulk"
  const [employeeType, setEmployeeType] = useState("single");

  // Form state for single employee
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    gender: "",
    age: "",
    department: "",
    city: "",
  });

  const onTypeChange = (type) => {
    setEmployeeType(type);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Form Values:", formData);
    // Further processing for single employee...
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log("Uploaded file:", file);
    // Further processing...
  };

  const handleBulkUploadSubmit = () => {
    // Implement your bulk upload submit logic here
    console.log("Bulk upload submit clicked");
  };

  return (
    <div className="add-employee-dashboard">
      <CustomHeader title="Add New Employee" />
      <div className="form-container">
        {/* Section 1: Type */}
        <div className="type-section">
          <h3 className="section-title">Type</h3>
          <div className="type-buttons">
            <button
              className={`type-btn ${employeeType === "single" ? "active" : ""}`}
              onClick={() => onTypeChange("single")}
              type="button"
            >
              Single Employee
            </button>
            <button
              className={`type-btn ${employeeType === "bulk" ? "active" : ""}`}
              onClick={() => onTypeChange("bulk")}
              type="button"
            >
              Bulk Upload (CSV)
            </button>
          </div>
        </div>
        {/* Divider */}
        <div className="custom-divider"></div>
        {/* Section 2: Conditional Content */}
        {employeeType === "single" ? (
          <form onSubmit={onSubmit}>
            {/* Row 1: First Name & Last Name */}
            <div className="form-row">
              <div className="form-item">
                <label htmlFor="firstName">First Name*</label>
                <input
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-item">
                <label htmlFor="lastName">Last Name*</label>
                <input
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* Row 2: Email & Contact */}
            <div className="form-row">
              <div className="form-item">
                <label htmlFor="email">Email*</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-item">
                <label htmlFor="contact">Contact*</label>
                <input
                  id="contact"
                  name="contact"
                  placeholder="Contact Number"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* Row 3: Gender & Age */}
            <div className="form-row">
              <div className="form-item">
                <label htmlFor="gender">Gender*</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-item">
                <label htmlFor="age">Age*</label>
                <input
                  id="age"
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* Row 4: Department & City */}
            <div className="form-row">
              <div className="form-item">
                <label htmlFor="department">Department*</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Department
                  </option>
                  <option value="engineering">Engineering</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="hr">HR</option>
                </select>
              </div>
              <div className="form-item">
                <label htmlFor="city">City*</label>
                <input
                  id="city"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="custom-divider"></div>
            <div className="submit-container">
              <button className="submit-btn" type="submit">
                Confirm
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="bulk-upload-container">
            <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="fileInput"
              />
              <UploadOutlined
                className="upload-icon"
                onClick={() => document.getElementById("fileInput").click()}
              />
              <p className="upload-instructions">
                Drop your CSV file here , or <span>click to browse</span>
              </p>

            </div>
            <div className="custom-divider"></div>
            <div className="submit-container">
              <button className="submit-btn" type="submit">
                Confirm
              </button>
            </div>
          </div>

        )}
      </div>
    </div>
  );
};

export default AddNewEmployee;