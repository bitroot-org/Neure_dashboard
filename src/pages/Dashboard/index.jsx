import React, { useEffect, useState, useContext } from "react";
import { Table, Space, Card, message, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./index.css";
import CompanyHealthGauge from "../../components/CompanyHealthGauge";
import UserStats from "../../components/UserStats";
import CustomHeader from "../../components/CustomHeader";
import { CompanyDataContext } from "../../context/CompanyContext";
import { getTopPerformingEmployee, getCompanyMetrics } from "../../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [metricsData, setMetricsData] = useState(null);
  // Remove stressTrends state since we're not using it anymore

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { companyData } = useContext(CompanyDataContext);

  console.log("Company data from context:", companyData);

  const fetchEmployees = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const companyId = localStorage.getItem("companyId");

      if (!companyId) {
        message.error("Company ID not found");
        return;
      }

      console.log("Fetching employees with companyId:", companyId);
      const response = await getTopPerformingEmployee({
        companyId,
        page,
        limit: pageSize,
      });

      console.log("Employees response:", response);
      if (response.status) {
        setEmployees(response.data);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      message.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      console.log("fetchMetrics called");
      const companyId = localStorage.getItem("companyId");
      if (!companyId) {
        message.error("Company ID not found");
        return;
      }

      console.log("Fetching metrics with companyId:", companyId);
      const response = await getCompanyMetrics(companyId);
      console.log("Metrics response:", response);
      if (response.status) {
        setMetricsData(response.data.metrics);
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
      message.error("Failed to fetch company metrics");
    } finally {
      setLoading(false);
    }
  };

  // Remove the fetchStressTrends function completely

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        console.log("Fetching initial data...");
        // Remove fetchStressTrends from Promise.all
        await Promise.all([
          fetchEmployees(pagination.current, pagination.pageSize),
          fetchMetrics()
        ]);
        console.log("Initial data fetched successfully");
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Remove any other useEffect that might be redundant

  const statsData = [
    {
      title: "Stress Levels",
      value: `${Math.round(companyData.stress_level)}%`,
      trend: companyData.stress_trend
    },
    {
      title: "Psychological Safety Index",
      value: `${Math.round(companyData.psychological_safety_index)}%`,
      trend: companyData.psi_trend
    },
    {
      title: "Employee Retention",
      value: `${Math.round(companyData.retention_rate)}%`,
      trend: companyData.retention_trend
    },
    {
      title: "Employee Engagement",
      value: `${Math.round(companyData.engagement_score)}%`,
      trend: companyData.engagement_trend
    }
  ];

  const columns = [
    {
      title: "Rank",
      key: "rank",
      width: 80,
      render: (_, record, index) => index + 1,
    },
    {
      title: "Employee Name",
      key: "name",
      render: (_, record) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: "Department",
      dataIndex: "department_name",
      key: "department_name",
    },
    {
      title: "Workshops Attended",
      dataIndex: "Workshop_attended",
      key: "Workshop_attended",
      sorter: (a, b) => a.Workshop_attended - b.Workshop_attended,
    },
    {
      title: "Tasks Completed",
      dataIndex: "Task_completed",
      key: "Task_completed",
      sorter: (a, b) => a.Task_completed - b.Task_completed,
    },
    {
      title: "Engagement Score",
      dataIndex: "EngagementScore",
      key: "EngagementScore",
      render: (score) => `${score}%`,
      align: "center",
    },
  ];

  const getStressStatus = (stressLevel) => {
    if (stressLevel <= 20) return "Excellent";
    if (stressLevel <= 40) return "Good";
    if (stressLevel <= 60) return "Moderate";
    if (stressLevel <= 80) return "High";
    return "Critical";
  };

  // Function to navigate to well-being index page
  const navigateToWellbeingIndex = () => {
    navigate("/wellbeing-index");
  };

  return (
    <div className="dashboard-containers">
      <CustomHeader title="Dashboard"/>
      <div className="stats-grid">
        <div className="roi-left-metrics">
          <UserStats data={metricsData} style={{ cursor: "pointer" }} />
        </div>

        <div className="right-stats">
          {statsData.map((stat, index) => (
            <div key={index} className="dash-roi-stat-card">
              <h3>{stat.title}</h3>
              <div className="dashboard-stat">
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change ${stat.status}`}>
                  <img 
                    src={stat.trend === "no_change" ? "Upward.png" : stat.trend === "up" ? "CaretUp.png" : "CaretDown.png"} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Table Section */}
      <div className="table-section">
        <div className="table-header">
          <h2>Top performing employees</h2>
          <select className="period-selector">
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Daily</option>
          </select>
        </div>
        <Table
          columns={columns}
          dataSource={employees}
          loading={loading}
          rowKey="user_id"
          className="employee-table"
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Dashboard;
