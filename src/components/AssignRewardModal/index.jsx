import React, { useState } from 'react';
import { Modal, Table, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './AssignRewardModal.css';

const { Search } = Input;

const AssignRewardModal = ({ isOpen, onClose, rewardTitle }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');

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

  const data = [
    {
      key: '1',
      srNo: 1,
      fullName: 'Alice Johnson',
      email: 'example@mail.com',
      contact: '+919876543210',
      department: 'Engineering',
    },
    {
      key: '2',
      srNo: 2,
      fullName: 'Bob Smith',
      email: 'example@mail.com',
      contact: '+919876543210',
      department: 'Marketing',
    },
    {
      key: '3',
      srNo: 3,
      fullName: 'Charlie Brown',
      email: 'example@mail.com',
      contact: '+919876543210',
      department: 'Sales',
    },
    {
      key: '4',
      srNo: 4,
      fullName: 'Dave Wilson',
      email: 'example@mail.com',
      contact: '+919876543210',
      department: 'HR',
    }
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleSendReward = () => {
    console.log('Sending reward to:', selectedRowKeys);
    onClose();
  };

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
        <button key="send" className="send-reward-btn" onClick={handleSendReward}>
          Send reward
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
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        className="employee-selection-table"
        pagination={false}
        scroll={{ y: 400 }}
      />
    </Modal>
  );
};

export default AssignRewardModal;