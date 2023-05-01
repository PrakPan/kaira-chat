import { useEffect, useRef } from 'react';

export const useOnWindowResize = (fn: () => void, delay = 100) => {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleWindowResize = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(fn, delay);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      // Cleanup on unmount.
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener('resize', handleWindowResize);
    };
  });
};
