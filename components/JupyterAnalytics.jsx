import Script from 'next/script';
import { useEffect } from 'react';

export default function JupiterAnalytics({ 
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
      
      console.log('🔧 Jupiter Config set:', window.JUPITER_CONFIG);
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
              debug: ${process.env.NODE_ENV === 'development'}
            };
          `,
        }}
      />

      {/* Load Jupiter Analytics in web worker */}
      <Script
        src="/jupiter-analytics.js"
        strategy="worker"
        onLoad={() => {
          console.log('✅ Jupiter Analytics loaded in web worker');
          
          // Check if it initialized
          setTimeout(() => {
            if (typeof window !== 'undefined' && window.JupiterAnalytics) {
              const state = window.JupiterAnalytics.getState();
              console.log('📊 Jupiter Analytics State:', state);
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

