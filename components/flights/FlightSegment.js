import React from "react";
import {Logo} from "../modals/flights/new-flight-searched/LogoContainer"
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
      <div className="w-full max-w-full p-3 bg-[#FAFBFC] text-[rgba(0,0,0,0.85)] text-sm leading-[21px] rounded-md">
        {segments.map((segment, i) => (
          <div key={i}>
            {i !== 0 && (
              <div className="text-center my-[25px]">
                <div className="text-[#4a4a4a] bg-[#f4f4f4] inline-block relative text-xs rounded px-2.5 py-1.5">
                  <span className="text-[#4a4a4a] bg-[#dfdfdf] block absolute text-xs left-[-50px] md:left-[-100px] h-[1px] w-[50px] md:w-[100px] md:top-[13.7px] top-[50%]"></span>
  
                  <div className="flex flex-col md:flex-row gap-2">
                    <b className="font-black">Change of planes</b>
                    <b>
                      {getTime(segment?.ground_time)}
                      {" Layover in "}
                      {segment?.origin?.city_name}
                    </b>
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
                  <span className="text-[#6d7278]">
                    {segment?.airline?.code}-{segment?.airline?.flight_number}
                  </span>
                </span>
              </div>
  
              <div className="flex flex-col md:flex-row gap-5">
                <div className="md:w-[50%] flex flex-row gap-3 justify-between">
                  <div className="flex-1">
                    <p className="text-black text-lg font-bold m-0">
                      {new Date(segment?.origin?.departure_time)
                        .getHours()
                        .toString()
                        .padStart(2, "0")}
                      :
                      {new Date(segment?.origin?.departure_time)
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}
                    </p>
  
                    <p className="text-black text-xs font-bold mb-2">
                      {new Date(segment?.origin?.departure_time).toDateString()}
                    </p>
  
                    <p className="text-xs m-0">
                      {segment?.origin?.city_name} (
                      {segment?.origin?.airport_code})
                    </p>
  
                    {segment?.origin?.terminal ? (
                      <p className="text-xs">
                        Terminal: {segment.origin.terminal}
                      </p>
                    ) : null}
                  </div>
  
                  <div className="flex-1 text-xs text-center">
                    <div className="text-sm text-gray-600">
                      {getTime(segment?.duration)}
                    </div>
                    <div className="relative h-4">
                      <p className="h-[3px] absolute left-0 right-0 top-0.5 bottom-0 z-[1] border-t-[3px] border-[#F7E700]"></p>
                    </div>
                  </div>
  
                  <div className="flex-1">
                    <p className="text-black text-lg font-bold m-0">
                      {new Date(segment?.destination?.arrival_time)
                        .getHours()
                        .toString()
                        .padStart(2, "0")}
                      :
                      {new Date(segment?.destination?.arrival_time)
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}
                    </p>
                    <p className="text-black text-xs font-bold mb-2">
                      {new Date(
                        segment?.destination?.arrival_time
                      ).toDateString()}
                    </p>
                    <p className="text-xs m-0">
                      {segment?.destination?.city_name} (
                      {segment?.destination?.airport_code})
                    </p>
                    {segment?.destination?.terminal ? (
                      <p className="text-xs">
                        Terminal: {segment.destination.terminal}
                      </p>
                    ) : null}
                  </div>
                </div>
  
                <div className="md:w-[50%] flex flex-row items-start justify-between text-xs">
                  <p className="flex flex-col gap-2">
                    <span className="text-sm font-bold text-left pr-2.5">
                      CHECK IN BAGGAGE
                    </span>
                    <span className="text-[#4a4a4a] text-left pr-2.5">
                      {segment?.baggage_allowance}
                    </span>
                  </p>
  
                  <p className="flex flex-col gap-2">
                    <span className="text-sm font-bold text-left pr-2.5">
                      CABIN BAGGAGE
                    </span>
                    <span className="text-[#4a4a4a] text-left pr-2.5">
                      {segment?.cabin_baggage_allowance}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };