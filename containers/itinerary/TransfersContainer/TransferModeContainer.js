import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TransportIconFetcher } from "../../../helper/TransportIconFetcher";
import ImageLoader from "../../../components/ImageLoader";
import { differenceInMinutes, format, parseISO } from "date-fns";
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
import TransferEditDrawer from "../../../components/drawers/routeTransfer/TransferEditDrawer";
import routeAlternates from "../../../services/itinerary/brief/routeAlternates";
import axiosRoundTripInstance from "../../../services/itinerary/brief/roundTripSuggestion";
import { logEvent } from "../../../services/ga/Index";

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

const Container = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 30px auto;
  min-height: 5rem;
  @media screen and (min-width: 768px) {
    min-height: 8rem;
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

const FacilityContainer = styled.div``;

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

const TransferModeContainer = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [addbooking, setaddboking] = useState(props.userSelected);
  const [loading, setLoading] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [alternateRoutes, setAlternateRoutes] = useState({});
  const [roundTripSuggestions, setRoundTripSuggestions] = useState(null);
  const [multiCitySuggestions, setMultiCitySuggestions] = useState(null);
  const [loadingAlternates, setLoadingAlternates] = useState(true);
  const [alternatesError, setAlternatesError] = useState(null);
  const [flightImageFailed, setFlightImageFailed] = useState(null);
  const [transferImageFailed, setTransferImageFailed] = useState(null);

  useEffect(() => {
    setaddboking(props.userSelected);
  }, [props.userSelected]);

  const handleFlightImageFailed = () => {
    setFlightImageFailed(true);
  };

  const handleTransferImageFailed = () => {
    setTransferImageFailed(true);
  };

  function handleCheckboxChange(e, label) {
    if (!props.payment?.is_registration_needed) {
      if (props.token && props.payment?.user_allowed_to_pay) {
        _updateSelectedTransfer();
        e.stopPropagation();
      } else {
        props.openNotification({
          text: "Oops, this action is not allowed on another user's itinerary.",
          heading: "Error!",
          type: "error",
        });
        props.setShowLoginModal();
        e.stopPropagation();
      }
    }

    logEvent({
      action: "Transfer_Add_Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: label,
        event_value: props?.heading,
        event_action: "Transfers",
      },
    });
  }

  const isDesktop = useMediaQuery("(min-width:1024px)");

  function HandleFlights(i, label) {
    if (!props.token) {
      return props.setShowLoginModal(true);
    }

    let name = props.booking["name"];
    let costings_breakdown = props.booking["costings_breakdown"];
    let cost = props.booking["booking_cost"];
    let itinerary_id = props.booking["itinerary_id"];
    let itinerary_name = props.booking["itinerary_name"];
    let tailored_id = props.booking["tailored_itinerary"];
    let id = props.booking["id"];
    let check_in = props.booking["check_in"];
    let check_out = props.booking["check_out"];
    let pax = {
      number_of_adults: props.booking["number_of_adults"],
      number_of_children: props.booking["number_of_children"],
      number_of_infants: props.booking["number_of_infants"],
    };
    let city = props.booking["city"];
    let taxi_type = props.booking["taxi_type"];
    let transfer_type = props.booking["transfer_type"];
    let destination_city = props.booking["destination_city"];
    let origin_iata = props.booking["origin_code"];
    let destination_iata = props.booking["destination_code"];
    let user_selected = props.userSelected;

    props._changeFlightHandler(
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
        event_value: props.heading,
        event_action: "Transfers",
      },
    });
  }

  function HandleTransport(i, label) {
    if (!props.token) {
      return props.setShowLoginModal(true);
    }
    let name = props.booking["name"];
    let costings_breakdown = props.booking["costings_breakdown"];
    let cost = props.booking["booking_cost"];
    let itinerary_id = props.booking["itinerary_id"];
    let itinerary_name = props.booking["itinerary_name"];
    let tailored_id = props.booking["tailored_itinerary"];
    let id = props.booking["id"];
    let check_in = props.booking["check_in"];
    let check_out = props.booking["check_out"];
    let pax = {
      number_of_adults: props.booking["number_of_adults"],
      number_of_children: props.booking["number_of_children"],
      number_of_infants: props.booking["number_of_infants"],
    };
    let city = props.booking["city"];
    let taxi_type = props.booking["taxi_type"];
    let transfer_type = props.booking["transfer_type"];
    let destination_city = props.booking["destination_city"];
    let origin_iata = props.booking["origin_city_iata_code"];
    let destination_iata = props.booking["destination_city_iata_code"];

    props._changeTaxiHandler(
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
      transfer_type
    );

    logEvent({
      action: "Transfer_Add_Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: label,
        event_value: props.heading,
        event_action: "Transfers",
      },
    });
  }

  const Facilities = [
    props.booking_type == "Taxi" || props.booking_type == "Bus"
      ? props?.costings_breakdown.hasOwnProperty("luggage_bags") &&
        props?.costings_breakdown?.luggage_bags > 0
        ? `${props?.costings_breakdown?.luggage_bags} Luggage bags`
        : "2 Luggage bags"
      : null,
    props?.booking?.transfer_type === "Intracity" ? "250 kms per day" : null,

    props?.costings_breakdown?.taxi_occupancy ||
    props?.costings_breakdown?.no_of_seats
      ? `${
          props?.costings_breakdown?.taxi_occupancy
            ? props?.costings_breakdown?.taxi_occupancy
            : props?.costings_breakdown?.no_of_seats
        } Seats`
      : null,
    props?.booking?.transfer_type === "Intercity one-way"
      ? props?.costings_breakdown?.distance?.text
        ? `${props?.costings_breakdown?.distance?.text}`
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
        id: props.booking["id"],
        booking_type: props.booking_type,
        itinerary_type: "Tailored",
        user_selected: !props?.userSelected,
        itinerary_id: props.booking["itinerary_id"],
        taxi_type: props.booking["taxi_type"],
        transfer_type: props.booking["transfer_type"],

        costings_breakdown: props.booking?.costings_breakdown,
      },
    ];
    axiosbookingupdateinstance
      .post("?booking_type=Taxi,Bus,Ferry,Train,Flight", updated_bookings_arr, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((res) => {
        props._updateTaxiBookingHandler(res.data.bookings);

        setTimeout(function () {
          props.getPaymentHandler();
        }, 1000);
        setaddboking(!addbooking);
        setLoading(false);
        props.openNotification({
          text: "Your Booking updated successfully!",
          heading: "Success!",
          type: "success",
        });
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 400) {
            props.openNotification({
              text: err.response.data.message,
              heading: "Error!",
              type: "error",
            });
          } else
            props.openNotification({
              text: "There seems to be a problem, please try again!",
              heading: "Error!",
              type: "error",
            });
        }
        setLoading(false);
        props.openNotification({
          text: "There seems to be a problem, please try again!",
          heading: "Error!",
          type: "error",
        });
      });
  };

  const roundTripSuggestion = () => {
    setLoadingAlternates(true);
    axiosRoundTripInstance
      .get(`?itinerary_id=${props?.itinerary_id}`)
      .then((response) => {
        const results = response.data;

        for (let i = 0; i < results.length; i++) {
          if (
            results[i].success &&
            results[i].transfer_type === "Intercity round-trip"
          ) {
            setRoundTripSuggestions(results[i]);
          } else if (
            results[i].success &&
            results[i].transfer_type === "Multicity"
          ) {
            setMultiCitySuggestions(results[i]);
          }
        }
        setLoadingAlternates(false);
      })
      .catch((err) => {
        console.log("[ERROR][TransferEdit]: ", err);
      });
  };

  const handleTransferEdit = () => {
    setShowDrawer(true);
    roundTripSuggestion();
    routeAlternates
      .get(`/?route_id=` + props?.route?.transfers?.id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          setAlternateRoutes(data);
        }
        setLoadingAlternates(false);
      })
      .catch((err) => {
        setLoadingAlternates(false);
        if (err.response.status === 404) {
          setAlternatesError(
            "No route found, please get in touch with us to complete this booking!"
          );
        } else {
          setAlternatesError(
            "There seems to be problem, please try again! adsfasdf"
          );
        }
      });

    logEvent({
      action: "Transfer_Add_Change",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Add Transfer",
        event_value: props?.heading,
        event_action: "Transfers",
      },
    });
  };

  var adult;
  try {
    if (props?.booking?.number_of_adults > 1) adult = " Adults";
    else adult = " Adult";
    var child;
    if (props.booking.number_of_children > 1) child = " Childs";
    else child = " Child";
  } catch {}

  return (
    <Container>
      {props.routes && props?.routes.length > 1 ? (
        <div style={{ position: "relative" }}>
          <Line pinColour={props.pinColour} Transfers={true} />
        </div>
      ) : (
        <div style={{ position: "relative" }}></div>
      )}

      {props?.booking ? (
        <>
          {props?.booking_type == "Flight" ? (
            <div className="mt-3 lg:ml-7">
              <div className="flex flex-row w-full justify-between items-center">
                <span className="font-medium  inline">{props.heading}</span>
                <div className="flex flex-row gap-2 justify-center items-center">
                  <div
                    className={`${
                      props.booking_type == "Train"
                        ? "lg:bottom-4 hidden"
                        : "lg:bottom-[3.6rem] hidden"
                    } `}
                    onClick={(e) => {
                      handleCheckboxChange(e);
                    }}
                  >
                    <CheckboxFormComponent checked={addbooking} />{" "}
                  </div>
                  {props.userSelected ? (
                    <div className=" text-md font-semibold  text-[#277004] ">
                      Included
                    </div>
                  ) : (
                    <div className=" text-md font-semibold text-[#E00000]  ">
                      Excluded
                    </div>
                  )}{" "}
                </div>
              </div>
              <div
                id={props.booking.id}
                className={`mb-4 mt-2 lg:block ${
                  !props.userSelected
                    ? "mb-4 mt-3 lg:block flex flex-col-reverse p-3 py-4"
                    : "mb-4 mt-2 lg:block flex flex-col p-3 "
                }    cursor-pointer relative shadow-sm rounded-2xl transition-all  hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA] border-[1px]  hover:border-[#F7E700]  shadow-[#ECEAEA] lg:p-5 `}
              >
                <div className="flex flex-row gap-4    ">
                  {props.userSelected && (
                    <LogoContainer>
                      <div className="">
                        {props.booking?.airline_code && !flightImageFailed ? (
                          <ImageContainer>
                            <ImageLoader
                              className=""
                              url={`https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/${props.booking?.airline_code}.png`}
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
                            TransportMode={props.booking_type}
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
                        {props.booking?.airline_code && (
                          <EllipsisTruncation
                            text={props?.booking.airline_name}
                            maxCharacters={8}
                            tooltipText={props?.booking.airline_name}
                            tooltipPosition="top"
                          />
                        )}
                        {!isDesktop && (
                          <div>
                            {props.userSelected ? (
                              <div
                                className="min-w-max text-[0.8rem]"
                                style={{
                                  textAlign: "center",
                                  marginTop: "-0.3rem",
                                  fontWeight: "300",
                                }}
                              >
                                {props.booking.via_airports &&
                                props.booking.costings_breakdown
                                  ? `(${
                                      props.booking.costings_breakdown
                                        .Segments[0].length - 1
                                    } Lay)`
                                  : "(Nonstop)"}
                                {props.booking?.airline_code && (
                                  <span className="ml-1">
                                    {props.booking.duration
                                      ? ` (${props.booking.duration}h)`
                                      : processBookingTimes(
                                          props.booking.check_in,
                                          props.booking.check_out
                                        ).duration}
                                  </span>
                                )}
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </LogoContainer>
                  )}

                  <div className="flex lg:flex-row flex-col lg:justify-between justify-center w-full">
                    {isDesktop && (
                      <InfoContainer>
                        <div
                          className="lg:flex flex-row gap-2"
                          style={{
                            display: "grid",
                            gridTemplateColumns: props.userSelected
                              ? "1fr 1fr 1fr"
                              : "1fr 2fr 1fr",
                          }}
                        >
                          <div className="flex flex-col">
                            <div className="text-[#01202B] text-lg font-medium min-w-max">
                              {props.booking?.airline_code && (
                                <span>
                                  {
                                    processBookingTimes(
                                      props.booking.check_in,
                                      props.booking.check_out
                                    ).checkInTime
                                  }
                                </span>
                              )}

                              {props.booking?.airline_code &&
                                props.booking?.origin_code &&
                                props.booking?.origin_code !== "" && (
                                  <span className="font-[300] ml-1 ">
                                    ({props.booking.origin_code})
                                  </span>
                                )}
                            </div>
                            {ITINERARY_STATUSES.itinerary_prepared !==
                              props.plan.itinerary_status && (
                              <div className="min-w-max text-[0.8rem] -mt-1">
                                {formatDate(props.booking.check_in)}
                              </div>
                            )}

                            <div className="min-w-max">
                              {props.booking.city}
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

                            {props.userSelected ? (
                              <div
                                className="min-w-max text-[0.8rem]"
                                style={{
                                  textAlign: "center",
                                  marginTop: "0.2rem",
                                  fontWeight: "300",
                                }}
                              >
                                {props.booking.via_airports &&
                                props.booking.costings_breakdown
                                  ? `(${
                                      props.booking.costings_breakdown
                                        .Segments[0].length - 1
                                    } Lay)`
                                  : "(Nonstop)"}
                                {props.booking?.airline_code && (
                                  <span className="ml-1">
                                    {props.booking.duration &&
                                    props.booking.duration !== ""
                                      ? ` (${props.booking.duration}h)`
                                      : processBookingTimes(
                                          props.booking.check_in,
                                          props.booking.check_out
                                        ).duration}
                                  </span>
                                )}
                              </div>
                            ) : null}
                          </div>

                          <div className="flex flex-row justify-between w-full">
                            <div>
                              <div className="text-[#01202B] text-lg font-medium min-w-max">
                                {props.booking?.airline_code && (
                                  <span>
                                    {
                                      processBookingTimes(
                                        props.booking.check_in,
                                        props.booking.check_out
                                      ).checkOutTime
                                    }
                                  </span>
                                )}
                                {props.booking?.airline_code &&
                                  props.booking?.destination_code &&
                                  props.booking?.destination_code !== "" && (
                                    <span className="font-[300] ml-1">
                                      ({props.booking.destination_code})
                                    </span>
                                  )}
                              </div>
                              {ITINERARY_STATUSES.itinerary_prepared !==
                                props.plan.itinerary_status && (
                                <div className="min-w-max text-[0.8rem] -mt-1">
                                  {formatDate(props.booking.check_out)}
                                </div>
                              )}
                              <div className="min-w-max">
                                {props.booking.destination_city}
                              </div>
                            </div>
                          </div>
                        </div>
                      </InfoContainer>
                    )}
                    {isDesktop && (
                      <>
                        {props.userSelected ? (
                          <div className="flex lg:flex-col md:flex-row lg:justify-center justify-between items-center">
                            <div className="flex  mr-3 lg:w-full w-full flex-col lg:justify-center justify-start lg:items-end items-start">
                              {props.booking.duration && (
                                <div className="flex pl-2  font-[300]">
                                  <div>
                                    {props.booking.via_airports
                                      ? `(${
                                          props.booking.costings_breakdown
                                            .Segments[0].length - 1
                                        } Lay)`
                                      : "(Nonstop)"}
                                    {
                                      processBookingTimes(
                                        props.booking.check_in,
                                        props.booking.check_out
                                      ).duration
                                    }
                                    {props.booking.duration
                                      ? ` (${props.booking.duration}h)`
                                      : null}
                                  </div>
                                </div>
                              )}
                            </div>

                            {!props?.payment?.paid_user && (
                              <div
                                onClick={() =>
                                  HandleFlights(props.index, "Change Flight")
                                }
                                className="px-[1.6rem] min-w-fit bg-[#F7E700] py-[8px] lg:px-4 inline-block cursor-pointer rounded-lg shadow-sm ml-2 lg:border-2  border-[1px] border-black  text-black font-medium text-sm"
                              >
                                Change Flight
                              </div>
                            )}
                          </div>
                        ) : (
                          !props?.payment?.paid_user && (
                            <Button
                              bgColor={"#F7E700"}
                              borderRadius="8px"
                              fontWeight="400"
                              padding="0.6rem 2.2rem"
                              hoverColor="white"
                              margin="auto 0px"
                              onclick={() => {
                                HandleFlights(props.index, "Add Flight");
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
                            {props.booking?.airline_code && (
                              <span>
                                {
                                  processBookingTimes(
                                    props.booking.check_in,
                                    props.booking.check_out
                                  ).checkInTime
                                }
                              </span>
                            )}

                            {props.booking?.airline_code &&
                              props.booking?.origin_code &&
                              props.booking?.origin_code !== "" && (
                                <span className="font-[300] ml-1 ">
                                  ({props.booking.origin_code})
                                </span>
                              )}
                          </div>
                          {ITINERARY_STATUSES.itinerary_prepared !==
                            props?.plan?.itinerary_status && (
                            <div className="min-w-max text-[0.8rem] -mt-1">
                              {formatDate(props.booking.check_in)}
                            </div>
                          )}

                          <div
                            className="min-w-max"
                            style={{ fontWeight: "400", fontSize: "0.8rem" }}
                          >
                            {props.booking.city}
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
                              {props.booking?.airline_code && (
                                <span>
                                  {
                                    processBookingTimes(
                                      props.booking.check_in,
                                      props.booking.check_out
                                    ).checkOutTime
                                  }
                                </span>
                              )}
                              {props.booking?.airline_code &&
                                props.booking?.destination_code &&
                                props.booking?.destination_code !== "" && (
                                  <span className="font-[300] ml-1">
                                    ({props.booking.destination_code})
                                  </span>
                                )}
                            </div>
                            {ITINERARY_STATUSES.itinerary_prepared !==
                              props?.plan?.itinerary_status && (
                              <div className="min-w-max text-[0.8rem] -mt-1">
                                {formatDate(props.booking.check_out)}
                              </div>
                            )}
                            <div
                              className="min-w-max"
                              style={{ fontWeight: "400", fontSize: "0.8rem" }}
                            >
                              {props.booking.destination_city}
                            </div>
                          </div>
                        </div>
                      </div>

                      <PriceContainer>
                        <FlexBox>
                          {props.userSelected ? (
                            <div>
                              <Cost className="font-lexend">
                                {props.booking.booking_cost
                                  ? "₹" +
                                    getIndianPrice(
                                      Math.round(
                                        props.booking.booking_cost / 100
                                      )
                                    ) +
                                    "/-"
                                  : null}
                              </Cost>
                              {props.booking.number_of_adults > 0 && (
                                <Text>
                                  {"(" +
                                    props.booking.number_of_adults +
                                    adult +
                                    (props.booking.number_of_children
                                      ? ", " +
                                        props.booking.number_of_children +
                                        child
                                      : "") +
                                    ")"}
                                </Text>
                              )}
                            </div>
                          ) : (
                            <></>
                          )}
                        </FlexBox>
                        {props.userSelected ? (
                          <div>
                            {!props?.payment?.paid_user && (
                              <div
                                onClick={() =>
                                  HandleFlights(props.index, "Change")
                                }
                                className="px-[1.6rem] min-w-fit bg-[#F7E700] py-[8px] lg:px-4   inline-block cursor-pointer rounded-lg shadow-sm lg:border-2  border-[1px] border-black  text-black font-medium text-sm"
                              >
                                Change
                              </div>
                            )}
                          </div>
                        ) : (
                          !props?.payment?.paid_user && (
                            <div>
                              <div
                                onClick={() =>
                                  HandleFlights(props.index, "Add Flight")
                                }
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
          ) : (
            <div className="mt-3 lg:ml-7 sm:ml-2 ml-0 flex flex-col">
              <div className="flex flex-row w-full justify-between items-center">
                <span className="font-medium  inline">{props.heading}</span>
                <div className="flex flex-row gap-2 justify-center items-center">
                  <div
                    className={`${
                      props.booking_type !== "Taxi"
                        ? "lg:bottom-4 hidden"
                        : "lg:bottom-[3.6rem] hidden"
                    } `}
                    onClick={(e) => {
                      handleCheckboxChange(
                        e,
                        `${addbooking ? "Added Booking" : "Add Booking"}`
                      );
                    }}
                  >
                    <CheckboxFormComponent checked={addbooking} />{" "}
                  </div>
                  {props.userSelected ? (
                    <div className=" text-md font-semibold  text-[#277004] ">
                      Included
                    </div>
                  ) : (
                    <div className=" text-md font-semibold text-[#E00000]  ">
                      Excluded
                    </div>
                  )}{" "}
                </div>
              </div>

              <div
                id={props?.booking?.id}
                className="mb-4 mt-3 w-full flex flex-col lg:flex-row lg:items-center space-y-3 items-start justify-between py-[30px] cursor-pointer relative shadow-sm rounded-2xl transition-all border-[1px] hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-3 p-2"
              >
                <div className="flex flex-row items-center space-x-3">
                  {props.icon && (
                    <div className="grid  place-items-center  lg:min-w-[6rem] min-w-[4rem] lg:min-h-[6rem] min-h-[4rem]  rounded-2xl">
                      {props.booking_type === "Flight" ? (
                        <TransportIconFetcher
                          TransportMode={props.booking_type}
                          Instyle={{
                            fontSize: "2.75rem",
                            marginRight: "0.8rem",
                            color: "black",
                          }}
                        />
                      ) : !transferImageFailed ? (
                        props.icon && (
                          <ImageLoader
                            is_url={props.icon.includes("gozo")}
                            className=" object-contain"
                            url={props.icon}
                            leftalign
                            height={
                              props.icon.includes("gozo") ? "3rem" : "4rem"
                            }
                            width={"4rem"}
                            widthmobile="4rem"
                            onfail={handleTransferImageFailed}
                          ></ImageLoader>
                        )
                      ) : (
                        <TransportIconFetcher
                          TransportMode={props.booking_type}
                          Instyle={{
                            fontSize: "2.75rem",
                            marginRight: "0.8rem",
                            color: "black",
                          }}
                        />
                      )}
                    </div>
                  )}

                  <div className="flex flex-col lg:w-96">
                    <div className="sm:text-sm text-[0.85rem]">
                      {props.booking_type == "Taxi"
                        ? props.booking.costings_breakdown &&
                          props.booking.costings_breakdown.gozo &&
                          props.booking.costings_breakdown.gozo.model
                          ? isPageWide
                            ? props.booking.costings_breakdown.gozo.model
                            : truncateString(
                                props.booking.costings_breakdown.gozo.model,
                                25
                              )
                          : "Private transfer "
                        : props.booking_type}
                      {props.booking.transfer_type === "Intercity one-way" &&
                        props?.booking?.costings_breakdown?.duration?.text && (
                          <span className="ml-1">
                            ({props.booking?.costings_breakdown?.duration?.text}
                            )
                          </span>
                        )}
                    </div>
                    <div className="flex sm:text-sm text-[0.93rem] flex-row text-[#7A7A7A] font-light items-center">
                      {props.taxi_type && <div>{props.taxi_type}</div>}
                    </div>

                    {props?.costings_breakdown && (
                      <FacilityContainer className="text-[#01202B] font-normal flex flex-row justify-start items-center mt-1 flex-wrap">
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
                      </FacilityContainer>
                    )}
                  </div>
                </div>

                {!props?.payment?.paid_user && props.booking_type === "Taxi" ? (
                  <div className="w-full flex flex-row items-center justify-end cursor-pointer pr-2">
                    {addbooking ? (
                      <button
                        onClick={() =>
                          HandleTransport(props.index, "Change Taxi")
                        }
                        className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[1.6rem] lg:py-2 md:py-2 py-[6px] bg-[#F7E700] hover:text-white hover:bg-black"
                      >
                        {isDesktop ? "Change Taxi" : "Change"}
                      </button>
                    ) : (
                      <button
                        onClick={() => HandleTransport(props.index, "Add Taxi")}
                        className="text-sm lg:text-[1rem] md:text[1rem] font-medium lg:font-normal md:font-normal border-2 border-black rounded-lg px-[1.6rem] lg:py-2 md:py-2 py-[6px] bg-[#F7E700] hover:text-white hover:bg-black"
                      >
                        Add Taxi
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <div
                      className={`absolute  ${
                        true
                          ? `${
                              props.booking_type == "Taxi"
                                ? "lg:bottom-[3.6rem]"
                                : "lg:bottom-[3.6rem]"
                            }  bottom-[1.5rem] `
                          : `${
                              props.payment?.paid_user ||
                              !props.payment?.user_allowed_to_pay
                                ? "lg:bottom-10 bottom-[1.2rem]"
                                : "lg:bottom-10 bottom-[2.5rem]"
                            }`
                      } right-8 -m-3`}
                    >
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
                        className="flex flex-row gap-1 items-center  cursor-pointer"
                      >
                        <CheckboxFormComponent checked={addbooking} />
                        <label className="text-center sm:text-sm text-[0.7rem]">
                          {addbooking ? "Added Booking" : "Add Booking"}
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-start ml-4">
          <button
            onClick={handleTransferEdit}
            className="text-blue hover:underline"
          >
            + Add Transfer
          </button>
        </div>
      )}

      <TransferEditDrawer
        addOrEdit={"transferAdd"}
        itinerary_id={props?.itinerary_id}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        selectedTransferHeading={props?.route?.heading}
        origin={props.originCity}
        destination={props.destinationCity}
        alternateRoutes={alternateRoutes}
        roundTripSuggestions={roundTripSuggestions}
        multiCitySuggestions={multiCitySuggestions}
        loadingAlternates={loadingAlternates}
        setLoadingAlternates={setLoadingAlternates}
        alternatesError={alternatesError}
        day_slab_index={props?.route?.element_location?.day_slab_index}
        element_index={props?.route?.element_index}
        fetchData={props?.fetchData}
        setShowLoginModal={props?.setShowLoginModal}
        check_in={props?.route?.check_in}
      />
    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    notificationText: state.Notification.text,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(TransferModeContainer);
