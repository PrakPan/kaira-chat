import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { getOrCreateSession, getEntryContext } from '../services/sessionTracker';

export default function JupyterAnalytics({
  apiEndpoint = 'https://jupiter.tarzanway.com', // Your actual API host
  apiKey = '',
  userId = null,
  batchSize = 10,
  flushInterval = 5000
}) {
  // Session computed once on the main thread (persisted, 30-min sliding TTL).
  const sessionRef = useRef(null);
  if (sessionRef.current === null && typeof window !== 'undefined') {
    sessionRef.current = { ...getOrCreateSession(), fired: false };
  }

  // Keep global config (incl. the persisted session id) in sync for the worker,
  // which auto-initialises from window.JUPITER_CONFIG.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sessionId = sessionRef.current ? sessionRef.current.sessionId : undefined;
    window.JUPITER_CONFIG = {
      apiEndpoint,
      apiKey,
      userId,
      batchSize,
      flushInterval,
      sessionId,
    };
    // If the worker is already up, push the latest session id + user id so
    // login / hydration attribution stays correct without emitting extra events.
    if (window.JupiterAnalytics) {
      if (sessionId && window.JupiterAnalytics.setSession) {
        window.JupiterAnalytics.setSession(sessionId);
      }
      if (window.JupiterAnalytics.setUserId) {
        window.JupiterAnalytics.setUserId(userId);
      }
    }
  }, [apiEndpoint, apiKey, userId, batchSize, flushInterval]);

  // Once the worker is initialised, sync the session and fire a single
  // `session_started` for brand-new sessions (bounces included).
  useEffect(() => {
    if (typeof window === 'undefined' || !sessionRef.current) return;
    const { sessionId, isNew } = sessionRef.current;
    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      const A = window.JupiterAnalytics;
      let ready = false;
      try {
        ready = !!(A && A.getState && A.getState().isInitialized);
      } catch (e) {
        ready = false;
      }
      if (ready) {
        try {
          if (A.setSession) A.setSession(sessionId);
          if (A.setUserId) A.setUserId(userId);
          if (isNew && !sessionRef.current.fired && A.track) {
            A.track('session_started', getEntryContext());
            sessionRef.current.fired = true;
          }
        } catch (e) {
          // ignore
        }
        clearInterval(interval);
      } else if (attempts > 40) {
        clearInterval(interval); // give up after ~20s
      }
    }, 500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Flush reliably when the tab is hidden or unloaded so trailing events and
  // short/bounce sessions are not lost.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const flush = () => {
      try {
        const A = window.JupiterAnalytics;
        if (!A) return;
        if (A.flushBeacon) A.flushBeacon();
        else if (A.flushEvents) A.flushEvents();
      } catch (e) {
        // ignore
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', flush);
    };
  }, []);

  return (
    <>
      {/* Partytown configuration */}
      <Script
        id="partytown-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            partytown = {
              forward: ['JupiterAnalytics', 'JUPITER_CONFIG'],
              debug: ${process.env.NODE_ENV === 'production'}
            };
          `,
        }}
      />

      {/* Load Jupiter Analytics in web worker */}
      <Script
        src="/jupyter-partytown.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Explicitly initialize the worker with config if not already
          const tryInit = (attempt = 1) => {
            if (typeof window === 'undefined') return;

            const hasAPI = !!window.JupiterAnalytics && typeof window.JupiterAnalytics.initializeAnalytics === 'function';
            const hasConfig = !!window.JUPITER_CONFIG;

            if (hasAPI && hasConfig) {
              try {
                window.JupiterAnalytics.initializeAnalytics(window.JUPITER_CONFIG);
              } catch (e) {
                console.error('❌ Error calling initializeAnalytics:', e);
              }
              return;
            }

            if (attempt < 10) {
              setTimeout(() => tryInit(attempt + 1), 500);
            } else {
              console.warn('⚠️ Could not initialize Jupiter Analytics after retries');
            }
          };

          tryInit();
        }}
        onError={(e) => {
          console.error('❌ Jupiter Analytics load failed:', e);
        }}
      />
    </>
  );
}
