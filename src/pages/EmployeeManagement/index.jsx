import React, { useState, useEffect } from "react";
import { Card, Table, Typography, Space, Empty } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Add this import
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

  const navigate = useNavigate();

  const fetchEmployees = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await getTopPerformingEmployee({
        companyId: 1,
        page,
        limit: pageSize,
      });

      if (response.status) {
        setEmployees(response.data);
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

  const handleRemoveEmployee = () => {
    navigate('/removeEmployee');
  };

  const handleAddEmployee = () => {
    navigate('/addNewEmployee');
  };

  const metrics = [
    { title: "Total Employees", value: 250, change: "+5%" },
    { title: "Departments", value: 8, change: "+30%" },
    { title: "New Hires", value: 15, change: "+20%" },
    { title: "Active Projects", value: 35, change: "+10%" },
  ];

  const columns = [
    {
      title: "Sr no.",
      key: "serialNumber",
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: "Full Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: "Official Email ID",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Contact Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Department",
      dataIndex: "department_name",
      key: "department_name",
      filters: [
        { text: "Engineering", value: "Engineering" },
        { text: "Marketing", value: "Marketing" },
        { text: "Sales", value: "Sales" },
        { text: "HR", value: "HR" },
      ],
      onFilter: (value, record) => record.department === value,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Date added",
      dataIndex: "joined_date",
      key: "joined_date",
      render: (date) => new Date(date).toISOString().split('T')[0],
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

      <div className="metrics-container">
        {metrics.map((metric, index) => (
          <Card key={index} className="metric-card">
            <div className="metric-header">
              <h3 className="metric-title">{metric.title}</h3>
              {/* <button>
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </button> */}
            </div>

            <div className="employee-metric-data">
              <h1 className="employee-metric-value">{metric.value}</h1>
              <div
                className={`employee-metric-change ${metric.change.includes("+")
                  ? "positive"
                  : metric.change === "0%"
                    ? "neutral"
                    : "negative"
                  }`}
              >
                {metric.change}
              </div>
            </div>

          </Card>
        ))}
      </div>

      <div className="employee-actions">
        <div className="employee-search-container">
          <SearchOutlined className="search-icon" />
          <input
            type="text"
            placeholder="Search name, department"
            className="employee-search"
          />
        </div>
        <div className="employee-action-buttons">
          <button
            className="add-employee-btn"
            onClick={handleAddEmployee}
          >
            Add Employee
          </button>          
          <button
            className="remove-employee-btn"
            onClick={handleRemoveEmployee}
          >
            Remove Employee
          </button>
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
                margin: "-15px -20px",
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
