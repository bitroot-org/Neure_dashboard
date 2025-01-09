import React from "react";
import { Table, Space } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import MetricLineChart from "../../components/MetricLineCharts";
import { sampleData } from "../../constants/faqData";
import "./index.css";

const Dashboard = () => {
  const statsData = [
    {
      title: "Employee Engagement Levels",
      value: "85%",
      change: 4.5,
      status: "up",
      description: "Up from past month",
    },
    {
      title: "Productivity Improvements",
      value: "85%",
      change: 1.5,
      status: "up",
      description: "Up from past month",
    },
    {
      title: "Reduction in Absenteeism",
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

  return (
    <div className="dashboard-container">
      {/* Stats Section */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3>{stat.title}</h3>
            <div className="stat-value">{stat.value}</div>
            <div className={`stat-change ${stat.status}`}>
              {stat.status === "up" ? (
                <ArrowUpOutlined />
              ) : (
                <ArrowDownOutlined />
              )}
              <span>
                {stat.change}% {stat.description}
              </span>
            </div>
          </div>
        ))}
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
