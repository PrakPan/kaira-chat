import styled from "styled-components";
import { useEffect } from "react";

const Container = styled.div`
  border-radius: 50%;
  background-color: ${(props) => (props.pinColour ? props.pinColour : "black")};
  width: 25px;
  height: 25px;
  z-index: 0;
`;

const InnerContainer = styled.div`
  border-radius: 50%;
  background-color: ${(props) =>
    props.index === 0 || (props.length && props.index === props.length - 1)
      ? "white"
      : "yellow"};
  width: 7px;
  height: 7px;
`;

const  Pin = (props) => {
  console.log("Length",props?.length,props?.index)
  useEffect(() => {}, []);

  return (
    <Container className="center-div" pinColour={props.pinColour} index={props?.index} length={props?.length}>
      <InnerContainer
        duration={props.duration}
        pinColour={props.pinColour}
      ></InnerContainer>
    </Container>
  );
};

export default Pin;
