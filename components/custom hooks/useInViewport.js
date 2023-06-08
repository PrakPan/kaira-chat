import { useState, useEffect, useRef } from "react";

function useInViewport() {
  const [inViewport, setInViewport] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current;
      if (isElementInViewport(element)) {
        setInViewport(true);
      } else {
        setInViewport(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

    const isElementInViewport = (element) => {
      if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  return [ref, inViewport];
}

export default useInViewport;
