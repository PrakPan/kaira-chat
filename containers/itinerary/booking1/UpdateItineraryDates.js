import React, { useEffect, useState } from "react";
import { BsCalendar2 } from "react-icons/bs";
import { FaPen } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { axiosUpdateItineraryDates } from "../../../services/itinerary/daybyday/preview";
import setItinerary from "../../../store/actions/itinerary";
import { useRouter } from "next/router";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DateRangePicker } from "react-dates";
import moment from "moment";
import styled from "styled-components";

const StyledDateRangeContainer = styled.div`
  .DateRangePicker {
    width: 100%;
  }

  .DateRangePickerInput {
    
    border: none;
    display: flex;
    gap: 16px;
    background: initial;
    width: 100%;
    margin-left:-0.25rem;
  }

  .DateInput {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    overflow: hidden;
    background: #f9fafb;
    display: hidden;
  }

  .DateInput > input {
    font-family: inherit;
    font-weight: 400;
    font-size: 0.875rem;
    padding: 12px;
    background: #f9fafb;
    border: none;
    cursor: pointer;
    display: hidden;
  }

  .DateInput_input__focused {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .DateRangePickerInput_arrow {
    display: none !important;
  }

  .DateRangePicker_picker {
    z-index: 1000;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);

    /* Desktop styles */
    @media (min-width: 768px) {
      top: 100% !important;
      left: -210px !important;
      position: absolute;
    }

    /* Mobile styles */
    @media (max-width: 767px) {
      position: fixed !important;
      top: auto !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      transform: none !important;
      border-radius: 16px 16px 0 0 !important;
      max-height: 70vh;
      overflow-y: auto;
    }
  }

  .DayPicker__withBorder {
    @media (max-width: 767px) {
      border: none;
      box-shadow: none;
    }
  }

  .CalendarDay {
    border: 0px;
    margin: 1px;
  }

  .CalendarDay__selected,
  .CalendarDay__selected:hover {
    background-color: #f7e700;
    border: 0px;
    color: black;
  }

  .CalendarDay__selected_span,
  .CalendarDay__hovered_span {
    background-color: #f7e70033;
    color: black;
    border: 0px;
  }

  .CalendarDay__selected_span:hover,
  .CalendarDay__hovered_span:hover {
    background-color: #f7e7004a;
    color: black;
  }

  .DayPickerKeyboardShortcuts_show__topRight {
    display: none;
  }

  /* Mobile header */
  @media (max-width: 767px) {
    .DateRangePicker_picker::before {
      content: "";
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 36px;
      height: 4px;
      background-color: #f7e700;
      border-radius: 2px;
    }
  }
`;

const MobileOverlay = styled.div`
  @media (max-width: 767px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const UpdateItineraryDates = ({
  itinerary,
  token,
  onUpdateSuccess,
  convertDFormat,
  tripsPage = false,
  setShowEditDate
}) => {
  const [startDate, setStartDate] = useState(
    itinerary?.start_date ? moment(itinerary.start_date) : null
  );
  const [endDate, setEndDate] = useState(
    itinerary?.end_date ? moment(itinerary.end_date) : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const router = useRouter();

  const [momentStartDate, setMomentStartDate] = useState(
    itinerary?.start_date ? moment(itinerary.start_date) : null
  );
  const [momentEndDate, setMomentEndDate] = useState(
    itinerary?.end_date ? moment(itinerary.end_date) : null
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const calculateDurationMoment = (startMoment, endMoment) => {
    if (!startMoment || !endMoment) return 0;
    return endMoment.diff(startMoment, "days");
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  const handleEditClick = () => {
    setStartDate(formatDateForInput(itinerary?.start_date));
    setEndDate(formatDateForInput(itinerary?.end_date));
    setMomentStartDate(
      itinerary?.start_date ? moment(itinerary.start_date) : null
    );
    setMomentEndDate(itinerary?.end_date ? moment(itinerary.end_date) : null);
    setShowCalendar(true);
    setIsEditing(true);
    setFocusedInput("startDate");
  };

  const handleCancel = () => {
    if(setShowEditDate){
      setShowEditDate(false);
      return;
    }
    setFocusedInput(null);
    setStartDate(itinerary?.start_date || "");
    setEndDate(itinerary?.end_date || "");
    setMomentStartDate(
      itinerary?.start_date ? moment(itinerary.start_date) : null
    );
    setMomentEndDate(itinerary?.end_date ? moment(itinerary.end_date) : null);
    setShowCalendar(false);
    setIsEditing(false);
    setFocusedInput(null);
  };

  const handleUpdateDates = async () => {
    if (
      !momentStartDate ||
      !momentEndDate ||
      !momentStartDate.isBefore(momentEndDate)
    ) {
      alert("Please select valid dates. End date must be after start date.");
      return;
    }

    setIsLoading(true);

    const payload = {
      start_date: momentStartDate.format("YYYY-MM-DD"),
      end_date: momentEndDate.format("YYYY-MM-DD"),
    };

    axiosUpdateItineraryDates
      .post(`${router.query.id}/update-dates/`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {
        setItinerary(res?.data?.data);
        setShowCalendar(false);
        setIsEditing(false); // Reset editing state
        setFocusedInput(null);
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

  return (
    <div className="mb-2">
      <div className="group flex flex-row gap-2 items-center py-[1rem] relative">
        <BsCalendar2 className="text-md text-[#7A7A7A]" />

        {/* Display mode - show dates with appropriate icon */}
        <div className="text-md font-medium text-black flex flex-row items-center justify-center gap-2">
          
            {!isEditing ? <div>
              {/* Show updated dates if editing, otherwise show original dates */}
              
                  {convertDFormat
                    ? convertDFormat(itinerary?.start_date)
                    : itinerary?.start_date}{" "}
                  -{" "}
                  {convertDFormat
                    ? convertDFormat(itinerary?.end_date)
                    : itinerary?.end_date}
            </div> :  <div>
              {/* Show updated dates if editing, otherwise show original dates */}
              
                  {convertDFormat
                    ? convertDFormat(startDate)
                    : itinerary?.start_date}{" "}
                  -{" "}
                  {convertDFormat
                    ? convertDFormat(endDate)
                    : itinerary?.end_date}
            </div> 
            }

          {/* Show pencil icon when not editing, cross icon when editing */}
          {!isEditing ? (
            <button
              onClick={handleEditClick}
              className="cursor-pointer w-4 h-4 text-gray-500 transition-transform duration-300 group-hover:text-blue-500 group-hover:scale-110 active:scale-90"
            >
              <FaPen
                size={16}
                className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500"
              />
            </button>
          ) : 
          // <button
          //     onClick={handleCancel}
          //     className="cursor-pointer w-4 h-4 text-gray-500 transition-transform duration-300 group-hover:text-blue-500 group-hover:scale-110 active:scale-90"
          //   >
          //     <FaX
          //       size={16}
          //       className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500"
          //     />
          //   </button>
          <>
          <div className="cursor-pointer text-blue underline" onClick={handleCancel}> Reset</div>
          </>
          }
        </div>

        {/* Calendar overlay - show when showCalendar is true */}
        {showCalendar && (
          <>
            <MobileOverlay onClick={() => setShowCalendar(false)} />

            <div className={`${isMobile ? "fixed" : "absolute top-full left-0 mt-2"} z-[1500]`}>
              <StyledDateRangeContainer $show={showCalendar}>
                <div className={`${isMobile ? "p-4" : "mb-4"}`}>
                  {/* Mobile header */}
                  {isMobile && (
                    <div className="flex items-center justify-between mb-4 pt-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        Select Dates
                      </h3>
                      <button
                        onClick={() => setShowCalendar(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaX size={16} /> 
                      </button>
                    </div>
                  )}



                  <DateRangePicker
                    displayFormat="DD MMM YYYY"
                    startDate={momentStartDate}
                    startDateId="startDate"
                    // startDatePlaceholderText="Select start date"
                    endDate={momentEndDate}
                    endDateId="endDate"
                    // endDatePlaceholderText="Select end date"
                    onDatesChange={({ startDate, endDate }) => {
                      setMomentStartDate(startDate);
                      setMomentEndDate(endDate);

                      // Update string dates for API
                      if (startDate) {
                        setStartDate(startDate.format("YYYY-MM-DD"));
                      }
                      if (endDate) {
                        setEndDate(endDate.format("YYYY-MM-DD"));
                      }

                      // Clear end date when selecting new start date
                      if (
                        startDate &&
                        momentEndDate &&
                        startDate.isAfter(momentEndDate)
                      ) {
                        setMomentEndDate(null);
                        setEndDate("");
                      }

                      // Hide calendar when both dates are selected
                      if (startDate && endDate) {
                        setShowCalendar(false);
                        setFocusedInput(null);
                      }
                    }}
                    focusedInput={focusedInput}
                    onFocusChange={(focusedInput) => {
                      setFocusedInput(focusedInput);
                    }}
                    isOutsideRange={(day) => day.isBefore(moment(), "day")}
                    numberOfMonths={isMobile ? 1 : 2}
                    orientation="horizontal"
                    noBorder={true}
                    readOnly={true}
                    keepOpenOnDateSelect={false}
                    reopenPickerOnClearDates={false}
                    hideKeyboardShortcutsPanel={true}
                    daySize={isMobile ? 40 : 39}
                  />
                </div>
              </StyledDateRangeContainer>
            </div>
          </>
        )}

        {/* Update button - show only when editing and dates are selected */}
        
      </div>
      {isEditing && !showCalendar && momentStartDate && momentEndDate && (
          <div className="mt-2 w-full ">
            <button
              onClick={handleUpdateDates}
              disabled={isLoading}
              className={`w-full px-6 py-2 bg-[#f8e000] text-black border-2 border-black rounded-lg font-medium transition-opacity ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#e6cc00]"
              }`}
            >
              {isLoading ? "Applying Changes..." : "Apply Date Change!"}
            </button>
          </div>
        )}
    </div>
  );
};

export default UpdateItineraryDates;