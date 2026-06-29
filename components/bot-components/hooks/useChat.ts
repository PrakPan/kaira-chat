import { useState, useRef, useCallback } from "react";
import { getAdParams } from "../../../helper/adAttribution";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProgressStep {
  text: string;
  done: boolean;
}

export interface ThinkingTask {
  content: string;
  done: boolean;
}

export interface MessageAttachment {
  id: string;
  name?: string;
  mimeType?: string;
  previewUrl?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  type?: "text" | "widget" | "intake_form" | "intake_otp" | "login_card";
  widgetItem?: {
    id: string;
    widget: Record<string, unknown>;
  };
  progressSteps?: ProgressStep[];
  thinkingTasks?: ThinkingTask[];
  attachments?: MessageAttachment[];
  /** Per-message sender identity from the thread-detail API (threads.get_by_id).
   *  `senderUserId` is the `user_id` that authored the message; `customerName`
   *  is the `customer_name` the API attaches to it. On reload these take
   *  priority when choosing the avatar: a message authored by the logged-in
   *  viewer (senderUserId === auth.id) shows the viewer's own avatar — this is
   *  how a staff member chatting on a customer's itinerary keeps their own
   *  photo — otherwise we fall back to the customer's letter avatar. Live
   *  (optimistic) user messages set senderUserId to the viewer's id for the
   *  same reason. */
  senderUserId?: string | number;
  customerName?: string;
  /** When true, this assistant message represents a failed send (network or
   *  server error). Rendered with an inline error treatment in MessageBubble.
   *  Variant lets us tailor the icon/copy for offline vs. generic failures. */
  isError?: boolean;
  errorVariant?: "network" | "generic";
}

export interface UserLocationData {
  text: string;
  place_id: string;
  types: string[];
  lat: number;
  long: number;
  country: string;
  continent: string;
  source: string;
}

export interface ClientEffect {
  name: string;
  data: Record<string, unknown>;
}

interface UseChatOptions {
  apiUrl: string;
  domainKey: string;
  model?: string;
  userLocation?: UserLocationData | null;
  locationReady: boolean;
  botMode?: string;
  itineraryId?: string;
  onEffect?: (effect: ClientEffect) => void;
  onFirstToken?: () => void;
  onWidget?: (item: unknown) => void;
  authToken?: string;
  /** User ID from Redux state.auth.id — sent as user_id in every request */
  userId?: string | number;
  /**
   * Frontend-generated UUID for this chat session.
   * Sent as session_id in every request body.
   * Called back via onSessionCreated on the very first message so the
   * parent can update the URL — the value is the same UUID, not the
   * thread_id returned by the API.
   */
  sessionId: string;
  /**
   * Called once (after the first message fires) with the same sessionId
   * that was passed in, so the parent can push /chat/{sessionId} to history.
   */
  onSessionCreated?: (sessionId: string) => void;
  /**
   * Themed-page flag forwarded as `login_mandatory` on the very first
   * /chatkit request (threads.create). When undefined, the field is omitted
   * from the body. Subsequent messages never include it.
   */
  loginMandatory?: boolean;
}

// ─── UUID helper ──────────────────────────────────────────────────────────────

export function generateSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ─── Shared input shape ───────────────────────────────────────────────────────

function buildInput(text: string, attachmentIds: string[] = []) {
  return {
    content: [{ type: "input_text", text }],
    quoted_text: "",
    attachments: attachmentIds,
    inference_options: {},
  };
}

// ─── Auth / identity fields ───────────────────────────────────────────────────

function buildAuthFields(opts: {
  authToken?: string;
  userId?: string | number;
  sessionId: string;
}): Record<string, unknown> {
  const fields: Record<string, unknown> = {
    // session_id is always present — it's the frontend-generated UUID
    session_id: opts.sessionId,
  };
  if (opts.authToken) fields.access_token = opts.authToken;
  if (opts.userId != null) fields.user_id = opts.userId;
  return fields;
}

// ─── Request bodies ───────────────────────────────────────────────────────────

export function getPlatform(): "mobile" | "desktop" {
  if (typeof window !== "undefined" && window.innerWidth < 768) return "mobile";
  return "desktop";
}

// ─── Source / attribution fields ────────────────────────────────────────────
// Mirrors useSourceParams() used by the itinerary-initiate payload: the current
// path, platform, and any ad-attribution params (utm_*, gclid, fbclid, …). URL
// values win; persisted ad params (sessionStorage) fill the gaps so attribution
// survives navigation that strips the query string.
export function buildSourceFields(): Record<string, unknown> {
  const platform = getPlatform();
  if (typeof window === "undefined") return { platform };

  const queryObj: Record<string, unknown> = {};
  const urlParams = new URLSearchParams(window.location.search);
  for (const [key, value] of urlParams.entries()) {
    if (value === "true") queryObj[key] = true;
    else if (value === "false") queryObj[key] = false;
    else if (!isNaN(Number(value)) && value !== "") queryObj[key] = Number(value);
    else queryObj[key] = value;
  }

  const stored = getAdParams();
  const merged: Record<string, unknown> = { ...stored, ...queryObj };
  const path = window.location.pathname + window.location.search;

  return {
    path,
    platform,
    ...merged,
    source: merged.source || path || merged.utm_source,
  };
}

function buildFirstMessageBody(
  text: string,
  opts: {
    domainKey: string;
    model: string;
    userLocation: UserLocationData;
    botMode: string;
    itineraryId: string;
    authToken?: string;
    userId?: string | number;
    sessionId: string;
    attachmentIds?: string[];
    loginMandatory?: boolean;
  }
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    type: "threads.create",
    params: { input: buildInput(text, opts.attachmentIds) },
    model: opts.model,
    user_location: opts.userLocation,
    domain_key: opts.domainKey,
    platform: getPlatform(),
    source: buildSourceFields(),
    ...buildAuthFields(opts),
  };
  if (opts.botMode === "p2" && opts.itineraryId) body.itinerary_id = opts.itineraryId;
  if (opts.loginMandatory !== undefined) body.login_mandatory = opts.loginMandatory;
  return body;
}

function buildSubsequentMessageBody(
  text: string,
  opts: {
    threadId: string;
    domainKey: string;
    model: string;
    userLocation: UserLocationData;
    botMode: string;
    itineraryId: string;
    authToken?: string;
    userId?: string | number;
    sessionId: string;
    attachmentIds?: string[];
  }
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    type: "threads.add_user_message",
    params: { input: buildInput(text, opts.attachmentIds), thread_id: opts.threadId },
    model: opts.model,
    // user_location: opts.userLocation,
    domain_key: opts.domainKey,
    platform: getPlatform(),
    ...buildAuthFields(opts),
  };
  if (opts.botMode === "p2" && opts.itineraryId) body.itinerary_id = opts.itineraryId;
  return body;
}

// ─── Network retry ────────────────────────────────────────────────────────────

const MAX_NETWORK_RETRIES = 3;
const NETWORK_RETRY_BASE_DELAY_MS = 500;

function isNetworkError(err: unknown): boolean {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return true;
  if (err instanceof TypeError) return true;
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return (
      msg.includes("failed to fetch") ||
      msg.includes("networkerror") ||
      msg.includes("network request failed") ||
      msg.includes("load failed")
    );
  }
  return false;
}

function waitWithAbort(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  maxAttempts: number = MAX_NETWORK_RETRIES,
  signal?: AbortSignal,
): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fetch(url, init);
    } catch (err) {
      lastErr = err;
      if (err instanceof Error && err.name === "AbortError") throw err;
      if (!isNetworkError(err)) throw err;
      if (attempt === maxAttempts) throw err;
      console.warn(`[useChat] network error on attempt ${attempt}/${maxAttempts}, retrying…`, err);
      await waitWithAbort(NETWORK_RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1), signal);
    }
  }
  throw lastErr;
}

// Drop the trailing failed assistant bubble (and the user message that
// triggered it) so a retry doesn't leave a stale error sitting in history.
function stripTrailingErrorPair(messages: Message[]): Message[] {
  const last = messages[messages.length - 1];
  if (!last || last.role !== "assistant" || !last.isError) return messages;
  const prev = messages[messages.length - 2];
  if (prev?.role === "user") return messages.slice(0, -2);
  return messages.slice(0, -1);
}

// ─── SSE types & parser ───────────────────────────────────────────────────────

interface SseHandlers {
  onTextChunk: (text: string) => void;
  onThreadId: (id: string) => void;
  onEffect: (effect: ClientEffect) => void;
  onWidget?: (item: { id: string; widget: Record<string, unknown> }) => void;
  onProgress?: (step: { text: string; done: boolean }) => void;
  onWorkflowTaskAdded?: (index: number, content: string) => void;
  onWorkflowTaskUpdated?: (index: number, content: string) => void;
  onWorkflowDone?: () => void;
  onAssistantMessageId?: (id: string) => void;
}

function parseSseLine(raw: string, handlers: SseHandlers) {
  if (raw === "[DONE]") return;

  let ev: Record<string, unknown>;
  try {
    ev = JSON.parse(raw);
  } catch {
    if (raw.trim()) handlers.onTextChunk(raw);
    return;
  }

  const type = ev.type as string | undefined;
  if (!type) return;

  if (type === "thread.created") {
    const thread = ev.thread as { id?: string } | undefined;
    if (thread?.id) handlers.onThreadId(thread.id);
    return;
  }

  if (type === "thread.item.updated") {
    const update = ev.update as Record<string, unknown> | undefined;
    if (!update) return;
    const utype = update.type as string | undefined;

    if (utype === "assistant_message.content_part.text_delta") {
      const delta = update.delta as string | undefined;
      if (delta) handlers.onTextChunk(delta);
      return;
    }
    if (utype === "workflow.task.added") {
      const task = update.task as Record<string, unknown> | undefined;
      const taskIndex = update.task_index as number | undefined;
      const content = task?.content as string | undefined;
      if (task?.type === "thought" && content !== undefined && taskIndex !== undefined) {
        handlers.onWorkflowTaskAdded?.(taskIndex, content);
      }
      return;
    }
    if (utype === "workflow.task.updated") {
      const task = update.task as Record<string, unknown> | undefined;
      const taskIndex = update.task_index as number | undefined;
      const content = task?.content as string | undefined;
      if (task?.type === "thought" && content !== undefined && taskIndex !== undefined) {
        handlers.onWorkflowTaskUpdated?.(taskIndex, content);
      }
      return;
    }
    return;
  }

  if (type === "thread.item.added") {
    const item = ev.item as Record<string, unknown> | undefined;
    if (item?.type === "assistant_message" && typeof item.id === "string") {
      handlers.onAssistantMessageId?.(item.id);
    }
    return;
  }

  if (type === "thread.item.done") {
    const item = ev.item as Record<string, unknown> | undefined;
    if (item?.type === "workflow") {
      handlers.onWorkflowDone?.();
      return;
    }
    if (item?.type === "widget") {
      handlers.onWidget?.({
        id: item.id as string,
        widget: item.widget as Record<string, unknown>,
      });
      return;
    }
    if (item?.type === "assistant_message" && typeof item.id === "string") {
      handlers.onAssistantMessageId?.(item.id);
      return;
    }
    return;
  }

  if (type === "progress_update") {
    const text = ev.text as string | undefined;
    const done = (ev.done as boolean | undefined) ?? false;
    if (text) handlers.onProgress?.({ text, done });
    return;
  }

  if (type === "client_effect") {
    const name = ev.name as string | undefined;
    const data = (ev.data ?? {}) as Record<string, unknown>;
    if (name) handlers.onEffect({ name, data });
    return;
  }

  if (Array.isArray(ev.effects)) {
    (ev.effects as ClientEffect[]).forEach(handlers.onEffect);
    return;
  }
}

// ─── SSE stream reader ────────────────────────────────────────────────────────

async function readStream(
  response: Response,
  handlers: SseHandlers,
  signal?: AbortSignal
) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      if (signal?.aborted) break;
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const t = line.trim();
        if (t.startsWith("data: ")) parseSseLine(t.slice(6), handlers);
      }
    }
  } finally {
    reader.cancel().catch(() => {});
  }
}

// ─── Fallback location ────────────────────────────────────────────────────────

const FALLBACK_LOCATION: UserLocationData = {
  text: "Delhi, India",
  place_id: "ChIJLbZ-NFv9DDkRzk0gTkm3wlI",
  types: ["locality"],
  lat: 28.6139,
  long: 77.209,
  country: "India",
  continent: "Asia",
  source: "default",
};

// ─── Pure state-update helpers ────────────────────────────────────────────────

function applyProgressStep(
  steps: ProgressStep[],
  incoming: { text: string; done: boolean }
): ProgressStep[] {
  if (steps.length === 0) return [{ text: incoming.text, done: incoming.done }];
  const last = steps[steps.length - 1];
  if (!last.done) {
    return [
      ...steps.slice(0, -1),
      { ...last, done: true },
      { text: incoming.text, done: incoming.done },
    ];
  }
  return [...steps, { text: incoming.text, done: incoming.done }];
}

function applyTaskAdded(tasks: ThinkingTask[], index: number, content: string): ThinkingTask[] {
  const next = [...tasks];
  next[index] = { content, done: false };
  return next;
}

function applyTaskUpdated(tasks: ThinkingTask[], index: number, content: string): ThinkingTask[] {
  const next = [...tasks];
  next[index] = { content, done: false };
  return next;
}

function applyWorkflowDone(tasks: ThinkingTask[]): ThinkingTask[] {
  return tasks.map((t) => ({ ...t, done: true }));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useChat({
  apiUrl,
  domainKey,
  model = "high",
  userLocation,
  locationReady,
  botMode = "p1",
  itineraryId = "",
  onEffect,
  onFirstToken,
  onWidget,
  authToken,
  userId,
  sessionId,
  onSessionCreated,
  loginMandatory,
}: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // thread_id returned by the API — used for subsequent messages only
  const threadIdRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  // Monotonic token identifying the in-flight stream. A new send bumps it so a
  // preempted stream's `finally` can tell it no longer owns the global
  // streaming flag and must not clear it out from under the newer stream.
  const streamSeqRef = useRef(0);

  // Guard: fire onSessionCreated only once per hook instance
  const sessionCreatedFiredRef = useRef(false);

  // Keep latest prop values in refs so callbacks never go stale
  const authTokenRef = useRef(authToken);
  authTokenRef.current = authToken;
  const userIdRef = useRef(userId);
  userIdRef.current = userId;
  // sessionId is stable (generated once in ChatKitPanel), but keep a ref anyway
  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;
  const onSessionCreatedRef = useRef(onSessionCreated);
  onSessionCreatedRef.current = onSessionCreated;
  const loginMandatoryRef = useRef(loginMandatory);
  loginMandatoryRef.current = loginMandatory;

  const cancelStream = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);

  // Stable headers builder — reads from refs, never stale
  const buildHeaders = useCallback((): Record<string, string> => ({
    "Content-Type": "application/json",
    Accept: "text/event-stream",
    ...(authTokenRef.current ? { Authorization: `Bearer ${authTokenRef.current}` } : {}),
  }), []);

  // Called when API returns a thread.created event.
  // We store the API's thread_id for routing subsequent messages,
  // but the URL update uses our own sessionId (the frontend UUID).
  const handleThreadId = useCallback((apiThreadId: string) => {
    if (!threadIdRef.current) {
      threadIdRef.current = apiThreadId;
      console.log("[useChat] api thread_id:", apiThreadId);
    }
    // Notify parent with our OWN sessionId (UUID), not the API thread_id
    if (!sessionCreatedFiredRef.current) {
      sessionCreatedFiredRef.current = true;
      console.log("[useChat] session_id for URL:", sessionIdRef.current);
      onSessionCreatedRef.current?.(sessionIdRef.current);
    }
  }, []);

  // ─── sendWidgetAction ─────────────────────────────────────────────────────

  const sendWidgetAction = useCallback(
    async (type: string, payload: Record<string, unknown>) => {
      if (!threadIdRef.current) return;

      const assistantMsgId = `assistant-${Date.now()}`;
      let currentAssistantId = assistantMsgId;
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
          isStreaming: true,
          progressSteps: [],
          thinkingTasks: [],
        },
      ]);
      setIsStreaming(true);

      const loc = (locationReady ? userLocation : null) ?? FALLBACK_LOCATION;
      const body: Record<string, unknown> = {
        type: "threads.custom_action",
        params: {
          thread_id: threadIdRef.current,
          item_id: "",
          action: { type, payload },
        },
        domain_key: domainKey,
        model,
        platform: getPlatform(),
        // user_location: loc,
        ...buildAuthFields({
          authToken: authTokenRef.current,
          userId: userIdRef.current,
          sessionId: sessionIdRef.current,
        }),
        ...(botMode === "p2" && itineraryId ? { itinerary_id: itineraryId } : {}),
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: buildHeaders(),
          body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error(`${response.status}`);

        await readStream(response, {
          onTextChunk: (chunk) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === currentAssistantId ? { ...m, content: m.content + chunk } : m
              )
            );
          },
          onThreadId: handleThreadId,
          onAssistantMessageId: (realId) => {
            if (realId === currentAssistantId) return;
            const oldId = currentAssistantId;
            currentAssistantId = realId;
            setMessages((prev) =>
              prev.map((m) => (m.id === oldId ? { ...m, id: realId } : m))
            );
          },
          onEffect: (effect) => onEffect?.(effect),
          onWidget: (item) => {
            setMessages((prev) => [
              ...prev,
              {
                id: `widget-${Date.now()}`,
                role: "assistant",
                content: "",
                timestamp: new Date(),
                type: "widget",
                widgetItem: item,
              },
            ]);
          },
          onProgress: (step) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id !== currentAssistantId
                  ? m
                  : { ...m, progressSteps: applyProgressStep(m.progressSteps ?? [], step) }
              )
            );
          },
          onWorkflowTaskAdded: (index, content) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id !== currentAssistantId
                  ? m
                  : { ...m, thinkingTasks: applyTaskAdded(m.thinkingTasks ?? [], index, content) }
              )
            );
          },
          onWorkflowTaskUpdated: (index, content) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id !== currentAssistantId
                  ? m
                  : { ...m, thinkingTasks: applyTaskUpdated(m.thinkingTasks ?? [], index, content) }
              )
            );
          },
          onWorkflowDone: () => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id !== currentAssistantId
                  ? m
                  : { ...m, thinkingTasks: applyWorkflowDone(m.thinkingTasks ?? []) }
              )
            );
          },
        });
      } catch (err) {
        console.error("[sendWidgetAction]", err);
      } finally {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== currentAssistantId) return m;
            const steps = m.progressSteps ?? [];
            const finalSteps =
              steps.length > 0 && !steps[steps.length - 1].done
                ? [...steps.slice(0, -1), { ...steps[steps.length - 1], done: true }]
                : steps;
            return { ...m, isStreaming: false, progressSteps: finalSteps };
          })
        );
        setIsStreaming(false);
      }
    },
    [apiUrl, domainKey, model, botMode, itineraryId, locationReady, userLocation, onEffect, buildHeaders, handleThreadId]
  );

  // ─── sendMessage ──────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (
      content: string,
      attachmentIds?: string[],
      attachments?: MessageAttachment[],
      opts?: { interrupt?: boolean; formSubmitted?: boolean },
    ) => {
      const trimmed = content.trim();
      if (!trimmed && (!attachmentIds || attachmentIds.length === 0)) return;
      // While a response is streaming we ignore new sends — except interrupts.
      // The composer unlocks early once the answer is rendered and only quick
      // replies are still loading; those sends arrive with { interrupt } so we
      // abort the tail of the old stream and start fresh instead of dropping
      // the message.
      if (isStreaming && !opts?.interrupt) return;

      cancelStream();
      setError(null);

      const userMsgId = `user-${Date.now()}`;
      const assistantMsgId = `assistant-${Date.now() + 1}`;
      let currentAssistantId = assistantMsgId;

      setMessages((prev) => [
        // Drop the most recent failed assistant message (and the user message
        // it was responding to) so a successful retry doesn't leave a stale
        // "couldn't reach the server" bubble glued to the conversation.
        ...stripTrailingErrorPair(prev),
        {
          id: userMsgId,
          role: "user",
          content: trimmed,
          timestamp: new Date(),
          // The viewer authored this live message — tag it with their id so the
          // avatar resolves to their own photo (e.g. staff replying on a
          // customer's itinerary) rather than the customer's letter.
          ...(userIdRef.current != null ? { senderUserId: userIdRef.current } : {}),
          ...(attachments && attachments.length > 0 ? { attachments } : {}),
        },
        {
          id: assistantMsgId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
          isStreaming: true,
          progressSteps: [],
          thinkingTasks: [],
        },
      ]);
      setIsStreaming(true);

      const seq = ++streamSeqRef.current;
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const loc: UserLocationData = (locationReady ? userLocation : null) ?? FALLBACK_LOCATION;

      const commonOpts = {
        domainKey,
        model,
        userLocation: loc,
        botMode,
        itineraryId,
        // Pass camelCase keys so buildFirstMessageBody / buildSubsequentMessageBody
        // can forward them into buildAuthFields correctly.
        authToken: authTokenRef.current,
        userId: userIdRef.current,
        sessionId: sessionIdRef.current,
        attachmentIds,
      };

      const body = threadIdRef.current
        ? buildSubsequentMessageBody(trimmed, { threadId: threadIdRef.current, ...commonOpts })
        : buildFirstMessageBody(trimmed, { ...commonOpts, loginMandatory: loginMandatoryRef.current });

      // Flag intake-form submissions so the backend knows this message came
      // from the structured form rather than free-text chat.
      if (opts?.formSubmitted) {
        (body as Record<string, unknown>).form_submitted = true;
      }

      console.log("[useChat] →", JSON.stringify(body, null, 2));

      try {
        const response = await fetchWithRetry(
          apiUrl,
          {
            method: "POST",
            headers: buildHeaders(),
            body: JSON.stringify(body),
            signal: controller.signal,
          },
          MAX_NETWORK_RETRIES,
          controller.signal,
        );

        if (!response.ok) {
          const errText = await response.text().catch(() => response.statusText);
          throw new Error(`${response.status}: ${errText}`);
        }

        let firstToken = false;

        await readStream(
          response,
          {
            onTextChunk: (chunk) => {
              if (!firstToken) { firstToken = true; onFirstToken?.(); }
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === currentAssistantId ? { ...m, content: m.content + chunk } : m
                )
              );
            },
            onThreadId: handleThreadId,
            onAssistantMessageId: (realId) => {
              if (realId === currentAssistantId) return;
              const oldId = currentAssistantId;
              currentAssistantId = realId;
              setMessages((prev) =>
                prev.map((m) => (m.id === oldId ? { ...m, id: realId } : m))
              );
            },
            onEffect: (effect) => onEffect?.(effect),
            onWidget: (item) => {
              setMessages((prev) => [
                ...prev,
                {
                  id: `widget-${item.id}`,
                  role: "assistant",
                  content: "",
                  timestamp: new Date(),
                  type: "widget",
                  widgetItem: item,
                },
              ]);
            },
            onProgress: (step) => {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id !== currentAssistantId
                    ? m
                    : { ...m, progressSteps: applyProgressStep(m.progressSteps ?? [], step) }
                )
              );
            },
            onWorkflowTaskAdded: (index, content) => {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id !== currentAssistantId
                    ? m
                    : { ...m, thinkingTasks: applyTaskAdded(m.thinkingTasks ?? [], index, content) }
                )
              );
            },
            onWorkflowTaskUpdated: (index, content) => {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id !== currentAssistantId
                    ? m
                    : { ...m, thinkingTasks: applyTaskUpdated(m.thinkingTasks ?? [], index, content) }
                )
              );
            },
            onWorkflowDone: () => {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id !== currentAssistantId
                    ? m
                    : { ...m, thinkingTasks: applyWorkflowDone(m.thinkingTasks ?? []) }
                )
              );
            },
          },
          controller.signal
        );
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error("[useChat]", msg);
        setError(msg);
        const networkFailure = isNetworkError(err);
        const fallbackContent = networkFailure
          ? "I couldn't reach the server. Please check your internet connection and try again."
          : "Something went wrong. Please try again.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === currentAssistantId && !m.content
              ? {
                  ...m,
                  content: fallbackContent,
                  isError: true,
                  errorVariant: networkFailure ? "network" : "generic",
                }
              : m
          )
        );
      } finally {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== currentAssistantId) return m;
            const steps = m.progressSteps ?? [];
            const finalSteps =
              steps.length > 0 && !steps[steps.length - 1].done
                ? [...steps.slice(0, -1), { ...steps[steps.length - 1], done: true }]
                : steps;
            return { ...m, isStreaming: false, progressSteps: finalSteps };
          })
        );
        // Only the most recent stream owns the global streaming flag. If a send
        // preempted this one (quick-reply interrupt) it already bumped
        // streamSeqRef, so we must not clear isStreaming under the newer stream.
        if (streamSeqRef.current === seq) {
          setIsStreaming(false);
          abortControllerRef.current = null;
        }
      }
    },
    [isStreaming, locationReady, userLocation, apiUrl, domainKey, model, botMode, itineraryId, onEffect, onFirstToken, cancelStream, buildHeaders, handleThreadId]
  );

  // ─── clearMessages ────────────────────────────────────────────────────────

  const clearMessages = useCallback(() => {
    cancelStream();
    setMessages([]);
    setError(null);
    threadIdRef.current = null;
    sessionCreatedFiredRef.current = false;
  }, [cancelStream]);

  return { messages, isStreaming, error, sendMessage, sendWidgetAction, clearMessages, cancelStream , setMessages, threadIdRef,};
}