import React from "react";
import { UserLocation } from "../types";


interface MapLegendProps {
  userLocation: UserLocation;
  locationCount: number;
}

const MapLegend: React.FC<MapLegendProps> = ({ userLocation, locationCount }) => {
  return (
    <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-lg p-4 text-sm border border-gray-200">
      <div className="font-semibold text-gray-700 mb-3">Map Legend</div>
      
      <div className="flex items-center gap-3 mb-2">
        <svg width="20" height="25" viewBox="0 0 20 25">
          <path
            d="M10 0C6.134 0 3 3.134 3 7c0 5.25 7 15 7 15s7-9.75 7-15c0-3.866-3.134-7-7-7z"
            fill="#4285F4"
          />
          <circle cx="10" cy="7" r="3" fill="white" />
        </svg>
        <span className="text-gray-700">Your Location</span>
      </div>
      
      <div className="flex items-center gap-3">
        <svg width="18" height="23" viewBox="0 0 18 23">
          <path
            d="M9 0C5.634 0 3 2.634 3 6c0 4.5 6 13 6 13s6-8.5 6-13c0-3.366-2.634-6-6-6z"
            fill="#EA4335"
          />
          <circle cx="9" cy="6" r="2.5" fill="white" />
        </svg>
        <span className="text-gray-700">Search Results</span>
      </div>
      
      {locationCount > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
          {locationCount} location{locationCount !== 1 ? "s" : ""} found
        </div>
      )}
    </div>
  );
};

export default MapLegend;