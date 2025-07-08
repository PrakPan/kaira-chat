import React, { useState } from "react";
import { BsCalendar2 } from "react-icons/bs";
import { FaCheck, FaPen } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { axiosUpdateItineraryDates } from "../../../services/itinerary/daybyday/preview";
import { useRouter } from "next/router";
import setItinerary from "../../../store/actions/itinerary";
import SingleDateInput from "../SingleDateInput";

const UpdateItineraryDates = ({
  itinerary,
  token,
  onUpdateSuccess,
  convertDFormat,
  tripsPage = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState(itinerary?.start_date || "");
  const [endDate, setEndDate] = useState(itinerary?.end_date || "");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Calculate duration between dates
  const calculateDuration = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0]; // Remove time part if exists
  };

  // Validate dates
  const validateDates = () => {
    if (!startDate || !endDate) return false;
    return new Date(startDate) < new Date(endDate);
  };

  // Handle date update API call
  const handleUpdateDates = async () => {
    if (!validateDates()) {
      alert("Please select valid dates. End date must be after start date.");
      return;
    }

    setIsLoading(true);

    const payload = {
      start_date: startDate,
      end_date: endDate,
    };

    axiosUpdateItineraryDates
      .post(`${router.query.id}/update-dates/`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {
        setItinerary(res?.data?.data);

        setIsEditing(false);
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("ERROR:UPDATING ITINERARY DATES", error.message);
      });
  };

  // Handle cancel
  const handleCancel = () => {
    setStartDate(itinerary?.start_date || "");
    setEndDate(itinerary?.end_date || "");
    setIsEditing(false);
  };

  // Handle edit click
  const handleEditClick = () => {
    setStartDate(formatDateForInput(itinerary?.start_date));
    setEndDate(formatDateForInput(itinerary?.end_date));
    setIsEditing(true);
  };

  return (
    <div className="border-y border-[#F0F0F0] mb-3 mt-2 ml-1">
      <div className="group flex flex-row gap-3 items-center py-[1rem]">
                {!isEditing ? 
<BsCalendar2 className="text-md text-[#7A7A7A]" /> :""}

        {!isEditing ? (
          // Display mode
          <div className="text-md font-medium text-black flex flex-row items-center gap-2">
            {tripsPage ? (
              <div>{itinerary?.duration + " Nights"}</div>
            ) : (
              <div>
                {convertDFormat(itinerary?.start_date)} -{" "}
                {convertDFormat(itinerary?.end_date)}
              </div>
            )}

            <button
              onClick={handleEditClick}
              className="cursor-pointer w-4 h-4 text-gray-500 transition-transform duration-300 group-hover:text-blue-500 group-hover:scale-110 active:scale-90"
            >
              <FaPen
                size={16}
                className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500"
              />
            </button>
          </div>
        ) : (
          // Edit mode
          <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-row gap-2 items-center">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-600">Start Date</label>
          <SingleDateInput
            value={startDate}
            onChange={setStartDate}
            id="start_date_picker"
            placeholder="Select start date"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-600">End Date</label>
          <SingleDateInput
            value={endDate}
            onChange={setEndDate}
            id="end_date_picker"
            placeholder="Select end date"
          />
        </div>
      </div>

      {startDate && endDate && (
        <div className="text-sm text-gray-600">
          Duration: {calculateDuration(startDate, endDate)} nights
        </div>
      )}

      <div className="flex flex-row gap-2">
        <button
          onClick={handleUpdateDates}
          disabled={isLoading || !validateDates()}
          className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
          ) : (
            <FaCheck size={14} />
          )}
          Confirm
        </button>

        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
        >
          <FaX size={14} />
          Cancel
        </button>
      </div>
    </div>
        )}
      </div>
    </div>
  );
};

export default UpdateItineraryDates;
