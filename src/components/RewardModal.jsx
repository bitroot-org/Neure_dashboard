import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Table, Spin, Alert } from 'antd';
import { getEmployeeRewardHistory } from '../services/api';

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
        <div className="space-y-3">
          {terms.length > 0 ? (
            terms.map((term, index) => (
              <div key={index} className="text-white/80 text-sm leading-relaxed">
                {term}
              </div>
            ))
          ) : (
            <p className="text-white/60">No terms and conditions available.</p>
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
            <div className="flex justify-center items-center py-10">
              <Spin tip="Loading history..." />
            </div>
          ) : historyError ? (
            <Alert message={historyError} type="error" showIcon />
          ) : historyData.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-white text-base m-0">No reward history available.</p>
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={historyData}
              pagination={false}
              className="[&_.ant-table]:bg-transparent [&_.ant-table]:border [&_.ant-table]:border-white/10 [&_.ant-table]:rounded-2xl [&_.ant-table]:overflow-hidden [&_.ant-table-thead>tr>th]:bg-[#191a20] [&_.ant-table-thead>tr>th]:text-white [&_.ant-table-thead>tr>th]:border-r-0 [&_.ant-table-tbody>tr>td]:bg-[#191a20] [&_.ant-table-tbody>tr>td]:text-white [&_.ant-table-tbody>tr:hover>td]:bg-[#2a2a2a] [&_.ant-spin-text]:text-white"
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
      className="[&_.ant-modal-content]:bg-black [&_.ant-modal-content]:border [&_.ant-modal-content]:border-white/10 [&_.ant-modal-content]:rounded-[18px] [&_.ant-modal-content]:text-white [&_.ant-modal-close]:top-2 [&_.ant-modal-close]:right-5 [&_.ant-modal-header]:bg-transparent [&_.ant-modal-header]:border-b [&_.ant-modal-header]:border-[#333] [&_.ant-modal-header]:pb-4 [&_.ant-modal-header]:mb-5 [&_.ant-modal-header]:px-0 [&_.ant-modal-title]:text-white [&_.ant-modal-title]:text-2xl [&_.ant-modal-title]:font-bold"
      closeIcon={<span className="text-white text-[40px] font-light">×</span>}
    >
      <Tabs
        defaultActiveKey="1"
        items={items}
        className="[&_.ant-tabs-nav]:relative [&_.ant-tabs-nav]:mb-5 [&_.ant-tabs-nav::before]:content-[''] [&_.ant-tabs-nav::before]:absolute [&_.ant-tabs-nav::before]:bottom-0 [&_.ant-tabs-nav::before]:left-0 [&_.ant-tabs-nav::before]:w-full [&_.ant-tabs-nav::before]:border-b-2 [&_.ant-tabs-nav::before]:border-white/20 [&_.ant-tabs-nav::before]:z-0 [&_.ant-tabs-tab]:text-white/60 [&_.ant-tabs-tab]:text-base [&_.ant-tabs-tab]:font-medium [&_.ant-tabs-tab]:px-4 [&_.ant-tabs-tab]:py-2 [&_.ant-tabs-tab]:border-b-2 [&_.ant-tabs-tab]:border-transparent [&_.ant-tabs-tab]:transition-colors [&_.ant-tabs-tab]:duration-300 [&_.ant-tabs-tab-active]:text-white [&_.ant-tabs-tab-active]:border-white [&_.ant-tabs-tab:hover]:text-white/80 [&_.ant-tabs-content-holder]:text-white [&_.ant-tabs-tabpane]:text-white"
      />
    </Modal>
  );
};

export default RewardModal;