import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, List, Space } from "antd";
import { useSearchParams } from "react-router-dom";
import "./index.css";
import CustomHeader from "../../components/CustomHeader";
import {
  getNotificationAndAnnouncements,
  getAnnouncements,
  getNotifications,
} from "../../services/api";

const AnnouncementShimmer = () => (
  <List.Item className="list-item">
    <List.Item.Meta
      avatar={<div className="shimmer-avatar shimmer" />}
      title={<div className="shimmer-title shimmer" />}
      description={
        <div>
          <div className="shimmer-description shimmer" />
          <div className="shimmer-meta shimmer" />
        </div>
      }
    />
  </List.Item>
);

const ShimmerList = () => (
  <List>
    {[1, 2, 3, 4, 5].map((item) => (
      <AnnouncementShimmer key={item} />
    ))}
  </List>
);

const EmptyState = ({ type }) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case "announcements":
        return {
          icon: "/announcements.png",
          title: "No Announcements Yet",
          description:
            "Stay tuned! New company announcements will appear here.",
          buttonText: "Go to Home",
        };
      case "notifications":
        return {
          icon: "/notifications.png",
          title: "No Notifications",
          description:
            "You're all caught up! Check back later for new notifications.",
          buttonText: "Go to Home",
        };
      default:
        return {
          icon: "/bell.png",
          title: "Nothing to Show",
          description:
            "There are no announcements or notifications at the moment.",
          buttonText: "Go to Home",
        };
    }
  };

  const content = getEmptyStateContent();
  const navigate = useNavigate();

  return (
    <div className="empty-state-container">
      <div className="empty-state-icon">
        <img src={content.icon} alt="Empty state" />
      </div>
      <h2 className="empty-state-title">{content.title}</h2>
      <p className="empty-state-description">{content.description}</p>
      <button className="empty-state-button" onClick={() => navigate("/")}>
        {content.buttonText}
      </button>
    </div>
  );
};

const AnnouncementsAndNotifications = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const tabFromUrl = searchParams.get("tab");
    const savedTab = localStorage.getItem("announcementsTab");
    return tabFromUrl || savedTab || "all";
  });
  const [data, setData] = useState({ announcements: [], notifications: [] });
  const [loading, setLoading] = useState(true);

  const companyId = localStorage.getItem("companyId");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData.id;
  const navigate = useNavigate();

  // Update both URL params and localStorage when tab changes
  const handleTabChange = async (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
    localStorage.setItem("announcementsTab", newTab);
    setLoading(true); // Set loading before fetching
    await fetchData(newTab); // Wait for data to be fetched
  };

  const fetchData = async (tab) => {
    try {
      setLoading(true);
      const params = {
        companyId: companyId,
        currentPage: 1,
        limit: 10,
      };

      if (tab === "announcements") {
        const response = await getAnnouncements(params);
        setData((prevData) => ({
          ...prevData,
          announcements: response.data.announcements,
        }));
      } else if (tab === "notifications") {
        const response = await getNotifications(params);
        setData((prevData) => ({
          ...prevData,
          notifications: response.data.notifications,
        }));
      } else {
        // For "all" tab, fetch both
        const [announcementsRes, notificationsRes] = await Promise.all([
          getAnnouncements(params),
          getNotifications(params),
        ]);

        setData({
          announcements: announcementsRes.data.announcements,
          notifications: notificationsRes.data.notifications || [],
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
    if (item.source === "notification" || item.type) {
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

  const handleBack = () => {
    navigate("/"); // This will go directly to home
  };

  const renderList = (items) => {
    if (loading) {
      return <ShimmerList />;
    }

    if (!items || items.length === 0) {
      return <EmptyState type={activeTab} />;
    }

    return (
      <List
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
                    {`${
                      item.type || item.audience_type || "Notification"
                    } • ${formatDate(item.created_at)}`}
                  </small>
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  const getAllItems = () => {
    // Combine both arrays and mark their source
    const combinedItems = [
      ...data.announcements.map((item) => ({
        ...item,
        source: "announcement",
      })),
      ...data.notifications.map((item) => ({
        ...item,
        source: "notification",
      })),
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
        <CustomHeader
          title="Announcements & notifications"
          onBack={handleBack}
        />
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          className="notifications-tabs"
          items={[
            {
              key: "all",
              label: "All",
              children: loading ? <ShimmerList /> : renderList(getAllItems()),
            },
            {
              key: "announcements",
              label: "Announcements",
              children: loading ? (
                <ShimmerList />
              ) : (
                renderList(data.announcements)
              ),
            },
            {
              key: "notifications",
              label: "Notifications",
              children: loading ? (
                <ShimmerList />
              ) : (
                renderList(data.notifications)
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default AnnouncementsAndNotifications;
