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
  setHandleShow,
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
  setShowDrawer,
  noChange,
}) => {
  if (!data) return null;

  console.log("Selllec", selectedBooking);
  const {
    name,
    transfer_details,
    number_of_adults,
    number_of_children,
    source_address,
    destination_address,
    check_in,
    check_out,
  } = data;

  const [showTaxi, setShowTaxi] = useState(false);
  console.log("Taxi Data", data);
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
    console.log("Date String", dateString);
    const date = new Date(dateString);
    console.log("date is:");
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
  const model = transfer_details?.quote?.taxi_category?.model_name;
  const fuelType = transfer_details?.quote?.taxi_category?.fuel_type;
  const luggageBags = transfer_details?.quote?.taxi_category?.bag_capacity;
  const seatCapacity = transfer_details?.quote?.taxi_category?.seating_capacity;

  return !showTaxi ? (
    <>
      <div className=" bg-gray-50 w-full h-full flex flex-col">
        {!isEmbedded && (
          <div className="p-4 flex items-center justify-between">
            <BackArrow handleClick={() => setHandleShow(false)} />
          </div>
        )}

        <div className="px-4 flex justify-between">
          <h1 className="text-xl font-bold text-gray-800 ">
            {loading ? (
              <div className="w-64 h-7 bg-gray-300 opacity-50 rounded"></div>
            ) : (
              `Taxi from ${source_address?.name} to ${destination_address?.name}`
            )}
          </h1>
          {!isEmbedded && !noChange && (
            <div className="font-lexend flex justify-between items-start !m-0">
              {loading ? (
                <div className="w-16 h-5 bg-gray-300 opacity-50 rounded"></div>
              ) : (
                <>
                  {/* <Text>{name}</Text> */}
                  <Generalbuttonstyle
                    borderRadius={"7px"}
                    fontSize={"1rem"}
                    padding={"7px 25px"}
                    onClick={() => {
                      setHandleShow(false);
                      setShowDrawer(true);
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
          <div className="bg-white p-6 rounded-2xl shadow-sm relative border border-gray-100">
            <div className="relative flex justify-center items-center mb-6 mt-2">
              <div
                className="absolute left-0 right-1/2 border-t border-dashed border-gray-300 h-0"
                style={{ marginRight: "20px" }}
              ></div>

              <div className="bg-gray-200 px-4 py-1 rounded-full text-sm z-10 relative">
                {loading ? (
                  <div className="w-24 h-4 bg-gray-300 opacity-50 rounded "></div>
                ) : (
                  `${distance} | ${duration_text}`
                )}
              </div>

              <div
                className="absolute right-0 left-1/2 border-t border-dashed border-gray-300 h-0"
                style={{ marginLeft: "20px" }}
              ></div>

              <div className="absolute left-0 w-3 h-3 bg-gray-300 rounded-full"></div>

              <div className="absolute right-0 w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>

            <div className="flex justify-between mb-6">
              <div className="flex flex-col items-start">
                <div>
                  {loading ? (
                    <>
                      <div className="w-32 h-5 bg-gray-300 opacity-50 rounded mb-1"></div>
                      <div className="w-36 h-4 bg-gray-300 opacity-50 rounded"></div>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-lg">
                        {source_address?.name}
                      </p>
                      <p className="text-gray-600 text-sm flex flex-col sm:flex-row sm:gap-1">
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
                      <div className="w-32 h-5 bg-gray-300 opacity-50 rounded mb-1"></div>
                      <div className="w-36 h-4 bg-gray-300 opacity-50 rounded"></div>
                    </>
                  ) : (
                    <>
                      {destination_address?.name && (
                        <p className="font-bold text-lg">
                          {destination_address?.name}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm flex flex-col sm:flex-row sm:gap-1">
                        <span>{arrival.time ? arrival.time : ""}</span>
                        <span>{arrival.date ? arrival.date : ""}</span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-800 mb-4">
                {loading ? (
                  <div className="w-24 h-5 bg-gray-300 opacity-50 rounded"></div>
                ) : (
                  "TAXI DETAILS"
                )}
              </p>

              <div className="flex flex-col md:flex-row gap-4">
                <div
                  className="w-full md:w-auto border border-gray-200 rounded-lg  flex justify-center items-center"
                  style={{ height: "140px" }}
                >
                  {loading ? (
                    <div className="w-full h-full bg-gray-300 opacity-50 rounded"></div>
                  ) : (
                    <div className="w-full md:w-[180px] h-[140px] relative flex justify-center items-center">
                      {data?.transfer_details?.quote?.taxi_category?.image ? (
                        <ImageLoader
                          url={
                            data?.transfer_details?.quote?.taxi_category?.image
                          }
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <FaTaxi className="w-16 h-16 text-gray-400" />
                      )}
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
                          ) : (
                            model ? model : "NA"
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
                            fuelType ? fuelType : "NA"
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
                            luggageBags ? luggageBags : "NA"
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
                            seatCapacity ? seatCapacity : "NA"
                          )}
                        </p>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Booking Button (Fixed) */}
        {handleDelete && type !== "combo" && (
          <div className="p-4 bg-white">
            <button
              className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center"
              onClick={() => handleDelete(booking)}
              disabled={loading}
            >
              <div style={{ position: "relative" }}>
                <div
                  className="flex gap-1 items-center text-white"
                  style={loading ? { visibility: "hidden" } : {}}
                >
                  <Image
                    src="/delete.svg"
                    width={20}
                    height={20}
                    alt="Delete icon"
                  />
                  <div>Delete Booking</div>
                </div>
                {loading && (
                  <PulseLoader
                    style={{
                      position: "absolute",
                      top: "55%",
                      left: "50%",
                      transform: "translate(-50% , -50%)",
                    }}
                    size={12}
                    speedMultiplier={0.6}
                    color="#ffffff"
                  />
                )}
              </div>
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
