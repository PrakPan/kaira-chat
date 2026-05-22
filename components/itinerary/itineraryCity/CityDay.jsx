import { useEffect, useState } from "react";
import ActivityAddDrawer from "../../drawers/poiDetails/activityAddDrawer";
import { useDispatch, useSelector } from "react-redux";
import TransferDrawer from "../../../containers/itinerary/TransferDrawer";
import { useRouter } from "next/router";
import styled from "styled-components";
import { getDatesInRange } from "../../../helper/DateUtils";
import { useAnalytics } from "../../../hooks/useAnalytics";
import useMediaQuery from "../../media";
import { MdOutlineDownhillSkiing } from "react-icons/md";
import { setCloneItineraryDrawer } from "../../../store/actions/cloneItinerary";
import { FaTaxi } from "react-icons/fa6";
import { IoBagCheckOutline } from "react-icons/io5";
import { getDate } from "../../../helper/ConvertDateFormat";
import ActivityDetailsDrawer from "../../drawers/activityDetails/ActivityDetailsDrawer";

// ─── Styled components ────────────────────────────────────────────────────────

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
  max-width: 100%;
`;

const Tooltip = styled.div`
  position: fixed;
  background-color: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 9999;
  pointer-events: none;
  max-width: fit-content;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #333;
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────

const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";

const TIME_ORDER = ["Morning", "Afternoon", "Evening", "Night"];

// ─── Helper: resolve canonical element type (handles old + new API formats) ───
//
//  Old format quirks:
//    • element_type "activity" + poi key present  → treat as "poi"
//    • element_type "recommendation" + restaurants array → treat as "restaurant"
//  New format:  element_type is already one of activity | poi | restaurant | recommendation
//
const resolveElementType = (item) => {
  if (!item) return null;

  // Old format: activity element that is actually a POI (self-exploration)
  if (item.element_type === "activity" && item.poi != null) return "poi";

  // Old format: activity element
  if (item.element_type === "activity" && item.activity) return "activity";

  // Old format: recommendation element that is actually a restaurant
  if (
    item.element_type === "recommendation" &&
    Array.isArray(item.restaurants) &&
    item.restaurants.length > 0
  )
    return "restaurant";

  // New format / everything else
  return item.element_type || null;
};

// ─── Helper: get display name ─────────────────────────────────────────────────
const getItemName = (item) => {
  return (
    item?.name ||
    item?.restaurants?.[0]?.name ||
    item?.heading ||
    ""
  );
};

// ─── Helper: get image URL ────────────────────────────────────────────────────
const getItemImage = (item) => {
  // For old-format restaurants stored under restaurants[0]
  let icon = item?.icon || item?.restaurants?.[0]?.icon;
  // Handle array-type icon fields (some API responses return an array)
  if (Array.isArray(icon)) icon = icon[0] || null;
  if (!icon || typeof icon !== "string")
    return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop";
  if (icon.startsWith("http")) return icon;
  return imgUrlEndPoint + icon;
};

// ─── Helper: derive time-of-day label ─────────────────────────────────────────
const getTimeOfDay = (timeString) => {
  if (!timeString) return null;

  const normalized = timeString.trim().toLowerCase();
  const validLabels = ["morning", "afternoon", "evening", "night"];
  if (validLabels.includes(normalized))
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);

  const match = timeString.match(/(\d+)(?::(\d+))?\s*(AM|PM)?/i);
  if (!match) return null;

  let hour = parseInt(match[1], 10);
  const period = match[3]?.toUpperCase();

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 21) return "Evening";
  return "Night";
};

// ─── Helper: get item ID for drawer navigation ────────────────────────────────
const getItemId = (item, resolvedType) => {
  if (resolvedType === "activity") return item?.booking?.id || item?.id || item?.activity;
  if (resolvedType === "poi") return item?.poi || item?.id;
  if (resolvedType === "restaurant")
    return item?.restaurants?.[0]?.id || item?.restaurant || item?.id;
  return null;
};

// ─── Helper: get one-liner / subtitle (uses `one_liner` from API) ─────────────
const getItemSubtitle = (item) => {
  return (
    item?.one_liner ||
    item?.short_description ||
    item?.description ||
    item?.address ||
    item?.restaurants?.[0]?.one_liner ||
    item?.restaurants?.[0]?.short_description ||
    item?.restaurants?.[0]?.address ||
    null
  );
};

// ─── Helper: derive right-column status label + tone ──────────────────────────
//   restaurant   → "Reserved"
//   activity/poi → "Confirmed"
//   recommendation → no right column
const getStatusInfo = (resolvedType) => {
  if (resolvedType === "restaurant")
    return { label: "Reserved", tone: "confirmed" };
  if (resolvedType === "activity" || resolvedType === "poi")
    return { label: "Confirmed", tone: "confirmed" };
  return null;
};

// ─── Helper: card variant background / border per element type ────────────────
//   restaurant      → peach wash (#FFF4E8), NO border
//   activity / poi  → white card, #ECECEC 1px border, yellow left accent bar
//   recommendation  → transparent, dashed #B8BECC border
const getCardVariantClass = (resolvedType) => {
  if (resolvedType === "restaurant") {
    return "bg-[#FFF4E8] border-0 shadow-none";
  }
  if (resolvedType === "recommendation") {
    return "bg-transparent border border-dashed border-[#B8BECC] shadow-none";
  }
  // activity, poi
  return "bg-white border border-[#ECECEC] shadow-none";
};

// ─── Helper: clock-time to show in the right column ───────────────────────────
const getDisplayTime = (item) => {
  if (item?.start_time) return item.start_time;
  if (item?.time && /^\d/.test(item.time)) return item.time;
  return null;
};

// ─── Helper: pretty-print ideal_duration (e.g. 1 → "1h", 1.5 → "1h 30m") ──────
const getDurationLabel = (item) => {
  const d = item?.ideal_duration;
  if (d == null || isNaN(Number(d))) return null;
  const num = Number(d);
  const hours = Math.floor(num);
  const mins = Math.round((num - hours) * 60);
  if (hours === 0 && mins === 0) return null;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

// ─── Helper: collect tag strings (api `tags` array + duration chip) ───────────
const getDisplayTags = (item) => {
  const raw = Array.isArray(item?.tags) ? item.tags : [];
  const cleaned = raw
    .map((t) => (typeof t === "string" ? t.trim() : ""))
    .filter(Boolean);
  return cleaned;
};

// ─── Helper: format day-header date as "Fri 6 Jun" (uppercase via CSS) ────────
const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const SHORT_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatDayHeaderDate = (dateStr) => {
  if (!dateStr) return null;
  // API uses ISO "YYYY-MM-DD" — parse as a local date so we don't drift a day.
  const m = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
  let d;
  if (m) {
    d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  } else {
    d = new Date(dateStr);
  }
  if (isNaN(d.getTime())) return null;
  return `${SHORT_WEEKDAYS[d.getDay()]} ${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`;
};

// ─── Recommendation SVG icon ──────────────────────────────────────────────────
const RecommendationIcon = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill="none"
  >
    <path
      d="M4.10863 13.1971C3.78487 13.3051 3.45052 13.0641 3.45052 12.7228V8.76025C3.45052 8.66763 3.42479 8.57683 3.37621 8.49798L1.71635 5.80389C1.61723 5.64302 1.61727 5.44001 1.71646 5.27918L4.10611 1.40406C4.19716 1.25641 4.35823 1.1665 4.5317 1.1665H9.36934C9.54281 1.1665 9.70388 1.25641 9.79493 1.40406L12.1846 5.27918C12.2838 5.44001 12.2838 5.64302 12.1847 5.8039L10.5248 8.49798C10.4762 8.57683 10.4505 8.66763 10.4505 8.76025V12.7228C10.4505 13.0641 10.1162 13.3051 9.79241 13.1971L7.10863 12.3025C7.006 12.2683 6.89504 12.2683 6.79241 12.3025L4.10863 13.1971ZM4.61719 11.1054C4.61719 11.4463 4.95082 11.6872 5.27441 11.58L6.7933 11.0769C6.89539 11.0431 7.00566 11.0431 7.10774 11.0769L8.62663 11.58C8.95022 11.6872 9.28385 11.4463 9.28385 11.1054V10.4165C9.28385 10.1404 9.06 9.9165 8.78385 9.9165H5.11719C4.84104 9.9165 4.61719 10.1404 4.61719 10.4165V11.1054ZM5.18759 2.33317C5.01432 2.33317 4.8534 2.42288 4.76229 2.57026L3.08805 5.27859C2.98844 5.43972 2.98844 5.64329 3.08805 5.80442L4.76229 8.51275C4.8534 8.66013 5.01432 8.74984 5.18759 8.74984H8.71345C8.88672 8.74984 9.04764 8.66013 9.13875 8.51275L10.813 5.80441C10.9126 5.64329 10.9126 5.43972 10.813 5.27859L9.13875 2.57026C9.04764 2.42288 8.88672 2.33317 8.71345 2.33317H5.18759ZM6.69032 7.56472C6.49568 7.76023 6.17946 7.76114 5.98369 7.56675L4.62324 6.21589C4.4268 6.02083 4.42624 5.70328 4.62199 5.50753L4.74488 5.38464C4.94015 5.18938 5.25673 5.18938 5.45199 5.38464L5.98342 5.91607C6.17909 6.11174 6.49648 6.11127 6.69157 5.91503L8.45217 4.14401C8.64604 3.94899 8.96101 3.94713 9.15717 4.13985L9.27481 4.25542C9.47272 4.44986 9.47448 4.76825 9.27873 4.96486L6.69032 7.56472Z"
      fill="#AD5BE7"
    />
  </svg>
);

// ─── Tag chip styles ──────────────────────────────────────────────────────────
const CHIP_BASE =
  "inline-flex items-center gap-[3px] px-[6px] py-[2px] rounded-[3px] ttw-type-chip whitespace-nowrap";

// All 8 tag variants ported from the v4 HTML.
// Border on each tag = a lighter shade of that tag's own background color, so
// the outline reads as a soft tonal edge rather than a separate accent color.
// (duration is intentionally excluded — that's reserved for the duration chip)
const TAG_STYLES = [
  // .act-tag.booked      — ink bg, yellow text, lighter-ink border
  "bg-[#0B1220] text-[#F7E700] border border-[#2D3548]",
  // .act-tag.suggest     — transparent + soft gray border, ink-4 text
  "bg-transparent text-[#8892A6] border border-[#D6DAE3]",
  // .act-tag.food-tag    — ink bg, peach text, lighter-ink border
  "bg-[#0B1220] text-[#FFE5D1] border border-[#2D3548]",
  // .act-tag.kaira-pick  — yellow fill, ink text, lighter-yellow border
  "bg-[#F7E700] text-[#0B1220] border border-[#FAEC5C]",
  // .act-tag.curated     — peach fill, ink text, lighter-peach border
  "bg-[#FFE5D1] text-[#0B1220] border border-[#FFF0E3]",
  // .act-tag.local-fav   — green-soft fill, green text, lighter-green border
  "bg-[#DFF3E7] text-[#1F8A5A] border border-[#EDF8F1]",
  // .act-tag.hidden-gem  — violet-soft fill, violet text, lighter-violet border
  "bg-[#F1E6FF] text-[#7E3DD4] border border-[#F8F2FF]",
  // .act-tag.must-do     — pink-soft fill, pink text, lighter-pink border
  "bg-[#FFE5EC] text-[#D9577A] border border-[#FFF0F4]",
];

// Stable string-hash so a given tag string always picks the same variant
// across re-renders (random-looking but deterministic = no flicker).
const hashString = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

const pickTagStyle = (tag) =>
  TAG_STYLES[hashString(String(tag)) % TAG_STYLES.length];

// Duration chip — the ONLY chip with the paper-2 cream fill (HTML .act-tag.duration).
const durationChipClass = "bg-[#F4F1E6] text-[#4A566E]";

// Recommendation chip — only used for "recommendation" rows so the user
// can still tell those apart from real bookable items.
const recommendationChipClass =
  "bg-[#F1E6FF] text-[#7E3DD4] border border-[#7E3DD440]";

// ─── Main component ───────────────────────────────────────────────────────────

const CityDay = (props) => {
  const [elements, setElements] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const { finalized_status } = useSelector((state) => state.ItineraryStatus);
  const {
    trackActivityBookingAdd,
    trackActivityCardClicked,
    trackTaxiCardClicked,
    trackPoiCardClicked,
  } = useAnalytics();
  const transferBookings = useSelector(
    (state) => state.TransferBookings
  ).transferBookings;
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.auth);
  const { customer } = useSelector((state) => state.Itinerary);
  const [showActivityDetails, setShowActivityDetails] = useState({ show: false });
const [activityLoading, setActivityLoading] = useState(false);
const isDraft = useSelector((state) => state.Itinerary.status) === "Draft";

  const router = useRouter();
  const { drawer, idx, itinerary_city_id, date } = router?.query;

  const handleDraftActivityClick = async (item) => {
  const resolvedType = resolveElementType(item);
  if (resolvedType !== "activity") return;

  const activityId = item?.booking?.id || item?.id;
  if (!activityId) return;

  try {
    setActivityLoading(true);
    const response = await fetch(
      `https://dev.mercury.tarzanway.com/api/v1/ancillaries/activity/${activityId}/?currency=INR`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          start_date: props?.day?.date || props?.start_date,
          number_of_adults: props?.pax?.adults || 2,
          number_of_children: props?.pax?.children || 0,
          children_ages: props?.pax?.children_ages || [],
        }),
      }
    );
    const data = await response.json();
    setShowActivityDetails({ show: true, data, id: activityId });
  } catch (err) {
    console.error("Failed to fetch activity details", err);
  } finally {
    setActivityLoading(false);
  }
};

  // ── Sync elements from props ─────────────────────────────────────────────────
  useEffect(() => {
    if (props.day?.slab_elements) {
      setElements(props.day.slab_elements);
    }
  }, [props.day?.slab_elements]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleAddActivity = () => {
    if (localStorage.getItem("access_token")) {
      // Logged in — proceed
    } else {
      props?.setShowLoginModal(true);
      return;
    }
    trackActivityBookingAdd(router.query.id, "day_by_day_collapse");
    router.push(
      {
        pathname: window.location.pathname,
        query: {
          drawer: "showAddActivity",
          itinerary_city_id: props?.itinerary_city_id,
          idx: props?.index,
          date: props?.day?.date,
        },
      },
      undefined,
      { scroll: false }
    );
  };

const handleItemClick = (item) => {
  const resolvedType = resolveElementType(item);
  if (!resolvedType || resolvedType === "recommendation") return;

  const itemId = getItemId(item, resolvedType);
  console.log("ItemId",itemId)
  if (!itemId) return;

  if(resolvedType === "poi") {
    trackPoiCardClicked(router.query.id, itemId, "day_by_day_collapse", "poi");
  } else if (resolvedType === "restaurant") {
    trackActivityCardClicked(router.query.id, itemId, "day_by_day_collapse", "restaurant");
  } else if (resolvedType === "activity") {
    trackActivityCardClicked(router.query.id, itemId, "day_by_day_collapse", "activity");
  } else {
  trackActivityCardClicked(router.query.id, itemId, "day_by_day_collapse");
  }

  if (resolvedType === "activity" && (isDraft || finalized_status === "PENDING")) {
    handleDraftActivityClick(item);
    return;
  }

  router.push(
    {
      pathname: window.location.pathname,
      query: {
        drawer: "showPoiDetail",
        poi_id: itemId,
        type: resolvedType,
        dayIndex: props?.dayIndex,
        slabIndex: item?.index,
        itinerary_city_id: props?.itinerary_city_id,
      },
    },
    undefined,
    { scroll: false }
  );
};
useEffect(() => {
  let elements = [];
  for (let elem of props.day.slab_elements) {


    if (["activity", "poi", "restaurant","recommendation"].includes(elem.element_type || elem?.type)) {
      elements.push(elem);
    } else if (
      elem.element_type === "recommendation" &&
      elem.restaurants?.length > 0
    ) {
      elements.push(elem);
    }
  }
  setElements(elements);
}, [props.day?.slab_elements]);

  useEffect(() => {
    if (props?.index === 0) {
      // setViewMore(true);
    }
  }, []);

  const matchingIntracityBookings = props?.intracityBookings?.filter(
    (booking) => {
      const checkIn = booking?.check_in?.split(" ")[0];
      const checkOut = booking?.check_out?.split(" ")[0];
      const allDates = getDatesInRange(checkIn, checkOut);
      const dayDate = new Date(props?.day?.date).toISOString().split("T")[0];
      return allDates.includes(dayDate);
    }
  );

  const formattedTaxiDetails = matchingIntracityBookings?.map((booking) => ({
    ...booking,
    id: booking.id,
    currentDayLabel: `Day ${props.index + 1}, ${getDate(props?.day?.date)}`,
    fromLocation: booking.transfer_details?.source?.name || "Unknown Source",
    toLocation:
      booking.transfer_details?.destination?.name || "Unknown Destination",
    passengers:
      booking.number_of_adults +
      booking.number_of_children +
      booking.number_of_infants,
  }));

  // ── Tooltip handler ───────────────────────────────────────────────────────────

  const handleMouseEnter = (e, itemKey) => {
    const element = e.currentTarget.querySelector("h4, span");
    if (!element) return;
    const isTruncated = element.scrollWidth > element.clientWidth;
    if (isTruncated) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 10,
        left: rect.left + rect.width / 2,
      });
      setHoveredItem(itemKey);
    }
  };

  // ── Render a single activity/POI/restaurant/recommendation row ────────────────

  const renderItem = (item, idxInSlot) => {
    const resolvedType = resolveElementType(item);
    const name = getItemName(item);
    const subtitle = getItemSubtitle(item);
    const isRecommendationOnly = resolvedType === "recommendation";
    const isClickable = !isRecommendationOnly;
    const status = getStatusInfo(resolvedType);
    const containerClass = getCardVariantClass(resolvedType);
    const displayTime = getDisplayTime(item);
    const duration = getDurationLabel(item);
    const dataTags = getDisplayTags(item);

    return (
      <div
        key={idxInSlot}
        onClick={() => isClickable && handleItemClick(item)}
        className={`relative grid grid-cols-[40px_minmax(0,1fr)_auto] gap-2.5 sm:gap-3 px-3 py-2.5 rounded-[10px] items-center transition-all ${containerClass} ${
          isClickable
            ? "cursor-pointer hover:border-[#8892A6] hover:-translate-y-[1px]"
            : "cursor-default"
        }`}
      >
        {/* Yellow vertical accent bar on every activity / POI card */}
        {(resolvedType === "activity" || resolvedType === "poi") && (
          <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] bg-[#F7E700] rounded-r-[3px]" />
        )}

        {/* ── Thumb ── */}
        {isRecommendationOnly ? (
          <div className="w-10 h-10 flex items-center justify-center rounded-[9px] bg-[#F1E6FF] shrink-0">
            <RecommendationIcon size={16} />
          </div>
        ) : (
          <img
            src={getItemImage(item)}
            alt={name}
            className="w-10 h-10 rounded-[9px] object-cover shrink-0"
          />
        )}

        {/* ── Body: 1) name  2) one_liner  3) tags row ── */}
        <div className="min-w-0">
          {/* 1) name */}
          <TooltipWrapper
            onMouseEnter={(e) => handleMouseEnter(e, `${idxInSlot}-${name}`)}
            onMouseLeave={() => setHoveredItem(null)}
            className="min-w-0 block"
          >
            <h4 className="ttw-type-h6 text-[#0B1220] truncate m-0 leading-[1.25]">
              {name}
            </h4>

            {hoveredItem === `${idxInSlot}-${name}` && (
              <Tooltip
                style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
              >
                {name}
              </Tooltip>
            )}
          </TooltipWrapper>

          {/* 2) one-liner */}
          {subtitle && (
            <p className="ttw-type-small text-[#4A566E] truncate m-0 mt-[3px] leading-[1.3]">
              {subtitle}
            </p>
          )}

          {/* 3) tags row — data tags from `item.tags` + duration */}
          {(dataTags.length > 0 || duration || isRecommendationOnly) && (
            <div className="flex gap-[5px] flex-wrap items-center mt-[6px]">
              {isRecommendationOnly && (
                <span className={`${CHIP_BASE} ${recommendationChipClass}`}>
                  <RecommendationIcon size={10} />
                  Recommendation
                </span>
              )}
              {dataTags.map((t) => (
                <span key={t} className={`${CHIP_BASE} ${pickTagStyle(t)}`}>
                  {t}
                </span>
              ))}
              {duration && (
                <span className={`${CHIP_BASE} ${durationChipClass}`}>
                  {duration}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Right column: time + status ── */}
        {status && (
          <div className="flex flex-col items-end shrink-0 text-right min-w-[56px] sm:min-w-[64px]">
            {/* {displayTime && (
              <span className="ttw-type-meta text-[#4A566E]">
                {displayTime}
              </span>
            )} */}
            <span
              className={`ttw-type-status mt-[3px] ${
                status.tone === "confirmed"
                  ? "text-[#1F8A5A]"
                  : "text-[#8892A6]"
              }`}
            >
              {status.label}
            </span>
          </div>
        )}
      </div>
    );
  };

  // ── Build time-slot groups ────────────────────────────────────────────────────

 const buildSlotGroups = () => {
  const groups = {};
    elements.forEach((item) => {
    const slot = item?.time
      ? getTimeOfDay(item.time) || "Morning"
      : "Morning";
    if (!groups[slot]) groups[slot] = [];
      groups[slot].push(item);
  });
  return groups;
};

  // ── Render ────────────────────────────────────────────────────────────────────

  // Only render time-of-day slot headers when at least one element actually
  // carries a `time` value. Otherwise buildSlotGroups would fall back to
  // "Morning" for every item and show a misleading slot label.
  const hasAnyTime = elements.some(
    (item) => typeof item?.time === "string" && item.time.trim() !== "",
  );
  const groups = buildSlotGroups();
  const presentSlots = TIME_ORDER.filter((s) => groups[s]);

  const isDesktop = useMediaQuery("(min-width:767px)");

  return (
    <>
     <div className="flex sm:flex-row flex-col border-b border-[#ECECEC] last:border-b-0 w-full justify-center bg-[#FBFAF3]">

        {/* COL 1: Day number + date — matches HTML .day-num-block */}
        <div className="sm:w-fit w-full shrink-0 px-4 sm:pt-6 pt-4 sm:pb-6 pb-2 flex sm:flex-col flex-row sm:items-start items-baseline gap-3 sm:min-w-[80px]">
          <div className="flex flex-col  sm:items-start items-baseline gap-2 sm:gap-1 shrink-0">
            <span className="ttw-type-day-num text-[#0B1220] m-0 whitespace-nowrap">
              {String(props.index + 1).padStart(2, "0")}
            </span>
            {props.day?.date && (
              <span className="ttw-type-day-date text-[#8892A6] m-0 whitespace-nowrap">
                {formatDayHeaderDate(props.day.date)}
              </span>
            )}
          </div>
          {/* {props.day?.day_summary && (
            <p
              className="ttw-type-small text-[#6B7280] m-0 sm:mt-1 mt-0 leading-tight hidden sm:block"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                maxWidth: "160px",
              }}
            >
              {props.day.day_summary}
            </p>
          )} */}
        </div>

        {/* COL 2: Content */}
        <div className="flex-1 sm:pr-4 px-4 sm:pt-6 md:pt-4 pb-4 sm:pb-6 min-w-0">

          {matchingIntracityBookings && matchingIntracityBookings.length > 0 && (
            <div className="flex flex-row gap-xs flex-wrap mb-3">
              {matchingIntracityBookings.map((taxi) => (
                <button
                  key={taxi.id}
                  onClick={() => {
                    trackTaxiCardClicked?.(
                      router.query.id,
                      taxi.id,
                      "day_by_day_collapse",
                    );
                    router.push(
                      {
                        pathname: window.location.pathname,
                        query: {
                          ...(router.query.id ? { id: router.query.id } : {}),
                          drawer: "SightSeeing",
                          bookingId: taxi.id,
                          itinerary_city_id: props?.itinerary_city_id,
                        },
                      },
                      undefined,
                      { scroll: false },
                    );
                  }}
                  className="rounded-9xl ttw-type-small font-400 leading-md px-sm py-xxs text-white bg-[#5CBA66] flex gap-2 items-center justify-center hover:opacity-90"
                >
                  <FaTaxi /> Sightseeing Taxi Included
                </button>
              ))}
            </div>
          )}

          {elements.length > 0 ? (
            hasAnyTime ? (
              <div className="flex flex-col gap-3.5">
                {presentSlots.map((slot) => (
                  <div key={slot}>
                    {/* Slot header — uppercase mono label with trailing divider line */}
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="ttw-type-status text-[#8892A6]">
                        {slot}
                      </span>
                      <span className="flex-1 h-px bg-[#ECECEC]" />
                    </div>

                    {/* Items in slot */}
                    <div className="flex flex-col gap-2">
                      {groups[slot].map((item, idxInSlot) =>
                        renderItem(item, idxInSlot)
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // No item carries a `time` value — render as a flat list of cards.
              <div className="flex flex-col gap-2">
                {elements.map((item, idxInSlot) => renderItem(item, idxInSlot))}
              </div>
            )
          ) : props?.isLastDay ? (
            <div className="flex items-center gap-2 md:ml-5 md:py-2">
              <IoBagCheckOutline size={15} />
              <span className="ttw-type-small">
                Check out from {props?.city?.name}
              </span>
            </div>

          ) : (
            <div className="flex items-center gap-2 md:ml-5 md:py-2">
              <MdOutlineDownhillSkiing size={15} className="text-[#9CA3AF]" />
              <span className="ttw-type-small text-[#6B7280]">
                No activity added.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Activity add drawer */}
      {drawer === "showAddActivity" &&
        itinerary_city_id == props?.itinerary_city_id &&
        idx == props?.index &&
        !props?.isInDrawer && (
          <ActivityAddDrawer
            showDrawer={
              itinerary_city_id == props?.itinerary_city_id &&
              idx == props?.index
            }
            mercuryItinerary={props?.mercuryItinerary}
            setShowDrawer={setShowDrawer}
            cityName={props.city.name}
            cityID={props.city.id}
            regionID={props.city.region}
            date={date}
            setItinerary={props?.setItinerary}
            itinerary_city_id={props?.itinerary_city_id}
            day={`Day ${idx + 1}`}
            duration={props.duration}
            start_date={props?.start_date}
            day_slab_index={idx}
            setShowLoginModal={props?.setShowLoginModal}
            activityBookings={props?.activityBookings}
            setActivityBookings={props?.setActivityBookings}
            setShowSettings={props?.setShowSettings}
          />
        )}


        {showActivityDetails.show && (
  <ActivityDetailsDrawer
    itineraryDrawer
    date={props?.day?.date}
    show={showActivityDetails.show}
    setShowDetails={setShowActivityDetails}
    activityId={showActivityDetails.id}
    handleCloseDrawer={() =>
      setShowActivityDetails({ show: false })
    }
    Topheading={"Select Our Activity"}
    getAccommodationAndActivitiesHandler={
      props?.getAccommodationAndActivitiesHandler
    }
    cityId={props?.city?.id}
    itinerary_city_id={props?.itinerary_city_id}
    setActivities={props?.setActivities}
    activities={props?.activities}
    setItinerary={props?.setItinerary}
    activityBookings={props?.activityBookings}
    setActivityBookings={props?.setActivityBookings}
    setShowLoginModal={props?.setLoginModal}
    pax={props?.pax}
    setShowDrawer={props?.setShowDrawer}
    showPackages={false}
  />
)}
    </>
  );
};

export default CityDay;