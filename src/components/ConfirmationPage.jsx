import React from "react";
import { Card, Typography, Table, Empty, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

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
    <div className="p-0 bg-[#191a20] min-h-screen border border-[#434343] rounded-[18px]">
      <div className="mb-6 p-7 bg-transparent">
        <div className="flex justify-between items-center mb-5">
          <Title
            style={{
              fontSize: "24px",
              fontFamily: "sanSatoshi, sans-serif",
              fontWeight: "500",
              color: "#ffffff",
              margin: 0
            }}
          >
            Company Info
          </Title>
          <span
            style={{ color: "#00D885", cursor: "pointer" }}
            onClick={handleCompanyEdit}
            className="cursor-pointer text-base"
          >
            <EditOutlined className="cursor-pointer text-base" /> Edit
          </span>
        </div>
        {companyInfo ? (
          <div className="grid grid-cols-2 gap-5 max-w-[800px]">
            <div className="flex flex-col">
              <span className="text-[#8c8c8c] text-base mb-2">Company name</span>
              <span className="text-white text-base">{companyInfo.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#8c8c8c] text-base mb-2">Number of employees</span>
              <span className="text-white text-base">{companyInfo.employeeCount}</span>
            </div>
          </div>
        ) : (
          <Empty description="No company information available" />
        )}
      </div>
      <hr className="block w-full h-px bg-[#ffffff1a] my-6 border-none opacity-100" />

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
          className="mt-4 bg-[#282932] rounded-[18px] overflow-x-auto whitespace-nowrap [&_.ant-table]:bg-[#262626] [&_.ant-table-thead>tr>th]:whitespace-nowrap [&_.ant-table-thead>tr>th]:bg-[#1f1f1f] [&_.ant-table-thead>tr>th]:text-[#6b7280] [&_.ant-table-thead>tr>th]:p-4 [&_.ant-table-thead>tr>th]:text-left [&_.ant-table-thead>tr>th]:border-b [&_.ant-table-thead>tr>th]:border-[#434343] [&_.ant-table-tbody>tr>td]:whitespace-nowrap [&_.ant-table-tbody>tr>td]:p-4 [&_.ant-table-tbody>tr>td]:border-b [&_.ant-table-tbody>tr>td]:border-[#434343] [&_.ant-table-tbody>tr>td]:text-white [&_.ant-table-tbody>tr:hover>td]:bg-[#1f1f1f]"
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
