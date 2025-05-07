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
    updatePreferredDepartureTime,
  } = props;

  const [showPax, setShowPax] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (preferred_departure_time) {
      
      const time = dayjs(preferred_departure_time);
      console.log("There",time);
      setSelectedTime(time.format("h:mm A"));
    }
  }, []);

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
    setFiltersState(newFiltersState);
    
    setTimeout(() => {
      _FetchFlightsHandler();
      setIsLoading(false);
    }, 100);
  };

  const handleTimeSelection = (slot) => {
    setIsLoading(true);
    setSelectedTime(slot.display);

    const currentDate = dayjs(preferred_departure_time).format("YYYY-MM-DD");
    
    const [hours, minutes] = slot.value.split(":");
    const newDateTime = dayjs(`${currentDate}T${hours}:${minutes}:00`);
    
    const hour = parseInt(hours, 10);
    const timePeriod = getTimePeriodFromHour(hour);

    const newFiltersState = {
      ...filtersState,
      departure_time_period: null,
    };

    setFiltersState(newFiltersState);
    setShowTimeDropdown(false);
    
    // Pass the updated time to parent component
    if (updatePreferredDepartureTime) {
      updatePreferredDepartureTime(newDateTime.format("YYYY-MM-DDTHH:mm:ss"));
    //  setSelectedTime(newDateTime.format("h:mm A"));
    }
    
    // Add a slight delay before triggering flight search
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  const handleSortChange = (sortOption) => {
    setIsLoading(true);
    setFiltersState({
      ...filtersState,
      sort_by: sortOption.sort_by,
      order: sortOption.order,
    });
    setShowSortDropdown(false);
    
    // Trigger flight search after sort update
    setTimeout(() => {
      _FetchFlightsHandler();
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTimeDropdown, showSortDropdown]);

  return (
    <div className="font-sans w-full mx-auto bg-white">
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
              disabled={isLoading}
            />
            <span className="ml-2 text-sm">Non-stop flights only?</span>
          </label>
          <div>
            <Pax
              setShowPax={setShowPax}
              pax={pax}
              setPax={setPax}
              showPax={showPax}
              combo={true}
            />
          </div>
        </div>

        {/* Date and Time Selection */}
        <div className="">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            {preferred_departure_time && <div className="mb-2 sm:mb-0">
              <span className="text-sm text-gray-600">Departure Date: </span>
              <span className="font-semibold">
                {dayjs(preferred_departure_time)?.format("DD MMM, YYYY")}
              </span>
            </div>}

            <div className="time-dropdown-container relative w-full sm:w-auto">
              {(selectedTime || preferred_departure_time) && <div
                className="flex items-center justify-between p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-50"
                onClick={() => !isLoading && setShowTimeDropdown(!showTimeDropdown)}
              >
                <span className="text-sm font-medium">
                  Departure Time:{" "}
                  {selectedTime || dayjs(preferred_departure_time)?.format("h:mm A") || "Select Time"}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    showTimeDropdown ? "transform rotate-180" : ""
                  }`}
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
              </div>}

              {showTimeDropdown && (
                <div className="absolute z-10 w-full sm:w-64 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <div className="sticky top-0 bg-gray-100 p-2 border-b">
                    <span className="font-medium text-sm">Select Time</span>
                  </div>
                  <div className="p-1">
                    {timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className={`p-2 hover:bg-blue-50 cursor-pointer text-sm rounded-md ${
                          selectedTime === slot.display ? "bg-blue-100" : ""
                        }`}
                        onClick={() => !isLoading && handleTimeSelection(slot)}
                      >
                        {slot.display}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative sm:w-auto sort-dropdown-container">
            <div
              className="p-2 border w-full sm:w-64 flex flex-row items-center cursor-pointer rounded-md hover:bg-gray-50"
              onClick={() => !isLoading && setShowSortDropdown((prev) => !prev)}
            >
              <MdSort className="mr-1" />
              <span className="text-sm">
                Sort: {filtersState.sort_by}{" "}
                {filtersState.order === "asc"
                  ? "(Low to High)"
                  : "(High to Low)"}
              </span>
            </div>

            {showSortDropdown && (
              <div className="absolute z-10 bg-white border rounded-md shadow-lg mt-1 w-full sm:w-64">
                {[
                  {
                    label: "Price (Low to High)",
                    sort_by: "Price",
                    order: "asc",
                  },
                  {
                    label: "Price (High to Low)",
                    sort_by: "Price",
                    order: "desc",
                  },
                  {
                    label: "Duration (Ascending)",
                    sort_by: "Duration",
                    order: "asc",
                  },
                  {
                    label: "Duration (Descending)",
                    sort_by: "Duration",
                    order: "desc",
                  },
                ].map((option, idx) => (
                  <div
                    key={idx}
                    className={`p-2 hover:bg-blue-50 cursor-pointer text-sm ${
                      filtersState.sort_by === option.sort_by && filtersState.order === option.order
                        ? "bg-blue-100"
                        : ""
                    }`}
                    onClick={() => !isLoading && handleSortChange(option)}
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
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading flights...
            </span>
          ) : (
            <>
              Showing <span className="font-semibold">{flightCount} flights</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComboSection;