import React from 'react';
import { Modal, Tabs, Table } from 'antd';
import './RewardModal.css';

const RewardModal = ({ isOpen, onClose, rewardTitle }) => {
  const terms = [
    "The pass can be redeemed with a minimum of 24 hours' notice, subject to approval based on work schedules and team availability.",
    "Employees must remain accessible and responsive during working hours to ensure collaboration and productivity.",
    "All meetings, deadlines, and assigned tasks must be completed as per schedule, just like an in-office workday.",
    "The pass cannot be combined with paid leave, sick leave, or other time-off requests to extend a break.",
    "On critical business days (such as company-wide events, client meetings, or deadlines), managers may request an alternate WFH date.",
    "The pass cannot be transferred or gifted to another employee and is meant for individual use only.",
    "Employees must log their working hours and daily progress in the designated system or report to their manager as required.",
    "The company reserves the right to suspend or modify this benefit if it is misused or affects business operations.",
    "The WFH pass is a privilege aimed at enhancing work-life balance—employees are expected to use it responsibly and ethically."
  ];

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

  const historyData = [
    {
      key: '1',
      srNo: 1,
      fullName: 'Alice Johnson',
      email: 'example@mail.com',
      contact: '+919876543210',
      department: 'Engineering',
      rewardedOn: '12 Oct 2024',
    },
    {
      key: '1',
      srNo: 1,
      fullName: 'Alice Johnson',
      email: 'example@mail.com',
      contact: '+919876543210',
      department: 'Engineering',
      rewardedOn: '12 Oct 2024',
    },
    {
      key: '1',
      srNo: 1,
      fullName: 'Alice Johnson',
      email: 'example@mail.com',
      contact: '+919876543210',
      department: 'Engineering',
      rewardedOn: '12 Oct 2024',
    },
    {
      key: '1',
      srNo: 1,
      fullName: 'Alice Johnson',
      email: 'example@mail.com',
      contact: '+919876543210',
      department: 'Engineering',
      rewardedOn: '12 Oct 2024',
    },
    {
      key: '1',
      srNo: 1,
      fullName: 'Alice Johnson',
      email: 'example@mail.com',
      contact: '+919876543210',
      department: 'Engineering',
      rewardedOn: '12 Oct 2024',
    },
    // Add more data as needed
  ];

  const items = [
    {
      key: '1',
      label: 'Terms & Conditions',
      children: (
        <div className="terms-container">
          {terms.map((term, index) => (
            <div key={index} className="term-item">
              {index + 1}. {term}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: '2',
      label: 'Reward History',
      children: (
        <Table
          columns={columns}
          dataSource={historyData}
          pagination={false}
          scroll={{ x: true }}
          className="reward-history-table"
        />
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