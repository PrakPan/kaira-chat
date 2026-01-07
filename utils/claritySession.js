
export function createSessionId() {
  const timestamp = Date.now();
  const randomId = crypto.randomUUID();
  return `sess_${timestamp}_${randomId}`;
}

export const SESSION_ID = createSessionId();


export function initClaritySession() {
  if (typeof window === "undefined") return;

  const maxAttempts = 50; // 5 seconds max wait
  let attempts = 0;

  const interval = setInterval(() => {
    attempts++;

    if (window.clarity) {
      window.clarity("set", "session_id", SESSION_ID);
      
      if (process.env.NODE_ENV) {
        window.clarity("set", "environment", process.env.NODE_ENV);
      }

      console.log(`[Clarity] Session ID set: ${SESSION_ID}`);
      clearInterval(interval);
    } else if (attempts >= maxAttempts) {
      console.warn("[Clarity] Timeout waiting for Clarity to load");
      clearInterval(interval);
    }
  }, 100);
}

export function getSessionId() {
  return SESSION_ID;
}


export function trackClarityEvent(eventName, metadata = {}) {
  if (typeof window === "undefined" || !window.clarity) return;

  window.clarity("set", eventName, JSON.stringify({
    ...metadata,
    session_id: SESSION_ID,
    timestamp: new Date().toISOString()
  }));
}