import React from "react";
import ImageLoader from "../../ImageLoader";
import BookingDetailHeader from "../../revamp/common/components/BookingDetailHeader";
import BookingDetailActions from "../../revamp/common/components/BookingDetailActions";
import ComboTaxi from "../taxis/ComboTaxi";
import { useState } from "react";
import { FaTaxi } from "react-icons/fa";
import {
  getVehicleCount,
  MultiVehicleNote,
  VehicleCountBadge,
} from "../taxis/MultiVehicleInfo";

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

   let isPageWide =
     typeof window !== "undefined" &&
     window.matchMedia("(min-width: 768px)")?.matches;
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
  const [deleting, setDeleting] = useState(false);

  const onDeleteClick = async () => {
    if (deleting) return;
    try {
      setDeleting(true);
      await handleDelete(booking || data);
    } finally {
      setDeleting(false);
    }
  };

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

  // >1 when the group did not fit in one cab, so the booking covers a convoy.
  // Every spec below (seats, bags, fuel) describes a single cab in that case.
  const vehicleCount = getVehicleCount(data);
  const travellerCount =
    (number_of_adults || 0) +
    (number_of_children || 0) +
    (data?.number_of_infants || 0);

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

  const title =
    data?.name ||
    `Taxi from ${data?.transfer_details?.trips?.[0]?.origin?.address} to ${data?.transfer_details?.trips?.[0]?.destination?.address}`;

  const handleChangeTransfer = () => {
    if (isAirport) {
      setIsTransferDrawerOpen(true);
      return;
    }
    handleEditRoute(data);
  };

  const canChange = !isEmbedded && !noChange;
  const canDelete = !!handleDelete && type !== "combo";

  return !showTaxi ? (
    <>
      <div className=" bg-white w-full h-full flex flex-col">
        {!isEmbedded ? (
          <BookingDetailHeader
            title={title}
            loading={loading}
            onBack={handleClose}
            className="px-4"
          />
        ) : (
          !noHeading && (
            <div className="px-4">
              <h1 className="ttw-type-h4 font-600 text-[#1a2436]">
                {loading ? (
                  <div className="w-64 h-7 bg-[#ececec] opacity-50 rounded"></div>
                ) : (
                  title
                )}
              </h1>
            </div>
          )
        )}

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
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <p className="font-semibold text-[#0b1220] mb-0">
                  {loading ? (
                    <div className="w-24 h-5 bg-[#ececec] opacity-50 rounded"></div>
                  ) : (
                    "TAXI DETAILS"
                  )}
                </p>
                {!loading && <VehicleCountBadge count={vehicleCount} />}
              </div>

              {!loading && (
                <MultiVehicleNote count={vehicleCount} className="mb-4">
                  This booking includes {vehicleCount} taxis
                  {travellerCount > 0
                    ? ` for your ${travellerCount} traveller${
                        travellerCount > 1 ? "s" : ""
                      }`
                    : ""}
                  {seatCapacity
                    ? ` — one ${seatCapacity}-seater cannot fit everyone`
                    : ""}
                  . The details below describe a single taxi.
                </MultiVehicleNote>
              )}

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
                        <p className="text-[#445069] text-sm">
                          Luggage Bags{vehicleCount > 1 ? " (per taxi)" : ""}
                        </p>
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
                        <p className="text-[#445069] text-sm">
                          Seat Capacity{vehicleCount > 1 ? " (per taxi)" : ""}
                        </p>
                        <p className="font-semibold text-[#0b1220]">
                          {loading ? (
                            <div className="w-24 h-5 bg-[#ececec] opacity-50 rounded"></div>
                          ) : (
                            seatCapacity ? seatCapacity : "NA"
                          )}
                        </p>
                      </div>
                    }

                    {/* Convoy size — only when the group needed more than one cab */}
                    {!loading && vehicleCount > 1 && (
                      <div>
                        <p className="text-[#445069] text-sm">Taxis Booked</p>
                        <p className="font-semibold text-[#0b1220]">
                          {vehicleCount}
                        </p>
                      </div>
                    )}

                    {!loading && vehicleCount > 1 && seatCapacity && (
                      <div>
                        <p className="text-[#445069] text-sm">Total Seats</p>
                        <p className="font-semibold text-[#0b1220]">
                          {seatCapacity * vehicleCount}
                        </p>
                      </div>
                    )}
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

        {/* Delete (left) + Change (right) — pinned action bar */}
        {!isEmbedded && (canDelete || canChange) && (
          <div className="p-4 bg-white sticky bottom-0 z-10 border-t border-[#ececec]">
            <BookingDetailActions
              onDelete={canDelete ? onDeleteClick : undefined}
              deleting={deleting}
              deleteDisabled={loading}
              confirmItemLabel="transfer"
              onChange={canChange ? handleChangeTransfer : undefined}
              changeLabel="Change Transfer"
              changeDisabled={loading}
            />
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