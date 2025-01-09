import React from 'react';
import { Button } from 'antd';
import './index.css';

const BackButton = ({ text }) => {
  return (
    <Button
      type="text"
      className="back-button"
      icon={<img src="/ArrowLeft.png" alt="Back" className="back-icon" />}
    >
      {text}
    </Button>
  );
};

export default BackButton;