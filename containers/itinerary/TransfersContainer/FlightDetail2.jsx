import React from "react";
import { useState, useEffect } from "react";
import { axiosFlightFareRule } from "../../../services/bookings/FlightSearch";
import { MERCURY_HOST } from "../../../services/constants";
import axios from "axios";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import { Text, Heading } from "../../../components/modals/flights/SectionOne";
import { IoMdClose } from "react-icons/io";
import { connect, useDispatch } from "react-redux";
import {
  setTransfersBookings,
  updateTransferBookings,
} from "../../../store/actions/transferBookingsStore";
import { Generalbuttonstyle } from "../../../components/ui/button/Generallinkbutton";
import { Logo } from "../../../components/modals/flights/new-flight-searched/LogoContainer";
import { axiosDeleteBooking } from "../../../services/itinerary/bookings";
import { PulseLoader } from "react-spinners";
import Image from "next/image";
import { openNotification } from "../../../store/actions/notification";
import BackArrow from "../../../components/ui/BackArrow";
import { FaPlane } from "react-icons/fa";
import styled from "styled-components";

const DottedLine = styled.div`
  position: relative;
  height: 2px;
  width: 100%;
  color: #c5c1c1;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(to right, #c5c1c1 5px, transparent 5px);
    background-size: 9px 100%; /* Adjust this value to change the spacing between the dots */
  }
`;

const Circle = styled.div`
  border: 1px solid #c5c1c1;
  height: 10px;
  width: 10px;
  border-radius: 100%;
  background: #c5c1c1;
  position: absolute;
  z-index: 1;
  top: 50%;
  transform: translateY(-38%);
`;

const Plan = styled.div`
  position: absolute;
  left: 50%;
  top: 0%;
  transform: translate(-50%, -45%);
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
  name,
  transferBookings,
  setTransferBookings,
  setTransferBookingsIntercity,
  onChange,
  type,
}) => {
  const router = useRouter();
  const [fareRules, setFareRules] = useState(fareRule?.[0]?.fareRuleDetail);
  const [fareRulesLoading, setFareRulesLoading] = useState(false);
  const [fareRUlesError, setFareRulesError] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axiosDeleteBooking.delete(
        `${router?.query?.id}/bookings/flight/${booking_id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status === 204) {
        dispatch(updateTransferBookings(booking_id));
        setLoading(false);
        dispatch(
          openNotification({
            type: "success",
            text: `${name} deleted successfuly`,
            heading: "Success!",
          })
        );
      }
    } catch (err) {
      dispatch(
        openNotification({
          type: "error",
          text: `${err.message}`,
          heading: "Error!",
        })
      );
      setLoading(false);
    }
  };

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
        res?.data?.transfer_details?.items?.[0]?.fare_rule?.[0]?.fareRuleDetail
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
          <Heading>
            <BackArrow handleClick={() => setShowDetails((prev) => !prev)} />
          </Heading>
        </div>
      )}
      {onChange && (
        <div className="font-lexend flex justify-between items-start !m-0">
          <Text>{name}</Text>
          <Generalbuttonstyle
            borderRadius={"7px"}
            fontSize={"1rem"}
            padding={"7px 25px"}
            onClick={onChange}
          >
            Change
          </Generalbuttonstyle>
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
      {type != "combo" && (
        <div className="w-full flex justify-end">
          <button
            className="right-0  text-white p-1 rounded-lg flex items-center justify-center bg-[#ba2121] hover:bg-[#a41515] p-2"
            onClick={handleDelete}
            disabled={loading}
          >
            <div style={{ position: "relative" }}>
              <div
                className="flex gap-1 items-center"
                style={loading ? { visibility: "hidden" } : {}}
              >
                <div>
                  <Image src="/delete.svg" width={"20"} height={"20"} />
                </div>
                <div>Delete Booking</div>
              </div>
              {loading && (
                <PulseLoader
                  style={{
                    position: "absolute",
                    top: "55%",
                    left: "50%",
                    transform: "translate(-50% , -50%)",
                  }}
                  size={12}
                  speedMultiplier={0.6}
                  color="#ffffff"
                />
              )}
            </div>
          </button>
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
    <div className="max-w-full bg-[#FCFAFA] p-[20px] rounded-[12px] text-[rgba(0,0,0,0.85)] text-sm leading-[21px] rounded-md">
      {segments.map((segment, i) => (
        <div key={i}>
          {i !== 0 && (
            <div className="text-center my-[25px]">
              <div className="text-[#4a4a4a] bg-[#f4f4f4] inline-block relative text-xs rounded px-2.5 py-1.5">
                <span className="text-[#4a4a4a] bg-[#dfdfdf] block absolute text-xs left-[-50px] md:left-[-100px] h-[1px] w-[50px] md:w-[100px] md:top-[13.7px] top-[50%]"></span>
                <div className="flex flex-col md:flex-row gap-2">
                  <b className="font-black">Change of planes</b>
                  <b>{`${getTime(segment?.ground_time)} Layover in ${
                    segment?.origin?.airport_name
                  }`}</b>
                </div>
                <span className="text-[#4a4a4a] bg-[#dfdfdf] block absolute text-xs right-[-50px] md:right-[-100px] h-[1px] w-[50px] md:w-[100px] md:top-[13.7px] top-[50%]"></span>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-3 items-center mb-3">
              <Logo src={segment?.airline?.code} />
              <span className="space-x-2">
                <span className="text-black font-bold">
                  {segment?.airline?.name}
                </span>
                <span className="text-[#6d7278]">{`${segment?.airline?.code}-${segment?.airline?.flight_number}`}</span>
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 text-[#C5C1C1]">
              <div
                className="w-full"
                style={{
                  margin: "0",
                  position: "relative",
                  height: "0px",
                  top: "50%",
                }}
              >
                <Circle style={{ left: 0 }} color="#C5C1C1" />
                <DottedLine color="#C5C1C1" />
                <Circle style={{ right: 0 }} />
                <Plan>
                  <FaPlane style={{ fontSize: "1.25rem" }} />
                </Plan>
              </div>
              <div className="flex-1 text-xs text-black text-[10px] mt-1 text-center">
                {getTime(segment?.accumulated_duration)}
              </div>
            </div>

            <div className="flex flex-col  justify-between">
              <div className=" flex flex-row gap-3 justify-between ">
                {["origin"].map((key) => (
                  <div key={key} className="flex flex-col w-[200px]">
                    <p className="text-black text-[16px] sm:text-[18px] font-semibold m-0">
                      {segment[key]?.airport_code}
                    </p>

                    <p className="text-[10px] sm:text-[12px] font-normal m-0">
                      {segment[key]?.airport_name}
                    </p>

                    <div className=" sm:flex sm:gap-1 text-black text-[10px] sm:text-[14px] sm:font-semibold font-normal mb-2 mt-[12px] ">
                    <div >
                    {new Date(
                      segment[key]?.departure_time ||
                        segment[key]?.arrival_time
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    </div>
                    <div className="hidden sm:!block px-1">|</div>
                    <div >
                    {new Date(
                      segment[key]?.departure_time ||
                        segment[key]?.arrival_time
                    ).toDateString()}
                    </div>
                  </div>

                  </div>
                ))}

                {["destination"].map((key) => (
                  <div key={key} className="flex flex-col w-[200px]">
                    <p className="text-black text-[16px] sm:text-[18px] font-semibold m-0 flex justify-end">
                      {segment[key]?.airport_code}
                    </p>

                    <p className="text-[10px] sm:text-[12px] font-normal m-0 flex justify-end">
                      {segment[key]?.airport_name}
                    </p>

                    <div className=" sm:flex sm:gap-1 text-black text-[10px] sm:text-[14px] sm:font-semibold font-normal mb-2 mt-[12px] justify-end">
                      <div className="flex justify-end">
                        {new Date(
                          segment[key]?.departure_time ||
                            segment[key]?.arrival_time
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="hidden sm:!block px-1">|</div>
                      <div className="flex justify-end">
                        {new Date(
                          segment[key]?.departure_time ||
                            segment[key]?.arrival_time
                        ).toDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex  items-start justify-between gap-[20px] text-xs mt-4">
                {["baggage_allowance", "cabin_baggage_allowance"].map((key) => (
                  <p
                    key={key}
                    className="flex flex-col gap-2 p-[10px] w-full bg-[#6464640C] rounded-[8px]"
                  >
                    <span className="font-normal text-left pr-2.5 text-[14px]">
                      {key
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </span>
                    <span className=" text[18px] font-semibold text-left pr-2.5">
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

const mapDispatchToProps = (dispatch) => {
  return {
    setTransfersBookings: (payload) => dispatch(setTransferBookings(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Details);
