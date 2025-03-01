import React from "react";
import styled from "styled-components";
import LogoContainer, { Logo } from "./LogoContainer";
import FlightDetails from "./FlightDetails";
import PriceContainer from "./PriceContainer";
import { useState, useEffect } from "react";
import { axiosFlightFareRule } from "../../../../services/bookings/FlightSearch";
import GlobalModal from "../../GlobalModal";
import { MERCURY_HOST } from "../../../../services/constants";
import axios from "axios";
import { useRouter } from "next/router";
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

const Flight = (props) => {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  console.log("itinerary id:",router?.query?.id)


  return (
    <Container
      className="relative border p-3 space-y-2"
      isSelected={props.isSelected}
      style={{ borderRadius: "10px" }}
    >
      {props.data?.is_refundable ? (
        <ClippathComp className="absolute top-0 right-0 w-fit text-xs bg-[#F8E000] pr-2 pl-4 py-1 rounded-tr-lg">
          Refundable
        </ClippathComp>
      ) : null}

      <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
        <LogoContainer data={props.data} />

        <FlightDetails
          data={props.data}
          origin={props.data?.segments[0]?.origin}
          destination={
            props.data?.segments[props.data?.segments?.length - 1]?.destination
          }
          duration={props.data?.total_duration}
          isNonStop={props?.filtersState?.non_stop_flights}
          numStops={props.data?.segments?.length - 1}
          segments={props.data?.segments}
          setShowDetails={setShowDetails}
        />

        <PriceContainer
          data={{
            resultIndex: props.data?.result_index,
            finalFare: props.data?.final_fare,
            isRefundable: props.data?.is_refundable,
          }}
          isSelected={props.isSelected}
          selectedBooking={props.selectedBooking}
          _updateBookingHandler={props._updateBookingHandler}
          provider={props.provider}
        />
      </div>
      <div className="flex justify-end">
        <button
          className="text-sm font-medium text-yellow-500 border border-yellow-500 rounded-lg px-3 py-1 transition-all 
             hover:bg-yellow-500 hover:text-black focus:outline-none"
          onClick={() => setShowDetails((prev) => !prev)}
        >
          Flight Details
        </button>

        <GlobalModal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          children={
            <>
              <Details
                segments={props.data?.segments}
                provider={props.provider}
                resultIndex={props.data?.result_index}
                setShowDetails={setShowDetails}
              />
              <button
                onClick={async () => {
                  try {
                    const res = await axios.post(
                      MERCURY_HOST +
                        `/api/v1/itinerary/${router?.query?.id}/bookings/flight/`,
                      {
                        trace_id: localStorage.getItem(
                          `${props.provider}_trace_id`
                        ),
                        result_indices: [props.data?.result_index],
                      }
                    );
                    window.location.href=`/flights/book/${res.data.id}`;
                  } catch (error) {
                    console.log("error in redirecting", error);
                  }
                }}
              >
                Book
              </button>
            </>
          }
        />
      </div>
    </Container>
  );
};

export default Flight;

export const Details = ({ segments, provider, resultIndex, setShowDetails ,fareRule}) => {
  const [fareRules, setFareRules] = useState(fareRule?.fareRuleDetail);
  const [fareRulesLoading, setFareRulesLoading] = useState(false);
  const [fareRUlesError, setFareRulesError] = useState(false);

  useEffect(() => {
    if(fareRules==null){
      getFareRules();
    }
  }, []);

  const getFareRules = () => {
    setFareRulesLoading(true);
    setFareRulesError(false);

    const traceId = localStorage.getItem(`${provider}_trace_id`);
    const data = {
      trace_id: traceId,
      result_index: resultIndex,
    };

    axiosFlightFareRule
      .post("", data)
      .then((response) => {
        setFareRules(response.data.results[0].fare_rule_detail);
        setFareRulesLoading(false);
      })
      .catch((err) => {
        setFareRulesError(true);
        setFareRulesLoading(false);
      });
  };

  return (
    <div className="relative flex flex-col gap-4 bg-gray-100 p-2 rounded-md">
      <div className="flex flex-col gap-2">
        <div className="w-fit py-2 text-lg font-bold">Flight Details</div>

        <FlightSegment segments={segments} />
      </div>

      {fareRulesLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-4 border-t-[#F8E000] rounded-full animate-spin"></div>
        </div>
      ) : fareRUlesError ? (
        <div className="text-sm text-center">
          Something went wrong, please try again
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="w-fit py-2 mb-2 text-lg font-bold">
            Fare Details and Rules
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: fareRules,
            }}
            className="flex flex-col gap-1 text-sm"
          ></div>
        </div>
      )}
    </div>
  );
};

export const FlightSegment = ({ segments }) => {
  function getTime(totalMinutes) {
    if (totalMinutes) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours ? hours + "h" : ""} ${minutes ? minutes + "m" : ""}`;
    }

    return totalMinutes;
  }

  return (
    <div className="w-full max-w-full p-3 bg-[#FAFBFC] text-[rgba(0,0,0,0.85)] text-sm leading-[21px] rounded-md">
      {segments.map((segment, i) => (
        <div key={i}>
          {i !== 0 && (
            <div className="text-center my-[25px]">
              <div className="text-[#4a4a4a] bg-[#f4f4f4] inline-block relative text-xs rounded px-2.5 py-1.5">
                <span className="text-[#4a4a4a] bg-[#dfdfdf] block absolute text-xs left-[-50px] md:left-[-100px] h-[1px] w-[50px] md:w-[100px] md:top-[13.7px] top-[50%]"></span>

                <div className="flex flex-col md:flex-row gap-2">
                  <b className="font-black">Change of planes</b>
                  <b>
                    {getTime(segment?.ground_time)}
                    {" Layover in "}
                    {segment?.origin?.city_name}
                  </b>
                </div>

                <span className="text-[#4a4a4a] bg-[#dfdfdf] block absolute text-xs right-[-50px] md:right-[-100px] h-[1px] w-[50px] md:w-[100px] md:top-[13.7px] top-[50%]"></span>
              </div>
            </div>
          )}

          <div>
            <div className="flex flex-row gap-3 items-center mb-3">
              <Logo src={segment?.airline?.code} />
              <span className="space-x-2">
                <span className="text-black font-bold">
                  {segment?.airline?.name}
                </span>
                <span className="text-[#6d7278]">
                  {segment?.airline?.code}-{segment?.airline?.flight_number}
                </span>
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-5">
              <div className="md:w-[50%] flex flex-row gap-3 justify-between">
                <div className="flex-1">
                  <p className="text-black text-lg font-bold m-0">
                    {new Date(segment?.origin?.departure_time)
                      .getHours()
                      .toString()
                      .padStart(2, "0")}
                    :
                    {new Date(segment?.origin?.departure_time)
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}
                  </p>

                  <p className="text-black text-xs font-bold mb-2">
                    {new Date(segment?.origin?.departure_time).toDateString()}
                  </p>

                  <p className="text-xs m-0">
                    {segment?.origin?.city_name} (
                    {segment?.origin?.airport_code})
                  </p>

                  {segment?.origin?.terminal ? (
                    <p className="text-xs">
                      Terminal: {segment.origin.terminal}
                    </p>
                  ) : null}
                </div>

                <div className="flex-1 text-xs text-center">
                  <div className="text-sm text-gray-600">
                    {getTime(segment?.duration)}
                  </div>
                  <div className="relative h-4">
                    <p className="h-[3px] absolute left-0 right-0 top-0.5 bottom-0 z-[1] border-t-[3px] border-[#F7E700]"></p>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-black text-lg font-bold m-0">
                    {new Date(segment?.destination?.arrival_time)
                      .getHours()
                      .toString()
                      .padStart(2, "0")}
                    :
                    {new Date(segment?.destination?.arrival_time)
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}
                  </p>
                  <p className="text-black text-xs font-bold mb-2">
                    {new Date(
                      segment?.destination?.arrival_time
                    ).toDateString()}
                  </p>
                  <p className="text-xs m-0">
                    {segment?.destination?.city_name} (
                    {segment?.destination?.airport_code})
                  </p>
                  {segment?.destination?.terminal ? (
                    <p className="text-xs">
                      Terminal: {segment.destination.terminal}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="md:w-[50%] flex flex-row items-start justify-between text-xs">
                <p className="flex flex-col gap-2">
                  <span className="text-sm font-bold text-left pr-2.5">
                    CHECK IN BAGGAGE
                  </span>
                  <span className="text-[#4a4a4a] text-left pr-2.5">
                    {segment?.baggage_allowance}
                  </span>
                </p>

                <p className="flex flex-col gap-2">
                  <span className="text-sm font-bold text-left pr-2.5">
                    CABIN BAGGAGE
                  </span>
                  <span className="text-[#4a4a4a] text-left pr-2.5">
                    {segment?.cabin_baggage_allowance}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
