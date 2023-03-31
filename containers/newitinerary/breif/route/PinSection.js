import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Pin from './Pin';

const Container = styled.div`
  display: grid;
  grid-template-columns: max-content auto;
`;
const Heading = styled.div`
  font-weight: 650;
  margin: 0 0 0 2rem;
  color: black;

  font-size: 16px;
  line-height: 28px;
  display: flex;
  align-items: center;
`;

const PinSection = (props) => {
  useEffect(() => {}, []);

  return (
    <Container>
      <Pin duration={props.duration} pinColour={props.pinColour}></Pin>
      <Heading>
        {props.duration ? props.city + ' (' + props.duration + ')' : props.city}
      </Heading>
    </Container>
  );
};

export default PinSection;
