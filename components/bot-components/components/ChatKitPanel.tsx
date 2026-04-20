import React, { useState, useRef, useEffect, useCallback } from "react";
import { useChat, generateSessionId, type UserLocationData, type MessageAttachment, Message } from "../hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { MessageInputBox } from "./MessageInputBox";
import { CHATKIT_API_DOMAIN_KEY as CHATKIT_DOMAIN_KEY } from "../lib/chatkitConfig";
import type { Location, BotMode } from "../types";
import styled from "styled-components";
import { useSelector } from "react-redux";
import LogInModal from "../../userauth/LogInModal";
import { createPortal } from "react-dom";
import ActivityDetailsDrawer from "../../drawers/activityDetails/ActivityDetailsDrawer";
import TransferEditDrawer from "../../drawers/routeTransfer/TransferEditDrawer";

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

interface ChatKitPanelProps {
  onLocationReceived: (locationData: { data: Location[] }) => void;
  onRouteReceived: (routeData: { data: Location[] }) => void;
  onNewQuery: () => void;
  onClearMap?: (data?: Record<string, unknown>) => void;
  onItineraryReceived: (itineraryData: unknown) => void;
  botMode?: BotMode;
  itineraryId?: string;
  onBotModeChange?: (mode: BotMode) => void;
  onItineraryIdChange?: (id: string) => void;
  initialPrompt?: string | null;
  initialAttachmentIds?: string[];
  onSendReady?: (sendFn: (message: string) => void) => void;
  onItineraryCompletionStart?: (itineraryId: string) => void;
onItineraryCompletionDone?: (itineraryId: string, summary?: string) => void;
onLoadRouteOnMap?: () => void;
restoredThread?: any;
onInitialPromptConsumed?: () => void;
sessionId?: string;
isItineraryCompleting?: boolean;
itineraryCompleted?: boolean;
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
  botMode = "p1",
  itineraryId = "",
  onBotModeChange,
  onItineraryIdChange,
  initialPrompt = null,
  initialAttachmentIds,
  onSendReady,
  onItineraryCompletionStart,
onItineraryCompletionDone,
  onLoadRouteOnMap,
restoredThread,
onInitialPromptConsumed,
sessionId: propSessionId,
isItineraryCompleting = false,
itineraryCompleted = false,
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
  }>({ show: false });

  // ── Pagination state ─────────────────────────────────────────────────────
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const hasMoreRef = useRef(false);
  const beforeCursorRef = useRef<string | null>(null);
  const isFetchingMoreRef = useRef(false);

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
    [onLocationReceived, onNewQuery, onClearMap, onRouteReceived, onItineraryReceived, input],
  );

  // Wire handleEffect into the ref so the stable onEffect wrapper picks it up
  handleEffectRef.current = handleEffect;

  // ── Wrap sendMessage to clear quick replies ───────────────────────────────
const sendMessage = useCallback(
  (text: string, attachmentIds?: string[], attachmentMeta?: MessageAttachment[]) => {
    setQuickReplies([]);
    lastSentMessageRef.current = text;

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
  for (const effect of itineraryEffects) {
    if (effect.name === "display_itinerary" && effect.data?.itinerary) {
      onItineraryReceived(effect.data.itinerary);
    } else if (effect.name === "display_transfers" && effect.data) {
      onItineraryReceived(effect.data);
    }
  }

  if (restored.length > 0) setMessages(restored);

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
}, [restoredThread, parseThreadItems, onRouteReceived, onLocationReceived, onItineraryReceived]);

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

  // Detect scroll near top → load more
  const handleMessagesScroll = useCallback(() => {
    const c = messagesScrollRef.current;
    if (!c) return;
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
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                entities={entities}
                onWidgetAction={(action) => {
                  const payload = action.payload ?? {};

                  // Intercept activity detail actions → open drawer
                  if (action.type === "place.view") {
                    setActivityDrawer({
                      show: true,
                      activityId: (payload.activity_id ?? payload.id) as string,
                      date: payload.date as string,
                      itinerary_city_id: (payload.itinerary_city_id ?? payload.city_id) as string,
                    });
                    return;
                  }

                  // Intercept transfer detail actions → open drawer
                  if (action.type === "transfer.select") {
                    setTransferDrawer({
                      show: true,
                      routeId: (payload.route_id ?? payload.id) as string,
                      check_in: (payload.check_in ?? payload.date) as string,
                      booking_type: (payload.booking_type ?? payload.type ?? "Taxi") as string,
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
          itinerary_city_id={activityDrawer.itinerary_city_id}
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
        />
      )}
    </div>
  );
}