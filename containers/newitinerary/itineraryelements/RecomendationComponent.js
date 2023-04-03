import React from 'react';
import FoodItem from './FoodItem';
import { RecommendationGridContainer, Text } from './ItineraryFoodElement';
import { isJson } from '../../../services/isJSON';
import { Line } from '../../itinerary/New_Itenary_DBD/New_itenaryStyled';

const RecomendationComponent = (props) => {
  return (
    <div>
      {' '}
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
      <Line></Line>
    </div>
  );
};

export default RecomendationComponent;
