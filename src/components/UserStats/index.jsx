import React from 'react';
import { Card, Typography, Spin } from 'antd';
import './index.css';

const { Title, Text } = Typography;

const UserStats = ({ data, onClick, loading }) => {
  if (loading) {
    return (
      <Card className="stats-card">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin />
        </div>
      </Card>
    );
  }

  console.log("UserStats -> data", data);


  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className="stats-card" style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <div className="stats-container">
        <Title className="stats-title">Total users</Title>
        
        <div className="total-number">
          <Title className='user-count'>{data?.total_employees}</Title>
        </div>

        <div className="users-status">
          <div className="status-item">
            <span className="status-dot active"></span>
            <h4 className="status-text">Active <span>{data?.active_employees}</span></h4>
          </div>
          
          <div className="status-item">
            <span className="status-dot inactive"></span>
            <h4 className="status-text">Inactive <span>{data?.inactive_employees}</span></h4>
          </div>
        </div>

        <Text className="last-updated">
          Last updated on {formatDate(data?.last_employee_joined)}
        </Text>
      </div>
    </Card>
  );
};

export default UserStats;