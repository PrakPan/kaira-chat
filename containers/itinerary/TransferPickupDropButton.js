// TransferPickupDropButton.js
import React, { useState, useRef, useEffect } from "react";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { IoMdTrain, IoMdBoat } from "react-icons/io";
import { AiOutlineDown } from "react-icons/ai";

const TransferPickupDropButton = ({
  bookingMode,
  originCityName,
  destinationCityName,
  existingPickupBookings = [],
  existingDropBookings = [],
  onPickupClick,
  onDropClick,
  setHandleShow
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const hasPickup = existingPickupBookings.length > 0;
  const hasDrop = existingDropBookings.length > 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getButtonText = () => {
    if (hasPickup && hasDrop) return "Pickup & Drop Added";
    if (hasPickup && !hasDrop) return "Add Drop";
    if (!hasPickup && hasDrop) return "Add Pickup";
    return "Add Drop & Pickup";
  };

  const getIcon = () => {
    switch (bookingMode?.toLowerCase()) {
      case "flight":
        return <MdOutlineFlightTakeoff size={16} className="text-blue-600" />;
      case "train":
        return <IoMdTrain size={16} className="text-blue-600" />;
      case "ferry":
        return <IoMdBoat size={16} className="text-blue-600" />;
      default:
        return null;
    }
  };

  const getDropdownOptions = () => {
    const options = [];
    
    if (!hasPickup) {
      options.push({
        id: 'pickup',
        label: `Pickup from ${destinationCityName}`,
        onClick: () => {
          setHandleShow(true);
          onPickupClick();

          setIsDropdownOpen(false);
        }
      });
    }
    
    if (!hasDrop) {
      options.push({
        id: 'drop',
        label: `Drop in ${originCityName}`,
        onClick: () => {
            setHandleShow(true)
          onDropClick();
          setIsDropdownOpen(false);
        }
      });
    }

    return options;
  };


  if (!['flight', 'train', 'ferry'].includes(bookingMode?.toLowerCase())) {
    return null;
  }

  const dropdownOptions = getDropdownOptions();

  // If both pickup and drop exist, make it clickable to show details
  if (hasPickup && hasDrop) {
    return (
      <div className="flex items-center gap-2 text-blue-600 font-medium text-sm">
        {getIcon()}
        <span>{getButtonText()}</span>
      </div>
    );
  }

  // If only one option available, make it direct click
  if (dropdownOptions.length === 1) {
    return (
      <button
        onClick={dropdownOptions[0].onClick}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline transition-colors"
      >
        {/* {getIcon()} */}
        <span className="text-blue hover:text-blue">+ {getButtonText()}</span>
      </button>
    );
  }

  // If multiple options, show dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2  font-medium text-sm hover:underline transition-colors"
      >
        {/* {getIcon()} */}
        <span className="text-blue hover:text-blue">+ {getButtonText()}</span>
        {/* <AiOutlineDown 
          className={`w-4 h-4 transition-transform ${
            isDropdownOpen ? 'rotate-180' : ''
          }`} 
        /> */}
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[200px]">
          {dropdownOptions.map((option) => (
            <button
              key={option.id}
              onClick={option.onClick}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors first:rounded-t-md last:rounded-b-md"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransferPickupDropButton;