import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TransportIconFetcher } from "../../../helper/TransportIconFetcher";
import ImageLoader from "../../../components/ImageLoader";
import { FaPlane } from "react-icons/fa";
import useMediaQuery from "../../../components/media";
import media from "../../../components/media";
import { ITINERARY_STATUSES } from "../../../services/constants";
import CheckboxFormComponent from "../../../components/FormComponents/CheckboxFormComponent";
import axiosbookingupdateinstance from "../../../services/bookings/UpdateBookings";
import { PulseLoader } from "react-spinners";
import EllipsisTruncation from "../../EllipsisTruncate";
import { connect } from "react-redux";
import { openNotification } from "../../../store/actions/notification";
import { getIndianPrice } from "../../../services/getIndianPrice";
import Button from "../../../components/ui/button/Index";
import { logEvent } from "../../../services/ga/Index";
import { differenceInMinutes, format, parseISO } from "date-fns";

const Plan = styled.div`
  position: absolute;
  left: 50%;
  top: 0%;
  transform: translate(-50%, -45%);
`;

const Circle = styled.div`
  border: 1px solid #7a7a7a;
  height: 10px;
  width: 10px;
  border-radius: 100%;
  background: white;
  position: absolute;
  z-index: 1;
  top: 50%;
  transform: translateY(-38%);
`;

const DottedLine = styled.div`
  position: relative;
  height: 2px;
  width: 100%;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(to right, #7a7a7a 5px, transparent 5px);
    background-size: 9px 100%; /* Adjust this value to change the spacing between the dots */
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  text-align: left;
  font-size: 0.9rem;
  font-weight: 600;
  flex-direction: row;
  gap: 1rem;
  @media screen and (min-width: 768px) {
    padding-left: 0.25rem;
    flex-direction: column;
    font-weight: 400;
    gap: 0rem;
    text-align: center;
    font-size: 0.8rem;
  }
`;

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

const InfoContainer = styled.div`
  width: 100%;
  margin-block: auto;
  @media screen and (min-width: 1100px) {
    width: 70%;
  }
  @media screen and (min-width: 1600px) {
    width: 50%;
  }
  @media screen and (max-width: 768px) {
    span {
      font-size: 14px;
    }
  }
`;

const ImageContainer = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f4f4;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 4rem;
    height: 4rem;
  }
  img {
    object-fit: contain;
    transform: scale(1.05);
  }
`;

const PriceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
  align-items: center;
`;

const Cost = styled.p`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  text-align: center;
`;

const Text = styled.p`
  font-size: 12px;
  font-weight: 300;
  margin: 0;
  text-align: left;
  @media screen and (min-width: 768px) {
    text-align: center;
  }
`;

const FlexBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
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
    top: 81px;
    right: -81px;
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
  _updateTaxiBookingHandler,
  getPaymentHandler,
  _changeFlightHandler,
}) => {
  let isPageWide = media("(min-width: 768px)");
  const isDesktop = useMediaQuery("(min-width:1024px)");
  const [addbooking, setaddboking] = useState(booking.user_selected);
  const [loading, setLoading] = useState(false);
  const [transferImageFailed, setTransferImageFailed] = useState(null);

  useEffect(() => {
    setaddboking(booking.user_selected);
  }, [booking.user_selected]);

  const handleTransferImageFailed = () => {
    setTransferImageFailed(true);
  };

  function handleCheckboxChange(e, label) {
    if (!payment?.is_registration_needed) {
      if (token && payment?.user_allowed_to_pay) {
        _updateSelectedTransfer();
        e.stopPropagation();
      } else {
        openNotification({
          text: "Oops, this action is not allowed on another user's itinerary.",
          heading: "Error!",
          type: "error",
        });
        setShowLoginModal();
        e.stopPropagation();
      }
    }

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
    let origin_iata = booking["origin_city_iata_code"];
    let destination_iata = booking["destination_city_iata_code"];
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
      destination
    );

    logEvent({
      action: "Transfer_Add_Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: label,
        event_value: booking.heading,
        event_action: "Transfers",
      },
    });
  }

  const Facilities = [
    booking.booking_type == "Taxi" || booking.booking_type == "Bus"
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

  const _updateSelectedTransfer = () => {
    setLoading(true);

    let updated_bookings_arr = [
      {
        id: booking["id"],
        booking_type: booking_type,
        itinerary_type: "Tailored",
        user_selected: booking.user_selected,
        itinerary_id: booking["itinerary_id"],
        taxi_type: booking["taxi_type"],
        transfer_type: booking["transfer_type"],

        costings_breakdown: booking?.costings_breakdown,
      },
    ];
    axiosbookingupdateinstance
      .post("?booking_type=Taxi,Bus,Ferry,Train,Flight", updated_bookings_arr, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        _updateTaxiBookingHandler(res.data.bookings);

        setTimeout(function () {
          getPaymentHandler();
        }, 1000);
        setaddboking(!addbooking);
        setLoading(false);
        openNotification({
          text: "Your Booking updated successfully!",
          heading: "Success!",
          type: "success",
        });
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 400) {
            openNotification({
              text: err.response.data.message,
              heading: "Error!",
              type: "error",
            });
          } else
            openNotification({
              text: "There seems to be a problem, please try again!",
              heading: "Error!",
              type: "error",
            });
        }
        setLoading(false);
        openNotification({
          text: "There seems to be a problem, please try again!",
          heading: "Error!",
          type: "error",
        });
      });
  };

  return (
    <Container className={`${!isPageWide ? "max-w-fit" : "max-w-[54vw]"}`}>
      <div className="relative">
        <Line pinColour={CITY_COLOR_CODES[index % 7]} Transfers={true} />
      </div>

      {booking.booking_type === "Flight" ? (
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
        />
      ) : (
        <div className="mt-3 ml-1 md:ml-7 flex flex-col w-full">
          <div className="flex flex-row w-full justify-between items-center">
            <span className="font-medium  inline">{booking.name}</span>
            <div className="flex flex-row gap-2 justify-center items-center">
              {/* <div className=" text-md font-semibold  text-[#277004] ">
                Included
              </div> */}
            </div>
          </div>

          <div
            id={booking?.id}
            className={`mb-4 mt-3 w-full flex flex-col lg:flex-row lg:items-center space-y-3 items-start justify-between py-[30px] cursor-pointer relative shadow-sm rounded-2xl transition-all border-[1px] hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-3 p-2 ${!isPageWide ? "w-full" : "max-w-[54vw]"}`}
          >
            <div className="flex flex-row items-center justify-between gap-1">
              <div className="grid place-items-center lg:min-w-[6rem] min-w-[4rem] lg:min-h-[6rem] min-h-[4rem] rounded-2xl">
                {!transferImageFailed ? (
                  <ImageLoader
                    is_url={booking.image?.includes("gozo")}
                    className=" object-contain"
                    url={booking.image}
                    leftalign
                    height={booking.image?.includes("gozo") ? "3rem" : "4rem"}
                    width={"4rem"}
                    widthmobile="4rem"
                    onfail={handleTransferImageFailed}
                  ></ImageLoader>
                ) : (
                  <TransportIconFetcher
                    TransportMode={booking.booking_type}
                    Instyle={{
                      fontSize: "2.75rem",
                      marginRight: "0.8rem",
                      color: "black",
                    }}
                  />
                )}
              </div>

              <div className="flex flex-col lg:w-60">
                <div className="sm:text-sm text-[0.85rem]">
                  {booking.booking_type == "Taxi"
                    ? booking.transfer_details &&
                      booking.transfer_details.gozo &&
                      booking.transfer_details.gozo.model
                      ? isPageWide
                        ? booking.transfer_details.gozo.model
                        : truncateString(
                            booking.transfer_details.gozo.model,
                            25
                          )
                      : "Private transfer "
                    : booking.booking_type}

                  {booking.transfer_type === "Intercity one-way" &&
                    booking?.transfer_details?.duration?.text && (
                      <span className="ml-1">
                        ({booking?.transfer_details?.duration?.text})
                      </span>
                    )}
                </div>
                <div className="flex sm:text-sm text-[0.93rem] flex-row text-[#7A7A7A] font-light items-center">
                  {booking.taxi_type && <div>{booking.taxi_type}</div>}
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

            {!payment?.paid_user && booking.booking_type === "Taxi" ? (
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
                    onClick={() => HandleTransport(index, "Add Taxi")}
                    className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[1.6rem] lg:py-2 md:py-2 py-[6px] bg-[#F7E700] hover:text-white hover:bg-black"
                  >
                    Add Taxi
                  </button>
                )}
              </div>
            ) : (
              <div className={`absolute bottom-[1rem] right-6 -m-3`}>
                {loading && (
                  <PulseLoader
                    style={{
                      position: "absolute",
                      top: "-25%",
                      left: "50%",
                      transform: "translate(-50% , -50%)",
                    }}
                    size={6}
                    speedMultiplier={0.6}
                    color="#111"
                  />
                )}

                <div
                  onClick={(e) => {
                    handleCheckboxChange(
                      e,
                      `${addbooking ? "Added Booking" : "Add Booking"}`
                    );
                  }}
                  className="flex flex-row gap-1 items-center cursor-pointer"
                >
                  <CheckboxFormComponent checked={addbooking} />
                  <label className="text-center sm:text-sm text-[0.7rem]">
                    {addbooking ? "Added Booking" : "Add Booking"}
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Container>
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
}) => {
  const isDesktop = useMediaQuery("(min-width:1024px)");
  const [flightImageFailed, setFlightImageFailed] = useState(null);

  const handleFlightImageFailed = () => {
    setFlightImageFailed(true);
  };

  function HandleFlights(i, label) {
    if (!token) {
      return setShowLoginModal(true);
    }

    let name = booking["name"];
    let costings_breakdown = booking["costings_breakdown"];
    let cost = booking["booking_cost"];
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
    let destination_city = booking["destination_city"];
    let origin_iata = booking["origin_code"];
    let destination_iata = booking["destination_code"];
    let user_selected = booking.user_selected;

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
      user_selected
    );

    logEvent({
      action: "Transfer_Add_Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: label,
        event_value: booking.heading,
        event_action: "Transfers",
      },
    });
  }

  function formatDate(dateString) {
    const date = new parseISO(dateString);

    if (isNaN(date.getTime())) {
      return "";
    }
    return format(date, "EEE, dd MMM");
  }

  function createCacheKey(checkIn, checkOut) {
    return `${checkIn}-${checkOut}`;
  }

  function processBookingTimes(checkIn, checkOut) {
    const cache = processBookingTimes.cache || (processBookingTimes.cache = {});

    const cacheKey = createCacheKey(checkIn, checkOut);
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    const checkInTime = format(new Date(checkIn), "hh:mma");
    const checkOutTime = format(new Date(checkOut), "hh:mma");

    const durationInMinutes = differenceInMinutes(
      new Date(checkOut),
      new Date(checkIn)
    );
    const durationHours = Math.floor(durationInMinutes / 60);
    const durationMinutes = durationInMinutes % 60;

    const result = {
      checkInTime: checkInTime,
      checkOutTime: checkOutTime,
      duration: `${durationHours}h ${durationMinutes}m`,
    };

    cache[cacheKey] = result;
    return result;
  }

  var adult;
  try {
    if (booking?.number_of_adults > 1) adult = " Adults";
    else adult = " Adult";
    var child;
    if (booking.number_of_children > 1) child = " Childs";
    else child = " Child";
  } catch {}

  return (
    <div className="mt-3 ml-1 md:ml-7">
      <div className="flex flex-row w-full justify-between items-center">
        <span className="font-medium  inline">{booking.name}</span>
        <div className="flex flex-row gap-2 justify-center items-center ml-auto">
          {/* <div className=" text-md font-semibold  text-[#277004] ">
            Included
          </div> */}
        </div>
      </div>

      <div
        id={booking.id}
        className={`mb-4 mt-2 lg:block ${"mb-4 mt-2 lg:block flex flex-col p-3 "} cursor-pointer relative shadow-sm rounded-2xl transition-all  hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA] border-[1px]  hover:border-[#F7E700]  shadow-[#ECEAEA] lg:p-5 `}
      >
        <div className="flex flex-row gap-4">
          <LogoContainer>
            <div className="">
              {booking?.airline_code && !flightImageFailed ? (
                <ImageContainer>
                  <ImageLoader
                    className=""
                    url={`https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/${booking?.airline_code}.png`}
                    leftalign
                    dimensions={{ width: 800, height: 800 }}
                    borderRadius="100%"
                    height="4rem"
                    width="4rem"
                    widthmobile="4rem"
                    onfail={handleFlightImageFailed}
                  ></ImageLoader>
                </ImageContainer>
              ) : (
                <TransportIconFetcher
                  TransportMode={booking.booking_type}
                  Instyle={{
                    fontSize: "2.75rem",
                    height: "3rem",
                    width: "5rem",
                    color: "black",
                  }}
                />
              )}
            </div>
            <div>
              {booking?.airline_code && (
                <EllipsisTruncation
                  text={booking.airline_name}
                  maxCharacters={8}
                  tooltipText={booking.airline_name}
                  tooltipPosition="top"
                />
              )}

              {!isDesktop && (
                <div>
                  <div
                    className="min-w-max text-[0.8rem]"
                    style={{
                      textAlign: "center",
                      marginTop: "-0.3rem",
                      fontWeight: "300",
                    }}
                  >
                    {booking?.airline_code && (
                      <span className="ml-1">
                        {booking.duration
                          ? ` (${booking.duration}h)`
                          : processBookingTimes(
                              booking.check_in,
                              booking.check_out
                            ).duration}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </LogoContainer>

          <div className="flex lg:flex-row flex-col lg:justify-between justify-center w-full">
            {isDesktop && (
              <InfoContainer>
                <div
                  className="lg:flex flex-row gap-2"
                  style={{
                    display: "grid",
                    gridTemplateColumns: booking.user_selected
                      ? "1fr 1fr 1fr"
                      : "1fr 2fr 1fr",
                  }}
                >
                  <div className="flex flex-col">
                    <div className="text-[#01202B] text-lg font-medium min-w-max">
                      {booking?.airline_code && (
                        <span>
                          {
                            processBookingTimes(
                              booking.check_in,
                              booking.check_out
                            ).checkInTime
                          }
                        </span>
                      )}

                      {booking?.airline_code &&
                        booking?.origin_code &&
                        booking?.origin_code !== "" && (
                          <span className="font-[300] ml-1 ">
                            ({booking.origin_code})
                          </span>
                        )}
                    </div>
                    {!tripsPage &&
                      ITINERARY_STATUSES.itinerary_prepared !==
                        plan?.itinerary_status && (
                        <div className="min-w-max text-[0.8rem] -mt-1">
                          {formatDate(booking.check_in)}
                        </div>
                      )}

                    <div className="min-w-max">{booking.city}</div>
                  </div>

                  <div
                    style={{
                      margin: "0",
                      position: "relative",
                      height: "0px",
                      top: "50%",
                    }}
                  >
                    <Circle style={{ left: 0 }} />
                    <DottedLine></DottedLine>
                    <Circle style={{ right: 0 }} />
                    <Plan>
                      <FaPlane style={{ fontSize: "1.25rem" }} />
                    </Plan>

                    {booking.user_selected ? (
                      <div
                        className="min-w-max text-[0.8rem]"
                        style={{
                          textAlign: "center",
                          marginTop: "0.2rem",
                          fontWeight: "300",
                        }}
                      >
                        {booking?.airline_code && (
                          <span className="ml-1">
                            {booking.duration && booking.duration !== ""
                              ? ` (${booking.duration}h)`
                              : processBookingTimes(
                                  booking.check_in,
                                  booking.check_out
                                ).duration}
                          </span>
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-row justify-between w-full">
                    <div>
                      <div className="text-[#01202B] text-lg font-medium min-w-max">
                        {booking?.airline_code && (
                          <span>
                            {
                              processBookingTimes(
                                booking.check_in,
                                booking.check_out
                              ).checkOutTime
                            }
                          </span>
                        )}
                        {booking?.airline_code &&
                          booking?.destination_code &&
                          booking?.destination_code !== "" && (
                            <span className="font-[300] ml-1">
                              ({booking.destination_code})
                            </span>
                          )}
                      </div>
                      {!tripsPage &&
                        ITINERARY_STATUSES.itinerary_prepared !==
                          plan?.itinerary_status && (
                          <div className="min-w-max text-[0.8rem] -mt-1">
                            {formatDate(booking.check_out)}
                          </div>
                        )}

                      <div className="min-w-max">
                        {booking.destination_city}
                      </div>
                    </div>
                  </div>
                </div>
              </InfoContainer>
            )}

            {isDesktop && (
              <>
                {booking.user_selected ? (
                  <div className="flex lg:flex-col md:flex-row lg:justify-center justify-between items-center">
                    <div className="flex  mr-3 lg:w-full w-full flex-col lg:justify-center justify-start lg:items-end items-start">
                      {booking.duration && (
                        <div className="flex pl-2  font-[300]">
                          <div>
                            {
                              processBookingTimes(
                                booking.check_in,
                                booking.check_out
                              ).duration
                            }
                            {booking.duration
                              ? ` (${booking.duration}h)`
                              : null}
                          </div>
                        </div>
                      )}
                    </div>

                    {!payment?.paid_user && (
                      <div
                        onClick={() => HandleFlights(index, "Change Flight")}
                        className="px-[1.6rem] min-w-fit bg-[#F7E700] py-[8px] lg:px-4 inline-block cursor-pointer rounded-lg shadow-sm ml-2 lg:border-2  border-[1px] border-black  text-black font-medium text-sm"
                      >
                        Change Flight
                      </div>
                    )}
                  </div>
                ) : (
                  !payment?.paid_user && (
                    <Button
                      bgColor={"#F7E700"}
                      borderRadius="8px"
                      fontWeight="400"
                      padding="0.6rem 2.2rem"
                      hoverColor="white"
                      margin="auto 0px"
                      onclick={() => {
                        HandleFlights(index, "Add Flight");
                      }}
                    >
                      Add Flight
                    </Button>
                  )
                )}
              </>
            )}
          </div>
        </div>

        {!isDesktop && (
          <>
            <InfoContainer>
              <div
                className="lg:flex flex-row gap-2"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                }}
              >
                <div className="flex flex-col">
                  <div className="text-[#01202B] text-lg font-medium min-w-max">
                    {booking?.airline_code && (
                      <span>
                        {
                          processBookingTimes(
                            booking.check_in,
                            booking.check_out
                          ).checkInTime
                        }
                      </span>
                    )}

                    {booking?.airline_code &&
                      booking?.origin_code &&
                      booking?.origin_code !== "" && (
                        <span className="font-[300] ml-1 ">
                          ({booking.origin_code})
                        </span>
                      )}
                  </div>
                  {!tripsPage &&
                    ITINERARY_STATUSES.itinerary_prepared !==
                      plan?.itinerary_status && (
                      <div className="min-w-max text-[0.8rem] -mt-1">
                        {formatDate(booking.check_in)}
                      </div>
                    )}

                  <div
                    className="min-w-max"
                    style={{ fontWeight: "400", fontSize: "0.8rem" }}
                  >
                    {booking.city}
                  </div>
                </div>

                <div
                  style={{
                    margin: "0",
                    position: "relative",
                    height: "0px",
                    top: "50%",
                  }}
                >
                  <Circle style={{ left: 0 }} />
                  <DottedLine></DottedLine>
                  <Circle style={{ right: 0 }} />
                  <Plan>
                    <FaPlane style={{ fontSize: "1.25rem" }} />
                  </Plan>
                </div>

                <div className="flex flex-row justify-between w-full">
                  <div>
                    <div className="text-[#01202B] text-lg font-medium min-w-max">
                      {booking?.airline_code && (
                        <span>
                          {
                            processBookingTimes(
                              booking.check_in,
                              booking.check_out
                            ).checkOutTime
                          }
                        </span>
                      )}
                      {booking?.airline_code &&
                        booking?.destination_code &&
                        booking?.destination_code !== "" && (
                          <span className="font-[300] ml-1">
                            ({booking.destination_code})
                          </span>
                        )}
                    </div>
                    {!tripsPage &&
                      ITINERARY_STATUSES.itinerary_prepared !==
                        plan?.itinerary_status && (
                        <div className="min-w-max text-[0.8rem] -mt-1">
                          {formatDate(booking.check_out)}
                        </div>
                      )}
                    <div
                      className="min-w-max"
                      style={{ fontWeight: "400", fontSize: "0.8rem" }}
                    >
                      {booking.destination_city}
                    </div>
                  </div>
                </div>
              </div>

              <PriceContainer>
                <FlexBox>
                  {booking.user_selected ? (
                    <div>
                      <Cost className="font-lexend">
                        {booking.booking_cost
                          ? "₹" +
                            getIndianPrice(
                              Math.round(booking.booking_cost / 100)
                            ) +
                            "/-"
                          : null}
                      </Cost>
                      {booking.number_of_adults > 0 && (
                        <Text>
                          {"(" +
                            booking.number_of_adults +
                            adult +
                            (booking.number_of_children
                              ? ", " + booking.number_of_children + child
                              : "") +
                            ")"}
                        </Text>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </FlexBox>
                {booking.user_selected ? (
                  <div>
                    {!payment?.paid_user && (
                      <div
                        onClick={() => HandleFlights(props.index, "Change")}
                        className="px-[1.6rem] min-w-fit bg-[#F7E700] py-[8px] lg:px-4   inline-block cursor-pointer rounded-lg shadow-sm lg:border-2  border-[1px] border-black  text-black font-medium text-sm"
                      >
                        Change
                      </div>
                    )}
                  </div>
                ) : (
                  !payment?.paid_user && (
                    <div>
                      <div
                        onClick={() => HandleFlights(index, "Add Flight")}
                        className="px-[1.8rem] bg-[#F7E700] py-[8px] inline-block cursor-pointer rounded-lg shadow-sm  border-2 border-black  text-black font-medium text-sm"
                      >
                        Add Flight
                      </div>
                    </div>
                  )
                )}
              </PriceContainer>
            </InfoContainer>
          </>
        )}
      </div>
    </div>
  );
};
