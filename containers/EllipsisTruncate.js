import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineInfoCircle } from "react-icons/ai";
import styled from "styled-components";

// Tooltip component with animation using Framer Motion
const Tooltip = ({ text }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Ellipsis truncation component
const EllipsisTruncation = ({ text, maxCharacters = 20, tooltipText }) => {
  const [isOverflowed, setIsOverflowed] = useState(false);

  const checkOverflow = (element) => {
    if (element) {
      setIsOverflowed(element.offsetWidth < element.scrollWidth);
    }
  };

  return (
    <Container>
      <TextContainer
        ref={checkOverflow}
        title={isOverflowed ? text : null}
        maxCharacters={maxCharacters}
      >
        {text.length > maxCharacters
          ? `${text.slice(0, maxCharacters)}...`
          : text}
        {isOverflowed && (
          <TooltipIconContainer>
            <AiOutlineInfoCircle />
            <Tooltip text={tooltipText} />
          </TooltipIconContainer>
        )}
      </TextContainer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: inline-block;
`;

const TextContainer = styled.div`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${(props) => `${props.maxCharacters}ch`};
`;

const TooltipIconContainer = styled.div`
  display: inline-block;
  margin-left: 4px;
  position: relative;

  &:hover {
    cursor: pointer;
  }
`;

export default EllipsisTruncation;
