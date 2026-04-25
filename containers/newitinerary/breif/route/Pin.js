import styled from "styled-components";
import { useEffect } from "react";

const Container = styled.div`
  border-radius: 50%;
  background-color: ${(props) => (props.pinColour ? props.pinColour : "black")};
  width: 20px;
  height: 20px;
  z-index: 0;

  display: flex;
  align-items: center;
  justify-content: center;
`;


const InnerContainer = styled.div`
  border-radius: 50%;
  background-color: ${(props) => (props.inner ? "#fefcbf" : "#fff")};
  width: 8px;
  height: 8px;
`;

//  background-color: ${(props) =>
//     (props.index === -1 || (props.length && props.index === props.length - 1) || props?.index==null)
//       ? "yellow"
//       : "white"};

const Pin = (props) => {
  return (
    <Container
      className={`center-div ${props.className ? props.className : ""}`}
      pinColour={props.pinColour}
      index={props?.index}
      length={props?.length}
    >
      <InnerContainer
        duration={props.duration}
        pinColour={props.pinColour}
        index={props?.index}
        inner={props?.inner}
      ></InnerContainer>
    </Container>
  );
};

export default Pin;
