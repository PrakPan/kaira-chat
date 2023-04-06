import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Pin from './Pin';

const Container = styled.div`
  cursor: pointer;
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

const PinSection = ({duration,city,pinColour,handlemap,Mapid}) => {
  useEffect(() => {}, []);

  return (
    <Container  className='cursor-pointer' onClick={()=>handlemap(Mapid)}>
      <Pin duration={duration} pinColour={pinColour}></Pin>
      <Heading>
        {duration ? city + ' (' + duration + ')' : city}
      </Heading>
    </Container>
  );
};

export default PinSection;
