

(function() {
  'use strict';
  
  
  // Check if we're in Partytown worker context
  const isPartytown = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
  
  // Analytics state
  let analyticsState = {
    sessionId: null,
    userId: null,
    anonymousId: null,
    userIp: null,
    // Fallback only — the real endpoint is injected at runtime via JUPITER_CONFIG
    // (initializeAnalytics), which is fed from NEXT_PUBLIC_JUPITER_HOST. This is a
    // static public asset so it can't read process.env at build time.
    apiEndpoint: 'https://jupiter.tarzanway.com',
    apiKey: '',
    queue: [],
    failedQueue: [],
    batchSize: 10,
    maxQueueSize: 100,
    flushInterval: 5000,
    maxRetries: 3,
    retryDelay: 2000,
    flushTimer: null,
    retryTimer: null,
    scrollThresholds: new Set(),
    isInitialized: false,
    pendingFlush: false,
    // Full href of the last tracked page view — used as the referrer for the
    // next one (document.referrer is stale for SPA navigations).
    lastPageUrl: null,
    // Pathname of the last tracked page view — the page_view dedup key.
    lastPagePath: null,
    stats: {
      eventsSent: 0,
      eventsRetried: 0,
      eventsFailed: 0,
      batchesSent: 0,
      singleEventsSent: 0,
      lastFlushTime: null
    }
  };

  // UUID generation
  const generateUUID = () => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    return Array.from(bytes, (byte, i) => {
      const hex = byte.toString(16).padStart(2, '0');
      return [4, 6, 8, 10].includes(i) ? '-' + hex : hex;
    }).join('');
  };

  // LocalStorage compatibility layer
  const storage = {
    getItem: (key) => {
      try {
        if (isPartytown) {
          // In Partytown, try to access through proxied localStorage
          return localStorage.getItem(key);
        }
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('localStorage access failed:', e);
        return null;
      }
    },
    setItem: (key, value) => {
      try {
        if (isPartytown) {
          localStorage.setItem(key, value);
        } else {
          localStorage.setItem(key, value);
        }
      } catch (e) {
        console.warn('localStorage write failed:', e);
      }
    }
  };

  const getOrCreateAnonymousId = () => {
    try {
      let anonymousId = storage.getItem('jupiter_anonymous_id');
      if (!anonymousId) {
        anonymousId = generateUUID();
        storage.setItem('jupiter_anonymous_id', anonymousId);
      }
      return anonymousId;
    } catch (e) {
      return generateUUID();
    }
  };

  // Session id. Minting a fresh UUID on every page load — which is what this
  // used to do — silently breaks every funnel that groups by session_id: a
  // refresh, a hard navigation or a deep link starts a "new session" mid-flow,
  // so the later steps land under an id that never recorded the earlier ones.
  // Persist it per tab instead, with the standard 30-minute inactivity
  // rollover so a genuinely new visit still gets a new session.
  const SESSION_KEY = 'jupiter_session_id';
  const SESSION_TS_KEY = 'jupiter_session_last_seen';
  const SESSION_IDLE_MS = 30 * 60 * 1000;

  const sessionStore = {
    get: (key) => {
      try {
        return sessionStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    set: (key, value) => {
      try {
        sessionStorage.setItem(key, value);
      } catch (e) {
        /* private mode / quota — fall back to the in-memory id for this load */
      }
    }
  };

  const getOrCreateSessionId = () => {
    const now = Date.now();
    const existing = sessionStore.get(SESSION_KEY);
    const lastSeen = parseInt(sessionStore.get(SESSION_TS_KEY) || '0', 10);

    if (existing && lastSeen && now - lastSeen < SESSION_IDLE_MS) {
      sessionStore.set(SESSION_TS_KEY, String(now));
      return existing;
    }

    const sessionId = generateUUID();
    sessionStore.set(SESSION_KEY, sessionId);
    sessionStore.set(SESSION_TS_KEY, String(now));
    return sessionId;
  };

  // Refresh the idle timestamp on every tracked event so an active session
  // never expires out from under a long flow.
  const touchSession = () => {
    sessionStore.set(SESSION_TS_KEY, String(Date.now()));
  };

  const getCurrentItineraryId = () => {
    try {
      const path = location.pathname;
      const match = path.match(/\/itinerary\/([^\/]+)/);
      return match ? match[1] : undefined;
    } catch (e) {
      return undefined;
    }
  };

  // Device detection
  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    
    let os = 'Unknown';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac OS X')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    let browser = 'Unknown';
    if (ua.includes('Chrome') && !ua.includes('Edge')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('Opera')) browser = 'Opera';

    return { os, browser, ua };
  };

  // Get user IP
  const getUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      analyticsState.userIp = data.ip;
      return data.ip;
    } catch (error) {
      console.warn('Failed to get user IP:', error);
      analyticsState.userIp = 'unknown';
      return 'unknown';
    }
  };

  // Format a Date as an ISO-8601 string in IST (UTC+05:30)
  const toISTString = (date) => {
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
    return new Date(date.getTime() + IST_OFFSET_MS).toISOString().replace('Z', '+05:30');
  };

  // Create event object
  const createEvent = (eventName, properties = {}) => {
    const now = new Date();
    // Anything tracked before initializeAnalytics resolves (a page_view fired
    // straight off window.JupiterAnalytics, an event queued during startup)
    // would otherwise be stamped with a null session_id and be invisible to
    // every session-scoped funnel. Resolve the id lazily instead.
    if (!analyticsState.sessionId) {
      analyticsState.sessionId = getOrCreateSessionId();
    }
    if (!analyticsState.anonymousId) {
      analyticsState.anonymousId = getOrCreateAnonymousId();
    }
    touchSession();
    // Hoist identity fields out of properties so they live only at the top
    // level (like session_id) instead of being duplicated inside properties.
    const { itinerary_id, session_id, referrer, ...restProperties } = properties;
    return {
      event: eventName,
      occurred_at: toISTString(now),
      source: "web",
      user_id: analyticsState.userId,
      user_ip: analyticsState.userIp || 'unknown',
      session_id: session_id || analyticsState.sessionId,
      itinerary_id: itinerary_id || getCurrentItineraryId(),
      page: location.pathname,
      device: getDeviceInfo(),
      properties: {
        ...restProperties,
        page_url: location.href,
        // Prefer an explicitly-provided referrer (e.g. the previous SPA route);
        // document.referrer only reflects the full page load and is stale for
        // client-side navigations.
        referrer: referrer != null ? referrer : (document.referrer || ''),
        timestamp: now.getTime(),
        anonymous_id: analyticsState.anonymousId
      }
    };
  };

  // Main tracking function
  const track = (eventName, properties = {}) => {
    if (!analyticsState.isInitialized) {
      console.warn('Jupiter Analytics not initialized yet, queueing event');
      // Still queue it for when initialization completes
    }

    const event = createEvent(eventName, properties);
    analyticsState.queue.push(event);
    
    
    // Critical events - send immediately
    const criticalEvents = ['payment_attempted', 'booking_confirmed', 'user_login', 'user_logout'];
    
    if (criticalEvents.includes(eventName)) {
      const singleEvent = analyticsState.queue.pop();
      sendSingleEventImmediate(singleEvent);
    } else if (analyticsState.queue.length >= analyticsState.batchSize) {
      flushEvents();
    } else if (analyticsState.queue.length >= analyticsState.maxQueueSize) {
      flushEvents();
    } else {
      scheduleFlush();
    }
    
    return event;
  };

  // Schedule automatic flush
  const scheduleFlush = () => {
    if (analyticsState.flushTimer) return;
    
    analyticsState.flushTimer = setTimeout(() => {
      if (analyticsState.queue.length > 0) {
        flushEvents();
      }
      analyticsState.flushTimer = null;
    }, analyticsState.flushInterval);
  };

  // Send single event immediately
  const sendSingleEventImmediate = async (event) => {
    try {
      
      const response = await fetch(`${analyticsState.apiEndpoint}/v1/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${analyticsState.apiKey}`
        },
        body: JSON.stringify(event),
        // Let the request outlive the page if the tab is closing mid-send.
        keepalive: true
      });

      if (response.ok) {
        analyticsState.stats.singleEventsSent++;
        analyticsState.stats.eventsSent++;
      } else {
        console.error(`❌ Critical event failed: ${response.status}`);
        handleFailedEvent(event, `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ Critical event error:`, error);
      handleFailedEvent(event, error.message);
    }
  };

  // Flush events
  const flushEvents = async () => {
    if (analyticsState.queue.length === 0) return;
    // A flush is already in flight. Don't drop the just-queued events on the
    // floor — reschedule so they go out once the current send settles (e.g.
    // when the queue hits batchSize while a previous batch is still posting).
    if (analyticsState.pendingFlush) {
      scheduleFlush();
      return;
    }

    analyticsState.pendingFlush = true;

    if (analyticsState.flushTimer) {
      clearTimeout(analyticsState.flushTimer);
      analyticsState.flushTimer = null;
    }

    const events = [...analyticsState.queue];
    analyticsState.queue = [];

    try {
      if (events.length === 1) {
        await sendSingleEvent(events[0]);
      } else {
        await sendBatch(events);
      }
    } finally {
      analyticsState.pendingFlush = false;
      analyticsState.stats.lastFlushTime = Date.now();
    }
  };

  // Send single event
  const sendSingleEvent = async (event) => {
    try {
      
      const response = await fetch(`${analyticsState.apiEndpoint}/v1/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${analyticsState.apiKey}`
        },
        body: JSON.stringify(event),
        // Let the request outlive the page if the tab is closing mid-send.
        keepalive: true
      });

      if (response.ok) {
        analyticsState.stats.singleEventsSent++;
        analyticsState.stats.eventsSent++;
      } else {
        const errorText = await response.text();
        console.error(`❌ Single event failed: ${response.status}`, errorText);
        handleFailedEvent(event, `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ Single event error:`, error);
      handleFailedEvent(event, error.message);
    }
  };

  // Send batch
  const sendBatch = async (events) => {
    try {
      
      const response = await fetch(`${analyticsState.apiEndpoint}/v1/events/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${analyticsState.apiKey}`
        },
        body: JSON.stringify(events),
        // Let the batch outlive the page if the tab is closing mid-send.
        keepalive: true
      });

      if (response.ok) {
        analyticsState.stats.batchesSent++;
        analyticsState.stats.eventsSent += events.length;
      } else {
        const errorText = await response.text();
        console.error(`❌ Batch failed: ${response.status}`, errorText);
        events.forEach(event => handleFailedEvent(event, `HTTP ${response.status}`));
      }
    } catch (error) {
      console.error(`❌ Batch error:`, error);
      events.forEach(event => handleFailedEvent(event, error.message));
    }
  };

  // Handle failed event
  const handleFailedEvent = (event, errorMessage) => {
    event.retryCount = (event.retryCount || 0) + 1;
    event.lastError = errorMessage;
    
    if (event.retryCount <= analyticsState.maxRetries) {
      analyticsState.failedQueue.push(event);
      analyticsState.stats.eventsRetried++;
      scheduleRetry();
    } else {
      console.error(`💀 Event ${event.event} permanently failed`);
      analyticsState.stats.eventsFailed++;
    }
  };

  // Schedule retry
  const scheduleRetry = () => {
    if (analyticsState.retryTimer || analyticsState.failedQueue.length === 0) return;
    
    const retryDelay = analyticsState.retryDelay * Math.pow(2, Math.min(3, analyticsState.stats.eventsRetried));
    
    analyticsState.retryTimer = setTimeout(async () => {
      
      const retryEvents = [...analyticsState.failedQueue];
      analyticsState.failedQueue = [];
      
      if (retryEvents.length === 1) {
        await sendSingleEvent(retryEvents[0]);
      } else {
        await sendBatch(retryEvents);
      }
      
      analyticsState.retryTimer = null;
      
      if (analyticsState.failedQueue.length > 0) {
        scheduleRetry();
      }
    }, retryDelay);
  };

  // Initialize
  //
  // Called from two places — the auto-init at the bottom of this file (when
  // JUPITER_CONFIG is already on the page) and JupyterAnalytics.jsx's onLoad
  // retry loop. Re-running it used to re-roll the session id mid-page, so it's
  // idempotent: later calls only top up config that wasn't set the first time.
  const initializeAnalytics = async (config = {}) => {
    if (analyticsState.isInitialized) {
      if (config.apiEndpoint) analyticsState.apiEndpoint = config.apiEndpoint;
      if (config.apiKey) analyticsState.apiKey = config.apiKey;
      if (config.userId) analyticsState.userId = config.userId;
      return;
    }

    analyticsState.sessionId = getOrCreateSessionId();
    analyticsState.anonymousId = getOrCreateAnonymousId();

    if (config.apiEndpoint) analyticsState.apiEndpoint = config.apiEndpoint;
    if (config.apiKey) analyticsState.apiKey = config.apiKey;
    if (config.userId) analyticsState.userId = config.userId;
    if (config.batchSize) analyticsState.batchSize = config.batchSize;
    if (config.flushInterval) analyticsState.flushInterval = config.flushInterval;

    // Mark ready *before* resolving the IP. getUserIP() calls a third-party
    // host (api.ipify.org) that ad blockers routinely block, and blocking
    // `isInitialized` on it meant useAnalytics' readiness poll timed out after
    // 15s and silently dropped every queued event for those users. The IP is
    // enrichment, not a precondition — fill it in when (if) it arrives.
    analyticsState.isInitialized = true;

    getUserIP();


    // track('analytics_initialized', {
    //   version: '1.0.2-partytown',
    //   partytown: isPartytown
    // });
  };

  // Specific tracking functions
  const identifyUser = (userId, traits = {}) => {
    analyticsState.userId = userId;
    return track('user_identified', { user_id: userId, ...traits });
  };

  const trackUserLogin = (userId) => {
    analyticsState.userId = userId;
    return track('user_login', { user_id: userId });
  };

  const trackUserLogout = (userId) => {
    return track('user_logout', { user_id: userId });
  };

  const trackPageView = (page, title, itineraryId = null) => {
    // Exactly one page_view per page. Deduped here rather than at the call
    // sites because there are several, and they overlap:
    //
    //   • _app fires an initial view as soon as this script is available, so
    //     landing pages and deep links are recorded at all;
    //   • _app also fires on every routeChangeComplete — which Next emits for
    //     *shallow* query-only navigations too, so the ad-attribution
    //     router.replace (utm_*, gclid) and each tailored-form slide change
    //     (?slideIndex=0..3) each looked like another page view of the same
    //     page;
    //   • four page components ([continent]/…/[city], [continent]/[country],
    //     and the two /theme pages) additionally call trackPageView in a mount
    //     effect, on top of both of the above.
    //
    // The key is the pathname, not the full href: everything above changes
    // only the query string. A genuine re-visit still logs, because the
    // pathname has to change and change back for that to happen.
    const path = location.pathname;
    if (analyticsState.lastPagePath === path) return null;
    analyticsState.lastPagePath = path;

    analyticsState.scrollThresholds.clear();
    // For SPA navigations document.referrer stays stuck on the original full
    // page load, so use the previous route we tracked as the referrer. Falls
    // back to document.referrer for the first page view of the document.
    const referrer = analyticsState.lastPageUrl || document.referrer || '';
    const result = track('page_view', {
      page_title: title,
      itinerary_id: itineraryId,
      referrer
    });
    analyticsState.lastPageUrl = location.href;
    return result;
  };

  const trackItineraryPageView = (itineraryId, isFirstVisit = false) => {
    return track('itinerary_page_view', {
      itinerary_id: itineraryId,
      first_visit: isFirstVisit
    });
  };

  const trackSwitchItinerary = (fromItineraryId, toItineraryId) => {
    return track('switch_itinerary', {
      from_itinerary_id: fromItineraryId,
      to_itinerary_id: toItineraryId
    });
  };

  const trackPaymentAttempted = (itineraryId, amount, currency, methodMasked, success) => {
    return track('payment_attempted', {
      itinerary_id: itineraryId,
      amount,
      currency,
      method_masked: methodMasked,
      success_bool: success
    });
  };

  const trackBookingConfirmed = (itineraryId, bookingIds, amount, currency) => {
    return track('booking_confirmed', {
      itinerary_id: itineraryId,
      booking_ids: bookingIds,
      amount,
      currency
    });
  };

  const trackCTAClicked = (itineraryId, ctaName, locationOnPage) => {
    return track('cta_clicked', {
      itinerary_id: itineraryId,
      cta_name: ctaName,
      location_on_page: locationOnPage
    });
  };

  const trackBulk = (events) => {
    const trackedEvents = events.map(({ eventName, properties }) => {
      const event = createEvent(eventName, properties);
      analyticsState.queue.push(event);
      return event;
    });
    
    if (analyticsState.queue.length >= analyticsState.batchSize) {
      flushEvents();
    }
    
    return trackedEvents;
  };

  const getState = () => ({
    isInitialized: analyticsState.isInitialized,
    sessionId: analyticsState.sessionId,
    userId: analyticsState.userId,
    anonymousId: analyticsState.anonymousId,
    userIp: analyticsState.userIp,
    queueSize: analyticsState.queue.length,
    failedQueueSize: analyticsState.failedQueue.length,
    stats: { ...analyticsState.stats },
    config: {
      apiEndpoint: analyticsState.apiEndpoint,
      batchSize: analyticsState.batchSize,
      flushInterval: analyticsState.flushInterval
    }
  });

  const forceFlush = () => {
    return flushEvents();
  };

  const cleanup = () => {
    if (analyticsState.flushTimer) clearTimeout(analyticsState.flushTimer);
    if (analyticsState.retryTimer) clearTimeout(analyticsState.retryTimer);
    forceFlush();
  };

  // Best-effort flush when the page is hidden or unloading so queued (and
  // previously-failed, retry-pending) events aren't lost when the tab closes or
  // the user backgrounds it. The keepalive fetches above let these requests
  // complete during unload. Bypasses the pendingFlush/timer machinery — this is
  // a terminal, fire-and-forget drain.
  const flushOnHide = () => {
    if (analyticsState.retryTimer) {
      clearTimeout(analyticsState.retryTimer);
      analyticsState.retryTimer = null;
    }
    // Fold retry-pending events back into the outgoing batch so they go too.
    if (analyticsState.failedQueue.length) {
      analyticsState.queue.push(...analyticsState.failedQueue);
      analyticsState.failedQueue = [];
    }
    if (analyticsState.queue.length === 0) return;

    const events = [...analyticsState.queue];
    analyticsState.queue = [];
    if (analyticsState.flushTimer) {
      clearTimeout(analyticsState.flushTimer);
      analyticsState.flushTimer = null;
    }

    if (events.length === 1) {
      sendSingleEvent(events[0]);
    } else {
      sendBatch(events);
    }
  };

  // Register lifecycle listeners. Partytown proxies these to the real document/
  // window; wrapped in try/catch so a proxy hiccup can't break initialization.
  try {
    if (typeof addEventListener === 'function') {
      addEventListener('visibilitychange', () => {
        if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
          flushOnHide();
        }
      });
      // pagehide is the reliable unload signal on mobile Safari (beforeunload
      // isn't); pairs with keepalive to salvage the final batch.
      addEventListener('pagehide', flushOnHide);
    }
  } catch (e) {
    console.warn('Could not attach analytics lifecycle listeners:', e);
  }

  // Expose API
  const JupiterAnalytics = {
    initializeAnalytics,
    track,
    trackBulk,
    flushEvents: forceFlush,
    identifyUser,
    getState,
    cleanup,
    trackUserLogin,
    trackUserLogout,
    trackPageView,
    trackItineraryPageView,
    trackSwitchItinerary,
    trackPaymentAttempted,
    trackBookingConfirmed,
    trackCTAClicked
  };

  // Expose to global scope (works in both main thread and Partytown)
  if (typeof window !== 'undefined') {
    window.JupiterAnalytics = JupiterAnalytics;
  } else if (typeof self !== 'undefined') {
    self.JupiterAnalytics = JupiterAnalytics;
  }


  // Auto-init if config available
  if (typeof window !== 'undefined' && window.JUPITER_CONFIG) {
    initializeAnalytics(window.JUPITER_CONFIG);
  } else if (typeof self !== 'undefined' && self.JUPITER_CONFIG) {
    initializeAnalytics(self.JUPITER_CONFIG);
  }

})();