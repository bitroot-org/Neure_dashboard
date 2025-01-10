import React from 'react';
import { Card, Typography } from 'antd';
import './index.css';

const { Title, Text } = Typography;

const UserStats = ({ data }) => {
  const { totalUsers, activeUsers, inactiveUsers, lastUpdated } = data;

  return (
    <Card className="stats-card">
      <div className="stats-container">
        <Title className="stats-title">Total users</Title>
        
        <div className="total-number">
          <Title className='user-count'>{totalUsers}</Title>
        </div>

        <div className="users-status">
          <div className="status-item">
            <span className="status-dot active"></span>
            <Text className="status-text">Active <span>{activeUsers}</span></Text>
          </div>
          
          <div className="status-item">
            <span className="status-dot inactive"></span>
            <Text className="status-text">Inactive <span>{inactiveUsers}</span></Text>
          </div>
        </div>

        <Text className="last-updated">
          Last updated on {lastUpdated}
        </Text>
      </div>
    </Card>
  );
};

export default UserStats;