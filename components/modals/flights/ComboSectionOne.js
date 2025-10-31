import React, { useState, useEffect } from "react";
import { MdSort } from "react-icons/md";
import { Pax } from "../../drawers/activityDetails/Pax";
import dayjs from "dayjs";
import { FaCalendarDays } from "react-icons/fa6";
import AirbnbCalendarSingleMonth from "../../calendar/SingleCalendar";

const svgIcons = {
  'filter': <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <g clipPath="url(#clip0_2310_2286)">
      <path d="M6.66667 15.5V10.5H8.33333V12.1667H15V13.8333H8.33333V15.5H6.66667ZM0 13.8333V12.1667H5V13.8333H0ZM3.33333 10.5V8.83333H0V7.16667H3.33333V5.5H5V10.5H3.33333ZM6.66667 8.83333V7.16667H15V8.83333H6.66667ZM10 5.5V0.5H11.6667V2.16667H15V3.83333H11.6667V5.5H10ZM0 3.83333V2.16667H8.33333V3.83333H0Z" fill="white" />
    </g>
    <defs>
      <clipPath id="clip0_2310_2286">
        <rect width="15" height="15" fill="white" />
      </clipPath>
    </defs>
  </svg>,
  'search': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12.9671 11.6556H12.3133L12.0815 11.4321C12.8926 10.4885 13.381 9.26355 13.381 7.93098C13.381 4.95959 10.9724 2.55103 8.00103 2.55103C5.02965 2.55103 2.62109 4.95959 2.62109 7.93098C2.62109 10.9024 5.02965 13.3109 8.00103 13.3109C9.33359 13.3109 10.5586 12.8226 11.5021 12.0115L11.7256 12.2432V12.8971L15.864 17.0272L17.0973 15.794L12.9671 11.6556ZM8.00103 11.6556C5.9401 11.6556 4.27646 9.99192 4.27646 7.93098C4.27646 5.87004 5.9401 4.2064 8.00103 4.2064C10.062 4.2064 11.7256 5.87004 11.7256 7.93098C11.7256 9.99192 10.062 11.6556 8.00103 11.6556Z" fill="#ACACAC" />
  </svg>
}

const ComboSection = (props) => {
  const {
    filtersState,
    setFiltersState,
    pax,
    setPax,
    _FetchFlightsHandler,
    setHideFlightModal,
    flightCount,
    preferred_departure_time,
    updatePreferredDepartureTime,
    handleFiltersChange,
    flights,
    airlineCodes,
    setAirlineCodes,
    selectedAirlines,
    setSelectedAirlines,
    setIsTimeOnlyChange,
    setShowFilter
  } = props;

  const [showPax, setShowPax] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateOptions, setDateOptions] = useState([]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    if (preferred_departure_time) {
      const slots = [];
      let Time = dayjs(preferred_departure_time);
      const date = new Date(Time);
      date.setHours(0, 0, 0, 0);

      let baseTime = dayjs(date.toISOString());

      const minutes = baseTime.minute();
      const remainder = minutes % 30;

      if (remainder > 0) {
        baseTime = baseTime.add(30 - remainder, "minute");
      }

      const endTime = baseTime
        .startOf("day")
        .add(1, "day")
        .subtract(1, "minute");

      while (baseTime.isBefore(endTime) || baseTime.isSame(endTime)) {
        slots.push({
          value: baseTime.format("HH:mm"),
          display: baseTime.format("h:mm A"),
          isoString: baseTime.toISOString(),
        });
        baseTime = baseTime.add(30, "minute");
      }

      setTimeSlots(slots);
    }
  }, [preferred_departure_time]);

  const getTimePeriodFromHour = (hour) => {
    if (hour >= 6 && hour < 10) {
      return "MORNING";
    } else if (hour >= 10 && hour < 16) {
      return "AFTERNOON";
    } else if (hour >= 16 && hour < 21) {
      return "EVENING";
    } else if (hour >= 21 || hour < 6) {
      return "NIGHT";
    }
    return "";
  };

  const toggleNonStop = () => {
    setIsLoading(true);
    const newFiltersState = {
      ...filtersState,
      non_stop_flights: !filtersState.non_stop_flights,
    };

    if (props.handleFiltersChange) {
      props.handleFiltersChange(newFiltersState);
    } else {
      setFiltersState(newFiltersState);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  useEffect(() => {
    if (preferred_departure_time && !isInitialized) {
      const time = dayjs(preferred_departure_time);
      setSelectedTime(time.format("h:mm A"));
      setSelectedDate(time.format("DD MMM, YYYY"));
      setIsInitialized(true);
    }
  }, [preferred_departure_time, isInitialized]);

  const handleDateSelection = (dateOption) => {
    setIsLoading(true);
    setSelectedDate(dateOption.display);
    setShowDateDropdown(false);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const currentTimeFromPreferred = dayjs(preferred_departure_time);
    const currentTimeString = currentTimeFromPreferred.format("HH:mm:ss");
    const newDateTime = dayjs(`${dateOption.value}T${currentTimeString}`);

    const timer = setTimeout(() => {
      if (updatePreferredDepartureTime) {
        updatePreferredDepartureTime(newDateTime.format("YYYY-MM-DDTHH:mm:ss"));
      }
      setIsLoading(false);
    }, 300);

    setDebounceTimer(timer);
  };

  const handleTimeSelection = (slot) => {
    setIsLoading(true);
    setSelectedTime(slot.display);
    setIsTimeOnlyChange(true);
    setShowTimeDropdown(false);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    let currentDate;
    if (selectedDate) {
      currentDate = dayjs(selectedDate, "DD MMM, YYYY").format("YYYY-MM-DD");
    } else {
      currentDate = dayjs(preferred_departure_time).format("YYYY-MM-DD");
    }

    const [hours, minutes] = slot.value.split(":");
    const newDateTime = dayjs(`${currentDate}T${hours}:${minutes}:00`);

    const timer = setTimeout(() => {
      if (updatePreferredDepartureTime) {
        updatePreferredDepartureTime(newDateTime.format("YYYY-MM-DDTHH:mm:ss"));
      }
      setIsLoading(false);
    }, 300);

    setDebounceTimer(timer);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const handleAirlineMultiSelect = (code) => {
    const updatedSelection = selectedAirlines.includes(code)
      ? selectedAirlines.filter((c) => c !== code)
      : [...selectedAirlines, code];

    setSelectedAirlines(updatedSelection);

    const newFiltersState = {
      airlines: updatedSelection.join(","),
    };

    if (props.handleFiltersChange) {
      props.handleFiltersChange(newFiltersState);
    } else {
      setFiltersState(newFiltersState);
    }
  };

  const handleSortChange = (sortOption) => {
    setIsLoading(true);
    const newFiltersState = {
      ...filtersState,
      airlines,
    };

    if (props.handleFiltersChange) {
      props.handleFiltersChange(newFiltersState);
    } else {
      setFiltersState(newFiltersState);
    }
    setShowSortDropdown(false);

    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showTimeDropdown &&
        !event.target.closest(".time-dropdown-container")
      ) {
        setShowTimeDropdown(false);
      }
      if (
        showSortDropdown &&
        !event.target.closest(".sort-dropdown-container")
      ) {
        setShowSortDropdown(false);
      }
      if (
        showCalendar &&
        !event.target.closest(".calendar-container")
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTimeDropdown, showSortDropdown, showCalendar]);

  const handleCalendarChange = (dateData) => {
    if (dateData.start) {
      const selectedDateTime = dayjs(dateData.start);
      const formattedDate = selectedDateTime.format("DD MMM, YYYY");
      setSelectedDate(formattedDate);
      
      const currentTime = dayjs(preferred_departure_time);
      const newDateTime = selectedDateTime
        .hour(currentTime.hour())
        .minute(currentTime.minute())
        .second(currentTime.second());
      
      if (updatePreferredDepartureTime) {
        updatePreferredDepartureTime(newDateTime.format("YYYY-MM-DDTHH:mm:ss"));
      }
      setShowCalendar(false);
    }
  };

  return (
    <div className="font-sans w-full mx-auto bg-white">
      <div className="w-full">
        <div className="w-full">
          {/* Desktop Layout */}
          <div className="max-ph:hidden md:flex items-center gap-4 mb-2">
            {preferred_departure_time && (
              <div className="calendar-container relative flex-1 md:max-w-xs">
                <div
                  className="flex items-center  gap-3 rounded-lg cursor-pointer bg-[#F9F9F9] py-[0.6rem] px-3"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <svg className="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 14" fill="none">
                    <path d="M3.0625 0C3.17853 0 3.28981 0.0460936 3.37186 0.128141C3.45391 0.210188 3.5 0.321468 3.5 0.4375V0.875H10.5V0.4375C10.5 0.321468 10.5461 0.210188 10.6281 0.128141C10.7102 0.0460936 10.8215 0 10.9375 0C11.0535 0 11.1648 0.0460936 11.2469 0.128141C11.3289 0.210188 11.375 0.321468 11.375 0.4375V0.875H12.25C12.7141 0.875 13.1592 1.05937 13.4874 1.38756C13.8156 1.71575 14 2.16087 14 2.625V12.25C14 12.7141 13.8156 13.1592 13.4874 13.4874C13.1592 13.8156 12.7141 14 12.25 14H1.75C1.28587 14 0.840752 13.8156 0.512563 13.4874C0.184374 13.1592 0 12.7141 0 12.25V2.625C0 2.16087 0.184374 1.71575 0.512563 1.38756C0.840752 1.05937 1.28587 0.875 1.75 0.875H2.625V0.4375C2.625 0.321468 2.67109 0.210188 2.75314 0.128141C2.83519 0.0460936 2.94647 0 3.0625 0ZM1.75 1.75C1.51794 1.75 1.29538 1.84219 1.13128 2.00628C0.967187 2.17038 0.875 2.39294 0.875 2.625V12.25C0.875 12.4821 0.967187 12.7046 1.13128 12.8687C1.29538 13.0328 1.51794 13.125 1.75 13.125H12.25C12.4821 13.125 12.7046 13.0328 12.8687 12.8687C13.0328 12.7046 13.125 12.4821 13.125 12.25V2.625C13.125 2.39294 13.0328 2.17038 12.8687 2.00628C12.7046 1.84219 12.4821 1.75 12.25 1.75H1.75Z" fill="#ACACAC"/>
                    <path d="M2.1875 3.5C2.1875 3.38397 2.23359 3.27269 2.31564 3.19064C2.39769 3.10859 2.50897 3.0625 2.625 3.0625H11.375C11.491 3.0625 11.6023 3.10859 11.6844 3.19064C11.7664 3.27269 11.8125 3.38397 11.8125 3.5V4.375C11.8125 4.49103 11.7664 4.60231 11.6844 4.68436C11.6023 4.76641 11.491 4.8125 11.375 4.8125H2.625C2.50897 4.8125 2.39769 4.76641 2.31564 4.68436C2.23359 4.60231 2.1875 4.49103 2.1875 4.375V3.5Z" fill="#ACACAC"/>
                  </svg>
                  <span className="text-sm font-normal text-[#212529] flex-1">
                    {selectedDate || dayjs(preferred_departure_time).format("DD MMM, YYYY")}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-600 transition-transform flex-shrink-0 ${
                      showCalendar ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {showCalendar && (
                  <div className="absolute z-[15] mt-2 bg-white border rounded-lg shadow-lg">
                    <AirbnbCalendarSingleMonth
                      dateType="fixed"
                      valueStart={preferred_departure_time}
                      valueEnd={null}
                      date={{
                        month: new Date(preferred_departure_time),
                        duration: 1
                      }}
                      setDateType={() => {}}
                      onChangeDate={handleCalendarChange}
                      setShowCalendar={setShowCalendar}
                      isNotForm={true}
                    />
                  </div>
                )}
              </div>
            )}
            
            <div className="flex-1 md:max-w-xs">
              <Pax
                setShowPax={setShowPax}
                pax={pax}
                setPax={setPax}
                showPax={showPax}
                combo={true}
                limit={9}
              />
            </div>

            <button 
              onClick={() => setShowFilter(true)} 
              className="flex items-center justify-center gap-2 px-6 py-[0.6rem] bg-[#0A2540] text-white rounded-lg hover:bg-[#0d2e52] transition-colors font-medium text-sm"
            >
              {svgIcons.filter}
              <span>Filters</span>
            </button>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex items-stretch gap-2 mb-2">
              {preferred_departure_time && (
                <div className="calendar-container relative flex-1">
                  <div
                    className="flex items-center gap-2 rounded-lg cursor-pointer bg-[#F9F9F9] py-2.5 px-3 h-full"
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    <svg className="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3.0625 0C3.17853 0 3.28981 0.0460936 3.37186 0.128141C3.45391 0.210188 3.5 0.321468 3.5 0.4375V0.875H10.5V0.4375C10.5 0.321468 10.5461 0.210188 10.6281 0.128141C10.7102 0.0460936 10.8215 0 10.9375 0C11.0535 0 11.1648 0.0460936 11.2469 0.128141C11.3289 0.210188 11.375 0.321468 11.375 0.4375V0.875H12.25C12.7141 0.875 13.1592 1.05937 13.4874 1.38756C13.8156 1.71575 14 2.16087 14 2.625V12.25C14 12.7141 13.8156 13.1592 13.4874 13.4874C13.1592 13.8156 12.7141 14 12.25 14H1.75C1.28587 14 0.840752 13.8156 0.512563 13.4874C0.184374 13.1592 0 12.7141 0 12.25V2.625C0 2.16087 0.184374 1.71575 0.512563 1.38756C0.840752 1.05937 1.28587 0.875 1.75 0.875H2.625V0.4375C2.625 0.321468 2.67109 0.210188 2.75314 0.128141C2.83519 0.0460936 2.94647 0 3.0625 0ZM1.75 1.75C1.51794 1.75 1.29538 1.84219 1.13128 2.00628C0.967187 2.17038 0.875 2.39294 0.875 2.625V12.25C0.875 12.4821 0.967187 12.7046 1.13128 12.8687C1.29538 13.0328 1.51794 13.125 1.75 13.125H12.25C12.4821 13.125 12.7046 13.0328 12.8687 12.8687C13.0328 12.7046 13.125 12.4821 13.125 12.25V2.625C13.125 2.39294 13.0328 2.17038 12.8687 2.00628C12.7046 1.84219 12.4821 1.75 12.25 1.75H1.75Z" fill="#ACACAC"/>
                      <path d="M2.1875 3.5C2.1875 3.38397 2.23359 3.27269 2.31564 3.19064C2.39769 3.10859 2.50897 3.0625 2.625 3.0625H11.375C11.491 3.0625 11.6023 3.10859 11.6844 3.19064C11.7664 3.27269 11.8125 3.38397 11.8125 3.5V4.375C11.8125 4.49103 11.7664 4.60231 11.6844 4.68436C11.6023 4.76641 11.491 4.8125 11.375 4.8125H2.625C2.50897 4.8125 2.39769 4.76641 2.31564 4.68436C2.23359 4.60231 2.1875 4.49103 2.1875 4.375V3.5Z" fill="#ACACAC"/>
                    </svg>
                    <span className="text-sm font-normal text-[#212529] flex-1 truncate">
                      {selectedDate || dayjs(preferred_departure_time).format("DD MMM, YYYY")}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 text-gray-600 transition-transform flex-shrink-0 ${
                        showCalendar ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {showCalendar && (
                    <div className="absolute z-[15] mt-2 bg-white border rounded-lg shadow-lg left-0 right-0">
                      <AirbnbCalendarSingleMonth
                        dateType="fixed"
                        valueStart={preferred_departure_time}
                        valueEnd={null}
                        date={{
                          month: new Date(preferred_departure_time),
                          duration: 1
                        }}
                        setDateType={() => {}}
                        onChangeDate={handleCalendarChange}
                        setShowCalendar={setShowCalendar}
                        isNotForm={true}
                      />
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex-1">
                <Pax
                  setShowPax={setShowPax}
                  pax={pax}
                  setPax={setPax}
                  showPax={showPax}
                  combo={true}
                  limit={9}
                />
              </div>
            </div>

            {/* Mobile Filter Button - Fixed at bottom right */}
            {/* <button 
              onClick={() => props?.setShowFilters && props.setShowFilters(true)} 
              className="fixed bottom-6 right-6 z-40 w-14 h-14 flex items-center justify-center bg-[#0A2540] text-white rounded-full shadow-lg hover:bg-[#0d2e52] transition-colors"
            >
              {svgIcons.filter}
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboSection;