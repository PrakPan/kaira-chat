import React from "react";
import { ViewToggleProps } from "../types";

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => {
  return (
    <div className="px-4 py-3 flex-shrink-0">
      <div
        className="flex gap-1 p-1"
        style={{
          borderRadius: "18px",
          border: "1px solid #FFFACD",
          background: "#FFFAF5",
          // boxShadow: "0 4px 34px 1px rgba(195, 195, 195, 0.25)",
        }}
      >
        <button
          onClick={() => setViewMode("map")}
          className={`flex-1 px-4 py-1 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            viewMode === "map"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
          style={
            viewMode === "map"
              ? {
                  borderRadius: "10px",
                  border: "1px solid #FFFACD",
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(195, 195, 195, 0.35)",
                }
              : { borderRadius: "10px" }
          }
        >
          {/* <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg> */}
          Map
        </button>
        <button
          onClick={() => setViewMode("itinerary")}
          className={`flex-1 px-4 py-1 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            viewMode === "itinerary"
              ? "text-black"
              : "text-gray-500 hover:text-gray-700"
          }`}
          style={
            viewMode === "itinerary"
              ? {
                  borderRadius: "10px",
                  border: "1px solid #FFFACD",
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(195, 195, 195, 0.35)",
                }
              : { borderRadius: "10px" }
          }
        >
          {/* <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg> */}
          Itinerary
        </button>
      </div>
    </div>
  );
};

export default ViewToggle;