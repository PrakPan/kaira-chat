import { v4 as uuidv4 } from 'uuid';


let analyticsState = {
  sessionId: null,
  userId: null,
  anonymousId: null,
  apiEndpoint: '',
  apiKey: '',
  queue: [],
  heartbeatInterval: null,
  visibilityStartTime: Date.now(),
  sectionTimers: new Map(),
  scrollThresholds: new Set(),
  pageStartTime: Date.now()
};


export const initializeAnalytics = (config) => {
  analyticsState.sessionId = uuidv4();
  analyticsState.anonymousId = getOrCreateAnonymousId();
  analyticsState.apiEndpoint = config.apiEndpoint;
  analyticsState.apiKey = config.apiKey;
  
  if (typeof window !== 'undefined') {
    initializeClientSideTracking();
  }
};


const getOrCreateAnonymousId = () => {
  if (typeof window === 'undefined') return uuidv4();
  
  let anonymousId = localStorage.getItem('jupiter_anonymous_id');
  if (!anonymousId) {
    anonymousId = uuidv4();
    localStorage.setItem('jupiter_anonymous_id', anonymousId);
  }
  return anonymousId;
};

const getCurrentItineraryId = () => {
  if (typeof window === 'undefined') return undefined;
  const path = window.location.pathname;
  const match = path.match(/\/itinerary\/([^\/]+)/);
  return match ? match[1] : undefined;
};

const getDeviceInfo = () => {
  if (typeof window === 'undefined') return 'server';
  return window.navigator.userAgent;
};

const getGeoIP = () => {
  
  return 'unknown';
};


const initializeClientSideTracking = () => {
  document.addEventListener('visibilitychange', () => {
    track('visibility_change', {
      session_id: analyticsState.sessionId,
      visibility: document.hidden ? 'hidden' : 'visible'
    });
  });


  analyticsState.heartbeatInterval = setInterval(() => {
    if (!document.hidden) {
      const now = Date.now();
      track('session_heartbeat', {
        session_id: analyticsState.sessionId,
        active_ms_since_last: now - analyticsState.visibilityStartTime,
        focused: document.hasFocus(),
        itinerary_id: getCurrentItineraryId()
      });
      analyticsState.visibilityStartTime = now;
    }
  }, 15000);


  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        
        [25, 50, 75, 100].forEach(threshold => {
          if (scrollPercent >= threshold && !analyticsState.scrollThresholds.has(threshold)) {
            analyticsState.scrollThresholds.add(threshold);
            track('scroll_depth', {
              session_id: analyticsState.sessionId,
              itinerary_id: getCurrentItineraryId(),
              percent: threshold,
              y_offset: window.scrollY
            });
          }
        });
        
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });


  window.addEventListener('beforeunload', () => {
    flushEvents();
  });
};

export const track = (eventName, properties = {}) => {
  const event = {
    event: eventName,
    properties: {
      ...properties,
      timestamp: Date.now(),
      session_id: analyticsState.sessionId,
      user_id: analyticsState.userId,
      anonymous_id: analyticsState.anonymousId
    }
  };

  analyticsState.queue.push(event);


  const immediateEvents = ['payment_attempted', 'booking_confirmed', 'user_login', 'user_logout'];
  if (immediateEvents.includes(eventName) || analyticsState.queue.length >= 10) {
    flushEvents();
  }
};


export const flushEvents = async () => {
  if (analyticsState.queue.length === 0) return;

  const events = [...analyticsState.queue];
  analyticsState.queue = [];

  try {
    const response = await fetch(analyticsState.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${analyticsState.apiKey}`
      },
      body: JSON.stringify({ events })
    });

    if (!response.ok) {
      console.error('Failed to send analytics events:', response.statusText);
      analyticsState.queue.unshift(...events);
    }
  } catch (error) {
    console.error('Analytics error:', error);
    analyticsState.queue.unshift(...events);
  }
};


export const identifyUser = (userId, traits = {}) => {
  analyticsState.userId = userId;
  track('user_identified', { user_id: userId, ...traits });
};

// User & Session Events
export const trackUserLogin = (userId) => {
  track('user_login', {
    user_id: userId,
    device: getDeviceInfo(),
    geo_ip: getGeoIP(),
    referrer: document.referrer
  });
};

export const trackUserLogout = (userId) => {
  track('user_logout', {
    user_id: userId,
    device: getDeviceInfo(),
    geo_ip: getGeoIP(),
    referrer: document.referrer
  });
};

export const trackUserAccountUpdate = (userId, fieldsChanged) => {
  track('user_account_update', {
    user_id: userId,
    fields_changed: fieldsChanged
  });
};

// Page Events
export const trackPageView = (page, title, itineraryId = null) => {
  analyticsState.scrollThresholds.clear();
  analyticsState.pageStartTime = Date.now();
  
  track('page_view', {
    session_id: analyticsState.sessionId,
    page,
    title,
    referrer: document.referrer,
    itinerary_id: itineraryId
  });
};

export const trackSearchQuery = (query, filters = {}) => {
  track('search_query', {
    user_id: analyticsState.userId,
    anonymous_id: analyticsState.anonymousId,
    session_id: analyticsState.sessionId,
    time_spent_ms: Date.now() - analyticsState.pageStartTime,
    query,
    filters
  });
};

// Itinerary Events
export const trackItineraryPageView = (itineraryId, isFirstVisit = false) => {
  track('itinerary_page_view', {
    itinerary_id: itineraryId,
    session_id: analyticsState.sessionId,
    user_id: analyticsState.userId,
    referrer: document.referrer,
    first_visit: isFirstVisit
  });
};

export const trackSwitchItinerary = (fromItineraryId, toItineraryId) => {
  track('switch_itinerary', {
    user_id: analyticsState.userId,
    anonymous_id: analyticsState.anonymousId,
    from_itinerary_id: fromItineraryId,
    to_itinerary_id: toItineraryId,
    session_id: analyticsState.sessionId
  });
};

export const trackSectionViewed = (itineraryId, sectionId) => {
  track('section_viewed', {
    itinerary_id: itineraryId,
    session_id: analyticsState.sessionId,
    section_id: sectionId
  });
};

export const trackSectionTimeSpent = (itineraryId, sectionId, enteredAt, leftAt) => {
  track('section_time_spent', {
    itinerary_id: itineraryId,
    session_id: analyticsState.sessionId,
    section_id: sectionId,
    entered_at: enteredAt,
    left_at: leftAt,
    time_spent_ms: leftAt - enteredAt
  });
};

export const trackSectionToggle = (itineraryId, sectionId, action) => {
  const eventName = action === 'expand' ? 'section_expanded' : 'section_collapsed';
  track(eventName, {
    itinerary_id: itineraryId,
    session_id: analyticsState.sessionId,
    section_id: sectionId,
    action
  });
};

// Payment Events
export const trackPaymentPageViewed = (itineraryId) => {
  track('payment_page_viewed', { itinerary_id: itineraryId });
};

export const trackPaymentAttempted = (itineraryId, amount, currency, methodMasked, success) => {
  track('payment_attempted', {
    itinerary_id: itineraryId,
    amount,
    currency,
    method_masked: methodMasked,
    success_bool: success
  });
};

export const trackBookingConfirmed = (itineraryId, bookingIds, amount, currency) => {
  track('booking_confirmed', {
    itinerary_id: itineraryId,
    booking_ids: bookingIds,
    amount,
    currency
  });
};

// Communication Events
export const trackWhatsAppClicked = (itineraryId, amount, currency) => {
  track('whatsapp_clicked', {
    itinerary_id: itineraryId,
    amount,
    currency
  });
};

export const trackGetInTouchClicked = (itineraryId, amount, currency) => {
  track('get_in_touch_clicked', {
    itinerary_id: itineraryId,
    amount,
    currency
  });
};

// Hotel Events
export const trackHotelCardClicked = (itineraryId, hotelId, actionSource) => {
  track('hotel_card_clicked', {
    itinerary_id: itineraryId,
    hotel_id: hotelId,
    action_source: actionSource
  });
};

export const trackHotelCardDetails = (itineraryId, hotelId, actionSource) => {
  track('hotel_card_details', {
    itinerary_id: itineraryId,
    hotel_id: hotelId,
    action_source: actionSource
  });
};

export const trackHotelRoomDetails = (itineraryId, hotelId, roomId, actionSource) => {
  track('hotel_room_details', {
    itinerary_id: itineraryId,
    hotel_id: hotelId,
    room_id: roomId,
    action_source: actionSource
  });
};

export const trackHotelBookingAdd = (itineraryId, hotelId, userId = null) => {
  track('hotel_booking_add', {
    itinerary_id: itineraryId,
    hotel_id: hotelId,
    user_id: userId
  });
};

// Transfer Events
export const trackTransferCardClicked = (itineraryId, transferId, actionSource) => {
  track('transfer_card_clicked', {
    itinerary_id: itineraryId,
    transfer_id: transferId,
    action_source: actionSource
  });
};

export const trackTransferBookingAdd = (itineraryId, userId = null) => {
  track('transfer_booking_add', {
    itinerary_id: itineraryId,
    user_id: userId
  });
};

// Activity Events
export const trackActivityCardClicked = (itineraryId, activityId, actionSource) => {
  track('activity_card_clicked', {
    itinerary_id: itineraryId,
    activity_id: activityId,
    action_source: actionSource
  });
};

export const trackActivityBookingAdd = (itineraryId, actionSource) => {
  track('activity_booking_add', {
    itinerary_id: itineraryId,
    action_source: actionSource
  });
};

// Edit & Save Events
export const trackItineraryEdited = (itineraryId, editType, payloadDiff = null) => {
  track('itinerary_edited', {
    itinerary_id: itineraryId,
    edit_type: editType,
    payload_diff: payloadDiff
  });
};

export const trackItinerarySaved = (itineraryId, saveType) => {
  track('itinerary_saved', {
    itinerary_id: itineraryId,
    save_type: saveType
  });
};

export const trackItineraryShared = (itineraryId, channel, recipientCount, recipientHashes = []) => {
  track('itinerary_shared', {
    itinerary_id: itineraryId,
    channel,
    recipient_count: recipientCount,
    recipient_hashes: recipientHashes
  });
};

// CTA Events
export const trackCTAClicked = (itineraryId, ctaName, locationOnPage) => {
  track('cta_clicked', {
    itinerary_id: itineraryId,
    cta_name: ctaName,
    location_on_page: locationOnPage
  });
};

export const trackContactInfoSubmitted = (itineraryId, phoneHash, emailHash, consentGiven) => {
  track('contact_info_submitted', {
    itinerary_id: itineraryId,
    phone_hash: phoneHash,
    email_hash: emailHash,
    consent_given: consentGiven
  });
};

// Chat Events
export const trackChatOpened = (itineraryId) => {
  track('chat_opened', {
    itinerary_id: itineraryId,
    session_id: analyticsState.sessionId
  });
};

export const trackChatMessageSent = (itineraryId, messageLength, messageMasked) => {
  track('chat_message_sent', {
    itinerary_id: itineraryId,
    message_length: messageLength,
    message_masked: messageMasked
  });
};

export const trackChatMessageReceived = (itineraryId, source) => {
  track('chat_message_received', {
    itinerary_id: itineraryId,
    source
  });
};


export const cleanup = () => {
  if (analyticsState.heartbeatInterval) {
    clearInterval(analyticsState.heartbeatInterval);
  }
  flushEvents();
};


