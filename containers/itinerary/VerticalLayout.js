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
import { ToastContainer, toast } from "react-toastify";
import { axiosDeleteBooking } from "../../services/itinerary/bookings";
import {
  setTransferBookings,
  updateTransferBookings,
} from "../../store/actions/transferBookingsStore";
import { useDispatch, useSelector } from "react-redux";
import TransferEditDrawer from "../../components/drawers/routeTransfer/TransferEditDrawer";
import VehicleDetailModal from "../../components/modals/daybyday/VehicleModal";
import Drawer from "../../components/ui/Drawer";
import FlightDetailModal from "../../components/modals/daybyday/FlightDetailModal";
import TransferSkeleton from "../../components/itinerary/Skeleton/TransferSkeleton";
import media from "../../components/media";
import { openNotification } from "../../store/actions/notification";
import Image from "next/image";
import { RiArrowDropRightLine, RiArrowGoForwardLine } from "react-icons/ri";
import TaxiDetailModal from "../../components/modals/daybyday/TaxiDetailModal";
import VehicleDetailLoader from "../../components/modals/daybyday/VehicleDetailLoader";
import FlightDetailLoader from "../../components/modals/daybyday/FlightDetailLoader";
import { AiOutlineRight } from "react-icons/ai";
import BackArrow from "../../components/ui/BackArrow";
import { PulseLoader } from "react-spinners";
import TransferDrawer from "./TransferDrawer";
import { LuInfo } from "react-icons/lu";

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



const AirportBookingItem = ({ booking, handleIntracityBookings, upPresent, downPresent }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const dropdownRef = useRef(null);

  const pickupBooking = booking.find(book => book?.is_airport_pickup);
  const dropBooking = booking.find(book => book?.is_airport_drop);

  const hasPickup = Boolean(pickupBooking);
  const hasDrop = Boolean(dropBooking);

  const displayText = hasPickup && hasDrop
    ? 'Pickup & Drop Added'
    : hasPickup
      ? 'Pickup Added'
      : hasDrop ? 'Drop Added' : null;

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDetails(false);
      }
    };

    if (showDetails) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDetails]);

  const handleClick = () => {
    if (hasPickup && hasDrop) {
      setShowDetails(!showDetails);
      // Close hover tooltip when showing dropdown
      setShowTooltip(false);
    } else if (hasPickup && !hasDrop) {
      handleIntracityBookings(upPresent && downPresent, { ...pickupBooking, selectedType: 'Airport Pickup' });
    } else if (!hasPickup && hasDrop) {
      handleIntracityBookings(upPresent && downPresent, { ...dropBooking, selectedType: 'Airport Drop' });
    }
  };

  const handlePickupClick = (e) => {
    e.stopPropagation();
    setShowTooltip(false);
    setShowDetails(false);
    handleIntracityBookings(upPresent && downPresent, { ...pickupBooking, selectedType: 'Airport Pickup' });
  };

  const handleDropClick = (e) => {
    e.stopPropagation();
    setShowTooltip(false);
    setShowDetails(false);
    handleIntracityBookings(upPresent && downPresent, { ...dropBooking, selectedType: 'Airport Drop' });
  };

  const handleInfoHover = (show) => {
    // Only show hover tooltip if dropdown is not open
    if (!showDetails) {
      setShowTooltip(show);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateString?.split(' ')[0] || 'N/A';
    }
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateString?.split(' ')[1]?.substring(0, 5) || 'N/A';
    }
  };

  const getPassengerCount = (book) => {
    return (book.number_of_adults || 0) +
           (book.number_of_children || 0) +
           (book.number_of_infants || 0);
  };

  return (
    displayText ? <div key={-3} className="group relative" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <span
          className={`text-blue font-[500] text-[14px] ${
            displayText ? 'hover:underline cursor-pointer' : ''
          }`}
          onClick={handleClick}
        >
          {displayText}
        </span>

        <div className="relative">
          <div
            className="w-4 h-4 rounded-full bg-white text-gray-400 flex items-center justify-center text-[14px] font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            onMouseEnter={() => handleInfoHover(true)}
            onMouseLeave={() => handleInfoHover(false)}
          >
            <LuInfo size={16} strokeWidth={2.5} />
          </div>

          {/* Hover Tooltip - Only shows when dropdown is not open */}
          {showTooltip && !showDetails && (
            <div
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs rounded-md px-3 py-2 shadow-xl border border-gray-600 whitespace-nowrap"
              style={{ zIndex: 10000 }}
              onMouseEnter={() => handleInfoHover(true)}
              onMouseLeave={() => handleInfoHover(false)}
            >
              <div className="flex flex-col gap-1">
                {hasPickup && (
                  <div className="flex items-center gap-2">
                    <span
                      className="font-semibold text-yellow-300 cursor-pointer hover:text-yellow-100 underline transition-colors"
                      onClick={handlePickupClick}
                    >
                      {pickupBooking?.name}:
                    </span>
                    <span className="text-gray-200">
                      • Date {formatDate(pickupBooking.check_in)} • Time {formatTime(pickupBooking.check_in)}
                    </span>
                  </div>
                )}
                {hasDrop && (
                  <div className="flex items-center gap-2">
                    <span
                      className="font-semibold text-yellow-300 cursor-pointer hover:text-yellow-100 underline transition-colors"
                      onClick={handleDropClick}
                    >
                      {dropBooking?.name}:
                    </span>
                    <span className="text-gray-200">
                      • Date {formatDate(dropBooking.check_out || dropBooking.check_in)} • Time {formatTime(dropBooking.check_out || dropBooking.check_in)}
                    </span>
                  </div>
                )}
              </div>

              <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
            </div>
          )}
        </div>
      </div>

      {/* Details Dropdown - Shows below the text when both pickup and drop are present */}
      {showDetails && hasPickup && hasDrop && (
        <div className="relative mt-2">
          <div
            className="absolute bg-gray-900 text-white text-xs rounded-md px-2 py-2 shadow-xl border border-gray-600 min-w-[320px] max-w-[450px] md:w-[800px]"
            style={{ zIndex: 10000 }}
          >
            <div className="flex flex-col gap-2">
              {hasPickup && (
                <div className="flex items-start gap-2 flex-wrap">
                  <span
                    className="font-semibold text-yellow-300 cursor-pointer hover:text-yellow-100 underline transition-colors whitespace-nowrap"
                    onClick={handlePickupClick}
                  >
                    {pickupBooking?.name}:
                  </span>
                  <span className="text-gray-200 flex-1">
                    • Date {formatDate(pickupBooking.check_in)} • Time {formatTime(pickupBooking.check_in)}
                  </span>
                </div>
              )}
              {hasDrop && (
                <div className="flex items-start gap-2 flex-wrap">
                  <span
                    className="font-semibold text-yellow-300 cursor-pointer hover:text-yellow-100 underline transition-colors whitespace-nowrap"
                    onClick={handleDropClick}
                  >
                    {dropBooking?.name}:
                  </span>
                  <span className="text-gray-200 flex-1">
                    • Date {formatDate(dropBooking.check_out || dropBooking.check_in)} • Time {formatTime(dropBooking.check_out || dropBooking.check_in)}
                  </span>
                </div>
              )}
            </div>

            {/* Upward pointing arrow */}
            <div className="absolute left-4 top-0 transform -translate-y-1 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
          </div>
        </div>
      )}
    </div> : null
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
}) => {

  const { transfers_status } = useSelector((state) => state.ItineraryStatus);
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
  const [handleShow, setHandleShow] = useState(false);
  const [data, setData] = useState({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [comboDetails, setComboDetails] = useState(false);
  const [transferType,setTransferType] = useState(null);
  const [isIntracity,setIsIntracity] = useState(false);
  const [error,setError] = useState(false);

  console.log("Selllll", selectedBooking);
  const router = useRouter();
  const dispatch = useDispatch();
  let isPageWide = window.matchMedia("(min-width: 768px)")?.matches;

  const handleEdit = async (combo) => {
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
            error?.response?.data?.errors?.[0]?.message?.[0] || error.message ;
      dispatch(openNotification({
                text: errorMsg,
                heading: "Error!",
                type: "error",
              }));
    }
  };

  const handleIntracityBookings = async (combo,booking) => {
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

        if(!isIntracity){
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
            err?.response?.data?.errors?.[0]?.message?.[0] || err.response?.data?.errors[0]?.detail || err.message ;
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
    // Convert the text to lowercase for better matching
    const lowerText = text.toLowerCase();

    // Match the known transport modes
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


const formattedDate = (dateObj) => dateObj.toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const formattedTime = (dateObj) => dateObj.toLocaleTimeString("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

  

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
    <div className="flex items-center gap-3">
      {!(upPresent && downPresent) && <div className="">{city}</div>}
      
      {transfers_status === "PENDING" ? (
        upPresent && downPresent ? (
          <TransferSkeleton />
        ) : (
          ""
        )
      ) : (
        <div className={`text-[16px] font-[500] flex gap-1 ${airportBookings && (airportBookings.length > 0) ? "mt-5" : null}`}>
          {(booking_id || city) && !visible ? (
            <>
              {/* Icon Section */}
              <div className="mt-[4px] flex items-start">
                {booking?.children ? booking?.children?.map((book, i) => {
                      const mode = extractMode(book?.booking_type);
                      return (
                        <>
                          {correctIcon(mode)}
                          {i < booking?.children?.length - 1 && (
                            <span>
                              <RiArrowDropRightLine size={18} />
                            </span>
                          )}
                        </>
                      );
                    })
                  : correctIcon(booking_type)}
              </div>

              {/* City and Duration Section */}
              <div className="flex flex-col">
                <div
                  className={`flex items-center gap-2 ${
                    upPresent && downPresent ? "group hover:cursor-pointer" : ""
                  }`}
                  onClick={() => {
                    upPresent && downPresent && handleEdit(transfer_type === "combo");
                  }}
                >
                  <div className="group-hover:text-blue">{(upPresent && downPresent) ? city : ""}</div>
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

                {airportBookings && (airportBookings.length > 0) && (booking_id || city) && !visible && (
  <div className="flex flex-col gap-1  mb-[1.5rem] ">
      <AirportBookingItem
        key={booking_id}
        booking={airportBookings}
        handleIntracityBookings={handleIntracityBookings}
        upPresent={upPresent}
        downPresent={downPresent}
      />
    {/* ))} */}
  </div>
)}
              </div>
            </>
          ) : isPageWide ? (
            <button
              onClick={() => setShowDrawer(true)}
              className="text-[14px] font-[600] leading-[60px] text-blue hover:underline"
            >
              + Add Transfer from {origin_city_name} to {destination_city_name}
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
      )}
    </div>

  

  </div>

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
    destination_itinerary_city_id={dCityData?.id || dCityData?.gmaps_place_id}
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
      destination_itinerary_city_id={dCityData?.id || dCityData?.gmaps_place_id}
      isIntracity={isIntracity}
      booking_id={booking_id}
     
    />
  )}
</Container>
  );
};

export default CityItem;
