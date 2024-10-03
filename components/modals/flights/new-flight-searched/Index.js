import React from "react";
import styled from "styled-components";
import LogoContainer, { Logo } from "./LogoContainer";
import FlightDetails from "./FlightDetails";
import PriceContainer from "./PriceContainer";
import { useState, useEffect } from "react";
import { axiosFlightFareRule } from "../../../../services/bookings/FlightSearch";
import { IoMdCloseCircle } from "react-icons/io";

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
      className="relative border p-3 space-y-2"
      isSelected={props.isSelected}
      style={{ borderRadius: "10px" }}
    >
      {props.data?.is_refundable ? (
        <div className="absolute top-0 right-0 w-fit text-xs bg-[#F8E000] px-2 py-1 rounded-tr-lg">
          Refundable
        </div>
      ) : null}

      <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
        <LogoContainer
          data={props.data}
        />

        <FlightDetails
          data={props.data}
          origin={props.data?.segments[0]?.origin}
          destination={props.data?.segments[props.data?.segments?.length-1]?.destination}
          duration={props.data?.total_duration}
          isNonStop={props.filtersState.non_stop_flights}
          numStops={props.data?.segments?.length-1}
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

      <button className="text-sm text-blue hover:underline transition-all focus:outline-none"
        onClick={() => setShowDetails(prev => !prev)}
      >
        Flight Details
      </button>

      {showDetails && (
        <Details
          baggage={{
            baggage_allowance: props.data?.segments[0]?.baggage_allowance,
            cabin_baggage_allowance: props.data?.segments[0]?.cabin_baggage_allowance,
          }}
          provider={props.provider}
          resultIndex={props.data?.result_index}
          setShowDetails={setShowDetails}
        />
      )}
    </Container>
  );
};

export default Flight;

const Details = ({ baggage, provider, resultIndex, setShowDetails }) => {
  const [fareRules, setFareRules] = useState(null);
  const [fareRulesLoading, setFareRulesLoading] = useState(false)
  const [fareRUlesError, setFareRulesError] = useState(false);

  useEffect(() => {
    getFareRules();
  }, [])

  const getFareRules = () => {
    setFareRulesLoading(true);
    setFareRulesError(false);

    const traceId = localStorage.getItem(`${provider}_trace_id`);
    const data = {
      trace_id: traceId,
      result_index: resultIndex
    }

    axiosFlightFareRule.post('', data).then(response => {
      setFareRules(response.data.results[0].fareRuleDetail)
      setFareRulesLoading(false);
    }).catch(err => {
      setFareRulesError(true);
      setFareRulesLoading(false);
    })
  }

  return (
    <div className="relative flex flex-col gap-4 bg-gray-100 p-2 rounded-md">
      <div className="absolute right-1 top-1 z-50">
        <IoMdCloseCircle onClick={() => setShowDetails(false)} className="text-lg md:text-xl text-gray-400 cursor-pointer" />
      </div>

        <div className="flex flex-col gap-2">
          <div
            className="w-fit py-1 px-3 text-sm font-bold bg-[#F8E000] rounded-lg cursor-pointer">
            Baggage Information
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:space-x-10">
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
        </div>

      {fareRulesLoading ? (<div className="flex items-center justify-center">
        <div className="w-5 h-5 border-4 border-t-[#F8E000] rounded-full animate-spin"></div>
      </div>) : fareRUlesError ? (<div className="text-sm text-center">Something went wrong, please try again</div>) : (
        <div className="flex flex-col">
          <div
            className="w-fit py-1 px-3 text-sm font-bold bg-[#F8E000] rounded-lg cursor-pointer">
            Fare Details and Rules
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: fareRules,
            }}
            className="flex flex-col gap-1 text-sm"
          >
          </div>
        </div>
      )}
    </div>
  )
}
