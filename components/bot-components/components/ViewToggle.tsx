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
const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  setViewMode,
  hasItineraryActivity,
  isComplete: isCompleteProp,
}) => {
  const itinerary = useSelector((state: any) => state.Itinerary);

  // Is there any itinerary object at all with meaningful content?
  const hasItinerary = !!(itinerary && (itinerary.name || itinerary.cities?.length));

  // Is the itinerary fully built (not a draft/skeleton)?
  // Prefer the prop from BotApp (derived from the authoritative ItineraryStatus
  // slice, which is populated early) so the Route/Bookings tabs appear on first
  // arrival at P2 instead of only after a refresh. Fall back to the local
  // Itinerary.status heuristic when the prop isn't supplied.
  const isComplete =
    isCompleteProp !== undefined
      ? isCompleteProp
      : hasItinerary &&
        itinerary.status !== "Draft" &&
        itinerary.status !== undefined &&
        itinerary.status !== null &&
        itinerary.status !== "undefined";

  // Only show the tab strip if the bot has started building an itinerary
  if (!hasItineraryActivity) {
    return null;
  }

  // Design tabs: on desktop a compact pill group (inline-flex, natural-width
  // tabs, navy active); on mobile the full-width strip is kept.
  const activeStyle: React.CSSProperties = { background: "#122A43" };

  const tabClass = (mode: string) =>
    `transition-all duration-200 flex items-center justify-center gap-2 md:gap-[7px] flex-1 md:flex-none px-3 py-1.5 md:px-[26px] md:py-[9px] rounded-[12px] md:rounded-[10px] text-[13px] md:text-[13.5px] font-semibold whitespace-nowrap ${
      viewMode === mode ? "text-white" : "text-[#3b4149]"
    }`;

  const tabBtn = (
    label: string,
    mode: string,
    onClick: () => void,
    icon: React.ReactNode,
  ) => (
    <button
      onClick={onClick}
      className={tabClass(mode)}
      style={viewMode === mode ? activeStyle : undefined}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="px-4 py-2 flex-shrink-0">
      <div className="flex md:inline-flex gap-1 md:gap-2 p-[3px] md:p-1 rounded-[12px] md:rounded-[14px] border border-[#ECECEC] bg-white">
        {/* Map — always visible when the strip is shown */}
        <button
          onClick={() => setViewMode("map")}
          className={tabClass("map")}
          style={viewMode === "map" ? activeStyle : undefined}
        >
          <FiMap size={16} />
          Map
        </button>

      {/* Routes */}
{isComplete &&
  tabBtn("Route", "routes", () => setViewMode("routes"),
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M9 6h7a2 2 0 0 1 2 2v7" />
    </svg>
  )}

{/* Itinerary */}
{tabBtn("Itinerary", "itinerary", () => setViewMode("itinerary"), <FiCalendar size={16} />)}

{/* Bookings */}
{isComplete &&
  tabBtn("Bookings", "bookings", () => setViewMode("bookings"),
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14l-5-5-9 9" />
      <path d="M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" />
    </svg>
  )}
      </div>
    </div>
  );
};

export default ViewToggle;