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
  /* initial styling for the popup trigger */
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;

  /* styling for the trigger when hovered */
  &:hover {
    background-color: #eee;
  }

  /* styling for the trigger when the popup content is visible */
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
  /* initial styling for the popup content */
  position: absolute;
  z-index: 1;
  opacity: 0;
  pointer-events: none;

  /* animation to fade in the content */
  animation: ${({ showPopup }) =>
    showPopup &&
    css`
      ${fadeIn} 0.3s ease forwards
    `};
  /* pointer-events: none prevents the user from interacting with the popup content while it's invisible */
`;
