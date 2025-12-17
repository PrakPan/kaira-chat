import { useEffect, useState } from 'react';

export const useAnalyticsSession = () => {
  const [sessionData, setSessionData] = useState({
    sessionId: null,
    userId: null,
    anonymousId: null,
    isReady: false
  });

useEffect(() => {
  const checkAnalytics = () => {
    if (window.JupiterAnalytics) {
      const state = window.JupiterAnalytics.getState();
      if (state.isInitialized) {  
        setSessionData({
          sessionId: state.sessionId,
          userId: state.userId,
          anonymousId: state.anonymousId,
          isReady: state.isInitialized
        });
        return true;
      }
    }
    return false;
  };

  if (checkAnalytics()) return;


  const interval = setInterval(() => {
    if (checkAnalytics()) {
      clearInterval(interval);
    }
  }, 200);  

  const timeout = setTimeout(() => {
    clearInterval(interval);
  }, 10000);

  return () => {
    clearInterval(interval);
    clearTimeout(timeout);
  };
}, []);

  return sessionData;
};