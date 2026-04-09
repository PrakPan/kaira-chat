import { useState, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProgressStep {
  text: string;
  done: boolean;
}

export interface ThinkingTask {
  content: string;
  done: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  type?: "text" | "widget";
  widgetItem?: {
    id: string;
    widget: Record<string, unknown>;
  };
  progressSteps?: ProgressStep[];
  thinkingTasks?: ThinkingTask[];
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

function buildInput(text: string) {
  return {
    content: [{ type: "input_text", text }],
    quoted_text: "",
    attachments: [],
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

function getPlatform(): "mobile" | "desktop" {
  if (typeof window !== "undefined" && window.innerWidth < 768) return "mobile";
  return "desktop";
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
  }
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    type: "threads.create",
    params: { input: buildInput(text) },
    model: opts.model,
    user_location: opts.userLocation,
    domain_key: opts.domainKey,
    platform: getPlatform(),
    ...buildAuthFields(opts),
  };
  if (opts.botMode === "p2" && opts.itineraryId) body.itinerary_id = opts.itineraryId;
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
  }
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    type: "threads.add_user_message",
    params: { input: buildInput(text), thread_id: opts.threadId },
    model: opts.model,
    // user_location: opts.userLocation,
    domain_key: opts.domainKey,
    platform: getPlatform(),
    ...buildAuthFields(opts),
  };
  if (opts.botMode === "p2" && opts.itineraryId) body.itinerary_id = opts.itineraryId;
  return body;
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
}: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // thread_id returned by the API — used for subsequent messages only
  const threadIdRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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
                m.id === assistantMsgId ? { ...m, content: m.content + chunk } : m
              )
            );
          },
          onThreadId: handleThreadId,
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
                m.id !== assistantMsgId
                  ? m
                  : { ...m, progressSteps: applyProgressStep(m.progressSteps ?? [], step) }
              )
            );
          },
          onWorkflowTaskAdded: (index, content) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id !== assistantMsgId
                  ? m
                  : { ...m, thinkingTasks: applyTaskAdded(m.thinkingTasks ?? [], index, content) }
              )
            );
          },
          onWorkflowTaskUpdated: (index, content) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id !== assistantMsgId
                  ? m
                  : { ...m, thinkingTasks: applyTaskUpdated(m.thinkingTasks ?? [], index, content) }
              )
            );
          },
          onWorkflowDone: () => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id !== assistantMsgId
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
            if (m.id !== assistantMsgId) return m;
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
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isStreaming) return;

      cancelStream();
      setError(null);

      const userMsgId = `user-${Date.now()}`;
      const assistantMsgId = `assistant-${Date.now() + 1}`;

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", content: trimmed, timestamp: new Date() },
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
      };

      const body = threadIdRef.current
        ? buildSubsequentMessageBody(trimmed, { threadId: threadIdRef.current, ...commonOpts })
        : buildFirstMessageBody(trimmed, commonOpts);

      console.log("[useChat] →", JSON.stringify(body, null, 2));

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: buildHeaders(),
          body: JSON.stringify(body),
          signal: controller.signal,
        });

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
                  m.id === assistantMsgId ? { ...m, content: m.content + chunk } : m
                )
              );
            },
            onThreadId: handleThreadId,
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
                  m.id !== assistantMsgId
                    ? m
                    : { ...m, progressSteps: applyProgressStep(m.progressSteps ?? [], step) }
                )
              );
            },
            onWorkflowTaskAdded: (index, content) => {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id !== assistantMsgId
                    ? m
                    : { ...m, thinkingTasks: applyTaskAdded(m.thinkingTasks ?? [], index, content) }
                )
              );
            },
            onWorkflowTaskUpdated: (index, content) => {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id !== assistantMsgId
                    ? m
                    : { ...m, thinkingTasks: applyTaskUpdated(m.thinkingTasks ?? [], index, content) }
                )
              );
            },
            onWorkflowDone: () => {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id !== assistantMsgId
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
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId && !m.content
              ? { ...m, content: "Sorry, something went wrong. Please try again." }
              : m
          )
        );
      } finally {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== assistantMsgId) return m;
            const steps = m.progressSteps ?? [];
            const finalSteps =
              steps.length > 0 && !steps[steps.length - 1].done
                ? [...steps.slice(0, -1), { ...steps[steps.length - 1], done: true }]
                : steps;
            return { ...m, isStreaming: false, progressSteps: finalSteps };
          })
        );
        setIsStreaming(false);
        abortControllerRef.current = null;
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