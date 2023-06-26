import styled from 'styled-components';
import { useState, useEffect } from 'react';

const Container = styled.div`
  border-radius: 50%;
  background-color: ${(props) => (props.pinColour ? props.pinColour : 'black')};
  width: 25px;
  height: 25px;
  z-index: 2;
`;
const InnerContainer = styled.div`
  border-radius: 50%;

  background-color: ${(props) => (props.pinColour ? 'white' : '#f7e700')};
  width: 7px;
  height: 7px;
`;

const Pin = (props) => {
  useEffect(() => {}, []);

  return (
    <Container className="center-div" pinColour={props.pinColour}>
      <InnerContainer
        duration={props.duration}
        pinColour={props.pinColour}
      ></InnerContainer>
    </Container>
  );
};

export default Pin;
