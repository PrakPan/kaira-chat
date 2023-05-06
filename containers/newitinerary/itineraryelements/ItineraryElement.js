import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { AiFillCar } from 'react-icons/ai';
import ImageLoader from '../../../components/ImageLoader';
import Button from '../../../components/ui/button/Index';
import { ITINERARY_ELEMENT_TYPES } from '../../../services/constants';
import { FaHome } from 'react-icons/fa';

import { HLine } from '../../itinerary/New_Itenary_DBD/New_itenaryStyled';
const padding = {
  initialLeft: '60px',
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-style: normal;
  font-weight: 400;

  line-height: 22px;

  padding: 0px 0px 0px 0px;
  color: #01202b;
`;

const SectionOneText = styled.span``;
const GridContainer = styled.div`
  display: grid;
  margin-top: 1rem;
  grid-template-columns: ${(props) => (props.image ? '1fr 2fr' : '1fr')};
  grid-column-gap: 0.5rem;
`;
const Text = styled.p`
  overflow: hidden;
  line-height: 1.5;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 14px;
  font-weight: 400;
`;
const Heading = styled.p`
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 18px;
  line-height: 1;
`;
const Line = styled.div`
  border-style: none none solid none;
  border-color: #f0f0f0;
  border-width: 1px;
`;
export const TInfoContainer = styled.div`
  @media screen and (min-width: 768px) {
    display: flex;

    flex-direction: row;
    & > div {
      padding-left: ${padding.initialLeft};
      width: 100%;
    }
  }
`;
const ItineraryElement = (props) => {
  useEffect(() => {}, []);

  return (
    <Container className="pt-3">
      {/* <div>{props.time}</div> */}
      {/* <SectionOneText>{props.time}</SectionOneText> */}
      {/* <HLine style={{ width: '2rem' }}></HLine> */}

      <div className="flex flex-row ">
        <div className=" flex justify-center items-center ">
          <div className="w-[6.15rem] grid place-items-center">
            <FaHome className="text-black lg:text-[3.05rem]   text-[1.25rem]" />
          </div>

          {/* <ImageLoader
            url={props.icon}
            leftalign
            dimensions={{ width: 200, height: 200 }}
            width="4.05rem"
            widthmobile="1.25rem"
          ></ImageLoader> */}
        </div>
        <div
          style={{ display: 'flex', alignItems: 'center' }}
          className="pl-[1.4rem]"
        >
          <div className="flex flex-col">
            <div className="text-base font-bold">{props.heading}</div>
            <div>
              <div className="pt-1 line-clamp-3 font-normal text-sm mb-3">
                {props.text ? props.text : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div style={{ marginLeft: '0px' }}>
        <ImageLoader
          url={props.icon}
          leftalign
          dimensions={{ width: 200, height: 200 }}
          width="3.25rem"
          widthmobile="1.25rem"
        ></ImageLoader>
      </div> */}

      {/* <AiFillCar style={{ margin: "-2px 0  0 0.5rem" }}></AiFillCar>
        {props.booking ? (
          <div
            style={{
              flexGrow: "1",
              justifyContent: "flex-end",
              display: "flex",
            }}
          >
            <Button
              borderRadius="8px"
              fontWeight="700"
              fontSize="12px"
              borderWidth="1.5px"
              padding="0.5rem 0.5rem"
              onclick={() => console.log("")}
            >
              View Booking
            </Button>
          </div>
        ) : null} */}
    </Container>
  );
};

export default ItineraryElement;
