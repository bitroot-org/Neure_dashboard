import React, { useState, useEffect } from "react";
import { Tabs, List, Space } from "antd";
import "./index.css";
import CustomHeader from "../../components/CustomHeader";
import { getNotificationAndAnnouncements, getAnnouncements, getNotifications } from "../../services/api";

const AnnouncementsAndNotifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [data, setData] = useState({ announcements: [], notifications: [] });
  const [loading, setLoading] = useState(true);

  const companyId = localStorage.getItem("companyId");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData.id;
  

  const fetchData = async (tab) => {
    try {
      setLoading(true);
      const params = {
        companyId: companyId, // Replace with actual company_id
        // userId: userId,    // Replace with actual user_id
        currentPage: 1,
        limit: 10,
      };

      if (tab === "announcements") {
        const response = await getAnnouncements(params);
        setData(prevData => ({
          ...prevData,
          announcements: response.data.announcements
        }));
      } else if (tab === "notifications") {
        const response = await getNotifications(params);
        setData(prevData => ({
          ...prevData,
          notifications: response.data.notifications
        }));
      } else {
        // For "all" tab, fetch both
        const [announcementsRes, notificationsRes] = await Promise.all([
          getAnnouncements(params),
          getNotifications(params)
        ]);
        
        setData({
          announcements: announcementsRes.data.announcements,
          notifications: notificationsRes.data.notifications || []
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const getItemIcon = (type, item) => {
    if (item.source === 'notification' || item.type) {
      return <img src="/notifications.png" alt="notification icon" />;
    }
    return <img src="/announcements.png" alt="announcement icon" />;
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
            avatar={getItemIcon(item.type, item)}
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
                  {`${item.type || item.audience_type || 'Notification'} • ${formatDate(item.created_at)}`}
                </small>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );

  const getAllItems = () => {
    // Combine both arrays and mark their source
    const combinedItems = [
      ...data.announcements.map(item => ({ ...item, source: 'announcement' })),
      ...data.notifications.map(item => ({ ...item, source: 'notification' }))
    ];

    // Sort by date in descending order (newest first)
    return combinedItems.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    });
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
