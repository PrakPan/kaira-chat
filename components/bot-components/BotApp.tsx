import React, { useState, useCallback, useEffect, useRef } from "react";
import { ChatKitPanel } from "./components/ChatKitPanel";
import MapView from "./components/MapView";
import ItineraryView from "./components/ItineraryView";
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
  UserLocation,
  ItineraryData,
  TransfersData,
  MapState,
  ViewMode,
  BotMode,
} from "./types";
import ItineraryShimmer from "./components/ItineraryShimmer";
import { useDispatch } from "react-redux";
import setItineraryIdAction from "../../store/actions/itineraryId";
import setItineraryStatus from "../../store/actions/itineraryStatus";
import axioslocationsinstance from "../../services/search/search";
import setItineraryDaybyDay from "../../store/actions/itineraryDaybyDay";
import setItinerary from "../../store/actions/itinerary";
import setBreif from "../../store/actions/breif";
import { setTransfersBookings } from "../../store/actions/transferBookingsStore";
import { setStays } from "../../store/actions/StayBookings";
import ChatBot from "../Chatbot/Index";

// Mobile panel type
type MobilePanel = "map" | "chat";

// Left panel display mode
type LeftPanelMode = "default" | "itinerary-loading" | "itinerary-ready";

// CSS to hide sticky bottom bar and chatbot FAB when ItineraryContainer
// is embedded inside the chat left panel (Option B — no prop drilling)
// const EMBEDDED_ITINERARY_HIDE_CSS = `
//   .embedded-itinerary-panel .desktop-view-cart-fixed {
//     display: none !important;
//   }
//   .embedded-itinerary-panel .chatbot-fab {
//     display: none !important;
//   }
//   .embedded-itinerary-panel .react-toastify,
//   .embedded-itinerary-panel .Toastify {
//     display: none !important;
//   }
// `;

// Put this outside the component
function transformDraftToItinerary(draft: any) {
  const routes = draft?.routes ?? [];

  const cities = routes.map((route: any) => {
    const cityName = route.city?.name ?? "unknown";
    // Give each city a stable draft ID based on its name if no real ID exists
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
      // Hotels: assign itinerary_city_id so stays filter correctly per city
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

export default function BotApp() {
  // Map state
  const [mapState, setMapState] = useState<MapState>({
    lat: 28.6139,
    lng: 77.2088,
    zoom: 12,
  });
  const mapRef = useRef<google.maps.Map | null>(null);
  const sendMessageRef = useRef<((msg: string) => void) | null>(null);
  const dispatch = useDispatch();

  // Location state
  const [locations, setLocations] = useState<Location[] | null>(null);
  const [currentRoute, setCurrentRoute] = useState<Location[] | null>(null);
  const { userLocation, isLoadingLocation } = useUserLocation(setMapState);

  // Itinerary state
  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(
    null,
  );
  const [transfers, setTransfers] = useState<TransfersData | null>(null);
  const [showItineraryShimmer, setShowItineraryShimmer] = useState(false);

  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [botMode, setBotMode] = useState<BotMode>("p1");
  const [itineraryId, setItineraryId] = useState("");
  const [chatKey, setChatKey] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const [showStartScreen, setShowStartScreen] = useState(true);
  const [hasBotResponded, setHasBotResponded] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [isLeftPanelRevealing, setIsLeftPanelRevealing] = useState(false);

  // ── Itinerary completion state ────────────────────────────────────────────
  const [leftPanelMode, setLeftPanelMode] = useState<LeftPanelMode>("default");
  const [completingItineraryId, setCompletingItineraryId] = useState<
    string | null
  >(null);
  const [loaderDisplayText, setLoaderDisplayText] = useState<string | null>(
    null,
  );
  const [isRoutePreparing, setIsRoutePreparing] = useState(false);

  const [fullscreenItineraryId, setFullscreenItineraryId] = useState<
    string | null
  >(null);
  const [showFullscreenShimmer, setShowFullscreenShimmer] = useState(false);

  // Mobile
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("chat");
  const [activeItineraryId, setActiveItineraryId] = useState<string | null>(
    null,
  );
  const [itineraryPollingEnabled, setItineraryPollingEnabled] = useState(false);
  // Ref to store initial prompt from welcome screen
  const initialPromptRef = useRef<string | null>(null);
  const [showChatBot, setShowChatBot] = useState(false);

  const [restoredThread, setRestoredThread] = useState<any>(null);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const currentItineraryRef = useRef<any>(null);
  const [skeletonCities, setSkeletonCities] = useState<any[]>([]);
  const skeletonCitiesRef = useRef<any[]>([]);

  useEffect(() => {
    const match = window.location.pathname.match(/\/chat\/([a-f0-9-]+)/);
    if (!match) return;
    restoreLatestThread(match[1]);
  }, []);

  const restoreLatestThread = async (sessionId: string) => {
    try {
      const listRes = await fetch("https://chat.tarzanway.com/chatkit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "threads.list",
          params: { limit: 9999, order: "desc" },
          filter_session_id: sessionId,
        }),
      });
      const listData = await listRes.json();
      const threads = listData.data ?? [];
      if (threads.length === 0) return;
      await loadThread(threads[0].id);
    } catch (err) {
      console.error("Failed to restore session:", err);
    }
  };

  // Custom hook for map bounds adjustment
  useMapBounds(currentRoute, mapRef);

 const handleItineraryCompletionStart = useCallback((_id?: string) => {
  // Build skeleton from route cities so we show names + shimmer immediately
  if (skeletonCitiesRef.current.length > 0) {
    const skeletonItinerary = {
      name: "Building your itinerary…",
      start_date: null,
      end_date: null,
      cities: skeletonCities.map((c, i) => ({
        id: `skeleton-city-${i}`,
        city: { id: null, name: c.name, latitude: null, longitude: null, gmaps_place_id: null, image: [], car_free_city: false },
        start_date: null,
        end_date: null,
        duration: c.duration,
        day_by_day: Array.from({ length: c.duration }, (_, d) => ({
          day: d + 1,
          date: null,
          day_summary: "",
          slab_id: null,
          slab_elements: [],  // empty = shimmer renders skeleton rows
        })),
        hotels: [],
        activities: [],
        transfers: { sightseeing: [], airport: [] },
      })),
      version: "v2",
      celery: { ITINERARY: "PENDING", HOTELS: "PENDING", TRANSFERS: "PENDING", PRICING: "PENDING", display_text: null, notes: [] },
      status: "Draft",
    };
    dispatch(setItinerary(skeletonItinerary));
    dispatch(setItineraryDaybyDay(skeletonItinerary));
    dispatch(setBreif(skeletonItinerary));
  }

  dispatch(setItineraryStatus("itinerary_status", "PENDING"));
  dispatch(setItineraryStatus("transfers_status", "PENDING"));
  dispatch(setItineraryStatus("pricing_status", "PENDING"));
  dispatch(setItineraryStatus("hotels_status", "PENDING"));
  dispatch(setItineraryStatus("finalized_status", "PENDING"));
  setShowItineraryShimmer(false);  // ensure no full-screen shimmer overlay
  setActiveItineraryId("skeleton"); // mount ItineraryContainer with skeleton
  setShowStartScreen(false);
  setHasBotResponded(true);
  setMobilePanel("map");
  setViewMode("itinerary");
}, [dispatch, skeletonCities]);

  // In handleItineraryCompletionDone — hide shimmer, mount container:
const handleItineraryCompletionDone = useCallback((id: string) => {
  if (!id || id === "undefined") return;
  try {
    setShowItineraryShimmer(false);
    dispatch(setItineraryIdAction(id));
    // Reset statuses to PENDING so polling flow works correctly
    dispatch(setItineraryStatus("itinerary_status", "PENDING"));
    dispatch(setItineraryStatus("transfers_status", "PENDING"));
    dispatch(setItineraryStatus("pricing_status", "PENDING"));
    dispatch(setItineraryStatus("hotels_status", "PENDING"));
    dispatch(setItineraryStatus("finalized_status", "PENDING"));
    // DO NOT clear itinerary/stays/transfers — skeleton stays visible until
    // real polling data overwrites it, preventing the blank intermediate flash
    setSkeletonCities([]);
    setActiveItineraryId(id);
    setItineraryPollingEnabled(true);
    setShowChatBot(true);
    setHasBotResponded(true);
    setShowStartScreen(false);
    setViewMode("itinerary");
  } catch(e) {
    console.error("handleItineraryCompletionDone error:", e);
  }
}, [dispatch]);

  // When a data event arrives, smoothly reveal the left panel
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
  [revealLeftPanel]
);

  const handleItineraryReceived = useCallback(
    (data: any) => {
      revealLeftPanel();

   // In handleItineraryReceived, replace the shimmer block:
if (data?.shimmer) {
  dispatch(setItineraryStatus("itinerary_status", "PENDING"));
  dispatch(setItineraryStatus("transfers_status", "SUCCESS")); // no transfer loader for draft
  setViewMode("itinerary");
  setMobilePanel("map");
  setShowStartScreen(false);
  setHasBotResponded(true);

  // Build skeleton from skeletonCities if available, else use a 1-city placeholder
  const citiesToUse = skeletonCitiesRef.current.length > 0
  ? skeletonCitiesRef.current
  : [{ name: "Loading…", duration: 3 }];

  const skeletonItinerary = {
    name: "Building your itinerary…",
    start_date: null,
    end_date: null,
    cities: citiesToUse.map((c, i) => ({
      id: `skeleton-city-${i}`,
      city: { id: null, name: c.name, latitude: null, longitude: null, gmaps_place_id: null, image: [], car_free_city: false },
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
    celery: { ITINERARY: "PENDING", HOTELS: "PENDING", TRANSFERS: "SUCCESS", PRICING: "PENDING", display_text: null, notes: [] },
    status: "Draft",
  };

  dispatch(setItinerary(skeletonItinerary));
  dispatch(setItineraryDaybyDay(skeletonItinerary));
  dispatch(setBreif(skeletonItinerary));

  if (activeItineraryId !== "skeleton" && activeItineraryId !== "draft") {
    setActiveItineraryId("skeleton");
    setItineraryPollingEnabled(false);
  }
  return;
}

      // Handle display_transfers
      // REPLACE the entire display_transfers block with:

if (data?.transfers && !data?.itinerary && !data?.routes) {
  const intercity: Record<string, any> = {};

  (data.transfers ?? []).forEach((t: any, idx: number) => {
    // Use canonical draft-city-{name} IDs — consistent with transformDraftToItinerary
    // after the || fix. nameToId lookup kept as enhancement but || fallback is reliable.
    const nameToId: Record<string, string> = {};
    for (const c of currentItineraryRef.current?.cities ?? []) {
      if (c.city?.name && c.id) nameToId[c.city.name] = String(c.id);
    }

    const fromId = nameToId[t.from_city] || `draft-city-${t.from_city}`;
    const toId = nameToId[t.to_city] || `draft-city-${t.to_city}`;
    const key = `${fromId}:${toId}`;

    // Determine booking type from legs
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

      // display_itinerary — real data arrived, hide shimmer
      setShowItineraryShimmer(false); // ← THIS WAS MISSING

      const draft = data?.itinerary ?? data;
      const transformed = transformDraftToItinerary(draft);
      currentItineraryRef.current = transformed;

      // Build stays
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
      dispatch(
        setItineraryStatus("hotels_status", hasHotels ? "SUCCESS" : "PENDING"),
      );
      dispatch(setItineraryStatus("transfers_status", "PENDING"));
      dispatch(setItineraryStatus("pricing_status", "PENDING"));
      dispatch(setItineraryStatus("finalized_status", "PENDING"));

      setActiveItineraryId("draft");
      setItineraryPollingEnabled(false);
      setViewMode("itinerary");
      setMobilePanel("map");
    },
    [revealLeftPanel, dispatch],
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

  const handleBotModeChange = (newMode: BotMode) => {
    setBotMode(newMode);
    setChatKey((prev) => prev + 1);
  };

  const loadThread = useCallback(
    async (threadId: string) => {
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
        setRestoredThread(data);
        setActiveThreadId(threadId);
        setIsChatActive(true);

        (data.map_effects ?? []).forEach((effect: any) => {
          if (effect.name === "focus_route" && effect.data) {
            handleRouteReceived({ data: effect.data });
            setHasBotResponded(true);
            setShowStartScreen(false);
          } else if (effect.name === "focus_on_map" && effect.data) {
            handleLocationReceived({ data: effect.data });
            setHasBotResponded(true);
            setShowStartScreen(false);
          } else if (effect.name === "display_pois_on_map" && effect.data) {
            handleLocationReceived({ data: effect.data });
            setHasBotResponded(true);
            setShowStartScreen(false);
          }
        });

        const itineraryEffects: any[] = data.itinerary_effects ?? [];
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
              if (completedId) handleItineraryCompletionDone(completedId);
              break;
            }
            default:
              break;
          }
        }
      } catch (err) {
        console.error("Failed to load thread:", err);
      }
    },
    [
      handleRouteReceived,
      handleLocationReceived,
      handleItineraryReceived,
      handleItineraryCompletionStart,
      handleItineraryCompletionDone,
    ],
  );

  // handleThreadSelect now depends on the stable loadThread
const handleThreadSelect = useCallback(async (threadId: string) => {
  setLocations([]);
  setCurrentRoute(null);
  setSkeletonCities([]);
  setActiveItineraryId(null);
  setItineraryPollingEnabled(false);
  setShowItineraryShimmer(false);
  setViewMode("map");
  setHasBotResponded(false);
  setShowStartScreen(false);
  setIsChatActive(true);
  currentItineraryRef.current = null;
  dispatch(setItinerary({}));
  dispatch(setStays([]));
  dispatch(setTransfersBookings(null));
  dispatch(setItineraryStatus("itinerary_status", "PENDING"));
  dispatch(setItineraryStatus("transfers_status", "PENDING"));
  dispatch(setItineraryStatus("hotels_status", "PENDING"));
  dispatch(setItineraryStatus("pricing_status", "PENDING"));
  dispatch(setItineraryStatus("finalized_status", "PENDING"));
  // ← DO NOT call setChatKey here — that remounts ChatKitPanel and causes double drawer
  await loadThread(threadId);
}, [loadThread, dispatch]);

  const handleNewChat = () => {
    initialPromptRef.current = null;

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

    dispatch(setItinerary({}));
    dispatch(setItineraryStatus("itinerary_status", "PENDING"));
    dispatch(setItineraryStatus("transfers_status", "PENDING"));
    dispatch(setItineraryStatus("pricing_status", "PENDING"));
    dispatch(setItineraryStatus("hotels_status", "PENDING"));
    dispatch(setItineraryStatus("finalized_status", "PENDING"));
    dispatch(setStays([]));
    dispatch(setTransfersBookings(null));

    setChatKey((prev) => prev + 1); // last, after prompt cleared
    window.location.href = "/chat";
  };

  const handlePromptSelect = (prompt: string) => {
    if (isChatActive && sendMessageRef.current) {
      sendMessageRef.current(prompt);
    } else {
      initialPromptRef.current = prompt;
      setIsChatActive(true);
    }
  };

  const handleSendMessage = useCallback((message: string) => {
    if (sendMessageRef.current) {
      sendMessageRef.current(message);
    }
  }, []);

  const handleSendReady = useCallback((sendFn: (msg: string) => void) => {
    sendMessageRef.current = sendFn;
  }, []);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleChatHistory = () => {
    console.log("Chat history clicked");
  };

  // ── Shared ChatKitPanel props (used in both desktop + mobile instances) ───
  const sharedChatKitProps = {
    onLocationReceived: handleLocationReceived,
    onNewQuery: handleNewQuery,
    onRouteReceived: handleRouteReceived,
    onItineraryReceived: handleItineraryReceived,
    onItineraryCompletionStart: handleItineraryCompletionStart,
    onItineraryCompletionDone: handleItineraryCompletionDone,
    botMode,
    itineraryId,
    onBotModeChange: setBotMode,
    onItineraryIdChange: setItineraryId,
    onSendReady: handleSendReady,
    onLoadRouteOnMap: handleLoadRouteOnMap,
    restoredThread,
  };

  // ── Left panel content renderer (shared between desktop + mobile) ─────────
  // Returns the appropriate content based on leftPanelMode
  const renderLeftPanelContent = (isMobile = false) => {
    // 1. Itinerary fully ready — show embedded ItineraryContainer (left side only)
    if (leftPanelMode === "itinerary-ready" && completingItineraryId) {
      return (
        <>
          {/* <style>{EMBEDDED_ITINERARY_HIDE_CSS}</style> */}
          <div
            className="embedded-itinerary-panel h-full overflow-y-auto bg-white"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`
              .embedded-itinerary-panel::-webkit-scrollbar { display: none; }
            `}</style>
            <ItineraryContainer
              id={completingItineraryId}
              mercuryItinerary
              skipPolling={true}
              fromChat={true}
            />
          </div>
        </>
      );
    }

    // 2. Itinerary building — show status loader centered
    if (leftPanelMode === "itinerary-loading") {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-white gap-4">
          <ItineraryStatusLoader
            displayText={loaderDisplayText}
            isVisible={true}
          />
        </div>
      );
    }

    // 3. Default — show start screen + map/itinerary view
    return null; // handled by existing markup below
  };

  return (
    <main
      className="flex flex-col h-screen overflow-hidden bg-slate-100 dark:bg-slate-950"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Desktop layout ── */}
      <div className="max-ph:hidden md:flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar */}
        <Sidebar
          onNewChat={handleNewChat}
          onToggle={handleToggleSidebar}
          isCollapsed={sidebarCollapsed}
          onThreadSelect={handleThreadSelect}
          activeThreadId={activeThreadId}
        />

        {/* LEFT PANEL */}
        <div
          className="flex flex-col overflow-hidden transition-all duration-500 ease-in-out relative"
          style={{ width: "50%", minWidth: 0 }}
        >

          {/* ── Layer: Start screen — fades out when left panel reveals ── */}
          <div
            className={`absolute inset-0 z-10 transition-opacity duration-500 ease-in-out pointer-events-${
              showStartScreen && leftPanelMode === "default" ? "auto" : "none"
            }`}
            style={{
              opacity: showStartScreen && leftPanelMode === "default" ? 1 : 0,
            }}
          >
            <StartScreen onPromptSelect={handlePromptSelect} />
          </div>

          {/* ── Layer: Map/Itinerary — fades in when bot has responded ── */}
          <style>{`
            #chatContainer::-webkit-scrollbar { display: none; }
          `}</style>
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
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            {viewMode === "map" ? (
              <MapView
                mapState={mapState}
                locations={locations}
                userLocation={userLocation}
                currentRoute={currentRoute}
                isLoadingLocation={isLoadingLocation}
                mapRef={mapRef}
                isRoutePreparing={isRoutePreparing}
              />
            ) : viewMode === "itinerary" ? (
              <div
                className="h-full overflow-y-auto bg-white"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
               {activeItineraryId ? (
      <ItineraryContainer
        id={activeItineraryId === "skeleton" || activeItineraryId === "draft"
          ? null   // no API fetch for skeleton/draft
          : activeItineraryId}
        mercuryItinerary
        fromChat={true}
        skipPolling={!itineraryPollingEnabled}
      />
    ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="flex flex-col overflow-hidden min-h-0 h-full relative bg-white"
          style={{ width: "50%", minWidth: 0 }}
        >
          {showChatBot ? (
            // After completion — show ChatBot directly, no welcome screen needed
            <ChatBot
              showAsPopup={false}
              itineraryId={activeItineraryId} // ← pass real ID
            />
          ) : (
            <>
              {/* Welcome screen */}
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

              {/* Chat panel */}
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
                  initialPrompt={initialPromptRef.current}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Mobile layout ── */}
      <div className="flex md:hidden flex-col flex-1 overflow-hidden min-h-0">
        <div className="flex-1 overflow-hidden min-h-0 relative">
          {/* MAP PANEL */}
          <div
            className={`absolute inset-0 transition-all duration-400 ease-in-out ${
              mobilePanel === "map"
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 -translate-x-4 pointer-events-none"
            }`}
          >
            {/* itinerary-ready or itinerary-loading take priority */}
            {showStartScreen && !hasBotResponded ? (
              <StartScreen onPromptSelect={handlePromptSelect} />
            ) : (
              <div className="flex flex-col h-full bg-white">
                <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                {viewMode === "map" ? (
                  <MapView
                    mapState={mapState}
                    locations={locations}
                    userLocation={userLocation}
                    currentRoute={currentRoute}
                    isLoadingLocation={isLoadingLocation}
                    mapRef={mapRef}
                    isRoutePreparing={isRoutePreparing}
                  />
                ) : viewMode === "itinerary" ? (
                  <div
                    className="h-full overflow-y-auto bg-white"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {activeItineraryId ? (
      <ItineraryContainer
        id={activeItineraryId === "skeleton" || activeItineraryId === "draft"
          ? null   // no API fetch for skeleton/draft
          : activeItineraryId}
        mercuryItinerary
        fromChat={true}
        skipPolling={!itineraryPollingEnabled}
      />
    ) : null}
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* CHAT PANEL */}
          <div
            className={`absolute inset-0 transition-all duration-400 ease-in-out ${
              mobilePanel === "chat"
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 translate-x-4 pointer-events-none"
            }`}
          >
            {!isChatActive ? (
              <ChatWelcomeScreen
                onSubmit={handlePromptSelect}
                onChatStart={() => setIsChatActive(true)}
              />
            ) : (
              <ChatKitPanel
                key={`${botMode}-${chatKey}`}
                {...sharedChatKitProps}
                initialPrompt={initialPromptRef.current}
              />
            )}
          </div>
        </div>

        {/* Mobile bottom tab bar */}
        <div className="flex-shrink-0 bg-white border-t border-slate-200 safe-area-pb">
          <div className="flex items-center justify-around px-4 py-2">
            <button
              onClick={() => setMobilePanel("map")}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-200 ${
                mobilePanel === "map" ? "text-amber-500" : "text-slate-400"
              }`}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
              <span className="text-[10px] font-medium">Map</span>
              {mobilePanel === "map" && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-500" />
              )}
            </button>

            <button
              onClick={() => setMobilePanel("chat")}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-200 ${
                mobilePanel === "chat" ? "text-amber-500" : "text-slate-400"
              }`}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="text-[10px] font-medium">Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full-width footer */}
      {!activeItineraryId ? (
        <div className="max-ph:hidden flex-shrink-0 w-full">
          <TrustIndicators />
        </div>
      ) : null}
    </main>
  );
}
