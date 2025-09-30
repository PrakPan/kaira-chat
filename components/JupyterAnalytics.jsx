import Script from 'next/script';
import { useEffect } from 'react';

export default function JupyterAnalytics({ 
  apiEndpoint = 'https://dev.jupiter.tarzanway.com', // Your actual API host
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

