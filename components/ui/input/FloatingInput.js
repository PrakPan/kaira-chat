import React from "react";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  height: ${(props) => props.height || "50px"};
  width: ${(props) => props.width || "100%"};
`;

const Input = styled.input`
  height: ${(props) => props.height || "50px"};
  width: ${(props) => props.width || "100%"};
  font-size: 14px;
  padding-inline: 20px;
  font-style: normal;
border : 1px solid #D0D5DD;
border-radius : 0.5rem;
box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
font-weight: 400;
font-size: 14px;
line-height: 24px;
`;

const Label = styled.label`
  position: absolute;
  pointer-events: none;
  left: 20px;
  top: 14px;
  transition: 0.3s ease all;
  ${Input}:focus ~ & {
    top: -5px;
    left: 10px;
    font-size: 11px;
    padding-inline: 5px;
    background: white;
  }
`;

const FloatingInput = (props) => (
  <Container
    style={props.ContainerStyle}
    height={props.height}
    width={props.width}
    className='font-poppins'
  >
    <Input {...props} height={props.height} width={props.width} placeholder={''} />
    <Label style={props.labelStyle}>{props.label || props.placeholder}</Label>
  </Container>
);

export default FloatingInput;
