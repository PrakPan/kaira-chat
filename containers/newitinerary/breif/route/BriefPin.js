import styled from "styled-components";

const Container = styled.div`
  border-radius: 50%;
  background-color: ${(props) => (props.pinColour ? props.pinColour : "black")};
  width: 24px;
  height: 24px;
  z-index: 0;
`;

const InnerContainer = styled.div`
  border-radius: 50%;
  background-color: ${(props) =>
    props.index === 0 || props.index === (props.length ? props.length - 1 : 0)
      ? "yellow"
      : "white"};
  width: 7px;
  height: 7px;
`;

const BriefPin = (props) => {
  console.log("Pin2", props?.index, props?.length);

  return (
    <Container className="center-div" pinColour={props.pinColour} index={props?.index} length={props?.length}>
      <InnerContainer
        pinColour={props.pinColour}
        index={props.index}      
        length={props.length}     
      ></InnerContainer>
    </Container>
  );
};

export default BriefPin;
