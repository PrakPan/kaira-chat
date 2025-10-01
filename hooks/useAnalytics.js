// ================================================================
// hooks/useAnalytics.js - Fixed with proper Partytown worker communication
// ================================================================

import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/router';

// Global state for worker readiness
let isWorkerReady = false;
let workerReadyCallbacks = [];
let callQueue = [];

// Check if worker is ready and initialized
const checkWorkerReady = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    if (window.JupiterAnalytics && typeof window.JupiterAnalytics.getState === 'function') {
      const state = window.JupiterAnalytics.getState();
      return state && state.isInitialized;
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
        
        console.log('✅ Jupiter Analytics worker is ready');
        
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
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        console.error(`❌ Jupiter Analytics worker not ready after ${timeout}ms`);
        console.log('Available on window:', Object.keys(window).filter(k => k.includes('Jupiter') || k.includes('analytics')));
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

  if (window.JupiterAnalytics && typeof window.JupiterAnalytics[functionName] === 'function') {
    try {
      const result = window.JupiterAnalytics[functionName](...args);
      console.log(`📞 ${functionName}(${args.map(a => typeof a === 'object' ? JSON.stringify(a).substring(0, 50) + '...' : a).join(', ')}) → `, result?.event || result?.length || 'success');
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
      // Queue the call until worker is ready
      console.log(`📋 Queueing ${functionName} until worker is ready...`);
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
    console.log(`⏳ ${functionName} called but worker not ready yet`);
    
    // Start worker check but don't wait
    waitForWorker(() => {
      console.log(`🔄 Retrying ${functionName} now that worker is ready`);
      callWorkerFunctionDirect(functionName, ...args);
    });
    
    return null;
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
        console.log('🔄 Waiting for Jupiter Analytics worker...');
        waitForWorker(() => {
          setWorkerReady(true);
          console.log('✅ Worker ready in hook');
        });
      }
    };

    checkStatus();
    
    // Periodic check in case worker loads later
    const interval = setInterval(() => {
      if (!workerReady && checkWorkerReady()) {
        setWorkerReady(true);
        isWorkerReady = true;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [workerReady]);

  return {
    // Status
    isReady: workerReady,
    
    // Core functions - async versions
    track: useCallback(async (eventName, properties = {}) => {
      return await callWorkerFunction('track', eventName, properties);
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
      return await callWorkerFunction('track',actionSource);
    }, []),

    trackItineraryCompleted: useCallback(async (itineraryId,actionSource) => {
      return await callWorkerFunction('track',actionSource,{itinerary_id: itineraryId});
    }, []),


    trackItineraryPageView: useCallback(async (itineraryId, isFirstVisit = false) => {
      return await callWorkerFunction('trackItineraryPageView', itineraryId, isFirstVisit);
    }, []),
    
    trackSwitchItinerary: useCallback(async (fromItineraryId, toItineraryId) => {
      return await callWorkerFunction('trackSwitchItinerary', fromItineraryId, toItineraryId);
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
    trackPaymentPageViewed: useCallback(async (itineraryId) => {
      return await callWorkerFunction('track', 'payment_page_viewed', {
        itinerary_id: itineraryId
      });
    }, []),
    
    trackPaymentAttempted: useCallback(async (itineraryId, amount, currency, methodMasked, success) => {
      return await callWorkerFunction('trackPaymentAttempted', itineraryId, amount, currency, methodMasked, success);
    }, []),
    
    trackBookingConfirmed: useCallback(async (itineraryId, bookingIds, amount, currency) => {
      return await callWorkerFunction('trackBookingConfirmed', itineraryId, bookingIds, amount, currency);
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
      return await callWorkerFunction('track', 'hotel_card_clicked',{itinerary_id:itineraryId, hotel_id:hotelId});
    }, []),

    trackHotelListClicked: useCallback(async (itineraryId, hotelId, actionSource) => {
      return await callWorkerFunction('track', 'hotel_search_list',{itinerary_id:itineraryId, hotel_id:hotelId});
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
    trackTransferCardClicked: useCallback(async (itineraryId, transferId, actionSource) => {
      return await callWorkerFunction('track', 'transfer_card_clicked', {
        itinerary_id: itineraryId,
        transfer_id: transferId,
        action_source: actionSource
      });
    }, []),
    
    trackTransferBookingAdd: useCallback(async (itineraryId, transferId,userId = null) => {
      return await callWorkerFunction('track', 'transfer_booking_add', {
        itinerary_id: itineraryId,
        transfer_id: transferId,
        user_id: userId
      });
    }, []),

    trackTransferBookingDelete: useCallback(async (itineraryId, transferId,userId = null) => {
      return await callWorkerFunction('track', 'transfer_booking_delete', {
        itinerary_id: itineraryId,
        transfer_id: transferId,
        user_id: userId
      });
    }, []),

     trackTransferBookingChange: useCallback(async (itineraryId, transferId,userId = null) => {
      return await callWorkerFunction('track', 'transfer_booking_change', {
        itinerary_id: itineraryId,
        transfer_id: transferId,
        user_id: userId
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

    // Activity Events
    trackPoiCardClicked: useCallback(async (itineraryId, activityId, actionSource) => {
      return await callWorkerFunction('track', 'poi_card_clicked', {
        itinerary_id: itineraryId,
        poi_id: activityId,
        action_source: actionSource
      });
    }, []),
    
    trackPoiBookingAdd: useCallback(async (itineraryId, actionSource) => {
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
    trackChatOpened: useCallback(async (itineraryId) => {
      return await callWorkerFunction('track', 'chat_opened', {
        itinerary_id: itineraryId
      });
    }, []),
    
    trackChatMessageSent: useCallback(async (itineraryId, messageLength, messageMasked) => {
      return await callWorkerFunction('track', 'chat_message_sent', {
        itinerary_id: itineraryId,
        message_length: messageLength,
        message_masked: messageMasked
      });
    }, []),
    
    trackChatMessageReceived: useCallback(async (itineraryId, source) => {
      return await callWorkerFunction('track', 'chat_message_received', {
        itinerary_id: itineraryId,
        source
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