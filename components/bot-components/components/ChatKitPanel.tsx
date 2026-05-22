import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useChat, generateSessionId, getPlatform, type UserLocationData, type MessageAttachment, Message } from "../hooks/useChat";
import { MessageBubble, isButtonOnlyWidget } from "./MessageBubble";
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
import VisaSearchDrawer from "../../drawers/visaDetails/VisaSearchDrawer";
import EsimPackagesDrawer from "../../drawers/esimDetails/EsimPackagesDrawer";
import { MERCURY_HOST } from "../../../services/constants";
import { openNotification } from "../../../store/actions/notification";
import setItinerary, {
  deletePoiFromItinerary,
  deleteActivityFromItinerary,
  deleteRestaurantFromItinerary,
  deleteHotelFromItinerary,
} from "../../../store/actions/itinerary";
import { updateStays } from "../../../store/actions/StayBookings";
import { updateTransferBookings } from "../../../store/actions/transferBookingsStore";
import { removeAncillaryBooking } from "../../../store/actions/ancillaryBookings";
import SetCallPaymentInfo from "../../../store/actions/callPaymentInfo";
import { axiosGetPaymentInfo } from "../../../services/itinerary/payment";
import setCart from "../../../store/actions/Cart";
import { setCurrency } from "../../../store/actions/currencyActions";
import setItineraryStatus from "../../../store/actions/itineraryStatus";
import { useAnalytics } from "../../../hooks/useAnalytics";
import BotLoginModal from "./BotLoginModal";

const CHATKIT_API_URL = "https://dev.chat.tarzanway.com/chatkit";
const PAGINATION_SCROLL_THRESHOLD = 80;
const CHATKIT = "https://dev.chat.tarzanway.com"

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

// Placeholder chip rendered in the quick-reply row while the
// `quick_reply_shimmer` client effect is active (server is preparing the next
// batch of suggestions). Matches SingleChips dimensions so the row doesn't
// jump when real replies land.
const QuickReplyShimmerChip: React.FC<{ width: string }> = ({ width }) => (
  <div
    aria-hidden="true"
    style={{
      width,
      height: 32,
      borderRadius: 6,
      border: "1px solid #f3f4f6",
      background:
        "linear-gradient(90deg, #f9fafb 0%, #f3f4f6 50%, #f9fafb 100%)",
      backgroundSize: "200% 100%",
      animation: "quickReplyShimmer 1.4s ease-in-out infinite",
      flexShrink: 0,
    }}
  >
    <style>{`
      @keyframes quickReplyShimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

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
  /** When true and the user is not logged in, the initialPrompt is queued as
   *  the post-login message and a login/signup CTA is shown instead of being
   *  auto-sent. Used by BotApp's restore flow so unauthenticated reloads of a
   *  finished P2 trip don't fire a "Hey Kaira!" summary request. */
  initialPromptRequiresLogin?: boolean;
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
/** Mobile-only: rendered to the right of "Chat with Kaira" in the top bar.
 *  Lets BotApp inject MobileHeaderMenu so the chat tab can drop the global
 *  MobileHeader without losing the history/new-chat/profile actions. */
mobileMenu?: React.ReactNode;
/** Mobile-only: false when the chat tab is hidden behind another tab
 *  (e.g. user switched to map/itinerary). When this transitions back to true
 *  while a stream produced new content under the hood, snap scroll to bottom
 *  so the message rendered during the hidden interval is visible without a
 *  page refresh. Defaults to true (desktop / always-visible callers). */
isPanelVisible?: boolean;
onLoginSuccess?: () => void | Promise<void>;
/** Themed-page flag forwarded as `login_mandatory` on the very first
 *  /chatkit request (threads.create). When undefined, the field is omitted
 *  from the body. Subsequent messages never include it. */
loginMandatory?: boolean;
/** Mobile-only: invoked when the user taps the "View Itinerary" CTA rendered
 *  below the composer in P2 mode (or once a display_itinerary effect has fired
 *  in this thread). Used by BotApp to switch the mobile tab to the itinerary
 *  view. */
onViewItinerary?: () => void;
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
  initialPromptRequiresLogin = false,
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
mobileMenu,
isPanelVisible = true,
onLoginSuccess,
loginMandatory,
onViewItinerary,
}: ChatKitPanelProps) {
  // ── State ────────────────────────────────────────────────────────────────
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("high");
  const [localItineraryId, setLocalItineraryId] = useState(itineraryId);
  const [showControls, setShowControls] = useState(false);
  const [errorDismissed, setErrorDismissed] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  // True while the server is preparing the next batch of quick replies. The
  // `quick_reply_shimmer` client effect toggles this flag — we show shimmer
  // chips in the quick-reply row until either real replies arrive (via
  // load_quick_replies) or the flag is explicitly cleared (loading: false).
  const [quickReplyLoading, setQuickReplyLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [postLoginLoading, setPostLoginLoading] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  // True once any display_itinerary effect has fired in this thread (live
  // stream or replayed from restoredThread.itinerary_effects). Drives the
  // mobile "View Itinerary" CTA below the composer alongside botMode === "p2".
  const [hasDisplayItinerary, setHasDisplayItinerary] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);


    // ── Auth ─────────────────────────────────────────────────────────────────
  const reduxToken = useSelector((state: any) => state.auth.token);
  const reduxUserId = useSelector((state: any) => state.auth.id);
  const itinerary = useSelector((state: any) => state.Itinerary);
  const callPaymentInfo = useSelector((state: any) => state.CallPaymentInfo);
  // Lock the composer whenever an update/edit action (Update Dates,
  // Route Edit, refresh_itinerary, Reprice) is mid-poll. Cleared once
  // every itinerary status resolves to SUCCESS or FAILURE.
  const isItineraryPolling = useSelector(
    (state: any) => !!state.ItineraryStatus?.is_polling,
  );
  const isComposerLocked = isItineraryCompleting || isItineraryPolling;
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

  // ── Per-message thumbs-up / thumbs-down feedback ─────────────────────────
  // Keyed by assistant message id. Null = no feedback yet. The feedbackId is
  // returned by POST /feedback and is required for subsequent change/delete.
  const [feedbackByMessageId, setFeedbackByMessageId] = useState<
    Record<string, { feedbackId: string; type: "up" | "down" }>
  >({});
  // Per-message loading flag so we can disable both icons while a request is
  // in flight (prevents racing POST → PATCH → DELETE clicks).
  const [feedbackLoadingIds, setFeedbackLoadingIds] = useState<Set<string>>(
    () => new Set(),
  );

  const dispatch = useDispatch();
  const router = useRouter();

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

  // Mirrors getPaymentInfo() in ItineraryContainer.jsx — fetches /cart/ for
  // the current itinerary and pushes the result into Redux (cart + currency +
  // pricing_status). Passed to TransferEditDrawer so the drawer can refresh
  // the cart after a booking completes, matching the /itinerary page flow.
  const getPaymentInfo = useCallback(async () => {
    if (!localItineraryId) return;
    const token = localStorage.getItem("access_token");
    try {
      const res = await axiosGetPaymentInfo.get(`${localItineraryId}/cart/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      dispatch(setCart(data));
      dispatch(setCurrency(data?.currency));
      dispatch(setItineraryStatus("pricing_status", "SUCCESS"));
    } catch (error) {
      console.log("ERROR[PaymentInfo][Itinerary]", error);
    }
  }, [localItineraryId, dispatch]);

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

  // Fetch the full itinerary detail and push it into Redux. Called after
  // a successful POI / activity / restaurant add so derived state (the
  // day-by-day buckets, city duration, pricing surfaces) reflects what
  // the backend now has — the optimistic local patches in
  // applySlabToItinerary / applyActivityBookingToItinerary are best-effort.
  const fetchAndApplyItineraryDetail = useCallback(async () => {
    if (!localItineraryId) return;
    try {
      const res = await axios.get(
        `${MERCURY_HOST}/api/v1/itinerary/${localItineraryId}/`,
        authToken
          ? { headers: { Authorization: `Bearer ${authToken}` } }
          : undefined,
      );
      if (res?.data && res.data?.version !== "v1") {
        dispatch(setItinerary(res.data));
      }
    } catch (err) {
      console.error("[fetchAndApplyItineraryDetail] error:", err);
    }
  }, [localItineraryId, authToken, dispatch]);

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
    cityName?: string;
    source?: string;
    occupancies?: Array<{ num_adults: number; child_ages: number[] }>;
    traceId?: string;
    travclan_hotel_id?: string;
    currency?: string;  
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

  // Sightseeing (intra-city taxi) drawer — opened by sightseeing.open and
  // pickup_drop.open widget actions. Reuses TransferEditDrawer in multicity
  // mode so the user can browse the same suggestions that the city header's
  // "Add Taxi" CTA surfaces in /itinerary. `initialTab` chooses which of the
  // drawer's internal tabs (sightseeing / airport) to open on mount.
  const [sightseeingDrawer, setSightseeingDrawer] = useState<{
    show: boolean;
    itinerary_city_id?: string;
    cityId?: string;
    cityName?: string;
    cityData?: any;
    startDate?: string;
    endDate?: string;
    initialTab?: "sightseeing" | "airport" | "multicity";
  }>({ show: false });


  // TransferEditDrawer closes itself by calling its internal `actualClose`
  // (a Next router.push that strips the drawer/itinerary_city_id query
  // params) — it never invokes the `handleClose` prop we pass in. Without
  // this listener, our `sightseeingDrawer.show` stays `true` after the
  // close, so a second `sightseeing.open` click only repushes the URL
  // and the inner Drawer's `useEffect([props.show])` doesn't re-fire.
  useEffect(() => {
    if (!sightseeingDrawer.show) return;
    const syncFromUrl = (url: string) => {
      const target = new URL(url, window.location.origin);
      if (target.searchParams.get("drawer") !== "addCityTaxi") {
        setSightseeingDrawer({ show: false });
      }
    };
    router.events.on("routeChangeComplete", syncFromUrl);
    return () => {
      router.events.off("routeChangeComplete", syncFromUrl);
    };
  }, [router, sightseeingDrawer.show]);

  // Visa / eSIM ancillary drawers — opened by visa.open / esim.open widget
  // actions. Both drawers self-fetch their own catalogue data so we only
  // need to track open state here.
  const [visaDrawer, setVisaDrawer] = useState<{ show: boolean }>({ show: false });
  const [esimDrawer, setEsimDrawer] = useState<{ show: boolean }>({ show: false });

  // ── Pagination state ─────────────────────────────────────────────────────
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const hasMoreRef = useRef(false);
  const beforeCursorRef = useRef<string | null>(null);
  const isFetchingMoreRef = useRef(false);
  const appliedRestoredThreadRef = useRef<unknown>(null);

  // Tracks whether the user is pinned to the bottom of the message list. The
  // auto-scroll effect only fires when this is true, so the transcript won't
  // yank away from a user who's scrolled up to read earlier messages.
  const isAtBottomRef = useRef(true);
  // True between a thread restore and the moment we've actually parked the
  // scroll container at the bottom. Widgets/images in restored threads finish
  // laying out asynchronously, so a single smooth scroll lands mid-thread —
  // we re-snap on a few ticks until the content has settled.
  const initialScrollPendingRef = useRef(false);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const hasProcessedInitial = useRef(false);
  const hasUpdatedUrl = useRef(false);
  const postLoginFiredRef = useRef(false);
  const loginFlowArmedRef = useRef(false);
  type PendingAction =
    | { kind: "message"; text: string }
    | { kind: "widget"; type: string; payload: Record<string, unknown> };
  const pendingPostLoginAction = useRef<PendingAction | null>(null);
  const hasInjectedContextRef = useRef(false);
  const inputRef = useRef(input);
useEffect(() => { inputRef.current = input; }, [input]);
const prevAuthTokenRef = useRef<string | null>(null);
const lastSentMessageRef = useRef<string>("");
const lastSentActionRef = useRef<PendingAction | null>(null);

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

  // ── Jupiter analytics — Partytown-forwarded, runs in a worker thread so
  //    these calls don't block the main thread. Refs let us call them inside
  //    other useCallbacks without changing their deps.
  const {
    trackChatItineraryStarted,
    trackChatRouteConfirmed,
    trackChatItineraryGenerated,
    trackChatItineraryConfirmed,
    trackChatPriceReceived,
    trackChatCartViewed,
    trackHotelCardClicked,
    trackActivityCardClicked,
    trackTransferCardClicked,
    trackPoiCardClicked,
  } = useAnalytics();
  const analyticsRef = useRef({
    trackChatItineraryStarted,
    trackChatRouteConfirmed,
    trackChatItineraryGenerated,
    trackChatItineraryConfirmed,
    trackChatPriceReceived,
    trackChatCartViewed,
    trackHotelCardClicked,
    trackActivityCardClicked,
    trackTransferCardClicked,
    trackPoiCardClicked,
  });
  useEffect(() => {
    analyticsRef.current = {
      trackChatItineraryStarted,
      trackChatRouteConfirmed,
      trackChatItineraryGenerated,
      trackChatItineraryConfirmed,
      trackChatPriceReceived,
      trackChatCartViewed,
      trackHotelCardClicked,
      trackActivityCardClicked,
      trackTransferCardClicked,
      trackPoiCardClicked,
    };
  }, [
    trackChatItineraryStarted,
    trackChatRouteConfirmed,
    trackChatItineraryGenerated,
    trackChatItineraryConfirmed,
    trackChatPriceReceived,
    trackChatCartViewed,
    trackHotelCardClicked,
    trackActivityCardClicked,
    trackTransferCardClicked,
    trackPoiCardClicked,
  ]);
  // Snapshot user prompts (text content of all user messages in the current
  // thread) — chat lifecycle events include this in `properties.user_prompts`.
  const messagesRef = useRef<Message[]>([]);
  const getUserPrompts = useCallback((): string[] => {
    return (messagesRef.current || [])
      .filter((m: any) => m?.role === "user")
      .map((m: any) => (typeof m?.content === "string" ? m.content : ""))
      .filter(Boolean);
  }, []);
  const botModeRef = useRef<BotMode>(botMode);
  useEffect(() => { botModeRef.current = botMode; }, [botMode]);
  const ddAgent = () => (botModeRef.current === "p2" ? "P2" : "P1");

  // Fire-once guards for chat lifecycle events. Each event should fire at
  // most once per session — multiple effect/widget paths can lead to the same
  // semantic milestone, and we don't want duplicates when both fire.
  const firedChatEventsRef = useRef<Set<string>>(new Set());
  const fireChatEventOnce = useCallback(
    (eventKey: string, fire: () => void) => {
      if (firedChatEventsRef.current.has(eventKey)) return;
      firedChatEventsRef.current.add(eventKey);
      fire();
    },
    [],
  );

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
  // sessionStorage can hit its quota when chatkit_session_* entries pile up.
  // The cached value is an optimization for restore — if writing fails, drop
  // every chatkit_session_* entry and retry once before giving up silently.
  const key = `chatkit_session_${target}`;
  try {
    sessionStorage.setItem(key, ourSessionId);
  } catch {
    try {
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith("chatkit_session_"))
        .forEach((k) => sessionStorage.removeItem(k));
      sessionStorage.setItem(key, ourSessionId);
    } catch (err) {
      console.warn("sessionStorage write failed:", err);
    }
  }
}, []);

  // ── useChat ───────────────────────────────────────────────────────────────
  const apiUrl =
    botMode === "p2"
      ? "https://dev.chat.tarzanway.com/chatkit/p2"
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
  sendWidgetAction: rawSendWidgetAction, clearMessages, cancelStream, setMessages, threadIdRef }= useChat({
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
    loginMandatory,
  });

  // Wrap sendWidgetAction so we can replay the same action after a post-login
  // retry (e.g. inject.context that triggered prompt_login while logged out).
  const sendWidgetAction = useCallback(
    (type: string, payload: Record<string, unknown>) => {
      lastSentActionRef.current = { kind: "widget", type, payload };
      return rawSendWidgetAction(type, payload);
    },
    [rawSendWidgetAction],
  );

  // Keep sendWidgetActionRef current after every render
  sendWidgetActionRef.current = sendWidgetAction;
  // Mirror messages into a ref so analytics calls can pull user_prompts
  // without subscribing to the messages array directly.
  messagesRef.current = messages;

  // ── Feedback (thumbs up / down) handler ──────────────────────────────────
  // Three-state toggle per assistant message:
  //   no feedback        + click X     →  POST   /feedback           (create)
  //   feedback type !== X + click X    →  POST   /feedback/{id}      (change)
  //   feedback type === X + click X    →  DELETE /feedback/{id}      (clear)
  const handleFeedback = useCallback(
    async (
      messageId: string,
      type: "up" | "down",
      message?: string,
      label?: string,
    ) => {
      if (!messageId) return;
      if (!authToken) {
        setShowLoginModal(true);
        return;
      }
      if (feedbackLoadingIds.has(messageId)) return;

      const threadId = threadIdRef.current;
      if (!threadId) {
        // Without a thread id the create call has no anchor — bail silently.
        return;
      }

      const headers = { Authorization: `Bearer ${authToken}` };
      const setLoading = (on: boolean) =>
        setFeedbackLoadingIds((prev) => {
          const next = new Set(prev);
          if (on) next.add(messageId);
          else next.delete(messageId);
          return next;
        });

      const trimmedMessage = message?.trim();
      const current = feedbackByMessageId[messageId];
      setLoading(true);
      try {
        if (!current) {
          const body = {
            session_id: sessionIdRef.current,
            thread_id: threadId,
            message_id: messageId,
            type,
            platform: getPlatform(),
            ...(trimmedMessage ? { message: trimmedMessage } : {}),
            ...(label ? { label } : {}),
            ...(reduxUserId != null ? { author: parseInt(reduxUserId) } : {}),
          };
          const res = await axios.post(
            `${CHATKIT}/feedback`,
            body,
            { headers },
          );
          const newId = (res.data?.id ?? res.data?.feedback_id) as string | undefined;
          if (newId) {
            setFeedbackByMessageId((prev) => ({
              ...prev,
              [messageId]: { feedbackId: String(newId), type },
            }));
          }
        } else if (current.type === type) {
          await axios.delete(
            `${CHATKIT}/feedback/${current.feedbackId}`,
            { headers },
          );
          setFeedbackByMessageId((prev) => {
            const next = { ...prev };
            delete next[messageId];
            return next;
          });
        } else {
          await axios.post(
            `${CHATKIT}/feedback/${current.feedbackId}`,
            {
              type,
              platform: getPlatform(),
              ...(trimmedMessage ? { message: trimmedMessage } : {}),
              ...(label ? { label } : {}),
            },
            { headers },
          );
          setFeedbackByMessageId((prev) => ({
            ...prev,
            [messageId]: { ...current, type },
          }));
        }
      } catch (err) {
        console.error("[Feedback] failed:", err);
        dispatch(
          openNotification({
            type: "error",
            heading: "Couldn't save feedback",
            text: "Please try again in a moment.",
          }),
        );
      } finally {
        setLoading(false);
      }
    },
    [authToken, feedbackByMessageId, feedbackLoadingIds, reduxUserId, threadIdRef, dispatch],
  );

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
          setHasDisplayItinerary(true);
          fireChatEventOnce("chat_itinerary_generated", () =>
            analyticsRef.current.trackChatItineraryGenerated?.(
              localItineraryId || ((data.itinerary as any)?.id as string) || "",
              ddAgent(),
              getUserPrompts(),
            ),
          );
          break;
        }
        case "display_transfers": {
          emitEndpointsFromEffect(name, data);
          indexTransfersForLookup(data);
          onItineraryReceived(data);
          // The server emits display_transfers once route options are
          // finalized for the chosen itinerary — treat that as the route
          // being confirmed for analytics purposes.
          fireChatEventOnce("chat_route_confirmed", () =>
            analyticsRef.current.trackChatRouteConfirmed?.(
              localItineraryId || "",
              ddAgent(),
              getUserPrompts(),
            ),
          );
  break;
        }
        case "route.lock":
        case "route.edit":
        case "route.remove":
        case "route.reorder.start":
        case "itinerary.lock": {
          if (name === "route.lock") {
            fireChatEventOnce("chat_route_confirmed", () =>
              analyticsRef.current.trackChatRouteConfirmed?.(
                localItineraryId || "",
                ddAgent(),
                getUserPrompts(),
              ),
            );
          } else if (name === "itinerary.lock") {
            fireChatEventOnce("chat_itinerary_confirmed", () =>
              analyticsRef.current.trackChatItineraryConfirmed?.(
                localItineraryId || "",
                ddAgent(),
                getUserPrompts(),
              ),
            );
          }
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
  pendingPostLoginAction.current =
    lastSentActionRef.current ??
    (lastSentMessageRef.current
      ? { kind: "message", text: lastSentMessageRef.current }
      : null);
  loginFlowArmedRef.current = true;
  setShowLoginModal(true);
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
  // Pricing/cart for the trip is finalized at this point — fire
  // chat_price_received once the P2 completion process resolves.
  fireChatEventOnce("chat_price_received", () =>
    analyticsRef.current.trackChatPriceReceived?.(
      completedId || localItineraryId || "",
      ddAgent(),
      getUserPrompts(),
    ),
  );
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
  // Server kicks off completion only after the user has confirmed their
  // itinerary, so this is a reliable trigger for chat_itinerary_confirmed
  // even when the explicit `itinerary.lock` effect doesn't arrive.
  fireChatEventOnce("chat_itinerary_confirmed", () =>
    analyticsRef.current.trackChatItineraryConfirmed?.(
      startId || localItineraryId || "",
      ddAgent(),
      getUserPrompts(),
    ),
  );
  break;
}
case "shimmer_day_by_day": {
  emitEndpointsFromEffect(name, data);
  // Forward start/end city to BotApp so the skeleton itinerary in Redux
  // carries them too — otherwise VerticalLayout has nothing to label the
  // P1 start pin with until display_itinerary lands.
  onItineraryReceived({
    shimmer: true,
    start_city: data?.start_city ?? null,
    end_city: data?.end_city ?? null,
  });
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
        case "delete_hotel_from_itinerary": {
          const payload = (data.data ?? {}) as Record<string, unknown>;
          const bookingId = payload?.booking_id as string | undefined;
          // Patch Itinerary cities[].hotels and Stays so the UI removes the
          // hotel without waiting on a refetch. Toggle CallPaymentInfo so the
          // pricing surface refreshes alongside.
          dispatch(deleteHotelFromItinerary(payload));
          if (bookingId) dispatch(updateStays(bookingId));
          dispatch(SetCallPaymentInfo(!callPaymentInfo));
          const text = typeof data.message === "string" ? data.message : "Hotel removed from your itinerary.";
          dispatch(openNotification({ type: "success", heading: "Success!", text }));
          break;
        }
        case "delete_transfer_from_itinerary": {
          const payload = (data.data ?? {}) as Record<string, unknown>;
          const bookingId = payload?.booking_id as string | undefined;
          if (bookingId) dispatch(updateTransferBookings(bookingId));
          dispatch(SetCallPaymentInfo(!callPaymentInfo));
          const text = typeof data.message === "string" ? data.message : "Transfer removed from your itinerary.";
          dispatch(openNotification({ type: "success", heading: "Success!", text }));
          break;
        }
        case "delete_esim_from_itinerary":
        case "delete_visa_from_itinerary": {
          const payload = (data.data ?? {}) as Record<string, unknown>;
          const bookingId = payload?.booking_id as string | undefined;
          const kind = name === "delete_esim_from_itinerary" ? "eSIM" : "Visa";
          if (bookingId) dispatch(removeAncillaryBooking(bookingId));
          dispatch(SetCallPaymentInfo(!callPaymentInfo));
          const text = typeof data.message === "string" ? data.message : `${kind} removed from your itinerary.`;
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
          setQuickReplyLoading(false);
          break;
        }
        case "quick_reply_shimmer": {
          const loading = (data as any)?.loading;
          setQuickReplyLoading(loading === undefined ? true : Boolean(loading));
          break;
        }
        default:
          console.warn("[Effect] unhandled:", name);
      }
    },
    [onLocationReceived, onNewQuery, onClearMap, onRouteReceived, onItineraryReceived, input, indexTransfersForLookup, emitEndpointsFromEffect, dispatch, callPaymentInfo],
  );

  // Wire handleEffect into the ref so the stable onEffect wrapper picks it up
  handleEffectRef.current = handleEffect;

  // ── Wrap sendMessage to clear quick replies ───────────────────────────────
const sendMessage = useCallback(
  (text: string, attachmentIds?: string[], attachmentMeta?: MessageAttachment[]) => {
    setQuickReplies([]);
    setQuickReplyLoading(false);
    lastSentMessageRef.current = text;
    lastSentActionRef.current = { kind: "message", text };

    // User-initiated send: snap the view to the latest message even if they
    // had scrolled up earlier in the session.
    isAtBottomRef.current = true;

    if (isFirstMessageRef.current) {
      isFirstMessageRef.current = false;
      // Fire chat_itinerary_started on the very first user message of the
      // session — this marks the moment the user kicks off itinerary creation
      // through the chat flow.
      analyticsRef.current.trackChatItineraryStarted?.(
        localItineraryId || "",
        ddAgent(),
        [text].filter(Boolean),
      );
    }
    rawSendMessage(text, attachmentIds, attachmentMeta);
  },
  [rawSendMessage],
);

  // ── Side-effects ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!error) setErrorDismissed(false);
  }, [error]);

  // Auto-dismiss the error toast as soon as the network comes back online.
  // The in-bubble error stays put (history is preserved) but the floating
  // toast is meaningless once connectivity returns.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onOnline = () => setErrorDismissed(true);
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, []);

  // User-driven scroll detach. Fast text_delta-driven re-renders run the
  // auto-scroll effect below before the `scroll` event the user just
  // triggered has had a chance to update isAtBottomRef — that race is what
  // makes the view snap back to the bottom while the user is trying to read
  // earlier messages. Listen for the user's actual gesture (wheel scrolling
  // up, or finger drag downward on touchscreens) and detach pinning
  // synchronously, before the browser even processes the scroll.
  useEffect(() => {
    const c = messagesScrollRef.current;
    if (!c) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) isAtBottomRef.current = false;
    };
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? 0;
      // Finger dragging downward → content scrolls up → user is reading above.
      if (y - touchStartY > 5) isAtBottomRef.current = false;
    };
    c.addEventListener("wheel", onWheel, { passive: true });
    c.addEventListener("touchstart", onTouchStart, { passive: true });
    c.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      c.removeEventListener("wheel", onWheel);
      c.removeEventListener("touchstart", onTouchStart);
      c.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  useEffect(() => {
    // Don't auto-scroll to bottom when older messages are being prepended
    if (isFetchingMoreRef.current) return;
    // Respect the user's scroll position: if they've scrolled up to read
    // earlier messages, don't yank the view back down while streaming.
    if (!isAtBottomRef.current) return;
    // While a thread restore is still settling (widgets/images laying out)
    // OR a stream is actively producing text_deltas, snap instantly to the
    // absolute bottom — smooth scrollIntoView fires once and gets overtaken
    // by content that grows after, leaving intermediate streamed text
    // hidden below the viewport until the user manually scrolls.
    if (initialScrollPendingRef.current || isStreaming) {
      const c = messagesScrollRef.current;
      if (c) c.scrollTop = c.scrollHeight;
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Mobile: when the chat tab is hidden behind another tab, scrollIntoView
  // calls fired by the auto-scroll effect above don't reliably move the
  // scroll container — text_deltas streamed in the background grow the
  // assistant bubble off-screen, and on iOS Safari the hidden parent can
  // also leave the scrollHeight stale. When the panel becomes visible again,
  // re-route the auto-scroll through an instant snap (scrollTop = scrollHeight)
  // for a beat so any in-flight streaming, image loads, or widget layouts
  // park us at the bottom — without the user needing to refresh.
  const wasVisibleRef = useRef(isPanelVisible);
  useEffect(() => {
    if (wasVisibleRef.current === isPanelVisible) return;
    const becameVisible = !wasVisibleRef.current && isPanelVisible;
    wasVisibleRef.current = isPanelVisible;
    if (!becameVisible) return;
    if (!isAtBottomRef.current) return;

    const snapToBottom = () => {
      const c = messagesScrollRef.current;
      if (c) c.scrollTop = c.scrollHeight;
    };
    // Drive the auto-scroll effect down the "instant snap" branch so the
    // smooth scrollIntoView (which doesn't catch up to rapidly-growing
    // streaming content) is bypassed while content settles.
    initialScrollPendingRef.current = true;
    requestAnimationFrame(() => {
      snapToBottom();
      requestAnimationFrame(snapToBottom);
    });
    const timers = [50, 150, 300, 600, 1000].map((ms) =>
      setTimeout(() => {
        snapToBottom();
        if (ms === 1000) initialScrollPendingRef.current = false;
      }, ms),
    );
    return () => {
      timers.forEach(clearTimeout);
      initialScrollPendingRef.current = false;
    };
  }, [isPanelVisible]);

  // Index transfer.select edge ids → mode from live widget messages, so the
  // TransferEditDrawer can skip its mode-selection step when the user clicks.
  useEffect(() => {
    for (const m of messages) {
      if ((m as any)?.type === "widget") {
        indexEdgesFromWidget((m as any)?.widgetItem?.widget);
      }
    }
  }, [messages, indexEdgesFromWidget]);

  // Widget-pattern fallbacks for chat lifecycle events. The server-emitted
  // effects (display_transfers / itinerary_completion_process_completed)
  // don't replay when a thread is restored from history — but the widgets
  // they generated are still in `messages`. Scan for known signatures so the
  // events fire reliably across both fresh streams and restored threads.
  useEffect(() => {
    if (!messages?.length) return;

    // Recursively check whether any descendant action.type matches a target.
    const hasActionType = (node: any, targets: Set<string>): boolean => {
      if (!node || typeof node !== "object") return false;
      const actionType = node.onClickAction?.type as string | undefined;
      if (actionType && targets.has(actionType)) return true;
      const kids = Array.isArray(node.children) ? node.children : [];
      for (const c of kids) if (hasActionType(c, targets)) return true;
      return false;
    };

    const paymentTargets = new Set(["payment.start"]);
    const routeTargets = new Set([
      "route.lock",
      "route.confirm",
      "lock.route",
    ]);
    const itineraryLockTargets = new Set([
      "itinerary.lock",
      "itinerary.confirm",
    ]);

    let sawPayment = false;
    let sawRoute = false;
    let sawItineraryLock = false;
    for (const m of messages as any[]) {
      if (m?.type !== "widget") continue;
      const w = m?.widgetItem?.widget;
      if (!sawPayment && hasActionType(w, paymentTargets)) sawPayment = true;
      if (!sawRoute && hasActionType(w, routeTargets)) sawRoute = true;
      if (!sawItineraryLock && hasActionType(w, itineraryLockTargets))
        sawItineraryLock = true;
      if (sawPayment && sawRoute && sawItineraryLock) break;
    }

    if (sawRoute) {
      fireChatEventOnce("chat_route_confirmed", () =>
        analyticsRef.current.trackChatRouteConfirmed?.(
          localItineraryId || "",
          ddAgent(),
          getUserPrompts(),
        ),
      );
    }
    if (sawItineraryLock || sawPayment) {
      // A "Make Payment" widget only shows up after the itinerary is locked,
      // so payment widgets imply confirmation too.
      fireChatEventOnce("chat_itinerary_confirmed", () =>
        analyticsRef.current.trackChatItineraryConfirmed?.(
          localItineraryId || "",
          ddAgent(),
          getUserPrompts(),
        ),
      );
    }
    if (sawPayment) {
      fireChatEventOnce("chat_price_received", () =>
        analyticsRef.current.trackChatPriceReceived?.(
          localItineraryId || "",
          ddAgent(),
          getUserPrompts(),
        ),
      );
    }
  }, [messages, fireChatEventOnce, getUserPrompts, localItineraryId]);

useEffect(() => {
  if (initialPrompt && !hasProcessedInitial.current && locationReady) {
    // Suppress the auto inject.context only for the exact auto-seeded
    // post-completion summary prompt (set by restoreLatestThread on P2
    // restore / fromTailored). A broader keyword match here also caught
    // user-typed prompts containing "itinerary", which silenced the
    // post-completion summary on the bot-create path.
    if (initialPrompt === "Hey Kaira! provide summary of my itinerary") {
      hasInjectedContextRef.current = true;
    }
    // Defer prompts that require login: queue as the post-login message and
    // show the existing login/signup CTA. The authToken-change effect below
    // will fire the queued message once the user authenticates.
    if (initialPromptRequiresLogin && !isLoggedIn) {
      hasProcessedInitial.current = true;
      pendingPostLoginAction.current = { kind: "message", text: initialPrompt };
      loginFlowArmedRef.current = true;
      setShowLoginPrompt(true);
      onInitialPromptConsumed?.();
      return;
    }
    hasProcessedInitial.current = true;
    sendMessage(initialPrompt, initialAttachmentIds);
    onInitialPromptConsumed?.();
  }
}, [initialPrompt, initialPromptRequiresLogin, isLoggedIn, initialAttachmentIds, locationReady, sendMessage, onInitialPromptConsumed]);

  useEffect(() => {
    onSendReady?.(sendMessage);
  }, [onSendReady, sendMessage]);

  // ── Inject context when itinerary is fully completed ──────────────────────
  useEffect(() => {
    if (itineraryCompleted && !hasInjectedContextRef.current && !isStreaming) {
      hasInjectedContextRef.current = true;
      if(isLoggedIn) {
        sendWidgetAction("inject.context", { message: "Provide short overview of the trip" });
      }
    }
  }, [itineraryCompleted, isStreaming, sendWidgetAction]);

useEffect(() => {
  const tokenJustArrived =
    !!authToken && !prevAuthTokenRef.current;
  prevAuthTokenRef.current = authToken ?? null;

  if (!tokenJustArrived) return;                    // only fire on login transition
  if (postLoginFiredRef.current) return;

  const action = pendingPostLoginAction.current;
  if (!action) return;

  postLoginFiredRef.current = true;
  pendingPostLoginAction.current = null;

  setShowLoginModal(false);
  setShowLoginPrompt(false);
  setPostLoginLoading(false);
  setInput("");

  // One tick defer — lets useChat re-render with new authToken before sending
  setTimeout(() => {
    if (action.kind === "widget") {
      sendWidgetAction(action.type, action.payload);
    } else {
      sendMessage(action.text);
    }
  }, 100);
}, [authToken, sendMessage, sendWidgetAction]);

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
  // Guard: only apply each restoredThread payload ONCE. The effect's callback
  // deps (onRouteReceived/onItineraryReceived/etc.) change identity when their
  // parent state mutates (e.g. shimmer_day_by_day flips viewMode/activeItineraryId),
  // which would otherwise re-run the body mid-stream and call setMessages(restored)
  // on top of a placeholder + streaming text — wiping the in-flight message.
  if (appliedRestoredThreadRef.current === restoredThread) return;
  // Also skip if a stream is active — restoring the previous transcript on top
  // of the live placeholder is never what we want.
  if (isStreaming) return;
  appliedRestoredThreadRef.current = restoredThread;

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
  let restoredHasDisplayItinerary = false;
  for (const effect of itineraryEffects) {
    if (effect.name === "display_itinerary" && effect.data?.itinerary) {
      if (!threadIsCompleted) onItineraryReceived(effect.data.itinerary);
      latestEndpointEffect = effect;
      restoredHasDisplayItinerary = true;
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

  if (restoredHasDisplayItinerary) setHasDisplayItinerary(true);

  if (restored.length > 0) {
    setMessages(restored);
    // Land at the bottom of the restored transcript. Widgets and images lay
    // out asynchronously, so the scrollable height keeps growing for a beat
    // after setMessages — a single rAF snap leaves the user mid-thread.
    // Keep snapping for ~1s; the auto-scroll effect also honours this flag
    // so it uses instant scroll instead of smooth animation in the meantime.
    initialScrollPendingRef.current = true;
    isAtBottomRef.current = true;
    const snapToBottom = () => {
      const c = messagesScrollRef.current;
      if (!c) return;
      c.scrollTop = c.scrollHeight;
    };
    requestAnimationFrame(() => {
      snapToBottom();
      requestAnimationFrame(snapToBottom);
    });
    const timers = [50, 150, 300, 600, 1000].map((ms) =>
      setTimeout(() => {
        snapToBottom();
        if (ms === 1000) initialScrollPendingRef.current = false;
      }, ms),
    );
    // Best-effort cleanup if the effect re-runs (e.g. switching to another
    // restored thread); harmless if timers already fired.
    void timers;
  }

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
}, [restoredThread, isStreaming, parseThreadItems, onRouteReceived, onLocationReceived, onItineraryReceived, indexTransfersForLookup, emitEndpointsFromEffect]);

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
          platform: getPlatform(),
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
  // Preserve an existing queued action (e.g. an initialPrompt already
  // stashed by the restore flow) if the user opens the modal without
  // typing anything new — otherwise we'd clobber it and the post-login
  // send would be a no-op.
  if (currentInput) {
    pendingPostLoginAction.current = { kind: "message", text: currentInput };
  } else if (lastSentActionRef.current) {
    pendingPostLoginAction.current = lastSentActionRef.current;
  } else if (lastSentMessageRef.current) {
    pendingPostLoginAction.current = { kind: "message", text: lastSentMessageRef.current };
  }
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
      className={`flex flex-col h-full min-h-0 bg-white  max-h-[100dvh] md:max-h-[93.5vh] border-[0.5px] border-l-[#e5e5e5] overflow-x-hidden`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between gap-2 px-[0.25rem] md:!px-4 py-2.5 bg-white/80 backdrop-blur-sm mt-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">
            <img src="/KairaInsta.png" alt="Kaira" />
          </div>
          <span className="text-sm md:text-[14px] font-semibold text-gray-800 truncate">
            Chat with Kaira
            <span className="font-normal hidden md:inline"> - Your AI Trip Planner</span>
          </span>
          {isLoadingLocation && (
            <span className="text-[11px] text-gray-400 flex items-center gap-1 flex-shrink-0">
              <Spinner size={10} /> locating…
            </span>
          )}
        </div>
        {mobileMenu && <div className="md:hidden flex-shrink-0">{mobileMenu}</div>}
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
        <div className="flex-shrink-0 flex flex-wrap items-center gap-x-6 gap-y-2 px-[0.25rem] md:!px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs">
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
        className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden px-[0.25rem] md:!px-4 py-4 scroll-smooth"
      >

          <div className="mx-auto">
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
            {messages.map((msg, idx) => {
              // For network-failed assistant bubbles, hand MessageBubble a
              // retry callback that re-sends the immediately preceding user
              // message (content + attachments) — useChat strips the failed
              // pair before the new send so we don't double up.
              const prevMsg = idx > 0 ? messages[idx - 1] : undefined;
              const onRetry =
                msg.role === "assistant" &&
                msg.isError &&
                msg.errorVariant === "network" &&
                prevMsg?.role === "user"
                  ? () => {
                      const atts = prevMsg.attachments ?? [];
                      sendMessage(
                        prevMsg.content,
                        atts.length ? atts.map((a) => a.id) : undefined,
                        atts.length ? atts : undefined,
                      );
                    }
                  : undefined;

              // A single bot turn streams as one text message + N widget
              // messages back-to-back. Show feedback on the LAST feedback-
              // eligible message in the run so the turn gets a single thumbs
              // row at the bottom. Button-only widgets (e.g. "Confirm This
              // Route") suppress their own feedback in MessageBubble, so
              // skip past them when locating the eligible tail — otherwise
              // the whole turn ends up with no feedback at all.
              let hideFeedback = false;
              if (msg.role === "assistant") {
                for (let j = idx + 1; j < messages.length; j++) {
                  const later = messages[j];
                  if (later.role !== "assistant") break;
                  const eligible =
                    later.type === "widget"
                      ? later.widgetItem
                        ? !isButtonOnlyWidget(later.widgetItem.widget)
                        : false
                      : true;
                  if (eligible) {
                    hideFeedback = true;
                    break;
                  }
                }
              }

              return (
              <MessageBubble
                key={msg.id}
                message={msg}
                entities={entities}
                widgetDisabled={
                  msg.type === "widget" && disabledWidgetIds.has(msg.id)
                }
                feedback={feedbackByMessageId[msg.id] ?? null}
                feedbackLoading={feedbackLoadingIds.has(msg.id)}
                onFeedback={hideFeedback ? undefined : handleFeedback}
                onRetry={onRetry}
                onWidgetAction={(action) => {
                  // Freeze this widget's CTAs the moment the user clicks one,
                  // regardless of which drawer or server call it triggers. The
                  // server response may take time and we don't want a double
                  // submission.
                  if (msg.type === "widget") markWidgetDisabled(msg.id);

                  // ── Plan New Trip → fresh P1 session ──────────────────
                  // Generate a new sessionId, stash the seed prompt for the
                  // new session in localStorage (sessionStorage isn't shared
                  // across tabs), then open /chat/[id] in a new tab. BotApp's
                  // mount effect picks the prompt up and sends it as the
                  // first user message.
                  if (action.type === "trip.redirect_to_p1") {
                    const ctx = (action.payload?.context ??
                      action.payload?.prompt ??
                      "") as string;
                    const newSessionId = generateSessionId();
                    if (ctx) {
                      try {
                        localStorage.setItem(
                          `pending_initial_prompt_${newSessionId}`,
                          ctx,
                        );
                      } catch (err) {
                        console.warn(
                          "[trip.redirect_to_p1] localStorage set failed:",
                          err,
                        );
                      }
                    }
                    window.open(
                      `/chat/${newSessionId}`,
                      "_blank",
                      "noopener,noreferrer",
                    );
                    return;
                  }

                  // ── Payment ───────────────────────────────────────────
                  // Clicking "Make Payment" inside a widget opens the
                  // existing payment drawer rather than round-tripping via
                  // sendWidgetAction — the drawer owns the payment flow.
                  if (action.type === "payment.start") {
                    analyticsRef.current.trackChatCartViewed?.(
                      localItineraryId || "",
                      ddAgent(),
                      getUserPrompts(),
                    );
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
                    analyticsRef.current.trackActivityCardClicked?.(
                      localItineraryId || "",
                      activityId,
                      "chat",
                    );
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
                      const activityId = (payload.activityId ??
                        payload.activity_id ??
                        payload.id) as string;
                      setActivityDrawer({
                        show: true,
                        activityId,
                        date: (payload.startDate ??
                          payload.date) as string | undefined,
                        itinerary_city_id: (payload.itineraryCityId ??
                          payload.itinerary_city_id ??
                          payload.city_id) as string | undefined,
                      });
                      analyticsRef.current.trackActivityCardClicked?.(
                        localItineraryId || "",
                        activityId,
                        "chat",
                      );
                    } else {
                      const poiId = (payload.poiId ??
                        payload.poi_id ??
                        payload.id) as string;
                      setPoiDrawer({
                        show: true,
                        kind: "poi",
                        id: poiId,
                        name: payload.title as string | undefined,
                        itinerary_city_id: (payload.itineraryCityId ??
                          payload.itinerary_city_id) as string | undefined,
                        date: (payload.startDate ??
                          payload.date) as string | undefined,
                      });
                      analyticsRef.current.trackPoiCardClicked?.(
                        localItineraryId || "",
                        poiId,
                        "chat",
                      );
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
                    const restaurantId = (payload.restaurantId ??
                      payload.restaurant_id ??
                      payload.id) as string;
                    setPoiDrawer({
                      show: true,
                      kind: "restaurant",
                      id: restaurantId,
                      name: payload.title as string | undefined,
                      itinerary_city_id: (payload.itineraryCityId ??
                        payload.itinerary_city_id) as string | undefined,
                      date: (payload.startDate ??
                        payload.date) as string | undefined,
                    });
                    analyticsRef.current.trackPoiCardClicked?.(
                      localItineraryId || "",
                      restaurantId,
                      "chat",
                    );
                    return;
                  }

                  // ── Transfer ──────────────────────────────────────────
                  // transfer.select is the legacy single-edge payload.
                  // transfer.view / transfer.detail are the richer multi-
                  // segment payloads. All three open TransferEditDrawer.
                  // We pass initialMode + initialEdgeId so the drawer skips
                  // its mode-selection step (currentStep=0) and opens the
                  // matching modal directly: Flight → ComboFlight, Taxi →
                  // ComboTaxi, anything else (Train/Bus/Ferry) → OtherTransfer.
                  // Multi-leg routes auto-advance through legs from step 1.
                  if (
                    action.type === "transfer.select" ||
                    action.type === "transfer.view" ||
                    action.type === "transfer.detail" ||
                    action.type === "open_transfer_drawer"
                  ) {
                    const segments: any[] = Array.isArray(payload.segments)
                      ? payload.segments
                      : [];
                    const firstSegment = segments[0];
                    const edgeId = (payload.id ??
                      payload.edge_id ??
                      firstSegment?.id ??
                      firstSegment?.transfer_id) as string | undefined;
                    const initialMode = (payload.mode ??
                      firstSegment?.mode) as string | undefined;
                    const indexed = edgeId
                      ? transferEdgeMapRef.current[edgeId]
                      : undefined;
                    const bookingId =
                      (payload.bookingId ??
                        payload.booking_id ??
                        payload.route_id ??
                        payload.id ??
                        edgeId) as string | undefined;
                    const oItineraryCity =
                      (payload.originItineraryCityId ??
                        payload.origin_itinerary_city_id ??
                        indexed?.from_itinerary_city_id) as string | undefined;
                    const dItineraryCity =
                      (payload.destinationItineraryCityId ??
                        payload.destination_itinerary_city_id ??
                        indexed?.to_itinerary_city_id) as string | undefined;
                    const doj =
                      (payload.date ??
                        payload.check_in ??
                        payload.transfer_date ??
                        indexed?.check_in) as string | undefined;

                    router.push(
                      {
                        pathname: "/chat/[id]",
                        query: {
                          ...router.query,
                          id: sessionIdRef.current,
                          drawer: "editTransfer",
                          drawerType: "",
                          bookingId: bookingId ?? "",
                          oItineraryCity: oItineraryCity ?? "",
                          dItineraryCity: dItineraryCity ?? "",
                          doj: doj ?? "",
                          initialMode: initialMode ?? indexed?.mode ?? "",
                          initialEdgeId: edgeId ?? "",
                        },
                      },
                      undefined,
                      { scroll: false },
                    );
                    analyticsRef.current.trackTransferCardClicked?.(
                      localItineraryId || "",
                      edgeId ?? bookingId ?? "",
                      "chat",
                      indexed?.from_city ?? (payload.from_city as string | undefined) ?? null,
                      indexed?.to_city ?? (payload.to_city as string | undefined) ?? null,
                    );
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
                    const hotelAccommodationId = (payload.hotelId ??
                      payload.accommodation_id ??
                      payload.hotel_id ??
                      payload.id) as string;
                    analyticsRef.current.trackHotelCardClicked?.(
                      localItineraryId || "",
                      hotelAccommodationId,
                      "chat",
                    );
                    setHotelDrawer({
                      show: true,
                      accommodationId: hotelAccommodationId,
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
                      cityName: (payload.cityName ??
                        payload.city_name ??
                        payload.city) as string | undefined,
                      source:
                        ((payload.source ?? payload.provider) as string) ??
                        "Travclan",
                      travclan_hotel_id: (payload.travclan_hotel_id ?? payload.travclanHotelId ??
                        payload.hotel_id) as string | undefined,
                      currency: payload.currency as string | undefined,
                      occupancies: (payload.occupancies ??
                        payload.occupancy) as
                        | Array<{ num_adults: number; child_ages: number[] }>
                        | undefined,
                      traceId: (payload.traceId ??
                        payload.trace_id) as string | undefined,
                    });
                    return;
                  }

                  // ── Sightseeing / Add City Taxi ──────────────────────
                  // sightseeing.open opens the multicity TransferEditDrawer
                  // for an itinerary city — same drawer the city header's
                  // "Add Taxi" CTA opens on /itinerary. We resolve the city
                  // payload from Redux so the drawer has the geo metadata
                  // it needs to fetch suggestions, then mirror the URL the
                  // itinerary page uses (?drawer=addCityTaxi&itinerary_city_id=...)
                  // so refresh / share preserves the open drawer.
                  if (
                    action.type === "sightseeing.open" ||
                    action.type === "pickup_drop.open"
                  ) {
                    const itineraryCityId = (payload.itineraryCityId ??
                      payload.itinerary_city_id ??
                      payload.city_id) as string | undefined;
                    const matchedCity = itinerary?.cities?.find(
                      (c: any) => String(c?.id) === String(itineraryCityId),
                    );
                    if (!matchedCity) {
                      sendWidgetAction(action.type, payload);
                      return;
                    }
                    const initialTab: "sightseeing" | "airport" =
                      action.type === "pickup_drop.open"
                        ? "airport"
                        : "sightseeing";
                    setSightseeingDrawer({
                      show: true,
                      itinerary_city_id: itineraryCityId,
                      cityId: matchedCity?.city?.id,
                      cityName: matchedCity?.city?.name,
                      cityData: matchedCity,
                      startDate: (payload.startDate ??
                        payload.start_date ??
                        matchedCity?.start_date) as string | undefined,
                      endDate: (payload.endDate ??
                        payload.end_date ??
                        matchedCity?.end_date) as string | undefined,
                      initialTab,
                    });
                    const url = new URL(window.location.href);
                    url.searchParams.set("drawer", "addCityTaxi");
                    if (itineraryCityId) {
                      url.searchParams.set("itinerary_city_id", itineraryCityId);
                    }
                    url.searchParams.set("taxiTab", initialTab);
                    window.history.pushState({}, "", url.toString());
                    return;
                  }

                  // ── Visa ──────────────────────────────────────────────
                  // visa.open opens VisaSearchDrawer (the same drawer the
                  // booking slide's "Add Visa" CTA opens). Drawer fetches
                  // its own catalogue so the click payload doesn't need
                  // to carry visa data.
                  if (action.type === "visa.open") {
                    setVisaDrawer({ show: true });
                    return;
                  }

                  // ── eSIM ──────────────────────────────────────────────
                  // esim.open opens EsimPackagesDrawer (the same drawer the
                  // booking slide's "Add eSIM" CTA opens).
                  if (action.type === "esim.open") {
                    setEsimDrawer({ show: true });
                    return;
                  }

                  sendWidgetAction(action.type, payload);
                }}
              />
              );
            })}

            {/* {showError && (
              <div className="mt-2 px-2.5 py-2.5 text-xs text-red-600 flex items-center gap-2">
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
                  // className="ml-auto text-red-400 hover:text-red-600"
                  aria-label="Dismiss error"
                >
                  ✕
                </button>
              </div>
            )} */}

            {showLoginPrompt && !isLoggedIn && (
              <div className="mt-[12px] p-2">
                 <div
          style={{
            maxWidth: "100%",
            // background: "#f8fafc",
            color: "#000000",
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
      {(quickReplies.length > 0 || quickReplyLoading) && !isComposerLocked && (
        <div className="flex-shrink-0 px-[0.25rem] md:!px-6 pt-2 pb-1">
          <div className="mx-auto">
            <div
              className="flex gap-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {quickReplyLoading
                ? ["28%", "24%", "30%", "26%"].map((w, idx) => (
                    <QuickReplyShimmerChip key={`qr-shimmer-${idx}`} width={w} />
                  ))
                : quickReplies.map((reply, idx) => (
                    <SingleChips
                      key={idx}
                      onClick={() => handleQuickReply(reply)}
                      disabled={isStreaming || isComposerLocked}
                    >
                      {reply.label}
                    </SingleChips>
                  ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Composer ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-[0.25rem] md:!px-6 pt-3 pb-1 bg-white relative">
        <div className="mx-auto">
          <MessageInputBox
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            onStop={cancelStream}
            isStreaming={isStreaming}
            disabled={isComposerLocked}
            placeholder={
              isItineraryCompleting
                ? "Planning your trip…"
                : isItineraryPolling
                ? "Updating your itinerary…"
                : "Ask me anything"
            }
            showAttach={!isComposerLocked}
            onFilesSelected={handleFilesSelected}
            attachments={attachments}
            onRemoveAttachment={handleRemoveAttachment}
          />
        </div>
        {/* Overlay blocks all typing/interaction while itinerary creation
            or an update/edit poll is in progress. */}
        {isComposerLocked && (
          <div
            className="absolute inset-0 cursor-not-allowed"
            style={{ background: "rgba(255,255,255,0.55)", zIndex: 5 }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* ── View Itinerary CTA — mobile only ──────────────────────────────
          Mirrors the "Get Inspired" CTA on the welcome screen. Visible once
          the bot has produced a draft (display_itinerary fired) or the
          thread has reached P2, so users can jump from chat to the
          itinerary tab without hunting for the top tab strip. */}
      {(botMode === "p2" || hasDisplayItinerary) && onViewItinerary && (
        <button
          type="button"
          onClick={onViewItinerary}
          className="md:hidden flex-shrink-0 w-full flex items-center justify-center gap-1 py-2 text-[14px] font-medium"
          style={{ background: "#f7e700", color: "#000000" }}
        >
          <span>View Itinerary</span>
          <span aria-hidden>→</span>
        </button>
      )}

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
              // style={
              //   isMobile
              //     ? {
              //         position: "fixed",
              //         left: 0,
              //         right: 0,
              //         bottom: 0,
              //         background: "#fff",
              //         borderTopLeftRadius: 16,
              //         borderTopRightRadius: 16,
              //         width: "100%",
              //         maxHeight: "90vh",
              //         overflowY: "auto",
              //         zIndex: 3300,
              //         boxShadow: "0 -8px 30px rgba(0,0,0,0.25)",
              //       }
              //     : {
              //         position: "fixed",
              //         top: "50%",
              //         left: "50%",
              //         transform: "translate(-50%, -50%)",
              //         background: "#fff",
              //         borderRadius: 16,
              //         width: "min(480px, 95vw)",
              //         maxHeight: "90vh",
              //         overflowY: "auto",
              //         zIndex: 3300,
              //         boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              //       }
              // }
            >
              <BotLoginModal
                show={showLoginModal}
                onhide={() => setShowLoginModal(false)}
                zIndex={"3300"}
                message="Please login to continue"
                onSuccess={async () => {
                  await onLoginSuccess?.();
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
          fromChat={true}
          activityId={activityDrawer.activityId}
          date={activityDrawer.date}
          handleCloseDrawer={() => setActivityDrawer({ show: false })}
          setShowDetails={() => setActivityDrawer({ show: false })}
          setShowLoginModal={setShowLoginModal}
          Topheading="Activity Details"
          showPackages={false}
          type={"activity"}
          pax={{
            adults: itinerary?.number_of_adults ?? 1,
            children: itinerary?.number_of_children ?? 0,
            childAges: Array.from(
              { length: itinerary?.number_of_children ?? 0 },
              () => 10,
            ),
          }}
          itinerary_city_id={activityDrawer.itinerary_city_id}
          onAddToItinerary={(payload: Record<string, unknown>) => {
            const itineraryCityId =
              (payload as any).itinerary_city_id ??
              activityDrawer.itinerary_city_id;
            // Prefer the picker-chosen date (start_date / date in the
            // payload) over the date the card was originally opened with —
            // and keep `time` from the payload so the booking POST records
            // the slot the user picked.
            const pickerStartDate =
              ((payload as any).start_date as string | undefined) ??
              ((payload as any).date as string | undefined);
            void (async () => {
              const data = await postBookingAction(
                "bookings/activity/",
                {
                  ...payload,
                  itinerary_city_id: itineraryCityId,
                  date: pickerStartDate ?? activityDrawer.date,
                },
                "Added activity to your itinerary",
              );
              if (data) {
                applyActivityBookingToItinerary(data, itineraryCityId);
                // Re-pull the full itinerary so derived state (city
                // duration / day-by-day, pricing) reflects what the
                // backend now has.
                void fetchAndApplyItineraryDetail();
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
          getPaymentHandler={getPaymentInfo}
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
          accommodationId={hotelDrawer.travclan_hotel_id}
          onHide={() => setHotelDrawer({ show: false })}
          onChangeHotel={() => {
            // Don't POST from chat; close the detail drawer and route the
            // user into the existing changeHotelBooking drawer (rendered by
            // the itinerary tree) by setting the URL params it consumes.
            const matchedCity = itinerary?.cities?.find(
              (c: any) =>
                String(c?.id) === String(hotelDrawer.itinerary_city_id),
            );
            const dbCityId =
              hotelDrawer.dbCityId ?? matchedCity?.city?.id ?? "";
            const cityName =
              hotelDrawer.cityName ?? matchedCity?.city?.name ?? "";

            // Backend expects a "YYYY-MM-DD HH:MM:SS" string. Append the
            // zero-time suffix only when the input is a bare date.
            const ensureDateTime = (v?: string) => {
              if (!v) return "";
              return v.includes(" ") ? v : `${v} 00:00:00`;
            };
            const checkIn = ensureDateTime(hotelDrawer.check_in);
            const checkOut = ensureDateTime(hotelDrawer.check_out);

            // Nights between check_in and check_out (UTC midnights to avoid
            // DST edge-cases). Falls back to 0 when either side is missing.
            let hotelDuration = 0;
            if (hotelDrawer.check_in && hotelDrawer.check_out) {
              const ms =
                new Date(hotelDrawer.check_out).getTime() -
                new Date(hotelDrawer.check_in).getTime();
              if (!isNaN(ms)) {
                hotelDuration = Math.max(
                  0,
                  Math.round(ms / (1000 * 60 * 60 * 24)),
                );
              }
            }

            setHotelDrawer({ show: false });

            router.push(
              {
                pathname: router.pathname,
                query: {
                  ...router.query,
                  drawer: "changeHotelBooking",
                  clickType: "Change",
                  itineraryCityId: hotelDrawer.itinerary_city_id ?? "",
                  booking_id: hotelDrawer.bookingId ?? "",
                  check_in: checkIn,
                  check_out: checkOut,
                  hotel_duration: String(hotelDuration),
                  city_id: dbCityId,
                  city_name: cityName,
                },
              },
              undefined,
              { scroll: false },
            );
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
          dbCityId={hotelDrawer.dbCityId}
          source={hotelDrawer.source}
          occupancies={
            hotelDrawer.occupancies && hotelDrawer.occupancies.length
              ? hotelDrawer.occupancies
              : [
                  {
                    num_adults: itinerary?.number_of_adults ?? 1,
                    child_ages: Array.from(
                      { length: itinerary?.number_of_children ?? 0 },
                      () => 10,
                    ),
                  },
                ]
          }
          traceId={hotelDrawer.traceId}
          setShowLoginModal={setShowLoginModal}
          // Authoritative itinerary id for this chat. The drawer would
          // otherwise fall through to Redux Itinerary.id, which can lag
          // when the user has just switched threads — leading to the
          // POST hitting the previously loaded itinerary.
          itineraryId={localItineraryId}
          // Re-fetch the canonical itinerary so day_by_day buckets and
          // city.hotels reflect the new booking — the drawer already
          // patches the Stays slice, but the Itinerary slice needs the
          // full server payload to stay in sync.
          onBookingSuccess={() => {
            void fetchAndApplyItineraryDetail();
          }}
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
          onAddToItinerary={(payload?: Record<string, unknown>) => {
            const kind = poiDrawer.kind ?? "poi";
            const path = kind === "restaurant" ? "restaurant/add/" : "poi/add/";
            const itineraryCityId = poiDrawer.itinerary_city_id;
            // Prefer the date the picker chose (start_date / date in the
            // payload) over the date the card was originally opened with.
            const pickerStartDate =
              ((payload as any)?.start_date as string | undefined) ??
              ((payload as any)?.date as string | undefined);
            const date = pickerStartDate ?? poiDrawer.date;
            const dayByDayIndex = Math.max(
              0,
              ((payload as any)?.day as number | undefined) != null
                ? ((payload as any).day as number) - 1
                : 0,
            );
            const time = (payload as any)?.time as string | undefined;
            const body: Record<string, unknown> = {
              itinerary_city_id: itineraryCityId,
              date,
              day_by_day_index: dayByDayIndex,
              ...(time ? { time } : {}),
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
                // Re-pull the full itinerary so the next drawer open
                // reads the up-to-date day-by-day and city duration.
                void fetchAndApplyItineraryDetail();
              }
            })();
            setPoiDrawer({ show: false });
          }}
          setShowLoginModal={setShowLoginModal}
          handleCloseDrawer={() => setPoiDrawer({ show: false })}
        />
      )}

      {/* ── Sightseeing / Add City Taxi Drawer ──────────────────────────── */}
      {/* Opened by sightseeing.open widget actions. Renders TransferEditDrawer
          in multicity (intra-city) mode — same drawer the city header's
          "Add Taxi" CTA opens on the /itinerary page. */}
      {sightseeingDrawer.show && sightseeingDrawer.cityData && (
        <TransferEditDrawer
          mercury
          isMercury
          showDrawer={sightseeingDrawer.show}
          drawerType="multicity"
          booking_type="multicity"
          origin_itinerary_city_id={sightseeingDrawer.itinerary_city_id}
          destination_itinerary_city_id={sightseeingDrawer.itinerary_city_id}
          originCityId={sightseeingDrawer.cityId}
          destinationCityId={sightseeingDrawer.cityId}
          city={sightseeingDrawer.cityName}
          dcity={sightseeingDrawer.cityName}
          oCityData={sightseeingDrawer.cityData}
          dCityData={sightseeingDrawer.cityData}
          check_in={sightseeingDrawer.startDate}
          initialTab={sightseeingDrawer.initialTab}
          getPaymentHandler={getPaymentInfo}
          setShowLoginModal={setShowLoginModal}
          handleClose={() => {
            setSightseeingDrawer({ show: false });
            const url = new URL(window.location.href);
            if (url.searchParams.get("drawer") === "addCityTaxi") {
              url.searchParams.delete("drawer");
              url.searchParams.delete("itinerary_city_id");
              url.searchParams.delete("taxiTab");
              window.history.pushState({}, "", url.toString());
            }
          }}
        />
      )}

      {/* ── Visa Search Drawer ──────────────────────────────────────────── */}
      {/* Opened by visa.open widget actions. Drawer self-fetches visa
          options from the ancillary service. */}
      <VisaSearchDrawer
        show={visaDrawer.show}
        onHide={() => setVisaDrawer({ show: false })}
      />

      {/* ── eSIM Packages Drawer ────────────────────────────────────────── */}
      {/* Opened by esim.open widget actions. Drawer self-fetches eSIM
          packages from the ancillary service. */}
      <EsimPackagesDrawer
        show={esimDrawer.show}
        onHide={() => setEsimDrawer({ show: false })}
      />
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