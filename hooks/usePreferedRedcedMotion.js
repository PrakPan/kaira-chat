import React from 'react';

const QUERY = '(prefers-reduced-motion: no-preference)';
const isRenderingOnServer = typeof window === 'undefined';
// eslint-disable-next-line no-confusing-arrow
const getInitialState = () =>
  // eslint-disable-next-line implicit-arrow-linebreak
  isRenderingOnServer ? true : !window.matchMedia(QUERY).matches;
export function usePrefersReducedMotion() {
  // eslint-disable-next-line operator-linebreak
  const [prefersReducedMotion, setPrefersReducedMotion] =
    React.useState(getInitialState);
  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    const listener = (event) => {
      setPrefersReducedMotion(!event.matches);
    };
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener);
    } else {
      mediaQueryList.addListener(listener);
    }
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', listener);
      } else {
        mediaQueryList.removeListener(listener);
      }
    };
  }, []);
  return prefersReducedMotion;
}
