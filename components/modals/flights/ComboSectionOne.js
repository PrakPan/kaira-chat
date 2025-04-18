import React, { useState, useRef } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { RiArrowRightSLine } from "react-icons/ri";
import { Pax } from "../../drawers/activityDetails/Pax";
import { useSelector } from "react-redux";
import { MdSort } from "react-icons/md";

const ComboSection = (props) => {
  const [showPassengerDetails, setShowPassengerDetails] = useState(false);
  const [isNonStop, setIsNonStop] = useState(false);
  const [showPax, setShowPax] = useState(false);
  const [pax, setPax] = useState(
      useSelector((state) => state.ItineraryFilters).occupancies
    );
  const [passengers, setPassengers] = useState({
    adults: 2,
    children: 1,
    infants: 0
  });
  
  const toggleNonStop = () => {
    setIsNonStop(!isNonStop);
  };

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
              checked={isNonStop}
              onChange={toggleNonStop}
            />
            <span className="ml-2 text-sm">Non - Stop Flight only?</span>
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
            <div className="p-1 border flex flex-row items-center">
            <MdSort/> <span>Sort</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-4"></div>

          <div className="flex md:flex-row gap-4 mb-4">
          <div className="flex flex-col flex-1">
            <span className="text-sm text-gray-600 mb-1">Departure From:</span>
            <select className="p-2 border rounded-md bg-white">
              <option>12 PM - 6 PM</option>
              <option>6 AM - 12 PM</option>
              <option>Before 6 AM</option> 
              <option>After 6 PM</option>
            </select>
          </div>
          
          <div className="flex flex-col flex-1">
            <span className="text-sm text-gray-600 mb-1">Arrival at:</span>
            <select className="p-2 border rounded-md bg-white">
              <option>12 PM - 6 PM</option>
              <option>6 AM - 12 PM</option>
              <option>Before 6 AM</option>
              <option>After 6 PM</option>
            </select>
          </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between p-4 bg-gray-50 border-t">
        <div className="text-sm">
          Showing <span className="font-semibold">10 flights</span>
        </div>
        <div className="text-sm">
          Sort by: <span className="font-semibold">Price</span>
        </div>
      </div>
    </div>
  );
};

const PassengerSelector = ({ passengers, setPassengers, onClose }) => {
  const containerRef = useRef(null);

  const handleIncrement = (type) => {
    setPassengers(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const handleDecrement = (type) => {
    if (passengers[type] > (type === 'adults' ? 1 : 0)) {
      setPassengers(prev => ({
        ...prev,
        [type]: prev[type] - 1
      }));
    }
  };

  return (
    <div 
      ref={containerRef}
      className="absolute top-full left-0 right-0 bg-white border shadow-lg rounded-md p-4 z-10"
    >
      <div className="flex justify-between mb-4">
        <div className="font-semibold">Passengers</div>
        <button onClick={onClose} className="text-gray-500">
          <IoMdClose />
        </button>
      </div>
      
      <div className="mb-3">
        <div className="text-sm mb-1">Adults (12y +)</div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleDecrement('adults')}
            className="bg-gray-100 p-1 rounded-full"
            disabled={passengers.adults <= 1}
          >
            <FaMinus className="text-xs" />
          </button>
          <span className="font-semibold">{passengers.adults}</span>
          <button 
            onClick={() => handleIncrement('adults')}
            className="bg-gray-100 p-1 rounded-full"
          >
            <FaPlus className="text-xs" />
          </button>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="text-sm mb-1">Children (2y - 12y)</div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleDecrement('children')}
            className="bg-gray-100 p-1 rounded-full"
            disabled={passengers.children <= 0}
          >
            <FaMinus className="text-xs" />
          </button>
          <span className="font-semibold">{passengers.children}</span>
          <button 
            onClick={() => handleIncrement('children')}
            className="bg-gray-100 p-1 rounded-full"
          >
            <FaPlus className="text-xs" />
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-sm mb-1">Infants (below 2y)</div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleDecrement('infants')}
            className="bg-gray-100 p-1 rounded-full"
            disabled={passengers.infants <= 0}
          >
            <FaMinus className="text-xs" />
          </button>
          <span className="font-semibold">{passengers.infants}</span>
          <button 
            onClick={() => handleIncrement('infants')}
            className="bg-gray-100 p-1 rounded-full"
          >
            <FaPlus className="text-xs" />
          </button>
        </div>
      </div>
      
      <div className="pt-2 border-t">
        <button 
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-1 rounded-md"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default ComboSection;