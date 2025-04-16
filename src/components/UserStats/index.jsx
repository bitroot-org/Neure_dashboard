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
      <div className="stats-container">
        <h1 className="stats-title">Total users</h1>
        
        <div className="total-number">
          <h1 className='user-count'>{data?.total_employees}</h1>
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

        <h1 className="last-updated">
          Last updated on {formatDate(data?.last_employee_joined)}
        </h1>
      </div>
  );
};

export default UserStats;