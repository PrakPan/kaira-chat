import React, { useState } from 'react';
import FoodItem from './FoodItem';
import {
  RecommendationGridContainer,
  TInfoContainer,
  Text,
} from './ItineraryFoodElement';
import { isJson } from '../../../services/isJSON';
import {
  HLine,
  Line,
  Timecontainer,
} from '../../itinerary/New_Itenary_DBD/New_itenaryStyled';
import styled from 'styled-components';
import { LivelyButton } from '../../../components/LiveleyButton';

const RecomendationComponent = (props) => {
  const [viewMore, setViewMore] = useState(false);
  return props.recomendation || props.recomendation.length < 1 ? (
    <div>
      <Timecontainer>
        {/* <div style={{ width: '3.7rem' }}>{time}</div> */}
      </Timecontainer>

      <TInfoContainer>
        {/* <HLine style={{ width: '2rem' }}></HLine> */}
        {/* <Line></Line> */}

        <div className={`${!isJson(props.recomendation) ? 'pt-0' : 'pt-0'}`}>
          <div className="text-lg font-semibold pb-3">{props.heading}</div>
          {props.recomendation ? (
            <div>
              {!isJson(props.recomendation) ? (
                <div className="pt-1 line-clamp-3 font-normal text-sm">
                  {props.recomendation}
                </div>
              ) : (
                <div>
                  <RecommendationGridContainer>
                    {!viewMore
                      ? JSON.parse(props.recomendation)
                          ?.slice(0, 2)
                          ?.map((item, index) => (
                            <FoodItem
                              key={index}
                              heading={item.name}
                              text={item.description}
                              ImageUrl={item.image}
                            ></FoodItem>
                          ))
                      : JSON.parse(props.recomendation)?.map((item, index) => (
                          <FoodItem
                            key={index}
                            heading={item.name}
                            text={item.description}
                            ImageUrl={item.image}
                          ></FoodItem>
                        ))}
                  </RecommendationGridContainer>
                  <LivelyButton
                    className="font-bold border-2 border-black rounded-md px-3 py-1 mt-2  m-auto block  bg-white text-black"
                    onClick={() => setViewMore(!viewMore)}
                  >
                    {!viewMore ? 'viewMore' : 'viewLess'}
                  </LivelyButton>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </TInfoContainer>
    </div>
  ) : null;
};

export default RecomendationComponent;
