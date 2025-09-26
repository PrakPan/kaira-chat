// ================================================================
// COMPLETE public/jupiter-analytics.js
// Integrates with your specific API endpoints and includes IP detection
// ================================================================

(function() {
  'use strict';
  
  console.log('🚀 Jupiter Analytics loading in web worker...');
  
  // Analytics state
  let analyticsState = {
    sessionId: null,
    userId: null,
    anonymousId: null,
    userIp: null,
    apiEndpoint: 'https://dev.jupiter.tarzanway.com', // Will be configured
    apiKey: '',
    queue: [],
    failedQueue: [],
    batchSize: 10,
    maxQueueSize: 100,
    flushInterval: 5000,
    maxRetries: 3,
    retryDelay: 2000,
    heartbeatInterval: null,
    flushTimer: null,
    retryTimer: null,
    visibilityStartTime: Date.now(),
    scrollThresholds: new Set(),
    pageStartTime: Date.now(),
    isInitialized: false,
    stats: {
      eventsSent: 0,
      eventsRetried: 0,
      eventsFailed: 0,
      batchesSent: 0,
      lastFlushTime: null
    }
  };

  // UUID generation for web workers
  const generateUUID = () => {
    return 'xxxx-xxxx-4xxx-yxxx-xxxx-xxxx-xxxx-xxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const getOrCreateAnonymousId = () => {
    try {
      let anonymousId = localStorage.getItem('jupiter_anonymous_id');
      if (!anonymousId) {
        anonymousId = generateUUID();
        localStorage.setItem('jupiter_anonymous_id', anonymousId);
      }
      return anonymousId;
    } catch (e) {
      return generateUUID();
    }
  };

  const getCurrentItineraryId = () => {
    const path = location.pathname;
    const match = path.match(/\/itinerary\/([^\/]+)/);
    return match ? match[1] : undefined;
  };

  // Device detection
  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    
    // Detect OS
    let os = 'Unknown';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac OS X')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    // Detect Browser
    let browser = 'Unknown';
    if (ua.includes('Chrome') && !ua.includes('Edge')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('Opera')) browser = 'Opera';

    return {
      os,
      browser,
      ua: ua
    };
  };

  // Get user IP using ipify
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

  // Create event object in your API format
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
        // Additional context
        page_url: location.href,
        referrer: document.referrer,
        timestamp: now.getTime(),
        anonymous_id: analyticsState.anonymousId
      }
    };
  };

  // Main tracking function
  const track = (eventName, properties = {}) => {
    if (!analyticsState.isInitialized) {
      console.warn('Jupiter Analytics not initialized yet');
      return null;
    }

    const event = createEvent(eventName, properties);
    analyticsState.queue.push(event);
    
    console.log(`📊 Queued: ${eventName} (Queue: ${analyticsState.queue.length})`);
    
    // Immediate flush for critical events
    const criticalEvents = ['payment_attempted', 'booking_confirmed', 'user_login', 'user_logout'];
    const shouldFlushNow = criticalEvents.includes(eventName);
    
    if (shouldFlushNow) {
      console.log(`🚨 Critical event ${eventName}, flushing immediately`);
      flushEvents();
    } else if (analyticsState.queue.length >= analyticsState.batchSize) {
      console.log(`📦 Batch size reached (${analyticsState.batchSize}), flushing...`);
      flushEvents();
    } else if (analyticsState.queue.length >= analyticsState.maxQueueSize) {
      console.log(`⚠️ Max queue size reached (${analyticsState.maxQueueSize}), forcing flush!`);
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
        console.log(`⏰ Auto-flush triggered (${analyticsState.queue.length} events)`);
        flushEvents();
      }
      analyticsState.flushTimer = null;
    }, analyticsState.flushInterval);
  };

  // Enhanced flush with single/batch API logic
  const flushEvents = async () => {
    if (analyticsState.queue.length === 0) return;

    // Clear flush timer
    if (analyticsState.flushTimer) {
      clearTimeout(analyticsState.flushTimer);
      analyticsState.flushTimer = null;
    }

    // Take all events from queue
    const events = [...analyticsState.queue];
    analyticsState.queue = [];

    console.log(`📤 Flushing ${events.length} events`);

    if (events.length === 1) {
      // Send single event
      await sendSingleEvent(events[0]);
    } else {
      // Create batches and send
      const batches = createBatches(events, analyticsState.batchSize);
      batches.forEach((batch, index) => {
        sendBatch(batch, index + 1);
      });
    }

    analyticsState.stats.lastFlushTime = Date.now();
  };

  // Send single event to /v1/events
  const sendSingleEvent = async (event) => {
    try {
      console.log(`📤 Sending single event: ${event.event}`);
      
      fetch(`${analyticsState.apiEndpoint}/v1/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${analyticsState.apiKey}`
        },
        body: JSON.stringify(event)
      }).then(response => {
        if (response.ok) {
          console.log(`✅ Single event sent: ${event.event}`);
          analyticsState.stats.eventsSent++;
        } else {
          console.error(`❌ Single event failed: ${response.status}`);
          handleFailedEvent(event, `HTTP ${response.status}`);
        }
      }).catch(error => {
        console.error(`❌ Single event network error:`, error);
        handleFailedEvent(event, error.message);
      });

    } catch (error) {
      console.error(`❌ Single event send error:`, error);
      handleFailedEvent(event, error.message);
    }
  };

  // Create batches from events
  const createBatches = (events, batchSize) => {
    const batches = [];
    for (let i = 0; i < events.length; i += batchSize) {
      batches.push(events.slice(i, i + batchSize));
    }
    return batches;
  };

  // Send batch to /v1/events/batch
  const sendBatch = async (batch, batchNumber) => {
    try {
      console.log(`📦 Sending batch ${batchNumber} (${batch.length} events)`);
      
      fetch(`${analyticsState.apiEndpoint}/v1/events/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${analyticsState.apiKey}`
        },
        body: JSON.stringify(batch)
      }).then(response => {
        if (response.ok) {
          console.log(`✅ Batch ${batchNumber} sent successfully (${batch.length} events)`);
          analyticsState.stats.batchesSent++;
          analyticsState.stats.eventsSent += batch.length;
        } else {
          console.error(`❌ Batch ${batchNumber} failed: ${response.status}`);
          handleFailedBatch(batch, `HTTP ${response.status}`);
        }
      }).catch(error => {
        console.error(`❌ Batch ${batchNumber} network error:`, error);
        handleFailedBatch(batch, error.message);
      });

    } catch (error) {
      console.error(`❌ Batch ${batchNumber} send error:`, error);
      handleFailedBatch(batch, error.message);
    }
  };

  // Handle failed single event
  const handleFailedEvent = (event, errorMessage) => {
    event.retryCount = (event.retryCount || 0) + 1;
    event.lastError = errorMessage;
    
    if (event.retryCount <= analyticsState.maxRetries) {
      analyticsState.failedQueue.push(event);
      analyticsState.stats.eventsRetried++;
    } else {
      console.error(`💀 Event ${event.event} permanently failed after ${analyticsState.maxRetries} retries`);
      analyticsState.stats.eventsFailed++;
    }
    
    scheduleRetry();
  };

  // Handle failed batch
  const handleFailedBatch = (batch, errorMessage) => {
    batch.forEach(event => handleFailedEvent(event, errorMessage));
  };

  // Schedule retry for failed events
  const scheduleRetry = () => {
    if (analyticsState.retryTimer || analyticsState.failedQueue.length === 0) return;
    
    const retryDelay = analyticsState.retryDelay * Math.pow(2, Math.min(3, analyticsState.stats.eventsRetried));
    
    analyticsState.retryTimer = setTimeout(async () => {
      console.log(`🔄 Retrying ${analyticsState.failedQueue.length} failed events...`);
      
      const retryEvents = [...analyticsState.failedQueue];
      analyticsState.failedQueue = [];
      
      if (retryEvents.length === 1) {
        await sendSingleEvent(retryEvents[0]);
      } else {
        const retryBatches = createBatches(retryEvents, analyticsState.batchSize);
        retryBatches.forEach((batch, index) => {
          sendBatch(batch, `R${index + 1}`);
        });
      }
      
      analyticsState.retryTimer = null;
    }, retryDelay);
  };

  // Initialize analytics
  const initializeAnalytics = async (config = {}) => {
    console.log('🔧 Initializing Jupiter Analytics...', config);
    
    analyticsState.sessionId = generateUUID();
    analyticsState.anonymousId = getOrCreateAnonymousId();
    
    // Configure endpoints
    if (config.apiEndpoint) analyticsState.apiEndpoint = config.apiEndpoint;
    if (config.apiKey) analyticsState.apiKey = config.apiKey;
    if (config.userId) analyticsState.userId = config.userId;
    if (config.batchSize) analyticsState.batchSize = config.batchSize;
    if (config.flushInterval) analyticsState.flushInterval = config.flushInterval;
    
    // Get user IP
    await getUserIP();
    
    // Initialize client-side tracking
    initializeClientSideTracking();
    
    analyticsState.isInitialized = true;
    
    console.log('✅ Jupiter Analytics initialized:', {
      sessionId: analyticsState.sessionId,
      anonymousId: analyticsState.anonymousId,
      userIp: analyticsState.userIp,
      apiEndpoint: analyticsState.apiEndpoint,
      batchSize: analyticsState.batchSize
    });

    // Track initialization
    track('analytics_initialized', {
      version: '1.0.0',
      user_agent: navigator.userAgent
    });
  };

  // Initialize client-side tracking
  const initializeClientSideTracking = () => {
    // Page view on load
    track('page_view', {
      page_title: document.title,
      page_url: location.href,
      referrer: document.referrer
    });

    // Visibility change
    document.addEventListener('visibilitychange', () => {
      track('visibility_change', {
        visibility: document.hidden ? 'hidden' : 'visible'
      });
    });

    // Session heartbeat
    analyticsState.heartbeatInterval = setInterval(() => {
      if (!document.hidden) {
        const now = Date.now();
        track('session_heartbeat', {
          active_ms_since_last: now - analyticsState.visibilityStartTime,
          focused: document.hasFocus(),
          queue_size: analyticsState.queue.length
        });
        analyticsState.visibilityStartTime = now;
      }
    }, 15000);

    // Scroll depth tracking
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPercent = Math.round(
            (scrollY / (document.body.scrollHeight - innerHeight)) * 100
          );
          
          [25, 50, 75, 100].forEach(threshold => {
            if (scrollPercent >= threshold && !analyticsState.scrollThresholds.has(threshold)) {
              analyticsState.scrollThresholds.add(threshold);
              track('scroll_depth', {
                percent: threshold,
                y_offset: scrollY
              });
            }
          });
          
          ticking = false;
        });
        ticking = true;
      }
    };
    
    addEventListener('scroll', handleScroll, { passive: true });

    // Page unload - use beacon for critical events
    addEventListener('beforeunload', () => {
      if (analyticsState.queue.length > 0) {
        const criticalEvents = analyticsState.queue.filter(event => 
          ['payment_attempted', 'booking_confirmed', 'user_login'].includes(event.event)
        );
        
        if (criticalEvents.length > 0) {
          try {
            const payload = criticalEvents.length === 1 
              ? criticalEvents[0]
              : criticalEvents;
            
            const endpoint = criticalEvents.length === 1 
              ? `${analyticsState.apiEndpoint}/v1/events`
              : `${analyticsState.apiEndpoint}/v1/events/batch`;
            
            navigator.sendBeacon(endpoint, JSON.stringify(payload));
          } catch (e) {
            console.error('Failed to send beacon:', e);
          }
        }
      }
    });
  };

  // Specific tracking functions matching your event list
  const identifyUser = (userId, traits = {}) => {
    analyticsState.userId = userId;
    return track('user_identified', { user_id: userId, ...traits });
  };

  const trackUserLogin = (userId) => {
    analyticsState.userId = userId;
    return track('user_login', {
      user_id: userId
    });
  };

  const trackUserLogout = (userId) => {
    return track('user_logout', {
      user_id: userId
    });
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

  const trackHotelCardClicked = (itineraryId, hotelId, actionSource) => {
    return track('hotel_card_clicked', {
      itinerary_id: itineraryId,
      hotel_id: hotelId,
      action_source: actionSource
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

  // Bulk tracking
  const trackBulk = (events) => {
    console.log(`📦 Bulk tracking ${events.length} events`);
    
    const trackedEvents = events.map(({ eventName, properties }) => {
      const event = createEvent(eventName, properties);
      analyticsState.queue.push(event);
      return event;
    });
    
    console.log(`📊 Bulk queued: ${events.length} events (Queue: ${analyticsState.queue.length})`);
    
    // Force flush for bulk operations
    if (analyticsState.queue.length >= analyticsState.batchSize) {
      flushEvents();
    }
    
    return trackedEvents;
  };

  // Get current state
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
      flushInterval: analyticsState.flushInterval,
      maxRetries: analyticsState.maxRetries
    }
  });

  // Manual flush
  const forceFlush = () => {
    console.log('🔧 Manual flush triggered');
    return flushEvents();
  };

  // Cleanup
  const cleanup = () => {
    if (analyticsState.heartbeatInterval) {
      clearInterval(analyticsState.heartbeatInterval);
    }
    if (analyticsState.flushTimer) {
      clearTimeout(analyticsState.flushTimer);
    }
    if (analyticsState.retryTimer) {
      clearTimeout(analyticsState.retryTimer);
    }
    forceFlush();
  };

  // Expose all functions globally for Partytown
  self.JupiterAnalytics = {
    // Core functions
    initializeAnalytics,
    track,
    trackBulk,
    flushEvents: forceFlush,
    identifyUser,
    getState,
    cleanup,
    
    // Specific tracking functions
    trackUserLogin,
    trackUserLogout,
    trackPageView,
    trackItineraryPageView,
    trackSwitchItinerary,
    trackHotelCardClicked,
    trackPaymentAttempted,
    trackBookingConfirmed,
    trackCTAClicked
  };

  // Auto-initialize if config is available
  if (self.JUPITER_CONFIG) {
    initializeAnalytics(self.JUPITER_CONFIG);
  }

  console.log('✅ Jupiter Analytics script loaded and ready');

})();

