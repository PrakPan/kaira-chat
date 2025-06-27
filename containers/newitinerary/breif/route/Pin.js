import styled from "styled-components";
import { useEffect } from "react";

const Container = styled.div`
  border-radius: 50%;
  background-color: ${(props) => (props.pinColour ? props.pinColour : "black")};
  width: 24px;
  height: 24px;
  z-index: 0;

  display: flex;
  align-items: center;
  justify-content: center;
`;


const InnerContainer = styled.div`
  border-radius: 50%;
  background-color: ${(props) =>
    (props.index === -1 || (props.length && props.index === props.length - 1) || props?.index==null)
      ? "yellow"
      : "white"};
  width: 6px;
  height: 6px;
`;

const Pin = (props) => {
  console.log("props1 are:",props)
  return (
    <Container
      className="center-div"
      pinColour={props.pinColour}
      index={props?.index}
      length={props?.length}
    >
      <InnerContainer
        duration={props.duration}
        pinColour={props.pinColour}
        index={props?.index}
      ></InnerContainer>
    </Container>
  );
};

export default Pin;
