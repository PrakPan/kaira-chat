import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { useChat, generateSessionId, type UserLocationData, type MessageAttachment, Message } from "../hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { MessageInputBox } from "./MessageInputBox";
import { CHATKIT_API_DOMAIN_KEY as CHATKIT_DOMAIN_KEY } from "../lib/chatkitConfig";
import type { Location, BotMode } from "../types";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import LogInModal from "../../userauth/LogInModal";
import { createPortal } from "react-dom";
import ActivityDetailsDrawer from "../../drawers/activityDetails/ActivityDetailsDrawer";
import TransferEditDrawer from "../../drawers/routeTransfer/TransferEditDrawer";
import AccommodationDetailDrawer from "../../modals/AccommodationDetailDrawer";
import POIDetailsDrawer from "../../drawers/poiDetails/POIDetailsDrawer";
import { MERCURY_HOST } from "../../../services/constants";
import { openNotification } from "../../../store/actions/notification";
import setItinerary, {
  deletePoiFromItinerary,
  deleteActivityFromItinerary,
  deleteRestaurantFromItinerary,
} from "../../../store/actions/itinerary";
import SetCallPaymentInfo from "../../../store/actions/callPaymentInfo";

const CHATKIT_API_URL = "https://chat.tarzanway.com/chatkit";
const PAGINATION_SCROLL_THRESHOLD = 80;

export interface AttachmentFile {
  /** Temporary local ID (before server responds) or server-assigned ID */
  id: string;
  name: string;
  size: number;
  mimeType: string;
  /** uploading → uploaded → error */
  status: "uploading" | "uploaded" | "error";
  file: File;
}

const LoginButton = styled.button`
  width: 136px;
  height: 44px;
  background: #f7e700;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  color: #111;
  font-family: "Inter", sans-serif;
  font-weight: 600;
`;

const SingleChips = styled.button`
  border-radius: 6px;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  font-family: Montserrat;
  font-weight: 500;
  font-size: 12px;
  background: #fff;
  color: #6E757A;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  &:hover {
    // background: #f0f7ff;
    border-color: #1889ed;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface QuickReply {
  label: string;
  value?: string;
}

export interface CityEndpoint {
  name: string;
  gmaps_place_id: string;
}

export interface RouteEndpoints {
  start_city: CityEndpoint | null;
  end_city: CityEndpoint | null;
}

interface ChatKitPanelProps {
  onLocationReceived: (locationData: { data: Location[] }) => void;
  onRouteReceived: (routeData: { data: Location[] }) => void;
  onNewQuery: () => void;
  onClearMap?: (data?: Record<string, unknown>) => void;
  onItineraryReceived: (itineraryData: unknown) => void;
  /** Fired when shimmer_day_by_day / display_itinerary / display_transfers
   *  deliver start/end city info. Falls back to the user's current location
   *  when the effect omits either endpoint. */
  onRouteEndpointsReceived?: (endpoints: RouteEndpoints) => void;
  botMode?: BotMode;
  itineraryId?: string;
  onBotModeChange?: (mode: BotMode) => void;
  onItineraryIdChange?: (id: string) => void;
  initialPrompt?: string | null;
  initialAttachmentIds?: string[];
  onSendReady?: (sendFn: (message: string) => void) => void;
  onItineraryCompletionStart?: (itineraryId: string) => void;
onItineraryCompletionDone?: (itineraryId: string, summary?: string) => void;
onItineraryRefresh?: (itineraryId: string) => void;
onLoadRouteOnMap?: () => void;
restoredThread?: any;
onInitialPromptConsumed?: () => void;
sessionId?: string;
isItineraryCompleting?: boolean;
itineraryCompleted?: boolean;
/** Fired when a Make Payment CTA is clicked inside a chat widget. */
onPaymentStart?: () => void;
/** Static traveller-story intro rendered inside the chat. When present, the
 *  detail card is shown above real messages and its CTAs send the
 *  corresponding prompt through the /chatkit p1 API. Not posted to the bot. */
travellerStory?: TravellerStoryIntro | null;
onTravellerStoryDismiss?: () => void;
}

export interface TravellerStoryIntro {
  id: number;
  name: string;
  tripName: string;
  duration: string;
  groupType: string;
  destinations: string[];
  image: string;
  images?: string[];
  shortDescription: string;
  viewItineraryLink: string;
  rating: number;
  prompt: string;
}

function useUserLocationData() {
  const [userLocationData, setUserLocationData] =
    useState<UserLocationData | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const cached = localStorage.getItem("userLocationData");
        if (cached) {
          setUserLocationData(JSON.parse(cached));
          setIsLoadingLocation(false);
          return;
        }
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const { ip } = await ipRes.json();
        const locRes = await fetch(
          `https://mercury.tarzanway.com/api/v1/geos/search/user_location/?ip=${ip}`,
        );
        const data: UserLocationData = await locRes.json();
        localStorage.setItem("userLocationData", JSON.stringify(data));
        setUserLocationData(data);
      } catch {
        setUserLocationData({
          text: "Unknown Location",
          place_id: "",
          types: [],
          lat: 0,
          long: 0,
          country: "",
          continent: "",
          source: "fallback",
        });
      } finally {
        setIsLoadingLocation(false);
      }
    };
    fetch_();
  }, []);

  return { userLocationData, isLoadingLocation };
}

function getAuthToken(): string | null {
  return (
    localStorage.getItem("token") ??
    localStorage.getItem("authToken") ??
    localStorage.getItem("access_token") ??
    null
  );
}

const Spinner = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className="animate-spin"
    style={{ color: "#6b7280" }}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
      strokeDasharray="60"
      strokeDashoffset="20"
    />
  </svg>
);

const TripPlanningLoader = () => (
  <div className="flex items-start gap-2 mb-4">
    <div className="flex items-center gap-2">
      <Spinner size={14} />
      <span className="text-sm text-black">Your trip is being planned</span>
    </div>
  </div>
);

const WelcomeState = () => (
  <div className="flex flex-col items-center justify-center h-full px-6 pb-20 select-none">
    <div
      className="w-28 h-28 rounded-full mb-7 flex items-center justify-center shadow-md"
      style={{
        background: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)",
      }}
    >
      <span className="text-5xl" role="img" aria-label="travel">
        🌍
      </span>
    </div>
    <h2
      className="text-[22px] font-semibold text-gray-900 mb-2 tracking-tight"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      Planning a trip today?
    </h2>
    <p className="text-[13px] text-gray-400 text-center max-w-xs leading-relaxed">
      I'm Kaira — your AI travel companion. Ask me anything about destinations,
      itineraries, routes, or local tips.
    </p>
  </div>
);

export function ChatKitPanel({
  onLocationReceived,
  onNewQuery,
  onClearMap,
  onRouteReceived,
  onItineraryReceived,
  onRouteEndpointsReceived,
  botMode = "p1",
  itineraryId = "",
  onBotModeChange,
  onItineraryIdChange,
  initialPrompt = null,
  initialAttachmentIds,
  onSendReady,
  onItineraryCompletionStart,
onItineraryCompletionDone,
onItineraryRefresh,
  onLoadRouteOnMap,
restoredThread,
onInitialPromptConsumed,
sessionId: propSessionId,
isItineraryCompleting = false,
itineraryCompleted = false,
onPaymentStart,
travellerStory = null,
onTravellerStoryDismiss,
}: ChatKitPanelProps) {
  // ── State ────────────────────────────────────────────────────────────────
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("high");
  const [localItineraryId, setLocalItineraryId] = useState(itineraryId);
  const [showControls, setShowControls] = useState(false);
  const [errorDismissed, setErrorDismissed] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [postLoginLoading, setPostLoginLoading] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  

    // ── Auth ─────────────────────────────────────────────────────────────────
  const reduxToken = useSelector((state: any) => state.auth.token);
  const reduxUserId = useSelector((state: any) => state.auth.id);
  const itinerary = useSelector((state: any) => state.Itinerary);
  const callPaymentInfo = useSelector((state: any) => state.CallPaymentInfo);
  const authToken = reduxToken ?? getAuthToken();
  const isLoggedIn = !!authToken;

  // Widget messages whose CTAs should render disabled. Populated when a user
  // clicks a CTA (to prevent double-submission while the server processes the
  // action) and when thread history loads (past interactions are frozen).
  const [disabledWidgetIds, setDisabledWidgetIds] = useState<Set<string>>(
    () => new Set(),
  );
  const markWidgetDisabled = useCallback((id: string) => {
    if (!id) return;
    setDisabledWidgetIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const dispatch = useDispatch();

  // Shared helper for drawer CTAs opened from chat widgets. The chat flow
  // used to round-trip through sendWidgetAction("*.add", …); we now call the
  // real booking API directly so the itinerary updates without depending on
  // the p2 chatkit handler. Success / failure is surfaced via the standard
  // notification store.
  const postBookingAction = useCallback(
    async (
      path: string,
      body: Record<string, unknown>,
      successText: string,
    ): Promise<any | null> => {
      if (!localItineraryId) return null;
      if (!authToken) {
        setShowLoginModal(true);
        return null;
      }
      try {
        const res = await axios.post(
          `${MERCURY_HOST}/api/v1/itinerary/${localItineraryId}/${path}`,
          body,
          { headers: { Authorization: `Bearer ${authToken}` } },
        );
        dispatch(
          openNotification({
            type: "success",
            text: successText,
            heading: "Success!",
          }),
        );
        return res?.data ?? null;
      } catch (err: any) {
        console.error("[Chat drawer booking] error:", err);
        const msg =
          err?.response?.data?.errors?.[0]?.message?.[0] ||
          err?.message ||
          "Something went wrong. Please try again.";
        dispatch(
          openNotification({
            type: "error",
            text: msg,
            heading: "Error!",
          }),
        );
        return null;
      }
    },
    [localItineraryId, authToken, dispatch],
  );

  // Mirrors updatedActivityBooking() in ActivityDetailsDrawer.jsx: after the
  // /bookings/activity/ POST returns, splice the new booking into the city's
  // activities list and the matching day_by_day slab so the itinerary view
  // refreshes without waiting for a full refetch.
  const applyActivityBookingToItinerary = useCallback(
    (bookingData: any, itineraryCityId: string | undefined) => {
      if (!bookingData || !itineraryCityId || !itinerary?.cities) return;

      const formatTime = (time24?: string) => {
        if (!time24) return null;
        const [hours, minutes] = time24.split(":");
        const hour = parseInt(hours, 10);
        if (isNaN(hour)) return null;
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${hour12}:${minutes}`;
      };

      const bookingDate = bookingData?.check_in?.split(" ")?.[0] ?? null;

      const newCities = itinerary.cities.map((city: any) => {
        if (city?.id !== itineraryCityId) return city;
        const updatedActivities = [...(city?.activities || []), bookingData];

        const slabElement = {
          activity: bookingData?.activity?.id,
          booking: {
            id: bookingData?.id,
            pax:
              (bookingData?.number_of_adults || 0) +
              (bookingData?.number_of_children || 0) +
              (bookingData?.number_of_infants || 0),
            duration: bookingData?.duration,
          },
          element_type: "activity",
          heading:
            bookingData?.activity_data?.display_name ||
            bookingData?.activity?.name,
          icon: bookingData?.image,
          poi: null,
          tags: bookingData?.activity_data?.tags || [],
          rating: bookingData?.activity?.rating,
          user_ratings_total: bookingData?.activity?.user_ratings_total,
          start_time:
            formatTime(bookingData?.check_in?.split(" ")?.[1]) || null,
          end_time:
            formatTime(bookingData?.check_out?.split(" ")?.[1]) || null,
        };

        const updatedDayByDay = city?.day_by_day?.map((day: any) => {
          if (day?.date === bookingDate) {
            return {
              ...day,
              slab_elements: [...(day?.slab_elements || []), slabElement],
            };
          }
          return day;
        });

        return {
          ...city,
          activities: updatedActivities,
          day_by_day: updatedDayByDay,
        };
      });

      dispatch(setItinerary({ ...itinerary, cities: newCities }));
      dispatch(SetCallPaymentInfo(!callPaymentInfo));
    },
    [itinerary, callPaymentInfo, dispatch],
  );

  // POI / restaurant booking: mirrors NewPoiDetailsDrawer's local-state
  // patch — append the response slab element into the matched day_by_day
  // bucket. Prefers a date match when available; falls back to the
  // day_by_day index passed in the request body.
  const applySlabToItinerary = useCallback(
    (
      slabData: any,
      itineraryCityId: string | undefined,
      dateISO: string | undefined,
      dayByDayIndex: number = 0,
    ) => {
      if (!slabData || !itineraryCityId || !itinerary?.cities) return;

      const newCities = itinerary.cities.map((city: any) => {
        if (city?.id !== itineraryCityId) return city;
        const dayByDay = [...(city?.day_by_day || [])];
        let targetIndex = dateISO
          ? dayByDay.findIndex((d) => d?.date === dateISO)
          : -1;
        if (targetIndex < 0) targetIndex = dayByDayIndex;
        if (dayByDay[targetIndex]) {
          dayByDay[targetIndex] = {
            ...dayByDay[targetIndex],
            slab_elements: [
              ...(dayByDay[targetIndex]?.slab_elements || []),
              slabData,
            ],
          };
        }
        return { ...city, day_by_day: dayByDay };
      });

      dispatch(setItinerary({ ...itinerary, cities: newCities }));
      dispatch(SetCallPaymentInfo(!callPaymentInfo));
    },
    [itinerary, callPaymentInfo, dispatch],
  );

  // Hotel add / change: the chat backend may return either a full updated
  // itinerary or just the new booking. If `cities` (or `itinerary.cities`)
  // is present treat it as a replacement; otherwise rely on the
  // CallPaymentInfo toggle to refresh price-aware surfaces.
  const applyHotelMutationToItinerary = useCallback(
    (responseData: any) => {
      if (responseData?.cities && Array.isArray(responseData.cities)) {
        dispatch(setItinerary(responseData));
      } else if (responseData?.itinerary?.cities) {
        dispatch(setItinerary(responseData.itinerary));
      }
      dispatch(SetCallPaymentInfo(!callPaymentInfo));
    },
    [callPaymentInfo, dispatch],
  );

  // ── Detail Drawer State ─────────────────────────────────────────────────
  const [activityDrawer, setActivityDrawer] = useState<{
    show: boolean;
    activityId?: string;
    date?: string;
    itinerary_city_id?: string;
  }>({ show: false });

  const [transferDrawer, setTransferDrawer] = useState<{
    show: boolean;
    origin?: any;
    destination?: any;
    check_in?: string;
    routeId?: string;
    booking_type?: string;
    origin_itinerary_city_id?: string;
    destination_itinerary_city_id?: string;
    originCityId?: string;
    destinationCityId?: string;
    city?: string;
    dcity?: string;
    initialMode?: string;
    initialEdgeId?: string;
    isMercury?: boolean;
  }>({ show: false });

  // Lookup map built from display_transfers effects so transfer.select
  // widget actions (which carry only an edge id) can be expanded into the
  // full context TransferEditDrawer needs to skip its mode-selection step.
  const transferEdgeMapRef = useRef<
    Record<
      string,
      {
        mode: string;
        from_city?: string;
        to_city?: string;
        from_city_id?: string;
        to_city_id?: string;
        from_itinerary_city_id?: string;
        to_itinerary_city_id?: string;
        check_in?: string;
      }
    >
  >({});

  // Walk a widget tree and index any transfer.* click action by its id, so
  // TransferEditDrawer can skip its mode-selection step when the user clicks.
  // Handles three shapes:
  //   • transfer.select — legacy, payload carries only { id }; mode inferred
  //     from the nearest Badge.label in the enclosing card.
  //   • transfer.view   — multi-segment payload with segments[]; use the
  //     first segment's mode and capture origin/destination cities.
  //   • transfer.detail — same segment shape as transfer.view.
  const indexEdgesFromWidget = useCallback((widget: any) => {
    if (!widget || typeof widget !== "object") return;
    const visit = (node: any, inheritedMode?: string) => {
      if (!node || typeof node !== "object") return;
      const kids = Array.isArray(node.children) ? node.children : [];
      let scopeMode = inheritedMode;
      for (const c of kids) {
        if (c?.type === "Badge" && typeof c.label === "string") {
          scopeMode = c.label;
        }
      }
      const actionType = node.onClickAction?.type as string | undefined;
      const payload = node.onClickAction?.payload ?? {};
      if (actionType === "transfer.select") {
        const id = payload?.id;
        if (id && !transferEdgeMapRef.current[id]) {
          transferEdgeMapRef.current[id] = { mode: scopeMode || "" };
        } else if (
          id &&
          scopeMode &&
          !transferEdgeMapRef.current[id]?.mode
        ) {
          transferEdgeMapRef.current[id] = {
            ...transferEdgeMapRef.current[id],
            mode: scopeMode,
          };
        }
      } else if (
        actionType === "transfer.view" ||
        actionType === "transfer.detail"
      ) {
        const segments: any[] = Array.isArray(payload.segments)
          ? payload.segments
          : [];
        const firstMode = segments[0]?.mode as string | undefined;
        const dateRaw = (payload.transfer_date ??
          payload.date ??
          payload.startDate) as string | undefined;
        const checkIn = dateRaw ? String(dateRaw).slice(0, 10) : undefined;
        // Index every segment id and the payload id itself.
        const ids = [
          payload.id,
          payload.bookingId,
          payload.booking_id,
          ...segments.map((s) => s?.id ?? s?.transfer_id),
        ].filter(Boolean);
        for (const id of ids) {
          transferEdgeMapRef.current[id as string] = {
            ...transferEdgeMapRef.current[id as string],
            mode: firstMode ?? scopeMode ?? "",
            from_city: payload.from_city as string | undefined,
            to_city: payload.to_city as string | undefined,
            from_city_id: (payload.origin_city_id ??
              payload.originCityId) as string | undefined,
            to_city_id: (payload.destination_city_id ??
              payload.destinationCityId) as string | undefined,
            from_itinerary_city_id: (payload.origin_itinerary_city_id ??
              payload.originItineraryCityId) as string | undefined,
            to_itinerary_city_id: (payload.destination_itinerary_city_id ??
              payload.destinationItineraryCityId) as string | undefined,
            check_in: checkIn,
          };
        }
      }
      for (const c of kids) visit(c, scopeMode);
    };
    visit(widget);
  }, []);

  const indexTransfersForLookup = useCallback((raw: any) => {
    if (!raw) return;
    // Normalise: accept an array of transfers, a { transfers: [...] } wrapper,
    // or a single transfer object with edges[].
    const list: any[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.transfers)
        ? raw.transfers
        : Array.isArray(raw?.data?.transfers)
          ? raw.data.transfers
          : Array.isArray(raw?.edges)
            ? [raw]
            : [];

    for (const t of list) {
      const edges = t?.edges ?? [];
      for (const e of edges) {
        if (!e?.id) continue;
        transferEdgeMapRef.current[e.id] = {
          mode: e.mode,
          from_city: t.from_city,
          to_city: t.to_city,
          from_city_id: t.from_city_id,
          to_city_id: t.to_city_id,
          from_itinerary_city_id: t.from_itinerary_city_id,
          to_itinerary_city_id: t.to_itinerary_city_id,
          check_in: e.start_datetime
            ? String(e.start_datetime).slice(0, 10)
            : undefined,
        };
      }
    }
  }, []);

  // Hotel detail drawer (opened from "hotel.view" / "hotel.detail" widget actions).
  // The server can emit either:
  //   • hotel.view    : { id, itineraryCityId, dbCityId, startDate, endDate, bookingId }
  //   • hotel.detail  : { hotelId, itineraryCityId, dbCityId, startDate, endDate, ... }
  // These drive AccommodationDetailDrawer and, in p2 stage, the Add/Change CTA.
  const [hotelDrawer, setHotelDrawer] = useState<{
    show: boolean;
    accommodationId?: string;
    itinerary_city_id?: string;
    dbCityId?: string;
    check_in?: string;
    check_out?: string;
    bookingId?: string;
  }>({ show: false });

  // POI / Restaurant detail drawer — opened by place.view / place.detail /
  // restaurant.view / restaurant.detail widget actions. POIDetailsDrawer
  // fetches data based on activityData.type ("poi" | "restaurant").
  const [poiDrawer, setPoiDrawer] = useState<{
    show: boolean;
    id?: string;
    name?: string;
    kind?: "poi" | "restaurant";
    itinerary_city_id?: string;
    date?: string;
  }>({ show: false });

  // ── Pagination state ─────────────────────────────────────────────────────
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const hasMoreRef = useRef(false);
  const beforeCursorRef = useRef<string | null>(null);
  const isFetchingMoreRef = useRef(false);

  // Tracks whether the user is pinned to the bottom of the message list. The
  // auto-scroll effect only fires when this is true, so the transcript won't
  // yank away from a user who's scrolled up to read earlier messages.
  const isAtBottomRef = useRef(true);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const hasProcessedInitial = useRef(false);
  const hasUpdatedUrl = useRef(false);
  const postLoginFiredRef = useRef(false);
  const loginFlowArmedRef = useRef(false);
  const pendingPostLoginMsg = useRef<string | null>(null);
  const hasInjectedContextRef = useRef(false);
  const inputRef = useRef(input);
useEffect(() => { inputRef.current = input; }, [input]);
const prevAuthTokenRef = useRef<string | null>(null);
const lastSentMessageRef = useRef<string>("");

  /**
   * Frontend-generated UUID for this chat session.
   * Created once when the component mounts (useRef keeps it stable across
   * re-renders without triggering additional renders).
   * Sent as session_id in every API request.
   * Also used as the URL segment: /chat/{sessionId}
   */
const sessionIdRef = useRef<string>((() => {
    if (propSessionId) return propSessionId;
    // 2. Fall back to URL
    const match = window.location.pathname.match(/\/chat\/([a-f0-9-]{36})/);
    if (match) return match[1];
    // 3. Generate new (only for fresh /chat)
    return generateSessionId();
  })());

  const isFirstMessageRef = useRef(true);

  /**
   * Stable ref to sendWidgetAction — lets handleEffect call it without
   * being defined before useChat (which would break hook ordering).
   */
  const sendWidgetActionRef = useRef<
    ((type: string, payload: Record<string, unknown>) => void) | null
  >(null);

  /**
   * Stable indirection for handleEffect — passed to useChat as onEffect so
   * we can define handleEffect *after* useChat without a circular dependency.
   */
  const handleEffectRef = useRef<
    ((effect: { name: string; data: Record<string, unknown> }) => void) | null
  >(null);



  // ── Location ─────────────────────────────────────────────────────────────
  const { userLocationData, isLoadingLocation } = useUserLocationData();
  const locationReady = !isLoadingLocation;
  const [entities, setEntities] = useState<Record<string, { name: string; type: string }>>({});


  // ── Session created ───────────────────────────────────────────────────────
  // Called by useChat after the first API response confirms the thread.
  // We use our own UUID (not the API thread_id) for the URL.
const handleSessionCreated = useCallback((ourSessionId: string) => {
  if (hasUpdatedUrl.current) return;

  // Don't overwrite if URL already has a valid session ID
  const alreadyInUrl = window.location.pathname.match(/\/chat\/([a-f0-9-]{36})/);
  if (alreadyInUrl) {
    hasUpdatedUrl.current = true;
    return;
  }

  hasUpdatedUrl.current = true;
  const target = `/chat/${ourSessionId}`;
  window.history.pushState({}, "", target);
  sessionStorage.setItem(`chatkit_session_${target}`, ourSessionId);
}, []);

  // ── useChat ───────────────────────────────────────────────────────────────
  const apiUrl =
    botMode === "p2"
      ? "https://chat.tarzanway.com/chatkit/p2"
      : CHATKIT_API_URL;

  // Stable onEffect wrapper — must be a named useCallback, never inline inside
  // the useChat({}) call, otherwise React mis-counts hook calls across renders.
  const stableOnEffect = useCallback(
    (effect: { name: string; data: Record<string, unknown> }) => {
      handleEffectRef.current?.(effect);
    },
    [], // empty deps: this wrapper never changes; handleEffectRef.current does
  );

const { messages, isStreaming, error, sendMessage: rawSendMessage,
  sendWidgetAction, clearMessages, cancelStream, setMessages, threadIdRef }= useChat({
    apiUrl,
    domainKey: CHATKIT_DOMAIN_KEY,
    model: selectedModel,
    userLocation: userLocationData,
    locationReady,
    botMode,
    itineraryId: localItineraryId,
    onEffect: stableOnEffect,
    authToken: authToken ?? undefined,
    userId: reduxUserId ?? undefined,
    // The stable frontend UUID — never changes for the lifetime of this component
    sessionId: sessionIdRef.current,
    onSessionCreated: handleSessionCreated,
  });

  // Keep sendWidgetActionRef current after every render
  sendWidgetActionRef.current = sendWidgetAction;

  // Remember the most recently emitted start/end so we only fire the endpoint
  // callback when it actually changes (back-to-back effects in one turn often
  // repeat the same endpoints).
  const lastEndpointsRef = useRef<string>("");

  // Resolve an endpoint from an effect payload, falling back to the user's
  // current location when the server omits name/place id. Returns null only if
  // both the effect and the user location are empty (ChatKitPanel has no
  // sensible default beyond that).
  const resolveEndpoint = useCallback(
    (raw: any): CityEndpoint | null => {
      const name = raw?.name ?? raw?.city ?? raw?.city_name;
      const placeId = raw?.gmaps_place_id ?? raw?.place_id;
      if (name || placeId) {
        return {
          name: String(name ?? ""),
          gmaps_place_id: String(placeId ?? ""),
        };
      }
      if (userLocationData?.place_id || userLocationData?.text) {
        return {
          name: userLocationData.text ?? "",
          gmaps_place_id: userLocationData.place_id ?? "",
        };
      }
      return null;
    },
    [userLocationData],
  );

  // Extract start_city / end_city from any supported effect payload and
  // forward to the parent. Shapes handled:
  //   • shimmer_day_by_day / display_itinerary: { start_city, end_city } at the
  //     effect data root (or nested under .itinerary for display_itinerary).
  //   • display_transfers: uses start_transfer.from_city / end_transfer.to_city.
  const emitEndpointsFromEffect = useCallback(
    (effectName: string, data: Record<string, unknown>) => {
      if (!onRouteEndpointsReceived) return;
      let startRaw: any = null;
      let endRaw: any = null;

      if (effectName === "display_transfers") {
        const st = (data as any)?.start_transfer;
        const et = (data as any)?.end_transfer;
        if (st) startRaw = { name: st.from_city, gmaps_place_id: st.from_itinerary_city_id };
        if (et) endRaw = { name: et.to_city, gmaps_place_id: et.to_itinerary_city_id };
      } else {
        const root: any =
          effectName === "display_itinerary"
            ? ((data as any)?.itinerary ?? data)
            : data;
        startRaw = root?.start_city ?? null;
        endRaw = root?.end_city ?? null;
      }

      const start = resolveEndpoint(startRaw);
      const end = resolveEndpoint(endRaw);

      // Skip no-op re-emits so the map doesn't re-geocode on every chunk.
      const signature = JSON.stringify({ start, end });
      if (signature === lastEndpointsRef.current) return;
      lastEndpointsRef.current = signature;

      onRouteEndpointsReceived({ start_city: start, end_city: end });
    },
    [onRouteEndpointsReceived, resolveEndpoint],
  );

  // ── handleEffect (defined after useChat — safe, no hook-order issue) ──────
  const handleEffect = useCallback(
    ({ name, data }: { name: string; data: Record<string, unknown> }) => {
      console.log("[Effect triggered]", name, data);
      switch (name) {
        case "clear_map": {
          onClearMap?.(data);
          break;
        }
        case "focus_on_map": {
          onNewQuery();
          if (data.data) onLocationReceived(data as { data: Location[] });
          break;
        }
        case "focus_route": {
          if (data.data) onRouteReceived(data as { data: Location[] });
          break;
        }
        case "display_itinerary": {
          emitEndpointsFromEffect(name, data);
          onItineraryReceived(data.itinerary);
          break;
        }
        case "display_transfers": {
          emitEndpointsFromEffect(name, data);
          indexTransfersForLookup(data);
          onItineraryReceived(data);
  break;
        }
        case "route.lock":
        case "route.edit":
        case "route.remove":
        case "route.reorder.start":
        case "itinerary.lock": {
          sendWidgetActionRef.current?.(name, data);
          break;
        }
        case "load_itinerary": {
          if (data.redirect_url && typeof data.redirect_url === "string") {
            window.location.href = data.redirect_url;
          }
          break;
        }
case "prompt_login": {
  console.log("[prompt_login] storing pending from lastSent:", lastSentMessageRef.current);
  pendingPostLoginMsg.current = lastSentMessageRef.current || null;
  loginFlowArmedRef.current = true;
  setShowLoginPrompt(true);
  break;
}
        case "display_pois_on_map":
        case "show_attraction_on_map": {
          onNewQuery();
          if (data.data) onLocationReceived(data as { data: Location[] });
          break;
        }
        case "itinerary_entities": {
  const raw = (data.entities ?? {}) as Record<string, { name: string; type: string }>;
  setEntities(prev => ({ ...prev, ...raw }));
  break;
}
case "load_route_on_map": {
  onLoadRouteOnMap?.();
  break;
}
case "itinerary_completion_process_completed": {
  const completedId = data.itinerary_id as string;
  const summary = (data.summary as string) ?? "";
  if (completedId) {
    onItineraryCompletionDone?.(completedId, summary);
  }
  break;
}

case "refresh_itinerary": {
  // Always fire so BotApp can clear stale cities/start_city/end_city and
  // avoid the stacked-ghost-pins problem on mid-chat edits. Polling only
  // starts if we have a real id to poll against.
  const refreshId = (data.itinerary_id as string) || localItineraryId || "";
  onItineraryRefresh?.(refreshId);
  break;
}

case "start_itinerary_completion_process": {
  const startId = data.itinerary_id as string;
  onItineraryCompletionStart?.(startId ?? "pending");
  // The itinerary ID arrives with this effect — set up polling with the real ID
  if (startId) {
    onItineraryCompletionDone?.(startId);
  }
  break;
}
case "shimmer_day_by_day": {
  emitEndpointsFromEffect(name, data);
  onItineraryReceived({ shimmer: true });
  break;
}
        case "delete_poi_from_itinerary": {
          const payload = (data.data ?? {}) as Record<string, unknown>;
          dispatch(deletePoiFromItinerary(payload));
          const text = typeof data.message === "string" ? data.message : "POI removed from your itinerary.";
          dispatch(openNotification({ type: "success", heading: "Success!", text }));
          break;
        }
        case "delete_activity_from_itinerary": {
          const payload = (data.data ?? {}) as Record<string, unknown>;
          dispatch(deleteActivityFromItinerary(payload));
          const text = typeof data.message === "string" ? data.message : "Activity removed from your itinerary.";
          dispatch(openNotification({ type: "success", heading: "Success!", text }));
          break;
        }
        case "delete_restaurant_from_itinerary": {
          const payload = (data.data ?? {}) as Record<string, unknown>;
          dispatch(deleteRestaurantFromItinerary(payload));
          const text = typeof data.message === "string" ? data.message : "Restaurant removed from your itinerary.";
          dispatch(openNotification({ type: "success", heading: "Success!", text }));
          break;
        }
        case "load_quick_replies": {
          const raw =
            (data.replies as any[]) ??
            (data.quick_replies as any[]) ??
            (data.data as any[]) ??
            [];
          const parsed: QuickReply[] = Array.isArray(raw)
            ? raw.map((r: any) =>
                typeof r === "string"
                  ? { label: r }
                  : {
                      label: r.label ?? r.text ?? String(r),
                      value: r.value ?? r.text ?? r.label,
                    },
              )
            : [];
          setQuickReplies(parsed);
          break;
        }
        default:
          console.warn("[Effect] unhandled:", name);
      }
    },
    [onLocationReceived, onNewQuery, onClearMap, onRouteReceived, onItineraryReceived, input, indexTransfersForLookup, emitEndpointsFromEffect, dispatch],
  );

  // Wire handleEffect into the ref so the stable onEffect wrapper picks it up
  handleEffectRef.current = handleEffect;

  // ── Wrap sendMessage to clear quick replies ───────────────────────────────
const sendMessage = useCallback(
  (text: string, attachmentIds?: string[], attachmentMeta?: MessageAttachment[]) => {
    setQuickReplies([]);
    lastSentMessageRef.current = text;

    // User-initiated send: snap the view to the latest message even if they
    // had scrolled up earlier in the session.
    isAtBottomRef.current = true;

    if (isFirstMessageRef.current) {
      isFirstMessageRef.current = false;
    }
    rawSendMessage(text, attachmentIds, attachmentMeta);
  },
  [rawSendMessage],
);

  // ── Side-effects ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!error) setErrorDismissed(false);
  }, [error]);

  useEffect(() => {
    // Don't auto-scroll to bottom when older messages are being prepended
    if (isFetchingMoreRef.current) return;
    // Respect the user's scroll position: if they've scrolled up to read
    // earlier messages, don't yank the view back down while streaming.
    if (!isAtBottomRef.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Index transfer.select edge ids → mode from live widget messages, so the
  // TransferEditDrawer can skip its mode-selection step when the user clicks.
  useEffect(() => {
    for (const m of messages) {
      if ((m as any)?.type === "widget") {
        indexEdgesFromWidget((m as any)?.widgetItem?.widget);
      }
    }
  }, [messages, indexEdgesFromWidget]);

useEffect(() => {
  if (initialPrompt && !hasProcessedInitial.current && locationReady) {
    hasProcessedInitial.current = true;
    sendMessage(initialPrompt, initialAttachmentIds);
    onInitialPromptConsumed?.();
  }
}, [initialPrompt, initialAttachmentIds, locationReady, sendMessage, onInitialPromptConsumed]);

  useEffect(() => {
    onSendReady?.(sendMessage);
  }, [onSendReady, sendMessage]);

  // ── Inject context when itinerary is fully completed ──────────────────────
  useEffect(() => {
    if (itineraryCompleted && !hasInjectedContextRef.current && !isStreaming) {
      hasInjectedContextRef.current = true;
      sendWidgetAction("inject.context", { message: "Provide short overview of the trip" });
    }
  }, [itineraryCompleted, isStreaming, sendWidgetAction]);

useEffect(() => {
  const tokenJustArrived =
    !!authToken && !prevAuthTokenRef.current;
  prevAuthTokenRef.current = authToken ?? null;

  if (!tokenJustArrived) return;                    // only fire on login transition
  if (postLoginFiredRef.current) return;

  const msg = pendingPostLoginMsg.current;
  if (!msg) return;

  postLoginFiredRef.current = true;
  pendingPostLoginMsg.current = null;

  setShowLoginModal(false);
  setShowLoginPrompt(false);
  setPostLoginLoading(false);
  setInput("");

  // One tick defer — lets useChat re-render with new authToken before sending
  setTimeout(() => {
    sendMessage(msg);
  }, 100);
}, [authToken, sendMessage]);

// ── Reset on logout ───────────────────────────────────────────────────────
useEffect(() => {
  if (!isLoggedIn) {
    postLoginFiredRef.current = false;
    prevAuthTokenRef.current = null;
    setPostLoginLoading(false);
  }
}, [isLoggedIn]);

  useEffect(() => {
    setLocalItineraryId(itineraryId);
  }, [itineraryId]);

  // Convert raw thread items (from threads.get_by_id payloads) into Message[]
  const parseThreadItems = useCallback((items: any[]): Message[] => {
    const out: Message[] = [];
    for (const item of items ?? []) {
      if (item.type === "user_message") {
        const text = item.content?.find((c: any) => c.type === "input_text")?.text ?? "";

        // Extract attachments — server may return them as a sibling array of
        // {id, name, mime_type, url, ...} objects, as plain id strings, or as
        // input_image / input_file content parts. Handle all shapes.
        const attachmentObjs: MessageAttachment[] = [];
        if (Array.isArray(item.attachments)) {
          for (const a of item.attachments) {
            if (typeof a === "string") {
              attachmentObjs.push({ id: a });
            } else if (a && typeof a === "object") {
              attachmentObjs.push({
                id: a.id,
                name: a.name,
                mimeType: a.mime_type ?? a.mimeType,
                previewUrl: a.url ?? a.preview_url ?? a.download_url,
              });
            }
          }
        }
        if (Array.isArray(item.content)) {
          for (const c of item.content) {
            if (c?.type === "input_image" || c?.type === "input_file") {
              attachmentObjs.push({
                id: c.attachment_id ?? c.id ?? "",
                name: c.name,
                mimeType: c.mime_type ?? c.mimeType,
                previewUrl: c.url ?? c.image_url,
              });
            }
          }
        }

        if (text || attachmentObjs.length > 0) out.push({
          id: item.id, role: "user", content: text,
          timestamp: new Date(item.created_at),
          ...(attachmentObjs.length > 0 ? { attachments: attachmentObjs } : {}),
        });
      } else if (item.type === "assistant_message") {
        const text = item.content?.find((c: any) => c.type === "output_text")?.text ?? "";
        if (text) out.push({
          id: item.id, role: "assistant", content: text,
          timestamp: new Date(item.created_at), isStreaming: false,
        });
      } else if (item.type === "widget") {
        indexEdgesFromWidget(item.widget);
        out.push({
          id: item.id, role: "assistant", content: "",
          timestamp: new Date(item.created_at),
          type: "widget", widgetItem: { id: item.id, widget: item.widget },
        });
      }
    }
    return out;
  }, []);

  useEffect(() => {
  if (!restoredThread || !setMessages) return;

  const restored = parseThreadItems(restoredThread.items?.data ?? []);

    const itineraryEffects: any[] = restoredThread.itinerary_effects ?? [];
    const mapEffects: any[] = restoredThread.map_effects ?? [];

  for (const effect of itineraryEffects) {
    if (effect.name === "itinerary_entities" && effect.data?.entities) {
      setEntities(prev => ({ ...prev, ...effect.data.entities }));
    }
  }

  // ── Replay map effects so city pins + POI pins render on thread reload ──
  for (const effect of mapEffects) {
    if (!effect?.data) continue;
    switch (effect.name) {
      case "focus_route": {
        // Route can be either { data: [...] } or a raw array — normalise
        const routeData = Array.isArray(effect.data)
          ? { data: effect.data }
          : effect.data;
        onRouteReceived(routeData as { data: Location[] });
        break;
      }
      case "display_pois_on_map":
      case "show_attraction_on_map":
      case "focus_on_map": {
        const poiData = Array.isArray(effect.data)
          ? { data: effect.data }
          : effect.data;
        onLocationReceived(poiData as { data: Location[] });
        break;
      }
      default:
        break;
    }
  }

  // ── Replay itinerary + transfers so the right panel re-populates on reload ─
  // Also replay endpoint pins from the latest endpoint-bearing effect, so the
  // map re-hydrates origin/departure pins on thread reload.
  //
  // If the thread already emitted an `itinerary_completion_process_completed`
  // effect (i.e. the trip has reached P2), skip replaying the draft-shaped
  // display_itinerary / display_transfers. These transform into a
  // status="Draft" itinerary and clobber the real P2 data that the
  // ItineraryContainer fetches for the finalized trip — which is what made
  // P1 start-city pins resurface on P2 reloads.
  const threadIsCompleted = itineraryEffects.some(
    (e: any) => e?.name === "itinerary_completion_process_completed" && e?.data?.itinerary_id,
  );

  let latestEndpointEffect: { name: string; data: Record<string, unknown> } | null = null;
  for (const effect of itineraryEffects) {
    if (effect.name === "display_itinerary" && effect.data?.itinerary) {
      if (!threadIsCompleted) onItineraryReceived(effect.data.itinerary);
      latestEndpointEffect = effect;
    } else if (effect.name === "display_transfers" && effect.data) {
      indexTransfersForLookup(effect.data);
      if (!threadIsCompleted) onItineraryReceived(effect.data);
      latestEndpointEffect = effect;
    } else if (effect.name === "shimmer_day_by_day" && effect.data) {
      latestEndpointEffect = effect;
    }
  }
  // Endpoint pins are only meaningful in P1; the P2 itinerary renders its
  // own start/end city pins via the normal itinerary path.
  if (latestEndpointEffect && !threadIsCompleted) {
    emitEndpointsFromEffect(latestEndpointEffect.name, latestEndpointEffect.data);
  }

  if (restored.length > 0) setMessages(restored);

  // Freeze CTAs on every widget restored from history — those interactions
  // belong to a past session and shouldn't be re-clickable.
  const restoredWidgetIds = restored
    .filter((m) => (m as any).type === "widget")
    .map((m) => m.id)
    .filter((id): id is string => typeof id === "string" && id.length > 0);
  if (restoredWidgetIds.length > 0) {
    setDisabledWidgetIds((prev) => {
      const next = new Set(prev);
      for (const id of restoredWidgetIds) next.add(id);
      return next;
    });
  }

  // Restore thread_id so subsequent messages work
  if (restoredThread.id) threadIdRef.current = restoredThread.id;

  // Capture pagination cursor + has_more from items envelope
  hasMoreRef.current = !!restoredThread.items?.has_more;
  // Use the API-supplied `before` cursor if present, else fall back to oldest msg id
  beforeCursorRef.current =
    (restoredThread.items?.before as string | null) ??
    (restored.length > 0 ? restored[0].id : null);

  // Restore quick replies — use the LAST load_quick_replies effect so the
  // most recent set of suggestions is shown (effects are appended in order).
  const qrEffects = (restoredThread.itinerary_effects ?? []).filter(
    (e: any) => e.name === "load_quick_replies"
  );
  const qrEffect = qrEffects.length > 0 ? qrEffects[qrEffects.length - 1] : null;
  if (qrEffect?.data?.quick_replies) {
    setQuickReplies(qrEffect.data.quick_replies.map((r: string) => ({ label: r })));
  }
}, [restoredThread, parseThreadItems, onRouteReceived, onLocationReceived, onItineraryReceived, indexTransfersForLookup, emitEndpointsFromEffect]);

  // ── Pagination: fetch older messages ──────────────────────────────────────
  const fetchOlderMessages = useCallback(async () => {
    if (isFetchingMoreRef.current) return;
    if (!hasMoreRef.current) return;
    const threadId = threadIdRef.current;
    if (!threadId) return;
    const beforeId = beforeCursorRef.current;
    if (!beforeId) return;

    isFetchingMoreRef.current = true;
    setIsLoadingMore(true);

    // Preserve scroll position so the visible window doesn't jump
    const container = messagesScrollRef.current;
    const prevScrollHeight = container?.scrollHeight ?? 0;
    const prevScrollTop = container?.scrollTop ?? 0;

    try {
      const res = await fetch(CHATKIT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          type: "threads.get_by_id",
          params: { thread_id: threadId, before: beforeId },
        }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();

      const olderItems = data.items?.data ?? [];
      const older = parseThreadItems(olderItems);

      hasMoreRef.current = !!data.items?.has_more;
      beforeCursorRef.current =
        (data.items?.before as string | null) ??
        (older.length > 0 ? older[0].id : null);

      if (older.length > 0) {
        setMessages((prev) => [...older, ...prev]);

        // After DOM updates, restore scroll offset relative to new content height
        requestAnimationFrame(() => {
          const c = messagesScrollRef.current;
          if (!c) return;
          const newScrollHeight = c.scrollHeight;
          c.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
        });
      }
    } catch (err) {
      console.error("[fetchOlderMessages]", err);
    } finally {
      isFetchingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [authToken, parseThreadItems, setMessages]);

  // Detect scroll near top → load more. Also track whether the user is at
  // the bottom so the auto-scroll effect can respect their position.
  const handleMessagesScroll = useCallback(() => {
    const c = messagesScrollRef.current;
    if (!c) return;
    const distanceFromBottom = c.scrollHeight - c.scrollTop - c.clientHeight;
    isAtBottomRef.current = distanceFromBottom < 80;
    if (c.scrollTop <= PAGINATION_SCROLL_THRESHOLD) {
      fetchOlderMessages();
    }
  }, [fetchOlderMessages]);

  // ── Handlers ──────────────────────────────────────────────────────────────
const handleShowLogin = useCallback(() => {
  const currentInput = inputRef.current.trim();
  const msg = currentInput || lastSentMessageRef.current;
  console.log("[handleShowLogin] storing pending:", msg);
  pendingPostLoginMsg.current = msg || null;
  loginFlowArmedRef.current = true;
  setShowLoginModal(true);
}, []);

  // ── Attachment handlers ─────────────────────────────────────────────────
  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const entry: AttachmentFile = {
          id: tempId,
          name: file.name,
          size: file.size,
          mimeType: file.type || "application/octet-stream",
          status: "uploading",
          file,
        };
        setAttachments((prev) => [...prev, entry]);

        try {
          // Step 1: Create attachment record
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          };
          const createBody: Record<string, unknown> = {
            type: "attachments.create",
            params: {
              name: file.name,
              size: file.size,
              mime_type: file.type || "application/octet-stream",
            },
            model: selectedModel,
            user_location: userLocationData,
            platform:
              typeof window !== "undefined" && window.innerWidth < 768
                ? "mobile"
                : "desktop",
            session_id: sessionIdRef.current,
            ...(authToken ? { access_token: authToken } : {}),
            ...(reduxUserId != null ? { user_id: reduxUserId } : {}),
          };

          const createRes = await fetch(CHATKIT_API_URL, {
            method: "POST",
            headers,
            body: JSON.stringify(createBody),
          });
          if (!createRes.ok) throw new Error(`Create failed: ${createRes.status}`);
          const createData = await createRes.json();
          console.log("[Attachment create response]", createData);
          const serverId: string = createData.id;
          const uploadUrl: string = createData.upload_descriptor?.url;

          if (!uploadUrl) throw new Error("No upload URL returned");

          // Step 2: Upload file
          const formData = new FormData();
          formData.append("file", file);
          const uploadRes = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
          });
          if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);

          // Replace temp entry with server ID and mark uploaded
          setAttachments((prev) =>
            prev.map((a) =>
              a.id === tempId ? { ...a, id: serverId, status: "uploaded" as const } : a,
            ),
          );
        } catch (err) {
          console.error("[Attachment upload error]", err);
          setAttachments((prev) =>
            prev.map((a) =>
              a.id === tempId ? { ...a, status: "error" as const } : a,
            ),
          );
        }
      }
    },
    [authToken, selectedModel, userLocationData, reduxUserId],
  );

  const handleRemoveAttachment = useCallback(
    async (id: string) => {
      const target = attachments.find((a) => a.id === id);
      // Always remove from local state immediately for snappy UX
      setAttachments((prev) => prev.filter((a) => a.id !== id));

      // Skip server delete for entries that never got a server-assigned id
      if (!target || target.status !== "uploaded" || id.startsWith("temp-")) return;

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        };
        const body: Record<string, unknown> = {
          type: "attachments.delete",
          params: { attachment_id: id },
          model: selectedModel,
          user_location: userLocationData,
          platform:
            typeof window !== "undefined" && window.innerWidth < 768
              ? "mobile"
              : "desktop",
          ...(localItineraryId ? { itinerary_id: localItineraryId } : {}),
          session_id: sessionIdRef.current,
          ...(authToken ? { access_token: authToken } : {}),
          ...(reduxUserId != null ? { user_id: reduxUserId } : {}),
        };
        const res = await fetch(CHATKIT_API_URL, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      } catch (err) {
        console.error("[Attachment delete error]", err);
      }
    },
    [attachments, authToken, selectedModel, userLocationData, localItineraryId, reduxUserId],
  );

  const handleSubmit = useCallback(() => {
    setShowLoginPrompt(false);
    const hasText = !!input.trim();
    const uploadedAttachments = attachments.filter((a) => a.status === "uploaded");
    // Block sending while itinerary creation is in progress
    if (isItineraryCompleting) return;
    if ((!hasText && uploadedAttachments.length === 0) || isStreaming) return;
    setErrorDismissed(true);
    const attachmentIds = uploadedAttachments.map((a) => a.id);
    // Build attachment metadata with persistent object URLs for inline preview
    // in the just-sent user message bubble
    const attachmentMeta: MessageAttachment[] = uploadedAttachments.map((a) => ({
      id: a.id,
      name: a.name,
      mimeType: a.mimeType,
      previewUrl: a.mimeType.startsWith("image/")
        ? URL.createObjectURL(a.file)
        : undefined,
    }));
    sendMessage(
      input.trim(),
      attachmentIds.length > 0 ? attachmentIds : undefined,
      attachmentMeta.length > 0 ? attachmentMeta : undefined,
    );
    setInput("");
    setAttachments([]);
  }, [input, isStreaming, sendMessage, attachments, isItineraryCompleting]);

  const handleQuickReply = useCallback(
    (reply: QuickReply) => {
      if (isStreaming) return;
      // Block quick replies while itinerary creation is in progress
      if (isItineraryCompleting) return;
      sendMessage(reply.value ?? reply.label);
    },
    [isStreaming, sendMessage, isItineraryCompleting],
  );

  const showError = !!error && !errorDismissed;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className={`flex flex-col h-full min-h-0 bg-white  max-h-[100vh] md:max-h-[93.5vh] border-[0.5px] border-l-[#e5e5e5]`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 bg-white/80 backdrop-blur-sm mt-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center">
            <img src="/KairaInsta.png" alt="Kaira" />
          </div>
          <span className="text-sm md:text-[14px] font-semibold text-gray-800">Chat with Kaira <span className="font-normal">- Your AI Trip Planner</span></span>
          {isLoadingLocation && (
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <Spinner size={10} /> locating…
            </span>
          )}
        </div>
        {/* <button
          onClick={() => setShowControls((v) => !v)}
          className="text-[11px] text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
          Settings
        </button> */}
      </div>

      {/* ── Settings panel ────────────────────────────────────────────────── */}
      {showControls && (
        <div className="flex-shrink-0 flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs">
          <label className="flex items-center gap-2 text-gray-600">
            Planner
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-400 text-xs"
            >
              <option value="high">Deep Planner</option>
              <option value="medium">Quick Planner</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-gray-600">
            Bot
            <select
              value={botMode}
              onChange={(e) => onBotModeChange?.(e.target.value as BotMode)}
              className="border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-400 text-xs"
            >
              <option value="p1">Kaira P1</option>
              <option value="p2">Kaira P2</option>
            </select>
          </label>
          {botMode === "p2" && (
            <label className="flex items-center gap-2 text-gray-600">
              Itinerary ID
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={localItineraryId}
                  onChange={(e) => setLocalItineraryId(e.target.value)}
                  placeholder="Enter ID"
                  className="border border-gray-200 rounded-lg px-2 py-1 w-36 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-400 text-xs"
                />
                <button
                  onClick={() => onItineraryIdChange?.(localItineraryId)}
                  className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-lg transition-colors font-medium text-xs"
                >
                  Load
                </button>
              </div>
            </label>
          )}
        </div>
      )}

      {/* ── Messages ──────────────────────────────────────────────────────── */}
      <div
        ref={messagesScrollRef}
        onScroll={handleMessagesScroll}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4 scroll-smooth"
      >

          <div className="max-w-2xl mx-auto">
            {isLoadingMore && (
              <div className="flex items-center justify-center py-3">
                <Spinner size={16} />
                <span className="ml-2 text-xs text-gray-400">Loading older messages…</span>
              </div>
            )}
            {travellerStory && messages.length === 0 && (
              <TravellerStoryIntroCard
                story={travellerStory}
                disabled={isStreaming || isItineraryCompleting}
                onBookExact={() => {
                  sendMessage(travellerStory.prompt);
                  onTravellerStoryDismiss?.();
                }}
              />
            )}
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                entities={entities}
                widgetDisabled={
                  msg.type === "widget" && disabledWidgetIds.has(msg.id)
                }
                onWidgetAction={(action) => {
                  // Freeze this widget's CTAs the moment the user clicks one,
                  // regardless of which drawer or server call it triggers. The
                  // server response may take time and we don't want a double
                  // submission.
                  if (msg.type === "widget") markWidgetDisabled(msg.id);

                  // ── Payment ───────────────────────────────────────────
                  // Clicking "Make Payment" inside a widget opens the
                  // existing payment drawer rather than round-tripping via
                  // sendWidgetAction — the drawer owns the payment flow.
                  if (action.type === "payment.start") {
                    onPaymentStart?.();
                    return;
                  }

                  const payload = action.payload ?? {};

                  // ── Activity ──────────────────────────────────────────
                  // activity.view / activity.detail / open_activity_drawer
                  // all route to ActivityDetailsDrawer. Field names differ
                  // by variant — .view uses {id,itineraryCityId,startDate};
                  // .detail and open_activity_drawer use {activityId,
                  // itineraryCityId,startDate}. Accept either.
                  if (
                    action.type === "activity.view" ||
                    action.type === "activity.detail" ||
                    action.type === "open_activity_drawer"
                  ) {
                    const activityId = (payload.activityId ??
                      payload.activity_id ??
                      payload.id) as string;
                    const itineraryCityId = (payload.itineraryCityId ??
                      payload.itinerary_city_id ??
                      payload.city_id) as string | undefined;
                    const date = (payload.startDate ??
                      payload.start_date ??
                      payload.date) as string | undefined;
                    setActivityDrawer({
                      show: true,
                      activityId,
                      date,
                      itinerary_city_id: itineraryCityId,
                    });
                    return;
                  }

                  // ── Place / POI ──────────────────────────────────────
                  // place.view / place.detail open POIDetailsDrawer in "poi"
                  // mode. Legacy widgets may send an activity_id — fall back
                  // to ActivityDetailsDrawer only if explicit activity context
                  // is present (preserves the older "place.view carrying
                  // activity payload" behavior).
                  if (
                    action.type === "place.view" ||
                    action.type === "place.detail" ||
                    action.type === "open_poi_drawer" ||
                    action.type === "open_place_drawer"
                  ) {
                    const hasActivityContext =
                      payload.activity_id != null ||
                      payload.activityId != null;

                    if (hasActivityContext) {
                      setActivityDrawer({
                        show: true,
                        activityId: (payload.activityId ??
                          payload.activity_id ??
                          payload.id) as string,
                        date: (payload.startDate ??
                          payload.date) as string | undefined,
                        itinerary_city_id: (payload.itineraryCityId ??
                          payload.itinerary_city_id ??
                          payload.city_id) as string | undefined,
                      });
                    } else {
                      setPoiDrawer({
                        show: true,
                        kind: "poi",
                        id: (payload.poiId ??
                          payload.poi_id ??
                          payload.id) as string,
                        name: payload.title as string | undefined,
                        itinerary_city_id: (payload.itineraryCityId ??
                          payload.itinerary_city_id) as string | undefined,
                        date: (payload.startDate ??
                          payload.date) as string | undefined,
                      });
                    }
                    return;
                  }

                  // ── Restaurant ────────────────────────────────────────
                  // restaurant.view / restaurant.detail share POIDetailsDrawer
                  // but in "restaurant" mode (fetches /geos/restaurant/:id/).
                  if (
                    action.type === "restaurant.view" ||
                    action.type === "restaurant.detail" ||
                    action.type === "open_restaurant_drawer"
                  ) {
                    setPoiDrawer({
                      show: true,
                      kind: "restaurant",
                      id: (payload.restaurantId ??
                        payload.restaurant_id ??
                        payload.id) as string,
                      name: payload.title as string | undefined,
                      itinerary_city_id: (payload.itineraryCityId ??
                        payload.itinerary_city_id) as string | undefined,
                      date: (payload.startDate ??
                        payload.date) as string | undefined,
                    });
                    return;
                  }

                  // ── Transfer ──────────────────────────────────────────
                  // transfer.select is the legacy single-edge payload.
                  // transfer.view / transfer.detail are the richer multi-
                  // segment payloads. All three open TransferEditDrawer.
                  if (
                    action.type === "transfer.select" ||
                    action.type === "transfer.view" ||
                    action.type === "transfer.detail" ||
                    action.type === "open_transfer_drawer"
                  ) {
                    const edgeId = (payload.id ?? payload.edge_id) as
                      | string
                      | undefined;
                    const indexed = edgeId
                      ? transferEdgeMapRef.current[edgeId]
                      : undefined;
                    const checkInRaw =
                      (payload.check_in as string | undefined) ??
                      (payload.transfer_date as string | undefined) ??
                      (payload.date as string | undefined) ??
                      indexed?.check_in;
                    const checkIn = checkInRaw
                      ? String(checkInRaw).slice(0, 10)
                      : undefined;
                    const segments = (payload.segments as any[] | undefined) ?? [];
                    const firstSegmentMode = segments[0]?.mode as
                      | string
                      | undefined;
                    const initialMode =
                      (payload.mode as string | undefined) ??
                      firstSegmentMode ??
                      indexed?.mode;
                    const originCityId = (payload.origin_city_id ??
                      payload.originCityId) as string | undefined;
                    const destinationCityId = (payload.destination_city_id ??
                      payload.destinationCityId) as string | undefined;
                    const originItineraryCityId = (payload.origin_itinerary_city_id ??
                      payload.originItineraryCityId) as string | undefined;
                    const destinationItineraryCityId = (payload.destination_itinerary_city_id ??
                      payload.destinationItineraryCityId) as string | undefined;
                    setTransferDrawer({
                      show: true,
                      routeId: (payload.route_id ??
                        payload.bookingId ??
                        payload.booking_id ??
                        payload.id ??
                        edgeId) as string,
                      check_in: checkIn,
                      booking_type: (payload.booking_type ??
                        payload.type ??
                        "oneway") as string,
                      initialEdgeId: edgeId,
                      initialMode,
                      isMercury: true,
                      origin: originCityId ?? indexed?.from_city_id,
                      destination: destinationCityId ?? indexed?.to_city_id,
                      originCityId: originCityId ?? indexed?.from_city_id,
                      destinationCityId:
                        destinationCityId ?? indexed?.to_city_id,
                      origin_itinerary_city_id:
                        originItineraryCityId ??
                        indexed?.from_itinerary_city_id,
                      destination_itinerary_city_id:
                        destinationItineraryCityId ??
                        indexed?.to_itinerary_city_id,
                      city:
                        (payload.from_city as string | undefined) ??
                        indexed?.from_city,
                      dcity:
                        (payload.to_city as string | undefined) ??
                        indexed?.to_city,
                    });
                    return;
                  }

                  // ── Hotel ─────────────────────────────────────────────
                  // hotel.view is the list-card payload ({id,itineraryCityId,
                  // dbCityId,startDate,endDate,bookingId}); hotel.detail is
                  // the detail-card payload ({hotelId, ...}). Both open
                  // AccommodationDetailDrawer.
                  if (
                    action.type === "hotel.view" ||
                    action.type === "hotel.detail" ||
                    action.type === "open_hotel_drawer"
                  ) {
                    setHotelDrawer({
                      show: true,
                      accommodationId: (payload.hotelId ??
                        payload.accommodation_id ??
                        payload.hotel_id ??
                        payload.id) as string,
                      itinerary_city_id: (payload.itineraryCityId ??
                        payload.itinerary_city_id ??
                        payload.city_id) as string | undefined,
                      dbCityId: (payload.dbCityId ??
                        payload.db_city_id) as string | undefined,
                      check_in: (payload.startDate ??
                        payload.check_in ??
                        payload.date) as string | undefined,
                      check_out: (payload.endDate ??
                        payload.check_out) as string | undefined,
                      bookingId: (payload.bookingId ??
                        payload.booking_id) as string | undefined,
                    });
                    return;
                  }

                  sendWidgetAction(action.type, payload);
                }}
              />
            ))}

            {showError && (
              <div className="mt-2 px-4 py-2.5 bg-[#f8fafc] border border-red-100 rounded-[24px] text-xs text-red-600 flex items-center gap-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
                <button
                  onClick={() => setErrorDismissed(true)}
                  className="ml-auto text-red-400 hover:text-red-600"
                  aria-label="Dismiss error"
                >
                  ✕
                </button>
              </div>
            )}

            {showLoginPrompt && !isLoggedIn && (
              <div className="mt-[24px] p-4">
                 <div
          style={{
            maxWidth: "100%",
            // background: "#f8fafc",
            color: "#0d0d0d",
            padding: "12px 0px",
            borderRadius: 12,
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            lineHeight: "24px",
            fontWeight: 400,
          }}
        >
                  I see you’re not logged in. Please login to continue chatting and unlock the best experience!
                </div>
                <LoginButton onClick={handleShowLogin}>Login/Signup</LoginButton>
              </div>
            )}

            {postLoginLoading && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                <Spinner size={14} />
                <span>Sending your message…</span>
              </div>
            )}

            {isItineraryCompleting && !isStreaming && <TripPlanningLoader />}

            <div ref={messagesEndRef} />
          </div>
      </div>

      {/* ── Quick reply chips ─────────────────────────────────────────────── */}
      {/* Hidden while itinerary creation is in progress — no quick replies/CTAs allowed */}
      {quickReplies.length > 0 && !isStreaming && !isItineraryCompleting && (
        <div className="flex-shrink-0 px-6 pt-2 pb-1">
          <div className="max-w-2xl mx-auto">
            <div
              className="flex gap-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {quickReplies.map((reply, idx) => (
                <SingleChips
                  key={idx}
                  onClick={() => handleQuickReply(reply)}
                  disabled={isStreaming || isItineraryCompleting}
                >
                  {reply.label}
                </SingleChips>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Composer ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-6 pt-3 pb-1 bg-white relative">
        <div className="max-w-2xl mx-auto">
          <MessageInputBox
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            onStop={cancelStream}
            isStreaming={isStreaming}
            disabled={isItineraryCompleting}
            placeholder={isItineraryCompleting ? "Planning your trip…" : "Ask me anything"}
            showAttach={!isItineraryCompleting}
            onFilesSelected={handleFilesSelected}
            attachments={attachments}
            onRemoveAttachment={handleRemoveAttachment}
          />
        </div>
        {/* Overlay blocks all typing/interaction while itinerary creation is in progress */}
        {isItineraryCompleting && (
          <div
            className="absolute inset-0 cursor-not-allowed"
            style={{ background: "rgba(255,255,255,0.55)", zIndex: 5 }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* ── Login modal portal ────────────────────────────────────────────── */}
      {showLoginModal &&
        !isLoggedIn &&
        createPortal(
          <>
            <div
              onClick={() => setShowLoginModal(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 3299,
              }}
            />
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#fff",
                borderRadius: 16,
                width: "min(480px, 95vw)",
                maxHeight: "90vh",
                overflowY: "auto",
                zIndex: 3300,
                boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              }}
            >
              <LogInModal
                show={showLoginModal}
                onhide={() => setShowLoginModal(false)}
                zIndex={"3300"}
                message="Please login to continue"
                onSuccess={async () => {
                  // setPostLoginLoading(true);
                }}
              />
            </div>
          </>,
          document.body,
        )}

      {/* ── Activity Detail Drawer ──────────────────────────────────────── */}
      {/* Opened by activity.view / activity.detail widget actions. The
          onAddToItinerary callback routes the booking intent back to the
          chat orchestrator via a widget action (the chat has the session
          context the drawer does not). */}
      {activityDrawer.show && (
        <ActivityDetailsDrawer
          show={activityDrawer.show}
          activityId={activityDrawer.activityId}
          date={activityDrawer.date}
          handleCloseDrawer={() => setActivityDrawer({ show: false })}
          setShowDetails={() => setActivityDrawer({ show: false })}
          setShowLoginModal={setShowLoginModal}
          Topheading="Activity Details"
          showPackages={false}
          type={"activity"}
          itinerary_city_id={activityDrawer.itinerary_city_id}
          onAddToItinerary={(payload: Record<string, unknown>) => {
            const itineraryCityId =
              (payload as any).itinerary_city_id ??
              activityDrawer.itinerary_city_id;
            void (async () => {
              const data = await postBookingAction(
                "bookings/activity/",
                {
                  ...payload,
                  itinerary_city_id: itineraryCityId,
                  date: activityDrawer.date,
                },
                "Added activity to your itinerary",
              );
              if (data) {
                applyActivityBookingToItinerary(data, itineraryCityId);
              }
            })();
            setActivityDrawer({ show: false });
          }}
        />
      )}

      {/* ── Transfer Detail Drawer ──────────────────────────────────────── */}
      {transferDrawer.show && (
        <TransferEditDrawer
          showDrawer={transferDrawer.show}
          check_in={transferDrawer.check_in}
          routeId={transferDrawer.routeId}
          booking_id={transferDrawer.routeId}
          booking_type={transferDrawer.booking_type}
          setShowLoginModal={setShowLoginModal}
          initialMode={transferDrawer.initialMode}
          initialEdgeId={transferDrawer.initialEdgeId}
          isMercury={transferDrawer.isMercury}
          origin={transferDrawer.origin}
          destination={transferDrawer.destination}
          originCityId={transferDrawer.originCityId}
          destinationCityId={transferDrawer.destinationCityId}
          origin_itinerary_city_id={transferDrawer.origin_itinerary_city_id}
          destination_itinerary_city_id={
            transferDrawer.destination_itinerary_city_id
          }
          city={transferDrawer.city}
          dcity={transferDrawer.dcity}
          handleClose={() => setTransferDrawer({ show: false })}
        />
      )}

      {/* ── Hotel Detail Drawer ─────────────────────────────────────────── */}
      {/* Opened by "hotel.view" / "hotel.detail" widget actions.
          AccommodationDetailDrawer fetches its own data given accommodationId.
          onChangeHotel / onAddHotel now call the itinerary booking API
          directly instead of round-tripping through the chat orchestrator. */}
      {hotelDrawer.show && hotelDrawer.accommodationId && (
        <AccommodationDetailDrawer
          show={hotelDrawer.show}
          accommodationId={hotelDrawer.accommodationId}
          onHide={() => setHotelDrawer({ show: false })}
          onChangeHotel={() => {
            void (async () => {
              const data = await postBookingAction(
                "hotel/change/",
                {
                  id: hotelDrawer.accommodationId,
                  itinerary_city_id: hotelDrawer.itinerary_city_id,
                  db_city_id: hotelDrawer.dbCityId,
                  check_in: hotelDrawer.check_in,
                  check_out: hotelDrawer.check_out,
                  booking_id: hotelDrawer.bookingId,
                },
                "Hotel updated",
              );
              if (data) applyHotelMutationToItinerary(data);
            })();
            setHotelDrawer({ show: false });
          }}
          onAddHotel={() => {
            void (async () => {
              const data = await postBookingAction(
                "hotel/add/",
                {
                  id: hotelDrawer.accommodationId,
                  itinerary_city_id: hotelDrawer.itinerary_city_id,
                  db_city_id: hotelDrawer.dbCityId,
                  check_in: hotelDrawer.check_in,
                  check_out: hotelDrawer.check_out,
                },
                "Added hotel to your itinerary",
              );
              if (data) applyHotelMutationToItinerary(data);
            })();
            setHotelDrawer({ show: false });
          }}
          // Context required for the p2-stage "Add / Change" CTA.
          itinerary_city_id={hotelDrawer.itinerary_city_id}
          check_in={hotelDrawer.check_in}
          check_out={hotelDrawer.check_out}
          bookingId={hotelDrawer.bookingId}
          setShowLoginModal={setShowLoginModal}
        />
      )}

      {/* ── POI / Restaurant Detail Drawer ──────────────────────────────── */}
      {/* Opened by place.view / place.detail / restaurant.view /
          restaurant.detail. The `kind` prop switches POIDetailsDrawer between
          poi-mode (/geos/poi/:id/) and restaurant-mode (/geos/restaurant/:id/).
          onAddToItinerary routes "<kind>.add" back to the chat so the
          assistant can book the element into the itinerary. */}
      {poiDrawer.show && poiDrawer.id && (
        <POIDetailsDrawer
          show={poiDrawer.show}
          iconId={poiDrawer.id}
          id={poiDrawer.id}
          name={poiDrawer.name}
          activityData={{ type: poiDrawer.kind ?? "poi", id: poiDrawer.id }}
          itinerary_city_id={poiDrawer.itinerary_city_id}
          date={poiDrawer.date}
          removeDelete={true}
          removeChange={true}
          showAddToItinerary={true}
          onAddToItinerary={() => {
            const kind = poiDrawer.kind ?? "poi";
            const path = kind === "restaurant" ? "restaurant/add/" : "poi/add/";
            const itineraryCityId = poiDrawer.itinerary_city_id;
            const date = poiDrawer.date;
            const dayByDayIndex = 0;
            const body: Record<string, unknown> = {
              itinerary_city_id: itineraryCityId,
              date,
              day_by_day_index: dayByDayIndex,
              ...(kind === "restaurant"
                ? { restaurant_id: poiDrawer.id }
                : { poi_id: poiDrawer.id }),
            };
            void (async () => {
              const data = await postBookingAction(
                path,
                body,
                kind === "restaurant"
                  ? "Added restaurant to your itinerary"
                  : "Added place to your itinerary",
              );
              if (data) {
                applySlabToItinerary(
                  data,
                  itineraryCityId,
                  date,
                  dayByDayIndex,
                );
              }
            })();
            setPoiDrawer({ show: false });
          }}
          setShowLoginModal={setShowLoginModal}
          handleCloseDrawer={() => setPoiDrawer({ show: false })}
        />
      )}
    </div>
  );
}

// ── Traveller Story intro — static CTA card shown at the top of the chat ────
// Rendered only when `travellerStory` is set and the chat has no messages yet.
// CTAs route through `sendMessage`, which sends the prompt to the /chatkit p1
// endpoint exactly like any user-initiated message.

// Image with a shimmering skeleton placeholder while the bitmap loads. Keyed
// on src so rapid switches between stories reset the loading state instead of
// briefly displaying the previous image underneath the new one.
interface SkeletonImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const SkeletonImage: React.FC<SkeletonImageProps> = ({ src, alt, width, height }) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <div
      className="relative flex-shrink-0 overflow-hidden rounded-xl"
      style={{ width, height, background: "#E5E7EB" }}
    >
      {!loaded && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #E5E7EB 0%, #F3F4F6 50%, #E5E7EB 100%)",
            backgroundSize: "200% 100%",
            animation: "travellerSkeletonShimmer 1.2s ease-in-out infinite",
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className="w-full h-full object-cover"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      />
      <style>{`
        @keyframes travellerSkeletonShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

interface TravellerStoryIntroCardProps {
  story: TravellerStoryIntro;
  disabled: boolean;
  onBookExact: () => void;
}

const TravellerStoryIntroCard: React.FC<TravellerStoryIntroCardProps> = ({
  story,
  disabled,
  onBookExact,
}) => {
  const gallery = story.images && story.images.length > 0 ? story.images : [story.image];

  return (
    <div className="mb-4">
      {/* Image gallery */}
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {gallery.map((src, i) => (
          <SkeletonImage
            key={`${story.id}-img-${i}`}
            src={src}
            alt={`${story.tripName} ${i + 1}`}
            width={366}
            height={245}
          />
        ))}
      </div>

      {/* Traveller info row */}
      <div className="flex items-center justify-start gap-2 mt-3 mb-3">
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[12px] font-semibold text-[#07213A]"
          style={{ background: "#E5E7EB" }}
        >
          {story.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[#07213A] leading-tight truncate m-0">
            {story.name}
          </p>
          <p className="text-[11px] text-gray-500 mt-[1px] truncate m-0">
            {story.duration} · {story.destinations.join(" · ")}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="mt-2 text-[12.5px] leading-[18px] text-[#374151] bg-[#FAFAFA] p-2 rounded-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
        {story.shortDescription}
      </p>

      {/* CTAs */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a
          href={disabled ? undefined : story.viewItineraryLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (disabled) e.preventDefault();
          }}
          className="px-4 py-[8px] rounded-lg text-[12px] font-semibold transition-colors"
          style={{
            background: "#fff",
            border: "1px solid #0B1E36",
            color: "#0B1E36",
            opacity: disabled ? 0.5 : 1,
            pointerEvents: disabled ? "none" : "auto",
            textDecoration: "none",
          }}
        >
          View Itinerary
        </a>
        <button
          type="button"
          disabled={disabled}
          onClick={onBookExact}
          className="px-4 py-[8px] rounded-lg text-[12px] font-semibold transition-colors"
          style={{
            background: "#0B1E36",
            border: "1px solid #0B1E36",
            color: "#fff",
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          Book Exactly This
        </button>
      </div>
    </div>
  );
};