import React from "react";
import { ViewToggleProps } from "../types";
import { useSelector } from "react-redux";

/**
 * Tab visibility rules:
 *
 *  State                              | Map | Itinerary | Routes | Bookings
 *  -----------------------------------|-----|-----------|--------|----------
 *  No itinerary started               | ✓   | ✓         | ✗      | ✗
 *  Bot started building (Draft/PENDING| ✓   | ✓         | ✗      | ✗
 *  Itinerary complete (not Draft)     | ✓   | ✓         | ✓      | ✓
 *
 * "Building" = itinerary exists but status is "Draft" or undefined/null.
 * "Complete" = itinerary exists AND status is NOT "Draft" AND NOT nullish.
 */
const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => {
  const itinerary = useSelector((state: any) => state.Itinerary);

  // Is there any itinerary object at all with meaningful content?
  const hasItinerary = !!(itinerary && (itinerary.name || itinerary.cities?.length));

  // Is the itinerary fully built (not a draft/skeleton)?
  const isComplete =
    hasItinerary &&
    itinerary.status !== "Draft" &&
    itinerary.status !== undefined &&
    itinerary.status !== null &&
    itinerary.status !== "undefined";

  // Shared button style helper
  const activeStyle: React.CSSProperties = {
    borderRadius: "10px",
    border: "1px solid #FFFACD",
    background: "#07213A",
    boxShadow: "0 2px 8px rgba(195, 195, 195, 0.35)",
  };
  const inactiveStyle: React.CSSProperties = { borderRadius: "10px" };

  const tabBtn = (
    label: string,
    mode: string,
    onClick: () => void,
  ) => (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
        viewMode === mode ? "text-white" : "text-black"
      }`}
      style={viewMode === mode ? activeStyle : inactiveStyle}
    >
      {label}
    </button>
  );

  return (
    <div className="px-4 py-3 flex-shrink-0 text-sm md:text-[14px]">
      <div
        className="flex gap-1"
        style={{
          borderRadius: "10px",
          border: "1px solid #E5E5E5",
          background: "#fff",
        }}
      >
        {/* Map — always visible */}
        <button
          onClick={() => setViewMode("map")}
          className={`flex-1 px-4 py-2.5 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            viewMode === "map" ? "text-white" : "text-black"
          }`}
          style={viewMode === "map" ? activeStyle : inactiveStyle}
        >
          Map
        </button>

        {/* Routes — only when itinerary is fully complete (not draft/building) */}
        {isComplete &&
          tabBtn("Routes", "routes", () => setViewMode("routes"))}

        {/* Itinerary — always visible */}
        {tabBtn("Itinerary", "itinerary", () => setViewMode("itinerary"))}

        {/* Bookings — only when itinerary is fully complete */}
        {isComplete &&
          tabBtn("Bookings", "bookings", () => setViewMode("bookings"))}
      </div>
    </div>
  );
};

export default ViewToggle;