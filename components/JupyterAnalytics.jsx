import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function JupyterAnalytics({ 
  apiEndpoint = 'https://dev.jupiter.tarzanway.com',
  apiKey = '',
  userId = null,
  batchSize = 10,
  flushInterval = 5000
}) {
  const [retryCount, setRetryCount] = useState(0);
  const [scriptKey, setScriptKey] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.JUPITER_CONFIG = {
        apiEndpoint,
        apiKey,
        userId,
        batchSize,
        flushInterval
      };
      
      // console.log('🔧 Jupiter Config set:', window.JUPITER_CONFIG);
    }
  }, [apiEndpoint, apiKey, userId, batchSize, flushInterval]);

  const checkAnalyticsLoaded = () => {
    setTimeout(() => {
      if (window.JupiterAnalytics && typeof window.JupiterAnalytics.getState === 'function') {
        console.log('Jupiter Analytics ready');
        const state = window.JupiterAnalytics.getState();
        console.log('State:', state);
      } else {
        console.warn('Jupiter Analytics not ready');
        
        if (retryCount < maxRetries) {
          console.log(`Retrying... (${retryCount + 1}/${maxRetries})`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            setScriptKey(prev => prev + 1);
          }, 3000);
        }
      }
    }, 2000);
  };

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
              debug: ${process.env.NODE_ENV === 'development'}
            };
          `,
        }}
      />

      {/* Load Jupiter Analytics in web worker */}
      <Script
        src="/jupyter-partytown.js"
        strategy="afterInteractive"
        onLoad={() => {
          // console.log('✅ Jupiter Analytics loaded in web worker');
          
          // Check if it initialized
          setTimeout(() => {
            if (typeof window !== 'undefined' && window.JupiterAnalytics) {
              const state = window.JupiterAnalytics.getState();
              // console.log('📊 Jupiter Analytics State:', state);
            }
          }, 2000);
        }}
        onError={(e) => {
          console.error('❌ Jupiter Analytics load failed:', e);
        }}
      />
    </>
  );
}