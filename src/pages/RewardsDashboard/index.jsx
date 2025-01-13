import React from "react";
import { Card } from "antd";
import "./index.css";
import MetricLineChart from "../../components/MetricLineCharts";
import CustomHeader from "../../components/CustomHeader";

const dummyMetricsData = [
  { name: "5k", value: 20 },
  { name: "10k", value: 45 },
  { name: "15k", value: 35 },
  { name: "20k", value: 94 },
  { name: "25k", value: 49 },
  { name: "30k", value: 52 },
  { name: "35k", value: 30 },
  { name: "40k", value: 70 },
  { name: "45k", value: 65 },
  { name: "50k", value: 58 },
  { name: "55k", value: 45 },
  { name: "60k", value: 50 },
];

const dummyEmployeeData = [
  { name: "Anjana More", points: 3400 },
  { name: "Siddharth Menon", points: 2950 },
  { name: "Rajkumar S", points: 2700 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label}`}</p>
        <p className="value">{`Value: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const RewardsDashboard = () => {
  return (
    <div className="rewards-dashboard">
      <CustomHeader title="Rewards & Recognition" />
      <div className="rewards-metrics-section">
        <Card className="rewards-happiness-card">
          <div className="rewards-happiness-info">
            <h2>92%</h2>
            <p>Employee happiness</p>
          </div>

          <div className="rewards-employee-icon">
            <img src="achievement.png" alt="Achievement Logo" />
          </div>
        </Card>

        <div className="rewards-stats-container">
          <Card className="rewards-stat-card">
            <div className="rewards-stat-content">
              <div className="stat-icon">
                <img src="handCoins.png" alt="Hand holding coins" />
              </div>
              <div className="stat-info">
                <p>Total Points Distributed</p>
                <h3>45,000</h3>
              </div>
            </div>
          </Card>

          <Card className="rewards-stat-card">
            <div className="rewards-stat-content">
              <div className="stat-icon">
                <img src="shootingStar.png" alt="Shooting star" />
              </div>
              <div className="stat-info">
                <p>Total Points Redeemed</p>
                <h3>38,000</h3>
              </div>
            </div>
          </Card>

          <Card className="rewards-stat-card">
            <div className="rewards-stat-content">
              <div className="stat-icon">
                <img src="trophy.png" alt="Trophy" />
              </div>
              <div className="stat-info">
                <p>Active Reward Programs</p>
                <h3>05</h3>
              </div>
            </div>
          </Card>
        </div>

        <Card className="rewards-employees-card">
          <h3>Top Rewarded Employees:</h3>
          <div className="employees-list">
            {dummyEmployeeData.map((employee, index) => (
              <div key={index} className="employee-item">
                <span className="employee-name">{employee.name}</span>
                <span className="employee-points">
                  {employee.points} points
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <MetricLineChart data={dummyMetricsData} />
    </div>
  );
};

export default RewardsDashboard;
