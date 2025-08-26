import { useState } from 'react';
import Image from 'next/image';
import { Body2M_14 } from '../new-ui/Body';
import { MediumIndigoButton, MediumIndigoOutlinedButton } from '../new-ui/Buttons';
import useMediaQuery from '../media';
const AirbnbCalendarMobile = (props) => {
    const today = new Date();
    const isDesktop = useMediaQuery("(min-width:767px)");

    const [currentView, setCurrentView] = useState('calendar'); // default Fixed
    const [selectedDates, setSelectedDates] = useState({
        start: props.valueStart ? new Date(props.valueStart) : null,
        end: props.valueEnd ? new Date(props.valueEnd) : null
    });
    const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [dateType, setDateType] = useState('Fixed');
    const [tripDuration, setTripDuration] = useState(1);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const formatDateRange = () => {
        if (!selectedDates.start || !selectedDates.end) return 'Select dates';
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
        const startingDayOfWeek = firstDay.getDay();
        const days = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        for (let day = 1; day <= lastDay.getDate(); day++) {
            days.push(new Date(year, month, day));
        }
        return days;
    };

    const isDateSelected = (date) => {
        if (!date) return false;
        return (
            (selectedDates.start && date.getTime() === selectedDates.start.getTime()) ||
            (selectedDates.end && date.getTime() === selectedDates.end.getTime())
        );
    };
    const isDateInRange = (date) => {
        if (!date || !selectedDates.start || !selectedDates.end) return false;
        return date > selectedDates.start && date < selectedDates.end;
    };
    const isDateRangeStart = (date) => selectedDates.start && date && date.getTime() === selectedDates.start.getTime();
    const isDateRangeEnd = (date) => selectedDates.end && date && date.getTime() === selectedDates.end.getTime();


    // Navigation
    const navigateMonth = (direction) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const handleDateClick = (date) => {
        if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
            setSelectedDates({ start: date, end: null });
        } else if (!selectedDates.end && date > selectedDates.start) {
            setSelectedDates(prev => ({ ...prev, end: date }));
            setTripDuration(Math.ceil((date - selectedDates.start) / (1000 * 60 * 60 * 24)) + 1);
        }
    };

    const handleApplyDates = () => {
        props.onChangeDate({ start: selectedDates.start, end: selectedDates.end });
        props.setShowCalendar(false);
    };

    const renderCalendarView = () => {
        const currentMonthDays = getDaysInMonth(currentMonth);
        const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        const nextMonthDays = getDaysInMonth(nextMonth);

        const renderMonthGrid = (days, month, year) => (
            <div>
                <div className="grid grid-cols-7 text-[10px] font-medium text-gray-500">
                    {dayNames.map(day => <div key={day} className="text-center">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 mt-1">
                    {days.map((date, idx) => (
                        <div
                            key={idx}
                            className={`aspect-square flex items-center justify-center relative
                            ${date && isDateInRange(date) ? 'bg-gray-100' : ''}
                            ${date && isDateRangeStart(date) ? 'bg-gray-100 rounded-l-full' : ''}
                            ${date && isDateRangeEnd(date) ? 'bg-gray-100 rounded-r-full' : ''}`}
                        >
                            {date && (
                                <button
                                    onClick={() => handleDateClick(date)}
                                    className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[10px] font-medium transition-colors
                ${isDateSelected(date) ? 'bg-black text-white' :
                                            isDateInRange(date) ? 'hover:bg-gray-200 text-gray-900' :
                                                'hover:bg-gray-100 text-gray-900'}`}
                                >
                                    {date.getDate()}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );



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
                    </div>
                    <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded-full">
                        <Image src={"/circle_right.svg"} width={20} height={20} />
                    </button>
                </div>
                {isDesktop ? <div className="grid grid-cols-2 gap-6">
                    {renderMonthGrid(currentMonthDays, currentMonth.getMonth(), currentMonth.getFullYear())}
                    {renderMonthGrid(nextMonthDays, nextMonth.getMonth(), nextMonth.getFullYear())}
                </div> : <div>
                    {renderMonthGrid(currentMonthDays, currentMonth.getMonth(), currentMonth.getFullYear())}

                </div>}
            </div>
        );
    };

    const renderMonthView = () => (
        <div className="space-y-8">
            <div className="grid grid-cols-3 gap-[10px]">
                {months.map((month, index) => (
                    <button
                        key={month}
                        onClick={() => {
                            setCurrentMonth(new Date(today.getFullYear(), index, 1));
                            setCurrentView('calendar');
                        }}
                        className={`flex flex-col justify-start p-3 text-start text-[14px] rounded-xl border transition-all
                         ${currentMonth.getMonth() === index ? 'bg-yellow-400 border-yellow-400 text-black font-medium'
                                : 'border-gray-300 hover:border-gray-400 text-gray-700'}`}
                    >
                        <Image src="/calendar.svg" width={20} height={20} />
                        <div className='Body2R_14'>{month}</div>
                    </button>
                ))}
            </div>
            <div className="flex items-center justify-between bg-[#F0F0F0] px-3 py-2 rounded-md text-[14px]">
                <span className="font-normal text-gray-900">How many days?</span>
                <div className="flex items-center space-x-4">
                    <button onClick={() => setTripDuration(Math.max(1, tripDuration - 1))}>
                        <span className="font-light text-[18px]">−</span>
                    </button>
                    <span className="flex w-[70px] px-[10px] py-[6px] justify-center items-center rounded-[40px] border bg-white">
                        {tripDuration}
                    </span>
                    <button onClick={() => setTripDuration(tripDuration + 1)}>
                        <span className="font-light text-[18px]">+</span>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderAnyView = () => (
        <div className="flex items-center justify-center">
            <div className="flex flex-col gap-4">
                <span className="font-normal text-gray-900">How many days?</span>
                <div className="flex items-center space-x-4">
                    <button onClick={() => setTripDuration(Math.max(1, tripDuration - 1))}>
                        <span className="font-light text-[18px]">−</span>
                    </button>
                    <span className="flex w-[70px] px-[10px] py-[6px] justify-center items-center rounded-[40px] border bg-white">
                        {tripDuration}
                    </span>
                    <button onClick={() => setTripDuration(tripDuration + 1)}>
                        <span className="font-light text-[18px]">+</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-[650px]">
            <div className="flex flex-col p-[20px] gap-[20px]">
                <div className="px-8 py-6 border-b border-gray-200 w-full text-center">
                    <h2 className="text-[20px] font-semibold text-gray-900 mb-2">When do you want to travel?</h2>
                    <div className="flex items-center justify-center space-x-4 text-[14px]">
                        <span className="font-medium">{formatDateRange()}</span>
                        <span>|</span>
                        <span>{tripDuration} Days</span>
                    </div>
                </div>

                <div className="flex bg-gray-100 rounded-full px-[12px] py-[6px] w-fit mx-auto">
                    {['Fixed', 'Flexible', 'Anytime'].map(type => (
                        <button
                            key={type}
                            onClick={() => {
                                setDateType(type);
                                setCurrentView(type === 'Fixed' ? 'calendar' : type === "Flexible" ? 'months' : "any");
                            }}
                            className={`px-[24px] py-[4px] rounded-full text-[14px] font-medium transition-all 
                ${dateType === type ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {currentView === 'calendar'
                    ? renderCalendarView()
                    : currentView === 'months'
                        ? renderMonthView()
                        : renderAnyView()}

                <div className="flex justify-between gap-2 border-t border-gray-200 pt-4 gap-4">
                    <MediumIndigoOutlinedButton
                        onClick={() => {
                            setSelectedDates({ start: null, end: null });
                            setTripDuration(1);
                            props.setShowCalendar(false);
                        }}
                        className='flex-1'
                    >
                        Clear
                    </MediumIndigoOutlinedButton>
                    <MediumIndigoButton className='text-white flex-1' onClick={handleApplyDates}>
                        Apply
                    </MediumIndigoButton>
                </div>
            </div>
        </div>
    );
};

export default AirbnbCalendarMobile;
