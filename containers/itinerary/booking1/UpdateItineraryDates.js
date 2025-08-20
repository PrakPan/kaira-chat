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
import { openNotification } from "../../../store/actions/notification";
import { useDispatch } from "react-redux";
import AirbnbCalendar from "../../../components/calendar";
import Modal from "../../../components/ui/Modal";
import ModalWithBackdrop from "../../../components/ui/ModalWithBackdrop";

const StyledDateRangeContainer = styled.div`
  .DateRangePicker {
    width: 100%;
  }

  .DatePicker_transitionContainer {
    height: 296px;
  }

  .DateRangePickerInput {
    border: none;
    display: flex;
    gap: 16px;
    background: initial;
    width: 100%;
    margin-left: -0.25rem;
    height: 0;
    overflow: hidden;
  }

  .DateInput {
    display: none !important;
  }

  .DateInput > input {
    display: none !important;
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
  
  .DayPickerNavigation_button {
    border: 2px solid #000000 !important;
    border-radius: 50% !important;
    background: #ffffff !important;
    width: 24px !important;
    height: 24px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s ease !important;
    color:black;
  }

  .DayPickerNavigation_button:hover {
    background: #f3f4f6 !important;
    transform: scale(1.05) !important;
  }

  .DayPickerNavigation_button:active {
    transform: scale(0.95) !important;
  }

  .DayPickerNavigation_button svg,
  .DayPickerNavigation_button .DayPickerNavigation_svg,
  .DayPickerNavigation_svg {
    display: none !important;
  }

   .DayPickerNavigation_button:first-child::after {
    content: "<";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    font-weight: bold;
    color: #000000;
    line-height: 1;
  }

  .DayPickerNavigation_button:last-child::after {
    content: ">";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    font-weight: bold;
    color: #000000;
    line-height: 1;
  }

  .DayPickerNavigation_button[aria-label*="previous"]::after,
  .DayPickerNavigation_button[aria-label*="Previous"]::after {
    content: "<";
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .DayPickerNavigation_button[aria-label*="next"]::after,
  .DayPickerNavigation_button[aria-label*="Next"]::after {
    content: ">";
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
    
  .DayPicker_caption {
    text-align: center !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .CalendarMonth_caption {
    text-align: center !important;
    padding-top: 16px !important;
    margin: 0 !important;
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
      border-radius: 50%;
    }
  }

  /* Custom single input display */
  .single-date-input {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #f9fafb;
    padding: 12px;
    cursor: pointer;
    font-family: inherit;
    font-weight: 400;
    font-size: 0.875rem;
    color: #374151;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .single-date-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
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
    display: hidden;
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
  setShowEditDate,
  showEditDate
}) => {

  const dispatch = useDispatch();
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

  const formatDateRangeDisplay = () => {
    const start = isEditing ? momentStartDate : (itinerary?.start_date ? moment(itinerary.start_date) : null);
    const end = isEditing ? momentEndDate : (itinerary?.end_date ? moment(itinerary.end_date) : null);

    if (!start || !end) return "Select dates";

    if (convertDFormat) {
      return `${convertDFormat(start.format('YYYY-MM-DD'))} - ${convertDFormat(end.format('YYYY-MM-DD'))}`;
    }

    return `${start.format('YYYY-MM-DD')} - ${end.format('YYYY-MM-DD')}`;
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

  const handleSingleInputClick = () => {
    setShowCalendar(true);
    setFocusedInput("startDate");
  };

  const handleCancel = () => {
    if (setShowEditDate) {
      setShowEditDate(true);
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

  const handleOnCalenderApplyDates = (values) => {
    handleUpdateDates(values);
  }

  const handleUpdateDates = async (dateObj) => {
    if (
      !dateObj.start ||
      !dateObj.end
    ) {
      alert("Please select valid dates. End date must be after start date.");
      return;
    }
    setIsLoading(true);
    const payload = {
      start_date: moment(dateObj.start).format("YYYY-MM-DD"),
      end_date: moment(dateObj.end).format("YYYY-MM-DD"),
    };

    console.log(payload);

    axiosUpdateItineraryDates
      .post(`${router.query.id}/update-dates/`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {
        setItinerary(res?.data?.data);
        setShowCalendar(false);
        setIsEditing(false);
        setFocusedInput(null);
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        let errorMsg = error.response.data?.errors?.[0]?.detail?.[0] || "There seems to be a problem, please try again!";
        console.log("ERROR:UPDATING ITINERARY DATES", error.message);
        dispatch(openNotification({
          type: "error",
          text: errorMsg,
          heading: "Error!",
        }));
      });
  };

  const closeModal = () => {
    setShowCalendar(false);
    setIsEditing(false);
  }

  return (
    <div className="">
      {/* Date display with pen icon */}
      <div className="font-400 text-black flex flex-row items-center gap-2">
        {!isEditing ? (
          <div className="min-w-max ">
            {convertDFormat
              ? convertDFormat(itinerary?.start_date)
              : itinerary?.start_date}{" "}
            -{" "}
            {convertDFormat
              ? convertDFormat(itinerary?.end_date)
              : itinerary?.end_date}
          </div>
        ) : (
          <div className="min-w-max">
            {formatDateRangeDisplay()}
          </div>
        )}

        {/* Show pencil icon when not editing, reset button when editing */}
        {!isMobile ? !isEditing ? (
          <button
            onClick={handleEditClick}
            className="cursor-pointer w-4 h-4 text-gray-500 transition-transform duration-300 hover:text-blue-500 hover:scale-110 active:scale-90"
          >
            <FaPen
              size={16}
              className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500"
            />
          </button>
        ) : (
          <div className="cursor-pointer text-blue underline text-sm" onClick={handleCancel}>
            Reset
          </div>
        ) : ''}
      </div>

      {/* Update button - show only when editing and dates are selected */}
      {isEditing && !showCalendar && momentStartDate && momentEndDate && (
        <button
          onClick={handleUpdateDates}
          disabled={isLoading}
          className={`px-4 py-2 bg-[#f8e000] text-black border-2 border-black rounded-lg font-medium text-sm transition-opacity whitespace-nowrap ${isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-[#e6cc00]"
            }`}
        >
          {isLoading ? "Applying..." : "Apply Date Change!"}
        </button>
      )}

      {/* Calendar overlay - positioned absolutely but relative to this container */}
      {showCalendar && (

        <ModalWithBackdrop
          centered
          closeIcon={true}
          backdrop
          show={showCalendar}
          onHide={() => closeModal(false)}
          borderRadius="20px"
        >
          <AirbnbCalendar
            valueStart={itinerary?.start_date}
            valueEnd={itinerary?.end_date}
            onChangeDate={handleOnCalenderApplyDates}
            setShowCalendar={() => closeModal(false)}
          />
        </ModalWithBackdrop>
        // <>
        //   <MobileOverlay onClick={() => setShowCalendar(false)} />

        //   <div className={`${isMobile ? "hidden fixed" : "absolute"} z-[8]`}>
        //     <StyledDateRangeContainer $show={showCalendar}>
        //       <div className={`${isMobile ? "p-4" : "mb-1"}`}>
        //         {/* Mobile header */}
        //         {isMobile && (
        //           <div className="flex items-center justify-between mb-1 pt-2">
        //             <button
        //               onClick={() => setShowCalendar(false)}
        //               className="text-gray-500 hover:text-gray-700"
        //             >
        //               <FaX size={16} /> 
        //             </button>
        //           </div>
        //         )}

        //         <DateRangePicker
        //           displayFormat="DD MMM YYYY"
        //           startDate={momentStartDate}
        //           startDateId="startDate"
        //           endDate={momentEndDate}
        //           endDateId="endDate"
        //           onDatesChange={({ startDate, endDate }) => {
        //             setMomentStartDate(startDate);
        //             setMomentEndDate(endDate);

        //             // Update string dates for API
        //             if (startDate) {
        //               setStartDate(startDate.format("YYYY-MM-DD"));
        //             }
        //             if (endDate) {
        //               setEndDate(endDate.format("YYYY-MM-DD"));
        //             }

        //             // Clear end date when selecting new start date
        //             if (
        //               startDate &&
        //               momentEndDate &&
        //               startDate.isAfter(momentEndDate)
        //             ) {
        //               setMomentEndDate(null);
        //               setEndDate("");
        //             }

        //             // Hide calendar when both dates are selected
        //             if (startDate && endDate) {
        //               setShowCalendar(false);
        //               setFocusedInput(null);
        //             }
        //           }}
        //           focusedInput={focusedInput}
        //           onFocusChange={(focusedInput) => {
        //             setFocusedInput(focusedInput);
        //           }}
        //           isOutsideRange={(day) => day.isBefore(moment(), "day")}
        //           numberOfMonths={isMobile ? 1 : 2}
        //           orientation="horizontal"
        //           noBorder={true}
        //           readOnly={true}
        //           keepOpenOnDateSelect={false}
        //           reopenPickerOnClearDates={false}
        //           hideKeyboardShortcutsPanel={true}
        //           daySize={isMobile ? 40 : 39}

        //         />
        //       </div>
        //     </StyledDateRangeContainer>
        //   </div>
        // </>
      )}
    </div>
  );
};

export default UpdateItineraryDates;