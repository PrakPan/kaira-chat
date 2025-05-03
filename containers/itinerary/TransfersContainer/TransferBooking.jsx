import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TransportIconFetcher } from "../../../helper/TransportIconFetcher";
import ImageLoader from "../../../components/ImageLoader";
import useMediaQuery from "../../../components/media";
import media from "../../../components/media";
import { connect, useDispatch, useSelector } from "react-redux";
import { openNotification } from "../../../store/actions/notification";
import { logEvent } from "../../../services/ga/Index";
import FlightLogoContainer from "../../../components/modals/flights/new-flight-searched/LogoContainer";
import FlightDetails from "../../../components/modals/flights/new-flight-searched/FlightDetails";
import Drawer from "../../../components/ui/Drawer";
import { useRouter } from "next/router";
import TransferEditDrawer, {
  getModeIcon,
} from "../../../components/drawers/routeTransfer/TransferEditDrawer";
import Details from "./FlightDetail2";
import axios from "axios";
import { MERCURY_HOST } from "../../../services/constants";
import VehicleDetailModal from "../../../components/modals/daybyday/VehicleModal";
import TaxiDetailModal from "../../../components/modals/daybyday/TaxiDetailModal";
import { updateTransferBookings } from "../../../store/actions/transferBookingsStore";
import { axiosDeleteBooking } from "../../../services/itinerary/bookings";
import { FaPlaneDeparture } from "react-icons/fa";
import VehicleDetailLoader from "../../../components/modals/daybyday/VehicleDetailLoader";
const GridContainer = styled.div`
  width: auto;
  overflow: auto;
  display: flex;
  flex-direction: row;
  @media screen and (min-width: 768px) {
    width: auto;
    overflow: none;
  }
`;

var Line = styled.hr`
  background-image: linear-gradient(90deg, transparent 50%, #fff 60%, #fff 100%),
    ${(props) =>
      props.pinColour
        ? `linear-gradient(87deg, ${props.pinColour},${props.pinColour}, #000)`
        : `linear-gradient(87deg,  #f7e700,#0d6efd)`};

  background-size: 8px 3px, 100% 3px;

  color: #c80000;
  -webkit-transform: rotate(90deg);
  position: absolute;

  height: 1px;

  border: 2px;

  width: ${(props) => (props.Transfers ? `19rem` : `5rem`)};

  top: ${(props) => (props.Transfers ? `128px` : `23px`)};
  right: ${(props) => (props.Transfers ? `-134px` : `-25px`)};
  opacity: initial;
  z-index: -1;
  @media screen and (min-width: 768px) {
    width: 12.3rem;
    height: 1px;
    top: ${(props) => (props.end ? `1rem` : `5rem`)};
    right: -81px;
  }
`;

Line = styled.div`
  position: absolute;
  top: 0;
  left: 10px;
  bottom: 0;
  right: -25px;

  width: 2px;
  background-image: linear-gradient(
      to bottom,
      ${(props) => props.pinColour1 || "black"} 0%,
      ${(props) => props.pinColour1 || "black"} 50%,
      ${(props) => props.pinColour2 || "gray"} 50%,
      ${(props) => props.pinColour2 || "gray"} 100%
    ),
    repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 4px,
      black 4px,
      black 8px
    );
  background-blend-mode: src-in;

  z-index: -1;

  @media screen and (min-width: 768px) {
    right: -81px;
  }
`;

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

const Line2 = styled.hr`
  background-image: linear-gradient(90deg, transparent 50%, #fff 60%, #fff 100%),
    ${(props) =>
      props.pinColour
        ? `linear-gradient(87deg, ${props.pinColour},${props.pinColour}, #000)`
        : `linear-gradient(87deg,  #f7e700,#0d6efd)`};

  background-size: 8px 3px, 100% 3px;
  color: #c80000;
  -webkit-transform: rotate(90deg);
  position: absolute;
  height: 1px;
  border: 2px;
  width: ${(props) => (props?.Transfers ? `16rem` : `5rem`)};
  top: ${(props) => (props?.lastend ? `101px` : `23px`)};
  right: ${(props) => (props?.Transfers ? `-110px` : `-22px`)};
  opacity: initial;
  z-index: -1;
  @media screen and (min-width: 768px) {
    width: 8.4rem;
    height: 1px;
    top: 40px;
    right: -50px;
  }
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

const CITY_COLOR_CODES = [
  "#359EBF", // shade of blue
  "#F0C631", // shade of yellow
  "#BF3535", // shade of red
  "#47691e", // shade of green
  "#cc610a", // shade of orange
  "#008080", // shade of teal
  "#7d5e7d", // shade of purple
];

const TransferBooking = ({
  index,
  booking,
  plan,
  payment,
  token,
  tripsPage,
  notificationText,
  openNotification,
  setShowLoginModal,
  _changeTaxiHandler,
  _changeFlightHandler,
  origin,
  destination,
  id,
  check_in,
  end,
  Transfer,
  selectedBooking,
  setSelectedBooking,
  oCityData,
  dCityData,
  originCityId,
  destinationCityId,
  loadbookings,
  mercuryItinerary,
  pinColour1,
  pinColour2,
  _updateFlightBookingHandler,
  _updateTaxiBookingHandler,
  _updatePaymentHandler,
  getPaymentHandler,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  let isPageWide = media("(min-width: 768px)");
  const isDesktop = useMediaQuery("(min-width:1024px)");
  const [addbooking, setaddboking] = useState(booking?.user_selected);
  const [loading, setLoading] = useState(true);
  const [transferImageFailed, setTransferImageFailed] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showVehicleDrawer, setShowVehicleDrawer] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const { itinerary_status, transfers_status, pricing_status } = useSelector(
    (state) => state.ItineraryStatus
  );

  console.log("Originn Destin",origin,destination);
  useEffect(() => {
    setaddboking(booking?.user_selected);
  }, [booking?.user_selected]);

  const handleTransferImageFailed = () => {
    setTransferImageFailed(true);
  };

  function HandleTransport(book, label) {
    if (!token) {
      return setShowLoginModal(true);
    }
    let name = book["name"];
    let costings_breakdown = booking["transfer_details"];
    let cost = book?.transfer_details?.prices?.price;
    let itinerary_id = booking["itinerary_id"];
    let itinerary_name = book?.name;
    let tailored_id = booking["tailored_itinerary"];
    let id = book?.id;
    let check_in = book?.check_in;
    let check_out = book?.check_out;
    let pax = {
      number_of_adults: booking["number_of_adults"],
      number_of_children: booking["number_of_children"],
      number_of_infants: booking["number_of_infants"],
    };
    let city = booking["city"];
    let taxi_type = booking["taxi_type"];
    let transfer_type = booking["transfer_type"];
    let destination_city = booking["destination_address"]["shortName"];
    let origin_iata =
      booking?.transfer_details?.items?.[0]?.segments?.[0]?.origin?.city_code;
    let destination_iata =
      booking?.transfer_details?.items?.[0]?.segments?.[
        booking?.transfer_details?.items?.[0].segments?.length - 1
      ]?.destination?.city_code;
    let origin = booking["source_address"];
    let destination = booking["destination_address"];

    _changeTaxiHandler(
      name,
      itinerary_id,
      tailored_id,
      id,
      check_in,
      check_out,
      pax,
      city,
      itinerary_name,
      cost,
      costings_breakdown,
      origin_iata,
      destination_iata,
      destination_city,
      taxi_type,
      transfer_type,
      origin,
      destination,
      selectedBooking
    );

    logEvent({
      action: "Transfer_Add_Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: label,
        event_value: booking?.heading,
        event_action: "Transfers",
      },
    });
  }
  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.slice(0, maxLength - 3) + "...";
    }
    return str;
  }
  const handleViewDetails = async (itineraryId, id, mode) => {
    try {
      setLoading(true); 
      setVehicleDetails(null); 
      
      const res = await axios.get(
        `${MERCURY_HOST}/api/v1/itinerary/${itineraryId}/bookings/${mode}/${id}/`
      );
      
      setVehicleDetails(res?.data);
      setShowVehicleDrawer(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      dispatch(
        openNotification({
          type: "error",
          text: `${error.response?.data?.errors[0]?.message[0]}`,
          heading: "Error!",
        })
      );
    }
  };

  const handleDelete = async (book) => {
    //  dispatch(updateTransferBookings(id));
    try {
      setLoading(true);
      const response = await axiosDeleteBooking.delete(
        `${router.query.id}/bookings/${book?.booking_type?.toLowerCase()}/${
          book?.id
        }/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status === 204) {
        dispatch(updateTransferBookings(book?.id));
        getPaymentHandler();
        setLoading(false);
        openNotification({
          type: "success",
          text: "Booking deleted successfuly",
          heading: "Success!",
        });
      }
    } catch (err) {
      openNotification({
        type: "error",
        text: `${err.message}`,
        heading: "Error!",
      });
      setLoading(false);
    }
  };

  console.log("Boooking",booking);
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

            {/* Button Placeholder */}
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

              {/* <Line Transfers={Transfer} pinColour1={pinColour1} pinColour2={pinColour2}/> */}
            </div>
            <>
              {booking?.booking_type === "Flight" ? (
                <FlightBooking
                  booking={booking}
                  notificationText={notificationText}
                  plan={plan}
                  tripsPage={tripsPage}
                  openNotification={openNotification}
                  payment={payment}
                  index={index}
                  _changeFlightHandler={_changeFlightHandler}
                  token={token}
                  setShowLoginModal={setShowLoginModal}
                  originCityId={originCityId}
                  destinationCityId={destinationCityId}
                  setShowDrawer={setShowDrawer}
                />
              ) : (
                <div className="mt-3 ml-1 md:ml-7 flex flex-col w-full">
                  <div className=" w-full items-center">
                    <div className="font-medium text-[15px]  inline flex items-center gap-1">
                      <div className="text-[#C5C1C1]">
                        {getModeIcon(booking?.booking_type, 15)}
                      </div>
                      {booking?.transfer_details?.source?.name}{" "}
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
                      {booking?.transfer_details?.destination?.name}
                    </div>
                    <div className="text-[10px] ml-[20px]">
                      Duration: {booking?.duration}
                    </div>
                  </div>

                  <div
                    id={booking?.id}
                    className={`mb-2 mt-3 w-full flex flex-col lg:flex-row lg:items-center space-y-3 items-start justify-between py-[30px] cursor-pointer relative shadow-sm rounded-2xl transition-all border-[1px] hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-3 p-2 
                      ${!isPageWide ? "w-full" : "max-w-[54vw]"}`}
                  >
                    <div className="flex flex-row items-center gap-1 w-full">
                      <div className="grid place-items-center lg:min-w-[6rem] min-w-[4rem] lg:min-h-[6rem] min-h-[4rem] rounded-2xl">
                        { booking?.transfer_details?.quote?.taxi_category?.image ? (
                          <ImageLoader
                          //  is_url={booking?.image?.includes("gozo")}
                            className=" object-contain"
                            url={booking?.transfer_details?.quote?.taxi_category?.image}
                            leftalign
                            height={
                              booking?.image?.includes("gozo") ? "3rem" : "4rem"
                            }
                            width={"4rem"}
                            widthmobile="4rem"
                            onfail={handleTransferImageFailed}
                          ></ImageLoader>
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
                      <div className="flex justify-between items-center w-full">
                        <div className="flex flex-col w-full">
                          <div className="flex justify-between w-full sm:text-sm text-[0.85rem]">
                            <div className="text-[16px] font-medium w-full">
                              <div className="w-full">
                                {booking?.booking_type == "Taxi" ? (
                                  booking?.transfer_details &&
                                  booking?.transfer_details.gozo &&
                                  booking?.transfer_details.gozo.model ? (
                                    isPageWide ? (
                                      booking?.transfer_details.gozo.model
                                    ) : (
                                      truncateString(
                                        booking?.transfer_details.gozo.model,
                                        25
                                      )
                                    )
                                  ) : (
                                    <div className="w-full">{booking.name}</div>
                                  )
                                ) : (
                                  <>{booking?.name}</>
                                )}
                              </div>
                            </div>

                            {booking?.transfer_type === "Intercity one-way" &&
                              booking?.transfer_details?.duration?.text && (
                                <span className="ml-1">
                                  ({booking?.transfer_details?.duration?.text})
                                </span>
                              )}
                          </div>
                          <div className="flex sm:text-sm text-[14px] flex-row text-[#7A7A7A] font-light items-center">
                            {booking?.booking_type == "Taxi" ? (
                              <>
                                {booking?.transfer_details?.quote?.taxi_category
                                  ?.model_name && (
                                  <div>
                                    {booking?.transfer_details?.quote
                                      ?.taxi_category?.model_name ||
                                      booking?.transfer_details?.quote
                                        ?.taxi_category?.model_name}

                                    &nbsp;{"("}
                                    {booking?.type} 
                                    {")"}
                                  </div>
                                )}
                              </>
                            ) : (
                              <>{booking?.type}</>
                            )}
                          </div>

                          {booking?.transfer_details && (
                            <div className="text-[#01202B] font-normal flex  justify-start items-center mt-1 flex-wrap w-full">
                              <span className="pr-1 sm:text-sm text-[0.82rem]">
                                Facilities:
                              </span>
                              <span className="flex items-center gap-1">
                                {(() => {
                                  const items = [];

                                  const seating =
                                    booking?.transfer_details?.quote
                                      ?.taxi_category?.seating_capacity ??
                                    booking?.number_of_adults +
                                      booking?.number_of_children +
                                      booking?.number_of_infants;

                                  if (seating) {
                                    items.push(
                                      <span
                                        key="seating"
                                        className="sm:text-sm text-[0.74rem] font-normal"
                                      >
                                        {seating} Seat{seating > 1 ? "s" : ""}
                                      </span>
                                    );
                                  }

                                  const bagCapacity =
                                    booking?.transfer_details?.quote
                                      ?.taxi_category?.bag_capacity;
                                  if (bagCapacity > 0) {
                                    items.push(
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
                                    items.push(
                                      <span
                                        key="fuel"
                                        className="sm:text-sm text-[0.74rem] font-normal"
                                      >
                                        {fuelType}
                                      </span>
                                    );
                                  }

                                  return items.map((item, index) => (
                                    <React.Fragment key={index}>
                                      {item}
                                      {index !== items.length - 1 && (
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
                            {booking?.booking_type === "Taxi" ? (
                              <div className="flex flex-row items-center justify-end cursor-pointer pr-2">
                                {addbooking ? (
                                  <button
                                    onClick={() => {
                                      handleViewDetails(
                                        router?.query?.id,
                                        booking?.id,
                                        booking?.booking_type?.toLowerCase()
                                      );
                                    }}
                                    className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[0.6rem] sm:px-1 py-[6px] bg-[#FFFFFF] hover:text-white hover:bg-[#000000] "
                                  >
                                    {isDesktop ? "Change Taxi" : "Change"}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      handleViewDetails(
                                        router?.query?.id,
                                        booking?.id,
                                        booking?.booking_type?.toLowerCase()
                                      );
                                      setShowVehicleDrawer(true);
                                    }}
                                    className=" w-fit text-[12px] font-semibold border-1 border-black hover:bg-black hover:text-white rounded-lg px-3 py-2 text-nowrap"
                                  >
                                    {/* Add Taxi */}
                                    View Details
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="flex flex-row items-center justify-end cursor-pointer pr-2">
                                <button
                                  onClick={() => {
                                    handleViewDetails(
                                      router?.query?.id,
                                      booking?.id,
                                      booking?.booking_type?.toLowerCase()
                                    );
                                    setShowVehicleDrawer(true);
                                  }}
                                  className=" w-fit text-[12px] font-semibold border-1 border-black hover:bg-black hover:text-white rounded-lg px-3 py-2 text-nowrap"
                                >
                                  {/* Add Taxi */}
                                  View Details
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Drawer
                    show={showVehicleDrawer}
                    anchor="right"
                    mobileWidth="100vw"
                    width="50vw"
                    style={1503}
                    className="font-lexend"
                    onHide={() => setShowVehicleDrawer(false)}
                  >
                    {loading || !vehicleDetails ? (
    <VehicleDetailLoader setHandleShow={setShowVehicleDrawer} />
  ) : vehicleDetails?.booking_type?.toLowerCase() === "taxi" || vehicleDetails?.transfer_details?.mode === "taxi" ? (
    <TaxiDetailModal
      data={vehicleDetails}
      loading={loading}
      setIsOpen={setShowVehicleDrawer}
      handleDelete={handleDelete}
      setHandleShow={setShowVehicleDrawer}
      booking={booking}
    />
  ) : (
    <VehicleDetailModal
      data={vehicleDetails}
      loading={loading}
      setIsOpen={setShowVehicleDrawer}
      handleDelete={handleDelete}
      setHandleShow={setShowVehicleDrawer}
      booking={booking}
    />
  )}
                  </Drawer>
                </div>
              )}
            </>
          </Container>
        ) : (
          <div className="grid w-full grid-cols-[30px_120px] min-h-[5rem] md:min-h-[8rem]">
            <div className="relative">
              <LineContainer>
                <HalfLine Transfers={Transfer} color={pinColour1} flex={8} />
                <HalfLine Transfers={Transfer} color={pinColour2} flex={2} />
              </LineContainer>

              {/* 
              <Line
                Transfers={Transfer}
                end={end}
                pinColour1={pinColour1}
                pinColour2={pinColour2}
              /> */}
            </div>
            {isPageWide ? (
              <button
                onClick={() => setShowDrawer(true)}
                className="text-[14px] font-[600] leading-[60px] text-blue hover:underline w-full whitespace-nowrap"
              >
                + Add Transfer from {origin?.name || origin?.city_name} to{" "}
                {destination?.name || destination?.city_name}
              </button>
            ) : (
              <button
                onClick={() => setShowDrawer(true)}
                className="text-[14px] font-[600] leading-[60px] text-blue hover:underline w-full whitespace-nowrap"
              >
                + Add Transfer
              </button>
            )}
            <TransferEditDrawer
              mercury
              addOrEdit={"transferAdd"}
              showDrawer={showDrawer}
              setShowDrawer={setShowDrawer}
              setShowLoginModal={setShowLoginModal}
              selectedTransferHeading={origin}
              origin={origin?.id != undefined ? origin?.id : id}
              destination={destination?.id != undefined ? destination?.id : id}
              check_in={check_in}
              routeId={id}
              city={
                origin?.city_name ||  origin?.name  
              }
              dcity={
                destination?.city_name || destination?.name
                  
              }
              selectedBooking={selectedBooking}
              setSelectedBooking={setSelectedBooking}
              oCityData={oCityData}
              dCityData={dCityData}
              originCityId={originCityId}
              destinationCityId={destinationCityId}
              _updateFlightBookingHandler={_updateFlightBookingHandler}
              _updateTaxiBookingHandler={_updateTaxiBookingHandler}
              getPaymentHandler={getPaymentHandler}
              origin_itinerary_city_id={
                oCityData?.id ||
                oCityData?.gmaps_place_id ||
                oCityData?.gmaps_place_id
              }
              destination_itinerary_city_id={
                dCityData?.id ||
                dCityData?.gmaps_place_id ||
                dCityData?.gmaps_place_id
              }
            />
          </div>
        )
      ) : (
        booking?.children?.map((book, index) => (
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
                  key={index}
                  booking={book}
                  notificationText={notificationText}
                  plan={plan}
                  tripsPage={tripsPage}
                  openNotification={openNotification}
                  payment={payment}
                  index={index}
                  _changeFlightHandler={_changeFlightHandler}
                  token={token}
                  setShowLoginModal={setShowLoginModal}
                  originCityId={originCityId}
                  destinationCityId={destinationCityId}
                  type={"combo"}
                  setShowDrawer={setShowDrawer}
                  getPaymentHandler={getPaymentHandler}
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
                    <div className="font-medium text-[15px]  inline flex items-center gap-1">
                      <div className="text-[#C5C1C1]">
                        {getModeIcon(book?.booking_type, 15)}
                      </div>
                      {book?.transfer_details?.source?.name}{" "}
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
                      {book?.transfer_details?.destination?.name}
                    </div>
                    <div className="text-[10px] ml-[20px]">
                      Duration: {booking?.duration}
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
                        {book?.booking_source === "Gozo" ? (
                          <ImageLoader
                            className="object-contain"
                            url={
                              book?.transfer_details?.quote?.taxi_category
                                ?.image
                            }
                            leftalign
                            height={
                              book?.image?.includes("gozo") ? "3rem" : "4rem"
                            }
                            width={"4rem"}
                            widthmobile="4rem"
                            onfail={handleTransferImageFailed}
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
                                        ?.taxi_category?.model_name} &nbsp;

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

                          {book?.transfer_details && (
                            <div className="text-[#01202B] font-normal flex  justify-start items-center mt-1 flex-wrap">
                              <span className="pr-1 sm:text-sm text-[0.82rem]">
                                Facilities:
                              </span>
                              <span className="flex items-center gap-1">
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
                                    book?.transfer_details?.quote?.taxi_category
                                      ?.bag_capacity;
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
                                    book?.transfer_details?.quote?.taxi_category
                                      ?.fuel_type;
                                  if (fuelType) {
                                    details.push(
                                      <span
                                        key="fuel"
                                        className="sm:text-sm text-[0.74rem] font-normal"
                                      >
                                        {fuelType}
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
                            {book?.booking_type === "Taxi" ? (
                              <div className=" flex flex-row items-center justify-end cursor-pointer pr-2">
                                {addbooking ? (
                                  <button
                                    onClick={() => {
                                      handleViewDetails(
                                        router?.query?.id,
                                        book?.id,
                                        book?.booking_type.toLowerCase()
                                      );
                                    }}
                                    className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[1.6rem] lg:py-2 md:py-2 py-[6px] bg-[#F7E700] hover:text-white hover:bg-black"
                                  >
                                    {isDesktop ? "Change Taxi" : "Change"}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      console.log("clicked");
                                      handleViewDetails(
                                        router?.query?.id,
                                        book?.id,
                                        book?.booking_type.toLowerCase()
                                      );
                                      setShowVehicleDrawer(true);
                                    }}
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
                                  onClick={() => {
                                    handleViewDetails(
                                      router?.query?.id,
                                      book?.id,
                                      book?.booking_type.toLowerCase()
                                    );
                                    setShowVehicleDrawer(true);
                                  }}
                                  className=" w-fit text-[12px] font-semibold border-1 border-black hover:bg-black hover:text-white rounded-lg px-3 py-2 text-nowrap"
                                >
                                  {/* Add Taxi */}
                                  View Details
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Drawer
                    show={showVehicleDrawer}
                    anchor="right"
                    mobileWidth="100vw"
                    width="50vw"
                    style={1503}
                    className="font-lexend"
                    onHide={() => setShowVehicleDrawer(false)}
                  >
                    {loading ? (
                      <>
                        <VehicleDetailLoader setHandleShow={setShowVehicleDrawer}/>
                      </>
                    ) : (
                      <>
                        {vehicleDetails?.booking_type == "Taxi" ? (
                          <TaxiDetailModal
                            data={vehicleDetails}
                            loading={loading}
                            setIsOpen={setShowVehicleDrawer}
                            handleDelete={handleDelete}
                            setHandleShow={setShowVehicleDrawer}
                            booking={booking}
                            type={"combo"}
                          />
                        ) : (
                          <VehicleDetailModal
                            data={vehicleDetails}
                            loading={loading}
                            setIsOpen={setShowVehicleDrawer}
                            handleDelete={handleDelete}
                            setHandleShow={setShowVehicleDrawer}
                            booking={booking}
                            type={"combo"}
                          />
                        )}
                      </>
                    )}
                  </Drawer>
                </div>
              </>
            )}
            {/* <TransferEditDrawer
                    mercury
                    addOrEdit={"transferAdd"}
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    // selectedTransferHeading={origin}
                    destination={destination_city_id}
                    // check_in={check_in}
                    // routeId={id}
                    oCityData={oCityData}
                    dCityData={dCityData}
                    setShowLoginModal={setShowLoginModal}
                    city={origin_city_name}
                    dcity={destination_city_name}
                    // originCityId={origin}
                    // destinationCityId={destination}
                    selectedBooking={selectedBooking}
                    setSelectedBooking={setSelectedBooking}
                    originCityId={
                      oCityData?.city?.id || oCityData?.gmaps_place_id
                    }
                    destinationCityId={
                      dCityData?.city?.id || dCityData?.gmaps_place_id
                    }
                    origin_itinerary_city_id={oCityData?.id || oCityData?.gmaps_place_id}
                    destination_itinerary_city_id={dCityData?.id || dCityData?.gmaps_place_id}
                  /> */}
            <TransferEditDrawer
              mercury
              addOrEdit={"transferAdd"}
              showDrawer={showDrawer}
              setShowDrawer={setShowDrawer}
              selectedTransferHeading={origin}
              origin={origin?.id != undefined ? origin?.id : id}
              destination={destination?.id != undefined ? destination?.id : id}
              check_in={check_in}
              routeId={id}
              city={
                origin?.name != undefined ? origin?.name || origin?.city_name : null
              }
              dcity={
                destination?.name != undefined
                  ? destination?.name
                  || destination?.city_name : null
              }
              oCityData={oCityData}
              dCityData={dCityData}
              selectedBooking={selectedBooking}
              setSelectedBooking={setSelectedBooking}
              originCityId={originCityId}
              destinationCityId={destinationCityId}
              getPaymentHandler={getPaymentHandler}
              _updateFlightBookingHandler={_updateFlightBookingHandler}
              _updatePaymentHandler={_updatePaymentHandler}
              setShowLoginModal={setShowLoginModal}
              origin_itinerary_city_id={
                oCityData?.id || oCityData?.gmaps_place_id
              }
              destination_itinerary_city_id={
                dCityData?.id || dCityData?.gmaps_place_id
              }
            />
          </ComboContainer>
        ))
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

const FlightBooking = ({
  booking,
  plan,
  tripsPage,
  payment,
  index,
  _changeFlightHandler,
  token,
  setShowLoginModal,
  originCityId,
  destinationCityId,
  loadbookings,
  type,
  setShowDrawer,
  getPaymentHandler,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  console.log("Inside Flight Booking",booking);

  const router = useRouter();
  function HandleFlights(i, label) {
    if (!token) {
      return setShowLoginModal(true);
    }

    let name = booking["name"];
    let costings_breakdown = booking["costings_breakdown"]; //not prsent
    let cost = booking["booking_cost"]; //not present
    let itinerary_id = router.query.id; // not present
    let itinerary_name = booking["name"]; // not present
    let tailored_id = booking["tailored_itinerary"]; // not present
    let id = booking["id"];
    let check_in =
      booking?.transfer_details?.items?.[0]?.segments[0]?.origin
        ?.departure_time;
    let check_out = booking["check_out"]; // not present
    let pax = {
      number_of_adults: booking["number_of_adults"],
      number_of_children: booking["number_of_children"],
      number_of_infants: booking["number_of_infants"],
    };
    let city = booking["city"];
    let taxi_type = booking["taxi_type"];
    let transfer_type = booking["transfer_type"];
    let destination_city = booking["destination_city"];
    let origin_iata = booking?.transfer_details?.source?.code;
    let destination_iata = booking?.transfer_details?.destination?.code;
    let user_selected = booking?.user_selected;
    let edge = booking?.edge;
    _changeFlightHandler(
      name,
      itinerary_id,
      tailored_id,
      id,
      check_in,
      check_out,
      pax,
      city,
      itinerary_name,
      cost,
      costings_breakdown,
      origin_iata,
      destination_iata,
      destination_city,
      taxi_type,
      transfer_type,
      user_selected,
      booking?.id,
      originCityId,
      destinationCityId,
      edge
    );

    logEvent({
      action: "Transfer_Add_Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: label,
        event_value: booking?.heading,
        event_action: "Transfers",
      },
    });
  }

  try {
    if (booking?.number_of_adults > 1) adult = " Adults";
    else adult = " Adult";
    var child;
    if (booking?.number_of_children > 1) child = " Childs";
    else child = " Child";
  } catch {}
  return (
    <div className="mt-3 ml-1 md:ml-7 flex flex-col w-full items-center justify-center ">
      <div className=" w-full items-center">
        <div className="font-medium text-[15px]  inline flex items-center gap-1">
          <FaPlaneDeparture color="#C5C1C1" />
          {booking?.transfer_details?.source?.name}{" "}
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
          {booking?.transfer_details?.destination?.name}
        </div>
        <div className="text-[10px] ml-[20px]">
          Duration: {booking?.duration}
        </div>
      </div>
      <div
        id={booking?.id}
        className={`mb-2 mt-2  w-full lg:block ${"mb-2 mt-2 lg:block flex flex-col p-3 "} cursor-pointer relative shadow-sm rounded-2xl transition-all  hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA] border-[1px]  hover:border-[#F7E700]  shadow-[#ECEAEA] lg:p-5 w-full`}
      >
        <div
          className={` w-full 
          `}
        >
          <div className="flex justify-between w-full">
            <FlightLogoContainer
              data={booking?.transfer_details?.items?.[0]}
              height={34}
              width={34}
            />
            {window.innerWidth >= 1000 && (
              <div>
                <button
                  onClick={() => {
                    setShowDetails(true);
                  }}
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
              setShowDetails={setShowDetails}
              type={type}
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
                onClick={() => {
                  setShowDetails(true);
                }}
                className=" w-fit text-[12px] font-semibold border-1 border-black hover:bg-black hover:text-white rounded-lg px-3 py-2 text-nowrap"
              >
                View Details
              </button>
            </div>
          )}
        </div>
      </div>
      <Drawer
        show={showDetails}
        anchor={"right"}
        backdrop
        width={"50%"}
        mobileWidth={"100%"}
        style={{ zIndex: 1503 }}
        className={`font-lexend ${
          window.innerWidth < 768 ? "w-full" : "w-[50%]"
        }`}
        onHide={() => setShowDetails(false)}
      >
        {originCityId !== undefined && destinationCityId !== undefined && (
          <>
            <Details
              segments={booking?.transfer_details?.items?.[0]?.segments}
              resultIndex={booking?.transfer_details?.items?.[0]?.result_index}
              setShowDetails={setShowDetails}
              individual={false}
              booking_id={booking?.id}
              drawer={true}
              name={booking?.name}
              fareRule={booking?.transfer_details?.items?.[0]?.fare_rule}
              originCityId={"karan"}
              destinationCityId={destinationCityId}
              onChange={() => {
                HandleFlights(index, "Change Flight");
                setShowDetails(false);
              }}
              type={type}
              getPaymentHandler={getPaymentHandler}
            />
          </>
        )}
      </Drawer>
    </div>
  );
};
