import React from "react";
// Add DatePicker to imports
import { Card, Switch, Table, Button, Typography, DatePicker } from "antd";
import "./index.css";
import CustomHeader from "../../components/CustomHeader";

const { Title } = Typography;

const Settings = () => {
  const notificationSettings = [
    { name: "Email Notifications", enabled: true },
    { name: "SMS Notifications", enabled: false },
    {
      name: "Workshop & Event Reminders (48 hrs & 1 hr before event)",
      enabled: true,
    },
    { name: "System Updates & Announcements", enabled: true },
  ];

  // Transaction history data
  const transactionData = Array(8)
    .fill()
    .map((_, index) => ({
      key: index,
      invoiceNumber: "INV-00123",
      date: "12 Oct 2024",
      amount: "€11,999",
    }));

  const columns = [
    {
      title: "Invoice #",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <a href="#" className="download-link">
          Download receipt
        </a>
      ),
    },
  ];

  return (
    <div className="settings-container">
      <CustomHeader
        title="Settings"
        showBackButton={true}
        showEditButton={false}
        showFilterButton={false}
      />
      <div className="settings-content">
        <div className="section-card">
          <h3>Notifications</h3>
          <div className="notification-settings">
            {notificationSettings.map((setting, index) => (
              <div key={index} className="notification-item">
                <span>{setting.name}</span>
                <Switch defaultChecked={setting.enabled} />
              </div>
            ))}
          </div>
        </div>

        {/* Billing History Section */}
        <div className="section-card">
          <h3>Billing History & Invoices</h3>
          <div className="current-plan">
            <div className="plan-details">
              <div className="plan-item">
                <span className="label">Current plan</span>
                <span className="value">Monthly</span>
              </div>
              <div className="plan-item">
                <span className="label">Renewal date</span>
                <span className="value">March 15, 2025</span>
              </div>
              <div className="plan-item">
                <span className="label">Status</span>
                <span className="status-badge">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="section-card">
          <h3>Transaction History</h3>
          <Table
            columns={columns}
            dataSource={transactionData}
            pagination={false}
            className="transaction-table"
          />
        </div>

        {/* Account Settings Section */}
        <div className="section-card">
          <h3 style={{ marginBottom: "16px" }}>Account settings</h3>

          <div className="settings-item">
            <div className="settings-section">
              <div className="settings-title">Change password</div>
              <div className="settings-description">
                Change your current password to a stronger one.
              </div>
            </div>
            <Button className="settings-button">Change password</Button>
          </div>

          <div className="settings-item">
            <div className="settings-section">
              <div className="settings-title">Deactivate account</div>
              <div className="settings-description">
                Send an account deactivation request to the Neure team.
              </div>
            </div>
            <Button className="settings-button">Request Deactivation</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
