import React, { useState, useEffect } from "react";
import { MdSort } from "react-icons/md";
import { Pax } from "../../drawers/activityDetails/Pax";

const ComboSection = (props) => {
  const {
    filtersState,
    setFiltersState,
    pax,
    setPax,
    _FetchFlightsHandler,
    setHideFlightModal,
    flightCount
  } = props;

  const [showPax, setShowPax] = useState(false);
  
  const toggleNonStop = () => {
    const newFiltersState = {
      ...filtersState,
      non_stop_flights: !filtersState.non_stop_flights
    };
    setFiltersState(newFiltersState);
  };

  const handleDepartureTimeChange = (e) => {
    const newFiltersState = {
      ...filtersState,
      departure_time_period: e.target.value
    };
    setFiltersState(newFiltersState);
  };

  const handleArrivalTimeChange = (e) => {
    const newFiltersState = {
      ...filtersState,
      arrival_time_period: e.target.value
    };
    setFiltersState(newFiltersState);
  };

  const getTimeDisplay = (value) => {
    switch(value) {
      case "MORNING": return "6 AM - 10 AM";
      case "AFTERNOON": return "10 AM - 4 PM";
      case "EVENING": return "12 PM - 6 PM";
      case "NIGHT": return "9 PM - 6 AM";
      default: return "Any Time";
    }
  };

  const handleSortChange = () => {
    const newOrder = filtersState.order === "asc" ? "desc" : "asc";
    const newFiltersState = {
      ...filtersState,
      order: newOrder
    };
    setFiltersState(newFiltersState);
    // Refetch with new filters
    setTimeout(() => {
      _FetchFlightsHandler();
    }, 100);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      _FetchFlightsHandler();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [filtersState]);

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
          <div className="flex flex-row flex-1 justify-between">
            <div>
              <span className="text-sm text-gray-600 mb-1">Departure Date: &nbsp; </span>
              <span className="font-semibold">10 April, 2025</span>
            </div>
            <div 
              className="p-1 border flex flex-row items-center cursor-pointer"
              onClick={handleSortChange}
            >
              <MdSort/> 
              <span>Sort: {filtersState.sort_by} ({filtersState.order})</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-4"></div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4 w-full">
      <div className="w-full sm:w-1/2">
        <div className="relative">
          <div className="flex items-center w-full p-2 bg-gray-100  border-gray-200 rounded-md text-gray-800">
            <span className="mr-2 font-medium">Departure From |</span>
            <span className="">{getTimeDisplay(filtersState.departure_time_period)}</span>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          <select
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            value={filtersState.departure_time_period}
            onChange={handleDepartureTimeChange}
          >
            <option value="">Any Time</option>
            <option value="MORNING">6 AM - 10 AM</option>
            <option value="AFTERNOON">10 AM - 4 PM</option>
            <option value="EVENING">12 PM - 6 PM</option>
            <option value="NIGHT">9 PM - 6 AM</option>
          </select>
        </div>
      </div>
      
      <div className="w-full sm:w-1/2">
        <div className="relative">
          <div className="flex items-center w-full p-2 bg-gray-100 border-gray-200 rounded-md text-gray-800">
            <span className="mr-2 font-medium">Arrival at |</span>
            <span className="">{getTimeDisplay(filtersState.arrival_time_period)}</span>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          <select
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            value={filtersState.arrival_time_period}
            onChange={handleArrivalTimeChange}
          >
            <option value="">Any Time</option>
            <option value="MORNING">6 AM - 10 AM</option>
            <option value="AFTERNOON">10 AM - 4 PM</option>
            <option value="EVENING">12 PM - 6 PM</option>
            <option value="NIGHT">9 PM - 6 AM</option>
          </select>
        </div>
      </div>
    </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between p-2 bg-gray-50 border-t">
        <div className="text-sm">
          Showing <span className="font-semibold">{flightCount} flights</span>
        </div>
        {/* <div className="text-sm">
          <button 
            className="text-blue-600 text-sm"
            onClick={_FetchFlightsHandler}
          >
            Apply Filters
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ComboSection;