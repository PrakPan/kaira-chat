import styled from 'styled-components';
import { useState, useEffect } from 'react';

const Container = styled.div`
  border-radius: 50%;
  background-color: ${(props) =>
    props.pinColour ? props.pinColour : 'black'};
  width: 30px;
  height: 30px;
`;
const InnerContainer = styled.div`
  border-radius: 50%;

  background-color: ${(props) =>
    props.pinColour ? 'black' : '#f7e700'};
  width: 10px;
  height: 10px;
`;

const Pin = (props) => {
  useEffect(() => {}, []);

  return (
    <Container className="center-div" pinColour={props.pinColour}>
      <InnerContainer duration={props.duration} pinColour={props.pinColour}></InnerContainer>
    </Container>
  );
};

export default Pin;
