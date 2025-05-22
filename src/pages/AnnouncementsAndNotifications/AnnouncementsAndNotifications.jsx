import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, List, Space, Spin } from "antd";
import { useSearchParams } from "react-router-dom";
import "./index.css";
import CustomHeader from "../../components/CustomHeader";
import {
  getNotificationAndAnnouncements,
  getAnnouncements,
  getNotifications,
  markReadAnnouncement,
  markReadNotification,
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
    <div className="notifications-empty-state-container">
      <div className="empty-state-icon">
        <img src={content.icon} alt="Empty state" />
      </div>
      <h2 className="notifictions-empty-state-title">{content.title}</h2>
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
    // Get saved tab from localStorage or default to "all"
    const savedTab = localStorage.getItem("savedNotificationTab") || "all";
    return tabFromUrl || savedTab;
  });
  const [data, setData] = useState({ announcements: [], notifications: [] });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    announcements: { currentPage: 1, hasMore: true },
    notifications: { currentPage: 1, hasMore: true },
  });

  const companyId = localStorage.getItem("companyId");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData.id;
  const navigate = useNavigate();

  const allTabRef = useRef(null);
  const announcementsTabRef = useRef(null);
  const notificationsTabRef = useRef(null);

  // Get the current active ref based on tab
  const getActiveRef = () => {
    switch (activeTab) {
      case "all":
        return allTabRef;
      case "announcements":
        return announcementsTabRef;
      case "notifications":
        return notificationsTabRef;
      default:
        return allTabRef;
    }
  };

  const handleTabChange = (newTab) => {
    // Mark items in the current tab as read before changing
    if (activeTab === 'announcements' && data.announcements.length > 0) {
      markItemsAsRead(data.announcements, 'announcements');
    } else if (activeTab === 'notifications' && data.notifications.length > 0) {
      markItemsAsRead(data.notifications, 'notifications');
    } else if (activeTab === 'all') {
      if (data.announcements.length > 0) {
        markItemsAsRead(data.announcements, 'announcements');
      }
      if (data.notifications.length > 0) {
        markItemsAsRead(data.notifications, 'notifications');
      }
    }

    // Save the selected tab to localStorage
    localStorage.setItem("savedNotificationTab", newTab);
    
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });

    // Reset data and pagination when changing tabs
    setData({ announcements: [], notifications: [] });
    setPagination({
      announcements: { currentPage: 1, hasMore: true },
      notifications: { currentPage: 1, hasMore: true },
    });
    setLoading(true);

    // Initial data fetch for the new tab
    fetchData(newTab, 1, true);
  };

  const fetchData = async (tab, page, isInitialFetch = false) => {
    try {
      isInitialFetch ? setLoading(true) : setLoadingMore(true);
      const params = {
        companyId: companyId,
        userId: userId,
        currentPage: page,
        limit: 10,
      };

      if (tab === "announcements" || tab === "all") {
        const response = await getAnnouncements(params);
        const newAnnouncements = response.data.announcements || [];
        
        // Use pagination data from API to determine if there are more pages
        const paginationData = response.data.pagination || {};
        const hasMoreAnnouncements = paginationData.current_page < Math.ceil(paginationData.total / paginationData.per_page);

        setData((prevData) => ({
          ...prevData,
          announcements:
            tab === "all" && isInitialFetch
              ? newAnnouncements
              : [...prevData.announcements, ...newAnnouncements],
        }));

        setPagination((prev) => ({
          ...prev,
          announcements: {
            currentPage: page,
            hasMore: hasMoreAnnouncements,
          },
        }));
      }

      if (tab === "notifications" || tab === "all") {
        const response = await getNotifications(params);
        const newNotifications = response.data.notifications || [];
        
        // Use pagination data from API to determine if there are more pages
        const paginationData = response.data.pagination || {};
        const hasMoreNotifications = paginationData.current_page < Math.ceil(paginationData.total / paginationData.per_page);

        setData((prevData) => ({
          ...prevData,
          notifications:
            tab === "all" && isInitialFetch
              ? newNotifications
              : [...prevData.notifications, ...newNotifications],
        }));

        setPagination((prev) => ({
          ...prev,
          notifications: {
            currentPage: page,
            hasMore: hasMoreNotifications,
          },
        }));
      }
      // Removed any code that would mark items as read during data fetching
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreData = useCallback(() => {
    if (loadingMore) return;

    const currentPagination =
      activeTab === "announcements"
        ? pagination.announcements
        : activeTab === "notifications"
        ? pagination.notifications
        : {
            currentPage: Math.min(
              pagination.announcements.currentPage,
              pagination.notifications.currentPage
            ),
          };

    if (!currentPagination.hasMore) return;

    const nextPage = currentPagination.currentPage + 1;
    fetchData(activeTab, nextPage);
  }, [activeTab, pagination, loadingMore]);

  // Handle scroll event for infinite loading
  const handleScroll = useCallback(
    (e) => {
      const currentRef = getActiveRef().current;
      if (!currentRef) return;

      const { scrollTop, scrollHeight, clientHeight } = currentRef;
      console.log(`Scroll in ${activeTab} tab:`, {
        scrollTop,
        scrollHeight,
        clientHeight,
      });

      // Load more when user scrolls to bottom (with 200px threshold)
      if (
        scrollTop + clientHeight >= scrollHeight - 200 &&
        !loading &&
        !loadingMore
      ) {
        console.log(`Loading more data for ${activeTab} tab...`);
        loadMoreData();
      }
      // Removed any code that would mark items as read during scrolling
    },
    [activeTab, loadMoreData, loading, loadingMore]
  );

  useEffect(() => {
    // Initial data fetch
    fetchData(activeTab, 1, true);
  }, []);

  useEffect(() => {
    // Attach scroll listeners to all tabs
    const refs = [allTabRef, announcementsTabRef, notificationsTabRef];

    refs.forEach((ref) => {
      if (ref.current) {
        ref.current.addEventListener("scroll", handleScroll);
      }
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          ref.current.removeEventListener("scroll", handleScroll);
        }
      });
    };
  }, [handleScroll]);

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
          <List.Item key={item.id} className={`list-item ${item.is_read === 1 ? 'read-item' : ''}`}>
            <List.Item.Meta
              avatar={getItemIcon(item.type, item)}
              title={
                <Space>
                  <span className={`item-title ${item.is_read === 1 ? 'read-title' : ''}`}>{item.title}</span>
                  {item.isNew && <span className="new-indicator" />}
                </Space>
              }
              description={
                <div>
                  <p className={`item-description ${item.is_read === 1 ? 'read-description' : ''}`}>{item.content}</p>
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

  // Add this function to mark items as read when they're viewed
  const markItemsAsRead = useCallback(async (items, type) => {
    try {
      // Filter only unread items
      const unreadItems = items.filter(item => item.is_read === 0);
      
      if (unreadItems.length === 0) return;
      
      const itemIds = unreadItems.map(item => item.id);
      
      if (type === 'announcements') {
        await markReadAnnouncement(itemIds, companyId);
        
        // Update local state to reflect read status
        setData(prevData => ({
          ...prevData,
          announcements: prevData.announcements.map(item => 
            itemIds.includes(item.id) ? { ...item, is_read: 1 } : item
          )
        }));
      } else if (type === 'notifications') {
        await markReadNotification(itemIds);
        
        // Update local state to reflect read status
        setData(prevData => ({
          ...prevData,
          notifications: prevData.notifications.map(item => 
            itemIds.includes(item.id) ? { ...item, is_read: 1 } : item
          )
        }));
      }
    } catch (error) {
      console.error(`Error marking ${type} as read:`, error);
    }
  }, [companyId]);

  // Add this effect to mark items as read when leaving the page
  useEffect(() => {
    return () => {
      // This runs when component unmounts (user leaves the page)
      if (data.announcements.length > 0) {
        markItemsAsRead(data.announcements, 'announcements');
      }
      if (data.notifications.length > 0) {
        markItemsAsRead(data.notifications, 'notifications');
      }
    };
  }, [data, markItemsAsRead]);

  // Add an event listener for beforeunload to mark items as read when page refreshes
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (activeTab === 'announcements' && data.announcements.length > 0) {
        markItemsAsRead(data.announcements, 'announcements');
      } else if (activeTab === 'notifications' && data.notifications.length > 0) {
        markItemsAsRead(data.notifications, 'notifications');
      } else if (activeTab === 'all') {
        if (data.announcements.length > 0) {
          markItemsAsRead(data.announcements, 'announcements');
        }
        if (data.notifications.length > 0) {
          markItemsAsRead(data.notifications, 'notifications');
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [activeTab, data, markItemsAsRead]);

  return (
    <div className="notifications-container">
      <div className="notifications-wrapper">
        <CustomHeader
          title="Announcements & Notifications"
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
              children: (
                <div className="scrollable-list" ref={allTabRef}>
                  {renderList(getAllItems())}
                  {loadingMore && (
                    <div className="loading-more">
                      <Spin size="small" />
                      <span>Loading more...</span>
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: "announcements",
              label: "Announcements",
              children: (
                <div className="scrollable-list" ref={announcementsTabRef}>
                  {renderList(data.announcements)}
                  {loadingMore && (
                    <div className="loading-more">
                      <Spin size="small" />
                      <span>Loading more...</span>
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: "notifications",
              label: "Notifications",
              children: (
                <div className="scrollable-list" ref={notificationsTabRef}>
                  {renderList(data.notifications)}
                  {loadingMore && (
                    <div className="loading-more">
                      <Spin size="small" />
                      <span>Loading more...</span>
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default AnnouncementsAndNotifications;
