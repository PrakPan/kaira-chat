import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TransportIconFetcher } from "../../../helper/TransportIconFetcher";
import ImageLoader from "../../../components/ImageLoader";
import { differenceInMinutes, format, parseISO } from "date-fns";
import * as ga from "../../../services/ga/Index";
import { FaPlane } from "react-icons/fa";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { LivelyButton } from "../../../components/LiveleyButton";
import { MdEdit } from "react-icons/md";
import useMediaQuery from "../../../components/media";
import { ITINERARY_STATUSES } from "../../../services/constants";
import CheckboxFormComponent from "../../../components/FormComponents/CheckboxFormComponent";
import axiosbookingupdateinstance from "../../../services/bookings/UpdateBookings";
import { PulseLoader } from "react-spinners";
import EllipsisTruncation from "../../EllipsisTruncate";
import { checkNestedProperties } from "../../../helper/shortHelpers";
import { connect } from "react-redux";
import { openNotification } from "../../../store/actions/notification";
import { getIndianPrice } from "../../../services/getIndianPrice";
import Button from "../../../components/ui/button/Index";
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
  width: 14rem;
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
//
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
  /* background-image: linear-gradient(90deg,transparent,transparent 20%,#fff 50%,#fff 100%),linear-gradient(87deg,#0d6efd,#00fff0,#d4ff00,#ff7000,#ff0000); */
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
    width: 12.4rem;
    height: 1px;
    top: 81px;
    right: -81px;
  }
  /* border-style: dashed;
  border-width: 1.4px;
  position: absolute;
  left: 50%;
  

  border-color: ${(props) => (props.pinColour ? props.pinColour : "black")};
  min-height: 10vw;
  height: 100%;
  margin: 0rem 0 0rem 0rem; */
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
    throw new Error("Invalid date string");
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
  const [addbooking, setaddboking] = useState(props.userSelected);
  const [loading, setLoading] = useState(false);
  const [UpdateBookingState, setUpdateBookingState] = useState(false);
  useEffect(() => {
    setaddboking(props.userSelected);
  }, [props.userSelected]);
  function handleCheckboxChange(e) {
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
  }
  const isDesktop = useMediaQuery("(min-width:1024px)");

  function HandleFlights(i) {
    if (!props.token) {
      return props.setShowLoginModal(true);
    }

    let name = props.booking["name"];
    let costings_breakdown = props.booking["costings_breakdown"];
    let cost = props.booking["booking_cost"];
    let itinerary_id = props.booking["itinerary_id"];
    let itinerary_name = props.booking["itinerary_name"];
    let booking_type = props.booking["booking_type"];

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
    let room_type = props.booking["room_type"];
    let taxi_type = props.booking["taxi_type"];
    let transfer_type = props.booking["transfer_type"];
    let city_id = props.booking["city_id"];
    let destination_city = props.booking["destination_city"];
    let duration = props.booking["duration"];
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
  }
  function HandleTransport(i) {
    if (!props.token) {
      return props.setShowLoginModal(true);
    }
      let name = props.booking["name"];
      let costings_breakdown = props.booking["costings_breakdown"];
      let cost = props.booking["booking_cost"];
      let itinerary_id = props.booking["itinerary_id"];
      let itinerary_name = props.booking["itinerary_name"];
      let booking_type = props.booking["booking_type"];

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
      let room_type = props.booking["room_type"];
      let taxi_type = props.booking["taxi_type"];
      let transfer_type = props.booking["transfer_type"];
      let city_id = props.booking["city_id"];
      let destination_city = props.booking["destination_city"];
      let duration = props.booking["duration"];
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
  }
  const Facilities = [
    props.booking_type == "Taxi" || props.booking_type == "Bus"
      ? props?.costings_breakdown.hasOwnProperty("luggage_bags")
        ? `${props?.costings_breakdown?.luggage_bags} Luggage bags`
        : "2 Luggage bags"
      : null,
    props?.booking?.transfer_type == "Intracity" ? "250 kms per day" : null,

    props?.costings_breakdown?.taxi_occupancy ||
    props?.costings_breakdown?.no_of_seats
      ? `${
          props?.costings_breakdown?.taxi_occupancy
            ? props?.costings_breakdown?.taxi_occupancy
            : props?.costings_breakdown?.no_of_seats
        } Seats`
      : null,
    props?.costings_breakdown?.distance?.text
      ? `${props?.costings_breakdown?.distance?.text}`
      : null,
  ];

  const _updateSelectedTransfer = () => {
    setUpdateBookingState(true);
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
    console.dir(updated_bookings_arr);
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
        setUpdateBookingState(false);
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
        setUpdateBookingState(false);
        setLoading(false);
        window.alert("There seems to be a problem, please try again!");
      });
  };

  var adult;
  if (props.booking.number_of_adults > 1) adult = " Adults";
  else adult = " Adult";
  var child;
  if (props.booking.number_of_children > 1) child = " Childs";
  else child = " Child";
  return (
    <Container>
      {props.routes && props?.routes.length > 1 ? (
        <div style={{ position: "relative" }}>
          <Line pinColour={props.pinColour} Transfers={true} />
        </div>
      ) : (
        <div style={{ position: "relative" }}></div>
      )}

      {props.booking_type == "Flight" ? (
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
              !props.userSelected ? "flex flex-col-reverse" : "flex flex-col"
            }    cursor-pointer  relative shadow-sm rounded-2xl transition-all  hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA] border-[1px]  hover:border-[#F7E700]  shadow-[#ECEAEA] lg:p-5 p-3  `}
          >
            <div className="flex flex-row gap-4    ">
              {props.userSelected && (
                <LogoContainer>
                  <div className="">
                    {props.booking?.airline_code ? (
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
                                  props.booking.costings_breakdown.Segments[0]
                                    .length - 1
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

                          {props.booking?.airline_code && (
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

                        <div className="min-w-max">{props.booking.city}</div>
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
                                  props.booking.costings_breakdown.Segments[0]
                                    .length - 1
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
                            {props.booking?.airline_code && (
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
                            onClick={() => HandleFlights(props.index)}
                            className="px-[1.6rem] min-w-fit bg-[#F7E700] py-[8px] lg:px-4   inline-block cursor-pointer rounded-lg shadow-sm ml-2 lg:border-2  border-[1px] border-black  text-black font-medium text-sm"
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
                            HandleFlights(props.index);
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

                        {props.booking?.airline_code && (
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
                          {props.booking?.airline_code && (
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
                                  Math.round(props.booking.booking_cost / 100)
                                ) +
                                "/-"
                              : null}
                          </Cost>
                          <Text>
                            {"( " +
                              props.booking.number_of_adults +
                              adult +
                              (props.booking.number_of_children
                                ? ", " +
                                  props.booking.number_of_children +
                                  child
                                : "") +
                              " )"}
                          </Text>
                        </div>
                      ) : (
                        <></>
                      )}
                    </FlexBox>
                    {props.userSelected ? (
                      <div>
                        {!props?.payment?.paid_user && (
                          <div
                            onClick={() => HandleFlights(props.index)}
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
                            onClick={() => HandleFlights(props.index)}
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
        <div className="mt-3 lg:ml-7 sm:ml-2 ml-0">
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
            className="mb-4 mt-3 group min-w-full w-max  flex flex-row gap-1   py-[20px]  cursor-pointer relative shadow-sm rounded-2xl transition-all border-[1px] hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-3 p-2 items-center "
          >
            {props.icon && (
              <div className="grid  place-items-center  lg:min-w-[6rem] min-w-[4rem] lg:min-h-[6rem] min-h-[4rem]  rounded-2xl">
                {props.booking_type == "Flight" ? (
                  <TransportIconFetcher
                    TransportMode={props.booking_type}
                    Instyle={{
                      fontSize: "2.75rem",
                      marginRight: "0.8rem",
                      color: "black",
                    }}
                  />
                ) : (
                  props.icon && (
                    <ImageLoader
                      className=" object-contain"
                      url={props.icon}
                      leftalign
                      // height="4rem"
                      width="4rem"
                      widthmobile="3rem"
                    ></ImageLoader>
                  )
                )}
              </div>
            )}

            <div className=" flex flex-col w-[80%] lg:pl-1">
              <div className=" text-[#01202B] flex lg:flex-row flex-col lg:items-center items-baseline justify-between  w-full  gap-1 font-medium"></div>
              <div className="sm:text-sm text-[0.93rem]">
                {props.booking_type == "Taxi"
                  ? "Private transfer "
                  : props.booking_type}
                {props?.booking?.costings_breakdown?.duration?.text && (
                  <div className="inline-block ml-1">
                    ({props.booking?.costings_breakdown?.duration?.text})
                  </div>
                )}
              </div>
              <div className="flex sm:text-sm text-[0.93rem] flex-row gap-2 text-[#7A7A7A] font-light items-center">
                {props.taxi_type && <div>{props.taxi_type}</div>}
                {props.booking_type == "Taxi" &&
                  !props.payment?.is_registration_needed && (
                    <div
                      onClick={() => HandleTransport(props.index)}
                      className=" cursor-pointer inline-block pl-2 w-4 h-4 text-gray-500 transition-transform duration-300 ase-in-out  group-hover:text-blue-500  group-hover:scale-110 active:scale-90"
                    >
                      <MdEdit className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500" />
                    </div>
                  )}
              </div>

              {props?.costings_breakdown && (
                <FacilityContainer className="text-[#01202B] font-normal flex lg:flex-row lg:mb-0 mb-9 flex-col justify-start lg:items-center mt-1 w-full">
                  <span className="pr-1 block sm:text-sm text-[0.82rem]">
                    Facilities:
                  </span>

                  <GridContainer className=" ">
                    {Facilities.filter(Boolean).map(
                      (data, index) =>
                        data !== null && (
                          <div className="gap-1 block  min-w-fit">
                            <div className="flex flex-row sm:text-sm text-[0.74rem] font-normal">
                              {index != 0 && data != null ? (
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
            {!props?.payment?.paid_user && (
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
                      handleCheckboxChange(e);
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
