import UpdateItineraryDates from "./UpdateItineraryDates";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { FaPen } from "react-icons/fa";
import { BsCalendar2 } from "react-icons/bs";

const DateComponentWithEdit = ({ 
  props, 
  convertDFormat, 
  fetchItineraryStatus,
  showEditFeature = false 
}) => {
  const [showEditDate, setShowEditDate] = useState(false);

  return (
    <div className="group flex flex-row gap-3 items-center py-[1rem] relative">
      <BsCalendar2 className="text-md text-[#7A7A7A]" />
      <div className="text-md font-medium text-black flex flex-row items-center gap-2">
        {props.tripsPage ? (
          <div>{props?.itinerary?.duration + " Nights"}</div>
        ) : (
          <div>
            {convertDFormat(props?.itinerary?.start_date ? props?.itinerary?.start_date : null)}{" "}
            -{" "}
            {convertDFormat(props?.itinerary?.end_date ? props?.itinerary?.end_date : null)}
          </div>
        )}

        {showEditFeature && !showEditDate && (
          <div className="cursor-pointer w-4 h-4 text-gray-500 transition-transform duration-300 group-hover:text-blue-500 group-hover:scale-110 active:scale-90 opacity-0 group-hover:opacity-100">
            <FaPen
              size={16}
              className="transition-transform hover:scale-150 duration-300 hover:text-yellow-500"
              onClick={() => setShowEditDate(true)}
            />
          </div>
        )}
      </div>

      {showEditFeature && showEditDate && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
          <UpdateItineraryDates
            itinerary={props?.itinerary}
            token={props.token}
            onUpdateSuccess={fetchItineraryStatus}
            convertDFormat={convertDFormat}
            tripsPage={props.tripsPage}
            setShowEditDate={setShowEditDate}
            showEditDate={showEditDate}
            showAsModal={false}
            autoOpenCalendar={true}
          />
        </div>
      )}
    </div>
  );
};


export default DateComponentWithEdit;