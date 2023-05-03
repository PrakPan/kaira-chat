import React from 'react';
import styled from 'styled-components';
import { TransportIconFetcher } from '../../../helper/TransportIconFetcher';
import ImageLoader from '../../../components/ImageLoader';

const Container = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 30px auto;
  min-height: 5rem;
  @media screen and (min-width: 768px) {
    min-height: 8rem;
  }
`;
//
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

const TransferModeContainer = (props) => {
  const Facilities = ['4 Seater', 'AC', '2 Luggage bags'];
  return (
    <Container>
      <div style={{ position: 'relative' }}>
        <Line pinColour={props.pinColour} />
      </div>
      <div className="flex flex-row gap-2 w-full py-4">
        {props.modes && (
          <div className="grid bg-[#F4F4F4] place-items-center w-32 rounded-2xl">
            {/* <TransportIconFetcher
              TransportMode={props.modes}
              Instyle={{
                fontSize: '1.75rem',
                marginRight: '0.8rem',
                color: 'black',
              }}
            /> */}

            {props.icon && (
              <ImageLoader
                url={props.icon}
                leftalign
                dimensions={{ width: 800, height: 500 }}
                width="4rem"
                widthmobile="4rem"
              ></ImageLoader>
            )}
          </div>
        )}

        <div className="flex flex-col">
          <div className="text-[#01202B] flex flex-row gap-1 font-medium">
            <div>Private transfer</div>
            <div>
              ({props.transportMode ? props.transportMode : 'taxi'}:{' '}
              {props.duration}h 30m)
            </div>
          </div>
          {props.taxi_type && (
            <div className="text-[#7A7A7A] font-light">{props.taxi_type}</div>
          )}

          <div className="text-[#01202B] font-normal flex flex-row mt-3">
            <div className="pr-1">Facilities:</div>
            {Facilities.map((data, index) => (
              <div className="flex flex-row gap-1">
                {index > 0 ? <span className="pl-1">|</span> : null}

                <div>{data}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TransferModeContainer;
