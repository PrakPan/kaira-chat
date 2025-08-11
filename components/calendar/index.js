import React, { useState } from 'react';
import { HiChevronLeft, HiChevronRight, HiX } from 'react-icons/hi'; 
import { FaRegCalendarAlt } from 'react-icons/fa'; 


const AirbnbCalendar = () => {
  const [currentView, setCurrentView] = useState('calendar'); 
  const [selectedDates, setSelectedDates] = useState({
    start: new Date(2025, 6, 20), 
    end: new Date(2025, 6, 28)   
  });
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 5, 1)); 
  const [dateType, setDateType] = useState('Fixed');
  const [tripDuration, setTripDuration] = useState(20);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const formatDateRange = () => {
    const start = selectedDates.start;
    const end = selectedDates.end;
    const startStr = `${months[start.getMonth()].slice(0, 3)} ${start.getDate()}`;
    const endStr = `${months[end.getMonth()].slice(0, 3)} ${end.getDate()}`;
    return `${startStr} - ${endStr}`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateSelected = (date) => {
    if (!date) return false;
    const time = date.getTime();
    return time === selectedDates.start.getTime() || time === selectedDates.end.getTime();
  };

  const isDateInRange = (date) => {
    if (!date) return false;
    const time = date.getTime();
    const startTime = selectedDates.start.getTime();
    const endTime = selectedDates.end.getTime();
    return time > startTime && time < endTime;
  };

  const isDateRangeStart = (date) => {
    if (!date) return false;
    return date.getTime() === selectedDates.start.getTime();
  };

  const isDateRangeEnd = (date) => {
    if (!date) return false;
    return date.getTime() === selectedDates.end.getTime();
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const renderCalendarView = () => {
    const currentMonthDays = getDaysInMonth(currentMonth);
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    const nextMonthDays = getDaysInMonth(nextMonth);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <HiChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex space-x-12">
            <h3 className="text-lg font-semibold">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <h3 className="text-lg font-semibold">
              {months[nextMonth.getMonth()]} {nextMonth.getFullYear()}
            </h3>
          </div>
          <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded-full">
            <HiChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-14 gap-0">
          {/* First month */}
          <div className="col-span-7">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map(day => (
                <div key={day} className="text-xs font-medium text-gray-600 text-center py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0">
              {currentMonthDays.map((date, index) => (
                <div key={index} className={`aspect-square flex items-center justify-center relative ${
                  date && isDateInRange(date) ? 'bg-gray-100' : ''
                } ${
                  date && isDateRangeStart(date) ? 'bg-gradient-to-r from-white to-gray-100' : ''
                } ${
                  date && isDateRangeEnd(date) ? 'bg-gradient-to-l from-white to-gray-100' : ''
                }`}>
                  {date && (
                    <button
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors relative z-10 ${
                        isDateSelected(date)
                          ? 'bg-black text-white'
                          : isDateInRange(date)
                          ? 'hover:bg-gray-200 text-gray-900'
                          : 'hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-7">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map(day => (
                <div key={day} className="text-xs font-medium text-gray-600 text-center py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0">
              {nextMonthDays.map((date, index) => (
                <div key={index} className={`aspect-square flex items-center justify-center relative ${
                  date && isDateInRange(date) ? 'bg-gray-100' : ''
                } ${
                  date && isDateRangeStart(date) ? 'bg-gradient-to-r from-white to-gray-100' : ''
                } ${
                  date && isDateRangeEnd(date) ? 'bg-gradient-to-l from-white to-gray-100' : ''
                }`}>
                  {date && (
                    <button
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors relative z-10 ${
                        isDateSelected(date)
                          ? 'bg-black text-white'
                          : isDateInRange(date)
                          ? 'hover:bg-gray-200 text-gray-900'
                          : 'hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMonthView = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-4">
        {months.map((month, index) => (
          <button
            key={month}
            onClick={() => setCurrentView('calendar')}
            className={`flex items-center justify-start p-4 rounded-xl border transition-all ${
              index === 7 
                ? 'bg-yellow-400 border-yellow-400 text-black font-medium'
                : 'border-gray-300 hover:border-gray-400 text-gray-700'
            }`}
          >
            <FaRegCalendarAlt className="w-5 h-5 mr-3 text-gray-500" />
            {month}
          </button>
        ))}
      </div>
      
      <div className="flex items-center justify-between pt-4">
        <span className="text-lg font-medium text-gray-900">How many days?</span>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setTripDuration(Math.max(1, tripDuration - 1))}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
          >
            <span className="text-xl font-light">−</span>
          </button>
          <span className="text-xl font-medium min-w-[3rem] text-center">{tripDuration}</span>
          <button 
            onClick={() => setTripDuration(tripDuration + 1)}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
          >
            <span className="text-xl font-light">+</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
     
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                When do you want to travel?
              </h2>
              <div className="flex items-center space-x-4 text-lg">
                <span className="font-medium">{formatDateRange()}</span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-700">{tripDuration} Days</span>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <HiX className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="px-8 py-6">
          <div className="flex bg-gray-100 rounded-full p-1 w-fit mx-auto">
            {['Fixed', 'Flexible', 'Anytime'].map(type => (
              <button
                key={type}
                onClick={() => {
                  setDateType(type);
                  if (type === 'Flexible' || type === 'Anytime') {
                    setCurrentView('months');
                  } else {
                    setCurrentView('calendar');
                  }
                }}
                className={`px-8 py-3 rounded-full text-sm font-medium transition-all ${
                  dateType === type
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        
        <div className="px-8 py-6">
          {currentView === 'calendar' ? renderCalendarView() : renderMonthView()}
        </div>
        <div className="px-8 py-6 border-t border-gray-200 flex justify-between">
          <button className="px-8 py-3 text-gray-900 font-medium hover:bg-gray-50 rounded-lg transition-colors">
            Clear
          </button>
          <button className="px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}; 

export default AirbnbCalendar;