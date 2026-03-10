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
import type {
  Location,
  UserLocation,
  ItineraryData,
  TransfersData,
  MapState,
  ViewMode,
  BotMode,
} from "./types";

// Mobile panel type
type MobilePanel = "map" | "chat";

export default function BotApp() {
  // Map state
  const [mapState, setMapState] = useState<MapState>({
    lat: 28.6139,
    lng: 77.2088,
    zoom: 12,
  });
  const mapRef = useRef<google.maps.Map | null>(null);
  const sendMessageRef = useRef<((msg: string) => void) | null>(null);

  // Location state
  const [locations, setLocations] = useState<Location[] | null>(null);
  const [currentRoute, setCurrentRoute] = useState<Location[] | null>(null);
  const { userLocation, isLoadingLocation } = useUserLocation(setMapState);

  // Itinerary state
  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(null);
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

  // Mobile
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("chat");

  // Ref to store initial prompt from welcome screen
  const initialPromptRef = useRef<string | null>(null);

  // Custom hook for map bounds adjustment
  useMapBounds(currentRoute, mapRef);

  // When a data event arrives, smoothly reveal the left panel
  const revealLeftPanel = useCallback(() => {
    if (!hasBotResponded) {
      setIsLeftPanelRevealing(true);
      // Small delay so CSS transition looks intentional
      requestAnimationFrame(() => {
        setTimeout(() => {
          setShowStartScreen(false);
          setHasBotResponded(true);
          setIsLeftPanelRevealing(false);
        }, 350);
      });
    }
  }, [hasBotResponded]);

  const handleRouteReceived = useCallback(
    (routeData: { data: Location[] }) => {
      revealLeftPanel();
      if (routeData.data && Array.isArray(routeData.data) && routeData.data.length > 0) {
        setViewMode("map");
        // On mobile, switch to map when we have route data
        setMobilePanel("map");
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
      if (data.shimmer) {
        setShowItineraryShimmer(true);
        setViewMode("itinerary");
        setMobilePanel("map");
      } else if (data.type === "transfers") {
        setTransfers(data.transfers);
      } else {
        setShowItineraryShimmer(false);
        setItineraryData(data);
        setViewMode("itinerary");
        setMobilePanel("map");
      }
    },
    [revealLeftPanel]
  );

  const handleLocationReceived = useCallback(
    (locationData: { data: Location[] }) => {
      revealLeftPanel();
      if (locationData.data && Array.isArray(locationData.data)) {
        setLocations(locationData.data);
        setMobilePanel("map");
      }
    },
    [revealLeftPanel]
  );

  const handleNewQuery = useCallback(() => {
    setLocations([]);
  }, []);

  const handleBotModeChange = (newMode: BotMode) => {
    setBotMode(newMode);
    setChatKey((prev) => prev + 1);
  };

  const handleNewChat = () => {
    setLocations([]);
    setCurrentRoute(null);
    setItineraryData(null);
    setTransfers(null);
    setShowItineraryShimmer(false);
    setViewMode("map");
    setShowStartScreen(true);
    setHasBotResponded(false);
    setIsChatActive(false);
    setMobilePanel("chat");
    initialPromptRef.current = null;
    setChatKey((prev) => prev + 1);
  };

  const handlePromptSelect = (prompt: string) => {
    if (isChatActive && sendMessageRef.current) {
      // Chat is already open — send directly into it
      sendMessageRef.current(prompt);
    } else {
      initialPromptRef.current = prompt;
      setIsChatActive(true);
    }
  };

  // This function will be passed to ItineraryView to send messages to chat
  const handleSendMessage = useCallback((message: string) => {
    console.log("BotApp: Received message from itinerary:", message);
    if (sendMessageRef.current) {
      console.log("BotApp: Sending message to chat...");
      sendMessageRef.current(message);
    } else {
      console.log("BotApp: Chat send function not ready yet");
      // Optionally store the message to send later
    }
  }, []);

  // Handler for when chat panel is ready with send function
  const handleSendReady = useCallback((sendFn: (msg: string) => void) => {
    console.log("BotApp: Chat send function received and stored");
    sendMessageRef.current = sendFn;
  }, []);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleChatHistory = () => {
    console.log("Chat history clicked");
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
          onChatHistory={handleChatHistory}
          onToggle={handleToggleSidebar}
          isCollapsed={sidebarCollapsed}
        />

        {/* LEFT PANEL — map / start screen */}
        <div
          className="flex flex-col overflow-hidden transition-all duration-500 ease-in-out relative"
          style={{ width: "50%", minWidth: 0 }}
        >
          {/* Start screen — fades out when left panel reveals */}
          <div
            className={`absolute inset-0 z-10 transition-opacity duration-500 ease-in-out pointer-events-${
              showStartScreen ? "auto" : "none"
            }`}
            style={{ opacity: showStartScreen ? 1 : 0 }}
          >
            <StartScreen onPromptSelect={handlePromptSelect} />
          </div>

          {/* Map/Itinerary — fades in when bot has responded */}

          <style>
    {`
      #chatContainer::-webkit-scrollbar {
        display: none;
      }
    `}
  </style>
          <div
            id="chatContainer"
            className="flex flex-col h-full bg-white  border-slate-200 transition-opacity duration-500 ease-in-out"
            style={{
      opacity: hasBotResponded ? 1 : 0,
      overflowY: "scroll",
      scrollbarWidth: "none",   // Firefox
      msOverflowStyle: "none",  // IE/Edge
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
              />
            ) : (
              <ItineraryView
                itineraryData={itineraryData}
                transfers={transfers}
                showShimmer={showItineraryShimmer}
                onSendMessage={handleSendMessage} // ✅ ADD THIS FOR DESKTOP
              />
            )}
          </div>
        </div>

        {/* RIGHT PANEL — chat */}
        <div
          className="flex flex-col overflow-hidden min-h-0 h-full relative"
          style={{ width: "50%", minWidth: 0 }}
        >
          {/* Welcome screen — slides/fades out when chat becomes active */}
          <div
            className={`absolute inset-0 z-10 bg-white  ease-in-out ${
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

          {/* Chat panel — always mounted but invisible until chat is active */}
          <div
            className={`flex-1 overflow-hidden min-h-0  ease-in-out ${
              isChatActive
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            <ChatKitPanel
              key={`${botMode}-${itineraryId}-${chatKey}`}
              onLocationReceived={handleLocationReceived}
              onNewQuery={handleNewQuery}
              onRouteReceived={handleRouteReceived}
              onItineraryReceived={handleItineraryReceived}
              botMode={botMode}
              itineraryId={itineraryId}
              onBotModeChange={setBotMode}
              onItineraryIdChange={setItineraryId}
              initialPrompt={initialPromptRef.current}
              onSendReady={handleSendReady} 
            />
          </div>
        </div>
      </div>

      {/* ── Mobile layout ── */}
      <div className="flex md:hidden flex-col flex-1 overflow-hidden min-h-0">
        {/* Mobile panel content */}
        <div className="flex-1 overflow-hidden min-h-0 relative">
          {/* MAP PANEL */}
          <div
            className={`absolute inset-0 transition-all duration-400 ease-in-out ${
              mobilePanel === "map"
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 -translate-x-4 pointer-events-none"
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
                  />
                ) : (
                  <ItineraryView
                    itineraryData={itineraryData}
                    transfers={transfers}
                    showShimmer={showItineraryShimmer}
                    onSendMessage={handleSendMessage} // ✅ THIS WAS ALREADY HERE - GOOD!
                  />
                )}
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
                key={`${botMode}-${itineraryId}-${chatKey}`}
                onLocationReceived={handleLocationReceived}
                onNewQuery={handleNewQuery}
                onRouteReceived={handleRouteReceived}
                onItineraryReceived={handleItineraryReceived}
                botMode={botMode}
                itineraryId={itineraryId}
                onBotModeChange={setBotMode}
                onItineraryIdChange={setItineraryId}
                initialPrompt={initialPromptRef.current}
                onSendReady={handleSendReady} // ✅ ADD THIS FOR MOBILE TOO
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
                mobilePanel === "map"
                  ? "text-amber-500"
                  : "text-slate-400"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                <line x1="9" y1="3" x2="9" y2="18"/>
                <line x1="15" y1="6" x2="15" y2="21"/>
              </svg>
              <span className="text-[10px] font-medium">Map</span>
              {mobilePanel === "map" && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-500" />
              )}
            </button>

            <button
              onClick={() => setMobilePanel("chat")}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-200 ${
                mobilePanel === "chat"
                  ? "text-amber-500"
                  : "text-slate-400"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span className="text-[10px] font-medium">Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full-width footer */}
      <div className="max-ph:hidden flex-shrink-0 w-full">
        <TrustIndicators />
      </div>
    </main>
  );
}