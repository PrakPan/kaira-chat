import { useEffect, useState } from "react";

import Image from "next/image";
import Drawer from "../../../ui/Drawer";
import dayjs from "dayjs";

export default function FlightFilters(props) {
  const [priceRange, setPriceRange] = useState([
    props.filters?.price_range?.[0] || 15600,
    props.filters?.price_range?.[1] || 80000
  ]);
  const [tripType, setTripType] = useState(props.filters?.trip_type || "one_way");
  const [stops, setStops] = useState(props.filters?.stops || []);
  const [departureTime, setDepartureTime] = useState(props.filters?.departure_time || "00:00");
  const [airlines, setAirlines] = useState(props.selectedAirlines || []);
  const [fareType, setFareType] = useState(
  props.filters?.fare_type === true ? 'refundable' 
  : props.filters?.fare_type === false ? 'non_refundable' 
  : null
);
  const [showAllAirlines, setShowAllAirlines] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  // All airlines data
  const allAirlines = props.airlineCodes || [];

  const visibleAirlines = showAllAirlines ? allAirlines : allAirlines.slice(0, 7);

  // Generate time slots
  useEffect(() => {
    const slots = [];
    let baseTime = dayjs().startOf("day");
    const endTime = baseTime.add(1, "day").subtract(1, "minute");

    while (baseTime.isBefore(endTime) || baseTime.isSame(endTime)) {
      slots.push({
        value: baseTime.format("HH:mm"),
        display: baseTime.format("h:mm A"),
      });
      baseTime = baseTime.add(30, "minute");
    }

    setTimeSlots(slots);

    // Set initial selected time
    if (departureTime) {
      const [hours, minutes] = departureTime.split(":");
      const formattedTime = dayjs()
        .hour(parseInt(hours))
        .minute(parseInt(minutes))
        .format("h:mm A");
      setSelectedTime(formattedTime);
    }
  }, [departureTime]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTimeDropdown && !event.target.closest(".time-dropdown-container")) {
        setShowTimeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTimeDropdown]);

  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value);
    setPriceRange(newRange);
  };

  const handleStopsChange = (stop) => {
  setStops(prev => 
    prev.includes(stop) ? [] : [stop]
  );
};

  const handleAirlineChange = (code) => {
    setAirlines(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

const handleFareTypeChange = (fare) => {
  setFareType(prev => prev === fare ? null : fare);
};

  const handleTimeSelection = (slot) => {
    setSelectedTime(slot.display);
    setDepartureTime(slot.value);
    setShowTimeDropdown(false);
    // Don't call setPreferredDepartureTime here - wait for Apply button
  };

// Update the handleApply function around line 100:
const handleApply = () => {
  // Convert departureTime (HH:mm) to full ISO datetime
  let fullDepartureDateTime = props.filters?.preferred_departure_time;
  if (departureTime) {
    const [hours, minutes] = departureTime.split(":");
    const baseDateTime = dayjs(props.filters?.preferred_departure_time);
    fullDepartureDateTime = baseDateTime
      .hour(parseInt(hours))
      .minute(parseInt(minutes))
      .second(0)
      .millisecond(0)
      .format("YYYY-MM-DDTHH:mm:ss");
  }

  const newFilters = {
    price_range: priceRange,
    trip_type: tripType,
    stops: stops,
    departure_time: departureTime,
    airlines: airlines.join(","),
    fare_type: fareType === 'refundable' ? true : fareType === 'non_refundable' ? false : null,
    non_stop_flights: stops.includes("non_stop")
  };

  // Close drawer first before updating filters
  props.setShowFilter(false);
  
  // Then update filters and trigger fetch
  setTimeout(() => {
    if (props.handleFiltersChange) {
      props.handleFiltersChange(newFilters);
    } else {
      props.setFiltersState(newFilters);
    }

    if (props.setPreferredDepartureTime) {
      props.setPreferredDepartureTime(fullDepartureDateTime);
    }

    if (props.setSelectedAirlines) {
      props.setSelectedAirlines(airlines);
    }

    if (props.setIsTimeOnlyChange) {
      props.setIsTimeOnlyChange(true);
    }

    props?.setIsFilterChangesApplied(true);
  }, 100);
};

  const removeAllFilter = () => {
    setPriceRange([15600, 80000]);
    setTripType("one_way");
    setStops([]);
    setDepartureTime("00:00");
    setAirlines([]);
    setFareType(null);
    setSelectedTime(null);

    const clearedFilters = {
      price_range: [15600, 80000],
      trip_type: "one_way",
      stops: [],
      departure_time: "00:00",
      airlines: "",
      fare_type: null,
      non_stop_flights: false
    };

    if (props.handleFiltersChange) {
      props.handleFiltersChange(clearedFilters);
    } else {
      props.setFiltersState(clearedFilters);
    }

    if (props.setSelectedAirlines) {
      props.setSelectedAirlines([]);
    }

    props.setShowFilter(false);
    props?.setIsFilterChangesApplied(false);
  };

  return (
    <Drawer
      show={props.showFilter}
      anchor={"right"}
      backdrop
      style={{ zIndex: 1508 }}
      className=""
      onHide={() => props.setShowFilter(false)}
    >
      <div className="w-[80vw] md:w-[27vw] px-lg h-[98vh] flex flex-col items-start mx-auto">
        <div className="my-[1rem]">
          <Image 
            src="/backarrow.svg" 
            className="cursor-pointer" 
            width={22} 
            height={2} 
            onClick={() => props.setShowFilter(false)} 
          />
        </div>
        
        <div className="flex w-100 flex-row my-0 justify-between items-center">
          <div className="text-xl font-600 leading-2xl">Filters</div>
          {props?.isFilterChangesApplied && (
            <button 
              className="font-md font-500 leading-lg-md underline text-text-error" 
              onClick={removeAllFilter}
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-col gap-xl mt-lg overflow-y-auto scrollbar-hide h-[80%] w-full">

          <hr className="m-zero" />

          {/* Trip Type */}
          <div>
            <h3 className="text-base font-500 mb-sm">Trip Type</h3>
            <label className="flex items-center mb-sm cursor-pointer">
              <div 
                className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-sm ${
                  tripType === 'one_way' ? 'bg-[#07213A] border-[#07213A]' : 'border-border-default'
                }`}
                onClick={() => setTripType('one_way')}
              >
                {tripType === 'one_way' && (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <span className="text-base font-400">One Way</span>
            </label>
            {/* <label className="flex items-center cursor-pointer">
              <div 
                className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-sm ${
                  tripType === 'round_trip' ? 'bg-[#07213A] border-[#07213A]' : 'border-border-default'
                }`}
                onClick={() => setTripType('round_trip')}
              >
                {tripType === 'round_trip' && (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <span className="text-base font-400">Round Trip</span>
            </label> */}
          </div>

          <hr className="m-zero" />

          {/* Stops */}
          <div>
            <h3 className="text-base font-500 mb-sm">Stops</h3>
            {[
              { value: 'non_stop', label: 'Non-Stop' },
              { value: 'multiple_stops', label: '1+ Stops' },
            //   { value: 'multiple_stops', label: '1+ Stops' }
            ].map((stop) => (
              <label key={stop.value} className="flex items-center mb-sm cursor-pointer">
                <div 
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-sm ${
                    stops.includes(stop.value) ? 'bg-[#07213A] border-[#07213A]' : 'border-border-default'
                  }`}
                  onClick={() => handleStopsChange(stop.value)}
                >
                  {stops.includes(stop.value) && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-base font-400">{stop.label}</span>
              </label>
            ))}
          </div>

          <hr className="m-zero" />

          {/* Departure Time */}
          <div className="time-dropdown-container relative">
            <h3 className="text-base font-500 mb-sm">Departure Time</h3>
            <div
              className="flex items-center gap-2 p-2 border border-border-default rounded-lg cursor-pointer bg-[#f9f9f9] hover:bg-gray-50"
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
            >
                  <button>
                <svg
                  className="w-5 h-5 text-gray-600"
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
              <span className="text-sm font-500">
               
                {selectedTime || "Select Time"}
              </span>
             
            </div>

            {showTimeDropdown && (
              <div className="absolute z-[15] w-full mt-1 bg-white border border-border-default rounded-lg shadow-lg max-h-60 overflow-y-auto scrollbar-hide">
                <div className="sticky top-0 bg-gray-100 p-2 border-b">
                  <span className="font-500 text-sm">Select Time</span>
                </div>
                <div className="p-1">
                  {timeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={`p-2 hover:bg-blue-50 cursor-pointer text-sm rounded-md ${
                        selectedTime === slot.display ? "bg-blue-100" : ""
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

         {!props?.loading && allAirlines.length > 0 ? <hr className="m-zero" /> : null}

          {/* Airlines */}
          {!props?.loading && allAirlines.length > 0 ? <div>
            <h3 className="text-base font-500 mb-sm">Airlines</h3>
            {visibleAirlines.map((airline) => (
              <label key={airline.code} className="flex items-center mb-sm cursor-pointer">
                <div 
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-sm ${
                    airlines.includes(airline.code) ? 'bg-[#07213A] border-[#07213A]' : 'border-border-default'
                  }`}
                  onClick={() => handleAirlineChange(airline.code)}
                >
                  {airlines.includes(airline.code) && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-base font-400">{airline.name} ({airline.code})</span>
              </label>
            ))}
            {!showAllAirlines && allAirlines.length > 7 && (
              <button 
                onClick={() => setShowAllAirlines(true)}
                className="text-primary-default text-sm font-500 mt-xs"
              >
                +{allAirlines.length - 7} more
              </button>
            )}
          </div> : null}

          <hr className="m-zero" />

          {/* Fare Type */}
          <div>
            <h3 className="text-base font-500 mb-sm">Fare Type</h3>
            {[
              { value: 'refundable', label: 'Refundable' },
              { value: 'non_refundable', label: 'Non Refundable' }
            ].map((fare) => (
              <label key={fare.value} className="flex items-center mb-sm cursor-pointer">
                <div 
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-sm ${
                    fareType === fare.value ? 'bg-[#07213A] border-[#07213A]' : 'border-border-default'
                  }`}
                  onClick={() => handleFareTypeChange(fare.value)}
                >
                  {fareType === fare.value && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-base font-400">{fare.label}</span>
              </label>
            ))}
          </div>

          <hr className="m-zero" />
        </div>

        <div className="w-full flex gap-3 flex-row mx-auto my-zero justify-end fixed bottom-zero bg-text-white left-zero p-md">
          <button className="ttw-btn-secondary-flat" onClick={() => props.setShowFilter(false)}>
            Cancel
          </button>
          <button className="ttw-btn-secondary-fill" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>

      <style jsx>{`
        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #07213A;
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .range-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #07213A;
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </Drawer>
  );
}