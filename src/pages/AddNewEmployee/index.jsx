import React, { useState, useEffect, useRef } from "react";
import CustomHeader from "../../components/CustomHeader";
import { UploadOutlined, FileOutlined, CloseOutlined } from "@ant-design/icons";
import { message, Spin, DatePicker, ConfigProvider, Modal } from "antd";
import "./addNewEmployee.css";
import { createEmployee, getDepartments, bulkCreateEmployees } from "../../services/api";
import moment from "moment";

const FormShimmer = () => (
  <div className="form-shimmer">
    <div className="type-section-shimmer">
      <div className="type-button-shimmer"></div>
      <div className="type-button-shimmer"></div>
    </div>
    
    <div className="divider-shimmer"></div>
    
    <div className="form-row-shimmer">
      <div className="form-item-shimmer">
        <div className="label-shimmer"></div>
        <div className="input-shimmer"></div>
      </div>
      <div className="form-item-shimmer">
        <div className="label-shimmer"></div>
        <div className="input-shimmer"></div>
      </div>
    </div>
    
    <div className="form-row-shimmer">
      <div className="form-item-shimmer">
        <div className="label-shimmer"></div>
        <div className="input-shimmer"></div>
      </div>
      <div className="form-item-shimmer">
        <div className="label-shimmer"></div>
        <div className="input-shimmer"></div>
      </div>
    </div>
    
    <div className="form-row-shimmer">
      <div className="form-item-shimmer">
        <div className="label-shimmer"></div>
        <div className="input-shimmer"></div>
      </div>
      <div className="form-item-shimmer">
        <div className="label-shimmer"></div>
        <div className="input-shimmer"></div>
      </div>
    </div>
  </div>
);

const AddNewEmployee = () => {
  const [employeeType, setEmployeeType] = useState("single");
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [fetchingDepartments, setFetchingDepartments] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    gender: "",
    dateOfBirth: null,
    department: "",
    city: "",
  });

  const fileInputRef = useRef(null);
  const [bulkUploadFile, setBulkUploadFile] = useState(null);

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

  if (fetchingDepartments) {
    return (
      <div className="add-employee-dashboard">
        <CustomHeader title="Add New Employee" />
        <div className="form-container">
          <FormShimmer />
        </div>
      </div>
    );
  }

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
        date_of_birth: formData.dateOfBirth,
        job_title: "",
        department_id: parseInt(formData.department),
        city: formData.city,
      };

      const response = await createEmployee(employeeData);

      if (response.status) {
        message.success("Employee added successfully!");
        console.log("API Response:", response);

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          contact: "",
          gender: "",
          dateOfBirth: null,
          department: "",
          city: "",
        });
      } else {
        // Handle specific error cases
        if (response.message && response.message.includes("already in use")) {
          message.error(response.message);
        } else {
          message.error(response.message || "Failed to add employee. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      
      // Check if the error contains a response with data
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Check for duplicate email error
        if (errorData.message && errorData.message.includes("already in use")) {
          message.error(errorData.message);
        } else {
          message.error(errorData.message || "Failed to add employee. Please try again.");
        }
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error("Failed to add employee. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Uploaded file:", file);
      setBulkUploadFile(file);
    }
  };

  const clearUploadedFile = () => {
    setBulkUploadFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBulkUploadSubmit = async () => {
    if (!bulkUploadFile) {
      message.warning("Please upload a CSV file first");
      return;
    }

    setLoading(true);
    try {
      const companyId = localStorage.getItem("companyId");
      
      // Call the bulkCreateEmployees function with the file and companyId
      const response = await bulkCreateEmployees(bulkUploadFile, companyId);
      
      if (response.status) {
        message.success(`Successfully added ${response.data.successful.length} employees`);
        
        // Reset the file input
        clearUploadedFile();
      } else {
        // Handle the error response
        console.log("Error response:", response);
        
        // Check if we have failed entries in the response data
        if (response.data && response.data.failed && response.data.failed.length > 0) {
          // Extract duplicate emails
          const duplicateEmails = response.data.failed
            .filter(item => item.error && item.error.includes("already exists"))
            .map(item => item.email);
          
          // Extract other errors
          const otherErrors = response.data.failed
            .filter(item => !item.error || !item.error.includes("already exists"));
          
          // Handle duplicate emails
          if (duplicateEmails.length > 0) {
            // Format the list of emails
            let emailList = duplicateEmails.join(", ");
            
            // Truncate if too long for a toast
            if (emailList.length > 100) {
              const displayedEmails = duplicateEmails.slice(0, 3);
              emailList = `${displayedEmails.join(", ")} and ${duplicateEmails.length - 3} more`;
            }
            
            message.error(`Duplicate emails found: ${emailList}`);
          }
          
          // Handle other errors
          if (otherErrors.length > 0) {
            const otherErrorMessages = otherErrors.map(item => 
              `${item.email}: ${item.error || "Unknown error"}`
            ).join('\n');
            
            Modal.error({
              title: 'Failed to add some employees',
              content: (
                <div>
                  <p>The following employees could not be added due to other errors:</p>
                  <div style={{ maxHeight: '200px', overflow: 'auto', whiteSpace: 'pre-line' }}>
                    {otherErrorMessages}
                  </div>
                </div>
              ),
            });
          }
          
          // If there were any successful entries, show a success message
          if (response.data.successful && response.data.successful.length > 0) {
            message.success(`Successfully added ${response.data.successful.length} employees`);
          } else {
            // If all failed, clear the file
            clearUploadedFile();
          }
        } else {
          // No detailed error information, just show the message
          message.error(response.message || "Failed to add employees");
          clearUploadedFile();
        }
      }
    } catch (error) {
      console.error("Error in bulk upload:", error);
      
      // Clear the file on error
      clearUploadedFile();
      
      // Try to extract error information from the error object
      if (error.data && error.data.failed && error.data.failed.length > 0) {
        // Similar handling as above for the error.data case
        const duplicateEmails = error.data.failed
          .filter(item => item.error && item.error.includes("already exists"))
          .map(item => item.email);
        
        if (duplicateEmails.length > 0) {
          let emailList = duplicateEmails.join(", ");
          if (emailList.length > 100) {
            const displayedEmails = duplicateEmails.slice(0, 3);
            emailList = `${displayedEmails.join(", ")} and ${duplicateEmails.length - 3} more`;
          }
          message.error(`Duplicate emails found: ${emailList}`);
        } else {
          // Show the general error message
          message.error(error.message || "Failed to process bulk upload");
        }
      } else if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error("Failed to process bulk upload. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
                <input
                  id="dateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  className="date-input"
                  value={formData.dateOfBirth || ""}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '0 12px',
                    fontSize: '16px'
                  }}
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
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.department_name}
                    </option>
                  ))}
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
                ref={fileInputRef}
              />
              
              {!bulkUploadFile ? (
                <>
                  <UploadOutlined
                    className="upload-icon"
                    onClick={() => document.getElementById("fileInput").click()}
                  />
                  <p className="upload-instructions">
                    Drop your CSV file here, or <span onClick={() => document.getElementById("fileInput").click()}>click to browse</span>
                  </p>
                </>
              ) : (
                <div className="file-uploaded-container">
                  <div className="file-info">
                    <FileOutlined className="file-icon" />
                    <div className="file-details">
                      <p className="file-name">{bulkUploadFile.name}</p>
                      <p className="file-size">{(bulkUploadFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button 
                    className="clear-file-btn" 
                    onClick={clearUploadedFile}
                    type="button"
                  >
                    <CloseOutlined />
                  </button>
                </div>
              )}
            </div>
            <div className="custom-divider"></div>
            <div className="submit-container">
              <button
                className="submit-btn"
                onClick={handleBulkUploadSubmit}
                disabled={loading || !bulkUploadFile}
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
