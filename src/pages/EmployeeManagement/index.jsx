import React, { useState, useEffect, useContext, useCallback } from "react";
import { debounce } from "lodash";
import { Card, Table, Typography, message, Empty } from "antd";
import { CompanyDataContext } from "../../context/CompanyContext";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./index.css";
import CustomHeader from "../../components/CustomHeader";
import CustomPagination from "../../components/CustomPagination";

import { getTopPerformingEmployee } from "../../services/api";

const MetricCardShimmer = () => (
  <div className="metric-card-shimmer">
    <div className="shimmer-title"></div>
    <div className="shimmer-value"></div>
    <div className="shimmer-change"></div>
  </div>
);

const TableShimmer = () => (
  <div className="table-shimmer">
    <div className="table-shimmer-header">
      {[...Array(6)].map((_, index) => (
        <div key={`header-${index}`} className="table-shimmer-cell">
          <div className="shimmer-text"></div>
        </div>
      ))}
    </div>
    <div className="table-shimmer-body">
      {[...Array(5)].map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="table-shimmer-row">
          {[...Array(6)].map((_, cellIndex) => (
            <div key={`cell-${rowIndex}-${cellIndex}`} className="table-shimmer-cell">
              <div className="shimmer-text"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const EmployeeDashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { companyData } = useContext(CompanyDataContext);

  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      fetchEmployees(1, pagination.pageSize, searchValue);
    }, 800),
    []
  );

  const fetchEmployees = async (page = 1, pageSize = 10, searchTerm = "") => {
    try {
      setLoading(true);
      const response = await getTopPerformingEmployee({
        companyId: companyData?.companyId,
        page,
        limit: pageSize,
        search: searchTerm, // Fix the search parameter name
      });

      if (response.status) {
        setEmployees(response.data);
        setPagination({
          current: response.pagination.current_page,
          pageSize: response.pagination.per_page,
          total: response.pagination.total,
        });
      }
    } catch (error) {
      message.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Update the useEffect for initial data fetch
  useEffect(() => {
    if (companyData?.companyId) {
      fetchEmployees(pagination.current, pagination.pageSize, searchTerm);
    }
  }, [companyData]); // Change dependency to watch entire companyData object

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRemoveEmployee = () => {
    navigate("/removeEmployee");
  };

  const handleAddEmployee = () => {
    navigate("/addNewEmployee");
  };

  const handlePageChange = (page) => {
    fetchEmployees(page, pagination.pageSize, searchTerm);
  };

  const metrics = [
    {
      title: "Total Employees",
      value: companyData?.total_employees || 0, // Changed from totalEmployees
      change: "+5%",
    },
    {
      title: "Departments",
      value: companyData?.total_departments || 0, // Changed from totalDepartments
      change: "+30%",
    },
    {
      title: "Active Employees",
      value: companyData?.active_employees || 0, // Changed from activeEmployees
      change: "+20%",
    },
    {
      title: "Inactive Employees",
      value: companyData?.inactive_employees || 0, // Changed from inactiveEmployees
      change: "+10%",
    },
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
      render: (date) => new Date(date).toISOString().split("T")[0],
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

  if (loading) {
    return (
      <div className="employee-dashboard">
        <CustomHeader title="Employee Management" />
        <div className="metrics-container">
          {[...Array(4)].map((_, index) => (
            <MetricCardShimmer key={`metric-shimmer-${index}`} />
          ))}
        </div>
        <div className="employee-actions">
          <div className="employee-search-container">
            <SearchOutlined className="search-icon" />
            <input
              type="text"
              disabled
              placeholder="Search name, department"
              className="employee-search"
            />
          </div>
          <div className="employee-action-buttons">
            <button className="add-employee-btn" disabled>
              Add Employee
            </button>
            <button className="remove-employee-btn" disabled>
              Remove Employee
            </button>
          </div>
        </div>
        <TableShimmer />
      </div>
    );
  }

  return (
    <div className="employee-dashboard">
      <CustomHeader title="Employee Management" />

      <div className="metrics-container">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <h3 className="metric-title">{metric.title}</h3>

            <div className="employee-metric-data">
              <h1 className="employee-metric-value">{metric.value}</h1>
              <div
                className={`employee-metric-change ${
                  metric.change.includes("+")
                    ? "positive"
                    : metric.change === "0%"
                    ? "neutral"
                    : "negative"
                }`}
              >
                {metric.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="employee-actions">
        <div className="employee-search-container">
          <SearchOutlined className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search name, department"
            className="employee-search"
          />
        </div>
        <div className="employee-action-buttons">
          <button className="add-employee-btn" onClick={handleAddEmployee}>
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

      <div style={{ marginTop: "20px" }}>
        <CustomPagination
          currentPage={pagination.current}
          totalPages={Math.ceil(pagination.total / pagination.pageSize)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
