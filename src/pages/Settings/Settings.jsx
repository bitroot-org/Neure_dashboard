import React, { useState, useEffect } from "react";
import { Card, Switch, Table, message } from "antd";
import CustomHeader from "../../components/CustomHeader";
import PasswordChangeModal from "../../components/PasswordChangeModal";
import DeactivateAccountModal from "../../components/DeactivateAccountModal";
import { getCompanySubscription, updateCompanySubscription, changePassword, requestDeactivation, getCompanyInvoices } from "../../services/api";

const NotificationSettingsShimmer = () => (
  <div className="rounded-2xl bg-[#2D2F39] p-6 mb-6">
    <div className="mb-6 h-6 w-[150px] rounded bg-[length:200%_100%] animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg,#363845 0%,#404252 50%,#363845 100%)' }} />
    <div className="flex flex-col gap-4 pt-6">
      {[1,2,3,4].map(i => (
        <div key={i} className="flex items-center justify-between border-b border-white/10 py-3">
          <div className="h-4 w-[200px] rounded bg-[length:200%_100%] animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg,#363845 0%,#404252 50%,#363845 100%)' }} />
          <div className="h-5 w-10 rounded-full bg-[length:200%_100%] animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg,#363845 0%,#404252 50%,#363845 100%)' }} />
        </div>
      ))}
    </div>
  </div>
);

const SubscriptionDetailsShimmer = () => (
  <div className="rounded-2xl bg-[#2D2F39] p-6 mb-6">
    <div className="mb-6 h-6 w-[150px] rounded bg-[length:200%_100%] animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg,#363845 0%,#404252 50%,#363845 100%)' }} />
    <div className="flex flex-col gap-4">
      {[1,2,3].map(i => (
        <div key={i} className="flex items-center justify-between border-b border-white/10 py-3">
          <div className="h-4 w-[120px] rounded bg-[length:200%_100%] animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg,#363845 0%,#404252 50%,#363845 100%)' }} />
          <div className="h-4 w-[150px] rounded bg-[length:200%_100%] animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg,#363845 0%,#404252 50%,#363845 100%)' }} />
        </div>
      ))}
    </div>
  </div>
);

const SecuritySettingsShimmer = () => (
  <div className="rounded-2xl bg-[#2D2F39] p-6 mb-6">
    <div className="mb-6 h-6 w-[150px] rounded bg-[length:200%_100%] animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg,#363845 0%,#404252 50%,#363845 100%)' }} />
    <div className="flex flex-col gap-4">
      {[1,2].map(i => (
        <div key={i} className="flex items-center justify-between py-3">
          <div className="flex flex-col gap-2">
            <div className="h-5 w-[180px] rounded bg-[length:200%_100%] animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg,#363845 0%,#404252 50%,#363845 100%)' }} />
            <div className="h-4 w-[250px] rounded opacity-70 bg-[length:200%_100%] animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg,#363845 0%,#404252 50%,#363845 100%)' }} />
          </div>
          <div className="h-9 w-[120px] rounded-lg bg-[length:200%_100%] animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg,#363845 0%,#404252 50%,#363845 100%)' }} />
        </div>
      ))}
    </div>
  </div>
);

const SettingsShimmer = () => (
  <div className="w-full max-w-[1400px] mx-auto p-9 border border-[#333] rounded-[18px]">
    <NotificationSettingsShimmer />
    <SubscriptionDetailsShimmer />
    <SecuritySettingsShimmer />
  </div>
);

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [modifiedSettings, setModifiedSettings] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [invoicesData, setInvoicesData] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);

  const notificationSettingsConfig = [
    { key: "email_notification", name: "Email Notifications" },
    { key: "sms_notification", name: "SMS Notifications" },
    { key: "workshop_event_reminder", name: "Workshop & Event Reminders (48 hours & 1 hour before event)" },
    { key: "system_updates_announcement", name: "System Updates & Announcements" },
  ];

  const fetchInvoicesData = async () => {
    try {
      setInvoicesLoading(true);
      const companyId = localStorage.getItem('companyId');
      if (!companyId) throw new Error('Company ID not found');
      const response = await getCompanyInvoices({ company_id: parseInt(companyId), page: 1, limit: 10 });
      if (response.data && Array.isArray(response.data)) setInvoicesData(response.data);
    } catch (err) {
      console.error("Error fetching company invoices:", err);
      message.error("Failed to load invoice history. Please try again.");
    } finally {
      setInvoicesLoading(false);
    }
  };

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const companyId = localStorage.getItem('companyId');
      if (!companyId) throw new Error('Company ID not found');
      const response = await getCompanySubscription(companyId);
      setSubscriptionData(response.data);
    } catch (err) {
      console.error("Error fetching subscription data:", err);
      message.error("Failed to load subscription settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchSubscriptionData();
      await fetchInvoicesData();
    };
    loadData();
  }, []);

  const hasUnsavedChanges = () => {
    if (!modifiedSettings || !subscriptionData) return false;
    return notificationSettingsConfig.some(setting => {
      const originalValue = subscriptionData[setting.key];
      const modifiedValue = modifiedSettings[setting.key];
      return originalValue !== modifiedValue && modifiedValue !== undefined;
    });
  };

  const handleSaveChanges = async () => {
    if (!hasUnsavedChanges()) return;
    try {
      setSaving(true);
      const companyId = localStorage.getItem('companyId');
      if (!companyId) throw new Error('Company ID not found');
      const payload = {
        company_id: parseInt(companyId),
        plan_type: subscriptionData.plan_type,
        ...notificationSettingsConfig.reduce((acc, setting) => {
          acc[setting.key] = modifiedSettings?.[setting.key] !== undefined ? modifiedSettings[setting.key] : subscriptionData[setting.key];
          return acc;
        }, {}),
      };
      const response = await updateCompanySubscription(payload);
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
    setModifiedSettings(prev => ({ ...(prev || {}), [key]: checked ? 1 : 0 }));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openDeactivateModal = () => setIsDeactivateModalOpen(true);
  const closeDeactivateModal = () => setIsDeactivateModalOpen(false);

  const handlePasswordChange = async (passwordData) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.email) throw new Error("User email not found");
      await changePassword({
        email: userData.email,
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });
      message.success("Password changed successfully");
      closeModal();
    } catch (err) {
      console.error("Error changing password:", err);
      message.error("Failed to change password. Please try again.");
    }
  };

  const handleDeactivateAccount = async (deactivationData) => {
    try {
      const companyId = localStorage.getItem('companyId');
      if (!companyId) throw new Error('Company ID not found');
      await requestDeactivation({
        company_id: parseInt(companyId),
        deactivation_reason: deactivationData.reason,
        detailed_reason: deactivationData.details,
      });
      message.success("Deactivation request submitted successfully");
      closeDeactivateModal();
    } catch (err) {
      console.error("Error deactivating account:", err);
      message.error("Failed to submit deactivation request. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full overflow-hidden px-5 sm:px-10 lg:px-20 py-10 bg-[radial-gradient(108.08%_74.37%_at_50%_0%,_#33353F_0%,_#0D0D11_99.73%)]">
        <CustomHeader title="Settings" showBackButton />
        <SettingsShimmer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-hidden px-5 sm:px-10 lg:px-20 py-10 bg-[radial-gradient(108.08%_74.37%_at_50%_0%,_#33353F_0%,_#0D0D11_99.73%)] [&_.ant-switch.ant-switch-checked]:!bg-[#00d885] [&_.ant-switch]:!bg-[#3b3d47] [&_.ant-switch]:!min-w-[45px] [&_.ant-switch-handle]:!w-5 [&_.ant-switch-handle]:!h-5 [&_.ant-switch-handle]:!top-[2px]">
      <CustomHeader
        title="Settings"
        showBackButton
        showEditButton
        showFilterButton={false}
        buttonText="Save changes"
        onEditClick={handleSaveChanges}
        buttonDisabled={!hasUnsavedChanges() || saving}
        buttonLoading={saving}
      />

      <div className="w-full max-w-[1400px] mx-auto p-9 border border-[#333] rounded-[18px]">
        {/* Notifications */}
        <div className="mb-6">
          <h3 className="text-white text-2xl font-normal">Notifications</h3>
          <div className="flex flex-col gap-4 pt-6">
            {notificationSettingsConfig.map((setting) => (
              <div key={setting.key} className="flex items-center justify-between border-b border-[#333] px-5 py-4 text-white text-lg">
                <span>{setting.name}</span>
                <Switch
                  checked={modifiedSettings?.[setting.key] !== undefined ? !!modifiedSettings[setting.key] : !!subscriptionData?.[setting.key]}
                  onChange={(checked) => handleSwitchChange(setting.key, checked)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Account settings */}
        <div className="mb-6">
          <h3 className="mb-4 text-white text-2xl font-normal">Account settings</h3>

          <div className="mt-5 flex items-center justify-between rounded-[18px] border border-[#333] p-6">
            <div className="text-white">
              <div className="text-lg font-bold">Change password</div>
              <div className="text-base text-white/80">Change your current password to a stronger one.</div>
            </div>
            <button onClick={openModal} className="h-12 min-w-[160px] rounded-[70px] bg-gradient-to-b from-white to-[#797b87] px-4 text-base font-medium text-black hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]">
              Change password
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-[18px] border border-[#333] p-6">
            <div className="text-white">
              <div className="text-lg font-bold">Deactivate account</div>
              <div className="text-base text-white/80">Send an account deactivation request to the Neure team.</div>
            </div>
            <button onClick={openDeactivateModal} className="h-12 min-w-[160px] rounded-[70px] bg-gradient-to-b from-white to-[#797b87] px-4 text-base font-medium text-black hover:shadow-[0_0_50px_rgba(255,255,255,0.5)]">
              Request Deactivation
            </button>
          </div>
        </div>
      </div>

      <PasswordChangeModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handlePasswordChange} isFromSettings />
      <DeactivateAccountModal isOpen={isDeactivateModalOpen} onClose={closeDeactivateModal} onSubmit={handleDeactivateAccount} />
    </div>
  );
};

export default Settings;

