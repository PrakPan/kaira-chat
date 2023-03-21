import React, { useState } from 'react';
import styled, { css } from 'styled-components';

const StyledButton = styled.button`
  background-color: ${(props) => (props.primary ? '#F7E700' : '#FFFFFF')};
  color: ${(props) => (props.primary ? '#01202B' : '#3498db')};
  border: 1.5px solid #000000;
  font-weight: 600;
  font-family: poppins;
  box-shadow: 0px 1px 0px #f0f0f0;
  border-radius: 6px;
  width: 70%;
  align-self: center;
  font-size: 12px;
  padding: 10px 0px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  @media screen and (min-width: 768px) {
    width: 40%;
    width: 100%;
    
  }
  &:hover {
    background-color: #f8e000;
    transform: scale(2);
  }

  &:active {
    transform: scale(2);
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
`;

const ButtonYellow = ({
  children,
  primary = true,
  hoverAnimation = true,
  clickAnimation = true,
  mountAnimation = true,
  unmountAnimation = false,
  ...rest
}) => {
  const [isMounted, setIsMounted] = useState(false);

  const handleAnimationEnd = () => {
    setIsMounted(!isMounted);
  };

  return (
    <StyledButton
      primary={primary}
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
