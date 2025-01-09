// CustomHeader.jsx
import React from 'react';
import { Button, Space } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.css';

const CustomHeader = ({ 
  title, 
  showBackButton = true,
  rightContent = null,
  showFilters = false,
  filterContent = null,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="custom-header">
      <div className="header-main">
        <div className="header-left">
          {showBackButton && (
            <Button 
              type="text" 
              icon={<img src='ArrowLeft.png'  />}
              onClick={handleBack}
              className="back-button"
            />
          )}
          <h1 className="header-title">{title}</h1>
        </div>
        
        {rightContent && (
          <div className="header-right">
            <Space>
              {rightContent}
            </Space>
          </div>
        )}
      </div>
      
      {showFilters && filterContent && (
        <div className="header-filters">
          {filterContent}
        </div>
      )}
    </div>
  );
};

export default CustomHeader;