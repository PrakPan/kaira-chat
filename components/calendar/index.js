import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Body2M_14 } from '../new-ui/Body';
import { MediumIndigoButton, MediumIndigoOutlinedButton } from '../new-ui/Buttons';
import { useDispatch } from 'react-redux';
import { capitalizeFirstLetter } from '../../utils/tailoredform';
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
  isDateRangeEnd,
  getNext12Months
} from './utils';
import { PulseLoader } from 'react-spinners';

const AirbnbCalendar = (props) => {
  const today = new Date();

  const [dateType, setDateType] = useState(props.dateType)
  const [currentView, setCurrentView] = useState('calendar');
  const [hoveredDate, setHoveredDate] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedDates, setSelectedDates] = useState({
    start: normalizeDate(props.valueStart),
    end: normalizeDate(props.valueEnd)
  });
  const [loading,setLoading] = useState(false);
  
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState((props.date.year && props.date.month) ? new Date(props.date.year, props.date.month, 1) : new Date(today.getFullYear(), today.getMonth(), 1));
  const [tripDuration, setTripDuration] = useState(props.date.duration || 0);

  useEffect(() => {

    if (dateType === 'flexible' || dateType === 'anytime') {
      if (!tripDuration) {
        setTripDuration(7);
      }
    } else if (dateType === 'fixed') {
      if (tripDuration > 0 && (!selectedDates.start || !selectedDates.end)) {
        setTripDuration(0);
      }
    }

  }, [dateType])


  useEffect(() => {
    if (selectedDates.start && isInitialLoad) {
      const startDateMonth = new Date(selectedDates.start.getFullYear(), selectedDates.start.getMonth(), 1);
      setCurrentMonth(startDateMonth);
      setIsInitialLoad(false);
    }
  }, []);

  const dispatch=useDispatch()
  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateClick = (date) => {
    if (!selectedDates.start) {
      setSelectedDates({ start: date, end: null });
    } else if (!selectedDates.end) {
      if (date > selectedDates.start) {
        setSelectedDates(prev => ({
          ...prev,
          end: date
        }));
        setTripDuration(Math.ceil((date - selectedDates.start) / (1000 * 60 * 60 * 24)) + 1);
      } else {
        setSelectedDates({ start: date, end: null });
      }
    } else {
      if (date < selectedDates.start) {
        setSelectedDates({ start: date, end: selectedDates.end });
      } else if (date > selectedDates.start && date < selectedDates.end) {
        setSelectedDates({ start: date, end: selectedDates.end });
      } else if (date > selectedDates.end) {
        setSelectedDates({ start: date, end: null });
      }
    }
  };

  const handleApplyDates = async () => {
  props.setDateType(dateType)
  
  if(props?.isLoading !== undefined){
    setLoading(true);
    await props.onChangeDate({ 
      start: selectedDates.start, 
      end: selectedDates.end, 
      month: currentMonth, 
      duration: tripDuration,
      dateType: dateType
    });
    setLoading(false);
  } else {
    props.onChangeDate({ 
      start: selectedDates.start, 
      end: selectedDates.end, 
      month: currentMonth, 
      duration: tripDuration,
      dateType: dateType
    });
    props.setShowCalendar(false);
  }
}

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
          return (<div
            key={idx}
            className={`flex items-center justify-center relative
    ${date && isDateInRange(date, selectedDates) ? 'bg-primary-jasmineWhite' : ''}
    ${date && isDateInHoverRange(date, selectedDates, hoveredDate) ? 'bg-gray-200' : ''}
    ${date && isDateRangeStart(date, selectedDates) ? 'bg-primary-jasmineWhite rounded-l-full' : ''}
    ${date && isDateRangeEnd(date, selectedDates) ? 'bg-primary-jasmineWhite rounded-r-full' : ''}
    ${date && isDateInRange(date, selectedDates) && isRowStart ? 'rounded-l-full' : ''}
    ${date && isDateInRange(date, selectedDates) && isRowEnd ? 'rounded-r-full' : ''}
    ${date && isDateInHoverRange(date, selectedDates, hoveredDate) && isRowStart ? 'rounded-l-full' : ''}
    ${date && isDateInHoverRange(date, selectedDates, hoveredDate) && isRowEnd ? 'rounded-r-full' : ''}
  `}
          >
            {date && (
              <button
                onClick={() => !isBeforeToday(date) && handleDateClick(date)}
                onMouseEnter={() => {
                  if (!isBeforeToday(date) && selectedDates.start && !selectedDates.end) {
                    setHoveredDate(date);
                  } else {
                    setHoveredDate(null);
                  }
                }}
                onMouseLeave={() => setHoveredDate(null)}
                disabled={isBeforeToday(date)}
                className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[10px] font-400 transition-colors
      ${isBeforeToday(date) ? 'text-gray-300 cursor-not-allowed' : ''}
      ${isDateSelected(date, selectedDates) ? 'bg-primary-yellow text-pureBlack shadow-md' :
                    isDateInRange(date, selectedDates) ? 'hover:bg-gray-200 bg-primary-jasmineWhite' :
                      isDateInHoverRange(date, selectedDates, hoveredDate) ? 'bg-gray-200 text-gray-900' :
                        !isBeforeToday(date) ? 'hover:bg-gray-100 text-gray-900' : ''}`}
              >
                {date.getDate()}
              </button>
            )}
          </div>)
        })}
      </div>
    </div>
  );

  const renderCalendarView = () => {
    const currentMonthDays = getDaysInMonth(currentMonth);
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    const nextMonthDays = getDaysInMonth(nextMonth);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <Image src={"/circle_right.svg"} width={20} height={20} className="transform -scale-x-100" />
          </button>
          <div className="flex justify-center  w-full">
            <div className='flex justify-center w-[50%]'>
              <Body2M_14>{months[currentMonth.getMonth()]} {currentMonth.getFullYear()}</Body2M_14>
            </div>
            <div className='flex justify-center w-[50%]'>
              <Body2M_14>{months[nextMonth.getMonth()]} {nextMonth.getFullYear()}</Body2M_14>
            </div>
          </div>
          <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded-full">
            <Image src={"/circle_right.svg"} width={20} height={20} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {renderMonthGrid(currentMonthDays)}
          {renderMonthGrid(nextMonthDays)}
        </div>
      </div>
    );
  };

  const renderMonthView = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-4">
        {getNext12Months().map((month, index) => (
          <button
            key={month.key}
            onClick={() => {
              setCurrentMonth(new Date(month.year, month.monthIndex, 1));
            }}
            className={`flex flex-col  justify-start p-[10px] text-start text-[14px] gap-xs rounded-xl border-sm transition-all ${currentMonth.getMonth() === month.monthIndex && currentMonth.getFullYear() === month.year
              ? 'bg-yellow border-yellow '
              : 'border-text-dsabled hover:border-gray-400 text-gray-700'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="17" viewBox="0 0 15 17" fill="none">
              <path d="M1.66667 16.6667C1.20833 16.6667 0.815833 16.5036 0.489167 16.1775C0.163055 15.8508 0 15.4583 0 15V3.33333C0 2.875 0.163055 2.48278 0.489167 2.15667C0.815833 1.83 1.20833 1.66667 1.66667 1.66667H2.5V0H4.16667V1.66667H10.8333V0H12.5V1.66667H13.3333C13.7917 1.66667 14.1842 1.83 14.5108 2.15667C14.8369 2.48278 15 2.875 15 3.33333V15C15 15.4583 14.8369 15.8508 14.5108 16.1775C14.1842 16.5036 13.7917 16.6667 13.3333 16.6667H1.66667ZM1.66667 15H13.3333V6.66667H1.66667V15ZM1.66667 5H13.3333V3.33333H1.66667V5ZM1.66667 5V3.33333V5Z" fill={currentMonth.getMonth() === month.monthIndex && currentMonth.getFullYear() === month.year ? '#000' : '#ACACAC'} />
            </svg>
            {/* <Image src="/calendar.svg" width={'20'} height={"20"} className="text-gray-500" /> */}
            <div className='whitespace-nowrap'>{month.key}</div>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between  bg-[#F0F0F0] px-[8px] py-[10px] rounded-md text-[14px">
        <span className=" font-normal text-gray-900 ]">How many days?</span>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setTripDuration(Math.max(1, tripDuration - 1))}
          >
            <span className="font-light text-[18px]">−</span>
          </button>
          <span className="flex w-[87px] px-[10px] py-[6px] justify-center items-center gap-[10px] rounded-[40px] border border-[var(--Text-Colors-Stroke,#E5E5E5)] bg-[var(--text-colors-text-white,#FFF)]">{tripDuration}</span>
          <button
            onClick={() => setTripDuration(tripDuration + 1)}

          >
            <span className="font-light text-[18px]">+</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnyView = () => {
    return (
      <div className='flex items-center justify-center'>
        <div className="flex flex-col gap-[14px]">
          <span className=" font-normal text-gray-900 ]">How many days?</span>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTripDuration(Math.max(1, tripDuration - 1))}
            >
              <span className="font-light text-[18px]">−</span>
            </button>
            <span className="flex w-[87px] px-[10px] py-[6px] justify-center items-center gap-[10px] rounded-[40px] border border-[var(--Text-Colors-Stroke,#E5E5E5)] bg-[var(--text-colors-text-white,#FFF)]">{tripDuration}</span>
            <button
              onClick={() => setTripDuration(tripDuration + 1)}

            >
              <span className="font-light text-[18px]">+</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-[611px]'>
      <div className="flex flex-col gap-5">
        <div className='flex flex-col gap-[20px] w-full'>
          <div className="border-b border-gray-200 w-full pb-[20px]">
            <div className="flex justify-between items-center w-full">
              <div className='text-center w-full'>
                <h2 className="text-[20px] font-semibold text-gray-900 mb-4">When do you want to travel?</h2>
                <div className="flex items-center justify-center space-x-4 text-[14px] font-normal leading-[22px] text-center w-full">
                  <span className="font-medium">{formatDateRange(selectedDates)}</span>
                  {tripDuration > 0 && <>
                    <span >|</span>
                    <span >{tripDuration} Days</span>
                  </>
                  }
                </div>
              </div>
            </div>
          </div>

          {!props?.isNotForm&&<div className="">
            <div className="flex bg-gray-100 rounded-full px-[12px] py-[6px] w-fit mx-auto">
              {['fixed', 'flexible', 'anytime'].map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setDateType(type);
                    setCurrentView(type === 'fixed' ? 'calendar' : type === "flexible" ? 'months' : "any");
                  }}
                  className={`px-[24px] py-[4px] rounded-full text-[14px] font-500 transition-all ${dateType === type ? 'bg-pureBlack text-text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {capitalizeFirstLetter(type)}
                </button>
              ))}
            </div>
          </div>}

          <div className="">
            {dateType === 'fixed' ? renderCalendarView() : dateType == "anytime" ? renderAnyView() : renderMonthView()}
          </div>

          <div className='flex justify-end'>
            <div className=" flex gap-[20px]">
              <MediumIndigoOutlinedButton
                onClick={() => {
                  setSelectedDates({ start: null, end: null });
                  setTripDuration(0);
                }}
              >
                Clear
              </MediumIndigoOutlinedButton>
              <MediumIndigoButton
                onClick={handleApplyDates}
                className="px-[26px] py-[8px] bg-gray-900 text-white font-medium rounded-[8px] hover:bg-gray-800 transition-colors"
              >
                {loading ? (
              <PulseLoader
                style={{
                  // position: "absolute",
                  // top: "55%",
                  // left: "50%",
                   transform: "translate(-50% , -50%)",
                }}
                size={12}
                speedMultiplier={0.6}
                color="#ffffff"
              />
            ) : "Apply"}
              </MediumIndigoButton>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AirbnbCalendar;