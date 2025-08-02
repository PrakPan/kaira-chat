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
  setHandleShow,
  data,
  booking_type,
  loading,
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
  setShowDrawer,
  isIntracity,
  error,
  isAirport,
 AirportTransferType,
 setIsTransferDrawerOpen,
 isSightseeing,
}) => {
  console.log("IsSight",isSightseeing);
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const isPageWide = window.matchMedia("(min-width: 768px)")?.matches;
  const isCombo = data?.children && data?.children.length > 0;
  useEffect(() => {
    if (show && isCombo && data?.children?.length > 0) {
      setExpandedIndexes([0]);
    }
  }, [show, isCombo, data?.children?.length]);

  const toggleExpand = (index) => {
    if (expandedIndexes.includes(index)) {
      setExpandedIndexes(expandedIndexes.filter((i) => i !== index));
    } else {
      setExpandedIndexes([...expandedIndexes, index]);
    }
  };

  const renderDetailContent = (transferData, index) => {
    const type = transferData?.booking_type;
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
        return <VehicleDetailLoader setHandleShow={null} />;
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
            />
          );
        case "Taxi":
          return (
            <TaxiDetailModal
              data={transferData}
              setHandleShow={null}
              handleDelete={null}
              loading={loading}
              isEmbedded={true}
              noHeading={true}
            />
          );
        default:
          return (
            <VehicleDetailModal
              data={transferData}
              setHandleShow={null}
              handleDelete={null}
              loading={loading}
              isEmbedded={true}
              setShowDrawer={setShowDrawer}
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
                      {childTitle} &nbsp;<span className="text-xs font-medium bg-blue-100 text-blue-800 capitalize"> {transferType}</span>
                    </h3>
                    {/* <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      
                    </span> */}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    {transferType === "sightseeing" ? (
                      <span>
                        {duration} • {distance}
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
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    ₹{(transferData.price / 1000).toFixed(0)}k
                  </div>
                </div>
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
                <span>
                  {checkIn.date} - {checkOut.date}
                </span>
                <span>₹{transferData.price?.toLocaleString()}</span>
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
                          Schedule
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-gray-500 text-xs">Start</div>
                            <div className="font-medium text-gray-900">
                              {checkIn.date}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {checkIn.time}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 text-xs">End</div>
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

  return (
    <Drawer
      show={show}
      anchor={"right"}
      backdrop
      style={{ zIndex: 1501 }}
      className="font-lexend"
      onHide={setHandleShow}
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
                setShowDetails={setHandleShow}
                name={city}
                setShowLoginModal={setShowLoginModal}
                onChange={true}
                setShowDrawer={setShowDrawer}
                setHandleShow={setHandleShow}
                error={error}
              />
            )
          ) : loading ? (
            <VehicleDetailLoader setHandleShow={setHandleShow} />
          ) : booking_type === "Taxi" ? (
            <TaxiDetailModal
              data={data}
              setHandleShow={setHandleShow}
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
              setShowDrawer={setShowDrawer}
              noChange={isIntracity}
              error={error}
              isAirport={isAirport}
              setIsTransferDrawerOpen={setIsTransferDrawerOpen}
            />
          ) : (
            <VehicleDetailModal
              data={data}
              setHandleShow={setHandleShow}
              handleDelete={handleDelete}
              loading={loading}
              setShowDrawer={setShowDrawer}
              error={error}
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
            <BackArrow handleClick={() => setHandleShow(false)} />
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
              {!isSightseeing && <div>
                <Generalbuttonstyle
                  borderRadius={"7px"}
                  fontSize={"1rem"}
                  padding={"7px 25px"}
                  onClick={() => {
                    setHandleShow(false);
                    setShowDrawer(true);
                  }}
                >
                  Change
                </Generalbuttonstyle>
              </div>}
            </div>
          </div>

          <div className="flex-grow overflow-auto py-4 pb-24 ">
            {
              data?.combo_type == "multicity" && <>
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
                                    {data?.children[0]?.transfer_details?.quote?.taxi_category?.image ? (
                                      <ImageLoader
                                        url={
                                          data?.children[0]?.transfer_details?.quote?.taxi_category?.image
                                        }
                                        className="w-full h-full object-contain"
                                      />
                                    ) : (
                                      <FaTaxi className="w-16 h-16 text-gray-400" />
                                    )}
                                  </div>
                
                                )}
                                
                              </div>
              
                              {data?.children[0]?.transfer_details?.quote?.taxi_category?.type && <div>
                                    <p className="text-gray-500 text-sm"><span className="font-semibold text-gray-800">
                                        {loading ? (
                                          <div className="w-20 h-5 bg-gray-300 opacity-50 rounded"></div>
                                        ) : (
                                          data?.children[0]?.transfer_details?.quote?.taxi_category?.type ? data?.children[0]?.transfer_details?.quote?.taxi_category?.type : ""
                                        )}
                                    </span></p>
                                   
                                  </div>}
                              </div>
              
                              <div className="flex-1 w-full">
                                <div className="grid grid-cols-2 gap-4">
                                  {
                                    <div>
                                      <p className="text-gray-500 text-sm">Model</p>
                                      <p className="font-semibold text-gray-800">
                                        {loading ? (
                                          <div className="w-20 h-5 bg-gray-300 opacity-50 rounded"></div>
                                        ) : (
                                          data?.children[0]?.transfer_details?.quote?.taxi_category?.model_name ? data?.children[0]?.transfer_details?.quote?.taxi_category?.model_name : "NA"
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
                                        ) : (
                                          data?.children[0]?.transfer_details?.quote?.taxi_category?.fuel_type ? data?.children[0]?.transfer_details?.quote?.taxi_category?.fuel_type : "NA"
                                        )}
                                      </p>
                                    </div>
                                  }
              
                                  {/* Luggage Bags */}
                                  {
                                    <div>
                                      <p className="text-gray-500 text-sm">Luggage Bags</p>
                                      <p className="font-semibold text-gray-800">
                                        {loading ? (
                                          <div className="w-10 h-5 bg-gray-300 opacity-50 rounded"></div>
                                        ) : (
                                          data?.children[0]?.transfer_details?.quote?.taxi_category?.bag_capacity ? data?.children[0]?.transfer_details?.quote?.taxi_category?.bag_capacity : "NA"
                                        )}
                                      </p>
                                    </div>
                                  }
              
                                  {/* Seat Capacity */}
                                  {
                                    <div>
                                      <p className="text-gray-500 text-sm">Seat Capacity</p>
                                      <p className="font-semibold text-gray-800">
                                        {loading ? (
                                          <div className="w-24 h-5 bg-gray-300 opacity-50 rounded"></div>
                                        ) : (
                                          data?.children[0]?.transfer_details?.quote?.taxi_category?.seating_capacity ? data?.children[0]?.transfer_details?.quote?.taxi_category?.seating_capacity : "NA"
                                        )}
                                      </p>
                                    </div>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>   

                          <h2 className="text-sm md:text-base ml-2 md:ml-5 font-semibold text-gray-900">Booking Inclusions</h2>
                          </>
            }
            {data.children.map((child, index) =>
              renderDetailContent(child, index)
            )}
          </div>

          {data?.combo_type != "multicity" && <div className="p-4 bg-white sticky bottom-0 shadow-md">
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
          </div>}
        </div>
      )}
      {!isPageWide && (
        <FloatingView>
          <TbArrowBack
            style={{ height: "28px", width: "28px" }}
            cursor={"pointer"}
            onClick={() => setHandleShow(false)}
          />
        </FloatingView>
      )}
    </Drawer>
  );
};

export default TransferDrawer;
