import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { IoMenu, IoLocationSharp, IoCar } from "react-icons/io5";
import { IoMdTrain, IoMdBoat } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import {
  MdDone,
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlineFlightTakeoff,
} from "react-icons/md";
import { BiSolidLeftArrow } from "react-icons/bi";
import { FaInfoCircle, FaBus } from "react-icons/fa";
import { FaCirclePlus, FaCircleMinus, FaCalendarDays } from "react-icons/fa6";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  parseISO,
  addMonths,
  isSameDay,
  addDays,
  differenceInDays,
} from "date-fns";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
import { SingleDatePicker } from "react-dates";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useMediaQuery from "../../../../components/media";
import { logEvent } from "../../../../services/ga/Index";
import axiossearchinstance from "../../../../services/search/searchsuggest";
import axiossearchstartinginstance from "../../../../services/search/startinglocation";
import axiosItineraryUpdateInstance, {
  axiosMercuryItineraryUpdateInstance,
} from "../../../../services/itinerary/update";
import { getDate, getDateString } from "../../../../helper/DateUtils";
import { dateFormat } from "../../../../helper/DateUtils";
import { openNotification } from "../../../../store/actions/notification";
import setItinerary from "../../../../store/actions/itinerary";
import { TbArrowBack } from "react-icons/tb";

import setItineraryStatus from "../../../../store/actions/itineraryStatus";
import Spinner from "../../../loaderbar/Index";
import { axiosGetItineraryStatus } from "../../../../services/itinerary/daybyday/preview";
import { PulseLoader } from "react-spinners";
import useDebounce from "../../../../hooks/useDebounce";
import { useHandleClose } from "../../../../hooks/useHandleClose";
import { getDaysDifference } from "../../../../services/isDateDDMMYYY";
import Button from "../../../../components/ui/button/Index";
import { CustomMapPin } from "../../../../components/tailoredform/utils/slideTwoActions";
import { useChatContext } from "../../../../components/Chatbot/context/ChatContext";
import { resetChatSession } from "../../../../store/actions/chatState";
import { Navigation } from "../../../../components/NewNavigation";
import { useAnalytics } from "../../../../hooks/useAnalytics";
import { useRouter } from "next/router";
import NavigationMenu from "../../../../components/revamp/home/NavigationMenu";

const Container = styled.div`
  position: relative;
  

  .SingleDatePicker {
    width: 100%;
  }
  .SingleDatePickerInput_1 {
    border: none;
    display: flex;
    gap: 22px;
    background: initial;
  }
  .DateInput {
    width: 100%;
    border: 1px solid #d0d5dd;
    box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
    border-radius: 8px;
    overflow: hidden;
  }
  .DateInput > input {
    font-family: lexend;
    font-weight: 450;
    font-size: 0.9rem;
    padding:5px;
  }
  .DayPicker__withBorder {
    @media screen and (max-width: 768px) {
      border: none;
      -webkit-box-shadow: none;
      box-shadow: none;
      width: 320px;
      margin: auto;
    }
  }
  .SingleDatePickerInput_arrow,
  .DayPickerKeyboardShortcuts_buttonReset {
    display: none !important;
  }

  .SingleDatePicker_picker_1 {
    left: 0px;
    top: 48px !important;
    @media screen and (min-width: 768px) {
      left: 0px !important;
      right: 0px !important;
      top: 55px !important;
  }
  .CalendarDay {
    border: 0px;
  }
  .CalendarDay__selected,
  .CalendarDay__selected:hover {
    background-color: #f7e700;
    border: 0px;
    color: black;
  }
  .CalendarDay__selected_span,
  .CalendarDay__hovered_span,
  .CalendarDay__hovered_span_3 {
    background-color: #f7e70033;
    color: black;
    &:active {
      background-color: #f7e700;
      opacity: 0.7;
      border: none;
    }
    &:hover {
      color: black;
      background-color: #f7e7004a;
      border: none;
    }
  }

  .DateInput_input__focused {
    
  }
  .DayPickerKeyboardShortcuts_show__topRight {
    display: none;
  }
`;

const CalenderIcons = styled.div`
  position: absolute;
  top: 0%;
  right: 0%;
  pointer-events: none;
  font-size: 20px;
  z-index: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Icon = styled.div`
  width: 100%;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: end;
  margin-right: 5px;
  margin-top: -5px;
  color: gray;
  font-weight: 600;
`;

const CITY_COLOR_CODES = [
  "#359EBF", // shade of blue
  "#F0C631", // shade of yellow
  "#BF3535", // shade of red
  "#47691e", // shade of green
  "#cc610a", // shade of orange
  "#008080", // shade of teal
  "#7d5e7d", // shade of purple
];
const FloatingView = styled.div`
  position: sticky;
  bottom: 60px;
  left: 100%;
  background: black;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  z-index: 2;
  cursor: pointer;
`;
// Sized by its top/bottom offsets rather than a fixed height: a row grows with
// the transfer chips under it (and with a city name that wraps), and a
// fixed-height connector stops short of the next pin whenever it does.
const DottedRail = styled.div`
  width: 2px;
  background-image: repeating-linear-gradient(
    to bottom,
    gray 0,
    gray 2px,
    transparent 1px,
    transparent 6px
  );
`;

// ── Read-only route preview ─────────────────────────────────────────────────
// The chat route tab opens on a preview, not a form. It is the *same* list —
// same pins, same city lines, same dotted rail — rendered by the same
// <Destination>; the two states differ in exactly one pair of things: the
// preview shows the transfer leaving each stop (as chips, the way the route
// widget Kaira posts in chat does) and no edit affordances, the editor shows
// the drag handles / pencils / bins and no transfers. Transfers are hidden
// while editing because an unsaved reorder invalidates them.

// Order matters — first match wins. Kept off "air" on purpose: an airport taxi
// carries it too, and it would be labelled a flight. Colors are the transport
// accents the chat widget's transfer badges already use
// (TRANSPORT_BADGE_STYLES in components/bot-components/components/WidgetRenderer.tsx),
// so a mode reads the same shade wherever it shows up.
const TRANSFER_MODES = [
  {
    test: /flight/i,
    label: "Flight",
    Icon: MdOutlineFlightTakeoff,
    color: "#00838F",
  },
  { test: /train|rail/i, label: "Train", Icon: IoMdTrain, color: "#5E35B1" },
  {
    test: /ferry|boat|cruise/i,
    label: "Ferry",
    Icon: IoMdBoat,
    color: "#1565C0",
  },
  { test: /bus|coach/i, label: "Bus", Icon: FaBus, color: "#E65100" },
  {
    test: /taxi|car|cab|sedan|suv|self.?drive/i,
    label: "Private taxi",
    Icon: IoCar,
    color: "#00838F",
  },
];

function transferModeMeta(raw) {
  const t = (raw ?? "").toString().trim();
  const hit = TRANSFER_MODES.find((m) => m.test.test(t));
  if (hit) return hit;
  return {
    label: t ? t.charAt(0).toUpperCase() + t.slice(1) : "Transfer",
    Icon: null,
    color: "#6B7280",
  };
}

// A transfer's duration in minutes, from whichever field the booking carries:
// a top-level numeric `duration`, flight segments, or the road-transfer
// `transfer_details.duration` ({ text, value: seconds }). Mirrors the same
// resolution order the transfer card uses (containers/itinerary/VerticalLayout.js).
function transferDurationMins(booking) {
  const top = Number(booking?.duration);
  if (top > 0) return top;

  const segs = booking?.transfer_details?.items?.[0]?.segments;
  if (Array.isArray(segs) && segs.length) {
    const dep = segs[0]?.origin?.departure_time;
    const arr = segs[segs.length - 1]?.destination?.arrival_time;
    const depMs = dep ? new Date(dep).getTime() : NaN;
    const arrMs = arr ? new Date(arr).getTime() : NaN;
    if (!isNaN(depMs) && !isNaN(arrMs) && arrMs > depMs) {
      return Math.round((arrMs - depMs) / 60000);
    }
    const sum = segs.reduce((s, seg) => s + (Number(seg?.duration) || 0), 0);
    if (sum > 0) return sum;
  }

  const dd = booking?.transfer_details?.duration;
  const text = typeof dd === "string" ? dd : dd?.text || "";
  if (text) {
    const h = (text.match(/(\d+)\s*h/i) || [])[1];
    const m = (text.match(/(\d+)\s*m/i) || [])[1];
    const mins = parseInt(h || 0, 10) * 60 + parseInt(m || 0, 10);
    if (mins > 0) return mins;
  }

  const secs = Number(dd?.value);
  if (secs > 0) return Math.round(secs / 60);
  return 0;
}

function shortDuration(mins) {
  const m = Number(mins) || 0;
  if (m <= 0) return "";
  const h = Math.floor(m / 60);
  const rem = Math.round(m % 60);
  if (h && rem) return `${h}h ${rem}m`;
  if (h) return `${h}h`;
  return `${rem}m`;
}

// Endpoint stops (the start / end city) are keyed in TransferBookings by their
// gmaps place id, every other stop by its itinerary_city_id — the same pairing
// the day-by-day builds its `origin:destination` keys from
// (containers/itinerary/DaybyDay.jsx).
function stopTransferKey(dest) {
  const cityData = dest?.cityData;
  if (!cityData) return null;
  if (dest.startingCity || dest.endingCity) {
    return cityData.gmaps_place_id || cityData.place_id || null;
  }
  return cityData.id ?? null;
}

// The transfer leaving `from` for `to`: its mode chips (one per leg, so a
// train-then-flight combo reads as two) plus whether an airport drop at the
// origin / pickup at the destination has been planned.
function buildRouteLeg(from, to, transferBookings) {
  const originKey = stopTransferKey(from);
  const destKey = stopTransferKey(to);

  const intercity =
    originKey && destKey
      ? transferBookings?.intercity?.[`${originKey}:${destKey}`]
      : null;

  const hasBooking = !!intercity && Object.keys(intercity).length > 0;
  const legs = !hasBooking
    ? []
    : Array.isArray(intercity.children) && intercity.children.length > 1
      ? intercity.children
      : [intercity];

  const modes = legs
    .map((leg, i) => {
      const meta = transferModeMeta(leg?.booking_type || leg?.transfer_type);
      return {
        key: leg?.id ?? `${meta.label}-${i}`,
        label: meta.label,
        Icon: meta.Icon,
        color: meta.color,
        duration: shortDuration(transferDurationMins(leg)),
      };
    })
    .filter((m) => !!m.label);

  const hasDrop = (transferBookings?.airport?.[originKey] || []).some(
    (b) => b?.is_airport_drop
  );
  const hasPickup = (transferBookings?.airport?.[destKey] || []).some(
    (b) => b?.is_airport_pickup
  );

  return { modes, hasDrop, hasPickup };
}

// One leg of travel — mode + how long it takes. Flat: no border, no shadow, so
// a stack of them under a city reads as one quiet block rather than cards.
const RouteTransferChip = ({ mode }) => {
  const { Icon } = mode;
  return (
    <span className="inline-flex max-w-full items-center gap-[6px] rounded-full bg-[#F2F3F0] px-[10px] py-[4px] leading-[1.3]">
      {Icon ? (
        <Icon size={14} color={mode.color} className="shrink-0" />
      ) : null}
      <span className="font-inter text-[12px] font-semibold text-[#0B1220]">
        {mode.label}
      </span>
      {mode.duration ? (
        <span className="font-inter text-[12px] text-[#9AA2AD]">
          {mode.duration}
        </span>
      ) : null}
    </span>
  );
};

// Airport pickup / drop ride attached to the leg. Tinted rather than grey so it
// reads as an add-on to the leg, not another mode of getting there.
const RouteTransferTag = ({ label }) => (
  <span className="inline-flex items-center gap-[4px] rounded-full bg-[#F0F5FE] px-[9px] py-[4px] font-inter text-[12px] font-medium leading-[1.3] text-[#1D6FE0]">
    <IoCar size={12} className="shrink-0" />
    {label}
  </span>
);

// The transfer row under a stop, indented to start exactly where that stop's
// city name does: the drag-handle gutter, then the pin, then the text column.
// (Endpoint pins are the 24px black dot with its 4px inset; every other stop
// gets the 32px map pin.)
const RouteTransferRow = ({ leg, isEndpoint }) => (
  <div className="w-full flex flex-row items-start gap-1 sm:gap-3 mt-[8px] relative z-10">
    <div className={`${isEndpoint ? "w-[28px]" : "w-[32px]"} shrink-0`} />
    <div className="min-w-0 flex-1 flex flex-wrap items-center gap-[6px]">
      {leg.modes.map((mode) => (
        <RouteTransferChip key={mode.key} mode={mode} />
      ))}
      {leg.hasDrop && <RouteTransferTag label="Drop" />}
      {leg.hasPickup && <RouteTransferTag label="Pickup" />}
    </div>
  </div>
);

// Same rows as the editor, minus its controls, plus the transfers. Rendering
// through <Destination> is what keeps the two states visually identical.
export const RoutePreview = ({ destinations, transferBookings }) => (
  <div className="w-full flex flex-col relative">
    {destinations.map((dest, index) => {
      const cityData = dest?.cityData || {};
      const isLast = index === destinations.length - 1;
      return (
        <Destination
          key={`${cityData.id ?? cityData.city_id ?? cityData.city_name}-${index}`}
          readOnly
          index={index}
          startingCity={dest?.startingCity}
          endingCity={dest?.endingCity}
          cityData={cityData}
          pinColour={cityData?.color}
          totalDestinations={destinations.length}
          leg={
            isLast
              ? null
              : buildRouteLeg(dest, destinations[index + 1], transferBookings)
          }
        />
      );
    })}
  </div>
);

const RouteEditSection = (props) => {
  const isDesktop = useMediaQuery("(min-width:768px)");
  const dispatch = useDispatch();
  const handleClose = useHandleClose();
  const router = useRouter();
  const [startDate, setStartDate] = useState(
    getDate(props?.plan ? props?.plan.start_date : props?.itinerary?.start_date)
  );
  const [endDate, setEndDate] = useState(
    getDate(props?.plan ? props?.plan.end_date : props?.itinerary?.end_date)
  );

    const [destinations, setDestinations] = useState([]);
  // Track the last upstream dates we've synced from so we only overwrite
  // local state when the source actually changes (chat regenerating an
  // itinerary in place, props swapping on tab/thread switch). Without this,
  // a stale `prev || next` guard kept dates from a previously loaded trip,
  // and an unconditional sync would clobber `endDate` every time the user
  // edits destinations (updateDestinationsDates calls props.setEndDate).
  const lastSyncedSourceRef = useRef({ start: null, end: null });
  useEffect(() => {
    const sourceStart = getDate(
      props?.plan ? props?.plan.start_date : props?.itinerary?.start_date
    );
    const sourceEnd = getDate(
      props?.plan ? props?.plan.end_date : props?.itinerary?.end_date
    );
    const synced = lastSyncedSourceRef.current;

    const startChanged = sourceStart && sourceStart !== synced.start;
    const endChanged = sourceEnd && sourceEnd !== synced.end;

    // Hydration fallback for chat-built drafts: itinerary itself has no
    // start/end yet, but destinations[].checkin/checkout_date have landed.
    // Only fill in when local state is still empty so we don't fight user
    // edits to endDate via updateDestinationsDates.
    const fallbackStart = !sourceStart
      ? destinations?.[0]?.cityData?.checkin_date
      : null;
    const lastDest = destinations?.[destinations.length - 1]?.cityData;
    const fallbackEnd = !sourceEnd
      ? lastDest?.checkout_date || lastDest?.checkin_date
      : null;

    if (startChanged) {
      setStartDate(sourceStart);
    } else if (fallbackStart) {
      setStartDate((prev) => prev || fallbackStart);
    }
    if (endChanged) {
      setEndDate(sourceEnd);
    } else if (fallbackEnd) {
      setEndDate((prev) => prev || fallbackEnd);
    }

    if (sourceStart) synced.start = sourceStart;
    if (sourceEnd) synced.end = sourceEnd;
  }, [
    props?.plan?.start_date,
    props?.plan?.end_date,
    props?.itinerary?.start_date,
    props?.itinerary?.end_date,
    destinations,
  ]);

  const [editDestination, setEditDestination] = useState(
    props.editRoute === "editDates" ? false : true
  );
  const [destinationChanges, setDestinationChanges] = useState(false);
  const [isValidDates, setIsValidDates] = useState(true);
  const [invalidDateError, setInvalidDateError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itineraryLoading, setItineraryLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  // Hold the interval id in a ref so the polling teardown isn't dependent on
  // re-renders (state updates are batched and the cleanup needs the latest id).
  const pollingIntervalRef = useRef(null);
  const destinationRef = useRef(null);
  const itinerary = useSelector((state) => state.Itinerary);
  const [waitingForStatusUpdate, setWaitingForStatusUpdate] = useState(false);
  const { itinerary_status, transfers_status, pricing_status, hotels_status } =
    useSelector((state) => state.ItineraryStatus);
  const [activeRouteTab, setActiveRouteTab] = useState("Route");
  const {
      trackSectionViewed,
    } = useAnalytics();

  // Chat's Route tab (BotApp → "Change Route") opens on the read-only preview
  // and only becomes a form on demand. The standalone itinerary page keeps its
  // always-editable list, so every preview-only branch below is gated on this.
  const chatRouteTab = !!props.chatRouteTab;
  // MenuV2 keeps this tab mounted behind a display:none wrapper when the user
  // is on Itinerary/Bookings. That hid the action bar for free — until it was
  // portalled to <body> — so the tab's own visibility has to be a prop now.
  const routeTabActive = props.routeTabActive !== false;
  const [isEditing, setIsEditing] = useState(false);

  // The "Update Route" bar owns the bottom of the screen for the whole editing
  // session — from the tap on Edit, greyed out, until the edit is saved or the
  // tab is left. That is state no ancestor can observe, so announce it: BotApp
  // re-measures the stack its "Back to itinerary" pill sits above, and the
  // mobile layout hands the bottom slot over, hiding its own View Cart bar for
  // as long as `visible` holds so the two never stack.
  useEffect(() => {
    const announce = (visible) => {
      // Redux carries the flag the mobile layout swaps its View Cart bar on: a
      // subscriber re-renders reliably, where a window listener can simply miss
      // an event it mounted too late to hear. The event stays alongside it —
      // it's a "re-measure now" ping for BotApp's bottom-stack, not state.
      dispatch(setItineraryStatus("route_bar_active", visible));
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("route-action-bar-change", { detail: { visible } })
        );
      }
    };
    announce(!!(chatRouteTab && routeTabActive && isEditing));
    return () => announce(false);
  }, [isEditing, chatRouteTab, routeTabActive, dispatch]);

  // The Update Route bar is `fixed`, so it can't inherit the itinerary panel's
  // box — and on desktop that panel's left edge moves with the (collapsible)
  // sidebar, so no percentage width can express it. Measure the scroll pane
  // this section lives in and hand the bar its exact left/width, which is what
  // BotApp does for the View Cart bar (its ctaBarStyle) and what makes the two
  // bars share one edge. Falls back to the Tailwind widths when no pane is
  // found (the standalone itinerary page, SSR).
  const routeSectionRef = useRef(null);
  const [actionBarStyle, setActionBarStyle] = useState(undefined);
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const findPane = () => {
      let node = routeSectionRef.current?.parentElement;
      while (node && node !== document.body) {
        const overflowY = window.getComputedStyle(node).overflowY;
        if (overflowY === "auto" || overflowY === "scroll") return node;
        node = node.parentElement;
      }
      return null;
    };

    const pane = findPane();
    const measure = () => {
      if (!pane) {
        setActionBarStyle(undefined);
        return;
      }
      const rect = pane.getBoundingClientRect();
      if (!rect.width) {
        setActionBarStyle(undefined);
        return;
      }
      setActionBarStyle({ left: rect.left, width: rect.width, right: "auto" });
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (pane) ro.observe(pane);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isDesktop, isEditing]);

  const items = [
  { id: 1, label: "Route", link: "Route" },
  { id: 2, label: "Itinerary", link: "Itenary" },
  { id: 3, label: "Bookings", link: "Booking" },
];


  // const { resetSession } = useChatContext();

  function addDaysToDate(dateString, daysToAdd) {
    const date = new Date(dateString);

    date.setDate(date.getDate() + daysToAdd);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  useEffect(() => {
    const cities = [];

    if (props?.routes && itinerary?.start_date) {
      const formatDate = (dateObj) => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      };

      let currentCheckinDate = new Date(itinerary.start_date);

      for (let i = 0; i < props.routes.length; i += 1) {
        const isFirst = i === 0;
        const isLast = i === props.routes.length - 1;

        // --- Duration Logic (same as your original) ---
        const duration = (() => {
          if (isFirst || isLast) {
            return props?.routes[i]?.duration || 0;
          }

          return props?.routes[i]?.duration;
        })();

        // --- Checkin/Checkout based on calculated duration ---
        const checkin_date =
          i === 1
            ? formatDate(new Date(itinerary.start_date))
            : formatDate(currentCheckinDate);
        const checkoutDateObj = addDays(currentCheckinDate, duration);
        const checkout_date = formatDate(checkoutDateObj);

        cities.push({
          startingCity: isFirst,
          endingCity: isLast,
          cityData: {
            ...props.routes[i],
            city_name:
              props.routes[i]?.city_name || props.routes[i]?.city?.name,
            checkin_date,
            checkout_date,
            city_id: props?.routes[i]?.city_id || props?.routes[i]?.city?.id,
            place_id:
              props.routes[i]?.place_id || props.routes[i]?.gmaps_place_id,
            duration,
            id: props?.routes[i]?.hasOwnProperty("id")
              ? props?.routes[i]?.id
              : null,
            color: CITY_COLOR_CODES[i % 7],
            lat:
              props?.routes[i]?.lat ||
              props?.routes[i]?.latitude ||
              props?.routes[i]?.city?.latitude,
            long:
              props?.routes[i]?.long ||
              props?.routes[i]?.longitude ||
              props?.routes[i]?.city?.longitude,
            nights: duration,
          },
        });

        currentCheckinDate = checkoutDateObj;
      }

      setDestinations(cities);
    }
  }, [props.routes, itinerary?.start_date]);

  // console.log("Cities",destinations)

  //   useEffect(() => {
  //   const cities = [];

  //   if (props?.routes && itinerary?.start_date) {
  //     const formatDate = (dateObj) => {
  //       const year = dateObj.getFullYear();
  //       const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  //       const day = String(dateObj.getDate()).padStart(2, '0');
  //       return `${year}-${month}-${day}`;
  //     };

  //     const addDays = (date, days) => {
  //       const result = new Date(date);
  //       result.setDate(result.getDate() + days);
  //       return result;
  //     };

  //     const getDaysDifference = (startDate, endDate) => {
  //       const start = new Date(startDate);
  //       const end = new Date(endDate);
  //       const diffTime = end.getTime() - start.getTime();
  //       return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //     };

  //     let currentCheckinDate = new Date(itinerary.start_date);

  //     for (let i = 0; i < props.routes.length; i += 1) {
  //       const isFirst = i === 0;
  //       const isLast = i === props.routes.length - 1;

  //       // --- Duration Logic (same as your original) ---
  //       const duration = (() => {
  //         if (isFirst || isLast) {
  //           return props?.routes[i]?.duration || 0;
  //         }

  //         if (i === 1) {
  //           const endDate = props?.routes[i]?.end_date;
  //           const startDate = itinerary?.start_date;

  //           if (startDate && endDate) {
  //             return getDaysDifference(startDate, endDate) || props?.routes[i]?.duration || 1;
  //           }

  //           return props?.routes[i]?.duration || 1;
  //         }

  //         const endDate = props?.routes[i]?.end_date;
  //         const startDate = props?.routes[i - 1]?.end_date;

  //         if (startDate && endDate) {
  //           return getDaysDifference(startDate, endDate) || props?.routes[i]?.duration || 1;
  //         }

  //         return props?.routes[i]?.duration || 1;
  //       })();

  //       // --- Checkin/Checkout based on duration ---
  //       const checkin_date = formatDate(currentCheckinDate);
  //       const checkoutDateObj = addDays(currentCheckinDate, duration);
  //       const checkout_date = formatDate(checkoutDateObj);

  //       cities.push({
  //         startingCity: isFirst,
  //         endingCity: isLast,
  //         cityData: {
  //           ...props.routes[i],
  //           city_name: props.routes[i]?.city_name || props.routes[i]?.city?.name,
  //           checkin_date,
  //           checkout_date,
  //           city_id: props?.routes[i]?.city_id || props?.routes[i]?.city?.id,
  //           place_id: props.routes[i]?.place_id || props.routes[i]?.gmaps_place_id,
  //           duration,
  //           id: props?.routes[i]?.hasOwnProperty("id") ? props?.routes[i]?.id : null,
  //           color: CITY_COLOR_CODES[i % 7],
  //           lat: props?.routes[i]?.lat || props?.routes[i]?.latitude || props?.routes[i]?.city?.latitude,
  //           long: props?.routes[i]?.long || props?.routes[i]?.longitude || props?.routes[i]?.city?.longitude,
  //           nights: duration,
  //         },
  //       });

  //       currentCheckinDate = checkoutDateObj;
  //     }

  //     setDestinations(cities);
  //   }
  // }, [props.routes, itinerary?.start_date]);

  useEffect(() => {
    if (!destinations.length) return;
    const error = getDateError();
    setInvalidDateError(error);
    setIsValidDates(!error);
  }, [destinations, startDate, endDate]);

  useEffect(() => {
    if (waitingForStatusUpdate) {
      const allStatusesCompleted = [
        itinerary_status,
        transfers_status,
        pricing_status,
        hotels_status,
      ].every((status) => status === "SUCCESS" || status === "FAILURE");

      if (allStatusesCompleted) {
        dispatch(setItineraryStatus("finalized_status", "SUCCESS"));
        setItineraryLoading(false);
        setWaitingForStatusUpdate(false);
        // The edits are now the saved route: drop the unsaved-changes flag (it
        // is what keeps the Update Route bar on screen) and fall back to the
        // preview, where the freshly recomputed transfers can be read.
        setDestinationChanges(false);
        setIsEditing(false);
        dispatch(
          openNotification({
            type: "success",
            text: "Itinerary has been updated successfully.",
            heading: "Sucess!",
          })
        );
        handleClose();
      }
    }
  }, [
    itinerary_status,
    transfers_status,
    pricing_status,
    hotels_status,
    itineraryLoading,
    waitingForStatusUpdate,
  ]);

  const stopStatusPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setPolling(false);
    // Re-enable the chat composer (ChatKitPanel reads is_polling).
    dispatch(setItineraryStatus("is_polling", false));
  };

  const fetchItineraryStatus = async (itineraryId) => {
    try {
      const res = await axiosGetItineraryStatus.get(`/${itineraryId}/status/`);
      const status = res.data?.celery;
      dispatch(
        setItineraryStatus("pricing_status", status?.PRICING || "PENDING")
      );
      dispatch(
        setItineraryStatus("transfers_status", status?.TRANSFERS || "PENDING")
      );
      dispatch(
        setItineraryStatus("hotels_status", status?.HOTELS || "PENDING")
      );
      dispatch(
        setItineraryStatus("itinerary_status", status?.ITINERARY || "PENDING")
      );
      // Also surface display_text + notes so the chat panel's BottomCTABar
      // can render <ItineraryStatusLoader/> while the backend recomputes.
      dispatch(setItineraryStatus("display_text", status?.display_text || null));
      dispatch(setItineraryStatus("notes", status?.notes || []));

      // Stop polling once every backend task has terminated. The
      // waitingForStatusUpdate effect will then surface the success
      // notification and close the drawer.
      const allDone = ["PRICING", "TRANSFERS", "HOTELS", "ITINERARY"].every(
        (key) => status?.[key] === "SUCCESS" || status?.[key] === "FAILURE"
      );
      if (allDone) {
        stopStatusPolling();
        await fetchItinerary();
      }
    } catch (err) {
      console.error("[ERROR]: axiosGetItineraryStatus: ", err.message);
      stopStatusPolling();
    }
  };

  const fetchItinerary = async () => {
    try {
      if (props?.resetRef) {
        await props.resetRef();
      }

      if (props.fetchData) {
        await props.fetchData(true);
      }

      dispatch(resetChatSession());
    } catch (error) {
      console.error("Error in fetchItinerary:", error);
    }
  };

  const startStatusPolling = (itineraryId) => {
    if (!itineraryId) return;
    // Guard against double-start (e.g. rapid duplicate save clicks).
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    // In chat, the recompute is already narrated by the itinerary's own status
    // loader in the bottom bar, so this section skips its blocking spinner and
    // hands the traveller back to the itinerary — the surface that is actually
    // being rebuilt. Everywhere else the spinner still covers the route list.
    if (chatRouteTab) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("route-update-started"));
      }
    } else {
      setItineraryLoading(true);
    }
    setPolling(true);
    setWaitingForStatusUpdate(true);
    // Reset statuses to PENDING and lock the chat composer immediately so
    // the user can't keep typing while the backend recomputes.
    dispatch(setItineraryStatus("itinerary_status", "PENDING"));
    dispatch(setItineraryStatus("transfers_status", "PENDING"));
    dispatch(setItineraryStatus("hotels_status", "PENDING"));
    dispatch(setItineraryStatus("pricing_status", "PENDING"));
    dispatch(setItineraryStatus("is_polling", true));

    // Fire once immediately so we don't pay the full interval delay before
    // the first status read, then keep polling until everything resolves.
    fetchItineraryStatus(itineraryId);
    pollingIntervalRef.current = setInterval(() => {
      fetchItineraryStatus(itineraryId);
    }, 4000);
  };

  // Cleanup the polling interval if the user navigates away mid-update
  // (e.g. closes the drawer) so we don't leak timers. Also unlocks the
  // chat composer — keeping is_polling true after the drawer is gone
  // would leave the chat permanently disabled.
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        dispatch(setItineraryStatus("is_polling", false));
      }
    };
  }, [dispatch]);

  // Why this route can't be saved, phrased for the traveller — or null when the
  // dates are fine. Deliberately pure: it used to set state as a side effect,
  // which meant callers ran it two or three times per click just to read the
  // answer, each run re-setting the message. Callers own the state now.
  //
  // The old messages ("Invalid date selected for starting city New Delhi") also
  // never reached anyone: nothing in the chat Route tab rendered them, so a
  // failed check looked exactly like a dead button.
  const getDateError = () => {
    if (!destinations.length) return null;

    const cityLabel = (dest) =>
      dest?.cityData?.city_name ||
      dest?.cityData?.name ||
      dest?.cityData?.text ||
      "this stop";

    const onDay = (value) => {
      const parsed = value ? new Date(getDate(value)) : null;
      return parsed && !isNaN(parsed.getTime())
        ? format(parsed, "d MMM yyyy")
        : "";
    };

    // Returned as a title + hint pair, both short: the action bar shows them on
    // the same two lines its normal state uses, so raising a problem doesn't
    // change the bar's height or wrap a paragraph beside the button.
    const today = new Date();

    if (!startDate || isNaN(Date.parse(startDate))) {
      return {
        title: "Trip dates missing",
        hint: "Update your travel dates to save",
      };
    }
    const start = new Date(startDate);
    if (!isSameDay(start, today) && start < today) {
      return {
        title: "Trip dates have passed",
        hint: `Starts ${onDay(startDate)} — update your dates`,
      };
    }

    let prevDate = start;

    for (let i = 1; i < destinations.length - 1; i++) {
      const city = cityLabel(destinations[i]);
      const checkin = getDate(destinations[i].cityData.checkin_date);
      const checkout = getDate(destinations[i].cityData.checkout_date);

      if (!checkin || isNaN(Date.parse(checkin))) {
        return {
          title: `Dates don't add up at ${city}`,
          hint: "Check the nights on each stop",
        };
      }
      const arrival = new Date(checkin);
      if (!isSameDay(arrival, prevDate) && arrival < prevDate) {
        return {
          title: `Stops overlap at ${city}`,
          hint: "Adjust the nights on these stops",
        };
      }

      if (!checkout || isNaN(Date.parse(checkout))) {
        return {
          title: `Dates don't add up at ${city}`,
          hint: "Check the nights on each stop",
        };
      }
      const departure = new Date(checkout);
      if (!isSameDay(departure, arrival) && departure < arrival) {
        return {
          title: `${city} ends before it begins`,
          hint: "Adjust the nights on this stop",
        };
      }

      prevDate = departure;
    }

    if (!endDate || isNaN(Date.parse(endDate))) {
      return {
        title: "Trip dates missing",
        hint: "Update your travel dates to save",
      };
    }
    const end = new Date(endDate);
    if (!isSameDay(end, prevDate) && end < prevDate) {
      return {
        title: "Stops run past your end date",
        hint: `Ends ${onDay(endDate)} — shorten a stop`,
      };
    }

    return null;
  };

  const submitData = () => {
    const data = {
      // itinerary_id: props.ItineraryId || props?.itinerary?.ItineraryId,
      start_date: startDate,
      basic_route: destinations
        .map((dest) => {
          return {
            name:
              dest.cityData.city_name ||
              dest.cityData.name ||
              dest.cityData.text,
            city_id: dest.cityData.city_id || dest.cityData.resource_id,
            // check_in: dest.cityData.checkin_date,
            // check_out: dest.cityData.checkout_date,
            id: dest.cityData?.hasOwnProperty("id") ? dest.cityData?.id : null,
            duration: dest.cityData?.nights || dest.cityData?.duration,
            start_date: dest.cityData.checkin_date || startDate,
          };
        })
        .filter(
          (dest, index) => index !== 0 && index !== destinations.length - 1
        ),
      user_location: {
        place_id: destinations[0].cityData.place_id,
      },
      end_location: {
        place_id: destinations[destinations.length - 1].cityData.place_id,
      },
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${props.token}`,
    };

    if (!props?.mercuryItinerary) {
      axiosItineraryUpdateInstance
        .post("", data, { headers })
        .then((response) => {
          if (response?.data) {
            dispatch(setItinerary(response.data));
          }
          setLoading(false);
          const itineraryId =
            props.ItineraryId || props?.itinerary?.ItineraryId;
          startStatusPolling(itineraryId);
          // handleClose is intentionally deferred — the waiting-for-status
          // effect closes the drawer once polling completes so the spinner
          // stays mounted while the backend tasks finish.
        })
        .catch((err) => {
          setLoading(false);
          setItineraryLoading(false);
          if (err?.response?.status === 403) {
            props.openNotification({
              text: err?.response?.data?.messages?.[0] || "You are not allowed to make changes to this itinerary",
              text: err?.response?.data?.messages?.[0] || "You are not allowed to make changes to this itinerary",
              heading: "Error!",
              type: "error",
            });
          } else if (err?.response?.status === 400) {
            props.openNotification({
              text: err?.response?.data?.messages?.[0],
              heading: "Error!",
              type: "error",
            });
          } else {
            props.openNotification({
              text: err?.response?.data?.messages?.[0] || "There seems to be a problem, please try again!",
              heading: "Error!",
              type: "error",
            });
          }
          console.log("[ERROR][Route Edit]: ", err.message);
        });
    } else {
      axiosMercuryItineraryUpdateInstance
        .post(`/${props.ItineraryId || props?.itinerary?.ItineraryId}/`, data, {
          headers,
        })
        .then((response) => {
          Object.keys(localStorage).forEach((key) => {
            if (
              key.startsWith(
                `notes_dismissed_${
                  props.ItineraryId || props?.itinerary?.ItineraryId
                }`
              )
            ) {
              localStorage.removeItem(key);
            }
          });
          dispatch(setItinerary(response.data));
          setLoading(false);
          const itineraryId =
            props.ItineraryId || props?.itinerary?.ItineraryId;
          startStatusPolling(itineraryId);
          // handleClose deferred — see non-mercury branch above.
        })
        .catch((err) => {
          setLoading(false);
          setItineraryLoading(false);
          if (err?.response?.status === 403) {
            props.openNotification({
              text: err?.response?.data?.errors?.[0]?.message?.[0] || "You are not allowed to make changes to this itinerary",
              heading: "Error!",
              type: "error",
            });
          } else if (err?.response?.status === 400) {
            props.openNotification({
              text: err?.response?.data?.errors?.[0]?.message?.[0] || err?.message,
              heading: "Error!",
              type: "error",
            });
          } else {
            props.openNotification({
              text: err?.response?.data?.errors?.[0]?.message?.[0] || "There seems to be a problem, please try again!",
              heading: "Error!",
              type: "error",
            });
          }
          console.log("[ERROR][Route Edit]: ", err.message);
        });
    }
  };

  const handleSaveButton = () => {
    if (!props.token) {
      props.setShowLoginModal(true);
      return;
    }

    const dateError = getDateError();
    setInvalidDateError(dateError);
    setIsValidDates(!dateError);

    if (!dateError) {
      // `loading` is what puts the bubble loader inside the Update Route CTA;
      // in chat that button is the only progress indicator until polling
      // starts, so the route list stays readable underneath.
      setLoading(true);
      if (!chatRouteTab) setItineraryLoading(true);
      submitData();
    }
    logEvent({
      action: "Route Edit",
      params: {
        page: "Itinerary Page",
        event_category: "Update Itinerary Routes",
        event_label: "Save",
        event_action: "Update Routes",
      },
    });
  };

  const handleOutsideClick = (event) => {
    if (
      destinationRef.current &&
      !destinationRef.current.contains(event.target)
    ) {
      // Optional call: `setPopUp` is a property the open popup hangs off its
      // own DOM node, so it is only there once that card has mounted.
      destinationRef.current.setPopUp?.();
    }
  };


const handleRouteTabClick = (label) => {
  setActiveRouteTab(label);
  
  if (label === "Itinerary" || label === "Bookings") {
    const { drawer, ...restQuery } = router.query;
    router.push({
      pathname: router.pathname,
      query: restQuery,
    }, undefined, { shallow: true }).then(() => {
      // Switch tab in parent after navigation completes
      if (props?.setActiveTab) {
        props.setActiveTab(label);
      }
    });
  }
  
  logEvent({
    action: "Route Edit Navigation",
    params: {
      page: "Itinerary Page",
      event_category: "Button Click",
      event_label: label,
      event_action: "Route Edit Navigation Bar",
    },
  });
};
 return (
  <>
    <div
      ref={routeSectionRef}
      onClick={(e) => handleOutsideClick(e)}
      className={
        props.fromChat
          ? // No h-full/overflow-y-auto: BotApp's pane is already the scroll
            // container. A nested one here is pinned to the pane's height, so
            // it scrolls even when the route fits.
            "flex flex-col items-center w-full"
          : "inset-0 flex flex-col items-center bg-white"
      }
    >
        {/* {loading && <Loader />} */}
        {/* <NavigationMenu message={"Welcome to The Tarzan Way!"}/>
        <Header
          setEdit={props.setEdit}
          title={props?.itinerary.name}
          group_type={props?.group_type || props?.itinerary?.group_type}
          duration_time={props?.duration_time || props?.itinerary?.duration}
          travellerType={props?.travellerType}
          start_date={
            props?.plan ? props?.plan.start_date : props?.itinerary?.start_date
          }
          end_date={
            props?.plan ? props?.plan.end_date : props?.itinerary?.end_date
          }
          duration={
            props?.plan
              ? props?.plan.duration_number + " " + props?.plan.duration_unit
              : props?.itinerary?.duration +
                " " +
                `${props?.itinerary?.duration > 1 ? "Nights" : "Night"}`
          }
          budget={props?.plan ? props?.plan?.budget : props?.itinerary?.budget}
          number_of_adults={
            props?.plan
              ? props?.plan?.number_of_adults
              : props?.itinerary?.number_of_adults
          }
          number_of_children={
            props?.plan
              ? props?.plan?.number_of_children
              : props?.itinerary?.number_of_children
          }
          number_of_infants={
            props?.plan
              ? props?.plan?.number_of_infants
              : props?.itinerary?.number_of_infants
          }
          setEditDestination={setEditDestination}
        />

        <div className="max-ph:hidden w-full md:w-[85%] lg:w-[85%]">
        <Navigation
          items={items}
          BarName="RouteEditTabs"
          ClickHandler={handleRouteTabClick}
          selectedItem={activeRouteTab}
          trackSectionViewed={trackSectionViewed}
        />
      </div> */}


        {itineraryLoading && <Spinner isEdit={true} />}

        {/* Chat's Route tab renders one block for both breakpoints: BotApp's
            pane is already the scroll container, and the preview ⇄ edit swap
            happens inside EditDestinations rather than per-breakpoint here. */}
        {chatRouteTab && (
          <div className="w-full">
            <EditDestinations
              destinations={destinations}
              setDestinations={setDestinations}
              destinationRef={destinationRef}
              startDate={startDate}
              setEndDate={setEndDate}
              setLocationsLatLong={props.setLocationsLatLong}
              setDestinationChanges={setDestinationChanges}
              isEditing={isEditing}
              onToggleEdit={setIsEditing}
              canToggleEdit
              // Withheld while the route has unsaved edits: the transfers were
              // planned for the saved order, so pinning them to a reordered
              // list would show legs that no longer exist. They come back once
              // Update Route re-plans them.
              transferBookings={
                destinationChanges ? null : props.transferBookings
              }
            />
          </div>
        )}

        {!chatRouteTab && !props.fromChat && !isDesktop && (
          <>
            <div
              className={`max-ph:hidden w-full md:w-[50%] flex flex-col gap-3 items-center h-[300px] md:h-[600px] px-2 mt-4`}
            >
              {props.children}

              {destinationChanges && (
                <div className="flex flex-row items-center gap-2">
                  <FaInfoCircle className="ttw-type-h2 text-yellow-500" />
                  <div className="ttw-type-body">Changes to be saved</div>
                </div>
              )}
            </div>
            <div className="w-full h-fit hide-scrollbar overflow-y-auto pb-5">
              {editDestination && !itineraryLoading ? (
                <div className="w-full relative flex flex-row justify-center gap-5 px-3">
                  <EditDestinations
                    destinations={destinations}
                    setDestinations={setDestinations}
                    destinationRef={destinationRef}
                    startDate={startDate}
                    setEndDate={setEndDate}
                    setLocationsLatLong={props.setLocationsLatLong}
                    setDestinationChanges={setDestinationChanges}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </>
        )}
        {!chatRouteTab && isDesktop && (
          <div className="w-full h-fit hide-scrollbar overflow-y-auto pb-5">
            {editDestination && !itineraryLoading ? (
              <div className="w-full flex flex-row gap-5">
                <EditDestinations
                  destinations={destinations}
                  setDestinations={setDestinations}
                  destinationRef={destinationRef}
                  startDate={startDate}
                  setEndDate={setEndDate}
                  setLocationsLatLong={props.setLocationsLatLong}
                  setDestinationChanges={setDestinationChanges}
                />
                {/* {!props.fromChat &&  isDesktop && (
                  <div className="sticky top-0 h-[50vh] w-[50%] flex flex-col gap-3 items-center">
                    {props.children}

                    {destinationChanges && (
                      <div className="flex flex-row items-center gap-2">
                        <FaInfoCircle className="ttw-type-h2 text-yellow-500" />
                        <div className="ttw-type-body">Changes to be saved</div>
                      </div>
                    )}
                  </div>
                )} */}
              </div>
            ) : (
              // <EditDates
              //   destinations={destinations}
              //   setDestinations={setDestinations}
              //   startDate={startDate}
              //   setStartDate={setStartDate}
              //   endDate={endDate}
              //   setEndDate={setEndDate}
              //   isValidDates={isValidDates}
              //   invalidDateError={invalidDateError}
              // />
              ""
            )}
          </div>
        )}

        {!itineraryLoading && (
          <div className={`w-full ${isDesktop ? "" : "px-3"}`}>
            <ActionPanel
              setEdit={props.setEdit}
              editDestination={editDestination}
              setEditDestination={setEditDestination}
              handleSaveButton={handleSaveButton}
              itineraryLoading={itineraryLoading}
              handleClose={handleClose}
              setActiveTab={props?.setActiveTab}
              destinationChanges={destinationChanges}
              chatRouteTab={chatRouteTab}
              routeTabActive={routeTabActive}
              isEditing={isEditing}
              barStyle={actionBarStyle}
              saving={loading}
              dateError={invalidDateError}
            />
          </div>
        )}

        {/* {!isDesktop && (
          <FloatingView>
            <TbArrowBack
              style={{ height: "28px", width: "28px" }}
              cursor={"pointer"}
              onClick={
                editDestination
                  ? () => handleClose()
                  : () => setEditDestination(true)
              }
            />
          </FloatingView>
        )} */}
      </div>
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    notificationText: state.Notification.text,
    token: state.auth.token,
    ItineraryId: state.ItineraryId,
    itinerary: state.Itinerary,
    plan: state.Plan,
    // routes: state.ItineraryRoutes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openNotification: (payload) => dispatch(openNotification(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(RouteEditSection);

const Header = (props) => {
  const convertDFormat = (dt) => {
    try {
      const date = parseISO(dt);
      const formattedDate = format(date, "MMMM do");
      return formattedDate;
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="w-full md:w-[85%] p-3 border-b-2 border-b-gray-200 space-y-5">
      <h1 className="ttw-type-h3 md:ttw-type-h1 lg:ttw-type-h1 font-semibold">
        {props?.title}
      </h1>
      <div className="flex flex-row pb-3 gap-5 ttw-type-body items-center justify-start overflow-x-auto text-nowrap">
        <div className="flex flex-col gap-1">
          <div className="ttw-type-body text-gray-500">Group Type</div>
          <div className="flex flex-row gap-2">
            {props?.group_type}
            <span>
              (
              {props.number_of_adults
                ? props.number_of_adults > 1
                  ? props.number_of_adults + " Adults"
                  : props.number_of_adults + " Adult"
                : null}
              {props.number_of_children
                ? `, ${props.number_of_children} Children`
                : null}
              {props.number_of_infants
                ? props.number_of_infants > 1
                  ? `, ${props.number_of_infants} Infants`
                  : `, ${props.number_of_infants} Infant`
                : null}
              )
            </span>
          </div>
        </div>

        {props?.budget && (
          <div className="flex flex-col gap-1">
            <div className="ttw-type-body text-gray-500">Budget</div>
            <div>{props?.budget}</div>
          </div>
        )}

        <div className="flex flex-row gap-4 items-center">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2 items-center">
              <div className="ttw-type-body text-gray-500">
                Dates ({props?.duration})
              </div>
            </div>
            <div>
              {convertDFormat(props.start_date)}
              {" - "}
              {convertDFormat(props.end_date)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EditPanel = ({ editDestination, setEditDestination }) => {
  function handleEditPanel(editDates = false) {
    if (editDates) {
      setEditDestination(false);
    } else {
      setEditDestination(true);
    }

    logEvent({
      action: "Route Edit",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: editDates ? "Edit Dates" : "Edit/Remove Destination",
        event_action: "Edit Destinations",
      },
    });
  }

  return (
    <div className="w-full pt-3 flex items-center justify-center border-b-2 px-2 ttw-type-body md:ttw-type-h4 lg:ttw-type-h4">
      <div className="flex flex-row gap-4">
        <div
          onClick={() => handleEditPanel()}
          className={`cursor-pointer ${
 editDestination
 ? "bg-black border-b-2 border-b-[#F7E700] text-[#F7E700] px-3 py-2 rounded-t-lg"
 : "text-gray-500 px-3 py-2"
 } `}
        >
          Edit/Remove Destination
        </div>
        {/* <div
          onClick={() => handleEditPanel(true)}
          className={`cursor-pointer ${
 !editDestination
 ? "bg-black border-b-2 border-b-[#F7E700] text-[#F7E700] px-3 py-2 rounded-t-lg"
 : "text-gray-500 px-3 py-2"
 } `}
        >
          Edit Dates
        </div> */}
      </div>
    </div>
  );
};

export const EditDestinations = (props) => {
  const [popUp, setPopUp] = useState(false);

  function handleAddDestination() {
    setPopUp(true);

    logEvent({
      action: "Route Edit",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Add Destination",
        event_action: "Add New Destination",
      },
    });
  }

  function updateLatLong(items) {
    props.setLocationsLatLong((prev) => {
      let locations = [...prev];
      const newLocations = [];

      for (let i = 1; i < items.length - 1; i++) {
        const lat = items[i]?.cityData?.lat || items[i]?.cityData?.latitude;
        const long = items[i]?.cityData?.long || items[i]?.cityData?.longitude;
        const color = items[i]?.cityData?.color;
        const name = items[i]?.cityData?.name || items[i]?.cityData?.city_name;
        const nights = items[i]?.cityData?.nights;

        if (lat && long) {
          const location = locations.find(
            (item) =>
              item.color === color &&
              item.lat === lat &&
              item.long === long &&
              item.nights === nights
          );

          if (location) {
            newLocations.push(location);
          } else {
            newLocations.push({
              lat: lat,
              long: long,
              name: name,
              color: color,
            });
          }
        }
      }

      return newLocations;
    });
  }

  function updateDestinationsDates(destinations) {
    let prevDate = getDate(props.startDate);

    for (let i = 1; i < destinations.length - 1; i++) {
      const dest = destinations[i];
      const checkInDate = prevDate;
      const checkOutDate =
        dest?.cityData?.nights >= 0 && dest?.cityData?.nights !== null
          ? getDateString(
              addDays(new Date(getDate(prevDate)), dest.cityData.nights)
            )
          : getDateString(addDays(new Date(getDate(prevDate)), 1));

      dest.cityData.checkin_date = checkInDate;
      dest.cityData.checkout_date = checkOutDate;
      prevDate = checkOutDate;
    }

    props.setEndDate(prevDate);
  }

  // Preview is opt-in: only the chat Route tab passes `canToggleEdit`, so the
  // standalone itinerary page (which never passes `isEditing`) stays editable.
  const isEditing = props.isEditing !== false;
  const canToggleEdit = !!props.canToggleEdit;

  return (
    // No bottom reserve: the Update Route bar is sticky and sits in flow, so it
    // no longer overlays the last city.
    <div className="w-full flex flex-col items-center justify-center gap-3 pb-6">
      <div className="w-full flex flex-row items-center justify-between gap-3">
        <div className="font-inter font-bold text-[22px] max-ph:text-[19px] leading-none tracking-[-0.3px] text-[#0B1220]">
          Route
        </div>

        {/* The route is read-only until asked otherwise. There is no "done"
            counterpart to Edit: the first change surfaces the Update Route bar,
            and saving is what closes the editor. */}
        {isEditing ? (
          <button
            type="button"
            onClick={handleAddDestination}
            className="flex shrink-0 items-center gap-[5px] text-[14px] max-ph:text-[13px] font-inter font-semibold text-[#1D6FE0] cursor-pointer whitespace-nowrap"
          >
            <span className="text-[16px] leading-none">+</span>
            Add destination
          </button>
        ) : (
          <button
            type="button"
            onClick={() => props.onToggleEdit?.(true)}
            aria-label="Edit route"
            className="flex shrink-0 items-center gap-[5px] text-[14px] max-ph:text-[13px] font-inter font-semibold text-[#1D6FE0] cursor-pointer whitespace-nowrap"
          >
            <MdOutlineEdit size={15} />
            Edit Destinations
          </button>
        )}
      </div>

      {props.destinations.length ? (
        isEditing ? (
          <DragDrop
            popUp={popUp}
            setPopUp={setPopUp}
            updateLatLong={updateLatLong}
            updateDestinationsDates={updateDestinationsDates}
            {...props}
          />
        ) : (
          <RoutePreview
            destinations={props.destinations}
            transferBookings={props.transferBookings}
          />
        )
      ) : null}
    </div>
  );
};

export const DragDrop = (props) => {
  const {
    destinations,
    setDestinations,
    updateLatLong,
    updateDestinationsDates,
    popUp,
    setPopUp,
    setDestinationChanges,
    destinationRef,
  } = props;

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    if (
      result.destination.index === 0 ||
      result.destination.index === destinations.length - 1
    ) {
      return;
    }

    let items = reorder(
      destinations,
      result.source.index,
      result.destination.index
    );

    updateDestinationsDates(items);

    updateLatLong(items);

    setDestinationChanges(true);

    setDestinations(items);

    logEvent({
      action: "Route Edit",
      params: {
        page: "Itinerary Page",
        event_category: "Drag and Drop",
        event_label: "Edit",
        event_action: "Edit destinations",
      },
    });
  }

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",

    // change background colour if dragging
    background: isDragging ? "rgb(229 231 235)" : "white",
    // Matches the mb the preview rows carry, so the pin-to-pin rhythm — and
    // the rail geometry that depends on it — is one number in both states.
    margin: `0 0 10px 0`,
    borderRadius: "8px",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  return (
    <div className="w-full flex flex-col relative">
      <div className="mb-[10px]">
        <Destination
          index={0}
          startingCity={props.destinations[0].startingCity}
          endingCity={props.destinations[0].endingCity}
          cityData={props.destinations[0]?.cityData}
          pinColour={props.destinations[0]?.cityData?.color}
          setDestinations={props.setDestinations}
          updateLatLong={updateLatLong}
          updateDestinationsDates={updateDestinationsDates}
          setDestinationChanges={setDestinationChanges}
          destinationRef={destinationRef}
          totalDestinations={props.destinations.length}
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {destinations.map((item, index) => {
                if (index !== 0 && index !== destinations.length - 1){
                  const uniqueId = item.cityData?.id 
                    || item.cityData?.city_id 
                    || item.cityData?.place_id 
                    || `city-${index}-${item.cityData?.city_name || item.cityData?.name || 'unknown'}`;
                  return (
                    <Draggable
                      key={`city-${index}-${uniqueId}`}
                      draggableId={`city-${index}-${uniqueId}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <Destination
                            index={index}
                            startingCity={item.startingCity}
                            endingCity={item.endingCity}
                            cityData={item?.cityData}
                            pinColour={item?.cityData?.color}
                            setDestinations={props.setDestinations}
                            updateLatLong={updateLatLong}
                            setPopUp={setPopUp}
                            updateDestinationsDates={updateDestinationsDates}
                            setDestinationChanges={setDestinationChanges}
                            destinationRef={destinationRef}
                            totalDestinations={destinations.length}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                }
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {popUp && (
        <DestinationPopUp
          setDestinations={setDestinations}
          updateLatLong={updateLatLong}
          setPopUp={setPopUp}
          updateDestinationsDates={updateDestinationsDates}
          setDestinationChanges={setDestinationChanges}
          destinationRef={destinationRef}
        />
      )}

      <Destination
        index={props.destinations.length - 1}
        startingCity={
          props.destinations[props.destinations.length - 1].startingCity
        }
        endingCity={
          props.destinations[props.destinations.length - 1].endingCity
        }
        cityData={props.destinations[props.destinations.length - 1]?.cityData}
        pinColour={
          props.destinations[props.destinations.length - 1]?.cityData?.color
        }
        setDestinations={props.setDestinations}
        updateLatLong={updateLatLong}
        updateDestinationsDates={updateDestinationsDates}
        setDestinationChanges={setDestinationChanges}
        destinationRef={destinationRef}
      />
    </div>
  );
};

export const Destination = (props) => {
  const {
    startingCity,
    endingCity,
    cityData,
    pinColour,
    index,
    setDestinations,
    updateLatLong,
    updateDestinationsDates,
    setDestinationChanges,
    destinationRef,
    readOnly,
    leg,
  } = props;

  const [popUp, setPopUp] = useState(false);
  const isPageWide = window.matchMedia("(min-width: 768px)")?.matches;
  const isEndpoint = !!(startingCity || endingCity);
  const hasLeg =
    !!leg && (leg.modes.length > 0 || leg.hasDrop || leg.hasPickup);
  const showsLeg = readOnly && hasLeg;
  const hasRail = index < props?.totalDestinations - 1;

  const handleRemoveDestination = (e) => {
    e.stopPropagation();

    setDestinationChanges(true);

    setDestinations((prev) => {
      const updatedDestinations = prev.filter((dest, i) => i !== index);
      updateLatLong(updatedDestinations);
      updateDestinationsDates(updatedDestinations);
      return updatedDestinations;
    });

    logEvent({
      action: "Route Edit",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Remove",
        event_action: "Remove destination",
      },
    });
  };

  const handleEditDestination = () => {
    setPopUp(true);

    logEvent({
      action: "Route Edit",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "Edit",
        event_action: "Edit destination",
      },
    });
  };

  return (
    // Preview stacks a transfer row under the city row, so the wrapper turns
    // into a column there; with a single full-width child it lays out
    // identically either way. The 10px margin is the one the editor's rows get
    // from the draggable wrapper — matching it here keeps one rhythm (and one
    // rail geometry) across both states. No `mt` on the inner row: bootstrap's
    // `.mt-3` is 1rem !important, and 16px of dead space above every city was
    // most of the gap between them.
    //
    // A stop with a transfer under it is spaced by the chip row itself; a stop
    // without one has to buy that separation back, or the cities crowd together.
    // It's padding, not margin, on purpose — the rail's `bottom` offset is
    // measured from this element's padding box, so the same overshoot keeps
    // reaching the next pin whichever case a row is in.
    <div
      className={`relative w-full flex pt-[6px] ${
        showsLeg ? "pb-[6px]" : "pb-[18px]"
      } ${readOnly ? "flex-col mb-[10px]" : ""}`}
    >
      {popUp && !readOnly && (
        <DestinationPopUp
          index={index}
          cityData={cityData}
          startingCity={startingCity}
          endingCity={endingCity}
          setDestinations={props.setDestinations}
          updateLatLong={updateLatLong}
          setPopUp={setPopUp}
          updateDestinationsDates={updateDestinationsDates}
          setDestinationChanges={setDestinationChanges}
          destinationRef={destinationRef}
        />
      )}

      <div className="w-full flex flex-row font-inter items-center justify-between gap-4 relative z-10">
        <div
          onClick={readOnly ? undefined : handleEditDestination}
          className="min-w-0 flex-1 flex flex-row items-center gap-1 sm:gap-3"
        >
          {/* The handle gutter belongs to the editor. In the editor the start
              and end cities have no handle of their own, so they hold the
              20px open to stay in line with the draggable stops between them.
              The preview has no handles at all, so it drops the gutter
              entirely and its pins line up with the "Route" heading. */}
          {!isEndpoint && !readOnly && (
            <div className="shrink-0 text-gray-400 cursor-grab active:cursor-grabbing">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="3" y="6" width="18" height="2" rx="1" />
                <rect x="3" y="11" width="18" height="2" rx="1" />
                <rect x="3" y="16" width="18" height="2" rx="1" />
              </svg>
            </div>
          )}

          {isEndpoint && !readOnly && <div className="w-[20px] shrink-0" />}

          {/* shrink-0 on the pin: it and the gutter before it are what put the
              dotted rail under the pin's centre, so neither may give up width
              to a long city name. */}
          {isEndpoint ? (
            <div className="w-6 h-6 ml-[0.25rem] shrink-0 rounded-full bg-black flex items-center justify-center relative z-10">
              <div className="w-2 h-2 bg-white rounded-full "></div>
            </div>
          ) : (
            <span className="shrink-0 flex">
              <CustomMapPin color={cityData?.color || pinColour} />
            </span>
          )}
          {/* City and its night count share a line and only stack when the
              name is long enough to need the width. */}
          <div className="min-w-0 flex flex-row flex-wrap items-baseline gap-x-[8px] gap-y-[1px]">
            <div
              className={`font-inter font-semibold text-[15px] leading-[1.35] text-[#0B1220] ${
                readOnly ? "" : "cursor-pointer"
              }`}
            >
              {cityData.city_name || cityData.name || cityData.text}
            </div>
            {isEndpoint ? (
              <div className="font-inter text-[13px] leading-[1.35] text-[#6B7280]">
                {startingCity ? "Start" : "End"}
              </div>
            ) : (
              cityData?.nights >= 0 && (
                <div className="font-inter text-[13px] leading-[1.35] text-[#6B7280]">
                  {`${cityData.nights} ${
                    cityData.nights === 1 ? "night" : "nights"
                  }`}
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-row items-center gap-1 justify-self-end">
          {!isEndpoint && !readOnly && (
            <>
              {/* Real buttons with a 32px tap target, and pointer/touch events
                  stopped before they reach the row. The whole row is
                  react-beautiful-dnd's drag handle, and on a touch screen its
                  sensor claims the press — a tap held past its ~150ms lift
                  threshold starts a drag instead of firing this click, which is
                  why these were unreliable on a phone. An 18px bare <svg> was
                  also well under the 44px minimum tap target. */}
              <button
                type="button"
                aria-label="Edit destination"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={handleEditDestination}
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full"
              >
                <MdOutlineEdit size={18} color={"#3B82F6"} />
              </button>

              <button
                type="button"
                aria-label="Remove destination"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => handleRemoveDestination(e)}
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full"
              >
                <MdOutlineDelete size={18} color="#EF4444" />
              </button>
            </>
          )}
        </div>
      </div>

      {readOnly && hasLeg && (
        <RouteTransferRow leg={leg} isEndpoint={isEndpoint} />
      )}

      {/* Rail down to the next pin. Sized by its offsets, not a fixed height,
          so a stop carrying two transfer chips (or a city name that wraps)
          still joins up. It overshoots the row by more than the 10px gap plus
          the next row's 6px lead-in, so it always lands *behind* that pin,
          which paints over it (z-10 vs z-0).
          `left` is the pin's centre less the rail's own 1px: the editor's rows
          start with the 20px handle gutter (20 + 4 gap + 16 = 40 → 39), the
          preview's start at the pin itself (16 → 15). */}
      {hasRail && (
        <DottedRail
          className={`absolute z-0 top-[30px] bottom-[-24px] ${
            readOnly ? "left-[15px]" : "left-[39px]"
          }`}
        />
      )}
    </div>
  );
};

export const DestinationPopUp = (props) => {
  const {
    index,
    cityData,
    startingCity,
    endingCity,
    setDestinations,
    updateLatLong,
    updateDestinationsDates,
    setPopUp,
    setDestinationChanges,
    destinationRef,
  } = props;

  // Opening on a stop that is already in the route means the destination is
  // already a resolved, valid city — the traveller may well only want to change
  // the nights. So it starts valid, and only typing a *different* name
  // invalidates it. `resource_id` alone can't tell us this: it comes back on
  // search results, while a city that arrived with the itinerary carries
  // city_id / place_id instead — which is why editing a stop used to demand a
  // pointless re-search of the city already in the field.
  const isExistingStop = !!(
    cityData?.city_name ||
    cityData?.name ||
    cityData?.text
  );

  const [search, setSearch] = useState(
    (cityData?.city_name || cityData?.name || cityData?.text) ?? ""
  );
  const debouncedSearch = useDebounce(search);
  const [destination, setDestination] = useState(cityData);
  const [nights, setNights] = useState(cityData?.nights ?? 0);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearched, setIsSearched] = useState(false);
  const [validDestination, setValidDestination] = useState(
    isExistingStop || !!cityData?.resource_id
  );

  // Add ref for the search container
  const searchContainerRef = useRef(null);
  // Host for the phone modal (see the return below). Resolved lazily, on the
  // very first render, rather than in an effect: an effect-resolved host makes
  // that first render return null, so the card — and the ref the effect below
  // writes through — has not mounted yet by the time effects run. Safe to read
  // `document` during render here because this popup only ever exists after a
  // tap, so it is never part of the SSR markup.
  const [portalHost] = useState(() =>
    typeof document === "undefined" ? null : document.body
  );
  // The field opens pre-filled with the city this stop already is. That seed is
  // not a query — searching it on mount greeted the traveller with a dropdown
  // of suggestions for the city they had just tapped to edit. Only the user's
  // own typing counts as a search.
  const hasTypedRef = useRef(false);

  useEffect(() => {
    // Guarded: this hangs the close handler off the card's DOM node, and the
    // card is not guaranteed to be mounted on the render this first runs.
    // RouteEditSection's outside-click handler already null-checks the ref, so
    // skipping the assignment degrades to "no outside-click close", not a crash.
    if (destinationRef?.current) {
      destinationRef.current.setPopUp = () => setPopUp(false);
    }
    return () => {
      setSearchResults(null);
      setPopUp(null);
    };
    // Deliberately once: the cleanup closes the popup, so any dependency added
    // here would slam it shut whenever that value changed.
  }, []);

  const handleSearch = (e) => {
    hasTypedRef.current = true;
    if (e.target.value) {
      logEvent({
        action: "Route Edit",
        params: {
          page: "Itinerary Page",
          event_category: "Search",
          event_label: "Search Destination",
          event_action: "Search destination",
        },
      });
    }
    setSearch(e.target.value);
    const currentDestinationName =
      destination?.name || destination?.city_name || destination?.text;
    // Symmetric on purpose: typing away from the selected city invalidates it,
    // and typing back to it restores it — otherwise a stray keystroke and an
    // undo left the button dead with the right city sitting in the field.
    setValidDestination(e.target.value === currentDestinationName);
  };

  useEffect(() => {
    if (!hasTypedRef.current) return; // pre-filled city, not a query
    if (isSearched) return; // a result was just picked
    if (!debouncedSearch?.trim()) {
      setSearchResults(null);
      return;
    }
    handleDestinationSeach(debouncedSearch);
  }, [debouncedSearch]);

  const handleDestinationSeach = (value) => {
    if (startingCity || endingCity) {
      axiossearchstartinginstance
        .get(`?q=${value}`)
        .then((results) => {
          setSearchResults(results.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axiossearchinstance
        .get(`?type=City&q=${value}`)
        .then((results) => {
          setSearchResults(results.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSetDestination = (i) => {
    setSearch(searchResults[i].name || searchResults[i].text);

    setDestination((prev) => {
      if (
        prev &&
        prev?.resource_id &&
        prev.resource_id === searchResults[i]?.resource_id
      ) {
        return prev;
      } else if (
        prev &&
        prev?.place_id &&
        prev.place_id === searchResults[i]?.place_id
      ) {
        return prev;
      }

      return searchResults[i];
    });

    setSearchResults(null);
    setIsSearched(true);
    setValidDestination(true);
  };

  const handleSetNights = (minus = false) => {
    setNights((prev) => {
      const newValue = minus ? Math.max(1, prev - 1) : prev + 1;
      return newValue;
    });

    logEvent({
      action: "Route Edit",
      params: {
        page: "Itinerary Page",
        event_category: "Update Destination",
        event_label: minus ? "Decrease Nights" : "Increase Nights",
        event_action: "Update Nights",
      },
    });
  };

  const handleUpdateDestination = () => {
    setDestinationChanges(true);

    setDestinations((prev) => {
      let destinations = [...prev];
      const curDestination = destinations[index];

      const match = destinations.find((d, i) => {
        const cd = d.cityData;
        return (
          (cd?.resource_id === destination?.resource_id ||
            cd?.city_id === destination?.resource_id ||
            cd?.id === destination?.resource_id) &&
          i === index
        );
      });

      const matchedCityId = match?.cityData?.id;
      if (matchedCityId) {
        destination.id = matchedCityId;
      }

      if (curDestination) {
        if (curDestination.startingCity || curDestination.endingCity) {
          destinations[index] = {
            startingCity: curDestination.startingCity,
            endingCity: curDestination.endingCity,
            cityData: {
              ...destination,
              duration: nights,
              place_id: destination?.place_id,
            },
          };
        } else {
          destinations[index] = {
            startingCity: curDestination.startingCity,
            endingCity: curDestination.endingCity,
            cityData: {
              ...destination,
              nights: nights,
              color: curDestination.cityData.color,
              duration: nights,
            },
          };
        }
      } else {
        destinations.splice(destinations.length - 1, 0, {
          startingCity: false,
          endingCity: false,
          cityData: {
            ...destination,
            nights: nights,
            duration: nights,
            color: CITY_COLOR_CODES[(destinations.length - 1) % 7],
          },
        });
      }

      updateDestinationsDates(destinations);
      updateLatLong(destinations);
      return destinations;
    });

    setPopUp(false);

    logEvent({
      action: "Route Edit",
      params: {
        page: "Itinerary Page",
        event_category: "Update Destination",
        event_label: "Update",
        event_action: "Update destination",
      },
    });
  };

  const isEndpointStop = !!(startingCity || endingCity);
  // An existing stop only needs its city to still be the one in the field —
  // it already has an id the save can use. Adding a new one has nothing to fall
  // back on, so it must be picked from the dropdown to get a `resource_id`.
  const cannotSubmit = isExistingStop
    ? !validDestination
    : !validDestination || !destination?.resource_id || !destination?.name;

  // Read synchronously rather than through useMediaQuery: that hook starts at
  // `false` by design (its own doc says it is only safe for behaviour, not
  // layout) and would flash the phone treatment on desktop. Safe here where it
  // would not be elsewhere — this popup only ever exists after a tap, so it is
  // never part of the SSR markup and cannot cause a hydration mismatch. Same
  // read `Destination` above already does for `isPageWide`.
  const isWideViewport =
    typeof window !== "undefined" &&
    !!window.matchMedia("(min-width: 768px)")?.matches;

  // Every position here — the absolute box, its two placements, the bubble
  // tail, the close button, the dropdown under the field — is unchanged. What
  // changed is the surface: the route section's own palette and Inter scale in
  // place of the grey card and the legacy ttw-type-* classes.
  //
  // Borders are written as `border-[1px] border-solid border-[…]` rather than
  // the plain `border` utility throughout: bootstrap.min.css loads after
  // Tailwind and its `.border` is a `!important` shorthand, so it silently
  // overrode both the width and the colour asked for here (and the
  // focus-within state with them). Arbitrary values have no bootstrap
  // counterpart to collide with.
  const card = (
    <div
      ref={destinationRef}
      // Desktop: the anchored bubble, positioned exactly as before — 340px
      // wide, not 70% of the panel, which read as a 450px slab.
      // Phone: a plain centered card. The anchored version is absolutely
      // positioned deep inside BotApp's itinerary scroll pane, where it is at
      // the mercy of that pane's overflow and its z-index:2 stacking context;
      // portalled to <body> below, none of that can reach it.
      className={
        isWideViewport
          ? `z-50 w-[90%] lg:w-[340px] absolute ${
              index !== undefined
                ? `top-0 left-[10%] lg:left-[30%]`
                : "-bottom-[150px] left-[10%] lg:left-[15%]"
            } bg-white rounded-[14px] border-[1px] border-solid border-[#ECECEC] shadow-[0_12px_32px_rgba(11,18,32,0.16)]`
          : "w-full max-w-[360px] bg-white rounded-[14px] border-[1px] border-solid border-[#ECECEC] shadow-[0_12px_32px_rgba(11,18,32,0.16)]"
      }
    >
      <div className="relative flex flex-col gap-[12px] p-[14px]">
        {isWideViewport && (
          <BiSolidLeftArrow
            size={20}
            className="absolute left-[-18px] top-3 text-white"
          />
        )}

        <button
          type="button"
          aria-label="Close"
          onClick={() => setPopUp(false)}
          className="absolute right-[10px] top-[10px] flex h-[24px] w-[24px] items-center justify-center rounded-full text-[#0B1220] hover:bg-[#F2F3F0] transition-colors"
        >
          <RxCrossCircled size={18} />
        </button>

        <div className="pr-[28px] font-inter text-[14px] font-semibold leading-[1.35] text-[#0B1220]">
          {startingCity
            ? "Where is your trip starting from?"
            : endingCity
            ? "Where is your trip ending?"
            : "What do you want to explore?"}
        </div>

        {/* UPDATED: Changed this to relative positioning */}
        <div
          ref={searchContainerRef}
          className="relative w-full"
        >
          <div className="flex flex-row items-center gap-[8px] w-full rounded-[10px] px-[10px] py-[9px] bg-white border-[1px] border-solid border-[#E2E5EA] focus-within:border-[#1D6FE0] !shadow-none transition-colors">
            <IoLocationSharp
              size={17}
              className="shrink-0"
              style={{ color: cityData?.color || "#1D6FE0" }}
            />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => {
                handleSearch(e);
                setIsSearched(false);
              }}
              placeholder="Search destination"
              // 16px on phones: anything smaller makes iOS Safari zoom the
              // whole page in when the field takes focus.
              className="focus:outline-none w-full min-w-0 bg-transparent !shadow-none font-inter text-[16px] sm:text-[14px] leading-[1.35] text-[#0B1220] placeholder:text-[#9AA2AD]"
            />
            {search ? (
              <button
                type="button"
                aria-label="Clear"
                onClick={() => {
                  hasTypedRef.current = true;
                  setSearch("");
                  setSearchResults(null);
                  setValidDestination(false);
                }}
                className="shrink-0 text-[#0B1220]"
              >
                <RxCrossCircled size={17} />
              </button>
            ) : null}
          </div>

          {/* UPDATED: Changed from fixed to absolute positioning */}
          {searchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-[10px] border-[1px] border-solid border-[#E2E5EA] bg-white p-[6px] flex flex-col gap-[2px] shadow-[0_12px_28px_rgba(11,18,32,0.14)] z-[60]">
              {searchResults.map((res, ind) => (
                <div
                  key={ind}
                  onClick={() => handleSetDestination(ind)}
                  className="cursor-pointer flex flex-row items-center gap-[10px] rounded-[8px] px-[8px] py-[7px] hover:bg-[#F2F3F0] transition-colors"
                >
                  <div className="w-[30px] h-[30px] bg-[#F2F3F0] rounded-full flex items-center justify-center flex-shrink-0">
                    <IoLocationSharp size={15} className="text-[#6B7280]" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="font-inter text-[14px] font-medium leading-[1.35] text-[#0B1220] truncate">
                      {isEndpointStop ? res.text : res.name}
                    </div>
                    {!isEndpointStop && res.country && (
                      <div className="font-inter text-[12px] leading-[1.35] text-[#9AA2AD] truncate">
                        {res.country}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isEndpointStop && (
          <div className="flex flex-row items-center justify-between gap-3 w-full rounded-[10px] px-[10px] py-[8px] bg-white border-[1px] border-solid border-[#E2E5EA] !shadow-none">
            <div className="flex flex-row items-center gap-[8px] min-w-0">
              <FaCalendarDays size={14} className="shrink-0 text-[#6B7280]" />
              <div className="font-inter text-[14px] leading-[1.35] text-[#0B1220]">
                Number of nights
              </div>
            </div>

            <div className="flex shrink-0 flex-row items-center gap-[10px]">
              <button
                type="button"
                aria-label="One night fewer"
                onClick={() => handleSetNights(true)}
                disabled={nights <= 1}
                className="flex items-center text-[#1D6FE0] disabled:text-[#D5D9DF] disabled:cursor-not-allowed"
              >
                <FaCircleMinus size={20} />
              </button>
              <div className="min-w-[18px] text-center font-inter text-[14px] font-semibold text-[#0B1220]">
                {nights}
              </div>
              <button
                type="button"
                aria-label="One night more"
                onClick={() => handleSetNights()}
                className="flex items-center text-[#1D6FE0]"
              >
                <FaCirclePlus size={20} />
              </button>
            </div>
          </div>
        )}

        {cannotSubmit && search && (
          <div className="font-inter text-[12px] leading-[1.35] text-[#D93A3A]">
            Please select a destination from the dropdown
          </div>
        )}

        <button
          onClick={handleUpdateDestination}
          disabled={cannotSubmit}
          className="w-full h-[42px] rounded-[8px] bg-[#F7E700] font-inter text-[14px] font-bold text-black disabled:bg-[#EDEDE7] disabled:text-[#9AA2AD] disabled:cursor-not-allowed"
        >
          Update
        </button>
      </div>
    </div>
  );

  if (isWideViewport) return card;

  // Phone: a body-level modal. Portalled for the same reason the Update Route
  // bar is — out here it cannot be clipped by the scroll pane's overflow,
  // buried under its stacking context, or covered by that bar (z-30).
  if (!portalHost) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setPopUp(false);
      }}
    >
      {card}
    </div>,
    portalHost
  );
};

export const EditDates = ({
  destinations,
  setDestinations,
  startDate,
  setStartDate,
  setEndDate,
  endDate,
  isValidDates,
  invalidDateError,
}) => {
  const isDesktop = useMediaQuery("(min-width:768px)");
  const [calendarMonths, setCalenderMonths] = useState(null);
  const [dateRanges, setDateRanges] = useState([]);

  useEffect(() => {
    const startMonth = new Date(startDate).getMonth();
    const endMonth = new Date(endDate).getMonth();
    setCalenderMonths(endMonth - startMonth + 1);

    const ranges = [];
    for (let i = 0; i < destinations.length; i++) {
      if (destinations[i].startingCity) {
        ranges.push({
          startDate: new Date(startDate),
          endDate: new Date(startDate),
          key: "selection",
          color: "#01202B",
        });
      } else if (destinations[i].endingCity) {
        ranges.push({
          startDate: new Date(endDate),
          endDate: new Date(endDate),
          key: "selection",
          color: "#01202B",
        });
      } else {
        ranges.push({
          startDate: new Date(getDate(destinations[i].cityData.checkin_date)),
          endDate: new Date(getDate(destinations[i].cityData.checkout_date)),
          key: "selection",
          color: destinations[i].cityData.color,
        });
      }
    }

    setDateRanges(ranges);
  }, [destinations, startDate, endDate]);

  const handleDates = (
    offSet,
    index,
    checkinDate,
    checkoutDate,
    isArrival = false
  ) => {
    setDestinations((prev) => {
      return prev.map((dest, ind) => {
        if (ind === index && !(dest.startingCity || dest.endingCity)) {
          if (isArrival) {
            return {
              ...dest,
              cityData: {
                ...dest.cityData,
                checkin_date: checkinDate,
                checkout_date:
                  getDate(checkoutDate) !== "" && !isNaN(offSet)
                    ? getDateString(
                        addDays(new Date(getDate(checkoutDate)), offSet)
                      )
                    : checkoutDate,
              },
            };
          }
          return {
            ...dest,
            cityData: {
              ...dest.cityData,
              checkin_date: checkinDate,
              checkout_date: checkoutDate,
            },
          };
        } else if (ind > index && ind < destinations.length - 1) {
          return {
            ...dest,
            cityData: {
              ...dest.cityData,
              checkin_date:
                getDate(dest.cityData.checkin_date) !== "" && !isNaN(offSet)
                  ? getDateString(
                      addDays(
                        new Date(getDate(dest.cityData.checkin_date)),
                        offSet
                      )
                    )
                  : dest.cityData.checkin_date,
              checkout_date:
                getDate(dest.cityData.checkout_date) !== "" && !isNaN(offSet)
                  ? getDateString(
                      addDays(
                        new Date(getDate(dest.cityData.checkout_date)),
                        offSet
                      )
                    )
                  : dest.cityData.checkout_date,
            },
          };
        } else {
          return dest;
        }
      });
    });

    setEndDate((prev) =>
      !isNaN(offSet) ? getDateString(addDays(new Date(prev), offSet)) : prev
    );
  };

  return (
    <div className="w-full flex flex-row relative">
      <div className="w-full mg:w-[50%] lg:w-[50%] flex flex-col items-center pb-5 gap-3">
        <div className="w-full flex flex-col items-end">
          <div className="w-full md:w-[50%] ld:w-[50%] flex flex-row justify-start mb-5">
            <div className="ttw-type-h2 font-semibold leading-6">
              City Departures
            </div>
          </div>
          {destinations.map((dest, index) => (
            <DestinationDates
              key={index}
              index={index}
              destinations={destinations}
              setDestinations={setDestinations}
              startingCity={dest.startingCity}
              endingCity={dest.endingCity}
              cityData={dest.cityData}
              pinColour={dest.cityData.color}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              previousDate={
                index === 1
                  ? startDate
                  : index > 1 &&
                    getDate(destinations[index - 1].cityData.checkout_date)
              }
              isValidDates={isValidDates}
              handleDates={handleDates}
            />
          ))}
        </div>
      </div>
      {isDesktop && (
        <div className="fixed w-[40%] flex flex-col gap-5 right-[5%] pb-5">
          <div className="ttw-type-h2 font-semibold">Trip Dates</div>

          <CustomCalendar
            startDate={new Date(startDate)}
            endDate={new Date(endDate)}
            dateRanges={dateRanges}
            calendarMonths={calendarMonths}
          />
          <div className="flex flex-row gap-1 items-center">
            {!isValidDates ? (
              <>
                <RxCrossCircled className="ttw-type-body text-white bg-red-500 rounded-full" />
                <span className="ttw-type-body">{invalidDateError}</span>
              </>
            ) : (
              <>
                <MdDone className="ttw-type-body text-white bg-[#0F9E03] rounded-full" />
                <span className="ttw-type-body">
                  Dates in individual cities match with itinerary dates
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const DestinationDates = (props) => {
  const {
    index,
    destinations,
    setDestinations,
    startingCity,
    endingCity,
    cityData,
    pinColour,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    previousDate,
    isValidDates,
    handleDates,
  } = props;

  const [checkinDate, setCheckinDate] = useState(
    getDate(cityData.checkin_date)
  );
  const [checkoutDate, setCheckoutDate] = useState(
    getDate(cityData.checkout_date)
  );

  useEffect(() => {
    setCheckinDate(getDate(cityData.checkin_date));
    setCheckoutDate(getDate(cityData.checkout_date));
  }, [destinations]);

  function updateDate(date, isArrival = true) {
    setDestinations((prev) => {
      return prev.map((dest, ind) => {
        if (ind === index && !(dest.startingCity || dest.endingCity)) {
          if (isArrival) {
            return {
              ...dest,
              cityData: {
                ...dest.cityData,
                checkin_date: date,
              },
            };
          }
          return {
            ...dest,
            cityData: {
              ...dest.cityData,
              checkout_date: date,
            },
          };
        }

        return dest;
      });
    });
  }

  const handleDateChange = (e) => {
    e.target.value = getDateString(e.target.value);

    if (e.target.name === "Arrival Date") {
      const offSet = differenceInDays(
        new Date(e.target.value),
        new Date(checkinDate)
      );

      if (isValidDates) {
        handleDates(offSet, index, e.target.value, checkoutDate, true);
      } else {
        updateDate(e.target.value);
      }
    } else if (e.target.name === "Departure Date") {
      const offSet = differenceInDays(
        new Date(e.target.value),
        new Date(checkoutDate)
      );

      if (isValidDates) {
        handleDates(offSet, index, checkinDate, e.target.value);
      } else {
        updateDate(e.target.value, false);
      }
    } else if (e.target.name === "Start Date") {
      const offSet = differenceInDays(
        new Date(e.target.value),
        new Date(startDate)
      );
      if (isValidDates) {
        handleDates(offSet, index, null, null);
      }
      setStartDate(e.target.value);
    } else if (e.target.name === "End Date") {
      setEndDate(e.target.value);
    }
  };

  const isInvalidDate = (is_departure = false) => {
    const prevDate = new Date(previousDate);
    const checkin_date = new Date(checkinDate);

    switch (startingCity || endingCity || is_departure || true) {
      case startingCity:
        const today = new Date();
        const start_date = new Date(startDate);
        if (isNaN(Date.parse(startDate))) {
          return {
            error: true,
            invalid: false,
            message: `Add your dates in ${
              cityData.city_name || cityData.name || cityData.text
            }`,
          };
        } else if (!isSameDay(start_date, today) && start_date < today) {
          return {
            error: true,
            invalid: true,
            message: `Start Date should be greater than or equal to ${dateFormat(
              format(today, "dd/MM/yyyy")
            )}`,
          };
        } else
          return {
            error: false,
          };
      case endingCity:
        const end_date = new Date(endDate);
        if (isNaN(Date.parse(endDate))) {
          return {
            error: true,
            invalid: false,
            message: `Add your dates in ${
              cityData.city_name || cityData.name || cityData.text
            }`,
          };
        } else if (!isSameDay(end_date, prevDate) && end_date < prevDate) {
          return {
            error: true,
            invalid: true,
            message: `End Date should be greater than or equal to ${dateFormat(
              format(prevDate, "dd/MM/yyyy")
            )}`,
          };
        } else
          return {
            error: false,
          };
      case is_departure:
        const checkout_date = new Date(checkoutDate);
        if (isNaN(Date.parse(checkoutDate))) {
          return {
            error: true,
            invalid: false,
            message: `Add your dates in ${
              cityData.city_name || cityData.name || cityData.text
            }`,
          };
        } else if (
          !isSameDay(checkout_date, checkin_date) &&
          checkout_date < checkin_date
        ) {
          return {
            error: true,
            invalid: true,
            message: `Departure Date should be greater than or equal to ${dateFormat(
              format(checkin_date, "dd/MM/yyyy")
            )}`,
          };
        } else
          return {
            error: false,
          };
      default:
        if (isNaN(Date.parse(checkinDate))) {
          return {
            error: true,
            invalid: false,
            message: `Add your dates in ${
              cityData.city_name || cityData.name || cityData.text
            }`,
          };
        } else if (
          !isSameDay(checkin_date, prevDate) &&
          checkin_date < prevDate
        ) {
          return {
            error: true,
            invalid: true,
            message: `Arrival Date should be greater than or equal to ${dateFormat(
              format(prevDate, "dd/MM/yyyy")
            )}`,
          };
        } else
          return {
            error: false,
          };
    }
  };

  return (
    <div className="w-full md:w-[50%] lg:w-[50%] flex flex-col items-start">
      <div className="flex flex-row gap-3 items-center">
        <div
          style={{ backgroundColor: pinColour ? pinColour : "black" }}
          className="w-6 h-6 rounded-full flex items-center justify-center"
        >
          <div
            className={`w-2 h-2 ${
 pinColour ? "bg-white" : "bg-yellow"
 } rounded-full`}
          ></div>
        </div>
        <div className="ttw-type-body font-semibold">
          {cityData.city_name || cityData.name || cityData.text}
        </div>
      </div>
      <div className="w-full flex flex-row items-center gap-3">
        {!endingCity ? (
          startingCity ? (
            <div className="w-6 flex flex-col gap-1 items-center justify-center">
              <div className="w-[2px] h-3 rounded-full bg-green-200"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-300"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-400"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-500"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-600"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-700"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-800"></div>
            </div>
          ) : (
            <div className="w-6 flex flex-col gap-1 items-center justify-center">
              <div className="w-[2px] h-3 rounded-full bg-green-100"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-100"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-200"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-200"></div>
              <div className="w-[2px] h-3 rounded-full bg-green-300"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-400"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-500"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-600"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-700"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-800"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-800"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-900"></div>
              <div className="w-[2px] h-3 rounded-full bg-teal-900"></div>
            </div>
          )
        ) : (
          <div className="w-6"></div>
        )}
        <div className="w-full flex flex-col gap-2 py-3">
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-col gap-1">
              <label>
                {startingCity
                  ? "Start Date"
                  : endingCity
                  ? "End Date"
                  : "Arrival Date"}
              </label>
              <div
                className={`${
 !isValidDates
 ? isInvalidDate().error
 ? isInvalidDate().invalid
 ? "w-[80%] border-2 border-red-500 rounded-lg"
 : "w-[80%] border-2 border-[#ffbb33] rounded-lg"
 : "w-[80%]"
 : "w-[80%] "
 } `}
              >
                <DatePicker
                  defaultDate={getDate(previousDate)}
                  date={
                    startingCity
                      ? startDate
                      : endingCity
                      ? endDate
                      : getDate(cityData.checkin_date)
                  }
                  onDateChange={handleDateChange}
                  id={
                    startingCity
                      ? "Start Date"
                      : endingCity
                      ? "End Date"
                      : "Arrival Date"
                  }
                />
              </div>
            </div>
          </div>
          {!(startingCity || endingCity) && (
            <div className="flex flex-row items-center gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="endDate">Departure Date</label>
                <div
                  className={`${
 !isValidDates
 ? isInvalidDate(true).error
 ? isInvalidDate(true).invalid
 ? "w-[80%] border-2 border-red-500 rounded-lg"
 : "w-[80%] border-2 border-[#ffbb33] rounded-lg"
 : "w-[80%]"
 : "w-[80%] "
 } `}
                >
                  <DatePicker
                    defaultDate={getDate(previousDate)}
                    date={getDate(cityData.checkout_date)}
                    onDateChange={handleDateChange}
                    id={"Departure Date"}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CustomCalendar = ({
  startDate,
  endDate,
  dateRanges,
  calendarMonths,
}) => {
  const [months, setMonths] = useState([]);

  useEffect(() => {
    const temp_months = [];
    if (calendarMonths < 1) {
      const firstDayOfMonth = startOfMonth(addMonths(startDate, 0));
      const lastDayOfMonth = endOfMonth(addMonths(startDate, 0));
      const startDay = startOfWeek(firstDayOfMonth);
      const endDay = endOfWeek(lastDayOfMonth);
      let monthDays = eachDayOfInterval({
        start: startDay,
        end: endDay,
      });

      monthDays = monthDays.map((day) => {
        return { date: day, color: "" };
      });
      // monthDays = getDayColors(dateRanges[0], monthDays);
      monthDays = dayColor(monthDays);

      temp_months.push({ firstDay: firstDayOfMonth, days: monthDays });
    }

    for (let i = 0; i < calendarMonths; i++) {
      const firstDayOfMonth = startOfMonth(addMonths(startDate, i));
      const lastDayOfMonth = endOfMonth(addMonths(startDate, i));
      const startDay = startOfWeek(firstDayOfMonth);
      const endDay = endOfWeek(lastDayOfMonth);
      let monthDays = eachDayOfInterval({
        start: startDay,
        end: endDay,
      });

      monthDays = monthDays.map((day) => {
        return { date: day, color: "" };
      });

      for (let i = 1; i < dateRanges.length - 1; i++) {
        // monthDays = getDayColors(dateRanges[i], monthDays);
        monthDays = dayColor(monthDays);

        if (dateRanges[i].endDate > lastDayOfMonth) break;
        else {
          continue;
        }
      }

      temp_months.push({ firstDay: firstDayOfMonth, days: monthDays });
    }

    setMonths(temp_months);
  }, [startDate, endDate, dateRanges, calendarMonths]);

  const getDayColors = (range, days) => {
    return days.map((day) => {
      // Check if the current day is within the range
      if (
        (range && isSameDay(day.date, range.startDate)) ||
        (range && day.date > range.startDate && day.date < range.endDate)
      ) {
        return { date: day.date, color: range.color }; // Return the day and its color
      } else {
        return day;
      }
    });
  };

  const dayColor = (days) => {
    return days.map((day) => {
      if (isSameDay(day.date, startDate) || isSameDay(day.date, endDate)) {
        return { date: day.date, color: "#01202B" };
      } else if (day.date > startDate && day.date < endDate) {
        return { date: day.date, color: "#e5e7eb" };
      } else {
        return day;
      }
    });
  };

  return (
    <div className="w-full flex flex-row gap-5">
      {months.map((month, i) => (
        <Month
          key={i}
          firstDay={month.firstDay}
          days={month.days}
          startDate={startDate}
          endDate={endDate}
        />
      ))}
    </div>
  );
};

export const Month = ({ firstDay, days, startDate, endDate }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="ttw-type-body">{format(firstDay, "MMMM yyyy")}</div>
      <div className="flex flex-row border-b-2 pb-2">
        {days.map((day, index) => {
          if (index < 7)
            return (
              <div
                key={index}
                style={{ flex: 1, textAlign: "center" }}
                className="ttw-type-body text-[#7C7C7C]"
              >
                {format(day.date, "EEE")}
              </div>
            );
        })}
      </div>
      <div className="grid grid-cols-7 ttw-type-h4">
        {days.map((day, index) => {
          if (day.date.getMonth() !== firstDay.getMonth()) {
            return <div key={index} className="p-2"></div>;
          }
          return (
            <div
              key={index}
              style={{
                backgroundColor:
                  isSameDay(day.date, startDate) || isSameDay(day.date, endDate)
                    ? day.color
                    : day.color,
                color:
                  isSameDay(day.date, startDate) || isSameDay(day.date, endDate)
                    ? "#F7E700"
                    : "#01202B",
              }}
              className={`flex items-center justify-center p-2 font-normal`}
            >
              {format(day.date, "dd")}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DatePicker = (props) => {
  const [focusedInput, setFocusedInput] = useState(false);

  const { start_date, end_date, cities } = useSelector(
    (state) => state.Itinerary
  );

  function handleFocus() {
    setFocusedInput(true);
  }

  const initialMonth = () => {
    if (isNaN(Date.parse(props.date))) {
      return moment().month(new Date(props.defaultDate).getMonth());
    }
    return moment().month(new Date(props.date).getMonth());
  };

  const getDateRange = () => {
    if (!start_date || !end_date) {
      return [];
    }

    const startMoment = moment(start_date);
    const endMoment = moment(end_date);
    const dates = [];

    // Generate all dates between start_date and end_date (inclusive)
    let currentDate = startMoment.clone();
    while (currentDate.isSameOrBefore(endMoment)) {
      dates.push(currentDate.clone());
      currentDate.add(1, "day");
    }

    return dates;
  };

  const isDayHighlighted = (day) => {
    const dateRange = getDateRange();
    return dateRange.some((date) => date.isSame(day, "day"));
  };

  const formatDateRange = () => {
    if (!start_date || !end_date) {
      return "No dates selected";
    }

    const startMoment = moment(start_date);
    const endMoment = moment(end_date);

    return `Itinerary Dates - ${startMoment.format(
      "MMM DD"
    )} to ${endMoment.format("MMM DD")}`;
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
/* Force calendar to stay in normal document flow */
.SingleDatePicker_picker,
.SingleDatePicker_picker__portal {
  z-index: 115 !important;
  // transform: none !important;
  // top: 100% !important;
  // left: 0 !important;
  right: auto !important;
  bottom: auto !important;
}

.DayPickerNavigation_button {
      border: 2px solid #000000 !important;
      border-radius: 50% !important;
      background: #ffffff !important;
      width: 32px !important;
      height: 32px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.2s ease !important;
      color: black;
    }

    .DayPickerNavigation_button:hover {
      background: #f3f4f6 !important;
      transform: scale(1.05) !important;
    }

    .DayPickerNavigation_button:active {
      transform: scale(0.95) !important;
    }

    .DayPickerNavigation_button svg,
    .DayPickerNavigation_button .DayPickerNavigation_svg,
    .DayPickerNavigation_svg {
      display: none !important;
    }

    .DayPickerNavigation_button:first-child::after {
      content: "<";
      position: absolute;
      font-size: 14px;
      font-weight: bold;
      color: #000000;
      line-height: 1;
    }

    .DayPickerNavigation_button:last-child::after {
      content: ">";
      position: absolute;
      font-size: 14px;
      font-weight: bold;
      color: #000000;
      line-height: 1;
    }

    .DayPickerNavigation_button[aria-label*="previous"]::after,
    .DayPickerNavigation_button[aria-label*="Previous"]::after {
      content: "<";
    }

    .DayPickerNavigation_button[aria-label*="next"]::after,
    .DayPickerNavigation_button[aria-label*="Next"]::after {
      content: ">";
    }

    /* Calendar Day styles */
    .CalendarDay {
      border: 0px;
      margin: 1px;
    }

    .CalendarDay__selected,
    .CalendarDay__selected:hover {
      background-color: #f7e700;
      border: 0px;
      color: black;
    }

    .CalendarDay__selected_span,
    .CalendarDay__hovered_span {
      background-color: #f7e70033;
      color: black;
      border: 0px;
    }

    .CalendarDay__selected_span:hover,
    .CalendarDay__hovered_span:hover {
      background-color: #f7e7004a;
      color: black;
    }

    .DayPickerKeyboardShortcuts_show__topRight {
      display: none;
    }

.DayPicker_weekHeader {
      margin-top: 1rem !important;
    }

/* Remove any full screen overlay */
// body > div[data-react-portal] {
//   display: none !important;
// }

/* Target the portal container specifically */
div[data-react-portal] .SingleDatePicker_picker {
  position: fixed !important;
  z-index: 15 !important;
}

/* Prevent body scroll lock */
body.react-dates__block-scroll {
  overflow: visible !important;
}
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Container onClick={handleFocus} className="flex flex-col">
      <SingleDatePicker
        readOnly={true}
        initialVisibleMonth={initialMonth}
        date={isNaN(Date.parse(props.date)) ? null : moment(props.date)}
        onDateChange={(date) =>
          props.onDateChange({
            target: {
              name: props.id,
              value: date._d,
            },
          })
        }
        focused={focusedInput}
        onFocusChange={({ focused }) => setFocusedInput(focused)}
        id={props.id}
        noBorder={true}
        placeholder={"DD/MM/YYYY"}
        numberOfMonths={1}
        displayFormat={"DD/MM/YYYY"}
        isOutsideRange={() => false}
        enableOutsideDays={true}
        isDayHighlighted={isDayHighlighted}
        renderMonthElement={({ month, onMonthSelect, onYearSelect }) => {
          const dateRange = getDateRange();
          const currentMonthHasDates = dateRange.some((date) =>
            date.isSame(month, "month")
          );

          return (
            <div className="w-full">
              <div className="text-center mb-2">
                {month.format("MMMM YYYY")}
              </div>
              {currentMonthHasDates && (
                <div className="relative z-15 bg-yellow-50 border-l-2 border-yellow-400 px-2 py-1 mx-1 mb-2">
                  <div className="flex items-center gap-1 ttw-type-small text-gray-700">
                    <div className="w-1.5 h-1.5 bg-[#ffe8bc] rounded-sm flex-shrink-0"></div>
                    <span className="ttw-type-small">
                      {formatDateRange()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        }}
        renderDayContents={(day) => {
          const isHighlighted = isDayHighlighted(day);
          return (
            <div
              className={`w-full h-full flex items-center justify-center border-none ${
 isHighlighted ? "bg-yellow-50 " : ""
 }`}
            >
              {day.date()}
            </div>
          );
        }}
      />
      <CalenderIcons className="p-2 py-3">
        <Icon>
          <FaCalendarDays />
        </Icon>
      </CalenderIcons>
    </Container>
  );
};

export const ActionPanel = (props) => {
  const {
    setEdit,
    setEditDestination,
    editDestination,
    handleSaveButton,
    itineraryLoading,
    handleClose,
    setActiveTab,
    destinationChanges,
    chatRouteTab,
    routeTabActive,
    isEditing,
    barStyle,
    saving,
    dateError,
  } = props;
  const isDesktop = useMediaQuery("(min-width:768px)");
  const router = useRouter();

  // The bar is portalled to <body> rather than rendered where it sits in the
  // tree. It has to be: this section lives inside BotApp's itinerary scroll
  // pane, and a position:fixed element nested in a
  // -webkit-overflow-scrolling:touch scroller is positioned by iOS against the
  // *scrolled content* instead of the viewport — it scrolls away and never
  // appears on a phone. BotApp renders its own cart bar as a sibling of that
  // pane for exactly this reason; a portal buys the same thing from in here.
  const [portalHost, setPortalHost] = useState(null);
  useEffect(() => {
    setPortalHost(typeof document === "undefined" ? null : document.body);
  }, []);

  // Chat's Route tab: the same bottom bar the itinerary uses for View Cart —
  // pinned to bottom-0, spanning the itinerary panel (barStyle carries its
  // measured left/width on desktop). It takes the slot the moment the editor
  // opens and holds it, greyed, until there is something to save — so the foot
  // of the screen never swaps bars mid-edit as changes are made and undone.
  // While the save is in flight the button itself is the progress indicator;
  // the moment polling starts BotApp swaps the traveller back to the itinerary,
  // so this bar never needs a done state.
  if (chatRouteTab) {
    // `routeTabActive` is load-bearing now that this is portalled: MenuV2 keeps
    // the Route tab mounted behind a display:none wrapper, and outside the tree
    // the bar would no longer be hidden along with it.
    if (!isEditing || !routeTabActive || !portalHost) return null;

    const isDirty = !!destinationChanges;
    // A date problem is only worth raising once there is something to save —
    // before that the traveller hasn't asked for anything yet. Once raised it
    // replaces the hint line and greys the CTA, so the button is never a click
    // that silently does nothing.
    const blockedBy = isDirty ? dateError : null;
    const canSave = isDirty && !blockedBy;

    const title = blockedBy
      ? blockedBy.title
      : isDirty
        ? "Unsaved route"
        : "Editing route";
    const hint = blockedBy
      ? blockedBy.hint
      : isDirty
        ? "Update to re-plan stays & transfers"
        : "Reorder, edit or remove your stops";

    return createPortal(
      <div
        data-route-action-bar
        style={barStyle}
        // Stacked on phones, side by side from md up. Sharing one row with the
        // button leaves the text ~200px on a 375px screen, which wrapped every
        // message into three cramped lines; stacked it gets the full width and
        // the CTA gets a full-width tap target.
        className="z-30 fixed bottom-0 w-full md:w-[48%] flex-shrink-0 bg-[#fffaf5] border-t border-slate-100 shadow-[0_-4px_16px_rgba(11,18,32,0.06)] px-[24px] max-ph:px-[14px] py-[10px] max-ph:py-[12px] flex flex-col items-stretch gap-[10px] md:flex-row md:items-center md:justify-between md:gap-4"
      >
        <div className="flex min-w-0 flex-col gap-[2px]">
          <span
            className={`flex items-center gap-[5px] font-mono text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.06em] ${
              blockedBy ? "text-[#D93A3A]" : "text-[#8A9099]"
            }`}
          >
            {blockedBy && (
              <FaInfoCircle size={11} className="shrink-0" aria-hidden />
            )}
            <span className="truncate">{title}</span>
          </span>
          {/* Both lines are written short enough to sit on one line, so the bar
              is the same height whichever state it is in and never jumps as the
              traveller edits. */}
          <span
            className={`font-inter text-[13px] md:text-[14px] leading-tight truncate ${
              blockedBy ? "text-[#B42318]" : "text-[#111827]"
            }`}
          >
            {hint}
          </span>
        </div>
        <button
          type="button"
          onClick={handleSaveButton}
          disabled={!canSave || saving}
          aria-busy={saving}
          // Explicit colours rather than `disabled:` variants — the button is
          // also disabled while saving, and that state stays yellow.
          className={`flex h-[42px] md:h-[44px] w-full md:w-auto md:min-w-[148px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[8px] px-5 font-inter text-[14px] md:text-[15px] font-bold transition-colors ${
            canSave
              ? "bg-[#F7E700] text-black"
              : "bg-[#EDEDE7] text-[#9AA2AD] cursor-not-allowed"
          } ${saving ? "cursor-wait" : ""}`}
        >
          {saving ? (
            <PulseLoader size={7} color="#0B1220" speedMultiplier={0.8} />
          ) : (
            "Update Route"
          )}
        </button>
      </div>,
      portalHost
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
      className={`${!isDesktop && "gap-2"}`}
    >
   
{/* <button
  className={`LargeIndigoOutlinedButton ${!isDesktop && "w-1/2"}`}
  onClick={() => {
    if (editDestination) {
      const { drawer, ...restQuery } = router.query;
      router.push({
        pathname: router.pathname,
        query: restQuery,
      }, undefined, { shallow: true });
      
      
      if (setActiveTab) {
        setActiveTab("Itinerary");
      }
    } else {
      setEditDestination(true);
    }
  }}
>
  {editDestination ? "Cancel" : "Back"}
</button> */}
     {/* fixed, and with no pb reserve on the content above. The bar overlays the
         pane so it contributes no layout height — a sticky/in-flow bar adds its
         own ~75px and a pb reserve adds 150px, and either is enough to scroll a
         route that otherwise fits. Trade-off: at max scroll on a long route the
         last city sits under the bar. */}
     {/* max-ph:bottom-[88px] clears BottomCTABar: on mobile BotApp renders it
         with viewMode forced to "itinerary", so the View Cart bar is pinned at
         bottom-0 on this tab too and would cover an Update Route bar sitting
         there. 88px matches the scroll pane's pb-[88px] reserve for it. */}
     {destinationChanges ? <div data-route-action-bar className="z-30 fixed max-ph:left-0 max-ph:right-0 max-ph:w-auto w-[98%] md:w-[47.5%] max-ph:bottom-[88px] bottom-[4.2rem] flex-shrink-0 bg-white border-t border-slate-100 px-4 py-3 flex items-end justify-end max-ph:justify-stretch">
  <button
    type="button"
    onClick={handleSaveButton}
    disabled={!destinationChanges}
    style={{
      // Full width on mobile: a half-width button hugs the right edge, where
      // the floating Kaira bubble sits on top of it.
      maxWidth: isDesktop ? "200px" : "100%",
      width: "100%",
      height: "50px",
      padding: "0.5rem 2rem",
      margin: 0,
      borderRadius: "5px",
      borderWidth: destinationChanges ? "1px" : "0px",
      borderStyle: "solid",
      borderColor: "#07213A",
      backgroundColor: destinationChanges ? "#07213A" : "#B0B0B0",
      color: "white",
      fontWeight: 500,
      fontSize: isDesktop ? "1rem" : "0.8rem",
      cursor: destinationChanges ? "pointer" : "not-allowed",
      zIndex: 9999,
    }}
  >
    Update Route
  </button>
</div> : null}
    </div>
  );
};

export const ErrorMessage = ({ error, setError }) => {
  return (
    <div
      id="err_message"
      className="animate-slideDown fixed mx-2 top-5 md:right-5 lg:right-5 bg-red-500 rounded-lg text-white p-3 flex flex-row items-center gap-3"
    >
      <div className="ttw-type-body md:ttw-type-h4 lg:ttw-type-h4">{error}</div>
      <RxCrossCircled
        onClick={() => setError(false)}
        className="ttw-type-h2 cursor-pointer"
      />
    </div>
  );
};

export const Loader = (props) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="mb-96">
        <div className="animate-spin loader ease-linear rounded-full border-4 border-t-4 border-t-yellow-500 h-14 w-14"></div>
      </div>
    </div>
  );
};
