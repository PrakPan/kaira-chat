import { useCallback, useState, useEffect } from "react";
import styled from "styled-components";

export const useNavigationMarker = (scrollContainerRef, sectionIds = [], onActiveTabChange) => {
  const [markerPos, setMarkerPos] = useState({
    x: 0,
    width: 0,
  });

  const onSelect = useCallback(({ ref }) => {
    if (!ref.current) return;
    const x = ref.current.offsetLeft;
    const { width } = ref.current.getBoundingClientRect();
    setMarkerPos({
      width,
      x,
    });
  }, []);


  useEffect(() => {
  const container = scrollContainerRef?.current;
  if (!container) return;

  const handleScroll = () => {
    const containerRect = container.getBoundingClientRect();

    for (let i = 0; i < sectionIds.length; i++) {
      const section = document.getElementById(sectionIds[i]);
      if (!section) continue;

      const sectionRect = section.getBoundingClientRect();
      const relativeTop = sectionRect.top - containerRect.top;

      if (relativeTop <= 0 && Math.abs(relativeTop) < section.offsetHeight) {
        onActiveTabChange && onActiveTabChange(i, sectionIds[i]);
        break;
      }
    }
  };

  container.addEventListener("scroll", handleScroll);
  return () => container.removeEventListener("scroll", handleScroll);
}, [sectionIds, scrollContainerRef, onActiveTabChange]);


  return {
    markerPos,
    onSelect,
  };
};

export const NavigationMarker = styled.div`
  position: absolute;
  bottom: -1px;
  left: ${({ x }) => x || 0}px;
  height: 4px;
  width: ${({ width }) => width || 0}px;
  background: #f7e700;
  transition: all ease 0.3s;
`;
