import { useState, useEffect } from "react";
import Image from "next/image";
import FlightDetailModal from "../../components/modals/daybyday/FlightDetailModal";
import TaxiDetailModal from "../../components/modals/daybyday/TaxiDetailModal";
import Drawer from "../../components/ui/Drawer";
import BackArrow from "../../components/ui/BackArrow";
import FlightDetailLoader from "../../components/modals/daybyday/FlightDetailLoader";
import { PulseLoader } from "react-spinners";
import VehicleDetailModal from "../../components/modals/daybyday/VehicleModal";
import VehicleDetailLoader from "../../components/modals/daybyday/VehicleDetailLoader";
import { AiOutlineRight, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { Generalbuttonstyle } from "../../components/ui/button/Generallinkbutton";
import { TbArrowBack } from "react-icons/tb";
import styled from "styled-components";
import { FaTaxi } from "react-icons/fa";
import ImageLoader from "../../components/ImageLoader";
import { useDispatch } from "react-redux";
import { openNotification } from "../../store/actions/notification";
import axios from "axios";
import { MERCURY_HOST } from "../../services/constants";
import { useRouter } from "next/router";
import { useHandleClose } from "../../hooks/useHandleClose";
import { getDateDifferenceInDays } from "../../helper/DateUtils";
const FloatingView = styled.div`
  position: sticky;
  bottom: 60px;
  left: 100%;
  background: black;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  z-index: 2;
  cursor: pointer;
`;

const TransferDrawer = ({
  show,
  booking_type,
  handleDelete,
  city,
  _updateFlightBookingHandler,
  _updatePaymentHandler,
  getPaymentHandler,
  oCityData,
  dCityData,
  setShowLoginModal,
  dcity,
  selectedBooking,
  setSelectedBooking,
  originCityId,
  destinationCityId,
  origin_itinerary_city_id,
  destination_itinerary_city_id,
  isIntracity,
  isAirport,
  AirportTransferType,
  setIsTransferDrawerOpen,
 isSightseeing,
  combo,
  booking_id,
  transferType,
}) => {
  const handleDrawerClose = useHandleClose();
  const dispatch = useDispatch();
  const router = useRouter();
  const [error,setError]=useState(false)

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const isPageWide = window.matchMedia("(min-width: 768px)")?.matches;
  const isCombo = data?.children && data?.children.length > 0;
  const [isDrawerOpen,setIsDrawerOpen] = useState(show);
    const { drawer, bookingId, oItineraryCity, dItineraryCity, drawerType } =
    router?.query;

    console.log("DDD",drawer);

  useEffect(() => {
    if (show && isCombo && data?.children?.length > 0) {
      setExpandedIndexes([0]);
    }
  }, [show, isCombo, data?.children?.length]);

  const handleEditRoute = (data=null) => {
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer: data?.is_airport_drop || data?.is_airport_pickup ? "addPickupDrop" : "editTransfer",
          drawerType: data?.is_airport_drop  ? "drop" : data?.is_airport_pickup ? "pickup" : data?.combo_type ==="multicity" ? "multicity" : null,
          bookingId: booking_id,
          oItineraryCity:origin_itinerary_city_id,
          dItineraryCity:destination_itinerary_city_id
        },
      },
      undefined,
      {
        scroll: false,
      }
    );
  };

  console.log("BBK",booking_type,transferType,data);


  const toggleExpand = (index) => {
    if (expandedIndexes.includes(index)) {
      setExpandedIndexes(expandedIndexes.filter((i) => i !== index));
    } else {
      setExpandedIndexes([...expandedIndexes, index]);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/${
            combo ? `combo` : booking_type?.toLowerCase()
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

    fetchDetails();
  }, []);

  const renderDetailContent = (transferData, index) => {

    const type = transferData?.transfer_type == "sightseeing" ? "Taxi" : transferData?.booking_type;
    const childTitle = `${index + 1}. ${
      transferData.name || `${transferData.booking_type} Transfer`
    }`;
    const isExpanded = expandedIndexes.includes(index);

    const formatDateTime = (dateTimeString) => {
      if (!dateTimeString) return { date: "", time: "" };
      const date = new Date(dateTimeString);
      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
    };

    const checkIn = formatDateTime(transferData.check_in);
    const checkOut = formatDateTime(transferData.check_out);

    const dateDiff = getDateDifferenceInDays(transferData.check_in,transferData.check_out) + 1;

    // Get route information
    const origin = transferData.transfer_details?.trips?.[0]?.origin;
    const destination = transferData.transfer_details?.trips?.[0]?.destination;
    const originName = origin?.address;
    const destinationName = destination?.address;
    const transferType = transferData.transfer_type;
    const distance = transferData.transfer_details?.distance?.text;
    const duration = transferData.transfer_details?.duration?.text;

    // Get transfer icon
    const getTransferIcon = (transferType) => {
      switch (transferType) {
        case "one-way":
          return "🚗";
        case "sightseeing":
          return "🎯";
        case "round-trip":
          return "🔄";
        default:
          return "🚗";
      }
    };

    const renderDetailsByType = () => {
      if (loading) {
        return <VehicleDetailLoader />;
      }
      

      switch (type) {
        case "Flight":
          return (
            <FlightDetailModal
              segments={transferData?.transfer_details?.items?.[0]?.segments}
              fareRule={
                transferData?.transfer_details?.items?.[0]?.fare_rule?.[0]
              }
              booking_id={transferData?.id}
              setShowDetails={null}
              name={transferData?.name}
              isEmbedded={true}
              setShowLoginModal={setShowLoginModal}
              handleEditRoute={handleEditRoute}
            />
          );
        case "Taxi":
          return (
            <TaxiDetailModal
              data={transferData}
              handleDelete={null}
              loading={loading}
              isEmbedded={true}
              noHeading={true}
              handleEditRoute={handleEditRoute}
            />
          );
        default:
          return (
            <VehicleDetailModal
              data={transferData}
              handleDelete={null}
              loading={loading}
              isEmbedded={true}
              handleClose={handleClose}
              handleEditRoute={handleEditRoute}
            />
          );
      }
    };

    // Check if this is a multicity combo
    if (data?.combo_type === "multicity") {
      return (
        <div key={`${transferData.id}-${index}`} className="mb-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {/* Header - Always visible */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {/* <div className="text-xl">{getTransferIcon(transferType)}</div> */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
                      {childTitle} &nbsp;
                      <span className="text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {" "}
                        {transferType}
                      </span>
                    </h3>
                    {/* <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      
                    </span> */}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    {transferType === "sightseeing" ? (
                      <span>
                           <div className="w-auto flex items-center gap-1">
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 13 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6.32734 0.417969C3.01534 0.417969 0.333344 3.10597 0.333344 6.41797C0.333344 9.72997 3.01534 12.418 6.32734 12.418C9.64534 12.418 12.3333 9.72997 12.3333 6.41797C12.3333 3.10597 9.64534 0.417969 6.32734 0.417969ZM6.33334 11.218C3.68134 11.218 1.53334 9.06997 1.53334 6.41797C1.53334 3.76597 3.68134 1.61797 6.33334 1.61797C8.98534 1.61797 11.1333 3.76597 11.1333 6.41797C11.1333 9.06997 8.98534 11.218 6.33334 11.218ZM6.20134 3.41797H6.16534C5.92534 3.41797 5.73334 3.60997 5.73334 3.84997V6.68197C5.73334 6.89197 5.84134 7.08997 6.02734 7.19797L8.51734 8.69197C8.72134 8.81197 8.98534 8.75197 9.10534 8.54797C9.23134 8.34397 9.16534 8.07397 8.95534 7.95397L6.63334 6.57397V3.84997C6.63334 3.60997 6.44134 3.41797 6.20134 3.41797Z"
                                  fill="black"
                                />
                              </svg>
                              {dateDiff  && 
                                <span className="text-gray-600">
                                  {dateDiff <=1 ? 1 : dateDiff} {dateDiff <= 1 ? "day" : "days"} •
                                </span>}
                            {duration} • {distance} </div> 
                      </span>
                    ) : (
                      <span className="truncate">
                        {originName} → {destinationName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price and Date - Desktop */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    ₹{transferData.price?.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">{checkIn.date}</div>
                </div>
                <div className="text-gray-400">
                  {isExpanded ? (
                    <AiOutlineUp className="w-5 h-5" />
                  ) : (
                    <AiOutlineDown className="w-5 h-5" />
                  )}
                </div>
              </div>

              {/* Price and Arrow - Mobile */}
              <div className="flex md:hidden items-center space-x-2">
                {/* <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    ₹{(transferData.price / 1000).toFixed(0)}k
                  </div>
                </div> */}
                <div className="text-gray-400">
                  {isExpanded ? (
                    <AiOutlineUp className="w-4 h-4" />
                  ) : (
                    <AiOutlineDown className="w-4 h-4" />
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Price Row */}
            <div className="md:hidden px-4 pb-2">
              <div className="flex justify-between items-center text-xs text-gray-500">
                {/* <span>
                  {checkIn.date} - {checkOut.date}
                </span> */}
                {/* <span>₹{transferData.price?.toLocaleString()}</span> */}
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t border-gray-100 bg-gray-50">
                <div className="p-4 space-y-4">
                  {/* Route/Timing Information */}
                  <div className="bg-white rounded-lg p-3">
                    {transferType === "sightseeing" ? (
                      // Check if sightseeing has source and destination addresses
                      originName && destinationName ? (
                        <>
                          <h4 className="font-medium text-gray-900 mb-3 text-sm">
                            Route Information
                          </h4>
                          <div className="flex items-center justify-between space-x-4">
                            {/* Source */}
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 rounded-full bg-green-500 mb-1"></div>
                              <div className="text-sm font-medium text-gray-900 text-center">
                                {originName}
                              </div>
                              <div className="text-xs text-gray-500 text-center">
                                {checkIn.time}
                              </div>
                            </div>

                            {/* Dotted line with distance and duration */}
                            <div className="flex-1 flex flex-col items-center">
                              <div className="w-full border-t-2 border-dotted border-gray-300 mb-1"></div>
                              <div className="text-xs text-gray-500 whitespace-nowrap">
                                
                             {distance} • {duration}
                              </div>
                            </div>

                            {/* Destination */}
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 rounded-full bg-red-500 mb-1"></div>
                              <div className="text-sm font-medium text-gray-900 text-center">
                                {destinationName}
                              </div>
                              <div className="text-xs text-gray-500 text-center">
                                {checkOut.time}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        // Original sightseeing layout
                        <>
                          <h4 className="font-medium text-gray-900 mb-3 text-sm">
                            Sightseeing Details
                          </h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <div className="text-gray-500 text-xs">
                                Duration
                                {/* : {dateDiff} {dateDiff ==1 ? "day" :"days"} */}
                              </div>
                              <div className="font-medium text-gray-900">
                                {duration}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">
                                Distance Limit
                              </div>
                              <div className="font-medium text-gray-900">
                                {distance}
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    ) : (
                      // Taxi route information - single row layout
                      <>
                        <h4 className="font-medium text-gray-900 mb-3 text-sm">
                          Route Information
                        </h4>
                        <div className="flex items-center justify-between space-x-4">
                          {/* Source */}
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mb-1"></div>
                            <div className="text-sm font-medium text-gray-900 text-center">
                              {originName}
                            </div>
                            <div className="text-xs text-gray-500 text-center">
                              {checkIn.time}
                            </div>
                          </div>

                          {/* Dotted line with distance and duration */}
                          <div className="flex-1 flex flex-col items-center">
                            <div className="w-full border-t-2 border-dotted border-gray-300 mb-1"></div>
                            <div className="text-xs text-gray-500 whitespace-nowrap">
                              {distance} • {duration}
                            </div>
                          </div>

                          {/* Destination */}
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500 mb-1"></div>
                            <div className="text-sm font-medium text-gray-900 text-center">
                              {destinationName}
                            </div>
                            <div className="text-xs text-gray-500 text-center">
                              {checkOut.time}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Timing Details for Sightseeing (only if no route info) */}
                  {transferType === "sightseeing" &&
                    !(originName && destinationName) && (
                      <div className="bg-white rounded-lg p-3">
                        <h4 className="font-medium text-gray-900 mb-3 text-sm">
                          Timings
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-gray-500 text-xs"> Start Date</div>
                            <div className="font-medium text-gray-900">
                              {checkIn.date}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {checkIn.time}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 text-xs">End Date</div>
                            <div className="font-medium text-gray-900">
                              {checkOut.date}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {checkOut.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Cancellation Policy - Show if exists */}
                  {transferData.cancellation_policy && (
                    <div className="bg-white rounded-lg p-3 border-l-4 border-orange-400">
                      {/* <h4 className="font-medium text-gray-900 mb-2 text-sm flex items-center">
                     Cancellation Policy
                  </h4> */}

                      <div
                        dangerouslySetInnerHTML={{
                          __html: transferData.cancellation_policy,
                        }}
                        className="flex flex-col gap-1 text-sm ml-4"
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Original rendering for non-multicity
    return (
      <div key={`${transferData.id}-${index}`} className="mb-6">
        <div
          className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg cursor-pointer"
          onClick={() => toggleExpand(index)}
        >
          <h3 className="text-lg font-medium">{childTitle}</h3>
          {isExpanded ? (
            <AiOutlineDown className="text-gray-600" />
          ) : (
            <AiOutlineRight className="text-gray-600" />
          )}
        </div>
        {isExpanded && <div className="mt-3">{renderDetailsByType()}</div>}
      </div>
    );
  };


  const handleClose = () => {
    setIsDrawerOpen(false);
  handleDrawerClose();
  }

  return (
    <Drawer
      show={isDrawerOpen}
      anchor={"right"}
      backdrop
      style={{ zIndex: 1501 }}
      className=""
      onHide={handleClose}
      mobileWidth="100vw"
      width={"50vw"}
    >
      {!isCombo ? (
        <>
          {booking_type === "Flight" ? (
            loading ? (
              <FlightDetailLoader />
            ) : (
              <FlightDetailModal
                segments={data?.transfer_details?.items?.[0]?.segments}
                fareRule={data?.transfer_details?.items?.[0]?.fare_rule?.[0]}
                booking_id={data?.id}
                name={city}
                setShowLoginModal={setShowLoginModal}
                onChange={true}
                handleClose={handleClose}
                error={error}
                handleEditRoute={handleEditRoute}
              />
            )
          ) : loading ? (
            <VehicleDetailLoader  />
          ) : booking_type === "Taxi" ? (
            <TaxiDetailModal
              data={data}
              handleDelete={handleDelete}
              loading={loading}
              _updateFlightBookingHandler={_updateFlightBookingHandler}
              _updatePaymentHandler={_updatePaymentHandler}
              getPaymentHandler={getPaymentHandler}
              oCityData={oCityData}
              dCityData={dCityData}
              setShowLoginModal={setShowLoginModal}
              city={city}
              dcity={dcity}
              selectedBooking={selectedBooking}
              setSelectedBooking={setSelectedBooking}
              originCityId={originCityId}
              destinationCityId={destinationCityId}
              origin_itinerary_city_id={origin_itinerary_city_id}
              destination_itinerary_city_id={destination_itinerary_city_id}
              handleClose={handleClose}
              noChange={isIntracity}
              error={error}
              // isAirport={isAirport}
              setIsTransferDrawerOpen={setIsTransferDrawerOpen}
              handleEditRoute={handleEditRoute}
            />
          ) : (
            <VehicleDetailModal
              data={data}
              handleDelete={handleDelete}
              loading={loading}
              handleClose={handleClose}
              error={error}
              handleEditRoute={handleEditRoute}
            />
          )}
        </>
      ) : error ? (
        <>
          <div
            style={{
              textAlign: "center",
              margin: "auto",
              height: isPageWide ? "80vh" : "70vh",
            }}
            className="center-div"
          >
            Oops, unable to get the details at the moment.
          </div>
        </>
      ) : (
        <div className="h-screen flex flex-col">
          <div className="p-4 border-b">
            <BackArrow handleClick={handleClose} />
            <div className="flex justify-between">
              <div>
                <div className="text-xl font-semibold mt-2">
                  {data.name ||
                    `${data.children[0]?.source_address?.name || ""} to ${
                      data.children[data.children.length - 1]
                        ?.destination_address?.name || ""
                    }`}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {data.duration || `${data.children.length} transfers`}
                </div>
              </div>
              {(data?.transfer_type != "sightseeing" && drawer != "SightSeeing") && <div>
                <Generalbuttonstyle
                  borderRadius={"7px"}
                  fontSize={"1rem"}
                  padding={"7px 25px"}
                  onClick={() => {
                    // setHandleShow(false);
                    // setShowDrawer(true);
                    handleEditRoute(data)
                  }}
                >
                  Change
                </Generalbuttonstyle>
              </div>}
            </div>
          </div>

          <div className="flex-grow overflow-auto py-4 pb-24 ">
            {data?.combo_type == "multicity" && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-4">
                    {loading ? (
                      <div className="w-24 h-5 bg-gray-300 opacity-50 rounded"></div>
                    ) : (
                      "TAXI DETAILS"
                    )}
                  </p>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col gap-4 items-center">
                      <div
                        className="w-full md:w-auto border border-gray-200 rounded-lg  flex justify-center items-center"
                        style={{ height: "140px" }}
                      >
                        {loading ? (
                          <div className="w-full h-full bg-gray-300 opacity-50 rounded"></div>
                        ) : (
                          <div className="w-full md:w-[180px] h-[140px] relative flex justify-center items-center">
                            {data?.children[0]?.transfer_details?.quote
                              ?.taxi_category?.image ? (
                              <ImageLoader
                                url={
                                  data?.children[0]?.transfer_details?.quote
                                    ?.taxi_category?.image
                                }
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <FaTaxi className="w-16 h-16 text-gray-400" />
                            )}
                          </div>
                        )}
                      </div>

                      {data?.children[0]?.transfer_details?.quote?.taxi_category
                        ?.type && (
                        <div>
                          <p className="text-gray-500 text-sm">
                            <span className="font-semibold text-gray-800">
                              {loading ? (
                                <div className="w-20 h-5 bg-gray-300 opacity-50 rounded"></div>
                              ) : data?.children[0]?.transfer_details?.quote
                                  ?.taxi_category?.type ? (
                                data?.children[0]?.transfer_details?.quote
                                  ?.taxi_category?.type
                              ) : (
                                ""
                              )}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full">
                      <div className="grid grid-cols-2 gap-4">
                        {
                          <div>
                            <p className="text-gray-500 text-sm">Model</p>
                            <p className="font-semibold text-gray-800">
                              {loading ? (
                                <div className="w-20 h-5 bg-gray-300 opacity-50 rounded"></div>
                              ) : data?.children[0]?.transfer_details?.quote
                                  ?.taxi_category?.model_name ? (
                                data?.children[0]?.transfer_details?.quote
                                  ?.taxi_category?.model_name
                              ) : (
                                "NA"
                              )}
                            </p>
                          </div>
                        }

                        {/* Fuel Type */}
                        {
                          <div>
                            <p className="text-gray-500 text-sm">Fuel Type</p>
                            <p className="font-semibold text-gray-800">
                              {loading ? (
                                <div className="w-20 h-5 bg-gray-300 opacity-50 rounded"></div>
                              ) : data?.children[0]?.transfer_details?.quote
                                  ?.taxi_category?.fuel_type ? (
                                data?.children[0]?.transfer_details?.quote
                                  ?.taxi_category?.fuel_type
                              ) : (
                                "NA"
                              )}
                            </p>
                          </div>
                        }

                        {/* Luggage Bags */}
                        {
                          <div>
                            <p className="text-gray-500 text-sm">
                              Luggage Bags
                            </p>
                            <p className="font-semibold text-gray-800">
                              {loading ? (
                                <div className="w-10 h-5 bg-gray-300 opacity-50 rounded"></div>
                              ) : data?.children[0]?.transfer_details?.quote
                                  ?.taxi_category?.bag_capacity ? (
                                data?.children[0]?.transfer_details?.quote
                                  ?.taxi_category?.bag_capacity
                              ) : (
                                "NA"
                              )}
                            </p>
                          </div>
                        }

                        {/* Seat Capacity */}
                        {
                          <div>
                            <p className="text-gray-500 text-sm">
                              Seat Capacity
                            </p>
                            <p className="font-semibold text-gray-800">
                              {loading ? (
                                <div className="w-24 h-5 bg-gray-300 opacity-50 rounded"></div>
                              ) : data?.children[0]?.transfer_details?.quote
                                  ?.taxi_category?.seating_capacity ? (
                                data?.children[0]?.transfer_details?.quote
                                  ?.taxi_category?.seating_capacity
                              ) : (
                                "NA"
                              )}
                            </p>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="text-sm md:text-base ml-2 md:ml-5 font-semibold text-gray-900">
                  Booking Inclusions
                </h2>
              </>
            )}
            {data.children.map((child, index) =>
              renderDetailContent(child, index)
            )}
          </div>

          {data?.combo_type != "multicity" && (
            <div className="p-4 bg-white sticky bottom-0 shadow-md">
              <button
                className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center"
                onClick={() => handleDelete(data)}
                disabled={loading}
              >
                <div style={{ position: "relative" }}>
                  <div className="flex gap-1 items-center text-white">
                    <div
                      style={{ visibility: loading ? "hidden" : "visible" }}
                      className="flex gap-1 items-center"
                    >
                      <Image
                        src="/delete.svg"
                        width={20}
                        height={20}
                        alt="Delete"
                      />
                      <div>Delete Booking</div>
                    </div>

                    {loading && (
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <PulseLoader
                          size={12}
                          speedMultiplier={0.6}
                          color="#ffffff"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
      {!isPageWide && (
        <FloatingView>
          <TbArrowBack
            style={{ height: "28px", width: "28px" }}
            cursor={"pointer"}
            onClick={handleClose}
          />
        </FloatingView>
      )}
    </Drawer>
  );
};

export default TransferDrawer;
