import React, { useState, useEffect } from "react";
import { MdSort } from "react-icons/md";
import { Pax } from "../../drawers/activityDetails/Pax";
import dayjs from "dayjs";
import { DatePicker } from "../../../containers/newitinerary/breif/route/RouteEditSection";

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
  } = props;

  const [showPax, setShowPax] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateOptions, setDateOptions] = useState([]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // Add this flag
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


    // Debounce the API call
    const timer = setTimeout(() => {
      if (updatePreferredDepartureTime) {
         setIsTimeOnlyChange(true);
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

    // Only pass airlines param, remove other filters
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

    // Use parent's handler
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTimeDropdown, showSortDropdown]);

  const handleDatePickerChange = (event) => {
    if (!isLoading) {
      const selectedDateValue = dayjs(event.target.value).format("YYYY-MM-DD");
      const selectedDateDisplay = dayjs(event.target.value).format(
        "DD MMM, YYYY"
      );

      handleDateSelection({
        value: selectedDateValue,
        display: selectedDateDisplay,
      });
    }
  };

  return (
    <div className="font-sans w-full mx-auto bg-white">
      <div className="p-2">
        <div className="mb-2 flex items-center justify-between">
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
        </div>

        <div className="">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
            {preferred_departure_time && (
              <div className="w-full sm:w-auto text-sm">

                <div className="text-sm font-medium text-gray-700 mb-2">
                Departure Date
              </div>
                <DatePicker
                  id="departure-date"
                  date={
                    selectedDate
                      ? dayjs(selectedDate, "DD MMM, YYYY").format("YYYY-MM-DD")
                      : preferred_departure_time
                  }
                  defaultDate={preferred_departure_time}
                  onDateChange={handleDatePickerChange}
                />
              </div>
            )}

            {/* Time Dropdown */}
            <div className="time-dropdown-container relative w-full sm:w-auto">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Departure Time
              </div>
              {(selectedTime || preferred_departure_time) && (
                <div
                  className="flex items-center justify-between p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-50"
                  onClick={() =>
                    !isLoading && setShowTimeDropdown(!showTimeDropdown)
                  }
                >
                  <span className="text-sm font-medium">
                    {selectedTime ||
                      dayjs(preferred_departure_time)?.format("h:mm A") ||
                      "Select Time"}
                  </span>
                  <button>
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {showTimeDropdown && (
                <div className="absolute z-[15] w-full sm:w-64 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
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

          <div className="flex justify-between flex-col md:flex-row gap-2">
            <div className="relative sm:w-auto sort-dropdown-container">
              {airlineCodes && airlineCodes.length > 0 && (
                <>
                  <div
                    className="p-2 border w-full sm:w-64 flex flex-row items-center cursor-pointer rounded-md hover:bg-gray-50"
                    onClick={() =>
                      !isLoading && setShowSortDropdown((prev) => !prev)
                    }
                  >
                    <MdSort className="mr-1" />
                    <span className="text-sm">Selected Airlines ({(selectedAirlines?.length)})</span>
                  </div>

                  {showSortDropdown && (
                    <div className="absolute z-[15] bg-white border rounded-md shadow-lg mt-1 w-full sm:w-64 max-h-60 overflow-y-auto">
                      {airlineCodes.map((option, idx) => (
                        <div
                          key={idx}
                          className="p-2 flex justify-between items-center hover:bg-blue-50 cursor-pointer text-sm"
                          onClick={() =>
                            !isLoading && handleAirlineMultiSelect(option.code)
                          }
                        >
                          <span>
                            {option.name} ({option.code})
                          </span>
                          <input
                            type="checkbox"
                            checked={selectedAirlines.includes(option.code)}
                            readOnly
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Pax block — always second */}
            <div className="mt-2 md:mt-0">
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
        </div>
      </div>
    </div>
  );
};

export default ComboSection;
