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
  BotMode 
} from "./types";

export default function BotApp() {
  // Map state
  const [mapState, setMapState] = useState<MapState>({
    lat: 28.6139,
    lng: 77.2088,
    zoom: 12,
  });
  const mapRef = useRef<google.maps.Map | null>(null);

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
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // New state for showing start screen
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [hasBotResponded, setHasBotResponded] = useState(false);
  
  // Ref to store initial prompt from welcome screen
  const initialPromptRef = useRef<string | null>(null);

  // Custom hook for map bounds adjustment
  useMapBounds(currentRoute, mapRef);

  // Handlers
  const handleRouteReceived = useCallback((routeData: { data: Location[] }) => {
    setHasBotResponded(true);
    setShowStartScreen(false);

    if (routeData.data && Array.isArray(routeData.data) && routeData.data.length > 0) {
      setViewMode("map");
    }
    
    if (routeData.data && Array.isArray(routeData.data)) {
      setCurrentRoute(routeData.data);
      setLocations((prev) => {
        const newLocations = [...(prev || [])];
        routeData.data.forEach((location) => {
          const exists = newLocations.some((loc) => loc.id === location.id);
          if (!exists) {
            newLocations.push(location);
          }
        });
        return newLocations;
      });
    }
  }, []);

  const handleItineraryReceived = useCallback((data: any) => {
    setHasBotResponded(true);
    setShowStartScreen(false);
    
    if (data.shimmer) {
      setShowItineraryShimmer(true);
      setViewMode("itinerary");
    } else if (data.type === "transfers") {
      setTransfers(data.transfers);
    } else {
      setShowItineraryShimmer(false);
      setItineraryData(data);
      setViewMode("itinerary");
    }
  }, []);

  const handleLocationReceived = useCallback(
    (locationData: { data: Location[] }) => {
      setHasBotResponded(true);
      setShowStartScreen(false);
      
      if (locationData.data && Array.isArray(locationData.data)) {
        setLocations(locationData.data);
      }
    },
    []
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
    initialPromptRef.current = null;
    setChatKey((prev) => prev + 1);
  };

  const handlePromptSelect = (prompt: string) => {
    initialPromptRef.current = prompt;
    setShowStartScreen(false);
    setHasBotResponded(false);
  };

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
      {/* Top area: Sidebar + Left panel + Right panel */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar */}
        <Sidebar
          onNewChat={handleNewChat}
          onChatHistory={handleChatHistory}
          onToggle={handleToggleSidebar}
          isCollapsed={sidebarCollapsed}
        />

        {/* LEFT PANEL — 50% of remaining space */}
        <div
          className="flex flex-col overflow-hidden transition-all duration-500 ease-in-out"
          style={{ width: "50%", minWidth: 0 }}
        >
          {showStartScreen && !hasBotResponded ? (
            <div className="flex-1 overflow-hidden">
              <StartScreen onPromptSelect={handlePromptSelect} />
            </div>
          ) : (
            <div className="flex flex-col h-full bg-white border-r border-slate-200">
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
                />
              )}
            </div>
          )}
        </div>

        {/* RIGHT PANEL — 50% of remaining space */}
        <div
  className="flex flex-col overflow-hidden min-h-0 h-full"
  style={{ width: "50%", minWidth: 0 }}
>
          {showStartScreen && !hasBotResponded ? (
            <div className="flex-1 overflow-hidden bg-white">
              <ChatWelcomeScreen
                onSubmit={handlePromptSelect}
                onChatStart={() => setShowStartScreen(false)}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-hidden min-h-0">
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
              />
            </div>
          )}
        </div>
      </div>

      {/* Full-width footer — TrustIndicators spans the entire page width */}
      <div className="flex-shrink-0 w-full">
        <TrustIndicators />
      </div>
    </main>
  );
}