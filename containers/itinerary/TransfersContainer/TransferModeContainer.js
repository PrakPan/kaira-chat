import React, { useState } from 'react';
import styled from 'styled-components';
import { TransportIconFetcher } from '../../../helper/TransportIconFetcher';
import ImageLoader from '../../../components/ImageLoader';
import { format, parseISO } from 'date-fns';
import * as ga from '../../../services/ga/Index';
import { FaPlane } from 'react-icons/fa';
import { IoCheckmark, IoClose } from 'react-icons/io5';
import { LivelyButton } from '../../../components/LiveleyButton';
import { MdEdit } from 'react-icons/md';
import useMediaQuery from '../../../components/media';
function formatDate(dateString) {
  const date = new parseISO(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string');
  }
  return format(date, 'EEE, dd MMMM');
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
const FacilityContainer = styled.div`
  display: none;
  @media screen and (min-width: 768px) {
    display: flex;
  }
`;
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

  width: ${(props) => (props.Transfers ? `12rem` : `5rem`)};

  top: ${(props) => (props.Transfers ? `75px` : `23px`)};
  right: ${(props) => (props.Transfers ? `-80px` : `-25px`)};
  opacity: initial;
  z-index: -1;
  @media screen and (min-width: 768px) {
    width: 9.4rem;
    height: 1px;
    top: 61px;
    right: -57px;
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
      transfer_type
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

  return (
    <Container>
      {/* <div></div> */}
      <div style={{ position: 'relative' }}>
        <Line pinColour={props.pinColour} Transfers={true} />
      </div>
      {props.booking_type == 'Flight' ? (
        <div
          id={props.booking.id}
          className="group  lg:ml-8 my-8 py-[20px]  relative shadow-md rounded-2xl transition-all border-2 hover:shadow-lg duration-300 ease-in-out  border-[#ECEAEA]   shadow-[#ECEAEA] lg:p-4 p-3 "
        >
          <div className="flex flex-row gap-2 lg:w-[100%] w-full  ">
            <div className="grid bg-[#F4F4F4]  place-items-center w-[7rem] rounded-2xl">
              {props.booking?.airline_code ? (
                // <ImageLoader
                //   className="aspect-[3/2] object-contain"
                //   url={`/media/airline/${props.booking?.airline_code}.png`}
                //   leftalign
                //   dimensions={{ width: 800, height: 500 }}
                //   height="2rem"
                //   width="auto"
                //   widthmobile="4rem"
                // ></ImageLoader>
                <TransportIconFetcher
                  TransportMode={props.booking_type}
                  Instyle={{
                    fontSize: '2.75rem',

                    color: 'black',
                  }}
                />
              ) : (
                <TransportIconFetcher
                  TransportMode={props.booking_type}
                  Instyle={{
                    fontSize: '2.75rem',

                    color: 'black',
                  }}
                />
              )}
            </div>
            <div className="flex lg:flex-row flex-col">
              <div className="flex flex-col gap-1 lg:w-[70%] w-[100%]">
                <div className="flex lg:flex-row flex-col lg:items-center items-baseline justify-between w-full">
                  <div className="inline  gap-2 items-center ">
                    <span className="font-medium w-full inline">
                      {props.heading}
                    </span>
                    {/* {props.userSelected ? (
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
                  )} */}
                  </div>
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
                {isDesktop && (
                  <div className="lg:flex   flex-row  gap-3  ">
                    <div className="flex flex-col">
                      <div className="text-[#01202B] font-medium">
                        ({props.booking.origin_code})
                      </div>
                      <div className="min-w-max">
                        {formatDate(props.booking.check_in)}
                      </div>
                      <div>{props.booking.city}</div>
                    </div>
                    <div className="flex flex-row justify-center items-center">
                      <div className="h-2 w-2 rounded-full border-2 mb-4"></div>
                      <div className="relative w-32 flex justify-center items-center">
                        <div className="absolute border-t w-full pb-4  border-dotted border-gray-700 "></div>
                        <div className="flex flex-col  justify-center items-center">
                          <FaPlane className="" />
                          {props.userSelected ? (
                            <div>
                              Nonstop
                              {props.booking.duration
                                ? ` (${props.booking.duration}h)`
                                : null}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="h-2 w-2 rounded-full border-2 mb-4"></div>
                    </div>
                    <div className="flex flex-row justify-between w-full">
                      <div>
                        <div className="text-[#01202B] font-medium">
                          ({props.booking.destination_code})
                        </div>
                        <div className="min-w-max">
                          {formatDate(props.booking.check_out)}
                        </div>
                        <div>{props.booking.destination_city}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {props.userSelected ? (
                <div
                  className="flex lg:w-[40%] w-full flex-col justify-center items-center
              "
                >
                  <div>
                    <div className="flex flex-row w-full justify-center items-center gap-2 text-sm font-normal mb-3 text-[#277004] ">
                      <IoCheckmark></IoCheckmark> Flight Added
                    </div>
                  </div>
                  <div
                    onClick={() => HandleFlights(props.index)}
                    className="px-2 py-1 inline-block cursor-pointer rounded-lg shadow-sm ml-2 border-2 border-black  text-black font-medium text-sm"
                  >
                    Change Flight
                  </div>
                </div>
              ) : (
                <div
                  className="flex lg:w-[40%] w-full flex-col lg:justify-center justify-start lg:items-center items-start
              "
                >
                  <div className="flex flex-row w-full lg:justify-center justify-start items-center t gap-2 text-sm font-normal mb-3 text-[#E00000]  ">
                    <IoClose></IoClose> No Flight Added Yet
                  </div>

                  <div
                    onClick={() => HandleFlights(props.index)}
                    className="px-4 py-1 inline-block cursor-pointer rounded-lg shadow-sm  border-2 border-black  text-black font-medium text-sm"
                  >
                    Add Flight
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="lg:hidden flex flex-row gap-3 ml-2">
            <div className="flex flex-col">
              <div className="text-[#01202B] font-medium">
                ({props.booking.origin_code})
              </div>
              <div className="min-w-max">
                {formatDate(props.booking.check_in)}
              </div>
              <div>{props.booking.city}</div>
            </div>
            <div className="flex flex-row justify-center items-center">
              <div className="h-2 w-2 rounded-full border-2 mb-4"></div>
              <div className="relative w-12 flex justify-center items-center">
                <div className="absolute border-t w-full pb-4  border-dotted border-gray-700 "></div>
                <div className="flex flex-col  justify-center items-center">
                  <FaPlane className="" />
                  <div>
                    Nonstop
                    {props.booking.duration
                      ? ` (${props.booking.duration}h)`
                      : null}
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
                <div className="min-w-max">
                  {formatDate(props.booking.check_out)}
                </div>
                <div>{props.booking.destination_city}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          id={props.booking.id}
          className="group flex flex-row gap-2 lg:w-[80%] w-full py-[20px] lg:ml-8 ml-2 "
        >
          {props.icon && (
            <div className="grid bg-[#F4F4F4] place-items-center  lg:min-w-[7rem] min-w-[6rem] lg:min-h-[7rem] min-h-[6rem]  rounded-2xl">
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
                    height="2rem"
                    width="4rem"
                    widthmobile="4rem"
                  ></ImageLoader>
                )
              )}
            </div>
          )}

          <div className=" flex flex-col w-[80%]">
            <div className=" text-[#01202B] flex lg:flex-row flex-col lg:items-center items-baseline justify-between  w-full  gap-1 font-medium">
              <span className="inline  gap-3 items-center">
                <span className="font-medium  inline">{props.heading}</span>

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
              </span>
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
            </div>

            <div className="flex flex-row gap-2 text-[#7A7A7A] font-light">
              {props.taxi_type && <div>{props.taxi_type}</div>}
              <div>({props.duration}h 30m)</div>
            </div>

            {props?.costings_breakdown && (
              <FacilityContainer className="text-[#01202B] font-normal flex-row mt-3 ">
                <div className="pr-1 block ">Facilities:</div>
                {}
                {Facilities.map((data, index) => (
                  <div className="lg:flex flex-row gap-1  ">
                    {index > 0 ? <span className="pl-1">|</span> : null}

                    <div>{data}</div>
                  </div>
                ))}
              </FacilityContainer>
            )}
          </div>
        </div>
      )}
    </Container>
  );
};

export default TransferModeContainer;
