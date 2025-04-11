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
  onChange
}) => {
  const router = useRouter();
  const fareRules = fareRule?.fareRuleDetail;
  const fareRulesLoading = false;
  const fareRUlesError = false;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  
  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axiosDeleteBooking.delete(
        `${router?.query?.id}/bookings/flight/${booking_id}/`
      );

      if (response.status === 204) {
        dispatch(updateTransferBookings(booking_id));
        setLoading(false);
        toast.success("Booking deleted successfuly");
        console.log("Deleted Booking");
      }
    } catch (err) {
      console.log(
        "[ERROR][ItineraryPage][axiosDeleteBooking:/Delete_Booking]",
        err
      );
      toast.error("Error", err.message);
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col gap-4 rounded-md px-3 py-2">
        <div className="flex flex-col gap-2">
          <Heading>
            <div className="flex flex-row items-center gap-2">
              <IoMdClose
                className="hover-pointer"
                onClick={() => setShowDetails((prev) => !prev)}
                style={{ fontSize: "2rem" }}
              ></IoMdClose>
              <Text>Back To Itinerary</Text>
            </div>
          </Heading>
        </div>
      
      {!onChange && !drawer && (
          <Text>
          {name}
          </Text>
      )}
      <div className="flex flex-col gap-2 p-2">
        <FlightSegment 
          segments={segments} 
          originCityId={originCityId} 
          destinationCityId={destinationCityId}
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
      <div className="p-4 bg-white">
        <button
          className="w-full  text-white py-2 rounded-lg flex items-center justify-center bg-[#ba2121] hover:bg-[#a41515]"
          onClick={handleDelete}
          disabled={loading}
        >
          <div style={{ position: "relative" }}>
            <div style={loading ? { visibility: "hidden" } : {}}>
              🗑 Delete Booking
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

      <ToastContainer />
    </div>
  );
};



export default FlightDetailModal;