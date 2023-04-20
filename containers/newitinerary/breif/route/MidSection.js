import styled from 'styled-components';
import { useState, useEffect } from 'react';
// import Pin from './Pin';
import { MdOutlineFlightTakeoff } from 'react-icons/md';
import { TransportIconFetcher } from '../../../../helper/TransportIconFetcher';
const Container = styled.div`
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
  border-width: 1.4px;
  position: absolute;
  left: 50%;
  border-color: #374259;
  min-height: 10vw;
  height: 100%;
`;
const Text = styled.div`
  color: #111;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 28px;
  display: flex;
  align-items: center;
  margin: 0rem 0 0rem 1rem;
`;
const MidSection = (props) => {
  useEffect(() => {}, []);

  return (
    <Container className="font-poppins">
      <div style={{ position: 'relative' }}>
        <Line></Line>
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
        {props.transportMode ? props.transportMode : 'Taxi'}: {props.duration}h
        30m
      </Text>
      {/* <Heading>{props.duration ? props.location +  " ("+ props.duration+")": props.location }</Heading> */}
    </Container>
  );
};

export default MidSection;
