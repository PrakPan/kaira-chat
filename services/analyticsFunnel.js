/**
 * Conversion-funnel bookkeeping shared by every surface that reports funnel
 * milestones to Jupiter.
 *
 * Two problems this solves:
 *
 * 1. **Duplicates.** A milestone is reachable from several code paths — a
 *    server effect, a restored-thread widget scan, a button in a different
 *    component. Each stage must be reported at most once per funnel run, and
 *    for the chat the guard has to survive a reload: the thread is resumed
 *    from the URL, so a per-mount `useRef` guard re-fires everything on
 *    refresh.
 *
 * 2. **Non-monotonic funnels.** A later stage was being reported for runs
 *    whose earlier stage never fired — e.g. `chat_itinerary_confirmed` on a
 *    restored thread, where the `display_itinerary` effect that drives
 *    `chat_itinerary_generated` is never replayed. The dashboard then shows
 *    step N with a *higher* count than step N-1, which is impossible for a
 *    funnel. Reaching a stage proves every mandatory stage before it was
 *    reached too, so we back-fill the missing ones instead of leaving holes.
 *    Back-filled events carry `back_filled: true` plus `back_filled_by` so
 *    analysis can separate them from directly-observed ones.
 *
 * Stages listed in `optional` are never back-filled — they are genuinely
 * skippable (an already-authenticated user never sees the login gate), so
 * inferring them from a later stage would fabricate data. Those are emitted
 * explicitly by the caller instead.
 */

export const FUNNELS = {
  // In-chat intake form (destination → when → who → notes), kept as its own
  // funnel rather than prepended to `chat` on purpose: the card is conditional.
  // It appears from the `?intake=1` landing, from the backend's
  // `intake_form_shimmer` / `form_fields` effects, or from an `intake-form:`
  // widget — but a user can also just type at /chat and never see it. Folding
  // it into `chat` would mean either fabricating "form shown" for everyone who
  // typed instead (back-fill on), or reporting more chat starts than form
  // completions (back-fill off) — the exact defect this module exists to stop.
  //
  // Completing this funnel leads directly into `chat_itinerary_started`: the
  // composed form message is sent as the first user message.
  chatIntake: {
    key: "chat_intake",
    stages: [
      "chat_intake_form_shown",
      "chat_intake_destination_completed",
      "chat_intake_when_completed",
      "chat_intake_who_completed",
      "chat_intake_form_completed",
    ],
    optional: [],
  },
  chat: {
    key: "chat",
    stages: [
      "chat_itinerary_started",
      "chat_route_confirmed",
      "chat_itinerary_generated",
      "chat_itinerary_confirmed",
      "chat_price_received",
      "chat_cart_viewed",
    ],
    optional: [],
  },
  // Order must stay in lockstep with the dashboard's FLOW constant. Preferences
  // precede inclusions because the experience preferences are submitted with
  // the route (same /initiate payload) while inclusions are captured on a later
  // screen — reversing the two is what made this funnel read as growing.
  itineraryForm: {
    key: "itinerary_form",
    stages: [
      "itinerary_creation_started",
      "itinerary_initiate_completed",
      "itinerary_route_completed",
      "itinerary_preferences_completed",
      "itinerary_inclusions_completed",
      "user_login_initiated",
      "user_login_completed",
      "itinerary_creation_completed",
    ],
    optional: ["user_login_initiated", "user_login_completed"],
  },
};

// Fallback store for the non-persisted funnels, and a mirror of the persisted
// ones so a sessionStorage failure (Safari private mode, quota) degrades to
// in-memory dedup rather than to no dedup at all.
const memoryStore = new Map();

const storageKey = (funnel, scopeId) =>
  `jupiter_funnel_${funnel.key}_${scopeId || "default"}`;

const readFired = (funnel, scopeId, persist) => {
  const key = storageKey(funnel, scopeId);
  if (persist && typeof window !== "undefined") {
    try {
      const raw = window.sessionStorage.getItem(key);
      if (raw) return new Set(JSON.parse(raw));
    } catch (e) {
      /* fall through to the in-memory mirror */
    }
  }
  return new Set(memoryStore.get(key) || []);
};

const writeFired = (funnel, scopeId, persist, fired) => {
  const key = storageKey(funnel, scopeId);
  memoryStore.set(key, new Set(fired));
  if (!persist || typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify([...fired]));
  } catch (e) {
    /* in-memory mirror above still dedups for this page view */
  }
};

/**
 * Report that `stage` of `funnel` has been reached.
 *
 * Emits nothing if the stage already fired for this run. Otherwise emits every
 * mandatory earlier stage that hasn't fired yet (marked `back_filled`), then
 * the stage itself. Returns the list of event names actually emitted, so
 * callers can log/assert in development.
 *
 * @param funnel      one of FUNNELS
 * @param stage       stage name (must appear in funnel.stages)
 * @param options.scopeId    identifies one run of the funnel (chat session id,
 *                           form run id). Runs with different scopes are
 *                           tracked independently.
 * @param options.persist    mirror the guard into sessionStorage so a reload
 *                           doesn't re-fire the whole funnel. Use for flows
 *                           that survive a refresh (chat); leave off for flows
 *                           that restart from scratch (the tailored form).
 * @param options.emit       (eventName, properties) => void — does the actual
 *                           track call.
 * @param options.properties extra properties for the stage event itself.
 */
export const reportFunnelStage = (funnel, stage, options = {}) => {
  const { scopeId, persist = false, emit, properties = {} } = options;
  if (typeof emit !== "function") return [];

  const index = funnel.stages.indexOf(stage);
  if (index === -1) {
    console.warn(`[analyticsFunnel] unknown stage "${stage}" for ${funnel.key}`);
    return [];
  }

  const fired = readFired(funnel, scopeId, persist);
  if (fired.has(stage)) return [];

  const optional = new Set(funnel.optional || []);
  const emitted = [];

  for (let i = 0; i < index; i += 1) {
    const earlier = funnel.stages[i];
    if (fired.has(earlier) || optional.has(earlier)) continue;
    fired.add(earlier);
    emitted.push(earlier);
  }
  fired.add(stage);

  // Persist the whole set before emitting so a mid-loop throw in `emit` can't
  // leave the guard open and let the batch fire twice.
  writeFired(funnel, scopeId, persist, fired);

  emitted.forEach((earlier) =>
    emit(earlier, { back_filled: true, back_filled_by: stage }),
  );
  emit(stage, properties);
  emitted.push(stage);

  return emitted;
};

export const hasFiredFunnelStage = (funnel, stage, { scopeId, persist } = {}) =>
  readFired(funnel, scopeId, persist).has(stage);

/** Drop a run's guard — used when a flow genuinely restarts. */
export const resetFunnelRun = (funnel, { scopeId, persist } = {}) => {
  const key = storageKey(funnel, scopeId);
  memoryStore.delete(key);
  if (!persist || typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(key);
  } catch (e) {
    /* nothing else to do */
  }
};

// ── Chat funnel scope ──────────────────────────────────────────────────────
// The chat funnel is reported from two components (ChatKitPanel and BotApp),
// so the scope can't live in either one's state. It is derived from the
// `/chat/<id>` URL segment, which both see, and is rebindable because the id
// only appears after the first message (ChatKitPanel pushes it via
// history.pushState once the thread is confirmed).

let chatFunnelScope = null;
// The pathname `chatFunnelScope` was resolved for. A fresh `/chat` visit after
// a real session means a new conversation, and must not inherit its funnel.
let chatFunnelScopePath = null;

const currentPath = () =>
  typeof window === "undefined" ? "" : window.location.pathname;

const scopeFromUrl = () => {
  const match = currentPath().match(/\/chat\/([^/?#]+)/);
  return match ? match[1] : null;
};

export const getChatFunnelScope = () => {
  const path = currentPath();
  // The URL is authoritative once it carries an id — that's what makes
  // ChatKitPanel and BotApp agree, and what keeps a reload of the same thread
  // on the same run.
  const fromUrl = scopeFromUrl();
  if (fromUrl) {
    chatFunnelScope = fromUrl;
    chatFunnelScopePath = path;
    return fromUrl;
  }
  // No id in the URL. Reuse the scope already resolved for this same path —
  // that covers both a brand-new chat before its id exists and an explicit
  // bind that landed before the URL caught up.
  if (chatFunnelScope && chatFunnelScopePath === path) return chatFunnelScope;
  // Different path with no id: a fresh /chat visit. Give it its own run so a
  // second conversation in the same tab doesn't inherit the first's stages.
  chatFunnelScope = `pending-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  chatFunnelScopePath = path;
  return chatFunnelScope;
};

/**
 * Point the chat funnel at its real session id, carrying over anything already
 * recorded under the placeholder scope. Without the carry-over the stages
 * fired before the id existed (`chat_itinerary_started`) would look un-fired
 * and get back-filled a second time.
 */
export const bindChatFunnelScope = (scopeId) => {
  if (!scopeId) return;

  // Read the outgoing scope from the module state, NOT via
  // getChatFunnelScope(): callers bind right after pushState has already put
  // the id in the URL, so re-deriving here would return the *new* id, skip the
  // migration, and let the pre-id stages be back-filled a second time.
  const previous = chatFunnelScope;
  chatFunnelScope = scopeId;
  chatFunnelScopePath = currentPath();
  if (!previous || previous === scopeId) return;

  const carried = readFired(FUNNELS.chat, previous, true);
  if (carried.size) {
    const merged = readFired(FUNNELS.chat, scopeId, true);
    carried.forEach((s) => merged.add(s));
    writeFired(FUNNELS.chat, scopeId, true, merged);
  }
  resetFunnelRun(FUNNELS.chat, { scopeId: previous, persist: true });
};
