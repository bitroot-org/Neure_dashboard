import React, { useEffect, useState, useContext } from "react";
import { Table, Space, Card, message } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import MetricLineChart from "../../components/MetricLineCharts";
import { sampleData } from "../../constants/faqData";
import "./index.css";
import CompanyHealthGauge from "../../components/CompanyHealthGauge";
import UserStats from "../../components/UserStats";
import CustomHeader from "../../components/CustomHeader";
import { CompanyDataContext } from "../../context/CompanyContext";
import { getTopPerformingEmployee, getCompanyMetrics } from "../../services/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [metricsData, setMetricsData] = useState(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { companyData } = useContext(CompanyDataContext);

  console.log("Company data:", companyData);

  const fetchEmployees = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const companyId = localStorage.getItem("companyId");

      if (!companyId) {
        message.error("Company ID not found");
        return;
      }

      const response = await getTopPerformingEmployee({
        companyId,
        page,
        limit: pageSize,
      });

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

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const companyId = localStorage.getItem("companyId");
        if (!companyId) {
          message.error("Company ID not found");
          return;
        }

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

    fetchMetrics();
  }, []);

  useEffect(() => {
    fetchEmployees(pagination.current, pagination.pageSize);
  }, []); // Empty dependency array to run once on mount

  const statsData = [
    {
      title: "Stress Levels",
      value: `${Math.round(companyData.stress_level)}%`,
      change: 4.5,
      status: "up",
      description: "Up from past month",
    },
    {
      title: "Psychological Safety Index (PSI)",
      value: `${Math.round(companyData.psychological_safety_index)}%`,
      change: 1.5,
      status: "up",
      description: "Up from past month",
    },
    {
      title: "Employee Retention",
      value: `${Math.round(companyData.retention_rate)}%`,
      change: 3.5,
      status: "down",
      description: "Down from past month",
    },
    {
      title: "Employee Engagement",
      value: `${Math.round(companyData.engagement_score)}%`,
      change: 1.5,
      status: "up",
      description: "Up from past month",
    },
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

  return (
    <div className="dashboard-containers">
      <CustomHeader title="Dashboard" showFilterButton="true" />
      <div className="stats-grid">
        <div className="roi-left-metrics">
          <CompanyHealthGauge
            className="metric-card"
            value={(companyData.stress_level)}
            title="Project performance"
            lastCheckDate="31 Jan"
            status={getStressStatus(companyData.stress_level)}
            style={{ cursor: "pointer" }}
          />
          <UserStats data={metricsData} style={{ cursor: "pointer" }} />
        </div>

        <div className="right-stats">
          {statsData.map((stat, index) => (
            <div key={index} className="dash-roi-stat-card">
              <h3>{stat.title}</h3>
              <div className="dashboard-stat">
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change ${stat.status}`}>
                  {stat.status === "up" ? (
                    <img src="CaretUp.png" />
                  ) : (
                    <img src="CaretDown.png" />
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Metric Chart Section */}
      <div className="chart-section">
        <MetricLineChart data={sampleData} />
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
