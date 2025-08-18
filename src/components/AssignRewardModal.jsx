import React, { useState } from 'react';
import { Modal, Table, Input, Spin, Alert, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { assignReward } from '../services/api';

const TableRowShimmer = () => (
  <tr className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] p-4 border-b border-white/10">
    <td className="p-2">
      <div className="w-4 h-4 bg-[#2D2F39] rounded animate-pulse" />
    </td>
    <td className="p-2">
      <div className="h-5 bg-gradient-to-r from-[#2D2F39] via-[#363845] to-[#2D2F39] bg-[length:200%_100%] rounded animate-[shimmer_1.5s_infinite_linear] w-4/5" />
    </td>
    <td className="p-2">
      <div className="h-5 bg-gradient-to-r from-[#2D2F39] via-[#363845] to-[#2D2F39] bg-[length:200%_100%] rounded animate-[shimmer_1.5s_infinite_linear] w-4/5" />
    </td>
    <td className="p-2">
      <div className="h-5 bg-gradient-to-r from-[#2D2F39] via-[#363845] to-[#2D2F39] bg-[length:200%_100%] rounded animate-[shimmer_1.5s_infinite_linear] w-4/5" />
    </td>
    <td className="p-2">
      <div className="h-5 bg-gradient-to-r from-[#2D2F39] via-[#363845] to-[#2D2F39] bg-[length:200%_100%] rounded animate-[shimmer_1.5s_infinite_linear] w-4/5" />
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
        <div>
          <h3 className="text-white text-2xl font-semibold">Select employees to assign rewards</h3>
          <p className="text-white/60 mt-1 text-base font-normal">For: <span className="text-white">{rewardTitle}</span></p>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={1000}
      className="[&_.ant-modal-content]:bg-black [&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:text-white [&_.ant-modal-content]:border [&_.ant-modal-content]:border-white/20 [&_.ant-modal-header]:bg-transparent [&_.ant-modal-header]:border-b [&_.ant-modal-header]:border-[#333] [&_.ant-modal-header]:pb-4 [&_.ant-modal-header]:px-0 [&_.ant-modal-close]:text-white [&_.ant-modal-close]:text-2xl [&_.ant-modal-close]:top-5 [&_.ant-modal-close]:right-5 [&_.ant-modal-close:hover]:text-[#1890ff]"
      footer={[
        <button
          key="send"
          className="bg-gradient-to-b from-white to-[#797b87] text-black h-12 px-6 rounded-[70px] cursor-pointer text-base font-medium mt-3 hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] border-none disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSendReward}
          disabled={assigningReward || selectedRowKeys.length === 0}
        >
          {assigningReward ? 'Sending...' : 'Send reward'}
        </button>
      ]}
    >
      <div className="relative w-full h-12 max-w-[400px] my-[18px]">
        <SearchOutlined className="absolute top-1/2 left-[10px] transform -translate-y-1/2 text-xl font-bold text-white" />
        <input
          type="text"
          placeholder="Search name, department"
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full py-2 px-2 pl-9 text-base border border-white/10 rounded-xl bg-[#191a20] text-white mb-4"
        />
      </div>

      {isLoading ? (
        <div className="border border-white/10 rounded-2xl overflow-hidden mt-4 h-[400px]">
          <div className="w-full bg-[#191a20]">
            <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] p-4 border-b border-white/10">
              <div className="p-2">
                <div className="w-4 h-4 bg-[#2D2F39] rounded animate-pulse" />
              </div>
              <div className="p-2">
                <div className="h-5 bg-gradient-to-r from-[#2D2F39] via-[#363845] to-[#2D2F39] bg-[length:200%_100%] rounded animate-[shimmer_1.5s_infinite_linear] w-4/5" />
              </div>
              <div className="p-2">
                <div className="h-5 bg-gradient-to-r from-[#2D2F39] via-[#363845] to-[#2D2F39] bg-[length:200%_100%] rounded animate-[shimmer_1.5s_infinite_linear] w-4/5" />
              </div>
              <div className="p-2">
                <div className="h-5 bg-gradient-to-r from-[#2D2F39] via-[#363845] to-[#2D2F39] bg-[length:200%_100%] rounded animate-[shimmer_1.5s_infinite_linear] w-4/5" />
              </div>
              <div className="p-2">
                <div className="h-5 bg-gradient-to-r from-[#2D2F39] via-[#363845] to-[#2D2F39] bg-[length:200%_100%] rounded animate-[shimmer_1.5s_infinite_linear] w-4/5" />
              </div>
            </div>
            <div className="flex flex-col h-[calc(100%-53px)] overflow-y-auto">
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
          className="[&_.ant-table]:bg-transparent [&_.ant-table]:border [&_.ant-table]:border-white/10 [&_.ant-table]:rounded-2xl [&_.ant-table]:overflow-hidden [&_.ant-table-thead>tr>th]:bg-[#191a20] [&_.ant-table-thead>tr>th]:text-white [&_.ant-table-thead>tr>th]:border-r-0 [&_.ant-table-tbody>tr>td]:bg-[#191a20] [&_.ant-table-tbody>tr>td]:text-white [&_.ant-checkbox-wrapper_.ant-checkbox-inner]:bg-[#191a20] [&_.ant-checkbox-wrapper_.ant-checkbox-inner]:border-[#666] [&_.ant-checkbox-wrapper-checked_.ant-checkbox-inner]:bg-[#1890ff] [&_.ant-checkbox-wrapper-checked_.ant-checkbox-inner]:border-[#1890ff] [&_.ant-table-body]:overflow-y-auto [&_.ant-table-body]:scrollbar-thin [&_.ant-table-body]:scrollbar-track-[#1e1e1e] [&_.ant-table-body]:scrollbar-thumb-[#666] [&_.ant-table-body]:scrollbar-thumb-rounded"
          pagination={false}
          scroll={{ y: 400 }}
        />
      )}
    </Modal>
  );
};

export default AssignRewardModal;
