import React from "react";
import styled from "styled-components";
const Container = styled.div`
  display: ${(props) => (props.display ? props.display : "block")};
  height: max-content;
`;

const Spinner = styled.div`
  color: ${(props) =>
    props.color ? props.color + " !important" : "black !important"};
  padding: 0.4rem;
  position : absolute;
  display : inline-block;
  margin: ${(props) => (props.margin ? props.margin : "1rem")};
  visibility: ${(props) => (props.visibility ? props.visibility : "visibile")};
  height: ${(props) => (props.size ? props.size + "px" : "40px")};
  width: ${(props) => (props.size ? props.size + "px" : "40px")};
  border: ${(props) =>
    props.color ? `4px solid ${props.color}` : "4px solid black"};
  border-top: 4px transparent solid;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  &:hover {
    ${(props) => props.hoverColor && `4px solid ${props.hoverColor}`};
  }
`;
const spinner = (props) => {
  let size = 40;
  if (props.size) size = props.size;
  return (
    <Container display={props.display}>
      <Spinner
        color={props.color}
        hoverColor={props.hoverColor}
        visibility={props.visibility}
        margin={props.margin}
        size={size}
      ></Spinner>
    </Container>
  );
};

export default React.memo(spinner);