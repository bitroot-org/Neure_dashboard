import React, { useState, useEffect } from "react";
import { Card, Table, Typography, Space, Empty } from "antd";
import "./index.css";
import CustomHeader from "../../components/CustomHeader";

const { Title } = Typography;

const EmployeeDashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const metrics = [
    { title: "Total Employees", value: 250, change: "+5%" },
    { title: "Departments", value: 8, change: "+30%" },
    { title: "New Hires", value: 15, change: "+20%" },
    { title: "Active Projects", value: 35, change: "+10%" },
  ];

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      filters: [
        { text: "Engineering", value: "Engineering" },
        { text: "Marketing", value: "Marketing" },
        { text: "Sales", value: "Sales" },
        { text: "HR", value: "HR" },
      ],
      onFilter: (value, record) => record.department === value,
    },
    {
      title: "Email ID",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "Male", value: "Male" },
        { text: "Female", value: "Female" },
        { text: "Other", value: "Other" },
      ],
      onFilter: (value, record) => record.gender === value,
      
    },
    {
      title: "Date Added",
      dataIndex: "dateAdded",
      key: "dateAdded",
      sorter: (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: () => (
        <button className="three-dots-btn">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </button>
      ),
    }
  ];

  const data = [
    {
      key: "1",
      name: "Alice Johnson",
      department: "Engineering",
      email: "example@mail.com",
      age: 28,
      gender: "Female",
      dateAdded: "12 Oct 2024",
      status: "Active",
    },
    {
      key: "2",
      name: "Alice Johnson",
      department: "Engineering",
      email: "example@mail.com",
      age: 28,
      gender: "Female",
      dateAdded: "12 Oct 2024",
      status: "InActive",
    },
    {
      key: "3",
      name: "Alice Johnson",
      department: "Engineering",
      email: "example@mail.com",
      age: 28,
      gender: "Female",
      dateAdded: "12 Oct 2024",
      status: "Active",
    },
    // Add more data as needed
  ];

  

  return (
    <div className="employee-dashboard">
      <CustomHeader title="Employee Management" />

      <div className="dashboard-section">
        <Title level={4} className="section-title">
          Key Metrics
        </Title>
        <div className="metrics-container">
          {metrics.map((metric, index) => (
            <Card key={index} className="metric-card">
              <Space direction="vertical" size={0}>
                <Title level={5} className="metric-title">
                  {metric.title}
                </Title>
                <div className="metric-value">{metric.value}</div>
                <div
                  className={`metric-change ${
                    metric.change.includes("+")
                      ? "positive"
                      : metric.change === "0%"
                      ? "neutral"
                      : "negative"
                  }`}
                >
                  {metric.change}
                </div>
              </Space>
            </Card>
          ))}
        </div>
      </div>

      <Table
        className="employee-table"
        columns={columns}
        dataSource={data}
        pagination={false}
        locale={{
          emptyText: (
            <div style={{ 
              background: 'black', 
              padding: '32px',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{ filter: 'brightness(0) invert(1)', marginBottom: '8px' }}>
                {Empty.PRESENTED_IMAGE_SIMPLE}
              </div>
              <span>No Data Available</span>
            </div>
          )
        }}
      />
    </div>
  );
};

export default EmployeeDashboard;
