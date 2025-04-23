import React from 'react';
import './index.css';

const PresentationSlide = ({ title, date, backgroundImage, endTime, isLoading }) => {
  // Show shimmer effect while loading
  if (isLoading) {
    return (
      <div className="slide shimmer-slide">
        <div className="shimmer-background-wrapper">
          <div className="shimmer-background"></div>
        </div>
        <div className="slide-content-wrapper shimmer-content-wrapper">
          <div className="shimmer-avatar"></div>
          <div className="shimmer-text-content">
            <div className="shimmer-title"></div>
            <div className="shimmer-subtitle"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state only when we explicitly have no title after loading
  if (!title) {
    return (
      <div className="slide empty-slide">
        <div className="empty-slide-content">
          <h2>No Upcoming Workshop</h2>
          <p>Book a workshop to unlock your learning journey</p>
        </div>
      </div>
    );
  }

  // Format time from ISO string to 12-hour format
  const formatTime = (timeStr) => {
    if (!timeStr) return '';

    const dateObj = new Date(timeStr);
    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Extract day and month from date
  const getDateInfo = (timeStr) => {
    if (!timeStr) return { day: '', month: '' };
    
    const dateObj = new Date(timeStr);
    return {
      day: dateObj.getDate(),
      month: dateObj.toLocaleString('default', { month: 'short' })
    };
  };

  // Format start and end times
  const startTimeFormatted = formatTime(date);
  const endTimeFormatted = formatTime(endTime);
  
  // Create the time display string
  const timeDisplay = (startTimeFormatted && endTimeFormatted)
    ? `${startTimeFormatted} - ${endTimeFormatted}`
    : startTimeFormatted;
    
  // Get date and month
  const { day, month } = getDateInfo(date);

  return (
    <div className="slide">
      <div className="background">
        {backgroundImage && (
          <div
            className="background-image"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
      </div>
      
      <div className="slide-content-wrapper">
        <div className="date-box">
          <div className="date-day">{day}</div>
          <div className="date-month">{month}</div>
        </div>
        
        <div className="content">
          <div className="title-time">
            <h1>{title}</h1>
            <p>{timeDisplay}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationSlide;
