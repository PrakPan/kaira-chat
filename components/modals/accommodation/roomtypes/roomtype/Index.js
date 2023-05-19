import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ImageLoader from '../../../../ImageLoader';
import Tags from './Tags';
import { GoPrimitiveDot } from 'react-icons/go';
import { getIndianPrice } from '../../../../../services/getIndianPrice';
import Button from '../../../../ui/button/Index';
import { AiOutlinePlusSquare, AiOutlineMinusSquare } from 'react-icons/ai';
import media from '../../../../media';
import { FaBed } from 'react-icons/fa';
import Dropdown from './Dropdown';
import Details from '../../../details/Index';
import Hoverable from '../../../../HoverableAnime/hoverable';
import HoverAnimation from '../../../../HoverableAnime/hoverable';
const Container = styled.div`
  width: 100%;
`;
const NoImageContainer = styled.div`
  width: 100%;
  display: grid;
  border-radius: 5px;
  padding: 2vw;
  @media screen and (min-width: 768px) {
  }
`;
const ContentContainer = styled.div`
  padding: 0.5rem;
`;
const Name = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0 0;
  text-align: center;
`;
const AmenitiesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const Ammenity = styled.div`
  font-size: 0.65rem;
  background-color: hsl(0, 0%, 95%);
  padding: 0.25rem;
  margin: 2px;
  border-radius: 5px;
  width: max-content;
  display: inline-block;
`;
const Cost = styled.p`
  font-weight: 800;
  font-size: 1rem;
  line-height: 1;
  margin: 0 0 2px 0;

  @media screen and (min-width: 768px) {
    font-size: 1.25rem;
  }
`;
const CounterContainer = styled.div`
  background-color: #f7e700;
  border-radius: 5px;
  padding: 0.25rem 1rem;
  margin: 0.5rem 0 0 0;
  &:hover {
    cursor: pointer;
  }
`;
const RoomType = (props) => {
  const [ammenities, setAmmenities] = useState(null);
  const [showCounter, setShowCounter] = useState(false);
  const [counterValue, setCounterValue] = useState(1);
  let isPageWide = media('(min-width: 768px)');

  const _increaseCounter = () => {
    setCounterValue(counterValue + 1);
  };

  const _decreaseCounter = () => {
    if (counterValue === 1) setShowCounter(false);
    else {
      setCounterValue(counterValue - 1);
    }
  };

  useEffect(() => {
    let ammenities_arr = [];
    if (props.data.room_facilities) {
      for (var i = 0; i < props.data.room_facilities.length; i++) {
        // if(i === 5) break;
        ammenities_arr.push(
          <Ammenity className="font-lexend">
            {props.data.room_facilities[i]}
          </Ammenity>
        );
      }
      setAmmenities(ammenities_arr);
    }
  }, [props.data]);
  let image = 'media/icons/bookings/notfounds/noroom.png';
  if (props.images.length) {
    for (var i = 0; i < props.images.length; i++) {
      if (props.images[i].ImageType === '2') {
        image = props.images[i].ImageUrl;
        break;
      }
    }
  }
  if (true)
    return (
      <Container className="">
        <div className="flex flex-row gap-1 w-[16rem]">
          <div className="grid bg-[#F4F4F4] place-items-center lg:min-w-[5rem] min-w-[5rem] lg:min-h-[5rem] min-h-[5rem]  rounded-2xl">
            <FaBed
              TransportMode={props.booking_type}
              style={{
                fontSize: '1.75rem',

                color: 'black',
              }}
            />
          </div>
          <div className="flex flex-col">
            <div
              className="font-lexend font-semibold text-[14px]
          "
            >
              {/* <Hoverable height={20} width={20}> */} {props.data.room_type}
              {/* </Hoverable> */}
            </div>

            <div className="">
              {'₹' +
                getIndianPrice(Math.round(props.data.prices.min_price / 100)) +
                'per night'}
            </div>
          </div>
        </div>
      </Container>
    );
  else
    return (
      <NoImageContainer className="border-thin">
        <Name style={{ textAlign: 'left' }} className="font-lexend">
          {props.data.room_type}
        </Name>
        <AmenitiesContainer>{ammenities}</AmenitiesContainer>
      </NoImageContainer>
    );
  // else return null;
};

export default RoomType;
