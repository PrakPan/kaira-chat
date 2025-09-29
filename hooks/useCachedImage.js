import React, { useState, useEffect }  from 'react'

export default function useCachedImage(url, cacheKey, ttl = 86400000){
    const [cachedUrl, setCachedUrl] = useState(null);

    useEffect(() =>{
        let isMounted=true;
        async function fetchAndCache(){
            const cache=await caches.open(cacheKey);
            const cachedResponse=await cache.match("chatbot-image");
            if(cachedResponse){
                console.log("cachedResponse",cachedResponse);
                const storedDate = new Date(cachedResponse.headers.get("sw-cache-date"));
                const now=new Date();
                if(now-storedDate<ttl){
                    const blob = await cachedResponse.blob();
                    if (isMounted) setCachedUrl(URL.createObjectURL(blob));
                    return;
                }   
                else{
                    await cache.delete(cacheKey);
                }         
            }
            const response = await fetch(url, { cache: "reload" });
            const headers = new Headers(response.headers);
            headers.set("sw-cache-date", new Date().toISOString());
      
            const blob = await response.blob();
            const newResponse = new Response(blob, { headers });
            await cache.put(cacheKey, newResponse);
      
            if (isMounted) setCachedUrl(URL.createObjectURL(blob));
        }
        fetchAndCache();

    return () => {
      isMounted = false;
    };
  }, [url, cacheKey, ttl]);
  return cachedUrl;
}
