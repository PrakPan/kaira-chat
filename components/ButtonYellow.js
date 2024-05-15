import React, { useState } from "react";
import styled, { css, keyframes } from "styled-components";

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.03);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const StyledButton = styled.button`
  background-color: ${(props) => (props.primary ? "#F7E700" : "#FFFFFF")};
  color: ${(props) => (props.primary ? "#01202B" : "#3498db")};
  border: 2px solid #000000;
  font-weight: 500;
  font-family: lexend;
  box-shadow: 0px 1px 0px #f0f0f0;
  border-radius: 6px;

  align-self: center;
  font-size: 12px;
  padding: 10px 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8e000;
    transform: scale(0.95);
  }

  ${(props) =>
    props.mountAnimation &&
    css`
      opacity: 0;
      transform: translateY(-50px);
      animation: mountIn 0.5s forwards;

      @keyframes mountIn {
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `}

  ${(props) =>
    props.unmountAnimation &&
    css`
      animation: mountOut 0.5s forwards;

      @keyframes mountOut {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(-50px);
          opacity: 0;
        }
      }
    `}
    &:active {
    transform: scale(0.95);
  }
  ${(props) =>
    props.animate &&
    css`
      animation: ${pulse} 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    `};
`;

const ButtonYellow = ({
  children,
  styleClass,
  onClick,
  primary = true,
  hoverAnimation = true,
  clickAnimation = true,
  mountAnimation = true,
  unmountAnimation = false,
  ...rest
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [animate, setAnimate] = React.useState(false);

  const handleAnimationEnd = () => {
    setIsMounted(!isMounted);
  };

  function animateButton(e) {
    e.stopPropagation();
    setAnimate(true);
    setTimeout((e) => {
      if (e) {
        e.stopPropagation();
      }

      setAnimate(false);
      onClick();
    }, 500);
  }

  return (
    <StyledButton
      className={styleClass}
      primary={primary}
      animate={animate}
      onClick={(e) => {
        animateButton(e);
      }}
      hoverAnimation={hoverAnimation}
      clickAnimation={clickAnimation}
      mountAnimation={mountAnimation}
      unmountAnimation={unmountAnimation}
      onAnimationEnd={handleAnimationEnd}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

export default ButtonYellow;
