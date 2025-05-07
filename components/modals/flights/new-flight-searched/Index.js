import React from "react";
import styled from "styled-components";
import LogoContainer, { Logo } from "./LogoContainer";
import FlightDetails from "./FlightDetails";
import PriceContainer from "./PriceContainer";
import { useState, useEffect } from "react";
import ViewMoreButton from "../../../itinerary/daySummary/ViewMoreButton";
import Details from "../../../../containers/itinerary/TransfersContainer/FlightDetail";
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

const ClippathComp = styled.div`
  clip-path: polygon(100% 0, 100% 100%, 0% 100%, 5% 50%, 0% 0%);
`;

function convertMinutesToHours(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

const Flight = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const handleView = () => {
    setViewMore((prev) => !prev);
  };
  return (
    <Container
      className="relative border p-3 space-y-2 overflow-x-hidden"
      isSelected={props.isSelected}
      style={{ borderRadius: "10px" }}
    >
      {props.data?.is_refundable ? (
        <ClippathComp className="absolute top-0 right-0 w-fit text-xs bg-[#F8E000] pr-2 pl-4 py-1 rounded-tr-lg">
          Refundable
        </ClippathComp>
      ) : null}

      <div className="flex flex-col gap-1 lg:flex-row lg:items-center w-full">
        <LogoContainer data={props.data} />

        <FlightDetails
          data={props.data}
          origin={props.data?.segments[0]?.origin}
          destination={
            props.data?.segments[props.data?.segments?.length - 1]?.destination
          }
          duration={
            typeof props.data?.total_duration == "number"
              ? convertMinutesToHours(props.data?.total_duration)
              : props.data?.total_duration
          }
          isNonStop={props.data?.segments?.length === 1}
          numStops={props.data?.segments?.length - 1}
          segments={props.data?.segments}
          setShowDetails={setShowDetails}
        />

        <PriceContainer
          data={{
            resultIndex: props.data?.result_index,
            finalFare: props.data?.final_fare,
            isRefundable: props.data?.is_refundable,
            duration:
            props.data?.segments[props.data?.segments?.length-1]?.destination?.arrival_time
            
          }}
          isSelected={props.isSelected}
          selectedBooking={props.selectedBooking}
          _updateBookingHandler={props._updateBookingHandler}
          provider={props.provider}
          onSelect={props?.onSelect}
          trace_id={props?.trace_id}
          onFlightSelect={props?.onFlightSelect}
          edge={props?.edge}
        />
      </div>
      <div className="flex justify-center items-center">
        <div className="ml-0 lg:ml-[64px]">
          {!viewMore ? (
            <ViewMoreButton text="View more" handler={handleView} />
          ) : (
            <ViewMoreButton text="View Less" handler={handleView} />
          )}
        </div>
      </div>
      {viewMore && (
        <div
          className={`mb-2 mt-2  w-full lg:block ${"mb-2 mt-2 lg:block flex flex-col p-3 px-2"} cursor-pointer relative shadow-sm rounded-2xl transition-all  hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA] border-[1px]  hover:border-[#F7E700]  shadow-[#ECEAEA] lg:p-5 `}
        >
          <Details
            segments={props.data?.segments}
            provider={props.provider}
            resultIndex={props.data?.result_index}
            setShowDetails={setShowDetails}
            individual={props?.individual}
            originCityId={props.originCityId}
            destinationCityId={props.destinationCityId}
            setTransferBookingsIntercity={props.setTransferBookingsIntercity}
            edge={props?.edge}
            getPaymentHandler={props.getPaymentHandler}
            booking_id={props?.selectedBooking?.id}
            combo={props?.combo}
            setShowLoginModal={props?.setShowLoginModal}
          />
        </div>
      )}
    </Container>
  );
};

export default Flight;
