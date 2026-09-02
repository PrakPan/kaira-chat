import { useState, useRef, useCallback, useEffect } from "react";
import { getAdParams, getLandingPage } from "../../../helper/adAttribution";
import { isIntakeFormWidgetId } from "../components/IntakeForm/intakePrompt";
import { isPricingFormWidgetId } from "../components/PricingForm/pricingPrompt";

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
  /** Stable React key. `id` is swapped mid-stream for the server's real
   *  message id (see onAssistantMessageId's adopt paths), and a list keyed on
   *  `id` treats that rename as a different element — React unmounts the bubble
   *  and mounts a new one, so it visibly disappears and re-enters with its
   *  entry animation. Keying on this instead keeps the same element across the
   *  rename. Absent on messages restored from history, which never rename;
   *  callers fall back to `id`. */
  clientKey?: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  type?:
    | "text"
    | "widget"
    | "intake_form"
    | "pricing_form"
    | "login_card"
    | "theme_form";
  widgetItem?: {
    id: string;
    widget: Record<string, unknown>;
  };
  progressSteps?: ProgressStep[];
  thinkingTasks?: ThinkingTask[];
  /** Duration (in seconds) of a completed reasoning workflow, restored from the
   *  thread-detail API's `workflow.summary.duration` on page reload. The live
   *  per-step thoughts aren't persisted, so on reload we can only show the
   *  collapsed "Thought for {reasoningDuration}s" label above the message. */
  reasoningDuration?: number;
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
  /** For `type: "intake_form"` cards only. When a NEWER intake-form widget
   *  arrives in the same chat, the previously-shown card is frozen with a
   *  snapshot of its state at that moment so it keeps rendering exactly as it
   *  was — the live `IntakeForm` Redux slice is reused by the new card. Absent
   *  on the live (interactive) card. */
  intakeSnapshot?: unknown;
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

/** An item the user saved on a theme page, forwarded verbatim in the first
 *  /chatkit request body's `items` field. Kept loose — the backend only reads
 *  what it needs. Mirrors the theme layer's CinematicSelectableItem. */
export interface ThemeSelectedItem {
  kind?: string;
  label?: string;
  short?: string;
  id?: string;
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
  onWidget?: (item: { id: string; widget: Record<string, unknown> }) => void;
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
  /**
   * Theme-page context handed off from a /theme landing (see heroChatHandoff):
   * the items the reader saved and a slug naming the theme. Both are forwarded
   * on the very first /chatkit request (threads.create) as `items` / `slug`,
   * and omitted when empty. Subsequent messages never include them.
   */
  themeItems?: ThemeSelectedItem[];
  themeSlug?: string;
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
  // First page the user landed on this session (home, destination, theme, ...);
  // falls back to the current path if capture missed (e.g. direct /chat entry).
  const landing_page = getLandingPage() || window.location.pathname;

  return {
    path,
    landing_page,
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
    themeItems?: ThemeSelectedItem[];
    themeSlug?: string;
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
  // Theme-page hand-off: the saved items + theme slug (first request only).
  if (opts.themeSlug) body.slug = opts.themeSlug;
  if (opts.themeItems && opts.themeItems.length > 0) body.items = opts.themeItems;
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
  /**
   * Fired for every `assistant_message` stream item. `isNewItem` is true for
   * `thread.item.added` (a distinct message begins) and false for
   * `thread.item.done` (the same message finished). The consumer uses this to
   * tell the FIRST assistant message of a turn (which adopts the streaming
   * placeholder) apart from a SUBSEQUENT one (a separate bubble) — the backend
   * emits an extra, often-empty assistant message right before a widget, and
   * collapsing it onto the first would strand the first message's text.
   */
  onAssistantMessageId?: (id: string, isNewItem: boolean) => void;
  /**
   * Fired on `thread.item.done` for an assistant_message that carries text,
   * with the message's COMPLETE reply as the server stored it.
   *
   * The rendered bubble is otherwise built purely by accumulating
   * `content_part.text_delta` events. When those deltas don't reach us — a
   * buffering in-app-browser proxy coalescing frames, a dropped intermediate
   * frame, a partial line lost at the end of the body — the bubble stays empty
   * and MessageBubble drops it as an empty husk, so the reader sees their own
   * message with no reply at all while the backend holds the full text. The
   * terminal `done` item is the authoritative copy of that text; reconciling
   * against it makes the transcript self-healing regardless of what happened to
   * the deltas.
   */
  onAssistantMessageDone?: (id: string, text: string) => void;
}

/** Pull the reply text out of a thread item's `content` array. */
function extractItemText(item: Record<string, unknown> | undefined): string {
  const parts = item?.content;
  if (!Array.isArray(parts)) return "";
  for (const part of parts) {
    if (
      part &&
      typeof part === "object" &&
      (part as any).type === "output_text" &&
      typeof (part as any).text === "string"
    ) {
      return (part as any).text;
    }
  }
  return "";
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
      handlers.onAssistantMessageId?.(item.id, true);
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
      handlers.onAssistantMessageId?.(item.id, false);
      // Reconcile against the server's own copy of the reply. Order matters:
      // onAssistantMessageId may have just queued a rename of the streaming
      // placeholder onto `item.id`, and React applies queued updaters in the
      // order they were queued — so by the time this one runs the bubble is
      // already keyed on the real id.
      const finalText = extractItemText(item);
      if (finalText) handlers.onAssistantMessageDone?.(item.id, finalText);
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

  // The space after `data:` is optional in the SSE grammar. Matching only
  // "data: " meant a producer (or a proxy that rewrites framing) emitting
  // "data:{...}" had every one of its events silently ignored.
  const dispatchLine = (line: string) => {
    const t = line.trim();
    if (!t.startsWith("data:")) return;
    parseSseLine(t.slice(5).trimStart(), handlers);
  };

  const drain = (chunk: string) => {
    buffer += chunk;
    const lines = buffer.split("\n");
    // The text after the last newline may be half an event — hold it back
    // until the rest arrives (or until the flush below, at end of body).
    buffer = lines.pop() ?? "";
    for (const line of lines) dispatchLine(line);
  };

  try {
    let completed = false;
    while (true) {
      if (signal?.aborted) break;
      const { done, value } = await reader.read();
      if (done) {
        completed = true;
        break;
      }
      drain(decoder.decode(value, { stream: true }));
    }
    // Body ended. Flush the decoder's own pending bytes, then the final line —
    // which `drain` is still holding back because a body that doesn't end in a
    // newline leaves its last event stranded in `buffer`. That last event is
    // usually the assistant message's `thread.item.done`, i.e. the reply
    // itself, so dropping it emptied the bubble.
    if (completed) {
      drain(decoder.decode());
      const tail = buffer;
      buffer = "";
      dispatchLine(tail);
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

/**
 * Close the trailing progress step.
 *
 * A `progress_update` always arrives with `done: false`, and applyProgressStep
 * only marks a step done when the NEXT one lands — so the last step of any run
 * is left open. ProgressLoader spins until every step is done, so the moment a
 * message stops being the progress target its trailing step has to be closed
 * here or that bubble's loader never stops.
 *
 * This used to live inline in the stream's `finally`, which meant it only ever
 * ran for whichever message was current when the stream ended. A message
 * superseded mid-turn (the backend emits a second assistant_message after the
 * itinerary summary) was marked `isStreaming: false` with its last step still
 * open, and sat there spinning on "Pulling it all together…" forever.
 */
function finalizeProgress(steps: ProgressStep[] = []): ProgressStep[] {
  if (steps.length === 0) return steps;
  const last = steps[steps.length - 1];
  if (last.done) return steps;
  return [...steps.slice(0, -1), { ...last, done: true }];
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

/**
 * Fold the server's authoritative reply text into the message it belongs to.
 *
 * Never shortens what is already on screen: if every delta arrived this is a
 * no-op (the two strings match), and if the stream was truncated or the deltas
 * never landed it fills the gap. The length guard means a `done` payload that
 * is somehow abridged can't wipe text the reader has already seen.
 */
function applyFinalText(messages: Message[], id: string, text: string): Message[] {
  let changed = false;
  const next = messages.map((m) => {
    if (m.id !== id || m.content === text || text.length < m.content.length) return m;
    changed = true;
    return { ...m, content: text };
  });
  return changed ? next : messages;
}

/**
 * Decide what a restored thread payload should do to the transcript on screen.
 *
 * `restored` is a snapshot of the thread as of the moment threads.get_by_id
 * resolved. `live` is what the panel is currently showing.
 *
 * When nothing was streaming, the snapshot IS the transcript and replaces it
 * wholesale — a thread switch has to drop the previous thread's messages, so
 * merging would be wrong. When a turn was in flight, the snapshot predates what
 * the reader is watching, so it may only fill a panel that has nothing in it
 * (a reload whose auto-sent prompt beat the restore) and must never overwrite
 * live content.
 */
export function resolveRestoredTranscript(
  restored: Message[],
  live: Message[],
  streamingWhenReceived: boolean,
): Message[] {
  if (!streamingWhenReceived) return restored;
  return live.length > 0 ? live : restored;
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
  themeItems,
  themeSlug,
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
  const themeItemsRef = useRef(themeItems);
  themeItemsRef.current = themeItems;
  const themeSlugRef = useRef(themeSlug);
  themeSlugRef.current = themeSlug;

  const cancelStream = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);

  // Abort any in-flight /chatkit request when the panel unmounts (e.g. the user
  // pressed browser back mid-stream), so the request doesn't keep running — and
  // its callbacks fire — against a page the user has already left.
  useEffect(
    () => () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
    },
    [],
  );

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
    async (
      type: string,
      payload: Record<string, unknown>,
      // Optional extra fields spread at the ROOT of the request body (siblings
      // of `params`/`domain_key`), for flags the backend reads top-level rather
      // than inside the action payload — e.g. `login_opted_out` on skip-login.
      rootFields?: Record<string, unknown>,
    ) => {
      if (!threadIdRef.current) return;

      // A widget CTA opens a streamed turn exactly like a text send, so it has
      // to take part in the same bookkeeping. It previously did neither of the
      // two things sendMessage does, and both hurt:
      //
      //  · No streamSeqRef bump, and a `finally` that cleared isStreaming
      //    unconditionally. Whichever of two overlapping turns finished first
      //    unlocked the composer and dropped the "Kaira is working…" state out
      //    from under the one still running — the stream looked stopped while
      //    text was still arriving.
      //  · No AbortController registered on abortControllerRef, so neither
      //    cancelStream() (the Stop button, and the interrupt at the head of
      //    every send) nor the unmount cleanup could reach it. It ran on past
      //    the turn that replaced it, writing into a message list it no longer
      //    owned, and kept running after the panel was gone.
      //
      // Aborting the previous turn here matches sendMessage: a CTA fired during
      // the quick-reply tail is a new turn and should end the old one, not race
      // it.
      cancelStream();
      const seq = ++streamSeqRef.current;
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const assistantMsgId = `assistant-${Date.now()}`;
      let currentAssistantId = assistantMsgId;
      // Whether the streaming placeholder has adopted a real server-assigned
      // assistant_message id yet. Only the first assistant message of the turn
      // claims it; later ones open their own bubbles.
      let assistantIdClaimed = false;
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          clientKey: assistantMsgId,
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
        ...(rootFields ?? {}),
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: buildHeaders(),
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`${response.status}`);

        await readStream(response, {
          onTextChunk: (chunk) => {
            // Capture the target id NOW — currentAssistantId is mutated by later
            // stream events and a batched flush would otherwise misroute the text.
            // See the detailed note on sendMessage's onTextChunk.
            const targetId = currentAssistantId;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === targetId ? { ...m, content: m.content + chunk } : m
              )
            );
          },
          onThreadId: handleThreadId,
          onAssistantMessageId: (realId, isNewItem) => {
            if (realId === currentAssistantId) return;
            if (!assistantIdClaimed) {
              // First real id of this turn → adopt it onto the placeholder so
              // text deltas + feedback correlate to the real message id.
              const oldId = currentAssistantId;
              currentAssistantId = realId;
              assistantIdClaimed = true;
              setMessages((prev) =>
                prev.map((m) => (m.id === oldId ? { ...m, id: realId } : m))
              );
              return;
            }
            // A SECOND (or later) assistant_message in the same turn — the
            // backend emits an extra, often-empty message right before a
            // widget. It is a distinct bubble, NOT a continuation: renaming the
            // first bubble onto this id would strand the real text under an id
            // the rest of the turn treats as the empty pre-widget message and
            // hide it. Open a fresh bubble instead (an empty one is dropped at
            // render time). Only the `added` event opens it; the matching
            // `done` is a no-op so we don't duplicate.
            if (!isNewItem) return;
            const prevId = currentAssistantId;
            currentAssistantId = realId;
            setMessages((prev) => [
              // Superseded mid-turn — see the note on the same branch in
              // sendMessage: the trailing progress step has to be closed here.
              ...prev.map((m) =>
                m.id === prevId
                  ? {
                      ...m,
                      isStreaming: false,
                      progressSteps: finalizeProgress(m.progressSteps),
                    }
                  : m,
              ),
              {
                id: realId,
                clientKey: realId,
                role: "assistant",
                content: "",
                timestamp: new Date(),
                isStreaming: true,
                progressSteps: [],
                thinkingTasks: [],
              },
            ]);
          },
          onAssistantMessageDone: (realId, text) => {
            setMessages((prev) => applyFinalText(prev, realId, text));
          },
          onEffect: (effect) => onEffect?.(effect),
          onWidget: (item) => {
            // Intake-form widgets encode their prefill in the widget's own id
            // (item.widget.id = "intake-form:{...}"; item.id is the message id)
            // and must render as the interactive IntakeForm card, not the raw
            // widget placeholder. Hand them to the host (ChatKitPanel) instead.
            if (
              isIntakeFormWidgetId(item.widget?.id) ||
              isPricingFormWidgetId(item.widget?.id)
            ) {
              onWidget?.(item);
              return;
            }
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
            const targetId = currentAssistantId; // capture — see onTextChunk note
            setMessages((prev) =>
              prev.map((m) =>
                m.id !== targetId
                  ? m
                  : { ...m, progressSteps: applyProgressStep(m.progressSteps ?? [], step) }
              )
            );
          },
          onWorkflowTaskAdded: (index, content) => {
            const targetId = currentAssistantId; // capture — see onTextChunk note
            setMessages((prev) =>
              prev.map((m) =>
                m.id !== targetId
                  ? m
                  : { ...m, thinkingTasks: applyTaskAdded(m.thinkingTasks ?? [], index, content) }
              )
            );
          },
          onWorkflowTaskUpdated: (index, content) => {
            const targetId = currentAssistantId; // capture — see onTextChunk note
            setMessages((prev) =>
              prev.map((m) =>
                m.id !== targetId
                  ? m
                  : { ...m, thinkingTasks: applyTaskUpdated(m.thinkingTasks ?? [], index, content) }
              )
            );
          },
          onWorkflowDone: () => {
            const targetId = currentAssistantId; // capture — see onTextChunk note
            setMessages((prev) =>
              prev.map((m) =>
                m.id !== targetId
                  ? m
                  : { ...m, thinkingTasks: applyWorkflowDone(m.thinkingTasks ?? []) }
              )
            );
          },
        }, controller.signal);
      } catch (err) {
        // A newer turn preempting this one is routine, not an error.
        if (!(err instanceof Error && err.name === "AbortError")) {
          console.error("[sendWidgetAction]", err);
        }
      } finally {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== currentAssistantId) return m;
            return {
              ...m,
              isStreaming: false,
              progressSteps: finalizeProgress(m.progressSteps),
            };
          })
        );
        // Only the most recent turn owns the global streaming flag — same guard
        // as sendMessage. Without it a preempted widget action cleared the flag
        // out from under the turn that replaced it.
        if (streamSeqRef.current === seq) {
          setIsStreaming(false);
          abortControllerRef.current = null;
        }
      }
    },
    [apiUrl, domainKey, model, botMode, itineraryId, locationReady, userLocation, onEffect, buildHeaders, handleThreadId, cancelStream]
  );

  // ─── sendMessage ──────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (
      content: string,
      attachmentIds?: string[],
      attachments?: MessageAttachment[],
      opts?: {
        interrupt?: boolean;
        formSubmitted?: boolean;
        contextPrefix?: string;
        // Structured theme mini-form submission (slug/window/skeleton/dates/pax/
        // items). Attached to the first request body as `intake` — the backend
        // reads it to pick the route instead of parsing free text.
        intakePayload?: Record<string, unknown>;
      },
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
      // Whether the streaming placeholder has adopted a real server-assigned
      // assistant_message id yet. Only the first assistant message of the turn
      // claims it; later ones open their own bubbles.
      let assistantIdClaimed = false;

      setMessages((prev) => [
        // Drop the most recent failed assistant message (and the user message
        // it was responding to) so a successful retry doesn't leave a stale
        // "couldn't reach the server" bubble glued to the conversation.
        ...stripTrailingErrorPair(prev),
        {
          id: userMsgId,
          clientKey: userMsgId,
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
          clientKey: assistantMsgId,
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

      // Hidden context (e.g. fields already picked in an unsubmitted intake
      // form) rides along to the backend prepended to the message, but never
      // touches the visible user bubble above — that shows only what they typed.
      const prefix = opts?.contextPrefix?.trim();
      const contentForBackend = prefix ? `${prefix}\n\n${trimmed}` : trimmed;

      const body = threadIdRef.current
        ? buildSubsequentMessageBody(contentForBackend, { threadId: threadIdRef.current, ...commonOpts })
        : buildFirstMessageBody(contentForBackend, {
            ...commonOpts,
            loginMandatory: loginMandatoryRef.current,
            themeItems: themeItemsRef.current,
            themeSlug: themeSlugRef.current,
          });

      // Flag intake-form submissions so the backend knows this message came
      // from the structured form rather than free-text chat.
      if (opts?.formSubmitted) {
        (body as Record<string, unknown>).form_submitted = true;
      }
      // Structured theme mini-form payload (window/skeleton/dates/pax/items…) —
      // sent as `intake` so the backend routes off it rather than the free text.
      // The intake object already carries slug + items, so drop the duplicate
      // top-level copies (added by buildFirstMessageBody from themeItems/themeSlug)
      // to avoid sending the items array twice. The plain-seed flow, which has no
      // intake payload, keeps the top-level slug/items.
      if (opts?.intakePayload) {
        const b = body as Record<string, unknown>;
        b.intake = opts.intakePayload;
        delete b.items;
        delete b.slug;
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

        // ── Progress routing across a message boundary ────────────────────────
        // The backend can close an assistant message and then keep emitting
        // progress for the NEXT one (the itinerary summary lands, then three
        // more updates run while pricing is queued, then the "locked in"
        // message opens). Those updates belong to the message that is coming,
        // not the answer the reader has already finished reading.
        //
        // `currentAssistantDone` records that `thread.item.done` closed the
        // current message. The next progress/thought then opens a streaming
        // placeholder — which is what puts a live loader on screen during the
        // gap — and `pendingPlaceholderId` lets the real assistant_message
        // ADOPT that placeholder instead of stacking an empty bubble on top.
        let currentAssistantDone = false;
        let pendingPlaceholderId: string | null = null;
        let placeholderSeq = 0;

        /** The bubble progress belongs to right now, opening the next one if
         *  the current message has already been closed. */
        const progressTarget = (): string => {
          if (!currentAssistantDone) return currentAssistantId;
          const placeholderId = `${assistantMsgId}-next-${++placeholderSeq}`;
          const prevId = currentAssistantId;
          currentAssistantId = placeholderId;
          pendingPlaceholderId = placeholderId;
          currentAssistantDone = false;
          setMessages((prev) => [
            ...prev.map((m) =>
              m.id === prevId
                ? {
                    ...m,
                    isStreaming: false,
                    progressSteps: finalizeProgress(m.progressSteps),
                  }
                : m,
            ),
            {
              id: placeholderId,
              clientKey: placeholderId,
              role: "assistant" as const,
              content: "",
              timestamp: new Date(),
              isStreaming: true,
              progressSteps: [],
              thinkingTasks: [],
            },
          ]);
          return placeholderId;
        };

        await readStream(
          response,
          {
            onTextChunk: (chunk) => {
              if (!firstToken) { firstToken = true; onFirstToken?.(); }
              // Capture the target id NOW, at chunk-arrival time. `currentAssistantId`
              // is a mutable closure var that later stream events keep advancing; if
              // the whole SSE response arrives in one batch, React flushes these
              // setMessages updaters only afterwards — by which point the bare
              // `currentAssistantId` would already point at a LATER message and the
              // text would land on the wrong bubble (or be lost). The captured const
              // pins each chunk to the message that was streaming when it arrived.
              const targetId = currentAssistantId;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === targetId ? { ...m, content: m.content + chunk } : m
                )
              );
            },
            onThreadId: handleThreadId,
            onAssistantMessageId: (realId, isNewItem) => {
              if (realId === currentAssistantId) {
                // `thread.item.done` for the message we're on. Remember that it
                // is closed so any progress that follows opens the next bubble
                // rather than landing under a finished answer.
                if (!isNewItem) currentAssistantDone = true;
                return;
              }
              if (!assistantIdClaimed) {
                // First real id of this turn → adopt it onto the placeholder so
                // text deltas + feedback correlate to the real message id.
                const oldId = currentAssistantId;
                currentAssistantId = realId;
                assistantIdClaimed = true;
                currentAssistantDone = false;
                setMessages((prev) =>
                  prev.map((m) => (m.id === oldId ? { ...m, id: realId } : m))
                );
                return;
              }
              // A SECOND (or later) assistant_message in the same turn — the
              // backend emits an extra, often-empty message right before a
              // widget. It is a distinct bubble, NOT a continuation: renaming
              // the first bubble onto this id would strand the real text under
              // an id the rest of the turn treats as the empty pre-widget
              // message and hide it. Open a fresh bubble instead (an empty one
              // is dropped at render time). Only the `added` event opens it;
              // the matching `done` is a no-op so we don't duplicate.
              if (!isNewItem) return;
              // Progress arriving after the previous message closed already
              // opened a placeholder for THIS message — adopt it (keeping the
              // steps that ran while the reader waited) instead of stacking a
              // second, empty bubble on top of it.
              if (pendingPlaceholderId) {
                const oldId = pendingPlaceholderId;
                pendingPlaceholderId = null;
                currentAssistantId = realId;
                currentAssistantDone = false;
                setMessages((prev) =>
                  prev.map((m) => (m.id === oldId ? { ...m, id: realId } : m)),
                );
                return;
              }
              const prevId = currentAssistantId;
              currentAssistantId = realId;
              currentAssistantDone = false;
              setMessages((prev) => [
                // Superseded mid-turn: close its trailing progress step too, or the
                // loader on this bubble spins forever (the stream's `finally` only
                // ever finalizes whichever message is current when it ends).
                ...prev.map((m) =>
                  m.id === prevId
                    ? {
                        ...m,
                        isStreaming: false,
                        progressSteps: finalizeProgress(m.progressSteps),
                      }
                    : m,
                ),
                {
                  id: realId,
                  clientKey: realId,
                  role: "assistant" as const,
                  content: "",
                  timestamp: new Date(),
                  isStreaming: true,
                  progressSteps: [],
                  thinkingTasks: [],
                },
              ]);
            },
            onAssistantMessageDone: (realId, text) => {
              setMessages((prev) => applyFinalText(prev, realId, text));
            },
            onEffect: (effect) => onEffect?.(effect),
            onWidget: (item) => {
              // Intake-form widgets encode their prefill in the widget's own id
              // (item.widget.id = "intake-form:{...}"; item.id is the message
              // id) and must render as the interactive IntakeForm card, not the
              // raw widget placeholder. Hand them to the host (ChatKitPanel).
              if (
                isIntakeFormWidgetId(item.widget?.id) ||
                isPricingFormWidgetId(item.widget?.id)
              ) {
                onWidget?.(item);
                return;
              }
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
              // progressTarget() opens the next bubble when the current message
              // has already been closed — see its definition above. Capture the
              // id NOW, per the onTextChunk note.
              const targetId = progressTarget();
              setMessages((prev) =>
                prev.map((m) =>
                  m.id !== targetId
                    ? m
                    : { ...m, progressSteps: applyProgressStep(m.progressSteps ?? [], step) }
                )
              );
            },
            onWorkflowTaskAdded: (index, content) => {
              // Same boundary rule as onProgress: a thought that arrives after
              // the message closed belongs to the next one.
              const targetId = progressTarget();
              setMessages((prev) =>
                prev.map((m) =>
                  m.id !== targetId
                    ? m
                    : { ...m, thinkingTasks: applyTaskAdded(m.thinkingTasks ?? [], index, content) }
                )
              );
            },
            onWorkflowTaskUpdated: (index, content) => {
              const targetId = currentAssistantId; // capture — see onTextChunk note
              setMessages((prev) =>
                prev.map((m) =>
                  m.id !== targetId
                    ? m
                    : { ...m, thinkingTasks: applyTaskUpdated(m.thinkingTasks ?? [], index, content) }
                )
              );
            },
            onWorkflowDone: () => {
              const targetId = currentAssistantId; // capture — see onTextChunk note
              setMessages((prev) =>
                prev.map((m) =>
                  m.id !== targetId
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
            return {
              ...m,
              isStreaming: false,
              progressSteps: finalizeProgress(m.progressSteps),
            };
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