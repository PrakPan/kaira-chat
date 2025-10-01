

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

  // Create event object
  const createEvent = (eventName, properties = {}) => {
    const now = new Date();
    return {
      event: eventName,
      occurred_at: now.toISOString(),
      source: "web",
      user_id: analyticsState.userId,
      user_ip: analyticsState.userIp || 'unknown',
      session_id: analyticsState.sessionId,
      itinerary_id: properties.itinerary_id || getCurrentItineraryId(),
      page: location.pathname,
      device: getDeviceInfo(),
      properties: {
        ...properties,
        page_url: location.href,
        referrer: document.referrer || '',
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
        body: JSON.stringify(event)
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
    if (analyticsState.queue.length === 0 || analyticsState.pendingFlush) return;

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
        body: JSON.stringify(event)
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
        body: JSON.stringify(events)
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
  const initializeAnalytics = async (config = {}) => {
    
    analyticsState.sessionId = generateUUID();
    analyticsState.anonymousId = getOrCreateAnonymousId();
    
    if (config.apiEndpoint) analyticsState.apiEndpoint = config.apiEndpoint;
    if (config.apiKey) analyticsState.apiKey = config.apiKey;
    if (config.userId) analyticsState.userId = config.userId;
    if (config.batchSize) analyticsState.batchSize = config.batchSize;
    if (config.flushInterval) analyticsState.flushInterval = config.flushInterval;
    
    await getUserIP();
    
    analyticsState.isInitialized = true;
    

    track('analytics_initialized', {
      version: '1.0.2-partytown',
      partytown: isPartytown
    });
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
    analyticsState.scrollThresholds.clear();
    return track('page_view', {
      page_title: title,
      itinerary_id: itineraryId
    });
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