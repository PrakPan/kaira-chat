import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import * as analytics from '../lib/analytics';

export const useAnalytics = () => {
  return {
    track: analytics.track,
    identify: analytics.identifyUser,
    trackPageView: analytics.trackPageView,
    trackUserLogin: analytics.trackUserLogin,
    trackUserLogout: analytics.trackUserLogout,
    trackItineraryPageView: analytics.trackItineraryPageView,
    trackSectionViewed: analytics.trackSectionViewed,
    trackHotelCardClicked: analytics.trackHotelCardClicked,
    trackPaymentAttempted: analytics.trackPaymentAttempted,
    trackCTAClicked: analytics.trackCTAClicked,
   
  };
};

export const usePageTracking = () => {
  const router = useRouter();
  
  useEffect(() => {
    const handleRouteChange = (url) => {
      analytics.trackPageView(url, document.title);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    handleRouteChange(router.asPath);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);
};

export const useSectionTracking = (sectionId, itineraryId) => {
  const sectionRef = useRef(null);
  const enteredAtRef = useRef(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            enteredAtRef.current = Date.now();
            analytics.trackSectionViewed(itineraryId, sectionId);
          } else if (enteredAtRef.current) {
            const leftAt = Date.now();
            analytics.trackSectionTimeSpent(
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
        analytics.trackSectionTimeSpent(
          itineraryId, 
          sectionId, 
          enteredAtRef.current, 
          Date.now()
        );
      }
    };
  }, [sectionId, itineraryId]);

  return sectionRef;
};

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

export const useClickTracking = () => {
  const trackClick = useCallback((eventName, properties = {}) => {
    return (event) => {
      analytics.track(eventName, {
        ...properties,
        element_type: event.target.tagName,
        element_text: event.target.textContent?.substring(0, 100),
      });
    };
  }, []);

  return { trackClick };
};