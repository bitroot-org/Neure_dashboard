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

  // Format time directly from the string without conversion
  const formatTimeFromString = (timeStr) => {
    if (!timeStr) return '';
    
    // Extract time part from "YYYY-MM-DD HH:MM:SS" format
    const timePart = timeStr.split(' ')[1];
    if (!timePart) return '';
    
    // Extract hours and minutes
    const [hours, minutes] = timePart.split(':');
    
    // Convert to 12-hour format
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHours = hourNum % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${displayHours}:${minutes} ${period}`;
  };

  // Extract day and month directly from the date string
  const getDateInfoFromString = (dateStr) => {
    if (!dateStr) return { day: '', month: '' };
    
    // Extract date part from "YYYY-MM-DD HH:MM:SS" format
    const datePart = dateStr.split(' ')[0];
    if (!datePart) return { day: '', month: '' };
    
    // Extract year, month, day
    const [year, month, day] = datePart.split('-');
    
    // Get month name
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[parseInt(month, 10) - 1];
    
    return {
      day: parseInt(day, 10),
      month: monthName
    };
  };

  // Format start and end times
  const startTimeFormatted = formatTimeFromString(date);
  const endTimeFormatted = formatTimeFromString(endTime);
  
  // Create the time display string
  const timeDisplay = (startTimeFormatted && endTimeFormatted)
    ? `${startTimeFormatted} - ${endTimeFormatted}`
    : startTimeFormatted;
    
  // Get date and month
  const { day, month } = getDateInfoFromString(date);

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
