import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { AiFillCar } from 'react-icons/ai';
import ImageLoader from '../../../components/ImageLoader';
import Button from '../../../components/ui/button/Index';
import { ITINERARY_ELEMENT_TYPES } from '../../../services/constants';
import { MdOutlineFlightTakeoff } from 'react-icons/md';
import { IoMdRestaurant } from 'react-icons/io';
import { HLine } from '../../itinerary/New_Itenary_DBD/New_itenaryStyled';
import FoodItem from './FoodItem';
import { isJson } from '../../../services/isJSON';

const padding = {
  initialLeft: '100px',
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

const SectionOneText = styled.span``;
const GridContainer = styled.div`
  display: grid;
  margin-top: 1rem;
  grid-template-columns: 1fr 5fr;
  grid-column-gap: 0.5rem;
`;
export const Text = styled.p`
  margin: 0.75rem 0;
  overflow: hidden;
  line-height: 1.5;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 14px;
`;
const Heading = styled.p`
  margin: 0;
  font-weight: 500;
  line-height: 1;
`;
const Line = styled.div`
  border-style: none none solid none;
  border-color: #e4e4e4;
  border-width: 1px;
`;
export const RecommendationGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 27px;
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
const ItineraryFoodElement = (props) => {
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
      <Container
        className="font-poppins"
        style={{ fontSize: '14px', fontWeight: '500' }}
      >
        <div>{props.time}</div>
        <TInfoContainer>
          <HLine style={{ width: '2rem' }}>
            <div style={{ marginLeft: '-10px' }}>
              <ImageLoader
                url={props.icon}
                leftalign
                dimensions={{ width: 200, height: 200 }}
                width="1.25rem"
                widthmobile="1.25rem"
              ></ImageLoader>
            </div>
          </HLine>
          <div>
            <GridContainer>
              <div className="text-center">
                <IoMdRestaurant
                  style={{ fontSize: '2rem', textAlign: 'center' }}
                ></IoMdRestaurant>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Heading>{props.heading}</Heading>
              </div>
            </GridContainer>
            {props.recomendation ? (
              <>
                <Text>{props.text}</Text>
                {!isJson(props.recomendation) ? (
                  `${props.recomendation}`
                ) : (
                  <RecommendationGridContainer>
                    {JSON.parse(props.recomendation)?.map((item) => (
                      <FoodItem
                        heading={item.name}
                        text={item.description}
                        ImageUrl={item.image}
                      ></FoodItem>
                    ))}
                  </RecommendationGridContainer>
                )}
              </>
            ) : null}
          </div>
        </TInfoContainer>
      </Container>
    </>
  );
};

export default ItineraryFoodElement;
