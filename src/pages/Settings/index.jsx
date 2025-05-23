import React, { useState, useEffect } from "react";
import { Card, Switch, Table, Button, Typography, DatePicker, Spin, message } from "antd";
import "./index.css";
import CustomHeader from "../../components/CustomHeader";
import PasswordChangeModal from "../../components/PasswordChangeModal";
import DeactivateAccountModal from "../../components/DeactivateAccountModal";
import { getCompanySubscription, updateCompanySubscription, changePassword, requestDeactivation, getCompanyInvoices } from "../../services/api";

const NotificationSettingsShimmer = () => (
  <div className="section-card shimmer-card">
    <div className="shimmer-title"></div>
    <div className="notification-settings">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="notification-item shimmer-item">
          <div className="shimmer-text"></div>
          <div className="shimmer-switch"></div>
        </div>
      ))}
    </div>
  </div>
);

const SubscriptionDetailsShimmer = () => (
  <div className="section-card shimmer-card">
    <div className="shimmer-title"></div>
    <div className="subscription-details">
      {[1, 2, 3].map((i) => (
        <div key={i} className="detail-item shimmer-item">
          <div className="shimmer-label"></div>
          <div className="shimmer-value"></div>
        </div>
      ))}
    </div>
  </div>
);

const SecuritySettingsShimmer = () => (
  <div className="section-card shimmer-card">
    <div className="shimmer-title"></div>
    <div className="security-settings">
      {[1, 2].map((i) => (
        <div key={i} className="security-item shimmer-item">
          <div className="shimmer-text-block">
            <div className="shimmer-heading"></div>
            <div className="shimmer-description"></div>
          </div>
          <div className="shimmer-button"></div>
        </div>
      ))}
    </div>
  </div>
);

const SettingsShimmer = () => (
  <div className="settings-content">
    <NotificationSettingsShimmer />
    <SubscriptionDetailsShimmer />
    <SecuritySettingsShimmer />
  </div>
);

const Settings = () => {
  // Add state for invoices
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [modifiedSettings, setModifiedSettings] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [invoicesData, setInvoicesData] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDeactivateModal = () => {
    setIsDeactivateModalOpen(true);
  };

  const closeDeactivateModal = () => {
    setIsDeactivateModalOpen(false);
  };

  // Add function to fetch invoices
  const fetchInvoicesData = async () => {
    try {
      setInvoicesLoading(true);
      // Get company ID from localStorage
      const companyId = localStorage.getItem('companyId');
      if (!companyId) {
        throw new Error('Company ID not found');
      }

      const response = await getCompanyInvoices({
        company_id: parseInt(companyId),
        page: 1,
        limit: 10
      });

      if (response.data && Array.isArray(response.data)) {
        setInvoicesData(response.data);
      }
    } catch (err) {
      console.error("Error fetching company invoices:", err);
      message.error("Failed to load invoice history. Please try again.");
    } finally {
      setInvoicesLoading(false);
    }
  };

  // Load both subscription and invoices data on component mount
  useEffect(() => {
    const loadData = async () => {
      await fetchSubscriptionData();
      await fetchInvoicesData();
    };

    loadData();
  }, []);

  const handlePasswordChange = async (passwordData) => {
    try {
      // Get user email from localStorage; assume userData is stored as a JSON string.
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.email) {
        throw new Error("User email not found");
      }

      const payload = {
        email: userData.email,
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      };

      // Call the API to reset password
      const response = await changePassword(payload);

      message.success("Password changed successfully");
      closeModal();
    } catch (err) {
      console.error("Error changing password:", err);
      message.error("Failed to change password. Please try again.");
    }
  };

  const handleDeactivateAccount = async (deactivationData) => {
    try {
      // Get company ID from localStorage
      const companyId = localStorage.getItem('companyId');
      if (!companyId) {
        throw new Error('Company ID not found');
      }

      // Prepare the payload with company ID and form data
      const payload = {
        company_id: parseInt(companyId),
        deactivation_reason: deactivationData.reason,
        detailed_reason: deactivationData.details
      };

      // Call the API to request account deactivation
      const response = await requestDeactivation(payload);

      message.success("Deactivation request submitted successfully");
      closeDeactivateModal();
    } catch (err) {
      console.error("Error deactivating account:", err);
      message.error("Failed to submit deactivation request. Please try again.");
    }
  };

  const notificationSettingsConfig = [
    { key: "email_notification", name: "Email Notifications" },
    { key: "sms_notification", name: "SMS Notifications" },
    { key: "workshop_event_reminder", name: "Workshop & Event Reminders (48 hours & 1 hour before event)" },
    { key: "system_updates_announcement", name: "System Updates & Announcements" }
  ];

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      // Get company ID from localStorage
      const companyId = localStorage.getItem('companyId');
      if (!companyId) {
        throw new Error('Company ID not found');
      }

      const response = await getCompanySubscription(companyId);
      setSubscriptionData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching subscription data:", err);
      setError("Failed to load subscription settings");
      setLoading(false);
      message.error("Failed to load subscription settings. Please try again.");
    }
  };

  // Check if there are any unsaved changes
  const hasUnsavedChanges = () => {
    if (!modifiedSettings || !subscriptionData) return false;

    return notificationSettingsConfig.some(setting => {
      const originalValue = subscriptionData[setting.key];
      const modifiedValue = modifiedSettings[setting.key];
      return originalValue !== modifiedValue && modifiedValue !== undefined;
    });
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!hasUnsavedChanges()) return;

    try {
      setSaving(true);
      const companyId = localStorage.getItem('companyId');
      if (!companyId) throw new Error('Company ID not found');

      // Prepare payload with original data + modifications
      const payload = {
        company_id: parseInt(companyId),
        plan_type: subscriptionData.plan_type,
        ...notificationSettingsConfig.reduce((acc, setting) => {
          acc[setting.key] = modifiedSettings[setting.key] !== undefined
            ? modifiedSettings[setting.key]
            : subscriptionData[setting.key];
          return acc;
        }, {})
      };

      const response = await updateCompanySubscription(payload);

      // Update the subscription data with the server response
      setSubscriptionData(response.data);
      setModifiedSettings(null);

      message.success("Settings updated successfully");
    } catch (err) {
      console.error("Error saving subscription settings:", err);
      message.error("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSwitchChange = (key, checked) => {
    const currentModified = modifiedSettings || {};

    setModifiedSettings({
      ...currentModified,
      [key]: checked ? 1 : 0
    });
  };

  // Format date string to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "€0.00";
    return `€${parseFloat(amount).toFixed(2)}`;
  };

  // Add this function to determine if subscription is active
  const isSubscriptionActive = (renewalDate) => {
    if (!renewalDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset hours to compare just the dates

    const renewal = new Date(renewalDate);
    renewal.setHours(0, 0, 0, 0);

    return renewal >= today;
  };

  // Add this function to get appropriate CSS class
  const getStatusClass = (renewalDate) => {
    return isSubscriptionActive(renewalDate) ? "status-active" : "status-inactive";
  };

  // Update columns for real invoice data
  // const columns = [
  //   {
  //     title: "Invoice #",
  //     dataIndex: "invoice_number",
  //     key: "invoice_number",
      
  //   },
  //   {
  //     title: "Date",
  //     dataIndex: "issue_date",
  //     key: "issue_date",
  //     render: (date) => formatDate(date),
  //   },
  //   {
  //     title: "Amount",
  //     dataIndex: "amount",
  //     key: "amount",
  //     render: (amount) => formatCurrency(amount),
  //   },
  //   {
  //     title: "Status",
  //     dataIndex: "status",
  //     key: "status",
  //     render: (status) => (
  //       <span className={`invoice-status ${status.toLowerCase()}`}>
  //         {status.charAt(0).toUpperCase() + status.slice(1)}
  //       </span>
  //     ),
  //   },
  //   {
  //     title: "Action",
  //     key: "action",
  //     render: (_, record) => (
  //       <a href="#" className="download-link">
  //         Download receipt
  //       </a>
  //     ),
  //   },
  // ];

  // If loading, show loading spinner
  if (loading) {
    return (
      <div className="settings-container">
        <CustomHeader
          title="Settings"
          showBackButton={true}
          showEditButton={false}
          showFilterButton={false}
        />
        <SettingsShimmer />
      </div>
    );
  }

  return (
    <div className="settings-container">
      <CustomHeader
        title="Settings"
        showBackButton={true}
        showEditButton={true}
        showFilterButton={false}
        buttonText="Save changes"
        onEditClick={handleSaveChanges}
        buttonDisabled={!hasUnsavedChanges() || saving}
        buttonLoading={saving}
      />
      <div className="settings-content">
        <div className="section-card">
          <h3>Notifications</h3>
          <div className="notification-settings">
            {notificationSettingsConfig.map((setting) => (
              <div key={setting.key} className="notification-item">
                <span>{setting.name}</span>
                <Switch
                  checked={(modifiedSettings && modifiedSettings[setting.key] !== undefined)
                    ? !!modifiedSettings[setting.key]
                    : subscriptionData ? !!subscriptionData[setting.key] : false}
                  onChange={(checked) => handleSwitchChange(setting.key, checked)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Billing History Section */}
        {/* <div className="section-card">
          <h3>Billing History & Invoices</h3>
          <div className="current-plan">
            <div className="plan-details">
              <div className="plan-item">
                <span className="label">Current plan</span>
                <span className="value">
                  {subscriptionData?.plan_type
                    ? subscriptionData.plan_type.charAt(0).toUpperCase() + subscriptionData.plan_type.slice(1)
                    : "N/A"}
                </span>
              </div>
              <div className="plan-item">
                <span className="label">Renewal date</span>
                <span className="value">{formatDate(subscriptionData?.renewal_date)}</span>
              </div>
              <div className="plan-item">
                <span className="label">Status</span>
                <span className={`status-badge ${getStatusClass(subscriptionData?.renewal_date)}`}>
                  {isSubscriptionActive(subscriptionData?.renewal_date) ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div> */}

        {/* Transaction History Section */}
        {/* <div className="section-card">
          <h3>Transaction History</h3>
          <Table
            columns={columns}
            dataSource={invoicesData}
            pagination={false}
            className="transaction-table"
            loading={invoicesLoading}
            rowKey="id"
            locale={{ emptyText: "No invoice records found" }}
            showSorterTooltip={false}
            bordered={false}
          />
        </div> */}

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
            <button className="settings-button" onClick={openModal}>Change password</button>
          </div>

          <div className="settings-item">
            <div className="settings-section">
              <div className="settings-title">Deactivate account</div>
              <div className="settings-description">
                Send an account deactivation request to the Neure team.
              </div>
            </div>
            <button className="settings-button" onClick={openDeactivateModal}>Request Deactivation</button>
          </div>
        </div>
      </div>

      <PasswordChangeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handlePasswordChange}
        isFromSettings={true}
      />

      <DeactivateAccountModal
        isOpen={isDeactivateModalOpen}
        onClose={closeDeactivateModal}
        onSubmit={handleDeactivateAccount}
      />
    </div>
  );
};

export default Settings;
