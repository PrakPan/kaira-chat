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
    <div className="fixed inset-0 bg-gray-50 w-full h-full flex flex-col">
      <div className="p-4 flex items-center">
        <BackArrow handleClick={() => setHandleShow(false)} />
      </div>

      <div className="flex items-center px-4">
        <div className="bg-blue-100 rounded-lg p-2 mr-3">
          <div className="w-20 h-12 bg-gray-300 opacity-50 rounded-lg"></div>
        </div>
        <span className="text-xl font-semibold text-gray-800">
          <div className="w-32 h-5 bg-gray-300 opacity-50 rounded"></div>
        </span>
      </div>

      <div className="px-4 pt-2 pb-2">
        <h2 className="text-lg font-medium">
          <div className="w-24 h-5 bg-gray-300 opacity-50 rounded"></div>
        </h2>
      </div>

      <div className="flex-1 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm relative border border-gray-100">
          {/* Route Info */}
          <div className="flex justify-between">
            {/* Source */}
            <div className="flex flex-col items-start">
              <Pin pinColour="green" index={0} length={0} />
              <div className="mt-2">
                <div className="w-32 h-4 bg-gray-300 opacity-50 rounded mb-1"></div>
                <div className="w-20 h-3 bg-gray-300 opacity-50 rounded mb-1"></div>
                <div className="w-24 h-3 bg-gray-300 opacity-50 rounded"></div>
              </div>
            </div>

            {/* Distance */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-3 bg-gray-300 opacity-50 rounded mb-2"></div>
              <div className="border-t border-dashed w-64"></div>
            </div>

            {/* Destination */}
            <div className="flex flex-col items-end">
              <Pin pinColour="red" index={0} length={0} />
              <div className="mt-2 text-right">
                <div className="w-32 h-4 bg-gray-300 opacity-50 rounded mb-1"></div>
                <div className="w-20 h-3 bg-gray-300 opacity-50 rounded mb-1"></div>
                <div className="w-24 h-3 bg-gray-300 opacity-50 rounded"></div>
              </div>
            </div>
          </div>

          {/* Transfer Details */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="w-24 h-4 bg-gray-300 opacity-50 rounded mb-4"></div>

            <div className="flex justify-between mb-4">
              <div>
                <div className="w-32 h-4 bg-gray-300 opacity-50 rounded mb-1"></div>
                <div className="w-24 h-3 bg-gray-300 opacity-50 rounded"></div>
              </div>
              <div className="text-right">
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
          <div className="absolute bottom-6 right-6 bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow">
            <div className="w-4 h-4 bg-gray-300 opacity-50 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailLoader;
