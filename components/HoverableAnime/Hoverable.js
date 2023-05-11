import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const Inner = styled.div`
  transition: all 0.5s;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

const ClampedText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Hoverable = ({ children, width, height, onHover }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    ref.current.addEventListener('mouseover', () => setIsHovered(true));
    ref.current.addEventListener('mouseleave', () => setIsHovered(false));
  }, []);

  return (
    <Wrapper width={width} height={height} ref={ref}>
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        initial="hidden"
        onHover={() => onHover && onHover(isHovered)}
      >
        <Inner>
          <ClampedText>{children}</ClampedText>
        </Inner>
      </motion.div>
    </Wrapper>
  );
};

export default Hoverable;
