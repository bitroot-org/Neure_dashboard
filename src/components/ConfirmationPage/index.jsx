import React from "react";
import { Card, Typography, Table, Empty, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import "./index.css";

const { Title } = Typography;

const ConfirmationPage = ({
  companyInfo,
  contactPersonInfo,
  employeeData,
  setCurrentStep,
  onSubmit,
}) => {
  const columns = [
    {
      title: "Sr.no",
      dataIndex: "sr.no",
      key: "srNo",
      width: 80, // Add fixed width
    },
    {
      title: "First Name",
      dataIndex: "first name",
      key: "firstName",
      width: 150,
    },
    {
      title: "Last Name",
      dataIndex: "last name",
      key: "lastName",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 100,
    },
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
      width: 100,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      width: 150,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      width: 150,
    },
  ];

  const handleCompanyEdit = () => setCurrentStep(1);
  const handleContactEdit = () => setCurrentStep(2);
  const handleEmployeeEdit = () => setCurrentStep(3);

  return (
    <div className="dashboard-container">
      <div className="info-card">
        <div className="card-header">
          <Title
            style={{
              fontSize: "24px",
              fontFamily: "sanSatoshi, sans-serif",
              fontWeight: "500",
            }}
          >
            Company Info
          </Title>
          <span
            style={{ color: "#00D885", cursor: "pointer" }}
            onClick={handleCompanyEdit}
          >
            <EditOutlined className="edit-icon" /> Edit
          </span>
        </div>
        {companyInfo ? (
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Company name</span>
              <span className="value">{companyInfo.name}</span>
            </div>
            <div className="info-item">
              <span className="label">Number of employees</span>
              <span className="value">{companyInfo.employeeCount}</span>
            </div>
          </div>
        ) : (
          <Empty description="No company information available" />
        )}
      </div>
      <hr className="card-divider" />

      <div className="info-card">
        <div className="card-header">
          <Title
            style={{
              fontSize: "24px",
              fontFamily: "sanSatoshi, sans-serif",
              fontWeight: "500",
            }}
          >
            Contact Person Info
          </Title>
          <span
            style={{ color: "#00D885", cursor: "pointer" }}
            onClick={handleContactEdit}
          >
            <EditOutlined className="edit-icon" /> Edit
          </span>
        </div>
        {contactPersonInfo ? (
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Full name</span>
              <span className="value">{contactPersonInfo.fullName}</span>
            </div>
            <div className="info-item">
              <span className="label">Department</span>
              <span className="value">{contactPersonInfo.department}</span>
            </div>
            <div className="info-item">
              <span className="label">Email</span>
              <span className="value">{contactPersonInfo.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Phone number</span>
              <span className="value">{contactPersonInfo.phoneNumber}</span>
            </div>
          </div>
        ) : (
          <Empty description="No contact person information available" />
        )}
      </div>
      <hr className="card-divider" />

      <div className="info-card">
        <div className="card-header">
          <Title
            style={{
              fontSize: "24px",
              fontFamily: "sanSatoshi, sans-serif",
              fontWeight: "500",
            }}
          >
            Employee Details
          </Title>
          <span
            style={{ color: "#00D885", cursor: "pointer" }}
            onClick={handleEmployeeEdit}
          >
            <EditOutlined className="edit-icon" /> Edit
          </span>
        </div>

        <Table
          dataSource={employeeData || []}
          columns={columns}
          pagination={false}
          className="employee-table"
          locale={{
            emptyText: (
              <Empty
                description={
                  <span style={{ color: "black" }}>
                    No employee data available
                  </span>
                }
              />
            ),
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "24px",
          }}
        >
          <Button
            type="primary"
            style={{
              height: "42px",
              borderRadius: "9999px",
              background:
                "linear-gradient(to bottom, #FFFFFF 0%, #797B87 100%)",
              color: "black",
              fontWeight: "500",
              fontSize: "16px",
              border: "none",
              padding: "0 38px",
            }}
            onClick={async () => {
              try {
                await onSubmit(); // Call the submit handler first
                setCurrentStep(5); // Then update the step
              } catch (error) {
                // Error handling is already in onSubmit
                console.error("Submission failed:", error);
              }
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
