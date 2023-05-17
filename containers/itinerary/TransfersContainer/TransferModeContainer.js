import React, { useState } from 'react';
import styled from 'styled-components';
import { TransportIconFetcher } from '../../../helper/TransportIconFetcher';
import ImageLoader from '../../../components/ImageLoader';
import { format, parseISO } from 'date-fns';
import * as ga from '../../../services/ga/Index';
import { FaPlane } from 'react-icons/fa';
import { LivelyButton } from '../../../components/LiveleyButton';
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

  background-size: 15px 3px, 100% 3px;

  color: #c80000;
  -webkit-transform: rotate(90deg);
  position: absolute;

  height: 2px;

  border: 2px;

  width: ${(props) => (props.Transfers ? `10rem` : `5rem`)};

  top: ${(props) => (props.Transfers ? `54px` : `23px`)};
  right: ${(props) => (props.Transfers ? `-64px` : `-25px`)};
  opacity: initial;

  @media screen and (min-width: 768px) {
    width: 9.4rem;
    height: 2px;
    top: 61px;
    right: -60px;
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
    let origin_iata = props.booking['origin_city_iata_code'];
    let destination_iata = props.booking['destination_city_iata_code'];
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
      <div></div>
      {/* <div style={{ position: 'relative' }}>
        <Line pinColour={props.pinColour} Transfers={true} />
      </div> */}
      {props.booking_type == 'Flight' ? (
        <div className="flex flex-row gap-2 w-full py-[8px]">
          <div className="grid bg-[#F4F4F4]  place-items-center w-32 rounded-2xl">
            <TransportIconFetcher
              TransportMode={props.booking_type}
              Instyle={{
                fontSize: '2.75rem',

                color: 'black',
              }}
            />
          </div>
          <div className="flex lg:flex-row flex-col gap-3">
            <div className="flex flex-col">
              <div className="text-[#01202B] font-medium">
                ({props.booking.origin_code})
              </div>
              <div>{formatDate(props.booking.check_in)}</div>
              <div>{props.booking.city}</div>
            </div>
            <div className="flex flex-row justify-center items-center">
              <div className="h-2 w-2 rounded-full border-2 mb-4"></div>
              <div className="relative w-32 flex justify-center items-center">
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
                <div>{formatDate(props.booking.check_out)}</div>
                <div>{props.booking.destination_city}</div>
              </div>
              {
                <LivelyButton
                  onClick={() => HandleFlights(props.index)}
                  className="px-4 py-1 text-[12px]  cursor-pointer border-2 border-black ml-1  font-bold font-lexend text-black rounded-md"
                >
                  Change
                </LivelyButton>
              }
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-2 w-full py-[12px]">
          {props.modes && (
            <div className="grid bg-[#F4F4F4] place-items-center  lg:min-w-[8rem] min-w-[6rem] lg:min-h-[8rem] min-h-[6rem]  rounded-2xl">
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
                    className="aspect-[3/2] object-contain"
                    url={props.icon}
                    leftalign
                    dimensions={{ width: 800, height: 500 }}
                    width="4rem"
                    widthmobile="4rem"
                  ></ImageLoader>
                )
              )}
            </div>
          )}

          <div className="flex flex-col w-full">
            <div className="text-[#01202B] flex lg:flex-row flex-col gap-1 font-medium">
              <div className="font-semibold w-full">{props.heading}</div>
              <div className="flex flex-row justify-between w-full">
                <div>
                  ({props.transportMode ? props.transportMode : 'taxi'}:{' '}
                  {props.duration}h 30m)
                </div>
                {props.booking_type == 'Taxi' && (
                  <LivelyButton
                    onClick={() => HandleTransport(props.index)}
                    className="px-4 py-1 text-[12px]  cursor-pointer border-2 border-black ml-1  font-bold font-lexend text-black rounded-md"
                  >
                    Change
                  </LivelyButton>
                )}
              </div>
            </div>
            {props.taxi_type && (
              <div className="text-[#7A7A7A] font-light">{props.taxi_type}</div>
            )}
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
