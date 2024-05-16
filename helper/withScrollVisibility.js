import React, { useEffect, useState, useRef } from "react";

const ScrollVisibleHOC = ({ visibleTime, containerRef, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  let timeoutId = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      clearTimeout(timeoutId.current);
      setIsVisible(true);
      timeoutId.current = setTimeout(() => {
        setIsVisible(false);
      }, visibleTime);
    };

    if (containerRef && containerRef.current) {
      containerRef.current.addEventListener("scroll", handleScroll);
    } else {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (containerRef && containerRef.current) {
        containerRef.current.removeEventListener("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
      clearTimeout(timeoutId.current);
    };
  }, [visibleTime, containerRef]);

  return <>{isVisible && children}</>;
};

export default ScrollVisibleHOC;
