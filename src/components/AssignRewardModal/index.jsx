import React, { useState } from 'react';
import { Modal, Table, Input, Spin, Alert, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './AssignRewardModal.css';
import { assignReward } from '../../services/api';

const TableRowShimmer = () => (
  <tr className="shimmer-row">
    <td className="shimmer-cell">
      <div className="shimmer-checkbox" />
    </td>
    <td className="shimmer-cell">
      <div className="shimmer-text" />
    </td>
    <td className="shimmer-cell">
      <div className="shimmer-text" />
    </td>
    <td className="shimmer-cell">
      <div className="shimmer-text" />
    </td>
    <td className="shimmer-cell">
      <div className="shimmer-text" />
    </td>
  </tr>
);

const AssignRewardModal = ({
  isOpen,
  onClose,
  rewardTitle,
  rewardId,
  employeesData = [],
  isLoading,
  error
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [assigningReward, setAssigningReward] = useState(false);


  const columns = [
    {
      title: 'Sr no.',
      dataIndex: 'srNo',
      key: 'srNo',
      width: '80px',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          record.fullName.toLowerCase().includes(value.toLowerCase()) ||
          record.department.toLowerCase().includes(value.toLowerCase())
        );
      },
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
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleSendReward = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one employee');
      return;
    }

    const companyId = localStorage.getItem('companyId');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const adminId = userData.id;

    if (!companyId) {
      message.error('Company ID not found');
      return;
    }

    setAssigningReward(true);

    try {
      // Use the new payload format
      const payload = {
        company_id: companyId,
        user_ids: selectedRowKeys,
        reward_id: rewardId,
        admin_id: adminId
      };

      await assignReward(payload);

      message.success(`Reward successfully assigned to ${selectedRowKeys.length} employee(s)`);
      onClose();
    } catch (err) {
      console.error('Error assigning reward:', err);
      message.error('Failed to assign reward');
    } finally {
      setAssigningReward(false);
    }
  };

  // Reset selections when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedRowKeys([]);
      setSearchText('');
    }
  }, [isOpen]);

  return (
    <Modal
      title={
        <div className="assign-modal-header">
          <h3>Select employees to assign rewards</h3>
          <p className="reward-type">For: <span>{rewardTitle}</span></p>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={1000}
      className="assign-reward-modal"
      footer={[
        <button
          key="send"
          className="send-reward-btn"
          onClick={handleSendReward}
          disabled={assigningReward || selectedRowKeys.length === 0}
        >
          {assigningReward ? 'Sending...' : 'Send reward'}
        </button>
      ]}
    >
      <div className="employee-search-container">
        <SearchOutlined className="search-icon" />
        <input
          type="text"
          placeholder="Search name, department"
          onChange={(e) => setSearchText(e.target.value)}
          className="employee-search"
        />
      </div>

      {isLoading ? (
        <div className="shimmer-table-container">
          <div className="shimmer-table">
            <div className="shimmer-header">
              <div className="shimmer-header-cell">
                <div className="shimmer-checkbox" />
              </div>
              <div className="shimmer-header-cell">
                <div className="shimmer-text" />
              </div>
              <div className="shimmer-header-cell">
                <div className="shimmer-text" />
              </div>
              <div className="shimmer-header-cell">
                <div className="shimmer-text" />
              </div>
              <div className="shimmer-header-cell">
                <div className="shimmer-text" />
              </div>
            </div>
            <div className="shimmer-body">
              {[...Array(5)].map((_, index) => (
                <TableRowShimmer key={index} />
              ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={employeesData}
          className="employee-selection-table"
          pagination={false}
          scroll={{ y: 400 }}
        />
      )}
    </Modal>
  );
};

export default AssignRewardModal;
