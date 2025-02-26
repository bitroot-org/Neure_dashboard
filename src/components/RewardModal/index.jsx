import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Table, Spin, Alert } from 'antd';
import './RewardModal.css';
import { getEmployeeRewardHistory } from '../../services/api';

const RewardModal = ({ isOpen, onClose, rewardTitle, termsAndConditions, rewardId }) => {
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // Parse terms and conditions
  const parseTerms = () => {
    if (!termsAndConditions) {
      return [];
    }
    return termsAndConditions.split('\n');
  };

  const terms = parseTerms();

  // Fetch reward history when modal opens
  useEffect(() => {
    if (isOpen && rewardId) {
      fetchRewardHistory();
    }
  }, [isOpen, rewardId]);

  const fetchRewardHistory = async () => {
    setHistoryLoading(true);
    setHistoryError(null);

    try {
      const companyId = localStorage.getItem('companyId');
      if (!companyId) {
        throw new Error('Company ID not found');
      }

      const response = await getEmployeeRewardHistory({
        company_id: companyId,
        reward_id: rewardId
      });

      // Format the response data for table
      const formattedHistory = response.data.map((item, index) => ({
        key: item.id.toString(),
        srNo: index + 1,
        fullName: `${item.first_name} ${item.last_name}`,
        email: item.email,
        contact: item.phone || 'N/A',
        department: item.department_name || 'N/A',
        rewardedOn: new Date(item.awarded_at).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      }));

      setHistoryData(formattedHistory);
      setHistoryLoading(false);
    } catch (err) {
      console.error("Error fetching reward history:", err);
      setHistoryError("Failed to load reward history");
      setHistoryLoading(false);
    }
  };

  const columns = [
    {
      title: 'Sr no.',
      dataIndex: 'srNo',
      key: 'srNo',
      width: '70px',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Official Email ID',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Contact Number',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Rewarded on',
      dataIndex: 'rewardedOn',
      key: 'rewardedOn',
    },
  ];

  const items = [
    {
      key: '1',
      label: 'Terms & Conditions',
      children: (
        <div className="terms-container">
          {terms.length > 0 ? (
            terms.map((term, index) => (
              <div key={index} className="term-item">
                {term}
              </div>
            ))
          ) : (
            <p>No terms and conditions available.</p>
          )}
        </div>
      ),
    },
    {
      key: '2',
      label: 'Reward History',
      children: (
        <>
          {historyLoading ? (
            <div className="loading-container">
              <Spin tip="Loading history..." />
            </div>
          ) : historyError ? (
            <Alert message={historyError} type="error" showIcon />
          ) : historyData.length === 0 ? (
            <div className="no-data-message">
              <p>No reward history available.</p>
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={historyData}
              pagination={false}
              className="reward-history-table"
            />
          )}
        </>
      ),
    },
  ];

  return (
    <Modal
      title={rewardTitle}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      className="reward-modal"
      closeIcon={<span className="close-icon">×</span>}
    >
      <Tabs
        defaultActiveKey="1"
        items={items}
        className="reward-tabs"
      />
    </Modal>
  );
};

export default RewardModal;