import React from "react";
import { ViewToggleProps } from "../types";
import { useSelector } from "react-redux";

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => {
  const itinerary = useSelector(state=> state.Itinerary);
  return (
    <div className="px-4 py-3 flex-shrink-0 text-sm md:text-[14px]">
      <div
        className="flex gap-1"
        style={{
          borderRadius: "10px",
          border: "1px solid #E5E5E5",
          background: "#fff",
          // boxShadow: "0 4px 34px 1px rgba(195, 195, 195, 0.25)",
        }}
      >
        <button
          onClick={() => setViewMode("map")}
          className={`flex-1 px-4 py-2.5 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            viewMode === "map"
              ? "text-white"
              : "text-black"
          }`}
          style={
            viewMode === "map"
              ? {
                  borderRadius: "10px",
                  border: "1px solid #FFFACD",
                  background: "#07213A",
                  boxShadow: "0 2px 8px rgba(195, 195, 195, 0.35)",
                }
              : { borderRadius: "10px" }
          }
        >
          Map
        </button>

         {!(itinerary?.status == "Draft") &&  <button
          onClick={() => setViewMode("routes")}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            viewMode === "routes"
              ? "text-white"
              : "text-black"
          }`}
          style={
            viewMode === "routes"
              ? {
                  borderRadius: "10px",
                  border: "1px solid #FFFACD",
                  background: "#07213A",
                  boxShadow: "0 2px 8px rgba(195, 195, 195, 0.35)",
                }
              : { borderRadius: "10px" }
          }
        >

          Routes
        </button>}
        
        <button
          onClick={() => setViewMode("itinerary")}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            viewMode === "itinerary"
              ? "text-white"
              : "text-black"
          }`}
          style={
            viewMode === "itinerary"
              ? {
                  borderRadius: "10px",
                  border: "1px solid #FFFACD",
                  background: "#07213A",
                  boxShadow: "0 2px 8px rgba(195, 195, 195, 0.35)",
                }
              : { borderRadius: "10px" }
          }
        >

          Itinerary
        </button>

       

        { !(itinerary?.status == "Draft") && <>
        {/* <button
          onClick={() => setViewMode("routes")}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            viewMode === "routes"
              ? "text-white"
              : "text-black"
          }`}
          style={
            viewMode === "routes"
              ? {
                  borderRadius: "10px",
                  border: "1px solid #FFFACD",
                  background: "#07213A",
                  boxShadow: "0 2px 8px rgba(195, 195, 195, 0.35)",
                }
              : { borderRadius: "10px" }
          }
        >

          Routes
        </button> */}
        <button
          onClick={() => setViewMode("bookings")}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            viewMode === "bookings"
              ? "text-white"
              : "text-black"
          }`}
          style={
            viewMode === "bookings"
              ? {
                  borderRadius: "10px",
                  border: "1px solid #FFFACD",
                  background: "#07213A",
                  boxShadow: "0 2px 8px rgba(195, 195, 195, 0.35)",
                }
              : { borderRadius: "10px" }
          }
        >

          Bookings
        </button> </>}
      </div>
    </div>
  );
};

export default ViewToggle;