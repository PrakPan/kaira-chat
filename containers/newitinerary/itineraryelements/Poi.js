import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { AiFillCar } from 'react-icons/ai';
import ImageLoader from '../../../components/ImageLoader';
import Button from '../../../components/ui/button/Index';
import { ITINERARY_ELEMENT_TYPES } from '../../../services/constants';
import { HiPencil } from 'react-icons/hi';
import Rating from './Rating';
import Tips from './Tips';
import { HLine } from '../../itinerary/New_Itenary_DBD/New_itenaryStyled';
import StarRating from '../../../components/StarRating';

const padding = {
  initialLeft: '60px',
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;

  padding: 0px 0px 0px 0px;
  color: #01202b;
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

const SectionOneText = styled.span``;
const GridContainer = styled.div`
  display: grid;
  width: 100%;
  margin-top: 1rem;

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
`;
const Heading = styled.span`
  margin-bottom: 0rem;
  margin-right: 0.25rem;
  font-weight: 500;
  line-height: 1;
`;
const Line = styled.div`
  border-style: none none solid none;
  border-color: #e4e4e4;
  border-width: 1px;
`;
const BoldTags = styled.p`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 0.25rem;
`;

const ColorTags = styled.span`
  border-style: solid;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 1px;

  font-weight: 400;
  padding: 0.25rem 0.5rem;
`;
const ItineraryPoiElement = (props) => {
  useEffect(() => {}, []);
  function stringCompare(arr, str) {}
  function ErrorNotDef(elem) {
    return elem === undefined || elem === null || !elem;
  }
  return (
    <Container>
      {/* <div>{props.time}</div> */}
      <div className="flex flex-row items-center pt-3">
        <div className="bg-white w-[6rem]">
          {props.image ? (
            <ImageLoader
              dimensions={{ width: 300, height: 300 }}
              dimensionsMobile={{ width: 300, height: 300 }}
              borderRadius="8px"
              hoverpointer
              onclick={() => console.log('')}
              width="6rem"
              leftalign
              widthmobile="6rem"
              url={props.image}
            ></ImageLoader>
          ) : (
            <div className="w-[6rem]"></div>
          )}
        </div>

        <div className="pl-6">
          <div className="w-full ">
            <div className="w-full">
              <div
                className="flex flex-row w-full  justify-start items-center"
                style={{ lineHeight: '1' }}
              >
                <div className="text-xl font-normal ">{props.heading}</div>
                <HiPencil className="text-lg min-w-max pl-3"></HiPencil>
              </div>
              <div className="flex flex-row">
                <div
                  className="font-normal border-2 border-[#9F9F9F] rounded-md px-2 py-[1px] mt-1    block  bg-white text-[#9F9F9F]"
                  // onClick={() => setViewMore(!viewMore)}
                >
                  {true ? 'ATTRACTION' : 'View Less'}
                </div>
              </div>
              {props.rating && <StarRating initialRating={4}></StarRating>}

              {/* {props.poi !== undefined ? (
                props.poi.experience_filters ? (
                  <div className={`flex gap-2 flex-row`}>
                    {props.poi.experience_filters.map((element, index) =>
                      element.toString() != 'Hidden Gem' ? (
                        <div className="flex flex-row items-end">
                          {index != 0 && (
                            <span className="font-bold text-xl pr-1">.</span>
                          )}

                          <div
                            className="flex  items-center text-sm  font-bold"
                            key={index}
                          >
                            {' '}
                            {element.split(' ').length > 2
                              ? element.split(' ')[0]
                              : element}{' '}
                          </div>
                        </div>
                      ) : (
                        <div className="flex font-bold" key={index}>
                          <div
                            className="border-solid text-center flex justify-center items-center   border-2 text-sm font-bold rounded-md px-2 border-[#9C54F6]"
                            style={{ color: index % 2 ? '#9C54F6' : '#5363F5' }}
                          >
                            {element}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : null
              ) : null} */}
            </div>
          </div>

          <div className="pt-1 line-clamp-3 font-normal text-sm mb-3">
            {props.text}
          </div>
        </div>
      </div>

      {/* <div style={{display: 'flex', alignItems: 'center'}}>
                <SectionOneText>{props.time}</SectionOneText>
                <AiFillCar style={{margin: '-2px 0  0 0.5rem'}}></AiFillCar>
                {
                    props.booking ? 
                    <div style={{flexGrow: '1', justifyContent: 'flex-end', display: 'flex'}}>
                         
                        <Button
                        borderRadius="8px"
                        fontWeight="700"
                        fontSize="12px"
                        borderWidth="1.5px"
                        padding="0.5rem 0.5rem"
                        onclick={() => console.log('')}
                        >
                        View Booking
                        </Button>
                        </div>
                    : null
                }
            </div> */}
    </Container>
  );
};

export default ItineraryPoiElement;
