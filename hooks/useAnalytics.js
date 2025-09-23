import { useCallback } from 'react';

// Helper to call worker functions
const callWorkerFunction = (functionName, ...args) => {
  if (typeof window !== 'undefined' && window.JupiterAnalytics) {
    return window.JupiterAnalytics[functionName](...args);
  } else {
    console.warn(`Jupiter Analytics not loaded: ${functionName}`, args);
    return null;
  }
};

export const useAnalytics = () => {
  return {
    // Core functions
    track: useCallback((event, props) => callWorkerFunction('track', event, props), []),
    trackBulk: useCallback((events) => callWorkerFunction('trackBulk', events), []),
    identify: useCallback((userId, traits) => callWorkerFunction('identifyUser', userId, traits), []),
    flush: useCallback(() => callWorkerFunction('flushEvents'), []),
    getState: useCallback(() => callWorkerFunction('getState'), []),
    
    // Specific tracking functions
    trackPageView: useCallback((page, title, itineraryId) => 
      callWorkerFunction('trackPageView', page, title, itineraryId), []),
    trackUserLogin: useCallback((userId) => 
      callWorkerFunction('trackUserLogin', userId), []),
    trackHotelCardClicked: useCallback((itineraryId, hotelId, actionSource) => 
      callWorkerFunction('trackHotelCardClicked', itineraryId, hotelId, actionSource), []),
    trackPaymentAttempted: useCallback((itineraryId, amount, currency, method, success) => 
      callWorkerFunction('trackPaymentAttempted', itineraryId, amount, currency, method, success), []),
    trackBookingConfirmed: useCallback((itineraryId, bookingIds, amount, currency) => 
      callWorkerFunction('trackBookingConfirmed', itineraryId, bookingIds, amount, currency), []),
  };
};
