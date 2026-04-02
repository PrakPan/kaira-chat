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
  max-width: 410px;
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
    item?.heading ||
    item?.restaurants?.[0]?.name ||
    item?.name ||
    ""
  );
};

// ─── Helper: get image URL ────────────────────────────────────────────────────
const getItemImage = (item) => {
  // For old-format restaurants stored under restaurants[0]
  const icon = item?.icon || item?.restaurants?.[0]?.icon;
  if (!icon)
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
  if (resolvedType === "activity") return item?.booking?.id || item?.id;
  if (resolvedType === "poi") return item?.poi || item?.id;
  if (resolvedType === "restaurant")
    return item?.restaurants?.[0]?.id || item?.restaurant || item?.id;
  return null;
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

// ─── Tag renderer ─────────────────────────────────────────────────────────────
const renderTag = (item, extraClass = "") => {
  const type = resolveElementType(item);

  if (type === "activity") {
    return (
      <div className={`${extraClass}`}>
        <span className="inline-flex items-center gap-[5px] px-[7px] py-[1px] rounded-[6px] border border-[#5cba663b] bg-[#EBFFEF] text-[12px] shadow-none">
          <span className="w-[7px] h-[7px] rounded-full bg-[#22C55E] shrink-0" />
          Activity
        </span>
      </div>
    );
  }

  if (type === "recommendation") {
    return (
      <div className={`${extraClass}`}>
        <RecommendationIcon size={14} />
      </div>
    );
  }

  if (type === "restaurant") {
    return (
      <div className={`${extraClass}`}>
        <span className="inline-flex items-center gap-[5px] px-[7px] py-[1px] rounded-[6px] border border-[#D1D5DB] bg-white text-[12px] shadow-none">
          <span className="w-[7px] h-[7px] rounded-full bg-[#3B82F6] shrink-0" />
          Restaurant
        </span>
      </div>
    );
  }

  if (type === "poi") {
    return (
      <div className={`${extraClass}`}>
        <span className="inline-flex items-center gap-[5px] px-[7px] py-[1px] rounded-[6px] border border-[#D1D5DB] bg-white text-[12px] shadow-none">
          <span className="w-[7px] h-[7px] rounded-full bg-[#7C3AED] shrink-0" />
          Self Exploration
        </span>
      </div>
    );
  }

  return null;
};

// ─── Main component ───────────────────────────────────────────────────────────

const CityDay = (props) => {
  const [elements, setElements] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const { finalized_status } = useSelector((state) => state.ItineraryStatus);
  const { trackActivityBookingAdd, trackActivityCardClicked } = useAnalytics();
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
      `https://mercury.tarzanway.com/api/v1/ancillaries/activity/${activityId}/?currency=INR`,
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
        pathname: router.asPath.split("?")[0],
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
  if (!item) return;

  const resolvedType = resolveElementType(item);
  const itemId = getItemId(item, resolvedType);

  if (!resolvedType || !itemId || resolvedType === "recommendation") return;

  // Draft itinerary: activities open ActivityDetailsDrawer via API

  console.log("Item clicked:", { item, resolvedType, itemId, isDraft });
  if (isDraft && resolvedType === "activity") {
    handleDraftActivityClick(item);
    return;
  }

  trackActivityCardClicked(router.query.id, resolvedType);
  router.push(
    {
      pathname: router.asPath.split("?")[0],
      query: {
        drawer: "showPoiDetail",
        itinerary_city_id: props?.itinerary_city_id,
        poi_id: itemId,
        type: resolvedType,
      },
    },
    undefined,
    { scroll: false }
  );
};

  // ── Intracity / taxi bookings ─────────────────────────────────────────────────

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
    const isRecommendationOnly = resolvedType === "recommendation";
    const isClickable = !isRecommendationOnly;

    return (
      <div key={idxInSlot} className="flex items-center gap-2">
        {/* ── Left icon ── */}
        {isRecommendationOnly ? (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F7ECFF] shrink-0">
            <RecommendationIcon size={16} />
          </div>
        ) : (
          <img
            src={getItemImage(item)}
            alt={name}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
        )}

        {/* ── Name + tag ── */}
        <div className="flex flex-col min-w-0">
          <TooltipWrapper
            onMouseEnter={(e) => handleMouseEnter(e, `${idxInSlot}-${name}`)}
            onMouseLeave={() => setHoveredItem(null)}
            className="min-w-0"
          >
            <span
              className={`text-[13px] font-[400] leading-snug truncate block ${
                isClickable
                  ? "cursor-pointer hover:underline"
                  : "cursor-default"
              }`}
              onClick={() => isClickable && handleItemClick(item)}
            >
              {name}
            </span>

            {/* Tooltip */}
            {hoveredItem === `${idxInSlot}-${name}` && (
              <Tooltip
                style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
              >
                {name}
              </Tooltip>
            )}
          </TooltipWrapper>

          {/* Tag — shown for all types except pure recommendations */}
          {resolvedType !== "recommendation" && renderTag(item)}
        </div>
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

  const groups = buildSlotGroups();
  const presentSlots = TIME_ORDER.filter((s) => groups[s]);

  return (
    <>
     <div className="flex sm:flex-row flex-col border-b border-[#E8E8E8] last:border-b-0 w-full justify-center">

        {/* COL 1: Date label */}
        <div className="sm:w-fit w-full shrink-0 px-4 sm:pt-6 pt-4 sm:pb-6 pb-2 flex sm:flex-col flex-row sm:items-start items-baseline gap-2">
  <p className="text-[18px] font-[600] m-0 leading-tight">Day {props.index + 1}</p>
  <span className="sm:hidden text-[#9CA3AF] text-[14px]">·</span>
  <p className="text-[12px] sm:text-[12px] md:text-[14px] text-[#9CA3AF] m-0 sm:mt-2 mt-0 leading-tight">
    {/* date */}
  </p>
</div>

        {/* COL 2: Content */}
        <div className="flex-1 sm:pr-4 px-4 sm:pt-6 md:pt-4 pb-4 sm:pb-6 min-w-0">

          {elements.length > 0 ? (
            <div className="relative">
              {/* Vertical timeline line — only when multiple slots exist */}
              {presentSlots.length > 1 && (
                <div
                  className="absolute w-[1.5px] bg-[#E5E7EB] z-0"
                  style={{ left: "3px", top: "8px", bottom: "8px" }}
                />
              )}

              <div className="flex flex-col gap-1">
                {presentSlots.map((slot) => (
                  <div key={slot}>
                    {/* Slot header */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-[7px] h-[7px] rounded-full bg-[#e5e5e5] shrink-0 z-10 relative" />
                      <span className="text-[14px] font-[500] text-[#111]">
                        {slot}
                      </span>
                    </div>

                    {/* Items in slot */}
                    <div className="ml-[22px] flex flex-col gap-3">
                      {groups[slot].map((item, idxInSlot) =>
                        renderItem(item, idxInSlot)
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          ) : props?.isLastDay ? (
            <div className="flex items-center gap-2">
              <IoBagCheckOutline size={15} />
              <span className="text-[13px]">
                Check out from {props?.city?.name}
              </span>
            </div>

          ) : (
            <div className="flex items-center gap-2">
              <MdOutlineDownhillSkiing size={15} className="text-[#9CA3AF]" />
              <span className="text-[13px] text-[#6B7280]">
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