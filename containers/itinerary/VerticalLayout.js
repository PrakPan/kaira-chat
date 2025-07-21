import styled from "styled-components";
import React, { useEffect, useRef } from "react";
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

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 6%;
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

  console.log("BookingAir", booking);

  const correctIcon = (TransportMode) => {
    switch (TransportMode) {
      case "Flight":
        return (
          <MdOutlineFlightTakeoff
            className="text-2xl text-[#1F1F1F]"
            size={16}
            color={"#1F1F1F"}
          />
        );
      case "Taxi":
      case "Car":
        return <IoCar className="text-2xl" size={16} color={"#1F1F1F"} />;
      case "Train":
        return <IoMdTrain className="text-2xl" size={16} color={"#1F1F1F"} />;
      case "Ferry":
        return <IoMdBoat className="text-2xl" size={16} color={"#1F1F1F"} />;
      case "Bus":
        return (
          <FaBus
            className="text-2xl text-[#1F1F1F]"
            size={16}
            color={"#1F1F1F"}
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
        }, 2000);
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
    }, 2000);
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
    handleIntracityBookings(upPresent && downPresent, {
      ...bookingItem,
      selectedType: type,
    });
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

  // Check if booking mode supports transfers
  const supportsTransfers = (mode) => {
    return ["flight", "train", "ferry"].includes(mode?.toLowerCase());
  };

  const getTransferLocationText = (mode, type) => {
    const isPickup = type === "pickup";
    const cityName = isPickup ? destinationCityName : originCityName;

    if (mode?.toLowerCase() === "flight") {
      return `+ Add Airport ${isPickup ? "Pickup" : "Drop"} in ${cityName}`;
    } else if (["train", "ferry"].includes(mode?.toLowerCase())) {
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
        <div className="flex items-center gap-1">
          <span>+ Add Pickup and Drop</span>
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
          <span>Pickup & Drop Added</span>
        </div>
      );
    } else if (hasCurrentPickup) {
      const pickupIcons = [
        ...new Set(currentPickupBookings.map((book) => book?.booking_type)),
      ].map((type) => correctIcon(type));
      return (
        <div className="flex items-center gap-1">
          {pickupIcons}
          <span>Pickup Added</span>
        </div>
      );
    } else if (hasCurrentDrop) {
      const dropIcons = [
        ...new Set(currentDropBookings.map((book) => book?.booking_type)),
      ].map((type) => correctIcon(type));
      return (
        <div className="flex items-center gap-1">
          {dropIcons}
          <span>Drop Added</span>
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
    };

    if (showDetails || showClickTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDetails, showClickTooltip]);

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
        handleIntracityBookings(upPresent && downPresent, {
          ...pickupBookings[0],
          selectedType: "Airport Pickup",
        });
      } else {
        setShowDetails(!showDetails);
        setShowTooltip(false);
        setShowClickTooltip(false);
      }
    } else if (!hasPickup && hasDrop) {
      if (dropBookings.length === 1) {
        handleIntracityBookings(upPresent && downPresent, {
          ...dropBookings[0],
          selectedType: "Airport Drop",
        });
      } else {
        setShowDetails(!showDetails);
        setShowTooltip(false);
        setShowClickTooltip(false);
      }
    } else if (booking && booking.length > 0) {
      if (booking.length === 1) {
        handleIntracityBookings(upPresent && downPresent, {
          ...booking[0],
          selectedType: "Airport Transfer",
        });
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
    handleIntracityBookings(upPresent && downPresent, {
      ...bookingItem,
      selectedType: type,
    });
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
          <div className="flex items-center gap-2">
            <span
              className="font-semibold text-yellow-300 cursor-pointer hover:text-yellow-100 underline transition-colors"
              onClick={(e) => handleTooltipAddClick(e, "drop")}
            >
              {getTransferLocationText(bookingMode, "drop")}
            </span>
          </div>
          {/* Then Pickup */}
          <div className="flex items-center gap-2">
            <span
              className="font-semibold text-yellow-300 cursor-pointer hover:text-yellow-100 underline transition-colors"
              onClick={(e) => handleTooltipAddClick(e, "pickup")}
            >
              {getTransferLocationText(bookingMode, "pickup")}
            </span>
          </div>
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
      if (!hasDrop) {
        allBookingsWithTypes.push({
          displayType: "Add Drop",
          isAdd: true,
          addType: "drop",
        });
      }
      if (!hasPickup) {
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
          className={`text-blue font-[500] text-[14px] ${
            displayText ? "hover:underline cursor-pointer" : ""
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
                style={{ zIndex: 10000 }}
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
            style={{ zIndex: 10000 }}
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
              style={{ zIndex: 10000 }}
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
            className="text-blue font-[500] text-[14px] hover:underline cursor-pointer"
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
                  style={{ zIndex: 10000 }}
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
              style={{ zIndex: 10000 }}
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
  bookingIdToDelete,
  destination_city_id,
  origin_city_id,
  destination_city_name,
  origin_city_name,
  loadbookings,
  setShowLoginModal,
  origin,
  destination,
  oCityData,
  dCityData,
  _updateFlightBookingHandler,
  _updatePaymentHandler,
  getPaymentHandler,
  _updateTaxiBookingHandler,
  airportBookings,
  intracityBookings,
  booking,
  hotelName,
  destinationHotelName,
  sourceGmaps,
  destinationGmaps,
  sourceLat,
  sourceLong,
  destinationLat,
  destinationLong,
}) => {
  const { transfers_status } = useSelector((state) => state.ItineraryStatus);

  const [isTransferDrawerOpen, setIsTransferDrawerOpen] = useState(false);
  const [transferDrawerType, setTransferDrawerType] = useState(null); // 'pickup' or 'drop'
  const [selectedTransferBooking, setSelectedTransferBooking] = useState(null);

  const handlePickupClick = () => {
    setTransferDrawerType("pickup");
    setSelectedTransferBooking(null);
    setIsTransferDrawerOpen(true);
  };

  const handleDropClick = () => {
    setTransferDrawerType("drop");
    setSelectedTransferBooking(null);
    setIsTransferDrawerOpen(true);
  };

  console.log("Booking data:", airportBookings, upPresent, downPresent);

  const correctIcon = (TransportMode) => {
    switch (TransportMode?.toLowerCase()) {
      case "flight":
        return (
          <MdOutlineFlightTakeoff
            className="text-2xl text-[#1F1F1F]"
            size={16}
            color={"#1F1F1F"}
          />
        );
      case "taxi":
      case "car":
        return <IoCar className="text-2xl" size={16} color={"#1F1F1F"} />;
      case "train":
        return <IoMdTrain className="text-2xl" size={16} color={"#1F1F1F"} />;
      case "ferry":
        return <IoMdBoat className="text-2xl" size={16} color={"#1F1F1F"} />;
      case "bus":
        return (
          <FaBus
            className="text-2xl text-[#1F1F1F]"
            size={16}
            color={"#1F1F1F"}
          />
        );
      default:
        return null;
    }
  };

  const [handleShow, setHandleShow] = useState(false);
  const [data, setData] = useState({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [comboDetails, setComboDetails] = useState(false);
  const [transferType, setTransferType] = useState(null);
  const [isIntracity, setIsIntracity] = useState(false);
  const [error, setError] = useState(false);
  const [currentAirportBookings, setCurrentAirportBookings] = useState(
    airportBookings || []
  );
  const [pickupDropShow, setPickupDropShow] = useState(false);

  console.log("Selected Booking", selectedBooking);
  const router = useRouter();
  const dispatch = useDispatch();
  let isPageWide = window.matchMedia("(min-width: 768px)")?.matches;

  useEffect(() => {
    setCurrentAirportBookings(airportBookings || []);
  }, [airportBookings]);

  useEffect(() => {
    if (!booking_id) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [booking_id]);

  const handleEdit = async (combo) => {
    setIsIntracity(false);
    if (combo) {
      setComboDetails(true);
    }
    setLoading(true);
    console.log("inside show");
    try {
      setHandleShow(true);
      const res = await axios.get(
        `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/${
          combo ? `combo` : booking_type.toLowerCase()
        }/${booking_id}/`
      );
      setData(res?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      const errorMsg =
        error?.response?.data?.errors?.[0]?.message?.[0] || error.message;
      dispatch(
        openNotification({
          text: errorMsg,
          heading: "Error!",
          type: "error",
        })
      );
    }
  };

  const handleIntracityBookings = async (combo, booking) => {
    setIsIntracity(true);
    setTransferType(booking?.booking_type);
    if (combo) {
      setComboDetails(true);
    }
    setLoading(true);
    console.log("inside show");
    try {
      setHandleShow(true);
      const res = await axios.get(
        `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/${
          combo ? `combo` : booking?.booking_type.toLowerCase()
        }/${booking?.id}/`
      );
      setData(res?.data);
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
        dispatch(updateTransferBookings(dataPassed?.id));
        setLoading(false);
        getPaymentHandler();

        if (isIntracity) {
          setCurrentAirportBookings((prev) =>
            prev.filter((booking) => booking.id !== dataPassed?.id)
          );
        } else {
          setVisible(true);
        }

        setHandleShow(false);
        dispatch(
          openNotification({
            type: "success",
            text: `${city} deleted successfully`,
            heading: "Success!",
          })
        );
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

  const formattedDate = (dateObj) =>
    dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const formattedTime = (dateObj) =>
    dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const handleTransferSubmit = async (transferData) => {
    if (!localStorage?.getItem("access_token")) {
      setShowLoginModal(true);
      return;
    }
    try {
      // setLoading(true);
      console.log("TransferDD", transferData);

      const bookingPayload = {
        
        transfer_type: "airport",
        source_itinerary_city:
          transferData.transferType === "pickup"
            ? dCityData?.id || dCityData?.gmaps_place_id
            : oCityData?.id || oCityData?.gmaps_place_id,
        destination_itinerary_city:
          transferData.transferType === "pickup"
            ? dCityData?.id || dCityData?.gmaps_place_id
            : oCityData?.id || oCityData?.gmaps_place_id,
        is_pickup: transferData.transferType === "pickup",
        is_drop: transferData.transferType === "drop",
        source: transferData?.source,
        trace_id: transferData?.traceId,
        result_index: transferData?.selectedQuote?.result_index,
        booking_id: transferData?.booking_id,
      };

      console.log("Payload",bookingPayload);
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
            `${
              transferData.transferType === "pickup"
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
            text: `${
              transferData.transferType === "pickup" ? "Pickup" : "Drop"
            } transfer added successfully`,
            heading: "Success!",
          })
        );
      }
      setIsTransferDrawerOpen(false);
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
    console.log("MOOde", mode, index);
    return ["flight", "train", "ferry"].includes(mode?.toLowerCase());
  };

  const existingPickupBookings =
    currentAirportBookings?.filter((booking) => booking.is_airport_pickup) ||
    [];

  const existingDropBookings =
    currentAirportBookings?.filter((booking) => booking.is_airport_drop) || [];

  console.log("Redux DBD", booking_id, city, visible);

  return (
    <Container>
      <PinWrapper>
        {upPresent && <VerticalLine height="50px" gradient="top" />}
        {upPresent && downPresent ? (
          <Pin length={length} />
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              opacity="0.5"
              cx="12.0551"
              cy="12.0558"
              r="6.57534"
              fill="#F7E700"
            />
            <path
              d="M10.9041 24V21.8082C8.621 21.5525 6.6621 20.6073 5.0274 18.9726C3.39269 17.3379 2.44749 15.379 2.19178 13.0959H0V10.9041H2.19178C2.44749 8.621 3.39269 6.6621 5.0274 5.0274C6.6621 3.39269 8.621 2.44749 10.9041 2.19178V0H13.0959V2.19178C15.379 2.44749 17.3379 3.39269 18.9726 5.0274C20.6073 6.6621 21.5525 8.621 21.8082 10.9041H24V13.0959H21.8082C21.5525 15.379 20.6073 17.3379 18.9726 18.9726C17.3379 20.6073 15.379 21.5525 13.0959 21.8082V24H10.9041ZM12 19.6712C14.1187 19.6712 15.9269 18.9224 17.4247 17.4247C18.9224 15.9269 19.6712 14.1187 19.6712 12C19.6712 9.88128 18.9224 8.07306 17.4247 6.57534C15.9269 5.07763 14.1187 4.32877 12 4.32877C9.88128 4.32877 8.07306 5.07763 6.57534 6.57534C5.07763 8.07306 4.32877 9.88128 4.32877 12C4.32877 14.1187 5.07763 15.9269 6.57534 17.4247C8.07306 18.9224 9.88128 19.6712 12 19.6712ZM12 16.3836C10.7945 16.3836 9.76256 15.9543 8.90411 15.0959C8.04566 14.2374 7.61644 13.2055 7.61644 12C7.61644 10.7945 8.04566 9.76256 8.90411 8.90411C9.76256 8.04566 10.7945 7.61644 12 7.61644C13.2055 7.61644 14.2374 8.04566 15.0959 8.90411C15.9543 9.76256 16.3836 10.7945 16.3836 12C16.3836 13.2055 15.9543 14.2374 15.0959 15.0959C14.2374 15.9543 13.2055 16.3836 12 16.3836ZM12 14.1918C12.6027 14.1918 13.1187 13.9772 13.5479 13.5479C13.9772 13.1187 14.1918 12.6027 14.1918 12C14.1918 11.3973 13.9772 10.8813 13.5479 10.4521C13.1187 10.0228 12.6027 9.80822 12 9.80822C11.3973 9.80822 10.8813 10.0228 10.4521 10.4521C10.0228 10.8813 9.80822 11.3973 9.80822 12C9.80822 12.6027 10.0228 13.1187 10.4521 13.5479C10.8813 13.9772 11.3973 14.1918 12 14.1918Z"
              fill="#1F1F1F"
            />
          </svg>
        )}
        {downPresent && <VerticalLine height="50px" gradient="bottom" />}
      </PinWrapper>

      <div
        className={`flex flex-col gap-2 ${
          !downPresent && upPresent && "mt-[41px]"
        } ${!upPresent && downPresent && "mb-[41px]"}`}
      >
        {/* City and Duration Section - Aligned with Pin */}
        <div
          className={`flex flex-col gap-3 ${
            !(upPresent && downPresent) ? "itmes-center justify-center" : ""
          }`}
        >
          {!(upPresent && downPresent) && <div className="">{city}</div>}

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
                className={`text-[16px] font-[500] flex gap-1 ${
                  (currentAirportBookings &&
                    currentAirportBookings.length > 0) ||
                  ["flight", "train", "ferry"].includes(
                    booking_type?.toLowerCase()
                  )
                    ? "mt-5"
                    : (booking_id || city) && !visible ?"mt-5" : "mt-0"
                }`}
              >
                {(booking_id || city) && !visible ? (
                  <>
                    {/* Icon Section */}
                    <div className="mt-[4px] flex items-start">
                      {booking?.children
                        ? booking?.children?.map((book, i) => {
                            const mode = extractMode(book?.booking_type);
                            return (
                              <React.Fragment key={i}>
                                {correctIcon(mode)}
                                {i < booking?.children?.length - 1 && (
                                  <span>
                                    <RiArrowDropRightLine size={18} />
                                  </span>
                                )}
                              </React.Fragment>
                            );
                          })
                        : correctIcon(booking_type)}
                    </div>

                    {/* City and Duration Section */}
                    <div className="flex flex-col">
                      <div
                        className={`flex items-center gap-2 ${
                          upPresent && downPresent
                            ? "group hover:cursor-pointer"
                            : ""
                        }`}
                        onClick={() => {
                          upPresent &&
                            downPresent &&
                            handleEdit(transfer_type === "combo");
                        }}
                      >
                        <div className="group-hover:text-blue">
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

                      {/* Duration */}
                      {duration && (
                        <div className="font-[400] text-[12px]">
                          Duration: {duration}
                        </div>
                      )}
                    </div>
                  </>
                ) : isPageWide ? (
                  <button
                    onClick={() => setShowDrawer(true)}
                    className="text-[14px] font-[600] leading-[60px] text-blue hover:underline"
                  >
                    + Add Transfer from {origin_city_name} to{" "}
                    {destination_city_name}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowDrawer(true)}
                    className="text-[14px] font-[600] leading-[60px] text-blue hover:underline"
                  >
                    + Add Transfer
                  </button>
                )}
              </div>
            )
          )}
          {/* {currentAirportBookings && currentAirportBookings.length > 0 && ( */}
          <div
            className={`flex flex-col gap-1 mb-3 ${
              !(upPresent && downPresent) ||
              (!booking_id &&
                !(currentAirportBookings && currentAirportBookings.length > 0))
                ? "hidden"
                : ""
            }`}
          >
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
            />
          </div>
          {/* )} */}

          {/* {supportsTransfers(booking_type,duration) && ( 
                  <div className={`-mt-2 ${currentAirportBookings && currentAirportBookings.length > 0 ?"mb-2":"mb-0 mt-0"  }`}>
                    <TransferPickupDropButton
                      bookingMode={booking_type}
                      originCityName={origin_city_name}
                      destinationCityName={destination_city_name}
                      existingPickupBookings={existingPickupBookings}
                      existingDropBookings={existingDropBookings}
                      onPickupClick={handlePickupClick}
                      onDropClick={handleDropClick}
                      setHandleShow={setPickupDropShow}
                      show={pickupDropShow}
                    />
                  </div>
                 )}  */}
        </div>
      </div>

      <PickupDropDrawer
        isOpen={isTransferDrawerOpen}
        hotelName={hotelName}
        destinationHotelName={destinationHotelName}
        sourceLat={sourceLat}
  sourceLong={sourceLong}
  destinationLat={destinationLat}
  destinationLong={destinationLong}
        booking={booking}
        onClose={() => {
          setIsTransferDrawerOpen(false);
          setTransferDrawerType(null);
          setSelectedTransferBooking(null);
        }}
        transferType={transferDrawerType}
        bookingMode={booking_type?.toLowerCase()}
        originCityName={origin_city_name}
        destinationCityName={destination_city_name}
        onSubmit={handleTransferSubmit}
        existingBooking={selectedTransferBooking}
        sourceGmaps={sourceGmaps}
        destinationGmaps={destinationGmaps}
        // show={pickupDropShow}
        // setHandleShow={setPickupDropShow}
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
        origin_itinerary_city_id={oCityData?.id || oCityData?.gmaps_place_id}
        destination_itinerary_city_id={
          dCityData?.id || dCityData?.gmaps_place_id
        }
      />

      <TransferEditDrawer
        mercury
        addOrEdit={"transferAdd"}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
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
        origin_itinerary_city_id={oCityData?.id || oCityData?.gmaps_place_id}
        destination_itinerary_city_id={
          dCityData?.id || dCityData?.gmaps_place_id
        }
        booking_id={booking_id}
      />

      {handleShow && (
        <TransferDrawer
          show={handleShow}
          error={error}
          setHandleShow={setHandleShow}
          data={data}
          booking_type={transferType || booking_type}
          loading={loading}
          handleDelete={handleDelete}
          setShowDrawer={setShowDrawer}
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
          origin_itinerary_city_id={oCityData?.id || oCityData?.gmaps_place_id}
          destination_itinerary_city_id={
            dCityData?.id || dCityData?.gmaps_place_id
          }
          isIntracity={isIntracity}
          booking_id={booking_id}
        />
      )}
    </Container>
  );
};

export default CityItem;

// import styled from "styled-components";
// import React, { useEffect, useRef } from "react";
// import Pin from "../newitinerary/breif/route/Pin";
// import { IoCar } from "react-icons/io5";
// import { MdOutlineFlightTakeoff } from "react-icons/md";
// import { IoMdTrain, IoMdBoat, IoIosArrowForward } from "react-icons/io";
// import { FaBus, FaPen } from "react-icons/fa";
// import axios from "axios";
// import { MERCURY_HOST } from "../../services/constants";
// import { useState } from "react";
// import { useRouter } from "next/router";
// import { axiosDeleteBooking } from "../../services/itinerary/bookings";
// import { updateTransferBookings } from "../../store/actions/transferBookingsStore";
// import { useDispatch, useSelector } from "react-redux";
// import TransferEditDrawer from "../../components/drawers/routeTransfer/TransferEditDrawer";
// import TransferSkeleton from "../../components/itinerary/Skeleton/TransferSkeleton";
// import { openNotification } from "../../store/actions/notification";
// import { RiArrowDropRightLine } from "react-icons/ri";
// import TransferDrawer from "./TransferDrawer";
// import { LuInfo } from "react-icons/lu";

// const Container = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   margin-left: 6%;
// `;

// const VerticalLine = styled.div`
//   width: 2px;
//   height: ${(props) => props.height || "40px"};
//   background: ${(props) =>
//     props.gradient === "top"
//       ? "linear-gradient(to bottom, #DDDDDD, transparent)"
//       : "linear-gradient(to top, #DDDDDD, transparent)"};
//   background-size: 10px 10px;
// `;

// const PinWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `;

// const AirportBookingItem = ({
//   booking,
//   handleIntracityBookings,
//   upPresent,
//   downPresent,
//   onBookingDelete,
// }) => {
//   const [showTooltip, setShowTooltip] = useState(false);
//   const [showDetails, setShowDetails] = useState(false);
//   const dropdownRef = useRef(null);
//   let isPageWide = window.matchMedia("(min-width: 768px)")?.matches;
//   const tooltipTimeoutRef = useRef(null);

//   const pickupBookings = booking.filter((book) => book?.is_airport_pickup);
//   const dropBookings = booking.filter((book) => book?.is_airport_drop);
//   const noPickupDropBookings = booking.filter(
//     (book) => !book?.is_airport_drop && !book?.is_airport_pickup
//   );

//   const correctIcon = (TransportMode) => {
//     switch (TransportMode) {
//       case "Flight":
//         return (
//           <MdOutlineFlightTakeoff
//             className="text-2xl text-[#1F1F1F]"
//             size={16}
//             color={"#1F1F1F"}
//           />
//         );
//       case "Taxi":
//       case "Car":
//         return <IoCar className="text-2xl" size={16} color={"#1F1F1F"} />;
//       case "Train":
//         return <IoMdTrain className="text-2xl" size={16} color={"#1F1F1F"} />;
//       case "Ferry":
//         return <IoMdBoat className="text-2xl" size={16} color={"#1F1F1F"} />;
//       case "Bus":
//         return (
//           <FaBus
//             className="text-2xl text-[#1F1F1F]"
//             size={16}
//             color={"#1F1F1F"}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   const handleInfoHover = (show) => {
//     if (!showDetails) {
//       if (show) {
//         if (tooltipTimeoutRef.current) {
//           clearTimeout(tooltipTimeoutRef.current);
//           tooltipTimeoutRef.current = null;
//         }
//         setShowTooltip(true);
//       } else {
//         tooltipTimeoutRef.current = setTimeout(() => {
//           setShowTooltip(false);
//           tooltipTimeoutRef.current = null;
//         }, 2000);
//       }
//     }
//   };

//   const handleTooltipMouseEnter = () => {
//     if (tooltipTimeoutRef.current) {
//       clearTimeout(tooltipTimeoutRef.current);
//       tooltipTimeoutRef.current = null;
//     }
//     setShowTooltip(true);
//   };

//   const handleTooltipMouseLeave = () => {
//     tooltipTimeoutRef.current = setTimeout(() => {
//       setShowTooltip(false);
//       tooltipTimeoutRef.current = null;
//     }, 2000);
//   };

//   const handleTooltipBookingClick = (e, bookingItem, type) => {
//     e.stopPropagation();

//     if (tooltipTimeoutRef.current) {
//       clearTimeout(tooltipTimeoutRef.current);
//       tooltipTimeoutRef.current = null;
//     }
//     setShowTooltip(false);
//     setShowDetails(false);
//     handleIntracityBookings(upPresent && downPresent, {
//       ...bookingItem,
//       selectedType: type,
//     });
//   };

//   useEffect(() => {
//     return () => {
//       if (tooltipTimeoutRef.current) {
//         clearTimeout(tooltipTimeoutRef.current);
//       }
//     };
//   }, []);

//   const hasPickup = pickupBookings.length > 0;
//   const hasDrop = dropBookings.length > 0;

//   const getDisplayText = () => {
//     const currentPickupBookings = booking.filter(
//       (book) => book?.is_airport_pickup
//     );
//     const currentDropBookings = booking.filter((book) => book?.is_airport_drop);
//     const currentNoPickupDropBookings = booking.filter(
//       (book) => !book?.is_airport_drop && !book?.is_airport_pickup
//     );

//     const hasCurrentPickup = currentPickupBookings.length > 0;
//     const hasCurrentDrop = currentDropBookings.length > 0;

//     if (hasCurrentPickup && hasCurrentDrop) {
//       const allTypes = [
//         ...new Set([
//           ...currentPickupBookings.map((book) => book?.booking_type),
//           ...currentDropBookings.map((book) => book?.booking_type),
//         ]),
//       ];
//       const uniqueIcons = allTypes.map((type) => correctIcon(type));

//       return (
//         <div className="flex items-center gap-1">
//           {uniqueIcons}
//           <span>Pickup & Drop Added</span>
//         </div>
//       );
//     } else if (hasCurrentPickup) {
//       const pickupIcons = [
//         ...new Set(currentPickupBookings.map((book) => book?.booking_type)),
//       ].map((type) => correctIcon(type));
//       return (
//         <div className="flex items-center gap-1">
//           {pickupIcons}
//           <span>Pickup Added</span>
//         </div>
//       );
//     } else if (hasCurrentDrop) {
//       const dropIcons = [
//         ...new Set(currentDropBookings.map((book) => book?.booking_type)),
//       ].map((type) => correctIcon(type));
//       return (
//         <div className="flex items-center gap-1">
//           {dropIcons}
//           <span>Drop Added</span>
//         </div>
//       );
//     } else if (currentNoPickupDropBookings.length > 0) {
//       return (
//         <div className="flex items-center gap-2">
//           {currentNoPickupDropBookings.map((book, index) => (
//             <div key={index} className="flex items-center gap-1">
//               {correctIcon(book?.booking_type)}
//               <span>{book?.name}</span>
//             </div>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   const displayText = getDisplayText();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDetails(false);
//       }
//     };

//     if (showDetails) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showDetails]);

//   const handleClick = () => {
//     if (hasPickup && hasDrop) {
//       setShowDetails(!showDetails);
//       setShowTooltip(false);
//     } else if (hasPickup && !hasDrop) {
//       if (pickupBookings.length === 1) {
//         handleIntracityBookings(upPresent && downPresent, {
//           ...pickupBookings[0],
//           selectedType: "Airport Pickup",
//         });
//       } else {
//         setShowDetails(!showDetails);
//         setShowTooltip(false);
//       }
//     } else if (!hasPickup && hasDrop) {
//       if (dropBookings.length === 1) {
//         handleIntracityBookings(upPresent && downPresent, {
//           ...dropBookings[0],
//           selectedType: "Airport Drop",
//         });
//       } else {
//         setShowDetails(!showDetails);
//         setShowTooltip(false);
//       }
//     } else if (booking && booking.length > 0) {
//       if (booking.length === 1) {
//         handleIntracityBookings(upPresent && downPresent, {
//           ...booking[0],
//           selectedType: "Airport Transfer",
//         });
//       } else {
//         setShowDetails(!showDetails);
//         setShowTooltip(false);
//       }
//     }
//   };

//   const handleBookingClick = (e, bookingItem, type) => {
//     e.stopPropagation();
//     setShowTooltip(false);
//     setShowDetails(false);
//     handleIntracityBookings(upPresent && downPresent, {
//       ...bookingItem,
//       selectedType: type,
//     });
//   };

//   // const handleInfoHover = (show) => {
//   //   if (!showDetails) {
//   //     setShowTooltip(show);
//   //   }
//   // };

//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       });
//     } catch (e) {
//       return dateString?.split(" ")[0] || "N/A";
//     }
//   };

//   const formatTime = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleTimeString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       });
//     } catch (e) {
//       return dateString?.split(" ")[1]?.substring(0, 5) || "N/A";
//     }
//   };

//   const renderTooltipContent = () => {
//     const getBookingDate = (booking, isPickup = false) => {
//       const dateStr = isPickup
//         ? booking.check_in
//         : booking.check_out || booking.check_in;
//       return new Date(dateStr);
//     };

//     const allBookingsWithTypes = [
//       ...pickupBookings.map((booking) => ({
//         ...booking,
//         displayType: "Airport Pickup",
//         sortDate: getBookingDate(booking, true),
//       })),
//       ...dropBookings.map((booking) => ({
//         ...booking,
//         displayType: "Airport Drop",
//         sortDate: getBookingDate(booking, false),
//       })),
//       ...noPickupDropBookings.map((booking) => ({
//         ...booking,
//         displayType: "Airport Transfer",
//         sortDate: getBookingDate(booking, false),
//       })),
//     ].sort((a, b) => a.sortDate - b.sortDate);

//     return (
//       <div className="flex flex-col gap-1">
//         {allBookingsWithTypes.map((booking, index) => (
//           <div key={`booking-${index}`} className="flex items-center gap-2">
//             <span
//               className="font-semibold text-yellow-300 cursor-pointer hover:text-yellow-100 underline transition-colors"
//               onClick={(e) =>
//                 handleTooltipBookingClick(e, booking, booking.displayType)
//               }
//             >
//               {booking?.name}:
//             </span>
//             <span className="text-gray-200">
//               • Date{" "}
//               {formatDate(
//                 booking.displayType === "Airport Pickup"
//                   ? booking.check_in
//                   : booking.check_out || booking.check_in
//               )}{" "}
//               • Time{" "}
//               {formatTime(
//                 booking.displayType === "Airport Pickup"
//                   ? booking.check_in
//                   : booking.check_out || booking.check_in
//               )}
//             </span>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const renderDropdownContent = () => {
//     const getBookingDate = (booking, isPickup = false) => {
//       const dateStr = isPickup
//         ? booking.check_in
//         : booking.check_out || booking.check_in;
//       return new Date(dateStr);
//     };

//     const allBookingsWithTypes = [
//       ...pickupBookings.map((booking) => ({
//         ...booking,
//         displayType: "Airport Pickup",
//         sortDate: getBookingDate(booking, true),
//       })),
//       ...dropBookings.map((booking) => ({
//         ...booking,
//         displayType: "Airport Drop",
//         sortDate: getBookingDate(booking, false),
//       })),
//       ...noPickupDropBookings.map((booking) => ({
//         ...booking,
//         displayType: "Airport Transfer",
//         sortDate: getBookingDate(booking, false),
//       })),
//     ].sort((a, b) => a.sortDate - b.sortDate);

//     return (
//       <div className="flex flex-col gap-2">
//         {allBookingsWithTypes.map((booking, index) => (
//           <div
//             key={`dropdown-booking-${index}`}
//             className="flex items-start gap-2 flex-wrap"
//           >
//             <span
//               className="font-semibold text-yellow-300 cursor-pointer hover:text-yellow-100 underline transition-colors whitespace-nowrap"
//               onClick={(e) =>
//                 handleBookingClick(e, booking, booking.displayType)
//               }
//             >
//               {booking?.name}:
//             </span>
//             {isPageWide && (
//               <span className="text-gray-200 flex-1">
//                 • Date{" "}
//                 {formatDate(
//                   booking.displayType === "Airport Pickup"
//                     ? booking.check_in
//                     : booking.check_out || booking.check_in
//                 )}{" "}
//                 • Time{" "}
//                 {formatTime(
//                   booking.displayType === "Airport Pickup"
//                     ? booking.check_in
//                     : booking.check_out || booking.check_in
//                 )}
//               </span>
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return displayText ? (
//     <div key={-3} className="group relative" ref={dropdownRef}>
//       <div className="flex items-center gap-2">
//         <span
//           className={`text-blue font-[500] text-[14px] ${
//             displayText ? "hover:underline cursor-pointer" : ""
//           }`}
//           onClick={handleClick}
//         >
//           {displayText}
//         </span>

//         {isPageWide && (
//           <div className="relative">
//             <div
//               className="w-4 h-4 rounded-full bg-white text-gray-400 flex items-center justify-center text-[14px] font-bold hover:bg-blue-700 transition-colors cursor-pointer"
//               onMouseEnter={() => handleInfoHover(true)}
//               onMouseLeave={() => handleInfoHover(false)}
//             >
//               <LuInfo size={16} strokeWidth={2.5} />
//             </div>

//             {showTooltip && !showDetails && (
//               <div
//                 className="absolute left-0 md:left-6 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs rounded-md px-3 py-2 shadow-xl border border-gray-600 whitespace-nowrap"
//                 style={{ zIndex: 10000 }}
//                 onMouseEnter={handleTooltipMouseEnter}
//                 onMouseLeave={handleTooltipMouseLeave}
//               >
//                 {renderTooltipContent()}
//                 <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {showDetails &&
//         ((hasPickup && hasDrop) ||
//           pickupBookings.length > 1 ||
//           dropBookings.length > 1) && (
//           <div className="relative mt-2">
//             <div
//               className="absolute bg-gray-900 text-white text-xs rounded-md px-2 py-2 shadow-xl border border-gray-600 min-w-fit md:min-w-[320px] max-w-[450px] md:w-[800px]"
//               style={{ zIndex: 10000 }}
//             >
//               {renderDropdownContent()}
//               <div className="absolute left-4 top-0 transform -translate-y-1 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
//             </div>
//           </div>
//         )}
//     </div>
//   ) : null;
// };

// const CityItem = ({
//   city,
//   selectedBooking,
//   setSelectedBooking,
//   duration,
//   booking_type,
//   transfer_type,
//   upPresent,
//   downPresent,
//   booking_id,
//   length,
//   bookingIdToDelete,
//   destination_city_id,
//   origin_city_id,
//   destination_city_name,
//   origin_city_name,
//   loadbookings,
//   setShowLoginModal,
//   origin,
//   destination,
//   oCityData,
//   dCityData,
//   _updateFlightBookingHandler,
//   _updatePaymentHandler,
//   getPaymentHandler,
//   _updateTaxiBookingHandler,
//   airportBookings,
//   intracityBookings,
//   booking,
// }) => {
//   const { transfers_status } = useSelector((state) => state.ItineraryStatus);

//   console.log("Booking data:", airportBookings);

//   const correctIcon = (TransportMode) => {
//     switch (TransportMode?.toLowerCase()) {
//       case "flight":
//         return (
//           <MdOutlineFlightTakeoff
//             className="text-2xl text-[#1F1F1F]"
//             size={16}
//             color={"#1F1F1F"}
//           />
//         );
//       case "taxi":
//       case "car":
//         return <IoCar className="text-2xl" size={16} color={"#1F1F1F"} />;
//       case "train":
//         return <IoMdTrain className="text-2xl" size={16} color={"#1F1F1F"} />;
//       case "ferry":
//         return <IoMdBoat className="text-2xl" size={16} color={"#1F1F1F"} />;
//       case "bus":
//         return (
//           <FaBus
//             className="text-2xl text-[#1F1F1F]"
//             size={16}
//             color={"#1F1F1F"}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   const [handleShow, setHandleShow] = useState(false);
//   const [data, setData] = useState({});
//   const [visible, setVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showDrawer, setShowDrawer] = useState(false);
//   const [comboDetails, setComboDetails] = useState(false);
//   const [transferType, setTransferType] = useState(null);
//   const [isIntracity, setIsIntracity] = useState(false);
//   const [error, setError] = useState(false);
//   const [currentAirportBookings, setCurrentAirportBookings] = useState(
//     airportBookings || []
//   );

//   console.log("Selected Booking", selectedBooking);
//   const router = useRouter();
//   const dispatch = useDispatch();
//   let isPageWide = window.matchMedia("(min-width: 768px)")?.matches;

//   useEffect(() => {
//     setCurrentAirportBookings(airportBookings || []);
//   }, [airportBookings]);

//   useEffect(() => {
//     if (!booking_id) {
//       setVisible(true);
//     } else {
//       setVisible(false);
//     }
//   }, [booking_id]);

//   const handleEdit = async (combo) => {
//     setIsIntracity(false);
//     if (combo) {
//       setComboDetails(true);
//     }
//     setLoading(true);
//     console.log("inside show");
//     try {
//       setHandleShow(true);
//       const res = await axios.get(
//         `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/${
//           combo ? `combo` : booking_type.toLowerCase()
//         }/${booking_id}/`
//       );
//       setData(res?.data);
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       setError(true);
//       const errorMsg =
//         error?.response?.data?.errors?.[0]?.message?.[0] || error.message;
//       dispatch(
//         openNotification({
//           text: errorMsg,
//           heading: "Error!",
//           type: "error",
//         })
//       );
//     }
//   };

//   const handleIntracityBookings = async (combo, booking) => {
//     setIsIntracity(true);
//     setTransferType(booking?.booking_type);
//     if (combo) {
//       setComboDetails(true);
//     }
//     setLoading(true);
//     console.log("inside show");
//     try {
//       setHandleShow(true);
//       const res = await axios.get(
//         `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/${
//           combo ? `combo` : booking?.booking_type.toLowerCase()
//         }/${booking?.id}/`
//       );
//       setData(res?.data);
//       setLoading(false);
//     } catch (error) {
//       setError(true);
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (val) => {
//     if (!localStorage?.getItem("access_token")) {
//       setShowLoginModal(true);
//       return;
//     }
//     const dataPassed = val != null ? val : data;
//     try {
//       setLoading(true);
//       const response = await axiosDeleteBooking.delete(
//         `${router?.query?.id}/bookings/${
//           dataPassed?.booking_type?.includes(",")
//             ? `combo`
//             : dataPassed?.booking_type?.toLowerCase()
//         }/${dataPassed?.id}/`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           },
//         }
//       );

//       if (response.status === 204) {
//         dispatch(updateTransferBookings(dataPassed?.id));
//         setLoading(false);
//         getPaymentHandler();

//         if (isIntracity) {
//           setCurrentAirportBookings((prev) =>
//             prev.filter((booking) => booking.id !== dataPassed?.id)
//           );
//         } else {
//           setVisible(true);
//         }

//         setHandleShow(false);
//         dispatch(
//           openNotification({
//             type: "success",
//             text: `${city} deleted successfully`,
//             heading: "Success!",
//           })
//         );
//       }
//     } catch (err) {
//       const errorMsg =
//         err?.response?.data?.errors?.[0]?.message?.[0] ||
//         err.response?.data?.errors[0]?.detail ||
//         err.message;
//       dispatch(
//         openNotification({
//           type: "error",
//           text: errorMsg,
//           heading: "Error!",
//         })
//       );
//       setLoading(false);
//     }
//   };

//   const extractMode = (text) => {
//     const lowerText = text.toLowerCase();

//     if (lowerText.includes("flight")) {
//       return "Flight";
//     } else if (lowerText.includes("train")) {
//       return "Train";
//     } else if (lowerText.includes("bus")) {
//       return "Bus";
//     } else if (lowerText.includes("taxi") || lowerText.includes("car")) {
//       return "Car";
//     } else if (lowerText.includes("ferry")) {
//       return "Ferry";
//     } else {
//       return "";
//     }
//   };

//   const formattedDate = (dateObj) =>
//     dateObj.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//     });

//   const formattedTime = (dateObj) =>
//     dateObj.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });

//   console.log("Redux DBD", booking_id, city, visible);

//   return (
//     <Container>
//       <PinWrapper>
//         {upPresent && <VerticalLine height="50px" gradient="top" />}
//         {upPresent && downPresent ? (
//           <Pin length={length} />
//         ) : (
//           <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <circle
//               opacity="0.5"
//               cx="12.0551"
//               cy="12.0558"
//               r="6.57534"
//               fill="#F7E700"
//             />
//             <path
//               d="M10.9041 24V21.8082C8.621 21.5525 6.6621 20.6073 5.0274 18.9726C3.39269 17.3379 2.44749 15.379 2.19178 13.0959H0V10.9041H2.19178C2.44749 8.621 3.39269 6.6621 5.0274 5.0274C6.6621 3.39269 8.621 2.44749 10.9041 2.19178V0H13.0959V2.19178C15.379 2.44749 17.3379 3.39269 18.9726 5.0274C20.6073 6.6621 21.5525 8.621 21.8082 10.9041H24V13.0959H21.8082C21.5525 15.379 20.6073 17.3379 18.9726 18.9726C17.3379 20.6073 15.379 21.5525 13.0959 21.8082V24H10.9041ZM12 19.6712C14.1187 19.6712 15.9269 18.9224 17.4247 17.4247C18.9224 15.9269 19.6712 14.1187 19.6712 12C19.6712 9.88128 18.9224 8.07306 17.4247 6.57534C15.9269 5.07763 14.1187 4.32877 12 4.32877C9.88128 4.32877 8.07306 5.07763 6.57534 6.57534C5.07763 8.07306 4.32877 9.88128 4.32877 12C4.32877 14.1187 5.07763 15.9269 6.57534 17.4247C8.07306 18.9224 9.88128 19.6712 12 19.6712ZM12 16.3836C10.7945 16.3836 9.76256 15.9543 8.90411 15.0959C8.04566 14.2374 7.61644 13.2055 7.61644 12C7.61644 10.7945 8.04566 9.76256 8.90411 8.90411C9.76256 8.04566 10.7945 7.61644 12 7.61644C13.2055 7.61644 14.2374 8.04566 15.0959 8.90411C15.9543 9.76256 16.3836 10.7945 16.3836 12C16.3836 13.2055 15.9543 14.2374 15.0959 15.0959C14.2374 15.9543 13.2055 16.3836 12 16.3836ZM12 14.1918C12.6027 14.1918 13.1187 13.9772 13.5479 13.5479C13.9772 13.1187 14.1918 12.6027 14.1918 12C14.1918 11.3973 13.9772 10.8813 13.5479 10.4521C13.1187 10.0228 12.6027 9.80822 12 9.80822C11.3973 9.80822 10.8813 10.0228 10.4521 10.4521C10.0228 10.8813 9.80822 11.3973 9.80822 12C9.80822 12.6027 10.0228 13.1187 10.4521 13.5479C10.8813 13.9772 11.3973 14.1918 12 14.1918Z"
//               fill="#1F1F1F"
//             />
//           </svg>
//         )}
//         {downPresent && <VerticalLine height="50px" gradient="bottom" />}
//       </PinWrapper>

//       <div
//         className={`flex flex-col gap-2 ${
//           !downPresent && upPresent && "mt-[41px]"
//         } ${!upPresent && downPresent && "mb-[41px]"}`}
//       >
//         {/* City and Duration Section - Aligned with Pin */}
//         <div className="flex flex-col  gap-3">
//           {!(upPresent && downPresent) && <div className="">{city}</div>}

//           {transfers_status === "PENDING" ? (
//             upPresent && downPresent ? (
//               <TransferSkeleton />
//             ) : (
//               ""
//             )
//           ) : (
//             upPresent &&
//             downPresent && (
//               <div
//                 className={`text-[16px] font-[500] flex gap-1 ${
//                   currentAirportBookings && currentAirportBookings.length > 0
//                     ? "mt-5"
//                     : null
//                 }`}
//               >
//                 {(booking_id || city) && !visible ? (
//                   <>
//                     {/* Icon Section */}
//                     <div className="mt-[4px] flex items-start">
//                       {booking?.children
//                         ? booking?.children?.map((book, i) => {
//                             const mode = extractMode(book?.booking_type);
//                             return (
//                               <React.Fragment key={i}>
//                                 {correctIcon(mode)}
//                                 {i < booking?.children?.length - 1 && (
//                                   <span>
//                                     <RiArrowDropRightLine size={18} />
//                                   </span>
//                                 )}
//                               </React.Fragment>
//                             );
//                           })
//                         : correctIcon(booking_type)}
//                     </div>

//                     {/* City and Duration Section */}
//                     <div className="flex flex-col">
//                       <div
//                         className={`flex items-center gap-2 ${
//                           upPresent && downPresent
//                             ? "group hover:cursor-pointer"
//                             : ""
//                         }`}
//                         onClick={() => {
//                           upPresent &&
//                             downPresent &&
//                             handleEdit(transfer_type === "combo");
//                         }}
//                       >
//                         <div className="group-hover:text-blue">
//                           {upPresent && downPresent ? city : ""}
//                         </div>
//                         {upPresent && downPresent && (
//                           <div className="">
//                             <FaPen
//                               size={12}
//                               className="transition-transform group-hover:scale-150 duration-300 group-hover:text-yellow-500"
//                             />
//                           </div>
//                         )}
//                       </div>

//                       {/* Duration */}
//                       {duration && (
//                         <div className="font-[400] text-[12px]">
//                           Duration: {duration}
//                         </div>
//                       )}
//                     </div>
//                   </>
//                 ) : isPageWide ? (
//                   <button
//                     onClick={() => setShowDrawer(true)}
//                     className="text-[14px] font-[600] leading-[60px] text-blue hover:underline"
//                   >
//                     + Add Transfer from {origin_city_name} to{" "}
//                     {destination_city_name}
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => setShowDrawer(true)}
//                     className="text-[14px] font-[600] leading-[60px] text-blue hover:underline"
//                   >
//                     + Add Transfer
//                   </button>
//                 )}
//               </div>
//             )
//           )}
//           {currentAirportBookings && currentAirportBookings.length > 0 && (
//             <div className="flex flex-col gap-1 mt-1 mb-[1.5rem]">
//               <AirportBookingItem
//                 key={`airport-${booking_id || "no-main"}`}
//                 booking={currentAirportBookings}
//                 handleIntracityBookings={handleIntracityBookings}
//                 upPresent={upPresent}
//                 downPresent={downPresent}
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       <TransferEditDrawer
//         mercury
//         addOrEdit={"transferAdd"}
//         showDrawer={showDrawer}
//         setShowDrawer={setShowDrawer}
//         destination={destination_city_id}
//         _updateFlightBookingHandler={_updateFlightBookingHandler}
//         _updatePaymentHandler={_updatePaymentHandler}
//         getPaymentHandler={getPaymentHandler}
//         oCityData={oCityData}
//         dCityData={dCityData}
//         setShowLoginModal={setShowLoginModal}
//         city={origin_city_name}
//         dcity={destination_city_name}
//         _updateTaxiBookingHandler={_updateTaxiBookingHandler}
//         selectedBooking={selectedBooking}
//         setSelectedBooking={setSelectedBooking}
//         originCityId={oCityData?.city?.id || oCityData?.gmaps_place_id}
//         destinationCityId={dCityData?.city?.id || dCityData?.gmaps_place_id}
//         origin_itinerary_city_id={oCityData?.id || oCityData?.gmaps_place_id}
//         destination_itinerary_city_id={
//           dCityData?.id || dCityData?.gmaps_place_id
//         }
//         booking_id={booking_id}
//       />

//       {handleShow && (
//         <TransferDrawer
//           show={handleShow}
//           error={error}
//           setHandleShow={setHandleShow}
//           data={data}
//           booking_type={transferType || booking_type}
//           loading={loading}
//           handleDelete={handleDelete}
//           setShowDrawer={setShowDrawer}
//           city={city}
//           _updateFlightBookingHandler={_updateFlightBookingHandler}
//           _updatePaymentHandler={_updatePaymentHandler}
//           getPaymentHandler={getPaymentHandler}
//           oCityData={oCityData}
//           dCityData={dCityData}
//           setShowLoginModal={setShowLoginModal}
//           dcity={destination_city_name}
//           selectedBooking={selectedBooking}
//           setSelectedBooking={setSelectedBooking}
//           originCityId={oCityData?.city?.id || oCityData?.gmaps_place_id}
//           destinationCityId={dCityData?.city?.id || dCityData?.gmaps_place_id}
//           origin_itinerary_city_id={oCityData?.id || oCityData?.gmaps_place_id}
//           destination_itinerary_city_id={
//             dCityData?.id || dCityData?.gmaps_place_id
//           }
//           isIntracity={isIntracity}
//           booking_id={booking_id}
//         />
//       )}
//     </Container>
//   );
// };

// export default CityItem;