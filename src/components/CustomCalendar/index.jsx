import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './index.css';

const CustomCalendar = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(18); // Example selected date

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDaysArray = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const prevMonthDays = [];
    const currentMonthDays = [];
    const nextMonthDays = [];

    // Previous month days
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      prevMonthDays.unshift(prevMonthLastDay - i);
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push(i);
    }

    // Next month days
    const remainingDays = 42 - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push(i);
    }

    return { prevMonthDays, currentMonthDays, nextMonthDays };
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const { prevMonthDays, currentMonthDays, nextMonthDays } = getDaysArray();

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-button" onClick={handlePrevMonth}>
          <ChevronLeft />
        </button>
        <h2 className="month-title">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button className="nav-button" onClick={handleNextMonth}>
          <ChevronRight />
        </button>
      </div>
      <div className="calendar-weekdays">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {prevMonthDays.map((day, index) => (
          <div key={`prev-${index}`} className="calendar-day prev-month">
            {day}
          </div>
        ))}

        {currentMonthDays.map((day) => (
          <div
            key={`current-${day}`}
            className={`calendar-day ${day === selectedDate ? 'selected' : ''}`}
            onClick={() => setSelectedDate(day)}
          >
            {day}
          </div>
        ))}

        {nextMonthDays.map((day, index) => (
          <div
            key={`next-${index}`}
            className="calendar-day next-month"
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomCalendar;