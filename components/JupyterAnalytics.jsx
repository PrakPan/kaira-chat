import Script from 'next/script';
import { useEffect } from 'react';

export default function JupiterAnalytics({ 
  apiEndpoint = '/api/jupiter-analytics/track',
  apiKey = '',
  userId = null,
  batchSize = 10,
  flushInterval = 5000
}) {
  useEffect(() => {
    // Set global config before script loads
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
              forward: ['JupiterAnalytics'],
              debug: ${process.env.NODE_ENV === 'development'}
            };
          `,
        }}
      />

      {/* Load Jupiter Analytics script */}
      <Script
        src="/jupiter-analytics.js"
        strategy="worker"
        onLoad={() => {
          console.log('✅ Jupiter Analytics loaded in web worker');
        }}
        onError={(e) => {
          console.error('❌ Jupiter Analytics load failed:', e);
        }}
      />
    </>
  );
}