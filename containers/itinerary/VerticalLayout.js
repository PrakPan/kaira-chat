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

// Transfer links adopt the CityDay slab-element heading styling (the activity
// title: Inter, tight tracking/leading). Color stays on each link's existing
// utility class (text-blue), and font size/weight stay on their existing
// classes too, so they keep their current scale and link color.
const TRANSFER_LINK_FONT = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  letterSpacing: "0",
  lineHeight: 1.1,
};

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

// Small inline loader shown in the pickup/drop transfer row while the city's
// airport transfers are being repriced (transfers/pricing status PENDING). The
// backend deletes the old airport bookings and recreates them asynchronously,
// so without this the row would just vanish until the new bookings arrive.
const PickupDropLoader = () => (
  <div className="flex items-center gap-2 mt-1">
    <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-gray-300 border-t-gray-500 animate-spin" />
    <span className="text-[13px] text-[#a5a5a5]">Updating transfers…</span>
  </div>
);

// P1 (Draft) stage loader for the transfer row. The existing TransferSkeleton
// is sized for the finalized layout (fixed 200px text bar + margins) and
// overflows the narrower draft column, breaking the layout — so the draft
// stage gets its own compact shimmer that mirrors the draft transfer row
// (icon dot + city line + duration line). It is replaced by the real transfer
// the moment the draft surfaces a city/booking for the leg.
const P1TransferLoader = () => (
  <div className="flex gap-2 mt-2 animate-pulse">
    <div className="w-[18px] h-[18px] rounded-full bg-gray-200 flex-shrink-0 mt-[2px]" />
    <div className="flex flex-col gap-2">
      <div className="w-[140px] h-[14px] rounded bg-gray-200" />
      <div className="w-[90px] h-[10px] rounded bg-gray-200" />
    </div>
  </div>
);

const TaxiPickupDropItem = ({
  fromChat,
  handlePickupDropDrawer,
  handleAddCityTaxiAirport,
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
    // No bookings yet → open the Add Taxi drawer with the Pickup/Drop tab
    // pre-selected. For middle cities default to pickup at the destination.
    if (!hasPickup && !hasDrop) {
      const type = lastCity && !firstCity ? "drop" : "pickup";
      handleAddCityTaxiAirport?.(type);
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
      // Pickup happens at the destination, drop at the origin; the mid-trip
      // combined case spans both cities.
      if (firstCity) {
        return `+ Add Taxi Pickup${destinationCityName ? ` in ${destinationCityName}` : ""}`;
      } else if (lastCity) {
        return `+ Add Taxi Drop${originCityName ? ` in ${originCityName}` : ""}`;
      } else {
        const cities = [originCityName, destinationCityName].filter(Boolean).join(" & ");
        return `+ Add Taxi Pickup/Drop${cities ? ` in ${cities}` : ""}`;
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
          className={`${fromChat ? "text-[#1f6feb] font-[600] text-[13px] max-ph:text-[12.5px] py-[5px] max-ph:py-[5px] px-[2px]" : "text-blue font-[500] text-[14px]"} ${
            displayText ? "hover:underline cursor-pointer" : ""
          }`}
          style={TRANSFER_LINK_FONT}
          onClick={handleClick}
        >
          {displayText}
        </span>
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
  fromChat,
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
  handleAddCityTaxiAirport,
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

  // "+ Add Pickup/Drop" CTA label, with the relevant city appended. Pickup
  // happens at the destination, drop at the origin; the mid-trip combined case
  // spans both cities.
  const addPickupDropText = () => {
    if (firstCity)
      return `+ Add Pickup${destinationCityName ? ` in ${destinationCityName}` : ""}`;
    if (lastCity)
      return `+ Add Drop${originCityName ? ` in ${originCityName}` : ""}`;
    const cities = [originCityName, destinationCityName].filter(Boolean).join(" & ");
    return `+ Add Pickup and Drop${cities ? ` in ${cities}` : ""}`;
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
          <span>{addPickupDropText()}</span>
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
    // No bookings yet → open the Add Taxi drawer with the Pickup/Drop tab
    // pre-selected (firstCity → pickup at destination, lastCity → drop at
    // origin, middle → default to pickup).
    if (
      !hasPickup &&
      !hasDrop &&
      noPickupDropBookings.length === 0 &&
      supportsTransfers(bookingMode)
    ) {
      const type = lastCity ? "drop" : "pickup";
      handleAddCityTaxiAirport?.(type);
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
          className={`${fromChat ? "text-[#1f6feb] font-[600] text-[13px] max-ph:text-[12.5px] py-[5px] max-ph:py-[5px] px-[2px]" : "text-blue font-[500] text-[14px]"} ${displayText ? "hover:underline cursor-pointer" : ""
            }`}
          style={TRANSFER_LINK_FONT}
          onClick={handleClick}
        >
          {displayText}
        </span>
      </div>

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
            className={`${fromChat ? "text-[#1f6feb] font-[600] text-[13px] max-ph:text-[12.5px] py-[5px] max-ph:py-[5px] px-[2px]" : `${isDesktop ? "Body1M_16" : "Body2M_14"} text-blue`} hover:underline cursor-pointer`}
            style={TRANSFER_LINK_FONT}
            onClick={handleClick}
          >
            {addPickupDropText()}
          </span>
        </div>
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
  isFirstCity,
  check_in,
  check_out,
  date_of_journey,
  fromChat,
  isDraft,
  showPins
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { transfers_status,pricing_status } = useSelector((state) => state.ItineraryStatus);
  const isDesktop = useMediaQuery("(min-width:767px)");
  const reduxItineraryId = useSelector((state) => state.ItineraryId);

  // P1 (Draft) fallback: when the shimmer/draft itinerary doesn't yet carry
  // a start city name, label the row with the user's cached IP location so
  // the start pin/label isn't blank during the loading state.
  const userLocationFallback = (() => {
    if (typeof window === "undefined") return null;
    try {
      const cached = JSON.parse(localStorage.getItem("userLocation") || "null");
      return cached?.city || null;
    } catch {
      return null;
    }
  })();

  const [isTransferDrawerOpen, setIsTransferDrawerOpen] = useState(false);
  const [transferDrawerType, setTransferDrawerType] = useState(null); // 'pickup' or 'drop'
  const [selectedTransferBooking, setSelectedTransferBooking] = useState(null);
  const { trackTransferBookingAdd, trackTransferBookingChange, trackTransferBookingDelete } = useAnalytics();
  const { id } = useSelector((state) => state.auth);

  const { drawer, bookingId, oItineraryCity, dItineraryCity, drawerType,  doj, initialMode, initialEdgeId, drawerSource} =
    router?.query;

  // Use Redux ItineraryId as the canonical ID (works on /chat/[sessionId] pages too)
  const currentItineraryId = router.query.id || reduxItineraryId;
  const isDraftMode = fromChat && !currentItineraryId;

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

  const correctIcon = (TransportMode, color = "#a5a5a5") => {
    switch (TransportMode?.toLowerCase()) {
      case "flight":
        return (
          <MdOutlineFlightTakeoff className="text-2xl" size={18} color={color} />
        );
      case "taxi":
      case "car":
        return <IoCar className="text-2xl" size={16} color={color} />;
      case "train":
        return <IoMdTrain className="text-2xl" size={16} color={color} />;
      case "ferry":
        return <IoMdBoat className="text-2xl" size={16} color={color} />;
      case "bus":
        return <FaBus className="text-2xl" size={16} color={color} />;
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

  const Itinerary = useSelector(state =>state.Itinerary)

  // P1/Draft transfer-loader safety net. The draft row shows P1TransferLoader
  // while a leg's transfer is still expected (transfers_status PENDING — set by
  // display_itinerary right after the day-by-day lands). It must stop when
  // display_transfers resolves the leg to "no transfer" (transfers_status flips
  // to SUCCESS) — handled directly in the render below — but also when
  // display_transfers never arrives at all. Bound that wait so the loader can't
  // spin forever; once elapsed we drop the loader for this leg.
  const [transferWaitElapsed, setTransferWaitElapsed] = useState(false);
  useEffect(() => {
    if (Itinerary?.status === "Draft") {
      setTransferWaitElapsed(false);
      const t = setTimeout(() => setTransferWaitElapsed(true), 12000);
      return () => clearTimeout(t);
    }
    setTransferWaitElapsed(false);
  }, [Itinerary?.status, transfers_status]);

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
  //       pathname: window.location.pathname,
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
        pathname: window.location.pathname,
        query: {
          ...(currentItineraryId ? { id: currentItineraryId } : {}),
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
        shallow: true,
      }
    );
  };

  const handlePickupDropDrawer = (drawerType) => {
    router.push(
      {
        pathname: window.location.pathname,
        query: {
          ...(currentItineraryId ? { id: currentItineraryId } : {}),
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
        shallow: true,
      }
    );
  };

  // Open the same Add Taxi drawer used by the "+ Taxi" CTA, but with the
  // Pickup/Drop tab pre-selected. Pickup takes place at the destination city
  // of the leg; drop at the origin. For "both", default to destination.
  const handleAddCityTaxiAirport = (type) => {
    const cityId =
      type === "drop"
        ? oCityData?.id || oCityData?.gmaps_place_id
        : dCityData?.id || dCityData?.gmaps_place_id;
    if (!cityId) return;
    router.push(
      {
        pathname: window.location.pathname,
        query: {
          ...(currentItineraryId ? { id: currentItineraryId } : {}),
          drawer: "addCityTaxi",
          itinerary_city_id: cityId,
          taxiTab: "airport",
        },
      },
      undefined,
      { scroll: false, shallow: true },
    );
  };

  const handleAddTransfer = () => {
    if(localStorage.getItem("access_token")){
    trackTransferBookingChange(currentItineraryId, bookingIdToDelete, oCityData?.name || oCityData?.city_name, dCityData?.name || dCityData?.city_name);
    router.push(
      {
        pathname: window.location.pathname,
        query: {
          ...(currentItineraryId ? { id: currentItineraryId } : {}),
          drawer: "editTransfer",
          bookingId: booking?.id,
          oItineraryCity: oCityData?.id || oCityData?.gmaps_place_id,
          dItineraryCity: dCityData?.id || dCityData?.gmaps_place_id,
        },
      },
      undefined,
      {
        scroll: false,
        shallow: true,
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

      const isAirportTransferBooking =
        dataPassed?.is_airport_pickup || dataPassed?.is_airport_drop;

      if (isIntracity || isAirportTransferBooking) {
        setCurrentAirportBookings((prev) =>
          prev.filter((booking) => booking.id !== dataPassed?.id)
        );
      } else {
        setVisible(true);
      }

      // `city` can be undefined for airport transfer deletes, which produced
      // "undefined deleted successfully". Fall back to a Taxi Pickup/Drop label.
      const deletedLabel =
        city ||
        (dataPassed?.is_airport_drop
          ? "Taxi Drop"
          : dataPassed?.is_airport_pickup
          ? "Taxi Pickup"
          : "Booking");

      dispatch(
        openNotification({
          type: "success",
          text: `${deletedLabel} deleted successfully`,
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
  //         pathname: window.location.pathname,
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

  const formatDurationRange = (minutes) => {
  const hours = minutes / 60;

  const lower = Math.floor(hours);
  const upper = Math.ceil(hours);

  if (lower === upper) {
    return `${lower} hour${lower > 1 ? "s" : ""}`;
  }

  return `${lower}-${upper} hours`;
};

  // ── Chat-only transfer/flight presentation helpers ──────────────────────
  const isFlightLeg = !!booking_type?.toLowerCase?.().includes("flight");

  const formatFlightDate = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return "";
    return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  // Departure date shown on every transfer chip. Read from the check-in date:
  // date_of_journey is only passed on the start/end transfers, so fall back to
  // the destination city's check-in (start_date) — the day you leave the origin
  // — then to the raw check-in/out props.
  const departDate =
    date_of_journey ||
    dCityData?.start_date ||
    check_out ||
    check_in ||
    oCityData?.end_date;
  const departLabel = formatFlightDate(departDate);

  // Duration (minutes) computed from a check-in → check-out datetime pair, used
  // as a fallback when the booking itself carries no duration.
  const durationFromCheckInOut = (ci, co) => {
    if (!ci || !co) return 0;
    const a = new Date(ci).getTime();
    const b = new Date(co).getTime();
    if (isNaN(a) || isNaN(b) || b <= a) return 0;
    return Math.round((b - a) / 60000);
  };

  const transferModeLabel = (() => {
    const t = booking_type?.toLowerCase() || "";
    if (t.includes("flight")) return "Flight";
    if (t.includes("train")) return "Train";
    if (t.includes("ferry") || t.includes("boat")) return "Ferry";
    if (t.includes("bus")) return "Bus";
    if (
      t.includes("taxi") ||
      t.includes("car") ||
      t.includes("cab") ||
      t.includes("sedan")
    )
      return "Private taxi";
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : "Transfer";
  })();

  // Approx transfer duration. The value may arrive as a top-level numeric
  // `duration` (minutes) or inside transfer_details.duration ({ text: "3 hours
  // 30 mins", value: seconds }) — the shape the detail view reads. Flights show
  // Flights and other transfers alike show an exact "Approx 3h 30m".
  // Resolve a transfer/leg duration (minutes) from whichever field a booking
  // carries: top-level numeric, flight segments (elapsed or summed), or the
  // road-transfer transfer_details.duration ({ text, value: seconds }).
  const resolveDurationMins = (b, topLevel) => {
    const top = Number(topLevel);
    if (top > 0) return top;
    const segs = b?.transfer_details?.items?.[0]?.segments;
    if (Array.isArray(segs) && segs.length) {
      const dep = segs[0]?.origin?.departure_time;
      const arr = segs[segs.length - 1]?.destination?.arrival_time;
      const depMs = dep ? new Date(dep).getTime() : NaN;
      const arrMs = arr ? new Date(arr).getTime() : NaN;
      if (!isNaN(depMs) && !isNaN(arrMs) && arrMs > depMs) {
        return Math.round((arrMs - depMs) / 60000);
      }
      const sum = segs.reduce((s, seg) => s + (Number(seg?.duration) || 0), 0);
      if (sum > 0) return sum;
    }
    const dd = b?.transfer_details?.duration;
    const text = typeof dd === "string" ? dd : dd?.text || "";
    if (text) {
      const h = (text.match(/(\d+)\s*h/i) || [])[1];
      const m = (text.match(/(\d+)\s*m/i) || [])[1];
      const mins = parseInt(h || 0, 10) * 60 + parseInt(m || 0, 10);
      if (mins > 0) return mins;
    }
    const secs = Number(dd?.value);
    if (secs > 0) return Math.round(secs / 60);
    return 0;
  };

  const _durationDetails = booking?.transfer_details?.duration;
  const _durationText =
    typeof _durationDetails === "string"
      ? _durationDetails
      : _durationDetails?.text || "";
  const effectiveDuration =
    resolveDurationMins(booking, duration || booking?.duration) ||
    durationFromCheckInOut(booking?.check_in, booking?.check_out);

  const approxDurationLabel = (mins) => {
    const m = Number(mins) || 0;
    if (m <= 0) return "";
    const h = Math.floor(m / 60);
    const min = Math.round(m % 60);
    if (h > 0 && min > 0) return `Approx ${h}h ${min}m`;
    if (h > 0) return `Approx ${h}h`;
    return `Approx ${min}m`;
  };

  // Final label — falls back to the raw duration text when it can't be parsed
  // into minutes, so a duration is still shown whenever the booking has one.
  // Flights and transfers share one h/m format: a 20-minute ferry reads
  // "Approx 20m", not a whole hour rounded up from it.
  const durationLabel =
    approxDurationLabel(effectiveDuration) ||
    (_durationText ? `Approx ${_durationText}` : "");

  // Combo (multi-leg) transfer — e.g. "Train to Kyoto, Flight to Chūbu
  // Centrair". Render one row per leg, each with its own approx time.
  const comboChildren =
    Array.isArray(booking?.children) && booking.children.length > 1
      ? booking.children
      : null;
  const comboHasFlight = comboChildren?.some((c) =>
    (c?.booking_type || "").toLowerCase().includes("flight"),
  );
  const legModeLabel = (bt) => {
    const t = (bt || "").toLowerCase();
    if (t.includes("flight")) return "Flight";
    if (t.includes("train")) return "Train";
    if (t.includes("ferry") || t.includes("boat")) return "Ferry";
    if (t.includes("bus")) return "Bus";
    if (
      t.includes("taxi") ||
      t.includes("car") ||
      t.includes("cab") ||
      t.includes("sedan")
    )
      return "Taxi";
    return bt || "Transfer";
  };
  // Leg cities live in different places by mode: road legs at
  // transfer_details.trips[*].origin/destination.{city|name|address}; flight
  // legs at transfer_details.items[0].segments[*].origin/destination.city_name.
  const legSrcName = (leg) => {
    const td = leg?.transfer_details;
    const o = td?.trips?.[0]?.origin;
    const seg = td?.items?.[0]?.segments?.[0]?.origin;
    return (
      o?.city ||
      o?.name ||
      o?.address ||
      seg?.city_name ||
      seg?.city_code ||
      leg?.source_address?.name ||
      td?.source?.name ||
      ""
    );
  };
  const legDestName = (leg) => {
    const td = leg?.transfer_details;
    const trips = td?.trips;
    const d =
      (Array.isArray(trips) && trips[trips.length - 1]?.destination) ||
      trips?.[0]?.destination;
    const segs = td?.items?.[0]?.segments;
    const seg = Array.isArray(segs) ? segs[segs.length - 1]?.destination : null;
    return (
      d?.city ||
      d?.name ||
      d?.address ||
      seg?.city_name ||
      seg?.city_code ||
      leg?.destination_address?.name ||
      td?.destination?.name ||
      ""
    );
  };
  // Same resolution order as the single-transfer card: read a duration off the
  // booking, and when it carries none (the usual case for ferry/bus legs) derive
  // it from the leg's check-in → check-out pair.
  const legDurationLabel = (leg) =>
    approxDurationLabel(
      resolveDurationMins(leg, leg?.duration) ||
        durationFromCheckInOut(leg?.check_in, leg?.check_out),
    );
  // Flight legs carry a real segment departure_time; road/rail/ferry legs only
  // have date_of_journey or a check-in datetime, so fall through to those.
  const legDepartsDate = (leg) =>
    formatFlightDate(
      leg?.transfer_details?.items?.[0]?.segments?.[0]?.origin
        ?.departure_time ||
        leg?.departure_time ||
        leg?.date_of_journey ||
        leg?.check_in,
    );

  // Chat transfer "Change" — mirrors the booking-details Change button
  // (TransferDrawer.handleEditRoute): opens the regular editTransfer search
  // drawer for this leg's booking so the user can swap the transfer. Combos use
  // the same drawer as any other transfer (not the multicity taxi drawer).
  const handleChangeTransfer = (e) => {
    e?.stopPropagation?.();
    if (!localStorage.getItem("access_token")) {
      setShowLoginModal(true);
      return;
    }
    trackTransferBookingChange(
      router.query.id,
      bookingIdToDelete,
      oCityData?.name || oCityData?.city_name,
      dCityData?.name || dCityData?.city_name,
    );
    router.push(
      {
        pathname: window.location.pathname,
        query: {
          ...(currentItineraryId ? { id: currentItineraryId } : {}),
          drawer: "editTransfer",
          drawerType: null,
          bookingId: booking?.id,
          oItineraryCity: oCityData?.id || oCityData?.gmaps_place_id,
          dItineraryCity: dCityData?.id || dCityData?.gmaps_place_id,
          doj: booking?.check_in || departDate,
        },
      },
      undefined,
      { scroll: false, shallow: true },
    );
  };

  // Right-side action group on every chat transfer chip: [Change] [View ›].
  // Change opens the change drawer; View opens the booking-details drawer (the
  // chip's own onClick). On mobile only Change shows — View is hidden.
  const transferChipActions = (
    <div className="flex items-center gap-[14px] max-ph:gap-0 shrink-0">
      <button
        type="button"
        onClick={handleChangeTransfer}
        className="text-[12.5px] max-ph:text-[11.5px] font-[600] text-[#1f6feb] whitespace-nowrap hover:underline"
      >
        Change
      </button>
      <span className="text-[12.5px] max-ph:text-[11.5px] font-[600] text-[#1f6feb] whitespace-nowrap max-ph:hidden">
        View ›
      </span>
    </div>
  );


  return (
    <Container
      className={`${fromChat ? "" : (isLast ? "mb-[60px]" : "")}`}
      style={fromChat ? { display: "block", width: "100%" } : undefined}
    >
    {!fromChat && (!(Itinerary.status == "Draft") ?  <PinWrapper>
  {upPresent &&  <VerticalLine height={"50px"} gradient="top" />}
  {upPresent && downPresent ? (
    <div className="flex items-center justify-center">
      {/* {correctIcon(booking_type)} */}
    </div>
  ) : (
   <Pin length={length} pinColour={"black"} inner={true} className="-ml-[8.5px]" />
  )}
  {downPresent && <VerticalLine height={"50px"} gradient="bottom" />}
</PinWrapper> :  <PinWrapper>
  {/* P1 (Draft) stage. Endpoint *labels* (start/end city name rows) carry
      isFirstCity/isLast and render the pin with a single line on the
      appropriate side — those rows have no upPresent/downPresent. Every
      other row (including the start→first-city and last-city→end transfers,
      which have firstCity/lastCity set) renders one connecting line. Two
      stacked gradients fade to transparent where they meet, which leaves a
      visible gap; one line keeps the connector continuous. */}
  {upPresent && downPresent && (
    <div className="flex items-center justify-center m-2 py-2">
      <VerticalLine height={"50px"} gradient="top" />
    </div>
  )}
  {!upPresent && !downPresent && isFirstCity && (
    <>
      <Pin length={length} pinColour={"black"} inner={true} />
      {/* <VerticalLine height={"50px"} gradient="bottom" /> */}
    </>
  )}
  {!upPresent && !downPresent && isLast && (
    <>
      {/* <VerticalLine height={"50px"} gradient="top" /> */}
      <Pin length={length} pinColour={"black"} inner={true} />
    </>
  )}
</PinWrapper>)}
     

      <div
        className={`flex flex-col gap-2 ${fromChat ? "w-full" : ""} ${!fromChat && !downPresent && upPresent && "mt-[41px]z"
          } ${!fromChat && !upPresent && downPresent && "mb-[41px]"}`}
        style={
          // P1 (Draft) start/end city label rows: pin sits at one end of a
          // taller PinWrapper (pin + line). align-self pulls the city name
          // to the same end so the text lines up with the pin instead of
          // the wrapper's vertical centre.
          Itinerary?.status === "Draft" && !upPresent && !downPresent
            ? { alignSelf: isLast ? "flex-end" : "flex-start" }
            : undefined
        }
      >
        {/* City and Duration Section - Aligned with Pin */}
        <div
          className={`flex flex-col gap-3 ${!(upPresent && downPresent) ? "itmes-center justify-center" : ""
            }`}
        >
          {!(upPresent && downPresent) && (
            <div
              className={`${isDesktop ? "Body1M_16" : "Body2M_14"} ${
                fromChat ? "flex items-center gap-3 max-ph:gap-[11px] py-[4px] max-ph:py-[3px] px-[2px]" : ""
              }`}
            >
              {/* Chat: solid endpoint dot (replaces the removed pin rail) */}
              {fromChat && (isFirstCity || isLast) && (
                <span className="inline-block w-3.5 h-3.5 max-ph:w-[13px] max-ph:h-[13px] rounded-full bg-[#171A1F] shrink-0" />
              )}
              {/* P1 fallback: when the draft itinerary hasn't surfaced a
                  start-city name yet, use the user's IP-derived city so the
                  label isn't blank under the start pin. */}
              {fromChat ? (
                <span className="font-[800] text-[17px] max-ph:text-[15.5px] tracking-[-0.3px] leading-tight text-[#171A1F]">
                  {city ||
                    (Itinerary?.status === "Draft" && isFirstCity
                      ? userLocationFallback
                      : null)}
                </span>
              ) : (
                city ||
                (Itinerary?.status === "Draft" && isFirstCity
                  ? userLocationFallback
                  : null)
              )}
              {/* Chat: trip start/end tag on the endpoint nodes */}
              {fromChat && (isFirstCity || isLast) && (
                <span className="text-[10px] font-[700] tracking-[0.7px] text-[#9aa0a8] uppercase whitespace-nowrap">
                  {isFirstCity ? "Start" : "End"}
                </span>
              )}
            </div>
          )}

          {transfers_status === "PENDING" && !(Itinerary.status == "Draft")  ? (
  upPresent && downPresent ? (
    <TransferSkeleton fromChat={fromChat} />
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
          ? "mt-0"
          : (booking_id || city) && !visible
          ? "mt-0"
          : "mt-0"
      }`}
    >
      {(booking_id || city) && !visible ? (
        <>
          {/* EXISTING BOOKING DISPLAY - Icon and City Name */}
          {fromChat ? (
            comboChildren ? (
              /* Chat: combo (multi-leg) card — one row per booking, each with
                 its own approx time. Mirrors the old "Train to Kyoto, Flight
                 to Chūbu Centrair" combo but split into scannable rows. */
              <div
                onClick={() => handleEdit(true, booking)}
                className="flex items-stretch w-full rounded-[12px] border-[1px] cursor-pointer overflow-hidden bg-[#EEF4FE] border-[#DBE7FB]"
              >
                <div className="flex-1 min-w-0 flex flex-col">
                  {comboChildren.map((leg, i) => {
                    // Fall back to the trip's overall origin/destination for the
                    // first/last leg when the leg itself doesn't carry a city.
                    const src =
                      legSrcName(leg) || (i === 0 ? origin_city_name : "");
                    const dest =
                      legDestName(leg) ||
                      (i === comboChildren.length - 1
                        ? destination_city_name
                        : "");
                    const modeLabel = legModeLabel(leg?.booking_type);
                    const dur = legDurationLabel(leg);
                    // Every leg shows its departure date, not just flights. Only
                    // the first leg may borrow the trip's departure date — later
                    // legs could fall on a different day, so leave them blank
                    // rather than assert a date we don't have.
                    const departs =
                      legDepartsDate(leg) || (i === 0 ? departLabel : "");
                    return (
                      <div
                        key={leg?.id || i}
                        className={`flex items-center gap-[13px] max-ph:gap-[11px] px-[15px] max-ph:px-[12px] py-[11px] max-ph:py-[9px] ${
                          i > 0 ? "border-t border-[#DBE7FB]" : ""
                        }`}
                      >
                        <span className="flex items-center shrink-0 text-[#1f6feb]">
                          {correctIcon(leg?.booking_type, "#1f6feb")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] max-ph:text-[12.5px] font-[700] text-[#1c2c44] truncate">
                            {src && dest
                              ? `${src} → ${dest}`
                              : `${modeLabel}${dest ? ` to ${dest}` : ""}`}
                          </div>
                          <div className="text-[12px] max-ph:text-[11px] text-[#7b8aa3] mt-0.5">
                            {modeLabel}
                            {departs ? ` · Departs ${departs}` : ""}
                            {dur ? ` · ${dur}` : ""}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center px-[15px] shrink-0">
                  {transferChipActions}
                </div>
              </div>
            ) : isFlightLeg ? (
              /* Chat: dedicated flight card */
              <div
                onClick={() => handleEdit(transfer_type === "combo", booking)}
                className="flex items-center gap-[13px] max-ph:gap-[11px] w-full px-[15px] max-ph:px-[12px] py-[13px] max-ph:py-[11px] rounded-[12px] max-ph:rounded-[11px] bg-[#EEF4FE] border-[1px] border-[#DBE7FB] cursor-pointer"
              >
                <MdOutlineFlightTakeoff size={20} color="#1f6feb" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] max-ph:text-[12.5px] font-[700] text-[#1c2c44]">
                    {origin_city_name} → {destination_city_name}
                  </div>
                  <div className="text-[12px] max-ph:text-[11px] text-[#7b8aa3] mt-0.5">
                    Flight
                    {departLabel ? ` · Departs ${departLabel}` : ""}
                    {durationLabel ? ` · ${durationLabel}` : ""}
                  </div>
                </div>
                {transferChipActions}
              </div>
            ) : (
              /* Chat: transfer chip */
              <div
                onClick={() => handleEdit(transfer_type === "combo", booking)}
                className="flex items-center gap-[12px] max-ph:gap-[10px] w-full px-[15px] max-ph:px-[12px] py-[11px] max-ph:py-[9px] rounded-[12px] max-ph:rounded-[11px] bg-[#EEF4FE] border-[1px] border-[#DBE7FB] cursor-pointer"
              >
                <span className="flex items-center shrink-0 text-[#1f6feb]">
                  {booking?.children
                    ? booking?.children?.map((book, i) => {
                        const mode = extractMode(book?.booking_type);
                        return (
                          <React.Fragment key={i}>
                            {correctIcon(mode, "#1f6feb")}
                            {i < booking?.children?.length - 1 && (
                              <span>
                                <RiArrowDropRightLine size={18} color={"#1f6feb"} />
                              </span>
                            )}
                          </React.Fragment>
                        );
                      })
                    : correctIcon(booking_type, "#1f6feb")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] max-ph:text-[12px] font-[600] text-[#1c2c44] truncate">
                    {origin_city_name} → {destination_city_name}
                  </div>
                  <div className="text-[12px] max-ph:text-[11px] text-[#7b8aa3] mt-0.5">
                    {transferModeLabel}
                    {departLabel ? ` · Departs ${departLabel}` : ""}
                    {durationLabel ? ` · ${durationLabel}` : ""}
                  </div>
                </div>
                {transferChipActions}
              </div>
            )
          ) : (
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
                  if(!(Itinerary.status == "Draft")){
                  upPresent &&
                    downPresent &&
                    handleEdit(transfer_type === "combo", booking);
                  }
                }}
              >
                <div
                  className={`${
                    isDesktop ? "Body1M_16" : "Body2M_14"
                  } group-hover:text-blue `}
                  style={TRANSFER_LINK_FONT}
                >
                  {upPresent && downPresent ? city : ""}
                </div>
                {upPresent && downPresent && !(Itinerary.status == "Draft") && (
                  <div className="">
                    <FaPen
                      size={12}
                      className="transition-transform group-hover:scale-150 duration-300 group-hover:text-yellow-500"
                    />
                  </div>
                )}
              </div>

             {duration > 0 && (
  <div className="Body3R_12">
    Duration: {Itinerary.status === "Draft"
      ? formatDurationRange(duration)
      : duration}
  </div>
)}
            </div>
          </div>
          )}

          {/* AIRPORT/STATION PICKUP DROP - Show only for flight/train/ferry/bus */}
          {/* While the airport transfers are being repriced (transfers or
              pricing PENDING), show a loader instead of silently hiding the row. */}
          {(transfers_status === "PENDING" || pricing_status === "PENDING") && !(Itinerary.status == "Draft") && (
            <PickupDropLoader />
          )}
         {transfers_status != "PENDING" &&
  pricing_status != "PENDING" &&
  // Only render the pickup/drop section when it has something to show —
  // flight/train/ferry/bus support station transfers, or there are existing
  // airport bookings. For a plain taxi (no support, no bookings) this section
  // renders nothing, so skipping it avoids an empty row + its gap padding the
  // bottom of the transfer box unevenly.
  (["flight", "train", "ferry", "bus"].includes(booking_type?.toLowerCase()) ||
    currentAirportBookings.length > 0) && (
    <div className={`flex flex-col gap-1 ${fromChat && lastCity ? "order-first" : ""}`}>
      {/* On the final leg the drop happens before you depart, so the drop CTA
          sits above the transfer chip (between the last city box and the
          transfer) rather than below it. */}
      {/* CHANGED: Conditional rendering based on booking existence */}
      {(booking_id || currentAirportBookings.length > 0) ? (
        /* If main booking exists OR there are pickup/drop bookings, show AirportBookingItem */
        <AirportBookingItem
          fromChat={fromChat}
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
          handleAddCityTaxiAirport={handleAddCityTaxiAirport}
          setAirportBookingId={setAirportBookingId}
          setTransferType={setTransferType}
          firstCity={firstCity}
          lastCity={lastCity}
        />
      ) : !(Itinerary.status == "Draft") ? (
        /* If NO main booking and NO pickup/drop bookings, show TaxiPickupDropItem */
        <TaxiPickupDropItem
          fromChat={fromChat}
          key={`taxi-no-booking`}
          handlePickupDropDrawer={handlePickupDropDrawer}
          handleAddCityTaxiAirport={handleAddCityTaxiAirport}
          originCityName={origin_city_name}
          destinationCityName={destination_city_name}
          firstCity={firstCity}
          lastCity={lastCity}
          currentAirportBookings={currentAirportBookings}
          handleEdit={handleEdit}
        />
      ) : null}
    </div>
  )}
        </>
      ) : Itinerary.status == "Draft" ? (
        // P1 (Draft) stage: the leg's transfer hasn't surfaced yet. Show the
        // compact draft loader ONLY while a transfer is still expected
        // (transfers_status PENDING) and within the bounded wait. It disappears
        // when (booking_id || city) becomes truthy (the transfer "comes in" and
        // the branch above renders), when display_transfers resolves this leg to
        // no transfer (transfers_status → SUCCESS), or when display_transfers
        // never arrives (the wait elapses) — so it can no longer spin forever.
         !transferWaitElapsed ? (
          <P1TransferLoader />
        ) : null
      ) : (
        <>
          {/* NO BOOKING - Show both CTAs */}
          {/* First CTA: Add Transfer */}
          { !(Itinerary.status == "Draft")  ? 
          isPageWide ? (
            <button
              onClick={handleAddTransfer}
              className={`${
                isDesktop ? "Body1M_16" : "Body2M_14"
              } text-blue hover:underline text-left`}
              style={TRANSFER_LINK_FONT}
            >
              + Add Transfer from {origin_city_name} to {destination_city_name}
            </button>
          ) :  (
            <button
              onClick={handleAddTransfer}
              className={`${
                isDesktop ? "Body1M_16" : "Body2M_14"
              } text-blue hover:underline text-left`}
              style={TRANSFER_LINK_FONT}
            >
              + Add Transfer
            </button>
          ) : null}

          {/* Second CTA: Add Taxi Pickup/Drop - Only when NO booking */}
          {!isDraftMode &&
            (transfers_status === "PENDING" || pricing_status === "PENDING") && (
              <PickupDropLoader />
            )}
          {!isDraftMode && transfers_status != "PENDING" && pricing_status != "PENDING" && (
            <TaxiPickupDropItem
              fromChat={fromChat}
              key={`taxi-no-booking`}
              handlePickupDropDrawer={handlePickupDropDrawer}
              handleAddCityTaxiAirport={handleAddCityTaxiAirport}
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
        (oItineraryCity == oCityData?.id || oItineraryCity == oCityData?.gmaps_place_id) &&
        (dItineraryCity == dCityData?.id || dItineraryCity == dCityData?.gmaps_place_id) && (
          <PickupDropDrawer
            isOpen={drawer === "addPickupDrop" &&
              (oItineraryCity == oCityData?.id || oItineraryCity == oCityData?.gmaps_place_id) &&
              (dItineraryCity == dCityData?.id || dItineraryCity == dCityData?.gmaps_place_id)}
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
            booking_id={bookingId}
          />
        )}



      {((drawer == "editTransfer" && drawerSource !== "chat" &&
        (oItineraryCity == oCityData?.id || oItineraryCity == oCityData?.gmaps_place_id) &&
        (dItineraryCity == dCityData?.id || dItineraryCity == dCityData?.gmaps_place_id)) || drawerType == "multicity") && (
          <TransferEditDrawer
            mercury
            addOrEdit={"transferAdd"}
            showDrawer={
              drawer == "editTransfer" && drawerSource !== "chat" &&
              (oItineraryCity == oCityData?.id || oItineraryCity == oCityData?.gmaps_place_id) &&
              (dItineraryCity == dCityData?.id || dItineraryCity == dCityData?.gmaps_place_id)
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
            initialMode={initialMode || undefined}
            initialEdgeId={initialEdgeId || undefined}
          />
        )}

      {"Intracity" === drawer &&
        (bookingId === airportBookingId || bookingId === booking_id) &&
        (oItineraryCity == oCityData?.id || oItineraryCity == oCityData?.gmaps_place_id) &&
        (dItineraryCity == dCityData?.id || dItineraryCity == dCityData?.gmaps_place_id) && (
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

