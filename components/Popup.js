import React, { useState } from "react";
import styled, { css, keyframes } from "styled-components";

const PopupWrapper = styled.div`
  position: relative;
`;

export const Popup = ({ children, content }) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <PopupWrapper>
      <PopupTarget
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
      >
        {children}
      </PopupTarget>
      {showPopup && <PopupContent>{content}</PopupContent>}
    </PopupWrapper>
  );
};

const PopupTarget = styled.div`
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;

  &:hover {
    background-color: #eee;
  }

  ${(showPopup) =>
    showPopup &&
    css`
      background-color: #eee;
    `}
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PopupContent = styled.div`
  position: absolute;
  z-index: 1;
  opacity: 0;
  pointer-events: none;

  animation: ${({ showPopup }) =>
    showPopup &&
    css`
      ${fadeIn} 0.3s ease forwards
    `};
`;
