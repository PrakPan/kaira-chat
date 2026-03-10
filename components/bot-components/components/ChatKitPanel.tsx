import React, { useState, useRef, useEffect, useCallback } from "react";
import { useChat, type UserLocationData } from "../hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { MessageInputBox } from "./MessageInputBox";
import { CHATKIT_API_DOMAIN_KEY as CHATKIT_DOMAIN_KEY } from "../lib/chatkitConfig";
import type { Location, BotMode } from "../types";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { authShowLogin } from "../../../store/actions/auth";

const CHATKIT_API_URL = "https://chat.tarzanway.com/chatkit";

const LoginButton = styled.button`
  background: #f7e700;
  padding: 10px 16px;
  width: 131px;
  height: 40px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

interface ChatKitPanelProps {
  onLocationReceived: (locationData: { data: Location[] }) => void;
  onRouteReceived: (routeData: { data: Location[] }) => void;
  onNewQuery: () => void;
  onItineraryReceived: (itineraryData: unknown) => void;
  botMode?: BotMode;
  itineraryId?: string;
  onBotModeChange?: (mode: BotMode) => void;
  onItineraryIdChange?: (id: string) => void;
  initialPrompt?: string | null;
  onSendReady?: (sendFn: (message: string) => void) => void;
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

/** Read the auth token from localStorage — adjust the key to match your app */
function getAuthToken(): string | null {
  // Try common key names; adjust to match whatever your app stores
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
  onRouteReceived,
  onItineraryReceived,
  botMode = "p1",
  itineraryId = "",
  onBotModeChange,
  onItineraryIdChange,
  initialPrompt = null,
  onSendReady,
}: ChatKitPanelProps) {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("high");
  const [localItineraryId, setLocalItineraryId] = useState(itineraryId);
  const [showControls, setShowControls] = useState(false);

  // FIX 1: Track whether the current error has been dismissed by a new query
  const [errorDismissed, setErrorDismissed] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasProcessedInitial = useRef(false);

  const { userLocationData, isLoadingLocation } = useUserLocationData();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const dispatch = useDispatch();

  const handleShowLogin = useCallback(() => {
    dispatch(authShowLogin());
  }, [dispatch]);

  const handleEffect = useCallback(
    ({ name, data }: { name: string; data: Record<string, unknown> }) => {
      console.log("[Effect triggered]", name, data);
      switch (name) {
        case "clear_map":
          onNewQuery();
          break;
        case "focus_on_map":
          onNewQuery();
          if (data.data) onLocationReceived(data as { data: Location[] });
          break;
        case "focus_route":
          if (data.data) onRouteReceived(data as { data: Location[] });
          break;
        case "display_itinerary":
          onItineraryReceived(data.itinerary);
          break;
        case "display_transfers":
          onItineraryReceived({ transfers: data.transfers, type: "transfers" });
          break;
        case "route.lock":
        case "route.edit":
        case "route.remove":
        case "route.reorder.start":
        case "itinerary.lock":
          sendWidgetAction(name, data);
          break;
        case "load_itinerary":
          if (data.redirect_url && typeof data.redirect_url === "string") {
            window.location.href = data.redirect_url;
          }
          break;
        case "prompt_login": {
          console.log("Prompting login due to effect:", name);
          setShowLoginPrompt(true);
          break;
        }
        default:
          console.warn("[Effect] unhandled:", name);
      }
    },
    [onLocationReceived, onNewQuery, onRouteReceived, onItineraryReceived],
  );

  const locationReady = !isLoadingLocation;
  const apiUrl =
    botMode === "p2"
      ? "https://chat.tarzanway.com/chatkit/p2"
      : CHATKIT_API_URL;

  // FIX 2: Read token from localStorage and pass it to useChat
  const authToken = getAuthToken();

  const {
    messages,
    isStreaming,
    error,
    sendMessage,
    sendWidgetAction,
    clearMessages,
    cancelStream,
  } = useChat({
    apiUrl,
    domainKey: CHATKIT_DOMAIN_KEY,
    model: selectedModel,
    userLocation: userLocationData,
    locationReady,
    botMode,
    itineraryId: localItineraryId,
    onEffect: handleEffect,
    // Pass token so useChat can add it to request headers
    authToken: authToken ?? undefined,
  });

  // FIX 1: When error clears (new response comes in), un-dismiss so future errors show
  useEffect(() => {
    if (!error) {
      setErrorDismissed(false);
    }
  }, [error]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (initialPrompt && !hasProcessedInitial.current && locationReady) {
      hasProcessedInitial.current = true;
      sendMessage(initialPrompt);
    }
  }, [initialPrompt, locationReady, sendMessage]);

  useEffect(() => {
    onSendReady?.(sendMessage);
  }, [onSendReady, sendMessage]);

  useEffect(() => {
    setLocalItineraryId(itineraryId);
  }, [itineraryId]);

  const handleSubmit = useCallback(() => {
    setShowLoginPrompt(false);
    if (!input.trim() || isStreaming) return;

    // FIX 1: Dismiss any previous error so it doesn't block the new response view
    setErrorDismissed(true);

    sendMessage(input.trim());
    setInput("");
  }, [input, isStreaming, sendMessage]);

  // Whether to show the error banner
  const showError = !!error && !errorDismissed;

  return (
    <div
      className="flex flex-col h-full min-h-0 bg-white max-h-[94vh]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Top bar ───────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 bg-white/80 backdrop-blur-sm mt-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center">
            <img src="/assets/chatbot/chatbot-avaatar.svg" alt="Kaira" />
          </div>
          <span className="text-sm font-semibold text-gray-800">Kaira</span>
          {isLoadingLocation && (
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <Spinner size={10} /> locating…
            </span>
          )}
        </div>

        <button
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
        </button>
      </div>

      {/* ── Settings panel ──────────────────────────────── */}
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

      {/* ── Messages ───────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 scroll-smooth">
        {messages.length === 0 ? (
          <WelcomeState />
        ) : (
          <div className="max-w-2xl mx-auto">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onWidgetAction={(action) => {
                  sendWidgetAction(action.type, action.payload ?? {});
                }}
              />
            ))}

            {/* FIX 1: Only show error when not dismissed by a new query */}
            {showError && (
              <div className="mt-2 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 flex-shrink-0"
                >
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

            {/* FIX 2 & 3: Login prompt — dispatch correctly opens the Redux-driven modal */}
            {showLoginPrompt && (
              <div>
                <LoginButton onClick={handleShowLogin} className="mt-[24px]">
                  Login/Signup
                </LoginButton>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Composer — pinned at bottom ──────────────── */}
      <div className="flex-shrink-0 px-6 pt-4 pb-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <MessageInputBox
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            onStop={cancelStream}
            isStreaming={isStreaming}
            placeholder="Ask me anything"
            showAttach={true}
          />
        </div>
      </div>
    </div>
  );
}
