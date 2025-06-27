import React from "react";
import { PulseLoader } from "react-spinners";
import styled from "styled-components";
import Pin from "../../../containers/newitinerary/breif/route/Pin";
import BackArrow from "../../ui/BackArrow";

const BackText = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;

const VehicleDetailLoader = ({ setHandleShow }) => {
  return (
    <div className=" bg-gray-50 w-full h-full flex flex-col overflow-hidden">
      {/* Header */}

      {/* Vehicle Info */}
      <div className="flex items-center px-4 py-3 bg-white">
        <div className="bg-blue-100 rounded-lg p-2 mr-3 flex-shrink-0">
          <div className="w-16 h-10 sm:w-20 sm:h-12 bg-gray-300 opacity-50 rounded-lg"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="w-full max-w-32 h-5 bg-gray-300 opacity-50 rounded"></div>
        </div>
      </div>

      {/* Title */}
      <div className="px-4 pt-2 pb-2 bg-white ">
        <div className="w-24 h-5 bg-gray-300 opacity-50 rounded"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm relative border border-gray-100 min-h-0">
          {/* Route Info */}
          <div className="flex justify-between items-start gap-2">
            {/* Source */}
            <div className="flex flex-col items-start flex-1 min-w-0">
              <Pin pinColour="green" index={0} length={0} />
              <div className="mt-2 w-full">
                <div className="w-full max-w-28 h-4 bg-gray-300 opacity-50 rounded mb-1"></div>
                <div className="w-full max-w-20 h-3 bg-gray-300 opacity-50 rounded mb-1"></div>
                <div className="w-full max-w-24 h-3 bg-gray-300 opacity-50 rounded"></div>
              </div>
            </div>

            {/* Distance - Responsive */}
            <div className="flex flex-col items-center flex-shrink-0 px-2">
              <div className="w-12 h-3 bg-gray-300 opacity-50 rounded mb-2"></div>
              <div className="border-t border-dashed w-16 sm:w-32 md:w-64"></div>
            </div>

            {/* Destination */}
            <div className="flex flex-col items-end flex-1 min-w-0">
              <Pin pinColour="red" index={0} length={0} />
              <div className="mt-2 text-right w-full">
                <div className="w-full max-w-28 h-4 bg-gray-300 opacity-50 rounded mb-1 ml-auto"></div>
                <div className="w-full max-w-20 h-3 bg-gray-300 opacity-50 rounded mb-1 ml-auto"></div>
                <div className="w-full max-w-24 h-3 bg-gray-300 opacity-50 rounded ml-auto"></div>
              </div>
            </div>
          </div>

          {/* Transfer Details */}
          <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-200">
            <div className="w-24 h-4 bg-gray-300 opacity-50 rounded mb-4"></div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0 mb-4">
              <div className="flex-1">
                <div className="w-full max-w-32 h-4 bg-gray-300 opacity-50 rounded mb-1"></div>
                <div className="w-full max-w-24 h-3 bg-gray-300 opacity-50 rounded"></div>
              </div>
              <div className="text-left sm:text-right flex-shrink-0">
                <div className="w-20 h-4 bg-gray-300 opacity-50 rounded mb-1"></div>
                <div className="w-16 h-3 bg-gray-300 opacity-50 rounded"></div>
              </div>
            </div>

            <div>
              <div className="w-20 h-4 bg-gray-300 opacity-50 rounded mb-1"></div>
              <div className="w-24 h-3 bg-gray-300 opacity-50 rounded"></div>
            </div>
          </div>

          {/* Profile Icon */}
          <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow">
            <div className="w-4 h-4 bg-gray-300 opacity-50 rounded"></div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="flex justify-center items-center py-4 bg-white border-t border-gray-200">
        <PulseLoader color="#3B82F6" size={8} />
      </div>
    </div>
  );
};

export default VehicleDetailLoader;