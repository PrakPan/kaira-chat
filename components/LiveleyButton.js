import React from 'react';
import styled, { css, keyframes } from 'styled-components';
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;
const Button = styled.button`
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
  }

  &:active {
    transform: scale(0.95);
  }
  ${(props) =>
    props.animate &&
    css`
      animation: ${pulse} 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    `};
  /* ${(props) => animate} */
`;

export function LivelyButton({ children, className, onClick }) {
  const [animate, setAnimate] = React.useState(false);

  const animateButton = () => {
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
      onClick();
    }, 500);
  };

  return (
    <Button
      className={`lively-button ${className}`}
      animate={animate}
      onClick={animateButton}
    >
      {children}
    </Button>
  );
}
