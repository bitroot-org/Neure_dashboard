import React, { useState, useEffect } from "react";
import { Card, Table, Typography, Space, Empty } from "antd";
import "./index.css";
import CustomHeader from "../../components/CustomHeader";
import { getTopPerformingEmployee } from "../../services/api";

const { Title } = Typography;

const EmployeeDashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchEmployees = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await getTopPerformingEmployee(1, {
        page,
        limit: pageSize,
      });

      if (response.status) {
        setEmployees(response.data.employees);
      }
    } catch (error) {
      message.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(pagination.current, pagination.pageSize);
  }, []);

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
      render: (_, record) => `${record.first_name} ${record.last_name}`,
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
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active) => (
        <span
          className={`status-badge ${is_active === 1 ? "active" : "inactive"}`}
        >
          {is_active === 1 ? "Active" : "InActive"}
        </span>
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
    },
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
              <div className="metric-header">
                <h3 className="metric-title">{metric.title}</h3>
                <button>
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </button>
              </div>

              <h1 className="metric-value">{metric.value}</h1>
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
            </Card>
          ))}
        </div>
      </div>

      <Table
        className="employee-table"
        columns={columns}
        dataSource={employees}
        pagination={false}
        locale={{
          emptyText: (
            <div
              style={{
                background: "black",
                padding: "32px",
                color: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  filter: "brightness(0) invert(1)",
                  marginBottom: "8px",
                }}
              >
                {Empty.PRESENTED_IMAGE_SIMPLE}
              </div>
              <span>No Data Available</span>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default EmployeeDashboard;
