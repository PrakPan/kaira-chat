import styled from "styled-components";
import { FaPlane } from "react-icons/fa";
import { useState } from "react";
import moment from 'moment';
import { PiAirplaneLanding, PiAirplaneTakeoff } from "react-icons/pi";

const DottedLine = styled.div`
  position: relative;
  height: 3px;
  width: 100%;
  background-image: repeating-linear-gradient(
    to right,
    #d1d5db 0,
    #d1d5db 6px,     
    transparent 4px,
    transparent 12px 
  );
`;

const Circle = styled.div`
  border: 2px solid #9ca3af;
  height: 8px;
  width: 8px;
  border-radius: 100%;
  background: white;
  position: absolute;
  z-index: 2;
  top: 50%;
  transform: translateY(-50%);
`;

const PlaneIconWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: black;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
`;

export default function FlightDetails({
  segments,
  data,
  origin,
  destination,
  duration,
  isNonStop,
  numStops,
  handleRoute,
  booking,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const popupStyle = {
    display: isHovered ? "block" : "none",
    backgroundColor: "white",
    border: "1px solid white",
    borderRadius: "0.5rem",
    padding: "12px 16px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    marginTop: "8px",
    minWidth: "280px",
  };

  function getTime(totalMinutes) {
    if (totalMinutes) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours ? hours + "h" : ""} ${minutes ? minutes + "m" : ""}`;
    }
    return totalMinutes;
  }

  function getDayOffset(checkIn, checkOut) {
    const inDate = moment(checkIn, "YYYY-MM-DD HH:mm:ss");
    const outDate = moment(checkOut, "YYYY-MM-DD HH:mm:ss");

    const inDay = inDate.format("YYYY-MM-DD");
    const outDay = outDate.format("YYYY-MM-DD");

    if (inDay !== outDay) {
      const diff = outDate.startOf('day').diff(inDate.startOf('day'), 'days');
      return `+${diff} D`;
    }
    return null;
  }

  return (
    <div className="w-full md:w-[75%] flex flex-col gap-2.5">
      {/* Row 1: Dates and Duration */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          {new Date(origin?.departure_time).toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          })}
        </span>
        <span className="text-center">
          {duration || getTime(data?.segments?.[0]?.duration)}
        </span>

        <span className="flex items-start gap-1">
          {new Date(destination?.arrival_time).toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          })}
          {getDayOffset(
            booking?.check_in || segments?.[0]?.origin?.departure_time,
            booking?.check_out || segments?.[segments?.length - 1]?.destination?.arrival_time
          ) && (
            <span className="text-[10px] text-red-600 font-bold">
              {getDayOffset(
                booking?.check_in || segments?.[0]?.origin?.departure_time,
                booking?.check_out || segments?.[segments?.length - 1]?.destination?.arrival_time
              )}
            </span>
          )}
        </span>
      </div>

      {/* Row 2: Times and Flight Path */}
      <div className="flex justify-center items-center">
        {/* Departure Time */}
        <div className="text-md font-medium text-gray-900">
          {origin?.departure_time
            ? new Date(origin?.departure_time).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })
            : ""}
        </div>

        {/* Flight Path Line */}
        <div className="flex-1 mx-2 flex items-center">
          <div className="relative w-full h-2 flex items-center">
            {/* <Circle style={{ left: 0 }} /> */}
            <DottedLine />
            {/* <Circle style={{ right: 0 }} /> */}
            <PlaneIconWrapper>
              <FaPlane className="text-white text-[10px]" style={{ transform: 'rotate(0deg)' }} />
            </PlaneIconWrapper>
          </div>
        </div>

        {/* Arrival Time */}
        <div className="text-md font-medium text-gray-900 flex items-start gap-1">
          <span>
            {destination?.arrival_time
              ? new Date(destination?.arrival_time).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })
              : ""}
          </span>
          
        </div>
      </div>

      {/* Row 3: Cities with Icons and Stops Info */}
      <div className="flex justify-between items-center text-sm text-gray-700">
        <div className="flex items-center gap-1.5">
          {/* <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-600 flex-shrink-0">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/>
          </svg> */}
          <PiAirplaneTakeoff className="text-gray-600 flex-shrink-0" size={16} />
          <span>{origin?.city_name} <span className="text-gray-500">({origin?.airport_code || origin?.city_code})</span></span>
        </div>

        {/* Stops Info - Centered */}
        <div className="flex-1 flex justify-center">
          {isNonStop || numStops == 0 ? (
            <div className="text-xs text-gray-500">Non-Stop</div>
          ) : (
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => {
                handleRoute?.(booking);
                setIsHovered(false);
              }}
              className="relative cursor-pointer"
            >
              <div className="text-xs text-blue-600 hover:text-blue-700 text-center">
                {segments?.length - 1} stop{segments?.length - 1 !== 1 && "s"} via{" "}
                {segments?.map((segment, i) =>
                  i !== 0 ? (
                    <span key={i}>
                      {i !== 1 ? ", " : ""}
                      {segment?.origin?.city_name}
                    </span>
                  ) : null
                )}
              </div>

              <div
                style={popupStyle}
                className="z-50 absolute top-full left-1/2 -translate-x-1/2 text-sm flex flex-col gap-3 mt-2"
              >
                {data?.segments.map((segment, index) => {
                  if (index == 0) return null;
                  return (
                    <div key={index} className="relative">
                      {index === 1 && (
                        <span className="absolute -top-[14px] left-1/2 -translate-x-1/2 w-0 h-0 border-[6px] border-solid border-transparent border-b-white"></span>
                      )}
                      <div className="text-black text-xs mb-1 font-medium">
                        Plane change: {segment?.airline.name}, {segment?.airline?.code}-{segment?.airline?.flight_number}
                      </div>
                      <div className="text-black text-xs">
                        Via {segment?.origin?.city_name} ({segment.origin?.airport_code}) • {getTime(segment?.ground_time)} layover
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-right">
           <PiAirplaneLanding className="text-gray-600 flex-shrink-0" size={16} />
          <span>{destination?.city_name} <span className="text-gray-500">({destination?.airport_code || destination?.city_code})</span></span>
          {/* <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-600 flex-shrink-0">
            <path d="M2.5 19h19v2h-19v-2zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 2.59 4.49c.21.36.62.58 1.06.58.16 0 .32-.03.47-.09L23.5 11c.81-.23 1.28-1.05 1.07-1.86z" fill="currentColor"/>
          </svg> */}
         
        </div>
      </div>
    </div>
  );
}