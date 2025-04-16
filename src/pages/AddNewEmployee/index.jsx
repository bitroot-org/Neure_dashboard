import React, { useState, useEffect } from "react";
import CustomHeader from "../../components/CustomHeader";
import { UploadOutlined } from "@ant-design/icons";
import { message, Spin, DatePicker, ConfigProvider } from "antd"; // Added Spin for loading state
import "./addNewEmployee.css";
import { createEmployee, getDepartments } from "../../services/api";
import moment from "moment"; // Import moment for date handling

const AddNewEmployee = () => {
  // Employee type: "single" or "bulk"
  const [employeeType, setEmployeeType] = useState("single");
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [fetchingDepartments, setFetchingDepartments] = useState(true);

  // Form state for single employee
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    gender: "",
    dateOfBirth: null, // Changed from age to dateOfBirth
    department: "",
    city: "",
  });

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setFetchingDepartments(true);
        const response = await getDepartments();
        if (response.status) {
          setDepartments(response.data);
        } else {
          message.error("Failed to fetch departments");
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        message.error("Failed to load departments");
      } finally {
        setFetchingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

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

  // Handle date picker change
  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: date ? date.format("YYYY-MM-DD") : null,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get company_id from localStorage or another source
      const companyId = localStorage.getItem("companyId");

      // Map form data to API structure
      const employeeData = {
        company_id: companyId,
        email: formData.email,
        phone: formData.contact,
        username: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`,
        first_name: formData.firstName,
        last_name: formData.lastName,
        gender: formData.gender,
        date_of_birth: formData.dateOfBirth, // Use date of birth instead of age
        job_title: "",
        department_id: parseInt(formData.department),
        city: formData.city,
      };

      const response = await createEmployee(employeeData);

      message.success("Employee added successfully!");
      console.log("API Response:", response);

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        gender: "",
        dateOfBirth: null, // Reset date of birth
        department: "",
        city: "",
      });
    } catch (error) {
      console.error("Error adding employee:", error);
      message.error("Failed to add employee. Please try again.");
    } finally {
      setLoading(false);
    }
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
              className={`type-btn ${
                employeeType === "single" ? "active" : ""
              }`}
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
            {/* Row 3: Gender & Date of Birth (replacing Age) */}
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
                <label htmlFor="dateOfBirth">Date of Birth*</label>
                <ConfigProvider
                  theme={{
                    components: {
                      DatePicker: {
                        colorBgContainer: "#191A20", 
                        colorBgElevated: "#191A20",     
                        colorText: "#fff",
                        colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
                        colorBgContainer: "transparent",
                        colorBorder: "rgba(255, 255, 255, 0.1)",
                        borderRadius: 12,
                      },
                    },
                  }}
                >
                  <DatePicker
                    id="dateOfBirth"
                    style={{
                      width: "100%",
                      height: "48px",
                    }}
                    className="custom-datepicker"
                    placeholder="Select Date of Birth"
                    onChange={handleDateChange}
                    value={
                      formData.dateOfBirth ? moment(formData.dateOfBirth) : null
                    }
                    format="YYYY-MM-DD"
                    required
                  />
                </ConfigProvider>
              </div>
            </div>
            {/* Row 4: Department & City */}
            <div className="form-row">
              <div className="form-item">
                <label htmlFor="department">Department*</label>
                {fetchingDepartments ? (
                  <div className="loading-spinner">
                    <Spin size="small" />
                  </div>
                ) : (
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
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.department_name}
                      </option>
                    ))}
                  </select>
                )}
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
              <button
                className="submit-btn"
                type="submit"
                disabled={loading || fetchingDepartments}
              >
                {loading ? "Processing..." : "Confirm"}
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
              <button
                className="submit-btn"
                onClick={handleBulkUploadSubmit}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNewEmployee;
