import React, { useState, useEffect } from "react";
import { Tabs, List, Space } from "antd";
import {
  allData,
  announcementsData,
  notificationsData,
} from "../../constants/faqData";
import "./index.css";
import CustomHeader from "../../components/CustomHeader";
import { getNotificationAndAnnouncements } from "../../services/api";

const AnnouncementsAndNotifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [data, setData] = useState({ announcements: [], notifications: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = async (tab) => {
    try {
      setLoading(true);
      const params = {
        company_id: 1, // Replace with actual company_id
        page: 1,
        limit: 10,
      };

      if (tab === "announcements") {
        params.is_announcement = 1;
      } else if (tab === "notifications") {
        params.is_notification = 1;
      }

      const response = await getNotificationAndAnnouncements(params);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const getItemIcon = (type) => {
    switch (type) {
      case "notification":
        return <img src="notifications.png" alt="notification icon" />;
      default:
        return <img src="announcements.png" alt="announcement icon" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderList = (items) => (
    <List
      loading={loading}
      dataSource={items}
      renderItem={(item) => (
        <List.Item key={item.id} className="list-item">
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
                <p className="item-description">{item.content}</p>
                <small className="item-meta">
                {`${item.type || 'Announcement'} • ${formatDate(item.created_at)}`}
                </small>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );

  const getAllItems = () => {
    return [...data.announcements, ...data.notifications].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
  };

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
              key: "all",
              label: "All",
              children: renderList(getAllItems()),
            },
            {
              key: "announcements",
              label: "Announcements",
              children: renderList(data.announcements),
            },
            {
              key: "notifications",
              label: "Notifications",
              children: renderList(data.notifications),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default AnnouncementsAndNotifications;
