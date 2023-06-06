import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { AiFillCar } from 'react-icons/ai';
import ImageLoader from '../../../components/ImageLoader';
import Button from '../../../components/ui/button/Index';
import { ITINERARY_ELEMENT_TYPES } from '../../../services/constants';
import { MdOutlineFlightTakeoff } from 'react-icons/md';
import { IoMdRestaurant } from 'react-icons/io';
import FoodItem from './FoodItem';
import { isJson } from '../../../services/isJSON';
import { MdRestaurant } from 'react-icons/md';

const SectionOneText = styled.span``;

const Text = styled.div`
  overflow: hidden;
  line-height: 1.5;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 14px;
  font-weight: 500;
`;

const Line = styled.div`
  border-style: none none solid none;
  border-color: #e4e4e4;
  border-width: 1px;
`;
const ItineraryFoodElementM = (props) => {
  // let recomendation = props.recomendation
  // const  isJson = (str) => {
  //     try {
  //         JSON.parse(str);
  //     } catch (e) {
  //         return false;
  //     }
  //     return true;
  // }
  // if(isJson(recomendation)){
  //     recomendation = JSON.parse(recomendation)
  // }else{
  //     recomendation  = props.recomendation
  // }

  console.log('recomendation...' + props.recomendation);

  return (
    <>
      <div className="font-lexend">
        {/* <div style={{ display: 'flex', alignItems: 'center' }}>
          <SectionOneText>{props.time}</SectionOneText>
        </div> */}

        <div className="flex flex-col">
          <div className="flex flex-row ">
            <div className="text-center">
              <div className="grid place-items-center">
                <MdRestaurant className="text-black text-[28px] mr-4" />
              </div>

              {/* {props.icon ? (
                <div className="mr-4">
                  <ImageLoader
                    dimensions={{ width: 90, height: 90 }}
                    dimensionsMobile={{ width: 90, height: 90 }}
                    borderRadius="8px"
                    hoverpointer
                    onclick={() => console.log('')}
                    width="22px"
                    leftalign
                    widthmobile="35px"
                    url={props.icon}
                  ></ImageLoader>
                </div>
              ) : null} */}
            </div>
            <div className="font-normal text-[1.2rem]">{props.heading}</div>
          </div>

          <div className="flex ">
            <div className=" pt-2 text-sm font-[350]">{props.text}</div>
          </div>
        </div>
        {/* {props.recomendation ? (
          <>
            <Text>{props.text}</Text>
            {!isJson(props.recomendation)
              ? `${props.recomendation}`
              : JSON.parse(props.recomendation)?.map((item) => (
                  <FoodItem
                    key={item.name}
                    heading={item.name}
                    text={item.description}
                    ImageUrl={item.image}
                  ></FoodItem>
                ))}
          </>
        ) : null} */}
      </div>
    </>
  );
};

export default ItineraryFoodElementM;
