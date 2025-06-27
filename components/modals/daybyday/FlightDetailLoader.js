import React from "react";
import styled from "styled-components";
import BackArrow from "../../ui/BackArrow";

const Text = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;

const FlightDetailLoader = ({ setShowDetails }) => {
  return (
    <div className="relative flex flex-col gap-4 rounded-md px-3 py-2 animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <BackArrow handleClick={() => setShowDetails((prev) => !prev)} />
          <div className="w-32 h-6 bg-gray-300 rounded" />
        </div>
      </div>

      <Text>
        <div className="w-48 h-6 bg-gray-300 rounded mt-2" />
      </Text>

      {/* FlightSegment Placeholder */}
      <div className="flex flex-col gap-4 p-2">
        {[1, 2].map((_, idx) => (
          <div key={idx} className="border p-3 rounded-lg bg-white shadow-sm">
            <div className="flex justify-between mb-2">
              <div className="w-20 h-4 bg-gray-300 rounded" />
              <div className="w-24 h-4 bg-gray-300 rounded" />
            </div>
            <div className="flex justify-between items-center">
              <div className="w-16 h-3 bg-gray-300 rounded" />
              <div className="w-32 h-3 bg-gray-300 rounded" />
              <div className="w-16 h-3 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Fare Rules Heading */}
      <div className="flex flex-col mt-4">
        <div className="w-48 h-5 bg-gray-300 rounded mb-2" />
        {/* Rules lines */}
        <div className="flex flex-col gap-2 ml-4">
          <div className="w-72 h-3 bg-gray-300 rounded" />
          <div className="w-64 h-3 bg-gray-300 rounded" />
          <div className="w-80 h-3 bg-gray-300 rounded" />
          <div className="w-60 h-3 bg-gray-300 rounded" />
        </div>
      </div>

      {/* Delete Button Placeholder */}
      <div className="p-4 bg-white">
        <div className="w-full bg-red-300 rounded-lg py-3 flex items-center justify-center text-white">
          <div className="w-6 h-6 bg-white bg-opacity-30 rounded-full mr-2" />
          <div className="w-32 h-4 bg-white bg-opacity-30 rounded" />
        </div>
      </div>
    </div>
  );
};

export default FlightDetailLoader;
