import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TransportIconFetcher } from "../../../helper/TransportIconFetcher";
import ImageLoader from "../../../components/ImageLoader";
import useMediaQuery from "../../../components/media";
import media from "../../../components/media";
import { connect, useDispatch, useSelector } from "react-redux";
import { openNotification } from "../../../store/actions/notification";
import Button from "../../../components/ui/button/Index";
import { logEvent } from "../../../services/ga/Index";
import FlightLogoContainer from "../../../components/modals/flights/new-flight-searched/LogoContainer";
import FlightDetails from "../../../components/modals/flights/new-flight-searched/FlightDetails";
import Drawer from "../../../components/ui/Drawer";
import { FaArrowRight } from "react-icons/fa6";
import { useRouter } from "next/router";
import TransferEditDrawer from "../../../components/drawers/routeTransfer/TransferEditDrawer";
import Details from "./FlightDetail2";
import { toast } from "react-toastify";
import axios from "axios";
import { MERCURY_HOST } from "../../../services/constants";
import VehicleDetailModal from "../../../components/modals/daybyday/VehicleModal";
import { updateTransferBookings } from "../../../store/actions/transferBookingsStore";
import { axiosDeleteBooking } from "../../../services/itinerary/bookings";
import TransferSkeleton from "../../../components/itinerary/Skeleton/TransferSkeleton";
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

const Line = styled.hr`
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

  function HandleTransport(i, label) {
    if (!token) {
      return setShowLoginModal(true);
    }
    let name = booking["name"];
    let costings_breakdown = booking["transfer_details"];
    let cost = booking["price"];
    let itinerary_id = booking["itinerary_id"];
    let itinerary_name = booking["itinerary_name"];
    let tailored_id = booking["tailored_itinerary"];
    let id = booking["id"];
    let check_in = booking["check_in"];
    let check_out = booking["check_out"];
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
      toast.error(error.response?.data?.errors[0]?.message[0]);
    }
  };

  const handleDelete = async (book) => {
    //  dispatch(updateTransferBookings(id));
    try {
      setLoading(true);
      const response = await axiosDeleteBooking.delete(
        `${router.query.id}/bookings/${book?.booking_type?.toLowerCase()}/${
          book?.id
        }/`
      );

      if (response.status === 204) {
        dispatch(updateTransferBookings(book?.id));
        setLoading(false);
        toast.success("Booking deleted successfuly");
        setVisible(true);
        //setHandleShow(false);
        console.log("Deleted Booking");
      }
    } catch (err) {
      console.log(
        "[ERROR][ItineraryPage][axiosDeleteBooking:/Delete_Booking]",
        err
      );
      toast.error("Error", err.message);
      setLoading(false);
    }
  };

  return (
    <>
      {transfers_status === "PENDING" && mercuryItinerary ? (
        <div className="mt-2 ml-1 md:ml-7 flex flex-col w-full">
          {/* Booking name */}
          <div className="flex flex-row w-full justify-between items-center">
            <div className="w-full h-3 bg-gray-300 rounded-md animate-pulse" />
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
            <div className="w-full flex flex-row items-center justify-end cursor-pointer pr-2">
              <div className="w-32 h-6 bg-gray-300 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      ) : booking?.transfer_type !== "combo" ? (
        booking?.id ? (
          <Container
            className={`${!isPageWide ? "max-w-fit" : "max-w-[54vw]"}`}
          >
            <div className="relative">
              <Line
                pinColour={CITY_COLOR_CODES[index % 7]}
                Transfers={Transfer}
              />
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
                />
              ) : (
                <div className="mt-3 ml-1 md:ml-7 flex flex-col w-full">
                  <div className="flex flex-row w-full justify-between items-center">
                    <span className="font-medium  inline">{booking?.name}</span>
                    <div className="flex flex-row gap-2 justify-center items-center">
                      {/* <div className=" text-md font-semibold  text-[#277004] ">
                Included
              </div> */}
                    </div>
                  </div>

                  <div
                    id={booking?.id}
                    className={`mb-2 mt-3 w-full flex flex-col lg:flex-row lg:items-center space-y-3 items-start justify-between py-[30px] cursor-pointer relative shadow-sm rounded-2xl transition-all border-[1px] hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-3 p-2 ${
                      !isPageWide ? "w-full" : "max-w-[54vw]"
                    }`}
                  >
                    <div className="flex flex-row items-center justify-between gap-1">
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
                                color: "black",
                              }}
                            />
                          </>
                        )}
                      </div>

                      <div className="flex flex-col lg:w-60">
                        <div className="sm:text-sm text-[0.85rem]">
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

                          {booking?.transfer_type === "Intercity one-way" &&
                            booking?.transfer_details?.duration?.text && (
                              <span className="ml-1">
                                ({booking?.transfer_details?.duration?.text})
                              </span>
                            )}
                        </div>
                        <div className="flex sm:text-sm text-[0.93rem] flex-row text-[#7A7A7A] font-light items-center">
                          {booking?.taxi_type && (
                            <div>{booking?.taxi_type}</div>
                          )}
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
                    </div>

                    {!payment?.paid_user && booking?.booking_type === "Taxi" ? (
                      <div className="w-full flex flex-row items-center justify-end cursor-pointer pr-2">
                        {addbooking ? (
                          <button
                            onClick={() =>
                              HandleTransport(index, "Change Taxi")
                            }
                            className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[1.6rem] lg:py-2 md:py-2 py-[6px] bg-[#F7E700] hover:text-white hover:bg-black"
                          >
                            {isDesktop ? "Change Taxi" : "Change"}
                          </button>
                        ) : (
                          <button
                            // onClick={() => HandleTransport(index, "Add Taxi")}
                            className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[1.6rem] lg:py-2 md:py-2 py-[6px] bg-[#FFFFFF] hover:text-white hover:bg-[#000000]"
                          >
                            View Detail
                            {/* Add Taxi */}
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
                      //         booking?.id,
                      //         booking?.transfer_details?.mode.toLowerCase()
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
                        className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[1.6rem] lg:py-2 md:py-2 py-[6px] bg-[#FFFFFF] hover:text-white hover:bg-[#000000] mr-2"
                      >
                        {/* Add Taxi */}
                        View Detail
                      </button>
                    )}
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
                    <VehicleDetailModal
                      data={vehicleDetails}
                      loading={loading}
                      setIsOpen={setShowVehicleDrawer}
                      handleDelete={handleDelete}
                      setHandleShow={setShowVehicleDrawer}
                      booking={booking}
                    />
                  </Drawer>
                </div>
              )}
            </>
          </Container>
        ) : (
          <div className="grid w-full grid-cols-[30px_120px] min-h-[5rem] md:min-h-[8rem]">
            <div className="relative">
              <Line
                pinColour={CITY_COLOR_CODES[index % 7]}
                Transfers={Transfer}
                end={end}
              />
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
              <Line
                pinColour={CITY_COLOR_CODES[index % 7]}
                Transfers={Transfer}
              />
            </div>
            {book?.booking_type === "Flight" ? (
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
              />
            ) : (
              <div
                key={index}
                className="mt-3 ml-1 md:ml-7 flex flex-col w-full"
              >
                <div className="flex flex-row w-full justify-between items-center">
                  <span className="font-medium inline">{book?.name}</span>
                  <div className="flex flex-row gap-2 justify-center items-center">
                    {/* <div className=" text-md font-semibold  text-[#277004] ">
            Included
          </div> */}
                  </div>
                </div>

                <div
                  id={book?.id}
                  className={`mb-2 mt-3 w-full flex flex-col lg:flex-row lg:items-center space-y-3 items-start justify-between py-[30px] cursor-pointer relative shadow-sm rounded-2xl transition-all border-[1px] hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-3 p-2 ${
                    !isPageWide ? "w-full" : "max-w-[54vw]"
                  }`}
                >
                  <div className="flex flex-row items-center justify-between gap-1">
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
                              color: "black",
                            }}
                          />
                        </>
                      )}
                    </div>

                    <div className="flex flex-col lg:w-60">
                      <div className="sm:text-sm text-[0.85rem]">
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

                        {book?.transfer_type === "Intercity one-way" &&
                          book?.transfer_details?.duration?.text && (
                            <span className="ml-1">
                              ({book?.transfer_details?.duration?.text})
                            </span>
                          )}
                      </div>
                      <div className="flex sm:text-sm text-[0.93rem] flex-row text-[#7A7A7A] font-light items-center">
                        {book?.taxi_type && <div>{book?.taxi_type}</div>}
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
                  </div>

                  {!payment?.paid_user && book?.booking_type === "Taxi" ? (
                    <div className="w-full flex flex-row items-center justify-end cursor-pointer pr-2">
                      {addbooking ? (
                        <button
                          onClick={() => HandleTransport(index, "Change Taxi")}
                          className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[1.6rem] lg:py-2 md:py-2 py-[6px] bg-[#F7E700] hover:text-white hover:bg-black"
                        >
                          {isDesktop ? "Change Taxi" : "Change"}
                        </button>
                      ) : (
                        <button
                          // onClick={() => HandleTransport(index, "Add Taxi")}
                          className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[1.6rem] lg:py-2 md:py-2 py-[6px] bg-[#FFFFFF] hover:text-white hover:bg-[#000000]"
                        >
                          {/* Add Taxi */}
                          View Detail
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
                      View Detail
                    </button>
                  )}
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
                  <VehicleDetailModal
                    data={vehicleDetails}
                    loading={loading}
                    setIsOpen={setShowVehicleDrawer}
                    handleDelete={handleDelete}
                    setHandleShow={setShowVehicleDrawer}
                    booking={book}
                  />
                </Drawer>
              </div>
            )}
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
    <div className="ml-1 md:ml-7 flex flex-col w-full items-center justify-center p-2 ">
      <div className="flex flex-row w-full justify-between items-center">
        <span className="font-medium  inline">{booking?.name}</span>
      </div>
      <div
        id={booking?.id}
        className={`mb-2 mt-2  w-full lg:block ${"mb-2 mt-2 lg:block flex flex-col p-3 "} cursor-pointer relative shadow-sm rounded-2xl transition-all  hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA] border-[1px]  hover:border-[#F7E700]  shadow-[#ECEAEA] lg:p-5 `}
      >
        <div
          className={` w-full ${
            window.innerWidth >= 1000 && "flex justify-between items-center "
          }`}
        >
          <FlightLogoContainer data={booking?.transfer_details?.items?.[0]} />
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
            />
          </div>
          {window.innerWidth >= 1000 && (
            <div className="w-[131.95px]">
              {/* <Button
                bgColor={"#FFFFFF"}
                borderRadius="8px"
                fontWeight="400"
                padding="0.6rem 0.6rem"
                hoverColor="#FFFFFF"
                margin="auto 2px"
                onclick={() => {
                  // HandleFlights(index, "Change Flight");
                  setShowDetails((prev) => !prev);
                }}
              >
                View Detail
              </Button> */}
              <button
                onclick={() => {
                  setShowDetails((prev) => !prev);
                }}
                className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[1.6rem] lg:py-2 md:py-2 py-[6px] bg-[#FFFFFF] hover:text-white hover:bg-[#000000]"
              >
                {/* Add Taxi */}
                View Detail
              </button>
            </div>
          )}
        </div>
        <div
          className={`flex ${
            window.innerWidth < 1000 ? "justify-between" : "justify-center"
          } items-center`}
        >
          {/* <button
            className="text-sm flex flex-row gap-1 items-center justify-center hover:bg-black hover:text-white rounded-lg px-2 py-1"
            onClick={() => {
              setShowDetails((prev) => !prev);
            }}
          >
            Flight Details
            <span>
              <FaArrowRight />
            </span>
          </button> */}
          {window.innerWidth < 1000 && (
            <div className="w-[131.95px]">
              {/* <Button
                bgColor={"#000000"}
                borderRadius="8px"
                fontWeight="400"
                padding="0.6rem 0.6rem"
                hoverColor="#f7e700"
                margin="auto 2px"
                onclick={() => {
                  // HandleFlights(index, "Change Flight");
                  setShowDetails((prev) => !prev);
                }}
              >
                View Detail
              </Button> */}
              <button
                onclick={() => {
                  setShowDetails((prev) => !prev);
                }}
                className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg p-1 bg-[#FFFFFF] hover:text-white hover:bg-[#000000]"
              >
                {/* Add Taxi */}
                View Detail
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
            />
          </>
        )}
      </Drawer>
    </div>
  );
};
