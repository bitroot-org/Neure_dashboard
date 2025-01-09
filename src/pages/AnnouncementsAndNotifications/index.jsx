import React, { useState } from 'react';
import { Tabs, List, Space, Button } from 'antd';
import { LeftOutlined, BellOutlined } from '@ant-design/icons';
import { allData, announcementsData, notificationsData } from '../../constants/faqData';
import BackButton from '../../components/Button';


const AnnouncementsNotifications = () => {
  const [activeTab, setActiveTab] = useState('all');

  const getItemIcon = (type) => {
    switch (type) {
      case 'notification':
        return <img src='notifications.png' />;
      default:
        return <img src='announcements.png'/>
        
    }
  };

  const renderList = (data) => (
    <List
      dataSource={data}
      renderItem={item => (
        <List.Item
          key={item.id}
          className="border-b border-gray-800 cursor-pointer px-4 py-6"
        >
          <List.Item.Meta
            avatar={getItemIcon(item.type)}
            title={
              <Space>
                <span className="text-white">{item.title}</span>
                {item.isNew && (
                  <span className="bg-red-500 w-2 h-2 rounded-full inline-block" />
                )}
              </Space>
            }
            description={
              <div>
                <p className="text-gray-400 mb-1">{item.description}</p>
                <small className="text-gray-500">{`${item.type.charAt(0).toUpperCase() + item.type.slice(1)} • ${item.date}`}</small>
              </div>
            }
            
          />
        </List.Item>
      )}
    />
  );

  return (
    <div className="min-h-full bg-black">
      <div className="w-full">
        <BackButton text="Announcements & Notifications" />
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

export default AnnouncementsNotifications;