import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const MotionDivWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const AnimatePresence = ({ children }) => {
  const [animateList, setAnimateList] = useState([]);

  const prevChildren = usePrevious(children);

  useEffect(() => {
    // Find all the keys that have been removed from the previous children
    const prevKeys = (prevChildren || []).map((child) => child.key);
    const currentKeys = children.map((child) => child.key);
    const removedKeys = prevKeys.filter((key) => !currentKeys.includes(key));

    // Remove the removed keys from the animate list
    setAnimateList((list) =>
      list.filter((item) => !removedKeys.includes(item.key))
    );

    // Add new items to the animate list
    children.forEach((child) => {
      if (!animateList.find((item) => item.key === child.key)) {
        setAnimateList((list) => [
          ...list,
          { key: child.key, element: child },
        ]);
      }
    });
  }, [children]);

  return (
    <>
      {animateList.map((item) => (
        <MotionDivWrapper key={item.key}>{item.element}</MotionDivWrapper>
      ))}
    </>
  );
};

const motion = {
  div: ({ children, animate, transition, style }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const ref = useRef();

    useEffect(() => {
      if (animate && !isVisible) {
        setIsVisible(true);
      } else if (!animate && isVisible) {
        setIsExiting(true);
      }
    }, [animate]);

    useEffect(() => {
      if (ref.current && isExiting) {
        ref.current.addEventListener("animationend", handleAnimationEnd);
      }
      return () => {
        if (ref.current && isExiting) {
          ref.current.removeEventListener("animationend", handleAnimationEnd);
        }
      };
    }, [ref.current, isExiting]);

    const handleAnimationEnd = () => {
      setIsVisible(false);
      setIsExiting(false);
    };

    const defaultStyle = { opacity: 0, transition: "opacity 0.2s ease-out" };
    const transitionStyle = {
      ...defaultStyle,
      ...(transition ? transition : {}),
    };
    const animateStyle = {
      ...defaultStyle,
      ...style,
      ...(animate ? { opacity: 1 } : {}),
    };
    const mergedStyle = isExiting ? defaultStyle : animateStyle;

    return (
      <>
        {isVisible && (
          <div style={transitionStyle} ref={ref}>
            <div style={mergedStyle}>{children}</div>
          </div>
        )}
      </>
    );
  },
};

export { AnimatePresence, motion };
