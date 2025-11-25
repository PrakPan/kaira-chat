import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/router';

// Global state for worker readiness
let isWorkerReady = false;
let workerReadyCallbacks = [];
let callQueue = [];
let heartbeatInterval = null;

// Check if worker is ready and initialized
const checkWorkerReady = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    if (window.JupiterAnalytics) {
      // Check for both possible function names
      const hasTrack = typeof window.JupiterAnalytics.track === 'function';
      const hasTrackEvent = typeof window.JupiterAnalytics.trackEvent === 'function';
      const hasGetState = typeof window.JupiterAnalytics.getState === 'function';
      
      if (hasTrack || hasTrackEvent) {
        // Verify it's actually initialized by checking state
        if (hasGetState) {
          const state = window.JupiterAnalytics.getState();
          return state && state.isInitialized;
        }
        return true;
      }
    }
  } catch (error) {
    console.warn('Error checking worker state:', error);
  }
  
  return false;
};

// Wait for worker to be ready
const waitForWorker = (callback, timeout = 15000) => {
  if (checkWorkerReady()) {
    callback();
    return;
  }
  
  workerReadyCallbacks.push(callback);
  
  // Start checking if not already checking
  if (workerReadyCallbacks.length === 1) {
    const startTime = Date.now();
    
    const checkInterval = setInterval(() => {
      if (checkWorkerReady()) {
        isWorkerReady = true;
        clearInterval(checkInterval);
        
        
        // Execute all waiting callbacks
        workerReadyCallbacks.forEach(cb => {
          try {
            cb();
          } catch (error) {
            console.error('Error in worker ready callback:', error);
          }
        });
        
        // Process queued calls
        processCallQueue();
        
        // Clear callbacks
        workerReadyCallbacks = [];
        
        // Start heartbeat
        startHeartbeat();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        workerReadyCallbacks = [];
      }
    }, 200);
  }
};

// Process queued function calls
const processCallQueue = () => {
  
  while (callQueue.length > 0) {
    const { functionName, args, resolve, reject } = callQueue.shift();
    
    try {
      const result = callWorkerFunctionDirect(functionName, ...args);
      if (resolve) resolve(result);
    } catch (error) {
      console.error('Error processing queued call:', error);
      if (reject) reject(error);
    }
  }
};

// Direct worker function call (assumes worker is ready)
const callWorkerFunctionDirect = (functionName, ...args) => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!window.JupiterAnalytics) {
    console.warn('⚠️ JupiterAnalytics not available');
    return null;
  }

  // Try the function name as provided
  let fn = window.JupiterAnalytics[functionName];
  
  // If not found, try common alternatives
  if (typeof fn !== 'function') {
    const alternatives = {
      'track': ['trackEvent', 'logEvent', 'sendEvent'],
      'trackEvent': ['track', 'logEvent'],
      'identifyUser': ['identify', 'setUser'],
      'trackPageView': ['pageView', 'page'],
      'flushEvents': ['flush', 'send'],
    };
    
    if (alternatives[functionName]) {
      for (const altName of alternatives[functionName]) {
        if (typeof window.JupiterAnalytics[altName] === 'function') {
          fn = window.JupiterAnalytics[altName];
          break;
        }
      }
    }
  }

  if (typeof fn === 'function') {
    try {
      const result = fn.call(window.JupiterAnalytics, ...args);
      return result;
    } catch (error) {
      console.error(`❌ Worker function ${functionName} failed:`, error);
      return null;
    }
  } else {
    console.warn(`⚠️ Function ${functionName} not available on worker`);
    return null;
  }
};

// Enhanced worker communication with queuing
const callWorkerFunction = (functionName, ...args) => {
  return new Promise((resolve, reject) => {
    if (isWorkerReady || checkWorkerReady()) {
      try {
        const result = callWorkerFunctionDirect(functionName, ...args);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    } else {
      callQueue.push({ functionName, args, resolve, reject });
      
      // Start waiting for worker
      waitForWorker(() => {
        // Worker is ready, queue will be processed automatically
      });
    }
  });
};

// Synchronous version for immediate calls (returns null if not ready)
const callWorkerFunctionSync = (functionName, ...args) => {
  if (isWorkerReady || checkWorkerReady()) {
    return callWorkerFunctionDirect(functionName, ...args);
  } else {
    
    // Start worker check but don't wait
    waitForWorker(() => {
      callWorkerFunctionDirect(functionName, ...args);
    });
    
    return null;
  }
};

// Start session heartbeat (triggers batch flush every 15 seconds)
const startHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }
  
  heartbeatInterval = setInterval(() => {
    if (isWorkerReady || checkWorkerReady()) {
      // Just flush existing batched events, don't track a new event
      callWorkerFunctionDirect('flushEvents');
    }
  }, 15000); // 15 seconds
};

// Stop heartbeat on cleanup
const stopHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
};

// Main analytics hook
export const useAnalytics = () => {
  const [workerReady, setWorkerReady] = useState(false);

  useEffect(() => {
    // Check worker status on mount
    const checkStatus = () => {
      const ready = checkWorkerReady();
      setWorkerReady(ready);
      
      if (!ready && !isWorkerReady) {
        waitForWorker(() => {
          setWorkerReady(true);
        });
      } else if (ready && !heartbeatInterval) {
        // Start heartbeat if worker is ready but heartbeat isn't running
        startHeartbeat();
      }
    };

    checkStatus();
    
    // Periodic check in case worker loads later
    const interval = setInterval(() => {
      if (!workerReady && checkWorkerReady()) {
        setWorkerReady(true);
        isWorkerReady = true;
        startHeartbeat();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      stopHeartbeat();
    };
  }, [workerReady]);

  return {
    // Status
    isReady: workerReady,
    
    // Core functions - async versions with immediate event firing
    track: useCallback(async (eventName, properties = {}) => {
      const result = await callWorkerFunction('track', eventName, properties);
      // Optionally flush immediately for critical events
      if (properties.immediate) {
        await callWorkerFunction('flushEvents');
      }
      return result;
    }, []),
    
    trackBulk: useCallback(async (events) => {
      return await callWorkerFunction('trackBulk', events);
    }, []),
    
    identify: useCallback(async (userId, traits = {}) => {
      return await callWorkerFunction('identifyUser', userId, traits);
    }, []),
    
    flush: useCallback(async () => {
      return await callWorkerFunction('flushEvents');
    }, []),
    
    getState: useCallback(() => {
      // This one we want synchronously for debugging
      return callWorkerFunctionSync('getState');
    }, []),
    
    // User & Session Events
    trackUserLogin: useCallback(async (userId) => {
      return await callWorkerFunction('trackUserLogin', userId);
    }, []),
    
    trackUserLogout: useCallback(async (userId) => {
      return await callWorkerFunction('trackUserLogout', userId);
    }, []),
    
    trackUserAccountUpdate: useCallback(async (userId, fieldsChanged) => {
      return await callWorkerFunction('track', 'user_account_update', {
        user_id: userId,
        fields_changed: fieldsChanged
      });
    }, []),
    
    // Page Events  
    trackPageView: useCallback(async (page, title, itineraryId = null) => {
      return await callWorkerFunction('trackPageView', page, title, itineraryId);
    }, []),
    
    trackSearchQuery: useCallback(async (query, filters = {}, timeSpentMs = 0) => {
      return await callWorkerFunction('track', 'search_query', {
        query,
        filters,
        time_spent_ms: timeSpentMs
      });
    }, []),
    
    // Itinerary Events
    trackItineraryInitiated: useCallback(async (actionSource) => {
      return await callWorkerFunction('track', actionSource);
    }, []),

    trackItineraryCompleted: useCallback(async (itineraryId, actionSource) => {
      return await callWorkerFunction('track', actionSource, {itinerary_id: itineraryId});
    }, []),

    trackItineraryPageView: useCallback(async (itineraryId, isFirstVisit = false) => {
      return await callWorkerFunction('track', itineraryId, isFirstVisit);
    }, []),
    
    trackSwitchItinerary: useCallback(async (fromItineraryId, toItineraryId) => {
      return await callWorkerFunction('track', fromItineraryId, toItineraryId);
    }, []),
    
    trackSectionViewed: useCallback(async (itineraryId, sectionId) => {
      return await callWorkerFunction('track', 'section_viewed', {
        itinerary_id: itineraryId,
        section_id: sectionId
      });
    }, []),
    
    trackSectionTimeSpent: useCallback(async (itineraryId, sectionId, enteredAt, leftAt) => {
      return await callWorkerFunction('track', 'section_time_spent', {
        itinerary_id: itineraryId,
        section_id: sectionId,
        entered_at: enteredAt,
        left_at: leftAt,
        time_spent_ms: leftAt - enteredAt
      });
    }, []),
    
    trackSectionToggle: useCallback(async (itineraryId, sectionId, action) => {
      const eventName = action === 'expand' ? 'section_expanded' : 'section_collapsed';
      return await callWorkerFunction('track', eventName, {
        itinerary_id: itineraryId,
        section_id: sectionId,
        action
      });
    }, []),
    
    // Payment Events
    trackPaymentPageViewed: useCallback(async (itineraryId = null) => {
      return await callWorkerFunction('track', 'payment_page_viewed', {
        itinerary_id: itineraryId
      });
    }, []),
    
    trackPaymentAttempted: useCallback(async (itineraryId = null,cart_info=null) => {
      return await callWorkerFunction('track','payment_attempted', {itineraryId, cart_info});
    }, []),

    trackPaymentSelected: useCallback(async (itineraryId=null, bookingType=null, bookingId=null) => {
      return await callWorkerFunction('track','payment_selected', {itineraryId, bookingType, bookingId});
    }, []),
    trackPaymentDeselected: useCallback(async (itineraryId=null, bookingType=null, bookingId=null) => {
      return await callWorkerFunction('track', 'payment_deselected', {itineraryId, bookingType, bookingId});
    }, []),
    
    trackPaymentBookingConfirmed: useCallback(async (itineraryId = null, cart_info=null) => {
      return await callWorkerFunction('track', 'payment_confirmed',{itineraryId, cart_info});
    }, []),
    
    // Communication Events
    trackWhatsAppClicked: useCallback(async (itineraryId, amount, currency) => {
      return await callWorkerFunction('track', 'whatsapp_clicked', {
        itinerary_id: itineraryId,
        amount,
        currency
      });
    }, []),
    
    trackGetInTouchClicked: useCallback(async (itineraryId, amount, currency) => {
      return await callWorkerFunction('track', 'get_in_touch_clicked', {
        itinerary_id: itineraryId,
        amount,
        currency
      });
    }, []),
    
    // Hotel Events
    trackHotelCardClicked: useCallback(async (itineraryId, hotelId, actionSource) => {
      return await callWorkerFunction('track', 'hotel_card_clicked', {itinerary_id: itineraryId, hotel_id: hotelId});
    }, []),

    trackHotelListClicked: useCallback(async (itineraryId, hotelId, actionSource) => {
      return await callWorkerFunction('track', 'hotel_search_list', {itinerary_id: itineraryId, hotel_id: hotelId});
    }, []),
    
    trackHotelCardDetails: useCallback(async (itineraryId, hotelId, actionSource) => {
      return await callWorkerFunction('track', 'hotel_card_details', {
        itinerary_id: itineraryId,
        hotel_id: hotelId,
        action_source: actionSource
      });
    }, []),
    
    trackHotelRoomDetails: useCallback(async (itineraryId, hotelId, roomId, actionSource) => {
      return await callWorkerFunction('track', 'hotel_room_details', {
        itinerary_id: itineraryId,
        hotel_id: hotelId,
        room_id: roomId,
        action_source: actionSource
      });
    }, []),
    
    trackHotelFiltersChanged: useCallback(async (itineraryId, hotelId, actionSource) => {
      return await callWorkerFunction('track', 'hotel_filters_changed', {
        itinerary_id: itineraryId,
        hotel_id: hotelId,
        action_source: actionSource
      });
    }, []),
    
    trackHotelBookingAdd: useCallback(async (itineraryId, hotelId) => {
      return await callWorkerFunction('track', 'hotel_booking_add', {
        itinerary_id: itineraryId,
        hotel_id: hotelId
      });
    }, []),

    trackHotelBookingDelete: useCallback(async (itineraryId, hotelId) => {
      return await callWorkerFunction('track', 'hotel_booking_delete', {
        itinerary_id: itineraryId,
        hotel_id: hotelId
      });
    }, []),
    
    // Transfer Events
    trackTransferCardClicked: useCallback(async (itineraryId, transferId, actionSource,fromCity = null, toCity = null) => {
      return await callWorkerFunction('track', 'transfer_card_clicked', {
        itinerary_id: itineraryId,
        transfer_id: transferId,
        action_source: actionSource,
        from_city: fromCity,
        to_city: toCity
      });
    }, []),
    
    trackTransferBookingAdd: useCallback(async (itineraryId, transferId,previousData = null ,newData = null,fromCity = null, toCity = null) => {
      return await callWorkerFunction('track', 'transfer_booking_add', {
        itinerary_id: itineraryId,
        transfer_id: transferId,
        previous_data: previousData,
        new_data: newData,
        from_city: fromCity,
        to_city: toCity
      });
    }, []),

    trackTransferBookingDelete: useCallback(async (itineraryId, transferId, userId = null,previousData = null,fromCity = null, toCity = null) => {
      return await callWorkerFunction('track', 'transfer_booking_delete', {
        itinerary_id: itineraryId,
        transfer_id: transferId,
        user_id: userId,
        previous_data: previousData,
        new_data: null,
        from_city: fromCity,
        to_city: toCity
      });
    }, []),

    trackTransferBookingChange: useCallback(async (itineraryId, transferId, userId = null, fromCity = null, toCity = null) => {
      return await callWorkerFunction('track', 'transfer_booking_change', {
        itinerary_id: itineraryId,
        transfer_id: transferId,
        user_id: userId,
        from_city: fromCity,
        to_city: toCity
      });
    }, []),
    
    // Activity Events
    trackActivityCardClicked: useCallback(async (itineraryId, activityId, actionSource) => {
      return await callWorkerFunction('track', 'activity_card_clicked', {
        itinerary_id: itineraryId,
        activity_id: activityId,
        action_source: actionSource
      });
    }, []),
    
    trackActivityBookingAdd: useCallback(async (itineraryId, actionSource) => {
      return await callWorkerFunction('track', 'activity_booking_add', {
        itinerary_id: itineraryId,
        action_source: actionSource
      });
    }, []),

    trackActivityBookingDelete: useCallback(async (itineraryId, activityId, actionSource) => {
      return await callWorkerFunction('track', 'activity_booking_delete', {
        itinerary_id: itineraryId,
        activity_id: activityId,
        action_source: actionSource
      });
    }, []),

    // POI Events
    trackPoiCardClicked: useCallback(async (itineraryId, activityId, actionSource) => {
      return await callWorkerFunction('track', 'poi_card_clicked', {
        itinerary_id: itineraryId,
        poi_id: activityId,
        action_source: actionSource
      });
    }, []),
    
    trackPoiBookingAdded: useCallback(async (itineraryId, actionSource) => {
      return await callWorkerFunction('track', 'poi_booking_add', {
        itinerary_id: itineraryId,
        action_source: actionSource
      });
    }, []),
    
    // Edit & Save Events
    trackItineraryEdited: useCallback(async (itineraryId, editType, payloadDiff = null) => {
      return await callWorkerFunction('track', 'itinerary_edited', {
        itinerary_id: itineraryId,
        edit_type: editType,
        payload_diff: payloadDiff
      });
    }, []),
    
    trackItinerarySaved: useCallback(async (itineraryId, saveType) => {
      return await callWorkerFunction('track', 'itinerary_saved', {
        itinerary_id: itineraryId,
        save_type: saveType
      });
    }, []),
    
    trackItineraryShared: useCallback(async (itineraryId, channel, recipientCount, recipientHashes = []) => {
      return await callWorkerFunction('track', 'itinerary_shared', {
        itinerary_id: itineraryId,
        channel,
        recipient_count: recipientCount,
        recipient_hashes: recipientHashes
      });
    }, []),
    
    // CTA Events
    trackCTAClicked: useCallback(async (itineraryId, ctaName, locationOnPage) => {
      return await callWorkerFunction('trackCTAClicked', itineraryId, ctaName, locationOnPage);
    }, []),
    
    trackContactInfoSubmitted: useCallback(async (itineraryId, phoneHash, emailHash, consentGiven) => {
      return await callWorkerFunction('track', 'contact_info_submitted', {
        itinerary_id: itineraryId,
        phone_hash: phoneHash,
        email_hash: emailHash,
        consent_given: consentGiven
      });
    }, []),
    
    trackRequestCallback: useCallback(async (itineraryId, preferredTime) => {
      return await callWorkerFunction('track', 'request_callback', {
        itinerary_id: itineraryId,
        preferred_time: preferredTime
      });
    }, []),
    
    // Chat Events
    trackChatOpened: useCallback(async (itineraryId,sessionId=null) => {
      return await callWorkerFunction('track', 'chat_opened', {
        itinerary_id: itineraryId,
        session_id:sessionId
      });
    }, []),
    
    trackChatMessageSent: useCallback(async (itineraryId, message=null) => {
      return await callWorkerFunction('track', 'chat_message_sent', {
        itinerary_id: itineraryId,
        message: message
      });
    }, []),
    
    trackChatMessageReceived: useCallback(async (itineraryId, message=null) => {
      return await callWorkerFunction('track', 'chat_message_received', {
        itinerary_id: itineraryId,
        message
      });
    }, []),
  };
};

// Hook for automatic page tracking
export const usePageTracking = () => {
  const router = useRouter();
  const { trackPageView, isReady } = useAnalytics();
  
  useEffect(() => {
    const handleRouteChange = async (url) => {
      if (isReady) {
        await trackPageView(url, document.title);
      }
    };

    // Track initial page
    if (isReady) {
      handleRouteChange(router.asPath);
    }

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, trackPageView, isReady]);
};

// Hook for section tracking with intersection observer
export const useSectionTracking = (sectionId, itineraryId) => {
  const sectionRef = useRef(null);
  const enteredAtRef = useRef(null);
  const { trackSectionViewed, trackSectionTimeSpent, isReady } = useAnalytics();

  useEffect(() => {
    const element = sectionRef.current;
    if (!element || !isReady) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            enteredAtRef.current = Date.now();
            await trackSectionViewed(itineraryId, sectionId);
          } else if (enteredAtRef.current) {
            const leftAt = Date.now();
            await trackSectionTimeSpent(
              itineraryId, 
              sectionId, 
              enteredAtRef.current, 
              leftAt
            );
            enteredAtRef.current = null;
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (enteredAtRef.current) {
        trackSectionTimeSpent(
          itineraryId, 
          sectionId, 
          enteredAtRef.current, 
          Date.now()
        );
      }
    };
  }, [sectionId, itineraryId, trackSectionViewed, trackSectionTimeSpent, isReady]);

  return sectionRef;
};

// Hook for time tracking
export const useTimeTracking = () => {
  const startTimeRef = useRef(Date.now());
  
  const resetTimer = useCallback(() => {
    startTimeRef.current = Date.now();
  }, []);
  
  const getTimeSpent = useCallback(() => {
    return Date.now() - startTimeRef.current;
  }, []);
  
  return { resetTimer, getTimeSpent };
};

// Hook for click tracking with analytics
export const useClickTracking = () => {
  const { track, isReady } = useAnalytics();
  
  const trackClick = useCallback((eventName, properties = {}) => {
    return async (event) => {
      if (isReady) {
        await track(eventName, {
          ...properties,
          element_type: event.target.tagName,
          element_text: event.target.textContent?.substring(0, 100),
        });
      }
    };
  }, [track, isReady]);

  return { trackClick, isReady };
};

// Debug hook to monitor worker status
export const useAnalyticsDebug = () => {
  const { getState, isReady } = useAnalytics();
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    if (isReady) {
      const updateDebugInfo = () => {
        const state = getState();
        setDebugInfo({
          ...state,
          timestamp: new Date().toISOString()
        });
      };

      updateDebugInfo();
      const interval = setInterval(updateDebugInfo, 5000);

      return () => clearInterval(interval);
    }
  }, [getState, isReady]);

  return { debugInfo, isReady };
};