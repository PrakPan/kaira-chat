
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
import { setTransferBookings } from "../../../store/actions/transferBookingsStore";
import { Generalbuttonstyle } from "../../../components/ui/button/Generallinkbutton";
import { Logo } from "../../../components/modals/flights/new-flight-searched/LogoContainer";
import { render } from "nprogress";

const Details = ({
    segments,
    provider,
    resultIndex,
    setShowDetails,
    fareRule,
    individual,
    booking_id,
    drawer,
    name,
    transferBookings,
    setTransferBookings
  }) => {
    const dispatch=useDispatch();
    const router = useRouter();
    const [fareRules, setFareRules] = useState(fareRule?.fareRuleDetail);
    const [fareRulesLoading, setFareRulesLoading] = useState(false);
    const [fareRUlesError, setFareRulesError] = useState(false);
  
    useEffect(() => {
      if (fareRules == null) {
        getFareRules();
      }
    }, []);
  
    const getFareRules = async () => {
      setFareRulesLoading(true);
      setFareRulesError(false);
  
      let traceId;
      if (booking_id) {
        const res = await axios.get(
          `${MERCURY_HOST}/api/v1/itinerary/${router?.query?.id}/bookings/flight/${booking_id}`
        );
        setFareRules(
          res?.data?.flight_details?.items?.[0]?.fare_rule?.[0]?.fareRuleDetail
        );
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
      <div className="relative flex flex-col gap-4 rounded-md px-3 py-2">
        {drawer && (
          <div className="flex flex-col gap-2">
            <Heading className="font-lexend flex flex-col items-start !m-0">
              <div className="flex flex-row items-center gap-2">
                <IoMdClose
                  className="hover-pointer"
                  onClick={() => setShowDetails((prev) => !prev)}
                  style={{ fontSize: "2rem" }}
                ></IoMdClose>
                <Text>{name}</Text>
              </div>
            </Heading>
          </div>
        )}
        <div className="flex flex-col gap-2 p-2 ">
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
              className="flex flex-col gap-1 text-sm ml-4"
            ></div>
          </div>
        )}
        {provider && (
          <div className="flex justify-end">
            <Generalbuttonstyle
              bgColor={"#F7E700"}
              borderRadius="8px"
              fontWeight="400"
              padding="0.6rem 0.6rem"
              hoverColor="white"
              margin="auto 0px"
              onclickparam={null}
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
                    toast.success("Added booking Successfuly");
                    window.location.href = `/flights/book/${res.data.id}`;
                  } else {
                    const res = await axios.post(
                      MERCURY_HOST +
                        `/api/v1/itinerary/${router?.query?.id}/bookings/flight/`,
                      {
                        trace_id: localStorage.getItem(`${provider}_trace_id`),
                        result_indices: [resultIndex],
                        booking_id: booking_id,
                      }
                    );
                    const updatedTransferBookings = {
                      ...transferBookings,
                      intercity: {
                        ...transferBookings.intercity,
                        [res?.data?.source_address?.hub_id + ":" + res?.data?.destination_address?.hub_id]: res?.data
                      }
                    };
                    setTransferBookings(updatedTransferBookings); 
                    
                    toast.success("Updated booking Successfuly");
                  }
                } catch (error) {
                  console.log('error is:',error)
                  toast.error("Some error occured");
                }
              }}
              className="z-[1600]"
            >
              {individual ? <>Book Now</> : <>Add To Itinerary</>}
            </Generalbuttonstyle>
          </div>
        )}
        <ToastContainer />
      </div>
    );
  };
 const FlightSegment = ({ segments }) => {
    function getTime(totalMinutes) {
      if (totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours ? hours + "h" : ""} ${minutes ? minutes + "m" : ""}`;
      }
  
      return totalMinutes;
    }
  
    return (
      <div className="max-w-full p-0 bg-[#FAFBFC] text-[rgba(0,0,0,0.85)] text-sm leading-[21px] rounded-md">
        {segments.map((segment, i) => (
          <div key={i}>
            {i !== 0 && (
              <div className="text-center my-[25px]">
                <div className="text-[#4a4a4a] bg-[#f4f4f4] inline-block relative text-xs rounded px-2.5 py-1.5">
                  <span className="text-[#4a4a4a] bg-[#dfdfdf] block absolute text-xs left-[-50px] md:left-[-100px] h-[1px] w-[50px] md:w-[100px] md:top-[13.7px] top-[50%]"></span>
                  <div className="flex flex-col md:flex-row gap-2">
                    <b className="font-black">Change of planes</b>
                    <b>{`${getTime(segment?.ground_time)} Layover in ${
                      segment?.origin?.city_name
                    }`}</b>
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
                  <span className="text-[#6d7278]">{`${segment?.airline?.code}-${segment?.airline?.flight_number}`}</span>
                </span>
              </div>
              <div className="flex flex-col  justify-between">
                <div className=" flex flex-row gap-3 justify-between items-center">
                  {["origin"].map((key) => (
                    <div key={key} className="flex flex-col w-[200px]">
                      <p className="text-black text-lg font-bold m-0">
                        {new Date(
                          segment[key]?.departure_time ||
                            segment[key]?.arrival_time
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-black text-xs font-bold mb-2">
                        {new Date(
                          segment[key]?.departure_time ||
                            segment[key]?.arrival_time
                        ).toDateString()}
                      </p>
                      <p className="text-xs m-0">
                        {segment[key]?.city_name} ({segment[key]?.airport_code})
                      </p>
                      {segment[key]?.terminal && (
                        <p className="text-xs">
                          Terminal: {segment[key].terminal}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="flex-1 text-xs text-center">
                    <div className="text-sm text-gray-600">
                      {getTime(segment?.duration)}
                    </div>
                    <div className=" h-4">
                      <p className="h-[3px]  z-[1] border-t-[3px] border-[#F7E700]"></p>
                    </div>
                  </div>
                  {["destination"].map((key) => (
                    <div
                      key={key}
                      className="flex flex-row justify-end w-[200px]"
                    >
                      <div className="flex flex-col justify-end w-max">
                        <p className="text-black text-lg font-bold m-0">
                          {new Date(
                            segment[key]?.departure_time ||
                              segment[key]?.arrival_time
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-black text-xs font-bold mb-2">
                          {new Date(
                            segment[key]?.departure_time ||
                              segment[key]?.arrival_time
                          ).toDateString()}
                        </p>
                        <p className="text-xs m-0">
                          {segment[key]?.city_name} ({segment[key]?.airport_code})
                        </p>
                        {segment[key]?.terminal && (
                          <p className="text-xs">
                            Terminal: {segment[key].terminal}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex  items-start justify-between text-xs ">
                  {["baggage_allowance", "cabin_baggage_allowance"].map((key) => (
                    <p key={key} className="flex flex-col gap-2">
                      <span className="text-sm font-bold text-left pr-2.5">
                        {key.toUpperCase().replace("_", " ")}
                      </span>
                      <span className="text-[#4a4a4a] text-left pr-2.5">
                        {segment[key]}
                      </span>
                    </p>
                  ))}
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


  
  const mapDispatchToProps = {
    setTransferBookings,
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Details);