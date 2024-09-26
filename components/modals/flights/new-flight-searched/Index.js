import React from "react";
import styled from "styled-components";
import LogoContainer, { Logo } from "./LogoContainer";
import FlightDetails from "./FlightDetails";
import PriceContainer from "./PriceContainer";
import { useState } from "react";

const Container = styled.div`
  width: 95%;
  background-color: white;
  margin: auto;
  ${(props) =>
    props.isSelected &&
    "background : #FFFBBB ; border : 1px solid #F7E700!important"};
  border-radius: 10px;
  height: 100%;
  margin-bottom: 0.5rem;
  @media screen and (min-width: 768px) {
    background: white;
    width: 100%;
    border-radius: 10px;
    position: relative;
  }
`;

const Flight = (props) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Container
      className="border p-3 space-y-2"
      isSelected={props.isSelected}
      style={{ borderRadius: "10px" }}
    >
      <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
        <LogoContainer
          data={props.data?.segments[0]?.airline}
        />

        <FlightDetails
          origin={props.data?.segments[0]?.origin}
          destination={props.data?.segments[0]?.destination}
          duration={props.data?.segments[0]?.accumulated_duration}
          isNonStop={props.filtersState.non_stop_flights}
        />

        <PriceContainer
          data={{
            resultIndex: props.data?.result_index,
            finalFare: props.data?.final_fare,
            isRefundable: props.data?.is_refundable
          }}
          isSelected={props.isSelected}
          selectedBooking={props.selectedBooking}
          _updateBookingHandler={props._updateBookingHandler}
          provider={props.provider}
        />
      </div>

      <button className="text-sm text-blue hover:underline transition-all"
        onClick={() => setShowDetails(prev => !prev)}
      >
        Flight Details
      </button>

      {showDetails && (
        <Details
          airline={props.data?.segments[0]?.airline}
          baggage={{
            baggage_allowance: props.data?.segments[0]?.baggage_allowance,
            cabin_baggage_allowance: props.data?.segments[0]?.cabin_baggage_allowance,
          }} />
      )}
    </Container>
  );
};

export default Flight;

const Details = ({ airline, baggage }) => {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:justify-between bg-gray-100 p-2 rounded-md">
      <div className="flex flex-col gap-2">
        <div className="text-sm font-bold">
          Airline
        </div>

        <div className="flex flex-row items-center gap-2">
          <Logo src={airline?.code} />

          <div className="flex flex-col gap-1">
            <div className="text-sm">
              {airline?.name}
            </div>
            <div className="text-sm text-gray-600">
              {airline?.code}-{airline?.flight_number}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm font-bold">
          Check-in Baggage
        </div>

        <div>
          {baggage?.baggage_allowance}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-sm font-bold">
          Cabin Baggage
        </div>

        <div>
          {baggage?.cabin_baggage_allowance}
        </div>
      </div>
    </div>
  )
}
