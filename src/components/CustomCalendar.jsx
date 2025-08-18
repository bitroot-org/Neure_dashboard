import React from 'react';
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const CustomCalendar = ({ activeDates = [], onDateSelect }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(null);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateString = (day) => {
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const isActiveDate = (day) => {
    const dateStr = formatDateString(day);
    return activeDates.includes(dateStr);
  };

  const isSelectedDate = (day) => {
    if (!selectedDate) return false;
    const currentDateStr = formatDateString(day);
    return currentDateStr === selectedDate;
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

  const handleDateClick = (day) => {
    const dateStr = formatDateString(day);
    setSelectedDate(dateStr);
    onDateSelect?.(dateStr);
  };

  const { prevMonthDays, currentMonthDays, nextMonthDays } = getDaysArray();

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button className="w-10 h-10 bg-[#2a2a2a] border-none rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-[#3a3a3a] transition-colors" onClick={handlePrevMonth}>
          <ArrowLeftOutlined />
        </button>
        <h2 className="text-white text-xl font-medium m-0">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button className="w-10 h-10 bg-[#2a2a2a] border-none rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-[#3a3a3a] transition-colors" onClick={handleNextMonth}>
          <ArrowRightOutlined />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-center text-white/60 text-sm font-medium py-2">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {prevMonthDays.map((day, index) => (
          <div key={`prev-${index}`} className="w-10 h-10 flex items-center justify-center text-white/30 text-sm">
            {day}
          </div>
        ))}

        {currentMonthDays.map((day) => (
          <div
            key={`current-${day}`}
            className={`w-10 h-10 flex items-center justify-center text-sm cursor-pointer rounded-lg transition-colors ${
              isSelectedDate(day)
                ? 'bg-blue-600 text-white'
                : isActiveDate(day)
                  ? 'bg-green-600 text-white'
                  : 'text-white hover:bg-[#2a2a2a]'
            }`}
            onClick={() => handleDateClick(day)}
          >
            {day}
          </div>
        ))}

        {nextMonthDays.map((day, index) => (
          <div key={`next-${index}`} className="w-10 h-10 flex items-center justify-center text-white/30 text-sm">
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomCalendar;