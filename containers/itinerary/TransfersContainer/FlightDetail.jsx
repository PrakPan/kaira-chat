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
  transferBookings,
  edge,
  getPaymentHandler,
  combo,
}) => {
  // console.log("transferbookings is:",transferBookings)
  const router = useRouter();
  const [fareRules, setFareRules] = useState(fareRule?.[0]?.fareRuleDetail);
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
    <div className="relative flex flex-col gap-4 rounded-md">
      {drawer && (
        <div className="flex flex-col gap-2">
          <Heading>
            <div className="flex flex-row items-center gap-2">
              <BackArrow handleClick={() => setShowDetails((prev) => !prev)} />
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
        fareRules && (
          <>
            {" "}
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
          </>
        )
      )}
      {provider && !combo && (
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
                // setLoading(true);
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
                  // console.log("updating",originCityId)
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
                      text: "Updated booking Successfuly",
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
            className="z-[1600]"
          >
            <div className="flex justify-center items-center relative min-w-[120px] h-[24px]">
              <span className={`${loading ? "invisible" : "visible"}`}>
                {individual ? "Book Now" : "Add To Itinerary"}
              </span>

              {loading && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <PulseLoader
                    size={12}
                    speedMultiplier={0.6}
                    color="#000000"
                  />
                </div>
              )}
            </div>
          </Generalbuttonstyle>
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
    <div className="max-w-full bg-[#FCFAFA] p-[20px] border-[#ECE8E8] border-2 rounded-[12px] text-[rgba(0,0,0,0.85)] text-sm leading-[21px]">
      {segments.map((segment, i) => (
        <div key={i}>
          {i !== 0 && (
            <div className="text-center  my-[30px]">
              <div className="flex items-center  gap-2">
                <div className="hidden sm:!block w-[35px] border-[1px] border-[#FDCA05]"></div>
                {/* <span className="text-[#4a4a4a] bg-[#dfdfdf] block absolute text-xs left-[-50px] md:left-[-100px] h-[1px] w-[50px] md:w-[100px] md:top-[13.7px] top-[50%]"></span> */}
                <div className=" flex flex-col gap-[2px] text-[#4a4a4a] bg-[rgba(253,202,5,0.11)] rounded-[40px] px-[16px] py-[8px] w-full">
                  <div className="font-black text-[12px] sm:text-[14px] font-semibold">
                    Change of planes
                  </div>
                  <div className="text-[10px] sm:text-[12px]">{`${getTime(
                    segment?.ground_time
                  )} Layover in ${segment?.origin?.airport_name}`}</div>
                </div>
                <div className="hidden sm:!block  w-[35px] border-[1px] border-[#FDCA05]"></div>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-3 items-center mb-3">
              <Logo src={segment?.airline?.code} />
              <span className="space-x-2">
                <span className="text-black font-bold">
                  {segment?.airline?.name + " |"}
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
                {getTime(segment?.duration)}
              </div>
            </div>

            <div className="flex flex-col  justify-between">
              <div className=" flex flex-row gap-3 justify-between ">
                {["origin"].map((key) => (
                  <div key={key} className="flex flex-col w-full">
                    <p className="text-black text-[16px] sm:text-[18px] font-semibold m-0">
                      {segment[key]?.airport_code}
                    </p>

                    <p className="text-[10px] sm:text-[12px] font-normal m-0">
                      {segment[key]?.airport_name}
                    </p>
                  </div>
                ))}

                {["destination"].map((key) => (
                  <div key={key} className="flex flex-col w-full">
                    <p className="text-black text-[16px] sm:text-[18px] font-semibold m-0 flex justify-end">
                      {segment[key]?.airport_code}
                    </p>

                    <p className="text-[10px] sm:text-[12px] font-normal m-0 flex justify-end">
                      {segment[key]?.airport_name}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col  justify-between w-full">
                <div className=" flex flex-row gap-3 justify-between w-full">
                  {["origin"].map((key) => (
                    <div key={key} className="flex flex-col w-full">
                      {segment[key]?.terminal && (
                        <div className="text-[10px] sm:text-[12px] font-normal m-0 flex">
                          <div>
                            {" "}
                            {segment[key]?.terminal.split(" ")[0] == "Terminal"
                              ? ""
                              : "Terminal"}{" "}
                            {segment[key]?.terminal} {segment[key]?.terminal}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {["destination"].map((key) => (
                    <div key={key} className="flex flex-col w-full">
                      <div className="text-[10px] sm:text-[12px] font-normal m-0 flex justify-end">
                        {segment[key]?.terminal && (
                          <div className="flex justify-end">
                            {segment[key]?.terminal.split(" ")[0] == "Terminal"
                              ? ""
                              : "Terminal"}{" "}
                            {segment[key]?.terminal}{" "}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col  justify-between w-full">
                <div className=" flex flex-row gap-3 justify-between w-full">
                  {["origin"].map((key) => (
                    <div key={key} className="flex flex-col w-full">
                      <div className=" sm:flex sm:gap-1 text-black text-[10px] sm:text-[14px] sm:font-semibold font-normal mb-2 mt-[12px]">
                        <div>
                          {new Date(
                            segment[key]?.departure_time ||
                              segment[key]?.arrival_time
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="hidden sm:!block px-1">|</div>
                        <div>
                          {new Date(
                            segment[key]?.departure_time ||
                              segment[key]?.arrival_time
                          ).toDateString()}
                        </div>
                      </div>
                    </div>
                  ))}

                  {["destination"].map((key) => (
                    <div key={key} className="flex flex-col w-full">
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
              </div>

              <div className="flex  items-start justify-between gap-[20px] text-xs mt-4 w-full">
                {["baggage_allowance", "cabin_baggage_allowance"].map((key) => (
                  <div
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
                  </div>
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
    setTransfersBookings: (payload) => dispatch(setTransfersBookings(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Details);
