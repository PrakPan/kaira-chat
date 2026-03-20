import React, { useState } from "react";
import { IoBagCheckOutline } from "react-icons/io5";
import { MdOutlineDownhillSkiing } from "react-icons/md";
import MapView from "./MapView";
import ItineraryShimmer from "./ItineraryShimmer";
import ViewToggle from "./ViewToggle";
import ItineraryContainer from "../../../containers/itinerary/ItineraryContainer";
import ConfirmationModal, {
  ConfirmationDetails,
} from "./ConfirmationModal";
import type {
  Location,
  UserLocation,
  ItineraryData,
  TransfersData,
  MapState,
  ViewMode,
} from "../types";

// ─── CSS: hide sticky bar / FAB / toasts when embedded inside /chat ───────────
const EMBEDDED_CSS = `
  .embedded-itinerary-panel .desktop-view-cart-fixed {
    display: none !important;
  }
  .embedded-itinerary-panel .Toastify {
    display: none !important;
  }
  .embedded-itinerary-panel::-webkit-scrollbar {
    display: none;
  }
`;

// ─── Panel mode type ──────────────────────────────────────────────────────────
export type ItineraryPanelMode =
  | "map"       // default — MapView + ViewToggle
  | "shimmer"   // start_itinerary_completion_process fired
  | "itinerary" // chat-generated itinerary data
  | "full";     // itinerary_completion_process_completed — full ItineraryContainer

// ─── Props ────────────────────────────────────────────────────────────────────
interface ItineraryLeftPanelProps {
  mode: ItineraryPanelMode;

  // "full" mode
  itineraryId?: string;

  // "map" mode
  mapState?: MapState;
  locations?: Location[] | null;
  userLocation?: UserLocation | null;
  currentRoute?: Location[] | null;
  isLoadingLocation?: boolean;
  mapRef?: React.MutableRefObject<google.maps.Map | null>;
  viewMode?: ViewMode;
  setViewMode?: (mode: ViewMode) => void;

  // "itinerary" mode
  itineraryData?: ItineraryData | null;
  transfers?: TransfersData | null;

  // shared
  onSendMessage?: (message: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Internal sub-components (previously ItineraryView + ItineraryContent) ────
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Icons ───────────────────────────────────────────────────────────────────
const HotelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
    <g opacity="0.3">
      <path d="M19.25 18.25V1.25C19.25 0.984784 19.1446 0.73043 18.9571 0.542893C18.7696 0.355357 18.5152 0.25 18.25 0.25H8.25C7.98478 0.25 7.73043 0.355357 7.54289 0.542893C7.35536 0.73043 7.25 0.984784 7.25 1.25V18.25H4.25V14.25H5.25C5.51522 14.25 5.76957 14.1446 5.95711 13.9571C6.14464 13.7696 6.25 13.5152 6.25 13.25V8.25C6.25 7.98478 6.14464 7.73043 5.95711 7.54289C5.76957 7.35536 5.51522 7.25 5.25 7.25H1.25C0.984784 7.25 0.73043 7.35536 0.542893 7.54289C0.355357 7.73043 0.25 7.98478 0.25 8.25V13.25C0.25 13.5152 0.355357 13.7696 0.542893 13.9571C0.73043 14.1446 0.984784 14.25 1.25 14.25H2.25V18.25H1.25C0.984784 18.25 0.73043 18.3554 0.542893 18.5429C0.355357 18.7304 0.25 18.9848 0.25 19.25C0.25 19.5152 0.355357 19.7696 0.542893 19.9571C0.73043 20.1446 0.984784 20.25 1.25 20.25H19.25C19.5152 20.25 19.7696 20.1446 19.9571 19.9571C20.1446 19.7696 20.25 19.5152 20.25 19.25C20.25 18.9848 20.1446 18.7304 19.9571 18.5429C19.7696 18.3554 19.5152 18.25 19.25 18.25ZM2.25 9.25H4.25V12.25H2.25V9.25ZM12.25 18.25V15.25C12.25 14.9848 12.3554 14.7304 12.5429 14.5429C12.7304 14.3554 12.9848 14.25 13.25 14.25C13.5152 14.25 13.7696 14.3554 13.9571 14.5429C14.1446 14.7304 14.25 14.9848 14.25 15.25V18.25H12.25ZM16.25 18.25V15.25C16.25 14.4544 15.9339 13.6913 15.3713 13.1287C14.8087 12.5661 14.0456 12.25 13.25 12.25C12.4544 12.25 11.6913 12.5661 11.1287 13.1287C10.5661 13.6913 10.25 14.4544 10.25 15.25V18.25H9.25V2.25H17.25V18.25H16.25Z" fill="black" stroke="white" strokeWidth="0.5"/>
      <path d="M12.25 4.25H10.25V6.25H12.25V4.25Z" fill="black"/>
      <path d="M16.25 4.25H14.25V6.25H16.25V4.25Z" fill="black"/>
      <path d="M12.25 8.25H10.25V10.25H12.25V8.25Z" fill="black"/>
      <path d="M16.25 8.25H14.25V10.25H16.25V8.25Z" fill="black"/>
    </g>
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <g clipPath="url(#clip0_star)">
      <path d="M9.944 6.4L8 0L6.056 6.4H0L4.944 9.928L3.064 16L8 12.248L12.944 16L11.064 9.928L16 6.4H9.944Z" fill="#F7E700"/>
    </g>
    <defs>
      <clipPath id="clip0_star">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const RecommendationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 11 13" fill="none">
    <path d="M2.46801 12.0306C2.14424 12.1386 1.8099 11.8976 1.8099 11.5563V7.59375C1.8099 7.50113 1.78417 7.41033 1.73559 7.33147L0.0757254 4.63739C-0.0233917 4.47652 -0.0233509 4.27351 0.0758306 4.11267L2.46549 0.237556C2.55654 0.0899072 2.71761 0 2.89107 0H7.72872C7.90218 0 8.06326 0.0899073 8.15431 0.237556L10.544 4.11267C10.6431 4.27351 10.6432 4.47652 10.5441 4.63739L8.8842 7.33147C8.83562 7.41033 8.8099 7.50113 8.8099 7.59375V11.5563C8.8099 11.8976 8.47555 12.1386 8.15178 12.0306L5.46801 11.136C5.36538 11.1018 5.25442 11.1018 5.15178 11.136L2.46801 12.0306ZM2.97656 9.93891C2.97656 10.2798 3.31019 10.5207 3.63379 10.4135L5.15267 9.91041C5.25476 9.8766 5.36503 9.8766 5.46712 9.91041L6.98601 10.4135C7.3096 10.5207 7.64323 10.2798 7.64323 9.93891V9.25C7.64323 8.97386 7.41937 8.75 7.14323 8.75H3.47656C3.20042 8.75 2.97656 8.97386 2.97656 9.25V9.93891ZM3.54696 1.16667C3.37369 1.16667 3.21277 1.25637 3.12167 1.40376L1.44742 4.11209C1.34782 4.27321 1.34782 4.47679 1.44742 4.63791L3.12167 7.34624C3.21277 7.49363 3.37369 7.58333 3.54696 7.58333H7.07283C7.2461 7.58333 7.40702 7.49363 7.49813 7.34624L9.17237 4.63791C9.27197 4.47679 9.27197 4.27321 9.17237 4.11209L7.49813 1.40376C7.40702 1.25637 7.2461 1.16667 7.07283 1.16667H3.54696ZM5.0497 6.39822C4.85505 6.59373 4.53883 6.59464 4.34307 6.40025L2.98262 5.04938C2.78618 4.85433 2.78562 4.53678 2.98137 4.34103L3.10426 4.21814C3.29952 4.02287 3.6161 4.02287 3.81137 4.21814L4.3428 4.74957C4.53847 4.94524 4.85585 4.94477 5.05095 4.74852L6.81154 2.97751C7.00542 2.78249 7.32039 2.78063 7.51655 2.97335L7.63418 3.08892C7.83209 3.28336 7.83385 3.60175 7.63811 3.79836L5.0497 6.39822Z" fill="#AD5BE7"/>
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface SlabElement {
  id?: string | null;
  type?: string;
  element_type?: string;
  name?: string;
  heading?: string;
  icon?: string;
  time?: string;
  rating?: number | null;
  user_ratings_total?: number | null;
  latitude?: number | string;
  longitude?: number | string;
  activity?: string | number;
  poi?: string | number;
  restaurant?: string | number;
  booking?: { id: string | number };
}

interface DayData {
  date?: string;
  day?: string;
  day_summary?: string;
  slab_elements: SlabElement[];
}

interface Hotel {
  id: string | number;
  name: string;
  rating?: number;
}

// Hotels can come as object {name, id}, array, or string
type HotelsInput = Hotel | Hotel[] | string | undefined;

interface Route {
  city: {
    id: string | number;
    name: string;
    duration: number;
    country?: string;
    accent?: string;
  };
  hotels?: HotelsInput;
  day_by_day: DayData[];
}

interface Transfer {
  from_city: string;
  to_city: string;
  legs: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const IMG_BASE = "https://d31aoa0ehgvjdi.cloudfront.net/";
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop";

const getItemImage = (item: SlabElement) => {
  if (!item?.icon) return FALLBACK_IMG;
  if (item.icon.startsWith("http")) return item.icon;
  return IMG_BASE + item.icon;
};

const getItemName = (item: SlabElement) => item?.heading || item?.name || "";

const formatDateLabel = (dateString: string) => {
  const date = new Date(dateString);
  const d = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const suffix =
    d > 3 && d < 21 ? "th"
    : d % 10 === 1 ? "st"
    : d % 10 === 2 ? "nd"
    : d % 10 === 3 ? "rd"
    : "th";
  return `${d}${suffix} ${month}`;
};

// Normalise any hotels format into a flat Hotel[]
const normaliseHotels = (hotels: HotelsInput): Hotel[] => {
  if (!hotels) return [];
  if (typeof hotels === "string") return [{ id: "single", name: hotels }];
  if (Array.isArray(hotels)) return hotels;
  // Single object { name, id }
  if ((hotels as Hotel).name) return [hotels as Hotel];
  return [];
};

// Normalise transfers — could be array or keyed object
const normaliseTransfers = (transfers: any): Transfer[] => {
  if (!transfers) return [];
  if (Array.isArray(transfers)) return transfers;
  if (typeof transfers === "object") return Object.values(transfers);
  return [];
};

// ─── ActivityRow ──────────────────────────────────────────────────────────────
const ActivityRow: React.FC<{ item: SlabElement }> = ({ item }) => {
  const itemName = getItemName(item);
  const isRecommendation =
    item?.element_type === "recommendation" || item?.type === "recommendation";

  if (isRecommendation) {
    return (
      <div className="flex items-center gap-2 md:gap-3 min-w-0 md:flex-1">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#F3E8FF] flex items-center justify-center flex-shrink-0">
          <RecommendationIcon />
        </div>
        <div className="flex flex-col min-w-0 justify-center">
          <h4 className="text-sm text-[#111827] font-normal truncate mb-0 leading-4">
            {itemName}
          </h4>
          {item?.time && (
            <span className="text-xs text-[#666666]">{item.time}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 md:gap-3 min-w-0 md:flex-1">
      <img
        src={getItemImage(item)}
        alt="activity"
        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src = FALLBACK_IMG;
        }}
      />
      <div className="flex flex-col items-start justify-center gap-1 min-w-0 flex-1">
        <h4 className="text-xs md:text-sm text-[#000] !font-normal truncate mb-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:text-[#0066CC]">
          {itemName}
        </h4>
        <div className="flex items-center gap-2">
          {item?.type === "activity" && (
            <span className="px-1.5 md:px-2 py-0.5 bg-[#5CBA66] text-white text-[10px] md:text-xs rounded-full font-medium whitespace-nowrap">
              Activity
            </span>
          )}
          {item?.type === "restaurant" && (
            <span className="px-1.5 md:px-2 py-0.5 bg-[#FDECEA] text-[#C62828] text-[10px] md:text-xs rounded-full font-medium whitespace-nowrap">
              Restaurant
            </span>
          )}
          {(item?.type === "poi" || (!item?.type && item?.poi)) && (
            <span className="px-1.5 md:px-2 py-0.5 bg-[#EEF2FF] text-[#4338CA] text-[10px] md:text-xs rounded-full font-medium whitespace-nowrap">
              Self Exploration
            </span>
          )}
          {item?.time && (
            <span className="text-xs text-[#666666]">{item.time}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── DayRow ───────────────────────────────────────────────────────────────────
const DayRow: React.FC<{
  day: DayData;
  index: number;
  isLastDay: boolean;
  cityName: string;
}> = ({ day, index, isLastDay, cityName }) => {
  const elements = day?.slab_elements || [];

  // Day label: prefer explicit "Day N" string, fallback to formatted date
  const dayLabel = day.day
    ? day.day
    : day.date
    ? formatDateLabel(day.date)
    : `Day ${index + 1}`;

  return (
    <div className="flex border-b border-[#E8E8E8] hover:bg-[#FAFAFA] transition-colors">
      {/* Date column */}
      <div className="w-20 md:w-24 px-2 md:px-4 py-3 md:py-4 border-r border-[#E8E8E8] flex items-start flex-shrink-0">
        <span className="text-xs md:text-sm text-[#000]">{dayLabel}</span>
      </div>

      {/* Content column */}
      <div className="flex-1 px-2 md:px-4 py-2 md:py-3 min-w-0">
        {elements.length > 0 ? (
          <div className="flex flex-col gap-2">
            {elements.map((item, i) => (
              <ActivityRow key={i} item={item} />
            ))}
          </div>
        ) : isLastDay ? (
          <div className="flex items-center gap-2 md:gap-3">
            <IoBagCheckOutline className="w-[30px] md:w-[40px] h-[20px] md:h-[27px] flex-shrink-0" />
            <span className="text-xs md:text-sm">Check out from {cityName}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <MdOutlineDownhillSkiing className="w-[30px] md:w-[40px] h-[20px] md:h-[27px] flex-shrink-0" />
            <span className="text-xs md:text-sm">No activity is added.</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── HotelRow ─────────────────────────────────────────────────────────────────
const HotelRow: React.FC<{ hotels: HotelsInput }> = ({ hotels }) => {
  const hotelList = normaliseHotels(hotels);
  if (hotelList.length === 0) return null;

  return (
    <>
      {hotelList.map((hotel) => (
        <div key={hotel.id} className="flex flex-col gap-1">
          {hotel?.name && (
            <div className="flex flex-row">
              <div className="flex gap-2 pr-[8px]">
                <HotelIcon />
                <div className="text-[14px] cursor-pointer">{hotel.name}</div>
              </div>
              {hotel?.rating && hotel.rating !== 0 && (
                <div className="flex flex-row items-center pl-[8px]">
                  <div className="text-[#000] text-[12px] ml-1 mr-1 font-[500]">
                    {hotel.rating}
                  </div>
                  <StarIcon />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

// ─── CitySection ──────────────────────────────────────────────────────────────
const CitySection: React.FC<{ route: Route }> = ({ route }) => (
  <div className="border-1 rounded-t-lg flex flex-col w-full bg-[#FFF5EF]">
    {/* City header */}
    <div className="flex items-start justify-between p-3 rounded-t-lg w-full border-1 border-[#FBEAC7]">
      <div className="space-y-1 font-inter w-full">
        <div className="md:text-[18px] font-semibold leading-0">
          {route.city.name}
          {" - "}
          {route.city.duration}{" "}
          {route.city.duration > 1 ? "Nights" : "Night"}
          {route.city.duration === 0 ? " (Transit City)" : ""}
        </div>
        <div className="flex flex-col gap-2">
          <HotelRow hotels={route.hotels} />
        </div>
      </div>
    </div>

    {/* Day-by-day */}
    <div className="bg-[#FBFBFB]">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {route.day_by_day?.map((day, dayIndex) => (
          <DayRow
            key={day.date ?? `day-${dayIndex}`}
            day={day}
            index={dayIndex}
            isLastDay={dayIndex === route.day_by_day.length - 1}
            cityName={route.city.name}
          />
        ))}
      </div>
    </div>
  </div>
);

// ─── TransferSection ──────────────────────────────────────────────────────────
const TransferSection: React.FC<{ transfer: Transfer }> = ({ transfer }) => {
  const legs = transfer.legs ?? [];

  const getIcon = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("flight"))
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      );
    if (lower.includes("train"))
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="3" width="16" height="13" rx="2"/><path d="M4 11h16M12 3v8M8 19l-2 3M16 19l2 3M8 19h8"/>
        </svg>
      );
    if (lower.includes("bus"))
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 6v6M15 6v6M2 12h19.6M18 18h2a1 1 0 0 0 1-1v-5H3v5a1 1 0 0 0 1 1h2M8 18h8M5 18a1 1 0 1 0 2 0 1 1 0 0 0-2 0zM15 18a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"/>
        </svg>
      );
    // default: car
    return (
      <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2M14 17H9m-4 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm11 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/>
      </svg>
    );
  };

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex flex-col items-center self-stretch flex-shrink-0">
        <div style={{ width: "2px", flex: 1, borderLeft: "2px dashed #DDDDDD", minHeight: "60px" }} />
      </div>
      <div className="flex gap-1 items-center py-1">
        {legs.map((leg, i) => (
          <React.Fragment key={i}>
            {getIcon(leg)}
            {i < legs.length - 1 && (
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            )}
          </React.Fragment>
        ))}
        {legs.length > 0 && (
          <span className="text-[16px] font-[500] ml-1">{legs.join(", ")}</span>
        )}
      </div>
    </div>
  );
};

// ─── ItineraryContent (previously its own file) ───────────────────────────────
const ItineraryContent: React.FC<{
  itineraryData: ItineraryData;
  transfers: any;
  onSendMessage?: (message: string) => void;
}> = ({ itineraryData, transfers, onSendMessage }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const transferList = normaliseTransfers(transfers);

  const handleConfirmItinerary = (details: ConfirmationDetails) => {
    const message = `Yes confirm the itinerary. Here are my details:
Start Date: ${details.startDate}
Pax: ${details.adults} Adults, ${details.children} Children, ${details.infants} Infants
Start Location: ${details.startLocation}`;
    onSendMessage?.(message);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-4 px-4">
        <div className="mb-6 pt-4">
          <h1 className="text-xl font-bold text-gray-800">
            {itineraryData.name}
          </h1>
        </div>

        {itineraryData.routes?.map((route: Route, routeIndex: number) => {
          const outboundTransfer = transferList.find(
            (t) => t.from_city === route.city.name
          );

          return (
            <div key={route.city.id ?? routeIndex} className="mb-1">
              <CitySection route={route} />
              {outboundTransfer && (
                <TransferSection transfer={outboundTransfer} />
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky confirm button */}
      <div className="flex-shrink-0 px-6 py-3 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] flex justify-center">
        <button
          onClick={() => setShowConfirmationModal(true)}
          className="w-fit px-3 py-[12px] bg-[#07213A] text-white font-medium rounded-lg hover:bg-[#0a2a4a] transition-colors text-sm md:text-[14px]"
        >
          Confirm Itinerary & View Prices →
        </button>
      </div>

      <ConfirmationModal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        itineraryName={itineraryData.name}
        onConfirm={handleConfirmItinerary}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── ItineraryLeftPanel — single export, all modes ────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const ItineraryLeftPanel: React.FC<ItineraryLeftPanelProps> = ({
  mode,
  itineraryId,
  mapState,
  locations,
  userLocation,
  currentRoute,
  isLoadingLocation,
  mapRef,
  viewMode,
  setViewMode,
  itineraryData,
  transfers,
  onSendMessage,
}) => {
  // ── "full" — embedded ItineraryContainer (real /itinerary/[id] left panel) ─
  if (mode === "full" && itineraryId) {
    return (
      <>
        <style>{EMBEDDED_CSS}</style>
        <div
          className="embedded-itinerary-panel h-full overflow-y-auto bg-white"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <ItineraryContainer id={itineraryId} mercuryItinerary />
        </div>
      </>
    );
  }

  // ── "shimmer" — loading skeleton while itinerary is being built ───────────
  if (mode === "shimmer") {
    return (
      <div className="flex flex-col h-full bg-white overflow-y-auto">
        <ItineraryShimmer />
      </div>
    );
  }

  // ── "itinerary" — chat-generated itinerary data ───────────────────────────
  if (mode === "itinerary") {
    return (
      <div className="flex flex-col h-full bg-white">
        {viewMode && setViewMode && (
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        )}
        {itineraryData ? (
          <ItineraryContent
            itineraryData={itineraryData}
            transfers={transfers}
            onSendMessage={onSendMessage}
          />
        ) : (
          // Fallback shimmer if mode is "itinerary" but data not yet arrived
          <ItineraryShimmer />
        )}
      </div>
    );
  }

  // ── "map" — default, MapView + ViewToggle ─────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-white">
      {viewMode && setViewMode && (
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      )}
      <MapView
        mapState={mapState!}
        locations={locations ?? null}
        userLocation={userLocation ?? null}
        currentRoute={currentRoute ?? null}
        isLoadingLocation={isLoadingLocation ?? false}
        mapRef={mapRef!}
      />
    </div>
  );
};

export default ItineraryLeftPanel;