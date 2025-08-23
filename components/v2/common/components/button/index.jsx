import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: 2px solid #333;
  border-radius: 20px;
  background-color: ${(props) =>
    props.variant === "filled" ? "#333" : "transparent"};
  color: ${(props) => (props.variant === "filled" ? "#fff" : "#333")};
  font-size: 16px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  text-decoration: none;
  white-space: nowrap;
  min-height: 48px;

  &:hover {
    background-color: ${(props) =>
      props.variant === "filled" ? "#555" : "#333"};
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* Size variations */
  ${(props) =>
    props.size === "small" &&
    `
    padding: 8px 16px;
    font-size: 14px;
    min-height: 36px;
    border-radius: 16px;
  `}

  ${(props) =>
    props.size === "large" &&
    `
    padding: 16px 32px;
    font-size: 18px;
    min-height: 56px;
    border-radius: 24px;
  `}
  
  /* Color variations */
  ${(props) =>
    props.color === "primary" &&
    `
    border-color: #007bff;
    background-color: ${props.variant === "filled" ? "#007bff" : "transparent"};
    color: ${props.variant === "filled" ? "#fff" : "#007bff"};
    
    &:hover {
      background-color: #0056b3;
      border-color: #0056b3;
      color: #fff;
    }
  `}
  
  ${(props) =>
    props.color === "success" &&
    `
    border-color: #28a745;
    background-color: ${props.variant === "filled" ? "#28a745" : "transparent"};
    color: ${props.variant === "filled" ? "#fff" : "#28a745"};
    
    &:hover {
      background-color: #1e7e34;
      border-color: #1e7e34;
      color: #fff;
    }
  `}
  
  ${(props) =>
    props.color === "danger" &&
    `
    border-color: #dc3545;
    background-color: ${props.variant === "filled" ? "#dc3545" : "transparent"};
    color: ${props.variant === "filled" ? "#fff" : "#dc3545"};
    
    &:hover {
      background-color: #bd2130;
      border-color: #bd2130;
      color: #fff;
    }
  `}
  
  /* Full width */
  ${(props) =>
    props.fullWidth &&
    `
    width: 100%;
  `}
`;

const Button = ({
  children,
  variant = "outline", // 'outline' | 'filled'
  size = "medium", // 'small' | 'medium' | 'large'
  color = "default", // 'default' | 'primary' | 'success' | 'danger'
  fullWidth = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      size={size}
      color={color}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
