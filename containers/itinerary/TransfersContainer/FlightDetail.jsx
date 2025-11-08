import React from "react";
import { useState, useEffect } from "react";
import { axiosFlightFareRule } from "../../../services/bookings/FlightSearch";
import { MERCURY_HOST } from "../../../services/constants";
import axios from "axios";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import { Text, Heading } from "../../../components/modals/flights/SectionOne";
import { IoMdClose } from "react-icons/io";
import { connect, useDispatch, useSelector } from "react-redux";
import { setTransfersBookings } from "../../../store/actions/transferBookingsStore";
import { Generalbuttonstyle } from "../../../components/ui/button/Generallinkbutton";
import { Logo } from "../../../components/modals/flights/new-flight-searched/LogoContainer";
import { openNotification } from "../../../store/actions/notification";
import BackArrow from "../../../components/ui/BackArrow";
import styled from "styled-components";
import { FaPlane } from "react-icons/fa";
import PulseLoader from "react-spinners/PulseLoader";
import Pin from "../../newitinerary/breif/route/Pin";

const DottedLine = styled.div`
  position: relative;
  height: 2px;
  width: 100%;
  background-image: repeating-linear-gradient(
    to right,
    #d1d5db 0,
    #d1d5db 6px,
    transparent 6px,
    transparent 12px
  );
`;

const Circle = styled.div`
  border: 2px solid #d1d5db;
  height: 8px;
  width: 8px;
  border-radius: 100%;
  background: white;
  position: absolute;
  z-index: 1;
  top: 50%;
  transform: translateY(-50%);
`;

const PlaneIcon = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2px 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Details = ({
  originCityId,
  destinationCityId,
  segments,
  provider,
  resultIndex,
  setShowDetails,
  fareRule,
  individual,
  booking_id,
  drawer,
  transferBookings,
  edge,
  getPaymentHandler,
  combo,
}) => {
  const router = useRouter();
  const [fareRules, setFareRules] = useState(null);
  const [fareRulesLoading, setFareRulesLoading] = useState(false);
  const [fareRUlesError, setFareRulesError] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fareRules == null) {
      getFareRules();
    }
  }, []);

  const isValidUUID = (uuid) => {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  };

  const getFareRules = async () => {
    setFareRulesLoading(true);
    setFareRulesError(false);

    let traceId;
    if (booking_id) {
      const res = await axios.get(
        `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/flight/${booking_id}`
      );
      setFareRules(res?.data?.cancellation_policies);
      setFareRulesLoading(false);
    } else {
      const data = {
        trace_id: localStorage.getItem(`${provider}_trace_id`),
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
    }
  };

  return (
    <div className="relative flex flex-col gap-4">
      {drawer && (
        <div className="flex flex-col gap-2">
          <Heading>
            <div className="flex flex-row items-center gap-2">
              <BackArrow handleClick={() => setShowDetails((prev) => !prev)} />
            </div>
          </Heading>
        </div>
      )}
      
      <div className="flex flex-col gap-3">
        <FlightSegment segments={segments} />
      </div>

      {fareRulesLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="w-5 h-5 border-4 border-t-[#F8E000] rounded-full animate-spin"></div>
        </div>
      ) : fareRUlesError ? (
        <div className="text-sm text-center text-gray-600 py-4">
          Something went wrong, please try again
        </div>
      ) : (
        fareRules && (
          <div className="flex flex-col mt-2">
            <div className="text-sm leading-6">
              <h6 className="font-semibold text-base mb-3">
                Fare Details and Rules
              </h6>
              <div
                dangerouslySetInnerHTML={{
                  __html: fareRules,
                }}
                className="text-gray-700 prose prose-sm max-w-none"
              ></div>
            </div>
          </div>
        )
      )}
      
      {provider && !combo && (
        <div className="flex justify-end mt-4">
          <button 
            className="bg-[#F7E700] hover:bg-[#e6d600] text-black font-medium px-6 py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            onClick={async () => {
              try {
                if (individual == true) {
                  const res = await axios.post(
                    MERCURY_HOST +
                      `/api/v1/itinerary/${router?.query?.id}/bookings/flight/`,
                    {
                      trace_id: localStorage.getItem(`${provider}_trace_id`),
                      result_indices: [resultIndex],
                    }
                  );
                  window.location.href = `/flights/book/${res.data.id}`;
                  getPaymentHandler();
                } else {
                  setLoading(true);
                  const res = await axios.post(
                    MERCURY_HOST +
                      `/api/v1/itinerary/${router?.query?.id}/bookings/flight/`,
                    {
                      trace_id: localStorage.getItem(`${provider}_trace_id`),
                      result_indices: [resultIndex],
                      source_itinerary_city: originCityId ? originCityId : null,
                      destination_itinerary_city: destinationCityId
                        ? destinationCityId
                        : null,
                      booking_id: booking_id,
                      edge: edge,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "access_token"
                        )}`,
                      },
                    }
                  );
                  setLoading(false);
                  const updatedTransferBookings = {
                    ...transferBookings,
                    intercity: {
                      ...transferBookings.intercity,
                      [originCityId + ":" + destinationCityId]: res?.data,
                    },
                  };
                  dispatch(setTransfersBookings(updatedTransferBookings));
                  getPaymentHandler();
                  dispatch(
                    openNotification({
                      type: "success",
                      text: "Updated booking Successfully",
                      heading: "Success!",
                    })
                  );
                }
              } catch (error) {
                setLoading(false);
                dispatch(
                  openNotification({
                    type: "error",
                    text: `${error.response?.data?.errors[0]?.message[0]}`,
                    heading: "Error!",
                  })
                );
              }
            }}
          >
            <div className="flex justify-center items-center relative min-w-[120px] h-[24px]">
              <span className={`${loading ? "invisible" : "visible"}`}>
                {individual ? "Book Now" : "Add To Itinerary"}
              </span>
              {loading && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <PulseLoader
                    size={8}
                    speedMultiplier={0.6}
                    color="#000000"
                  />
                </div>
              )}
            </div>
          </button>
        </div>
      )}
      <ToastContainer />
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
    <div className="w-full bg-white p-2 md:p-5 border-t border-gray-200">
      {segments?.map((segment, i) => (
        <div key={i}>
          {i !== 0 && (
            <div className="my-6">
              <div className="flex items-center gap-3">
                <div className="hidden sm:block flex-shrink-0 w-8 h-px bg-[#FDCA05]"></div>
                <div className="flex flex-col gap-1 bg-[#FFF9E6] rounded-full px-4 py-2 w-full">
                  <div className="font-semibold text-xs md:text-sm text-gray-800">
                    Change of planes
                  </div>
                  <div className="text-xs text-gray-600">
                    {`${getTime(segment?.ground_time)} Layover in ${segment?.origin?.airport_name}`}
                  </div>
                </div>
                <div className="hidden sm:block flex-shrink-0 w-8 h-px bg-[#FDCA05]"></div>
              </div>
            </div>
          )}
          
          {/* <div className="flex flex-col gap-4">
         
            <div className="flex items-center gap-3">
              <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                <Logo src={segment?.airline?.code} />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm md:text-base text-gray-900">
                  {segment?.airline?.name}
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-xs md:text-sm text-gray-600">
                  {`${segment?.airline?.code}-${segment?.airline?.flight_number}`}
                </span>
              </div>
            </div>

            
            <div className="flex flex-col gap-1 my-2">
              <div className="relative w-full h-2 flex items-center">
                <Circle style={{ left: 0 }} />
                <DottedLine />
                <Circle style={{ right: 0 }} />
                <PlaneIcon>
                  <FaPlane className="text-gray-600 text-xs" style={{ transform: 'rotate(0deg)' }} />
                </PlaneIcon>
              </div>
              <div className="text-xs text-gray-500 text-center mt-1">
                {getTime(segment?.duration)}
              </div>
            </div>

        
            <div className="flex justify-between gap-4">
              <div className="flex flex-col flex-1">
                <div className="text-base md:text-lg font-semibold text-gray-900">
                  {segment?.origin?.airport_code}
                </div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">
                  {segment?.origin?.airport_name}
                </div>
                {segment?.origin?.terminal && (
                  <div className="text-xs text-gray-500 mt-1">
                    {segment?.origin?.terminal.includes("Terminal") ? "" : "Terminal "}
                    {segment?.origin?.terminal}
                  </div>
                )}
                <div className="text-xs md:text-sm font-medium text-gray-900 mt-2">
                  {new Date(segment?.origin?.departure_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(segment?.origin?.departure_time).toLocaleDateString([], {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>

              <div className="flex flex-col flex-1 items-end text-right">
                <div className="text-base md:text-lg font-semibold text-gray-900">
                  {segment?.destination?.airport_code}
                </div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">
                  {segment?.destination?.airport_name}
                </div>
                {segment?.destination?.terminal && (
                  <div className="text-xs text-gray-500 mt-1">
                    {segment?.destination?.terminal.includes("Terminal") ? "" : "Terminal "}
                    {segment?.destination?.terminal}
                  </div>
                )}
                <div className="text-xs md:text-sm font-medium text-gray-900 mt-2">
                  {new Date(segment?.destination?.arrival_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(segment?.destination?.arrival_time).toLocaleDateString([], {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Baggage Allowance</div>
                <div className="text-sm font-semibold text-gray-900">
                  {segment?.baggage_allowance || "N/A"}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Cabin Baggage</div>
                <div className="text-sm font-semibold text-gray-900">
                  {segment?.cabin_baggage_allowance || "N/A"}
                </div>
              </div>
            </div>

          
            <div className="bg-gray-50 rounded-lg p-3 mt-2">
              <div className="text-xs text-gray-600 mb-1">Cabin Class</div>
              <div className="text-sm font-semibold text-gray-900">
                {segment?.airline?.cabin_class || segment?.cabin_class || "N/A"}
              </div>
            </div>
          </div> */}

          <div className="flex flex-col gap-2">
  {/* Airline Info */}
  <div className="flex items-center gap-3">
    <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: '36px', height: '36px' }}>
      <Logo src={segment?.airline?.code} ht={36} wd={36} />
    </div>
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-semibold text-base text-gray-900">
        {segment?.airline?.name}
      </span>
      <span className="text-sm text-gray-500">
        {`${segment?.airline?.code}-${segment?.airline?.flight_number}`}
      </span>
    </div>
  </div>

  {/* Flight Route with Vertical Timeline */}
  <div className="flex gap-3  mx-2">
    {/* Timeline */}
   <div className="flex flex-col items-center pt-1">
      
      <Pin></Pin>
      <div className="w-0.7 flex-1 my-2 border-l-2 border-dashed border-gray-400"></div>
      
      <Pin></Pin>
    </div>

    {/* Content */}
    <div className="flex flex-col flex-1 gap-4">
      {/* Origin */}
      <div className="flex flex-col">
        <div className="font-medium text-sm text-gray-900">
          {segment?.origin?.airport_code === "DEL" ? "New Delhi" : segment?.origin?.airport_code}
          <span className="font-normal text-gray-600">
            , {segment?.origin?.airport_name}
            {segment?.origin?.terminal && `, Terminal ${segment?.origin?.terminal.replace("Terminal ", "")}`}
          </span>
        </div>
      </div>

      {/* Duration */}
      <div className="text-sm text-gray-600 -my-2">
        {getTime(segment?.duration)}
      </div>

      {/* Destination */}
      <div className="flex flex-col">
        <div className="font-medium text-sm text-gray-900">
          {segment?.destination?.airport_code === "TXL" ? "Berlin" : segment?.destination?.airport_code}
          <span className="font-normal text-gray-600">
            , {segment?.destination?.airport_name}
            {segment?.destination?.terminal && `, Terminal ${segment?.destination?.terminal.replace("Terminal ", "")}`}
          </span>
        </div>
      </div>
    </div>
  </div>

  {/* Information Grid */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
    <div>
      <div className="text-sm font-semibold text-gray-900 mb-1">
        Cabin Class
      </div>
      <div className="text-sm text-gray-600">
        {segment?.airline?.cabin_class || segment?.cabin_class || "N/A"}
      </div>
    </div>
    
    <div>
      <div className="text-sm font-semibold text-gray-900 mb-1">
        Baggage Allowance
      </div>
      <div className="text-sm text-gray-600">
        {segment?.baggage_allowance || "N/A"}
      </div>
    </div>
    
    <div>
      <div className="text-sm font-semibold text-gray-900 mb-1">
        Cabin Baggage Allowance
      </div>
      <div className="text-sm text-gray-600">
        {segment?.cabin_baggage_allowance || "N/A"}
      </div>
    </div>
  </div>
</div>
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  transferBookings: state.TransferBookings.transferBookings,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setTransfersBookings: (payload) => dispatch(setTransfersBookings(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Details);