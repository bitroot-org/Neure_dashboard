import React, { useState } from 'react';
import { Tabs, List, Space } from 'antd';
import { allData, announcementsData, notificationsData } from '../../constants/faqData';
import BackButton from '../../components/Button';
import './index.css';
import CustomHeader from '../../components/CustomHeader';

const AnnouncementsAndNotifications = () => {
  const [activeTab, setActiveTab] = useState('all');

  const getItemIcon = (type) => {
    switch (type) {
      case 'notification':
        return <img src='notifications.png' alt="notification icon" />;
      default:
        return <img src='announcements.png' alt="announcement icon" />;
    }
  };

  const renderList = (data) => (
    <List
      dataSource={data}
      renderItem={item => (
        <List.Item
          key={item.id}
          className="list-item"
        >
          <List.Item.Meta
            avatar={getItemIcon(item.type)}
            title={
              <Space>
                <span className="item-title">{item.title}</span>
                {item.isNew && <span className="new-indicator" />}
              </Space>
            }
            description={
              <div>
                <p className="item-description">{item.description}</p>
                <small className="item-meta">
                  {`${item.type.charAt(0).toUpperCase() + item.type.slice(1)} • ${item.date}`}
                </small>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );

  return (
    <div className="notifications-container">
      <div className="notifications-wrapper">
        <CustomHeader title="Announcements & notifications" />
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="notifications-tabs"
          items={[
            {
              key: 'all',
              label: 'All',
              children: renderList(allData)
            },
            {
              key: 'announcements',
              label: 'Announcements',
              children: renderList(announcementsData)
            },
            {
              key: 'notifications',
              label: 'Notifications',
              children: renderList(notificationsData)
            }
          ]}
        />
      </div>
    </div>
  );
};

export default AnnouncementsAndNotifications;