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
import { toast } from "react-toastify";
import axios from "axios";
import { MERCURY_HOST } from "../../../services/constants";
import VehicleDetailModal from "../../../components/modals/daybyday/VehicleModal";
import TaxiDetailModal from "../../../components/modals/daybyday/TaxiDetailModal";
import { updateTransferBookings } from "../../../store/actions/transferBookingsStore";
import { axiosDeleteBooking } from "../../../services/itinerary/bookings";
import { HiOutlineRefresh } from "react-icons/hi";
import { FaPlane, FaPlaneDeparture } from "react-icons/fa";
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
  right: -25px; // Adjust as needed

  width: 2px;
  background-image: repeating-linear-gradient(
    to bottom,
    ${(props) => props.pinColour || "black"},
    ${(props) => props.pinColour || "black"} 4px,
    transparent 4px,
    transparent 8px
  );
  background-repeat: repeat-y;

  z-index: -1;

  @media screen and (min-width: 768px) {
    right: -81px;
  }
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
  originCityId,
  destinationCityId,
  loadbookings,
  mercuryItinerary,
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

  const Facilities = [
    booking?.booking_type == "Taxi" || booking?.booking_type == "Bus"
      ? booking?.transfer_details?.hasOwnProperty("luggage_bags") &&
        booking?.transfer_details?.luggage_bags > 0
        ? `${booking?.transfer_details?.luggage_bags} Luggage bags`
        : "2 Luggage bags"
      : null,

    booking?.transfer_details?.taxi_occupancy ||
    booking?.transfer_details?.no_of_seats
      ? `${
          booking?.transfer_details?.taxi_occupancy
            ? booking?.transfer_details?.taxi_occupancy
            : booking?.transfer_details?.no_of_seats
        } Seats`
      : null,
    booking?.booking?.transfer_type === "Intercity one-way"
      ? booking?.transfer_details?.distance?.text
        ? `${booking?.transfer_details?.distance?.text}`
        : null
      : null,
  ];

  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.slice(0, maxLength - 3) + "...";
    }
    return str;
  }
  const handleViewDetails = async (itineraryId, id, mode) => {
    try {
      setShowVehicleDrawer(true);
      const res = await axios.get(
        `${MERCURY_HOST}/api/v1/itinerary/${itineraryId}/bookings/${mode}/${id}/`
      );
      setLoading(false);
      setVehicleDetails(res?.data);
    } catch (error) {
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
          <Container className={`${!isPageWide ? "w-full" : "max-w-[54vw]"}`}>
            <div className="relative">
              <Line Transfers={Transfer} />
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
                        {!transferImageFailed ? (
                          <ImageLoader
                            is_url={booking?.image?.includes("gozo")}
                            className=" object-contain"
                            url={booking?.image}
                            leftalign
                            height={
                              booking?.image?.includes("gozo") ? "3rem" : "4rem"
                            }
                            width={"4rem"}
                            widthmobile="4rem"
                            onfail={handleTransferImageFailed}
                          ></ImageLoader>
                        ) : (
                          <>
                            <TransportIconFetcher
                              TransportMode={booking?.booking_type}
                              Instyle={{
                                fontSize: "2.75rem",
                                marginRight: "0.8rem",
                              }}
                              classname={"bg-[#D9D9D9] rounded-[11px]"}
                              color="#C5C1C1"
                            />
                          </>
                        )}
                      </div>
                      <div className="flex justify-between items-start w-full">
                        <div className="flex flex-col w-full">
                          <div className="flex justify-between w-full sm:text-sm text-[0.85rem]">
                            <div className="text-[16px] font-medium">
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
                                  "Private transfer "
                                )
                              ) : (
                                <>
                                  {booking?.booking_type} ({booking?.duration})
                                </>
                              )}
                            </div>

                            {booking?.transfer_type === "Intercity one-way" &&
                              booking?.transfer_details?.duration?.text && (
                                <span className="ml-1">
                                  ({booking?.transfer_details?.duration?.text})
                                </span>
                              )}
                          </div>
                          <div className="flex sm:text-sm text-[14px] flex-row text-[#7A7A7A] font-light items-center">
                            {booking?.type && <div>{booking?.type} car</div>}
                          </div>

                          {booking?.transfer_details && (
                            <div className="text-[#01202B] font-normal flex flex-row justify-start items-center mt-1 flex-wrap">
                              <span className="pr-1 sm:text-sm text-[0.82rem]">
                                Facilities:
                              </span>

                              <GridContainer className="">
                                {Facilities.filter(Boolean).map(
                                  (data, index) =>
                                    data !== null && (
                                      <div className="gap-1">
                                        <div className="flex flex-row flex-wrap sm:text-sm text-[0.74rem] font-normal">
                                          {index !== 0 && data != null ? (
                                            <span className="px-1">|</span>
                                          ) : null}

                                          <div className="">{data}</div>
                                        </div>
                                      </div>
                                    )
                                )}
                              </GridContainer>
                            </div>
                          )}
                        </div>

                        {!payment?.paid_user && (
                          <>
                            {booking?.booking_type === "Taxi" ? (
                              <div className="w-full flex flex-row items-center justify-end cursor-pointer ">
                                {addbooking ? (
                                  <button
                                    onClick={() => {
                                      handleViewDetails(
                                        router?.query?.id,
                                        booking?.id,
                                        booking?.transfer_details?.mode.toLowerCase()
                                      );
                                    }}
                                    className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[0.6rem] sm:px-1 py-[6px] bg-[#FFFFFF] hover:text-white hover:bg-[#000000] "
                                    >
                                    {isDesktop ? "Change Taxi" : "Change"}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      console.log("clicked");
                                      handleViewDetails(
                                        router?.query?.id,
                                        booking?.id,
                                        booking?.transfer_details?.mode.toLowerCase()
                                      );
                                      setShowVehicleDrawer(true);
                                    }}
                                    className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[0.6rem] sm:px-1 py-[6px] bg-[#FFFFFF] hover:text-white hover:bg-[#000000] "
                                    >
                                    {/* Add Taxi */}
                                    View Details
                                  </button>
                                )}
                              </div>
                            ) : (
                              // <div className={`absolute bottom-[1rem] right-6 -m-3`}>
                              //   <Button
                              //     padding="0.6rem 2.2rem"
                              //     borderRadius="8px"
                              //     hoverColor="white"
                              //     fontWeight="400"
                              //     onclick={() =>
                              //       handleViewDetails(
                              //         router?.query?.id,
                              //         book?.id,
                              //         book?.transfer_details?.mode.toLowerCase()
                              //       )
                              //     }
                              //   >
                              //     View Detail
                              //   </Button>
                              // </div>
                              <button
                                onclick={() =>
                                  handleViewDetails(
                                    router?.query?.id,
                                    booking?.id,
                                    booking?.transfer_details?.mode.toLowerCase()
                                  )
                                }
                                className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[1.6rem] lg:py-2 md:py-2 py-[6px] bg-[#FFFFFF] hover:text-white hover:bg-[#000000]"
                              >
                                {/* Add Taxi */}
                                View Details
                              </button>
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
                    {vehicleDetails?.booking_type == "Taxi" ? (
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
              <Line Transfers={Transfer} end={end} />
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
              selectedTransferHeading={origin}
              origin={origin?.id != undefined ? origin?.id : id}
              destination={destination?.id != undefined ? destination?.id : id}
              check_in={check_in}
              routeId={id}
              city={
                origin?.name != undefined ? origin?.name : origin?.city_name
              }
              dcity={
                destination?.name != undefined
                  ? destination?.name
                  : destination?.city_name
              }
              selectedBooking={selectedBooking}
              originCityId={originCityId}
              destinationCityId={destinationCityId}
            />
          </div>
        )
      ) : (
        booking?.children?.map((book, index) => (
          <ComboContainer>
            <div className="relative">
              <Line Transfers={Transfer} />
            </div>
            {book?.booking_type === "Flight" ? (
              <>
                <div className="absolute w-[20px] border border-black ml-4 mt-[15px]"></div>
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
                        {!transferImageFailed ? (
                          <ImageLoader
                            is_url={book?.image?.includes("gozo")}
                            className="object-contain"
                            url={book?.image}
                            leftalign
                            height={
                              book?.image?.includes("gozo") ? "3rem" : "4rem"
                            }
                            width={"4rem"}
                            widthmobile="4rem"
                            onfail={handleTransferImageFailed}
                          />
                        ) : (
                          <>
                            <TransportIconFetcher
                              TransportMode={book?.booking_type}
                              Instyle={{
                                fontSize: "2.75rem",
                                marginRight: "0.8rem",
                              }}
                              classname={"bg-[#D9D9D9] rounded-[11px]"}
                              color="#C5C1C1"
                            />
                          </>
                        )}
                      </div>
                      <div className="flex justify-between items-start w-full">
                        <div className="flex flex-col lg:w-60 w-full">
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
                                "Private transfer "
                              )
                            ) : (
                              <>
                                {book?.booking_type} ({booking?.duration})
                              </>
                            )}
                          </div>
                          <div className="flex sm:text-sm text-[14px]  flex-row text-[#7A7A7A] font-light items-center">
                            {book?.type && <div>{book?.type} car</div>}
                          </div>

                          {book?.transfer_details && (
                            <div className="text-[#01202B] font-normal flex flex-row justify-start items-center mt-1 flex-wrap">
                              <span className="pr-1 sm:text-sm text-[0.82rem]">
                                Facilities:
                              </span>

                              <GridContainer className="">
                                {Facilities.filter(Boolean).map(
                                  (data, index) =>
                                    data !== null && (
                                      <div key={index} className="gap-1">
                                        <div className="flex flex-row flex-wrap sm:text-sm text-[0.74rem] font-normal">
                                          {index !== 0 && data != null ? (
                                            <span className="px-1">|</span>
                                          ) : null}

                                          <div className="">{data}</div>
                                        </div>
                                      </div>
                                    )
                                )}
                              </GridContainer>
                            </div>
                          )}
                        </div>
                        {!payment?.paid_user && (
                          <>
                            {book?.booking_type === "Taxi" ? (
                              <div className="w-full flex flex-row items-center justify-end cursor-pointer ">
                                {addbooking ? (
                                  <button
                                    onClick={() => {
                                      handleViewDetails(
                                        router?.query?.id,
                                        book?.id,
                                        booking?.transfer_details?.mode.toLowerCase()
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
                                        booking?.transfer_details?.mode.toLowerCase()
                                      );
                                      setShowVehicleDrawer(true);
                                    }}
                                    className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[0.6rem] sm:px-1 py-[6px] bg-[#FFFFFF] hover:text-white hover:bg-[#000000] "
                                    >
                                    {/* Add Taxi */}
                                    View Details
                                  </button>
                                )}
                              </div>
                            ) : (
                              // <div className={`absolute bottom-[1rem] right-6 -m-3`}>
                              //   <Button
                              //     padding="0.6rem 2.2rem"
                              //     borderRadius="8px"
                              //     hoverColor="white"
                              //     fontWeight="400"
                              //     onclick={() =>
                              //       handleViewDetails(
                              //         router?.query?.id,
                              //         book?.id,
                              //         book?.transfer_details?.mode.toLowerCase()
                              //       )
                              //     }
                              //   >
                              //     View Detail
                              //   </Button>
                              // </div>
                              <button
                                onclick={() =>
                                  handleViewDetails(
                                    router?.query?.id,
                                    book?.id,
                                    book?.transfer_details?.mode.toLowerCase()
                                  )
                                }
                                className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[1.6rem] lg:py-2 md:py-2 py-[6px] bg-[#FFFFFF] hover:text-white hover:bg-[#000000]"
                              >
                                {/* Add Taxi */}
                                View Details
                              </button>
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
                  </Drawer>
                </div>
              </>
            )}
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
                origin?.name != undefined ? origin?.name : origin?.city_name
              }
              dcity={
                destination?.name != undefined
                  ? destination?.name
                  : destination?.city_name
              }
              selectedBooking={selectedBooking}
              originCityId={originCityId}
              destinationCityId={destinationCityId}
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
}) => {
  const [showDetails, setShowDetails] = useState(false);

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
    <div className="ml-1 md:ml-7 flex flex-col w-full items-center justify-center ">
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
        className={`mb-2 mt-2  w-full lg:block ${"mb-2 mt-2 lg:block flex flex-col p-3 "} cursor-pointer relative shadow-sm rounded-2xl transition-all  hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA] border-[1px]  hover:border-[#F7E700]  shadow-[#ECEAEA] lg:p-5 `}
      >
        <div
          className={` w-full 

          `}
        >
          <div className="flex justify-between">
            <FlightLogoContainer data={booking?.transfer_details?.items?.[0]} height={34} width={34}/>
            {window.innerWidth >= 1000 && (
              <div >
                <button
                  onClick={() => {
                    setShowDetails(true);
                  }}
                  className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[0.6rem] sm:px-1 py-[6px] bg-[#FFFFFF] hover:text-white hover:bg-[#000000] "
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
          } items-center`}
        >
          {window.innerWidth < 1000 && (
            <div className="w-full mt-4">
              <button
                onClick={() => {
                  setShowDetails(true);
                }}
                className="w-full text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[0.6rem] sm:px-1 py-[6px] bg-[#FFFFFF] hover:text-white hover:bg-[#000000]"
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
            />
          </>
        )}
      </Drawer>
    </div>
  );
};
