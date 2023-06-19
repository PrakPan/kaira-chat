import React, { useState } from 'react';
import styled from 'styled-components';
import { TransportIconFetcher } from '../../../helper/TransportIconFetcher';
import ImageLoader from '../../../components/ImageLoader';
import { differenceInMinutes, format, parseISO } from 'date-fns';
import * as ga from '../../../services/ga/Index';
import { FaPlane } from 'react-icons/fa';
import { IoCheckmark, IoClose } from 'react-icons/io5';
import { LivelyButton } from '../../../components/LiveleyButton';
import { MdEdit } from 'react-icons/md';
import useMediaQuery from '../../../components/media';
import { ITINERARY_STATUSES } from '../../../services/constants';
import CheckboxFormComponent from '../../../components/FormComponents/CheckboxFormComponent';
import axiosbookingupdateinstance from '../../../services/bookings/UpdateBookings';
import Slide from '../../../Animation/framerAnimation/Slide';
import { PulseLoader } from 'react-spinners';
function formatDate(dateString) {
  const date = new parseISO(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string');
  }
  return format(date, 'EEE, dd MMMM');
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

  const checkInTime = format(new Date(checkIn), 'hh:mm a');
  const checkOutTime = format(new Date(checkOut), 'hh:mm a');

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

const Container = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 30px auto;
  min-height: 5rem;
  @media screen and (min-width: 768px) {
    min-height: 8rem;
  }
`;
//
const ImageContainer = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f4f4;
  margin : auto;
  @media screen and (min-width: 768px) {
    width: 80px;
    height: 80px;
  }
  img {
    object-fit: contain;
    transform: scale(1.05);
  }
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

  width: ${(props) => (props.Transfers ? `16rem` : `5rem`)};

  top: ${(props) => (props.Transfers ? `101px` : `23px`)};
  right: ${(props) => (props.Transfers ? `-110px` : `-25px`)};
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
  

  border-color: ${(props) => (props.pinColour ? props.pinColour : 'black')};
  min-height: 10vw;
  height: 100%;
  margin: 0rem 0 0rem 0rem; */
`;

const TransferModeContainer = (props) => {
  const [addbooking, setaddboking] = useState(props.booking?.user_selected);
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState({
    error: false,
    errorMsg: '',
  });
  const [UpdateBookingState, setUpdateBookingState] = useState(false);
  function handleCheckboxChange(e) {
    if (props.token) {
      
      _updateSelectedTransfer();
      // _SelectedBookingHandler({
      //   SelectedBookingId: selectedBooking?.id,
      //   itinerary_id: itinerary_id,
      //   tailored_id: tailored_id,
      //   user_selected: !booking?.user_selected,
      //   index: index,
      // });

      e.stopPropagation();
    } else {
    }
  }
  const isDesktop = useMediaQuery('(min-width:1024px)');

  function HandleFlights(i) {
    let name = props.booking['name'];
    let costings_breakdown = props.booking['costings_breakdown'];
    let cost = props.booking['booking_cost'];
    let itinerary_id = props.booking['itinerary_id'];
    let itinerary_name = props.booking['itinerary_name'];
    let booking_type = props.booking['booking_type'];

    // let accommodation = props.booking["accommodation"];
    let tailored_id = props.booking['tailored_itinerary'];
    let id = props.booking['id'];
    let check_in = props.booking['check_in'];
    let check_out = props.booking['check_out'];
    let pax = {
      number_of_adults: props.booking['number_of_adults'],
      number_of_children: props.booking['number_of_children'],
      number_of_infants: props.booking['number_of_infants'],
    };
    let city = props.booking['city'];
    let room_type = props.booking['room_type'];
    let taxi_type = props.booking['taxi_type'];
    let transfer_type = props.booking['transfer_type'];
    let city_id = props.booking['city_id'];
    let destination_city = props.booking['destination_city'];
    let duration = props.booking['duration'];
    let origin_iata = props.booking['origin_code'];
    let destination_iata = props.booking['destination_code'];
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
    let name = props.booking['name'];
    let costings_breakdown = props.booking['costings_breakdown'];
    let cost = props.booking['booking_cost'];
    let itinerary_id = props.booking['itinerary_id'];
    let itinerary_name = props.booking['itinerary_name'];
    let booking_type = props.booking['booking_type'];

    // let accommodation = props.booking["accommodation"];
    let tailored_id = props.booking['tailored_itinerary'];
    let id = props.booking['id'];
    let check_in = props.booking['check_in'];
    let check_out = props.booking['check_out'];
    let pax = {
      number_of_adults: props.booking['number_of_adults'],
      number_of_children: props.booking['number_of_children'],
      number_of_infants: props.booking['number_of_infants'],
    };
    let city = props.booking['city'];
    let room_type = props.booking['room_type'];
    let taxi_type = props.booking['taxi_type'];
    let transfer_type = props.booking['transfer_type'];
    let city_id = props.booking['city_id'];
    let destination_city = props.booking['destination_city'];
    let duration = props.booking['duration'];
    let origin_iata = props.booking['origin_city_iata_code'];
    let destination_iata = props.booking['destination_city_iata_code'];
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
    `${props?.costings_breakdown?.taxi_occupancy ?? '2'} Seater`,
    `${props?.costings_breakdown?.distance?.text ?? 'Leisure'}`,
    `${
      props.booking_type == 'Taxi' || props.booking_type == 'Bus'
        ? '2 Luggage bags'
        : ''
    }  `,
  ];
  const _updateSelectedTransfer = () => {
    setUpdateBookingState(true);
    setLoading(true);

    let updated_bookings_arr = [
      {
        id: props.booking['id'],
        booking_type: props.booking_type,
        itinerary_type: 'Tailored',
        user_selected: !props?.userSelected,
        itinerary_id: props.booking['itinerary_id'],
        taxi_type: props.booking['taxi_type'],
        transfer_type: props.booking['transfer_type'],

        costings_breakdown: props.booking?.costings_breakdown,
      },
    ];
    console.dir(updated_bookings_arr);
    axiosbookingupdateinstance
      .post('?booking_type=Taxi,Bus,Ferry,Train', updated_bookings_arr, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((res) => {
        props._updateTaxiBookingHandler(res.data.bookings);
        
        //  props.getPaymentHandler();
        setTimeout(function () {
          props.getPaymentHandler();
        }, 1000);
        setaddboking(!addbooking);
        setUpdateBookingState(false);
        setLoading(false)
      })
      .catch((err) => {
        // setUpdateLoadingState(false);
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx

          // The response headers
          if (err.response.status === 400) {
            setIsError({
              error: true,
              errorMsg: err.response.data.message,
            });
          }
        }
        setUpdateBookingState(false);
        setLoading(false)
        window.alert('There seems to be a problem, please try again!');
      });
  };

  return (
    <Container>
      <div className=" fixed right-[10px] top-[50px] z-[200] ">
        {isError.error && (
          <Slide
            hideTime={8}
            onUnmount={() =>
              setIsError({
                error: false,
                errorMsg: '',
              })
            }
            isActive={isError.error}
            direction={-2}
            duration={1.3}
            ydistance={25}
          >
            <div className="text-white  font-lexend px-2 py-1 border-2 border-red bg-red-500 rounded-lg  text-center font-normal text-sm ">
              {isError.errorMsg}
            </div>
          </Slide>
        )}
      </div>
      {/* <div></div> */}
      <div style={{ position: 'relative' }}>
        <Line pinColour={props.pinColour} Transfers={true} />
      </div>
      {props.booking_type == 'Flight' ? (
        <div className="mt-3 lg:ml-7 ml-2">
          <div className="flex flex-row w-full justify-between items-center">
            <span className="font-medium  inline">{props.heading}</span>
            <div>
              {props.userSelected ? (
                <div className=" text-md font-semibold  text-[#277004] ">
                  Included
                </div>
              ) : (
                <div className=" text-md font-semibold text-[#E00000]  ">
                  Excluded
                </div>
              )}{' '}
            </div>
          </div>
          <div
            id={props.booking.id}
            className={`mb-4 mt-2 lg:block ${
              !props.userSelected ? 'flex flex-col-reverse' : 'flex flex-col'
            }    cursor-pointer  relative shadow-sm rounded-2xl transition-all border-[1px] hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-5 p-3  `}
          >
            <div className="flex flex-row gap-6    ">
              {props.userSelected && (
                <div>
                  <div className="">
                    {props.booking?.airline_code ? (
                      <ImageContainer>
<ImageLoader
                        className=""
                        url={`https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/${props.booking?.airline_code}.png`}
                        leftalign
                        dimensions={{ width: 800, height: 500 }}
                        borderRadius="100%"
                        height="4rem"
                        width="4rem"
                        widthmobile="3rem"
                      ></ImageLoader>
                      </ImageContainer>
                      
                    ) : (
                      // <TransportIconFetcher
                      //   TransportMode={props.booking_type}
                      //   Instyle={{
                      //     fontSize: '2.75rem',
                      //     height: '3rem',
                      //     width: '4rem',
                      //     color: 'black',
                      //   }}
                      // />
                      <TransportIconFetcher
                        TransportMode={props.booking_type}
                        Instyle={{
                          fontSize: '2.75rem',
                          height: '3rem',
                          width: '5rem',
                          color: 'black',
                        }}
                      />
                    )}
                  </div>

                  {props.booking?.airline_code && (
                    <div className="flex font-normal text-sm pl-2 mt-1 min-w-max">
                      {props?.booking.airline_name}
                    </div>
                  )}
                </div>
              )}

              <div className="flex lg:flex-row flex-col lg:justify-between justify-center w-full">
                <div className="flex flex-col lg:justify-center justify-start gap-1 lg:w-[40%] w-[100%]">
                  {/* <div className="flex lg:flex-row flex-col lg:items-center items-baseline justify-between w-full">
                    <div className="inline  gap-2 items-center ">
                      {props.userSelected ? (
                    <div
                      onClick={() => HandleFlights(props.index)}
                      className="cursor-pointer inline-block pl-2 w-4 h-4 text-gray-500 transition-transform duration-300 ase-in-out  group-hover:text-blue-500  group-hover:scale-110 active:scale-90"
                    >
                      <MdEdit className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500" />
                    </div>
                  ) : (
                    <div
                      onClick={() => HandleFlights(props.index)}
                      className="px-2 py-1 inline-block cursor-pointer rounded-lg shadow-sm ml-2 border-2 border-black  text-black font-medium text-sm"
                    >
                      Add Flight
                    </div>
                  )}
                    </div>
                    <div>
                  {props.userSelected ? (
                    <div className=" text-md font-bold  text-[#277004] ">
                      Included
                    </div>
                  ) : (
                    <div className=" text-md font-bold text-[#E00000]  ">
                      Excluded
                    </div>
                  )}
                </div>
                  </div> */}
                  {isDesktop && (
                    <div className="lg:flex   flex-row  gap-3  ">
                      <div className="flex flex-col">
                        <div className="text-[#01202B] text-lg font-medium min-w-max">
                          {
                            props.booking?.airline_code && <span>
                            {
                              processBookingTimes(
                                props.booking.check_in,
                                props.booking.check_out
                              ).checkInTime
                            }
                          </span>
                          }
                          

                          <span className="font-[300] ml-1 ">
                            ({props.booking.origin_code})
                          </span>
                        </div>
                        {ITINERARY_STATUSES.itinerary_prepared !==
                          props.plan.itinerary_status && (
                          <div className="min-w-max text-[0.8rem] -mt-1">
                            {formatDate(props.booking.check_in)}
                          </div>
                        )}

                        <div className="min-w-max">{props.booking.city}</div>
                      </div>
                      <div className="flex flex-row justify-center items-center">
                        <div className="h-2 w-2 rounded-full border-2 mb-4"></div>
                        <div className="relative w-32 flex justify-center items-center">
                          <div className="absolute border-t w-full pb-4  border-dotted border-gray-700 "></div>
                          <div className="flex flex-col  justify-center items-center font-[200]">
                            <FaPlane className="" />
                            {props.userSelected ? (
                              <div className="min-w-max text-[0.8rem]">
                                {props.booking.via_airports
                                  ? '(to Lay)'
                                  : '(Nonstop)'}
                          {props.booking?.airline_code && <span className="ml-1">
                                  {props.booking.duration
                                    ? ` (${props.booking.duration}h)`
                                    : processBookingTimes(
                                        props.booking.check_in,
                                        props.booking.check_out
                                      ).duration}
                                </span>}
                                
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="h-2 w-2 rounded-full border-2 mb-4"></div>
                      </div>
                      <div className="flex flex-row justify-between w-full">
                        <div>
                          <div className="text-[#01202B] text-lg font-medium min-w-max">
                            {
                              processBookingTimes(
                                props.booking.check_in,
                                props.booking.check_out
                              ).checkOutTime
                            }
                            <span className="font-[300] ml-1">
                              ({props.booking.destination_code})
                            </span>
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
                  )}
                </div>

                {props.userSelected ? (
                  <div className="flex lg:flex-col md:flex-row lg:justify-center justify-between items-center">
                    <div className="flex  mr-3 lg:w-full w-full flex-col lg:justify-center justify-start lg:items-end items-start">
                      {/* <div>
                      <div className="flex flex-row w-full justify-end items-center gap-2 text-sm font-normal lg:mb-3 mb-1 text-[#277004] ">
                        <IoCheckmark></IoCheckmark>
                       
                      </div>
                      </div> */}

                      {props.booking.duration && (
                        <div className="flex pl-2  font-[300]">
                          <div>
                            {props.booking.via_airports
                              ? '(to Lay)'
                              : '(Nonstop)'}
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

                      {/* <div>airline_name</div> */}
                    </div>

                    {!props?.payment?.paid_user &&
                      props.payment?.user_allowed_to_pay && (
                        <div
                          onClick={() => HandleFlights(props.index)}
                          className="px-[1.6rem] min-w-fit bg-[#F7E700] py-[8px] lg:px-4   inline-block cursor-pointer rounded-lg shadow-sm ml-2 lg:border-2  border-[1px] border-black  text-black font-medium text-sm"
                        >
                          Change Flight
                        </div>
                      )}
                  </div>
                ) : (
                  !props?.payment?.paid_user &&
                  props.payment?.user_allowed_to_pay && (
                    <div
                      className="flex lg:mr-0 mr-3 lg:w-[40%] w-full flex-col lg:justify-center justify-end lg:items-end items-end
              "
                    >
                      {/* <div className="flex flex-row w-full lg:justify-end justify-start items-center t gap-2 text-sm font-normal lg:mb-3 mb-1 text-[#E00000]  ">
                      <IoClose></IoClose> No Flight Yet
                    </div> */}

                      <div
                        onClick={() => HandleFlights(props.index)}
                        className="px-[1.8rem] bg-[#F7E700] py-[8px] inline-block cursor-pointer rounded-lg shadow-sm  border-2 border-black  text-black font-medium text-sm"
                      >
                        Add Flight
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            <div
              className={`lg:hidden flex flex-row gap-3 ml-2 ${
                !props.userSelected ? 'lg:mt-3 mb-3' : 'lg:mt-3 mt-3'
              }  text-sm`}
            >
              <div className="flex flex-col">
                <div className="text-[#01202B] font-normal">
                  ({props.booking.origin_code})
                </div>
                {ITINERARY_STATUSES.itinerary_prepared !==
                  props?.plan?.itinerary_status && (
                  <div className="min-w-max">
                    {formatDate(props.booking.check_in)}
                  </div>
                )}

                <div>{props.booking.city}</div>
              </div>
              <div className="flex flex-row justify-center items-center">
                <div className="h-2 w-2 rounded-full border-2 mb-4"></div>
                <div className="relative w-12 flex justify-center items-center">
                  <div className="absolute border-t w-full pb-4  border-dotted border-gray-700 "></div>
                  <div className="flex flex-col  justify-center items-center">
                    <FaPlane className="" />
                    <div>
                      {props.userSelected ? (
                        <div>
                          {props.booking.via_airports
                            ? '(to Lay)'
                            : '(Nonstop)'}
                          {props.booking.duration
                            ? ` (${props.booking.duration}h)`
                            : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="h-2 w-2 rounded-full border-2 mb-4"></div>
              </div>
              <div className="flex flex-row justify-between w-full">
                <div>
                  <div className="text-[#01202B] font-medium">
                    ({props.booking.destination_code})
                  </div>
                  {ITINERARY_STATUSES.itinerary_prepared !==
                    props?.payment?.itinerary_status && (
                    <div className="min-w-max">
                      {formatDate(props.booking.check_out)}
                    </div>
                  )}
                  <div>{props.booking.destination_city}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 lg:ml-7 ml-2">
          <div className="flex flex-row w-full justify-between items-center">
            <span className="font-medium  inline">{props.heading}</span>
            <div>
              {props.userSelected ? (
                <div className=" text-md font-semibold  text-[#277004] ">
                  Included
                </div>
              ) : (
                <div className=" text-md font-semibold text-[#E00000]  ">
                  Excluded
                </div>
              )}{' '}
            </div>
          </div>

          <div
            id={props.booking.id}
            className="mb-4 mt-3 group w-full flex flex-row gap-2   py-[20px]  cursor-pointer relative shadow-sm rounded-2xl transition-all border-[1px] hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA]  hover:border-[#F7E700] shadow-[#ECEAEA] lg:p-3 p-2 items-center "
          >
            {props.icon && (
              <div className="grid  place-items-center  lg:min-w-[6rem] min-w-[4rem] lg:min-h-[6rem] min-h-[4rem]  rounded-2xl">
                {props.booking_type == 'Flight' ? (
                  <TransportIconFetcher
                    TransportMode={props.booking_type}
                    Instyle={{
                      fontSize: '2.75rem',
                      marginRight: '0.8rem',
                      color: 'black',
                    }}
                  />
                ) : (
                  props.icon && (
                    <ImageLoader
                      className=" object-contain"
                      url={props.icon}
                      leftalign
                      
                      // dimensions={{ width: 900, height: 500 }}
                      height="4rem"
                      width="4rem"
                      widthmobile="3.8rem"
                    ></ImageLoader>
                  )
                )}
              </div>
            )}

            <div className=" flex flex-col w-[80%] pl-1">
              <div className=" text-[#01202B] flex lg:flex-row flex-col lg:items-center items-baseline justify-between  w-full  gap-1 font-medium">
                {/* <span className="inline  gap-3 items-center">
                  {props.booking_type == 'Taxi' && (
                    <div
                      onClick={() => HandleTransport(props.index)}
                      className="cursor-pointer inline-block pl-2 w-4 h-4 text-gray-500 transition-transform duration-300 ase-in-out  group-hover:text-blue-500  group-hover:scale-110 active:scale-90"
                    >
                      <MdEdit className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500" />
                    </div>
                    // <LivelyButton

                    //   className="px-4 py-1 text-[12px]  cursor-pointer border-2 border-black ml-1  font-bold font-lexend text-black rounded-md"
                    // >
                    //   Change
                    // </LivelyButton>
                  )}
                </span> */}
                {/* <div>
                  {props.userSelected ? (
                    <div className=" text-md font-bold  text-[#277004] ">
                      Included
                    </div>
                  ) : (
                    <div className=" text-md font-bold text-[#E00000]  ">
                      Excluded
                    </div>
                  )}
                </div> */}
              </div>
              <div>
                {props.booking_type == 'Taxi'
                  ? 'Private transfer '
                  : props.booking_type}

                <div className="inline-block ml-1">({props.duration}h 30m)</div>
              </div>
              <div className="flex flex-row gap-2 text-[#7A7A7A] font-light items-center">
                {props.taxi_type && <div>{props.taxi_type}</div>}
                {props.booking_type == 'Taxi' && (
                  <div className=" cursor-pointer inline-block pl-2 w-4 h-4 text-gray-500 transition-transform duration-300 ase-in-out  group-hover:text-blue-500  group-hover:scale-110 active:scale-90">
                    <MdEdit className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500" />
                  </div>
                  // <LivelyButton

                  //   className="px-4 py-1 text-[12px]  cursor-pointer border-2 border-black ml-1  font-bold font-lexend text-black rounded-md"
                  // >
                  //   Change
                  // </LivelyButton>
                )}
              </div>

              {props?.costings_breakdown && (
                <FacilityContainer className="text-[#01202B] font-normal flex lg:flex-row lg:mb-0 mb-9 flex-col justify-start lg:items-center mt-1 w-full">
                  <span className="pr-1 block ">Facilities:</span>

                  <span className="flex flex-row  ">
                    {Facilities.map((data, index) => (
                      <div className="gap-1 block  min-w-fit">
                        <div className="flex flex-row text-sm font-normal">
                          {index > 0 ? <span className="pl-1">|</span> : null}

                          <div className="min-w-fit">{data}</div>
                        </div>
                      </div>
                    ))}
                  </span>
                </FacilityContainer>
              )}
            </div>
            {isDesktop &&
              props.booking_type == 'Taxi' &&
              !props?.payment?.paid_user &&
              props.payment?.user_allowed_to_pay && (
                <div
                  onClick={() => HandleTransport(props.index)}
                  className="px-[1.6rem]  lg:inline-block min-w-fit mr-3 bg-[#F7E700] py-[8px]  cursor-pointer rounded-lg shadow-sm  border-2 border-black  text-black font-medium text-sm"
                >
                  {props.booking.user_selected
                    ? `Change ${props.booking_type}`
                    : 'Add to Itinerary'}
                </div>
              )}
            {!props?.payment?.paid_user &&
              props.payment?.user_allowed_to_pay && (
                <div>
                  <div
                    className={`absolute  ${
                      true
                        ? `${
                            props.booking_type == 'Taxi'
                              ? 'lg:bottom-4'
                              : 'lg:bottom-[3.6rem]'
                          }  bottom-[1.5rem] `
                        : `${
                            props.payment?.paid_user ||
                            !props.payment?.user_allowed_to_pay
                              ? 'lg:bottom-10 bottom-[1.2rem]'
                              : 'lg:bottom-10 bottom-[2.5rem]'
                          }`
                    } right-8 -m-3`}
                  >
                   {loading && <PulseLoader style={{position : "absolute" , top : '-25%' , left : '50%' , transform : 'translate(-50% , -50%)'}} size={12} speedMultiplier={0.6} color="#111" />}
                    <div
                      onClick={(e) => {
                        handleCheckboxChange(e);
                      }}
                      className="flex flex-row gap-1 items-center  cursor-pointer"
                    >
                      <CheckboxFormComponent checked={addbooking} />
                      <label className="text-center">
                        {addbooking ? 'Added Booking' : 'Add Booking'}
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

export default TransferModeContainer;
