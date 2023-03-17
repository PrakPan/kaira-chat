import styled from 'styled-components';
import { useState, useEffect } from 'react';
// import Pin from './Pin';
 import {MdOutlineFlightTakeoff} from 'react-icons/md';
const  Container = styled.div`
display: grid;
grid-template-columns: 30px auto;
min-height: 10vw;
`;
// const Heading = styled.div`
//     font-weight: 600;
//     margin: 0 0 0 0.75rem;
//     line-height: 24px;
//     display: flex;
//     align-items: center;
// `;
const Line = styled.div`
  border-style: dashed;
  border-image-source: linear-gradient(
    to-bottom,
    ${props => props.GColour[0]},
    ${props => props.GColour[1]}
  );
  
  border-width: 1px;
  position: absolute;
  left: 50%;
  min-height: 10vw;
  height: 100%;
`;
const Text = styled.div`
  color: #0883c9;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 28px;
  display: flex;
  align-items: center;
  margin: 2rem 0 2rem 2rem;
`;
const MidSection = (props) => {
   
    useEffect(() => {
      
    },[]);

  return (
    <Container className="font-poppins">
      <div style={{ position: 'relative' }}>
        <Line GColour={props.GColour}></Line>
      </div>
      <Text>
        <TransportIconFetcher
          TransportMode={props.transportMode}
          Instyle={{
            fontSize: '1.75rem',
            marginRight: '0.8rem',
            color: 'black',
          }}
        />
        {/* <MdOutlineFlightTakeoff
          style={{  }}
        /> */}
        {props.transportMode}: {props.duration}h 30m
      </Text>
      {/* <Heading>{props.duration ? props.location +  " ("+ props.duration+")": props.location }</Heading> */}
    </Container>
  );
};

export default MidSection;