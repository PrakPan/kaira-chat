import React from "react";
import styled from "styled-components";

const StyledOption = styled.option`
  font-family: ${(props) => props.theme.font.nunito}, sans-serif;
  color: ${(props) => props.color || props.theme.colors.secondary};
  background: ${(props) => props.bgColor || "white"};
  font-size: 1.2rem;
  font-weight: bolder;
  padding-left: 20px;
`;

const Option = (props) => {
  const { color, bgColor, value, selected } = props;
  return selected ? (
    <StyledOption color={color} bgColor={bgColor} value={value} selected>
      {props.children}
    </StyledOption>
  ) : (
    <StyledOption color={color} bgColor={bgColor} value={value}>
      {props.children}
    </StyledOption>
  );
};
export default Option;
