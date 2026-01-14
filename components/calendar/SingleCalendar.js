// ============================================
// FIX FOR AirbnbCalendarSingleMonth.js
// ============================================

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Body2M_14 } from '../new-ui/Body';
import { MediumIndigoButton, MediumIndigoOutlinedButton } from '../new-ui/Buttons';
import {
  isBeforeToday,
  normalizeDate,
  months,
  dayNames,
  formatDateRange,
  getDaysInMonth,
  isDateSelected,
  isDateInRange,
  isDateInHoverRange,
  isDateRangeStart,
  isDateRangeEnd
} from './utils';

const AirbnbCalendarSingleMonth = (props) => {
  const today = new Date();

  const [hoveredDate, setHoveredDate] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Helper function to parse dates properly
  const parseDate = (date) => {
    if (!date) return null;
    
    // If it's already a Date object
    if (date instanceof Date && !isNaN(date)) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    
    // If it's an ISO string or date string
    if (typeof date === 'string') {
      const parsed = new Date(date);
      if (!isNaN(parsed)) {
        return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
      }
    }
    
    return null;
  };
  
  const [selectedDates, setSelectedDates] = useState({
    start: parseDate(props.valueStart),
    end: parseDate(props.valueEnd)
  });
  
  // Initialize currentMonth properly
  const getInitialMonth = () => {
    // Try to use props.date.month if it's a valid Date
    if (props.date?.month instanceof Date && !isNaN(props.date.month)) {
      return new Date(props.date.month.getFullYear(), props.date.month.getMonth(), 1);
    }
    
    // Try to use valueStart if available
    const startDate = parseDate(props.valueStart);
    if (startDate) {
      return new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    }
    
    // Default to current month
    return new Date(today.getFullYear(), today.getMonth(), 1);
  };
  
  const [currentMonth, setCurrentMonth] = useState(getInitialMonth());

  // Update selectedDates when props change
  useEffect(() => {
    setSelectedDates({
      start: parseDate(props.valueStart),
      end: parseDate(props.valueEnd)
    });
  }, [props.valueStart, props.valueEnd]);

  useEffect(() => {
    if (selectedDates.start && isInitialLoad) {
      const startDateMonth = new Date(selectedDates.start.getFullYear(), selectedDates.start.getMonth(), 1);
      setCurrentMonth(startDateMonth);
      setIsInitialLoad(false);
    }
  }, [selectedDates.start, isInitialLoad]);

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateClick = (date) => {
    // For single date selection
    setSelectedDates({ start: date, end: null });
    // Pass the date immediately
    props.onChangeDate({ start: date, end: null, month: currentMonth });
    props.setShowCalendar(false);
  };

  const renderMonthGrid = (days) => (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-[2px]">
        {dayNames.map(day => (
          <div key={day} className="text-[10px] font-medium text-center ">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-[1px]">
        {days.map((date, idx) => {
          const isRowStart = idx % 7 === 0;
          const isRowEnd = idx % 7 === 6;
          return (
            <div
              key={idx}
              className={`flex items-center justify-center relative`}
            >
              {date && (
                <button
                  onClick={() => !isBeforeToday(date) && handleDateClick(date)}
                  disabled={isBeforeToday(date)}
                  className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[10px] font-medium transition-colors
                    ${isBeforeToday(date) ? 'text-gray-300 cursor-not-allowed' : ''}
                    ${isDateSelected(date, selectedDates) ? 'bg-black text-white' :
                      !isBeforeToday(date) ? 'hover:bg-gray-100 text-gray-900' : ''}`}
                >
                  {date.getDate()}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );

  const renderCalendarView = () => {
    const currentMonthDays = getDaysInMonth(currentMonth);

    // Define whether the previous month button should be shown
    const isCurrentMonthOrBefore =
      currentMonth.getFullYear() === today.getFullYear() &&
      currentMonth.getMonth() === today.getMonth();

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          {/* Hide or disable "Previous" button when at current month */}
          <div className="w-[36px] h-[36px] flex items-center justify-center">
            {!isCurrentMonthOrBefore && (
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Image
                  src={"/circle_right.svg"}
                  width={20}
                  height={20}
                  className="transform -scale-x-100"
                  alt="Previous"
                />
              </button>
            )}
          </div>
          
          <div className="flex justify-center w-full">
            <Body2M_14>
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Body2M_14>
          </div>

          <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded-full">
            <Image src={"/circle_right.svg"} width={20} height={20} alt="Next" />
          </button>
        </div>

        <div className="px-4">{renderMonthGrid(currentMonthDays)}</div>
      </div>
    );
  };

  return (
    <div className='w-[350px]'>
      <div className="flex flex-col gap-5 p-4">
        <div className='flex flex-col gap-[20px] w-full'>
          <div className="">
            {renderCalendarView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirbnbCalendarSingleMonth;