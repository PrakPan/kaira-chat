import React, { useState } from "react";
import { Heading } from "../flights/SectionOne";
import { IoMdClose } from "react-icons/io";
import { FlightSegment } from "../../../containers/itinerary/TransfersContainer/FlightDetail";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { updateTransferBookings } from "../../../store/actions/transferBookingsStore";
import { PulseLoader } from "react-spinners";
import { axiosDeleteBooking } from "../../../services/itinerary/bookings";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import Image from "next/image";
import { openNotification } from "../../../store/actions/notification";
import BackArrow from "../../ui/BackArrow";
import { Generalbuttonstyle } from "../../ui/button/Generallinkbutton";

export const Text = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;

const FlightDetailModal = ({
  segments,
  fareRule,
  setShowDetails,
  name,
  booking_id,
  originCityId,
  destinationCityId,
  drawer,
  onChange,
  isEmbedded,
  setShowDrawer,
  setHandleShow
}) => {
  const router = useRouter();
  const fareRules = fareRule?.fareRuleDetail;
  const fareRulesLoading = false;
  const fareRUlesError = false;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if(!localStorage.getItem("access_token")){
      props?.setShowLoginModal(true)
      return
    }
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
            text: "Booking deleted Successfuly",
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

  return (
    <div className="relative flex flex-col gap-4 rounded-md px-3 py-2">
     { !isEmbedded && <div className="flex flex-col gap-2">
        <Heading>
          <div className="flex flex-row items-center gap-2">
            <BackArrow handleClick={() => setShowDetails((prev) => !prev)} />
          </div>
        </Heading>
      </div>
}
      {!drawer && !isEmbedded && <> <Text>{name}</Text>
      {(
                  <div className="font-lexend flex justify-between items-start !m-0">
                    {loading ? (
                      <div className="w-16 h-5 bg-gray-300 opacity-50 rounded"></div>
                    ) : (
                      <>
                        {/* <Text>{name}</Text> */}
                        <Generalbuttonstyle
                          borderRadius={"7px"}
                          fontSize={"1rem"}
                          padding={"7px 25px"}
                          onClick={() => {
                            setHandleShow(false);
                            setShowDrawer(true);
                            //setShowTaxi(true);console.log("")
                          }}
                        >
                          Change
                        </Generalbuttonstyle>
                      </>
                    )}
                  </div>
                )}
            </>
      }
      <div className="flex flex-col gap-2 p-2">
        <FlightSegment
          segments={segments}
          originCityId={originCityId}
          destinationCityId={destinationCityId}
          combo={isEmbedded}
        />
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
     { !isEmbedded && <div className="p-4 bg-white">
        <button
          className="w-full  text-white py-2 rounded-lg flex items-center justify-center bg-[#ba2121] hover:bg-[#a41515]"
          onClick={handleDelete}
          disabled={loading}
        >
          <div style={{ position: "relative" }}>
            <div style={loading ? { visibility: "hidden" } : {}}>
              <div className="flex gap-1 items-center">
                <div>
                  <Image src="/delete.svg" width={"20"} height={"20"} />
                </div>{" "}
                <div>Delete Booking</div>
              </div>
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
      </div>}

      <ToastContainer />
    </div>
  );
};

export default FlightDetailModal;
