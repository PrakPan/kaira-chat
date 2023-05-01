import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useOnWindowResize } from '../../hooks/useOnWindowResize';

interface Props {
  x: number;
  width: number;
  height: number;
}

interface MarkerPos extends Props {
  prevX: number;
  prevWidth: number;
}

interface OnSelectProps {
  isSelected: boolean;
  ref?: React.RefObject<HTMLElement>;
}

export interface NavigationMarkerHandlers {
  onMouseLeave: (props: OnSelectProps) => void;
  onMouseEnter: (props: OnSelectProps) => void;
  onSelect: (props: OnSelectProps) => void;
}

export const ACTIVE_MARKER_HEIGHT_PX = 4;
export const HOVER_MARKER_HEIGHT_PX = 6;

export const useNavigationMarker = () => {
  const [markerPos, setMarkerPos] = useState<MarkerPos>({
    // Initial height is not 0 because
    // we don't want the height to animate in.
    height: ACTIVE_MARKER_HEIGHT_PX,
    x: 0,
    prevX: 0,
    width: 0,
    prevWidth: 0,
  });

  const onSelect = useCallback(({ isSelected, ref }: OnSelectProps) => {
    if (!isSelected || !ref?.current) return;
    const x = ref.current.offsetLeft;
    const { width } = ref.current.getBoundingClientRect();
    setMarkerPos({
      height: ACTIVE_MARKER_HEIGHT_PX,
      prevWidth: width,
      prevX: x,
      width,
      x,
    });
  }, []);

  const onMouseEnter = useCallback(
    ({ isSelected, ref }: OnSelectProps) => {
      if (isSelected || !ref?.current) return;
      const x = ref.current.offsetLeft;
      const { width } = ref.current.getBoundingClientRect();
      setMarkerPos((prev) => ({
        ...prev,
        height: HOVER_MARKER_HEIGHT_PX,
        width,
        x,
      }));
    },
    [setMarkerPos]
  );

  const onMouseLeave = useCallback(
    ({ isSelected }: OnSelectProps) => {
      if (isSelected) return;
      setMarkerPos((prev) => ({
        ...prev,
        height: ACTIVE_MARKER_HEIGHT_PX,
        width: prev.prevWidth,
        x: prev.prevX,
      }));
    },
    [setMarkerPos]
  );

  return {
    markerPos,
    onSelect,
    onMouseEnter,
    onMouseLeave,
  };
};

export const useLinkWithMarker = <RefType extends HTMLElement>({
  isSelected,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}: OnSelectProps & NavigationMarkerHandlers) => {
  const ref = useRef<RefType>(null);

  const handleSelect = useCallback(() => onSelect({ ref, isSelected }), [
    onSelect,
    isSelected,
  ]);

  const handleMouseEnter = useCallback(
    () => onMouseEnter({ ref, isSelected }),
    [onMouseEnter, isSelected]
  );

  const handleMouseLeave = useCallback(
    () => onMouseLeave({ ref, isSelected }),
    [onMouseLeave, isSelected]
  );

  useOnWindowResize(handleSelect);

  useEffect(handleSelect, [handleSelect]);

  return { ref, handleSelect, handleMouseEnter, handleMouseLeave };
};

export const NavigationMarker = styled.div<Props>`
  position: absolute;
  /* 1px border negative margin */
  bottom: -1px;
  height: ${({ height }) => height || ACTIVE_MARKER_HEIGHT_PX}px;
  width: ${({ width }) => width || 0}px;
  margin-left: ${({ x }) => x || 0}px;
  background: #f7e700;
  transition: all ease 0.3s;
  pointer-events: none;
`;
