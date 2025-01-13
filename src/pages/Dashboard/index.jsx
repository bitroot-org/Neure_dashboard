import React from "react";
import { Table, Space, Card } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import MetricLineChart from "../../components/MetricLineCharts";
import { sampleData } from "../../constants/faqData";
import "./index.css";
import CompanyHealthGauge from "../../components/CompanyHealthGauge";
import UserStats from "../../components/UserStats";
import CustomHeader from "../../components/CustomHeader";

const Dashboard = () => {
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

  const employeeData = [
    {
      key: "1",
      name: "Ravi",
      designation: "Manager",
      dateTime: "12.09.2019 - 12:53 PM",
      place: "423",
      amount: "$34,295",
      status: "Test",
      avatar: "./profile.jpg",
    },
    {
      key: "2",
      name: "Kumar",
      designation: "Designer",
      dateTime: "12.09.2019 - 12:53 PM",
      place: "423",
      amount: "$34,295",
      status: "Test",
      avatar: "./profile.jpg",
    },
    {
      key: "3",
      name: "Anushka",
      designation: "Developer",
      dateTime: "12.09.2019 - 12:53 PM",
      place: "423",
      amount: "$34,295",
      status: "Test",
      avatar: "./profile.jpg",
    },
    {
      key: "4",
      name: "Ravi",
      designation: "Manager",
      dateTime: "12.09.2019 - 12:53 PM",
      place: "423",
      amount: "$34,295",
      status: "Test",
      avatar: "./profile.jpg",
    },
    {
      key: "5",
      name: "Ravi",
      designation: "Manager",
      dateTime: "12.09.2019 - 12:53 PM",
      place: "423",
      amount: "$34,295",
      status: "Test",
      avatar: "./profile.jpg",
    },
    {
      key: "4",
      name: "Ravi",
      designation: "Manager",
      dateTime: "12.09.2019 - 12:53 PM",
      place: "423",
      amount: "$34,295",
      status: "Test",
      avatar: "./profile.jpg",
    },
  ];

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <img src={record.avatar} alt={text} className="employee-avatar" />
          {text}
        </Space>
      ),
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Date - Time",
      dataIndex: "dateTime",
      key: "dateTime",
    },
    {
      title: "Place",
      dataIndex: "place",
      key: "place",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span className={`status-badge ${text.toLowerCase()}`}>{text}</span>
      ),
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
            style={{ cursor: 'pointer' }}
          />
          <UserStats 
            data={data} 
            style={{ cursor: 'pointer' }}
          />
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
                <span>
                  {stat.change}%
                </span>
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
          dataSource={employeeData}
          pagination={false}
          className="employee-table"
        />
      </div>
    </div>
  );
};

export default Dashboard;
