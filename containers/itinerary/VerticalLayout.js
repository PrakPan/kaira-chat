import styled from "styled-components";
import React, { use, useEffect, useRef } from "react";
import Pin from "../newitinerary/breif/route/Pin";
import { IoCar } from "react-icons/io5";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { IoMdTrain, IoMdBoat, IoIosArrowForward } from "react-icons/io";
import { FaBus, FaPen } from "react-icons/fa";
import axios from "axios";
import { MERCURY_HOST } from "../../services/constants";
import { useState } from "react";
import { useRouter } from "next/router";
import { axiosDeleteBooking } from "../../services/itinerary/bookings";
import {
  updateAirportTransferBooking,
  updateTransferBookings,
} from "../../store/actions/transferBookingsStore";
import { useDispatch, useSelector } from "react-redux";
import TransferEditDrawer from "../../components/drawers/routeTransfer/TransferEditDrawer";
import TransferSkeleton from "../../components/itinerary/Skeleton/TransferSkeleton";
import { openNotification } from "../../store/actions/notification";
import { RiArrowDropRightLine } from "react-icons/ri";
import TransferDrawer from "./TransferDrawer";
import { LuInfo } from "react-icons/lu";
import TransferPickupDropButton from "./TransferPickupDropButton";
import PickupDropDrawer from "./PickupDropDrawer";
import { useHandleClose } from "../../hooks/useHandleClose";
import { useAnalytics } from "../../hooks/useAnalytics";
import useMediaQuery from "../../components/media";
import { setCloneItineraryDrawer } from "../../store/actions/cloneItinerary";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const VerticalLine = styled.div`
  width: 2px;
  height: ${(props) => props.height || "40px"};
  background: ${(props) =>
    props.gradient === "top"
      ? "linear-gradient(to bottom, #DDDDDD, transparent)"
      : "linear-gradient(to top, #DDDDDD, transparent)"};
  background-size: 10px 10px;
`;

const PinWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TaxiPickupDropItem = ({
  handlePickupDropDrawer,
  originCityName,
  destinationCityName,
  firstCity,
  lastCity,
  currentAirportBookings,
  handleEdit,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showClickTooltip, setShowClickTooltip] = useState(false);
  const dropdownRef = useRef(null);
  const tooltipTimeoutRef = useRef(null);
  let isPageWide = window.matchMedia("(min-width: 768px)")?.matches;
  const isDesktop = useMediaQuery("(min-width:767px)");

  const pickupBookings = currentAirportBookings?.filter((book) => book?.is_airport_pickup) || [];
  const dropBookings = currentAirportBookings?.filter((book) => book?.is_airport_drop) || [];

  const hasPickup = pickupBookings.length > 0;
  const hasDrop = dropBookings.length > 0;

  const handleInfoHover = (show) => {
    if (!showClickTooltip) {
      if (show) {
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
          tooltipTimeoutRef.current = null;
        }
        setShowTooltip(true);
      } else {
        tooltipTimeoutRef.current = setTimeout(() => {
          setShowTooltip(false);
          tooltipTimeoutRef.current = null;
        }, 1100);
      }
    }
  };

  const handleTooltipMouseEnter = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    setShowTooltip(true);
  };

  const handleTooltipMouseLeave = () => {
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
      tooltipTimeoutRef.current = null;
    }, 1100);
  };

  const handleTooltipAddClick = (e, type) => {
    e.stopPropagation();
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    setShowTooltip(false);
    setShowClickTooltip(false);
    handlePickupDropDrawer(type);
  };

  // ADDED: handleClick function
  const handleClick = () => {
    // If no bookings at all, show click tooltip
    if (!hasPickup && !hasDrop) {
      // For first city - directly open pickup drawer
      if (firstCity && !lastCity) {
        handlePickupDropDrawer("pickup");
        return;
      }
      
      // For last city - directly open drop drawer
      if (lastCity && !firstCity) {
        handlePickupDropDrawer("drop");
        return;
      }
      
      // For middle cities - show click tooltip with both options
      setShowClickTooltip(!showClickTooltip);
      setShowTooltip(false);
      return;
    }

    // If only one booking exists, open it directly
    if (hasPickup && !hasDrop && pickupBookings.length === 1) {
      handleEdit(false, pickupBookings[0]);
    } else if (!hasPickup && hasDrop && dropBookings.length === 1) {
      handleEdit(false, dropBookings[0]);
    } else {
      // Multiple bookings exist, show dropdown
      setShowClickTooltip(!showClickTooltip);
      setShowTooltip(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowClickTooltip(false);
      }
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
        tooltipTimeoutRef.current = null;
      }
    };

    if (showClickTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, [showClickTooltip]);

  const getDisplayText = () => {
    if (!hasPickup && !hasDrop) {
      // For first city: show only pickup option
      // For last city: show only drop option
      // For middle cities: show both options
      if (firstCity) {
        return "+ Add Taxi Pickup";
      } else if (lastCity) {
        return "+ Add Taxi Drop";
      } else {
        return "+ Add Taxi Pickup/Drop";
      }
    }

    if (hasPickup && hasDrop) {
      return "Pickup & Drop Added";
    } else if (hasPickup) {
      return "Pickup Added";
    } else if (hasDrop) {
      return "Drop Added";
    }
    return null;
  };

  const renderTooltipContent = () => {
    // If no bookings, show add options
    if (!hasPickup && !hasDrop) {
      return (
        <div className="flex flex-col gap-1">
          {/* Only show drop for non-first cities */}
          {!firstCity && (
            <div className="flex items-center gap-2">
              <span
                className="font-semibold text-yellow-300 cursor-pointer hover:text-yellow-100 underline transition-colors"
                onClick={(e) => handleTooltipAddClick(e, "drop")}
              >
                + Add Taxi Drop in {originCityName}
              </span>
            </div>
          )}
          {/* Only show pickup for non-last cities */}
          {!lastCity && (
            <div className="flex items-center gap-2">
              <span
                className="font-semibold text-yellow-300 cursor-pointer hover:text-yellow-100 underline transition-colors"
                onClick={(e) => handleTooltipAddClick(e, "pickup")}
              >
                + Add Taxi Pickup in {destinationCityName}
              </span>
            </div>
          )}
        </div>
      );
    }

    // If bookings exist, show them with add options for missing ones
    const existingBookings = [
      ...pickupBookings.map((booking) => ({
        ...booking,
        displayType: "Taxi Pickup",
        isExisting: true,
      })),
      ...dropBookings.map((booking) => ({
        ...booking,
        displayType: "Taxi Drop",
        isExisting: true,
      })),
    ];

    const addOptions = [];
    if (!hasDrop && !firstCity) {
      addOptions.push({
        displayType: "Add Drop",
        isAdd: true,
        addType: "drop",
      });
    }
    if (!hasPickup && !lastCity) {
      addOptions.push({
        displayType: "Add Pickup",
        isAdd: true,
        addType: "pickup",
      });
    }

    const sortedBookings = [...existingBookings, ...addOptions];

    return (
      <div className="flex flex-col gap-1">
        {sortedBookings.map((booking, index) => (
          <div key={`taxi-booking-${index}`} className="flex items-center gap-2">
            {booking.isAdd ? (
              <span
                className="font-semibold text-yellow-300 cursor-pointer hover:text-yellow-100 underline transition-colors"
                onClick={(e) => handleTooltipAddClick(e, booking.addType)}
              >
                {booking.addType === "pickup"
                  ? `+ Add Taxi Pickup in ${destinationCityName}`
                  : `+ Add Taxi Drop in ${originCityName}`}
              </span>
            ) : (
              <span
                className="font-semibold text-yellow-300 cursor-pointer hover:text-yellow-100 underline transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(false, booking);
                }}
              >
                {booking?.name || booking.displayType}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const displayText = getDisplayText();

  return displayText ? (
    <div key={-4} className="group relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <span
          className={`text-blue font-[500] text-[14px] ${
            displayText ? "hover:underline cursor-pointer" : ""
          }`}
          onClick={handleClick}
        >
          {displayText}
        </span>

        {/* Only show info icon for middle cities when no bookings */}
        {isPageWide && !firstCity && !lastCity  && (
          <div className="relative">
            <div
              className="w-4 h-4 rounded-full bg-white text-gray-400 flex items-center justify-center text-[14px] font-bold hover:bg-blue-700 transition-colors cursor-pointer"
              onMouseEnter={() => handleInfoHover(true)}
              onMouseLeave={() => handleInfoHover(false)}
            >
              <LuInfo size={16} strokeWidth={2.5} />
            </div>

            {showTooltip && !showClickTooltip && (
              <div
                className="absolute left-0 md:left-6 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs rounded-md px-3 py-2 shadow-xl border border-gray-600 whitespace-nowrap"
                style={{ zIndex: 100 }}
                onMouseEnter={handleTooltipMouseEnter}
                onMouseLeave={handleTooltipMouseLeave}
              >
                {renderTooltipContent()}
                <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
              </div>
            )}
          </div>
        )}
      </div>

      {showClickTooltip && (
        <div className="relative mt-2">
          <div
            className="absolute bg-gray-900 text-white text-xs rounded-md px-3 py-2 shadow-xl border border-gray-600 min-w-fit"
            style={{ zIndex: 100 }}
          >
            {renderTooltipContent()}
            <div className="absolute left-4 top-0 transform -translate-y-1 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  ) : null;
};

const AirportBookingItem = ({
  booking,
  handleIntracityBookings,
  upPresent,
  downPresent,
  onBookingDelete,
  bookingMode, // Add this prop
  originCityName, // Add this prop
  destinationCityName, // Add this prop
  onPickupClick, // Add this prop
  onDropClick, // Add this prop
  handleEdit,
  handlePickupDropDrawer,
  setTransferType,
  firstCity,
  lastCity,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showClickTooltip, setShowClickTooltip] = useState(false); // New state for click tooltip
  const dropdownRef = useRef(null);
  let isPageWide = window.matchMedia("(min-width: 768px)")?.matches;
  const tooltipTimeoutRef = useRef(null);

  const pickupBookings = booking.filter((book) => book?.is_airport_pickup);
  const dropBookings = booking.filter((book) => book?.is_airport_drop);
  const noPickupDropBookings = booking.filter(
    (book) => !book?.is_airport_drop && !book?.is_airport_pickup
  );


  const correctIcon = (TransportMode) => {
    switch (TransportMode) {
      case "Flight":
        return (
          <MdOutlineFlightTakeoff
            className="text-2xl text-[#a5a5a5]"
            size={16}
            color={"#a5a5a5"}
          />
        );
      case "Taxi":
      case "Car":
        return <IoCar className="text-2xl" size={16} color={"#a5a5a5"} />;
      case "Train":
        return <IoMdTrain className="text-2xl" size={16} color={"#a5a5a5"} />;
      case "Ferry":
        return <IoMdBoat className="text-2xl" size={16} color={"#a5a5a5"} />;
      case "Bus":
        return (
          <FaBus
            className="text-2xl text-[#a5a5a5]"
            size={14}
            color={"#a5a5a5"}
          />
        );
      default:
        return null;
    }
  };

  const handleInfoHover = (show) => {
    if (!showDetails && !showClickTooltip) {
      if (show) {
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
          tooltipTimeoutRef.current = null;
        }
        setShowTooltip(true);
      } else {
        tooltipTimeoutRef.current = setTimeout(() => {
          setShowTooltip(false);
          tooltipTimeoutRef.current = null;
        }, 1100);
      }
    }
  };

  const handleTooltipMouseEnter = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    setShowTooltip(true);
  };

  const handleTooltipMouseLeave = () => {
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
      tooltipTimeoutRef.current = null;
    }, 1100);
  };

  const handleTooltipBookingClick = (e, bookingItem, type) => {
    e.stopPropagation();

    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    setShowTooltip(false);
    setShowDetails(false);
    setShowClickTooltip(false);
    // handleIntracityBookings(upPresent && downPresent, {
    //   ...bookingItem,
    //   selectedType: type,
    // });
    handleEdit(false, bookingItem);
    setTransferType("Taxi")
  };

  const handleTooltipAddClick = (e, type) => {
    e.stopPropagation();

    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    setShowTooltip(false);
    setShowDetails(false);
    setShowClickTooltip(false);

    if (type === "pickup") {
      onPickupClick();
    } else if (type === "drop") {
      onDropClick();
    }
  };

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  const hasPickup = pickupBookings.length > 0;
  const hasDrop = dropBookings.length > 0;

  const supportsTransfers = (mode) => {
  return ["flight", "train", "ferry", "bus"].includes(mode?.toLowerCase());
};

 const getTransferLocationText = (mode, type) => {
  const isPickup = type === "pickup";
  const cityName = isPickup ? destinationCityName : originCityName;

  if (mode?.toLowerCase() === "flight") {
    return `+ Add Airport ${isPickup ? "Pickup" : "Drop"} in ${cityName}`;
  } else if (["train", "ferry", "bus"].includes(mode?.toLowerCase())) {
    return `+ Add Station ${isPickup ? "Pickup" : "Drop"} in ${cityName}`;
  }
  return `+ Add ${isPickup ? "Pickup" : "Drop"} in ${cityName}`;
};

  const getDisplayText = () => {
    const currentPickupBookings = booking.filter(
      (book) => book?.is_airport_pickup
    );
    const currentDropBookings = booking.filter((book) => book?.is_airport_drop);
    const currentNoPickupDropBookings = booking.filter(
      (book) => !book?.is_airport_drop && !book?.is_airport_pickup
    );

    const hasCurrentPickup = currentPickupBookings.length > 0;
    const hasCurrentDrop = currentDropBookings.length > 0;

    // If no bookings and supports transfers, show add pickup/drop text
    if (
      !hasCurrentPickup &&
      !hasCurrentDrop &&
      currentNoPickupDropBookings.length === 0 &&
      supportsTransfers(bookingMode)
    ) {
      return (
        <div className="flex items-center text-sm gap-1">
          <span>{`+ Add ${firstCity ? "Pickup" : lastCity ? "Drop" :"Pickup and Drop"}`}</span>
        </div>
      );
    }

    if (hasCurrentPickup && hasCurrentDrop) {
      const allTypes = [
        ...new Set([
          ...currentPickupBookings.map((book) => book?.booking_type),
          ...currentDropBookings.map((book) => book?.booking_type),
        ]),
      ];
      const uniqueIcons = allTypes.map((type) => correctIcon(type));

      return (
        <div className="flex items-center gap-1">
          {uniqueIcons}
          <span className="text-sm">Pickup & Drop Added</span>
        </div>
      );
    } else if (hasCurrentPickup) {
      const pickupIcons = [
        ...new Set(currentPickupBookings.map((book) => book?.booking_type)),
      ].map((type) => correctIcon(type));
      return (
        <div className="flex items-center gap-1">
          {pickupIcons}
          <span className="text-sm">Pickup Added</span>
        </div>
      );
    } else if (hasCurrentDrop) {
      const dropIcons = [
        ...new Set(currentDropBookings.map((book) => book?.booking_type)),
      ].map((type) => correctIcon(type));
      return (
        <div className="flex items-center gap-1">
          {dropIcons}
          <span className="text-sm">Drop Added</span>
        </div>
      );
    } else if (currentNoPickupDropBookings.length > 0) {
      return (
        <div className="flex items-center gap-2">
          {currentNoPickupDropBookings.map((book, index) => (
            <div key={index} className="flex items-center gap-1">
              {correctIcon(book?.booking_type)}
              <span>{book?.name}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const displayText = getDisplayText();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDetails(false);
        setShowClickTooltip(false);
      }
      if(tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
        tooltipTimeoutRef.current = null;
    }

    if (showDetails || showClickTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }}, [showDetails, showClickTooltip]);

  const handleClick = () => {
    // If no bookings and supports transfers, show tooltip below text
    if (
      !hasPickup &&
      !hasDrop &&
      noPickupDropBookings.length === 0 &&
      supportsTransfers(bookingMode)
    ) {
      setShowClickTooltip(!showClickTooltip);
      setShowTooltip(false);
      setShowDetails(false);
      return;
    }

    if (hasPickup && hasDrop) {
      setShowDetails(!showDetails);
      setShowTooltip(false);
      setShowClickTooltip(false);
    } else if (hasPickup && !hasDrop) {
      if (pickupBookings.length === 1) {
        // handleIntracityBookings(upPresent && downPresent, {
        //   ...pickupBookings[0],
        //   selectedType: "Airport Pickup",
        // });
        // setTransferType("Taxi")
        handleEdit(false, pickupBookings[0]);

      } else {
        setShowDetails(!showDetails);
        setShowTooltip(false);
        setShowClickTooltip(false);
      }
    } else if (!hasPickup && hasDrop) {
      if (dropBookings.length === 1) {
        // handleIntracityBookings(upPresent && downPresent, {
        //   ...dropBookings[0],
        //   selectedType: "Airport Drop",
        // });
        // setTransferType("Taxi")
        handleEdit(false, dropBookings[0]);

      } else {
        setShowDetails(!showDetails);
        setShowTooltip(false);
        setShowClickTooltip(false);
      }
    } else if (booking && booking.length > 0) {
      if (booking.length === 1) {
        // handleIntracityBookings(upPresent && downPresent, {
        //   ...booking[0],
        //   selectedType: "Airport Transfer",
        // });
        // setTransferType("Taxi")
        handleEdit(false, booking[0]);

      } else {
        setShowDetails(!showDetails);
        setShowTooltip(false);
        setShowClickTooltip(false);
      }
    }
  };

  const handleBookingClick = (e, bookingItem, type) => {
    e.stopPropagation();
    setShowTooltip(false);
    setShowDetails(false);
    setShowClickTooltip(false);
    // handleIntracityBookings(upPresent && downPresent, {
    //   ...bookingItem,
    //   selectedType: type,
    // });
    handleEdit(false, bookingItem);
    // setTransferType("Taxi")
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      return dateString?.split(" ")[0] || "N/A";
    }
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return dateString?.split(" ")[1]?.substring(0, 5) || "N/A";
    }
  };

  const renderTooltipContent = () => {
    const getBookingDate = (booking, isPickup = false) => {
      const dateStr = isPickup
        ? booking.check_in
        : booking.check_out || booking.check_in;
      return new Date(dateStr);
    };

    // If no bookings and supports transfers, show add options
    if (
      !hasPickup &&
      !hasDrop &&
      noPickupDropBookings.length === 0 &&
      supportsTransfers(bookingMode)
    ) {
      return (
        <div className="flex flex-col gap-1">
          {/* Show Drop first */}
          {!firstCity && <div className="flex items-center gap-2">
            <span
              className="font-semibold text-yellow-300 cursor-pointer hover:text-yellow-100 underline transition-colors"
              onClick={() => handlePickupDropDrawer("drop")}
            >
              {getTransferLocationText(bookingMode, "drop")}
            </span>
          </div>}
          {/* Then Pickup */}
          
         {!lastCity && <div className="flex items-center gap-2">
            <span
              className="font-semibold text-yellow-300 cursor-pointer hover:text-yellow-100 underline transition-colors"
              onClick={() => handlePickupDropDrawer("pickup")}
            >
              {getTransferLocationText(bookingMode, "pickup")}
            </span>
          </div>}
        </div>
      );
    }

    // If bookings exist, show them with add options for missing ones
    const allBookingsWithTypes = [];

    // Add existing bookings
    const existingBookings = [
      ...pickupBookings.map((booking) => ({
        ...booking,
        displayType: "Airport Pickup",
        sortDate: getBookingDate(booking, true),
        isExisting: true,
      })),
      ...dropBookings.map((booking) => ({
        ...booking,
        displayType: "Airport Drop",
        sortDate: getBookingDate(booking, false),
        isExisting: true,
      })),
      ...noPickupDropBookings.map((booking) => ({
        ...booking,
        displayType: "Airport Transfer",
        sortDate: getBookingDate(booking, false),
        isExisting: true,
      })),
    ].sort((a, b) => a.sortDate - b.sortDate);

    // Add "Add" options for missing pickup/drop if supports transfers
    if (supportsTransfers(bookingMode)) {
      if (!hasDrop && !firstCity) {
        allBookingsWithTypes.push({
          displayType: "Add Drop",
          isAdd: true,
          addType: "drop",
        });
      }
      if (!hasPickup && !lastCity) {
        allBookingsWithTypes.push({
          displayType: "Add Pickup",
          isAdd: true,
          addType: "pickup",
        });
      }
    }

    // Sort to show existing bookings first, then add options
    const sortedBookings = [
      ...existingBookings,
      ...allBookingsWithTypes.filter((b) => b.isAdd),
    ];

    return (
      <div className="flex flex-col gap-1">
        {sortedBookings.map((booking, index) => (
          <div key={`booking-${index}`} className="flex items-center gap-2">
            {booking.isAdd ? (
              <span
                className="font-semibold text-yellow-300 cursor-pointer hover:text-yellow-100 underline transition-colors"
                onClick={(e) => handleTooltipAddClick(e, booking.addType)}
              >
                {getTransferLocationText(bookingMode, booking.addType)}
              </span>
            ) : (
              <>
                <span
                  className="font-semibold text-yellow-300 cursor-pointer hover:text-yellow-100 underline transition-colors"
                  onClick={(e) =>
                    handleTooltipBookingClick(e, booking, booking.displayType)
                  }
                >
                  {booking?.name}:
                </span>
                <span className="text-gray-200">
                  • Date{" "}
                  {formatDate(
                    booking.displayType === "Airport Pickup"
                      ? booking.check_in
                      : booking.check_out || booking.check_in
                  )}{" "}
                  • Time{" "}
                  {formatTime(
                    booking.displayType === "Airport Pickup"
                      ? booking.check_in
                      : booking.check_out || booking.check_in
                  )}
                </span>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderDropdownContent = () => {
    const getBookingDate = (booking, isPickup = false) => {
      const dateStr = isPickup
        ? booking.check_in
        : booking.check_out || booking.check_in;
      return new Date(dateStr);
    };

    const allBookingsWithTypes = [
      ...pickupBookings.map((booking) => ({
        ...booking,
        displayType: "Airport Pickup",
        sortDate: getBookingDate(booking, true),
      })),
      ...dropBookings.map((booking) => ({
        ...booking,
        displayType: "Airport Drop",
        sortDate: getBookingDate(booking, false),
      })),
      ...noPickupDropBookings.map((booking) => ({
        ...booking,
        displayType: "Airport Transfer",
        sortDate: getBookingDate(booking, false),
      })),
    ].sort((a, b) => a.sortDate - b.sortDate);

    return (
      <div className="flex flex-col gap-2">
        {allBookingsWithTypes.map((booking, index) => (
          <div
            key={`dropdown-booking-${index}`}
            className="flex items-start gap-2 flex-wrap"
          >
            <span
              className="font-semibold text-yellow-300 cursor-pointer hover:text-yellow-100 underline transition-colors whitespace-nowrap"
              onClick={(e) =>
                handleBookingClick(e, booking, booking.displayType)
              }
            >
              {booking?.name}:
            </span>
            {isPageWide && (
              <span className="text-gray-200 flex-1">
                • Date{" "}
                {formatDate(
                  booking.displayType === "Airport Pickup"
                    ? booking.check_in
                    : booking.check_out || booking.check_in
                )}{" "}
                • Time{" "}
                {formatTime(
                  booking.displayType === "Airport Pickup"
                    ? booking.check_in
                    : booking.check_out || booking.check_in
                )}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return displayText ? (
    <div key={-3} className="group relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <span
          className={`text-blue font-[500] text-[14px] ${displayText ? "hover:underline cursor-pointer" : ""
            }`}
          onClick={handleClick}
        >
          {displayText}
        </span>

        {isPageWide && (
          <div className="relative">
            <div
              className="w-4 h-4 rounded-full bg-white text-gray-400 flex items-center justify-center text-[14px] font-bold hover:bg-blue-700 transition-colors cursor-pointer"
              onMouseEnter={() => handleInfoHover(true)}
              onMouseLeave={() => handleInfoHover(false)}
            >
              <LuInfo size={16} strokeWidth={2.5} />
            </div>

            {showTooltip && !showDetails && !showClickTooltip && (
              <div
                className="absolute left-0 md:left-6 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs rounded-md px-3 py-2 shadow-xl border border-gray-600 whitespace-nowrap"
                style={{ zIndex: 100 }}
                onMouseEnter={handleTooltipMouseEnter}
                onMouseLeave={handleTooltipMouseLeave}
              >
                {renderTooltipContent()}
                <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click tooltip for no bookings case - positioned below the text */}
      {showClickTooltip && (
        <div className="relative mt-2">
          <div
            className="absolute bg-gray-900 text-white text-xs rounded-md px-3 py-2 shadow-xl border border-gray-600 min-w-fit"
            style={{ zIndex: 100 }}
          >
            {renderTooltipContent()}
            <div className="absolute left-4 top-0 transform -translate-y-1 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
          </div>
        </div>
      )}

      {showDetails &&
        ((hasPickup && hasDrop) ||
          pickupBookings.length > 1 ||
          dropBookings.length > 1) && (
          <div className="relative mt-2">
            <div
              className="absolute bg-gray-900 text-white text-xs rounded-md px-2 py-2 shadow-xl border border-gray-600 min-w-fit md:min-w-[320px] max-w-[450px] md:w-[800px]"
              style={{ zIndex: 100 }}
            >
              {renderDropdownContent()}
              <div className="absolute left-4 top-0 transform -translate-y-1 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
            </div>
          </div>
        )}
    </div>
  ) : (
    // Show the add pickup/drop text even when no bookings if supports transfers
    supportsTransfers(bookingMode) && (
      <div key={-3} className="group relative" ref={dropdownRef}>
        <div className="flex items-center gap-2">
          <span
            className={`${isDesktop ? "Body1M_16" : "Body2M_14"} text-blue hover:underline `}
            onClick={handleClick}
          >
            + Add Pickup and Drop
          </span>

          {isPageWide && (
            <div className="relative">
              <div
                className="w-4 h-4 rounded-full bg-white text-gray-400 flex items-center justify-center text-[14px] font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                onMouseEnter={() => handleInfoHover(true)}
                onMouseLeave={() => handleInfoHover(false)}
              >
                <LuInfo size={16} strokeWidth={2.5} />
              </div>

              {showTooltip && !showDetails && !showClickTooltip && (
                <div
                  className="absolute left-0 md:left-6 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs rounded-md px-3 py-2 shadow-xl border border-gray-600 whitespace-nowrap"
                  style={{ zIndex: 100 }}
                  onMouseEnter={handleTooltipMouseEnter}
                  onMouseLeave={handleTooltipMouseLeave}
                >
                  {renderTooltipContent()}
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Click tooltip for no bookings case - positioned below the text */}
        {showClickTooltip && (
          <div className="relative mt-2">
            <div
              className="absolute bg-gray-900 text-white text-xs rounded-md px-3 py-2 shadow-xl border border-gray-600 min-w-fit"
              style={{ zIndex: 100 }}
            >
              {renderTooltipContent()}
              <div className="absolute left-4 top-0 transform -translate-y-1 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

const CityItem = ({
  city,
  selectedBooking,
  setSelectedBooking,
  duration,
  booking_type,
  transfer_type,
  upPresent,
  downPresent,
  booking_id,
  length,
  destination_city_id,
  destination_city_name,
  origin_city_name,
  setShowLoginModal,
  oCityData,
  dCityData,
  _updateFlightBookingHandler,
  _updatePaymentHandler,
  getPaymentHandler,
  _updateTaxiBookingHandler,
  airportBookings,
  booking,
  hotelName,
  destinationHotelName,
  sourceGmaps,
  destinationGmaps,
  sourceLat,
  sourceLong,
  destinationLat,
  destinationLong,
  firstCity,
  lastCity,
  bookingIdToDelete,
  pinColour,
  isLast,
  check_in,
  check_out,
  date_of_journey
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { transfers_status,pricing_status } = useSelector((state) => state.ItineraryStatus);
  const isDesktop = useMediaQuery("(min-width:767px)");

  const [isTransferDrawerOpen, setIsTransferDrawerOpen] = useState(false);
  const [transferDrawerType, setTransferDrawerType] = useState(null); // 'pickup' or 'drop'
  const [selectedTransferBooking, setSelectedTransferBooking] = useState(null);
  const { trackTransferBookingAdd, trackTransferBookingChange, trackTransferBookingDelete } = useAnalytics();
  const { id } = useSelector((state) => state.auth);

  const { drawer, bookingId, oItineraryCity, dItineraryCity, drawerType,  doj} =
    router?.query;

  const handlePickupClick = () => {
    setTransferDrawerType("pickup");
    setSelectedTransferBooking(null);
    setIsTransferDrawerOpen(true);
    handlePickupDropDrawer("pickup")
  };

  const handleDropClick = () => {
    setTransferDrawerType("drop");
    setSelectedTransferBooking(null);
    setIsTransferDrawerOpen(true);
    handlePickupDropDrawer("drop")
  };

  const correctIcon = (TransportMode) => {
    switch (TransportMode?.toLowerCase()) {
      case "flight":
        return (
          <MdOutlineFlightTakeoff
            className="text-2xl text-[#a5a5a5]"
            size={18}
            color={"#a5a5a5"}
          />
        );
      case "taxi":
      case "car":
        return <IoCar className="text-2xl" size={16} color={"#a5a5a5"} />;
      case "train":
        return <IoMdTrain className="text-2xl" size={16} color={"#a5a5a5"} />;
      case "ferry":
        return <IoMdBoat className="text-2xl" size={16} color={"#a5a5a5"} />;
      case "bus":
        return (
          <FaBus
            className="text-2xl text-[#a5a5a5]"
            size={16}
            color={"#a5a5a5"}
          />
        );
      default:
        return null;
    }
  };

  const handleClose = useHandleClose()

  const [data, setData] = useState({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comboDetails, setComboDetails] = useState(false);
  const [transferType, setTransferType] = useState(null);
  const [isIntracity, setIsIntracity] = useState(false);
  const [error, setError] = useState(false);
  const [currentAirportBookings, setCurrentAirportBookings] = useState(
    airportBookings || []
  );
  const [pickupDropShow, setPickupDropShow] = useState(false);
  const [airportBookingId, setAirportBookingId] = useState(null);


  let isPageWide = window.matchMedia("(min-width: 768px)")?.matches;
  const auth = useSelector(state=>state.auth);
  const {customer} = useSelector(state=>state.Itinerary)

  useEffect(() => {
    setCurrentAirportBookings(airportBookings || []);

  }, [airportBookings]);

  useEffect(() => {
  }, [bookingId]);

  useEffect(() => {
    if (!booking_id) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [booking_id]);

  useEffect(() => {
    // If URL has bookingId and transferType, set airportBookingId from URL
    if (router.query.bookingId && router.query.transferType) {
      setAirportBookingId(router.query.bookingId);
      setTransferType(router.query.transferType);
    } else if (!router.query.drawer) {
      // Reset airportBookingId when drawer is closed
      setAirportBookingId(null);
      setTransferType(null);
    }
  }, [router.query.bookingId, router.query.transferType, router.query.drawer]);

useEffect(() => {
  const isDrawerClosed = !drawer;
  
  if (isDrawerClosed) {
    document.body.style.overflow = 'initial';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.touchAction = '';
  }
}, [drawer]);


  // const handleEdit = async (combo, book) => {
  //   setTransferType(book?.booking_type || booking_type);
  //   setIsIntracity(false);
  //   if (combo) {
  //     setComboDetails(true);
  //   }
  //   setAirportBookingId(book?.id);
  //   setLoading(true);
  //   router.push(
  //     {
  //       pathname: `/itinerary/${router.query.id}`,
  //       query: {
  //         drawer: "Intracity",
  //         bookingId: book?.id,
  //         oItineraryCity: oCityData?.id || oCityData?.gmaps_place_id,
  //         dItineraryCity: dCityData?.id || dCityData?.gmaps_place_id
  //       },
  //     },
  //     undefined,
  //     {
  //       scroll: false,
  //     }
  //   );
  // };
  const handleEdit = async (combo, book) => {
     if(!localStorage.getItem("access_token")){
      setShowLoginModal(true);
      return;
     }
    //  if( auth?.id != customer){
    //   dispatch(setCloneItineraryDrawer(true));
    //   return;
    // }
    const bookingType = book?.booking_type || booking_type;
    setTransferType(bookingType);
    trackTransferBookingChange(router.query.id, bookingIdToDelete, oCityData?.name || oCityData?.city_name, dCityData?.name || dCityData?.city_name);
    setIsIntracity(false);
    if (combo) {
      setComboDetails(true);
    }
    setLoading(true);

    // Navigate to the URL with bookingId and transferType
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer: "Intracity",
          bookingId: book?.id,
          transferType: bookingType,
          oItineraryCity: oCityData?.id || oCityData?.gmaps_place_id,
          dItineraryCity: dCityData?.id || dCityData?.gmaps_place_id,
        },
      },
      undefined,
      {
        scroll: false,
      }
    );
  };

  const handlePickupDropDrawer = (drawerType) => {
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer: "addPickupDrop",
          drawerType: drawerType,
          oItineraryCity: oCityData?.id || oCityData?.gmaps_place_id,
          dItineraryCity: dCityData?.id || dCityData?.gmaps_place_id,
          doj: drawerType == 'pickup' ? check_out : check_in

        },
      },
      undefined,
      {
        scroll: false,
      }
    );
  };

  const handleAddTransfer = () => {
    if(localStorage.getItem("access_token")){
    // if( id != customer){
    //   dispatch(setCloneItineraryDrawer(true));
    //   return;
    // }
    trackTransferBookingChange(router.query.id, bookingIdToDelete, oCityData?.name || oCityData?.city_name, dCityData?.name || dCityData?.city_name);
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer: "editTransfer",
          bookingId: booking?.id,
          oItineraryCity: oCityData?.id || oCityData?.gmaps_place_id,
          dItineraryCity: dCityData?.id || dCityData?.gmaps_place_id,
        },
      },
      undefined,
      {
        scroll: false,
      }
    );
  } else {
    setShowLoginModal(true);
  }
  };


  const handleIntracityBookings = async (combo, booking) => {
    setIsIntracity(true);
    setTransferType(booking?.booking_type);
    if (combo) {
      setComboDetails(true);
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/${combo ? `combo` : booking?.booking_type.toLowerCase()
        }/${booking?.id}/`
      );
      setData(res?.data);
      setTransferType(res?.data?.booking_type);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };


   const handleDelete = async (val) => {
  if (!localStorage?.getItem("access_token")) {
    setShowLoginModal(true);
    return;
  }
  const dataPassed = val != null ? val : data;
  
  try {
    setLoading(true);
    const response = await axiosDeleteBooking.delete(
      `${router?.query?.id}/bookings/${
        dataPassed?.booking_type?.includes(",")
          ? `combo`
          : dataPassed?.booking_type?.toLowerCase()
      }/${dataPassed?.id}/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (response.status === 204) {
      // For multicity combo, pass all child booking IDs along with parent ID
      if (dataPassed?.combo_type === "multicity" && dataPassed?.children) {
        const childIds = dataPassed.children.map(child => child.id);
        dispatch(updateTransferBookings(dataPassed?.id, childIds, dataPassed?.combo_type));
      } else {
        // For regular bookings
        dispatch(updateTransferBookings(dataPassed?.id));
      }
      
      setLoading(false);
      getPaymentHandler();
      trackTransferBookingDelete(router.query.id, dataPassed?.id, id);

      if (isIntracity) {
        setCurrentAirportBookings((prev) =>
          prev.filter((booking) => booking.id !== dataPassed?.id)
        );
      } else {
        setVisible(true);
      }

      dispatch(
        openNotification({
          type: "success",
          text: `${city} deleted successfully`,
          heading: "Success!",
        })
      );
      handleClose();

      const bodyStyle = window.getComputedStyle(document.body).overflow;
      if (bodyStyle === "hidden") {
        document.body.style.overflow = "initial";
      }
    }
  } catch (err) {
    const errorMsg =
      err?.response?.data?.errors?.[0]?.message?.[0] ||
      err.response?.data?.errors[0]?.detail ||
      err.message;
    dispatch(
      openNotification({
        type: "error",
        text: errorMsg,
        heading: "Error!",
      })
    );
    setLoading(false);
  }
};

  //   useEffect(() => {
  //   if (transferType !== null && airportBookingId) {
  //     router.push(
  //       {
  //         pathname: `/itinerary/${router.query.id}`,
  //         query: {
  //           drawer: "Intracity",
  //           bookingId: airportBookingId,
  //           transferType: transferType,
  //           oItineraryCity: oCityData?.id || oCityData?.gmaps_place_id,
  //           dItineraryCity: dCityData?.id || dCityData?.gmaps_place_id
  //         },
  //       },
  //       undefined,
  //       {
  //         scroll: false,
  //       }
  //     );
  //   }
  // }, [transferType, airportBookingId]);

  useEffect(() => {
    if (router.query.transferType || transferType !== null) {

    } else {
      setAirportBookingId(null);
    }
  }, [router.query.transferType, transferType]);

  useEffect(() => {

    if (!router.query.drawer) {
      setTransferType(null);
      setAirportBookingId(null);
      setLoading(false);
    }
  }, [router.query.drawer]);


  const extractMode = (text) => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes("flight")) {
      return "Flight";
    } else if (lowerText.includes("train")) {
      return "Train";
    } else if (lowerText.includes("bus")) {
      return "Bus";
    } else if (lowerText.includes("taxi") || lowerText.includes("car")) {
      return "Car";
    } else if (lowerText.includes("ferry")) {
      return "Ferry";
    } else {
      return "";
    }
  };

  const handleTransferSubmit = async (transferData) => {
    if (!localStorage?.getItem("access_token")) {
      setShowLoginModal(true);
      return;
    }
    try {
      // setLoading(true);

      const bookingPayload = {
        transfer_type: "airport",
        source_itinerary_city:
          transferData.transferType === "pickup"
            ? dCityData?.id || dCityData?.gmaps_place_id
            : oCityData?.id || oCityData?.gmaps_place_id,
        destination_itinerary_city: null,
        // transferData.transferType === "pickup"
        //   ? dCityData?.id || dCityData?.gmaps_place_id
        //   : oCityData?.id || oCityData?.gmaps_place_id,
        is_pickup: transferData.transferType === "pickup",
        is_drop: transferData.transferType === "drop",
        source: transferData?.source,
        trace_id: transferData?.traceId,
        result_index: transferData?.selectedQuote?.result_index,
        booking_id: transferData?.booking_id,
      };

      const response = await axios.post(
        `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/taxi/`,
        bookingPayload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status === 200) {
        dispatch(
          updateAirportTransferBooking(
            `${transferData.transferType === "pickup"
              ? dCityData?.id || dCityData?.gmaps_place_id
              : oCityData?.id || oCityData?.gmaps_place_id
            }`,
            response.data
          )
        );

        if (_updatePaymentHandler) _updatePaymentHandler();
        if (getPaymentHandler) getPaymentHandler();

        dispatch(
          openNotification({
            type: "success",
            text: `${transferData.transferType === "pickup" ? "Pickup" : "Drop"
              } transfer added successfully`,
            heading: "Success!",
          })
        );
      }
      setIsTransferDrawerOpen(false);
      handleClose();
      setTransferDrawerType(null);
      setSelectedTransferBooking(null);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.errors?.[0]?.message?.[0] ||
          error?.response?.data?.message ||
          error?.response?.data?.errors?.[0]?.detail
          ? error?.response?.data?.errors?.[0]?.detail?.[0]
          : null || error.message;
      dispatch(
        openNotification({
          text: errorMsg,
          heading: "Error!",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const supportsTransfers = (mode, index) => {
    return ["flight", "train", "ferry"].includes(mode?.toLowerCase());
  };

  const existingPickupBookings = currentAirportBookings?.filter(
    booking => booking.is_airport_pickup
  ) || [];

  const existingDropBookings = currentAirportBookings?.filter(
    booking => booking.is_airport_drop
  ) || [];



  return (
    <Container className={`${isLast && "mb-[60px]"}`}>
       <PinWrapper>
  {upPresent && <VerticalLine height={"50px"} gradient="top" />}
  {upPresent && downPresent ? (
    <div className="flex items-center justify-center">
      {/* {correctIcon(booking_type)} */}
    </div>
  ) : (
    <Pin length={length} pinColour={"black"} inner={true} />
  )}
  {downPresent && <VerticalLine height={"50px"} gradient="bottom" />}
</PinWrapper>
     

      <div
        className={`flex flex-col gap-2 ${!downPresent && upPresent && "mt-[41px]z"
          } ${!upPresent && downPresent && "mb-[41px]"}`}
      >
        {/* City and Duration Section - Aligned with Pin */}
        <div
          className={`flex flex-col gap-3 ${!(upPresent && downPresent) ? "itmes-center justify-center" : ""
            }`}
        >
          {!(upPresent && downPresent) && <div className={`${isDesktop ? "Body1M_16" : "Body2M_14"}`}>{city}</div>}

          {transfers_status === "PENDING" ? (
  upPresent && downPresent ? (
    <TransferSkeleton />
  ) : (
    ""
  )
) : (
  upPresent &&
  downPresent && (
    <div
      className={`text-[16px] font-[500] flex flex-col gap-2 ${
        (currentAirportBookings &&
          currentAirportBookings.length > 0) ||
        ["flight", "train", "ferry", "bus"].includes(
          booking_type?.toLowerCase()
        )
          ? "mt-2"
          : (booking_id || city) && !visible
          ? "mt-2"
          : "mt-0"
      }`}
    >
      {(booking_id || city) && !visible ? (
        <>
          {/* EXISTING BOOKING DISPLAY - Icon and City Name */}
          <div className="flex gap-1">
            <div className="mt-[4px] flex items-start">
              {booking?.children
                ? booking?.children?.map((book, i) => {
                    const mode = extractMode(book?.booking_type);
                    return (
                      <React.Fragment key={i}>
                        {correctIcon(mode)}
                        {i < booking?.children?.length - 1 && (
                          <span>
                            <RiArrowDropRightLine size={18} color={"#a5a5a5"} />
                          </span>
                        )}
                      </React.Fragment>
                    );
                  })
                : correctIcon(booking_type)}
            </div>

            <div className="flex flex-col">
              <div
                className={`flex items-center gap-2 ${
                  upPresent && downPresent ? "group hover:cursor-pointer" : ""
                }`}
                onClick={() => {
                  upPresent &&
                    downPresent &&
                    handleEdit(transfer_type === "combo", booking);
                }}
              >
                <div
                  className={`${
                    isDesktop ? "Body1M_16" : "Body2M_14"
                  } group-hover:text-blue `}
                >
                  {upPresent && downPresent ? city : ""}
                </div>
                {upPresent && downPresent && (
                  <div className="">
                    <FaPen
                      size={12}
                      className="transition-transform group-hover:scale-150 duration-300 group-hover:text-yellow-500"
                    />
                  </div>
                )}
              </div>

              {duration && (
                <div className="Body3R_12">Duration: {duration}</div>
              )}
            </div>
          </div>

          {/* AIRPORT/STATION PICKUP DROP - Show only for flight/train/ferry/bus */}
         {transfers_status == "SUCCESS" &&
  pricing_status == "SUCCESS" && (
    <div className="flex flex-col gap-1">
      {/* CHANGED: Conditional rendering based on booking existence */}
      {(booking_id || currentAirportBookings.length > 0) ? (
        /* If main booking exists OR there are pickup/drop bookings, show AirportBookingItem */
        <AirportBookingItem
          key={`airport-${booking_id || "no-main"}`}
          booking={currentAirportBookings}
          handleIntracityBookings={handleIntracityBookings}
          upPresent={upPresent}
          downPresent={downPresent}
          bookingMode={booking_type}
          originCityName={origin_city_name}
          destinationCityName={destination_city_name}
          existingPickupBookings={existingPickupBookings}
          existingDropBookings={existingDropBookings}
          onPickupClick={handlePickupClick}
          onDropClick={handleDropClick}
          setHandleShow={setPickupDropShow}
          show={pickupDropShow}
          sourceGmaps={sourceGmaps}
          destinationGmaps={destinationGmaps}
          handleEdit={handleEdit}
          handlePickupDropDrawer={handlePickupDropDrawer}
          setAirportBookingId={setAirportBookingId}
          setTransferType={setTransferType}
          firstCity={firstCity}
          lastCity={lastCity}
        />
      ) : (
        /* If NO main booking and NO pickup/drop bookings, show TaxiPickupDropItem */
        <TaxiPickupDropItem
          key={`taxi-no-booking`}
          handlePickupDropDrawer={handlePickupDropDrawer}
          originCityName={origin_city_name}
          destinationCityName={destination_city_name}
          firstCity={firstCity}
          lastCity={lastCity}
          currentAirportBookings={currentAirportBookings}
          handleEdit={handleEdit}
        />
      )}
    </div>
  )}
        </>
      ) : (
        <>
          {/* NO BOOKING - Show both CTAs */}
          {/* First CTA: Add Transfer */}
          {isPageWide ? (
            <button
              onClick={handleAddTransfer}
              className={`${
                isDesktop ? "Body1M_16" : "Body2M_14"
              } text-blue hover:underline text-left`}
            >
              + Add Transfer from {origin_city_name} to {destination_city_name}
            </button>
          ) : (
            <button
              onClick={handleAddTransfer}
              className={`${
                isDesktop ? "Body1M_16" : "Body2M_14"
              } text-blue hover:underline text-left`}
            >
              + Add Transfer
            </button>
          )}

          {/* Second CTA: Add Taxi Pickup/Drop - Only when NO booking */}
          {transfers_status == "SUCCESS" && pricing_status == "SUCCESS" && (
            <TaxiPickupDropItem
              key={`taxi-no-booking`}
              handlePickupDropDrawer={handlePickupDropDrawer}
              originCityName={origin_city_name}
              destinationCityName={destination_city_name}
              firstCity={firstCity}
              lastCity={lastCity}
              currentAirportBookings={currentAirportBookings}
              handleEdit={handleEdit}
            />
          )}
        </>
      )}
    </div>
  )
)}
          {/* )} */}
        </div>
      </div>

      {drawer === "addPickupDrop" &&
        oItineraryCity == (oCityData?.id || oCityData?.gmaps_place_id) &&
        dItineraryCity == (dCityData?.id || dCityData?.gmaps_place_id) && (
          <PickupDropDrawer
            isOpen={drawer === "addPickupDrop" &&
              oItineraryCity == (oCityData?.id || oCityData?.gmaps_place_id) &&
              dItineraryCity == (dCityData?.id || dCityData?.gmaps_place_id)}
            hotelName={hotelName}
            destinationHotelName={destinationHotelName}
            sourceLat={sourceLat}
            sourceLong={sourceLong}
            destinationLat={destinationLat}
            destinationLong={destinationLong}
            booking={booking}
            onClose={handleClose}
            transferType={drawerType}
            doj={doj || date_of_journey}
            bookingMode={booking_type?.toLowerCase()}
            originCityName={origin_city_name}
            destinationCityName={destination_city_name}
            onSubmit={handleTransferSubmit}
            existingBooking={selectedTransferBooking}
            sourceGmaps={sourceGmaps}
            destinationGmaps={destinationGmaps}
            // show={pickupDropShow}
            _updateFlightBookingHandler={_updateFlightBookingHandler}
            _updatePaymentHandler={_updatePaymentHandler}
            getPaymentHandler={getPaymentHandler}
            setShowLoginModal={setShowLoginModal}
            city={origin_city_name}
            dcity={destination_city_name}
            _updateTaxiBookingHandler={_updateTaxiBookingHandler}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            originCityId={oCityData?.city?.id || oCityData?.gmaps_place_id}
            destinationCityId={dCityData?.city?.id || dCityData?.gmaps_place_id}
            origin_itinerary_city_id={
              oCityData?.id || oCityData?.gmaps_place_id
            }
            destination_itinerary_city_id={
              dCityData?.id || dCityData?.gmaps_place_id
            }
          />
        )}



      {((drawer == "editTransfer" &&
        (bookingId === booking_id || (bookingId === "" && !booking_id)) &&
        oItineraryCity == (oCityData?.id || oCityData?.gmaps_place_id) &&
        dItineraryCity == (dCityData?.id || dCityData?.gmaps_place_id)) || drawerType == "multicity") && (
          <TransferEditDrawer
            mercury
            addOrEdit={"transferAdd"}
            showDrawer={
              drawer == "editTransfer" &&
              (bookingId === booking_id || (bookingId === "" && !booking_id)) &&
              oItineraryCity == (oCityData?.id || oCityData?.gmaps_place_id) &&
              dItineraryCity == (dCityData?.id || dCityData?.gmaps_place_id)
            }
            destination={destination_city_id}
            _updateFlightBookingHandler={_updateFlightBookingHandler}
            _updatePaymentHandler={_updatePaymentHandler}
            getPaymentHandler={getPaymentHandler}
            oCityData={oCityData}
            dCityData={dCityData}
            setShowLoginModal={setShowLoginModal}
            city={origin_city_name}
            dcity={destination_city_name}
            _updateTaxiBookingHandler={_updateTaxiBookingHandler}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            originCityId={oCityData?.city?.id || oCityData?.gmaps_place_id}
            destinationCityId={dCityData?.city?.id || dCityData?.gmaps_place_id}
            origin_itinerary_city_id={
              oCityData?.id || oCityData?.gmaps_place_id
            }
            destination_itinerary_city_id={
              dCityData?.id || dCityData?.gmaps_place_id
            }
            booking_id={booking_id}
            booking_type={drawerType == "multicity" ? "multicity" : null}
          />
        )}

      {"Intracity" === drawer &&
        (bookingId === airportBookingId || bookingId === booking_id) && oItineraryCity == (oCityData?.id || oCityData?.gmaps_place_id) &&
        dItineraryCity == (dCityData?.id || dCityData?.gmaps_place_id) && (
          <TransferDrawer
            show={
              "Intracity" === drawer && (bookingId === airportBookingId || bookingId === booking_id)
            }
            error={error}
            transferType={router.query.transferType || transferType}
            combo={booking_type?.includes(",")}
            booking_type={transferType || booking_type}
            handleDelete={handleDelete}
            city={city}
            _updateFlightBookingHandler={_updateFlightBookingHandler}
            _updatePaymentHandler={_updatePaymentHandler}
            getPaymentHandler={getPaymentHandler}
            oCityData={oCityData}
            dCityData={dCityData}
            setShowLoginModal={setShowLoginModal}
            dcity={destination_city_name}
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
            originCityId={oCityData?.city?.id || oCityData?.gmaps_place_id}
            destinationCityId={dCityData?.city?.id || dCityData?.gmaps_place_id}
            origin_itinerary_city_id={
              oCityData?.id || oCityData?.gmaps_place_id
            }
            destination_itinerary_city_id={
              dCityData?.id || dCityData?.gmaps_place_id
            }
            isIntracity={isIntracity}
            booking_id={airportBookingId || booking_id}
            setError={setError}
          />
        )}
    </Container>
  );
};

export default CityItem;

