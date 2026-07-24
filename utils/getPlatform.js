const getPlatform = () => {
  // Guard against SSR/prerender where navigator/window are undefined.
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return 'desktop';
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return 'tablet';
  }

  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    return 'mobile';
  }
  

  if (width <= 768) {
    return 'mobile';
  } else if (width <= 1024) {
    return 'tablet';
  }
  
  return 'desktop';
};

export default getPlatform;