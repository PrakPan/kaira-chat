(function() {
  'use strict';
  
  console.log('🚀 Jupiter Analytics loading in web worker...');
  
  // Analytics state
  let analyticsState = {
    sessionId: null,
    userId: null,
    anonymousId: null,
    apiEndpoint: '/api/jupiter-analytics/track',
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
    sectionTimers: new Map(),
    scrollThresholds: new Set(),
    pageStartTime: Date.now(),
    stats: {
      eventsSent: 0,
      eventsRetried: 0,
      eventsFailed: 0,
      batchesSent: 0,
      lastFlushTime: null
    }
  };

  // UUID generation
  const generateUUID = () => {
    return 'xxxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function(c) {
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

  // Create event object
  const createEvent = (eventName, properties = {}) => {
    return {
      id: generateUUID(),
      event: eventName,
      timestamp: Date.now(),
      retryCount: 0,
      properties: {
        ...properties,
        session_id: analyticsState.sessionId,
        user_id: analyticsState.userId,
        anonymous_id: analyticsState.anonymousId,
        page_url: location.href,
        user_agent: navigator.userAgent
      }
    };
  };

  // Main tracking function
  const track = (eventName, properties = {}) => {
    const event = createEvent(eventName, properties);
    analyticsState.queue.push(event);
    
    console.log(`📊 Queued: ${eventName} (Queue: ${analyticsState.queue.length})`);
    
    const shouldFlushNow = ['payment_attempted', 'booking_confirmed', 'user_login', 'user_logout'].includes(eventName);
    
    if (shouldFlushNow || analyticsState.queue.length >= analyticsState.batchSize) {
      flushEvents();
    } else {
      scheduleFlush();
    }
    
    return event.id;
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

  // Flush events in batches
  const flushEvents = async () => {
    if (analyticsState.queue.length === 0) return;

    if (analyticsState.flushTimer) {
      clearTimeout(analyticsState.flushTimer);
      analyticsState.flushTimer = null;
    }

    const batches = createBatches(analyticsState.queue, analyticsState.batchSize);
    analyticsState.queue = [];

    console.log(`📤 Flushing ${batches.length} batch(es)`);

    batches.forEach((batch, index) => {
      sendBatch(batch, index + 1);
    });

    analyticsState.stats.lastFlushTime = Date.now();
  };

  // Create batches
  const createBatches = (events, batchSize) => {
    const batches = [];
    for (let i = 0; i < events.length; i += batchSize) {
      batches.push(events.slice(i, i + batchSize));
    }
    return batches;
  };

  // Send batch (fire-and-forget)
  const sendBatch = async (batch, batchNumber) => {
    const batchId = generateUUID();
    
    try {
      fetch(analyticsState.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${analyticsState.apiKey}`,
          'X-Batch-ID': batchId,
          'X-Batch-Size': batch.length.toString()
        },
        body: JSON.stringify({ 
          events: batch,
          batch_id: batchId,
          timestamp: Date.now()
        })
      }).then(response => {
        if (response.ok) {
          console.log(`✅ Batch ${batchNumber} sent successfully`);
          analyticsState.stats.batchesSent++;
          analyticsState.stats.eventsSent += batch.length;
        } else {
          console.error(`❌ Batch ${batchNumber} failed:`, response.status);
          handleFailedBatch(batch, `HTTP ${response.status}`);
        }
      }).catch(error => {
        console.error(`❌ Batch ${batchNumber} network error:`, error.message);
        handleFailedBatch(batch, error.message);
      });
      
    } catch (error) {
      console.error(`❌ Batch ${batchNumber} send error:`, error);
      handleFailedBatch(batch, error.message);
    }
  };

  // Handle failed batches
  const handleFailedBatch = (batch, errorMessage) => {
    batch.forEach(event => {
      event.retryCount = (event.retryCount || 0) + 1;
      event.lastError = errorMessage;
      
      if (event.retryCount <= analyticsState.maxRetries) {
        analyticsState.failedQueue.push(event);
        analyticsState.stats.eventsRetried++;
      } else {
        console.error(`💀 Event ${event.event} permanently failed`);
        analyticsState.stats.eventsFailed++;
      }
    });
    
    scheduleRetry();
  };

  // Schedule retry
  const scheduleRetry = () => {
    if (analyticsState.retryTimer || analyticsState.failedQueue.length === 0) return;
    
    const retryDelay = analyticsState.retryDelay * Math.pow(2, Math.min(3, analyticsState.stats.eventsRetried));
    
    analyticsState.retryTimer = setTimeout(() => {
      console.log(`🔄 Retrying ${analyticsState.failedQueue.length} failed events...`);
      
      const retryBatches = createBatches(analyticsState.failedQueue, analyticsState.batchSize);
      analyticsState.failedQueue = [];
      
      retryBatches.forEach((batch, index) => {
        sendBatch(batch, `R${index + 1}`);
      });
      
      analyticsState.retryTimer = null;
    }, retryDelay);
  };

  // Initialize analytics
  const initializeAnalytics = (config = {}) => {
    analyticsState.sessionId = generateUUID();
    analyticsState.anonymousId = getOrCreateAnonymousId();
    
    if (config.apiEndpoint) analyticsState.apiEndpoint = config.apiEndpoint;
    if (config.apiKey) analyticsState.apiKey = config.apiKey;
    if (config.userId) analyticsState.userId = config.userId;
    if (config.batchSize) analyticsState.batchSize = config.batchSize;
    if (config.flushInterval) analyticsState.flushInterval = config.flushInterval;
    
    initializeClientSideTracking();
    
    console.log('🚀 Jupiter Analytics initialized:', {
      sessionId: analyticsState.sessionId,
      batchSize: analyticsState.batchSize,
      flushInterval: analyticsState.flushInterval
    });
  };

  // Initialize client-side tracking
  const initializeClientSideTracking = () => {
    // Visibility change
    document.addEventListener('visibilitychange', () => {
      track('visibility_change', {
        visibility: document.hidden ? 'hidden' : 'visible'
      });
    });

    // Heartbeat
    analyticsState.heartbeatInterval = setInterval(() => {
      if (!document.hidden) {
        const now = Date.now();
        track('session_heartbeat', {
          active_ms_since_last: now - analyticsState.visibilityStartTime,
          focused: document.hasFocus(),
          itinerary_id: getCurrentItineraryId()
        });
        analyticsState.visibilityStartTime = now;
      }
    }, 15000);

    // Scroll tracking
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
                itinerary_id: getCurrentItineraryId(),
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

    // Page unload
    addEventListener('beforeunload', () => {
      if (analyticsState.queue.length > 0) {
        const criticalEvents = analyticsState.queue.filter(event => 
          ['payment_attempted', 'booking_confirmed', 'user_login'].includes(event.event)
        );
        
        if (criticalEvents.length > 0) {
          try {
            navigator.sendBeacon(analyticsState.apiEndpoint, JSON.stringify({
              events: criticalEvents,
              unload: true,
              timestamp: Date.now()
            }));
          } catch (e) {
            console.error('Failed to send beacon:', e);
          }
        }
      }
    });
  };

  // Specific tracking functions
  const identifyUser = (userId, traits = {}) => {
    analyticsState.userId = userId;
    return track('user_identified', { user_id: userId, ...traits });
  };

  const trackUserLogin = (userId) => {
    return track('user_login', {
      user_id: userId,
      device: navigator.userAgent,
      geo_ip: 'unknown',
      referrer: document.referrer
    });
  };

  const trackPageView = (page, title, itineraryId = null) => {
    analyticsState.scrollThresholds.clear();
    analyticsState.pageStartTime = Date.now();
    
    return track('page_view', {
      page,
      title,
      referrer: document.referrer,
      itinerary_id: itineraryId
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

  const trackBulk = (events) => {
    console.log(`📦 Bulk tracking ${events.length} events`);
    events.forEach(({ eventName, properties }) => {
      track(eventName, properties);
    });
    return `Queued ${events.length} events`;
  };

  const getState = () => ({
    queueSize: analyticsState.queue.length,
    failedQueueSize: analyticsState.failedQueue.length,
    stats: { ...analyticsState.stats },
    config: {
      batchSize: analyticsState.batchSize,
      flushInterval: analyticsState.flushInterval,
      maxRetries: analyticsState.maxRetries
    }
  });

  const forceFlush = () => {
    console.log('🔧 Manual flush triggered');
    return flushEvents();
  };

  // Expose functions globally
  self.JupiterAnalytics = {
    initializeAnalytics,
    track,
    trackBulk,
    flushEvents: forceFlush,
    identifyUser,
    trackUserLogin,
    trackPageView,
    trackHotelCardClicked,
    trackPaymentAttempted,
    trackBookingConfirmed,
    getState
  };

  // Auto-initialize if config is available
  if (self.JUPITER_CONFIG) {
    initializeAnalytics(self.JUPITER_CONFIG);
  }

  console.log('✅ Jupiter Analytics loaded and ready');

})();