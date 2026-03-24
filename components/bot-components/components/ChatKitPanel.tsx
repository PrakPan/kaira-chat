import React, { useState, useRef, useEffect, useCallback } from "react";
import { useChat, generateSessionId, type UserLocationData, Message } from "../hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { MessageInputBox } from "./MessageInputBox";
import { CHATKIT_API_DOMAIN_KEY as CHATKIT_DOMAIN_KEY } from "../lib/chatkitConfig";
import type { Location, BotMode } from "../types";
import styled from "styled-components";
import { useSelector } from "react-redux";
import LogInModal from "../../userauth/LogInModal";
import { createPortal } from "react-dom";

const CHATKIT_API_URL = "https://chat.tarzanway.com/chatkit";

const LoginButton = styled.button`
  width: 131px;
  height: 40px;
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
  border-radius: 50px;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  font-family: Montserrat;
  font-weight: 500;
  font-size: 12px;
  background: #fff;
  color: #1889ed;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  &:hover {
    background: #f0f7ff;
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
  onItineraryCompletionStart?: (itineraryId: string) => void;
onItineraryCompletionDone?: (itineraryId: string) => void;
onLoadRouteOnMap?: () => void;
restoredThread?: any;
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
  onItineraryCompletionStart,
onItineraryCompletionDone,
  onLoadRouteOnMap,
restoredThread,
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

  // ── Refs ─────────────────────────────────────────────────────────────────
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasProcessedInitial = useRef(false);
  const hasUpdatedUrl = useRef(false);
  const postLoginFiredRef = useRef(false);

  /**
   * Frontend-generated UUID for this chat session.
   * Created once when the component mounts (useRef keeps it stable across
   * re-renders without triggering additional renders).
   * Sent as session_id in every API request.
   * Also used as the URL segment: /chat/{sessionId}
   */
 const sessionIdRef = useRef((() => {
  const urlPath = window.location.pathname;
  const stored = sessionStorage.getItem(`chatkit_session_${urlPath}`);
  if (stored) return stored;
  const newId = generateSessionId();
  sessionStorage.setItem(`chatkit_session_${urlPath}`, newId);
  return newId;
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

  // ── Auth ─────────────────────────────────────────────────────────────────
  const reduxToken = useSelector((state: any) => state.auth.token);
  const reduxUserId = useSelector((state: any) => state.auth.id);
  const authToken = reduxToken ?? getAuthToken();
  const isLoggedIn = !!authToken;

  // ── Location ─────────────────────────────────────────────────────────────
  const { userLocationData, isLoadingLocation } = useUserLocationData();
  const locationReady = !isLoadingLocation;
  const [entities, setEntities] = useState<Record<string, { name: string; type: string }>>({});


  // ── Session created ───────────────────────────────────────────────────────
  // Called by useChat after the first API response confirms the thread.
  // We use our own UUID (not the API thread_id) for the URL.
const handleSessionCreated = useCallback((ourSessionId: string) => {
  if (hasUpdatedUrl.current) return;
  hasUpdatedUrl.current = true;
  window.history.pushState({}, "", `/chat/${ourSessionId}`);
  // Persist so a page reload at /chat/{id} reuses this session
  sessionStorage.setItem(`chatkit_session_/chat/${ourSessionId}`, ourSessionId);
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

  // ── handleEffect (defined after useChat — safe, no hook-order issue) ──────
  const handleEffect = useCallback(
    ({ name, data }: { name: string; data: Record<string, unknown> }) => {
      console.log("[Effect triggered]", name, data);
      switch (name) {
        case "clear_map": {
          onNewQuery();
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
          onItineraryReceived(data.itinerary);
          break;
        }
        case "display_transfers": {
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
          setPendingMessage(input);
          setShowLoginPrompt(true);
          break;
        }
        case "display_pois_on_map": {
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
  console.log("[itinerary_completion_process_completed] id:", completedId);
  if (completedId) {
    onItineraryCompletionDone?.(completedId);
  }
  break;
}

case "start_itinerary_completion_process": {
  onItineraryCompletionStart?.("pending");
  break;
}
case "shimmer_day_by_day": {
  onItineraryReceived({ shimmer: true });
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
    [onLocationReceived, onNewQuery, onRouteReceived, onItineraryReceived, input],
  );

  // Wire handleEffect into the ref so the stable onEffect wrapper picks it up
  handleEffectRef.current = handleEffect;

  // ── Wrap sendMessage to clear quick replies ───────────────────────────────
 const sendMessage = useCallback(
  (text: string) => {
    setQuickReplies([]);

    // Only pass userLocation on the first message, then clear it
    if (isFirstMessageRef.current) {
      isFirstMessageRef.current = false;
      rawSendMessage(text, userLocationData ?? undefined);
    } else {
      rawSendMessage(text); // no location
    }
  },
  [rawSendMessage, userLocationData],
);

  // ── Side-effects ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!error) setErrorDismissed(false);
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
  if (!isLoggedIn) {
    postLoginFiredRef.current = false;
    setPostLoginLoading(false); // ← clear stuck loading on logout too
    return;
  }

  if (postLoginFiredRef.current) return;
  postLoginFiredRef.current = true;

  setShowLoginModal(false);
  setShowLoginPrompt(false);
  setPostLoginLoading(false); // ← always clear loading first

  if (pendingMessage) {
    const msg = pendingMessage;
    setPendingMessage(null);
    sendMessage(msg.trim()); // ← no setTimeout, no separate loading toggle
  }
}, [isLoggedIn, pendingMessage, sendMessage]);

  useEffect(() => {
    setLocalItineraryId(itineraryId);
  }, [itineraryId]);

  useEffect(() => {
  if (!restoredThread || !setMessages) return;

  const restored: Message[] = [];

  for (const item of restoredThread.items?.data ?? []) {
    if (item.type === "user_message") {
      const text = item.content?.find((c: any) => c.type === "input_text")?.text ?? "";
      if (text) restored.push({
        id: item.id, role: "user", content: text,
        timestamp: new Date(item.created_at),
      });
    } else if (item.type === "assistant_message") {
      const text = item.content?.find((c: any) => c.type === "output_text")?.text ?? "";
      if (text) restored.push({
        id: item.id, role: "assistant", content: text,
        timestamp: new Date(item.created_at), isStreaming: false,
      });
    } else if (item.type === "widget") {
      restored.push({
        id: item.id, role: "assistant", content: "",
        timestamp: new Date(item.created_at),
        type: "widget", widgetItem: { id: item.id, widget: item.widget },
      });
    }
  }

    const itineraryEffects: any[] = restoredThread.itinerary_effects ?? [];
  
  for (const effect of itineraryEffects) {
    if (effect.name === "itinerary_entities" && effect.data?.entities) {
      setEntities(prev => ({ ...prev, ...effect.data.entities }));
    }
  }

  if (restored.length > 0) setMessages(restored);

  // Restore thread_id so subsequent messages work
  if (restoredThread.id) threadIdRef.current = restoredThread.id;

  // Restore quick replies from itinerary_effects
  const qrEffect = restoredThread.itinerary_effects?.find(
    (e: any) => e.name === "load_quick_replies"
  );
  if (qrEffect?.data?.quick_replies) {
    setQuickReplies(qrEffect.data.quick_replies.map((r: string) => ({ label: r })));
  }
}, [restoredThread]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleShowLogin = useCallback(() => {
    if (input.trim()) setPendingMessage(input.trim());
    setShowLoginModal(true);
  }, [input]);

  const handleSubmit = useCallback(() => {
    setShowLoginPrompt(false);
    if (!input.trim() || isStreaming) return;
    setErrorDismissed(true);
    sendMessage(input.trim());
    setInput("");
  }, [input, isStreaming, sendMessage]);

  const handleQuickReply = useCallback(
    (reply: QuickReply) => {
      if (isStreaming) return;
      sendMessage(reply.value ?? reply.label);
    },
    [isStreaming, sendMessage],
  );

  const showError = !!error && !errorDismissed;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className={`flex flex-col h-full min-h-0 bg-white max-h-[94vh]`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Top bar ───────────────────────────────────────────────────────── */}
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
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 scroll-smooth">
        {messages.length === 0 ? (
          <WelcomeState />
        ) : (
          <div className="max-w-2xl mx-auto">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                entities={entities}
                onWidgetAction={(action) => {
                  sendWidgetAction(action.type, action.payload ?? {});
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
              <div className="mt-[24px]">
                <LoginButton onClick={handleShowLogin}>Login/Signup</LoginButton>
              </div>
            )}

            {postLoginLoading && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                <Spinner size={14} />
                <span>Sending your message…</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Quick reply chips ─────────────────────────────────────────────── */}
      {quickReplies.length > 0 && !isStreaming && (
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
                  disabled={isStreaming}
                >
                  {reply.label}
                </SingleChips>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Composer ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-6 pt-3 pb-4 bg-white">
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
    </div>
  );
}