import React, { useState, useEffect } from "react";
import { MdSort } from "react-icons/md";
import { Pax } from "../../drawers/activityDetails/Pax";
import dayjs from "dayjs";

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
  } = props;

  const [showPax, setShowPax] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);


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
        baseTime = baseTime.add(30 - remainder, 'minute');
      }
      
      const endTime = baseTime.startOf('day').add(1, 'day').subtract(1, 'minute');
      
      while (baseTime.isBefore(endTime) || baseTime.isSame(endTime)) {
        slots.push({
          value: baseTime.format('HH:mm'),
          display: baseTime.format('h:mm A')
        });
        baseTime = baseTime.add(30, 'minute');
      }
      
      setTimeSlots(slots);
    }
  }, [preferred_departure_time]);

  const getTimePeriodFromHour = (hour) => {
    if (hour >= 6 && hour < 10) {
      return "MORNING";
    } else if (hour >= 10 && hour < 16) {
      return "AFTERNOON";
    } else if (hour >= 12 && hour < 18) {
      return "EVENING";
    } else if (hour >= 21 || hour < 6) {
      return "NIGHT";
    }
    return "";
  };

  const toggleNonStop = () => {
    const newFiltersState = {
      ...filtersState,
      non_stop_flights: !filtersState.non_stop_flights,
    };
    setFiltersState(newFiltersState);
  };

  const handleDepartureTimeChange = (e) => {
    const newFiltersState = {
      ...filtersState,
      departure_time_period: e.target.value,
    };
    setFiltersState(newFiltersState);
    setShowTimeDropdown(false);
  };

  const handleArrivalTimeChange = (e) => {
    const newFiltersState = {
      ...filtersState,
      arrival_time_period: e.target.value,
    };
    setFiltersState(newFiltersState);
  };

  const getTimeDisplay = (value) => {
    switch (value) {
      case "MORNING":
        return "6 AM - 10 AM";
      case "AFTERNOON":
        return "10 AM - 4 PM";
      case "EVENING":
        return "12 PM - 6 PM";
      case "NIGHT":
        return "9 PM - 6 AM";
      default:
        return "Any Time";
    }
  };

  const handleSortChange = () => {
    const newOrder = filtersState.order === "asc" ? "desc" : "asc";
    const newFiltersState = {
      ...filtersState,
      order: newOrder,
    };
    setFiltersState(newFiltersState);
    setTimeout(() => {
      _FetchFlightsHandler();
    }, 100);
  };

  const handleTimeSelection = (slot) => {
    setSelectedTime(slot.display);
  
    const hour = parseInt(slot.value.split(':')[0], 10);
    const timePeriod = getTimePeriodFromHour(hour);
    
    const newFiltersState = {
      ...filtersState,
      departure_time_period: timePeriod
    };
    
    setFiltersState(newFiltersState);
    setShowTimeDropdown(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      _FetchFlightsHandler();
    }, 500);

    return () => clearTimeout(timer);
  }, [filtersState]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTimeDropdown && !event.target.closest('.time-dropdown-container')) {
        setShowTimeDropdown(false);
      }
      if (showSortDropdown && !event.target.closest('.sort-dropdown-container')) {
        setShowSortDropdown(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTimeDropdown, showSortDropdown]);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTimeDropdown && !event.target.closest('.time-dropdown-container')) {
        setShowTimeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTimeDropdown]);

  return (
    <div className="font-sans max-w-2xl mx-auto bg-white">
      {/* Filter Section */}
      <div className="p-4">
        {/* Non-Stop Flight Checkbox */}
        <div className="mb-4 flex items-center justify-between">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={filtersState.non_stop_flights}
              onChange={toggleNonStop}
            />
            <span className="ml-2 text-sm">Non-stop flights only?</span>
          </label>
          <div>
            <Pax
              setShowPax={setShowPax}
              pax={pax}
              setPax={setPax}
              showPax={showPax}
            />
          </div>
        </div>

        {/* Date and Time Selection */}
        <div className="">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <div className="mb-2 sm:mb-0">
              <span className="text-sm text-gray-600">Departure: </span>
              <span className="font-semibold">
                {dayjs(preferred_departure_time)?.format("DD MMM, YYYY")}
              </span>
            </div>
            
            <div className="time-dropdown-container relative w-full sm:w-auto">
              <div 
                className="flex items-center justify-between p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-50"
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              >
                <span className="text-sm font-medium">
                  Departure Time: {dayjs(preferred_departure_time)?.format("HH:mm A") || "Select Time"}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showTimeDropdown ? 'transform rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
              
              {showTimeDropdown && (
                <div className="absolute z-10 w-full sm:w-64 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <div className="sticky -top-1 bg-gray-100 p-2 border-b">
                    <span className="font-medium text-sm">Select Time</span>
                  </div>
                  <div className="p-1">
                    {timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className={`p-2 hover:bg-blue-50 cursor-pointer text-sm rounded-md ${
                          selectedTime === slot.display ? 'bg-blue-100' : ''
                        }`}
                        onClick={() => handleTimeSelection(slot)}
                      >
                        {slot.display}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative sm:w-auto">
  <div
    className="p-2 border w-[15rem] flex flex-row items-center cursor-pointer rounded-md hover:bg-gray-50"
    onClick={() => setShowSortDropdown(prev => !prev)}
  >
    <MdSort className="mr-1" />
    <span className="text-sm">
      Sort: {filtersState.sort_by} {filtersState.order === "asc" ? "(Low to High)" : "(High to Low)"}
    </span>
  </div>

  {showSortDropdown && (
    <div className="absolute z-10 bg-white border rounded-md shadow-lg mt-1 w-48">
      {[
        { label: "Price (Low to High)", sort_by: "Price", order: "asc" },
        { label: "Price (High to Low)", sort_by: "Price", order: "desc" },
        { label: "Duration (Short to Long)", sort_by: "Duration", order: "asc" },
        { label: "Duration (Long to Short)", sort_by: "Duration", order: "desc" },
      ].map((option, idx) => (
        <div
          key={idx}
          className="p-2 hover:bg-blue-50 cursor-pointer text-sm"
          onClick={() => {
            setFiltersState({
              ...filtersState,
              sort_by: option.sort_by,
              order: option.order,
            });
            setShowSortDropdown(false);
          }}
        >
          {option.label}
        </div>
      ))}
    </div>
  )}
</div>

        </div>
      </div>

      <div className="flex justify-between p-2 bg-gray-50 border-t">
        <div className="text-sm">
          Showing <span className="font-semibold">{flightCount} flights</span>
        </div>
      </div>
    </div>
  );
};

export default ComboSection;