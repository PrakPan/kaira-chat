import React from "react";
import styled from "styled-components";
import LogoContainer, { Logo } from "./LogoContainer";
import FlightDetails from "./FlightDetails";
import PriceContainer from "./PriceContainer";
import { useState, useEffect } from "react";
import ViewMoreButton from "../../../itinerary/daySummary/ViewMoreButton";
import Details from "../../../../containers/itinerary/TransfersContainer/FlightDetail";
import { getIndianPrice } from "../../../../services/getIndianPrice";
import media from "../../../media";


const Container = styled.div`
  width: 95%;
  background-color: white;
  margin: auto;
  ${(props) =>
    props.isSelected &&
    "background : #FFFBBB ; border : 1px solid #F7E700!important"};
  height: 100%;
  margin-bottom: 0.5rem;
  @media screen and (min-width: 768px) {
    background: white;
    width: 100%;
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
  let isPageWide = media("(min-width: 768px)");
  const handleView = () => {
    setViewMore((prev) => !prev);
  };
  return (
    <Container
      className="relative border-b p-2 space-y-2 overflow-x-hidden"
      isSelected={props.isSelected}
    >

      <div className="flex flex-row gap-1 justify-between md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 justify-center">
          <LogoContainer data={props.data} width={32} height={32}/>
          <div className="text-sm font-semibold">
            {props.data?.segments?.[0]?.airline?.name} {isPageWide && <>| <span className="font-normal">{props.data?.segments?.[0]?.airline?.code}-{props.data?.segments?.[0]?.airline?.flight_number}</span></>}
          </div>
          {props.data?.is_refundable && <p className="bg-[#fdeeee] text-[#EF7D7D] px-2 py-1 mb-0 rounded-md text-xs font-medium">
            Refundable
          </p>}
        </div>
        <div className="text-lg font-bold flex flex-col">
                  {props.data?.final_fare ? `₹${getIndianPrice(props.data?.final_fare)}/-` : null}
                  <span className = "font-normal text-sm">for {props?.pax?.adults + props?.pax?.children + props?.pax?.infants} people</span>
        </div>
      </div>

      <div className="flex flex-col w-full gap-1 md:flex-row md:items-center md:justify-between">
        <div className="w-[70%]">
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
        </div>
        <PriceContainer
          data={{
            resultIndex: props.data?.result_index,
            finalFare: props.data?.final_fare,
            isRefundable: props.data?.is_refundable,
            duration:
              props.data?.segments[props.data?.segments?.length - 1]
                ?.destination?.arrival_time,
          }}
          isSelected={props.isSelected}
          selectedBooking={props.selectedBooking}
          _updateBookingHandler={props._updateBookingHandler}
          provider={props.provider}
          onSelect={props?.onSelect}
          trace_id={props?.trace_id}
          onFlightSelect={props?.onFlightSelect}
          edge={props?.edge}
          booking_id={props?.booking_id}
        />
      </div>

        
      
      <div className="flex justify-start items-center">
        <div className="ml-0">
          {!viewMore ? (
            <ViewMoreButton text="View Details" handler={handleView} />
          ) : (
            <ViewMoreButton text="Hide Details" handler={handleView} />
          )}
        </div>
      </div>

      {viewMore && (
        <div
          className={`mt-2 w-full lg:block flex flex-col p-1 md:p-5 cursor-pointer relative shadow-sm rounded-2xl transition-all  hover:shadow-md duration-300 ease-in-out hover:shadow-yellow-300/50 border-[#ECEAEA] border-[1px]  hover:border-[#F7E700]  shadow-[#ECEAEA]`}
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
