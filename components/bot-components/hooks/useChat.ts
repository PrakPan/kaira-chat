import { useState, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProgressStep {
  text: string;
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

// ─── Request bodies ───────────────────────────────────────────────────────────

function buildFirstMessageBody(
  text: string,
  opts: { domainKey: string; model: string; userLocation: UserLocationData; botMode: string; itineraryId: string }
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    type: "threads.create",
    params: {
      input: buildInput(text),
    },
    model: opts.model,
    user_location: opts.userLocation,
    domain_key: opts.domainKey,
  };
  if (opts.botMode === "p2" && opts.itineraryId) body.itinerary_id = opts.itineraryId;
  return body;
}

function buildSubsequentMessageBody(
  text: string,
  opts: { threadId: string; domainKey: string; model: string; userLocation: UserLocationData; botMode: string; itineraryId: string }
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    type: "threads.add_user_message",
    params: {
      input: buildInput(text),
      thread_id: opts.threadId,
    },
    model: opts.model,
    user_location: opts.userLocation,
    domain_key: opts.domainKey,
  };
  if (opts.botMode === "p2" && opts.itineraryId) body.itinerary_id = opts.itineraryId;
  return body;
}

// ─── SSE parser ───────────────────────────────────────────────────────────────

function parseSseLine(
  raw: string,
  handlers: {
    onTextChunk: (text: string) => void;
    onThreadId: (id: string) => void;
    onEffect: (effect: ClientEffect) => void;
    onWidget?: (item: { id: string; widget: Record<string, unknown> }) => void;
    onProgress?: (step: { text: string; done: boolean }) => void; // ← NEW
  }
) {
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

  // ── Thread created ────────────────────────────────────────────────────────
  if (type === "thread.created") {
    const thread = ev.thread as { id?: string } | undefined;
    if (thread?.id) handlers.onThreadId(thread.id);
    return;
  }

  // ── Item updated — carries streaming text deltas ──────────────────────────
  if (type === "thread.item.updated") {
    const update = ev.update as Record<string, unknown> | undefined;
    if (!update) return;
    const utype = update.type as string | undefined;
    if (utype === "assistant_message.content_part.text_delta") {
      const delta = update.delta as string | undefined;
      if (delta) handlers.onTextChunk(delta);
    }
    return;
  }

  // ── Progress update ───────────────────────────────────────────────────────
  if (type === "progress_update") {
    const text = ev.text as string | undefined;
    const done = (ev.done as boolean | undefined) ?? false;
    if (text) handlers.onProgress?.({ text, done });
    return;
  }

  // ── Client-side effect ────────────────────────────────────────────────────
  if (type === "client_effect") {
    const name = ev.name as string | undefined;
    const data = (ev.data ?? {}) as Record<string, unknown>;
    if (name) handlers.onEffect({ name, data });
    return;
  }

  // ── Batch effects (non-streamed response) ─────────────────────────────────
  if (Array.isArray(ev.effects)) {
    (ev.effects as ClientEffect[]).forEach(handlers.onEffect);
    return;
  }

  // ── Widget item done ──────────────────────────────────────────────────────
  if (type === "thread.item.done") {
    const item = ev.item as Record<string, unknown> | undefined;
    if (item?.type === "widget") {
      handlers.onWidget?.({
        id: item.id as string,
        widget: item.widget as Record<string, unknown>,
      });
    }
    return;
  }
}

// ─── SSE stream reader ────────────────────────────────────────────────────────

async function readStream(
  response: Response,
  handlers: Parameters<typeof parseSseLine>[1],
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

// ─── Progress helpers ─────────────────────────────────────────────────────────

function applyProgressStep(
  steps: ProgressStep[],
  incoming: { text: string; done: boolean }
): ProgressStep[] {
  if (steps.length === 0) {
    return [{ text: incoming.text, done: incoming.done }];
  }
  const last = steps[steps.length - 1];
  if (!last.done) {
    // Mark the current active step done, then add the new one
    return [
      ...steps.slice(0, -1),
      { ...last, done: true },
      { text: incoming.text, done: incoming.done },
    ];
  }
  // Last step was already done — just append
  return [...steps, { text: incoming.text, done: incoming.done }];
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
}: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const threadIdRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cancelStream = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);

  // ─── sendWidgetAction ───────────────────────────────────────────────────────

  const sendWidgetAction = useCallback(async (
    type: string,
    payload: Record<string, unknown>
  ) => {
    if (!threadIdRef.current) return;

    const assistantMsgId = `assistant-${Date.now()}`;
    setMessages((prev) => [...prev, {
      id: assistantMsgId, role: "assistant",
      content: "", timestamp: new Date(), isStreaming: true,
      progressSteps: [], // ← initialise
    }]);
    setIsStreaming(true);

    const loc = (locationReady ? userLocation : null) ?? FALLBACK_LOCATION;
    const body = {
      type: "threads.custom_action",
      params: {
        thread_id: threadIdRef.current,
        item_id: "",
        action: { type, payload },
      },
      domain_key: domainKey,
      model,
      user_location: loc,
      ...(botMode === "p2" && itineraryId ? { itinerary_id: itineraryId } : {}),
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errBody = await response.text();
        console.error("[sendWidgetAction] error body:", errBody);
        throw new Error(`${response.status}`);
      }

      await readStream(response, {
        onTextChunk: (chunk) => {
          setMessages((prev) => prev.map((m) =>
            m.id === assistantMsgId ? { ...m, content: m.content + chunk } : m
          ));
        },
        onThreadId: () => {},
        onEffect: (effect) => onEffect?.(effect),
        onWidget: (item) => {
          setMessages((prev) => [...prev, {
            id: `widget-${Date.now()}`, role: "assistant",
            content: "", timestamp: new Date(),
            type: "widget", widgetItem: item,
          }]);
        },
        // ← NEW: progress steps for widget action responses
        onProgress: (step) => {
          setMessages((prev) => prev.map((m) => {
            if (m.id !== assistantMsgId) return m;
            return {
              ...m,
              progressSteps: applyProgressStep(m.progressSteps ?? [], step),
            };
          }));
        },
      });
    } catch (err) {
      console.error("[sendWidgetAction]", err);
    } finally {
      // Mark last progress step as done when stream ends
      setMessages((prev) => prev.map((m) => {
        if (m.id !== assistantMsgId) return m;
        const steps = m.progressSteps ?? [];
        const finalSteps = steps.length > 0 && !steps[steps.length - 1].done
          ? [...steps.slice(0, -1), { ...steps[steps.length - 1], done: true }]
          : steps;
        return { ...m, isStreaming: false, progressSteps: finalSteps };
      }));
      setIsStreaming(false);
    }
  }, [threadIdRef, apiUrl, domainKey, model, botMode, itineraryId,
    locationReady, userLocation, onEffect]);

  // ─── sendMessage ────────────────────────────────────────────────────────────

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
          progressSteps: [], // ← initialise
        },
      ]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const loc: UserLocationData =
        (locationReady ? userLocation : null) ?? FALLBACK_LOCATION;

      const commonOpts = { domainKey, model, userLocation: loc, botMode, itineraryId };

      const body = threadIdRef.current
        ? buildSubsequentMessageBody(trimmed, { threadId: threadIdRef.current, ...commonOpts })
        : buildFirstMessageBody(trimmed, commonOpts);

      console.log("[useChat] →", JSON.stringify(body, null, 2));

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
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
            onThreadId: (id) => {
              if (!threadIdRef.current) {
                threadIdRef.current = id;
                console.log("[useChat] thread_id:", id);
              }
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
            // ← NEW: progress steps for regular message responses
            onProgress: (step) => {
              setMessages((prev) => prev.map((m) => {
                if (m.id !== assistantMsgId) return m;
                return {
                  ...m,
                  progressSteps: applyProgressStep(m.progressSteps ?? [], step),
                };
              }));
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
        // Mark last progress step as done when stream ends
        setMessages((prev) => prev.map((m) => {
          if (m.id !== assistantMsgId) return m;
          const steps = m.progressSteps ?? [];
          const finalSteps = steps.length > 0 && !steps[steps.length - 1].done
            ? [...steps.slice(0, -1), { ...steps[steps.length - 1], done: true }]
            : steps;
          return { ...m, isStreaming: false, progressSteps: finalSteps };
        }));
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [
      isStreaming, locationReady, userLocation,
      apiUrl, domainKey, model, botMode, itineraryId,
      onEffect, onFirstToken, cancelStream,
    ]
  );

  // ─── clearMessages ──────────────────────────────────────────────────────────

  const clearMessages = useCallback(() => {
    cancelStream();
    setMessages([]);
    setError(null);
    threadIdRef.current = null;
  }, [cancelStream]);

  return { messages, isStreaming, error, sendMessage, sendWidgetAction, clearMessages, cancelStream };
}