import React, { useState, useEffect } from "react";
import { Table, Card, Empty, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import CustomHeader from "../../components/CustomHeader";
import { getTopPerformingEmployee } from "../../services/api";
import ErrorBoundary from "../../components/ErrorBoundary";
import "./removeEmployee.css";

const RemoveEmployee = () => {
  // Initialize employees state before using it
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async (page = 1, pageSize = 10) => {
    try {
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
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const columns = [
    {
      title: "Select",
      key: "select",
      render: () => <input type="checkbox" className="green-checkbox" />,
      width: 60,
    },
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
      render: (date) => {
        const d = new Date(date);
        return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
      },
      sorter: (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active) => (
        <span className={`status-badge ${is_active === 1 ? "active" : "inactive"}`}>
          {is_active === 1 ? "Active" : "InActive"}
        </span>
      ),
    },
  ];

  return (
    <ErrorBoundary>
      <div className="employee-dashboard">
        <CustomHeader title="Remove Employee" />
        <div className="remove-employee-actions">
          <div className="employee-search-container">
            <SearchOutlined className="search-icon" />
            <input
              type="text"
              placeholder="Search name, department"
              className="employee-search"
            />
          </div>
          <div className="employee-action-buttons">
            <button className="add-employee-btn">Remove</button>
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
    </ErrorBoundary>
  );
};

export default RemoveEmployee;