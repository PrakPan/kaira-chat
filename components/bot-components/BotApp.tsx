import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { ChatKitPanel } from "./components/ChatKitPanel";
import MapView from "./components/MapView";
import ViewToggle from "./components/ViewToggle";
import Sidebar from "./components/Sidebar";
import StartScreen from "./components/StartScreen";
import ChatWelcomeScreen from "./components/ChatWelcomeScreen";
import TrustIndicators from "./components/TrustIndicators";
import { useUserLocation } from "./hooks/useUserLocation";
import { useMapBounds } from "./hooks/useMapBounds";
import { ItineraryStatusLoader } from "../../containers/itinerary/ItineraryContainer";
import ItineraryContainer from "../../containers/itinerary/ItineraryContainer";
import type {
  Location,
  ItineraryData,
  TransfersData,
  MapState,
  ViewMode,
  BotMode,
} from "./types";
import { useDispatch } from "react-redux";
import setItineraryIdAction from "../../store/actions/itineraryId";
import setItineraryStatus from "../../store/actions/itineraryStatus";
import setItineraryDaybyDay from "../../store/actions/itineraryDaybyDay";
import setItinerary from "../../store/actions/itinerary";
import setBreif from "../../store/actions/breif";
import { setTransfersBookings } from "../../store/actions/transferBookingsStore";
import { setStays } from "../../store/actions/StayBookings";
import ChatBot from "../Chatbot/Index";
import ConfirmationModal from "./components/ConfirmationModal";
import { useSelector } from "react-redux";
import setCart from "../../store/actions/Cart";
import { setUnreadMessages } from "../../store/actions/chatState";
import axios from "axios";
import { MERCURY_HOST } from "../../services/constants";
import SmallGallery from "../../containers/newitinerary/overview/SmallGallery";
import NewSummaryContainers from "../../containers/itinerary/NewSummaryContainers";
import Image from "next/image";
import ModalWithBackdrop from "../ui/ModalWithBackdrop";
import Settings from "../settings/Index";
import { SocialShareDesktop } from "../../containers/itinerary/booking1/SocialShare";
import NotificationPopup from "../ui/NotificationPopup";

type MobilePanel = "map" | "chat";
type LeftPanelMode = "default" | "itinerary-loading" | "itinerary-ready";

function transformDraftToItinerary(draft: any) {
  const routes = draft?.routes ?? [];
  const cities = routes.map((route: any) => {
    const cityName = route.city?.name ?? "unknown";
    const cityId = route.city?.id || `draft-city-${route.city?.name}`;
    return {
      id: cityId,
      city: {
        id: route.city?.id || null,
        name: cityName,
        latitude: null,
        longitude: null,
        gmaps_place_id: null,
        image: [],
        car_free_city: false,
      },
      start_date: null,
      end_date: null,
      duration: route.city?.duration ?? 0,
      day_by_day: (route.day_by_day ?? []).map((day: any) => ({
        day: day.day,
        date: day.date ?? null,
        day_summary: day.day_summary ?? "",
        slab_id: null,
        slab_elements: (day.slab_elements ?? []).map(
          (el: any, idx: number) => ({
            id: el.id ?? null,
            icon: el.icon ?? null,
            tags: el.tags ?? [],
            time: el.time ?? "",
            index: idx,
            rating: el.rating ?? null,
            heading: el.heading ?? el.name ?? "",
            end_time: el.end_time ?? "",
            start_time: el.start_time ?? "",
            element_type: el.type ?? el.element_type ?? "poi",
            user_ratings_total: el.user_ratings_total ?? 0,
            latitude: el.latitude ?? null,
            longitude: el.longitude ?? null,
          }),
        ),
      })),
      hotels: route.hotels
        ? [
            {
              id: route.hotels.id || `draft-hotel-${cityId}`,
              name: route.hotels.name,
              star_category: null,
              images: [],
              rating: null,
              itinerary_city_id: cityId,
            },
          ]
        : [],
      activities: [],
      transfers: { sightseeing: [], airport: [] },
    };
  });

  return {
    name: draft?.name ?? "Your Itinerary",
    start_date: null,
    end_date: null,
    cities,
    version: "v2",
    celery: {
      ITINERARY: "SUCCESS",
      HOTELS: "PENDING",
      TRANSFERS: "PENDING",
      PRICING: "PENDING",
      display_text: null,
      notes: [],
    },
    status: "Draft",
  };
}

export default function BotApp({ sessionId }: { sessionId?: string }) {
  const [mapState, setMapState] = useState<MapState>({
    lat: 28.6139,
    lng: 77.2088,
    zoom: 12,
  });
  const mapRef = useRef<google.maps.Map | null>(null);
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);
  const sendMessageRef = useRef<((msg: string) => void) | null>(null);
  const dispatch = useDispatch();

  const [locations, setLocations] = useState<Location[] | null>(null);
  const [currentRoute, setCurrentRoute] = useState<Location[] | null>(null);
  const { userLocation, isLoadingLocation } = useUserLocation(setMapState);

  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(null);
  const [transfers, setTransfers] = useState<TransfersData | null>(null);
  const [showItineraryShimmer, setShowItineraryShimmer] = useState(false);

  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [botMode, setBotMode] = useState<BotMode>("p1");
  const [itineraryId, setItineraryId] = useState("");
  const [chatKey, setChatKey] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // ── Init showStartScreen/isChatActive from sessionId to prevent flicker on reload ──
  const [showStartScreen, setShowStartScreen] = useState(!sessionId);
  const [isChatActive, setIsChatActive] = useState(!!sessionId);
  // When reloading with a sessionId, mark hasBotResponded true so the left panel is visible
  // while we restore the thread data. It will be properly set by the restore flow.
  const [hasBotResponded, setHasBotResponded] = useState(!!sessionId);
  const [isLeftPanelRevealing, setIsLeftPanelRevealing] = useState(false);

  const [leftPanelMode, setLeftPanelMode] = useState<LeftPanelMode>("default");
  const [completingItineraryId, setCompletingItineraryId] = useState<string | null>(null);
  const [loaderDisplayText, setLoaderDisplayText] = useState<string | null>(null);
  const [isRoutePreparing, setIsRoutePreparing] = useState(false);

  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("chat");
  const [activeItineraryId, setActiveItineraryId] = useState<string | null>(null);
  const [itineraryPollingEnabled, setItineraryPollingEnabled] = useState(false);
  const initialPromptRef = useRef<string | null>(null);
  const [showChatBot, setShowChatBot] = useState(false);

  // ── Frozen ChatBot itinerary ID — set once, never changes after first assignment ──
  const [chatBotItineraryId, setChatBotItineraryId] = useState<string | null>(null);

  const [restoredThread, setRestoredThread] = useState<any>(null);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const currentItineraryRef = useRef<any>(null);
  const [skeletonCities, setSkeletonCities] = useState<any[]>([]);
  const skeletonCitiesRef = useRef<any[]>([]);
  const chatSendMessageRef = useRef<((msg: string) => void) | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const cart = useSelector((state: any) => state.Cart);
  const pricingStatus = useSelector((state: any) => state.ItineraryStatus?.pricing_status);
  const currency = useSelector((state: any) => state.currency);
  const [isMobile, setIsMobile] = useState(false);
  // Mobile effect popup — shown for 10s when focus_route / itinerary effects fire
  const [mobileEffectPopup, setMobileEffectPopup] = useState<{ type: "map" | "itinerary"; label: string } | null>(null);
  const mobileEffectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Only show the "Back to Map" popup once (first focus_route)
  const hasShownMapPopupRef = useRef(false);

  // Payment drawer — persists via ?drawer=payment in URL
  const [showPaymentDrawer, setShowPaymentDrawer] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("drawer") === "payment";
    }
    return false;
  });
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentDrawerKey, setPaymentDrawerKey] = useState(0);

  const fetchPaymentData = useCallback(async (itinId: string) => {
    if (!itinId) return;
    setPaymentLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get(`${MERCURY_HOST}/api/v1/itinerary/${itinId}/cart/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaymentData(res.data);
      dispatch(setCart(res.data));
    } catch (e) {
      console.error("Failed to fetch payment data", e);
    } finally {
      setPaymentLoading(false);
    }
  }, [dispatch]);

  // Ref so MobileLayout can expose its tab-switch fn; used by openPaymentDrawer on mobile
  const mobileTabSwitchRef = useRef<((tab: string) => void) | null>(null);
  const handleRegisterMobileTabSwitch = useCallback((fn: ((tab: string) => void) | null) => {
    mobileTabSwitchRef.current = fn;
  }, []);

  // Sync ?drawer=payment in URL when drawer opens / closes
  // On mobile, View Cart switches to itinerary tab instead of opening the sheet
  const openPaymentDrawer = React.useCallback(() => {
    if (activeItineraryId && activeItineraryId !== "skeleton" && activeItineraryId !== "draft") {
      fetchPaymentData(activeItineraryId);
    }
    setPaymentDrawerKey((k) => k + 1);
    setShowPaymentDrawer(true);
    const url = new URL(window.location.href);
    url.searchParams.set("drawer", "payment");
    window.history.pushState({}, "", url.toString());
  }, [activeItineraryId, fetchPaymentData]);
  const closePaymentDrawer = React.useCallback(() => {
    setShowPaymentDrawer(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("drawer");
    window.history.pushState({}, "", url.toString());
  }, []);

  // When drawer is open (e.g. after refresh with ?drawer=payment) and the itinerary ID
  // becomes available, fetch the payment data automatically.
  useEffect(() => {
    if (
      showPaymentDrawer &&
      activeItineraryId &&
      activeItineraryId !== "skeleton" &&
      activeItineraryId !== "draft"
    ) {
      fetchPaymentData(activeItineraryId);
    }
  }, [showPaymentDrawer, activeItineraryId, fetchPaymentData]);

  const itineraryRedux = useSelector((state: any) => state.Itinerary);
  const itineraryReduxName = itineraryRedux?.name;
  const [showShare, setShowShare] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isHotelsPresent, setIsHotelsPresent] = useState(false);

  // ── Refs for restore guards ──────────────────────────────────────────────
  const hasRestoredRef = useRef(false);
  const userSelectedThreadRef = useRef(false);
  const chatBotInjectedMessageRef = useRef<string | null>(null);
  const isLoadingThreadRef = useRef(false);

  const [activeChatSessionId, setActiveChatSessionId] = useState<string | undefined>(
  sessionId ?? undefined
);

  // ── Mobile breakpoint — single source of truth so only ONE ItineraryContainer
  //    is ever rendered in the DOM at a time ─────────────────────────────────

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleSendMessageReady = useCallback(
    (sendFn: (msg: string) => void) => {
      chatSendMessageRef.current = sendFn;
    },
    [],
  );

  // ── Helpers ──────────────────────────────────────────────────────────────

  const clearStaleChatSessions = () => {
    try {
      const keysToRemove = Object.keys(localStorage).filter((k) =>
        k.startsWith("chatkit_session_"),
      );
      if (keysToRemove.length > 3) {
        keysToRemove.slice(0, keysToRemove.length - 3).forEach((k) => {
          localStorage.removeItem(k);
        });
      }
    } catch (e) {
      console.warn("Error clearing chat sessions:", e);
    }
  };

  const setChatBotIdOnce = useCallback((id: string) => {
    setChatBotItineraryId((prev) => prev ?? id);
  }, []);

  // ── restoreItineraryDirectly — used for old itineraries with no chatkit threads ──
  const restoreItineraryDirectly = useCallback(
    async (itineraryId: string) => {
      if (!itineraryId || itineraryId === "undefined") return;
      try {
        const { axiosGetItineraryStatus } = await import(
          "../../services/itinerary/daybyday/preview"
        );
        const statusRes = await axiosGetItineraryStatus.get(
          `/${itineraryId}/status/`,
        );
        const status = statusRes.data?.celery;
        if (!status) return;

        dispatch(setItineraryStatus("itinerary_status", status.ITINERARY || "PENDING"));
        dispatch(setItineraryStatus("hotels_status", status.HOTELS || "PENDING"));
        dispatch(setItineraryStatus("transfers_status", status.TRANSFERS || "PENDING"));
        dispatch(setItineraryStatus("pricing_status", status.PRICING || "PENDING"));

        const allDone = ["ITINERARY", "HOTELS", "TRANSFERS", "PRICING"].every(
          (k) => status[k] === "SUCCESS" || status[k] === "FAILURE",
        );
        if (allDone) dispatch(setItineraryStatus("finalized_status", "SUCCESS"));

        dispatch(setCart({}));
        dispatch(setItineraryIdAction(itineraryId));

        setActiveItineraryId(itineraryId);
        setItineraryPollingEnabled(true);
        setShowChatBot(true);
        setChatBotIdOnce(itineraryId);
        setShowStartScreen(false);
        setHasBotResponded(true);
        setIsChatActive(true);
        setViewMode("itinerary");
        setMobilePanel("map");
      } catch (err) {
        console.error("Failed to restore itinerary directly:", err);
        setShowStartScreen(true);
        setHasBotResponded(false);
        setIsChatActive(false);
      }
    },
    [dispatch, setChatBotIdOnce],
  );

  const countCartItems = useMemo(() => {
    if (!cart?.summary) return 0;
    return Object.values(cart.summary).reduce(
      (sum: number, item: any) => sum + (item.count ?? 0),
      0,
    );
  }, [cart?.summary]);

  useMapBounds(currentRoute, mapRef);

  // ── Skeleton itinerary builder (shared) ──────────────────────────────────
  const buildSkeletonItinerary = useCallback(() => {
    const citiesToUse =
      skeletonCitiesRef.current.length > 0
        ? skeletonCitiesRef.current
        : [{ name: "Loading…", duration: 3 }];
    return {
      name: "Building your itinerary…",
      start_date: null,
      end_date: null,
      cities: citiesToUse.map((c: any, i: number) => ({
        id: `skeleton-city-${i}`,
        city: {
          id: null,
          name: c.name,
          latitude: null,
          longitude: null,
          gmaps_place_id: null,
          image: [],
          car_free_city: false,
        },
        start_date: null,
        end_date: null,
        duration: c.duration,
        day_by_day: Array.from({ length: c.duration }, (_, d) => ({
          day: d + 1,
          date: null,
          day_summary: "",
          slab_id: null,
          slab_elements: [],
        })),
        hotels: [],
        activities: [],
        transfers: { sightseeing: [], airport: [] },
      })),
      version: "v2",
      celery: {
        ITINERARY: "PENDING",
        HOTELS: "PENDING",
        TRANSFERS: "SUCCESS",
        PRICING: "PENDING",
        display_text: null,
        notes: [],
      },
      status: "Draft",
    };
  }, []);

  const handleItineraryCompletionStart = useCallback(
    (_id?: string) => {
      dispatch(setCart({}));
      dispatch(setStays([]));
      dispatch(setTransfersBookings(null));
      currentItineraryRef.current = null;

      if (skeletonCitiesRef.current.length > 0) {
        const skeleton = buildSkeletonItinerary();
        dispatch(setItinerary(skeleton));
        dispatch(setItineraryDaybyDay(skeleton));
        dispatch(setBreif(skeleton));
      }
      dispatch(setItineraryStatus("itinerary_status", "PENDING"));
      dispatch(setItineraryStatus("transfers_status", "PENDING"));
      dispatch(setItineraryStatus("pricing_status", "PENDING"));
      dispatch(setItineraryStatus("hotels_status", "PENDING"));
      dispatch(setItineraryStatus("finalized_status", "PENDING"));
      setShowItineraryShimmer(false);
      setActiveItineraryId("skeleton");
      setShowStartScreen(false);
      setHasBotResponded(true);
      setMobilePanel("map");
      setViewMode("itinerary");
    },
    [dispatch, buildSkeletonItinerary],
  );

  const handleItineraryCompletionDone = useCallback(
    (id: string, summary?: string) => {
      if (!id || id === "undefined") return;
      try {
        setShowItineraryShimmer(false);
        dispatch(setCart({}));
        dispatch(setItineraryIdAction(id));
        dispatch(setItineraryStatus("itinerary_status", "PENDING"));
        dispatch(setItineraryStatus("transfers_status", "PENDING"));
        dispatch(setItineraryStatus("pricing_status", "PENDING"));
        dispatch(setItineraryStatus("hotels_status", "PENDING"));
        dispatch(setItineraryStatus("finalized_status", "PENDING"));
        setActiveItineraryId(id);
        setItineraryPollingEnabled(true);
        setShowChatBot(true);
        setChatBotIdOnce(id);
        setHasBotResponded(true);
        setShowStartScreen(false);
        setViewMode("itinerary");
        if (summary) chatBotInjectedMessageRef.current = summary;
      } catch (e) {
        console.error("handleItineraryCompletionDone error:", e);
      }
    },
    [dispatch, setChatBotIdOnce],
  );

  const revealLeftPanel = useCallback(() => {
    if (!hasBotResponded) {
      setIsLeftPanelRevealing(true);
      requestAnimationFrame(() => {
        setTimeout(() => {
          setShowStartScreen(false);
          setHasBotResponded(true);
          setIsLeftPanelRevealing(false);
        }, 350);
      });
    }
  }, [hasBotResponded]);

  // Trigger a 10-second "Back to Map" popup — shown in chat view when map updates
  // Only fires once (first focus_route). Itinerary popup is removed per UX revision.
  const triggerMobileEffectPopup = useCallback((type: "map" | "itinerary") => {
    if (!isMobile) return;
    // Only show "Back to Map" popup; silently ignore itinerary triggers
    if (type !== "map") return;
    // Show only on the very first focus_route event
    if (hasShownMapPopupRef.current) return;
    hasShownMapPopupRef.current = true;
    setMobileEffectPopup({ type: "map", label: "Back to Map" });
    if (mobileEffectTimerRef.current) clearTimeout(mobileEffectTimerRef.current);
    mobileEffectTimerRef.current = setTimeout(() => setMobileEffectPopup(null), 10000);
  }, [isMobile]);

  const handleLoadRouteOnMap = useCallback(() => {
    setIsRoutePreparing(true);
    setViewMode("map");
    setMobilePanel("map");
    revealLeftPanel();
  }, [revealLeftPanel]);

  const handleRouteReceived = useCallback(
    (routeData: { data: Location[] }) => {
      setIsRoutePreparing(false);
      revealLeftPanel();
      if (routeData.data && Array.isArray(routeData.data) && routeData.data.length > 0) {
        setViewMode("map");
        setMobilePanel("map");
        const cities = routeData.data.map((loc: any) => ({
          name: loc.name,
          duration: loc.duration ?? 1,
        }));
        setSkeletonCities(cities);
        skeletonCitiesRef.current = cities;
        // On mobile: show "Back to Map" popup so user knows the map has updated
        triggerMobileEffectPopup("map");
      }
      if (routeData.data && Array.isArray(routeData.data)) {
        setCurrentRoute(routeData.data);
        setLocations((prev) => {
          const newLocations = [...(prev || [])];
          routeData.data.forEach((location) => {
            const exists = newLocations.some((loc) => loc.id === location.id);
            if (!exists) newLocations.push(location);
          });
          return newLocations;
        });
      }
    },
    [revealLeftPanel, triggerMobileEffectPopup],
  );

  const sessionIdFromUrl = useMemo(() => {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/\/chat\/([a-f0-9-]{36})/);
  return match ? match[1] : null;
}, []);

  const handleItineraryReceived = useCallback(
    (data: any) => {
      revealLeftPanel();

      if (data?.shimmer) {
        dispatch(setItineraryStatus("itinerary_status", "PENDING"));
        dispatch(setItineraryStatus("transfers_status", "SUCCESS"));
        setViewMode("itinerary");
        setMobilePanel("map");
        setShowStartScreen(false);
        setHasBotResponded(true);

        const skeleton = buildSkeletonItinerary();
        dispatch(setItinerary(skeleton));
        dispatch(setItineraryDaybyDay(skeleton));
        dispatch(setBreif(skeleton));

        if (activeItineraryId !== "skeleton" && activeItineraryId !== "draft") {
          setActiveItineraryId("skeleton");
          setItineraryPollingEnabled(false);
        }
        // On mobile: show "Back to Itinerary" popup
        triggerMobileEffectPopup("itinerary");
        return;
      }

      if (data?.transfers && !data?.itinerary && !data?.routes) {
        const intercity: Record<string, any> = {};
        (data.transfers ?? []).forEach((t: any, idx: number) => {
          const nameToId: Record<string, string> = {};
          for (const c of currentItineraryRef.current?.cities ?? []) {
            if (c.city?.name && c.id) nameToId[c.city.name] = String(c.id);
          }
          const fromId = nameToId[t.from_city] || `draft-city-${t.from_city}`;
          const toId = nameToId[t.to_city] || `draft-city-${t.to_city}`;
          const key = `${fromId}:${toId}`;
          const leg = t.legs?.[0] ?? "";
          const bookingType = leg.toLowerCase().includes("flight")
            ? "Flight"
            : leg.toLowerCase().includes("train")
              ? "Train"
              : "Taxi";
          intercity[key] = {
            id: `draft-transfer-${idx}`,
            name: t.legs?.join(" + ") ?? `${t.from_city} to ${t.to_city}`,
            booking_type: bookingType,
            transfer_type: "intercity",
            from_city: t.from_city,
            to_city: t.to_city,
            legs: t.legs,
            is_draft: true,
          };
        });
        dispatch(setTransfersBookings({ intercity, airport: {}, intracity: {} }));
        dispatch(setItineraryStatus("transfers_status", "SUCCESS"));
        return;
      }

      setShowItineraryShimmer(false);

      const draft = data?.itinerary ?? data;
      const transformed = transformDraftToItinerary(draft);
      currentItineraryRef.current = transformed;

      const draftStays: any[] = [];
      for (const city of transformed.cities ?? []) {
        const hotels = city.hotels ?? [];
        if (hotels.length === 0 || !hotels[0]?.name) {
          draftStays.push({
            itinerary_city_id: city.id,
            city_name: city.city?.name,
            city_id: city.city?.id,
            city_gmaps_place_id: city.city?.gmaps_place_id ?? null,
            trace_city_id: city.id,
            duration: city.duration,
            check_in: null,
            check_out: null,
          });
        } else {
          for (const hotel of hotels) {
            draftStays.push({
              ...hotel,
              itinerary_city_id: city.id,
              city_name: city.city?.name,
              city_id: city.city?.id,
              city_gmaps_place_id: city.city?.gmaps_place_id ?? null,
              lat: hotel.latitude ?? null,
              long: hotel.longitude ?? null,
            });
          }
        }
      }
      dispatch(setStays(draftStays));
      dispatch(setItinerary(transformed));
      dispatch(setItineraryDaybyDay(transformed));
      dispatch(setBreif(transformed));
      dispatch(setItineraryStatus("itinerary_status", "SUCCESS"));

      const hasHotels = transformed.cities?.some(
        (c: any) => c.hotels?.length > 0 && c.hotels[0]?.name,
      );
      dispatch(setItineraryStatus("hotels_status", hasHotels ? "SUCCESS" : "PENDING"));
      dispatch(setItineraryStatus("transfers_status", "PENDING"));
      dispatch(setItineraryStatus("pricing_status", "PENDING"));
      dispatch(setItineraryStatus("finalized_status", "PENDING"));

      setActiveItineraryId("draft");
      setItineraryPollingEnabled(false);
      setViewMode("itinerary");
      setMobilePanel("map");
      // On mobile: show "Back to Itinerary" popup when itinerary data arrives
      triggerMobileEffectPopup("itinerary");
    },
    [revealLeftPanel, dispatch, buildSkeletonItinerary, activeItineraryId, triggerMobileEffectPopup],
  );

  const handleLocationReceived = useCallback(
    (locationData: { data: Location[] }) => {
      revealLeftPanel();
      if (locationData.data && Array.isArray(locationData.data)) {
        setLocations(locationData.data);
        setMobilePanel("map");
      }
    },
    [revealLeftPanel],
  );

  const handleNewQuery = useCallback(() => {
    setLocations([]);
  }, []);

  const handleClearMap = useCallback((data?: Record<string, unknown>) => {
    setLocations([]);
    setCurrentRoute(null);
    // If the effect includes a new location to pan to, display it
    if (data?.data && Array.isArray(data.data) && (data.data as any[]).length > 0) {
      setLocations(data.data as Location[]);
    }
  }, []);

  const loadThread = useCallback(
    async (threadId: string) => {
      if (isLoadingThreadRef.current) return;
      isLoadingThreadRef.current = true;
      try {
        const res = await fetch("https://chat.tarzanway.com/chatkit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "threads.get_by_id",
            params: { thread_id: threadId },
          }),
        });
        const data = await res.json();

        const threadSessionId = data.session_id ?? data.filter_session_id ?? data.metadata?.session_id;
        if (threadSessionId) {
          const target = `/chat/${threadSessionId}`;
          if (window.location.pathname !== target) {
            window.history.pushState({}, "", target);
          }
          sessionStorage.setItem(`chatkit_session_${target}`, threadSessionId);
          setActiveChatSessionId(threadSessionId);
        }
        setRestoredThread(data);
        setActiveThreadId(threadId);
        setIsChatActive(true);

        // If the thread has any chat items (messages), reveal the chat panel
        const hasItems = (data.items?.data ?? []).length > 0;
        if (hasItems) {
          setHasBotResponded(true);
          setShowStartScreen(false);
        }

        (data.map_effects ?? []).forEach((effect: any) => {
          if (effect.name === "focus_route" && effect.data) {
            handleRouteReceived({ data: effect.data });
            setHasBotResponded(true);
            setShowStartScreen(false);
          } else if (
            (effect.name === "focus_on_map" || effect.name === "display_pois_on_map" || effect.name === "show_attraction_on_map") &&
            effect.data
          ) {
            handleLocationReceived({ data: effect.data });
            setHasBotResponded(true);
            setShowStartScreen(false);
          } else if (effect.name === "clear_map") {
            handleClearMap(effect.data);
          }
        });

        const itineraryEffects: any[] = data.itinerary_effects ?? [];
        let completedIdFromEffects: string | null = null;

        for (const effect of itineraryEffects) {
          switch (effect.name) {
            case "display_itinerary":
              handleItineraryReceived(effect.data);
              break;
            case "display_transfers":
              handleItineraryReceived({ transfers: effect.data.transfers });
              break;
            case "start_itinerary_completion_process":
              handleItineraryCompletionStart();
              break;
            case "itinerary_completion_process_completed": {
              const completedId = effect.data?.itinerary_id;
              completedIdFromEffects = completedId ?? null;
              if (completedId) handleItineraryCompletionDone(completedId);
              break;
            }
            default:
              break;
          }
        }

        // If we have a completed itinerary from effects, ensure polling + ChatBot are on
        if (completedIdFromEffects) {
          setActiveItineraryId(completedIdFromEffects);
          setItineraryPollingEnabled(true);
          setShowChatBot(true);
          setChatBotIdOnce(completedIdFromEffects);
          setShowStartScreen(false);
          setHasBotResponded(true);
        }

        // No completed itinerary in effects at all — this is an old itinerary
        // Fall back to direct status API load. Use threadSessionId if available,
        // otherwise fall back to the URL sessionId prop.
        // IMPORTANT: only do this if the thread has NO chat messages — if it has
        // messages it is a valid chatkit thread, not an old itinerary, and calling
        // restoreItineraryDirectly with a chat UUID will fail and reset the UI to
        // the start/welcome screen.
        const hasCompletedEffect = itineraryEffects.some(
          (e) => e.name === "itinerary_completion_process_completed" && e.data?.itinerary_id,
        );
        const hasAnyItineraryEffect = itineraryEffects.some((e) =>
          ["display_itinerary", "start_itinerary_completion_process"].includes(e.name),
        );

        const fallbackSessionId = threadSessionId ?? sessionId;
        if (!hasCompletedEffect && !hasAnyItineraryEffect && !hasItems && fallbackSessionId) {
          await restoreItineraryDirectly(fallbackSessionId);
        }
      } catch (err) {
        console.error("Failed to load thread:", err);
      } finally {
        isLoadingThreadRef.current = false;
      }
    },
    [
      handleRouteReceived,
      handleLocationReceived,
      handleItineraryReceived,
      handleItineraryCompletionStart,
      handleItineraryCompletionDone,
      restoreItineraryDirectly,
      setChatBotIdOnce,
      sessionId,
    ],
  );

  const restoreLatestThread = useCallback(
    async (sid: string) => {
      try {
        const listRes = await fetch("https://chat.tarzanway.com/chatkit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "threads.list",
            params: { limit: 9999, order: "desc" },
            filter_session_id: sid,
          }),
        });
        const listData = await listRes.json();
        const threads = listData.data ?? [];

        if (threads.length === 0) {
          // No chatkit threads → old itinerary, load directly
          await restoreItineraryDirectly(sid);
          return;
        }

        await loadThread(threads[0].id);
      } catch (err) {
        console.error("Failed to restore session:", err);
        await restoreItineraryDirectly(sid);
      }
    },
    [restoreItineraryDirectly, loadThread],
  );

  // ── Only restore on initial mount ────────────────────────────────────────
  useEffect(() => {
    if (!sessionId) return;
    if (hasRestoredRef.current) return;
    if (userSelectedThreadRef.current) return;
    hasRestoredRef.current = true;
    if(window.location.pathname.match(/\/chat\/([a-f0-9-]{36})/)){
    restoreLatestThread(sessionId);
    }
  }, [sessionId, restoreLatestThread]);

  const handleThreadSelect = useCallback(
    async (threadId: string, knownSessionId?: string) => {
      // Reset load guard so the new thread can load
      isLoadingThreadRef.current = false;
      clearStaleChatSessions();
      userSelectedThreadRef.current = true;

      // If we already know the session_id from the thread list, update the URL
      // and activeChatSessionId immediately — before the async loadThread call —
      // so ChatKitPanel remounts with the correct session ID straight away.
      if (knownSessionId) {
        const target = `/chat/${knownSessionId}`;
        if (window.location.pathname !== target) {
          window.history.pushState({}, "", target);
        }
        sessionStorage.setItem(`chatkit_session_${target}`, knownSessionId);
        setActiveChatSessionId(knownSessionId);
      }

      setRestoredThread(null);
      setLocations([]);
      setCurrentRoute(null);
      setSkeletonCities([]);
      skeletonCitiesRef.current = [];
      setActiveItineraryId(null);
      setItineraryPollingEnabled(false);
      setShowItineraryShimmer(false);
      setViewMode("map");
      setHasBotResponded(false);
      setShowStartScreen(false);
      setIsChatActive(true);
      currentItineraryRef.current = null;
      // Close payment drawer from previous itinerary
      setShowPaymentDrawer(false);
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("drawer");
      window.history.replaceState({}, "", cleanUrl.toString());

      dispatch(setItinerary({}));
      dispatch(setCart({}));
      dispatch(setStays([]));
      dispatch(setTransfersBookings(null));
      dispatch(setItineraryStatus("itinerary_status", "PENDING"));
      dispatch(setItineraryStatus("transfers_status", "PENDING"));
      dispatch(setItineraryStatus("hotels_status", "PENDING"));
      dispatch(setItineraryStatus("pricing_status", "PENDING"));
      dispatch(setItineraryStatus("finalized_status", "PENDING"));

      // Load thread (will also update URL/sessionId if API returns session_id),
      // then remount ChatKitPanel with the correct session.
      await loadThread(threadId);
      setChatKey((prev) => prev + 1);
    },
    [loadThread, dispatch],
  );

  const handleNewChat = () => {
    clearStaleChatSessions();
    initialPromptRef.current = null;
    userSelectedThreadRef.current = false;
    hasRestoredRef.current = false;
    setInitialPrompt(null);
    setLocations([]);
    setCurrentRoute(null);
    setItineraryData(null);
    setTransfers(null);
    setViewMode("map");
    setShowStartScreen(true);
    setHasBotResponded(false);
    setIsChatActive(false);
    setMobilePanel("chat");
    setLeftPanelMode("default");
    setCompletingItineraryId(null);
    setLoaderDisplayText(null);
    setActiveItineraryId(null);
    setItineraryPollingEnabled(false);
    setShowChatBot(false);
    // Do NOT reset chatBotItineraryId here — ChatBot must not remount on new chat
    setRestoredThread(null);
    setActiveThreadId(null);
    setSkeletonCities([]);
    skeletonCitiesRef.current = [];
    currentItineraryRef.current = null;
    setShowPaymentDrawer(false);
    const cleanUrl2 = new URL(window.location.href);
    cleanUrl2.searchParams.delete("drawer");
    window.history.replaceState({}, "", cleanUrl2.toString());

    dispatch(setItinerary({}));
    dispatch(setCart({}));
    dispatch(setStays([]));
    dispatch(setTransfersBookings(null));
    dispatch(setItineraryStatus("itinerary_status", "PENDING"));
    dispatch(setItineraryStatus("transfers_status", "PENDING"));
    dispatch(setItineraryStatus("pricing_status", "PENDING"));
    dispatch(setItineraryStatus("hotels_status", "PENDING"));
    dispatch(setItineraryStatus("finalized_status", "PENDING"));


    setChatKey((prev) => prev + 1);
    if (window.location.pathname !== "/chat") {
      setActiveChatSessionId(undefined);
      window.history.pushState({}, "", "/chat");
    }
  };

  const handlePromptSelect = (prompt: string) => {
    // chatSendMessageRef is set by both desktop and mobile ChatKitPanel onSendReady
    const sendFn = sendMessageRef.current ?? chatSendMessageRef.current;
    if (isChatActive && sendFn) {
      sendFn(prompt);
    } else {
      setInitialPrompt(prompt);
      setIsChatActive(true);
    }
  };

  const handleSendMessage = useCallback((message: string) => {
    if (sendMessageRef.current) sendMessageRef.current(message);
  }, []);

  const handleSendReady = useCallback((sendFn: (msg: string) => void) => {
    sendMessageRef.current = sendFn;
  }, []);

  const handleToggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const sharedChatKitProps = {
    onLocationReceived: handleLocationReceived,
    onNewQuery: handleNewQuery,
    onClearMap: handleClearMap,
    onRouteReceived: handleRouteReceived,
    onItineraryReceived: handleItineraryReceived,
    onItineraryCompletionStart: handleItineraryCompletionStart,
    onItineraryCompletionDone: handleItineraryCompletionDone,
    botMode,
    sessionId: activeChatSessionId, 
    itineraryId,
    onBotModeChange: setBotMode,
    onItineraryIdChange: setItineraryId,
    onSendReady: handleSendReady,
    onLoadRouteOnMap: handleLoadRouteOnMap,
    restoredThread,
  };

  const handleConfirmItinerary = (details: any) => {
    const message = `Yes, I confirm the itinerary! Here are my details:
Start Date: ${details.startDate}
Pax: ${details.adults} Adults, ${details.children} Children, ${details.infants} Infants
Start Location: ${details.startLocation}`;
    chatSendMessageRef.current?.(message);
    setShowConfirmModal(false);
  };

  const [isHovered, setIsHovered] = useState(false);
  const popupStyle = {
    display: isHovered ? "block" : "none",
    backgroundColor: "#2b2b2a",
    border: "1px solid #e5e7eb",
    borderRadius: "0.45rem",
    padding: "5px 10px",
    marginBottom: "5px",
  };

  const handleInitialPromptConsumed = useCallback(() => {
    setInitialPrompt(null);
  }, []);

  const isDraft = useMemo(
    () =>
      activeItineraryId === "draft" ||
      activeItineraryId === "skeleton" ||
      (!activeItineraryId && viewMode === "itinerary"),
    [activeItineraryId, viewMode],
  );

  const handleItineraryContainerSendMessage = useCallback((msg: string) => {
    chatSendMessageRef.current?.(msg);
  }, []);

  const activeTab = useMemo(() => {
    if (viewMode === "bookings") return "Bookings";
    if (viewMode === "routes") return "Route";
    return "Itinerary";
  }, [viewMode]);

  // null for skeleton/draft so ItineraryContainer skips polling
  const itineraryContainerId = useMemo(() => {
    if (activeItineraryId === "skeleton" || activeItineraryId === "draft")
      return null;
    return activeItineraryId;
  }, [activeItineraryId]);

  // ── THE KEY FIX: single ItineraryContainer instance ──────────────────────
  // Rendered once here, shown in desktop OR mobile via isMobile guard in JSX.
  // This prevents every useEffect / setTimeout / API call from firing twice.
  const itineraryContainerNode = activeItineraryId ? (
    <ItineraryContainer
      key={itineraryContainerId ?? "draft"} // stable — only changes on real ID transition
      id={itineraryContainerId}
      mercuryItinerary
      fromChat={true}
      skipPolling={activeItineraryId === "skeleton" ? true : !itineraryPollingEnabled}
      onSendMessage={handleItineraryContainerSendMessage}
      activeTab={activeTab}
    />
  ) : null;

  // ── Shared itinerary panel content (header strip + container + CTA) ──────
  const itineraryPanel = (
    <div
      style={{
        display:
          viewMode === "itinerary" || viewMode === "bookings" || viewMode === "routes"
            ? "flex"
            : "none",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {/* Header strip */}
      <div className="bg-white flex flex-col px-3 py-3 border-b border-slate-100">
        <div className="flex justify-between items-start">
          <p className="font-inter font-semibold text-lg leading-tight">
            {itineraryReduxName || currentItineraryRef?.current?.name || ""}
          </p>
          {!isDraft && (
            <div className="flex gap-3 items-center">
              <button
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
                onClick={() => {
                  axios
                    .get(
                      `${MERCURY_HOST}/api/v1/itinerary/${activeItineraryId}/bookings/hotels/?fields=no_of_hotels`,
                    )
                    .then((res) => setIsHotelsPresent(res.data.no_of_hotels > 0))
                    .catch(() => setIsHotelsPresent(false))
                    .finally(() => setShowSettings(true));
                }}
              >
                <Image src="/settings.svg" height={22} width={22} alt="Settings" />
              </button>
              <button
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
                onClick={() => setShowShare(true)}
              >
                <Image src="/share.svg" height={22} width={22} alt="Share" />
              </button>
            </div>
          )}
        </div>

        {!isDraft && (
          <div className="flex flex-col gap-1.5 mt-1.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-4 flex-wrap">
                {itineraryRedux?.group_type && (
                  <div className="flex flex-col">
                    <span className="text-[10px] font-inter uppercase tracking-wide">
                      Traveller Type
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
                        <path d="M11.1133 6.75342C12.0266 7.37342 12.6666 8.21342 12.6666 9.33342V11.3334H15.3333V9.33342C15.3333 7.88008 12.9533 7.02008 11.1133 6.75342Z" fill="#ACACAC" />
                        <path d="M9.99995 6.00008C11.4733 6.00008 12.6666 4.80675 12.6666 3.33341C12.6666 1.86008 11.4733 0.666748 9.99995 0.666748C9.68661 0.666748 9.39328 0.733415 9.11328 0.826748C9.66661 1.51341 9.99995 2.38675 9.99995 3.33341C9.99995 4.28008 9.66661 5.15341 9.11328 5.84008C9.39328 5.93341 9.68661 6.00008 9.99995 6.00008Z" fill="#ACACAC" />
                        <path d="M6.00065 6.00008C7.47398 6.00008 8.66732 4.80675 8.66732 3.33341C8.66732 1.86008 7.47398 0.666748 6.00065 0.666748C4.52732 0.666748 3.33398 1.86008 3.33398 3.33341C3.33398 4.80675 4.52732 6.00008 6.00065 6.00008ZM6.00065 2.00008C6.73398 2.00008 7.33398 2.60008 7.33398 3.33341C7.33398 4.06675 6.73398 4.66675 6.00065 4.66675C5.26732 4.66675 4.66732 4.06675 4.66732 3.33341C4.66732 2.60008 5.26732 2.00008 6.00065 2.00008Z" fill="#ACACAC" />
                        <path d="M6.00033 6.66675C4.22033 6.66675 0.666992 7.56008 0.666992 9.33341V11.3334H11.3337V9.33341C11.3337 7.56008 7.78032 6.66675 6.00033 6.66675ZM10.0003 10.0001H2.00033V9.34008C2.13366 8.86008 4.20033 8.00008 6.00033 8.00008C7.80032 8.00008 9.86699 8.86008 10.0003 9.33341V10.0001Z" fill="#ACACAC" />
                      </svg>
                      <span className="text-[12px] font-inter font-medium">
                        {itineraryRedux.group_type}
                        {itineraryRedux.number_of_adults
                          ? ` (${itineraryRedux.number_of_adults} Adult${itineraryRedux.number_of_adults > 1 ? "s" : ""})`
                          : ""}
                        {itineraryRedux.number_of_children > 0
                          ? `, ${itineraryRedux.number_of_children} Child${itineraryRedux.number_of_children > 1 ? "ren" : ""}`
                          : ""}
                      </span>
                    </div>
                  </div>
                )}
                {itineraryRedux?.start_date && itineraryRedux?.end_date && (
                  <div className="flex flex-col">
                    <span className="text-[10px] font-inter uppercase tracking-wide">
                      Date of Travelling
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3.33333 14.6666C2.96667 14.6666 2.65267 14.5361 2.39133 14.2753C2.13044 14.0139 2 13.6999 2 13.3333V3.99992C2 3.63325 2.13044 3.31947 2.39133 3.05859C2.65267 2.79725 2.96667 2.66659 3.33333 2.66659H4V1.33325H5.33333V2.66659H10.6667V1.33325H12V2.66659H12.6667C13.0333 2.66659 13.3473 2.79725 13.6087 3.05859C13.8696 3.31947 14 3.63325 14 3.99992V13.3333C14 13.6999 13.8696 14.0139 13.6087 14.2753C13.3473 14.5361 13.0333 14.6666 12.6667 14.6666H3.33333ZM3.33333 13.3333H12.6667V6.66659H3.33333V13.3333ZM3.33333 5.33325H12.6667V3.99992H3.33333V5.33325ZM3.33333 5.33325V3.99992V5.33325Z" fill="#ACACAC" />
                      </svg>
                      <span className="text-[12px] font-inter font-medium">
                        {new Date(itineraryRedux.start_date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        {" – "}
                        {new Date(itineraryRedux.end_date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {itineraryRedux?.images?.length > 0 && (
                <SmallGallery
                  maxShow={Math.min(3, itineraryRedux.images.length)}
                  images={itineraryRedux.images}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeItineraryId ? (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {itineraryContainerNode}
            </div>
            <BottomCTABar
              viewMode={viewMode}
              activeItineraryId={activeItineraryId}
              showItineraryShimmer={showItineraryShimmer}
              isDraft={isDraft}
              cart={cart}
              pricingStatus={pricingStatus}
              loaderDisplayText={loaderDisplayText}
              currency={currency}
              countCartItems={countCartItems}
              isHovered={isHovered}
              setIsHovered={setIsHovered}
              popupStyle={popupStyle}
              onConfirm={() => setShowConfirmModal(true)}
              onViewCart={openPaymentDrawer}
            />
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <main
      className="flex flex-col h-screen overflow-hidden bg-slate-100 dark:bg-slate-950"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Desktop layout ── */}
      <div className="max-ph:hidden md:flex flex-1 overflow-hidden min-h-0">
        <Sidebar
          onNewChat={handleNewChat}
          onToggle={handleToggleSidebar}
          isCollapsed={sidebarCollapsed}
          onThreadSelect={handleThreadSelect}
          activeThreadId={activeThreadId}
          isComplete={activeItineraryId !== "skeleton" && activeItineraryId !== "draft" && !!activeItineraryId}
        />

        {/* LEFT PANEL */}
        <div
          className="flex flex-col overflow-hidden transition-all duration-500 ease-in-out relative bg-white"
          style={{ width: "50%", minWidth: 0 }}
        >
          <div
            className={`absolute inset-0 z-10 overflow-y-auto transition-opacity duration-500 ease-in-out pointer-events-${
              showStartScreen && leftPanelMode === "default" ? "auto" : "none"
            }`}
            style={{
              opacity: showStartScreen && leftPanelMode === "default" ? 1 : 0,
            }}
          >
            <StartScreen onPromptSelect={handlePromptSelect} />
          </div>

          <style>{`#chatContainer::-webkit-scrollbar { display: none; }`}</style>
          <div
            id="chatContainer"
            className="flex flex-col h-full bg-white border-slate-200 transition-opacity duration-500 ease-in-out"
            style={{
              opacity: hasBotResponded && leftPanelMode === "default" ? 1 : 0,
              pointerEvents: leftPanelMode === "default" ? "auto" : "none",
              overflowY: "scroll",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} hasItineraryActivity={!!activeItineraryId} />

            {/* MAP tab */}
            <div
              style={{
                display: viewMode === "map" ? "flex" : "none",
                flex: 1,
                minHeight: 0,
              }}
            >
              <MapView
                mapState={mapState}
                locations={locations}
                userLocation={userLocation}
                currentRoute={currentRoute}
                isLoadingLocation={isLoadingLocation}
                mapRef={mapRef}
                isRoutePreparing={isRoutePreparing}
              />
            </div>

            {/* ITINERARY / BOOKINGS / ROUTES — desktop only renders when !isMobile */}
            {!isMobile && itineraryPanel}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="flex flex-col overflow-hidden min-h-0 h-full relative bg-white"
          style={{ width: "50%", minWidth: 0 }}
        >
          {showChatBot ? (
            <ChatBot
              key={chatBotItineraryId}              // stable key — never remounts
              showAsPopup={false}
              itineraryId={chatBotItineraryId}
              initialBotMessage={chatBotInjectedMessageRef.current}
            />
          ) : (
            <>
              <div
                className={`absolute inset-0 z-10 bg-white ease-in-out ${
                  isChatActive
                    ? "opacity-0 pointer-events-none translate-y-2"
                    : "opacity-100 pointer-events-auto translate-y-0"
                }`}
              >
                <ChatWelcomeScreen
                  onSubmit={handlePromptSelect}
                  onChatStart={() => setIsChatActive(true)}
                />
              </div>
              <div
                className={`flex-1 overflow-hidden min-h-0 ease-in-out ${
                  isChatActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                <ChatKitPanel
                  key={`${botMode}-${itineraryId}-${chatKey}`}
                  {...sharedChatKitProps}
                  initialPrompt={initialPrompt}
                  onInitialPromptConsumed={handleInitialPromptConsumed}
                  onSendReady={handleSendMessageReady}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Mobile layout — full-screen views + top tab bar ── */}
      <div className="flex md:hidden flex-col flex-1 overflow-hidden min-h-0">
        <MobileLayout
          showStartScreen={showStartScreen}
          hasBotResponded={hasBotResponded}
          isChatActive={isChatActive}
          hasItineraryActivity={!!activeItineraryId}
          isComplete={activeItineraryId !== "skeleton" && activeItineraryId !== "draft" && !!activeItineraryId}
          showChatBot={showChatBot}
          chatBotItineraryId={chatBotItineraryId}
          chatBotInjectedMessage={chatBotInjectedMessageRef.current}
          viewMode={viewMode}
          setViewMode={setViewMode}
          mobilePanel={mobilePanel}
          setMobilePanel={setMobilePanel}
          onNewChat={handleNewChat}
          onThreadSelect={handleThreadSelect}
          activeThreadId={activeThreadId}
          onRegisterTabSwitch={handleRegisterMobileTabSwitch}
          mapContent={
            <MapView
              mapState={mapState}
              locations={locations}
              userLocation={userLocation}
              currentRoute={currentRoute}
              isLoadingLocation={isLoadingLocation}
              mapRef={mapRef}
              isRoutePreparing={isRoutePreparing}
            />
          }
          chatContent={
            showChatBot ? (
              // Once itinerary is fully done, swap ChatKitPanel for the full ChatBot experience
              <ChatBot
                key={chatBotItineraryId}
                showAsPopup={false}
                itineraryId={chatBotItineraryId}
                initialBotMessage={chatBotInjectedMessageRef.current}
                hideDrawer
              />
            ) : (
              // Render both welcome + ChatKitPanel; CSS hides/shows so panel warms up early
              <div className="relative h-full w-full">
                <div
                  className="absolute inset-0 transition-opacity duration-200"
                  style={{
                    opacity: isChatActive ? 0 : 1,
                    pointerEvents: isChatActive ? "none" : "auto",
                    zIndex: isChatActive ? 0 : 1,
                  }}
                >
                  <ChatWelcomeScreen
                    onSubmit={handlePromptSelect}
                    onChatStart={() => setIsChatActive(true)}
                  />
                </div>
                <div
                  className="absolute inset-0 transition-opacity duration-200"
                  style={{
                    opacity: isChatActive ? 1 : 0,
                    pointerEvents: isChatActive ? "auto" : "none",
                    zIndex: isChatActive ? 1 : 0,
                  }}
                >
                  <ChatKitPanel
                    key={`${botMode}-${chatKey}`}
                    {...sharedChatKitProps}
                    initialPrompt={initialPrompt}
                    onInitialPromptConsumed={handleInitialPromptConsumed}
                    onSendReady={handleSendMessageReady}
                  />
                </div>
              </div>
            )
          }
          itineraryContent={isMobile ? itineraryPanel : null}
          mobileEffectPopup={mobileEffectPopup}
          onDismissMobileEffectPopup={() => setMobileEffectPopup(null)}
          onSettingsClick={() => {
            if (!activeItineraryId) return;
            axios
              .get(`${MERCURY_HOST}/api/v1/itinerary/${activeItineraryId}/bookings/hotels/?fields=no_of_hotels`)
              .then((res) => setIsHotelsPresent(res.data.no_of_hotels > 0))
              .catch(() => setIsHotelsPresent(false))
              .finally(() => setShowSettings(true));
          }}
        />
      </div>

      <div className="max-ph:hidden flex-shrink-0 w-full">
        <TrustIndicators />
      </div>

      <ConfirmationModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        itineraryName="Your Itinerary"
        onConfirm={handleConfirmItinerary}
      />

      {showShare && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[1999] backdrop-blur-[1px]"
            onClick={() => setShowShare(false)}
          />
          <SocialShareDesktop
            social_title={itineraryRedux?.social_title}
            social_description={itineraryRedux?.social_description}
            itineraryName={itineraryReduxName}
            itineraryImage={itineraryRedux?.images?.[0]}
            share={showShare}
            setShare={setShowShare}
          />
        </>
      )}

      {showSettings && (
        <ModalWithBackdrop show={true} onHide={() => setShowSettings(false)}>
          <Settings
            setShowSettings={setShowSettings}
            isHotelsPresent={isHotelsPresent}
            handleApply={async (req) => {
              await axios.patch(
                `${MERCURY_HOST}/api/v1/itinerary/${activeItineraryId}/update/`,
                req,
              );
            }}
          />
        </ModalWithBackdrop>
      )}

      {/* Toaster notifications — portal to modal-portal div */}
      <NotificationPopup />

      {/* ── Payment — mounts NewSummaryContainers which portals its own full-screen Drawer ── */}

      {showPaymentDrawer && activeItineraryId && itineraryRedux && (
        <div key={paymentDrawerKey} style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
          <NewSummaryContainers
            payment={paymentData}
            plan={itineraryRedux}
            id={activeItineraryId}
            itinerary={itineraryRedux}
            mercuryItinerary={true}
            loadpricing={false}
            setLoadPricing={() => {}}
            getPaymentHandler={() => activeItineraryId && fetchPaymentData(activeItineraryId)}
            setShowLoginModal={() => {}}
            setShowFooterBannerMobile={() => {}}
            fetchData={() => {}}
            itineraryName={itineraryReduxName}
            itineraryImage={itineraryRedux?.images?.[0]}
            social_title={itineraryRedux?.social_title}
            social_description={itineraryRedux?.social_description}
            openPaymentDrawer={true}
          />
        </div>
      )}
    </main>
  );
}

// ── BottomCTABar — memoized, outside BotApp ──────────────────────────────────
interface BottomCTABarProps {
  viewMode: ViewMode;
  activeItineraryId: string | null;
  showItineraryShimmer: boolean;
  isDraft: boolean;
  cart: any;
  pricingStatus: string;
  loaderDisplayText: string | null;
  currency: any;
  countCartItems: number;
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
  popupStyle: React.CSSProperties;
  onConfirm: () => void;
  onViewCart: () => void;
}

const BottomCTABar = React.memo(
  ({
    viewMode,
    activeItineraryId,
    showItineraryShimmer,
    isDraft,
    cart,
    pricingStatus,
    loaderDisplayText,
    currency,
    countCartItems,
    isHovered,
    setIsHovered,
    popupStyle,
    onConfirm,
    onViewCart,
  }: BottomCTABarProps) => {
    if (!["itinerary", "bookings"].includes(viewMode) || (!activeItineraryId && !showItineraryShimmer))
      return null;

    if (isDraft) {
      return (
        <div className="z-20 fixed w-full md:w-[47.5%] max-ph:bottom-0 md:!bottom-[4.2rem] flex-shrink-0 bg-white border-t border-slate-100 px-4 py-3 flex items-center justify-center">
          <button
            onClick={onConfirm}
            className="flex items-center justify-center h-[40px] px-5 gap-2 rounded-[8px] bg-[#F7E700] font-semibold text-[14px] font-inter"
          >
            Confirm Itinerary & View Prices →
          </button>
        </div>
      );
    }

    const hasFreshPricing = cart?.discounted_cost > 0 && pricingStatus === "SUCCESS";

    if (!hasFreshPricing) {
      return (
        <div className="z-20 fixed w-full md:w-[48%] max-ph:bottom-0 md:bottom-[4.2rem] flex-shrink-0 bg-white border-t border-slate-100 px-4 py-3">
          <ItineraryStatusLoader
            displayText={loaderDisplayText || "Calculating best prices for you…"}
            isVisible={true}
          />
        </div>
      );
    }

    const perPerson = cart?.pay_only_for_one || cart?.show_per_person_cost;
    const cost = perPerson
      ? Math.round(cart?.per_person_discounted_cost)
      : Math.round(cart?.discounted_cost);
    const currencySymbol =
      currency?.currency === "USD" ? "$" : currency?.currency === "EUR" ? "€" : "₹";

    return (
      <div className="z-20 fixed w-full md:w-[48%] max-ph:bottom-0 md:bottom-[4.2rem] flex-shrink-0 bg-[#fffaf5] border-t border-slate-100 px-4 py-2 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] text-[#6E757A]">
            {perPerson
              ? "Per Person"
              : cart?.is_estimated_price && cost > 0
                ? "Estimated Price"
                : "Total Cost"}
          </span>
          <span className="font-bold text-[16px]">
            {currencySymbol} {cost?.toLocaleString("en-IN")}/-
          </span>
        </div>
        <div className="flex gap-3 items-center">
          <div
            style={popupStyle}
            className="z-50 absolute -top-11 text-sm text-center flex flex-col gap-2 bg-white"
          >
            <div className="text-nowrap font-normal text-black text-sm">
              No Hidden Charges,
              <br />
              Includes taxes
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="30"
            viewBox="0 0 23 30"
            fill="none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <path
              d="M11.3333 29.75L1.13333 22.1C0.779167 21.8403 0.501736 21.5097 0.301042 21.1083C0.100347 20.7069 0 20.2819 0 19.8333V2.83333C0 2.05417 0.277431 1.38715 0.832292 0.832292C1.38715 0.277431 2.05417 0 2.83333 0H19.8333C20.6125 0 21.2795 0.277431 21.8344 0.832292C22.3892 1.38715 22.6667 2.05417 22.6667 2.83333V19.8333C22.6667 20.2819 22.5663 20.7069 22.3656 21.1083C22.1649 21.5097 21.8875 21.8403 21.5333 22.1L11.3333 29.75ZM11.3333 26.2083L19.8333 19.8333V2.83333H2.83333V19.8333L11.3333 26.2083ZM9.84583 18.4167L17.85 10.4125L15.8667 8.35833L9.84583 14.3792L6.87083 11.4042L4.81667 13.3875L9.84583 18.4167ZM11.3333 2.83333H2.83333H19.8333H11.3333Z"
              fill="#AD5BE7"
            />
          </svg>
          <button
            onClick={onViewCart}
            className="flex items-center gap-2 h-[44px] px-4 rounded-[8px] bg-[#F7E700] text-[16px] font-inter font-semibold"
          >
            View Cart
            {countCartItems > 0 && (
              <span className="bg-[#07213A] text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {countCartItems}
              </span>
            )}
          </button>
        </div>
      </div>
    );
  },
);
BottomCTABar.displayName = "BottomCTABar";

// ── MobileLayout — full-screen views with top tab bar + mobile header ─────────
type MobileTab = "chat" | "map" | "itinerary" | "routes" | "bookings";

const CHATKIT_API_URL_MOBILE = "https://chat.tarzanway.com/chatkit";

// ── MobileHeader ──────────────────────────────────────────────────────────────
const MobileHeader = React.memo(({
  onNewChat,
  onThreadSelect,
  activeThreadId,
  isComplete,
}: {
  onNewChat: () => void;
  onThreadSelect: (id: string, sessionId?: string) => void;
  activeThreadId: string | null;
  isComplete?: boolean;
}) => {
  const userId = (useSelector as any)((s: any) => s.auth?.id);
  const token = (useSelector as any)((s: any) => s.auth?.token);
  const name = (useSelector as any)((s: any) => s.auth?.name);
  const image = (useSelector as any)((s: any) => s.auth?.image);
  const dispatch = useDispatch();

  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [threads, setThreads] = React.useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  React.useEffect(() => {
    const h = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Close login modal when token arrives
  React.useEffect(() => { if (token && showLogin) setShowLogin(false); }, [token]);

  const fetchThreads = async () => {
    if (!userId) return;
    setHistoryLoading(true);
    try {
      const res = await fetch(CHATKIT_API_URL_MOBILE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "threads.list", params: { limit: 9999, order: "desc" }, filter_user_id: String(userId), filter_bot: isComplete ? "P2" : "P1" }),
      });
      const data = await res.json();
      setThreads(data.data ?? []);
    } catch { /* ignore */ } finally {
      setHistoryLoading(false);
    }
  };

  const handleHistoryClick = () => { fetchThreads(); setHistoryOpen(true); };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("access_token");
    try { dispatch({ type: "AUTH_LOGOUT" }); } catch { /* ignore */ }
    setProfileOpen(false);
  };

  const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
  const localImg = typeof window !== "undefined" ? localStorage.getItem("user_image") : null;
  const avatarSrc =
    image && image !== "null" ? imgUrlEndPoint + image
    : localImg && localImg !== "null" ? imgUrlEndPoint + localImg
    : null;
  const initials = name ? name.trim().split(/\s+/).slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? "").join("") : "T";

  return (
    <>
      {/* Chat history slide-in drawer */}
      {historyOpen && <div className="fixed inset-0 z-[350] bg-black/20" onClick={() => setHistoryOpen(false)} />}
      <div
        className="fixed top-0 left-0 h-full z-[400] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out"
        style={{ width: "85vw", maxWidth: 320, transform: historyOpen ? "translateX(0)" : "translateX(-110%)" }}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 flex-shrink-0">
          <span className="font-semibold text-gray-800 text-[15px]">Chat History</span>
          <button onClick={() => setHistoryOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {historyLoading ? (
            <div className="flex flex-col gap-2">{[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded-lg bg-gray-100 animate-pulse" />)}</div>
          ) : threads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-3">
              <p className="text-sm text-gray-500">No chats yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {threads.map((t: any) => (
                <button
                  key={t.id}
                  onClick={() => { onThreadSelect(t.id, t.session_id ?? t.filter_session_id); setHistoryOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-[13px] truncate ${activeThreadId === t.id ? "bg-[#07213A] text-white font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                  title={t.title || "Untitled"}
                >
                  {t.title || "Untitled"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Login modal */}
      {showLogin && typeof document !== "undefined" && (
        <div className="fixed inset-0 z-[3000]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowLogin(false)} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#fff", borderRadius: 16, width: "min(480px,95vw)", maxHeight: "90vh", overflowY: "auto", zIndex: 3001, boxShadow: "0 25px 60px rgba(0,0,0,.3)" }}>
            {/* Inline placeholder — LogInModal needs the portal pattern */}
            <div className="p-6 text-center">
              <p className="font-semibold text-lg mb-2">Login / Signup</p>
              <p className="text-sm text-gray-500">Please login to continue</p>
              <button onClick={() => setShowLogin(false)} className="mt-4 px-6 py-2 rounded-xl bg-[#07213A] text-white text-sm">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 z-10">
        {/* Logo */}
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logoblack.svg" height={22} width={22} alt="logo" />
          <span className="font-semibold text-gray-800 text-sm">thetarzanway</span>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          {/* Chat history */}
          <button onClick={handleHistoryClick} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-600" aria-label="Chat history">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 21 21" fill="none">
              <path d="M10.0306 11.7021C9.57231 11.7004 9.18067 11.5357 8.85572 11.2079C8.53022 10.8806 8.36828 10.4878 8.36991 10.0295C8.37154 9.57114 8.53626 9.17923 8.86409 8.85372C9.19136 8.52877 9.58416 8.36711 10.0425 8.36874C10.5008 8.37037 10.8927 8.53482 11.2182 8.86209C11.5432 9.18991 11.7048 9.58299 11.7032 10.0413C11.7016 10.4996 11.5371 10.8913 11.2099 11.2162C10.882 11.5417 10.489 11.7037 10.0306 11.7021ZM10.0099 17.5353C8.07937 17.5285 6.40802 16.887 4.99588 15.6109C3.58374 14.3353 2.77689 12.7457 2.57532 10.8422L4.28364 10.8483C4.47295 12.2934 5.11092 13.4901 6.19756 14.4384C7.28475 15.3868 8.55751 15.8635 10.0158 15.8687C11.6408 15.8745 13.0212 15.3133 14.1568 14.1851C15.2931 13.0574 15.8641 11.6811 15.8699 10.0561C15.8756 8.43114 15.3144 7.05052 14.1862 5.91428C13.0586 4.7786 11.6823 4.20787 10.0573 4.2021C9.09897 4.19869 8.20235 4.41773 7.36744 4.85921C6.53254 5.30069 5.82898 5.90931 5.25677 6.68505L7.54843 6.6932L7.5425 8.35985L2.54254 8.34209L2.5603 3.34212L4.22696 3.34804L4.22 5.30636C4.93149 4.42 5.79865 3.73557 6.82148 3.25309C7.84376 2.77061 8.92434 2.5314 10.0632 2.53544C11.1049 2.53915 12.08 2.74039 12.9886 3.13918C13.8966 3.53852 14.6864 4.07605 15.3579 4.75177C16.0288 5.42805 16.5607 6.22161 16.9536 7.13246C17.3459 8.04386 17.5402 9.02039 17.5365 10.0621C17.5328 11.1037 17.3316 12.0786 16.9328 12.9866C16.5334 13.8952 15.9959 14.6849 15.3202 15.3559C14.6439 16.0274 13.8503 16.5595 12.9395 16.9524C12.0281 17.3447 11.0516 17.5391 10.0099 17.5353Z" fill="#07213A"/>
            </svg>
          </button>

          {/* New chat */}
          <button onClick={onNewChat} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-600" aria-label="New chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
              <path d="M8.30612 1.52887L6.80613 1.52354C3.05615 1.51021 1.55083 3.00487 1.5375 6.75485L1.52151 11.2548C1.50818 15.0048 3.00284 16.5101 6.75282 16.5234L11.2528 16.5394C15.0028 16.5528 16.5081 15.0581 16.5214 11.3081L16.5267 9.80814" stroke="#07213A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.15411 8.19642C5.92831 8.42062 5.70174 8.86231 5.6556 9.18465L5.32508 11.441C5.20217 12.2581 5.77764 12.8301 6.59554 12.7205L8.85417 12.406C9.16933 12.3622 9.61262 12.1387 9.84592 11.9146L15.7769 6.0256C16.8005 5.00923 17.2847 3.82595 15.7901 2.32063C14.2954 0.815305 13.1087 1.29109 12.0851 2.30746L6.15411 8.19642Z" stroke="#07213A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.2358 3.15234C11.732 4.94662 13.1295 6.35409 14.9277 6.87049" stroke="#07213A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Profile avatar */}
          <div ref={profileRef} className="relative ml-1">
            <button
              onClick={() => setProfileOpen(v => !v)}
              className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border-2 border-gray-200 bg-gray-100"
              aria-label="Profile"
            >
              {avatarSrc
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={avatarSrc} alt={name || "Profile"} className="w-full h-full object-cover" />
                : <span className="text-[11px] font-bold text-gray-600">{initials}</span>
              }
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-10 z-[500] bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 overflow-hidden" style={{ minWidth: 180 }}>
                {!token ? (
                  <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => { setProfileOpen(false); setShowLogin(true); }}>
                    Login / Signup
                  </button>
                ) : (
                  <>
                    <a href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">My Trips</a>
                    <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50" onClick={handleLogout}>Logout</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
});
MobileHeader.displayName = "MobileHeader";

interface MobileLayoutProps {
  showStartScreen: boolean;
  hasBotResponded: boolean;
  isChatActive: boolean;
  hasItineraryActivity: boolean;
  isComplete: boolean;
  showChatBot: boolean;
  chatBotItineraryId: string | null;
  chatBotInjectedMessage: string | null;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  mobilePanel: MobilePanel;
  setMobilePanel: (p: MobilePanel) => void;
  onNewChat: () => void;
  onThreadSelect: (id: string, sessionId?: string) => void;
  activeThreadId: string | null;
  onRegisterTabSwitch: (fn: ((tab: string) => void) | null) => void;
  mapContent: React.ReactNode;
  chatContent: React.ReactNode;
  itineraryContent: React.ReactNode;
  mobileEffectPopup?: { type: "map" | "itinerary"; label: string } | null;
  onDismissMobileEffectPopup?: () => void;
  onSettingsClick?: () => void;
}

const MobileLayout = React.memo(({
  showStartScreen,
  hasBotResponded,
  isChatActive,
  hasItineraryActivity,
  isComplete,
  showChatBot,
  chatBotItineraryId,
  chatBotInjectedMessage,
  viewMode,
  setViewMode,
  mobilePanel,
  setMobilePanel,
  onNewChat,
  onThreadSelect,
  activeThreadId,
  onRegisterTabSwitch,
  mapContent,
  chatContent,
  itineraryContent,
  mobileEffectPopup,
  onDismissMobileEffectPopup,
  onSettingsClick,
}: MobileLayoutProps) => {
  const [activeTab, setActiveTab] = React.useState<MobileTab>("chat");
  const hasUnread = (useSelector as any)((s: any) => !!s.chatState?.unreadMessages);
  const dispatchLayout = useDispatch();

  // Sync mobilePanel (legacy) so BotApp state stays consistent
  React.useEffect(() => {
    setMobilePanel(activeTab === "chat" ? "chat" : "map");
  }, [activeTab, setMobilePanel]);

  // Clear unread flag when user switches to chat tab
  React.useEffect(() => {
    if (activeTab === "chat" && hasUnread) {
      dispatchLayout(setUnreadMessages(false));
    }
  }, [activeTab, hasUnread, dispatchLayout]);

  const handleTabClick = (tab: MobileTab) => {
    setActiveTab(tab);
    if (tab === "itinerary") setViewMode("itinerary");
    else if (tab === "routes") setViewMode("routes");
    else if (tab === "bookings") setViewMode("bookings");
    else if (tab === "map") setViewMode("map");
    else if (tab === "chat") setViewMode("map");
  };

  // Register handleTabClick with BotApp so openPaymentDrawer can switch tabs on mobile
  React.useEffect(() => {
    onRegisterTabSwitch(handleTabClick as (tab: string) => void);
    return () => onRegisterTabSwitch(null as any); // clear on unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRegisterTabSwitch]);

  // Reset to chat tab when new chat is started (isChatActive goes false → true false again)
  const prevIsChatActiveRef = React.useRef(isChatActive);
  React.useEffect(() => {
    if (prevIsChatActiveRef.current && !isChatActive) {
      setActiveTab("chat");
    }
    prevIsChatActiveRef.current = isChatActive;
  }, [isChatActive]);

  // When itinerary activity starts, auto-move off the chat tab so the tab bar
  // has a highlighted entry (Chat tab no longer exists in the bar)
  const prevHasActivityRef = React.useRef(hasItineraryActivity);
  React.useEffect(() => {
    if (!prevHasActivityRef.current && hasItineraryActivity && activeTab === "chat") {
      setActiveTab("map");
    }
    prevHasActivityRef.current = hasItineraryActivity;
  }, [hasItineraryActivity, activeTab]);

  // Top tab bar — Chat + Map + Itinerary + Route + Bookings when itinerary is active
  const tabs: { key: MobileTab; label: string; show: boolean }[] = [
    { key: "map", label: "Map", show: hasItineraryActivity },
    { key: "itinerary", label: "Itinerary", show: hasItineraryActivity },
    { key: "routes", label: "Route", show: isComplete },
    { key: "bookings", label: "Bookings", show: isComplete },
  ];
  const visibleTabs = tabs.filter(t => t.show);

  const activeTabStyle: React.CSSProperties = {
    background: "#07213A",
    color: "#fff",
    borderRadius: "10px",
    border: "1px solid #FFFACD",
    boxShadow: "0 2px 8px rgba(195,195,195,0.35)",
  };
  const inactiveTabStyle: React.CSSProperties = {
    borderRadius: "10px",
    color: "#6E757A",
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">

      {/* ── Mobile header — always visible ── */}
      <MobileHeader
        onNewChat={onNewChat}
        onThreadSelect={onThreadSelect}
        activeThreadId={activeThreadId}
        isComplete={isComplete}
      />

      {/* ── Top tab bar — only when itinerary is active ── */}
      {hasItineraryActivity && visibleTabs.length > 0 && (
        <div className="flex-shrink-0 px-3 py-2 bg-white border-b border-gray-100 flex items-center gap-2">
          <div
            className="flex flex-1 gap-1 p-[3px]"
            style={{ borderRadius: "10px", border: "1px solid #E5E5E5", background: "#fff" }}
          >
            {visibleTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className="flex-1 px-2 py-1.5 text-[12px] font-medium transition-all duration-200 whitespace-nowrap"
                style={activeTab === tab.key ? activeTabStyle : inactiveTabStyle}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Settings icon — only when itinerary is fully created */}
          {isComplete && onSettingsClick && (
            <button
              onClick={onSettingsClick}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#07213A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
          )}
        </div>
      )}

      {/* ── Content area — full remaining height ── */}
      <div className="flex-1 min-h-0 overflow-hidden relative">

        {/* CHAT view */}
        <div
          className="absolute inset-0"
          style={{
            opacity: activeTab === "chat" ? 1 : 0,
            pointerEvents: activeTab === "chat" ? "auto" : "none",
            zIndex: activeTab === "chat" ? 2 : 1,
          }}
        >
          {chatContent}
        </div>

        {/* MAP view */}
        <div
          className="absolute inset-0 flex flex-col"
          style={{
            opacity: activeTab === "map" ? 1 : 0,
            pointerEvents: activeTab === "map" ? "auto" : "none",
            zIndex: activeTab === "map" ? 2 : 1,
          }}
        >
          <div className="flex-1 min-h-0 flex flex-col">
            {mapContent}
          </div>
        </div>

        {/* ITINERARY / ROUTES / BOOKINGS view */}
        {hasItineraryActivity && (
          <div
            className="absolute inset-0 overflow-y-auto"
            style={{
              opacity: ["itinerary", "routes", "bookings"].includes(activeTab) ? 1 : 0,
              pointerEvents: ["itinerary", "routes", "bookings"].includes(activeTab) ? "auto" : "none",
              zIndex: ["itinerary", "routes", "bookings"].includes(activeTab) ? 2 : 1,
            }}
          >
            {itineraryContent}
          </div>
        )}
      </div>

      {/* ── Floating Kaira icon — go back to Chat when on itinerary/routes/bookings views ── */}
      {hasItineraryActivity && ["itinerary", "routes", "bookings"].includes(activeTab) && (
        <div
          className="fixed z-[100]"
          style={{ bottom: 80, right: 16 }}
        >
          <button
            onClick={() => handleTabClick("chat")}
            className="relative w-20 h-20 rounded-full shadow-2xl overflow-hidden border-2 border-white focus:outline-none active:scale-95 transition-transform"
            aria-label="Chat with Kaira"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/KairaInsta.png" alt="Kaira" className="w-full h-full object-cover" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[#07213A]" />
          </button>
          {/* Unread message red dot */}
          {hasUnread && (
            <span
              className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white"
              style={{ zIndex: 1 }}
            />
          )}
        </div>
      )}

      {/* ── "Back to Map" popup — above message input, shown for 10s on first focus_route ── */}
      {mobileEffectPopup && activeTab === "chat" && (
        <div className="fixed z-[300] left-0 right-0 flex justify-center px-4" style={{ bottom: 72 }}>
          <button
            onClick={() => {
              handleTabClick("map");
              onDismissMobileEffectPopup?.();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#07213A] text-white text-[13px] font-semibold shadow-2xl active:scale-95 transition-transform"
            style={{ whiteSpace: "nowrap" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
            </svg>
            Back to Map
          </button>
        </div>
      )}

      {/* ── "Back to Chat" pill — always visible on map tab when itinerary active ── */}
      {hasItineraryActivity && activeTab === "map" && (
        <div className="fixed z-[300] left-0 right-0 flex justify-center px-4" style={{ bottom: 72 }}>
          <button
            onClick={() => handleTabClick("chat")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#07213A] text-white text-[13px] font-semibold shadow-xl active:scale-95 transition-transform"
            style={{ whiteSpace: "nowrap" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Back to Chat
          </button>
        </div>
      )}
    </div>
  );
});
MobileLayout.displayName = "MobileLayout";