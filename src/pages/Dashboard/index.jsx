import React, { useEffect, useState } from "react";
import { Table, Space, Card } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import MetricLineChart from "../../components/MetricLineCharts";
import { sampleData } from "../../constants/faqData";
import "./index.css";
import CompanyHealthGauge from "../../components/CompanyHealthGauge";
import UserStats from "../../components/UserStats";
import CustomHeader from "../../components/CustomHeader";
import { getCompanyEmployees } from "../../services/api";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchEmployees = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await getCompanyEmployees(1, {
        page,
        limit: pageSize
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

  const statsData = [
    {
      title: "Employee Engagement",
      value: "85%",
      change: 4.5,
      status: "up",
      description: "Up from past month",
    },
    {
      title: "Employee Turnover",
      value: "85%",
      change: 1.5,
      status: "up",
      description: "Up from past month",
    },
    {
      title: "Stress Levels",
      value: "85%",
      change: 3.5,
      status: "down",
      description: "Down from past month",
    },
    {
      title: "Employee Retention",
      value: "85%",
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
      dataIndex: "department",
      key: "department",
      filters: [
        { text: "Customer Support", value: "Customer Support" },
        { text: "Engineering", value: "Engineering" },
        { text: "Sales", value: "Sales" },
      ],
      onFilter: (value, record) => record.department === value,
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
      sorter: (a, b) => a.EngagementScore - b.EngagementScore,
      render: (score) => `${score}%`,
    },
  ];

  const data = {
    totalUsers: 512,
    activeUsers: 500,
    inactiveUsers: 12,
    lastUpdated: "21 Apr",
  };

  return (
    <div className="dashboard-container">
      <CustomHeader title="Dashboard" />
      <div className="stats-grid">
        <div className="left-metrics">
          <CompanyHealthGauge
            className="metric-card"
            value={500}
            title="Project performance"
            lastCheckDate="31 Jan"
            status="Average"
            style={{ cursor: "pointer" }}
          />
          <UserStats data={data} style={{ cursor: "pointer" }} />
        </div>

        <div className="right-stats">
          {statsData.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3>{stat.title}</h3>
              <div className=""></div>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-change ${stat.status}`}>
                {stat.status === "up" ? (
                  <img src="CaretUp.png" />
                ) : (
                  <img src="CaretDown.png" />
                )}
                <span>{stat.change}%</span>
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
        />
      </div>
    </div>
  );
};

export default Dashboard;
