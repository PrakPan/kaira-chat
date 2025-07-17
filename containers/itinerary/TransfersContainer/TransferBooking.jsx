import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TransportIconFetcher } from "../../../helper/TransportIconFetcher";
import ImageLoader from "../../../components/ImageLoader";
import useMediaQuery from "../../../components/media";
import media from "../../../components/media";
import { connect, useSelector } from "react-redux";
import { openNotification } from "../../../store/actions/notification";
import FlightLogoContainer from "../../../components/modals/flights/new-flight-searched/LogoContainer";
import FlightDetails from "../../../components/modals/flights/new-flight-searched/FlightDetails";
import { useRouter } from "next/router";
import { getModeIcon } from "../../../components/drawers/routeTransfer/TransferEditDrawer";
import { FaPlaneDeparture } from "react-icons/fa";
import PickupDropDrawer from "../PickupDropDrawer";

const LineContainer = styled.div`
  position: absolute;
  top: 0;
  left: 11px;
  bottom: 0;
  right: -25px;
  width: 1px;
  z-index: -1;
  display: flex;
  flex-direction: column;
`;

const HalfLine = styled.div`
  flex: ${(props) => props.flex || 1};
  width: 100%;
  background-image: repeating-linear-gradient(
    to bottom,
    ${(props) => props.color || "black"},
    ${(props) => props.color || "black"} 4px,
    transparent 4px,
    transparent 8px
  );
  background-repeat: repeat-y;
`;

const Container = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 30px auto;
  min-height: 5rem;
  @media screen and (min-width: 768px) {
    min-height: 8rem;
  }
`;

const ComboContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 30px auto;
  min-height: 5rem;
  @media screen and (min-width: 768px) {
    min-height: 8rem;
  }
`;

const TransferBooking = ({
  booking,
  payment,
  origin,
  destination,
  Transfer,
  oCityData,
  dCityData,
  mercuryItinerary,
  pinColour1,
  pinColour2,
  isIntracity,
  isAirport,
  booking_id,
}) => {

  console.log("BKing",booking);
  const router = useRouter();
  let isPageWide = media("(min-width: 768px)");
  const isDesktop = useMediaQuery("(min-width:1024px)");
  const [addbooking, setaddboking] = useState(booking?.user_selected);
  const { transfers_status } = useSelector((state) => state.ItineraryStatus);

  useEffect(() => {
    setaddboking(booking?.user_selected);
  }, [booking?.user_selected]);

  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.slice(0, maxLength - 3) + "...";
    }
    return str;
  }

  const handleAddTransfer = () => {
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
  };

  const handleRoute = () => {
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer:
            "show" +
            (booking?.booking_type?.includes(",")
              ? `combo`
              : booking?.booking_type) +
            "Detail",
          bookingId: booking?.id,
        },
      },
      undefined,
      {
        scroll: false,
      }
    );
  };

  return (
    <>
      {transfers_status === "PENDING" && mercuryItinerary ? (
        <div className="mt-2 ml-1 md:ml-7 flex flex-col w-full">
          {/* Booking name */}
          <div className="flex flex-row w-full justify-between items-center">
            <div className="w-[8rem] h-3 bg-gray-300 rounded-md animate-pulse" />
            <div className="flex flex-row gap-2 justify-center items-center">
              {/* Placeholder for additional info */}
            </div>
          </div>

          {/* Booking Details */}
          <div
            className={`mb-1 mt-2 w-[51vw] flex flex-col lg:flex-row lg:items-center space-y-1 items-start justify-between py-[15px] cursor-pointer relative shadow-sm rounded-2xl transition-all border-[1px] hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA] hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-1 p-1`}
          >
            <div className="flex flex-row items-center justify-between gap-1">
              {/* Image Placeholder */}
              <div className="grid place-items-center lg:min-w-[6rem] min-w-[4rem] lg:min-h-[6rem] min-h-[4rem] rounded-2xl">
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
              </div>

              {/* Details */}
              <div className="flex flex-col lg:w-full">
                {/* Title Placeholder */}
                <div className="w-full h-4 bg-gray-300 rounded-md animate-pulse mb-2" />
                <div className="w-3/4 h-4 bg-gray-300 rounded-md animate-pulse" />
                {/* Duration Placeholder */}
                <div className="w-5/6 h-3 bg-gray-300 rounded-md animate-pulse mt-2" />

                {/* Facilities Placeholder */}
                <div className="w-3/4 h-3 bg-gray-300 rounded-md animate-pulse mt-1" />
              </div>
            </div>

            <div className="w-full flex flex-row items-center justify-end cursor-pointer ">
              <div className="w-32 h-6 bg-gray-300 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      ) : booking?.transfer_type !== "combo" ? (
        booking?.id ? (
          <Container>
            <div className="relative">
              <LineContainer>
                <HalfLine Transfers={Transfer} color={pinColour1} flex={9} />
                <HalfLine Transfers={Transfer} color={pinColour2} flex={1} />
              </LineContainer>
            </div>
            <>
              {booking?.booking_type === "Flight" ? (
                <>
                  <div className="absolute w-[20px] border border-black ml-4 mt-[27px]"></div>
                  <FlightBooking
                    booking={booking}
                    booking_id={booking_id}
                    booking_type={
                      booking?.booking_type
                    }
                  />
                </>
              ) : (
                <>
                  <div className="absolute w-[20px] border border-black ml-4 mt-[27px]"></div>
                  <div className="mt-3 ml-1 md:ml-7 flex flex-col w-full">
                    <div className=" w-full items-center">
                      <div className="font-medium text-[15px] flex items-center gap-2">
                        <div className="text-[#C5C1C1]">
                          {getModeIcon(booking?.booking_type, 15)}
                        </div>
                        {isIntracity ? (
                          booking?.transfer_type == "sightseeing" ? (
                            booking?.name
                          ) : (booking?.transfer_details?.source?.name ||
                              booking?.transfer_details?.source?.city_name) &&
                            (booking?.transfer_details?.destination?.name ||
                              booking?.transfer_details?.destination
                                ?.city_name) ? (
                            <>
                              {booking?.booking_type} in{" "}
                              {booking?.transfer_details?.source?.name ||
                                booking?.transfer_details?.source?.city_name}
                            </>
                          ) : (
                            <>
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7 9L6.3 8.275L8.075 6.5H2V5.5H8.075L6.3 3.725L7 3L10 6L7 9Z"
                                  fill="#1F1F1F"
                                />
                              </svg>{" "}
                              {booking?.name}
                            </>
                          )
                        ) : isAirport ? (
                          booking?.name
                        ) : (booking?.transfer_details?.source?.name ||
                            booking?.transfer_details?.source?.city_name) &&
                          (booking?.transfer_details?.destination?.name ||
                            booking?.transfer_details?.destination
                              ?.city_name) ? (
                          <>
                            {booking?.transfer_details?.source?.name ||
                              booking?.transfer_details?.source?.city_name}{" "}
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7 9L6.3 8.275L8.075 6.5H2V5.5H8.075L6.3 3.725L7 3L10 6L7 9Z"
                                fill="#1F1F1F"
                              />
                            </svg>{" "}
                            {booking?.transfer_details?.destination?.name ||
                              booking?.transfer_details?.destination?.city_name}
                          </>
                        ) : (
                          <>{booking?.name}</>
                        )}
                      </div>
                      <div className="text-[10px] ml-[20px]">
                        Duration: {booking?.duration}
                      </div>
                    </div>

                    <>
                      <div
                        id={booking?.id}
                        className={`mb-2 mt-3 w-full flex flex-col lg:flex-row lg:items-center space-y-3 items-start justify-between py-[30px] cursor-pointer relative shadow-sm rounded-2xl transition-all border-[1px] hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-3 p-2 ${
                          !isPageWide ? "w-full" : "max-w-[54vw]"
                        }`}
                      >
                        <div className="flex flex-row items-start md:items-center justify-between gap-1 w-full">
                          <div className="grid place-items-center md:min-w-[6rem] min-w-[4rem] lg:min-h-[6rem] min-h-[4rem] rounded-2xl">
                            {booking?.booking_type === "Taxi" ? (
                              <>
                                {booking?.transfer_details?.quote?.taxi_category
                                  ?.image ? (
                                  <ImageLoader
                                    className="object-contain border rounded-[11px]"
                                    url={
                                      booking?.transfer_details?.quote
                                        ?.taxi_category?.image
                                    }
                                    leftalign
                                    height={
                                      booking?.image?.includes("gozo")
                                        ? "3rem"
                                        : "4rem"
                                    }
                                    //  width={"4rem"}
                                    //  widthmobile="4rem"
                                    // onfail={handleTransferImageFailed}
                                  />
                                ) : (
                                  <div className="bg-[#D9D9D9] mr-[0.8rem] rounded-[11px] p-[10px]">
                                    <TransportIconFetcher
                                      TransportMode={booking?.booking_type}
                                      Instyle={{
                                        fontSize: "2.75rem",
                                      }}
                                      classname={" h-[34px] w-[34px]"}
                                      color="#000000"
                                    />
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="bg-[#D9D9D9] mr-[0.8rem] rounded-[11px] p-[10px]">
                                <TransportIconFetcher
                                  TransportMode={booking?.booking_type}
                                  Instyle={{
                                    fontSize: "2.75rem",
                                  }}
                                  classname={" h-[34px] w-[34px]"}
                                  color="#000000"
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col md:flex-row justify-between items-center w-full">
                            <div className="flex flex-col  w-full">
                              <div className="text-[16px] font-medium w-full">
                                <>{booking?.name}</>
                              </div>
                              <div className="flex sm:text-sm text-[14px]  flex-row text-[#7A7A7A] font-light items-center">
                                <>{booking?.type}</>
                              </div>

                              {isPageWide && booking?.transfer_details && (
                                <div className="text-[#01202B] font-normal flex  justify-start items-center mt-1 flex-wrap">
                                  <span className="pr-1 sm:text-sm text-[0.82rem]">
                                    Facilities:
                                  </span>
                                  <span className="flex items-center gap-1">
                                    {(() => {
                                      const details = [];

                                      const seatingCapacity =
                                        booking?.transfer_details?.quote
                                          ?.taxi_category?.seating_capacity ??
                                        booking?.number_of_adults +
                                          booking?.number_of_children +
                                          booking?.number_of_infants;

                                      if (seatingCapacity) {
                                        details.push(
                                          <span
                                            key="seater"
                                            className="sm:text-sm text-[0.74rem] font-normal"
                                          >
                                            {seatingCapacity} Seat
                                            {seatingCapacity > 1 ? "s" : ""}
                                          </span>
                                        );
                                      }

                                      const bagCapacity =
                                        booking?.transfer_details?.quote
                                          ?.taxi_category?.bag_capacity;
                                      if (bagCapacity > 0) {
                                        details.push(
                                          <span
                                            key="bags"
                                            className="sm:text-sm text-[0.74rem] font-normal"
                                          >
                                            {bagCapacity} Luggage bags
                                          </span>
                                        );
                                      }

                                      const fuelType =
                                        booking?.transfer_details?.quote
                                          ?.taxi_category?.fuel_type;
                                      if (fuelType) {
                                        details.push(
                                          <span
                                            key="fuel"
                                            className="sm:text-sm text-[0.74rem] font-normal"
                                          >
                                            Fuel Type: {fuelType}
                                          </span>
                                        );
                                      }

                                      return details.map((item, index) => (
                                        <React.Fragment key={index}>
                                          {item}
                                          {index !== details.length - 1 && (
                                            <span className="sm:text-sm text-[0.74rem] font-normal mx-1">
                                              |
                                            </span>
                                          )}
                                        </React.Fragment>
                                      ));
                                    })()}
                                  </span>
                                </div>
                              )}
                            </div>

                            {!payment?.paid_user && (
                              <>
                                <div className="pr-2">
                                  <button
                                    onClick={()=>handleRoute(booking)}
                                    className="hidden md:!block w-fit text-[12px] font-semibold border-1 border-black hover:bg-black hover:text-white rounded-lg px-3 py-2 text-nowrap"
                                  >
                                    View Details
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        {!isPageWide && booking?.transfer_details && (
                          <div className="text-[#01202B] font-normal flex items-center justify-center mt-1 sm:text-sm text-[0.82rem]">
                            <span className="pr-1">Facilities:</span>
                            <div className="flex flex-wrap  gap-x-2 gap-y-1 ">
                              {(() => {
                                const details = [];

                                const seatingCapacity =
                                  booking?.transfer_details?.quote
                                    ?.taxi_category?.seating_capacity ??
                                  booking?.number_of_adults +
                                    booking?.number_of_children +
                                    booking?.number_of_infants;

                                if (seatingCapacity) {
                                  details.push(
                                    `${seatingCapacity} Seat${
                                      seatingCapacity > 1 ? "s" : ""
                                    }`
                                  );
                                }

                                const bagCapacity =
                                  booking?.transfer_details?.quote
                                    ?.taxi_category?.bag_capacity;
                                if (bagCapacity > 0) {
                                  details.push(
                                    `${bagCapacity} Luggage bag${
                                      bagCapacity > 1 ? "s" : ""
                                    }`
                                  );
                                }

                                const fuelType =
                                  booking?.transfer_details?.quote
                                    ?.taxi_category?.fuel_type;
                                if (fuelType) {
                                  details.push(`Fuel: ${fuelType}`);
                                }

                                return details.map((text, index) => (
                                  <span
                                    key={index}
                                    className="sm:text-sm text-[0.74rem] font-normal flex items-center"
                                  >
                                    {text}
                                    {index !== details.length - 1 && (
                                      <span className="mx-1 text-[#666]">
                                        |
                                      </span>
                                    )}
                                  </span>
                                ));
                              })()}
                            </div>
                          </div>
                        )}

                        <div className="md:hidden w-full">
                          {!payment?.paid_user && (
                            <>
                              <div className="pr-2 w-full">
                                <button
                                  onClick={()=>handleRoute(booking)}
                                  className="md:hidden mt-2 w-full text-[12px] font-semibold border-1 border-black hover:bg-black hover:text-white rounded-lg px-3 py-2 text-nowrap"
                                >
                                  View Details
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </>

                    {/* <PickupDropDrawer
                      isOpen={isTransferDrawerOpen}
                      trips={vehicleDetails?.transfer_details?.trips}
                      loading={loading}
                      bookingMode={booking?.booking_type?.toLowerCase()}
                      // hotelName={hotelName}
                      // destinationHotelName={destinationHotelName}
                      booking_id={vehicleDetails?.id}
                      booking={vehicleDetails}
                      onClose={() => {
                        setIsTransferDrawerOpen(false);
                      }}
                      transferType={AirportTransferType}
                      // bookingMode={vehicleDetails?.booking_type?.toLowerCase()}
                      // originCityName={origin_city_name}
                      // destinationCityName={destination_city_name}
                      onSubmit={handleTransferSubmit}
                      // existingBooking={selectedTransferBooking}
                      // show={pickupDropShow}
                      // setHandleShow={setPickupDropShow}
                      _updateFlightBookingHandler={_updateFlightBookingHandler}
                      _updatePaymentHandler={_updatePaymentHandler}
                      getPaymentHandler={getPaymentHandler}
                      setShowLoginModal={setShowLoginModal}
                      // city={origin_city_name}
                      // dcity={destination_city_name}
                      _updateTaxiBookingHandler={_updateTaxiBookingHandler}
                      selectedBooking={selectedBooking}
                      setSelectedBooking={setSelectedBooking}
                      originCityId={
                        oCityData?.city?.id || oCityData?.gmaps_place_id
                      }
                      destinationCityId={
                        dCityData?.city?.id || dCityData?.gmaps_place_id
                      }
                      origin_itinerary_city_id={
                        oCityData?.id || oCityData?.gmaps_place_id
                      }
                      destination_itinerary_city_id={
                        dCityData?.id || dCityData?.gmaps_place_id
                      }
                    /> */}

                    {/* {showVehicleDrawer && (
                      <TransferDrawer
                        show={showVehicleDrawer}
                        setIsTransferDrawerOpen={setIsTransferDrawerOpen}
                        // error={error}
                        setHandleShow={setShowVehicleDrawer}
                        data={vehicleDetails}
                        booking_type={vehicleDetails?.booking_type}
                        loading={loading}
                        handleDelete={handleDelete}
                        setShowDrawer={setShowDrawer}
                        // city={city}
                        _updateFlightBookingHandler={
                          _updateFlightBookingHandler
                        }
                        _updatePaymentHandler={_updatePaymentHandler}
                        getPaymentHandler={getPaymentHandler}
                        oCityData={oCityData}
                        dCityData={dCityData}
                        setShowLoginModal={setShowLoginModal}
                        // dcity={destination_city_name}
                        selectedBooking={selectedBooking}
                        setSelectedBooking={setSelectedBooking}
                        originCityId={
                          oCityData?.city?.id || oCityData?.gmaps_place_id
                        }
                        destinationCityId={
                          dCityData?.city?.id || dCityData?.gmaps_place_id
                        }
                        origin_itinerary_city_id={
                          oCityData?.id || oCityData?.gmaps_place_id
                        }
                        destination_itinerary_city_id={
                          dCityData?.id || dCityData?.gmaps_place_id
                        }
                        // isIntracity={isIntracity}
                        booking_id={vehicleDetails?.booking_id}
                        isAirport={isAirport}
                        AirportTransferType={AirportTransferType}
                      />
                    )} */}

                    {/* <Drawer
                      show={showVehicleDrawer}
                      anchor="right"
                      mobileWidth="100vw"
                      width="50vw"
                      style={1503}
                      className="font-lexend"
                      onHide={() => setShowVehicleDrawer(false)}
                    >
                      {loading || !vehicleDetails ? (
                        <VehicleDetailLoader
                          setHandleShow={setShowVehicleDrawer}
                        />
                      ) : vehicleDetails?.booking_type?.toLowerCase() ===
                          "taxi" ||
                        vehicleDetails?.transfer_details?.mode === "taxi" ? (
                        <TaxiDetailModal
                          data={vehicleDetails}
                          loading={loading}
                          setIsOpen={setShowVehicleDrawer}
                          handleDelete={handleDelete}
                          setHandleShow={setShowVehicleDrawer}
                          booking={booking}
                          setShowDrawer={setShowDrawer}
                          noChange={isIntracity || isAirport}
                        />
                      ) : (
                        <VehicleDetailModal
                          data={vehicleDetails}
                          loading={loading}
                          setIsOpen={setShowVehicleDrawer}
                          handleDelete={handleDelete}
                          setHandleShow={setShowVehicleDrawer}
                          booking={booking}
                          setShowDrawer={setShowDrawer}
                          noChange={isIntracity || isAirport}
                        />
                      )}
                     {!isPageWide && (
                          <FloatingView>
                            <TbArrowBack
                              style={{ height: "28px", width: "28px" }}
                              cursor={"pointer"}
                              onClick={() => setShowVehicleDrawer(false)}
                            />
                          </FloatingView>
                        )}
                    </Drawer> */}
                  </div>
                </>
              )}
            </>
          </Container>
        ) : (
          <div
            className={`grid w-full grid-cols-[30px_120px] min-h-[5rem] md:min-h-[8rem] ${
              isAirport ? "hidden" : ""
            }`}
          >
            <div className="relative">
              <LineContainer>
                <HalfLine Transfers={Transfer} color={pinColour1} flex={8} />
                <HalfLine Transfers={Transfer} color={pinColour2} flex={2} />
              </LineContainer>
            </div>
            {isPageWide ? (
              <button
                onClick={handleAddTransfer}
                className="text-[14px] font-[600] leading-[60px] text-blue hover:underline w-full whitespace-nowrap"
              >
                + Add Transfer from {origin?.name || origin?.city_name} to{" "}
                {destination?.name || destination?.city_name}
              </button>
            ) : (
              <button
                onClick={handleAddTransfer}
                className="text-[14px] font-[600] leading-[60px] text-blue hover:underline w-full whitespace-nowrap"
              >
                + Add Transfer
              </button>
            )}
          </div>
        )
      ) : (
        <>
          {booking?.children?.map((book, index) => (
            <ComboContainer>
              <div className="relative">
                <LineContainer>
                  <HalfLine Transfers={Transfer} color={"#000000"} />
                  <HalfLine Transfers={Transfer} color={"#000000"} />
                </LineContainer>
              </div>
              {book?.booking_type === "Flight" ? (
                <>
                  <div className="absolute w-[20px] border border-black ml-4 mt-[27px]"></div>
                  <FlightBooking
                    booking={book}
                    booking_id={booking?.id}
                    type={booking?.booking_type}
                    booking_type={
                      booking?.booking_type
                    }
                  />
                </>
              ) : (
                <>
                  <div className="absolute w-[20px] border border-black ml-4 mt-[28px]"></div>
                  <div
                    key={index}
                    className="mt-3 ml-1 md:ml-7 flex flex-col w-full"
                  >
                    <div className=" w-full items-center">
                      <div className="font-medium text-[15px]  inline flex items-center gap-2">
                        <div className="text-[#C5C1C1]">
                          {getModeIcon(book?.booking_type, 15)}
                        </div>
                        {isIntracity ? (
                          book?.transfer_type == "sightseeing" ? (
                            book?.name
                          ) : (
                            (book?.transfer_details?.source?.name ||
                              book?.transfer_details?.source?.city_name) &&
                            (book?.transfer_details?.destination?.name ||
                              book?.transfer_details?.destination
                                ?.city_name) && (
                              <>
                                {book?.booking_type} in{" "}
                                {book?.transfer_details?.source?.name ||
                                  book?.transfer_details?.source?.city_name}
                              </>
                            )
                          )
                        ) : isAirport ? (
                          <>
                            {book?.name}
                            {/* Airport {AirportTransferType} in{" "}
                          {book?.transfer_details?.source?.name || book?.transfer_details?.source?.city_name} */}
                          </>
                        ) : (book?.transfer_details?.source?.name ||
                            book?.transfer_details?.source?.city_name) &&
                          (book?.transfer_details?.destination?.name ||
                            book?.transfer_details?.destination?.city_name) ? (
                          <>
                            {book?.transfer_details?.source?.name ||
                              book?.transfer_details?.source?.city_name}{" "}
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7 9L6.3 8.275L8.075 6.5H2V5.5H8.075L6.3 3.725L7 3L10 6L7 9Z"
                                fill="#1F1F1F"
                              />
                            </svg>{" "}
                            {book?.transfer_details?.destination?.name ||
                              book?.transfer_details?.destination?.city_name}
                          </>
                        ) : (
                          <>{book?.name}</>
                        )}
                      </div>
                      <div className="text-[10px] ml-[20px]">
                        Duration: {book?.duration}
                      </div>
                    </div>

                    <div
                      id={book?.id}
                      className={`mb-2 mt-3 w-full flex flex-col lg:flex-row lg:items-center space-y-3 items-start justify-between py-[30px] cursor-pointer relative shadow-sm rounded-2xl transition-all border-[1px] hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-3 p-2 ${
                        !isPageWide ? "w-full" : "max-w-[54vw]"
                      }`}
                    >
                      <div className="flex flex-row items-center justify-between gap-1 w-full">
                        <div className="grid place-items-center lg:min-w-[6rem] min-w-[4rem] lg:min-h-[6rem] min-h-[4rem] rounded-2xl">
                          {book?.booking_type === "Taxi" ? (
                            <ImageLoader
                              className="object-contain border rounded-[11px]"
                              url={
                                book?.transfer_details?.quote?.taxi_category
                                  ?.image
                              }
                              leftalign
                              height={
                                book?.image?.includes("gozo") ? "3rem" : "4rem"
                              }
                              // onfail={handleTransferImageFailed}
                            />
                          ) : (
                            <div className="bg-[#D9D9D9] mr-[0.8rem] rounded-[11px] p-[10px]">
                              <TransportIconFetcher
                                TransportMode={book?.booking_type}
                                Instyle={{
                                  fontSize: "2.75rem",
                                }}
                                classname={" h-[34px] w-[34px]"}
                                color="#000000"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <div className="flex flex-col  w-full">
                            <div className="text-[16px] font-medium w-full">
                              {book?.booking_type == "Taxi" ? (
                                book?.transfer_details &&
                                book?.transfer_details.gozo &&
                                book?.transfer_details.gozo.model ? (
                                  isPageWide ? (
                                    book?.transfer_details.gozo.model
                                  ) : (
                                    truncateString(
                                      book?.transfer_details.gozo.model,
                                      25
                                    )
                                  )
                                ) : (
                                  <div className="w-full">{book?.name}</div>
                                )
                              ) : (
                                <>{book?.name}</>
                              )}
                            </div>
                            <div className="flex sm:text-sm text-[14px]  flex-row text-[#7A7A7A] font-light items-center">
                              {book?.booking_type == "Taxi" ? (
                                <>
                                  {book?.transfer_details?.quote?.taxi_category
                                    ?.type && (
                                    <div>
                                      {book?.transfer_details?.quote
                                        ?.taxi_category?.model_name ||
                                        book?.transfer_details?.quote
                                          ?.taxi_category?.model_name}{" "}
                                      &nbsp;
                                      {"("}
                                      {book?.type}
                                      {")"}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <>{book?.type}</>
                              )}
                            </div>

                            {isPageWide && book?.transfer_details && (
                              <div className="text-[#01202B] font-normal flex  justify-start items-center mt-1 flex-wrap">
                                <span className="pr-1 sm:text-sm text-[0.82rem]">
                                  Facilities:
                                </span>
                                <span className="flex items-center gap-1">
                                  {(() => {
                                    const details = [];

                                    const seatingCapacity =
                                      book?.transfer_details?.quote
                                        ?.taxi_category?.seating_capacity ??
                                      book?.number_of_adults +
                                        book?.number_of_children +
                                        book?.number_of_infants;

                                    if (seatingCapacity) {
                                      details.push(
                                        <span
                                          key="seater"
                                          className="sm:text-sm text-[0.74rem] font-normal"
                                        >
                                          {seatingCapacity} Seat
                                          {seatingCapacity > 1 ? "s" : ""}
                                        </span>
                                      );
                                    }

                                    const bagCapacity =
                                      book?.transfer_details?.quote
                                        ?.taxi_category?.bag_capacity;
                                    if (bagCapacity > 0) {
                                      details.push(
                                        <span
                                          key="bags"
                                          className="sm:text-sm text-[0.74rem] font-normal"
                                        >
                                          {bagCapacity} Luggage bags
                                        </span>
                                      );
                                    }

                                    const fuelType =
                                      book?.transfer_details?.quote
                                        ?.taxi_category?.fuel_type;
                                    if (fuelType) {
                                      details.push(
                                        <span
                                          key="fuel"
                                          className="sm:text-sm text-[0.74rem] font-normal"
                                        >
                                          Fuel Type: {fuelType}
                                        </span>
                                      );
                                    }

                                    return details.map((item, index) => (
                                      <React.Fragment key={index}>
                                        {item}
                                        {index !== details.length - 1 && (
                                          <span className="sm:text-sm text-[0.74rem] font-normal mx-1">
                                            |
                                          </span>
                                        )}
                                      </React.Fragment>
                                    ));
                                  })()}
                                </span>
                              </div>
                            )}
                          </div>
                          {!payment?.paid_user && (
                            <div className="hidden md:!block">
                              {book?.booking_type === "Taxi" ? (
                                <div className=" flex flex-row items-center justify-end cursor-pointer pr-2">
                                  {addbooking ? (
                                    <button
                                      onClick={()=>handleRoute(book)}
                                      className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[1.6rem] lg:py-2 md:py-2 py-[6px] bg-[#F7E700] hover:text-white hover:bg-black"
                                    >
                                      {isDesktop ? "Change Taxi" : "Change"}
                                    </button>
                                  ) : (
                                    <button
                                      onClick={()=>handleRoute(book)}
                                      className=" w-fit text-[12px] font-semibold border-1 border-black hover:bg-black hover:text-white rounded-lg px-3 py-2 text-nowrap"
                                    >
                                      {/* Add Taxi */}
                                      View Details
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div className="pr-2">
                                  <button
                                    onClick={()=>handleRoute(book)}
                                    className=" w-fit text-[12px] font-semibold border-1 border-black hover:bg-black hover:text-white rounded-lg px-3 py-2 text-nowrap"
                                  >
                                    {/* Add Taxi */}
                                    View Details
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      {!isPageWide && book?.transfer_details && (
                        <div className="text-[#01202B] font-normal flex flex-col mt-1 sm:text-sm text-[0.82rem]">
                          <span className="pr-1">Facilities:</span>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                            {(() => {
                              const details = [];

                              const seatingCapacity =
                                book?.transfer_details?.quote?.taxi_category
                                  ?.seating_capacity ??
                                book?.number_of_adults +
                                  book?.number_of_children +
                                  book?.number_of_infants;

                              if (seatingCapacity) {
                                details.push(
                                  `${seatingCapacity} Seat${
                                    seatingCapacity > 1 ? "s" : ""
                                  }`
                                );
                              }

                              const bagCapacity =
                                book?.transfer_details?.quote?.taxi_category
                                  ?.bag_capacity;
                              if (bagCapacity > 0) {
                                details.push(
                                  `${bagCapacity} Luggage bag${
                                    bagCapacity > 1 ? "s" : ""
                                  }`
                                );
                              }

                              const fuelType =
                                book?.transfer_details?.quote?.taxi_category
                                  ?.fuel_type;
                              if (fuelType) {
                                details.push(`Fuel: ${fuelType}`);
                              }

                              return details.map((text, index) => (
                                <span
                                  key={index}
                                  className="sm:text-sm text-[0.74rem] font-normal flex items-center"
                                >
                                  {text}
                                  {index !== details.length - 1 && (
                                    <span className="mx-1 text-[#666]">|</span>
                                  )}
                                </span>
                              ));
                            })()}
                          </div>
                        </div>
                      )}
                      <div className="md:hidden w-full">
                        {!payment?.paid_user && (
                          <>
                            <div className="pr-2 w-full">
                              <button
                                onClick={()=>handleRoute(book)}
                                className="md:hidden mt-2 w-full text-[12px] font-semibold border-1 border-black hover:bg-black hover:text-white rounded-lg px-3 py-2 text-nowrap"
                              >
                                View Details
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </ComboContainer>
          ))}
        </>
      )}
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    notificationText: state.Notification.text,
    plan: state.Plan,
    tripsPage: state.TripsPage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(TransferBooking);

const FlightBooking = ({ booking, type, booking_type, booking_id }) => {
  const router = useRouter();
  try {
    if (booking?.number_of_adults > 1) adult = " Adults";
    else adult = " Adult";
    if (booking?.number_of_children > 1) child = " Childs";
    else child = " Child";
  } catch {}

  const handleRoute = (book) => {
    console.log("booking id is:",book)
    router.push(
      {
        pathname: `/itinerary/${router.query.id}`,
        query: {
          drawer:
            "show" +
            (booking_type?.includes(",") ? `combo` : book?.booking_type) +
            "Detail",
          bookingId: booking_id,
        },
      },
      undefined,
      {
        scroll: false,
      }
    );
  };

  return (
    <div className="mt-3 ml-1 md:ml-7 flex flex-col w-full items-center justify-center ">
      <div className=" w-full items-center">
        {booking?.transfer_details?.items[0]?.segments[0]?.origin?.city_name &&
          booking?.transfer_details?.items[0]?.segments[
            booking?.transfer_details?.items[0]?.segments?.length - 1
          ]?.destination?.city_name && (
            <>
              {" "}
              <div className="font-medium text-[15px]  inline flex items-center gap-1">
                <FaPlaneDeparture color="#C5C1C1" /> &nbsp;
                {booking?.transfer_details?.items[0]?.segments[0]?.origin
                  ?.city_name ||
                  booking?.transfer_details?.source?.city_name}{" "}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 9L6.3 8.275L8.075 6.5H2V5.5H8.075L6.3 3.725L7 3L10 6L7 9Z"
                    fill="#1F1F1F"
                  />
                </svg>{" "}
                {booking?.transfer_details?.items[0]?.segments[
                  booking?.transfer_details?.items[0]?.segments?.length - 1
                ]?.destination?.city_name ||
                  booking?.transfer_details?.destination?.city_name}
              </div>
              <div className="text-[10px] ml-[20px]">
                Duration: {booking?.duration}
              </div>{" "}
            </>
          )}
      </div>

      <div
        id={booking?.id}
        className={`mb-2 mt-2  w-full lg:block ${"mb-2 mt-2 lg:block flex flex-col p-3 "} cursor-pointer relative shadow-sm rounded-2xl transition-all  hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA] border-[1px]  hover:border-[#F7E700]  shadow-[#ECEAEA] lg:p-5 w-full`}
      >
        <div
          className={` w-full 
          `}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <FlightLogoContainer
                data={booking?.transfer_details?.items?.[0]}
                height={34}
                width={34}
              />
              <div className="text-xs font-semibold">
                {
                  booking?.transfer_details?.items?.[0]?.segments?.[0]?.airline
                    ?.name
                }
              </div>
            </div>

            {window.innerWidth >= 1000 && (
              <div>
                <button
                  onClick={()=>handleRoute(booking)}
                  className=" w-fit text-[12px] font-semibold border-1 border-black hover:bg-black hover:text-white rounded-lg px-3 py-2 text-nowrap"
                >
                  View Details
                </button>
              </div>
            )}
          </div>

          <div className="flex-grow">
            <FlightDetails
              data={booking?.transfer_details?.items?.[0]}
              origin={
                booking?.transfer_details?.items?.[0]?.segments[0]?.origin
              }
              destination={
                booking?.transfer_details?.items?.[0]?.segments[
                  booking?.transfer_details?.items?.[0]?.segments.length - 1
                ]?.destination
              }
              duration={booking?.duration}
              segments={booking?.transfer_details?.items?.[0]?.segments}
              numStops={booking?.transfer_details?.items?.[0]?.stop_count}
              handleRoute={handleRoute}
              type={type}
              booking={booking}
            />
          </div>
        </div>

        <div
          className={`flex ${
            window.innerWidth < 1000 ? "justify-between" : "justify-center"
          } items-center w-full`}
        >
          {window.innerWidth < 1000 && (
            <div className="flex justify-end mt-4 pr-2 w-full">
              <button
                onClick={()=>handleRoute(booking)}
                className="w-full md:w-fit text-[12px] font-semibold border-1 border-black hover:bg-black hover:text-white rounded-lg px-3 py-2 text-nowrap"
              >
                View Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
