import styled from 'styled-components';
import { useState, useEffect } from 'react';
// import Pin from './Pin';
import { MdOutlineFlightTakeoff } from 'react-icons/md';
import { TransportIconFetcher } from '../../../../helper/TransportIconFetcher';
import ImageLoader from '../../../../components/ImageLoader';
const Container = styled.div`
  display: grid;
  grid-template-columns: 30px auto;
  min-height: 5rem;
  @media screen and (min-width: 768px) {
    min-height: 8rem;
  }
`;
// const Heading = styled.div`
//     font-weight: 600;
//     margin: 0 0 0 0.75rem;
//     line-height: 24px;
//     display: flex;
//     align-items: center;
// `;
const Line = styled.hr`
  /* background-image: linear-gradient(90deg,transparent,transparent 20%,#fff 50%,#fff 100%),linear-gradient(87deg,#0d6efd,#00fff0,#d4ff00,#ff7000,#ff0000); */
  background-image: linear-gradient(90deg, transparent 50%, #fff 60%, #fff 100%),
  ${(props) =>
    props.pinColour
      ? `linear-gradient(87deg, ${props.pinColour},${props.pinColour}, #000)`
      : `linear-gradient(87deg,  #f7e700,#0d6efd)`};
   
  background-size: 15px 3px, 100% 3px;

  color: #c80000;
  -webkit-transform: rotate(90deg);
  position: absolute;
  width: 5rem;
    height: 2px;
    top: 23px;
    right: -25px;
 
  border: 2px;
  opacity: initial;
  
  @media screen and (min-width: 768px){
    width: 8rem;
  height: 2px;
  top: 46px;
  right: -48px;
}
  /* border-style: dashed;
  border-width: 1.4px;
  position: absolute;
  left: 50%;
  

  border-color: ${(props) => (props.pinColour ? props.pinColour : 'black')};
  min-height: 10vw;
  height: 100%;
  margin: 0rem 0 0rem 0rem; */
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
    <Container className="font-lexend">
      <div style={{ position: 'relative' }}>
        <Line pinColour={props.pinColour} />
      </div>
      <Text>
        {/* {props.icon ?? (
          <ImageLoader
            url={props.icon}
            leftalign
            dimensions={{ width: 200, height: 200 }}
            width="1.25rem"
            widthmobile="1.25rem"
          ></ImageLoader>
        )} */}
        {props.modes && (
          <TransportIconFetcher
            TransportMode={props.modes}
            Instyle={{
              fontSize: '1.75rem',
              marginRight: '0.8rem',
              color: 'black',
            }}
          />
        )}
        {/* <MdOutlineFlightTakeoff
          style={{  }}
        /> */}
        {props.transportMode ? props.transportMode : 'taxi'}: {props.duration}h
        30m
      </Text>
      {/* <Heading>{props.duration ? props.location +  " ("+ props.duration+")": props.location }</Heading> */}
    </Container>
  );
};

export default MidSection;
