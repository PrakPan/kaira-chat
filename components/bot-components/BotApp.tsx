import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
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
import ConfirmationModal from "./components/ConfirmationModal";
import { useSelector } from "react-redux";
import setCart from "../../store/actions/Cart";

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
        slab_elements: (day.slab_elements ?? []).map((el: any, idx: number) => ({
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
        })),
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
  const [mapState, setMapState] = useState<MapState>({ lat: 28.6139, lng: 77.2088, zoom: 12 });
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

  const [showStartScreen, setShowStartScreen] = useState(true);
  const [hasBotResponded, setHasBotResponded] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [isLeftPanelRevealing, setIsLeftPanelRevealing] = useState(false);

  const [leftPanelMode, setLeftPanelMode] = useState<LeftPanelMode>("default");
  const [completingItineraryId, setCompletingItineraryId] = useState<string | null>(null);
  const [loaderDisplayText, setLoaderDisplayText] = useState<string | null>(null);
  const [isRoutePreparing, setIsRoutePreparing] = useState(false);

  const [fullscreenItineraryId, setFullscreenItineraryId] = useState<string | null>(null);
  const [showFullscreenShimmer, setShowFullscreenShimmer] = useState(false);

  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("chat");
  const [activeItineraryId, setActiveItineraryId] = useState<string | null>(null);
  const [itineraryPollingEnabled, setItineraryPollingEnabled] = useState(false);
  const initialPromptRef = useRef<string | null>(null);
  const [showChatBot, setShowChatBot] = useState(false);

  const [restoredThread, setRestoredThread] = useState<any>(null);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const currentItineraryRef = useRef<any>(null);
  const [skeletonCities, setSkeletonCities] = useState<any[]>([]);
  const skeletonCitiesRef = useRef<any[]>([]);
  const chatSendMessageRef = useRef<((msg: string) => void) | null>(null);
  // Add this state near the top of BotApp
const [showConfirmModal, setShowConfirmModal] = useState(false);
const cart = useSelector((state: any) => state.Cart);
const payment = useSelector((state: any) => state.Itinerary); // payment comes via cart
const pricingStatus = useSelector((state: any) => state.ItineraryStatus?.pricing_status);
const currency = useSelector((state: any) => state.currency);
const [showPaymentDrawer, setShowPaymentDrawer] = useState(false);
const itineraryReduxName = useSelector((state: any) => state.Itinerary?.name);



  // ── Track whether initial restore has run ────────────────────────────────
  const hasRestoredRef = useRef(false);
  // ── Track whether user has manually selected a thread ────────────────────
  const userSelectedThreadRef = useRef(false);
  const chatBotInjectedMessageRef = useRef<string | null>(null);

  const handleSendMessageReady = useCallback((sendFn: (msg: string) => void) => {
    chatSendMessageRef.current = sendFn;
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

  const countCartItems = useMemo(() => {
  if (!cart?.summary) return 0;
  return Object.values(cart.summary).reduce((sum: number, item: any) => sum + (item.count ?? 0), 0);
}, [cart?.summary]);

  useMapBounds(currentRoute, mapRef);

  const handleItineraryCompletionStart = useCallback((_id?: string) => {
 
  dispatch(setCart({}));
  dispatch(setStays([]));
  dispatch(setTransfersBookings(null));
  currentItineraryRef.current = null; 

  if (skeletonCitiesRef.current.length > 0) {
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
            day: d + 1, date: null, day_summary: "", slab_id: null, slab_elements: [],
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
}, [dispatch, skeletonCities]);

 const handleItineraryCompletionDone = useCallback((id: string, summary?: string) => {
  if (!id || id === "undefined") return;
  try {
    setShowItineraryShimmer(false);
    dispatch(setCart({}));
    dispatch(setItineraryIdAction(id));
  //    if (skeletonCitiesRef.current.length > 0) {
  //   const citiesToUse = skeletonCitiesRef.current.length > 0
  //       ? skeletonCitiesRef.current
  //       : [{ name: "Loading…", duration: 3 }];

  //     const skeletonItinerary = {
  //       name: "Building your itinerary…",
  //       start_date: null,
  //       end_date: null,
  //       cities: citiesToUse.map((c, i) => ({
  //         id: `skeleton-city-${i}`,
  //         city: { id: null, name: c.name, latitude: null, longitude: null, gmaps_place_id: null, image: [], car_free_city: false },
  //         start_date: null,
  //         end_date: null,
  //         duration: c.duration,
  //         day_by_day: Array.from({ length: c.duration }, (_, d) => ({
  //           day: d + 1, date: null, day_summary: "", slab_id: null, slab_elements: [],
  //         })),
  //         hotels: [],
  //         activities: [],
  //         transfers: { sightseeing: [], airport: [] },
  //       })),
  //       version: "v2",
  //       celery: { ITINERARY: "PENDING", HOTELS: "PENDING", TRANSFERS: "SUCCESS", PRICING: "PENDING", display_text: null, notes: [] },
  //       status: "Draft",
  //     };
  //   dispatch(setItinerary(skeletonItinerary));
  //   dispatch(setItineraryDaybyDay(skeletonItinerary));
  //   dispatch(setBreif(skeletonItinerary));
  // }
    dispatch(setItineraryStatus("itinerary_status", "PENDING"));
    dispatch(setItineraryStatus("transfers_status", "PENDING"));
    dispatch(setItineraryStatus("pricing_status", "PENDING"));
    dispatch(setItineraryStatus("hotels_status", "PENDING"));
    dispatch(setItineraryStatus("finalized_status", "PENDING"));
    // setSkeletonCities([]);
    setActiveItineraryId(id);
    setItineraryPollingEnabled(true);
    setShowChatBot(true);
    setHasBotResponded(true);
    setShowStartScreen(false);
    setViewMode("itinerary");
    if (summary) {
      chatBotInjectedMessageRef.current = summary;
    }
  } catch (e) {
    console.error("handleItineraryCompletionDone error:", e);
  }
}, [dispatch]);

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

  const handleRouteReceived = useCallback((routeData: { data: Location[] }) => {
    setIsRoutePreparing(false);
    revealLeftPanel();
    if (routeData.data && Array.isArray(routeData.data) && routeData.data.length > 0) {
      setViewMode("map");
      setMobilePanel("map");
      const cities = routeData.data.map((loc: any) => ({ name: loc.name, duration: loc.duration ?? 1 }));
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
  }, [revealLeftPanel]);

  const handleItineraryReceived = useCallback((data: any) => {
    revealLeftPanel();

    if (data?.shimmer) {
      dispatch(setItineraryStatus("itinerary_status", "PENDING"));
      dispatch(setItineraryStatus("transfers_status", "SUCCESS"));
      setViewMode("itinerary");
      setMobilePanel("map");
      setShowStartScreen(false);
      setHasBotResponded(true);

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
            day: d + 1, date: null, day_summary: "", slab_id: null, slab_elements: [],
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
        const bookingType = leg.toLowerCase().includes("flight") ? "Flight"
          : leg.toLowerCase().includes("train") ? "Train" : "Taxi";
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

    const hasHotels = transformed.cities?.some((c: any) => c.hotels?.length > 0 && c.hotels[0]?.name);
    dispatch(setItineraryStatus("hotels_status", hasHotels ? "SUCCESS" : "PENDING"));
    dispatch(setItineraryStatus("transfers_status", "PENDING"));
    dispatch(setItineraryStatus("pricing_status", "PENDING"));
    dispatch(setItineraryStatus("finalized_status", "PENDING"));

    setActiveItineraryId("draft");
    setItineraryPollingEnabled(false);
    setViewMode("itinerary");
    setMobilePanel("map");
  }, [revealLeftPanel, dispatch]);

  const handleLocationReceived = useCallback((locationData: { data: Location[] }) => {
    revealLeftPanel();
    if (locationData.data && Array.isArray(locationData.data)) {
      setLocations(locationData.data);
      setMobilePanel("map");
    }
  }, [revealLeftPanel]);

  const handleNewQuery = useCallback(() => {
    setLocations([]);
  }, []);

  const handleBotModeChange = (newMode: BotMode) => {
    setBotMode(newMode);
    setChatKey((prev) => prev + 1);
  };

  const loadThread = useCallback(async (threadId: string) => {
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
  }, [
    handleRouteReceived,
    handleLocationReceived,
    handleItineraryReceived,
    handleItineraryCompletionStart,
    handleItineraryCompletionDone,
  ]);

  // ── Only restore latest thread on initial mount, not on every threadId change ──
  useEffect(() => {
    if (!sessionId) return;
    if (hasRestoredRef.current) return;
    // Don't restore if user already clicked a thread before this effect ran
    if (userSelectedThreadRef.current) return;
    hasRestoredRef.current = true;
    restoreLatestThread(sessionId);
  }, [sessionId]);

const handleThreadSelect = useCallback(async (threadId: string) => {
  userSelectedThreadRef.current = true;

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
  currentItineraryRef.current = null; // ← clear stale name
  
  dispatch(setItinerary({}));
  dispatch(setCart({}));              // ← clear stale cart
  dispatch(setStays([]));
  dispatch(setTransfersBookings(null));
  dispatch(setItineraryStatus("itinerary_status", "PENDING"));
  dispatch(setItineraryStatus("transfers_status", "PENDING"));
  dispatch(setItineraryStatus("hotels_status", "PENDING"));
  dispatch(setItineraryStatus("pricing_status", "PENDING"));
  dispatch(setItineraryStatus("finalized_status", "PENDING"));

  setChatKey((prev) => prev + 1);
  await loadThread(threadId);
}, [loadThread, dispatch]);

const handleNewChat = () => {
  initialPromptRef.current = null;
  userSelectedThreadRef.current = false;
  hasRestoredRef.current = false;
  setInitialPrompt(null);
  setLocations([]);
  setCurrentRoute(null);
  setItineraryData(null);
  setTransfers(null);
  setViewMode("map");          // ← force back to map so no stale itinerary view
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
  setRestoredThread(null);
  setActiveThreadId(null);
  setSkeletonCities([]);
  skeletonCitiesRef.current = [];
  currentItineraryRef.current = null; // ← clear stale itinerary name

  dispatch(setItinerary({}));
  dispatch(setCart({}));              // ← clear stale cart/pricing
  dispatch(setStays([]));
  dispatch(setTransfersBookings(null));
  dispatch(setItineraryStatus("itinerary_status", "PENDING"));
  dispatch(setItineraryStatus("transfers_status", "PENDING"));
  dispatch(setItineraryStatus("pricing_status", "PENDING"));
  dispatch(setItineraryStatus("hotels_status", "PENDING"));
  dispatch(setItineraryStatus("finalized_status", "PENDING"));

  setChatKey((prev) => prev + 1);
  if (window.location.pathname !== "/chat") {
    window.history.pushState({}, "", "/chat");
  }
};

const handlePromptSelect = (prompt: string) => {
  if (isChatActive && sendMessageRef.current) {
    sendMessageRef.current(prompt);
  } else {
    setInitialPrompt(prompt);   
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

  const handleConfirmItinerary = (details) => {
  const message = `Yes confirm the itinerary. Here are my details:
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

const isDraft = activeItineraryId === "draft" || activeItineraryId === "skeleton" || (!activeItineraryId && viewMode === "itinerary");

const BottomCTABar = () => {
  if (viewMode !== "itinerary" || (!activeItineraryId && !showItineraryShimmer)) return null;

  // Draft state — real itinerary not created yet
  if (isDraft) {
    return (
      <div className="z-20 fixed w-[47.5%] bottom-[4.2rem] flex-shrink-0 bg-white border-t border-slate-100 px-4 py-3 flex items-center justify-center">
        <button
          onClick={() => setShowConfirmModal(true)}
          className="flex items-center justify-center h-[40px] px-5 gap-2 rounded-[8px] bg-[#F7E700] font-semibold text-[14px] font-inter"
        >
          Confirm Itinerary & View Prices →
        </button>
      </div>
    );
  }

  // Real itinerary — pricing not ready yet (also covers the cart-cleared state)
  const hasFreshPricing = cart?.discounted_cost > 0 && pricingStatus === "SUCCESS";

  if (!hasFreshPricing) {
    return (
      <div className="z-20 fixed w-[48%] bottom-[4.2rem] flex-shrink-0 bg-white border-t border-slate-100 px-4 py-3">
        <ItineraryStatusLoader
          displayText={loaderDisplayText || "Calculating best prices for you…"}
          isVisible={true}
        />
      </div>
    );
  }

  // Pricing ready — show cart
  const perPerson = cart?.pay_only_for_one || cart?.show_per_person_cost;
  const cost = perPerson
    ? Math.round(cart?.per_person_discounted_cost)
    : Math.round(cart?.discounted_cost);
  const currencySymbol = currency?.currency === "USD" ? "$"
    : currency?.currency === "EUR" ? "€"
    : "₹";

  return (
    <div className="z-20 fixed w-[48%] bottom-[4.2rem] flex-shrink-0 bg-[#fffaf5] border-t border-slate-100 px-4 py-2 flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-[11px] text-[#6E757A]">
          {perPerson ? "Per Person" : cart?.is_estimated_price && cost > 0 ? "Estimated Price" : "Total Cost"}
        </span>
        <span className="font-bold text-[16px]">
          {currencySymbol} {cost?.toLocaleString("en-IN")}/-
        </span>
      </div>
      <div className="flex gap-3 items-center">
        <div style={popupStyle} className="z-50 absolute -top-11 text-sm text-center flex flex-col gap-2 bg-white">
          <div className="relative">
            <div className="text-nowrap font-normal text-black text-sm">
              No Hidden Charges,<br />Includes taxes
            </div>
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
                          className="cursor-pointer min-w-max text-lg w-4 h-4 pl-3 transition-transform duration-300 ase-in-out  group-hover:text-blue-500  group-hover:scale-110 active:scale-90 relative"
                          // onMouseEnter={() => setIsHovered(true)}
                          // onMouseLeave={() => setIsHovered(false)}
                        />
                      </svg>
        <button
          onClick={() => setShowPaymentDrawer(true)}
          className="flex items-center gap-2 h-[40px] px-3.5 rounded-[8px] bg-[#F7E700] text-[14px] font-inter"
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
};


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
        />

        {/* LEFT PANEL */}
        <div
          className="flex flex-col overflow-hidden transition-all duration-500 ease-in-out relative"
          style={{ width: "50%", minWidth: 0 }}
        >
          <div
            className={`absolute inset-0 z-10 transition-opacity duration-500 ease-in-out pointer-events-${
              showStartScreen && leftPanelMode === "default" ? "auto" : "none"
            }`}
            style={{ opacity: showStartScreen && leftPanelMode === "default" ? 1 : 0 }}
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
              <>
              <div className="bg-white h-18 flex justify-between px-3 font-inter font-semibold text-lg">
                <p>{itineraryReduxName || currentItineraryRef?.current?.name || ""}</p>

               { !(currentItineraryRef?.current?.status == "Draft") && <div className="flex gap-3 items-center">
         <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M1.33333 10.6667H2.28333L8.8 4.15L7.85 3.2L1.33333 9.71667V10.6667ZM0 12V9.16667L8.8 0.383333C8.93333 0.261111 9.08056 0.166667 9.24167 0.1C9.40278 0.0333333 9.57222 0 9.75 0C9.92778 0 10.1 0.0333333 10.2667 0.1C10.4333 0.166667 10.5778 0.266667 10.7 0.4L11.6167 1.33333C11.75 1.45556 11.8472 1.6 11.9083 1.76667C11.9694 1.93333 12 2.1 12 2.26667C12 2.44444 11.9694 2.61389 11.9083 2.775C11.8472 2.93611 11.75 3.08333 11.6167 3.21667L2.83333 12H0ZM8.31667 3.68333L7.85 3.2L8.8 4.15L8.31667 3.68333Z" fill="#1D1B20"/>
</svg>

<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M4.5 16.5C4.0875 16.5 3.73437 16.3531 3.44062 16.0594C3.14687 15.7656 3 15.4125 3 15V7.5C3 7.0875 3.14687 6.73438 3.44062 6.44063C3.73437 6.14688 4.0875 6 4.5 6H6.75V7.5H4.5V15H13.5V7.5H11.25V6H13.5C13.9125 6 14.2656 6.14688 14.5594 6.44063C14.8531 6.73438 15 7.0875 15 7.5V15C15 15.4125 14.8531 15.7656 14.5594 16.0594C14.2656 16.3531 13.9125 16.5 13.5 16.5H4.5ZM8.25 12V3.61875L7.05 4.81875L6 3.75L9 0.75L12 3.75L10.95 4.81875L9.75 3.61875V12H8.25Z" fill="#1F1F1F"/>
</svg>
</div>}
              </div>
              <div
                className="h-full overflow-y-auto bg-[#fafafa]"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                
                {activeItineraryId ? (
  <div className="flex flex-col h-full overflow-hidden">
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <ItineraryContainer
        id={activeItineraryId === "skeleton" || activeItineraryId === "draft" ? null : activeItineraryId}
        mercuryItinerary
        fromChat={true}
        skipPolling={!itineraryPollingEnabled}
        onSendMessage={(msg) => chatSendMessageRef.current?.(msg)}
      />
    </div>

    {/* Bottom CTA bar */}
   <BottomCTABar />
  </div>
) : null}
              </div>
              </>
            ) : null}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="flex flex-col overflow-hidden min-h-0 h-full relative bg-white"
          style={{ width: "50%", minWidth: 0 }}
        >
          {showChatBot ? (
            <ChatBot showAsPopup={false} itineraryId={activeItineraryId} initialBotMessage={chatBotInjectedMessageRef.current} />
          ) : (
            <>
              <div
                className={`absolute inset-0 z-10 bg-white ease-in-out ${
                  isChatActive ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100 pointer-events-auto translate-y-0"
                }`}
              >
                <ChatWelcomeScreen
                  onSubmit={handlePromptSelect}
                  onChatStart={() => setIsChatActive(true)}
                />
              </div>

              <div
                className={`flex-1 overflow-hidden min-h-0 ease-in-out ${
                  isChatActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
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

      {/* ── Mobile layout ── */}
      <div className="flex md:hidden flex-col flex-1 overflow-hidden min-h-0">
        <div className="flex-1 overflow-hidden min-h-0 relative">
          <div
            className={`absolute inset-0 transition-all duration-400 ease-in-out ${
              mobilePanel === "map" ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-4 pointer-events-none"
            }`}
          >
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
  <div className="flex flex-col h-full overflow-hidden">
    <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <ItineraryContainer
        id={activeItineraryId === "skeleton" || activeItineraryId === "draft" ? null : activeItineraryId}
        mercuryItinerary
        fromChat={true}
        skipPolling={!itineraryPollingEnabled}
        onSendMessage={(msg) => chatSendMessageRef.current?.(msg)}
      />
    </div>

    {/* Bottom CTA bar */}
   <BottomCTABar />
  </div>
) : null}
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div
            className={`absolute inset-0 transition-all duration-400 ease-in-out ${
              mobilePanel === "chat" ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-4 pointer-events-none"
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
                initialPrompt={initialPrompt} 
                 onInitialPromptConsumed={handleInitialPromptConsumed}
                onSendReady={handleSendMessageReady}
              />
            )}
          </div>
        </div>

        <div className="flex-shrink-0 bg-white border-t border-slate-200 safe-area-pb">
          <div className="flex items-center justify-around px-4 py-2">
            <button
              onClick={() => setMobilePanel("map")}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-200 ${
                mobilePanel === "map" ? "text-amber-500" : "text-slate-400"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="text-[10px] font-medium">Chat</span>
            </button>
          </div>
        </div>
      </div>

      {(
        <div className="max-ph:hidden flex-shrink-0 w-full">
          <TrustIndicators />
        </div>
      )}

      <ConfirmationModal
  show={showConfirmModal}
  onHide={() => setShowConfirmModal(false)}
  itineraryName="Your Itinerary"
  onConfirm={handleConfirmItinerary}
/>
    </main>
  );
}