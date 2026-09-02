import Script from 'next/script';
import { useEffect } from 'react';
import { JUPITER_HOST } from '../services/constants';

export default function JupyterAnalytics({
  apiEndpoint = JUPITER_HOST, // Analytics API host (NEXT_PUBLIC_JUPITER_HOST)
  apiKey = '',
  userId = null,
  batchSize = 10,
  flushInterval = 5000
}) {
  useEffect(() => {
    // Set global config before Partytown loads the script
    if (typeof window !== 'undefined') {
      window.JUPITER_CONFIG = {
        apiEndpoint,
        apiKey,
        userId,
        batchSize,
        flushInterval
      };
      
    }
  }, [apiEndpoint, apiKey, userId, batchSize, flushInterval]);

  return (
    <>
      {/* A <Script id="partytown-config" strategy="beforeInteractive"> used to
          sit here writing a global `partytown = { forward: [...] }`. It was the
          reason Partytown never worked anywhere on the site: _document.js wrote
          a second, different config under that same script id, next/script
          dedupes by id, and the surviving config had the wrong `forward` (and
          no `lib`). The worker library was never fetched, so every script tagged
          type="text/partytown" silently did nothing.

          Partytown is gone now, and this config with it. Note the tracker below
          is NOT a Partytown script despite the filename — it is a normal
          afterInteractive script that runs on the main thread, and it kept
          working throughout. */}

      {/* Load Jupiter Analytics (main thread, after hydration) */}
      <Script
        src="/jupyter-partytown.js"
        strategy="afterInteractive"
        onLoad={() => {
          
          // Check if it initialized
          setTimeout(() => {
            if (typeof window !== 'undefined' && window.JupiterAnalytics) {
              const state = window.JupiterAnalytics.getState();
            }
          }, 2000);

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

          // Kick off init attempts
          tryInit();
        }}
        onError={(e) => {
          console.error('❌ Jupiter Analytics load failed:', e);
        }}
      />
    </>
  );
}

