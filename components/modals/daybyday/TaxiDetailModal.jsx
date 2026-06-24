import React from "react";
import { PulseLoader } from "react-spinners";
import styled from "styled-components";
import Image from "next/image";
import BackArrow from "../../ui/BackArrow";
import ImageLoader from "../../ImageLoader";
import { Generalbuttonstyle } from "../../ui/button/Generallinkbutton";
import ComboTaxi from "../taxis/ComboTaxi";
import { useState } from "react";
import { FaTaxi } from "react-icons/fa";

const BackText = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;

const Text = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;

const TaxiDetailModal = ({
  data,
  setIsOpen,
  // setHandleShow,
  handleDelete,
  loading,
  booking,
  type,
  isEmbedded,
  _updateFlightBookingHandler,
  _updatePaymentHandler,
  getPaymentHandler,
  oCityData,
  dCityData,
  setShowLoginModal,
  city,
  dcity,
  selectedBooking,
  setSelectedBooking,
  originCityId,
  destinationCityId,
  origin_itinerary_city_id,
  destination_itinerary_city_id,
  handleClose,
  noChange,
  noHeading,
  error,
  isAirport,
  setIsTransferDrawerOpen,
  handleEditRoute
}) => {
  if (!data) return null;

   let isPageWide = window.matchMedia("(min-width: 768px)")?.matches;
  const {
    name,
    transfer_details,
    number_of_adults,
    number_of_children,
    source_address,
    destination_address,
    check_in,
    check_out,
    is_airport_drop,
    is_airport_pickup
  } = data;

  const [showTaxi, setShowTaxi] = useState(false);

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        weekday: "short",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const addMinutesToDate = (dateString, minutes) => {
  
    const date = new Date(dateString);

    date.setMinutes(date.getMinutes() + minutes);
    return formatDateTime(date.toISOString());
  };
  const departure =
    check_in ||
    transfer_details?.start_datetime ||
    transfer_details?.gozo?.start_date;
  const duration = transfer_details?.duration;
  const arrival =
    formatDateTime(check_out) || addMinutesToDate(departure, duration);
  const depart = formatDateTime(departure);

  const distance =
    transfer_details?.distance?.text ||
    `${transfer_details?.distance?.value} km`;
  const duration_text = transfer_details?.duration?.text;
  const model = transfer_details?.quote?.taxi_category?.model_name || transfer_details?.quote?.vehicle?.model_name;
  const taxiType = transfer_details?.quote?.taxi_category?.type || transfer_details?.quote?.vehicle?.type;
  const fuelType = transfer_details?.quote?.taxi_category?.fuel_type ||  transfer_details?.quote?.vehicle?.fuel_type;
  const luggageBags = transfer_details?.quote?.taxi_category?.bag_capacity || transfer_details?.quote?.vehicle?.bag_capacity;
  const seatCapacity = transfer_details?.quote?.taxi_category?.seating_capacity || transfer_details?.quote?.vehicle?.seating_capacity;

  if (error) {
        return (
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
        );
      }

  return !showTaxi ? (
    <>
      <div className=" bg-[#f4f3ec] w-full h-full flex flex-col">
        {!isEmbedded && (
          <div className="p-4 flex items-center justify-between">
            <BackArrow handleClick={handleClose} />
          </div>
        )}

        <div className="px-4 flex justify-between">
          <h1 className="text-xl font-bold text-[#1a2436] ">
            {loading ? (
              <div className="w-64 h-7 bg-[#ececec] opacity-50 rounded"></div>
            ) : (
            !noHeading && (data?.name || `Taxi from ${data?.transfer_details?.trips?.[0]?.origin?.address} to ${data?.transfer_details?.trips?.[0]?.destination?.address}`)
            )}
          </h1>
          {!isEmbedded && !noChange && (
            <div className="font-lexend flex justify-between items-start !m-0">
              {loading ? (
                <div className="w-16 h-5 bg-[#ececec] opacity-50 rounded"></div>
              ) : (
                <>
                  {/* <Text>{name}</Text> */}
                  <Generalbuttonstyle
                    borderRadius={"7px"}
                    fontSize={"1rem"}
                    padding={"7px 25px"}
                    marginMobile={"0px 0px 0px 2px"}
                    onClick={() => {
                      if(isAirport){
                        setIsTransferDrawerOpen(true);
                        return
                      }
                      // handleClose()
                      handleEditRoute(data)
                      //setShowTaxi(true);console.log("")
                    }}
                  >
                    Change
                  </Generalbuttonstyle>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 px-4 pt-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm relative border border-[#ececec]">
            <div className="relative flex justify-center items-center mb-6 mt-2">
              <div
                className="absolute left-0 right-1/2 border-t border-dashed border-[#b8becc] h-0"
                style={{ marginRight: "20px" }}
              ></div>

              <div className="bg-[#f4f3ec] px-4 py-1 rounded-full text-sm z-10 relative">
                {loading ? (
                  <div className="w-24 h-4 bg-[#ececec] opacity-50 rounded "></div>
                ) : (
                  (data?.transfer_type === "sightseeing" && (data?.transfer_details?.trips?.[0]?.origin?.address  && (data?.transfer_details?.trips?.[0]?.destination?.address))) ? `${distance} | ${duration_text}` : `${distance} | ${duration_text}`
                )}
              </div>

              <div
                className="absolute right-0 left-1/2 border-t border-dashed border-[#b8becc] h-0"
                style={{ marginLeft: "20px" }}
              ></div>

              <div className="absolute left-0 w-3 h-3 bg-[#b8becc] rounded-full"></div>

              <div className="absolute right-0 w-3 h-3 bg-[#b8becc] rounded-full"></div>
            </div>

            <div className="flex justify-between mb-6">
              <div className="flex flex-col items-start">
                <div>
                  {loading ? (
                    <>
                      <div className="w-32 h-5 bg-[#ececec] opacity-50 rounded mb-1"></div>
                      <div className="w-36 h-4 bg-[#ececec] opacity-50 rounded"></div>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-lg text-[#0b1220]">
                        {data?.transfer_type === "sightseeing" && data?.transfer_details?.trips?.[0]?.origin?.address && data?.transfer_details?.trips?.[0]?.destination?.address ? data?.transfer_details?.trips?.[0]?.origin?.address  : data?.transfer_details?.trips?.[0]?.origin?.address}
                      </p>
                      <p className="text-[#445069] text-sm flex flex-col sm:flex-row sm:gap-1">
                        <span>{depart.time}</span>
                        <span>{depart.date}</span>
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-right">
                  {loading ? (
                    <>
                      <div className="w-32 h-5 bg-[#ececec] opacity-50 rounded mb-1"></div>
                      <div className="w-36 h-4 bg-[#ececec] opacity-50 rounded"></div>
                    </>
                  ) : (
                    <>
                      {data?.transfer_details?.trips?.[0]?.destination?.address && (
                        <p className="font-bold text-lg text-[#0b1220]">
                          {data?.transfer_details?.trips?.[0]?.destination?.address}
                        </p>
                      )}
                     {arrival.time && arrival.date && <p className="text-[#445069] text-sm flex flex-col sm:flex-row sm:gap-1">
                        <span>{arrival.time ? arrival.time : ""}</span>
                        <span>{arrival.date ? arrival.date : ""}</span>
                      </p>}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[#f4f3ec] p-4 rounded-lg">
              <p className="font-semibold text-[#0b1220] mb-4">
                {loading ? (
                  <div className="w-24 h-5 bg-[#ececec] opacity-50 rounded"></div>
                ) : (
                  "TAXI DETAILS"
                )}
              </p>

              <div className="flex flex-col md:flex-row gap-4 max-sm:gap-[2rem]">
                <div className="flex flex-col gap-4 max-sm:gap-[2rem] items-center">
                <div
                  className="w-full md:w-auto border border-[#ececec] rounded-lg  flex justify-center items-center"
                  // style={{ height: "140px" }}
                >
                  {loading ? (
                    <div className="w-full h-full bg-[#ececec] opacity-50 rounded"></div>
                  ) : (

                    <div className="w-full md:w-[180px] h-[140px]  relative flex justify-center items-center">
                      {data?.transfer_details?.quote?.taxi_category?.image || data?.transfer_details?.quote?.vehicle?.image ? (
                        <ImageLoader
                          url={
                            data?.transfer_details?.quote?.taxi_category?.image || data?.transfer_details?.quote?.vehicle?.image
                          }
                          className="w-full h-full max-sm:w-[40px] max-sm:h-[40px] object-contain"
                          dimensionsMobile={{width:20, height:20}}
                        />
                      ) : (
                        <FaTaxi className="w-16 h-16 text-[#8a93a6]" />
                      )}
                    </div>

                  )}

                </div>

                {taxiType && <div>
                      <p className="text-[#8a93a6] text-sm"><span className="font-semibold text-[#0b1220]">
                          {loading ? (
                            <div className="w-20 h-5 bg-[#ececec] opacity-50 rounded"></div>
                          ) : (
                            taxiType ? taxiType : ""
                          )}
                      </span></p>

                    </div>}
                </div>

                <div className="flex-1 w-full">
                  <div className="grid grid-cols-2 gap-4">
                    {
                      <div>
                        <p className="text-[#445069] text-sm">Model</p>
                        <p className="font-semibold text-[#0b1220]">
                          {loading ? (
                            <div className="w-20 h-5 bg-[#ececec] opacity-50 rounded"></div>
                          ) : (
                            model ? model : "NA"
                          )}
                        </p>
                      </div>
                    }

                    {/* Fuel Type */}
                    {
                      <div>
                        <p className="text-[#445069] text-sm">Fuel Type</p>
                        <p className="font-semibold text-[#0b1220]">
                          {loading ? (
                            <div className="w-20 h-5 bg-[#ececec] opacity-50 rounded"></div>
                          ) : (
                            fuelType ? fuelType : "NA"
                          )}
                        </p>
                      </div>
                    }

                    {/* Luggage Bags */}
                    {
                      <div>
                        <p className="text-[#445069] text-sm">Luggage Bags</p>
                        <p className="font-semibold text-[#0b1220]">
                          {loading ? (
                            <div className="w-10 h-5 bg-[#ececec] opacity-50 rounded"></div>
                          ) : (
                            luggageBags ? luggageBags : "NA"
                          )}
                        </p>
                      </div>
                    }

                    {/* Seat Capacity */}
                    {
                      <div>
                        <p className="text-[#445069] text-sm">Seat Capacity</p>
                        <p className="font-semibold text-[#0b1220]">
                          {loading ? (
                            <div className="w-24 h-5 bg-[#ececec] opacity-50 rounded"></div>
                          ) : (
                            seatCapacity ? seatCapacity : "NA"
                          )}
                        </p>
                      </div>
                    }
                  </div>
                </div>
              </div>
              {!loading && data?.cancellation_policy  && (
                    <div
                      className="text-[14px]"
                      dangerouslySetInnerHTML={{
                        __html: data?.cancellation_policy,
                      }}
                    ></div>
              )}
            </div>
          </div>
          {data?.cancellation_policies&&<>
            <div
              className="text-[14px] mt-4"
              dangerouslySetInnerHTML={{
                __html: data?.cancellation_policies,
              }}
            ></div>
          </>}
        </div>

        {/* Delete Booking Button (Fixed) */}
        {handleDelete && type !== "combo" && (
          <div className="p-4 bg-[#fafaf5] sticky bottom-0 z-10 border-t border-[#ececec]">
            <button
              className="ttw-btn-remove-pill"
              onClick={() => handleDelete(booking || data)}
              disabled={loading}
            >
              {loading ? (
                <PulseLoader size={10} speedMultiplier={0.6} color="#ef4444" />
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M8 6V4.5A1.5 1.5 0 019.5 3h5A1.5 1.5 0 0116 4.5V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M18.5 6l-.7 12.1a2 2 0 01-2 1.9H8.2a2 2 0 01-2-1.9L5.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 10.5v5M14 10.5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  Delete Booking
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  ) : (
    <ComboTaxi
      key={data.id}
      edge={data?.edge}
      combo={false}
      // handleFlightSelect={handleFlightSelect}
      showTaxiModal={showTaxi}
      setShowComboTaxiModal={setShowTaxi}
      setHideTaxiModal={() => setShowTaxi(false)}
      // setHideBookingModal={setHideBookingModal}
      getPaymentHandler={getPaymentHandler}
      _updatePaymentHandler={_updatePaymentHandler}
      _updateFlightBookingHandler={_updateFlightBookingHandler}
      // _updateBookingHandler={_updateBookingHandler}
      // alternates={alternates}
      // tailored_id={tailored_id}
      selectedBooking={data}
      itinerary_id={data?.itinerary_id}
      // selectedTransferHeading={selectedTransferHeading}
      // fetchData={fetchData}
      setShowLoginModal={setShowLoginModal}
      // check_in={check_in}
      // _GetInTouch={_GetInTouch}
      // daySlabIndex={daySlabIndex}
      // elementIndex={elementIndex}
      // routeId={routeId}
      mercuryTransfer={data}
      // individual={individual}
      originCityId={data?.trips?.[0]?.origin?.city_id}
      destinationCityId={data?.trips?.[0]?.destination?.city_id}
      // isSelected={
      //   selectedModeIds[currentStep - 1] === option.id
      // }
      // onSelect={handleTaxiSelection}
      comboStartDate={
        data?.trips?.[0]?.start_date || selectedBooking?.start_date
      }
      comboStartTime={data?.trips?.[0]?.start_time || "12:00"}
      // // skipFetch={skipTaxiFetch}
      // onFilterApplied={handleFilterApplied}
      dCityData={dCityData}
      oCityData={oCityData}
    />
  );
};


export default TaxiDetailModal;