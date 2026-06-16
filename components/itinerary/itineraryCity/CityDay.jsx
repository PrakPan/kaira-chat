import { useEffect, useState } from "react";
import ActivityAddDrawer from "../../drawers/poiDetails/activityAddDrawer";
import { useDispatch, useSelector } from "react-redux";
import TransferDrawer from "../../../containers/itinerary/TransferDrawer";
import { useRouter } from "next/router";
import { getDatesInRange } from "../../../helper/DateUtils";
import { useAnalytics } from "../../../hooks/useAnalytics";
import useMediaQuery from "../../media";
import { MdOutlineDownhillSkiing } from "react-icons/md";
import { setCloneItineraryDrawer } from "../../../store/actions/cloneItinerary";
import { FaTaxi } from "react-icons/fa6";
import { IoBagCheckOutline } from "react-icons/io5";
import { getDate } from "../../../helper/ConvertDateFormat";
import ActivityDetailsDrawer from "../../drawers/activityDetails/ActivityDetailsDrawer";

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
//   activity (selected in cart) → "Confirmed"
//   everything else             → no right column
// POIs, restaurants and recommendations no longer show a status badge; only
// activities the user has actually added to the cart read as "Confirmed".
const getStatusInfo = (resolvedType, isSelectedInCart) => {
  if (resolvedType === "activity" && isSelectedInCart)
    return { label: "Confirmed", tone: "confirmed" };
  return null;
};

// ─── Helper: card variant background / border per element type ────────────────
// Ported 1:1 from the v4 HTML. Returned as inline styles (not Tailwind classes)
// because arbitrary color/border values returned from a function are not reliably
// picked up by Tailwind's content scanner — same reason the tag chips use inline
// styles. Inline `style` always renders, so the design is reproduced exactly.
//   restaurant            → peach-soft fill (#FFF4E8), transparent 1px border  (.act.food)
//   activity              → white card, #ECECEC 1px solid border               (.act)
//   poi / recommendation  → transparent fill, 1px dashed #B8BECC border        (.act.suggested)
const getCardVariantStyle = (resolvedType) => {
  if (resolvedType === "restaurant") {
    return { background: "#FFF4E8", border: "1px solid transparent" };
  }
  if (resolvedType === "recommendation" || resolvedType === "poi") {
    return { background: "transparent", border: "1px dashed #B8BECC" };
  }
  // activity
  return { background: "#FFFFFF", border: "1px solid #ECECEC" };
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

// ─── Helper: collect tag strings ──────────────────────────────────────────────
// Priority: `agent_tags` first (curation signal from the agent). Fall back to
// `tags` only when no agent_tags were returned. Capped at 2 — the v4 HTML
// recommendation is "1 curation + 1 status + duration" per row.
const getDisplayTags = (item) => {
  const pick = (arr) =>
    (Array.isArray(arr) ? arr : [])
      .map((t) => (typeof t === "string" ? t.trim() : ""))
      .filter(Boolean);

  const agent = pick(item?.agent_tags);
  const source = agent.length > 0 ? agent : pick(item?.tags);
  return source.slice(0, 2);
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
// Ported 1:1 from the v4 HTML `.act-tag` system. Colors/borders ride on inline
// `style` props (not Tailwind arbitrary classes) because Tailwind's content
// scanner sometimes misses arbitrary color values stored in object literals,
// which made every chip render with the browser-default (transparent/white)
// background. Inline style sidesteps the purge/JIT entirely.
const CHIP_BASE =
  "inline-flex items-center gap-[3px] px-[6px] py-[2px] rounded-[3px] uppercase whitespace-nowrap";

const CHIP_TEXT_STYLE = {
  fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, ui-monospace, monospace",
  fontSize: "9px",
  fontWeight: 600,
  letterSpacing: "0.06em",
  lineHeight: 1.1,
};

// Variant style map — keys match common agent_tags / tags strings.
// ONLY backgrounds + borders + text color are mapped; the displayed text is
// always the raw string from the API (no static label override, no icon).
// Every variant ships a SOLID background (no transparent fills) so chips never
// read as white against light card surfaces.
const TAG_STYLE_BY_KEY = {
  // .act-tag.booked — ink fill, yellow text
  booked:      { background: "#0B1220", color: "#F7E700" },
  tickets:     { background: "#0B1220", color: "#F7E700" },
  // .act-tag.suggest — re-mapped from transparent to violet-soft so it pops
  suggested:   { background: "#F1E6FF", color: "#7E3DD4", border: "1px solid rgba(126,61,212,0.25)" },
  suggest:     { background: "#F1E6FF", color: "#7E3DD4", border: "1px solid rgba(126,61,212,0.25)" },
  // "on your own" → green-soft (the activity-self / explore signal)
  on_your_own: { background: "#DFF3E7", color: "#1F8A5A", border: "1px solid rgba(31,138,90,0.3)" },
  // .act-tag.food-tag — ink fill, peach text
  table_held:  { background: "#0B1220", color: "#FFE5D1" },
  window_seat: { background: "#0B1220", color: "#FFE5D1" },
  // .act-tag.kaira-pick — yellow fill, ink text
  kaira_pick:  { background: "#F7E700", color: "#0B1220" },
  kairas_pick:  { background: "#F7E700", color: "#0B1220" },
  // .act-tag.curated — peach fill, ink text
  curated:     { background: "#FFE5D1", color: "#0B1220" },
  // .act-tag.local-fav — green-soft fill
  local_fav:   { background: "#DFF3E7", color: "#1F8A5A", border: "1px solid rgba(31,138,90,0.3)" },
  // .act-tag.hidden-gem — violet-soft fill
  hidden_gem:  { background: "#F1E6FF", color: "#7E3DD4", border: "1px solid rgba(126,61,212,0.25)" },
  // .act-tag.must-do — pink-soft fill
  must_do:     { background: "#FFE5EC", color: "#D9577A", border: "1px solid rgba(217,87,122,0.25)" },
  insider_spot: { background: "#FFE5D1", color: "#0B1220" },
  table_reserved: { background: "#0B1220", color: "#F7E700" },
  insta_worthy_view: { background: "#F1E6FF", color: "#7E3DD4", border: "1px solid rgba(126,61,212,0.25)" },
  tickets_held: { background: "#0B1220", color: "#F7E700" },
  // guide chips — shown on activities when the API sends a `guide` value
  guided:      { background: "#E6F0FF", color: "#1D6FE0", border: "1px solid rgba(29,111,224,0.25)" },
  self_guided: { background: "#DFF3E7", color: "#1F8A5A", border: "1px solid rgba(31,138,90,0.3)" },
  semi_guided: { background: "#F1E6FF", color: "#7E3DD4", border: "1px solid rgba(126,61,212,0.25)" },
  // green-soft "Included" chip — always shown on activity elements
  included:    { background: "#DFF3E7", color: "#1F8A5A", border: "1px solid rgba(31,138,90,0.3)" },
};

// Fallback palette — when the API sends a tag string we don't recognize, we
// still want a colored chip. Deterministic hash → palette index so the same
// string always lands on the same color across renders. NO transparent
// variant here — every entry has a solid fill.
const FALLBACK_STYLES = [
  { background: "#DFF3E7", color: "#1F8A5A", border: "1px solid rgba(31,138,90,0.3)" },   // green-soft
  { background: "#F1E6FF", color: "#7E3DD4", border: "1px solid rgba(126,61,212,0.25)" }, // violet-soft
  { background: "#FFE5EC", color: "#D9577A", border: "1px solid rgba(217,87,122,0.25)" }, // pink-soft
  { background: "#FFE5D1", color: "#0B1220" },                                            // peach
  { background: "#F7E700", color: "#0B1220" },                                            // yellow
  { background: "#0B1220", color: "#F7E700" },                                            // ink + yellow
];

const hashString = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

// Normalize "Local Fav", "local-fav", "LOCAL FAV" → "local_fav" for lookup
const normalizeTagKey = (raw) =>
  String(raw || "").trim().toLowerCase().replace(/[\s-]+/g, "_");

// Display-label overrides — chip text is uppercased via CSS, so only the
// characters that the underscore→space default can't produce (e.g. the
// apostrophe) need an explicit entry here.
const TAG_LABEL_BY_KEY = {
  kairas_pick: "Kaira's pick",
  kaira_pick: "Kaira's pick",
};

const resolveTagLabel = (raw) => {
  const key = normalizeTagKey(raw);
  return TAG_LABEL_BY_KEY[key] || String(raw).replace(/_/g, " ");
};

// Pick a style for a tag. Known keys → mapped style; unknown → deterministic
// fallback color. Caller renders the raw API string as the chip text.
const resolveTagStyle = (raw) => {
  const key = normalizeTagKey(raw);
  if (TAG_STYLE_BY_KEY[key]) return TAG_STYLE_BY_KEY[key];
  return FALLBACK_STYLES[hashString(key) % FALLBACK_STYLES.length];
};

// ─── Tag icon glyphs ──────────────────────────────────────────────────────────
// Star is the default; check is for booking/reservation confirmations;
// diamond is for "curated / hidden / insider" curation signals. Rendered as
// SVGs (not unicode glyphs) so the icon's box equals the drawn shape — flexbox
// `items-center` then centers it exactly, with no font-metric drift on zoom.
// Each uses `fill: currentColor` so it inherits the chip's text color.
const TagGlyph = ({ name, size = 9 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    style: { display: "block", flexShrink: 0 },
  };
  if (name === "check") {
    return (
      <svg
        {...common}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (name === "diamond") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M12 2 22 12 12 22 2 12z" />
      </svg>
    );
  }
  // star (default)
  return (
    <svg {...common} fill="currentColor">
      <path d="M12 2.5l2.81 6.07 6.69.69-4.99 4.49 1.38 6.56L12 17.3l-5.89 3.51 1.38-6.56L2.5 9.26l6.69-.69z" />
    </svg>
  );
};

const TAG_ICON_BY_KEY = {
  // check — confirmed / booked / reserved / table-held
  booked: "check",
  tickets: "check",
  table_held: "check",
  window_seat: "check",
  table_reserved: "check",
  included: "check",
  // ticket — tickets held
  tickets_held: "check",
  // diamond — guided experiences (curation signal)
  guided: "diamond",
  self_guided: "diamond",
  semi_guided: "diamond",
  // diamond — curated / insider / hidden gem signals
  curated: "diamond",
  hidden_gem: "diamond",
  insider_spot: "diamond",
  // (everything else falls back to star)
};

const resolveTagIcon = (raw) => {
  const key = normalizeTagKey(raw);
  return TAG_ICON_BY_KEY[key] || "star";
};

// Duration chip — paper-2 cream fill (HTML .act-tag.duration)
const DURATION_CHIP_STYLE = { background: "#F4F1E6", color: "#4A566E" };

// Recommendation chip — for "recommendation" rows
const RECOMMENDATION_CHIP_STYLE = {
  background: "#F1E6FF",
  color: "#7E3DD4",
  border: "1px solid rgba(126,61,212,0.25)",
};

// ─── Main component ───────────────────────────────────────────────────────────

const CityDay = (props) => {
  const [elements, setElements] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
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
  const cart = useSelector((state) => state.Cart);

  // An activity reads as "Confirmed" only when its booking is in the cart and
  // flagged selected. Matches SlabElement's cart-inclusion check.
  const isSelectedInCart = (item) =>
    !!cart?.summary &&
    Object.values(cart.summary).some((category) =>
      category?.bookings?.some(
        (booking) =>
          booking?.id === item?.booking?.id && booking?.selected === true
      )
    );
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

  const source = item?.booking?.source || item?.source;

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
          ...(source && { source }),
        }),
      }
    );
    const data = await response.json();
    setShowActivityDetails({ show: true, data, id: activityId, source });
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
      { scroll: false, shallow: true }
    );
  };

const handleItemClick = (item) => {
  const resolvedType = resolveElementType(item);
  if (!resolvedType || resolvedType === "recommendation") return;

  const itemId = getItemId(item, resolvedType);
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
    { scroll: false, shallow: true }
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

  // ── Render a single activity/POI/restaurant/recommendation row ────────────────

  const renderItem = (item, idxInSlot) => {
    const resolvedType = resolveElementType(item);
    const name = getItemName(item);
    const subtitle = getItemSubtitle(item);
    const isRecommendationOnly = resolvedType === "recommendation";
    const isClickable = !isRecommendationOnly;
    const selectedInCart = isSelectedInCart(item);
    const status = getStatusInfo(resolvedType, selectedInCart);
    const variantStyle = getCardVariantStyle(resolvedType);
    const displayTime = getDisplayTime(item);
    const duration = getDurationLabel(item);
    const dataTags = getDisplayTags(item);

    // Activity elements show the "Tickets held" chip (always) plus a guide
    // chip ("Guided" / "Self Guided" / "Semi Guided") — but only when the API
    // actually sends a `guide` value for the activity. No other API tags render
    // for activities. Everything else shows up to 2 data tags (already capped
    // in getDisplayTags).
    const guideTag =
      typeof item?.guide === "string" && item.guide.trim()
        ? item.guide.trim()
        : null;
    const renderTags =
      resolvedType === "activity"
        ? [...(guideTag ? [guideTag] : []), "tickets_held"]
        : dataTags;

    const statusBadge = status ? (
      <span
        className={`ttw-type-status shrink-0 whitespace-nowrap ${
          status.tone === "confirmed" ? "text-[#1F8A5A]" : "text-[#8892A6]"
        }`}
      >
        {status.label}
      </span>
    ) : null;

    const tagGroup =
      renderTags.length > 0 || duration ? (
        <span className="flex flex-wrap items-center gap-[5px] !font-normal">
          {renderTags.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className={`${CHIP_BASE} !font-normal`}
              style={{ ...CHIP_TEXT_STYLE, ...resolveTagStyle(t) }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TagGlyph name={resolveTagIcon(t)} />
              </span>
              {resolveTagLabel(t)}
            </span>
          ))}
          {duration && (
            <span
              className={CHIP_BASE}
              style={{ ...CHIP_TEXT_STYLE, ...DURATION_CHIP_STYLE }}
            >
              {duration}
            </span>
          )}
        </span>
      ) : null;

    return (
      <div
        key={idxInSlot}
        onClick={() => isClickable && handleItemClick(item)}
        style={variantStyle}
        className={`relative grid grid-cols-[40px_minmax(0,1fr)] gap-2.5 sm:gap-3 px-3 py-2.5 rounded-[10px] ${
          subtitle ? "items-center" : "items-center"
        } transition-all ${
          isClickable
            ? "cursor-pointer hover:-translate-y-[1px]"
            : "cursor-default"
        }`}
      >
        {/* Yellow vertical accent bar — activity only (POIs no longer get one) */}
        {resolvedType === "activity" && (
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
            className="w-10 h-10 rounded-[9px] object-cover shrink-0 items-center" 
          />
        )}

        {/* ── Body ── */}
        <div className="min-w-0">
          {subtitle ? (
            <>
              {/* 1) name — no truncation, wraps naturally */}
              <h4
                className="ttw-type-h6 text-[#0B1220] m-0 leading-[1.1] break-words"
                style={{ fontWeight: 600 }}
              >
                {name}
              </h4>

              {/* 2) Row: [left: one-liner] [right: confirmed/reserved].
                  Row height = content height (no stretch). The left side wraps
                  naturally; the right side stays pinned, never grows in height. */}
              <div className="-mt-[1px] flex items-baseline justify-between gap-3">
                {/* LEFT: one-liner, wrapping */}
                <div className="min-w-0 flex-1 leading-[1.1] break-words">
                  <span
                    className="ttw-type-small text-[#4A566E] align-middle"
                    style={{ fontSize: "11.5px", lineHeight: 1.1 }}
                  >
                    {subtitle}
                  </span>
                </div>

                {/* RIGHT: confirmed / reserved — fixed-content, no height stretch */}
                {statusBadge}
              </div>

              {/* 3) Tags on their own line below the one-liner */}
              {tagGroup && <div className="mt-[5px]">{tagGroup}</div>}
            </>
          ) : (
            <>
              {/* No one_liner: name on the left, status pinned right and
                  baseline-aligned with the title's first line. */}
              <div className="flex items-baseline justify-between gap-3">
                <h4
                  className="ttw-type-h6 text-[#0B1220] m-0 leading-[1.2] break-words min-w-0 flex-1"
                  style={{ fontWeight: 600 }}
                >
                  {name}
                </h4>
                {statusBadge}
              </div>
              {tagGroup && <div className="mt-[3px]">{tagGroup}</div>}
            </>
          )}
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
     <div className="flex sm:flex-row flex-col border-b border-[#ECECEC] last:border-b-0 w-full justify-center">

        {/* COL 1: Day number + date — matches HTML .day-num-block */}
        <div className="sm:w-fit w-full shrink-0 pl-4 pr-2 sm:pr-0 sm:pt-6 pt-4 sm:pb-6 pb-2 flex sm:flex-col flex-row sm:items-start items-baseline gap-3 sm:min-w-[64px]">
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
        <div className="flex-1 sm:pr-4 px-[0.3rem] md:px-4 sm:pt-6 md:pt-4 pb-4 sm:pb-6 min-w-0">

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
                      { scroll: false, shallow: true },
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
    source={showActivityDetails.source}
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