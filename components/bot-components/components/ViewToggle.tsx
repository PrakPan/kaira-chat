import React from "react";
import { ViewToggleProps } from "../types";
import { useSelector } from "react-redux";
import { FiMap, FiNavigation, FiCalendar, FiBookmark } from "react-icons/fi";

/**
 * Tab visibility rules:
 *
 *  State                              | Map | Itinerary | Routes | Bookings
 *  -----------------------------------|-----|-----------|--------|----------
 *  No itinerary activity              | ✓   | ✗         | ✗      | ✗
 *  Bot started building (shimmer/draft| ✓   | ✓         | ✗      | ✗
 *  Itinerary complete (not Draft)     | ✓   | ✓         | ✓      | ✓
 *
 * hasItineraryActivity — passed from BotApp, true when shimmer/draft/real itinerary exists.
 * "Complete" = itinerary exists AND status is NOT "Draft" AND NOT nullish.
 */
const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode, hasItineraryActivity }) => {
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

  // Only show the tab strip if the bot has started building an itinerary
  if (!hasItineraryActivity) {
    return null;
  }

  // Shared button style helper
  const activeStyle: React.CSSProperties = {
    borderRadius: "12px",
    background: "#0F1A2E",
    boxShadow: "0 2px 8px rgba(11,18,32,0.18)",
  };
  const inactiveStyle: React.CSSProperties = { borderRadius: "12px" };

const tabBtn = (
  label: string,
  mode: string,
  onClick: () => void,
  icon: React.ReactNode,
) => (
  <button
    onClick={onClick}
    className={`flex-1 px-3 py-1.5  transition-all duration-200 flex items-center justify-center gap-2 ${
 viewMode === mode ? "text-white" : "text-[#000]"
 }`}
    style={viewMode === mode ? activeStyle : inactiveStyle}
  >
    {icon}
    {label}
  </button>
);

  return (
    <div className="px-4 py-2 flex-shrink-0 ttw-type-body md:ttw-type-body">
      <div
        className="flex gap-1 p-[3px]"
        style={{
          borderRadius: "12px",
          border: "1px solid #ECECEC",
          background: "#fff"
          // "#F4F1E6",
        }}
      >
        {/* Map — always visible when the strip is shown */}
        <button
          onClick={() => setViewMode("map")}
          className={`flex-1 px-3 py-1.5 ttw-type-body-strong transition-all duration-200 flex items-center justify-center gap-2 ${
 viewMode === "map" ? "text-white" : "text-[#000]"
 }`}
          style={viewMode === "map" ? activeStyle : inactiveStyle}
        >
          <FiMap size={14} />
          Map
        </button>

      {/* Routes */}
{isComplete &&
  tabBtn("Route", "routes", () => setViewMode("routes"),
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M9 6h7a2 2 0 0 1 2 2v7" />
    </svg>
  )}

{/* Itinerary */}
{tabBtn("Itinerary", "itinerary", () => setViewMode("itinerary"), <FiCalendar size={14} />)}

{/* Bookings */}
{isComplete &&
  tabBtn("Bookings", "bookings", () => setViewMode("bookings"),
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14l-5-5-9 9" />
      <path d="M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
    </svg>
  )}
      </div>
    </div>
  );
};

export default ViewToggle;