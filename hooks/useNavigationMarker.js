import { useCallback, useState, useEffect } from "react";
import styled from "styled-components";

/**
 * `stickyRef` is the tab bar pinned to the top of the scroll container. Its
 * height is read at scroll time (not render time, so it is never stale) and
 * treated as the real top edge — otherwise a section parked just below the bar
 * still counts as "not reached yet" and the previous tab stays highlighted.
 */
export const useNavigationMarker = (scrollContainerRef, sectionIds = [], onActiveTabChange, stickyRef) => {
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
    const stickyOffset = stickyRef?.current?.offsetHeight || 0;

    for (let i = 0; i < sectionIds.length; i++) {
      const section = document.getElementById(sectionIds[i]);
      if (!section) continue;

      const sectionRect = section.getBoundingClientRect();
      const relativeTop = sectionRect.top - containerRect.top - stickyOffset;

      // 1px tolerance on both edges. Scrolling a section exactly to the top
      // leaves the previous section's bottom at a fractional offset
      // (getBoundingClientRect is subpixel, offsetHeight is rounded), so a
      // strict `< offsetHeight` still counted the previous section as on
      // screen — and it wins because it's checked first. That kept "About"
      // highlighted after jumping to "Rooms".
      const TOLERANCE = 1;
      if (
        relativeTop <= TOLERANCE &&
        relativeTop + section.offsetHeight > TOLERANCE
      ) {
        onActiveTabChange && onActiveTabChange(i, sectionIds[i]);
        break;
      }
    }
  };

  container.addEventListener("scroll", handleScroll);
  return () => container.removeEventListener("scroll", handleScroll);
}, [sectionIds, scrollContainerRef, onActiveTabChange, stickyRef]);


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
