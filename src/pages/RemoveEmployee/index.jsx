import React, { useState, useEffect } from "react";
import { Table, Card, Empty, message, Modal } from "antd";
import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import CustomHeader from "../../components/CustomHeader";
import { getTopPerformingEmployee, removeEmployee, searchEmployees } from "../../services/api";
import ErrorBoundary from "../../components/ErrorBoundary";
import "./removeEmployee.css";

const { confirm } = Modal;

const RemoveEmployee = () => {
  // Initialize employees state before using it
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      // Set a timeout to update the debounced value after delay
      const timer = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cleanup the timeout if value changes before delay expires
      return () => {
        clearTimeout(timer);
      };
    }, [value, delay]);

    return debouncedValue;
  }

  const debouncedSearchText = useDebounce(searchText, 1000);

  useEffect(() => {
    fetchEmployees(1, 10, debouncedSearchText);
  }, [debouncedSearchText]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Updated fetchEmployees function that chooses API based on search term
  const fetchEmployees = async (page = 1, pageSize = 10, searchTerm = "") => {
    try {
      setLoading(true);
      const company_id = localStorage.getItem("companyId") || 1;

      let response;

      if (searchTerm && searchTerm.trim() !== "") {
        // Use search API when search term exists
        response = await searchEmployees({
          company_id,
          search_term: searchTerm,
          page,
          limit: pageSize
        });
      } else {
        // Use regular API when no search term
        response = await getTopPerformingEmployee({
          companyId: company_id, // Note: API uses companyId not company_id
          page,
          limit: pageSize
        });
      }

      if (response && response.status) {
        setEmployees(response.data);
        // Clear selections when search results change
        setSelectedEmployees([]);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      message.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(); // Initial load with no search term
  }, []);

  // Handle checkbox selection
  const handleSelect = (employeeId) => {
    console.log("Selecting employee with ID:", employeeId);
    setSelectedEmployees((prev) => {
      if (prev.includes(employeeId)) {
        return prev.filter((id) => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  // Handle select all checkboxes
  const handleSelectAll = (checked) => {
    if (checked) {
      // Use the same ID field (user_id or id) that's used in individual selections
      setSelectedEmployees(employees.map(emp => emp.user_id || emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  // Handle removal of selected employees
  const handleRemoveEmployees = () => {
    if (selectedEmployees.length === 0) {
      message.warning("Please select employees to remove");
      return;
    }

    confirm({
      title: 'Are you sure you want to remove these employees?',
      icon: <ExclamationCircleOutlined />,
      content: `You are about to remove ${selectedEmployees.length} employee(s). This action cannot be undone.`,
      okText: 'Yes, Remove',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          setLoading(true);
          const company_id = localStorage.getItem("companyId") || 1;

          let response;

          // Handle single vs multiple employee removal differently
          if (selectedEmployees.length === 1) {
            // For single employee removal
            response = await removeEmployee({
              company_id,
              user_id: selectedEmployees[0]
            });
          } else {
            // For multiple employee removal
            response = await removeEmployee({
              company_id,
              user_ids: selectedEmployees
            });
          }

          // Handle the response
          if (response && response.status) {
            message.success(`${selectedEmployees.length} employee(s) removed successfully`);
            setSelectedEmployees([]);
            fetchEmployees(); // Refresh the list
          } else {
            throw new Error("Failed to remove employees");
          }
        } catch (error) {
          console.error("Error removing employees:", error);
          message.error("Failed to remove employees. Please try again.");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const columns = [
    {
      title: (
        <input
          type="checkbox"
          className="green-checkbox"
          // Only check when we have employees and all are selected
          checked={
            employees.length > 0 &&
            selectedEmployees.length === employees.length
          }
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      key: "select",
      render: (_, record) => {
        const employeeId = record.user_id || record.id;
        return (
          <input
            type="checkbox"
            className="green-checkbox"
            checked={selectedEmployees.includes(employeeId)}
            onChange={() => handleSelect(employeeId)}
          />
        );
      },
      width: 60,
    },
    // Other columns remain the same
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
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>
          <div className="employee-action-buttons">
            <button
              className={`${selectedEmployees.length === 0 ? 'disabled-btn' : ''}`}
              onClick={handleRemoveEmployees}
              disabled={selectedEmployees.length === 0 || loading}
              title={selectedEmployees.length === 0 ? "Select employees to remove" : "Remove selected employees"}
            >
              Remove
            </button>
          </div>
        </div>
        <Table
          className="employee-table"
          columns={columns}
          dataSource={employees}
          pagination={false}
          loading={loading}
          rowKey="id"
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
