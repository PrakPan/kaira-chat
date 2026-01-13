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


export function initClaritySession() {
  if (typeof window === "undefined") return;

  waitForJupiterSession((jupiterSessionId) => {
    console.log(`[Session] Jupiter session ID obtained: ${jupiterSessionId}`);
    
    // Now wait for Clarity to be ready
    const maxAttempts = 50; // 5 seconds max wait
    let attempts = 0;

    const interval = setInterval(() => {
      attempts++;

      if (window.clarity) {
        window.clarity("set", "session_id", jupiterSessionId);
        // window.clarity("set", "jupiter_session_id", jupiterSessionId);
        
        if (process.env.NODE_ENV) {
          window.clarity("set", "environment", process.env.NODE_ENV);
        }

        // console.log(`[Clarity] Session ID synchronized with Jupiter: ${jupiterSessionId}`);
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        console.warn("[Clarity] Timeout waiting for Clarity to load");
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