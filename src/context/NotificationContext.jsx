
import React, { createContext, useState, useEffect, useContext } from 'react';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getUnreadNotificationCount } from '../services/api';

export const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [previousCount, setPreviousCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const companyId = localStorage.getItem('companyId');
    
    if (!userData?.id || !companyId) return;

    try {
      setLoading(true);
      const response = await getUnreadNotificationCount(userData.id, companyId);

      if (response.status && response.data) {
        // Check if there are new notifications before updating state
        const newCount = response.data.count;
        
        // If there are new notifications and this isn't the first load
        if (newCount > previousCount && previousCount !== 0) {
          showNotification(newCount - previousCount);
        }
        
        // Save previous count before updating
        setPreviousCount(unreadCount);
        setUnreadCount(newCount);
      }
    } catch (error) {
      console.error('Error fetching notification count:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show notification using Ant Design
  const showNotification = (newCount) => {
    // Show in-app notification
    notification.info({
      message: 'New Notifications',
      description: `You have ${newCount} new notification${newCount > 1 ? 's' : ''}`,
      placement: 'topRight',
      duration: 5,
      onClick: () => {
        navigate('/announcements');
        notification.destroy();
      },
    });
  };

  // Set up polling interval
  useEffect(() => {
    // Initial fetch
    fetchUnreadCount();
    
    // Set up interval for polling
    const intervalId = setInterval(fetchUnreadCount, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, [unreadCount]); // Re-run when unreadCount changes

  // Context value
  const value = {
    unreadCount,
    loading
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

