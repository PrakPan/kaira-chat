// Get Jupiter Analytics session ID
export function getJupiterSessionId() {
  if (typeof window === "undefined") return null;
  
  try {
    // Try to get session ID from Jupiter Analytics
    if (window.JupiterAnalytics && typeof window.JupiterAnalytics.getState === 'function') {
      const state = window.JupiterAnalytics.getState();
      if (state && state.sessionId) {
        return state.sessionId;
      }
    }
  } catch (error) {
    console.warn('[Session] Error getting Jupiter session ID:', error);
  }
  
  return null;
}

export function waitForJupiterSession(callback, timeout = 10000) {
  if (typeof window === "undefined") return;

  const startTime = Date.now();
  
  const checkInterval = setInterval(() => {
    const sessionId = getJupiterSessionId();
    
    if (sessionId) {
      clearInterval(checkInterval);
      callback(sessionId);
    } else if (Date.now() - startTime > timeout) {
      console.warn('[Session] Timeout waiting for Jupiter session ID');
      clearInterval(checkInterval);
      const fallbackId = `sess_${Date.now()}_${crypto.randomUUID()}`;
      callback(fallbackId);
    }
  }, 100);
}


// Clarity writes its own identifiers into first-party cookies once a recording
// actually starts: `_clck` holds the user id, `_clsk` holds the session id
// (both in the form "<id>|<...>"). Reading these is the only reliable signal
// that Clarity is really recording — `typeof window.clarity === "function"` is
// true as soon as the Partytown forward stub is installed, well before the
// worker has booted the real clarity.js and begun a session.
export function getClarityIds() {
  if (typeof document === "undefined") return { userId: null, sessionId: null };

  const read = (name) => {
    const match = document.cookie.match(
      new RegExp("(?:^|; )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[1]) : null;
  };

  // Clarity delimits these cookies with "^" (older builds used "|"); the id is
  // the first segment, the rest is version/timestamp/counters/endpoint.
  //   _clck: "<userId>^<version>^..."
  //   _clsk: "<sessionId>^<timestamp>^<pageCount>^<sequence>^<uploadHost>"
  const firstSegment = (value) => (value ? value.split(/[\^|]/)[0] : null);

  return {
    userId: firstSegment(read("_clck")),
    sessionId: firstSegment(read("_clsk")),
  };
}

// Links a Jupiter session to its Clarity recording. `track` is Jupiter's event
// tracker (from useAnalytics) — passing it lets us store Clarity's own ids as a
// Jupiter event, which is the deterministic Jupiter -> Clarity link. Filtering
// Clarity by the `session_id` custom tag is best-effort on top of that
// (subject to Clarity sampling, processing delay, and high-cardinality filter
// limits), so we set the tag too but don't rely on it alone.
export function initClaritySession(track) {
  if (typeof window === "undefined") return;

  waitForJupiterSession((jupiterSessionId) => {
    console.log(`[Session] Jupiter session ID obtained: ${jupiterSessionId}`);

    // Wait until Clarity has actually started a recording (its session cookie
    // exists), not merely until the forward stub is present.
    const maxAttempts = 100; // 10 seconds max wait
    let attempts = 0;

    const applyTags = () => {
      // Filterable custom tag — this is the dashboard lookup path
      // (Filters -> Custom tags -> session_id). We deliberately do NOT call
      // clarity("identify", ...): under Partytown its Promise-based flow throws
      // "Cannot create property '__clrSId' on string", and its custom-id is
      // hashed (not reliably filterable) so it adds no value here.
      window.clarity("set", "session_id", jupiterSessionId);
      if (process.env.NODE_ENV) {
        window.clarity("set", "environment", process.env.NODE_ENV);
      }
    };

    const interval = setInterval(() => {
      attempts++;

      const clarityReady = typeof window.clarity === "function";
      const { userId, sessionId } = getClarityIds();

      if (clarityReady && sessionId) {
        try {
          applyTags();
        } catch (error) {
          console.warn("[Clarity] Failed to set session tags:", error);
        }

        // Deterministic link: record Clarity's own ids against the Jupiter
        // session so you can jump straight to the recording from Jupiter.
        if (typeof track === "function") {
          try {
            track("clarity_session_linked", {
              jupiter_session_id: jupiterSessionId,
              clarity_user_id: userId,
              clarity_session_id: sessionId,
            });
          } catch (error) {
            console.warn("[Clarity] Failed to emit clarity_session_linked:", error);
          }
        }

        console.log(
          `[Clarity] Linked Jupiter session ${jupiterSessionId} -> Clarity session ${sessionId}`
        );
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        console.warn("[Clarity] Timeout waiting for Clarity recording to start");
        // Best effort: still set the tag even if the cookie never surfaced
        // (e.g. Partytown cookie-sync lag), so filtering has a chance to work.
        if (clarityReady) {
          try {
            applyTags();
          } catch (error) {
            console.warn("[Clarity] Best-effort tag set failed:", error);
          }
        }
        clearInterval(interval);
      }
    }, 100);
  });
}


export function getSessionId() {
  return getJupiterSessionId();
}


export function trackClarityEvent(eventName, metadata = {}) {
  if (typeof window === "undefined" || !window.clarity) return;

  const sessionId = getJupiterSessionId();
  
  window.clarity("set", eventName, JSON.stringify({
    ...metadata,
    session_id: sessionId,
    timestamp: new Date().toISOString()
  }));
}

export function syncSessionToClarity() {
  if (typeof window === "undefined") return;

  const sessionId = getJupiterSessionId();
  
  if (sessionId && window.clarity) {
    window.clarity("set", "session_id", sessionId);
    console.log(`[Clarity] Session ID synced: ${sessionId}`);
  }
}